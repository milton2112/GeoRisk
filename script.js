const DEFAULT_STYLE = {
  color: "#0f3655",
  weight: 1.4,
  fillColor: "#2a3f5f",
  fillOpacity: 0.12
};

const COUNTRY_HIGHLIGHT_STYLE = {
  color: "#9ed8ff",
  weight: 2.8,
  fillColor: "#43a5ff",
  fillOpacity: 0.34
};

const CONTINENT_HIGHLIGHT_STYLE = {
  color: "#d1ff74",
  weight: 2.8,
  fillColor: "#86d94f",
  fillOpacity: 0.32
};

const RELIGION_HIGHLIGHT_STYLE = {
  color: "#ffb4b4",
  weight: 2.8,
  fillColor: "#ff6b6b",
  fillOpacity: 0.32
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
    democracia: "#4cc9f0",
    monarquia: "#ffd166",
    autoritario: "#ef476f",
    comunista: "#f94144",
    federal: "#90be6d",
    parlamentario: "#a8dadc",
    presidencialista: "#577590",
    teocratico: "#f3722c",
    dependencia: "#adb5bd",
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

function cssColorToCesiumColor(cssColor, alpha = 1) {
  return Cesium.Color.fromCssColorString(cssColor).withAlpha(alpha);
}

class CesiumCountryLayer {
  constructor(code, entities = [], featureName = "") {
    this.code = code;
    this.entities = entities;
    this.featureName = featureName;
    this.rectangle = this.computeRectangle();
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
    this.entities.forEach(entity => {
      if (entity.polygon) {
        entity.polygon.material = cssColorToCesiumColor(style.fillColor, style.fillOpacity);
        entity.polygon.outline = true;
        entity.polygon.outlineColor = cssColorToCesiumColor(style.color, 1);
      }
      if (entity.polyline) {
        entity.polyline.material = cssColorToCesiumColor(style.color, 1);
        entity.polyline.width = Math.max(1.8, Math.min(style.weight || 1.4, 3));
      }
    });
    viewer.scene.requestRender();
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

function getInitialGlobeDistance() {
  const earthRadius = Cesium.Ellipsoid.WGS84.maximumRadius;
  return isMobileLayout() ? earthRadius * 3.55 : earthRadius * 3.05;
}

function getMaxGlobeDistance() {
  return getInitialGlobeDistance();
}

const osmImageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  credit: "© OpenStreetMap contributors"
});

const satelliteImageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  credit: "Esri, Maxar, Earthstar Geographics, and the GIS User Community"
});

let viewer = null;

const mapEventListeners = {
  click: new Set(),
  dragstart: new Set(),
  zoomstart: new Set()
};

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
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    navigationHelpButton: false,
    requestRenderMode: true,
    sceneModePicker: false,
    scene3DOnly: true,
    selectionIndicator: false,
    timeline: false
  });

  map.scene = viewer.scene;
  map.camera = viewer.camera;

  viewer.imageryLayers.removeAll();
  try {
    viewer.imageryLayers.addImageryProvider(satelliteImageryProvider);
  } catch (error) {
    console.error("No se pudo cargar la capa satelital principal:", error);
    try {
      viewer.imageryLayers.addImageryProvider(osmImageryProvider);
    } catch (fallbackError) {
      console.error("No se pudo cargar la capa base alternativa:", fallbackError);
    }
  }
  viewer.scene.globe.show = true;
  viewer.scene.globe.baseColor = cssColorToCesiumColor("#2b5d7d", 1);
  viewer.scene.globe.showGroundAtmosphere = false;
  viewer.scene.backgroundColor = cssColorToCesiumColor("#04101c", 1);
  viewer.scene.skyBox.show = false;
  viewer.scene.skyAtmosphere.show = false;
  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;
  viewer.resolutionScale = isMobileLayout() ? 0.68 : 0.78;
  viewer.scene.globe.enableLighting = false;
  viewer.scene.globe.depthTestAgainstTerrain = false;
  viewer.scene.globe.translucency.enabled = false;
  viewer.scene.rethrowRenderErrors = false;
  viewer.scene.fxaa = false;
  if (viewer.scene.postProcessStages?.fxaa) {
    viewer.scene.postProcessStages.fxaa.enabled = false;
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
    emitMapEvent("dragstart");
    emitMapEvent("zoomstart");
  });

  viewer.scene.renderError.addEventListener(error => {
    console.error("Error de renderizado en Cesium:", error);
  });

  setTimeout(() => {
    map.invalidateSize();
    updateMapInteractionTuning();
    fitWorldView();
  }, 200);

  return viewer;
}

