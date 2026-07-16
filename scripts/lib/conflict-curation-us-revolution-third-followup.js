function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  kempsLanding: source(
    "Departamento de Recursos Históricos de Virginia: acciones de Kemp's Landing de 1775",
    "https://dhr.es.virginia.gov/wp-content/uploads/2020/09/VB-204_AH_Survey_Update_Southern_Half_VA_Beach_2020_CRAI_report_WEB.pdf"
  ),
  lindleysFort: source(
    "Departamento de Archivos e Historia de Carolina del Sur: sitio de Lindley's Fort",
    "https://www.nationalregister.sc.gov/laurens/S10817730009/index.htm"
  ),
  lindleysFortContext: source(
    "Departamento de Archivos e Historia de Carolina del Sur: estudio histórico del oeste de Laurens County",
    "https://nationalregister.sc.gov/SurveyReports/WesternLaurensCounty2002SM-2.pdf"
  ),
  canadaHeritage: source(
    "Dirección de Historia y Patrimonio de Canadá: herencia militar canadiense, 1755-1871",
    "https://www.canada.ca/content/dam/themes/defence/caf/militaryhistory/dhh/general/book-1995-military-heritage-2-en.pdf"
  ),
  quebecSiege: source(
    "Parques de Canadá: sitio histórico del sitio de Quebec de 1775-1776",
    "https://www.pc.gc.ca/apps/dfhd/page_nhs_eng.aspx?id=1439"
  ),
  norwalk: source(
    "Municipio de Norwalk: incursión británica e incendio de 1779",
    "https://norwalkct.gov/406/Early-Years-Before-Organized-Fire-Protec"
  ),
  tryon: source(
    "Servicio de Parques Nacionales de EE. UU.: William Tryon y las incursiones de Connecticut",
    "https://home.nps.gov/people/william-tryon.htm"
  ),
  stLouis: source(
    "Servicio de Parques Nacionales de EE. UU.: batalla de San Luis de 1780",
    "https://www.nps.gov/articles/000/battle-of-st-louis.htm"
  ),
  mobleys: source(
    "Departamento de Archivos e Historia de Carolina del Sur: campos de batalla de la Revolución",
    "https://scdah.sc.gov/sites/default/files/Documents/Research%20and%20Genealogy/Resources/Military%20Records/SCAWI.pdf"
  ),
  shallowFord: source(
    "Departamento de Recursos Naturales y Culturales de Carolina del Norte: batalla de Shallow Ford",
    "https://www.america250.nc.gov/blog/2025/04/03/crushing-loyalism-western-nc"
  ),
  wetzellsMill: source(
    "Servicio de Parques Nacionales de EE. UU.: campaña de Guilford Courthouse y Wetzell's Mill",
    "https://home.nps.gov/podcasts/southern-war.htm?hiderightrail=true&maxrows=10&reinit=false&season=0&sortby=date-desc&startrow=1"
  ),
  fortSlongo: source(
    "Founders Online: informe de William Heath sobre la toma de Fort Slongo",
    "https://founders.archives.gov/documents/Washington/99-01-02-07095"
  ),
  fortSlongoMuseum: source(
    "Museo Militar del Estado de Nueva York: Fort Salonga o Slongo",
    "https://museum.dmna.ny.gov/forts/salonga"
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
  chronology,
  type = "batalla",
  conflictType = "independencia",
  scale = "regional",
  treaties = ["Tratado de París (1783)"],
  related = [],
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
    chronology,
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: confidence,
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-us-revolution-third-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    ...(curationNote ? { curationNote } : {})
  };
}

export const US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Kemp's Landing": "Batalla de Kemp's Landing (1775)",
  "Batalla de Lindley's Fort": "Ataque a Lindley's Fort (1776)",
  "Batalla de Longue-Pointe": "Batalla de Longue-Pointe (1775)",
  "Batalla de Saint-Pierre": "Batalla de Saint-Pierre (1776)",
  "Batalla de Norwalk": "Incursión de Norwalk (1779)",
  "Batalla de San Luis": "Batalla de San Luis (1780)",
  "Batalla de Mobley's Meeting House": "Combate de Mobley's Meeting House (1780)",
  "Batalla de Shallow Ford": "Batalla de Shallow Ford (1780)",
  "Batalla de Wetzell's Mill": "Escaramuza de Wetzell's Mill (1781)",
  "Batalla de Fort Slongo": "Asalto a Fort Slongo (1781)"
};

