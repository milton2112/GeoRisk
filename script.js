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
  color: "#4da3ff",
  weight: 3,
  fillColor: "#2a3f5f",
  fillOpacity: 0.9
};

const CONTINENT_HIGHLIGHT_STYLE = {
  color: "#f2c14e",
  weight: 2,
  fillColor: "#2a3f5f",
  fillOpacity: 0.85
};

const map = L.map("map", {
  minZoom: 2,
  maxZoom: 5,
  worldCopyJump: false
}).setView([20, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  noWrap: true,
  bounds: worldBounds
}).addTo(map);

setTimeout(() => map.invalidateSize(), 200);
window.addEventListener("resize", () => map.invalidateSize());

let countriesData = {};
let selectedLayer = null;
let selectedLayers = [];
let continentBoundsLayer = null;
const countryLayers = new Map();
const countryAliases = new Map();
const continentAliases = new Map();
const countryClickTargets = new Map();
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

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "Sin datos";
  }

  return Number(value).toLocaleString("es-AR");
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

function renderList(items) {
  if (!items || !items.length) {
    return "<p>Sin datos</p>";
  }

  return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
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
    map.fitBounds(bounds.pad(0.15));
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
}

function renderEmpty(name) {
  document.getElementById("country-panel").innerHTML = `
    <h2>${name}</h2>
    <p>Sin datos</p>
  `;
}

function registerCountryAlias(alias, value) {
  const normalizedAlias = normalizeText(alias);

  if (!normalizedAlias) {
    return;
  }

  countryAliases.set(normalizedAlias, value);
}

function setupSearchIndex(featureNameByCode) {
  Object.entries(countriesData).forEach(([code, country]) => {
    registerCountryAlias(country.name, code);
    registerCountryAlias(featureNameByCode[code], code);
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
    }
  });
}

function searchMap() {
  const input = document.getElementById("map-search-input");
  const rawQuery = input.value;
  const query = normalizeText(rawQuery);

  if (!query) {
    return;
  }

  const countryCode = countryAliases.get(query);

  if (countryCode && countryLayers.has(countryCode) && countriesData[countryCode]) {
    const linkedLayers = getLinkedCodes(countryCode)
      .map(code => countryLayers.get(code))
      .filter(Boolean);
    setCountrySelection(linkedLayers);
    fitLayerBounds(L.featureGroup(linkedLayers));
    renderCountry(countriesData[countryCode], countriesData[countryCode].name);
    return;
  }

  const continent = continentAliases.get(query);

  if (continent) {
    const continentEntries = Object.entries(countriesData).filter(
      ([, country]) => country.continent === continent
    );
    const layers = continentEntries
      .map(([code]) => countryLayers.get(code))
      .filter(Boolean);

    if (layers.length) {
      setContinentSelection(layers);
      fitLayerBounds(continentBoundsLayer);
      renderContinent(
        translateContinentName(continent),
        continentEntries.map(([, country]) => country)
      );
      return;
    }
  }

  renderEmpty(`No se encontro "${rawQuery}"`);
}

async function loadData() {
  const res = await fetch("./data/countries_full.json");
  countriesData = await res.json();

  generateTopPopulation();
  generateContinents();
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
    li.textContent = `${country.name} (${formatNumber(country.general.population)})`;
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
      li.textContent = `${translateContinentName(continent)} (${formatNumber(total)})`;
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

      const handleSelection = () => {
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
}

function setupSearchEvents() {
  const input = document.getElementById("map-search-input");
  const button = document.getElementById("map-search-button");

  button.addEventListener("click", searchMap);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      searchMap();
    }
  });
}

async function init() {
  await loadData();
  await loadMap();
  setupSearchEvents();
}

init();
