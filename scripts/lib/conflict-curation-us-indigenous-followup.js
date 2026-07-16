function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  kingPhilip: source(
    "Servicio de Parques Nacionales de EE. UU.: Guerra del Rey Felipe de 1675-1678",
    "https://home.nps.gov/rowi/learn/historyculture/kingphilip.htm"
  ),
  peskeompskut: source(
    "Servicio de Parques Nacionales de EE. UU.: batalla y masacre de Wissantinnewag-Peskeompskut",
    "https://www.nps.gov/articles/000/massachusetts-1676-battle-of-wissatinnewag-peskeompskut-great-falls-building-on-community-commitments-to-remember-honor-and-protect.htm"
  ),
  sudbury: source(
    "Municipio de Sudbury: combate de Sudbury y contexto territorial indígena",
    "https://sudbury.ma.us/conservationcommission/frontiers-of-change/"
  ),
  ojoCaliente: source(
    "Servicio de Parques Nacionales de EE. UU.: operaciones de Fort Union y campaña jicarilla de 1854",
    "https://www.nps.gov/foun/learn/historyculture/upload/TOME-2.pdf"
  ),
  fortBuchanan: source(
    "Servicio de Parques Nacionales de EE. UU.: historial del Primer Regimiento de Caballería de California y acción de Fort Buchanan",
    "https://www.nps.gov/civilwar/search-battle-units-detail.htm?battleUnitCode=UCA0001RC"
  ),
  fortBuchananContext: source(
    "Servicio de Parques Nacionales de EE. UU.: incidente Bascom y comienzo de la guerra chiricahua",
    "https://www.nps.gov/fobo/learn/historyculture/bascom-affair.htm"
  ),
  fortBuchananArizona: source(
    "Departamento de Transporte de Arizona: incendio de Fort Buchanan durante las guerras apaches",
    "https://azdot.gov/adot-blog/camp-marker-along-sr-82-worth-stop"
  ),
  dryLake: source(
    "Servicio de Parques Nacionales de EE. UU.: Guerra modoc y combate de Dry Lake",
    "https://www.nps.gov/labe/learn/historyculture/modoc-war.htm"
  ),
  turretPeakArmy: source(
    "Museo de Fort Huachuca del Ejército de EE. UU.: campaña del Tonto Basin y Turret Peak",
    "https://home.army.mil/huachuca/application/files/7016/6577/8820/Vol_6_1999_Apache_Campaigns.pdf"
  ),
  turretPeakShpo: source(
    "Oficina de Preservación Histórica de Arizona: guerras indígenas en Arizona y acción de Turret Peak",
    "https://arizona-content.usedirect.com/storage/gallery/asp-archive/SHPO/downloads/MPDFS/Indian_Warfare_MPDF.PDF"
  ),
  sugarPoint: source(
    "Sociedad Histórica de Minnesota: estudio del combate de Sugar Point de 1898",
    "https://collections.mnhs.org/MNHistoryMagazine/articles/3/v03i05p273-290.pdf"
  ),
  sugarPointMarker: source(
    "Departamento de Transporte de Minnesota: inventario histórico del sitio de Sugar Point",
    "https://www.dot.state.mn.us/roadsides/historic/files/iforms/CA-PLK-003.pdf"
  ),
  kelleyCreekLoc: source(
    "Biblioteca del Congreso de EE. UU.: colección documental del conflicto de Kelley Creek",
    "https://www.loc.gov/item/ncr001366/",
    "media"
  ),
  kelleyCreekNhs: source(
    "Sociedad Histórica de Nevada: revisión histórica de Shoshone Mike y Kelley Creek",
    "https://epubs.nsla.nv.gov/statepubs/epubs/210777-1995-1Spring.pdf",
    "media"
  ),
  bearValley: source(
    "Museo de Fort Huachuca del Ejército de EE. UU.: combate yaqui de Bear Valley",
    "https://home.army.mil/huachuca/application/files/1916/6577/8855/Vol_2_1999_10th_Cavalry.pdf"
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
  conflictType = "colonial",
  scale = "local",
  treaties = [],
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
    chronology: chronology || [{ year: startYear, event: outcome }],
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: confidence,
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-us-indigenous-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    ...(curationNote ? { curationNote } : {})
  };
}

