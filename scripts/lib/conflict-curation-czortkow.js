function source(label, url, confidence = "media") {
  return { label, url, confidence };
}

const SOURCES = {
  polishLexicon: source(
    "TwojaHistoria y el l\u00e9xico acad\u00e9mico Bitwy polskie: combate por Czortk\u00f3w del 6 al 9 de junio de 1919",
    "https://twojahistoria.pl/encyklopedia/leksykon-bitew/bitwa-pod-czortkowem-6-9-czerwca-1919/"
  ),
  ukrainianInstitute: source(
    "Instituto Ucraniano de la Memoria Nacional: inicio, alcance y l\u00edmites de la Ofensiva de Chortkiv de 1919",
    "https://uinp.gov.ua/istorychnyy-kalendar/cherven/7/1919-pochatok-chortkivskoyi-ofenzyvy"
  ),
  encyclopedia1914: source(
    "Encyclopedia 1914-1918 Online: contexto de la guerra polaco-ucraniana en Galicia Oriental y de la Ofensiva de Chortkiv",
    "https://encyclopedia.1914-1918-online.net/article/polish-ukrainian-conflict-over-eastern-galicia/"
  )
};

function czortkowFix() {
  const hierarchySources = [SOURCES.polishLexicon, SOURCES.ukrainianInstitute, SOURCES.encyclopedia1914];

  return {
    parent: "Guerra polaco-ucraniana (1918-1919)",
    war: "Guerra polaco-ucraniana (1918-1919)",
    campaign: "Ofensiva de Chortkiv (junio de 1919)",
    type: "combate por ciudad",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1919,
    endYear: 1919,
    region: "Czortk\u00f3w, actual Chortkiv, Galicia Oriental; actual \u00f3blast de Tern\u00f3pil, Ucrania",
    normalizedRegion: "Czortk\u00f3w, actual Chortkiv, Galicia Oriental; actual \u00f3blast de Tern\u00f3pil, Ucrania",
    cause: "En la guerra por el control de Galicia Oriental, la ofensiva polaca de primavera hab\u00eda empujado al Ej\u00e9rcito Galitziano Ucraniano al sureste. La reorganizaci\u00f3n ucraniana y la dispersi\u00f3n de las fuerzas polacas abrieron la contraofensiva de Chortkiv.",
    outcome: "Una agrupaci\u00f3n polaca ocup\u00f3 Czortk\u00f3w durante la noche del 6 al 7 de junio, pero el contraataque del Ej\u00e9rcito Galitziano Ucraniano recuper\u00f3 la ciudad al d\u00eda siguiente. El resultado fue un \u00e9xito t\u00e1ctico inicial de la ofensiva ucraniana, no la resoluci\u00f3n de la guerra.",
    consequences: "La recuperaci\u00f3n de Czortk\u00f3w impuls\u00f3 el avance inicial de la Ofensiva de Chortkiv. La falta de armas y municiones impidi\u00f3 consolidarlo; la contraofensiva polaca de fines de junio oblig\u00f3 despu\u00e9s al Ej\u00e9rcito Galitziano Ucraniano a retirarse hacia el Zbruch.",
    chronology: [
      { year: 1919, event: "Durante la ofensiva polaca de primavera, el frente ucraniano se repleg\u00f3 hacia el sureste de Galicia Oriental." },
      { year: 1919, event: "Entre la noche del 6 y el 7 de junio, una agrupaci\u00f3n polaca ocup\u00f3 Czortk\u00f3w." },
      { year: 1919, event: "El contraataque ucraniano recuper\u00f3 la ciudad y se convirti\u00f3 en uno de los primeros \u00e9xitos de la Ofensiva de Chortkiv." },
      { year: 1919, event: "La falta de municiones fren\u00f3 el avance; tras la ruptura del frente a fines de junio, el Ej\u00e9rcito Galitziano Ucraniano se retir\u00f3 hacia el Zbruch en julio." }
    ],
    treaties: [],
    related: ["Guerra polaco-ucraniana (1918-1919)", "Ofensiva de Chortkiv (junio de 1919)"],
    participants: [
      {
        side: "Fuerzas polacas de la Segunda Rep\u00fablica Polaca",
        members: ["Polonia", "Grupo del mayor J\u00f3zef Jaklicz"]
      },
      {
        side: "Ej\u00e9rcito Galitziano Ucraniano",
        members: ["Rep\u00fablica Popular de Ucrania Occidental", "Ej\u00e9rcito Galitziano Ucraniano"]
      }
    ],
    hierarchyConfidence: "media",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "del 6 al 9 de junio de 1919; la cronolog\u00eda de la ofensiva amplia suele comenzar el 7 de junio",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-czortkow-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Czortk\u00f3w es la forma polaca hist\u00f3rica del actual Chortkiv. La fuente polaca fecha el combate local entre el 6 y el 9 de junio y describe la ocupaci\u00f3n polaca seguida por la recuperaci\u00f3n ucraniana; las fuentes ucranianas sit\u00faan el inicio de la ofensiva m\u00e1s amplia el 7 de junio. La ficha diferencia esas escalas, no consolida bajas ni usa el resultado local para presentar el desenlace de la guerra como inmediato. El combate de 1919 tambi\u00e9n es distinto de los enfrentamientos cercanos a Czortkow durante la invasi\u00f3n sovi\u00e9tica de septiembre de 1939."
  };
}

export const CZORTKOW_CONFLICT_RENAMES = {
  "Batalla de Czortkowem": "Batalla de Czortk\u00f3w (1919)",
  "Batalla de Czortkow": "Batalla de Czortk\u00f3w (1919)",
  "Batalla de Czortk\u00f3w": "Batalla de Czortk\u00f3w (1919)",
  "Batalla de Chortkiv": "Batalla de Czortk\u00f3w (1919)",
  "Battle of Czortkowem": "Batalla de Czortk\u00f3w (1919)",
  "Battle of Czortkow": "Batalla de Czortk\u00f3w (1919)",
  "Battle of Chortkiv": "Batalla de Czortk\u00f3w (1919)",
  "Bitwa pod Czortkowem": "Batalla de Czortk\u00f3w (1919)"
};

export const CZORTKOW_COUNTRY_CONFLICT_ADDITIONS = {
  Ucrania: ["Batalla de Czortk\u00f3w (1919)"]
};

export const CZORTKOW_CONFLICT_DETAIL_FIXES = {
  "Batalla de Czortk\u00f3w (1919)": czortkowFix()
};
