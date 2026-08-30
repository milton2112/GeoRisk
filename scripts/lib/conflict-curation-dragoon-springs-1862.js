function source(label, url, confidence = "media") {
  return { label, url, confidence };
}

const CANONICAL = "Primera batalla de Dragoon Springs (1862)";
const PARENT = "Guerras apaches";
const CAMPAIGN = "Operaciones confederadas y apaches en Dragoon Springs (1862)";

const SOURCES = {
  arizonaHighways: source(
    "Arizona Highways: reconstruccion de la emboscada de Dragoon Springs el 5 de mayo de 1862 y advertencia sobre la version que la presenta como retirada de Tucson",
    "https://www.arizonahighways.com/archive/issues/chapter/Doc.1011.Chapter.8"
  ),
  nationalRegister: source(
    "Registro Nacional de Lugares Historicos de Estados Unidos: inscripcion oficial del sitio de la estacion de Dragoon Springs, al este de Dragoon, condado de Cochise",
    "https://www.govinfo.gov/content/pkg/FR-1979-06-05/pdf/FR-1979-06-05.pdf",
    "alta"
  ),
  dragoonHistory: source(
    "Historia local de Dragoon: sintesis de las dos acciones de mayo de 1862, el caracter de emboscada y la accion posterior de recuperacion",
    "https://www.dragoonarizona.com/dragoon-history-attractions/historical-events/military-battles-of-dragoon-springs"
  )
};

function dragoonSprings1862Fix() {
  const hierarchySources = [
    SOURCES.arizonaHighways,
    SOURCES.nationalRegister,
    SOURCES.dragoonHistory
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate de frontera",
    conflictType: "frontera",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1862,
    endYear: 1862,
    region: "Dragoon Springs y sus inmediaciones, montanas Dragoon; actual condado de Cochise, Arizona, Estados Unidos",
    normalizedRegion: "Dragoon Springs, montanas Dragoon, actual condado de Cochise, Arizona, Estados Unidos",
    cause: "Una partida confederada se encontraba con ganado y personas bajo custodia en torno a la antigua estacion de correo de Dragoon Springs. La emboscada ocurrio dentro de la disputa por movilidad, agua, ganado y control del territorio en el sur de Arizona, donde grupos apaches enfrentaban a fuerzas y redes de ocupacion. Las fuentes consultadas no permiten reducir el detonante a una sola causa ni atribuir una motivacion unica a todas las personas presentes.",
    outcome: "La emboscada del 5 de mayo produjo bajas en el destacamento confederado y la perdida de animales. Las fuentes secundarias describen una ventaja tactica apache, pero no ofrecen una serie homogenea de fuerzas, bajas ni capturas; la ficha no convierte un relato local en un balance militar cerrado.",
    consequences: "Cuatro dias despues se registro una segunda accion confederada relacionada con la recuperacion de ganado. El episodio evidencia que la Guerra Civil estadounidense se entrelazo con conflictos de frontera y resistencia apache, sin convertir a los pueblos apaches en una faccion subordinada de la guerra entre la Union y la Confederacion.",
    chronology: [
      {
        year: 1862,
        event: "El 5 de mayo, una partida confederada situada cerca de la antigua estacion de correo de Dragoon Springs fue emboscada por combatientes apaches."
      },
      {
        year: 1862,
        event: "Los relatos posteriores asocian la accion con ganado tomado y con entierros atribuidos a personas del destacamento; la identificacion individual y el numero exacto de bajas no son uniformes."
      },
      {
        year: 1862,
        event: "El 9 de mayo se produjo una segunda accion vinculada a la recuperacion de ganado, que esta ficha mantiene separada para no fusionar ambos episodios."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Segunda batalla de Dragoon Springs (1862)", "Estacion de Dragoon Springs", "Guerra Civil estadounidense"],
    participants: [
      {
        side: "Destacamento confederado en Dragoon Springs",
        members: ["Estados Confederados de America", "destacamento vinculado a la Compania A de los Arizona Rangers", "Sargento Samuel B. Ford, citado por relatos posteriores", "personas bajo custodia y personal civil presentes segun las fuentes"],
        casualties: "No se fija una cifra definitiva. Los relatos suelen mencionar muertes y la perdida de animales, pero difieren al contar militares, personal civil y tumbas asociadas al episodio."
      },
      {
        side: "Combatientes apaches en las montanas Dragoon",
        members: ["grupo apache presente en la emboscada", "combatientes identificados como chiricahua por varias fuentes secundarias", "Cochise y Francisco, atribuidos por relatos posteriores"],
        casualties: "No consolidadas: las fuentes consultadas no aportan un parte apache equivalente ni una serie verificable de personas muertas, heridas o capturadas."
      }
    ],
    hierarchyConfidence: "media",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "5 de mayo de 1862",
    sourceDispute: "Las fuentes coinciden en la fecha, el entorno de Dragoon Springs y la relacion con una accion posterior el 9 de mayo, pero difieren sobre si la partida estaba en retirada de Tucson, su composicion exacta, el liderazgo apache, el numero de animales y la contabilizacion de las muertes. Parte de la evidencia material se superpone con tumbas anteriores de la ruta postal. Por ello se usa combate de frontera, no una victoria absoluta ni una cifra de bajas cerrada. La agrupacion Operaciones confederadas y apaches en Dragoon Springs (1862) es una etiqueta organizativa de GeoRisk, no el nombre oficial de una campana.",
    curationPriority: "alta",
    curationBatch: "source-backed-dragoon-springs-1862-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa no tenia fecha ni jerarquia verificable y quedaba bajo Conflicto regional de America como batalla interestatal. Se normaliza con fecha y se vincula a las Guerras apaches como conflicto de frontera; la Guerra Civil estadounidense permanece como contexto relacionado. La ficha no presenta al actual estado de Arizona, ni a los pueblos apaches, como Estados beligerantes homogeneos. Los aliases preservan el acceso a la ficha cuando la fuente usa el titulo ingles o una variante sin fecha."
  };
}

export const DRAGOON_SPRINGS_1862_CONFLICT_RENAMES = {
  "Primera batalla de Dragoon Springs": CANONICAL,
  "Primera batalla de Dragoon Spring": CANONICAL,
  "Primera batalla de Dragoon Springs (1862)": CANONICAL,
  "First Battle of Dragoon Springs": CANONICAL,
  "First Battle of Dragoon Springs (1862)": CANONICAL,
  "Batalla de Dragoon Springs": CANONICAL,
  "Batalla de Dragoon Springs (1862)": CANONICAL
};

export const DRAGOON_SPRINGS_1862_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [PARENT, CANONICAL]
};

export const DRAGOON_SPRINGS_1862_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: dragoonSprings1862Fix()
};
