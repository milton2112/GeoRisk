function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval de Vizagapatam (1804)";
const PARENT = "Guerras napole\u00f3nicas (1803-1815)";
const CAMPAIGN = "Operaciones de la escuadra de Linois en el oceano Indico (1804)";

const SOURCES = {
  royalCollectionTrust: source(
    "Royal Collection Trust, RCIN 735113: ataque de la escuadra de Linois, naves, mandos, captura de Princess Charlotte, supervivencia de Centurion y correccion de la fecha impresa",
    "https://militarymaps.rct.uk/napoleonic-wars-1803-15/vizagapatam-1804-vishakpatnam-andhra-pradesh-india-17deg4400n-83deg1600e"
  ),
  royalMuseumsGreenwich: source(
    "Royal Museums Greenwich, PAD5682: catalogo de la accion de Vizagapatam dentro de las Guerras Napoleonicas e identificacion de los buques conservados en la estampa",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-109833"
  )
};

function vizagapatam1804Fix() {
  const hierarchySources = [
    SOURCES.royalCollectionTrust,
    SOURCES.royalMuseumsGreenwich
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1804,
    endYear: 1804,
    region: "Rada de Vizagapatam, actual Visakhapatnam, bahia de Bengala, India",
    normalizedRegion: "Visakhapatnam, bahia de Bengala, India",
    cause: "Durante las Guerras Napoleonicas, una escuadra francesa al mando de Charles-Alexandre Linois ataco a HMS Centurion y a dos mercantes anclados frente a Vizagapatam. La ficha lo trata como un combate naval entre Francia y Reino Unido, no como un conflicto interno de la India actual ni como una disputa territorial local.",
    outcome: "Resultado tactico dividido. La fuente de la Royal Collection Trust confirma la captura francesa de Princess Charlotte y la supervivencia de Centurion ante una fuerza superior; la inscripcion de la estampa describe que la escuadra francesa fue rechazada tras la accion. GeoRisk conserva ambos efectos y no declara una victoria unilateral decisiva.",
    consequences: "La accion ilustra la presion francesa sobre las rutas britanicas del oceano Indico durante las Guerras Napoleonicas. La ficha no presenta el combate como un cambio de soberania en Vizagapatam ni como un tratado: conserva la captura mercante y la defensa de Centurion como efectos distintos.",
    chronology: [
      {
        year: 1804,
        event: "La escuadra francesa de Charles-Alexandre Linois, con Marengo, Atalante y Semillante, se acerco a HMS Centurion y dos mercantes anclados frente a Vizagapatam."
      },
      {
        year: 1804,
        event: "El 15 de septiembre se produjo la accion naval segun el catalogo de la Royal Collection Trust; la fecha del 18 grabada en la estampa se conserva como discrepancia documental."
      },
      {
        year: 1804,
        event: "Tras unas tres horas, Princess Charlotte fue capturada por los franceses y Centurion sobrevivio. La leyenda de la estampa registra que la escuadra francesa fue rechazada, por lo que la ficha evita reducir el resultado a un unico vencedor."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Charles-Alexandre Linois", "James Lind", "HMS Centurion", "Princess Charlotte", "bahia de Bengala"],
    participants: [
      {
        side: "Escuadra francesa de Linois",
        members: ["Francia", "Marina francesa", "Charles-Alexandre Linois", "Marengo", "Atalante", "Semillante"],
        casualties: "Las fuentes museisticas usadas identifican la accion y los buques, pero no ofrecen una tabla bilateral unica de bajas. GeoRisk no fija cifras agregadas ni mezcla danos de naves con bajas personales."
      },
      {
        side: "Escolta britanica y mercantes de la Compania de las Indias Orientales",
        members: ["Reino Unido", "Royal Navy", "HMS Centurion", "James Lind", "Compania Britanica de las Indias Orientales", "Princess Charlotte", "Barnaby"],
        casualties: "La ficha conserva que Princess Charlotte fue capturada y que Centurion sobrevivio, sin publicar un total de bajas que las fuentes museisticas consultadas no consolidan de forma comparable."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "15 de septiembre de 1804; la fecha del 18 grabada en una estampa contemporanea es identificada como error por Royal Collection Trust",
    sourceDispute: "Royal Collection Trust data la accion el 15 de septiembre y explica que la fecha del 18, grabada en el titulo de la estampa, parece un error. Tanto la transcripcion de esa estampa como el catalogo de Royal Museums Greenwich conservan la formula del 18, por lo que GeoRisk expone la discrepancia en vez de ocultarla. La misma fuente documenta la captura de Princess Charlotte y la supervivencia de Centurion, mientras la leyenda de la estampa afirma que la escuadra francesa fue rechazada. Esos efectos explican las lecturas tacticas contrapuestas; la ficha no transforma esa combinacion en una victoria total de una sola parte ni calcula bajas sin una tabla bilateral compatible. India se usa como referencia geografica actual de navegacion, no como beligerante estatal de 1804.",
    curationPriority: "alta",
    curationBatch: "source-backed-vizagapatam-1804-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior solo figuraba para Francia, sin fecha, ubicacion, contraparte ni jerarquia verificable y bajo un conflicto europeo generico. Se normaliza como Batalla naval de Vizagapatam (1804), se vincula a las Guerras Napoleonicas y se conecta con Reino Unido e India para navegacion historica y geografica. La campana es una etiqueta organizativa de GeoRisk para la escuadra de Linois; no es una guerra separada ni una afirmacion de soberania sobre la India actual."
  };
}

export const VIZAGAPATAM_1804_CONFLICT_RENAMES = {
  "Batalla de Vizagapatam": CANONICAL,
  "Batalla naval de Vizagapatam": CANONICAL,
  "Batalla naval de Vizagapatam (1804)": CANONICAL,
  "Batalla de Visakhapatnam": CANONICAL,
  "Battle of Vizagapatam": CANONICAL,
  "Battle of Visakhapatnam": CANONICAL,
  "Action in Vizagapatam Roads": CANONICAL
};

export const VIZAGAPATAM_1804_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL],
  India: [CANONICAL]
};

export const VIZAGAPATAM_1804_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: vizagapatam1804Fix()
};
