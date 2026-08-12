function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  chojniceEducation: source(
    "Centro de Educacion de Mragowo: segunda batalla de Chojnice de 1657",
    "https://ckziumragowo.pl/historia/Bitwa-pod-Chojnicami-1657"
  ),
  chojniceRegionalHistory: source(
    "Chojniczanin: estudio regional sobre la accion de Chojnice de 1657",
    "https://chojniczanin.pl/pdf/chojniczanin-10-2016.pdf"
  ),
  filipowHeritage: source(
    "Instituto Nacional de Patrimonio de Polonia: batalla de Filipow de 1656",
    "https://edd.nid.pl/wydarzenia/seminarium-popularno-naukowe-pt-slady-bitwy-pod-filipowem-1656/"
  ),
  filipowHistory: source(
    "TwojaHistoria: sintesis de la batalla de Filipow del 22 de octubre de 1656",
    "https://twojahistoria.pl/encyklopedia/leksykon-bitew/bitwa-pod-filipowem-22-pazdziernika-1656/"
  ),
  kleckoEducation: source(
    "Plataforma Educativa Integrada de Polonia: batalla de Klecko de 1656",
    "https://zpe.gov.pl/a/rzeczpospolita-wojuje/D10uujbva"
  ),
  kleckoAcademic: source(
    "Repositorio de la Universidad Pedagogica de Cracovia: estudio de fuentes de Klecko",
    "https://repozytorium.biblos.pk.edu.pl/redo/resources/35540/file/scans/DEFAULT/OCR_rezultaty/100000299453_A_v1_200dpi_q60.pdf"
  ),
  lowiczPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: batalla de Lowicz de 1656",
    "https://muzeumwp.pl/timeline/bitwa-pod-lowiczem-wojewoda-ruski-stefan-czarniecki/"
  ),
  lowiczAcademic: source(
    "Biblioteca Digital de Podlasie: estudio de las operaciones de 1656 y Lowicz",
    "https://pbc.biaman.pl/Content/56859/Studia_tom_I.pdf"
  ),
  niskoMunicipality: source(
    "Municipio de Nisko: jornada historica sobre la batalla de 1656",
    "https://archiwalna.nisko.pl/aktualnosci/2118-bitwa-pod-niskiem"
  ),
  niskoMilitaryLibrary: source(
    "Biblioteca Militar Central de Polonia: estudio historico de la campana de 1656",
    "https://zbrojownia.cbw.wp.mil.pl/Content/13650/01127_INW_1252_1937_NR_12.pdf"
  ),
  tykocinMunicipality: source(
    "Municipio de Tykocin: socorro de la fortaleza de julio de 1656",
    "https://umtykocin.pl/turysta/tykocin/"
  ),
  tykocinMazoviaStudy: source(
    "Estudio historico sobre la campana de Mazovia y el socorro de Tykocin de 1656",
    "https://madzelan.cba.pl/wp-content/uploads/2018/10/APOKALIPSA-1657.pdf"
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
    curationBatch: "source-backed-polish-deluge-swedish-operations-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const POLISH_DELUGE_SWEDISH_OPERATIONS_SAFE_CONFLICT_RENAMES = {
  "Batalla de Chojnice": "Batalla de Chojnice (1657)",
  "Batalla de Filip\u00f3w": "Batalla de Filip\u00f3w (1656)",
  "Batalla de Klecko": "Batalla de Klecko (1656)",
  "Batalla de Lowicz": "Batalla de Lowicz (1656)",
  "Batalla de Nisko": "Batalla de Nisko (1656)",
  "Batalla de Tykocin": "Batalla de Tykocin (1656)"
};

export const POLISH_DELUGE_SWEDISH_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: [
    "Batalla de Chojnice (1657)",
    "Batalla de Filip\u00f3w (1656)",
    "Batalla de Klecko (1656)",
    "Batalla de Lowicz (1656)",
    "Batalla de Nisko (1656)",
    "Batalla de Tykocin (1656)"
  ]
};

