import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../app-boot-scheduler.js", import.meta.url), "utf8");
const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const interactions = await fs.readFile(new URL("../../app-map-interactions.js", import.meta.url), "utf8");
function harness({ idleSupported = true } = {}) {
  let now = 0;
  let nextId = 0;
  const timers = new Map();
  const idle = new Map();
  const listeners = new Set();
  const errors = [];
  const state = {
    window: {}, console: { warn: (...args) => errors.push(args) },
    Date: { now: () => now }, quiet: false,
    document: {
      visibilityState: "visible",
      body: { classList: { contains: () => false } },
      addEventListener(type, fn) { assert.equal(type, "visibilitychange"); listeners.add(fn); },
      removeEventListener(type, fn) { assert.equal(type, "visibilitychange"); listeners.delete(fn); }
    },
    setTimeout(fn, delay) { const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  if (idleSupported) {
    state.window.requestIdleCallback = (fn, options) => { const id = ++nextId; idle.set(id, { fn, options }); return id; };
    state.window.cancelIdleCallback = id => idle.delete(id);
  }
  vm.createContext(state);
  vm.runInContext(source, state);
  vm.runInContext(interactions, state);
  state.autoRotation = state.window.GeoRiskMapInteractions.createAutoRotationController();
  const api = state.window.GeoRiskBootScheduler;
  const advance = ms => {
    const until = now + ms;
    let count = 0;
    while (true) {
      const next = [...timers].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      assert.ok(++count < 1000, "no busy-loop timers");
      now = next[1].at;
      timers.delete(next[0]);
      next[1].fn();
    }
    now = until;
  };
  const deliverIdle = () => {
    for (const [id, entry] of [...idle]) {
      idle.delete(id);
      entry.fn({ didTimeout: true, timeRemaining: () => 0 });
    }
  };
  const visibility = value => {
    state.document.visibilityState = value;
    for (const listener of [...listeners]) listener({ type: "visibilitychange" });
  };
  return { state, api, timers, idle, listeners, errors, advance, deliverIdle, visibility };
}

for (const idleSupported of [true, false]) {
  const h = harness({ idleSupported });
  let calls = 0;
  h.api.scheduleWhenQuiet(() => { calls += 1; }, {
    delay: 100, timeout: 200, quietFor: 50, isQuiet: () => h.state.quiet
  });
  h.advance(500);
  h.deliverIdle();
  assert.equal(calls, 0, "el deadline no autoriza trabajo mientras el usuario navega");
  h.state.quiet = true;
  h.advance(100);
  h.deliverIdle();
  assert.equal(calls, 1, "la tarea pendiente corre cuando hay quietud real");
  h.advance(500);
  h.deliverIdle();
  assert.equal(calls, 1);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
}

{
  const h = harness();
  let calls = 0;
  h.state.quiet = true;
  h.api.scheduleWhenQuiet(() => { calls += 1; }, { delay: 100, timeout: 100, isQuiet: () => h.state.quiet });
  h.visibility("hidden");
  h.advance(20000);
  h.deliverIdle();
  assert.equal(calls, 0, "una pestana oculta no ejecuta trabajo opcional vencido");
  assert.equal(h.timers.size, 0, "no se sondea una pestana oculta");
  h.visibility("visible");
  h.advance(0);
  h.deliverIdle();
  assert.equal(calls, 0, "volver a la pestana no dispara trabajo pendiente en el primer frame");
  h.advance(4500);
  h.deliverIdle();
  assert.equal(calls, 1);
  assert.equal(h.listeners.size, 0);
}

{
  const h = harness();
  let calls = 0;
  h.state.quiet = true;
  const cancel = h.api.scheduleWhenQuiet(() => { calls += 1; }, { delay: 100, quietFor: 50, isQuiet: () => h.state.quiet });
  h.advance(100);
  assert.equal(h.idle.size, 1);
  h.state.quiet = false;
  h.deliverIdle();
  assert.equal(calls, 0, "un idle callback vencido vuelve a comprobar el arrastre");
  h.state.quiet = true;
  h.advance(100);
  assert.equal(h.idle.size, 1);
  const staleIdle = [...h.idle.values()][0].fn;
  h.visibility("hidden");
  staleIdle();
  assert.equal(calls, 0, "callbacks cancelados o tardios no ejecutan la tarea");
  h.visibility("visible");
  h.advance(0);
  cancel();
  cancel();
  h.deliverIdle();
  assert.equal(calls, 0);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
  assert.equal(h.idle.size, 0);
}

{
  const h = harness();
  let calls = 0;
  h.state.quiet = true;
  h.api.scheduleWhenQuiet(() => { calls += 1; }, { delay: 500, quietFor: 100 });
  h.visibility("hidden");
  h.advance(100);
  h.visibility("visible");
  h.advance(399);
  h.deliverIdle();
  assert.equal(calls, 0, "volver a la pestana no saltea el delay inicial");
  h.advance(1);
  h.deliverIdle();
  assert.equal(calls, 1);
}

for (const task of [() => { throw new Error("sync"); }, async () => { throw new Error("async"); }]) {
  const h = harness();
  h.api.scheduleWhenQuiet(task);
  h.advance(0);
  h.deliverIdle();
  for (let i = 0; i < 8; i += 1) await Promise.resolve();
  assert.equal(h.errors.length, 1, "errores opcionales no generan rechazos sin gestionar");
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
}

{
  const h = harness();
  h.state.bootScheduler = h.api;
  h.state.isMobileLayout = () => true;
  h.state.isCameraNavigating = false;
  h.state.lastInteractionAt = 0;
  let loading = true;
  h.state.document.body.classList.contains = () => loading;
  const start = script.indexOf("function scheduleWhenGlobeIsQuiet");
  vm.runInContext(script.slice(start, script.indexOf("function compactNumber", start)), h.state);
  let calls = 0;
  h.state.scheduleWhenGlobeIsQuiet(() => { calls += 1; }, { quietFor: 100, timeout: 100 });
  h.advance(500);
  h.deliverIdle();
  assert.equal(calls, 0, "mejoras opcionales no compiten con controles aun cargando");
  loading = false;
  h.advance(200);
  h.deliverIdle();
  assert.equal(calls, 1);
  h.state.bootScheduler = {};
  h.state.scheduleWhenGlobeIsQuiet(() => { calls += 1; });
  h.advance(20000);
  assert.equal(calls, 1, "la ausencia del scheduler no fuerza trabajo sin guardas");
}

for (const idleSupported of [true, false]) {
  const h = harness({ idleSupported });
  Object.assign(h.state, {
    bootScheduler: h.api, isMobileLayout: () => false,
    isCameraNavigating: false, lastInteractionAt: 0
  });
  const start = script.indexOf("function scheduleWhenGlobeIsQuiet");
  vm.runInContext(script.slice(start, script.indexOf("function compactNumber", start)), h.state);
  let calls = 0;
  h.state.autoRotation.pointerDown(1);
  h.state.autoRotation.pointerDown(2);
  h.state.scheduleWhenGlobeIsQuiet(() => { calls += 1; }, { quietFor: 100, timeout: 100 });
  h.advance(2000);
  h.deliverIdle();
  assert.equal(calls, 0, "una camara detenida no libera trabajo mientras el usuario mantiene el contacto");
  h.state.autoRotation.pointerUp(1);
  h.advance(1000);
  h.deliverIdle();
  assert.equal(calls, 0, "el segundo contacto sigue bloqueando el trabajo opcional");
  h.state.autoRotation.pointerUp(2);
  h.state.lastInteractionAt = h.state.Date.now();
  h.advance(99);
  h.deliverIdle();
  assert.equal(calls, 0, "soltar el mapa conserva la espera de quietud");
  h.advance(101);
  h.deliverIdle();
  assert.equal(calls, 1);
  h.advance(1000);
  h.deliverIdle();
  assert.equal(calls, 1);
}

console.log("boot-scheduler.test.js ok");
