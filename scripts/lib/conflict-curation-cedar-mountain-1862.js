function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Cedar Mountain (1862)";
const PARENT = "Guerra Civil estadounidense";
const CAMPAIGN = "Campa\u00f1a de Virginia del Norte de 1862";

const SOURCES = {
  nationalParkServiceBattle: source(
    "Servicio de Parques Nacionales de EE. UU.: el 9 de agosto de 1862 Nathaniel Banks ataco a fuerzas confederadas bajo Thomas J. Jackson en Cedar Mountain y el combate duro cerca de cinco horas",
    "https://www.nps.gov/articles/000/union-retreat-at-cedar-mountain.htm"
  ),
  libraryOfCongressMap: source(
    "Biblioteca del Congreso de EE. UU., mapa historico de la batalla: Cedar Mountain, condado de Culpeper, Virginia, 9 de agosto de 1862; el contraataque confederado obligo al repliegue de Banks",
    "https://www.loc.gov/item/gvhs01.vhs00057/"
  ),
  americanBattlefieldTrust: source(
    "American Battlefield Trust: Cedar Mountain, tambien llamada Slaughter's Mountain, fue una victoria confederada en el condado de Culpeper el 9 de agosto de 1862, dentro de la Campa\u00f1a de Virginia del Norte",
    "https://www.battlefields.org/learn/civil-war/battles/cedar-mountain",
    "media"
  ),
  nationalParkServiceWarOverview: source(
    "Servicio de Parques Nacionales de EE. UU.: sintesis de la Guerra Civil, su resultado militar y la abolicion de la esclavitud tras la victoria de la Union",
    "https://www.nps.gov/civilwar/overview.htm"
  ),
  armyCampaigns: source(
    "Centro de Historia Militar del Ejercito de EE. UU.: cronologia de campa\u00f1as de la Guerra Civil, incluida la Campa\u00f1a de Manassas de agosto-septiembre de 1862 y Appomattox de abril de 1865",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Civil-War/"
  )
};

