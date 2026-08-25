function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  asinaraHistoricalReport: source(
    "Parco Nazionale dell'Asinara: informe histórico que documenta el combate naval de 1409 entre escuadras genovesa y siciliana",
    "https://www.parcoasinara.org/wp-content/uploads/2023/06/1151_r2arelazionestoricageneralea.pdf"
  ),
  treccaniCampaignContext: source(
    "Treccani, Dizionario Biografico degli Italiani: expedición de Martín el Joven a Cerdeña en 1408 para restablecer la soberanía aragonesa",
    "https://www.treccani.it/enciclopedia/leonardo-cubello_%28Dizionario-Biografico%29/",
    "media"
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
    type: "batalla naval",
    conflictType: "sucesion",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1409,
    endYear: 1409,
    region,
    normalizedRegion: "Europa",
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [...new Set([parent, campaign, "Juzgado de Arborea", "Martín el Joven", "Brancaleone Doria", "Guillermo III de Narbona"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-asinara-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: false,
    curationNote: "El informe histórico del Parco Nazionale dell'Asinara registra una escuadra genovesa de seis naves y una siciliana de diez, aliada de los aragoneses, pero no identifica mandos individuales, fecha más precisa que 1409, bajas ni la posición exacta del combate. La ficha conserva solamente los datos comprobables y no convierte el resultado naval en un cierre definitivo de la disputa sucesoria."
  };
}

export const ASINARA_CONFLICT_RENAMES = {
  "Batalla de Asinara": "Batalla naval de Asinara (1409)",
  "Battaglia dell'Asinara": "Batalla naval de Asinara (1409)",
  "Battle of Asinara": "Batalla naval de Asinara (1409)"
};

export const ASINARA_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Asinara (1409)": historicalFix({
    parent: "Expedición de Martín el Joven en Cerdeña (1408-1410)",
    campaign: "Operaciones navales del norte de Cerdeña (1409)",
    region: "Aguas de la isla de Asinara, norte de Cerdeña, actual Italia",
    hierarchySources: [SOURCES.asinaraHistoricalReport, SOURCES.treccaniCampaignContext],
    participants: [
      {
        side: "Escuadra siciliana aliada de la Corona de Aragón",
        members: ["Diez naves sicilianas", "Fuerza aliada de los aragoneses"]
      },
      {
        side: "Escuadra genovesa favorable a Brancaleone Doria",
        members: ["Seis naves genovesas", "Contingente que apoyaba a Brancaleone Doria"]
      }
    ],
    cause: "La acción se desarrolló dentro de la expedición de Martín el Joven para restablecer el control aragonés sobre Cerdeña. Según el informe histórico del parque, la escuadra genovesa apoyaba a Brancaleone Doria en la disputa por el Juzgado de Arborea frente a Guillermo III de Narbona.",
    outcome: "La escuadra siciliana aliada a los aragoneses derrotó a la genovesa. El informe histórico indica que muchos genoveses fueron llevados como prisioneros ante Martín el Joven, sin precisar una cifra ni mandos navales individuales.",
    consequences: "La victoria naval dio respaldo a la ofensiva aragonesa de 1409 en Cerdeña, pero no resolvió por sí sola la disputa sucesoria del Juzgado de Arborea. La secuencia política y militar continuó después de la acción.",
    chronology: [
      { year: 1408, event: "Martín el Joven se trasladó a Cerdeña para restablecer la soberanía aragonesa, por medios pacíficos o por la fuerza." },
      { year: 1409, event: "Una escuadra siciliana de diez naves, aliada de los aragoneses, enfrentó frente a Asinara a seis naves genovesas favorables a Brancaleone Doria." },
      { year: 1409, event: "La escuadra genovesa fue derrotada y parte de sus hombres fue llevada prisionera ante Martín el Joven." },
      { year: 1410, event: "La disputa por el Juzgado de Arborea siguió después de la campaña; las negociaciones de 1410 transformaron el marco político de la región." }
    ]
  })
};
