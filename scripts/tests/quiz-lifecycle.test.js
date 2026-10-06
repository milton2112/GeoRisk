import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const quiz = source.slice(source.indexOf("function clearQuizTimer("), source.indexOf("function setupRankingsPanel("));
const hub = source.slice(source.indexOf("function setupQuizHubPanel("), source.indexOf("function setupCompareHubPanel("));

function fixture() {
  const intervals = new Map(), callbacks = [], writes = [], requests = [], builds = [], renders = [];
  const documentEvents = new Map();
  let intervalId = 0;
  function element(value = "") {
    const listeners = new Map();
    return { value, open: false, hidden: false, listeners,
      addEventListener(name, callback) { listeners.set(name, callback); },
      fire(name, event = {}) { return listeners.get(name)?.(event); } };
  }
  const elements = Object.fromEntries([
    "quiz-hub-panel", "quiz-start-button", "quiz-next-button", "quiz-reset-button", "quiz-category",
    "quiz-difficulty", "quiz-mode", "quiz-export-button", "quiz-options", "quiz-status", "quiz-question"
  ].map(id => [id, element()]));
  elements["quiz-category"].value = "capital";
  elements["quiz-difficulty"].value = "easy";
  elements["quiz-mode"].value = "timed";
  const document = { visibilityState: "visible", getElementById: id => elements[id] || null,
    querySelectorAll: () => [], addEventListener(name, callback) { documentEvents.set(name, callback); } };
  const context = vm.createContext({
    document, quizStartToken: 0, currentLanguage: "es", quizQuestionBank: [],
    quizState: { bestStreak: 4, mode: "classic", asked: [], current: null, score: 0, total: 0, timerId: null },
    quizUi: { renderPanel({ quizState }) { renders.push(quizState); return true; }, renderMeta() { return true; } },
    readLocalPreference: () => "3", writeLocalPreference: (...args) => writes.push(args),
    normalizeText: value => String(value).toLowerCase(), escapeHtml: value => value,
    closeMobilePanels() {}, shareText() {},
    ensureDeferredUiModule(name) { requests.push(name); return Promise.resolve(true); },
    setInterval(callback, ms) {
      assert.equal(ms, 1000);
      const id = ++intervalId;
      intervals.set(id, callback); callbacks.push(callback); return id;
    },
    clearInterval(id) { intervals.delete(id); }
  });
  vm.runInContext(quiz + hub, context);
  context.buildQuizQuestion = category => {
    builds.push(category);
    return { code: "ARG", prompt: "Capital?", correct: "Buenos Aires", answered: false, options: [] };
  };
  context.setupQuizControls();
  context.setupQuizHubPanel();
  elements["quiz-hub-panel"].open = true;
  return { context, elements, document, intervals, callbacks, writes, requests, builds, renders,
    start: () => context.startQuiz(),
    toggle(open) { elements["quiz-hub-panel"].open = open; elements["quiz-hub-panel"].fire("toggle"); },
    visibility(value) { document.visibilityState = value; documentEvents.get("visibilitychange")?.(); },
    tick() { for (const callback of [...intervals.values()]) callback(); } };
}

const test = fixture();
await test.start();
assert.equal(test.intervals.size, 1);
const staleTick = test.callbacks[0];
await test.start();
assert.equal(test.intervals.size, 1, "restarting a timed round must clear the previous interval before replacing its state");
const remaining = test.context.quizState.timeLeft;
staleTick();
assert.equal(test.context.quizState.timeLeft, remaining, "a queued tick from an old round cannot decrement a new round");
test.tick();
assert.equal(test.context.quizState.timeLeft, remaining - 1);
const current = test.context.quizState.current;
const activeTick = test.callbacks.at(-1);
test.toggle(false);
assert.equal(test.intervals.size, 0, "closed quiz panels must not keep a countdown running");
assert.equal(test.context.quizState.current, current);
const paused = test.context.quizState.timeLeft;
test.toggle(true);
assert.equal(test.intervals.size, 1);
assert.equal(test.context.quizState.timeLeft, paused, "reopening resumes the remaining time, not a new budget");
activeTick();
assert.equal(test.context.quizState.timeLeft, paused, "a queued tick from before pausing cannot affect its resumed timer");
const visibleTick = test.callbacks.at(-1);
test.visibility("hidden");
assert.equal(test.intervals.size, 0, "hidden documents stop the quiz interval");
visibleTick();
assert.equal(test.context.quizState.timeLeft, paused);
test.visibility("visible");
assert.equal(test.intervals.size, 1);
assert.equal(test.context.quizState.timeLeft, paused);
test.elements["quiz-mode"].value = "classic";
test.elements["quiz-mode"].fire("change");
assert.equal(test.intervals.size, 0, "leaving timed mode clears its countdown");
assert.equal(test.context.quizState.timeLeft, 0);
test.elements["quiz-mode"].value = "timed";
test.elements["quiz-mode"].fire("change");
assert.equal(test.intervals.size, 1, "an explicit timed-mode selection can start the current unanswered question");
test.context.answerQuiz("Buenos Aires");
assert.equal(test.intervals.size, 0);
assert.equal(test.context.quizState.total, 1);
assert.equal(test.context.quizState.score, 1);
assert.equal(test.context.quizState.current.selectedAnswer, "Buenos Aires");
test.toggle(false);
test.toggle(true);
test.visibility("hidden");
test.visibility("visible");
assert.equal(test.intervals.size, 0, "answered questions do not resume timers");
test.context.nextQuizQuestion();
assert.equal(test.intervals.size, 1);
test.elements["quiz-reset-button"].fire("click");
assert.equal(test.intervals.size, 0);
assert.equal(test.context.quizState.current, null);

