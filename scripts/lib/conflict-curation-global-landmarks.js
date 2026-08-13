function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  samurraAirForceHistory: source(
    "Fuerza A\u00e9rea de EE. UU.: estudio hist\u00f3rico de la guerra del Golfo y su campa\u00f1a a\u00e9rea",
    "https://www.afhistory.af.mil/FAQs/Fact-Sheets/Article/458966/the-u-s-air-force-in-the-gulf-war/"
  ),
  samurraArmyChronology: source(
    "Centro de Historia Militar del Ej\u00e9rcito de EE. UU.: inicio de Desert Storm el 17 de enero de 1991",
    "https://history.army.mil/Research/Reference-Topics/Army-Birthdays/Chronology-of-Army-History/"
  ),
  dannyBoyGovUk: source(
    "Gobierno del Reino Unido: informe p\u00fablico de la investigaci\u00f3n Al-Sweady",
    "https://www.gov.uk/government/publications/al-sweady-inquiry-report"
  ),
  dannyBoyNationalArchives: source(
    "National Archives: archivo de la investigaci\u00f3n sobre Danny Boy",
    "https://discovery.nationalarchives.gov.uk/details/r/C14654693"
  ),
  tafilahJordanArmedForces: source(
    "Fuerzas Armadas de Jordania: monumento de Al-Tafilah y batalla de Hadd al-Daqiq",
    "https://www.jaf.mil.jo/ContentstemplateC/Al-Tafila_Monument.aspx"
  ),
  tafilahFirstWorldWarEncyclopedia: source(
    "Enciclopedia Internacional de la Primera Guerra Mundial: Faysal y la batalla de Tafilah",
    "https://encyclopedia.1914-1918-online.net/article/faysal-i-king-of-iraq-1-1/?format=pdf"
  ),
  topMaloRoyalMarinesHistory: source(
    "Royal Marines History: escaramuza de Top Malo House del 31 de mayo de 1982",
    "https://www.royalmarineshistory.com/post/2019/05/31/battle-for-the-falklands-the-skirmish-at-top-malo-house-31-may-1982"
  ),
  topMaloNavalHistory: source(
    "Naval-History.net: cronolog\u00eda de operaciones con material del Royal Marines Museum",
    "https://www.naval-history.net/EBook03-F51opsweek10.htm"
  ),
  pichinchaEcuadorianArmy: source(
    "Ej\u00e9rcito Ecuatoriano: desarrollo de la batalla de Pichincha del 24 de mayo de 1822",
    "https://mail.ejercitoecuatoriano.mil.ec/index.php/pages/ejercito/ccasefe/infanteria"
  ),
  pichinchaNationalHeritage: source(
    "Instituto Nacional de Patrimonio Cultural de Ecuador: gu\u00eda documental de Pichincha",
    "https://www.patrimoniocultural.gob.ec/guia-documental-sobre-la-batalla-de-pichincha-y-su-centenario-1822-1922/"
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
    curationBatch: "source-backed-global-landmarks-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const GLOBAL_LANDMARKS_SAFE_CONFLICT_RENAMES = {
  "Batalla A\u00e9rea de Samurra": "Batalla a\u00e9rea de Samurra (1991)",
  "Batalla de Danny Boy": "Batalla de Danny Boy (2004)",
  "Batalla de Tafilah": "Batalla de Tafilah (1918)",
  "Combate de Top Malo House": "Combate de Top Malo House (1982)",
  "Batalla de Pichincha": "Batalla de Pichincha (1822)"
};

export const GLOBAL_LANDMARKS_COUNTRY_CONFLICT_ADDITIONS = {
  Argentina: ["Combate de Top Malo House (1982)"],
  Ecuador: ["Batalla de Pichincha (1822)"],
  Irak: ["Batalla a\u00e9rea de Samurra (1991)", "Batalla de Danny Boy (2004)"],
  Jordania: ["Batalla de Tafilah (1918)"]
};

