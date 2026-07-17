import fetch from "node-fetch";
import fs from "fs-extra";

const WIKIPEDIA_API_ES = "https://es.wikipedia.org/w/api.php";
const WIKIPEDIA_API_EN = "https://en.wikipedia.org/w/api.php";

export const CONFLICT_WIKIPEDIA_TITLE_OVERRIDES = {
  "Primera Guerra Mundial": "Primera_Guerra_Mundial",
  "Segunda Guerra Mundial": "Segunda_Guerra_Mundial",
  "Guerra de Corea": "Guerra_de_Corea",
  "Guerra de Vietnam": "Guerra_de_Vietnam",
  "Guerra del Golfo": "Guerra_del_Golfo",
  "Guerra de Afganistan": "Guerra_de_Afganistán_(2001-2021)",
  "Guerra de Afganistán": "Guerra_de_Afganistán_(2001-2021)",
  "Guerra de Irak": "Guerra_de_Irak",
  "Guerra civil siria": "Guerra_civil_siria",
  "Guerra civil espanola": "Guerra_civil_española",
  "Guerra Iran-Iraq": "Guerra_Irán-Irak",
  "Guerra ruso-japonesa": "Guerra_ruso-japonesa",
  "Guerra de Argelia": "Guerra_de_Argelia",
  "Guerra del Pacifico": "Guerra_del_Pacífico",
  "Guerra del Chaco": "Guerra_del_Chaco",
  "Guerra de la Triple Alianza": "Guerra_de_la_Triple_Alianza",
  "Guerra de las Malvinas": "Guerra_de_las_Malvinas",
  "Guerra civil china": "Guerra_civil_china",
  "Guerra rusoucraniana": "Invasión_rusa_de_Ucrania_de_2022",
  "Guerra arabe-israeli de 1948": "Guerra_árabe-israelí_de_1948",
  "Primera intifada": "Primera_Intifada",
  "Segunda intifada": "Segunda_Intifada",
  "Operación Deliberate Force": "Operación_Deliberate_Force",
  "Operacion Deliberate Force": "Operación_Deliberate_Force",
  "Conflicto de Sa'dah": "Insurgencia_huzí_en_Yemen",
  "Guerra por el agua del río Jordán": "Guerra_por_el_agua",
  "Guerra por el agua del rio Jordan": "Guerra_por_el_agua",
  "1984 DMZ incident": "Incidente_de_la_ZDC_de_1984",
  "Campaña en África del Suroeste": "Campaña_de_África_del_Sudoeste",
  "Campana en Africa del Suroeste": "Campaña_de_África_del_Sudoeste",
  "Guerra en el noroeste de Pakistán": "Guerra_en_el_noroeste_de_Pakistán",
  "Batalla de Amiens": "Batalla_de_Amiens_(1918)",
  "Batalla de Manila (1899)": "Batalla_de_Manila_(1899)",
  "Batalla de Manila (1945)": "Batalla_de_Manila_(1945)",
  "Sitio de Fort Wayne": "Siege_of_Fort_Wayne",
  "Batalla del río Canard": "Battle_of_River_Canard",
  "Batalla de las alturas de Queenston": "Battle_of_Queenston_Heights",
  "Incursión sobre Black Rock": "Raid_on_Black_Rock",
  "Incursión sobre Havre de Grace": "Raid_on_Havre_de_Grace",
  "Combate naval entre el HMS Shannon y el USS Chesapeake": "Capture_of_USS_Chesapeake",
  "Batalla de Saint Michaels": "Battle_of_St._Michaels",
  "Batalla del puente del Altamaha": "Battle_of_Altamaha_Bridge",
  "Batalla de Brice's Cross Roads": "Battle_of_Brice's_Cross_Roads",
  "Batalla de Cedar Creek": "Battle_of_Cedar_Creek",
  "Batalla de Columbus de 1865": "Battle_of_Columbus_(1865)",
  "Batalla de Corrick's Ford": "Battle_of_Corrick's_Ford",
  "Batalla de Devil's Backbone": "Battle_of_Devil's_Backbone",
  "Segunda batalla de Fort McAllister": "Second_Battle_of_Fort_McAllister",
  "Batalla de Fredericksburg": "Battle_of_Fredericksburg",
  "Batalla del puerto de Galveston de 1862": "Battle_of_Galveston_Harbor_(1862)",
  "Batalla de Head of Passes": "Battle_of_the_Head_of_Passes",
  "Batalla de Helena": "Battle_of_Helena",
  "Batalla de Lexington, Tennessee": "Battle_of_Lexington,_Tennessee",
  "Batalla de Mansfield": "Battle_of_Mansfield",
  "Batalla naval de Memphis": "First_Battle_of_Memphis",
  "Batalla de Pleasant Hill": "Battle_of_Pleasant_Hill",
  "Batalla de Selma": "Battle_of_Selma",
  "Batalla de Spotsylvania Court House": "Battle_of_Spotsylvania_Court_House",
  "Batalla naval de St. Charles": "Battle_of_Saint_Charles",
  "Primera batalla de Collierville": "First_Battle_of_Collierville",
  "Segunda batalla de Collierville": "Second_Battle_of_Collierville",
  "Batalla de Bairoko": "Battle_of_Bairoko",
  "Batalla de Dutch Harbor": "Battle_of_Dutch_Harbor",
  "Batalla de las islas Komandorski": "Battle_of_the_Komandorski_Islands",
  "Batalla del estrecho de Blackett": "Battle_of_Blackett_Strait",
  "Batalla del estrecho de Makassar": "Battle_of_Makassar_Strait",
  "Batalla del estrecho de Surigao": "Battle_of_Surigao_Strait",
  "Batalla del golfo de Kula": "Battle_of_Kula_Gulf",
  "Batalla del mar de Sibuyán": "Battle_of_the_Sibuyan_Sea",
  "Batalla naval de Vella Lavella": "Battle_of_Vella_Lavella",
  "Batalla de Tassafaronga": "Battle_of_Tassafaronga",
  "Batalla de Tenaru": "Battle_of_the_Tenaru",
  "Batalla de Talasea": "Battle_of_Talasea",
  "Combate naval del SS Stephen Hopkins": "SS_Stephen_Hopkins",
  "Batalla de Saint-Lô": "Battle_of_Saint-Lô",
  "Batalla de Saint-Vith": "Battle_of_St._Vith",
  "Batalla de Stillman's Run": "Battle_of_Stillman's_Run",
  "Batalla del fuerte Apple River": "Battle_of_Apple_River_Fort",
  "Batalla de Kellogg's Grove": "Battle_of_Kellogg's_Grove",
  "Batalla de Wisconsin Heights": "Battle_of_Wisconsin_Heights",
  "Batalla del cañón White Bird": "Battle_of_White_Bird_Canyon",
  "Batalla de Big Hole": "Battle_of_the_Big_Hole",
  "Batalla de Camas Meadows": "Battle_of_Camas_Creek",
  "Batalla de Canyon Creek": "Battle_of_Canyon_Creek",
  "Batalla del río Powder": "Battle_of_the_Powder_River",
  "Batalla de Rosebud": "Battle_of_the_Rosebud",
  "Batalla de Little Bighorn": "Battle_of_the_Little_Bighorn",
  "Escaramuza del arroyo Warbonnet": "Battle_of_Warbonnet_Creek",
  "Batalla de Wolf Mountain": "Battle_of_Wolf_Mountain",
  "Batalla de Big Mound": "Battle_of_Big_Mound",
  "Batalla del lago Dead Buffalo": "Battle_of_Dead_Buffalo_Lake",
  "Batalla del lago Stony": "Battle_of_Stony_Lake",
  "Batalla de Withlacoochee": "Battle_of_Withlacoochee",
  "Batalla de San Felasco Hammock": "Battle_of_San_Felasco_Hammock",
  "Batalla del lago Okeechobee": "Battle_of_Lake_Okeechobee",
  "Batalla de Pine Island Ridge": "Battle_of_Pine_Island_Ridge",
  "Batalla del Caloosahatchee": "Battle_of_the_Caloosahatchee",
  "Batalla del brazo norte del río Red": "Battle_of_the_North_Fork_of_the_Red_River",
  "Segunda batalla de Adobe Walls": "Second_Battle_of_Adobe_Walls",
  "Batalla del cañón de Palo Duro": "Battle_of_Palo_Duro_Canyon",
  "Batalla de Tippecanoe": "Battle_of_Tippecanoe",
  "Batalla de Lost River": "Battle_of_Lost_River",
  "Batalla del arroyo Toppenish": "Battle_of_Toppenish_Creek",
  "Batalla del paso Apache": "Battle_of_Apache_Pass",
  "Batalla del arroyo Cibecue": "Battle_of_Cibecue_Creek",
  "Ataque a Fort Apache": "Battle_of_Fort_Apache",
  "Batalla de Big Dry Wash": "Battle_of_Big_Dry_Wash",
  "Batalla de Ash Hollow": "Battle_of_Ash_Hollow",
  "Batalla del río Tongue": "Battle_of_the_Tongue_River",
  "Batalla del cañón Blanco": "Battle_of_Blanco_Canyon",
  "Batalla del río Pease": "Battle_of_Pease_River",
  "Batalla de Summit Springs": "Battle_of_Summit_Springs",
  "Masacre de Skeleton Cave": "Skeleton_Cave_(Arizona)",
  "Batalla de los Árboles Caídos": "Battle_of_Fallen_Timbers",
  "Batalla de Piqua": "Battle_of_Piqua",
  "Batalla de Quebec": "Battle_of_Quebec_(1775)",
  "Batalla de Cieneguilla": "Battle_of_Cieneguilla",
  "Ataque a Kenapacomaqua (1791)": "Battle_of_Kenapacomaqua",
  "Masacre de Claremore Mound (1817)": "Battle_of_Claremore_Mound",
  "Combate de Sink Hole (1815)": "Battle_of_the_Sink_Hole",
  "Combate atribuido de Bandera Pass (c. 1842)": "Battle_of_Bandera_Pass",
  "Escaramuza de Cooke's Spring (1857)": "Battle_of_Cooke's_Spring",
  "Batalla de Pima Butte (1857)": "Battle_of_Pima_Butte",
  "Combate del río Devils (1857)": "Battle_of_Devil's_River",
  "Batalla del río Owyhee (1866)": "Battle_of_Owyhee_River",
  "Combate de Prairie Dog Creek (1867)": "Battle_of_Prairie_Dog_Creek",
  "Combate de Honsinger Bluff (1873)": "Battle_of_Honsinger_Bluff",
  "Batalla de Masaya": "Battle_of_Masaya",
  "Batalla de La Paz Centro": "Battle_of_La_Paz_Centro",
  "Batalla de Ocotal": "Battle_of_Ocotal",
  "Batalla de Telpaneca": "Battle_of_Telpaneca",
  "Batalla de Sapotillal": "Battle_of_Sapotillal",
  "Segunda batalla de Las Cruces (1928)": "Battle_of_Las_Cruces_(1928)",
  "Batalla de El Sauce": "Battle_of_El_Sauce",
  "Batalla de Fort Rivière": "Battle_of_Fort_Rivière",
  "Incursión naval de Puerto Plata (1800)": "Battle_of_Puerto_Plata_Harbor",
  "Batalla de Puerto Plata (1916)": "Battle_of_Puerto_Plata",
  "Batalla de Aidabasalala": "Battle_of_Aidabasalala",
  "Batalla de Broodseinde": "Battle_of_Broodseinde",
  "Combate naval entre el HMAS Sydney y el Kormoran (1941)": "Battle_between_HMAS_Sydney_and_German_auxiliary_cruiser_Kormoran",
  "Primera batalla de Dernancourt": "First_Battle_of_Dernancourt",
  "Batalla de Bov": "Battle_of_Bov",
  "Batalla de Schleswig (1848)": "Battle_of_Schleswig",
  "Batalla de Fredericia": "Battle_of_Fredericia",
  "Batalla de Isted": "Battle_of_Isted",
  "Invasion indonesia de Timor Oriental (1975)": "Indonesian_invasion_of_East_Timor",
  "Invasión indonesia de Timor Oriental (1975)": "Indonesian_invasion_of_East_Timor",
  "Ocupacion indonesia de Timor Oriental": "Indonesian_occupation_of_East_Timor",
  "Ocupación indonesia de Timor Oriental": "Indonesian_occupation_of_East_Timor",
  "Crisis de Timor Oriental de 2006": "2006_East_Timorese_crisis",
  "Masacre de Peskeompskut (1676)": "Battle_of_Turner's_Falls",
  "Combate de Sudbury (1676)": "Sudbury_Fight",
  "Batalla del cañón de Ojo Caliente (1854)": "Battle_of_Ojo_Caliente_Canyon",
  "Ataque a Fort Buchanan (1865)": "Battle_of_Fort_Buchanan",
  "Batalla de Dry Lake (1873)": "Battle_of_Dry_Lake",
  "Batalla de Turret Peak (1873)": "Battle_of_Turret_Peak",
  "Combate de Sugar Point (1898)": "Battle_of_Sugar_Point",
  "Masacre de Kelley Creek (1911)": "Battle_of_Kelley_Creek",
  "Combate de Bear Valley (1918)": "Battle_of_Bear_Valley",
  "Batalla de Kemp's Landing (1775)": "Battle_of_Kemp's_Landing",
  "Ataque a Lindley's Fort (1776)": "Battle_of_Lindley's_Fort",
  "Batalla de Longue-Pointe (1775)": "Battle_of_Longue-Pointe",
  "Batalla de Saint-Pierre (1776)": "Battle_of_Saint-Pierre",
  "Incursión de Norwalk (1779)": "Battle_of_Norwalk_(Connecticut)",
  "Batalla de San Luis (1780)": "Battle_of_St._Louis",
  "Combate de Mobley's Meeting House (1780)": "Battle_of_Mobley's_Meeting_House",
  "Batalla de Shallow Ford (1780)": "Battle_of_Shallow_Ford",
  "Escaramuza de Wetzell's Mill (1781)": "Battle_of_Wetzell's_Mill",
  "Asalto a Fort Slongo (1781)": "Battle_of_Fort_Slongo",
  "Batalla de Abbeville": "Battle_of_Abbeville",
  "Batalla de Arras": "Battle_of_Arras_(1940)",
  "Batalla aérea de Atenas": "Battle_of_Athens_(1941)",
  "Batalla del mar de Barents": "Battle_of_the_Barents_Sea",
  "Batalla del golfo de Vizcaya": "Battle_of_the_Bay_of_Biscay",
  "Batalla de Bréville": "Battle_of_Bréville",
  "Día de la Batalla de Inglaterra": "Battle_of_Britain_Day",
  "Batalla del cabo Norte": "Battle_of_North_Cape",
  "Batalla del cabo Teulada": "Battle_of_Cape_Spartivento",
  "Batalla de Calabria": "Battle_of_Calabria",
  "Batalla del convoy Cigno": "Battle_of_the_Cigno_Convoy",
  "Batalla de la estación de radar de Douvres": "Battle_of_Douvres_Radar_Station",
  "Batalla del convoy Duisburg": "Battle_of_the_Duisburg_Convoy",
  "Combate de Graveney Marsh": "Battle_of_Graveney_Marsh",
  "Batalla de Heraclión": "Battle_of_Heraklion",
  "Batalla de Kuala Lumpur": "Battle_of_Kuala_Lumpur",
  "Batalla del mar de Liguria": "Battle_of_the_Ligurian_Sea",
  "Batalla de la batería de Merville": "Battle_of_Merville_Gun_Battery",
  "Batalla de Ptolemaida": "Battle_of_Ptolemaida",
  "Batalla del estuario de Forth": "Battle_of_the_River_Forth",
  "Batalla del banco de Skerki": "Battle_of_Skerki_Bank",
  "Batalla del convoy Tarigo": "Battle_of_the_Tarigo_Convoy",
  "Batalla del desfiladero de Tempe": "Battle_of_Tempe_Gorge",
  "Batalla de Villers-Bocage": "Battle_of_Villers-Bocage",
  "Batalla del estrecho de Dinamarca": "Battle_of_the_Denmark_Strait",
  "Segunda batalla de Sirte": "Second_Battle_of_Sirte",
  "Batalla de Beicang": "Battle_of_Beicang",
  "Batalla de Yangcun": "Battle_of_Yangcun",
  "Batalla de Bolshie Ozerki": "Battle_of_Bolshie_Ozerki",
  "Batalla de Ust-Padenga": "Battle_of_Ust_Padenga",
  "Batalla de Cantigny": "Battle_of_Cantigny",
  "Batalla de Château-Thierry": "Battle_of_Château-Thierry_(1918)",
  "Batalla de El Guettar": "Battle_of_El_Guettar",
  "Batalla de Pyongtaek": "Battle_of_Pyongtaek",
  "Batalla de Ap Bac": "Battle_of_Ap_Bac",
  "Ataque al campamento de Hiep Hoa": "Battle_of_Hiep_Hoa",
  "Batalla de Ong Thanh": "Battle_of_Ong_Thanh",
  "Batalla de la base de fuego Mary Ann": "Battle_of_Firebase_Mary_Ann",
  "Batalla de Snuol": "Battle_of_Snuol",
  "Batalla de Al Busayyah": "Battle_of_Al_Busayyah",
  "Batalla de la cresta de Medina": "Battle_of_Medina_Ridge",
  "Batalla del aeródromo de Jalibah": "Battle_for_Jalibah_Airfield",
  "Batalla del Aeropuerto Internacional de Bagdad": "Battle_of_Baghdad_International_Airport",
  "Batalla de Husaybah": "Battle_of_Husaybah",
  "Batalla de Ganjgal": "Battle_of_Ganjgal",
  "Batalla del valle de Shok": "Battle_of_Shok_Valley",
  "Batalla de Do Ab": "Battle_of_Do_Ab",
  "Batalla de Ras Kamboni (2024)": "Battle_of_Ras_Kamboni_(2024)",
  "Batalla de Tinzawatène (2024)": "Batalla_de_Tinzawatène_(2024)",
  "Ofensiva de Fano en Amhara de 2024": "Amhara_offensive",
  "Batalla de Boulikessi (2025)": "Battle_of_Boulikessi_(2025)",
  "Batalla de la colina Crucifix": "Battle_of_Crucifix_Hill",
  "Batalla de Long Tan": "Batalla_de_Long_Tan",
  "Batalla de Bubiyan": "Batalla_de_Bubiyan",
  "Batalla de Jutlandia": "Batalla_de_Jutlandia",
  "Batalla de Faluya": "Primera_batalla_de_Faluya",
  "Batalla de Kapyong": "Batalla_de_Kapyong",
  "Batalla de Kisangani": "Batalla_de_Kisangani",
  "Acción naval de Happo (1592)": "Battle_of_Happo",
  "Ataque al fondeadero de Jeokjinpo (1592)": "Battle_of_Jeokjinpo",
  "Batalla naval de Sacheon (1592)": "Battle_of_Sacheon_(1592)",
  "Batalla naval de Dangpo (1592)": "Battle_of_Dangpo_(1592)",
  "Primera batalla naval de Danghangpo (1592)": "Battle_of_Danghangpo",
  "Batalla naval de Yulpo (1592)": "List_of_naval_battles_during_the_Imjin_War",
  "Acción naval de Hwajungumi (1592)": "List_of_naval_battles_during_the_Imjin_War",
  "Batalla naval de Busan (1592)": "Battle_of_Busan",
  "Escaramuza naval de Eoranpo (1597)": "List_of_naval_battles_during_the_Imjin_War",
  "Batalla naval de Myeongnyang (1597)": "Battle_of_Myeongnyang",
  "Batalla naval de Jeolido (1598)": "List_of_naval_battles_during_the_Imjin_War",
  "Batalla naval de Noryang (1598)": "Battle_of_Noryang",
  "Batalla naval de la bahía de Bantry (1689)": "Battle_of_Bantry_Bay",
  "Sitio de Bomarsund (1854)": "Battle_of_Bomarsund",
  "Batalla de Camaret (1694)": "Battle_of_Camaret",
  "Batalla naval de Cap-Français (1757)": "Battle_of_Cap-Français",
  "Asedio y captura de Chandannagar (1757)": "Battle_of_Chandannagar",
  "Batalla de Craonne (1814)": "Battle_of_Craonne",
  "Batalla de Golymin (1806)": "Battle_of_Golymin",
  "Batalla naval de la isla de Granada (1779)": "Battle_of_Grenada",
  "Batalla naval de Groix (1795)": "Battle_of_Groix",
  "Batalla de Heilsberg (1807)": "Battle_of_Heilsberg",
  "Batalla naval de la bahía de Chesapeake (1781)": "Battle_of_the_Chesapeake",
  "Batalla naval de la bahía de Quiberon (1759)": "Battle_of_Quiberon_Bay",
  "Combate de Carrizal (1916)": "Battle_of_Carrizal",
  "Batalla de Hamel (1918)": "Battle_of_Hamel",
  "Batalla de la colina 282 (1950)": "Battle_of_Hill_282",
  "Batalla de Ambos Nogales (1918)": "Battle_of_Ambos_Nogales",
  "Combate naval del lago Pontchartrain (1779)": "Battle_of_Lake_Pontchartrain",
  "Batalla de Puerto Príncipe (1919)": "Battle_of_Port-au-Prince_(1919)",
  "Batalla naval del estrecho de Shimonoseki (1863)": "Battle_of_Shimonoseki_Straits",
  "Bombardeo multinacional de Shimonoseki (1864)": "Bombardment_of_Shimonoseki",
  "Bombardeo de San Juan de Puerto Rico (1898)": "Bombardment_of_San_Juan",
  "Batalla de Carillon (1758)": "Battle_of_Carillon",
  "Batalla de Monongahela (1755)": "Battle_of_the_Monongahela",
  "Batalla de Wandiwash (1760)": "Battle_of_Wandiwash",
  "Batalla de Omdurmán (1898)": "Battle_of_Omdurman",
  "Batalla de Qurna (1914)": "Battle_of_Qurna",
  "Batalla naval de Jumunjin (1950)": "Battle_of_Chumonchin_Chan",
  "Batalla de la bahía de Heligoland (1914)": "Battle_of_Heligoland_Bight_(1914)",
  "Primera batalla de Maryang San (1951)": "First_Battle_of_Maryang_San",
  "Asalto a los acorazados Cabral y Lima Barros (1868)": "Asalto_a_los_acorazados_Cabral_y_Lima_Barros",
  "Batalla de Dieppe (1942)": "Battle_of_Dieppe",
  "Batalla de Heligoland (1864)": "Battle_of_Heligoland_(1864)",
  "Batalla de la Bahía de Hudson (1697)": "Battle_of_Hudson's_Bay",
  "Batalla de la Haya (1940)": "Battle_for_The_Hague",
  "Batalla de Rumaila (1991)": "Battle_of_Rumaila",
  "Batalla de Solebay (1672)": "Battle_of_Solebay"
};

