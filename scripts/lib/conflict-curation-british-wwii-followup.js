function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  france1940: source(
    "National Army Museum: derrota aliada en Francia y contraataque de Arras, 1940",
    "https://www.nam.ac.uk/explore/defeat-west"
  ),
  greeceAir: source(
    "Royal Air Force: campaña aérea de Grecia y batalla aérea de Atenas",
    "https://www.raf.mod.uk/what-we-do/centre-for-air-and-space-power-studies/aspr/apr-vol15-iss1-3-pdf/"
  ),
  greeceCampaign: source(
    "Ministerio de Cultura y Patrimonio de Nueva Zelanda: campaña aliada de Grecia de 1941",
    "https://nzhistory.govt.nz/hands/from-memory/notes-and-questions-greece/crete"
  ),
  tempe: source(
    "Australian War Memorial: acción del desfiladero de Tempe, 18 de abril de 1941",
    "https://www.awm.gov.au/collection/E84634"
  ),
  crete: source(
    "Australian War Memorial: campaña de Creta, 20-29 de mayo de 1941",
    "https://www.awm.gov.au/collection/E84659"
  ),
  malaya: source(
    "Australian War Memorial: entrada japonesa en Kuala Lumpur, 11 de enero de 1942",
    "https://www.awm.gov.au/collection/C218424"
  ),
  battleBritain: source(
    "Imperial War Museums: fechas decisivas de la Batalla de Inglaterra",
    "https://www.iwm.org.uk/history/9-important-dates-in-the-battle-of-britain"
  ),
  forth: source(
    "Royal Air Force Museum: ataque aéreo sobre el estuario de Forth, 16 de octubre de 1939",
    "https://www.rafmuseum.org.uk/research/research-enquiries/history-of-aviation-timeline/british-military-aviation/1939-2/"
  ),
  graveney: source(
    "Kent Historic Environment Record: combate de Graveney Marsh, 27 de septiembre de 1940",
    "https://heritage.kent.gov.uk/Monument/MKE98200"
  ),
  normandy: source(
    "Gobierno del Reino Unido: Día D y campaña de Normandía",
    "https://assets.publishing.service.gov.uk/media/5a78d775ed915d07d35b2d91/ww2_dday.pdf"
  ),
  villersBocage: source(
    "National Army Museum: batalla de Villers-Bocage y Operación Perch",
    "https://www.nam.ac.uk/whats-on/battle-villers-bocage"
  ),
  barents: source(
    "Imperial War Museums: batalla del mar de Barents, 31 de diciembre de 1942",
    "https://www.iwm.org.uk/collections/item/object/205147210"
  ),
  northCape: source(
    "Imperial War Museums: HMS Belfast y la batalla del cabo Norte",
    "https://www.iwm.org.uk/history/hms-belfast-and-the-battle-of-north-cape"
  ),
  bismarck: source(
    "Imperial War Museums: persecución del Bismarck y batalla del estrecho de Dinamarca",
    "https://www.iwm.org.uk/history/second-world-war/how-the-royal-navy-hunted-down-the-bismarck"
  ),
  warAtSea1: source(
    "Royal Navy: historia oficial The War at Sea 1939-1945, volumen I",
    "https://cd.royalnavy.mod.uk/-/media/rnweb/locations-and-operations/navy-historical-branch/pdfs/war-at-sea/vol1-the-war-at-sea--sw-roskill.pdf"
  ),
  warAtSea2: source(
    "Royal Navy: historia oficial The War at Sea 1939-1945, volumen II",
    "https://cd.royalnavy.mod.uk/-/media/rnweb/locations-and-operations/navy-historical-branch/pdfs/war-at-sea/vol-2-the-war-at-sea--sw-roskill.pdf"
  ),
  warAtSea3a: source(
    "Royal Navy: historia oficial The War at Sea 1939-1945, volumen III, parte I",
    "https://cd.royalnavy.mod.uk/-/media/rnweb/locations-and-operations/navy-historical-branch/pdfs/war-at-sea/vol-3-part-one-the-war-at-sea--sw-roskill--original.pdf"
  ),
  warAtSea3b: source(
    "Royal Navy: historia oficial The War at Sea 1939-1945, volumen III, parte II",
    "https://cd.royalnavy.mod.uk/-/media/rnweb/locations-and-operations/navy-historical-branch/pdfs/war-at-sea/vol-3-part-two-the-war-at-sea--sw-roskill.pdf"
  )
};

