function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate de Wildcat Creek (Spur's Defeat, 22 de noviembre de 1812)";
const PARENT = "Guerra anglo-estadounidense de 1812";
const CAMPAIGN = "Expedicion de Samuel Hopkins a Prophetstown (noviembre de 1812)";

const SOURCES = {
  kentuckyNationalGuard: source(
    "Kentucky Army National Guard: cronologia militar que fecha la emboscada de Wildcat Creek el 22 de noviembre de 1812, menciona a Miller y Wilcox con unos sesenta jinetes y documenta su retirada",
    "https://ky.ng.mil/News/Article/2617077/kentucky-military-history-for-the-month-of-november/"
  ),
  usArmyHistory: source(
    "U.S. Army Center of Military History: sintesis institucional sobre Tippecanoe, la confederacion indigena de la region y su vinculacion con la Guerra de 1812; aporta contexto estrategico, no un parte completo de Wildcat Creek",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Indian-Wars/"
  ),
  federalHistoricalAtlas: source(
    "U.S. Government Publishing Office: capitulo historico federal que ubica Wild Cat Creek entre los enfrentamientos de la region de los Grandes Lagos durante la Guerra de 1812",
    "https://www.govinfo.gov/content/pkg/GOVPUB-I29-PURL-gpo124132/pdf/GOVPUB-I29-PURL-gpo124132.pdf"
  ),
  kentuckyHistoricalSociety: source(
    "Kentucky Historical Society: coleccion digital que conserva estudios y documentos sobre la campana de Hopkins y las operaciones de Indiana de noviembre de 1812; no resuelve por si sola el sitio fino ni las bajas",
    "https://www.kyhistory.com/digital/collection/RB/id/7710/"
  )
};

function wildcatCreek1812Fix() {
  const hierarchySources = [
    SOURCES.kentuckyNationalGuard,
    SOURCES.usArmyHistory,
    SOURCES.federalHistoricalAtlas,
    SOURCES.kentuckyHistoricalSociety
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate terrestre",
    conflictType: "colonial",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1812,
    endYear: 1812,
    region: "Cercanias de Wildcat Creek, territorio de Indiana de entonces, actual Indiana, Estados Unidos; la quebrada o punto exacto del combate no esta resuelto",
    normalizedRegion: "Cercanias de Wildcat Creek, territorio de Indiana de entonces, actual Indiana, Estados Unidos; la quebrada o punto exacto del combate no esta resuelto",
    cause: "Durante la Guerra de 1812, la expedicion estadounidense de Samuel Hopkins operaba en el territorio de Indiana en un contexto de expansion territorial, comunidades indigenas que defendian su autonomia y alianzas cambiantes. Un destacamento que se movio por Wildcat Creek fue emboscado; GeoRisk no reduce a los participantes indigenas a un unico bloque nacional ni presenta la expedicion como una accion neutral.",
    outcome: "El destacamento de Miller y Wilcox, descrito por la cronologia de la Guardia Nacional de Kentucky como de unos sesenta jinetes, se retiro rapidamente despues de la emboscada. El repliegue es el desenlace tactico documentado; GeoRisk no convierte relatos posteriores sobre una victoria amplia, efectivos o bajas en un balance definitivo.",
    consequences: "El episodio quedo asociado a la expedicion de Hopkins de noviembre de 1812 y a los nombres Spur's Defeat y Segunda batalla de Tippecanoe. No decidio por si solo la Guerra de 1812: las operaciones en el noroeste continuaron y el cierre general posterior fue el Tratado de Gante de 1814.",
    chronology: [
      {
        year: 1811,
        event: "El combate de Tippecanoe de 1811 y la destruccion de Prophetstown profundizaron el conflicto en el territorio de Indiana; no se confunden con el hecho de Wildcat Creek de 1812."
      },
      {
        year: 1812,
        event: "En noviembre, la expedicion de Samuel Hopkins se desplazo por la region de Prophetstown durante la Guerra de 1812."
      },
      {
        year: 1812,
        event: "El 22 de noviembre, los tenientes coroneles Miller y Wilcox y un destacamento de unos sesenta jinetes fueron emboscados en Wildcat Creek y se retiraron."
      },
      {
        year: 1814,
        event: "El Tratado de Gante cerro la Guerra de 1812 en un marco general posterior; no fue un acuerdo propio de este combate local."
      }
    ],
    treaties: [
      "Tratado de Gante (1814), cierre general posterior de la Guerra de 1812"
    ],
    related: [
      PARENT,
      CAMPAIGN,
      "Spur's Defeat",
      "Segunda batalla de Tippecanoe",
      "Samuel Hopkins",
      "Prophetstown",
      "Wildcat Creek"
    ],
    participants: [
      {
        side: "Destacamento de la expedicion estadounidense de Hopkins",
        members: [
          "Estados Unidos",
          "Expedicion de Samuel Hopkins",
          "Indiana Rangers",
          "Tropas de Kentucky",
          "Samuel Hopkins",
          "Teniente coronel Miller",
          "Teniente coronel Wilcox"
        ],
        casualties: "La cronologia institucional confirma la emboscada y retirada, pero no publica un parte conciliado de bajas. Algunas reconstrucciones posteriores agregan cifras de acciones del 21 y 22 de noviembre; GeoRisk no las presenta como un total definitivo de este combate."
      },
      {
        side: "Combatientes indigenas de la region de Wildcat Creek",
        members: [
          "Shawnee",
          "Kickapoo",
          "Ho-Chunk (Winnebago)",
          "Combatientes indigenas de la region de Prophetstown"
        ],
        casualties: "Las fuentes consultadas no proporcionan un parte equivalente para identificar todas las comunidades, mandos o bajas. Las atribuciones de grupos y liderazgos varian entre reconstrucciones posteriores; GeoRisk no las transforma en un censo ni en una cifra cerrada."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "22 de noviembre de 1812 para la emboscada principal, segun la cronologia de la Guardia Nacional de Kentucky. Algunos relatos agrupan incidentes del 21 y 22 de noviembre, por lo que la ficha no atribuye todos esos hechos a una sola jornada ni a un solo punto del arroyo.",
    sourceDispute: "La entrada importada solo decia Batalla de Wild Cat Creek, sin fecha ni guerra padre, y la clasificaba como un conflicto interestatal generico de America. La cronologia de la Guardia Nacional de Kentucky fecha la emboscada principal el 22 de noviembre de 1812, identifica a Miller y Wilcox con unos sesenta jinetes y describe una retirada precipitada. Los estudios posteriores usan tambien los nombres Wild Cat Creek, Wildcat Creek, Spur's Defeat y Segunda batalla de Tippecanoe; algunos agregan escaramuzas del 21 de noviembre, estimaciones de bajas y listas diferentes de pueblos indigenas. La ficha conserva el 22 como fecha del combate principal, trata el lugar exacto como no resuelto y no convierte esas variantes en datos cerrados. El apoyo britanico a redes indigenas en la guerra no prueba la presencia de una unidad britanica en la emboscada, por lo que no se le asigna como beligerante directo.",
    curationPriority: "alta",
    curationBatch: "source-backed-wildcat-creek-1812-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Batalla de Wild Cat Creek se normaliza como Combate de Wildcat Creek (Spur's Defeat, 22 de noviembre de 1812), dentro de la Guerra de 1812. Expedicion de Samuel Hopkins a Prophetstown (noviembre de 1812) es una categoria organizativa de GeoRisk, no una denominacion militar oficial. La ficha no confunde este combate con la batalla de Tippecanoe de 1811, con la batalla de Mississinewa de diciembre de 1812 ni con otros arroyos llamados Wildcat Creek."
  };
}

export const WILDCAT_CREEK_1812_CONFLICT_RENAMES = {
  "Batalla de Wild Cat Creek": CANONICAL,
  "Batalla de Wildcat Creek": CANONICAL,
  "Battle of Wild Cat Creek": CANONICAL,
  "Battle of Wildcat Creek": CANONICAL,
  "Spur's Defeat": CANONICAL,
  "Spurs Defeat": CANONICAL,
  "Second Battle of Tippecanoe": CANONICAL,
  "Segunda batalla de Tippecanoe": CANONICAL
};

export const WILDCAT_CREEK_1812_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: wildcatCreek1812Fix()
};
