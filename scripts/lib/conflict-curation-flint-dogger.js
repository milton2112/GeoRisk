function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  flintArmy: source(
    "U.S. Army Infantry Magazine: estudio historico de la batalla de Flint Creek de enero de 1789",
    "https://www.benning.army.mil/infantry/magazine/issues/2013/May-June/Waage.html"
  ),
  flintArchive: source(
    "Digital Library of Georgia: informe de John Sevier sobre Flint Creek publicado en el Augusta Chronicle de 1789",
    "https://gahistoricnewspapers.galileo.usg.edu/lccn/sn82015220/1789-05-02/ed-1/seq-3"
  ),
  doggerArmy: source(
    "U.S. Army University Press: estudio de las operaciones navales de 1781 y la batalla de Dogger Bank",
    "https://www.armyupress.army.mil/Portals/7/combat-studies-institute/csi-books/neutral-rights-and-the-war-in-narrow-seas-1778-82.pdf"
  ),
  doggerNavy: source(
    "U.S. Naval History and Heritage Command: catalogo historico de la batalla de Dogger Bank del 5 de agosto de 1781",
    "https://www.history.navy.mil/content/history/nhhc/our-collections/photography/numerical-list-of-images/nhhc-series/nh-series/NH-79000/NH-79536.html"
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
    curationBatch: "source-backed-flint-dogger-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const FLINT_DOGGER_CONFLICT_RENAMES = {
  "Batalla de Flint Creek": "Batalla de Flint Creek (1789)",
  "Batalla de Dogger Bank": "Batalla de Dogger Bank (1781)"
};

export const FLINT_DOGGER_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": ["Batalla de Dogger Bank (1781)"],
  "Reino de los Pa\u00edses Bajos": ["Batalla de Dogger Bank (1781)"]
};

export const FLINT_DOGGER_COUNTRY_CONFLICT_EXCLUSIONS = {
  Dinamarca: ["Batalla de Dogger Bank", "Batalla de Dogger Bank (1781)"]
};

export const FLINT_DOGGER_CONFLICT_DETAIL_FIXES = {
  "Batalla de Flint Creek (1789)": historicalFix({
    parent: "Guerras cheroqui-estadounidenses (1776-1794)",
    campaign: "Operaciones de Flint Creek de enero de 1789",
    region: "Flint Creek, cerca del actual Flag Pond, Tennessee, Estados Unidos",
    hierarchySources: [SOURCES.flintArmy, SOURCES.flintArchive],
    startYear: 1789,
    type: "incursion fronteriza",
    conflictType: "frontera",
    scale: "local",
    participants: [
      {
        side: "Milicia del Estado de Franklin",
        members: ["Fuerza de John Sevier", "Milicia y exploradores del Estado de Franklin"]
      },
      {
        side: "Guerreros cheroquis chickamauga y aliados creek",
        members: ["Fuerza de John Watts", "Guerreros cheroquis chickamauga", "Aliados creek"]
      }
    ],
    cause: "La escalada de ataques, represalias y presion territorial en la frontera sur de los Apalaches llevo a la milicia del Estado de Franklin a atacar una base de invierno asociada a la fuerza de John Watts cerca de Flint Creek.",
    outcome: "La fuerza de Sevier disperso el campamento de Flint Creek el 10 de enero. La accion fue una victoria tactica de la milicia de Franklin, pero no resolvio por si sola los conflictos fronterizos ni la resistencia cheroqui.",
    consequences: "El enfrentamiento freno temporalmente la capacidad operativa de la fuerza de John Watts durante el invierno y se integro en una secuencia mas amplia de violencia, negociacion y despojo territorial en la frontera sur.",
    chronology: [
      { year: 1788, event: "Las hostilidades de frontera y las represalias entre asentamientos y grupos cheroquis intensificaron la presion sobre el sur de los Apalaches." },
      { year: 1789, event: "El 10 de enero, la fuerza de John Sevier ataco el campamento de Flint Creek tras una marcha invernal." },
      { year: 1789, event: "El 12 de enero, Sevier redacto un informe sobre el combate que se publico meses despues en el Augusta Chronicle." }
    ],
    treaties: [],
    related: ["Estado de Franklin", "Conflictos fronterizos del sur de los Apalaches"],
    curationNote: "El enfrentamiento se presenta como guerra de frontera y no como una accion regular entre Estados contemporaneos. Estados Unidos se conserva solo como enlace geografico de navegacion; los bandos nombran las fuerzas politicas y comunidades de 1789. Las cifras de bajas dependen en gran medida del informe de Sevier y no se consolidan como dato cerrado.",
    sourceDispute: true
  }),
  "Batalla de Dogger Bank (1781)": historicalFix({
    parent: "Cuarta guerra anglo-neerlandesa (1780-1784)",
    campaign: "Operaciones navales del mar del Norte de 1781",
    region: "Banco Dogger, mar del Norte",
    hierarchySources: [SOURCES.doggerArmy, SOURCES.doggerNavy],
    startYear: 1781,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "internacional",
    participants: [
      {
        side: "Escuadron britanico",
        members: ["Royal Navy", "Escuadron de Sir Hyde Parker", "Convoy britanico del Baltico"]
      },
      {
        side: "Escuadron neerlandes",
        members: ["Marina de la Republica Neerlandesa", "Escuadron de Johan Arnold Zoutman", "Convoy neerlandes"]
      }
    ],
    cause: "Durante la Cuarta guerra anglo-neerlandesa, ambos bandos escoltaban convoyes en el mar del Norte. La escuadra britanica de Hyde Parker intercepto a la fuerza neerlandesa de Johan Arnold Zoutman frente al banco Dogger.",
    outcome: "El 5 de agosto, ambas escuadras combatieron a corta distancia y quedaron muy danadas. No hubo capturas de buques: el convoy britanico continuo hacia Reino Unido y el neerlandes regreso a Texel. La valoracion tactica es discutida, aunque la retirada neerlandesa dio una ventaja operacional a Gran Breta\u00f1a.",
    consequences: "El combate limito las salidas posteriores de la flota neerlandesa desde Texel y confirmo el peso de la escolta de convoyes y el bloqueo en la guerra naval del mar del Norte.",
    chronology: [
      { year: 1780, event: "La Cuarta guerra anglo-neerlandesa abrio un nuevo frente naval ligado a las rivalidades comerciales y a la guerra de independencia estadounidense." },
      { year: 1781, event: "El 5 de agosto, las escuadras de Hyde Parker y Johan Arnold Zoutman se enfrentaron mientras escoltaban convoyes frente al banco Dogger." },
      { year: 1781, event: "Tras varias horas de combate, los dos convoyes se separaron: el britanico siguio su ruta y el neerlandes retorno a Texel con su escolta danada." }
    ],
    treaties: [],
    related: ["Guerra de Independencia de Estados Unidos"],
    curationNote: "Dinamarca no fue beligerante en esta accion y se elimina su enlace previo. Reino Unido y Reino de los Paises Bajos se usan para navegacion contemporanea; los participantes corresponden a la Royal Navy y la Republica Neerlandesa de 1781. Las fuentes difieren al calificar la victoria tactica, por lo que la ficha separa el resultado tactico de la ventaja operacional.",
    sourceDispute: true
  })
};
