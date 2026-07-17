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
import {
  US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-civil-war-followup.js";
import {
  US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-wwii-followup.js";
import {
  US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-indian-wars-followup.js";
import {
  US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-frontier-followup.js";
import {
  US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-frontier-second-followup.js";
import {
  US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-caribbean-followup.js";
import {
  AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-australia-denmark-followup.js";
import {
  US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-indigenous-followup.js";
import {
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-revolution-third-followup.js";
import {
  BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-british-wwii-followup.js";
import {
  US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-overseas-followup.js";
import {
  ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-active-africa-followup.js";
import {
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  JAPAN_KOREA_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-japan-korea-followup.js";
import {
  FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  FRANCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-france-followup.js";
import { curateConflictEntry } from "../lib/conflict-batch-curation.js";
import { cleanConflictLabel, mergeConflictEntries } from "../lib/conflict-cleaning.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

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

assert.equal(Object.keys(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 20);
assert.equal(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Fredericksburg"].startYear, 1862);
assert.equal(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Cedar Creek"].campaign, "Campaña del valle de Shenandoah de 1864");
assert.equal(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES["Segunda batalla de Fort McAllister"].startYear, 1864);
assert.equal(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Memphis"].type, "batalla naval");
assert.equal(US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Fort McAllister"], "Segunda batalla de Fort McAllister");
assert.equal(US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Galveston Harbor"], "Batalla del puerto de Galveston de 1862");
assert.equal(US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Head de Passes"], "Batalla de Head of Passes");
assert.ok(
  Object.values(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === "Guerra Civil estadounidense"
      && detail.parent === detail.war
      && detail.campaign
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
  ),
  "la tanda de la Guerra Civil debe conservar fecha, jerarquia, fuentes y participantes reales"
);

assert.equal(Object.keys(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 16);
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Dutch Harbor"].startYear, 1942);
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Bairoko"].campaign, "Campaña de Nueva Georgia");
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del estrecho de Surigao"].type, "batalla naval");
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Saint-Vith"].campaign, "Ofensiva de las Ardenas");
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate naval del SS Stephen Hopkins"].participants[1].members[0], "Alemania");
assert.equal(US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla del Mar de Sibuyan"], "Batalla del mar de Sibuyán");
assert.equal(US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de St. Vith"], "Batalla de Saint-Vith");
assert.equal(US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de SS Stephen Hopkins"], "Combate naval del SS Stephen Hopkins");
assert.ok(
  Object.values(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === "Segunda Guerra Mundial"
      && detail.parent === detail.war
      && detail.campaign
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.[0]?.url
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda de la Segunda Guerra Mundial debe conservar jerarquia, fuentes y contexto editorial"
);
assert.equal(Object.keys(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 27);
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del cañón White Bird"].parent, "Guerra de los Nez Perce");
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Little Bighorn"].startYear, 1876);
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del lago Stony"].campaign, "Expedición de Sibley de 1863");
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Withlacoochee"].parent, "Segunda Guerra Seminola");
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Escaramuza del arroyo Warbonnet"].type, "escaramuza");
assert.equal(US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Little Big Horn"], "Batalla de Little Bighorn");
assert.equal(US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Ouithlacoochie"], "Batalla de Withlacoochee");
assert.equal(US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Lake Okeechobee"], "Batalla del lago Okeechobee");
assert.ok(
  Object.values(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.cause
      && detail.outcome
      && detail.consequences
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda de guerras indígenas debe conservar jerarquia, fuentes, participantes y cierre editorial explícito"
);
assert.equal(Object.keys(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 14);
assert.equal(Object.keys(US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 8);
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del paso Apache"].startYear, 1862);
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque a Fort Apache"].campaign, "Crisis de Cibecue y Fort Apache de 1881");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque a Fort Apache"].type, "ataque");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del río Tongue"].parent, "Guerras de las llanuras");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Masacre de Skeleton Cave"].type, "masacre");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de los Árboles Caídos"].treaties[0], "Tratado de Greenville (1795)");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Cieneguilla"].participants[0].casualties, "22 muertos y 23 heridos");
assert.equal(US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES["Battle of the Tongue River"], "Batalla del río Tongue");
assert.equal(US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Salt River Canyon"], "Masacre de Skeleton Cave");
assert.ok(
  Object.values(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.year === detail.startYear
      && detail.chronology?.[0]?.event
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la segunda tanda fronteriza debe conservar fecha, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 10);
assert.equal(Object.keys(US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 10);
assert.equal(
  US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Kenapacomaqua"],
  "Ataque a Kenapacomaqua (1791)"
);
assert.equal(
  US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Devil's River"],
  "Combate del río Devils (1857)"
);
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Masacre de Claremore Mound (1817)"].type, "ataque y masacre");
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate de Sink Hole (1815)"].treaties[0], "Tratado de Gante (1814)");
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Pima Butte (1857)"].type, "batalla intertribal");
assert.match(
  US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Pima Butte (1857)"].curationNote,
  /únicamente geográfica/i
);
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate atribuido de Bandera Pass (c. 1842)"].hierarchyConfidence, "media");
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate atribuido de Bandera Pass (c. 1842)"].sourceDispute, true);
assert.equal(
  US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate atribuido de Bandera Pass (c. 1842)"].datePrecision,
  "aproximada y disputada"
);
assert.match(
  US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate del río Devils (1857)"].curationNote,
  /difieren.*bajas indígenas/i
);
assert.ok(
  Object.values(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.year === detail.startYear
      && detail.chronology?.[0]?.event
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationNote
  ),
  "la nueva tanda fronteriza debe conservar fecha, jerarquia, fuentes, participantes y cautelas historiograficas"
);
assert.equal(Object.keys(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 10);
assert.equal(Object.keys(US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 4);
assert.deepEqual(US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Nicaragua, [
  "Batalla de Masaya",
  "Batalla de La Paz Centro",
  "Batalla de Ocotal",
  "Batalla de Telpaneca",
  "Batalla de Sapotillal",
  "Segunda batalla de Las Cruces (1928)",
  "Batalla de El Sauce"
]);
assert.equal(US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["Haití"][0], "Batalla de Fort Rivière");
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Masaya"].startYear, 1912);
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Ocotal"].parent, "Guerra de Sandino");
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Telpaneca"].conflictType, "insurgencia");
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Fort Rivière"].startYear, 1915);
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Incursión naval de Puerto Plata (1800)"].parent, "Cuasi-Guerra");
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Puerto Plata (1916)"].region, "Puerto Plata, República Dominicana");
assert.equal(US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Las Cruces"], "Segunda batalla de Las Cruces (1928)");
assert.equal(US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Fort Riviere"], "Batalla de Fort Rivière");
assert.ok(
  Object.values(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.year === detail.startYear
      && detail.chronology?.[0]?.event
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la tanda de Nicaragua y Caribe debe conservar fecha, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 11);
assert.equal(Object.keys(AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 4);
assert.deepEqual(AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["Timor Oriental"], ["Batalla de Aidabasalala"]);
assert.deepEqual(AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Alemania, ["Batalla de Schleswig (1848)", "Batalla de Isted"]);
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Aidabasalala"].startYear, 1999);
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Broodseinde"].parent, "Primera Guerra Mundial");
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Primera batalla de Dernancourt"].startYear, 1918);
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Isted"].parent, "Primera Guerra de Schleswig");
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ocupacion indonesia de Timor Oriental"].endYear, 1999);
assert.equal(cleanConflictLabel("Ocupación indonesia de Timor Oriental"), "Ocupacion indonesia de Timor Oriental");
assert.ok(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES[cleanConflictLabel("Ocupación indonesia de Timor Oriental")]);
assert.equal(
  AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES[cleanConflictLabel("Invasión indonesia de Timor Oriental")],
  "Invasion indonesia de Timor Oriental (1975)"
);
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Crisis de Timor Oriental de 2006"].startYear, 2006);
assert.notEqual(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Invasion indonesia de Timor Oriental (1975)"].parent, "Segunda Guerra Mundial");
assert.notEqual(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Crisis de Timor Oriental de 2006"].campaign, "Guerra del Pacífico de la Segunda Guerra Mundial");
assert.equal(
  AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla entre el HMAS Sydney y el Kormoran"],
  "Combate naval entre el HMAS Sydney y el Kormoran (1941)"
);
assert.ok(
  Object.values(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && Number.isInteger(detail.endYear)
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 1
      && detail.chronology.every(item => Number.isInteger(item.year) && item.event)
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la tanda de Australia, Dinamarca y Timor debe conservar fecha, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 9);
assert.equal(Object.keys(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 10);
assert.equal(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Dry Lake"], "Batalla de Dry Lake (1873)");
assert.equal(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Sand Butte"], "Batalla de Dry Lake (1873)");
assert.equal(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Turner's Falls"], "Masacre de Peskeompskut (1676)");
assert.equal(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Kelley Creek"], "Masacre de Kelley Creek (1911)");
assert.equal(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del cañón de Ojo Caliente (1854)"].parent, "Guerra jicarilla");
assert.equal(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Dry Lake (1873)"].parent, "Guerra modoc");
assert.equal(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Turret Peak (1873)"].parent, "Guerra tonto");
assert.equal(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate de Bear Valley (1918)"].conflictType, "frontera");
assert.match(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Masacre de Kelley Creek (1911)"].curationNote, /persecución policial/i);
assert.ok(
  Object.values(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.endYear === detail.startYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 1
      && detail.chronology.every(item => Number.isInteger(item.year) && item.event)
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la tanda indígena estadounidense debe conservar jerarquia, fuentes, participantes y cautelas editoriales"
);
assert.equal(Object.keys(US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 10);
assert.equal(Object.keys(US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 10);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Norwalk"],
  "Incursión de Norwalk (1779)"
);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Wetzell's Mill"],
  "Escaramuza de Wetzell's Mill (1781)"
);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque a Lindley's Fort (1776)"].parent,
  "Guerra cheroqui de 1776"
);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Saint-Pierre (1776)"].campaign,
  "Invasión de Quebec de 1775-1776"
);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES["Escaramuza de Wetzell's Mill (1781)"].type,
  "escaramuza"
);
assert.match(
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de San Luis (1780)"].curationNote,
  /naciones indígenas/i
);
assert.ok(
  Object.values(US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.endYear === detail.startYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 1
      && detail.chronology.every(item => Number.isInteger(item.year) && item.event)
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la tercera tanda revolucionaria debe conservar fecha, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 26);
assert.equal(Object.keys(BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 18);
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Abbeville"].campaign, "Batalla de Francia");
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Heraclión"].campaign, "Batalla de Creta");
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del mar de Barents"].type, "batalla naval");
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Ptolemaida"].startYear, 1941);
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del mar de Liguria"].startYear, 1945);
assert.equal(BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Britain Day"], "Día de la Batalla de Inglaterra");
assert.equal(BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Bay de Biscay"], "Batalla del golfo de Vizcaya");
assert.equal(BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Merville Gun Battery"], "Batalla de la batería de Merville");
assert.ok(
  Object.values(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === "Segunda Guerra Mundial"
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.event
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.[0]?.url
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda británica de la Segunda Guerra Mundial debe conservar fechas, jerarquia, fuentes y contexto editorial"
);
assert.equal(Object.keys(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 22);
assert.equal(Object.keys(US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 8);
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Beicang"].parent, "Rebelion de los Boxers");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Ust-Padenga"].campaign, "Intervencion aliada en el norte de Rusia");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Cantigny"].startYear, 1918);
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de El Guettar"].parent, "Segunda Guerra Mundial");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate aéreo del aeródromo de Suwon"].type, "combate aéreo");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque al campamento de Hiep Hoa"].conflictType, "insurgencia");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del Aeropuerto Internacional de Bagdad"].startYear, 2004);
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del Aeropuerto Internacional de Bagdad"].campaign, "Levantamiento del Ejército del Mahdi de 2004");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Do Ab"].parent, "Guerra de Afganistán");
assert.equal(US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Ch-teau-Thierry"], "Batalla de Château-Thierry");
assert.equal(US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de BIAP"], "Batalla del Aeropuerto Internacional de Bagdad");
assert.equal(US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Shok Valley"], "Batalla del valle de Shok");
assert.ok(
  Object.values(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.year === detail.startYear
      && detail.chronology?.[0]?.event
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.[0]?.url
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda ultramarina estadounidense debe conservar fechas, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 4);
assert.equal(Object.keys(ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 1);
assert.equal(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Ras Kamboni (2024)"].parent, "Crisis de Jubalandia de 2024");
assert.equal(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Tinzawatène (2024)"].parent, "Guerra de Malí");
assert.equal(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ofensiva de Fano en Amhara de 2024"].type, "ofensiva");
assert.equal(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Boulikessi (2025)"].conflictType, "insurgencia");
assert.equal(
  ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES["Ofensiva de Amhara de 2024"],
  "Ofensiva de Fano en Amhara de 2024"
);
assert.ok(
  Object.values(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda africana reciente debe conservar jerarquia, cautelas editoriales, dos fuentes y participantes reales"
);
assert.equal(Object.keys(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 12);
assert.equal(Object.keys(JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 12);
assert.equal(JAPAN_KOREA_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["Corea del Sur"].length, 12);
assert.deepEqual(
  JAPAN_KOREA_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["República Popular China"],
  ["Batalla naval de Noryang (1598)"]
);
assert.equal(JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Happo"], "Acción naval de Happo (1592)");
assert.equal(
  JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Danghangpo"],
  "Primera batalla naval de Danghangpo (1592)"
);
assert.equal(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Acción naval de Happo (1592)"].type, "acción naval");
assert.equal(
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque al fondeadero de Jeokjinpo (1592)"].type,
  "ataque a fondeadero"
);
assert.equal(
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Escaramuza naval de Eoranpo (1597)"].type,
  "escaramuza naval"
);
assert.equal(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Busan (1592)"].sourceDispute, true);
assert.equal(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Jeolido (1598)"].sourceDispute, true);
assert.deepEqual(
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Noryang (1598)"].participants[0].members,
  ["Reino de Joseon", "Imperio Ming"]
);
assert.ok(
  Object.values(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === "Invasiones japonesas de Corea (1592-1598)"
      && detail.war === detail.parent
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 1
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-japan-korea-naval-followup-2026-07"
      && detail.curationNote
  ),
  "la tanda naval de Imjin debe conservar fechas, jerarquia, fuentes, participantes y cautelas editoriales"
);
assert.equal(Object.keys(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 12);
assert.equal(Object.keys(FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 12);
assert.equal(FRANCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"].length, 9);
assert.deepEqual(FRANCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Rusia, [
  "Sitio de Bomarsund (1854)",
  "Batalla de Craonne (1814)",
  "Batalla de Golymin (1806)",
  "Batalla de Heilsberg (1807)"
]);
assert.equal(
  FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Bantry Bay"],
  "Batalla naval de la bahía de Bantry (1689)"
);
assert.equal(
  FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Chandannagar"],
  "Asedio y captura de Chandannagar (1757)"
);
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Sitio de Bomarsund (1854)"].type, "sitio y operación anfibia");
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Camaret (1694)"].type, "asalto anfibio");
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de la bahía de Bantry (1689)"].sourceDispute, true);
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Heilsberg (1807)"].sourceDispute, true);
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de la bahía de Chesapeake (1781)"].sourceDispute, true);
assert.ok(
  Object.values(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-france-followup-2026-07"
      && detail.curationNote
  ),
  "la tanda francesa debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
const explicitBattleWithoutTreaty = curateConflictEntry({
  name: "Batalla de prueba sin tratado",
  startYear: 1944,
  endYear: 1944,
  parent: "Segunda Guerra Mundial",
  campaign: "Campaña de prueba",
  type: "batalla",
  treaties: []
});
assert.deepEqual(explicitBattleWithoutTreaty.treaties, [], "una lista vacia curada no debe convertirse en un tratado ficticio");
const englishWikipediaOverride = await resolveWikipediaConflictTitle("Segunda batalla de Fort McAllister");
assert.equal(englishWikipediaOverride.language, "en");
assert.match(englishWikipediaOverride.apiUrl, /^https:\/\/en\.wikipedia\.org\//);
assert.equal(englishWikipediaOverride.pageTitle, "Second_Battle_of_Fort_McAllister");
const stephenHopkinsWikipediaOverride = await resolveWikipediaConflictTitle("Combate naval del SS Stephen Hopkins");
assert.equal(stephenHopkinsWikipediaOverride.language, "en");
assert.match(stephenHopkinsWikipediaOverride.apiUrl, /^https:\/\/en\.wikipedia\.org\//);
assert.equal(stephenHopkinsWikipediaOverride.pageTitle, "SS_Stephen_Hopkins");
const littleBighornWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Little Bighorn");
assert.equal(littleBighornWikipediaOverride.language, "en");
assert.match(littleBighornWikipediaOverride.apiUrl, /^https:\/\/en\.wikipedia\.org\//);
assert.equal(littleBighornWikipediaOverride.pageTitle, "Battle_of_the_Little_Bighorn");
const fortSlongoWikipediaOverride = await resolveWikipediaConflictTitle("Asalto a Fort Slongo (1781)");
assert.equal(fortSlongoWikipediaOverride.language, "en");
assert.equal(fortSlongoWikipediaOverride.pageTitle, "Battle_of_Fort_Slongo");
const barentsWikipediaOverride = await resolveWikipediaConflictTitle("Batalla del mar de Barents");
assert.equal(barentsWikipediaOverride.language, "en");
assert.match(barentsWikipediaOverride.apiUrl, /^https:\/\/en\.wikipedia\.org\//);
assert.equal(barentsWikipediaOverride.pageTitle, "Battle_of_the_Barents_Sea");
const hiepHoaWikipediaOverride = await resolveWikipediaConflictTitle("Ataque al campamento de Hiep Hoa");
assert.equal(hiepHoaWikipediaOverride.language, "en");
assert.equal(hiepHoaWikipediaOverride.pageTitle, "Battle_of_Hiep_Hoa");
const biapWikipediaOverride = await resolveWikipediaConflictTitle("Batalla del Aeropuerto Internacional de Bagdad");
assert.equal(biapWikipediaOverride.language, "en");
assert.equal(biapWikipediaOverride.pageTitle, "Battle_of_Baghdad_International_Airport");
const doAbWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Do Ab");
assert.equal(doAbWikipediaOverride.language, "en");
assert.equal(doAbWikipediaOverride.pageTitle, "Battle_of_Do_Ab");
const rasKamboniWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Ras Kamboni (2024)");
assert.equal(rasKamboniWikipediaOverride.language, "en");
assert.equal(rasKamboniWikipediaOverride.pageTitle, "Battle_of_Ras_Kamboni_(2024)");
const tinzawateneWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Tinzawatène (2024)");
assert.equal(tinzawateneWikipediaOverride.language, "es");
assert.equal(tinzawateneWikipediaOverride.pageTitle, "Batalla_de_Tinzawatène_(2024)");
const amharaWikipediaOverride = await resolveWikipediaConflictTitle("Ofensiva de Fano en Amhara de 2024");
assert.equal(amharaWikipediaOverride.language, "en");
assert.equal(amharaWikipediaOverride.pageTitle, "Amhara_offensive");
const boulikessiWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Boulikessi (2025)");
assert.equal(boulikessiWikipediaOverride.language, "en");
assert.equal(boulikessiWikipediaOverride.pageTitle, "Battle_of_Boulikessi_(2025)");
const happoWikipediaOverride = await resolveWikipediaConflictTitle("Acción naval de Happo (1592)");
assert.equal(happoWikipediaOverride.language, "en");
assert.equal(happoWikipediaOverride.pageTitle, "Battle_of_Happo");
const yulpoWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Yulpo (1592)");
assert.equal(yulpoWikipediaOverride.language, "en");
assert.equal(yulpoWikipediaOverride.pageTitle, "List_of_naval_battles_during_the_Imjin_War");
const bantryWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de la bahía de Bantry (1689)");
assert.equal(bantryWikipediaOverride.language, "en");
assert.equal(bantryWikipediaOverride.pageTitle, "Battle_of_Bantry_Bay");
const chandannagarWikipediaOverride = await resolveWikipediaConflictTitle("Asedio y captura de Chandannagar (1757)");
assert.equal(chandannagarWikipediaOverride.language, "en");
assert.equal(chandannagarWikipediaOverride.pageTitle, "Battle_of_Chandannagar");
const chesapeakeWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de la bahía de Chesapeake (1781)");
assert.equal(chesapeakeWikipediaOverride.language, "en");
assert.equal(chesapeakeWikipediaOverride.pageTitle, "Battle_of_the_Chesapeake");
const spanishWikipediaOverride = await resolveWikipediaConflictTitle("Guerra de Corea");
assert.equal(spanishWikipediaOverride.language, "es");
assert.match(spanishWikipediaOverride.apiUrl, /^https:\/\/es\.wikipedia\.org\//);

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
          { name: "Batalla de Norwalk" },
          { name: "Batalla de Fort Slongo" },
          { name: "Batalla de Happo" },
          { name: "Batalla de Bantry Bay" },
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
assert.ok(!report.topAdvisories.some(item => item.name === "Incursión de Norwalk (1779)"), "Norwalk debe usar su campaña verificada de 1779");
assert.ok(!report.topAdvisories.some(item => item.name === "Asalto a Fort Slongo (1781)"), "Fort Slongo debe usar su jerarquía verificada de 1781");
assert.ok(
  !report.topAdvisories.some(item => item.name === "Batalla naval de la bahía de Bantry (1689)"),
  "Bantry debe usar su fecha y jerarquía verificadas"
);
assert.ok(!report.topIssues.some(item => item.name === "Batalla de Manila"), "el nombre ambiguo de Manila no debe reaparecer en la auditoria");
assert.ok(!report.topAdvisories.some(item => item.name === "Sitio de Fort Wayne"), "Fort Wayne debe usar la guerra de 1812");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla del río Canard"), "River Canard debe quedar traducida y jerarquizada");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Horseshoe Bend"), "Horseshoe Bend debe usar Guerra Creek");
assert.ok(!report.topAdvisories.some(item => item.name === "Acción naval de Happo (1592)"), "Happo debe usar la guerra de Imjin verificada");

console.log("conflict-autofix.test.js ok");
