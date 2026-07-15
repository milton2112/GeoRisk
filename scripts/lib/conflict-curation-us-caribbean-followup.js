function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  marineChronology: source(
    "División de Historia del Cuerpo de Marines: cronología de operaciones de 1775 a 1934",
    "https://www.usmcu.edu/Portals/218/Chronology%201775-1934%20%5Bcomplete%5D_1.pdf"
  ),
  masaya: source(
    "Cuerpo de Marines de EE. UU.: batalla de Masaya del 19 de septiembre de 1912",
    "https://www.marines.mil/News/Audio-Marine-Minute/?audioid=49482&dvpTag=Aviation&dvpmoduleid=514&dvpyear=2017"
  ),
  laPazCentro: source(
    "Cuerpo de Marines de EE. UU.: batalla de La Paz Centro del 16 de mayo de 1927",
    "https://www.marines.mil/News/Audio-Marine-Minute/audioid/52081/dvpTag/Battle/dvpmoduleid/514/"
  ),
  laPazCentroReport: source(
    "Informe de combate de C. J. Chappell sobre La Paz Centro, transcripción del documento de 1927",
    "https://www.sandinorebellion.com/PCDocs/1927/PC270519-Chappell.html",
    "media"
  ),
  ocotal: source(
    "División de Historia del Cuerpo de Marines: aviación en la batalla de Ocotal",
    "https://www.marines.mil/portals/1/Publications/Marine%20Corps%20Aviation%20The%20Early%20Years%201912-1940%20PCN%2019000316800_2.pdf"
  ),
  telpanecaMap: source(
    "División de Historia del Cuerpo de Marines: mapas del ataque a Telpaneca de 1927",
    "https://www.usmcu.edu/Research/Marine-Corps-History-Division/Digital-Archives/Digitized-Map-Collections/"
  ),
  telpanecaDispatch: source(
    "Departamento de Estado de EE. UU.: despacho sobre el ataque a Telpaneca",
    "https://history.state.gov/historicaldocuments/frus1927v03/d467"
  ),
  sapotillal: source(
    "División de Historia del Cuerpo de Marines: acciones de Ocotal, Telpaneca y Zapotillal en 1927",
    "https://www.usmcu.edu/Portals/218/Fortitudine%20Vol%2018%20No%202.pdf"
  ),
  lasCruces: source(
    "Informe de combate de Las Cruces de 1928, transcripción del documento de la Segunda Brigada",
    "https://www.sandinorebellion.com/PCDocs/1928a/PC280104b-Brown.html",
    "media"
  ),
  nicaraguaValor: source(
    "Departamento de Defensa de EE. UU.: condecorados de la Segunda Campaña de Nicaragua",
    "https://valor.defense.gov/Portals/24/Documents/ServiceCross/USMCNavyCross-SecondNicaraguanCampaign.pdf"
  ),
  elSauce: source(
    "División de Historia del Cuerpo de Marines: historia oral de Lewis Puller y William Lee sobre El Sauce",
    "https://www.usmcu.edu/Portals/218/LtGen%20Lewis%20B_%20%27Chesty%27%20Puller%20and%20Col%20William%20A_%20Lee.pdf"
  ),
  fortRiviere: source(
    "División de Historia del Cuerpo de Marines: captura de Fort Rivière",
    "https://www.usmcu.edu/Portals/218/A%20Brief%20History%20Of%20The%202d%20Marines.pdf"
  ),
  puertoPlata1800: source(
    "Naval History and Heritage Command: expedición de Puerto Plata de 1800",
    "https://www.history.navy.mil/research/library/online-reading-room/title-list-alphabetically/u/uss-constitutions-battle-record0/cutting-out-expedition-1800.html"
  ),
  puertoPlata1916: source(
    "División de Historia del Cuerpo de Marines: operaciones en República Dominicana de 1916 a 1924",
    "https://www.marines.mil/Portals/59/Publications/Marines%20in%20the%20Dominican%20Republic%20PCN%2019000412600_1.pdf"
  )
};

function actionFix({
  parent,
  campaign,
  region,
  hierarchySources,
  startYear,
  participants,
  cause,
  outcome,
  consequences,
  chronology,
  type = "batalla",
  conflictType = "intervención",
  scale = "regional",
  treaties = [],
  related = [],
  curationNote
}) {
  const sources = Array.isArray(hierarchySources) ? hierarchySources : [hierarchySources];
  const confidence = sources.some(item => item.confidence === "media") ? "media" : "alta";

  return {
    parent,
    war: parent,
    campaign,
    type,
    conflictType,
    scale,
    status: "historico",
    active: false,
    ongoing: false,
    startYear,
    endYear: startYear,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology: chronology || [{ year: startYear, event: outcome }],
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: confidence,
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-us-caribbean-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    ...(curationNote ? { curationNote } : {})
  };
}

