function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SERIES = "Batallas de Wenden (1577-1578)";
const BATTLE = "Batalla de Wenden (21-22 de octubre de 1578)";
const PARENT = "Guerra de Livonia (1558-1583)";
const SERIES_CAMPAIGN = "Operaciones por Wenden/C\u0113sis (1577-1578)";
const BATTLE_CAMPAIGN = "Socorro aliado de Wenden (octubre de 1578)";

const SOURCES = {
  wendenAcademic: source(
    "Universidad Palacky de Olomouc: estudio academico de Pavel Horky sobre la derrota rusa en Wenden de 1578, sus fuentes y sus discrepancias",
    "https://historica.upol.cz/pdfs/hol/2024/01/05.pdf"
  ),
  cesisArchaeology: source(
    "Centro de Arqueologia de Cesis: sintesis historica de los asedios de 1577-1578 y del combate aliado de los dias 21 y 22 de octubre de 1578",
    "https://arheo.cesis.lv/wp-content/uploads/2019/12/2017_AgrisDzenis_LivonijasKars.pdf"
  ),
  cesisCastle: source(
    "Castillo de Cesis: historia institucional de la plaza, incluido el asedio de 1577 durante la Guerra de Livonia",
    "https://cesupils.lv/en/the-castle-complex/medieval-castle/history-of-the-castle/"
  )
};

