function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate de Little Dry Creek (1885)";
const PARENT = "Guerras apaches";
const CAMPAIGN = "Campa\u00f1a de Ger\u00f3nimo de 1885-1886";

const SOURCES = {
  fortHuachuca: source(
    "Ejercito de EE. UU., Fort Huachuca: reproduce el informe de Samuel W. Fountain del 21 de diciembre de 1885 sobre la salida, la composicion de la columna y la emboscada en Little Dry Creek",
    "https://home.army.mil/huachuca/application/files/9616/6577/8830/Vol_7_1999_Geronimo_Campaign.pdf"
  ),
  secretaryOfWar: source(
    "Informe Anual del Secretario de Guerra de EE. UU. de 1886: registra la muerte del cirujano T. J. C. Maddox en Little Dry Creek el 19 de diciembre de 1885",
    "https://upload.wikimedia.org/wikipedia/commons/d/d8/Annual_report_of_the_Secretary_of_War_for_the_year_1886_-_USACE-p16021coll5-38151.pdf"
  ),
  nationalParkServiceApacheWars: source(
    "Servicio de Parques Nacionales de EE. UU., Chiricahua National Monument: contexto de las Guerras apaches, la expansion estadounidense y la resistencia chiricahua en el suroeste",
    "https://www.nps.gov/chir/learn/historyculture/apache-wars-cochise.htm"
  )
};

function littleDryCreek1885Fix() {
  const hierarchySources = [
    SOURCES.fortHuachuca,
    SOURCES.secretaryOfWar,
    SOURCES.nationalParkServiceApacheWars
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate de frontera",
    conflictType: "colonial",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1885,
    endYear: 1885,
    region: "Little Dry Creek, cerca de Pleasanton y del rancho Siggins, actual suroeste de Nuevo Mexico, Estados Unidos",
    normalizedRegion: "Little Dry Creek, actual suroeste de Nuevo Mexico, Estados Unidos",
    cause: "La columna de Samuel W. Fountain realizaba una persecucion estadounidense en el marco de la campana de 1885 contra partidas chiricahuas. El 19 de diciembre salio del campamento de Dry Creek rumbo a la zona de las montanas Mogollon y fue atacada al cruzar la elevacion entre Big Dry Creek y Little Dry Creek. El informe militar describe el movimiento de la columna, pero no basta para atribuir una causa unica ni una motivacion uniforme a la partida apache.",
    outcome: "Una partida apache embosco a la columna desde posiciones elevadas; los supervivientes estadounidenses reorganizaron su defensa y la partida se retiro hacia el oeste. El informe de Fountain y el parte anual de Guerra confirman bajas de la columna y la muerte del cirujano Maddox, pero los resumentes posteriores no coinciden por completo sobre fuerza, bajas y secuencia. La ficha registra una emboscada eficaz, no una victoria absoluta ni un total definitivo.",
    consequences: "El episodio no cerro la campana de 1885-1886. La persecucion de fuerzas estadounidenses y mexicanas contra partidas chiricahuas continuo hasta la rendicion de una fase chiricahua en 1886; esa relacion amplia se mantiene en la ficha padre y no se presenta como desenlace simple de todos los pueblos apache.",
    chronology: [
      {
        year: 1885,
        event: "El 18 de diciembre, Samuel W. Fountain salio con elementos de la 8.a Caballeria, exploradores navajo, personal medico y guias hacia el area de Dry Creek."
      },
      {
        year: 1885,
        event: "El 19 de diciembre, alrededor de las 8:30, la columna recibio fuego desde la cresta occidental y el frente izquierdo al subir entre Big Dry Creek y Little Dry Creek."
      },
      {
        year: 1885,
        event: "La columna se reorganizo bajo fuego y la partida apache se retiro. El informe anual de Guerra de 1886 registra que el cirujano T. J. C. Maddox murio en el episodio."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Combate de Devil's Creek (1885)", "Fort Bayard", "Rendicion de Skeleton Canyon (1886)"],
    participants: [
      {
        side: "Columna del Ejercito de Estados Unidos y exploradores navajo",
        members: ["Estados Unidos", "Tropa C, 8.a Caballeria de Estados Unidos", "Samuel W. Fountain", "exploradores navajo citados en el informe militar", "T. J. C. Maddox, cirujano del Ejercito de Estados Unidos"],
        casualties: "El informe anual de Guerra confirma la muerte de T. J. C. Maddox en Little Dry Creek. Los relatos posteriores difieren al sumar militares, guias y personas que murieron despues de la emboscada, por lo que la ficha no fija un total cerrado."
      },
      {
        side: "Partida apache que realizo la emboscada",
        members: ["partida apache descrita por el informe militar", "combatientes asociados por fuentes posteriores a la fase chiricahua de 1885", "Josanie o Ulzana, atribucion discutida en resumentes posteriores"],
        casualties: "No consolidadas: el informe de la columna no ofrece un parte apache independiente y las fuentes consultadas no permiten verificar una cifra de muertos, heridos o capturados."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "19 de diciembre de 1885",
    sourceDispute: "El informe de Fountain es la fuente mas cercana al combate, pero expresa la perspectiva de la columna estadounidense. Los resumentes posteriores difieren en la fuerza de cada lado, las bajas, la identidad exacta de la partida y el uso de Josanie o Ulzana para su mando. El Informe Anual del Secretario de Guerra confirma la muerte de Maddox, no todos los totales divulgados. GeoRisk conserva el nombre de lugar Little Dry Creek, usa combate de frontera y evita presentar a los pueblos apache, a los exploradores navajo o a los estados actuales como bloques militares homogeneos.",
    curationPriority: "alta",
    curationBatch: "source-backed-little-dry-creek-1885-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa no tenia fecha, ubicacion, jerarquia, contraparte ni fuentes y quedaba bajo Conflicto regional de America como batalla interestatal. Se normaliza como Combate de Little Dry Creek (1885), se integra a las Guerras apaches y a la Campana de Geronimo de 1885-1886. Se mantiene la terminologia de campana como marco organizativo y no como una explicacion total de identidades, decisiones o bajas de todas las personas implicadas. Los aliases conservan la busqueda por el titulo ingles heredado."
  };
}

export const LITTLE_DRY_CREEK_1885_CONFLICT_RENAMES = {
  "Batalla de Little Dry Creek": CANONICAL,
  "Batalla de Little Dry Creek (1885)": CANONICAL,
  "Combate de Little Dry Creek": CANONICAL,
  "Battle of Little Dry Creek": CANONICAL,
  "Battle of Little Dry Creek (1885)": CANONICAL,
  "Little Dry Creek Battle": CANONICAL
};

export const LITTLE_DRY_CREEK_1885_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [PARENT, CANONICAL]
};

export const LITTLE_DRY_CREEK_1885_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: littleDryCreek1885Fix()
};
