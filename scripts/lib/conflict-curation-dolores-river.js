function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  tamu: source(
    "Texas A&M University: estudio sobre las operaciones de pacificacion estadounidense y la destruccion de la compania de Stephen K. Hayt cerca de Dolores",
    "https://oaktrust.library.tamu.edu/server/api/core/bitstreams/00410a5c-0a3b-429e-8f49-1c76984c86c6/content"
  ),
  pulahanHistory: source(
    "Philippine EJournals: estudio historico sobre los origenes y causas del movimiento pulahan en Samar (1904-1911)",
    "https://ejournals.ph/article.php?id=5413"
  ),
  philippineEnvironment: source(
    "Gobierno de Filipinas, Region 8: identificacion del rio Dolores en Eastern Samar",
    "https://water.emb.gov.ph/?page_id=781",
    "media"
  )
};

function doloresRiverFix() {
  const parent = "Insurgencia pulahan en Samar (1904-1911)";
  const campaign = "Operaciones de la Constabularia Filipina en Samar oriental de 1904";
  const hierarchySources = [SOURCES.tamu, SOURCES.pulahanHistory, SOURCES.philippineEnvironment];

  return {
    parent,
    war: parent,
    campaign,
    type: "combate",
    conflictType: "insurgencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1904,
    endYear: 1904,
    region: "Rio Dolores, Samar oriental, Filipinas",
    normalizedRegion: "Rio Dolores, Samar oriental, Filipinas",
    cause: "El combate se produjo durante el ascenso del movimiento pulahan en Samar, en un contexto de control colonial estadounidense, desarticulacion economica posterior a la guerra filipino-estadounidense y agravios rurales. La Constabularia Filipina intento recuperar el control de los sectores interiores de Samar oriental.",
    outcome: "Una compania de exploradores de la Constabularia Filipina al mando de Stephen K. Hayt fue destruida cerca de Dolores por fuerzas pulahan. La ficha no consolida el dia exacto de diciembre, el numero total de combatientes, sobrevivientes, bajas pulahanes ni el balance de armas capturadas, porque las fuentes secundarias consultadas difieren.",
    consequences: "La derrota de la compania, junto con otros choques de fines de 1904, evidencio para las autoridades coloniales que la Constabularia no controlaba Samar. El estudio de Texas A&M documenta que el episodio impulso una respuesta reforzada y apoyo del Ejercito estadounidense, sin reducir la insurgencia a una simple accion de bandidaje.",
    chronology: [
      { year: 1904, event: "El movimiento pulahan gano fuerza en Samar en un contexto de posguerra, precariedad rural y control colonial estadounidense." },
      { year: 1904, event: "En diciembre, una compania de exploradores de la Constabularia Filipina bajo Stephen K. Hayt fue destruida cerca del rio Dolores." },
      { year: 1905, event: "La derrota contribuyo a que las autoridades coloniales reforzaran las operaciones y solicitaran apoyo militar en Samar." }
    ],
    treaties: [],
    related: [parent, campaign, "Pulahanes", "Samar oriental", "Constabularia Filipina", "Estados Unidos", "Filipinas"],
    participants: [
      {
        side: "Exploradores de la Constabularia Filipina bajo administracion estadounidense",
        members: ["Filipinas", "Constabularia Filipina", "Estados Unidos"],
        casualties: "La compania bajo Stephen K. Hayt fue destruida; total de efectivos y sobrevivientes no consolidado"
      },
      {
        side: "Fuerzas pulahanes de Samar",
        members: ["Pulahanes"],
        casualties: "No consolidado; no se adopta el balance numerico de cronicas posteriores sin corroboracion suficiente"
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "diciembre de 1904; las fuentes secundarias consultadas difieren sobre el dia exacto",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-dolores-river-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La accion ocurre en Samar, no en America continental. La bibliografia academica revisada confirma la destruccion de la compania de Hayt cerca de Dolores y el contexto de la insurgencia pulahan, pero no un dia unico de diciembre ni los balances difundidos por cronicas posteriores. La ficha vincula el hecho tanto con Filipinas como con Estados Unidos: la fuerza era filipina bajo administracion colonial estadounidense. Evita llamar a los pulahanes simplemente bandidos y no prolonga artificialmente la Guerra filipino-estadounidense formal, cerrada en 1902, como si fuera la misma fase sin matices."
  };
}

export const DOLORES_RIVER_CONFLICT_RENAMES = {
  "Batalla de Dolores River": "Combate del rio Dolores (1904)",
  "Batalla del rio Dolores": "Combate del rio Dolores (1904)",
  "Batalla de Dolores": "Combate del rio Dolores (1904)",
  "Battle of Dolores River": "Combate del rio Dolores (1904)",
  "Battle of the Dolores River": "Combate del rio Dolores (1904)"
};

export const DOLORES_RIVER_COUNTRY_CONFLICT_ADDITIONS = {
  "Filipinas": ["Combate del rio Dolores (1904)"]
};

export const DOLORES_RIVER_CONFLICT_DETAIL_FIXES = {
  "Combate del rio Dolores (1904)": doloresRiverFix()
};
