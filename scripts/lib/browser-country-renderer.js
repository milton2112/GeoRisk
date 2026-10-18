// Serialized into isolated storage-test pages; never loaded by the application.
export function installCountryRendererObserver() {
  const instrument = api => {
    const wait = api?.waitForDataSourceFrame;
    if (typeof wait !== "function") return;
    const pending = new WeakMap();
    api.waitForDataSourceFrame = options => {
      const { viewer, source } = options;
      const display = viewer?.dataSourceDisplay;
      const scene = viewer?.scene;
      if (typeof display?.update !== "function" || typeof scene?.postRender?.addEventListener !== "function" ||
          typeof viewer.dataSources?.get !== "function" || typeof viewer.dataSources?.contains !== "function") return wait(options);
      const active = pending.get(display);
      if (active) return active.source === source ? active.promise : wait(options);
      const state = { status: "waiting", frames: 0, updates: 0, readyUpdates: 0, lastReady: null, visualizers: [] };
      window.__countryRendererProbe = state;
      const dispose = [];
      const track = (target, record) => {
        if (typeof target?.update !== "function") return;
        const update = target.update;
        const own = Object.hasOwn(target, "update");
        const observed = function (...args) {
          const ready = update.apply(this, args);
          record.updates++;
          record.lastReady = ready === true;
          if (ready === true) record.readyUpdates++;
          return ready;
        };
        target.update = observed;
        dispose.push(() => {
          if (target.update !== observed) return;
          if (own) target.update = update;
          else delete target.update;
        });
      };
      track(display, state);
      const sources = [display.defaultDataSource];
      for (let i = 0; i < Math.min(viewer.dataSources.length, 8); i++) sources.push(viewer.dataSources.get(i));
      for (const item of sources) {
        for (const visualizer of (item?._visualizers || []).slice(0, 32 - state.visualizers.length)) {
          const record = { source: item === source ? "countries" : item === display.defaultDataSource ? "default" : "other",
            index: state.visualizers.length, type: String(visualizer.constructor.name).slice(0, 48),
            updates: 0, readyUpdates: 0, lastReady: null };
          state.visualizers.push(record);
          track(visualizer, record);
        }
      }
      dispose.push(scene.postRender.addEventListener(() => state.frames++));
      const finish = error => {
        pending.delete(display);
        state.status = error ? "failed" : "passed";
        if (error) state.error = String(error.message || error).slice(0, 1000);
        state.renderLoop = viewer.useDefaultRenderLoop;
        state.displayReady = display.ready;
        state.sourceShown = source?.show;
        state.sourceAttached = viewer.dataSources.contains(source);
        for (const remove of dispose.reverse()) remove();
      };
      try {
        const promise = wait(options).then(value => { finish(); return value; }, error => { finish(error); throw error; });
        pending.set(display, { source, promise });
        return promise;
      } catch (error) {
        finish(error);
        throw error;
      }
    };
  };
  if (window.GeoRiskMap) instrument(window.GeoRiskMap);
  else Object.defineProperty(window, "GeoRiskMap", { configurable: true, set(api) {
    Object.defineProperty(window, "GeoRiskMap", { value: api, configurable: true, writable: true });
    instrument(api);
  } });
}