const WORLD_WAR_II = "Segunda Guerra Mundial";

function battleFix({
  campaign,
  region,
  source: hierarchySource,
  startYear,
  type = "batalla",
  scale = "internacional",
  allies = ["Reino Unido"],
  axis = ["Alemania"],
  cause,
  outcome,
  consequences,
  chronologyEvent,
  related = []
}) {
  return {
    parent: WORLD_WAR_II,
    war: WORLD_WAR_II,
    campaign,
    type,
    conflictType: "interestatal",
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
    chronology: [{ year: startYear, event: chronologyEvent || `Acción principal dentro de ${campaign}.` }],
    treaties: [],
    related: [...new Set([WORLD_WAR_II, campaign, ...related].filter(Boolean))],
    participants: [
      { side: "Aliados", members: allies },
      { side: "Eje", members: axis }
    ],
    hierarchyConfidence: hierarchySource.confidence,
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-british-wwii-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

export const BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Athens": "Batalla aérea de Atenas",
  "Batalla de Barents Sea": "Batalla del mar de Barents",
  "Batalla de Bay de Biscay": "Batalla del golfo de Vizcaya",
  "Batalla de Britain Day": "Día de la Batalla de Inglaterra",
  "Batalla de Cabo Norte": "Batalla del cabo Norte",
  "Batalla de Cabo Teulada": "Batalla del cabo Teulada",
  "Batalla de Cigno Convoy": "Batalla del convoy Cigno",
  "Batalla de Douvres Radar Station": "Batalla de la estación de radar de Douvres",
  "Batalla de Duisburg Convoy": "Batalla del convoy Duisburg",
  "Batalla de Graveney Marsh": "Combate de Graveney Marsh",
  "Batalla de Heraklion": "Batalla de Heraclión",
  "Batalla de Ligurian Sea": "Batalla del mar de Liguria",
  "Batalla de Merville Gun Battery": "Batalla de la batería de Merville",
  "Batalla de River Forth": "Batalla del estuario de Forth",
  "Batalla de Skerki Bank": "Batalla del banco de Skerki",
  "Batalla de Tarigo Convoy": "Batalla del convoy Tarigo",
  "Batalla de Tempi": "Batalla del desfiladero de Tempe",
  "Batalla del Estrecho de Dinamarca": "Batalla del estrecho de Dinamarca"
};

export const BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Abbeville": battleFix({
    campaign: "Batalla de Francia",
    region: "Abbeville, Somme, Francia",
    source: SOURCES.france1940,
    startYear: 1940,
    scale: "regional",
    allies: ["Francia", "Reino Unido"],
    cause: "Las fuerzas aliadas intentaron eliminar la cabeza de puente alemana al sur del Somme y recomponer el frente tras la ruptura hacia el canal de la Mancha.",
    outcome: "Victoria defensiva alemana; los ataques franco-británicos redujeron la cabeza de puente, pero no expulsaron a las fuerzas alemanas de Abbeville.",
    consequences: "La posición alemana sobre el Somme se mantuvo y facilitó la continuación de la ofensiva contra el resto de Francia.",
    chronologyEvent: "Entre el 27 de mayo y el 4 de junio, sucesivos ataques aliados no lograron cerrar la cabeza de puente de Abbeville."
  }),
  "Batalla de Arras": battleFix({
    campaign: "Batalla de Francia",
    region: "Arras, Pas-de-Calais, Francia",
    source: SOURCES.france1940,
    startYear: 1940,
    scale: "regional",
    allies: ["Reino Unido", "Francia"],
    cause: "El contraataque aliado buscó aliviar la presión sobre Arras y cortar el avance blindado alemán hacia los puertos del canal.",
    outcome: "Victoria operacional alemana tras un éxito aliado inicial; las fuerzas franco-británicas se retiraron sin romper el corredor alemán.",
    consequences: "El ataque del 21 de mayo demoró temporalmente a unidades alemanas, pero no evitó el cerco y la evacuación aliada por Dunkerque.",
    chronologyEvent: "El 21 de mayo, Frankforce contraatacó al sur de Arras y luego se replegó ante la respuesta alemana."
  }),
  "Batalla aérea de Atenas": battleFix({
    campaign: "Campaña de Grecia",
    region: "Atenas y El Pireo, Grecia",
    source: SOURCES.greeceAir,
    startYear: 1941,
    type: "batalla aérea",
    scale: "local",
    cause: "La Luftwaffe intentó destruir los últimos cazas operativos de la RAF que cubrían la retirada aliada de Grecia.",
    outcome: "Victoria aérea alemana; la RAF causó pérdidas, pero agotó su reducida fuerza de cazas y perdió a varios pilotos veteranos.",
    consequences: "El combate del 20 de abril debilitó la última defensa aérea aliada sobre Atenas antes de la evacuación.",
    chronologyEvent: "El 20 de abril, unos quince Hurricane británicos enfrentaron una fuerza alemana muy superior sobre Atenas y El Pireo."
  }),
  "Batalla del mar de Barents": battleFix({
    campaign: "Convoyes árticos",
    region: "Mar de Barents, al norte de Noruega",
    source: SOURCES.barents,
    startYear: 1942,
    type: "batalla naval",
    allies: ["Reino Unido"],
    cause: "Una fuerza alemana intentó destruir el convoy ártico JW 51B que transportaba suministros a la Unión Soviética.",
    outcome: "Victoria estratégica británica; la escolta rechazó a una fuerza alemana superior y todos los mercantes del convoy llegaron a destino.",
    consequences: "El fracaso alemán provocó una crisis en el mando naval del Reich y reforzó la continuidad de los convoyes árticos.",
    chronologyEvent: "El 31 de diciembre, los escoltas británicos protegieron al convoy JW 51B frente a cruceros y destructores alemanes."
  }),
  "Batalla del golfo de Vizcaya": battleFix({
    campaign: "Batalla del Atlántico",
    region: "Golfo de Vizcaya, océano Atlántico",
    source: SOURCES.warAtSea3a,
    startYear: 1943,
    type: "batalla naval",
    cause: "Cruceros británicos interceptaron una fuerza alemana enviada a recibir y escoltar un buque que intentaba romper el bloqueo aliado.",
    outcome: "Victoria británica; fueron hundidos un destructor y dos torpederos alemanes.",
    consequences: "La acción del 28 de diciembre frustró otra fase del tráfico alemán de corredores de bloqueo con Asia.",
    chronologyEvent: "El 28 de diciembre, HMS Glasgow y HMS Enterprise derrotaron a la fuerza alemana de escolta en el golfo de Vizcaya."
  }),
  "Batalla de Bréville": battleFix({
    campaign: "Campaña de Normandía",
    region: "Bréville-les-Monts, Normandía, Francia",
    source: SOURCES.normandy,
    startYear: 1944,
    scale: "regional",
    cause: "La posición alemana en Bréville dominaba el puente aéreo aliado al este del Orne y amenazaba el flanco de las playas de desembarco.",
    outcome: "Victoria británica; la 6.ª División Aerotransportada tomó la localidad tras varios días de combates.",
    consequences: "La captura aseguró el flanco oriental de la cabeza de puente y redujo la amenaza inmediata sobre las posiciones aerotransportadas.",
    chronologyEvent: "Entre el 7 y el 13 de junio, fuerzas británicas y alemanas disputaron Bréville-les-Monts."
  }),
  "Día de la Batalla de Inglaterra": battleFix({
    campaign: "Batalla de Inglaterra",
    region: "Sur de Inglaterra y Londres, Reino Unido",
    source: SOURCES.battleBritain,
    startYear: 1940,
    type: "batalla aérea",
    scale: "regional",
    cause: "La Luftwaffe lanzó dos grandes oleadas para quebrar al Mando de Caza y sostener su campaña contra Londres.",
    outcome: "Victoria defensiva británica; las formaciones alemanas fueron dispersadas sin obtener la superioridad aérea buscada.",
    consequences: "El 15 de septiembre confirmó el fracaso de la estrategia alemana y quedó conmemorado como el Día de la Batalla de Inglaterra.",
    chronologyEvent: "El 15 de septiembre, hasta diecisiete escuadrones británicos interceptaron las principales oleadas alemanas."
  }),
  "Batalla del cabo Norte": battleFix({
    campaign: "Convoyes árticos",
    region: "Cabo Norte, mar de Noruega",
    source: SOURCES.northCape,
    startYear: 1943,
    type: "batalla naval",
    allies: ["Reino Unido", "Noruega"],
    cause: "El acorazado alemán Scharnhorst salió a interceptar convoyes árticos aliados con destino a la Unión Soviética.",
    outcome: "Victoria aliada decisiva; el Scharnhorst fue localizado, cercado y hundido.",
    consequences: "Alemania perdió su último gran buque de superficie operativo en Noruega capaz de amenazar directamente a los convoyes árticos.",
    chronologyEvent: "El 26 de diciembre, fuerzas británicas y noruegas hundieron al Scharnhorst frente al cabo Norte."
  }),
  "Batalla del cabo Teulada": battleFix({
    campaign: "Batalla del Mediterráneo",
    region: "Cabo Teulada, Cerdeña, mar Mediterráneo",
    source: SOURCES.warAtSea1,
    startYear: 1940,
    type: "batalla naval",
    axis: ["Italia"],
    cause: "La flota italiana intentó interceptar la Operación Collar, un convoy británico de refuerzo hacia Malta y Alejandría.",
    outcome: "Resultado táctico inconcluso; ambas flotas se retiraron y el convoy británico continuó su ruta.",
    consequences: "La acción mostró que ninguna marina había obtenido aún un dominio decisivo del Mediterráneo central.",
    chronologyEvent: "El 27 de noviembre, las flotas británica e italiana intercambiaron fuego al sur de Cerdeña."
  }),
  "Batalla de Calabria": battleFix({
    campaign: "Batalla del Mediterráneo",
    region: "Punta Stilo, Calabria, mar Jónico",
    source: SOURCES.warAtSea1,
    startYear: 1940,
    type: "batalla naval",
    allies: ["Reino Unido", "Australia"],
    axis: ["Italia"],
    cause: "Las flotas británica e italiana se encontraron mientras protegían convoyes simultáneos entre Italia, Libia, Malta y Alejandría.",
    outcome: "Resultado inconcluso; ambos bandos completaron sus principales movimientos de convoyes.",
    consequences: "La batalla del 9 de julio inauguró una serie prolongada de enfrentamientos por el control del Mediterráneo.",
    chronologyEvent: "El 9 de julio, las fuerzas de Cunningham y Campioni combatieron frente a Punta Stilo."
  }),
  "Batalla del convoy Cigno": battleFix({
    campaign: "Batalla del Mediterráneo",
    region: "Marettimo, Sicilia, mar Mediterráneo",
    source: SOURCES.warAtSea2,
    startYear: 1943,
    type: "batalla naval",
    axis: ["Italia"],
    cause: "Dos destructores británicos atacaron la escolta italiana del mercante Belluno, que transportaba suministros hacia Túnez.",
    outcome: "Victoria italiana costosa; el convoy escapó, mientras el torpedero Cigno y el destructor británico HMS Pakenham se perdieron.",
    consequences: "La escolta aseguró la llegada del transporte, aunque ambos bandos sufrieron pérdidas navales importantes.",
    chronologyEvent: "El 16 de abril, destructores británicos y torpederos italianos combatieron al oeste de Sicilia."
  }),
  "Batalla de la estación de radar de Douvres": battleFix({
    campaign: "Campaña de Normandía",
    region: "Douvres-la-Délivrande, Normandía, Francia",
    source: SOURCES.normandy,
    startYear: 1944,
    scale: "local",
    allies: ["Reino Unido", "Canadá"],
    cause: "La posición fortificada alemana había quedado aislada detrás del sector de Juno y seguía resistiendo después del desembarco.",
    outcome: "Victoria aliada; el 41.º Comando de Royal Marines, con apoyo blindado especializado, capturó la estación.",
    consequences: "La caída del complejo eliminó una posición alemana en la retaguardia inmediata de las playas Juno y Sword.",
    chronologyEvent: "El 17 de junio, el asalto británico abrió las defensas y recibió la rendición de la guarnición alemana."
  }),
  "Batalla del convoy Duisburg": battleFix({
    campaign: "Batalla del Mediterráneo",
    region: "Mar Jónico, frente a Calabria, Italia",
    source: SOURCES.warAtSea1,
    startYear: 1941,
    type: "batalla naval",
    axis: ["Italia"],
    cause: "La Fuerza K salió de Malta para interceptar un convoy del Eje que llevaba combustible y suministros a Libia.",
    outcome: "Victoria británica decisiva; los siete mercantes y el destructor Fulmine fueron hundidos.",
    consequences: "La destrucción del convoy agravó la crisis logística de las fuerzas del Eje en Cirenaica.",
    chronologyEvent: "Durante la noche del 8 al 9 de noviembre, la Fuerza K destruyó el convoy BETA o Duisburg."
  }),
  "Combate de Graveney Marsh": battleFix({
    campaign: "Batalla de Inglaterra",
    region: "Graveney Marsh, Kent, Reino Unido",
    source: SOURCES.graveney,
    startYear: 1940,
    type: "combate terrestre",
    scale: "local",
    cause: "La tripulación de un bombardero alemán derribado intentó defender la aeronave y destruir su equipo antes de ser capturada.",
    outcome: "Victoria británica; los soldados del London Irish Rifles capturaron a los cuatro aviadores alemanes.",
    consequences: "El equipo del bombardero quedó en manos británicas y el episodio fue el último combate terrestre contra una fuerza invasora en Gran Bretaña durante la guerra.",
    chronologyEvent: "El 27 de septiembre, soldados británicos intercambiaron fuego con la tripulación de un Ju 88 en Graveney Marsh."
  }),
  "Batalla de Heraclión": battleFix({
    campaign: "Batalla de Creta",
    region: "Heraclión, Creta, Grecia",
    source: SOURCES.crete,
    startYear: 1941,
    scale: "regional",
    allies: ["Reino Unido", "Australia", "Grecia"],
    cause: "Paracaidistas alemanes intentaron capturar el puerto y el aeródromo de Heraclión durante la Operación Mercurio.",
    outcome: "Éxito defensivo aliado local seguido de retirada; el aeródromo permaneció negado hasta que la situación general obligó a evacuar la guarnición.",
    consequences: "La evacuación del 28 al 29 de mayo entregó Heraclión a Alemania pese a las fuertes pérdidas sufridas por los atacantes.",
    chronologyEvent: "Entre el 20 y el 29 de mayo, la guarnición aliada rechazó los asaltos directos y luego fue evacuada por mar."
  }),
  "Batalla de Kuala Lumpur": battleFix({
    campaign: "Campaña de Malaya",
    region: "Kuala Lumpur, Malaya británica",
    source: SOURCES.malaya,
    startYear: 1942,
    scale: "regional",
    allies: ["Reino Unido", "India británica", "Australia", "Malaya británica"],
    axis: ["Japón"],
    cause: "El 25.º Ejército japonés avanzó por la península malaya mientras las fuerzas aliadas se retiraban hacia Singapur.",
    outcome: "Victoria japonesa y ocupación de Kuala Lumpur el 11 de enero.",
    consequences: "La pérdida de la capital federal aceleró la retirada aliada hacia Johor y Singapur.",
    chronologyEvent: "El 11 de enero, las tropas japonesas entraron en Kuala Lumpur tras la retirada de sus defensores."
  }),
  "Batalla del mar de Liguria": battleFix({
    campaign: "Campaña naval del Mediterráneo occidental",
    region: "Golfo de Génova, mar de Liguria",
    source: SOURCES.warAtSea3b,
    startYear: 1945,
    type: "batalla naval",
    cause: "Dos destructores británicos interceptaron una flotilla alemana que realizaba una operación ofensiva de minado.",
    outcome: "Victoria británica; dos torpederos alemanes fueron hundidos y el destructor restante quedó dañado.",
    consequences: "La acción del 18 de marzo fue el último combate importante de superficie de la guerra en el Mediterráneo.",
    chronologyEvent: "El 18 de marzo, HMS Lookout y HMS Meteor atacaron a la flotilla alemana en el golfo de Génova."
  }),
  "Batalla de la batería de Merville": battleFix({
    campaign: "Campaña de Normandía",
    region: "Merville-Franceville, Normandía, Francia",
    source: SOURCES.normandy,
    startYear: 1944,
    scale: "local",
    cause: "La batería alemana podía amenazar el flanco oriental de Sword Beach y debía ser neutralizada antes del desembarco.",
    outcome: "Éxito táctico británico; una fuerza aerotransportada muy reducida ocupó la posición y dejó sus piezas temporalmente fuera de servicio.",
    consequences: "El asalto redujo la amenaza inmediata sobre Sword Beach, aunque parte de la batería volvió a operar después.",
    chronologyEvent: "En la madrugada del 6 de junio, el 9.º Batallón de Paracaidistas asaltó la batería de Merville."
  }),
  "Batalla de Ptolemaida": battleFix({
    campaign: "Campaña de Grecia",
    region: "Ptolemaida, Macedonia Occidental, Grecia",
    source: SOURCES.greeceCampaign,
    startYear: 1941,
    scale: "local",
    cause: "La 1.ª Brigada Blindada británica ejecutó acciones retardantes para cubrir la retirada aliada frente al avance de la 9.ª División Panzer.",
    outcome: "Victoria alemana; las fuerzas británicas sufrieron pérdidas de blindados y continuaron la retirada.",
    consequences: "Los combates del 13 de abril demoraron el avance, pero no impidieron la ruptura alemana hacia el sur de Grecia.",
    chronologyEvent: "El 13 de abril, dos enfrentamientos blindados se desarrollaron al norte y al sur de Ptolemaida."
  }),
  "Batalla del estuario de Forth": battleFix({
    campaign: "Campaña aérea sobre Gran Bretaña",
    region: "Estuario de Forth y Rosyth, Escocia, Reino Unido",
    source: SOURCES.forth,
    startYear: 1939,
    type: "batalla aérea",
    scale: "local",
    cause: "Bombarderos alemanes atacaron buques de guerra británicos fondeados cerca de la base naval de Rosyth.",
    outcome: "Victoria defensiva británica; tres bombarderos fueron derribados y los objetivos navales principales sobrevivieron.",
    consequences: "Fue el primer ataque aéreo alemán contra territorio británico y produjo los primeros derribos de aeronaves enemigas sobre el país durante la guerra.",
    chronologyEvent: "El 16 de octubre, los escuadrones 602 y 603 de la RAF interceptaron a los bombarderos sobre el Forth."
  }),
  "Batalla del banco de Skerki": battleFix({
    campaign: "Batalla del Mediterráneo",
    region: "Banco de Skerki, canal de Sicilia",
    source: SOURCES.warAtSea2,
    startYear: 1942,
    type: "batalla naval",
    allies: ["Reino Unido", "Australia"],
    axis: ["Italia", "Alemania"],
    cause: "La Fuerza Q aliada interceptó un convoy italo-alemán que transportaba refuerzos y suministros hacia Túnez.",
    outcome: "Victoria aliada decisiva; el convoy y uno de sus escoltas fueron destruidos sin pérdidas navales aliadas.",
    consequences: "La derrota redujo el flujo de suministros del Eje durante la campaña de Túnez.",
    chronologyEvent: "En la madrugada del 2 de diciembre, la Fuerza Q destruyó el convoy H cerca del banco de Skerki."
  }),
  "Batalla del convoy Tarigo": battleFix({
    campaign: "Batalla del Mediterráneo",
    region: "Islas Kerkennah, frente a Túnez",
    source: SOURCES.warAtSea1,
    startYear: 1941,
    type: "batalla naval",
    axis: ["Italia"],
    cause: "Destructores británicos salieron de Malta para interceptar un convoy del Eje que abastecía a las fuerzas de Libia.",
    outcome: "Victoria británica; todos los mercantes y dos escoltas italianos fueron hundidos, a cambio de la pérdida del HMS Mohawk.",
    consequences: "La destrucción del convoy terminó con una etapa de tránsito relativamente poco disputado entre Italia y Libia.",
    chronologyEvent: "El 16 de abril, la 14.ª Flotilla de Destructores sorprendió al convoy frente a las islas Kerkennah."
  }),
  "Batalla del desfiladero de Tempe": battleFix({
    campaign: "Campaña de Grecia",
    region: "Desfiladero de Tempe, Tesalia, Grecia",
    source: SOURCES.tempe,
    startYear: 1941,
    scale: "local",
    allies: ["Australia", "Nueva Zelanda", "Reino Unido"],
    cause: "Una fuerza de retaguardia aliada defendió el paso para ganar tiempo mientras el resto del contingente se retiraba hacia el sur.",
    outcome: "Victoria alemana tras una resistencia retardante aliada durante el 18 de abril.",
    consequences: "La defensa demoró la persecución y facilitó la retirada de otras unidades aliadas hacia las rutas de evacuación.",
    chronologyEvent: "El 18 de abril, la retaguardia ANZAC combatió contra fuerzas blindadas alemanas en el desfiladero."
  }),
  "Batalla de Villers-Bocage": battleFix({
    campaign: "Campaña de Normandía",
    region: "Villers-Bocage, Normandía, Francia",
    source: SOURCES.villersBocage,
    startYear: 1944,
    scale: "regional",
    cause: "La 7.ª División Blindada británica intentó desbordar Caen por el oeste durante la Operación Perch.",
    outcome: "Victoria táctica alemana; la columna británica fue emboscada y terminó retirándose de la localidad.",
    consequences: "El fracaso cerró la oportunidad inmediata de envolver Caen y prolongó los combates por la ciudad.",
    chronologyEvent: "Entre el 13 y el 14 de junio, blindados británicos y alemanes combatieron dentro y alrededor de Villers-Bocage."
  }),
  "Batalla del estrecho de Dinamarca": battleFix({
    campaign: "Batalla del Atlántico",
    region: "Estrecho de Dinamarca, entre Groenlandia e Islandia",
    source: SOURCES.bismarck,
    startYear: 1941,
    type: "batalla naval",
    cause: "La Royal Navy intentó interceptar al Bismarck y al Prinz Eugen antes de que alcanzaran las rutas de navegación del Atlántico.",
    outcome: "Victoria táctica alemana; el HMS Hood fue hundido y el HMS Prince of Wales se retiró dañado.",
    consequences: "La pérdida del Hood desencadenó una persecución naval masiva que culminó con el hundimiento del Bismarck tres días después.",
    chronologyEvent: "El 24 de mayo, las fuerzas británicas interceptaron a los buques alemanes en el estrecho de Dinamarca."
  }),
  "Segunda batalla de Sirte": battleFix({
    campaign: "Batalla del Mediterráneo",
    region: "Golfo de Sirte, mar Mediterráneo",
    source: SOURCES.warAtSea2,
    startYear: 1942,
    type: "batalla naval",
    axis: ["Italia"],
    cause: "Una fuerza italiana superior intentó destruir la escolta de un convoy británico que llevaba suministros a Malta.",
    outcome: "Éxito táctico defensivo británico; la escolta mantuvo alejada a la flota italiana, aunque el convoy sufrió después graves pérdidas aéreas.",
    consequences: "La acción protegió temporalmente a los mercantes, pero no resolvió la crítica situación logística de Malta.",
    chronologyEvent: "El 22 de marzo, cruceros y destructores británicos emplearon humo y maniobras para contener a la flota italiana."
  })
};
