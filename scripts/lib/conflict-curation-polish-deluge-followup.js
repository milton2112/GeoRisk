function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  zarnowPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: batalla de Zarnow durante el Diluvio",
    "https://dev.muzeumwp.pl/timeline/bitwa-pod-zarnow/"
  ),
  zarnowLocalHistory: source(
    "Municipio de Zarnow: historia local y batalla de 1655",
    "https://www.zarnow.eu/zarnow_2022/web/uploads/pub/strony/strona_3360/text/Nicolaus%2022%2C%202023.pdf"
  ),
  krosnoPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: batalla de Krosno de 1655",
    "https://muzeumwp.pl/timeline/triumf-wiernosci-polacy-pod-dowodztwem-wojnillowicza-pokonuja-szwedow-w-bitwie-pod-krosnem/"
  ),
  krosnoRegionalCulture: source(
    "Etnocentrum de Krosno: contexto y resultado de la batalla de 1655",
    "https://www.etnocentrum.pl/pl/legenda-2"
  ),
  jaroslawMuseum: source(
    "Museo de Jaroslaw: combate con los suecos del 15 de marzo de 1656",
    "https://www.muzeum-jaroslaw.pl/szwedzi-pod-jaroslawiem-15-marca-1656-roku/"
  ),
  jaroslawMilitaryLibrary: source(
    "Biblioteca Militar Central de Polonia: estudio historico sobre Jaroslaw de 1656",
    "https://zbrojownia.cbw.wp.mil.pl/Content/13650/01127_INW_1252_1937_NR_12.pdf"
  ),
  kozieniceMuseum: source(
    "Museo Regional de Kozienice: batalla de Kozienice y Warka de 1656",
    "https://www.muzeum-kozienice.pl/aktualnosci/bitwa-pod-kozienicami-i-warka-xxxzlota-zbrojaxxx-z-kozienickiego-jeziora-xxx-prawda-czy-mitx-x-11-kwietnia-2026-x-zaproszenie%2C238.html"
  ),
  kozieniceLocalGuide: source(
    "Municipio de Kozienice: guia historica de los combates de 1656",
    "https://kozienice.pl/files/image/Ksi%C4%85%C5%BCka_Szlak_bitew_Krzysztofa_Zaj%C4%85ca.pdf"
  ),
  kcyniaNationalArchives: source(
    "Archivos Nacionales de Polonia: historia de Kcynia y batalla contra Suecia de 1656",
    "https://www.szukajwarchiwach.gov.pl/zespol/-/zespol/144629"
  ),
  kcyniaRegionalHistory: source(
    "Club de Exploradores de Historia Regional: batalla de Kcynia de 1656",
    "https://kohr.kujawsko-pomorskie.pl/386%2Cbitwa-pod-kcynia-1656r"
  ),
  lubrzeDigitalLibrary: source(
    "Biblioteca Digital de Wielkopolska: material historico sobre la batalla de Lubrze",
    "https://www.wbc.poznan.pl/Content/276388/PDF/Segregator6.pdf"
  ),
  lubrzeHistoryReference: source(
    "TwojaHistoria: sintesis historica de la batalla de Lubrze de 1656",
    "https://twojahistoria.pl/encyklopedia/leksykon-bitew/bitwa-pod-lubczem-28-sierpnia-1656/"
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
    curationBatch: "source-backed-polish-deluge-followup-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const POLISH_DELUGE_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de \u017barn\u00f3w": "Batalla de \u017barn\u00f3w (1655)",
  "Batalla de Krosno": "Batalla de Krosno (1655)",
  "Batalla de Jaroslaw": "Batalla de Jaroslaw (1656)",
  "Batalla de Kozienice": "Batalla de Kozienice (1656)",
  "Batalla de Kcynia": "Batalla de Kcynia (1656)",
  "Batalla de Lubrze": "Batalla de Lubrze (1656)"
};

export const POLISH_DELUGE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: [
    "Batalla de \u017barn\u00f3w (1655)",
    "Batalla de Krosno (1655)",
    "Batalla de Jaroslaw (1656)",
    "Batalla de Kozienice (1656)",
    "Batalla de Kcynia (1656)",
    "Batalla de Lubrze (1656)"
  ]
};

