function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  londonGazetteCitation: source(
    "The London Gazette, suplemento 43959: cita de la Cruz Victoria de Rambahadur Limbu por la acción del 21 de noviembre de 1965 en Bau",
    "https://www.thegazette.co.uk/London/issue/43959/supplement/4947/data.pdf"
  ),
  australianVeteransAffairs: source(
    "Departamento de Asuntos de Veteranos de Australia: reproducción de la cita de la Cruz Victoria, con la fecha, el distrito de Bau y el rescate de dos heridos",
    "https://www.dva.gov.au/newsroom/vetaffairs/vetaffairs-vol-39-no2-august-2023/supporting-work-keith-payne-vc-am"
  ),
  gurkhaMuseumContext: source(
    "The Gurkha Museum: contexto de la Confrontación de Borneo, el 2.º Batallón de 10th Princess Mary's Own Gurkha Rifles y la posición indonesia atacada cerca de Bau",
    "https://thegurkhamuseum.co.uk/blog/rambahadur-limbu-vc/"
  )
};

function historicalFix({
  parent,
  campaign,
  region,
  hierarchySources,
  participants,
  cause,
  outcome,
  consequences,
  chronology
}) {
  const sources = hierarchySources.filter(Boolean);
  return {
    parent,
    war: parent,
    campaign,
    type: "combate de selva",
    conflictType: "interestatal",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1965,
    endYear: 1965,
    region,
    normalizedRegion: "Asia",
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [...new Set([parent, campaign, "Confrontación de Borneo", "Operación Claret", "Rambahadur Limbu", "10th Princess Mary's Own Gurkha Rifles"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-bau-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: false,
    curationNote: "La cita de la Cruz Victoria y las fuentes institucionales describen la acción desde la perspectiva británica-gurkha. Confirman la fecha, la unidad de Limbu, la posición indonesia y el rescate de dos heridos, pero no identifican la unidad indonesia, el balance total de bajas ni un resultado operacional duradero. La ficha no consolida esas cifras ni adjudica una victoria global. Indonesia se enlaza por la fuerza opuesta y Malasia por el frente de Sarawak y la confrontación, sin atribuir a esta última una unidad combatiente no documentada."
  };
}

export const BAU_CONFLICT_RENAMES = {
  "Batalla de Bau": "Batalla de Bau (1965)",
  "Battle of Bau": "Batalla de Bau (1965)",
  "Battle of Gunong Tepoi": "Batalla de Bau (1965)",
  "Batalla de Gunong Tepoi": "Batalla de Bau (1965)"
};

export const BAU_COUNTRY_CONFLICT_ADDITIONS = {
  Indonesia: ["Batalla de Bau (1965)"],
  Malasia: ["Batalla de Bau (1965)"]
};

export const BAU_CONFLICT_DETAIL_FIXES = {
  "Batalla de Bau (1965)": historicalFix({
    parent: "Confrontación Indonesia-Malasia",
    campaign: "Operaciones Claret en Borneo (1965)",
    region: "Área de Bau/Gunong Tepoi, frontera entre Sarawak y Kalimantan, isla de Borneo",
    hierarchySources: [SOURCES.londonGazetteCitation, SOURCES.australianVeteransAffairs, SOURCES.gurkhaMuseumContext],
    participants: [
      {
        side: "Fuerza británica de Gurkhas",
        members: ["Compañía del 2.º Batallón, 10th Princess Mary's Own Gurkha Rifles", "Lance corporal Rambahadur Limbu"]
      },
      {
        side: "Fuerza indonesia atrincherada",
        members: ["Soldados indonesios en una posición fortificada", "Combatientes de la posición del área de Bau"]
      }
    ],
    cause: "En la Confrontación Indonesia-Malasia, fuerzas británicas y de los Gurkhas realizaron operaciones limitadas en la frontera de Borneo contra posiciones indonesias. El 2.º Batallón de 10th Princess Mary's Own Gurkha Rifles recibió la orden de atacar una posición fortificada en el área de Bau.",
    outcome: "La compañía gurkha ganó un primer punto de apoyo en la posición durante el asalto. La cita oficial confirma que Limbu rescató bajo fuego a dos compañeros heridos y que abatió a cuatro combatientes indonesios que escapaban, pero las fuentes de esta ficha no ofrecen un parte completo de bajas ni un resultado operacional definitivo; por eso no adjudica una victoria global.",
    consequences: "La acción no puso fin a la Confrontación de Borneo, pero quedó asociada a la concesión de la Cruz Victoria a Rambahadur Limbu por el rescate de sus compañeros bajo fuego. El conflicto fronterizo continuó después de noviembre de 1965.",
    chronology: [
      { year: 1963, event: "Las tensiones entre Indonesia y el nuevo Estado malasio derivaron en enfrentamientos abiertos en Borneo." },
      { year: 1964, event: "Las operaciones Claret autorizaron incursiones británicas limitadas para presionar a fuerzas indonesias al otro lado de la frontera." },
      { year: 1965, event: "El 21 de noviembre, una compañía del 2.º Batallón de 10th Princess Mary's Own Gurkha Rifles atacó una posición indonesia en el área de Bau." },
      { year: 1966, event: "La Cruz Victoria reconoció la actuación de Rambahadur Limbu durante la acción de Bau." }
    ]
  })
};
