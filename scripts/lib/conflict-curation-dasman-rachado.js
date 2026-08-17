function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  dasmanKuna: source(
    "Kuwait News Agency: toma del palacio Dasman y muerte de Fahad Al-Ahmad durante la invasi\u00f3n iraqu\u00ed del 2 de agosto de 1990",
    "https://www.kuna.net.kw/ArticlePrintPage.aspx?id=3105082&language=en"
  ),
  dasmanKuwaitGovernment: source(
    "Gobierno de Kuwait: sintesis oficial de la invasi\u00f3n iraqu\u00ed y los combates de agosto de 1990",
    "https://e.gov.kw/sites/kgoArabic/Pages/Visitors/AboutKuwait/GoverningBodyOverView.aspx"
  ),
  rachadoJipa: source(
    "Journal of Indo-Pacific Archaeology, University of Washington: arqueologia de los buques portugueses y neerlandeses de la acci\u00f3n de Cabo Rachado de 1606",
    "https://journals.lib.washington.edu/index.php/JIPA/article/download/14909/12526"
  ),
  rachadoWiley: source(
    "International Journal of Nautical Archaeology: evidencia arqueol\u00f3gica sobre el Nassau perdido en Cabo Rachado en 1606",
    "https://onlinelibrary.wiley.com/doi/abs/10.1111/1095-9270.12118"
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
    curationBatch: "source-backed-dasman-rachado-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const DASMAN_RACHADO_CONFLICT_RENAMES = {
  "Batalla de Dasman Palace": "Batalla del palacio Dasman (1990)",
  "Batalla de Cabo Rachado": "Batalla de Cabo Rachado (1606)"
};

export const DASMAN_RACHADO_COUNTRY_CONFLICT_ADDITIONS = {
  Irak: ["Batalla del palacio Dasman (1990)"],
  Kuwait: ["Batalla del palacio Dasman (1990)"],
  "Reino de los Pa\u00edses Bajos": ["Batalla de Cabo Rachado (1606)"]
};

export const DASMAN_RACHADO_COUNTRY_CONFLICT_EXCLUSIONS = {
  "Estados Unidos": ["Batalla de Dasman Palace", "Batalla del palacio Dasman (1990)"]
};

