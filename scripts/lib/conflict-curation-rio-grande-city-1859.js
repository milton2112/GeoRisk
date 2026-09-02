function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de R\u00edo Grande City (27 de diciembre de 1859)";
const PARENT = "Primera guerra de Cortina (1859-1860)";
const CAMPAIGN = "Operaciones del bajo R\u00edo Grande de diciembre de 1859";

const SOURCES = {
  utrgv: source(
    "University of Texas Rio Grande Valley: s\u00edntesis de la Primera guerra de Cortina, la batalla del 27 de diciembre de 1859 y la retirada posterior de Cortina hacia M\u00e9xico",
    "https://www.utrgv.edu/civilwar-trail/civil-war-trail/cortina-first-war/index.htm"
  ),
  texasHistoricalCommission: source(
    "Texas Historical Commission, marcador Site of Cortina Battle: fecha, lugar, combate al amanecer y participaci\u00f3n de Samuel P. Heintzelman, tropas del Ej\u00e9rcito estadounidense y Texas Rangers reclutados por John S. Rip Ford",
    "https://atlas.thc.texas.gov/Details/5427004762"
  ),
  texasStateHistoricalAssociation: source(
    "Texas State Historical Association, Handbook of Texas: contexto de la Primera guerra de Cortina, fuerzas registradas, derrota del 27 de diciembre y retirada hacia M\u00e9xico",
    "https://www.tshaonline.org/handbook/entries/cortina-juan-nepomuceno"
  ),
  texasHistoryForTeachers: source(
    "Texas History for Teachers: recurso educativo sobre Juan Cortina que sit\u00faa el ataque conjunto del Ej\u00e9rcito y los Rangers al sur de Rio Grande City y la retirada a trav\u00e9s del R\u00edo Grande",
    "https://education.texashistory.unt.edu/downloads/documents/7/units/early-statehood/lessons/whos-who-of-early-statehood/all/readings-grade-level.pdf"
  )
};