const ENGLISH_WIKIPEDIA_TITLE_EXCEPTIONS = new Set([
  "Amhara_offensive",
  "Skeleton_Cave_(Arizona)",
  "List_of_naval_battles_during_the_Imjin_War",
  "Bombardment_of_Shimonoseki",
  "Bombardment_of_San_Juan"
]);

const FIELD_ALIASES = {
  fecha: "date",
  lugar: "place",
  "casus belli": "casusBelli",
  casusbelli: "casusBelli",
  resultado: "result",
  consecuencias: "consequences",
  "cambios territoriales": "territorialChanges",
  "parte de": "partOf",
  "parte del": "partOf",
  beligerantes: "belligerents",
  comandantes: "commanders",
  "figuras politicas": "commanders",
  "fuerzas en combate": "strength",
  bajas: "casualties",
  date: "date",
  location: "place",
  result: "result",
  belligerents: "belligerents",
  commanders: "commanders",
  "commanders and leaders": "commanders",
  strength: "strength",
  casualties: "casualties",
  losses: "casualties",
  "territorial changes": "territorialChanges",
  "part of": "partOf",
  cause: "casusBelli"
};

const COMPLEX_LIST_FIELDS = new Set(["belligerents", "commanders", "strength", "casualties"]);
const WIKIPEDIA_HEADERS = {
  "User-Agent": "GeoRiskConflictImporter/1.0 (educational dataset curation)",
  Accept: "application/json"
};
const WIKIPEDIA_REQUEST_TIMEOUT_MS = 15_000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWikipediaJson(url, attempt = 1) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WIKIPEDIA_REQUEST_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(url, { headers: WIKIPEDIA_HEADERS, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Wikipedia request excedio ${WIKIPEDIA_REQUEST_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 429 && attempt < 4) {
    const retryAfterSeconds = Number(response.headers.get("retry-after"));
    const delayMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
      ? retryAfterSeconds * 1000
      : 1_500 * attempt;
    await sleep(delayMs);
    return fetchWikipediaJson(url, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`Wikipedia request fallo con ${response.status}`);
  }
  return response.json();
}

function decodeHtmlEntities(text = "") {
  return String(text)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#160;/gi, " ")
    .replace(/&#8203;|&#x200b;/gi, " ")
    .replace(/&#8211;|&#x2013;/gi, " - ")
    .replace(/&#8212;|&#x2014;/gi, " - ")
    .replace(/&#8216;|&#8217;/gi, "'")
    .replace(/&#8220;|&#8221;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);?/g, (_, code) => {
      const parsed = Number(code);
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : " ";
    })
    .replace(/&#x([a-f0-9]+);?/gi, (_, code) => {
      const parsed = parseInt(code, 16);
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : " ";
    });
}

function repairMojibakeString(text = "") {
  const value = String(text || "");
  if (!/[ÃÂÅÐ]/.test(value)) {
    return value;
  }

  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
}

function stripTags(html = "") {
  return repairMojibakeString(decodeHtmlEntities(
    String(html)
      .replace(/<sup[\s\S]*?<\/sup>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(?:p|div|li|ul|ol|tr|td|th|tbody|thead|span|a|small|b|strong|i|em)[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\[[^\]]+\]/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim()
  ));
}

function normalizeFieldLabel(value = "") {
  return stripTags(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanInlineText(value = "") {
  return repairMojibakeString(stripTags(value))
    .replace(/â€“|â€”|âˆ’/g, " - ")
    .replace(/â€‹|â€¯|â€¦/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, " ")
    .replace(/&&&&+[^ \n]*/g, " ")
    .replace(/(?:^|\s)0(?:\s|$)/g, " ")
    .replace(/Expresi[^:]{0,40}err[^:]{0,20}nea:[^.;\n]*/gi, " ")
    .replace(/Â·/g, " · ")
    .replace(/Â/g, " ")
    .replace(/\s*†\s*/g, " ")
    .replace(/\s*\.\s*$/g, "")
    .replace(/(?:^|\s)(?:ver|vease|v[eé]ase)\s+el?\s+anexo(?:$|\s)/gi, " ")
    .replace(/\b(?:ver|mostrar|ocultar)\b/gi, " ")
    .replace(/\s*\u00B7\s*/g, " · ")
    .replace(/\?{2,}/g, " - ")
    .replace(/\s*-\s*-\s*/g, " - ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function splitCompoundItems(items = []) {
  return (items || [])
    .flatMap(item => cleanInlineText(item)
      .split(/\n| · | \| |;(?=\s*[A-ZÁÉÍÓÚÑ0-9])|:(?=\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/u)
      .map(part => part.trim())
      .filter(Boolean)
    );
}

function dedupeScalarItems(items = []) {
  const seen = new Set();
  const result = [];
  for (const item of splitCompoundItems(items)) {
    const cleaned = cleanInlineText(item);
    if (!cleaned) continue;
    const collapsed = cleaned
      .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*(?:\s+[\p{L}\p{N}][\p{L}\p{N}.-]*)+)\s+\1\b/gu, "$1")
      .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*)\s+\1\b/gu, "$1");
    const normalized = collapsed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!normalized || normalized === "0" || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(collapsed);
  }
  return result;
}

function shouldDropWikipediaValue(value = "") {
  const cleaned = cleanInlineText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  return !cleaned
    || cleaned === "vease el anexo"
    || cleaned === "ver anexo"
    || cleaned === "vease anexo"
    || (/^v/.test(cleaned) && cleaned.includes("anexo"));
}

function normalizeStructuredWikipediaValue(value) {
  if (Array.isArray(value)) {
    if (value.some(item => Array.isArray(item))) {
      return value
        .map(item => dedupeScalarItems(item).filter(entry => !shouldDropWikipediaValue(entry) && entry !== "0"))
        .filter(item => item.length);
    }
    return dedupeScalarItems(value).filter(entry => !shouldDropWikipediaValue(entry) && entry !== "0");
  }
  const cleaned = cleanInlineText(value);
  return shouldDropWikipediaValue(cleaned) ? "" : cleaned;
}

function extractCoalitionLabel(items = []) {
  const candidates = items.slice(0, 2).filter(Boolean);
  for (const candidate of candidates) {
    const cleaned = cleanInlineText(candidate).replace(/\s*:\s*$/, "");
    const collapsed = cleaned
      .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*(?:\s+[\p{L}\p{N}][\p{L}\p{N}.-]*)+)\s+\1\b/gu, "$1")
      .replace(/\b([\p{L}\p{N}][\p{L}\p{N}.-]*)\s+\1\b/gu, "$1");
    const normalized = collapsed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    if (/^(aliados?|eje|potencias centrales|potencias del eje|onu|otan|coalicion|entente|bando \d+)$/i.test(normalized)) {
      return cleaned;
    }
  }
  return "";
}

function tokenizeForMatch(value = "") {
  return cleanInlineText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(token => token && !["de", "del", "la", "el", "the", "of", "war", "battle", "guerra", "batalla"].includes(token));
}

function extractTemporalHints(value = "") {
  const normalized = cleanInlineText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const years = normalized.match(/\b(1[6-9]\d{2}|20\d{2})\b/g) || [];
  const days = normalized.match(/\b([12]?\d|3[01])\b/g) || [];
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "setiembre", "octubre", "noviembre", "diciembre",
    "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"
  ].filter(month => normalized.includes(month));

  return {
    years: [...new Set(years)],
    days: [...new Set(days.map(String))],
    months: [...new Set(monthNames)]
  };
}

function hasReasonableTitleMatch(conflictName, pageTitle) {
  const conflictTokens = tokenizeForMatch(conflictName);
  const pageTokens = tokenizeForMatch(pageTitle);

  if (!conflictTokens.length || !pageTokens.length) {
    return true;
  }

  const yearsInConflict = conflictName.match(/\b(1[6-9]\d{2}|20\d{2})\b/g) || [];
  const yearsInPage = pageTitle.match(/\b(1[6-9]\d{2}|20\d{2})\b/g) || [];
  if (yearsInConflict.length && yearsInPage.length && !yearsInConflict.some(year => yearsInPage.includes(year))) {
    return false;
  }

  const overlap = conflictTokens.filter(token => pageTokens.includes(token)).length;
  return overlap >= Math.max(1, Math.ceil(conflictTokens.length * 0.35));
}

function hasReasonableTemporalMatch(conflictName, pageTitle = "", infoboxDate = "") {
  const conflictHints = extractTemporalHints(conflictName);
  if (!conflictHints.years.length && !conflictHints.months.length && !conflictHints.days.length) {
    return true;
  }

  const targetHints = extractTemporalHints(`${pageTitle} ${infoboxDate}`);

  if (conflictHints.years.length && !conflictHints.years.some(year => targetHints.years.includes(year))) {
    return false;
  }

  if (conflictHints.months.length && !conflictHints.months.some(month => targetHints.months.includes(month))) {
    return false;
  }

  if (conflictHints.days.length && targetHints.days.length && !conflictHints.days.some(day => targetHints.days.includes(day))) {
    return false;
  }

  return true;
}

function extractListItemsFromHtml(html = "") {
  const liMatches = [...String(html).matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(match => cleanInlineText(match[1]));
  if (liMatches.length) {
    return dedupeScalarItems(liMatches);
  }

  return dedupeScalarItems(
    cleanInlineText(html)
      .split(/\n|\u2022|\u00B7|;(?=\s*[A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D10-9])/)
      .map(item => item.trim())
      .filter(Boolean)
  );
}

function extractFirstInfoboxTable(html = "") {
  const infoboxIndex = html.search(/<table[^>]*class="[^"]*infobox/i);
  if (infoboxIndex === -1) {
    return "";
  }

  let depth = 0;
  let endIndex = -1;
  const tableRegex = /<\/?table\b[^>]*>/gi;
  tableRegex.lastIndex = infoboxIndex;
  let match;
  while ((match = tableRegex.exec(html))) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        endIndex = tableRegex.lastIndex;
        break;
      }
    } else {
      depth += 1;
    }
  }

  return endIndex !== -1 ? html.slice(infoboxIndex, endIndex) : "";
}

