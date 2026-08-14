function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  suoiChauPhaAustralianWarMemorial: source(
    "Australian War Memorial: patrulla de 7RAR durante la Operacion Ballarat y combate del 6 de agosto de 1967 en Suoi Chau Pha",
    "https://www.awm.gov.au/3dtreasures/items/damaged-boot/"
  ),
  suoiChauPhaAustralianWarMemorialCollection: source(
    "Australian War Memorial: coleccion fotografica de la evacuacion de bajas de Suoi Chau Pha el 6 de agosto de 1967",
    "https://www.awm.gov.au/collection/C385782"
  ),
  zhenbaoNationalDefenseUniversity: source(
    "National Defense University: estudio sobre los dos enfrentamientos chino-sovieticos de marzo de 1969 en Zhenbao/Damanski",
    "https://www.govinfo.gov/content/pkg/GOVPUB-D5-PURL-gpo59517/pdf/GOVPUB-D5-PURL-gpo59517.pdf"
  ),
  zhenbaoCna: source(
    "CNA: analisis historico del choque de Zhenbao de marzo de 1969 y de la escalada fronteriza sino-sovietica",
    "https://www.cna.org/archive/CNA_Files/pdf/d0022974.a2.pdf"
  ),
  kousseriFrenchDefenseArchive: source(
    "Service historique de la Defense de Francia: archivo Meynier sobre el combate de Kousseri del 22 de abril de 1900",
    "https://www.servicehistorique.sga.defense.gouv.fr/ark/1484343"
  ),
  kousseriFrenchNationalLibrary: source(
    "Bibliotheque nationale de France: catalogo de la mision Foureau-Lamy y de las operaciones de 1900 contra Rabah",
    "https://ccfr.bnf.fr/portailccfr/ark%3A/16871/0019196594"
  ),
  thuanAnVietnamHistory: source(
    "Vietnam.vn: cronologia del ataque frances a Thuan An, la toma del estuario y el Tratado Harmand de 1883",
    "https://www.vietnam.vn/en/vu-binh-bien-tai-kinh-thanh-hue-140-nam-nhin-lai"
  ),
  thuanAnHueHistory: source(
    "Hue Discovery: defensa de las fortificaciones de Thuan An y contexto historico local de agosto de 1883",
    "https://khamphahue.com.vn/en-us/Hue-24h/Life/tid/Patriotic-spirit-from-the-defense-of-Thuan-An-estuary-in-the-late-19th-century.html/pid/18435/cid/514"
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
    curationBatch: "source-backed-asia-africa-historical-followup-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const ASIA_AFRICA_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Suoi Chau Pha": "Batalla de Suoi Chau Pha (1967)",
  "Primera batalla de Zhenbao": "Primera batalla de Zhenbao (1969)",
  "Segunda batalla de Zhenbao": "Segunda batalla de Zhenbao (1969)",
  "Batalla de Kouss\u00e9ri": "Batalla de Kouss\u00e9ri (1900)",
  "Batalla de Thu\u1eadn An": "Batalla de Thu\u1eadn An (1883)"
};

export const ASIA_AFRICA_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  Australia: ["Batalla de Suoi Chau Pha (1967)"],
  Vietnam: [
    "Batalla de Suoi Chau Pha (1967)",
    "Batalla de Thu\u1eadn An (1883)"
  ],
  Rusia: [
    "Conflicto fronterizo sino-sovi\u00e9tico",
    "Primera batalla de Zhenbao (1969)",
    "Segunda batalla de Zhenbao (1969)"
  ],
  "Camer\u00fan": ["Batalla de Kouss\u00e9ri (1900)"],
  Chad: ["Batalla de Kouss\u00e9ri (1900)"]
};

