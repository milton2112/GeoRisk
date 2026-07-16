function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  kenapacomaqua: source(
    "Departamento de Transporte de Indiana: informe arqueológico del sitio Ehler y la incursión de 1791",
    "https://www.in.gov/indot/files/Ehler%20Site%20%2812HU1022%29%20-%20Mann%201996%20-%20final%20public%20version.pdf"
  ),
  claremoreMound: source(
    "Sociedad Histórica de Oklahoma: masacre de Claremore Mound",
    "https://www.okhistory.org/publications/enc/entry?entry=CL003"
  ),
  sinkHole: source(
    "Historia del condado de St. Charles: carta contemporánea sobre Sink Hole",
    "https://stcharlescountyhistory.org/2025/06/05/may-27-1815/",
    "media"
  ),
  sinkHoleGeology: source(
    "Sociedad Geológica de Estados Unidos: localización histórica de Sink Hole",
    "https://gsa.confex.com/gsa/2011NE/webprogram/Paper185734.html",
    "media"
  ),
  banderaPass: source(
    "Briscoe Center de la Universidad de Texas: revisión crítica de la tradición de Bandera Pass",
    "https://notevenpast.org/the-battle-of-bandera-pass-and-the-making-of-lone-star-legend/",
    "media"
  ),
  cookesSpring: source(
    "Registro biográfico de graduados de West Point: Alfred Gibbs y Cooke's Spring",
    "https://penelope.uchicago.edu/Thayer/E/Gazetteer/Places/America/United_States/Army/USMA/Cullums_Register/1313%2A.html",
    "media"
  ),
  cookesSpringNps: source(
    "Servicio de Parques Nacionales de Estados Unidos: estaciones de la ruta Butterfield",
    "https://home.nps.gov/articles/000/butterfield-overland-trail-stage-stations.htm",
    "media"
  ),
  pimaButte: source(
    "University of Arizona Press: Massacre on the Gila, capítulo sobre Pima Butte",
    "https://open.uapress.arizona.edu/read/massacre-on-the-gila/section/1b521ec8-c496-4a45-9354-48422c732a35"
  ),
  devilsRiver: source(
    "Comisión Histórica de Texas: marcador del combate del río Devils",
    "https://atlas.thc.state.tx.us/Details/5465002556/print"
  ),
  devilsRiverTsha: source(
    "Asociación Histórica del Estado de Texas: John Bell Hood",
    "https://www.tshaonline.org/handbook/entries/hood-john-bell",
    "media"
  ),
  owyheeRiver: source(
    "Sociedad Histórica del Estado de Idaho: síntesis documental de la Guerra Snake",
    "https://history.idaho.gov/wp-content/uploads/0236.pdf",
    "media"
  ),
  owyheeRiverNps: source(
    "Servicio de Parques Nacionales de Estados Unidos: Primer Regimiento de Caballería de Oregón",
    "https://www.nps.gov/civilwar/search-battle-units-detail.htm?battleUnitCode=UOR0001RC",
    "media"
  ),
  prairieDogCreek: source(
    "Servicio de Parques Nacionales de Estados Unidos: operaciones de agosto de 1867",
    "https://www.nps.gov/waba/learn/historyculture/august-1867.htm"
  ),
  honsingerBluff: source(
    "Servicio de Parques Nacionales de Estados Unidos: Rain-in-the-Face y la expedición de Yellowstone",
    "https://home.nps.gov/libi/learn/historyculture/rain-in-the-face.htm",
    "media"
  )
};

function conflictFix({
  parent,
  campaign,
  region,
  hierarchySources,
  startYear,
  participants,
  cause,
  outcome,
  consequences,
  type = "combate",
  conflictType = "frontera",
  scale = "local",
  treaties = [],
  related = [],
  chronology,
  curationNote,
  datePrecision,
  sourceDispute = false
}) {
  const sources = Array.isArray(hierarchySources) ? hierarchySources : [hierarchySources];
  const confidence = sources.some(item => item.confidence === "media") ? "media" : "alta";

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
    chronology: chronology || [{ year: startYear, event: outcome }],
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: confidence,
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-us-frontier-second-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    ...(curationNote ? { curationNote } : {}),
    ...(datePrecision ? { datePrecision } : {}),
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Kenapacomaqua": "Ataque a Kenapacomaqua (1791)",
  "Batalla de Claremore Mound": "Masacre de Claremore Mound (1817)",
  "Batalla de Sink Hole": "Combate de Sink Hole (1815)",
  "Batalla de Bandera Pass": "Combate atribuido de Bandera Pass (c. 1842)",
  "Batalla de Cooke's Spring": "Escaramuza de Cooke's Spring (1857)",
  "Batalla de Pima Butte": "Batalla de Pima Butte (1857)",
  "Batalla de Devil's River": "Combate del río Devils (1857)",
  "Batalla de Owyhee River": "Batalla del río Owyhee (1866)",
  "Batalla de Prairie Dog Creek": "Combate de Prairie Dog Creek (1867)",
  "Batalla de Honsinger Bluff": "Combate de Honsinger Bluff (1873)"
};

