function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  rasKamboniUn: source(
    "Naciones Unidas: informe S/2025/194 sobre Somalia y los choques de Raas Kaambooni",
    "https://digitallibrary.un.org/record/4080217/files/S_2025_194-EN.pdf"
  ),
  rasKamboniReuters: source(
    "Reuters vía Voice of America: combate entre fuerzas federales y de Jubalandia",
    "https://www.voanews.com/amp/officials-fighting-breaks-out-between-somalia-s-jubbaland-region-and-federal-government/7897185.html"
  ),
  tinzawatenePism: source(
    "Instituto Polaco de Asuntos Internacionales: derrota de fuerzas malienses y de Wagner en Tinzawatène",
    "https://www.pism.pl/webroot/upload/files/Komentarz/PISM%20Spotlight%20no%2054-2024.pdf"
  ),
  tinzawateneReuters: source(
    "Reuters: pérdidas de Wagner y del ejército maliense en los combates de Tinzawatène",
    "https://www.investing.com/news/world-news/russias-wagner-says-it-took-losses-in-heavy-fighting-against-rebels-in-mali-3540605"
  ),
  amharaCtp: source(
    "Critical Threats Project: ofensiva de Fano en Amhara desde julio de 2024",
    "https://www.criticalthreats.org/analysis/africa-file-september-26-2024-fano-offensive-in-ethiopias-amhara-egypt-arms-somalia-rebel-drones-in-mali-burkina-thwarts-another-coup"
  ),
  amharaUk: source(
    "Gobierno del Reino Unido: actores y evolución del conflicto armado de Amhara",
    "https://www.gov.uk/government/publications/ethiopia-country-policy-and-information-notes/country-policy-and-information-note-amhara-and-amhara-opposition-groups-ethiopia-june-2025-accessible"
  ),
  boulikessiUn: source(
    "Naciones Unidas: informe S/2025/495 sobre ataques coordinados contra bases malienses",
    "https://digitallibrary.un.org/record/4086447/files/S_2025_495-EN.pdf"
  ),
  boulikessiAp: source(
    "Associated Press: ataque de JNIM contra la base de Boulikessi",
    "https://apnews.com/article/mali-jnim-extremism-attack-timbuktu-boulkessi-military-244e251ba668e1f03633f5270b7f6f50"
  )
};

function recentActionFix({
  parent,
  campaign,
  region,
  hierarchySources,
  startYear,
  type = "batalla",
  conflictType,
  scale = "regional",
  participants,
  cause,
  outcome,
  consequences,
  chronology,
  related = []
}) {
  const sources = hierarchySources.filter(Boolean);
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
    treaties: [],
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-active-africa-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Las cifras de bajas disputadas se mantienen sin consolidar; la ficha prioriza jerarquía, actores y desenlace respaldados por fuentes independientes."
  };
}

export const ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Ofensiva de Amhara de 2024": "Ofensiva de Fano en Amhara de 2024"
};

