function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  armyCampaign: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: campana de la Expedicion Mexicana de 1916-1917",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Mexican-Expedition/"
  ),
  stateDepartment: source(
    "Office of the Historian del Departamento de Estado de EE. UU.: registro de Guerrero bajo el mando del coronel George A. Dodd",
    "https://history.state.gov/historicaldocuments/frus1916/d705fn8"
  ),
  inahContext: source(
    "Museo Nacional de las Intervenciones, INAH: contexto mexicano de la expedicion punitiva de 1916",
    "https://www.intervenciones.inah.gob.mx/index.php?a=permanente&c=presentacion"
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
  conflictType = "intervencion",
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
    curationBatch: "source-backed-guerrero-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const GUERRERO_CONFLICT_RENAMES = {
  "Batalla de Guerrero": "Batalla de Guerrero (1916)"
};

export const GUERRERO_COUNTRY_CONFLICT_ADDITIONS = {
  Mexico: ["Batalla de Guerrero (1916)"]
};

export const GUERRERO_CONFLICT_DETAIL_FIXES = {
  "Batalla de Guerrero (1916)": historicalFix({
    parent: "Expedicion punitiva estadounidense en Mexico (1916-1917)",
    campaign: "Operaciones de Chihuahua de 1916",
    region: "Guerrero o San Jeronimo, Chihuahua, Mexico",
    hierarchySources: [SOURCES.armyCampaign, SOURCES.stateDepartment, SOURCES.inahContext],
    startYear: 1916,
    type: "batalla de persecucion",
    conflictType: "intervencion",
    scale: "regional",
    participants: [
      {
        side: "Destacamento estadounidense de George A. Dodd",
        members: ["7.o de Caballeria de Estados Unidos", "Destacamento al mando del coronel George A. Dodd"]
      },
      {
        side: "Fuerzas villistas",
        members: ["Fuerzas de Francisco Villa", "Combatientes villistas"]
      }
    ],
    cause: "Durante la expedicion punitiva organizada despues del ataque de Villa a Columbus, una columna del 7.o de Caballeria persiguio a las fuerzas villistas hacia Guerrero, Chihuahua.",
    outcome: "El 29 de marzo de 1916, la columna de George A. Dodd sorprendio y persiguio a fuerzas villistas en Guerrero. Francisco Villa logro escapar; las fuentes no permiten fijar una victoria tactica unica ni una cifra de bajas consolidada.",
    consequences: "El episodio fue uno de los acercamientos mas directos de la expedicion a Villa, pero no cumplio el objetivo de capturarlo. La operacion siguio en Chihuahua y las tropas estadounidenses se retiraron de Mexico en 1917 sin lograr esa captura.",
    chronology: [
      { year: 1916, event: "El 9 de marzo, el ataque villista a Columbus llevo al gobierno estadounidense a organizar una expedicion punitiva hacia el norte de Mexico." },
      { year: 1916, event: "El 14 de marzo comenzo la Expedicion Mexicana bajo John J. Pershing; unidades de caballeria avanzaron hacia Chihuahua." },
      { year: 1916, event: "El 29 de marzo, el destacamento de George A. Dodd ataco y persiguio a fuerzas villistas cerca de Guerrero o San Jeronimo." },
      { year: 1917, event: "Las tropas estadounidenses se retiraron de Mexico sin capturar a Francisco Villa." }
    ],
    related: ["Francisco Villa", "John J. Pershing", "Ataque a Columbus de 1916"],
    curationNote: "Mexico se agrega como referencia geografica contemporanea, no como bando estatal: las fuerzas constitucionalistas mexicanas no son participantes de este combate. Los relatos difieren sobre bajas y resultado tactico, por lo que la ficha no fija cifras ni transforma la retirada de Villa en una victoria concluyente.",
    sourceDispute: true
  })
};
