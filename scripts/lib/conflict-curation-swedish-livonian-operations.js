function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  karksiHistory: source(
    "TwojaHistoria: batalla de Karkhus del 29 de octubre de 1600",
    "https://twojahistoria.pl/encyklopedia/leksykon-bitew/bitwa-pod-karkhus-29-pazdziernika-1600/"
  ),
  karksiPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: ofensiva sueca de 1600 y campana de Fellin",
    "https://muzeumwp.pl/timeline/zdobycie-fellina/"
  ),
  daugavaAcademic: source(
    "Textus et Studia: el Daugava como frontera y las batallas de 1609",
    "https://czasopisma.upjp2.edu.pl/textusetstudia/article/download/4360/4242/6823"
  ),
  daugavgrivaMilitaryHistory: source(
    "Guia de historia militar de Estonia: operaciones de Daugavgriva de 1609",
    "https://teejuht.esap.ee/eesti-ringreis/luhike-eesti-sojaajalugu-muinasajast-kuni-xx-sajandi-lopuni-1-osa/"
  ),
  weissensteinPolishArmyMuseum: source(
    "Museo del Ejercito Polaco: batalla de Bialy Kamien y socorro de Chodkiewicz",
    "https://muzeumwp.pl/timeline/bitwa-pod-bialym-kamieniem-rozbicie-armii-szwedzkiej-dowodzonej-przez-arvida-st229larma-ktora-oblegala-bialy-kamien-z-odsiecza-przybyl-jan-karol-chodkiewicz/"
  ),
  weissensteinHistory: source(
    "TwojaHistoria: batalla de Bialy Kamien o Paide del 25 de septiembre de 1604",
    "https://twojahistoria.pl/encyklopedia/leksykon-bitew/bitwa-pod-bialym-kamieniem-25-wrzesnia-1604/"
  ),
  revalEducation: source(
    "Plataforma Educativa Integrada de Polonia: batalla de Reval de 1602",
    "https://zpe.gov.pl/a/rzeczpospolita-wojuje-xvi/xvii-w/D5K5GQMqQ"
  ),
  revalAcademic: source(
    "Estudio academico sobre Stanislaw Zolkiewski y la batalla de Reval de 1602",
    "https://portal.amelica.org/ameli/journal/463/4632029014/4632029014.pdf"
  ),
  kroppenhofStAndrews: source(
    "Universidad de St Andrews: Andrew Keith y la batalla de Kropimojza o Kroppenhof",
    "https://www.st-andrews.ac.uk/history/ssne/item.php?id=6533"
  ),
  kroppenhofUmea: source(
    "Universidad de Umea, colecciones digitales: Sveriges krig 1611-1632, campanas de Livonia",
    "https://digital.ub.umu.se/relation/1154848"
  ),
  wallhofEncyclopedia: source(
    "Nationalencyklopedin de Suecia: Wallhof y la victoria de Gustavo II Adolfo",
    "https://www.ne.se/uppslagsverk/encyklopedi/l%C3%A5ng/wallhof"
  ),
  wallhofUniversity: source(
    "Repositorio de la Universidad Cardenal Stefan Wyszynski: Wallhof de 1626",
    "https://bazawiedzy.uksw.edu.pl/seam/resource/rest/download/UKSW5ed88b76ff3b4721ae13030224b1380f"
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
    curationBatch: "source-backed-swedish-livonian-operations-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const SWEDISH_LIVONIAN_OPERATIONS_SAFE_CONFLICT_RENAMES = {
  "Batalla de Karksi": "Batalla de Karksi (1600)",
  "Batalla de Daugavgriva": "Batalla de Daugavgriva (1609)",
  "Batalla de Weissenstein": "Batalla de Weissenstein (1604)",
  "Batalla de Reval": "Batalla de Reval (1602)",
  "Batalla de Kroppenhof": "Batalla de Kroppenhof (1621)",
  "Batalla de Wallhof": "Batalla de Wallhof (1626)"
};

export const SWEDISH_LIVONIAN_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: [
    "Batalla de Karksi (1600)",
    "Batalla de Daugavgriva (1609)",
    "Batalla de Weissenstein (1604)",
    "Batalla de Reval (1602)",
    "Batalla de Kroppenhof (1621)",
    "Batalla de Wallhof (1626)"
  ]
};

