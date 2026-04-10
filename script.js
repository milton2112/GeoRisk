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
const {
  EXTRA_CONFLICT_DETAIL_OVERRIDES: curatedConflictDetailOverrides = {},
  EXTRA_CURATED_TIMELINE_EXTRAS: curatedTimelineExtras = {},
  EXTRA_TIMELINE_DETAIL_OVERRIDES: curatedTimelineDetailOverrides = {}
} = window.GeoRiskCuration || {};
const APP_VERSION = "2026-04-07-3d-upgrade";

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
    judaísmo: "#cdb4db",
    judaismo: "#cdb4db",
    sijismo: "#ffd166",
    sintoísmo: "#43aa8b",
    sintoismo: "#43aa8b",
    zoroastrismo: "#bc6c25",
    animismo: "#6a994e",
    "no afiliados": "#8d99ae",
    vudú: "#b56576",
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

function cssColorToCesiumColor(cssColor, alpha = 1) {
  return Cesium.Color.fromCssColorString(cssColor).withAlpha(alpha);
}

class CesiumCountryLayer {
  constructor(code, entities = [], featureName = "") {
    this.code = code;
    this.entities = entities;
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
        entity.polygon.outline = true;
        entity.polygon.outlineColor = cssColorToCesiumColor(style.color, 1);
      }
      if (!entity.polyline && entity.polygon) {
        const hierarchy = entity.polygon.hierarchy?.getValue?.(Cesium.JulianDate.now());
        const positions = hierarchy?.positions || [];
        if (positions.length > 2) {
          entity.polyline = new Cesium.PolylineGraphics({
            positions: [...positions, positions[0]],
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
  return !isConstrainedDevice() && !isCameraNavigating && currentMapMode !== "2d" && qualityPreset !== "performance";
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

const osmImageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  credit: "© OpenStreetMap contributors"
});

const satelliteImageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community"
});

const satelliteImageryProvider2D = new Cesium.UrlTemplateImageryProvider({
  url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  maximumLevel: 9
});

let activeGeoJsonDataSource = null;
let activeClickHandler = null;
let mapSearchAliasesRegistered = false;

function applyImageryForMode() {
  if (!viewer) {
    return;
  }

  viewer.imageryLayers.removeAll();
  try {
    viewer.imageryLayers.addImageryProvider(currentMapMode === "2d" ? satelliteImageryProvider2D : satelliteImageryProvider);
  } catch (error) {
    console.error("No se pudo aplicar la capa base del mapa:", error);
    try {
      viewer.imageryLayers.addImageryProvider(osmImageryProvider);
    } catch (fallbackError) {
      console.error("No se pudo cargar la capa base alternativa:", fallbackError);
    }
  }
}

async function getCachedGeoJson(path) {
  if (geoJsonCache.has(path)) {
    return geoJsonCache.get(path);
  }

  const geoJsonPromise = fetch(`${path}${path.includes("?") ? "&" : "?"}v=${APP_VERSION}`, { cache: "no-store" }).then(async response => {
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${path}: ${response.status}`);
    }
    return response.json();
  });

  geoJsonCache.set(path, geoJsonPromise);
  return geoJsonPromise;
}

function roundCoordinateValue(value, precision = 3) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function simplifyCoordinatesFor2D(coordinates) {
  if (!Array.isArray(coordinates)) {
    return coordinates;
  }
  if (typeof coordinates[0] === "number") {
    return [
      roundCoordinateValue(coordinates[0], 3),
      roundCoordinateValue(coordinates[1], 3)
    ];
  }
  return coordinates
    .map(simplifyCoordinatesFor2D)
    .filter(Boolean);
}

function buildPreparedGeoJsonFor2D(rawGeoJson) {
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
            coordinates: simplifyCoordinatesFor2D(feature.geometry.coordinates)
          }
        : null
    }))
  };
}

async function getPreparedGeoJson(path) {
  const cacheKey = `${path}::${currentMapMode}`;
  if (preparedGeoJsonCache.has(cacheKey)) {
    return preparedGeoJsonCache.get(cacheKey);
  }
  const raw = await getCachedGeoJson(path);
  const prepared = currentMapMode === "2d" ? buildPreparedGeoJsonFor2D(raw) : raw;
  preparedGeoJsonCache.set(cacheKey, prepared);
  return prepared;
}

function trimDataCaches() {
  const tier = getDeviceTier();
  if (tier === "high") {
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
const newsCache = new Map();
const geoJsonCache = new Map();
const preparedGeoJsonCache = new Map();
const conflictModalRegistry = new Map();
let conflictModalCounter = 0;
const timelineModalRegistry = new Map();
let timelineModalCounter = 0;
let activeNewsCountryCode = "";
let loadDataPromise = null;
let deferredGlobalStatsTimer = null;
let deferredGlobalStatsReady = false;

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

const CONFLICT_PARENT_RULES = [
  { parent: "Guerra de las Malvinas", matches: ["goose green", "pradera del ganso", "san carlos", "wireless ridge", "harriet", "longdon", "tumbledown"] },
  { parent: "Guerra de la Triple Alianza", matches: ["ita ybate"] },
  { parent: "Guerra rusoucraniana", matches: ["bajmut", "avdiivka", "mariupol", "jersón", "kherson", "kiev", "kyiv"] },
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
  "Guerra rusoucraniana": {
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
    { year: 1923, category: "politica", text: "Proclamacion de la Republica de Turquía", reference: "Republica de Turquía" },
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
    detail: "La absorción de la RDA por la RFA en 1990 cerró una de las divisiones emblemáticas de la Guerra fría y redefinió el mapa europeo.",
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

  map.scene = viewer.scene;
  map.camera = viewer.camera;

  applyImageryForMode();
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
    ? (isMobileLayout() ? 0.08 : 0.14)
    : (isMobileLayout() ? 0.58 : 0.8);
  viewer.scene.screenSpaceCameraController.inertiaZoom = currentMapMode === "2d"
    ? (isMobileLayout() ? 0.08 : 0.14)
    : (isMobileLayout() ? 0.5 : 0.68);
  viewer.scene.screenSpaceCameraController.enableRotate = currentMapMode !== "2d";
  viewer.scene.screenSpaceCameraController.enableTranslate = true;
  viewer.scene.screenSpaceCameraController.enableZoom = true;
  viewer.scene.screenSpaceCameraController.maximumMovementRatio = currentMapMode === "2d"
    ? (isMobileLayout() ? 0.08 : 0.11)
    : 0.18;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = currentMapMode === "2d"
    ? Number.POSITIVE_INFINITY
    : getMaxGlobeDistance();
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = currentMapMode === "2d" ? 1 : 850000;
  viewer.scene.requestRenderMode = true;
  viewer.scene.maximumRenderTimeChange = currentMapMode === "2d" ? 0.08 : 0.35;
  viewer.scene.skyAtmosphere.show = qualityPreset === "high" && currentMapMode === "3d" && !document.body.classList.contains("presentation-mode");
  viewer.scene.globe.showGroundAtmosphere = qualityPreset === "high" && currentMapMode === "3d" && !document.body.classList.contains("presentation-mode");
  lastOverlayBucket = getCurrentOverlayBucket();
  viewer.scene.requestRender();
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
let searchHistory = [];
let savedSearches = [];
let compareBenchmarkMode = "world";
let activeNewsTopic = "general";
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
  helpSeen: "geo-risk-help-seen",
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
const SYMBOL_IMAGE_CODES = new Set(["ARG", "BRA", "USA", "CHN", "GBR", "FRA", "DEU", "IND"]);
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
    aliases: ["hinduismo", "hindues", "hindúes", "hindú", "hindues"],
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
    aliases: ["ateos", "ateo", "agnosticos", "agnóstico", "agnostico", "sin religion", "sin religión", "sin afiliacion", "sin afiliación", "no afiliados", "no creyentes"],
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

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "Sin datos";
  }

  return Number(value).toLocaleString("es-AR");
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
    .replace(/[%~≈]/g, "")
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

function normalizeText(value) {
  return String(value || "")
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
  return String(value || "")
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

function getFlagEmojiLegacy(code) {
  const fallbackFlags = {
    "CS-KM": "🇽🇰",
    "-99": "🏴",
    ATA: "🇦🇶"
  };

  if (!code) {
    return "🏳️";
  }

  if (fallbackFlags[code]) {
    return fallbackFlags[code];
  }

  const normalized = code.slice(0, 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return "🏳️";
  }

  return String.fromCodePoint(
    ...[...normalized].map(char => 127397 + char.charCodeAt(0))
  );
}

function renderList(items) {
  if (!items || !items.length) {
    return "<p>Sin datos</p>";
  }

  return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
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
    return "🏴";
  }

  const normalized = (iso2ByCode[code] || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return "🏳️";
  }

  return String.fromCodePoint(
    ...[...normalized].map(char => 127397 + char.charCodeAt(0))
  );
}

function renderFlagVisual(code, label, className = "country-flag") {
  const emoji = getFlagEmoji(code);
  if (SYMBOL_IMAGE_CODES.has(code)) {
    return `
      <span class="${className}">
        <img class="flag-image" src="./assets/flags/${code}.svg" alt="${escapeHtml(label || code)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">
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

function renderCoatVisual(code, label) {
  if (!COAT_IMAGE_CODES.has(code)) {
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
      <img class="coat-image" src="./assets/coats/${code}.svg" alt="${escapeHtml(label || code)}" onerror="this.parentElement.hidden=true;">
    </div>
  `;
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
    region: item.contextLabel || contextLabel || "",
    detail: override.detail || item.text,
    significance: override.significance || (currentLanguage === "en" ? "Contextual event within the selected timeline." : "Evento contextual dentro del timeline seleccionado."),
    reference: item.reference || item.text
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
  const modalIds = ["country-modal", "compare-modal", "conflict-modal", "timeline-modal", "help-modal"];
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
    .replace(/\s*\((?:\d{3,4})(?:[-–]\d{3,4})?\)\s*$/u, "")
    .replace(/\s+\d{4}$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function translateConflictName(name) {
  let translated = cleanConflictName(name);

  const aliases = [
    [/^Guerra de Malvinas$/i, "Guerra de las Malvinas"],
    [/^Falklands War$/i, "Guerra de las Malvinas"],
    [/^Guerra de Falklands$/i, "Guerra de las Malvinas"],
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
    [/^Kivu conflict$/i, "Guerra de Kivu"]
  ];

  for (const [pattern, replacement] of aliases) {
    if (pattern.test(translated)) {
      return replacement;
    }
  }

  const replacements = [
    [/^\d{4}\s+/i, ""],
    [/^Battle of /i, "Batalla de "],
    [/^Second Battle of /i, "Segunda batalla de "],
    [/^Third Battle of /i, "Tercera batalla de "],
    [/^First Battle of /i, "Primera batalla de "],
    [/^Action of /i, "Accion de "],
    [/^Actions of /i, "Acciones de "],
    [/^Raid off /i, "Incursion frente a "],
    [/^Raid on /i, "Incursion sobre "],
    [/^Offensive of /i, "Ofensiva de "],
    [/^Offensive in /i, "Ofensiva en "],
    [/^Clash of /i, "Enfrentamiento de "],
    [/^Clashes in /i, "Enfrentamientos en "],
    [/^Clashes of /i, "Enfrentamientos de "],
    [/^Struggle for /i, "Lucha por "],
    [/^Naval battle off /i, "Batalla naval de "],
    [/^Siege of /i, "Sitio de "],
    [/^Operation /i, "Operacion "],
    [/^Campaign of /i, "Campana de "],
    [/^Campaign /i, "Campana "],
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
    [/^Airstrikes? in /i, "Ataques aereos en "]
  ];

  for (const [pattern, replacement] of replacements) {
    translated = translated.replace(pattern, replacement);
  }

  translated = translated
    .replace(/\bthe\b/gi, "")
    .replace(/\bof\b/gi, "de")
    .replace(/\bin\b/gi, "en")
    .replace(/\band\b/gi, "y")
    .replace(/\s+/g, " ")
    .trim();

  return translated.charAt(0).toUpperCase() + translated.slice(1);
}

function normalizeConflictForDisplayLegacy(conflict) {
  if (!conflict) {
    return null;
  }

  const name = translateConflictName(conflict.name || conflict);
  const startYear = conflict.startYear ?? extractConflictStartYear(conflict);
  const endYear = conflict.ongoing ? null : conflict.endYear ?? startYear ?? null;

  if (!name || !startYear) {
    return null;
  }

  return {
    name,
    startYear,
    endYear,
    ongoing: Boolean(conflict.ongoing && startYear)
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

  const endPart = conflict.ongoing ? "actualidad" : conflict.endYear ?? conflict.startYear;
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
    .replace(/\s+(?:de|en)?\s*\d{4}(?:\s*[-–—]\s*\d{4})?\s*$/u, "")
    .replace(/\s*[-–—]\s*\d{4}(?:\s*[-–—]\s*\d{4})?\s*$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeConflictForDisplay(conflict) {
  if (!conflict) {
    return null;
  }

  const rawName = conflict.name || conflict;
  const translatedName = translateConflictName(rawName);
  const startYear = conflict.startYear ?? extractConflictStartYear(conflict);
  const parsedEndYear = conflict.endYear ?? extractConflictEndYear(conflict);
  const endYear = conflict.ongoing ? null : parsedEndYear ?? startYear ?? null;
  const cleanedName = cleanConflictName(translatedName) || translatedName;

  if (!cleanedName) {
    return null;
  }

  return {
    name: cleanedName,
    startYear: startYear || null,
    endYear,
    ongoing: Boolean(conflict.ongoing && startYear)
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
  return match?.parent || null;
}

function inferConflictType(conflict, detail = {}) {
  const explicit = normalizeText(detail.type || "");
  if (explicit) {
    return explicit;
  }

  const normalized = normalizeText(conflict?.name || conflict || "");
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
  if (/malvinas|triple alianza|surinam|haiti|costarricense/.test(normalized)) {
    return "America Latina y el Caribe";
  }
  if (/yom kippur|seis dias|gaza|iran|iraq|siria|afganistan|kargil|china|india|corea|vietnam/.test(normalized)) {
    return "Asia y Medio Oriente";
  }
  if (/mundial|verdun|somme|marne|ypres|kosovo|espanola|ucran/.test(normalized)) {
    return "Europa";
  }
  if (/congo|kivu|sahara|sudan|etiop|eritrea/.test(normalized)) {
    return "Africa";
  }
  return countryName ? `${countryName} y su entorno regional` : "Region indeterminada";
}

function getConflictTypeLabel(type) {
  const labels = {
    "guerra mundial": currentLanguage === "en" ? "World war" : "Guerra mundial",
    "guerra interestatal": currentLanguage === "en" ? "Interstate war" : "Guerra interestatal",
    "conflicto interno": currentLanguage === "en" ? "Internal conflict" : "Conflicto interno",
    "intervencion u ocupacion": currentLanguage === "en" ? "Intervention or occupation" : "Intervencion u ocupacion"
  };
  return labels[type] || type || (currentLanguage === "en" ? "Conflict" : "Conflicto");
}

function getConflictScopeLabel(scope) {
  const labels = {
    global: currentLanguage === "en" ? "Global" : "Global",
    regional: currentLanguage === "en" ? "Regional" : "Regional",
    nacional: currentLanguage === "en" ? "Domestic" : "Nacional"
  };
  return labels[scope] || scope || (currentLanguage === "en" ? "Regional" : "Regional");
}

function buildConflictGroups(conflicts) {
  const cleanedConflicts = sortConflicts(
    conflicts
      .map(normalizeConflictForDisplay)
      .filter(Boolean)
      .filter(conflict => conflict.startYear)
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
      standalone.push(conflict);
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
      group = { ...warConflict, battles: [] };
      groupedWars.push(group);
    }

    if (normalizeText(conflict.name) !== normalizeText(parentName)) {
      group.battles.push(conflict);
    }
  });

  return [
    ...groupedWars.sort((a, b) => (a.startYear || 0) - (b.startYear || 0)),
    ...standalone.filter(conflict => !groupedWars.some(group => normalizeText(group.name) === normalizeText(conflict.name)))
  ];
}

function filterConflictGroups(groups, filter = "all") {
  if (filter === "all") {
    return groups;
  }

  return groups.filter(group => {
    const detail = CONFLICT_DETAIL_OVERRIDES[group.name] || {};
    const type = inferConflictType(group, detail);
    const scope = inferConflictScope(group, detail);

    if (filter === "ongoing") {
      return Boolean(group.ongoing);
    }
    if (filter === "historical") {
      return !group.ongoing;
    }
    if (filter === "global") {
      return scope === "global";
    }
    if (filter === "regional") {
      return scope === "regional";
    }
    if (filter === "internal") {
      return type === "conflicto interno";
    }
    if (filter === "interstate") {
      return type === "guerra interestatal" || type === "intervencion u ocupacion";
    }

    return true;
  });
}

function renderConflictFilters(groups) {
  const activeFilter =
    currentPanelState.type === "country"
      ? (currentPanelState.conflictFilter || "all")
      : "all";

  const options = [
    { key: "all", label: currentLanguage === "en" ? "All" : "Todos" },
    { key: "ongoing", label: currentLanguage === "en" ? "Ongoing" : "Vigentes" },
    { key: "historical", label: currentLanguage === "en" ? "Historical" : "Historicos" },
    { key: "interstate", label: currentLanguage === "en" ? "Interstate" : "Interestatales" },
    { key: "internal", label: currentLanguage === "en" ? "Internal" : "Internos" },
    { key: "regional", label: currentLanguage === "en" ? "Regional" : "Regionales" },
    { key: "global", label: currentLanguage === "en" ? "Global" : "Globales" }
  ].filter(option => option.key === "all" || filterConflictGroups(groups, option.key).length > 0);

  return `
    <div class="timeline-filters conflict-filters">
      ${options.map(option => `
        <button
          type="button"
          class="timeline-filter${option.key === activeFilter ? " is-active" : ""}"
          data-conflict-filter="${option.key}"
        >${option.label}</button>
      `).join("")}
    </div>
  `;
}

function renderConflictOverview(groups, country) {
  const wars = groups.length;
  const battles = groups.reduce((sum, group) => sum + (group.battles?.length || 0), 0);
  const ongoing = groups.filter(group => group.ongoing).length;
  const global = groups.filter(group => inferConflictScope(group, CONFLICT_DETAIL_OVERRIDES[group.name] || {}) === "global").length;

  return `
    <div class="country-overview-grid relation-overview-grid conflict-overview-grid">
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Wars" : "Guerras"}</span><strong class="overview-value">${formatNumber(wars)}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Battles" : "Batallas"}</span><strong class="overview-value">${formatNumber(battles)}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Ongoing" : "Vigentes"}</span><strong class="overview-value">${formatNumber(ongoing)}</strong></div>
      <div class="overview-card"><span class="overview-label">${currentLanguage === "en" ? "Global wars" : "Guerras globales"}</span><strong class="overview-value">${formatNumber(global)}</strong></div>
    </div>
    <p class="data-source-note"><b>${currentLanguage === "en" ? "Regional focus" : "Foco regional"}:</b> ${escapeHtml(translateContinentName(country?.continent || "Unknown"))}</p>
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

function getConflictModalContent(conflict, countryName = "") {
  const detail = CONFLICT_DETAIL_OVERRIDES[conflict.name] || {};
  const type = inferConflictType(conflict, detail);
  const scope = inferConflictScope(conflict, detail);
  const region = inferConflictRegion(conflict, detail, countryName);
  return {
    title: `${conflict.name}${formatConflictPeriod(conflict)}`,
    type,
    scope,
    region,
    cause: detail.cause || "Sin datos detallados sobre el detonante inmediato del conflicto.",
    participants: detail.participants || [
      {
        side: "Participantes identificados",
        members: countryName ? [countryName] : ["Sin datos"],
        organizations: [],
        troops: "Sin datos",
        casualties: "Sin datos"
      }
    ],
    chronology: Array.isArray(detail.chronology) ? detail.chronology : [],
    related: Array.isArray(detail.related) ? detail.related : [],
    outcome: detail.outcome || "Sin datos detallados sobre la resolucion del conflicto.",
    consequences: detail.consequences || "Sin datos detallados sobre cambios territoriales, politicos o militares."
  };
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
    currentPanelState.type === "country" ? (currentPanelState.conflictFilter || "all") : "all"
  );

  if (!filteredConflicts.length) {
    return "<p>Sin datos</p>";
  }

  return `${renderConflictFilters(groupedConflicts)}<ul class="conflict-tree">${filteredConflicts
    .map(conflict => {
      const modalKey = registerConflictModal(conflict, currentPanelState?.code ? countriesData[currentPanelState.code]?.name : "");
      const battles = (conflict.battles || []).sort((a, b) => (a.startYear || 0) - (b.startYear || 0));
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
          <strong>${escapeHtml(item.side)}</strong>
          <p><b>${currentLanguage === "en" ? "States" : "Paises"}:</b> ${escapeHtml((item.members || ["Sin datos"]).join(", "))}</p>
          <p><b>${currentLanguage === "en" ? "Organizations" : "Organizaciones"}:</b> ${escapeHtml((item.organizations && item.organizations.length ? item.organizations : ["Sin datos"]).join(", "))}</p>
          <p><b>${currentLanguage === "en" ? "Troops" : "Soldados"}:</b> ${escapeHtml(item.troops || "Sin datos")}</p>
          <p><b>${currentLanguage === "en" ? "Casualties" : "Bajas"}:</b> ${escapeHtml(item.casualties || "Sin datos")}</p>
        </div>
      `).join("")}
    </div>
    ${detail.chronology?.length ? `
      <div class="conflict-modal-section">
        <h4>${currentLanguage === "en" ? "Internal chronology" : "Cronologia interna"}</h4>
        <ul class="data-source-list">
          ${detail.chronology.map(item => `<li><b>${escapeHtml(String(item.year || ""))}</b> · ${escapeHtml(item.text || item)}</li>`).join("")}
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

function getLinkedCodes(code) {
  return [code, ...(TERRITORY_LINKS[code] || [])];
}

function resolveCountryCode(rawCode, rawName = "") {
  if (rawCode && countriesData[rawCode]) {
    return rawCode;
  }

  const normalizedName = normalizeText(rawName);
  if (normalizedName && countryAliases.has(normalizedName)) {
    const aliasCode = countryAliases.get(normalizedName);
    if (aliasCode && countriesData[aliasCode]) {
      return aliasCode;
    }
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

  clearSelection();
  selectionMode = "country";
  layerList.forEach(layer => layer.setStyle(COUNTRY_HIGHLIGHT_STYLE));
  selectedLayers = layerList;
  selectedLayer = layerList[0] || null;
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

  clearSelection();
  selectionMode = "continent";
  selectedLayers = layers;
  selectedLayers.forEach(layer => layer.setStyle(CONTINENT_HIGHLIGHT_STYLE));

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
  const timelineFilter =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.timelineFilter || "all")
      : "all";
  const timelineCentury =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.timelineCentury || "all")
      : "all";
  const timelineIntensity =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.timelineIntensity || "all")
      : "all";
  const conflictFilter =
    currentPanelState.type === "country" && currentPanelState.code === countryCode
      ? (currentPanelState.conflictFilter || "all")
      : "all";
  currentPanelState = { type: "country", code: countryCode, fallbackName, timelineFilter, timelineCentury, timelineIntensity, conflictFilter };
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
  const conflictsLabel = history.year
    ? "Conflictos desde su año de formación:"
    : "Conflictos registrados:";

  document.getElementById("country-panel").innerHTML = `
    <div class="country-title">
      ${renderFlagVisual(countryCode, country.name || fallbackName, "country-flag")}
      <div class="country-heading">
        <h2>${country.name || fallbackName}</h2>
        <p class="country-official-name">${escapeHtml(country.general?.officialName || country.name || fallbackName)}</p>
      </div>
      ${renderCoatVisual(countryCode, `${country.name || fallbackName} escudo`)}
    </div>
    <div class="panel-actions-row">
      <button id="add-to-compare-button" class="panel-action-button" type="button" ${countryCode ? "" : "disabled"}>${t("addToCompare")}</button>
      <button class="panel-action-button" type="button" data-export-target="country-panel" data-export-format="png">${currentLanguage === "en" ? "Export image" : "Exportar imagen"}</button>
      <button class="panel-action-button" type="button" data-export-target="country-panel" data-export-format="pdf">${currentLanguage === "en" ? "Export PDF" : "Exportar PDF"}</button>
      <button class="panel-action-button" type="button" data-share-country="${escapeHtml(countryCode)}">${currentLanguage === "en" ? "Share" : "Compartir"}</button>
    </div>
    ${renderCountryOverview(country, countryCode)}
    ${renderCountryMetaRibbon(country, conflictGroups)}
    ${renderCountryQuickNav([
      { id: "country-section-general", label: t("general") },
      { id: "country-section-history", label: t("history") },
      { id: "country-section-economy", label: t("economy") },
      { id: "country-section-military", label: t("military") },
      { id: "country-section-politics", label: t("politics") },
      { id: "country-section-relations", label: t("relations") },
      { id: "country-section-religion", label: t("religion") },
      { id: "country-section-sources", label: currentLanguage === "en" ? "Sources" : "Fuentes" }
    ])}
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
        <p><b>${currentLanguage === "en" ? "Flag" : "Bandera"}:</b> ${escapeHtml(general.symbols?.flagDescription || t("noData"))}</p>
        <p><b>${currentLanguage === "en" ? "Coat of arms" : "Escudo"}:</b> ${escapeHtml(general.symbols?.coatOfArms || t("noData"))}</p>
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
      `${renderReligion(country.religion)}`,
      false,
      "country-section-religion"
    )}
    ${createSection(
      currentLanguage === "en" ? "Sources and quality" : "Fuentes y calidad",
      `${renderDataQuality(country)}`,
      false,
      "country-section-sources"
    )}
  `;

  renderNewsHub(countryCode);

  const compareButton = document.getElementById("add-to-compare-button");
  if (compareButton && countryCode) {
    compareButton.addEventListener("click", () => addCountryToCompare(countryCode));
  }

  openCountryModal();
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
  currentPanelState = { type: "continent", continent, countries, timelineFilter, timelineCentury, timelineIntensity };
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

  openCountryModal();
}

function renderEmpty(name) {
  currentPanelState = { type: "empty", name };
  document.getElementById("country-panel").innerHTML = `
    <h2>${name}</h2>
    <p>Sin datos</p>
  `;

  renderNewsHub();

  openCountryModal();
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
  const datasetChip = document.getElementById("dataset-health-chip");

  if (renderChip) {
    const fpsSuffix = typeof extra.fps === "number"
      ? ` · ${Math.round(extra.fps)} FPS`
      : "";
    renderChip.innerHTML = `<strong>${currentLanguage === "en" ? "Render" : "Render"}:</strong> ${escapeHtml(getRenderProfileLabel())}${fpsSuffix}`;
  }

  if (datasetChip) {
    datasetChip.innerHTML = `<strong>${currentLanguage === "en" ? "Dataset" : "Dataset"}:</strong> ${currentLanguage === "en" ? "validated and curated" : "validado y curado"}`;
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
  const sectionStatus = country.metadata?.quality?.sectionStatus || {};

  const sourceSections = [
    { key: "general", label: currentLanguage === "en" ? "General" : "General" },
    { key: "history", label: currentLanguage === "en" ? "History" : "Historia" },
    { key: "economy", label: currentLanguage === "en" ? "Economy" : "Economia" },
    { key: "military", label: currentLanguage === "en" ? "Military" : "Militar" },
    { key: "politics", label: currentLanguage === "en" ? "Politics" : "Politica" },
    { key: "religion", label: currentLanguage === "en" ? "Religion" : "Religion" }
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
    </div>
    <p class="data-source-note"><b>${currentLanguage === "en" ? "Validation" : "Validacion"}:</b> ${currentLanguage === "en" ? "local dataset checks currently pass without reported issues" : "los chequeos locales del dataset estan pasando sin incidencias reportadas"}</p>
    <p class="data-source-note"><b>${currentLanguage === "en" ? "Dataset updated" : "Dataset actualizado"}:</b> ${escapeHtml(country.metadata?.updatedAt || "2026-04-06")}</p>
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
    <p><b>${currentLanguage === "en" ? "Estimated fields" : "Campos estimados"}:</b> ${estimatedFields.length ? escapeHtml(estimatedFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
    <p><b>${currentLanguage === "en" ? "Curated fields" : "Campos curados"}:</b> ${curatedFields.length ? escapeHtml(curatedFields.join(", ")) : (currentLanguage === "en" ? "none" : "ninguno")}</p>
  `;
}

function registerCountryAlias(alias, value) {
  const normalizedAlias = normalizeText(alias);

  if (!normalizedAlias) {
    return;
  }

  countryAliases.set(normalizedAlias, value);
}

function registerFeatureNameAliases(featureNameByCode = {}) {
  Object.entries(featureNameByCode).forEach(([code, featureName]) => {
    if (!featureName || !countriesData[code]) {
      return;
    }

    registerCountryAlias(featureName, code);
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

  return adapt(DEFAULT_STYLE);
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

function getCountryNewsUrl(country) {
  const topicUrls = getCountryNewsTopics(country);
  return topicUrls[activeNewsTopic] || topicUrls.general;
}

function getCountryNewsPortalLinks(country) {
  const baseQuery = encodeURIComponent(country.general?.officialName || country.name);
  return [
    { label: "Google News", url: getCountryNewsUrl(country) },
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

async function fetchCountryHeadline(country) {
  if (!country?.code) {
    return null;
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

  const queries = buildNewsQueries(country);
  for (const query of queries) {
    try {
      const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=ArtList&maxrecords=1&format=json&sort=HybridRel`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        continue;
      }

      const payload = await response.json();
      const article = payload?.articles?.[0];
      if (!article) {
        continue;
      }

      const item = {
        title: article.title || fallback.title,
        source: article.sourceCommonName || article.domain || fallback.source,
        date: article.seendate ? formatNewsDate(article.seendate) : "",
        summary: article.socialimage
          ? `Cobertura destacada detectada sobre ${country.name}. Abrila para ver el desarrollo completo.`
          : `Noticia reciente vinculada a ${country.name}.`,
        url: article.url || fallback.url
      };
      newsCache.set(country.code, item);
      return item;
    } catch (error) {
      console.error(`No se pudo cargar la noticia para ${country.name}:`, error);
    }
  }

  newsCache.set(country.code, fallback);
  return fallback;
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
  updateAppStatusPanel();
}

function startPerformanceMonitor() {
  if (performanceMonitorId || !viewer || typeof requestAnimationFrame !== "function") return;
  let frameCount = 0;
  let lastCheck = performance.now();
  const tick = now => {
    frameCount += 1;
    if (now - lastCheck >= 2500) {
      const fps = (frameCount * 1000) / (now - lastCheck);
      const tier = getDeviceTier();
      const lowFpsThreshold = isMobileLayout() ? 18 : tier === "low" ? 15 : tier === "medium" ? 18 : 20;
      const highFpsThreshold = isMobileLayout() ? 28 : tier === "low" ? 24 : tier === "medium" ? 30 : 34;
      if (qualityPreset === "auto" && fps < lowFpsThreshold) {
        viewer.resolutionScale = Math.max(
          currentMapMode === "2d"
            ? (isMobileLayout() ? 0.42 : tier === "low" ? 0.58 : 0.68)
            : (isMobileLayout() ? 0.74 : tier === "low" ? 0.86 : 0.94),
          viewer.resolutionScale - (isMobileLayout() ? 0.06 : 0.04)
        );
        viewer.scene.globe.maximumScreenSpaceError = Math.min(currentMapMode === "2d" ? 12.5 : 9.2, viewer.scene.globe.maximumScreenSpaceError + 0.45);
        viewer.scene.globe.loadingDescendantLimit = Math.max(currentMapMode === "2d" ? 2 : 5, viewer.scene.globe.loadingDescendantLimit - 1);
        viewer.scene.globe.tileCacheSize = Math.max(currentMapMode === "2d" ? 24 : 60, viewer.scene.globe.tileCacheSize - 14);
      } else if (qualityPreset === "auto" && fps > highFpsThreshold) {
        const preset = getPerformancePreset();
        viewer.resolutionScale = Math.min(preset.resolutionScale, viewer.resolutionScale + 0.03);
        viewer.scene.globe.maximumScreenSpaceError = Math.max(preset.maximumScreenSpaceError, viewer.scene.globe.maximumScreenSpaceError - 0.2);
        viewer.scene.globe.loadingDescendantLimit = Math.min(preset.loadingDescendantLimit, viewer.scene.globe.loadingDescendantLimit + 1);
        viewer.scene.globe.tileCacheSize = Math.min(preset.tileCacheSize, viewer.scene.globe.tileCacheSize + 12);
      }
      updateAppStatusPanel({ fps });
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
  const article = await fetchCountryHeadline(country);
  renderNewsArticle(article, country);
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
  currentPanelState = { type: "group", title, descriptor, countries, timelineFilter, timelineCentury, timelineIntensity };
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
      intensity: item.intensity || getTimelineIntensity(item)
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
      text: label ? `${country.name}: ${item.text}` : item.text
    })))
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
    )
    .slice(0, 24);
}

function filterTimelineItems(items) {
  const activeType = currentPanelState.timelineFilter || "all";
  const activeCentury = currentPanelState.timelineCentury || "all";
  const activeIntensity = currentPanelState.timelineIntensity || "all";

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
    return true;
  });
}

function renderTimelineControls(items) {
  const activeType = currentPanelState.timelineFilter || "all";
  const activeCentury = currentPanelState.timelineCentury || "all";
  const activeIntensity = currentPanelState.timelineIntensity || "all";

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
  `;
}

function renderTimelineCollection(items, contextCountry = null) {
  const controls = renderTimelineControls(items);
  const filtered = filterTimelineItems(items);

  if (!filtered.length) {
    return `${controls}<p>${t("noData")}</p>`;
  }

  return `${controls}<div class="timeline">${filtered
    .map(item => {
      const modalKey = registerTimelineModal(item, item.contextLabel || contextCountry?.name || "");
      const query = contextCountry ? getTimelineEventQuery(item, contextCountry) : (item.reference || item.text);
      return `
        <button class="timeline-item network-link" type="button" data-timeline-key="${modalKey}" data-timeline-query="${escapeHtml(query)}" style="--accent:${getTimelineCategoryAccent(item.categoryKey)};">
          <span class="timeline-year">${item.year}</span>
          <span class="timeline-copy">
            <span class="timeline-kicker">${escapeHtml(item.category || (currentLanguage === "en" ? "Event" : "Evento"))} · ${escapeHtml(item.century || "")} · ${escapeHtml(getTimelineIntensityLabel(item.intensity))}</span>
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
  document.getElementById("top-population-title").textContent = currentLanguage === "en" ? "Top population" : "Top Población";
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
  document.getElementById("metropoles-top-title").textContent = currentLanguage === "en" ? "Former metropoles" : "Ex metrópolis";
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

function rerenderCurrentPanel() {
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

    const storedSearchHistory = localStorage.getItem(STORAGE_KEYS.searchHistory);
    if (storedSearchHistory) {
      searchHistory = JSON.parse(storedSearchHistory);
    }

    const storedSavedSearches = localStorage.getItem(STORAGE_KEYS.savedSearches);
    if (storedSavedSearches) {
      savedSearches = JSON.parse(storedSavedSearches);
    }

    const presentation = localStorage.getItem(STORAGE_KEYS.presentation) === "true";
    document.body.classList.toggle("presentation-mode", presentation);
  } catch (error) {
    savedFilters = [];
    savedViews = [];
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

function renderSavedViews() {
  const select = document.getElementById("saved-views-select");
  if (!select) {
    return;
  }

  select.innerHTML = `<option value="">${currentLanguage === "en" ? "Saved views" : "Vistas guardadas"}</option>${savedViews
    .map((item, index) => `<option value="${index}">${escapeHtml(item.name)}</option>`)
    .join("")}`;
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
  const helpButton = document.getElementById("open-help-button");
  const helpModal = document.getElementById("help-modal");
  const helpClose = document.getElementById("help-modal-close");

  renderSavedViews();

  saveButton?.addEventListener("click", () => {
    const view = getCurrentViewState();
    if (!view.name) {
      view.name = currentLanguage === "en" ? "Saved view" : "Vista guardada";
    }
    savedViews.unshift(view);
    savedViews = savedViews.slice(0, 10);
    persistSavedViews();
    renderSavedViews();
  });

  select?.addEventListener("change", async event => {
    const selected = savedViews[Number(event.target.value)];
    if (!selected) {
      return;
    }
    await applySavedView(selected);
  });

  helpButton?.addEventListener("click", () => openHelpModal());
  helpClose?.addEventListener("click", () => closeHelpModal());
  helpModal?.addEventListener("click", event => {
    if (event.target.closest("[data-close-help-modal='true']")) {
      closeHelpModal();
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
      currentMapMode.toUpperCase()
    ].filter(Boolean).join(" / "),
    theme: currentTheme,
    mapMode: currentMapMode,
    filters: getFilterState(),
    panelState: currentPanelState,
    selectedCode: currentPanelState.code || ""
  };
}

async function applySavedView(view) {
  if (!view) {
    return;
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

function sanitizeCountryData(country) {
  const populationFallback =
    country.general?.population ||
    country.general?.capital?.population ||
    (country.general?.cities || []).reduce((sum, city) => sum + (city.population || 0), 0) ||
    1;

  if (!country.general) {
    country.general = {};
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
    registerCountryAlias(country.name, code);
    registerCountryAlias(featureNameByCode[code], code);
    registerCountryAlias(code, code);
    registerCountryAlias(country.general?.officialName, code);
    (country.general?.historicalNames || []).forEach(alias => registerCountryAlias(alias, code));
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

  const continentNameMap = {
    america: "America",
    américa: "America",
    americas: "America",
    américas: "America",
    asia: "Asia",
    europa: "Europe",
    europe: "Europe",
    africa: "Africa",
    oceania: "Oceania",
    oceania: "Oceania",
    antartida: "Antarctica",
    antártida: "Antarctica",
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

function getGeoJsonPathForCurrentMode() {
  if (currentMapMode === "2d") {
    return "./data/world_countries_simplified.geo.json";
  }
  return isMobileLayout()
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
      renderNewsHub(currentPanelState.code || "");
      renderQuizPanel();
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

async function loadData() {
  if (loadDataPromise) {
    return loadDataPromise;
  }

  loadDataPromise = (async () => {
  const [countriesRes, rawPoliticsRes, rawHistoryRes, rawInflationRes, rawPopulationSeriesRes] = await Promise.all([
    fetch(`./data/countries_full.json?v=${APP_VERSION}`, { cache: "no-store" }),
    fetch(`./data/raw/politics.json?v=${APP_VERSION}`, { cache: "no-store" }),
    fetch(`./data/raw/history.json?v=${APP_VERSION}`, { cache: "no-store" }),
    fetch(`./data/raw/inflation.json?v=${APP_VERSION}`, { cache: "no-store" }),
    fetch(`./data/raw/population.csv?v=${APP_VERSION}`, { cache: "no-store" })
  ]);

  [countriesRes, rawPoliticsRes, rawHistoryRes, rawInflationRes, rawPopulationSeriesRes].forEach(response => {
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${response.url} (${response.status})`);
    }
  });

  countriesData = await countriesRes.json();
  rawPoliticsSystems = await rawPoliticsRes.json();
  rawHistorySystems = await rawHistoryRes.json();
  rawInflationByCode = await rawInflationRes.json();
  populationGrowthByCode = parseWorldBankSeriesChanges(await rawPopulationSeriesRes.text());
  buildInflationFallbacks();

  Object.entries(countriesData).forEach(([code, country]) => {
    country.code = code;
    countryCodeLookup.set(country, code);
    sanitizeCountryData(country);
  });
  setupSearchIndex(
    Object.fromEntries(
      Object.entries(countriesData).map(([code, country]) => [code, country.name])
    )
  );
  mapSearchAliasesRegistered = true;
  worldPopulationTotal = Object.values(countriesData).reduce(
    (sum, country) => sum + (country.general?.population || 0),
    0
  );

  runCriticalGlobalStats();
  scheduleDeferredGlobalStats(true);
  })();

  return loadDataPromise;
}

function refreshGlobalStats() {
  runCriticalGlobalStats();
  scheduleDeferredGlobalStats(true);
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

async function loadMap() {
  countryAreaCache = {};
  initializeViewer();
  const geoJsonPath = getGeoJsonPathForCurrentMode();
  trimDataCaches();
  if (activeClickHandler) {
    activeClickHandler.destroy();
    activeClickHandler = null;
  }
  if (activeGeoJsonDataSource) {
    try {
      await viewer.dataSources.remove(activeGeoJsonDataSource, true);
    } catch (error) {
      console.error("No se pudo limpiar la capa GeoJSON anterior:", error);
    }
    activeGeoJsonDataSource = null;
  }
  countryLayers.clear();
  countryClickTargets.clear();
  const geojson = await getPreparedGeoJson(geoJsonPath);
  const featureNameByCode = {};
  let dataSource = null;

  try {
    dataSource = await Cesium.GeoJsonDataSource.load(geojson, {
      clampToGround: false
    });
    await viewer.dataSources.add(dataSource);
    activeGeoJsonDataSource = dataSource;
  } catch (error) {
    console.error("No se pudo cargar el GeoJSON 3D:", error);
    fitWorldView();
    return;
  }

  const entitiesByCode = new Map();
  dataSource.entities.values.forEach(entity => {
    const properties = entity.properties;
    const rawCode =
      properties?.ISO_A3?.getValue?.() ||
      properties?.iso_a3?.getValue?.() ||
      properties?.ADM0_A3?.getValue?.() ||
      entity.id;
    const featureName = properties?.name?.getValue?.() || rawCode;
    const code = resolveCountryCode(rawCode, featureName) || rawCode;

    if (!code) {
      return;
    }

    registerCountryAlias(featureName, code);
    featureNameByCode[code] = countriesData[code]?.name || featureName;
    entity.countryCode = code;
    entity.countryName = countriesData[code]?.name || featureName;
    if (entity.polygon) {
      entity.polygon.height = 0;
      entity.polygon.perPositionHeight = false;
      entity.polygon.outline = false;
      entity.polygon.arcType = Cesium.ArcType.GEODESIC;
      if (currentMapMode === "2d") {
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
      viewer.scene.requestRender();
      return;
    }

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
        viewer.scene.requestRender();
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
        viewer.scene.requestRender();
      });
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  registerFeatureNameAliases(featureNameByCode);
  fitWorldView();
  renderMapLabels();
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
    refreshGlobalStats();
    renderThemeLegend();
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
    const enabled = !document.body.classList.contains("presentation-mode");
    document.body.classList.toggle("presentation-mode", enabled);
    localStorage.setItem(STORAGE_KEYS.presentation, String(enabled));
    updateStaticText();
    closeMobilePanels();
    update3DPresentationState();
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
    return Boolean(country.politics?.system);
  });

  if (!pool.length) return null;
  const [code, country] = shuffleArray(pool)[0];
  const difficulty = quizState.difficulty || "easy";
  let prompt = "";
  let correct = "";
  let distractors = [];

  if (category === "capital") {
    prompt = `Â¿Cual es la capital de ${country.name}?`;
    correct = country.general.capital.name;
    distractors = shuffleArray(Object.values(countriesData)
      .filter(item => difficulty === "easy" || item.continent === country.continent)
      .map(item => item.general?.capital?.name).filter(Boolean).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "religion") {
    prompt = `Â¿Cual es la religion mayoritaria de ${country.name}?`;
    correct = getReligionSummaryLabel(country.religion) || "Sin datos";
    distractors = shuffleArray(Object.values(countriesData).map(item => getReligionSummaryLabel(item.religion)).filter(Boolean).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "continent") {
    prompt = `Â¿En que continente se ubica ${country.name}?`;
    correct = translateContinentName(country.continent);
    distractors = shuffleArray(["America", "Europa", "Asia", "Africa", "Oceania", "Antartida"].filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "flag") {
    prompt = `Â¿A que pais corresponde esta bandera? ${getFlagEmoji(code)}`;
    correct = country.name;
    distractors = shuffleArray(Object.values(countriesData).filter(item => difficulty === "easy" || item.continent === country.continent).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "history") {
    prompt = `Â¿En que aÃ±o se formo ${country.name}?`;
    correct = String(country.history.year);
    distractors = shuffleArray(Object.values(countriesData).map(item => item.history?.year).filter(Boolean).map(String).filter(value => value !== correct)).slice(0, 3);
  } else if (category === "organization") {
    const org = getOrganizationDisplayName(country.politics.organizations[0]);
    prompt = `Â¿Que pais pertenece a esta organizacion? ${org}`;
    correct = country.name;
    distractors = shuffleArray(Object.values(countriesData).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else if (category === "rival") {
    const rival = country.politics.rivals[0]?.name || country.politics.rivals[0];
    prompt = `Â¿Que pais tiene como rival a ${rival}?`;
    correct = country.name;
    distractors = shuffleArray(Object.values(countriesData).map(item => item.name).filter(name => normalizeText(name) !== normalizeText(correct))).slice(0, 3);
  } else {
    prompt = `Â¿Cual es el sistema politico principal de ${country.name}?`;
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
  status.textContent = quizState.total ? `Puntaje: ${quizState.score}/${quizState.total}` : "ElegÃ­ una categorÃ­a y empezÃ¡ el quiz.";
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
  const filters = { continent: "", religion: "", system: "", organization: "", historyType: "", origin: "", rival: "", minPopulation: 0 };

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
  if (!filters.organization && /\botan\b|nato/.test(normalized)) filters.organization = "OTAN";
  if (!filters.organization && /(union europea|ue\b|european union)/.test(normalized)) filters.organization = "Union Europea";
  if (!filters.organization && /(mercosur|mercosul)/.test(normalized)) filters.organization = "Mercosur";
  if (!filters.organization && /\bbrics\b/.test(normalized)) filters.organization = "BRICS";
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
  if (!filters.religion) {
    if (/\bislam|\bmusulman|\bsunita|\bchiita/.test(normalized)) filters.religion = "Islamismo";
    else if (/\bcristian|\bcatolic|\bprotest|\bortodox|\banglican/.test(normalized)) filters.religion = "Cristianismo";
    else if (/\bhindu/.test(normalized)) filters.religion = "Hinduismo";
    else if (/\bjudai|\bjew/.test(normalized)) filters.religion = "Judaismo";
    else if (/\bbudis/.test(normalized)) filters.religion = "Budismo";
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
  const score = Object.values(filters).filter(Boolean).length;
  return score >= 2 ? filters : null;
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
  if (!panel) {
    return;
  }

  panel.open = false;
  topicSelect?.addEventListener("change", () => {
    activeNewsTopic = topicSelect.value || "general";
    newsCache.clear();
    renderNewsHub(currentPanelState.code || "");
  });
  filterInput?.addEventListener("input", () => renderNewsHub(currentPanelState.code || ""));
  panel.addEventListener("toggle", () => {
    if (panel.open) {
      const comparePanel = document.getElementById("compare-hub-panel");
      const quizPanel = document.getElementById("quiz-hub-panel");
      if (comparePanel) comparePanel.open = false;
      if (quizPanel) quizPanel.open = false;
    }
    renderNewsHub(currentPanelState.code || "");
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
  });
}

function setupMobilePanelControls() {
  const leftButton = document.getElementById("toggle-left-panel");
  const toolsButton = document.getElementById("toggle-tools-panel");
  const countryButton = document.getElementById("toggle-country-panel");

  leftButton.addEventListener("click", () => toggleMobilePanel("left"));
  toolsButton.addEventListener("click", () => toggleMobilePanel("tools"));
  countryButton.addEventListener("click", () => {
    if (currentPanelState?.type) {
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
  return `${normalizeText(base || getExportContextLabel() || "georisk").replace(/\s+/g, "-") || "georisk"}-${stamp}`;
}

exportNodeAsImage = async function exportNodeAsImage(node, filename) {
  if (!node || typeof html2canvas !== "function") {
    return;
  }

  const canvas = await html2canvas(node, {
    backgroundColor: "#071320",
    scale: Math.min(window.devicePixelRatio > 1 ? 2 : 1.8, 2.2),
    useCORS: true
  });

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${buildExportFilename(filename?.replace(/\.png$/i, ""))}.png`;
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
  pdf.save(`${buildExportFilename(filename?.replace(/\.pdf$/i, ""))}.pdf`);
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
    const events = buildTimeline(country).slice(0, 6);
    return `
      <div class="compare-row">
        <strong>${getFlagEmoji(code)} ${escapeHtml(country.name)} · ${currentLanguage === "en" ? "Timeline" : "Timeline"}</strong>
        <div class="compare-values">
          ${events.map(event => `<div><b>${escapeHtml(String(event.year))}</b> · ${escapeHtml(event.text)}</div>`).join("")}
        </div>
      </div>
    `;
  }).join("");

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

async function registerServiceWorker() {
  const status = document.getElementById("offline-status");

  if (!("serviceWorker" in navigator)) {
    status.textContent = "Cache offline no disponible en este navegador.";
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));
    status.textContent = "Cache offline desactivado temporalmente para estabilizar la carga.";
    updateAppStatusPanel();
  } catch (error) {
    status.textContent = "No se pudo limpiar el cache offline.";
    updateAppStatusPanel();
  }
}

async function init() {
  try {
    loadSavedPreferences();
    await loadData();
    setupSearchEvents();
    setupThemeControls();
      setupRankingGroups();
      updateExtendedStaticText();
      setupCompareControls();
      setupQuizControls();
      setupRankingsPanel();
      setupCompareHubPanel();
      setupQuizHubPanel();
      setupNewsHubPanel();
      setupMapModeControl();
      setupSavedViewControls();
      setupGlobalKeyboardShortcuts();
      await loadMap();
      update3DPresentationState();
    startPerformanceMonitor();
    updateMapInteractionTuning();
    setupMobilePanelControls();
    await registerServiceWorker();
    if (localStorage.getItem(STORAGE_KEYS.helpSeen) !== "true") {
      openHelpModal();
    }
  } catch (error) {
    console.error("Error al inicializar GeoRisk 3D:", error);
    const status = document.getElementById("offline-status");
    if (status) {
      status.textContent = "La vista 3D no pudo inicializarse por completo.";
    }
    showFatalError(`GeoRisk no pudo terminar de inicializarse: ${error?.message || error}`);
  }
}

init();

