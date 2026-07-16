function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  campaigns1592: source(
    "Instituto Nacional de Historia de Corea: campañas navales de Yi Sun-sin en 1592",
    "https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_30&levelId=kc_i306000"
  ),
  imjinOverview: source(
    "Enciclopedia de la Cultura Coreana: invasiones japonesas y operaciones navales de 1592",
    "https://encykorea.aks.ac.kr/Article/E0047674"
  ),
  hwajungumi: source(
    "Korean Citation Index: estudio de la ubicación de Hwajungumi en los diarios y partes de Yi Sun-sin",
    "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002876356"
  ),
  myeongnyang: source(
    "Instituto Nacional de Historia de Corea: reconstrucción de Eoranpo y Myeongnyang",
    "https://contents.history.go.kr/front/kc/printViewPopup.do?levelId=kc_i302300"
  ),
  jeolido: source(
    "Korea Society for Naval Science and Technology: estudio táctico de la batalla de Jeolido",
    "https://journal.knst.kr/xml/25965/25965.pdf"
  ),
  finalCampaign: source(
    "Instituto Nacional de Historia de Corea: segunda invasión, Noryang y retirada japonesa",
    "https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_30&levelId=kc_i305620"
  ),
  nanjungIlgi: source(
    "UNESCO Memoria del Mundo: expediente internacional del Nanjung Ilgi",
    "https://media.unesco.org/sites/default/files/webform/mow001/republic_of_korea_nanjung_ilgi.pdf"
  )
};

const WAR = "Invasiones japonesas de Corea (1592-1598)";

