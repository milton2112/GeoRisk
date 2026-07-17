function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  carrizalCampaign: source(
    "Centro de Historia Militar del Ejército de EE. UU.: expedición mexicana de 1916-1917",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Mexican-Expedition/"
  ),
  carrizalHistory: source(
    "Centro de Historia Militar del Ejército de EE. UU.: estudio histórico de la expedición mexicana y Carrizal",
    "https://history.army.mil/portals/143/Images/Publications/catalog/77-1.pdf"
  ),
  hamelExhibit: source(
    "Memorial de Guerra Australiano: batalla de Hamel del 4 de julio de 1918",
    "https://www.awm.gov.au/visit/exhibitions/1918/battles/hamel"
  ),
  hamelCollection: source(
    "Memorial de Guerra Australiano: ficha documental de la batalla de Hamel",
    "https://www.awm.gov.au/collection/E84323"
  ),
  hill282Iwm: source(
    "Imperial War Museums: combate de la colina 282 y ataque aéreo aliado erróneo",
    "https://www.iwm.org.uk/history/cold-war/korean-war/voices"
  ),
  hill282Korea: source(
    "República de Corea: referencia histórica a la tragedia de la colina 282",
    "https://www.korea.net/Events/Overseas/view?articleId=854"
  ),
  nogalesNps: source(
    "Servicio de Parques Nacionales de EE. UU.: cronología del 10.º de Caballería y combate de Ambos Nogales",
    "https://home.nps.gov/fols/learn/historyculture/10th-cavalry-timeline.htm"
  ),
  nogalesCampaign: source(
    "Centro de Historia Militar del Ejército de EE. UU.: incidentes fronterizos posteriores a la expedición mexicana",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Mexican-Expedition/"
  ),
  pontchartrainNavy: source(
    "Historia Naval y Patrimonio de EE. UU.: captura de la West Florida en el lago Pontchartrain",
    "https://www.history.navy.mil/research/histories/ship-histories/danfs/w/west-florida.html"
  ),
  pontchartrainFranklin: source(
    "Founders Online: referencia documental a la captura de la West Florida por la Morris",
    "https://founders.archives.gov/documents/Franklin/01-34-02-0069"
  ),
  portAuPrinceUsmc: source(
    "Universidad del Cuerpo de Marines de EE. UU.: cronología de la batalla de Puerto Príncipe de 1919",
    "https://www.usmcu.edu/Portals/218/HD%20MCUP/HD%20Pubs/A%20Concise%20History%20Of%20The%20United%20States%20Marine%20Corps%201775-1969.pdf?ver=2019-02-01-111807-827"
  ),
  portAuPrinceNavy: source(
    "Historia Naval y Patrimonio de EE. UU.: ocupación estadounidense de Haití y ataque caco a Puerto Príncipe",
    "https://www.history.navy.mil/research/library/online-reading-room/title-list-alphabetically/u/us-occupation-of-haiti-1915-1934.html"
  ),
  shimonosekiHgram: source(
    "Historia Naval y Patrimonio de EE. UU.: acciones de Wyoming y segunda acción del estrecho de Shimonoseki",
    "https://www.history.navy.mil/content/dam/nhhc/about-us/leadership/hgram_pdfs/H-Gram_063.pdf"
  ),
  shimonosekiNavy: source(
    "Historia Naval y Patrimonio de EE. UU.: cronología de las intervenciones extranjeras en Shimonoseki",
    "https://www.history.navy.mil/research/library/online-reading-room/title-list-alphabetically/d/development-of-japanese-sea-power-cincpoa-93-45.html"
  ),
  sanJuanBombardment: source(
    "Historia Naval y Patrimonio de EE. UU.: bombardeo de San Juan de Puerto Rico de 1898",
    "https://www.history.navy.mil/research/publications/documentary-histories/united-states-navy-s/bombardment-of-san-j.html"
  ),
  sanJuanBlockade: source(
    "Historia Naval y Patrimonio de EE. UU.: bloqueo de Puerto Rico y consecuencias del bombardeo",
    "https://www.history.navy.mil/research/publications/documentary-histories/united-states-navy-s/blockade-of-puerto-r.html"
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
    curationBatch: "source-backed-us-global-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de El Carrizal": "Combate de Carrizal (1916)",
  "Batalla de Hamel": "Batalla de Hamel (1918)",
  "Batalla de Hill 282": "Batalla de la colina 282 (1950)",
  "Batalla de Nogales": "Batalla de Ambos Nogales (1918)",
  "Batalla del Lago Pontchartrain": "Combate naval del lago Pontchartrain (1779)",
  "Batalla de Port-au-Prince": "Batalla de Puerto Príncipe (1919)",
  "Batalla de Shimonoseki Straits": "Batalla naval del estrecho de Shimonoseki (1863)",
  "Bombardeo de Shimonoseki": "Bombardeo multinacional de Shimonoseki (1864)",
  "Segunda batalla de San Juan": "Bombardeo de San Juan de Puerto Rico (1898)",
  "Bombardeo de San Juan": "Bombardeo de San Juan de Puerto Rico (1898)"
};

