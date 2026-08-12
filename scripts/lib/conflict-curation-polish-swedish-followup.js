function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  kokenhausenPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: batalla de Kokenhausen de 1601",
    "https://muzeumwp.pl/timeline/bitwa-pod-kokenhausen/"
  ),
  kokenhausenEducation: source(
    "Plataforma Educativa Integrada de Polonia: guerra polaco-sueca y combate de Kokenhausen",
    "https://zpe.gov.pl/a/rzeczpospolita-wojuje/D10uujbva"
  ),
  oliwaNavyMuseum: source(
    "Museo de la Armada Polaca: batalla naval de Oliwa durante la guerra polaco-sueca",
    "https://muzeummw.pl/en/the-world-of-old-sailing-ships/"
  ),
  oliwaMaritimeMuseum: source(
    "Museo Maritimo Nacional de Gdansk: dominio del Baltico y batalla de Oliwa de 1627",
    "https://nmm.pl/2014/01/31/walka-o-dominacje-na-baltyku-w-xvii-wieku/"
  ),
  trzcianaPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: batalla de Trzciana de 1629",
    "https://muzeumwp.pl/timeline/bitwa-pod-trzciana/"
  ),
  trzcianaHistoryMuseum: source(
    "Museo de Historia de Polonia: contexto, resultado y tregua posterior de Trzciana",
    "https://muzhp.pl/kalendarium/bitwa-pod-trzciana"
  ),
  wojniczPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: batalla de Wojnicz de 1655",
    "https://muzeumwp.pl/timeline/bitwa-pod-wojniczem/"
  ),
  wojniczEducation: source(
    "Plataforma Educativa Integrada de Polonia: derrota polaca en Wojnicz durante el Diluvio",
    "https://zpe.gov.pl/a/rzeczpospolita-wojuje-xvi/xvii-w/D5K5GQMqQ"
  ),
  warkaPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: batalla de Warka de 1656",
    "https://muzeumwp.pl/timeline/bitwa-pod-warka/"
  ),
  warkaWilanowMuseum: source(
    "Museo del Palacio del Rey Juan III en Wilanow: participantes y resultado de Warka",
    "https://wilanow-palac.pl/sobiesciana/bitwa-pod-warka-sobiesciana"
  ),
  prostkiHistoryMuseum: source(
    "Museo de Historia de Polonia: batalla de Prostki de 1656",
    "https://muzhp.pl/kalendarium/bitwa-pod-prostkami"
  ),
  prostkiRegionalEncyclopedia: source(
    "Enciclopedia de Warmia y Mazuria: participantes, resultado y consecuencias de Prostki",
    "https://encyklopedia.warmia.mazury.pl/index.php/Bitwa_pod_Prostkami"
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
    curationBatch: "source-backed-polish-swedish-followup-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const POLISH_SWEDISH_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Kokenhausen": "Batalla de Kokenhausen (1601)",
  "Batalla de Oliwa": "Batalla naval de Oliwa (1627)",
  "Batalla de Trzciana": "Batalla de Trzciana (1629)",
  "Batalla de Wojnicz": "Batalla de Wojnicz (1655)",
  "Batalla de Warka": "Batalla de Warka (1656)",
  "Batalla de Prostken": "Batalla de Prostki (1656)"
};

export const POLISH_SWEDISH_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: [
    "Batalla de Kokenhausen (1601)",
    "Batalla naval de Oliwa (1627)",
    "Batalla de Trzciana (1629)",
    "Batalla de Wojnicz (1655)",
    "Batalla de Warka (1656)",
    "Batalla de Prostki (1656)"
  ]
};