export const US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Fort Riviere": "Batalla de Fort Rivière",
  "Batalla de Las Cruces": "Segunda batalla de Las Cruces (1928)",
  "Batalla de Puerto Plata": "Batalla de Puerto Plata (1916)",
  "Batalla del puerto de Puerto Plata": "Incursión naval de Puerto Plata (1800)"
};

export const US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  Nicaragua: [
    "Batalla de Masaya",
    "Batalla de La Paz Centro",
    "Batalla de Ocotal",
    "Batalla de Telpaneca",
    "Batalla de Sapotillal",
    "Segunda batalla de Las Cruces (1928)",
    "Batalla de El Sauce"
  ],
  "Haití": ["Batalla de Fort Rivière"],
  "República Dominicana": [
    "Incursión naval de Puerto Plata (1800)",
    "Batalla de Puerto Plata (1916)"
  ]
};

export const US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Masaya": actionFix({
    parent: "Intervención estadounidense en Nicaragua",
    campaign: "Campaña de Granada y Coyotepe de 1912",
    region: "Masaya, Nicaragua",
    hierarchySources: [SOURCES.marineChronology, SOURCES.masaya],
    startYear: 1912,
    participants: [
      { side: "Fuerza expedicionaria estadounidense", members: ["Estados Unidos", "Cuerpo de Marines de Estados Unidos"] },
      { side: "Fuerzas revolucionarias nicaragüenses", members: ["Rebeldes liberales nicaragüenses"] }
    ],
    cause: "Una columna estadounidense que avanzaba desde Corinto hacia Granada fue emboscada cerca de Masaya durante la guerra civil nicaragüense de 1912.",
    outcome: "La columna rechazó la emboscada y mantuvo abierto su avance hacia Granada.",
    consequences: "El combate precedió a las operaciones contra las posiciones de Barranca y Coyotepe y amplió la intervención militar estadounidense."
  }),
  "Batalla de La Paz Centro": actionFix({
    parent: "Intervención estadounidense en Nicaragua",
    campaign: "Pacificación posterior al Pacto del Espino Negro de 1927",
    region: "La Paz Centro, departamento de León, Nicaragua",
    hierarchySources: [SOURCES.laPazCentro, SOURCES.laPazCentroReport],
    startYear: 1927,
    participants: [
      { side: "Infantería de Marina de Estados Unidos", members: ["Estados Unidos"], casualties: "2 muertos por heridas y 2 heridos" },
      { side: "Liberales nicaragüenses no desmovilizados", members: ["Fuerzas liberales nicaragüenses"], casualties: "Al menos 14 muertos; heridos no consolidados" }
    ],
    cause: "Un destacamento de Marines investigó disparos en La Paz Centro pocos días después del acuerdo de desmovilización que cerró la fase principal de la guerra civil.",
    outcome: "Los atacantes se retiraron después de varias horas de combate y el destacamento estadounidense retuvo la localidad.",
    consequences: "La acción mostró que el pacto no había desarmado a todas las fuerzas liberales y anticipó la continuidad de la resistencia armada.",
    curationNote: "Las bajas se limitan a las cifras del informe de combate estadounidense; no se presentan como un balance independiente definitivo."
  }),
  "Batalla de Ocotal": actionFix({
    parent: "Guerra de Sandino",
    campaign: "Campaña de Nueva Segovia de 1927",
    region: "Ocotal, departamento de Nueva Segovia, Nicaragua",
    hierarchySources: [SOURCES.marineChronology, SOURCES.ocotal],
    startYear: 1927,
    conflictType: "insurgencia",
    participants: [
      { side: "Guarnición gubernamental", members: ["Estados Unidos", "Guardia Nacional de Nicaragua"] },
      { side: "Fuerzas sandinistas", members: ["Ejército Defensor de la Soberanía Nacional de Nicaragua"] }
    ],
    cause: "Las fuerzas de Augusto C. Sandino atacaron la guarnición de Ocotal para expulsar a los Marines y quebrar la presencia gubernamental en Nueva Segovia.",
    outcome: "La guarnición resistió los asaltos y el apoyo aéreo de los Marines dispersó a las fuerzas sandinistas.",
    consequences: "Fue la primera gran acción de la Guerra de Sandino y consolidó el empleo de aviación en apoyo directo de fuerzas terrestres."
  }),
  "Batalla de Telpaneca": actionFix({
    parent: "Guerra de Sandino",
    campaign: "Campaña de Nueva Segovia de 1927",
    region: "Telpaneca, departamento de Madriz, Nicaragua",
    hierarchySources: [SOURCES.telpanecaMap, SOURCES.telpanecaDispatch],
    startYear: 1927,
    conflictType: "insurgencia",
    participants: [
      { side: "Guarnición gubernamental", members: ["Estados Unidos", "Guardia Nacional de Nicaragua"], casualties: "2 Marines muertos y 1 guardia gravemente herido" },
      { side: "Fuerzas sandinistas", members: ["Ejército Defensor de la Soberanía Nacional de Nicaragua"], casualties: "25 muertos y unos 50 heridos según el informe estadounidense" }
    ],
    cause: "Una fuerza sandinista atacó de noche el puesto combinado de Marines y Guardia Nacional en Telpaneca.",
    outcome: "La guarnición sostuvo el puesto durante unas cuatro horas y rechazó el ataque.",
    consequences: "La defensa mantuvo el corredor gubernamental de Nueva Segovia, aunque confirmó la capacidad sandinista de concentrar fuerzas contra puestos aislados.",
    curationNote: "Las cifras sandinistas proceden de despachos e informes estadounidenses y deben leerse como estimaciones de una parte beligerante."
  }),
  "Batalla de Sapotillal": actionFix({
    parent: "Guerra de Sandino",
    campaign: "Campaña de Nueva Segovia de 1927",
    region: "Cerro Sapotillal, Nueva Segovia, Nicaragua",
    hierarchySources: [SOURCES.marineChronology, SOURCES.sapotillal],
    startYear: 1927,
    conflictType: "insurgencia",
    participants: [
      { side: "Patrulla de rescate", members: ["Estados Unidos", "Guardia Nacional de Nicaragua"] },
      { side: "Fuerzas sandinistas", members: ["Ejército Defensor de la Soberanía Nacional de Nicaragua"] }
    ],
    cause: "Una patrulla intentó rescatar a dos aviadores estadounidenses derribados y capturados en el cerro Sapotillal.",
    outcome: "La patrulla no recuperó a los aviadores y se abrió paso de regreso tras ser cercada por fuerzas sandinistas.",
    consequences: "El fracaso del rescate evidenció el control sandinista del terreno rural y la vulnerabilidad de las patrullas pequeñas.",
    curationNote: "Sapotillal también aparece como Zapotillal o Zapotillo; se conserva el nombre ya usado por el dataset y se evita fijar bajas discutidas."
  }),
  "Segunda batalla de Las Cruces (1928)": actionFix({
    parent: "Guerra de Sandino",
    campaign: "Expedición contra El Chipote de 1927-1928",
    region: "Cerro Las Cruces, cerca de Quilalí, Nicaragua",
    hierarchySources: [SOURCES.lasCruces, SOURCES.nicaraguaValor],
    startYear: 1928,
    conflictType: "insurgencia",
    participants: [
      { side: "Columna gubernamental", members: ["Estados Unidos", "Guardia Nacional de Nicaragua"] },
      { side: "Fuerzas sandinistas", members: ["Ejército Defensor de la Soberanía Nacional de Nicaragua"] }
    ],
    cause: "Una columna que avanzaba hacia Quilalí y El Chipote fue emboscada en posiciones preparadas sobre el cerro Las Cruces.",
    outcome: "La columna rompió la emboscada y ocupó las posiciones, aunque la expedición contra El Chipote no alcanzó su objetivo final.",
    consequences: "Las bajas y heridos obligaron a concentrar la fuerza en Quilalí y dieron lugar a una operación aérea de evacuación y reabastecimiento.",
    curationNote: "Se agrega el ordinal y el año para distinguir esta acción del combate de Las Cruces de octubre de 1927."
  }),
  "Batalla de El Sauce": actionFix({
    parent: "Guerra de Sandino",
    campaign: "Operaciones finales de 1932",
    region: "Punta de Rieles, cerca de El Sauce, Nicaragua",
    hierarchySources: [SOURCES.elSauce, SOURCES.nicaraguaValor],
    startYear: 1932,
    conflictType: "insurgencia",
    participants: [
      { side: "Columna gubernamental", members: ["Estados Unidos", "Guardia Nacional de Nicaragua"] },
      { side: "Fuerzas sandinistas", members: ["Ejército Defensor de la Soberanía Nacional de Nicaragua"] }
    ],
    cause: "Una columna enviada por ferrocarril para asegurar El Sauce fue emboscada cerca de Punta de Rieles por una fuerza sandinista.",
    outcome: "La columna rechazó la emboscada y continuó hacia El Sauce.",
    consequences: "Fue la última gran acción de la campaña antes de la retirada de los Marines en enero de 1933."
  }),
  "Batalla de Fort Rivière": actionFix({
    parent: "Ocupación estadounidense de Haití",
    campaign: "Primera Guerra de los Cacos de 1915",
    region: "Fort Rivière, Saint-Raphaël, Haití",
    hierarchySources: SOURCES.fortRiviere,
    startYear: 1915,
    conflictType: "insurgencia",
    participants: [
      { side: "Fuerza de asalto estadounidense", members: ["Estados Unidos", "Cuerpo de Marines de Estados Unidos", "Armada de Estados Unidos"], casualties: "Sin muertos ni heridos por armas de fuego" },
      { side: "Defensores cacos", members: ["Cacos haitianos"], casualties: "51 muertos según la historia oficial del regimiento" }
    ],
    cause: "Las fuerzas de ocupación atacaron la última gran posición fortificada de los cacos después de varias acciones en el norte de Haití.",
    outcome: "Los Marines y marineros tomaron el fuerte en un asalto breve y derrotaron a su guarnición.",
    consequences: "El fuerte fue demolido y la Primera Guerra de los Cacos quedó militarmente cerrada, aunque la resistencia a la ocupación reapareció en 1918.",
    curationNote: "La denominación cacos se conserva como nombre histórico del movimiento armado; la cifra de bajas procede de la historia oficial estadounidense."
  }),
  "Incursión naval de Puerto Plata (1800)": actionFix({
    parent: "Cuasi-Guerra",
    campaign: "Operaciones navales en el Caribe de 1800",
    region: "Puerto Plata, Capitanía General de Santo Domingo",
    hierarchySources: SOURCES.puertoPlata1800,
    startYear: 1800,
    type: "incursión naval",
    conflictType: "interestatal",
    scale: "internacional",
    participants: [
      { side: "Fuerza naval estadounidense", members: ["Estados Unidos", "USS Constitution"] },
      { side: "Objetivos en el puerto", members: ["Francia", "España", "Corbeta Sandwich", "Fortaleza San Felipe"] }
    ],
    cause: "La USS Constitution buscaba neutralizar a la corbeta corsaria francesa Sandwich, refugiada bajo los cañones del fuerte español de Puerto Plata.",
    outcome: "Una fuerza encubierta capturó la Sandwich y los Marines inutilizaron los cañones del fuerte sin bajas estadounidenses.",
    consequences: "La operación fue un éxito táctico, pero Estados Unidos devolvió la nave porque había sido capturada dentro de un puerto neutral.",
    related: ["USS Constitution", "Fortaleza San Felipe"]
  }),
  "Batalla de Puerto Plata (1916)": actionFix({
    parent: "Ocupación estadounidense de República Dominicana",
    campaign: "Campaña de Puerto Plata y Santiago de 1916",
    region: "Puerto Plata, República Dominicana",
    hierarchySources: SOURCES.puertoPlata1916,
    startYear: 1916,
    participants: [
      { side: "Fuerza de desembarco estadounidense", members: ["Estados Unidos", "Cuerpo de Marines de Estados Unidos", "Armada de Estados Unidos"] },
      { side: "Fuerzas dominicanas", members: ["Rebeldes dominicanos de Desiderio Arias"] }
    ],
    cause: "Una fuerza de Marines y marineros desembarcó para tomar Puerto Plata y abrir una ruta hacia Santiago durante la intervención de 1916.",
    outcome: "La fuerza estadounidense tomó la Fortaleza San Felipe y aseguró Puerto Plata tras combatir en el frente marítimo y las calles.",
    consequences: "El control del puerto permitió organizar la columna ferroviaria hacia Navarrete y enlazar con el avance principal sobre Santiago.",
    related: ["Fortaleza San Felipe"]
  })
};
