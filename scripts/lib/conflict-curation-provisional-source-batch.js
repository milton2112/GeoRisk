function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  casmaChile: source(
    "Armada de Chile: cronologia y desarrollo del combate naval de Casma del 12 de enero de 1839",
    "https://www.armada.cl/tradicion-e-historia/principales-acciones-navales/la-guerra-contra-la-confederaci%6Fn-peru-boliviana-1836-1839/combate-naval-de-casma"
  ),
  casmaPeru: source(
    "Marina de Guerra del Peru: historia naval del siglo XIX y combate de Casma dentro de la guerra contra la Confederacion Peru-Boliviana",
    "https://www.gob.pe/27103-historia-de-la-marina-de-guerra-del-peru-siglo-xix"
  ),
  predealRomanianMilitary: source(
    "Instituto de Estudios Politicos de Defensa y de Historia Militar de Rumania: estudio sobre los combates de la valle de Prahova y el paso de Predeal en 1916",
    "https://ispaim.mapn.ro/webroot/fileslib/upload/files/RIM/rim%205-6%202017.pdf"
  ),
  predealIndiana: source(
    "Indiana University Press: Prelude to Blitzkrieg, estudio de Michael B. Barrett sobre la campana austro-alemana en Rumania de 1916",
    "https://iupress.org/9780253008701/prelude-to-blitzkrieg/"
  ),
  raboseeLiege: source(
    "Ciudad de Lieja: nota historica sobre el general Bertrand y la batalla de Rabosee durante los combates de agosto de 1914",
    "https://www.liege.be/fr/annuaire/art-public/statue-du-general-bertrand-en-outremeuse"
  ),
  raboseeProvince: source(
    "Provincia de Lieja: guia memorial sobre la resistencia belga en Rabosee durante la noche del 5 al 6 de agosto de 1914",
    "https://cdn.wbtourisme.be/sites/default/files/Memorial%20tourism%20in%20the%20Province%20of%20Li%C3%A8ge.pdf"
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
    curationBatch: "source-backed-provisional-source-batch-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const PROVISIONAL_SOURCE_BATCH_CONFLICT_RENAMES = {
  "Combate naval de Casma": "Combate naval de Casma (1839)",
  "Batalla de Predeal Pass": "Batalla del paso de Predeal (1916)",
  "Batalla de Rabos\u00e9e": "Batalla de Rabos\u00e9e (1914)"
};

export const PROVISIONAL_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS = {
  Alemania: ["Batalla del paso de Predeal (1916)", "Batalla de Rabos\u00e9e (1914)"],
  Austria: ["Batalla del paso de Predeal (1916)"],
  Bolivia: ["Combate naval de Casma (1839)"],
  "Per\u00fa": ["Combate naval de Casma (1839)"],
  Rumania: ["Batalla del paso de Predeal (1916)"]
};