function rioGrandeCity1859Fix() {
  const hierarchySources = [
    SOURCES.utrgv,
    SOURCES.texasHistoricalCommission,
    SOURCES.texasStateHistoricalAssociation,
    SOURCES.texasHistoryForTeachers
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "insurgencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1859,
    endYear: 1859,
    region: "Al sur de Rio Grande City, condado de Starr, Texas, Estados Unidos, junto al r\u00edo Bravo/R\u00edo Grande y frente a Tamaulipas, M\u00e9xico",
    normalizedRegion: "Al sur de Rio Grande City, condado de Starr, Texas, Estados Unidos, junto al r\u00edo Bravo/R\u00edo Grande y frente a Tamaulipas, M\u00e9xico",
    cause: "La batalla se desarroll\u00f3 durante la Primera guerra de Cortina. Tras el Tratado de Guadalupe Hidalgo de 1848, disputas sobre tierras, derechos y autoridad afectaron a poblaciones de origen mexicano en el sur de Texas. En 1859, el conflicto escal\u00f3 entre las fuerzas de Juan Nepomuceno Cortina y autoridades locales, Rangers y fuerzas federales estadounidenses; la columna de Cortina se repleg\u00f3 r\u00edo arriba antes del combate de Rio Grande City.",
    outcome: "Victoria t\u00e1ctica de las fuerzas del Ej\u00e9rcito de Estados Unidos y los Texas Rangers. El 27 de diciembre derrotaron a la fuerza de Juan Nepomuceno Cortina, que se retir\u00f3 hacia M\u00e9xico. La ficha no fija un balance total de bajas porque las fuentes no publican una serie conciliada para ambos bandos.",
    consequences: "La derrota limit\u00f3 temporalmente las incursiones cortinistas en el bajo R\u00edo Grande y condujo a la retirada de Cortina a M\u00e9xico. No cerr\u00f3 todos los episodios asociados: el 4 de febrero de 1860 ocurri\u00f3 la acci\u00f3n distinta de La Bolsa, y la Segunda guerra de Cortina de 1861 debe mantenerse separada.",
    chronology: [
      {
        year: 1848,
        event: "El Tratado de Guadalupe Hidalgo cambi\u00f3 el contexto pol\u00edtico y de propiedad en el bajo R\u00edo Grande; fuentes universitarias e hist\u00f3ricas vinculan esas tensiones con el trasfondo de 1859."
      },
      {
        year: 1859,
        event: "El 13 de julio, el incidente entre Juan Nepomuceno Cortina y el alguacil Robert Shears en Brownsville desencaden\u00f3 el primer conflicto conocido como guerra de Cortina."
      },
      {
        year: 1859,
        event: "El 27 de diciembre, tropas federales al mando de Samuel P. Heintzelman y Texas Rangers asociados con John S. Rip Ford atacaron a las fuerzas cortinistas al sur de Rio Grande City; el marcador hist\u00f3rico sit\u00faa el choque al amanecer."
      },
      {
        year: 1860,
        event: "El 4 de febrero, Cortina intent\u00f3 capturar el vapor Ranchero en la acci\u00f3n distinta de La Bolsa; este episodio no se fusiona con la batalla de Rio Grande City."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Batalla de La Bolsa (4 de febrero de 1860)",
      "Tratado de Guadalupe Hidalgo (1848)",
      "Juan Nepomuceno Cortina",
      "Samuel P. Heintzelman",
      "John S. Rip Ford",
      "Rio Grande City"
    ],
    participants: [
      {
        side: "Estados Unidos y Texas Rangers",
        members: [
          "Estados Unidos",
          "Ej\u00e9rcito de Estados Unidos",
          "Texas Rangers",
          "Samuel P. Heintzelman",
          "John S. Rip Ford"
        ],
        casualties: "Las fuentes consultadas registran fuerzas federales y Rangers, pero no publican un total homog\u00e9neo de bajas para ambas unidades. GeoRisk no consolida cifras parciales en un balance estadounidense cerrado."
      },
      {
        side: "Cortinistas",
        members: [
          "Fuerzas de Juan Nepomuceno Cortina",
          "Cortinistas",
          "Juan Nepomuceno Cortina"
        ],
        casualties: "El Handbook of Texas informa sesenta bajas y p\u00e9rdida de equipo para las fuerzas de Cortina; el marcador de la Texas Historical Commission registra una fuerza aproximada de 450, pero no ofrece un total de bajas comparable. GeoRisk conserva la discrepancia y no presenta un total conciliado."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "27 de diciembre de 1859; el marcador de la Texas Historical Commission sit\u00faa el combate al amanecer.",
    sourceDispute: "La entrada importada solo dec\u00eda Batalla de Rio Grande City, sin fecha ni padre, y pod\u00eda confundirse con hechos de la Guerra entre M\u00e9xico y Estados Unidos de 1846-1848 o con incidentes fronterizos de la Guerra Civil estadounidense. Las fuentes universitarias, estatales y de la Texas State Historical Association la identifican como un combate de la Primera guerra de Cortina el 27 de diciembre de 1859. Coinciden en la derrota y retirada de Cortina, pero no usan un mismo criterio para efectivos y bajas: el marcador registra unos 450 cortinistas, el Handbook menciona m\u00e1s de 400 y 165 regulares, y solo este \u00faltimo propone sesenta bajas cortinistas. La ficha no convierte a M\u00e9xico en beligerante estatal ni cierra esas cifras.",
    curationPriority: "alta",
    curationBatch: "source-backed-rio-grande-city-1859-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Batalla de Rio Grande City se normaliza como Batalla de R\u00edo Grande City (27 de diciembre de 1859), dentro de la Primera guerra de Cortina (1859-1860). Operaciones del bajo R\u00edo Grande de diciembre de 1859 es una categor\u00eda organizativa de GeoRisk para esta secuencia, no el nombre de una campa\u00f1a militar oficial. La ficha se limita al combate del 27 de diciembre y no mezcla La Bolsa, las batallas de 1846-1848 ni las acciones de la Segunda guerra de Cortina de 1861."
  };
}

export const RIO_GRANDE_CITY_1859_CONFLICT_RENAMES = {
  "Batalla de Rio Grande City": CANONICAL,
  "Batalla de R\u00edo Grande City": CANONICAL,
  "Battle of Rio Grande City": CANONICAL,
  "Battle of Rio Grande City (1859)": CANONICAL,
  "Cortina Battle at Rio Grande City": CANONICAL
};

export const RIO_GRANDE_CITY_1859_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [CANONICAL]
};

export const RIO_GRANDE_CITY_1859_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: rioGrandeCity1859Fix()
};