function navalFix({
  campaign,
  region,
  hierarchySources,
  startYear,
  participants,
  cause,
  outcome,
  consequences,
  chronology,
  type = "batalla naval",
  scale = "regional",
  treaties = [],
  related = [],
  curationNote,
  sourceDispute = false
}) {
  const sources = Array.isArray(hierarchySources) ? hierarchySources : [hierarchySources];
  const confidence = sources.some(item => item.confidence === "media") ? "media" : "alta";

  return {
    parent: WAR,
    war: WAR,
    campaign,
    type,
    conflictType: "interestatal",
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
    chronology: chronology || [{ year: startYear, event: outcome }],
    treaties,
    related: [...new Set([WAR, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: confidence,
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-japan-korea-naval-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    ...(curationNote ? { curationNote } : {}),
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

const JOSEON_AND_JAPAN = [
  { side: "Armada del reino de Joseon", members: ["Reino de Joseon"] },
  { side: "Fuerzas navales japonesas", members: ["Japón"] }
];

export const JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Happo": "Acción naval de Happo (1592)",
  "Batalla de Jeokjinpo": "Ataque al fondeadero de Jeokjinpo (1592)",
  "Batalla de Sacheon": "Batalla naval de Sacheon (1592)",
  "Batalla de Dangpo": "Batalla naval de Dangpo (1592)",
  "Batalla de Danghangpo": "Primera batalla naval de Danghangpo (1592)",
  "Batalla de Yulpo": "Batalla naval de Yulpo (1592)",
  "Batalla de Hwajungumi": "Acción naval de Hwajungumi (1592)",
  "Batalla de Busan": "Batalla naval de Busan (1592)",
  "Batalla de Eoranpo": "Escaramuza naval de Eoranpo (1597)",
  "Batalla de Myeongnyang": "Batalla naval de Myeongnyang (1597)",
  "Batalla de Jeolido": "Batalla naval de Jeolido (1598)",
  "Batalla de Noryang": "Batalla naval de Noryang (1598)"
};

const KOREAN_PROFILE_ACTIONS = [
  "Acción naval de Happo (1592)",
  "Ataque al fondeadero de Jeokjinpo (1592)",
  "Batalla naval de Sacheon (1592)",
  "Batalla naval de Dangpo (1592)",
  "Primera batalla naval de Danghangpo (1592)",
  "Batalla naval de Yulpo (1592)",
  "Acción naval de Hwajungumi (1592)",
  "Batalla naval de Busan (1592)",
  "Escaramuza naval de Eoranpo (1597)",
  "Batalla naval de Myeongnyang (1597)",
  "Batalla naval de Jeolido (1598)",
  "Batalla naval de Noryang (1598)"
];

export const JAPAN_KOREA_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  "Corea del Sur": KOREAN_PROFILE_ACTIONS,
  "República Popular China": ["Batalla naval de Noryang (1598)"]
};

export const JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Acción naval de Happo (1592)": navalFix({
    campaign: "Primera campaña naval de Yi Sun-sin de 1592",
    region: "Puerto de Happo, actual Changwon, Corea del Sur",
    hierarchySources: [SOURCES.campaigns1592, SOURCES.nanjungIlgi],
    startYear: 1592,
    type: "acción naval",
    participants: JOSEON_AND_JAPAN,
    cause: "Tras la victoria de Okpo, la flota de Joseon persiguió cinco buques japoneses avistados rumbo a Happo para limitar el movimiento naval de la invasión.",
    outcome: "Las tripulaciones japonesas abandonaron los buques y desembarcaron; la flota de Joseon destruyó las naves sin librar una batalla naval prolongada.",
    consequences: "La acción prolongó la primera salida de Yi Sun-sin y precedió al ataque de Jeokjinpo del día siguiente.",
    curationNote: "Se reemplaza la etiqueta genérica de batalla porque la síntesis oficial describe una persecución seguida por la destrucción de buques abandonados. Las fechas diarias de las fuentes coreanas usan calendario lunisolar."
  }),
  "Ataque al fondeadero de Jeokjinpo (1592)": navalFix({
    campaign: "Primera campaña naval de Yi Sun-sin de 1592",
    region: "Jeokjinpo, costa de Goseong y Tongyeong, Corea del Sur",
    hierarchySources: [SOURCES.campaigns1592, SOURCES.nanjungIlgi],
    startYear: 1592,
    type: "ataque a fondeadero",
    participants: JOSEON_AND_JAPAN,
    cause: "Un informe local señaló que una flotilla japonesa estaba fondeada en Jeokjinpo después de las acciones de Okpo y Happo.",
    outcome: "La flota de Joseon atacó los buques mientras gran parte de sus tripulaciones estaba en tierra y destruyó la flotilla fondeada.",
    consequences: "El ataque cerró la primera campaña naval de 1592 y confirmó la vulnerabilidad de los transportes japoneses estacionados en la costa.",
    sourceDispute: true,
    curationNote: "Las síntesis modernas difieren entre once y trece buques destruidos. La ficha conserva el resultado general y evita fijar como definitiva una cifra discutida."
  }),
  "Batalla naval de Sacheon (1592)": navalFix({
    campaign: "Segunda campaña naval de Yi Sun-sin de 1592",
    region: "Bahía de Sacheon, actual Gyeongsang del Sur, Corea del Sur",
    hierarchySources: [SOURCES.campaigns1592, SOURCES.imjinOverview, SOURCES.nanjungIlgi],
    startYear: 1592,
    participants: JOSEON_AND_JAPAN,
    cause: "La flota de Joseon salió a interceptar buques japoneses concentrados cerca de Sacheon y a proteger las rutas marítimas de Jeolla.",
    outcome: "Yi Sun-sin atrajo a los buques hacia aguas abiertas y los derrotó mediante artillería; la fuente oficial identifica esta acción con el primer empleo en combate del buque tortuga.",
    consequences: "La victoria abrió la segunda campaña naval y aumentó la presión sobre el abastecimiento japonés en la costa meridional.",
    curationNote: "El año y la identidad naval se añaden para distinguir esta acción de la batalla terrestre de Sacheon de 1598."
  }),
  "Batalla naval de Dangpo (1592)": navalFix({
    campaign: "Segunda campaña naval de Yi Sun-sin de 1592",
    region: "Puerto de Dangpo, actual Tongyeong, Corea del Sur",
    hierarchySources: [SOURCES.campaigns1592, SOURCES.imjinOverview, SOURCES.nanjungIlgi],
    startYear: 1592,
    participants: JOSEON_AND_JAPAN,
    cause: "La flota de Joseon recibió información sobre buques japoneses que operaban desde Dangpo durante la segunda salida de 1592.",
    outcome: "La artillería y los buques tortuga atacaron el fondeadero, destruyeron la nave de mando y obligaron a los supervivientes japoneses a retirarse a tierra.",
    consequences: "La derrota dejó a una flotilla japonesa en fuga hacia Danghangpo y enlazó directamente con la siguiente acción de la campaña.",
    curationNote: "El año se incorpora porque Dangpo también designa otra acción de 1604; las cifras de pérdidas se mantienen atribuidas a los partes de campaña."
  }),
  "Primera batalla naval de Danghangpo (1592)": navalFix({
    campaign: "Segunda campaña naval de Yi Sun-sin de 1592",
    region: "Danghangpo, actual Goseong, Corea del Sur",
    hierarchySources: [SOURCES.campaigns1592, SOURCES.imjinOverview, SOURCES.nanjungIlgi],
    startYear: 1592,
    participants: JOSEON_AND_JAPAN,
    cause: "La flota combinada de Joseon localizó en Danghangpo buques japoneses vinculados con la retirada desde Dangpo.",
    outcome: "Una retirada fingida atrajo a la flotilla fuera del puerto; la formación de Joseon la rodeó y destruyó durante el combate y la persecución posterior.",
    consequences: "La acción redujo otra concentración naval japonesa antes del cierre de la segunda campaña en Yulpo.",
    curationNote: "Se identifica como primera batalla porque una segunda acción de Danghangpo ocurrió en 1594; mantener el nombre sin año fusionaba episodios distintos."
  }),
  "Batalla naval de Yulpo (1592)": navalFix({
    campaign: "Segunda campaña naval de Yi Sun-sin de 1592",
    region: "Yulpo, costa de Geoje, Corea del Sur",
    hierarchySources: [SOURCES.campaigns1592, SOURCES.imjinOverview, SOURCES.nanjungIlgi],
    startYear: 1592,
    participants: JOSEON_AND_JAPAN,
    cause: "La flota de Joseon persiguió hacia Busan una pequeña flotilla japonesa detectada al finalizar la operación de Danghangpo.",
    outcome: "Los buques japoneses fueron alcanzados y destruidos o abandonados durante la persecución frente a Yulpo.",
    consequences: "El combate cerró la segunda campaña naval de Yi Sun-sin y consolidó temporalmente el control de las rutas costeras de Jeolla y Gyeongsang occidental.",
    curationNote: "La campaña oficial registra siete buques japoneses; se evita convertir ese parte operacional en una estimación de bajas humanas."
  }),
  "Acción naval de Hwajungumi (1592)": navalFix({
    campaign: "Cuarta campaña naval de Yi Sun-sin de 1592",
    region: "Hwajungumi, zona de Molundae en la actual Busan, Corea del Sur",
    hierarchySources: [SOURCES.campaigns1592, SOURCES.hwajungumi, SOURCES.nanjungIlgi],
    startYear: 1592,
    type: "acción naval",
    participants: JOSEON_AND_JAPAN,
    cause: "La flota de Joseon avanzó por los fondeaderos occidentales de Busan para atacar las defensas y buques que protegían la principal base japonesa.",
    outcome: "La fuerza de Yi Sun-sin destruyó una pequeña agrupación de buques japoneses antes de continuar hacia otros fondeaderos y Busan.",
    consequences: "La acción formó parte de una cadena de ataques que culminó ese mismo ciclo operacional en la batalla naval de Busan.",
    sourceDispute: true,
    curationNote: "El topónimo aparece en el Nanjung Ilgi y en los partes de guerra, pero su ubicación moderna requirió reconstrucción académica; por eso se evita una precisión geográfica mayor."
  }),
  "Batalla naval de Busan (1592)": navalFix({
    campaign: "Cuarta campaña naval de Yi Sun-sin de 1592",
    region: "Bahía y puerto de Busan, Corea del Sur",
    hierarchySources: [SOURCES.campaigns1592, SOURCES.imjinOverview, SOURCES.nanjungIlgi],
    startYear: 1592,
    participants: JOSEON_AND_JAPAN,
    cause: "La flota combinada de Joseon atacó la principal base naval y logística japonesa para dañar los transportes y limitar el abastecimiento de la invasión.",
    outcome: "La artillería de Joseon destruyó numerosos buques fondeados y se retiró sin capturar Busan, mientras las fuerzas japonesas conservaron sus posiciones terrestres.",
    consequences: "El ataque dañó la capacidad naval japonesa y elevó el costo de sus comunicaciones, pero no eliminó la base ni cortó de manera permanente todas sus rutas de suministro.",
    sourceDispute: true,
    curationNote: "Las fuentes coinciden en una amplia destrucción naval, pero difieren en el número de buques y en la valoración estratégica. La ficha separa el éxito táctico de la falta de conquista del puerto."
  }),
  "Escaramuza naval de Eoranpo (1597)": navalFix({
    campaign: "Reconstrucción naval y campaña de Myeongnyang de 1597",
    region: "Eoranpo y cabo Galdu, actual Haenam, Corea del Sur",
    hierarchySources: [SOURCES.myeongnyang, SOURCES.nanjungIlgi],
    startYear: 1597,
    type: "escaramuza naval",
    participants: JOSEON_AND_JAPAN,
    cause: "Ocho buques japoneses entraron por sorpresa en Eoranpo mientras Yi Sun-sin reorganizaba los restos de la armada de Joseon después de Chilcheollyang.",
    outcome: "La nave capitana de Yi encabezó la persecución hasta Galdu y los buques japoneses se retiraron sin que la fuente oficial registre hundimientos.",
    consequences: "Fue el primer contacto naval tras la restitución de Yi y ayudó a preparar la defensa que culminó en Myeongnyang.",
    curationNote: "Se reclasifica como escaramuza y persecución: la fuente oficial no describe una batalla decisiva ni atribuye pérdidas navales."
  }),
  "Batalla naval de Myeongnyang (1597)": navalFix({
    campaign: "Reconstrucción naval y campaña de Myeongnyang de 1597",
    region: "Estrecho de Myeongnyang, entre Jindo y Haenam, Corea del Sur",
    hierarchySources: [SOURCES.myeongnyang, SOURCES.finalCampaign, SOURCES.nanjungIlgi],
    startYear: 1597,
    participants: JOSEON_AND_JAPAN,
    cause: "La armada japonesa intentó atravesar el estrecho y apoyar su avance hacia el oeste después de destruir gran parte de la flota de Joseon en Chilcheollyang.",
    outcome: "Trece buques de guerra de Joseon aprovecharon el estrecho y sus corrientes para rechazar a una fuerza japonesa muy superior; el parte coreano atribuye 31 buques enemigos destruidos o inutilizados.",
    consequences: "La victoria frenó el acceso japonés al mar Amarillo, permitió reconstruir la armada de Joseon y facilitó la posterior cooperación naval con el Imperio Ming.",
    sourceDispute: true,
    curationNote: "La victoria y la gran inferioridad numérica de Joseon están bien documentadas, pero las fuentes difieren sobre el total japonés y el alcance exacto de sus pérdidas. Se conserva la cifra como atribuida al parte coreano."
  }),
  "Batalla naval de Jeolido (1598)": navalFix({
    campaign: "Operaciones navales finales de 1598",
    region: "Aguas de Jeolido, actual isla Geogeum, Goheung, Corea del Sur",
    hierarchySources: [SOURCES.jeolido, SOURCES.nanjungIlgi],
    startYear: 1598,
    participants: JOSEON_AND_JAPAN,
    cause: "La armada reconstruida de Joseon atacó una concentración japonesa cerca de Jeolido durante las operaciones finales de la segunda invasión.",
    outcome: "La investigación naval coreana reconstruye una victoria de Joseon y atribuye la destrucción de unos cincuenta buques japoneses.",
    consequences: "La acción confirmó la recuperación operativa de la armada de Joseon después de Myeongnyang y precedió las operaciones conjuntas con la flota Ming.",
    sourceDispute: true,
    curationNote: "La ubicación general y el resultado están respaldados por el estudio académico; el tamaño de las flotas y las pérdidas proceden de una reconstrucción de registros históricos, no de un recuento moderno independiente."
  }),
  "Batalla naval de Noryang (1598)": navalFix({
    campaign: "Operaciones navales finales de 1598",
    region: "Estrecho de Noryang, entre Namhae y la costa meridional de Corea",
    hierarchySources: [SOURCES.finalCampaign, SOURCES.nanjungIlgi],
    startYear: 1598,
    participants: [
      { side: "Flota aliada de Joseon y Ming", members: ["Reino de Joseon", "Imperio Ming"] },
      { side: "Fuerzas navales japonesas", members: ["Japón"] }
    ],
    cause: "La flota aliada intentó bloquear a las fuerzas navales que acudían a abrir una ruta de retirada para las guarniciones japonesas del sur de Corea.",
    outcome: "La flota de Joseon y Ming derrotó a la fuerza japonesa en el estrecho y le causó pérdidas severas; parte de las tropas bloqueadas, incluida la fuerza de Konishi Yukinaga, logró retirarse por otra ruta.",
    consequences: "Fue la última gran batalla naval de la guerra y coincidió con la retirada final japonesa; Yi Sun-sin y el almirante Ming Deng Zilong murieron durante el combate.",
    sourceDispute: true,
    curationNote: "Las estimaciones de buques y bajas varían ampliamente. Se registra la victoria aliada sin presentarla como una aniquilación total ni ocultar que la evacuación japonesa continuó."
  })
};
