function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  apachePass: source(
    "Servicio de Parques Nacionales de EE. UU.: batalla de Apache Pass",
    "https://home.nps.gov/fobo/learn/historyculture/the-battle-of-apache-pass.htm"
  ),
  fortApache: source(
    "Servicio de Parques Nacionales de EE. UU.: Cibecue y ataque a Fort Apache",
    "https://www.nps.gov/crps/CRMJournal/CRM/v23n9.pdf"
  ),
  bigDryWash: source(
    "Army University Press: batalla de Big Dry Wash",
    "https://www.armyupress.army.mil/Portals/7/educational-services/staff-rides/3_Battle_of_Big_Dry_Washpdf.pdf"
  ),
  ashHollow: source(
    "Servicio de Parques Nacionales de EE. UU.: batalla de Ash Hollow",
    "https://www.nps.gov/articles/000/harney-re-examined-part-ii-harney-s-treatment-of-native-americans.htm"
  ),
  tongueRiver: source(
    "Registro Nacional de Lugares Históricos de EE. UU.: batalla del río Tongue",
    "https://npgallery.nps.gov/GetAsset/cc3392ce-e8ea-4c14-905f-b3f042625d7c"
  ),
  blancoCanyon: source(
    "Comisión Histórica de Texas: batalla del cañón Blanco",
    "https://atlas.thc.texas.gov/Details/5507017646"
  ),
  peaseRiver: source(
    "Comisión Histórica de Texas: ataque del río Pease y captura de Cynthia Ann Parker",
    "https://www.thc.texas.gov/public/upload/Historic_Sites_Committee-July-2021.pdf"
  ),
  summitSprings: source(
    "Servicio de Parques Nacionales de EE. UU.: batalla de Summit Springs",
    "https://www.nps.gov/sand/learn/timeline.htm"
  ),
  skeletonCave: source(
    "Servicio de Parques Nacionales de EE. UU.: guerra tonto y masacre de Skeleton Cave",
    "https://www.nps.gov/tont/learn/historyculture/tonto-apache-war.htm"
  ),
  fallenTimbers: source(
    "Servicio de Parques Nacionales de EE. UU.: batalla de Fallen Timbers",
    "https://home.nps.gov/articles/000/historical-overview-of-fallen-timbers-battlefield-and-fort-miamis.htm/index.htm"
  ),
  piqua: source(
    "Ohio History Connection: batalla de Piqua de 1780",
    "https://resources.ohiohistory.org/ohj/browse/displaypages.php?display%5B%5D=0033&display%5B%5D=477&display%5B%5D=491",
    "media"
  ),
  quebec: source(
    "Servicio de Parques Nacionales de EE. UU.: campaña y ataque de Quebec de 1775",
    "https://www.nps.gov/people/guy-carleton.htm"
  ),
  cieneguilla: source(
    "Biblioteca de Virginia: John W. Davidson y la batalla de Cieneguilla",
    "https://old.lva.virginia.gov/public/dvb/bio.asp?b=Davidson_John_Wynn"
  ),
  cieneguillaArmy: source(
    "Centro de Historia Militar del Ejército de EE. UU.: identificación del campo de Cieneguilla",
    "https://history.army.mil/Portals/143/Images/Publications/ArmyHistoryMag/pdf/20102019/AH77%28W%29.pdf?ver=2NLIEuT1dKP9SnJunrXOcA%3D%3D"
  )
};

function battleFix({
  parent,
  campaign,
  region,
  hierarchySources,
  startYear,
  participants,
  cause,
  outcome,
  consequences,
  type = "batalla",
  conflictType = "colonial",
  scale = "local",
  treaties = [],
  related = [],
  chronology,
  curationNote
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
    curationBatch: "source-backed-us-frontier-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    ...(curationNote ? { curationNote } : {})
  };
}

export const US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Apache Pass": "Batalla del paso Apache",
  "Batalla de Cibecue Creek": "Batalla del arroyo Cibecue",
  "Batalla de Fort Apache": "Ataque a Fort Apache",
  "Battle of the Tongue River": "Batalla del río Tongue",
  "Batalla de Tongue River": "Batalla del río Tongue",
  "Batalla de Blanco Canyon": "Batalla del cañón Blanco",
  "Batalla de Pease River": "Batalla del río Pease",
  "Batalla de Salt River Canyon": "Masacre de Skeleton Cave"
};

