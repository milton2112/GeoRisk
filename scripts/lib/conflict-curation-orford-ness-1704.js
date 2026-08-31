function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval de Orford Ness (1704)";
const PARENT = "Incidente naval anglo-sueco de Orford Ness (1704)";
const CAMPAIGN = "Escolta sueca del convoy hacia Europa occidental (1704)";

const SOURCES = {
  historicEngland: source(
    "Historic England Research Records: ubicacion, calendarios ingles, sueco y gregoriano, exigencia de saludo, combate de cuatro horas, captura temporal y liberacion de Psilander y Oland",
    "https://www.heritagegateway.org.uk/Gateway/Results_Single.aspx?resourceID=19191&uid=84ae60ce-dfec-42ed-bb46-094477d98b73"
  ),
  swedishNationalArchives: source(
    "Svenskt Biografiskt Lexikon de Riksarkivet: mision de convoy de Oland, orden sueca de no rendir honores, escuadra inglesa, dano del buque, cautiverio y arreglo diplomatico posterior",
    "https://sok.riksarkivet.se/sbl/artikel/7415"
  )
};

function orfordNess1704Fix() {
  const hierarchySources = [
    SOURCES.historicEngland,
    SOURCES.swedishNationalArchives
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1704,
    endYear: 1704,
    region: "Frente a Orford Ness, Suffolk, mar del Norte meridional, Inglaterra",
    normalizedRegion: "Orford Ness, Suffolk, Inglaterra",
    cause: "El navio sueco Oland escoltaba un convoy mercante hacia Europa occidental. Una escuadra inglesa exigio que el convoy rindiera el saludo naval que Inglaterra reclamaba en sus aguas; Gustaf von Psilander se nego porque sus instrucciones suecas prohibian rendir primero bandera o vela a una potencia extranjera.",
    outcome: "La escuadra inglesa obligo temporalmente a Oland a cesar la resistencia despues de mas de cuatro horas de combate y llevo el buque y a Psilander a custodia. El resultado tactico no se presenta como una guerra abierta entre ambos Estados: la senal sueca de socorro permitio detener el combate sin aceptar formalmente el saludo exigido, y el buque, la tripulacion y los mercantes fueron liberados posteriormente.",
    consequences: "El incidente no derivo en una declaracion de guerra entre Inglaterra y Suecia. Ambos gobiernos procuraron resolverlo sin deteriorar la relacion bilateral; Oland recibio reparaciones provisionales, pero encallo frente a Skagen al regresar a Suecia en enero de 1705. La ficha evita atribuirlo sin matices a una guerra mayor en la que Inglaterra y Suecia no eran beligerantes directos entre si.",
    chronology: [
      {
        year: 1704,
        event: "Oland salio en una mision de escolta para proteger mercantes suecos en su ruta hacia Europa occidental."
      },
      {
        year: 1704,
        event: "El 27 de julio segun el calendario juliano ingles, 28 de julio segun el calendario sueco y 7 de agosto segun el gregoriano, la escuadra inglesa intercepto el convoy frente a Orford Ness."
      },
      {
        year: 1704,
        event: "Tras mas de cuatro horas bajo el fuego de ocho navios de linea y una fragata inglesa, Psilander uso una senal de socorro; Oland fue llevado a custodia y su comandante quedo prisionero temporalmente."
      },
      {
        year: 1705,
        event: "Despues de la liberacion y de reparaciones provisionales, Oland encallo frente a Skagen durante el regreso; se salvo la mayor parte de la tripulacion y parte del equipo."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Gustaf von Psilander", "William Whetstone", "Oland", "Orford Ness", "saludo naval"],
    participants: [
      {
        side: "Escuadra inglesa de Whetstone",
        members: ["Reino de Inglaterra", "Royal Navy", "contraalmirante William Whetstone", "ocho navios de linea y una fragata"],
        casualties: "No se fija un total bilateral. Los registros oficiales usados permiten reconstruir la accion, pero no aportan una tabla unica y comparable de bajas inglesas y suecas."
      },
      {
        side: "Convoy sueco escoltado por Oland",
        members: ["Reino de Suecia", "Marina sueca", "Gustaf von Psilander", "navio Oland", "convoy mercante sueco"],
        casualties: "La sintesis archivistica sueca registra muertos y heridos de Oland, pero GeoRisk no fija un total bilateral sin una fuente equivalente para la escuadra inglesa ni mezcla bajas de combate con la posterior perdida del buque."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "27 de julio de 1704 en el calendario juliano ingles; 28 de julio en el sueco; 7 de agosto en el calendario gregoriano",
    sourceDispute: "La bibliografia usa tres fechas equivalentes por el desfase de calendarios: 27 de julio en Inglaterra, 28 de julio segun el computo sueco y 7 de agosto en el calendario gregoriano. Historic England tambien aclara que Inglaterra y Suecia no estaban en guerra entre si; por eso GeoRisk no coloca el combate bajo la Gran Guerra del Norte ni la Guerra de Sucesion Espanola. Se conserva como incidente naval anglo-sueco, con la escolta comercial de 1704 como contexto organizativo. Los relatos difieren en la forma de resumir la rendicion, las bajas inglesas y si la accion merece la etiqueta de victoria; la ficha conserva la captura temporal, la liberacion posterior y los limites documentales.",
    curationPriority: "alta",
    curationBatch: "source-backed-orford-ness-1704-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior no tenia fecha, ubicacion, contraparte ni jerarquia verificable y quedaba bajo Conflicto regional de Europa. Se normaliza como Batalla naval de Orford Ness (1704), se asocia a la disputa de saludo naval y se conecta con Suecia y Reino Unido para navegacion contemporanea. Reino Unido representa la referencia geografica e institucional actual de Inglaterra, no una equivalencia constitucional de 1704."
  };
}

export const ORFORD_NESS_1704_CONFLICT_RENAMES = {
  "Batalla de Orford Ness": CANONICAL,
  "Batalla naval de Orford Ness": CANONICAL,
  "Batalla naval de Orford Ness (1704)": CANONICAL,
  "Battle of Orford Ness": CANONICAL,
  "Battle of Orford Ness (1704)": CANONICAL,
  "Slaget vid Orford Ness": CANONICAL,
  "Slaget vid Orfordness": CANONICAL
};

export const ORFORD_NESS_1704_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL]
};

export const ORFORD_NESS_1704_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: orfordNess1704Fix()
};
