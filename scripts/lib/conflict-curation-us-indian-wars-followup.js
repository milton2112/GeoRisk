function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  blackHawkIllinois: source(
    "Departamento de Recursos Naturales de Illinois: guerra de Black Hawk y fuerte Apple River",
    "https://dnrhistoric.illinois.gov/experience/sites/site.apple-river-fort.html"
  ),
  blackHawkWisconsin: source(
    "Departamento de Recursos Naturales de Wisconsin: batalla de Wisconsin Heights",
    "https://dnr.wisconsin.gov/topic/lands/lowerwisconsin/history"
  ),
  nezPerce: source(
    "Servicio de Parques Nacionales de EE. UU.: ruta y batallas de los Nez Perce de 1877",
    "https://www.nps.gov/biho/planyourvisit/park-brochure.htm"
  ),
  powderRiver: source(
    "Servicio de Parques Nacionales de EE. UU.: combate del río Powder de 1876",
    "https://www.nps.gov/places/cavalry-barracks-1874.htm"
  ),
  littleBighorn: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Little Bighorn",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Indian-Wars/"
  ),
  warbonnet: source(
    "Sociedad Histórica del Estado de Nebraska: escaramuza de Warbonnet Creek",
    "https://history.nebraska.gov/publications_section/skirmish-at-warbonnet-creek/"
  ),
  wolfMountain: source(
    "Servicio de Parques Nacionales de EE. UU.: Crazy Horse y la batalla de Wolf Mountain",
    "https://home.nps.gov/libi/learn/historyculture/crazy-horse.htm"
  ),
  sibley: source(
    "Army University Press: Atlas de las guerras sioux y expedición de Sibley de 1863",
    "https://www.armyupress.army.mil/Portals/7/educational-services/staff-rides/atlas-of-the-sioux-wars-second-edition.pdf"
  ),
  withlacoochee: source(
    "Servicio de Parques Nacionales de EE. UU.: Osceola y la batalla de Withlacoochee",
    "https://www.nps.gov/people/osceola.htm"
  ),
  okeechobee: source(
    "Archivos del Estado de Florida: segunda guerra seminola y batalla del lago Okeechobee",
    "https://www.floridamemory.com/fpc/memory/onlineclassroom/seminoles/sets/maps5/5-second-seminole-war-notes.pdf"
  ),
  sanFelasco: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña seminola de 1835-1842",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Indian-Wars/",
    "media"
  ),
  pineIsland: source(
    "Departamento de Estado de Florida: sendero patrimonial indígena y Pine Island Ridge",
    "https://dos.myflorida.com/media/32346/nativeamericanheritagetrail.pdf",
    "media"
  ),
  caloosahatchee: source(
    "Servicio de Parques Nacionales de EE. UU.: operaciones seminolas en el río Caloosahatchee",
    "https://parkplanning.nps.gov/showFile.cfm?projectID=26159&sfid=430017",
    "media"
  ),
  northFork: source(
    "Comisión Histórica de Texas: Ranald Mackenzie y la batalla del brazo norte del río Red",
    "https://atlas.thc.texas.gov/Details/5303012678"
  ),
  redRiver: source(
    "Comisión Histórica de Texas: guerra del Río Rojo de 1874-1875",
    "https://www.thc.texas.gov/public/upload/publications/red-river-war-2021.pdf"
  ),
  tippecanoe: source(
    "Servicio de Parques Nacionales de EE. UU.: batalla de Tippecanoe",
    "https://www.nps.gov/articles/tippecanoe.htm?fullweb=1"
  ),
  modoc: source(
    "Servicio de Parques Nacionales de EE. UU.: guerra modoc y batalla de Lost River",
    "https://www.nps.gov/labe/learn/historyculture/modoc-war.htm"
  ),
  yakama: source(
    "Servicio de Parques Nacionales de EE. UU.: guerra yakama y acción de Toppenish",
    "https://www.nps.gov/fova/learn/historyculture/upload/VNHRHistoryPartOne1846_1898-Accessible-PDF.pdf"
  )
};