export const US_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  México: ["Combate de Carrizal (1916)", "Batalla de Ambos Nogales (1918)"],
  Australia: ["Batalla de Hamel (1918)"],
  Francia: ["Batalla de Hamel (1918)", "Bombardeo multinacional de Shimonoseki (1864)"],
  "Reino Unido": [
    "Batalla de Hamel (1918)",
    "Batalla de la colina 282 (1950)",
    "Combate naval del lago Pontchartrain (1779)",
    "Bombardeo multinacional de Shimonoseki (1864)"
  ],
  Alemania: ["Batalla de Hamel (1918)"],
  "Corea del Sur": ["Batalla de la colina 282 (1950)"],
  "Corea del Norte": ["Batalla de la colina 282 (1950)"],
  Haití: ["Batalla de Puerto Príncipe (1919)"],
  Japón: [
    "Batalla naval del estrecho de Shimonoseki (1863)",
    "Bombardeo multinacional de Shimonoseki (1864)"
  ],
  España: ["Bombardeo de San Juan de Puerto Rico (1898)"]
};

export const US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Combate de Carrizal (1916)": historicalFix({
    parent: "Expedición punitiva estadounidense en México (1916-1917)",
    campaign: "Operaciones de Chihuahua de 1916",
    region: "Carrizal, Chihuahua, México",
    hierarchySources: [SOURCES.carrizalCampaign, SOURCES.carrizalHistory],
    startYear: 1916,
    type: "combate fronterizo",
    conflictType: "frontera",
    participants: [
      { side: "Destacamento estadounidense", members: ["Estados Unidos"] },
      { side: "Fuerzas constitucionalistas mexicanas", members: ["México"] }
    ],
    cause: "Una columna estadounidense avanzó cerca de Carrizal durante la expedición punitiva; las fuerzas constitucionalistas intentaron impedir el paso de la unidad hacia el sur.",
    outcome: "El destacamento estadounidense fue rechazado con bajas y prisioneros, y el choque elevó temporalmente el riesgo de una guerra abierta entre ambos gobiernos.",
    consequences: "La crisis se encauzó por negociación y la expedición estadounidense se retiró de México en 1917 sin capturar a Pancho Villa.",
    chronology: [
      { year: 1916, event: "El 21 de junio una columna del 10.º de Caballería estadounidense se enfrentó con fuerzas mexicanas en Carrizal." },
      { year: 1916, event: "Los prisioneros estadounidenses fueron liberados después de intercambios diplomáticos entre los gobiernos." }
    ],
    treaties: [],
    related: ["Revolución mexicana"],
    curationNote: "Se trata como combate fronterizo de la expedición punitiva y no como una batalla de la guerra civil estadounidense. El desenlace diplomático posterior no equivale a un tratado de cierre específico."
  }),
  "Batalla de Hamel (1918)": historicalFix({
    parent: "Primera Guerra Mundial",
    campaign: "Ofensiva del Somme de 1918",
    region: "Le Hamel, Somme, Francia",
    hierarchySources: [SOURCES.hamelExhibit, SOURCES.hamelCollection],
    startYear: 1918,
    participants: [
      { side: "Fuerzas aliadas", members: ["Australia", "Estados Unidos", "Reino Unido"] },
      { side: "Imperio alemán", members: ["Alemania"] }
    ],
    cause: "El mando aliado buscó enderezar la línea cerca de Amiens, negar la observación alemana sobre Villers-Bretonneux y preparar operaciones ofensivas posteriores.",
    outcome: "Las fuerzas australianas, con compañías estadounidenses adscritas y apoyo británico, tomaron todos sus objetivos en una acción limitada y coordinada.",
    consequences: "Hamel consolidó métodos de coordinación entre infantería, artillería, tanques y aviación que influyeron en las ofensivas aliadas del verano de 1918.",
    chronology: [
      { year: 1918, event: "El Cuerpo Australiano lanzó el ataque sobre Hamel el 4 de julio con tropas estadounidenses adscritas." },
      { year: 1918, event: "La fuerza aliada aseguró los objetivos en pocas horas y capturó numerosos prisioneros alemanes." }
    ],
    treaties: ["Tratado de Versalles (1919)"],
    curationNote: "Estados Unidos se conserva como participante por las cuatro compañías adscritas al ataque; Francia se vincula en la ficha nacional por localización, no como fuerza de combate identificada en esta acción."
  }),
  "Batalla de la colina 282 (1950)": historicalFix({
    parent: "Guerra de Corea",
    campaign: "Perímetro de Pusan y ruptura del Naktong",
    region: "Colina 282, cerca de Songju, Corea del Sur",
    hierarchySources: [SOURCES.hill282Iwm, SOURCES.hill282Korea],
    startYear: 1950,
    type: "batalla por una altura",
    scale: "internacional",
    participants: [
      { side: "Fuerzas de la ONU", members: ["Reino Unido", "Estados Unidos"] },
      { side: "Fuerzas norcoreanas", members: ["Corea del Norte"] }
    ],
    cause: "La 27.ª Brigada de la Commonwealth atacó las alturas próximas al Naktong para apoyar la ruptura del perímetro de Pusan por el Octavo Ejército de Estados Unidos.",
    outcome: "La infantería británica tomó inicialmente la altura, pero un ataque aéreo estadounidense erróneo y el contraataque norcoreano obligaron a abandonar la posición.",
    consequences: "El episodio se convirtió en un caso documentado de fuego amigo dentro de las operaciones de la ONU y marcó a la brigada británica durante la campaña de 1950.",
    chronology: [
      { year: 1950, event: "El 23 de septiembre los Argyll and Sutherland Highlanders atacaron y alcanzaron la cima de la colina 282." },
      { year: 1950, event: "Aviones estadounidenses atacaron por error la posición británica; el contraataque norcoreano recuperó la altura." }
    ],
    treaties: ["Acuerdo de Armisticio de Corea (1953)"],
    sourceDispute: true,
    curationNote: "La participación estadounidense se limita al apoyo aéreo y al ataque amigo documentado, no a una fuerza terrestre en la cima. Las cifras de bajas varían entre relatos y por eso no se consolidan."
  }),
  "Batalla de Ambos Nogales (1918)": historicalFix({
    parent: "Revolución mexicana",
    campaign: "Incidentes fronterizos México-Estados Unidos de 1918",
    region: "Nogales, Arizona, Estados Unidos, y Nogales, Sonora, México",
    hierarchySources: [SOURCES.nogalesNps, SOURCES.nogalesCampaign],
    startYear: 1918,
    type: "combate fronterizo",
    conflictType: "frontera",
    participants: [
      { side: "Fuerzas estadounidenses", members: ["Estados Unidos"] },
      { side: "Fuerzas mexicanas y combatientes locales", members: ["México"] }
    ],
    cause: "Un incidente de control fronterizo escaló en un tiroteo en las dos ciudades de Nogales durante la inestabilidad regional posterior a la expedición punitiva.",
    outcome: "Los combates terminaron tras la toma estadounidense de posiciones elevadas y la restauración de control fronterizo; no resolvieron por sí solos la crisis política mexicana.",
    consequences: "La acción aceleró medidas físicas de separación en la frontera urbana y quedó ligada a la secuencia de incidentes fronterizos de 1917-1919.",
    chronology: [
      { year: 1918, event: "El 27 de agosto el tiroteo cruzó la frontera entre las dos ciudades de Nogales." },
      { year: 1918, event: "Las autoridades restablecieron el control al finalizar la jornada de combate." }
    ],
    treaties: [],
    sourceDispute: true,
    curationNote: "Se emplea el nombre Ambos Nogales para reflejar que el combate ocurrió a ambos lados de la frontera. Las versiones sobre asesores extranjeros, bajas y desencadenante inmediato difieren, por lo que no se fijan como hechos cerrados."
  }),
  "Combate naval del lago Pontchartrain (1779)": historicalFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña de la costa del Golfo de 1779",
    region: "Lago Pontchartrain, actual Luisiana, Estados Unidos",
    hierarchySources: [SOURCES.pontchartrainNavy, SOURCES.pontchartrainFranklin],
    startYear: 1779,
    type: "combate naval",
    conflictType: "independencia",
    participants: [
      { side: "Fuerzas continentales", members: ["Estados Unidos"] },
      { side: "Sloop británico West Florida", members: ["Reino de Gran Bretaña"] }
    ],
    cause: "La embarcación continental Morris salió desde Nueva Orleans para hostigar la presencia británica en las aguas del lago Pontchartrain.",
    outcome: "La Morris capturó al sloop británico West Florida después de un combate intenso entre ambas embarcaciones.",
    consequences: "La captura redujo la presencia naval británica en el lago y reforzó la actividad continental en el golfo durante la campaña de 1779.",
    chronology: [
      { year: 1779, event: "La Morris se enfrentó a la West Florida en el lago Pontchartrain durante septiembre." },
      { year: 1779, event: "La West Florida fue tomada como presa y luego entró en servicio continental." }
    ],
    treaties: ["Tratado de París (1783)"],
    curationNote: "Se registra como combate naval de una sola nave y no se fijan cifras de hombres o bajas: las fuentes disponibles discrepan sobre la dotación y el armamento de las embarcaciones."
  }),
  "Batalla de Puerto Príncipe (1919)": historicalFix({
    parent: "Ocupación estadounidense de Haití (1915-1934)",
    campaign: "Segunda guerra caco de 1918-1920",
    region: "Puerto Príncipe, Haití",
    hierarchySources: [SOURCES.portAuPrinceUsmc, SOURCES.portAuPrinceNavy],
    startYear: 1919,
    type: "ataque urbano",
    conflictType: "insurgencia",
    participants: [
      { side: "Marines estadounidenses y Gendarmería de Haití", members: ["Estados Unidos", "Haití"] },
      { side: "Insurgentes cacos", members: ["Cacos haitianos"] }
    ],
    cause: "Los cacos atacaron la capital durante la segunda insurrección contra el orden sostenido por la ocupación estadounidense y la Gendarmería haitiana.",
    outcome: "Las fuerzas de ocupación y la Gendarmería repelieron el ataque a Puerto Príncipe; la insurgencia continuó fuera de la capital durante la campaña.",
    consequences: "El combate reforzó las operaciones contra los cacos y precedió a la captura y muerte de Charlemagne Péralte en la fase final de la insurrección.",
    chronology: [
      { year: 1919, event: "Los cacos atacaron Puerto Príncipe a comienzos de octubre." },
      { year: 1919, event: "La defensa de Marines y Gendarmería mantuvo el control de la capital y la campaña siguió en el interior haitiano." }
    ],
    treaties: [],
    sourceDispute: true,
    curationNote: "La cronología institucional del Cuerpo de Marines usa el 7 de octubre, mientras otras reconstrucciones sitúan el combate entre el 6 y el 7. Se conserva el año sin cerrar una fecha diaria ni cifras de bajas discutidas."
  }),
  "Batalla naval del estrecho de Shimonoseki (1863)": historicalFix({
    parent: "Crisis de Shimonoseki (1863-1864)",
    campaign: "Acción del USS Wyoming de 1863",
    region: "Estrecho de Shimonoseki, Honshu, Japón",
    hierarchySources: [SOURCES.shimonosekiHgram, SOURCES.shimonosekiNavy],
    startYear: 1863,
    type: "batalla naval",
    scale: "internacional",
    participants: [
      { side: "Armada de Estados Unidos", members: ["Estados Unidos"] },
      { side: "Dominio de Chōshū", members: ["Japón"] }
    ],
    cause: "El USS Wyoming respondió a los ataques del dominio de Chōshū contra la navegación extranjera en el estrecho de Shimonoseki.",
    outcome: "El Wyoming dañó o hundió buques de Chōshū y se retiró tras el combate, obteniendo una ventaja táctica sin resolver la crisis diplomática.",
    consequences: "La acción fue seguida por intervenciones francesas y por el bombardeo multinacional de 1864, que no debe confundirse con este combate de 1863.",
    chronology: [
      { year: 1863, event: "El USS Wyoming entró en el estrecho de Shimonoseki y combatió contra buques y baterías de Chōshū." },
      { year: 1863, event: "Tras la acción, la crisis continuó y otras potencias extranjeras prepararon nuevas operaciones en la zona." }
    ],
    treaties: [],
    curationNote: "Se conserva como acción estadounidense de 1863 y se separa del bombardeo multinacional de 1864. El actor japonés se expresa como dominio de Chōshū para no proyectar sin matices el Estado japonés moderno sobre la participación histórica."
  }),
  "Bombardeo multinacional de Shimonoseki (1864)": historicalFix({
    parent: "Crisis de Shimonoseki (1863-1864)",
    campaign: "Intervención multinacional en Shimonoseki de 1864",
    region: "Estrecho de Shimonoseki, Honshu, Japón",
    hierarchySources: [SOURCES.shimonosekiHgram, SOURCES.shimonosekiNavy],
    startYear: 1864,
    type: "bombardeo naval",
    scale: "internacional",
    participants: [
      { side: "Escuadra multinacional", members: ["Reino Unido", "Francia", "Reino de los Países Bajos", "Estados Unidos"] },
      { side: "Dominio de Chōshū", members: ["Japón"] }
    ],
    cause: "Las potencias extranjeras buscaron abrir el estrecho a la navegación tras los ataques de Chōshū a buques extranjeros y el combate estadounidense de 1863.",
    outcome: "La escuadra multinacional destruyó o inutilizó defensas de Chōshū y forzó una negociación para reabrir el paso marítimo.",
    consequences: "La intervención redujo la capacidad de Chōshū para cerrar el estrecho y consolidó la presión extranjera sobre el Japón del bakumatsu.",
    chronology: [
      { year: 1864, event: "La escuadra británica, francesa, neerlandesa y de participación estadounidense limitada atacó las defensas de Shimonoseki." },
      { year: 1864, event: "Chōshū aceptó negociar la reapertura del estrecho después de la derrota de sus baterías." }
    ],
    treaties: [],
    curationNote: "La participación estadounidense fue limitada frente al peso de las fuerzas británicas, francesas y neerlandesas. Se evita tratarla como equivalente a la acción unilateral del USS Wyoming de 1863."
  }),
  "Bombardeo de San Juan de Puerto Rico (1898)": historicalFix({
    parent: "Guerra hispano-estadounidense",
    campaign: "Bloqueo de Puerto Rico de 1898",
    region: "San Juan, Puerto Rico",
    hierarchySources: [SOURCES.sanJuanBombardment, SOURCES.sanJuanBlockade],
    startYear: 1898,
    type: "bombardeo naval",
    participants: [
      { side: "Escuadra de Estados Unidos", members: ["Estados Unidos"] },
      { side: "Defensas españolas de Puerto Rico", members: ["España"] }
    ],
    cause: "La escuadra estadounidense buscó localizar a la flota española y evaluar las defensas de San Juan durante la campaña caribeña de 1898.",
    outcome: "La flota estadounidense bombardeó las fortificaciones y se retiró sin encontrar a la escuadra española; los daños materiales fueron limitados y no se tomó la ciudad.",
    consequences: "El ataque impulsó ajustes defensivos españoles y dio paso al bloqueo y a las operaciones conjuntas posteriores sobre Puerto Rico.",
    chronology: [
      { year: 1898, event: "La escuadra estadounidense bombardeó San Juan el 12 de mayo mientras buscaba a la fuerza naval española." },
      { year: 1898, event: "Los buques estadounidenses se retiraron y continuaron las operaciones de bloqueo alrededor de Puerto Rico." }
    ],
    treaties: ["Tratado de París (1898)"],
    curationNote: "Se unifican los rótulos Segunda batalla de San Juan y Bombardeo de San Juan bajo un nombre geográfico y anual preciso. No se confunde esta acción naval con las colinas de San Juan en Cuba."
  })
};
