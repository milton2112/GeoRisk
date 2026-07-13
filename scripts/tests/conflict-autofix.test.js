import assert from "node:assert/strict";
import { SAFE_CONFLICT_RENAMES, CURATED_CONFLICT_DETAIL_FIXES } from "../lib/conflict-autofix-rules.js";
import { WWII_1942_CONFLICT_DETAIL_FIXES, WWII_1942_SAFE_CONFLICT_RENAMES } from "../lib/conflict-curation-1942.js";
import { getContextualConflictName, THEATER_CONFLICT_DETAIL_FIXES, THEATER_SAFE_CONFLICT_RENAMES } from "../lib/conflict-curation-theater.js";
import {
  VISIBLE_MODERN_CONFLICT_DETAIL_FIXES,
  VISIBLE_MODERN_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-visible-modern.js";
import {
  VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-visible-followup.js";
import {
  KOREA_MODERN_CONFLICT_DETAIL_FIXES,
  KOREA_MODERN_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-korea-modern.js";
import {
  HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES,
  HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-historical-vietnam.js";
import {
  POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES,
  POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-1970-1991.js";
import {
  MODERN_1992_2021_CONFLICT_DETAIL_FIXES,
  MODERN_1992_2021_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-1992-2021.js";
import {
  UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES,
  UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-undated-americas.js";
import {
  REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-revolution-followup.js";
import {
  TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS,
  TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES,
  TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-1846-1902.js";
import {
  WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-war-1812-followup.js";
import { curateConflictEntry } from "../lib/conflict-batch-curation.js";
import { mergeConflictEntries } from "../lib/conflict-cleaning.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";

assert.equal(SAFE_CONFLICT_RENAMES["Adriatic Campaign de World War II"], "Campana del Adriatico en la Segunda Guerra Mundial");
assert.equal(CURATED_CONFLICT_DETAIL_FIXES["Batalla de Saigon"].parent, "Guerra de Vietnam");
assert.equal(WWII_1942_SAFE_CONFLICT_RENAMES["Batalla de la BahÃƒÂ­a de Milne"], "Batalla de la Bahia de Milne");
assert.equal(WWII_1942_CONFLICT_DETAIL_FIXES["Batalla de Midway"].parent, "Segunda Guerra Mundial");
assert.equal(THEATER_SAFE_CONFLICT_RENAMES["Sullivan Expedition"], "Expedicion de Sullivan");
assert.equal(getContextualConflictName({ name: "Guerra del Pacifico", startYear: 1941 }), "Guerra del Pacifico de la Segunda Guerra Mundial");
assert.equal(getContextualConflictName({ name: "Batalla de Manila", startYear: 1899 }), "Batalla de Manila (1899)");
assert.equal(getContextualConflictName({ name: "Batalla de Manila", startYear: 1945 }), "Batalla de Manila (1945)");
assert.equal(getContextualConflictName({ name: "Batalla de Manila" }), "Batalla de Manila (1899)");
const disambiguatedManilaBattles = mergeConflictEntries([
  { name: "Batalla de Manila", startYear: 1899, endYear: 1899 },
  { name: "Batalla de Manila", startYear: 1945, endYear: 1945 }
].map(entry => ({ ...entry, name: getContextualConflictName(entry) })));
assert.equal(disambiguatedManilaBattles.length, 2, "Manila 1899 y Manila 1945 no deben volver a fusionarse");
assert.deepEqual(disambiguatedManilaBattles.map(item => item.startYear), [1899, 1945]);
assert.equal(THEATER_CONFLICT_DETAIL_FIXES["Intervencion en Siberia"].region, "Siberia");
assert.equal(VISIBLE_MODERN_SAFE_CONFLICT_RENAMES["Batalla de Cheonpyeong Valley"], "Batalla de Cheonpyeong");
assert.equal(VISIBLE_MODERN_SAFE_CONFLICT_RENAMES["Guerra de Malvinas (1982)"], "Guerra de las Malvinas");
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Cheonpyeong"].startYear, 1950);
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Cheonpyeong"].parent, "Guerra de Corea");
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Joybar"].startYear, 2011);
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Combate de Buenavista"].startYear, 1880);
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Combate de El Manzano"].parent, "Guerra del Pac\u00edfico");
assert.ok(
  Object.values(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES).every(detail => detail.hierarchyConfidence === "alta" && detail.hierarchySources?.[0]?.url),
  "la tanda visible debe conservar fuente y confianza especificas para cada jerarquia"
);
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Brandywine"].startYear, 1777);
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Holowczyn"].parent, "Gran Guerra del Norte");
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Garmsir"].startYear, 2008);
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de la isla de las Serpientes"].startYear, 2022);
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Basantar"].parent, "Guerra indo-pakistan\u00ed de 1971");
assert.equal(VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Samichon River"], "Batalla del r\u00edo Samichon");
assert.equal(VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Galwan"], "Combate del valle de Galwan de 2020");
assert.ok(
  Object.values(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    ["alta", "media"].includes(detail.hierarchyConfidence) && detail.hierarchySources?.[0]?.url
  ),
  "la segunda tanda visible debe conservar fuente y confianza especificas"
);
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Battle Mountain"].parent, "Guerra de Corea");
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Chipyong-ni"].startYear, 1951);
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Khaz Oruzgan"].startYear, 2008);
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de la borne 233"].startYear, 1961);
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Basra"].campaign, "Operación Carga de los Caballeros");
assert.equal(KOREA_MODERN_SAFE_CONFLICT_RENAMES["Batalla de la cota 233"], "Batalla de la borne 233");
assert.equal(KOREA_MODERN_SAFE_CONFLICT_RENAMES["Batalla de Kisangani"], "Batalla de Kisangani de 1997");
assert.equal(KOREA_MODERN_SAFE_CONFLICT_RENAMES["Batalla de Douz"], "Escaramuza de Douz de 2011");
assert.ok(
  Object.values(KOREA_MODERN_CONFLICT_DETAIL_FIXES).every(detail =>
    ["alta", "media"].includes(detail.hierarchyConfidence) && detail.hierarchySources?.[0]?.url
  ),
  "la tanda de Corea y conflictos modernos debe conservar fuente y confianza"
);
assert.equal(
  HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES["Combate de la Junon contra el Fox"],
  "Combate naval de la Junon contra la Fox (1778)"
);
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Combate naval de la Junon contra la Fox (1778)"].startYear, 1778);
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Asalto de Ivángorod"].parent, "Guerra ruso-sueca de 1495-1497");
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Batalla del valle de Ia Drang"].parent, "Guerra de Vietnam");
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Sitio de Khe Sanh"].campaign, "Campaña de Khe Sanh");
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Batalla de Lima Site 85"].parent, "Guerra civil de Laos");
assert.ok(
  Object.values(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES).every(detail =>
    ["alta", "media"].includes(detail.hierarchyConfidence) && detail.hierarchySources?.[0]?.url
  ),
  "la tanda histórica y de Vietnam debe conservar fuente y confianza"
);

assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Batalla del Bogside"].parent, "Conflicto de Irlanda del Norte");
assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Batalla de Jijiga"].parent, "Guerra de Ogadén");
assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Sitio de Alepo (1980-1981)"].startYear, 1980);
assert.notEqual(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Sitio de Alepo (1980-1981)"].parent, "Guerra civil siria");
assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Batalla de Guelta Zemmur (1989)"].parent, "Guerra del Sahara Occidental");
assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Batalla del monte Kent"].parent, "Guerra de las Malvinas");
assert.equal(POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES["Ofensiva Esmara-Tifariti"], "Ofensiva de Esmara-Tifariti");
assert.ok(
  Object.values(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.hierarchyConfidence === "alta" && detail.hierarchySources?.[0]?.url
  ),
  "la tanda 1970-1991 debe conservar fuente y confianza"
);

assert.equal(Object.keys(MODERN_1992_2021_CONFLICT_DETAIL_FIXES).length, 39);
assert.equal(MODERN_1992_2021_CONFLICT_DETAIL_FIXES["Batalla de Gagra"].parent, "Guerra de Abjasia");
assert.equal(MODERN_1992_2021_CONFLICT_DETAIL_FIXES["Batalla de Takur Ghar"].campaign, "Operación Anaconda");
assert.equal(MODERN_1992_2021_CONFLICT_DETAIL_FIXES["Batalla de Nasiriya"].parent, "Guerra de Irak");
assert.equal(MODERN_1992_2021_CONFLICT_DETAIL_FIXES["Batalla de Mosul (2016-2017)"].parent, "Guerra contra el Estado Islámico");
assert.equal(MODERN_1992_2021_SAFE_CONFLICT_RENAMES["Batalla de los puentes"], "Batalla de los puentes de Nasiriya");
assert.equal(MODERN_1992_2021_SAFE_CONFLICT_RENAMES["Batalla de Haifa Street"], "Batalla de la calle Haifa");
assert.ok(
  Object.values(MODERN_1992_2021_CONFLICT_DETAIL_FIXES).every(detail =>
    ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
  ),
  "la tanda 1992-2021 debe conservar jerarquia especifica, fuente y confianza"
);

assert.equal(Object.keys(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES).length, 40);
assert.equal(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES["Batalla de Bemis Heights"].startYear, 1777);
assert.equal(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES["Batalla de Camden"].parent, "Guerra de Independencia de Estados Unidos");
assert.equal(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES["Batalla de Brownstown"].campaign, "Campaña del noroeste de 1812");
assert.equal(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES["Batalla de Nueva Orleans"].startYear, 1815);
assert.equal(UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES["Batalla de Ch-teauguay"], "Batalla de Châteauguay");
assert.ok(
  Object.values(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && Number.isInteger(detail.endYear)
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
  ),
  "la tanda americana sin fecha debe conservar anos, jerarquia especifica, fuente y confianza"
);

assert.equal(Object.keys(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 43);
assert.equal(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de White Plains"].startYear, 1776);
assert.equal(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Princeton"].campaign, "Campaña de Nueva Jersey de 1776-1777");
assert.equal(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de la bahía de Delaware"].type, "batalla naval");
assert.equal(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Lindley's Mill"].startYear, 1781);
assert.equal(REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Delaware Bay"], "Batalla de la bahía de Delaware");
assert.equal(REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Delaware Capes"], "Batalla de la bahía de Delaware");
assert.equal(REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES["Inteligencia en la batalla de Princeton"], "Batalla de Princeton");
assert.equal(REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Sullivan's Island"], "Batalla de la isla de Sullivan");
assert.ok(
  Object.values(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === "Guerra de Independencia de Estados Unidos"
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
  ),
  "la segunda tanda revolucionaria debe conservar fecha, jerarquia especifica y fuente"
);

assert.equal(Object.keys(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES).length, 43);
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla de Monterrey"].startYear, 1846);
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla de Santa Cruz de Rosales"].startYear, 1848);
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Primera batalla de Cárdenas"].type, "batalla naval");
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla del río Zapote"].parent, "Guerra filipino-estadounidense");
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla de Manila (1899)"].endYear, 1899);
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla de Manila (1945)"].parent, "Segunda Guerra Mundial");
assert.deepEqual(TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS["Estados Unidos"], ["Batalla de Manila (1945)"]);
assert.equal(TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES["Batalla de Monterey"], "Batalla de Monterrey");
assert.equal(TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES["Batalla de Mora"], "Primera batalla de Mora");
assert.equal(TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES["Batalla de Marilao River"], "Batalla del río Marilao");
assert.ok(
  Object.values(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
  ),
  "la tanda 1846-1902 debe conservar fecha, jerarquia, fuentes y participantes reales"
);

assert.equal(Object.keys(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 25);
assert.equal(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Fort Dearborn"].startYear, 1812);
assert.equal(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Stoney Creek"].campaign, "Campaña del Niágara de 1813");
assert.equal(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Hampden"].startYear, 1814);
assert.equal(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Horseshoe Bend"].parent, "Guerra Creek");
assert.equal(WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES["Guerra de 1812"], "Guerra anglo-estadounidense de 1812");
assert.equal(WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Fort Wayne"], "Sitio de Fort Wayne");
assert.equal(WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de River Canard"], "Batalla del río Canard");
assert.ok(
  Object.values(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.[0]?.url
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
  ),
  "la tanda de 1812 debe conservar fecha, jerarquia, fuentes y participantes reales"
);

const curatedIntervention = curateConflictEntry({
  name: "Intervencion en Siberia",
  startYear: 1918,
  endYear: 1920,
  conflictType: "intervencion"
});
assert.equal(curatedIntervention.conflictType, "intervencion", "la curaduria no debe pisar tipos explicitos");
assert.equal(curatedIntervention.curationStatus, "estructural");
assert.equal(curatedIntervention.dataConfidence, "parcial");

const sourceBackedConflict = curateConflictEntry({
  name: "Batalla respaldada por fuentes",
  startYear: 1900,
  endYear: 1900,
  type: "batalla",
  curationPriority: "media",
  curationBatch: "source-backed-test"
});
assert.equal(sourceBackedConflict.curationPriority, "media", "la prioridad explicita debe conservarse");
assert.equal(sourceBackedConflict.curationBatch, "source-backed-test", "la procedencia de curaduria no debe reemplazarse");

const canonicalWarOf1812Parent = curateConflictEntry({
  name: "Batalla de prueba de 1812",
  startYear: 1812,
  endYear: 1812,
  type: "batalla",
  parent: "Guerra de 1812",
  war: "Guerra de 1812"
});
assert.equal(canonicalWarOf1812Parent.parent, "Guerra anglo-estadounidense de 1812");
assert.equal(canonicalWarOf1812Parent.war, "Guerra anglo-estadounidense de 1812");

const accentedCanonicalParent = curateConflictEntry({
  name: "Incursión naval de prueba",
  startYear: 1804,
  endYear: 1804,
  type: "incursión naval",
  parent: "Guerras napoleónicas",
  war: "Guerras napoleónicas"
});
assert.equal(accentedCanonicalParent.parent, "Guerras napoleónicas", "una jerarquia bien escrita no debe perder acentos");
assert.equal(accentedCanonicalParent.war, "Guerras napoleónicas", "la guerra canonica debe conservar su ortografia visible");

const structuralBattle = curateConflictEntry({
  name: "Batalla de Prueba",
  startYear: 1777,
  endYear: 1777,
  type: "batalla"
}, { country: { name: "Pais A", continent: "America" } });
assert.match(structuralBattle.cause, /Accion militar de 1777/);
assert.ok(!/pendiente|requiere ampliacion|disputa militar o politica/i.test(structuralBattle.cause));

const refreshedPlaceholder = curateConflictEntry({
  name: "Campana de Prueba",
  startYear: 1800,
  endYear: 1801,
  cause: "Disputa militar o politica asociada a America.",
  outcome: "Resultado pendiente de curaduria especifica; registrado como evento historico verificado por presencia en el dataset.",
  consequences: "Impacto militar y politico localizado en America; requiere ampliacion historiografica fina."
}, { country: { name: "Pais A", continent: "America" } });
assert.ok(!/resultado pendiente|requiere ampliacion|disputa militar o politica/i.test([
  refreshedPlaceholder.cause,
  refreshedPlaceholder.outcome,
  refreshedPlaceholder.consequences
].join(" ")));

const refreshedRegionalPlaceholder = curateConflictEntry({
  name: "Batalla de Prueba Actualizada",
  startYear: 1777,
  endYear: 1777,
  type: "batalla",
  parent: "Guerra de Independencia de Estados Unidos",
  war: "Guerra de Independencia de Estados Unidos",
  campaign: "Campana de prueba de 1777",
  region: "Nueva York, Estados Unidos",
  cause: "Accion militar de fecha no consolidada vinculada a Conflicto regional de America, centrada en control territorial.",
  outcome: "Desenlace tactico registrado dentro de Conflicto regional de America; las cifras especificas no estan consolidadas.",
  consequences: "Contribuyo a la evolucion operacional de Conflicto regional de America y a la lectura territorial de America."
});
assert.match(refreshedRegionalPlaceholder.cause, /Accion militar de 1777/);
assert.match(refreshedRegionalPlaceholder.cause, /Guerra de Independencia de Estados Unidos/);
assert.doesNotMatch([
  refreshedRegionalPlaceholder.cause,
  refreshedRegionalPlaceholder.outcome,
  refreshedRegionalPlaceholder.consequences
].join(" "), /Conflicto regional de America|fecha no consolidada/i);

const accentMatchedSpecialMetadata = curateConflictEntry({
  name: "Operaciones Temeraria y Persecución",
  ongoing: false
}, { country: { name: "Estados Unidos", continent: "America" } });
assert.equal(accentMatchedSpecialMetadata.startYear, 1944, "metadatos especiales deben matchear aunque varie el acento");
assert.equal(accentMatchedSpecialMetadata.parent, "Segunda Guerra Mundial");
assert.equal(accentMatchedSpecialMetadata.campaign, "Campaña de Nueva Guinea occidental");

const report = buildConflictAuditReport({
  countries: {
    USA: {
      name: "Estados Unidos",
      military: {
        conflicts: [
          { name: "Batalla de Saigon", startYear: 1955, endYear: 1955 },
          { name: "Batalla de Midway", startYear: 1942, endYear: 1942 },
          { name: "Batalla de Cheonpyeong Valley", startYear: 1951, endYear: 1951 },
          { name: "Batalla de Brandywine", curationBatch: "safe-structured-conflict-curation-2026-06" },
          { name: "Batalla de Galwan", startYear: 2020, endYear: 2020 },
          { name: "Combate en el valle del Galwan de 2020", startYear: 2020, endYear: 2020 },
          { name: "Batalla de Khaz Oruzgan", startYear: 2010, endYear: 2010 },
          { name: "Batalla de la cota 233", startYear: 1973, endYear: 1973 },
          { name: "Batalla de Battle Mountain", startYear: 1950, endYear: 1950 },
          { name: "Batalla de Douz", startYear: 2011, endYear: 2011 },
          { name: "Combate de la Junon contra el Fox", startYear: 1809, endYear: 1809 },
          { name: "Batalla del valle de Ia Drang", startYear: 1965, endYear: 1965 },
          { name: "Sitio de Khe Sanh", startYear: 1968, endYear: 1968 },
          { name: "Batalla de Lima Site 85", startYear: 1968, endYear: 1968 },
          { name: "Batalla de Monterey" },
          { name: "Batalla de Marilao River" },
          { name: "Batalla de Manila (1899)", startYear: 1899, endYear: 1899 },
          { name: "Batalla de Manila (1945)", startYear: 1945, endYear: 1945 },
          { name: "Batalla de Fort Wayne" },
          { name: "Batalla de River Canard" },
          { name: "Batalla de Horseshoe Bend" },
          { name: "Adriatic Campaign de World War II", startYear: 1939, endYear: 1945 }
        ]
      }
    }
  },
  generatedDetails: { conflicts: {} },
  maxItems: 10000
});

const saigon = report.topIssues.find(item => item.name === "Batalla de Saigon");
assert.ok(!saigon?.issues.includes("battle_without_parent"), "Batalla de Saigon debe tener padre curado");

const adriatic = report.topIssues.find(item => item.name === "Adriatic Campaign de World War II");
assert.ok(!adriatic, "Los renombres seguros deben canonicalizarse antes de auditar duplicados");

const midway = report.topIssues.find(item => item.name === "Batalla de Midway");
assert.ok(!midway?.issues.includes("battle_without_parent"), "Batalla de Midway debe tener padre curado");

const cheonpyeong = [...report.topIssues, ...report.topAdvisories].find(item => item.name === "Batalla de Cheonpyeong");
assert.equal(cheonpyeong?.provisionalHierarchy, false, "Cheonpyeong debe dejar de usar una jerarquia provisional");
assert.equal(cheonpyeong?.hierarchyLabel, "Guerra de Corea", "Cheonpyeong debe auditarse bajo su guerra padre verificada");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Cheonpyeong"), "Cheonpyeong no debe seguir en la cola provisional");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Brandywine"), "Brandywine debe usar su jerarquia verificada");
assert.ok(
  ![...report.topIssues, ...report.topAdvisories].some(item => item.name === "Batalla de Galwan" || item.name === "Combate en el valle del Galwan de 2020"),
  "las dos variantes de Galwan deben converger al nombre canonico"
);
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Battle Mountain"), "Battle Mountain debe usar Guerra de Corea");
assert.ok(!report.topAdvisories.some(item => item.name === "Escaramuza de Douz de 2011"), "Douz debe usar una jerarquia verificada");
const khazOruzgan = [...report.topIssues, ...report.topAdvisories].find(item => item.name === "Batalla de Khaz Oruzgan");
assert.equal(khazOruzgan?.startYear, 2008, "Khaz Oruzgan debe conservar su fecha historica de 2008");
const marker233 = [...report.topIssues, ...report.topAdvisories].find(item => item.name === "Batalla de la borne 233");
assert.equal(marker233?.startYear, 1961, "la batalla de la borne 233 debe reemplazar la fecha incorrecta de 1973");
const junonFox = [...report.topIssues, ...report.topAdvisories].find(item => item.name === "Combate naval de la Junon contra la Fox (1778)");
assert.equal(junonFox?.startYear, 1778, "el combate Junon-Fox debe reemplazar el año incorrecto de 1809");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla del valle de Ia Drang"), "Ia Drang debe usar Guerra de Vietnam");
assert.ok(!report.topAdvisories.some(item => item.name === "Sitio de Khe Sanh"), "Khe Sanh debe usar su campaña verificada");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Lima Site 85"), "Lima Site 85 debe usar la guerra civil de Laos");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Monterrey"), "Monterey debe converger a Monterrey y conservar su guerra padre");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla del río Marilao"), "Marilao debe quedar traducida y bajo su guerra padre");
assert.ok(!report.topIssues.some(item => item.name === "Batalla de Manila"), "el nombre ambiguo de Manila no debe reaparecer en la auditoria");
assert.ok(!report.topAdvisories.some(item => item.name === "Sitio de Fort Wayne"), "Fort Wayne debe usar la guerra de 1812");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla del río Canard"), "River Canard debe quedar traducida y jerarquizada");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Horseshoe Bend"), "Horseshoe Bend debe usar Guerra Creek");

console.log("conflict-autofix.test.js ok");
