function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  beitangPrimary: source(
    "Vostlit: texto historico ruso sobre las operaciones contra la fortaleza de Beitang en septiembre de 1900",
    "https://www.vostlit.info/Texts/Dokumenty/China/XX/1900-1920/Lupov_A_N/text.htm"
  ),
  beitangMilitaryEncyclopedia: source(
    "Wikisource ruso: articulo de enciclopedia militar sobre la toma de Beitang y las operaciones de septiembre de 1900",
    "https://ru.wikisource.org/wiki/%D0%92%D0%AD/%D0%92%D0%A2/%D0%91%D0%BE%D0%BA%D1%81%D0%B5%D1%80%D1%81%D0%BA%D0%BE%D0%B5_%D0%B2%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%B8%D0%B5_1900%E2%80%9402_%D0%B3%D0%B3."
  ),
  teacapanMIP: source(
    "Military Intervention Project, Tufts University: caso documentado de la expedicion estadounidense contra el Forward en 1870",
    "https://bpb-us-e1.wpmucdn.com/sites.tufts.edu/dist/0/7319/files/2023/04/Combined-Case-Narratives_MIP.pdf"
  ),
  teacapanNavy: source(
    "U.S. Naval History and Heritage Command: biografia naval de Jonathan Mayhew Wainwright y la expedicion del Mohican contra el Forward",
    "https://www.history.navy.mil/research/histories/ship-histories/danfs/w/wainwright-iii.html"
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
    curationBatch: "source-backed-beitang-teacapan-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const BEITANG_TEACAPAN_CONFLICT_RENAMES = {
  "Batalla de Beitang": "Batalla de Beitang (1900)",
  "Batalla de Boca Teacapan": "Batalla de Boca Teacapan (1870)"
};

export const BEITANG_TEACAPAN_COUNTRY_CONFLICT_ADDITIONS = {
  "Rep\u00fablica Popular China": ["Batalla de Beitang (1900)"],
  Rusia: ["Batalla de Beitang (1900)"],
  Alemania: ["Batalla de Beitang (1900)"],
  Francia: ["Batalla de Beitang (1900)"],
  "M\u00e9xico": ["Batalla de Boca Teacapan (1870)"]
};

export const BEITANG_TEACAPAN_COUNTRY_CONFLICT_EXCLUSIONS = {
  "Estados Unidos": ["Batalla de Beitang", "Batalla de Beitang (1900)"]
};