export const US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Ataque a Kenapacomaqua (1791)": conflictFix({
    parent: "Guerra indígena del Noroeste",
    campaign: "Incursión de Wilkinson al río Eel de 1791",
    region: "Kenapacomaqua, río Eel, actual Indiana, Estados Unidos",
    hierarchySources: SOURCES.kenapacomaqua,
    startYear: 1791,
    type: "ataque a poblado",
    conflictType: "colonial",
    participants: [
      { side: "Milicia montada de Kentucky", members: ["Estados Unidos", "Milicia de Kentucky"] },
      { side: "Habitantes wea y miami de Kenapacomaqua", members: ["Wea", "Miami"] }
    ],
    cause: "James Wilkinson dirigió una incursión punitiva contra asentamientos indígenas del valle del Wabash durante la Guerra indígena del Noroeste.",
    outcome: "La milicia sorprendió el poblado el 7 de agosto, mató a varios habitantes, tomó cautivos y destruyó viviendas y provisiones.",
    consequences: "La incursión desplazó a la comunidad y amplió el ciclo de ataques contra poblados wea y miami antes de la campaña de Anthony Wayne.",
    chronology: [
      { year: 1791, event: "El 7 de agosto, la fuerza de Wilkinson atacó por sorpresa Kenapacomaqua y se retiró con decenas de cautivos." }
    ],
    curationNote: "La fuente oficial describe una incursión contra un poblado con mujeres y niños entre muertos y cautivos; se reemplaza la etiqueta genérica de batalla por ataque a poblado."
  }),
  "Masacre de Claremore Mound (1817)": conflictFix({
    parent: "Conflicto osage-cheroqui",
    campaign: "Ofensiva cheroqui de 1817",
    region: "Claremore Mound, río Verdigris, actual Oklahoma, Estados Unidos",
    hierarchySources: SOURCES.claremoreMound,
    startYear: 1817,
    type: "ataque y masacre",
    participants: [
      { side: "Cheroquis occidentales y orientales con aliados", members: ["Cheroqui", "Choctaw", "Chickasaw", "Lenape"] },
      { side: "Poblado osage de Claremore", members: ["Osage"] }
    ],
    cause: "La disputa prolongada por territorios de caza y asentamiento entre osage y chéroqui llevó a una ofensiva aliada contra el poblado de Claremore.",
    outcome: "En octubre, una fuerza chéroqui y aliada atacó el poblado escasamente defendido, mató a decenas de habitantes, tomó cautivos y lo incendió.",
    consequences: "La masacre profundizó el desplazamiento osage y la guerra intertribal; la resistencia continuó incluso después de la cesión territorial osage de 1825.",
    treaties: ["Tratado osage de 1825"],
    curationNote: "La Sociedad Histórica de Oklahoma indica que la mayoría de los hombres estaba cazando y que 69 de unas 80 víctimas eran mujeres y niños; por eso se corrige la clasificación de batalla."
  }),
  "Combate de Sink Hole (1815)": conflictFix({
    parent: "Guerra anglo-estadounidense de 1812",
    campaign: "Frontera del Misuri de 1815",
    region: "Cuivre River, cerca de la actual Old Monroe, Misuri, Estados Unidos",
    hierarchySources: [SOURCES.sinkHole, SOURCES.sinkHoleGeology],
    startYear: 1815,
    participants: [
      { side: "Rangers del territorio de Misuri", members: ["Estados Unidos", "Rangers de Misuri"] },
      { side: "Combatientes sauk y meskwaki asociados con Black Hawk", members: ["Sauk", "Meskwaki"] }
    ],
    cause: "La paz acordada en Gante todavía no había desmovilizado ni informado por completo a las fuerzas de la frontera del alto Misisipi.",
    outcome: "El 24 de mayo, ambos grupos combatieron alrededor de una depresión natural; la acción terminó sin un vencedor decisivo.",
    consequences: "Fue una de las últimas acciones vinculadas con la Guerra de 1812 y evidenció la persistencia de la violencia fronteriza después del tratado.",
    treaties: ["Tratado de Gante (1814)"],
    sourceDispute: true,
    curationNote: "Los relatos estadounidenses contemporáneos y las reconstrucciones posteriores difieren en bajas y secuencia; se conserva un resultado inconcluso y no se fija un total dudoso."
  }),
  "Combate atribuido de Bandera Pass (c. 1842)": conflictFix({
    parent: "Guerras comanches",
    campaign: "Enfrentamientos de los Texas Rangers de comienzos de la década de 1840",
    region: "Bandera Pass, probablemente actual condado de Kendall, Texas, Estados Unidos",
    hierarchySources: SOURCES.banderaPass,
    startYear: 1842,
    type: "combate atribuido",
    participants: [
      { side: "Texas Rangers atribuidos a John Coffee Hays", members: ["República de Texas", "Texas Rangers"] },
      { side: "Partida comanche descrita en relatos tardíos", members: ["Comanche"] }
    ],
    cause: "La tradición local lo sitúa en el ciclo de incursiones y patrullas entre Rangers y grupos comanches en la frontera texana.",
    outcome: "Los relatos tardíos atribuyen a los Rangers el rechazo de una fuerza comanche, pero no existe una fuente contemporánea que confirme la acción.",
    consequences: "El episodio se convirtió en una leyenda influyente sobre los Texas Rangers, aunque su fecha, lugar, participantes y escala siguen discutidos.",
    datePrecision: "aproximada y disputada",
    sourceDispute: true,
    curationNote: "La revisión de la Universidad de Texas no encontró informe militar, memoria contemporánea ni noticia de prensa que confirme el combate. Se conserva como tradición histórica y no como batalla demostrada."
  }),
  "Escaramuza de Cooke's Spring (1857)": conflictFix({
    parent: "Guerras apaches",
    campaign: "Operaciones desde Fort Fillmore de 1857",
    region: "Cooke's Spring, Black Range, territorio de Nuevo México, Estados Unidos",
    hierarchySources: [SOURCES.cookesSpring, SOURCES.cookesSpringNps],
    startYear: 1857,
    type: "escaramuza",
    participants: [
      { side: "Patrulla de Mounted Rifles de Alfred Gibbs", members: ["Estados Unidos", "Regimiento de Mounted Rifles"] },
      { side: "Pequeña partida apache", members: ["Apache"] }
    ],
    cause: "Una patrulla salió en persecución de una pequeña partida acusada de robar caballos cerca de la ruta de Cooke's Spring.",
    outcome: "La patrulla alcanzó al grupo y recuperó propiedad, pero Alfred Gibbs recibió una herida grave durante el choque.",
    consequences: "La acción formó parte de la creciente militarización de la ruta meridional antes de las campañas apaches de la década siguiente.",
    datePrecision: "8 o 9 de marzo de 1857 según la fuente",
    sourceDispute: true,
    curationNote: "Las fuentes secundarias difieren entre el 8 y el 9 de marzo y no consolidan bajas indígenas; se mantiene el año seguro y se evita inventar cifras."
  }),
  "Batalla de Pima Butte (1857)": conflictFix({
    parent: "Conflicto quechan-maricopa",
    campaign: "Ataque a Secate de 1857",
    region: "Maricopa Wells y Pima Butte, territorio de Nuevo México, actual Arizona, Estados Unidos",
    hierarchySources: SOURCES.pimaButte,
    startYear: 1857,
    type: "batalla intertribal",
    participants: [
      { side: "Coalición quechan con aliados", members: ["Quechan", "Mohave", "Yavapai", "Tonto Apache"] },
      { side: "Defensores maricopa y akimel o'odham", members: ["Maricopa", "Akimel O'odham"] }
    ],
    cause: "Rivalidades regionales y ataques previos impulsaron a una coalición quechan y aliada a atacar el poblado maricopa de Secate.",
    outcome: "El 1 de septiembre, los defensores maricopa y akimel o'odham rechazaron la ofensiva en un combate de gran escala con más de ochenta muertos según la síntesis académica.",
    consequences: "La derrota debilitó la capacidad ofensiva quechan en el valle del Gila y fue una de las últimas grandes batallas del Suroeste libradas exclusivamente por fuerzas indígenas.",
    curationNote: "La asociación con Estados Unidos es únicamente geográfica: la investigación de University of Arizona Press señala que no participaron militares ni civiles blancos en la batalla, aunque trabajadores del correo la observaron."
  }),
  "Combate del río Devils (1857)": conflictFix({
    parent: "Guerras comanches",
    campaign: "Patrullas del Segundo Regimiento de Caballería en Texas de 1857",
    region: "Cabeceras del río Devils, Texas, Estados Unidos",
    hierarchySources: [SOURCES.devilsRiver, SOURCES.devilsRiverTsha],
    startYear: 1857,
    participants: [
      { side: "Destacamento del Segundo Regimiento de Caballería", members: ["Estados Unidos"], casualties: "2 muertos y 5 heridos" },
      { side: "Fuerza comanche y lipan apache", members: ["Comanche", "Lipan Apache"], casualties: "Cifra no consolidada por discrepancias entre fuentes oficiales de Texas" }
    ],
    cause: "Un destacamento de veinticinco soldados que patrullaba la frontera texana encontró una fuerza comanche y lipan apache cerca de las cabeceras del río Devils.",
    outcome: "El combate del 20 de julio dejó herido a John Bell Hood; el destacamento mantuvo su posición y los combatientes indígenas se retiraron.",
    consequences: "La acción reforzó la reputación militar de Hood y mostró la intensidad de las operaciones fronterizas del Segundo Regimiento de Caballería.",
    sourceDispute: true,
    curationNote: "Las fuentes institucionales de Texas coinciden en 2 militares muertos y 5 heridos, pero difieren de forma importante sobre las bajas indígenas; esa cifra no se presenta como cerrada."
  }),
  "Batalla del río Owyhee (1866)": conflictFix({
    parent: "Guerra Snake",
    campaign: "Expedición de George Crook de 1866-1867",
    region: "Río Owyhee, condado de Malheur, Oregón, Estados Unidos",
    hierarchySources: [SOURCES.owyheeRiver, SOURCES.owyheeRiverNps],
    startYear: 1866,
    type: "batalla",
    participants: [
      { side: "Primer Regimiento de Caballería de Estados Unidos", members: ["Estados Unidos"] },
      { side: "Banda paiute del norte asociada con Howluck", members: ["Paiute del norte"] }
    ],
    cause: "George Crook inició una campaña invernal contra bandas paiute del norte acusadas de atacar rutas y asentamientos en el sudeste de Oregón.",
    outcome: "El 26 de diciembre, la caballería atacó por sorpresa un campamento junto al río Owyhee y dispersó a sus habitantes.",
    consequences: "La acción abrió una campaña prolongada de Crook durante 1866-1867 y no puso fin inmediato a la Guerra Snake.",
    sourceDispute: true,
    curationNote: "La narración conservada procede principalmente de registros militares posteriores; las cifras de bajas indígenas se tratan como atribuidas y no se consolidan."
  }),
  "Combate de Prairie Dog Creek (1867)": conflictFix({
    parent: "Guerra de Hancock",
    campaign: "Operaciones de Kansas del verano de 1867",
    region: "Prairie Dog Creek, norte de Kansas, Estados Unidos",
    hierarchySources: SOURCES.prairieDogCreek,
    startYear: 1867,
    participants: [
      { side: "Exploradores de caballería desde Fort Hays", members: ["Estados Unidos"] },
      { side: "Dog Soldiers cheyenne y lakota", members: ["Cheyenne", "Lakota"] }
    ],
    cause: "Una fuerza de reconocimiento de más de cien jinetes salió de Fort Hays mientras los Dog Soldiers resistían el avance militar y ferroviario en Kansas.",
    outcome: "El 21 y 22 de agosto, varios cientos de Dog Soldiers combatieron con la columna durante dos días; los exploradores regresaron a Fort Hays sin una victoria decisiva.",
    consequences: "El choque mantuvo la presión militar durante la Guerra de Hancock y precedió las negociaciones de Medicine Lodge del otoño de 1867.",
    curationNote: "El Servicio de Parques Nacionales advierte que sobreviven sobre todo relatos del Ejército y muy pocos testimonios Dog Soldier; se mantiene un resultado inconcluso y pérdidas aproximadas."
  }),
  "Combate de Honsinger Bluff (1873)": conflictFix({
    parent: "Guerras sioux",
    campaign: "Expedición de Yellowstone de 1873",
    region: "Honsinger Bluff, río Yellowstone, actual Montana, Estados Unidos",
    hierarchySources: SOURCES.honsingerBluff,
    startYear: 1873,
    participants: [
      { side: "Séptimo Regimiento de Caballería", members: ["Estados Unidos"] },
      { side: "Fuerzas lakota vinculadas al poblado de Sitting Bull", members: ["Lakota"] }
    ],
    cause: "La expedición militar protegía el reconocimiento ferroviario del Northern Pacific a través de territorios lakota y provocó resistencia armada.",
    outcome: "El 4 de agosto, las fuerzas de George A. Custer y combatientes lakota sostuvieron un choque prolongado cerca del Yellowstone sin una victoria estratégica decisiva.",
    consequences: "El combate fue parte de la escalada que precedió la Guerra de Black Hills y quedó ligado a la muerte posterior de Honsinger y Baliran fuera de la columna.",
    sourceDispute: true,
    curationNote: "Las atribuciones de mando, la secuencia y las bajas varían y la documentación disponible está dominada por relatos estadounidenses; se evita presentar una victoria limpia."
  })
};
