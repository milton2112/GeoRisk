const worldBounds = L.latLngBounds(
  L.latLng(-85, -180),
  L.latLng(85, 180)
);

const DEFAULT_STYLE = {
  color: "#222",
  weight: 1,
  fillColor: "#2a3f5f",
  fillOpacity: 0.7
};

const COUNTRY_HIGHLIGHT_STYLE = {
  color: "#8fd3ff",
  weight: 3,
  fillColor: "#5db7ff",
  fillOpacity: 0.9
};

const CONTINENT_HIGHLIGHT_STYLE = {
  color: "#b7f38b",
  weight: 2,
  fillColor: "#9bd96b",
  fillOpacity: 0.86
};

const RELIGION_HIGHLIGHT_STYLE = {
  color: "#ffb0b0",
  weight: 2,
  fillColor: "#f08b8b",
  fillOpacity: 0.88
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
  ]
};

const map = L.map("map", {
  minZoom: 2,
  maxZoom: 5,
  worldCopyJump: false,
  preferCanvas: true,
  dragging: true,
  inertia: false,
  zoomAnimation: false,
  fadeAnimation: false,
  markerZoomAnimation: false,
  keyboard: false,
  boxZoom: false,
  maxBounds: worldBounds,
  maxBoundsViscosity: 1
}).setView([20, 0], 2);

const baseTileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  noWrap: true,
  bounds: worldBounds,
  updateWhenIdle: true,
  updateWhenZooming: false,
  keepBuffer: 2
}).addTo(map);

function getWorldFitPadding() {
  if (isMobileLayout()) {
    return { paddingTopLeft: [20, 72], paddingBottomRight: [20, 20] };
  }

  return { paddingTopLeft: [290, 24], paddingBottomRight: [330, 24] };
}

function fitWorldView() {
  map.fitBounds(worldBounds, {
    ...getWorldFitPadding(),
    animate: false
  });
  map.setMinZoom(map.getZoom());
}

setTimeout(() => {
  map.invalidateSize();
  fitWorldView();
}, 200);
window.addEventListener("resize", () => {
  map.invalidateSize();
});

let countriesData = {};
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
    geography: "Geografia",
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
    geography: "Geography",
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

  const queryTokens = normalizedQuery.split(" ");
  const candidateTokens = normalizedCandidate.split(" ");

  if (queryTokens.every(token => candidateTokens.some(candidateToken => candidateToken.startsWith(token)))) {
    return 2;
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

function compactNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Sin datos";
  }

  return new Intl.NumberFormat("es-AR", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(Number(value));
}

function t(key) {
  return UI_STRINGS[currentLanguage]?.[key] || UI_STRINGS.es[key] || key;
}

