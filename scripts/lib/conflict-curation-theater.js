import { normalizeConflictKey } from "./conflict-cleaning.js";

export const THEATER_SAFE_CONFLICT_RENAMES = {
  "Dutch conquest de New Sweden": "Conquista neerlandesa de Nueva Suecia",
  "Asedio de Warsaw": "Asedio de Varsovia",
  "Captura de Warsaw (1657)": "Captura de Varsovia (1657)",
  "Batalla de Martinique": "Batalla de Martinica",
  "Swedish Invasion de Brandenburg": "Invasion sueca de Brandeburgo",
  "Batalla de Koge Bay": "Batalla de la bahia de Koge",
  "Newfoundland Expedition": "Expedicion de Terranova",
  "Naval battles en Greifswalder Bodden": "Batallas navales en Greifswalder Bodden",
  "Mount Hope Bay raids": "Incursiones en la bahia de Mount Hope",
  "Sullivan Expedition": "Expedicion de Sullivan",
  "Frigate action de 29 May 1794": "Accion de fragata del 29 de mayo de 1794",
  "Battles de Emuckfaw y Enotachopo Creek": "Batallas de Emuckfaw y Enotachopo Creek",
  "Action de 16 March 1917": "Accion del 16 de marzo de 1917",
  "Koli Point action": "Accion de Koli Point",
  "Great Naktong Offensive": "Gran ofensiva del Naktong",
  "UN offensive into North Korea": "Ofensiva de la ONU en Corea del Norte",
  "Aleppo Offensive (April 2016)": "Ofensiva de Alepo de abril de 2016",
  "Chinese Invasion de Taiwan": "Invasion china de Taiwan",
  "Action off Galveston Light": "Accion frente al faro de Galveston",
  "Battles de Wenden": "Batallas de Wenden",
  "Naval Batalla de Saint-Martin-de-Re": "Batalla naval de Saint-Martin-de-Re",
  "Naval Batalla de Saint-Martin-de-Ré": "Batalla naval de Saint-Martin-de-Re",
  "Naval battles on Lake Ladoga": "Batallas navales del lago Ladoga",
  "Ogu Air Raid": "Ataque aereo de Ogu",
  "Wake Atoll raid": "Incursion sobre el atolon Wake"
};

THEATER_SAFE_CONFLICT_RENAMES["Campana en África del Suroeste"] = "Campana en Africa del Suroeste";
THEATER_SAFE_CONFLICT_RENAMES["Incursión del Océano Índico"] = "Incursion del Oceano Indico";

const THEATER_NAME_BY_KEY = new Map([
  ["campana en africa del suroeste", "Campana en Africa del Suroeste"],
  ["incursion del oceano indico", "Incursion del Oceano Indico"]
]);

function getYear(entry = {}) {
  return Number.isFinite(entry.startYear) ? entry.startYear : null;
}

export function getContextualConflictName(entry = {}) {
  const name = entry.name || "";
  const key = normalizeConflictKey(name);
  const year = getYear(entry);
  if (key === "guerra del pacifico" && year >= 1941 && year <= 1945) {
    return "Guerra del Pacifico de la Segunda Guerra Mundial";
  }
  if (key === "batalla de manila") {
    return year === 1945 ? "Batalla de Manila (1945)" : "Batalla de Manila (1899)";
  }
  return THEATER_NAME_BY_KEY.get(key) || name;
}