function parseInfoboxRows(tableHtml = "") {
  const rows = [];
  const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(tableHtml))) {
    const rowHtml = rowMatch[0];
    const thMatches = [...rowHtml.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)];
    const tdMatches = [...rowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)];

    rows.push({
      rowHtml,
      headerHtml: thMatches.map(match => match[1]),
      dataHtml: tdMatches.map(match => match[1]),
      headerText: thMatches.map(match => cleanInlineText(match[1])).filter(Boolean),
      dataText: tdMatches.map(match => cleanInlineText(match[1])).filter(Boolean)
    });
  }

  return rows;
}

function normalizeInfoboxValue(key, html = "", row = null) {
  if (COMPLEX_LIST_FIELDS.has(key)) {
    const cells = row?.dataHtml?.length ? row.dataHtml : [html];
    const structured = cells
      .map(cellHtml => dedupeScalarItems(extractListItemsFromHtml(cellHtml)))
      .filter(items => items.length);
    if (structured.length > 1) {
      return structured;
    }
    return structured[0] || [];
  }

  if (["consequences", "territorialChanges"].includes(key)) {
    return dedupeScalarItems(extractListItemsFromHtml(html)).filter(item => !shouldDropWikipediaValue(item));
  }

  const cleaned = cleanInlineText(html);
  return shouldDropWikipediaValue(cleaned) ? "" : cleaned;
}