export const GLOBAL_LANDMARKS_CONFLICT_DETAIL_FIXES = {
  "Batalla a\u00e9rea de Samurra (1991)": historicalFix({
    parent: "Guerra del Golfo (1990-1991)",
    campaign: "Campa\u00f1a a\u00e9rea de la Guerra del Golfo (1991)",
    region: "Khan Bani Saad, gobernaci\u00f3n de Diyala, Irak",
    hierarchySources: [SOURCES.samurraAirForceHistory, SOURCES.samurraArmyChronology],
    startYear: 1991,
    type: "combate a\u00e9reo",
    scale: "internacional",
    participants: [
      { side: "Fuerza A\u00e9rea Iraqu\u00ed", members: ["Irak"] },
      { side: "Fuerza A\u00e9rea de Estados Unidos", members: ["Estados Unidos"] }
    ],
    cause: "Durante la campa\u00f1a a\u00e9rea de la Guerra del Golfo, Irak intent\u00f3 disputar el control a\u00e9reo de la coalici\u00f3n y facilitar la retirada de sus aeronaves hacia Ir\u00e1n.",
    outcome: "Las versiones sobre derribos y resultado t\u00e1ctico son contradictorias; la ficha no adjudica una victoria ni consolida p\u00e9rdidas de aeronaves.",
    consequences: "La acci\u00f3n qued\u00f3 integrada en la campa\u00f1a a\u00e9rea de 1991 y en la reducci\u00f3n posterior de la actividad ofensiva iraqu\u00ed.",
    chronology: [
      { year: 1991, event: "Desert Storm inici\u00f3 su campa\u00f1a a\u00e9rea contra Irak y Kuwait el 17 de enero." },
      { year: 1991, event: "El 30 de enero se registr\u00f3 el enfrentamiento a\u00e9reo conocido como Samurra cerca de Khan Bani Saad." }
    ],
    curationNote: "Las reclamaciones de derribo se contradicen entre relatos iraqu\u00edes y estadounidenses. La ficha verifica la guerra y la fecha, pero deja el desenlace t\u00e1ctico como discutido y no presenta bajas a\u00e9reas como hecho cerrado.",
    sourceDispute: true
  }),
  "Batalla de Danny Boy (2004)": historicalFix({
    parent: "Guerra de Irak (2003-2011)",
    campaign: "Insurgencia iraqu\u00ed en Maysan (2004)",
    region: "Cerca de Al Majar al-Kabir y la ruta 6, gobernaci\u00f3n de Maysan, Irak",
    hierarchySources: [SOURCES.dannyBoyGovUk, SOURCES.dannyBoyNationalArchives],
    startYear: 2004,
    type: "combate",
    conflictType: "insurgencia",
    participants: [
      { side: "Fuerzas brit\u00e1nicas", members: ["Reino Unido"] },
      { side: "Insurgentes iraqu\u00edes", members: ["Irak", "Ej\u00e9rcito del Mahdi"] }
    ],
    cause: "Insurgentes armados tendieron una emboscada coordinada contra tropas brit\u00e1nicas que circulaban por la ruta 6 en el sur de Irak.",
    outcome: "Las fuerzas brit\u00e1nicas repelieron la emboscada; el informe p\u00fablico registr\u00f3 28 iraqu\u00edes muertos y nueve detenidos vivos, sin fijar otras cifras en la ficha.",
    consequences: "El combate y la custodia posterior de detenidos motivaron la investigaci\u00f3n p\u00fablica Al-Sweady y recomendaciones institucionales posteriores.",
    chronology: [
      { year: 2004, event: "El 14 de mayo, grupos insurgentes armados emboscaron a tropas brit\u00e1nicas en torno al punto de control Danny Boy." },
      { year: 2004, event: "Tras el combate, nueve iraqu\u00edes fueron llevados bajo custodia brit\u00e1nica desde Camp Abu Naji." }
    ],
    curationNote: "La ficha distingue el combate de 2004 de las alegaciones e investigaciones posteriores. Las asociaciones con Irak y Reino Unido facilitan navegaci\u00f3n; no sustituyen la identidad de las unidades ni el proceso de la investigaci\u00f3n.",
    sourceDispute: true
  }),
  "Batalla de Tafilah (1918)": historicalFix({
    parent: "Revuelta \u00c1rabe (1916-1918)",
    campaign: "Operaciones de Tafilah de enero de 1918",
    region: "Hadd al-Daqiq, cerca de Al-Tafilah, actual Jordania",
    hierarchySources: [SOURCES.tafilahJordanArmedForces, SOURCES.tafilahFirstWorldWarEncyclopedia],
    startYear: 1918,
    conflictType: "independencia",
    participants: [
      { side: "Fuerzas de la Revuelta \u00c1rabe", members: ["Fuerzas \u00e1rabes hachemitas"] },
      { side: "Ej\u00e9rcito otomano", members: ["Imperio otomano"] }
    ],
    cause: "La tentativa otomana de recuperar la zona de Tafilah desencaden\u00f3 la respuesta de las fuerzas de la Revuelta \u00c1rabe y de combatientes locales.",
    outcome: "Las fuerzas de la Revuelta \u00c1rabe derrotaron a las fuerzas otomanas en Hadd al-Daqiq el 25 de enero de 1918.",
    consequences: "El episodio sostuvo la presencia de la Revuelta \u00c1rabe en el sur de Transjordania y qued\u00f3 incorporado a la memoria de la campa\u00f1a de 1918.",
    chronology: [
      { year: 1918, event: "Las fuerzas de la Revuelta \u00c1rabe consolidaron posiciones en el entorno de Tafilah durante enero." },
      { year: 1918, event: "El 25 de enero, el enfrentamiento de Hadd al-Daqiq termin\u00f3 con la derrota de las fuerzas otomanas." }
    ],
    curationNote: "Tafilah tambi\u00e9n se vincula con Hadd al-Daqiq en las fuentes locales. Jordania se agrega como referencia geogr\u00e1fica actual; no se presenta al Estado jordano contempor\u00e1neo como beligerante de 1918."
  }),
  "Combate de Top Malo House (1982)": historicalFix({
    parent: "Guerra de las Malvinas (1982)",
    campaign: "Operaciones de reconocimiento en monte Kent (mayo de 1982)",
    region: "Monte Sim\u00f3n, isla Soledad / East Falkland, Atl\u00e1ntico Sur",
    hierarchySources: [SOURCES.topMaloRoyalMarinesHistory, SOURCES.topMaloNavalHistory],
    startYear: 1982,
    type: "combate",
    participants: [
      { side: "Comandos argentinos", members: ["Argentina"] },
      { side: "Royal Marines brit\u00e1nicos", members: ["Reino Unido"] }
    ],
    cause: "Una patrulla argentina de reconocimiento se refugi\u00f3 en Top Malo House mientras las fuerzas brit\u00e1nicas desarrollaban operaciones de observaci\u00f3n alrededor de monte Kent.",
    outcome: "La patrulla argentina fue derrotada tras el asalto brit\u00e1nico del 31 de mayo; la ficha evita fijar una cifra cerrada de muertos, heridos o prisioneros.",
    consequences: "El combate reforz\u00f3 el control brit\u00e1nico de las operaciones de reconocimiento en el sector de monte Kent antes del avance final sobre Puerto Argentino/Stanley.",
    chronology: [
      { year: 1982, event: "A fines de mayo, una patrulla argentina oper\u00f3 cerca de Top Malo House en el \u00e1rea de monte Kent." },
      { year: 1982, event: "El 31 de mayo, una patrulla del Mountain and Arctic Warfare Cadre de los Royal Marines atac\u00f3 la posici\u00f3n." }
    ],
    curationNote: "La ficha usa la doble toponimia isla Soledad / East Falkland y evita tomar posici\u00f3n sobre la soberan\u00eda. Las cifras individuales del combate var\u00edan entre relatos brit\u00e1nicos y argentinos, por lo que no se consolidan.",
    sourceDispute: true
  }),
  "Batalla de Pichincha (1822)": historicalFix({
    parent: "Guerra de independencia de Quito (1820-1822)",
    campaign: "Campa\u00f1a de Quito (1821-1822)",
    region: "Laderas del volc\u00e1n Pichincha, cerca de Quito, actual Ecuador",
    hierarchySources: [SOURCES.pichinchaEcuadorianArmy, SOURCES.pichinchaNationalHeritage],
    startYear: 1822,
    conflictType: "independencia",
    participants: [
      { side: "Ej\u00e9rcito libertador de Sucre", members: ["Gran Colombia", "Divisi\u00f3n peruana"] },
      { side: "Ej\u00e9rcito realista espa\u00f1ol", members: ["Imperio espa\u00f1ol"] }
    ],
    cause: "La campa\u00f1a dirigida por Antonio Jos\u00e9 de Sucre buscaba terminar el control realista sobre Quito dentro de las guerras de independencia hispanoamericanas.",
    outcome: "El ej\u00e9rcito libertador obtuvo la victoria el 24 de mayo; la capitulaci\u00f3n realista se formaliz\u00f3 al d\u00eda siguiente.",
    consequences: "La victoria liber\u00f3 Quito y contribuy\u00f3 a la integraci\u00f3n temporal de su territorio en la Gran Colombia, antecedente de la formaci\u00f3n posterior de Ecuador.",
    chronology: [
      { year: 1822, event: "El 24 de mayo, el ej\u00e9rcito de Sucre combati\u00f3 a las fuerzas realistas en las laderas del Pichincha." },
      { year: 1822, event: "El 25 de mayo, la capitulaci\u00f3n realista consolid\u00f3 la liberaci\u00f3n de Quito." }
    ],
    treaties: ["Capitulaci\u00f3n de Quito (1822)"],
    curationNote: "Ecuador y Per\u00fa se vinculan para navegaci\u00f3n geogr\u00e1fica e hist\u00f3rica. La ficha conserva Gran Colombia, la divisi\u00f3n peruana y el Imperio espa\u00f1ol como actores de \u00e9poca, sin proyectar Estados contempor\u00e1neos sobre los beligerantes."
  })
};