export const POLISH_DELUGE_SWEDISH_OPERATIONS_CONFLICT_DETAIL_FIXES = {
  "Batalla de Chojnice (1657)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Operaciones de Pomerelia de 1657",
    region: "Chojnice y ruta hacia Gdansk, Pomerelia, actual Polonia",
    hierarchySources: [SOURCES.chojniceEducation, SOURCES.chojniceRegionalHistory],
    startYear: 1657,
    type: "encuentro de caballeria",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Vanguardia sueca", members: ["Imperio sueco"] }
    ],
    cause: "Un destacamento de Stefan Czarniecki escoltaba a la reina Ludwika Maria hacia el corredor de Gdansk cuando la vanguardia sueca intento cortar el movimiento.",
    outcome: "Las fuerzas de la Mancomunidad rechazaron a la vanguardia sueca y se retiraron despues ante la aproximacion de fuerzas suecas mayores.",
    consequences: "El encuentro mantuvo abierta la maniobra polaco-lituana hacia Pomerelia y formo parte de la recuperacion gradual de iniciativa frente a Suecia.",
    chronology: [
      { year: 1657, event: "La expedicion vinculada a Ludwika Maria avanzo hacia Pomerelia en un contexto de comunicaciones suecas disputadas." },
      { year: 1657, event: "La vanguardia sueca ataco cerca de Chojnice y fue rechazada antes de la llegada de fuerzas principales." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "La etiqueta se fecha como 1657 por la documentacion local y evita confundirla con la batalla medieval de Chojnice de 1454. Las fuentes describen de modo distinto el dia exacto, la marcha y las bajas, por lo que la ficha no fija cifras como consolidadas."
  }),
  "Batalla de Filip\u00f3w (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campana de Prusia Ducal de 1656",
    region: "Filipow y Mieruniszki, Suwalszczyzna, actual Polonia",
    hierarchySources: [SOURCES.filipowHeritage, SOURCES.filipowHistory],
    startYear: 1656,
    type: "batalla campal",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Cuerpo sueco-brandenburgues", members: ["Imperio sueco", "Brandeburgo-Prusia"] }
    ],
    cause: "Tras la victoria de Prostki, el mando sueco-brandenburgues intento frenar la division de Wincenty Gosiewski en el entorno de Filipow.",
    outcome: "El cuerpo sueco-brandenburgues obligo a la division de la Mancomunidad a retirarse y recupero al principe Boguslaw Radziwill, capturado en Prostki.",
    consequences: "El reves limito temporalmente la posicion polaco-lituana en Prusia Ducal, sin poner fin a las operaciones ni resolver la guerra.",
    chronology: [
      { year: 1656, event: "Las fuerzas de Gosiewski se concentraron en el entorno de Filipow despues de las operaciones de Prostki." },
      { year: 1656, event: "El 22 de octubre el cuerpo sueco-brandenburgues ataco y forzo la retirada de la division de la Mancomunidad." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio", "Batalla de Prostki (1656)"],
    sourceDispute: true,
    curationNote: "Las fuentes no coinciden en los efectivos ni en las bajas de ambos bandos. La ficha conserva la fecha, los mandos y el resultado general sin convertir recuentos parciales en cifras consolidadas ni proyectar Estados contemporaneos sobre la Mancomunidad."
  }),
  "Batalla de Klecko (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campana de Gran Polonia de 1656",
    region: "Klecko, cerca de Gniezno, Gran Polonia, actual Polonia",
    hierarchySources: [SOURCES.kleckoEducation, SOURCES.kleckoAcademic],
    startYear: 1656,
    type: "batalla campal",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Ejercito sueco", members: ["Imperio sueco"] }
    ],
    cause: "Las fuerzas de Stefan Czarniecki y Jerzy Lubomirski intentaron obligar al ejercito sueco a combatir en campo abierto durante las operaciones de Gran Polonia.",
    outcome: "El combate no produjo una decision estrategica: las fuerzas de la Mancomunidad no lograron desalojar al ejercito sueco de sus posiciones fortificadas.",
    consequences: "La accion evidencio las limitaciones de una fuerza principalmente de caballeria contra infanteria y artilleria suecas bien atrincheradas, mientras la campana continuo.",
    chronology: [
      { year: 1656, event: "Las fuerzas polaco-lituanas se concentraron en Gran Polonia para sostener la resistencia contra el avance sueco." },
      { year: 1656, event: "En Klecko, los intentos de llevar al ejercito sueco a terreno abierto no consiguieron romper sus posiciones preparadas." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "Las fuentes discrepan sobre el dia concreto de mayo y sobre los recuentos de bajas. La ficha registra 1656 y un resultado no decisivo, sin transformar cifras discutidas en un balance definitivo."
  }),
  "Batalla de Lowicz (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Contraofensiva de Mazovia de 1656",
    region: "Lowicz, Mazovia historica, actual Polonia",
    hierarchySources: [SOURCES.lowiczPolishArmyMuseum, SOURCES.lowiczAcademic],
    startYear: 1656,
    type: "encuentro de caballeria",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Destacamento sueco", members: ["Imperio sueco"] }
    ],
    cause: "Despues de la derrota polaco-lituana en Varsovia, Stefan Czarniecki busco golpear a un destacamento sueco separado en el entorno de Lowicz.",
    outcome: "Las fuerzas de Czarniecki derrotaron al destacamento sueco dirigido por Hans Boddeker, en uno de los primeros grandes exitos de la Mancomunidad tras Varsovia.",
    consequences: "La victoria reforzo la contraofensiva en Mazovia y elevo la presion sobre las fuerzas suecas y sus aliados, sin decidir por si sola la guerra.",
    chronology: [
      { year: 1656, event: "La derrota de Varsovia obligo a las fuerzas de la Mancomunidad a reorganizar sus operaciones de caballeria." },
      { year: 1656, event: "La division de Czarniecki encontro y vencio al destacamento sueco cerca de Lowicz." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio", "Batalla de Varsovia (1656)"],
    sourceDispute: true,
    curationNote: "La historiografia repite cifras muy distintas para los contingentes y las bajas de Lowicz. Se conserva el resultado respaldado por el Museo del Ejercito Polaco sin presentar esos recuentos como datos cerrados."
  }),
  "Batalla de Nisko (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campana de Leopolis y retirada sueca de 1656",
    region: "Nisko y Raclawice, ribera del rio San, actual Polonia",
    hierarchySources: [SOURCES.niskoMunicipality, SOURCES.niskoMilitaryLibrary],
    startYear: 1656,
    type: "ataque a campamento",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Ejercito sueco de Carlos X Gustavo", members: ["Imperio sueco"] }
    ],
    cause: "Durante la retirada sueca desde Jaroslaw hacia Sandomierz, Stefan Czarniecki intento aprovechar la dispersion del campamento enemigo en busca de provisiones.",
    outcome: "El ataque polaco-lituano puso en peligro el campamento sueco, pero el regreso de su caballeria evito una derrota decisiva y obligo a Czarniecki a replegarse.",
    consequences: "El episodio mantuvo la presion sobre la retirada de Carlos X Gustavo y anticipaba el cerco operativo sueco junto al Vistula y el San.",
    chronology: [
      { year: 1656, event: "La retirada sueca desde Jaroslaw cruzo el entorno de Nisko en condiciones de agotamiento y escasez de suministros." },
      { year: 1656, event: "El 28 de marzo las fuerzas de Czarniecki asaltaron el campamento; la reaccion sueca impidio un desenlace concluyente." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio", "Batalla de Jaroslaw (1656)"],
    sourceDispute: true,
    curationNote: "Los relatos locales y las sintesis militares difieren al valorar el resultado y las bajas. La ficha presenta Nisko como un ataque que no destruyo al ejercito sueco y evita fijar cifras no consolidadas."
  }),
  "Batalla de Tykocin (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campana de Podlaquia de 1656",
    region: "Tykocin, valle del rio Narew, Podlaquia, actual Polonia",
    hierarchySources: [SOURCES.tykocinMunicipality, SOURCES.tykocinMazoviaStudy],
    startYear: 1656,
    type: "batalla de socorro",
    participants: [
      { side: "Fuerzas sueco-brandenburguesas y de Boguslaw Radziwill", members: ["Imperio sueco", "Brandeburgo-Prusia", "Fuerzas de Boguslaw Radziwill"] },
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] }
    ],
    cause: "El mando sueco ordeno socorrer Tykocin para impedir que el asedio polaco-lituano cortara la comunicacion con las posiciones suecas de Lituania y Livonia.",
    outcome: "La fuerza de socorro sueco-brandenburguesa sorprendio a los sitiadores polaco-lituanos, levanto el asedio y recupero la iniciativa local.",
    consequences: "El resultado restablecio temporalmente la comunicacion entre las posiciones suecas del centro de la Mancomunidad y el frente lituano-livonio.",
    chronology: [
      { year: 1656, event: "Las fuerzas de la Mancomunidad mantenian el cerco de la fortaleza de Tykocin, situada en una ruta estrategica hacia Lituania." },
      { year: 1656, event: "El 13 de julio la fuerza de Boguslaw Radziwill y Robert Douglas llego a Tykocin, sorprendio a los sitiadores y levanto el asedio." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "Esta ficha describe el combate de socorro de julio de 1656 y no el asalto polaco-lituano al castillo de enero de 1657. Mantiene a Boguslaw Radziwill como fuerza historica propia en vez de convertir esa lealtad cambiante en una categoria estatal contemporanea."
  })
};
