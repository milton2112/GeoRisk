function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla del lago Peipus (1242)";
const PARENT = "Guerra fronteriza entre Novgorod y la Orden Livona (1240-1242)";
const CONTEXT = "Cruzadas del Norte";
const CAMPAIGN = "Contraofensiva de Pskov y el lago Peipus (1242)";

const SOURCES = {
  novgorodChronicle: source(
    "University of North Carolina at Greensboro, The Novgorod Chronicle: entradas de 1240 y 1242 sobre Pskov, Alejandro, Andrei, el combate del 5 de abril y la paz posterior",
    "https://home.uncg.edu/~jwjones/russia/377readings/novgorodchronicle.html"
  ),
  northernCrusades: source(
    "Dartmouth, Sources for Crusade History: contexto documental de las Cruzadas del Norte y de la Cronica rimada livonia",
    "https://sites.dartmouth.edu/sourcesforcrusadehistory/the-northern-crusades/"
  ),
  sourceCriticism: source(
    "Open War Studies: contraste entre la Cronica de Novgorod y la Cronica rimada livonia; limites sobre escala, bajas y el relato tardio del hundimiento en el hielo",
    "https://openwarstudies.org/en/dossiers/nevskiy-danylo/"
  )
};

function lakePeipus1242Fix() {
  const hierarchySources = [
    SOURCES.novgorodChronicle,
    SOURCES.northernCrusades,
    SOURCES.sourceCriticism
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla",
    conflictType: "frontera",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1242,
    endYear: 1242,
    region: "Lago Peipus o Chud, cerca de Uzmen y la Roca del Cuervo; actual frontera entre Estonia y Rusia",
    normalizedRegion: "Lago Peipus, Estonia y Rusia",
    cause: "Tras la ofensiva livonia de 1240-1241 contra pueblos vod, Pskov y el entorno de Novgorod, Alejandro y Andrei dirigieron una contraofensiva sobre la frontera. La batalla se integra en las Cruzadas del Norte y no se presenta como una guerra entre Estados modernos.",
    outcome: "Victoria militar de las fuerzas de Novgorod y de Andrei de Vladimir-Suzdal sobre las fuerzas livonias. La Cronica de Novgorod registra una paz posterior, liberacion de rehenes de Pskov y canje de cautivos; GeoRisk no fija un total de bajas porque las cronicas difieren de forma marcada.",
    consequences: "La paz posterior de 1242 redujo la presion livonia sobre Pskov y el entorno de Novgorod. La ficha conserva ese efecto documentado, pero evita convertir el combate en un cierre definitivo de todas las disputas balticas o en una continuidad estatal directa con Rusia o Estonia actuales.",
    chronology: [
      {
        year: 1240,
        event: "La Cronica de Novgorod situa una ofensiva de fuerzas germanas y chud contra los vod, con tributo y una fortificacion en Koporya; el contexto incluye presion sobre rutas y poblaciones cercanas a Novgorod."
      },
      {
        year: 1242,
        event: "Alejandro, los hombres de Novgorod, su hermano Andrei y fuerzas del Bajo Pais avanzaron hacia Pskov y el territorio chud antes de enfrentar a las fuerzas livonias junto al lago."
      },
      {
        year: 1242,
        event: "El 5 de abril se produjo el combate. La cronica describe persecucion sobre el hielo, pero no establece por si sola un hundimiento masivo de combatientes."
      },
      {
        year: 1242,
        event: "Segun la Cronica de Novgorod, siguieron la liberacion de rehenes de Pskov, un intercambio de cautivos y una paz con retiro de pretensiones sobre territorios citados."
      }
    ],
    treaties: ["Acuerdo posterior de 1242: paz e intercambio de cautivos descritos por la Cronica de Novgorod"],
    related: [CONTEXT, PARENT, CAMPAIGN, "Republica de Novgorod", "Orden Livona", "Alejandro Nevski", "Andrei Yaroslavich", "Pskov"],
    participants: [
      {
        side: "Fuerzas de Novgorod y Vladimir-Suzdal",
        members: ["Republica de Novgorod", "fuerzas de Vladimir-Suzdal", "Alejandro Nevski", "Andrei Yaroslavich", "milicia de Novgorod"],
        casualties: "No hay un total comparable y contemporaneo para este bando. La ficha no infiere bajas a partir de relatos posteriores ni de estimaciones modernas incompatibles."
      },
      {
        side: "Fuerzas livonias",
        members: ["Orden Livona", "Obispado de Dorpat", "Hermann de Dorpat", "fuerzas germanas y chud citadas por la Cronica de Novgorod", "contingentes de la Livonia medieval"],
        casualties: "La Cronica de Novgorod y la Cronica rimada livonia ofrecen cifras y categorias muy distintas. GeoRisk conserva el desacuerdo y no agrega sus recuentos en una sola cifra."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "5 de abril de 1242, fecha indicada por la Cronica de Novgorod",
    sourceDispute: "La Cronica de Novgorod identifica a Alejandro, Andrei, las fuerzas germanas y chud, el combate del 5 de abril y la paz posterior. La Cronica rimada livonia y la de Novgorod difieren en bajas, categorias de combatientes y escala. La imagen de un hundimiento masivo bajo el hielo pertenece a una elaboracion tardia: las fuentes tempranas describen combate y persecucion sobre el hielo, pero no respaldan por si solas ese relato. Rusia y Estonia se usan solo como referencias geograficas y de navegacion actuales; no afirman continuidad estatal. Dinamarca se retira de la ficha porque las fuentes usadas no establecen una beligerancia estatal danesa en este combate.",
    curationPriority: "alta",
    curationBatch: "source-backed-lake-peipus-1242-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior aparecia sin fecha, guerra, oponente, ubicacion ni participantes verificables y solo estaba asociada a Dinamarca. Se normaliza como Batalla del lago Peipus (1242), se ubica en la guerra fronteriza de 1240-1242 dentro del contexto de las Cruzadas del Norte y se conecta con Rusia y Estonia para navegacion historica y geografica actual. La guerra y la campana son etiquetas organizativas de GeoRisk, no nombres de Estados modernos ni una equivalencia con el relato cinematografico posterior."
  };
}

export const LAKE_PEI_PUS_1242_CONFLICT_RENAMES = {
  "Batalla del Lago Peipus": CANONICAL,
  "Batalla del lago Peipus": CANONICAL,
  "Batalla del Lago Peipus (1242)": CANONICAL,
  "Batalla del lago Peipus (1242)": CANONICAL,
  "Battle of Lake Peipus": CANONICAL,
  "Battle on the Ice": CANONICAL
};

export const LAKE_PEI_PUS_1242_COUNTRY_CONFLICT_ADDITIONS = {
  Rusia: [CANONICAL],
  Estonia: [CANONICAL]
};

export const LAKE_PEI_PUS_1242_COUNTRY_CONFLICT_EXCLUSIONS = {
  Dinamarca: [CANONICAL]
};

export const LAKE_PEI_PUS_1242_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: lakePeipus1242Fix()
};