function parseInfobox(tableHtml = "") {
  const rows = parseInfoboxRows(tableHtml);
  const parsed = {};

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const labelCandidates = [...row.headerText];
    if (!labelCandidates.length) {
      continue;
    }

    let mappedKey = null;
    for (const candidate of labelCandidates) {
      const normalizedHeader = normalizeFieldLabel(candidate);
      if (FIELD_ALIASES[normalizedHeader]) {
        mappedKey = FIELD_ALIASES[normalizedHeader];
        break;
      }
    }

    if (!mappedKey) {
      continue;
    }

    let sourceRow = row;
    if (!row.dataHtml.length && rows[index + 1]?.dataHtml?.length) {
      sourceRow = rows[index + 1];
      index += 1;
    }

    if (!sourceRow.dataHtml.length) {
      continue;
    }

    parsed[mappedKey] = normalizeInfoboxValue(mappedKey, sourceRow.dataHtml[0], sourceRow);
  }

  return parsed;
}

function flattenStructuredText(value) {
  if (Array.isArray(value)) {
    if (value.some(item => Array.isArray(item))) {
      return value
        .map(item => flattenStructuredText(item))
        .filter(Boolean)
        .join(" | ");
    }
    return dedupeScalarItems(value).join(" · ");
  }
  return cleanInlineText(String(value || ""));
}

