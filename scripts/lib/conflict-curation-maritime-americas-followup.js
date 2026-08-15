function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  capeHenryFoundersOnline: source(
    "Founders Online: correspondencia de George Washington sobre la accion naval del cabo Henry de marzo de 1781",
    "https://founders.archives.gov/documents/Washington/03-31-02-0054"
  ),
  capeHenryFoundersOnlineAfterAction: source(
    "Founders Online: informe contemporaneo sobre el regreso de la escuadra francesa a Newport tras la accion del cabo Henry",
    "https://founders.archives.gov/documents/Washington/03-31-02-0100"
  ),
  toryIslandRoyalCollection: source(
    "Royal Collection Trust: mapa y registro de la batalla de Tory Island del 12 de octubre de 1798",
    "https://militarymaps.rct.uk/french-revolutionary-wars-1792-1802/tory-island-1798-tory-island-ulster-northern-ireland-55deg1552n-08deg1316w"
  ),
  toryIslandIrishCulturalCentre: source(
    "Centre Culturel Irlandais: la expedicion francesa de 1798 y la batalla que impidio los refuerzos a la rebelion irlandesa",
    "https://archives-en.centreculturelirlandais.com/digitized-collections/online-exhibitions/heritage/1798-the-year-of-the-french"
  ),
  capeOrtegalRoyalMuseumsGreenwich: source(
    "Royal Museums Greenwich: registro de la accion de Strachan durante las guerras napoleonicas de 1805",
    "https://www.rmg.co.uk/collections/object?events%5B0%5D=Napoleonic+Wars%3A+Strachan%27s+Action%2C+1805"
  ),
  capeOrtegalLondonGazette: source(
    "The Gazette: publicacion oficial britanica sobre la accion de Sir Richard Strachan de noviembre de 1805",
    "https://www.thegazette.co.uk/London/issue/20741/page/2051/data.pdf"
  ),
  aguaPrietaStateDepartment: source(
    "Departamento de Estado de Estados Unidos: comunicaciones e investigacion sobre los incidentes fronterizos de Agua Prieta de abril de 1911",
    "https://history.state.gov/historicaldocuments/frus1911/d788"
  ),
  aguaPrietaCochiseHistoricalSociety: source(
    "Cochise County Historical Society: relato local de la operacion de Arturo Red Lopez y el combate inicial de Agua Prieta",
    "https://www.cochisecountyhistoricalsociety.org/journals/cchs-vol-04-no-04-december-1974.pdf"
  )
};

function historicalFix({
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
  conflictType = "interestatal",
  scale = "regional",
  treaties = [],
  related = [],
  curationNote,
  sourceDispute = false
}) {
  const sources = Array.isArray(hierarchySources) ? hierarchySources : [hierarchySources];
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
    chronology,
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: "alta",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-maritime-americas-followup-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const MARITIME_AMERICAS_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla del cabo Henry": "Batalla del cabo Henry (1781)",
  "Batalla de Tory Island": "Batalla de Tory Island (1798)",
  "Batalla del Cabo Ortegal": "Batalla del cabo Ortegal (1805)",
  "Primera batalla de Agua Prieta": "Primera batalla de Agua Prieta (1911)"
};

export const MARITIME_AMERICAS_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [
    "Batalla del cabo Henry (1781)",
    "Batalla de Tory Island (1798)",
    "Batalla del cabo Ortegal (1805)"
  ],
  "Estados Unidos": ["Batalla del cabo Henry (1781)"],
  Irlanda: ["Batalla de Tory Island (1798)"],
  "Espa\u00f1a": ["Batalla del cabo Ortegal (1805)"],
  "M\u00e9xico": ["Primera batalla de Agua Prieta (1911)"]
};