const THEATER_DETAIL_FIXES = {
  "Campana del Norte de Rusia": {
    parent: "Guerra civil rusa",
    war: "Guerra civil rusa",
    campaign: "Intervencion aliada en el norte de Rusia",
    type: "campana",
    conflictType: "intervencion",
    scale: "internacional",
    status: "historico",
    active: false,
    region: "Rusia septentrional",
    normalizedRegion: "Rusia septentrional",
    cause: "Intervencion aliada posterior a la Revolucion rusa para asegurar puertos, suministros y presionar a fuerzas bolcheviques en el norte de Rusia.",
    outcome: "Retirada aliada y continuidad de la guerra civil rusa.",
    consequences: "Mostro los limites de la intervencion extranjera y dejo efectos diplomaticos duraderos en la relacion con el nuevo poder sovietico.",
    related: ["Guerra civil rusa", "Intervencion aliada en la Guerra civil rusa"],
    chronology: [
      { year: 1918, event: "Despliegue aliado en puertos y posiciones del norte ruso." },
      { year: 1920, event: "Retirada de la fase principal de la intervencion." }
    ],
    participants: [
      { side: "Fuerzas aliadas", members: ["Reino Unido", "Estados Unidos", "Canada", "Australia"], organizations: ["Aliados"], casualties: "No consolidado en fuentes livianas" },
      { side: "Fuerzas bolcheviques y locales", members: ["Rusia sovietica"], organizations: [], casualties: "No consolidado en fuentes livianas" }
    ],
    curationPriority: "alta",
    curationBatch: "safe-theater-corrections-2026-06"
  },
  "Intervencion en Siberia": {
    parent: "Guerra civil rusa",
    war: "Guerra civil rusa",
    campaign: "Intervencion aliada en Siberia",
    type: "campana",
    conflictType: "intervencion",
    scale: "internacional",
    status: "historico",
    active: false,
    region: "Siberia",
    normalizedRegion: "Siberia",
    cause: "Intervencion extranjera en el contexto de la guerra civil rusa y la proteccion de intereses militares y logisticos aliados.",
    outcome: "Retirada aliada y consolidacion posterior del control bolchevique en el teatro siberiano.",
    consequences: "Aumento la complejidad internacional de la guerra civil rusa y dejo tensiones diplomaticas posteriores.",
    related: ["Guerra civil rusa", "Intervencion aliada en la Guerra civil rusa"],
    chronology: [
      { year: 1918, event: "Comienza la intervencion aliada en Siberia." },
      { year: 1920, event: "Se reduce la fase principal de participacion aliada." }
    ],
    participants: [
      { side: "Fuerzas aliadas", members: ["Canada", "Estados Unidos", "Japon", "Reino Unido"], organizations: ["Aliados"], casualties: "No consolidado en fuentes livianas" },
      { side: "Fuerzas bolcheviques y actores rusos", members: ["Rusia sovietica", "fuerzas antibolcheviques"], organizations: [], casualties: "No consolidado en fuentes livianas" }
    ],
    curationPriority: "alta",
    curationBatch: "safe-theater-corrections-2026-06"
  },
  "Campana en Africa del Suroeste": {
    parent: "Primera Guerra Mundial",
    war: "Primera Guerra Mundial",
    campaign: "Campana de Africa del Suroeste",
    type: "campana",
    conflictType: "colonial",
    scale: "regional",
    status: "historico",
    active: false,
    region: "Africa del Suroeste",
    normalizedRegion: "Africa del Suroeste",
    cause: "Disputa por el control colonial del Africa del Suroeste alemana durante la Primera Guerra Mundial.",
    outcome: "Ocupacion aliada del territorio colonial aleman.",
    consequences: "Reordeno el control colonial del territorio y lo incorporo al sistema de mandatos posterior a la guerra.",
    related: ["Primera Guerra Mundial"],
    chronology: [
      { year: 1914, event: "Inicio de operaciones contra el Africa del Suroeste alemana." },
      { year: 1915, event: "Cierre de la campana principal." }
    ],
    participants: [
      { side: "Fuerzas aliadas", members: ["Union Sudafricana", "Reino Unido"], organizations: ["Aliados"], casualties: "No consolidado en fuentes livianas" },
      { side: "Imperio aleman", members: ["Alemania"], organizations: ["Potencias Centrales"], casualties: "No consolidado en fuentes livianas" }
    ],
    startYear: 1914,
    endYear: 1915,
    curationPriority: "alta",
    curationBatch: "safe-theater-corrections-2026-06"
  },
  "Operacion Dinamo": {
    parent: "Segunda Guerra Mundial",
    war: "Segunda Guerra Mundial",
    campaign: "Evacuacion de Dunkerque",
    type: "operacion",
    conflictType: "interestatal",
    scale: "mundial",
    status: "historico",
    active: false,
    region: "Europa occidental",
    normalizedRegion: "Europa occidental",
    cause: "Evacuacion aliada tras el avance aleman en Francia y Belgica en 1940.",
    outcome: "Evacuacion de gran parte de las fuerzas aliadas desde Dunkerque.",
    consequences: "Preservo fuerzas britanicas y aliadas para fases posteriores de la guerra, aunque Francia cayo poco despues.",
    related: ["Batalla de Francia", "Segunda Guerra Mundial"],
    chronology: [{ year: 1940, event: "Evacuacion aliada desde Dunkerque." }],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Francia", "Belgica"], organizations: ["Aliados"], casualties: "No consolidado en fuentes livianas" },
      { side: "Eje", members: ["Alemania"], organizations: ["Eje"], casualties: "No consolidado en fuentes livianas" }
    ],
    curationPriority: "alta",
    curationBatch: "safe-theater-corrections-2026-06"
  },
  "Incursion del Oceano Indico": {
    parent: "Segunda Guerra Mundial",
    war: "Segunda Guerra Mundial",
    campaign: "Guerra naval del Oceano Indico",
    type: "incursion naval",
    conflictType: "interestatal",
    scale: "mundial",
    status: "historico",
    active: false,
    region: "Oceano Indico",
    normalizedRegion: "Oceano Indico",
    cause: "Operacion naval japonesa para presionar bases, rutas y flotas aliadas en el Oceano Indico.",
    outcome: "Golpes tacticos contra posiciones y buques aliados sin control permanente del teatro.",
    consequences: "Forzo ajustes defensivos aliados y evidencio la extension oceanica de la guerra del Pacifico.",
    related: ["Segunda Guerra Mundial", "Guerra del Pacifico de la Segunda Guerra Mundial"],
    chronology: [{ year: 1942, event: "Incursion naval japonesa en el Oceano Indico." }],
    participants: [
      { side: "Japon", members: ["Japon"], organizations: ["Eje"], casualties: "No consolidado en fuentes livianas" },
      { side: "Aliados", members: ["Reino Unido", "Australia", "Estados Unidos"], organizations: ["Aliados"], casualties: "No consolidado en fuentes livianas" }
    ],
    curationPriority: "alta",
    curationBatch: "safe-theater-corrections-2026-06"
  },
  "Guerra del Pacifico de la Segunda Guerra Mundial": {
    parent: "Segunda Guerra Mundial",
    war: "Segunda Guerra Mundial",
    campaign: "Teatro Asia-Pacifico",
    type: "teatro",
    conflictType: "interestatal",
    scale: "mundial",
    status: "historico",
    active: false,
    region: "Asia-Pacifico",
    normalizedRegion: "Asia-Pacifico",
    cause: "Expansion japonesa y respuesta aliada en Asia y el Pacifico durante la Segunda Guerra Mundial.",
    outcome: "Derrota de Japon y cierre de la guerra mundial en 1945.",
    consequences: "Transformo el equilibrio de poder en Asia-Pacifico, acelero procesos de descolonizacion y consolido la presencia estrategica estadounidense en la region.",
    related: ["Segunda Guerra Mundial"],
    chronology: [
      { year: 1941, event: "Escalada abierta de la guerra del Pacifico." },
      { year: 1945, event: "Rendicion japonesa y cierre del teatro." }
    ],
    participants: [
      { side: "Aliados", members: ["Estados Unidos", "Reino Unido", "Australia", "China"], organizations: ["Aliados"], casualties: "No consolidado en fuentes livianas" },
      { side: "Japon y aliados", members: ["Japon"], organizations: ["Eje"], casualties: "No consolidado en fuentes livianas" }
    ],
    curationPriority: "alta",
    curationBatch: "safe-theater-corrections-2026-06"
  }
};

export const THEATER_CONFLICT_DETAIL_FIXES = {
  ...THEATER_DETAIL_FIXES,
  "Campana en África del Suroeste": THEATER_DETAIL_FIXES["Campana en Africa del Suroeste"],
  "Incursión del Océano Índico": THEATER_DETAIL_FIXES["Incursion del Oceano Indico"]
};