export const ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Ras Kamboni (2024)": recentActionFix({
    parent: "Crisis de Jubalandia de 2024",
    campaign: "Disputa electoral entre Somalia y Jubalandia",
    region: "Ras Kamboni, Bajo Juba, Somalia",
    hierarchySources: [SOURCES.rasKamboniUn, SOURCES.rasKamboniReuters],
    startYear: 2024,
    conflictType: "civil",
    participants: [
      { side: "Gobierno federal", members: ["Ejército Nacional de Somalia"] },
      { side: "Jubalandia", members: ["Fuerzas de Seguridad de Jubalandia"] }
    ],
    cause: "El despliegue federal en Ras Kamboni agravó la disputa por la reelección del presidente de Jubalandia, que Mogadiscio no reconocía.",
    outcome: "Retirada de las fuerzas federales el 12 de diciembre, después de los enfrentamientos del día anterior; Jubalandia conservó el control local.",
    consequences: "La batalla abrió una fase armada de la crisis entre el Gobierno federal y Jubalandia y desvió fuerzas de la campaña contra Al-Shabaab.",
    chronology: [
      { year: 2024, event: "El 11 de diciembre, fuerzas federales y de Jubalandia combatieron en el área de Ras Kamboni." },
      { year: 2024, event: "El 12 de diciembre, el Ejército Nacional de Somalia retiró sus posiciones del sector." }
    ]
  }),
  "Batalla de Tinzawatène (2024)": recentActionFix({
    parent: "Guerra de Malí",
    campaign: "Campaña de Kidal y Tinzawatène de 2024",
    region: "Tinzawatène, región de Kidal, Malí",
    hierarchySources: [SOURCES.tinzawatenePism, SOURCES.tinzawateneReuters],
    startYear: 2024,
    conflictType: "independencia",
    participants: [
      { side: "Fuerzas gubernamentales", members: ["Fuerzas Armadas de Malí", "Grupo Wagner"] },
      { side: "Rebeldes de Azawad", members: ["CSP-DPA"] }
    ],
    cause: "Una columna maliense y de Wagner avanzó hacia el bastión rebelde de Tinzawatène después de operar en el extremo norte del país.",
    outcome: "Victoria del CSP-DPA; la columna gubernamental y rusa se retiró tras sufrir pérdidas significativas. JNIM también afirmó haber intervenido, algo disputado por el CSP-DPA.",
    consequences: "La derrota fue el mayor revés sufrido hasta entonces por Wagner en Malí y frenó temporalmente el avance gubernamental hacia la frontera argelina.",
    chronology: [
      { year: 2024, event: "Entre el 22 y el 27 de julio, la columna maliense y rusa combatió contra fuerzas del CSP-DPA cerca de Tinzawatène." },
      { year: 2024, event: "El 27 de julio, los supervivientes de la columna se retiraron después del colapso de sus posiciones." }
    ]
  }),
  "Ofensiva de Fano en Amhara de 2024": recentActionFix({
    parent: "Conflicto armado de Amhara",
    campaign: "Ofensiva de Fano de julio-septiembre de 2024",
    region: "Región de Amhara, Etiopía",
    hierarchySources: [SOURCES.amharaCtp, SOURCES.amharaUk],
    startYear: 2024,
    type: "ofensiva",
    conflictType: "civil",
    participants: [
      { side: "Fuerzas federales", members: ["Fuerza de Defensa Nacional de Etiopía", "Policía Federal de Etiopía"] },
      { side: "Insurgencia amhara", members: ["Milicias Fano"] }
    ],
    cause: "Las facciones Fano intensificaron su campaña para controlar carreteras y localidades, limitar el acceso federal al norte de Amhara y reforzar sus reivindicaciones políticas y territoriales.",
    outcome: "Avance temporal de Fano sin decisión estratégica; las milicias multiplicaron ataques y ocupaciones breves, mientras las fuerzas federales volvieron a entrar en muchas localidades.",
    consequences: "La ofensiva amplió el conflicto por toda Amhara, alcanzó sectores de Gondar y agravó la interrupción del transporte, los servicios y la protección de civiles.",
    chronology: [
      { year: 2024, event: "Desde julio, Fano casi triplicó su ritmo mensual previo de ataques contra fuerzas federales." },
      { year: 2024, event: "El 16 de septiembre, combatientes de Fano atacaron Gondar y controlaron brevemente parte del sur de la ciudad." }
    ]
  }),
  "Batalla de Boulikessi (2025)": recentActionFix({
    parent: "Guerra de Malí",
    campaign: "Ofensiva de JNIM de mayo-junio de 2025",
    region: "Boulikessi, región de Mopti, Malí",
    hierarchySources: [SOURCES.boulikessiUn, SOURCES.boulikessiAp],
    startYear: 2025,
    type: "ataque a base",
    conflictType: "insurgencia",
    participants: [
      { side: "Fuerzas gubernamentales", members: ["Fuerzas Armadas de Malí"] },
      { side: "Insurgencia yihadista", members: ["JNIM"] }
    ],
    cause: "JNIM lanzó una serie coordinada de ataques contra bases militares para erosionar la presencia estatal en el centro y norte de Malí.",
    outcome: "Victoria de JNIM; la base de Boulikessi fue sobrepasada y la guarnición maliense sufrió pérdidas graves, sin una cifra independiente consolidada.",
    consequences: "El ataque del 1 de junio formó parte de una secuencia contra Dioura, Soumpi, Boulikessi y Tombuctú que evidenció una mayor capacidad de coordinación de JNIM.",
    chronology: [
      { year: 2025, event: "El 1 de junio, combatientes de JNIM atacaron y sobrepasaron la base militar de Boulikessi." },
      { year: 2025, event: "El 2 de junio, JNIM continuó la ofensiva con ataques coordinados en Tombuctú." }
    ]
  })
};
