function source(label, url) {
  return { label, url, confidence: "alta" };
}

const SOURCES = {
  bairoko: source(
    "Cuerpo de Marines de EE. UU.: operaciones en Bairoko durante la campaña de Nueva Georgia",
    "https://www.marines.mil/Portals/1/Publications/Up%20the%20Slot_Marines%20in%20the%20Central%20Solomons%20%20PCN%2019000312100_2.pdf"
  ),
  aleutians: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de las Aleutianas",
    "https://history.army.mil/portals/143/Images/Publications/catalog/72-6.pdf"
  ),
  centralSolomons: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: campaña de las Salomón centrales",
    "https://www.history.navy.mil/content/history/nhhc/about-us/leadership/director/directors-corner/h-grams/h-gram-020/h-020-2-central-solomons-campaign.html"
  ),
  makassar: source(
    "Museo Nacional de la Marina de EE. UU.: batalla del estrecho de Makassar",
    "https://www.history.navy.mil/content/history/museums/nmusn/explore/photography/wwii/wwii-pacific/us-entry-into-wwii-japanese-offensive/1942-January-15-abda-japanese-octopus/1942-february-4-battle-makassar-strait.html"
  ),
  leyte: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: batalla del golfo de Leyte",
    "https://www.history.navy.mil/about-us/leadership/director/directors-corner/h-grams/h-gram-038/h-038-2.html"
  ),
  vellaLavella: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: batalla de Vella Lavella",
    "https://www.history.navy.mil/content/history/nhhc/about-us/leadership/director/directors-corner/h-grams/h-gram-022/h-022-5.html"
  ),
  tassafaronga: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: batalla de Tassafaronga",
    "https://www.history.navy.mil/browse-by-topic/wars-conflicts-and-operations/world-war-ii/1942/guadalcanal/battle-of-tassafaronga.html"
  ),
  tenaru: source(
    "Comando de Historia y Patrimonio Naval de EE. UU.: campaña de Guadalcanal y batalla de Tenaru",
    "https://www.history.navy.mil/research/library/online-reading-room/title-list-alphabetically/g/guadalcanal-campaign.html"
  ),
  talasea: source(
    "Cuerpo de Marines de EE. UU.: operación Volupai-Talasea",
    "https://www.marines.mil/Portals/1/Publications/A%20Brief%20History%20of%20the%2011th%20Marines%20%20PCN%2019000318600.pdf"
  ),
  stephenHopkins: source(
    "Administración Marítima de EE. UU.: SS Stephen Hopkins",
    "https://www.maritime.dot.gov/history/gallant-ship-award/ss-stephen-hopkins"
  ),
  saintLo: source(
    "Centro de Historia Militar del Ejército de EE. UU.: operaciones de Saint-Lô",
    "https://history.army.mil/Publications/Publications-Catalog/St-Lo/"
  ),
  saintVith: source(
    "Escuela de Blindados del Ejército de EE. UU.: cronología de Saint-Vith",
    "https://www.benning.army.mil/armor/earmor/content/issues/2014/oct_dec/Timeline.html"
  ),
  crucifixHill: source(
    "Centro de Historia Militar del Ejército de EE. UU.: campaña de Renania y colina Crucifix",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/C%20Img/campaigns-wwii/pdf/32.pdf"
  )
};

const WORLD_WAR_II = "Segunda Guerra Mundial";

