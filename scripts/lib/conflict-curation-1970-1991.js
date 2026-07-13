function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  northernIreland1969: source(
    "CAIN: cronología del conflicto de Irlanda del Norte en 1969",
    "https://cain.ulster.ac.uk/othelem/chron/ch69.htm"
  ),
  northernIreland1970: source(
    "CAIN: violencia en Belfast y defensa de St Matthew's en 1970",
    "https://cain.ulster.ac.uk/issues/housing/docs/nicrc6.htm"
  ),
  northernIreland1972: source(
    "CAIN: cronología de muertes y enfrentamientos de 1972",
    "https://cain.ulster.ac.uk/sutton/chron/1972.html"
  ),
  zhenbao: source(
    "CIA: enfrentamientos fronterizos sino-soviéticos de 1969",
    "https://www.cia.gov/readingroom/docs/CIA-RDP80B01495R000600040006-9.pdf"
  ),
  jordan: source(
    "Departamento de Estado de EE. UU.: guerra civil jordana de 1970-1971",
    "https://history.state.gov/historicaldocuments/frus1969-76v23/d161"
  ),
  eastTimor: source(
    "Naciones Unidas: invasión de Timor Oriental y operaciones en Aileu, Baucau y Lospalos",
    "https://digitallibrary.un.org/record/133672/files/S_SUPP_1984_3--%5EOR_SC_1984_III%5E-EN.pdf"
  ),
  westernSahara: source(
    "Naciones Unidas: historia de la guerra y el alto el fuego del Sahara Occidental",
    "https://www.un.org/en/events/peacekeepersday/2003/docs/sahara.htm"
  ),
  ogaden: source(
    "CIA: contraofensiva etíope-cubana en Harar y Jijiga durante 1978",
    "https://www.cia.gov/readingroom/docs/DOC_0000278536.pdf"
  ),
  iranIraq: source(
    "Naciones Unidas: inicio de la guerra entre Iran e Irak y daños en Abadán",
    "https://digitallibrary.un.org/record/125883/files/S_22863-EN.pdf"
  ),
  aleppo: source(
    "Agencia de Asilo de la Unión Europea: insurrección islamista siria de 1979-1982",
    "https://www.euaa.europa.eu/fr/print/pdf/node/23577"
  ),
  falklands: source(
    "National Army Museum: campaña terrestre y operaciones en el monte Kent",
    "https://www.nam.ac.uk/explore/british-army-and-falklands-war"
  ),
  gulf: source(
    "Centro de Historia Militar del Ejército de EE. UU.: guerra del Golfo y batalla de Khafji",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/W%20PDF/CMH_70-117-1.pdf"
  )
};

