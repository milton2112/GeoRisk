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

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  noWrap: true,
  bounds: worldBounds
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
  fitWorldView();
});

let countriesData = {};
let selectedLayer = null;
let selectedLayers = [];
let continentBoundsLayer = null;
let worldPopulationTotal = 0;
const countryLayers = new Map();
const countryAliases = new Map();
const continentAliases = new Map();
const religionAliases = new Map();
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
  document.body.classList.remove("mobile-left-open", "mobile-country-open");
}

function openMobilePanel(panel) {
  if (!isMobileLayout()) {
    return;
  }

  document.body.classList.remove("mobile-left-open", "mobile-country-open");
  document.body.classList.add(panel === "left" ? "mobile-left-open" : "mobile-country-open");
}

function toggleMobilePanel(panel) {
  if (!isMobileLayout()) {
    return;
  }

  const className = panel === "left" ? "mobile-left-open" : "mobile-country-open";
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
}

function getLinkedCodes(code) {
  return [code, ...(TERRITORY_LINKS[code] || [])];
}

function setCountrySelection(layers) {
  clearSelection();
  const layerList = Array.isArray(layers) ? layers : [layers];
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
  selectedLayers = layers;
  selectedLayers.forEach(layer => layer.setStyle(CONTINENT_HIGHLIGHT_STYLE));

  continentBoundsLayer = L.featureGroup(layers);
}

function fitLayerBounds(layerOrGroup) {
  const bounds = layerOrGroup.getBounds();

  if (bounds && bounds.isValid()) {
    map.fitBounds(bounds.pad(0.15), {
      ...getWorldFitPadding(),
      animate: false
    });
  }
}

function renderCountry(country, fallbackName) {
  const general = country.general || {};
  const economy = country.economy || {};
  const military = country.military || {};
  const history = country.history || {};
  const politics = country.politics || {};
  const conflictsSinceFormation = getConflictsSinceFormation(country);
  const conflictsLabel = history.year
    ? "Conflictos desde su año de formación:"
    : "Conflictos registrados:";

  document.getElementById("country-panel").innerHTML = `
    <h2>${country.name || fallbackName}</h2>
    ${createSection(
      "General",
      `
        <p><b>Poblacion:</b> ${formatNumber(general.population)}</p>
        <p><b>Continente:</b> ${translateContinentName(country.continent)}</p>
        <p><b>Geografia:</b> ${general.geography || "Sin datos"}</p>
        <p><b>Ciudades destacadas:</b></p>
        ${renderCities(general)}
      `,
      true
    )}
    ${createSection(
      "Historia",
      `
        <p><b>Origen:</b> ${translateHistoryText(history.origin)}</p>
        <p><b>Tipo:</b> ${translateHistoryText(history.type)}</p>
        <p><b>Año de formación:</b> ${history.year || "Sin datos"}</p>
      `
    )}
    ${createSection(
      "Economia",
      `
        <p><b>PBI:</b> ${economy.gdp ? `US$ ${formatNumber(Math.round(economy.gdp))}` : "Sin datos"}</p>
        <p><b>PBI per capita:</b> ${
          economy.gdpPerCapita
            ? `US$ ${formatNumber(Math.round(economy.gdpPerCapita))}`
            : "Sin datos"
        }</p>
        <p><b>Inflacion:</b> ${
          economy.inflation !== null && economy.inflation !== undefined
            ? `${economy.inflation}%`
            : "Sin datos"
        }</p>
        <p><b>Exportaciones:</b></p>
        ${renderList(economy.exports)}
        <p><b>Industrias:</b></p>
        ${renderList(economy.industries)}
      `
    )}
    ${createSection(
      "Militar",
      `
        <p><b>Personal activo:</b> ${formatNumber(military.active)}</p>
        <p><b>Reserva:</b> ${formatNumber(military.reserve)}</p>
        <p><b>${conflictsLabel}</b></p>
        ${renderConflicts(conflictsSinceFormation)}
      `
    )}
    ${createSection(
      "Politica",
      `
        <p><b>Sistema politico:</b> ${politics.system || "Sin datos"}</p>
        <p><b>Organizaciones:</b></p>
        ${renderOrganizations(politics.organizations)}
        <p><b>Rivales historicos y actuales:</b></p>
        ${renderRivals(politics.rivals)}
      `
    )}
    ${createSection(
      "Religion",
      `${renderReligion(country.religion)}`
    )}
  `;

  openMobilePanel("country");
}

function renderContinent(continent, countries) {
  const totalPopulation = countries.reduce(
    (sum, country) => sum + (country.general?.population || 0),
    0
  );

  document.getElementById("country-panel").innerHTML = `
    <h2>${continent}</h2>
    <p><b>Poblacion total:</b> ${formatNumber(totalPopulation)}</p>
    <p><b>Cantidad de paises mostrados:</b> ${countries.length}</p>
    <p><b>Paises del continente:</b></p>
    ${renderList(
      countries
        .map(country => country.name)
        .sort((a, b) => a.localeCompare(b, "es"))
    )}
  `;

  openMobilePanel("country");
}

