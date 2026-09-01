function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval de Pierres Noires (5-6 de julio de 1944)";
const PARENT = "Segunda Guerra Mundial";
const CAMPAIGN = "Operacion Dredger en los accesos de Brest (5-6 de julio de 1944)";

const SOURCES = {
  canadaDndNormandy: source(
    "Gobierno de Canada, Departamento de Defensa Nacional: Normandy 1944: The Canadian Summer, historia operacional que describe Operation Dredger, el contacto con escoltas alemanes y la huida de los submarinos",
    "https://publications.gc.ca/collections/collection_2020/mdn-dnd/D61-3-1993-eng.pdf"
  ),
  canadianNavalReview: source(
    "Canadian Naval Review, Marc Milner: The RCN's Forgotten Surface Battles of 1944, reconstruccion basada en informes de operaciones del 12th Escort Group durante la noche del 5 al 6 de julio",
    "https://navalreview.ca/wp-content/uploads/CNR_pdf_full/cnr_vol19_2.pdf"
  ),
  lookoutNewspaper: source(
    "Lookout Newspaper de CFB Esquimalt: nota de historia naval canadiense que identifica el inicio de Operation Dredger el 5 de julio de 1944",
    "https://www.lookoutnewspaper.com/issues/69/2024-03-04-09.pdf",
    "media"
  )
};

function pierresNoires1944Fix() {
  const hierarchySources = [
    SOURCES.canadaDndNormandy,
    SOURCES.canadianNavalReview,
    SOURCES.lookoutNewspaper
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "mundial",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1944,
    endYear: 1944,
    region: "Mar de Iroise, frente a Pierres Noires y los accesos de Brest, Francia ocupada, golfo de Vizcaya",
    normalizedRegion: "Mar de Iroise, frente a Pierres Noires y Brest, Francia",
    cause: "Durante la campana aliada posterior al desembarco de Normandia, los submarinos alemanes que salian de Brest usaban escoltas de superficie en los accesos costeros. El mando de Plymouth envio al Grupo de Escolta 12 canadiense y a un grupo britanico mas alejado para interceptar esa circulacion en Operation Dredger.",
    outcome: "Exito tactico canadiense limitado: durante la noche del 5 al 6 de julio, el 12th Escort Group dano varios escoltas alemanes y hundio V-715, pero los submarinos lograron escapar y los destructores canadienses sufrieron danos y heridos. GeoRisk no lo presenta como una destruccion de la fuerza alemana ni como una victoria decisiva de la campana.",
    consequences: "La accion demostro que los grupos aliados podian operar muy cerca de Brest y contribuyo a la presion posterior sobre las rutas costeras del golfo de Vizcaya. El resultado inmediato fue modesto: la operacion no impidio la salida de todos los submarinos y el grupo canadiense necesito reparaciones antes de volver a operar.",
    chronology: [
      {
        year: 1944,
        event: "Tras el desembarco de Normandia, los accesos de Brest siguieron siendo un punto de salida y encuentro para submarinos alemanes y sus escoltas de superficie."
      },
      {
        year: 1944,
        event: "Durante la noche del 5 al 6 de julio, el Grupo de Escolta 12 canadiense entro en los accesos de Brest como parte de Operation Dredger, mientras otro grupo aliado esperaba mar adentro."
      },
      {
        year: 1944,
        event: "El radar de HMCS Qu'Appelle localizo la fuerza alemana y los destructores canadienses abrieron fuego cerca de Pierres Noires. El combate nocturno dano varias naves de escolta."
      },
      {
        year: 1944,
        event: "V-715 termino destruido tras ser abandonado por su tripulacion, mientras los submarinos se alejaron y el grupo canadiense se retiro con danos, incluido su comandante herido."
      },
      {
        year: 1944,
        event: "Operation Dredger se convirtio en una de las primeras incursiones aliadas tan cerca de Brest desde la caida de Francia y fue seguida por nuevas operaciones costeras durante el verano."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Batalla del Atlantico",
      "Brest",
      "Pierres Noires",
      "mar de Iroise",
      "HMCS Qu'Appelle",
      "HMCS Saskatchewan",
      "HMCS Skeena",
      "HMCS Restigouche",
      "V-715"
    ],
    participants: [
      {
        side: "Grupo de Escolta 12 de la Marina Real Canadiense",
        members: [
          "Canada",
          "Marina Real Canadiense",
          "HMCS Qu'Appelle",
          "HMCS Saskatchewan",
          "HMCS Skeena",
          "HMCS Restigouche",
          "A. M. MacKillop"
        ],
        casualties: "Los informes consultados registran danos en los destructores y heridas, incluido el comandante del grupo, pero no entregan una tabla bilateral completa y consistente de muertos y heridos canadienses. GeoRisk no fija un total."
      },
      {
        side: "Escoltas costeras de la Kriegsmarine",
        members: [
          "Alemania nazi",
          "Kriegsmarine",
          "Vorpostenboote alemanes",
          "dragaminas auxiliares alemanes",
          "V-715",
          "submarinos alemanes en transito"
        ],
        casualties: "Las fuentes coinciden en la perdida de V-715 y en danos a otros escoltas, pero difieren en la identificacion de los submarinos, el numero exacto de escoltas y las bajas humanas. GeoRisk registra la perdida material confirmada sin inventar cifras de tripulantes."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "noche del 5 al 6 de julio de 1944",
    sourceDispute: "La accion aparece como Battle of Pierres Noires y como parte de Operation Dredger. Las fuentes de Defensa Nacional de Canada y Canadian Naval Review coinciden en la noche del 5 al 6 de julio, la intervencion canadiense cerca de Brest, la destruccion de un escolta y la fuga de los submarinos. Difieren en la identificacion puntual de los submarinos y en el numero o clase de escoltas alemanes; por eso la ficha no asigna nombres de U-boat ni una tabla cerrada de bajas. El estudio oficial llama a Dredger un exito calificado porque los submarinos escaparon, mientras que la reconstruccion naval considera que el grupo cumplio limitadamente su tarea contra los escoltas. GeoRisk lo resume como exito tactico limitado.",
    curationPriority: "alta",
    curationBatch: "source-backed-pierres-noires-1944-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior llego como Battle of Pierres Noires, solo en Canada y bajo un padre regional de America, sin fecha, lugar, contraparte, fuentes ni resultado. Se normaliza como Batalla naval de Pierres Noires (5-6 de julio de 1944), se integra en la Segunda Guerra Mundial y se ubica frente a Brest en la Francia ocupada. Francia se agrega solo como ubicacion contemporanea y Alemania como referencia del adversario historico; los participantes conservan las armadas y formaciones de 1944. La correccion evita atribuir una identidad concreta a los submarinos cuando las reconstrucciones no coinciden."
  };
}

export const PIERRES_NOIRES_1944_CONFLICT_RENAMES = {
  "Battle of Pierres Noires": CANONICAL,
  "Battle of the Pierres Noires": CANONICAL,
  "Batalla de Pierres Noires": CANONICAL,
  "Batalla naval de Pierres Noires": CANONICAL,
  "Batalla naval de Pierres Noires (1944)": CANONICAL,
  "Bataille de Pierres Noires": CANONICAL
};

export const PIERRES_NOIRES_1944_COUNTRY_CONFLICT_ADDITIONS = {
  Alemania: [CANONICAL],
  Francia: [CANONICAL]
};

export const PIERRES_NOIRES_1944_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: pierresNoires1944Fix()
};
