function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  cabralBn: source(
    "Biblioteca Digital Luso-Brasileira: ataque a Cabral y Lima Barros en la Guerra del Paraguay",
    "https://bdlb.bn.gov.br/acervo/handle/20.500.12156.3/432574"
  ),
  cabralMhn: source(
    "Museo Historico Nacional de Brasil: pintura historica sobre el asalto a Cabral y Lima Barros",
    "https://mhn.acervos.museus.gov.br/acervo-museologico/pintura-historica-57/"
  ),
  dieppeCanada: source(
    "Gobierno de Canada: Dieppe, accion de la Segunda Guerra Mundial del 19 de agosto de 1942",
    "https://www.canada.ca/en/department-national-defence/services/military-history/history-heritage/battle-honours-honorary-distinctions/dieppe.html"
  ),
  dieppeMuseum: source(
    "Museo Canadiense de la Guerra: contexto historico de la incursion de Dieppe",
    "https://www.warmuseum.ca/cwm/exhibitions/chrono/1931disaster_e.html"
  ),
  heligolandJylland: source(
    "Museo Maritimo Fregatten Jylland: batalla de Heligoland del 9 de mayo de 1864",
    "https://www.fregatten-jylland.dk/english/"
  ),
  heligolandNationalMuseum: source(
    "Museo Nacional de Dinamarca: segunda guerra de Schleswig de 1864",
    "https://natmus.dk/fileadmin/user_upload/Editor/natmus/Toejhusmuseet/Undervisning/pop-up_1864/inspiration/anden_slesvigske_krig_1864_engelsk.pdf"
  ),
  hudsonParks: source(
    "Parks Canada: disputa franco-inglesa por York Factory y la bahia de Hudson",
    "https://parks.canada.ca/lhn-nhs/mb/yorkfactory/culture/histoire-history"
  ),
  hudsonHistoric: source(
    "Parks Canada: contexto historico de York Factory y la Bahia de Hudson",
    "https://www.pc.gc.ca/apps/dfhd/page_nhs_eng.aspx?i=50881"
  ),
  hagueNimh: source(
    "Instituto Neerlandes de Historia Militar: batalla por La Haya durante la invasion alemana de 1940",
    "https://www.nimh.nl/militaire-geschiedenis-van-nederland/webthemas/de-meidagen-van-1940/de-strijd-op-nederlands-grondgebied/de-slag-om-de-residentie"
  ),
  hagueArchives: source(
    "Instituto Neerlandes de Historia Militar: archivos y cronologia de los combates de mayo de 1940",
    "https://www.nimh.nl/militaire-geschiedenis-van-nederland/webthemas/de-meidagen-van-1940/zelf-onderzoek-doen"
  ),
  rumailaArmy: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: Operaciones Desert Shield y Desert Storm",
    "https://history.army.mil/portals/143/Images/Publications/catalog/70-117-1.pdf"
  ),
  rumailaArmyCatalog: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: catalogo de la historia oficial de la Guerra del Golfo",
    "https://history.army.mil/html/books/070/70-117-1/index.html"
  ),
  solebayRmg: source(
    "Royal Museums Greenwich: batalla de Solebay como apertura de la tercera guerra anglo-neerlandesa",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-1115587"
  ),
  solebaySuffolk: source(
    "Suffolk Heritage Explorer: registro historico de la batalla de Solebay",
    "https://heritage.suffolk.gov.uk/Monument/MSF46124"
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
    curationBatch: "source-backed-provisional-foundation-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const PROVISIONAL_FOUNDATION_SAFE_CONFLICT_RENAMES = {
  "Asalto a los acorazados Cabral y Lima Barros": "Asalto a los acorazados Cabral y Lima Barros (1868)",
  "Batalla de Dieppe": "Batalla de Dieppe (1942)",
  "Batalla de Heligoland": "Batalla de Heligoland (1864)",
  "Batalla de la Bahía de Hudson": "Batalla de la Bahía de Hudson (1697)",
  "Batalla de la Haya": "Batalla de la Haya (1940)",
  "Batalla de Rumaila": "Batalla de Rumaila (1991)",
  "Batalla de Solebay": "Batalla de Solebay (1672)"
};