export const POLISH_DELUGE_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de \u017barn\u00f3w (1655)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campa\u00f1a de Peque\u00f1a Polonia de 1655",
    region: "\u017barn\u00f3w, Peque\u00f1a Polonia, actual Polonia",
    hierarchySources: [SOURCES.zarnowPolishArmyMuseum, SOURCES.zarnowLocalHistory],
    startYear: 1655,
    type: "batalla campal",
    participants: [
      { side: "Ejercito sueco", members: ["Imperio sueco"] },
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] }
    ],
    cause: "Carlos X Gustavo persiguio a las fuerzas de Juan II Casimiro para consolidar la invasion sueca de la Mancomunidad en Peque\u00f1a Polonia.",
    outcome: "El ejercito sueco derroto a las fuerzas de la Mancomunidad en Zarnow y mantuvo la iniciativa en la campa\u00f1a de 1655.",
    consequences: "La derrota abrio nuevas rutas hacia Peque\u00f1a Polonia y acelero la retirada de Juan II Casimiro, sin resolver por si sola la guerra prolongada.",
    chronology: [
      { year: 1655, event: "Las fuerzas leales a Juan II Casimiro concentraron tropas ante el avance sueco desde Varsovia hacia el sur." },
      { year: 1655, event: "La victoria sueca en Zarnow disperso parte de las fuerzas polaco-lituanas y permitio continuar la campa\u00f1a." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "Las fuentes usan recuentos de tropas y bajas distintos. La ficha registra el resultado y sus efectos regionales sin presentar cifras de bajas como consolidadas ni equiparar a los beligerantes historicos con Estados contemporaneos."
  }),
  "Batalla de Krosno (1655)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Resistencia de Peque\u00f1a Polonia de 1655",
    region: "Krosno, Peque\u00f1a Polonia, actual Polonia",
    hierarchySources: [SOURCES.krosnoPolishArmyMuseum, SOURCES.krosnoRegionalCulture],
    startYear: 1655,
    type: "combate urbano",
    participants: [
      { side: "Fuerzas leales a Juan II Casimiro", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Partidarios de Carlos X Gustavo con unidades suecas", members: ["Imperio sueco", "Facciones locales pro-suecas"] }
    ],
    cause: "Una fuerza fiel a Juan II Casimiro busco recuperar Krosno de los grupos que colaboraban con el bando sueco tras la invasion de 1655.",
    outcome: "Las fuerzas leales a la Mancomunidad vencieron en Krosno a los partidarios pro-suecos apoyados por unidades suecas.",
    consequences: "La recuperacion local reforzo la resistencia al avance sueco en Peque\u00f1a Polonia y contribuyo al reagrupamiento de fuerzas fieles a Juan II Casimiro.",
    chronology: [
      { year: 1655, event: "La ocupacion y las colaboraciones locales con el bando sueco generaron una respuesta de fuerzas leales a Juan II Casimiro." },
      { year: 1655, event: "El triunfo de Gabriel Wojni\u0142\u0142owicz permitio recuperar Krosno y sancionar a colaboradores documentados por las fuentes locales." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "El combate incluye lealtades locales y unidades suecas de apoyo; la ficha no convierte la resistencia local en un Estado contemporaneo ni presenta el episodio como una derrota general del ejercito sueco."
  }),
  "Batalla de Jaroslaw (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campa\u00f1a de Leopolis y retirada sueca de 1656",
    region: "Jaros\u0142aw, ribera oriental del rio San, actual Polonia",
    hierarchySources: [SOURCES.jaroslawMuseum, SOURCES.jaroslawMilitaryLibrary],
    startYear: 1656,
    type: "combate de retirada",
    participants: [
      { side: "Fuerzas de la Mancomunidad y resistencia local", members: ["Mancomunidad Polaco-Lituana", "Fuerzas locales de resistencia"] },
      { side: "Ejercito sueco en retirada", members: ["Imperio sueco"] }
    ],
    cause: "La columna sueca de Carlos X Gustavo regresaba desde la zona de Leopolis tras una campa\u00f1a fallida contra Juan II Casimiro, mientras las fuerzas locales y polaco-lituanas hostigaban su retirada.",
    outcome: "Las fuerzas de resistencia y de la Mancomunidad infligieron un reves local a la retaguardia sueca cerca de Jaroslaw, sin destruir la fuerza principal de Carlos X Gustavo.",
    consequences: "El combate confirmo la presion creciente sobre las columnas suecas y ayudo a modificar el equilibrio local de fuerzas durante la contraofensiva de 1656.",
    chronology: [
      { year: 1656, event: "La retirada sueca desde la zona de Leopolis cruzo el entorno de Jaroslaw bajo hostigamiento de fuerzas polaco-lituanas y locales." },
      { year: 1656, event: "El combate del 15 de marzo debilito la retaguardia sueca mientras la fuerza principal continuaba su movimiento hacia el San." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "Las cronicas difieren en la organizacion, el tamano y las bajas de los grupos participantes. Se conserva el exito local sin transformar una accion de hostigamiento en una destruccion verificable de todo el ejercito sueco."
  }),
  "Batalla de Kozienice (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campa\u00f1a de Mazovia de 1656",
    region: "Kozienice, Peque\u00f1a Polonia historica, actual voivodato de Mazovia, Polonia",
    hierarchySources: [SOURCES.kozieniceMuseum, SOURCES.kozieniceLocalGuide],
    startYear: 1656,
    type: "combate de retaguardia",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Retaguardia sueca", members: ["Imperio sueco"] }
    ],
    cause: "Stefan Czarniecki persiguio a la retaguardia de una fuerza sueca que se retiraba hacia Warka durante la campa\u00f1a de primavera de 1656.",
    outcome: "Las fuerzas de la Mancomunidad vencieron a la retaguardia sueca cerca de Kozienice y aceleraron su retirada hacia Warka.",
    consequences: "El combate fue el preludio inmediato de Warka y fortalecio la moral de la contraofensiva polaco-lituana, sin duplicar ni sustituir la batalla del dia siguiente.",
    chronology: [
      { year: 1656, event: "Czarniecki alcanzo a la retaguardia sueca cerca de Kozienice durante la retirada hacia el rio Pilica." },
      { year: 1656, event: "La derrota de la retaguardia llevo a los suecos a apresurar el movimiento nocturno hacia Warka." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio", "Batalla de Warka (1656)"],
    curationNote: "Kozienice se registra como combate propio y como preludio de Warka. Las fuentes locales conservan cifras diferentes para la retaguardia, por lo que la ficha evita fijar bajas no consolidadas."
  }),
  "Batalla de Kcynia (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campa\u00f1a de Gran Polonia de 1656",
    region: "Kcynia, Gran Polonia, actual Polonia",
    hierarchySources: [SOURCES.kcyniaNationalArchives, SOURCES.kcyniaRegionalHistory],
    startYear: 1656,
    type: "ataque sorpresa",
    participants: [
      { side: "Ejercito sueco", members: ["Imperio sueco"] },
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] }
    ],
    cause: "Carlos X Gustavo reacciono a las operaciones de Stefan Czarniecki en Gran Polonia y cruzo el Note\u0107 para atacar el campamento polaco-lituano cerca de Kcynia.",
    outcome: "El ataque sueco sorprendio y derroto al campamento de la Mancomunidad, obligando a Czarniecki a abandonar su plan inmediato en Prusia Real.",
    consequences: "La victoria sueca altero temporalmente las operaciones de Czarniecki, pero no detuvo la resistencia polaco-lituana ni decidio el desenlace de la guerra.",
    chronology: [
      { year: 1656, event: "Las operaciones de Czarniecki en Gran Polonia inquietaron al mando sueco y motivaron una marcha desde el frente de Gdansk." },
      { year: 1656, event: "El 1 de junio las fuerzas suecas sorprendieron al campamento disperso de la Mancomunidad cerca de Kcynia." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "Las fuentes no consolidan del mismo modo el numero de bajas y prisioneros. Se preserva la victoria sueca y la sorpresa operativa sin convertir cifras parciales en un balance definitivo."
  }),
  "Batalla de Lubrze (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campa\u00f1a de Gran Polonia de 1656",
    region: "Lubrze, cerca de \u015arem y \u015aroda Wielkopolska, Gran Polonia, actual Polonia",
    hierarchySources: [SOURCES.lubrzeDigitalLibrary, SOURCES.lubrzeHistoryReference],
    startYear: 1656,
    type: "ataque nocturno",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Destacamento sueco-brandenburgues", members: ["Imperio sueco", "Brandeburgo-Prusia"] }
    ],
    cause: "Una fuerza polaco-lituana intento impedir que un destacamento sueco-brandenburgues reforzara las posiciones aliadas en Gran Polonia.",
    outcome: "Un ataque nocturno de las fuerzas de la Mancomunidad vencio al destacamento sueco-brandenburgues en Lubrze.",
    consequences: "El reves local dificulto el socorro de las posiciones sueco-brandenburguesas y reforzo la recuperacion polaco-lituana en Gran Polonia.",
    chronology: [
      { year: 1656, event: "El destacamento sueco-brandenburgues se concentro cerca de Lubrze mientras buscaba apoyar operaciones en Gran Polonia." },
      { year: 1656, event: "Las fuerzas de la Mancomunidad realizaron un ataque nocturno que disperso al destacamento enemigo." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "Las fuentes usan denominaciones locales y cifras distintas para el destacamento y sus bajas. La ficha no presenta esas cifras como consolidadas y evita proyectar Alemania contemporanea sobre Brandeburgo-Prusia."
  })
};