export const POLISH_SWEDISH_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Kokenhausen (1601)": historicalFix({
    parent: "Guerra polaco-sueca de 1600-1611",
    campaign: "Campa\u00f1a de Livonia de 1601",
    region: "Kokenhausen, Livonia, actual Koknese (Letonia)",
    hierarchySources: [SOURCES.kokenhausenPolishArmyMuseum, SOURCES.kokenhausenEducation],
    startYear: 1601,
    type: "batalla de socorro",
    participants: [
      { side: "Ejercito de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Ejercito sueco", members: ["Reino de Suecia"] }
    ],
    cause: "Las fuerzas polaco-lituanas asediaban la guarnicion sueca de Kokenhausen cuando una fuerza de socorro sueca intento romper el cerco en Livonia.",
    outcome: "La Mancomunidad rechazo a la fuerza sueca de socorro y la fortaleza capituló poco despues.",
    consequences: "La victoria reforzo temporalmente la posicion polaco-lituana en Livonia, sin poner fin a la guerra contra Suecia.",
    chronology: [
      { year: 1601, event: "La Mancomunidad mantuvo el asedio de Kokenhausen, ocupado por una guarnicion sueca." },
      { year: 1601, event: "El rechazo de la fuerza de socorro sueca fue seguido por la capitulacion de la fortaleza." }
    ],
    treaties: [],
    curationNote: "La ficha nombra a la Mancomunidad Polaco-Lituana y no atribuye la batalla a Polonia o Letonia contemporaneas. La asociacion con Polonia es una entrada de exploracion historica, no una equivalencia juridica de Estados."
  }),
  "Batalla naval de Oliwa (1627)": historicalFix({
    parent: "Guerra polaco-sueca de 1626-1629",
    campaign: "Bloqueo sueco de Gdansk y operaciones navales de 1627",
    region: "Bah\u00eda de Gdansk, frente a Oliwa",
    hierarchySources: [SOURCES.oliwaNavyMuseum, SOURCES.oliwaMaritimeMuseum],
    startYear: 1627,
    type: "batalla naval",
    participants: [
      { side: "Armada de la Mancomunidad", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Escuadra sueca", members: ["Reino de Suecia"] }
    ],
    cause: "La escuadra sueca bloqueaba las rutas de Gdansk durante la guerra por Prusia Real y el control del Baltico.",
    outcome: "La armada de la Mancomunidad vencio a la escuadra sueca frente a Oliwa y desbarato el bloqueo inmediato de Gdansk.",
    consequences: "La accion se convirtio en el principal triunfo naval de la Mancomunidad, aunque no cambio por si sola el desenlace politico de la guerra de 1626-1629.",
    chronology: [
      { year: 1627, event: "Los buques de la Mancomunidad salieron de la zona de Wisłoujscie para enfrentar a la escuadra sueca frente a Oliwa." },
      { year: 1627, event: "La victoria naval permitio aliviar la presion inmediata sobre las rutas de Gdansk." }
    ],
    treaties: ["Tregua de Altmark (1629)"],
    curationNote: "Se usa la etiqueta naval y el ano para evitar homonimos. La fuente trata a la flota como fuerza de la Mancomunidad, sin proyectar la categoria de marina polaca moderna sobre 1627."
  }),
  "Batalla de Trzciana (1629)": historicalFix({
    parent: "Guerra polaco-sueca de 1626-1629",
    campaign: "Campa\u00f1a de Prusia Real de 1629",
    region: "Trzciana y Stuhm, Prusia Real, actual Polonia",
    hierarchySources: [SOURCES.trzcianaPolishArmyMuseum, SOURCES.trzcianaHistoryMuseum],
    startYear: 1629,
    type: "batalla campal",
    participants: [
      { side: "Fuerzas polaco-lituanas e imperiales", members: ["Mancomunidad Polaco-Lituana", "Fuerzas imperiales aliadas"] },
      { side: "Ejercito sueco", members: ["Reino de Suecia"] }
    ],
    cause: "Las fuerzas de la Mancomunidad persiguieron al ejercito de Gustavo II Adolfo que se retiraba hacia Malbork tras la campa\u00f1a de Prusia Real.",
    outcome: "La caballeria polaco-lituana e imperial vencio a los contingentes suecos; la infanteria sueca logro retirarse hacia posiciones fortificadas.",
    consequences: "La victoria obligo a Suecia a adoptar una posicion defensiva, pero la guerra termino poco despues con una tregua desfavorable para la Mancomunidad.",
    chronology: [
      { year: 1629, event: "Las fuerzas de Koniecpolski alcanzaron a la retaguardia sueca durante su retirada por Prusia Real." },
      { year: 1629, event: "La derrota de la caballeria sueca no impidio que parte de la infanteria se replegara hacia Malbork." }
    ],
    treaties: ["Tregua de Altmark (1629)"],
    sourceDispute: true,
    curationNote: "Las cronologias pueden indicar 25 o 27 de junio segun el calendario y la tradicion historiografica. Se registra el ano comun y se evita transformar la victoria tactica en una victoria estrategica de la guerra."
  }),
  "Batalla de Wojnicz (1655)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campa\u00f1a de Cracovia de 1655",
    region: "Wojnicz, Peque\u00f1a Polonia",
    hierarchySources: [SOURCES.wojniczPolishArmyMuseum, SOURCES.wojniczEducation],
    startYear: 1655,
    type: "batalla campal",
    participants: [
      { side: "Ejercito sueco", members: ["Imperio sueco"] },
      { side: "Ejercito de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] }
    ],
    cause: "Carlos X Gustavo busco dispersar al ejercito de la Mancomunidad que amenazaba las operaciones suecas contra Cracovia.",
    outcome: "Las fuerzas suecas derrotaron al ejercito de la Mancomunidad cerca de Wojnicz y conservaron la iniciativa en la campa\u00f1a de Cracovia.",
    consequences: "La derrota debilito la defensa de Cracovia y antecedio a cambios de lealtad de sectores del ejercito de la Mancomunidad durante la primera fase del Diluvio.",
    chronology: [
      { year: 1655, event: "El ejercito sueco avanzo desde el entorno de Cracovia para enfrentar a las fuerzas de la Mancomunidad en Wojnicz." },
      { year: 1655, event: "El exito sueco abrio el paso a nuevas operaciones y profundizo la crisis militar de la Mancomunidad." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "La fecha puede aparecer como 23 de septiembre en calendario juliano o 3 de octubre en calendario gregoriano. La ficha conserva 1655 y no usa cifras de bajas que las fuentes sinteticas no consolidan."
  }),
  "Batalla de Warka (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campa\u00f1a de Mazovia de 1656",
    region: "Warka y rio Pilica, Mazovia",
    hierarchySources: [SOURCES.warkaPolishArmyMuseum, SOURCES.warkaWilanowMuseum],
    startYear: 1656,
    type: "batalla campal",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Fuerzas suecas", members: ["Imperio sueco"] }
    ],
    cause: "Las fuerzas de Stefan Czarniecki y Jerzy Lubomirski persiguieron a un destacamento sueco que se retiraba hacia Varsovia durante la contraofensiva de la Mancomunidad.",
    outcome: "La Mancomunidad obtuvo una victoria sobre las fuerzas suecas en Warka y desorganizo su retirada hacia Varsovia.",
    consequences: "El resultado fortalecio la moral de la resistencia polaco-lituana y demostro que sus fuerzas podian derrotar a contingentes suecos en combate abierto.",
    chronology: [
      { year: 1656, event: "Las fuerzas de la Mancomunidad alcanzaron al destacamento sueco en la zona de Warka y del rio Pilica." },
      { year: 1656, event: "La derrota sueca obligo a los supervivientes a buscar refugio hacia Varsovia." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    curationNote: "La ficha conserva la identidad de la Mancomunidad y distingue la victoria local de Warka del desenlace prolongado de la Segunda Guerra Nordica. Las asociaciones actuales se usan solo para exploracion historica."
  }),
  "Batalla de Prostki (1656)": historicalFix({
    parent: "Segunda Guerra N\u00f3rdica",
    campaign: "Campa\u00f1a de Prusia Ducal de 1656",
    region: "Prostki, Prusia Ducal, actual Polonia",
    hierarchySources: [SOURCES.prostkiHistoryMuseum, SOURCES.prostkiRegionalEncyclopedia],
    startYear: 1656,
    type: "batalla campal",
    participants: [
      { side: "Fuerzas de la Mancomunidad y del Janato de Crimea", members: ["Mancomunidad Polaco-Lituana", "Janato de Crimea"] },
      { side: "Fuerzas sueco-brandenburguenses", members: ["Imperio sueco", "Brandeburgo-Prusia"] }
    ],
    cause: "La Mancomunidad envio fuerzas a Prusia Ducal para presionar a Federico Guillermo y quebrar su alianza con Suecia durante la Segunda Guerra Nordica.",
    outcome: "Las fuerzas de la Mancomunidad y del Janato de Crimea vencieron a la coalicion sueco-brandenburguesa y capturaron a Boguslaw Radziwill.",
    consequences: "La victoria debilito a los aliados de Suecia en el frente prusiano, aunque no logro por si sola alterar de inmediato la posicion politica del elector.",
    chronology: [
      { year: 1656, event: "Las fuerzas de Gosiewski y sus aliados crimeos avanzaron hacia Prostki durante la campa\u00f1a en Prusia Ducal." },
      { year: 1656, event: "La derrota de la coalicion sueco-brandenburguesa dejo prisionero a Boguslaw Radziwill." }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: ["El Diluvio"],
    sourceDispute: true,
    curationNote: "La documentacion discrepa sobre efectivos, bajas y algunos detalles de la secuencia. La ficha no presenta esas cifras como consolidadas y evita proyectar Alemania contemporanea sobre Brandeburgo-Prusia."
  })
};