export const PROVISIONAL_FOUNDATION_COUNTRY_CONFLICT_ADDITIONS = {
  Alemania: ["Batalla de Dieppe (1942)", "Batalla de la Haya (1940)", "Batalla de Heligoland (1864)"],
  Austria: ["Batalla de Heligoland (1864)"],
  Brasil: ["Asalto a los acorazados Cabral y Lima Barros (1868)"],
  Irak: ["Batalla de Rumaila (1991)"],
  "Reino Unido": [
    "Batalla de Dieppe (1942)",
    "Batalla de la Bahía de Hudson (1697)",
    "Batalla de Solebay (1672)"
  ],
  "Reino de los Países Bajos": ["Batalla de Solebay (1672)"]
};

export const PROVISIONAL_FOUNDATION_CONFLICT_DETAIL_FIXES = {
  "Asalto a los acorazados Cabral y Lima Barros (1868)": historicalFix({
    parent: "Guerra de la Triple Alianza",
    campaign: "Operaciones navales del rio Paraguay de 1868",
    region: "Rio Paraguay, cerca de Humaita, Paraguay",
    hierarchySources: [SOURCES.cabralBn, SOURCES.cabralMhn],
    startYear: 1868,
    type: "asalto naval",
    scale: "regional",
    participants: [
      { side: "Fuerzas paraguayas", members: ["Paraguay"] },
      { side: "Escuadra imperial brasilena", members: ["Imperio del Brasil"] }
    ],
    cause: "Fuerzas paraguayas intentaron abordar los acorazados Cabral y Lima Barros durante las operaciones navales finales de la guerra sobre el rio Paraguay.",
    outcome: "La escuadra brasilena rechazo el abordaje nocturno del 2 de marzo de 1868.",
    consequences: "La accion evidencio que, pese al avance aliado, Paraguay conservaba capacidad de hostigar a la flota imperial en el frente fluvial.",
    chronology: [
      { year: 1868, event: "El 2 de marzo fuerzas paraguayas se aproximaron en canoas para abordar los acorazados Cabral y Lima Barros." },
      { year: 1868, event: "Los buques brasilenos y la escolta de la escuadra rechazaron el asalto." }
    ],
    treaties: ["Tratado de Paz entre Paraguay y Brasil (1872)"],
    curationNote: "La fecha y el marco de la Guerra del Paraguay se apoyan en el registro bibliografico brasileno. La ficha evita estimar bajas a partir de una representacion artistica."
  }),
  "Batalla de Dieppe (1942)": historicalFix({
    parent: "Segunda Guerra Mundial",
    campaign: "Incursion de Dieppe de 1942",
    region: "Dieppe, Sena Maritimo, Francia ocupada",
    hierarchySources: [SOURCES.dieppeCanada, SOURCES.dieppeMuseum],
    startYear: 1942,
    type: "incursion anfibia",
    scale: "mundial",
    participants: [
      { side: "Fuerzas aliadas", members: ["Canadá", "Reino Unido"] },
      { side: "Fuerzas alemanas", members: ["Alemania"] }
    ],
    cause: "Los Aliados planearon una incursion de armas combinadas sobre el puerto de Dieppe para probar una operacion anfibia de gran escala en Europa occidental.",
    outcome: "La defensa alemana rechazo la incursion del 19 de agosto; la fuerza aliada se reembarco tras sufrir graves bajas, en especial entre las unidades canadienses.",
    consequences: "Las dificultades de desembarco, coordinacion y evacuacion fueron incorporadas a la planificacion aliada de operaciones anfibias posteriores.",
    chronology: [
      { year: 1942, event: "El 19 de agosto la 2.a Division Canadiense y comandos aliados desembarcaron en cinco sectores cercanos a Dieppe." },
      { year: 1942, event: "La resistencia alemana y los obstaculos costeros forzaron la evacuacion de la mayor parte de la fuerza." }
    ],
    treaties: ["Instrumento de rendicion aleman (1945)"],
    curationNote: "Se conserva Dieppe como una incursion aliada dentro de la Segunda Guerra Mundial, no como una batalla canadiense aislada. Las cifras de bajas se dejan a las fuentes de detalle."
  }),
  "Batalla de Heligoland (1864)": historicalFix({
    parent: "Segunda guerra de Schleswig (1864)",
    campaign: "Bloqueo danes de los puertos del mar del Norte de 1864",
    region: "Mar del Norte, frente a Heligoland",
    hierarchySources: [SOURCES.heligolandJylland, SOURCES.heligolandNationalMuseum],
    startYear: 1864,
    type: "batalla naval",
    scale: "regional",
    participants: [
      { side: "Armada danesa", members: ["Dinamarca"] },
      { side: "Escuadra austro-prusiana", members: ["Austria", "Prusia"] }
    ],
    cause: "Dinamarca mantenia un bloqueo naval durante la guerra de Schleswig cuando una escuadra austro-prusiana intento disputarle el control de las rutas del mar del Norte.",
    outcome: "La accion del 9 de mayo termino en una victoria tactica danesa; la fragata Jylland sobrevivio a impactos y la flota austro-prusiana se retiro hacia aguas neutrales.",
    consequences: "El exito tactico no altero el resultado estrategico de la guerra, que termino con la perdida danesa de Schleswig, Holstein y Lauenburg.",
    chronology: [
      { year: 1864, event: "El 9 de mayo la escuadra danesa enfrento a fuerzas austriacas y prusianas frente a Heligoland." },
      { year: 1864, event: "La Jylland y el resto de la escuadra danesa conservaron el campo tactico tras el combate." }
    ],
    treaties: ["Paz de Viena (1864)"],
    sourceDispute: true,
    curationNote: "La ficha distingue la victoria tactica danesa del desenlace estrategico desfavorable de la segunda guerra de Schleswig; no debe confundirse con Heligoland de 1914."
  }),
  "Batalla de la Bahía de Hudson (1697)": historicalFix({
    parent: "Guerra de los Nueve Anos (1688-1697)",
    campaign: "Operaciones por la bahia de Hudson (1694-1697)",
    region: "Bahia de Hudson, America del Norte",
    hierarchySources: [SOURCES.hudsonParks, SOURCES.hudsonHistoric],
    startYear: 1697,
    type: "batalla naval",
    conflictType: "colonial",
    scale: "internacional",
    participants: [
      { side: "Fuerzas francesas", members: ["Francia"] },
      { side: "Fuerzas inglesas y de la Compania de la Bahia de Hudson", members: ["Inglaterra", "Compania de la Bahia de Hudson"] }
    ],
    cause: "Francia e Inglaterra competian por los puestos comerciales y las rutas de la bahia de Hudson durante la guerra de los Nueve Anos.",
    outcome: "La fuerza francesa de Pierre Le Moyne d'Iberville obtuvo una victoria naval sobre el convoy ingles en septiembre de 1697.",
    consequences: "El combate se inserto en una disputa mas amplia por York Factory y la red comercial; el control frances de la zona persistio hasta el arreglo de 1713.",
    chronology: [
      { year: 1697, event: "En septiembre la flota francesa enfrento al convoy ingles en la bahia de Hudson." },
      { year: 1697, event: "La victoria francesa reforzo temporalmente su posicion en la disputa por York Factory." }
    ],
    treaties: ["Tratado de Utrecht (1713)"],
    curationNote: "La referencia geografica norteamericana no convierte a Canada moderno en beligerante. La ficha conserva el caracter colonial y comercial de la confrontacion."
  }),
  "Batalla de la Haya (1940)": historicalFix({
    parent: "Segunda Guerra Mundial",
    campaign: "Invasion alemana de los Paises Bajos de 1940",
    region: "La Haya y los aerodromos de Valkenburg, Ypenburg y Ockenburg, Paises Bajos",
    hierarchySources: [SOURCES.hagueNimh, SOURCES.hagueArchives],
    startYear: 1940,
    type: "batalla aerotransportada",
    scale: "mundial",
    participants: [
      { side: "Fuerzas neerlandesas", members: ["Reino de los Países Bajos"] },
      { side: "Fuerzas alemanas", members: ["Alemania"] }
    ],
    cause: "La invasion alemana busco capturar rapidamente los aerodromos alrededor de La Haya y detener a la reina, al gobierno y al alto mando neerlandes.",
    outcome: "La defensa neerlandesa recupero el control de los aerodromos y frustro el objetivo aleman sobre La Haya, aunque el pais capituló ante la invasion general pocos dias despues.",
    consequences: "El fracaso de la operacion aerotransportada impidio la captura inmediata del gobierno neerlandes y obligo a dispersar transportes y tropas alemanas en el sector.",
    chronology: [
      { year: 1940, event: "El 10 de mayo tropas alemanas bombardearon y lanzaron paracaidistas sobre los aerodromos cercanos a La Haya." },
      { year: 1940, event: "Los contraataques neerlandeses recuperaron posiciones y frustraron la toma planeada de la ciudad." }
    ],
    treaties: ["Capitulacion neerlandesa de 1940"],
    curationNote: "El resultado local favorable a la defensa no se presenta como victoria estrategica de toda la campana neerlandesa, que termino con la capitulacion de mayo."
  }),
  "Batalla de Rumaila (1991)": historicalFix({
    parent: "Guerra del Golfo",
    campaign: "Operaciones posteriores al alto el fuego de 1991",
    region: "Campo petrolero de Rumaila, sur de Irak",
    hierarchySources: [SOURCES.rumailaArmy, SOURCES.rumailaArmyCatalog],
    startYear: 1991,
    type: "batalla terrestre mecanizada",
    scale: "internacional",
    participants: [
      { side: "Fuerzas estadounidenses", members: ["Estados Unidos"] },
      { side: "Fuerzas iraquies", members: ["Irak"] }
    ],
    cause: "Unidades estadounidenses encontraron formaciones iraquies armadas cerca de Rumaila durante las operaciones que siguieron al cese de las hostilidades principales de la Guerra del Golfo.",
    outcome: "Las fuerzas estadounidenses destruyeron o neutralizaron la formacion iraqui enfrentada y conservaron el control tactico del sector.",
    consequences: "La accion ilustro la ambiguedad operacional de las horas posteriores al alto el fuego y la necesidad de diferenciar el combate de la ofensiva terrestre principal.",
    chronology: [
      { year: 1991, event: "El 2 de marzo unidades estadounidenses entraron en combate con fuerzas iraquies cerca del campo de Rumaila." },
      { year: 1991, event: "La accion ocurrio tras la fase principal de la ofensiva terrestre y en torno a la aplicacion del alto el fuego." }
    ],
    treaties: ["Acuerdos de alto el fuego de Safwan (1991)"],
    sourceDispute: true,
    curationNote: "Las denominaciones y el encuadre temporal de Rumaila varian entre cronologias. La ficha lo mantiene como combate de la Guerra del Golfo y marca la cautela sobre su relacion exacta con el alto el fuego."
  }),
  "Batalla de Solebay (1672)": historicalFix({
    parent: "Tercera guerra anglo-neerlandesa (1672-1674)",
    campaign: "Campaña naval del mar del Norte de 1672",
    region: "Solebay, costa de Suffolk, mar del Norte",
    hierarchySources: [SOURCES.solebayRmg, SOURCES.solebaySuffolk],
    startYear: 1672,
    type: "batalla naval",
    scale: "internacional",
    participants: [
      { side: "Flota anglo-francesa", members: ["Inglaterra", "Francia"] },
      { side: "Republica neerlandesa", members: ["Republica de los Paises Bajos"] }
    ],
    cause: "La flota anglo-francesa y la Republica neerlandesa se enfrentaron al inicio de la tercera guerra anglo-neerlandesa por el control naval y la posibilidad de apoyar una invasion.",
    outcome: "El resultado tactico fue inconcluso: ambos bandos reclamaron la victoria; los neerlandeses destruyeron el Royal James, pero su flota finalmente se retiro.",
    consequences: "El combate retraso los planes anglo-franceses y confirmo que el dominio naval en el mar del Norte seguiria disputado durante la guerra.",
    chronology: [
      { year: 1672, event: "El 28 de mayo segun el calendario ingles de la epoca, las flotas anglo-francesa y neerlandesa iniciaron el combate frente a Solebay." },
      { year: 1672, event: "La destruccion del Royal James por brulotes neerlandeses marco una de las acciones mas recordadas de la jornada." }
    ],
    treaties: ["Tratado de Westminster (1674)"],
    sourceDispute: true,
    curationNote: "La fecha puede aparecer como 28 de mayo de calendario ingles o 7 de junio de calendario gregoriano. Se explicita la ambiguedad y no se fuerza una victoria absoluta."
  })
};