export const BEITANG_TEACAPAN_CONFLICT_DETAIL_FIXES = {
  "Batalla de Beitang (1900)": historicalFix({
    parent: "Rebelion de los Boxers",
    campaign: "Operaciones aliadas de Beitang de septiembre de 1900",
    region: "Fortaleza de Beitang, costa del golfo de Bohai, cerca de Tianjin, China",
    hierarchySources: [SOURCES.beitangPrimary, SOURCES.beitangMilitaryEncyclopedia],
    startYear: 1900,
    type: "asalto a fortaleza",
    conflictType: "intervencion",
    scale: "internacional",
    participants: [
      {
        side: "Destacamento ruso, aleman y frances de la Alianza de las Ocho Naciones",
        members: ["Fuerzas rusas", "Destacamento aleman", "Fuerzas francesas"]
      },
      {
        side: "Ejercito Qing y guarnicion de Beitang",
        members: ["Ejercito de la dinastia Qing", "Guarnicion china de Beitang"]
      }
    ],
    cause: "Tras la toma de Pekin y las operaciones iniciales de la Alianza de las Ocho Naciones, las fuerzas aliadas buscaron asegurar Beitang y la comunicacion ferroviaria y costera de la zona de Tianjin.",
    outcome: "Las fuerzas aliadas ocuparon la fortaleza de Beitang el 20 de septiembre tras la presion artillera y la retirada de la guarnicion Qing. Fue una victoria operativa aliada, sin que las fuentes abiertas permitan consolidar una contabilidad unica de bajas o de efectivos.",
    consequences: "La ocupacion ayudo a asegurar las comunicaciones y la presencia aliada en el litoral de Tianjin durante la fase posterior de la Rebelion de los Boxers, sin cerrar por si sola la campana de 1900.",
    chronology: [
      { year: 1900, event: "A comienzos de septiembre, las fuerzas rusas desplegaron posiciones y baterias contra las defensas de Beitang." },
      { year: 1900, event: "El 20 de septiembre, un destacamento aliado con fuerzas rusas, alemanas y francesas tomo la fortaleza de Beitang." },
      { year: 1900, event: "La accion se integro en las operaciones aliadas posteriores a la entrada en Pekin y a la ocupacion de posiciones del norte de China." }
    ],
    treaties: [],
    related: ["Alianza de las Ocho Naciones", "Tianjin"],
    curationNote: "La ficha distingue Beitang de Beicang, combate diferente del 5 de agosto de 1900. Estados Unidos se elimina porque las fuentes de esta accion de septiembre describen un destacamento ruso, aleman y frances frente a la guarnicion Qing. Los Estados contemporaneos se usan solo para navegacion; los participantes describen fuerzas de epoca.",
    sourceDispute: true
  }),
  "Batalla de Boca Teacapan (1870)": historicalFix({
    parent: "Pirater\u00eda en Am\u00e9rica del Norte",
    campaign: "Expedici\u00f3n del USS Mohican contra el Forward de 1870",
    region: "Boca Teacapan y estero de Teacapan, Sinaloa, M\u00e9xico",
    hierarchySources: [SOURCES.teacapanMIP, SOURCES.teacapanNavy],
    startYear: 1870,
    type: "expedici\u00f3n naval contra pirater\u00eda",
    conflictType: "intervencion",
    scale: "regional",
    participants: [
      {
        side: "Destacamento naval estadounidense del USS Mohican",
        members: ["Marina de los Estados Unidos", "Marines de Estados Unidos", "Lanchas y cuteres del USS Mohican"]
      },
      {
        side: "Tripulaci\u00f3n del Forward y fuerzas asociadas a Pl\u00e1cido Vega",
        members: ["Vapor Forward", "Fuerzas irregulares asociadas a Pl\u00e1cido Vega"]
      }
    ],
    cause: "El vapor Forward, tomado por piratas, atacaba trafico y poblaciones del Pacifico mexicano. El USS Mohican envio un destacamento en embarcaciones menores para localizarlo y neutralizarlo.",
    outcome: "El 17 de junio, el destacamento del Mohican tomo el Forward, que estaba varado en el estero de Teacapan, y lo destruyo al no poder remolcarlo. La accion fue una victoria tactica estadounidense contra la tripulacion pirata.",
    consequences: "La destruccion del Forward termino la amenaza inmediata atribuida a ese buque en la zona. No debe leerse como una guerra formal entre Mexico y Estados Unidos, ya que la contraparte registrada era una fuerza irregular.",
    chronology: [
      { year: 1869, event: "El Forward fue tomado y empleado en ataques contra trafico y poblaciones del Pacifico mexicano." },
      { year: 1870, event: "El 17 de junio, lanchas y cuteres del USS Mohican alcanzaron el Forward en Boca Teacapan y lo destruyeron tras el combate." },
      { year: 1870, event: "El marino Jonathan Mayhew Wainwright murio el 19 de junio por heridas recibidas durante la expedicion." }
    ],
    treaties: [],
    related: ["USS Mohican", "Forward"],
    curationNote: "Mexico se incorpora como enlace geografico porque la accion ocurrio en Sinaloa, pero no se presenta al Estado mexicano como beligerante formal. Los relatos difieren sobre la composicion y las bajas de la fuerza irregular; por ello no se consolidan cifras ni se equipara la expedicion con una guerra bilateral.",
    sourceDispute: true
  })
};
