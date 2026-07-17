function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  carillonNps: source(
    "Servicio de Parques Nacionales de EE. UU.: ataque britanico a Fort Carillon en 1758",
    "https://home.nps.gov/articles/adirondacks-europeans-and-american-colonists.htm"
  ),
  carillonHistory: source(
    "Servicio de Parques Nacionales de EE. UU.: Fort Carillon en la guerra franco-india",
    "https://home.nps.gov/articles/000/fort-stanwix-in-the-french-and-indian-seven-years-war-1758-1760.htm"
  ),
  monongahelaNps: source(
    "Servicio de Parques Nacionales de EE. UU.: expedicion Braddock y batalla de Monongahela",
    "https://home.nps.gov/articles/braddock-campaign.htm"
  ),
  monongahelaBeaujeu: source(
    "Servicio de Parques Nacionales de EE. UU.: Daniel-Hyacinthe de Beaujeu y la batalla de Monongahela",
    "https://www.nps.gov/people/captain-daniel-hyacinthe-marie-lienard-de-beaujeu.htm"
  ),
  wandiwashNam: source(
    "Museo Nacional del Ejercito del Reino Unido: Wandiwash en la guerra de los Siete Anos",
    "https://www.nam.ac.uk/explore/seven-years-war"
  ),
  wandiwashMap: source(
    "Coleccion Real: mapa de la batalla de Wandiwash y su relacion con la tercera guerra carnática",
    "https://militarymaps.rct.uk/other-18th/19th-century-conflicts/map-of-the-battle-of-wandiwash-1760-vandavasi-tamil-nadu-india-12deg3015n-79deg3620e"
  ),
  omdurmanNam: source(
    "Museo Nacional del Ejercito del Reino Unido: reconquista del Sudan y batalla de Omdurman",
    "https://www.nam.ac.uk/explore/egypt-and-sudan"
  ),
  omdurmanKitchener: source(
    "Museo Nacional del Ejercito del Reino Unido: campana de Kitchener en Sudan",
    "https://www.nam.ac.uk/explore/herbert-kitchener"
  ),
  qurnaIwm: source(
    "Museos Imperiales de Guerra: campana de Mesopotamia y batalla de Qurna",
    "https://www.iwm.org.uk/history/voices-of-the-first-world-war-mesopotamia"
  ),
  qurnaAwm: source(
    "Memorial de Guerra Australiano: campana de Mesopotamia de la Primera Guerra Mundial",
    "https://www.awm.gov.au/collection/E84664"
  ),
  jumunjinNavy: source(
    "Historia Naval y Patrimonio de EE. UU.: batalla de Chumonchin Chan del 2 de julio de 1950",
    "https://www.history.navy.mil/content/history/nhhc/about-us/leadership/director/directors-corner/h-grams/h-gram-050/h-050-1.html"
  ),
  jumunjinHgram: source(
    "Historia Naval y Patrimonio de EE. UU.: H-Gram 050 sobre las operaciones navales iniciales en Corea",
    "https://www.history.navy.mil/content/dam/nhhc/about-us/leadership/hgram_pdfs/H-Gram_050.pdf"
  ),
  heligolandIwm: source(
    "Museos Imperiales de Guerra: primera accion naval mayor en la bahia de Heligoland",
    "https://www.iwm.org.uk/history/voices-of-the-first-world-war-war-at-sea"
  ),
  heligolandCollection: source(
    "Museos Imperiales de Guerra: registro de la batalla de la bahia de Heligoland del 28 de agosto de 1914",
    "https://www.iwm.org.uk/collections/item/object/16984"
  ),
  maryangAwm: source(
    "Memorial de Guerra Australiano: batalla de Maryang San del 3 al 8 de octubre de 1951",
    "https://www.awm.gov.au/articles/atwar/oct"
  ),
  maryangOperation: source(
    "Memorial de Guerra Australiano: Maryang San dentro de la Operacion Commando",
    "https://www.awm.gov.au/visit/exhibitions/korea/operations/maryang_san"
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
    curationBatch: "source-backed-british-global-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const BRITISH_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Fort Carillon": "Batalla de Carillon (1758)",
  "Batalla de Monongahela": "Batalla de Monongahela (1755)",
  "Batalla de Wandiwash": "Batalla de Wandiwash (1760)",
  "Batalla de Omdurman": "Batalla de Omdurmán (1898)",
  "Batalla de Omdurmán": "Batalla de Omdurmán (1898)",
  "Batalla de Qurna": "Batalla de Qurna (1914)",
  "Batalla de Jumunjin": "Batalla naval de Jumunjin (1950)",
  "Batalla de la bahia de Heligoland": "Batalla de la bahía de Heligoland (1914)",
  "Batalla de la bahía de Heligoland": "Batalla de la bahía de Heligoland (1914)",
  "Primera Batalla de Maryang San": "Primera batalla de Maryang San (1951)"
};