export const ASIA_AFRICA_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Conflicto fronterizo sino-sovi\u00e9tico": historicalFix({
    parent: "Ruptura sino-sovi\u00e9tica",
    campaign: "Crisis fronteriza sino-sovietica de 1969",
    region: "Frontera chino-sovietica, con focos en el rio Ussuri y Asia central",
    hierarchySources: [SOURCES.zhenbaoNationalDefenseUniversity, SOURCES.zhenbaoCna],
    startYear: 1969,
    type: "conflicto fronterizo",
    conflictType: "frontera",
    scale: "regional",
    participants: [
      { side: "Fuerzas de la Republica Popular China", members: ["Republica Popular China"] },
      { side: "Fuerzas de la Union Sovietica", members: ["Union Sovietica"] }
    ],
    cause: "La ruptura politica entre Beijing y Moscu se combino con desacuerdos de delimitacion y una creciente concentracion militar en sectores de la frontera comun.",
    outcome: "Los enfrentamientos de 1969 no resolvieron el diferendo fronterizo, aunque la crisis llevo a la reapertura de conversaciones entre ambas partes en septiembre.",
    consequences: "El conflicto agravo la ruptura sino-sovietica y mantuvo el riesgo de escalada a lo largo de la frontera durante el resto de 1969.",
    chronology: [
      { year: 1969, event: "El 2 y el 15 de marzo se registraron los choques de mayor escala en torno a Zhenbao/Damanski." },
      { year: 1969, event: "En septiembre, los gobiernos reanudaron contactos para tratar la crisis fronteriza sin una solucion inmediata al diferendo." }
    ],
    treaties: [],
    related: ["Primera batalla de Zhenbao (1969)", "Segunda batalla de Zhenbao (1969)"],
    curationNote: "La asociacion de Rusia sirve para navegacion historica sobre el sucesor territorial de la Union Sovietica, no para presentar a la Federacion de Rusia actual como beligerante de 1969. Las denominaciones y bajas de Zhenbao/Damanski siguen siendo materia de historiografias nacionales distintas.",
    sourceDispute: true
  }),
  "Batalla de Suoi Chau Pha (1967)": historicalFix({
    parent: "Guerra de Vietnam",
    campaign: "Operacion Ballarat (agosto de 1967)",
    region: "Rio Suoi Chau Pha, sector oriental de Hat Dich, provincia de Phuoc Tuy, Vietnam del Sur de la epoca, actual Vietnam",
    hierarchySources: [SOURCES.suoiChauPhaAustralianWarMemorial, SOURCES.suoiChauPhaAustralianWarMemorialCollection],
    startYear: 1967,
    type: "batalla terrestre",
    conflictType: "insurgencia",
    scale: "internacional",
    participants: [
      { side: "Fuerzas australianas", members: ["7.\u00ba Batallon del Regimiento Real Australiano", "Fuerza Aerea Real Australiana"] },
      { side: "Fuerzas comunistas vietnamitas", members: ["Viet Cong"] }
    ],
    cause: "Durante la Operacion Ballarat, una patrulla australiana encontro una fuerza importante del Viet Cong en el sector de Hat Dich de Phuoc Tuy.",
    outcome: "Tras mas de dos horas de combate cercano, la fuerza del Viet Cong se retiro bajo la presion de la artilleria australiana; la accion no decidio por si sola la campana.",
    consequences: "El combate mostro la persistencia de fuerzas comunistas en Phuoc Tuy y se integro en la secuencia de operaciones australianas de 1967 en el sur de Vietnam.",
    chronology: [
      { year: 1967, event: "La Operacion Ballarat comenzo a principios de agosto en el sector oriental de Hat Dich." },
      { year: 1967, event: "El 6 de agosto, la Compania A de 7RAR combatio junto al rio Suoi Chau Pha y el Viet Cong se retiro tras el apoyo de artilleria." }
    ],
    treaties: ["Acuerdos de Paz de Paris (1973)"],
    curationNote: "Los participantes principales se limitan a Australia y al Viet Cong segun la fuente institucional. La asociacion previa con Estados Unidos no se convierte en un tercer bando de la ficha; las cifras de bajas varian segun el momento de registro, por lo que no se fija una cifra unica.",
    sourceDispute: true
  }),
  "Primera batalla de Zhenbao (1969)": historicalFix({
    parent: "Conflicto fronterizo sino-sovi\u00e9tico",
    campaign: "Enfrentamientos de la isla de Zhenbao de 1969",
    region: "Isla de Zhenbao/Damanski, rio Ussuri, tramo fronterizo chino-sovietico de la epoca",
    hierarchySources: [SOURCES.zhenbaoNationalDefenseUniversity, SOURCES.zhenbaoCna],
    startYear: 1969,
    type: "combate fronterizo",
    conflictType: "frontera",
    scale: "regional",
    participants: [
      { side: "Fuerzas de la Republica Popular China", members: ["Republica Popular China"] },
      { side: "Fuerzas de la Union Sovietica", members: ["Union Sovietica"] }
    ],
    cause: "La escalada de tensiones militares y diplomaticas a lo largo de la frontera sino-sovietica llevo a un enfrentamiento en la isla disputada de Zhenbao/Damanski.",
    outcome: "El primer gran tiroteo del 2 de marzo abrio una escalada que produjo un segundo choque de mayor escala el 15 de marzo; no resolvio el diferendo fronterizo.",
    consequences: "Los enfrentamientos elevaron el riesgo de una crisis mayor y contribuyeron a la reanudacion de contactos fronterizos entre Beijing y Moscu en septiembre de 1969.",
    chronology: [
      { year: 1969, event: "El 2 de marzo se produjo el primer gran enfrentamiento en la isla de Zhenbao/Damanski." },
      { year: 1969, event: "El 15 de marzo se produjo un segundo choque de mayor escala y las tensiones fronterizas continuaron durante el ano." }
    ],
    treaties: [],
    related: ["Segunda batalla de Zhenbao (1969)"],
    curationNote: "Zhenbao y Damanski son denominaciones china y rusa de la isla. La ficha no adopta una afirmacion contemporanea de soberania ni fija bajas cerradas: las fuentes y las historiografias nacionales difieren sobre el inicio y el costo de los combates.",
    sourceDispute: true
  }),
  "Segunda batalla de Zhenbao (1969)": historicalFix({
    parent: "Conflicto fronterizo sino-sovi\u00e9tico",
    campaign: "Enfrentamientos de la isla de Zhenbao de 1969",
    region: "Isla de Zhenbao/Damanski, rio Ussuri, tramo fronterizo chino-sovietico de la epoca",
    hierarchySources: [SOURCES.zhenbaoNationalDefenseUniversity, SOURCES.zhenbaoCna],
    startYear: 1969,
    type: "combate fronterizo",
    conflictType: "frontera",
    scale: "regional",
    participants: [
      { side: "Fuerzas de la Republica Popular China", members: ["Republica Popular China"] },
      { side: "Fuerzas de la Union Sovietica", members: ["Union Sovietica"] }
    ],
    cause: "El segundo enfrentamiento siguio al choque del 2 de marzo y a la acumulacion de fuerzas en el tramo del Ussuri controlado por ambos Estados.",
    outcome: "El combate del 15 de marzo fue mayor que el primero y no produjo una solucion militar o diplomatica inmediata; continuaron incidentes a lo largo de la frontera durante 1969.",
    consequences: "La crisis incremento la presion por retomar dialogos y mantuvo el diferendo fronterizo como un foco de riesgo de la ruptura sino-sovietica.",
    chronology: [
      { year: 1969, event: "El 2 de marzo, el primer choque de Zhenbao/Damanski incremento la alerta militar en la frontera." },
      { year: 1969, event: "El 15 de marzo, las fuerzas sovieticas y chinas protagonizaron un enfrentamiento de mayor escala en torno a la isla." }
    ],
    treaties: [],
    related: ["Primera batalla de Zhenbao (1969)"],
    curationNote: "La ficha conserva la distincion entre el segundo combate y el conjunto del conflicto fronterizo. Zhenbao y Damanski son denominaciones de epoca distintas; no se convierte la referencia geografica en una afirmacion contemporanea de soberania ni se fijan bajas disputadas.",
    sourceDispute: true
  }),
  "Batalla de Kouss\u00e9ri (1900)": historicalFix({
    parent: "Conquista francesa de Chad (1899-1900)",
    campaign: "Operaciones de las misiones Foureau-Lamy, Joalland-Meynier y Gentil contra Rabah (abril de 1900)",
    region: "Kouss\u00e9ri, orilla del rio Chari, extremo norte del actual Camerun, frente a N'Djamena, Chad",
    hierarchySources: [SOURCES.kousseriFrenchDefenseArchive, SOURCES.kousseriFrenchNationalLibrary],
    startYear: 1900,
    type: "batalla terrestre",
    conflictType: "colonial",
    scale: "regional",
    participants: [
      { side: "Misiones coloniales francesas y auxiliares africanos", members: ["Francia", "Mision Foureau-Lamy", "Mision Joalland-Meynier", "Mision Gentil"] },
      { side: "Fuerzas de Rabah az-Zubayr", members: ["Fuerzas de Rabah az-Zubayr"] }
    ],
    cause: "Tres misiones francesas convergieron en la cuenca del Chari durante una campana de expansion colonial y combatieron a las fuerzas de Rabah cerca de Kouss\u00e9ri.",
    outcome: "Las fuerzas francesas derrotaron a las de Rabah en el combate del 22 de abril; Rabah y el comandante Lamy murieron durante la accion.",
    consequences: "La derrota de Rabah facilito la consolidacion de la administracion colonial francesa en la cuenca del Chari. La ficha describe ese proceso como conquista colonial, no como una transferencia politica neutral.",
    chronology: [
      { year: 1900, event: "Las misiones Foureau-Lamy, Joalland-Meynier y Gentil se reunieron en el area del lago Chad durante marzo y abril." },
      { year: 1900, event: "El 22 de abril, las fuerzas reunidas combatieron a Rabah en Kouss\u00e9ri, junto al rio Chari." }
    ],
    treaties: [],
    curationNote: "Camerun y Chad se vinculan como referencias geograficas e historicas actuales, no como participantes estatales de 1900. Los actores de epoca se mantienen separados y la narrativa nombra explicitamente el caracter colonial de la campana.",
    sourceDispute: true
  }),
  "Batalla de Thu\u1eadn An (1883)": historicalFix({
    parent: "Campa\u00f1a de Tonkin (1883-1886)",
    campaign: "Ataque frances a las fortificaciones de Thuan An (agosto de 1883)",
    region: "Estuario de Thuan An, acceso fluvial a Hue, Annam de la epoca, actual Vietnam",
    hierarchySources: [SOURCES.thuanAnVietnamHistory, SOURCES.thuanAnHueHistory],
    startYear: 1883,
    type: "asalto anfibio y bombardeo naval",
    conflictType: "colonial",
    scale: "internacional",
    participants: [
      { side: "Fuerzas navales y de infanteria de marina francesas", members: ["Republica Francesa"] },
      { side: "Defensores de la dinastia Nguyen", members: ["Dinastia Nguyen"] }
    ],
    cause: "Las autoridades francesas buscaron tomar las fortificaciones que protegian el acceso a Hue y forzar a la corte Nguyen a aceptar condiciones impuestas bajo presion militar.",
    outcome: "Las fuerzas francesas tomaron el estuario y las fortificaciones de Thuan An; la corte de Hue solicito un alto el fuego y firmo el Tratado Harmand pocos dias despues.",
    consequences: "La caida de las defensas abrio un nuevo periodo de imposicion colonial francesa sobre Annam y condiciono la resistencia vietnamita posterior. No se presenta como un arreglo voluntario de la corte.",
    chronology: [
      { year: 1883, event: "El 18 de agosto, buques y tropas francesas se concentraron frente al estuario de Thuan An y exigieron el desarme de los fuertes." },
      { year: 1883, event: "Para el 21 de agosto, Francia controlaba el estuario; el 25 de agosto, la corte de Hue firmo el Tratado Harmand bajo presion militar." }
    ],
    treaties: ["Tratado de Hue o Harmand (1883)"],
    curationNote: "La ficha usa Vietnam actual solo para orientacion geografica y conserva a la dinastia Nguyen como actor de epoca. Evita una cifra cerrada de bajas y describe la coercion colonial sin atribuir una aceptacion voluntaria al acuerdo impuesto a la corte de Hue.",
    sourceDispute: true
  })
};
