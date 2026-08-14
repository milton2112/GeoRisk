function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  gonzalesTexasHistoricalCommission: source(
    "Texas Historical Commission: marcador y relato de la batalla de Gonzales del 2 de octubre de 1835",
    "https://atlas.thc.texas.gov/Details/5177002221/print"
  ),
  gonzalesTexasRevolution: source(
    "Texas Historical Commission: marco militar de la Revoluci\u00f3n de Texas",
    "https://thc.texas.gov/learn/military-history/texas-revolution-and-republic"
  ),
  twinTunnelsArmyHistory: source(
    "Centro de Historia Militar del Ej\u00e9rcito de EE. UU.: combate y emboscada de Twin Tunnels",
    "https://history.army.mil/portals/143/Images/Publications/catalog/30-2.pdf"
  ),
  twinTunnelsArmyUniversityPress: source(
    "Army University Press: lectura de la batalla de Twin Tunnels del 31 de enero al 1 de febrero de 1951",
    "https://www.armyupress.army.mil/Portals/7/educational-services/staff-rides/2_Battle_of_Chipyong_ni_Readings_Exportable.pdf"
  ),
  indianOceanRoyalMuseumsGreenwich: source(
    "Royal Museums Greenwich: acciones de Sadras, Providien y Negapatam entre las escuadras de Suffren y Hughes",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-11940"
  ),
  indianOceanRoyalNavyArchive: source(
    "Royal Navy Research Archive: honores de batalla Sadras, Providien y Negapatam de 1782",
    "https://www.royalnavyresearcharchive.org.uk/PDF_files/Battle_honours_by_unit.pdf"
  ),
  puloAuraRoyalMuseumsGreenwich: source(
    "Royal Museums Greenwich: ataque de Linois a la Flota de China en Pulo Aura el 15 de febrero de 1804",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-156067"
  ),
  puloAuraRoyalCollection: source(
    "Royal Collection Trust: mapa y ficha de la batalla de Pulau Aur/Pulo Aura de 1804",
    "https://militarymaps.rct.uk/napoleonic-wars-1803-15/battle-of-pulau-aur-1804-pulau-aur-island-johore-malaysia-22deg7000n-104deg3100e-0"
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
    curationBatch: "source-backed-global-source-followup-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

const ANGLO_FRENCH_INDIAN_OCEAN_WAR = "Guerra anglo-francesa (1778-1783)";
const ANGLO_FRENCH_INDIAN_OCEAN_CAMPAIGN = "Operaciones navales de Suffren y Hughes en el oc\u00e9ano \u00cdndico (1782)";
const ANGLO_FRENCH_INDIAN_OCEAN_SOURCES = [
  SOURCES.indianOceanRoyalMuseumsGreenwich,
  SOURCES.indianOceanRoyalNavyArchive
];

function indianOceanFleetFix({ region, chronology, outcome, curationNote, related = [] }) {
  return historicalFix({
    parent: ANGLO_FRENCH_INDIAN_OCEAN_WAR,
    campaign: ANGLO_FRENCH_INDIAN_OCEAN_CAMPAIGN,
    region,
    hierarchySources: ANGLO_FRENCH_INDIAN_OCEAN_SOURCES,
    startYear: 1782,
    type: "batalla naval",
    scale: "internacional",
    participants: [
      {
        side: "Escuadra brit\u00e1nica de las Indias Orientales",
        members: ["Reino de Gran Breta\u00f1a"]
      },
      {
        side: "Escuadra francesa de las Indias Orientales",
        members: ["Reino de Francia"]
      }
    ],
    cause: "Las escuadras de Edward Hughes y Pierre-Andr\u00e9 de Suffren disputaban el control naval, los convoyes y las rutas del oc\u00e9ano \u00cdndico durante la guerra anglo-francesa.",
    outcome,
    consequences: "La campa\u00f1a entre ambas escuadras continu\u00f3 durante 1782 y 1783; las fuentes del museo no permiten cerrar la serie con una victoria naval decisiva de una sola acci\u00f3n.",
    chronology,
    treaties: ["Tratado de Versalles (1783)"],
    related: ["Guerra de Independencia de los Estados Unidos (1775-1783)", ...related],
    curationNote
  });
}

export const GLOBAL_SOURCE_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Gonz\u00e1lez": "Batalla de Gonzales (1835)",
  "Batalla de los T\u00faneles Gemelos": "Batalla de los T\u00faneles Gemelos (1951)",
  "Batalla de Sadras": "Batalla de Sadras (1782)",
  "Batalla de Providien": "Batalla de Providien (1782)",
  "Batalla de Negapatam": "Batalla de Negapatam (1782)",
  "Batalla de Pulo Aura": "Batalla de Pulo Aura (1804)"
};