export const BRITISH_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  Francia: [
    "Batalla de Carillon (1758)",
    "Batalla de Monongahela (1755)",
    "Batalla de Wandiwash (1760)"
  ],
  Alemania: ["Batalla de la bahía de Heligoland (1914)"],
  Australia: ["Primera batalla de Maryang San (1951)"],
  "Estados Unidos": ["Batalla naval de Jumunjin (1950)"],
  "Corea del Norte": [
    "Batalla naval de Jumunjin (1950)",
    "Primera batalla de Maryang San (1951)"
  ],
  "República Popular China": ["Primera batalla de Maryang San (1951)"]
};

export const BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Carillon (1758)": historicalFix({
    parent: "Guerra franco-india (1754-1763)",
    campaign: "Campana del lago Champlain de 1758",
    region: "Fort Carillon, actual Ticonderoga, Nueva York",
    hierarchySources: [SOURCES.carillonNps, SOURCES.carillonHistory],
    startYear: 1758,
    type: "asalto a fortificacion",
    conflictType: "colonial",
    scale: "internacional",
    participants: [
      { side: "Defensores franceses y aliados", members: ["Francia", "Milicias canadienses", "Naciones indigenas aliadas"] },
      { side: "Ejercito britanico y tropas coloniales", members: ["Reino Unido", "Colonias britanicas de America del Norte"] }
    ],
    cause: "El mando britanico intento abrir la ruta del lago Champlain hacia Canada frances atacando la fortificacion de Carillon durante la campana de 1758.",
    outcome: "Los defensores franceses rechazaron el asalto britanico del 8 de julio e infligieron fuertes bajas a la fuerza de Abercromby.",
    consequences: "El reves freno la ofensiva britanica de 1758; la posicion fue ocupada por fuerzas britanicas al ano siguiente y rebautizada como Fort Ticonderoga.",
    chronology: [
      { year: 1758, event: "El 8 de julio las tropas britanicas y coloniales atacaron Fort Carillon." },
      { year: 1758, event: "La defensa francesa mantuvo la fortificacion y obligo a retirar el asalto." }
    ],
    treaties: ["Tratado de Paris (1763)"],
    curationNote: "La accion se presenta como combate colonial de la guerra franco-india. La referencia geografica a la actual Nueva York no convierte a Estados Unidos en beligerante de 1758."
  }),
  "Batalla de Monongahela (1755)": historicalFix({
    parent: "Guerra franco-india (1754-1763)",
    campaign: "Expedicion Braddock de 1755",
    region: "Rio Monongahela, Pensilvania, America del Norte colonial",
    hierarchySources: [SOURCES.monongahelaNps, SOURCES.monongahelaBeaujeu],
    startYear: 1755,
    conflictType: "colonial",
    scale: "internacional",
    participants: [
      { side: "Ejercito britanico y tropas coloniales", members: ["Reino Unido", "Colonias britanicas de America del Norte"] },
      { side: "Fuerzas francesas y aliadas indigenas", members: ["Francia", "Naciones indigenas aliadas"] }
    ],
    cause: "La expedicion de Edward Braddock avanzaba hacia Fort Duquesne para desalojar a Francia del valle del Ohio.",
    outcome: "Las fuerzas francesas e indigenas derrotaron a la columna britanica el 9 de julio; Braddock quedo herido de muerte y los supervivientes se retiraron.",
    consequences: "La derrota abrio la frontera a nuevos ataques y extendio la guerra en el valle del Ohio, aunque Francia perderia sus colonias norteamericanas al cierre del conflicto.",
    chronology: [
      { year: 1755, event: "El 9 de julio la columna de Braddock cruzo el Monongahela cerca de Fort Duquesne." },
      { year: 1755, event: "Tras varias horas de combate, la fuerza britanica se retiro de forma desorganizada." }
    ],
    treaties: ["Tratado de Paris (1763)"],
    curationNote: "Se conserva la diversidad de la coalicion francesa e indigena y no se proyecta la categoria estatal estadounidense sobre combatientes coloniales de 1755."
  }),
  "Batalla de Wandiwash (1760)": historicalFix({
    parent: "Guerra de los Siete Anos",
    campaign: "Tercera guerra carnática (1757-1763)",
    region: "Vandavasi, Tamil Nadu, India",
    hierarchySources: [SOURCES.wandiwashNam, SOURCES.wandiwashMap],
    startYear: 1760,
    type: "batalla campal",
    conflictType: "colonial",
    scale: "internacional",
    participants: [
      { side: "Compania Britanica de las Indias Orientales y aliados", members: ["Reino Unido", "Fuerzas de la Compania Britanica de las Indias Orientales"] },
      { side: "Compania Francesa de las Indias Orientales y aliados", members: ["Francia", "Fuerzas de la Compania Francesa de las Indias Orientales", "Aliados indios y marathas"] }
    ],
    cause: "Las fuerzas britanicas acudieron a levantar el sitio frances de Wandiwash dentro de la lucha por el Carnatic durante la guerra de los Siete Anos.",
    outcome: "La fuerza de Eyre Coote vencio a la coalicion francesa el 22 de enero y dejo a Pondicherry expuesta a un asedio posterior.",
    consequences: "La victoria acelero la perdida de la capacidad francesa en el sur de India y contribuyo a la rendicion de Pondicherry en 1761.",
    chronology: [
      { year: 1760, event: "El 22 de enero las fuerzas de Eyre Coote derrotaron a la coalicion francesa en Wandiwash." },
      { year: 1760, event: "La retirada francesa facilito la posterior concentracion britanica contra Pondicherry." }
    ],
    treaties: ["Tratado de Paris (1763)"],
    curationNote: "La jerarquia une la tercera guerra carnática con el marco global de la guerra de los Siete Anos y evita reducir el combate a una confrontacion exclusivamente europea."
  }),
  "Batalla de Omdurmán (1898)": historicalFix({
    parent: "Guerra mahdista (1881-1899)",
    campaign: "Reconquista anglo-egipcia del Sudan (1896-1898)",
    region: "Omdurman, Sudan",
    hierarchySources: [SOURCES.omdurmanNam, SOURCES.omdurmanKitchener],
    startYear: 1898,
    conflictType: "colonial",
    scale: "regional",
    participants: [
      { side: "Ejercito anglo-egipcio", members: ["Reino Unido", "Ejercito egipcio"] },
      { side: "Estado mahdista", members: ["Fuerzas del califa Abdallahi ibn Muhammad"] }
    ],
    cause: "El ejercito anglo-egipcio avanzo sobre Omdurman para derrotar al Estado mahdista y recuperar el control de Sudan tras su campana por el Nilo.",
    outcome: "El 2 de septiembre el ejercito de Kitchener obtuvo una victoria decisiva sobre las fuerzas mahdistas y destruyo su capacidad de operar como ejercito convencional.",
    consequences: "La batalla quebranto el poder militar mahdista; el califa siguio en fuga hasta 1899 mientras la administracion anglo-egipcia se reimpuso en Sudan.",
    chronology: [
      { year: 1898, event: "El 2 de septiembre el ejercito anglo-egipcio enfrento a las fuerzas mahdistas cerca de Omdurman." },
      { year: 1898, event: "La derrota mahdista permitio a la fuerza de Kitchener consolidar el control sobre Jartum y Omdurman." }
    ],
    treaties: [],
    curationNote: "Se clasifica como guerra colonial y no como choque puramente bilateral: el Estado mahdista y las fuerzas egipcias se nombran de forma separada para no borrar su agencia historica."
  }),
  "Batalla de Qurna (1914)": historicalFix({
    parent: "Primera Guerra Mundial",
    campaign: "Campana de Mesopotamia (1914-1918)",
    region: "Al-Qurna, Mesopotamia, actual Irak",
    hierarchySources: [SOURCES.qurnaIwm, SOURCES.qurnaAwm],
    startYear: 1914,
    type: "batalla fluvial",
    scale: "mundial",
    participants: [
      { side: "Fuerzas britanicas e indias", members: ["Imperio britanico", "Ejercito de la India britanica"] },
      { side: "Fuerzas otomanas", members: ["Imperio otomano"] }
    ],
    cause: "Tras ocupar Basora, las fuerzas britanicas e indias avanzaron por los rios Tigris y Eufrates para asegurar la posicion y las rutas proximas a los campos petroleros.",
    outcome: "Las fuerzas britanicas e indias tomaron Qurna entre el 3 y el 9 de diciembre, obligando a las tropas otomanas a abandonar la posicion.",
    consequences: "La captura amplio la cabeza de puente aliada en Mesopotamia y abrio la secuencia de operaciones hacia Amara, Kut y posteriormente Bagdad.",
    chronology: [
      { year: 1914, event: "El 3 de diciembre comenzo la ofensiva britanico-india sobre Qurna." },
      { year: 1914, event: "El 9 de diciembre las fuerzas otomanas abandonaron la posicion y Qurna quedo bajo control britanico." }
    ],
    treaties: ["Armisticio de Mudros (1918)"],
    curationNote: "La ficha identifica al Imperio otomano y al Ejercito de la India britanica, sin tratar a Irak o Turquia actuales como beligerantes directos de 1914."
  }),
  "Batalla naval de Jumunjin (1950)": historicalFix({
    parent: "Guerra de Corea",
    campaign: "Operaciones navales iniciales de Corea de 1950",
    region: "Mar del Japon, frente a Chumunjin, Corea",
    hierarchySources: [SOURCES.jumunjinNavy, SOURCES.jumunjinHgram],
    startYear: 1950,
    type: "batalla naval",
    scale: "internacional",
    participants: [
      { side: "Buques de las Naciones Unidas", members: ["Estados Unidos", "Reino Unido"] },
      { side: "Marina norcoreana", members: ["Corea del Norte"] }
    ],
    cause: "Buques estadounidenses y britanicos operaban frente a la costa coreana tras la invasion norcoreana, cuando fueron atacados por lanchas torpederas de Corea del Norte.",
    outcome: "La fuerza naval de las Naciones Unidas destruyo o neutralizo las embarcaciones atacantes y mantuvo la superioridad naval frente a Corea del Norte.",
    consequences: "El combate confirmo la incapacidad norcoreana para disputar de forma sostenida el control aliado del mar durante la fase inicial de la guerra.",
    chronology: [
      { year: 1950, event: "El 2 de julio lanchas torpederas norcoreanas atacaron a la fuerza naval aliada frente a Chumunjin." },
      { year: 1950, event: "Los buques de Estados Unidos y Reino Unido rechazaron el ataque y continuaron las operaciones costeras." }
    ],
    treaties: ["Acuerdo de Armisticio de Corea (1953)"],
    curationNote: "La fuente naval estadounidense usa la forma Chumonchin Chan; se conserva Jumunjin como rotulo hispanizado y se explicita que fue una accion naval, no una batalla terrestre."
  }),
  "Batalla de la bahía de Heligoland (1914)": historicalFix({
    parent: "Primera Guerra Mundial",
    campaign: "Operaciones navales del mar del Norte de 1914",
    region: "Bahia de Heligoland, mar del Norte",
    hierarchySources: [SOURCES.heligolandIwm, SOURCES.heligolandCollection],
    startYear: 1914,
    type: "batalla naval",
    scale: "mundial",
    participants: [
      { side: "Royal Navy", members: ["Reino Unido"] },
      { side: "Armada Imperial alemana", members: ["Imperio aleman"] }
    ],
    cause: "La Royal Navy entro en la bahia de Heligoland para atacar patrullas y fuerzas ligeras alemanas al comienzo de la guerra naval en el mar del Norte.",
    outcome: "La accion del 28 de agosto termino en victoria britanica y con la perdida de varios buques alemanes, aunque la niebla y las comunicaciones dificultaron el mando de ambos bandos.",
    consequences: "Fue la primera gran accion naval de la Primera Guerra Mundial y reforzo la confianza britanica en el bloqueo y la supremacia naval en el mar del Norte.",
    chronology: [
      { year: 1914, event: "El 28 de agosto las fuerzas britanicas penetraron en la bahia de Heligoland." },
      { year: 1914, event: "La retirada alemana cerro la accion con una victoria naval britanica." }
    ],
    treaties: ["Tratado de Versalles (1919)"],
    curationNote: "El ano es parte del nombre canonico para distinguir esta batalla naval de 1914 de otros combates posteriores en la misma zona."
  }),
  "Primera batalla de Maryang San (1951)": historicalFix({
    parent: "Guerra de Corea",
    campaign: "Operacion Commando de 1951",
    region: "Maryang San, al norte del rio Imjin, Corea",
    hierarchySources: [SOURCES.maryangAwm, SOURCES.maryangOperation],
    startYear: 1951,
    type: "batalla por una altura",
    scale: "internacional",
    participants: [
      { side: "Fuerzas de la Commonwealth y de las Naciones Unidas", members: ["Australia", "Reino Unido", "Nueva Zelanda", "Estados Unidos"] },
      { side: "Fuerzas chinas", members: ["Republica Popular China"] }
    ],
    cause: "La Operacion Commando busco enderezar el frente al norte del Imjin y desalojar a las fuerzas chinas de las alturas que dominaban el sector.",
    outcome: "Entre el 3 y el 8 de octubre, el 3er Batallon del Regimiento Real Australiano tomo y sostuvo Maryang San frente a contraataques chinos.",
    consequences: "La victoria tactica mejoro la posicion de la Commonwealth durante las negociaciones de armisticio y precedio a una fase de guerra de posiciones en el frente coreano.",
    chronology: [
      { year: 1951, event: "El 3 de octubre comenzo el asalto sobre la altura 317 de Maryang San dentro de la Operacion Commando." },
      { year: 1951, event: "El 8 de octubre las fuerzas australianas conservaron la altura tras repeler contraataques chinos." }
    ],
    treaties: ["Acuerdo de Armisticio de Corea (1953)"],
    curationNote: "Se conserva Primera para diferenciar esta accion de la segunda batalla de Maryang San de noviembre de 1951. El apoyo neozelandes y estadounidense se identifica sin atribuirles el asalto principal del 3er Batallon australiano."
  })
};