function hierarchyFix({
  parent,
  campaign,
  region,
  source: hierarchySource,
  startYear,
  endYear = startYear,
  type = "batalla",
  conflictType = "interestatal",
  scale = "regional"
}) {
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
    endYear,
    region,
    normalizedRegion: region,
    related: [...new Set([parent, campaign].filter(Boolean))],
    hierarchyConfidence: hierarchySource.confidence || "alta",
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-1970-1991-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

function westernSaharaFix(name, campaign, region, startYear, endYear = startYear) {
  const type = /^Sitio\b/i.test(name)
    ? "sitio"
    : /^Ofensiva\b/i.test(name)
      ? "ofensiva"
      : "batalla";
  return hierarchyFix({
    parent: "Guerra del Sahara Occidental",
    campaign,
    region,
    source: SOURCES.westernSahara,
    startYear,
    endYear,
    type,
    conflictType: "independencia"
  });
}

export const POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES = {
  "Ofensiva Esmara-Tifariti": "Ofensiva de Esmara-Tifariti"
};

const BASE_FIXES = {
  "Batalla del Bogside": hierarchyFix({
    parent: "Conflicto de Irlanda del Norte",
    campaign: "Disturbios de agosto de 1969",
    region: "Bogside, Derry, Irlanda del Norte",
    source: SOURCES.northernIreland1969,
    startYear: 1969,
    type: "enfrentamiento urbano",
    conflictType: "civil",
    scale: "local"
  }),
  "Segunda batalla de Zhenbao": hierarchyFix({
    parent: "Conflicto fronterizo sino-soviético",
    campaign: "Enfrentamientos de la isla de Zhenbao de 1969",
    region: "Isla de Zhenbao, río Ussuri, frontera entre China y la Unión Soviética",
    source: SOURCES.zhenbao,
    startYear: 1969,
    conflictType: "frontera"
  }),
  "Batalla de Amán": hierarchyFix({
    parent: "Conflicto jordano-palestino de 1970-1971",
    campaign: "Septiembre Negro de 1970",
    region: "Amán, Jordania",
    source: SOURCES.jordan,
    startYear: 1970,
    type: "combate urbano",
    conflictType: "civil",
    scale: "local"
  }),
  "Batalla de St Matthew's": hierarchyFix({
    parent: "Conflicto de Irlanda del Norte",
    campaign: "Violencia en Belfast de junio de 1970",
    region: "Short Strand, Belfast, Irlanda del Norte",
    source: SOURCES.northernIreland1970,
    startYear: 1970,
    type: "enfrentamiento armado",
    conflictType: "civil",
    scale: "local"
  }),
  "Ofensiva de Ajlun": hierarchyFix({
    parent: "Conflicto jordano-palestino de 1970-1971",
    campaign: "Ofensiva jordana de 1971 contra los fedayines",
    region: "Ajlun y Jerash, Jordania",
    source: SOURCES.jordan,
    startYear: 1971,
    type: "ofensiva",
    conflictType: "civil"
  }),
  "Batalla de Springmartin": hierarchyFix({
    parent: "Conflicto de Irlanda del Norte",
    campaign: "Violencia en Belfast de mayo de 1972",
    region: "Springmartin, Belfast, Irlanda del Norte",
    source: SOURCES.northernIreland1972,
    startYear: 1972,
    type: "enfrentamiento armado",
    conflictType: "civil",
    scale: "local"
  }),
  "Batalla de Aileu": hierarchyFix({
    parent: "Invasión indonesia de Timor Oriental",
    campaign: "Invasión indonesia de Timor Oriental de 1975-1976",
    region: "Aileu, Timor Oriental",
    source: SOURCES.eastTimor,
    startYear: 1975,
    conflictType: "independencia"
  }),
  "Batalla de Baucau": hierarchyFix({
    parent: "Invasión indonesia de Timor Oriental",
    campaign: "Invasión indonesia de Timor Oriental de 1975-1976",
    region: "Baucau, Timor Oriental",
    source: SOURCES.eastTimor,
    startYear: 1975,
    conflictType: "independencia"
  }),
  "Batalla de Lospalos": hierarchyFix({
    parent: "Invasión indonesia de Timor Oriental",
    campaign: "Invasión indonesia de Timor Oriental de 1975-1976",
    region: "Lospalos, Timor Oriental",
    source: SOURCES.eastTimor,
    startYear: 1976,
    conflictType: "independencia"
  }),
  "Batalla de Harar": hierarchyFix({
    parent: "Guerra de Ogadén",
    campaign: "Contraofensiva etíope-cubana de 1978",
    region: "Harar, Etiopía",
    source: SOURCES.ogaden,
    startYear: 1977,
    endYear: 1978,
    scale: "internacional"
  }),
  "Batalla de Jijiga": hierarchyFix({
    parent: "Guerra de Ogadén",
    campaign: "Contraofensiva etíope-cubana de 1978",
    region: "Jijiga, Etiopía",
    source: SOURCES.ogaden,
    startYear: 1977,
    endYear: 1978,
    scale: "internacional"
  }),
  "Sitio de Abadán": hierarchyFix({
    parent: "Guerra entre Iran e Irak",
    campaign: "Invasión iraquí de Juzestán",
    region: "Abadán, Juzestán, Iran",
    source: SOURCES.iranIraq,
    startYear: 1980,
    endYear: 1981,
    type: "sitio"
  }),
  "Sitio de Alepo (1980-1981)": hierarchyFix({
    parent: "Insurrección islamista en Siria (1976-1982)",
    campaign: "Represión de la insurgencia en Alepo",
    region: "Alepo, Siria",
    source: SOURCES.aleppo,
    startYear: 1980,
    endYear: 1981,
    type: "sitio",
    conflictType: "civil",
    scale: "local"
  }),
  "Batalla del monte Kent": hierarchyFix({
    parent: "Guerra de las Malvinas",
    campaign: "Campaña terrestre de las Malvinas",
    region: "Monte Kent, isla Soledad, Islas Malvinas",
    source: SOURCES.falklands,
    startYear: 1982,
    scale: "internacional"
  }),
  "Batalla de Khafji": hierarchyFix({
    parent: "Guerra del Golfo",
    campaign: "Operación Tormenta del Desierto",
    region: "Khafji, Arabia Saudita",
    source: SOURCES.gulf,
    startYear: 1991,
    scale: "internacional"
  }),
  "Batalla de Qurah y Umm al Maradim": hierarchyFix({
    parent: "Guerra del Golfo",
    campaign: "Liberación de Kuwait",
    region: "Islas Qaruh y Umm al-Maradim, Kuwait",
    source: SOURCES.gulf,
    startYear: 1991,
    type: "operación anfibia",
    scale: "internacional"
  })
};

const WESTERN_SAHARA_ROWS = [
  ["Batalla de Bucraa (1977)", "Primera fase de la guerra del Sahara Occidental", "Bu Craa, Sahara Occidental", 1977],
  ["Batalla de Al Mahbes (1979)", "Ofensivas del Frente Polisario de 1979", "Mahbes, Sahara Occidental", 1979],
  ["Batalla de Bucraa (1979)", "Ofensivas del Frente Polisario de 1979", "Bu Craa, Sahara Occidental", 1979],
  ["Batalla de Tan-Tan", "Ofensivas del Frente Polisario de 1979", "Tan-Tan, sur de Marruecos", 1979],
  ["Batalla de Tichla (1979)", "Ofensivas del Frente Polisario de 1979", "Tichla, Sahara Occidental", 1979],
  ["Sitio de Zag", "Ofensivas del Frente Polisario tras la retirada mauritana", "Zag, sur de Marruecos", 1979, 1980],
  ["Batalla de Akka", "Ofensivas del Frente Polisario tras la retirada mauritana", "Akka, sur de Marruecos", 1980],
  ["Batalla de Guelta Zemmur (1980)", "Ofensivas del Frente Polisario tras la retirada mauritana", "Guelta Zemmur, Sahara Occidental", 1980],
  ["Batalla de Ras el-Khanfra (1980)", "Ofensivas del Frente Polisario tras la retirada mauritana", "Sector de Ras el-Khanfra, Sahara Occidental", 1980, 1981],
  ["Batalla de Esmara (1981)", "Guerra del muro marroquí", "Esmara, Sahara Occidental", 1981],
  ["Batalla de Guelta Zemmur (marzo de 1981)", "Guerra del muro marroquí", "Guelta Zemmur, Sahara Occidental", 1981],
  ["Batalla de Guelta Zemmur (octubre de 1981)", "Guerra del muro marroquí", "Guelta Zemmur, Sahara Occidental", 1981],
  ["Batalla de Ras el-Khanfra (1982)", "Guerra del muro marroquí", "Sector de Ras el-Khanfra, Sahara Occidental", 1982],
  ["Batalla de Esmara (1983)", "Guerra del muro marroquí", "Esmara, Sahara Occidental", 1983],
  ["Batalla de Lemseied", "Guerra del muro marroquí", "Lemseied, Sahara Occidental", 1983],
  ["Ofensiva de Ain-Lahchich", "Guerra del muro marroquí", "Ain Lahchich, Sahara Occidental", 1983, 1984],
  ["Ofensiva de Esmara-Tifariti", "Guerra del muro marroquí", "Esmara y Tifariti, Sahara Occidental", 1984],
  ["Batalla de Hausa (1984)", "Guerra del muro marroquí", "Hausa, Sahara Occidental", 1984],
  ["Batalla de Al Mahbes (1985)", "Guerra del muro marroquí", "Mahbes, Sahara Occidental", 1985],
  ["Batalla de Farsia (1987)", "Guerra del muro marroquí", "Farsia, Sahara Occidental", 1987],
  ["Batalla de Tichla (1987)", "Guerra del muro marroquí", "Tichla, Sahara Occidental", 1987],
  ["Batalla de Hausa (1988)", "Guerra del muro marroquí", "Hausa, Sahara Occidental", 1988],
  ["Batalla de Oum Dreyga (septiembre de 1988)", "Guerra del muro marroquí", "Oum Dreyga, Sahara Occidental", 1988],
  ["Batalla de Amgala (1989)", "Operaciones finales antes del alto el fuego de 1991", "Amgala, Sahara Occidental", 1989],
  ["Batalla de Guelta Zemmur (1989)", "Operaciones finales antes del alto el fuego de 1991", "Guelta Zemmur, Sahara Occidental", 1989],
  ["Batalla de Hausa (1989)", "Operaciones finales antes del alto el fuego de 1991", "Hausa, Sahara Occidental", 1989],
  ["Ofensiva de Tifariti de 1991", "Operaciones finales antes del alto el fuego de 1991", "Tifariti, Sahara Occidental", 1991]
];

const WESTERN_SAHARA_FIXES = Object.fromEntries(
  WESTERN_SAHARA_ROWS.map(([name, campaign, region, startYear, endYear = startYear]) => [
    name,
    westernSaharaFix(name, campaign, region, startYear, endYear)
  ])
);

export const POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES = {
  ...BASE_FIXES,
  ...WESTERN_SAHARA_FIXES
};
