(() => {
  function createStore(initialState = {}) {
    let state = { ...initialState };
    const listeners = new Set();

    function getState() {
      return state;
    }

    function setState(patch = {}, action = "update") {
      const next = typeof patch === "function" ? patch(state) : patch;
      state = { ...state, ...next, lastAction: action };
      listeners.forEach(listener => listener(state, action));
      return state;
    }

    function subscribe(listener) {
      if (typeof listener !== "function") {
        return () => {};
      }
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    return { getState, setState, subscribe };
  }

  const store = createStore({
    appMode: "default",
    mapMode: "3d",
    theme: "default",
    language: "es",
    selectedCode: "",
    activeHub: "",
    modalStack: [],
    offlineState: "preparing",
    lastAction: "init"
  });

  function selectUiState() {
    const state = store.getState();
    return {
      appMode: state.appMode,
      mapMode: state.mapMode,
      theme: state.theme,
      language: state.language,
      activeHub: state.activeHub,
      selectedCode: state.selectedCode
    };
  }

  function readPreferences(readItem, keys, themes = []) {
    const text = (value, limit = 200) => typeof value === "string" ? value.trim().slice(0, limit) : "";
    const record = value => value !== null && typeof value === "object" && !Array.isArray(value);
    const choice = (value, options, fallback) => options.includes(value) ? value : fallback;
    const modes = ["default", "analysis", "encyclopedia", "presentation"];
    const read = key => {
      try { return readItem(key); } catch { return null; }
    };
    const list = (key, normalize, limit) => {
      try {
        const raw = read(key);
        if (typeof raw !== "string" || raw.length > 131072) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.slice(0, 100).map(normalize).filter(Boolean).slice(0, limit) : [];
      } catch { return []; }
    };
    const filters = value => {
      const result = {};
      if (!record(value)) return result;
      for (const key of ["continent", "religion", "system", "organization", "historyType", "origin", "rival"]) {
        result[key] = text(value[key]);
      }
      const population = typeof value.minPopulation === "number" || typeof value.minPopulation === "string"
        ? Number(value.minPopulation) : NaN;
      result.minPopulation = Number.isFinite(population) && population >= 0 && population <= 1e10 ? population : 0;
      return result;
    };
    const named = value => record(value) && text(value.name);
    const view = value => named(value) ? {
      name: text(value.name),
      savedAt: text(value.savedAt, 40),
      theme: choice(value.theme, themes, "default"),
      appMode: choice(value.appMode, modes, "default"),
      mapMode: choice(value.mapMode, ["2d", "3d"], "3d"),
      selectedCode: typeof value.selectedCode === "string" && /^[A-Z]{3}$/.test(value.selectedCode) ? value.selectedCode : "",
      filters: filters(value.filters)
    } : null;
    // Each key is independent: a broken history must not discard valid favorites.
    return {
      language: choice(read(keys.language), ["es", "en"], "es"),
      appMode: choice(read(keys.appMode), modes, read(keys.presentation) === "true" ? "presentation" : "default"),
      savedFilters: list(keys.filters, value => named(value) ? { name: text(value.name), filters: filters(value.filters) } : null, 8),
      savedViews: list(keys.views, view, 10),
      favoriteViews: list(keys.favorites, view, 8),
      searchHistory: list(keys.searchHistory, value => text(value), 10),
      savedSearches: list(keys.savedSearches, value => text(value), 12)
    };
  }

  window.GeoRiskStore = {
    createStore,
    readPreferences,
    store,
    selectUiState
  };
})();