function getFlagEmoji(code) {
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

function renderCities(general) {
  const capital = general?.capital;
  const cities = Array.isArray(general?.cities) ? general.cities : [];

  const cityItems = [];

  if (capital?.name) {
    cityItems.push(
      `${capital.name} (capital)${capital.population ? ` (${formatNumber(capital.population)} hab.)` : ""}`
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
  const summary = religion?.summary ? `<p><b>Religion principal:</b> ${religion.summary}</p>` : "";
  const composition = Array.isArray(religion?.composition) ? religion.composition : [];

  if (!summary && !composition.length) {
    return "<p>Sin datos estructurados.</p>";
  }

  const compositionList = composition.length
    ? `<p><b>Composicion religiosa:</b></p><ul>${composition
        .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
        .map(item => `<li>${item.name}: ${item.percentage}%</li>`)
        .join("")}</ul>`
    : "";

  return `${summary}${compositionList}`;
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

function extractConflictStartYear(conflict) {
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

function cleanConflictName(name) {
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
    [/^Battle of /i, "Batalla de "],
    [/^Second Battle of /i, "Segunda batalla de "],
    [/^Third Battle of /i, "Tercera batalla de "],
    [/^First Battle of /i, "Primera batalla de "],
    [/^Naval battle off /i, "Batalla naval de "],
    [/^Siege of /i, "Sitio de "],
    [/^Operation /i, "Operacion "],
    [/^Campaign of /i, "Campana de "],
    [/^Campaign /i, "Campana "],
    [/^Invasion of /i, "Invasion de "],
    [/^War of /i, "Guerra de "],
    [/^War in /i, "Guerra en "],
    [/^Civil war of /i, "Guerra civil de "],
    [/^Civil War of /i, "Guerra civil de "],
    [/^Front in the /i, "Frente en "]
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

function normalizeConflictForDisplay(conflict) {
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

function renderConflicts(conflicts) {
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

function clearSelection() {
  if (isMobileLayout()) {
    closeMobilePanels();
  }

  if (selectedLayer) {
    selectedLayer.setStyle(DEFAULT_STYLE);
    selectedLayer = null;
  }

  selectedLayers.forEach(layer => layer.setStyle(DEFAULT_STYLE));
  selectedLayers = [];

  if (continentBoundsLayer) {
    map.removeLayer(continentBoundsLayer);
    continentBoundsLayer = null;
  }

  selectionMode = "country";
  refreshCountryStyles();
}

function getLinkedCodes(code) {
  return [code, ...(TERRITORY_LINKS[code] || [])];
}

function setCountrySelection(layers) {
  clearSelection();
  const layerList = Array.isArray(layers) ? layers : [layers];
  selectionMode = "country";
  layerList.forEach(layer => layer.setStyle(COUNTRY_HIGHLIGHT_STYLE));
  selectedLayers = layerList;
  selectedLayer = layerList[0] || null;
}

function getCountryClickTarget(code, layer) {
  if (!code) {
    return layer;
  }

  if (countryClickTargets.has(code)) {
    return countryClickTargets.get(code);
  }

  const bounds = layer.getBounds();
  const center = bounds.getCenter();
  const area = Math.abs(
    (bounds.getNorth() - bounds.getSouth()) * (bounds.getEast() - bounds.getWest())
  );

  if (area < 80) {
    const marker = L.circleMarker(center, {
      radius: 16,
      stroke: false,
      opacity: 0,
      fillOpacity: 0,
      bubblingMouseEvents: false
    }).addTo(map);
    countryClickTargets.set(code, marker);
    return marker;
  }

  countryClickTargets.set(code, layer);
  return layer;
}

function setContinentSelection(layers) {
  clearSelection();
  selectionMode = "continent";
  selectedLayers = layers;
  selectedLayers.forEach(layer => layer.setStyle(CONTINENT_HIGHLIGHT_STYLE));

  continentBoundsLayer = L.featureGroup(layers);
}

function fitLayerBounds(layerOrGroup) {
  const bounds = layerOrGroup.getBounds();

  if (bounds && bounds.isValid()) {
    map.fitBounds(bounds.pad(0.15), {
      ...getWorldFitPadding(),
      maxZoom: isMobileLayout() ? 3 : 4,
      animate: false
    });
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
  currentPanelState = { type: "country", code: countryCode, fallbackName };
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
      <span class="country-flag">${getFlagEmoji(countryCode)}</span>
      <h2>${country.name || fallbackName}</h2>
    </div>
    <p><button id="add-to-compare-button" class="panel-action-button" type="button" ${countryCode ? "" : "disabled"}>${t("addToCompare")}</button></p>
    ${createSection(
      t("general"),
      `
        <p><b>${t("population")}:</b> ${formatNumber(general.population)}</p>
        <p><b>${t("continent")}:</b> ${translateContinentName(country.continent)}</p>
        <p><b>${t("geography")}:</b> ${general.geography || t("noData")}</p>
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
            ? `${economy.inflation}%`
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
        ${renderRelationNetwork(country, countryCode)}
        <div class="relation-group">
          <p class="relation-title">${t("linkedTerritories")}</p>
          ${renderRelationChips(relatedTerritories)}
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

  if (system.includes("comunist") || system.includes("partido unico")) {
    return { key: "comunista", label: "Comunistas" };
  }

  if (system.includes("monarquia")) {
    return { key: "monarquia", label: "Monarquias" };
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
  document.getElementById("country-panel").innerHTML = `
    <h2>${title}</h2>
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
    items.push({ year: country.history.year, text: `${country.history.type || t("noData")} desde ${country.history.origin || t("noData")}` });
  }

  const organizations = (country.politics?.organizations || [])
    .filter(item => item && item.startYear)
    .sort((a, b) => a.startYear - b.startYear)
    .slice(0, 5)
    .map(item => ({
      year: item.startYear,
      text: `Ingreso a ${getOrganizationDisplayName(item)}`
    }));

  items.push(...organizations);

  const firstConflict = getConflictsSinceFormation(country)
    .map(normalizeConflictForDisplay)
    .filter(Boolean)
    .sort((a, b) => a.startYear - b.startYear)[0];

  if (firstConflict?.startYear) {
    items.push({
      year: firstConflict.startYear,
      text: `Primer conflicto registrado: ${firstConflict.name}`
    });
  }

  return items
    .filter(item => item.year && item.text)
    .sort((a, b) => a.year - b.year)
    .slice(0, 6);
}

function renderTimeline(country) {
  const items = buildTimeline(country);
  if (!items.length) {
    return `<p>${t("noData")}</p>`;
  }

  return `<div class="timeline">${items
    .map(item => `<button class="timeline-item network-link" type="button" data-search-query="${escapeHtml(item.text)}"><span class="timeline-year">${item.year}</span>${escapeHtml(item.text)}</button>`)
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
  return Object.entries(countriesData).find(([, entry]) => entry === country)?.[0] || "";
}

function renderRelationNetwork(country, countryCode) {
  const organizations = (country.politics?.organizations || []).slice(0, 4).map(getOrganizationDisplayName);
  const rivals = (country.politics?.rivals || []).slice(0, 4).map(rival => rival.name || rival);
  const territories = getLinkedCodes(countryCode)
    .filter(code => code !== countryCode)
    .map(code => countriesData[code]?.name)
    .filter(Boolean)
    .slice(0, 4);

  const nodes = [...organizations, ...rivals, ...territories].slice(0, 8);
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

function updateStaticText() {
  document.getElementById("compare-title").textContent = t("compareTitle");
  document.getElementById("compare-empty").textContent = t("compareHint");
  document.getElementById("world-population-title").textContent = currentLanguage === "en" ? "World population" : "Poblacion mundial";
  document.getElementById("top-population-title").textContent = currentLanguage === "en" ? "Top population" : "Top Población";
  document.getElementById("continents-title").textContent = currentLanguage === "en" ? "Continents" : "Continentes";
  document.getElementById("religions-title").textContent = currentLanguage === "en" ? "Religions" : "Religiones";
  document.getElementById("gdp-title").textContent = t("topGdp");
  document.getElementById("inflation-title").textContent = t("topInflation");
  document.getElementById("systems-title").textContent = t("systems");
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
  document.getElementById("presentation-mode-button").textContent = currentLanguage === "en" ? "Presentation mode" : "Modo presentacion";
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
  country.politics = country.politics || {};
  country.history = country.history || {};
  country.economy = country.economy || {};
  country.religion = country.religion || {};

  country.politics.system =
    country.politics.system ||
    translateHistoryText(country.history.type) ||
    "Sin datos";

  if (!country.religion.summary) {
    const majorityReligion = getMajorityReligionGroups(country)[0];
    if (majorityReligion?.label) {
      country.religion.summary = majorityReligion.label;
    }
  }

  if (!country.economy.inflation && country.economy.inflation !== 0) {
    country.economy.inflation = null;
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

  country.general.cities = (country.general.cities || [])
    .filter(Boolean)
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

  const metricFields = [
    { label: t("comparePopulation"), getValue: country => country.general?.population || 0, format: value => formatNumber(value) },
    { label: t("compareGdp"), getValue: country => country.economy?.gdp || 0, format: value => `US$ ${compactNumber(value)}` },
    { label: t("compareGdpPerCapita"), getValue: country => country.economy?.gdpPerCapita || 0, format: value => `US$ ${formatNumber(Math.round(value))}` }
  ];

  const infoFields = [
    { label: t("compareInflation"), getValue: country => country.economy?.inflation || country.economy?.inflation === 0 ? `${country.economy.inflation}%` : t("noData") },
    { label: t("compareSystem"), getValue: country => country.politics?.system || t("noData") },
    { label: t("compareReligion"), getValue: country => country.religion?.summary || t("noData") },
    { label: t("compareYear"), getValue: country => country.history?.year || t("noData") }
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

  results.innerHTML = metricMarkup + infoMarkup;
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

    if (filters.system && normalizeCategoryLabel(country.politics?.system) !== filters.system) {
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
  fitLayerBounds(L.featureGroup(layers));
  renderGroupSelection("Filtros globales", "Paises y territorios filtrados", countries);
}

function parseSemanticQuery(rawQuery) {
  const normalized = normalizeText(rawQuery);
  const filters = {
    continent: "",
    religion: "",
    system: "",
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

  const populationMatchers = [
    { pattern: /mas de 100 millones|more than 100 million/, value: 100000000 },
    { pattern: /mas de 50 millones|more than 50 million/, value: 50000000 },
    { pattern: /mas de 10 millones|more than 10 million/, value: 10000000 },
    { pattern: /mas de 1 millon|more than 1 million/, value: 1000000 }
  ];

  const populationMatch = populationMatchers.find(item => item.pattern.test(normalized));
  if (populationMatch) {
    filters.minPopulation = populationMatch.value;
  }

  const score = Object.values(filters).filter(Boolean).length;
  return score >= 2 ? filters : null;
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
    registerSuggestion(country.name, "country", code, "Pais o territorio", [featureNameByCode[code]]);

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
      fitLayerBounds(L.featureGroup(linkedLayers));
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
      continentBoundsLayer = L.featureGroup(layers);
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
      fitLayerBounds(L.featureGroup(layers));
      renderGroupSelection(result.label, "Paises con este sistema politico", countries);
      return;
    }
  }

  if (result.type === "organization") {
    const countries = getCountriesByOrganization(result.value);
    const layers = getLayersForCountries(countries);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(L.featureGroup(layers));
      renderGroupSelection(result.label, "Paises miembros encontrados", countries);
      return;
    }
  }

  if (result.type === "history_type") {
    const countries = getCountriesByHistoryType(result.value);
    const layers = getLayersForCountries(countries);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(L.featureGroup(layers));
      renderGroupSelection(result.label, "Paises con este tipo de formacion", countries);
      return;
    }
  }

  if (result.type === "origin") {
    const countries = getCountriesByOrigin(result.value);
    const layers = getLayersForCountries(countries);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(L.featureGroup(layers));
      renderGroupSelection(result.label, "Paises con este origen historico", countries);
      return;
    }
  }

  if (result.type === "rival") {
    const countries = getCountriesByRival(result.value);
    const layers = getLayersForCountries(countries);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(L.featureGroup(layers));
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

  const semanticFilters = parseSemanticQuery(rawQuery);
  if (semanticFilters) {
    document.getElementById("filter-continent-select").value = semanticFilters.continent;
    document.getElementById("filter-religion-select").value = semanticFilters.religion;
    document.getElementById("filter-system-select").value = semanticFilters.system;
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
  const res = await fetch("./data/countries_full.json");
  countriesData = await res.json();
  Object.values(countriesData).forEach(sanitizeCountryData);
  worldPopulationTotal = Object.values(countriesData).reduce(
    (sum, country) => sum + (country.general?.population || 0),
    0
  );

  generateWorldPopulation();
  generateTopPopulation();
  generateContinents();
  generateReligions();
  generateGdpRanking();
  generateInflationRanking();
  generateSystemRanking();
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
  const res = await fetch("./data/world_countries.geo.json");
  const geojson = await res.json();
  const featureNameByCode = {};

  L.geoJSON(geojson, {
    style: DEFAULT_STYLE,
    smoothFactor: 0.4,
    onEachFeature: (feature, layer) => {
      const code =
        feature.id ||
        feature.properties.ISO_A3 ||
        feature.properties.iso_a3 ||
        feature.properties.ADM0_A3;

      if (code) {
        countryLayers.set(code, layer);
        featureNameByCode[code] = feature.properties.name || code;
      }

      const handleSelection = event => {
        if (event?.originalEvent) {
          L.DomEvent.stopPropagation(event);
        }

        const country = countriesData[code];

        if (!country) {
          clearSelection();
          renderEmpty(feature.properties.name);
          return;
        }

        const linkedLayers = getLinkedCodes(code)
          .map(linkedCode => countryLayers.get(linkedCode))
          .filter(Boolean);
        setCountrySelection(linkedLayers);
        renderCountry(country, feature.properties.name);
      };

      layer.on("click", handleSelection);
      layer.on("mouseover", () => {
        if (!selectedLayers.includes(layer)) {
          layer.setStyle({
            weight: 2,
            fillOpacity: 0.9
          });
        }
      });
      layer.on("mouseout", () => {
        if (!selectedLayers.includes(layer)) {
          layer.setStyle(getCountryThemeStyle(code));
        }
      });

      const clickTarget = getCountryClickTarget(code, layer);
      if (clickTarget !== layer) {
        clickTarget.on("click", handleSelection);
      }
    }
  }).addTo(map);

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

  themeSelect.addEventListener("change", event => {
    setTheme(event.target.value);
  });

  languageSelect.addEventListener("change", event => {
    currentLanguage = event.target.value;
    localStorage.setItem(STORAGE_KEYS.language, currentLanguage);
    updateStaticText();
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

function setupMobilePanelControls() {
  const leftButton = document.getElementById("toggle-left-panel");
  const toolsButton = document.getElementById("toggle-tools-panel");
  const countryButton = document.getElementById("toggle-country-panel");

  leftButton.addEventListener("click", () => toggleMobilePanel("left"));
  toolsButton.addEventListener("click", () => toggleMobilePanel("tools"));
  countryButton.addEventListener("click", () => toggleMobilePanel("country"));

  mobileMediaQuery.addEventListener("change", event => {
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
  loadSavedPreferences();
  await loadData();
  await loadMap();
  setupSearchEvents();
  setupThemeControls();
  setupCompareControls();
  setupMobilePanelControls();
  await registerServiceWorker();
}

init();