export const PROVISIONAL_SOURCE_BATCH_CONFLICT_DETAIL_FIXES = {
  "Combate naval de Casma (1839)": historicalFix({
    parent: "Guerra contra la Confederaci\u00f3n Per\u00fa-Boliviana (1836-1839)",
    campaign: "Segunda Expedici\u00f3n Restauradora al Per\u00fa (1838-1839)",
    region: "Bahia de Casma, litoral central del Peru",
    hierarchySources: [SOURCES.casmaChile, SOURCES.casmaPeru],
    startYear: 1839,
    type: "combate naval",
    participants: [
      { side: "Escuadra chilena", members: ["Chile"] },
      { side: "Flotilla de la Confederacion Peru-Boliviana", members: ["Confederacion Peru-Boliviana"] }
    ],
    cause: "Durante la segunda expedicion restauradora, una division chilena se aprovisionaba en Casma mientras la flotilla confederada intentaba disputar el control maritimo y amenazar las comunicaciones de la fuerza expedicionaria.",
    outcome: "La escuadra chilena rechazo el ataque del 12 de enero y la flotilla confederada se replego. El combate reforzo la superioridad naval chilena en la fase final de la guerra, sin convertir por si solo la accion en el desenlace politico del conflicto.",
    consequences: "La perdida de capacidad naval confederada redujo la amenaza sobre las comunicaciones de la expedicion restauradora. Ocho dias despues, la batalla de Yungay precipito la disolucion de la Confederacion Peru-Boliviana.",
    chronology: [
      { year: 1839, event: "El 10 de enero, la division chilena fondeo en Casma para reabastecerse durante la segunda expedicion restauradora." },
      { year: 1839, event: "El 12 de enero, la escuadra chilena y la flotilla confederada combatieron en la bahia de Casma." },
      { year: 1839, event: "Tras la accion, las unidades confederadas se retiraron y Chile conservo la iniciativa naval en la fase final de la guerra." }
    ],
    treaties: [],
    related: ["Batalla de Yungay (1839)"],
    curationNote: "La Confederacion Peru-Boliviana fue una entidad historica. Chile, Peru y Bolivia se enlazan para navegacion historica, pero la ficha conserva a la Confederacion como participante de epoca y no asigna bajas cerradas cuando las fuentes de sintesis no las consolidan.",
    sourceDispute: true
  }),
  "Batalla del paso de Predeal (1916)": historicalFix({
    parent: "Primera Guerra Mundial",
    campaign: "Campana rumana de 1916",
    region: "Paso de Predeal y valle de Prahova, Carpatos meridionales; frontera historica entre Rumania y Austria-Hungria",
    hierarchySources: [SOURCES.predealRomanianMilitary, SOURCES.predealIndiana],
    startYear: 1916,
    type: "batalla de montana",
    scale: "mundial",
    participants: [
      { side: "Fuerzas rumanas del grupo de Predeal", members: ["Ejercito Rumano"] },
      { side: "Fuerzas de las Potencias Centrales", members: ["Ejercito Aleman", "Ejercito austrohungaro"] }
    ],
    cause: "Tras la entrada de Rumania en la guerra y los combates en Transilvania, las Potencias Centrales buscaron atravesar los pasos de los Carpatos para abrir una ruta hacia el sur de Rumania y la llanura de Valaquia.",
    outcome: "La defensa rumana impidio una ruptura inmediata por el paso de Predeal durante la fase registrada. Las fuerzas de las Potencias Centrales tomaron la localidad de Predeal y la campana continuo, por lo que la ficha no presenta el combate como una victoria estrategica absoluta de un solo bando.",
    consequences: "La resistencia en el valle de Prahova retraso la progresion enemiga por ese eje y condiciono la maniobra de la campana rumana de 1916, que siguio desplazandose hacia el sur y el este.",
    chronology: [
      { year: 1916, event: "En octubre, las fuerzas de las Potencias Centrales presionaron los accesos del valle de Prahova y el paso de Predeal." },
      { year: 1916, event: "Durante varias semanas, las tropas rumanas defendieron las alturas y las rutas del paso frente a una ofensiva con superioridad material." },
      { year: 1916, event: "La lucha por Predeal y sus accesos concluyo dentro de la fase montanosa de la campana rumana, sin una penetracion inmediata por el paso hacia el sur." }
    ],
    treaties: [],
    related: ["Campana rumana de 1916"],
    curationNote: "Predeal se encontraba en una frontera de epoca distinta de las fronteras actuales. Rumania, Alemania, Austria y Hungria se usan como enlaces de navegacion; los participantes se expresan como ejercitos de 1916 y no como una equivalencia entre Estados contemporaneos y los bandos historicos.",
    sourceDispute: true
  }),
  "Batalla de Rabos\u00e9e (1914)": historicalFix({
    parent: "Primera Guerra Mundial",
    campaign: "Batalla de Lieja (agosto de 1914)",
    region: "Rabosee y Wandre, Lieja, Belgica",
    hierarchySources: [SOURCES.raboseeLiege, SOURCES.raboseeProvince],
    startYear: 1914,
    type: "combate defensivo",
    scale: "mundial",
    participants: [
      { side: "Fuerzas belgas de defensa de Lieja", members: ["Ejercito Belga", "11.a Brigada belga"] },
      { side: "Fuerzas del Imperio aleman", members: ["Ejercito Imperial Aleman"] }
    ],
    cause: "La invasion alemana de Belgica intento pasar entre los fuertes de Lieja por ataques nocturnos y avances rapidos. Las tropas belgas situadas en los intervalos defensivos organizaron una resistencia en el sector de Rabosee.",
    outcome: "La resistencia belga freno y rechazo el impulso inicial aleman en el sector durante la noche del 5 al 6 de agosto. No se presenta como una victoria de toda la batalla de Lieja: el asedio y los combates por la plaza continuaron hasta mediados de agosto.",
    consequences: "Rabosee formo parte de la resistencia que retraso la progresion alemana alrededor de Lieja y quedo integrado en la memoria local de los primeros combates de 1914.",
    chronology: [
      { year: 1914, event: "El 4 de agosto, Alemania invadio Belgica e inicio la ofensiva contra la posicion fortificada de Lieja." },
      { year: 1914, event: "En la noche del 5 al 6 de agosto, las fuerzas belgas resistieron los ataques alemanes en Rabosee y otros intervalos entre los fuertes." },
      { year: 1914, event: "La batalla de Lieja continuo hasta el 16 de agosto, aun despues de los reveses iniciales alemanes en sectores como Rabosee." }
    ],
    treaties: [],
    related: ["Invasion alemana de Belgica (1914)"],
    curationNote: "Rabosee es una accion local dentro de la batalla de Lieja, no una campana independiente. Las fuentes municipales y provinciales documentan el encuadre, pero no consolidan una tabla comun de efectivos o bajas; por eso la ficha evita cifras cerradas.",
    sourceDispute: true
  })
};
