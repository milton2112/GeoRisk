function source(label, url, confidence = "media") {
  return { label, url, confidence };
}

const SOURCES = {
  blmMonograph: source(
    "Oficina de Administraci\u00f3n de Tierras de EE. UU.: Donald H. Couchman, Cooke's Peak - Pasaron Por Aqui (1990), relato del ataque al convoy Ake y del auxilio posterior",
    "https://online.flipbuilder.com/mxzm/ecpp/files/basic-html/page159.html"
  ),
  npsHistoricalContext: source(
    "Servicio de Parques Nacionales de EE. UU.: contexto hist\u00f3rico de ataques a viajeros cerca de Cooke's Canyon en 1861",
    "https://in.nau.edu/wp-content/uploads/sites/128/2018/08/NMSU-07-ek.pdf"
  )
};

function cookesCanyonFix() {
  const hierarchySources = [SOURCES.blmMonograph, SOURCES.npsHistoricalContext];

  return {
    parent: "Guerras apaches",
    war: "Guerras apaches",
    campaign: "Operaciones de Cooke's Canyon de 1861",
    type: "combate",
    conflictType: "colonial",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1861,
    endYear: 1861,
    region: "Cooke's Canyon, cerca de Cooke's Peak, actual condado de Luna, Nuevo M\u00e9xico, Estados Unidos",
    normalizedRegion: "Cooke's Canyon, cerca de Cooke's Peak, actual condado de Luna, Nuevo M\u00e9xico, Estados Unidos",
    cause: "En el deterioro de la seguridad del corredor de Cooke's Canyon durante 1861, el convoy Ake atravesaba el paso con ganado rumbo al valle del R\u00edo Grande cuando fue emboscado por combatientes chiricahua.",
    outcome: "El convoy improvis\u00f3 una defensa con sus carros y los sobrevivientes se retiraron hacia el Mimbres; los atacantes se llevaron gran parte del ganado. Las fuentes disponibles no permiten consolidar un balance de bajas ni atribuir un mando individual con certeza.",
    consequences: "Los sobrevivientes recibieron auxilio de los Arizona Guards y el resto del convoy fue escoltado hasta Mesilla. La acci\u00f3n ilustr\u00f3 la vulnerabilidad de la ruta de Cooke's Canyon durante la fase temprana de las Guerras apaches.",
    chronology: [
      { year: 1861, event: "Durante el verano, la inseguridad del corredor de Cooke's Canyon afect\u00f3 a viajeros y convoyes en el sur de Nuevo M\u00e9xico." },
      { year: 1861, event: "El convoy Ake fue emboscado al cruzar el canyon con ganado; sus integrantes formaron una defensa improvisada con los carros." },
      { year: 1861, event: "Los sobrevivientes retrocedieron hacia el Mimbres, recibieron auxilio y el resto del convoy fue escoltado hasta Mesilla." }
    ],
    treaties: [],
    related: ["Guerras apaches", "Operaciones de Cooke's Canyon de 1861"],
    participants: [
      {
        side: "Convoy Ake y su escolta civil armada",
        members: ["Emigrantes y refugiados procedentes del sur de Arizona", "Escolta civil del convoy Ake"]
      },
      {
        side: "Combatientes apache chiricahua",
        members: ["Apache chiricahua"]
      }
    ],
    hierarchyConfidence: "media",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "agosto de 1861; el d\u00eda exacto no est\u00e1 consolidado",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-cookes-canyon-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La monograf\u00eda de Donald H. Couchman, publicada por la Oficina de Administraci\u00f3n de Tierras de EE. UU., identifica el episodio como el ataque al convoy Ake; el contexto hist\u00f3rico del Servicio de Parques Nacionales confirma una secuencia de ataques a viajeros cerca de Cooke's Canyon en 1861. Los relatos difieren de forma importante sobre el d\u00eda, las bajas y el liderazgo apache. La ficha conserva solamente agosto de 1861, no atribuye mandos individuales ni consolida cifras de bajas. La etiqueta 'Operaciones de Cooke's Canyon de 1861' es una categor\u00eda organizativa de GeoRisk, no el nombre de una campa\u00f1a oficial citado por las fuentes."
  };
}

export const COOKES_CANYON_CONFLICT_RENAMES = {
  "Batalla de Cookes Canyon": "Combate de Cooke's Canyon (1861)",
  "Batalla de Cooke's Canyon": "Combate de Cooke's Canyon (1861)",
  "Battle of Cookes Canyon": "Combate de Cooke's Canyon (1861)",
  "Battle of Cooke's Canyon": "Combate de Cooke's Canyon (1861)"
};

export const COOKES_CANYON_CONFLICT_DETAIL_FIXES = {
  "Combate de Cooke's Canyon (1861)": cookesCanyonFix()
};
