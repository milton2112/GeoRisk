(() => {
  function createCountryStyleCache({ maxEntries = 1600 } = {}) {
    const cache = new Map();
    return {
      clear() {
        cache.clear();
      },
      get(key) {
        return cache.get(key);
      },
      set(key, value) {
        cache.set(key, value);
        while (cache.size > maxEntries) {
          const firstKey = cache.keys().next().value;
          if (!firstKey) {
            break;
          }
          cache.delete(firstKey);
        }
        return value;
      },
      size() {
        return cache.size;
      }
    };
  }

  function createStyleCacheKey({ code, theme, mode, overlayBucket, dataRevision = 0 } = {}) {
    return [code || "", theme || "default", mode || "3d", overlayBucket || "mid", dataRevision].join("::");
  }

  function shouldRefreshStyles(previousSignature, nextSignature) {
    return previousSignature !== nextSignature;
  }

  function adaptStyleForMode(style, { mode = "3d", defaultStyle = {}, isMobile = false } = {}) {
    if (mode !== "2d") {
      return style;
    }
    return {
      ...style,
      weight: Math.max(isMobile ? 1 : 1.2, (style.weight || defaultStyle.weight || 1.4) - (isMobile ? 0.35 : 0.25)),
      fillOpacity: Math.max(0.05, (style.fillOpacity || defaultStyle.fillOpacity || 0.1) - (isMobile ? 0.1 : 0.08))
    };
  }

  window.GeoRiskMapStyles = {
    adaptStyleForMode,
    createCountryStyleCache,
    createStyleCacheKey,
    shouldRefreshStyles
  };
})();