function inferCoalitionLabelFromMembers(members = []) {
  const normalizedMembers = members.map(member =>
    cleanInlineText(member)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  );

  const hasAny = needles => needles.some(needle => normalizedMembers.some(member => member.includes(needle)));

  if (hasAny(["corea del norte", "china"])) return "Corea del Norte y apoyos";
  if (hasAny(["corea del sur", "estados unidos", "reino unido", "australia", "canada"])) return "Corea del Sur y ONU";
  if (hasAny(["vietnam del norte", "viet cong"])) return "Vietnam del Norte y Viet Cong";
  if (hasAny(["vietnam del sur", "estados unidos", "australia"])) return "Vietnam del Sur y aliados";
  if (hasAny(["alemania", "italia", "japon"])) return "Eje";
  if (hasAny(["austria-hungria", "imperio otomano", "bulgaria"]) && hasAny(["alemania"])) return "Potencias Centrales";
  if (hasAny(["reino unido", "union sovietica", "estados unidos", "francia", "china", "belgica", "paises bajos", "luxemburgo"])) return "Aliados";
  return "";
}

function dedupeParticipantEntries(items = []) {
  const duplicateSideCounts = items.reduce((acc, item) => {
    const key = normalizeFieldLabel(item?.side || "");
    if (key) {
      acc.set(key, (acc.get(key) || 0) + 1);
    }
    return acc;
  }, new Map());
  const byKey = new Map();

  for (const item of items) {
    const members = dedupeScalarItems(item?.members || []);
    const organizations = dedupeScalarItems(item?.organizations || []);
    const rawSide = cleanInlineText(item?.side || "") || inferCoalitionLabelFromMembers(members);
    const sideKey = normalizeFieldLabel(rawSide);
    const side = sideKey && (duplicateSideCounts.get(sideKey) || 0) > 1
      ? (inferCoalitionLabelFromMembers(members) || rawSide)
      : rawSide;
    const key = `${members.map(normalizeFieldLabel).sort().join("|")}::${organizations.map(normalizeFieldLabel).sort().join("|")}`;
    if (!key) {
      continue;
    }

    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, {
        side,
        members,
        organizations,
        troops: cleanInlineText(item?.troops || ""),
        casualties: cleanInlineText(item?.casualties || "")
      });
      continue;
    }

    const existingGeneric = /^Bando \d+$/i.test(existing.side || "") || /^(Beligerantes|Belligerents)$/i.test(existing.side || "");
    const currentGeneric = /^Bando \d+$/i.test(side || "") || /^(Beligerantes|Belligerents)$/i.test(side || "");
    byKey.set(key, {
      side: !existingGeneric ? existing.side : (currentGeneric ? existing.side : side),
      members: existing.members.length >= members.length ? existing.members : members,
      organizations: dedupeScalarItems([...existing.organizations, ...organizations]),
      troops: existing.troops || cleanInlineText(item?.troops || ""),
      casualties: existing.casualties || cleanInlineText(item?.casualties || "")
    });
  }

  const merged = [...byKey.values()].filter(item => item.members.length || item.troops || item.casualties);
  const hasNamedCoalitions = merged.some(item => item.side && !/^Bando \d+$/i.test(item.side) && !/^(Beligerantes|Belligerents)$/i.test(item.side));
  return merged.filter(item => !hasNamedCoalitions || !/^Bando \d+$/i.test(item.side || ""));
}