export const US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Kemp's Landing (1775)": conflictFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña de Virginia de 1775",
    region: "Kemp's Landing, actual Virginia Beach, Virginia, Estados Unidos",
    hierarchySources: SOURCES.kempsLanding,
    startYear: 1775,
    participants: [
      { side: "Fuerza real de Virginia", members: ["Ejército británico", "Lealistas de Virginia"] },
      { side: "Milicia patriota de Princess Anne", members: ["Patriotas de Virginia"] }
    ],
    cause: "Lord Dunmore envió fuerzas a Kemp's Landing para requisar armas y dispersar a la milicia de Virginia que se concentraba en la zona de Norfolk.",
    outcome: "El 15 de noviembre la milicia patriota perdió la sorpresa, fue desorganizada por la fuerza real y se retiró con las primeras bajas de Virginia en la guerra.",
    consequences: "La victoria permitió a Dunmore reforzar temporalmente su posición en Norfolk y alentó nuevas incorporaciones lealistas antes de la derrota británica de Great Bridge.",
    chronology: [
      { year: 1775, event: "El 15 de noviembre la fuerza real derrotó a la milicia reunida en Kemp's Landing." },
      { year: 1775, event: "La campaña continuó hacia Great Bridge, donde la posición británica en Virginia se volvió insostenible." }
    ],
    related: ["Batalla de Great Bridge"],
    curationNote: "El estudio estatal distingue una búsqueda de armas el 15 de octubre del combate principal del 15 de noviembre; la ficha fecha y describe este último episodio."
  }),
  "Ataque a Lindley's Fort (1776)": conflictFix({
    parent: "Guerra cheroqui de 1776",
    campaign: "Ataques a la frontera de Carolina del Sur de 1776",
    region: "Lindley's Fort, Laurens County, Carolina del Sur, Estados Unidos",
    hierarchySources: [SOURCES.lindleysFort, SOURCES.lindleysFortContext],
    startYear: 1776,
    type: "ataque a fortificación",
    conflictType: "colonial",
    treaties: ["Tratado de DeWitt's Corner (1777)"],
    participants: [
      { side: "Defensores del fuerte", members: ["Milicia patriota de Carolina del Sur", "Familias refugiadas en Lindley's Fort"] },
      { side: "Fuerza atacante", members: ["Combatientes cheroqui", "Lealistas de Carolina del Sur"] }
    ],
    cause: "La guerra fronteriza entre comunidades cheroqui y asentamientos coloniales se entrelazó con la movilización lealista de la Revolución en el distrito de Ninety Six.",
    outcome: "El ataque del 15 de julio fue rechazado por los defensores dirigidos por Jonathan Downs y el fuerte siguió protegiendo a las familias del valle del Saluda.",
    consequences: "La acción precedió a una campaña provincial contra las Lower Towns cheroqui y a nuevas cesiones territoriales impuestas durante 1777.",
    chronology: [
      { year: 1776, event: "El 15 de julio combatientes cheroqui y lealistas atacaron Lindley's Fort y fueron rechazados." },
      { year: 1777, event: "El Tratado de DeWitt's Corner cerró la campaña con una amplia cesión de tierras cheroqui." }
    ],
    related: ["Guerra de Independencia de Estados Unidos"],
    curationNote: "La fuente local menciona lealistas disfrazados durante el ataque; la ficha separa su participación de la identidad de los combatientes cheroqui y no convierte ese relato en una equivalencia entre ambos grupos."
  }),
  "Batalla de Longue-Pointe (1775)": conflictFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Invasión de Quebec de 1775-1776",
    region: "Longue-Pointe, actual Montreal, Quebec, Canadá",
    hierarchySources: SOURCES.canadaHeritage,
    startYear: 1775,
    participants: [
      { side: "Destacamento de Ethan Allen", members: ["Ejército Continental"] },
      { side: "Defensores de Montreal", members: ["Milicia canadiense", "Ejército británico", "Voluntarios anglófonos de Montreal"] }
    ],
    cause: "Ethan Allen intentó tomar Montreal con una fuerza aislada mientras el grueso del Ejército Continental sitiaba Fort Saint-Jean.",
    outcome: "El 25 de septiembre los defensores derrotaron al destacamento estadounidense y capturaron a Allen y a buena parte de sus hombres.",
    consequences: "La derrota frustró el golpe inmediato contra Montreal, aunque la ciudad fue ocupada por Richard Montgomery en noviembre después de la caída de Fort Saint-Jean.",
    chronology: [
      { year: 1775, event: "El 25 de septiembre la fuerza de Allen fue rodeada y derrotada en Longue-Pointe." },
      { year: 1775, event: "Montreal cayó en noviembre tras el avance principal de Montgomery." }
    ],
    related: ["Sitio de Fort Saint-Jean", "Batalla de Quebec"]
  }),
  "Batalla de Saint-Pierre (1776)": conflictFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Invasión de Quebec de 1775-1776",
    region: "Saint-Pierre-de-la-Rivière-du-Sud, Quebec, Canadá",
    hierarchySources: [SOURCES.canadaHeritage, SOURCES.quebecSiege],
    startYear: 1776,
    type: "combate",
    participants: [
      { side: "Fuerza partidaria del Congreso", members: ["Milicia canadiense proestadounidense", "Ejército Continental"] },
      { side: "Milicia lealista local", members: ["Milicia canadiense lealista", "Provincia de Quebec"] }
    ],
    cause: "Ambos bandos intentaron movilizar a las comunidades francocanadienses mientras continuaba el sitio estadounidense de Quebec.",
    outcome: "El 25 de marzo la fuerza proestadounidense sorprendió y derrotó a la vanguardia lealista reunida cerca de Saint-Pierre, con varios muertos y decenas de prisioneros.",
    consequences: "La acción desarticuló esa movilización lealista local, pero no revirtió el deterioro de la ocupación estadounidense ni evitó la retirada continental de Quebec en mayo.",
    chronology: [
      { year: 1776, event: "El 25 de marzo milicias canadienses de lealtades opuestas combatieron en Saint-Pierre." },
      { year: 1776, event: "En mayo los refuerzos británicos obligaron al Ejército Continental a levantar el sitio de Quebec." }
    ],
    related: ["Sitio de Quebec de 1775-1776"],
    curationNote: "No se presenta como un choque binario entre estadounidenses y británicos: la mayor parte de ambos contingentes estaba formada por habitantes francocanadienses con lealtades opuestas."
  }),
  "Incursión de Norwalk (1779)": conflictFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Incursiones de Tryon en Connecticut de 1779",
    region: "Norwalk, Connecticut, Estados Unidos",
    hierarchySources: [SOURCES.norwalk, SOURCES.tryon],
    startYear: 1779,
    type: "incursión y quema",
    participants: [
      { side: "Fuerza expedicionaria británica", members: ["Ejército británico", "Tropas hessianas", "Lealistas"] },
      { side: "Defensa local", members: ["Milicia de Connecticut"] }
    ],
    cause: "La expedición de William Tryon atacó poblaciones costeras y centros de abastecimiento de Connecticut para destruir recursos y presionar al ejército de Washington.",
    outcome: "Entre el 10 y el 11 de julio la fuerza británica venció la resistencia local, incendió gran parte de Norwalk y regresó a sus transportes.",
    consequences: "La destrucción alcanzó viviendas, talleres, graneros, iglesias y embarcaciones, pero no consiguió que Washington abandonara las posiciones del Hudson.",
    chronology: [
      { year: 1779, event: "La expedición desembarcó, combatió con la milicia y quemó gran parte de Norwalk el 10 y 11 de julio." },
      { year: 1779, event: "La fuerza volvió a sus barcos sin provocar el desplazamiento estratégico esperado del Ejército Continental." }
    ],
    related: ["Incursiones de New Haven y Fairfield"],
    curationNote: "Se reclasifica como incursión y quema porque el combate local fue parte de una operación destructiva más amplia, no una batalla campal por la ocupación permanente de la ciudad."
  }),
  "Batalla de San Luis (1780)": conflictFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña del alto Misisipi de 1780",
    region: "San Luis, Luisiana española, actual Misuri, Estados Unidos",
    hierarchySources: SOURCES.stLouis,
    startYear: 1780,
    conflictType: "interestatal",
    participants: [
      { side: "Defensores de la Luisiana española", members: ["España", "Milicia criolla de San Luis", "Refuerzos de Sainte-Geneviève"] },
      { side: "Fuerza dirigida por agentes británicos", members: ["Comerciantes y milicianos canadienses", "Ojibwe", "Ho-Chunk", "Menominee", "Potawatomi", "Dakota"] }
    ],
    cause: "Después de la entrada de España en guerra contra Gran Bretaña, los británicos organizaron una expedición para apoderarse de San Luis y del corredor del alto Misisipi.",
    outcome: "El 26 de mayo el fuego de Fort San Carlos y de la milicia obligó a retirarse a la fuerza atacante después de varias horas de combate.",
    consequences: "La defensa mantuvo el alto Misisipi fuera del control británico; al menos 21 habitantes murieron y otros fueron capturados durante el ataque y las incursiones exteriores.",
    chronology: [
      { year: 1780, event: "El 26 de mayo la fuerza atacante llegó a San Luis y fue rechazada por las defensas españolas y locales." },
      { year: 1780, event: "No se produjo otro ataque británico de escala comparable contra la población antes del fin de la guerra." }
    ],
    related: ["Batalla de Fort San Carlos"],
    curationNote: "La ficha enumera las naciones indígenas citadas por el NPS en lugar de reducir una coalición diversa a un único bando étnico; no consolida bajas atacantes que la fuente institucional no fija."
  }),
  "Combate de Mobley's Meeting House (1780)": conflictFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña del sur de 1780",
    region: "Mobley's Meeting House, Fairfield County, Carolina del Sur, Estados Unidos",
    hierarchySources: SOURCES.mobleys,
    startYear: 1780,
    type: "combate",
    participants: [
      { side: "Milicia patriota", members: ["Milicia de Carolina del Sur"] },
      { side: "Milicia lealista", members: ["Lealistas de Carolina del Sur"] }
    ],
    cause: "Tras la caída de Charleston, lealistas armados usaron el entorno de la casa de reunión de Mobley mientras las milicias patriotas intentaban reactivar la resistencia local.",
    outcome: "El 26 de mayo la fuerza de William Bratton desalojó a los lealistas de la posición y dispersó la concentración.",
    consequences: "Fue una de las primeras victorias patriotas en Carolina del Sur después de la caída de Charleston y ayudó a sostener la resistencia de milicias en el interior.",
    chronology: [
      { year: 1780, event: "El 26 de mayo la milicia de Bratton atacó y dispersó a los lealistas en Mobley's Meeting House." }
    ],
    related: ["Sitio de Charleston de 1780"]
  }),
  "Batalla de Shallow Ford (1780)": conflictFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña del sur de 1780",
    region: "Shallow Ford del río Yadkin, Carolina del Norte, Estados Unidos",
    hierarchySources: SOURCES.shallowFord,
    startYear: 1780,
    participants: [
      { side: "Milicia patriota", members: ["Milicia de Carolina del Norte", "Milicia de Virginia"] },
      { side: "Lealistas del valle del Yadkin", members: ["Milicia lealista de Gideon Wright"] }
    ],
    cause: "Una sublevación lealista en el valle del Yadkin se produjo mientras gran parte de la milicia patriota regional combatía en Kings Mountain.",
    outcome: "El 14 de octubre más de trescientos milicianos patriotas emboscaron y derrotaron a una columna lealista de tamaño similar al oeste del vado.",
    consequences: "La resistencia lealista organizada de la región quedó desarticulada; la fuente estatal también registra asesinatos de prisioneros y represalias posteriores que impiden presentar el cierre como una pacificación limpia.",
    chronology: [
      { year: 1780, event: "El 14 de octubre la emboscada patriota derrotó a la columna de Gideon Wright en Shallow Ford." },
      { year: 1780, event: "Cinco días después se ofreció un indulto a quienes se rindieran y se amenazó con castigar los saqueos patriotas." }
    ],
    related: ["Batalla de Kings Mountain", "Batalla de Ramseur's Mill"],
    curationNote: "Se documenta la violencia contra cautivos mencionada por la fuente pública y no se convierte una victoria táctica en un relato sin abusos ni represalias."
  }),
  "Escaramuza de Wetzell's Mill (1781)": conflictFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña de Guilford Courthouse de 1781",
    region: "Wetzell's Mill, Carolina del Norte, Estados Unidos",
    hierarchySources: SOURCES.wetzellsMill,
    startYear: 1781,
    type: "escaramuza",
    participants: [
      { side: "Retaguardia estadounidense", members: ["Ejército Continental", "Milicias de Carolina del Sur y Georgia"] },
      { side: "Fuerza británica", members: ["Ejército británico", "Legión Británica"] }
    ],
    cause: "Cornwallis intentó alcanzar al ejército de Nathanael Greene antes de que este pudiera concentrar refuerzos para defenderse en Guilford Courthouse.",
    outcome: "El 6 de marzo la presión británica obligó a la retaguardia a combatir junto al cruce, pero la demora permitió que el grueso estadounidense atravesara el curso de agua y evitara una batalla decisiva.",
    consequences: "La retirada preservó al ejército de Greene, aunque el uso de las milicias como cobertura generó malestar y llevó a que Andrew Pickens las condujera temporalmente de regreso al sur.",
    chronology: [
      { year: 1781, event: "El 6 de marzo la retaguardia contuvo brevemente el avance británico en Wetzell's Mill." },
      { year: 1781, event: "Nueve días después los ejércitos principales combatieron en Guilford Courthouse." }
    ],
    related: ["Batalla de Guilford Courthouse"],
    curationNote: "Se evita asignar una victoria estratégica simple: los británicos dominaron el choque inmediato, pero no destruyeron al ejército que intentaban atrapar."
  }),
  "Asalto a Fort Slongo (1781)": conflictFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Operaciones de Long Island Sound de 1781",
    region: "Fort Slongo, Long Island, Nueva York, Estados Unidos",
    hierarchySources: [SOURCES.fortSlongo, SOURCES.fortSlongoMuseum],
    startYear: 1781,
    type: "asalto a fortificación",
    participants: [
      { side: "Fuerza de incursión estadounidense", members: ["Línea de Connecticut", "Segundo Regimiento de Dragones Ligeros Continentales"] },
      { side: "Guarnición lealista", members: ["Lealistas de Nueva York", "Reino de Gran Bretaña"], casualties: "21 prisioneros; 2 muertos y 2 heridos de muerte según el parte estadounidense" }
    ],
    cause: "Benjamin Tallmadge preparó una incursión nocturna para eliminar el pequeño reducto lealista que vigilaba el cruce del Long Island Sound.",
    outcome: "En la madrugada del 3 de octubre la fuerza de Lemuel Trescott sorprendió la guarnición, capturó el fuerte y regresó con prisioneros, un cañón y suministros.",
    consequences: "El reducto fue destruido y dejó de funcionar como puesto británico en las últimas semanas de la campaña de Yorktown.",
    chronology: [
      { year: 1781, event: "El 3 de octubre dos grupos coordinados cercaron y tomaron Fort Slongo antes del amanecer." },
      { year: 1781, event: "El parte enviado a Washington registró 21 prisioneros y la destrucción de la artillería que no pudo retirarse." }
    ],
    related: ["Campaña de Yorktown"],
    curationNote: "Las bajas y capturas se atribuyen al parte estadounidense conservado en Founders Online; la ficha no presume que ese recuento sea una evaluación independiente."
  })
};
