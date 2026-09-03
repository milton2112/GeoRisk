function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate de Toldos Viejos (11 de septiembre de 1826)";
const PARENT = "Conflictos de frontera del sur bonaerense (1820-1829)";
const CAMPAIGN = "Violencia de frontera y operaciones de 1826 en el sur bonaerense";

const SOURCES = {
  argentinaGob: source(
    "Argentina.gob.ar: resena institucional sobre Francisco Javier Muniz que confirma su participacion militar en los combates de Sauce Grande y Toldos Viejos",
    "https://www.argentina.gob.ar/noticias/en-estos-momentos-de-pandemia-recordamos-al-dr-francisco-muniz-prestigioso-medico-militar"
  ),
  unlpRepository: source(
    "Universidad Nacional de La Plata / SEDICI: estudio historico que describe la derrota de la fuerza de Andres Morel ante combatientes vinculados al cacique Mulato y fusileros pincheirinos bajo Gode; GeoRisk no reproduce su vocabulario historico sin contexto",
    "https://sedici.unlp.edu.ar/bitstream/handle/10915/29189/Documento_completo.pdf?isAllowed=y&sequence=1"
  ),
  navalHistoricalChronology: source(
    "FADARA / Revista del Mar: cronologia historica que ubica el episodio de Toldos Viejos en septiembre de 1826; su terminologia de epoca no se replica en la ficha",
    "https://fadara.armada.mil.ar/assets/publicaciones/doc/malones-logistica-gianola20220510114050.pdf"
  ),
  historicalStudy: source(
    "Estudio historico digitalizado sobre las fronteras bonaerenses: fecha el combate el 11 de septiembre de 1826 y lo vincula con las operaciones posteriores de Rauch; se usa con cautela junto a los repositorios institucionales",
    "https://mapuche.info/wps_pdf/martinez2011.pdf"
  )
};