function fitWorldView() {
  if (!viewer) {
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
  viewer.resolutionScale = isMobileLayout() ? 0.68 : 0.78;
  viewer.scene.screenSpaceCameraController.inertiaSpin = isMobileLayout() ? 0.68 : 0.8;
  viewer.scene.screenSpaceCameraController.inertiaTranslate = isMobileLayout() ? 0.68 : 0.82;
  viewer.scene.screenSpaceCameraController.inertiaZoom = isMobileLayout() ? 0.58 : 0.72;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = getMaxGlobeDistance();
  viewer.scene.requestRender();
}
window.addEventListener("resize", () => {
  map.invalidateSize();
  updateMapInteractionTuning();
});

let countriesData = {};
let rawPoliticsSystems = {};
let rawHistorySystems = {};
let rawInflationByCode = {};
let inflationFallbackByContinent = {};
let globalInflationFallback = null;
let selectedLayer = null;
let selectedLayers = [];
let continentBoundsLayer = null;
let worldPopulationTotal = 0;
let currentTheme = "default";
let selectionMode = "country";
let compareSelection = [];
let currentLanguage = "es";
let currentPanelState = { type: "empty" };
let savedFilters = [];
const countryCodeLookup = new WeakMap();

const STORAGE_KEYS = {
  filters: "geo-risk-saved-filters",
  language: "geo-risk-language",
  presentation: "geo-risk-presentation-mode"
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
    label: "Islam",
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
  ARE: "Monarquia federal",
  AUS: "Monarquia parlamentaria",
  AUT: "Parlamentarismo",
  BHS: "Monarquia parlamentaria",
  BHR: "Monarquia constitucional",
  BLZ: "Monarquia parlamentaria",
  BMU: "Dependencia",
  BTN: "Monarquia parlamentaria",
  CAF: "Presidencialismo",
  CHE: "Directorialismo",
  COM: "Presidencialismo",
  CRI: "Presidencialismo",
  DJI: "Presidencialismo",
  DOM: "Presidencialismo",
  ERI: "Partido unico",
  ETH: "Parlamentarismo",
  FJI: "Parlamentarismo",
  GHA: "Presidencialismo",
  GIN: "Presidencialismo",
  GNB: "Semipresidencialismo",
  GNQ: "Presidencialismo",
  HTI: "Semipresidencialismo",
  IRQ: "Parlamentarismo",
  JAM: "Monarquia parlamentaria",
  JOR: "Monarquia constitucional",
  KEN: "Presidencialismo",
  KHM: "Monarquia constitucional",
  KWT: "Monarquia constitucional",
  LBR: "Presidencialismo",
  LKA: "Semipresidencialismo",
  LSO: "Monarquia parlamentaria",
  MAR: "Monarquia constitucional",
  MEX: "Presidencialismo",
  MLI: "Semipresidencialismo",
  MOZ: "Presidencialismo",
  MRT: "Presidencialismo",
  MWI: "Presidencialismo",
  NAM: "Presidencialismo",
  NER: "Semipresidencialismo",
  NGA: "Presidencialismo",
  NPL: "Parlamentarismo",
  PAK: "Parlamentarismo",
  PNG: "Parlamentarismo",
  PRY: "Presidencialismo",
  PSE: "Semipresidencialismo",
  QAT: "Monarquia absoluta",
  SDN: "Presidencialismo",
  SLB: "Monarquia parlamentaria",
  SOM: "Parlamentarismo",
  SRB: "Parlamentarismo",
  SSD: "Presidencialismo",
  TCD: "Presidencialismo",
  TGO: "Presidencialismo",
  TWN: "Semipresidencialismo",
  TZA: "Presidencialismo",
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

    if (system.includes("territorio disputado")) {
      return "Territorio disputado";
    }

    if (system.includes("depend") || system.includes("territorio") || system.includes("ultramar")) {
      return "Dependencia";
    }

    if (system.includes("teocrat") || system.includes("estado islamico") || system.includes("republica islamica")) {
      return "Teocracia";
    }

    if (
      system.includes("socialista") ||
      system.includes("partido unico") ||
      system.includes("republica popular")
    ) {
      return "Partido unico socialista";
    }

    if (system.includes("directorial")) {
      return "Directorialismo";
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

    if (system.includes("monarquia federal")) {
      return "Monarquia federal";
    }

    if (
      system.includes("coprincipado") ||
      system.includes("monarquia parlamentaria") ||
      system.includes("monarquia constitucional") ||
      system === "monarquia"
    ) {
      return "Monarquia parlamentaria";
    }

    if (
      system.includes("westminster") ||
      system.includes("parlament") ||
      system.includes("democracia parlamentaria")
    ) {
      return "Parlamentarismo";
    }

    if (
      system === "republica federal" ||
      system === "republica" ||
      system === "republica democratica" ||
      system === "democracia" ||
      system === "democracia representativa" ||
      system === "estado unitario" ||
      system === "federacion" ||
      system === "pais" ||
      system === "pais insular" ||
      system === "estado archipelagico"
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
  return distance <= threshold ? 4 + distance : Number.POSITIVE_INFINITY;
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
    ZAF: "ZA", ZMB: "ZM", ZWE: "ZW", ARE: "AE", ATA: "AQ", FLK: "FK", PRI: "PR", "CS-KM": "XK"
  };

  if (!code) {
    return "MAP";
  }

  if (code === "-99") {
    return "SOL";
  }

  const normalized = (iso2ByCode[code] || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return code.toUpperCase();
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

  return `<span class="${className}">${emoji}</span>`;
}

function renderCoatVisual(code, label) {
  if (!COAT_IMAGE_CODES.has(code)) {
    return "";
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
      const percentage = populationTotal && city.population
        ? ` - ${formatPercentage((city.population / populationTotal) * 100)}`
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

function createSection(title, content, isOpen = false) {
  return `
    <details class="panel-section"${isOpen ? " open" : ""}>
      <summary>${title}</summary>
      <div class="panel-content">${content}</div>
    </details>
  `;
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
  const conflicts = Array.isArray(country.conflicts) ? country.conflicts : [];

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

function renderConflicts(conflicts) {
  if (!conflicts || !conflicts.length) {
    return "<p>Sin datos</p>";
  }

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

  if (!cleanedConflicts.length) {
    return "<p>Sin datos</p>";
  }

  return `<ul>${cleanedConflicts
    .map(conflict => `<li>${conflict.name}${formatConflictPeriod(conflict)}</li>`)
    .join("")}</ul>`;
}

function clearSelection() {
  if (viewer) {
    viewer.camera.cancelFlight();
  }
  if (isMobileLayout()) {
    closeMobilePanels();
  }

  if (selectedLayer) {
    selectedLayer.setStyle(getCountryThemeStyle(selectedLayer.code));
    selectedLayer = null;
  }

  selectedLayers.forEach(layer => layer.setStyle(getCountryThemeStyle(layer.code)));
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
  clearSelection();
  const layerList = Array.isArray(layers) ? layers : [layers];
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
    viewer.camera.cancelFlight();
    viewer.camera.flyTo({
      destination: bounds,
      duration: 0.01
    });
    viewer.scene.requestRender();
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
  currentPanelState = { type: "country", code: countryCode, fallbackName, timelineFilter };
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
    <p><button id="add-to-compare-button" class="panel-action-button" type="button" ${countryCode ? "" : "disabled"}>${t("addToCompare")}</button></p>
    ${renderCountryOverview(country, countryCode)}
    ${createSection(
      t("general"),
      `
        <p><b>${t("population")}:</b> ${formatNumber(general.population)}</p>
        <p><b>${t("continent")}:</b> ${translateContinentName(country.continent)}</p>
        <p><b>${t("geography")}:</b> ${general.capital?.name || t("noData")}</p>
        <p><b>${currentLanguage === "en" ? "Official name" : "Nombre oficial"}:</b> ${escapeHtml(general.officialName || country.name || t("noData"))}</p>
        <p><b>${currentLanguage === "en" ? "Historical names" : "Nombres historicos"}:</b></p>
        ${renderRelationChips(general.historicalNames)}
        <p><b>${currentLanguage === "en" ? "Flag" : "Bandera"}:</b> ${escapeHtml(general.symbols?.flagDescription || t("noData"))}</p>
        <p><b>${currentLanguage === "en" ? "Coat of arms" : "Escudo"}:</b> ${escapeHtml(general.symbols?.coatOfArms || t("noData"))}</p>
        <p><b>${t("cities")}:</b></p>
        ${renderCities(general)}
      `,
      true
    )}
    ${createSection(
      t("history"),
      `
        <p><b>${t("origin")}:</b> ${translateHistoryText(history.origin)}</p>
        <p><b>${t("type")}:</b> ${translateHistoryText(history.type)}</p>
        <p><b>${t("formationYear")}:</b> ${history.year || t("noData")}</p>
        <p><b>${t("timeline")}:</b></p>
        ${renderTimeline(country)}
      `
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
        <p><b>${t("inflation")}:</b> ${
          economy.inflation !== null && economy.inflation !== undefined
            ? `${economy.inflationEstimated ? "~" : ""}${economy.inflation}%`
            : t("noData")
        }</p>
        <p><b>Exportaciones:</b></p>
        ${renderList(economy.exports)}
        <p><b>Industrias:</b></p>
        ${renderList(economy.industries)}
      `
    )}
    ${createSection(
      t("military"),
      `
        <p><b>${t("activePersonnel")}:</b> ${formatNumber(military.active)}</p>
        <p><b>${t("reserve")}:</b> ${formatNumber(military.reserve)}</p>
        <p><b>${conflictsLabel}</b></p>
        ${renderConflicts(conflictsSinceFormation)}
      `
    )}
    ${createSection(
      t("politics"),
      `
        <p><b>${t("politicalSystem")}:</b> ${politics.system || t("noData")}</p>
        <p><b>${t("organizations")}:</b></p>
        ${renderOrganizations(politics.organizations)}
        <p><b>Rivales historicos y actuales:</b></p>
        ${renderRivals(politics.rivals)}
      `
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
          <p class="relation-title">${t("linkedTerritories")}</p>
          ${renderRelationChips(uniqueNormalizedList([...(country.politics?.relations?.linkedTerritories || []), ...relatedTerritories]))}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Blocs" : "Bloques"}</p>
          ${renderRelationChips(country.politics?.relations?.blocs)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${currentLanguage === "en" ? "Allies and associated partners" : "Aliados y socios asociados"}</p>
          ${renderRelationChips(country.politics?.relations?.allies)}
        </div>
        <div class="relation-group">
          <p class="relation-title">${t("organizations")}</p>
          ${renderRelationChips((politics.organizations || []).slice(0, 8).map(getOrganizationDisplayName))}
        </div>
        <div class="relation-group">
          <p class="relation-title">${t("historicalRivals")}</p>
          ${renderRelationChips((politics.rivals || []).filter(rival => (rival.type || "historico") !== "actual").map(rival => rival.name || rival))}
        </div>
        <div class="relation-group">
          <p class="relation-title">${t("currentRivals")}</p>
          ${renderRelationChips((politics.rivals || []).filter(rival => rival.type === "actual").map(rival => rival.name || rival))}
        </div>
      `
    )}
    ${createSection(
      t("religion"),
      `${renderReligion(country.religion)}`
    )}
  `;

  const compareButton = document.getElementById("add-to-compare-button");
  if (compareButton && countryCode) {
    compareButton.addEventListener("click", () => addCountryToCompare(countryCode));
  }

  openMobilePanel("country");
}

function renderContinent(continent, countries) {
  currentPanelState = { type: "continent", continent, countries };
  const totalPopulation = countries.reduce(
    (sum, country) => sum + (country.general?.population || 0),
    0
  );

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
  `;

  openMobilePanel("country");
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

  openMobilePanel("country");
}

function renderEmpty(name) {
  currentPanelState = { type: "empty", name };
  document.getElementById("country-panel").innerHTML = `
    <h2>${name}</h2>
    <p>Sin datos</p>
  `;

  openMobilePanel("country");
}

function registerCountryAlias(alias, value) {
  const normalizedAlias = normalizeText(alias);

  if (!normalizedAlias) {
    return;
  }

  countryAliases.set(normalizedAlias, value);
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

  if (system.includes("depend") || system.includes("territorio") || system.includes("ultramar")) {
    return { key: "dependencia", label: "Dependencias" };
  }

  if (system.includes("teocratic")) {
    return { key: "teocratico", label: "Teocraticos" };
  }

  if (system.includes("socialista") || system.includes("partido unico")) {
    return { key: "comunista", label: "Comunistas" };
  }

  if (system.includes("monarquia")) {
    return { key: "monarquia", label: "Monarquias" };
  }

  if (system.includes("directorial")) {
    return { key: "parlamentario", label: "Parlamentarios" };
  }

  if (system.includes("autoritar") || system.includes("dictadura")) {
    return { key: "autoritario", label: "Autoritarios" };
  }

  if (system.includes("federal")) {
    return { key: "federal", label: "Federales" };
  }

  if (system.includes("parlament")) {
    return { key: "parlamentario", label: "Parlamentarios" };
  }

  if (system.includes("presidenc")) {
    return { key: "presidencialista", label: "Presidencialistas" };
  }

  if (system.includes("democr")) {
    return { key: "democracia", label: "Democracias" };
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

  if (!country) {
    return DEFAULT_STYLE;
  }

  if (currentTheme === "continent") {
    const fillColor = THEME_STYLES.continent[country.continent || "Unknown"] || THEME_STYLES.continent.Unknown;
    return { ...DEFAULT_STYLE, color: "#274c77", fillColor, fillOpacity: 0.82 };
  }

  if (currentTheme === "religion") {
    const fillColor = THEME_STYLES.religion[getReligionThemeKey(country)] || THEME_STYLES.religion.otras;
    return { ...DEFAULT_STYLE, color: "#5a2a2a", fillColor, fillOpacity: 0.82 };
  }

  if (currentTheme === "politics") {
    const info = getPoliticalThemeInfo(country);
    const fillColor = THEME_STYLES.politics[info.key] || THEME_STYLES.politics.otros;
    return { ...DEFAULT_STYLE, color: "#2b2d42", fillColor, fillOpacity: 0.84 };
  }

  if (currentTheme === "population") {
    const fillColor = getPopulationThemeInfo(country).color;
    return { ...DEFAULT_STYLE, color: "#1b4332", fillColor, fillOpacity: 0.85 };
  }

  if (currentTheme === "gdp") {
    const fillColor = getBucketThemeInfo(country.economy?.gdp || 0, THEME_STYLES.gdp).color;
    return { ...DEFAULT_STYLE, color: "#1b4332", fillColor, fillOpacity: 0.85 };
  }

  if (currentTheme === "gdpPerCapita") {
    const fillColor = getBucketThemeInfo(country.economy?.gdpPerCapita || 0, THEME_STYLES.gdpPerCapita).color;
    return { ...DEFAULT_STYLE, color: "#023047", fillColor, fillOpacity: 0.85 };
  }

  if (currentTheme === "inflation") {
    const fillColor = getBucketThemeInfo(country.economy?.inflation ?? -1000, THEME_STYLES.inflation).color;
    return { ...DEFAULT_STYLE, color: "#5f0f40", fillColor, fillOpacity: 0.85 };
  }

  if (currentTheme === "militaryActive") {
    const fillColor = getBucketThemeInfo(getCountryMilitaryActive(country), THEME_STYLES.militaryActive).color;
    return { ...DEFAULT_STYLE, color: "#5b0000", fillColor, fillOpacity: 0.85 };
  }

  if (currentTheme === "formationYear") {
    const fillColor = getBucketThemeInfo(getCountryFormationYear(country), THEME_STYLES.formationYear).color;
    return { ...DEFAULT_STYLE, color: "#5f0f40", fillColor, fillOpacity: 0.84 };
  }

  if (currentTheme === "religionBranch") {
    const fillColor = THEME_STYLES.religionBranch[getReligionBranchThemeKey(country)] || THEME_STYLES.religionBranch.otras;
    return { ...DEFAULT_STYLE, color: "#3c096c", fillColor, fillOpacity: 0.84 };
  }

  if (currentTheme === "exMetropole") {
    const fillColor = THEME_STYLES.exMetropole[getExMetropoleThemeKey(country)] || THEME_STYLES.exMetropole["Sin datos"];
    return { ...DEFAULT_STYLE, color: "#274c77", fillColor, fillOpacity: 0.84 };
  }

  if (currentTheme === "bloc") {
    const fillColor = THEME_STYLES.bloc[getBlocThemeKey(country)] || THEME_STYLES.bloc.Otros;
    return { ...DEFAULT_STYLE, color: "#1d3557", fillColor, fillOpacity: 0.84 };
  }

  if (currentTheme === "conflicts") {
    const fillColor = getBucketThemeInfo(getCountryConflictCount(country), THEME_STYLES.conflicts).color;
    return { ...DEFAULT_STYLE, color: "#5b0000", fillColor, fillOpacity: 0.85 };
  }

  if (currentTheme === "organizations") {
    const fillColor = getBucketThemeInfo(getCountryOrganizationCount(country), THEME_STYLES.organizations).color;
    return { ...DEFAULT_STYLE, color: "#184e77", fillColor, fillOpacity: 0.85 };
  }

  if (currentTheme === "rivals") {
    const fillColor = getBucketThemeInfo(getCountryRivalCount(country), THEME_STYLES.rivals).color;
    return { ...DEFAULT_STYLE, color: "#6a040f", fillColor, fillOpacity: 0.85 };
  }

  if (currentTheme === "religionDiversity") {
    const fillColor = getBucketThemeInfo(getCountryReligionDiversity(country), THEME_STYLES.religionDiversity).color;
    return { ...DEFAULT_STYLE, color: "#6d28d9", fillColor, fillOpacity: 0.85 };
  }

  if (currentTheme === "historyType") {
    const key = normalizeText(country.history?.type || "otros");
    const fillColor = THEME_STYLES.historyType[key] || THEME_STYLES.historyType.otros;
    return { ...DEFAULT_STYLE, color: "#3c096c", fillColor, fillOpacity: 0.84 };
  }

  return DEFAULT_STYLE;
}

function refreshCountryStyles() {
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
  } else if (currentTheme === "militaryActive") {
    items = THEME_STYLES.militaryActive.map(item => ({
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
  }

  if (!items.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = items
    .map(item => `<div class="legend-item"><span class="legend-swatch" style="background:${item.color}"></span>${item.label}</div>`)
    .join("");
}

function setTheme(theme) {
  currentTheme = theme || "default";
  refreshCountryStyles();
  renderThemeLegend();
}

function renderGroupSelection(title, descriptor, countries) {
  currentPanelState = { type: "group", title, descriptor, countries };
  const totalPopulation = countries.reduce((sum, country) => sum + (country.general?.population || 0), 0);
  const avgGdpPerCapita = countries.length
    ? countries.reduce((sum, country) => sum + (country.economy?.gdpPerCapita || 0), 0) / countries.length
    : 0;
  const totalOrganizations = countries.reduce((sum, country) => sum + getCountryOrganizationCount(country), 0);
  const totalConflicts = countries.reduce((sum, country) => sum + getCountryConflictCount(country), 0);
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
  `;

  openMobilePanel("country");
}

function buildTimeline(country) {
  const items = [];
  if (country.history?.year) {
    items.push({
      year: country.history.year,
      category: currentLanguage === "en" ? "Formation" : "Formacion",
      categoryKey: "formation",
      text: `${country.history.type || t("noData")} desde ${country.history.origin || t("noData")}`,
      reference: country.history.origin || country.name
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
      reference: getOrganizationDisplayName(item)
    }));

  items.push(...organizations.slice(0, 4));

  const normalizedConflicts = getConflictsSinceFormation(country)
    .map(normalizeConflictForDisplay)
    .filter(conflict => conflict?.startYear)
    .sort((a, b) => a.startYear - b.startYear);

  normalizedConflicts.slice(0, 4).forEach(conflict => {
    items.push({
      year: conflict.startYear,
      category: currentLanguage === "en" ? "Conflict" : "Conflicto",
      categoryKey: "conflict",
      text: `${conflict.ongoing ? "Conflicto vigente" : "Conflicto"}: ${conflict.name}`,
      reference: conflict.name
    });
  });

  if (country.politics?.system && country.history?.year) {
    items.push({
      year: country.history.year,
      category: currentLanguage === "en" ? "System" : "Sistema",
      categoryKey: "system",
      text: `${currentLanguage === "en" ? "Current political system" : "Sistema politico actual"}: ${country.politics.system}`,
      reference: country.politics.system
    });
  }

  (country.history?.events || []).forEach(event => {
    if (!event?.year || !event?.text) {
      return;
    }

    const categoryMap = {
      politica: "system",
      constitucion: "formation",
      estado: "formation",
      union: "formation",
      revolucion: "formation",
      golpe: "system",
      guerra: "conflict",
      tratado: "organization",
      acuerdo: "organization",
      division: "formation",
      descolonizacion: "formation",
      reforma: "system",
      territorio: "formation",
      disolucion: "formation",
      imperio: "formation",
      economia: "organization"
    };

    items.push({
      year: event.year,
      category: toDisplayTitleCase(event.category || (currentLanguage === "en" ? "Event" : "Evento")),
      categoryKey: categoryMap[normalizeText(event.category)] || "formation",
      text: event.text,
      reference: event.reference || event.text
    });
  });

  return items
    .filter(item => item.year && item.text)
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

function renderTimeline(country) {
  const allItems = buildTimeline(country);
  const activeFilter = currentPanelState.timelineFilter || "all";
  const items = activeFilter === "all"
    ? allItems
    : allItems.filter(item => item.categoryKey === activeFilter);

  const filters = [
    { key: "all", label: currentLanguage === "en" ? "All" : "Todo" },
    { key: "formation", label: currentLanguage === "en" ? "Formation" : "Formacion" },
    { key: "organization", label: currentLanguage === "en" ? "Organizations" : "Organizaciones" },
    { key: "conflict", label: currentLanguage === "en" ? "Conflicts" : "Conflictos" },
    { key: "system", label: currentLanguage === "en" ? "System" : "Sistema" }
  ];

  const controls = `
    <div class="timeline-filters">
      ${filters.map(filter => `
        <button
          type="button"
          class="timeline-filter${filter.key === activeFilter ? " is-active" : ""}"
          data-timeline-filter="${filter.key}"
        >${escapeHtml(filter.label)}</button>
      `).join("")}
    </div>
  `;

  if (!items.length) {
    return `${controls}<p>${t("noData")}</p>`;
  }

  return `${controls}<div class="timeline">${items
    .map(item => `
      <button class="timeline-item network-link" type="button" data-search-query="${escapeHtml(getTimelineEventQuery(item, country))}">
        <span class="timeline-year">${item.year}</span>
        <span class="timeline-copy">
          <span class="timeline-kicker">${escapeHtml(item.category || (currentLanguage === "en" ? "Event" : "Evento"))}</span>
          <span>${escapeHtml(item.text)}</span>
        </span>
      </button>
    `)
    .join("")}</div>`;
}

function renderRelationChips(items) {
  const cleanItems = (items || []).filter(Boolean);
  if (!cleanItems.length) {
    return `<p>${t("noData")}</p>`;
  }

  return `<div class="relation-chips">${cleanItems
    .map(item => `<span class="relation-chip">${escapeHtml(item)}</span>`)
    .join("")}</div>`;
}

function getCountryCodeByObject(country) {
  return countryCodeLookup.get(country) || "";
}

function renderRelationNetwork(country, countryCode) {
  const relations = country.politics?.relations || {};
  const organizations = (country.politics?.organizations || []).slice(0, 3).map(getOrganizationDisplayName);
  const rivals = (country.politics?.rivals || []).slice(0, 3).map(rival => rival.name || rival);
  const territories = uniqueNormalizedList([
    ...(relations.linkedTerritories || []),
    ...getLinkedCodes(countryCode)
      .filter(code => code !== countryCode)
      .map(code => countriesData[code]?.name)
      .filter(Boolean)
  ]).slice(0, 3);
  const blocs = (relations.blocs || []).slice(0, 3);
  const allies = (relations.allies || []).slice(0, 3);
  const nodes = [...organizations, ...blocs, ...allies, ...rivals, ...territories].slice(0, 10);
  if (!nodes.length) {
    return `<p>${t("noData")}</p>`;
  }

  return `
    <div class="relation-network">
      <div class="network-center">${getFlagEmoji(countryCode)} ${escapeHtml(country.name)}</div>
      <div class="network-links">
        ${nodes.map(item => `<button type="button" class="network-link" data-search-query="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderRelationsSummary(country, countryCode) {
  const relations = country.politics?.relations || {};
  const linkedCount = uniqueNormalizedList([
    ...(relations.linkedTerritories || []),
    ...getLinkedCodes(countryCode).filter(code => code !== countryCode)
  ]).length;
  const summaries = [
    {
      label: currentLanguage === "en" ? "Organizations" : "Organizaciones",
      value: getCountryOrganizationCount(country)
    },
    {
      label: currentLanguage === "en" ? "Historical rivals" : "Rivales historicos",
      value: (country.politics?.rivals || []).filter(rival => (rival.type || "historico") !== "actual").length
    },
    {
      label: currentLanguage === "en" ? "Current rivals" : "Rivales actuales",
      value: (country.politics?.rivals || []).filter(rival => rival.type === "actual").length
    },
    {
      label: currentLanguage === "en" ? "Linked territories" : "Territorios vinculados",
      value: linkedCount
    },
    {
      label: currentLanguage === "en" ? "Blocs" : "Bloques",
      value: (relations.blocs || []).length
    },
    {
      label: currentLanguage === "en" ? "Allies" : "Aliados",
      value: (relations.allies || []).length
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
  document.getElementById("compare-empty").textContent = t("compareHint");
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
  document.getElementById("toggle-left-panel").textContent = currentLanguage === "en" ? "Top lists" : "Top y continentes";
  document.getElementById("toggle-tools-panel").textContent = currentLanguage === "en" ? "Layers" : "Capas";
  document.getElementById("toggle-country-panel").textContent = currentLanguage === "en" ? "Country card" : "Ficha del pais";
  document.querySelector("#map-toolbar summary").textContent = currentLanguage === "en" ? "Thematic layers" : "Capas tematicas";
  document.querySelector("label[for='theme-select']").textContent = currentLanguage === "en" ? "Layer" : "Capa";
  document.querySelector("label[for='language-select']").textContent = currentLanguage === "en" ? "Language" : "Idioma";
  document.querySelector("label[for='filter-continent-select']").textContent = currentLanguage === "en" ? "Filters" : "Filtros";
  document.getElementById("apply-filters-button").textContent = currentLanguage === "en" ? "Apply filters" : "Aplicar filtros";
  document.getElementById("save-filters-button").textContent = currentLanguage === "en" ? "Save filters" : "Guardar filtros";
  document.getElementById("reset-view-button").textContent = currentLanguage === "en" ? "Reset view" : "Resetear vista";
  document.getElementById("presentation-mode-button").textContent =
    document.body.classList.contains("presentation-mode")
      ? (currentLanguage === "en" ? "Exit presentation" : "Salir de presentacion")
      : (currentLanguage === "en" ? "Presentation mode" : "Modo presentacion");
  renderSavedFilters();
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

    const presentation = localStorage.getItem(STORAGE_KEYS.presentation) === "true";
    document.body.classList.toggle("presentation-mode", presentation);
  } catch (error) {
    savedFilters = [];
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
    if (typeof value !== "number" || !continent) {
      return;
    }

    continentValues[continent] = continentValues[continent] || [];
    continentValues[continent].push(value);
    globalValues.push(value);
  });

  inflationFallbackByContinent = Object.fromEntries(
    Object.entries(continentValues).map(([continent, values]) => [continent, getMedian(values)])
  );
  globalInflationFallback = getMedian(globalValues);
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

  if (!country.economy.inflation && country.economy.inflation !== 0) {
    const estimatedInflation =
      rawInflationByCode[country.code] ??
      inflationFallbackByContinent[country.continent] ??
      globalInflationFallback;
    country.economy.inflation = estimatedInflation ?? null;
    country.economy.inflationEstimated = rawInflationByCode[country.code] === undefined && estimatedInflation !== null && estimatedInflation !== undefined;
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
  country.politics.relations.blocs = uniqueNormalizedList(country.politics.relations.blocs || []);
  country.politics.relations.allies = uniqueNormalizedList(country.politics.relations.allies || []);
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

function renderComparePanel() {
  const empty = document.getElementById("compare-empty");
  const chips = document.getElementById("compare-chips");
  const results = document.getElementById("compare-results");
  empty.textContent = t("compareHint");

  if (!compareSelection.length) {
    empty.hidden = false;
    chips.innerHTML = "";
    results.innerHTML = "";
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
    { label: t("compareInflation"), getValue: country => country.economy?.inflation || country.economy?.inflation === 0 ? `${country.economy.inflation}%` : t("noData") },
    { label: t("compareSystem"), getValue: country => country.politics?.system || t("noData") },
    { label: t("compareReligion"), getValue: country => country.religion?.summary || t("noData") },
    { label: t("compareYear"), getValue: country => country.history?.year || t("noData") },
    { label: currentLanguage === "en" ? "Blocs" : "Bloques", getValue: country => (country.politics?.relations?.blocs || []).join(", ") || t("noData") },
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

  results.innerHTML = countryCards + leaderMarkup + deltaMarkup + metricMarkup + infoMarkup;
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
    .filter(country => getCountryConflictCount(country) > 0)
    .sort((a, b) => getCountryConflictCount(b) - getCountryConflictCount(a))
    .slice(0, 10);

  renderInteractiveList("top-conflicts-count", list.map(country => ({
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${formatNumber(getCountryConflictCount(country))})`,
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
    historyType: "",
    origin: "",
    rival: "",
    minPopulation: 0
  };

  for (const [alias, continent] of continentAliases.entries()) {
    if (normalized.includes(alias)) {
      filters.continent = continent;
      break;
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
    if (/\bmonarquia|\bmonarquias/.test(normalized)) {
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
    /with more organizations/
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
    return [];
  }

  suggestionBox.hidden = false;
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
  suggestionBox.hidden = true;
  suggestionBox.innerHTML = "";
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

async function selectSearchResult(result) {
  if (!result) {
    return;
  }

  const input = document.getElementById("map-search-input");
  input.value = result.label;
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
    applyFilters();
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

async function loadData() {
  const [countriesRes, rawPoliticsRes, rawHistoryRes, rawInflationRes] = await Promise.all([
    fetch("./data/countries_full.json"),
    fetch("./data/raw/politics.json"),
    fetch("./data/raw/history.json"),
    fetch("./data/raw/inflation.json")
  ]);

  countriesData = await countriesRes.json();
  rawPoliticsSystems = await rawPoliticsRes.json();
  rawHistorySystems = await rawHistoryRes.json();
  rawInflationByCode = await rawInflationRes.json();
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
  worldPopulationTotal = Object.values(countriesData).reduce(
    (sum, country) => sum + (country.general?.population || 0),
    0
  );

  refreshGlobalStats();
}

function refreshGlobalStats() {
  generateWorldPopulation();
  generateTopPopulation();
  generateContinents();
  generateReligions();
  generateGdpRanking();
  generateInflationRanking();
  generateSystemRanking();
  generateGdpPerCapitaRanking();
  generateOrganizationCountRanking();
  generateConflictCountRanking();
  generateMilitaryRanking();
  generateReligionDiversityRanking();
  generateOrganizationsReachRanking();
  generateRivalriesRanking();
  generateBlocsRanking();
  generateMetropolesRanking();
  generateHistoryTypesRanking();
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
  const totals = {};

  Object.values(countriesData).forEach(country => {
    const population = country.general?.population || 0;
    const composition = Array.isArray(country.religion?.composition) ? country.religion.composition : [];

    composition.forEach(entry => {
      if (!entry?.name || !entry?.percentage) {
        return;
      }

      const nominal = population * (entry.percentage / 100);
      totals[entry.name] = (totals[entry.name] || 0) + nominal;
    });
  });

  renderInteractiveList("religions", Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([religionName, total]) => {
      const share = worldPopulationTotal ? (total / worldPopulationTotal) * 100 : 0;
      return {
        label: `${religionName} (${formatNumber(Math.round(total))} - ${formatPercentage(share)})`,
        religionName
      };
    }), item => {
      selectSearchResult({ label: item.religionName, type: "religion", value: item.religionName });
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
    label: `${getFlagEmoji(getCountryCodeByObject(country))} ${country.name} (${country.economy.inflation}%)`,
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
  initializeViewer();
  const res = await fetch("./data/world_countries.geo.json");
  const geojson = await res.json();
  const featureNameByCode = {};
  let dataSource = null;

  try {
    dataSource = await Cesium.GeoJsonDataSource.load(geojson, {
      clampToGround: false
    });
    await viewer.dataSources.add(dataSource);
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
  let hoveredLayer = null;
  let hoverFramePending = false;
  let pendingHoverLayer = null;

  function restoreHover() {
    if (hoveredLayer && !selectedLayers.includes(hoveredLayer)) {
      hoveredLayer.setStyle(getCountryThemeStyle(hoveredLayer.code));
    }
    hoveredLayer = null;
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
    setCountrySelection(linkedLayers);
    renderCountry(country, featureName || country.name);
    viewer.scene.requestRender();
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  clickHandler.setInputAction(movement => {
    if (isMobileLayout()) {
      return;
    }

    const picked = viewer.scene.pick(movement.endPosition);
    const code = picked?.id?.countryCode;
    const layer = code ? countryLayers.get(code) : null;

    pendingHoverLayer = layer || null;

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
          weight: Math.max((baseStyle.weight || 1.4) + 0.4, 1.8),
          fillOpacity: Math.min((baseStyle.fillOpacity || 0.12) + 0.06, 0.22)
        });
      }
      viewer.scene.requestRender();
    });
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  setupSearchIndex(featureNameByCode);
  fitWorldView();
}

function setupSearchEvents() {
  const input = document.getElementById("map-search-input");
  const button = document.getElementById("map-search-button");
  const suggestionBox = document.getElementById("search-suggestions");
  const countryPanel = document.getElementById("country-panel");
  let activeIndex = 0;
  let currentSuggestions = [];

  button.addEventListener("click", () => searchMap());

  input.addEventListener("input", () => {
    activeIndex = 0;
    currentSuggestions = renderSuggestions(input.value, activeIndex);
  });

  input.addEventListener("focus", () => {
    currentSuggestions = renderSuggestions(input.value, activeIndex);
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

  countryPanel.addEventListener("click", async event => {
    const timelineFilterButton = event.target.closest("[data-timeline-filter]");
    if (timelineFilterButton) {
      currentPanelState.timelineFilter = timelineFilterButton.dataset.timelineFilter || "all";
      rerenderCurrentPanel();
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
  renderThemeLegend();
  updateStaticText();

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
    refreshGlobalStats();
    renderThemeLegend();
    renderComparePanel();
    rerenderCurrentPanel();
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
  });
}

function setupCompareControls() {
  const chips = document.getElementById("compare-chips");
  chips.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-compare]");
    if (!button) {
      return;
    }

    removeCountryFromCompare(button.dataset.removeCompare);
  });

  renderComparePanel();
}

function setupRankingsPanel() {
  const rankingsPanel = document.getElementById("rankings-panel");
  if (!rankingsPanel) {
    return;
  }

  rankingsPanel.open = false;
}

function setupMobilePanelControls() {
  const leftButton = document.getElementById("toggle-left-panel");
  const toolsButton = document.getElementById("toggle-tools-panel");
  const countryButton = document.getElementById("toggle-country-panel");

  leftButton.addEventListener("click", () => toggleMobilePanel("left"));
  toolsButton.addEventListener("click", () => toggleMobilePanel("tools"));
  countryButton.addEventListener("click", () => toggleMobilePanel("country"));

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

async function registerServiceWorker() {
  const status = document.getElementById("offline-status");

  if (!("serviceWorker" in navigator)) {
    status.textContent = "Cache offline no disponible en este navegador.";
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("./sw.js");
    await registration.update();
    status.textContent = "Cache local activo para app, datos y tiles visitados.";
  } catch (error) {
    status.textContent = "No se pudo activar el cache offline.";
  }
}

async function init() {
  try {
    loadSavedPreferences();
    await loadData();
    setupSearchEvents();
    setupThemeControls();
    setupCompareControls();
    setupRankingsPanel();
    await loadMap();
    updateMapInteractionTuning();
    setupMobilePanelControls();
    await registerServiceWorker();
  } catch (error) {
    console.error("Error al inicializar GeoRisk 3D:", error);
    const status = document.getElementById("offline-status");
    if (status) {
      status.textContent = "La vista 3D no pudo inicializarse por completo.";
    }
  }
}

init();

