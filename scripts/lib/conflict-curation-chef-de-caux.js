function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  historicEngland: source(
    "Historic England: el Holigost combatió frente a Chef-de-Caux en 1417 durante la Guerra de los Cien Años",
    "https://historicengland.org.uk/whats-new/news/historic-wreck-identified/"
  ),
  frenchCulture: source(
    "Ministerio de Cultura de Francia: combate naval inglés frente a Chef-de-Caux en 1417 y contexto de la invasión de Normandía",
    "https://www.culture.gouv.fr/content/download/327352/pdf_file/Bilan%20Scientifique%20R%C3%A9gional%20Haute-Normandie%202012%20couleur%20WEB.pdf?inLanguage=fre-FR&version=15"
  ),
  ukGovernment: source(
    "Gobierno del Reino Unido: el Holigost participó en la acción de Chef-de-Caux o bahía del Sena en 1417",
    "https://www.legislation.gov.uk/uksi/2016/685/pdfs/uksiem_20160685_en.pdf"
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
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1417,
    endYear: 1417,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [...new Set([parent, campaign, "Enrique V de Inglaterra", "Holigost", "Harfleur"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-chef-de-caux-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    curationNote: "Reino Unido se agrega como referencia contemporánea de la flota inglesa; los participantes conservan el Reino de Inglaterra de 1417. Las fuentes institucionales coinciden en la acción naval, el lugar y el año, pero no en el día exacto ni en los detalles de capturas y bajas; la ficha muestra el año y evita consolidar esas cifras."
  };
}

export const CHEF_DE_CAUX_CONFLICT_RENAMES = {
  "Batalla de Chef-de-Caux": "Batalla naval de Chef-de-Caux (1417)",
  "Batalla de Chef de Caux": "Batalla naval de Chef-de-Caux (1417)"
};

export const CHEF_DE_CAUX_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": ["Batalla naval de Chef-de-Caux (1417)"]
};

export const CHEF_DE_CAUX_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Chef-de-Caux (1417)": historicalFix({
    parent: "Guerra de los Cien Años (1337-1453)",
    campaign: "Conquista inglesa de Normandía de 1417-1419",
    region: "Frente a Chef-de-Caux, desembocadura del Sena, Normandía, Francia",
    hierarchySources: [SOURCES.historicEngland, SOURCES.frenchCulture, SOURCES.ukGovernment],
    participants: [
      {
        side: "Flota real inglesa",
        members: ["Reino de Inglaterra", "Buques de Enrique V de Inglaterra", "Holigost"]
      },
      {
        side: "Flota francesa y aliada",
        members: ["Reino de Francia", "Buques aliados de la flota francesa"]
      }
    ],
    cause: "Durante la Guerra de los Cien Años, Inglaterra buscaba asegurar las rutas del canal y la desembocadura del Sena para sostener la campaña de Enrique V en Normandía. La acción enfrentó a una flota inglesa con una fuerza francesa y aliada frente a Chef-de-Caux.",
    outcome: "La flota inglesa obtuvo una victoria naval que debilitó de forma decisiva la capacidad marítima francesa en esa zona. Las fuentes consultadas no permiten consolidar una lista única de capturas, bajas ni una fecha diaria inequívoca, por lo que la ficha se limita al año 1417.",
    consequences: "El control inglés de las rutas marítimas facilitó la segunda invasión de Enrique V a Normandía poco después de la acción. El combate se integra en la conquista inglesa de Normandía, que continuó hasta la caída de Ruan en 1419.",
    chronology: [
      { year: 1415, event: "Las fuerzas de Enrique V tomaron Harfleur, estableciendo una cabeza de puente inglesa junto al estuario del Sena." },
      { year: 1417, event: "Una flota inglesa combatió frente a Chef-de-Caux contra una fuerza francesa y aliada; el Holigost figura entre los buques ingleses asociados a la acción." },
      { year: 1417, event: "Tras asegurar la ruta marítima, Enrique V reanudó la invasión de Normandía y extendió la conquista inglesa en la región." }
    ]
  })
};