export const US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Turner's Falls": "Masacre de Peskeompskut (1676)",
  "Batalla de Sudbury": "Combate de Sudbury (1676)",
  "Batalla de Ojo Caliente Canyon": "Batalla del cañón de Ojo Caliente (1854)",
  "Batalla de Fort Buchanan": "Ataque a Fort Buchanan (1865)",
  "Batalla de Dry Lake": "Batalla de Dry Lake (1873)",
  "Batalla de Sand Butte": "Batalla de Dry Lake (1873)",
  "Batalla de Turret Peak": "Batalla de Turret Peak (1873)",
  "Batalla de Sugar Point": "Combate de Sugar Point (1898)",
  "Batalla de Kelley Creek": "Masacre de Kelley Creek (1911)",
  "Batalla de Bear Valley": "Combate de Bear Valley (1918)"
};

export const US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Masacre de Peskeompskut (1676)": conflictFix({
    parent: "Guerra del Rey Felipe",
    campaign: "Campaña del valle del Connecticut de 1676",
    region: "Wissantinnewag-Peskeompskut, valle del río Connecticut, Massachusetts, Estados Unidos",
    hierarchySources: [SOURCES.kingPhilip, SOURCES.peskeompskut],
    startYear: 1676,
    type: "masacre y combate",
    participants: [
      { side: "Milicia colonial de Massachusetts", members: ["Colonia de la Bahía de Massachusetts"] },
      { side: "Comunidades algonquinas reunidas en Peskeompskut", members: ["Coalición algonquina de Peskeompskut"], casualties: "Cientos de habitantes muertos, en su mayoría no combatientes, según el NPS" }
    ],
    cause: "La milicia colonial atacó el poblado y refugio de Peskeompskut en represalia por acciones previas de la Guerra del Rey Felipe y dentro de una disputa más amplia por tierras, cultivos y autonomía indígena.",
    outcome: "La incursión mató a cientos de habitantes, principalmente no combatientes; una contraofensiva indígena obligó a la milicia a retirarse y le causó pérdidas importantes.",
    consequences: "La acción devastó a las comunidades reunidas en Wissantinnewag, pero no aseguró el valle para los colonos y hoy es objeto de investigación arqueológica y procesos de memoria con participación tribal.",
    curationNote: "Se sustituye el nombre heredado de Turner's Falls por el topónimo indígena Peskeompskut y se registra la naturaleza combinada de masacre de civiles y combate durante la retirada."
  }),
  "Combate de Sudbury (1676)": conflictFix({
    parent: "Guerra del Rey Felipe",
    campaign: "Campaña de Massachusetts oriental de 1676",
    region: "Sudbury y actual Wayland, Massachusetts, Estados Unidos",
    hierarchySources: [SOURCES.kingPhilip, SOURCES.sudbury],
    startYear: 1676,
    type: "combate",
    participants: [
      { side: "Pobladores y milicias coloniales", members: ["Colonia de la Bahía de Massachusetts"] },
      { side: "Coalición indígena", members: ["Nipmuc", "Wampanoag", "Narragansett"] }
    ],
    cause: "La expansión colonial sobre territorios indígenas y la escalada de la Guerra del Rey Felipe llevaron a una ofensiva contra el asentamiento fronterizo de Sudbury.",
    outcome: "La coalición indígena penetró las defensas exteriores, destruyó numerosas viviendas y emboscó a una fuerza de socorro; las casas fortificadas resistieron y el ataque terminó con la retirada indígena.",
    consequences: "Las pérdidas de la columna de Samuel Wadsworth y la destrucción local impulsaron a las autoridades coloniales a reforzar las poblaciones fronterizas.",
    curationNote: "El resultado no se reduce a una victoria simple: las fuentes municipales distinguen el daño y la emboscada de la resistencia final de las guarniciones."
  }),
  "Batalla del cañón de Ojo Caliente (1854)": conflictFix({
    parent: "Guerra jicarilla",
    campaign: "Campaña de Nuevo México de 1854",
    region: "Cañón de Ojo Caliente, Nuevo México, Estados Unidos",
    hierarchySources: SOURCES.ojoCaliente,
    startYear: 1854,
    participants: [
      { side: "Expedición de Philip St. George Cooke", members: ["Estados Unidos", "Exploradores pueblo y mexicanos"] },
      { side: "Jicarilla apache y aliados ute", members: ["Jicarilla Apache", "Ute"] }
    ],
    cause: "Tras la derrota estadounidense de Cieneguilla, una fuerza ampliada persiguió a los jicarilla y ute para recuperar la iniciativa militar y proteger las rutas de Nuevo México.",
    outcome: "La expedición sorprendió el campamento de Chacón el 8 de abril y dispersó a sus defensores, que evitaron una persecución prolongada al dividirse en grupos pequeños.",
    consequences: "La acción redujo la capacidad jicarilla de concentrar fuerzas y abrió una fase de negociaciones y operaciones menores durante el resto de 1854.",
    related: ["Batalla de Cieneguilla"],
    curationNote: "El año se incorpora al nombre para diferenciar esta acción jicarilla del combate de Ojo Caliente asociado a la guerra de Victorio en 1879."
  }),
  "Ataque a Fort Buchanan (1865)": conflictFix({
    parent: "Guerras apaches",
    campaign: "Guerra chiricahua de 1861-1872",
    region: "Fort Buchanan, territorio de Arizona, Estados Unidos",
    hierarchySources: [SOURCES.fortBuchanan, SOURCES.fortBuchananContext, SOURCES.fortBuchananArizona],
    startYear: 1865,
    type: "ataque",
    participants: [
      { side: "Guarnición de voluntarios de California", members: ["Estados Unidos", "Primer Regimiento de Caballería de California"] },
      { side: "Fuerza apache chiricahua", members: ["Chiricahua Apache"] }
    ],
    cause: "La guerra iniciada tras el incidente Bascom continuaba mientras una guarnición reducida ocupaba de manera intermitente el antiguo puesto de Fort Buchanan.",
    outcome: "El ataque apache del 17 de febrero obligó a abandonar el puesto, que fue incendiado y no volvió a ocuparse de forma permanente.",
    consequences: "La pérdida del puesto contribuyó a que Estados Unidos construyera Fort Crittenden en las cercanías en 1867.",
    curationNote: "Se clasifica como ataque a un puesto militar y no como batalla campal; las cifras finas de fuerzas y bajas no se consolidan porque las fuentes institucionales resumidas no coinciden en ese nivel."
  }),
  "Batalla de Dry Lake (1873)": conflictFix({
    parent: "Guerra modoc",
    campaign: "Fase final de la Guerra modoc de 1873",
    region: "Dry Lake, norte de California, Estados Unidos",
    hierarchySources: SOURCES.dryLake,
    startYear: 1873,
    participants: [
      { side: "Ejército de Estados Unidos", members: ["Estados Unidos"] },
      { side: "Combatientes modoc", members: ["Modoc"] }
    ],
    cause: "Después de abandonar Captain Jack's Stronghold, un grupo modoc atacó el campamento de tropas que lo perseguían cerca de Dry Lake.",
    outcome: "Las tropas rechazaron el ataque del 10 de mayo; fue la primera derrota táctica modoc destacada por el Servicio de Parques Nacionales.",
    consequences: "La derrota agravó las divisiones internas, precedió a la rendición de la banda de Hot Creek y aceleró el cierre de la guerra el 1 de junio.",
    related: ["Batalla de Lost River"],
    curationNote: "Dry Lake y Sand Butte son nombres alternativos de la misma acción; la regla fusiona las dos fichas que el importador había creado por separado."
  }),
  "Batalla de Turret Peak (1873)": conflictFix({
    parent: "Guerra tonto",
    campaign: "Campaña del Tonto Basin de 1872-1873",
    region: "Turret Peak, territorio de Arizona, Estados Unidos",
    hierarchySources: [SOURCES.turretPeakArmy, SOURCES.turretPeakShpo],
    startYear: 1873,
    participants: [
      { side: "Ejército de Estados Unidos y exploradores indígenas", members: ["Estados Unidos", "Exploradores apache"] },
      { side: "Ranchería yavapai y tonto apache", members: ["Yavapai", "Tonto Apache"] }
    ],
    cause: "La campaña de George Crook buscaba localizar y forzar a las rancherías yavapai y tonto apache a concentrarse en reservas de Arizona.",
    outcome: "La columna de George M. Randall sorprendió la ranchería al amanecer del 27 de marzo, mató o capturó a numerosos habitantes y tomó la posición.",
    consequences: "El ataque quebró gran parte de la resistencia organizada en el Tonto Basin y fue seguido por rendiciones colectivas en Camp Verde.",
    related: ["Masacre de Skeleton Cave"],
    curationNote: "Las fuentes ofrecen cifras distintas y categorías étnicas variables; la ficha no presenta un total único de víctimas como definitivo."
  }),
  "Combate de Sugar Point (1898)": conflictFix({
    parent: "Crisis de Leech Lake de 1898",
    campaign: "Expedición federal a Sugar Point",
    region: "Sugar Point, reserva de Leech Lake, Minnesota, Estados Unidos",
    hierarchySources: [SOURCES.sugarPoint, SOURCES.sugarPointMarker],
    startYear: 1898,
    type: "combate",
    participants: [
      { side: "Tercer Regimiento de Infantería y alguaciles federales", members: ["Estados Unidos"], casualties: "6 militares muertos y 10 heridos durante el combate principal; otras bajas se produjeron después" },
      { side: "Banda Pillager de Leech Lake", members: ["Ojibwe Pillager"], casualties: "No consolidadas; los testimonios contemporáneos son contradictorios" }
    ],
    cause: "Las denuncias ojibwe por fraude en la explotación de madera y arrestos indiscriminados precedieron a una expedición federal destinada a detener a Bugonaygeshig y otros residentes.",
    outcome: "La fuerza federal no capturó a Bugonaygeshig y quedó aislada bajo fuego hasta la llegada de refuerzos; los combatientes ojibwe se retiraron del área.",
    consequences: "El gobierno abrió una investigación sobre la administración de la madera y negoció con los líderes de Leech Lake, evitando una campaña militar más amplia.",
    curationNote: "Las bajas se separan entre el combate principal y hechos posteriores para no mezclar al policía indígena muerto por fuego amigo con las pérdidas directamente causadas por los combatientes ojibwe."
  }),
  "Masacre de Kelley Creek (1911)": conflictFix({
    parent: "Incidente de Little High Rock Canyon y Kelley Creek",
    campaign: "Persecución policial de enero y febrero de 1911",
    region: "Kelley Creek, condado de Humboldt, Nevada, Estados Unidos",
    hierarchySources: [SOURCES.kelleyCreekLoc, SOURCES.kelleyCreekNhs],
    startYear: 1911,
    type: "masacre y enfrentamiento policial",
    conflictType: "interno",
    participants: [
      { side: "Policía estatal y posse interestatal", members: ["Policía Estatal de Nevada", "Agentes y civiles de Nevada y California"], casualties: "1 integrante muerto" },
      { side: "Familia de Mike Daggett", members: ["Familia shoshone de Mike Daggett"], casualties: "8 muertos y 4 niños capturados" }
    ],
    cause: "Una fuerza policial y civil persiguió durante semanas a la familia Daggett después de atribuirle la muerte de cuatro trabajadores ganaderos en Little High Rock Canyon.",
    outcome: "El enfrentamiento terminó con ocho integrantes de la familia muertos, cuatro niños capturados y un miembro de la fuerza perseguidora muerto.",
    consequences: "Los restos y objetos de la familia fueron conservados durante décadas en colecciones; parte de ellos fue posteriormente repatriada a comunidades shoshone.",
    curationNote: "Se evita presentarlo como guerra entre Estados: fue una persecución policial de una familia indígena y la atribución de los homicidios iniciales no se formula como hecho judicial probado. La fecha aparece como 25 o 26 de febrero según el registro consultado."
  }),
  "Combate de Bear Valley (1918)": conflictFix({
    parent: "Conflicto fronterizo entre Estados Unidos y México (1910-1919)",
    campaign: "Patrullaje fronterizo de Arizona de 1918",
    region: "Bear Valley, Arizona, Estados Unidos",
    hierarchySources: SOURCES.bearValley,
    startYear: 1918,
    type: "combate fronterizo",
    conflictType: "frontera",
    scale: "regional",
    participants: [
      { side: "Décimo Regimiento de Caballería", members: ["Estados Unidos", "Buffalo Soldiers"] },
      { side: "Grupo yaqui en tránsito", members: ["Yaqui"], casualties: "10 capturados; uno murió posteriormente por sus heridas" }
    ],
    cause: "El Ejército patrullaba rutas usadas para cruzar armas hacia Sonora; el grupo yaqui abrió fuego porque creyó que los soldados negros eran tropas mexicanas al otro lado de la frontera.",
    outcome: "Tras un breve combate el 9 de enero, una retaguardia de diez yaquis se rindió mientras el resto del grupo cruzó hacia México.",
    consequences: "Los detenidos fueron procesados por exportación de armas; el episodio quedó como uno de los últimos combates registrados entre el Ejército estadounidense y un grupo indígena.",
    curationNote: "La fuente del Museo de Fort Huachuca advierte que el telegrama militar es el único registro oficial contemporáneo y completa el relato con entrevistas posteriores a participantes."
  })
};
