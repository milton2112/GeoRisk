function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  chinaRelief: source(
    "U.S. Army Center of Military History: expedición de socorro a China de 1900",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/China-Relief-Expedition/"
  ),
  russianExpeditions: source(
    "U.S. Army Center of Military History: expediciones estadounidenses en el norte de Rusia",
    "https://history.army.mil/portals/143/Images/Publications/catalog/77-10.pdf"
  ),
  worldWarOne: source(
    "U.S. Army Center of Military History: Into the Fight, abril-junio de 1918",
    "https://history.army.mil/Publications/Publications-Catalog/Into-the-Fight/"
  ),
  elGuettar: source(
    "U.S. Army Center of Military History: batalla de El Guettar, 23 de marzo de 1943",
    "https://history.army.mil/Portals/143/Images/Birthday/Army_History_and_Heritage.pdf"
  ),
  koreaGround: source(
    "U.S. Army Center of Military History: Combat Actions in Korea",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/C%20Pdf/CMH_Pub_30-2.pdf"
  ),
  koreaAir: source(
    "Department of the Air Force: campañas aéreas de la Guerra de Corea",
    "https://www.dafhistory.af.mil/Portals/16/documents/Timelines/Korea/KoreanWarCampaigns.pdf"
  ),
  apBac: source(
    "U.S. Army Center of Military History: Public Affairs, The Military and the Media, 1962-1968",
    "https://history.army.mil/portals/143/Images/Publications/catalog/91-13.pdf"
  ),
  hiepHoa: source(
    "U.S. Army Center of Military History: U.S. Army Special Forces, 1961-1971",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/U%20Pdf/CMH_Pub_90-23-1.pdf"
  ),
  ongThanh: source(
    "U.S. Army Center of Military History: Combat Operations, Taking the Offensive",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/C%20Pdf/combat-taking-the-offensive.pdf"
  ),
  vietnamDrawdown: source(
    "U.S. Army Center of Military History: The Drawdown, 1970-1971",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/D%20PDF/CMH%20Pub%2076-7%20-%20The%20Drawdown.pdf"
  ),
  gulfWar: source(
    "U.S. Army Center of Military History: The Whirlwind War",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/W%20PDF/CMH_70-117-1.pdf"
  ),
  medinaRidge: source(
    "U.S. Army Center of Military History: Army History 118, combate en Medina Ridge",
    "https://history.army.mil/Portals/143/Images/Publications/ArmyHistoryMag/pdf/AH118.pdf"
  ),
  biap: source(
    "U.S. Army Transportation Corps: batalla de BIAP durante el levantamiento de abril de 2004",
    "https://transportation.army.mil/history/studies/april_uprising.html"
  ),
  husaybah: source(
    "1st Marine Division: combate de los Marines en Husaybah",
    "https://www.1stmardiv.marines.mil/News/Article/Article/540583/marines-fight-enemy-across-western-iraq/"
  ),
  ganjgal: source(
    "U.S. Army: acción de Ganjgal del 8 de septiembre de 2009",
    "https://www.army.mil/medalofhonor/swenson/"
  ),
  shokValley: source(
    "U.S. Army: combate en el valle de Shok del 6 de abril de 2008",
    "https://www.army.mil/article/20391/nightmare_in_the_shok_valley"
  ),
  doAb: source(
    "U.S. Army Europe and Africa: batalla de Do Ab del 25 de mayo de 2011",
    "https://www.europeafrica.army.mil/UITC/?dvpTag=MC-12W&dvpmoduleid=99137&videoid=144911"
  )
};

