const fallbackGetDeviceProfile = ({ isMobile, currentMapMode, deviceMemory = 4, hardwareConcurrency = 4 }) => {
  const constrained = isMobile || deviceMemory <= 4 || hardwareConcurrency <= 4;
  const mode2d = currentMapMode === "2d";

  if (constrained) {
    return {
      constrained: true,
      targetFrameRate: mode2d ? (isMobile ? 18 : 26) : (isMobile ? 18 : 24),
      resolutionScale: mode2d ? (isMobile ? 0.48 : 0.66) : (isMobile ? 0.72 : 0.84),
      maximumScreenSpaceError: mode2d ? (isMobile ? 10.4 : 6.8) : (isMobile ? 6.2 : 3.6),
      tileCacheSize: mode2d ? (isMobile ? 36 : 88) : (isMobile ? 90 : 180),
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
    tileCacheSize: mode2d ? 116 : 240,
    loadingDescendantLimit: mode2d ? 8 : 18,
    enableFxaa: true,
    preloadAncestors: true,
    preloadSiblings: true
  };
};

const fallbackGetRenderProfileText = ({ language = "es", isMobile, currentMapMode, resolutionScale }) => {
  if (isMobile) {
    return language === "en"
      ? `Mobile ${currentMapMode.toUpperCase()} · optimized`
      : `Mobile ${currentMapMode.toUpperCase()} · optimizado`;
  }

  if (resolutionScale >= 0.9) {
    return language === "en"
      ? `${currentMapMode.toUpperCase()} · high quality`
      : `${currentMapMode.toUpperCase()} · alta calidad`;
  }

  if (resolutionScale >= 0.72) {
    return language === "en"
      ? `${currentMapMode.toUpperCase()} · balanced`
      : `${currentMapMode.toUpperCase()} · balanceado`;
  }

  return language === "en"
    ? `${currentMapMode.toUpperCase()} · performance`
    : `${currentMapMode.toUpperCase()} · rendimiento`;
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
const newsUi = window.GeoRiskNewsUI || {};
const compareUi = window.GeoRiskCompareUI || {};
const quizUi = window.GeoRiskQuizUI || {};
const countryPanelUi = window.GeoRiskCountryPanel || {};
const timelineConflictUi = window.GeoRiskTimelineConflicts || {};
const sharedTheme = window.GeoRiskTheme || {};
const sharedText = window.GeoRiskText || {};
const APP_VERSION = "2026-04-26-boot-10";

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
  },
  "Guerra de Corea": {
    cause: "Estallo por la division de la peninsula coreana tras la Segunda Guerra Mundial y la ofensiva norcoreana para reunificarla por la fuerza.",
    participants: [
      { side: "Corea del Norte y apoyos", members: ["Corea del Norte", "China"], organizations: [], troops: "millones movilizados", casualties: "muy elevadas" },
      { side: "Corea del Sur y ONU", members: ["Corea del Sur", "Estados Unidos", "Reino Unido"], organizations: ["ONU"], troops: "millones movilizados", casualties: "muy elevadas" }
    ],
    outcome: "Armisticio sin tratado de paz definitivo.",
    consequences: "Se consolido la division de Corea y la zona desmilitarizada, con una rivalidad que continua hasta hoy."
  },
  "Guerra de Vietnam": {
    cause: "Se intensifico por la division de Vietnam, la competencia de la Guerra Fria y la lucha entre el gobierno survietnamita y el Viet Cong con apoyo norvietnamita.",
    participants: [
      { side: "Vietnam del Norte", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Vietnam del Sur y aliados", members: ["Vietnam del Sur", "Estados Unidos", "Australia"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria de Vietnam del Norte y reunificacion del pais.",
    consequences: "Se reunifico Vietnam bajo un solo gobierno y Estados Unidos sufrio una derrota estrategica y politica."
  },
  "Guerra de los Seis Dias": {
    cause: "Estallo por la escalada militar entre Israel y sus vecinos arabes, el cierre del estrecho de Tiran y la movilizacion regional.",
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "aprox. 264.000", casualties: "menos de 1.000 muertos" },
      { side: "Coalicion arabe", members: ["Egipto", "Siria", "Jordania", "Irak"], organizations: ["Liga Arabe"], troops: "cientos de miles", casualties: "varios miles" }
    ],
    outcome: "Victoria rapida de Israel.",
    consequences: "Israel ocupo Gaza, Cisjordania, Jerusalen Este, Sinai y los Altos del Golan, alterando profundamente el mapa regional."
  },
  "Guerra del Golfo": {
    cause: "Comenzo tras la invasion iraqui de Kuwait en 1990 y la respuesta internacional encabezada por Estados Unidos.",
    participants: [
      { side: "Iraq", members: ["Iraq"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Coalicion internacional", members: ["Estados Unidos", "Arabia Saudita", "Reino Unido", "Francia", "Kuwait"], organizations: ["ONU"], troops: "mas de 900.000", casualties: "relativamente bajas frente a Iraq" }
    ],
    outcome: "Liberacion de Kuwait y derrota militar iraqui.",
    consequences: "Iraq quedo sometido a sanciones, zonas de exclusion aerea y fuerte debilitamiento regional."
  },
  "Guerra civil siria": {
    cause: "Surgio de las protestas de 2011, la represion estatal y la posterior militarizacion del levantamiento en el contexto de la Primavera Arabe.",
    participants: [
      { side: "Gobierno sirio y apoyos", members: ["Siria", "Rusia", "Iran"], organizations: ["Hezbola"], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Oposicion y otras facciones", members: ["Ejercito Libre Sirio", "facciones islamistas", "Fuerzas Democraticas Sirias"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto fragmentado y parcialmente congelado, con predominio del gobierno en gran parte del pais.",
    consequences: "Destruccion masiva, millones de desplazados y una profunda internacionalizacion del conflicto."
  },
  "Segunda Guerra Mundial": {
    cause: "Estallo por la expansion agresiva de la Alemania nazi, el militarismo japones y el fracaso del sistema internacional de entreguerras para contener esas potencias.",
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Union Sovietica", "Estados Unidos", "Francia", "China"], organizations: [], troops: "decenas de millones", casualties: "extraordinariamente elevadas" },
      { side: "Eje", members: ["Alemania", "Italia", "Japon"], organizations: [], troops: "decenas de millones", casualties: "extraordinariamente elevadas" }
    ],
    outcome: "Victoria aliada y derrota total del Eje.",
    consequences: "Reconfiguro el orden mundial, abrio paso a la ONU, la Guerra Fria, la descolonizacion acelerada y cambios fronterizos profundos en Europa y Asia."
  },
  "Primera Guerra Mundial": {
    cause: "Fue desencadenada por el asesinato del archiduque Francisco Fernando en un sistema europeo ya tensado por alianzas militares, nacionalismos y rivalidades imperiales.",
    participants: [
      { side: "Aliados", members: ["Francia", "Reino Unido", "Rusia", "Italia", "Estados Unidos"], organizations: [], troops: "decenas de millones", casualties: "muy elevadas" },
      { side: "Potencias Centrales", members: ["Alemania", "Austria-Hungria", "Imperio otomano", "Bulgaria"], organizations: [], troops: "decenas de millones", casualties: "muy elevadas" }
    ],
    outcome: "Victoria aliada y armisticio de 1918.",
    consequences: "Provoco la caida de varios imperios, nuevos estados europeos, el Tratado de Versalles y condiciones que incubaron la Segunda Guerra Mundial."
  },
  "Guerra civil espanola": {
    cause: "Comenzo tras el levantamiento militar contra la Segunda Republica Espanola en un clima de fuerte polarizacion politica y social.",
    participants: [
      { side: "Republicanos", members: ["Republica Espanola"], organizations: ["Brigadas Internacionales"], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Nacionalistas", members: ["Sublevados dirigidos por Franco"], organizations: ["Apoyo italiano y aleman"], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria nacionalista y establecimiento de la dictadura de Franco.",
    consequences: "Transformo el sistema politico espanol durante decadas y dejo una profunda fractura social y memorial."
  },
  "Guerra Iran-Iraq": {
    cause: "Estallo por rivalidades fronterizas, ambiciones regionales de Bagdad y el impacto de la revolucion irani de 1979.",
    participants: [
      { side: "Iran", members: ["Iran"], organizations: [], troops: "millones movilizados", casualties: "muy elevadas" },
      { side: "Iraq", members: ["Iraq"], organizations: [], troops: "millones movilizados", casualties: "muy elevadas" }
    ],
    outcome: "Empate estrategico sin cambios territoriales decisivos.",
    consequences: "Ambos paises quedaron devastados, altamente endeudados y militarizados, alterando toda la seguridad del Golfo."
  },
  "Guerra de Afganistan": {
    cause: "Comenzo tras los atentados del 11 de septiembre y la ofensiva liderada por Estados Unidos contra el regimen taliban por albergar a Al Qaeda.",
    participants: [
      { side: "Gobierno afgano y coalicion", members: ["Afganistan", "Estados Unidos", "Reino Unido"], organizations: ["OTAN"], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Insurgencia", members: ["Talibanes", "grupos insurgentes aliados"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Retirada occidental y regreso taliban al poder en 2021.",
    consequences: "Colapso del gobierno republicano afgano y redefinicion del equilibrio regional y de la credibilidad occidental."
  },
  "Guerra de Corea": {
    cause: "Estallo por la division de la peninsula coreana tras la Segunda Guerra Mundial y la ofensiva norcoreana para reunificarla por la fuerza.",
    participants: [
      { side: "Corea del Norte y apoyos", members: ["Corea del Norte", "China"], organizations: [], troops: "millones movilizados", casualties: "muy elevadas" },
      { side: "Corea del Sur y ONU", members: ["Corea del Sur", "Estados Unidos", "Reino Unido"], organizations: ["ONU"], troops: "millones movilizados", casualties: "muy elevadas" }
    ],
    outcome: "Armisticio sin tratado de paz definitivo.",
    consequences: "Se consolido la division de Corea y la zona desmilitarizada, con una rivalidad que continua hasta hoy."
  },
  "Guerra de Vietnam": {
    cause: "Se intensifico por la division de Vietnam, la competencia de la Guerra Fria y la lucha entre el gobierno survietnamita y el Viet Cong con apoyo norvietnamita.",
    participants: [
      { side: "Vietnam del Norte", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Vietnam del Sur y aliados", members: ["Vietnam del Sur", "Estados Unidos", "Australia"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria de Vietnam del Norte y reunificacion del pais.",
    consequences: "Se reunifico Vietnam bajo un solo gobierno y Estados Unidos sufrio una derrota estrategica y politica."
  },
  "Guerra de los Seis Dias": {
    cause: "Estallo por la escalada militar entre Israel y sus vecinos arabes, el cierre del estrecho de Tiran y la movilizacion regional.",
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "aprox. 264.000", casualties: "menos de 1.000 muertos" },
      { side: "Coalicion arabe", members: ["Egipto", "Siria", "Jordania", "Irak"], organizations: ["Liga Arabe"], troops: "cientos de miles", casualties: "varios miles" }
    ],
    outcome: "Victoria rapida de Israel.",
    consequences: "Israel ocupo Gaza, Cisjordania, Jerusalen Este, Sinai y los Altos del Golan, alterando profundamente el mapa regional."
  },
  "Guerra del Golfo": {
    cause: "Comenzo tras la invasion iraqui de Kuwait en 1990 y la respuesta internacional encabezada por Estados Unidos.",
    participants: [
      { side: "Iraq", members: ["Iraq"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Coalicion internacional", members: ["Estados Unidos", "Arabia Saudita", "Reino Unido", "Francia", "Kuwait"], organizations: ["ONU"], troops: "mas de 900.000", casualties: "relativamente bajas frente a Iraq" }
    ],
    outcome: "Liberacion de Kuwait y derrota militar iraqui.",
    consequences: "Iraq quedo sometido a sanciones, zonas de exclusion aerea y fuerte debilitamiento regional."
  },
  "Guerra civil siria": {
    cause: "Surgio de las protestas de 2011, la represion estatal y la posterior militarizacion del levantamiento en el contexto de la Primavera Arabe.",
    participants: [
      { side: "Gobierno sirio y apoyos", members: ["Siria", "Rusia", "Iran"], organizations: ["Hezbola"], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Oposicion y otras facciones", members: ["Ejercito Libre Sirio", "facciones islamistas", "Fuerzas Democraticas Sirias"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto fragmentado y parcialmente congelado, con predominio del gobierno en gran parte del pais.",
    consequences: "Destruccion masiva, millones de desplazados y una profunda internacionalizacion del conflicto."
  },
  "Segunda Guerra Mundial": {
    cause: "Estallo por la expansion agresiva de la Alemania nazi, el militarismo japones y el fracaso del sistema internacional de entreguerras para contener esas potencias.",
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Union Sovietica", "Estados Unidos", "Francia", "China"], organizations: [], troops: "decenas de millones", casualties: "extraordinariamente elevadas" },
      { side: "Eje", members: ["Alemania", "Italia", "Japon"], organizations: [], troops: "decenas de millones", casualties: "extraordinariamente elevadas" }
    ],
    outcome: "Victoria aliada y derrota total del Eje.",
    consequences: "Reconfiguro el orden mundial, abrio paso a la ONU, la Guerra Fria, la descolonizacion acelerada y cambios fronterizos profundos en Europa y Asia."
  },
  "Primera Guerra Mundial": {
    cause: "Fue desencadenada por el asesinato del archiduque Francisco Fernando en un sistema europeo ya tensado por alianzas militares, nacionalismos y rivalidades imperiales.",
    participants: [
      { side: "Aliados", members: ["Francia", "Reino Unido", "Rusia", "Italia", "Estados Unidos"], organizations: [], troops: "decenas de millones", casualties: "muy elevadas" },
      { side: "Potencias Centrales", members: ["Alemania", "Austria-Hungria", "Imperio otomano", "Bulgaria"], organizations: [], troops: "decenas de millones", casualties: "muy elevadas" }
    ],
    outcome: "Victoria aliada y armisticio de 1918.",
    consequences: "Provoco la caida de varios imperios, nuevos estados europeos, el Tratado de Versalles y condiciones que incubaron la Segunda Guerra Mundial."
  },
  "Guerra civil espanola": {
    cause: "Comenzo tras el levantamiento militar contra la Segunda Republica Espanola en un clima de fuerte polarizacion politica y social.",
    participants: [
      { side: "Republicanos", members: ["Republica Espanola"], organizations: ["Brigadas Internacionales"], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Nacionalistas", members: ["Sublevados dirigidos por Franco"], organizations: ["Apoyo italiano y aleman"], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria nacionalista y establecimiento de la dictadura de Franco.",
    consequences: "Transformo el sistema politico espanol durante decadas y dejo una profunda fractura social y memorial."
  },
  "Guerra Iran-Iraq": {
    cause: "Estallo por rivalidades fronterizas, ambiciones regionales de Bagdad y el impacto de la revolucion irani de 1979.",
    participants: [
      { side: "Iran", members: ["Iran"], organizations: [], troops: "millones movilizados", casualties: "muy elevadas" },
      { side: "Iraq", members: ["Iraq"], organizations: [], troops: "millones movilizados", casualties: "muy elevadas" }
    ],
    outcome: "Empate estrategico sin cambios territoriales decisivos.",
    consequences: "Ambos paises quedaron devastados, altamente endeudados y militarizados, alterando toda la seguridad del Golfo."
  },
  "Guerra de Afganistan": {
    cause: "Comenzo tras los atentados del 11 de septiembre y la ofensiva liderada por Estados Unidos contra el regimen taliban por albergar a Al Qaeda.",
    participants: [
      { side: "Gobierno afgano y coalicion", members: ["Afganistan", "Estados Unidos", "Reino Unido"], organizations: ["OTAN"], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Insurgencia", members: ["Talibanes", "grupos insurgentes aliados"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Retirada occidental y regreso taliban al poder en 2021.",
    consequences: "Colapso del gobierno republicano afgano y redefinicion del equilibrio regional y de la credibilidad occidental."
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
  "geopoliticalIndex"
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
  const countryFont = zoomBucket === "near" ? "700 14px Public Sans, sans-serif" : zoomBucket === "mid" ? "600 13px Public Sans, sans-serif" : "600 12px Public Sans, sans-serif";
  const contextFont = zoomBucket === "near" ? "700 16px Public Sans, sans-serif" : zoomBucket === "mid" ? "600 15px Public Sans, sans-serif" : "600 14px Public Sans, sans-serif";
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
    analysis: "geopoliticalIndex",
    encyclopedia: "qualityScore",
    presentation: "default"
  };
  const preferredTheme = preferredThemesByMode[appMode];
  if (preferredTheme && (currentTheme === "default" || currentTheme === "qualityScore" || currentTheme === "geopoliticalIndex")) {
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
  updateIntroRuntimeStatus();
  modal.hidden = false;
  syncModalOpenState();
}

function closeIntroModal() {
  const modal = document.getElementById("intro-modal");
  if (!modal) {
    return;
  }
  modal.hidden = true;
  localStorage.setItem(STORAGE_KEYS.introSeen, "true");
  syncModalOpenState();
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
        : "Cache local limpiado. Recarga para reconstruirlo.";
    }
    updateAppStatusPanel();
    openProductModal(
      currentLanguage === "en" ? "Local cache cleared" : "Cache local limpiado",
      `<div class="help-section"><p>${currentLanguage === "en"
        ? "GeoRisk removed local app caches and cleared runtime resources. Reload the page if you still see old assets."
        : "GeoRisk elimino los caches locales de la app y limpio recursos de la sesion. Recarga la pagina si todavia ves archivos viejos."}</p></div>`
    );
  } catch (error) {
    if (status) {
      status.textContent = currentLanguage === "en"
        ? "Local cache could not be cleared."
        : "No se pudo limpiar el cache local.";
    }
    console.warn("No se pudo limpiar el cache local:", error);
  }
}

function updateIntroRuntimeStatus() {
  const bootState = document.getElementById("intro-boot-state");
  const dataState = document.getElementById("intro-data-state");
  const offlineState = document.getElementById("intro-offline-state");
  const renderState = document.getElementById("intro-render-state");
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
      deferredDataStatus.fullCountries ? (currentLanguage === "en" ? "full dataset" : "dataset completo") : (currentLanguage === "en" ? "full deferred" : "full diferido")
    ].filter(Boolean);
    dataState.textContent = states.join(" / ") || (currentLanguage === "en" ? "Preparing" : "Preparando");
  }
  if (offlineState) {
    offlineState.textContent = document.getElementById("offline-status")?.textContent || (currentLanguage === "en" ? "Preparing cache" : "Preparando cache");
  }
  if (renderState) {
    renderState.textContent = getRenderProfileLabel();
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
  return isMobileLayout() ? earthRadius * 4.15 : earthRadius * 3.55;
}

function getMaxGlobeDistance() {
  return getInitialGlobeDistance() * 1.02;
}

function getDefaultMapMode() {
  return isMobileLayout() ? "2d" : "3d";
}

function isConstrainedDevice() {
  return runtimeGetDeviceProfile({
    isMobile: isMobileLayout(),
    currentMapMode,
    deviceMemory: navigator.deviceMemory || 4,
    hardwareConcurrency: navigator.hardwareConcurrency || 4
  }).constrained;
}

function shouldUseHoverHighlights() {
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

function getLabelModeLabel() {
  const labels = {
    none: currentLanguage === "en" ? "No labels" : "Sin etiquetas",
    countries: currentLanguage === "en" ? "Countries" : "Paises",
    full: currentLanguage === "en" ? "Countries and world" : "Paises y mundo"
  };
  return labels[labelMode] || labels.none;
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
    "countries_full.json",
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
      if (!key.includes(activePath) && !key.includes("countries_full.json")) {
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
  } else if (category === "language") {
    const mainLanguage = country.general.languages[0];
    prompt = `¿Cual es uno de los idiomas principales de ${country.name}?`;
    correct = typeof mainLanguage === "string" ? mainLanguage : (mainLanguage?.name || "Sin datos");
    distractors = shuffleArray(
      Object.values(countriesData)
        .flatMap(item => item.general?.languages || [])
        .map(item => typeof item === "string" ? item : item?.name)
        .filter(Boolean)
        .filter(name => normalizeText(name) !== normalizeText(correct))
    ).slice(0, 3);
  } else if (category === "bloc") {
    const bloc = (country.politics?.relations?.blocs || [])[0];
    prompt = `¿Que pais pertenece a este bloque? ${bloc}`;
    correct = country.name;
    distractors = shuffleArray(Object.values(countriesData).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "conflict") {
    const conflict = (country.military?.conflicts || country.conflicts || [])[0];
    const label = typeof conflict === "string" ? conflict : (conflict?.name || conflict?.war || "Conflicto");
    prompt = `¿Que pais estuvo vinculado a ${label}?`;
    correct = country.name;
    distractors = shuffleArray(
      Object.values(countriesData)
        .filter(item => difficulty === "easy" || item.continent === country.continent)
        .map(item => item.name)
        .filter(name => normalizeText(name) !== normalizeText(correct))
    ).slice(0, 3);
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
let loadFullCountryDataPromise = null;
let loadRuntimeCurationPromise = null;
const countryDetailPromises = new Map();
const deferredDataStatus = {
  countryIndex: false,
  fullCountries: false,
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

const DATA_SOURCE_SUMMARY = {
  es: [
    "Dataset geopolitico local curado del proyecto",
    "Banco Mundial para inflacion",
    "GeoJSON politico y curaduria historica/manual propia"
  ],
  en: [
    "Local curated geopolitical project dataset",
    "World Bank for inflation",
    "Political GeoJSON plus in-project historical/manual curation"
  ]
};

const CONFLICT_NAME_ALIASES = [
  [/^Guerra de Malvinas$/i, "Guerra de las Malvinas"],
  [/^Falklands War$/i, "Guerra de las Malvinas"],
  [/^Guerra de Falklands$/i, "Guerra de las Malvinas"],
  [/^World War I$/i, "Primera Guerra Mundial"],
  [/^First World War$/i, "Primera Guerra Mundial"],
  [/^Great War$/i, "Primera Guerra Mundial"],
  [/^World War II$/i, "Segunda Guerra Mundial"],
  [/^Second World War$/i, "Segunda Guerra Mundial"],
  [/^Iraq War$/i, "Guerra de Irak"],
  [/^War in Afghanistan$/i, "Guerra de Afganistan"],
  [/^Korean War$/i, "Guerra de Corea"],
  [/^Kosovo War$/i, "Guerra de Kosovo"],
  [/^Vietnam War$/i, "Guerra de Vietnam"],
  [/^War of Attrition$/i, "Guerra de Desgaste"],
  [/^Six-Day War$/i, "Guerra de los Seis Dias"],
  [/^Yom Kippur War$/i, "Guerra de Yom Kipur"],
  [/^First Congo War$/i, "Primera Guerra del Congo"],
  [/^Second Congo War$/i, "Segunda Guerra del Congo"],
  [/^Kivu conflict$/i, "Guerra de Kivu"],
  [/^Russo-Ukrainian War$/i, "Guerra rusoucraniana"],
  [/^Russian invasion of Ukraine$/i, "Guerra rusoucraniana"],
  [/^War in Donbas$/i, "Guerra del Donbas"],
  [/^Arab-Israeli War of 1948$/i, "Guerra arabe-israeli de 1948"],
  [/^Chinese Civil War$/i, "Guerra civil china"],
  [/^Crimean War$/i, "Guerra de Crimea"],
  [/^Russo-Japanese War$/i, "Guerra ruso-japonesa"],
  [/^Algerian War$/i, "Guerra de Argelia"],
  [/^War of the Pacific$/i, "Guerra del Pacifico"],
  [/^Chaco War$/i, "Guerra del Chaco"],
  [/^Cenepa War$/i, "Guerra del Cenepa"],
  [/^False Paquisha conflict$/i, "Conflicto del Falso Paquisha"],
  [/^Dominican War of Independence$/i, "Guerra de la Independencia Dominicana"],
  [/^War of the Confederation$/i, "Guerra contra la Confederacion Peru-Boliviana"],
  [/^Guatemalan-Salvadoran War of 1906$/i, "Guerra entre Guatemala y El Salvador de 1906"],
  [/^Honduran-Salvadoran War of 1871$/i, "Guerra entre Honduras y El Salvador de 1871"],
  [/^Mexican Drug War$/i, "Guerra contra el narcotrafico en Mexico"],
  [/^Zapatista uprising$/i, "Levantamiento zapatista"],
  [/^Guerra de Malvinas \\(1982\\)$/i, "Guerra de las Malvinas"],
  [/^Guerra contra el narcotrÃ¡fico en MÃ©xico$/i, "Guerra contra el narcotrafico en Mexico"],
  [/^Guerra contra la ConfederaciÃ³n PerÃº-Boliviana$/i, "Guerra contra la Confederacion Peru-Boliviana"],
  [/^Honduran-Salvadoran War de 1871$/i, "Guerra entre Honduras y El Salvador de 1871"],
  [/^Gulf War$/i, "Guerra del Golfo"],
  [/^Syrian civil war$/i, "Guerra civil siria"],
  [/^Spanish Civil War$/i, "Guerra civil espanola"],
  [/^Iran-Iraq War$/i, "Guerra Iran-Iraq"],
  [/^First Intifada$/i, "Primera intifada"],
  [/^Second Intifada$/i, "Segunda intifada"],
  [/^Operation Deliberate Force$/i, "Operacion Deliberate Force"],
  [/^1984 DMZ incident$/i, "Incidente de la ZDC de 1984"],
  [/^Struggle for Negev 1947-1956$/i, "Campana del Neguev (1947-1956)"],
  [/^Battle of Amiens$/i, "Batalla de Amiens"],
  [/^Battle of Bubiyan$/i, "Batalla de Bubiyan"],
  [/^Battle of Long Tan$/i, "Batalla de Long Tan"],
  [/^Battle of Manila$/i, "Batalla de Manila"],
  [/^Borneo campaign$/i, "Campana de Borneo"],
  [/^Sa'dah conflict$/i, "Conflicto de Sa'dah"],
  [/^Water War over the Jordan River$/i, "Guerra por el agua del rio Jordan"],
  [/^Arabâ€“Israeli Wars$/i, "Guerras arabe-israelies"],
  [/^Guerra Ã¡rabe-israelÃ­ de 1948$/i, "Guerra arabe-israeli de 1948"],
  [/^Bombing de Gaza Strip$/i, "Bombardeo de la Franja de Gaza"],
  [/^Conflicto de la Franja de Gaza de 2008[â€“-]2009$/i, "Conflicto de la Franja de Gaza de 2008-2009"],
  [/^IrÃ¡n.?Israel conflict during Syrian civil war$/i, "Conflicto irano-israeli durante la guerra civil siria"],
  [/^Conflicto irano-israel[iÃ­]$/i, "Conflicto irano-israeli"],
  [/^Israeli-British clash de January 7, 1949$/i, "Choque israelo-britanico del 7 de enero de 1949"],
  [/^Conflicto fronterizo sirio-israel[iÃ­] \\(2012-presente\\)$/i, "Conflicto fronterizo sirio-israeli (2012-presente)"],
  [/^Crisis del golfo PÃ©rsico de 2019-2022$/i, "Crisis del golfo Persico de 2019-2022"],
  [/^Guerra subsidiaria irano-saud[iÃ­]$/i, "Guerra subsidiaria irano-saudi"],
  [/^Guerra subsidiaria irano-turca$/i, "Guerra subsidiaria irano-turca"],
  [/^Insurgencia palestina en el sur del L[iÃ­]bano$/i, "Insurgencia palestina en el sur del Libano"],
  [/^Ataque de IrÃ¡n a Israel de 2024$/i, "Ataque de Iran a Israel de 2024"],
  [/^Ataques de Estados Unidos en Yemen en 2025$/i, "Ataques de Estados Unidos en Yemen en 2025"],
  [/^Conflicto afgano-iran[iÃ­] de 2021$/i, "Conflicto afgano-irani de 2021"],
  [/^Conflicto afgano-iran[iÃ­] de 2023$/i, "Conflicto afgano-irani de 2023"],
  [/^IntervenciÃ³n estadounidense en la guerra civil siria$/i, "Intervencion estadounidense en la guerra civil siria"],
  [/^Iranian bombings en Iraqi Kurdistan en 2022$/i, "Bombardeos iranies en el Kurdistan iraqui en 2022"],
  [/^Iraq War troop surge de 2007$/i, "Escalada de tropas en la guerra de Irak de 2007"],
  [/^Levantamiento de Barein de 2011$/i, "Levantamiento de Barein de 2011"],
  [/^RebeliÃ³n asiria$/i, "Rebelion asiria"],
  [/^Saudi maritime expansion, 1789-1809$/i, "Expansion maritima saudita (1789-1809)"],
  [/^Syrian front en War de Attrition$/i, "Frente sirio en la Guerra de Desgaste"],
  [/^Enfrentamientos en el sur de Siria \\(abril-mayo de 2025\\)$/i, "Enfrentamientos en el sur de Siria (abril-mayo de 2025)"],
  [/^Enfrentamientos en el sur de Siria \\(julio de 2025-presente\\)$/i, "Enfrentamientos en el sur de Siria (julio de 2025-presente)"],
  [/^Battle of Inchon$/i, "Batalla de Incheon"],
  [/^Inchon Landing$/i, "Batalla de Incheon"],
  [/^UN offensive into North Korea$/i, "Ofensiva de la ONU en Corea del Norte"],
  [/^Vietnam Counteroffensive Phase II$/i, "Contraofensiva vietnamita fase II"],
  [/^Vietnam Counteroffensive Phase III$/i, "Contraofensiva vietnamita fase III"],
  [/^Arabâ€“Israeli Wars$/i, "Guerras arabe-israelies"],
  [/^Arab-Israeli Wars$/i, "Guerras arabe-israelies"],
  [/^Gaza War$/i, "Guerra de Gaza"],
  [/^2012 Gaza War$/i, "Guerra de Gaza de 2012"],
  [/^Iran.?Israel conflict during Syrian civil war$/i, "Conflicto irano-israeli durante la guerra civil siria"],
  [/^Iran.?Israel conflict$/i, "Conflicto irano-israeli"],
  [/^Israeli-British clash.*1949$/i, "Choque israelo-britanico del 7 de enero de 1949"],
  [/^Battle of the Bulge$/i, "Batalla de las Ardenas"],
  [/^North Borneo campaign$/i, "Batalla de North Borneo"],
  [/^North Borneo battle$/i, "Batalla de North Borneo"],
  [/^Battle of Midway$/i, "Batalla de Midway"],
  [/^Guadalcanal Campaign$/i, "Campaña de Guadalcanal"],
  [/^Naval Battle of Guadalcanal$/i, "Batalla naval de Guadalcanal"],
  [/^First Battle of El Alamein$/i, "Primera Batalla de El Alamein"],
  [/^Second Battle of El Alamein$/i, "Segunda batalla de El Alamein"],
  [/^Battle of Gazala$/i, "Batalla de Gazala"],
  [/^Tet Offensive$/i, "Ofensiva del Tet"],
  [/^Siege of Khe Sanh$/i, "Sitio de Khe Sanh"],
  [/^Battle of Coral[-â€“]Balmoral$/i, "Batalla de Coral-Balmoral"],
  [/^Batalla de Coral[-â€“]Balmoral$/i, "Batalla de Coral-Balmoral"],
  [/^Battle of Saigon$/i, "Batalla de Saigon"],
  [/^Signal Hill.*Vietnam$/i, "Batalla de Signal Hill Vietnam"],
  [/^Battle of Ia Drang$/i, "Batalla del valle de Ia Drang"],
  [/^Ia Drang Valley$/i, "Batalla del valle de Ia Drang"],
  [/^Indochina Wars$/i, "Guerras de Indochina"],
  [/^Darfur conflict$/i, "Conflicto de Darfur"],
  [/^Ethiopian Civil War$/i, "Guerra civil etiope"],
  [/^Ethiopian-Somali border conflict$/i, "Conflicto fronterizo etiope-somali"],
  [/^Western Sahara conflict$/i, "Conflicto del Sahara Occidental"],
  [/^Western Sahara War$/i, "Guerra del Sahara Occidental"],
  [/^South Sudanese Civil War$/i, "Guerra civil sursudanesa"],
  [/^Second Sudanese Civil War$/i, "Segunda guerra civil sudanesa"],
  [/^April 2009 raid off Somalia$/i, "Incursion de abril de 2009 frente a Somalia"],
  [/^Anti-piracy measures en Somalia$/i, "Medidas antipirateria en Somalia"],
  [/^Chadian-Libyan conflict$/i, "Conflicto entre Chad y Libia"],
  [/^Djiboutian-Eritrean border conflict$/i, "Conflicto fronterizo entre Yibuti y Eritrea"],
  [/^Eritrean-Ethiopian War$/i, "Guerra entre Etiopia y Eritrea"],
  [/^First Burundi War$/i, "Primera guerra de Burundi"],
  [/^First Burundian Civil War$/i, "Primera guerra de Burundi"],
  [/^First Chad \\(FROLINAT\\) Rebellion$/i, "Primera rebelion de Chad (FROLINAT)"],
  [/^First Rwanda War$/i, "Primera guerra de Ruanda"],
  [/^Second Rwanda War$/i, "Segunda guerra de Ruanda"],
  [/^Third Rwanda War$/i, "Tercera guerra de Ruanda"],
  [/^First Uganda War$/i, "Primera guerra de Uganda"],
  [/^Republic of the Congo Civil War$/i, "Guerra civil de la Republica del Congo"],
  [/^Somaliland War of Independence$/i, "Guerra de Independencia de Somalilandia"],
  [/^Somaliland War$/i, "Guerra de Somalilandia"],
  [/^Grebo-Liberian War$/i, "Guerra grebo-liberiana"],
  [/^Operation Ivory Coast$/i, "Operacion Costa de Marfil"],
  [/^First Ivorian Civil War$/i, "Primera guerra civil marfilena"],
  [/^Second Ivorian Civil War$/i, "Segunda guerra civil marfilena"],
  [/^Second Liberia War$/i, "Segunda guerra liberiana"],
  [/^Moroccan invasion of Spanish Sahara$/i, "Invasion marroqui del Sahara espanol"],
  [/^First Sahrawi Intifada$/i, "Primera intifada saharaui"],
  [/^Second Sahrawi Intifada$/i, "Segunda intifada saharaui"],
  [/^Guerra civil de la RepÃºblica del Congo$/i, "Guerra civil de la Republica del Congo"],
  [/^Guerra entre EtiopÃ­a y Eritrea$/i, "Guerra entre Etiopia y Eritrea"],
  [/^Invasión marroquí del Sahara español$/i, "Invasion marroqui del Sahara espanol"],
  [/^OperaciÃ³n Costa de Marfil$/i, "Operacion Costa de Marfil"],
  [/^Primera Intifada saharaui$/i, "Primera intifada saharaui"],
  [/^Segunda Intifada saharaui$/i, "Segunda intifada saharaui"],
  [/^Battle of Arras$/i, "Batalla de Arras"],
  [/^Battle of Cambrai$/i, "Batalla de Cambrai"],
  [/^Battle of Jutland$/i, "Batalla de Jutlandia"],
  [/^Battle of Vimy Ridge$/i, "Batalla de la Cresta de Vimy"],
  [/^Battle of Messines$/i, "Batalla de Messines"],
  [/^Battle of the Meuse$/i, "Batalla de Meuse"],
  [/^Battle of Picardy$/i, "Batalla de Picardy"],
  [/^Battle of the Scarpe$/i, "Batalla de Scarpe"],
  [/^Battle of Vittorio Veneto$/i, "Batalla de Vittorio Veneto"],
  [/^First Battle of Ypres$/i, "Primera batalla de Ypres"],
  [/^Second Battle of the Somme$/i, "Segunda batalla de Somme"],
  [/^Second Battle of the Marne$/i, "Segunda batalla del Marne"],
  [/^Third Battle of the Aisne$/i, "Tercera batalla de Aisne"],
  [/^2022 Russian invasion de Ukraine$/i, "Invasion rusa de Ucrania de 2022"],
  [/^2016 Sirte offensive$/i, "Ofensiva de Sirte de 2016"],
  [/^Aleppo Offensive \\(April 2016\\)$/i, "Ofensiva de Alepo de abril de 2016"],
  [/^Battle of Al Fao de 2003$/i, "Batalla de Al Fao de 2003"],
  [/^Battle of Baghdad de 2003$/i, "Batalla de Bagdad de 2003"],
  [/^Battle of Kerbala de 2003$/i, "Batalla de Kerbala de 2003"],
  [/^Battle of Mosul \\(2004\\)$/i, "Batalla de Mosul de 2004"],
  [/^Battle of Mosul \\(2016-2017\\)$/i, "Batalla de Mosul de 2016-2017"],
  [/^Battle of Kandahar \\(2021\\)$/i, "Batalla de Kandahar de 2021"],
  [/^Battle of Shusha \\(2020\\)$/i, "Batalla de Shusha de 2020"],
  [/^Battle of Tinzawatene \\(2024\\)$/i, "Batalla de Tinzawatene de 2024"],
  [/^Battle of Dikwa \\(2 mar 2015\\)$/i, "Batalla de Dikwa de 2015"],
  [/^Battle of Boulikessi \\(2025\\)$/i, "Batalla de Boulikessi de 2025"],
  [/^Battle of Ras Kamboni \\(2024\\)$/i, "Batalla de Ras Kamboni de 2024"],
  [/^Galwan Valley clash de 2020$/i, "Combate en el valle del Galwan de 2020"],
  [/^Kharkiv Oblast counteroffensive de 2022$/i, "Contraofensiva del oblast de Jarkov de 2022"],
  [/^Anglophone Crisis in Cameroon$/i, "Crisis anglofona de Camerun"],
  [/^2001 insurgency in the Republic of Macedonia$/i, "Conflicto de la Republica de Macedonia de 2001"],
  [/^Puntland crisis \\(2001-2003\\)$/i, "Crisis de Puntlandia (2001-2003)"],
  [/^Red Sea crisis$/i, "Crisis del mar Rojo"],
  [/^Guinean coup d'etat de 2021$/i, "Golpe de Estado guineano de 2021"],
  [/^Somali Civil War \\(2006-2009\\)$/i, "Guerra civil somali (2006-2009)"],
  [/^South Ossetia War$/i, "Guerra de Osetia del Sur de 2008"],
  [/^North Waziristan border incidents de 2025$/i, "Incidentes fronterizos en Waziristan del Norte de 2025"],
  [/^Russian drone incursions into Poland de September 2025$/i, "Incursion de drones rusos en Polonia de septiembre de 2025"],
  [/^2001 invasion of Afghanistan$/i, "Invasion de Afganistan de 2001"],
  [/^2003 invasion of Iraq$/i, "Invasion de Irak de 2003"],
  [/^Iraq War \\(2003-2011\\)$/i, "Guerra de Irak (2003-2011)"],
  [/^Boko Haram insurgency de 2009$/i, "Rebelion de Boko Haram de 2009"],
  [/^Herat uprising de 2001$/i, "Sublevacion en Herat de 2001"],
  [/^Ataques aÃ©reos de Yemen de 2024$/i, "Ataques de Estados Unidos en Yemen en 2025"],
  [/^Batalla de Boulikessi \\(2025\\)$/i, "Batalla de Boulikessi de 2025"],
  [/^Batalla de Dikwa \\(2 mar 2015\\)$/i, "Batalla de Dikwa de 2015"],
  [/^Batalla de Galwan$/i, "Combate en el valle del Galwan de 2020"],
  [/^Batalla de Kandahar \\(2021\\)$/i, "Batalla de Kandahar de 2021"],
  [/^Batalla de Mosul \\(2004\\)$/i, "Batalla de Mosul de 2004"],
  [/^Batalla de Mosul \\(2016-2017\\)$/i, "Batalla de Mosul de 2016-2017"],
  [/^Batalla de Ras Kamboni \\(2024\\)$/i, "Batalla de Ras Kamboni de 2024"],
  [/^Batalla de Shusha \\(2020\\)$/i, "Batalla de Shusha de 2020"],
  [/^Batalla de TinzawatÃ¨ne \\(2024\\)$/i, "Batalla de Tinzawatene de 2024"],
  [/^Conflicto de la RepÃºblica de Macedonia de 2001$/i, "Conflicto de la Republica de Macedonia de 2001"],
  [/^Contraofensiva del Ã“blast de JÃ¡rkov de 2022$/i, "Contraofensiva del oblast de Jarkov de 2022"],
  [/^Crisis anglÃ³fona de CamerÃºn$/i, "Crisis anglofona de Camerun"],
  [/^Guerra civil somalÃ­ \\(2006-2009\\)$/i, "Guerra civil somali (2006-2009)"],
  [/^Guerra entre IrÃ¡n e Irak$/i, "Guerra Iran-Iraq"],
  [/^Incidentes fronterizos en WaziristÃ¡n del Norte de 2025$/i, "Incidentes fronterizos en Waziristan del Norte de 2025"],
  [/^IncursiÃ³n de drones rusos en Polonia de septiembre de 2025$/i, "Incursion de drones rusos en Polonia de septiembre de 2025"],
  [/^InvasiÃ³n de AfganistÃ¡n de 2001$/i, "Invasion de Afganistan de 2001"],
  [/^InvasiÃ³n de Irak de 2003$/i, "Invasion de Irak de 2003"],
  [/^RebeliÃ³n de Boko Haram de 2009$/i, "Rebelion de Boko Haram de 2009"],
  [/^SublevaciÃ³n en Herat de 2001$/i, "Sublevacion en Herat de 2001"],
  [/^Adriatic Campaign.*World War II$/i, "Campaña del Adriatico en la Segunda Guerra Mundial"],
  [/^German occupation.*Luxembourg.*World War II$/i, "Ocupacion alemana de Luxemburgo en la Segunda Guerra Mundial"],
  [/^Operation Barbarossa$/i, "Operación Barbarroja"],
  [/^Operation Barbarossa$/i, "Operacion Barbarroja"],
  [/^American airborne operations in Normandy$/i, "Operaciones aerotransportadas americanas en Normandia"],
  [/^Battle of Caen$/i, "Batalla de Caen"],
  [/^Battle of Brest$/i, "Batalla de Brest"],
  [/^Battle of Monte Cassino$/i, "Batalla de Montecassino"],
  [/^Battle of Guam$/i, "Batalla de Guam"],
  [/^Battle of Labuan$/i, "Batalla de Labuan"],
  [/^Battle of Bologna$/i, "Batalla de Bologna"],
  [/^Battle of Durazzo$/i, "Batalla de Durazzo"],
  [/^Battle of Authion$/i, "Batalla de Authion"],
  [/^Battle of Damascus \\(1941\\)$/i, "Batalla de Damasco (1941)"],
  [/^Battle of Garfagnana$/i, "Batalla de Garfagnana"],
  [/^Battle of Giarabub$/i, "Batalla de Giarabub"],
  [/^Battle of Kolombangara$/i, "Batalla de Kolombangara"],
  [/^Battle of Shenkursk$/i, "Batalla de Shenkursk"],
  [/^Attack on Pearl Harbor$/i, "Ataque a Pearl Harbor"],
  [/^Battle of Chongju$/i, "Batalla de Chongju"],
  [/^Battle of Chuam-ni$/i, "Batalla de Chuam-ni"],
  [/^Battle of Kapyong$/i, "Batalla de Kapyong"],
  [/^Battle of Kujin$/i, "Batalla de Kujin"],
  [/^Battle of Chosin Reservoir$/i, "Batalla de la reserva de Chosin"],
  [/^Battle of Maehwa-san$/i, "Batalla de Maehwa-san"],
  [/^Battle of Busan$/i, "Batalla de Busan"],
  [/^Battle of Imjin River$/i, "Batalla del rio Imjin"],
  [/^Battle of Pusan Perimeter logistics$/i, "Batalla de la logistica del Perimetro de Pusan"],
  [/^Korean Theater$/i, "Teatro coreano"],
  [/^Second Battle of the Hook$/i, "Segunda batalla de Hook"]
];

CONFLICT_NAME_ALIASES.push(
  [/^American Revolutionary War$/i, "Guerra de Independencia de Estados Unidos"],
  [/^United States War of Independence$/i, "Guerra de Independencia de Estados Unidos"],
  [/^War of 1812$/i, "Guerra anglo-estadounidense de 1812"],
  [/^Mexican-American War$/i, "Guerra mexico-estadounidense"],
  [/^Mexican American War$/i, "Guerra mexico-estadounidense"],
  [/^American Civil War$/i, "Guerra de Secesion"],
  [/^Spanish-American War$/i, "Guerra hispano-estadounidense"],
  [/^Spanish American War$/i, "Guerra hispano-estadounidense"],
  [/^First Guatemala War$/i, "Primera guerra de Guatemala"],
  [/^Second Guatemala War$/i, "Segunda guerra de Guatemala"],
  [/^Third Guatemala War$/i, "Tercera guerra de Guatemala"],
  [/^Honduran-Salvadoran War de 1871$/i, "Guerra entre Honduras y El Salvador de 1871"],
  [/^1957 Honduras-Nicaragua border conflict$/i, "Conflicto fronterizo Honduras-Nicaragua de 1957"],
  [/^Football War$/i, "Guerra de las 100 horas"],
  [/^Invasion estadounidense de Panamá$/i, "Invasion estadounidense de Panama"],
  [/^United States invasion of Panama$/i, "Invasion estadounidense de Panama"],
  [/^Invasion de Granada$/i, "Invasion de Granada"],
  [/^United States invasion of Grenada$/i, "Invasion de Granada"],
  [/^Guerra Peruano-ecuatoriana$/i, "Guerra peruano-ecuatoriana"],
  [/^Gran Colombia-Peru War$/i, "Guerra grancolombo-peruana"],
  [/^Guerra grancolombo-Peruana$/i, "Guerra grancolombo-peruana"],
  [/^Peruvian-Ecuadorian War$/i, "Guerra peruano-ecuatoriana"],
  [/^Colombian conflict$/i, "Conflicto armado colombiano"],
  [/^Suriname Interior War$/i, "Guerra civil de Surinam"],
  [/^Rupununi uprising$/i, "Levantamiento del Rupununi"],
  [/^Guerra de Malvinas \(1982\)$/i, "Guerra de las Malvinas"]
);

CONFLICT_NAME_ALIASES.push(
  [/^Napoleonic Wars$/i, "Guerras napoleonicas"],
  [/^French Revolutionary Wars$/i, "Guerras revolucionarias francesas"],
  [/^Hundred Years'? War$/i, "Guerra de los Cien Anos"],
  [/^Second Hundred Years'? War$/i, "Segunda Guerra de los Cien Anos"],
  [/^Thirty Years'? War$/i, "Guerra de los Treinta Anos"],
  [/^Great Northern War$/i, "Gran Guerra del Norte"],
  [/^War of the Spanish Succession$/i, "Guerra de sucesion espanola"],
  [/^War of the Austrian Succession$/i, "Guerra de sucesion austriaca"],
  [/^Seven Years'? War$/i, "Guerra de los Siete Anos"],
  [/^Germany Unification War$/i, "Guerras de unificacion alemana"],
  [/^Second Schleswig War$/i, "Guerra de los Ducados"],
  [/^Austro-Prussian War$/i, "Guerra austro-prusiana"],
  [/^Franco-Prussian War$/i, "Guerra franco-prusiana"],
  [/^Balkan Wars$/i, "Guerras balcanicas"],
  [/^First Balkan War$/i, "Primera guerra balcanica"],
  [/^Second Balkan War$/i, "Segunda guerra balcanica"],
  [/^Bosnian War$/i, "Guerra de Bosnia"],
  [/^Croatian War of Independence$/i, "Guerra de Croacia"],
  [/^Croatian War$/i, "Guerra de Croacia"],
  [/^Yugoslav Wars$/i, "Guerras yugoslavas"],
  [/^Ten-Day War$/i, "Guerra de los Diez Dias"],
  [/^Troubles$/i, "Conflicto de Irlanda del Norte"],
  [/^The Troubles$/i, "Conflicto de Irlanda del Norte"],
  [/^Irish War of Independence$/i, "Guerra de Independencia irlandesa"],
  [/^Soviet-Finnish wars$/i, "Guerras sovietico-finlandesas"],
  [/^First Soviet-Finnish War$/i, "Primera guerra sovietico-finlandesa"],
  [/^Winter War$/i, "Guerra de Invierno"],
  [/^Continuation War$/i, "Guerra de Continuacion"],
  [/^Lapland War$/i, "Guerra de Laponia"],
  [/^Soviet-Bulgarian War$/i, "Guerra sovietico-bulgara"],
  [/^Eastern Front.*World War II.*Europe$/i, "Frente oriental de la Segunda Guerra Mundial"],
  [/^Eastern Front.*World War II$/i, "Frente oriental de la Segunda Guerra Mundial"],
  [/^Adriatic Campaign de World War II$/i, "Campana del Adriatico en la Segunda Guerra Mundial"],
  [/^German occupation de Luxemburgo en World War II$/i, "Ocupacion alemana de Luxemburgo en la Segunda Guerra Mundial"],
  [/^Liberation de East Finnmark$/i, "Liberacion de Finnmark oriental"],
  [/^1919 Soviet Invasion de Ukraine$/i, "Invasion sovietica de Ucrania de 1919"],
  [/^2022 Russian Invasion de Ukraine$/i, "Invasion rusa de Ucrania de 2022"],
  [/^Moscow City drone attacks$/i, "Ataques con drones contra Moscu"],
  [/^April 2009 raid off Somalia$/i, "Incursion naval frente a Somalia de abril de 2009"],
  [/^Battle of Britain$/i, "Batalla de Inglaterra"],
  [/^Battle of France$/i, "Batalla de Francia"],
  [/^Battle of Belgium$/i, "Batalla de Belgica"],
  [/^Battle of Dunkirk$/i, "Batalla de Dunkerque"],
  [/^Battle of the Atlantic$/i, "Batalla del Atlantico"],
  [/^Battle of Stalingrad$/i, "Batalla de Stalingrado"],
  [/^Battle of Kursk$/i, "Batalla de Kursk"],
  [/^Battle of Berlin$/i, "Batalla de Berlin"],
  [/^Battle of Narvik$/i, "Batallas de Narvik"],
  [/^Operation Dynamo$/i, "Operacion Dinamo"],
  [/^Operation Weserubung$/i, "Operacion Weserubung"],
  [/^Operation Weserübung$/i, "Operacion Weserubung"],
  [/^Operation Market Garden$/i, "Operacion Market Garden"]
);

CONFLICT_NAME_ALIASES.push(
  [/^Algerian Islamic Front War$/i, "Guerra civil argelina"],
  [/^Algerian Civil War$/i, "Guerra civil argelina"],
  [/^First Uganda War$/i, "Primera guerra de Uganda"],
  [/^Uganda-Tanzania War$/i, "Guerra tanzano-ugandesa"],
  [/^First Rwanda War$/i, "Primera guerra de Ruanda"],
  [/^Second Rwanda War$/i, "Segunda guerra de Ruanda"],
  [/^Third Rwanda War$/i, "Tercera guerra de Ruanda"],
  [/^First Burundi War$/i, "Primera guerra de Burundi"],
  [/^First Chad \(FROLINAT\) Rebellion$/i, "Primera rebelion chadiana del FROLINAT"],
  [/^Second Liberia War$/i, "Segunda guerra liberiana"],
  [/^Liberian Civil War$/i, "Guerra civil liberiana"],
  [/^Sierra Leone Civil War$/i, "Guerra civil de Sierra Leona"],
  [/^Guinea-Bissau Civil War$/i, "Guerra civil de Guinea-Bisau"],
  [/^First Ivorian Civil War$/i, "Primera guerra civil marfilena"],
  [/^Second Ivorian Civil War$/i, "Segunda guerra civil marfilena"],
  [/^Rhodesian Bush War$/i, "Guerra civil de Rodesia"],
  [/^Angolan Civil War$/i, "Guerra civil angolena"],
  [/^Mozambican Civil War$/i, "Guerra civil mozambiquena"],
  [/^Mali War$/i, "Guerra de Mali"],
  [/^Northern Mali conflict$/i, "Guerra de Mali"],
  [/^Maghreb insurgency$/i, "Insurgencia en el Magreb"],
  [/^Lord's Resistance Army insurgency$/i, "Insurgencia del Ejercito de Resistencia del Senor"],
  [/^Boko Haram insurgency$/i, "Rebelion de Boko Haram de 2009"],
  [/^Boko Haram insurgency de 2009$/i, "Rebelion de Boko Haram de 2009"],
  [/^Shifta War$/i, "Guerra de Shifta"],
  [/^Ogaden War$/i, "Guerra de Ogaden"],
  [/^Battle of Mogadishu$/i, "Batalla de Mogadiscio"],
  [/^Battle of Lukaya$/i, "Batalla de Lukaya"],
  [/^Battle of Masaka$/i, "Batalla de Masaka"],
  [/^Battle of Kisangani$/i, "Batalla de Kisangani"],
  [/^Battle of Mocimboa da Praia$/i, "Batalla de Mocimboa da Praia"],
  [/^Battle of Mocímboa da Praia$/i, "Batalla de Mocimboa da Praia"],
  [/^Battle of Kumbo$/i, "Batalla de Kumbo"],
  [/^Battle of Tinzawatène \(2024\)$/i, "Batalla de Tinzawatene de 2024"],
  [/^Battle of Boulikessi \(2025\)$/i, "Batalla de Boulikessi de 2025"],
  [/^2016 Sirte offensive$/i, "Ofensiva de Sirte de 2016"],
  [/^Amhara offensive de 2024$/i, "Ofensiva de Amhara de 2024"]
);

CONFLICT_NAME_ALIASES.push(
  [/^Indochina Wars$/i, "Guerras de Indochina"],
  [/^First Indochina War$/i, "Primera guerra de Indochina"],
  [/^Second Indochina War$/i, "Guerra de Vietnam"],
  [/^Third Indochina War$/i, "Tercera Guerra de Indochina"],
  [/^Second Cambodia Civil$/i, "Segunda guerra civil camboyana"],
  [/^Cambodian-Vietnamese War$/i, "Guerra camboyano-vietnamita"],
  [/^Vietnamese-Cambodian War$/i, "Guerra camboyano-vietnamita"],
  [/^Laotian Civil War$/i, "Guerra Civil de Laos"],
  [/^Insurgency in Laos$/i, "Insurgencia en Laos"],
  [/^Chinese invasion of Taiwan$/i, "Invasion china de Taiwan"],
  [/^Chinese Invasion de Taiwan$/i, "Invasion china de Taiwan"],
  [/^Second Sino-Japanese War$/i, "Segunda guerra sino-japonesa"],
  [/^Sino-Vietnamese War$/i, "Guerra sino-vietnamita"],
  [/^Third Indochina War$/i, "Tercera Guerra de Indochina"],
  [/^Sino-Soviet border conflict$/i, "Conflicto fronterizo sino-sovietico"],
  [/^Sino-Indian War$/i, "Guerra sino-india"],
  [/^Nathu La and Cho La clashes$/i, "Enfrentamientos en Nathu La y Cho La"],
  [/^South China Sea skirmish$/i, "Incidente del Arrecife Johnson del Sur"],
  [/^Johnson South Reef Skirmish$/i, "Incidente del Arrecife Johnson del Sur"],
  [/^UN offensive into North Korea$/i, "Ofensiva de la ONU en Corea del Norte"],
  [/^Great Naktong Offensive$/i, "Gran ofensiva del Naktong"],
  [/^Battle of White Horse$/i, "Batalla de White Horse"],
  [/^Battle of Triangle Hill$/i, "Batalla de Triangle Hill"],
  [/^Battle of Pork Chop Hill$/i, "Batalla del Monte Calvo"],
  [/^Battle of Cheonpyeong Valley$/i, "Batalla del valle de Cheonpyeong"],
  [/^Battle of Punchbowl$/i, "Batalla de Punchbowl"],
  [/^Bombardment of Yeonpyeong$/i, "Bombardeo de Yeonpyeong"],
  [/^Kashmir conflict$/i, "Conflicto de Cachemira"],
  [/^Indo-Pakistani War of 1965$/i, "Guerra indo-pakistani de 1965"],
  [/^Indo-Pakistani War of 1971$/i, "Guerra indo-pakistani de 1971"],
  [/^Bangladesh Liberation War$/i, "Guerra de Liberacion de Bangladesh"],
  [/^Bangladesh Liberation War$/i, "Guerra de Bangladesh"],
  [/^Eelam War I$/i, "Primera guerra de Eelam"],
  [/^Eelam War II$/i, "Segunda guerra de Eelam"],
  [/^Eelam War III$/i, "Tercera guerra de Eelam"],
  [/^Eelam War IV$/i, "Cuarta guerra de Eelam"],
  [/^Eastern Theater de Eelam War IV$/i, "Teatro oriental de la Cuarta guerra de Eelam"],
  [/^Sri Lankan Civil War$/i, "Guerra civil de Sri Lanka"],
  [/^Indian intervention in the Sri Lankan Civil War$/i, "Intervencion india en la guerra civil de Sri Lanka"],
  [/^Naf War$/i, "Guerra del Naf"],
  [/^Kachin conflict$/i, "Conflicto en Kachin"],
  [/^Indonesian National Revolution$/i, "Revolucion indonesia"],
  [/^Indonesia-Malaysia confrontation$/i, "Confrontacion indonesio-malaya"],
  [/^Indonesian invasion of East Timor$/i, "Invasion indonesia de Timor Oriental"],
  [/^Indonesian occupation of East Timor$/i, "Ocupacion indonesia de Timor Oriental"],
  [/^East Timor crisis$/i, "Crisis de Timor Oriental"],
  [/^Georgia War$/i, "Guerra de Osetia del Sur de 2008"],
  [/^Russo-Georgian War$/i, "Guerra de Osetia del Sur de 2008"],
  [/^War in Abkhazia$/i, "Guerra de Abjasia"],
  [/^Tajikistani Civil War$/i, "Guerra civil tayika"],
  [/^Batken conflict$/i, "Conflicto de Batken"],
  [/^Kyrgyzstan-Tajikistan clashes of 2021$/i, "Conflicto entre Kirguistan y Tayikistan de 2021"],
  [/^Nagorno-Karabakh conflict$/i, "Conflicto de Nagorno-Karabaj"],
  [/^2016 Nagorno-Karabakh conflict$/i, "Conflicto de Nagorno-Karabaj de 2016"],
  [/^Second Nagorno-Karabakh War$/i, "Segunda guerra de Nagorno-Karabaj"],
  [/^Battle of Shusha \(2020\)$/i, "Batalla de Shusha de 2020"],
  [/^Capture of Lachin$/i, "Captura de Lachin"],
  [/^Battle of Jabrayil$/i, "Batalla de Jabrayil"],
  [/^Yemeni Civil War$/i, "Guerra civil yemení"],
  [/^North Yemen Civil War$/i, "Guerra civil de Yemen del Norte"],
  [/^Saudi-Yemeni War$/i, "Guerra saudo-yemeni"],
  [/^South Thailand insurgency$/i, "Insurgencia en el sur de Tailandia"]
);

CONFLICT_NAME_ALIASES.push(
  [/^Bougainville conflict$/i, "Conflicto de Bougainville"],
  [/^Bougainville Civil War$/i, "Conflicto de Bougainville"],
  [/^Fiji constitutional crisis$/i, "Crisis constitucional de Fiyi"],
  [/^Solomon Islands ethnic tension$/i, "Conflicto etnico de las Islas Salomon"],
  [/^Ethnic tension in the Solomon Islands$/i, "Conflicto etnico de las Islas Salomon"],
  [/^Coconut War$/i, "Guerra del Coco"],
  [/^Malayan Emergency$/i, "Emergencia Malaya"],
  [/^Battle of Gang Toi$/i, "Batalla de Gang Toi"],
  [/^Battle of Long Tan$/i, "Batalla de Long Tan"],
  [/^Battle of Coral-Balmoral$/i, "Batalla de Coral-Balmoral"],
  [/^Battle of Coral–Balmoral$/i, "Batalla de Coral-Balmoral"],
  [/^Battle of Coralâ€“Balmoral$/i, "Batalla de Coral-Balmoral"],
  [/^Battle of Singapore$/i, "Batalla de Singapur"],
  [/^Battle of Sunda Strait$/i, "Batalla del estrecho de la Sonda"],
  [/^Battle of the Java Sea$/i, "Batalla del mar de Java"],
  [/^Battle of the Coral Sea$/i, "Batalla del mar del Coral"],
  [/^Battle of Timor$/i, "Batalla de Timor"],
  [/^Battle of Milne Bay$/i, "Batalla de la bahia de Milne"],
  [/^Kokoda Track campaign$/i, "Campana de Kokoda"],
  [/^Kokoda Trail campaign$/i, "Campana de Kokoda"],
  [/^Battle of Kolombangara$/i, "Batalla de Kolombangara"],
  [/^Battle of North Borneo$/i, "Batalla de Borneo septentrional"],
  [/^North Borneo battle$/i, "Batalla de Borneo septentrional"],
  [/^North Borneo campaign$/i, "Campana de Borneo septentrional"],
  [/^Battle between HMAS Sydney and Kormoran$/i, "Combate entre el HMAS Sydney y el Kormoran"],
  [/^Convoy GP 55$/i, "Convoy GP 55"],
  [/^Battle off Endau$/i, "Batalla frente a Endau"]
);

const CONFLICT_PARENT_RULES = [
  { parent: "Guerra de las Malvinas", matches: ["goose green", "pradera del ganso", "san carlos", "wireless ridge", "harriet", "longdon", "tumbledown"] },
  { parent: "Guerra de la Triple Alianza", matches: ["ita ybate", "tuyuti", "curupayti", "humaita"] },
  { parent: "Guerra ruso-ucraniana", matches: ["bajmut", "avdiivka", "mariupol", "jersÃ³n", "kherson", "kiev", "kyiv"] },
  { parent: "Guerra de Gaza", matches: ["gaza", "rafah", "khan yunis"] },
  { parent: "Segunda Guerra Mundial", matches: ["normandia", "stalingrado", "kursk", "el alamein", "midway", "berlin", "okinawa", "guadalcanal"] },
  { parent: "Primera Guerra Mundial", matches: ["somme", "verdun", "marne", "ypres", "gallipoli"] },
  { parent: "Guerra civil espanola", matches: ["guadalajara", "ebro", "jarama", "madrid", "brunete"] },
  { parent: "Guerra Iran-Iraq", matches: ["jorramshahr", "abadan", "faw", "basora"] },
  { parent: "Guerra de Vietnam", matches: ["tet", "khe sanh", "hue", "saigon", "dien bien phu"] },
  { parent: "Guerra de Corea", matches: ["incheon", "chosin", "pusan", "seul"] },
  { parent: "Guerra del Golfo", matches: ["73 easting", "khafji"] },
  { parent: "Guerra de Afganistan", matches: ["tora bora", "kunduz", "helmand", "kandahar"] }
];

const CONFLICT_CAMPAIGN_MARKERS = ["operacion", "campana", "campaña", "ofensiva", "frente", "asedio", "sitio"];

CONFLICT_PARENT_RULES.push(
  { parent: "Guerra de Independencia de Estados Unidos", matches: ["saratoga", "yorktown", "ticonderoga", "white marsh", "machias", "flamborough head", "minisink", "sullivan expedition", "delaware capes", "bull's ferry", "anne"] },
  { parent: "Guerra mexico-estadounidense", matches: ["palo alto", "resaca de la palma", "santa fe", "buena vista", "chapultepec", "cerro gordo", "contreras", "churubusco", "molino del rey"] },
  { parent: "Guerra de Secesion", matches: ["fort sumter", "gettysburg", "vicksburg", "antietam", "shiloh", "chancellorsville", "appomattox", "bull run", "sherman", "atlanta"] },
  { parent: "Guerra de las Malvinas", matches: ["bahia agradable", "ara general belgrano", "hms sheffield", "black buck", "puente murrell", "dos hermanas"] },
  { parent: "Guerra del Pacifico", matches: ["pilcomayo", "rimac", "alto de la alianza", "callao", "arica", "iquique", "angamos", "tacna", "chorrillos", "miraflores", "pisagua"] },
  { parent: "Guerra de la Triple Alianza", matches: ["riachuelo", "curupayty", "mercedes", "ita ybate", "humaita", "cabral y lima barros", "paso de curupayty"] },
  { parent: "Guerra del Chaco", matches: ["alihuata", "boqueron", "nanawa", "campo via", "canada strongest", "fortin"] },
  { parent: "Guerra peruano-ecuatoriana", matches: ["paquisha", "cenepa", "rio de janeiro", "cordillera del condor"] },
  { parent: "Guerra contra la Confederacion Peru-Boliviana", matches: ["yungay", "portada de guias", "buin", "casma", "captura de buques de la confederacion"] },
  { parent: "Guerra hispano-estadounidense", matches: ["san juan", "santiago de cuba", "manila bay", "bahia de manila", "el caney"] },
  { parent: "Guerra civil de Surinam", matches: ["surinam", "interior war"] },
  { parent: "Conflicto armado colombiano", matches: ["triangle hill", "monte calvo", "farc", "eln", "auc"] },
  { parent: "Guerra contra el narcotrafico en Mexico", matches: ["campeche", "matamoros", "cerro del gallo", "gonzalez", "baja california"] },
  { parent: "Guerras napoleonicas", matches: ["waterloo", "austerlitz", "trafalgar", "borodino", "leipzig", "wagram", "jena", "friedland", "peninsular"] },
  { parent: "Guerra de Crimea", matches: ["sevastopol", "balaclava", "inkerman", "alma", "malakoff"] },
  { parent: "Guerra franco-prusiana", matches: ["sedan", "metz", "paris 1870", "gravelotte", "mars-la-tour"] },
  { parent: "Guerra civil espanola", matches: ["guernica", "teruel", "belchite", "malaga", "badajoz"] },
  { parent: "Guerra de Bosnia", matches: ["sarajevo", "srebrenica", "mostar", "bihac", "operacion deliberate force"] },
  { parent: "Guerra de Kosovo", matches: ["kosovo", "racak", "pristina", "frontera albano-yugoslava"] },
  { parent: "Guerra de Croacia", matches: ["vukovar", "dubrovnik", "operacion tormenta", "krajina", "winter '94"] },
  { parent: "Guerras yugoslavas", matches: ["guerra croata-bosnia", "krajina bosnia", "conflicto de la republica de macedonia", "aracinovo", "tetovo", "radusa"] },
  { parent: "Guerra de Independencia irlandesa", matches: ["black and tans", "bloody sunday 1920", "cork", "soloheadbeg"] },
  { parent: "Conflicto de Irlanda del Norte", matches: ["bloody sunday", "omagh", "ira provisional", "ulster", "belfast"] },
  { parent: "Guerra de Invierno", matches: ["raate road", "suomussalmi", "mannerheim"] },
  { parent: "Guerra de Continuacion", matches: ["petajasaari", "tali-ihantala", "viborg"] },
  { parent: "Guerra de Laponia", matches: ["laponia", "rovaniemi"] },
  { parent: "Guerra de los Treinta Anos", matches: ["breitenfeld", "lutzen", "rocroi", "white mountain"] },
  { parent: "Gran Guerra del Norte", matches: ["poltava", "narva", "holowczyn", "helsingborg", "pruzany", "pryluky"] },
  { parent: "Guerras de unificacion alemana", matches: ["guerra de los ducados", "guerra austro-prusiana", "guerra franco-prusiana", "kolding", "fredericia", "isted", "schleswig"] },
  { parent: "Guerra ruso-ucraniana", matches: ["kupiansk", "kramatorsk", "izmail", "isla de las serpientes", "moscu", "moscow city", "pryluky", "karlivka"] },
  { parent: "Guerra del Sahara Occidental", matches: ["la guera", "tichla", "ain ben tili", "amgala", "bucraa", "zuerate", "al mahbes", "tan-tan", "zag", "guelta zemmur", "ras el-khanfra", "esmara", "lemseied", "tifariti", "ain-lahchich", "hausa", "oum dreyga", "farsia", "bir enzaran", "cabo bojador", "lebouirate", "ramth-al-lbane", "z'moul"] },
  { parent: "Guerra civil argelina", matches: ["frente islamico de salvacion", "grupo islamico armado", "guerra islamista argelina"] },
  { parent: "Guerra tanzano-ugandesa", matches: ["lukaya", "masaka", "kampala"] },
  { parent: "Guerra del Ogaden", matches: ["jijiga", "harar", "ogaden"] },
  { parent: "Guerra civil somali", matches: ["mogadiscio", "mocadiscio", "ras kamboni", "puntlandia", "somalilandia", "pirateria somali"] },
  { parent: "Segunda guerra del Congo", matches: ["kisangani", "lubumbashi", "guerra de kivu", "congo y ruanda", "ituri"] },
  { parent: "Primera Guerra del Congo", matches: ["primera guerra del congo", "zair", "mobutu"] },
  { parent: "Guerra civil ruandesa", matches: ["genocidio de ruanda", "asesinato de cascos azules belgas"] },
  { parent: "Guerra civil de Sierra Leona", matches: ["sierra leona", "ruf", "freetown"] },
  { parent: "Segunda guerra liberiana", matches: ["monrovia", "liberia", "lurd", "model"] },
  { parent: "Primera guerra civil marfilena", matches: ["marfil", "bouake", "costa de marfil"] },
  { parent: "Rebelion de Boko Haram de 2009", matches: ["dikwa", "kumbo", "boko haram", "lago chad"] },
  { parent: "Guerra de Mali", matches: ["tinzawatene", "boulikessi", "azawad", "tuareg", "kidal", "gao", "tombuctu"] },
  { parent: "Crisis anglofona de Camerun", matches: ["kumbo", "anglofona", "ambazonia"] },
  { parent: "Guerra civil angolena", matches: ["angola", "unita", "mpla", "lucusse"] },
  { parent: "Guerra civil de Rodesia", matches: ["rodesia", "zimbabue", "bush war"] },
  { parent: "Guerra civil mozambiquena", matches: ["mocimboa", "renamo", "frelimo", "mozambique"] },
  { parent: "Guerra civil china", matches: ["huaihai", "liaoshen", "pingjin", "taiwan", "kuomintang", "comunistas chinos"] },
  { parent: "Segunda guerra sino-japonesa", matches: ["nankin", "shanghai 1937", "wuhan", "changsha", "hamgyong", "myeongnyang", "noryang"] },
  { parent: "Guerra de Corea", matches: ["osan", "estrecho de corea", "perimetro de pusan", "naktong", "white horse", "triangle hill", "monte calvo", "punchbowl", "cheonpyeong", "yeonpyeong", "gurung hill"] },
  { parent: "Guerra de Vietnam", matches: ["operacion masher", "tra vinh dong", "ofensiva del tet", "counteroffensive phase", "signal hill", "long tan"] },
  { parent: "Guerras de Indochina", matches: ["indochina", "laos", "camboyano-vietnamita", "tercera guerra de indochina"] },
  { parent: "Tercera Guerra de Indochina", matches: ["fakashan", "arrecife johnson", "guerra sino-vietnamita", "camboyano-vietnamita"] },
  { parent: "Guerra sino-india", matches: ["rezang la", "walong", "nathu la", "cho la", "galwan"] },
  { parent: "Conflicto de Cachemira", matches: ["cachemira", "kashmir", "basantar", "kargil"] },
  { parent: "Guerra de Bangladesh", matches: ["liberacion de bangladesh", "guerra indo-pakistani de 1971", "naf"] },
  { parent: "Guerra civil de Sri Lanka", matches: ["eelam", "galle", "tigres tamiles", "ltte"] },
  { parent: "Guerra civil de Myanmar", matches: ["kachin", "naf", "birmania"] },
  { parent: "Revolucion indonesia", matches: ["revolucion indonesia", "buru", "molucas del sur"] },
  { parent: "Invasion indonesia de Timor Oriental", matches: ["aileu", "baucau", "lospalos", "timor oriental"] },
  { parent: "Conflicto entre Gaza e Israel", matches: ["re'im", "gaza", "franja de gaza", "beqaa", "yemen de 2024", "crisis del mar rojo"] },
  { parent: "Guerra Iran-Iraq", matches: ["morvarid", "abadan", "petroleros", "faluya", "marismas"] },
  { parent: "Guerra de Irak", matches: ["bagdad de 2003", "ramadi", "mosul", "pirde", "um kasar", "fallujah", "faluya"] },
  { parent: "Guerra civil siria", matches: ["al-qaryatayn", "acero de damasco", "amanecer de la libertad", "alepo", "siria oriental"] },
  { parent: "Guerra civil yemení", matches: ["sana", "al hudaydah", "yakla", "sa'dah", "huti"] },
  { parent: "Conflicto de Nagorno-Karabaj", matches: ["mardakert", "martuni", "shusha", "lachin", "jabrayil", "nagorno"] },
  { parent: "Guerra de Abjasia", matches: ["gagra", "sujumi", "tkvarcheli", "kamani", "ochamchira", "abjasia"] },
  { parent: "Guerra de Osetia del Sur de 2008", matches: ["osetia del sur", "liakhvi", "georgia war"] },
  { parent: "Guerra civil tayika", matches: ["tayika", "batken", "tayikistan"] },
  { parent: "Conflicto entre Kirguistan y Tayikistan de 2021", matches: ["kirguistan y tayikistan", "kirguistán y tayikistán"] },
  { parent: "Segunda Guerra Mundial", matches: ["singapur", "estrecho de la sonda", "mar de java", "mar del coral", "timor", "bahia de milne", "kokoda", "kolombangara", "north borneo", "borneo septentrional", "hmas sydney", "kormoran", "convoy gp 55", "endau"] },
  { parent: "Campana de Borneo", matches: ["labuan", "borneo septentrional", "north borneo", "tarakan", "balikpapan"] },
  { parent: "Guerra de Vietnam", matches: ["gang toi", "long tan", "coral-balmoral", "coral–balmoral", "ofensiva del tet"] },
  { parent: "Emergencia Malaya", matches: ["malaya", "malayan"] },
  { parent: "Conflicto de Bougainville", matches: ["bougainville", "papua nueva guinea"] },
  { parent: "Conflicto etnico de las Islas Salomon", matches: ["salomon", "guadalcanal moderna", "malaita"] },
  { parent: "Crisis constitucional de Fiyi", matches: ["fiyi", "fiji", "constitucional de fiyi"] },
  { parent: "Guerra del Coco", matches: ["coconut", "espiritu santo", "vanuatu"] },
  { parent: "Segunda Guerra Mundial", matches: ["desembarco de normandia", "barbarroja", "ardennes", "market garden", "monte cassino", "pearl harbor", "frente oriental de la segunda guerra mundial", "frente del sudeste de asia en la segunda guerra mundial"] },
  { parent: "Primera Guerra Mundial", matches: ["jutlandia", "tannenberg", "caporetto", "aisne", "meuse", "scarpe", "picardy"] },
  { parent: "Primera Guerra Mundial", matches: ["arras", "cambrai", "vimy", "messines", "vittorio veneto", "primera batalla de ypres", "segunda batalla de somme", "segunda batalla del marne", "tercera batalla de aisne"] },
  { parent: "Guerra de Vietnam", matches: ["ia drang", "hamburger hill"] },
  { parent: "Guerra de Corea", matches: ["busan", "imjin", "punchbowl", "hook"] },
  { parent: "Guerra de Afganistan", matches: ["alasay", "uzbin", "joybar"] },
  { parent: "Guerra ruso-japonesa", matches: ["port arthur", "tsushima", "mukden"] },
  { parent: "Guerra de Argelia", matches: ["argel", "constantina", "aures"] },
  { parent: "Guerra del Pacifico", matches: ["iquique", "angamos", "arica", "tacna", "chorrillos", "miraflores"] },
  { parent: "Guerra del Chaco", matches: ["boqueron", "nanawa", "campo via", "fortin"] },
  { parent: "Guerra del Cenepa", matches: ["cenepa", "falso paquisha"] },
  { parent: "Guerra contra el narcotrafico en Mexico", matches: ["carteles", "sinaloa", "juarez", "michoacan"] },
  { parent: "Levantamiento zapatista", matches: ["chiapas", "ezln", "zapatista"] },
  { parent: "Guerra contra la Confederacion Peru-Boliviana", matches: ["confederacion peru-boliviana"] },
  { parent: "Guerra civil china", matches: ["huaihai", "liaoshen", "pingjin"] },
  { parent: "Guerra arabe-israeli de 1948", matches: ["latrun", "negev", "jerusalen"] },
  { parent: "Segunda Guerra Mundial", matches: ["amiens", "manila", "borneo"] },
  { parent: "Guerra de Vietnam", matches: ["long tan", "coral", "balmoral"] },
  { parent: "Guerra del Golfo", matches: ["bubiyan"] },
  { parent: "Guerra arabe-israeli de 1948", matches: ["campana del neguev"] },
  { parent: "Guerra de Corea", matches: ["dmz incident", "cheonpyeong", "incheon", "ofensiva de la onu en corea del norte"] },
  { parent: "Guerra de Corea", matches: ["chongju", "chuam-ni", "kapyong", "kujin", "chosin", "maehwa-san", "busan", "imjin", "teatro coreano", "segunda batalla de hook", "perimetro de pusan"] },
  { parent: "Guerra de Vietnam", matches: ["contraofensiva vietnamita fase ii", "contraofensiva vietnamita fase iii"] },
  { parent: "Conflicto entre Gaza e Israel", matches: ["guerra de gaza", "gaza strip", "gaza de 2012"] },
  { parent: "Conflicto irano-israeli", matches: ["irano-israeli durante la guerra civil siria"] },
  { parent: "Segunda Guerra Mundial", matches: ["batalla de las ardenas", "north borneo"] },
  { parent: "Segunda Guerra Mundial", matches: ["midway", "guadalcanal", "el alamein", "gazala"] },
  { parent: "Guerra de Vietnam", matches: ["ofensiva del tet", "khe sanh", "coral-balmoral", "saigon", "ia drang", "signal hill"] },
  { parent: "Guerras arabe-israelies", matches: ["guerra de independencia de israel", "yom kippur", "guerra de los seis dias", "suez"] },
  { parent: "Segunda guerra del Congo", matches: ["kivu", "conflicto entre la republica democratica del congo y ruanda"] },
  { parent: "Guerra del Sahara Occidental", matches: ["sahara occidental", "saharaui"] },
  { parent: "Guerra civil sursudanesa", matches: ["sursudanesa"] },
  { parent: "Segunda guerra civil sudanesa", matches: ["sudanesa"] },
  { parent: "Segunda guerra del Congo", matches: ["ituri", "congo y ruanda"] },
  { parent: "Guerra del Sahara Occidental", matches: ["intifada saharaui", "sahara espanol"] },
  { parent: "Guerra civil somali", matches: ["somalilandia", "frente a somalia", "antipirateria en somalia"] },
  { parent: "Guerra entre Etiopia y Eritrea", matches: ["yibuti y eritrea", "eritrea-etiope"] },
  { parent: "Primera guerra de Ruanda", matches: ["ruandesa de 1990"] },
  { parent: "Segunda guerra de Ruanda", matches: ["ruandesa de 1994", "genocidio de ruanda"] },
  { parent: "Segunda guerra liberiana", matches: ["guerra liberiana"] },
  { parent: "Primera guerra civil marfilena", matches: ["marfilena"] },
  { parent: "Guerra de Irak", matches: ["al fao de 2003", "bagdad de 2003", "kerbala de 2003", "mosul de 2004", "mosul de 2016-2017", "invasion de irak de 2003", "guerra de irak (2003-2011)"] },
  { parent: "Guerra de Afganistan", matches: ["kandahar de 2021", "invasion de afganistan de 2001", "sublevacion en herat de 2001", "waziristan"] },
  { parent: "Guerra civil siria", matches: ["alepo de abril de 2016"] },
  { parent: "Guerra rusoucraniana", matches: ["invasion rusa de ucrania de 2022", "contraofensiva del oblast de jarkov de 2022"] },
  { parent: "Conflicto entre Gaza e Israel", matches: ["crisis del mar rojo", "beqaa valley airstrikes"] },
  { parent: "Guerra civil somali", matches: ["ras kamboni de 2024", "guerra civil somali (2006-2009)", "puntlandia"] },
  { parent: "Rebelion de Boko Haram de 2009", matches: ["dikwa de 2015"] },
  { parent: "Crisis anglofona de Camerun", matches: ["boulikessi de 2025"] },
  { parent: "Segunda Guerra Mundial", matches: ["caen", "brest", "montecassino", "guam", "labuan", "bologna", "durazzo", "authion", "damasco (1941)", "garfagnana", "giarabub", "kolombangara", "shenkursk", "barbarroja", "pearl harbor", "luxemburgo en la segunda guerra mundial", "campana del adriatico en la segunda guerra mundial"] },
  { parent: "Desembarco de Normandia", matches: ["operaciones aerotransportadas americanas en normandia", "batalla de caen", "batalla de brest"] }
);

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

function mergeConflictChronology(baseItems = [], importedItems = []) {
  const seen = new Set();
  return [...baseItems, ...importedItems].filter(item => {
    const key = `${item?.year || ""}:${normalizeText(item?.text || item || "")}`;
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
        ...item,
        text: sanitizeConflictModalText(item?.text || item || "")
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
  if (wikipediaConflictDetailsMerged || !importedDetails || typeof importedDetails !== "object") {
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

  wikipediaConflictDetailsMerged = true;
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
      refreshCountryStyles();
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
  viewer.scene.screenSpaceCameraController.inertiaSpin = isMobileLayout() ? 0.58 : 0.78;
  viewer.scene.screenSpaceCameraController.inertiaTranslate = currentMapMode === "2d"
    ? (isMobileLayout() ? 0.07 : 0.12)
    : (isMobileLayout() ? 0.52 : 0.74);
  viewer.scene.screenSpaceCameraController.inertiaZoom = currentMapMode === "2d"
    ? (isMobileLayout() ? 0.07 : 0.12)
    : (isMobileLayout() ? 0.46 : 0.62);
  viewer.scene.screenSpaceCameraController.enableRotate = currentMapMode !== "2d";
  viewer.scene.screenSpaceCameraController.enableTranslate = true;
  viewer.scene.screenSpaceCameraController.enableZoom = true;
  viewer.scene.screenSpaceCameraController.maximumMovementRatio = currentMapMode === "2d"
    ? (isMobileLayout() ? 0.07 : 0.1)
    : (isMobileLayout() ? 0.15 : 0.17);
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
    updateMapModeToggle();
    return;
  }

  if (detailedOverlayUpgradeTimer) {
    clearTimeout(detailedOverlayUpgradeTimer);
    detailedOverlayUpgradeTimer = null;
  }

  const normalizedMode = mode === "2d" ? "2d" : "3d";
  currentMapMode = normalizedMode;
  applyImageryForMode();

  if (normalizedMode === "2d") {
    viewer.scene.morphTo2D(animate ? 0.55 : 0);
  } else {
    viewer.scene.morphTo3D(animate ? 0.72 : 0);
  }

  updateMapInteractionTuning();
  setTimeout(async () => {
    await loadMap();
    fitWorldView();
    lastOverlayBucket = getCurrentOverlayBucket();
    renderMapLabels();
    viewer.scene.requestRender();
  }, animate ? (normalizedMode === "2d" ? 580 : 850) : 0);
  updateMapModeToggle();
}

function toggleMapMode() {
  applyMapMode(currentMapMode === "3d" ? "2d" : "3d");
}
window.addEventListener("resize", () => {
  map.invalidateSize();
  updateMapInteractionTuning();
});

let countriesData = {};
let rawPoliticsSystems = {};
let rawHistorySystems = {};
let rawInflationByCode = {};
let populationGrowthByCode = {};
let countryCodeByEnglishName = new Map();
let wikipediaConflictDetailOverrides = {};
let loadWikipediaConflictDetailsPromise = null;
let wikipediaConflictDetailsMerged = false;
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
let currentLanguage = "es";
let currentPanelState = { type: "empty" };
let savedFilters = [];
let savedViews = [];
let favoriteViews = [];
let searchHistory = [];
let savedSearches = [];
let compareBenchmarkMode = "world";
let activeNewsTopic = "general";
let appMode = "default";
let performanceMonitorId = null;
let labelEntities = [];
let qualityPreset = localStorage.getItem("geo-risk-quality-preset") || "auto";
let labelMode = localStorage.getItem("geo-risk-label-mode") || (window.matchMedia("(max-width: 820px)").matches ? "none" : "countries");
let autoRotateEnabled = localStorage.getItem("geo-risk-auto-rotate") === "true";
let lastInteractionAt = Date.now();
let isCameraNavigating = false;
let navigationQualityRestoreTimer = null;
let globeAutoRotateHandlerAttached = false;
let activeFocusToken = 0;
let lastOverlayBucket = "";
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
    label: "Islamismo",
    aliases: ["islam", "musulmanes", "musulman", "musulmana", "musulmanas", "islamicos", "islamico"],
    matches: ["musulman", "sunita", "chiita", "ibadi", "islam"]
  },
  {
    key: "judaísmo",
    label: "Judaismo",
    aliases: ["judaismo", "judaísmo", "judios", "judio", "judia", "judias"],
    matches: ["judio", "judia", "judais"]
  },
  {
    key: "hinduismo",
    label: "Hinduismo",
    aliases: ["hinduismo", "hindues", "hindÃºes", "hindÃº", "hindues"],
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
    label: "Sintoismo",
    aliases: ["sintoismo", "sintoísmo", "sintoistas", "sintoista", "shinto", "shintoismo"],
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
    label: "Ateos / agnosticos / sin afiliacion",
    aliases: ["ateos", "ateo", "agnosticos", "agnÃ³stico", "agnostico", "sin religion", "sin religiÃ³n", "sin afiliacion", "sin afiliaciÃ³n", "no afiliados", "no creyentes"],
    matches: ["ateo", "agnostic", "sin afili", "no afili", "no relig", "sin religion"]
  },
  {
    key: "animismo",
    label: "Religiones animistas",
    aliases: ["animismo", "animistas", "religiones animistas", "tradicionales"],
    matches: ["animist", "tradicional"]
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

if (sharedText.UI_STRINGS?.es) {
  Object.assign(UI_STRINGS.es, sharedText.UI_STRINGS.es);
}
if (sharedText.UI_STRINGS?.en) {
  Object.assign(UI_STRINGS.en, sharedText.UI_STRINGS.en);
}

function formatNumber(value) {
  if (typeof sharedText.formatNumber === "function") {
    return sharedText.formatNumber(value);
  }
  if (value === null || value === undefined || value === "") {
    return "Sin datos";
  }

  return Number(value).toLocaleString("es-AR");
}

function formatPercentage(value) {
  if (typeof sharedText.formatPercentage === "function") {
    return sharedText.formatPercentage(value);
  }
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0%";
  }

  return `${value.toLocaleString("es-AR", {
    minimumFractionDigits: value >= 10 ? 1 : 2,
    maximumFractionDigits: value >= 10 ? 1 : 2
  })}%`;
}

function parseInflationValue(value) {
  if (typeof sharedText.parseInflationValue === "function") {
    return sharedText.parseInflationValue(value);
  }
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
  if (typeof sharedText.formatInflation === "function") {
    const formatted = sharedText.formatInflation(value, { noDataLabel: t("noData") });
    if (formatted !== t("noData")) {
      const parsedShared = parseInflationValue(value);
      if (isValidInflationValue(parsedShared)) {
        return formatted;
      }
    }
  }
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
  if (typeof sharedText.repairMojibake === "function") {
    return sharedText.repairMojibake(value);
  }
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
  if (typeof sharedText.normalizeText === "function") {
    return sharedText.normalizeText(value);
  }
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
  if (typeof sharedText.escapeHtml === "function") {
    return sharedText.escapeHtml(repairMojibake(value));
  }
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

function normalizeCategoryLabel(value) {
  return String(value || "Sin datos")
    .replace(/\s+/g, " ")
    .trim();
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

function yieldToMainThread() {
  return new Promise(resolve => {
    if (typeof scheduler !== "undefined" && typeof scheduler.postTask === "function") {
      scheduler.postTask(resolve, { priority: "background" });
      return;
    }
    setTimeout(resolve, 0);
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
  if (typeof sharedText.getInitialism === "function") {
    return sharedText.getInitialism(value);
  }
  return normalizeText(value)
    .split(" ")
    .filter(Boolean)
    .map(token => token[0])
    .join("");
}

function t(key) {
  if (typeof sharedText.createTranslator === "function") {
    return sharedText.createTranslator(() => currentLanguage)(key);
  }
  return UI_STRINGS[currentLanguage]?.[key] || UI_STRINGS.es[key] || key;
}

function getFlagEmojiLegacy(code) {
  const fallbackFlags = {
    "CS-KM": "ðŸ‡½ðŸ‡°",
    "-99": "ðŸ´",
    ATA: "ðŸ‡¦ðŸ‡¶"
  };

  if (!code) {
    return "ðŸ³ï¸";
  }

  if (fallbackFlags[code]) {
    return fallbackFlags[code];
  }

  const normalized = code.slice(0, 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return "ðŸ³ï¸";
  }

  return String.fromCodePoint(
    ...[...normalized].map(char => 127397 + char.charCodeAt(0))
  );
}

function renderList(items) {
  if (!items || !items.length) {
    return "<p>Sin datos</p>";
  }

  return `<ul>${items.map(item => `<li>${escapeHtml(repairMojibake(item))}</li>`).join("")}</ul>`;
}

function isMobileLayout() {
  return mobileMediaQuery.matches;
}

function closeMobilePanels() {
  document.body.classList.remove("mobile-left-open", "mobile-country-open", "mobile-tools-open");

  const toolbar = document.getElementById("map-toolbar");
  if (toolbar && isMobileLayout()) {
    toolbar.open = false;
  }
}

function openMobilePanel(panel) {
  if (!isMobileLayout()) {
    return;
  }

  document.body.classList.remove("mobile-left-open", "mobile-country-open", "mobile-tools-open");

  if (panel === "left") {
    document.body.classList.add("mobile-left-open");
  } else if (panel === "tools") {
    document.body.classList.add("mobile-tools-open");
    const toolbar = document.getElementById("map-toolbar");
    if (toolbar) {
      toolbar.open = true;
    }
  } else {
    document.body.classList.add("mobile-country-open");
  }
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
    document.body.classList.add(className);
  }
}

function onMapInteractionStart() {
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

function renderCitiesLegacy(general) {
  const capital = general?.capital;
  const cities = Array.isArray(general?.cities) ? general.cities : [];

  const cityItems = [];

  if (capital?.name) {
    cityItems.push(
      `${capital.name}${capital.population ? ` (${formatNumber(capital.population)} hab.)` : ""}`
    );
  }

  cities.forEach(city => {
    if (!city?.name) {
      return;
    }

    cityItems.push(
      `${city.name}${city.population ? ` (${formatNumber(city.population)} hab.)` : ""}`
    );
  });

  return renderList(cityItems);
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
      <span class="${className}">
        <img class="flag-image" src="${escapeHtml(resolvedSrc)}" alt="${escapeHtml(label || code)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">
        <span class="flag-fallback" hidden>${emoji}</span>
      </span>
      `;
  }

  return `
    <span class="${className}">
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
        <text x="42" y="54" text-anchor="middle" font-family="Public Sans, Segoe UI, sans-serif" font-size="24" font-weight="700" fill="#eef5ff">${initials}</text>
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
  const validItems = items.filter(item => item && (item.value || item.secondary));
  if (!validItems.length) {
    return `<p>${escapeHtml(emptyLabel || t("noData"))}</p>`;
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
      const populationText = capital.population ? ` · ${formatNumber(capital.population)} hab.` : "";
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
      return `${city.name}${city.population ? ` (${formatNumber(city.population)} hab.${percentage})` : ""}`;
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
      value: formatNumber(getCountryConflictCount(country))
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

function renderCountryOverview(country, countryCode) {
  const stats = getCountryOverviewStats(country, countryCode);
  return `
    <div class="country-meta-strip">
      <span class="country-code-badge">${escapeHtml(countryCode || "---")}</span>
      <span class="country-meta-pill">${escapeHtml(translateContinentName(country.continent || "Unknown"))}</span>
      <span class="country-meta-pill">${escapeHtml(country.politics?.system || t("noData"))}</span>
    </div>
    <div class="country-overview-grid">
      ${stats.map(item => `
        <div class="overview-card">
          <span class="overview-label">${escapeHtml(item.label)}</span>
          <strong class="overview-value">${escapeHtml(item.value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
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

function renderDataQualityHighlights(country) {
  const quality = country?.metadata?.quality || {};
  const provenance = country?.metadata?.provenance || {};
  const qualityScore = Number.isFinite(quality.score) ? Math.max(0, Math.round(quality.score)) : null;
  const statusEntries = Object.entries(quality.sectionStatus || {});
  const curatedSections = statusEntries.filter(([, value]) => value === "curated" || value === "confirmed").length;
  const estimatedFields = Array.isArray(quality.estimatedFields) ? quality.estimatedFields.length : 0;
  const missingFields = Array.isArray(quality.missingFields) ? quality.missingFields.length : 0;

  return `
    <div class="source-audit-grid">
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Quality score" : "Calidad"}</span><strong class="overview-value">${qualityScore !== null ? `${qualityScore}/100` : t("noData")}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Updated" : "Actualizado"}</span><strong class="overview-value">${escapeHtml(country?.metadata?.updatedAt || "2026-04-16")}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Curated sections" : "Secciones curadas"}</span><strong class="overview-value">${formatNumber(curatedSections)}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Estimated fields" : "Campos estimados"}</span><strong class="overview-value">${formatNumber(estimatedFields)}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Missing fields" : "Campos faltantes"}</span><strong class="overview-value">${formatNumber(missingFields)}</strong></div>
    </div>
    ${Object.keys(provenance).length ? `
      <div class="provenance-grid">
        ${Object.entries(provenance).map(([key, value]) => `
          <div class="provenance-card">
            <span class="overview-label">${escapeHtml(key)}</span>
            <strong class="overview-value">${escapeHtml(value?.status || value || t("noData"))}</strong>
          </div>
        `).join("")}
      </div>
    ` : ""}
  `;
}

function getTimelineEventQuery(event, country) {
  if (event.query) {
    return event.query;
  }

  if (event.reference) {
    return event.reference;
  }

  return country?.name || event.text;
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

function syncModalOpenState() {
  const modalIds = ["country-modal", "compare-modal", "conflict-modal", "timeline-modal", "help-modal", "intro-modal", "product-modal"];
  const hasOpenModal = modalIds.some(id => {
    const modal = document.getElementById(id);
    return modal && !modal.hidden;
  });
  document.body.classList.toggle("modal-open", hasOpenModal);
}

function openCountryModal() {
  const modal = document.getElementById("country-modal");
  const dialog = document.querySelector("#country-modal .country-modal-dialog");
  if (!modal) {
    return;
  }
  closeMobilePanels();
  modal.hidden = false;
  dialog?.scrollTo({ top: 0, behavior: "auto" });
  syncModalOpenState();
}

function closeCountryModal() {
  const modal = document.getElementById("country-modal");
  if (!modal || modal.hidden) {
    return;
  }
  modal.hidden = true;
  syncModalOpenState();
}

function getReligionSummaryLabel(religion) {
  const summary = String(religion?.summary || "").trim();
  const composition = getReligionCompositionForDisplay(religion);

  if (!summary) {
    return "";
  }

  const normalizedSummary = normalizeText(summary);
  const topBranches = composition
    .filter(item => {
      const normalizedName = normalizeText(item.name);
      if (normalizedSummary.includes("crist")) {
        return /catol|protest|ortodox|anglican|evangel|copta/.test(normalizedName);
      }
      if (normalizedSummary.includes("islam") || normalizedSummary.includes("musulm")) {
        return /sun|chi|ibad/.test(normalizedName);
      }
      return false;
    })
    .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
    .slice(0, 3)
    .map(item => item.name);

  if (!topBranches.length) {
    return summary;
  }

  return `${summary}: ${topBranches.join(", ")}`;
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

function createSection(title, content, isOpen = false, sectionId = "") {
  const safeId = sectionId ? ` id="${escapeHtml(sectionId)}"` : "";
  return `
    <details class="panel-section"${safeId}${isOpen ? " open" : ""}>
      <summary>${title}</summary>
      <div class="panel-content">${content}</div>
    </details>
  `;
}

function renderCountryQuickNav(items = []) {
  const validItems = items.filter(item => item?.id && item?.label);
  if (!validItems.length) {
    return "";
  }
  return `
    <div class="country-quick-nav">
      ${validItems.map(item => `<button type="button" class="country-nav-chip" data-country-nav="${escapeHtml(item.id)}">${escapeHtml(item.label)}</button>`).join("")}
    </div>
  `;
}

function renderCountryMetaRibbon(country, conflictGroups = []) {
  const chips = [
    {
      label: currentLanguage === "en" ? "Population" : "Poblacion",
      value: formatNumber(country.general?.population || 0)
    },
    {
      label: currentLanguage === "en" ? "System" : "Sistema",
      value: country.politics?.system || t("noData")
    },
    {
      label: currentLanguage === "en" ? "Main religion" : "Religion principal",
      value: country.religion?.summary || t("noData")
    },
    {
      label: currentLanguage === "en" ? "Conflicts" : "Conflictos",
      value: formatNumber(conflictGroups.length)
    },
    {
      label: currentLanguage === "en" ? "Updated" : "Actualizado",
      value: country.metadata?.lastUpdated || t("noData")
    }
  ].filter(item => item.value && item.value !== t("noData"));

  return `<div class="country-meta-ribbon">${chips.map(item => `<span class="country-meta-pill"><b>${escapeHtml(item.label)}:</b> ${escapeHtml(String(item.value))}</span>`).join("")}</div>`;
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
  const offset = Math.max(0, section.offsetTop - 90);
  dialog.scrollTo({ top: offset, behavior: "smooth" });
}

function extractConflictStartYearLegacy(conflict) {
  if (!conflict) {
    return null;
  }

  if (typeof conflict === "object" && conflict.startYear) {
    return Number(conflict.startYear);
  }

  const match = String(conflict).match(/\((\d{3,4})/);
  return match ? Number(match[1]) : null;
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

function sortConflictsLegacy(conflicts) {
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

function cleanConflictNameLegacy(name) {
  return String(name || "")
    .replace(/\s*\((?:\d{3,4})(?:[-â€“]\d{3,4})?\)\s*$/u, "")
    .replace(/\s+\d{4}$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function translateConflictName(name) {
  let translated = cleanConflictName(name);

  for (const [pattern, replacement] of CONFLICT_NAME_ALIASES) {
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

function normalizeConflictForDisplayLegacy(conflict) {
  if (!conflict) {
    return null;
  }

  const name = translateConflictName(conflict.name || conflict);
  const startYear = extractConflictStartYear(conflict);
  const endYear = conflict.ongoing ? null : extractConflictEndYear(conflict);

  if (!name) {
    return null;
  }

  return {
    name,
    startYear,
    endYear,
    ongoing: Boolean(conflict.ongoing)
  };
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
    return "";
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

function renderConflictsLegacy(conflicts) {
  if (!conflicts || !conflicts.length) {
    return "<p>Sin datos</p>";
  }

  const cleanedConflicts = sortConflicts(
    conflicts
      .map(normalizeConflictForDisplay)
      .filter(Boolean)
      .filter(
        (conflict, index, list) =>
          index === list.findIndex(item => conflictDedupKey(item) === conflictDedupKey(conflict))
      )
  );

  if (!cleanedConflicts.length) {
    return "<p>Sin datos</p>";
  }

  return `<ul>${cleanedConflicts
    .map(conflict => `<li>${conflict.name}${formatConflictPeriod(conflict)}</li>`)
    .join("")}</ul>`;
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
    sourceName: rawName
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

function getConflictParentName(conflictName) {
  const normalized = normalizeText(conflictName);
  const match = CONFLICT_PARENT_RULES.find(rule =>
    rule.matches.some(token => normalized.includes(normalizeText(token)))
  );
  if (match?.parent) {
    return match.parent;
  }

  const detail = CONFLICT_DETAIL_OVERRIDES[conflictName] || {};
  const related = Array.isArray(detail.related) ? detail.related : [];
  const relatedWar = related.find(item => {
    const normalizedRelated = normalizeText(item);
    return /\bguerra\b|world war|conflicto|campaign|campana/.test(normalizedRelated);
  });
  if (relatedWar && normalizeText(relatedWar) !== normalized) {
    return translateConflictName(relatedWar);
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

  if (!parentName) {
    return "war";
  }

  const normalized = normalizeText(conflict?.name || conflict || "");
  if (CONFLICT_CAMPAIGN_MARKERS.some(marker => normalized.includes(marker))) {
    return "campaign";
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
    const parentName = getConflictParentName(conflict.name);
    if (!parentName) {
      standalone.push({ ...conflict, level: "war", campaigns: [], battles: [] });
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
  const wars = groups.length;
  const battles = groups.reduce((sum, group) => sum + (group.battles?.length || 0), 0);
  const ongoing = groups.filter(group => group.ongoing).length;
  const global = groups.filter(group => inferConflictScope(group, CONFLICT_DETAIL_OVERRIDES[group.name] || {}) === "global").length;
  const regional = groups.filter(group => inferConflictScope(group, CONFLICT_DETAIL_OVERRIDES[group.name] || {}) === "regional").length;
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
    .replace(/(?:^|\s)(?:ver|vease|v[eé]ase)\s+el?\s+anexo(?:$|\s)/gi, " ")
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

function getConflictModalContent(conflict, countryName = "") {
  const detail = CONFLICT_DETAIL_OVERRIDES[conflict.name] || {};
  const type = inferConflictType(conflict, detail);
  const scope = inferConflictScope(conflict, detail);
  const region = inferConflictRegion(conflict, detail, countryName);
  const participants = dedupeConflictParticipants(
    (Array.isArray(detail.participants) && detail.participants.length)
      ? detail.participants
      : buildGenericConflictParticipants(conflict, type, countryName)
  );
  const chronology = (Array.isArray(detail.chronology) && detail.chronology.length ? detail.chronology : buildGenericConflictChronology(conflict))
    .map(item => ({ ...item, text: sanitizeConflictModalText(item?.text || item || "") }))
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
    type,
    scope,
    region,
    cause: detail.cause || buildGenericConflictCause(conflict, type, scope, region, countryName),
    participants,
    chronology,
    battles: Array.isArray(conflict.battles) ? conflict.battles : [],
    campaigns: Array.isArray(conflict.campaigns) ? conflict.campaigns : [],
    related: (Array.isArray(detail.related) && detail.related.length) ? detail.related : buildGenericRelatedConflicts(conflict),
    outcome: detail.outcome || buildGenericConflictOutcome(conflict),
    consequences: detail.consequences || buildGenericConflictConsequences(conflict, type, region, countryName),
    wikipedia: detail.wikipedia || null
  };
}

function sanitizeConflictModalText(value = "") {
  return String(value || "")
    .replace(/&#\d+;?/g, " ")
    .replace(/&#x[a-f0-9]+;?/gi, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, " ")
    .replace(/&&&&+[^ \n]*/g, " ")
    .replace(/Expresi[oó]n err[oó]nea:[^.;\n]*/gi, " ")
    .replace(/(?:^|\s)(?:ver|vease|v[eé]ase)\s+el?\s+anexo(?:$|\s)/gi, " ")
    .replace(/\b(?:ver|mostrar|ocultar)\b/gi, " ")
    .replace(/Â·/g, " · ")
    .replace(/Â/g, " ")
    .replace(/\bTotal:\s*Total:/gi, "Total:")
    .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*(?:\s+[\p{L}\p{N}][\p{L}\p{N}.-]*)+)\s+\1\b/gu, "$1")
    .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*)\s+\1\b/gu, "$1")
    .replace(/\?{2,}/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function registerConflictModal(conflict, countryName = "") {
  const key = `conflict-${conflictModalCounter += 1}`;
  conflictModalRegistry.set(key, getConflictModalContent(conflict, countryName));
  return key;
}

function renderConflicts(conflicts) {
  if (!conflicts || !conflicts.length) {
    return "<p>Sin datos</p>";
  }

  const groupedConflicts = buildConflictGroups(conflicts);
  const filteredConflicts = filterConflictGroups(
    groupedConflicts,
    currentPanelState.type === "country" ? getConflictFilterState() : "all"
  );

  if (!filteredConflicts.length) {
    return "<p>Sin datos</p>";
  }

  return `${renderConflictFilters(groupedConflicts)}<ul class="conflict-tree">${filteredConflicts
    .map(conflict => {
      const modalKey = registerConflictModal(conflict, currentPanelState?.code ? countriesData[currentPanelState.code]?.name : "");
      const campaigns = sortConflicts(conflict.campaigns || []);
      const battles = sortConflicts(conflict.battles || []);
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
            const campaignBattles = sortConflicts(campaign.battles || []);
            return `<li>
              <button type="button" class="conflict-trigger conflict-trigger-campaign" data-conflict-key="${campaignKey}">
                <span class="conflict-trigger-title">${escapeHtml(campaign.name)}</span>
                <span class="conflict-trigger-period">${formatConflictPeriod(campaign).trim()}</span>
              </button>
              ${campaignBattles.length ? `<ul class="conflict-battles">${campaignBattles.map(battle => {
                const battleKey = registerConflictModal(battle, currentPanelState?.code ? countriesData[currentPanelState.code]?.name : "");
                return `<li><button type="button" class="conflict-trigger conflict-trigger-battle" data-conflict-key="${battleKey}"><span class="conflict-trigger-title">${escapeHtml(battle.name)}</span><span class="conflict-trigger-period">${formatConflictPeriod(battle).trim()}</span></button></li>`;
              }).join("")}</ul>` : ""}
            </li>`;
          }).join("")}</ul>` : ""}
          ${battles.length ? `<ul class="conflict-battles">${battles.map(battle => {
            const battleKey = registerConflictModal(battle, currentPanelState?.code ? countriesData[currentPanelState.code]?.name : "");
            return `<li><button type="button" class="conflict-trigger conflict-trigger-battle" data-conflict-key="${battleKey}"><span class="conflict-trigger-title">${escapeHtml(battle.name)}</span><span class="conflict-trigger-period">${formatConflictPeriod(battle).trim()}</span></button></li>`;
          }).join("")}</ul>` : ""}
        </li>
      `;
    })
    .join("")}</ul>`;
}

function openConflictModal(key) {
  const modal = document.getElementById("conflict-modal");
  const body = document.getElementById("conflict-modal-body");
  const detail = conflictModalRegistry.get(key);
  if (!modal || !body || !detail) {
    return;
  }

  body.innerHTML = `
    <h3 id="conflict-modal-title">${escapeHtml(detail.title)}</h3>
    <p class="conflict-modal-subtitle">${currentLanguage === "en" ? "Historical conflict summary" : "Resumen historico del conflicto"}</p>
    <div class="country-overview-grid relation-overview-grid conflict-overview-grid">
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Type" : "Tipo"}</span><strong class="overview-value">${escapeHtml(getConflictTypeLabel(detail.type))}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Scope" : "Escala"}</span><strong class="overview-value">${escapeHtml(getConflictScopeLabel(detail.scope))}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Region" : "Region"}</span><strong class="overview-value">${escapeHtml(detail.region || "Sin datos")}</strong></div>
    </div>
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
  viewer.scene.requestRender();
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
  viewer.scene.requestRender();
}

function getCountryClickTarget(code, layer) {
  return layer;
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
  viewer.scene.requestRender();
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

function renderCountry(country, fallbackName) {
  const countryCode = getCountryCodeByObject(country);
  if (countryCode && country?.metadata?.isIndex) {
    loadCountryDetail(countryCode);
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
  const conflictFilter =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.conflictFilter || defaultTimelineFilters.conflictFilter)
      : defaultTimelineFilters.conflictFilter;
  currentPanelState = { type: "country", code: countryCode, fallbackName, timelineFilter, timelineCentury, timelineIntensity, timelineRelevance, conflictFilter };
  const general = country.general || {};
  const economy = country.economy || {};
  const military = country.military || {};
  const history = country.history || {};
  const politics = country.politics || {};
  const relatedTerritories = getLinkedCodes(countryCode)
    .filter(code => code !== countryCode)
    .map(code => countriesData[code]?.name)
    .filter(Boolean);
  const conflictsSinceFormation = getConflictsSinceFormation(country);
  const conflictGroups = buildConflictGroups(conflictsSinceFormation);
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
  const conflictsLabel = history.year
    ? "Conflictos desde su año de formación:"
    : "Conflictos registrados:";

  document.getElementById("country-panel").innerHTML = `
    <div class="country-title">
      ${renderFlagVisual(countryCode, country.name || fallbackName, "country-flag", symbolAssets.flagSrc)}
      <div class="country-heading">
        <h2>${country.name || fallbackName}</h2>
        <p class="country-official-name">${escapeHtml(country.general?.officialName || country.name || fallbackName)}</p>
      </div>
      ${renderCoatVisual(countryCode, `${country.name || fallbackName} escudo`, symbolAssets.coatSrc)}
    </div>
    <div class="panel-actions-row">
      <button id="add-to-compare-button" class="panel-action-button" type="button" ${countryCode ? "" : "disabled"}>${t("addToCompare")}</button>
      <button class="panel-action-button" type="button" data-export-target="country-panel" data-export-format="png">${currentLanguage === "en" ? "Export image" : "Exportar imagen"}</button>
      <button class="panel-action-button" type="button" data-export-target="country-panel" data-export-format="pdf">${currentLanguage === "en" ? "Export PDF" : "Exportar PDF"}</button>
      <button class="panel-action-button" type="button" data-share-country="${escapeHtml(countryCode)}">${currentLanguage === "en" ? "Share" : "Compartir"}</button>
    </div>
    ${renderCountryOverview(country, countryCode)}
    ${renderCountryMetaRibbon(country, conflictGroups)}
    ${renderCountryQuickNav(countrySectionDescriptors)}
    ${createSection(
      t("general"),
      `
        <p><b>${t("population")}:</b> ${formatNumber(general.population)}</p>
        <p><b>${t("continent")}:</b> ${translateContinentName(country.continent)}</p>
        <p><b>${currentLanguage === "en" ? "Capitals" : "Capitales"}:</b></p>
        ${renderCapitalProfiles(general)}
        <p><b>${currentLanguage === "en" ? "Official name" : "Nombre oficial"}:</b> ${escapeHtml(general.officialName || country.name || t("noData"))}</p>
        <p><b>${currentLanguage === "en" ? "Official and main languages" : "Idiomas oficiales y principales"}:</b></p>
        ${renderLanguages(general)}
        <p><b>${currentLanguage === "en" ? "State structure" : "Estructura del Estado"}:</b> ${escapeHtml(general.stateStructure || t("noData"))}</p>
        <p><b>${currentLanguage === "en" ? "Primary subdivisions" : "Subdivisiones principales"}:</b> ${renderSubdivisionSummary(general)}</p>
        <p><b>${currentLanguage === "en" ? "Historical names" : "Nombres historicos"}:</b></p>
        ${renderRelationChips(general.historicalNames)}
        <p><b>${currentLanguage === "en" ? "Symbols" : "Simbolos"}:</b></p>
        ${renderSymbolShowcase(country, countryCode)}
        <p><b>${t("cities")}:</b></p>
        ${renderCities(general)}
      `,
      true,
      "country-section-general"
    )}
    ${createSection(
      t("history"),
      `
        <p><b>${t("origin")}:</b> ${translateHistoryText(history.origin)}</p>
        <p><b>${t("type")}:</b> ${translateHistoryText(history.type)}</p>
        <p><b>${t("formationYear")}:</b> ${history.year || t("noData")}</p>
        <p><b>${t("timeline")}:</b></p>
        ${renderTimeline(country)}
      `,
      false,
      "country-section-history"
    )}
    ${createSection(
      t("economy"),
      `
        <p><b>${t("gdp")}:</b> ${economy.gdp ? `US$ ${formatNumber(Math.round(economy.gdp))}` : t("noData")}</p>
        <p><b>${t("gdpPerCapita")}:</b> ${
          economy.gdpPerCapita
            ? `US$ ${formatNumber(Math.round(economy.gdpPerCapita))}`
            : t("noData")
        }</p>
        <p><b>${t("inflation")}:</b> ${formatInflation(economy.inflation)}</p>
        <p><b>${currentLanguage === "en" ? "Economic snapshot" : "Pulso economico"}:</b></p>
        ${renderEconomyMiniMetrics(country)}
        <p><b>Exportaciones:</b></p>
        ${renderList(economy.exports)}
        <p><b>Industrias:</b></p>
        ${renderList(economy.industries)}
      `,
      false,
      "country-section-economy"
    )}
    ${createSection(
      t("military"),
      `
        <p><b>${t("activePersonnel")}:</b> ${formatNumber(military.active)}</p>
        <p><b>${t("reserve")}:</b> ${formatNumber(military.reserve)}</p>
        ${renderConflictOverview(conflictGroups, country)}
        ${renderRelatedConflictSummary(conflictGroups)}
        <p><b>${conflictsLabel}</b></p>
        ${renderConflicts(conflictsSinceFormation)}
      `,
      false,
      "country-section-military"
    )}
    ${createSection(
      t("politics"),
      `
        <p><b>${t("politicalSystem")}:</b> ${politics.system || t("noData")}</p>
        <p><b>${t("organizations")}:</b></p>
        ${renderOrganizations(politics.organizations)}
        <p><b>Rivales historicos y actuales:</b></p>
        ${renderRivals(politics.rivals)}
      `,
      false,
      "country-section-politics"
    )}
    ${createSection(
      t("relations"),
      `
        ${renderRelationsSummary(country, countryCode)}
        ${renderRelationNetwork(country, countryCode)}
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Former metropole" : "Ex metropoli"}</p>
          ${renderRelationChips(country.politics?.relations?.exMetropole ? [country.politics.relations.exMetropole] : [])}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Former colonies / linked territories" : "Ex colonias y territorios vinculados"}</p>
          ${renderRelationChips(uniqueNormalizedList([
            ...(country.politics?.relations?.exColonies || []),
            ...(country.politics?.relations?.associatedTerritories || country.politics?.relations?.linkedTerritories || []),
            ...relatedTerritories
          ]))}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Military blocs" : "Bloques militares"}</p>
          ${renderRelationChips(country.politics?.relations?.militaryBlocs)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Economic blocs" : "Bloques economicos"}</p>
          ${renderRelationChips(country.politics?.relations?.economicBlocs)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Diplomatic blocs" : "Bloques diplomaticos"}</p>
          ${renderRelationChips(country.politics?.relations?.diplomaticBlocs)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Military allies" : "Aliados militares"}</p>
          ${renderRelationChips(country.politics?.relations?.militaryAllies)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Economic partners" : "Socios economicos"}</p>
          ${renderRelationChips(country.politics?.relations?.economicPartners)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Diplomatic partners" : "Socios diplomaticos"}</p>
          ${renderRelationChips(country.politics?.relations?.diplomaticPartners)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Disputes and contested spaces" : "Disputas y espacios disputados"}</p>
          ${renderRelationChips(country.politics?.relations?.disputedTerritories || country.politics?.relations?.disputes)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Dependencies and protectorates" : "Dependencias y protectorados"}</p>
          ${renderRelationChips(country.politics?.relations?.dependencies || country.politics?.relations?.protectorates)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${t("organizations")}</p>
          ${renderRelationChips((politics.organizations || []).slice(0, 8).map(getOrganizationDisplayName))}
        </div>
        <div class="relation-group">
          <p class="relation-title">${t("historicalRivals")}</p>
          ${renderRelationChips(uniqueNormalizedList([
            ...((politics.rivals || []).filter(rival => (rival.type || "historico") !== "actual").map(rival => rival.name || rival)),
            ...(country.politics?.relations?.historicalRivals || [])
          ]))}
        </div>
        <div class="relation-group">
          <p class="relation-title">${t("currentRivals")}</p>
          ${renderRelationChips(uniqueNormalizedList([
            ...((politics.rivals || []).filter(rival => rival.type === "actual").map(rival => rival.name || rival)),
            ...(country.politics?.relations?.currentRivals || [])
          ]))}
        </div>
      `,
      false,
      "country-section-relations"
    )}
    ${createSection(
      t("religion"),
      `${renderReligionMiniMetrics(country.religion)}${renderReligion(country.religion)}`,
      false,
      "country-section-religion"
    )}
    ${createSection(
      currentLanguage === "en" ? "Sources and quality" : "Fuentes y calidad",
      `${renderDataQualityHighlights(country)}${renderDataQuality(country)}`,
      false,
      "country-section-sources"
    )}
  `;

  renderNewsHub(countryCode);

  const compareButton = document.getElementById("add-to-compare-button");
  if (compareButton && countryCode) {
    compareButton.addEventListener("click", () => addCountryToCompare(countryCode));
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
  currentPanelState = { type: "continent", continent, countries, timelineFilter, timelineCentury, timelineIntensity, timelineRelevance };
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
    ${renderList(
      countries
        .map(country => country.name)
        .sort((a, b) => a.localeCompare(b, "es"))
    )}
    <p><b>${currentLanguage === "en" ? "Regional timeline" : "Timeline regional"}:</b></p>
    ${renderTimelineCollection(aggregateTimeline)}
  `;

  renderNewsHub();

  renderThemeSummary();
  openCountryModal();
}

function renderReligionSelection(religionName, countries, totalNominal) {
  currentPanelState = { type: "religion", religionName, countries, totalNominal };
  document.getElementById("country-panel").innerHTML = `
    <h2>${religionName}</h2>
    <div class="country-overview-grid relation-overview-grid">
      <div class="overview-card">
        <span class="overview-label">${currentLanguage === "en" ? "Majority countries" : "Paises con mayoria"}</span>
        <strong class="overview-value">${formatNumber(countries.length)}</strong>
      </div>
      <div class="overview-card">
        <span class="overview-label">${currentLanguage === "en" ? "Estimated population" : "Poblacion estimada"}</span>
        <strong class="overview-value">${formatNumber(Math.round(totalNominal || 0))}</strong>
      </div>
    </div>
    <p><b>${currentLanguage === "en" ? "Estimated population where it is the majority" : "Poblacion estimada en paises donde es mayoritaria"}:</b> ${formatNumber(Math.round(totalNominal || 0))}</p>
    <p><b>${currentLanguage === "en" ? "Share of world population" : "Porcentaje de la poblacion mundial"}:</b> ${formatPercentage(worldPopulationTotal ? (totalNominal / worldPopulationTotal) * 100 : 0)}</p>
    <p><b>${currentLanguage === "en" ? "Countries and territories where it is the majority religion" : "Paises y territorios donde es la religion mayoritaria"}:</b></p>
    ${renderList(
      countries.map(country => {
        const percentage = country.religion?.composition
          ? Math.round(getReligionNominalPopulation(country, religionName) / Math.max(country.general?.population || 1, 1) * 1000) / 10
          : 0;
        const suffix = percentage ? ` (${percentage}%)` : "";
        return `${country.name}${suffix}`;
      })
    )}
  `;

  renderNewsHub();

  renderThemeSummary();
  openCountryModal();
}

function renderEmpty(name) {
  currentPanelState = { type: "empty", name };
  document.getElementById("country-panel").innerHTML = `
    <h2>${name}</h2>
    <p>Sin datos</p>
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

function updateAppStatusPanel(extra = {}) {
  const renderChip = document.getElementById("render-profile-chip");
  const bootChip = document.getElementById("boot-profile-chip");
  const floatingBootChip = document.getElementById("boot-floating-chip");
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
    renderChip.innerHTML = `<strong>${currentLanguage === "en" ? "Render" : "Render"}:</strong> ${escapeHtml(getRenderProfileLabel())} · ${escapeHtml(modeLabel)}${fpsSuffix}`;
  }

  if (bootChip) {
    const summary = getBootProfileSummary();
    const hasBootData = summary.total > 0 || Object.keys(bootMetrics.steps).length > 0;
    let bootText = "";
    if (!hasBootData) {
      bootText = `${currentLanguage === "en" ? "Boot" : "Arranque"}: ${currentLanguage === "en" ? "pending" : "pendiente"}`;
      bootChip.innerHTML = `<strong>${currentLanguage === "en" ? "Boot" : "Arranque"}:</strong> ${currentLanguage === "en" ? "pending" : "pendiente"}`;
    } else {
      const totalLabel = `${Math.round(summary.total)} ms`;
      const detailParts = [];
      if (summary.imagery) detailParts.push(`${currentLanguage === "en" ? "first render" : "primer render"} ${Math.round(summary.imagery)} ms`);
      if (summary.data) detailParts.push(`${currentLanguage === "en" ? "data" : "datos"} ${Math.round(summary.data)} ms`);
      if (summary.overlay) detailParts.push(`${currentLanguage === "en" ? "overlay" : "overlay"} ${Math.round(summary.overlay)} ms`);
      if (summary.ui) detailParts.push(`${currentLanguage === "en" ? "ui" : "ui"} ${Math.round(summary.ui)} ms`);
      bootText = `${currentLanguage === "en" ? "Boot" : "Arranque"}: ${totalLabel}${detailParts.length ? ` · ${detailParts.join(" · ")}` : ""}`;
      bootChip.innerHTML = `<strong>${currentLanguage === "en" ? "Boot" : "Arranque"}:</strong> ${escapeHtml(totalLabel)}${detailParts.length ? ` · ${escapeHtml(detailParts.join(" · "))}` : ""}`;
    }
    if (floatingBootChip) {
      floatingBootChip.textContent = bootText;
      floatingBootChip.classList.toggle("is-complete", hasBootData && summary.total > 0);
    }
  }

  if (datasetChip) {
    const total = Object.keys(countriesData || {}).length;
    const avgQuality = total
      ? Math.round(Object.values(countriesData).reduce((sum, country) => sum + (country.metadata?.quality?.score || 0), 0) / total)
      : 0;
    const loadStateParts = [
      deferredDataStatus.countryIndex ? (currentLanguage === "en" ? "index" : "indice") : null,
      deferredDataStatus.runtimeCuration ? (currentLanguage === "en" ? "curation" : "curaduria") : null,
      deferredDataStatus.wikipediaConflicts ? (currentLanguage === "en" ? "conflicts" : "conflictos") : null,
      deferredDataStatus.fullCountries ? (currentLanguage === "en" ? "full" : "completo") : (currentLanguage === "en" ? "full deferred" : "completo diferido")
    ].filter(Boolean);
    datasetChip.innerHTML = `<strong>${currentLanguage === "en" ? "Dataset" : "Dataset"}:</strong> ${currentLanguage === "en" ? "validated" : "validado"} · ${avgQuality}/100 · ${total} ${currentLanguage === "en" ? "entries" : "entradas"} · ${escapeHtml(loadStateParts.join(" / "))}`;
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

function renderDataQuality(country) {
  const organizationCount = getCountryOrganizationCount(country);
  const conflictCount = getConflictsSinceFormation(country).length;
  const religionCount = Array.isArray(country.religion?.composition) ? country.religion.composition.length : 0;
  const cityCount = Array.isArray(country.general?.cities) ? country.general.cities.length : 0;
  const sources = country.metadata?.sources || {};
  const genericSources = DATA_SOURCE_SUMMARY[currentLanguage] || DATA_SOURCE_SUMMARY.es;
  const estimatedFields = Array.isArray(country.metadata?.quality?.estimatedFields)
    ? country.metadata.quality.estimatedFields
    : [];
  const curatedFields = Array.isArray(country.metadata?.quality?.curatedFields)
    ? country.metadata.quality.curatedFields
    : [];
  const confirmedFields = Array.isArray(country.metadata?.quality?.confirmedFields)
    ? country.metadata.quality.confirmedFields
    : [];
  const missingFields = Array.isArray(country.metadata?.quality?.missingFields)
    ? country.metadata.quality.missingFields
    : [];
  const sectionStatus = country.metadata?.quality?.sectionStatus || {};
  const provenance = country.metadata?.provenance || {};
  const qualityScore = Number.isFinite(country.metadata?.quality?.score)
    ? Math.max(0, Math.round(country.metadata.quality.score))
    : null;

  const sourceSections = [
    { key: "general", label: currentLanguage === "en" ? "General" : "General" },
    { key: "history", label: currentLanguage === "en" ? "History" : "Historia" },
    { key: "economy", label: currentLanguage === "en" ? "Economy" : "Economia" },
    { key: "military", label: currentLanguage === "en" ? "Military" : "Militar" },
    { key: "politics", label: currentLanguage === "en" ? "Politics" : "Politica" },
    { key: "religion", label: currentLanguage === "en" ? "Religion" : "Religion" },
    { key: "symbols", label: currentLanguage === "en" ? "Symbols" : "Simbolos" },
    { key: "relations", label: currentLanguage === "en" ? "Relations" : "Relaciones" }
  ];

  return `
    <div class="data-quality-grid">
      <div class="data-quality-card">
        <span class="data-quality-label">${currentLanguage === "en" ? "Organizations" : "Organizaciones"}</span>
        <strong class="data-quality-value">${formatNumber(organizationCount)}</strong>
      </div>
      <div class="data-quality-card">
        <span class="data-quality-label">${currentLanguage === "en" ? "Conflicts" : "Conflictos"}</span>
        <strong class="data-quality-value">${formatNumber(conflictCount)}</strong>
      </div>
      <div class="data-quality-card">
        <span class="data-quality-label">${currentLanguage === "en" ? "Religious branches" : "Ramas religiosas"}</span>
        <strong class="data-quality-value">${formatNumber(religionCount)}</strong>
      </div>
      <div class="data-quality-card">
        <span class="data-quality-label">${currentLanguage === "en" ? "Cities loaded" : "Ciudades cargadas"}</span>
        <strong class="data-quality-value">${formatNumber(cityCount)}</strong>
      </div>
      <div class="data-quality-card">
        <span class="data-quality-label">${currentLanguage === "en" ? "Estimated fields" : "Campos estimados"}</span>
        <strong class="data-quality-value">${formatNumber(estimatedFields.length)}</strong>
      </div>
      <div class="data-quality-card">
        <span class="data-quality-label">${currentLanguage === "en" ? "Curated fields" : "Campos curados"}</span>
        <strong class="data-quality-value">${formatNumber(curatedFields.length)}</strong>
      </div>
      <div class="data-quality-card">
        <span class="data-quality-label">${currentLanguage === "en" ? "Confirmed fields" : "Campos confirmados"}</span>
        <strong class="data-quality-value">${formatNumber(confirmedFields.length)}</strong>
      </div>
      <div class="data-quality-card">
        <span class="data-quality-label">${currentLanguage === "en" ? "Quality score" : "Puntaje de calidad"}</span>
        <strong class="data-quality-value">${qualityScore !== null ? `${qualityScore}/100` : t("noData")}</strong>
      </div>
    </div>
    <p class="data-source-note"><b>${currentLanguage === "en" ? "Validation" : "Validacion"}:</b> ${currentLanguage === "en" ? "local dataset checks currently pass without reported issues" : "los chequeos locales del dataset estan pasando sin incidencias reportadas"}</p>
    <p class="data-source-note"><b>${currentLanguage === "en" ? "Dataset updated" : "Dataset actualizado"}:</b> ${escapeHtml(country.metadata?.updatedAt || "2026-04-06")}</p>
    ${Object.keys(provenance).length ? `<p class="data-source-note"><b>${currentLanguage === "en" ? "Provenance" : "Procedencia"}:</b> ${escapeHtml(Object.entries(provenance).map(([key, value]) => `${key}: ${value?.status || value}`).join(" | "))}</p>` : ""}
    <p><b>${currentLanguage === "en" ? "Section sources" : "Fuentes por seccion"}:</b></p>
    <ul class="data-source-list">
      ${sourceSections.map(section => {
        const items = Array.isArray(sources[section.key]) && sources[section.key].length
          ? sources[section.key]
          : genericSources;
        const statusLabel = sectionStatus[section.key]
          ? ` · ${escapeHtml(sectionStatus[section.key])}`
          : "";
        return `<li><b>${escapeHtml(section.label)}</b>${statusLabel}: ${items.map(item => escapeHtml(item)).join(", ")}</li>`;
      }).join("")}
    </ul>
    <p><b>${currentLanguage === "en" ? "Missing fields" : "Campos faltantes"}:</b> ${missingFields.length ? escapeHtml(missingFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
    <p><b>${currentLanguage === "en" ? "Estimated fields" : "Campos estimados"}:</b> ${estimatedFields.length ? escapeHtml(estimatedFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
    <p><b>${currentLanguage === "en" ? "Confirmed fields" : "Campos confirmados"}:</b> ${confirmedFields.length ? escapeHtml(confirmedFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
    <p><b>${currentLanguage === "en" ? "Curated fields" : "Campos curados"}:</b> ${curatedFields.length ? escapeHtml(curatedFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
  `;
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
  ]);
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
  return Object.values(countriesData)
    .filter(country => getCountryLanguages(country).some(language => normalizeText(language) === normalizeText(languageLabel)))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByBloc(blocLabel) {
  return Object.values(countriesData)
    .filter(country => getCountryBlocs(country).some(bloc => normalizeText(bloc) === normalizeText(blocLabel)))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByMetropole(metropoleLabel) {
  return Object.values(countriesData)
    .filter(country => normalizeText(country?.politics?.relations?.exMetropole) === normalizeText(metropoleLabel))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByConflict(conflictLabel) {
  return Object.values(countriesData)
    .filter(country =>
      getCountryConflictsForSearch(country).some(conflict =>
        getConflictAliasList(conflict).some(alias => normalizeText(alias) === normalizeText(conflictLabel))
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByPeriod(periodLabel) {
  return Object.values(countriesData)
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

function renderSearchMemory() {
  const wrapper = document.getElementById("search-memory");
  const historyList = document.getElementById("search-history-list");
  const savedList = document.getElementById("saved-search-list");
  if (!wrapper || !historyList || !savedList) {
    return;
  }

  const historyItems = searchHistory.slice(0, 6);
  const savedItems = savedSearches.slice(0, 6);
  wrapper.hidden = !historyItems.length && !savedItems.length;

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

function getReligionThemeKey(country) {
  const [majority] = getMajorityReligionGroups(country);
  return majority?.key || "otras";
}

function getPoliticalThemeInfo(country) {
  const system = normalizeText(country.politics?.system);

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
  return Array.isArray(country?.conflicts) ? country.conflicts.length : 0;
}

function getCountryWarParticipationCount(country) {
  return buildConflictGroups(getConflictsSinceFormation(country)).length;
}

function getCountryOrganizationCount(country) {
  return Array.isArray(country?.politics?.organizations) ? country.politics.organizations.length : 0;
}

function getCountryRivalCount(country) {
  return Array.isArray(country?.politics?.rivals) ? country.politics.rivals.length : 0;
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
  const blocs = (relations.blocs || []).length + (relations.militaryBlocs || []).length + (relations.economicBlocs || []).length + (relations.diplomaticBlocs || []).length;
  const allies = (relations.militaryAllies || []).length + (relations.economicPartners || []).length + (relations.diplomaticPartners || []).length;
  const rivals = (relations.currentRivals || []).length + (relations.historicRivals || []).length;
  const disputes = (relations.territorialDisputes || []).length;
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
  const blocs = (country?.politics?.relations?.blocs || []).length
    + (country?.politics?.relations?.militaryBlocs || []).length
    + (country?.politics?.relations?.economicBlocs || []).length;

  const score = Math.min(30, Math.log10(gdp + 1) * 2.65)
    + Math.min(20, Math.log10(population + 1) * 2.05)
    + Math.min(16, Math.log10(active + 1) * 2.6)
    + Math.min(12, organizations * 0.35)
    + Math.min(8, conflicts * 0.65)
    + Math.min(6, rivals * 0.55)
    + Math.min(8, blocs * 1.25);

  return clampThemeValue(score, 0, 100);
}

function getCountryBlocLabel(country) {
  return (country?.politics?.relations?.blocs || []).slice(0, 2).join(", ") || t("noData");
}

function getCountryNewsTopics(country) {
  const base = country?.general?.officialName || country?.name || "";
  const encoded = value => encodeURIComponent(value);
  return {
    general: `https://news.google.com/search?q=${encoded(base)}&hl=es-419&gl=AR&ceid=AR:es-419`,
    politics: `https://news.google.com/search?q=${encoded(`${base} politica OR gobierno OR elecciones`)}&hl=es-419&gl=AR&ceid=AR:es-419`,
    economy: `https://news.google.com/search?q=${encoded(`${base} economia OR inflacion OR comercio`)}&hl=es-419&gl=AR&ceid=AR:es-419`,
    conflict: `https://news.google.com/search?q=${encoded(`${base} guerra OR seguridad OR conflicto`)}&hl=es-419&gl=AR&ceid=AR:es-419`
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

function getCountryThemeStyle(code) {
  const country = countriesData[code];
  const adapt = style => {
    if (currentMapMode !== "2d") {
      return style;
    }
    return {
      ...style,
      weight: Math.max(1.2, (style.weight || DEFAULT_STYLE.weight) - 0.25),
      fillOpacity: Math.max(0.06, (style.fillOpacity || DEFAULT_STYLE.fillOpacity) - 0.08)
    };
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

  const values = Object.entries(countriesData)
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
    { label: currentLanguage === "en" ? "Web search" : "Busqueda web", url: `https://www.google.com/search?tbm=nws&q=${baseQuery}` },
    { label: currentLanguage === "en" ? "Regional press" : "Prensa regional", url: `https://news.google.com/search?q=${encodeURIComponent(`${country.name} periodico OR diario OR news`)}&hl=es-419&gl=AR&ceid=AR:es-419` }
  ];
}

function buildNewsQueries(country) {
  const topicTerms = {
    general: "politica OR economia OR guerra",
    politics: "politica OR gobierno OR elecciones",
    economy: "economia OR inflacion OR comercio",
    conflict: "guerra OR seguridad OR conflicto"
  };
  const queries = uniqueNormalizedList([
    country.general?.officialName,
    country.name,
    `${country.name} ${topicTerms[activeNewsTopic] || topicTerms.general}`,
    `${country.name} government OR conflict OR economy`
  ]);

  return queries.filter(Boolean);
}

async function fetchCountryHeadlines(country) {
  if (!country?.code) {
    return [];
  }

  if (newsCache.has(country.code)) {
    return newsCache.get(country.code);
  }

  const fallback = {
    title: `Cobertura reciente sobre ${country.name}`,
    source: "Google News",
    date: "",
    summary: `Abrir cobertura en vivo sobre ${country.name}.`,
    url: getCountryNewsUrl(country)
  };
  const collected = [];
  const seenUrls = new Set();

  const queries = buildNewsQueries(country);
  for (const query of queries) {
    try {
      const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=ArtList&maxrecords=4&format=json&sort=HybridRel`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
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
          summary: article.socialimage
            ? `Cobertura destacada detectada sobre ${country.name}. Abrila para ver el desarrollo completo.`
            : `Noticia reciente vinculada a ${country.name}.`,
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
      console.error(`No se pudo cargar la noticia para ${country.name}:`, error);
    }
  }

  const finalItems = collected.length ? collected : [fallback];
  newsCache.set(country.code, finalItems);
  return finalItems;
}

async function fetchCountryHeadline(country) {
  const headlines = await fetchCountryHeadlines(country);
  return headlines[0] || null;
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

renderNewsArticle = function renderNewsArticle(article, country) {
  const articleContainer = document.getElementById("news-hub-article");
  if (!articleContainer) {
    return;
  }

  if (!article) {
    articleContainer.innerHTML = "";
    return;
  }

  articleContainer.innerHTML = `
    <div class="news-hub-article-card">
      <strong>${escapeHtml(article.title)}</strong>
      <p>${escapeHtml(article.summary)}</p>
      <div class="news-hub-meta">
        ${escapeHtml(article.source || "Fuente")} ${article.date ? `· ${escapeHtml(article.date)}` : ""}
      </div>
      <a class="news-link" href="${article.url || getCountryNewsUrl(country)}" target="_blank" rel="noreferrer">
        ${currentLanguage === "en" ? "Open full article" : "Abrir articulo completo"}
      </a>
    </div>
  `;
};

showNewsArticle = async function showNewsArticle(countryCode) {
  activeNewsCountryCode = countryCode;
  const articleContainer = document.getElementById("news-hub-article");
  const selectedContainer = document.getElementById("news-hub-selected");
  const panelContent = document.querySelector("#news-hub-panel .news-hub-content");
  const country = countriesData[countryCode];
  if (!articleContainer || !selectedContainer || !country) return;

  selectedContainer.innerHTML = `
    <div class="news-hub-selected-card">
      <strong>${escapeHtml(country.name)}</strong>
      <div class="news-hub-meta">${escapeHtml(country.general?.officialName || country.name)}</div>
      <div class="news-source-links">
        ${getCountryNewsPortalLinks(country).map(link => `<a class="news-link" href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}
      </div>
    </div>
  `;
  articleContainer.innerHTML = `
    <div class="news-hub-article-card">
      <strong>${currentLanguage === "en" ? "Loading headline..." : "Cargando noticia..."}</strong>
      <p>${currentLanguage === "en" ? "If live news is not available, direct coverage links will remain visible." : "Si la noticia en vivo no esta disponible, quedaran visibles los enlaces directos a cobertura."}</p>
      <div class="news-source-links">
        ${getCountryNewsPortalLinks(country).map(link => `<a class="news-link" href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}
      </div>
    </div>
  `;
  panelContent?.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelectorAll("#news-hub-list .news-hub-item").forEach(item => {
    item.classList.toggle("is-active", item.querySelector("[data-news-country]")?.dataset.newsCountry === countryCode);
  });
  const article = await fetchCountryHeadline(country);
  renderNewsArticle(article, country);
};

renderNewsHub = function renderNewsHub(selectedCode = "") {
  const panel = document.getElementById("news-hub-panel");
  const selectedContainer = document.getElementById("news-hub-selected");
  const listContainer = document.getElementById("news-hub-list");
  const articleContainer = document.getElementById("news-hub-article");
  if (!panel || !selectedContainer || !listContainer || !articleContainer) return;

  const countries = Object.entries(countriesData)
    .map(([code, country]) => ({ code, country }))
    .sort((a, b) => a.country.name.localeCompare(b.country.name, "es"));
  const selected = selectedCode && countriesData[selectedCode] ? countriesData[selectedCode] : null;

  selectedContainer.innerHTML = selected
    ? `<div class="news-hub-selected-card"><strong>${escapeHtml(selected.name)}</strong><div class="news-hub-meta">${escapeHtml(selected.general?.officialName || selected.name)}</div><div class="news-source-links">${getCountryNewsPortalLinks(selected).map(link => `<a class="news-link" href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}</div></div>`
    : "";

  if (!panel.open) {
    articleContainer.innerHTML = "";
    listContainer.innerHTML = "";
    return;
  }

  articleContainer.innerHTML = "";
  listContainer.innerHTML = countries.map(({ code, country }) => `
    <div class="news-hub-item${code === activeNewsCountryCode ? " is-active" : ""}">
      <button type="button" class="news-link-block" data-news-country="${escapeHtml(code)}">
        <strong>${escapeHtml(country.name)}</strong>
        <span class="news-hub-meta">${escapeHtml(country.general?.officialName || country.name)}</span>
      </button>
    </div>
  `).join("");
};

setupNewsHubPanel = function setupNewsHubPanel() {
  const panel = document.getElementById("news-hub-panel");
  const topicSelect = document.getElementById("news-topic-select");
  if (!panel) return;
  panel.open = false;
  if (topicSelect) {
    topicSelect.value = activeNewsTopic;
    topicSelect.addEventListener("change", () => {
      activeNewsTopic = topicSelect.value || "general";
      newsCache.clear();
      renderNewsHub(currentPanelState.code || "");
      if (activeNewsCountryCode) showNewsArticle(activeNewsCountryCode);
    });
  }
  panel.addEventListener("toggle", () => {
    if (panel.open) {
      const comparePanel = document.getElementById("compare-hub-panel");
      const quizPanel = document.getElementById("quiz-hub-panel");
      if (comparePanel) comparePanel.open = false;
      if (quizPanel) quizPanel.open = false;
    }
    renderNewsHub(currentPanelState.code || "");
  });
};

function updateExtendedStaticText() {
  const introCloseButton = document.getElementById("intro-modal-close");
  if (introCloseButton) {
    introCloseButton.innerHTML = "&times;";
  }
  const productCloseButton = document.getElementById("product-modal-close");
  if (productCloseButton) {
    productCloseButton.innerHTML = "&times;";
  }
  const introModalBody = document.getElementById("intro-modal-body");
  if (introModalBody) {
    introModalBody.innerHTML = introModalBody.innerHTML
          .replace(/campaÃ±as/g, "campañas")
      .replace(/Ãƒâ€”/g, "&times;");
  }
  const semanticHelper = document.getElementById("semantic-helper");
  if (semanticHelper) {
    semanticHelper.textContent = currentLanguage === "en"
      ? "Examples: constitutional monarchies in Asia with an Islamic majority; NATO countries rival to Russia; presidential republics in the Americas; Spanish-speaking countries in South America; Six-Day War; 20th century states."
      : "Ejemplos: monarquias constitucionales de Asia con islam mayoritario; paises de la OTAN rivales de Rusia; republicas presidenciales de America; paises hispanohablantes de America del Sur; Guerra de los Seis Dias; estados del siglo XX.";
  }
  const search = document.getElementById("compare-country-search");
  if (search) search.placeholder = currentLanguage === "en" ? "Filter countries to compare" : "Filtrar paises para comparar";
  const quizMode = document.getElementById("quiz-mode");
  if (quizMode) {
    quizMode.options[0].textContent = currentLanguage === "en" ? "Classic" : "Clasico";
    quizMode.options[1].textContent = currentLanguage === "en" ? "Timed" : "Contra reloj";
  }
  const topic = document.getElementById("news-topic-select");
  if (topic) {
    topic.options[0].textContent = currentLanguage === "en" ? "General overview" : "Panorama general";
    topic.options[1].textContent = currentLanguage === "en" ? "Politics" : "Politica";
    topic.options[2].textContent = currentLanguage === "en" ? "Economy" : "Economia";
    topic.options[3].textContent = currentLanguage === "en" ? "War and security" : "Guerra y seguridad";
  }
  updateIntroRuntimeStatus();
  updateAppStatusPanel();
}

function startPerformanceMonitor() {
  if (performanceMonitorId || !viewer || typeof requestAnimationFrame !== "function") return;
  let frameCount = 0;
  let lastCheck = performance.now();
  let rollingFps = getPerformancePreset().targetFrameRate;
  const tick = now => {
    frameCount += 1;
    if (now - lastCheck >= 2500) {
      const fps = (frameCount * 1000) / (now - lastCheck);
      rollingFps = rollingFps * 0.62 + fps * 0.38;
      const tier = getDeviceTier();
      const lowFpsThreshold = isMobileLayout() ? 18 : tier === "low" ? 15 : tier === "medium" ? 18 : 20;
      const highFpsThreshold = isMobileLayout() ? 28 : tier === "low" ? 24 : tier === "medium" ? 30 : 34;
      if (qualityPreset === "auto" && rollingFps < lowFpsThreshold) {
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
        if (labelEntities.length && currentMapMode === "3d" && rollingFps < lowFpsThreshold - 2) {
          clearMapLabels();
        }
      } else if (qualityPreset === "auto" && rollingFps > highFpsThreshold) {
        const preset = getPerformancePreset();
        viewer.resolutionScale = Math.min(preset.resolutionScale, viewer.resolutionScale + 0.03);
        viewer.scene.globe.maximumScreenSpaceError = Math.max(preset.maximumScreenSpaceError, viewer.scene.globe.maximumScreenSpaceError - 0.2);
        viewer.scene.globe.loadingDescendantLimit = Math.min(preset.loadingDescendantLimit, viewer.scene.globe.loadingDescendantLimit + 1);
        viewer.scene.globe.tileCacheSize = Math.min(preset.tileCacheSize, viewer.scene.globe.tileCacheSize + 12);
        viewer.scene.maximumRenderTimeChange = currentMapMode === "2d" ? 0.06 : 0.28;
      }
      updateAppStatusPanel({ fps: Math.round(rollingFps * 10) / 10 });
      frameCount = 0;
      lastCheck = now;
    }
    performanceMonitorId = requestAnimationFrame(tick);
  };
  performanceMonitorId = requestAnimationFrame(tick);
}

async function showNewsArticle(countryCode) {
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
  listContainer.innerHTML = countries
    .map(({ code, country }) => `
      <div class="news-hub-item${code === activeNewsCountryCode ? " is-active" : ""}">
        <a class="news-link-block" href="${getCountryNewsUrl(country)}" target="_blank" rel="noreferrer" title="${escapeHtml(country.name)}">
          <strong>${escapeHtml(country.name)}</strong>
          <span class="news-hub-meta">${escapeHtml(country.general?.officialName || country.name)}</span>
        </a>
      </div>
    `)
    .join("");
}

function setTheme(theme) {
  currentTheme = theme || "default";
  refreshCountryStyles();
  renderThemeLegend();
  renderThemeSummary();
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
  currentPanelState = { type: "group", title, descriptor, countries, timelineFilter, timelineCentury, timelineIntensity, timelineRelevance };
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
    ${renderList(
      countries
        .map(country => country.name)
        .sort((a, b) => a.localeCompare(b, "es"))
    )}
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
    .map(item => ({
      ...item,
      century: getTimelineCentury(item.year),
      intensity: item.intensity || getTimelineIntensity(item),
      relevance: item.relevance || getTimelineRelevance(item)
    }))
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

  const typeFilters = [
    { key: "all", label: currentLanguage === "en" ? "All" : "Todo" },
    { key: "formation", label: currentLanguage === "en" ? "Formation" : "Formacion" },
    { key: "organization", label: currentLanguage === "en" ? "Organizations" : "Organizaciones" },
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
  const filtered = filterTimelineItems(items);
  const aggregateSummary = !contextCountry && items.some(item => item.countryName) ? renderTimelineAggregateSummary(items) : "";

  if (!filtered.length) {
    return `${controls}${aggregateSummary}<p>${t("noData")}</p>`;
  }

  return `${controls}${aggregateSummary}<div class="timeline">${filtered
    .map(item => {
      const modalKey = registerTimelineModal(item, item.contextLabel || contextCountry?.name || "");
      const query = contextCountry ? getTimelineEventQuery(item, contextCountry) : (item.reference || item.text);
      return `
        <button class="timeline-item network-link" type="button" data-timeline-key="${modalKey}" data-timeline-query="${escapeHtml(query)}" style="--accent:${getTimelineCategoryAccent(item.categoryKey)};">
          <span class="timeline-year">${item.year}</span>
          <span class="timeline-copy">
            <span class="timeline-kicker">${escapeHtml(item.category || (currentLanguage === "en" ? "Event" : "Evento"))} · ${escapeHtml(item.century || "")} · ${escapeHtml(getTimelineIntensityLabel(item.intensity))} · ${escapeHtml(getTimelineRelevanceLabel(item.relevance || getTimelineRelevance(item)))}</span>
            <span>${escapeHtml(item.text)}</span>
          </span>
        </button>
      `;
    })
    .join("")}</div>`;
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
  return countryCodeLookup.get(country) || "";
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

function updateStaticText() {
  document.getElementById("compare-title").textContent = t("compareTitle");
  const quizTitle = document.getElementById("quiz-title");
  if (quizTitle) {
    quizTitle.textContent = currentLanguage === "en" ? "Learning mode" : "Modo educativo";
  }
  const quizStartButton = document.getElementById("quiz-start-button");
  if (quizStartButton) {
    quizStartButton.textContent = currentLanguage === "en" ? "Start quiz" : "Iniciar quiz";
  }
  const quizDifficulty = document.getElementById("quiz-difficulty");
  if (quizDifficulty) {
    quizDifficulty.options[0].textContent = currentLanguage === "en" ? "Easy" : "Facil";
    quizDifficulty.options[1].textContent = currentLanguage === "en" ? "Medium" : "Media";
    quizDifficulty.options[2].textContent = currentLanguage === "en" ? "Hard" : "Dificil";
  }
  const quizNextButton = document.getElementById("quiz-next-button");
  if (quizNextButton) {
    quizNextButton.textContent = currentLanguage === "en" ? "Next" : "Siguiente";
  }
  const quizResetButton = document.getElementById("quiz-reset-button");
  if (quizResetButton) {
    quizResetButton.textContent = currentLanguage === "en" ? "Reset" : "Reiniciar";
  }
  document.getElementById("compare-empty").textContent = t("compareHint");
  const compareAddButton = document.getElementById("compare-add-button");
  if (compareAddButton) {
    compareAddButton.textContent = currentLanguage === "en" ? "Add" : "Agregar";
  }
  const compareSelect = document.getElementById("compare-country-select");
  if (compareSelect?.options?.[0]) {
    compareSelect.options[0].textContent = currentLanguage === "en" ? "Select country" : "Seleccionar pais";
  }
  const openCompareButton = document.getElementById("open-compare-modal-button");
  if (openCompareButton) {
    openCompareButton.textContent = currentLanguage === "en" ? "Open comparison" : "Ver comparacion";
  }
  const clearCompareButton = document.getElementById("clear-compare-button");
  if (clearCompareButton) {
    clearCompareButton.textContent = currentLanguage === "en" ? "Clear" : "Limpiar";
  }
  document.getElementById("rankings-summary").textContent = currentLanguage === "en" ? "Global rankings" : "Rankings globales";
  document.getElementById("world-population-title").textContent = currentLanguage === "en" ? "World population" : "Poblacion mundial";
  document.getElementById("top-population-title").textContent = currentLanguage === "en" ? "Top population" : "Top poblacion";
  document.getElementById("continents-title").textContent = currentLanguage === "en" ? "Continents" : "Continentes";
  document.getElementById("religions-title").textContent = currentLanguage === "en" ? "Religions" : "Religiones";
  document.getElementById("gdp-title").textContent = t("topGdp");
  document.getElementById("inflation-title").textContent = t("topInflation");
  document.getElementById("systems-title").textContent = t("systems");
  document.getElementById("gdp-per-capita-title").textContent = currentLanguage === "en" ? "Top GDP per capita" : "Top PBI per capita";
  document.getElementById("organizations-top-title").textContent = currentLanguage === "en" ? "Top organizations" : "Top organizaciones";
  document.getElementById("conflicts-top-title").textContent = currentLanguage === "en" ? "Top conflicts" : "Top conflictos";
  document.getElementById("military-top-title").textContent = currentLanguage === "en" ? "Top active military" : "Top personal militar";
  document.getElementById("diversity-top-title").textContent = currentLanguage === "en" ? "Top religious diversity" : "Top diversidad religiosa";
  document.getElementById("organizations-reach-title").textContent = currentLanguage === "en" ? "Most widespread organizations" : "Organizaciones mas extendidas";
  document.getElementById("rivalries-top-title").textContent = currentLanguage === "en" ? "Most repeated rivalries" : "Rivalidades mas repetidas";
  document.getElementById("blocs-top-title").textContent = currentLanguage === "en" ? "Most widespread blocs" : "Bloques mas extendidos";
  document.getElementById("metropoles-top-title").textContent = currentLanguage === "en" ? "Former metropoles" : "Ex metropoles";
  document.getElementById("history-types-top-title").textContent = currentLanguage === "en" ? "Historical types" : "Tipos historicos";
  document.getElementById("map-search-input").placeholder =
    currentLanguage === "en"
      ? "Search country, continent, religion, political system or organization"
      : "Buscar pais, continente, religion, sistema politico u organizacion";
  document.getElementById("map-search-button").textContent = currentLanguage === "en" ? "Search" : "Buscar";
  const saveSearchButton = document.getElementById("save-search-button");
  if (saveSearchButton) {
    saveSearchButton.title = currentLanguage === "en" ? "Save search" : "Guardar busqueda";
    saveSearchButton.setAttribute("aria-label", saveSearchButton.title);
  }
  const appModeSelect = document.getElementById("app-mode-select");
  if (appModeSelect) {
    appModeSelect.options[0].textContent = currentLanguage === "en" ? "Explore" : "Exploracion";
    appModeSelect.options[1].textContent = currentLanguage === "en" ? "Geopolitical analysis" : "Analisis geopolitico";
    appModeSelect.options[2].textContent = currentLanguage === "en" ? "Encyclopedia" : "Enciclopedia";
    appModeSelect.options[3].textContent = currentLanguage === "en" ? "Presentation" : "Presentacion";
    appModeSelect.value = appMode;
  }
  const favoriteViewsSelect = document.getElementById("favorite-views-select");
  if (favoriteViewsSelect?.options?.[0]) {
    favoriteViewsSelect.options[0].textContent = currentLanguage === "en" ? "Favorites" : "Favoritos";
  }
  const saveFavoriteButton = document.getElementById("save-favorite-button");
  if (saveFavoriteButton) {
    saveFavoriteButton.textContent = currentLanguage === "en" ? "Save favorite" : "Guardar favorito";
  }
  const openIntroButton = document.getElementById("open-intro-button");
  if (openIntroButton) {
    openIntroButton.textContent = currentLanguage === "en" ? "Intro" : "Portada";
  }
  const openHealthButton = document.getElementById("open-health-button");
  if (openHealthButton) {
    openHealthButton.textContent = currentLanguage === "en" ? "Dataset health" : "Salud dataset";
  }
  const openChangelogButton = document.getElementById("open-changelog-button");
  if (openChangelogButton) {
    openChangelogButton.textContent = currentLanguage === "en" ? "Changelog" : "Changelog";
  }
  const openDocsButton = document.getElementById("open-docs-button");
  if (openDocsButton) {
    openDocsButton.textContent = currentLanguage === "en" ? "Docs" : "Documentacion";
  }
  const clearLocalCacheButton = document.getElementById("clear-local-cache-button");
  if (clearLocalCacheButton) {
    clearLocalCacheButton.textContent = currentLanguage === "en" ? "Clear local cache" : "Limpiar cache local";
  }
  const searchHistoryTitle = document.getElementById("search-history-title");
  if (searchHistoryTitle) {
    searchHistoryTitle.textContent = currentLanguage === "en" ? "Recent" : "Recientes";
  }
  const savedSearchTitle = document.getElementById("saved-search-title");
  if (savedSearchTitle) {
    savedSearchTitle.textContent = currentLanguage === "en" ? "Saved" : "Guardadas";
  }
  document.getElementById("toggle-left-panel").textContent = currentLanguage === "en" ? "Top lists" : "Top y continentes";
  document.getElementById("toggle-tools-panel").textContent = currentLanguage === "en" ? "Layers" : "Capas";
  document.getElementById("toggle-country-panel").textContent = currentLanguage === "en" ? "Country card" : "Ficha del pais";
  document.querySelector("#map-toolbar summary").textContent = currentLanguage === "en" ? "Thematic layers" : "Capas tematicas";
  updateMapModeToggle();
  const themeSelect = document.getElementById("theme-select");
  const themeOptionLabels = {
    default: currentLanguage === "en" ? "Political view" : "Vista politica",
    continent: currentLanguage === "en" ? "Continents" : "Continentes",
    religion: currentLanguage === "en" ? "Main religion" : "Religion mayoritaria",
    politics: currentLanguage === "en" ? "Political system" : "Sistema politico",
    population: currentLanguage === "en" ? "Population" : "Poblacion",
    density: currentLanguage === "en" ? "Population density" : "Densidad de poblacion",
    urbanization: currentLanguage === "en" ? "Urbanization (est.)" : "Urbanizacion (est.)",
    lifeExpectancy: currentLanguage === "en" ? "Life expectancy (est.)" : "Esperanza de vida (est.)",
    populationGrowth: currentLanguage === "en" ? "Demographic growth" : "Crecimiento demografico",
    gdp: "PBI",
    gdpPerCapita: currentLanguage === "en" ? "GDP per capita" : "PBI per capita",
    gdpPpp: currentLanguage === "en" ? "GDP PPP (est.)" : "PBI PPC (est.)",
    inflation: currentLanguage === "en" ? "Inflation" : "Inflacion",
    inflationHistory: currentLanguage === "en" ? "Inflation history (proxy)" : "Inflacion historica (proxy)",
    unemployment: currentLanguage === "en" ? "Unemployment (est.)" : "Desempleo (est.)",
    debt: currentLanguage === "en" ? "Debt (est.)" : "Deuda (est.)",
    militaryActive: currentLanguage === "en" ? "Active military" : "Personal militar activo",
    militarySpending: currentLanguage === "en" ? "Military spending (est.)" : "Gasto militar (est.)",
    formationYear: currentLanguage === "en" ? "Formation year" : "Año de formacion",
    religionBranch: currentLanguage === "en" ? "Religious branch" : "Rama religiosa dominante",
    exMetropole: currentLanguage === "en" ? "Former metropole" : "Ex metropoli",
    bloc: currentLanguage === "en" ? "Blocs and alliances" : "Bloques y alianzas",
    conflicts: currentLanguage === "en" ? "Conflicts" : "Conflictos",
    organizations: currentLanguage === "en" ? "Organizations" : "Organizaciones",
    rivals: currentLanguage === "en" ? "Rivals" : "Rivales",
    religionDiversity: currentLanguage === "en" ? "Religious diversity" : "Diversidad religiosa",
    historyType: currentLanguage === "en" ? "Historical type" : "Tipo historico",
    exportBreadth: currentLanguage === "en" ? "Export diversity" : "Diversidad exportadora",
    exportVolume: currentLanguage === "en" ? "Export volume (est.)" : "Volumen exportador (est.)",
    industryBreadth: currentLanguage === "en" ? "Industrial diversity" : "Diversidad industrial",
    capitalShare: currentLanguage === "en" ? "Capital population share" : "Peso demografico de la capital",
    naturalResources: currentLanguage === "en" ? "Natural resources" : "Recursos naturales",
    geopoliticalIndex: currentLanguage === "en" ? "Geopolitical index" : "Indice geopolitico"
  };
  themeSelect?.querySelectorAll("option").forEach(option => {
    option.textContent = themeOptionLabels[option.value] || option.textContent;
  });
  document.querySelector("label[for='theme-select']").textContent = currentLanguage === "en" ? "Layer" : "Capa";
  document.querySelector("label[for='language-select']").textContent = currentLanguage === "en" ? "Language" : "Idioma";
  document.querySelector("label[for='quality-preset-select']").textContent = currentLanguage === "en" ? "Render" : "Render";
  document.querySelector("label[for='label-mode-select']").textContent = currentLanguage === "en" ? "Labels" : "Etiquetas";
  document.querySelector("label[for='filter-continent-select']").textContent = currentLanguage === "en" ? "Filters" : "Filtros";
  const qualityPresetSelect = document.getElementById("quality-preset-select");
  if (qualityPresetSelect) {
    qualityPresetSelect.options[0].textContent = currentLanguage === "en" ? "Automatic" : "Automatico";
    qualityPresetSelect.options[1].textContent = currentLanguage === "en" ? "High quality" : "Alta calidad";
    qualityPresetSelect.options[2].textContent = currentLanguage === "en" ? "Balanced" : "Balanceado";
    qualityPresetSelect.options[3].textContent = currentLanguage === "en" ? "Performance" : "Rendimiento";
    qualityPresetSelect.value = qualityPreset;
  }
  const labelModeSelect = document.getElementById("label-mode-select");
  if (labelModeSelect) {
    labelModeSelect.options[0].textContent = currentLanguage === "en" ? "No labels" : "Sin etiquetas";
    labelModeSelect.options[1].textContent = currentLanguage === "en" ? "Countries" : "Paises";
    labelModeSelect.options[2].textContent = currentLanguage === "en" ? "Countries and world" : "Paises y mundo";
    labelModeSelect.value = labelMode;
  }
  document.getElementById("apply-filters-button").textContent = currentLanguage === "en" ? "Apply filters" : "Aplicar filtros";
  document.getElementById("save-filters-button").textContent = currentLanguage === "en" ? "Save filters" : "Guardar filtros";
  document.getElementById("reset-view-button").textContent = currentLanguage === "en" ? "Reset view" : "Resetear vista";
  document.getElementById("world-view-button").textContent = currentLanguage === "en" ? "Back to world" : "Volver al mundo";
  document.getElementById("auto-rotate-button").textContent = autoRotateEnabled
    ? (currentLanguage === "en" ? "Stop rotation" : "Detener rotacion")
    : (currentLanguage === "en" ? "Auto rotation" : "Rotacion automatica");
  document.querySelector("label[for='saved-views-select']").textContent = currentLanguage === "en" ? "Saved views" : "Vistas guardadas";
  document.getElementById("save-view-button").textContent = currentLanguage === "en" ? "Save view" : "Guardar vista";
  document.getElementById("open-help-button").textContent = currentLanguage === "en" ? "Guide" : "Guia";
  document.getElementById("presentation-mode-button").textContent =
    document.body.classList.contains("presentation-mode")
      ? (currentLanguage === "en" ? "Exit presentation" : "Salir de presentacion")
      : (currentLanguage === "en" ? "Presentation mode" : "Modo presentacion");
  document.querySelectorAll("[data-export-target][data-export-format='png']").forEach(button => {
    button.textContent = currentLanguage === "en" ? "Export image" : "Exportar imagen";
  });
  document.querySelectorAll("[data-export-target][data-export-format='pdf']").forEach(button => {
    button.textContent = currentLanguage === "en" ? "Export PDF" : "Exportar PDF";
  });
  document.querySelectorAll("[data-share-target], [data-share-country]").forEach(button => {
    button.textContent = currentLanguage === "en" ? "Share" : "Compartir";
  });
  const note = document.getElementById("news-hub-note");
  if (note) {
    note.textContent = currentLanguage === "en"
      ? "Daily country news hub. Tap a country to open its live news portal directly."
      : "Hub diario de noticias por pais. Toca un pais para abrir directamente su portal de noticias en vivo.";
  }
  const newsFilter = document.getElementById("news-country-filter");
  if (newsFilter) {
    newsFilter.placeholder = currentLanguage === "en" ? "Filter country in news" : "Filtrar pais en noticias";
  }
  updateAppStatusPanel();
  renderSavedFilters();
  renderSavedViews();
  renderSearchMemory();
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

  if (typeof requestAnimationFrame === "function") {
    rerenderCurrentPanelFrame = requestAnimationFrame(flush);
  } else {
    rerenderCurrentPanelFrame = setTimeout(flush, 16);
  }
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

function renderDatasetHealthPanel() {
  const countries = Object.values(countriesData || {});
  const total = countries.length || 0;
  const withTimeline = countries.filter(country => (country.history?.events || []).length > 0).length;
  const withConflicts = countries.filter(country => (country.military?.conflicts || []).length > 0).length;
  const withLocalFlag = countries.filter(country => country.general?.symbols?.assets?.flagPath).length;
  const withLocalCoat = countries.filter(country => country.general?.symbols?.assets?.coatPath).length;
  const withLanguages = countries.filter(country => Array.isArray(country.general?.languages) && country.general.languages.length > 0).length;
  const withCapitals = countries.filter(country => Array.isArray(country.general?.capitals) && country.general.capitals.length > 0).length;
  const withProvenance = countries.filter(country => Object.keys(country.metadata?.provenance || {}).length > 0).length;
  const withMissingFields = countries.filter(country => (country.metadata?.quality?.missingFields || []).length > 0).length;
  const averageQuality = total
    ? Math.round(countries.reduce((sum, country) => sum + (country.metadata?.quality?.score || 0), 0) / total)
    : 0;
  const estimatedAverage = total
    ? Math.round(countries.reduce((sum, country) => sum + ((country.metadata?.quality?.estimatedFields || []).length || 0), 0) / total)
    : 0;
  const statusRows = countries
    .slice()
    .sort((a, b) => (b.metadata?.quality?.score || 0) - (a.metadata?.quality?.score || 0))
    .slice(0, 12)
    .map(country => `<li><b>${escapeHtml(country.name)}</b>: ${country.metadata?.quality?.score || 0}/100</li>`)
    .join("");
  const sectionTotals = ["general", "history", "economy", "military", "politics", "religion", "symbols", "relations"]
    .map(section => {
      const curatedCount = countries.filter(country => country.metadata?.quality?.sectionStatus?.[section] === "curated" || country.metadata?.quality?.sectionStatus?.[section] === "confirmed").length;
      return `<li><b>${escapeHtml(section)}</b>: ${formatNumber(curatedCount)}/${formatNumber(total)}</li>`;
    })
    .join("");
  const weakestCountries = countries
    .slice()
    .sort((a, b) => (a.metadata?.quality?.score || 0) - (b.metadata?.quality?.score || 0))
    .slice(0, 10)
    .map(country => `<li><b>${escapeHtml(country.name)}</b>: ${country.metadata?.quality?.score || 0}/100</li>`)
    .join("");

  openProductModal(
    currentLanguage === "en" ? "Dataset health" : "Salud del dataset",
    `
      <div class="product-summary-grid">
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Countries" : "Paises"}</span><strong class="overview-value">${formatNumber(total)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Average quality" : "Calidad promedio"}</span><strong class="overview-value">${averageQuality}/100</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "With timeline" : "Con timeline"}</span><strong class="overview-value">${formatNumber(withTimeline)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "With conflicts" : "Con conflictos"}</span><strong class="overview-value">${formatNumber(withConflicts)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Local flags" : "Banderas locales"}</span><strong class="overview-value">${formatNumber(withLocalFlag)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Local coats" : "Escudos locales"}</span><strong class="overview-value">${formatNumber(withLocalCoat)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "With languages" : "Con idiomas"}</span><strong class="overview-value">${formatNumber(withLanguages)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "With capitals" : "Con capitales"}</span><strong class="overview-value">${formatNumber(withCapitals)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "With provenance" : "Con procedencia"}</span><strong class="overview-value">${formatNumber(withProvenance)}</strong></div>
        <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Avg. estimated fields" : "Prom. campos estimados"}</span><strong class="overview-value">${formatNumber(estimatedAverage)}</strong></div>
      </div>
      <div class="help-section">
        <h3>${currentLanguage === "en" ? "Quality leaders" : "Lideres de calidad"}</h3>
        <ul>${statusRows}</ul>
      </div>
      <div class="help-section">
        <h3>${currentLanguage === "en" ? "Quality watchlist" : "Watchlist de calidad"}</h3>
        <ul>${weakestCountries}</ul>
      </div>
      <div class="help-section">
        <h3>${currentLanguage === "en" ? "Section coverage" : "Cobertura por seccion"}</h3>
        <ul>${sectionTotals}</ul>
      </div>
      <div class="help-section">
        <h3>${currentLanguage === "en" ? "Current audit status" : "Estado actual de auditoria"}</h3>
        <ul>
          <li><b>${currentLanguage === "en" ? "Countries with missing fields" : "Paises con campos faltantes"}</b>: ${formatNumber(withMissingFields)}</li>
          <li><b>${currentLanguage === "en" ? "Offline shell" : "Shell offline"}</b>: ${currentLanguage === "en" ? "available via service worker cache" : "disponible via cache del service worker"}</li>
          <li><b>${currentLanguage === "en" ? "Local validation" : "Validacion local"}</b>: ${currentLanguage === "en" ? "latest checks passed without blocking issues" : "los ultimos chequeos pasaron sin incidencias bloqueantes"}</li>
        </ul>
      </div>
    `
  );
}

function openHelpModal() {
  const modal = document.getElementById("help-modal");
  if (!modal) {
    return;
  }

  modal.hidden = false;
  localStorage.setItem(STORAGE_KEYS.helpSeen, "true");
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
  const changelogButton = document.getElementById("open-changelog-button");
  const docsButton = document.getElementById("open-docs-button");
  const clearLocalCacheButton = document.getElementById("clear-local-cache-button");
  const helpButton = document.getElementById("open-help-button");
  const datasetChip = document.getElementById("dataset-health-chip");
  const renderChip = document.getElementById("render-profile-chip");
  const helpModal = document.getElementById("help-modal");
  const helpClose = document.getElementById("help-modal-close");
  const introModal = document.getElementById("intro-modal");
  const introClose = document.getElementById("intro-modal-close");
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
  renderChip?.addEventListener("click", () => openIntroModal());

  helpButton?.addEventListener("click", () => openHelpModal());
  helpClose?.addEventListener("click", () => closeHelpModal());
  helpModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-help-modal='true']")) {
      closeHelpModal();
    }
  });
  introClose?.addEventListener("click", () => closeIntroModal());
  introModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-intro-modal='true']")) {
      closeIntroModal();
    }
    const modeButton = event.target.closest("[data-app-mode-choice]");
    if (modeButton) {
      applyAppMode(modeButton.dataset.appModeChoice || "default");
      closeIntroModal();
    }
  });
  productClose?.addEventListener("click", () => closeProductModal());
  productModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-product-modal='true']")) {
      closeProductModal();
    }
  });
}

function setupGlobalKeyboardShortcuts() {
  document.addEventListener("keydown", event => {
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

    if (event.key === "Escape") {
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

exportNodeAsImage = async function exportNodeAsImage(node, filename) {
  if (!node || typeof html2canvas !== "function") {
    return;
  }

  const canvas = await html2canvas(node, {
    backgroundColor: "#071320",
    scale: window.devicePixelRatio > 1 ? 2 : 1.5,
    useCORS: true
  });

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = filename;
  link.click();
};

exportNodeAsPdf = async function exportNodeAsPdf(node, filename) {
  if (!node || typeof html2canvas !== "function" || !window.jspdf?.jsPDF) {
    return;
  }

  const canvas = await html2canvas(node, {
    backgroundColor: "#071320",
    scale: 2,
    useCORS: true
  });
  const image = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height]
  });
  pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
};

shareText = async function shareText(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch (error) {
      console.error("No se pudo compartir:", error);
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(`${title}\n\n${text}`);
  }
};

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

renderComparePanel = function renderComparePanel() {
  const empty = document.getElementById("compare-empty");
  const chips = document.getElementById("compare-chips");
  const results = document.getElementById("compare-results");
  const openButton = document.getElementById("open-compare-modal-button");
  empty.textContent = t("compareHint");

  if (!compareSelection.length) {
    empty.hidden = false;
    chips.innerHTML = "";
    results.innerHTML = "";
    if (openButton) {
      openButton.disabled = true;
    }
    return;
  }

  empty.hidden = true;
  chips.innerHTML = compareSelection
    .map(code => `<span class="compare-chip">${getFlagEmoji(code)} ${escapeHtml(countriesData[code]?.name || code)} <button type="button" data-remove-compare="${escapeHtml(code)}">x</button></span>`)
    .join("");

  const countryCards = `
    <div class="compare-country-cards">
      ${compareSelection.map(code => {
        const country = countriesData[code];
        return `
          <div class="compare-country-card">
            <div class="compare-country-flag">${renderFlagVisual(code, country.name, "compare-country-flag-badge")}</div>
            <div class="compare-country-name">${escapeHtml(country.name)}</div>
            <div class="compare-country-meta compare-country-official">${escapeHtml(country.general?.officialName || country.name)}</div>
            <div class="compare-country-meta">${escapeHtml(translateContinentName(country.continent))}</div>
            <div class="compare-country-meta">${escapeHtml(country.politics?.system || t("noData"))}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;

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

  const metricFields = [
    { label: t("comparePopulation"), getValue: country => country.general?.population || 0, format: value => formatNumber(value) },
    { label: t("compareGdp"), getValue: country => country.economy?.gdp || 0, format: value => `US$ ${compactNumber(value)}` },
    { label: t("compareGdpPerCapita"), getValue: country => country.economy?.gdpPerCapita || 0, format: value => `US$ ${formatNumber(Math.round(value))}` },
    { label: currentLanguage === "en" ? "Active military" : "Personal activo", getValue: country => getCountryMilitaryActive(country), format: value => formatNumber(value) },
    { label: currentLanguage === "en" ? "Reserve" : "Reserva", getValue: country => Number(country.military?.reserve) || 0, format: value => formatNumber(value) },
    { label: currentLanguage === "en" ? "Organizations" : "Organizaciones", getValue: country => getCountryOrganizationCount(country), format: value => formatNumber(value) },
    { label: currentLanguage === "en" ? "Conflicts" : "Conflictos", getValue: country => getCountryConflictCount(country), format: value => formatNumber(value) },
    { label: currentLanguage === "en" ? "Rivals" : "Rivales", getValue: country => getCountryRivalCount(country), format: value => formatNumber(value) },
    { label: currentLanguage === "en" ? "Religion groups" : "Grupos religiosos", getValue: country => getCountryReligionDiversity(country), format: value => formatNumber(value) }
  ];

  const infoFields = [
    { label: t("compareInflation"), getValue: country => formatInflation(country.economy?.inflation) },
    { label: t("compareSystem"), getValue: country => country.politics?.system || t("noData") },
    { label: t("compareReligion"), getValue: country => country.religion?.summary || t("noData") },
    { label: t("compareYear"), getValue: country => country.history?.year || t("noData") },
    { label: currentLanguage === "en" ? "Military blocs" : "Bloques militares", getValue: country => (country.politics?.relations?.militaryBlocs || []).join(", ") || t("noData") },
    { label: currentLanguage === "en" ? "Economic blocs" : "Bloques economicos", getValue: country => (country.politics?.relations?.economicBlocs || []).join(", ") || t("noData") },
    { label: currentLanguage === "en" ? "Military allies" : "Aliados militares", getValue: country => (country.politics?.relations?.militaryAllies || []).slice(0, 4).join(", ") || t("noData") },
    { label: currentLanguage === "en" ? "Current rivals" : "Rivales actuales", getValue: country => (country.politics?.relations?.currentRivals || []).slice(0, 4).join(", ") || t("noData") },
    { label: currentLanguage === "en" ? "Former metropole" : "Ex metropoli", getValue: country => country.politics?.relations?.exMetropole || t("noData") }
  ];

  const metricMarkup = metricFields
    .map(field => `
      <div class="compare-row">
        <strong>${field.label}</strong>
        <div class="compare-values compare-bars">
          ${compareSelection.map(code => {
            const country = countriesData[code];
            const value = field.getValue(country);
            const maxValue = Math.max(...compareSelection.map(compareCode => field.getValue(countriesData[compareCode])), 1);
            const width = maxValue ? (value / maxValue) * 100 : 0;
            return `
              <div class="compare-bar-item">
                <div class="compare-bar-label"><b>${getFlagEmoji(code)} ${escapeHtml(country.name)}:</b> ${escapeHtml(field.format(value))}</div>
                <div class="compare-bar-track"><div class="compare-bar-fill" style="width:${width}%"></div></div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `)
    .join("");

  const leaderMarkup = `
    <div class="compare-row compare-summary-row">
      <strong>${currentLanguage === "en" ? "Leaders" : "Lideres"}</strong>
      <div class="compare-values">
        ${metricFields.map(field => {
          const leaderCode = compareSelection
            .map(code => ({ code, value: field.getValue(countriesData[code]) }))
            .sort((a, b) => b.value - a.value)[0]?.code;
          const leader = leaderCode ? countriesData[leaderCode] : null;
          return `<div><b>${escapeHtml(field.label)}:</b> ${leader ? `${getFlagEmoji(leaderCode)} ${escapeHtml(leader.name)}` : t("noData")}</div>`;
        }).join("")}
      </div>
    </div>
  `;

  const deltaMarkup = compareSelection.length >= 2
    ? `
      <div class="compare-row compare-summary-row">
        <strong>${currentLanguage === "en" ? "Key gaps" : "Brechas clave"}</strong>
        <div class="compare-values">
          <div><b>${t("comparePopulation")}:</b> ${formatNumber(Math.abs((countriesData[compareSelection[0]]?.general?.population || 0) - (countriesData[compareSelection.at(-1)]?.general?.population || 0)))}</div>
          <div><b>${t("compareGdp")}:</b> US$ ${compactNumber(Math.abs((countriesData[compareSelection[0]]?.economy?.gdp || 0) - (countriesData[compareSelection.at(-1)]?.economy?.gdp || 0)))}</div>
          <div><b>${currentLanguage === "en" ? "Organizations" : "Organizaciones"}:</b> ${formatNumber(Math.abs(getCountryOrganizationCount(countriesData[compareSelection[0]]) - getCountryOrganizationCount(countriesData[compareSelection.at(-1)])))}</div>
          <div><b>${currentLanguage === "en" ? "Population gap" : "Brecha poblacional"}:</b> ${formatPercentage(Math.abs(((countriesData[compareSelection[0]]?.general?.population || 0) - (countriesData[compareSelection.at(-1)]?.general?.population || 0)) / Math.max(countriesData[compareSelection.at(-1)]?.general?.population || 1, 1) * 100))}</div>
        </div>
      </div>
    `
    : "";

  const infoMarkup = infoFields
    .map(field => `
      <div class="compare-row">
        <strong>${field.label}</strong>
        <div class="compare-values">
          ${compareSelection.map(code => {
            const country = countriesData[code];
            return `<div><b>${getFlagEmoji(code)} ${escapeHtml(country.name)}:</b> ${escapeHtml(field.getValue(country))}</div>`;
          }).join("")}
        </div>
      </div>
    `)
    .join("");

  const continentBenchmarkMarkup = compareSelection.map(code => {
    const country = countriesData[code];
    const peers = Object.values(countriesData).filter(item => item.continent === country.continent);
    const avgGdpPerCapita = peers.reduce((sum, item) => sum + (item.economy?.gdpPerCapita || 0), 0) / Math.max(peers.length, 1);
    const avgInflation = peers.reduce((sum, item) => sum + (item.economy?.inflation || 0), 0) / Math.max(peers.filter(item => typeof item.economy?.inflation === "number").length, 1);
    return `<div><b>${getFlagEmoji(code)} ${escapeHtml(country.name)}:</b> ${currentLanguage === "en" ? "continent avg GDP pc" : "promedio continental de PBI pc"} US$ ${formatNumber(Math.round(avgGdpPerCapita || 0))} · ${currentLanguage === "en" ? "avg inflation" : "inflacion promedio"} ${formatInflation(avgInflation)}</div>`;
  }).join("");

  const sharedTimelineSummary = (() => {
    const categories = ["constitution", "coup", "treaty", "annexation", "secession", "system", "formation", "conflict"]
      .filter(category => compareSelection.every(code => buildTimeline(countriesData[code]).some(item => item.categoryKey === category)));
    if (!categories.length) {
      return "";
    }
    return `
      <div class="compare-row compare-summary-row">
        <strong>${currentLanguage === "en" ? "Shared milestones" : "Hitos compartidos"}</strong>
        <div class="compare-values">
          ${categories.map(category => `<span class="country-meta-pill">${escapeHtml(getTimelineCategoryLabel(category))}</span>`).join("")}
        </div>
      </div>
    `;
  })();

  results.innerHTML = `
    <div class="compare-toolbar">
      <button type="button" class="panel-action-button" data-export-target="compare-results" data-export-format="png">${currentLanguage === "en" ? "Export image" : "Exportar imagen"}</button>
      <button type="button" class="panel-action-button" data-export-target="compare-results" data-export-format="pdf">${currentLanguage === "en" ? "Export PDF" : "Exportar PDF"}</button>
      <button type="button" class="panel-action-button" data-share-target="compare-results">${currentLanguage === "en" ? "Share" : "Compartir"}</button>
    </div>
    <div class="compare-radar-wrap">
      ${buildCompareRadarSVG(radarEntries)}
    </div>
    ${countryCards}
    ${leaderMarkup}
    ${deltaMarkup}
    <div class="compare-row compare-summary-row">
      <strong>${currentLanguage === "en" ? "Continental benchmarks" : "Referencias continentales"}</strong>
      <div class="compare-values">${continentBenchmarkMarkup}</div>
    </div>
    ${metricMarkup}
    ${infoMarkup}
  `;

  if (openButton) {
    openButton.disabled = compareSelection.length < 2;
  }
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
  const list = Object.values(countriesData)
    .filter(country => (country.economy?.gdpPerCapita || 0) > 0)
    .sort((a, b) => (b.economy?.gdpPerCapita || 0) - (a.economy?.gdpPerCapita || 0))
    .slice(0, 10);

  renderInteractiveList("top-gdp-per-capita", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (US$ ${formatNumber(Math.round(country.economy.gdpPerCapita))})`,
    country
  })), item => {
    const code = getCountryCodeByObject(item.country);
    if (code) {
      selectSearchResult({ label: item.country.name, type: "country", value: code });
    }
  });
}

function generateOrganizationCountRanking() {
  const list = Object.values(countriesData)
    .filter(country => getCountryOrganizationCount(country) > 0)
    .sort((a, b) => getCountryOrganizationCount(b) - getCountryOrganizationCount(a))
    .slice(0, 10);

  renderInteractiveList("top-organizations-count", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(getCountryOrganizationCount(country))})`,
    country
  })), item => {
    const code = getCountryCodeByObject(item.country);
    if (code) {
      selectSearchResult({ label: item.country.name, type: "country", value: code });
    }
  });
}

function generateConflictCountRanking() {
  const list = Object.values(countriesData)
    .filter(country => getCountryWarParticipationCount(country) > 0)
    .sort((a, b) => getCountryWarParticipationCount(b) - getCountryWarParticipationCount(a))
    .slice(0, 10);

  renderInteractiveList("top-conflicts-count", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(getCountryWarParticipationCount(country))} ${currentLanguage === "en" ? "wars" : "guerras"})`,
    country
  })), item => {
    const code = getCountryCodeByObject(item.country);
    if (code) {
      selectSearchResult({ label: item.country.name, type: "country", value: code });
    }
  });
}

function generateMilitaryRanking() {
  const list = Object.values(countriesData)
    .filter(country => getCountryMilitaryActive(country) > 0)
    .sort((a, b) => getCountryMilitaryActive(b) - getCountryMilitaryActive(a))
    .slice(0, 10);

  renderInteractiveList("top-military-active", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(getCountryMilitaryActive(country))})`,
    country
  })), item => {
    const code = getCountryCodeByObject(item.country);
    if (code) {
      selectSearchResult({ label: item.country.name, type: "country", value: code });
    }
  });
}

function generateReligionDiversityRanking() {
  const list = Object.values(countriesData)
    .filter(country => getCountryReligionDiversity(country) > 0)
    .sort((a, b) => getCountryReligionDiversity(b) - getCountryReligionDiversity(a))
    .slice(0, 10);

  renderInteractiveList("top-religion-diversity", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(getCountryReligionDiversity(country))})`,
    country
  })), item => {
    const code = getCountryCodeByObject(item.country);
    if (code) {
      selectSearchResult({ label: item.country.name, type: "country", value: code });
    }
  });
}

function generateOrganizationsReachRanking() {
  const totals = {};

  Object.values(countriesData).forEach(country => {
    (country.politics?.organizations || []).forEach(organization => {
      const label = normalizeCategoryLabel(getOrganizationDisplayName(organization));
      if (!label || label === "Sin datos") {
        return;
      }
      totals[label] = (totals[label] || 0) + 1;
    });
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
  const totals = {};

  Object.values(countriesData).forEach(country => {
    (country.politics?.rivals || []).forEach(rival => {
      const label = normalizeCategoryLabel(rival?.name || rival);
      if (!label || label === "Sin datos") {
        return;
      }
      totals[label] = (totals[label] || 0) + 1;
    });
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
  const totals = {};
  Object.values(countriesData).forEach(country => {
    (country.politics?.relations?.blocs || []).forEach(bloc => {
      const label = normalizeCategoryLabel(bloc);
      if (!label || label === "Sin datos") {
        return;
      }
      totals[label] = (totals[label] || 0) + 1;
    });
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
  const totals = {};
  Object.values(countriesData).forEach(country => {
    const metropole = country.politics?.relations?.exMetropole;
    if (!metropole) {
      return;
    }
    totals[metropole] = (totals[metropole] || 0) + 1;
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
  const totals = {};
  Object.values(countriesData).forEach(country => {
    const type = normalizeCategoryLabel(country.history?.type);
    if (!type || type === "Sin datos") {
      return;
    }
    totals[type] = (totals[type] || 0) + 1;
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

function addCountryToCompare(code) {
  if (!code || !countriesData[code]) {
    return;
  }

  compareSelection = compareSelection.filter(item => item !== code);
  compareSelection.unshift(code);
  compareSelection = compareSelection.slice(0, 3);
  renderComparePanel();
}

function removeCountryFromCompare(code) {
  compareSelection = compareSelection.filter(item => item !== code);
  renderComparePanel();
}

function renderInteractiveList(targetId, items, onClick) {
  const target = document.getElementById(targetId);
  target.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    li.className = "rank-link";
    li.textContent = item.label;
    li.addEventListener("click", () => onClick(item));
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
  return Object.values(countriesData).filter(country => {
    if (filters.continent && country.continent !== filters.continent) {
      return false;
    }

    if (filters.religion && !isReligionMajorityInCountry(country, filters.religion)) {
      return false;
    }

    if (filters.system) {
      const systemLabel = normalizeCategoryLabel(country.politics?.system);
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
      if (!filters.system.startsWith("__") && systemLabel !== filters.system) {
        return false;
      }
    }

    if (
      filters.organization &&
      !(country.politics?.organizations || []).some(
        organization => normalizeCategoryLabel(getOrganizationDisplayName(organization)) === filters.organization
      )
    ) {
      return false;
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
  const layers = getLayersForCountries(countries);

  if (!layers.length) {
    renderEmpty("Sin resultados para esos filtros");
    return;
  }

  setContinentSelection(layers);
  fitLayerBounds(createLayerGroup(layers));
  renderGroupSelection("Filtros globales", "Paises y territorios filtrados", countries);
}

function parseSemanticQuery(rawQuery) {
  const normalized = normalizeText(rawQuery);
  const filters = {
    continent: "",
    religion: "",
    system: "",
    organization: "",
    language: "",
    bloc: "",
    metropole: "",
    conflict: "",
    period: "",
    historyType: "",
    origin: "",
    rival: "",
    minPopulation: 0
  };

  const hasIslam = /\bislam|\bmusulman/.test(normalized);
  const hasChristian = /\bcristian/.test(normalized);
  const hasConstitutionalMonarchy = /monarquia constitucional|constitutional monarch/.test(normalized);
  const hasPresidentialRepublic = /republicas? presidenciales?|presidential republic/.test(normalized);

  for (const [alias, continent] of continentAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.continent = continent;
      break;
    }
  }

  if (!filters.religion) {
    if (hasIslam) {
      filters.religion = "Islamismo";
    } else if (hasChristian) {
      filters.religion = "Cristianismo";
    }
  }

  for (const [alias, religion] of religionAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.religion = religion;
      break;
    }
  }

  for (const [alias, system] of systemAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.system = system;
      break;
    }
  }

  if (!filters.system) {
    if (hasConstitutionalMonarchy) {
      filters.system = "Monarquia constitucional";
    } else if (hasPresidentialRepublic) {
      filters.system = "Presidencialismo";
    } else if (/\bmonarquia|\bmonarquias/.test(normalized)) {
      filters.system = "__monarquia__";
    } else if (/federal|federales/.test(normalized)) {
      filters.system = "__federal__";
    } else if (/semipresid/.test(normalized)) {
      filters.system = "__semipresidencial__";
    } else if (/presidencial/.test(normalized)) {
      filters.system = "__presidencial__";
    } else if (/parlament/.test(normalized)) {
      filters.system = "__parlamentario__";
    }
  }

  for (const [alias, organization] of organizationAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.organization = organization;
      break;
    }
  }

  for (const [alias, language] of languageAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.language = language;
      break;
    }
  }

  for (const [alias, bloc] of blocAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.bloc = bloc;
      break;
    }
  }

  for (const [alias, metropole] of metropoleAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.metropole = metropole;
      break;
    }
  }

  for (const [alias, conflict] of conflictAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.conflict = conflict;
      break;
    }
  }

  for (const [alias, period] of periodAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.period = period;
      break;
    }
  }

  for (const [alias, historyType] of historyTypeAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.historyType = historyType;
      break;
    }
  }

  for (const [alias, origin] of originAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.origin = origin;
      break;
    }
  }

  if (!filters.origin) {
    if (/ex colonias? britan|british colonies|imperio britan/.test(normalized)) {
      filters.origin = "__british__";
    } else if (/ex colonias? frances|french colonies/.test(normalized)) {
      filters.origin = "__french__";
    } else if (/ex colonias? espan|spanish colonies/.test(normalized)) {
      filters.origin = "__spanish__";
    } else if (/ex colonias? portugues|portuguese colonies/.test(normalized)) {
      filters.origin = "__portuguese__";
    }
  }

  for (const [alias, rival] of rivalAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.rival = rival;
      break;
    }
  }

  if (!filters.organization && /\botan\b|nato/.test(normalized)) {
    filters.organization = "OTAN";
    filters.bloc = "OTAN";
  }

  if (!filters.rival && /\brusia\b|russia/.test(normalized)) {
    filters.rival = "Rusia";
  }

  if (!filters.organization && /(union europea|ue\b|european union)/.test(normalized)) {
    filters.organization = "Union Europea";
    filters.bloc = "Union Europea";
  }

  if (!filters.organization && /(mercosur|mercosul)/.test(normalized)) {
    filters.organization = "Mercosur";
    filters.bloc = "Mercosur";
  }

  if (!filters.organization && /\bbrics\b/.test(normalized)) {
    filters.organization = "BRICS";
    filters.bloc = "BRICS";
  }

  if (!filters.period && /(siglo xxi|21st century|siglo 21)/.test(normalized)) {
    filters.period = "Siglo XXI";
  } else if (!filters.period && /(siglo xx|20th century|siglo 20)/.test(normalized)) {
    filters.period = "Siglo XX";
  } else if (!filters.period && /(siglo xix|19th century|siglo 19)/.test(normalized)) {
    filters.period = "Siglo XIX";
  } else if (!filters.period && /(edad moderna|early modern)/.test(normalized)) {
    filters.period = "Edad Moderna";
  } else if (!filters.period && /(edad media|middle ages|medieval)/.test(normalized)) {
    filters.period = "Edad Media";
  }

  if (!filters.religion && /(judai|jewish)/.test(normalized)) {
    filters.religion = "Judaismo";
  }

  if (!filters.religion && /(hindu|hinduism)/.test(normalized)) {
    filters.religion = "Hinduismo";
  }

  const populationMatchers = [
    { pattern: /mas de 100 millones|more than 100 million/, value: 100000000 },
    { pattern: /mas de 50 millones|more than 50 million/, value: 50000000 },
    { pattern: /mas de 20 millones|more than 20 million/, value: 20000000 },
    { pattern: /mas de 10 millones|more than 10 million/, value: 10000000 },
    { pattern: /mas de 1 millon|more than 1 million/, value: 1000000 }
  ];

  const populationMatch = populationMatchers.find(item => item.pattern.test(normalized));
  if (populationMatch) {
    filters.minPopulation = populationMatch.value;
  }

  const semanticPatterns = [
    /miembros? de /,
    /members? of /,
    /rivales? de /,
    /rivals? of /,
    /ex colonias? de /,
    /former colonies? of /,
    /paises? .*guerra civil/,
    /countries? .*civil war/,
    /con mas conflictos/,
    /with more conflicts/,
    /con mas organizaciones/,
    /with more organizations/,
    /idioma/,
    /language/,
    /guerra|batalla|war|battle/,
    /siglo|century/,
    /bloque|bloc|alliance|alianza/,
    /ex metropoli|former metropole/
  ];

  if (/con mas conflictos|with more conflicts/.test(normalized)) {
    filters.historyType = filters.historyType || "";
  }

  const score = Object.values(filters).filter(Boolean).length;
  return score >= 2 || (score >= 1 && semanticPatterns.some(pattern => pattern.test(normalized)))
    ? filters
    : null;
}

function getOrganizationDisplayName(organization) {
  if (!organization) {
    return "";
  }

  if (typeof organization === "string") {
    return organization;
  }

  return organization.abbreviation
    ? `${organization.name} (${organization.abbreviation})`
    : organization.name;
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

function setupSearchIndex(featureNameByCode) {
  let conflictSuggestionCount = 0;
  const seenConflictSuggestions = new Set();

  suggestionItems.length = 0;
  countryAliases.clear();
  continentAliases.clear();
  religionAliases.clear();
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

    getMajorityReligionGroups(country).forEach(entry => {
      registerReligionAlias(entry.label, entry.label);
      registerSuggestion(entry.label, "religion", entry.label, "Religion");
    });

    const systemLabel = normalizeCategoryLabel(country.politics?.system);
    if (systemLabel && systemLabel !== "Sin datos") {
      registerLookupAlias(systemAliases, systemLabel, systemLabel);
      registerSuggestion(systemLabel, "system", systemLabel, "Sistema politico");
    }

    (country.politics?.organizations || []).forEach(organization => {
      const label = getOrganizationDisplayName(organization);
      const aliases = getOrganizationAliases(organization);
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

function getReligionMatches(religionName) {
  return Object.values(countriesData)
    .filter(country => isReligionMajorityInCountry(country, religionName))
    .sort((a, b) => (b.general?.population || 0) - (a.general?.population || 0));
}

function getSuggestions(query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return [];
  }

  return suggestionItems
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
    .slice(0, 8);
}

function renderSuggestions(query, activeIndex = 0) {
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
      (item, index) => `
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
  return Object.values(countriesData)
    .filter(country => normalizeCategoryLabel(country.politics?.system) === systemLabel)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByOrganization(organizationLabel) {
  return Object.values(countriesData)
    .filter(country =>
      (country.politics?.organizations || []).some(
        organization =>
          normalizeCategoryLabel(getOrganizationDisplayName(organization)) === organizationLabel ||
          getOrganizationAliases(organization).some(alias => normalizeText(alias) === normalizeText(organizationLabel))
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByHistoryType(historyType) {
  return Object.values(countriesData)
    .filter(country => getHistoryTypeLabel(country) === historyType)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByOrigin(origin) {
  return Object.values(countriesData)
    .filter(country => getOriginLabel(country) === origin)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getCountriesByRival(rivalName) {
  return Object.values(countriesData)
    .filter(country =>
      (country.politics?.rivals || []).some(
        rival => normalizeCategoryLabel(rival?.name || rival) === rivalName
      )
    )
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

function getLayersForCountries(countries) {
  const matchingCodes = new Set(
    Object.entries(countriesData)
      .filter(([, country]) => countries.includes(country))
      .map(([code]) => code)
  );

  return [...matchingCodes]
    .map(code => countryLayers.get(code))
    .filter(Boolean);
}

function getGeoJsonPathForCurrentMode(bootPhase = false) {
  if (currentMapMode === "2d") {
    return "./data/world_countries_simplified.geo.json";
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
    if (countryCode && countryLayers.has(countryCode) && countriesData[countryCode]) {
      const linkedLayers = getLinkedCodes(countryCode)
        .map(code => countryLayers.get(code))
        .filter(Boolean);
      setCountrySelection(linkedLayers);
      fitLayerBounds(createLayerGroup(linkedLayers));
      await renderCountry(countriesData[countryCode], countriesData[countryCode].name);
      return;
    }
  }

  if (result.type === "continent") {
    const continentEntries = Object.entries(countriesData).filter(
      ([, country]) => country.continent === result.value
    );
    const layers = continentEntries
      .map(([code]) => countryLayers.get(code))
      .filter(Boolean);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(continentBoundsLayer);
      renderContinent(
        translateContinentName(result.value),
        continentEntries.map(([, country]) => country)
      );
      return;
    }
  }

  if (result.type === "religion") {
    const matches = getReligionMatches(result.value);
    const layers = Object.entries(countriesData)
      .filter(([, country]) => isReligionMajorityInCountry(country, result.value))
      .map(([code]) => countryLayers.get(code))
      .filter(Boolean);

    if (layers.length) {
      clearSelection();
      selectionMode = "religion";
      selectedLayers = layers;
      selectedLayers.forEach(layer => layer.setStyle(RELIGION_HIGHLIGHT_STYLE));
      continentBoundsLayer = createLayerGroup(layers);
      fitLayerBounds(continentBoundsLayer);

      const totalNominal = matches.reduce(
        (sum, country) => sum + getReligionNominalPopulation(country, result.value),
        0
      );

      renderReligionSelection(result.label, matches, totalNominal);
      return;
    }
  }

  if (result.type === "system") {
    const countries = getCountriesBySystem(result.value);
    const layers = getLayersForCountries(countries);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, "Paises con este sistema politico", countries);
      return;
    }
  }

  if (result.type === "organization") {
    const countries = getCountriesByOrganization(result.value);
    const layers = getLayersForCountries(countries);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, "Paises miembros encontrados", countries);
      return;
    }
  }

  if (result.type === "language") {
    const countries = getCountriesByLanguage(result.value);
    const layers = getLayersForCountries(countries);
    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, currentLanguage === "en" ? "Countries using this language" : "Paises que usan este idioma", countries);
      return;
    }
  }

  if (result.type === "bloc") {
    const countries = getCountriesByBloc(result.value);
    const layers = getLayersForCountries(countries);
    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, currentLanguage === "en" ? "Countries in this bloc or alliance" : "Paises en este bloque o alianza", countries);
      return;
    }
  }

  if (result.type === "metropole") {
    const countries = getCountriesByMetropole(result.value);
    const layers = getLayersForCountries(countries);
    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, currentLanguage === "en" ? "Countries linked to this former metropole" : "Paises ligados a esta ex metropoli", countries);
      return;
    }
  }

  if (result.type === "history_type") {
    const countries = getCountriesByHistoryType(result.value);
    const layers = getLayersForCountries(countries);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, "Paises con este tipo de formacion", countries);
      return;
    }
  }

  if (result.type === "period") {
    const countries = getCountriesByPeriod(result.value);
    const layers = getLayersForCountries(countries);
    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, currentLanguage === "en" ? "Countries linked to this period" : "Paises ligados a este periodo", countries);
      return;
    }
  }

  if (result.type === "conflict") {
    const countries = getCountriesByConflict(result.value);
    const layers = getLayersForCountries(countries);
    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, currentLanguage === "en" ? "Countries linked to this war or battle" : "Paises ligados a esta guerra o batalla", countries);
      return;
    }
  }

  if (result.type === "origin") {
    const countries = getCountriesByOrigin(result.value);
    const layers = getLayersForCountries(countries);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, "Paises con este origen historico", countries);
      return;
    }
  }

  if (result.type === "rival") {
    const countries = getCountriesByRival(result.value);
    const layers = getLayersForCountries(countries);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(result.label, "Paises que mencionan este rival", countries);
      return;
    }
  }

  renderEmpty(`No se encontro "${result.label}"`);
  dismissSearchInput();
}

async function searchMap() {
  const input = document.getElementById("map-search-input");
  const rawQuery = input.value;
  const query = normalizeText(rawQuery);

  if (!query) {
    return;
  }

  if (/con mas conflictos|with more conflicts/.test(query)) {
    const countries = Object.values(countriesData)
      .filter(country => getCountryConflictCount(country) > 0)
      .sort((a, b) => getCountryConflictCount(b) - getCountryConflictCount(a))
      .slice(0, 15);
    const layers = getLayersForCountries(countries);
    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(
        currentLanguage === "en" ? "Countries with more conflicts" : "Paises con mas conflictos",
        currentLanguage === "en" ? "Conflict count ranking" : "Ranking por cantidad de conflictos",
        countries
      );
      pushSearchHistory(rawQuery);
      renderSearchQueryChips({ conflict: currentLanguage === "en" ? "Most conflicts" : "Mas conflictos" });
      dismissSearchInput();
      return;
    }
  }

  if (/con mas organizaciones|with more organizations/.test(query)) {
    const countries = Object.values(countriesData)
      .filter(country => getCountryOrganizationCount(country) > 0)
      .sort((a, b) => getCountryOrganizationCount(b) - getCountryOrganizationCount(a))
      .slice(0, 15);
    const layers = getLayersForCountries(countries);
    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(
        currentLanguage === "en" ? "Countries with more organizations" : "Paises con mas organizaciones",
        currentLanguage === "en" ? "Organization count ranking" : "Ranking por cantidad de organizaciones",
        countries
      );
      pushSearchHistory(rawQuery);
      renderSearchQueryChips({ organization: currentLanguage === "en" ? "Most organizations" : "Mas organizaciones" });
      dismissSearchInput();
      return;
    }
  }

  const semanticFilters = parseSemanticQuery(rawQuery);
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
    const layers = getLayersForCountries(semanticCountries);
    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(createLayerGroup(layers));
      renderGroupSelection(rawQuery, currentLanguage === "en" ? "Semantic search result" : "Resultado semantico", semanticCountries);
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

  const countryCode = countryAliases.get(query);

  if (countryCode && countryLayers.has(countryCode) && countriesData[countryCode]) {
    await selectSearchResult({
      label: countriesData[countryCode].name,
      type: "country",
      value: countryCode
    });
    return;
  }

  const continent = continentAliases.get(query);

  if (continent) {
    await selectSearchResult({
      label: translateContinentName(continent),
      type: "continent",
      value: continent
    });
    return;
  }

  const religion = religionAliases.get(query);
  if (religion) {
    await selectSearchResult({
      label: religion,
      type: "religion",
      value: religion
    });
    return;
  }

  const system = systemAliases.get(query);
  if (system) {
    await selectSearchResult({
      label: system,
      type: "system",
      value: system
    });
    return;
  }

  const organization = organizationAliases.get(query);
  if (organization) {
    await selectSearchResult({
      label: organization,
      type: "organization",
      value: organization
    });
    return;
  }

  const language = languageAliases.get(query);
  if (language) {
    await selectSearchResult({
      label: language,
      type: "language",
      value: language
    });
    return;
  }

  const bloc = blocAliases.get(query);
  if (bloc) {
    await selectSearchResult({
      label: bloc,
      type: "bloc",
      value: bloc
    });
    return;
  }

  const metropole = metropoleAliases.get(query);
  if (metropole) {
    await selectSearchResult({
      label: metropole,
      type: "metropole",
      value: metropole
    });
    return;
  }

  const conflict = conflictAliases.get(query);
  if (conflict) {
    await selectSearchResult({
      label: conflict,
      type: "conflict",
      value: conflict
    });
    return;
  }

  const period = periodAliases.get(query);
  if (period) {
    await selectSearchResult({
      label: period,
      type: "period",
      value: period
    });
    return;
  }

  const historyType = historyTypeAliases.get(query);
  if (historyType) {
    await selectSearchResult({
      label: historyType,
      type: "history_type",
      value: historyType
    });
    return;
  }

  const origin = originAliases.get(query);
  if (origin) {
    await selectSearchResult({
      label: origin,
      type: "origin",
      value: origin
    });
    return;
  }

  const rival = rivalAliases.get(query);
  if (rival) {
    await selectSearchResult({
      label: rival,
      type: "rival",
      value: rival
    });
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

function runDeferredGlobalStatsBatch(step = 0) {
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

  task();
  const schedule = window.requestIdleCallback
    ? callback => window.requestIdleCallback(callback, { timeout: 600 })
    : callback => setTimeout(callback, step === 0 ? 80 : 40);

  deferredGlobalStatsTimer = schedule(() => runDeferredGlobalStatsBatch(step + 1));
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
  runDeferredGlobalStatsBatch(0);
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
    setupSearchIndex(
      Object.fromEntries(
        Object.entries(countriesData).map(([code, country]) => [code, country.name])
      )
    );
    mapSearchAliasesRegistered = true;
    runCriticalGlobalStats();
    scheduleDeferredGlobalStats(true);
    await loadSupplementalData();
  })().catch(error => {
    console.warn("No se pudieron completar las mejoras diferidas del arranque:", error);
  });

  return loadDeferredDataEnhancementsPromise;
}

async function loadWikipediaConflictDetails() {
  if (loadWikipediaConflictDetailsPromise) {
    return loadWikipediaConflictDetailsPromise;
  }

  loadWikipediaConflictDetailsPromise = (async () => {
    markBootStepStart("fetchWikipediaConflicts");
    try {
      const wikipediaConflictJson = await fetchResourceCached(`./data/conflict_details.generated.json?v=${APP_VERSION}`, "json");
      wikipediaConflictDetailOverrides = wikipediaConflictJson?.conflicts || wikipediaConflictJson || {};
      mergeImportedConflictDetails(wikipediaConflictDetailOverrides);
      deferredDataStatus.wikipediaConflicts = true;
      markBootStepEnd("fetchWikipediaConflicts");
      refreshGlobalStats();
      updateAppStatusPanel();
      rerenderCurrentPanel?.();
      return wikipediaConflictDetailOverrides;
    } catch (error) {
      markBootStepEnd("fetchWikipediaConflicts", { skipped: true });
      console.warn("No se pudieron cargar los conflictos enriquecidos de Wikipedia:", error);
      wikipediaConflictDetailOverrides = {};
      return wikipediaConflictDetailOverrides;
    }
  })();

  return loadWikipediaConflictDetailsPromise;
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
    deferredDataStatus.countryIndex = true;
    refreshLoadedCountryLayers();
    updateAppStatusPanel();
    scheduleFullCountryDataLoad();
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
    await loadScriptOnce(`./app-curation.js?v=${APP_VERSION}`, "GeoRiskCuration");
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

function scheduleFullCountryDataLoad() {
  const delayMs = isMobileLayout() ? 90000 : 45000;
  const startFullLoad = () => {
    if (document.visibilityState === "hidden") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          loadFullCountryData();
        }
      }, { once: true });
      return;
    }
    loadFullCountryData();
  };

  setTimeout(() => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(startFullLoad, { timeout: 30000 });
      return;
    }
    setTimeout(startFullLoad, 1500);
  }, delayMs);
}

async function hydrateCountriesData(countriesJson, { refresh = false } = {}) {
  countriesData = countriesJson || {};
  const countryEntries = Object.entries(countriesData);
  for (let index = 0; index < countryEntries.length; index += 1) {
    const [code, country] = countryEntries[index];
    country.code = code;
    countryCodeLookup.set(country, code);
    sanitizeCountryData(country);
    if (index > 0 && index % 12 === 0) {
      await yieldToMainThread();
    }
  }
  worldPopulationTotal = Object.values(countriesData).reduce(
    (sum, country) => sum + (country.general?.population || 0),
    0
  );
  if (refresh) {
    refreshLoadedCountryLayers();
    refreshGlobalStats();
    rerenderCurrentPanel?.();
  }
}

async function loadFullCountryData() {
  if (loadFullCountryDataPromise) {
    return loadFullCountryDataPromise;
  }

  loadFullCountryDataPromise = measureBootStep("loadFullCountries", async () => {
    markBootStepStart("fetchCountriesFull");
    const countriesJson = await fetchResourceCached(`./data/countries_full.json?v=${APP_VERSION}`, "json")
      .then(result => {
        markBootStepEnd("fetchCountriesFull");
        return result;
      });
    await hydrateCountriesData(countriesJson, { refresh: true });
    deferredDataStatus.fullCountries = true;
    updateAppStatusPanel();
    return countriesData;
  }).catch(error => {
    console.warn("No se pudo hidratar el dataset completo:", error);
    return countriesData;
  });

  return loadFullCountryDataPromise;
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
      countryCodeLookup.set(country, normalizedCode);
      sanitizeCountryData(country);
      refreshLoadedCountryLayers();
      if (currentPanelState.type === "country" && currentPanelState.code === normalizedCode) {
        rerenderCurrentPanel?.();
      }
      return country;
    })
    .catch(error => {
      console.warn(`No se pudo cargar detalle de ${normalizedCode}:`, error);
      return countriesData[normalizedCode] || null;
    });

  countryDetailPromises.set(normalizedCode, promise);
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

function getQuizPool(category) {
  return Object.values(countriesData).filter(country => {
    if (category === "capital") {
      return Boolean(country.general?.capital?.name);
    }
    if (category === "religion") {
      return Boolean(getReligionSummaryLabel(country.religion));
    }
    if (category === "continent") {
      return Boolean(country.continent);
    }
    if (category === "system") {
      return Boolean(country.politics?.system && country.politics.system !== "Sin datos");
    }
    if (category === "flag") {
      return Boolean(country.name);
    }
    if (category === "history") {
      return Boolean(country.history?.year);
    }
    if (category === "organization") {
      return Boolean((country.politics?.organizations || []).length);
    }
    if (category === "rival") {
      return Boolean((country.politics?.rivals || []).length);
    }
    return false;
  });
}

buildQuizQuestion = function buildQuizQuestion(category) {
  const difficultyPool = getQuizPool(category).filter(country => {
    const code = getCountryCodeByObject(country);
    if (quizState.asked.includes(code)) {
      return false;
    }
    if (quizState.difficulty === "easy") {
      return (country.general?.population || 0) > 15000000;
    }
    if (quizState.difficulty === "hard") {
      return (country.general?.population || 0) < 30000000;
    }
    return true;
  });
  const pool = difficultyPool.length ? difficultyPool : getQuizPool(category).filter(country => !quizState.asked.includes(getCountryCodeByObject(country)));
  if (!pool.length) {
    return null;
  }

  const country = pool[Math.floor(Math.random() * pool.length)];
  const code = getCountryCodeByObject(country);
  let prompt = "";
  let correct = "";
  let distractors = [];

  if (category === "capital") {
    prompt = `¿Cual es la capital de ${country.name}?`;
    correct = country.general.capital.name;
    distractors = shuffleArray(
      Object.values(countriesData)
        .map(item => item.general?.capital?.name)
        .filter(Boolean)
        .filter(name => normalizeText(name) !== normalizeText(correct))
    ).slice(0, 3);
  } else if (category === "religion") {
    prompt = `¿Cual es la religion mayoritaria de ${country.name}?`;
    correct = getReligionSummaryLabel(country.religion) || "Sin datos";
    distractors = shuffleArray(
      Object.values(countriesData)
        .map(item => getReligionSummaryLabel(item.religion))
        .filter(Boolean)
        .filter(name => normalizeText(name) !== normalizeText(correct))
    ).slice(0, 3);
  } else if (category === "continent") {
    prompt = `¿En que continente se ubica ${country.name}?`;
    correct = translateContinentName(country.continent);
    distractors = shuffleArray(["America", "Europa", "Asia", "Africa", "Oceania", "Antartida"]
      .filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "flag") {
    prompt = `¿A que pais corresponde esta bandera? ${getFlagEmoji(code)}`;
    correct = country.name;
    distractors = shuffleArray(
      Object.values(countriesData).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))
    ).slice(0, 3);
  } else if (category === "history") {
    prompt = `¿En que año se formo ${country.name}?`;
    correct = String(country.history.year);
    distractors = shuffleArray(
      Object.values(countriesData)
        .map(item => item.history?.year)
        .filter(Boolean)
        .map(String)
        .filter(value => value !== correct)
    ).slice(0, 3);
  } else if (category === "organization") {
    const org = getOrganizationDisplayName(country.politics.organizations[0]);
    prompt = `¿Que pais pertenece a esta organizacion? ${org}`;
    correct = country.name;
    distractors = shuffleArray(
      Object.values(countriesData).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))
    ).slice(0, 3);
  } else if (category === "rival") {
    const rival = country.politics.rivals[0]?.name || country.politics.rivals[0];
    prompt = `¿Que pais tiene como rival a ${rival}?`;
    correct = country.name;
    distractors = shuffleArray(
      Object.values(countriesData).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))
    ).slice(0, 3);
  } else {
    prompt = `¿Cual es el sistema politico principal de ${country.name}?`;
    correct = country.politics.system;
    distractors = shuffleArray([...new Set(
      Object.values(countriesData)
        .map(item => item.politics?.system)
        .filter(Boolean)
        .filter(name => normalizeText(name) !== normalizeText(correct))
    )]).slice(0, 3);
  }

  if (distractors.length < 3) {
    return null;
  }

  return {
    code,
    prompt,
    correct,
    options: shuffleArray([correct, ...distractors]),
    answered: false
  };
};

renderQuizPanel = function renderQuizPanel() {
  const status = document.getElementById("quiz-status");
  const question = document.getElementById("quiz-question");
  const options = document.getElementById("quiz-options");
  const nextButton = document.getElementById("quiz-next-button");
  const resetButton = document.getElementById("quiz-reset-button");
  const categorySelect = document.getElementById("quiz-category");
  const difficultySelect = document.getElementById("quiz-difficulty");
  if (!status || !question || !options || !nextButton || !resetButton || !categorySelect || !difficultySelect) {
    return;
  }

  categorySelect.value = quizState.category;
  difficultySelect.value = quizState.difficulty;
  status.textContent = quizState.total
    ? `Puntaje: ${quizState.score}/${quizState.total}`
    : "Elegí una categoría y empezá el quiz.";

  if (!quizState.current) {
    question.textContent = "";
    options.innerHTML = "";
    nextButton.hidden = true;
    resetButton.hidden = quizState.total === 0 && !quizState.asked.length;
    return;
  }

  question.textContent = quizState.current.prompt;
  options.innerHTML = quizState.current.options.map(option => `
    <button type="button" class="quiz-option" data-quiz-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>
  `).join("");
  nextButton.hidden = !quizState.current.answered;
  resetButton.hidden = false;
};

startQuiz = function startQuiz() {
  const categorySelect = document.getElementById("quiz-category");
  const difficultySelect = document.getElementById("quiz-difficulty");
  quizState = {
    category: categorySelect?.value || "capital",
    difficulty: difficultySelect?.value || "easy",
    asked: [],
    score: 0,
    total: 0,
    current: null
  };
  nextQuizQuestion();
};

nextQuizQuestion = function nextQuizQuestion() {
  const question = buildQuizQuestion(quizState.category);
  quizState.current = question;
  renderQuizPanel();
};

answerQuiz = function answerQuiz(answer) {
  if (!quizState.current || quizState.current.answered) {
    return;
  }

  quizState.total += 1;
  const isCorrect = normalizeText(answer) === normalizeText(quizState.current.correct);
  if (isCorrect) {
    quizState.score += 1;
  }
  quizState.asked.push(quizState.current.code);
  quizState.current.answered = true;

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
    : `Incorrecto. Respuesta correcta: ${quizState.current.correct}. Puntaje: ${quizState.score}/${quizState.total}`;
  document.getElementById("quiz-next-button").hidden = false;
}

function generateWorldPopulation() {
  const target = document.getElementById("world-population-total");
  target.textContent = formatNumber(worldPopulationTotal);
}

function generateTopPopulation() {
  const list = Object.values(countriesData)
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
  }), item => {
    const code = Object.entries(countriesData).find(([, country]) => country === item.country)?.[0];
    if (code) {
      selectSearchResult({ label: item.country.name, type: "country", value: code });
    }
  });
}

function generateContinents() {
  const totals = {};

  Object.values(countriesData).forEach(country => {
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

  Object.values(countriesData).forEach(country => {
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
      const familyEntry = familyTotals.get(family.key) || {
        key: family.key,
        label: family.label,
        total: 0,
        denominations: new Map()
      };

      familyEntry.total += nominal;
      familyEntry.denominations.set(
        entry.name,
        (familyEntry.denominations.get(entry.name) || 0) + nominal
      );
      familyTotals.set(family.key, familyEntry);
    });
  });

  const families = [...familyTotals.values()].sort((a, b) => b.total - a.total);

  target.innerHTML = families.map(family => {
    const share = worldPopulationTotal ? (family.total / worldPopulationTotal) * 100 : 0;
    const denominations = [...family.denominations.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, total]) => {
        const formattedName = formatReligionDenominationLabel(name, family.label);
        if (normalizeText(formattedName) === normalizeText(family.label)) {
          return "";
        }
        const branchShare = worldPopulationTotal ? (total / worldPopulationTotal) * 100 : 0;
        return `<li>${escapeHtml(formattedName)} (${formatNumber(Math.round(total))} - ${formatPercentage(branchShare)})</li>`;
      })
      .filter(Boolean)
      .join("");

    return `
      <li class="rank-link religion-group">
        <button type="button" data-religion-family="${escapeHtml(family.label)}">
          ${escapeHtml(family.label)} (${formatNumber(Math.round(family.total))} - ${formatPercentage(share)})
        </button>
        ${denominations ? `<ul class="religion-subranking">${denominations}</ul>` : ""}
      </li>
    `;
  }).join("");

  target.querySelectorAll("[data-religion-family]").forEach(button => {
    button.addEventListener("click", () => {
      selectSearchResult({
        label: button.dataset.religionFamily,
        type: "religion",
        value: button.dataset.religionFamily
      });
    });
  });
}

function generateGdpRanking() {
  const list = Object.values(countriesData)
    .filter(country => (country.economy?.gdp || 0) > 0)
    .sort((a, b) => (b.economy?.gdp || 0) - (a.economy?.gdp || 0))
    .slice(0, 10);

  renderInteractiveList("top-gdp", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (US$ ${compactNumber(country.economy.gdp)})`,
    country
  })), item => {
    const code = getCountryCodeByObject(item.country);
    if (code) {
      selectSearchResult({ label: item.country.name, type: "country", value: code });
    }
  });
}

function generateInflationRanking() {
  const list = Object.values(countriesData)
    .filter(country => country.economy?.inflation || country.economy?.inflation === 0)
    .sort((a, b) => (b.economy?.inflation || 0) - (a.economy?.inflation || 0))
    .slice(0, 10);

  renderInteractiveList("top-inflation", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatInflation(country.economy.inflation)})`,
    country
  })), item => {
    const code = getCountryCodeByObject(item.country);
    if (code) {
      selectSearchResult({ label: item.country.name, type: "country", value: code });
    }
  });
}

function generateSystemRanking() {
  const totals = {};
  Object.values(countriesData).forEach(country => {
    const key = normalizeCategoryLabel(country.politics?.system);
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

    clickHandler.setInputAction(movement => {
    emitMapEvent("click");
    const picked = viewer.scene.pick(movement.position);
    const rawCode = picked?.id?.countryCode;
    const featureName = picked?.id?.countryName;
    const code = resolveCountryCode(rawCode, featureName) || rawCode;

    if (!code) {
      clearSelection();
      if (featureName) {
        const aliasCode = resolveCountryCode("", featureName);
        if (aliasCode && countriesData[aliasCode]) {
          const linkedLayers = getLinkedCodes(aliasCode)
            .map(linkedCode => countryLayers.get(linkedCode))
            .filter(Boolean);
          if (linkedLayers.length) {
            setCountrySelection(linkedLayers);
          }
          renderCountry(countriesData[aliasCode], countriesData[aliasCode].name);
          viewer.scene.requestRender();
          return;
        }
        renderEmpty(featureName);
      }
      return;
    }

    const country = countriesData[code];
    if (!country) {
      clearSelection();
      const aliasCode = resolveCountryCode("", featureName || code);
      if (aliasCode && countriesData[aliasCode]) {
        const linkedLayers = getLinkedCodes(aliasCode)
          .map(linkedCode => countryLayers.get(linkedCode))
          .filter(Boolean);
        if (linkedLayers.length) {
          setCountrySelection(linkedLayers);
        }
        renderCountry(countriesData[aliasCode], countriesData[aliasCode].name);
        viewer.scene.requestRender();
        return;
      }
      renderEmpty(featureName || code);
      return;
    }

    const linkedLayers = getLinkedCodes(code)
      .map(linkedCode => countryLayers.get(linkedCode))
      .filter(Boolean);
    if (
      selectionMode === "country" &&
      selectedLayers.length === linkedLayers.length &&
      linkedLayers.length &&
      linkedLayers.every((layer, index) => selectedLayers[index] === layer)
    ) {
      renderCountry(country, featureName || country.name);
      viewer.scene.requestRender();
      return;
    }
    setCountrySelection(linkedLayers);
    focusRectangle(createLayerGroup(linkedLayers).getBounds());
    renderCountry(country, featureName || country.name);
    viewer.scene.requestRender();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    clickHandler.setInputAction(movement => {
    if (!shouldUseHoverHighlights()) {
      restoreHover();
      requestSceneRender();
      return;
    }

    const now = Date.now();
    const hoverSampleWindow = isMobileLayout() ? 56 : currentMapMode === "2d" ? 42 : 28;
    if (now - lastHoverSampleAt < hoverSampleWindow) {
      return;
    }
    lastHoverSampleAt = now;

    const picked = viewer.scene.pick(movement.endPosition);
    const code = picked?.id?.countryCode;
    const layer = code ? countryLayers.get(code) : null;
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
  let activeIndex = 0;
  let currentSuggestions = [];

  renderSearchMemory();

  button.addEventListener("click", () => searchMap());
  saveButton?.addEventListener("click", () => {
    saveCurrentSearch(input.value);
  });

  input.addEventListener("input", () => {
    activeIndex = 0;
    currentSuggestions = renderSuggestions(input.value, activeIndex);
  });

  input.addEventListener("focus", () => {
    currentSuggestions = renderSuggestions(input.value, activeIndex);
    if (!input.value.trim()) {
      renderSearchMemory();
    }
  });

  input.addEventListener("keydown", async event => {
    if (event.key === "ArrowDown" && currentSuggestions.length) {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % currentSuggestions.length;
      renderSuggestions(input.value, activeIndex);
      return;
    }

    if (event.key === "ArrowUp" && currentSuggestions.length) {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
      renderSuggestions(input.value, activeIndex);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (currentSuggestions.length) {
        await selectSearchResult(currentSuggestions[activeIndex] || currentSuggestions[0]);
        currentSuggestions = [];
        return;
      }

      await searchMap();
      return;
    }

    if (event.key === "Escape") {
      hideSuggestions();
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
    currentSuggestions = [];
  });

  document.addEventListener("click", event => {
    if (!event.target.closest("#search-bar")) {
      hideSuggestions();
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

  countryPanel.addEventListener("click", async event => {
    const countryNavTrigger = event.target.closest("[data-country-nav]");
    if (countryNavTrigger) {
      scrollCountrySectionIntoView(countryNavTrigger.dataset.countryNav);
      return;
    }

    const timelineFilterButton = event.target.closest("[data-timeline-filter]");
    if (timelineFilterButton) {
      currentPanelState.timelineFilter = timelineFilterButton.dataset.timelineFilter || "all";
      rerenderCurrentPanel();
      return;
    }

    const timelineCenturyButton = event.target.closest("[data-timeline-century]");
    if (timelineCenturyButton) {
      currentPanelState.timelineCentury = timelineCenturyButton.dataset.timelineCentury || "all";
      rerenderCurrentPanel();
      return;
    }

    const timelineIntensityButton = event.target.closest("[data-timeline-intensity]");
    if (timelineIntensityButton) {
      currentPanelState.timelineIntensity = timelineIntensityButton.dataset.timelineIntensity || "all";
      rerenderCurrentPanel();
      return;
    }

    const timelineRelevanceButton = event.target.closest("[data-timeline-relevance]");
    if (timelineRelevanceButton) {
      currentPanelState.timelineRelevance = timelineRelevanceButton.dataset.timelineRelevance || "all";
      rerenderCurrentPanel();
      return;
    }

    const timelineTrigger = event.target.closest("[data-timeline-key]");
    if (timelineTrigger) {
      openTimelineModal(timelineTrigger.dataset.timelineKey);
      return;
    }

    const conflictFilterButton = event.target.closest("[data-conflict-filter]");
    if (conflictFilterButton) {
      currentPanelState.conflictFilter = conflictFilterButton.dataset.conflictFilter || "all";
      rerenderCurrentPanel();
      return;
    }

    const conflictTrigger = event.target.closest("[data-conflict-key]");
    if (conflictTrigger) {
      openConflictModal(conflictTrigger.dataset.conflictKey);
      return;
    }

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

    const shareCountryTrigger = event.target.closest("[data-share-country]");
    if (shareCountryTrigger) {
      const code = shareCountryTrigger.dataset.shareCountry;
      const country = countriesData[code];
      if (country) {
        await shareText(
          country.name,
          `${country.name}\n${currentLanguage === "en" ? "Official name" : "Nombre oficial"}: ${country.general?.officialName || country.name}\n${currentLanguage === "en" ? "Population" : "Poblacion"}: ${formatNumber(country.general?.population || 0)}\n${currentLanguage === "en" ? "Political system" : "Sistema politico"}: ${country.politics?.system || t("noData")}`
        );
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
      return;
    }

    const trigger = event.target.closest("[data-search-query]");
    if (!trigger) {
      return;
    }

    await searchByQuery(trigger.dataset.searchQuery);
  });
}

function setupThemeControls() {
  const themeSelect = document.getElementById("theme-select");
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
  updateStaticText();
  setAutoRotateState(autoRotateEnabled);

  const religionOptions = [...new Set(RELIGION_FAMILY_RULES.map(rule => rule.label))].sort((a, b) => a.localeCompare(b, "es"));
  religionFilter.innerHTML += religionOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const systemOptions = [...new Set(
    Object.values(countriesData)
      .map(country => normalizeCategoryLabel(country.politics?.system))
      .filter(label => label && label !== "Sin datos")
  )].sort((a, b) => a.localeCompare(b, "es"));
  systemFilter.innerHTML += systemOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const organizationOptions = [...new Set(
    Object.values(countriesData)
      .flatMap(country => (country.politics?.organizations || []).map(getOrganizationDisplayName))
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "es"));
  organizationFilter.innerHTML += organizationOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const historyTypeOptions = [...new Set(
    Object.values(countriesData)
      .map(country => getHistoryTypeLabel(country))
      .filter(label => label && label !== "Sin datos")
  )].sort((a, b) => a.localeCompare(b, "es"));
  historyTypeFilter.innerHTML += historyTypeOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const originOptions = [...new Set(
    Object.values(countriesData)
      .map(country => getOriginLabel(country))
      .filter(label => label && label !== "Sin datos")
  )].sort((a, b) => a.localeCompare(b, "es"));
  originFilter.innerHTML += originOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  const rivalOptions = [...new Set(
    Object.values(countriesData)
      .flatMap(country => (country.politics?.rivals || []).map(rival => normalizeCategoryLabel(rival?.name || rival)))
      .filter(label => label && label !== "Sin datos")
  )].sort((a, b) => a.localeCompare(b, "es"));
  rivalFilter.innerHTML += rivalOptions.map(label => `<option value="${escapeHtml(label)}">${escapeHtml(label)}</option>`).join("");

  themeSelect.addEventListener("change", event => {
    setTheme(event.target.value);
  });

  languageSelect.addEventListener("change", event => {
    currentLanguage = event.target.value;
    localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
    updateStaticText();
    updateExtendedStaticText();
    renderSavedViews();
    renderFavoriteViews();
    refreshGlobalStats();
    renderThemeLegend();
    renderThemeSummary();
    renderComparePanel();
    renderMapLabels();
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

setupCompareControls = function setupCompareControls() {
  const chips = document.getElementById("compare-chips");
  const select = document.getElementById("compare-country-select");
  const addButton = document.getElementById("compare-add-button");
  const openButton = document.getElementById("open-compare-modal-button");
  const clearButton = document.getElementById("clear-compare-button");
  const comparePanel = document.getElementById("compare-hub-panel");
  const compareModal = document.getElementById("compare-modal");
  const compareCloseButton = document.getElementById("compare-modal-close");

  if (select) {
    select.innerHTML = `<option value="">${currentLanguage === "en" ? "Select country" : "Seleccionar pais"}</option>${
      Object.entries(countriesData)
        .sort(([, a], [, b]) => String(a.name).localeCompare(String(b.name), "es"))
        .map(([code, country]) => `<option value="${escapeHtml(code)}">${escapeHtml(country.name)}</option>`)
        .join("")
    }`;
  }

  chips.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-compare]");
    if (!button) {
      return;
    }

      removeCountryFromCompare(button.dataset.removeCompare);
    });

  addButton?.addEventListener("click", () => {
    if (!select?.value) {
      return;
    }
    addCountryToCompare(select.value);
    if (compareSelection.length >= 2) {
      openCompareModal();
    }
  });

  openButton?.addEventListener("click", () => openCompareModal());
  clearButton?.addEventListener("click", () => {
    compareSelection = [];
    renderComparePanel();
    closeCompareModal();
  });
  comparePanel?.addEventListener("toggle", () => {
    if (!comparePanel.open) {
      return;
    }
    renderComparePanel();
  });
  compareModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-compare-modal='true']")) {
      closeCompareModal();
    }
  });
  compareCloseButton?.addEventListener("click", () => closeCompareModal());

  renderComparePanel();
};

function clearQuizTimer() {
  if (quizState.timerId) {
    clearInterval(quizState.timerId);
    quizState.timerId = null;
  }
}

function updateQuizMeta() {
  const meta = document.getElementById("quiz-meta");
  if (!meta) {
    return;
  }

  const best = Number(localStorage.getItem("geo-risk-quiz-best-streak") || quizState.bestStreak || 0);
  meta.innerHTML = `
    <span class="quiz-meta-pill">${currentLanguage === "en" ? "Streak" : "Racha"}: ${quizState.streak || 0}</span>
    <span class="quiz-meta-pill">${currentLanguage === "en" ? "Best streak" : "Mejor racha"}: ${best}</span>
    <span class="quiz-meta-pill">${quizState.mode === "timed" ? `${currentLanguage === "en" ? "Time" : "Tiempo"}: ${quizState.timeLeft || 0}s` : (currentLanguage === "en" ? "Mode: classic" : "Modo: clasico")}</span>
  `;
}

function buildQuizQuestion(category) {
  const pool = Object.entries(countriesData).filter(([code, country]) => {
    if (quizState.asked.includes(code)) return false;
    if (category === "capital") return Boolean(country.general?.capital?.name);
    if (category === "religion") return Boolean(getReligionSummaryLabel(country.religion));
    if (category === "continent") return Boolean(country.continent);
    if (category === "flag") return Boolean(country.name);
    if (category === "history") return Boolean(country.history?.year);
    if (category === "organization") return Boolean(country.politics?.organizations?.length);
    if (category === "rival") return Boolean(country.politics?.rivals?.length);
    if (category === "language") return Boolean(country.general?.languages?.length);
    if (category === "bloc") return Boolean((country.politics?.relations?.blocs || []).length);
    if (category === "conflict") return Boolean((country.military?.conflicts || country.conflicts || []).length);
    return Boolean(country.politics?.system);
  });

  if (!pool.length) return null;
  const [code, country] = shuffleArray(pool)[0];
  const difficulty = quizState.difficulty || "easy";
  let prompt = "";
  let correct = "";
  let distractors = [];

  if (category === "capital") {
    prompt = `¿Cual es la capital de ${country.name}?`;
    correct = country.general.capital.name;
    distractors = shuffleArray(Object.values(countriesData)
      .filter(item => difficulty === "easy" || item.continent === country.continent)
      .map(item => item.general?.capital?.name).filter(Boolean).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "religion") {
    prompt = `¿Cual es la religion mayoritaria de ${country.name}?`;
    correct = getReligionSummaryLabel(country.religion) || "Sin datos";
    distractors = shuffleArray(Object.values(countriesData).map(item => getReligionSummaryLabel(item.religion)).filter(Boolean).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "continent") {
    prompt = `¿En que continente se ubica ${country.name}?`;
    correct = translateContinentName(country.continent);
    distractors = shuffleArray(["America", "Europa", "Asia", "Africa", "Oceania", "Antartida"].filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "flag") {
    prompt = `¿A que pais corresponde esta bandera? ${getFlagEmoji(code)}`;
    correct = country.name;
    distractors = shuffleArray(Object.values(countriesData).filter(item => difficulty === "easy" || item.continent === country.continent).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "history") {
    prompt = `¿En que año se formo ${country.name}?`;
    correct = String(country.history.year);
    distractors = shuffleArray(Object.values(countriesData).map(item => item.history?.year).filter(Boolean).map(String).filter(value => value !== correct)).slice(0, 3);
  } else if (category === "organization") {
    const org = getOrganizationDisplayName(country.politics.organizations[0]);
    prompt = `¿Que pais pertenece a esta organizacion? ${org}`;
    correct = country.name;
    distractors = shuffleArray(Object.values(countriesData).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "rival") {
    const rival = country.politics.rivals[0]?.name || country.politics.rivals[0];
    prompt = `¿Que pais tiene como rival a ${rival}?`;
    correct = country.name;
    distractors = shuffleArray(Object.values(countriesData).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else {
    prompt = `¿Cual es el sistema politico principal de ${country.name}?`;
    correct = country.politics.system;
    distractors = shuffleArray([...new Set(Object.values(countriesData).map(item => item.politics?.system).filter(Boolean).filter(name => normalizeText(name) !== normalizeText(correct)))]).slice(0, 3);
  }

  if (distractors.length < 3) return null;
  return { code, prompt, correct, options: shuffleArray([correct, ...distractors]), answered: false };
}

function renderQuizPanel() {
  const status = document.getElementById("quiz-status");
  const question = document.getElementById("quiz-question");
  const options = document.getElementById("quiz-options");
  const nextButton = document.getElementById("quiz-next-button");
  const resetButton = document.getElementById("quiz-reset-button");
  const categorySelect = document.getElementById("quiz-category");
  const difficultySelect = document.getElementById("quiz-difficulty");
  const modeSelect = document.getElementById("quiz-mode");
  if (!status || !question || !options || !nextButton || !resetButton || !categorySelect || !difficultySelect || !modeSelect) return;

  categorySelect.value = quizState.category;
  difficultySelect.value = quizState.difficulty;
  modeSelect.value = quizState.mode || "classic";
  status.textContent = quizState.total ? `Puntaje: ${quizState.score}/${quizState.total}` : "Elegí una categoría y empezá el quiz.";
  updateQuizMeta();

  if (!quizState.current) {
    question.textContent = "";
    options.innerHTML = "";
    nextButton.hidden = true;
    resetButton.hidden = quizState.total === 0 && !quizState.asked.length;
    return;
  }

  question.textContent = quizState.current.prompt;
  options.innerHTML = quizState.current.options.map(option => `<button type="button" class="quiz-option" data-quiz-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("");
  nextButton.hidden = !quizState.current.answered;
  resetButton.hidden = false;
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

function startQuiz() {
  const categorySelect = document.getElementById("quiz-category");
  const difficultySelect = document.getElementById("quiz-difficulty");
  const modeSelect = document.getElementById("quiz-mode");
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
  } else {
    quizState.streak = 0;
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
    body: `${currentLanguage === "en" ? "Answer" : "Respuesta"}: ${quizState.current.correct}. ${currentLanguage === "en" ? "Category" : "Categoria"}: ${quizState.category}.`
  };

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
      timeLeft: 0,
      timerId: null
    };
    renderQuizPanel();
  });
  categorySelect.addEventListener("change", () => { quizState.category = categorySelect.value || "capital"; renderQuizPanel(); });
  difficultySelect.addEventListener("change", () => { quizState.difficulty = difficultySelect.value || "easy"; renderQuizPanel(); });
  modeSelect.addEventListener("change", () => { quizState.mode = modeSelect.value || "classic"; renderQuizPanel(); });
  options.addEventListener("click", event => {
    const button = event.target.closest("[data-quiz-answer]");
    if (button) answerQuiz(button.dataset.quizAnswer || "");
  });
  renderQuizPanel();
};

parseSemanticQuery = function parseSemanticQuery(rawQuery) {
  const normalized = normalizeText(rawQuery);
  const filters = { continent: "", religion: "", system: "", organization: "", language: "", bloc: "", metropole: "", conflict: "", period: "", historyType: "", origin: "", rival: "", minPopulation: 0 };

  for (const [alias, continent] of continentAliases.entries()) {
    if (normalized.includes(alias)) { filters.continent = continent; break; }
  }
  for (const [alias, religion] of religionAliases.entries()) {
    if (normalized.includes(alias)) { filters.religion = religion; break; }
  }
  for (const [alias, system] of systemAliases.entries()) {
    if (normalized.includes(alias)) { filters.system = system; break; }
  }
  if (!filters.system) {
    if (/monarquia constitucional|constitutional monarch/.test(normalized)) filters.system = "Monarquia constitucional";
    else if (/monarquia absoluta|absolute monarch/.test(normalized)) filters.system = "Monarquia absoluta";
    else if (/semipresid/.test(normalized)) filters.system = "Semipresidencialismo";
    else if (/presidenc|republicas? presidenciales?/.test(normalized)) filters.system = "Presidencialismo";
    else if (/parlament/.test(normalized)) filters.system = "Parlamentarismo";
    else if (/teocrac|republica islamica/.test(normalized)) filters.system = "Teocracia";
  }
  for (const [alias, organization] of organizationAliases.entries()) {
    if (normalized.includes(alias)) { filters.organization = organization; break; }
  }
  for (const [alias, language] of languageAliases.entries()) {
    if (normalized.includes(alias)) { filters.language = language; break; }
  }
  for (const [alias, bloc] of blocAliases.entries()) {
    if (normalized.includes(alias)) { filters.bloc = bloc; break; }
  }
  for (const [alias, metropole] of metropoleAliases.entries()) {
    if (normalized.includes(alias)) { filters.metropole = metropole; break; }
  }
  for (const [alias, conflict] of conflictAliases.entries()) {
    if (normalized.includes(alias)) { filters.conflict = conflict; break; }
  }
  for (const [alias, period] of periodAliases.entries()) {
    if (normalized.includes(alias)) { filters.period = period; break; }
  }
  if (!filters.organization && /\botan\b|nato/.test(normalized)) filters.organization = "OTAN";
  if (!filters.organization && /(union europea|ue\b|european union)/.test(normalized)) filters.organization = "Union Europea";
  if (!filters.organization && /(mercosur|mercosul)/.test(normalized)) filters.organization = "Mercosur";
  if (!filters.organization && /\bbrics\b/.test(normalized)) filters.organization = "BRICS";
  if (!filters.bloc && filters.organization && /(OTAN|Union Europea|Mercosur|BRICS)/.test(filters.organization)) {
    filters.bloc = filters.organization;
  }
  for (const [alias, origin] of originAliases.entries()) {
    if (normalized.includes(alias)) { filters.origin = origin; break; }
  }
  if (!filters.origin) {
    if (/ex colonias? britan|british colon|imperio britan/.test(normalized)) filters.origin = "__british__";
    else if (/ex colonias? frances|french colon/.test(normalized)) filters.origin = "__french__";
    else if (/ex colonias? espan|spanish colon/.test(normalized)) filters.origin = "__spanish__";
    else if (/ex colonias? portugues|portuguese colon/.test(normalized)) filters.origin = "__portuguese__";
  }
  for (const [alias, rival] of rivalAliases.entries()) {
    if (normalized.includes(alias)) { filters.rival = rival; break; }
  }
  if (!filters.rival && /\brusia\b|russia/.test(normalized)) filters.rival = "Rusia";
  if (!filters.metropole && /(ex metropoli britan|british metropole)/.test(normalized)) filters.metropole = "Reino Unido";
  if (!filters.metropole && /(ex metropoli frances|french metropole)/.test(normalized)) filters.metropole = "Francia";
  if (!filters.religion) {
    if (/\bislam|\bmusulman|\bsunita|\bchiita/.test(normalized)) filters.religion = "Islamismo";
    else if (/\bcristian|\bcatolic|\bprotest|\bortodox|\banglican/.test(normalized)) filters.religion = "Cristianismo";
    else if (/\bhindu/.test(normalized)) filters.religion = "Hinduismo";
    else if (/\bjudai|\bjew/.test(normalized)) filters.religion = "Judaismo";
    else if (/\bbudis/.test(normalized)) filters.religion = "Budismo";
  }
  if (!filters.period) {
    if (/(siglo xxi|siglo 21|21st century)/.test(normalized)) filters.period = "Siglo XXI";
    else if (/(siglo xx|siglo 20|20th century)/.test(normalized)) filters.period = "Siglo XX";
    else if (/(siglo xix|siglo 19|19th century)/.test(normalized)) filters.period = "Siglo XIX";
  }

  const populationMatchers = [
    { pattern: /mas de 100 millones|more than 100 million/, value: 100000000 },
    { pattern: /mas de 50 millones|more than 50 million/, value: 50000000 },
    { pattern: /mas de 20 millones|more than 20 million/, value: 20000000 },
    { pattern: /mas de 10 millones|more than 10 million/, value: 10000000 },
    { pattern: /mas de 1 millon|more than 1 million/, value: 1000000 }
  ];
  const populationMatch = populationMatchers.find(item => item.pattern.test(normalized));
  if (populationMatch) filters.minPopulation = populationMatch.value;
  const semanticPatterns = [
    /miembros? de /,
    /members? of /,
    /rivales? de /,
    /rivals? of /,
    /ex colonias? de /,
    /former colonies? of /,
    /idioma|language/,
    /guerra|batalla|war|battle/,
    /siglo|century/,
    /bloque|bloc|alliance|alianza/,
    /ex metropoli|former metropole/
  ];
  const score = Object.values(filters).filter(Boolean).length;
  return score >= 2 || (score >= 1 && semanticPatterns.some(pattern => pattern.test(normalized))) ? filters : null;
};

function renderNewsArticle(article, country) {
  const articleContainer = document.getElementById("news-hub-article");
  if (!articleContainer) return;
  if (!article) {
    articleContainer.innerHTML = "";
    return;
  }
  articleContainer.innerHTML = `
    <div class="news-hub-article-card">
      <strong>${escapeHtml(article.title)}</strong>
      <p>${escapeHtml(article.summary)}</p>
      <div class="news-hub-meta">${escapeHtml(article.source || "Fuente")} ${article.date ? `· ${escapeHtml(article.date)}` : ""}</div>
      <div class="news-source-links">
        <a class="news-link" href="${article.url || getCountryNewsUrl(country)}" target="_blank" rel="noreferrer">${currentLanguage === "en" ? "Open full article" : "Abrir articulo completo"}</a>
        ${getCountryNewsPortalLinks(country).map(link => `<a class="news-link" href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}
      </div>
    </div>
  `;
}

function setupQuizControls() {
  const startButton = document.getElementById("quiz-start-button");
  const nextButton = document.getElementById("quiz-next-button");
  const resetButton = document.getElementById("quiz-reset-button");
  const categorySelect = document.getElementById("quiz-category");
  const difficultySelect = document.getElementById("quiz-difficulty");
  const options = document.getElementById("quiz-options");

  if (!startButton || !nextButton || !resetButton || !categorySelect || !difficultySelect || !options) {
    return;
  }

  startButton.addEventListener("click", () => startQuiz());
  nextButton.addEventListener("click", () => nextQuizQuestion());
  resetButton.addEventListener("click", () => {
    quizState = {
      category: categorySelect.value || "capital",
      difficulty: difficultySelect.value || "easy",
      asked: [],
      score: 0,
      total: 0,
      current: null
    };
    renderQuizPanel();
  });
  categorySelect.addEventListener("change", () => {
    quizState.category = categorySelect.value || "capital";
    renderQuizPanel();
  });
  difficultySelect.addEventListener("change", () => {
    quizState.difficulty = difficultySelect.value || "easy";
    renderQuizPanel();
  });
  options.addEventListener("click", event => {
    const button = event.target.closest("[data-quiz-answer]");
    if (!button) {
      return;
    }
    answerQuiz(button.dataset.quizAnswer || "");
  });

  renderQuizPanel();
}

function setupRankingsPanel() {
  const rankingsPanel = document.getElementById("rankings-panel");
  if (!rankingsPanel) {
    return;
  }

  rankingsPanel.open = false;
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
      const comparePanel = document.getElementById("compare-hub-panel");
      const quizPanel = document.getElementById("quiz-hub-panel");
      if (comparePanel) comparePanel.open = false;
      if (quizPanel) quizPanel.open = false;
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
    const comparePanel = document.getElementById("compare-hub-panel");
    const newsPanel = document.getElementById("news-hub-panel");
    if (comparePanel) comparePanel.open = false;
    if (newsPanel) newsPanel.open = false;
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

  leftButton.addEventListener("click", () => toggleMobilePanel("left"));
  toolsButton.addEventListener("click", () => toggleMobilePanel("tools"));
  countryButton.addEventListener("click", () => {
    if (currentPanelState?.type === "country" && currentPanelState?.code && countriesData[currentPanelState.code]) {
      openCountryModal();
    }
  });

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

function buildExportFilename(base) {
  const stamp = new Date().toISOString().slice(0, 10);
  const context = [
    base || getExportContextLabel() || "georisk",
    currentTheme && currentTheme !== "default" ? currentTheme : "",
    appMode && appMode !== "default" ? appMode : ""
  ].filter(Boolean).join("-");
  return `${normalizeText(context).replace(/\s+/g, "-") || "georisk"}-${stamp}`;
}

function buildReportCaptureNode(node, title) {
  const wrapper = document.createElement("div");
  wrapper.className = "export-report-shell";
  wrapper.style.position = "fixed";
  wrapper.style.left = "-99999px";
  wrapper.style.top = "0";
  wrapper.style.width = `${Math.min(1280, Math.max(900, node?.scrollWidth || 960))}px`;
  wrapper.style.padding = "32px";
  wrapper.style.background = "#071320";
  wrapper.style.color = "#eef5ff";

  const reportTitle = title || (currentLanguage === "en" ? "GeoRisk report" : "Informe GeoRisk");
  const contextLine = [
    currentPanelState?.code && countriesData[currentPanelState.code] ? countriesData[currentPanelState.code].name : "",
    currentTheme && currentTheme !== "default" ? currentTheme : (currentLanguage === "en" ? "political view" : "vista politica"),
    appMode && appMode !== "default" ? appMode : (currentLanguage === "en" ? "exploration" : "exploracion")
  ].filter(Boolean).join(" · ");

  wrapper.innerHTML = `
    <div class="export-report-header">
      <div>
        <div class="export-report-kicker">GeoRisk</div>
        <h1>${escapeHtml(reportTitle)}</h1>
        <p>${escapeHtml(contextLine)}</p>
      </div>
      <div class="export-report-meta">${new Date().toLocaleString(currentLanguage === "en" ? "en-US" : "es-AR", { dateStyle: "medium", timeStyle: "short" })}</div>
    </div>
  `;

  const clone = node.cloneNode(true);
  clone.classList.add("export-report-body");
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  return wrapper;
}

exportNodeAsImage = async function exportNodeAsImage(node, filename) {
  if (!node || typeof html2canvas !== "function") {
    return;
  }

  const captureNode = buildReportCaptureNode(node, filename?.replace(/\.(png|pdf)$/i, ""));
  try {
    const canvas = await html2canvas(captureNode, {
      backgroundColor: "#071320",
      scale: Math.min(window.devicePixelRatio > 1 ? 2 : 1.8, 2.2),
      useCORS: true
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${buildExportFilename(filename?.replace(/\.png$/i, ""))}.png`;
    link.click();
  } finally {
    captureNode.remove();
  }
};

exportNodeAsPdf = async function exportNodeAsPdf(node, filename) {
  if (!node || typeof html2canvas !== "function" || !window.jspdf?.jsPDF) {
    return;
  }

  const captureNode = buildReportCaptureNode(node, filename?.replace(/\.(png|pdf)$/i, ""));
  try {
    const canvas = await html2canvas(captureNode, {
      backgroundColor: "#071320",
      scale: 2,
      useCORS: true
    });
    const image = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${buildExportFilename(filename?.replace(/\.pdf$/i, ""))}.pdf`);
  } finally {
    captureNode.remove();
  }
};

shareText = async function shareText(title, text) {
  const payload = `${title}\n\n${text}\n\nGeoRisk · ${new Date().toLocaleDateString(currentLanguage === "en" ? "en-US" : "es-AR")}`;
  if (navigator.share) {
    try {
      await navigator.share({ title, text: payload });
      return;
    } catch (error) {
      console.error("No se pudo compartir:", error);
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload);
  }
};

function getCompareSelectionList(filterText = "") {
  const normalizedFilter = normalizeText(filterText);
  return Object.entries(countriesData)
    .filter(([, country]) => !normalizedFilter || normalizeText(country.name).includes(normalizedFilter) || normalizeText(country.general?.officialName).includes(normalizedFilter))
    .sort(([, a], [, b]) => String(a.name).localeCompare(String(b.name), "es"));
}

function getComparisonBenchmark(country) {
  const world = Object.values(countriesData);
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

function renderComparePanel() {
  const comparePanel = document.getElementById("compare-hub-panel");
  const empty = document.getElementById("compare-empty");
  const chips = document.getElementById("compare-chips");
  const results = document.getElementById("compare-results");
  const openButton = document.getElementById("open-compare-modal-button");
  const worldButton = document.getElementById("compare-benchmark-world");
  const continentButton = document.getElementById("compare-benchmark-continent");
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
  chips.innerHTML = compareSelection
    .map(code => `<span class="compare-chip">${getFlagEmoji(code)} ${escapeHtml(countriesData[code]?.name || code)} <button type="button" data-remove-compare="${escapeHtml(code)}">x</button></span>`)
    .join("");

  const heavyMode = comparePanel?.open || compareSelection.length >= 2;
  if (!heavyMode) {
    results.innerHTML = `
      <div class="compare-insight-grid">
        ${compareSelection.map(code => {
          const country = countriesData[code];
          return `
            <div class="compare-insight-card">
              <strong>${getFlagEmoji(code)} ${escapeHtml(country.name)}</strong>
              <span>${escapeHtml(country.general?.officialName || country.name)}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
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

  const cards = compareSelection.map(code => {
    const country = countriesData[code];
    const benchmark = getComparisonBenchmark(country);
    const populationDelta = benchmark.populationAvg ? (((country.general?.population || 0) - benchmark.populationAvg) / benchmark.populationAvg) * 100 : 0;
    const gdpDelta = benchmark.gdpPcAvg ? (((country.economy?.gdpPerCapita || 0) - benchmark.gdpPcAvg) / benchmark.gdpPcAvg) * 100 : 0;
    return `
      <div class="compare-country-card">
        <div class="compare-country-flag">${renderFlagVisual(code, country.name, "compare-country-flag-badge")}</div>
        <div class="compare-country-name">${escapeHtml(country.name)}</div>
        <div class="compare-country-meta compare-country-official">${escapeHtml(country.general?.officialName || country.name)}</div>
        <div class="compare-country-meta">${escapeHtml(translateContinentName(country.continent))}</div>
        <div class="compare-country-meta">${escapeHtml(country.politics?.system || t("noData"))}</div>
        <div class="compare-country-meta">${escapeHtml(getCountryBlocLabel(country))}</div>
        <div class="compare-benchmark-grid">
          <div class="compare-benchmark-card">
            <strong>${currentLanguage === "en" ? "Population gap" : "Brecha poblacional"}</strong>
            <span>${formatPercentage(populationDelta)}</span>
          </div>
          <div class="compare-benchmark-card">
            <strong>${currentLanguage === "en" ? "GDP pc gap" : "Brecha de PBI pc"}</strong>
            <span>${formatPercentage(gdpDelta)}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const metricFields = [
    { label: t("comparePopulation"), getValue: country => country.general?.population || 0, format: value => formatNumber(value) },
    { label: t("compareGdp"), getValue: country => country.economy?.gdp || 0, format: value => `US$ ${compactNumber(value)}` },
    { label: t("compareGdpPerCapita"), getValue: country => country.economy?.gdpPerCapita || 0, format: value => `US$ ${formatNumber(Math.round(value))}` },
    { label: currentLanguage === "en" ? "Active military" : "Personal activo", getValue: country => getCountryMilitaryActive(country), format: value => formatNumber(value) },
    { label: currentLanguage === "en" ? "Organizations" : "Organizaciones", getValue: country => getCountryOrganizationCount(country), format: value => formatNumber(value) },
    { label: currentLanguage === "en" ? "Exports" : "Exportaciones", getValue: country => getCountryExportBreadth(country), format: value => formatNumber(value) },
    { label: currentLanguage === "en" ? "Industries" : "Industrias", getValue: country => getCountryIndustryBreadth(country), format: value => formatNumber(value) }
  ];

  const metricMarkup = metricFields.map(field => `
    <div class="compare-row">
      <strong>${field.label}</strong>
      <div class="compare-values compare-bars">
        ${compareSelection.map(code => {
          const country = countriesData[code];
          const value = field.getValue(country);
          const maxValue = Math.max(...compareSelection.map(compareCode => field.getValue(countriesData[compareCode])), 1);
          const width = maxValue ? (value / maxValue) * 100 : 0;
          return `<div class="compare-bar-item"><div class="compare-bar-label"><b>${getFlagEmoji(code)} ${escapeHtml(country.name)}:</b> ${escapeHtml(field.format(value))}</div><div class="compare-bar-track"><div class="compare-bar-fill" style="width:${width}%"></div></div></div>`;
        }).join("")}
      </div>
    </div>
  `).join("");

  const summaryCards = [
    {
      label: currentLanguage === "en" ? "Largest population" : "Mayor poblacion",
      code: compareSelection.map(code => ({ code, value: countriesData[code].general?.population || 0 })).sort((a, b) => b.value - a.value)[0]?.code
    },
    {
      label: currentLanguage === "en" ? "Highest GDP" : "Mayor PBI",
      code: compareSelection.map(code => ({ code, value: countriesData[code].economy?.gdp || 0 })).sort((a, b) => b.value - a.value)[0]?.code
    },
    {
      label: currentLanguage === "en" ? "Highest GDP pc" : "Mayor PBI pc",
      code: compareSelection.map(code => ({ code, value: countriesData[code].economy?.gdpPerCapita || 0 })).sort((a, b) => b.value - a.value)[0]?.code
    },
    {
      label: currentLanguage === "en" ? "Most organizations" : "Mas organizaciones",
      code: compareSelection.map(code => ({ code, value: getCountryOrganizationCount(countriesData[code]) })).sort((a, b) => b.value - a.value)[0]?.code
    }
  ];

  const timelineComparisonMarkup = compareSelection.map(code => {
    const country = countriesData[code];
    const events = buildTimeline(country)
      .sort((a, b) => {
        const relevanceWeight = { alta: 3, media: 2, baja: 1 };
        const relevanceDiff = (relevanceWeight[normalizeText(b.relevance)] || 0) - (relevanceWeight[normalizeText(a.relevance)] || 0);
        if (relevanceDiff !== 0) {
          return relevanceDiff;
        }
        return (a.year || 0) - (b.year || 0);
      })
      .slice(0, 6);
    return `
      <div class="compare-row">
        <strong>${getFlagEmoji(code)} ${escapeHtml(country.name)} · ${currentLanguage === "en" ? "Timeline" : "Timeline"}</strong>
        <div class="compare-values">
          ${events.map(event => `<div><b>${escapeHtml(String(event.year))}</b> · ${escapeHtml(event.text)}</div>`).join("")}
        </div>
      </div>
    `;
  }).join("");

  const sharedTimelineSummary = (() => {
    const categories = ["constitution", "coup", "treaty", "annexation", "secession", "system", "formation", "conflict"]
      .filter(category => compareSelection.every(code => buildTimeline(countriesData[code]).some(item => item.categoryKey === category)));
    if (!categories.length) {
      return "";
    }
    return `
      <div class="compare-row compare-summary-row">
        <strong>${currentLanguage === "en" ? "Shared milestones" : "Hitos compartidos"}</strong>
        <div class="compare-values">
          ${categories.map(category => `<span class="country-meta-pill">${escapeHtml(getTimelineCategoryLabel(category))}</span>`).join("")}
        </div>
      </div>
    `;
  })();

  results.innerHTML = `
    <div class="compare-toolbar">
      <button type="button" class="panel-action-button" data-export-target="compare-results" data-export-format="png">${currentLanguage === "en" ? "Export image" : "Exportar imagen"}</button>
      <button type="button" class="panel-action-button" data-export-target="compare-results" data-export-format="pdf">${currentLanguage === "en" ? "Export PDF" : "Exportar PDF"}</button>
      <button type="button" class="panel-action-button" data-share-target="compare-results">${currentLanguage === "en" ? "Share" : "Compartir"}</button>
    </div>
    <div class="compare-insight-grid">
      ${summaryCards.map(item => {
        const country = item.code ? countriesData[item.code] : null;
        return `
          <div class="compare-insight-card">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${country ? `${getFlagEmoji(item.code)} ${escapeHtml(country.name)}` : t("noData")}</span>
          </div>
        `;
      }).join("")}
    </div>
    <div class="compare-radar-wrap">${buildCompareRadarSVG(radarEntries)}</div>
    <div class="compare-country-cards">${cards}</div>
    <div class="compare-row compare-summary-row">
      <strong>${compareBenchmarkMode === "continent" ? (currentLanguage === "en" ? "Continental benchmarks" : "Referencias continentales") : (currentLanguage === "en" ? "World benchmarks" : "Referencias mundiales")}</strong>
      <div class="compare-values">
        ${compareSelection.map(code => {
          const country = countriesData[code];
          const benchmark = getComparisonBenchmark(country);
          return `<div><b>${getFlagEmoji(code)} ${escapeHtml(country.name)}:</b> ${benchmark.label} · ${currentLanguage === "en" ? "avg population" : "prom. poblacion"} ${formatNumber(Math.round(benchmark.populationAvg || 0))} · ${currentLanguage === "en" ? "avg GDP pc" : "prom. PBI pc"} US$ ${formatNumber(Math.round(benchmark.gdpPcAvg || 0))}</div>`;
        }).join("")}
      </div>
    </div>
    ${sharedTimelineSummary}
    ${timelineComparisonMarkup}
    ${metricMarkup}
  `;

  if (openButton) openButton.disabled = compareSelection.length < 2;
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
  const comparePanel = document.getElementById("compare-hub-panel");
  const compareModal = document.getElementById("compare-modal");
  const compareCloseButton = document.getElementById("compare-modal-close");

  updateCompareSelectOptions();
  chips?.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-compare]");
    if (button) removeCountryFromCompare(button.dataset.removeCompare);
  });
  search?.addEventListener("input", () => updateCompareSelectOptions(search.value));
  addButton?.addEventListener("click", () => {
    if (!select?.value) return;
    addCountryToCompare(select.value);
    if (compareSelection.length >= 2) openCompareModal();
  });
  openButton?.addEventListener("click", () => openCompareModal());
  clearButton?.addEventListener("click", () => {
    compareSelection = [];
    renderComparePanel();
    closeCompareModal();
  });
  benchmarkWorld?.addEventListener("click", () => {
    compareBenchmarkMode = "world";
    renderComparePanel();
  });
  benchmarkContinent?.addEventListener("click", () => {
    compareBenchmarkMode = "continent";
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

if (typeof newsUi.buildArticleCard === "function") {
  renderNewsArticle = function renderNewsArticle(article, country, relatedArticles = []) {
    const articleContainer = document.getElementById("news-hub-article");
    if (!articleContainer) return;
    if (!article) {
      articleContainer.innerHTML = "";
      return;
    }
    articleContainer.innerHTML = newsUi.buildArticleCard({
      title: escapeHtml(article.title),
      summary: escapeHtml(article.summary),
      meta: `${escapeHtml(article.source || "Fuente")}${article.date ? ` · ${escapeHtml(article.date)}` : ""}`,
      actionLabel: currentLanguage === "en" ? "Open full article" : "Abrir articulo completo",
      actionUrl: article.url || getCountryNewsUrl(country)
    });
  };

  renderNewsHub = function renderNewsHub(selectedCode = "") {
    const panel = document.getElementById("news-hub-panel");
    const selectedContainer = document.getElementById("news-hub-selected");
    const listContainer = document.getElementById("news-hub-list");
    const articleContainer = document.getElementById("news-hub-article");
    const filterInput = document.getElementById("news-country-filter");
    if (!panel || !selectedContainer || !listContainer || !articleContainer) return;

    const filterText = normalizeText(filterInput?.value || "");
    const countries = Object.entries(countriesData)
      .map(([code, country]) => ({ code, country }))
      .filter(({ country }) => {
        if (!filterText) return true;
        return normalizeText(country.name).includes(filterText)
          || normalizeText(country.general?.officialName || "").includes(filterText);
      })
      .sort((a, b) => a.country.name.localeCompare(b.country.name, "es"));

    const selected = selectedCode && countriesData[selectedCode] ? countriesData[selectedCode] : null;
    selectedContainer.innerHTML = selected
      ? newsUi.buildSelectedCard(
        selected,
        getCountryNewsPortalLinks(selected).map(link => `<a class="news-link" href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join(""),
        escapeHtml
      )
      : "";

    if (!panel.open) {
      articleContainer.innerHTML = "";
      listContainer.innerHTML = "";
      return;
    }

    articleContainer.innerHTML = selected
      ? `<div class="news-hub-article-card"><strong>${currentLanguage === "en" ? "Quick focus" : "Foco rapido"}</strong><p>${currentLanguage === "en" ? "Open one of the recommended sources or wait for the highlighted article preview." : "Abri una de las fuentes recomendadas o espera la vista previa del articulo destacado."}</p></div>`
      : "";
      listContainer.innerHTML = newsUi.buildNewsList(countries, activeNewsCountryCode, escapeHtml, getCountryNewsUrl);

    if (selected) {
      fetchCountryHeadline(selected)
        .then(article => {
          if (selected.code !== activeNewsCountryCode && selectedCode !== selected.code) {
            return;
          }
          renderNewsArticle(article, selected);
        })
        .catch(() => {});
    }
  };
}

if (typeof newsUi.buildArticleCard === "function") {
  renderNewsArticle = function renderNewsArticle(article, country, relatedArticles = []) {
    const articleContainer = document.getElementById("news-hub-article");
    if (!articleContainer) return;
    if (!article) {
      articleContainer.innerHTML = "";
      return;
    }

    const headlineMarkup = relatedArticles.slice(1, 4).map(item => `
      <a class="news-headline-item" href="${item.url || getCountryNewsUrl(country)}" target="_blank" rel="noreferrer">
        <span>${escapeHtml(item.title)}</span>
        <small>${escapeHtml(item.source || "Fuente")}${item.date ? ` · ${escapeHtml(item.date)}` : ""}</small>
      </a>
    `).join("");

    articleContainer.innerHTML = `
      ${newsUi.buildArticleCard({
        title: escapeHtml(article.title),
        summary: escapeHtml(article.summary),
        meta: `${escapeHtml(article.source || "Fuente")}${article.date ? ` · ${escapeHtml(article.date)}` : ""}`,
        actionLabel: currentLanguage === "en" ? "Open full article" : "Abrir articulo completo",
        actionUrl: article.url || getCountryNewsUrl(country)
      })}
      ${headlineMarkup ? `
        <div class="news-headline-list">
          <strong>${currentLanguage === "en" ? "More live headlines" : "Mas titulares en vivo"}</strong>
          ${headlineMarkup}
        </div>
      ` : ""}
    `;
  };

  renderNewsHub = function renderNewsHub(selectedCode = "") {
    const panel = document.getElementById("news-hub-panel");
    const selectedContainer = document.getElementById("news-hub-selected");
    const listContainer = document.getElementById("news-hub-list");
    const articleContainer = document.getElementById("news-hub-article");
    const filterInput = document.getElementById("news-country-filter");
    if (!panel || !selectedContainer || !listContainer || !articleContainer) return;

    const filterText = normalizeText(filterInput?.value || "");
    const countries = Object.entries(countriesData)
      .map(([code, country]) => ({ code, country }))
      .filter(({ country }) => {
        if (!filterText) return true;
        return normalizeText(country.name).includes(filterText)
          || normalizeText(country.general?.officialName || "").includes(filterText);
      })
      .sort((a, b) => a.country.name.localeCompare(b.country.name, "es"));

    const selected = selectedCode && countriesData[selectedCode] ? countriesData[selectedCode] : null;
    selectedContainer.innerHTML = selected
      ? newsUi.buildSelectedCard(
          selected,
          getCountryNewsPortalLinks(selected).map(link => `<a class="news-link" href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join(""),
          escapeHtml
        )
      : "";

    if (!panel.open) {
      articleContainer.innerHTML = "";
      listContainer.innerHTML = "";
      return;
    }

    articleContainer.innerHTML = selected
      ? `<div class="news-hub-article-card"><strong>${currentLanguage === "en" ? "Quick focus" : "Foco rapido"}</strong><p>${currentLanguage === "en" ? "Now the hub also brings live headlines from the selected country when they are available." : "Ahora el hub tambien trae titulares en vivo del pais seleccionado cuando estan disponibles."}</p></div>`
      : "";
    listContainer.innerHTML = newsUi.buildNewsList(countries, activeNewsCountryCode, escapeHtml, getCountryNewsUrl);

    if (selected) {
      fetchCountryHeadlines(selected)
        .then(headlines => {
          if (selected.code !== activeNewsCountryCode && selectedCode !== selected.code) {
            return;
          }
          renderNewsArticle(headlines[0], selected, headlines);
        })
        .catch(() => {});
    }
  };
}

if (typeof compareUi.buildCompareChips === "function") {
  renderComparePanel = function renderComparePanel() {
    const comparePanel = document.getElementById("compare-hub-panel");
    const empty = document.getElementById("compare-empty");
    const chips = document.getElementById("compare-chips");
    const results = document.getElementById("compare-results");
    const openButton = document.getElementById("open-compare-modal-button");
    const worldButton = document.getElementById("compare-benchmark-world");
    const continentButton = document.getElementById("compare-benchmark-continent");
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
    chips.innerHTML = compareUi.buildCompareChips(compareSelection, countriesData, getFlagEmoji, escapeHtml);

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

function buildCompareInsightCards(compareSelectionCodes) {
  const insightDefs = [
    {
      label: currentLanguage === "en" ? "Highest quality" : "Mayor calidad",
      value: country => getCountryQualityScore(country)
    },
    {
      label: currentLanguage === "en" ? "Greatest diplomatic reach" : "Mayor alcance diplomatico",
      value: country => getCountryDiplomaticReach(country)
    },
    {
      label: currentLanguage === "en" ? "Most languages" : "Mas idiomas",
      value: country => getCountryLanguageDiversity(country)
    },
    {
      label: currentLanguage === "en" ? "Most conflict exposure" : "Mayor exposicion conflictiva",
      value: country => getCountryWarParticipationCount(country)
    }
  ];

  return insightDefs.map(definition => {
    const topCode = compareSelectionCodes
      .map(code => ({ code, value: definition.value(countriesData[code]) }))
      .sort((a, b) => b.value - a.value)[0]?.code;
    const topCountry = topCode ? countriesData[topCode] : null;
    return `
      <div class="compare-insight-card">
        <strong>${escapeHtml(definition.label)}</strong>
        <span>${topCountry ? `${getFlagEmoji(topCode)} ${escapeHtml(topCountry.name)}` : t("noData")}</span>
      </div>
    `;
  }).join("");
}

if (typeof compareUi.buildCompareChips === "function") {
  renderComparePanel = function renderComparePanel() {
    const comparePanel = document.getElementById("compare-hub-panel");
    const empty = document.getElementById("compare-empty");
    const chips = document.getElementById("compare-chips");
    const results = document.getElementById("compare-results");
    const openButton = document.getElementById("open-compare-modal-button");
    const worldButton = document.getElementById("compare-benchmark-world");
    const continentButton = document.getElementById("compare-benchmark-continent");
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
    chips.innerHTML = compareUi.buildCompareChips(compareSelection, countriesData, getFlagEmoji, escapeHtml);

    const heavyMode = comparePanel?.open || compareSelection.length >= 2;
    if (!heavyMode) {
      results.innerHTML = `
        ${compareUi.buildLightCards(compareSelection, countriesData, getFlagEmoji, escapeHtml)}
        <div class="compare-insight-grid">${buildCompareInsightCards(compareSelection)}</div>
      `;
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

    const additionalRows = [
      {
        label: currentLanguage === "en" ? "Quality score" : "Calidad del dataset",
        getValue: country => getCountryQualityScore(country),
        format: value => `${formatNumber(Math.round(value || 0))}/100`
      },
      {
        label: currentLanguage === "en" ? "Diplomatic reach" : "Alcance diplomatico",
        getValue: country => getCountryDiplomaticReach(country),
        format: value => formatNumber(value)
      },
      {
        label: currentLanguage === "en" ? "Languages" : "Idiomas",
        getValue: country => getCountryLanguageDiversity(country),
        format: value => formatNumber(value)
      },
      {
        label: currentLanguage === "en" ? "War participation" : "Participacion en guerras",
        getValue: country => getCountryWarParticipationCount(country),
        format: value => formatNumber(value)
      },
      {
        label: currentLanguage === "en" ? "Export breadth" : "Diversidad exportadora",
        getValue: country => getCountryExportBreadth(country),
        format: value => formatNumber(value)
      },
      {
        label: currentLanguage === "en" ? "Industrial breadth" : "Diversidad industrial",
        getValue: country => getCountryIndustryBreadth(country),
        format: value => formatNumber(value)
      }
    ].map(field => `
      <div class="compare-row">
        <strong>${field.label}</strong>
        <div class="compare-values compare-bars">
          ${compareSelection.map(code => {
            const country = countriesData[code];
            const value = field.getValue(country);
            const maxValue = Math.max(...compareSelection.map(compareCode => field.getValue(countriesData[compareCode])), 1);
            const width = maxValue ? (value / maxValue) * 100 : 0;
            return `<div class="compare-bar-item"><div class="compare-bar-label"><b>${getFlagEmoji(code)} ${escapeHtml(country.name)}:</b> ${escapeHtml(field.format(value))}</div><div class="compare-bar-track"><div class="compare-bar-fill" style="width:${width}%"></div></div></div>`;
          }).join("")}
        </div>
      </div>
    `).join("");

    const benchmarkMarkup = compareSelection.map(code => {
      const country = countriesData[code];
      const benchmark = getComparisonBenchmark(country);
      return `<div><b>${getFlagEmoji(code)} ${escapeHtml(country.name)}:</b> ${benchmark.label} · ${currentLanguage === "en" ? "avg population" : "prom. poblacion"} ${formatNumber(Math.round(benchmark.populationAvg || 0))} · ${currentLanguage === "en" ? "avg GDP pc" : "prom. PBI pc"} US$ ${formatNumber(Math.round(benchmark.gdpPcAvg || 0))}</div>`;
    }).join("");

    const profileRows = compareSelection.map(code => {
      const country = countriesData[code];
      return `<div><b>${getFlagEmoji(code)} ${escapeHtml(country.name)}:</b> ${currentLanguage === "en" ? "quality" : "calidad"} ${getCountryQualityScore(country)}/100 · ${currentLanguage === "en" ? "languages" : "idiomas"} ${formatNumber(getCountryLanguageDiversity(country))} · ${currentLanguage === "en" ? "war exposure" : "exposicion belica"} ${formatNumber(getCountryWarParticipationCount(country))}</div>`;
    }).join("");

    results.innerHTML = `
      <div class="compare-toolbar">
        <button type="button" class="panel-action-button" data-export-target="compare-results" data-export-format="png">${currentLanguage === "en" ? "Export image" : "Exportar imagen"}</button>
        <button type="button" class="panel-action-button" data-export-target="compare-results" data-export-format="pdf">${currentLanguage === "en" ? "Export PDF" : "Exportar PDF"}</button>
        <button type="button" class="panel-action-button" data-share-target="compare-results">${currentLanguage === "en" ? "Share" : "Compartir"}</button>
      </div>
      <div class="compare-insight-grid">${buildCompareInsightCards(compareSelection)}</div>
      <div class="compare-radar-wrap">${buildCompareRadarSVG(radarEntries)}</div>
      <div class="compare-country-cards">${cards}</div>
      <div class="compare-row compare-summary-row">
        <strong>${currentLanguage === "en" ? "Strategic profile" : "Perfil estrategico"}</strong>
        <div class="compare-values">${profileRows}</div>
      </div>
      <div class="compare-row compare-summary-row">
        <strong>${compareBenchmarkMode === "continent" ? (currentLanguage === "en" ? "Continental benchmarks" : "Referencias continentales") : (currentLanguage === "en" ? "World benchmarks" : "Referencias mundiales")}</strong>
        <div class="compare-values">${benchmarkMarkup}</div>
      </div>
      ${buildCompareTimelineSummary(compareSelection)}
      ${additionalRows}
    `;

    if (openButton) openButton.disabled = compareSelection.length < 2;
  };
}

if (typeof quizUi.buildStatusText === "function") {
  updateQuizMeta = function updateQuizMeta() {
    const meta = document.getElementById("quiz-meta");
    if (!meta) return;
    const best = Number(localStorage.getItem("geo-risk-quiz-best-streak") || quizState.bestStreak || 0);
    meta.innerHTML = quizUi.buildMetaHtml(quizState, currentLanguage, best);
  };

  renderQuizPanel = function renderQuizPanel() {
    const status = document.getElementById("quiz-status");
    const question = document.getElementById("quiz-question");
    const feedback = document.getElementById("quiz-feedback");
    const options = document.getElementById("quiz-options");
    const nextButton = document.getElementById("quiz-next-button");
    const resetButton = document.getElementById("quiz-reset-button");
    const categorySelect = document.getElementById("quiz-category");
    const difficultySelect = document.getElementById("quiz-difficulty");
    const modeSelect = document.getElementById("quiz-mode");
    if (!status || !question || !feedback || !options || !nextButton || !resetButton || !categorySelect || !difficultySelect || !modeSelect) return;

    categorySelect.value = quizState.category;
    difficultySelect.value = quizState.difficulty;
    modeSelect.value = quizState.mode || "classic";
    status.textContent = quizUi.buildStatusText(quizState);
    updateQuizMeta();

    if (!quizState.current) {
      question.textContent = "";
      feedback.innerHTML = "";
      options.innerHTML = "";
      nextButton.hidden = true;
      resetButton.hidden = quizState.total === 0 && !quizState.asked.length;
      return;
    }

    question.textContent = quizState.current.prompt;
    feedback.innerHTML = typeof quizUi.buildFeedbackHtml === "function" ? quizUi.buildFeedbackHtml(quizState.feedback, escapeHtml) : "";
    options.innerHTML = quizUi.buildOptionsMarkup(quizState.current.options, escapeHtml);
    nextButton.hidden = !quizState.current.answered;
    resetButton.hidden = false;
  };
}

async function registerServiceWorker() {
  const status = document.getElementById("offline-status");

  if (!("serviceWorker" in navigator)) {
    status.textContent = "Cache offline no disponible en este navegador.";
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
    status.textContent = currentLanguage === "en"
      ? "Offline mode active with local cache."
      : "Modo offline activo con cache local.";
    updateAppStatusPanel();
  } catch (error) {
    status.textContent = currentLanguage === "en"
      ? "Offline cache could not be initialized."
      : "No se pudo inicializar el cache offline.";
    updateAppStatusPanel();
  }
}

async function init() {
  try {
    bootMetrics.startedAt = performance.now();
    document.body.classList.add("globe-loading");
    closeCountryModal();
    closeCompareModal?.();
    closeConflictModal?.();
    closeTimelineModal?.();
    closeHelpModal?.();
    closeIntroModal?.();
    closeProductModal?.();
    loadSavedPreferences();
    const shouldStartCollapsed = true;
    currentTheme = "default";
    applyAppMode(appMode, false);
    await measureBootStep("viewerBoot", async () => {
      initializeViewer();
      requestSceneRender();
    });
    const overlayLoadPromise = loadMap(true);
    const bootReadyPromise = measureBootStep("mapBootReady", () => waitForMapBootReady(isMobileLayout() ? 5200 : 4200));
    const dataLoadPromise = loadData()
      .then(() => {
        refreshLoadedCountryLayers();
        updateAppStatusPanel();
        return countriesData;
      })
      .catch(error => {
        console.error("No se pudo cargar el dataset principal en segundo plano:", error);
        if (typeof showToast === "function") {
          showToast("El globo cargo, pero el dataset completo no pudo hidratarse.");
        }
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
      openIntroModal();
      setTimeout(() => {
        if (viewer && activeImagerySignature.includes(":boot")) {
          applyImageryForMode(false);
          requestSceneRender();
        }
      }, isMobileLayout() ? 1800 : 1100);
      dataLoadPromise
        .then(() => scheduleDetailedOverlayUpgrade())
        .catch(() => {});
    }, 120);

    const bootDeferredUi = () => {
      measureBootStep("deferredUi", async () => {
        const safeUiTask = (name, task) => {
          try {
            task();
          } catch (error) {
            console.error(`No se pudo inicializar ${name}:`, error);
          }
        };

        dataLoadPromise
          .then(() => loadRuntimeCuration())
          .then(() => loadDeferredDataEnhancements())
          .catch(() => {});
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
        await registerServiceWorker();
        updateAppStatusPanel();
      });
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => bootDeferredUi(), { timeout: 900 });
    } else {
      setTimeout(() => bootDeferredUi(), 120);
    }

    setTimeout(() => {
      loadWikipediaConflictDetails().catch(error => {
        console.warn("No se pudieron aplicar los conflictos enriquecidos tras el arranque:", error);
      });
    }, isMobileLayout() ? 9000 : 6000);

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


