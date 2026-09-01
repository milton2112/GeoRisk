function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval del canal de Procida (26 de junio de 1809)";
const PARENT = "Guerra de la Quinta Coalici\u00f3n (1809)";
const CAMPAIGN = "Expedici\u00f3n anglo-siciliana a Ischia y Procida (junio-julio de 1809)";

const SOURCES = {
  neapolitanNavalStudy: source(
    "Virgilio Ilari, Piero Crociani y Giancarlo Boeri, La Real Marina (1800-1815): estudio sobre la expedicion de Ischia y Procida, el bloqueo del canal y las fuerzas anglo-sicilianas",
    "https://www.centotredicesimo.org/wp-content/uploads/2015/11/Ilari-Reale-Marina-Siciliana-1805-1815-libre.pdf",
    "media"
  ),
  britishNavalRecord: source(
    "Registro digital de una historia naval britanica en e-rara: operaciones de Cyane y Espoir frente a Procida en junio de 1809",
    "https://www.e-rara.ch/download/pdf/22972843.pdf",
    "media"
  ),
  navalChronology: source(
    "Royal Navy Chronology: cronologia de las acciones de Cyane y Espoir frente a Procida entre el 25 y el 27 de junio de 1809",
    "https://www.minotaur.org/chronology.htm",
    "media"
  )
};

function procidaCanal1809Fix() {
  const hierarchySources = [
    SOURCES.neapolitanNavalStudy,
    SOURCES.britishNavalRecord,
    SOURCES.navalChronology
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate naval",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1809,
    endYear: 1809,
    region: "Canal de Procida, entre Procida, Ischia y cabo Miseno, golfo de Napoles, actual Italia",
    normalizedRegion: "Canal de Procida y golfo de Napoles, Italia",
    cause: "Durante la Guerra de la Quinta Coalicion, la fuerza naval del Reino de Napoles bajo Joachim Murat intento forzar el canal de Procida para superar el bloqueo anglo-siciliano y unir los buques procedentes de Gaeta con la division retenida en Pozzuoli.",
    outcome: "Resultado tactico anglo-siciliano en la accion del 26 de junio: la flotilla de Giovanni Caracciolo no logro forzar el paso hacia Napoles y se replego tras el combate. Las fuentes divergen de forma importante sobre el numero de canioneras hundidas, capturadas o varadas; GeoRisk no publica un total cerrado ni convierte las acciones del 27 de junio en parte de una sola batalla.",
    consequences: "El bloqueo anglo-siciliano del canal continuo y la expedicion de Ischia y Procida siguio durante los dias posteriores. La accion limito localmente la movilidad naval napolitana, pero no decidio por si sola la Guerra de la Quinta Coalicion.",
    chronology: [
      {
        year: 1809,
        event: "Entre el 10 y el 24 de junio, una expedicion anglo-siciliana se desplazo contra Ischia y Procida y entro en el golfo de Napoles."
      },
      {
        year: 1809,
        event: "El 24 de junio, HMS Cyane, HMS Espoir y canioneras sicilianas quedaron destacados para bloquear el canal de Procida y la costa al sur."
      },
      {
        year: 1809,
        event: "El 25 de junio, la division de Giovanni Bausan intento salir de Pozzuoli y fue obligada a regresar antes de poder enlazar con la flotilla de Gaeta."
      },
      {
        year: 1809,
        event: "El 26 de junio, Giovanni Caracciolo llego con canioneras desde Gaeta, encontro el bloqueo y combati\u00f3 durante el intento de forzar el canal."
      },
      {
        year: 1809,
        event: "El 27 de junio continuaron las acciones frente a Pozzuoli y Napoles; GeoRisk las relaciona con la operacion, pero no las suma de forma automatica a las bajas del combate del dia 26."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Reino de Napoles (1806-1815)",
      "Reino de Sicilia",
      "Procida",
      "Ischia",
      "cabo Miseno",
      "Napoles",
      "Giovanni Caracciolo",
      "Giovanni Bausan",
      "George Martin",
      "Thomas Staines",
      "Robert Mitford",
      "HMS Cyane",
      "HMS Espoir"
    ],
    participants: [
      {
        side: "Fuerzas navales del Reino de Napoles bajo Murat",
        members: [
          "Reino de Napoles (1806-1815)",
          "Real Marina napolitana",
          "Giovanni Caracciolo",
          "flotilla de canioneras procedente de Gaeta",
          "Joachim Murat"
        ],
        casualties: "No existe un balance humano bilateral consolidado en las fuentes revisadas. Los recuentos de embarcaciones napolitanas varian entre los relatos locales y britanicos, por lo que GeoRisk no fija una cifra unica."
      },
      {
        side: "Fuerzas navales anglo-sicilianas",
        members: [
          "Reino Unido",
          "Royal Navy",
          "Reino de Sicilia",
          "HMS Cyane",
          "HMS Espoir",
          "flotilla de canioneras sicilianas",
          "George Martin",
          "Thomas Staines",
          "Robert Mitford"
        ],
        casualties: "Los relatos britanicos registran bajas y danos de Cyane a lo largo de las acciones del 25 al 27 de junio, pero no separan siempre el combate del dia 26. GeoRisk no traslada esas cifras a un balance cerrado de esta ficha."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "26 de junio de 1809 para el intento de Caracciolo de forzar el canal. La operacion naval relacionada se extendio del 25 al 27 de junio, y el canal fue escenario de otra accion distinta en 1799; esta ficha no mezcla esos episodios.",
    sourceDispute: "El canal de Procida fue escenario de una accion distinta en 1799 y de varios choques entre el 25 y el 27 de junio de 1809. Para 1809, las cronologias britanicas destacan capturas y destrucciones de canioneras, mientras los relatos napolitanos enumeran perdidas y varadas de otro modo. La ficha fija el intento de paso del 26 de junio, conserva los tres dias como contexto y evita declarar un total de buques o bajas humanas que las fuentes no reconcilian.",
    curationPriority: "alta",
    curationBatch: "source-backed-procida-canal-1809-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada recibida como Battle of the Procida Canal figuraba solo bajo Francia, sin fecha, lugar, contraparte ni guerra. Se normaliza para la accion de 1809 a partir de la documentacion de la expedicion anglo-siciliana, con Reino Unido e Italia para navegacion contemporanea. Francia se conserva como asociacion de la fuente original, pero los bandos historicos de la ficha son el Reino de Napoles bajo Murat y la fuerza anglo-siciliana. No se absorbe la batalla de 1799 ni se unifican sus bajas o mandos."
  };
}

export const PROCIDA_CANAL_1809_CONFLICT_RENAMES = {
  "Battle of the Procida Canal": CANONICAL,
  "Battle of Procida Canal": CANONICAL,
  "Batalla de Procida Canal": CANONICAL,
  "Batalla del canal de Procida": CANONICAL,
  "Battaglia del Canale di Procida": CANONICAL,
  "Battaglia del Canale di Procida (1809)": CANONICAL,
  "Bataille navale de Procida": CANONICAL,
  "Bataille navale de Procida (1809)": CANONICAL
};

export const PROCIDA_CANAL_1809_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL],
  Italia: [CANONICAL]
};

export const PROCIDA_CANAL_1809_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: procidaCanal1809Fix()
};