const SIDES = {
  blackHawk: [
    { side: "Estados Unidos y milicias territoriales", members: ["Estados Unidos"] },
    { side: "Banda de Black Hawk", members: ["Sauk", "Meskwaki", "Kickapoo"] }
  ],
  nezPerce: [
    { side: "Estados Unidos", members: ["Estados Unidos"] },
    { side: "Nimiipuu (Nez Perce)", members: ["Nez Perce"] }
  ],
  dakota: [
    { side: "Estados Unidos y milicia de Minnesota", members: ["Estados Unidos"] },
    { side: "Dakota y aliados", members: ["Dakota", "Lakota", "Yanktonai"] }
  ],
  seminole: [
    { side: "Estados Unidos y milicias territoriales", members: ["Estados Unidos"] },
    { side: "Seminolas y miccosukee", members: ["Seminola", "Miccosukee"] }
  ],
  tippecanoe: [
    { side: "Estados Unidos", members: ["Estados Unidos"] },
    { side: "Confederación de Tecumseh", members: ["Shawnee", "Confederación de Tecumseh"] }
  ],
  modoc: [
    { side: "Estados Unidos", members: ["Estados Unidos"] },
    { side: "Modoc", members: ["Modoc"] }
  ],
  yakama: [
    { side: "Estados Unidos", members: ["Estados Unidos"] },
    { side: "Yakama y aliados", members: ["Yakama"] }
  ]
};

function battleFix({
  parent,
  campaign,
  region,
  hierarchySource,
  startYear,
  participants,
  cause,
  outcome,
  consequences,
  type = "batalla",
  conflictType = "colonial",
  scale = "local",
  related = []
}) {
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
    chronology: [{ year: startYear, event: outcome }],
    treaties: [],
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: hierarchySource.confidence,
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-us-indian-wars-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

function groupFixes({ parent, campaign, hierarchySource, participants, cause, consequences, rows }) {
  return Object.fromEntries(rows.map(row => [row.name, battleFix({
    parent,
    campaign: row.campaign || campaign,
    hierarchySource: row.hierarchySource || hierarchySource,
    participants: row.participants || participants,
    cause: row.cause || cause,
    consequences: row.consequences || consequences,
    ...row
  })]));
}

export const US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Apple River Fort": "Batalla del fuerte Apple River",
  "Battle of the Big Hole": "Batalla de Big Hole",
  "Batalla de Camas Creek": "Batalla de Camas Meadows",
  "Batalla de Dead Buffalo Lake": "Batalla del lago Dead Buffalo",
  "Batalla de Lake Okeechobee": "Batalla del lago Okeechobee",
  "Batalla de Little Big Horn": "Batalla de Little Bighorn",
  "Battle of the North Fork of the Red River": "Batalla del brazo norte del río Red",
  "Batalla de North Fork de Red River": "Batalla del brazo norte del río Red",
  "Batalla de Ouithlacoochie": "Batalla de Withlacoochee",
  "Batalla de Palo Duro Canyon": "Batalla del cañón de Palo Duro",
  "Batalla de Powder River": "Batalla del río Powder",
  "Battle of the Rosebud": "Batalla de Rosebud",
  "Batalla de Stony Lake": "Batalla del lago Stony",
  "Batalla de Toppenish Creek": "Batalla del arroyo Toppenish",
  "Batalla de Warbonnet Creek": "Escaramuza del arroyo Warbonnet",
  "Batalla de White Bird Canyon": "Batalla del cañón White Bird"
};