function seriesFix() {
  const hierarchySources = [
    SOURCES.wendenAcademic,
    SOURCES.cesisArchaeology,
    SOURCES.cesisCastle
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: SERIES_CAMPAIGN,
    type: "serie de asedios y batalla de socorro",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1577,
    endYear: 1578,
    region: "Wenden/C\u0113sis, Livonia historica, actual Letonia",
    normalizedRegion: "Wenden/C\u0113sis, Livonia historica, actual Letonia",
    cause: "La plaza de Wenden/C\u0113sis era un punto estrategico de Livonia. En 1577 las fuerzas de Ivan IV la sitiaron; las operaciones continuaron con la recuperacion local de la plaza, otro sitio ruso a comienzos de 1578 y el socorro aliado de octubre.",
    outcome: "La serie no tuvo un resultado uniforme: el asedio ruso de 1577 dano gravemente la plaza, la posicion cambio de manos a fines de ese ano y, en octubre de 1578, la fuerza aliada polaco-lituana y sueca derroto a las fuerzas moscovitas que la sitiaban. La ficha no resume todos los episodios como una sola victoria continua.",
    consequences: "El resultado de octubre de 1578 reforzo la iniciativa de los adversarios de Moscu en Livonia y suele considerarse un punto de inflexion de la guerra. La disputa no concluyo en Wenden: la Tregua de Yam-Zapolsky de 1582 fue un cierre posterior entre la Mancomunidad y el Zarato ruso.",
    chronology: [
      {
        year: 1577,
        event: "Las fuerzas de Ivan IV sitiaron Wenden/C\u0113sis; la historia institucional de la plaza registra una explosion de polvora que causo la muerte de numerosos refugiados durante la crisis."
      },
      {
        year: 1577,
        event: "A fines de ano, unidades locales recuperaron la plaza; la sintesis de C\u0113sis menciona un contingente aleman y leton dirigido por Johann Biering."
      },
      {
        year: 1578,
        event: "Un nuevo sitio ruso de comienzos de ano fracaso y, en octubre, una fuerza aliada polaco-lituana y sueca avanzo para socorrer Wenden/C\u0113sis."
      },
      {
        year: 1578,
        event: "Los dias 21 y 22 de octubre, el socorro aliado derroto a la fuerza moscovita; la reconstruccion academica advierte que las narraciones primarias discrepan en fuerzas, secuencia y bajas."
      }
    ],
    treaties: ["Tregua de Yam-Zapolsky (1582), cierre posterior de la Guerra de Livonia"],
    related: [PARENT, SERIES_CAMPAIGN, BATTLE, "C\u0113sis", "Ivan IV", "Tregua de Yam-Zapolsky"],
    participants: [
      {
        side: "Fuerzas del Zarato ruso",
        members: ["Zarato ruso", "Tropas moscovitas", "Contingentes tartaros citados por algunas fuentes"],
        casualties: "No se fija una cifra total para la serie. Las fuentes y las reconstrucciones difieren sobre fuerzas y bajas, en especial para el combate de octubre de 1578."
      },
      {
        side: "Fuerzas aliadas polaco-lituanas y suecas",
        members: ["Mancomunidad Polaco-Lituana", "Reino de Suecia"],
        casualties: "No se fija una cifra total para la serie; la evidencia consultada no permite consolidar bajas de los asedios y del combate de socorro en un recuento unico."
      },
      {
        side: "Defensores y unidades locales de Wenden/C\u0113sis",
        members: ["Guarnicion de Wenden/C\u0113sis", "Unidades locales citadas por la historia de C\u0113sis"],
        casualties: "La historia local registra una tragedia de refugiados durante el asedio de 1577, pero la ficha no transforma ese episodio en una cifra militar cerrada ni nacionaliza a la poblacion local."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "La serie abarca 1577-1578. Para el combate de socorro, la sintesis de C\u0113sis indica los dias 21 y 22 de octubre de 1578; las fuentes primarias no coinciden en todos los detalles de la secuencia.",
    sourceDispute: "El estudio academico de 2024 contrasta narraciones polacas, alemanas y rusas y muestra divergencias sobre la cadena de mando, el reconocimiento, el despliegue, los efectivos y las bajas. La ficha separa la serie de operaciones del combate de octubre y evita convertir una version tardia o una estimacion aislada en un dato definitivo.",
    curationPriority: "alta",
    curationBatch: "source-backed-wenden-1577-1578-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada plural previa no tenia fecha ni jerarquia. Se normaliza como una serie de operaciones dentro de la Guerra de Livonia, diferenciada de la Batalla de Wenden de octubre de 1578. Letonia se enlaza solo como ubicacion geografica contemporanea de C\u0113sis: no se presenta a la Letonia moderna como beligerante del siglo XVI. Polonia y Rusia se usan para navegacion, mientras la ficha conserva los nombres historicos de la Mancomunidad Polaco-Lituana y el Zarato ruso."
  };
}

function battleFix() {
  const hierarchySources = [SOURCES.wendenAcademic, SOURCES.cesisArchaeology];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: BATTLE_CAMPAIGN,
    type: "batalla campal y socorro de plaza",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1578,
    endYear: 1578,
    region: "Wenden/C\u0113sis, Livonia historica, actual Letonia",
    normalizedRegion: "Wenden/C\u0113sis, Livonia historica, actual Letonia",
    cause: "En octubre de 1578, una fuerza rusa sitiaba Wenden/C\u0113sis. La reconstruccion academica situa el inicio del sitio el 15 de octubre y registra la marcha nocturna de una coalicion polaco-lituana y sueca desde Mijan el dia 20 para socorrer la plaza.",
    outcome: "La fuerza aliada polaco-lituana y sueca rompio el sitio y derroto a las tropas moscovitas en Wenden/C\u0113sis. La sintesis de C\u0113sis lo fecha los dias 21 y 22 de octubre; no se fija una fuerza total ni un balance de bajas porque las fuentes no los concilian.",
    consequences: "La derrota redujo la presion rusa sobre la plaza y reforzo la posicion de la coalicion en Livonia. El efecto fue importante para la campana, pero no cerro por si solo la Guerra de Livonia, que continuo hasta los acuerdos posteriores de 1582-1583.",
    chronology: [
      {
        year: 1578,
        event: "El 15 de octubre, segun la cronologia discutida por el estudio academico, fuerzas rusas iniciaron el sitio de Wenden/C\u0113sis."
      },
      {
        year: 1578,
        event: "La noche del 20 de octubre, la fuerza aliada polaco-lituana y sueca partio de Mijan para socorrer la plaza."
      },
      {
        year: 1578,
        event: "Los dias 21 y 22 de octubre, las fuerzas aliadas vencieron a las tropas moscovitas; las versiones difieren en el detalle tactico y en los recuentos."
      }
    ],
    treaties: ["Tregua de Yam-Zapolsky (1582), cierre posterior de la Guerra de Livonia"],
    related: [PARENT, BATTLE_CAMPAIGN, SERIES, "C\u0113sis", "Ivan IV", "Tregua de Yam-Zapolsky"],
    participants: [
      {
        side: "Fuerzas aliadas polaco-lituanas y suecas",
        members: ["Mancomunidad Polaco-Lituana", "Reino de Suecia"],
        casualties: "Las fuentes no permiten cerrar una cifra unica de efectivos o bajas para la coalicion; la ficha mantiene el resultado general sin consolidar estimaciones incompatibles."
      },
      {
        side: "Fuerzas del Zarato ruso",
        members: ["Zarato ruso", "Tropas moscovitas", "Contingentes tartaros citados por algunas fuentes"],
        casualties: "Las fuentes consultadas coinciden en la derrota rusa, pero no armonizan fuerzas ni bajas. La ficha no convierte las cifras de una narracion en un recuento definitivo."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "21 y 22 de octubre de 1578 segun la sintesis historica de C\u0113sis; el estudio academico confirma el combate de octubre de 1578 y documenta diferencias entre narraciones primarias sobre su reconstruccion detallada.",
    sourceDispute: "Las narraciones polacas, alemanas y rusas de la batalla no son plenamente consistentes. El estudio de Horky de 2024 propone una lectura comparada de la derrota rusa, pero no elimina las dudas sobre el mando, el despliegue, los efectivos y las bajas; por eso la ficha no adjudica cifras cerradas ni una unica secuencia tactica.",
    curationPriority: "alta",
    curationBatch: "source-backed-wenden-1577-1578-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada singular previa quedaba bajo un conflicto regional generico, sin fecha ni ubicacion verificable. Se normaliza como la Batalla de Wenden de 21-22 de octubre de 1578 y se distingue de la serie de asedios de 1577-1578. Letonia se enlaza solo como referencia geografica contemporanea de C\u0113sis; los bandos se expresan con las entidades historicas de la Mancomunidad Polaco-Lituana, el Reino de Suecia y el Zarato ruso."
  };
}

export const WENDEN_1577_1578_CONFLICT_RENAMES = {
  "Batallas de Wenden": SERIES,
  "Battles de Wenden": SERIES,
  "Battles of Wenden": SERIES,
  "Batallas de Wenden (1577-1578)": SERIES,
  "Batallas de Wenden (1577\u20131578)": SERIES,
  "Battles of Wenden (1577-1578)": SERIES,
  "Batalla de Wenden": BATTLE,
  "Battle of Wenden": BATTLE,
  "Batalla de Wenden (1578)": BATTLE,
  "Battle of Wenden (1578)": BATTLE
};

export const WENDEN_1577_1578_COUNTRY_CONFLICT_ADDITIONS = {
  Letonia: [SERIES, BATTLE],
  Polonia: [SERIES, BATTLE],
  Rusia: [SERIES, BATTLE],
  Suecia: [SERIES, BATTLE]
};

export const WENDEN_1577_1578_CONFLICT_DETAIL_FIXES = {
  [SERIES]: seriesFix(),
  [BATTLE]: battleFix()
};