function buildParticipantsFromInfobox(parsed) {
  if (!Array.isArray(parsed.belligerents) || !parsed.belligerents.length) {
    return [];
  }

  const belligerents = Array.isArray(parsed.belligerents[0]) ? parsed.belligerents : [parsed.belligerents];
  const strength = Array.isArray(parsed.strength?.[0]) ? parsed.strength : [parsed.strength || []];
  const casualties = Array.isArray(parsed.casualties?.[0]) ? parsed.casualties : [parsed.casualties || []];

  return dedupeParticipantEntries(belligerents.map((members, index) => {
    const dedupedMembers = dedupeScalarItems(members || []);
    const coalitionLabel = extractCoalitionLabel(dedupedMembers) || inferCoalitionLabelFromMembers(dedupedMembers);
    const filteredMembers = coalitionLabel
      ? dedupedMembers.filter(item => cleanInlineText(item).replace(/\s*:\s*$/, "") !== coalitionLabel)
      : dedupedMembers;
    const troops = flattenStructuredText(strength[index] || []);
    const casualtiesText = flattenStructuredText(casualties[index] || []);
    return {
      side: coalitionLabel || (belligerents.length === 1 ? "Beligerantes" : `Bando ${index + 1}`),
      members: filteredMembers,
      organizations: [],
      troops: troops && troops !== "0" && troops !== "0 ." ? troops : "",
      casualties: casualtiesText && casualtiesText !== "0" && casualtiesText !== "0 ." ? casualtiesText : ""
    };
  }));
}