for (const cancel of [
  test => test.elements["quiz-reset-button"].fire("click"),
  test => test.elements["quiz-category"].fire("change"),
  test => test.elements["quiz-difficulty"].fire("change"),
  test => test.elements["quiz-mode"].fire("change"),
  test => { test.toggle(false); test.toggle(true); },
  test => { test.visibility("hidden"); test.visibility("visible"); }
]) {
  const pending = fixture();
  let release;
  const held = new Promise(resolve => { release = resolve; });
  pending.context.ensureDeferredUiModule = () => held;
  const first = pending.start();
  cancel(pending);
  release(true);
  assert.equal(await first, false, "reset, settings, close/reopen and hide/show cancel a pending start");
  assert.equal(pending.builds.length, 0);
  assert.equal(pending.intervals.size, 0);
}

const concurrent = fixture();
let release;
const held = new Promise(resolve => { release = resolve; });
concurrent.context.ensureDeferredUiModule = () => held;
const oldStart = concurrent.start();
const latestStart = concurrent.start();
release(true);
assert.equal(await oldStart, false);
assert.equal(await latestStart, true);
assert.equal(concurrent.builds.length, 1, "only the latest pending start builds a question");
assert.equal(concurrent.intervals.size, 1);
concurrent.context.clearQuizTimer();

const failure = fixture();
await failure.start();
const savedState = failure.context.quizState;
failure.context.ensureDeferredUiModule = async () => false;
assert.equal(await failure.start(), false);
assert.equal(failure.context.quizState, savedState, "a module failure preserves the existing round and score");
assert.equal(failure.intervals.size, 1);
failure.context.clearQuizTimer();
failure.context.buildQuizQuestion = () => null;
failure.context.nextQuizQuestion();
assert.equal(failure.intervals.size, 0, "no question means no timed work");
assert.equal(failure.context.quizState.timeLeft, 0);

const inactive = fixture();
inactive.toggle(false);
assert.equal(await inactive.start(), false);
assert.equal(inactive.requests.length, 0, "an inactive start cannot download a module");
inactive.context.nextQuizQuestion();
assert.equal(inactive.builds.length, 0);
inactive.toggle(true);
inactive.visibility("hidden");
const requestsBefore = inactive.requests.length;
assert.equal(await inactive.start(), false);
assert.equal(inactive.requests.length, requestsBefore);

const timeout = fixture();
await timeout.start();
for (let tick = 0; tick < 25; tick++) timeout.tick();
assert.equal(timeout.context.quizState.total, 1);
assert.equal(timeout.context.quizState.score, 0);
assert.equal(timeout.context.quizState.current.answered, true);
assert.equal(timeout.intervals.size, 0, "an expired question records exactly one mistake and stops");
for (const callback of timeout.callbacks) callback();
assert.equal(timeout.context.quizState.total, 1);
assert.equal(timeout.context.quizState.current.selectedAnswer, "__timeout__");

for (const [difficulty, seconds] of [["easy", 25], ["medium", 18], ["hard", 12]]) {
  const timed = fixture();
  timed.elements["quiz-difficulty"].value = difficulty;
  await timed.start();
  assert.equal(timed.context.quizState.timeLeft, seconds);
  timed.context.clearQuizTimer();
}
for (const mode of ["classic", "practice", "exam", "teacher"]) {
  const untimed = fixture();
  untimed.elements["quiz-mode"].value = mode;
  await untimed.start();
  assert.equal(untimed.context.quizState.timeLeft, 0);
  assert.equal(untimed.intervals.size, 0, "only timed mode allocates a countdown");
}

console.log("quiz-lifecycle.test.js ok: one owned countdown, close/visibility pause, stale starts/ticks and explicit recovery");