export const DASMAN_RACHADO_CONFLICT_DETAIL_FIXES = {
  "Batalla del palacio Dasman (1990)": historicalFix({
    parent: "Invasi\u00f3n iraqu\u00ed de Kuwait (1990)",
    campaign: "Toma de Ciudad de Kuwait del 2 de agosto de 1990",
    region: "Palacio Dasman, Ciudad de Kuwait, Kuwait",
    hierarchySources: [SOURCES.dasmanKuna, SOURCES.dasmanKuwaitGovernment],
    startYear: 1990,
    type: "asalto a complejo gubernamental",
    conflictType: "interestatal",
    scale: "regional",
    participants: [
      {
        side: "Fuerzas iraqu\u00edes de invasi\u00f3n",
        members: ["Guardia Republicana Iraqu\u00ed", "Fuerzas especiales iraqu\u00edes"]
      },
      {
        side: "Defensa kuwaiti del palacio",
        members: ["Guardia Nacional de Kuwait", "Guardia del palacio", "Fuerzas armadas kuwaities"]
      }
    ],
    cause: "La invasi\u00f3n iraqu\u00ed de Kuwait del 2 de agosto de 1990 incluy\u00f3 el avance sobre Ciudad de Kuwait y la toma de instituciones estrat\u00e9gicas, entre ellas el palacio Dasman.",
    outcome: "Las fuerzas iraqu\u00edes tomaron el palacio Dasman durante la invasi\u00f3n inicial. El jeque Fahad Al-Ahmad fue asesinado mientras defend\u00eda el recinto; la acci\u00f3n no resolvi\u00f3 por si sola la crisis ni la ocupaci\u00f3n posterior.",
    consequences: "La toma del palacio simboliz\u00f3 la ca\u00edda inicial de la autoridad kuwait\u00ed en Ciudad de Kuwait y pas\u00f3 a formar parte de la ocupaci\u00f3n que desencaden\u00f3 la crisis y la guerra del Golfo de 1990-1991.",
    chronology: [
      { year: 1990, event: "El 2 de agosto, Irak inici\u00f3 la invasi\u00f3n de Kuwait y sus fuerzas avanzaron sobre Ciudad de Kuwait." },
      { year: 1990, event: "Durante la toma inicial de la ciudad, fuerzas iraqu\u00edes asaltaron el palacio Dasman y muri\u00f3 el jeque Fahad Al-Ahmad." },
      { year: 1990, event: "La ocupaci\u00f3n de Kuwait y la respuesta internacional convirtieron la crisis en el conflicto del Golfo de 1990-1991." }
    ],
    treaties: [],
    related: ["Guerra del Golfo"],
    curationNote: "Estados Unidos no particip\u00f3 en el asalto del 2 de agosto y se elimina su enlace previo. Irak y Kuwait se usan para navegaci\u00f3n contempor\u00e1nea; los participantes describen las fuerzas de 1990. Las fuentes abiertas consultadas no consolidan cifras de bajas ni una secuencia t\u00e1ctica completa, por lo que no se presentan como datos cerrados.",
    sourceDispute: true
  }),
  "Batalla de Cabo Rachado (1606)": historicalFix({
    parent: "Guerra luso-neerlandesa (1602-1663)",
    campaign: "Operaciones por Malaca y el estrecho de Malaca de 1606",
    region: "Frente a Cabo Rachado/Tanjung Tuan, estrecho de Malaca, Malaca portuguesa (actual Malasia)",
    hierarchySources: [SOURCES.rachadoJipa, SOURCES.rachadoWiley],
    startYear: 1606,
    type: "batalla naval",
    conflictType: "colonial",
    scale: "internacional",
    participants: [
      {
        side: "Fuerza portuguesa de Martim Afonso de Castro",
        members: ["Armada portuguesa de Martim Afonso de Castro", "Estado da \u00cdndia portuguesa"]
      },
      {
        side: "Fuerza neerlandesa de Cornelis Matelieff de Jonge",
        members: ["Flota de la Compa\u00f1\u00eda Neerlandesa de las Indias Orientales", "Escuadr\u00f3n de Cornelis Matelieff de Jonge"]
      }
    ],
    cause: "La acci\u00f3n se produjo durante la disputa luso-neerlandesa por Malaca, las rutas comerciales del estrecho y el intento neerland\u00e9s de presionar la plaza portuguesa.",
    outcome: "La fuerza portuguesa logr\u00f3 impedir la toma neerlandesa de Malaca en 1606 y la acci\u00f3n suele describirse como una ventaja t\u00e1ctica portuguesa. El enfrentamiento no resolvi\u00f3 la guerra ni puso fin a la presi\u00f3n neerlandesa sobre el estrecho.",
    consequences: "La batalla mantuvo a Malaca bajo control portugu\u00e9s en el corto plazo y prolong\u00f3 la competencia naval y comercial entre Portugal y la Compa\u00f1\u00eda Neerlandesa de las Indias Orientales en el sudeste asi\u00e1tico.",
    chronology: [
      { year: 1606, event: "La flota de Cornelis Matelieff de Jonge oper\u00f3 ante Malaca como parte de la presi\u00f3n neerlandesa sobre la plaza portuguesa." },
      { year: 1606, event: "Entre el 16 y el 18 de agosto, las flotas portuguesa y neerlandesa combatieron frente a Cabo Rachado en el estrecho de Malaca." },
      { year: 1606, event: "Malaca permaneci\u00f3 bajo control portugu\u00e9s, mientras la competencia luso-neerlandesa por la ruta y la plaza continu\u00f3." }
    ],
    treaties: [],
    related: ["Sitio de Malaca de 1606", "Sultanato de Johor"],
    curationNote: "Portugal y Reino de los Pa\u00edses Bajos se usan como enlaces contempor\u00e1neos, mientras los participantes reflejan la armada portuguesa y la VOC de 1606. La bibliograf\u00eda arqueol\u00f3gica confirma la acci\u00f3n y los buques implicados, pero no permite fijar sin reservas una contabilidad \u00fanica de bajas, barcos o una victoria decisiva.",
    sourceDispute: true
  })
};
