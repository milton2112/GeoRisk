function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  diuPortugueseNavy: source(
    "Armada Portuguesa: historia naval de la batalla de Diu de 1509",
    "https://www.marinha.pt/en/a-marinha/historia/servir-portugal/Pages/default.aspx"
  ),
  diuLibraryOfCongress: source(
    "Biblioteca del Congreso de EE. UU.: Diu y la derrota portuguesa de las fuerzas de Gujarat en 1509",
    "https://www.loc.gov/resource/gdcwdl.wdl_01056/"
  ),
  palikaoNationalArmyMuseum: source(
    "National Army Museum: segunda guerra de China y batalla de Palikao de 1860",
    "https://www.nam.ac.uk/explore/second-china-war"
  ),
  palikaoHistoryNet: source(
    "HistoryNet: cronolog\u00eda de la segunda guerra del Opio y avance aliado tras Palikao",
    "https://historynet.com/opium-wars/"
  ),
  tamsuiNewTaipei: source(
    "Distrito de Tamsui, Gobierno de la Ciudad de Nueva Taipei: defensa de Huwei/Tamsui en 1884",
    "https://www.tamsui.ntpc.gov.tw/home.jsp?id=bbb4ef4979e71500"
  ),
  tamsuiNationalMuseum: source(
    "Museo Nacional de Historia de Taiw\u00e1n: frente taiwan\u00e9s de la guerra franco-china",
    "https://taiwanoverseas.nmth.gov.tw/sino-french-war/"
  ),
  sanJacintoTexasHistoricalCommission: source(
    "Texas Historical Commission: la batalla de San Jacinto y el cierre militar de la Revoluci\u00f3n de Texas",
    "https://thc.texas.gov/learn/military-history/texas-revolution-and-republic"
  ),
  sanJacintoTexasStateLibrary: source(
    "Texas State Library: copia del informe oficial de Sam Houston sobre San Jacinto",
    "https://www.tsl.texas.gov/treasures/republic/san-jacinto/report-01.html"
  ),
  schooneveldRoyalMuseumsGreenwich: source(
    "Royal Museums Greenwich: registro de la segunda batalla de Schooneveld del 4 de junio de 1673",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-11798"
  ),
  schooneveldHistoryOfWar: source(
    "History of War: segunda batalla de Schooneveld y su cronolog\u00eda juliana/gregoriana",
    "https://www.historyofwar.org/articles/battles_schooneveld_2nd.html"
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
    curationBatch: "source-backed-global-historical-operations-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const GLOBAL_HISTORICAL_OPERATIONS_SAFE_CONFLICT_RENAMES = {
  "Batalla de Diu": "Batalla de Diu (1509)",
  "Batalla de Palikao": "Batalla de Palikao (1860)",
  "Batalla de Tamsui": "Batalla de Tamsui (1884)",
  "Batalla de San Jacinto": "Batalla de San Jacinto (1836)",
  "Segunda batalla de Schooneveld": "Segunda batalla de Schooneveld (1673)"
};

export const GLOBAL_HISTORICAL_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS = {
  India: ["Batalla de Diu (1509)"],
  Egipto: ["Batalla de Diu (1509)"],
  "Rep\u00fablica Popular China": [
    "Batalla de Palikao (1860)",
    "Batalla de Tamsui (1884)"
  ],
  "Reino Unido": [
    "Batalla de Palikao (1860)",
    "Segunda batalla de Schooneveld (1673)"
  ],
  M\u00e9xico: ["Batalla de San Jacinto (1836)"],
  "Reino de los Pa\u00edses Bajos": ["Segunda batalla de Schooneveld (1673)"]
};

