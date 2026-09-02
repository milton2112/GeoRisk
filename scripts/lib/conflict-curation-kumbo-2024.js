function source(label, url, confidence = "media") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Kumbo (10 de abril de 2024)";
const PARENT = "Crisis angl\u00f3fona de Camer\u00fan";
const CAMPAIGN = "Operaciones en Bui de 2024";

const SOURCES = {
  guardianPost: source(
    "The Guardian Post Cameroon: parte de las autoridades de Bui sobre una operaci\u00f3n en Kumbo y cuatro presuntos separatistas muertos tras los hechos del 10 de abril",
    "https://theguardianpostcameroon.com/post/2627/fr/military-raid-leaves-four-dead-in-kumbo-"
  ),
  cameroonNewsAgency: source(
    "Cameroon News Agency: reporte local del 11 de abril sobre incendios, muertes denunciadas y la afirmaci\u00f3n separatista de haber tomado un arma del BIR tras una emboscada en Bui",
    "https://cameroonnewsagency.com/govt-forces-on-rampage-kill-three-civilians-in-kumbo-burn-houses/"
  ),
  mimiMefo: source(
    "Mimi Mefo Info: apertura posterior de una base log\u00edstica del BIR en Kumbo y contexto de actividad separatista en la divisi\u00f3n de Bui",
    "https://mimimefoinfos.com/kumbo-bir-installs-base-in-separatists-fief/"
  ),
  crisisGroup: source(
    "International Crisis Group, CrisisWatch: ataques separatistas previos contra fuerzas gubernamentales en Kumbo, divisi\u00f3n de Bui, dentro de la crisis angl\u00f3fona",
    "https://crisisgroup-staging.sbx.so/crisiswatch/january-alerts-and-december-trends-2022"
  )
};

function kumbo2024Fix() {
  const hierarchySources = [
    SOURCES.guardianPost,
    SOURCES.cameroonNewsAgency,
    SOURCES.mimiMefo,
    SOURCES.crisisGroup
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "ataque a base y combate urbano",
    conflictType: "insurgencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 2024,
    endYear: 2024,
    region: "Kumbo y alrededores, divisi\u00f3n de Bui, Regi\u00f3n del Noroeste, Camer\u00fan",
    normalizedRegion: "Kumbo y alrededores, divisi\u00f3n de Bui, Regi\u00f3n del Noroeste, Camer\u00fan",
    cause: "En el marco de la crisis angl\u00f3fona, grupos separatistas manten\u00edan actividad armada en la divisi\u00f3n de Bui. Las fuentes locales sit\u00faan el enfrentamiento en un ataque contra una posici\u00f3n del Batall\u00f3n de Intervenci\u00f3n R\u00e1pida (BIR) en Kumbo.",
    outcome: "Resultado t\u00e1ctico disputado. Las fuentes disponibles coinciden en que hubo un ataque y operaciones posteriores de seguridad, pero no permiten atribuir una victoria verificable a un bando ni consolidar bajas.",
    consequences: "Los reportes posteriores describen operaciones de seguridad, denuncias de da\u00f1os a viviendas y versiones incompatibles sobre muertos civiles y combatientes. A fines de abril se inaugur\u00f3 una nueva base del BIR en Kumbo; la ficha la registra como hito posterior sin presentarla como consecuencia exclusiva del combate.",
    chronology: [
      {
        year: 2017,
        event: "La crisis angl\u00f3fona se convirti\u00f3 en un conflicto armado persistente entre el Estado camerun\u00e9s y grupos separatistas en las regiones angloparlantes."
      },
      {
        year: 2024,
        event: "El 10 de abril, fuentes locales situaron un ataque de combatientes separatistas contra una posici\u00f3n del BIR en Kumbo y enfrentamientos en la zona."
      },
      {
        year: 2024,
        event: "Durante los d\u00edas siguientes se publicaron relatos divergentes sobre operaciones de seguridad, muertes y da\u00f1os a viviendas en localidades de Bui."
      },
      {
        year: 2024,
        event: "El 30 de abril se inaugur\u00f3 una nueva base del BIR en Kumbo, seg\u00fan reportes de prensa locales publicados en mayo."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Operaci\u00f3n Bui Clean"],
    participants: [
      {
        side: "Estado camerun\u00e9s",
        members: [
          "Camer\u00fan",
          "Fuerzas Armadas de Camer\u00fan",
          "Batall\u00f3n de Intervenci\u00f3n R\u00e1pida (BIR)"
        ],
        casualties: "No hay un parte independiente y homologado. Fuentes locales y autoridades difundieron recuentos incompatibles, por lo que GeoRisk no publica una cifra cerrada."
      },
      {
        side: "Fuerzas separatistas angloparlantes",
        members: ["Bui Unity Warriors (BUW)", "Fuerzas separatistas de Ambazonia"],
        casualties: "No hay un parte independiente y homologado. Las afirmaciones sobre combatientes muertos y material capturado proceden de fuentes con versiones divergentes."
      }
    ],
    hierarchyConfidence: "media",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "10 de abril de 2024; los hechos posteriores informados por fuentes locales ocurrieron durante los d\u00edas siguientes.",
    sourceDispute: "La entrada importada solo indicaba batalla de Kumbo sin fecha, participantes ni guerra. The Guardian Post recoge la versi\u00f3n de autoridades de Bui sobre cuatro presuntos separatistas muertos en una operaci\u00f3n posterior; Cameroon News Agency inform\u00f3 denuncias de tres civiles y un separatista muertos y cit\u00f3 una afirmaci\u00f3n separatista sobre bajas del BIR. Las fuentes no concilian el inicio exacto, la secuencia de las operaciones, las bajas ni el resultado t\u00e1ctico. La ficha conserva esas diferencias y no trata las denuncias ni las afirmaciones de los bandos como hechos cerrados.",
    curationPriority: "alta",
    curationBatch: "source-backed-kumbo-2024-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La etiqueta Operaciones en Bui de 2024 es una categor\u00eda organizativa de GeoRisk para ubicar el episodio local y no el nombre oficial de una campa\u00f1a. La batalla de Kumbo del 10 de abril queda separada de la Operaci\u00f3n Bui Clean de 2021 y de otros incidentes de Kumbo. El conflicto padre sigue activo, pero esta acci\u00f3n concreta se clasifica como hist\u00f3rica y cerrada en el tiempo."
  };
}

export const KUMBO_2024_CONFLICT_RENAMES = {
  "batalla de Kumbo": CANONICAL,
  "Batalla de Kumbo": CANONICAL,
  "Battle of Kumbo": CANONICAL
};

export const KUMBO_2024_COUNTRY_CONFLICT_ADDITIONS = {
  "Camer\u00fan": [CANONICAL]
};

export const KUMBO_2024_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: kumbo2024Fix()
};