function battleFix({
  campaign,
  region,
  source: hierarchySource,
  startYear,
  type = "batalla",
  allies = ["Estados Unidos"],
  axis = ["Japón"],
  cause,
  outcome,
  consequences,
  related = []
}) {
  return {
    parent: WORLD_WAR_II,
    war: WORLD_WAR_II,
    campaign,
    type,
    conflictType: "interestatal",
    scale: "internacional",
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
    chronology: [{ year: startYear, event: `Acción principal dentro de ${campaign}.` }],
    treaties: [],
    related: [...new Set([WORLD_WAR_II, campaign, ...related].filter(Boolean))],
    participants: [
      { side: "Aliados", members: allies },
      { side: "Eje", members: axis }
    ],
    hierarchyConfidence: hierarchySource.confidence,
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-us-wwii-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

export const US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de las Islas Komandorski": "Batalla de las islas Komandorski",
  "Batalla de Crucifix Hill": "Batalla de la colina Crucifix",
  "Batalla de SS Stephen Hopkins": "Combate naval del SS Stephen Hopkins",
  "Batalla de St. Vith": "Batalla de Saint-Vith",
  "Batalla del Estrecho de Blackett": "Batalla del estrecho de Blackett",
  "Batalla del Estrecho de Makassar": "Batalla del estrecho de Makassar",
  "Batalla del Golfo de Kula": "Batalla del golfo de Kula",
  "Batalla del Mar de Sibuyan": "Batalla del mar de Sibuyán"
};

export const US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Bairoko": battleFix({
    campaign: "Campaña de Nueva Georgia",
    region: "Bairoko, Nueva Georgia, Islas Salomón",
    source: SOURCES.bairoko,
    startYear: 1943,
    cause: "La fuerza estadounidense intentó tomar el puerto de Bairoko y cortar el abastecimiento japonés hacia Munda.",
    outcome: "Victoria defensiva japonesa en el asalto del 20 de julio; la fuerza atacante se replegó hacia Enogai.",
    consequences: "La presión sobre Bairoko continuó y el puerto quedó en manos estadounidenses el 25 de agosto de 1943."
  }),
  "Batalla de Dutch Harbor": battleFix({
    campaign: "Campaña de las Aleutianas",
    region: "Dutch Harbor, Alaska, Estados Unidos",
    source: SOURCES.aleutians,
    startYear: 1942,
    type: "batalla aeronaval",
    cause: "Japón atacó la base de Dutch Harbor mientras iniciaba sus operaciones sobre Attu y Kiska.",
    outcome: "Los ataques causaron daños, pero no neutralizaron la base estadounidense.",
    consequences: "La acción abrió la campaña de las Aleutianas y precedió la ocupación japonesa de Attu y Kiska."
  }),
  "Batalla de las islas Komandorski": battleFix({
    campaign: "Campaña de las Aleutianas",
    region: "Islas Komandorski, mar de Bering",
    source: SOURCES.aleutians,
    startYear: 1943,
    type: "batalla naval",
    cause: "Una fuerza estadounidense interceptó un convoy japonés que intentaba abastecer las Aleutianas ocupadas.",
    outcome: "Resultado táctico indeciso con efecto estratégico favorable a Estados Unidos.",
    consequences: "Japón dejó de abastecer Attu por buques de superficie y pasó a emplear submarinos."
  }),
  "Batalla del estrecho de Blackett": battleFix({
    campaign: "Campaña de Nueva Georgia",
    region: "Golfo de Kula y estrecho de Blackett, Islas Salomón",
    source: SOURCES.centralSolomons,
    startYear: 1943,
    type: "batalla naval",
    cause: "Una fuerza estadounidense que se dirigía a bombardear Vila detectó dos destructores japoneses cerca del estrecho de Blackett.",
    outcome: "Victoria naval estadounidense y hundimiento de los dos destructores japoneses.",
    consequences: "La acción debilitó los movimientos japoneses de abastecimiento en las Salomón centrales."
  }),
  "Batalla del estrecho de Makassar": battleFix({
    campaign: "Campaña de las Indias Orientales Neerlandesas",
    region: "Mar de Flores, Indias Orientales Neerlandesas",
    source: SOURCES.makassar,
    startYear: 1942,
    type: "batalla aeronaval",
    allies: ["Países Bajos", "Estados Unidos", "Reino Unido", "Australia"],
    cause: "La fuerza naval ABDA intentó interceptar el avance japonés hacia Makassar y Banjarmasin.",
    outcome: "Victoria japonesa; los ataques aéreos obligaron a retirarse a la fuerza ABDA.",
    consequences: "Japón pudo continuar la ocupación del estrecho de Makassar y ampliar su avance por las Indias Orientales."
  }),
  "Batalla del estrecho de Surigao": battleFix({
    campaign: "Campaña de Leyte",
    region: "Estrecho de Surigao, Filipinas",
    source: SOURCES.leyte,
    startYear: 1944,
    type: "batalla naval",
    allies: ["Estados Unidos", "Australia"],
    cause: "La fuerza japonesa del sur intentó entrar al golfo de Leyte por el estrecho de Surigao.",
    outcome: "Victoria aliada decisiva y destrucción de la mayor parte de la fuerza japonesa del sur.",
    consequences: "La derrota cerró la aproximación meridional a Leyte y fue el último gran combate entre líneas de acorazados.",
    related: ["Batalla del golfo de Leyte"]
  }),
  "Batalla del golfo de Kula": battleFix({
    campaign: "Campaña de Nueva Georgia",
    region: "Golfo de Kula, Islas Salomón",
    source: SOURCES.centralSolomons,
    startYear: 1943,
    type: "batalla naval",
    cause: "La Marina estadounidense interceptó un transporte nocturno japonés de tropas hacia Kolombangara.",
    outcome: "Combate sin vencedor decisivo, con pérdidas importantes para ambos bandos.",
    consequences: "Los refuerzos japoneses llegaron parcialmente y las acciones navales por Nueva Georgia continuaron."
  }),
  "Batalla del mar de Sibuyán": battleFix({
    campaign: "Campaña de Leyte",
    region: "Mar de Sibuyán, Filipinas",
    source: SOURCES.leyte,
    startYear: 1944,
    type: "batalla aeronaval",
    cause: "Aeronaves estadounidenses atacaron la fuerza central japonesa que avanzaba hacia el golfo de Leyte.",
    outcome: "Victoria aérea estadounidense parcial: el acorazado Musashi fue hundido y la fuerza japonesa quedó dañada.",
    consequences: "El ataque retrasó y debilitó a la fuerza central, aunque no impidió su paso posterior hacia Samar.",
    related: ["Batalla del golfo de Leyte"]
  }),
  "Batalla naval de Vella Lavella": battleFix({
    campaign: "Campaña de Nueva Georgia",
    region: "Vella Lavella, Islas Salomón",
    source: SOURCES.vellaLavella,
    startYear: 1943,
    type: "batalla naval",
    cause: "Destructores estadounidenses intentaron interceptar la evacuación japonesa de Vella Lavella.",
    outcome: "Victoria táctica japonesa; la evacuación continuó y los destructores estadounidenses sufrieron daños graves.",
    consequences: "Fue el último gran combate naval de las Salomón centrales y la última victoria naval japonesa significativa de la guerra."
  }),
  "Batalla de Tassafaronga": battleFix({
    campaign: "Campaña de Guadalcanal",
    region: "Tassafaronga, Guadalcanal, Islas Salomón",
    source: SOURCES.tassafaronga,
    startYear: 1942,
    type: "batalla naval",
    cause: "Una fuerza estadounidense intentó destruir destructores japoneses enviados a abastecer Guadalcanal.",
    outcome: "Victoria táctica japonesa, aunque la misión de abastecimiento no se completó.",
    consequences: "La acción expuso la eficacia de los torpedos japoneses y obligó a revisar las tácticas nocturnas estadounidenses."
  }),
  "Batalla de Tenaru": battleFix({
    campaign: "Campaña de Guadalcanal",
    region: "Alligator Creek, Guadalcanal, Islas Salomón",
    source: SOURCES.tenaru,
    startYear: 1942,
    cause: "El destacamento Ichiki atacó el perímetro estadounidense que protegía Henderson Field.",
    outcome: "Victoria estadounidense y destrucción de la mayor parte de la fuerza atacante japonesa.",
    consequences: "La batalla aseguró temporalmente el flanco oriental del perímetro de Lunga y evidenció que Japón había subestimado la fuerza defensora."
  }),
  "Batalla de Talasea": battleFix({
    campaign: "Campaña de Nueva Bretaña",
    region: "Península de Willaumez, Nueva Bretaña, Papúa Nueva Guinea",
    source: SOURCES.talasea,
    startYear: 1944,
    cause: "Los Marines desembarcaron para asegurar Talasea y presionar la ruta de retirada japonesa hacia Rabaul.",
    outcome: "Victoria estadounidense; Talasea fue declarada segura el 9 de marzo de 1944.",
    consequences: "La posición permitió establecer una base de lanchas torpederas y ampliar el aislamiento de Rabaul."
  }),
  "Combate naval del SS Stephen Hopkins": battleFix({
    campaign: "Batalla del Atlántico",
    region: "Atlántico Sur",
    source: SOURCES.stephenHopkins,
    startYear: 1942,
    type: "batalla naval",
    axis: ["Alemania"],
    cause: "El mercante estadounidense SS Stephen Hopkins encontró a los corsarios alemanes Stier y Tannenfels en el Atlántico Sur.",
    outcome: "El SS Stephen Hopkins fue hundido, pero dañó mortalmente al Stier en el combate.",
    consequences: "La pérdida de ambos buques convirtió la acción en uno de los episodios más destacados de la Guardia Armada Naval estadounidense."
  }),
  "Batalla de Saint-Lô": battleFix({
    campaign: "Campaña de Normandía",
    region: "Saint-Lô, Normandía, Francia",
    source: SOURCES.saintLo,
    startYear: 1944,
    axis: ["Alemania"],
    cause: "El Primer Ejército estadounidense atacó para profundizar la cabeza de puente de Normandía y preparar la ruptura del frente.",
    outcome: "Victoria estadounidense y toma de Saint-Lô tras combates intensos.",
    consequences: "La operación dejó preparada el área de partida para la posterior Operación Cobra."
  }),
  "Batalla de Saint-Vith": battleFix({
    campaign: "Ofensiva de las Ardenas",
    region: "Saint-Vith, Bélgica",
    source: SOURCES.saintVith,
    startYear: 1944,
    axis: ["Alemania"],
    cause: "Alemania buscó capturar el nudo vial y ferroviario de Saint-Vith durante su ofensiva de las Ardenas.",
    outcome: "Victoria táctica alemana tras la retirada estadounidense, pero con un retraso operacional decisivo.",
    consequences: "La defensa desorganizó el calendario alemán y contribuyó al fracaso estratégico de la ofensiva."
  }),
  "Batalla de la colina Crucifix": battleFix({
    campaign: "Ofensiva de Aquisgrán",
    region: "Colina Crucifix, Aquisgrán, Alemania",
    source: SOURCES.crucifixHill,
    startYear: 1944,
    axis: ["Alemania"],
    cause: "La 1.ª División de Infantería estadounidense atacó una posición fortificada clave al norte de Aquisgrán.",
    outcome: "Victoria estadounidense y captura de la colina fortificada.",
    consequences: "La toma ayudó a cerrar el cerco de Aquisgrán y a romper posiciones de la Línea Sigfrido.",
    related: ["Campaña de Renania"]
  })
};