export const US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  ...groupFixes({
    parent: "Guerra de Black Hawk",
    campaign: "Campaña de Black Hawk de 1832",
    hierarchySource: SOURCES.blackHawkIllinois,
    participants: SIDES.blackHawk,
    cause: "El regreso de la banda de Black Hawk al este del Misisipi y la movilización militar estadounidense desencadenaron la campaña de 1832.",
    consequences: "La acción formó parte de la persecución que terminó con la derrota y el desplazamiento forzado de la banda de Black Hawk.",
    rows: [
      {
        name: "Batalla de Stillman's Run",
        region: "Stillman Creek, Illinois, Estados Unidos",
        startYear: 1832,
        outcome: "Victoria de la banda de Black Hawk; la milicia de Illinois se retiró desordenadamente."
      },
      {
        name: "Batalla del fuerte Apple River",
        region: "Elizabeth, Illinois, Estados Unidos",
        startYear: 1832,
        outcome: "Los defensores del fuerte rechazaron el ataque de la banda de Black Hawk."
      },
      {
        name: "Batalla de Kellogg's Grove",
        region: "Kellogg's Grove, Illinois, Estados Unidos",
        startYear: 1832,
        outcome: "La llegada de tropas estadounidenses obligó a la banda de Black Hawk a retirarse hacia Wisconsin."
      },
      {
        name: "Batalla de Wisconsin Heights",
        region: "Río Wisconsin, Wisconsin, Estados Unidos",
        startYear: 1832,
        hierarchySource: SOURCES.blackHawkWisconsin,
        outcome: "La retaguardia de Black Hawk demoró a las tropas y permitió que gran parte del grupo cruzara el río Wisconsin."
      }
    ]
  }),
  ...groupFixes({
    parent: "Guerra de los Nez Perce",
    campaign: "Huida de los Nez Perce de 1877",
    hierarchySource: SOURCES.nezPerce,
    participants: SIDES.nezPerce,
    cause: "La orden de trasladar a los grupos nimiipuu que vivían fuera de la reserva de 1863 desencadenó la huida y los combates de 1877.",
    consequences: "La acción condicionó la marcha de más de mil kilómetros de los nimiipuu en busca de refugio antes de Bear Paw.",
    rows: [
      {
        name: "Batalla del cañón White Bird",
        region: "White Bird Canyon, Idaho, Estados Unidos",
        startYear: 1877,
        outcome: "Victoria nimiipuu; la caballería estadounidense se retiró con pérdidas importantes."
      },
      {
        name: "Batalla de Big Hole",
        region: "Valle de Big Hole, Montana, Estados Unidos",
        startYear: 1877,
        outcome: "El ataque estadounidense causó numerosas bajas, pero los nimiipuu rompieron el cerco y continuaron la marcha."
      },
      {
        name: "Batalla de Camas Meadows",
        region: "Camas Meadows, Idaho, Estados Unidos",
        startYear: 1877,
        outcome: "Los nimiipuu capturaron gran parte de las mulas del campamento y evitaron quedar fijados por la persecución."
      },
      {
        name: "Batalla de Canyon Creek",
        region: "Canyon Creek, Montana, Estados Unidos",
        startYear: 1877,
        outcome: "La retaguardia nimiipuu detuvo a la Séptima Caballería el tiempo suficiente para que el grupo principal escapara."
      }
    ]
  }),
  ...groupFixes({
    parent: "Gran Guerra Sioux",
    campaign: "Campaña de Little Bighorn de 1876-1877",
    hierarchySource: SOURCES.littleBighorn,
    participants: [
      { side: "Estados Unidos", members: ["Estados Unidos"] },
      { side: "Lakota, Cheyenne y Arapaho", members: ["Lakota", "Cheyenne", "Arapaho"] }
    ],
    cause: "Estados Unidos lanzó operaciones para obligar a los grupos lakota y cheyenne fuera de las agencias a regresar a las reservas tras la crisis de las Black Hills.",
    consequences: "La acción modificó el ritmo de la campaña de 1876-1877 y la presión militar sobre las naciones de las llanuras del norte.",
    rows: [
      {
        name: "Batalla del río Powder",
        campaign: "Campaña del río Powder de 1876",
        region: "Río Powder, territorio de Montana, Estados Unidos",
        startYear: 1876,
        hierarchySource: SOURCES.powderRiver,
        participants: [
          { side: "Estados Unidos", members: ["Estados Unidos"] },
          { side: "Cheyenne del Norte", members: ["Cheyenne"] }
        ],
        outcome: "Combate de resultado indeciso; la columna de Reynolds se retiró sin lograr el objetivo estratégico de la expedición."
      },
      {
        name: "Batalla de Rosebud",
        region: "Rosebud Creek, Montana, Estados Unidos",
        startYear: 1876,
        outcome: "Resultado táctico indeciso y éxito estratégico indígena: la columna de Crook se retiró y dejó de apoyar el avance convergente."
      },
      {
        name: "Batalla de Little Bighorn",
        region: "Río Little Bighorn, Montana, Estados Unidos",
        startYear: 1876,
        outcome: "Victoria lakota, cheyenne y arapaho; el destacamento de Custer fue destruido y las demás compañías quedaron sitiadas hasta la retirada indígena."
      },
      {
        name: "Escaramuza del arroyo Warbonnet",
        campaign: "Operaciones de las agencias de 1876",
        region: "Warbonnet Creek, Nebraska, Estados Unidos",
        startYear: 1876,
        hierarchySource: SOURCES.warbonnet,
        participants: [
          { side: "Estados Unidos", members: ["Estados Unidos"] },
          { side: "Cheyenne del Norte", members: ["Cheyenne"] }
        ],
        type: "escaramuza",
        outcome: "La Quinta Caballería interceptó y obligó a retroceder a un pequeño grupo cheyenne que se dirigía al norte."
      },
      {
        name: "Batalla de Wolf Mountain",
        campaign: "Campaña de invierno de 1876-1877",
        region: "Wolf Mountains, Montana, Estados Unidos",
        startYear: 1877,
        hierarchySource: SOURCES.wolfMountain,
        participants: [
          { side: "Estados Unidos", members: ["Estados Unidos"] },
          { side: "Banda de Crazy Horse", members: ["Lakota", "Cheyenne"] }
        ],
        outcome: "Victoria estadounidense; la fuerza de Crazy Horse se retiró después del combate."
      }
    ]
  }),
  ...groupFixes({
    parent: "Guerras sioux",
    campaign: "Expedición de Sibley de 1863",
    hierarchySource: SOURCES.sibley,
    participants: SIDES.dakota,
    cause: "La expedición de Henry Sibley persiguió a grupos dakota hacia el territorio de Dakota después de la guerra de 1862.",
    consequences: "Los combates facilitaron el desplazamiento forzado hacia el oeste y precedieron a nuevas campañas estadounidenses en 1864.",
    rows: [
      {
        name: "Batalla de Big Mound",
        region: "Kidder County, Dakota del Norte, Estados Unidos",
        startYear: 1863,
        related: ["Guerra de Dakota de 1862"],
        outcome: "Las tropas de Sibley expulsaron a la retaguardia dakota, mientras las familias continuaron su retirada hacia el oeste."
      },
      {
        name: "Batalla del lago Dead Buffalo",
        region: "Kidder County, Dakota del Norte, Estados Unidos",
        startYear: 1863,
        related: ["Guerra de Dakota de 1862"],
        outcome: "Las fuerzas estadounidenses rechazaron el ataque y los intentos de flanqueo; los combatientes dakota se retiraron."
      },
      {
        name: "Batalla del lago Stony",
        region: "Burleigh County, Dakota del Norte, Estados Unidos",
        startYear: 1863,
        related: ["Guerra de Dakota de 1862"],
        outcome: "La retaguardia dakota volvió a retirarse después de demorar a la columna y permitir el avance de las familias hacia el Misuri."
      }
    ]
  }),
  ...groupFixes({
    parent: "Segunda Guerra Seminola",
    campaign: "Campaña de Florida de 1835-1842",
    hierarchySource: SOURCES.withlacoochee,
    participants: SIDES.seminole,
    cause: "La resistencia seminola y miccosukee a la expulsión forzada de Florida derivó en una campaña prolongada contra el Ejército estadounidense.",
    consequences: "La acción prolongó o reorientó las operaciones de una guerra que terminó sin una rendición total ni un tratado de cierre específico.",
    rows: [
      {
        name: "Batalla de Withlacoochee",
        region: "Río Withlacoochee, Florida, Estados Unidos",
        startYear: 1835,
        outcome: "La columna estadounidense se retiró después del combate y la fuerza seminola conservó su capacidad de resistencia."
      },
      {
        name: "Batalla de San Felasco Hammock",
        region: "San Felasco Hammock, Florida, Estados Unidos",
        startYear: 1836,
        hierarchySource: SOURCES.sanFelasco,
        outcome: "La fuerza estadounidense sostuvo su posición con apoyo de artillería y los combatientes seminolas se retiraron."
      },
      {
        name: "Batalla del lago Okeechobee",
        region: "Lago Okeechobee, Florida, Estados Unidos",
        startYear: 1837,
        hierarchySource: SOURCES.okeechobee,
        outcome: "La columna estadounidense ocupó el campo con pérdidas elevadas, pero no destruyó a la fuerza seminola, que se retiró hacia el sur."
      },
      {
        name: "Batalla de Pine Island Ridge",
        region: "Pine Island Ridge, Florida, Estados Unidos",
        startYear: 1838,
        hierarchySource: SOURCES.pineIsland,
        outcome: "Los defensores cubrieron la evacuación del poblado; las tropas estadounidenses no lograron capturar a Abiaka ni a su fuerza."
      },
      {
        name: "Batalla del Caloosahatchee",
        region: "Río Caloosahatchee, Florida, Estados Unidos",
        startYear: 1839,
        hierarchySource: SOURCES.caloosahatchee,
        outcome: "La fuerza indígena sorprendió y desbordó el campamento y el puesto comercial estadounidense del Caloosahatchee."
      }
    ]
  }),
  "Batalla del brazo norte del río Red": battleFix({
    parent: "Guerras comanches",
    campaign: "Campaña de Mackenzie de 1872",
    region: "Brazo norte del río Red, Texas, Estados Unidos",
    hierarchySource: SOURCES.northFork,
    startYear: 1872,
    participants: [
      { side: "Estados Unidos y exploradores tonkawa", members: ["Estados Unidos", "Tonkawa"] },
      { side: "Comanche", members: ["Comanche"] }
    ],
    cause: "La columna de Ranald Mackenzie buscó localizar campamentos comanches y frenar las incursiones y el tráfico de ganado en el Llano Estacado.",
    outcome: "Victoria estadounidense; la columna tomó el campamento y capturó habitantes, caballos y suministros.",
    consequences: "La acción demostró que el Llano Estacado ya no funcionaba como refugio seguro y anticipó las campañas de 1874-1875."
  }),
  ...groupFixes({
    parent: "Guerra del Río Rojo",
    campaign: "Campaña del Río Rojo de 1874-1875",
    hierarchySource: SOURCES.redRiver,
    participants: [
      { side: "Estados Unidos", members: ["Estados Unidos"] },
      { side: "Naciones de las llanuras del sur", members: ["Comanche", "Kiowa", "Cheyenne", "Arapaho"] }
    ],
    cause: "La expansión sobre las llanuras del sur, la matanza de bisontes y la política de confinamiento en reservas desencadenaron la guerra de 1874-1875.",
    consequences: "La campaña debilitó la autonomía militar y económica de las naciones de las llanuras del sur y aceleró su confinamiento en reservas.",
    rows: [
      {
        name: "Segunda batalla de Adobe Walls",
        region: "Adobe Walls, Texas, Estados Unidos",
        startYear: 1874,
        participants: [
          { side: "Defensores de Adobe Walls", members: ["Cazadores de bisontes de Adobe Walls"] },
          { side: "Comanche, Kiowa y Cheyenne", members: ["Comanche", "Kiowa", "Cheyenne"] }
        ],
        outcome: "Los defensores del puesto rechazaron el ataque indígena gracias al alcance de sus fusiles."
      },
      {
        name: "Batalla del cañón de Palo Duro",
        region: "Cañón de Palo Duro, Texas, Estados Unidos",
        startYear: 1874,
        outcome: "Victoria estadounidense; los poblados fueron quemados y la mayor parte de los caballos capturados fue sacrificada."
      }
    ]
  }),
  "Batalla de Tippecanoe": battleFix({
    parent: "Guerra de Tecumseh",
    campaign: "Campaña de Tippecanoe de 1811",
    region: "Prophetstown, Indiana, Estados Unidos",
    hierarchySource: SOURCES.tippecanoe,
    startYear: 1811,
    participants: SIDES.tippecanoe,
    cause: "William Henry Harrison avanzó contra Prophetstown para debilitar la confederación indígena organizada por Tecumseh y Tenskwatawa.",
    outcome: "La fuerza de Harrison rechazó el ataque, aunque sufrió bajas importantes y el resultado inmediato no fue decisivo.",
    consequences: "La destrucción de Prophetstown acercó a la confederación de Tecumseh al Reino Unido y elevó las tensiones previas a la guerra de 1812."
  }),
  "Batalla de Lost River": battleFix({
    parent: "Guerra modoc",
    campaign: "Campaña de Lost River de 1872",
    region: "Lost River, Oregón, Estados Unidos",
    hierarchySource: SOURCES.modoc,
    startYear: 1872,
    participants: SIDES.modoc,
    cause: "Las tropas intentaron desarmar y trasladar por la fuerza al grupo modoc de Captain Jack a la reserva Klamath.",
    outcome: "El combate dispersó a los modoc, que cruzaron Tule Lake y se refugiaron en Captain Jack's Stronghold.",
    consequences: "La acción abrió la fase armada de la guerra modoc, que continuó hasta junio de 1873."
  }),
  "Batalla del arroyo Toppenish": battleFix({
    parent: "Guerra yakama",
    campaign: "Campaña de Toppenish de 1855",
    region: "Toppenish Creek, territorio de Washington, Estados Unidos",
    hierarchySource: SOURCES.yakama,
    startYear: 1855,
    participants: SIDES.yakama,
    cause: "La entrada de colonos y mineros en tierras cedidas bajo presión y la muerte del agente Andrew Bolon precipitaron la guerra yakama.",
    outcome: "Los combatientes yakama obligaron a la expedición estadounidense a retirarse y fortificarse.",
    consequences: "La acción confirmó la amplitud de la resistencia regional y prolongó la guerra hasta 1858."
  })
};