function renderReligionSelection(religionName, countries, totalNominal) {
  document.getElementById("country-panel").innerHTML = `
    <h2>${religionName}</h2>
    <p><b>Poblacion estimada en paises donde es mayoritaria:</b> ${formatNumber(Math.round(totalNominal || 0))}</p>
    <p><b>Porcentaje de la poblacion mundial:</b> ${formatPercentage(worldPopulationTotal ? (totalNominal / worldPopulationTotal) * 100 : 0)}</p>
    <p><b>Paises y territorios donde es la religion mayoritaria:</b></p>
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

function registerSuggestion(label, type, value, subtitle) {
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

function setupSearchIndex(featureNameByCode) {
  RELIGION_FAMILY_RULES.forEach(rule => {
    rule.aliases.forEach(alias => registerReligionAlias(alias, rule.label));
    registerSuggestion(rule.label, "religion", rule.label, "Religion");
  });

  Object.entries(countriesData).forEach(([code, country]) => {
    registerCountryAlias(country.name, code);
    registerCountryAlias(featureNameByCode[code], code);
    registerSuggestion(country.name, "country", code, "Pais o territorio");

    getMajorityReligionGroups(country).forEach(entry => {
      registerReligionAlias(entry.label, entry.label);
      registerSuggestion(entry.label, "religion", entry.label, "Religion");
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
      registerSuggestion(translateContinentName(country.continent), "continent", country.continent, "Continente");
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
    .filter(
      item =>
        item.normalizedLabel.includes(normalizedQuery) ||
        normalizeText(item.subtitle).includes(normalizedQuery)
    )
    .sort((a, b) => {
      const aStarts = a.normalizedLabel.startsWith(normalizedQuery) ? 0 : 1;
      const bStarts = b.normalizedLabel.startsWith(normalizedQuery) ? 0 : 1;
      if (aStarts !== bStarts) {
        return aStarts - bStarts;
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

async function selectSearchResult(result) {
  if (!result) {
    return;
  }

  const input = document.getElementById("map-search-input");
  input.value = result.label;
  hideSuggestions();

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

  renderEmpty(`No se encontro "${result.label}"`);
}

async function searchMap() {
  const input = document.getElementById("map-search-input");
  const rawQuery = input.value;
  const query = normalizeText(rawQuery);

  if (!query) {
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

  renderEmpty(`No se encontro "${rawQuery}"`);
}

async function loadData() {
  const res = await fetch("./data/countries_full.json");
  countriesData = await res.json();
  worldPopulationTotal = Object.values(countriesData).reduce(
    (sum, country) => sum + (country.general?.population || 0),
    0
  );

  generateWorldPopulation();
  generateTopPopulation();
  generateContinents();
  generateReligions();
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

  const ul = document.getElementById("top-population");
  ul.innerHTML = "";

  list.forEach(country => {
    const li = document.createElement("li");
    const share = worldPopulationTotal
      ? (country.general.population / worldPopulationTotal) * 100
      : 0;
    li.textContent = `${country.name} (${formatNumber(country.general.population)} - ${formatPercentage(share)})`;
    ul.appendChild(li);
  });
}

function generateContinents() {
  const totals = {};

  Object.values(countriesData).forEach(country => {
    const continent = country.continent || "Unknown";
    totals[continent] = (totals[continent] || 0) + (country.general?.population || 0);
  });

  const ul = document.getElementById("continents");
  ul.innerHTML = "";

  Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([continent, total]) => {
      const li = document.createElement("li");
      const share = worldPopulationTotal ? (total / worldPopulationTotal) * 100 : 0;
      li.textContent = `${translateContinentName(continent)} (${formatNumber(total)} - ${formatPercentage(share)})`;
      ul.appendChild(li);
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

  const ul = document.getElementById("religions");
  ul.innerHTML = "";

  Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([religionName, total]) => {
      const li = document.createElement("li");
      const share = worldPopulationTotal ? (total / worldPopulationTotal) * 100 : 0;
      li.textContent = `${religionName} (${formatNumber(Math.round(total))} - ${formatPercentage(share)})`;
      ul.appendChild(li);
    });
}

async function loadMap() {
  const res = await fetch(
    "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
  );
  const geojson = await res.json();
  const featureNameByCode = {};

  L.geoJSON(geojson, {
    style: DEFAULT_STYLE,
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
}

function setupMobilePanelControls() {
  const leftButton = document.getElementById("toggle-left-panel");
  const countryButton = document.getElementById("toggle-country-panel");

  leftButton.addEventListener("click", () => toggleMobilePanel("left"));
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

async function init() {
  await loadData();
  await loadMap();
  setupSearchEvents();
  setupMobilePanelControls();
}

init();