function civilWarFix() {
  const hierarchySources = [
    SOURCES.nationalParkServiceWarOverview,
    SOURCES.armyCampaigns,
    SOURCES.nationalParkServiceBattle
  ];

  return {
    type: "guerra civil",
    conflictType: "civil",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1861,
    endYear: 1865,
    region: "Estados Unidos, con frentes terrestres y navales en el este, oeste y sur",
    normalizedRegion: "Estados Unidos, con frentes terrestres y navales en el este, oeste y sur",
    cause: "La secesion de varios estados esclavistas y el conflicto sobre la preservacion de la Union federal, la esclavitud y la autoridad constitucional derivaron en guerra abierta tras Fort Sumter en abril de 1861.",
    outcome: "Victoria de la Union. La rendicion de Robert E. Lee en Appomattox y las rendiciones principales posteriores de 1865 cerraron las operaciones convencionales confederadas; la ficha distingue ese cierre militar de los procesos politicos y sociales posteriores.",
    consequences: "La Union federal se preservo y la Decimotercera Enmienda abolio la esclavitud en Estados Unidos. La Reconstruccion, la reintegracion politica y las consecuencias sociales del conflicto se prolongaron mas alla de 1865; la ficha no agrega un total unico de bajas porque las series dependen de definiciones y metodologias distintas.",
    chronology: [
      {
        year: 1861,
        event: "El 12 de abril, el ataque confederado contra Fort Sumter abrio la fase militar de la Guerra Civil."
      },
      {
        year: 1862,
        event: "La guerra se extendio por varios teatros; Cedar Mountain formo parte de la Campa\u00f1a de Virginia del Norte antes de la segunda batalla de Manassas."
      },
      {
        year: 1863,
        event: "Las campa\u00f1as de Vicksburg y Gettysburg alteraron la situacion estrategica a favor de la Union."
      },
      {
        year: 1865,
        event: "La rendicion del Ejercito de Virginia del Norte en Appomattox el 9 de abril marco el cierre principal de las operaciones en Virginia; otras rendiciones siguieron durante 1865."
      },
      {
        year: 1865,
        event: "La Decimotercera Enmienda fue ratificada en diciembre y abolio la esclavitud en todo Estados Unidos."
      }
    ],
    treaties: [
      "Rendicion de Appomattox (9 de abril de 1865), cierre militar principal en Virginia",
      "Rendiciones confederadas posteriores de 1865"
    ],
    related: [
      CAMPAIGN,
      CANONICAL,
      "Batalla de Fort Sumter",
      "Batalla de Gettysburg",
      "Sitio de Vicksburg",
      "Segunda batalla de Manassas",
      "Rendicion de Appomattox"
    ],
    participants: [
      {
        side: "Union",
        members: ["Estados Unidos", "Ejercito de los Estados Unidos", "Armada de los Estados Unidos"],
        casualties: "No consolidadas para toda la guerra: los recuentos militares, civiles, muertos por enfermedad y personas desaparecidas dependen de la metodologia y el periodo de corte."
      },
      {
        side: "Confederacion",
        members: ["Estados Confederados de America", "Ejercito de los Estados Confederados", "Armada de los Estados Confederados"],
        casualties: "No consolidadas para toda la guerra: los partes confederados, las reconstrucciones posteriores y los recuentos por teatro no forman una serie unica y equivalente."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "12 de abril de 1861 a 1865; rendicion principal de Lee el 9 de abril de 1865",
    sourceDispute: "La fecha de inicio militar se fija en Fort Sumter, el 12 de abril de 1861. Algunas cronologias usan Appomattox como fin de la guerra y otras incluyen las rendiciones posteriores de 1865; la ficha muestra ambas capas. Las cifras de muertos y bajas civiles tambien varian con la metodologia, por lo que no presenta un total unico como dato cerrado.",
    curationPriority: "alta",
    curationBatch: "source-backed-cedar-mountain-1862-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La Guerra Civil estadounidense ya era el padre citado por numerosas fichas del dataset, pero no existia como entrada navegable propia. Se incorpora para reparar esa jerarquia sin tratar a los Estados Confederados de America como un Estado contemporaneo ni trasladar automaticamente sus atributos a los estados actuales."
  };
}

function cedarMountain1862Fix() {
  const hierarchySources = [
    SOURCES.nationalParkServiceBattle,
    SOURCES.libraryOfCongressMap,
    SOURCES.americanBattlefieldTrust
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "civil",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1862,
    endYear: 1862,
    region: "Cedar Mountain o Slaughter's Mountain, condado de Culpeper, Virginia, Estados Unidos",
    normalizedRegion: "Cedar Mountain o Slaughter's Mountain, condado de Culpeper, Virginia, Estados Unidos",
    cause: "Durante la Campa\u00f1a de Virginia del Norte, la avanzada de Nathaniel Banks intento golpear a las fuerzas de Thomas J. Jackson cerca de Cedar Mountain antes de que el Ejercito de Virginia de John Pope pudiera concentrarse.",
    outcome: "Victoria tactica confederada: despues de un combate prolongado, el contraataque apoyado por refuerzos de A. P. Hill obligo a Banks a retirarse. La ficha no presenta el resultado local como una explicacion unica de la campa\u00f1a posterior.",
    consequences: "El combate formo parte de la secuencia que llevo a las operaciones de agosto y septiembre de 1862 en Virginia. Sus cifras de fuerzas y bajas no se consolidan aqui porque los resumentes y los estudios especializados usan recuentos y criterios diferentes.",
    chronology: [
      {
        year: 1862,
        event: "Durante el verano, el Ejercito de Virginia de John Pope se concentro en el norte de Virginia frente a la fuerza de Thomas J. Jackson."
      },
      {
        year: 1862,
        event: "El 9 de agosto, elementos al mando de Nathaniel Banks atacaron a Jackson en Cedar Mountain, en el condado de Culpeper."
      },
      {
        year: 1862,
        event: "Tras horas de lucha, los refuerzos de A. P. Hill apoyaron el contraataque confederado que obligo al repliegue de las fuerzas de Banks."
      },
      {
        year: 1862,
        event: "Las operaciones continuaron dentro de la Campa\u00f1a de Virginia del Norte hasta la segunda batalla de Manassas."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "John Pope",
      "Nathaniel Banks",
      "Thomas J. Stonewall Jackson",
      "A. P. Hill",
      "Segunda batalla de Manassas"
    ],
    participants: [
      {
        side: "Union",
        members: ["Estados Unidos", "Ejercito de Virginia", "II Cuerpo del Ejercito de Virginia", "Nathaniel Banks"],
        casualties: "No consolidadas: las fuentes consultadas describen el combate y el repliegue, pero las estimaciones de efectivos y bajas difieren segun el autor y el criterio de inclusion."
      },
      {
        side: "Confederacion",
        members: ["Estados Confederados de America", "Fuerza de Thomas J. Jackson", "Division de A. P. Hill", "Thomas J. Jackson", "A. P. Hill"],
        casualties: "No consolidadas: las estimaciones de efectivos y bajas varian entre resumentes contemporaneos y estudios posteriores; la ficha evita fijar una cifra unica sin una serie homologada."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "9 de agosto de 1862",
    sourceDispute: "Cedar Mountain tambien aparece como Slaughter's Mountain y Cedar Run. La etiqueta importada Little Mountain era ambigua y se normaliza como Cedar Mountain tras la verificacion editorial y el mapeo local de titulos. Las fuentes coinciden en fecha, lugar y victoria confederada, pero difieren en efectivos y bajas; por eso la ficha no fija totales cerrados.",
    curationPriority: "alta",
    curationBatch: "source-backed-cedar-mountain-1862-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Little Mountain, no tenia fecha ni jerarquia verificable y estaba bajo un conflicto regional generico de America. Se renombra como Batalla de Cedar Mountain (1862), se vincula a la Guerra Civil estadounidense y conserva nombres alternativos documentados sin tratar Little Mountain como un alias historico confirmado."
  };
}

export const CEDAR_MOUNTAIN_1862_CONFLICT_RENAMES = {
  "Batalla de Little Mountain": CANONICAL,
  "Batalla de Cedar Mountain": CANONICAL,
  "Batalla de Cedar Mountain (1862)": CANONICAL,
  "Batalla de Cedar Run": CANONICAL,
  "Batalla de Slaughter's Mountain": CANONICAL,
  "Battle of Cedar Mountain": CANONICAL,
  "Battle of Cedar Mountain (1862)": CANONICAL,
  "Battle of Cedar Run": CANONICAL,
  "Battle of Slaughter's Mountain": CANONICAL
};

export const CEDAR_MOUNTAIN_1862_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [PARENT, CANONICAL]
};

export const CEDAR_MOUNTAIN_1862_CONFLICT_DETAIL_FIXES = {
  [PARENT]: civilWarFix(),
  [CANONICAL]: cedarMountain1862Fix()
};