export const MARITIME_AMERICAS_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla del cabo Henry (1781)": historicalFix({
    parent: "Guerra de Independencia de los Estados Unidos (1775-1783)",
    campaign: "Expedici\u00f3n francesa de Destouches al cabo Henry (1781)",
    region: "Frente al cabo Henry y la entrada de la bah\u00eda de Chesapeake, costa de Virginia; actual Estados Unidos",
    hierarchySources: [SOURCES.capeHenryFoundersOnline, SOURCES.capeHenryFoundersOnlineAfterAction],
    startYear: 1781,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "internacional",
    participants: [
      {
        side: "Escuadra francesa de Charles-Rene Destouches",
        members: ["Reino de Francia"]
      },
      {
        side: "Escuadra britanica de Mariot Arbuthnot",
        members: ["Reino de Gran Bretana"]
      }
    ],
    cause: "La escuadra francesa salio de Newport para apoyar las operaciones aliadas contra las fuerzas britanicas en Virginia durante la Guerra de Independencia de los Estados Unidos.",
    outcome: "El 16 de marzo, la accion naval impidio que la escuadra francesa alcanzara su objetivo operacional inmediato y esta regreso a Newport; las fuentes consultadas no justifican fijar una valoracion tactica unica ni una cifra cerrada de bajas.",
    consequences: "La fuerza britanica mantuvo capacidad de operar en la bahia de Chesapeake y los planes aliados en Virginia tuvieron que ajustarse dentro de una guerra que continuo hasta 1783.",
    chronology: [
      { year: 1781, event: "La escuadra de Destouches navego desde Newport hacia la bahia de Chesapeake para apoyar operaciones contra la presencia britanica en Virginia." },
      { year: 1781, event: "El 16 de marzo, las flotas combatieron frente al cabo Henry y la escuadra francesa regreso posteriormente a Newport." }
    ],
    treaties: ["Tratado de Paris (1783)"],
    curationNote: "Estados Unidos se vincula como referencia geografica y de contexto de la guerra, no como participante directo de esta accion naval. La evidencia consultada permite fechar, jerarquizar y describir el objetivo frustrado, pero conserva cautela sobre la valoracion tactica y las bajas.",
    sourceDispute: true
  }),
  "Batalla de Tory Island (1798)": historicalFix({
    parent: "Guerras revolucionarias francesas (1792-1802)",
    campaign: "Expedici\u00f3n francesa de Bompart hacia Irlanda (1798)",
    region: "Frente a Tory Island, costa de Donegal; entonces Reino de Irlanda, actual Irlanda",
    hierarchySources: [SOURCES.toryIslandRoyalCollection, SOURCES.toryIslandIrishCulturalCentre],
    startYear: 1798,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "internacional",
    participants: [
      {
        side: "Escuadra britanica de John Borlase Warren",
        members: ["Marina Real Britanica"]
      },
      {
        side: "Escuadra francesa de Jean-Baptiste-Francois Bompart",
        members: ["Marina de la Republica Francesa"]
      }
    ],
    cause: "Una fuerza francesa zarpo de Brest para intentar reforzar la rebelion irlandesa de 1798, por lo que la Marina Real Britanica organizo su intercepcion.",
    outcome: "El 12 de octubre, la fuerza de Warren derroto a la escuadra de Bompart e impidio el desembarco de los refuerzos franceses previstos.",
    consequences: "La accion cerro el ultimo intento naval frances de reforzar la rebelion de 1798; la captura de buques y personas se mantiene separada de cualquier supuesto acuerdo politico de cierre.",
    chronology: [
      { year: 1798, event: "A fines de septiembre, la expedicion francesa de Bompart salio de Brest con destino a la costa de Irlanda." },
      { year: 1798, event: "El 12 de octubre, la escuadra britanica intercepto y derroto a la fuerza francesa frente a Tory Island." }
    ],
    treaties: [],
    curationNote: "Tory Island tambien aparece con variantes de nombre en las fuentes. Irlanda se vincula como lugar actual y contexto de la expedicion, pero no se presenta a la Republica de Irlanda actual como beligerante; los actores navales de epoca fueron la Republica Francesa y Gran Bretana.",
    sourceDispute: true
  }),
  "Batalla del cabo Ortegal (1805)": historicalFix({
    parent: "Guerra de la Tercera Coalici\u00f3n (1805)",
    campaign: "Campa\u00f1a de Trafalgar (1805)",
    region: "Frente al cabo Ortegal, golfo de Vizcaya, costa de Galicia; actual Espa\u00f1a",
    hierarchySources: [SOURCES.capeOrtegalRoyalMuseumsGreenwich, SOURCES.capeOrtegalLondonGazette],
    startYear: 1805,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "internacional",
    participants: [
      {
        side: "Escuadra britanica de Richard Strachan",
        members: ["Marina Real Britanica"]
      },
      {
        side: "Escuadra francesa de Pierre Dumanoir le Pelley",
        members: ["Marina Imperial Francesa"]
      }
    ],
    cause: "Los buques franceses de Dumanoir que quedaron fuera de Trafalgar intentaron volver al Atlantico y fueron perseguidos por la fuerza britanica de Strachan desde el entorno de Ferrol.",
    outcome: "El 4 de noviembre, la escuadra de Strachan obligo a rendirse a cuatro buques franceses frente al cabo Ortegal.",
    consequences: "La captura de la escuadra de Dumanoir cerro la secuencia naval de 1805 asociada a Trafalgar, sin atribuir a esta sola accion el desenlace completo de la guerra continental.",
    chronology: [
      { year: 1805, event: "Tras Trafalgar, los buques de Dumanoir navegaron por el Atlantico nororiental mientras una fuerza britanica los perseguia." },
      { year: 1805, event: "El 4 de noviembre, la escuadra de Richard Strachan capturo a los cuatro buques franceses frente al cabo Ortegal." }
    ],
    treaties: [],
    curationNote: "La accion tambien aparece como accion de Strachan. Espa\u00f1a se vincula solo por la geografia actual del cabo Ortegal; la ficha evita convertir a Espa\u00f1a, cuyo litoral sirvio de referencia, en beligerante y conserva a Francia y Gran Bretana como los actores navales de epoca.",
    sourceDispute: true
  }),
  "Primera batalla de Agua Prieta (1911)": historicalFix({
    parent: "Revoluci\u00f3n mexicana (1910-1920)",
    campaign: "Insurrecci\u00f3n maderista en Sonora (1911)",
    region: "Agua Prieta, Sonora, junto a Douglas, Arizona; actual frontera entre M\u00e9xico y Estados Unidos",
    hierarchySources: [SOURCES.aguaPrietaStateDepartment, SOURCES.aguaPrietaCochiseHistoricalSociety],
    startYear: 1911,
    type: "batalla fronteriza y combate urbano",
    conflictType: "civil",
    scale: "regional",
    participants: [
      {
        side: "Fuerzas maderistas",
        members: ["Fuerzas de Francisco I. Madero", "Columna de Arturo Red Lopez"]
      },
      {
        side: "Fuerzas federales mexicanas",
        members: ["Ejercito Federal Mexicano", "Gobierno de Porfirio Diaz"]
      }
    ],
    cause: "Las fuerzas maderistas atacaron la guarnicion federal de Agua Prieta durante la fase inicial de la Revolucion mexicana.",
    outcome: "Los incidentes y combates de los dias 13 y 17 de abril alcanzaron la frontera y motivaron una investigacion estadounidense; las fuentes consultadas no permiten cerrar esta ficha con un vencedor tactico unico para toda la secuencia.",
    consequences: "La proximidad de Douglas, Arizona, hizo visible el riesgo transfronterizo y produjo comunicaciones diplomatica y una investigacion sobre los disparos e incidentes en la frontera.",
    chronology: [
      { year: 1911, event: "El 13 de abril, los combates e incidentes en torno a Agua Prieta afectaron el entorno fronterizo frente a Douglas, Arizona." },
      { year: 1911, event: "El 17 de abril, nuevos incidentes vinculados a la secuencia de Agua Prieta impulsaron comunicaciones e investigacion estadounidense." }
    ],
    treaties: [],
    curationNote: "Mexico y Estados Unidos se conservan como referencias nacionales de la frontera, pero Estados Unidos se incluye por los efectos transfronterizos y la investigacion, no como un tercer bando nacional de la batalla. Se evita inventar un ganador total, bajas o un acuerdo de cierre no sostenido por las fuentes consultadas.",
    sourceDispute: true
  })
};
