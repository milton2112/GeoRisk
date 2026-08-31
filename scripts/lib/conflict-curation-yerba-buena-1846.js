function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Captura de Yerba Buena (1846)";
const PARENT = "Guerra mexicano-estadounidense";
const CAMPAIGN = "Campa\u00f1a de California de 1846-1847";

const SOURCES = {
  npsHistoricStudy: source(
    "National Park Service, Historic Resource Study de El Presidio: orden a Montgomery, desembarco del 9 de julio de 1846, izado de bandera y ausencia de desafio organizado",
    "https://www.nps.gov/prsf/learn/historyculture/upload/elpresid.pdf"
  ),
  npsGoldenGate: source(
    "National Park Service, Golden Gate National Recreation Area: retirada de la pequena fuerza mexicana del Presidio y toma de Yerba Buena por los marines de Montgomery",
    "https://www.nps.gov/goga/learn/historyculture/spanish-mexican-period.htm"
  ),
  libraryOfCongress: source(
    "Library of Congress: registro de la vista de Yerba Buena que fecha el izado de la bandera y la toma por Montgomery el 9 de julio de 1846",
    "https://www.loc.gov/pictures/item/2004666425/"
  ),
  navalHistory: source(
    "Naval History and Heritage Command: toma de posesion de Yerba Buena por orden de John D. Sloat el 9 de julio de 1846",
    "https://www.history.navy.mil/our-collections/photography/numerical-list-of-images/nhhc-series/nh-series/NH-01000/NH-1700.html"
  ),
  inah: source(
    "Instituto Nacional de Antropologia e Historia: marco y cierre de la intervencion estadounidense de 1846-1848 mediante el Tratado de Guadalupe Hidalgo",
    "https://mnh.inah.gob.mx/glosario"
  )
};

function yerbaBuena1846Fix() {
  const hierarchySources = [
    SOURCES.npsHistoricStudy,
    SOURCES.npsGoldenGate,
    SOURCES.libraryOfCongress,
    SOURCES.navalHistory,
    SOURCES.inah
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "ocupacion sin combate",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1846,
    endYear: 1846,
    region: "Yerba Buena, actual San Francisco, Alta California mexicana; actual California, Estados Unidos",
    normalizedRegion: "San Francisco, California, Estados Unidos",
    cause: "Dentro de la Guerra mexicano-estadounidense, el Escuadron del Pacifico estadounidense recibio ordenes de tomar puntos de Alta California. La accion de Yerba Buena fue una ocupacion militar del asentamiento y del entorno del Presidio, no una batalla territorial independiente ni una transferencia acordada de soberania.",
    outcome: "Las fuerzas de John B. Montgomery ocuparon Yerba Buena el 9 de julio de 1846 e izaron la bandera estadounidense. Las fuentes institucionales consultadas describen la ausencia de una resistencia organizada al desembarco; GeoRisk la normaliza como captura u ocupacion sin combate, no como una victoria de batalla con bajas inventadas.",
    consequences: "La toma incorporo Yerba Buena a la ocupacion militar estadounidense de Alta California durante la guerra. El asentamiento pasaria a llamarse San Francisco, pero la ficha no presenta ese cambio de nombre como el cierre juridico de la guerra: el arreglo general llego con el Tratado de Guadalupe Hidalgo de 1848.",
    chronology: [
      {
        year: 1846,
        event: "La Guerra mexicano-estadounidense abrio operaciones navales y terrestres de Estados Unidos sobre los puertos y asentamientos de Alta California."
      },
      {
        year: 1846,
        event: "El 9 de julio, por orden de John D. Sloat, John B. Montgomery desembarco con una fuerza de USS Portsmouth en Yerba Buena e izo la bandera estadounidense."
      },
      {
        year: 1846,
        event: "Las fuentes del National Park Service describen que no hubo desafio organizado a la toma; por eso GeoRisk conserva el nombre historico Batalla de Yerba Buena solo como alias y no como tipo del hecho."
      },
      {
        year: 1848,
        event: "El Tratado de Guadalupe Hidalgo cerro la Guerra mexicano-estadounidense; no se confunde ese arreglo general con una rendicion o tratado local de Yerba Buena."
      }
    ],
    treaties: ["Tratado de Guadalupe Hidalgo (2 de febrero de 1848): cierre general de la Guerra mexicano-estadounidense"],
    related: [PARENT, CAMPAIGN, "John B. Montgomery", "USS Portsmouth", "Yerba Buena", "San Francisco", "Alta California"],
    participants: [
      {
        side: "Fuerza de desembarco estadounidense",
        members: ["Estados Unidos", "Marina de los Estados Unidos", "USS Portsmouth", "John B. Montgomery", "marines y marineros de USS Portsmouth"],
        casualties: "Las fuentes institucionales describen una ocupacion sin desafio organizado, no un intercambio de fuego con una tabla bilateral de bajas. GeoRisk no transforma los efectivos de desembarco en un recuento de bajas."
      },
      {
        side: "Autoridades y presencia militar mexicana de Alta California",
        members: ["M\u00e9xico", "Alta California mexicana", "guarnicion del Presidio de San Francisco"],
        casualties: "National Park Service describe una retirada o ausencia de resistencia organizada en el Presidio y el desembarco. No se publica un total de bajas mexicanas porque las fuentes revisadas no documentan un combate bilateral en Yerba Buena."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "9 de julio de 1846",
    sourceDispute: "La discrepancia principal es de nomenclatura: algunas bibliografias y la pagina de consulta usan Batalla de Yerba Buena, mientras que los registros institucionales describen una toma u ocupacion sin desafio organizado. GeoRisk conserva el nombre de batalla como alias para no romper busquedas, pero usa Captura de Yerba Buena (1846) como titulo y ocupacion sin combate como tipo. Mexico se incorpora como soberania y contraparte historica; California y Estados Unidos actuales funcionan como referencias geograficas y estatales de navegacion, no como una afirmacion de que la toma resolvio por si sola la soberania de 1846-1848.",
    curationPriority: "alta",
    curationBatch: "source-backed-yerba-buena-1846-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior se llamaba Batalla de Yerba Buena, solo aparecia en Estados Unidos y carecia de fecha, Mexico, ubicacion, guerra y participantes verificables. Se normaliza como Captura de Yerba Buena (1846), se integra a la Campana de California y se conecta con Mexico. La correccion evita inventar combate, bajas o un acuerdo local; conserva la toma sin resistencia organizada y el Tratado de Guadalupe Hidalgo como cierre general posterior."
  };
}

export const YERBA_BUENA_1846_CONFLICT_RENAMES = {
  "Batalla de Yerba Buena": CANONICAL,
  "Batalla de Yerba Buena (1846)": CANONICAL,
  "Captura de Yerba Buena": CANONICAL,
  "Captura de Yerba Buena (1846)": CANONICAL,
  "Toma de Yerba Buena": CANONICAL,
  "Battle of Yerba Buena": CANONICAL,
  "Capture of Yerba Buena": CANONICAL
};

export const YERBA_BUENA_1846_COUNTRY_CONFLICT_ADDITIONS = {
  "M\u00e9xico": [CANONICAL]
};

export const YERBA_BUENA_1846_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: yerbaBuena1846Fix()
};
