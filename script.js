const fallbackGetDeviceProfile = ({ isMobile, currentMapMode, deviceMemory = 4, hardwareConcurrency = 4 }) => {
  const constrained = isMobile || deviceMemory <= 4 || hardwareConcurrency <= 4;
  const mode2d = currentMapMode === "2d";

  if (constrained) {
    return {
      constrained: true,
      targetFrameRate: mode2d ? (isMobile ? 18 : 26) : (isMobile ? 18 : 24),
      resolutionScale: mode2d ? (isMobile ? 0.48 : 0.66) : (isMobile ? 0.72 : 0.84),
      maximumScreenSpaceError: mode2d ? (isMobile ? 10.4 : 6.8) : (isMobile ? 6.2 : 3.6),
      tileCacheSize: mode2d ? (isMobile ? 28 : 82) : (isMobile ? 76 : 170),
      loadingDescendantLimit: mode2d ? (isMobile ? 3 : 7) : (isMobile ? 8 : 14),
      enableFxaa: false,
      preloadAncestors: false,
      preloadSiblings: false
    };
  }

  return {
    constrained: false,
    targetFrameRate: mode2d ? 32 : 32,
    resolutionScale: mode2d ? 0.72 : 0.96,
    maximumScreenSpaceError: mode2d ? 5.4 : 2.6,
    tileCacheSize: mode2d ? 108 : 220,
    loadingDescendantLimit: mode2d ? 8 : 18,
    enableFxaa: true,
    preloadAncestors: true,
    preloadSiblings: true
  };
};

const fallbackGetRenderProfileText = ({ language = "es", isMobile, currentMapMode, resolutionScale }) => {
  if (isMobile) {
    return language === "en"
      ? `Mobile ${currentMapMode.toUpperCase()} - optimized`
      : `Mobile ${currentMapMode.toUpperCase()} - optimizado`;
  }

  if (resolutionScale >= 0.9) {
    return language === "en"
      ? `${currentMapMode.toUpperCase()} - high quality`
      : `${currentMapMode.toUpperCase()} - alta calidad`;
  }

  if (resolutionScale >= 0.72) {
    return language === "en"
      ? `${currentMapMode.toUpperCase()} - balanced`
      : `${currentMapMode.toUpperCase()} - balanceado`;
  }

  return language === "en"
    ? `${currentMapMode.toUpperCase()} - performance`
    : `${currentMapMode.toUpperCase()} - rendimiento`;
};

const {
  getDeviceProfile: runtimeGetDeviceProfile = fallbackGetDeviceProfile,
  getRenderProfileText: runtimeGetRenderProfileText = fallbackGetRenderProfileText
} = window.GeoRiskRuntime || {};
let {
  EXTRA_CONFLICT_DETAIL_OVERRIDES: curatedConflictDetailOverrides = {},
  EXTRA_CURATED_TIMELINE_EXTRAS: curatedTimelineExtras = {},
  EXTRA_TIMELINE_DETAIL_OVERRIDES: curatedTimelineDetailOverrides = {},
  COUNTRY_CURATION_OVERRIDES: curatedCountryOverrides = {}
} = window.GeoRiskCuration || {};
let newsUi = window.GeoRiskNewsUI || {};
let compareUi = window.GeoRiskCompareUI || {};
let quizUi = window.GeoRiskQuizUI || {};
let riskRadarUi = window.GeoRiskRiskRadarUi || {};
let conflictAuditUi = window.GeoRiskConflictAuditUi || {};
let projectAuditUi = window.GeoRiskProjectAuditUi || {};
let countryPanelUi = window.GeoRiskCountryPanel || {};
let timelineConflictUi = window.GeoRiskTimelineConflicts || {};
let searchCore = window.GeoRiskSearch || {};
let rankingsCore = window.GeoRiskRankings || {};
let textUi = window.GeoRiskText || {};
let helpUi = window.GeoRiskHelpUi || {};
let exportShareUi = window.GeoRiskExportShare || {};
const sharedTheme = window.GeoRiskTheme || {};
const bootScheduler = window.GeoRiskBootScheduler || {};
const mapCore = window.GeoRiskMap || {};
const mapStyleCore = window.GeoRiskMapStyles || {};
const mapInteractionCore = window.GeoRiskMapInteractions || {};
const appStore = window.GeoRiskStore?.store || null;
let uiPolish = window.GeoRiskUiPolish || {};
const APP_VERSION = "2026-07-13-release-7";
window.GeoRiskAppVersion = APP_VERSION;
function createFallbackCache() {
  return { isFallback: true, get(key, revision, build) { return build(); }, invalidate() {}, size() { return 0; } };
}

function createFallbackSearchCache() {
  return { isFallback: true, get() {}, set(key, value) { return value; }, clear() {}, size() { return 0; } };
}

const DEFERRED_UI_MODULES = {
  news: `./app-news-ui.js?v=${APP_VERSION}`,
  compare: `./app-compare-ui.js?v=${APP_VERSION}`,
  quiz: `./app-quiz-ui.js?v=${APP_VERSION}`,
  riskRadar: `./app-risk-radar-ui.js?v=${APP_VERSION}`,
  conflictAudit: `./app-conflict-audit-ui.js?v=${APP_VERSION}`,
  projectAudit: `./app-project-audit-ui.js?v=${APP_VERSION}`,
  help: `./app-help-ui.js?v=${APP_VERSION}`,
  uiPolish: `./app-ui-polish.js?v=${APP_VERSION}`,
  countryPanel: `./app-country-panel.js?v=${APP_VERSION}`,
  timelineConflicts: `./app-timeline-conflicts.js?v=${APP_VERSION}`,
  search: `./app-search.js?v=${APP_VERSION}`,
  rankings: `./app-rankings.js?v=${APP_VERSION}`,
  text: `./app-text.js?v=${APP_VERSION}`,
  exportShare: `./app-export-share.js?v=${APP_VERSION}`
};
const deferredUiModulePromises = new Map();

function refreshDeferredUiGlobals() {
  newsUi = window.GeoRiskNewsUI || newsUi || {};
  compareUi = window.GeoRiskCompareUI || compareUi || {};
  quizUi = window.GeoRiskQuizUI || quizUi || {};
  riskRadarUi = window.GeoRiskRiskRadarUi || riskRadarUi || {};
  conflictAuditUi = window.GeoRiskConflictAuditUi || conflictAuditUi || {};
  projectAuditUi = window.GeoRiskProjectAuditUi || projectAuditUi || {};
  helpUi = window.GeoRiskHelpUi || helpUi || {};
  uiPolish = window.GeoRiskUiPolish || uiPolish || {};
  countryPanelUi = window.GeoRiskCountryPanel || countryPanelUi || {};
  timelineConflictUi = window.GeoRiskTimelineConflicts || timelineConflictUi || {};
  searchCore = window.GeoRiskSearch || searchCore || {};
  rankingsCore = window.GeoRiskRankings || rankingsCore || {};
  textUi = window.GeoRiskText || textUi || {};
  exportShareUi = window.GeoRiskExportShare || exportShareUi || {};
  if (advancedRankingCache?.isFallback && typeof rankingsCore.createRankingsCache === "function") {
    advancedRankingCache = rankingsCore.createRankingsCache();
  }
  if (searchResultCache?.isFallback && typeof searchCore.createRecentSearchCache === "function") {
    searchResultCache = searchCore.createRecentSearchCache(18);
  }
}

async function ensureDeferredUiModule(moduleName) {
  const moduleUrl = DEFERRED_UI_MODULES[moduleName];
  if (!moduleUrl) {
    return;
  }

  if (!deferredUiModulePromises.has(moduleName)) {
    deferredUiModulePromises.set(
      moduleName,
      import(moduleUrl)
        .catch(error => {
          console.warn(`No se pudo cargar modulo diferido ${moduleName}:`, error);
        })
        .finally(refreshDeferredUiGlobals)
    );
  }

  await deferredUiModulePromises.get(moduleName);
}

const QUALITY_PRESET_OVERRIDES = {
  auto: null,
  high: {
    targetFrameRate: 34,
    resolutionScale: { "3d": { desktop: 1.18, mobile: 0.92 }, "2d": { desktop: 0.94, mobile: 0.62 } },
    maximumScreenSpaceError: { "3d": { desktop: 1.45, mobile: 3.2 }, "2d": { desktop: 3.4, mobile: 7.4 } },
    tileCacheSize: { "3d": { desktop: 360, mobile: 160 }, "2d": { desktop: 160, mobile: 54 } },
    loadingDescendantLimit: { "3d": { desktop: 28, mobile: 14 }, "2d": { desktop: 10, mobile: 4 } },
    enableFxaa: true,
    preloadAncestors: true,
    preloadSiblings: true
  },
  balanced: {
    targetFrameRate: 30,
    resolutionScale: { "3d": { desktop: 1.04, mobile: 0.84 }, "2d": { desktop: 0.82, mobile: 0.56 } },
    maximumScreenSpaceError: { "3d": { desktop: 2.05, mobile: 4.5 }, "2d": { desktop: 4.6, mobile: 8.8 } },
    tileCacheSize: { "3d": { desktop: 260, mobile: 120 }, "2d": { desktop: 124, mobile: 42 } },
    loadingDescendantLimit: { "3d": { desktop: 20, mobile: 10 }, "2d": { desktop: 8, mobile: 3 } },
    enableFxaa: true,
    preloadAncestors: true,
    preloadSiblings: true
  },
  performance: {
    targetFrameRate: 26,
    resolutionScale: { "3d": { desktop: 0.9, mobile: 0.7 }, "2d": { desktop: 0.64, mobile: 0.44 } },
    maximumScreenSpaceError: { "3d": { desktop: 3.1, mobile: 6.2 }, "2d": { desktop: 6.5, mobile: 10.5 } },
    tileCacheSize: { "3d": { desktop: 180, mobile: 84 }, "2d": { desktop: 84, mobile: 30 } },
    loadingDescendantLimit: { "3d": { desktop: 12, mobile: 6 }, "2d": { desktop: 5, mobile: 2 } },
    enableFxaa: false,
    preloadAncestors: false,
    preloadSiblings: false
  }
};

const MAP_LABEL_SETS = {
  continents: [
    { id: "continent-america", text: "America", lon: -95, lat: 13 },
    { id: "continent-europe", text: "Europa", lon: 15, lat: 53 },
    { id: "continent-asia", text: "Asia", lon: 92, lat: 35 },
    { id: "continent-africa", text: "Africa", lon: 22, lat: 4 },
    { id: "continent-oceania", text: "Oceania", lon: 142, lat: -24 },
    { id: "continent-antarctica", text: "Antartida", lon: 0, lat: -78 }
  ],
  oceans: [
    { id: "ocean-atlantic", text: "Atlantico", lon: -28, lat: 5 },
    { id: "ocean-pacific", text: "Pacifico", lon: -155, lat: -3 },
    { id: "ocean-indian", text: "Indico", lon: 82, lat: -18 },
    { id: "ocean-arctic", text: "Artico", lon: 0, lat: 84 },
    { id: "ocean-southern", text: "Oceano Austral", lon: 40, lat: -58 }
  ]
};

const DEFAULT_STYLE = {
  color: "#184b74",
  weight: 1.8,
  fillColor: "#2a3f5f",
  fillOpacity: 0.1
};

const COUNTRY_HIGHLIGHT_STYLE = {
  color: "#c9eeff",
  weight: 3.4,
  fillColor: "#49b3ff",
  fillOpacity: 0.28
};

const CONTINENT_HIGHLIGHT_STYLE = {
  color: "#f0ffb8",
  weight: 3.2,
  fillColor: "#8ddb48",
  fillOpacity: 0.3
};

const RELIGION_HIGHLIGHT_STYLE = {
  color: "#ffd2d2",
  weight: 3.2,
  fillColor: "#ff6464",
  fillOpacity: 0.3
};

const THEME_STYLES = {
  continent: {
    America: "#8ecae6",
    Europe: "#ffb703",
    Asia: "#fb8500",
    Africa: "#90be6d",
    Oceania: "#b388eb",
    Antarctica: "#adb5bd",
    Unknown: "#6c757d"
  },
  religion: {
    cristianismo: "#60a5fa",
    islam: "#f28482",
    hinduismo: "#f6bd60",
    budismo: "#84a59d",
    judaismo: "#cdb4db",
    sijismo: "#ffd166",
    sintoismo: "#43aa8b",
    zoroastrismo: "#bc6c25",
    animismo: "#6a994e",
    "no afiliados": "#8d99ae",
    vudu: "#b56576",
    otras: "#8ecae6"
  },
  politics: {
    presidencialismo: "#577590",
    semipresidencialismo: "#4cc9f0",
    parlamentarismo: "#a8dadc",
    teocracia: "#f3722c",
    monarquia_constitucional: "#ffd166",
    monarquia_absoluta: "#f94144",
    otros: "#7b8ea8"
  },
  historyType: {
    independencia: "#3a86ff",
    union: "#8338ec",
    "disolucion de otro estado": "#ff006e",
    revolucion: "#fb5607",
    "guerra civil": "#ef476f",
    "territorio dependiente": "#4d96ff",
    "territorio disputado": "#f8961e",
    "territorio no incorporado": "#90be6d",
    "tratado internacional": "#6c757d",
    "legal y pacifica": "#06d6a0",
    otros: "#8d99ae"
  },
  exportBreadth: [
    { min: 12, color: "#14213d", label: "12 sectores o mas" },
    { min: 8, color: "#1d3557", label: "8 a 11 sectores" },
    { min: 5, color: "#457b9d", label: "5 a 7 sectores" },
    { min: 3, color: "#7fb3d5", label: "3 a 4 sectores" },
    { min: 1, color: "#bde0fe", label: "1 a 2 sectores" },
    { min: 0, color: "#e9f5ff", label: "Sin datos" }
  ],
  industryBreadth: [
    { min: 12, color: "#283618", label: "12 ramas o mas" },
    { min: 8, color: "#4f772d", label: "8 a 11 ramas" },
    { min: 5, color: "#7aa95c", label: "5 a 7 ramas" },
    { min: 3, color: "#a7c957", label: "3 a 4 ramas" },
    { min: 1, color: "#d4e09b", label: "1 a 2 ramas" },
    { min: 0, color: "#eef5d2", label: "Sin datos" }
  ],
  capitalShare: [
    { min: 30, color: "#4a0d67", label: "30% o mas" },
    { min: 20, color: "#7b2cbf", label: "20% a 29,9%" },
    { min: 10, color: "#9d4edd", label: "10% a 19,9%" },
    { min: 5, color: "#c77dff", label: "5% a 9,9%" },
    { min: 1, color: "#e0aaff", label: "1% a 4,9%" },
    { min: 0, color: "#f5e9ff", label: "Sin datos" }
  ],
  population: [
    { min: 200000000, color: "#081c15", label: "200 M o mas" },
    { min: 100000000, color: "#1b4332", label: "100 M a 199,9 M" },
    { min: 50000000, color: "#2d6a4f", label: "50 M a 99,9 M" },
    { min: 10000000, color: "#40916c", label: "10 M a 49,9 M" },
    { min: 1000000, color: "#74c69d", label: "1 M a 9,9 M" },
    { min: 0, color: "#b7e4c7", label: "Menos de 1 M" }
  ],
  gdp: [
    { min: 5000000000000, color: "#081c15", label: "US$ 5 B o mas" },
    { min: 1000000000000, color: "#1b4332", label: "US$ 1 B a 4,9 B" },
    { min: 250000000000, color: "#2d6a4f", label: "US$ 250 mil M a 999 mil M" },
    { min: 50000000000, color: "#40916c", label: "US$ 50 mil M a 249 mil M" },
    { min: 10000000000, color: "#74c69d", label: "US$ 10 mil M a 49 mil M" },
    { min: 0, color: "#b7e4c7", label: "Menos de US$ 10 mil M" }
  ],
  gdpPerCapita: [
    { min: 60000, color: "#03045e", label: "US$ 60.000 o mas" },
    { min: 30000, color: "#0077b6", label: "US$ 30.000 a 59.999" },
    { min: 15000, color: "#00b4d8", label: "US$ 15.000 a 29.999" },
    { min: 5000, color: "#48cae4", label: "US$ 5.000 a 14.999" },
    { min: 1000, color: "#90e0ef", label: "US$ 1.000 a 4.999" },
    { min: 0, color: "#caf0f8", label: "Menos de US$ 1.000" }
  ],
  inflation: [
    { min: 100, color: "#7f0000", label: "100% o mas" },
    { min: 20, color: "#c1121f", label: "20% a 99,9%" },
    { min: 10, color: "#e85d04", label: "10% a 19,9%" },
    { min: 5, color: "#f48c06", label: "5% a 9,9%" },
    { min: 0, color: "#ffba08", label: "0% a 4,9%" },
    { min: -1000, color: "#adb5bd", label: "Deflacion" }
  ],
  militaryActive: [
    { min: 1000000, color: "#3d0c02", label: "1 M o mas" },
    { min: 500000, color: "#7f1d1d", label: "500 mil a 999 mil" },
    { min: 250000, color: "#b91c1c", label: "250 mil a 499 mil" },
    { min: 100000, color: "#dc2626", label: "100 mil a 249 mil" },
    { min: 10000, color: "#f87171", label: "10 mil a 99 mil" },
    { min: 0, color: "#fecaca", label: "Menos de 10 mil" }
  ],
  formationYear: [
    { min: 2000, color: "#5f0f40", label: "2000 en adelante" },
    { min: 1950, color: "#9a031e", label: "1950 a 1999" },
    { min: 1900, color: "#fb8b24", label: "1900 a 1949" },
    { min: 1800, color: "#e36414", label: "1800 a 1899" },
    { min: 1500, color: "#0f4c5c", label: "1500 a 1799" },
    { min: 0, color: "#6c757d", label: "Antes de 1500" }
  ],
  conflicts: [
    { min: 80, color: "#4a0404", label: "80 o mas" },
    { min: 40, color: "#7f1d1d", label: "40 a 79" },
    { min: 20, color: "#b91c1c", label: "20 a 39" },
    { min: 10, color: "#dc2626", label: "10 a 19" },
    { min: 1, color: "#f87171", label: "1 a 9" },
    { min: 0, color: "#fecaca", label: "Sin conflictos" }
  ],
  organizations: [
    { min: 40, color: "#1d3557", label: "40 o mas" },
    { min: 25, color: "#2a6f97", label: "25 a 39" },
    { min: 15, color: "#468faf", label: "15 a 24" },
    { min: 8, color: "#61a5c2", label: "8 a 14" },
    { min: 1, color: "#89c2d9", label: "1 a 7" },
    { min: 0, color: "#d9ed92", label: "Sin organizaciones" }
  ],
  rivals: [
    { min: 20, color: "#6a040f", label: "20 o mas" },
    { min: 10, color: "#9d0208", label: "10 a 19" },
    { min: 5, color: "#d00000", label: "5 a 9" },
    { min: 2, color: "#dc2f02", label: "2 a 4" },
    { min: 1, color: "#f48c06", label: "1" },
    { min: 0, color: "#ffd6a5", label: "Sin rivales" }
  ],
  religionDiversity: [
    { min: 8, color: "#3a0ca3", label: "8 o mas grupos" },
    { min: 6, color: "#7209b7", label: "6 a 7 grupos" },
    { min: 4, color: "#b5179e", label: "4 a 5 grupos" },
    { min: 2, color: "#f72585", label: "2 a 3 grupos" },
    { min: 1, color: "#ff99c8", label: "1 grupo" },
    { min: 0, color: "#ffc8dd", label: "Sin datos" }
  ],
  religionBranch: {
    cristianismo: "#60a5fa",
    islam: "#f28482",
    hinduismo: "#f6bd60",
    budismo: "#84a59d",
    judaismo: "#cdb4db",
    noafiliados: "#8d99ae",
    otras: "#8ecae6"
  },
  exMetropole: {
    "Reino Unido": "#4cc9f0",
    "Francia": "#577590",
    "España": "#ffb703",
    "Portugal": "#f3722c",
    "Países Bajos": "#fb8500",
    "Estados Unidos": "#8d99ae",
    "Sin datos": "#6c757d"
  },
  bloc: {
    OTAN: "#1d3557",
    "Union Europea": "#ffb703",
    Mercosur: "#2a9d8f",
    ASEAN: "#e76f51",
    Commonwealth: "#8ecae6",
    BRICS: "#6a994e",
    ONU: "#adb5bd",
    Otros: "#7b8ea8"
  }
};

Object.assign(THEME_STYLES, {
  density: [
    { min: 500, color: "#3d0c02", label: "500 hab/km2 o mas" },
    { min: 250, color: "#7f1d1d", label: "250 a 499 hab/km2" },
    { min: 100, color: "#b91c1c", label: "100 a 249 hab/km2" },
    { min: 50, color: "#e85d04", label: "50 a 99 hab/km2" },
    { min: 10, color: "#f6aa1c", label: "10 a 49 hab/km2" },
    { min: 0, color: "#ffe6a7", label: "Menos de 10 hab/km2" }
  ],
  urbanization: [
    { min: 60, color: "#14213d", label: "Muy urbanizado" },
    { min: 40, color: "#274c77", label: "Urbanizacion alta" },
    { min: 25, color: "#468faf", label: "Urbanizacion media" },
    { min: 15, color: "#89c2d9", label: "Urbanizacion moderada" },
    { min: 5, color: "#cae9ff", label: "Urbanizacion baja" },
    { min: 0, color: "#edf6ff", label: "Sin datos" }
  ],
  lifeExpectancy: [
    { min: 80, color: "#0b3d20", label: "80 anos o mas" },
    { min: 75, color: "#2d6a4f", label: "75 a 79,9 anos" },
    { min: 70, color: "#52b788", label: "70 a 74,9 anos" },
    { min: 65, color: "#95d5b2", label: "65 a 69,9 anos" },
    { min: 60, color: "#d8f3dc", label: "60 a 64,9 anos" },
    { min: 0, color: "#eff7f1", label: "Menos de 60 anos" }
  ],
  populationGrowth: [
    { min: 3, color: "#6a040f", label: "3% o mas" },
    { min: 2, color: "#9d0208", label: "2% a 2,9%" },
    { min: 1, color: "#dc2f02", label: "1% a 1,9%" },
    { min: 0, color: "#f48c06", label: "0% a 0,9%" },
    { min: -1, color: "#adb5bd", label: "-1% a -0,1%" },
    { min: -100, color: "#6c757d", label: "Caida mayor a 1%" }
  ],
  unemployment: [
    { min: 20, color: "#7f0000", label: "20% o mas" },
    { min: 15, color: "#c1121f", label: "15% a 19,9%" },
    { min: 10, color: "#e85d04", label: "10% a 14,9%" },
    { min: 6, color: "#f4a261", label: "6% a 9,9%" },
    { min: 3, color: "#ffd6a5", label: "3% a 5,9%" },
    { min: 0, color: "#fff4e6", label: "Menos de 3%" }
  ],
  debt: [
    { min: 120, color: "#3c096c", label: "120% del PBI o mas" },
    { min: 90, color: "#5a189a", label: "90% a 119%" },
    { min: 60, color: "#7b2cbf", label: "60% a 89%" },
    { min: 40, color: "#9d4edd", label: "40% a 59%" },
    { min: 20, color: "#c77dff", label: "20% a 39%" },
    { min: 0, color: "#efe2ff", label: "Menos de 20%" }
  ],
  militarySpending: [
    { min: 6, color: "#4a0404", label: "6% del PBI o mas" },
    { min: 4, color: "#7f1d1d", label: "4% a 5,9%" },
    { min: 2.5, color: "#b91c1c", label: "2,5% a 3,9%" },
    { min: 1.5, color: "#dc2626", label: "1,5% a 2,4%" },
    { min: 0.8, color: "#f87171", label: "0,8% a 1,4%" },
    { min: 0, color: "#fecaca", label: "Menos de 0,8%" }
  ],
  exportVolume: [
    { min: 1000000000000, color: "#14213d", label: "US$ 1 B o mas" },
    { min: 250000000000, color: "#1d3557", label: "US$ 250 mil M a 999 mil M" },
    { min: 100000000000, color: "#2a6f97", label: "US$ 100 mil M a 249 mil M" },
    { min: 25000000000, color: "#468faf", label: "US$ 25 mil M a 99 mil M" },
    { min: 5000000000, color: "#89c2d9", label: "US$ 5 mil M a 24 mil M" },
    { min: 0, color: "#dff3fb", label: "Menos de US$ 5 mil M" }
  ],
  gdpPpp: [
    { min: 10000000000000, color: "#081c15", label: "US$ 10 B o mas" },
    { min: 3000000000000, color: "#1b4332", label: "US$ 3 B a 9,9 B" },
    { min: 1000000000000, color: "#2d6a4f", label: "US$ 1 B a 2,9 B" },
    { min: 250000000000, color: "#40916c", label: "US$ 250 mil M a 999 mil M" },
    { min: 50000000000, color: "#74c69d", label: "US$ 50 mil M a 249 mil M" },
    { min: 0, color: "#d8f3dc", label: "Menos de US$ 50 mil M" }
  ],
  inflationHistory: [
    { min: 40, color: "#7f0000", label: "Inflacion historica alta" },
    { min: 20, color: "#c1121f", label: "Persistencia alta" },
    { min: 10, color: "#e85d04", label: "Persistencia media" },
    { min: 5, color: "#f48c06", label: "Presion moderada" },
    { min: 0, color: "#ffba08", label: "Estabilidad relativa" },
    { min: -100, color: "#adb5bd", label: "Deflacion estructural" }
  ],
  naturalResources: {
    energeticos: "#0f4c5c",
    mineros: "#bc6c25",
    agropecuarios: "#6a994e",
    maritimos: "#277da1",
    industriales: "#5e548e",
    diversificados: "#2a9d8f",
    escasos: "#adb5bd"
  },
  geopoliticalIndex: [
    { min: 75, color: "#240046", label: "Potencia global" },
    { min: 55, color: "#5a189a", label: "Potencia mayor" },
    { min: 40, color: "#7b2cbf", label: "Influencia alta" },
    { min: 25, color: "#9d4edd", label: "Influencia media" },
    { min: 10, color: "#c77dff", label: "Influencia limitada" },
    { min: 0, color: "#efe2ff", label: "Influencia baja" }
  ],
  riskRadar: [
    { min: 80, color: "#6a040f", label: "Riesgo critico" },
    { min: 65, color: "#9d0208", label: "Riesgo muy alto" },
    { min: 50, color: "#dc2f02", label: "Riesgo alto" },
    { min: 35, color: "#f48c06", label: "Riesgo medio" },
    { min: 20, color: "#ffba08", label: "Riesgo bajo" },
    { min: 0, color: "#d9ed92", label: "Riesgo contenido" }
  ],
  riskDimension: [
    { min: 80, color: "#7f1d1d", label: "Muy alto" },
    { min: 60, color: "#b91c1c", label: "Alto" },
    { min: 40, color: "#ea580c", label: "Medio" },
    { min: 20, color: "#facc15", label: "Bajo" },
    { min: 0, color: "#bbf7d0", label: "Contenido" }
  ]
});

const THEME_PROXY_KEYS = new Set([
  "urbanization",
  "lifeExpectancy",
  "unemployment",
  "debt",
  "militarySpending",
  "exportVolume",
  "gdpPpp",
  "inflationHistory",
  "geopoliticalIndex",
  "riskRadar",
  "riskMilitary",
  "riskEconomic",
  "riskDiplomatic",
  "riskInternal",
  "riskTerritorial"
]);

if (sharedTheme.MAP_LABEL_SETS) {
  Object.assign(MAP_LABEL_SETS, sharedTheme.MAP_LABEL_SETS);
}
if (sharedTheme.DEFAULT_STYLE) {
  Object.assign(DEFAULT_STYLE, sharedTheme.DEFAULT_STYLE);
}
if (sharedTheme.COUNTRY_HIGHLIGHT_STYLE) {
  Object.assign(COUNTRY_HIGHLIGHT_STYLE, sharedTheme.COUNTRY_HIGHLIGHT_STYLE);
}
if (sharedTheme.CONTINENT_HIGHLIGHT_STYLE) {
  Object.assign(CONTINENT_HIGHLIGHT_STYLE, sharedTheme.CONTINENT_HIGHLIGHT_STYLE);
}
if (sharedTheme.RELIGION_HIGHLIGHT_STYLE) {
  Object.assign(RELIGION_HIGHLIGHT_STYLE, sharedTheme.RELIGION_HIGHLIGHT_STYLE);
}
if (sharedTheme.THEME_STYLES) {
  Object.keys(sharedTheme.THEME_STYLES).forEach(key => {
    THEME_STYLES[key] = sharedTheme.THEME_STYLES[key];
  });
}
if (sharedTheme.THEME_PROXY_KEYS instanceof Set) {
  THEME_PROXY_KEYS.clear();
  sharedTheme.THEME_PROXY_KEYS.forEach(key => THEME_PROXY_KEYS.add(key));
}

function cssColorToCesiumColor(cssColor, alpha = 1) {
  return Cesium.Color.fromCssColorString(cssColor).withAlpha(alpha);
}

class CesiumCountryLayer {
  constructor(code, entities = [], featureName = "") {
    this.code = code;
    this.entities = entities;
    this.entities.forEach(entity => {
      if (!entity.__geoRiskPolylinePositions && entity.polygon?.hierarchy?.getValue) {
        const hierarchy = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now());
        const positions = hierarchy?.positions || [];
        if (positions.length > 2) {
          entity.__geoRiskPolylinePositions = [...positions, positions[0]];
        }
      }
    });
    this.featureName = featureName;
    this.rectangle = this.computeRectangle();
    this.currentStyleKey = "";
  }

  computeRectangle() {
    const rectangles = this.entities
      .map(entity => entity.polygon?.hierarchy?.getValue(Cesium.JulianDate.now()))
      .filter(Boolean)
      .map(hierarchy => Cesium.Rectangle.fromCartesianArray(hierarchy.positions))
      .filter(Boolean);

    if (!rectangles.length) {
      return null;
    }

    return rectangles.reduce((acc, rect) => acc ? Cesium.Rectangle.union(acc, rect, new Cesium.Rectangle()) : rect, null);
  }

  setStyle(style) {
    const borderScale = getDynamicBorderScale();
    const scaledWeight = Math.max(1.2, Math.min((style.weight || 1.4) * borderScale, currentMapMode === "3d" ? 4.8 : 3.6));
    const styleKey = JSON.stringify({
      color: style.color,
      weight: scaledWeight,
      fillColor: style.fillColor,
      fillOpacity: style.fillOpacity
    });

    if (this.currentStyleKey === styleKey) {
      return;
    }

    this.currentStyleKey = styleKey;
    this.entities.forEach(entity => {
      if (entity.polygon) {
        entity.polygon.material = cssColorToCesiumColor(style.fillColor, style.fillOpacity);
        entity.polygon.outline = false;
      }
      if (!entity.polyline && entity.polygon) {
        const positions = entity.__geoRiskPolylinePositions || [];
        if (positions.length > 2) {
          entity.polyline = new Cesium.PolylineGraphics({
            positions,
            clampToGround: false,
            width: scaledWeight,
            material: cssColorToCesiumColor(style.color, 0.92)
          });
        }
      }
      if (entity.polyline) {
        entity.polyline.material = cssColorToCesiumColor(style.color, 1);
        entity.polyline.width = scaledWeight;
      }
    });
  }

  getBounds() {
    return this.rectangle;
  }
}

function createLayerGroup(layers = []) {
  return {
    layers,
    getBounds() {
      const rectangles = layers.map(layer => layer?.getBounds?.()).filter(Boolean);
      if (!rectangles.length) {
        return null;
      }
      return rectangles.reduce((acc, rect) => acc ? Cesium.Rectangle.union(acc, rect, new Cesium.Rectangle()) : rect, null);
    }
  };
}

function getCountryLabelData() {
  const zoomBucket = get3DZoomBucket();
  const minScore = zoomBucket === "near"
    ? (isMobileLayout() ? 0.0016 : 0.00075)
    : zoomBucket === "mid"
      ? (isMobileLayout() ? 0.0026 : 0.00105)
      : (isMobileLayout() ? 0.0052 : 0.0022);
  return [...countryLayers.values()]
    .map(layer => {
      const bounds = layer.getBounds();
      if (!bounds) {
        return null;
      }
      const center = Cesium.Rectangle.center(bounds);
      const width = Math.abs(bounds.east - bounds.west);
      const height = Math.abs(bounds.north - bounds.south);
      return {
        id: `country-label-${layer.code}`,
        text: countriesData[layer.code]?.name || layer.featureName || layer.code,
        lon: Cesium.Math.toDegrees(center.longitude),
        lat: Cesium.Math.toDegrees(center.latitude),
        sizeScore: width * height
      };
    })
    .filter(Boolean)
    .filter(item => item.sizeScore >= minScore)
    .sort((a, b) => b.sizeScore - a.sizeScore);
}

function clearMapLabels() {
  if (!viewer || !labelEntities.length) {
    return;
  }
  labelEntities.forEach(entity => viewer.entities.remove(entity));
  labelEntities = [];
}

function buildLabelEntityConfig(item, category = "country") {
  const isContext = category !== "country";
  const zoomBucket = get3DZoomBucket();
  const countryFont = zoomBucket === "near" ? "700 14px Segoe UI, sans-serif" : zoomBucket === "mid" ? "600 13px Segoe UI, sans-serif" : "600 12px Segoe UI, sans-serif";
  const contextFont = zoomBucket === "near" ? "700 16px Segoe UI, sans-serif" : zoomBucket === "mid" ? "600 15px Segoe UI, sans-serif" : "600 14px Segoe UI, sans-serif";
  return {
    id: item.id,
    position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0),
    label: {
      text: item.text,
      font: isContext ? contextFont : countryFont,
      fillColor: isContext
        ? cssColorToCesiumColor("#e8f6ff", 0.96)
        : cssColorToCesiumColor("#f3fbff", 0.92),
      outlineColor: cssColorToCesiumColor("#04101c", 0.96),
      outlineWidth: isContext ? 4 : 3,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      showBackground: true,
      backgroundColor: isContext
        ? cssColorToCesiumColor("rgba(4,16,28,0.52)", 0.52)
        : cssColorToCesiumColor("rgba(4,16,28,0.42)", 0.42),
      pixelOffset: new Cesium.Cartesian2(0, 0),
      scaleByDistance: new Cesium.NearFarScalar(1500000, isContext ? 1.0 : 0.92, 24000000, isContext ? 0.62 : 0.45),
      translucencyByDistance: new Cesium.NearFarScalar(2500000, 1, 26000000, 0),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, isContext ? 30000000 : 18000000),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  };
}

function renderMapLabels() {
  if (!viewer) {
    return;
  }
  clearMapLabels();
  if (labelMode === "none" || currentMapMode !== "3d") {
    viewer.scene.requestRender();
    return;
  }

  const zoomBucket = get3DZoomBucket();
  const countries = getCountryLabelData();
  const maxCountries = zoomBucket === "near"
    ? (isMobileLayout() ? 58 : 120)
    : zoomBucket === "mid"
      ? (isMobileLayout() ? 38 : 88)
      : (isMobileLayout() ? 20 : 52);
  countries.slice(0, maxCountries).forEach(item => {
    labelEntities.push(viewer.entities.add(buildLabelEntityConfig(item, "country")));
  });

  if (labelMode === "full" && zoomBucket !== "far") {
    [...MAP_LABEL_SETS.continents, ...MAP_LABEL_SETS.oceans].forEach(item => {
      labelEntities.push(viewer.entities.add(buildLabelEntityConfig(item, "context")));
    });
  }
  viewer.scene.requestRender();
}

function focusRectangle(bounds, options = {}) {
  if (!viewer || !bounds) {
    return;
  }
  activeFocusToken += 1;
  const width = Math.abs(bounds.east - bounds.west);
  const height = Math.abs(bounds.north - bounds.south);
  const area = Math.max(width * height, 0.0001);
  const duration = options.instant
    ? 0
    : (currentMapMode === "2d"
        ? (isMobileLayout() ? 0.16 : 0.22)
        : (area < 0.02
            ? (isMobileLayout() ? 0.38 : 0.62)
            : area < 0.12
              ? (isMobileLayout() ? 0.46 : 0.78)
              : (isMobileLayout() ? 0.52 : 0.9)));
  viewer.camera.cancelFlight();
  viewer.camera.flyTo({
    destination: bounds,
    duration,
    complete: () => {
      if (options.onComplete) {
        options.onComplete();
      }
    }
  });
  viewer.scene.requestRender();
}

function update3DPresentationState() {
  const isPresentation = document.body.classList.contains("presentation-mode");
  const toolbar = document.getElementById("map-toolbar");
  if (isPresentation && toolbar?.open) {
    toolbar.open = false;
  }
  if (viewer && currentMapMode === "3d") {
    viewer.scene.skyAtmosphere.show = !isPresentation && qualityPreset === "high";
    viewer.scene.globe.showGroundAtmosphere = !isPresentation && qualityPreset === "high";
  }
  viewer?.scene?.requestRender?.();
}

function applyAppMode(mode = "default", persist = true) {
  appMode = ["default", "analysis", "encyclopedia", "presentation"].includes(mode) ? mode : "default";
  appStore?.setState({ appMode }, "app-mode");
  document.body.dataset.appMode = appMode;
  document.body.classList.toggle("presentation-mode", appMode === "presentation");
  if (persist) {
    localStorage.setItem(STORAGE_KEYS.appMode, appMode);
    localStorage.setItem(STORAGE_KEYS.presentation, String(appMode === "presentation"));
  }

  const select = document.getElementById("app-mode-select");
  if (select) {
    select.value = appMode;
  }

  const preferredThemesByMode = {
    analysis: "riskRadar",
    encyclopedia: "qualityScore",
    presentation: "default"
  };
  const preferredTheme = preferredThemesByMode[appMode];
  const replaceableThemes = new Set(["default", "qualityScore", "geopoliticalIndex", "riskRadar"]);
  if (preferredTheme && replaceableThemes.has(currentTheme)) {
    setTheme(preferredTheme);
    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
      themeSelect.value = preferredTheme;
    }
  }

  const rankingsPanel = document.getElementById("rankings-panel");
  const toolbar = document.getElementById("map-toolbar");
  const comparePanel = document.getElementById("compare-hub-panel");
  const quizPanel = document.getElementById("quiz-hub-panel");
  const newsPanel = document.getElementById("news-hub-panel");
  if (rankingsPanel) {
    rankingsPanel.open = appMode === "analysis";
  }
  if (toolbar) {
    toolbar.open = appMode === "analysis" || appMode === "encyclopedia";
  }
  if (comparePanel) {
    comparePanel.open = appMode === "analysis" && compareSelection.length > 0;
  }
  if (quizPanel) {
    quizPanel.open = false;
  }
  if (newsPanel) {
    newsPanel.open = appMode === "presentation" ? false : newsPanel.open;
  }
  if (appMode === "encyclopedia" && currentPanelState.type === "country" && currentPanelState.code) {
    const selectedCountry = countriesData[currentPanelState.code];
    if (selectedCountry) {
      renderCountry(selectedCountry);
    }
  }

  updateStaticText();
  update3DPresentationState();
  updateAppStatusPanel();
}

function openIntroModal() {
  const modal = document.getElementById("intro-modal");
  if (!modal) {
    return;
  }
  setupIntroModalControls(modal);
  updateIntroActionText();
  updateIntroRuntimeStatus();
  modal.hidden = false;
  syncModalOpenState();
}

function closeIntroModal(markSeen = true) {
  const modal = document.getElementById("intro-modal");
  if (!modal || modal.hidden) {
    return;
  }
  modal.hidden = true;
  if (markSeen) {
    localStorage.setItem(STORAGE_KEYS.introSeen, "true");
  }
  syncModalOpenState();
}

function focusSearchInput() {
  window.setTimeout(() => document.getElementById("map-search-input")?.focus({ preventScroll: true }), 0);
}

function openCompareHubFromIntro() {
  const panel = document.getElementById("compare-hub-panel");
  if (!panel) {
    return;
  }
  closeMobileHubPanels();
  panel.open = true;
  syncMobilePanelControlState();
  window.setTimeout(() => document.getElementById("compare-country-search")?.focus({ preventScroll: true }), 0);
}

function openRankingsFromIntro() {
  const panel = document.getElementById("rankings-panel");
  if (!panel) {
    return;
  }
  panel.open = true;
  syncMobilePanelControlState();
  window.setTimeout(() => panel.querySelector("summary")?.focus({ preventScroll: true }), 0);
}

function runIntroAction(action) {
  closeIntroModal();
  if (action === "search") {
    focusSearchInput();
    return;
  }
  if (action === "risk") {
    applyAppMode("analysis");
    setTheme("riskRadar");
    openRankingsFromIntro();
    return;
  }
  if (action === "compare") {
    openCompareHubFromIntro();
    return;
  }
  if (action === "conflicts") {
    setTheme("conflicts");
    openRankingsFromIntro();
  }
}

function updateIntroActionText() {
  const labels = {
    search: currentLanguage === "en"
      ? ["Search or tap", "Open a profile from search or map."]
      : ["Buscar o tocar", "Abre una ficha desde buscador o mapa."],
    risk: currentLanguage === "en"
      ? ["View risks", "Color the map by risk radar."]
      : ["Ver riesgos", "Colorea el mapa por radar de riesgo."],
    compare: currentLanguage === "en"
      ? ["Compare", "Prepare a country comparison."]
      : ["Comparar", "Prepara una comparacion entre paises."],
    conflicts: currentLanguage === "en"
      ? ["Conflicts", "Show the conflict layer."]
      : ["Conflictos", "Muestra la capa de conflictos."]
  };
  document.querySelectorAll("[data-intro-action]").forEach(button => {
    const [title, subtitle] = labels[button.dataset.introAction] || [];
    if (!title) return;
    const titleNode = button.querySelector("strong");
    const subtitleNode = button.querySelector("small");
    if (titleNode) titleNode.textContent = title;
    if (subtitleNode) subtitleNode.textContent = subtitle;
  });
}

function setupIntroModalControls(modal = document.getElementById("intro-modal")) {
  if (!modal || modal.dataset.controlsReady === "true") {
    return;
  }

  modal.dataset.controlsReady = "true";
  document.getElementById("intro-modal-close")?.addEventListener("click", () => closeIntroModal());
  document.getElementById("intro-start-button")?.addEventListener("click", () => {
    closeIntroModal();
    focusSearchInput();
  });
  modal.addEventListener("click", event => {
    if (event.target.closest("[data-close-intro-modal='true']")) {
      closeIntroModal();
      return;
    }
    const introAction = event.target.closest("[data-intro-action]");
    if (introAction) {
      runIntroAction(introAction.dataset.introAction || "search");
      return;
    }
    const modeButton = event.target.closest("[data-app-mode-choice]");
    if (modeButton) {
      applyAppMode(modeButton.dataset.appModeChoice || "default");
      closeIntroModal();
      return;
    }
    const introTarget = event.target.closest("[data-intro-target]");
    if (introTarget) {
      document.getElementById(introTarget.dataset.introTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function openProductModal(title, bodyHtml) {
  const modal = document.getElementById("product-modal");
  const body = document.getElementById("product-modal-body");
  if (!modal || !body) {
    return;
  }
  body.innerHTML = `<h2 id="product-modal-title">${escapeHtml(title)}</h2>${bodyHtml}`;
  modal.hidden = false;
  syncModalOpenState();
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (!modal) {
    return;
  }
  modal.hidden = true;
  syncModalOpenState();
}

function formatApproxBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return currentLanguage === "en" ? "0 KB" : "0 KB";
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function estimateOfflineCacheSize() {
  if (!("caches" in window)) {
    return null;
  }

  const keys = (await caches.keys()).filter(key => key.startsWith("geo-risk-"));
  let bytes = 0;
  let entries = 0;

  for (const key of keys) {
    const cache = await caches.open(key);
    const requests = await cache.keys();
    entries += requests.length;
    for (const request of requests) {
      const response = await cache.match(request);
      if (!response) {
        continue;
      }
      const blob = await response.clone().blob().catch(() => null);
      bytes += blob?.size || 0;
    }
  }

  return { bytes, entries, caches: keys.length };
}

async function updateOfflineCacheSizeLabel() {
  const label = document.getElementById("offline-cache-size");
  if (!label) {
    return null;
  }

  try {
    const estimate = await estimateOfflineCacheSize();
    if (!estimate) {
      label.textContent = currentLanguage === "en"
        ? "Offline cache size: unavailable."
        : "Tamano cache offline: no disponible.";
      return null;
    }
    label.textContent = currentLanguage === "en"
      ? `Offline cache: approx. ${formatApproxBytes(estimate.bytes)} in ${estimate.entries} files.`
      : `Cache offline: aprox. ${formatApproxBytes(estimate.bytes)} en ${estimate.entries} archivos.`;
    return estimate;
  } catch (error) {
    label.textContent = currentLanguage === "en"
      ? "Offline cache size could not be estimated."
      : "No se pudo estimar el tamano del cache offline.";
    return null;
  }
}

async function clearLocalGeoRiskCache() {
  const status = document.getElementById("offline-status");
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter(key => key.startsWith("geo-risk-")).map(key => caches.delete(key)));
    }
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.update().catch(() => null)));
    }
    resourceCache.clear();
    geoJsonCache.clear();
    if (status) {
      status.textContent = currentLanguage === "en"
        ? "Local cache cleared. Reload to rebuild it."
        : "Cache offline limpiado. Recarga para reconstruirlo.";
    }
    await updateOfflineCacheSizeLabel();
    updateAppStatusPanel();
    openProductModal(
      currentLanguage === "en" ? "Offline cache cleared" : "Cache offline limpiado",
      `<div class="help-section"><p>${currentLanguage === "en"
        ? "GeoRisk removed local app caches and cleared runtime resources. Reload the page if you still see old assets."
        : "GeoRisk elimino los caches offline de la app y limpio recursos de la sesion. Recarga la pagina si todavia ves archivos viejos."}</p></div>`
    );
  } catch (error) {
    if (status) {
      status.textContent = currentLanguage === "en"
        ? "Local cache could not be cleared."
        : "No se pudo limpiar el cache offline.";
    }
    console.warn("No se pudo limpiar el cache offline:", error);
  }
}

function getIntroCoverageStats() {
  const countries = Object.values(countriesData || {});
  const signature = [
    countries.length,
    deferredDataStatus.countryIndex ? "index" : "no-index",
    currentTheme
  ].join("|");
  if (introCoverageCache.signature === signature && introCoverageCache.stats) {
    return introCoverageCache.stats;
  }

  const conflictNames = new Set();
  countries.forEach(country => {
    (country.conflicts || []).forEach(conflict => {
      const name = typeof conflict === "string" ? conflict : conflict?.name;
      if (name) conflictNames.add(normalizeText(name));
    });
    (country.military?.conflicts || []).forEach(conflict => {
      const name = typeof conflict === "string" ? conflict : conflict?.name;
      if (name) conflictNames.add(normalizeText(name));
    });
  });

  const specialCodes = ["ATA", "GRL", "GUF", "TWN", "PSE", "-99", "CS-KM", "SOM", "CYN"];
  const stats = {
    countries: countries.length,
    conflicts: conflictNames.size,
    layers: document.querySelectorAll("#theme-select option").length || 0,
    specialEntities: specialCodes.filter(code => countriesData?.[code]).length
  };
  introCoverageCache = { signature, stats };
  return stats;
}

function updateIntroRuntimeStatus() {
  const bootState = document.getElementById("intro-boot-state");
  const dataState = document.getElementById("intro-data-state");
  const offlineState = document.getElementById("intro-offline-state");
  const renderState = document.getElementById("intro-render-state");
  const countryCount = document.getElementById("intro-country-count");
  const conflictCount = document.getElementById("intro-conflict-count");
  const layerCount = document.getElementById("intro-layer-count");
  const specialCount = document.getElementById("intro-special-count");
  const summary = getBootProfileSummary();
  if (bootState) {
    bootState.textContent = summary.total
      ? `${Math.round(summary.total)} ms`
      : (currentLanguage === "en" ? "Measuring..." : "Midiendo...");
  }
  if (dataState) {
    const states = [
      deferredDataStatus.countryIndex ? (currentLanguage === "en" ? "light index" : "indice liviano") : null,
      deferredDataStatus.runtimeCuration ? (currentLanguage === "en" ? "curation" : "curaduria") : null,
      currentLanguage === "en" ? "details on demand" : "detalle bajo demanda"
    ].filter(Boolean);
    dataState.textContent = states.join(" / ") || (currentLanguage === "en" ? "Preparing" : "Preparando");
  }
  if (offlineState) {
    offlineState.textContent = document.getElementById("offline-status")?.textContent || (currentLanguage === "en" ? "Preparing cache" : "Preparando cache");
  }
  if (renderState) {
    renderState.textContent = getRenderProfileLabel();
  }
  const coverage = getIntroCoverageStats();
  if (countryCount) {
    countryCount.textContent = formatNumber(coverage.countries);
  }
  if (conflictCount) {
    conflictCount.textContent = formatNumber(coverage.conflicts);
  }
  if (layerCount) {
    layerCount.textContent = formatNumber(coverage.layers);
  }
  if (specialCount) {
    specialCount.textContent = formatNumber(coverage.specialEntities);
  }
}

function setAutoRotateState(enabled) {
  autoRotateEnabled = Boolean(enabled);
  localStorage.setItem(STORAGE_KEYS.autoRotate, String(autoRotateEnabled));
  const button = document.getElementById("auto-rotate-button");
  if (button) {
    button.classList.toggle("is-active", autoRotateEnabled);
    button.setAttribute("aria-pressed", autoRotateEnabled ? "true" : "false");
    button.textContent = autoRotateEnabled
      ? (currentLanguage === "en" ? "Stop rotation" : "Detener rotacion")
      : (currentLanguage === "en" ? "Auto rotation" : "Rotacion automatica");
  }
  viewer?.scene?.requestRender?.();
}

function handleAutoRotateTick(clock) {
  if (!viewer || !autoRotateEnabled || currentMapMode !== "3d" || isCameraNavigating) {
    return;
  }
  if (Date.now() - lastInteractionAt < 3200) {
    return;
  }
  const seconds = Math.max(0.016, clock?.deltaSeconds || 0.016);
  viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, -seconds * 0.045);
  viewer.scene.requestRender();
}

function getInitialGlobeDistance() {
  const earthRadius = Cesium.Ellipsoid.WGS84.maximumRadius;
  return isMobileLayout() ? earthRadius * 5.05 : earthRadius * 3.55;
}

function getMaxGlobeDistance() {
  return getInitialGlobeDistance() * 1.02;
}

function getDefaultMapMode() {
  return isMobileLayout() ? "2d" : "3d";
}

function shouldUseHoverHighlights() {
  if (typeof mapInteractionCore.shouldEnableHover === "function") {
    return mapInteractionCore.shouldEnableHover({
      isMobile: isMobileLayout(),
      mode: currentMapMode,
      preset: getPerformancePreset(),
      isNavigating: isCameraNavigating,
      qualityPreset,
      suppressedUntil: hoverSuppressedUntil
    });
  }
  return getPerformancePreset().hoverEnabled &&
    Date.now() >= hoverSuppressedUntil &&
    !isCameraNavigating &&
    currentMapMode !== "2d" &&
    qualityPreset !== "performance";
}

function getPerformancePreset() {
  const base = runtimeGetDeviceProfile({
    isMobile: isMobileLayout(),
    currentMapMode,
    deviceMemory: navigator.deviceMemory || 4,
    hardwareConcurrency: navigator.hardwareConcurrency || 4
  });
  const override = QUALITY_PRESET_OVERRIDES[qualityPreset];
  if (!override) {
    return base;
  }

  const profileBucket = isMobileLayout() ? "mobile" : "desktop";
  const modeBucket = currentMapMode === "2d" ? "2d" : "3d";
  return {
    ...base,
    targetFrameRate: override.targetFrameRate ?? base.targetFrameRate,
    resolutionScale: override.resolutionScale?.[modeBucket]?.[profileBucket] ?? base.resolutionScale,
    maximumScreenSpaceError: override.maximumScreenSpaceError?.[modeBucket]?.[profileBucket] ?? base.maximumScreenSpaceError,
    tileCacheSize: override.tileCacheSize?.[modeBucket]?.[profileBucket] ?? base.tileCacheSize,
    loadingDescendantLimit: override.loadingDescendantLimit?.[modeBucket]?.[profileBucket] ?? base.loadingDescendantLimit,
    enableFxaa: override.enableFxaa ?? base.enableFxaa,
    preloadAncestors: override.preloadAncestors ?? base.preloadAncestors,
    preloadSiblings: override.preloadSiblings ?? base.preloadSiblings
  };
}

function getDeviceTier() {
  return getPerformancePreset().tier || "medium";
}

function getQualityPresetLabel() {
  const labels = {
    auto: currentLanguage === "en" ? "Automatic" : "Automatico",
    high: currentLanguage === "en" ? "High quality" : "Alta calidad",
    balanced: currentLanguage === "en" ? "Balanced" : "Balanceado",
    performance: currentLanguage === "en" ? "Performance" : "Rendimiento"
  };
  return labels[qualityPreset] || labels.auto;
}

function getDynamicBorderScale() {
  if (!viewer) {
    return 1;
  }
  if (currentMapMode === "2d") {
    return isMobileLayout() ? 0.95 : 1.05;
  }
  const zoomBucket = get3DZoomBucket();
  if (zoomBucket === "near") {
    return isMobileLayout() ? 1.45 : 1.7;
  }
  if (zoomBucket === "mid") {
    return isMobileLayout() ? 1.15 : 1.32;
  }
  return isMobileLayout() ? 0.92 : 1.02;
}

function get3DZoomBucket() {
  if (!viewer || currentMapMode !== "3d") {
    return "mid";
  }
  const height = viewer.camera.positionCartographic?.height || getInitialGlobeDistance();
  const initialDistance = getInitialGlobeDistance();
  if (height <= initialDistance * 0.58) {
    return "near";
  }
  if (height <= initialDistance * 0.9) {
    return "mid";
  }
  return "far";
}

function getCurrentOverlayBucket() {
  return currentMapMode === "3d" ? `3d-${get3DZoomBucket()}` : "2d";
}

let activeGeoJsonDataSource = null;
let activeClickHandler = null;
let mapSearchAliasesRegistered = false;
let activeImagerySignature = "";
const resourceCache = new Map();
const MAX_RESOURCE_CACHE_ENTRIES = 36;

function shouldKeepResourceCacheEntry(key) {
  return [
    "countries_index.json",
    "geo_aliases.json",
    "world_countries_simplified.geo.json",
    "world_countries.geo.json"
  ].some(fragment => key.includes(fragment));
}

function pruneResourceCache() {
  if (resourceCache.size <= MAX_RESOURCE_CACHE_ENTRIES) {
    return;
  }
  for (const key of resourceCache.keys()) {
    if (resourceCache.size <= MAX_RESOURCE_CACHE_ENTRIES) {
      break;
    }
    if (!shouldKeepResourceCacheEntry(key)) {
      resourceCache.delete(key);
    }
  }
}

function createSatelliteImageryProvider(maximumLevel = null) {
  return new Cesium.UrlTemplateImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    ...(maximumLevel ? { maximumLevel } : {})
  });
}

function createOsmImageryProvider() {
  return new Cesium.UrlTemplateImageryProvider({
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    credit: "© OpenStreetMap contributors"
  });
}

function fetchResourceCached(url, responseType = "json") {
  const cacheKey = `${responseType}:${url}`;
  if (resourceCache.has(cacheKey)) {
    return resourceCache.get(cacheKey);
  }

  const promise = fetch(url, { cache: "default" })
    .then(async response => {
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${url}: ${response.status}`);
      }
      return responseType === "text" ? response.text() : response.json();
    })
    .catch(error => {
      resourceCache.delete(cacheKey);
      throw error;
    });

  resourceCache.set(cacheKey, promise);
  pruneResourceCache();
  return promise;
}

function applyImageryForMode(boot = false) {
  if (!viewer) {
    return;
  }

  const signature = `${currentMapMode}:${boot ? "boot" : "full"}`;
  if (activeImagerySignature === signature && viewer.imageryLayers.length > 0) {
    return;
  }

  viewer.imageryLayers.removeAll(false);
  try {
    const provider = currentMapMode === "2d"
      ? createSatelliteImageryProvider(boot ? 4 : 9)
      : createSatelliteImageryProvider(boot ? 3 : null);
    viewer.imageryLayers.addImageryProvider(provider);
    activeImagerySignature = signature;
  } catch (error) {
    console.error("No se pudo aplicar la capa base del mapa:", error);
    try {
      viewer.imageryLayers.addImageryProvider(createOsmImageryProvider());
      activeImagerySignature = `${currentMapMode}:osm`;
    } catch (fallbackError) {
      console.error("No se pudo cargar la capa base alternativa:", fallbackError);
    }
  }
}

async function getCachedGeoJson(path) {
  if (geoJsonCache.has(path)) {
    return geoJsonCache.get(path);
  }

  const geoJsonPromise = fetchResourceCached(`${path}${path.includes("?") ? "&" : "?"}v=${APP_VERSION}`, "json");

  geoJsonCache.set(path, geoJsonPromise);
  return geoJsonPromise;
}

function roundCoordinateValue(value, precision = 3) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function decimateCoordinateRing(points, precision, step) {
  if (!Array.isArray(points) || !points.length) {
    return points;
  }
  if (typeof points[0] === "number") {
    return [
      roundCoordinateValue(points[0], precision),
      roundCoordinateValue(points[1], precision)
    ];
  }
  if (!Array.isArray(points[0]) || typeof points[0][0] !== "number") {
    return points.map(item => simplifyCoordinatesForMode(item, precision, step)).filter(Boolean);
  }

  const normalizedPoints = points.map(point => decimateCoordinateRing(point, precision, 1));
  if (step <= 1 || normalizedPoints.length <= 8) {
    return normalizedPoints;
  }

  const reduced = normalizedPoints.filter((_, index) =>
    index === 0 ||
    index === normalizedPoints.length - 1 ||
    index % step === 0
  );

  if (reduced.length < 4) {
    return normalizedPoints;
  }

  return reduced;
}

function simplifyCoordinatesForMode(coordinates, precision = 3, step = 1) {
  if (!Array.isArray(coordinates)) {
    return coordinates;
  }
  return decimateCoordinateRing(coordinates, precision, step);
}

function buildPreparedGeoJsonFor2D(rawGeoJson) {
  const profile = getPerformancePreset();
  const precision = profile.geoJsonPrecision || 3;
  const step = profile.geoJsonCoordinateStep || 1;
  return {
    type: rawGeoJson.type,
    features: (rawGeoJson.features || []).map(feature => ({
      type: feature.type,
      properties: {
        ISO_A3: feature.properties?.ISO_A3 || feature.properties?.iso_a3 || feature.properties?.ADM0_A3 || "",
        ADM0_A3: feature.properties?.ADM0_A3 || feature.properties?.ISO_A3 || feature.properties?.iso_a3 || "",
        name: feature.properties?.name || feature.properties?.NAME || ""
      },
      geometry: feature.geometry
        ? {
            type: feature.geometry.type,
            coordinates: simplifyCoordinatesForMode(feature.geometry.coordinates, precision, step)
          }
        : null
    }))
  };
}

function buildPreparedGeoJsonFor3D(rawGeoJson) {
  const precision = isMobileLayout() ? 5 : 6;
  return {
    type: rawGeoJson.type,
    features: (rawGeoJson.features || []).map(feature => ({
      type: feature.type,
      properties: {
        ISO_A3: feature.properties?.ISO_A3 || feature.properties?.iso_a3 || feature.properties?.ADM0_A3 || "",
        ADM0_A3: feature.properties?.ADM0_A3 || feature.properties?.ISO_A3 || feature.properties?.iso_a3 || "",
        ADM0_A3_US: feature.properties?.ADM0_A3_US || "",
        WB_A3: feature.properties?.WB_A3 || "",
        BRK_A3: feature.properties?.BRK_A3 || "",
        SOV_A3: feature.properties?.SOV_A3 || "",
        GU_A3: feature.properties?.GU_A3 || "",
        name: feature.properties?.name || feature.properties?.NAME || feature.properties?.ADMIN || ""
      },
      geometry: feature.geometry
        ? {
            type: feature.geometry.type,
            coordinates: simplifyCoordinatesForMode(feature.geometry.coordinates, precision, 1)
          }
        : null
    }))
  };
}

async function getPreparedGeoJson(path, mode = currentMapMode) {
  const cacheKey = `${path}::${mode}`;
  if (preparedGeoJsonCache.has(cacheKey)) {
    return preparedGeoJsonCache.get(cacheKey);
  }
  const raw = await getCachedGeoJson(path);
  const prepared = mode === "2d" ? buildPreparedGeoJsonFor2D(raw) : buildPreparedGeoJsonFor3D(raw);
  preparedGeoJsonCache.set(cacheKey, prepared);
  return prepared;
}

function trimDataCaches() {
  const preset = getPerformancePreset();
  const tier = preset.tier;
  if (tier === "high") {
    while (preparedGeoJsonCache.size > (preset.maxPreparedGeoJsonEntries || 4)) {
      const firstKey = preparedGeoJsonCache.keys().next().value;
      if (!firstKey) break;
      preparedGeoJsonCache.delete(firstKey);
    }
    return;
  }

  const activePath = getGeoJsonPathForCurrentMode();
  for (const key of [...preparedGeoJsonCache.keys()]) {
    if (!key.startsWith(`${activePath}::`)) {
      preparedGeoJsonCache.delete(key);
    }
  }

  if (tier === "low") {
    for (const key of [...geoJsonCache.keys()]) {
      if (key !== activePath) {
        geoJsonCache.delete(key);
      }
    }
    for (const key of [...resourceCache.keys()]) {
      if (!key.includes(activePath)) {
        resourceCache.delete(key);
      }
    }
  }
}

function scheduleGeoJsonWarmup() {
  const preset = getPerformancePreset();
  if (preset.tier === "low") {
    return;
  }

  const alternateMode = currentMapMode === "2d" ? "3d" : "2d";
  const warmPath = alternateMode === "2d"
    ? "./data/world_countries_simplified.geo.json"
    : (isMobileLayout() ? "./data/world_countries_simplified.geo.json" : "./data/world_countries.geo.json");
  const warm = () => {
    getPreparedGeoJson(warmPath, alternateMode).catch(error => {
      console.error("No se pudo precalentar el GeoJSON alternativo:", error);
    });
  };

  if (window.requestIdleCallback) {
    window.requestIdleCallback(warm, { timeout: 1200 });
  } else {
    setTimeout(warm, 320);
  }
}

function setNavigationQualityState(isNavigating) {
  if (!viewer) {
    return;
  }

  const preset = getPerformancePreset();
  if (navigationQualityRestoreTimer) {
    clearTimeout(navigationQualityRestoreTimer);
    navigationQualityRestoreTimer = null;
  }

  if (isNavigating) {
    if (currentMapMode === "2d") {
      viewer.resolutionScale = Math.max(isMobileLayout() ? 0.42 : 0.62, preset.resolutionScale - 0.1);
      viewer.scene.globe.maximumScreenSpaceError = Math.max(preset.maximumScreenSpaceError, preset.maximumScreenSpaceError + 2.1);
    } else {
      viewer.resolutionScale = Math.max(isMobileLayout() ? 0.64 : 0.9, preset.resolutionScale - (qualityPreset === "high" ? 0.08 : 0.05));
      viewer.scene.globe.maximumScreenSpaceError = Math.max(preset.maximumScreenSpaceError, preset.maximumScreenSpaceError + 0.95);
      viewer.scene.globe.loadingDescendantLimit = Math.max(6, preset.loadingDescendantLimit - 3);
      viewer.scene.globe.tileCacheSize = Math.max(120, preset.tileCacheSize - 44);
    }
    viewer.scene.requestRender();
    return;
  }

  navigationQualityRestoreTimer = setTimeout(() => {
    const stablePreset = getPerformancePreset();
    viewer.resolutionScale = stablePreset.resolutionScale;
    viewer.scene.globe.maximumScreenSpaceError = stablePreset.maximumScreenSpaceError;
    viewer.scene.globe.tileCacheSize = stablePreset.tileCacheSize;
    viewer.scene.globe.loadingDescendantLimit = stablePreset.loadingDescendantLimit;
    viewer.scene.requestRender();
  }, currentMapMode === "2d" ? 120 : 180);
}

let viewer = null;
let requestSceneRender = () => {};
let scheduledSceneRenderFrame = null;
const newsCache = new Map();
const NEWS_CACHE_TTL_MS = 20 * 60 * 1000;
const geoJsonCache = new Map();
const preparedGeoJsonCache = new Map();
const conflictModalRegistry = new Map();
let conflictModalCounter = 0;
const timelineModalRegistry = new Map();
let timelineModalCounter = 0;
let activeNewsCountryCode = "";
let loadDataPromise = null;
let loadSupplementalDataPromise = null;
let loadDeferredDataEnhancementsPromise = null;
let loadRuntimeCurationPromise = null;
const countryDetailPromises = new Map();
const countryConflictDetailPromises = new Map();
const deferredDataStatus = {
  countryIndex: false,
  runtimeCuration: false,
  wikipediaConflicts: false
};
let loadMapPromise = null;
let loadMapMode = "";
let loadMapPath = "";
let detailedOverlayUpgradeTimer = null;
const bootMetrics = {
  startedAt: 0,
  completedAt: 0,
  steps: {},
  errors: []
};
const longTaskMetrics = bootScheduler.longTaskMetrics || { supported: false, count: 0, totalDuration: 0, longestDuration: 0, recent: [] };
const startupFpsMetrics = bootScheduler.startupFpsMetrics || { active: false, samples: 0, min: null, max: null, avg: 0, completed: false };
const startLongTaskObserver = bootScheduler.startLongTaskObserver || (() => {});

function setStartupStatus(text, title = null) {
  const titleElement = document.getElementById("startup-status-title");
  const textElement = document.getElementById("startup-status-text");
  if (titleElement && title) {
    titleElement.textContent = title;
  }
  if (textElement && text) {
    textElement.textContent = text;
  }
}

function markBootStepStart(name) {
  if (!bootMetrics.startedAt) {
    bootMetrics.startedAt = performance.now();
  }
  bootMetrics.steps[name] = {
    ...(bootMetrics.steps[name] || {}),
    start: performance.now()
  };
}

function markBootStepEnd(name, extra = {}) {
  const current = bootMetrics.steps[name] || {};
  const start = current.start || performance.now();
  bootMetrics.steps[name] = {
    ...current,
    ...extra,
    end: performance.now(),
    duration: Math.max(0, performance.now() - start)
  };
}

async function measureBootStep(name, task, extra = {}) {
  markBootStepStart(name);
  try {
    const result = await task();
    markBootStepEnd(name, extra);
    return result;
  } catch (error) {
    bootMetrics.errors.push({ name, message: error?.message || String(error) });
    markBootStepEnd(name, { error: error?.message || String(error), ...extra });
    throw error;
  }
}

function completeBootMetrics() {
  bootMetrics.completedAt = performance.now();
}

function getBootProfileSummary() {
  const total = bootMetrics.completedAt && bootMetrics.startedAt
    ? Math.max(0, bootMetrics.completedAt - bootMetrics.startedAt)
    : 0;
  const imagery = bootMetrics.steps.mapBootReady?.duration || 0;
  const data = bootMetrics.steps.loadData?.duration || 0;
  const overlay = bootMetrics.steps.loadMapOverlay?.duration || 0;
  const ui = bootMetrics.steps.deferredUi?.duration || 0;
  return {
    total,
    imagery,
    data,
    overlay,
    ui
  };
}
let mapOverlayLoadToken = 0;
let deferredGlobalStatsTimer = null;
let deferredGlobalStatsReady = false;
let hoverSuppressedUntil = 0;
let lastHoverSampleAt = 0;
let lastThemeSummarySignature = "";
let introCoverageCache = { signature: "", stats: null };

function requestMapRenderSafe(context = "map-update") {
  try {
    viewer?.scene?.requestRender?.();
    return Boolean(viewer?.scene);
  } catch (error) {
    console.warn(`No se pudo pedir render del mapa (${context}):`, error);
    return false;
  }
}

function installSceneRenderScheduler() {
  if (!viewer?.scene || viewer.__geoRiskRenderSchedulerInstalled) {
    return;
  }

  const originalRequestRender = viewer.scene.requestRender.bind(viewer.scene);
  requestSceneRender = () => {
    if (scheduledSceneRenderFrame !== null) {
      return;
    }
    const flush = () => {
      scheduledSceneRenderFrame = null;
      if (viewer?.scene) {
        originalRequestRender();
      }
    };

    if (typeof requestAnimationFrame === "function") {
      scheduledSceneRenderFrame = requestAnimationFrame(flush);
    } else {
      scheduledSceneRenderFrame = setTimeout(flush, 16);
    }
  };

  viewer.scene.requestRender = requestSceneRender;
  viewer.__geoRiskRenderSchedulerInstalled = true;
}

const CORE_CONFLICT_NAME_ALIASES = [
  [/^Guerra de Malvinas$/i, "Guerra de las Malvinas"],
  [/^Falklands War$/i, "Guerra de las Malvinas"],
  [/^World War I$/i, "Primera Guerra Mundial"],
  [/^First World War$/i, "Primera Guerra Mundial"],
  [/^World War II$/i, "Segunda Guerra Mundial"],
  [/^Second World War$/i, "Segunda Guerra Mundial"],
  [/^Iraq War$/i, "Guerra de Irak"],
  [/^War in Afghanistan$/i, "Guerra de Afganistan"],
  [/^Korean War$/i, "Guerra de Corea"],
  [/^Kosovo War$/i, "Guerra de Kosovo"],
  [/^Vietnam War$/i, "Guerra de Vietnam"],
  [/^Six-Day War$/i, "Guerra de los Seis Dias"],
  [/^Yom Kippur War$/i, "Guerra de Yom Kipur"],
  [/^Russo-Ukrainian War$/i, "Guerra rusoucraniana"],
  [/^Russian invasion of Ukraine$/i, "Guerra rusoucraniana"],
  [/^War in Donbas$/i, "Guerra del Donbas"],
  [/^Chinese Civil War$/i, "Guerra civil china"],
  [/^Crimean War$/i, "Guerra de Crimea"],
  [/^Spanish Civil War$/i, "Guerra civil espanola"],
  [/^Syrian Civil War$/i, "Guerra civil siria"],
  [/^Libyan Civil War$/i, "Guerra civil libia"],
  [/^Second Libyan Civil War$/i, "Segunda guerra civil libia"],
  [/^Gulf War$/i, "Guerra del Golfo"],
  [/^Iran-Iraq War$/i, "Guerra Iran-Irak"],
  [/^Arab-Israeli War of 1948$/i, "Guerra arabe-israeli de 1948"]
];

let conflictNameAliases = window.GeoRiskConflictAliases?.entries || CORE_CONFLICT_NAME_ALIASES;
let loadConflictAliasesPromise = null;

function refreshConflictNameAliases() {
  if (Array.isArray(window.GeoRiskConflictAliases?.entries) && window.GeoRiskConflictAliases.entries.length) {
    conflictNameAliases = window.GeoRiskConflictAliases.entries;
  }
  return conflictNameAliases;
}

function getConflictNameAliases() {
  return refreshConflictNameAliases();
}

async function ensureConflictAliasesLoaded() {
  if (Array.isArray(window.GeoRiskConflictAliases?.entries) && window.GeoRiskConflictAliases.entries.length) {
    refreshConflictNameAliases();
    return conflictNameAliases;
  }
  if (!loadConflictAliasesPromise) {
    loadConflictAliasesPromise = import(`./app-conflict-aliases.js?v=${APP_VERSION}`)
      .catch(error => {
        console.warn("No se pudo cargar alias diferidos de conflictos:", error);
      })
      .finally(refreshConflictNameAliases);
  }
  await loadConflictAliasesPromise;
  return conflictNameAliases;
}

function scheduleConflictAliasesLoad() {
  const schedule = window.requestIdleCallback
    ? callback => window.requestIdleCallback(callback, { timeout: 1800 })
    : callback => setTimeout(callback, 500);
  schedule(() => ensureConflictAliasesLoaded());
}


const CONFLICT_PARENT_RULES = [];
const CONFLICT_CAMPAIGN_MARKERS = [
  "operacion",
  "campana",
  "campaña",
  "ofensiva",
  "frente",
  "asedio",
  "sitio",
  "invasion",
  "intervencion",
  "ocupacion"
];
let conflictRulesReady = false;

function mergeRuntimeConflictRules(rules = {}) {
  let loaded = false;
  if (Array.isArray(rules.CONFLICT_PARENT_RULES)) {
    CONFLICT_PARENT_RULES.splice(0, CONFLICT_PARENT_RULES.length, ...rules.CONFLICT_PARENT_RULES);
    loaded = true;
  }
  if (Array.isArray(rules.CONFLICT_CAMPAIGN_MARKERS)) {
    CONFLICT_CAMPAIGN_MARKERS.splice(0, CONFLICT_CAMPAIGN_MARKERS.length, ...rules.CONFLICT_CAMPAIGN_MARKERS);
    loaded = true;
  }
  conflictRulesReady = loaded || conflictRulesReady;
}

const CONFLICT_DETAIL_OVERRIDES = {
  "Guerra de las Malvinas": {
    cause: "El conflicto estallo por la disputa de soberania sobre las Islas Malvinas, Georgias del Sur y Sandwich del Sur, en un contexto de crisis interna argentina y de respuesta militar britanica.",
    participants: [
      { side: "Argentina", members: ["Argentina"], organizations: [], troops: "aprox. 23.000", casualties: "649 muertos" },
      { side: "Reino Unido", members: ["Reino Unido"], organizations: ["OTAN (apoyo politico indirecto)"], troops: "aprox. 28.000", casualties: "255 muertos" }
    ],
    outcome: "Victoria militar britanica y restablecimiento del control del Reino Unido sobre las islas.",
    consequences: "Argentina mantuvo el reclamo diplomatico y el Reino Unido reforzo su presencia militar y administrativa en el archipielago."
  },
  "Guerra de la Triple Alianza": {
    cause: "Estallo por la disputa regional en la Cuenca del Plata, la intervencion en Uruguay y la ofensiva paraguaya contra Brasil y Argentina.",
    participants: [
      { side: "Triple Alianza", members: ["Argentina", "Brasil", "Uruguay"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas en todos los bandos" },
      { side: "Paraguay", members: ["Paraguay"], organizations: [], troops: "movilizacion masiva nacional", casualties: "catastroficas" }
    ],
    outcome: "Derrota paraguaya y ocupacion aliada del pais.",
    consequences: "Paraguay perdio territorio, poblacion y capacidad militar; Argentina y Brasil consolidaron su influencia regional."
  },
  "Guerra ruso-ucraniana": {
    cause: "Se intensifico por la invasion rusa a gran escala de Ucrania en 2022 sobre una rivalidad abierta desde 2014 y la disputa por Crimea, Donbas y la orientacion geopolitica ucraniana.",
    participants: [
      { side: "Rusia", members: ["Rusia"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Ucrania y apoyos", members: ["Ucrania"], organizations: ["OTAN (apoyo indirecto)", "Union Europea (apoyo politico y material)"], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto en curso.",
    consequences: "Cambio drástico del equilibrio de seguridad europeo, sanciones contra Rusia, ampliacion de la OTAN y destruccion masiva en territorio ucraniano."
  }
};

Object.assign(CONFLICT_DETAIL_OVERRIDES, curatedConflictDetailOverrides);

function getConflictChronologyText(item) {
  return typeof item === "string"
    ? item
    : (item?.text || item?.event || item?.description || "");
}

function mergeConflictChronology(baseItems = [], importedItems = []) {
  const seen = new Set();
  return [...baseItems, ...importedItems].filter(item => {
    const key = `${item?.year || ""}:${normalizeText(getConflictChronologyText(item))}`;
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function mergeConflictParticipants(baseItems = [], importedItems = []) {
  return dedupeConflictParticipants([...baseItems, ...importedItems]);
}

function inferConflictCoalitionLabel(side = "", members = []) {
  const explicit = sanitizeConflictModalText(side).replace(/\s*:\s*$/, "");
  if (explicit && !/^Bando \d+$/i.test(explicit) && !/^Beligerantes$/i.test(explicit)) {
    return explicit;
  }

  const normalizedMembers = (members || []).map(member => normalizeText(member));
  const hasAny = needles => needles.some(needle => normalizedMembers.some(member => member.includes(normalizeText(needle))));

  if (hasAny(["Corea del Norte", "China"])) return "Corea del Norte y apoyos";
  if (hasAny(["Corea del Sur", "Estados Unidos", "Reino Unido", "Australia", "Canada"])) return "Corea del Sur y ONU";
  if (hasAny(["Vietnam del Norte", "Viet Cong"])) return "Vietnam del Norte y Viet Cong";
  if (hasAny(["Vietnam del Sur", "Estados Unidos", "Australia"])) return "Vietnam del Sur y aliados";
  if (hasAny(["Israel"])) return "Israel";
  if (hasAny(["Egipto", "Siria", "Jordania", "Irak"]) && !hasAny(["Israel"])) return "Coalicion arabe";
  if (hasAny(["Alemania", "Italia", "Japon"])) return "Eje";
  if (hasAny(["Austria-Hungria", "Imperio otomano", "Bulgaria"]) && hasAny(["Alemania"])) return "Potencias Centrales";
  if (hasAny(["Reino Unido", "Union Sovietica", "Estados Unidos", "Francia", "China", "Belgica", "Paises Bajos", "Luxemburgo"])) return "Aliados";
  if (hasAny(["Argentina", "Brasil", "Uruguay"])) return "Triple Alianza";
  if (hasAny(["Paraguay"])) return "Paraguay";
  if (hasAny(["Chile"]) && hasAny(["Peru", "Bolivia"])) return "Chile y aliados";
  if (hasAny(["Chile"])) return "Chile";
  if (hasAny(["Peru", "Bolivia"])) return "Alianza Peru-Bolivia";
  if (hasAny(["Peru"]) && hasAny(["Ecuador"])) return "Peru y Ecuador";
  if (hasAny(["Peru"])) return "Peru";
  if (hasAny(["Ecuador"])) return "Ecuador";
  if (hasAny(["Bolivia"])) return "Bolivia";
  if (hasAny(["Reino Unido"])) return "Reino Unido";
  if (hasAny(["Argentina"])) return "Argentina";
  if (hasAny(["Estados Unidos"]) && hasAny(["Mexico"])) return "Estados Unidos y Mexico";
  if (hasAny(["Estados Unidos"])) return "Estados Unidos";
  if (hasAny(["Mexico"])) return "Mexico";
  if (hasAny(["Colombia"])) return "Estado colombiano";
  if (hasAny(["FARC", "ELN", "AUC"])) return "Insurgencias y grupos armados";
  if (hasAny(["Guatemala"])) return "Guatemala";
  if (hasAny(["El Salvador"])) return "El Salvador";
  if (hasAny(["Honduras"])) return "Honduras";
  if (hasAny(["Nicaragua"])) return "Nicaragua";
  return explicit || "";
}

function sanitizeConflictParticipant(item = {}) {
  const members = uniqueNormalizedList((item?.members || []).map(sanitizeConflictModalText));
  const organizations = uniqueNormalizedList((item?.organizations || []).map(sanitizeConflictModalText));
  const side = inferConflictCoalitionLabel(item?.side || "", members);
  return {
    side,
    members,
    organizations,
    troops: sanitizeConflictModalText(item?.troops || ""),
    casualties: sanitizeConflictModalText(item?.casualties || "")
  };
}

function dedupeConflictParticipants(items = []) {
  const sanitizedItems = items.map(sanitizeConflictParticipant);
  const duplicateSideCounts = sanitizedItems.reduce((acc, item) => {
    const key = normalizeText(item.side || "");
    if (key) {
      acc.set(key, (acc.get(key) || 0) + 1);
    }
    return acc;
  }, new Map());
  const merged = new Map();

  sanitizedItems
    .filter(item => item.side || item.members.length || item.organizations.length || item.troops || item.casualties)
    .forEach(item => {
      const sideKey = normalizeText(item.side || "");
      if (sideKey && (duplicateSideCounts.get(sideKey) || 0) > 1) {
        const inferred = inferConflictCoalitionLabel("", item.members);
        if (inferred) {
          item = { ...item, side: inferred };
        }
      }
      const key = `${item.members.map(normalizeText).sort().join("|")}::${item.organizations.map(normalizeText).sort().join("|")}`;
      if (!key) {
        return;
      }

      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, item);
        return;
      }

      const existingGeneric = /^Bando \d+$/i.test(existing.side || "") || /^Beligerantes$/i.test(existing.side || "");
      const currentGeneric = /^Bando \d+$/i.test(item.side || "") || /^Beligerantes$/i.test(item.side || "");
      merged.set(key, {
        side: !existingGeneric ? existing.side : (currentGeneric ? existing.side : item.side),
        members: existing.members.length >= item.members.length ? existing.members : item.members,
        organizations: uniqueNormalizedList([...existing.organizations, ...item.organizations]),
        troops: existing.troops || item.troops,
        casualties: existing.casualties || item.casualties
      });
    });

  const values = [...merged.values()];
  const hasNamedCoalitions = values.some(item => item.side && !/^Bando \d+$/i.test(item.side) && !/^Beligerantes$/i.test(item.side));
  return values.filter(item => !hasNamedCoalitions || !/^Bando \d+$/i.test(item.side || ""));
}

function getConflictChronologySortYear(conflictName, detail = null) {
  const resolvedDetail = detail || CONFLICT_DETAIL_OVERRIDES[conflictName] || {};
  const chronologyYears = (resolvedDetail?.chronology || [])
    .map(item => Number(item?.year))
    .filter(Number.isFinite);
  return chronologyYears.length ? Math.min(...chronologyYears) : null;
}

function normalizeWikipediaConflictDetail(detail = {}) {
  if (!detail || typeof detail !== "object") {
    return null;
  }

  const wikipedia = detail.wikipedia && typeof detail.wikipedia === "object" ? detail.wikipedia : {};
  const normalized = {
    ...detail,
    wikipedia,
    participants: dedupeConflictParticipants(detail.participants || [])
  };

  if (Array.isArray(detail.related)) {
    normalized.related = uniqueNormalizedList(detail.related.filter(Boolean).map(sanitizeConflictModalText));
  }

  if (Array.isArray(detail.chronology)) {
    normalized.chronology = detail.chronology
      .map(item => ({
        ...(item && typeof item === "object" ? item : {}),
        text: sanitizeConflictModalText(getConflictChronologyText(item))
      }))
      .filter(item => item.text)
      .sort((a, b) => {
        const yearA = Number.isFinite(Number(a?.year)) ? Number(a.year) : Number.MAX_SAFE_INTEGER;
        const yearB = Number.isFinite(Number(b?.year)) ? Number(b.year) : Number.MAX_SAFE_INTEGER;
        if (yearA !== yearB) {
          return yearA - yearB;
        }
        return String(a?.text || "").localeCompare(String(b?.text || ""), "es");
      });
  }

  if (normalized.participants.length) {
    delete normalized.wikipedia?.belligerents;
    if (normalized.participants.some(item => item.troops)) {
      delete normalized.wikipedia?.strength;
    }
    if (normalized.participants.some(item => item.casualties)) {
      delete normalized.wikipedia?.casualties;
    }
  }

  return normalized;
}

function mergeImportedConflictDetails(importedDetails = {}) {
  if (!importedDetails || typeof importedDetails !== "object") {
    return;
  }

  Object.entries(importedDetails).forEach(([conflictName, importedDetail]) => {
    const normalizedImport = normalizeWikipediaConflictDetail(importedDetail);
    if (!conflictName || !normalizedImport || normalizedImport.error) {
      return;
    }

    const base = CONFLICT_DETAIL_OVERRIDES[conflictName] || {};
    CONFLICT_DETAIL_OVERRIDES[conflictName] = {
      ...normalizedImport,
      ...base,
      wikipedia: {
        ...(normalizedImport.wikipedia || {}),
        ...(base.wikipedia || {})
      },
      participants: mergeConflictParticipants(base.participants || [], normalizedImport.participants || []),
      chronology: mergeConflictChronology(base.chronology || [], normalizedImport.chronology || []),
      related: [...new Set([...(base.related || []), ...(normalizedImport.related || [])].filter(Boolean))]
    };
  });

}

const mapEventListeners = {
  click: new Set(),
  dragstart: new Set(),
  zoomstart: new Set()
};

const CURATED_TIMELINE_EXTRAS = {
  ARG: [
    { year: 1810, category: "revolucion", text: "Revolucion de Mayo y quiebre del orden virreinal", reference: "Revolucion de Mayo" },
    { year: 1853, category: "constitucion", text: "Sancion de la Constitucion nacional", reference: "Constitucion de 1853" },
    { year: 1983, category: "politica", text: "Restauracion democratica tras la dictadura militar", reference: "Transicion democratica" }
  ],
  BRA: [
    { year: 1822, category: "descolonizacion", text: "Proclamacion de la independencia del Imperio del Brasil", reference: "Independencia de Brasil" },
    { year: 1889, category: "golpe", text: "Fin del Imperio y proclamacion de la republica", reference: "Proclamacion de la Republica" },
    { year: 1988, category: "constitucion", text: "Nueva constitucion democratica posdictadura", reference: "Constitucion de 1988" }
  ],
  DEU: [
    { year: 1871, category: "union", text: "Unificacion del Imperio aleman", reference: "Unificacion alemana" },
    { year: 1949, category: "division", text: "Division formal entre RFA y RDA", reference: "Division de Alemania" },
    { year: 1990, category: "union", text: "Reunificacion alemana", reference: "Reunificacion de Alemania" }
  ],
  ESP: [
    { year: 1812, category: "constitucion", text: "Constitucion de Cadiz", reference: "Constitucion de 1812" },
    { year: 1931, category: "politica", text: "Proclamacion de la Segunda Republica", reference: "Segunda Republica" },
    { year: 1978, category: "constitucion", text: "Constitucion vigente de la monarquia parlamentaria", reference: "Constitucion de 1978" }
  ],
  FRA: [
    { year: 1789, category: "revolucion", text: "Inicio de la Revolucion francesa", reference: "Revolucion francesa" },
    { year: 1870, category: "politica", text: "Consolidacion de la Tercera Republica", reference: "Tercera Republica" },
    { year: 1958, category: "constitucion", text: "Fundacion de la Quinta Republica", reference: "Constitucion de 1958" }
  ],
  GBR: [
    { year: 1707, category: "union", text: "Acta de Union entre Inglaterra y Escocia", reference: "Acta de Union" },
    { year: 1801, category: "union", text: "Union con Irlanda y conformacion del Reino Unido", reference: "Union de 1801" },
    { year: 1922, category: "division", text: "Separacion del Estado Libre Irlandes", reference: "Independencia irlandesa" }
  ],
  ITA: [
    { year: 1861, category: "union", text: "Proclamacion del Reino de Italia y unificacion inicial", reference: "Unificacion italiana" },
    { year: 1946, category: "politica", text: "Fin de la monarquia y nacimiento de la republica", reference: "Referendum institucional" }
  ],
  JPN: [
    { year: 1868, category: "reforma", text: "Restauracion Meiji y modernizacion del Estado", reference: "Restauracion Meiji" },
    { year: 1947, category: "constitucion", text: "Constitucion pacifista de posguerra", reference: "Constitucion de 1947" }
  ],
  MEX: [
    { year: 1810, category: "revolucion", text: "Inicio de la guerra de independencia", reference: "Grito de Dolores" },
    { year: 1917, category: "constitucion", text: "Constitucion surgida de la Revolucion mexicana", reference: "Constitucion de 1917" }
  ],
  RUS: [
    { year: 1917, category: "revolucion", text: "Revoluciones de 1917 y fin del imperio", reference: "Revolucion rusa" },
    { year: 1991, category: "disolucion", text: "Fin de la Union Sovietica y nacimiento de la Federacion de Rusia", reference: "Disolucion de la URSS" }
  ],
  TUR: [
    { year: 1923, category: "politica", text: "Proclamacion de la Republica de Turquia", reference: "Republica de Turquia" },
    { year: 2017, category: "reforma", text: "Reforma constitucional hacia un presidencialismo fuerte", reference: "Referendum de 2017" }
  ],
  UKR: [
    { year: 1991, category: "disolucion", text: "Independencia tras la disolucion de la URSS", reference: "Independencia de Ucrania" },
    { year: 2014, category: "territorio", text: "Anexion rusa de Crimea y guerra en Donbas", reference: "Crisis de Crimea" }
  ],
  USA: [
    { year: 1776, category: "descolonizacion", text: "Declaracion de independencia", reference: "Declaracion de Independencia" },
    { year: 1787, category: "constitucion", text: "Constitucion federal", reference: "Constitucion de 1787" },
    { year: 1861, category: "guerra", text: "Comienzo de la Guerra Civil estadounidense", reference: "Guerra Civil" }
  ]
};

const TIMELINE_DETAIL_OVERRIDES = {
  "Fundacion de Israel": {
    title: "Fundación del Estado de Israel",
    detail: "La proclamación del Estado de Israel en 1948 fue seguida de una guerra regional inmediata y reconfiguró de forma duradera el conflicto árabe-israelí.",
    significance: "fundación estatal con fuerte impacto regional",
    intensity: "alta"
  },
  "Independencia de India": {
    title: "Independencia de India y partición",
    detail: "La retirada británica de 1947 produjo la independencia de India y Pakistán, acompañada por desplazamientos masivos y violencia sectaria.",
    significance: "descolonización de gran escala",
    intensity: "alta"
  },
  "Reunificacion de Alemania": {
    title: "Reunificación alemana",
    detail: "La absorción de la RDA por la RFA en 1990 cerró una de las divisiones emblemáticas de la Guerra fria y redefinió el mapa europeo.",
    significance: "reconfiguración continental",
    intensity: "alta"
  }
};

Object.assign(TIMELINE_DETAIL_OVERRIDES, curatedTimelineDetailOverrides);

Object.assign(CURATED_TIMELINE_EXTRAS, curatedTimelineExtras);

function emitMapEvent(eventName) {
  (mapEventListeners[eventName] || []).forEach(listener => {
    try {
      listener();
    } catch (error) {
      console.error(`Error en listener de mapa: ${eventName}`, error);
    }
  });
}

const map = {
  scene: null,
  camera: null,
  options: {
    maxBoundsViscosity: 0.45,
    inertia: false
  },
  removeLayer() {},
  invalidateSize() {
    if (!viewer) {
      return;
    }
    viewer.resize();
    viewer.scene.requestRender();
  },
  setMinZoom() {},
  on(eventName, handler) {
    if (mapEventListeners[eventName]) {
      mapEventListeners[eventName].add(handler);
    }
  }
};

function initializeViewer() {
  if (viewer) {
    return viewer;
  }
  if (window.__geoRiskCesiumFallbackTimer) {
    clearTimeout(window.__geoRiskCesiumFallbackTimer);
    window.__geoRiskCesiumFallbackTimer = null;
  }
  const fallbackBanner = document.getElementById("fatal-error-banner");
  if (fallbackBanner?.textContent?.includes("Cesium")) {
    fallbackBanner.hidden = true;
    fallbackBanner.textContent = "";
  }

  viewer = new Cesium.Viewer("map", {
    animation: false,
    baseLayer: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    navigationHelpButton: false,
    maximumRenderTimeChange: Infinity,
    requestRenderMode: true,
    sceneModePicker: false,
    scene3DOnly: false,
    selectionIndicator: false,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    timeline: false
  });
  installSceneRenderScheduler();

  map.scene = viewer.scene;
  map.camera = viewer.camera;

  applyImageryForMode(true);
  viewer.scene.globe.show = true;
  viewer.scene.globe.baseColor = cssColorToCesiumColor("#2b5d7d", 1);
  viewer.scene.globe.showGroundAtmosphere = false;
  viewer.scene.backgroundColor = cssColorToCesiumColor("#04101c", 1);
  viewer.scene.skyBox.show = false;
  viewer.scene.skyAtmosphere.show = false;
  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;
  const preset = getPerformancePreset();
  viewer.targetFrameRate = preset.targetFrameRate;
  viewer.resolutionScale = preset.resolutionScale;
  viewer.scene.globe.enableLighting = false;
  viewer.scene.globe.depthTestAgainstTerrain = false;
  viewer.scene.globe.translucency.enabled = false;
  viewer.scene.globe.preloadAncestors = preset.preloadAncestors;
  viewer.scene.globe.preloadSiblings = preset.preloadSiblings;
  viewer.scene.globe.maximumScreenSpaceError = preset.maximumScreenSpaceError;
  viewer.scene.globe.tileCacheSize = preset.tileCacheSize;
  viewer.scene.globe.loadingDescendantLimit = preset.loadingDescendantLimit;
  viewer.scene.rethrowRenderErrors = false;
  viewer.scene.fxaa = preset.enableFxaa;
  if (viewer.scene.postProcessStages?.fxaa) {
    viewer.scene.postProcessStages.fxaa.enabled = preset.enableFxaa;
  }
  viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
  viewer.scene.screenSpaceCameraController.enableTilt = false;
  viewer.scene.screenSpaceCameraController.enableLook = false;
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 850000;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = getMaxGlobeDistance();
  viewer.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
  viewer.cesiumWidget.creditContainer.style.display = "none";

  try {
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  } catch (error) {
    console.error("No se pudo resetear la camara:", error);
  }

  const earthRadius = Cesium.Ellipsoid.WGS84.maximumRadius;
  viewer.camera.flyToBoundingSphere(
    new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, earthRadius),
    {
      offset: new Cesium.HeadingPitchRange(0, -1.03, getInitialGlobeDistance()),
      duration: 0
    }
  );

  viewer.camera.moveStart.addEventListener(() => {
    lastInteractionAt = Date.now();
    isCameraNavigating = true;
    emitMapEvent("dragstart");
    emitMapEvent("zoomstart");
    if (currentMapMode === "3d" && labelMode !== "none" && labelEntities.length) {
      clearMapLabels();
    }
    setNavigationQualityState(true);
  });

  viewer.camera.moveEnd.addEventListener(() => {
    lastInteractionAt = Date.now();
    isCameraNavigating = false;
    setNavigationQualityState(false);
    const nextBucket = getCurrentOverlayBucket();
    if (nextBucket !== lastOverlayBucket) {
      lastOverlayBucket = nextBucket;
      lastStyleRefreshSignature = "";
      refreshCountryStyles();
      if (nextBucket === "near") {
        scheduleDetailedOverlayUpgrade();
      }
    }
    renderMapLabels();
  });

  if (!globeAutoRotateHandlerAttached) {
    viewer.clock.onTick.addEventListener(handleAutoRotateTick);
    globeAutoRotateHandlerAttached = true;
  }

  viewer.scene.renderError.addEventListener(error => {
    console.error("Error de renderizado en Cesium:", error);
    viewer.resolutionScale = Math.max(0.62, viewer.resolutionScale - 0.08);
    viewer.scene.globe.maximumScreenSpaceError = Math.min(7, viewer.scene.globe.maximumScreenSpaceError + 0.6);
    viewer.scene.requestRender();
  });

  setTimeout(() => {
    map.invalidateSize();
    updateMapInteractionTuning();
    fitWorldView();
    lastOverlayBucket = getCurrentOverlayBucket();
    renderMapLabels();
  }, 200);

  currentMapMode = getDefaultMapMode();
  updateMapModeToggle();

  return viewer;
}

function fitWorldView() {
  if (!viewer) {
    return;
  }
  if (currentMapMode === "2d") {
    viewer.camera.cancelFlight();
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(-180, -70, 180, 85),
      duration: 0
    });
    viewer.scene.requestRender();
    return;
  }
  const earthRadius = Cesium.Ellipsoid.WGS84.maximumRadius;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = getMaxGlobeDistance();
  viewer.camera.flyToBoundingSphere(
    new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, earthRadius),
    {
      offset: new Cesium.HeadingPitchRange(0, -1.03, getInitialGlobeDistance()),
      duration: 0
    }
  );
  viewer.scene.requestRender();
}

function updateMapInteractionTuning() {
  if (!viewer) {
    return;
  }
  const preset = getPerformancePreset();
  viewer.targetFrameRate = preset.targetFrameRate;
  viewer.resolutionScale = preset.resolutionScale;
  viewer.scene.globe.maximumScreenSpaceError = preset.maximumScreenSpaceError;
  viewer.scene.globe.tileCacheSize = preset.tileCacheSize;
  viewer.scene.globe.loadingDescendantLimit = preset.loadingDescendantLimit;
  viewer.scene.globe.preloadAncestors = preset.preloadAncestors;
  viewer.scene.globe.preloadSiblings = preset.preloadSiblings;
  viewer.scene.fxaa = preset.enableFxaa;
  if (viewer.scene.postProcessStages?.fxaa) {
    viewer.scene.postProcessStages.fxaa.enabled = preset.enableFxaa;
  }
  const navigationTuning = typeof mapInteractionCore.getNavigationTuning === "function"
    ? mapInteractionCore.getNavigationTuning({ mode: currentMapMode, isMobile: isMobileLayout() })
    : null;
  viewer.scene.screenSpaceCameraController.inertiaSpin = navigationTuning?.inertiaSpin ?? (isMobileLayout() ? 0.58 : 0.78);
  viewer.scene.screenSpaceCameraController.inertiaTranslate = navigationTuning?.inertiaTranslate ?? (currentMapMode === "2d"
    ? (isMobileLayout() ? 0.07 : 0.12)
    : (isMobileLayout() ? 0.52 : 0.74));
  viewer.scene.screenSpaceCameraController.inertiaZoom = navigationTuning?.inertiaZoom ?? (currentMapMode === "2d"
    ? (isMobileLayout() ? 0.07 : 0.12)
    : (isMobileLayout() ? 0.46 : 0.62));
  viewer.scene.screenSpaceCameraController.enableRotate = currentMapMode !== "2d";
  viewer.scene.screenSpaceCameraController.enableTranslate = true;
  viewer.scene.screenSpaceCameraController.enableZoom = true;
  viewer.scene.screenSpaceCameraController.maximumMovementRatio = navigationTuning?.maximumMovementRatio ?? (currentMapMode === "2d"
    ? (isMobileLayout() ? 0.07 : 0.1)
    : (isMobileLayout() ? 0.15 : 0.17));
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = currentMapMode === "2d"
    ? Number.POSITIVE_INFINITY
    : getMaxGlobeDistance();
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = currentMapMode === "2d" ? 1 : 850000;
  viewer.scene.requestRenderMode = true;
  viewer.scene.maximumRenderTimeChange = currentMapMode === "2d" ? 0.06 : 0.28;
  viewer.scene.skyAtmosphere.show = qualityPreset === "high" && currentMapMode === "3d" && !document.body.classList.contains("presentation-mode");
  viewer.scene.globe.showGroundAtmosphere = qualityPreset === "high" && currentMapMode === "3d" && !document.body.classList.contains("presentation-mode");
  lastOverlayBucket = getCurrentOverlayBucket();
  requestSceneRender();
}

function updateMapModeToggle() {
  const button = document.getElementById("map-mode-toggle");
  if (!button) {
    return;
  }

  const nextMode = currentMapMode === "3d" ? "2d" : "3d";
  button.textContent = nextMode.toUpperCase();
  button.title = currentLanguage === "en"
    ? `Switch to ${nextMode.toUpperCase()} map`
    : `Cambiar a mapa ${nextMode.toUpperCase()}`;
}

function applyMapMode(mode, animate = true) {
  if (!viewer) {
    currentMapMode = mode;
    appStore?.setState({ mapMode: currentMapMode }, "map-mode");
    updateMapModeToggle();
    return;
  }

  if (detailedOverlayUpgradeTimer) {
    clearTimeout(detailedOverlayUpgradeTimer);
    detailedOverlayUpgradeTimer = null;
  }

  const normalizedMode = mode === "2d" ? "2d" : "3d";
  const previousMode = currentMapMode;
  const transitionPlan = typeof mapCore.getTransitionPlan === "function"
    ? mapCore.getTransitionPlan({ from: previousMode, to: normalizedMode, animate, isMobile: isMobileLayout() })
    : { duration: animate ? (normalizedMode === "2d" ? 0.55 : 0.72) : 0, settleMs: animate ? (normalizedMode === "2d" ? 580 : 850) : 0 };
  currentMapMode = normalizedMode;
  appStore?.setState({ mapMode: currentMapMode }, "map-mode");
  applyImageryForMode();

  if (normalizedMode === "2d") {
    viewer.scene.morphTo2D(transitionPlan.duration);
  } else {
    viewer.scene.morphTo3D(transitionPlan.duration);
  }

  updateMapInteractionTuning();
  setTimeout(async () => {
    await loadMap();
    fitWorldView();
    lastOverlayBucket = getCurrentOverlayBucket();
    renderMapLabels();
    viewer.scene.requestRender();
    updateAppStatusPanel();
  }, transitionPlan.settleMs);
  updateMapModeToggle();
  updateAppStatusPanel();
}

function toggleMapMode() {
  applyMapMode(currentMapMode === "3d" ? "2d" : "3d");
}
window.addEventListener("resize", () => {
  map.invalidateSize();
  updateMapInteractionTuning();
  updateAppStatusPanel();
});

let countriesData = {};
let countriesDataRevision = 0;
let countryValuesCache = null;
let countryEntriesCache = null;
const rankingCache = new Map();
const warParticipationCountCache = new Map();
let activeRankingKey = "";
let advancedRankingCache = typeof rankingsCore.createRankingsCache === "function"
  ? rankingsCore.createRankingsCache()
  : createFallbackCache();
let searchResultCache = typeof searchCore.createRecentSearchCache === "function"
  ? searchCore.createRecentSearchCache(18)
  : createFallbackSearchCache();
const countryStyleCache = typeof mapStyleCore.createCountryStyleCache === "function"
  ? mapStyleCore.createCountryStyleCache({ maxEntries: 2200 })
  : { clear() {}, get() {}, set(key, value) { return value; }, size() { return 0; } };
const mapDegradationLog = typeof mapCore.createDegradationLog === "function"
  ? mapCore.createDegradationLog(32)
  : { add() {}, list() { return []; }, count() { return 0; } };
let rawPoliticsSystems = {};
let rawHistorySystems = {};
let rawInflationByCode = {};
let populationGrowthByCode = {};
let countryCodeByEnglishName = new Map();
let wikipediaConflictDetailOverrides = {};
let loadConflictDetailsIndexPromise = null;
const conflictDetailShardPromises = new Map();
let mapNameAliasOverrides = {};
let mapNameAliasIndex = new Map();
let worldBankNameAliasOverrides = {};
let inflationFallbackByContinent = {};
let globalInflationFallback = null;
let countryAreaCache = {};
let selectedLayer = null;
let selectedLayers = [];
let continentBoundsLayer = null;
let worldPopulationTotal = 0;
let currentTheme = "default";
let currentMapMode = "3d";
let selectionMode = "country";
let compareSelection = [];
const compareDataCache = new Map();
let currentLanguage = "es";
let currentPanelState = { type: "empty" };
let savedFilters = [];
let savedViews = [];
let favoriteViews = [];
let searchHistory = [];
let savedSearches = [];
let quizQuestionBank = [];
let compareBenchmarkMode = "world";
let activeNewsTopic = "general";
let appMode = "default";
let performanceMonitorId = null;
let labelEntities = [];
let qualityPreset = localStorage.getItem("geo-risk-quality-preset") || "auto";
const constrainedInitialDevice =
  window.matchMedia("(max-width: 920px)").matches ||
  (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
let labelMode = localStorage.getItem("geo-risk-label-mode") || (constrainedInitialDevice ? "none" : "countries");
let autoRotateEnabled = localStorage.getItem("geo-risk-auto-rotate") === "true";
let lastInteractionAt = Date.now();
let isCameraNavigating = false;
let navigationQualityRestoreTimer = null;
let globeAutoRotateHandlerAttached = false;
let activeFocusToken = 0;
let lastOverlayBucket = "";
let lastStyleRefreshSignature = "";
let reducedPerformanceMode = false;
let reducedPerformanceReason = "";
let sustainedLowFpsWindows = 0;
let sustainedHighFpsWindows = 0;
let sustainedCriticalFpsWindows = 0;
let quizState = {
  category: "capital",
  difficulty: "easy",
  mode: "classic",
  asked: [],
  score: 0,
  total: 0,
  current: null,
  feedback: null,
  streak: 0,
  bestStreak: 0,
  mistakes: [],
  achievements: [],
  timeLeft: 0,
  timerId: null
};
const countryCodeLookup = new WeakMap();

const STORAGE_KEYS = {
  filters: "geo-risk-saved-filters",
  language: "geo-risk-language",
  presentation: "geo-risk-presentation-mode",
  views: "geo-risk-saved-views",
  favorites: "geo-risk-favorite-views",
  helpSeen: "geo-risk-help-seen",
  introSeen: "geo-risk-intro-seen",
  appMode: "geo-risk-app-mode",
  qualityPreset: "geo-risk-quality-preset",
  labelMode: "geo-risk-label-mode",
  autoRotate: "geo-risk-auto-rotate",
  searchHistory: "geo-risk-search-history",
  savedSearches: "geo-risk-saved-searches"
};
const countryLayers = new Map();
const countryAliases = new Map();
const continentAliases = new Map();
const religionAliases = new Map();
const religionDenominationAliases = new Map();
const systemAliases = new Map();
const organizationAliases = new Map();
const historyTypeAliases = new Map();
const originAliases = new Map();
const rivalAliases = new Map();
const languageAliases = new Map();
const blocAliases = new Map();
const metropoleAliases = new Map();
const conflictAliases = new Map();
const periodAliases = new Map();
const suggestionItems = [];
const countryClickTargets = new Map();
const mobileMediaQuery = window.matchMedia("(max-width: 820px)");
const TERRITORY_LINKS = {
  FRA: ["GUF", "NCL", "ATF"],
  GUF: ["FRA"],
  NCL: ["FRA"],
  ATF: ["FRA"],
  DNK: ["GRL"],
  GRL: ["DNK"],
  GBR: ["FLK", "BMU"],
  FLK: ["GBR"],
  BMU: ["GBR"],
  USA: ["PRI"],
  PRI: ["USA"]
};
const SYMBOL_IMAGE_CODES = new Set(["ARG", "BRA", "USA", "CHN", "GBR", "FRA", "DEU", "IND", "BHS", "GRL", "MKD", "PSE", "SRB", "TWN", "TZA"]);
const COAT_IMAGE_CODES = new Set(["ARG", "BRA", "USA", "CHN"]);

const RELIGION_FAMILY_RULES = [
  {
    key: "cristianismo",
    label: "Cristianismo",
    aliases: ["cristianismo", "cristianos", "cristiano", "cristianas"],
    matches: ["catol", "protest", "ortodox", "anglican", "cristian", "mormon", "copta", "evangelic"]
  },
  {
    key: "islam",
    label: "Islam",
    aliases: ["islam", "musulmanes", "musulman", "musulmana", "musulmanas", "islamicos", "islamico"],
    matches: ["musulman", "sunita", "chiita", "ibadi", "islam"]
  },
  {
    key: "judaísmo",
    label: "Juda\u00edsmo",
    aliases: ["judaismo", "juda\u00edsmo", "judios", "jud\u00edos", "judio", "jud\u00edo", "judia", "jud\u00eda", "judias", "jud\u00edas"],
    matches: ["judio", "judia", "judais"]
  },
  {
    key: "hinduismo",
    label: "Hinduismo",
    aliases: ["hinduismo", "hindues", "hind\u00faes", "hindu", "hind\u00fa"],
    matches: ["hindu"]
  },
  {
    key: "budismo",
    label: "Budismo",
    aliases: ["budismo", "budistas", "budista"],
    matches: ["budis"]
  },
  {
    key: "sijismo",
    label: "Sijismo",
    aliases: ["sijismo", "sijs", "sij", "sikh", "sikhs"],
    matches: ["sij", "sikh"]
  },
  {
    key: "sintoísmo",
    label: "Sinto\u00edsmo",
    aliases: ["sintoismo", "sinto\u00edsmo", "sintoistas", "sinto\u00edstas", "sintoista", "sinto\u00edsta", "shinto", "shintoismo"],
    matches: ["sinto", "shinto"]
  },
  {
    key: "zoroastrismo",
    label: "Zoroastrismo",
    aliases: ["zoroastrismo", "zoroastros", "zoroastro", "zoroastrianos"],
    matches: ["zoroastr"]
  },
  {
    key: "no afiliados",
    label: "Ateos / agn\u00f3sticos / sin afiliaci\u00f3n",
    aliases: ["ateos", "ateo", "agnosticos", "agn\u00f3sticos", "agnostico", "agn\u00f3stico", "sin religion", "sin religi\u00f3n", "sin afiliacion", "sin afiliaci\u00f3n", "no afiliados", "no creyentes"],
    matches: ["ateo", "agnostic", "sin afili", "no afili", "no relig", "sin religion"]
  },
  {
    key: "animismo",
    label: "Religiones animistas y populares",
    aliases: ["animismo", "animistas", "religiones animistas", "religiones populares", "religiones tradicionales", "tradicionales"],
    matches: ["animist", "tradicional", "religiones populares"]
  },
  {
    key: "vudú",
    label: "Vudú",
    aliases: ["vudu", "vudú", "vodoo", "voodoo"],
    matches: ["vudu", "vodoo", "voodoo"]
  }
];

const INFLATION_OVERRIDES = {
  AND: 3.2,
  ATA: 0,
  ATF: 2.4,
  BMU: 3.4,
  "CS-KM": 4.9,
  CUB: 18.5,
  ERI: 7.4,
  ESH: 2.8,
  FLK: 4.0,
  GRL: 3.1,
  GUF: 3.0,
  PRI: 2.8,
  PRK: 4.2,
  SOM: 6.1,
  TKM: 8.6,
  TWN: 2.3,
  "-99": 6.0
};

const UI_STRINGS = {
  es: {
    compareTitle: "Comparador",
    compareHint: "Agrega hasta 3 paises desde la ficha o el buscador.",
    addToCompare: "Agregar al comparador",
    general: "General",
    history: "Historia",
    economy: "Economia",
    military: "Militar",
    politics: "Politica",
    religion: "Religion",
    relations: "Relaciones",
    population: "Poblacion",
    continent: "Continente",
    geography: "Capital",
    cities: "Ciudades destacadas",
    origin: "Origen",
    type: "Tipo",
    formationYear: "Año de formación",
    timeline: "Linea de tiempo",
    politicalSystem: "Sistema politico",
    organizations: "Organizaciones",
    historicalRivals: "Rivales historicos",
    currentRivals: "Rivales actuales",
    linkedTerritories: "Territorios vinculados",
    gdp: "PBI",
    gdpPerCapita: "PBI per capita",
    inflation: "Inflacion",
    activePersonnel: "Personal activo",
    reserve: "Reserva",
    comparePopulation: "Poblacion",
    compareGdp: "PBI",
    compareGdpPerCapita: "PBI per capita",
    compareInflation: "Inflacion",
    compareSystem: "Sistema politico",
    compareReligion: "Religion principal",
    compareYear: "Año de formacion",
    noData: "Sin datos",
    topGdp: "Top PBI",
    topInflation: "Top Inflacion",
    systems: "Sistemas politicos"
  },
  en: {
    compareTitle: "Comparer",
    compareHint: "Add up to 3 countries from the detail card or the search box.",
    addToCompare: "Add to comparer",
    general: "General",
    history: "History",
    economy: "Economy",
    military: "Military",
    politics: "Politics",
    religion: "Religion",
    relations: "Relations",
    population: "Population",
    continent: "Continent",
    geography: "Capital",
    cities: "Key cities",
    origin: "Origin",
    type: "Type",
    formationYear: "Formation year",
    timeline: "Timeline",
    politicalSystem: "Political system",
    organizations: "Organizations",
    historicalRivals: "Historical rivals",
    currentRivals: "Current rivals",
    linkedTerritories: "Linked territories",
    gdp: "GDP",
    gdpPerCapita: "GDP per capita",
    inflation: "Inflation",
    activePersonnel: "Active personnel",
    reserve: "Reserve",
    comparePopulation: "Population",
    compareGdp: "GDP",
    compareGdpPerCapita: "GDP per capita",
    compareInflation: "Inflation",
    compareSystem: "Political system",
    compareReligion: "Main religion",
    compareYear: "Formation year",
    noData: "No data",
    topGdp: "Top GDP",
    topInflation: "Top Inflation",
    systems: "Political systems"
  }
};

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "Sin datos";
  }

  return Number(value).toLocaleString("es-AR");
}

function getUniqueDisplayLabels(values = []) {
  const labelsByKey = new Map();
  const getDisplayScore = label =>
    ((label.match(/[^\u0000-\u007f]/g) || []).length * 3) +
    (/^[A-ZÁÉÍÓÚÜÑ]/.test(label) ? 1 : 0);

  values.forEach(value => {
    const label = repairMojibake(String(value || "")).trim();
    const key = normalizeText(label);
    if (!key) {
      return;
    }
    const current = labelsByKey.get(key);
    if (!current || getDisplayScore(label) > getDisplayScore(current)) {
      labelsByKey.set(key, label);
    }
  });

  return [...labelsByKey.values()].sort((a, b) => a.localeCompare(b, "es"));
}

function formatPercentage(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0%";
  }

  return `${value.toLocaleString("es-AR", {
    minimumFractionDigits: value >= 10 ? 1 : 2,
    maximumFractionDigits: value >= 10 ? 1 : 2
  })}%`;
}

function parseInflationValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const cleaned = String(value)
    .replace(/[%~â‰ˆ]/g, "")
    .replace(",", ".")
    .trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatInflation(value) {
  const parsed = parseInflationValue(value);
  if (!isValidInflationValue(parsed)) {
    return t("noData");
  }

  return `${parsed.toLocaleString("es-AR", {
    minimumFractionDigits: parsed >= 10 ? 1 : 1,
    maximumFractionDigits: 1
  })}%`;
}

function repairMojibake(value) {
  const raw = String(value || "");
  if (!raw || !(/[ÃƒÃ‚Ã¢â‚¬Å“Ã¢â‚¬\uFFFDÂâã]/.test(raw) || /ã|â|Â/.test(raw))) {
    return raw;
  }

  return raw
    .replace(/ÃƒÂ¡/g, "Ã¡")
    .replace(/ÃƒÂ©/g, "Ã©")
    .replace(/ÃƒÂ­/g, "Ã­")
    .replace(/ÃƒÂ³/g, "Ã³")
    .replace(/ÃƒÂº/g, "Ãº")
    .replace(/ÃƒÂ±/g, "Ã±")
    .replace(/ÃƒÂ¼/g, "Ã¼")
    .replace(/ÃƒÂ/g, "Ã")
    .replace(/Ãƒâ€°/g, "Ã‰")
    .replace(/ÃƒÂ/g, "Ã")
    .replace(/Ãƒâ€œ/g, "Ã“")
    .replace(/ÃƒÅ¡/g, "Ãš")
    .replace(/Ãƒâ€˜/g, "Ã‘")
    .replace(/ÃƒÅ“/g, "Ãœ")
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Ã¼/g, "ü")
    .replace(/Ã¨/g, "è")
    .replace(/Ã /g, "à")
    .replace(/Ã¬/g, "ì")
    .replace(/Ã²/g, "ò")
    .replace(/Ã¹/g, "ù")
    .replace(/Ã¢/g, "â")
    .replace(/Ãª/g, "ê")
    .replace(/Ã®/g, "î")
    .replace(/Ã´/g, "ô")
    .replace(/Ã»/g, "û")
    .replace(/Ã§/g, "ç")
    .replace(/ã¡/g, "á")
    .replace(/ã©/g, "é")
    .replace(/ã­/g, "í")
    .replace(/ã³/g, "ó")
    .replace(/ãº/g, "ú")
    .replace(/ã±/g, "ñ")
    .replace(/Ã/g, "Á")
    .replace(/Ã‰/g, "É")
    .replace(/Ã/g, "Í")
    .replace(/Ã“/g, "Ó")
    .replace(/Ãš/g, "Ú")
    .replace(/Ã‘/g, "Ñ")
    .replace(/Ãœ/g, "Ü")
    .replace(/Â·/g, "·")
    .replace(/Â¿/g, "¿")
    .replace(/Â¡/g, "¡")
    .replace(/Â²/g, "²")
    .replace(/Â³/g, "³")
    .replace(/Ã¢â‚¬â€œ/g, "-")
    .replace(/Ã¢â‚¬â€/g, "-")
    .replace(/Ã¢â‚¬Ëœ|Ã¢â‚¬â„¢/g, "'")
    .replace(/Ã¢â‚¬Å“|Ã¢â‚¬ï¿½/g, "\"")
    .replace(/â€¢/g, "•")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/â€˜/g, "‘")
    .replace(/â€™/g, "’")
    .replace(/â€œ/g, "“")
    .replace(/â€/g, "”")
    .replace(/â€¦/g, "…")
    .replace(/Ã‚/g, "");
}

function normalizeText(value) {
  return repairMojibake(String(value || ""))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const HISTORICAL_FORMATION_TYPES = new Set([
  "legal y pacifica",
  "independencia",
  "union",
  "disolucion de otro estado",
  "revolucion",
  "guerra civil"
]);

const POLITICAL_SYSTEM_OVERRIDES = {
  AFG: "Teocracia",
  ARE: "Monarquia constitucional",
  AUS: "Monarquia constitucional",
  AUT: "Parlamentarismo",
  BHS: "Monarquia constitucional",
  BHR: "Monarquia constitucional",
  BLZ: "Monarquia constitucional",
  BMU: "Monarquia constitucional",
  BTN: "Monarquia constitucional",
  CAN: "Monarquia constitucional",
  CAF: "Presidencialismo",
  CHE: "Parlamentarismo",
  COM: "Presidencialismo",
  CRI: "Presidencialismo",
  DJI: "Presidencialismo",
  DOM: "Presidencialismo",
  ERI: "Presidencialismo",
  ETH: "Parlamentarismo",
  FJI: "Parlamentarismo",
  FLK: "Monarquia constitucional",
  ATA: "Sistema del Tratado Antartico",
  FRA: "Semipresidencialismo",
  GHA: "Presidencialismo",
  GRL: "Monarquia constitucional",
  GIN: "Presidencialismo",
  GNB: "Semipresidencialismo",
  GNQ: "Presidencialismo",
  GUF: "Semipresidencialismo",
  HTI: "Semipresidencialismo",
  IRQ: "Parlamentarismo",
  JAM: "Monarquia constitucional",
  JOR: "Monarquia constitucional",
  KEN: "Presidencialismo",
  KHM: "Monarquia constitucional",
  KWT: "Monarquia constitucional",
  LBR: "Presidencialismo",
  LKA: "Semipresidencialismo",
  LSO: "Monarquia constitucional",
  MAR: "Monarquia constitucional",
  MEX: "Presidencialismo",
  MLI: "Semipresidencialismo",
  MOZ: "Presidencialismo",
  MRT: "Presidencialismo",
  MWI: "Presidencialismo",
  NAM: "Presidencialismo",
  NER: "Semipresidencialismo",
  NGA: "Presidencialismo",
  NCL: "Semipresidencialismo",
  NPL: "Parlamentarismo",
  PAK: "Parlamentarismo",
  PNG: "Parlamentarismo",
  PRY: "Presidencialismo",
  PRI: "Presidencialismo",
  PSE: "Semipresidencialismo",
  QAT: "Monarquia absoluta",
  SDN: "Presidencialismo",
  SLB: "Monarquia constitucional",
  SOM: "Parlamentarismo",
  SRB: "Parlamentarismo",
  SSD: "Presidencialismo",
  TCD: "Presidencialismo",
  TGO: "Presidencialismo",
  TWN: "Semipresidencialismo",
  TZA: "Presidencialismo",
  USA: "Presidencialismo",
  VUT: "Parlamentarismo",
  YEM: "Presidencialismo",
  ZAF: "Parlamentarismo",
  ZWE: "Presidencialismo"
};

function getPoliticalSystemCandidates(country) {
  const code = country.code || "";
  return [
    country.politics?.system,
    rawPoliticsSystems[code],
    rawHistorySystems[code]?.type
  ].filter(Boolean);
}

function normalizePoliticalSystem(country) {
  const code = country.code || "";
  if (POLITICAL_SYSTEM_OVERRIDES[code]) {
    return POLITICAL_SYSTEM_OVERRIDES[code];
  }

  for (const candidate of getPoliticalSystemCandidates(country)) {
    const system = normalizeText(candidate);
    if (!system || HISTORICAL_FORMATION_TYPES.has(system)) {
      continue;
    }

    if (system.includes("teocrat") || system.includes("estado islamico") || system.includes("republica islamica")) {
      return "Teocracia";
    }

    if (system.includes("semipresid")) {
      return "Semipresidencialismo";
    }

    if (system.includes("presidenc")) {
      return "Presidencialismo";
    }

    if (system.includes("monarquia absoluta")) {
      return "Monarquia absoluta";
    }

    if (
      system.includes("coprincipado") ||
      system.includes("monarquia constitucional") ||
      system.includes("monarquia parlamentaria") ||
      system.includes("monarquia federal") ||
      system === "monarquia"
    ) {
      return "Monarquia constitucional";
    }

    if (
      system.includes("directorial") ||
      system.includes("westminster") ||
      system.includes("parlament") ||
      system.includes("democracia parlamentaria")
    ) {
      return "Parlamentarismo";
    }

    if (
      system.includes("republica presidencial") ||
      system === "republica federal" ||
      system === "republica" ||
      system === "republica democratica" ||
      system === "democracia" ||
      system === "democracia representativa" ||
      system === "estado unitario" ||
      system === "federacion" ||
      system === "pais" ||
      system === "pais insular" ||
      system === "estado archipelagico" ||
      system.includes("socialista") ||
      system.includes("partido unico") ||
      system.includes("republica popular") ||
      system.includes("depend") ||
      system.includes("territorio") ||
      system.includes("ultramar")
    ) {
      return "Presidencialismo";
    }
  }

  return "Sin datos";
}

const HISTORY_TYPE_OVERRIDES = {
  BGD: "Independencia",
  BIH: "Guerra civil",
  BLR: "Disolucion de otro estado",
  ERI: "Guerra civil",
  EST: "Disolucion de otro estado",
  HRV: "Guerra civil",
  KGZ: "Disolucion de otro estado",
  KAZ: "Disolucion de otro estado",
  LVA: "Disolucion de otro estado",
  LTU: "Disolucion de otro estado",
  MKD: "Disolucion de otro estado",
  MDA: "Disolucion de otro estado",
  RUS: "Disolucion de otro estado",
  SSD: "Independencia",
  SVN: "Guerra civil",
  TJK: "Disolucion de otro estado",
  TKM: "Disolucion de otro estado",
  UKR: "Disolucion de otro estado",
  UZB: "Disolucion de otro estado",
  USA: "Independencia"
};

function normalizeHistoryType(country) {
  const code = country.code || "";
  if (HISTORY_TYPE_OVERRIDES[code]) {
    return HISTORY_TYPE_OVERRIDES[code];
  }

  const current = normalizeText(country.history?.type);
  if (!current) {
    return "Sin datos";
  }

  if (current !== "legal y pacifica") {
    return translateHistoryText(country.history.type);
  }

  const origin = normalizeText(country.history?.origin);
  if (
    /britan|frances|espan|portugues|neerland|holand|belga|danes|ottoman|otomano|mandato|protectorado|colonia|territorio frances|territorio britanico|raj/.test(origin)
  ) {
    return "Independencia";
  }

  if (/union sovietica|sovietic|yugoslav|checoslova|imperio ruso|republica popular hungara|republica socialista|popular de albania/.test(origin)) {
    return "Disolucion de otro estado";
  }

  if (/federacion de las indias occidentales|mancomunidad|commonwealth realm|basutolandia|bechuanalandia|costa de oro britanica/.test(origin)) {
    return "Independencia";
  }

  return "Legal y pacifica";
}

function escapeHtml(value) {
  return repairMojibake(String(value || ""))
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function levenshteinDistance(a, b) {
  const left = normalizeText(a);
  const right = normalizeText(b);

  if (!left.length) {
    return right.length;
  }

  if (!right.length) {
    return left.length;
  }

  const matrix = Array.from({ length: left.length + 1 }, () => []);

  for (let i = 0; i <= left.length; i += 1) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= right.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[left.length][right.length];
}

function getSearchScore(query, candidate) {
  const normalizedQuery = normalizeText(query);
  const normalizedCandidate = normalizeText(candidate);

  if (!normalizedQuery || !normalizedCandidate) {
    return Number.POSITIVE_INFINITY;
  }

  if (normalizedCandidate === normalizedQuery) {
    return 0;
  }

  if (normalizedCandidate.startsWith(normalizedQuery)) {
    return 1;
  }

  if (getInitialism(normalizedCandidate) === normalizedQuery) {
    return 1.5;
  }

  const queryTokens = normalizedQuery.split(" ");
  const candidateTokens = normalizedCandidate.split(" ");

  if (queryTokens.every(token => candidateTokens.some(candidateToken => candidateToken.startsWith(token)))) {
    return 2;
  }

  if (queryTokens.every(token => normalizedCandidate.includes(token))) {
    return 2.5;
  }

  if (normalizedCandidate.includes(normalizedQuery)) {
    return 3;
  }

  const distance = levenshteinDistance(normalizedQuery, normalizedCandidate);
  const threshold = normalizedQuery.length <= 5 ? 1 : 2;
  if (distance <= threshold) {
    return 4 + distance;
  }

  const tokenDistances = queryTokens.map(token => {
    const tokenThreshold = token.length <= 4 ? 1 : 2;
    const best = candidateTokens.reduce((minDistance, candidateToken) =>
      Math.min(minDistance, levenshteinDistance(token, candidateToken)), Number.POSITIVE_INFINITY);
    return best <= tokenThreshold ? best : Number.POSITIVE_INFINITY;
  });

  return tokenDistances.every(Number.isFinite)
    ? 6 + tokenDistances.reduce((sum, value) => sum + value, 0)
    : Number.POSITIVE_INFINITY;
}

const TOP_CATEGORY_LABEL_REPLACEMENTS = new Map([
  ["ABCANZ Armies", "Ej\u00e9rcitos ABCANZ"],
  ["Air Force Interoperability Consejo", "Consejo de Interoperabilidad de Fuerzas A\u00e9reas"],
  ["ASEAN Regional Forum", "Foro Regional de la ASEAN"],
  ["Combined Communications-Electronics Board", "Junta Combinada de Comunicaciones y Electr\u00f3nica"],
  ["Multinational Joint Task Force", "Fuerza Multinacional Conjunta"],
  ["Commonwealth", "Mancomunidad de Naciones"],
  ["Francofonia", "Francofon\u00eda"],
  ["OIC", "OCI"],
  ["Alianza del Pacifico", "Alianza del Pac\u00edfico"],
  ["Tratado Antartico", "Tratado Ant\u00e1rtico"],
  ["Sistema del Tratado Antartico", "Sistema del Tratado Ant\u00e1rtico"],
  ["Organizaci\u00f3n de las Naciones Unidas (UN)", "Organizaci\u00f3n de las Naciones Unidas (ONU)"],
  ["Organizaci\u00f3n de los Estados Americanos (OAS)", "Organizaci\u00f3n de los Estados Americanos (OEA)"],
  ["Organizaci\u00f3n de Pa\u00edses Exportadores de Petr\u00f3leo (OPEC)", "Organizaci\u00f3n de Pa\u00edses Exportadores de Petr\u00f3leo (OPEP)"],
  ["Fondo Monetario Internacional (IMF)", "Fondo Monetario Internacional (FMI)"],
  ["Uni\u00f3n Africana (AU)", "Uni\u00f3n Africana (UA)"],
  ["Organizaci\u00f3n Mundial de Aduanas (WCO)", "Organizaci\u00f3n Mundial de Aduanas (OMA)"],
  ["Banco Internacional de Reconstrucci\u00f3n y Fomento (IBRD)", "Banco Internacional de Reconstrucci\u00f3n y Fomento (BIRF)"],
  ["Uni\u00f3n Internacional de Telecomunicaciones (ITU)", "Uni\u00f3n Internacional de Telecomunicaciones (UIT)"],
  ["Organizaci\u00f3n Meteorol\u00f3gica Mundial (WMO)", "Organizaci\u00f3n Meteorol\u00f3gica Mundial (OMM)"],
  ["Organizaci\u00f3n para la Prohibici\u00f3n de Armas Qu\u00edmicas (OPCW)", "Organizaci\u00f3n para la Prohibici\u00f3n de Armas Qu\u00edmicas (OPAQ)"],
  ["Tratado de No Proliferaci\u00f3n Nuclear (NPT)", "Tratado de No Proliferaci\u00f3n Nuclear (TNP)"],
  ["Centro Internacional de Arreglo de Diferencias Relativas a Inversiones (ICSID)", "Centro Internacional de Arreglo de Diferencias Relativas a Inversiones (CIADI)"],
  ["Organizaci\u00f3n Hidrogr\u00e1fica Internacional (IHO)", "Organizaci\u00f3n Hidrogr\u00e1fica Internacional (OHI)"],
  ["Organizaci\u00f3n Internacional de Protecci\u00f3n Civil (ICDO)", "Organizaci\u00f3n Internacional de Protecci\u00f3n Civil (OIPC)"],
  ["Organizaci\u00f3n para la Cooperaci\u00f3n Isl\u00e1mica (OIC)", "Organizaci\u00f3n para la Cooperaci\u00f3n Isl\u00e1mica (OCI)"],
  ["Banco Asi\u00e1tico de Desarrollo (ADB)", "Banco Asi\u00e1tico de Desarrollo (BAsD)"],
  ["Grupo de abastecedores nucleares (NSG)", "Grupo de abastecedores nucleares (GSN)"],
  ["Consejo de Europa (CoE)", "Consejo de Europa (CdE)"],
  ["Organizaci\u00f3n para la Cooperaci\u00f3n y el Desarrollo Econ\u00f3mico (OECD)", "Organizaci\u00f3n para la Cooperaci\u00f3n y el Desarrollo Econ\u00f3mico (OCDE)"],
  ["R\u00e9gimen de Control de Tecnolog\u00eda Misil\u00edstica (MTCR)", "R\u00e9gimen de Control de Tecnolog\u00eda Misil\u00edstica (RCTM)"],
  ["OTAN (NATO)", "OTAN"],
  ["UNESCO (UNESCO)", "UNESCO"]
].map(([source, target]) => [normalizeText(source), target]));

const NON_POLITICAL_SYSTEM_TOP_LABELS = new Set([
  "legal y pacifica",
  "independencia",
  "union",
  "disolucion de otro estado",
  "revolucion",
  "guerra civil",
  "tratado internacional"
]);

const POLITICAL_SYSTEM_TOP_REPLACEMENTS = new Map([
  ["monarquia constitucional", "Monarqu\u00eda constitucional"],
  ["monarquia parlamentaria", "Monarqu\u00eda constitucional"],
  ["monarquia absoluta", "Monarqu\u00eda absoluta"],
  ["parlamentarismo", "Parlamentarismo"],
  ["sistema westminster", "Parlamentarismo"],
  ["republica parlamentaria", "Rep\u00fablica parlamentaria"],
  ["presidencialismo", "Presidencialismo"],
  ["republica presidencialista", "Rep\u00fablica presidencialista"],
  ["semipresidencialismo", "Semipresidencialismo"],
  ["republica semipresidencialista", "Rep\u00fablica semipresidencialista"],
  ["republica federal", "Rep\u00fablica federal"],
  ["republica federal presidencialista", "Rep\u00fablica federal presidencialista"],
  ["pais", "Estado soberano"],
  ["republica", "Rep\u00fablica"],
  ["estado soberano", "Estado soberano"],
  ["territorio no incorporado de estados unidos", "Territorio no incorporado de Estados Unidos"],
  ["territorio britanico de ultramar", "Territorio brit\u00e1nico de ultramar"],
  ["territorio frances de ultramar", "Territorio franc\u00e9s de ultramar"],
  ["departamento y region de ultramar de francia", "Departamento y regi\u00f3n de ultramar de Francia"],
  ["sistema del tratado antartico", "Sistema del Tratado Ant\u00e1rtico"]
]);

function normalizeCategoryLabel(value) {
  const label = String(value || "Sin datos")
    .replace(/\s+/g, " ")
    .trim();
  return TOP_CATEGORY_LABEL_REPLACEMENTS.get(normalizeText(label)) || label;
}

function normalizePoliticalSystemCategory(value) {
  const label = normalizeCategoryLabel(value);
  const normalized = normalizeText(label);
  if (!normalized || label === "Sin datos") {
    return "Sin datos";
  }
  if (NON_POLITICAL_SYSTEM_TOP_LABELS.has(normalized)) {
    return "Estado soberano";
  }
  return POLITICAL_SYSTEM_TOP_REPLACEMENTS.get(normalized) || label;
}

function uniqueNormalizedList(items) {
  return (items || []).filter(Boolean).filter((item, index, list) =>
    index === list.findIndex(other => normalizeText(other) === normalizeText(item))
  );
}

function uniqueBy(items, getKey) {
  const list = Array.isArray(items) ? items : [];
  const keyFn = typeof getKey === "function" ? getKey : (item => item);
  const seen = new Set();
  return list.filter(item => {
    if (!item) {
      return false;
    }
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function invalidateCountryDerivedCaches() {
  countriesDataRevision += 1;
  countryValuesCache = null;
  countryEntriesCache = null;
  rankingCache.clear();
  warParticipationCountCache.clear();
  advancedRankingCache.invalidate();
  searchResultCache.clear();
  compareDataCache.clear();
  quizQuestionBank = [];
  countryStyleCache.clear();
  lastStyleRefreshSignature = "";
}

function getCountryValues() {
  if (!countryValuesCache) {
    countryValuesCache = Object.values(countriesData);
  }
  return countryValuesCache;
}

function getCountryEntries() {
  if (!countryEntriesCache) {
    countryEntriesCache = Object.entries(countriesData);
  }
  return countryEntriesCache;
}

function getCachedRanking(key, buildFn) {
  const cacheKey = `${key}:${countriesDataRevision}:${currentLanguage}`;
  if (!rankingCache.has(cacheKey)) {
    rankingCache.set(cacheKey, buildFn());
  }
  return rankingCache.get(cacheKey);
}

function yieldToMainThread() {
  return new Promise(resolve => {
    if (typeof scheduler !== "undefined" && typeof scheduler.postTask === "function") {
      scheduler.postTask(resolve, { priority: "background" });
      return;
    }
    setTimeout(resolve, 0);
  });
}

function scheduleWhenGlobeIsQuiet(task, {
  delay = 0,
  quietFor = isMobileLayout() ? 7000 : 4500,
  timeout = isMobileLayout() ? 90000 : 60000
} = {}) {
  const scheduleWhenQuiet = bootScheduler.scheduleWhenQuiet || ((callback, options = {}) => setTimeout(callback, options.delay || 0));
  scheduleWhenQuiet(task, {
    delay,
    quietFor,
    timeout,
    isQuiet: () => !isCameraNavigating && Date.now() - lastInteractionAt >= quietFor,
    isVisible: () => document.visibilityState !== "hidden"
  });
}

function compactNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Sin datos";
  }

  return new Intl.NumberFormat("es-AR", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(Number(value));
}

function getInitialism(value) {
  return normalizeText(value)
    .split(" ")
    .filter(Boolean)
    .map(token => token[0])
    .join("");
}

function t(key) {
  return UI_STRINGS[currentLanguage]?.[key] || UI_STRINGS.es[key] || key;
}

function renderList(items) {
  if (!items || !items.length) {
    return "<p>Sin datos</p>";
  }

  return `<ul>${items.map(item => `<li>${escapeHtml(repairMojibake(item))}</li>`).join("")}</ul>`;
}

function renderCountryActionList(countries, detailBuilder = null) {
  const uniqueCountries = uniqueBy(countries || [], country => getRankedCountryCode(country) || country?.name)
    .filter(Boolean)
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "es"));
  if (!uniqueCountries.length) {
    return "<p>Sin datos</p>";
  }

  return `<ul class="country-action-list">${uniqueCountries.map(country => {
    const code = getRankedCountryCode(country);
    const detail = typeof detailBuilder === "function" ? detailBuilder(country) : "";
    if (!code) {
      return `<li>${escapeHtml(country.name || t("noData"))}${detail ? ` <small>${escapeHtml(detail)}</small>` : ""}</li>`;
    }
    return `
      <li>
        <button type="button" data-open-country="${escapeHtml(code)}">
          <span>${getFlagEmoji(code)} ${escapeHtml(country.name || code)}</span>
          ${detail ? `<small>${escapeHtml(detail)}</small>` : ""}
        </button>
      </li>
    `;
  }).join("")}</ul>`;
}

function isMobileLayout() {
  return mobileMediaQuery.matches;
}

function closeMobileHubPanels() {
  ["compare-hub-panel", "quiz-hub-panel", "news-hub-panel"].forEach(id => {
    const panel = document.getElementById(id);
    if (panel) {
      panel.open = false;
    }
  });
}

function closeMobileMoreMenu() {
  const menu = document.getElementById("mobile-more-menu");
  if (menu) {
    menu.hidden = true;
  }
  document.body.classList.remove("mobile-more-open");
}

function syncMobilePanelControlState() {
  const leftButton = document.getElementById("toggle-left-panel");
  const toolsButton = document.getElementById("toggle-tools-panel");
  const countryButton = document.getElementById("toggle-country-panel");
  const moreButton = document.getElementById("toggle-more-panel");
  const countryModal = document.getElementById("country-modal");
  const moreMenu = document.getElementById("mobile-more-menu");
  const hasSelectedCountry = Boolean(
    currentPanelState?.type === "country" &&
    currentPanelState?.code &&
    countriesData[currentPanelState.code]
  );

  leftButton?.setAttribute("aria-expanded", String(document.body.classList.contains("mobile-left-open")));
  toolsButton?.setAttribute("aria-expanded", String(document.body.classList.contains("mobile-tools-open")));
  moreButton?.setAttribute("aria-expanded", String(Boolean(moreMenu && !moreMenu.hidden)));
  if (countryButton) {
    countryButton.disabled = !hasSelectedCountry;
    countryButton.setAttribute("aria-disabled", String(!hasSelectedCountry));
    countryButton.setAttribute("aria-expanded", String(hasSelectedCountry && Boolean(countryModal && !countryModal.hidden)));
    countryButton.title = hasSelectedCountry
      ? (currentLanguage === "en" ? "Open selected country profile" : "Abrir ficha del pais seleccionado")
      : (currentLanguage === "en" ? "Select a country on the map first" : "Primero selecciona un pais en el mapa");
  }
}

function closeMobilePanels() {
  document.body.classList.remove("mobile-left-open", "mobile-country-open", "mobile-tools-open");
  closeMobileMoreMenu();

  const toolbar = document.getElementById("map-toolbar");
  if (toolbar && isMobileLayout()) {
    toolbar.open = false;
  }
  syncMobilePanelControlState();
}

function openMobilePanel(panel) {
  if (!isMobileLayout()) {
    return;
  }

  closeMobileHubPanels();
  closeMobileMoreMenu();
  document.body.classList.remove("mobile-left-open", "mobile-country-open", "mobile-tools-open");

  if (panel === "left") {
    document.body.classList.add("mobile-left-open");
    const rankingsPanel = document.getElementById("rankings-panel");
    if (rankingsPanel) {
      rankingsPanel.open = true;
    }
  } else if (panel === "tools") {
    document.body.classList.add("mobile-tools-open");
    const toolbar = document.getElementById("map-toolbar");
    if (toolbar) {
      toolbar.open = true;
    }
  } else {
    document.body.classList.add("mobile-country-open");
  }
  syncMobilePanelControlState();
}

function toggleMobileMoreMenu() {
  if (!isMobileLayout()) {
    return;
  }

  const menu = document.getElementById("mobile-more-menu");
  if (!menu) {
    return;
  }

  const shouldOpen = menu.hidden;
  closeMobilePanels();
  closeMobileHubPanels();
  menu.hidden = !shouldOpen;
  document.body.classList.toggle("mobile-more-open", shouldOpen);
  syncMobilePanelControlState();
}

function toggleMobilePanel(panel) {
  if (!isMobileLayout()) {
    return;
  }

  const className =
    panel === "left"
      ? "mobile-left-open"
      : panel === "tools"
        ? "mobile-tools-open"
        : "mobile-country-open";
  const isOpen = document.body.classList.contains(className);
  closeMobilePanels();

  if (!isOpen) {
    openMobilePanel(panel);
  }
}

function onMapInteractionStart(event) {
  if (event?.originalEvent?.target?.closest?.("#mobile-panel-controls, #mobile-more-menu")) {
    return;
  }
  if (isMobileLayout()) {
    closeMobilePanels();
  }
}

function translateContinentName(continent) {
  const labels = {
    America: "America",
    Europe: "Europa",
    Asia: "Asia",
    Africa: "Africa",
    Oceania: "Oceania",
    Antarctica: "Antartida",
    Unknown: "Desconocido"
  };

  return labels[continent] || continent || "Sin datos";
}

function getFlagEmoji(code) {
  const iso2ByCode = {
    ARG: "AR", AUS: "AU", AUT: "AT", BEL: "BE", BGR: "BG", BHS: "BS", BLR: "BY", BLZ: "BZ",
    BMU: "BM", BOL: "BO", BRA: "BR", CAN: "CA", CHE: "CH", CHL: "CL", CHN: "CN", CIV: "CI",
    CMR: "CM", COD: "CD", COG: "CG", COL: "CO", CRI: "CR", CUB: "CU", CYP: "CY", CZE: "CZ",
    DEU: "DE", DJI: "DJ", DNK: "DK", DOM: "DO", DZA: "DZ", EGY: "EG", ESP: "ES", ETH: "ET",
    FIN: "FI", FJI: "FJ", FRA: "FR", GAB: "GA", GBR: "GB", GEO: "GE", GHA: "GH", GIN: "GN",
    GMB: "GM", GNB: "GW", GNQ: "GQ", GRC: "GR", GRL: "GL", GTM: "GT", GUF: "GF", HRV: "HR",
    HUN: "HU", IDN: "ID", IND: "IN", IRL: "IE", IRN: "IR", IRQ: "IQ", ISL: "IS", ISR: "IL",
    ITA: "IT", JPN: "JP", KAZ: "KZ", KEN: "KE", KGZ: "KG", KHM: "KH", KOR: "KR", KWT: "KW",
    LAO: "LA", LBN: "LB", LBR: "LR", LKA: "LK", LSO: "LS", LUX: "LU", LVA: "LV", MAR: "MA",
    MDA: "MD", MDG: "MG", MEX: "MX", MKD: "MK", MLI: "ML", MMR: "MM", MNE: "ME", MNG: "MN",
    MOZ: "MZ", MRT: "MR", MWI: "MW", MYS: "MY", NAM: "NA", NCL: "NC", NER: "NE", NGA: "NG",
    NLD: "NL", NOR: "NO", NPL: "NP", NZL: "NZ", PAK: "PK", PHL: "PH", PNG: "PG", POL: "PL",
    PRT: "PT", PRK: "KP", PSE: "PS", QAT: "QA", ROU: "RO", RUS: "RU", SAU: "SA", SDN: "SD",
    SEN: "SN", SLB: "SB", SOM: "SO", SRB: "RS", SSD: "SS", SWE: "SE", SVK: "SK", SVN: "SI",
    SYR: "SY", TCD: "TD", TGO: "TG", THA: "TH", TLS: "TL", TUN: "TN", TUR: "TR", TWN: "TW",
    TZA: "TZ", UGA: "UG", UKR: "UA", URY: "UY", USA: "US", VNM: "VN", VUT: "VU", YEM: "YE",
    ZAF: "ZA", ZMB: "ZM", ZWE: "ZW", ARE: "AE", ATA: "AQ", FLK: "FK", PRI: "PR", "CS-KM": "XK",
    AFG: "AF", AGO: "AO", ALB: "AL", AND: "AD", ARM: "AM", ATF: "TF", AZE: "AZ", BDI: "BI",
    BEN: "BJ", BFA: "BF", BGD: "BD", BHR: "BH", BIH: "BA", BRN: "BN", BTN: "BT", BWA: "BW",
    CAF: "CF", COM: "KM", ECU: "EC", ERI: "ER", ESH: "EH", EST: "EE", GUY: "GY", HND: "HN",
    HTI: "HT", JAM: "JM", JOR: "JO", LBY: "LY", LTU: "LT", MLT: "MT", NIC: "NI", OMN: "OM",
    PAN: "PA", PER: "PE", PRY: "PY", RWA: "RW", SGP: "SG", SLE: "SL", SLV: "SV", SUR: "SR",
    SWZ: "SZ", TJK: "TJ", TKM: "TM", TTO: "TT", UZB: "UZ", VEN: "VE"
  };

  if (!code) {
    return "MAP";
  }

  if (code === "-99") {
    return "ðŸ´";
  }

  const normalized = (iso2ByCode[code] || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return "ðŸ³ï¸";
  }

  return String.fromCodePoint(
    ...[...normalized].map(char => 127397 + char.charCodeAt(0))
  );
}

function renderFlagVisual(code, label, className = "country-flag", assetSrc = "") {
  const emoji = getFlagEmoji(code);
  const resolvedSrc = assetSrc || (SYMBOL_IMAGE_CODES.has(code) ? `./assets/flags/${code}.svg` : "");
  if (resolvedSrc) {
    return `
      <span class="${className}" role="img" aria-label="${escapeHtml(label || code)}">
        <img class="flag-image" src="${escapeHtml(resolvedSrc)}" alt="" aria-hidden="true" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">
        <span class="flag-fallback" hidden>${emoji}</span>
      </span>
      `;
  }

  return `
    <span class="${className}" role="img" aria-label="${escapeHtml(label || code)}">
      <span class="flag-fallback">${emoji}</span>
    </span>
  `;
}

function renderCoatVisual(code, label, assetSrc = "") {
  const resolvedSrc = assetSrc || (COAT_IMAGE_CODES.has(code) ? `./assets/coats/${code}.svg` : "");
  if (!resolvedSrc) {
    const initials = String(code || "?").slice(0, 3).toUpperCase();
    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 96">
        <path d="M42 4 74 18v26c0 23-13 37-32 48C23 81 10 67 10 44V18L42 4z" fill="#15304f" stroke="#4da3ff" stroke-width="4"/>
        <text x="42" y="54" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="24" font-weight="700" fill="#eef5ff">${initials}</text>
      </svg>
    `);
    return `
      <div class="coat-visual">
        <img class="coat-image" src="data:image/svg+xml;charset=UTF-8,${svg}" alt="${escapeHtml(label || code)}">
      </div>
    `;
  }

  return `
    <div class="coat-visual">
      <img class="coat-image" src="${escapeHtml(resolvedSrc)}" alt="${escapeHtml(label || code)}" onerror="this.parentElement.hidden=true;">
    </div>
  `;
}

function getCountrySymbolAssets(country, code) {
  const assets = country?.general?.symbols?.assets || {};
  return {
    flagSrc: assets.flagPath || (SYMBOL_IMAGE_CODES.has(code) ? `./assets/flags/${code}.svg` : ""),
    coatSrc: assets.coatPath || (COAT_IMAGE_CODES.has(code) ? `./assets/coats/${code}.svg` : "")
  };
}

function renderSymbolShowcase(country, code) {
  const symbols = country?.general?.symbols || {};
  const { flagSrc, coatSrc } = getCountrySymbolAssets(country, code);
  const flagDescription = symbols.flagDescription || (currentLanguage === "en" ? "No structured description" : "Sin descripcion estructurada");
  const coatDescription = symbols.coatOfArms || (currentLanguage === "en" ? "No structured description" : "Sin descripcion estructurada");

  return `
    <div class="symbol-showcase">
      <article class="symbol-card">
        <div class="symbol-card-asset">${renderFlagVisual(code, `${country?.name || code} bandera`, "country-flag country-flag-large", flagSrc)}</div>
        <div class="symbol-card-copy">
          <span class="symbol-card-label">${currentLanguage === "en" ? "Flag" : "Bandera"}</span>
          <strong class="symbol-card-title">${flagSrc ? (currentLanguage === "en" ? "Local asset available" : "Activo local disponible") : (currentLanguage === "en" ? "Fallback active" : "Fallback activo")}</strong>
          <p>${escapeHtml(flagDescription)}</p>
        </div>
      </article>
      <article class="symbol-card">
        <div class="symbol-card-asset">${renderCoatVisual(code, `${country?.name || code} escudo`, coatSrc)}</div>
        <div class="symbol-card-copy">
          <span class="symbol-card-label">${currentLanguage === "en" ? "Coat of arms" : "Escudo"}</span>
          <strong class="symbol-card-title">${coatSrc ? (currentLanguage === "en" ? "Local asset available" : "Activo local disponible") : (currentLanguage === "en" ? "Generated fallback" : "Fallback generado")}</strong>
          <p>${escapeHtml(coatDescription)}</p>
        </div>
      </article>
    </div>
  `;
}

function getMiniMetricRatio(value, ceiling) {
  if (!Number.isFinite(value) || !Number.isFinite(ceiling) || ceiling <= 0) {
    return 0;
  }
  return Math.max(6, Math.min(100, Math.round((value / ceiling) * 100)));
}

function renderMiniMetrics(items = [], emptyLabel = "") {
  const validItems = items.filter(item => {
    if (!item) return false;
    const value = String(item.value || "").trim();
    return Boolean(value && normalizeText(value) !== normalizeText(t("noData")));
  });
  if (!validItems.length) {
    return `<p class="empty-state-note">${escapeHtml(emptyLabel || (currentLanguage === "en" ? "No structured metrics yet." : "Todavia no hay metricas estructuradas para esta seccion."))}</p>`;
  }

  return `
    <div class="mini-metric-grid">
      ${validItems.map(item => `
        <div class="mini-metric-card">
          <div class="mini-metric-head">
            <span class="mini-metric-label">${escapeHtml(item.label)}</span>
            <strong class="mini-metric-value">${escapeHtml(item.value)}</strong>
          </div>
          <div class="mini-metric-bar" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, item.ratio || 0))}%"></span></div>
          ${item.secondary ? `<span class="mini-metric-secondary">${escapeHtml(item.secondary)}</span>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function renderEconomyMiniMetrics(country) {
  const economy = country?.economy || {};
  const exportsCount = Array.isArray(economy.exports) ? economy.exports.length : 0;
  const industriesCount = Array.isArray(economy.industries) ? economy.industries.length : 0;
  const inflationValue = Number(economy.inflation);
  return renderMiniMetrics([
    {
      label: currentLanguage === "en" ? "GDP" : "PBI",
      value: economy.gdp ? `US$ ${formatNumber(Math.round(economy.gdp))}` : t("noData"),
      secondary: currentLanguage === "en" ? "Relative global scale" : "Escala relativa global",
      ratio: getMiniMetricRatio(economy.gdp || 0, 25000000000000)
    },
    {
      label: t("gdpPerCapita"),
      value: economy.gdpPerCapita ? `US$ ${formatNumber(Math.round(economy.gdpPerCapita))}` : t("noData"),
      secondary: currentLanguage === "en" ? "Approx. prosperity" : "Prosperidad aproximada",
      ratio: getMiniMetricRatio(economy.gdpPerCapita || 0, 90000)
    },
    {
      label: currentLanguage === "en" ? "Export breadth" : "Diversidad exportadora",
      value: formatNumber(exportsCount),
      secondary: currentLanguage === "en" ? "Tracked export groups" : "Rubros exportadores relevados",
      ratio: getMiniMetricRatio(exportsCount, 18)
    },
    {
      label: t("inflation"),
      value: formatInflation(economy.inflation),
      secondary: currentLanguage === "en" ? "Lower pressure is better" : "Menor presion es mejor",
      ratio: Number.isFinite(inflationValue) ? Math.max(6, Math.min(100, 100 - Math.min(100, inflationValue))) : 0
    },
    {
      label: currentLanguage === "en" ? "Industry breadth" : "Diversidad industrial",
      value: formatNumber(industriesCount),
      secondary: currentLanguage === "en" ? "Tracked industry groups" : "Rubros industriales relevados",
      ratio: getMiniMetricRatio(industriesCount, 18)
    }
  ], currentLanguage === "en" ? "No economic mini metrics available." : "No hay mini metricas economicas disponibles.");
}

function toDisplayTitleCase(value) {
  return String(value || "")
    .toLocaleLowerCase("es")
    .replace(/(^|[\s\-/'(])([\p{L}])/gu, (match, prefix, letter) => `${prefix}${letter.toLocaleUpperCase("es")}`);
}

function normalizeCityDisplayName(value) {
  let name = String(value || "").replace(/\s+/g, " ").trim();
  if (!name) {
    return "";
  }

  const lettersOnly = name.replace(/[^\p{L}]/gu, "");
  if (lettersOnly && lettersOnly === lettersOnly.toUpperCase()) {
    name = toDisplayTitleCase(name);
  }

  name = name
    .replace(/\bD\.?\s*C\.?\b/g, "D.C.")
    .replace(/\bCuidad\b/g, "Ciudad");

  return name;
}

function getCityDedupKey(value) {
  return normalizeText(String(value || "").replace(/\s*\([^)]*\)\s*$/u, "").trim());
}

function translateCapitalRole(role) {
  const normalized = normalizeText(role);
  const labels = {
    nacional: currentLanguage === "en" ? "national capital" : "capital nacional",
    constitucional: currentLanguage === "en" ? "constitutional capital" : "capital constitucional",
    administrativa: currentLanguage === "en" ? "administrative capital" : "capital administrativa",
    ejecutiva: currentLanguage === "en" ? "executive seat" : "sede ejecutiva",
    legislativa: currentLanguage === "en" ? "legislative seat" : "sede legislativa",
    judicial: currentLanguage === "en" ? "judicial seat" : "sede judicial",
    "ejecutiva y legislativa": currentLanguage === "en" ? "executive and legislative seat" : "sede ejecutiva y legislativa",
    reclamada: currentLanguage === "en" ? "claimed capital" : "capital reclamada"
  };

  return labels[normalized] || role || (currentLanguage === "en" ? "capital" : "capital");
}

function renderCapitalProfiles(general) {
  const capitals = Array.isArray(general?.capitals) && general.capitals.length
    ? general.capitals
    : general?.capital?.name
      ? [{ role: "nacional", name: general.capital.name, population: general.capital.population || null }]
      : [];

  if (!capitals.length) {
    return `<p>${t("noData")}</p>`;
  }

  return renderList(
    capitals.map(capital => {
      const roleLabel = translateCapitalRole(capital.role);
      const populationText = capital.population ? ` · ${formatNumber(Math.round(capital.population))} hab.` : "";
      return `${escapeHtml(normalizeCityDisplayName(capital.name))} (${escapeHtml(roleLabel)})${populationText}`;
    })
  );
}

function renderLanguages(general) {
  const languages = Array.isArray(general?.languages) ? general.languages.filter(Boolean) : [];
  return languages.length ? renderList(languages) : `<p>${t("noData")}</p>`;
}

function renderSubdivisionSummary(general) {
  const subdivisions = general?.subdivisions;
  if (!subdivisions?.type) {
    return t("noData");
  }

  const parts = [subdivisions.type];
  if (subdivisions.count) {
    parts.push(currentLanguage === "en" ? `${formatNumber(subdivisions.count)} units` : `${formatNumber(subdivisions.count)} unidades`);
  }
  if (subdivisions.notes) {
    parts.push(subdivisions.notes);
  }
  return escapeHtml(parts.join(" · "));
}

function renderCities(general) {
  const capital = general?.capital;
  const cities = Array.isArray(general?.cities) ? general.cities : [];
  const cityEntries = [];
  const populationTotal = general?.population || 0;

  if (capital?.name) {
    const capitalName = normalizeCityDisplayName(capital.name);
    cityEntries.push({
      name: capitalName,
      population: capital.population || null
    });
  }

  [...cities]
    .forEach(city => {
      const name = normalizeCityDisplayName(city?.name);
      if (!name) {
        return;
      }

      cityEntries.push({
        name,
        population: city.population || null
      });
    });

  const dedupedCities = cityEntries
    .filter((city, index, list) =>
      index === list.findIndex(item => getCityDedupKey(item.name) === getCityDedupKey(city.name))
    )
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .map(city => {
      const ratio = populationTotal && city.population
        ? (city.population / populationTotal) * 100
        : 0;
      const percentage = ratio > 0 && ratio <= 100
        ? ` - ${formatPercentage(ratio)}`
        : "";
      return `${city.name}${city.population ? ` (${formatNumber(Math.round(city.population))} hab.${percentage})` : ""}`;
    });

  return renderList(dedupedCities);
}

function getCountryOverviewStats(country, countryCode) {
  return [
    {
      label: t("gdpPerCapita"),
      value: country.economy?.gdpPerCapita
        ? `US$ ${formatNumber(Math.round(country.economy.gdpPerCapita))}`
        : t("noData")
    },
    {
      label: currentLanguage === "en" ? "Organizations" : "Organizaciones",
      value: formatNumber(getCountryOrganizationCount(country))
    },
    {
      label: currentLanguage === "en" ? "Conflicts" : "Conflictos",
      value: formatNumber(getCountryWarParticipationCount(country))
    },
    {
      label: currentLanguage === "en" ? "Rivals" : "Rivales",
      value: formatNumber(getCountryRivalCount(country))
    },
    {
      label: currentLanguage === "en" ? "Religion groups" : "Grupos religiosos",
      value: formatNumber(getCountryReligionDiversity(country))
    },
    {
      label: currentLanguage === "en" ? "Country code" : "Codigo",
      value: countryCode || "---"
    }
  ];
}

function renderOrganizations(organizations) {
  if (!organizations || !organizations.length) {
    return "<p>Sin datos estructurados.</p>";
  }

  const deduped = organizations
    .filter(Boolean)
    .filter(
      (org, index, list) =>
        index ===
        list.findIndex(
          item =>
            normalizeText(item.name || item) === normalizeText(org.name || org) &&
            (item.startYear || null) === (org.startYear || null) &&
            (item.endYear || null) === (org.endYear || null)
        )
    )
    .sort((a, b) => {
      const yearA = a.startYear ?? Number.MAX_SAFE_INTEGER;
      const yearB = b.startYear ?? Number.MAX_SAFE_INTEGER;
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      return String(a.name || a).localeCompare(String(b.name || b), "es");
    });

  return `<ul>${deduped
    .map(org => {
      if (typeof org === "string") {
        return `<li>${org}</li>`;
      }

      const abbreviation = org.abbreviation ? ` (${org.abbreviation})` : " (sigla no disponible)";
      const start = ` - año de ingreso: ${org.startYear || "sin dato"}`;
      const end = org.endYear ? ` - año de salida: ${org.endYear}` : " - actualidad";
      return `<li>${org.name}${abbreviation}${start}${end}</li>`;
    })
    .join("")}</ul>`;
}

function renderRivals(rivals) {
  const historical = (rivals || []).filter(rival => (rival.type || "historico") !== "actual");
  const current = (rivals || []).filter(rival => rival.type === "actual");

  return `
    <p><b>Historicos:</b></p>
    ${renderList(historical.map(rival => rival.name || rival))}
    <p><b>Actuales:</b></p>
    ${renderList(current.map(rival => rival.name || rival))}
  `;
}

function renderReligion(religion) {
  const composition = getReligionCompositionForDisplay(religion);
  const summaryLabel = getReligionSummaryLabel(religion);
  const summary = summaryLabel ? `<p><b>Religion principal:</b> ${summaryLabel}</p>` : "";

  if (!summary && !composition.length) {
    return "<p>Sin datos estructurados.</p>";
  }

  const compositionList = composition.length
    ? `<p><b>Composicion religiosa:</b></p><ul>${composition
        .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
        .map(item => {
          const population = religion?.populationBase || religion?.countryPopulation || 0;
          const nominal = population && item.percentage
            ? `${formatNumber(Math.round(population * (item.percentage / 100)))} - `
            : "";
          return `<li>${item.name}: ${nominal}${item.estimated ? "~" : ""}${item.percentage}%</li>`;
        })
        .join("")}</ul>`
    : "";

  return `${summary}${compositionList}`;
}

function renderReligionMiniMetrics(religion) {
  const composition = getReligionCompositionForDisplay(religion)
    .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
    .slice(0, 4);

  return renderMiniMetrics(
    composition.map(item => ({
      label: item.name,
      value: `${item.estimated ? "~" : ""}${formatPercentage(item.percentage || 0)}`,
      secondary: item.estimated
        ? (currentLanguage === "en" ? "Estimated share" : "Participacion estimada")
        : (currentLanguage === "en" ? "Reported share" : "Participacion reportada"),
      ratio: Math.max(6, Math.min(100, Math.round(item.percentage || 0)))
    })),
    currentLanguage === "en" ? "No religious composition available." : "No hay composicion religiosa disponible."
  );
}

function getProfileConflictCount(country, conflictGroups = [], conflictCountOverride = null) {
  const override = Number(conflictCountOverride);
  if (Number.isFinite(override) && override >= 0) {
    return override;
  }
  if (Array.isArray(conflictGroups) && conflictGroups.length) {
    return conflictGroups.length;
  }
  return getConflictsSinceFormation(country).length;
}

function getCountryCurationTodoItems(country, conflictGroups = [], conflictCountOverride = null) {
  const quality = country?.metadata?.quality || {};
  const sectionStatus = quality.sectionStatus || {};
  const missingFields = Array.isArray(quality.missingFields) ? quality.missingFields : [];
  const estimatedFields = Array.isArray(quality.estimatedFields) ? quality.estimatedFields : [];
  const conflictCount = getProfileConflictCount(country, conflictGroups, conflictCountOverride);
  const provisionalHierarchyCount = (country?.military?.conflicts || [])
    .filter(conflict => hasProvisionalConflictHierarchy(conflict) && !getConflictParentName(conflict))
    .length;
  const weakSections = Object.entries(sectionStatus)
    .filter(([, status]) => !["curated", "confirmed"].includes(String(status || "").toLowerCase()))
    .map(([section, status]) => `${section}: ${status || "pendiente"}`);
  const items = [];

  if (missingFields.length) {
    items.push(`${currentLanguage === "en" ? "Missing fields" : "Campos faltantes"}: ${missingFields.slice(0, 6).join(", ")}`);
  }
  if (estimatedFields.length) {
    items.push(`${currentLanguage === "en" ? "Estimated fields to verify" : "Campos estimados por verificar"}: ${estimatedFields.slice(0, 5).join(", ")}`);
  }
  if (weakSections.length) {
    items.push(`${currentLanguage === "en" ? "Weak sections" : "Secciones flojas"}: ${weakSections.slice(0, 4).join(", ")}`);
  }
  if (!conflictCount) {
    items.push(currentLanguage === "en" ? "Military history needs curated conflicts." : "Historia militar necesita conflictos curados.");
  }
  if (provisionalHierarchyCount) {
    items.push(currentLanguage === "en"
      ? `${provisionalHierarchyCount} conflict hierarchies still need a verified parent war.`
      : `${provisionalHierarchyCount} jerarquias de conflicto todavia necesitan una guerra padre verificada.`);
  }
  if (!Array.isArray(country?.religion?.composition) || country.religion.composition.length < 2) {
    items.push(currentLanguage === "en" ? "Religious composition needs more denominations." : "Composicion religiosa necesita mas denominaciones.");
  }
  if (!Array.isArray(country?.general?.cities) || country.general.cities.length < 3) {
    items.push(currentLanguage === "en" ? "Urban hierarchy needs more highlighted cities." : "Jerarquia urbana necesita mas ciudades destacadas.");
  }
  if (!getCountryOrganizationCount(country)) {
    items.push(currentLanguage === "en" ? "International organizations need review." : "Organizaciones internacionales necesitan revision.");
  }

  return [...new Set(items)].slice(0, 6);
}

function getCountryCurationActions(country, conflictGroups = [], conflictCountOverride = null) {
  const quality = country?.metadata?.quality || {};
  const missingFields = new Set(Array.isArray(quality.missingFields) ? quality.missingFields : []);
  const estimatedFields = new Set(Array.isArray(quality.estimatedFields) ? quality.estimatedFields : []);
  const sectionStatus = quality.sectionStatus || {};
  const conflictCount = getProfileConflictCount(country, conflictGroups, conflictCountOverride);
  const provisionalHierarchyCount = (country?.military?.conflicts || [])
    .filter(conflict => hasProvisionalConflictHierarchy(conflict) && !getConflictParentName(conflict))
    .length;
  const actions = [
    {
      section: currentLanguage === "en" ? "General" : "General",
      action: currentLanguage === "en" ? "Verify official names, languages, capitals and urban hierarchy." : "Verificar nombres oficiales, idiomas, capitales y jerarquia urbana.",
      weak: missingFields.has("general") || estimatedFields.has("general") || !country?.general?.officialName || !Array.isArray(country?.general?.cities) || country.general.cities.length < 3
    },
    {
      section: currentLanguage === "en" ? "Conflicts" : "Conflictos",
      action: currentLanguage === "en" ? "Add parent war, sides, outcome and casualties for weak conflicts." : "Agregar guerra padre, bandos, resultado y bajas en conflictos flojos.",
      weak: !conflictCount || provisionalHierarchyCount > 0 || sectionStatus.military !== "curated"
    },
    {
      section: currentLanguage === "en" ? "Relations" : "Relaciones",
      action: currentLanguage === "en" ? "Review allies, rivals, disputes and bloc membership." : "Revisar aliados, rivales, disputas y pertenencia a bloques.",
      weak: !Object.values(country?.politics?.relations || {}).some(value => Array.isArray(value) ? value.length : Boolean(value))
    },
    {
      section: currentLanguage === "en" ? "Religion" : "Religion",
      action: currentLanguage === "en" ? "Split major religion into denominations where possible." : "Separar religion mayoritaria en denominaciones cuando sea posible.",
      weak: !Array.isArray(country?.religion?.composition) || country.religion.composition.length < 2
    },
    {
      section: currentLanguage === "en" ? "Sources" : "Fuentes",
      action: currentLanguage === "en" ? "Attach provenance and mark curated, estimated or missing data." : "Agregar procedencia y marcar dato curado, estimado o faltante.",
      weak: !Object.keys(country?.metadata?.provenance || {}).length || (quality.score || 0) < 80
    }
  ];

  return actions.filter(item => item.weak).slice(0, 5);
}

function getTimelineCentury(year) {
  if (!year) {
    return null;
  }
  if (year < 0) {
    return currentLanguage === "en" ? "Ancient" : "Antiguo";
  }
  const century = Math.floor((Number(year) - 1) / 100) + 1;
  return currentLanguage === "en" ? `${century}th c.` : `Siglo ${century}`;
}

function getTimelineIntensity(event) {
  const explicit = normalizeText(event.intensity || "");
  if (explicit) {
    return explicit;
  }

  const category = normalizeText(event.categoryKey || "");
  if (["formation", "conflict", "revolution", "annexation", "secession"].includes(category)) {
    return "alta";
  }
  if (["constitution", "coup", "treaty"].includes(category)) {
    return "media";
  }
  return "baja";
}

function getTimelineIntensityLabel(value) {
  const labels = {
    alta: currentLanguage === "en" ? "High impact" : "Alto impacto",
    media: currentLanguage === "en" ? "Medium impact" : "Impacto medio",
    baja: currentLanguage === "en" ? "Low impact" : "Impacto acotado"
  };
  return labels[normalizeText(value)] || value;
}

function getTimelineIntensityWeight(value) {
  const weights = { alta: 3, media: 2, baja: 1 };
  return weights[normalizeText(value)] || 0;
}

function getTimelineRelevance(event) {
  const explicit = normalizeText(event.relevance || "");
  if (explicit) {
    return explicit;
  }

  const category = normalizeText(event.categoryKey || "");
  const intensity = normalizeText(event.intensity || getTimelineIntensity(event));

  if (["formation", "conflict", "annexation", "secession"].includes(category)) {
    return "alta";
  }
  if (["constitution", "coup"].includes(category)) {
    return intensity === "alta" ? "alta" : "media";
  }
  if (["treaty", "system", "organization"].includes(category)) {
    return intensity === "alta" ? "media" : "baja";
  }
  return intensity === "alta" ? "media" : "baja";
}

function getTimelineRelevanceLabel(value) {
  const labels = {
    alta: currentLanguage === "en" ? "Core milestone" : "Hito central",
    media: currentLanguage === "en" ? "Relevant milestone" : "Hito relevante",
    baja: currentLanguage === "en" ? "Context milestone" : "Hito contextual"
  };
  return labels[normalizeText(value)] || value;
}

function getTimelineCategoryLabel(key, fallback = "") {
  const labels = {
    formation: currentLanguage === "en" ? "Formation" : "Formacion",
    organization: currentLanguage === "en" ? "Organization" : "Organizacion",
    economy: currentLanguage === "en" ? "Economy" : "Economia",
    conflict: currentLanguage === "en" ? "Conflict" : "Conflicto",
    system: currentLanguage === "en" ? "System" : "Sistema",
    constitution: currentLanguage === "en" ? "Constitution" : "Constitucion",
    treaty: currentLanguage === "en" ? "Treaty" : "Tratado",
    coup: currentLanguage === "en" ? "Coup" : "Golpe",
    secession: currentLanguage === "en" ? "Secession" : "Secesion",
    annexation: currentLanguage === "en" ? "Annexation" : "Anexion"
  };
  return labels[key] || fallback || (currentLanguage === "en" ? "Event" : "Evento");
}

function getTimelineCategoryAccent(key) {
  const accents = {
    formation: "#67b8ff",
    organization: "#7fe7c4",
    economy: "#a3e635",
    conflict: "#ff7d7d",
    system: "#ffd166",
    constitution: "#c084fc",
    treaty: "#8ecae6",
    coup: "#f59e0b",
    secession: "#fb7185",
    annexation: "#ef4444"
  };
  return accents[key] || "#67b8ff";
}

function getTimelineDetailContent(item, contextLabel = "") {
  const override = TIMELINE_DETAIL_OVERRIDES[item.reference] || TIMELINE_DETAIL_OVERRIDES[item.text] || {};
  return {
    title: override.title || item.reference || item.text,
    year: item.year,
    category: getTimelineCategoryLabel(item.categoryKey, item.category),
    century: getTimelineCentury(item.year),
    intensity: getTimelineIntensityLabel(item.intensity || getTimelineIntensity(item)),
    relevance: getTimelineRelevanceLabel(item.relevance || getTimelineRelevance(item)),
    region: item.contextLabel || contextLabel || "",
    detail: override.detail || item.text,
    significance: override.significance || (currentLanguage === "en" ? "Contextual event within the selected timeline." : "Evento contextual dentro del timeline seleccionado."),
    reference: item.reference || item.text,
    references: item.references || [],
    relatedConflicts: item.relatedConflicts || [],
    query: item.reference || item.text
  };
}

function registerTimelineModal(item, contextLabel = "") {
  const key = `timeline-${timelineModalCounter += 1}`;
  timelineModalRegistry.set(key, getTimelineDetailContent(item, contextLabel));
  return key;
}

function openTimelineModal(key) {
  const modal = document.getElementById("timeline-modal");
  const body = document.getElementById("timeline-modal-body");
  const detail = timelineModalRegistry.get(key);
  if (!modal || !body || !detail) {
    return;
  }

  body.innerHTML = `
    <h3 id="timeline-modal-title">${escapeHtml(detail.title)}</h3>
    <p class="conflict-modal-subtitle">${currentLanguage === "en" ? "Historical timeline event" : "Evento historico del timeline"}</p>
    <div class="country-overview-grid relation-overview-grid conflict-overview-grid">
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Year" : "Año"}</span><strong class="overview-value">${escapeHtml(String(detail.year || ""))}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Category" : "Categoria"}</span><strong class="overview-value">${escapeHtml(detail.category)}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Century" : "Siglo"}</span><strong class="overview-value">${escapeHtml(detail.century || "")}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Impact" : "Impacto"}</span><strong class="overview-value">${escapeHtml(detail.intensity)}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Relevance" : "Relevancia"}</span><strong class="overview-value">${escapeHtml(detail.relevance)}</strong></div>
    </div>
    ${detail.region ? `<div class="conflict-modal-section"><h4>${currentLanguage === "en" ? "Context" : "Contexto"}</h4><p>${escapeHtml(detail.region)}</p></div>` : ""}
    <div class="conflict-modal-section">
      <h4>${currentLanguage === "en" ? "What happened" : "Que ocurrio"}</h4>
      <p>${escapeHtml(detail.detail)}</p>
    </div>
    <div class="conflict-modal-section">
      <h4>${currentLanguage === "en" ? "Why it matters" : "Por que importa"}</h4>
      <p>${escapeHtml(detail.significance)}</p>
    </div>
    ${detail.relatedConflicts?.length ? `<div class="conflict-modal-section"><h4>${currentLanguage === "en" ? "Related conflicts" : "Conflictos relacionados"}</h4>${renderRelationChips(detail.relatedConflicts)}</div>` : ""}
    ${detail.references?.length ? `<div class="conflict-modal-section"><h4>${currentLanguage === "en" ? "References" : "Referencias"}</h4>${renderList(detail.references)}</div>` : ""}
    ${detail.query ? `<div class="conflict-modal-actions"><button type="button" class="panel-action-button" data-search-query="${escapeHtml(detail.query)}">${currentLanguage === "en" ? "Explore related entries" : "Explorar referencias relacionadas"}</button></div>` : ""}
  `;

  modal.hidden = false;
  syncModalOpenState();
}

function closeTimelineModal() {
  const modal = document.getElementById("timeline-modal");
  const body = document.getElementById("timeline-modal-body");
  if (!modal || modal.hidden) {
    return;
  }
  modal.hidden = true;
  syncModalOpenState();
  if (body) {
    body.innerHTML = "";
  }
}

const MODAL_IDS = ["country-modal", "compare-modal", "conflict-modal", "timeline-modal", "help-modal", "intro-modal", "product-modal"];
const MODAL_SHELL_IDS = ["map", "top-controls", "left-panel", "map-mode-toggle", "compare-hub-panel", "quiz-hub-panel", "news-hub-panel", "mobile-panel-controls"];
let activeModalElement = null;
let modalFocusReturnTarget = null;

function getModalDialog(modal) {
  return modal?.querySelector("[role='dialog']") || null;
}

function getModalFocusableElements(modal) {
  return [...(modal?.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])") || [])]
    .filter(element => !element.hidden && element.getAttribute("aria-hidden") !== "true" && element.getClientRects().length > 0);
}

function focusActiveModal(modal) {
  if (activeModalElement !== modal || modal.hidden) {
    return;
  }
  const initialTarget = modal.querySelector("[data-modal-initial-focus]")
    || modal.querySelector("button[id$='-modal-close']")
    || getModalDialog(modal);
  initialTarget?.focus({ preventScroll: true });
}

function syncModalOpenState() {
  const openModals = MODAL_IDS
    .map(id => document.getElementById(id))
    .filter(modal => modal && !modal.hidden);
  const activeModal = openModals[openModals.length - 1] || null;
  const hasOpenModal = Boolean(activeModal);

  document.body.classList.toggle("modal-open", hasOpenModal);

  MODAL_SHELL_IDS.forEach(id => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    element.toggleAttribute("inert", hasOpenModal);
    if (hasOpenModal) {
      element.setAttribute("aria-hidden", "true");
    } else {
      element.removeAttribute("aria-hidden");
    }
  });

  MODAL_IDS.forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.setAttribute("aria-hidden", modal === activeModal ? "false" : "true");
    }
  });

  if (activeModal === activeModalElement) {
    return;
  }

  if (activeModal && !activeModalElement) {
    const focusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const searchInput = document.getElementById("map-search-input");
    modalFocusReturnTarget = focusedElement?.closest("#search-suggestions")
      ? searchInput
      : (focusedElement && focusedElement !== document.body ? focusedElement : searchInput);
  }
  activeModalElement = activeModal;

  if (activeModal) {
    focusActiveModal(activeModal);
  } else {
    const returnTarget = modalFocusReturnTarget;
    modalFocusReturnTarget = null;
    if (returnTarget?.isConnected) {
      returnTarget.focus({ preventScroll: true });
    }
  }
}

function openCountryModal() {
  const modal = document.getElementById("country-modal");
  const dialog = document.querySelector("#country-modal .country-modal-dialog");
  if (!modal) {
    return;
  }
  closeMobileHubPanels();
  closeMobilePanels();
  modal.hidden = false;
  dialog?.scrollTo({ top: 0, behavior: "auto" });
  syncModalOpenState();
  syncMobilePanelControlState();
}

function closeCountryModal() {
  const modal = document.getElementById("country-modal");
  if (!modal || modal.hidden) {
    return;
  }
  modal.hidden = true;
  syncModalOpenState();
  syncMobilePanelControlState();
}

function getReligionSummaryLabel(religion) {
  const summary = String(religion?.summary || "").trim();
  return summary;
}

function getReligionCompositionForDisplay(religion) {
  const composition = Array.isArray(religion?.composition) ? religion.composition.filter(Boolean) : [];
  if (composition.length) {
    return composition;
  }

  const summary = String(religion?.summary || "").trim();
  if (!summary) {
    return [];
  }

  const parts = summary
    .split("/")
    .map(item => item.trim())
    .filter(Boolean);

  if (!parts.length) {
    return [{ name: summary, percentage: 100, estimated: true }];
  }

  const basePercentage = Math.floor((1000 / parts.length)) / 10;
  return parts.map((item, index) => ({
    name: item,
    percentage: index === parts.length - 1
      ? Number((100 - basePercentage * (parts.length - 1)).toFixed(1))
      : basePercentage,
    estimated: true
  }));
}

function translateHistoryText(value) {
  if (!value) {
    return "Sin datos";
  }

  const replacements = [
    [/constitutional monarchy/gi, "monarquia constitucional"],
    [/parliamentary monarchy/gi, "monarquia parlamentaria"],
    [/absolute monarchy/gi, "monarquia absoluta"],
    [/elective monarchy/gi, "monarquia electiva"],
    [/federal monarchy/gi, "monarquia federal"],
    [/federal republic/gi, "republica federal"],
    [/parliamentary republic/gi, "republica parlamentaria"],
    [/presidential republic/gi, "republica presidencialista"],
    [/semi-presidential republic/gi, "republica semipresidencialista"],
    [/constitutional republic/gi, "republica constitucional"],
    [/democratic republic/gi, "republica democratica"],
    [/republic/gi, "republica"],
    [/presidentialism/gi, "presidencialismo"],
    [/parliamentary system/gi, "sistema parlamentario"],
    [/unitary state/gi, "estado unitario"],
    [/federal state/gi, "estado federal"],
    [/sovereign state/gi, "estado soberano"],
    [/dependent territory/gi, "territorio dependiente"],
    [/country/gi, "pais"],
    [/state/gi, "estado"],
    [/empire/gi, "imperio"],
    [/kingdom/gi, "reino"],
    [/sultanate/gi, "sultanato"],
    [/colony/gi, "colonia"],
    [/commonwealth/gi, "mancomunidad"],
    [/union/gi, "union"],
    [/federation/gi, "federacion"],
    [/grand duchy/gi, "gran ducado"],
    [/duchy/gi, "ducado"]
  ];

  let translated = String(value);

  for (const [pattern, replacement] of replacements) {
    translated = translated.replace(pattern, replacement);
  }

  return translated;
}

function scrollCountrySectionIntoView(sectionId) {
  const dialog = document.querySelector("#country-modal .country-modal-dialog");
  const section = document.getElementById(sectionId);
  if (!dialog || !section) {
    return;
  }
  if (section.tagName?.toLowerCase() === "details") {
    section.open = true;
  }
  document.querySelectorAll("[data-country-nav]").forEach(button => {
    const active = button.dataset.countryNav === sectionId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const offset = Math.max(0, section.offsetTop - 90);
  dialog.scrollTo({ top: offset, behavior: "smooth" });
}

async function activateCountrySection(sectionId) {
  if (!sectionId || currentPanelState.type !== "country") {
    return;
  }
  const loadedSections = new Set(currentPanelState.countryLoadedSections || ["country-section-general"]);
  loadedSections.add(sectionId);
  currentPanelState.countryLoadedSections = [...loadedSections];
  currentPanelState.countryActiveSection = sectionId;

  if (sectionId === "country-section-military") {
    await loadCountryConflictDetail(currentPanelState.code);
  }

  if (
    !deferredDataStatus.runtimeCuration
    && (sectionId === "country-section-history" || sectionId === "country-section-military")
  ) {
    await loadRuntimeCuration();
  } else {
    rerenderCurrentPanel();
  }
  setTimeout(() => scrollCountrySectionIntoView(sectionId), 80);
}

function getConflictsSinceFormation(country) {
  const formationYear = country.history?.year;
  const conflicts = Array.isArray(country?.military?.conflicts)
    ? country.military.conflicts
    : (Array.isArray(country?.conflicts) ? country.conflicts : []);

  if (!formationYear) {
    return conflicts;
  }

  return conflicts.filter(conflict => {
    const conflictStartYear = extractConflictStartYear(conflict);

    if (!conflictStartYear) {
      return true;
    }

    return conflictStartYear >= formationYear;
  });
}

function translateConflictName(name) {
  let translated = cleanConflictName(name);

  for (const [pattern, replacement] of getConflictNameAliases()) {
    if (pattern.test(translated)) {
      return replacement;
    }
  }

  const replacements = [
    [/^\d{4}\s+/i, ""],
    [/^World War II$/i, "Segunda Guerra Mundial"],
    [/^World War I$/i, "Primera Guerra Mundial"],
    [/^Battle of /i, "Batalla de "],
    [/^Second Battle of /i, "Segunda batalla de "],
    [/^Third Battle of /i, "Tercera batalla de "],
    [/^First Battle of /i, "Primera batalla de "],
    [/^Fourth Battle of /i, "Cuarta batalla de "],
    [/^Action of /i, "Accion de "],
    [/^Actions of /i, "Acciones de "],
    [/^Raid off /i, "Incursion frente a "],
    [/^Raid on /i, "Incursion sobre "],
    [/^Raid in /i, "Incursion en "],
    [/^Offensive of /i, "Ofensiva de "],
    [/^Offensive in /i, "Ofensiva en "],
    [/^Counteroffensive of /i, "Contraofensiva de "],
    [/^Counteroffensive in /i, "Contraofensiva en "],
    [/^Clash of /i, "Enfrentamiento de "],
    [/^Clashes in /i, "Enfrentamientos en "],
    [/^Clashes of /i, "Enfrentamientos de "],
    [/^Struggle for /i, "Lucha por "],
    [/^Naval battle off /i, "Batalla naval de "],
    [/^Naval Battle of /i, "Batalla naval de "],
    [/^Siege of /i, "Sitio de "],
    [/^Operation /i, "Operacion "],
    [/^Campaign of /i, "Campana de "],
    [/^Campaign /i, "Campana "],
    [/^Front in /i, "Frente en "],
    [/^Front of /i, "Frente de "],
    [/^Invasion of /i, "Invasion de "],
    [/^War of /i, "Guerra de "],
    [/^War in /i, "Guerra en "],
    [/^War between /i, "Guerra entre "],
    [/^Civil war of /i, "Guerra civil de "],
    [/^Civil War of /i, "Guerra civil de "],
    [/^Front in the /i, "Frente en "],
    [/^Landing in /i, "Desembarco en "],
    [/^Capture of /i, "Captura de "],
    [/^Bombings in /i, "Bombardeos en "],
    [/^Bombing of /i, "Bombardeo de "],
    [/^Airstrikes? on /i, "Ataques aereos sobre "],
    [/^Airstrikes? in /i, "Ataques aereos en "],
    [/^Battle for /i, "Batalla por "],
    [/^Battle in /i, "Batalla en "],
    [/^Skirmish at /i, "Escaramuza de "],
    [/^Skirmish in /i, "Escaramuza en "],
    [/^Occupation of /i, "Ocupacion de "],
    [/^Liberation of /i, "Liberacion de "],
    [/^Expedition to /i, "Expedicion a "],
    [/^Expedition against /i, "Expedicion contra "],
    [/^Crisis in /i, "Crisis en "]
  ];

  for (const [pattern, replacement] of replacements) {
    translated = translated.replace(pattern, replacement);
  }

  translated = translated
    .replace(/\bthe\b/gi, "")
    .replace(/\bof\b/gi, "de")
    .replace(/\bin\b/gi, "en")
    .replace(/\boff\b/gi, "frente a")
    .replace(/\bfront\b/gi, "frente")
    .replace(/\bborder\b/gi, "fronterizo")
    .replace(/\bconflict\b/gi, "conflicto")
    .replace(/\bcivil war\b/gi, "guerra civil")
    .replace(/\bcampaign\b/gi, "campana")
    .replace(/\bbattle\b/gi, "batalla")
    .replace(/\bsiege\b/gi, "sitio")
    .replace(/\boffensive\b/gi, "ofensiva")
    .replace(/\bcounteroffensive\b/gi, "contraofensiva")
    .replace(/\boccupation\b/gi, "ocupacion")
    .replace(/\blanding\b/gi, "desembarco")
    .replace(/\bwar\b/gi, "guerra")
    .replace(/\band\b/gi, "y")
    .replace(/\bstrip\b/gi, "franja")
    .replace(/\bbank\b/gi, "banco")
    .replace(/\bwestern\b/gi, "occidental")
    .replace(/\beastern\b/gi, "oriental")
    .replace(/\bnorthern\b/gi, "norte")
    .replace(/\bsouthern\b/gi, "sur")
    .replace(/\bfirst\b/gi, "primera")
    .replace(/\bsecond\b/gi, "segunda")
    .replace(/\bthird\b/gi, "tercera")
    .replace(/\bfourth\b/gi, "cuarta")
    .replace(/\s+/g, " ")
    .trim();

  return translated.charAt(0).toUpperCase() + translated.slice(1);
}

function buildGenericConflictChronology(conflict) {
  const startYear = conflict?.startYear || null;
  const endYear = conflict?.ongoing ? null : (conflict?.endYear || startYear || null);
  if (!startYear) {
    if (conflict?.ongoing) {
      return [
        {
          year: null,
          text: currentLanguage === "en"
            ? "The conflict remains active or unresolved within its broader historical context."
            : "El conflicto sigue activo o sin resolucion definitiva dentro de su contexto historico mas amplio."
        }
      ];
    }
    if (conflict?.parentName) {
      return [
        {
          year: null,
          text: currentLanguage === "en"
            ? "This episode formed part of a broader war or campaign already identified in the dataset."
            : "Este episodio formo parte de una guerra o campana mas amplia ya identificada en el dataset."
        }
      ];
    }
    return [
      {
        year: null,
        text: currentLanguage === "en"
          ? "The conflict belongs to a broader historical sequence, although its exact internal phases are not yet fully structured."
          : "El conflicto forma parte de una secuencia historica mas amplia, aunque sus fases internas todavia no estan completamente estructuradas."
      }
    ];
  }

  const chronology = [
    {
      year: startYear,
      text: currentLanguage === "en"
        ? "The conflict began or entered an open phase."
        : "El conflicto comenzo o entro en una fase abierta."
    }
  ];

  if (endYear && endYear !== startYear) {
    const midpoint = Math.floor((startYear + endYear) / 2);
    if (midpoint > startYear && midpoint < endYear) {
      chronology.push({
        year: midpoint,
        text: currentLanguage === "en"
          ? "The conflict reached one of its most intense or decisive phases."
          : "El conflicto alcanzo una de sus fases mas intensas o decisivas."
      });
    }

    chronology.push({
      year: endYear,
      text: currentLanguage === "en"
        ? "The main armed phase ended or was contained."
        : "La fase armada principal termino o fue contenida."
    });
  } else if (conflict?.ongoing) {
    chronology.push({
      year: startYear,
      text: currentLanguage === "en"
        ? "The conflict remains active or unresolved."
        : "El conflicto sigue activo o sin resolucion definitiva."
    });
  }

  return chronology;
}

function conflictDedupKey(conflict) {
  const canonicalName = normalizeText(conflict.name)
    .replace(/\bde las\b/g, "de")
    .replace(/\bde los\b/g, "de")
    .replace(/\bla\b/g, "")
    .replace(/\bel\b/g, "")
    .replace(/\blos\b/g, "")
    .replace(/\blas\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const endPart = conflict.ongoing ? "actualidad" : (conflict.endYear ?? conflict.startYear ?? "sin-fin");
  return `${canonicalName}|${conflict.startYear}|${endPart}`;
}

function formatConflictPeriod(conflict) {
  if (!conflict?.startYear) {
    return currentLanguage === "en" ? " (date pending)" : " (fecha pendiente)";
  }

  if (conflict.ongoing) {
    return ` (${conflict.startYear}-actualidad)`;
  }

  const endYear = conflict.endYear ?? conflict.startYear;

  if (endYear === conflict.startYear) {
    return ` (${conflict.startYear})`;
  }

  return ` (${conflict.startYear}-${endYear})`;
}

function extractYearsFromText(value) {
  return [...new Set(
    [...String(value || "").matchAll(/\b(1[0-9]{3}|20[0-9]{2}|2100)\b/g)].map(match => Number(match[1]))
  )].sort((a, b) => a - b);
}

function extractConflictStartYear(conflict) {
  if (!conflict) {
    return null;
  }

  if (typeof conflict === "object" && conflict.startYear) {
    return Number(conflict.startYear);
  }

  return extractYearsFromText(typeof conflict === "object" ? conflict.name : conflict)[0] || null;
}

function extractConflictEndYear(conflict) {
  if (!conflict) {
    return null;
  }

  if (typeof conflict === "object" && conflict.endYear) {
    return Number(conflict.endYear);
  }

  const years = extractYearsFromText(typeof conflict === "object" ? conflict.name : conflict);
  return years.length > 1 ? years.at(-1) : null;
}

function cleanConflictName(name) {
  return String(name || "")
    .replace(/\s*\((?:[^)]*?\b\d{4}\b[^)]*?)\)\s*$/u, "")
    .replace(/\s+(?:de|en)?\s*\d{4}(?:\s*[-â€“â€”]\s*\d{4})?\s*$/u, "")
    .replace(/\s*[-â€“â€”]\s*\d{4}(?:\s*[-â€“â€”]\s*\d{4})?\s*$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeConflictForDisplay(conflict) {
  if (!conflict) {
    return null;
  }

  const rawName = conflict.name || conflict;
  const translatedName = translateConflictName(rawName);
  const detail = CONFLICT_DETAIL_OVERRIDES[translatedName] || CONFLICT_DETAIL_OVERRIDES[rawName] || {};
  const inferredChronologyStart = getConflictChronologySortYear(translatedName, detail);
  const startYear = extractConflictStartYear(conflict) || inferredChronologyStart;
  const parsedEndYear = extractConflictEndYear(conflict);
  const chronologyYears = (detail?.chronology || []).map(item => Number(item?.year)).filter(Number.isFinite);
  const inferredChronologyEnd = chronologyYears.length ? Math.max(...chronologyYears) : null;
  const endYear = conflict.ongoing ? null : (parsedEndYear ?? inferredChronologyEnd ?? startYear ?? null);
  const cleanedName = cleanConflictName(translatedName) || translatedName;

  if (!cleanedName) {
    return null;
  }

  return {
    name: cleanedName,
    startYear: startYear || null,
    endYear,
    ongoing: Boolean(conflict.ongoing),
    sourceName: rawName,
    declaredParent: typeof conflict === "object" ? (conflict.parent || conflict.war || "") : "",
    declaredCampaign: typeof conflict === "object" ? (conflict.campaign || "") : ""
  };
}

function sortConflicts(conflicts) {
  return [...conflicts].sort((a, b) => {
    const yearA = a.startYear ?? Number.MAX_SAFE_INTEGER;
    const yearB = b.startYear ?? Number.MAX_SAFE_INTEGER;

    if (yearA !== yearB) {
      return yearA - yearB;
    }

    const endA = a.endYear ?? yearA;
    const endB = b.endYear ?? yearB;

    if (endA !== endB) {
      return endA - endB;
    }

    return String(a.name || "").localeCompare(String(b.name || ""), "es");
  });
}

function isGenericConflictHierarchyLabel(value = "") {
  return /^(conflicto regional de|campana vinculada a conflicto regional de)\b/.test(normalizeText(value));
}

function hasProvisionalConflictHierarchy(conflict = {}) {
  return isGenericConflictHierarchyLabel(conflict?.declaredParent || conflict?.parent || conflict?.war || "")
    || isGenericConflictHierarchyLabel(conflict?.declaredCampaign || conflict?.campaign || "");
}

function getConflictParentName(conflict) {
  const conflictName = typeof conflict === "object" ? conflict?.name : conflict;
  const normalized = normalizeText(conflictName);
  const declaredParent = cleanConflictName(translateConflictName(conflict?.declaredParent || conflict?.parent || conflict?.war || ""));
  const normalizedDeclaredParent = normalizeText(declaredParent);
  const isGenericDeclaredParent = isGenericConflictHierarchyLabel(declaredParent);
  if (declaredParent && normalizedDeclaredParent !== normalized && !isGenericDeclaredParent) {
    return declaredParent;
  }

  const match = CONFLICT_PARENT_RULES.find(rule =>
    rule.matches.some(token => normalized.includes(normalizeText(token)))
  );
  if (match?.parent) {
    return match.parent;
  }

  if (/^batalla de |^primera batalla de |^segunda batalla de |^tercera batalla de |^sitio de |^desembarco de /i.test(conflictName)) {
    if (/\b(1940|1941|1942|1943|1944|1945)\b/.test(conflictName) || /normandia|francia|berlin|caen|brest|montecassino|guam|labuan|el alamein|gazala|midway|guadalcanal/i.test(conflictName)) {
      return "Segunda Guerra Mundial";
    }
    if (/\b(1914|1915|1916|1917|1918)\b/.test(conflictName) || /verdun|somme|marne|ypres|jutlandia|aisne|cambrai|arras/i.test(conflictName)) {
      return "Primera Guerra Mundial";
    }
  }

  return null;
}

function inferConflictType(conflict, detail = {}) {
  const explicit = normalizeText(detail.type || "");
  if (explicit) {
    return explicit;
  }

  const normalized = normalizeText(conflict?.name || conflict || "");
  if (/batalla|siege|sitio|desembarco|raid|incursion|choque|enfrentamiento/.test(normalized)) {
    return "batalla o combate";
  }
  if (/campana|campaign|ofensiva|contraofensiva|frente/.test(normalized)) {
    return "campana militar";
  }
  if (normalized.includes("primera guerra mundial") || normalized.includes("segunda guerra mundial")) {
    return "guerra mundial";
  }
  if (/guerra civil|rebelion|levantamiento|intifada|insurgenc|separatista|crisis politica/.test(normalized)) {
    return "conflicto interno";
  }
  if (/ocupacion|intervencion|invasion/.test(normalized)) {
    return "intervencion u ocupacion";
  }
  return "guerra interestatal";
}

function inferConflictScope(conflict, detail = {}) {
  const explicit = normalizeText(detail.scope || "");
  if (explicit) {
    return explicit;
  }

  const normalized = normalizeText(conflict?.name || conflict || "");
  if (/batalla|sitio|desembarco|raid|incursion|choque/.test(normalized)) {
    return "subregional";
  }
  if (normalized.includes("guerra mundial")) {
    return "global";
  }
  if (/guerra civil|rebelion|levantamiento|intifada|insurgenc/.test(normalized)) {
    return "nacional";
  }
  return "regional";
}

function inferConflictRegion(conflict, detail = {}, countryName = "") {
  if (detail.region) {
    return detail.region;
  }

  const normalized = normalizeText(conflict?.name || conflict || "");
  if (/malvinas|triple alianza|surinam|haiti|costarricense|chaco|pacifico|chapultepec|obligado/.test(normalized)) {
    return "America Latina y el Caribe";
  }
  if (/yom kippur|seis dias|gaza|iran|iraq|siria|afganistan|kargil|china|india|corea|vietnam|israel|palestin|jord[aá]n|arab/.test(normalized)) {
    return "Asia y Medio Oriente";
  }
  if (/mundial|verdun|somme|marne|ypres|kosovo|espanola|ucran|ardenas|midway|guadalcanal|alamein|gazala|jutlandia|normandia|stalingrado|kursk/.test(normalized)) {
    return "Europa";
  }
  if (/congo|kivu|sahara|sudan|etiop|eritrea|somali|darfur|ogaden|ruanda|uganda|burundi|libia/.test(normalized)) {
    return "Africa";
  }
  return countryName ? `${countryName} y su entorno regional` : "Region indeterminada";
}

function getConflictRegionFilterKey(region = "") {
  const normalized = normalizeText(region);
  if (!normalized) {
    return "otras";
  }
  if (/europa|balcanes|caucaso/.test(normalized)) {
    return "europa";
  }
  if (/asia|medio oriente|golfo|levante/.test(normalized)) {
    return "asia";
  }
  if (/africa/.test(normalized)) {
    return "africa";
  }
  if (/america|caribe/.test(normalized)) {
    return "america";
  }
  return "otras";
}

function inferConflictLevel(conflict, detail = {}, parentName = null) {
  const explicit = normalizeText(detail.level || "");
  if (explicit) {
    return explicit;
  }

  const normalized = normalizeText(`${conflict?.name || conflict || ""} ${detail.type || conflict?.type || ""}`);
  if (CONFLICT_CAMPAIGN_MARKERS.some(marker => normalized.includes(marker))) {
    return "campaign";
  }
  if (/batalla|battle|sitio|siege|combate|asalto|raid|incursion|operacion|bombardeo|ataque|emboscada|desembarco|hundimiento/.test(normalized)) {
    return "battle";
  }
  if (!parentName) {
    return "war";
  }
  return "battle";
}

function getConflictLevelLabel(level) {
  const labels = {
    war: currentLanguage === "en" ? "War" : "Guerra",
    campaign: currentLanguage === "en" ? "Campaign" : "Campaña",
    battle: currentLanguage === "en" ? "Battle" : "Batalla"
  };
  return labels[level] || (currentLanguage === "en" ? "Conflict" : "Conflicto");
}

function inferConflictOutcomeKey(detail = {}) {
  const normalized = normalizeText(detail.outcome || "");
  if (!normalized) {
    return "other";
  }
  if (/curso|ongoing|sin resolver|parcialmente congelado/.test(normalized)) {
    return "ongoing";
  }
  if (/armistic|alto el fuego|cese del fuego/.test(normalized)) {
    return "ceasefire";
  }
  if (/independenc|secesion/.test(normalized)) {
    return "independence";
  }
  if (/victoria|derrota|liberacion|retirada|colapso|captura/.test(normalized)) {
    return "victory";
  }
  return "other";
}

function getConflictOutcomeLabel(key) {
  const labels = {
    victory: currentLanguage === "en" ? "Victory / defeat" : "Victoria / derrota",
    ceasefire: currentLanguage === "en" ? "Ceasefire / armistice" : "Armisticio / alto el fuego",
    independence: currentLanguage === "en" ? "Independence / secession" : "Independencia / secesion",
    ongoing: currentLanguage === "en" ? "Ongoing / unresolved" : "En curso / sin resolver",
    other: currentLanguage === "en" ? "Other outcome" : "Otro desenlace"
  };
  return labels[key] || labels.other;
}

function getConflictCountryRelationship(detail = {}, country = null) {
  if (!country || !Array.isArray(detail.participants)) {
    return null;
  }

  const namesToMatch = uniqueNormalizedList([
    country.name,
    country.general?.officialName,
    ...(country.general?.historicalNames || [])
  ]);

  const matchedSides = detail.participants.filter(side =>
    [...(side.members || []), ...(side.organizations || [])].some(member =>
      namesToMatch.some(name => normalizeText(member) === normalizeText(name))
    )
  );

  if (!matchedSides.length) {
    return null;
  }

  return {
    sideLabels: matchedSides.map(side => side.side).filter(Boolean),
    participants: matchedSides
  };
}

function getConflictTypeLabel(type) {
  const labels = {
    "guerra mundial": currentLanguage === "en" ? "World war" : "Guerra mundial",
    "guerra interestatal": currentLanguage === "en" ? "Interstate war" : "Guerra interestatal",
    "conflicto interno": currentLanguage === "en" ? "Internal conflict" : "Conflicto interno",
    "intervencion u ocupacion": currentLanguage === "en" ? "Intervention or occupation" : "Intervencion u ocupacion",
    "batalla o combate": currentLanguage === "en" ? "Battle or combat" : "Batalla o combate",
    "campana militar": currentLanguage === "en" ? "Military campaign" : "Campana militar",
    "guerra de independencia": currentLanguage === "en" ? "War of independence" : "Guerra de independencia",
    "conflicto fronterizo": currentLanguage === "en" ? "Border conflict" : "Conflicto fronterizo",
    levantamiento: currentLanguage === "en" ? "Uprising" : "Levantamiento",
    desembarco: currentLanguage === "en" ? "Landing operation" : "Desembarco",
    batalla: currentLanguage === "en" ? "Battle" : "Batalla",
    campana: currentLanguage === "en" ? "Campaign" : "Campana",
    "crisis politica": currentLanguage === "en" ? "Political crisis" : "Crisis politica",
    "escalada militar": currentLanguage === "en" ? "Military escalation" : "Escalada militar"
  };
  return labels[type] || type || (currentLanguage === "en" ? "Conflict" : "Conflicto");
}

function getConflictScopeLabel(scope) {
  const labels = {
    global: currentLanguage === "en" ? "Global" : "Global",
    regional: currentLanguage === "en" ? "Regional" : "Regional",
    nacional: currentLanguage === "en" ? "Domestic" : "Nacional",
    subregional: currentLanguage === "en" ? "Subregional" : "Subregional"
  };
  return labels[scope] || scope || (currentLanguage === "en" ? "Regional" : "Regional");
}

function assignBattlesToCampaigns(campaigns, battles) {
  const remainingBattles = [];

  battles.forEach(battle => {
    const battleKey = normalizeText(battle.name);
    const match = campaigns.find(campaign => {
      const keywords = normalizeText(campaign.name)
        .split(/\s+/)
        .filter(token => token.length >= 4 && !CONFLICT_CAMPAIGN_MARKERS.includes(token));
      return keywords.some(token => battleKey.includes(token));
    });

    if (match) {
      match.battles = match.battles || [];
      match.battles.push(battle);
      return;
    }

    remainingBattles.push(battle);
  });

  return {
    campaigns,
    battles: remainingBattles
  };
}

function buildConflictGroups(conflicts) {
  const cleanedConflicts = sortConflicts(
    conflicts
      .map(normalizeConflictForDisplay)
      .filter(Boolean)
      .filter(
        (conflict, index, list) =>
          index === list.findIndex(item => conflictDedupKey(item) === conflictDedupKey(conflict))
      )
  );

  const groupedWars = [];
  const standalone = [];

  cleanedConflicts.forEach(conflict => {
    const parentName = getConflictParentName(conflict);
    if (!parentName) {
      const detail = CONFLICT_DETAIL_OVERRIDES[conflict.name] || {};
      standalone.push({
        ...conflict,
        level: inferConflictLevel(conflict, detail, null),
        campaigns: [],
        battles: []
      });
      return;
    }

    let group = groupedWars.find(item => normalizeText(item.name) === normalizeText(parentName));
    if (!group) {
      const warConflict = cleanedConflicts.find(item => normalizeText(item.name) === normalizeText(parentName)) || {
        name: parentName,
        startYear: conflict.startYear,
        endYear: conflict.endYear,
        ongoing: false
      };
      group = { ...warConflict, level: "war", campaigns: [], battles: [] };
      groupedWars.push(group);
    }

    if (normalizeText(conflict.name) !== normalizeText(parentName)) {
      const detail = CONFLICT_DETAIL_OVERRIDES[conflict.name] || {};
      const level = inferConflictLevel(conflict, detail, parentName);
      const enriched = { ...conflict, level, battles: [], parentName };
      if (level === "campaign") {
        group.campaigns.push(enriched);
      } else {
        group.battles.push(enriched);
      }
    }
  });

  const merged = sortConflicts([
    ...groupedWars,
    ...standalone.filter(conflict => !groupedWars.some(group => normalizeText(group.name) === normalizeText(conflict.name)))
  ]);

  return merged.map(group => {
    const sortedCampaigns = sortConflicts(group.campaigns || []).map(campaign => ({ ...campaign, battles: [] }));
    const assignment = assignBattlesToCampaigns(sortedCampaigns, sortConflicts(group.battles || []));
    return {
      ...group,
      campaigns: assignment.campaigns.map(campaign => ({
        ...campaign,
        battles: sortConflicts(campaign.battles || [])
      })),
      battles: assignment.battles
    };
  });
}

function matchesConflictFilter(group, filter) {
  if (filter === "all") {
    return true;
  }

  const detail = CONFLICT_DETAIL_OVERRIDES[group.name] || {};
  const type = inferConflictType(group, detail);
  const scope = inferConflictScope(group, detail);
  const regionKey = getConflictRegionFilterKey(inferConflictRegion(group, detail));
  const outcomeKey = inferConflictOutcomeKey(detail);
  const sideLabels = (detail.participants || []).map(side => normalizeText(side.side));

  if (filter === "ongoing") return Boolean(group.ongoing || outcomeKey === "ongoing");
  if (filter === "historical") return !group.ongoing && outcomeKey !== "ongoing";
  if (filter === "global") return scope === "global";
  if (filter === "regional") return scope === "regional";
  if (filter === "internal") return type === "conflicto interno";
  if (filter === "interstate") return type === "guerra interestatal" || type === "intervencion u ocupacion";
  if (filter.startsWith("region:")) return regionKey === filter.split(":")[1];
  if (filter.startsWith("outcome:")) return outcomeKey === filter.split(":")[1];
  if (filter.startsWith("side:")) return sideLabels.some(side => side.includes(filter.split(":")[1]));

  return true;
}

function getConflictFilterState() {
  return {
    primary: currentPanelState.conflictFilter || "all",
    region: currentPanelState.conflictRegion || "all",
    outcome: currentPanelState.conflictOutcome || "all",
    side: currentPanelState.conflictSide || "all"
  };
}

function filterConflictGroups(groups, filters = "all") {
  const normalizedFilters = typeof filters === "string" ? { primary: filters } : (filters || {});
  return groups.filter(group =>
    matchesConflictFilter(group, normalizedFilters.primary || "all")
    && matchesConflictFilter(group, normalizedFilters.region || "all")
    && matchesConflictFilter(group, normalizedFilters.outcome || "all")
    && matchesConflictFilter(group, normalizedFilters.side || "all")
  );
}

function renderConflictFilters(groups) {
  const activeFilters = currentPanelState.type === "country"
    ? getConflictFilterState()
    : { primary: "all", region: "all", outcome: "all", side: "all" };
  const filteredCount = filterConflictGroups(groups, activeFilters).length;

  const primaryOptions = [
    { key: "all", label: currentLanguage === "en" ? "All" : "Todos" },
    { key: "ongoing", label: currentLanguage === "en" ? "Ongoing" : "Vigentes" },
    { key: "historical", label: currentLanguage === "en" ? "Historical" : "Historicos" },
    { key: "interstate", label: currentLanguage === "en" ? "Interstate" : "Interestatales" },
    { key: "internal", label: currentLanguage === "en" ? "Internal" : "Internos" },
    { key: "regional", label: currentLanguage === "en" ? "Regional" : "Regionales" },
    { key: "global", label: currentLanguage === "en" ? "Global" : "Globales" }
  ].filter(option => option.key === "all" || filterConflictGroups(groups, { primary: option.key }).length > 0);

  const regionOptions = [
    { key: "all", label: currentLanguage === "en" ? "Any region" : "Cualquier region" },
    ...uniqueBy(groups.map(group => {
      const detail = CONFLICT_DETAIL_OVERRIDES[group.name] || {};
      const key = getConflictRegionFilterKey(inferConflictRegion(group, detail));
      const labelMap = {
        europa: "Europa",
        asia: currentLanguage === "en" ? "Asia / Middle East" : "Asia / Medio Oriente",
        africa: "Africa",
        america: currentLanguage === "en" ? "America / Caribbean" : "America / Caribe",
        otras: currentLanguage === "en" ? "Other regions" : "Otras regiones"
      };
      return { key: `region:${key}`, label: labelMap[key] || key };
    }), item => item.key)
  ];

  const outcomeOptions = [
    { key: "all", label: currentLanguage === "en" ? "Any outcome" : "Cualquier desenlace" },
    ...uniqueBy(groups.map(group => {
      const key = inferConflictOutcomeKey(CONFLICT_DETAIL_OVERRIDES[group.name] || {});
      return { key: `outcome:${key}`, label: getConflictOutcomeLabel(key) };
    }), item => item.key)
  ];

  const sideOptions = [
    { key: "all", label: currentLanguage === "en" ? "Any side" : "Cualquier bando" },
    ...uniqueBy(
      groups.flatMap(group =>
        (CONFLICT_DETAIL_OVERRIDES[group.name]?.participants || []).map(side => ({
          key: `side:${normalizeText(side.side)}`,
          label: side.side
        }))
      ),
      item => item.key
    )
  ].slice(0, 12);

  const renderRow = (options, activeKey, attr) => `
    <div class="timeline-filters conflict-filters${attr !== "data-conflict-filter" ? " timeline-filters-secondary" : ""}">
      ${options.map(option => `
        <button
          type="button"
          class="timeline-filter${option.key === activeKey ? " is-active" : ""}"
          ${attr}="${escapeHtml(option.key)}"
        >${escapeHtml(option.label)}</button>
      `).join("")}
    </div>
  `;

  return [
    renderRow(primaryOptions, activeFilters.primary, "data-conflict-filter"),
    renderRow(regionOptions, activeFilters.region, "data-conflict-region"),
    renderRow(outcomeOptions, activeFilters.outcome, "data-conflict-outcome"),
    renderRow(sideOptions, activeFilters.side, "data-conflict-side"),
    `<p class="compare-note">${currentLanguage === "en" ? "Visible conflicts" : "Conflictos visibles"}: ${formatNumber(filteredCount)} / ${formatNumber(groups.length)}</p>`
  ].join("");
}

function renderConflictOverview(groups, country) {
  const wars = groups.filter(group => group.level === "war").length;
  const battles = groups.reduce((sum, group) =>
    sum
    + (group.level === "battle" ? 1 : 0)
    + (group.battles?.length || 0)
    + (group.campaigns || []).reduce((campaignSum, campaign) => campaignSum + (campaign.battles?.length || 0), 0), 0);
  const ongoing = groups.filter(group => group.ongoing).length;
  const global = groups.filter(group => group.level === "war" && inferConflictScope(group, CONFLICT_DETAIL_OVERRIDES[group.name] || {}) === "global").length;
  const regional = groups.filter(group => group.level === "war" && inferConflictScope(group, CONFLICT_DETAIL_OVERRIDES[group.name] || {}) === "regional").length;
  const latestConflict = groups
    .slice()
    .sort((a, b) => Number(b.startYear || b.endYear || 0) - Number(a.startYear || a.endYear || 0))[0];

  return `
      <div class="country-overview-grid relation-overview-grid conflict-overview-grid">
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Wars" : "Guerras"}</span><strong class="overview-value">${formatNumber(wars)}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Battles" : "Batallas"}</span><strong class="overview-value">${formatNumber(battles)}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Ongoing" : "Vigentes"}</span><strong class="overview-value">${formatNumber(ongoing)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Global wars" : "Guerras globales"}</span><strong class="overview-value">${formatNumber(global)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Regional wars" : "Guerras regionales"}</span><strong class="overview-value">${formatNumber(regional)}</strong></div>
      </div>
      <p class="data-source-note"><b>${currentLanguage === "en" ? "Regional focus" : "Foco regional"}:</b> ${escapeHtml(translateContinentName(country?.continent || "Unknown"))}</p>
      ${latestConflict ? `<p class="data-source-note"><b>${currentLanguage === "en" ? "Most linked conflict" : "Conflicto mas vinculado"}:</b> ${escapeHtml(latestConflict.name)}${latestConflict.startYear ? ` (${escapeHtml(String(latestConflict.startYear))})` : ""}</p>` : ""}
    `;
}

function renderRelatedConflictSummary(groups) {
  const related = [...new Set(
    groups.flatMap(group => {
      const detail = CONFLICT_DETAIL_OVERRIDES[group.name] || {};
      return Array.isArray(detail.related) ? detail.related : [];
    }).filter(Boolean)
  )];

  if (!related.length) {
    return "";
  }

  return `
    <div class="relation-group">
      <p class="relation-title">${currentLanguage === "en" ? "Related conflicts" : "Conflictos relacionados"}</p>
      ${renderRelationChips(related)}
    </div>
  `;
}

function buildGenericConflictCause(conflict, type, scope, region, countryName = "") {
  const parentLabel = conflict?.parentName ? ` dentro de ${conflict.parentName}` : "";
  const locationLabel = region && region !== "Region indeterminada" ? ` en ${region}` : "";
  const actorLabel = countryName ? ` para ${countryName}` : "";

  if (conflict?.level === "battle") {
    return `Fue un enfrentamiento tactico${parentLabel}${locationLabel}${actorLabel}, vinculado a operaciones militares mas amplias y a objetivos inmediatos de control territorial, desgaste o ruptura del frente.`;
  }
  if (conflict?.level === "campaign") {
    return `Fue una campana militar${parentLabel}${locationLabel}${actorLabel}, desarrollada para sostener una ofensiva, asegurar una region clave o modificar el equilibrio operativo del conflicto principal.`;
  }
  if (type === "guerra mundial") {
    return `Se produjo por la escalada entre grandes coaliciones rivales, la militarizacion acumulada y disputas estrategicas que terminaron proyectandose a escala ${scope}.`;
  }
  if (type === "conflicto interno") {
    return `Se origino en una crisis de poder, legitimidad o control territorial${locationLabel}${actorLabel}, con enfrentamientos entre el aparato estatal y fuerzas rebeldes, insurgentes o secesionistas.`;
  }
  if (type === "intervencion u ocupacion") {
    return `Se desencadeno por una invasion, intervencion externa u ocupacion${locationLabel}${actorLabel}, en un contexto de seguridad regional, cambio de regimen o disputa por influencia estrategica.`;
  }
  return `Se desarrollo por disputas interestatales${locationLabel}${actorLabel} vinculadas a fronteras, equilibrio regional, seguridad o control de espacios y recursos estrategicos.`;
}

function buildGenericConflictParticipants(conflict, type, countryName = "") {
  const selectedCountry = countryName || "Estado implicado";
  if (conflict?.level === "battle") {
    return [
      {
        side: "Fuerzas enfrentadas",
        members: [selectedCountry || "Actores del conflicto principal"],
        organizations: conflict.parentName ? [conflict.parentName] : [],
        troops: "contingentes militares variables",
        casualties: "sin cifra consolidada"
      }
    ];
  }
  if (conflict?.level === "campaign" || type === "campana militar") {
    return [
      {
        side: "Fuerzas de la campaña principal",
        members: [selectedCountry],
        organizations: conflict.parentName ? [conflict.parentName] : [],
        troops: "fuerzas regulares y apoyos variables",
        casualties: "sin cifra consolidada"
      }
    ];
  }
  if (type === "conflicto interno") {
    return [
      {
        side: "Gobierno y aparato estatal",
        members: [selectedCountry],
        organizations: [],
        troops: "movilizacion estatal variable",
        casualties: "sin cifra consolidada"
      },
      {
        side: "Rebeldes / insurgentes / oposicion armada",
        members: ["facciones armadas no estatales"],
        organizations: [],
        troops: "fuerzas irregulares o mixtas",
        casualties: "sin cifra consolidada"
      }
    ];
  }
  if (type === "guerra mundial") {
    return [
      {
        side: "Coalicion principal",
        members: [selectedCountry],
        organizations: [],
        troops: "movilizacion de gran escala",
        casualties: "muy elevadas"
      },
      {
        side: "Coalicion rival",
        members: ["potencias rivales"],
        organizations: [],
        troops: "movilizacion de gran escala",
        casualties: "muy elevadas"
      }
    ];
  }
  if (type === "intervencion u ocupacion") {
    return [
      {
        side: "Fuerzas intervinientes",
        members: [selectedCountry],
        organizations: [],
        troops: "fuerzas expedicionarias o combinadas",
        casualties: "sin cifra consolidada"
      },
      {
        side: "Defensa local / resistencia / actor intervenido",
        members: ["fuerzas locales"],
        organizations: [],
        troops: "fuerzas regulares e irregulares",
        casualties: "sin cifra consolidada"
      }
    ];
  }
  return [
    {
      side: "Estado o coalicion principal",
      members: [selectedCountry],
      organizations: [],
      troops: "fuerzas regulares",
      casualties: "sin cifra consolidada"
    },
    {
      side: "Estado o coalicion rival",
      members: ["adversarios estatales"],
      organizations: [],
      troops: "fuerzas regulares",
      casualties: "sin cifra consolidada"
    }
  ];
}

function buildGenericConflictOutcome(conflict) {
  if (conflict?.level === "battle") {
    return "El combate altero de forma puntual la situacion tactica del frente, aunque su balance exacto no esta completamente estructurado en el dataset.";
  }
  if (conflict?.level === "campaign") {
    return "La campaña modifico el equilibrio operativo del conflicto mayor, aunque su desenlace puntual todavia no esta completamente estructurado.";
  }
  if (conflict?.ongoing) {
    return "El conflicto sigue abierto o no cuenta todavia con una resolucion estable y ampliamente aceptada.";
  }
  if (conflict?.endYear && conflict?.startYear && conflict.endYear !== conflict.startYear) {
    return `La fase armada principal concluyo en ${conflict.endYear}, tras varios ciclos de combate, negociacion o agotamiento militar.`;
  }
  if (conflict?.startYear) {
    return `El episodio principal se cerro en ${conflict.startYear}, aunque sus efectos politicos y territoriales pudieron continuar despues.`;
  }
  return "El desenlace puntual no esta completamente estructurado, pero el episodio forma parte de una secuencia historica mayor ya identificada por el dataset.";
}

function buildGenericConflictConsequences(conflict, type, region, countryName = "") {
  const regionLabel = region && region !== "Region indeterminada" ? ` en ${region}` : "";
  const actorLabel = countryName ? ` para ${countryName}` : " para los actores implicados";
  if (conflict?.level === "battle") {
    return `Su efecto principal fue operativo: altero posiciones, ritmos de ofensiva o capacidad de resistencia dentro del conflicto mayor${conflict?.parentName ? ` asociado a ${conflict.parentName}` : ""}.`;
  }
  if (type === "conflicto interno") {
    return `Dejo secuelas politicas, sociales y de seguridad${regionLabel}${actorLabel}, con desplazamientos, reconfiguracion del poder interno y efectos duraderos sobre la legitimidad estatal.`;
  }
  if (type === "campana militar") {
    return `Su efecto principal fue operativo y estrategico${regionLabel}${actorLabel}: sostuvo ofensivas, desgasto fuerzas rivales o preparo batallas de mayor escala dentro del conflicto principal.`;
  }
  if (type === "guerra mundial") {
    return `Transformo el equilibrio internacional${regionLabel}${actorLabel}, alterando fronteras, alianzas, doctrinas militares y el sistema politico global posterior.`;
  }
  return `Produjo cambios militares y diplomaticos${regionLabel}${actorLabel}, con impacto sobre fronteras, alianzas, prestigio estrategico o seguridad regional.`;
}

function buildGenericRelatedConflicts(conflict) {
  const related = [];
  if (conflict?.parentName) {
    related.push(conflict.parentName);
  }
  const normalized = normalizeText(conflict?.name || "");
  if (normalized.includes("primera guerra mundial")) {
    related.push("Segunda Guerra Mundial");
  }
  if (normalized.includes("segunda guerra mundial")) {
    related.push("Primera Guerra Mundial");
  }
  if (normalized.includes("guerra ruso-ucraniana") || normalized.includes("donbas")) {
    related.push("Guerra de Crimea");
  }
  if (/midway|guadalcanal|alamein|gazala|ardenas/.test(normalized)) {
    related.push("Segunda Guerra Mundial");
  }
  if (/tet|khe sanh|long tan|hamburger hill|vietnamita fase/.test(normalized)) {
    related.push("Guerra de Vietnam");
  }
  if (/gaza|yom kippur|seis dias|israel|palestin/.test(normalized)) {
    related.push("Guerras arabe-israelies");
  }
  if (/congo|kivu|ruanda/.test(normalized)) {
    related.push("Segunda guerra del Congo");
  }
  if (/sahara|saharaui/.test(normalized)) {
    related.push("Guerra del Sahara Occidental");
  }
  if (/sudan|darfur|sursudan/.test(normalized)) {
    related.push("Segunda guerra civil sudanesa");
  }
  return [...new Set(related)];
}

function renderConflictWikipediaField(labelEs, labelEn, value) {
  if (!value || (Array.isArray(value) && !value.length)) {
    return "";
  }

  const label = currentLanguage === "en" ? labelEn : labelEs;
  const normalizeItem = item => String(item || "")
    .replace(/&#\d+;?/g, " ")
    .replace(/&#x[a-f0-9]+;?/gi, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, " ")
    .replace(/&&&&+[^ \n]*/g, " ")
    .replace(/Expresi[oó]n err[oó]nea:[^.;\n]*/gi, " ")
    .replace(/(?:^|\s)(?:ver|vease|v[eé]ase)\s+(?:el\s+)?anexo(?:$|\s)/gi, " ")
    .replace(/\b(?:ver|mostrar|ocultar)\b/gi, " ")
    .replace(/Â·/g, " · ")
    .replace(/Â/g, " ")
    .replace(/\bTotal:\s*Total:/gi, "Total:")
    .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*(?:\s+[\p{L}\p{N}][\p{L}\p{N}.-]*)+)\s+\1\b/gu, "$1")
    .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*)\s+\1\b/gu, "$1")
    .replace(/\?{2,}/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
  const shouldDrop = item => {
    const normalized = normalizeItem(item).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return !normalized
      || normalized === "vease el anexo"
      || normalized === "ver anexo"
      || normalized === "beligerantes"
      || normalized === "belligerents";
  };

  if (Array.isArray(value)) {
    const items = value.some(item => Array.isArray(item))
      ? value
        .map(entry => (entry || []).map(normalizeItem).filter(item => !shouldDrop(item)).join(", "))
        .filter(item => !shouldDrop(item))
      : uniqueNormalizedList(value.map(normalizeItem).filter(item => !shouldDrop(item)));
    if (!items.length) {
      return "";
    }
    return `
      <div class="conflict-modal-side">
        <strong>${escapeHtml(label)}</strong>
        <p>${escapeHtml(items.join(" · "))}</p>
      </div>
    `;
  }

  if (shouldDrop(value)) {
    return "";
  }

  return `
    <div class="conflict-modal-side">
      <strong>${escapeHtml(label)}</strong>
      <p>${escapeHtml(normalizeItem(value))}</p>
    </div>
  `;
}

function getConflictCurationStatusLabel(status) {
  const key = normalizeText(status || "");
  if (!key) return "";
  const labels = {
    estructural: currentLanguage === "en" ? "Structural curation" : "Curaduria estructural",
    manual: currentLanguage === "en" ? "Manual curation" : "Curaduria manual",
    verificado: currentLanguage === "en" ? "Verified detail" : "Detalle verificado"
  };
  return labels[key] || String(status || "");
}

function getConflictConfidenceLabel(confidence) {
  const key = normalizeText(confidence || "");
  if (!key) return "";
  const labels = {
    parcial: currentLanguage === "en" ? "Partial confidence" : "Confianza parcial",
    alta: currentLanguage === "en" ? "High confidence" : "Confianza alta",
    media: currentLanguage === "en" ? "Medium confidence" : "Confianza media",
    baja: currentLanguage === "en" ? "Low confidence" : "Confianza baja"
  };
  return labels[key] || String(confidence || "");
}

function renderConflictTrustBadges(detail = {}) {
  const badges = [
    getConflictCurationStatusLabel(detail.curationStatus),
    getConflictConfidenceLabel(detail.dataConfidence),
    detail.parentName && normalizeText(detail.hierarchyConfidence) === "alta"
      ? (currentLanguage === "en" ? "Verified hierarchy" : "Jerarquia verificada")
      : "",
    detail.hierarchyProvisional
      ? (currentLanguage === "en" ? "Hierarchy pending" : "Jerarquia pendiente")
      : ""
  ].filter(Boolean);

  if (!badges.length) {
    return "";
  }

  const label = currentLanguage === "en" ? "Data quality" : "Calidad del dato";
  return `
    <div class="conflict-trust-badges" aria-label="${escapeHtml(label)}">
      ${badges.map(item => `<span class="conflict-trust-badge">${escapeHtml(item)}</span>`).join("")}
    </div>
  `;
}

function getSafeConflictSourceUrl(value) {
  try {
    const url = new URL(String(value || ""), window.location.href);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderConflictHierarchySources(sources = []) {
  const items = (Array.isArray(sources) ? sources : [])
    .map(item => typeof item === "string" ? { label: item, url: "" } : item)
    .map(item => ({
      label: String(item?.label || item?.url || "").trim(),
      url: getSafeConflictSourceUrl(item?.url)
    }))
    .filter(item => item.label)
    .filter((item, index, list) => index === list.findIndex(candidate => candidate.label === item.label && candidate.url === item.url));

  if (!items.length) {
    return "";
  }

  return `
    <div class="conflict-modal-section conflict-hierarchy-sources">
      <h4>${currentLanguage === "en" ? "Hierarchy sources" : "Fuentes de la jerarquia"}</h4>
      <ul class="data-source-list">
        ${items.map(item => `<li>${item.url
          ? `<a class="conflict-source-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.label)}</a>`
          : escapeHtml(item.label)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function getConflictModalContent(conflict, countryName = "") {
  const detail = CONFLICT_DETAIL_OVERRIDES[conflict.name] || {};
  const type = inferConflictType(conflict, detail);
  const scope = inferConflictScope(conflict, detail);
  const region = inferConflictRegion(conflict, detail, countryName);
  const parentName = conflict.parentName || getConflictParentName(conflict);
  const hierarchyProvisional = !parentName && hasProvisionalConflictHierarchy(conflict);
  const level = conflict.level || inferConflictLevel(conflict, detail, parentName);
  const participants = dedupeConflictParticipants(
    (Array.isArray(detail.participants) && detail.participants.length)
      ? detail.participants
      : buildGenericConflictParticipants(conflict, type, countryName)
  );
  const contextCountry = countryName
    ? getCountryValues().find(country => [country.name, country.general?.officialName, ...(country.general?.historicalNames || [])]
      .some(name => normalizeText(name) === normalizeText(countryName)))
    : null;
  const countryRelationship = getConflictCountryRelationship({ ...detail, participants }, contextCountry);
  const chronology = (Array.isArray(detail.chronology) && detail.chronology.length ? detail.chronology : buildGenericConflictChronology(conflict))
    .map(item => ({
      ...(item && typeof item === "object" ? item : {}),
      text: sanitizeConflictModalText(getConflictChronologyText(item))
    }))
    .filter(item => item.text)
    .sort((a, b) => {
      const yearA = Number.isFinite(Number(a?.year)) ? Number(a.year) : Number.MAX_SAFE_INTEGER;
      const yearB = Number.isFinite(Number(b?.year)) ? Number(b.year) : Number.MAX_SAFE_INTEGER;
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      return String(a?.text || "").localeCompare(String(b?.text || ""), "es");
    });
  return {
    title: `${conflict.name}${formatConflictPeriod(conflict)}`,
    level,
    parentName,
    hierarchyProvisional,
    type,
    scope,
    region,
    countryRelationship,
    cause: detail.cause || buildGenericConflictCause(conflict, type, scope, region, countryName),
    participants,
    chronology,
    battles: Array.isArray(conflict.battles) ? conflict.battles : [],
    campaigns: Array.isArray(conflict.campaigns) ? conflict.campaigns : [],
    related: (Array.isArray(detail.related) && detail.related.length) ? detail.related : buildGenericRelatedConflicts(conflict),
    outcome: detail.outcome || buildGenericConflictOutcome(conflict),
    consequences: detail.consequences || buildGenericConflictConsequences(conflict, type, region, countryName),
    curationStatus: detail.curationStatus || conflict.curationStatus || ((detail.curationBatch || conflict.curationBatch) ? "estructural" : ""),
    dataConfidence: detail.dataConfidence || conflict.dataConfidence || "",
    hierarchyConfidence: detail.hierarchyConfidence || conflict.hierarchyConfidence || "",
    hierarchySources: detail.hierarchySources || conflict.hierarchySources || [],
    wikipedia: detail.wikipedia || null
  };
}

function sanitizeConflictModalText(value = "") {
  return String(value || "")
    .replace(/&#\d+;?/g, " ")
    .replace(/&#x[a-f0-9]+;?/gi, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, " ")
    .replace(/&&&&+[^ \n]*/g, " ")
    .replace(/(?:\s*[;:·|-]\s*)?(?:Bajas|Fuerzas en combate|Beligerantes|Figuras politicas|Figuras políticas)\s*:\s*(?=(?:Bando|Aliados|Eje|Estados Unidos|Reino Unido|China|Union Sovietica|Unión Soviética)\b)/gi, " · ")
    .replace(/Expresi[oó]n err[oó]nea:[^.;\n]*/gi, " ")
    .replace(/(?:^|\s)(?:ver|vease|v[eé]ase)\s+el?\s+anexo(?:$|\s)/gi, " ")
    .replace(/\b(?:ver|mostrar|ocultar)\b/gi, " ")
    .replace(/\bBando\s+1\s*:\s*/gi, "")
    .replace(/\bBando\s+2\s*:\s*/gi, "")
    .replace(/\bBando\s+3\s*:\s*/gi, "")
    .replace(/Â·/g, " · ")
    .replace(/Â/g, " ")
    .replace(/â€“|â€”/g, "-")
    .replace(/\bTotal:\s*Total:/gi, "Total:")
    .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*(?:\s+[\p{L}\p{N}][\p{L}\p{N}.-]*)+)\s+\1\b/gu, "$1")
    .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*)\s+\1\b/gu, "$1")
    .replace(/\?{2,}/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function registerConflictModal(conflict, countryName = "") {
  const key = `conflict-${conflictModalCounter += 1}`;
  conflictModalRegistry.set(key, {
    conflict,
    countryName,
    detail: getConflictModalContent(conflict, countryName)
  });
  return key;
}

function renderConflicts(conflicts, prebuiltGroups = null) {
  if (!conflicts || !conflicts.length) {
    return "<p>Sin datos</p>";
  }

  const groupedConflicts = Array.isArray(prebuiltGroups) ? prebuiltGroups : buildConflictGroups(conflicts);
  const filteredConflicts = filterConflictGroups(
    groupedConflicts,
    currentPanelState.type === "country" ? getConflictFilterState() : "all"
  );
  const defaultVisibleLimit = isMobileLayout() ? 8 : 16;
  const visibleLimit = Math.max(defaultVisibleLimit, Number(currentPanelState.conflictVisibleLimit) || 0);
  const visibleConflicts = filteredConflicts.slice(0, visibleLimit);
  const remainingConflicts = Math.max(0, filteredConflicts.length - visibleConflicts.length);

  if (!filteredConflicts.length) {
    return "<p>Sin datos</p>";
  }

  return `${renderConflictFilters(groupedConflicts)}<ul class="conflict-tree">${visibleConflicts
    .map(conflict => {
      const modalKey = registerConflictModal(conflict, currentPanelState?.code ? countriesData[currentPanelState.code]?.name : "");
      const groupKey = normalizeText(conflict.name);
      const defaultChildLimit = isMobileLayout() ? 3 : 5;
      const childLimit = Math.max(defaultChildLimit, Number(currentPanelState.conflictChildLimits?.[groupKey]) || 0);
      const allCampaigns = sortConflicts(conflict.campaigns || []);
      const allBattles = sortConflicts(conflict.battles || []);
      const campaigns = allCampaigns.slice(0, Math.max(1, Math.ceil(childLimit / 2)));
      const battles = allBattles.slice(0, childLimit);
      const detail = CONFLICT_DETAIL_OVERRIDES[conflict.name] || {};
      const type = getConflictTypeLabel(inferConflictType(conflict, detail));
      const scope = getConflictScopeLabel(inferConflictScope(conflict, detail));
      const region = inferConflictRegion(conflict, detail, currentPanelState?.code ? countriesData[currentPanelState.code]?.name : "");
      return `
        <li class="conflict-entry">
          <button type="button" class="conflict-trigger conflict-trigger-main" data-conflict-key="${modalKey}">
            <span class="conflict-trigger-copy">
              <span class="conflict-trigger-meta">${escapeHtml(type)} · ${escapeHtml(scope)} · ${escapeHtml(region)}</span>
              <span class="conflict-trigger-title">${escapeHtml(conflict.name)}</span>
            </span>
            <span class="conflict-trigger-period">${formatConflictPeriod(conflict).trim()}</span>
          </button>
          ${campaigns.length ? `<ul class="conflict-campaigns">${campaigns.map(campaign => {
            const campaignKey = registerConflictModal(campaign, currentPanelState?.code ? countriesData[currentPanelState.code]?.name : "");
            const allCampaignBattles = sortConflicts(campaign.battles || []);
            const campaignBattles = allCampaignBattles.slice(0, childLimit);
            return `<li>
              <button type="button" class="conflict-trigger conflict-trigger-campaign" data-conflict-key="${campaignKey}">
                <span class="conflict-trigger-title">${escapeHtml(campaign.name)}</span>
                <span class="conflict-trigger-period">${formatConflictPeriod(campaign).trim()}</span>
              </button>
              ${campaignBattles.length ? `<ul class="conflict-battles">${campaignBattles.map(battle => {
                const battleKey = registerConflictModal(battle, currentPanelState?.code ? countriesData[currentPanelState.code]?.name : "");
                return `<li><button type="button" class="conflict-trigger conflict-trigger-battle" data-conflict-key="${battleKey}"><span class="conflict-trigger-title">${escapeHtml(battle.name)}</span><span class="conflict-trigger-period">${formatConflictPeriod(battle).trim()}</span></button></li>`;
              }).join("")}</ul>` : ""}
              ${allCampaignBattles.length > campaignBattles.length ? `<p class="compare-note">+${formatNumber(allCampaignBattles.length - campaignBattles.length)} ${currentLanguage === "en" ? "battles in this campaign" : "batallas en esta campana"}</p>` : ""}
            </li>`;
          }).join("")}</ul>` : ""}
          ${battles.length ? `<ul class="conflict-battles">${battles.map(battle => {
            const battleKey = registerConflictModal(battle, currentPanelState?.code ? countriesData[currentPanelState.code]?.name : "");
            return `<li><button type="button" class="conflict-trigger conflict-trigger-battle" data-conflict-key="${battleKey}"><span class="conflict-trigger-title">${escapeHtml(battle.name)}</span><span class="conflict-trigger-period">${formatConflictPeriod(battle).trim()}</span></button></li>`;
          }).join("")}</ul>` : ""}
          ${(allCampaigns.length > campaigns.length || allBattles.length > battles.length) ? `
            <button type="button" class="conflict-child-more" data-conflict-expand-children="${escapeHtml(groupKey)}">
              ${currentLanguage === "en" ? "Show more related actions" : "Mostrar mas acciones relacionadas"}
            </button>
          ` : ""}
        </li>
      `;
    })
    .join("")}</ul>${remainingConflicts ? `
      <button type="button" class="panel-action-button conflict-load-more" data-conflict-load-more>
        ${currentLanguage === "en" ? "Show" : "Mostrar"} ${formatNumber(Math.min(defaultVisibleLimit, remainingConflicts))} ${currentLanguage === "en" ? "more" : "mas"}
        <span>${formatNumber(visibleConflicts.length)} / ${formatNumber(filteredConflicts.length)}</span>
      </button>
    ` : ""}`;
}

function getConflictModalEntryDetail(entry) {
  if (!entry) {
    return null;
  }
  if (entry.detail) {
    return entry.detail;
  }
  return entry;
}

function maybeEnhanceOpenConflictModal(key, entry) {
  if (!entry?.conflict?.name) {
    return;
  }

  loadWikipediaConflictDetails(entry.conflict.name)
    .then(loadedDetail => {
      const currentEntry = conflictModalRegistry.get(key);
      const modal = document.getElementById("conflict-modal");
      if (!loadedDetail || !currentEntry || modal?.hidden) {
        return;
      }
      currentEntry.detail = getConflictModalContent(currentEntry.conflict, currentEntry.countryName || "");
      openConflictModal(key, { enhance: false });
    })
    .catch(error => {
      console.warn("No se pudo enriquecer el conflicto bajo demanda:", error);
    });
}

function openConflictModal(key, { enhance = true } = {}) {
  const modal = document.getElementById("conflict-modal");
  const body = document.getElementById("conflict-modal-body");
  const entry = conflictModalRegistry.get(key);
  const detail = getConflictModalEntryDetail(entry);
  if (!modal || !body || !detail) {
    return;
  }

  body.innerHTML = `
    <h3 id="conflict-modal-title">${escapeHtml(detail.title)}</h3>
    <p class="conflict-modal-subtitle">${currentLanguage === "en" ? "Historical conflict summary" : "Resumen historico del conflicto"}</p>
    ${renderConflictTrustBadges(detail)}
    <div class="country-overview-grid relation-overview-grid conflict-overview-grid">
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Level" : "Nivel"}</span><strong class="overview-value">${escapeHtml(getConflictLevelLabel(detail.level))}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Type" : "Tipo"}</span><strong class="overview-value">${escapeHtml(getConflictTypeLabel(detail.type))}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Scope" : "Escala"}</span><strong class="overview-value">${escapeHtml(getConflictScopeLabel(detail.scope))}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Region" : "Region"}</span><strong class="overview-value">${escapeHtml(detail.region || "Sin datos")}</strong></div>
      ${detail.parentName ? `<div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Parent conflict" : "Conflicto padre"}</span><strong class="overview-value">${escapeHtml(detail.parentName)}</strong></div>` : ""}
      ${detail.countryRelationship?.sideLabels?.length ? `<div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Country side" : "Bando del pais"}</span><strong class="overview-value">${escapeHtml(detail.countryRelationship.sideLabels.join(" / "))}</strong></div>` : ""}
    </div>
    ${renderConflictHierarchySources(detail.hierarchySources)}
    <div class="conflict-modal-section">
      <h4>${currentLanguage === "en" ? "Why it started" : "Por que estallo"}</h4>
      <p>${escapeHtml(detail.cause)}</p>
    </div>
      <div class="conflict-modal-section">
        <h4>${currentLanguage === "en" ? "Participants and sides" : "Participantes y bandos"}</h4>
      ${detail.participants.map(item => `
        <div class="conflict-modal-side">
          <strong>${escapeHtml(sanitizeConflictModalText(item.side))}</strong>
          <p><b>${currentLanguage === "en" ? "States" : "Paises"}:</b> ${escapeHtml((item.members || ["Sin datos"]).map(sanitizeConflictModalText).join(", "))}</p>
          ${item.organizations && item.organizations.length ? `<p><b>${currentLanguage === "en" ? "Organizations" : "Organizaciones"}:</b> ${escapeHtml(item.organizations.map(sanitizeConflictModalText).join(", "))}</p>` : ""}
          ${item.troops ? `<p><b>${currentLanguage === "en" ? "Troops" : "Soldados"}:</b> ${escapeHtml(sanitizeConflictModalText(item.troops))}</p>` : ""}
          ${item.casualties ? `<p><b>${currentLanguage === "en" ? "Casualties" : "Bajas"}:</b> ${escapeHtml(sanitizeConflictModalText(item.casualties))}</p>` : ""}
        </div>
      `).join("")}
    </div>
    ${detail.wikipedia ? `
      <div class="conflict-modal-section">
        <h4>${currentLanguage === "en" ? "Wikipedia infobox" : "Ficha de Wikipedia"}</h4>
        ${renderConflictWikipediaField("Fecha", "Date", detail.wikipedia.date)}
        ${renderConflictWikipediaField("Lugar", "Place", detail.wikipedia.place)}
        ${renderConflictWikipediaField("Casus belli", "Casus belli", detail.wikipedia.casusBelli)}
        ${renderConflictWikipediaField("Resultado", "Result", detail.wikipedia.result)}
        ${renderConflictWikipediaField("Cambios territoriales", "Territorial changes", detail.wikipedia.territorialChanges)}
        ${detail.participants?.length ? "" : renderConflictWikipediaField("Beligerantes", "Belligerents", detail.wikipedia.belligerents)}
        ${renderConflictWikipediaField("Figuras politicas", "Political figures", detail.wikipedia.commanders)}
        ${detail.participants?.some(item => item?.troops) ? "" : renderConflictWikipediaField("Fuerzas en combate", "Strength", detail.wikipedia.strength)}
        ${detail.participants?.some(item => item?.casualties) ? "" : renderConflictWikipediaField("Bajas", "Casualties", detail.wikipedia.casualties)}
      </div>
    ` : ""}
    ${detail.chronology?.length ? `
      <div class="conflict-modal-section">
        <h4>${currentLanguage === "en" ? "Internal chronology" : "Cronologia interna"}</h4>
        <ul class="data-source-list">
          ${detail.chronology.map(item => {
            const yearLabel = item?.year ? `<b>${escapeHtml(String(item.year))}</b> · ` : "";
            return `<li>${yearLabel}${escapeHtml(item.text || item)}</li>`;
          }).join("")}
        </ul>
      </div>
    ` : ""}
    ${detail.campaigns?.length ? `
      <div class="conflict-modal-section">
        <h4>${currentLanguage === "en" ? "Campaigns" : "Campanas"}</h4>
        <ul class="data-source-list">
          ${detail.campaigns
            .slice()
            .sort((a, b) => (a.startYear || 0) - (b.startYear || 0))
            .map(item => `<li><b>${escapeHtml(item.name || "Campana")}</b>${formatConflictPeriod(item)}</li>`)
            .join("")}
        </ul>
      </div>
    ` : ""}
    ${detail.battles?.length ? `
      <div class="conflict-modal-section">
        <h4>${currentLanguage === "en" ? "Campaigns and battles" : "Campanas y batallas"}</h4>
        <ul class="data-source-list">
          ${detail.battles.slice().sort((a, b) => (a.startYear || 0) - (b.startYear || 0)).map(item => `<li><b>${escapeHtml(item.name || "Batalla")}</b>${formatConflictPeriod(item)}</li>`).join("")}
        </ul>
      </div>
    ` : ""}
    <div class="conflict-modal-section">
      <h4>${currentLanguage === "en" ? "How it ended" : "Como se resolvio"}</h4>
      <p>${escapeHtml(detail.outcome)}</p>
    </div>
    <div class="conflict-modal-section">
      <h4>${currentLanguage === "en" ? "Consequences" : "Que cambio despues"}</h4>
      <p>${escapeHtml(detail.consequences)}</p>
    </div>
    ${detail.related?.length ? `
      <div class="conflict-modal-section">
        <h4>${currentLanguage === "en" ? "Related conflicts" : "Conflictos relacionados"}</h4>
        ${renderRelationChips(detail.related)}
      </div>
    ` : ""}
  `;

  modal.hidden = false;
  syncModalOpenState();
  if (enhance) {
    maybeEnhanceOpenConflictModal(key, entry);
  }
}

function closeConflictModal() {
  const modal = document.getElementById("conflict-modal");
  const body = document.getElementById("conflict-modal-body");
  if (!modal || modal.hidden) {
    return;
  }
  modal.hidden = true;
  syncModalOpenState();
  if (body) {
    body.innerHTML = "";
  }
}

function clearSelection() {
  lastInteractionAt = Date.now();
  if (!selectedLayers.length && !selectedLayer && !continentBoundsLayer) {
    selectionMode = "country";
    return;
  }
  if (viewer) {
    viewer.camera.cancelFlight();
  }
  if (isMobileLayout()) {
    closeMobilePanels();
  }

  selectedLayers.forEach(layer => {
    if (layer) {
      layer.setStyle(getCountryThemeStyle(layer.code));
    }
  });
  selectedLayer = null;
  selectedLayers = [];

  if (continentBoundsLayer) {
    map.removeLayer(continentBoundsLayer);
    continentBoundsLayer = null;
  }

  selectionMode = "country";
  requestMapRenderSafe("clear-selection");
}

function updateLayerSelection(nextLayers, nextMode, highlightStyle) {
  const previousLayers = selectedLayers.filter(Boolean);
  const nextValidLayers = (nextLayers || []).filter(Boolean);
  const previousSet = new Set(previousLayers);
  const nextSet = new Set(nextValidLayers);

  previousLayers.forEach(layer => {
    if (!nextSet.has(layer)) {
      layer.setStyle(getCountryThemeStyle(layer.code));
    }
  });

  nextValidLayers.forEach(layer => {
    if (!previousSet.has(layer)) {
      layer.setStyle(highlightStyle);
    }
  });

  selectedLayers = nextValidLayers;
  selectedLayer = nextMode === "country" ? (nextValidLayers[0] || null) : null;
  selectionMode = nextMode;
}

function getLinkedCodes(code) {
  return [code, ...(TERRITORY_LINKS[code] || [])];
}

function getCountryLayerByCodeOrName(rawCode, fallbackName = "") {
  const candidates = uniqueNormalizedList([
    rawCode,
    String(rawCode || "").trim().toUpperCase(),
    resolveCountryCode(rawCode, fallbackName),
    resolveCountryCode("", fallbackName)
  ]).filter(Boolean);

  for (const candidate of candidates) {
    const directLayer = countryLayers.get(candidate);
    if (directLayer) {
      return directLayer;
    }
  }

  const normalizedCandidates = new Set();
  candidates.forEach(candidate => {
    buildCountryLookupVariants(candidate).forEach(variant => normalizedCandidates.add(variant));
  });
  buildCountryLookupVariants(fallbackName).forEach(variant => normalizedCandidates.add(variant));

  if (!normalizedCandidates.size) {
    return null;
  }

  for (const [layerCode, layer] of countryLayers.entries()) {
    const countryName = countriesData[layer.code]?.name || countriesData[layerCode]?.name || "";
    const layerVariants = [
      layerCode,
      layer.code,
      layer.featureName,
      countryName
    ].flatMap(value => buildCountryLookupVariants(value));

    if (layerVariants.some(variant => normalizedCandidates.has(variant))) {
      return layer;
    }
  }

  return null;
}

function buildCountryLookupVariants(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return [];
  }

  const variants = new Set();
  const queue = [raw, repairMojibake(raw)];

  while (queue.length) {
    const current = queue.pop();
    const normalized = normalizeText(current);
    if (!normalized || variants.has(normalized)) {
      continue;
    }

    variants.add(normalized);

    const withoutParentheses = normalized.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
    const punctuationSimplified = normalized
      .replace(/[.'",]/g, " ")
      .replace(/&/g, " and ")
      .replace(/\s+/g, " ")
      .trim();
    const expandedAbbreviations = punctuationSimplified
      .replace(/\brep\b/g, "republic")
      .replace(/\bdem\b/g, "democratic")
      .replace(/\bis\b/g, "islands")
      .replace(/\bst\b/g, "saint")
      .replace(/\bn\b/g, "north")
      .replace(/\bs\b/g, "south")
      .replace(/\bw\b/g, "western")
      .replace(/\be\b/g, "eastern")
      .replace(/\s+/g, " ")
      .trim();

    [withoutParentheses, punctuationSimplified, expandedAbbreviations].forEach(variant => {
      if (variant && !variants.has(variant)) {
        queue.push(variant);
      }
    });
  }

  return Array.from(variants);
}

function buildNormalizedAliasIndex(aliasTable = {}) {
  const index = new Map();
  Object.entries(aliasTable).forEach(([alias, code]) => {
    buildCountryLookupVariants(alias).forEach(variant => {
      index.set(variant, code);
    });
  });
  return index;
}

function findCountryCodeByNameFallback(rawName) {
  const variants = buildCountryLookupVariants(rawName);
  if (!variants.length) {
    return null;
  }

  for (const variant of variants) {
    const overrideCode = mapNameAliasIndex.get(variant) || mapNameAliasOverrides[variant];
    if (overrideCode && countriesData[overrideCode]) {
      return overrideCode;
    }

    if (countryAliases.has(variant)) {
      const aliasCode = countryAliases.get(variant);
      if (aliasCode && countriesData[aliasCode]) {
        return aliasCode;
      }
    }

    if (countryCodeByEnglishName.has(variant)) {
      const englishNameCode = countryCodeByEnglishName.get(variant);
      if (englishNameCode && countriesData[englishNameCode]) {
        return englishNameCode;
      }
    }
  }

  for (const [code, country] of Object.entries(countriesData)) {
    const candidateVariants = new Set();
    [
      code,
      country?.name,
      country?.general?.officialName,
      ...(country?.general?.historicalNames || [])
    ].forEach(name => {
      buildCountryLookupVariants(name).forEach(variant => candidateVariants.add(variant));
    });

    if (variants.some(variant => candidateVariants.has(variant))) {
      return code;
    }
  }

  return null;
}

function resolveCountryCode(rawCode, rawName = "") {
  const normalizedRawCode = String(rawCode || "").trim().toUpperCase();
  if (normalizedRawCode && countriesData[normalizedRawCode]) {
    return normalizedRawCode;
  }

  const strippedCode = normalizedRawCode.replace(/[^A-Z0-9-]/g, "");
  if (strippedCode && countriesData[strippedCode]) {
    return strippedCode;
  }

  const fallbackCode = findCountryCodeByNameFallback(rawName);
  if (fallbackCode) {
    return fallbackCode;
  }

  return null;
}

function setCountrySelection(layers) {
  lastInteractionAt = Date.now();
  const layerList = Array.isArray(layers) ? layers : [layers];
  const alreadySelected =
    selectionMode === "country" &&
    selectedLayers.length === layerList.length &&
    selectedLayers.every((layer, index) => layer === layerList[index]);

  if (alreadySelected) {
    return;
  }

  if (viewer) {
    viewer.camera.cancelFlight();
  }
  if (continentBoundsLayer) {
    map.removeLayer(continentBoundsLayer);
    continentBoundsLayer = null;
  }
  updateLayerSelection(layerList, "country", COUNTRY_HIGHLIGHT_STYLE);
  requestMapRenderSafe("country-selection");
}

function setContinentSelection(layers) {
  lastInteractionAt = Date.now();
  const alreadySelected =
    selectionMode === "continent" &&
    selectedLayers.length === layers.length &&
    selectedLayers.every((layer, index) => layer === layers[index]);

  if (alreadySelected) {
    return;
  }

  if (viewer) {
    viewer.camera.cancelFlight();
  }
  updateLayerSelection(layers, "continent", CONTINENT_HIGHLIGHT_STYLE);

  continentBoundsLayer = createLayerGroup(layers);
  requestMapRenderSafe("group-selection");
}

function fitLayerBounds(layerOrGroup) {
  const bounds = layerOrGroup?.getBounds?.();

  if (bounds) {
    focusRectangle(bounds);
  }
}

function dismissSearchInput() {
  const input = document.getElementById("map-search-input");
  hideSuggestions();

  if (document.activeElement === input) {
    input.blur();
  }
}

async function renderCountry(country, fallbackName) {
  await Promise.all([
    ensureDeferredUiModule("countryPanel"),
    ensureDeferredUiModule("timelineConflicts")
  ]);
  const countryCode = getCountryCodeByObject(country);
  if (countryCode) {
    appStore?.setState({ selectedCode: countryCode }, "country-render");
  }
  if (countryCode && country?.metadata?.isIndex) {
    const defaultTimelineFilters =
      typeof timelineConflictUi.getDefaultTimelineFilters === "function"
        ? timelineConflictUi.getDefaultTimelineFilters()
        : {
            timelineFilter: "all",
            timelineCentury: "all",
            timelineIntensity: "all",
            timelineRelevance: "all",
            timelineMode: "full",
            conflictFilter: "all"
          };
    currentPanelState = {
      type: "country",
      code: countryCode,
      fallbackName,
      ...defaultTimelineFilters,
      countryViewMode: currentPanelState.countryViewMode || "full"
    };
    const panel = document.getElementById("country-panel");
    if (panel && typeof countryPanelUi.renderSkeleton === "function") {
      panel.innerHTML = countryPanelUi.renderSkeleton(country, currentLanguage);
      openCountryModal();
    }
    const detailedCountry = await loadCountryDetail(countryCode);
    if (
      detailedCountry
      && !detailedCountry.metadata?.isIndex
      && currentPanelState.type === "country"
      && currentPanelState.code === countryCode
    ) {
      await renderCountry(detailedCountry, fallbackName);
    }
    return;
  }
  const symbolAssets = getCountrySymbolAssets(country, countryCode);
  try {
  const defaultTimelineFilters =
    typeof timelineConflictUi.getDefaultTimelineFilters === "function"
      ? timelineConflictUi.getDefaultTimelineFilters()
      : {
          timelineFilter: "all",
          timelineCentury: "all",
          timelineIntensity: "all",
          timelineRelevance: "all",
          timelineMode: "full",
          conflictFilter: "all"
        };
  const timelineFilter =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.timelineFilter || defaultTimelineFilters.timelineFilter)
      : defaultTimelineFilters.timelineFilter;
  const timelineCentury =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.timelineCentury || defaultTimelineFilters.timelineCentury)
      : defaultTimelineFilters.timelineCentury;
  const timelineIntensity =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.timelineIntensity || defaultTimelineFilters.timelineIntensity)
      : defaultTimelineFilters.timelineIntensity;
  const timelineRelevance =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.timelineRelevance || defaultTimelineFilters.timelineRelevance)
      : defaultTimelineFilters.timelineRelevance;
  const timelineMode =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.timelineMode || defaultTimelineFilters.timelineMode || "full")
      : (defaultTimelineFilters.timelineMode || "full");
  const conflictFilter =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.conflictFilter || defaultTimelineFilters.conflictFilter)
      : defaultTimelineFilters.conflictFilter;
  const preserveConflictState = currentPanelState.type === "country" && currentPanelState.code === countryCode;
  const conflictRegion = preserveConflictState ? (currentPanelState.conflictRegion || "all") : "all";
  const conflictOutcome = preserveConflictState ? (currentPanelState.conflictOutcome || "all") : "all";
  const conflictSide = preserveConflictState ? (currentPanelState.conflictSide || "all") : "all";
  const conflictVisibleLimit = preserveConflictState ? (currentPanelState.conflictVisibleLimit || 0) : 0;
  const conflictChildLimits = preserveConflictState ? (currentPanelState.conflictChildLimits || {}) : {};
  const countryLoadedSections = preserveConflictState
    ? (currentPanelState.countryLoadedSections || ["country-section-general"])
    : ["country-section-general"];
  const countryActiveSection = preserveConflictState
    ? (currentPanelState.countryActiveSection || "country-section-general")
    : "country-section-general";
  const countryViewMode =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.countryViewMode || "full")
      : "full";
  currentPanelState = { type: "country", code: countryCode, fallbackName, timelineFilter, timelineCentury, timelineIntensity, timelineRelevance, timelineMode, conflictFilter, conflictRegion, conflictOutcome, conflictSide, conflictVisibleLimit, conflictChildLimits, countryViewMode, countryLoadedSections, countryActiveSection };
  const relatedTerritories = getLinkedCodes(countryCode)
    .filter(code => code !== countryCode)
    .map(code => countriesData[code]?.name)
    .filter(Boolean);
  const conflictsSinceFormation = getConflictsSinceFormation(country);
  const shouldRenderMilitaryDetail =
    countryLoadedSections.includes("country-section-military")
    && countryViewMode !== "compact";
  if (shouldRenderMilitaryDetail) {
    await ensureConflictAliasesLoaded();
  }
  const conflictGroups = shouldRenderMilitaryDetail ? buildConflictGroups(conflictsSinceFormation) : [];
  const conflictCountHint = getCountryConflictCount(country) || conflictsSinceFormation.length;
  const countrySectionDescriptors =
    typeof countryPanelUi.getSectionDescriptors === "function"
      ? countryPanelUi.getSectionDescriptors(currentLanguage)
      : [
          { id: "country-section-general", label: t("general") },
          { id: "country-section-history", label: t("history") },
          { id: "country-section-economy", label: t("economy") },
          { id: "country-section-military", label: t("military") },
          { id: "country-section-politics", label: t("politics") },
          { id: "country-section-relations", label: t("relations") },
          { id: "country-section-religion", label: t("religion") },
          { id: "country-section-sources", label: currentLanguage === "en" ? "Sources" : "Fuentes" }
        ];
  const viewModes = typeof countryPanelUi.getViewModes === "function"
    ? countryPanelUi.getViewModes(currentLanguage)
    : [
        { key: "full", label: currentLanguage === "en" ? "Full" : "Completa" },
        { key: "teaching", label: currentLanguage === "en" ? "Class" : "Docente" },
        { key: "compact", label: currentLanguage === "en" ? "Compact" : "Compacta" }
      ];
  const executiveSummary = typeof countryPanelUi.buildExecutiveSummary === "function"
    ? countryPanelUi.buildExecutiveSummary(country, { language: currentLanguage, formatNumber })
    : "";
  const notesKey = typeof countryPanelUi.getNotesStorageKey === "function"
    ? countryPanelUi.getNotesStorageKey(countryCode)
    : `geo-risk-country-notes:${countryCode || "unknown"}`;
  const savedNotes = countryCode ? (localStorage.getItem(notesKey) || "") : "";
  const sectionQualityItems = typeof countryPanelUi.buildSectionQuality === "function"
    ? countryPanelUi.buildSectionQuality(country, currentLanguage)
    : [];

  if (typeof countryPanelUi.renderProfile !== "function") {
    throw new Error("El modulo diferido de ficha no expone renderProfile.");
  }

  const panel = document.getElementById("country-panel");
  if (!panel) {
    throw new Error("No se encontro el panel de ficha pais.");
  }

  panel.innerHTML = countryPanelUi.renderProfile({
    country,
    fallbackName,
    countryCode,
    symbolAssets,
    language: currentLanguage,
    viewMode: countryViewMode,
    viewModes,
    executiveSummary,
    sectionDescriptors: countrySectionDescriptors,
    activeSection: countryActiveSection,
    loadedSections: countryLoadedSections,
    overviewStats: getCountryOverviewStats(country, countryCode),
    curationItems: getCountryCurationTodoItems(country, conflictGroups, conflictCountHint),
    curationActions: getCountryCurationActions(country, conflictGroups, conflictCountHint),
    conflictCount: conflictCountHint,
    conflicts: conflictsSinceFormation,
    conflictGroups,
    shouldRenderMilitaryDetail,
    relatedTerritories,
    savedNotes,
    sectionQualityItems,
    organizationCount: getCountryOrganizationCount(country),
    qualityConflictCount: conflictsSinceFormation.length,
    translate: t,
    noData: t("noData"),
    formatNumber,
    escapeHtml,
    renderers: {
      renderFlagVisual,
      renderCoatVisual,
      renderCapitalProfiles,
      renderLanguages,
      renderSubdivisionSummary,
      renderRelationChips,
      renderSymbolShowcase,
      renderCities,
      translateContinentName,
      translateHistoryText,
      renderTimeline,
      formatInflation,
      renderEconomyMiniMetrics,
      renderList,
      renderConflictOverview,
      renderRelatedConflictSummary,
      renderConflicts,
      renderOrganizations,
      renderRivals,
      renderRelationsSummary,
      renderRelationNetwork,
      uniqueNormalizedList,
      getOrganizationDisplayName,
      renderReligionMiniMetrics,
      renderReligion
    }
  });

  renderNewsHub(countryCode);

  const compareButton = document.getElementById("add-to-compare-button");
  if (compareButton && countryCode) {
    compareButton.addEventListener("click", () => addCountryToCompare(countryCode));
    syncCountryCompareButton(countryCode);
  }
  const notesInput = document.querySelector("[data-country-notes]");
  if (notesInput && countryCode) {
    const notesStatus = document.querySelector("[data-country-notes-status]");
    notesInput.addEventListener("input", event => {
      localStorage.setItem(notesKey, event.target.value || "");
      if (notesStatus) {
        notesStatus.textContent = currentLanguage === "en" ? "Notes saved." : "Notas guardadas.";
      }
    });
  }

  renderThemeSummary();
  openCountryModal();
  } catch (error) {
    console.error(`No se pudo renderizar la ficha de ${country?.name || fallbackName || "pais"}:`, error);
    const countryCode = getCountryCodeByObject(country);
    currentPanelState = { type: "country", code: countryCode, fallbackName };
    document.getElementById("country-panel").innerHTML = `
      <div class="country-title">
        ${renderFlagVisual(countryCode, country?.name || fallbackName || "Pais", "country-flag", symbolAssets.flagSrc)}
        <div class="country-heading">
          <h2>${escapeHtml(country?.name || fallbackName || "Pais")}</h2>
          <p class="country-official-name">${escapeHtml(country?.general?.officialName || country?.name || fallbackName || t("noData"))}</p>
        </div>
        ${renderCoatVisual(countryCode, `${country?.name || fallbackName || "Pais"} escudo`, symbolAssets.coatSrc)}
      </div>
      <div class="country-overview-grid relation-overview-grid">
        <div class="overview-card"><span class="overview-label">${t("population")}</span><strong class="overview-value">${formatNumber(country?.general?.population || 0)}</strong></div>
        <div class="overview-card"><span class="overview-label">${t("continent")}</span><strong class="overview-value">${escapeHtml(translateContinentName(country?.continent || "Unknown"))}</strong></div>
      </div>
      <p><b>${currentLanguage === "en" ? "Official name" : "Nombre oficial"}:</b> ${escapeHtml(country?.general?.officialName || country?.name || fallbackName || t("noData"))}</p>
      <p><b>${t("politicalSystem")}:</b> ${escapeHtml(country?.politics?.system || t("noData"))}</p>
      <p><b>${t("gdp")}:</b> ${country?.economy?.gdp ? `US$ ${formatNumber(Math.round(country.economy.gdp))}` : t("noData")}</p>
      <p><b>${t("inflation")}:</b> ${formatInflation(country?.economy?.inflation)}</p>
      <p class="data-source-note">${currentLanguage === "en" ? "The full tab could not be rendered, but the country was identified correctly." : "La ficha completa no pudo renderizarse, pero el pais fue identificado correctamente."}</p>
    `;
    renderNewsHub(countryCode);
    renderThemeSummary();
    openCountryModal();
  }
}

function renderContinent(continent, countries) {
  const timelineFilter =
    currentPanelState.type === "continent" && currentPanelState.continent === continent
      ? (currentPanelState.timelineFilter || "all")
      : "all";
  const timelineCentury =
    currentPanelState.type === "continent" && currentPanelState.continent === continent
      ? (currentPanelState.timelineCentury || "all")
      : "all";
  const timelineIntensity =
    currentPanelState.type === "continent" && currentPanelState.continent === continent
      ? (currentPanelState.timelineIntensity || "all")
      : "all";
  const timelineRelevance =
    currentPanelState.type === "continent" && currentPanelState.continent === continent
      ? (currentPanelState.timelineRelevance || "all")
      : "all";
  const timelineMode =
    currentPanelState.type === "continent" && currentPanelState.continent === continent
      ? (currentPanelState.timelineMode || "full")
      : "full";
  currentPanelState = { type: "continent", continent, countries, timelineFilter, timelineCentury, timelineIntensity, timelineRelevance, timelineMode };
  const totalPopulation = countries.reduce(
    (sum, country) => sum + (country.general?.population || 0),
    0
  );
  const aggregateTimeline = buildAggregateTimeline(countries, continent);

  document.getElementById("country-panel").innerHTML = `
    <h2>${continent}</h2>
    <p><b>${t("population")} total:</b> ${formatNumber(totalPopulation)}</p>
    <p><b>${currentLanguage === "en" ? "Countries shown" : "Cantidad de paises mostrados"}:</b> ${countries.length}</p>
    <p><b>${currentLanguage === "en" ? "Countries in this continent" : "Paises del continente"}:</b></p>
    ${renderCountryActionList(countries, country => formatNumber(country.general?.population || 0))}
    <p><b>${currentLanguage === "en" ? "Regional timeline" : "Timeline regional"}:</b></p>
    ${renderTimelineCollection(aggregateTimeline)}
  `;

  renderNewsHub();

  renderThemeSummary();
  openCountryModal();
}

function renderReligionSelection(religionName, countries, totalNominal) {
  currentPanelState = { type: "religion", religionName, countries, totalNominal };
  const denominationMode = isKnownReligionDenomination(religionName);
  document.getElementById("country-panel").innerHTML = `
    <h2>${religionName}</h2>
    <div class="country-overview-grid relation-overview-grid">
      <div class="overview-card">
        <span class="overview-label">${denominationMode
          ? (currentLanguage === "en" ? "Countries recorded" : "Paises registrados")
          : (currentLanguage === "en" ? "Majority countries" : "Paises con mayoria")}</span>
        <strong class="overview-value">${formatNumber(countries.length)}</strong>
      </div>
      <div class="overview-card">
        <span class="overview-label">${currentLanguage === "en" ? "Estimated population" : "Poblacion estimada"}</span>
        <strong class="overview-value">${formatNumber(Math.round(totalNominal || 0))}</strong>
      </div>
    </div>
    <p><b>${denominationMode
      ? (currentLanguage === "en" ? "Estimated population in countries with this denomination" : "Poblacion estimada en paises con esta denominacion")
      : (currentLanguage === "en" ? "Estimated population where it is the majority" : "Poblacion estimada en paises donde es mayoritaria")}:</b> ${formatNumber(Math.round(totalNominal || 0))}</p>
    <p><b>${currentLanguage === "en" ? "Share of world population" : "Porcentaje de la poblacion mundial"}:</b> ${formatPercentage(worldPopulationTotal ? (totalNominal / worldPopulationTotal) * 100 : 0)}</p>
    <p><b>${denominationMode
      ? (currentLanguage === "en" ? "Countries and territories with this denomination recorded" : "Paises y territorios con esta denominacion registrada")
      : (currentLanguage === "en" ? "Countries and territories where it is the majority religion" : "Paises y territorios donde es la religion mayoritaria")}:</b></p>
    ${renderCountryActionList(countries, country => {
      const percentage = country.religion?.composition
        ? Math.round(getReligionSelectionNominalPopulation(country, religionName) / Math.max(country.general?.population || 1, 1) * 1000) / 10
        : 0;
      return percentage ? `${percentage}%` : "";
    })}
  `;

  renderNewsHub();

  renderThemeSummary();
  openCountryModal();
}

function renderEmpty(name) {
  currentPanelState = { type: "empty", name };
  document.getElementById("country-panel").innerHTML = `
    <h2>${name}</h2>
    <div class="empty-state-card">
      <strong>${currentLanguage === "en" ? "Profile not curated yet" : "Ficha todavia no curada"}</strong>
      <p>${currentLanguage === "en"
        ? "GeoRisk identified the map entity, but there is no structured local profile for it yet."
        : "GeoRisk identifico la entidad del mapa, pero todavia no hay una ficha local estructurada para este caso."}</p>
      <span>${currentLanguage === "en" ? "Suggested next step: add aliases and baseline data." : "Siguiente paso sugerido: agregar aliases y datos base."}</span>
    </div>
  `;

  renderNewsHub();

  renderThemeSummary();
  closeCountryModal();
}

function getRenderProfileLabel() {
  const preset = getPerformancePreset();
  const runtimeLabel = runtimeGetRenderProfileText({
    language: currentLanguage,
    isMobile: isMobileLayout(),
    currentMapMode,
    resolutionScale: preset.resolutionScale
  });
  return `${runtimeLabel} · ${getQualityPresetLabel()}`;
}

function recordMapDegradation(reason, details = {}) {
  reducedPerformanceMode = true;
  reducedPerformanceReason = reason;
  mapDegradationLog.add(reason, {
    mode: currentMapMode,
    theme: currentTheme,
    qualityPreset,
    ...details
  });
  updateAppStatusPanel(details);
}

function updateAppStatusPanel(extra = {}) {
  const renderChip = document.getElementById("render-profile-chip");
  const datasetChip = document.getElementById("dataset-health-chip");

  if (renderChip) {
    const fpsSuffix = typeof extra.fps === "number"
      ? ` · ${Math.round(extra.fps)} FPS`
      : "";
    const modeLabel = {
      default: currentLanguage === "en" ? "explore" : "exploracion",
      analysis: currentLanguage === "en" ? "analysis" : "analisis",
      encyclopedia: currentLanguage === "en" ? "encyclopedia" : "enciclopedia",
      presentation: currentLanguage === "en" ? "presentation" : "presentacion"
    }[appMode] || appMode;
    const reducedLabel = typeof mapCore.getReducedPerformanceLabel === "function"
      ? mapCore.getReducedPerformanceLabel({
          language: currentLanguage,
          active: reducedPerformanceMode,
          reason: reducedPerformanceReason
        })
      : (reducedPerformanceMode ? (currentLanguage === "en" ? "Reduced performance mode" : "Modo rendimiento reducido") : "");
    const reducedSuffix = reducedPerformanceMode ? ` · ${escapeHtml(reducedLabel)}` : "";
    renderChip.innerHTML = `<strong>${currentLanguage === "en" ? "Render" : "Render"}:</strong> ${escapeHtml(getRenderProfileLabel())} · ${escapeHtml(modeLabel)}${fpsSuffix}${reducedSuffix}`;
  }

  if (datasetChip) {
    const countries = getCountryValues();
    const total = countries.length;
    const avgQuality = total
      ? Math.round(countries.reduce((sum, country) => sum + (country.metadata?.quality?.score || 0), 0) / total)
      : 0;
    const loadStateParts = [
      deferredDataStatus.countryIndex ? (currentLanguage === "en" ? "index" : "indice") : null,
      deferredDataStatus.runtimeCuration ? (currentLanguage === "en" ? "curation" : "curaduria") : null,
      deferredDataStatus.wikipediaConflicts ? (currentLanguage === "en" ? "conflicts" : "conflictos") : null,
      currentLanguage === "en" ? "details on demand" : "detalle bajo demanda"
    ].filter(Boolean);
    const trustLabel = currentLanguage === "en" ? "sources by section" : "fuentes por seccion";
    const estimatedLabel = currentLanguage === "en" ? "estimates marked" : "estimados marcados";
    datasetChip.title = currentLanguage === "en"
      ? "Open dataset health: quality score, sources, estimates and pending curation."
      : "Abrir salud del dataset: calidad, fuentes, estimaciones y curaduria pendiente.";
    datasetChip.innerHTML = `<strong>${currentLanguage === "en" ? "Data" : "Datos"}:</strong> ${currentLanguage === "en" ? "validated" : "validado"} · ${avgQuality}/100 · ${total} ${currentLanguage === "en" ? "entries" : "entradas"} · ${trustLabel} · ${estimatedLabel} · ${escapeHtml(loadStateParts.join(" / "))}`;
  }
}

function showFatalError(message) {
  const banner = document.getElementById("fatal-error-banner");
  if (!banner) {
    return;
  }

  banner.hidden = false;
  banner.textContent = message;
}

function registerCountryAlias(alias, value, overwrite = false) {
  buildCountryLookupVariants(alias).forEach(variant => {
    if (overwrite || !countryAliases.has(variant) || countryAliases.get(variant) === value) {
      countryAliases.set(variant, value);
    }
  });
}

function registerFeatureNameAliases(featureNameByCode = {}) {
  Object.entries(featureNameByCode).forEach(([code, featureName]) => {
    if (!featureName || !countriesData[code]) {
      return;
    }

    registerCountryAlias(featureName, code, true);
  });
}

function registerReligionAlias(alias, value) {
  const normalizedAlias = normalizeText(alias);

  if (!normalizedAlias) {
    return;
  }

  religionAliases.set(normalizedAlias, value);
}

function registerLookupAlias(map, alias, value) {
  const normalizedAlias = normalizeText(alias);

  if (!normalizedAlias) {
    return;
  }

  map.set(normalizedAlias, value);
}

function registerSuggestion(label, type, value, subtitle, aliases = []) {
  const normalizedLabel = normalizeText(label);
  if (!normalizedLabel) {
    return;
  }

  if (
    suggestionItems.some(
      item => item.type === type && normalizeText(item.label) === normalizedLabel && item.value === value
    )
  ) {
    return;
  }

  suggestionItems.push({
    label,
    normalizedLabel,
    normalizedAliases: aliases.map(normalizeText).filter(Boolean),
    type,
    value,
    subtitle
  });
}

function getCountryLanguages(country) {
  return Array.isArray(country?.general?.languages) ? country.general.languages.filter(Boolean) : [];
}

function getCountryBlocs(country) {
  const relations = country?.politics?.relations || {};
  return uniqueNormalizedList([
    ...(relations.blocs || []),
    ...(relations.militaryBlocs || []),
    ...(relations.economicBlocs || []),
    ...(relations.diplomaticBlocs || [])
  ].map(normalizeCategoryLabel));
}

function getCountryConflictsForSearch(country) {
  return Array.isArray(country?.military?.conflicts)
    ? country.military.conflicts
    : (Array.isArray(country?.conflicts) ? country.conflicts : []);
}

function getConflictLabel(conflict) {
  return normalizeCategoryLabel(conflict?.name || conflict);
}

function getConflictAliasList(conflict) {
  const label = getConflictLabel(conflict);
  const aliases = [label];
  const normalized = normalizeText(label);
  if (normalized.includes("guerra")) {
    aliases.push(label.replace(/guerra/ig, "conflicto"));
  }
  if (normalized.includes("battle")) {
    aliases.push(label.replace(/battle/ig, "batalla"));
  }
  return uniqueNormalizedList(aliases);
}

function getHistoryPeriodLabelFromYear(year) {
  const numericYear = Number(year) || 0;
  if (!numericYear) {
    return "";
  }
  if (numericYear >= 2000) return "Siglo XXI";
  if (numericYear >= 1900) return "Siglo XX";
  if (numericYear >= 1800) return "Siglo XIX";
  if (numericYear >= 1500) return "Edad Moderna";
  if (numericYear >= 500) return "Edad Media";
  return "Antiguedad";
}

function getCountriesByLanguage(languageLabel) {
  return getCountryValues()
    .filter(country => getCountryLanguages(country).some(language => normalizeText(language) === normalizeText(languageLabel)))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByBloc(blocLabel) {
  return getCountryValues()
    .filter(country => getCountryBlocs(country).some(bloc => normalizeText(bloc) === normalizeText(blocLabel)))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByMetropole(metropoleLabel) {
  return getCountryValues()
    .filter(country => normalizeText(country?.politics?.relations?.exMetropole) === normalizeText(metropoleLabel))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByConflict(conflictLabel) {
  return getCountryValues()
    .filter(country =>
      getCountryConflictsForSearch(country).some(conflict =>
        getConflictAliasList(conflict).some(alias => normalizeText(alias) === normalizeText(conflictLabel))
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByPeriod(periodLabel) {
  return getCountryValues()
    .filter(country => {
      const year = country?.history?.year;
      if (getHistoryPeriodLabelFromYear(year) === periodLabel) {
        return true;
      }

      return (country?.history?.events || []).some(event => getHistoryPeriodLabelFromYear(event?.year) === periodLabel);
    })
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function pushSearchHistory(query) {
  const normalized = normalizeText(query);
  if (!normalized) {
    return;
  }
  searchHistory = [query.trim(), ...searchHistory.filter(item => normalizeText(item) !== normalized)].slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify(searchHistory));
  renderSearchMemory();
}

function saveCurrentSearch(query) {
  const normalized = normalizeText(query);
  if (!normalized) {
    return;
  }
  savedSearches = [query.trim(), ...savedSearches.filter(item => normalizeText(item) !== normalized)].slice(0, 12);
  localStorage.setItem(STORAGE_KEYS.savedSearches, JSON.stringify(savedSearches));
  renderSearchMemory();
}

function renderSearchQueryChips(filters = null) {
  const container = document.getElementById("search-query-chips");
  if (!container) {
    return;
  }

  const chips = [];
  if (filters?.continent) chips.push(translateContinentName(filters.continent));
  if (filters?.religion) chips.push(filters.religion);
  if (filters?.system) chips.push(filters.system.replace(/^__|__$/g, ""));
  if (filters?.organization) chips.push(filters.organization);
  if (filters?.historyType) chips.push(filters.historyType);
  if (filters?.origin) chips.push(filters.origin.replace(/^__|__$/g, ""));
  if (filters?.rival) chips.push(filters.rival);
  if (filters?.language) chips.push(`${currentLanguage === "en" ? "Language" : "Idioma"}: ${filters.language}`);
  if (filters?.bloc) chips.push(`${currentLanguage === "en" ? "Bloc" : "Bloque"}: ${filters.bloc}`);
  if (filters?.metropole) chips.push(`${currentLanguage === "en" ? "Metropole" : "Metropoli"}: ${filters.metropole}`);
  if (filters?.period) chips.push(filters.period);
  if (filters?.conflict) chips.push(filters.conflict);
  if (filters?.minPopulation) chips.push(`${currentLanguage === "en" ? "Min" : "Min"} ${compactNumber(filters.minPopulation)}`);

  if (!chips.length) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  container.hidden = false;
  container.innerHTML = chips.map(chip => `<span class="search-chip">${escapeHtml(chip)}</span>`).join("");
}

function renderSearchMemory({ reveal = true } = {}) {
  const wrapper = document.getElementById("search-memory");
  const historyList = document.getElementById("search-history-list");
  const savedList = document.getElementById("saved-search-list");
  if (!wrapper || !historyList || !savedList) {
    return;
  }

  const historyItems = searchHistory.slice(0, 6);
  const savedItems = savedSearches.slice(0, 6);
  wrapper.hidden = !reveal || (!historyItems.length && !savedItems.length);

  historyList.innerHTML = historyItems
    .map(item => `<button type="button" class="search-memory-chip" data-search-memory="${escapeHtml(item)}">${escapeHtml(item)}</button>`)
    .join("");
  savedList.innerHTML = savedItems
    .map(item => `<button type="button" class="search-memory-chip" data-search-memory="${escapeHtml(item)}">${escapeHtml(item)}</button>`)
    .join("");
}

function getReligionFamilyByName(religionName) {
  const normalizedName = normalizeText(religionName);
  return (
    RELIGION_FAMILY_RULES.find(rule =>
      rule.matches.some(token => normalizedName.includes(normalizeText(token)))
    ) || null
  );
}

function getReligionKeyAndLabel(religionName) {
  const family = getReligionFamilyByName(religionName);
  if (family) {
    return {
      key: family.key,
      label: family.label
    };
  }

  return {
    key: normalizeText(religionName),
    label: religionName
  };
}

function formatReligionDenominationLabel(denominationName, familyLabel) {
  const normalizedName = normalizeText(denominationName);
  const normalizedFamily = normalizeText(familyLabel);

  if (!normalizedName) {
    return familyLabel;
  }

  const genericPatterns = [
    /^cristian(os|as)?$/,
    /^musulman(es|as)?$/,
    /^islam$/,
    /^hindu(es)?$/,
    /^budista(s)?$/,
    /^judi(o|a|os|as)$/,
    /^sij(s)?$/,
    /^sintoista(s)?$/,
    /^zoroastro(s)?$/,
    /^ateos agnosticos sin afiliacion$/,
    /^otras religiones$/
  ];

  if (normalizedName === normalizedFamily || genericPatterns.some(pattern => pattern.test(normalizedName))) {
    return familyLabel;
  }

  const escapedFamilyLabel = familyLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  let branch = String(denominationName || "")
    .replace(new RegExp(`^${escapedFamilyLabel}\\s*`, "i"), "")
    .replace(new RegExp(`^${escapedFamilyLabel}\\s*\\/\\s*`, "i"), "")
    .replace(/^Cristianos?\s+/i, "")
    .replace(/^Cristianismo\s+/i, "")
    .replace(/^Musulmanes?\s+/i, "")
    .replace(/^Islam(ismo)?\s+/i, "")
    .replace(/^Hindues?\s+/i, "")
    .replace(/^Budistas?\s+/i, "")
    .replace(/^Judios?\s+/i, "")
    .replace(/^Sijs?\s+/i, "")
    .replace(/^Sintoistas?\s+/i, "")
    .replace(/^Zoroastros?\s+/i, "")
    .trim();

  if (!branch) {
    return familyLabel;
  }

  return toDisplayTitleCase(branch);
}

function getReligionFamilyTotals(country) {
  const composition = Array.isArray(country?.religion?.composition) ? country.religion.composition : [];
  const summary = country?.religion?.summary || "";

  if (!composition.length && summary) {
    const religionInfo = getReligionKeyAndLabel(summary);
    return [
      {
        key: religionInfo.key,
        label: religionInfo.label,
        percentage: 100
      }
    ];
  }

  const totals = new Map();

  composition.forEach(entry => {
    if (!entry?.name) {
      return;
    }

    const religionInfo = getReligionKeyAndLabel(entry.name);
    const current = totals.get(religionInfo.key) || {
      key: religionInfo.key,
      label: religionInfo.label,
      percentage: 0
    };

    current.percentage += Number(entry.percentage) || 0;
    totals.set(religionInfo.key, current);
  });

  return [...totals.values()].sort((a, b) => b.percentage - a.percentage);
}

function getMajorityReligionGroups(country) {
  const totals = getReligionFamilyTotals(country);
  if (!totals.length) {
    return [];
  }

  const maxPercentage = totals[0].percentage || 0;
  if (!maxPercentage) {
    return [];
  }

  return totals.filter(entry => entry.percentage === maxPercentage);
}

function isReligionMajorityInCountry(country, religionName) {
  const requestedReligion = getReligionKeyAndLabel(religionName);
  return getMajorityReligionGroups(country).some(entry => entry.key === requestedReligion.key);
}

function getReligionNominalPopulation(country, religionName) {
  const population = country.general?.population || 0;
  const requestedReligion = getReligionKeyAndLabel(religionName);
  const match = getReligionFamilyTotals(country).find(entry => entry.key === requestedReligion.key);
  return population * (((match?.percentage) || 0) / 100);
}

function getReligionDenominationPercentage(country, denominationName) {
  const requested = normalizeText(denominationName);
  if (!requested) {
    return 0;
  }

  return getReligionCompositionForDisplay(country?.religion).reduce((sum, entry) => {
    if (!entry?.name) {
      return sum;
    }
    const family = getReligionKeyAndLabel(entry.name);
    const denominationLabel = formatReligionDenominationLabel(entry.name, family.label);
    const candidates = [entry.name, denominationLabel].map(normalizeText);
    return candidates.includes(requested)
      ? sum + (Number(entry.percentage) || 0)
      : sum;
  }, 0);
}

function getReligionDenominationNominalPopulation(country, denominationName) {
  const population = country.general?.population || 0;
  return population * (getReligionDenominationPercentage(country, denominationName) / 100);
}

function getReligionDenominationMatches(denominationName) {
  return getCountryValues()
    .filter(country => getReligionDenominationPercentage(country, denominationName) > 0)
    .sort((a, b) =>
      getReligionDenominationNominalPopulation(b, denominationName) -
      getReligionDenominationNominalPopulation(a, denominationName)
    );
}

function isKnownReligionDenomination(religionName) {
  return religionDenominationAliases.has(normalizeText(religionName));
}

function getReligionSelectionNominalPopulation(country, religionName) {
  return isKnownReligionDenomination(religionName)
    ? getReligionDenominationNominalPopulation(country, religionName)
    : getReligionNominalPopulation(country, religionName);
}

function getReligionThemeKey(country) {
  const [majority] = getMajorityReligionGroups(country);
  return majority?.key || "otras";
}

function getPoliticalThemeInfo(country) {
  const system = normalizeText(normalizePoliticalSystemCategory(country.politics?.system));

  if (!system) {
    return { key: "otros", label: "Otros" };
  }

  if (system.includes("teocracia")) {
    return { key: "teocracia", label: "Teocracias" };
  }

  if (system.includes("semipresid")) {
    return { key: "semipresidencialismo", label: "Semipresidencialismos" };
  }

  if (system.includes("monarquia absoluta")) {
    return { key: "monarquia_absoluta", label: "Monarquias absolutas" };
  }

  if (system.includes("monarquia constitucional")) {
    return { key: "monarquia_constitucional", label: "Monarquias constitucionales" };
  }

  if (system.includes("parlament")) {
    return { key: "parlamentarismo", label: "Parlamentarismos" };
  }

  if (system.includes("presidenc")) {
    return { key: "presidencialismo", label: "Presidencialismos" };
  }

  return { key: "otros", label: "Otros" };
}

function getPopulationThemeInfo(country) {
  const population = country.general?.population || 0;
  return THEME_STYLES.population.find(bucket => population >= bucket.min) || THEME_STYLES.population.at(-1);
}

function getBucketThemeInfo(value, buckets) {
  return buckets.find(bucket => value >= bucket.min) || buckets.at(-1);
}

function getCountryConflictCount(country) {
  const declaredCount = Number(country?.military?.conflictCount || country?.metadata?.publicProfile?.conflictCount || 0);
  if (declaredCount > 0) {
    return declaredCount;
  }
  if (Array.isArray(country?.military?.conflicts)) {
    return country.military.conflicts.length;
  }
  return Array.isArray(country?.conflicts) ? country.conflicts.length : 0;
}

function getCountryWarParticipationCount(country) {
  const code = country?.code || getCountryCodeByObject(country) || country?.name || "";
  const conflictCount = getCountryConflictCount(country);
  const cacheKey = `${code}:${countriesDataRevision}:${conflictCount}`;
  if (!warParticipationCountCache.has(cacheKey)) {
    const estimatedCount = hasCompleteCountryConflicts(country) && conflictRulesReady
      ? buildConflictGroups(getConflictsSinceFormation(country)).length
      : conflictCount;
    warParticipationCountCache.set(cacheKey, estimatedCount);
  }
  return warParticipationCountCache.get(cacheKey);
}

function getCountryOrganizationCount(country) {
  return Array.isArray(country?.politics?.organizations) ? country.politics.organizations.length : 0;
}

function getCountryRivalCount(country) {
  const currentRivals = country?.politics?.relations?.currentRivals;
  if (Array.isArray(currentRivals)) {
    return uniqueNormalizedList(currentRivals).length;
  }
  return (country?.politics?.rivals || []).filter(rival =>
    typeof rival === "string" || rival?.type === "actual"
  ).length;
}

function getCountryReligionDiversity(country) {
  return getReligionCompositionForDisplay(country?.religion).length;
}

function getCountryMilitaryActive(country) {
  return Number(country?.military?.active) || 0;
}

function getCountryFormationYear(country) {
  return Number(country?.history?.year) || 0;
}

function getCountryExportBreadth(country) {
  return Array.isArray(country?.economy?.exports) ? country.economy.exports.filter(Boolean).length : 0;
}

function getCountryIndustryBreadth(country) {
  return Array.isArray(country?.economy?.industries) ? country.economy.industries.filter(Boolean).length : 0;
}

function getCountryQualityScore(country) {
  return Number(country?.metadata?.quality?.score) || 0;
}

function getCountryLanguageDiversity(country) {
  return Array.isArray(country?.general?.languages) ? country.general.languages.filter(Boolean).length : 0;
}

function getCountryDiplomaticReach(country) {
  const relations = country?.politics?.relations || {};
  const organizations = getCountryOrganizationCount(country);
  const blocs = getCountryBlocs(country).length;
  const allies = (relations.militaryAllies || []).length + (relations.economicPartners || []).length + (relations.diplomaticPartners || []).length;
  const rivals = uniqueNormalizedList([...(relations.currentRivals || []), ...(relations.historicalRivals || [])]).length;
  const disputes = uniqueNormalizedList([...(relations.disputes || []), ...(relations.disputedTerritories || [])]).length;
  return organizations + blocs + allies + Math.min(rivals, 6) + disputes;
}

function getCountryCapitalShare(country) {
  const capitalPopulation = Number(country?.general?.capital?.population) || 0;
  const population = Number(country?.general?.population) || 0;
  if (!capitalPopulation || !population) {
    return 0;
  }
  return (capitalPopulation / population) * 100;
}

function clampThemeValue(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function getCountryApproxAreaKm2ByCode(code) {
  if (typeof countryAreaCache[code] === "number") {
    return countryAreaCache[code];
  }

  const layer = countryLayers.get(code);
  const rect = layer?.getBounds?.();
  if (!rect) {
    countryAreaCache[code] = 0;
    return 0;
  }

  const earthRadiusKm = 6371;
  const width = Math.abs(Cesium.Math.negativePiToPi(rect.east - rect.west));
  const latFactor = Math.abs(Math.sin(rect.north) - Math.sin(rect.south));
  const area = Math.abs(earthRadiusKm * earthRadiusKm * width * latFactor);
  countryAreaCache[code] = area;
  return area;
}

function getCountryPopulationDensity(country, code) {
  const population = Number(country?.general?.population) || 0;
  const area = getCountryApproxAreaKm2ByCode(code);
  if (!population || !area) {
    return 0;
  }
  return population / area;
}

function getCountryUrbanizationShare(country) {
  const population = Number(country?.general?.population) || 0;
  if (!population) {
    return 0;
  }

  const cityPopulation = (country?.general?.cities || [])
    .map(city => Number(city?.population) || 0)
    .filter(value => value > 0)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, value) => sum + value, 0);

  return clampThemeValue((cityPopulation / population) * 100, 0, 100);
}

function getCountryPopulationGrowth(country, code) {
  if (typeof populationGrowthByCode[code] === "number") {
    return populationGrowthByCode[code];
  }

  const urbanization = getCountryUrbanizationShare(country);
  const inflation = Number(country?.economy?.inflation) || 0;
  const conflicts = getCountryConflictCount(country);
  const estimate = 0.4 + Math.min(2.6, urbanization / 28) - Math.min(1.8, Math.abs(inflation) / 35) - Math.min(1.4, conflicts / 18);
  return clampThemeValue(estimate, -2.5, 4.5);
}

function getCountryLifeExpectancyEstimate(country, code) {
  const gdpPerCapita = Number(country?.economy?.gdpPerCapita) || 0;
  const urbanization = getCountryUrbanizationShare(country);
  const inflation = Number(country?.economy?.inflation) || 0;
  const conflicts = getCountryConflictCount(country);
  const continentAdjustments = {
    Europe: 3.2,
    Oceania: 2.8,
    America: 1.4,
    Asia: 0.7,
    Africa: -3.6,
    Antarctica: -2
  };
  const estimate = 47
    + Math.min(22, Math.log10(gdpPerCapita + 1) * 6.1)
    + Math.min(11, urbanization * 0.14)
    + (continentAdjustments[country?.continent] || 0)
    - Math.min(7.5, conflicts * 0.18)
    - Math.min(4.5, Math.abs(inflation) / 12);
  return clampThemeValue(estimate, 45, 85);
}

function getCountryUnemploymentEstimate(country, code) {
  const gdpPerCapita = Number(country?.economy?.gdpPerCapita) || 0;
  const inflation = Number(country?.economy?.inflation) || 0;
  const conflicts = getCountryConflictCount(country);
  const industryBreadth = getCountryIndustryBreadth(country);
  const populationGrowth = getCountryPopulationGrowth(country, code);
  const estimate = 14
    - Math.min(7, Math.log10(gdpPerCapita + 1))
    + Math.min(8, Math.abs(inflation) / 10)
    + Math.min(6, conflicts * 0.16)
    - Math.min(4.5, industryBreadth * 0.32)
    + Math.max(0, populationGrowth - 1.4) * 1.3;
  return clampThemeValue(estimate, 1.8, 28);
}

function getCountryDebtEstimate(country) {
  const gdpPerCapita = Number(country?.economy?.gdpPerCapita) || 0;
  const conflicts = getCountryConflictCount(country);
  const organizations = getCountryOrganizationCount(country);
  const rivals = getCountryRivalCount(country);
  const estimate = 24
    + Math.min(52, Math.log10(gdpPerCapita + 1) * 9.5)
    + Math.min(24, organizations * 0.75)
    + Math.min(18, conflicts * 0.45)
    + Math.min(10, rivals * 0.85);
  return clampThemeValue(estimate, 8, 165);
}

function getCountryMilitarySpendingEstimate(country) {
  const population = Number(country?.general?.population) || 0;
  const active = getCountryMilitaryActive(country);
  const conflicts = getCountryConflictCount(country);
  const rivals = getCountryRivalCount(country);
  const blocCount = (country?.politics?.relations?.militaryBlocs || []).length;
  const perThousand = population ? (active / population) * 1000 : 0;
  const estimate = 0.6 + (perThousand * 0.18) + (conflicts * 0.06) + (rivals * 0.1) + (blocCount * 0.35);
  return clampThemeValue(estimate, 0.3, 10.5);
}

function getCountryExportVolumeEstimate(country) {
  const gdp = Number(country?.economy?.gdp) || 0;
  const breadth = getCountryExportBreadth(country);
  const organizations = getCountryOrganizationCount(country);
  const resourceKey = getCountryNaturalResourceThemeKey(country);
  const baseRatio = 0.08 + Math.min(0.42, breadth * 0.035) + Math.min(0.08, organizations * 0.004);
  const resourceBonus = ["energeticos", "mineros", "agropecuarios"].includes(resourceKey) ? 0.1 : resourceKey === "diversificados" ? 0.14 : 0.04;
  return gdp * Math.min(0.85, baseRatio + resourceBonus);
}

function getCountryGdpPppEstimate(country) {
  const gdp = Number(country?.economy?.gdp) || 0;
  const gdpPerCapita = Number(country?.economy?.gdpPerCapita) || 0;
  const continentMultipliers = {
    Africa: 1.18,
    Asia: 1.12,
    America: 1.04,
    Europe: 0.98,
    Oceania: 1.01,
    Antarctica: 1
  };
  let multiplier = 1.08;
  if (gdpPerCapita < 3000) multiplier = 2.55;
  else if (gdpPerCapita < 8000) multiplier = 2.1;
  else if (gdpPerCapita < 15000) multiplier = 1.72;
  else if (gdpPerCapita < 30000) multiplier = 1.42;
  else if (gdpPerCapita < 50000) multiplier = 1.22;
  multiplier *= continentMultipliers[country?.continent] || 1;
  return gdp * multiplier;
}

function getCountryInflationHistoryScore(country) {
  const inflation = Number(country?.economy?.inflation) || 0;
  const historyType = normalizeText(country?.history?.type || "");
  const volatilityBonus = historyType.includes("guerra") || historyType.includes("revol") ? 4.5 : historyType.includes("civil") ? 6 : 0;
  return clampThemeValue(Math.abs(inflation) + volatilityBonus, -5, 130);
}

function getCountryNaturalResourceThemeKey(country) {
  const exportText = (country?.economy?.exports || []).join(" ");
  const industryText = (country?.economy?.industries || []).join(" ");
  const text = normalizeText(`${exportText} ${industryText}`);
  if (!text) {
    return "escasos";
  }

  const matches = {
    energeticos: /(petrol|gas|oil|hidrocarb|energy|energia|crudo)/.test(text),
    mineros: /(mineral|cobre|copper|oro|gold|lith|litio|hierro|iron|uran|diam|fosf)/.test(text),
    agropecuarios: /(soja|soy|coffee|cafe|cacao|cocoa|wheat|trigo|rice|arroz|maiz|corn|beef|ganad|fish|pesc)/.test(text),
    maritimos: /(puerto|port|shipping|pesca|fish|maritim|naval|logistic)/.test(text),
    industriales: /(tech|tecnolog|automotr|vehicle|machinery|maquinaria|electronics|electr|finance|servic|touris|turis)/.test(text)
  };
  const activeGroups = Object.entries(matches).filter(([, matched]) => matched).map(([key]) => key);
  if (activeGroups.length >= 3) {
    return "diversificados";
  }
  return activeGroups[0] || "escasos";
}

function getCountryGeopoliticalIndex(country) {
  const gdp = Number(country?.economy?.gdp) || 0;
  const population = Number(country?.general?.population) || 0;
  const active = getCountryMilitaryActive(country);
  const organizations = getCountryOrganizationCount(country);
  const rivals = getCountryRivalCount(country);
  const conflicts = getCountryWarParticipationCount(country);
  const blocs = getCountryBlocs(country).length;

  const score = Math.min(30, Math.log10(gdp + 1) * 2.65)
    + Math.min(20, Math.log10(population + 1) * 2.05)
    + Math.min(16, Math.log10(active + 1) * 2.6)
    + Math.min(12, organizations * 0.35)
    + Math.min(8, conflicts * 0.65)
    + Math.min(6, rivals * 0.55)
    + Math.min(8, blocs * 1.25);

  return clampThemeValue(score, 0, 100);
}

function getCountryRiskRadarComponents(country) {
  const conflictExposure = Math.min(100, getCountryWarParticipationCount(country) * 6 + getCountryConflictCount(country) * 8);
  const militaryPressure = Math.min(100, Math.log10(getCountryMilitaryActive(country) + 1) * 13);
  const rivalryPressure = Math.min(100, getCountryRivalCount(country) * 18 + (country?.politics?.relations?.disputedTerritories || []).length * 18);
  const economicStress = Math.min(100,
    Math.max(0, Number(country?.economy?.inflation) || 0) * 2.2
    + (country?.economy?.gdpPerCapita ? Math.max(0, 28000 - Number(country.economy.gdpPerCapita)) / 700 : 18)
  );
  const governanceStress = Math.min(100,
    /transicion|interino|junta|militar|autoritar|teocr/i.test(String(country?.politics?.system || "")) ? 55 : 24
  );
  const diplomaticBuffer = Math.min(35, getCountryOrganizationCount(country) * 0.7 + getCountryDiplomaticReach(country) * 0.35);
  const risk = clampThemeValue(
    conflictExposure * 0.28
      + militaryPressure * 0.18
      + rivalryPressure * 0.2
      + economicStress * 0.18
      + governanceStress * 0.12
      - diplomaticBuffer * 0.35,
    0,
    100
  );

  return {
    risk,
    conflictExposure,
    militaryPressure,
    rivalryPressure,
    economicStress,
    governanceStress,
    diplomaticBuffer
  };
}

function getCountryRiskRadar(country) {
  return getCountryRiskRadarComponents(country).risk;
}

function getCountryRiskDimension(country, dimension) {
  const components = getCountryRiskRadarComponents(country);
  const map = {
    riskMilitary: components.militaryPressure,
    riskEconomic: components.economicStress,
    riskDiplomatic: Math.max(0, 100 - components.diplomaticBuffer * 2.35),
    riskInternal: components.governanceStress,
    riskTerritorial: components.rivalryPressure
  };
  return clampThemeValue(map[dimension] ?? components.risk, 0, 100);
}

function getCountryBlocLabel(country) {
  return (country?.politics?.relations?.blocs || []).slice(0, 2).join(", ") || t("noData");
}

function getCountryNewsTopics(country) {
  const base = country?.general?.officialName || country?.name || "";
  const encoded = value => encodeURIComponent(value);
  return {
    general: `https://news.google.com/search?q=${encoded(`"${base}" actualidad`)}&hl=es-419&gl=AR&ceid=AR:es-419`,
    politics: `https://news.google.com/search?q=${encoded(`"${base}" politica gobierno elecciones`)}&hl=es-419&gl=AR&ceid=AR:es-419`,
    economy: `https://news.google.com/search?q=${encoded(`"${base}" economia comercio inflacion`)}&hl=es-419&gl=AR&ceid=AR:es-419`,
    conflict: `https://news.google.com/search?q=${encoded(`"${base}" conflicto seguridad guerra`)}&hl=es-419&gl=AR&ceid=AR:es-419`,
    diplomacy: `https://news.google.com/search?q=${encoded(`"${base}" diplomacia relaciones exteriores acuerdo`)}&hl=es-419&gl=AR&ceid=AR:es-419`
  };
}

function getReligionBranchThemeKey(country) {
  const majority = getMajorityReligionGroups(country)[0]?.key || "";
  if (majority.includes("crist")) {
    return "cristianismo";
  }
  if (majority.includes("islam")) {
    return "islam";
  }
  if (majority.includes("hindu")) {
    return "hinduismo";
  }
  if (majority.includes("bud")) {
    return "budismo";
  }
  if (majority.includes("juda")) {
    return "judaismo";
  }
  if (majority.includes("afili")) {
    return "noafiliados";
  }
  return "otras";
}

function getExMetropoleThemeKey(country) {
  return country.politics?.relations?.exMetropole || "Sin datos";
}

function getBlocThemeKey(country) {
  const blocs = country.politics?.relations?.blocs || [];
  return blocs[0] || "Otros";
}

function getCountryStyleCacheKey(code) {
  if (typeof mapStyleCore.createStyleCacheKey === "function") {
    return mapStyleCore.createStyleCacheKey({
      code,
      theme: currentTheme,
      mode: currentMapMode,
      overlayBucket: getCurrentOverlayBucket(),
      dataRevision: countriesDataRevision
    });
  }
  return `${code || ""}::${currentTheme}::${currentMapMode}::${getCurrentOverlayBucket()}::${countriesDataRevision}`;
}

function getCountryThemeStyle(code) {
  const cacheKey = getCountryStyleCacheKey(code);
  const cached = countryStyleCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  return countryStyleCache.set(cacheKey, buildCountryThemeStyle(code));
}

function buildCountryThemeStyle(code) {
  const country = countriesData[code];
  const adapt = style => {
    if (typeof mapStyleCore.adaptStyleForMode === "function") {
      return mapStyleCore.adaptStyleForMode(style, {
        mode: currentMapMode,
        defaultStyle: DEFAULT_STYLE,
        isMobile: isMobileLayout()
      });
    }
    if (currentMapMode !== "2d") return style;
    return { ...style, weight: Math.max(1.2, (style.weight || DEFAULT_STYLE.weight) - 0.25), fillOpacity: Math.max(0.06, (style.fillOpacity || DEFAULT_STYLE.fillOpacity) - 0.08) };
  };

  if (!country) {
    return adapt(DEFAULT_STYLE);
  }

  if (currentTheme === "continent") {
    const fillColor = THEME_STYLES.continent[country.continent || "Unknown"] || THEME_STYLES.continent.Unknown;
    return adapt({ ...DEFAULT_STYLE, color: "#274c77", fillColor, fillOpacity: 0.82 });
  }

  if (currentTheme === "religion") {
    const fillColor = THEME_STYLES.religion[getReligionThemeKey(country)] || THEME_STYLES.religion.otras;
    return adapt({ ...DEFAULT_STYLE, color: "#5a2a2a", fillColor, fillOpacity: 0.82 });
  }

  if (currentTheme === "politics") {
    const info = getPoliticalThemeInfo(country);
    const fillColor = THEME_STYLES.politics[info.key] || THEME_STYLES.politics.otros;
    return adapt({ ...DEFAULT_STYLE, color: "#2b2d42", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "population") {
    const fillColor = getPopulationThemeInfo(country).color;
    return adapt({ ...DEFAULT_STYLE, color: "#1b4332", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "density") {
    const fillColor = getBucketThemeInfo(getCountryPopulationDensity(country, code), THEME_STYLES.density).color;
    return adapt({ ...DEFAULT_STYLE, color: "#6a040f", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "urbanization") {
    const fillColor = getBucketThemeInfo(getCountryUrbanizationShare(country), THEME_STYLES.urbanization).color;
    return adapt({ ...DEFAULT_STYLE, color: "#0f4c5c", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "lifeExpectancy") {
    const fillColor = getBucketThemeInfo(getCountryLifeExpectancyEstimate(country, code), THEME_STYLES.lifeExpectancy).color;
    return adapt({ ...DEFAULT_STYLE, color: "#0b3d20", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "populationGrowth") {
    const fillColor = getBucketThemeInfo(getCountryPopulationGrowth(country, code), THEME_STYLES.populationGrowth).color;
    return adapt({ ...DEFAULT_STYLE, color: "#8d0801", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "gdp") {
    const fillColor = getBucketThemeInfo(country.economy?.gdp || 0, THEME_STYLES.gdp).color;
    return adapt({ ...DEFAULT_STYLE, color: "#1b4332", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "gdpPerCapita") {
    const fillColor = getBucketThemeInfo(country.economy?.gdpPerCapita || 0, THEME_STYLES.gdpPerCapita).color;
    return adapt({ ...DEFAULT_STYLE, color: "#023047", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "inflation") {
    const fillColor = getBucketThemeInfo(country.economy?.inflation ?? -1000, THEME_STYLES.inflation).color;
    return adapt({ ...DEFAULT_STYLE, color: "#5f0f40", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "inflationHistory") {
    const fillColor = getBucketThemeInfo(getCountryInflationHistoryScore(country), THEME_STYLES.inflationHistory).color;
    return adapt({ ...DEFAULT_STYLE, color: "#7f0000", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "unemployment") {
    const fillColor = getBucketThemeInfo(getCountryUnemploymentEstimate(country, code), THEME_STYLES.unemployment).color;
    return adapt({ ...DEFAULT_STYLE, color: "#7f0000", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "debt") {
    const fillColor = getBucketThemeInfo(getCountryDebtEstimate(country), THEME_STYLES.debt).color;
    return adapt({ ...DEFAULT_STYLE, color: "#3c096c", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "militaryActive") {
    const fillColor = getBucketThemeInfo(getCountryMilitaryActive(country), THEME_STYLES.militaryActive).color;
    return adapt({ ...DEFAULT_STYLE, color: "#5b0000", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "militarySpending") {
    const fillColor = getBucketThemeInfo(getCountryMilitarySpendingEstimate(country), THEME_STYLES.militarySpending).color;
    return adapt({ ...DEFAULT_STYLE, color: "#4a0404", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "formationYear") {
    const fillColor = getBucketThemeInfo(getCountryFormationYear(country), THEME_STYLES.formationYear).color;
    return adapt({ ...DEFAULT_STYLE, color: "#5f0f40", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "religionBranch") {
    const fillColor = THEME_STYLES.religionBranch[getReligionBranchThemeKey(country)] || THEME_STYLES.religionBranch.otras;
    return adapt({ ...DEFAULT_STYLE, color: "#3c096c", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "exMetropole") {
    const fillColor = THEME_STYLES.exMetropole[getExMetropoleThemeKey(country)] || THEME_STYLES.exMetropole["Sin datos"];
    return adapt({ ...DEFAULT_STYLE, color: "#274c77", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "bloc") {
    const fillColor = THEME_STYLES.bloc[getBlocThemeKey(country)] || THEME_STYLES.bloc.Otros;
    return adapt({ ...DEFAULT_STYLE, color: "#1d3557", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "conflicts") {
    const fillColor = getBucketThemeInfo(getCountryConflictCount(country), THEME_STYLES.conflicts).color;
    return adapt({ ...DEFAULT_STYLE, color: "#5b0000", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "organizations") {
    const fillColor = getBucketThemeInfo(getCountryOrganizationCount(country), THEME_STYLES.organizations).color;
    return adapt({ ...DEFAULT_STYLE, color: "#184e77", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "rivals") {
    const fillColor = getBucketThemeInfo(getCountryRivalCount(country), THEME_STYLES.rivals).color;
    return adapt({ ...DEFAULT_STYLE, color: "#6a040f", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "religionDiversity") {
    const fillColor = getBucketThemeInfo(getCountryReligionDiversity(country), THEME_STYLES.religionDiversity).color;
    return adapt({ ...DEFAULT_STYLE, color: "#6d28d9", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "historyType") {
    const key = normalizeText(country.history?.type || "otros");
    const fillColor = THEME_STYLES.historyType[key] || THEME_STYLES.historyType.otros;
    return adapt({ ...DEFAULT_STYLE, color: "#3c096c", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "exportBreadth") {
    const fillColor = getBucketThemeInfo(getCountryExportBreadth(country), THEME_STYLES.exportBreadth).color;
    return adapt({ ...DEFAULT_STYLE, color: "#133c55", fillColor, fillOpacity: 0.86 });
  }

  if (currentTheme === "exportVolume") {
    const fillColor = getBucketThemeInfo(getCountryExportVolumeEstimate(country), THEME_STYLES.exportVolume).color;
    return adapt({ ...DEFAULT_STYLE, color: "#133c55", fillColor, fillOpacity: 0.86 });
  }

  if (currentTheme === "industryBreadth") {
    const fillColor = getBucketThemeInfo(getCountryIndustryBreadth(country), THEME_STYLES.industryBreadth).color;
    return adapt({ ...DEFAULT_STYLE, color: "#365314", fillColor, fillOpacity: 0.86 });
  }

  if (currentTheme === "capitalShare") {
    const fillColor = getBucketThemeInfo(getCountryCapitalShare(country), THEME_STYLES.capitalShare).color;
    return adapt({ ...DEFAULT_STYLE, color: "#581c87", fillColor, fillOpacity: 0.86 });
  }

  if (currentTheme === "gdpPpp") {
    const fillColor = getBucketThemeInfo(getCountryGdpPppEstimate(country), THEME_STYLES.gdpPpp).color;
    return adapt({ ...DEFAULT_STYLE, color: "#0b3d20", fillColor, fillOpacity: 0.86 });
  }

  if (currentTheme === "naturalResources") {
    const fillColor = THEME_STYLES.naturalResources[getCountryNaturalResourceThemeKey(country)] || THEME_STYLES.naturalResources.escasos;
    return adapt({ ...DEFAULT_STYLE, color: "#1d3557", fillColor, fillOpacity: 0.84 });
  }

  if (currentTheme === "geopoliticalIndex") {
    const fillColor = getBucketThemeInfo(getCountryGeopoliticalIndex(country), THEME_STYLES.geopoliticalIndex).color;
    return adapt({ ...DEFAULT_STYLE, color: "#240046", fillColor, fillOpacity: 0.86 });
  }

  if (currentTheme === "riskRadar") {
    const fillColor = getBucketThemeInfo(getCountryRiskRadar(country), THEME_STYLES.riskRadar).color;
    return adapt({ ...DEFAULT_STYLE, color: "#6a040f", fillColor, fillOpacity: 0.88 });
  }

  if (["riskMilitary", "riskEconomic", "riskDiplomatic", "riskInternal", "riskTerritorial"].includes(currentTheme)) {
    const fillColor = getBucketThemeInfo(getCountryRiskDimension(country, currentTheme), THEME_STYLES.riskDimension).color;
    return adapt({ ...DEFAULT_STYLE, color: "#7f1d1d", fillColor, fillOpacity: 0.87 });
  }

  if (currentTheme === "qualityScore") {
    const fillColor = getBucketThemeInfo(getCountryQualityScore(country), THEME_STYLES.qualityScore).color;
    return adapt({ ...DEFAULT_STYLE, color: "#0b3d20", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "languageDiversity") {
    const fillColor = getBucketThemeInfo(getCountryLanguageDiversity(country), THEME_STYLES.languageDiversity).color;
    return adapt({ ...DEFAULT_STYLE, color: "#5a189a", fillColor, fillOpacity: 0.85 });
  }

  if (currentTheme === "diplomaticReach") {
    const fillColor = getBucketThemeInfo(getCountryDiplomaticReach(country), THEME_STYLES.diplomaticReach).color;
    return adapt({ ...DEFAULT_STYLE, color: "#003049", fillColor, fillOpacity: 0.85 });
  }

  return adapt(DEFAULT_STYLE);
}

function refreshLoadedCountryLayers() {
  if (!countryLayers?.size) {
    return;
  }

  countryLayers.forEach((layer, code) => {
    const country = countriesData[code];
    if (!country) {
      return;
    }
    layer.featureName = country.name || layer.featureName;
    layer.entities.forEach(entity => {
      entity.countryName = country.name || entity.countryName;
    });
    if (!selectedLayers.includes(layer)) {
      layer.setStyle(getCountryThemeStyle(code));
    }
  });
  registerFeatureNameAliases(
    Object.fromEntries(
      [...countryLayers.entries()].map(([code, layer]) => [code, countriesData[code]?.name || layer.featureName || code])
    )
  );
  requestSceneRender();
}

function refreshCountryStyles() {
  if (isCameraNavigating && currentMapMode === "3d") {
    return;
  }
  const nextSignature = [
    currentTheme,
    currentMapMode,
    getCurrentOverlayBucket(),
    countriesDataRevision,
    selectionMode,
    selectedLayers.map(layer => layer.code).join(",")
  ].join("|");
  if (
    countryLayers.size &&
    typeof mapStyleCore.shouldRefreshStyles === "function" &&
    !mapStyleCore.shouldRefreshStyles(lastStyleRefreshSignature, nextSignature)
  ) {
    return;
  }
  lastStyleRefreshSignature = nextSignature;

  countryLayers.forEach((layer, code) => {
    layer.setStyle(getCountryThemeStyle(code));
  });

  selectedLayers.forEach(layer => {
    if (selectionMode === "country") {
      layer.setStyle(COUNTRY_HIGHLIGHT_STYLE);
    } else if (selectionMode === "religion") {
      layer.setStyle(RELIGION_HIGHLIGHT_STYLE);
    } else {
      layer.setStyle(CONTINENT_HIGHLIGHT_STYLE);
    }
  });

  viewer?.scene?.requestRender?.();
}

function renderThemeLegend() {
  const container = document.getElementById("theme-legend");
  if (!container) {
    return;
  }

  let items = [];

  if (currentTheme === "continent") {
    items = Object.entries(THEME_STYLES.continent).map(([label, color]) => ({
      label: translateContinentName(label),
      color
    }));
  } else if (currentTheme === "religion") {
    items = Object.entries(THEME_STYLES.religion).map(([label, color]) => ({
      label: normalizeCategoryLabel(label),
      color
    }));
  } else if (currentTheme === "politics") {
    items = Object.entries(THEME_STYLES.politics).map(([label, color]) => ({
      label: normalizeCategoryLabel(label),
      color
    }));
  } else if (currentTheme === "population") {
    items = THEME_STYLES.population.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "density") {
    items = THEME_STYLES.density.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "urbanization") {
    items = THEME_STYLES.urbanization.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "lifeExpectancy") {
    items = THEME_STYLES.lifeExpectancy.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "populationGrowth") {
    items = THEME_STYLES.populationGrowth.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "gdp") {
    items = THEME_STYLES.gdp.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "gdpPerCapita") {
    items = THEME_STYLES.gdpPerCapita.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "inflation") {
    items = THEME_STYLES.inflation.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "inflationHistory") {
    items = THEME_STYLES.inflationHistory.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "unemployment") {
    items = THEME_STYLES.unemployment.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "debt") {
    items = THEME_STYLES.debt.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "militaryActive") {
    items = THEME_STYLES.militaryActive.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "militarySpending") {
    items = THEME_STYLES.militarySpending.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "formationYear") {
    items = THEME_STYLES.formationYear.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "religionBranch") {
    items = Object.entries(THEME_STYLES.religionBranch).map(([label, color]) => ({
      label: normalizeCategoryLabel(label),
      color
    }));
  } else if (currentTheme === "exMetropole") {
    items = Object.entries(THEME_STYLES.exMetropole).map(([label, color]) => ({
      label,
      color
    }));
  } else if (currentTheme === "bloc") {
    items = Object.entries(THEME_STYLES.bloc).map(([label, color]) => ({
      label,
      color
    }));
  } else if (currentTheme === "conflicts") {
    items = THEME_STYLES.conflicts.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "organizations") {
    items = THEME_STYLES.organizations.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "rivals") {
    items = THEME_STYLES.rivals.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "religionDiversity") {
    items = THEME_STYLES.religionDiversity.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "historyType") {
    items = Object.entries(THEME_STYLES.historyType).map(([label, color]) => ({
      label: normalizeCategoryLabel(label),
      color
    }));
  } else if (currentTheme === "exportBreadth") {
    items = THEME_STYLES.exportBreadth.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "exportVolume") {
    items = THEME_STYLES.exportVolume.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "industryBreadth") {
    items = THEME_STYLES.industryBreadth.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "capitalShare") {
    items = THEME_STYLES.capitalShare.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "gdpPpp") {
    items = THEME_STYLES.gdpPpp.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "naturalResources") {
    items = Object.entries(THEME_STYLES.naturalResources).map(([label, color]) => ({
      label: normalizeCategoryLabel(label),
      color
    }));
  } else if (currentTheme === "geopoliticalIndex") {
    items = THEME_STYLES.geopoliticalIndex.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "riskRadar") {
    items = THEME_STYLES.riskRadar.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (["riskMilitary", "riskEconomic", "riskDiplomatic", "riskInternal", "riskTerritorial"].includes(currentTheme)) {
    items = THEME_STYLES.riskDimension.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "qualityScore") {
    items = THEME_STYLES.qualityScore.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "languageDiversity") {
    items = THEME_STYLES.languageDiversity.map(item => ({
      label: item.label,
      color: item.color
    }));
  } else if (currentTheme === "diplomaticReach") {
    items = THEME_STYLES.diplomaticReach.map(item => ({
      label: item.label,
      color: item.color
    }));
  }

  if (!items.length) {
    container.innerHTML = "";
    return;
  }

  const proxyNote = THEME_PROXY_KEYS.has(currentTheme)
    ? `<p class="legend-note">${currentLanguage === "en" ? "Estimated layer built from local indicators and derived proxies." : "Capa estimada armada con indicadores locales y proxies derivados."}</p>`
    : "";

  container.innerHTML = `${items
    .map(item => `<div class="legend-item"><span class="legend-swatch" style="background:${item.color}"></span>${item.label}</div>`)
    .join("")}${proxyNote}`;
}

function getCurrentThemeSelectedCountry() {
  return currentPanelState.type === "country" && currentPanelState.code && countriesData[currentPanelState.code]
    ? countriesData[currentPanelState.code]
    : null;
}

function getThemeMetricConfig(theme = currentTheme) {
  const configs = {
    density: {
      title: currentLanguage === "en" ? "Population density" : "Densidad de poblacion",
      description: currentLanguage === "en"
        ? "Estimates inhabitants per square kilometer using population and mapped surface."
        : "Estima habitantes por kilometro cuadrado usando poblacion y superficie cartografiada.",
      formatter: value => `${formatNumber(Math.round(value || 0))} hab/km²`,
      getter: (country, code) => getCountryPopulationDensity(country, code),
      estimated: false
    },
    urbanization: {
      title: currentLanguage === "en" ? "Urbanization" : "Urbanizacion",
      description: currentLanguage === "en"
        ? "Approximates the weight of major cities and the concentration of population in urban areas."
        : "Aproxima el peso de las grandes ciudades y la concentracion de poblacion en areas urbanas.",
      formatter: value => formatPercentage(value || 0),
      getter: country => getCountryUrbanizationShare(country),
      estimated: true
    },
    lifeExpectancy: {
      title: currentLanguage === "en" ? "Life expectancy" : "Esperanza de vida",
      description: currentLanguage === "en"
        ? "Derived estimate built from development, conflict exposure and urbanization."
        : "Estimacion derivada a partir de desarrollo, exposicion al conflicto y urbanizacion.",
      formatter: value => `${formatNumber(Math.round((value || 0) * 10) / 10)} ${currentLanguage === "en" ? "years" : "anos"}`,
      getter: (country, code) => getCountryLifeExpectancyEstimate(country, code),
      estimated: true
    },
    populationGrowth: {
      title: currentLanguage === "en" ? "Demographic growth" : "Crecimiento demografico",
      description: currentLanguage === "en"
        ? "Uses local series when available and otherwise estimates the demographic trend."
        : "Usa series locales cuando existen y en otros casos estima la tendencia demografica.",
      formatter: value => formatPercentage(value || 0),
      getter: (country, code) => getCountryPopulationGrowth(country, code),
      estimated: true
    },
    unemployment: {
      title: currentLanguage === "en" ? "Unemployment" : "Desempleo",
      description: currentLanguage === "en"
        ? "Proxy based on inflation, conflict pressure, urbanization and growth."
        : "Proxy basado en inflacion, presion conflictiva, urbanizacion y crecimiento.",
      formatter: value => formatPercentage(value || 0),
      getter: (country, code) => getCountryUnemploymentEstimate(country, code),
      estimated: true
    },
    debt: {
      title: currentLanguage === "en" ? "Public debt" : "Deuda publica",
      description: currentLanguage === "en"
        ? "Debt-to-GDP estimate inferred from income level, inflation stress and conflict load."
        : "Estimacion de deuda sobre PBI inferida desde ingreso, tension inflacionaria y carga conflictiva.",
      formatter: value => formatPercentage(value || 0),
      getter: country => getCountryDebtEstimate(country),
      estimated: true
    },
    militarySpending: {
      title: currentLanguage === "en" ? "Military spending" : "Gasto militar",
      description: currentLanguage === "en"
        ? "Approximated as share of GDP from active personnel, conflict profile and geopolitical weight."
        : "Aproximado como porcentaje del PBI desde personal activo, perfil conflictivo y peso geopolitico.",
      formatter: value => formatPercentage(value || 0),
      getter: country => getCountryMilitarySpendingEstimate(country),
      estimated: true
    },
    exportVolume: {
      title: currentLanguage === "en" ? "Export volume" : "Volumen exportador",
      description: currentLanguage === "en"
        ? "Estimated export scale from GDP, export basket and resource profile."
        : "Escala exportadora estimada desde PBI, canasta exportadora y perfil de recursos.",
      formatter: value => `US$ ${compactNumber(value || 0)}`,
      getter: country => getCountryExportVolumeEstimate(country),
      estimated: true
    },
    gdpPpp: {
      title: currentLanguage === "en" ? "GDP PPP" : "PBI PPC",
      description: currentLanguage === "en"
        ? "Purchasing power estimate derived from GDP, income level and structural breadth."
        : "Estimacion de paridad de poder adquisitivo derivada de PBI, ingreso y amplitud estructural.",
      formatter: value => `US$ ${compactNumber(value || 0)}`,
      getter: country => getCountryGdpPppEstimate(country),
      estimated: true
    },
    naturalResources: {
      title: currentLanguage === "en" ? "Natural resources" : "Recursos naturales",
      description: currentLanguage === "en"
        ? "Classifies the country's extractive and productive resource profile."
        : "Clasifica el perfil extractivo y productivo dominante del pais.",
      formatter: value => normalizeCategoryLabel(value || (currentLanguage === "en" ? "No data" : "Sin datos")),
      getter: country => getCountryNaturalResourceThemeKey(country),
      estimated: false
    },
    geopoliticalIndex: {
      title: currentLanguage === "en" ? "Geopolitical index" : "Indice geopolitico",
      description: currentLanguage === "en"
        ? "Composite score combining demographics, economy, military capacity, organizations and conflict exposure."
        : "Indice compuesto que combina demografia, economia, capacidad militar, organizaciones y exposicion al conflicto.",
      formatter: value => `${formatNumber(Math.round((value || 0) * 10) / 10)} / 100`,
      getter: country => getCountryGeopoliticalIndex(country),
      estimated: true
    },
    riskRadar: {
      title: currentLanguage === "en" ? "Multi-variable risk radar" : "Radar de riesgo multiparametrico",
      description: currentLanguage === "en"
        ? "Explainable proxy combining conflict exposure, military pressure, rivals, economic stress, governance and diplomatic buffers."
        : "Proxy explicable que combina exposicion a conflictos, presion militar, rivales, estres economico, gobernanza y amortiguadores diplomaticos.",
      formatter: value => `${formatNumber(Math.round((value || 0) * 10) / 10)} / 100`,
      getter: country => getCountryRiskRadar(country),
      estimated: true
    },
    riskMilitary: {
      title: currentLanguage === "en" ? "Military risk" : "Riesgo militar",
      description: currentLanguage === "en" ? "Military pressure proxy from active personnel and conflict exposure." : "Proxy de presion militar desde personal activo y exposicion conflictiva.",
      formatter: value => `${formatNumber(Math.round(value || 0))} / 100`,
      getter: country => getCountryRiskDimension(country, "riskMilitary"),
      estimated: true
    },
    riskEconomic: {
      title: currentLanguage === "en" ? "Economic risk" : "Riesgo economico",
      description: currentLanguage === "en" ? "Economic stress proxy using inflation and income buffer." : "Proxy de estres economico usando inflacion y amortiguador de ingreso.",
      formatter: value => `${formatNumber(Math.round(value || 0))} / 100`,
      getter: country => getCountryRiskDimension(country, "riskEconomic"),
      estimated: true
    },
    riskDiplomatic: {
      title: currentLanguage === "en" ? "Diplomatic risk" : "Riesgo diplomatico",
      description: currentLanguage === "en" ? "Inverse diplomatic buffer from organizations, blocs and relationships." : "Amortiguador diplomatico inverso a partir de organizaciones, bloques y relaciones.",
      formatter: value => `${formatNumber(Math.round(value || 0))} / 100`,
      getter: country => getCountryRiskDimension(country, "riskDiplomatic"),
      estimated: true
    },
    riskInternal: {
      title: currentLanguage === "en" ? "Internal risk" : "Riesgo interno",
      description: currentLanguage === "en" ? "Governance stress proxy from political system and institutional flags." : "Proxy de estres de gobernanza desde sistema politico y senales institucionales.",
      formatter: value => `${formatNumber(Math.round(value || 0))} / 100`,
      getter: country => getCountryRiskDimension(country, "riskInternal"),
      estimated: true
    },
    riskTerritorial: {
      title: currentLanguage === "en" ? "Territorial risk" : "Riesgo territorial",
      description: currentLanguage === "en" ? "Pressure from rivals, disputes and contested territories." : "Presion por rivales, disputas y territorios contestados.",
      formatter: value => `${formatNumber(Math.round(value || 0))} / 100`,
      getter: country => getCountryRiskDimension(country, "riskTerritorial"),
      estimated: true
    },
    qualityScore: {
      title: currentLanguage === "en" ? "Dataset quality" : "Calidad del dataset",
      description: currentLanguage === "en"
        ? "Reads the local curation quality score for each country profile."
        : "Lee el puntaje local de calidad y curaduria de cada ficha pais.",
      formatter: value => `${formatNumber(Math.round(value || 0))} / 100`,
      getter: country => getCountryQualityScore(country),
      estimated: false
    },
    languageDiversity: {
      title: currentLanguage === "en" ? "Language diversity" : "Diversidad linguistica",
      description: currentLanguage === "en"
        ? "Counts official and principal languages registered in the country profile."
        : "Cuenta idiomas oficiales y principales registrados en la ficha del pais.",
      formatter: value => `${formatNumber(Math.round(value || 0))} ${currentLanguage === "en" ? "languages" : "idiomas"}`,
      getter: country => getCountryLanguageDiversity(country),
      estimated: false
    },
    diplomaticReach: {
      title: currentLanguage === "en" ? "Diplomatic reach" : "Alcance diplomatico",
      description: currentLanguage === "en"
        ? "Proxy built from organizations, blocs, allies, rivals and disputes."
        : "Proxy armado a partir de organizaciones, bloques, aliados, rivales y disputas.",
      formatter: value => `${formatNumber(Math.round(value || 0))} ${currentLanguage === "en" ? "links" : "vinculos"}`,
      getter: country => getCountryDiplomaticReach(country),
      estimated: true
    }
  };

  return configs[theme] || null;
}

function renderThemeSummary() {
  const container = document.getElementById("theme-summary");
  if (!container) {
    return;
  }

  const metric = getThemeMetricConfig();
  if (!metric) {
    container.hidden = true;
    container.innerHTML = "";
    lastThemeSummarySignature = "";
    return;
  }

  const values = getCountryEntries()
    .map(([code, country]) => ({
      code,
      country,
      value: metric.getter(country, code)
    }))
    .filter(item => item.value !== null && item.value !== undefined && item.value !== "" && !(typeof item.value === "number" && Number.isNaN(item.value)));

  if (!values.length) {
    container.hidden = true;
    container.innerHTML = "";
    lastThemeSummarySignature = "";
    return;
  }

  const numeric = values.every(item => typeof item.value === "number");
  const leader = numeric
    ? [...values].sort((a, b) => b.value - a.value)[0]
    : values[0];
  const average = numeric
    ? values.reduce((sum, item) => sum + item.value, 0) / Math.max(values.length, 1)
    : null;
  const selectedCountry = getCurrentThemeSelectedCountry();
  const selectedCode = selectedCountry ? getCountryCodeByObject(selectedCountry) : "";
  const selectedItem = selectedCode ? values.find(item => item.code === selectedCode) : null;
  const median = numeric
    ? ([...values].sort((a, b) => a.value - b.value)[Math.floor(values.length / 2)]?.value ?? null)
    : null;
  const percentile = numeric && selectedItem
    ? Math.round((values.filter(item => item.value <= selectedItem.value).length / Math.max(values.length, 1)) * 100)
    : null;
  const summarySignature = JSON.stringify({
    theme: currentTheme,
    language: currentLanguage,
    selectedCode,
    leader: leader?.code || "",
    average: average === null ? null : Math.round(average * 100) / 100,
    median: median === null ? null : Math.round(median * 100) / 100,
    percentile,
    coverage: values.length
  });
  if (!container.hidden && lastThemeSummarySignature === summarySignature) {
    return;
  }

  container.hidden = false;
  container.innerHTML = `
    <p class="theme-summary-title">${escapeHtml(metric.title)}</p>
    <p class="theme-summary-description">${escapeHtml(metric.description)}</p>
    <div class="theme-summary-grid">
      <div class="theme-summary-card">
        <span class="theme-summary-label">${currentLanguage === "en" ? "Global leader" : "Lider global"}</span>
        <strong class="theme-summary-value">${leader ? `${escapeHtml(leader.country.name)} · ${escapeHtml(metric.formatter(leader.value))}` : t("noData")}</strong>
      </div>
      <div class="theme-summary-card">
        <span class="theme-summary-label">${currentLanguage === "en" ? "Average" : "Promedio"}</span>
          <strong class="theme-summary-value">${average === null ? (currentLanguage === "en" ? "Categorical layer" : "Capa categorica") : escapeHtml(metric.formatter(average))}</strong>
      </div>
      <div class="theme-summary-card">
        <span class="theme-summary-label">${currentLanguage === "en" ? "Median / baseline" : "Mediana / base"}</span>
        <strong class="theme-summary-value">${median === null ? (currentLanguage === "en" ? "Categorical layer" : "Capa categorica") : escapeHtml(metric.formatter(median))}</strong>
      </div>
      <div class="theme-summary-card">
        <span class="theme-summary-label">${currentLanguage === "en" ? "Coverage" : "Cobertura"}</span>
        <strong class="theme-summary-value">${formatNumber(values.length)} ${currentLanguage === "en" ? "countries" : "paises"}</strong>
      </div>
      <div class="theme-summary-card">
        <span class="theme-summary-label">${currentLanguage === "en" ? "Selected country" : "Pais seleccionado"}</span>
        <strong class="theme-summary-value">${selectedItem ? `${escapeHtml(selectedItem.country.name)} · ${escapeHtml(metric.formatter(selectedItem.value))}` : (currentLanguage === "en" ? "Select a country" : "Selecciona un pais")}</strong>
      </div>
    </div>
    <p class="theme-summary-note">${selectedItem && percentile !== null ? `${currentLanguage === "en" ? "Selected country percentile" : "Percentil del pais seleccionado"}: ${percentile}. ` : ""}${metric.estimated ? (currentLanguage === "en" ? "This thematic layer uses local estimates or proxies." : "Esta capa tematica usa estimaciones o proxies locales.") : (currentLanguage === "en" ? "This thematic layer is based on direct categorical data." : "Esta capa tematica se basa en datos categoricos directos.")}</p>
  `;
  lastThemeSummarySignature = summarySignature;
}

function getCountryNewsUrl(country) {
  const topicUrls = getCountryNewsTopics(country);
  return topicUrls[activeNewsTopic] || topicUrls.general;
}

function getCountryNewsPortalLinks(country) {
  const baseQuery = encodeURIComponent(country.general?.officialName || country.name);
  return [
    { label: "Google News", url: getCountryNewsUrl(country) },
    { label: "Reuters", url: `https://www.reuters.com/site-search/?query=${baseQuery}` },
    { label: "BBC", url: `https://www.bbc.co.uk/search?q=${baseQuery}` },
    { label: currentLanguage === "en" ? "External search" : "Busqueda externa", url: `https://www.google.com/search?tbm=nws&q=${baseQuery}` },
    { label: currentLanguage === "en" ? "Regional press" : "Prensa regional", url: `https://news.google.com/search?q=${encodeURIComponent(`"${country.name}" prensa regional noticias`)}&hl=es-419&gl=AR&ceid=AR:es-419` }
  ];
}

function getNewsTopicLabel(topic = activeNewsTopic) {
  const labels = currentLanguage === "en"
    ? { general: "General view", politics: "Politics", economy: "Economy", conflict: "Conflict and security", diplomacy: "Diplomacy" }
    : { general: "Panorama general", politics: "Politica", economy: "Economia", conflict: "Conflicto y seguridad", diplomacy: "Diplomacia" };
  return labels[topic] || labels.general;
}

function getNewsCacheKey(country) {
  return `${country?.code || country?.name || ""}:${activeNewsTopic}`;
}

function buildNewsQueries(country) {
  const topicTerms = {
    general: "actualidad",
    politics: "politica gobierno elecciones",
    economy: "economia comercio inflacion",
    conflict: "conflicto seguridad guerra",
    diplomacy: "diplomacia relaciones exteriores acuerdo"
  };
  const base = country.general?.officialName || country.name;
  const queries = uniqueNormalizedList([
    `"${base}" ${topicTerms[activeNewsTopic] || topicTerms.general}`,
    country.name !== base ? `"${country.name}" ${topicTerms[activeNewsTopic] || topicTerms.general}` : ""
  ]);

  return queries.filter(Boolean);
}

async function fetchCountryHeadlines(country) {
  if (!country?.code) {
    return [];
  }

  const cacheKey = getNewsCacheKey(country);
  const cached = newsCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.items;
  }

  const fallback = {
    title: `Cobertura reciente sobre ${country.name}`,
    source: "Google News",
    date: "",
    summary: currentLanguage === "en"
      ? `Live headlines are unavailable here. Open the external search for current coverage about ${country.name}.`
      : `No hay titulares en vivo disponibles aqui. Abri la busqueda externa para ver cobertura actual sobre ${country.name}.`,
    url: getCountryNewsUrl(country)
  };
  const collected = [];
  const seenUrls = new Set();

  const queries = buildNewsQueries(country);
  for (const query of queries) {
    try {
      const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=ArtList&maxrecords=4&format=json&sort=DateDesc`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        continue;
      }

      const payload = await response.json();
      const articles = payload?.articles || [];
      if (!articles.length) {
        continue;
      }

      for (const article of articles) {
        const articleUrl = article.url || fallback.url;
        if (!articleUrl || seenUrls.has(articleUrl)) {
          continue;
        }
        seenUrls.add(articleUrl);
        collected.push({
          title: article.title || fallback.title,
          source: article.sourceCommonName || article.domain || fallback.source,
          date: article.seendate ? formatNewsDate(article.seendate) : "",
          summary: currentLanguage === "en"
            ? `Recent ${getNewsTopicLabel(activeNewsTopic).toLowerCase()} coverage linked to ${country.name}.`
            : `Cobertura reciente de ${getNewsTopicLabel(activeNewsTopic).toLowerCase()} vinculada a ${country.name}.`,
          url: articleUrl
        });
        if (collected.length >= 4) {
          break;
        }
      }
      if (collected.length >= 4) {
        break;
      }
    } catch (error) {
      console.info(`Noticias en vivo no disponibles para ${country.name}:`, error?.name || error);
    }
  }

  const finalItems = collected.length ? collected : [fallback];
  newsCache.set(cacheKey, { expires: Date.now() + NEWS_CACHE_TTL_MS, items: finalItems });
  return finalItems;
}

function getSafeNewsUrl(value, fallbackUrl) {
  try {
    const url = new URL(String(value || ""), window.location.href);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch {
    // The external result is optional; the curated search URL remains available.
  }
  return fallbackUrl;
}

function renderNewsArticle(headline, country, headlines = []) {
  const articleContainer = document.getElementById("news-hub-article");
  if (!articleContainer || !country) {
    return;
  }

  const fallbackUrl = getCountryNewsUrl(country);
  const item = headline || {
    title: currentLanguage === "en" ? `Recent coverage about ${country.name}` : `Cobertura reciente sobre ${country.name}`,
    source: currentLanguage === "en" ? "External search" : "Busqueda externa",
    date: "",
    summary: currentLanguage === "en"
      ? "Live headlines are unavailable. Open the external search for current coverage."
      : "No hay titulares en vivo disponibles. Abri la busqueda externa para ver cobertura actual.",
    url: fallbackUrl
  };
  const safeHeadlines = (headlines.length ? headlines : [item]).map(entry => ({
    ...entry,
    url: escapeHtml(getSafeNewsUrl(entry?.url, fallbackUrl))
  }));
  const safeItem = safeHeadlines[0];
  const relatedMarkup = typeof newsUi.buildRelatedList === "function"
    ? newsUi.buildRelatedList(
        safeHeadlines,
        escapeHtml,
        escapeHtml(fallbackUrl),
        currentLanguage === "en" ? "More headlines" : "Mas titulares"
      )
    : "";
  const meta = [safeItem.source, safeItem.date].filter(Boolean).map(escapeHtml).join(" · ");

  articleContainer.innerHTML = typeof newsUi.buildArticleCard === "function"
    ? newsUi.buildArticleCard({
        title: escapeHtml(safeItem.title || item.title),
        summary: escapeHtml(safeItem.summary || item.summary),
        meta,
        actionLabel: currentLanguage === "en" ? "Open source" : "Abrir fuente",
        actionUrl: safeItem.url,
        relatedMarkup
      })
    : `
        <div class="news-hub-article-card">
          <strong>${escapeHtml(safeItem.title || item.title)}</strong>
          <p>${escapeHtml(safeItem.summary || item.summary)}</p>
          ${meta ? `<div class="news-hub-meta">${meta}</div>` : ""}
          <a class="news-link" href="${safeItem.url}" target="_blank" rel="noreferrer">
            ${currentLanguage === "en" ? "Open source" : "Abrir fuente"}
          </a>
        </div>
      `;
}

function formatNewsDate(value) {
  const raw = String(value || "");
  if (!raw) {
    return "";
  }

  const compact = raw.replace(/[^\d]/g, "");
  if (compact.length >= 8) {
    const year = Number(compact.slice(0, 4));
    const month = Number(compact.slice(4, 6)) - 1;
    const day = Number(compact.slice(6, 8));
    const hour = compact.length >= 10 ? Number(compact.slice(8, 10)) : 0;
    const minute = compact.length >= 12 ? Number(compact.slice(10, 12)) : 0;
    const date = new Date(Date.UTC(year, month, day, hour, minute));
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString(currentLanguage === "en" ? "en-US" : "es-AR", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    }
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime())
    ? raw
    : parsed.toLocaleString(currentLanguage === "en" ? "en-US" : "es-AR", {
      dateStyle: "medium",
      timeStyle: "short"
    });
}

function updateExtendedStaticText() {
  if (typeof textUi.applyExtendedStaticText !== "function") {
    return false;
  }
  return textUi.applyExtendedStaticText(getStaticTextRuntimeContext());
}

function startPerformanceMonitor() {
  if (performanceMonitorId || !viewer?.scene?.postRender) return;
  let frameCount = 0;
  let lastCheck = performance.now();
  let rollingFps = getPerformancePreset().targetFrameRate;
  const monitorStartedAt = performance.now();
  const monitorDuration = 60000;
  const removePostRenderListener = viewer.scene.postRender.addEventListener(() => {
    frameCount += 1;
  });

  const sample = () => {
    const now = performance.now();
    const elapsed = now - lastCheck;
    const isActiveWindow = isCameraNavigating
      || !viewer.scene.globe?.tilesLoaded
      || Date.now() - lastInteractionAt < 3500;

    if (isActiveWindow) {
      const fps = (frameCount * 1000) / Math.max(1, elapsed);
      rollingFps = rollingFps * 0.62 + fps * 0.38;
      bootScheduler.recordStartupFps?.(fps, now - monitorStartedAt);
      const tier = getDeviceTier();
      const lowFpsThreshold = isMobileLayout() ? 18 : tier === "low" ? 15 : tier === "medium" ? 18 : 20;
      const highFpsThreshold = isMobileLayout() ? 28 : tier === "low" ? 24 : tier === "medium" ? 30 : 34;
      const criticalFpsThreshold = isMobileLayout() ? 7 : tier === "low" ? 7 : 9;
      sustainedLowFpsWindows = rollingFps < lowFpsThreshold ? sustainedLowFpsWindows + 1 : 0;
      sustainedHighFpsWindows = rollingFps > highFpsThreshold ? sustainedHighFpsWindows + 1 : 0;
      sustainedCriticalFpsWindows = currentMapMode === "3d" && rollingFps < criticalFpsThreshold
        ? sustainedCriticalFpsWindows + 1
        : 0;
      if (qualityPreset === "auto" && sustainedCriticalFpsWindows >= 3) {
        clearMapLabels();
        applyMapMode("2d", false);
        recordMapDegradation(
          currentLanguage === "en" ? "3D changed to 2D after critical FPS" : "3D cambiado a 2D por FPS critico",
          { fps: rollingFps }
        );
        sustainedCriticalFpsWindows = 0;
        sustainedLowFpsWindows = 0;
      } else if (qualityPreset === "auto" && sustainedLowFpsWindows >= 2) {
        hoverSuppressedUntil = Date.now() + 3200;
        viewer.resolutionScale = Math.max(
          currentMapMode === "2d"
              ? (isMobileLayout() ? 0.42 : tier === "low" ? 0.58 : 0.68)
              : (isMobileLayout() ? 0.74 : tier === "low" ? 0.86 : 0.94),
            viewer.resolutionScale - (isMobileLayout() ? 0.06 : 0.04)
          );
        viewer.scene.globe.maximumScreenSpaceError = Math.min(currentMapMode === "2d" ? 12.5 : 9.2, viewer.scene.globe.maximumScreenSpaceError + 0.45);
        viewer.scene.globe.loadingDescendantLimit = Math.max(currentMapMode === "2d" ? 2 : 5, viewer.scene.globe.loadingDescendantLimit - 1);
        viewer.scene.globe.tileCacheSize = Math.max(currentMapMode === "2d" ? 24 : 60, viewer.scene.globe.tileCacheSize - 14);
        viewer.scene.maximumRenderTimeChange = currentMapMode === "2d" ? 0.09 : 0.4;
        if (
          labelEntities.length &&
          typeof mapInteractionCore.shouldDisableLabelsForFps === "function" &&
          mapInteractionCore.shouldDisableLabelsForFps({ fps: rollingFps, isMobile: isMobileLayout(), tier, mode: currentMapMode })
        ) {
          clearMapLabels();
          recordMapDegradation(currentLanguage === "en" ? "labels disabled by FPS" : "etiquetas desactivadas por FPS", { fps: rollingFps });
        }
        recordMapDegradation(currentLanguage === "en" ? "low sustained FPS" : "FPS bajo sostenido", { fps: rollingFps });
        sustainedLowFpsWindows = 0;
      } else if (qualityPreset === "auto" && sustainedHighFpsWindows >= 3) {
        const preset = getPerformancePreset();
        viewer.resolutionScale = Math.min(preset.resolutionScale, viewer.resolutionScale + 0.03);
        viewer.scene.globe.maximumScreenSpaceError = Math.max(preset.maximumScreenSpaceError, viewer.scene.globe.maximumScreenSpaceError - 0.2);
        viewer.scene.globe.loadingDescendantLimit = Math.min(preset.loadingDescendantLimit, viewer.scene.globe.loadingDescendantLimit + 1);
        viewer.scene.globe.tileCacheSize = Math.min(preset.tileCacheSize, viewer.scene.globe.tileCacheSize + 12);
        viewer.scene.maximumRenderTimeChange = currentMapMode === "2d" ? 0.06 : 0.28;
        if (
          viewer.resolutionScale >= preset.resolutionScale &&
          viewer.scene.globe.maximumScreenSpaceError <= preset.maximumScreenSpaceError
        ) {
          reducedPerformanceMode = false;
          reducedPerformanceReason = "";
        }
        sustainedHighFpsWindows = 0;
      }
      updateAppStatusPanel({ fps: Math.round(rollingFps * 10) / 10 });
    }

    frameCount = 0;
    lastCheck = now;
  };

  performanceMonitorId = window.setInterval(sample, 2500);
  window.setTimeout(() => {
    if (performanceMonitorId) {
      window.clearInterval(performanceMonitorId);
      performanceMonitorId = null;
    }
    removePostRenderListener?.();
    updateAppStatusPanel({ fps: Math.round(rollingFps * 10) / 10 });
  }, monitorDuration);
}

async function showNewsArticle(countryCode) {
  await ensureDeferredUiModule("news");
  activeNewsCountryCode = countryCode;
  const articleContainer = document.getElementById("news-hub-article");
  const selectedContainer = document.getElementById("news-hub-selected");
  const panelContent = document.querySelector("#news-hub-panel .news-hub-content");
  const country = countriesData[countryCode];
  if (!articleContainer || !selectedContainer || !country) {
    return;
  }

  selectedContainer.innerHTML = `
    <div class="news-hub-selected-card">
      <strong>${escapeHtml(country.name)}</strong>
      <div class="news-hub-meta">${escapeHtml(country.general?.officialName || country.name)}</div>
    </div>
  `;
  articleContainer.innerHTML = `
    <div class="news-hub-article-card">
      <strong>${currentLanguage === "en" ? "Loading headline..." : "Cargando noticia..."}</strong>
      <p>${currentLanguage === "en" ? "If live news is not available, the hub will show a direct link to current coverage." : "Si la noticia en vivo no esta disponible, el hub mostrara un enlace directo a la cobertura actual."}</p>
      <a class="news-link" href="${getCountryNewsUrl(country)}" target="_blank" rel="noreferrer">
        ${currentLanguage === "en" ? "Open live coverage now" : "Abrir cobertura en vivo ahora"}
      </a>
    </div>
  `;
  panelContent?.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelectorAll("#news-hub-list .news-hub-item").forEach(item => {
    item.classList.toggle("is-active", item.querySelector("[data-news-country]")?.dataset.newsCountry === countryCode);
  });
  const headlines = await fetchCountryHeadlines(country);
  renderNewsArticle(headlines[0], country, headlines);
}

function renderNewsHub(selectedCode = "") {
  const panel = document.getElementById("news-hub-panel");
  const selectedContainer = document.getElementById("news-hub-selected");
  const listContainer = document.getElementById("news-hub-list");
  const articleContainer = document.getElementById("news-hub-article");
  const filterInput = document.getElementById("news-country-filter");
  if (!panel || !selectedContainer || !listContainer || !articleContainer) {
    return;
  }

  const filterText = normalizeText(filterInput?.value || "");
  const countries = Object.entries(countriesData)
    .map(([code, country]) => ({ code, country }))
    .filter(({ country }) => {
      if (!filterText) {
        return true;
      }
      return normalizeText(country.name).includes(filterText)
        || normalizeText(country.general?.officialName || "").includes(filterText);
    })
    .sort((a, b) => a.country.name.localeCompare(b.country.name, "es"));

  const selected = selectedCode && countriesData[selectedCode] ? countriesData[selectedCode] : null;

  selectedContainer.innerHTML = selected
    ? `
      <div class="news-hub-selected-card">
        <strong>${escapeHtml(selected.name)}</strong>
        <div class="news-hub-meta">${escapeHtml(selected.general?.officialName || selected.name)}</div>
        <div class="news-source-links">${getCountryNewsPortalLinks(selected).map(link => `<a class="news-link" href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}</div>
      </div>
    `
    : "";

  if (!panel.open) {
    articleContainer.innerHTML = "";
    listContainer.innerHTML = "";
    return;
  }

  articleContainer.innerHTML = "";
  const priorityCode = selectedCode || activeNewsCountryCode;
  const prioritizedCountries = priorityCode
    ? [
        ...countries.filter(item => item.code === priorityCode),
        ...countries.filter(item => item.code !== priorityCode)
      ]
    : countries;
  const listLimit = filterText ? 48 : (isMobileLayout() ? 18 : 32);
  const visibleCountries = prioritizedCountries.slice(0, listLimit);
  const listMarkup = typeof newsUi.buildNewsList === "function"
    ? newsUi.buildNewsList(
        visibleCountries,
        activeNewsCountryCode,
        escapeHtml,
        getCountryNewsUrl,
        {
          openLabel: currentLanguage === "en" ? "External search" : "Busqueda externa",
          emptyLabel: currentLanguage === "en" ? "No countries match this filter." : "No hay paises para este filtro."
        }
      )
    : visibleCountries.map(({ code, country }) => `
        <div class="news-hub-item${code === activeNewsCountryCode ? " is-active" : ""}">
          <button type="button" class="news-link-block" data-news-country="${escapeHtml(code)}">
            <strong>${escapeHtml(country.name)}</strong>
            <span class="news-hub-meta">${escapeHtml(country.general?.officialName || country.name)}</span>
          </button>
          <a class="news-external-link" href="${getCountryNewsUrl(country)}" target="_blank" rel="noreferrer">
            ${currentLanguage === "en" ? "External search" : "Busqueda externa"}
          </a>
        </div>
      `).join("");
  const hiddenCount = Math.max(0, countries.length - visibleCountries.length);
  listContainer.innerHTML = `${listMarkup}${hiddenCount ? `
    <p class="news-hub-meta news-list-window-note">
      ${currentLanguage === "en"
        ? `Showing ${visibleCountries.length} of ${countries.length}. Use the country filter to narrow the list.`
        : `Mostrando ${visibleCountries.length} de ${countries.length}. Usa el filtro de pais para acotar la lista.`}
    </p>
  ` : ""}`;
}

function setTheme(theme) {
  const nextTheme = theme || "default";
  const themeChanged = nextTheme !== currentTheme;
  currentTheme = nextTheme;
  appStore?.setState({ theme: currentTheme }, "theme");
  if (themeChanged) {
    countryStyleCache.clear();
    lastStyleRefreshSignature = "";
    refreshCountryStyles();
  }
  renderThemeLegend();
  renderThemeSummary();
  syncThemeToolbarState();
}

function getThemePickerHint(theme) {
  const langIndex = currentLanguage === "en" ? 1 : 0;
  return (THEME_PICKER_HINTS[theme] || ["", ""])[langIndex] || "";
}

function getThemeLayerKind(theme) {
  if (theme === "default") {
    return currentLanguage === "en" ? "Base" : "Base";
  }
  const metric = getThemeMetricConfig(theme);
  if (!metric) {
    return currentLanguage === "en" ? "Category" : "Categoria";
  }
  return metric.estimated
    ? (currentLanguage === "en" ? "Proxy" : "Proxy")
    : (currentLanguage === "en" ? "Data" : "Dato");
}

const THEME_PICKER_GROUPS = [
  { key: "base", es: "Base", en: "Base", items: ["default", "continent", "religion", "politics", "formationYear", "historyType"] },
  { key: "people", es: "Poblacion y sociedad", en: "People and society", items: ["population", "density", "urbanization", "lifeExpectancy", "populationGrowth", "religionBranch", "religionDiversity", "languageDiversity"] },
  { key: "economy", es: "Economia", en: "Economy", items: ["gdp", "gdpPerCapita", "gdpPpp", "inflation", "inflationHistory", "unemployment", "debt", "exportBreadth", "exportVolume", "industryBreadth", "capitalShare", "naturalResources"] },
  { key: "risk", es: "Riesgo y relaciones", en: "Risk and relations", items: ["geopoliticalIndex", "riskRadar", "riskMilitary", "riskEconomic", "riskDiplomatic", "riskInternal", "riskTerritorial", "qualityScore", "diplomaticReach", "exMetropole", "bloc", "conflicts", "organizations", "rivals", "militaryActive", "militarySpending"] }
];

const THEME_PICKER_HINTS = {
  default: ["Mapa base", "Base map"],
  continent: ["Region", "Region"],
  religion: ["Creencias", "Beliefs"],
  politics: ["Gobierno", "Government"],
  formationYear: ["Historia", "History"],
  historyType: ["Origen", "Origin"],
  population: ["Habitantes", "People"],
  density: ["Hab/km2", "People/km2"],
  urbanization: ["Ciudades", "Cities"],
  lifeExpectancy: ["Estimado", "Estimate"],
  populationGrowth: ["Tendencia", "Trend"],
  religionBranch: ["Denominacion", "Branch"],
  religionDiversity: ["Mezcla", "Mix"],
  languageDiversity: ["Idiomas", "Languages"],
  gdp: ["Tamano", "Size"],
  gdpPerCapita: ["Ingreso", "Income"],
  gdpPpp: ["Proxy", "Proxy"],
  inflation: ["Precios", "Prices"],
  inflationHistory: ["Proxy", "Proxy"],
  unemployment: ["Estimado", "Estimate"],
  debt: ["Estimado", "Estimate"],
  exportBreadth: ["Canasta", "Basket"],
  exportVolume: ["Estimado", "Estimate"],
  industryBreadth: ["Sectores", "Sectors"],
  capitalShare: ["Capital", "Capital"],
  naturalResources: ["Perfil", "Profile"],
  geopoliticalIndex: ["Indice", "Index"],
  riskRadar: ["General", "Overall"],
  riskMilitary: ["Militar", "Military"],
  riskEconomic: ["Economico", "Economic"],
  riskDiplomatic: ["Diplomatico", "Diplomatic"],
  riskInternal: ["Interno", "Internal"],
  riskTerritorial: ["Territorial", "Territorial"],
  qualityScore: ["Calidad", "Quality"],
  diplomaticReach: ["Vinculos", "Links"],
  exMetropole: ["Historia", "History"],
  bloc: ["Alianzas", "Alliances"],
  conflicts: ["Guerras", "Wars"],
  organizations: ["Membresias", "Memberships"],
  rivals: ["Rivales", "Rivals"],
  militaryActive: ["Tropas", "Troops"],
  militarySpending: ["Gasto", "Spending"]
};

function getThemeOptionLabel(theme) {
  return Array.from(document.getElementById("theme-select")?.options || [])
    .find(option => option.value === theme)
    ?.textContent
    ?.trim() || theme;
}

function syncLayersPanelState() {
  const toolbar = document.getElementById("map-toolbar");
  const isOpen = Boolean(toolbar?.open);
  document.body.classList.toggle("layers-panel-open", isOpen);
  if (isOpen) {
    ["compare-hub-panel", "quiz-hub-panel", "news-hub-panel"].forEach(id => {
      const panel = document.getElementById(id);
      if (panel) panel.open = false;
    });
    closeMobileMoreMenu?.();
  }
}

function syncThemeToolbarState() {
  const select = document.getElementById("theme-select");
  if (select && select.value !== currentTheme) {
    select.value = currentTheme;
  }
  const activeLabel = getThemeOptionLabel(currentTheme);
  const activeHint = getThemePickerHint(currentTheme);
  const activeKind = getThemeLayerKind(currentTheme);
  const activeSummary = document.getElementById("layers-summary-active");
  if (activeSummary) {
    activeSummary.textContent = activeLabel;
  }
  const activeContext = document.getElementById("layers-active-context");
  const activeContextLabel = document.getElementById("layers-active-label");
  const activeContextNote = document.getElementById("layers-active-note");
  if (activeContext) {
    activeContext.dataset.layerKind = normalizeText(activeKind);
  }
  if (activeContextLabel) {
    activeContextLabel.textContent = activeLabel;
  }
  if (activeContextNote) {
    activeContextNote.textContent = activeHint ? `${activeKind} - ${activeHint}` : activeKind;
  }
  document.querySelectorAll("[data-theme-picker]").forEach(button => {
    const active = button.dataset.themePicker === currentTheme;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderThemePicker() {
  const grid = document.getElementById("theme-quick-grid");
  if (!grid) return;
  const query = normalizeText(document.getElementById("theme-filter-input")?.value || "");
  const groups = THEME_PICKER_GROUPS.map(group => {
    const buttons = group.items
      .map(theme => ({
        theme,
        label: getThemeOptionLabel(theme),
        hint: getThemePickerHint(theme),
        kind: getThemeLayerKind(theme)
      }))
      .filter(item => !query || normalizeText(`${item.label} ${item.hint}`).includes(query))
      .map(item => `
        <button type="button" class="theme-picker-button" data-theme-picker="${escapeHtml(item.theme)}" aria-pressed="${item.theme === currentTheme}" aria-label="${escapeHtml(`${item.label}: ${item.hint || item.kind}`)}" title="${escapeHtml(`${item.label} - ${item.hint || item.kind}`)}">
          <span>${escapeHtml(item.label)}</span>
          <small>${escapeHtml(item.hint)}</small>
          <i>${escapeHtml(item.kind)}</i>
        </button>
      `)
      .join("");
    return buttons ? `<div class="theme-picker-group"><strong>${escapeHtml(currentLanguage === "en" ? group.en : group.es)}</strong><div class="theme-picker-buttons">${buttons}</div></div>` : "";
  }).join("");
  grid.innerHTML = groups || `<p class="legend-note">${currentLanguage === "en" ? "No matching layers." : "No hay capas que coincidan."}</p>`;
  syncThemeToolbarState();
}

function renderGroupSelection(title, descriptor, countries) {
  const timelineFilter =
    currentPanelState.type === "group" && currentPanelState.title === title
      ? (currentPanelState.timelineFilter || "all")
      : "all";
  const timelineCentury =
    currentPanelState.type === "group" && currentPanelState.title === title
      ? (currentPanelState.timelineCentury || "all")
      : "all";
  const timelineIntensity =
    currentPanelState.type === "group" && currentPanelState.title === title
      ? (currentPanelState.timelineIntensity || "all")
      : "all";
  const timelineRelevance =
    currentPanelState.type === "group" && currentPanelState.title === title
      ? (currentPanelState.timelineRelevance || "all")
      : "all";
  const timelineMode =
    currentPanelState.type === "group" && currentPanelState.title === title
      ? (currentPanelState.timelineMode || "full")
      : "full";
  currentPanelState = { type: "group", title, descriptor, countries, timelineFilter, timelineCentury, timelineIntensity, timelineRelevance, timelineMode };
  const totalPopulation = countries.reduce((sum, country) => sum + (country.general?.population || 0), 0);
  const avgGdpPerCapita = countries.length
    ? countries.reduce((sum, country) => sum + (country.economy?.gdpPerCapita || 0), 0) / countries.length
    : 0;
  const totalOrganizations = countries.reduce((sum, country) => sum + getCountryOrganizationCount(country), 0);
  const totalConflicts = countries.reduce((sum, country) => sum + getCountryConflictCount(country), 0);
  const aggregateTimeline = buildAggregateTimeline(countries, title);
  document.getElementById("country-panel").innerHTML = `
    <h2>${title}</h2>
    <div class="country-overview-grid relation-overview-grid">
      <div class="overview-card">
        <span class="overview-label">${currentLanguage === "en" ? "Population" : "Poblacion"}</span>
        <strong class="overview-value">${formatNumber(totalPopulation)}</strong>
      </div>
      <div class="overview-card">
        <span class="overview-label">${currentLanguage === "en" ? "Average GDP per capita" : "PBI per capita promedio"}</span>
        <strong class="overview-value">${avgGdpPerCapita ? `US$ ${formatNumber(Math.round(avgGdpPerCapita))}` : t("noData")}</strong>
      </div>
      <div class="overview-card">
        <span class="overview-label">${currentLanguage === "en" ? "Organizations" : "Organizaciones"}</span>
        <strong class="overview-value">${formatNumber(totalOrganizations)}</strong>
      </div>
      <div class="overview-card">
        <span class="overview-label">${currentLanguage === "en" ? "Conflicts" : "Conflictos"}</span>
        <strong class="overview-value">${formatNumber(totalConflicts)}</strong>
      </div>
    </div>
    <p><b>${currentLanguage === "en" ? "Shown total population" : "Poblacion total mostrada"}:</b> ${formatNumber(totalPopulation)}</p>
    <p><b>${currentLanguage === "en" ? "Countries and territories found" : "Paises y territorios encontrados"}:</b> ${countries.length}</p>
    <p><b>${descriptor}:</b></p>
    ${renderCountryActionList(countries, country => country.continent ? translateContinentName(country.continent) : "")}
    <p><b>${currentLanguage === "en" ? "Shared timeline" : "Timeline compartido"}:</b></p>
    ${renderTimelineCollection(aggregateTimeline)}
  `;
  renderNewsHub();

  openCountryModal();
}

function buildTimeline(country) {
  const items = [];
  const countryCode = getCountryCodeByObject(country);
  if (country.history?.year) {
    items.push({
      year: country.history.year,
      category: currentLanguage === "en" ? "Formation" : "Formacion",
      categoryKey: "formation",
      text: `${country.history.type || t("noData")} desde ${country.history.origin || t("noData")}`,
      reference: country.history.origin || country.name,
      contextLabel: country.name
    });
  }

  const organizations = (country.politics?.organizations || [])
    .filter(item => item && item.startYear)
    .sort((a, b) => a.startYear - b.startYear)
    .map(item => ({
      year: item.startYear,
      category: currentLanguage === "en" ? "Organization" : "Organizacion",
      categoryKey: "organization",
      text: `Ingreso a ${getOrganizationDisplayName(item)}`,
      reference: getOrganizationDisplayName(item),
      contextLabel: country.name,
      intensity: "media"
    }));

  items.push(...organizations.slice(0, 10));

  const normalizedConflicts = getConflictsSinceFormation(country)
    .map(normalizeConflictForDisplay)
    .filter(conflict => conflict?.startYear)
    .sort((a, b) => a.startYear - b.startYear);

  normalizedConflicts.slice(0, 10).forEach(conflict => {
    items.push({
      year: conflict.startYear,
      category: currentLanguage === "en" ? "Conflict" : "Conflicto",
      categoryKey: "conflict",
      text: `${conflict.ongoing ? "Conflicto vigente" : "Conflicto"}: ${conflict.name}`,
      reference: conflict.name,
      contextLabel: country.name,
      intensity: "alta"
    });
  });

  if (country.politics?.system && country.history?.year) {
    items.push({
      year: country.history.year,
      category: currentLanguage === "en" ? "System" : "Sistema",
      categoryKey: "system",
      text: `${currentLanguage === "en" ? "Current political system" : "Sistema politico actual"}: ${country.politics.system}`,
      reference: country.politics.system,
      contextLabel: country.name,
      intensity: "media"
    });
  }

  (country.history?.events || []).forEach(event => {
    if (!event?.year || !event?.text) {
      return;
    }

      const categoryMap = {
        politica: "system",
        cambioregimen: "system",
        cambio_regimen: "system",
        constitucion: "constitution",
        estado: "formation",
        union: "formation",
        revolucion: "formation",
        golpe: "coup",
      guerra: "conflict",
      conflicto: "conflict",
      constituyente: "constitution",
      tratado: "treaty",
        acuerdo: "organization",
        division: "secession",
        secesion: "secession",
        independencia: "secession",
        anexion: "annexation",
        descolonizacion: "formation",
      reforma: "system",
      territorio: "annexation",
      disolucion: "formation",
      imperio: "formation",
      economia: "organization"
    };

    items.push({
      year: event.year,
      category: getTimelineCategoryLabel(categoryMap[normalizeText(event.category)] || "formation", toDisplayTitleCase(event.category || (currentLanguage === "en" ? "Event" : "Evento"))),
      categoryKey: categoryMap[normalizeText(event.category)] || "formation",
      text: event.text,
      reference: event.reference || event.text,
      contextLabel: country.name,
      intensity: event.intensity || undefined
    });
  });

  (CURATED_TIMELINE_EXTRAS[countryCode] || []).forEach(event => {
    items.push({
      year: event.year,
      category: getTimelineCategoryLabel({
        revolucion: "formation",
        descolonizacion: "formation",
        union: "formation",
        division: "secession",
        constitucion: "constitution",
        golpe: "coup",
        politica: "system",
        reforma: "system",
        territorio: "annexation",
        guerra: "conflict",
        disolucion: "formation"
      }[normalizeText(event.category)] || "formation", toDisplayTitleCase(event.category || (currentLanguage === "en" ? "Event" : "Evento"))),
      categoryKey: {
        revolucion: "formation",
        descolonizacion: "formation",
        union: "formation",
        division: "secession",
        constitucion: "constitution",
        golpe: "coup",
        politica: "system",
        reforma: "system",
        territorio: "annexation",
        guerra: "conflict",
        disolucion: "formation"
      }[normalizeText(event.category)] || "formation",
      text: event.text,
      reference: event.reference || event.text,
      contextLabel: country.name,
      intensity: event.intensity || undefined
    });
  });

  return items
    .filter(item => item.year && item.text)
    .map(item => {
      const enriched = {
        ...item,
        century: getTimelineCentury(item.year),
        intensity: item.intensity || getTimelineIntensity(item),
        relevance: item.relevance || getTimelineRelevance(item)
      };
      return typeof timelineConflictUi.normalizeTimelineEvent === "function"
        ? timelineConflictUi.normalizeTimelineEvent(enriched, { language: currentLanguage, conflicts: normalizedConflicts })
        : enriched;
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return String(a.text).localeCompare(String(b.text), "es");
    })
    .filter((item, index, list) =>
      index === list.findIndex(other =>
        other.year === item.year &&
        normalizeText(other.text) === normalizeText(item.text)
      )
    );
}

function buildAggregateTimeline(countries, label = "") {
  return countries
    .flatMap(country => buildTimeline(country).map(item => ({
      ...item,
      contextLabel: label || country.name,
      countryName: country.name,
      text: label ? `${country.name}: ${item.text}` : item.text,
      relevance: item.relevance || getTimelineRelevance(item)
    })))
    .sort((a, b) => {
      const relevanceWeight = { alta: 3, media: 2, baja: 1 };
      const relevanceDiff = (relevanceWeight[normalizeText(b.relevance)] || 0) - (relevanceWeight[normalizeText(a.relevance)] || 0);
      if (relevanceDiff !== 0) {
        return relevanceDiff;
      }
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return String(a.text).localeCompare(String(b.text), "es");
    })
    .filter((item, index, list) =>
      index === list.findIndex(other =>
        other.year === item.year &&
        normalizeText(other.reference || other.text) === normalizeText(item.reference || item.text) &&
        normalizeText(other.countryName || "") === normalizeText(item.countryName || "")
      )
    )
    .slice(0, 48);
}

function filterTimelineItems(items) {
  const activeType = currentPanelState.timelineFilter || "all";
  const activeCentury = currentPanelState.timelineCentury || "all";
  const activeIntensity = currentPanelState.timelineIntensity || "all";
  const activeRelevance = currentPanelState.timelineRelevance || "all";
  const filters = {
    timelineFilter: activeType,
    timelineCentury: activeCentury,
    timelineIntensity: activeIntensity,
    timelineRelevance: activeRelevance
  };

  if (typeof timelineConflictUi.filterTimelineEvents === "function") {
    return timelineConflictUi.filterTimelineEvents(items, filters);
  }

  return items.filter(item => {
    if (activeType !== "all" && item.categoryKey !== activeType) {
      return false;
    }
    if (activeCentury !== "all" && normalizeText(item.century) !== normalizeText(activeCentury)) {
      return false;
    }
    if (activeIntensity !== "all" && normalizeText(item.intensity) !== normalizeText(activeIntensity)) {
      return false;
    }
    if (activeRelevance !== "all" && normalizeText(item.relevance) !== normalizeText(activeRelevance)) {
      return false;
    }
    return true;
  });
}

function renderTimelineControls(items) {
  const activeType = currentPanelState.timelineFilter || "all";
  const activeCentury = currentPanelState.timelineCentury || "all";
  const activeIntensity = currentPanelState.timelineIntensity || "all";
  const activeRelevance = currentPanelState.timelineRelevance || "all";
  const activeMode = currentPanelState.timelineMode || "full";

  const typeFilters = [
    { key: "all", label: currentLanguage === "en" ? "All" : "Todo" },
    { key: "formation", label: currentLanguage === "en" ? "Formation" : "Formacion" },
    { key: "organization", label: currentLanguage === "en" ? "Organizations" : "Organizaciones" },
    { key: "economy", label: currentLanguage === "en" ? "Economy" : "Economia" },
    { key: "conflict", label: currentLanguage === "en" ? "Conflicts" : "Conflictos" },
    { key: "system", label: currentLanguage === "en" ? "System" : "Sistema" },
    { key: "constitution", label: currentLanguage === "en" ? "Constitutions" : "Constituciones" },
    { key: "treaty", label: currentLanguage === "en" ? "Treaties" : "Tratados" },
    { key: "coup", label: currentLanguage === "en" ? "Coups" : "Golpes" },
    { key: "secession", label: currentLanguage === "en" ? "Secessions" : "Secesiones" },
    { key: "annexation", label: currentLanguage === "en" ? "Annexations" : "Anexiones" }
  ].filter(filter => filter.key === "all" || items.some(item => item.categoryKey === filter.key));

  const centuryFilters = [
    { key: "all", label: currentLanguage === "en" ? "All centuries" : "Todos los siglos" },
    ...[...new Set(items.map(item => item.century).filter(Boolean))].map(century => ({ key: century, label: century }))
  ];

  const intensityFilters = [
    { key: "all", label: currentLanguage === "en" ? "Any impact" : "Cualquier impacto" },
    ...[...new Set(items.map(item => item.intensity).filter(Boolean))].map(intensity => ({
      key: intensity,
      label: getTimelineIntensityLabel(intensity)
    }))
  ];

  const relevanceFilters = [
    { key: "all", label: currentLanguage === "en" ? "Any relevance" : "Cualquier relevancia" },
    ...[...new Set(items.map(item => item.relevance).filter(Boolean))].map(relevance => ({
      key: relevance,
      label: getTimelineRelevanceLabel(relevance)
    }))
  ];
  const modeFilters = [
    { key: "full", label: currentLanguage === "en" ? "Full timeline" : "Timeline completo" },
    { key: "teaching", label: currentLanguage === "en" ? "Class timeline" : "Timeline docente" }
  ];

  return `
    <div class="timeline-filters">
      ${typeFilters.map(filter => `
        <button type="button" class="timeline-filter${filter.key === activeType ? " is-active" : ""}" data-timeline-filter="${filter.key}">${escapeHtml(filter.label)}</button>
      `).join("")}
    </div>
    <div class="timeline-filters timeline-filters-secondary">
      ${centuryFilters.map(filter => `
        <button type="button" class="timeline-filter${filter.key === activeCentury ? " is-active" : ""}" data-timeline-century="${escapeHtml(filter.key)}">${escapeHtml(filter.label)}</button>
      `).join("")}
    </div>
    <div class="timeline-filters timeline-filters-secondary">
      ${intensityFilters.map(filter => `
        <button type="button" class="timeline-filter${filter.key === activeIntensity ? " is-active" : ""}" data-timeline-intensity="${escapeHtml(filter.key)}">${escapeHtml(filter.label)}</button>
      `).join("")}
    </div>
    <div class="timeline-filters timeline-filters-secondary">
      ${relevanceFilters.map(filter => `
        <button type="button" class="timeline-filter${filter.key === activeRelevance ? " is-active" : ""}" data-timeline-relevance="${escapeHtml(filter.key)}">${escapeHtml(filter.label)}</button>
      `).join("")}
    </div>
    <div class="timeline-filters timeline-filters-secondary">
      ${modeFilters.map(filter => `
        <button type="button" class="timeline-filter${filter.key === activeMode ? " is-active" : ""}" data-timeline-mode="${escapeHtml(filter.key)}">${escapeHtml(filter.label)}</button>
      `).join("")}
    </div>
  `;
}

function renderTimelineAggregateSummary(items) {
  const counts = {
    constitution: 0,
    coup: 0,
    treaty: 0,
    annexation: 0,
    secession: 0,
    system: 0,
    formation: 0,
    conflict: 0
  };

  items.forEach(item => {
    if (counts[item.categoryKey] !== undefined) {
      counts[item.categoryKey] += 1;
    }
  });

  const summaryItems = [
    { key: "constitution", label: currentLanguage === "en" ? "Constitutions" : "Constituciones" },
    { key: "coup", label: currentLanguage === "en" ? "Coups" : "Golpes" },
    { key: "treaty", label: currentLanguage === "en" ? "Treaties" : "Tratados" },
    { key: "annexation", label: currentLanguage === "en" ? "Annexations" : "Anexiones" },
    { key: "secession", label: currentLanguage === "en" ? "Secessions" : "Secesiones" },
    { key: "system", label: currentLanguage === "en" ? "Regime / reform" : "Regimen / reforma" },
    { key: "formation", label: currentLanguage === "en" ? "Formation / union" : "Formacion / union" },
    { key: "conflict", label: currentLanguage === "en" ? "Conflicts" : "Conflictos" }
  ].filter(item => counts[item.key] > 0);

  if (!summaryItems.length) {
    return "";
  }

  return `
    <div class="country-meta-ribbon timeline-summary-ribbon">
      ${summaryItems.map(item => `<span class="country-meta-pill"><b>${escapeHtml(item.label)}:</b> ${formatNumber(counts[item.key])}</span>`).join("")}
    </div>
  `;
}

function renderTimelineCollection(items, contextCountry = null) {
  const controls = renderTimelineControls(items);
  const preparedItems = typeof timelineConflictUi.groupRepeatedEvents === "function"
    ? timelineConflictUi.groupRepeatedEvents(items)
    : items;
  const filtered = filterTimelineItems(preparedItems);
  const aggregateSummary = !contextCountry && items.some(item => item.countryName) ? renderTimelineAggregateSummary(items) : "";
  const renderWindow = typeof timelineConflictUi.getTimelineRenderWindow === "function"
    ? timelineConflictUi.getTimelineRenderWindow(filtered, { mode: currentPanelState.timelineMode || "full" })
    : { visible: filtered.slice(0, 72), hiddenCount: Math.max(filtered.length - 72, 0), total: filtered.length };
  const stats = typeof timelineConflictUi.getTimelineStats === "function" ? timelineConflictUi.getTimelineStats(filtered) : null;

  if (!filtered.length) {
    return `${controls}${aggregateSummary}<p>${t("noData")}</p>`;
  }

  return `${controls}${aggregateSummary}${stats ? `<p class="timeline-window-note">${currentLanguage === "en" ? "Filtered events" : "Eventos filtrados"}: ${formatNumber(stats.total)}${stats.weakText ? ` · ${currentLanguage === "en" ? "weak texts" : "textos debiles"}: ${formatNumber(stats.weakText)}` : ""}</p>` : ""}<div class="timeline">${renderWindow.visible
    .map(item => {
      const modalKey = registerTimelineModal(item, item.contextLabel || contextCountry?.name || "");
      const groupedLabel = item.groupedCount > 1
        ? ` · ${currentLanguage === "en" ? "grouped" : "agrupados"}: ${formatNumber(item.groupedCount)}`
        : "";
      const refsLabel = item.references?.length
        ? ` · ${currentLanguage === "en" ? "refs" : "refs"}: ${formatNumber(item.references.length)}`
        : "";
      return `
        <button class="timeline-item network-link" type="button" data-timeline-key="${modalKey}" style="--accent:${getTimelineCategoryAccent(item.categoryKey)};">
          <span class="timeline-year">${item.year}</span>
          <span class="timeline-copy">
            <span class="timeline-kicker">${escapeHtml(item.category || (currentLanguage === "en" ? "Event" : "Evento"))} · ${escapeHtml(item.century || "")} · ${escapeHtml(getTimelineIntensityLabel(item.intensity))} · ${escapeHtml(getTimelineRelevanceLabel(item.relevance || getTimelineRelevance(item)))}${escapeHtml(groupedLabel)}${escapeHtml(refsLabel)}</span>
            <span>${escapeHtml(item.text)}</span>
          </span>
        </button>
      `;
    })
    .join("")}</div>${renderWindow.hiddenCount ? `<p class="timeline-window-note">${currentLanguage === "en" ? "Rendering paused to keep the panel responsive. Hidden events" : "Render pausado para mantener la ficha fluida. Eventos ocultos"}: ${formatNumber(renderWindow.hiddenCount)}</p>` : ""}`;
}

function renderTimeline(country) {
  return renderTimelineCollection(buildTimeline(country), country);
}

function buildCompareTimelineSummary(compareCodes) {
  if (!Array.isArray(compareCodes) || compareCodes.length < 2) {
    return "";
  }

  const rows = compareCodes
    .map(code => {
      const country = countriesData[code];
      if (!country) {
        return null;
      }
      const timelineItems = buildTimeline(country);
      const topEvents = timelineItems
        .slice()
        .sort((a, b) => getTimelineIntensityWeight(b.intensity) - getTimelineIntensityWeight(a.intensity) || (b.year || 0) - (a.year || 0))
        .slice(0, 3);
      const conflictCount = getCountryConflictCount(country);
      return `
        <div class="compare-benchmark-card compare-timeline-card">
          <strong>${escapeHtml(country.name)}</strong>
          <span>${currentLanguage === "en" ? "High-impact milestones" : "Hitos de mayor impacto"}: ${formatNumber(topEvents.length)}</span>
          <span>${currentLanguage === "en" ? "Conflicts in profile" : "Conflictos en perfil"}: ${formatNumber(conflictCount)}</span>
          <div class="compare-mini-list">
            ${topEvents.map(item => `<span>${escapeHtml(`${item.year}: ${item.reference || item.text}`)}</span>`).join("")}
          </div>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  if (!rows) {
    return "";
  }

  return `
    <div class="compare-row compare-summary-row">
      <strong>${currentLanguage === "en" ? "Timeline and conflict profile" : "Perfil temporal y conflictivo"}</strong>
      <div class="compare-benchmark-grid">
        ${rows}
      </div>
    </div>
  `;
}

function renderRelationChips(items) {
  const cleanItems = (items || []).filter(Boolean);
  if (!cleanItems.length) {
    return `<p>${t("noData")}</p>`;
  }

  return `<div class="relation-chips">${cleanItems
    .map(item => `<button type="button" class="relation-chip" data-search-query="${escapeHtml(item)}">${escapeHtml(item)}</button>`)
    .join("")}</div>`;
}

function getCountryCodeByObject(country) {
  if (!country) {
    return "";
  }
  const directCode = countryCodeLookup.get(country) || String(country.code || "").trim();
  const normalizedDirectCode = directCode.toUpperCase();
  if (directCode && countriesData[directCode]) {
    return directCode;
  }
  if (normalizedDirectCode && countriesData[normalizedDirectCode]) {
    return normalizedDirectCode;
  }
  return resolveCountryCode("", country.name || country.general?.officialName || "") || "";
}

function getRankedCountryCode(country) {
  return getCountryCodeByObject(country) ||
    resolveCountryCode("", country?.name) ||
    getCountryEntries().find(([, item]) =>
      item === country || normalizeText(item?.name) === normalizeText(country?.name)
    )?.[0] ||
    "";
}

function getCountrySelectionLayers(code, fallbackName = "") {
  const resolvedCode = resolveCountryCode(code, fallbackName) || String(code || "").trim();
  const linkedCodes = getLinkedCodes(resolvedCode).concat(getLinkedCodes(code));
  const layers = linkedCodes
    .map(item => getCountryLayerByCodeOrName(item, fallbackName))
    .filter(Boolean);
  return uniqueBy(layers, layer => layer.code || layer.featureName);
}

function focusCountrySelectionLayers(layers, { focusMap = true } = {}) {
  if (!layers.length) {
    return false;
  }
  setCountrySelection(layers);
  if (focusMap) {
    fitLayerBounds(createLayerGroup(layers));
  }
  return true;
}

let pendingCountryLayerReadyPromise = null;
let countrySelectionRequestId = 0;

async function ensureCountryLayersReady() {
  if (countryLayers.size) {
    return true;
  }

  if (!pendingCountryLayerReadyPromise) {
    pendingCountryLayerReadyPromise = loadMap(false)
      .catch(error => {
        console.warn("No se pudieron preparar las capas del mapa para seleccionar paises:", error);
        return null;
      })
      .finally(() => {
        pendingCountryLayerReadyPromise = null;
      });
  }

  await pendingCountryLayerReadyPromise;
  return countryLayers.size > 0;
}

function selectCountryLayersWhenReady(code, fallbackName = "", options = {}) {
  const requestId = ++countrySelectionRequestId;
  const applySelection = () => {
    if (requestId !== countrySelectionRequestId) {
      return false;
    }
    const selected = focusCountrySelectionLayers(getCountrySelectionLayers(code, fallbackName), options);
    if (!selected) {
      clearSelection();
    }
    return selected;
  };

  if (countryLayers.size) {
    return applySelection();
  }

  ensureCountryLayersReady().then(ready => {
    if (!ready) {
      return;
    }
    applySelection();
    requestMapRenderSafe("country-selection-ready");
  });
  return false;
}

async function openCountryByCode(rawCode, fallbackName = "", options = {}) {
  const code = resolveCountryCode(rawCode, fallbackName) || String(rawCode || "").trim();
  if (!code) {
    renderEmpty(fallbackName || (currentLanguage === "en" ? "Country not found" : "Pais no encontrado"));
    return false;
  }

  const country = countriesData[code] || await loadCountryDetail(code);
  if (!country) {
    renderEmpty(fallbackName || code);
    return false;
  }

  selectCountryLayersWhenReady(code, country.name || fallbackName, options);
  await renderCountry(country, fallbackName || country.name || code);
  requestMapRenderSafe("open-country");
  return true;
}

async function selectRankedCountry(country) {
  const code = getRankedCountryCode(country);
  await openCountryByCode(code, country?.name || "");
}

function collectRelationGroups(country, countryCode) {
  const relations = country.politics?.relations || {};
  const organizations = (country.politics?.organizations || []).map(getOrganizationDisplayName);
  const rivals = (country.politics?.rivals || []);
  const currentRivals = uniqueNormalizedList([
    ...(relations.currentRivals || []),
    ...rivals.filter(rival => rival.type === "actual").map(rival => rival.name || rival)
  ]);
  const historicalRivals = uniqueNormalizedList([
    ...(relations.historicalRivals || []),
    ...rivals.filter(rival => (rival.type || "historico") !== "actual").map(rival => rival.name || rival)
  ]);
  const linkedTerritories = uniqueNormalizedList([
    ...(relations.associatedTerritories || relations.linkedTerritories || []),
    ...getLinkedCodes(countryCode)
      .filter(code => code !== countryCode)
      .map(code => countriesData[code]?.name)
      .filter(Boolean)
  ]);

  return {
    exMetropole: relations.exMetropole ? [relations.exMetropole] : [],
    exColonies: uniqueNormalizedList(relations.exColonies || []),
    linkedTerritories,
    militaryBlocs: uniqueNormalizedList(relations.militaryBlocs || []),
    economicBlocs: uniqueNormalizedList(relations.economicBlocs || []),
    diplomaticBlocs: uniqueNormalizedList(relations.diplomaticBlocs || []),
    militaryAllies: uniqueNormalizedList(relations.militaryAllies || []),
    economicPartners: uniqueNormalizedList(relations.economicPartners || []),
    diplomaticPartners: uniqueNormalizedList(relations.diplomaticPartners || []),
    dependencies: uniqueNormalizedList(relations.dependencies || relations.protectorates || []),
    disputes: uniqueNormalizedList(relations.disputedTerritories || relations.disputes || []),
    currentRivals,
    historicalRivals,
    organizations: uniqueNormalizedList(organizations)
  };
}

function renderRelationCrosswalk(country, countryCode) {
  const peers = compareSelection.filter(code => code && code !== countryCode && countriesData[code]).slice(0, 2);
  if (!peers.length) {
    return "";
  }

  const sourceGroups = collectRelationGroups(country, countryCode);
  const compareCards = peers.map(code => {
    const peer = countriesData[code];
    const peerGroups = collectRelationGroups(peer, code);
    const sharedBlocs = uniqueNormalizedList([
      ...sourceGroups.militaryBlocs.filter(item => peerGroups.militaryBlocs.includes(item)),
      ...sourceGroups.economicBlocs.filter(item => peerGroups.economicBlocs.includes(item)),
      ...sourceGroups.diplomaticBlocs.filter(item => peerGroups.diplomaticBlocs.includes(item))
    ]);
    const sharedPartners = uniqueNormalizedList([
      ...sourceGroups.militaryAllies.filter(item => peerGroups.militaryAllies.includes(item)),
      ...sourceGroups.economicPartners.filter(item => peerGroups.economicPartners.includes(item)),
      ...sourceGroups.diplomaticPartners.filter(item => peerGroups.diplomaticPartners.includes(item))
    ]);
    const sharedRivals = uniqueNormalizedList([
      ...sourceGroups.currentRivals.filter(item => peerGroups.currentRivals.includes(item)),
      ...sourceGroups.historicalRivals.filter(item => peerGroups.historicalRivals.includes(item))
    ]);

    return `
      <div class="relation-network-group">
        <div class="relation-network-title">${getFlagEmoji(code)} ${escapeHtml(peer.name)}</div>
        <div class="network-links">
          <span class="network-label">${currentLanguage === "en" ? "Shared blocs" : "Bloques en comun"}:</span>
          ${sharedBlocs.length ? sharedBlocs.map(item => `<button type="button" class="network-link" data-search-query="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("") : `<span class="network-link network-link-muted">${t("noData")}</span>`}
        </div>
        <div class="network-links">
          <span class="network-label">${currentLanguage === "en" ? "Shared partners" : "Socios en comun"}:</span>
          ${sharedPartners.length ? sharedPartners.map(item => `<button type="button" class="network-link" data-search-query="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("") : `<span class="network-link network-link-muted">${t("noData")}</span>`}
        </div>
        <div class="network-links">
          <span class="network-label">${currentLanguage === "en" ? "Shared rivals" : "Rivales en comun"}:</span>
          ${sharedRivals.length ? sharedRivals.map(item => `<button type="button" class="network-link" data-search-query="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("") : `<span class="network-link network-link-muted">${t("noData")}</span>`}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="relation-network relation-network-compare">
      <div class="network-center">${currentLanguage === "en" ? "Cross-country exploration" : "Exploracion cruzada entre paises"}</div>
      <div class="relation-network-groups">${compareCards}</div>
    </div>
  `;
}

function renderRelationNetwork(country, countryCode) {
  const relationGroups = collectRelationGroups(country, countryCode);
  const groups = [
    { title: currentLanguage === "en" ? "Military blocs" : "Bloques militares", items: relationGroups.militaryBlocs.slice(0, 3) },
    { title: currentLanguage === "en" ? "Economic blocs" : "Bloques economicos", items: relationGroups.economicBlocs.slice(0, 3) },
    { title: currentLanguage === "en" ? "Diplomatic blocs" : "Bloques diplomaticos", items: relationGroups.diplomaticBlocs.slice(0, 3) },
    { title: currentLanguage === "en" ? "Military allies" : "Aliados militares", items: relationGroups.militaryAllies.slice(0, 3) },
    { title: currentLanguage === "en" ? "Economic partners" : "Socios economicos", items: relationGroups.economicPartners.slice(0, 3) },
    { title: currentLanguage === "en" ? "Diplomatic partners" : "Socios diplomaticos", items: relationGroups.diplomaticPartners.slice(0, 3) },
    { title: currentLanguage === "en" ? "Current rivals" : "Rivales actuales", items: relationGroups.currentRivals.slice(0, 3) },
    { title: currentLanguage === "en" ? "Historical rivals" : "Rivales historicos", items: relationGroups.historicalRivals.slice(0, 3) },
    { title: currentLanguage === "en" ? "Associated territories" : "Territorios asociados", items: relationGroups.linkedTerritories.slice(0, 3) },
    { title: currentLanguage === "en" ? "Dependencies" : "Dependencias", items: relationGroups.dependencies.slice(0, 3) },
    { title: currentLanguage === "en" ? "Disputed spaces" : "Espacios en disputa", items: relationGroups.disputes.slice(0, 3) },
    { title: currentLanguage === "en" ? "Former metropole" : "Ex metropoli", items: relationGroups.exMetropole.slice(0, 1) },
    { title: currentLanguage === "en" ? "Former colonies / territories" : "Ex colonias / territorios", items: relationGroups.exColonies.slice(0, 3) }
  ].filter(group => group.items.length);

  if (!groups.length) {
    return `<p>${t("noData")}</p>`;
  }

  return `
    <div class="relation-network">
      <div class="network-center">${getFlagEmoji(countryCode)} ${escapeHtml(country.name)}</div>
      <div class="relation-network-groups">
        ${groups.map(group => `
          <div class="relation-network-group">
            <div class="relation-network-title">${escapeHtml(group.title)}</div>
            <div class="network-links">
              ${group.items.map(item => `<button type="button" class="network-link" data-search-query="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  ` + renderRelationCrosswalk(country, countryCode);
}

function renderRelationsSummary(country, countryCode) {
  const relations = collectRelationGroups(country, countryCode);
  const summaries = [
    {
      label: currentLanguage === "en" ? "Organizations" : "Organizaciones",
      value: relations.organizations.length
    },
    {
      label: currentLanguage === "en" ? "Military allies" : "Aliados militares",
      value: relations.militaryAllies.length
    },
    {
      label: currentLanguage === "en" ? "Economic partners" : "Socios economicos",
      value: relations.economicPartners.length
    },
    {
      label: currentLanguage === "en" ? "Diplomatic blocs" : "Bloques diplomaticos",
      value: relations.diplomaticBlocs.length
    },
    {
      label: currentLanguage === "en" ? "Current rivals" : "Rivales actuales",
      value: relations.currentRivals.length
    },
    {
      label: currentLanguage === "en" ? "Historical rivals" : "Rivales historicos",
      value: relations.historicalRivals.length
    },
    {
      label: currentLanguage === "en" ? "Dependencies" : "Dependencias",
      value: relations.dependencies.length
    },
    {
      label: currentLanguage === "en" ? "Associated territories" : "Territorios asociados",
      value: relations.linkedTerritories.length
    },
    {
      label: currentLanguage === "en" ? "Disputes" : "Disputas",
      value: relations.disputes.length
    }
  ];

  return `
    <div class="country-overview-grid relation-overview-grid">
      ${summaries.map(item => `
        <div class="overview-card">
          <span class="overview-label">${escapeHtml(item.label)}</span>
          <strong class="overview-value">${formatNumber(item.value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function getStaticTextRuntimeContext() {
  return {
    document,
    currentLanguage,
    appMode,
    qualityPreset,
    labelMode,
    autoRotateEnabled,
    translate: t,
    syncMobilePanelControlState,
    updateMapModeToggle,
    renderThemePicker,
    syncThemeToolbarState,
    getNewsTopicLabel,
    updateAppStatusPanel,
    renderSavedFilters,
    renderSavedViews,
    renderSearchMemory,
    updateIntroRuntimeStatus,
    updateIntroActionText,
    renderHelpModalContent
  };
}

function updateStaticText() {
  if (typeof textUi.applyStaticText !== "function") {
    return false;
  }
  return textUi.applyStaticText(getStaticTextRuntimeContext());
}

let rerenderCurrentPanelFrame = null;

function rerenderCurrentPanel() {
  if (rerenderCurrentPanelFrame !== null) {
    return;
  }

  const flush = () => {
    rerenderCurrentPanelFrame = null;

    if (currentPanelState.type === "country" && currentPanelState.code && countriesData[currentPanelState.code]) {
      renderCountry(countriesData[currentPanelState.code], currentPanelState.fallbackName);
      return;
    }

    if (currentPanelState.type === "continent") {
      renderContinent(currentPanelState.continent, currentPanelState.countries);
      return;
    }

    if (currentPanelState.type === "religion") {
      renderReligionSelection(currentPanelState.religionName, currentPanelState.countries, currentPanelState.totalNominal);
      return;
    }

    if (currentPanelState.type === "group") {
      renderGroupSelection(currentPanelState.title, currentPanelState.descriptor, currentPanelState.countries);
      return;
    }

    if (currentPanelState.type === "empty") {
      renderEmpty(currentPanelState.name || t("noData"));
    }
  };

  // Los navegadores suspenden requestAnimationFrame en pestanas en segundo plano.
  rerenderCurrentPanelFrame = setTimeout(flush, 0);
}

function loadSavedPreferences() {
  try {
    const storedLanguage = localStorage.getItem(STORAGE_KEYS.language);
    if (storedLanguage) {
      currentLanguage = storedLanguage;
    }

    const storedFilters = localStorage.getItem(STORAGE_KEYS.filters);
    if (storedFilters) {
      savedFilters = JSON.parse(storedFilters);
    }

    const storedViews = localStorage.getItem(STORAGE_KEYS.views);
    if (storedViews) {
      savedViews = JSON.parse(storedViews);
    }
    const storedFavorites = localStorage.getItem(STORAGE_KEYS.favorites);
    if (storedFavorites) {
      favoriteViews = JSON.parse(storedFavorites);
    }

    const storedSearchHistory = localStorage.getItem(STORAGE_KEYS.searchHistory);
    if (storedSearchHistory) {
      searchHistory = JSON.parse(storedSearchHistory);
    }

    const storedSavedSearches = localStorage.getItem(STORAGE_KEYS.savedSearches);
    if (storedSavedSearches) {
      savedSearches = JSON.parse(storedSavedSearches);
    }

    appMode = localStorage.getItem(STORAGE_KEYS.appMode) || (localStorage.getItem(STORAGE_KEYS.presentation) === "true" ? "presentation" : "default");
    document.body.classList.toggle("presentation-mode", appMode === "presentation");
  } catch (error) {
    savedFilters = [];
    savedViews = [];
    favoriteViews = [];
    searchHistory = [];
    savedSearches = [];
  }
}

function getMedian(values) {
  const sorted = values.filter(value => typeof value === "number" && Number.isFinite(value)).sort((a, b) => a - b);
  if (!sorted.length) {
    return null;
  }

  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2) {
    return sorted[middle];
  }

  return Number(((sorted[middle - 1] + sorted[middle]) / 2).toFixed(1));
}

function buildInflationFallbacks() {
  const continentValues = {};
  const globalValues = [];

  Object.entries(rawInflationByCode).forEach(([code, value]) => {
    const continent = countriesData[code]?.continent;
    const parsed = parseInflationValue(value);
    if (!isValidInflationValue(parsed) || !continent) {
      return;
    }

    continentValues[continent] = continentValues[continent] || [];
    continentValues[continent].push(parsed);
    globalValues.push(parsed);
  });

  inflationFallbackByContinent = Object.fromEntries(
    Object.entries(continentValues).map(([continent, values]) => [continent, getMedian(values)])
  );
  globalInflationFallback = getMedian(globalValues);
}

function isValidInflationValue(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 300;
}

function parseQuotedCsvLine(line) {
  return line
    .trim()
    .replace(/^"/, "")
    .replace(/",?$/, "")
    .split('","');
}

function parseWorldBankSeriesChanges(csvText) {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  const headerIndex = lines.findIndex(line => line.startsWith("\"Country Name\""));
  if (headerIndex === -1) {
    return {};
  }

  const result = {};
  for (const line of lines.slice(headerIndex + 1)) {
    if (!line.startsWith("\"")) {
      continue;
    }

    const parts = parseQuotedCsvLine(line);
    if (parts.length < 8) {
      continue;
    }

    const code = parts[1];
    const values = parts
      .slice(4)
      .map(value => {
        const normalized = String(value || "").replace(/,/g, "").trim();
        if (!normalized) {
          return null;
        }
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : null;
      })
      .filter(value => typeof value === "number");

    if (values.length < 2) {
      continue;
    }

    const latest = values.at(-1);
    const previous = values.at(-2);
    if (!latest || !previous) {
      continue;
    }

    result[code] = Number((((latest - previous) / previous) * 100).toFixed(2));
  }

  return result;
}

function parseWorldBankCountryNameMap(csvText) {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  const headerIndex = lines.findIndex(line => line.startsWith("\"Country Name\""));
  if (headerIndex === -1) {
    return new Map();
  }

  const result = new Map();
  for (const line of lines.slice(headerIndex + 1)) {
    if (!line.startsWith("\"")) {
      continue;
    }

    const parts = parseQuotedCsvLine(line);
    if (parts.length < 2) {
      continue;
    }

    const name = parts[0];
    const code = parts[1];
    if (!name || !code || !countriesData[code]) {
      continue;
    }

    buildCountryLookupVariants(name).forEach(variant => {
      result.set(variant, code);
    });
  }

  Object.entries(worldBankNameAliasOverrides).forEach(([alias, code]) => {
    if (countriesData[code]) {
      buildCountryLookupVariants(alias).forEach(variant => {
        result.set(variant, code);
      });
    }
  });

  return result;
}

function persistSavedFilters() {
  localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(savedFilters));
}

function renderSavedFilters() {
  const select = document.getElementById("saved-filters-select");
  if (!select) {
    return;
  }

  select.innerHTML = `<option value="">${currentLanguage === "en" ? "Saved filters" : "Filtros guardados"}</option>${savedFilters
    .map((item, index) => `<option value="${index}">${escapeHtml(item.name)}</option>`)
    .join("")}`;
}

function persistSavedViews() {
  localStorage.setItem(STORAGE_KEYS.views, JSON.stringify(savedViews));
}

function persistFavoriteViews() {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favoriteViews));
}

function renderSavedViews() {
  const select = document.getElementById("saved-views-select");
  if (!select) {
    return;
  }

  select.innerHTML = `<option value="">${currentLanguage === "en" ? "Saved views" : "Vistas guardadas"}</option>${savedViews
    .map((item, index) => {
      const modeLabel = item.mapMode ? item.mapMode.toUpperCase() : "3D";
      const themeLabel = item.theme && item.theme !== "default" ? item.theme : (currentLanguage === "en" ? "political" : "politica");
      return `<option value="${index}">${escapeHtml(`${item.name} · ${modeLabel} · ${themeLabel}`)}</option>`;
    })
    .join("")}`;
}

function renderFavoriteViews() {
  const select = document.getElementById("favorite-views-select");
  if (!select) {
    return;
  }

  select.innerHTML = `<option value="">${currentLanguage === "en" ? "Favorites" : "Favoritos"}</option>${favoriteViews
    .map((item, index) => {
      const modeLabel = item.appMode && item.appMode !== "default" ? item.appMode : (currentLanguage === "en" ? "explore" : "exploracion");
      return `<option value="${index}">${escapeHtml(`${item.name} · ${modeLabel}`)}</option>`;
    })
    .join("")}`;
}

async function openMarkdownDocument(title, fileName) {
  try {
    const markdown = await fetchResourceCached(`./${fileName}?v=${APP_VERSION}`, "text");
    openProductModal(
      title,
      `<div class="product-doc"><pre>${escapeHtml(markdown)}</pre></div>`
    );
  } catch (error) {
    openProductModal(
      title,
      `<p>${currentLanguage === "en" ? "The document could not be loaded." : "No se pudo cargar el documento."}</p>`
    );
  }
}

function parseChangelogMarkdown(markdown) {
  const releases = [];
  let current = null;
  String(markdown || "").split(/\r?\n/).forEach(line => {
    if (/^##\s+/.test(line)) {
      if (current) {
        releases.push(current);
      }
      current = {
        title: line.replace(/^##\s+/, "").trim(),
        summary: "",
        items: []
      };
      return;
    }
    if (!current) {
      return;
    }
    if (/^\-\s+/.test(line)) {
      current.items.push(line.replace(/^\-\s+/, "").trim());
      return;
    }
    if (!current.summary && line.trim()) {
      current.summary = line.trim();
    }
  });
  if (current) {
    releases.push(current);
  }
  return releases;
}

async function renderChangelogPanel() {
  try {
    const markdown = await fetchResourceCached(`./CHANGELOG.md?v=${APP_VERSION}`, "text");
    const releases = parseChangelogMarkdown(markdown).slice(0, 6);
    openProductModal(
      "CHANGELOG",
      `
        <div class="product-summary-grid">
          ${releases.slice(0, 3).map(release => `
            <div class="overview-card">
              <span class="overview-label">${escapeHtml(release.title)}</span>
              <strong class="overview-value">${escapeHtml(release.summary || (currentLanguage === "en" ? "Release notes" : "Notas de version"))}</strong>
            </div>
          `).join("")}
        </div>
        <div class="changelog-release-list">
          ${releases.map(release => `
            <section class="changelog-release-card">
              <h3>${escapeHtml(release.title)}</h3>
              ${release.summary ? `<p>${escapeHtml(release.summary)}</p>` : ""}
              <ul>${release.items.slice(0, 8).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </section>
          `).join("")}
        </div>
      `
    );
  } catch (error) {
    openMarkdownDocument("CHANGELOG", "CHANGELOG.md");
  }
}

async function renderDatasetHealthPanel() {
  await ensureDeferredUiModule("projectAudit");
  const countries = Object.values(countriesData || {});
  const introStats = getIntroCoverageStats();
  const body = projectAuditUi.renderDatasetHealthPanelContent
    ? projectAuditUi.renderDatasetHealthPanelContent({
        language: currentLanguage,
        countries,
        introStats
      })
    : `<div class="help-section"><p>${currentLanguage === "en" ? "Dataset health details are not available yet." : "El detalle de salud del dataset todavia no esta disponible."}</p></div>`;
  openProductModal(
    currentLanguage === "en" ? "Dataset health" : "Salud del dataset",
    body
  );
}

async function renderPerformancePanel() {
  await loadScriptOnce(`./app-performance-ui.js?v=${APP_VERSION}`, "GeoRiskPerformanceUi").catch(error => {
    console.warn("No se pudo cargar el modulo de rendimiento:", error);
  });
  const summary = getBootProfileSummary();
  const stepRows = Object.entries(bootMetrics.steps || {})
    .filter(([, step]) => Number.isFinite(step?.duration))
    .sort((a, b) => (b[1].duration || 0) - (a[1].duration || 0))
    .map(([name, step]) => `
      <li>
        <span>${escapeHtml(name)}</span>
        <div class="health-progress-track"><i style="width:${Math.min(100, Math.max(4, Math.round(((step.duration || 0) / Math.max(summary.total || 1, 1)) * 100)))}%"></i></div>
        <b>${Math.round(step.duration || 0)} ms</b>
      </li>
    `).join("");
  const preset = getPerformancePreset();
  const exportStatus = [
    typeof html2canvas === "function" ? "html2canvas listo" : "html2canvas diferido",
    window.jspdf?.jsPDF ? "jsPDF listo" : "jsPDF diferido"
  ].join(" / ");
  const tuningRows = `
    <li><b>Tier</b>: ${escapeHtml(preset.tier || "auto")}</li>
    <li><b>Resolution scale</b>: ${escapeHtml(String(viewer?.resolutionScale ?? preset.resolutionScale))}</li>
    <li><b>Tile cache</b>: ${escapeHtml(String(viewer?.scene?.globe?.tileCacheSize ?? preset.tileCacheSize))}</li>
    <li><b>Hover</b>: ${shouldUseHoverHighlights() ? "activo" : "reducido"}</li>
    <li><b>Style cache</b>: ${escapeHtml(String(countryStyleCache.size?.() || 0))}</li>
  `;
  const degradationRows = mapDegradationLog.list()
    .slice(0, 8)
    .map(item => `<li><b>${escapeHtml(item.reason || "auto")}</b>: ${escapeHtml(item.mode || currentMapMode)} · ${item.fps ? `${Math.round(item.fps)} FPS · ` : ""}${escapeHtml(item.at || "")}</li>`)
    .join("");
  const body = window.GeoRiskPerformanceUi?.renderPerformancePanelContent
    ? window.GeoRiskPerformanceUi.renderPerformancePanelContent({
        language: currentLanguage,
        summary,
        longTaskMetrics,
        startupFpsMetrics,
        stepRows,
        renderLabel: escapeHtml(getRenderProfileLabel()),
        presetLabel: escapeHtml(getQualityPresetLabel()),
        exportStatus: escapeHtml(exportStatus),
        tuningRows,
        degradationRows
      })
    : `
      <div class="product-summary-grid">
        <div class="overview-card"><span class="overview-label">Total boot</span><strong class="overview-value">${Math.round(summary.total || 0)} ms</strong></div>
        <div class="overview-card"><span class="overview-label">Datos</span><strong class="overview-value">${Math.round(summary.data || 0)} ms</strong></div>
        <div class="overview-card"><span class="overview-label">Export</span><strong class="overview-value">${escapeHtml(exportStatus)}</strong></div>
      </div>
    `;

  openProductModal(
    currentLanguage === "en" ? "Performance" : "Rendimiento",
    body
  );
}

async function renderRiskRadarPanel() {
  await ensureDeferredUiModule("riskRadar");
  const allRiskCountries = Object.entries(countriesData || {})
    .map(([code, country]) => ({
      code,
      name: country.name,
      continent: country.continent,
      components: getCountryRiskRadarComponents(country)
    }));
  const topRiskCountries = allRiskCountries
    .slice()
    .sort((a, b) => b.components.risk - a.components.risk)
    .slice(0, 18);
  const selected = getCurrentThemeSelectedCountry();
  const selectedComponents = selected ? getCountryRiskRadarComponents(selected) : null;
  const body = riskRadarUi.renderRiskRadarPanelContent
    ? riskRadarUi.renderRiskRadarPanelContent({
        language: currentLanguage,
        selected: selected ? { name: selected.name } : null,
        selectedComponents,
        topRiskCountries,
        allRiskCountries,
        formatNumber,
        getFlagEmoji
      })
    : `
    <div class="product-insight-strip">
      <span>${currentLanguage === "en"
        ? "Unlike a military-only radar, this view weighs conflict exposure, economic stress, rivals, governance and diplomatic buffers."
        : "A diferencia de un radar solo militar, esta vista pondera conflictos, estres economico, rivales, gobernanza y amortiguadores diplomaticos."}</span>
    </div>
    ${selected ? `
      <div class="help-section">
        <h3>${escapeHtml(selected.name)} - ${formatNumber(Math.round(selectedComponents.risk))}/100</h3>
      </div>
    ` : ""}
    <div class="help-section">
      <h3>${currentLanguage === "en" ? "Top risk watchlist" : "Watchlist de riesgo"}</h3>
      <div class="risk-watch-grid">${topRiskCountries.map(({ code, name, components }) => `
        <button type="button" class="risk-watch-card" data-open-country="${escapeHtml(code)}">
          <strong>${getFlagEmoji(code)} ${escapeHtml(name)}</strong>
          <span>${formatNumber(Math.round(components.risk))}/100</span>
        </button>
      `).join("")}</div>
    </div>
  `;

  openProductModal(
    currentLanguage === "en" ? "Multi-variable risk radar" : "Radar de riesgo multiparametrico",
    body
  );

  document.querySelectorAll("[data-open-country]").forEach(button => {
    button.addEventListener("click", async () => {
      const code = button.dataset.openCountry;
      if (code) {
        closeProductModal();
        await openCountryByCode(code);
      }
    });
  });
}

async function renderConflictAuditPanel() {
  await ensureDeferredUiModule("conflictAudit");
  const report = await fetchResourceCached(`./reports/conflict-audit.json?v=${APP_VERSION}`, "json").catch(() => null);
  if (!report) {
    openProductModal(
      currentLanguage === "en" ? "Conflict audit" : "Auditoria de conflictos",
      `<div class="help-section"><p>${currentLanguage === "en" ? "The audit report is not available yet. Run npm run audit:conflicts." : "El reporte de auditoria todavia no esta disponible. Ejecuta npm run audit:conflicts."}</p></div>`
    );
    return;
  }

  const body = conflictAuditUi.renderConflictAuditPanelContent
    ? conflictAuditUi.renderConflictAuditPanelContent({
        language: currentLanguage,
        report,
        countriesData
      })
    : `<div class="help-section"><p>${currentLanguage === "en" ? "Conflict audit details are not available yet." : "El detalle de auditoria de conflictos todavia no esta disponible."}</p></div>`;

  openProductModal(currentLanguage === "en" ? "Conflict audit" : "Auditoria de conflictos", body);

  document.querySelectorAll("[data-open-country]").forEach(button => {
    button.addEventListener("click", async () => {
      const code = button.dataset.openCountry;
      if (code) {
        closeProductModal();
        await openCountryByCode(code);
      }
    });
  });
  document.querySelectorAll("[data-open-conflict]").forEach(button => {
    button.addEventListener("click", () => {
      const conflictKey = button.dataset.openConflict;
      if (conflictKey) {
        closeProductModal();
        openConflictModal(conflictKey);
      }
    });
  });
}

async function renderProjectAuditPanel() {
  await ensureDeferredUiModule("projectAudit");
  const report = await fetchResourceCached(`./reports/project-audit.json?v=${APP_VERSION}`, "json").catch(() => null);
  if (!report) {
    openProductModal(
      currentLanguage === "en" ? "Project audit" : "Auditoria del proyecto",
      `<div class="help-section"><p>${currentLanguage === "en" ? "The project audit report is not available yet. Run npm run audit:project." : "El reporte de auditoria del proyecto todavia no esta disponible. Ejecuta npm run audit:project."}</p></div>`
    );
    return;
  }

  const fileRows = (report.sourceFiles || []).slice(0, 8).map(file => `
    <article class="audit-issue-card">
      <div>
        <strong>${escapeHtml(file.path)}</strong>
        <small>${escapeHtml(file.human || "s/m")}</small>
      </div>
      <div class="audit-issue-actions">
        <span class="issue-chip">${file.exists ? "ok" : "faltante"}</span>
      </div>
    </article>
  `).join("");
  const actionRows = (report.nextActions || []).map(action => `
    <article class="audit-issue-card">
      <div>
        <strong>${escapeHtml(action)}</strong>
      </div>
    </article>
  `).join("");
  const body = projectAuditUi.renderProjectAuditPanelContent
    ? projectAuditUi.renderProjectAuditPanelContent({
        language: currentLanguage,
        report,
        fileRows,
        actionRows
      })
    : `<div class="help-section"><div class="audit-issue-list">${actionRows}${fileRows}</div></div>`;

  openProductModal(currentLanguage === "en" ? "Project audit" : "Auditoria del proyecto", body);
}

async function renderHelpModalContent({ force = false } = {}) {
  const body = document.getElementById("help-modal-body");
  if (!body) {
    return;
  }
  if (!force && body.dataset.helpLanguage === currentLanguage && body.dataset.loaded === "true") {
    return;
  }

  body.innerHTML = `<h2 id="help-modal-title">${currentLanguage === "en" ? "Quick guide" : "Guia rapida"}</h2><div class="help-section"><p>${currentLanguage === "en" ? "Preparing guide..." : "Preparando guia..."}</p></div>`;
  await ensureDeferredUiModule("help").catch(error => {
    console.warn("No se pudo cargar la guia diferida:", error);
  });
  const renderer = helpUi.renderHelpContent || window.GeoRiskHelpUi?.renderHelpContent;
  if (typeof renderer === "function") {
    body.innerHTML = renderer({ language: currentLanguage });
    body.dataset.loaded = "true";
    body.dataset.helpLanguage = currentLanguage;
  }
}

async function openHelpModal() {
  const modal = document.getElementById("help-modal");
  if (!modal) {
    return;
  }

  modal.hidden = false;
  localStorage.setItem(STORAGE_KEYS.helpSeen, "true");
  syncModalOpenState();
  await renderHelpModalContent();
  syncModalOpenState();
}

function closeHelpModal() {
  const modal = document.getElementById("help-modal");
  if (!modal) {
    return;
  }

  modal.hidden = true;
  syncModalOpenState();
}

function setupSavedViewControls() {
  const saveButton = document.getElementById("save-view-button");
  const select = document.getElementById("saved-views-select");
  const favoriteButton = document.getElementById("save-favorite-button");
  const favoriteSelect = document.getElementById("favorite-views-select");
  const appModeSelect = document.getElementById("app-mode-select");
  const introButton = document.getElementById("open-intro-button");
  const healthButton = document.getElementById("open-health-button");
  const riskRadarButton = document.getElementById("open-risk-radar-button");
  const conflictAuditButton = document.getElementById("open-conflict-audit-button");
  const projectAuditButton = document.getElementById("open-project-audit-button");
  const performanceButton = document.getElementById("open-performance-button");
  const changelogButton = document.getElementById("open-changelog-button");
  const docsButton = document.getElementById("open-docs-button");
  const clearLocalCacheButton = document.getElementById("clear-local-cache-button");
  const helpButton = document.getElementById("open-help-button");
  const datasetChip = document.getElementById("dataset-health-chip");
  const renderChip = document.getElementById("render-profile-chip");
  const helpModal = document.getElementById("help-modal");
  const helpClose = document.getElementById("help-modal-close");
  const productModal = document.getElementById("product-modal");
  const productClose = document.getElementById("product-modal-close");

  renderSavedViews();
  renderFavoriteViews();

  saveButton?.addEventListener("click", () => {
    const view = getCurrentViewState();
    if (!view.name) {
      view.name = currentLanguage === "en" ? "Saved view" : "Vista guardada";
    }
    savedViews = storeViewEntry(savedViews, view, 10);
    persistSavedViews();
    renderSavedViews();
  });
  favoriteButton?.addEventListener("click", () => {
    const view = getCurrentViewState();
    view.name = view.name || (currentLanguage === "en" ? "Favorite configuration" : "Configuracion favorita");
    favoriteViews = storeViewEntry(favoriteViews, view, 8);
    persistFavoriteViews();
    renderFavoriteViews();
  });

  select?.addEventListener("change", async event => {
    const selected = savedViews[Number(event.target.value)];
    if (!selected) {
      return;
    }
    await applySavedView(selected);
  });
  favoriteSelect?.addEventListener("change", async event => {
    const selected = favoriteViews[Number(event.target.value)];
    if (!selected) {
      return;
    }
    await applySavedView(selected);
  });
  appModeSelect?.addEventListener("change", event => {
    applyAppMode(event.target.value || "default");
  });
  introButton?.addEventListener("click", () => openIntroModal());
  healthButton?.addEventListener("click", () => renderDatasetHealthPanel());
  riskRadarButton?.addEventListener("click", () => renderRiskRadarPanel());
  conflictAuditButton?.addEventListener("click", () => renderConflictAuditPanel());
  projectAuditButton?.addEventListener("click", () => renderProjectAuditPanel());
  performanceButton?.addEventListener("click", () => renderPerformancePanel());
  changelogButton?.addEventListener("click", () => renderChangelogPanel());
  clearLocalCacheButton?.addEventListener("click", () => clearLocalGeoRiskCache());
  docsButton?.addEventListener("click", async () => {
    const userGuide = await fetchResourceCached(`./USER_GUIDE.md?v=${APP_VERSION}`, "text").catch(() => "");
    const technicalGuide = await fetchResourceCached(`./TECHNICAL.md?v=${APP_VERSION}`, "text").catch(() => "");
    const backendPlan = await fetchResourceCached(`./BACKEND_PLAN.md?v=${APP_VERSION}`, "text").catch(() => "");
    openProductModal(
      currentLanguage === "en" ? "Documentation" : "Documentacion",
      `
        <div class="help-section">
          <h3>USER_GUIDE.md</h3>
          <pre>${escapeHtml(userGuide || "No disponible")}</pre>
        </div>
        <div class="help-section">
          <h3>TECHNICAL.md</h3>
          <pre>${escapeHtml(technicalGuide || "No disponible")}</pre>
        </div>
        <div class="help-section">
          <h3>BACKEND_PLAN.md</h3>
          <pre>${escapeHtml(backendPlan || "No disponible")}</pre>
        </div>
      `
    );
  });
  datasetChip?.addEventListener("click", () => renderDatasetHealthPanel());
  renderChip?.addEventListener("click", () => renderPerformancePanel());

  helpButton?.addEventListener("click", () => openHelpModal());
  helpClose?.addEventListener("click", () => closeHelpModal());
  helpModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-help-modal='true']")) {
      closeHelpModal();
    }
  });
  productClose?.addEventListener("click", () => closeProductModal());
  productModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-product-modal='true']")) {
      closeProductModal();
    }
  });
}

function containModalKeyboardFocus(event) {
  if (event.key !== "Tab" || !activeModalElement || activeModalElement.hidden) {
    return false;
  }

  const focusable = getModalFocusableElements(activeModalElement);
  const dialog = getModalDialog(activeModalElement);
  if (!focusable.length) {
    event.preventDefault();
    dialog?.focus({ preventScroll: true });
    return true;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const current = document.activeElement;
  if (event.shiftKey && (current === first || !activeModalElement.contains(current))) {
    event.preventDefault();
    last.focus({ preventScroll: true });
    return true;
  }
  if (!event.shiftKey && current === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
    return true;
  }
  return false;
}

function setupGlobalKeyboardShortcuts() {
  document.addEventListener("keydown", event => {
    if (containModalKeyboardFocus(event)) {
      return;
    }

    const targetTag = event.target?.tagName?.toLowerCase?.() || "";
    const isTyping = targetTag === "input" || targetTag === "textarea" || targetTag === "select";

    if (!isTyping && event.key === "/") {
      event.preventDefault();
      document.getElementById("map-search-input")?.focus();
      return;
    }

    if (!isTyping && event.key === "?") {
      event.preventDefault();
      openHelpModal();
      return;
    }

    if (!isTyping && event.key.toLowerCase() === "p") {
      event.preventDefault();
      applyAppMode(appMode === "presentation" ? "default" : "presentation");
      return;
    }

    if (!isTyping && event.key.toLowerCase() === "r") {
      event.preventDefault();
      const rankingsPanel = document.getElementById("rankings-panel");
      if (rankingsPanel) rankingsPanel.open = !rankingsPanel.open;
      return;
    }

    if (!isTyping && event.altKey && event.key.toLowerCase() === "c") {
      event.preventDefault();
      const comparePanel = document.getElementById("compare-hub-panel");
      if (comparePanel) comparePanel.open = !comparePanel.open;
      return;
    }

    if (!isTyping && event.altKey && event.key.toLowerCase() === "n") {
      event.preventDefault();
      const newsPanel = document.getElementById("news-hub-panel");
      if (newsPanel) newsPanel.open = !newsPanel.open;
      return;
    }

    if (event.key === "Escape") {
      closeMobilePanels();
      closeMobileHubPanels();
      closeIntroModal();
      closeProductModal();
      closeCountryModal();
      closeHelpModal();
      closeCompareModal();
      closeConflictModal();
      const searchSuggestions = document.getElementById("search-suggestions");
      if (searchSuggestions && !searchSuggestions.hidden) {
        hideSuggestions();
      }
    }
  });
}

function getCurrentViewState() {
  return {
    name: [
      currentPanelState.type === "country" && currentPanelState.code ? countriesData[currentPanelState.code]?.name : "",
      currentTheme !== "default" ? currentTheme : "",
      appMode !== "default" ? appMode : "",
      currentMapMode.toUpperCase()
    ].filter(Boolean).join(" / "),
    savedAt: new Date().toISOString(),
    theme: currentTheme,
    appMode,
    mapMode: currentMapMode,
    filters: getFilterState(),
    panelState: currentPanelState,
    selectedCode: currentPanelState.code || ""
  };
}

function getSavedViewSignature(view) {
  return JSON.stringify({
    theme: view?.theme || "default",
    appMode: view?.appMode || "default",
    mapMode: view?.mapMode || "3d",
    selectedCode: view?.selectedCode || "",
    filters: view?.filters || {}
  });
}

function storeViewEntry(collection, view, limit) {
  const signature = getSavedViewSignature(view);
  const next = [view, ...collection.filter(item => getSavedViewSignature(item) !== signature)];
  return next.slice(0, limit);
}

async function applySavedView(view) {
  if (!view) {
    return;
  }

  if (view.appMode) {
    applyAppMode(view.appMode);
  }

  document.getElementById("filter-continent-select").value = view.filters?.continent || "";
  document.getElementById("filter-religion-select").value = view.filters?.religion || "";
  document.getElementById("filter-system-select").value = view.filters?.system || "";
  document.getElementById("filter-organization-select").value = view.filters?.organization || "";
  document.getElementById("filter-history-type-select").value = view.filters?.historyType || "";
  document.getElementById("filter-origin-select").value = view.filters?.origin || "";
  document.getElementById("filter-rival-select").value = view.filters?.rival || "";
  document.getElementById("filter-population-select").value = view.filters?.minPopulation ? String(view.filters.minPopulation) : "";

  if (view.theme) {
    setTheme(view.theme);
    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
      themeSelect.value = view.theme;
    }
  }

  if (view.mapMode && view.mapMode !== currentMapMode) {
    applyMapMode(view.mapMode, false);
    await new Promise(resolve => setTimeout(resolve, 120));
  }

  applyFilters();

  if (view.selectedCode && countriesData[view.selectedCode]) {
    await selectSearchResult({
      label: countriesData[view.selectedCode].name,
      type: "country",
      value: view.selectedCode
    });
  } else {
    fitWorldView();
  }
}

function mergeCountryCuration(target, source) {
  if (!target || !source || typeof source !== "object") {
    return target;
  }

  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      target[key] = value.map(item => (item && typeof item === "object" ? { ...item } : item));
      return;
    }

    if (value && typeof value === "object") {
      target[key] = target[key] && typeof target[key] === "object" && !Array.isArray(target[key])
        ? target[key]
        : {};
      mergeCountryCuration(target[key], value);
      return;
    }

    target[key] = value;
  });

  return target;
}

function sanitizeCountryData(country) {
  const populationFallback =
    country.general?.population ||
    country.general?.capital?.population ||
    (country.general?.cities || []).reduce((sum, city) => sum + (city.population || 0), 0) ||
    1;

  if (!country.general) {
    country.general = {};
  }

  if (country.code && curatedCountryOverrides[country.code]) {
    mergeCountryCuration(country, curatedCountryOverrides[country.code]);
  }

  country.general.population = country.general.population || populationFallback;
  country.general.officialName = country.general.officialName || country.name;
  country.general.historicalNames = Array.isArray(country.general.historicalNames) ? country.general.historicalNames : [];
  country.general.symbols = country.general.symbols || {};
  country.politics = country.politics || {};
  country.history = country.history || {};
  country.economy = country.economy || {};
  country.religion = country.religion || {};
  country.religion.populationBase = country.general.population || 0;
  country.politics.relations = country.politics.relations || {};

  country.history.type = normalizeHistoryType(country);
  country.politics.system = normalizePoliticalSystem(country);

  if (country.general?.capital?.name) {
    country.general.capital.name = normalizeCityDisplayName(country.general.capital.name);
  }

  if (!country.religion.summary) {
    const majorityReligion = getMajorityReligionGroups(country)[0];
    if (majorityReligion?.label) {
      country.religion.summary = majorityReligion.label;
    }
  }

  const directInflation = parseInflationValue(rawInflationByCode[country.code]);
  const overrideInflation = parseInflationValue(INFLATION_OVERRIDES[country.code]);
  const existingInflation = parseInflationValue(country.economy.inflation);
  const continentFallback = inflationFallbackByContinent[country.continent];
  const inheritedFallback =
    directInflation === null &&
    overrideInflation === null &&
    existingInflation !== null &&
    (
      existingInflation === continentFallback ||
      existingInflation === globalInflationFallback
    );

  if (isValidInflationValue(directInflation)) {
    country.economy.inflation = Number(directInflation);
    country.economy.inflationEstimated = false;
  } else if (isValidInflationValue(overrideInflation)) {
    country.economy.inflation = Number(overrideInflation);
    country.economy.inflationEstimated = false;
  } else if (existingInflation !== null && !inheritedFallback) {
    country.economy.inflation = existingInflation;
    country.economy.inflationEstimated = false;
  } else {
    country.economy.inflation = null;
    country.economy.inflationEstimated = false;
  }

  country.politics.organizations = (country.politics.organizations || [])
    .filter(Boolean)
    .filter((organization, index, list) =>
      index === list.findIndex(item =>
        normalizeText(getOrganizationDisplayName(item)) === normalizeText(getOrganizationDisplayName(organization))
      )
    );

  country.politics.rivals = (country.politics.rivals || [])
    .filter(Boolean)
    .filter((rival, index, list) =>
      index === list.findIndex(item =>
        normalizeText(item.name || item) === normalizeText(rival.name || rival) &&
        (item.type || "historico") === (rival.type || "historico")
      )
    );

  country.politics.relations.linkedTerritories = uniqueNormalizedList([
    ...(country.politics.relations.linkedTerritories || []),
    ...(TERRITORY_LINKS[country.code] || [])
      .map(code => countriesData[code]?.name)
      .filter(Boolean)
  ]);
  country.politics.relations.associatedTerritories = uniqueNormalizedList([
    ...(country.politics.relations.associatedTerritories || []),
    ...(country.politics.relations.linkedTerritories || [])
  ]);
  country.politics.relations.blocs = uniqueNormalizedList(country.politics.relations.blocs || []);
  country.politics.relations.militaryBlocs = uniqueNormalizedList(country.politics.relations.militaryBlocs || []);
  country.politics.relations.economicBlocs = uniqueNormalizedList(country.politics.relations.economicBlocs || []);
  country.politics.relations.diplomaticBlocs = uniqueNormalizedList(country.politics.relations.diplomaticBlocs || []);
  country.politics.relations.allies = uniqueNormalizedList(country.politics.relations.allies || []);
  country.politics.relations.militaryAllies = uniqueNormalizedList(country.politics.relations.militaryAllies || []);
  country.politics.relations.economicPartners = uniqueNormalizedList(country.politics.relations.economicPartners || []);
  country.politics.relations.diplomaticPartners = uniqueNormalizedList(country.politics.relations.diplomaticPartners || []);
  country.politics.relations.disputes = uniqueNormalizedList(country.politics.relations.disputes || []);
  country.politics.relations.disputedTerritories = uniqueNormalizedList([
    ...(country.politics.relations.disputedTerritories || []),
    ...(country.politics.relations.disputes || [])
  ]);
  country.politics.relations.protectorates = uniqueNormalizedList(country.politics.relations.protectorates || []);
  country.politics.relations.dependencies = uniqueNormalizedList([
    ...(country.politics.relations.dependencies || []),
    ...(country.politics.relations.protectorates || [])
  ]);
  country.politics.relations.exColonies = uniqueNormalizedList(country.politics.relations.exColonies || []);
  country.politics.relations.currentRivals = uniqueNormalizedList(country.politics.relations.currentRivals || []);
  country.politics.relations.historicalRivals = uniqueNormalizedList(country.politics.relations.historicalRivals || []);
  country.politics.relations.rivalStates = uniqueNormalizedList([
    ...(country.politics.relations.rivalStates || []),
    ...country.politics.rivals.map(rival => rival.name || rival)
  ]);

  country.general.cities = (country.general.cities || [])
    .filter(Boolean)
    .map(city => ({
      ...city,
      name: normalizeCityDisplayName(city.name)
    }))
    .filter(city => normalizeText(city.name) !== normalizeText(country.general?.capital?.name || ""))
    .filter((city, index, list) =>
      index === list.findIndex(item => normalizeText(item.name) === normalizeText(city.name))
    );

  return country;
}

function buildCompareRadarSVG(entries) {
  const size = 220;
  const center = size / 2;
  const radius = 76;
  const axes = [
    { key: "population", label: currentLanguage === "en" ? "Population" : "Poblacion" },
    { key: "gdp", label: "PBI" },
    { key: "gdpPerCapita", label: currentLanguage === "en" ? "GDP pc" : "PBI pc" },
    { key: "military", label: currentLanguage === "en" ? "Military" : "Militar" },
    { key: "organizations", label: currentLanguage === "en" ? "Orgs" : "Orgs" }
  ];
  const maxByKey = Object.fromEntries(axes.map(axis => [
    axis.key,
    Math.max(...entries.map(entry => entry.values[axis.key] || 0), 1)
  ]));

  const rings = [0.25, 0.5, 0.75, 1]
    .map(step => `<circle cx="${center}" cy="${center}" r="${radius * step}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />`)
    .join("");

  const axisLines = axes.map((axis, index) => {
    const angle = ((Math.PI * 2) / axes.length) * index - Math.PI / 2;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    const lx = center + Math.cos(angle) * (radius + 20);
    const ly = center + Math.sin(angle) * (radius + 20);
    return `
      <line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.16)" stroke-width="1" />
      <text x="${lx}" y="${ly}" fill="rgba(238,245,255,0.86)" font-size="10" text-anchor="middle">${escapeHtml(axis.label)}</text>
    `;
  }).join("");

  const polygons = entries.map((entry, index) => {
    const color = ["#4da3ff", "#8fd694", "#ff9f6e"][index % 3];
    const points = axes.map((axis, axisIndex) => {
      const angle = ((Math.PI * 2) / axes.length) * axisIndex - Math.PI / 2;
      const ratio = (entry.values[axis.key] || 0) / maxByKey[axis.key];
      const x = center + Math.cos(angle) * radius * ratio;
      const y = center + Math.sin(angle) * radius * ratio;
      return `${x},${y}`;
    }).join(" ");
    return `<polygon points="${points}" fill="${color}33" stroke="${color}" stroke-width="2" />`;
  }).join("");

  return `
    <svg viewBox="0 0 ${size} ${size}" class="compare-radar" aria-hidden="true">
      ${rings}
      ${axisLines}
      ${polygons}
    </svg>
  `;
}

function openCompareModal() {
  const modal = document.getElementById("compare-modal");
  const body = document.getElementById("compare-modal-body");
  const compareResults = document.getElementById("compare-results");
  if (!modal || !body || !compareResults || compareSelection.length < 2) {
    return;
  }

  const modalMarkup = compareResults.innerHTML.replaceAll('data-export-target="compare-results"', 'data-export-target="compare-modal-content"')
    .replaceAll('data-share-target="compare-results"', 'data-share-target="compare-modal-content"');
  body.innerHTML = `
    <div class="compare-modal-header-summary">
      <strong>${currentLanguage === "en" ? "Comparison" : "Comparacion"}:</strong>
      <span>${compareSelection.map(code => countriesData[code]?.name || code).join(" · ")}</span>
    </div>
    <div id="compare-modal-content">${modalMarkup}</div>
  `;
  modal.hidden = false;
  syncModalOpenState();
}

function closeCompareModal() {
  const modal = document.getElementById("compare-modal");
  const body = document.getElementById("compare-modal-body");
  if (!modal || modal.hidden) {
    return;
  }

  modal.hidden = true;
  syncModalOpenState();
  if (body) {
    body.innerHTML = "";
  }
}

function generateGdpPerCapitaRanking() {
  const list = getCachedRanking("gdpPerCapita", () => getCountryValues()
    .filter(country => (country.economy?.gdpPerCapita || 0) > 0)
    .sort((a, b) => (b.economy?.gdpPerCapita || 0) - (a.economy?.gdpPerCapita || 0))
    .slice(0, 10));

  renderInteractiveList("top-gdp-per-capita", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (US$ ${formatNumber(Math.round(country.economy.gdpPerCapita))})`,
    country
  })));
}

function generateOrganizationCountRanking() {
  const list = getCachedRanking("organizationCount", () => getCountryValues()
    .filter(country => getCountryOrganizationCount(country) > 0)
    .sort((a, b) => getCountryOrganizationCount(b) - getCountryOrganizationCount(a))
    .slice(0, 10));

  renderInteractiveList("top-organizations-count", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(getCountryOrganizationCount(country))})`,
    country
  })));
}

function generateConflictCountRanking() {
  const list = getCachedRanking("conflictCount", () => getCountryValues()
    .filter(country => getCountryWarParticipationCount(country) > 0)
    .sort((a, b) => getCountryWarParticipationCount(b) - getCountryWarParticipationCount(a))
    .slice(0, 10));

  renderInteractiveList("top-conflicts-count", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(getCountryWarParticipationCount(country))} ${currentLanguage === "en" ? "wars" : "guerras"})`,
    country
  })));
}

function generateMilitaryRanking() {
  const list = getCachedRanking("militaryActive", () => getCountryValues()
    .filter(country => getCountryMilitaryActive(country) > 0)
    .sort((a, b) => getCountryMilitaryActive(b) - getCountryMilitaryActive(a))
    .slice(0, 10));

  renderInteractiveList("top-military-active", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(getCountryMilitaryActive(country))})`,
    country
  })));
}

function generateReligionDiversityRanking() {
  const list = getCachedRanking("religionDiversity", () => getCountryValues()
    .filter(country => getCountryReligionDiversity(country) > 0)
    .sort((a, b) => getCountryReligionDiversity(b) - getCountryReligionDiversity(a))
    .slice(0, 10));

  renderInteractiveList("top-religion-diversity", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(getCountryReligionDiversity(country))})`,
    country
  })));
}

function generateOrganizationsReachRanking() {
  const totals = getCachedRanking("organizationsReach", () => {
    const result = {};
    getCountryValues().forEach(country => {
    (country.politics?.organizations || []).forEach(organization => {
      const label = normalizeCategoryLabel(getOrganizationDisplayName(organization));
      if (!label || label === "Sin datos") {
        return;
      }
      result[label] = (result[label] || 0) + 1;
    });
  });
    return result;
  });

  renderInteractiveList("top-organizations-reach", Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([organization, count]) => ({
      label: `${organization} (${formatNumber(count)})`,
      organization
    })), item => {
      selectSearchResult({ label: item.organization, type: "organization", value: item.organization });
    });
}

function generateRivalriesRanking() {
  const totals = getCachedRanking("rivalries", () => {
    const result = {};
    getCountryValues().forEach(country => {
    (country.politics?.rivals || []).forEach(rival => {
      const label = normalizeCategoryLabel(rival?.name || rival);
      if (!label || label === "Sin datos") {
        return;
      }
      result[label] = (result[label] || 0) + 1;
    });
  });
    return result;
  });

  renderInteractiveList("top-rivalries", Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([rival, count]) => ({
      label: `${rival} (${formatNumber(count)})`,
      rival
    })), item => {
      selectSearchResult({ label: item.rival, type: "rival", value: item.rival });
    });
}

function generateBlocsRanking() {
  const totals = getCachedRanking("blocs", () => {
    const result = {};
    getCountryValues().forEach(country => {
    (country.politics?.relations?.blocs || []).forEach(bloc => {
      const label = normalizeCategoryLabel(bloc);
      if (!label || label === "Sin datos") {
        return;
      }
      result[label] = (result[label] || 0) + 1;
    });
  });
    return result;
  });

  renderInteractiveList("top-blocs", Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([bloc, count]) => ({
      label: `${bloc} (${formatNumber(count)})`,
      bloc
    })), item => {
      searchByQuery(item.bloc);
    });
}

function generateMetropolesRanking() {
  const totals = getCachedRanking("metropoles", () => {
    const result = {};
    getCountryValues().forEach(country => {
    const metropole = country.politics?.relations?.exMetropole;
    if (!metropole) {
      return;
    }
    result[metropole] = (result[metropole] || 0) + 1;
  });
    return result;
  });

  renderInteractiveList("top-metropoles", Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([metropole, count]) => ({
      label: `${metropole} (${formatNumber(count)})`,
      metropole
    })), item => {
      searchByQuery(item.metropole);
    });
}

function generateHistoryTypesRanking() {
  const totals = getCachedRanking("historyTypes", () => {
    const result = {};
    getCountryValues().forEach(country => {
    const type = normalizeCategoryLabel(country.history?.type);
    if (!type || type === "Sin datos") {
      return;
    }
    result[type] = (result[type] || 0) + 1;
  });
    return result;
  });

  renderInteractiveList("top-history-types", Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([historyType, count]) => ({
      label: `${historyType} (${formatNumber(count)})`,
      historyType
    })), item => {
      selectSearchResult({ label: item.historyType, type: "history_type", value: item.historyType });
  });
}

function ensureRankingList(targetId, title) {
  let target = document.getElementById(targetId);
  if (target) {
    return target;
  }
  const container = document.querySelector("#rankings-panel .left-panel-inner");
  if (!container) {
    return null;
  }
  const wrapper = document.createElement("details");
  wrapper.className = "ranking-group";
  const summary = document.createElement("summary");
  summary.textContent = title;
  const content = document.createElement("div");
  content.className = "ranking-group-content";
  target = document.createElement("ul");
  target.id = targetId;
  content.appendChild(target);
  wrapper.appendChild(summary);
  wrapper.appendChild(content);
  container.appendChild(wrapper);
  return target;
}

function getRankingsPanelFilters() {
  return {
    continent: document.getElementById("rankings-continent-filter")?.value || "",
    minPopulation: Number(document.getElementById("rankings-population-filter")?.value || 0)
  };
}

function renderAdvancedRanking(targetId, title, metric, formatter = value => formatNumber(Math.round(value))) {
  const target = ensureRankingList(targetId, title);
  if (!target || typeof rankingsCore.buildRanking !== "function") {
    return;
  }
  const ranking = advancedRankingCache.get(`${metric}:${JSON.stringify(getRankingsPanelFilters())}`, countriesDataRevision, () =>
    rankingsCore.buildRanking(getCountryValues(), metric, { filters: getRankingsPanelFilters(), limit: 10 })
  );
  renderInteractiveList(targetId, ranking.map(item => ({
    label: `${getFlagEmoji(getCountryCodeByObject(item.country))} ${item.name} (${formatter(item.score)})`,
    country: item.country,
    components: item.components
  })));
}

async function generateAdvancedRankings() {
  await ensureDeferredUiModule("rankings");
  renderAdvancedRanking("top-risk-score", currentLanguage === "en" ? "Risk ranking" : "Ranking de riesgo", "risk");
  renderAdvancedRanking("top-data-quality", currentLanguage === "en" ? "Data quality ranking" : "Ranking de calidad de datos", "dataQuality");
  renderAdvancedRanking("top-active-conflicts", currentLanguage === "en" ? "Active conflicts" : "Conflictos activos", "activeConflicts");
  renderAdvancedRanking("top-military-pressure", currentLanguage === "en" ? "Military pressure" : "Presion militar", "military");
  renderAdvancedRanking("top-fragility", currentLanguage === "en" ? "Fragility" : "Fragilidad", "fragility");
  renderAdvancedRanking("top-diplomacy", currentLanguage === "en" ? "Diplomatic buffer" : "Ranking diplomatico", "diplomacy");
}

function addCountryToCompare(code) {
  if (!code || !countriesData[code]) {
    return;
  }

  compareSelection = compareSelection.filter(item => item !== code);
  compareSelection.unshift(code);
  compareSelection = compareSelection.slice(0, 5);
  compareDataCache.clear();
  renderComparePanel();
}

function syncCountryCompareButton(code = currentPanelState?.code || "") {
  const button = document.getElementById("add-to-compare-button");
  if (!button || !code) {
    return;
  }
  const selected = compareSelection.includes(code);
  button.classList.toggle("is-active", selected);
  button.setAttribute("aria-pressed", String(selected));
  button.textContent = selected
    ? (currentLanguage === "en" ? "Added to comparison" : "Agregado al comparador")
    : t("addToCompare");
}

function removeCountryFromCompare(code) {
  compareSelection = compareSelection.filter(item => item !== code);
  compareDataCache.clear();
  renderComparePanel();
}

function getRankingItemKey(targetId, item) {
  return item.country
    ? `country:${getRankedCountryCode(item.country)}`
    : `${targetId}:${normalizeText(item.label)}`;
}

function setActiveRankingItem(element, rankingKey) {
  activeRankingKey = rankingKey || "";
  document.querySelectorAll(".rank-link.is-active").forEach(activeItem => {
    activeItem.classList.remove("is-active");
    activeItem.setAttribute("aria-pressed", "false");
    activeItem.querySelector("[aria-pressed]")?.setAttribute("aria-pressed", "false");
  });
  if (!element || !rankingKey) {
    syncRankingActiveSummary("");
    return;
  }
  element.classList.add("is-active");
  element.setAttribute("aria-pressed", "true");
  element.querySelector("[aria-pressed]")?.setAttribute("aria-pressed", "true");
  syncRankingActiveSummary(element.textContent.trim());
}

function syncRankingActiveSummary(label = "") {
  const wrapper = document.getElementById("ranking-active-summary");
  const value = document.getElementById("ranking-active-label");
  const kicker = document.getElementById("ranking-active-kicker");
  if (!wrapper || !value) {
    return;
  }
  const hasActive = Boolean(activeRankingKey && label);
  wrapper.classList.toggle("has-active", hasActive);
  value.textContent = hasActive
    ? label.replace(/\s+/g, " ").trim()
    : (currentLanguage === "en" ? "No active selection" : "Sin seleccion activa");
  if (kicker) {
    kicker.textContent = hasActive
      ? (currentLanguage === "en" ? "Active ranking" : "Ranking activo")
      : (currentLanguage === "en" ? "Current selection" : "Seleccion actual");
  }
}

function renderInteractiveList(targetId, items, onClick = () => {}) {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }
  target.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("li");
    empty.className = "rank-empty-state";
    empty.textContent = currentLanguage === "en" ? "No results for this view." : "Sin resultados para esta vista.";
    target.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const li = document.createElement("li");
    const rankingKey = getRankingItemKey(targetId, item);
    li.className = "rank-link";
    li.textContent = item.label;
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.setAttribute("aria-label", item.country
      ? `${item.label} - ${currentLanguage === "en" ? "open profile and select on map" : "abrir ficha y marcar en mapa"}`
      : `${item.label} - ${currentLanguage === "en" ? "show group on map" : "mostrar grupo en mapa"}`);
    li.classList.toggle("is-active", activeRankingKey === rankingKey);
    li.setAttribute("aria-pressed", String(activeRankingKey === rankingKey));
    if (activeRankingKey === rankingKey) {
      syncRankingActiveSummary(item.label);
    }
    const activate = () => {
      setActiveRankingItem(li, rankingKey);
      return item.country ? selectRankedCountry(item.country) : onClick(item);
    };
    li.addEventListener("click", activate);
    li.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
    target.appendChild(li);
  });
}

function getFilterState() {
  return {
    continent: document.getElementById("filter-continent-select").value,
    religion: document.getElementById("filter-religion-select").value,
    system: document.getElementById("filter-system-select").value,
    organization: document.getElementById("filter-organization-select").value,
    language: "",
    bloc: "",
    metropole: "",
    conflict: "",
    period: "",
    historyType: document.getElementById("filter-history-type-select").value,
    origin: document.getElementById("filter-origin-select").value,
    rival: document.getElementById("filter-rival-select").value,
    minPopulation: Number(document.getElementById("filter-population-select").value || 0)
  };
}

function getFilteredCountries(filters = getFilterState()) {
  return getCountryValues().filter(country => {
    if (filters.continent && country.continent !== filters.continent) {
      return false;
    }

    if (filters.religion && !isReligionMajorityInCountry(country, filters.religion)) {
      return false;
    }

    if (filters.system) {
      const systemLabel = normalizePoliticalSystemCategory(country.politics?.system);
      const normalizedSystem = normalizeText(systemLabel);
      if (filters.system === "__monarquia__" && !normalizedSystem.includes("monarquia")) {
        return false;
      }
      if (filters.system === "__semipresidencial__" && !normalizedSystem.includes("semipresid")) {
        return false;
      }
      if (filters.system === "__presidencial__" && !normalizedSystem.includes("presidencial")) {
        return false;
      }
      if (filters.system === "__parlamentario__" && !normalizedSystem.includes("parlament")) {
        return false;
      }
      if (filters.system === "__federal__" && !/(federal|federacion)/.test(normalizedSystem)) {
        return false;
      }
      if (!filters.system.startsWith("__") && systemLabel !== normalizePoliticalSystemCategory(filters.system)) {
        return false;
      }
    }

    if (filters.organization) {
      const requestedOrganization = normalizeCategoryLabel(filters.organization);
      if (
        !(country.politics?.organizations || []).some(
          organization => normalizeCategoryLabel(getOrganizationDisplayName(organization)) === requestedOrganization
        )
      ) {
        return false;
      }
    }

    if (filters.language && !getCountryLanguages(country).some(language => normalizeText(language) === normalizeText(filters.language))) {
      return false;
    }

    if (filters.bloc && !getCountryBlocs(country).some(bloc => normalizeText(bloc) === normalizeText(filters.bloc))) {
      return false;
    }

    if (filters.metropole && normalizeText(country?.politics?.relations?.exMetropole) !== normalizeText(filters.metropole)) {
      return false;
    }

    if (
      filters.conflict &&
      !getCountryConflictsForSearch(country).some(conflict =>
        getConflictAliasList(conflict).some(alias => normalizeText(alias) === normalizeText(filters.conflict))
      )
    ) {
      return false;
    }

    if (filters.period) {
      const matchesPeriod = getHistoryPeriodLabelFromYear(country?.history?.year) === filters.period
        || (country?.history?.events || []).some(event => getHistoryPeriodLabelFromYear(event?.year) === filters.period);
      if (!matchesPeriod) {
        return false;
      }
    }

    if (filters.historyType && getHistoryTypeLabel(country) !== filters.historyType) {
      return false;
    }

    if (filters.origin) {
      const originLabel = getOriginLabel(country);
      const normalizedOrigin = normalizeText(originLabel);
      if (filters.origin === "__british__" && !/britan|reino unido|commonwealth|british/.test(normalizedOrigin)) {
        return false;
      }
      if (filters.origin === "__french__" && !/francia|frances|french/.test(normalizedOrigin)) {
        return false;
      }
      if (filters.origin === "__spanish__" && !/espana|espanol|spanish/.test(normalizedOrigin)) {
        return false;
      }
      if (filters.origin === "__portuguese__" && !/portugal|portugues/.test(normalizedOrigin)) {
        return false;
      }
      if (!filters.origin.startsWith("__") && originLabel !== filters.origin) {
        return false;
      }
    }

    if (
      filters.rival &&
      !(country.politics?.rivals || []).some(
        rival => normalizeCategoryLabel(rival?.name || rival) === filters.rival
      )
    ) {
      return false;
    }

    if (filters.minPopulation && (country.general?.population || 0) < filters.minPopulation) {
      return false;
    }

    return true;
  });
}

function applyFilters() {
  const filters = getFilterState();
  const countries = getFilteredCountries(filters).sort((a, b) => a.name.localeCompare(b.name, "es"));
  renderSelectableCountryGroup("Filtros globales", "Paises y territorios filtrados", countries);
}


function getOrganizationDisplayName(organization) {
  if (!organization) {
    return "";
  }

  if (typeof organization === "string") {
    return normalizeCategoryLabel(organization);
  }

  const name = normalizeCategoryLabel(organization.name);
  const abbreviation = normalizeCategoryLabel(organization.abbreviation || "");
  if (!abbreviation || normalizeText(name) === normalizeText(abbreviation)) {
    return name;
  }
  const label = `${name} (${abbreviation})`;
  return normalizeCategoryLabel(label);
}

function getOrganizationAliases(organization) {
  if (!organization) {
    return [];
  }

  if (typeof organization === "string") {
    return [organization];
  }

  return [organization.name, organization.abbreviation].filter(Boolean);
}

function getHistoryTypeLabel(country) {
  return normalizeCategoryLabel(country.history?.type || "Sin datos");
}

function getOriginLabel(country) {
  return normalizeCategoryLabel(country.history?.origin || "Sin datos");
}

function registerCriticalCountrySearchEntries(featureNameByCode = {}) {
  Object.entries(countriesData).forEach(([code, country]) => {
    registerCountryAlias(country.name, code, true);
    registerCountryAlias(featureNameByCode[code], code, true);
    registerCountryAlias(code, code, true);
    registerCountryAlias(country.general?.officialName, code, true);
    (country.general?.historicalNames || []).forEach(alias => registerCountryAlias(alias, code, false));
    registerSuggestion(country.name, "country", code, "Pais o territorio", [
      featureNameByCode[code],
      country.general?.officialName,
      ...(country.general?.historicalNames || [])
    ]);
  });
}

function setupCriticalCountrySearchIndex() {
  const nonCountrySuggestions = suggestionItems.filter(item => item.type !== "country");
  suggestionItems.length = 0;
  suggestionItems.push(...nonCountrySuggestions);
  countryAliases.clear();
  registerCriticalCountrySearchEntries();
}

function setupSearchIndex(featureNameByCode) {
  let conflictSuggestionCount = 0;
  const seenConflictSuggestions = new Set();

  suggestionItems.length = 0;
  countryAliases.clear();
  continentAliases.clear();
  religionAliases.clear();
  religionDenominationAliases.clear();
  systemAliases.clear();
  organizationAliases.clear();
  historyTypeAliases.clear();
  originAliases.clear();
  rivalAliases.clear();
  languageAliases.clear();
  blocAliases.clear();
  metropoleAliases.clear();
  conflictAliases.clear();
  periodAliases.clear();

  RELIGION_FAMILY_RULES.forEach(rule => {
    rule.aliases.forEach(alias => registerReligionAlias(alias, rule.label));
    registerSuggestion(rule.label, "religion", rule.label, "Religion", rule.aliases);
  });

  registerCriticalCountrySearchEntries(featureNameByCode);

  Object.entries(countriesData).forEach(([code, country]) => {
    getMajorityReligionGroups(country).forEach(entry => {
      registerReligionAlias(entry.label, entry.label);
      registerSuggestion(entry.label, "religion", entry.label, "Religion");
    });

    getReligionCompositionForDisplay(country.religion).forEach(entry => {
      if (!entry?.name) {
        return;
      }
      const family = getReligionKeyAndLabel(entry.name);
      const denominationLabel = formatReligionDenominationLabel(entry.name, family.label);
      const denominationKey = normalizeText(denominationLabel);
      if (!denominationKey || denominationKey === normalizeText(family.label)) {
        return;
      }
      religionDenominationAliases.set(denominationKey, denominationLabel);
      registerSuggestion(
        denominationLabel,
        "religion_denomination",
        denominationLabel,
        currentLanguage === "en" ? "Religious denomination" : "Denominacion religiosa",
        [entry.name]
      );
    });

    const systemLabel = normalizePoliticalSystemCategory(country.politics?.system);
    if (systemLabel && systemLabel !== "Sin datos") {
      registerLookupAlias(systemAliases, systemLabel, systemLabel);
      registerSuggestion(systemLabel, "system", systemLabel, "Sistema politico");
    }

    (country.politics?.organizations || []).forEach(organization => {
      const label = normalizeCategoryLabel(getOrganizationDisplayName(organization));
      const aliases = uniqueNormalizedList([...getOrganizationAliases(organization), label]);
      if (!label) {
        return;
      }

      aliases.forEach(alias => registerLookupAlias(organizationAliases, alias, label));
      registerSuggestion(label, "organization", label, "Organizacion", aliases);
    });

    const historyType = getHistoryTypeLabel(country);
    if (historyType && historyType !== "Sin datos") {
      registerLookupAlias(historyTypeAliases, historyType, historyType);
      registerSuggestion(historyType, "history_type", historyType, "Tipo historico");
    }

    const origin = getOriginLabel(country);
    if (origin && origin !== "Sin datos") {
      registerLookupAlias(originAliases, origin, origin);
      registerSuggestion(origin, "origin", origin, "Origen historico");
    }

    getCountryLanguages(country).forEach(language => {
      registerLookupAlias(languageAliases, language, language);
      registerSuggestion(language, "language", language, currentLanguage === "en" ? "Language" : "Idioma");
    });

    getCountryBlocs(country).forEach(bloc => {
      registerLookupAlias(blocAliases, bloc, bloc);
      registerSuggestion(bloc, "bloc", bloc, currentLanguage === "en" ? "Bloc or alliance" : "Bloque o alianza");
    });

    const metropole = country?.politics?.relations?.exMetropole;
    if (metropole) {
      registerLookupAlias(metropoleAliases, metropole, metropole);
      registerSuggestion(metropole, "metropole", metropole, currentLanguage === "en" ? "Former metropole" : "Ex metropoli");
    }

    getCountryConflictsForSearch(country).forEach(conflict => {
      const label = getConflictLabel(conflict);
      if (!label || label === "Sin datos") {
        return;
      }
      getConflictAliasList(conflict).forEach(alias => registerLookupAlias(conflictAliases, alias, label));
      const normalizedConflictLabel = normalizeText(label);
      const shouldSuggestConflict =
        conflictSuggestionCount < 180 &&
        !seenConflictSuggestions.has(normalizedConflictLabel) &&
        (
          /(^|\s)(guerra|war|batalla|battle|crisis|asedio|siege)(\s|$)/.test(normalizedConflictLabel) ||
          Boolean(conflict?.startYear)
        );

      if (shouldSuggestConflict) {
        seenConflictSuggestions.add(normalizedConflictLabel);
        conflictSuggestionCount += 1;
        registerSuggestion(label, "conflict", label, currentLanguage === "en" ? "War or battle" : "Guerra o batalla", getConflictAliasList(conflict));
      }
    });

    const period = getHistoryPeriodLabelFromYear(country?.history?.year);
    if (period) {
      registerLookupAlias(periodAliases, period, period);
      registerSuggestion(period, "period", period, currentLanguage === "en" ? "Historical period" : "Periodo historico");
    }

    (country.politics?.rivals || []).forEach(rival => {
      const rivalName = normalizeCategoryLabel(rival?.name || rival);
      if (!rivalName || rivalName === "Sin datos") {
        return;
      }

      registerLookupAlias(rivalAliases, rivalName, rivalName);
      registerSuggestion(rivalName, "rival", rivalName, "Rival historico o actual");
    });
  });

  Object.entries(mapNameAliasOverrides).forEach(([alias, code]) => {
    if (countriesData[code]) {
      registerCountryAlias(alias, code, true);
    }
  });

  const continentNameMap = {
    america: "America",
    americamojibake: "America",
    americas: "America",
    americasmojibake: "America",
    asia: "Asia",
    europa: "Europe",
    europe: "Europe",
    africa: "Africa",
    oceania: "Oceania",
    oceania: "Oceania",
    antartida: "Antarctica",
    antartidamojibake: "Antarctica",
    antarctica: "Antarctica"
  };

  Object.entries(continentNameMap).forEach(([alias, continent]) => {
    continentAliases.set(normalizeText(alias), continent);
  });

  Object.values(countriesData).forEach(country => {
    if (country.continent) {
      continentAliases.set(normalizeText(country.continent), country.continent);
      registerSuggestion(translateContinentName(country.continent), "continent", country.continent, "Continente", [country.continent]);
    }
  });

  [
    "Siglo XXI",
    "Siglo XX",
    "Siglo XIX",
    "Edad Moderna",
    "Edad Media",
    "Antiguedad"
  ].forEach(period => {
    registerLookupAlias(periodAliases, period, period);
    registerSuggestion(period, "period", period, currentLanguage === "en" ? "Historical period" : "Periodo historico");
  });
}

function ensureSearchIndexReady() {
  if (mapSearchAliasesRegistered) {
    return false;
  }

  setupSearchIndex(
    Object.fromEntries(
      Object.entries(countriesData).map(([code, country]) => [code, country.name])
    )
  );
  mapSearchAliasesRegistered = true;
  return true;
}

function getReligionMatches(religionName) {
  return getCountryValues()
    .filter(country => isReligionMajorityInCountry(country, religionName))
    .sort((a, b) => (b.general?.population || 0) - (a.general?.population || 0));
}

function getSuggestions(query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return [];
  }

  const ranked = typeof searchCore.rankSuggestions === "function"
    ? searchCore.rankSuggestions(suggestionItems, query, { isMobile: isMobileLayout(), limit: 10 })
    : suggestionItems
    .map(item => {
      const scores = [
        getSearchScore(normalizedQuery, item.normalizedLabel),
        ...item.normalizedAliases.map(alias => getSearchScore(normalizedQuery, alias)),
        getSearchScore(normalizedQuery, item.subtitle)
      ].filter(Number.isFinite);

      return {
        ...item,
        score: scores.length ? Math.min(...scores) : Number.POSITIVE_INFINITY
      };
    })
    .filter(item => Number.isFinite(item.score))
    .sort((a, b) => {
      if (a.score !== b.score) {
        return a.score - b.score;
      }

      if (a.type !== b.type) {
        return a.type.localeCompare(b.type, "es");
      }

      return a.label.localeCompare(b.label, "es");
    })
    .slice(0, isMobileLayout() ? 6 : 8);

  return typeof searchCore.groupSuggestions === "function"
    ? searchCore.groupSuggestions(ranked, currentLanguage)
    : ranked;
}

function renderSuggestions(query, activeIndex = -1) {
  if (typeof searchCore.rankSuggestions !== "function") {
    ensureDeferredUiModule("search").then(() => {
      ensureSearchIndexReady();
      if (document.getElementById("map-search-input")?.value === query) {
        renderSuggestions(query, activeIndex);
      }
    });
  }

  const suggestionBox = document.getElementById("search-suggestions");
  const suggestions = getSuggestions(query);

  if (!suggestions.length) {
    suggestionBox.hidden = true;
    suggestionBox.innerHTML = "";
    renderSearchMemory();
    return [];
  }

  suggestionBox.hidden = false;
  const memory = document.getElementById("search-memory");
  if (memory) {
    memory.hidden = true;
  }
  suggestionBox.innerHTML = suggestions
    .map(
      (item, index, list) => `
        ${item.groupLabel && item.groupLabel !== list[index - 1]?.groupLabel ? `<div class="search-suggestion-group">${escapeHtml(item.groupLabel)}</div>` : ""}
        <button
          type="button"
          class="search-suggestion${index === activeIndex ? " is-active" : ""}"
          data-type="${escapeHtml(item.type)}"
          data-value="${escapeHtml(String(item.value))}"
          data-label="${escapeHtml(item.label)}"
        >
          ${escapeHtml(item.label)}
          <small>${escapeHtml(item.subtitle)}</small>
        </button>
      `
    )
    .join("");

  return suggestions;
}

function hideSuggestions() {
  const suggestionBox = document.getElementById("search-suggestions");
  const memory = document.getElementById("search-memory");
  suggestionBox.hidden = true;
  suggestionBox.innerHTML = "";
  if (memory) {
    memory.hidden = true;
  }
}

function getCountriesBySystem(systemLabel) {
  const requestedSystem = normalizePoliticalSystemCategory(systemLabel);
  return getCountryValues()
    .filter(country => normalizePoliticalSystemCategory(country.politics?.system) === requestedSystem)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByOrganization(organizationLabel) {
  const requestedOrganization = normalizeCategoryLabel(organizationLabel);
  return getCountryValues()
    .filter(country =>
      (country.politics?.organizations || []).some(
        organization =>
          normalizeCategoryLabel(getOrganizationDisplayName(organization)) === requestedOrganization ||
          getOrganizationAliases(organization).some(alias => normalizeText(alias) === normalizeText(requestedOrganization))
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByHistoryType(historyType) {
  return getCountryValues()
    .filter(country => getHistoryTypeLabel(country) === historyType)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByOrigin(origin) {
  return getCountryValues()
    .filter(country => getOriginLabel(country) === origin)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByRival(rivalName) {
  return getCountryValues()
    .filter(country =>
      (country.politics?.rivals || []).some(
        rival => normalizeCategoryLabel(rival?.name || rival) === rivalName
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getLayersForCountries(countries) {
  const layers = [];
  (countries || []).forEach(country => {
    const code = getRankedCountryCode(country);
    getCountrySelectionLayers(code, country?.name || country?.general?.officialName || "")
      .forEach(layer => layers.push(layer));
  });

  return uniqueBy(layers, layer => layer.code || layer.featureName);
}

function selectCountryGroupLayers(countries, { mode = "continent", focusMap = true, retryWhenReady = true } = {}) {
  const layers = getLayersForCountries(countries);
  if (!layers.length) {
    if (retryWhenReady && !countryLayers.size) {
      ensureCountryLayersReady().then(ready => {
        if (ready) {
          selectCountryGroupLayers(countries, { mode, focusMap, retryWhenReady: false });
        }
      });
    } else {
      clearSelection();
    }
    return false;
  }

  if (mode === "religion") {
    clearSelection();
    selectionMode = "religion";
    selectedLayers = layers;
    selectedLayers.forEach(layer => layer.setStyle(RELIGION_HIGHLIGHT_STYLE));
    continentBoundsLayer = createLayerGroup(layers);
    if (focusMap) {
      fitLayerBounds(continentBoundsLayer);
    }
    requestMapRenderSafe("religion-selection");
    return true;
  }

  setContinentSelection(layers);
  if (focusMap) {
    fitLayerBounds(createLayerGroup(layers));
  }
  return true;
}

function renderSelectableCountryGroup(title, subtitle, countries, options = {}) {
  const cleanCountries = uniqueBy(countries || [], country => getRankedCountryCode(country) || country?.name)
    .filter(Boolean);
  if (!cleanCountries.length) {
    renderEmpty(title || (currentLanguage === "en" ? "No results" : "Sin resultados"));
    return false;
  }
  selectCountryGroupLayers(cleanCountries, options);
  renderGroupSelection(title, subtitle, cleanCountries);
  return true;
}

function getSearchAliasContext() {
  return {
    countries: countryAliases,
    continents: continentAliases,
    religions: religionAliases,
    religionDenominations: religionDenominationAliases,
    systems: systemAliases,
    organizations: organizationAliases,
    languages: languageAliases,
    blocs: blocAliases,
    metropoles: metropoleAliases,
    conflicts: conflictAliases,
    periods: periodAliases,
    historyTypes: historyTypeAliases,
    origins: originAliases,
    rivals: rivalAliases,
    countryNames: countriesData,
    translateContinentName,
    normalizeText
  };
}

function getCountryMetricValue(country, metric) {
  if (typeof rankingsCore.metricValue === "function") {
    return rankingsCore.metricValue(country, metric);
  }
  const values = {
    population: country.general?.population || 0,
    gdp: country.economy?.gdp || 0,
    gdpPerCapita: country.economy?.gdpPerCapita || 0,
    conflicts: getCountryWarParticipationCount(country),
    activeConflicts: getCountryConflictsForSearch(country).filter(conflict => conflict?.ongoing || conflict?.active || conflict?.status === "activo").length,
    organizations: getCountryOrganizationCount(country),
    military: getCountryMilitaryActive(country)
  };
  return values[metric] || 0;
}

function getCountriesForNaturalRanking(naturalQuery) {
  const filters = naturalQuery?.filters || {};
  return getCountryValues()
    .filter(country => {
      if (filters.continent && country.continent !== filters.continent) return false;
      if (filters.religion && !isReligionMajorityInCountry(country, filters.religion)) return false;
      if (filters.system && normalizePoliticalSystemCategory(country.politics?.system) !== normalizePoliticalSystemCategory(filters.system)) return false;
      if (filters.organization && !getCountriesByOrganization(filters.organization).includes(country)) return false;
      if (filters.bloc && !getCountryBlocs(country).some(bloc => normalizeText(bloc) === normalizeText(filters.bloc))) return false;
      if (filters.rival && !(country.politics?.rivals || []).some(rival => normalizeCategoryLabel(rival?.name || rival) === filters.rival)) return false;
      return true;
    })
    .filter(country => getCountryMetricValue(country, naturalQuery.metric) > 0)
    .sort((a, b) => getCountryMetricValue(b, naturalQuery.metric) - getCountryMetricValue(a, naturalQuery.metric))
    .slice(0, 15);
}

function renderNaturalRankingSearch(rawQuery, naturalQuery) {
  const cached = searchResultCache.get(rawQuery);
  const countries = cached || searchResultCache.set(rawQuery, getCountriesForNaturalRanking(naturalQuery));
  if (!renderSelectableCountryGroup(
    rawQuery,
    currentLanguage === "en" ? "Natural ranking query" : "Consulta natural de ranking",
    countries
  )) {
    return false;
  }
  pushSearchHistory(rawQuery);
  renderSearchQueryChips({ ...naturalQuery.filters, ...naturalQuery.chips });
  dismissSearchInput();
  return true;
}

function getGeoJsonPathForCurrentMode(bootPhase = false) {
  if (typeof mapCore.getGeoJsonPathForMode === "function") {
    return mapCore.getGeoJsonPathForMode({
      mode: currentMapMode,
      bootPhase,
      isMobile: isMobileLayout(),
      near: getCurrentOverlayBucket() === "near"
    });
  }
  return (bootPhase || isMobileLayout())
    ? "./data/world_countries_simplified.geo.json"
    : "./data/world_countries.geo.json";
}

async function selectSearchResult(result) {
  if (!result) {
    return;
  }

  const input = document.getElementById("map-search-input");
  input.value = result.label;
  pushSearchHistory(result.label);
  renderSearchQueryChips(null);
  dismissSearchInput();

  if (result.type === "country") {
    const countryCode = result.value;
    if (countryCode) {
      await openCountryByCode(countryCode, result.label);
      return;
    }
  }

  if (result.type === "continent") {
    const continentEntries = getCountryEntries().filter(
      ([, country]) => country.continent === result.value
    );
    const countries = continentEntries.map(([, country]) => country);
    if (countries.length) {
      selectCountryGroupLayers(countries);
      renderContinent(translateContinentName(result.value), countries);
      return;
    }
  }

  if (result.type === "religion") {
    const matches = getReligionMatches(result.value);
    if (matches.length) {
      selectCountryGroupLayers(matches, { mode: "religion" });
      const totalNominal = matches.reduce(
        (sum, country) => sum + getReligionNominalPopulation(country, result.value),
        0
      );

      renderReligionSelection(result.label, matches, totalNominal);
      return;
    }
  }

  if (result.type === "religion_denomination") {
    const matches = getReligionDenominationMatches(result.value);
    if (matches.length) {
      selectCountryGroupLayers(matches, { mode: "religion" });
      const totalNominal = matches.reduce(
        (sum, country) => sum + getReligionDenominationNominalPopulation(country, result.value),
        0
      );

      renderReligionSelection(result.label, matches, totalNominal);
      return;
    }
  }

  if (result.type === "system") {
    const countries = getCountriesBySystem(result.value);
    if (renderSelectableCountryGroup(result.label, "Paises con este sistema politico", countries)) {
      return;
    }
  }

  if (result.type === "organization") {
    const countries = getCountriesByOrganization(result.value);
    if (renderSelectableCountryGroup(result.label, "Paises miembros encontrados", countries)) {
      return;
    }
  }

  if (result.type === "language") {
    const countries = getCountriesByLanguage(result.value);
    if (renderSelectableCountryGroup(
      result.label,
      currentLanguage === "en" ? "Countries using this language" : "Paises que usan este idioma",
      countries
    )) {
      return;
    }
  }

  if (result.type === "bloc") {
    const countries = getCountriesByBloc(result.value);
    if (renderSelectableCountryGroup(
      result.label,
      currentLanguage === "en" ? "Countries in this bloc or alliance" : "Paises en este bloque o alianza",
      countries
    )) {
      return;
    }
  }

  if (result.type === "metropole") {
    const countries = getCountriesByMetropole(result.value);
    if (renderSelectableCountryGroup(
      result.label,
      currentLanguage === "en" ? "Countries linked to this former metropole" : "Paises ligados a esta ex metropoli",
      countries
    )) {
      return;
    }
  }

  if (result.type === "history_type") {
    const countries = getCountriesByHistoryType(result.value);
    if (renderSelectableCountryGroup(result.label, "Paises con este tipo de formacion", countries)) {
      return;
    }
  }

  if (result.type === "period") {
    const countries = getCountriesByPeriod(result.value);
    if (renderSelectableCountryGroup(
      result.label,
      currentLanguage === "en" ? "Countries linked to this period" : "Paises ligados a este periodo",
      countries
    )) {
      return;
    }
  }

  if (result.type === "conflict") {
    const indexedCountries = Array.isArray(result.countries)
      ? result.countries.map(code => countriesData[code]).filter(Boolean)
      : [];
    const countries = indexedCountries.length ? indexedCountries : getCountriesByConflict(result.value);
    if (renderSelectableCountryGroup(
      result.label,
      currentLanguage === "en" ? "Countries linked to this war or battle" : "Paises ligados a esta guerra o batalla",
      countries
    )) {
      return;
    }
  }

  if (result.type === "origin") {
    const countries = getCountriesByOrigin(result.value);
    if (renderSelectableCountryGroup(result.label, "Paises con este origen historico", countries)) {
      return;
    }
  }

  if (result.type === "rival") {
    const countries = getCountriesByRival(result.value);
    if (renderSelectableCountryGroup(result.label, "Paises que mencionan este rival", countries)) {
      return;
    }
  }

  renderEmpty(`No se encontro "${result.label}"`);
  dismissSearchInput();
}

async function searchMap() {
  await ensureDeferredUiModule("search");
  ensureSearchIndexReady();
  const input = document.getElementById("map-search-input");
  const rawQuery = input.value;
  const query = normalizeText(rawQuery);

  if (!query) {
    return;
  }

  const aliasContext = getSearchAliasContext();
  const naturalRankingQuery = typeof searchCore.parseNaturalQuery === "function"
    ? searchCore.parseNaturalQuery(rawQuery, aliasContext)
    : null;
  if (naturalRankingQuery && renderNaturalRankingSearch(rawQuery, naturalRankingQuery)) {
    return;
  }

  const exactCountryResult = typeof searchCore.resolveAliasResult === "function"
    ? searchCore.resolveAliasResult(rawQuery, aliasContext, { types: ["country"] })
    : null;
  if (exactCountryResult) {
    await selectSearchResult(exactCountryResult);
    return;
  }

  const semanticFilters = typeof searchCore.parseSemanticFilters === "function"
    ? searchCore.parseSemanticFilters(rawQuery, aliasContext)
    : null;
  if (semanticFilters) {
    document.getElementById("filter-continent-select").value = semanticFilters.continent;
    document.getElementById("filter-religion-select").value = semanticFilters.religion;
    document.getElementById("filter-system-select").value = semanticFilters.system;
    document.getElementById("filter-organization-select").value = semanticFilters.organization;
    document.getElementById("filter-history-type-select").value = semanticFilters.historyType;
    document.getElementById("filter-origin-select").value = semanticFilters.origin;
    document.getElementById("filter-rival-select").value = semanticFilters.rival;
    document.getElementById("filter-population-select").value = semanticFilters.minPopulation ? String(semanticFilters.minPopulation) : "";
    const semanticCountries = getFilteredCountries(semanticFilters).sort((a, b) => a.name.localeCompare(b.name, "es"));
    if (renderSelectableCountryGroup(
      rawQuery,
      currentLanguage === "en" ? "Semantic search result" : "Resultado semantico",
      semanticCountries
    )) {
      pushSearchHistory(rawQuery);
      renderSearchQueryChips(semanticFilters);
      dismissSearchInput();
      return;
    }
    applyFilters();
    pushSearchHistory(rawQuery);
    renderSearchQueryChips(semanticFilters);
    dismissSearchInput();
    return;
  }

  const firstSuggestion = getSuggestions(rawQuery)[0];
  if (firstSuggestion && firstSuggestion.normalizedLabel === query) {
    await selectSearchResult(firstSuggestion);
    return;
  }

  const primaryAliasResult = typeof searchCore.resolveAliasResult === "function"
    ? searchCore.resolveAliasResult(rawQuery, aliasContext, {
        types: ["country", "continent", "religion", "religion_denomination", "system", "organization", "language", "bloc", "metropole", "conflict"]
      })
    : null;
  if (primaryAliasResult) {
    await selectSearchResult(primaryAliasResult);
    return;
  }

  const indexedConflict = typeof searchCore.findPublicConflictIndexEntry === "function"
    ? await searchCore.findPublicConflictIndexEntry(rawQuery, {
        appVersion: APP_VERSION,
        fetchResourceCached,
        translateConflictName
      })
    : null;
  if (indexedConflict) {
    await selectSearchResult({
      label: indexedConflict.name,
      type: "conflict",
      value: indexedConflict.name,
      countries: indexedConflict.countries || []
    });
    return;
  }

  const secondaryAliasResult = typeof searchCore.resolveAliasResult === "function"
    ? searchCore.resolveAliasResult(rawQuery, aliasContext, {
        types: ["period", "history_type", "origin", "rival"]
      })
    : null;
  if (secondaryAliasResult) {
    await selectSearchResult(secondaryAliasResult);
    return;
  }

  renderEmpty(`No se encontro "${rawQuery}"`);
  dismissSearchInput();
}

async function searchByQuery(rawQuery) {
  const input = document.getElementById("map-search-input");
  input.value = rawQuery;
  await searchMap();
}

function runCriticalGlobalStats() {
  generateWorldPopulation();
}

function isRankingsPanelOpen() {
  return Boolean(document.getElementById("rankings-panel")?.open);
}

function runDeferredGlobalStatsBatch(step = 0) {
  if (!isRankingsPanelOpen()) {
    deferredGlobalStatsReady = false;
    deferredGlobalStatsTimer = null;
    return;
  }

  const batches = [
    () => {
      generateTopPopulation();
      generateContinents();
      generateReligions();
    },
    () => {
      generateGdpRanking();
      generateInflationRanking();
      generateSystemRanking();
      generateGdpPerCapitaRanking();
    },
    () => {
      generateOrganizationCountRanking();
      generateConflictCountRanking();
      generateMilitaryRanking();
      generateReligionDiversityRanking();
    },
    () => {
      generateOrganizationsReachRanking();
      generateRivalriesRanking();
      generateBlocsRanking();
      generateMetropolesRanking();
      generateHistoryTypesRanking();
      generateAdvancedRankings();
    },
    () => {
      if (document.getElementById("news-hub-panel")?.open) {
        renderNewsHub(currentPanelState.code || "");
      }
      if (document.getElementById("quiz-hub-panel")?.open) {
        renderQuizPanel();
      }
      if (document.getElementById("compare-hub-panel")?.open) {
        renderComparePanel();
      }
      deferredGlobalStatsReady = true;
    }
  ];

  const task = batches[step];
  if (!task) {
    deferredGlobalStatsReady = true;
    return;
  }

  const schedule = window.requestIdleCallback
    ? callback => window.requestIdleCallback(callback, { timeout: 600 })
    : callback => setTimeout(callback, step === 0 ? 80 : 40);

  Promise.resolve(task()).finally(() => {
    deferredGlobalStatsTimer = schedule(() => runDeferredGlobalStatsBatch(step + 1));
  });
}

function scheduleDeferredGlobalStats(force = false) {
  if (deferredGlobalStatsReady && !force) {
    return;
  }
  if (deferredGlobalStatsTimer) {
    if (window.cancelIdleCallback) {
      window.cancelIdleCallback(deferredGlobalStatsTimer);
    } else {
      clearTimeout(deferredGlobalStatsTimer);
    }
    deferredGlobalStatsTimer = null;
  }
  deferredGlobalStatsReady = false;
  const schedule = window.requestIdleCallback
    ? callback => window.requestIdleCallback(callback, { timeout: 1200 })
    : callback => setTimeout(callback, 120);
  deferredGlobalStatsTimer = schedule(() => runDeferredGlobalStatsBatch(0));
}

async function loadSupplementalData() {
  if (loadSupplementalDataPromise) {
    return loadSupplementalDataPromise;
  }

  loadSupplementalDataPromise = (async () => {
    const [rawPoliticsJson, rawHistoryJson, rawInflationJson, rawPopulationSeriesText] = await Promise.all([
      fetchResourceCached(`./data/raw/politics.json?v=${APP_VERSION}`, "json"),
      fetchResourceCached(`./data/raw/history.json?v=${APP_VERSION}`, "json"),
      fetchResourceCached(`./data/raw/inflation.json?v=${APP_VERSION}`, "json"),
      fetchResourceCached(`./data/raw/population.csv?v=${APP_VERSION}`, "text")
    ]);

    rawPoliticsSystems = rawPoliticsJson;
    rawHistorySystems = rawHistoryJson;
    rawInflationByCode = rawInflationJson;
    populationGrowthByCode = parseWorldBankSeriesChanges(rawPopulationSeriesText);
    countryCodeByEnglishName = parseWorldBankCountryNameMap(rawPopulationSeriesText);
    buildInflationFallbacks();
    refreshGlobalStats();
    rerenderCurrentPanel?.();
  })().catch(error => {
    console.warn("No se pudieron cargar datos suplementarios al arranque:", error);
  });

  return loadSupplementalDataPromise;
}

async function loadDeferredDataEnhancements() {
  if (loadDeferredDataEnhancementsPromise) {
    return loadDeferredDataEnhancementsPromise;
  }

  loadDeferredDataEnhancementsPromise = (async () => {
    ensureSearchIndexReady();
    runCriticalGlobalStats();
    scheduleDeferredGlobalStats(true);
    scheduleConflictAliasesLoad();
    await loadSupplementalData();
  })().catch(error => {
    console.warn("No se pudieron completar las mejoras diferidas del arranque:", error);
  });

  return loadDeferredDataEnhancementsPromise;
}

async function loadConflictDetailsIndex() {
  if (!loadConflictDetailsIndexPromise) {
    loadConflictDetailsIndexPromise = fetchResourceCached(
      `./data/conflicts/details_index.json?v=${APP_VERSION}`,
      "json"
    ).then(async index => {
      await ensureConflictAliasesLoaded();
      const byName = new Map();
      (index?.conflicts || []).forEach(entry => {
        [entry?.name, translateConflictName(entry?.name || "")]
          .map(normalizeText)
          .filter(Boolean)
          .forEach(key => byName.set(key, entry));
      });
      return byName;
    }).catch(error => {
      console.warn("No se pudo cargar el indice de conflictos detallados:", error);
      return new Map();
    });
  }
  return loadConflictDetailsIndexPromise;
}

async function loadWikipediaConflictDetails(conflictName) {
  await ensureConflictAliasesLoaded();
  const normalizedName = normalizeText(translateConflictName(conflictName || ""));
  if (!normalizedName) {
    return null;
  }
  if (conflictDetailShardPromises.has(normalizedName)) {
    return conflictDetailShardPromises.get(normalizedName);
  }

  const detailPromise = (async () => {
    markBootStepStart("fetchConflictDetailShard");
    try {
      const detailsIndex = await loadConflictDetailsIndex();
      const indexEntry = detailsIndex.get(normalizedName) || detailsIndex.get(normalizeText(conflictName));
      if (!indexEntry?.path) {
        markBootStepEnd("fetchConflictDetailShard", { skipped: true });
        return null;
      }
      const importedDetail = await fetchResourceCached(`./${indexEntry.path}?v=${APP_VERSION}`, "json");
      const detailName = indexEntry.name || importedDetail?.name || conflictName;
      wikipediaConflictDetailOverrides[detailName] = importedDetail;
      wikipediaConflictDetailOverrides[conflictName] = importedDetail;
      mergeImportedConflictDetails({
        [detailName]: importedDetail,
        [conflictName]: importedDetail
      });
      deferredDataStatus.wikipediaConflicts = true;
      markBootStepEnd("fetchConflictDetailShard");
      refreshGlobalStats();
      updateAppStatusPanel();
      return importedDetail;
    } catch (error) {
      markBootStepEnd("fetchConflictDetailShard", { skipped: true });
      console.warn(`No se pudo cargar el detalle de ${conflictName}:`, error);
      return null;
    }
  })();

  conflictDetailShardPromises.set(normalizedName, detailPromise);
  return detailPromise;
}

async function loadData() {
  if (loadDataPromise) {
    return loadDataPromise;
  }

  loadDataPromise = measureBootStep("loadData", async () => {
    markBootStepStart("fetchCountriesIndex");
    const countriesPromise = fetchResourceCached(`./data/countries_index.json?v=${APP_VERSION}`, "json")
      .then(result => {
        markBootStepEnd("fetchCountriesIndex");
        return result;
      })
      .catch(async error => {
        markBootStepEnd("fetchCountriesIndex", { fallback: true });
        console.warn("No se pudo cargar countries_index.json; usando dataset completo:", error);
        return fetchResourceCached(`./data/countries_full.json?v=${APP_VERSION}`, "json");
      });
    markBootStepStart("fetchGeoAliases");
    const aliasPromise = fetchResourceCached(`./data/geo_aliases.json?v=${APP_VERSION}`, "json")
      .then(result => {
        markBootStepEnd("fetchGeoAliases");
        return result;
      });

    const [countriesJson, aliasConfigJson] = await Promise.all([
      countriesPromise,
      aliasPromise
    ]);

    mapNameAliasOverrides = aliasConfigJson?.mapNameAliases || {};
    mapNameAliasIndex = buildNormalizedAliasIndex(mapNameAliasOverrides);
    worldBankNameAliasOverrides = aliasConfigJson?.worldBankNameAliases || {};

    await hydrateCountriesData(countriesJson);
    setupCriticalCountrySearchIndex();
    deferredDataStatus.countryIndex = true;
    refreshLoadedCountryLayers();
    updateAppStatusPanel();
  });

  return loadDataPromise;
}

function refreshGlobalStats() {
  runCriticalGlobalStats();
  scheduleDeferredGlobalStats(true);
}

function loadScriptOnce(src, globalFlag) {
  if (globalFlag && window[globalFlag]) {
    return Promise.resolve(window[globalFlag]);
  }

  const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
  if (existing?.dataset.loaded === "true") {
    return Promise.resolve(globalFlag ? window[globalFlag] : true);
  }

  return new Promise((resolve, reject) => {
    const script = existing || document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.dynamicSrc = src;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve(globalFlag ? window[globalFlag] : true);
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`No se pudo cargar ${src}`)), { once: true });
    if (!existing) {
      document.body.appendChild(script);
    }
  });
}

async function loadRuntimeCuration() {
  if (loadRuntimeCurationPromise) {
    return loadRuntimeCurationPromise;
  }

  loadRuntimeCurationPromise = measureBootStep("loadRuntimeCuration", async () => {
    await Promise.all([
      loadScriptOnce(`./app-conflict-rules.js?v=${APP_VERSION}`, "GeoRiskConflictRules"),
      loadScriptOnce(`./app-curation.js?v=${APP_VERSION}`, "GeoRiskCuration")
    ]);
    mergeRuntimeConflictRules(window.GeoRiskConflictRules || {});
    const curation = window.GeoRiskCuration || {};
    curatedConflictDetailOverrides = curation.EXTRA_CONFLICT_DETAIL_OVERRIDES || {};
    curatedTimelineExtras = curation.EXTRA_CURATED_TIMELINE_EXTRAS || {};
    curatedTimelineDetailOverrides = curation.EXTRA_TIMELINE_DETAIL_OVERRIDES || {};
    curatedCountryOverrides = curation.COUNTRY_CURATION_OVERRIDES || {};
    Object.entries(countriesData).forEach(([code, country]) => {
      if (curatedCountryOverrides[code]) {
        mergeCountryCuration(country, curatedCountryOverrides[code]);
        sanitizeCountryData(country);
      }
    });
    mergeImportedConflictDetails(curatedConflictDetailOverrides);
    invalidateCountryDerivedCaches();
    deferredDataStatus.runtimeCuration = true;
    refreshLoadedCountryLayers();
    refreshGlobalStats();
    updateAppStatusPanel();
    rerenderCurrentPanel?.();
    return curation;
  }).catch(error => {
    console.warn("No se pudo cargar la curaduria diferida:", error);
    return {};
  });

  return loadRuntimeCurationPromise;
}

async function hydrateCountriesData(countriesJson, { refresh = false } = {}) {
  countriesData = countriesJson || {};
  invalidateCountryDerivedCaches();
  const countryEntries = Object.entries(countriesData);
  const batchSize = isMobileLayout() ? 6 : 8;
  for (let index = 0; index < countryEntries.length; index += 1) {
    const [code, country] = countryEntries[index];
    country.code = code;
    countryCodeLookup.set(country, code);
    sanitizeCountryData(country);
    if (index > 0 && index % batchSize === 0) {
      await yieldToMainThread();
    }
  }
  worldPopulationTotal = getCountryValues().reduce(
    (sum, country) => sum + (country.general?.population || 0),
    0
  );
  if (refresh) {
    refreshLoadedCountryLayers();
    refreshGlobalStats();
    rerenderCurrentPanel?.();
  }
}

async function loadCountryDetail(code) {
  const normalizedCode = String(code || "").trim();
  if (!normalizedCode) {
    return null;
  }
  if (!countriesData[normalizedCode]?.metadata?.isIndex) {
    return countriesData[normalizedCode] || null;
  }
  if (countryDetailPromises.has(normalizedCode)) {
    return countryDetailPromises.get(normalizedCode);
  }

  const promise = fetchResourceCached(`./data/countries/${encodeURIComponent(normalizedCode)}.json?v=${APP_VERSION}`, "json")
    .then(async country => {
      if (!country) {
        return countriesData[normalizedCode] || null;
      }
      country.code = normalizedCode;
      country.metadata = {
        ...(country.metadata || {}),
        isIndex: false
      };
      countriesData[normalizedCode] = country;
      invalidateCountryDerivedCaches();
      countryCodeLookup.set(country, normalizedCode);
      sanitizeCountryData(country);
      refreshLoadedCountryLayers();
      return country;
    })
    .catch(error => {
      console.warn(`No se pudo cargar detalle de ${normalizedCode}:`, error);
      return countriesData[normalizedCode] || null;
    });

  countryDetailPromises.set(normalizedCode, promise);
  return promise;
}

function getCountryConflictShardPath(country, code) {
  const shardPath = country?.military?.conflictsShard || country?.metadata?.publicProfile?.conflictsShard || "";
  if (shardPath) {
    return shardPath.startsWith("./") ? shardPath : `./${shardPath}`;
  }
  if (country?.military?.conflictsComplete === false && code) {
    return `./data/countries/conflicts/${encodeURIComponent(code)}.json`;
  }
  return "";
}

function hasCompleteCountryConflicts(country) {
  const conflicts = Array.isArray(country?.military?.conflicts) ? country.military.conflicts : [];
  const expectedCount = Number(country?.military?.conflictCount || country?.metadata?.publicProfile?.conflictCount || 0);
  return country?.military?.conflictsComplete !== false || (expectedCount > 0 && conflicts.length >= expectedCount);
}

async function loadCountryConflictDetail(code) {
  const normalizedCode = String(code || "").trim();
  if (!normalizedCode) {
    return null;
  }

  const country = countriesData[normalizedCode]?.metadata?.isIndex
    ? await loadCountryDetail(normalizedCode)
    : countriesData[normalizedCode];
  if (!country || hasCompleteCountryConflicts(country)) {
    return country || null;
  }
  if (countryConflictDetailPromises.has(normalizedCode)) {
    return countryConflictDetailPromises.get(normalizedCode);
  }

  const shardPath = getCountryConflictShardPath(country, normalizedCode);
  if (!shardPath) {
    return country;
  }

  const promise = fetchResourceCached(`${shardPath}${shardPath.includes("?") ? "&" : "?"}v=${APP_VERSION}`, "json")
    .then(conflicts => {
      if (!Array.isArray(conflicts)) {
        return country;
      }
      country.military = {
        ...(country.military || {}),
        conflicts,
        conflictCount: conflicts.length,
        conflictsPreviewCount: conflicts.length,
        conflictsComplete: true
      };
      delete country.military.conflictsShard;
      country.metadata = {
        ...(country.metadata || {}),
        publicProfile: {
          ...(country.metadata?.publicProfile || {}),
          conflictsSharded: false,
          conflictPreviewCount: conflicts.length,
          conflictCount: conflicts.length
        }
      };
      invalidateCountryDerivedCaches();
      return country;
    })
    .catch(error => {
      console.warn(`No se pudo cargar conflictos de ${normalizedCode}:`, error);
      return country;
    });

  countryConflictDetailPromises.set(normalizedCode, promise);
  return promise;
}

function shuffleArray(items) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function generateWorldPopulation() {
  const target = document.getElementById("world-population-total");
  target.textContent = formatNumber(worldPopulationTotal);
}

function generateTopPopulation() {
  const list = getCountryValues()
    .filter(country => (country.general?.population || 0) > 0)
    .sort((a, b) => (b.general.population || 0) - (a.general.population || 0))
    .slice(0, 10);

  renderInteractiveList("top-population", list.map(country => {
    const share = worldPopulationTotal
      ? (country.general.population / worldPopulationTotal) * 100
      : 0;
    return {
      label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(country.general.population)} - ${formatPercentage(share)})`,
      country
    };
  }));
}

function generateContinents() {
  const totals = {};

  getCountryValues().forEach(country => {
    const continent = country.continent || "Unknown";
    totals[continent] = (totals[continent] || 0) + (country.general?.population || 0);
  });

  renderInteractiveList("continents", Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([continent, total]) => {
      const share = worldPopulationTotal ? (total / worldPopulationTotal) * 100 : 0;
      return {
        label: `${translateContinentName(continent)} (${formatNumber(total)} - ${formatPercentage(share)})`,
        continent
      };
    }), item => {
      selectSearchResult({ label: translateContinentName(item.continent), type: "continent", value: item.continent });
    });
}

function generateReligions() {
  const target = document.getElementById("religions");
  if (!target) {
    return;
  }

  const familyTotals = new Map();

  getCountryValues().forEach(country => {
    const population = country.general?.population || 0;
    const composition = Array.isArray(country.religion?.composition) && country.religion.composition.length
      ? country.religion.composition
      : (country.religion?.summary ? [{ name: country.religion.summary, percentage: 100 }] : []);

    composition.forEach(entry => {
      if (!entry?.name || !entry?.percentage) {
        return;
      }

      const nominal = population * (entry.percentage / 100);
      const family = getReligionKeyAndLabel(entry.name);
      const denominationLabel = formatReligionDenominationLabel(entry.name, family.label);
      const denominationKey = normalizeText(denominationLabel);
      const familyEntry = familyTotals.get(family.key) || {
        key: family.key,
        label: family.label,
        total: 0,
        denominations: new Map()
      };

      familyEntry.total += nominal;
      if (denominationKey && denominationKey !== normalizeText(family.label)) {
        const denominationEntry = familyEntry.denominations.get(denominationKey) || {
          label: denominationLabel,
          total: 0
        };
        denominationEntry.total += nominal;
        familyEntry.denominations.set(denominationKey, denominationEntry);
      }
      familyTotals.set(family.key, familyEntry);
    });
  });

  const families = [...familyTotals.values()].sort((a, b) => b.total - a.total);

  target.innerHTML = families.map(family => {
    const share = worldPopulationTotal ? (family.total / worldPopulationTotal) * 100 : 0;
    const familyRankingKey = `religions:${normalizeText(family.label)}`;
    const denominations = [...family.denominations.values()]
      .sort((a, b) => b.total - a.total)
      .map(({ label, total }) => {
        const branchShare = worldPopulationTotal ? (total / worldPopulationTotal) * 100 : 0;
        const denominationRankingKey = `religion_denomination:${normalizeText(label)}`;
        return `
          <li class="rank-link religion-subrank-item${activeRankingKey === denominationRankingKey ? " is-active" : ""}" aria-pressed="${activeRankingKey === denominationRankingKey ? "true" : "false"}">
            <button type="button" data-religion-denomination="${escapeHtml(label)}" aria-pressed="${activeRankingKey === denominationRankingKey ? "true" : "false"}">
              ${escapeHtml(label)} (${formatNumber(Math.round(total))} - ${formatPercentage(branchShare)})
            </button>
          </li>
        `;
      })
      .join("");

    return `
      <li class="rank-link religion-group${activeRankingKey === familyRankingKey ? " is-active" : ""}" aria-pressed="${activeRankingKey === familyRankingKey ? "true" : "false"}">
        <button type="button" data-religion-family="${escapeHtml(family.label)}" aria-pressed="${activeRankingKey === familyRankingKey ? "true" : "false"}">
          ${escapeHtml(family.label)} (${formatNumber(Math.round(family.total))} - ${formatPercentage(share)})
        </button>
        ${denominations ? `<ul class="religion-subranking">${denominations}</ul>` : ""}
      </li>
    `;
  }).join("");

  target.querySelectorAll("[data-religion-family]").forEach(button => {
    button.addEventListener("click", () => {
      setActiveRankingItem(button.closest(".rank-link"), `religions:${normalizeText(button.dataset.religionFamily)}`);
      selectSearchResult({
        label: button.dataset.religionFamily,
        type: "religion",
        value: button.dataset.religionFamily
      });
    });
  });

  target.querySelectorAll("[data-religion-denomination]").forEach(button => {
    button.addEventListener("click", () => {
      setActiveRankingItem(button.closest(".rank-link"), `religion_denomination:${normalizeText(button.dataset.religionDenomination)}`);
      selectSearchResult({
        label: button.dataset.religionDenomination,
        type: "religion_denomination",
        value: button.dataset.religionDenomination
      });
    });
  });
}

function generateGdpRanking() {
  const list = getCountryValues()
    .filter(country => (country.economy?.gdp || 0) > 0)
    .sort((a, b) => (b.economy?.gdp || 0) - (a.economy?.gdp || 0))
    .slice(0, 10);

  renderInteractiveList("top-gdp", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (US$ ${compactNumber(country.economy.gdp)})`,
    country
  })));
}

function generateInflationRanking() {
  const list = getCountryValues()
    .filter(country => country.economy?.inflation || country.economy?.inflation === 0)
    .sort((a, b) => (b.economy?.inflation || 0) - (a.economy?.inflation || 0))
    .slice(0, 10);

  renderInteractiveList("top-inflation", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatInflation(country.economy.inflation)})`,
    country
  })));
}

function generateSystemRanking() {
  const totals = {};
  getCountryValues().forEach(country => {
    const key = normalizePoliticalSystemCategory(country.politics?.system);
    if (!key || key === "Sin datos") {
      return;
    }
    totals[key] = (totals[key] || 0) + 1;
  });

  renderInteractiveList("top-systems", Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([system, count]) => ({
      label: `${system} (${count})`,
      system
    })), item => {
      selectSearchResult({ label: item.system, type: "system", value: item.system });
    });
}

function getPickedCountryEntity(picked) {
  if (!picked) {
    return null;
  }

  const candidates = [
    picked.id,
    picked.primitive?.id,
    picked.collection?.owner,
    picked.primitive?._owner
  ];

  return candidates.find(candidate => candidate?.countryCode || candidate?.countryName) || null;
}

async function loadMap(bootPhase = false) {
  const requestedMode = currentMapMode;
  const geoJsonPath = getGeoJsonPathForCurrentMode(bootPhase);
  if (loadMapPromise && loadMapMode === requestedMode && loadMapPath === geoJsonPath) {
    return loadMapPromise;
  }

  const loadToken = ++mapOverlayLoadToken;
  loadMapMode = requestedMode;
  loadMapPath = geoJsonPath;
  countryAreaCache = {};
  initializeViewer();
  trimDataCaches();

  loadMapPromise = measureBootStep("loadMapOverlay", async () => {
    if (activeClickHandler) {
      activeClickHandler.destroy();
      activeClickHandler = null;
    }
    if (activeGeoJsonDataSource) {
      try {
        await viewer.dataSources.remove(activeGeoJsonDataSource, false);
      } catch (error) {
        console.error("No se pudo limpiar la capa GeoJSON anterior:", error);
      }
      activeGeoJsonDataSource = null;
    }
    countryLayers.clear();
    countryClickTargets.clear();
    markBootStepStart("geoJsonPrepare");
    const geojson = await getPreparedGeoJson(geoJsonPath, requestedMode);
    markBootStepEnd("geoJsonPrepare", { mode: requestedMode });
    if (loadToken !== mapOverlayLoadToken || requestedMode !== currentMapMode) {
      return;
    }
    const featureNameByCode = {};
    let dataSource = null;

    try {
      markBootStepStart("geoJsonCesiumLoad");
      dataSource = await Cesium.GeoJsonDataSource.load(geojson, {
        clampToGround: false
      });
      markBootStepEnd("geoJsonCesiumLoad", { mode: requestedMode });
      if (loadToken !== mapOverlayLoadToken || requestedMode !== currentMapMode) {
        return;
      }
      await viewer.dataSources.add(dataSource);
      activeGeoJsonDataSource = dataSource;
    } catch (error) {
      console.error("No se pudo cargar el GeoJSON 3D:", error);
      fitWorldView();
      return;
    }

    markBootStepStart("geoJsonEntityIndex");
    const entitiesByCode = new Map();
    dataSource.entities.values.forEach(entity => {
      const properties = entity.properties;
      const rawCode =
        properties?.ISO_A3?.getValue?.() ||
        properties?.iso_a3?.getValue?.() ||
        properties?.ADM0_A3?.getValue?.() ||
        properties?.ADM0_A3_US?.getValue?.() ||
        properties?.WB_A3?.getValue?.() ||
        properties?.BRK_A3?.getValue?.() ||
        properties?.SOV_A3?.getValue?.() ||
        properties?.GU_A3?.getValue?.() ||
        entity.id;
      const featureName =
        properties?.name?.getValue?.() ||
        properties?.ADMIN?.getValue?.() ||
        properties?.NAME?.getValue?.() ||
        properties?.formal_en?.getValue?.() ||
        properties?.NAME_EN?.getValue?.() ||
        rawCode;
      const code = resolveCountryCode(rawCode, featureName) || rawCode;

      if (!code) {
        return;
      }

      registerCountryAlias(featureName, code, true);
      featureNameByCode[code] = countriesData[code]?.name || featureName;
      entity.countryCode = code;
      entity.countryName = countriesData[code]?.name || featureName;
      if (entity.polygon) {
        entity.polygon.height = 0;
        entity.polygon.perPositionHeight = false;
        entity.polygon.outline = false;
        entity.polygon.arcType = Cesium.ArcType.GEODESIC;
        if (requestedMode === "2d") {
          entity.polygon.granularity = Cesium.Math.RADIANS_PER_DEGREE * 1.2;
        }
      }
      const list = entitiesByCode.get(code) || [];
      list.push(entity);
      entitiesByCode.set(code, list);
    });

    entitiesByCode.forEach((entities, code) => {
      const layer = new CesiumCountryLayer(code, entities, featureNameByCode[code] || code);
      layer.setStyle(getCountryThemeStyle(code));
      countryLayers.set(code, layer);
    });
    markBootStepEnd("geoJsonEntityIndex", { entities: dataSource.entities.values.length, countries: entitiesByCode.size });

    const clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    activeClickHandler = clickHandler;
    let hoveredLayer = null;
    let hoverFramePending = false;
    let pendingHoverLayer = null;
    let lastHoverCode = "";

    function restoreHover() {
      if (hoveredLayer && !selectedLayers.includes(hoveredLayer)) {
        hoveredLayer.setStyle(getCountryThemeStyle(hoveredLayer.code));
      }
      hoveredLayer = null;
      lastHoverCode = "";
    }

    clickHandler.setInputAction(async movement => {
    emitMapEvent("click");
    const picked = viewer.scene.pick(movement.position);
    const pickedEntity = getPickedCountryEntity(picked);
    const rawCode = pickedEntity?.countryCode;
    const featureName = pickedEntity?.countryName;
    const code = resolveCountryCode(rawCode, featureName) || rawCode;

    if (!code) {
      clearSelection();
      if (featureName) {
        const aliasCode = resolveCountryCode("", featureName);
        if (aliasCode && await openCountryByCode(aliasCode, featureName, { focusMap: false })) {
          return;
        }
        renderEmpty(featureName);
      }
      return;
    }

    const country = countriesData[code] || await loadCountryDetail(code);
    if (!country) {
      clearSelection();
      const aliasCode = resolveCountryCode("", featureName || code);
      if (aliasCode && await openCountryByCode(aliasCode, featureName || code, { focusMap: false })) {
        return;
      }
      renderEmpty(featureName || code);
      return;
    }

    const linkedLayers = getCountrySelectionLayers(code, featureName || country.name);
    if (
      selectionMode === "country" &&
      selectedLayers.length === linkedLayers.length &&
      linkedLayers.length &&
      linkedLayers.every((layer, index) => selectedLayers[index] === layer)
    ) {
      await renderCountry(country, featureName || country.name);
      requestMapRenderSafe("country-click-repeat");
      return;
    }
    await openCountryByCode(code, featureName || country.name);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    clickHandler.setInputAction(movement => {
    if (!shouldUseHoverHighlights()) {
      restoreHover();
      requestSceneRender();
      return;
    }

    const now = Date.now();
    const hoverSampleWindow = typeof mapInteractionCore.getHoverSampleWindow === "function"
      ? mapInteractionCore.getHoverSampleWindow({
          isMobile: isMobileLayout(),
          mode: currentMapMode,
          reducedMotion: reducedPerformanceMode
        })
      : (isMobileLayout() ? 56 : currentMapMode === "2d" ? 42 : 28);
    if (now - lastHoverSampleAt < hoverSampleWindow) {
      return;
    }
    lastHoverSampleAt = now;

    const picked = viewer.scene.pick(movement.endPosition);
    const pickedEntity = getPickedCountryEntity(picked);
    const code = resolveCountryCode(pickedEntity?.countryCode, pickedEntity?.countryName) || pickedEntity?.countryCode;
    const layer = code ? getCountryLayerByCodeOrName(code, pickedEntity?.countryName || "") : null;
    const hoverCode = layer?.code || "";

    if (hoverCode === lastHoverCode) {
      return;
    }

    pendingHoverLayer = layer || null;
    lastHoverCode = hoverCode;

    if (hoverFramePending) {
      return;
    }

    hoverFramePending = true;
    requestAnimationFrame(() => {
      hoverFramePending = false;
      const nextLayer = pendingHoverLayer;

      if (!nextLayer) {
        restoreHover();
        requestSceneRender();
        return;
      }

      if (hoveredLayer === nextLayer) {
        return;
      }

      if (hoveredLayer && hoveredLayer !== nextLayer && !selectedLayers.includes(hoveredLayer)) {
        hoveredLayer.setStyle(getCountryThemeStyle(hoveredLayer.code));
      }

        hoveredLayer = nextLayer;
        if (!selectedLayers.includes(nextLayer)) {
          const baseStyle = getCountryThemeStyle(nextLayer.code);
          nextLayer.setStyle({
            ...baseStyle,
            color: currentTheme === "default" ? "#c7efff" : "#f4fbff",
            weight: Math.max((baseStyle.weight || 1.4) + 1.15, 2.8),
            fillOpacity: Math.min(
              (baseStyle.fillOpacity || 0.12) + (currentTheme === "default" ? 0.02 : 0.04),
              currentTheme === "default" ? 0.15 : 0.22
            )
          });
        }
        requestSceneRender();
      });
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    registerFeatureNameAliases(featureNameByCode);
    if (!bootPhase) {
      applyImageryForMode(false);
    }
    fitWorldView();
    renderMapLabels();
    scheduleGeoJsonWarmup();
  }).finally(() => {
    if (loadMapMode === requestedMode && loadMapPath === geoJsonPath) {
      loadMapPromise = null;
    }
  });

  return loadMapPromise;
}

async function waitForMapBootReady(timeoutMs = 2600) {
  if (!viewer?.scene) {
    return;
  }

  await new Promise(resolve => {
    let settled = false;
    let renderedOnce = false;
    let tilesReady = Boolean(viewer.scene.globe?.tilesLoaded);
    let timeoutId = null;
    let quickReadyId = null;

    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (quickReadyId) {
        clearTimeout(quickReadyId);
      }
      viewer?.scene?.postRender?.removeEventListener(onPostRender);
      viewer?.scene?.globe?.tileLoadProgressEvent?.removeEventListener(onTileProgress);
      resolve();
    };

    const maybeFinish = () => {
      if (renderedOnce && tilesReady) {
        finish();
      }
    };

    const onPostRender = () => {
      renderedOnce = true;
      maybeFinish();
    };

    const onTileProgress = remainingTiles => {
      tilesReady = remainingTiles === 0;
      maybeFinish();
    };

    viewer.scene.postRender.addEventListener(onPostRender);
    viewer.scene.globe?.tileLoadProgressEvent?.addEventListener(onTileProgress);
    quickReadyId = setTimeout(() => {
      if (renderedOnce) {
        finish();
      }
    }, Math.min(timeoutMs, isMobileLayout() ? 900 : 650));
    timeoutId = setTimeout(finish, timeoutMs);
    requestSceneRender();
  });
}

function scheduleDetailedOverlayUpgrade() {
  if (detailedOverlayUpgradeTimer) {
    clearTimeout(detailedOverlayUpgradeTimer);
    detailedOverlayUpgradeTimer = null;
  }

  if (currentMapMode !== "3d" || isMobileLayout()) {
    return;
  }

  const detailedPath = "./data/world_countries.geo.json";
  if (loadMapPath === detailedPath) {
    return;
  }
  if (
    typeof mapCore.shouldDeferDetailedGeometry === "function" &&
    mapCore.shouldDeferDetailedGeometry({
      mode: currentMapMode,
      isMobile: isMobileLayout(),
      zoomBucket: getCurrentOverlayBucket(),
      bootPhase: false
    })
  ) {
    return;
  }

  const scheduleUpgrade = () => {
    detailedOverlayUpgradeTimer = null;
    if (currentMapMode !== "3d") {
      return;
    }
    if (Date.now() - lastInteractionAt < 3000) {
      detailedOverlayUpgradeTimer = setTimeout(scheduleUpgrade, 3000);
      return;
    }
    loadMap(false)
      .then(() => {
        lastOverlayBucket = getCurrentOverlayBucket();
        renderMapLabels();
        viewer?.scene?.requestRender?.();
      })
      .catch(error => {
        console.warn("No se pudo aplicar la capa detallada del globo tras el arranque:", error);
      });
  };

  detailedOverlayUpgradeTimer = setTimeout(scheduleUpgrade, isMobileLayout() ? 7000 : 5200);
}

async function handleCountryPanelInteraction(event) {
  await ensureDeferredUiModule("countryPanel");
  if (typeof countryPanelUi.handleInteraction !== "function") {
    return false;
  }

  return countryPanelUi.handleInteraction(event, {
    document,
    storage: localStorage,
    getState: () => currentPanelState,
    getCountriesData: () => countriesData,
    getCompareSelection: () => compareSelection,
    getLanguage: () => currentLanguage,
    getNoDataLabel: () => t("noData"),
    openCountryByCode,
    activateCountrySection,
    rerenderCurrentPanel,
    addCountryToCompare,
    openCompareModal,
    renderComparePanel,
    showToast: message => uiPolish.showToast?.(message),
    openTimelineModal,
    openConflictModal,
    isMobileLayout,
    exportNodeAsPdf,
    exportNodeAsImage,
    shareText,
    formatNumber,
    searchByQuery
  });
}

function setupSearchEvents() {
  const input = document.getElementById("map-search-input");
  const button = document.getElementById("map-search-button");
  const saveButton = document.getElementById("save-search-button");
  const suggestionBox = document.getElementById("search-suggestions");
  const searchMemory = document.getElementById("search-memory");
  const countryPanel = document.getElementById("country-panel");
  const countryModal = document.getElementById("country-modal");
  const countryModalClose = document.getElementById("country-modal-close");
  const leftPanel = document.getElementById("left-panel");
  const newsHubPanel = document.getElementById("news-hub-panel");
  const compareModal = document.getElementById("compare-modal");
  const conflictModal = document.getElementById("conflict-modal");
  const timelineModal = document.getElementById("timeline-modal");
  const conflictCloseButton = document.getElementById("conflict-modal-close");
  const timelineCloseButton = document.getElementById("timeline-modal-close");
  let activeIndex = -1;
  let currentSuggestions = [];

  if (searchMemory) {
    searchMemory.hidden = true;
  }

  button.addEventListener("click", () => {
    hideSuggestions();
    activeIndex = -1;
    currentSuggestions = [];
    searchMap();
  });
  saveButton?.addEventListener("click", () => {
    saveCurrentSearch(input.value);
  });

  input.addEventListener("input", () => {
    activeIndex = -1;
    currentSuggestions = renderSuggestions(input.value, activeIndex);
  });

  input.addEventListener("focus", () => {
    activeIndex = -1;
    currentSuggestions = renderSuggestions(input.value, activeIndex);
    if (!input.value.trim()) {
      renderSearchMemory();
    }
  });

  input.addEventListener("keydown", async event => {
    if (event.key === "ArrowDown" && currentSuggestions.length) {
      event.preventDefault();
      activeIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % currentSuggestions.length;
      renderSuggestions(input.value, activeIndex);
      return;
    }

    if (event.key === "ArrowUp" && currentSuggestions.length) {
      event.preventDefault();
      activeIndex = activeIndex < 0
        ? currentSuggestions.length - 1
        : (activeIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
      renderSuggestions(input.value, activeIndex);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && currentSuggestions[activeIndex]) {
        await selectSearchResult(currentSuggestions[activeIndex]);
        activeIndex = -1;
        currentSuggestions = [];
        return;
      }

      hideSuggestions();
      activeIndex = -1;
      currentSuggestions = [];
      await searchMap();
      return;
    }

    if (event.key === "Escape") {
      hideSuggestions();
      activeIndex = -1;
      currentSuggestions = [];
    }
  });

  suggestionBox.addEventListener("mousedown", event => {
    const buttonElement = event.target.closest(".search-suggestion");
    if (!buttonElement) {
      return;
    }

    event.preventDefault();
  });

  suggestionBox.addEventListener("click", async event => {
    const buttonElement = event.target.closest(".search-suggestion");
    if (!buttonElement) {
      return;
    }

    await selectSearchResult({
      label: buttonElement.dataset.label,
      type: buttonElement.dataset.type,
      value: buttonElement.dataset.value
    });
    activeIndex = -1;
    currentSuggestions = [];
  });

  document.addEventListener("click", event => {
    if (!event.target.closest("#search-bar")) {
      hideSuggestions();
      activeIndex = -1;
      currentSuggestions = [];
    }
  });

  searchMemory?.addEventListener("click", async event => {
    const chip = event.target.closest("[data-search-memory]");
    if (!chip) {
      return;
    }

    input.value = chip.dataset.searchMemory;
    await searchMap();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeCountryModal();
      closeCompareModal();
      closeConflictModal();
      closeTimelineModal();
    }
  });

  countryModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-country-modal='true']")) {
      closeCountryModal();
    }
  });

  countryModalClose?.addEventListener("click", () => closeCountryModal());

  conflictModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-conflict-modal='true']")) {
      closeConflictModal();
    }
  });

  timelineModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-timeline-modal='true']")) {
      closeTimelineModal();
    }
  });

  conflictCloseButton?.addEventListener("click", () => closeConflictModal());
  timelineCloseButton?.addEventListener("click", () => closeTimelineModal());

  newsHubPanel?.addEventListener("click", async event => {
    const newsButton = event.target.closest("[data-news-country]");
    if (!newsButton) {
      return;
    }

    await showNewsArticle(newsButton.dataset.newsCountry);
  });

  leftPanel?.addEventListener("click", async event => {
    const exportTrigger = event.target.closest("[data-export-target]");
    if (exportTrigger) {
      const target = document.getElementById(exportTrigger.dataset.exportTarget);
      if (exportTrigger.dataset.exportFormat === "pdf") {
        await exportNodeAsPdf(target, `${exportTrigger.dataset.exportTarget}.pdf`);
      } else {
        await exportNodeAsImage(target, `${exportTrigger.dataset.exportTarget}.png`);
      }
      return;
    }

    const shareTrigger = event.target.closest("[data-share-target]");
    if (shareTrigger) {
      const target = document.getElementById(shareTrigger.dataset.shareTarget);
      if (target) {
        await shareText(
          currentLanguage === "en" ? "GeoRisk rankings" : "Rankings GeoRisk",
          target.innerText.trim()
        );
      }
      }
    });

  compareModal?.addEventListener("click", async event => {
    const exportTrigger = event.target.closest("[data-export-target]");
    if (exportTrigger) {
      const target = document.getElementById(exportTrigger.dataset.exportTarget);
      if (target) {
        if (exportTrigger.dataset.exportFormat === "pdf") {
          await exportNodeAsPdf(target, `${exportTrigger.dataset.exportTarget}.pdf`);
        } else {
          await exportNodeAsImage(target, `${exportTrigger.dataset.exportTarget}.png`);
        }
      }
      return;
    }

    const shareTrigger = event.target.closest("[data-share-target]");
    if (shareTrigger) {
      const target = document.getElementById(shareTrigger.dataset.shareTarget);
      if (target) {
        await shareText(
          currentLanguage === "en" ? "GeoRisk comparison" : "Comparacion GeoRisk",
          target.innerText.trim()
        );
      }
    }
  });

  countryPanel?.addEventListener("click", event => {
    handleCountryPanelInteraction(event).catch(error => {
      console.warn("No se pudo procesar la interaccion de la ficha pais:", error);
    });
  });
}

function setupThemeControls() {
  const toolbar = document.getElementById("map-toolbar");
  const themeSelect = document.getElementById("theme-select");
  const themeFilterInput = document.getElementById("theme-filter-input");
  const themeQuickGrid = document.getElementById("theme-quick-grid");
  const languageSelect = document.getElementById("language-select");
  const qualityPresetSelect = document.getElementById("quality-preset-select");
  const labelModeSelect = document.getElementById("label-mode-select");
  const worldViewButton = document.getElementById("world-view-button");
  const autoRotateButton = document.getElementById("auto-rotate-button");
  const resetButton = document.getElementById("reset-view-button");
  const applyFiltersButton = document.getElementById("apply-filters-button");
  const saveFiltersButton = document.getElementById("save-filters-button");
  const savedFiltersSelect = document.getElementById("saved-filters-select");
  const presentationButton = document.getElementById("presentation-mode-button");
  const religionFilter = document.getElementById("filter-religion-select");
  const systemFilter = document.getElementById("filter-system-select");
  const organizationFilter = document.getElementById("filter-organization-select");
  const historyTypeFilter = document.getElementById("filter-history-type-select");
  const originFilter = document.getElementById("filter-origin-select");
  const rivalFilter = document.getElementById("filter-rival-select");

  themeSelect.value = currentTheme;
  languageSelect.value = currentLanguage;
  if (qualityPresetSelect) {
    qualityPresetSelect.value = qualityPreset;
  }
  if (labelModeSelect) {
    labelModeSelect.value = labelMode;
  }
  renderThemeLegend();
  renderThemeSummary();
  renderThemePicker();
  syncLayersPanelState();
  updateStaticText();
  setAutoRotateState(autoRotateEnabled);

  const religionOptions = getUniqueDisplayLabels(RELIGION_FAMILY_RULES.map(rule => rule.label));
  religionFilter.innerHTML += religionOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const systemOptions = getUniqueDisplayLabels(
    getCountryValues()
      .map(country => normalizePoliticalSystemCategory(country.politics?.system))
      .filter(label => label && label !== "Sin datos")
  );
  systemFilter.innerHTML += systemOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const organizationOptions = getUniqueDisplayLabels(
    getCountryValues()
      .flatMap(country => (country.politics?.organizations || []).map(organization => normalizeCategoryLabel(getOrganizationDisplayName(organization))))
      .filter(Boolean)
  );
  organizationFilter.innerHTML += organizationOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const historyTypeOptions = getUniqueDisplayLabels(
    getCountryValues()
      .map(country => getHistoryTypeLabel(country))
      .filter(label => label && label !== "Sin datos")
  );
  historyTypeFilter.innerHTML += historyTypeOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const originOptions = getUniqueDisplayLabels(
    getCountryValues()
      .map(country => getOriginLabel(country))
      .filter(label => label && label !== "Sin datos")
  );
  originFilter.innerHTML += originOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const rivalOptions = getUniqueDisplayLabels(
    getCountryValues()
      .flatMap(country => (country.politics?.rivals || []).map(rival => normalizeCategoryLabel(rival?.name || rival)))
      .filter(label => label && label !== "Sin datos")
  );
  rivalFilter.innerHTML += rivalOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  themeSelect.addEventListener("change", event => {
    setTheme(event.target.value);
  });

  themeFilterInput?.addEventListener("input", renderThemePicker);

  themeQuickGrid?.addEventListener("click", event => {
    const button = event.target.closest("[data-theme-picker]");
    if (!button) {
      return;
    }
    setTheme(button.dataset.themePicker || "default");
    uiPolish.showToast?.(`${currentLanguage === "en" ? "Layer applied" : "Capa aplicada"}: ${getThemeOptionLabel(currentTheme)}`);
  });

  toolbar?.addEventListener("toggle", syncLayersPanelState);

  languageSelect.addEventListener("change", event => {
    currentLanguage = event.target.value;
    appStore?.setState({ language: currentLanguage }, "language");
    localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
    updateStaticText();
    updateExtendedStaticText();
    renderSavedViews();
    renderFavoriteViews();
    refreshGlobalStats();
    renderThemeLegend();
    renderThemeSummary();
    renderThemePicker();
    renderComparePanel();
    renderMapLabels();
    uiPolish.enhanceTooltips?.();
    rerenderCurrentPanel();
  });

  qualityPresetSelect?.addEventListener("change", event => {
    qualityPreset = event.target.value || "auto";
    localStorage.setItem(STORAGE_KEYS.qualityPreset, qualityPreset);
    updateMapInteractionTuning();
    updateAppStatusPanel();
  });

  labelModeSelect?.addEventListener("change", event => {
    labelMode = event.target.value || "none";
    localStorage.setItem(STORAGE_KEYS.labelMode, labelMode);
    renderMapLabels();
    updateAppStatusPanel();
  });

  worldViewButton?.addEventListener("click", () => {
    lastInteractionAt = Date.now();
    clearSelection();
    fitWorldView();
    closeCountryModal();
  });

  autoRotateButton?.addEventListener("click", () => {
    setAutoRotateState(!autoRotateEnabled);
    lastInteractionAt = 0;
  });

  applyFiltersButton.addEventListener("click", applyFilters);

  saveFiltersButton.addEventListener("click", () => {
    const filters = getFilterState();
    const labelParts = [
      filters.continent && translateContinentName(filters.continent),
      filters.religion,
      filters.system,
      filters.organization,
      filters.historyType,
      filters.origin,
      filters.rival,
      filters.minPopulation ? `${currentLanguage === "en" ? "Min pop" : "Pob min"} ${compactNumber(filters.minPopulation)}` : ""
    ].filter(Boolean);

    if (!labelParts.length) {
      return;
    }

    savedFilters.unshift({
      name: labelParts.join(" / "),
      filters
    });
    savedFilters = savedFilters.slice(0, 8);
    persistSavedFilters();
    renderSavedFilters();
  });

  savedFiltersSelect.addEventListener("change", event => {
    const selected = savedFilters[Number(event.target.value)];
    if (!selected) {
      return;
    }

    document.getElementById("filter-continent-select").value = selected.filters.continent;
    document.getElementById("filter-religion-select").value = selected.filters.religion;
    document.getElementById("filter-system-select").value = selected.filters.system;
    document.getElementById("filter-organization-select").value = selected.filters.organization || "";
    document.getElementById("filter-history-type-select").value = selected.filters.historyType || "";
    document.getElementById("filter-origin-select").value = selected.filters.origin || "";
    document.getElementById("filter-rival-select").value = selected.filters.rival || "";
    document.getElementById("filter-population-select").value = selected.filters.minPopulation ? String(selected.filters.minPopulation) : "";
    applyFilters();
  });

  resetButton.addEventListener("click", () => {
    clearSelection();
    fitWorldView();
    dismissSearchInput();
  });

  presentationButton.addEventListener("click", () => {
    const enabled = appMode !== "presentation";
    applyAppMode(enabled ? "presentation" : "default");
    updateStaticText();
    closeMobilePanels();
  });
};

function clearQuizTimer() {
  if (quizState.timerId) {
    clearInterval(quizState.timerId);
    quizState.timerId = null;
  }
}

function updateQuizMeta() {
  const best = Number(localStorage.getItem("geo-risk-quiz-best-streak") || quizState.bestStreak || 0);
  if (typeof quizUi.renderMeta === "function" && quizUi.renderMeta({
    document,
    quizState,
    currentLanguage,
    best
  })) {
    return;
  }

  const meta = document.getElementById("quiz-meta");
  if (meta) {
    meta.textContent = `${currentLanguage === "en" ? "Streak" : "Racha"}: ${quizState.streak || 0} · ${currentLanguage === "en" ? "Best" : "Mejor"}: ${best}`;
  }
}

function buildQuizQuestion(category) {
  if (typeof quizUi.buildQuestionBank === "function" && typeof quizUi.buildQuestionFromBank === "function") {
    if (!quizQuestionBank.length) {
      quizQuestionBank = quizUi.buildQuestionBank(countriesData, {
        translateContinentName,
        getReligionSummaryLabel,
        normalizePoliticalSystemCategory,
        getFlagEmoji
      });
    }
    const generatedQuestion = quizUi.buildQuestionFromBank(quizQuestionBank, countriesData, { ...quizState, category }, {
      translateContinentName,
      getReligionSummaryLabel,
      normalizePoliticalSystemCategory
    });
    if (generatedQuestion) {
      return generatedQuestion;
    }
  }

  const pool = getCountryEntries()
    .filter(([code, country]) => !quizState.asked.includes(code) && country.general?.capital?.name);
  if (!pool.length) {
    return null;
  }
  const [code, country] = shuffleArray(pool)[0];
  const correct = country.general.capital.name;
  const distractors = shuffleArray(getCountryValues()
    .map(item => item.general?.capital?.name)
    .filter(Boolean)
    .filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  if (distractors.length < 3) {
    return null;
  }
  return {
    code,
    prompt: `Cual es la capital de ${country.name}?`,
    correct,
    options: shuffleArray([correct, ...distractors]),
    answered: false,
    explanation: `${currentLanguage === "en" ? "Source" : "Fuente"}: dataset GeoRisk.`
  };
}
function renderQuizPanel() {
  if (typeof quizUi.renderPanel === "function" && quizUi.renderPanel({
    document,
    quizState,
    currentLanguage,
    best: Number(localStorage.getItem("geo-risk-quiz-best-streak") || quizState.bestStreak || 0),
    escapeHtml
  })) {
    return;
  }

  const status = document.getElementById("quiz-status");
  const question = document.getElementById("quiz-question");
  const options = document.getElementById("quiz-options");
  const nextButton = document.getElementById("quiz-next-button");
  const resetButton = document.getElementById("quiz-reset-button");
  if (!status || !question || !options || !nextButton || !resetButton) return;
  status.textContent = quizState.total ? `${quizState.score}/${quizState.total}` : (currentLanguage === "en" ? "Loading quiz..." : "Cargando quiz...");
  question.textContent = quizState.current?.prompt || "";
  options.innerHTML = "";
  nextButton.hidden = true;
  resetButton.hidden = !quizState.total;
}

function startQuizTimer() {
  clearQuizTimer();
  if (quizState.mode !== "timed") {
    quizState.timeLeft = 0;
    updateQuizMeta();
    return;
  }
  quizState.timeLeft = quizState.difficulty === "hard" ? 12 : quizState.difficulty === "medium" ? 18 : 25;
  updateQuizMeta();
  quizState.timerId = setInterval(() => {
    quizState.timeLeft -= 1;
    updateQuizMeta();
    if (quizState.timeLeft <= 0) {
      clearQuizTimer();
      if (quizState.current && !quizState.current.answered) answerQuiz("__timeout__");
    }
  }, 1000);
}

async function startQuiz() {
  const categorySelect = document.getElementById("quiz-category");
  const difficultySelect = document.getElementById("quiz-difficulty");
  const modeSelect = document.getElementById("quiz-mode");
  await ensureDeferredUiModule("quiz");
  quizState = {
    category: categorySelect?.value || "capital",
    difficulty: difficultySelect?.value || "easy",
    mode: modeSelect?.value || "classic",
    asked: [],
    score: 0,
    total: 0,
    current: null,
    feedback: null,
    streak: 0,
    bestStreak: Number(localStorage.getItem("geo-risk-quiz-best-streak") || 0),
    mistakes: [],
    achievements: [],
    timeLeft: 0,
    timerId: null
  };
  nextQuizQuestion();
}

function nextQuizQuestion() {
  clearQuizTimer();
  const question = buildQuizQuestion(quizState.category);
  quizState.current = question;
  quizState.feedback = null;
  renderQuizPanel();
  startQuizTimer();
}

function answerQuiz(answer) {
  if (!quizState.current || quizState.current.answered) return;
  clearQuizTimer();
  quizState.total += 1;
  const isCorrect = normalizeText(answer) === normalizeText(quizState.current.correct);
  if (isCorrect) {
    quizState.score += 1;
    quizState.streak += 1;
    quizState.bestStreak = Math.max(quizState.bestStreak || 0, quizState.streak);
    localStorage.setItem("geo-risk-quiz-best-streak", String(quizState.bestStreak));
    if (quizState.streak === 5) {
      quizState.achievements = [...(quizState.achievements || []), currentLanguage === "en" ? "5-answer streak" : "Racha de 5"];
    }
  } else {
    quizState.streak = 0;
    quizState.mistakes = [...(quizState.mistakes || []), {
      prompt: quizState.current.prompt,
      correct: quizState.current.correct,
      category: quizState.category
    }].slice(-10);
  }
  quizState.asked.push(quizState.current.code);
  quizState.current.answered = true;
  const feedbackTitle = isCorrect
    ? (currentLanguage === "en" ? "Well answered" : "Bien respondido")
    : (answer === "__timeout__"
        ? (currentLanguage === "en" ? "Time expired" : "Tiempo agotado")
        : (currentLanguage === "en" ? "Correct answer" : "Respuesta correcta"));
  quizState.feedback = {
    kind: isCorrect ? "ok" : "error",
    title: feedbackTitle,
    body: quizState.current.explanation || `${currentLanguage === "en" ? "Answer" : "Respuesta"}: ${quizState.current.correct}. ${currentLanguage === "en" ? "Category" : "Categoria"}: ${quizState.category}.`
  };
  quizUi.renderFeedback?.({ document, feedback: quizState.feedback, escapeHtml });

  document.querySelectorAll(".quiz-option").forEach(button => {
    const buttonAnswer = button.dataset.quizAnswer || "";
    const correct = normalizeText(buttonAnswer) === normalizeText(quizState.current.correct);
    const selected = normalizeText(buttonAnswer) === normalizeText(answer);
    button.classList.toggle("is-correct", correct);
    button.classList.toggle("is-wrong", selected && !correct);
    button.disabled = true;
  });

  document.getElementById("quiz-status").textContent = isCorrect
    ? `Correcto. Puntaje: ${quizState.score}/${quizState.total}`
    : `${answer === "__timeout__" ? "Tiempo agotado." : "Incorrecto."} Respuesta correcta: ${quizState.current.correct}. Puntaje: ${quizState.score}/${quizState.total}`;
  document.getElementById("quiz-next-button").hidden = false;
  updateQuizMeta();
};

setupQuizControls = function setupQuizControls() {
  const startButton = document.getElementById("quiz-start-button");
  const nextButton = document.getElementById("quiz-next-button");
  const resetButton = document.getElementById("quiz-reset-button");
  const categorySelect = document.getElementById("quiz-category");
  const difficultySelect = document.getElementById("quiz-difficulty");
  const modeSelect = document.getElementById("quiz-mode");
  const exportButton = document.getElementById("quiz-export-button");
  const options = document.getElementById("quiz-options");
  if (!startButton || !nextButton || !resetButton || !categorySelect || !difficultySelect || !modeSelect || !options) return;

  startButton.addEventListener("click", () => startQuiz());
  nextButton.addEventListener("click", () => nextQuizQuestion());
  resetButton.addEventListener("click", () => {
    clearQuizTimer();
    quizState = {
      category: categorySelect.value || "capital",
      difficulty: difficultySelect.value || "easy",
      mode: modeSelect.value || "classic",
      asked: [],
      score: 0,
      total: 0,
      current: null,
      feedback: null,
      streak: 0,
      bestStreak: Number(localStorage.getItem("geo-risk-quiz-best-streak") || 0),
      mistakes: [],
      achievements: [],
      timeLeft: 0,
      timerId: null
    };
    renderQuizPanel();
  });
  categorySelect.addEventListener("change", () => { quizState.category = categorySelect.value || "capital"; renderQuizPanel(); });
  difficultySelect.addEventListener("change", () => { quizState.difficulty = difficultySelect.value || "easy"; renderQuizPanel(); });
  modeSelect.addEventListener("change", () => { quizState.mode = modeSelect.value || "classic"; renderQuizPanel(); });
  exportButton?.addEventListener("click", () => {
    const text = typeof quizUi.buildResultsExport === "function"
      ? quizUi.buildResultsExport(quizState, currentLanguage)
      : `Puntaje: ${quizState.score}/${quizState.total}`;
    shareText(currentLanguage === "en" ? "GeoRisk quiz results" : "Resultados del quiz GeoRisk", text);
  });
  options.addEventListener("click", event => {
    const button = event.target.closest("[data-quiz-answer]");
    if (button) answerQuiz(button.dataset.quizAnswer || "");
  });
  renderQuizPanel();
};

function setupRankingsPanel() {
  const rankingsPanel = document.getElementById("rankings-panel");
  if (!rankingsPanel) {
    return;
  }
  const continentFilter = document.getElementById("rankings-continent-filter");
  const populationFilter = document.getElementById("rankings-population-filter");
  if (continentFilter && continentFilter.options.length <= 1) {
    [...new Set(getCountryValues().map(country => country.continent).filter(Boolean))]
      .sort((a, b) => translateContinentName(a).localeCompare(translateContinentName(b), "es"))
      .forEach(continent => {
        const option = document.createElement("option");
        option.value = continent;
        option.textContent = translateContinentName(continent);
        continentFilter.appendChild(option);
      });
  }
  [continentFilter, populationFilter].forEach(filter => {
    filter?.addEventListener("change", () => {
      advancedRankingCache.invalidate();
      if (rankingsPanel.open) {
        generateAdvancedRankings();
      }
    });
  });

  rankingsPanel.open = false;
  syncRankingActiveSummary("");
  rankingsPanel.addEventListener("toggle", () => {
    if (rankingsPanel.open && !deferredGlobalStatsReady) {
      scheduleDeferredGlobalStats(true);
    }
  });
}

function setupRankingGroups() {
  const container = document.querySelector("#rankings-panel .left-panel-inner");
  if (!container) {
    return;
  }

  const looseHeadings = [...container.querySelectorAll(":scope > h3[id]")];
  looseHeadings.forEach(heading => {
    const nextSibling = heading.nextElementSibling;
    if (!nextSibling || !["UL", "P", "DIV"].includes(nextSibling.tagName)) {
      return;
    }

    const wrapper = document.createElement("details");
    wrapper.className = "ranking-group";
    const summary = document.createElement("summary");
    const titleHolder = document.createElement("span");
    summary.appendChild(titleHolder);
    wrapper.appendChild(summary);

    const content = document.createElement("div");
    content.className = "ranking-group-content";

    heading.replaceWith(wrapper);
    titleHolder.appendChild(heading);
    content.appendChild(nextSibling);
    wrapper.appendChild(content);
  });
}

function setupNewsHubPanel() {
  const panel = document.getElementById("news-hub-panel");
  const filterInput = document.getElementById("news-country-filter");
  const topicSelect = document.getElementById("news-topic-select");
  let filterTimer = null;
  if (!panel) {
    return;
  }

  panel.open = false;
  topicSelect?.addEventListener("change", () => {
    activeNewsTopic = topicSelect.value || "general";
    newsCache.clear();
    if (panel.open) {
      renderNewsHub(currentPanelState.code || "");
    }
  });
  filterInput?.addEventListener("input", () => {
    if (filterTimer) {
      clearTimeout(filterTimer);
    }
    filterTimer = setTimeout(() => {
      if (panel.open) {
        renderNewsHub(currentPanelState.code || "");
      }
    }, 120);
  });
  panel.addEventListener("toggle", () => {
    if (panel.open) {
      closeMobilePanels();
      const comparePanel = document.getElementById("compare-hub-panel");
      const quizPanel = document.getElementById("quiz-hub-panel");
      if (comparePanel) comparePanel.open = false;
      if (quizPanel) quizPanel.open = false;
      ensureDeferredUiModule("news").then(() => renderNewsHub(currentPanelState.code || ""));
      renderNewsHub(currentPanelState.code || "");
    }
  });
}

function setupQuizHubPanel() {
  const panel = document.getElementById("quiz-hub-panel");
  if (!panel) {
    return;
  }

  panel.open = false;
  panel.addEventListener("toggle", () => {
    if (!panel.open) {
      return;
    }
    closeMobilePanels();
    const comparePanel = document.getElementById("compare-hub-panel");
    const newsPanel = document.getElementById("news-hub-panel");
    if (comparePanel) comparePanel.open = false;
    if (newsPanel) newsPanel.open = false;
    ensureDeferredUiModule("quiz").then(renderQuizPanel);
    renderQuizPanel();
  });
}

function setupCompareHubPanel() {
  const panel = document.getElementById("compare-hub-panel");
  if (!panel) {
    return;
  }

  panel.open = false;
  panel.addEventListener("toggle", () => {
    if (!panel.open) {
      return;
    }
    closeMobilePanels();
    const quizPanel = document.getElementById("quiz-hub-panel");
    const newsPanel = document.getElementById("news-hub-panel");
    if (quizPanel) quizPanel.open = false;
    if (newsPanel) newsPanel.open = false;
    renderComparePanel();
  });
}

function setupMobilePanelControls() {
  const leftButton = document.getElementById("toggle-left-panel");
  const toolsButton = document.getElementById("toggle-tools-panel");
  const countryButton = document.getElementById("toggle-country-panel");
  const moreButton = document.getElementById("toggle-more-panel");
  const moreMenu = document.getElementById("mobile-more-menu");
  const controls = document.getElementById("mobile-panel-controls");

  [controls, moreMenu].forEach(element => {
    ["pointerdown", "mousedown", "mouseup", "touchstart", "touchend", "click"].forEach(eventName => {
      element.addEventListener(eventName, event => event.stopPropagation());
    });
  });

  leftButton.addEventListener("click", () => toggleMobilePanel("left"));
  toolsButton.addEventListener("click", () => toggleMobilePanel("tools"));
  countryButton.addEventListener("click", () => {
    if (currentPanelState?.type === "country" && currentPanelState?.code && countriesData[currentPanelState.code]) {
      openCountryModal();
    }
  });
  moreButton.addEventListener("click", () => toggleMobileMoreMenu());
  moreMenu.addEventListener("click", event => {
    const button = event.target.closest("[data-mobile-hub-target]");
    if (!button) {
      return;
    }
    const panel = document.getElementById(button.dataset.mobileHubTarget);
    closeMobileMoreMenu();
    syncMobilePanelControlState();
    if (panel) {
      requestAnimationFrame(() => {
        panel.open = true;
        panel.querySelector("summary")?.focus({ preventScroll: true });
      });
    }
  });
  syncMobilePanelControlState();

  mobileMediaQuery.addEventListener("change", event => {
    updateMapInteractionTuning();
    if (!event.matches) {
      closeMobilePanels();
      fitWorldView();
      return;
    }

    fitWorldView();
  });

  map.on("click", onMapInteractionStart);
  map.on("dragstart", onMapInteractionStart);
  map.on("zoomstart", onMapInteractionStart);
}

function setupMapModeControl() {
  const button = document.getElementById("map-mode-toggle");
  if (!button) {
    return;
  }

  updateMapModeToggle();
  button.addEventListener("click", () => toggleMapMode());
}

function getExportContextLabel() {
  if (currentPanelState.type === "country" && currentPanelState.code && countriesData[currentPanelState.code]) {
    return countriesData[currentPanelState.code].name;
  }
  if (currentPanelState.type === "continent") {
    return currentPanelState.continent;
  }
  if (currentPanelState.type === "religion") {
    return currentPanelState.religionName;
  }
  if (currentPanelState.type === "group") {
    return currentPanelState.title;
  }
  return "georisk";
}

function getExportShareContext() {
  return {
    language: currentLanguage,
    contextLabel: getExportContextLabel(),
    selectedCountryName: currentPanelState?.code && countriesData[currentPanelState.code]
      ? countriesData[currentPanelState.code].name
      : "",
    theme: currentTheme,
    mode: appMode,
    normalizeText,
    escapeHtml,
    loadScriptOnce,
    showToast: message => uiPolish.showToast?.(message)
  };
}

async function getExportShareTools() {
  await ensureDeferredUiModule("exportShare");
  exportShareUi = window.GeoRiskExportShare || exportShareUi || {};
  return exportShareUi;
}

async function ensureExportLibraries(format = "image") {
  const tools = await getExportShareTools();
  return typeof tools.ensureExportLibraries === "function"
    ? tools.ensureExportLibraries(format, getExportShareContext())
    : false;
}

exportNodeAsImage = async function exportNodeAsImage(node, filename) {
  if (!node) {
    return;
  }
  const tools = await getExportShareTools();
  if (typeof tools.exportNodeAsImage === "function") {
    await tools.exportNodeAsImage(node, filename, getExportShareContext());
  }
};

exportNodeAsPdf = async function exportNodeAsPdf(node, filename) {
  if (!node) {
    return;
  }
  const tools = await getExportShareTools();
  if (typeof tools.exportNodeAsPdf === "function") {
    await tools.exportNodeAsPdf(node, filename, getExportShareContext());
  }
};

shareText = async function shareText(title, text) {
  const tools = await getExportShareTools();
  if (typeof tools.shareText === "function") {
    await tools.shareText(title, text, getExportShareContext());
  }
};

function getCompareSelectionList(filterText = "") {
  const normalizedFilter = normalizeText(filterText);
  return getCountryEntries()
    .filter(([, country]) => !normalizedFilter || normalizeText(country.name).includes(normalizedFilter) || normalizeText(country.general?.officialName).includes(normalizedFilter))
    .sort(([, a], [, b]) => String(a.name).localeCompare(String(b.name), "es"));
}

function getComparisonBenchmark(country) {
  const world = getCountryValues();
  const continentPeers = world.filter(item => item.continent === country.continent);
  const peers = compareBenchmarkMode === "continent" ? continentPeers : world;
  return {
    populationAvg: peers.reduce((sum, item) => sum + (item.general?.population || 0), 0) / Math.max(peers.length, 1),
    gdpPcAvg: peers.reduce((sum, item) => sum + (item.economy?.gdpPerCapita || 0), 0) / Math.max(peers.length, 1),
    orgAvg: peers.reduce((sum, item) => sum + getCountryOrganizationCount(item), 0) / Math.max(peers.length, 1),
    label: compareBenchmarkMode === "continent"
      ? (currentLanguage === "en" ? "Continental benchmark" : "Benchmark continental")
      : (currentLanguage === "en" ? "World benchmark" : "Benchmark mundial")
  };
}

function updateCompareSelectOptions(filterText = "") {
  const select = document.getElementById("compare-country-select");
  if (!select) {
    return;
  }

  select.innerHTML = `<option value="">${currentLanguage === "en" ? "Select country" : "Seleccionar pais"}</option>${
    getCompareSelectionList(filterText)
      .map(([code, country]) => `<option value="${escapeHtml(code)}">${escapeHtml(country.name)}</option>`)
      .join("")
  }`;
}

function setupCompareControls() {
  const chips = document.getElementById("compare-chips");
  const select = document.getElementById("compare-country-select");
  const addButton = document.getElementById("compare-add-button");
  const openButton = document.getElementById("open-compare-modal-button");
  const clearButton = document.getElementById("clear-compare-button");
  const search = document.getElementById("compare-country-search");
  const benchmarkWorld = document.getElementById("compare-benchmark-world");
  const benchmarkContinent = document.getElementById("compare-benchmark-continent");
  const presetSelect = document.getElementById("compare-preset-select");
  const comparePanel = document.getElementById("compare-hub-panel");
  const compareModal = document.getElementById("compare-modal");
  const compareCloseButton = document.getElementById("compare-modal-close");

  updateCompareSelectOptions();
  chips?.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-compare]");
    if (button) removeCountryFromCompare(button.dataset.removeCompare);
  });
  search?.addEventListener("input", () => updateCompareSelectOptions(search.value));
  presetSelect?.addEventListener("change", () => {
    const codes = typeof compareUi.getPresetCountries === "function"
      ? compareUi.getPresetCountries(presetSelect.value, countriesData)
      : [];
    if (codes.length) {
      compareSelection = codes.slice(0, 5);
      compareDataCache.clear();
      renderComparePanel();
    }
  });
  addButton?.addEventListener("click", () => {
    if (!select?.value) return;
    addCountryToCompare(select.value);
    if (compareSelection.length >= 2) openCompareModal();
  });
  openButton?.addEventListener("click", () => openCompareModal());
  clearButton?.addEventListener("click", () => {
    compareSelection = [];
    compareDataCache.clear();
    renderComparePanel();
    closeCompareModal();
  });
  benchmarkWorld?.addEventListener("click", () => {
    compareBenchmarkMode = "world";
    compareDataCache.clear();
    renderComparePanel();
  });
  benchmarkContinent?.addEventListener("click", () => {
    compareBenchmarkMode = "continent";
    compareDataCache.clear();
    renderComparePanel();
  });
  comparePanel?.addEventListener("toggle", () => {
    if (comparePanel.open) renderComparePanel();
  });
  compareModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-compare-modal='true']")) closeCompareModal();
  });
  compareCloseButton?.addEventListener("click", () => closeCompareModal());
  renderComparePanel();
}

{
  renderComparePanel = function renderComparePanel() {
    const comparePanel = document.getElementById("compare-hub-panel");
    const empty = document.getElementById("compare-empty");
    const chips = document.getElementById("compare-chips");
    const results = document.getElementById("compare-results");
    const openButton = document.getElementById("open-compare-modal-button");
    const worldButton = document.getElementById("compare-benchmark-world");
    const continentButton = document.getElementById("compare-benchmark-continent");
    syncCountryCompareButton();
    empty.textContent = t("compareHint");

    if (worldButton) worldButton.classList.toggle("is-secondary", compareBenchmarkMode !== "world");
    if (continentButton) continentButton.classList.toggle("is-secondary", compareBenchmarkMode !== "continent");

    if (!compareSelection.length) {
      empty.hidden = false;
      chips.innerHTML = "";
      results.innerHTML = "";
      results.hidden = true;
      if (openButton) openButton.disabled = true;
      return;
    }

    empty.hidden = true;
    results.hidden = false;
    chips.innerHTML = typeof compareUi.buildCompareChips === "function"
      ? compareUi.buildCompareChips(compareSelection, countriesData, getFlagEmoji, escapeHtml)
      : compareSelection.map(code => `<span class="compare-chip">${getFlagEmoji(code)} ${escapeHtml(countriesData[code]?.name || code)} <button type="button" data-remove-compare="${escapeHtml(code)}">x</button></span>`).join("");

    const compareRendererReady =
      typeof compareUi.buildLightCards === "function" &&
      typeof compareUi.buildCountryCards === "function";
    if (!compareRendererReady) {
      results.innerHTML = `
        <div class="compare-insight-grid">
          ${compareSelection.map(code => `
            <div class="compare-insight-card">
              <strong>${getFlagEmoji(code)} ${escapeHtml(countriesData[code]?.name || code)}</strong>
              <span>${escapeHtml(countriesData[code]?.general?.officialName || countriesData[code]?.name || code)}</span>
            </div>
          `).join("")}
        </div>
        <p class="loading-state">${currentLanguage === "en" ? "Preparing comparison..." : "Preparando comparacion..."}</p>
      `;
      if (openButton) openButton.disabled = true;
      ensureDeferredUiModule("compare").then(() => {
        if (typeof compareUi.buildLightCards === "function" && typeof compareUi.buildCountryCards === "function") {
          renderComparePanel();
        }
      });
      return;
    }

    const heavyMode = comparePanel?.open || compareSelection.length >= 2;
    if (!heavyMode) {
      results.innerHTML = compareUi.buildLightCards(compareSelection, countriesData, getFlagEmoji, escapeHtml);
      if (openButton) openButton.disabled = compareSelection.length < 2;
      return;
    }

    const radarEntries = compareSelection.map(code => ({
      code,
      name: countriesData[code].name,
      values: {
        population: countriesData[code].general?.population || 0,
        gdp: countriesData[code].economy?.gdp || 0,
        gdpPerCapita: countriesData[code].economy?.gdpPerCapita || 0,
        military: getCountryMilitaryActive(countriesData[code]),
        organizations: getCountryOrganizationCount(countriesData[code])
      }
    }));

    const cards = compareUi.buildCountryCards(
      compareSelection,
      countriesData,
      escapeHtml,
      renderFlagVisual,
      translateContinentName,
      t,
      getCountryBlocLabel,
      getComparisonBenchmark,
      formatPercentage
    );
    const timelineSummary = buildCompareTimelineSummary(compareSelection);

    results.innerHTML = `
      <div class="compare-toolbar">
        <button type="button" class="panel-action-button" data-export-target="compare-results" data-export-format="png">${currentLanguage === "en" ? "Export image" : "Exportar imagen"}</button>
        <button type="button" class="panel-action-button" data-export-target="compare-results" data-export-format="pdf">${currentLanguage === "en" ? "Export PDF" : "Exportar PDF"}</button>
        <button type="button" class="panel-action-button" data-share-target="compare-results">${currentLanguage === "en" ? "Share" : "Compartir"}</button>
      </div>
      <div class="compare-radar-wrap">${buildCompareRadarSVG(radarEntries)}</div>
      <div class="compare-country-cards">${cards}</div>
      ${timelineSummary}
    `;

    if (openButton) openButton.disabled = compareSelection.length < 2;
  };
}

async function registerServiceWorker() {
  const status = document.getElementById("offline-status");

  if (!("serviceWorker" in navigator)) {
    if (status) {
      status.textContent = "Cache offline no disponible en este navegador.";
    }
    await updateOfflineCacheSizeLabel();
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations
        .filter(registration => registration.active?.scriptURL && !registration.active.scriptURL.includes(`v=${APP_VERSION}`))
        .map(registration => registration.unregister())
    );

    const registration = await navigator.serviceWorker.register(`./sw.js?v=${APP_VERSION}`);
    await registration.update();
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!window.__geoRiskReloadingForSw) {
        window.__geoRiskReloadingForSw = true;
        window.location.reload();
      }
    }, { once: true });
    if (status) {
      status.textContent = currentLanguage === "en"
        ? "Partial offline mode active."
        : "Modo offline parcial activo.";
    }
    await updateOfflineCacheSizeLabel();
    updateAppStatusPanel();
  } catch (error) {
    const hasGeoRiskCache = "caches" in window
      ? await caches.keys().then(keys => keys.some(key => key.startsWith("geo-risk-"))).catch(() => false)
      : false;
    if (navigator.serviceWorker?.controller || hasGeoRiskCache) {
      if (status) {
        status.textContent = currentLanguage === "en"
          ? "Partial offline mode active."
          : "Modo offline parcial activo.";
      }
      await updateOfflineCacheSizeLabel();
      updateAppStatusPanel();
      return;
    }
    if (status) {
      status.textContent = currentLanguage === "en"
        ? "Offline cache could not be initialized."
        : "No se pudo inicializar el cache offline.";
    }
    await updateOfflineCacheSizeLabel();
    updateAppStatusPanel();
  }
}

async function init() {
  try {
    bootMetrics.startedAt = performance.now();
    startLongTaskObserver();
    document.body.classList.add("globe-loading");
    setStartupStatus(
      currentLanguage === "en" ? "Creating the lightweight map view." : "Creando la vista liviana del mapa.",
      currentLanguage === "en" ? "Preparing GeoRisk" : "Preparando GeoRisk"
    );
    closeCountryModal();
    closeCompareModal?.();
    closeConflictModal?.();
    closeTimelineModal?.();
    closeHelpModal?.();
    closeIntroModal?.(false);
    closeProductModal?.();
    loadSavedPreferences();
    const shouldStartCollapsed = true;
    currentTheme = "default";
    applyAppMode(appMode, false);
    await measureBootStep("viewerBoot", async () => {
      setStartupStatus(currentLanguage === "en" ? "Starting the map engine." : "Iniciando el motor del mapa.");
      initializeViewer();
      requestSceneRender();
    });
    setStartupStatus(currentLanguage === "en" ? "Loading simplified geography first." : "Cargando geografia simplificada primero.");
    const overlayLoadPromise = loadMap(true);
    const bootReadyPromise = measureBootStep("mapBootReady", () => waitForMapBootReady(isMobileLayout() ? 5200 : 4200));
    const dataLoadPromise = loadData()
      .then(() => {
        setStartupStatus(currentLanguage === "en" ? "Light country index ready." : "Indice liviano de paises listo.");
        refreshLoadedCountryLayers();
        updateAppStatusPanel();
        return countriesData;
      })
      .catch(error => {
        console.error("No se pudo cargar el dataset principal en segundo plano:", error);
        uiPolish.showToast?.("El globo cargo, pero el dataset completo no pudo hidratarse.");
        return {};
      });
    if (shouldStartCollapsed) {
      const toolbar = document.getElementById("map-toolbar");
      const rankingsPanel = document.getElementById("rankings-panel");
      if (toolbar) {
        toolbar.open = false;
      }
      if (rankingsPanel) {
        rankingsPanel.open = false;
      }
    }
    await bootReadyPromise;
    setStartupStatus(currentLanguage === "en" ? "Showing the initial map." : "Mostrando el mapa inicial.");
    if (shouldStartCollapsed) {
      const toolbar = document.getElementById("map-toolbar");
      const rankingsPanel = document.getElementById("rankings-panel");
      if (toolbar) {
        toolbar.open = false;
      }
      if (rankingsPanel) {
        rankingsPanel.open = false;
      }
    }
    update3DPresentationState();
    startPerformanceMonitor();
    updateMapInteractionTuning();
    setTimeout(() => {
      document.body.classList.remove("globe-loading");
      completeBootMetrics();
      updateAppStatusPanel();
      if (window.GEORISK_DEBUG_BOOT === true || localStorage.getItem("georisk.debugBoot") === "true") {
        console.info("GeoRisk boot profile", getBootProfileSummary(), bootMetrics.steps);
      }
      updateExtendedStaticText();
      if (localStorage.getItem(STORAGE_KEYS.introSeen) !== "true") {
        openIntroModal();
      }
      scheduleWhenGlobeIsQuiet(() => {
        if (viewer && !isMobileLayout() && activeImagerySignature.includes(":boot")) {
          applyImageryForMode(false);
          requestSceneRender();
        }
      }, {
        delay: isMobileLayout() ? 7000 : 1100,
        quietFor: isMobileLayout() ? 4500 : 1200,
        timeout: isMobileLayout() ? 45000 : 12000
      });
      dataLoadPromise
        .then(() => scheduleDetailedOverlayUpgrade())
        .catch(() => {});
    }, 120);

    const bootDeferredUi = () => {
      measureBootStep("deferredUi", async () => {
        setStartupStatus(currentLanguage === "en" ? "Activating search, layers and panels." : "Activando buscador, capas y paneles.");
        const safeUiTask = (name, task) => {
          try {
            task();
          } catch (error) {
            console.error(`No se pudo inicializar ${name}:`, error);
          }
        };

        await Promise.all([
          ensureDeferredUiModule("text"),
          ensureDeferredUiModule("uiPolish")
        ]);
        safeUiTask("search events", () => setupSearchEvents());
        safeUiTask("theme controls", () => setupThemeControls());
        safeUiTask("map mode control", () => setupMapModeControl());
        safeUiTask("ranking groups", () => setupRankingGroups());
        safeUiTask("extended static text", () => updateExtendedStaticText());
        safeUiTask("compare controls", () => setupCompareControls());
        safeUiTask("quiz controls", () => setupQuizControls());
        safeUiTask("rankings panel", () => setupRankingsPanel());
        safeUiTask("compare hub", () => setupCompareHubPanel());
        safeUiTask("quiz hub", () => setupQuizHubPanel());
        safeUiTask("news hub", () => setupNewsHubPanel());
        safeUiTask("saved views", () => setupSavedViewControls());
        safeUiTask("global shortcuts", () => setupGlobalKeyboardShortcuts());
        safeUiTask("mobile controls", () => setupMobilePanelControls());
        safeUiTask("ui polish", () => uiPolish.init?.());
        await registerServiceWorker();
        updateAppStatusPanel();
      });
    };

    const bootHeavyDataEnhancements = () => {
      setStartupStatus(currentLanguage === "en" ? "Heavy details remain on demand." : "Los detalles pesados quedan bajo demanda.");
      dataLoadPromise
        .then(() => loadDeferredDataEnhancements())
        .catch(error => {
          console.warn("No se pudieron completar las mejoras pesadas diferidas:", error);
        });
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => bootDeferredUi(), { timeout: 900 });
    } else {
      setTimeout(() => bootDeferredUi(), 120);
    }

    scheduleWhenGlobeIsQuiet(bootHeavyDataEnhancements, {
      delay: isMobileLayout() ? 28000 : 16000,
      quietFor: isMobileLayout() ? 9000 : 6000,
      timeout: isMobileLayout() ? 120000 : 90000
    });

    overlayLoadPromise?.catch(error => {
      console.error("La capa politica no pudo completar su carga inicial:", error);
    });

  } catch (error) {
    document.body.classList.remove("globe-loading");
    console.error("Error al inicializar GeoRisk 3D:", error);
    const status = document.getElementById("offline-status");
    if (status) {
      status.textContent = "La vista 3D no pudo inicializarse por completo.";
    }
    showFatalError(`GeoRisk no pudo terminar de inicializarse: ${error?.message || error}`);
  }
}

init();