function buildChronologyFromInfobox(parsed) {
  if (!parsed.date) {
    return [];
  }
  return [{ year: null, text: parsed.date }];
}

function toGeoRiskConflictDetail(parsed, pageTitle) {
  return {
    source: "Wikipedia",
    pageTitle,
    wikipedia: parsed,
    cause: parsed.casusBelli || null,
    participants: buildParticipantsFromInfobox(parsed),
    outcome: parsed.result || null,
    consequences: flattenStructuredText(parsed.consequences || parsed.territorialChanges || []),
    partOf: parsed.partOf || null,
    chronology: buildChronologyFromInfobox(parsed),
    related: [],
    region: parsed.place || null
  };
}

export function sanitizeWikipediaConflictDetail(detail = {}) {
  if (!detail || typeof detail !== "object") {
    return detail;
  }

  const wikipedia = detail.wikipedia && typeof detail.wikipedia === "object"
    ? Object.fromEntries(
        Object.entries(detail.wikipedia).map(([key, value]) => [key, normalizeStructuredWikipediaValue(value)])
      )
    : null;

  const participants = Array.isArray(detail.participants)
    ? dedupeParticipantEntries(detail.participants
        .map(item => ({
          ...item,
          side: cleanInlineText(item?.side || ""),
          members: dedupeScalarItems(item?.members || []),
          organizations: dedupeScalarItems(item?.organizations || []),
          troops: normalizeStructuredWikipediaValue(item?.troops),
          casualties: normalizeStructuredWikipediaValue(item?.casualties)
        }))
        .filter(item => item.side || item.members.length || item.organizations.length || item.troops || item.casualties))
    : [];

  const rebuiltParticipants = wikipedia?.belligerents
    ? buildParticipantsFromInfobox(wikipedia)
    : dedupeParticipantEntries(participants);

  const hasParticipantTroops = rebuiltParticipants.some(item => item?.troops);
  const hasParticipantCasualties = rebuiltParticipants.some(item => item?.casualties);
  const hasNamedCoalitions = rebuiltParticipants.some(item => item?.side && !/^Bando \d+$/i.test(item.side));

  if (wikipedia) {
    if (rebuiltParticipants.length || hasNamedCoalitions) {
      delete wikipedia.belligerents;
    }
    if (hasParticipantTroops) {
      delete wikipedia.strength;
    }
    if (hasParticipantCasualties) {
      delete wikipedia.casualties;
    }
  }

  return {
    ...detail,
    pageTitle: cleanInlineText(detail.pageTitle || ""),
    wikipedia,
    cause: normalizeStructuredWikipediaValue(detail.cause),
    outcome: normalizeStructuredWikipediaValue(detail.outcome),
    consequences: normalizeStructuredWikipediaValue(detail.consequences),
    partOf: normalizeStructuredWikipediaValue(detail.partOf),
    region: normalizeStructuredWikipediaValue(detail.region),
    chronology: Array.isArray(detail.chronology)
      ? detail.chronology
          .map(item => ({
            ...item,
            text: normalizeStructuredWikipediaValue(item?.text)
          }))
          .filter(item => item.text)
      : [],
    related: dedupeScalarItems(detail.related || []),
    participants: rebuiltParticipants
  };
}

