function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Fayetteville (Arkansas, 1863)";
const PARENT = "Guerra Civil estadounidense";
const CAMPAIGN = "Operaciones de Arkansas noroccidental de 1863";

const SOURCES = {
  officialRecords: source(
    "Departamento de Guerra de EE. UU., Official Records, Serie I, volumen XXII: partes de Union y Confederacion de las operaciones de 1863, digitalizados por la University of North Texas",
    "https://texashistory.unt.edu/ark:/67531/metapth154600/"
  ),
  encyclopediaArkansas: source(
    "Encyclopedia of Arkansas, Prairie Grove Battlefield Historic State Park: fecha, fuerzas, desarrollo, retirada confederada y abandono federal posterior",
    "https://encyclopediaofarkansas.net/entries/action-at-fayetteville-2588/"
  ),
  nationalRegister: source(
    "Servicio de Parques Nacionales, Registro Nacional de Lugares Historicos: Headquarters House, lugar de los cuarteles de la Union durante el combate y registro de una interpretacion confederada posterior del resultado",
    "https://www.arkansasheritage.com/docs/default-source/national-registry/wa0394-pdf.pdf?sfvrsn=a9e73ebc_0"
  )
};

function fayetteville1863Fix() {
  const hierarchySources = [
    SOURCES.officialRecords,
    SOURCES.encyclopediaArkansas,
    SOURCES.nationalRegister
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "civil",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1863,
    endYear: 1863,
    region: "Fayetteville, condado de Washington, Arkansas, Estados Unidos",
    normalizedRegion: "Fayetteville, Arkansas, Estados Unidos",
    cause: "La brigada confederada de William L. Cabell salio de Ozark con el objetivo de expulsar el puesto de la Union en Fayetteville y recuperar influencia en el noroeste de Arkansas. El puesto federal, al mando de Marcus LaRue Harrison, funcionaba tras la evacuacion de heridos de Prairie Grove. La accion se inserta en la guerra civil interna de Arkansas, donde unidades locales se enfrentaron entre si, no en una disputa interestatal entre los estados actuales.",
    outcome: "El 18 de abril los confederados atacaron Fayetteville, pero no desalojaron por la fuerza al puesto de la Union y se retiraron despues de perder su apoyo artillero. Pocos dias despues, autoridades federales ordenaron abandonar el puesto por su exposicion. La ficha no reduce esa secuencia a una victoria unica: la historiografia de Arkansas la califica de indecisa y conserva que relatos confederados posteriores defendieron una lectura distinta.",
    consequences: "La retirada federal temporal de Fayetteville mostro la fragilidad de los puestos de la Union en el noroeste de Arkansas. Las tropas de Harrison volvieron en septiembre y permanecieron hasta el final de la guerra. El combate tambien evidencia las divisiones locales: gran parte de las unidades de ambos lados procedia de Arkansas y de la region de Ozarks.",
    chronology: [
      {
        year: 1863,
        event: "El 16 de abril, la brigada confederada de William L. Cabell salio de Ozark hacia Fayetteville con la intencion de atacar el puesto federal."
      },
      {
        year: 1863,
        event: "El 18 de abril, despues del amanecer, los piquetes federales fueron atacados al este de Fayetteville; el aviso impidio una sorpresa completa y se organizaron defensas en torno a la ciudad y Headquarters House."
      },
      {
        year: 1863,
        event: "Alrededor de las 10:00, la fuerza confederada se retiro al sur. El 25 de abril, la Union abandono temporalmente el puesto por su vulnerabilidad; las tropas regresaron en septiembre."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Batalla de Prairie Grove (1862)", "Headquarters House", "Fayetteville, Arkansas"],
    participants: [
      {
        side: "Puesto de la Union en Fayetteville",
        members: ["Estados Unidos", "1.a Caballeria de Arkansas de la Union", "1.a Infanteria de Arkansas de la Union", "Marcus LaRue Harrison", "James M. Johnson"],
        casualties: "No se fija un total cerrado. La sintesis de Arkansas ofrece aproximadamente cincuenta bajas por lado, mientras que los partes y recuentos posteriores usan criterios y cifras diferentes."
      },
      {
        side: "Brigada confederada de Cabell",
        members: ["Estados Confederados de America", "Brigada de William L. Cabell", "caballerias de Charles A. Carroll y James C. Monroe", "unidades de Texas y Misuri citadas por la sintesis historica"],
        casualties: "No se fija un total cerrado. Las estimaciones de muertos, heridos, desaparecidos y capturados no coinciden entre los partes, la historiografia posterior y las memorias de participantes."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "18 de abril de 1863",
    sourceDispute: "Las fuentes coinciden en fecha, lugar, mandos principales, objetivo confederado y retirada posterior. Difieren al resumir bajas y resultado: Encyclopedia of Arkansas usa indecisa, los partes de cada bando enfatizan sus propias posiciones y la documentacion del Registro Nacional conserva una tradicion familiar que reivindico una victoria confederada. GeoRisk distingue la retirada del 18 de abril del abandono federal ordenado dias despues y evita fundirlos en una victoria estrategica inequivoca. La etiqueta Operaciones de Arkansas noroccidental de 1863 es organizativa de GeoRisk, no una campana oficial con ese nombre.",
    curationPriority: "alta",
    curationBatch: "source-backed-fayetteville-1863-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior no tenia fecha, ubicacion, jerarquia, bandos ni fuentes y estaba clasificada bajo Conflicto regional de America como batalla interestatal. Se normaliza con Arkansas y 1863 para distinguirla de otras acciones llamadas Fayetteville, se incorpora a la Guerra Civil estadounidense y se conserva la disputa sobre el resultado y las bajas. Arkansas aparece como lugar actual y origen de unidades, no como Estado beligerante contemporaneo separado."
  };
}

export const FAYETTEVILLE_1863_CONFLICT_RENAMES = {
  "Batalla de Fayetteville": CANONICAL,
  "Batalla de Fayetteville (1863)": CANONICAL,
  "Batalla de Fayetteville, Arkansas": CANONICAL,
  "Acci\u00f3n de Fayetteville": CANONICAL,
  "Accion de Fayetteville": CANONICAL,
  "Action at Fayetteville": CANONICAL,
  "Battle of Fayetteville": CANONICAL,
  "Battle of Fayetteville (1863)": CANONICAL
};

export const FAYETTEVILLE_1863_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [PARENT, CANONICAL]
};

export const FAYETTEVILLE_1863_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: fayetteville1863Fix()
};