export const SWEDISH_LIVONIAN_OPERATIONS_CONFLICT_DETAIL_FIXES = {
  "Batalla de Karksi (1600)": historicalFix({
    parent: "Guerra polaco-sueca de 1600-1611",
    campaign: "Ofensiva sueca en Livonia de 1600",
    region: "Karksi, Livonia historica, actual Estonia",
    hierarchySources: [SOURCES.karksiHistory, SOURCES.karksiPolishArmyMuseum],
    startYear: 1600,
    type: "combate de maniobra",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Destacamento sueco", members: ["Reino de Suecia"] }
    ],
    cause: "Durante la ofensiva sueca en Livonia, una fuerza de Carl Gyllenhielm se dirigio hacia Karksi tras las operaciones contra Fellin.",
    outcome: "El destacamento sueco fue atacado por las fuerzas de Jerzy Farensbach en su retirada y sufrio un reves tactico.",
    consequences: "La accion freno localmente la maniobra sueca, pero no revirtio por si sola la ofensiva de 1600 ni resolvio la disputa por Livonia.",
    chronology: [
      { year: 1600, event: "La ofensiva sueca tomo varias fortalezas de Livonia y desplazo un destacamento hacia Karksi." },
      { year: 1600, event: "Las fuerzas de Farensbach atacaron al destacamento sueco cuando regresaba de la zona de Karksi." }
    ],
    treaties: ["Tregua polaco-sueca de 1611"],
    sourceDispute: true,
    curationNote: "Karksi aparece tambien como Karkhus o Karkus en las fuentes. La accion nocturna puede fecharse segun distintos cortes entre el 29 y el 30 de octubre; la ficha conserva solo 1600 y no consolida efectivos ni bajas."
  }),
  "Batalla de Daugavgriva (1609)": historicalFix({
    parent: "Guerra polaco-sueca de 1600-1611",
    campaign: "Operaciones del Daugava de 1609",
    region: "Fortaleza de Daugavgriva o Dunamunde, desembocadura del Daugava, Livonia, actual Letonia",
    hierarchySources: [SOURCES.daugavaAcademic, SOURCES.daugavgrivaMilitaryHistory],
    startYear: 1609,
    type: "emboscada",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Fuerza sueca de socorro", members: ["Reino de Suecia"] }
    ],
    cause: "Las fuerzas de Jan Karol Chodkiewicz buscaban aislar Daugavgriva mientras un contingente sueco trataba de auxiliar a la guarnicion.",
    outcome: "La fuerza de socorro sueca fue derrotada en las operaciones del entorno y Daugavgriva quedo de nuevo bajo control de la Mancomunidad.",
    consequences: "El resultado reforzo temporalmente la posicion polaco-lituana en la desembocadura del Daugava, sin poner fin a la guerra de 1600-1611.",
    chronology: [
      { year: 1609, event: "Las operaciones por Pernau y la desembocadura del Daugava enfrentaron a Chodkiewicz con las fuerzas suecas de socorro." },
      { year: 1609, event: "La derrota sueca en el entorno de Daugavgriva permitio recuperar la fortaleza para la Mancomunidad." }
    ],
    treaties: ["Tregua polaco-sueca de 1611"],
    sourceDispute: true,
    curationNote: "Daugavgriva tambien aparece como Dunamunde y las sintesis pueden expresar la jornada con fechas distintas por calendarios y conversiones. La ficha conserva el ano, el teatro y el resultado general sin fijar cifras discutidas."
  }),
  "Batalla de Weissenstein (1604)": historicalFix({
    parent: "Guerra polaco-sueca de 1600-1611",
    campaign: "Campana de Estonia de 1604",
    region: "Weissenstein o Bialy Kamien, actual Paide, Estonia",
    hierarchySources: [SOURCES.weissensteinPolishArmyMuseum, SOURCES.weissensteinHistory],
    startYear: 1604,
    type: "batalla de socorro",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Ejercito sueco sitiador", members: ["Reino de Suecia"] }
    ],
    cause: "Un ejercito sueco al mando de Arvid Stalarn asediaba la fortaleza de Weissenstein cuando Jan Karol Chodkiewicz acudio con una fuerza de socorro.",
    outcome: "La fuerza de socorro polaco-lituana rompio el asedio y derroto al ejercito sueco en las cercanias de la fortaleza.",
    consequences: "La victoria sostuvo la defensa de la Mancomunidad en Estonia y consolido el prestigio de Chodkiewicz antes de Kircholm.",
    chronology: [
      { year: 1604, event: "El ejercito sueco inicio el asedio de Weissenstein durante la campana estonia." },
      { year: 1604, event: "Chodkiewicz llego con fuerzas de socorro y desbarato el cerco sueco." }
    ],
    treaties: ["Tregua polaco-sueca de 1611"],
    sourceDispute: true,
    curationNote: "Weissenstein se conoce tambien como Bialy Kamien o Paide. Las fuentes difieren en los efectivos y las bajas; la ficha registra la fecha de 1604 y el resultado del socorro sin convertir esos recuentos en cifras cerradas."
  }),
  "Batalla de Reval (1602)": historicalFix({
    parent: "Guerra polaco-sueca de 1600-1611",
    campaign: "Campana de Livonia de 1602",
    region: "Reval, actual Tallinn, Estonia",
    hierarchySources: [SOURCES.revalEducation, SOURCES.revalAcademic],
    startYear: 1602,
    type: "batalla de caballeria",
    participants: [
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Fuerzas suecas", members: ["Reino de Suecia"] }
    ],
    cause: "Stanisaw Zolkiewski marcho contra las fuerzas suecas que se concentraban cerca de Reval durante la guerra por Livonia.",
    outcome: "Las fuerzas de la Mancomunidad derrotaron a las tropas suecas tras combinar cargas de caballeria y una maniobra sobre sus posiciones.",
    consequences: "La victoria redujo la presion sueca cerca de Reval, aunque la disputa por Livonia continuo durante la decada.",
    chronology: [
      { year: 1602, event: "Zolkiewski avanzo contra las fuerzas suecas reunidas cerca de Reval." },
      { year: 1602, event: "La maniobra de la caballeria de la Mancomunidad desorganizo la posicion sueca y decidio el combate." }
    ],
    treaties: ["Tregua polaco-sueca de 1611"],
    curationNote: "Esta ficha corresponde al combate terrestre de Reval de 1602 y no a la batalla naval ruso-sueca de 1790. Mantiene la denominacion historica de la Mancomunidad y evita atribuir el enfrentamiento a Estados contemporaneos."
  }),
  "Batalla de Kroppenhof (1621)": historicalFix({
    parent: "Guerra polaco-sueca de 1621-1625",
    campaign: "Campana de Livonia de 1621",
    region: "Kroppenhof o Kropimojza, Livonia central, actual Letonia",
    hierarchySources: [SOURCES.kroppenhofStAndrews, SOURCES.kroppenhofUmea],
    startYear: 1621,
    type: "ataque a campamento",
    participants: [
      { side: "Fuerzas lituanas de la Mancomunidad", members: ["Mancomunidad Polaco-Lituana"] },
      { side: "Fuerzas suecas", members: ["Imperio sueco"] }
    ],
    cause: "Las fuerzas de Krzysztof Radziwill operaban en Livonia frente al avance sueco y buscaron golpear un contingente sueco en Kroppenhof.",
    outcome: "Las fuerzas lituanas de la Mancomunidad vencieron al contingente sueco en el combate de Kroppenhof.",
    consequences: "La accion mostro que la Mancomunidad aun podia disputar las operaciones locales de Livonia, pese a la presion sueca sobre plazas y rutas del teatro.",
    chronology: [
      { year: 1621, event: "Unidades de la Mancomunidad se concentraron en Livonia bajo el mando de Krzysztof Radziwill frente a la ofensiva sueca." },
      { year: 1621, event: "El contingente de Andrew Keith participo en el combate de Kroppenhof del 28 de noviembre." }
    ],
    treaties: ["Tregua de Mitau (1622)"],
    sourceDispute: true,
    curationNote: "Kroppenhof aparece tambien como Kropimojza. La evidencia universitaria confirma la fecha y el teatro, mientras las sintesis discrepan en fuerzas y bajas; la ficha no trata esos recuentos como datos consolidados."
  }),
  "Batalla de Wallhof (1626)": historicalFix({
    parent: "Guerra polaco-sueca de 1626-1629",
    campaign: "Campana de Curlandia de 1625-1626",
    region: "Wallhof o Valle, Curlandia, actual Letonia",
    hierarchySources: [SOURCES.wallhofEncyclopedia, SOURCES.wallhofUniversity],
    startYear: 1626,
    type: "emboscada",
    participants: [
      { side: "Ejercito sueco", members: ["Imperio sueco"] },
      { side: "Fuerzas de la Mancomunidad Polaco-Lituana", members: ["Mancomunidad Polaco-Lituana"] }
    ],
    cause: "Gustavo II Adolfo saco fuerzas de sus cuarteles de invierno para sorprender a las tropas de Jan Stanislaw Sapieha en Curlandia.",
    outcome: "El ejercito sueco derroto a las fuerzas de la Mancomunidad en Wallhof y obtuvo una ventaja operacional en el frente de Curlandia.",
    consequences: "La derrota debilito la posicion de Sapieha y antecedio a la expansion de las operaciones suecas hacia Prusia y el Baltico meridional.",
    chronology: [
      { year: 1626, event: "Las fuerzas suecas cruzaron el Daugava desde sus cuarteles de invierno para buscar a las tropas de Sapieha." },
      { year: 1626, event: "El ataque sorpresa sueco en Wallhof derroto al contingente de la Mancomunidad." }
    ],
    treaties: ["Tregua de Altmark (1629)"],
    sourceDispute: true,
    curationNote: "Wallhof tambien aparece como Walmojza. Las fuentes suecas pueden datarlo el 7 de enero y otras sintesis el 17 de enero segun el calendario usado; la ficha conserva solo 1626 y no consolida cifras de fuerzas o bajas."
  })
};