async function resolveWikipediaConflictTitleFromApi(conflictName, apiUrl) {
  const url = new URL(apiUrl);
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", conflictName);
  url.searchParams.set("srlimit", "5");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const json = await fetchWikipediaJson(url);
  const results = json?.query?.search || [];
  const best = results.find(entry => hasReasonableTitleMatch(conflictName, entry.title));
  return best?.title || null;
}

export async function resolveWikipediaConflictTitle(conflictName) {
  const direct = CONFLICT_WIKIPEDIA_TITLE_OVERRIDES[conflictName];
  if (direct) {
    const language = /^(?:Battle|First_Battle|Second_Battle|Siege|Raid|Capture|SS)_/.test(direct)
      || ENGLISH_WIKIPEDIA_TITLE_EXCEPTIONS.has(direct)
      ? "en"
      : "es";
    return {
      pageTitle: direct,
      apiUrl: language === "en" ? WIKIPEDIA_API_EN : WIKIPEDIA_API_ES,
      language
    };
  }

  const spanishTitle = await resolveWikipediaConflictTitleFromApi(conflictName, WIKIPEDIA_API_ES);
  if (spanishTitle) {
    return { pageTitle: spanishTitle, apiUrl: WIKIPEDIA_API_ES, language: "es" };
  }
  const englishTitle = await resolveWikipediaConflictTitleFromApi(conflictName, WIKIPEDIA_API_EN);
  if (englishTitle) {
    return { pageTitle: englishTitle, apiUrl: WIKIPEDIA_API_EN, language: "en" };
  }
  return null;
}

export async function fetchWikipediaConflictDetail(conflictName) {
  const resolved = await resolveWikipediaConflictTitle(conflictName);
  if (!resolved?.pageTitle) {
    return null;
  }

  const url = new URL(resolved.apiUrl);
  url.searchParams.set("action", "parse");
  url.searchParams.set("page", resolved.pageTitle);
  url.searchParams.set("prop", "text");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const json = await fetchWikipediaJson(url);
  const html = json?.parse?.text?.["*"] || "";
  const tableHtml = extractFirstInfoboxTable(html);
  if (!tableHtml) {
    return null;
  }

  const parsed = parseInfobox(tableHtml);
  if (!Object.keys(parsed).length) {
    return null;
  }

  if (!hasReasonableTemporalMatch(conflictName, resolved.pageTitle, parsed.date || "")) {
    return null;
  }

  const detail = sanitizeWikipediaConflictDetail(toGeoRiskConflictDetail(parsed, repairMojibakeString(resolved.pageTitle)));
  detail.wikipedia.language = resolved.language;
  return detail;
}

export async function importWikipediaConflictDetails(conflictNames, options = {}) {
  const {
    cachePath,
    delayMs = 50,
    force = false,
    limit = Infinity
  } = options;

  const uniqueNames = [...new Set((conflictNames || []).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"))
    .slice(0, limit);

  const cache = cachePath && await fs.pathExists(cachePath) ? await fs.readJson(cachePath) : { conflicts: {} };
  const result = cache?.conflicts ? { ...cache.conflicts } : { ...cache };
  let failedCount = 0;

  for (const conflictName of uniqueNames) {
    if (!force && result[conflictName]?.wikipedia) {
      continue;
    }

    try {
      const detail = await fetchWikipediaConflictDetail(conflictName);
      if (detail) {
        result[conflictName] = detail;
      } else {
        failedCount += 1;
      }
    } catch (error) {
      failedCount += 1;
    }

    if (cachePath) {
      await fs.writeJson(cachePath, {
        _meta: {
          source: "Wikipedia (MediaWiki API)",
          generatedAt: new Date().toISOString(),
          importedCount: Object.values(result).filter(item => item?.wikipedia).length,
          requestedCount: uniqueNames.length,
          missingCount: failedCount
        },
        conflicts: result
      }, { spaces: 2 });
    }

    if (delayMs) {
      await sleep(delayMs);
    }
  }

  return {
    conflicts: result,
    importedCount: Object.values(result).filter(item => item?.wikipedia).length,
    missingCount: failedCount,
    requestedCount: uniqueNames.length
  };
}
