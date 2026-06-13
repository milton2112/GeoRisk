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

  window.GeoRiskStore = {
    createStore,
    store,
    selectUiState
  };
})();