function actionFix({
  parent,
  campaign,
  region,
  source: hierarchySource,
  startYear,
  type = "batalla",
  conflictType = "interestatal",
  scale = "internacional",
  sideOne,
  sideTwo,
  cause,
  outcome,
  consequences,
  chronologyEvent,
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
    chronology: [{ year: startYear, event: chronologyEvent }],
    treaties: [],
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants: [sideOne, sideTwo],
    hierarchyConfidence: hierarchySource.confidence,
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-us-overseas-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

export const US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Ch-teau-Thierry": "Batalla de Château-Thierry",
  "Batalla de Suwon Airfield": "Combate aéreo del aeródromo de Suwon",
  "Batalla de Hiep Hoa": "Ataque al campamento de Hiep Hoa",
  "Batalla de FSB Mary Ann": "Batalla de la base de fuego Mary Ann",
  "Batalla de Medina Ridge": "Batalla de la cresta de Medina",
  "Batalla por Jalibah Airfield": "Batalla del aeródromo de Jalibah",
  "Batalla de BIAP": "Batalla del Aeropuerto Internacional de Bagdad",
  "Batalla de Shok Valley": "Batalla del valle de Shok"
};

export const US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Beicang": actionFix({
    parent: "Rebelion de los Boxers",
    campaign: "Expedición de socorro a China",
    region: "Beicang, Tianjin, China",
    source: SOURCES.chinaRelief,
    startYear: 1900,
    conflictType: "intervencion",
    sideOne: { side: "Fuerza internacional", members: ["Alianza de las Ocho Naciones"] },
    sideTwo: { side: "Defensores chinos", members: ["Ejército Qing", "Boxers"] },
    cause: "La fuerza internacional avanzó desde Tianjin para abrir la ruta hacia Pekín y auxiliar a las legaciones sitiadas.",
    outcome: "Victoria de la fuerza internacional; las defensas chinas de Beicang fueron superadas.",
    consequences: "La toma del 5 de agosto permitió reanudar el avance aliado hacia Yangcun y Pekín.",
    chronologyEvent: "El 5 de agosto, la expedición atacó y ocupó las posiciones fortificadas de Beicang, también conocida como Peitsang."
  }),
  "Batalla de Yangcun": actionFix({
    parent: "Rebelion de los Boxers",
    campaign: "Expedición de socorro a China",
    region: "Yangcun, Tianjin, China",
    source: SOURCES.chinaRelief,
    startYear: 1900,
    conflictType: "intervencion",
    sideOne: { side: "Fuerza internacional", members: ["Alianza de las Ocho Naciones"] },
    sideTwo: { side: "Defensores chinos", members: ["Ejército Qing", "Boxers"] },
    cause: "La expedición debía despejar la vía férrea y el corredor entre Tianjin y Pekín tras la caída de Beicang.",
    outcome: "Victoria de la fuerza internacional y retirada de los defensores chinos.",
    consequences: "La acción del 6 de agosto aseguró otro tramo del itinerario hacia las legaciones de Pekín.",
    chronologyEvent: "El 6 de agosto, las fuerzas internacionales combatieron en Yangcun y obligaron a retirarse a los defensores chinos."
  }),
  "Batalla de Bolshie Ozerki": actionFix({
    parent: "Guerra civil rusa",
    campaign: "Intervencion aliada en el norte de Rusia",
    region: "Bolshie Ozerki, óblast de Arcángel, Rusia",
    source: SOURCES.russianExpeditions,
    startYear: 1919,
    conflictType: "intervencion",
    sideOne: { side: "Fuerzas antibolcheviques", members: ["Estados Unidos", "Reino Unido", "Ejército Blanco"] },
    sideTwo: { side: "Fuerzas bolcheviques", members: ["Ejército Rojo"] },
    cause: "El control de Bolshie Ozerki bloqueaba la comunicación entre las columnas aliadas que operaban al sur de Arcángel.",
    outcome: "Éxito defensivo aliado tras varios asaltos; la localidad fue recuperada cuando el Ejército Rojo se retiró en abril.",
    consequences: "La reapertura de la ruta permitió reunir fuerzas aliadas, aunque no alteró la decisión de abandonar la intervención.",
    chronologyEvent: "Entre fines de marzo y el 18 de abril, fuerzas aliadas resistieron la ofensiva roja y retomaron Bolshie Ozerki."
  }),
  "Batalla de Ust-Padenga": actionFix({
    parent: "Guerra civil rusa",
    campaign: "Intervencion aliada en el norte de Rusia",
    region: "Ust-Padenga, río Vaga, óblast de Arcángel, Rusia",
    source: SOURCES.russianExpeditions,
    startYear: 1919,
    conflictType: "intervencion",
    sideOne: { side: "Fuerzas antibolcheviques", members: ["Estados Unidos", "Reino Unido", "Ejército Blanco"] },
    sideTwo: { side: "Fuerzas bolcheviques", members: ["Ejército Rojo"] },
    cause: "El Ejército Rojo atacó el saliente aliado sobre el río Vaga para aislar la guarnición de Shenkursk.",
    outcome: "Victoria bolchevique; las posiciones avanzadas aliadas cedieron y sus tropas se retiraron hacia Shenkursk.",
    consequences: "La ruptura contribuyó a la evacuación de Shenkursk y a la contracción del frente aliado en enero de 1919.",
    chronologyEvent: "En enero, el bombardeo y los asaltos del Ejército Rojo obligaron a abandonar las posiciones de Ust-Padenga."
  }),
  "Batalla de Cantigny": actionFix({
    parent: "Primera Guerra Mundial",
    campaign: "Operaciones estadounidenses de Picardía de 1918",
    region: "Cantigny, Somme, Francia",
    source: SOURCES.worldWarOne,
    startYear: 1918,
    sideOne: { side: "Aliados", members: ["Estados Unidos", "Francia"] },
    sideTwo: { side: "Potencias Centrales", members: ["Alemania"] },
    cause: "La 1.ª División estadounidense debía eliminar el saliente alemán de Cantigny y demostrar su capacidad para conducir una ofensiva independiente.",
    outcome: "Victoria aliada; Cantigny fue capturada y retenida frente a repetidos contraataques alemanes.",
    consequences: "La acción del 28 de mayo fue la primera ofensiva importante de una división estadounidense en la guerra y elevó la confianza aliada.",
    chronologyEvent: "El 28 de mayo, la 1.ª División estadounidense tomó Cantigny con apoyo francés y sostuvo la posición."
  }),
  "Batalla de Château-Thierry": actionFix({
    parent: "Primera Guerra Mundial",
    campaign: "Ofensiva del Aisne de 1918",
    region: "Château-Thierry, Aisne, Francia",
    source: SOURCES.worldWarOne,
    startYear: 1918,
    sideOne: { side: "Aliados", members: ["Estados Unidos", "Francia"] },
    sideTwo: { side: "Potencias Centrales", members: ["Alemania"] },
    cause: "El avance alemán hacia el Marne amenazó los cruces de Château-Thierry y la ruta directa hacia París.",
    outcome: "Victoria defensiva aliada; el avance alemán fue contenido en los accesos y puentes sobre el Marne.",
    consequences: "La defensa de comienzos de junio estabilizó el sector y precedió a los combates de Belleau Wood y a la contraofensiva aliada.",
    chronologyEvent: "Entre el 1 y el 4 de junio, fuerzas estadounidenses y francesas bloquearon los intentos alemanes de ampliar su cabeza de puente."
  }),
  "Batalla de El Guettar": actionFix({
    parent: "Segunda Guerra Mundial",
    campaign: "Campaña de Túnez",
    region: "El Guettar, gobernación de Gafsa, Túnez",
    source: SOURCES.elGuettar,
    startYear: 1943,
    scale: "regional",
    sideOne: { side: "Aliados", members: ["Estados Unidos"] },
    sideTwo: { side: "Eje", members: ["Alemania", "Italia"] },
    cause: "El II Cuerpo estadounidense avanzó hacia Gabès mientras el Eje intentó destruir su concentración alrededor de El Guettar.",
    outcome: "Victoria defensiva estadounidense; el ataque de la 10.ª División Panzer del 23 de marzo fue rechazado, aunque los avances posteriores quedaron contenidos.",
    consequences: "La batalla restauró parte de la confianza estadounidense tras Kasserine y mantuvo la presión aliada sobre el frente tunecino.",
    chronologyEvent: "El 23 de marzo, la 1.ª División de Infantería y unidades antitanque rechazaron el principal contraataque alemán."
  }),
  "Batalla de Pyongtaek": actionFix({
    parent: "Guerra de Corea",
    campaign: "Defensa de las Naciones Unidas de 1950",
    region: "Pyongtaek, provincia de Gyeonggi, Corea del Sur",
    source: SOURCES.koreaGround,
    startYear: 1950,
    scale: "regional",
    sideOne: { side: "Naciones Unidas", members: ["Estados Unidos", "Corea del Sur"] },
    sideTwo: { side: "Corea del Norte", members: ["Ejército Popular de Corea"] },
    cause: "Las primeras unidades terrestres estadounidenses intentaron demorar el avance norcoreano hacia el sur después de la derrota en Osan.",
    outcome: "Victoria norcoreana; la defensa estadounidense no pudo sostener Pyongtaek y se retiró hacia Cheonan.",
    consequences: "La retirada confirmó la necesidad de concentrar refuerzos y organizar una línea defensiva más profunda antes del perímetro de Busan.",
    chronologyEvent: "El 6 de julio, elementos estadounidenses abandonaron sus posiciones ante el avance de blindados e infantería norcoreanos."
  }),
  "Combate aéreo del aeródromo de Suwon": actionFix({
    parent: "Guerra de Corea",
    campaign: "Campaña aérea inicial de Corea",
    region: "Aeródromo de Suwon, Corea del Sur",
    source: SOURCES.koreaAir,
    startYear: 1950,
    type: "combate aéreo",
    scale: "regional",
    sideOne: { side: "Naciones Unidas", members: ["Fuerza Aérea de Estados Unidos", "Corea del Sur"] },
    sideTwo: { side: "Corea del Norte", members: ["Fuerza Aérea Popular de Corea"] },
    cause: "La aviación norcoreana atacó Suwon para interrumpir la evacuación y las primeras operaciones aéreas de las Naciones Unidas.",
    outcome: "Resultado operacional mixto; los ataques dañaron el aeródromo, pero cazas estadounidenses derribaron aeronaves norcoreanas y la evacuación continuó.",
    consequences: "Los combates del 27 y 28 de junio marcaron las primeras victorias aéreas estadounidenses de la guerra y aceleraron la dispersión de operaciones.",
    chronologyEvent: "Entre el 27 y el 28 de junio, cazas estadounidenses protegieron Suwon frente a ataques norcoreanos mientras continuaban las evacuaciones."
  }),
  "Batalla de Ap Bac": actionFix({
    parent: "Guerra de Vietnam",
    campaign: "Período de asesoramiento estadounidense",
    region: "Ấp Bắc, provincia de Định Tường, Vietnam del Sur",
    source: SOURCES.apBac,
    startYear: 1963,
    conflictType: "insurgencia",
    scale: "regional",
    sideOne: { side: "Vietnam del Sur", members: ["República de Vietnam", "Asesores de Estados Unidos"] },
    sideTwo: { side: "Insurgencia comunista", members: ["Viet Cong"] },
    cause: "Fuerzas survietnamitas intentaron cercar y destruir una unidad del Viet Cong detectada cerca de Ap Bac.",
    outcome: "Victoria táctica del Viet Cong; sus fuerzas resistieron los asaltos y se retiraron conservando la mayor parte de la unidad.",
    consequences: "La acción del 2 de enero expuso fallas de mando, coordinación y empleo de helicópteros del ejército survietnamita.",
    chronologyEvent: "El 2 de enero, unidades survietnamitas apoyadas por asesores y helicópteros estadounidenses no lograron cerrar el cerco sobre Ap Bac."
  }),
  "Ataque al campamento de Hiep Hoa": actionFix({
    parent: "Guerra de Vietnam",
    campaign: "Programa CIDG y guerra de puestos",
    region: "Hiệp Hòa, provincia de Hậu Nghĩa, Vietnam del Sur",
    source: SOURCES.hiepHoa,
    startYear: 1963,
    type: "ataque a base",
    conflictType: "insurgencia",
    scale: "local",
    sideOne: { side: "Defensores", members: ["Grupo Civil de Defensa Irregular", "Fuerzas Especiales de Estados Unidos", "Vietnam del Sur"] },
    sideTwo: { side: "Atacantes", members: ["Viet Cong"] },
    cause: "El Viet Cong buscó destruir un campamento CIDG aislado y capturar armas, suministros y personal.",
    outcome: "Victoria del Viet Cong; el campamento fue infiltrado y tomado durante la noche.",
    consequences: "La pérdida de Hiep Hoa impulsó el refuerzo físico y operativo de otros campamentos CIDG vulnerables.",
    chronologyEvent: "Durante la noche del 22 al 23 de noviembre, fuerzas del Viet Cong penetraron y ocuparon el campamento de Hiep Hoa."
  }),
  "Batalla de Ong Thanh": actionFix({
    parent: "Guerra de Vietnam",
    campaign: "Operación Shenandoah II",
    region: "Ông Thành, provincia de Bình Dương, Vietnam del Sur",
    source: SOURCES.ongThanh,
    startYear: 1967,
    conflictType: "insurgencia",
    scale: "regional",
    sideOne: { side: "Estados Unidos", members: ["2.º Batallón, 28.º Regimiento de Infantería"] },
    sideTwo: { side: "Fuerzas comunistas", members: ["Viet Cong"] },
    cause: "Una fuerza estadounidense buscó localizar unidades del Viet Cong que operaban en las plantaciones al norte de Saigón.",
    outcome: "Victoria táctica del Viet Cong; una columna estadounidense fue emboscada y sufrió pérdidas graves antes de romper el contacto.",
    consequences: "La acción demostró el riesgo de perseguir a fuerzas bien preparadas dentro de terreno boscoso con inteligencia incompleta.",
    chronologyEvent: "El 17 de octubre, el 2.º Batallón del 28.º de Infantería fue emboscado durante la Operación Shenandoah II."
  }),
  "Batalla de la base de fuego Mary Ann": actionFix({
    parent: "Guerra de Vietnam",
    campaign: "Contraofensiva, fase VII",
    region: "Base de fuego Mary Ann, provincia de Quảng Tín, Vietnam del Sur",
    source: SOURCES.vietnamDrawdown,
    startYear: 1971,
    type: "ataque a base",
    conflictType: "insurgencia",
    scale: "local",
    sideOne: { side: "Estados Unidos", members: ["23.ª División de Infantería"] },
    sideTwo: { side: "Vietnam del Norte", members: ["Ejército Popular de Vietnam"] },
    cause: "Fuerzas norvietnamitas intentaron destruir una base avanzada estadounidense debilitada durante la reducción de tropas.",
    outcome: "Victoria táctica norvietnamita; zapadores penetraron la base y causaron grandes pérdidas antes de retirarse.",
    consequences: "El ataque del 28 de marzo provocó investigaciones, relevos de mando y un examen de la disciplina defensiva durante la retirada estadounidense.",
    chronologyEvent: "En la madrugada del 28 de marzo, zapadores norvietnamitas atravesaron el perímetro y atacaron posiciones de mando y artillería."
  }),
  "Batalla de Snuol": actionFix({
    parent: "Guerra de Vietnam",
    campaign: "Operación Toàn Thắng 1/71",
    region: "Snuol, provincia de Kratié, Camboya",
    source: SOURCES.vietnamDrawdown,
    startYear: 1971,
    conflictType: "interestatal",
    scale: "regional",
    sideOne: { side: "Vietnam del Sur", members: ["República de Vietnam", "Apoyo aéreo de Estados Unidos"] },
    sideTwo: { side: "Vietnam del Norte", members: ["Ejército Popular de Vietnam"] },
    cause: "Una fuerza survietnamita desplegada en Camboya quedó expuesta a una ofensiva norvietnamita que amenazó sus rutas de abastecimiento y retirada.",
    outcome: "Victoria norvietnamita; la fuerza survietnamita evacuó Snuol bajo fuerte presión y con pérdidas importantes.",
    consequences: "La retirada de fines de mayo debilitó la confianza en la vietnamización y cerró la presencia prolongada de esa fuerza en el sector.",
    chronologyEvent: "Desde el 25 de mayo, ataques norvietnamitas cercaron las posiciones y forzaron la retirada survietnamita de Snuol."
  }),
  "Batalla de Al Busayyah": actionFix({
    parent: "Guerra del Golfo",
    campaign: "Operación Tormenta del Desierto",
    region: "Al Busayyah, gobernación de Dhi Qar, Irak",
    source: SOURCES.gulfWar,
    startYear: 1991,
    scale: "regional",
    sideOne: { side: "Coalición internacional", members: ["Estados Unidos", "Reino Unido", "Francia", "Arabia Saudita"] },
    sideTwo: { side: "Irak", members: ["Ejército iraquí"] },
    cause: "El VII Cuerpo avanzó hacia el este para penetrar las defensas iraquíes y destruir las fuerzas que protegían la ruta hacia la Guardia Republicana.",
    outcome: "Victoria de la coalición; la posición iraquí de Al Busayyah fue tomada y sus defensores quedaron destruidos o capturados.",
    consequences: "La captura del 26 de febrero abrió una ruta logística y de maniobra para continuar el avance blindado hacia el este.",
    chronologyEvent: "El 26 de febrero, la 1.ª División Blindada estadounidense asaltó y aseguró Al Busayyah."
  }),
  "Batalla de la cresta de Medina": actionFix({
    parent: "Guerra del Golfo",
    campaign: "Operación Tormenta del Desierto",
    region: "Cresta de Medina, sur de Irak",
    source: SOURCES.medinaRidge,
    startYear: 1991,
    scale: "regional",
    sideOne: { side: "Coalición internacional", members: ["Estados Unidos"] },
    sideTwo: { side: "Irak", members: ["División Medina de la Guardia Republicana", "Ejército iraquí"] },
    cause: "La 1.ª División Blindada estadounidense debía destruir a la División Medina para impedir su retirada y completar la ruptura del VII Cuerpo.",
    outcome: "Victoria estadounidense; la defensa blindada iraquí fue desorganizada y sufrió pérdidas severas.",
    consequences: "El combate del 27 de febrero aceleró el colapso de las principales formaciones de la Guardia Republicana en el sector.",
    chronologyEvent: "El 27 de febrero, fuerzas blindadas estadounidenses atacaron a la División Medina durante una tormenta de arena."
  }),
  "Batalla del aeródromo de Jalibah": actionFix({
    parent: "Guerra del Golfo",
    campaign: "Operación Tormenta del Desierto",
    region: "Aeródromo de Jalibah, sur de Irak",
    source: SOURCES.gulfWar,
    startYear: 1991,
    scale: "regional",
    sideOne: { side: "Coalición internacional", members: ["Estados Unidos"] },
    sideTwo: { side: "Irak", members: ["Ejército iraquí"] },
    cause: "La 24.ª División de Infantería Mecanizada avanzó para tomar un aeródromo clave y cortar rutas de retirada iraquíes hacia el Éufrates.",
    outcome: "Victoria estadounidense; el aeródromo fue asegurado y numerosas aeronaves, vehículos y posiciones iraquíes quedaron destruidos.",
    consequences: "La ocupación del 27 de febrero extendió el cerco operacional sobre las fuerzas iraquíes que se retiraban de Kuwait.",
    chronologyEvent: "El 27 de febrero, unidades mecanizadas estadounidenses atacaron y aseguraron el complejo aéreo de Jalibah."
  }),
  "Batalla del Aeropuerto Internacional de Bagdad": actionFix({
    parent: "Guerra de Irak",
    campaign: "Levantamiento del Ejército del Mahdi de 2004",
    region: "Aeropuerto Internacional de Bagdad, Bagdad, Irak",
    source: SOURCES.biap,
    startYear: 2004,
    conflictType: "insurgencia",
    scale: "local",
    sideOne: { side: "Coalición", members: ["Estados Unidos"] },
    sideTwo: { side: "Insurgencia chiita", members: ["Ejército del Mahdi"] },
    cause: "Milicianos del Ejército del Mahdi atacaron el área logística del aeropuerto para interrumpir los convoyes que abastecían a las fuerzas de la coalición en Bagdad.",
    outcome: "Victoria táctica estadounidense; transportistas, ingenieros, policías militares y blindados rechazaron el ataque.",
    consequences: "La defensa permitió continuar el movimiento de suministros hacia Bagdad durante el levantamiento de abril, pese a que las rutas siguieron bajo amenaza.",
    chronologyEvent: "El 11 de abril, unidades logísticas estadounidenses defendieron el sector de Engineer Village hasta la llegada de apoyo blindado."
  }),
  "Batalla de Husaybah": actionFix({
    parent: "Guerra de Irak",
    campaign: "Insurgencia iraquí en Al Anbar",
    region: "Husaybah, gobernación de Al Anbar, Irak",
    source: SOURCES.husaybah,
    startYear: 2004,
    conflictType: "insurgencia",
    scale: "local",
    sideOne: { side: "Coalición", members: ["Estados Unidos", "Fuerzas de seguridad iraquíes"] },
    sideTwo: { side: "Insurgencia iraquí", members: ["Insurgentes iraquíes"] },
    cause: "Insurgentes coordinaron ataques contra posiciones de los Marines y fuerzas iraquíes en la ciudad fronteriza.",
    outcome: "Victoria táctica estadounidense tras un día de combate, aunque la ciudad continuó disputada por la insurgencia.",
    consequences: "Los enfrentamientos mostraron la fragilidad del control fronterizo y anticiparon nuevas operaciones en el oeste de Al Anbar.",
    chronologyEvent: "El 17 de abril, Marines estadounidenses combatieron durante horas contra ataques coordinados dentro y alrededor de Husaybah."
  }),
  "Batalla de Ganjgal": actionFix({
    parent: "Guerra de Afganistán",
    campaign: "Operaciones en Kunar",
    region: "Ganjgal, provincia de Kunar, Afganistán",
    source: SOURCES.ganjgal,
    startYear: 2009,
    conflictType: "insurgencia",
    scale: "local",
    sideOne: { side: "Fuerzas afganas y asesores", members: ["Afganistán", "Estados Unidos"] },
    sideTwo: { side: "Insurgencia", members: ["Talibán", "Insurgentes afganos"] },
    cause: "Una fuerza afgana acompañada por asesores estadounidenses entró en Ganjgal para reunirse con dirigentes locales y fue emboscada desde posiciones preparadas.",
    outcome: "Victoria táctica insurgente; la columna sufrió pérdidas severas y debió ser extraída sin cumplir su objetivo.",
    consequences: "La demora del apoyo de fuego generó investigaciones y cambios de procedimiento, mientras las acciones de rescate fueron reconocidas con condecoraciones.",
    chronologyEvent: "El 8 de septiembre, la fuerza combinada quedó cercada en Ganjgal y logró retirarse después de varias horas de combate."
  }),
  "Batalla del valle de Shok": actionFix({
    parent: "Guerra de Afganistán",
    campaign: "Operación Commando Wrath",
    region: "Valle de Shok, provincia de Nuristán, Afganistán",
    source: SOURCES.shokValley,
    startYear: 2008,
    conflictType: "insurgencia",
    scale: "local",
    sideOne: { side: "Fuerzas afganas y estadounidenses", members: ["Comandos afganos", "Fuerzas Especiales de Estados Unidos"] },
    sideTwo: { side: "Insurgencia", members: ["Hezb-e Islami Gulbuddin"] },
    cause: "La fuerza combinada intentó capturar o neutralizar a dirigentes insurgentes asentados en una posición remota y fortificada.",
    outcome: "Éxito táctico parcial de la coalición; la fuerza se abrió paso y fue extraída, pero no capturó a su objetivo principal.",
    consequences: "El combate del 6 de abril causó numerosos heridos estadounidenses y recibió amplio reconocimiento por las acciones de evacuación y apoyo mutuo.",
    chronologyEvent: "El 6 de abril, comandos afganos y una unidad de Fuerzas Especiales combatieron durante horas en las laderas del valle de Shok."
  }),
  "Batalla de Do Ab": actionFix({
    parent: "Guerra de Afganistán",
    campaign: "Operaciones en Nuristán",
    region: "Do Ab, provincia de Nuristán, Afganistán",
    source: SOURCES.doAb,
    startYear: 2011,
    conflictType: "insurgencia",
    scale: "local",
    sideOne: { side: "Fuerzas gubernamentales", members: ["Afganistán", "Apoyo aéreo de Estados Unidos"] },
    sideTwo: { side: "Insurgencia", members: ["Talibán"] },
    cause: "Fuerzas afganas desplegadas en Do Ab fueron emboscadas por una concentración insurgente en terreno montañoso.",
    outcome: "Victoria de las fuerzas gubernamentales; el apoyo aéreo permitió romper la emboscada y dispersar a los atacantes.",
    consequences: "La acción del 25 de mayo preservó a la fuerza afgana y mostró su dependencia del apoyo aéreo aliado en áreas remotas.",
    chronologyEvent: "El 25 de mayo, fuerzas afganas resistieron la emboscada en Do Ab hasta que aeronaves estadounidenses atacaron las posiciones insurgentes."
  })
};