export const US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla del paso Apache": battleFix({
    parent: "Guerras apaches",
    campaign: "Avance de la Columna de California de 1862",
    region: "Apache Pass, Arizona, Estados Unidos",
    hierarchySources: SOURCES.apachePass,
    startYear: 1862,
    participants: [
      { side: "Columna de California", members: ["Estados Unidos"] },
      { side: "Apache chiricahua", members: ["Chiricahua", "Bandas de Cochise y Mangas Coloradas"] }
    ],
    cause: "La Columna de California necesitaba cruzar y abastecerse en Apache Spring durante su avance hacia el territorio de Arizona, mientras los chiricahua defendían el paso y su fuente de agua.",
    outcome: "La artillería estadounidense desalojó las posiciones chiricahua y la columna aseguró temporalmente Apache Spring.",
    consequences: "Estados Unidos estableció Fort Bowie para proteger el corredor; el combate abrió una fase prolongada de las guerras apaches en la región."
  }),
  "Batalla del arroyo Cibecue": battleFix({
    parent: "Guerras apaches",
    campaign: "Crisis de Cibecue y Fort Apache de 1881",
    region: "Cibecue Creek, Arizona, Estados Unidos",
    hierarchySources: SOURCES.fortApache,
    startYear: 1881,
    participants: [
      { side: "Ejército de Estados Unidos y exploradores apaches leales", members: ["Estados Unidos", "Exploradores apaches"] },
      { side: "Seguidores de Nock-ay-det-klinne y exploradores amotinados", members: ["Apache de las Montañas Blancas"] }
    ],
    cause: "El Ejército intentó arrestar al líder religioso Nock-ay-det-klinne en un contexto de presión sobre la reserva y creciente descontento apache.",
    outcome: "El tiroteo, la muerte de Nock-ay-det-klinne y el motín de parte de los exploradores obligaron a la columna estadounidense a replegarse hacia Fort Apache.",
    consequences: "El combate desencadenó el ataque a Fort Apache y varios meses de agitación en las reservas de Arizona."
  }),
  "Ataque a Fort Apache": battleFix({
    parent: "Guerras apaches",
    campaign: "Crisis de Cibecue y Fort Apache de 1881",
    region: "Fort Apache, Arizona, Estados Unidos",
    hierarchySources: SOURCES.fortApache,
    startYear: 1881,
    type: "ataque",
    participants: [
      { side: "Guarnición de Fort Apache", members: ["Estados Unidos"] },
      { side: "Combatientes apache de las Montañas Blancas", members: ["Apache de las Montañas Blancas"] }
    ],
    cause: "La muerte de Nock-ay-det-klinne y el combate de Cibecue provocaron una represalia contra el puesto militar.",
    outcome: "El breve asedio no tomó Fort Apache y los atacantes se retiraron.",
    consequences: "Fue el único ataque apache registrado por el NPS contra un fuerte y amplió la crisis iniciada en Cibecue."
  }),
  "Batalla de Big Dry Wash": battleFix({
    parent: "Guerras apaches",
    campaign: "Levantamiento de Natiotish de 1882",
    region: "Clear Creek Canyon, Arizona, Estados Unidos",
    hierarchySources: SOURCES.bigDryWash,
    startYear: 1882,
    participants: [
      { side: "Ejército de Estados Unidos y exploradores tonto", members: ["Estados Unidos", "Exploradores tonto"], casualties: "2 muertos y 7 heridos" },
      { side: "Banda apache de Natiotish", members: ["Apache de las Montañas Blancas"], casualties: "14 muertos contados en el campo; total incierto" }
    ],
    cause: "El descontento por la presión sobre San Carlos, la corrupción denunciada y los prisioneros de Cibecue alimentó el levantamiento encabezado por Natiotish.",
    outcome: "Victoria táctica estadounidense: la banda fue dispersada y no pudo reagruparse para continuar la campaña.",
    consequences: "Fue la última acción importante entre el Ejército regular y combatientes apaches en el territorio de Arizona, aunque las campañas contra los chiricahua continuaron.",
    curationNote: "Las bajas apaches totales varían entre fuentes; se conserva únicamente el recuento de cuerpos citado por el estudio."
  }),
  "Batalla de Ash Hollow": battleFix({
    parent: "Primera Guerra Sioux",
    campaign: "Campaña de Harney de 1855",
    region: "Blue Water Creek, Nebraska, Estados Unidos",
    hierarchySources: SOURCES.ashHollow,
    startYear: 1855,
    participants: [
      { side: "Ejército de Estados Unidos", members: ["Estados Unidos"] },
      { side: "Aldea brulé lakota de Little Thunder", members: ["Brulé Lakota"] }
    ],
    cause: "El gobierno estadounidense lanzó una expedición punitiva tras el combate de Grattan y para imponer su control sobre las rutas de colonización del valle del Platte.",
    outcome: "Las tropas de William Harney rodearon y atacaron la aldea, pese a los intentos de negociación, y capturaron a numerosos sobrevivientes.",
    consequences: "La acción profundizó el desplazamiento y la coerción sobre los brulé lakota y agravó la confrontación en las llanuras."
  }),
  "Batalla del río Tongue": battleFix({
    parent: "Guerras de las llanuras",
    campaign: "Expedición del río Powder de 1865",
    region: "Río Tongue, territorio de Wyoming, Estados Unidos",
    hierarchySources: SOURCES.tongueRiver,
    startYear: 1865,
    participants: [
      { side: "Columna de Patrick Connor y exploradores pawnee", members: ["Estados Unidos", "Pawnee"] },
      { side: "Arapaho de Black Bear y Old David", members: ["Arapaho"] }
    ],
    cause: "La expedición del río Powder buscó atacar a grupos arapaho, cheyenne y lakota en sus territorios y asegurar las rutas de emigración.",
    outcome: "La columna de Connor ocupó y destruyó el campamento arapaho, capturó caballos y se retiró bajo hostigamiento.",
    consequences: "El combate cerró la principal acción de la columna de Connor, pero la expedición no logró someter de forma duradera a las naciones de la región."
  }),
  "Batalla del cañón Blanco": battleFix({
    parent: "Guerras comanches",
    campaign: "Campaña de Mackenzie de 1871",
    region: "Blanco Canyon, Texas, Estados Unidos",
    hierarchySources: SOURCES.blancoCanyon,
    startYear: 1871,
    participants: [
      { side: "Cuarta Caballería y exploradores tonkawa", members: ["Estados Unidos", "Tonkawa"] },
      { side: "Kwahadi comanche de Quanah Parker", members: ["Comanche"] }
    ],
    cause: "La campaña pretendía obligar a las bandas kotsoteka y kwahadi que rechazaban el confinamiento en reservas a abandonar el Llano Estacado.",
    outcome: "Los comanches sorprendieron el campamento, se llevaron decenas de animales y frustraron la persecución; la expedición estadounidense terminó sin su objetivo principal.",
    consequences: "La experiencia obtenida por Ranald Mackenzie fue utilizada en las campañas posteriores que culminaron en la Guerra del Río Rojo."
  }),
  "Batalla del río Pease": battleFix({
    parent: "Guerras comanches",
    campaign: "Campaña fronteriza de Texas de 1860",
    region: "Río Pease, Texas, Estados Unidos",
    hierarchySources: SOURCES.peaseRiver,
    startYear: 1860,
    participants: [
      { side: "Texas Rangers y milicia de frontera", members: ["Estados Unidos", "Texas Rangers"] },
      { side: "Campamento noconi comanche", members: ["Comanche Noconi"] }
    ],
    cause: "Una expedición de represalia siguió el rastro de un campamento noconi durante el ciclo de incursiones y contraincursiones de la frontera de Texas.",
    outcome: "Los Rangers atacaron el campamento y capturaron a Cynthia Ann Parker y a su hija Prairie Flower.",
    consequences: "La captura separó por la fuerza a Parker de su familia comanche; la acción no cerró las guerras comanches.",
    curationNote: "Se omite la afirmación tradicional de que Peta Nocona murió allí: la documentación moderna de la Comisión Histórica de Texas identifica al hombre muerto como José, un cautivo mexicano."
  }),
  "Batalla de Summit Springs": battleFix({
    parent: "Guerras cheyenes",
    campaign: "Expedición del río Republican de 1869",
    region: "Summit Springs, territorio de Colorado, Estados Unidos",
    hierarchySources: SOURCES.summitSprings,
    startYear: 1869,
    participants: [
      { side: "Quinta Caballería y exploradores pawnee", members: ["Estados Unidos", "Pawnee"] },
      { side: "Dog Soldiers cheyenne de Tall Bull", members: ["Cheyenne"] }
    ],
    cause: "La columna de Eugene Carr persiguió a los Dog Soldiers después de ataques y desplazamientos crecientes en los valles del Republican y Platte.",
    outcome: "La caballería y los exploradores pawnee tomaron el campamento; Tall Bull y decenas de combatientes cheyenne murieron.",
    consequences: "La derrota quebró la presencia organizada de los Dog Soldiers en Colorado y aceleró la expulsión de cheyenes y arapahos del territorio."
  }),
  "Masacre de Skeleton Cave": battleFix({
    parent: "Guerra tonto",
    campaign: "Campaña del Tonto Basin de 1872-1873",
    region: "Salt River Canyon, Arizona, Estados Unidos",
    hierarchySources: SOURCES.skeletonCave,
    startYear: 1872,
    type: "masacre",
    participants: [
      { side: "Ejército de Estados Unidos y exploradores indígenas", members: ["Estados Unidos", "Exploradores apache", "Pima", "Maricopa"] },
      { side: "Refugiados yavapai o tonto apache", members: ["Yavapai", "Tonto Apache"], casualties: "Entre 50 y 75 muertos; alrededor de 20 sobrevivientes" }
    ],
    cause: "La campaña de George Crook buscó concentrar por la fuerza a los yavapai y tonto apache en reservas y destruir las rancherías que permanecían fuera de ellas.",
    outcome: "Las fuerzas estadounidenses dispararon contra el refugio fortificado y mataron a combatientes, mujeres, niños y ancianos.",
    consequences: "La masacre fue seguida por nuevas rendiciones y por el traslado forzado de unas 1.500 personas a las reservas de Río Verde y San Carlos.",
    curationNote: "El Ejército identificó entonces a las víctimas como tonto apache; la Nación Yavapai de Fort McDowell sostiene que eran yavapai. La ficha conserva ambas atribuciones."
  }),
  "Batalla de los Árboles Caídos": battleFix({
    parent: "Guerra indígena del Noroeste",
    campaign: "Campaña de Anthony Wayne de 1794",
    region: "Río Maumee, Ohio, Estados Unidos",
    hierarchySources: SOURCES.fallenTimbers,
    startYear: 1794,
    conflictType: "interestatal",
    scale: "regional",
    participants: [
      { side: "Legión de los Estados Unidos y milicia de Kentucky", members: ["Estados Unidos"] },
      { side: "Confederación Occidental", members: ["Shawnee", "Miami", "Wyandot", "Lenape", "Ottawa", "Ojibwe", "Potawatomi"] }
    ],
    cause: "La Confederación Occidental resistía la ocupación estadounidense del territorio al noroeste del río Ohio y recibía apoyo británico desde Fort Miamis.",
    outcome: "Victoria decisiva estadounidense; la carga de la Legión expulsó a la confederación del campo y Fort Miamis no abrió sus puertas a los combatientes en retirada.",
    consequences: "La derrota condujo al Tratado de Greenville de 1795 y a grandes cesiones territoriales indígenas en el actual Ohio.",
    treaties: ["Tratado de Greenville (1795)"]
  }),
  "Batalla de Piqua": battleFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña de George Rogers Clark de 1780",
    region: "Piqua, Ohio, Estados Unidos",
    hierarchySources: SOURCES.piqua,
    startYear: 1780,
    conflictType: "colonial",
    participants: [
      { side: "Milicia de Kentucky de George Rogers Clark", members: ["Estados Unidos"] },
      { side: "Defensores shawnee de Piqua", members: ["Shawnee"] }
    ],
    cause: "George Rogers Clark lanzó una expedición contra los asentamientos shawnee tras incursiones británicas e indígenas en la frontera de Kentucky.",
    outcome: "La milicia obligó a los defensores a retirarse y destruyó la aldea de Piqua.",
    consequences: "La acción desplazó a la comunidad shawnee, pero no terminó la guerra fronteriza en el valle de Ohio."
  }),
  "Batalla de Quebec": battleFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Invasión de Quebec de 1775-1776",
    region: "Quebec, provincia de Quebec, Canadá",
    hierarchySources: SOURCES.quebec,
    startYear: 1775,
    conflictType: "independencia",
    scale: "regional",
    participants: [
      { side: "Ejército Continental", members: ["Estados Unidos"] },
      { side: "Guarnición británica y milicia local", members: ["Reino Unido", "Milicia canadiense"] }
    ],
    cause: "El Ejército Continental intentó tomar Quebec para impedir una contraofensiva británica y sumar la provincia a la rebelión de las Trece Colonias.",
    outcome: "Victoria británica: el asalto del 31 de diciembre fue rechazado, Richard Montgomery murió y Benedict Arnold resultó herido.",
    consequences: "Los continentales mantuvieron el sitio hasta mayo de 1776, cuando la llegada de refuerzos británicos los obligó a retirarse de Canadá."
  }),
  "Batalla de Cieneguilla": battleFix({
    parent: "Guerra jicarilla",
    campaign: "Campaña de Nuevo México de 1854",
    region: "Cieneguilla, Nuevo México, Estados Unidos",
    hierarchySources: [SOURCES.cieneguilla, SOURCES.cieneguillaArmy],
    startYear: 1854,
    participants: [
      { side: "Primer Regimiento de Dragones", members: ["Estados Unidos"], casualties: "22 muertos y 23 heridos" },
      { side: "Jicarilla apache y aliados ute", members: ["Jicarilla Apache", "Ute"], casualties: "No consolidadas en las fuentes institucionales consultadas" }
    ],
    cause: "Una columna de dragones salió a seguir a grupos jicarilla y atacó un campamento en un cañón de las montañas de Embudo.",
    outcome: "Victoria jicarilla y ute: la fuerza de John W. Davidson sufrió pérdidas severas y se retiró.",
    consequences: "La derrota provocó expediciones de represalia estadounidenses y amplió la guerra jicarilla durante 1854."
  })
};