export const GLOBAL_SOURCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  India: ["Batalla de Sadras (1782)", "Batalla de Negapatam (1782)"],
  "Sri Lanka": ["Batalla de Providien (1782)"],
  Malasia: ["Batalla de Pulo Aura (1804)"],
  "Estados Unidos": ["Batalla de Gonzales (1835)", "Batalla de los T\u00faneles Gemelos (1951)"],
  "Reino Unido": [
    "Batalla de Sadras (1782)",
    "Batalla de Providien (1782)",
    "Batalla de Negapatam (1782)",
    "Batalla de Pulo Aura (1804)"
  ],
  Francia: ["Batalla de los T\u00faneles Gemelos (1951)"],
  "Corea del Sur": ["Batalla de los T\u00faneles Gemelos (1951)"],
  "Rep\u00fablica Popular China": ["Batalla de los T\u00faneles Gemelos (1951)"]
};

export const GLOBAL_SOURCE_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Gonzales (1835)": historicalFix({
    parent: "Revoluci\u00f3n de Texas (1835-1836)",
    campaign: "Inicio de la Revoluci\u00f3n de Texas (octubre de 1835)",
    region: "R\u00edo Guadalupe, cerca de Gonzales, Coahuila y Tejas, Rep\u00fablica Mexicana de la \u00e9poca, actual Estados Unidos",
    hierarchySources: [SOURCES.gonzalesTexasHistoricalCommission, SOURCES.gonzalesTexasRevolution],
    startYear: 1835,
    conflictType: "independencia",
    participants: [
      { side: "Milicias texianas", members: ["Colonos texianos y tejanos"] },
      { side: "Destacamento mexicano", members: ["Rep\u00fablica Mexicana"] }
    ],
    cause: "El gobierno mexicano exigi\u00f3 la devoluci\u00f3n de un ca\u00f1\u00f3n entregado a Gonzales; los colonos se negaron y se concentraron fuerzas de ambos lados del r\u00edo Guadalupe.",
    outcome: "El 2 de octubre, las milicias texianas hicieron retroceder al destacamento mexicano hacia San Antonio tras el intercambio de fuego.",
    consequences: "La acci\u00f3n es reconocida como el primer combate de la Revoluci\u00f3n de Texas y aceler\u00f3 la organizaci\u00f3n pol\u00edtica y militar de los rebeldes.",
    chronology: [
      { year: 1835, event: "A fines de septiembre, el comandante Domingo de Ugartechea reclam\u00f3 el ca\u00f1\u00f3n de Gonzales y envi\u00f3 un destacamento para recuperarlo." },
      { year: 1835, event: "El 2 de octubre, las fuerzas texianas cruzaron el r\u00edo Guadalupe y obligaron a la retirada del destacamento mexicano." }
    ],
    treaties: ["Tratados de Velasco (1836, no ratificados por M\u00e9xico)"],
    curationNote: "Gonzales se conserva sin acento porque es el top\u00f3nimo oficial del sitio en Texas. Estados Unidos se agrega solo para navegaci\u00f3n geogr\u00e1fica actual: en 1835 la acci\u00f3n ocurri\u00f3 dentro de la Rep\u00fablica Mexicana y antecede a la Rep\u00fablica de Texas."
  }),
  "Batalla de los T\u00faneles Gemelos (1951)": historicalFix({
    parent: "Guerra de Corea",
    campaign: "Operaciones de los T\u00faneles Gemelos y Chipyong-ni (enero-febrero de 1951)",
    region: "T\u00faneles ferroviarios al sudeste de Chipyong-ni, condado de Yangpyeong, Corea del Sur",
    hierarchySources: [SOURCES.twinTunnelsArmyHistory, SOURCES.twinTunnelsArmyUniversityPress],
    startYear: 1951,
    scale: "internacional",
    participants: [
      {
        side: "Fuerzas de las Naciones Unidas",
        members: ["Estados Unidos", "Francia", "Rep\u00fablica de Corea"]
      },
      {
        side: "Voluntarios del Pueblo Chino",
        members: ["Voluntarios del Pueblo Chino"]
      }
    ],
    cause: "Tras la emboscada de una patrulla de reconocimiento el 29 de enero, el X Cuerpo orden\u00f3 identificar y expulsar a las fuerzas chinas del sector de los t\u00faneles.",
    outcome: "El 3.er Batall\u00f3n del 23.er Regimiento de Infanter\u00eda y el batall\u00f3n franc\u00e9s mantuvieron el complejo ferroviario y rechazaron los ataques durante la acci\u00f3n principal del 31 de enero al 1 de febrero.",
    consequences: "La acci\u00f3n precedi\u00f3 a la defensa de Chipyong-ni y ayud\u00f3 a confirmar la presencia de fuerzas chinas en el corredor central de Corea.",
    chronology: [
      { year: 1951, event: "El 29 de enero, una patrulla conjunta fue emboscada cerca de los t\u00faneles y debi\u00f3 ser relevada durante la noche." },
      { year: 1951, event: "Del 31 de enero al 1 de febrero, el 23.er Regimiento y el batall\u00f3n franc\u00e9s defendieron el complejo de los T\u00faneles Gemelos." }
    ],
    treaties: ["Acuerdo de Armisticio de Corea (1953)"],
    related: ["Batalla de Chipyong-ni (1951)"],
    curationNote: "La ficha separa la emboscada de patrulla del 29 de enero de la batalla principal del 31 de enero al 1 de febrero. Las asociaciones con Corea del Sur, Francia y la Rep\u00fablica Popular China facilitan navegaci\u00f3n; los participantes se describen como las fuerzas de \u00e9poca y no se consolidan bajas disputadas."
  }),
  "Batalla de Sadras (1782)": indianOceanFleetFix({
    region: "Frente a Sadras, costa de Coromandel, actual Tamil Nadu, India",
    outcome: "La acci\u00f3n del 17 de febrero no resolvi\u00f3 el control naval; ambas escuadras conservaron capacidad de operar y la serie de combates continu\u00f3.",
    chronology: [
      { year: 1782, event: "El 17 de febrero, las escuadras de Suffren y Hughes se enfrentaron frente a Sadras en la costa de Coromandel." },
      { year: 1782, event: "Tras la acci\u00f3n, las flotas siguieron operando en las Indias Orientales y volvieron a enfrentarse en abril." }
    ],
    related: ["Batalla de Providien (1782)", "Batalla de Negapatam (1782)"],
    curationNote: "Sadras es una acci\u00f3n naval de 1782 en la actual India, no una guerra entre India y Francia contempor\u00e1neas. La ficha conserva los reinos de \u00e9poca, no presenta bajas como cifra consolidada y distingue la acci\u00f3n de los enfrentamientos posteriores de la misma serie."
  }),
  "Batalla de Providien (1782)": indianOceanFleetFix({
    region: "Frente a la costa oriental de Ceil\u00e1n, al sur de Trincomalee, actual Sri Lanka",
    outcome: "La acci\u00f3n del 12 de abril qued\u00f3 sin una decisi\u00f3n naval concluyente; ninguna de las escuadras perdi\u00f3 un buque y la campa\u00f1a continu\u00f3.",
    chronology: [
      { year: 1782, event: "El 12 de abril, las escuadras francesa y brit\u00e1nica volvieron a enfrentarse frente a Providien, cerca de Trincomalee." },
      { year: 1782, event: "Las fuerzas navales continuaron la campa\u00f1a en el oc\u00e9ano \u00cdndico antes del combate de Negapatam de julio." }
    ],
    related: ["Batalla de Sadras (1782)", "Batalla de Negapatam (1782)"],
    curationNote: "Providien se sit\u00faa frente al Ceil\u00e1n hist\u00f3rico, con Sri Lanka como referencia geogr\u00e1fica de navegaci\u00f3n actual. La ficha no traslada Estados contempor\u00e1neos a los beligerantes ni convierte recuentos parciales de bajas en cifras definitivas."
  }),
  "Batalla de Negapatam (1782)": indianOceanFleetFix({
    region: "Frente a Negapatam, golfo de Bengala, actual Tamil Nadu, India",
    outcome: "La acci\u00f3n del 6 de julio no produjo la p\u00e9rdida de un buque por ninguna de las escuadras; Suffren conserv\u00f3 capacidad de amenazar la posici\u00f3n brit\u00e1nica.",
    chronology: [
      { year: 1782, event: "El 6 de julio, las escuadras de Hughes y Suffren se enfrentaron frente a Negapatam." },
      { year: 1782, event: "Tras Negapatam, la rivalidad naval prosigui\u00f3 hacia las operaciones de Trincomalee y Cuddalore." }
    ],
    related: ["Batalla de Sadras (1782)", "Batalla de Providien (1782)"],
    curationNote: "Negapatam conserva la forma hist\u00f3rica usada por las fuentes navales. India se incorpora por el lugar actual; los beligerantes son el Reino de Gran Breta\u00f1a y el Reino de Francia de 1782, y la ficha evita tratar una acci\u00f3n sin barcos perdidos como una victoria naval decisiva."
  }),
  "Batalla de Pulo Aura (1804)": historicalFix({
    parent: "Guerras napole\u00f3nicas (1803-1815)",
    campaign: "Defensa de la Flota de China en el estrecho de Malaca (febrero de 1804)",
    region: "Estrecho de Malaca, frente a Pulau Aur o Pulo Aura, actual Johor, Malasia",
    hierarchySources: [SOURCES.puloAuraRoyalMuseumsGreenwich, SOURCES.puloAuraRoyalCollection],
    startYear: 1804,
    type: "batalla naval",
    scale: "internacional",
    participants: [
      {
        side: "Flota mercante de la Compa\u00f1\u00eda Brit\u00e1nica de las Indias Orientales",
        members: ["Compa\u00f1\u00eda Brit\u00e1nica de las Indias Orientales"]
      },
      {
        side: "Escuadra naval francesa",
        members: ["Primer Imperio franc\u00e9s"]
      }
    ],
    cause: "La escuadra de Charles-Alexandre Linois intent\u00f3 interceptar la Flota de China que regresaba de Cant\u00f3n con carga de la Compa\u00f1\u00eda Brit\u00e1nica de las Indias Orientales.",
    outcome: "El ardid de Nathaniel Dance, que form\u00f3 a los mercantes como una l\u00ednea de batalla, llev\u00f3 a la escuadra francesa a retirarse y permiti\u00f3 que el convoy alcanzara el estrecho de Malaca.",
    consequences: "El episodio preserv\u00f3 el convoy comercial y se convirti\u00f3 en una acci\u00f3n naval destacada de la fase inicial de las Guerras napole\u00f3nicas en Asia.",
    chronology: [
      { year: 1804, event: "El convoy de la Compa\u00f1\u00eda de las Indias Orientales zarp\u00f3 de Cant\u00f3n rumbo a Europa a fines de enero." },
      { year: 1804, event: "El 15 de febrero, la escuadra de Linois atac\u00f3 frente a Pulo Aura y se retir\u00f3 tras el despliegue del convoy de Dance." }
    ],
    related: ["Compa\u00f1\u00eda Brit\u00e1nica de las Indias Orientales"],
    curationNote: "Pulo Aura tambi\u00e9n aparece como Pulo Aor o Pulau Aur. Reino Unido y Malasia sirven para navegaci\u00f3n hist\u00f3rica y geogr\u00e1fica: el bando brit\u00e1nico fue un convoy mercante de la Compa\u00f1\u00eda de las Indias Orientales, no una escuadra regular de la Royal Navy."
  })
};