function toldosViejos1826Fix() {
  const hierarchySources = [
    SOURCES.argentinaGob,
    SOURCES.unlpRepository,
    SOURCES.navalHistoricalChronology,
    SOURCES.historicalStudy
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate terrestre",
    conflictType: "frontera",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1826,
    endYear: 1826,
    region: "Paraje de Toldos Viejos, frontera sur bonaerense, en las cercanias de Dolores, provincia de Buenos Aires, Argentina; las referencias locales de las fuentes no siempre son identicas",
    normalizedRegion: "Paraje de Toldos Viejos, frontera sur bonaerense, en las cercanias de Dolores, provincia de Buenos Aires, Argentina; las referencias locales de las fuentes no siempre son identicas",
    cause: "El combate se produjo durante un ciclo de violencia, incursiones, desplazamientos y respuestas militares alrededor de la frontera sur bonaerense en 1826. Intervinieron fuerzas provinciales y entrerrianas al mando de Andres Morel, combatientes indigenas vinculados al cacique Mulato y fusileros pincheirinos. GeoRisk no reduce esas redes a dos bloques nacionales homogeneos.",
    outcome: "Las fuentes coinciden en que la fuerza de Morel fue derrotada y desbandada con bajas graves. No existe una relacion documental conciliada de efectivos, muertos y heridos de todos los participantes; GeoRisk no transforma relatos retrospectivos en una cifra cerrada.",
    consequences: "La derrota increment\u00f3 la alarma de las autoridades y de los poblados de frontera, y antecedi\u00f3 las operaciones de Federico Rauch iniciadas en octubre de 1826. No cerr\u00f3 un conflicto general ni equivale a las campa\u00f1as posteriores de Rauch o a la Conquista del Desierto de d\u00e9cadas posteriores.",
    chronology: [
      {
        year: 1826,
        event: "La frontera sur bonaerense atravesaba un periodo de violencia y movilidad de actores provinciales, indigenas y pincheirinos; las categorias de las fuentes son heterogeneas y no describen dos bandos nacionales uniformes."
      },
      {
        year: 1826,
        event: "El 11 de septiembre, una fuerza al mando del teniente coronel Andres Morel fue derrotada en Toldos Viejos por combatientes vinculados al cacique Mulato y fusileros pincheirinos dirigidos por Gode."
      },
      {
        year: 1826,
        event: "Desde octubre, Federico Rauch encabez\u00f3 operaciones militares posteriores en la frontera bonaerense; no se presentan como parte del mismo combate ni como su tratado de cierre."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Andres Morel",
      "Cacique Mulato",
      "Fusileros pincheirinos",
      "Federico Rauch",
      "Francisco Javier Muniz",
      "Dolores"
    ],
    participants: [
      {
        side: "Fuerza de frontera de Buenos Aires y Entre Rios",
        members: [
          "Provincias Unidas del Rio de la Plata",
          "Gobierno de Buenos Aires",
          "Agrupacion de Caballeria Entrerriana",
          "Escuadron de Dragones de Entre Rios",
          "Escuadron Husares de la Muerte",
          "Teniente coronel Andres Morel",
          "Francisco Javier Muniz"
        ],
        casualties: "Las fuentes describen la derrota y dispersion de la fuerza de Morel con bajas graves, pero no ofrecen un parte conciliado de efectivos, muertos y heridos. GeoRisk no publica un total definitivo."
      },
      {
        side: "Fuerzas indigenas y pincheirinas vinculadas a Mulato",
        members: [
          "Cacique Mulato",
          "Combatientes indigenas de la frontera sur",
          "Fusileros pincheirinos",
          "Tomas Gode"
        ],
        casualties: "Los relatos retrospectivos mencionan una fuerza de alrededor de setecientos combatientes vinculados a Mulato y apoyo de fusileros pincheirinos. No hay un parte equivalente que permita cerrar efectivos, identidades individuales o bajas; GeoRisk conserva esa incertidumbre."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "11 de septiembre de 1826. La cronologia institucional ubica Toldos Viejos en septiembre y los estudios historicos coinciden en el dia; no se conserva en esta ficha un parte unico que concilie todos los detalles del combate.",
    sourceDispute: "La entrada importada solo decia Batalla de Toldos Viejos, sin fecha ni guerra padre, y la clasificaba como un conflicto interestatal generico de America. Las fuentes institucionales y los estudios historicos coinciden en el enfrentamiento de 1826, la derrota de la fuerza de Andres Morel y la participacion de combatientes vinculados al cacique Mulato y de fusileros pincheirinos. Difieren, sin embargo, en como describen los grupos, el tamano de la fuerza, la distancia exacta a Dolores y el vocabulario politico de la frontera. La ficha adopta Combate de Toldos Viejos, conserva el 11 de septiembre usado de forma consistente por las reconstrucciones consultadas y no convierte la estimacion de setecientos combatientes ni las bajas graves en estadisticas cerradas. Argentina se usa como referencia geografica contemporanea de navegacion, no para atribuir el bando de 1826 a un Estado argentino moderno.",
    curationPriority: "alta",
    curationBatch: "source-backed-toldos-viejos-1826-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Batalla de Toldos Viejos se normaliza como Combate de Toldos Viejos (11 de septiembre de 1826). Conflictos de frontera del sur bonaerense (1820-1829) y Violencia de frontera y operaciones de 1826 en el sur bonaerense son categorias organizativas de GeoRisk, no los titulos de una guerra declarada unica. La ficha no describe los territorios indigenas como un vacio, no mezcla el combate con la Guerra a Muerte en Chile, con las operaciones posteriores de Rauch ni con la Conquista del Desierto de las decadas de 1870 y 1880."
  };
}

export const TOLDOS_VIEJOS_1826_CONFLICT_RENAMES = {
  "Batalla de Toldos Viejos": CANONICAL,
  "Batalla de los Toldos Viejos": CANONICAL,
  "Combate de Toldos Viejos": CANONICAL,
  "Combate de los Toldos Viejos": CANONICAL,
  "Battle of Toldos Viejos": CANONICAL
};

export const TOLDOS_VIEJOS_1826_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: toldosViejos1826Fix()
};
