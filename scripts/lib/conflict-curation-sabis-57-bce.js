function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla del Sabis (tradicionalmente Sambre, 57 a. C.)";
const PARENT = "Guerras de las Galias (58-50 a. C.)";
const CAMPAIGN = "Campa\u00f1a romana contra los belgas (57 a. C.)";

const SOURCES = {
  australianWarMemorial: source(
    "Australian War Memorial: sintesis historica que situa en 57 a. C. el ataque de tribus belgas dirigidas por los nervios contra las legiones de Julio Cesar en el entorno tradicional del Sambre y la victoria romana posterior",
    "https://www.awm.gov.au/articles/blog/a-brief-military-history-of-flanders"
  ),
  caesarGallicWar: source(
    "University of Chicago, texto de La guerra de las Galias, libro II: fuente primaria traducida sobre la emboscada, el combate de las legiones romanas con atrebates, viromanduos y nervios, y la rendicion posterior de estos ultimos",
    "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Caesar/Gallic_War/2%2A.html"
  ),
  liviusNervii: source(
    "Livius: distingue la batalla del rio Sabis de 57 a. C. del asedio al campamento de Quinto Tulio Ciceron de 54 a. C., dos episodios distintos en la resistencia nervia a Roma",
    "https://www.livius.org/articles/place/bagacum-bavay/"
  )
};

function sabis57BceFix() {
  const hierarchySources = [
    SOURCES.australianWarMemorial,
    SOURCES.caesarGallicWar,
    SOURCES.liviusNervii
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla campal",
    conflictType: "colonial",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: -57,
    endYear: -57,
    region: "Valle del rio Sabis; identificacion tradicional en el entorno del Sambre, al sur de la actual Valenciennes, norte de Francia",
    normalizedRegion: "Norte de la actual Francia, entorno tradicional del Sabis/Sambre",
    cause: "Durante la conquista romana de la Galia, varias comunidades belgas se movilizaron contra el avance de las legiones de Julio Cesar. Los nervios, atrebates y viromanduos atacaron a las fuerzas romanas mientras estas preparaban un campamento junto al rio identificado por la tradicion como Sambre.",
    outcome: "Tras una emboscada que puso en riesgo a varias legiones, las fuerzas romanas recuperaron la iniciativa y derrotaron a la coalicion belga en el combate. La ficha registra una victoria tactica romana y no la presenta como el cierre por si solo de las Guerras de las Galias.",
    consequences: "La derrota debilito la resistencia de los nervios y contribuyo al avance de Roma en la Galia Belgica. La conquista y las rebeliones regionales continuaron; la entrada no confunde este combate de 57 a. C. con la revuelta y el asedio al campamento de Quinto Tulio Ciceron de 54 a. C.",
    chronology: [
      {
        year: -58,
        event: "Julio Cesar inicio la campa\u00f1a de conquista de la Galia, que llevo las operaciones romanas hacia las comunidades belgas del norte al a\u00f1o siguiente."
      },
      {
        year: -57,
        event: "En 57 a. C., los nervios, atrebates y viromanduos atacaron a las legiones romanas durante la preparacion de un campamento junto al rio Sabis, llamado Sambre en una identificacion tradicional."
      },
      {
        year: -57,
        event: "Las legiones romanas resistieron la emboscada y contraatacaron. El relato de Cesar describe la derrota de los nervios y una rendicion posterior, pero la ficha no consolida las cifras de efectivos o bajas transmitidas por una sola fuente."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Julio Cesar",
      "Republica romana",
      "Nervios",
      "Atrebates",
      "Viromanduos",
      "Galia Belgica",
      "Rio Sabis",
      "Rio Sambre"
    ],
    participants: [
      {
        side: "Fuerzas de la Republica romana",
        members: ["Republica romana", "Julio Cesar", "Legiones romanas"],
        casualties: "El relato de Cesar describe un combate muy costoso para varias unidades romanas, pero las fuentes usadas no permiten convertir ese relato en un total moderno y reconciliado de bajas."
      },
      {
        side: "Coalicion belga",
        members: ["Nervios", "Atrebates", "Viromanduos"],
        casualties: "Cesar ofrece cifras extremas sobre la perdida nervia y los supervivientes, pero proceden de la narracion de la parte vencedora. GeoRisk no las publica como un balance independiente ni agrega bajas de toda la coalicion."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "57 a. C. Las fuentes consultadas distinguen esta batalla del asedio de 54 a. C. al campamento de Quinto Tulio Ciceron.",
    sourceDispute: "Sambre es una identificacion tradicional del rio Sabis citado en la fuente antigua; la ubicacion exacta sigue siendo objeto de debate topografico. Las fuentes coinciden, sin embargo, en separar el combate de 57 a. C. de la crisis de 54 a. C. La ficha conserva Sambre como alias para que el usuario encuentre la entrada importada, pero usa Sabis como nombre historico y no convierte las cifras de Cesar en datos cerrados.",
    curationPriority: "alta",
    curationBatch: "source-backed-sabis-57-bce-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Sambre, estaba asociada a Estados Unidos y a un conflicto regional de America sin fecha ni jerarquia. Se normaliza como Batalla del Sabis (tradicionalmente Sambre, 57 a. C.) dentro de las Guerras de las Galias. Francia se enlaza unicamente como referencia geografica contemporanea del entorno de la batalla; no se presenta a Francia moderna como beligerante, y Estados Unidos se retira por completo de la ficha. Campa\u00f1a romana contra los belgas (57 a. C.) es una categoria editorial de GeoRisk, no el titulo de una campa\u00f1a citado literalmente por las fuentes."
  };
}

export const SABIS_57_BCE_CONFLICT_RENAMES = {
  "Batalla de Sambre": CANONICAL,
  "Batalla del Sabis": CANONICAL,
  "Batalla del rio Sambre": CANONICAL,
  "Batalla del r\u00edo Sambre": CANONICAL,
  "Batalla del rio Sambre (54 a. C.)": CANONICAL,
  "Batalla del r\u00edo Sambre (54 a. C.)": CANONICAL,
  "Battle of Sambre": CANONICAL,
  "Battle of the Sambre": CANONICAL,
  "Battle of the Sabis": CANONICAL,
  "Battle of the Sabis (57 BC)": CANONICAL
};

export const SABIS_57_BCE_COUNTRY_CONFLICT_ADDITIONS = {
  Francia: [CANONICAL]
};

export const SABIS_57_BCE_COUNTRY_CONFLICT_EXCLUSIONS = {
  "Estados Unidos": [CANONICAL]
};

export const SABIS_57_BCE_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: sabis57BceFix()
};