export const GLOBAL_HISTORICAL_OPERATIONS_CONFLICT_DETAIL_FIXES = {
  "Batalla de Diu (1509)": historicalFix({
    parent: "Guerra naval luso-mameluca en el oc\u00e9ano \u00cdndico",
    campaign: "Operaciones navales de Diu (1508-1509)",
    region: "Puerto de Diu, golfo de Khambhat, actual India",
    hierarchySources: [SOURCES.diuPortugueseNavy, SOURCES.diuLibraryOfCongress],
    startYear: 1509,
    type: "batalla naval",
    conflictType: "colonial",
    scale: "internacional",
    participants: [
      { side: "Armada portuguesa", members: ["Reino de Portugal"] },
      {
        side: "Coalici\u00f3n mameluca y de Gujarat",
        members: ["Sultanato mameluco de Egipto", "Sultanato de Gujarat", "Zamorin de Calicut"]
      }
    ],
    cause: "Tras el combate de Chaul de 1508, Francisco de Almeida reuni\u00f3 una flota para enfrentar a la escuadra mameluca y a sus aliados, que se hab\u00edan concentrado en Diu.",
    outcome: "La armada portuguesa derrot\u00f3 a la flota mameluca y a sus aliados; la ficha no fija el d\u00eda exacto ni cifras de bajas que var\u00edan entre s\u00edntesis.",
    consequences: "La victoria consolid\u00f3 temporalmente el predominio naval portugu\u00e9s sobre rutas del oc\u00e9ano \u00cdndico y limit\u00f3 la capacidad ofensiva de la flota adversaria.",
    chronology: [
      { year: 1509, event: "A comienzos de 1509, la flota portuguesa se concentr\u00f3 para responder a la derrota sufrida en Chaul el a\u00f1o anterior." },
      { year: 1509, event: "La fuerza de Francisco de Almeida combati\u00f3 a la coalici\u00f3n adversaria en el puerto de Diu." }
    ],
    related: ["Batalla de Chaul (1508)"],
    curationNote: "Diu corresponde a una batalla naval de 1509, no a los sitios posteriores de 1538 y 1546. India y Egipto se agregan como accesos geogr\u00e1ficos e hist\u00f3ricos; los beligerantes se conservan como reinos y sultanatos de \u00e9poca.",
    sourceDispute: true
  }),
  "Batalla de Palikao (1860)": historicalFix({
    parent: "Segunda Guerra del Opio (1856-1860)",
    campaign: "Expedici\u00f3n anglo-francesa a Pek\u00edn (1860)",
    region: "Puente de Baliqiao o Palikao, al este de Pek\u00edn, actual Rep\u00fablica Popular China",
    hierarchySources: [SOURCES.palikaoNationalArmyMuseum, SOURCES.palikaoHistoryNet],
    startYear: 1860,
    conflictType: "colonial",
    scale: "internacional",
    participants: [
      { side: "Fuerzas anglo-francesas", members: ["Imperio brit\u00e1nico", "Segundo Imperio franc\u00e9s"] },
      { side: "Ej\u00e9rcito de la dinast\u00eda Qing", members: ["Imperio Qing"] }
    ],
    cause: "Las fuerzas anglo-francesas continuaron su avance hacia Pek\u00edn tras el fracaso de las negociaciones y la captura de integrantes de su delegaci\u00f3n.",
    outcome: "Las fuerzas anglo-francesas derrotaron a las tropas Qing en Baliqiao o Palikao el 21 de septiembre de 1860.",
    consequences: "La derrota dej\u00f3 abierta la aproximaci\u00f3n aliada a Pek\u00edn y aceler\u00f3 la presi\u00f3n diplom\u00e1tica que culmin\u00f3 en la Convenci\u00f3n de Pek\u00edn.",
    chronology: [
      { year: 1860, event: "Las columnas anglo-francesas avanzaron desde Tianjin hacia la capital Qing tras las operaciones de agosto." },
      { year: 1860, event: "El 21 de septiembre, las fuerzas Qing fueron derrotadas junto al puente de Baliqiao, conocido en fuentes occidentales como Palikao." }
    ],
    treaties: ["Convenci\u00f3n de Pek\u00edn (1860)"],
    curationNote: "Palikao tambi\u00e9n aparece como Baliqiao. La asociaci\u00f3n con la Rep\u00fablica Popular China es geogr\u00e1fica y de navegaci\u00f3n; la ficha conserva al Imperio Qing como actor hist\u00f3rico y describe la guerra como una expedici\u00f3n colonial."
  }),
  "Batalla de Tamsui (1884)": historicalFix({
    parent: "Guerra franco-china (1884-1885)",
    campaign: "Campa\u00f1a de Keelung y Tamsui (1884-1885)",
    region: "Tamsui o Hobe, norte de Taiw\u00e1n bajo administraci\u00f3n Qing, actual Taiw\u00e1n",
    hierarchySources: [SOURCES.tamsuiNewTaipei, SOURCES.tamsuiNationalMuseum],
    startYear: 1884,
    conflictType: "colonial",
    scale: "internacional",
    participants: [
      { side: "Fuerzas expedicionarias francesas", members: ["Tercera Rep\u00fablica Francesa"] },
      { side: "Fuerzas Qing y milicias locales", members: ["Imperio Qing"] }
    ],
    cause: "Francia intent\u00f3 ampliar su presi\u00f3n militar sobre el norte de Taiw\u00e1n durante la guerra franco-china y atac\u00f3 el entorno de Tamsui.",
    outcome: "Las fuerzas Qing y combatientes locales rechazaron el desembarco y derrotaron a las tropas francesas en Tamsui durante octubre de 1884.",
    consequences: "El rev\u00e9s franc\u00e9s fren\u00f3 el avance sobre Tamsui y mantuvo el frente taiwan\u00e9s dentro de la guerra hasta el arreglo de 1885.",
    chronology: [
      { year: 1884, event: "La guerra franco-china se extendi\u00f3 a Taiw\u00e1n con operaciones francesas en Keelung y el norte de la isla." },
      { year: 1884, event: "Entre el 2 y el 8 de octubre, las defensas Qing y locales rechazaron el ataque franc\u00e9s contra Tamsui." }
    ],
    treaties: ["Tratado de Tianjin (1885)"],
    curationNote: "Tamsui, Hobe y Danshui son variantes del top\u00f3nimo. Taiw\u00e1n figura como referencia geogr\u00e1fica contempor\u00e1nea; el actor hist\u00f3rico de la defensa fue el Imperio Qing y no se presenta a ninguna administraci\u00f3n actual como beligerante de 1884."
  }),
  "Batalla de San Jacinto (1836)": historicalFix({
    parent: "Revoluci\u00f3n de Texas (1835-1836)",
    campaign: "Campa\u00f1a de San Jacinto (abril de 1836)",
    region: "R\u00edo San Jacinto, cerca de las actuales La Porte y Deer Park, Texas, Estados Unidos",
    hierarchySources: [SOURCES.sanJacintoTexasHistoricalCommission, SOURCES.sanJacintoTexasStateLibrary],
    startYear: 1836,
    conflictType: "independencia",
    scale: "regional",
    participants: [
      { side: "Ej\u00e9rcito texano", members: ["Rep\u00fablica de Texas"] },
      { side: "Ej\u00e9rcito mexicano", members: ["Rep\u00fablica Mexicana"] }
    ],
    cause: "El ej\u00e9rcito de Antonio L\u00f3pez de Santa Anna avanz\u00f3 para sofocar la rebeli\u00f3n texana tras su declaraci\u00f3n de independencia de M\u00e9xico.",
    outcome: "El ej\u00e9rcito texano derrot\u00f3 a la fuerza de Santa Anna el 21 de abril y el presidente mexicano fue capturado al d\u00eda siguiente.",
    consequences: "La victoria abri\u00f3 negociaciones y los Tratados de Velasco, pero M\u00e9xico no los ratific\u00f3; la independencia texana qued\u00f3 como una realidad de facto antes de la anexi\u00f3n estadounidense.",
    chronology: [
      { year: 1836, event: "El 20 de abril, los ej\u00e9rcitos de Houston y Santa Anna se enfrentaron en escaramuzas junto al r\u00edo San Jacinto." },
      { year: 1836, event: "El 21 de abril, el ataque texano derrot\u00f3 al campamento mexicano; Santa Anna fue capturado el 22 de abril." }
    ],
    treaties: ["Tratados de Velasco (1836, no ratificados por M\u00e9xico)"],
    curationNote: "Estados Unidos se conserva como referencia geogr\u00e1fica y de navegaci\u00f3n actual. El beligerante texano de 1836 fue la Rep\u00fablica de Texas, previa a su anexi\u00f3n, y los tratados posteriores no fueron ratificados por M\u00e9xico."
  }),
  "Segunda batalla de Schooneveld (1673)": historicalFix({
    parent: "Tercera guerra anglo-neerlandesa (1672-1674)",
    campaign: "Operaciones de Schooneveld (junio de 1673)",
    region: "Banco de Schooneveld, desembocadura del Escalda, mar del Norte, actual Reino de los Pa\u00edses Bajos",
    hierarchySources: [SOURCES.schooneveldRoyalMuseumsGreenwich, SOURCES.schooneveldHistoryOfWar],
    startYear: 1673,
    type: "batalla naval",
    scale: "internacional",
    participants: [
      { side: "Flota anglo-francesa", members: ["Reino de Inglaterra", "Reino de Francia"] },
      { side: "Flota de las Provincias Unidas", members: ["Rep\u00fablica de las Siete Provincias Unidas"] }
    ],
    cause: "La flota anglo-francesa buscaba obtener control naval frente a la costa neerlandesa y facilitar una posible invasi\u00f3n, mientras De Ruyter proteg\u00eda el fondeadero de Schooneveld.",
    outcome: "La flota neerlandesa de De Ruyter obtuvo una ventaja operacional y las fuerzas anglo-francesas se retiraron para reparar sus buques.",
    consequences: "El resultado ayud\u00f3 a frustrar el desembarco aliado y precedi\u00f3 a la batalla de Texel dentro de la Tercera guerra anglo-neerlandesa.",
    chronology: [
      { year: 1673, event: "La primera batalla de Schooneveld se libr\u00f3 a fines de mayo seg\u00fan el calendario juliano y a comienzos de junio seg\u00fan el gregoriano." },
      { year: 1673, event: "La segunda acci\u00f3n ocurri\u00f3 el 4 de junio juliano, equivalente al 14 de junio gregoriano, frente a la costa neerlandesa." }
    ],
    treaties: ["Paz de Westminster (1674)"],
    related: ["Guerra franco-neerlandesa (1672-1678)", "Batalla de Texel (1673)"],
    curationNote: "La fecha aparece como 4 de junio en fuentes inglesas de calendario juliano y 14 de junio en cronolog\u00eda gregoriana. Reino Unido, Francia y Reino de los Pa\u00edses Bajos se usan para navegaci\u00f3n; los beligerantes se conservan como reinos y rep\u00fablica de 1673."
  })
};
