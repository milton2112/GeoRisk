const NAME = "Acciones navales frente a Kasumi (1945)";
const WAR = "Segunda Guerra Mundial";
const CAMPAIGN = "Operaciones submarinas aliadas en el mar de Japón (1945)";

const SOURCES = [
  {
    label: "Comando de Historia y Patrimonio Naval de EE. UU.: acciones de USS Torsk frente a Kasumi Ko el 14 de agosto de 1945",
    url: "https://www.history.navy.mil/research/histories/ship-histories/danfs/t/torsk.html"
  },
  {
    label: "Comando de Historia y Patrimonio Naval de EE. UU., H-Gram 051-1: hundimiento de CD-47 y CD-13 por USS Torsk",
    url: "https://www.history.navy.mil/about-us/leadership/director/directors-corner/h-grams/h-gram-051/h-051-1.html"
  }
];

export const KASUMI_CONFLICT_RENAMES = {
  "Batalla de Kasumi": NAME,
  "Battle of Kasumi": NAME
};

export const KASUMI_COUNTRY_CONFLICT_ADDITIONS = {
  "Japón": [NAME]
};

export const KASUMI_CONFLICT_DETAIL_FIXES = {
  [NAME]: {
    parent: WAR,
    war: WAR,
    campaign: CAMPAIGN,
    related: [WAR, CAMPAIGN, "Guerra del Pacífico de la Segunda Guerra Mundial", "USS Torsk", "CD-47", "CD-13"],
    type: "acción naval",
    conflictType: "interestatal",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1945,
    endYear: 1945,
    datePrecision: "14 de agosto de 1945",
    region: "Frente a Kasumi Ko, costa occidental de Honshu, Japón",
    normalizedRegion: "Frente a Kasumi Ko, costa occidental de Honshu, Japón",
    cause: "Durante una patrulla en el mar de Japón, el submarino USS Torsk atacó al escolta CD-47 que acompañaba a un mercante; otro escolta japonés, CD-13, acudió después al área.",
    outcome: "El Torsk hundió CD-47 y luego CD-13. El ataque posterior contra el mercante no tuvo éxito; el buque entró en puerto.",
    consequences: "El Comando de Historia y Patrimonio Naval de EE. UU. identifica a CD-13 como el último buque de guerra japonés hundido durante la Segunda Guerra Mundial.",
    participants: [
      {
        side: "Marina de los Estados Unidos",
        members: ["Estados Unidos", "USS Torsk"],
        casualties: "Las fuentes consultadas no indican bajas estadounidenses en estas acciones."
      },
      {
        side: "Marina Imperial Japonesa",
        members: ["Japón", "CD-47", "CD-13"],
        casualties: "NHHC registra 28 tripulantes perdidos en CD-13; las fuentes consultadas no precisan el total de pérdidas de CD-47."
      }
    ],
    chronology: [
      {
        year: 1945,
        event: "A las 10:35 del 14 de agosto, el Torsk lanzó un torpedo acústico experimental que hundió CD-47; el mercante escapó al intento posterior de ataque."
      },
      {
        year: 1945,
        event: "Alrededor del mediodía, el Torsk atacó al escolta CD-13, que se hundió tras recibir dos impactos de torpedo; NHHC registra 28 tripulantes perdidos."
      }
    ],
    treaties: [],
    hierarchyConfidence: "alta",
    hierarchySources: SOURCES,
    sourceDispute: "DANFS describe el encuentro cuando los buques se aproximaban a Kasumi Ko; el H-Gram de NHHC sitúa la patrulla frente a Maizuru y no aporta coordenadas exactas. La ficha conserva una ubicación costera amplia.",
    curationPriority: "alta",
    curationBatch: "source-backed-kasumi-1945-2026-11",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Se reemplaza la etiqueta importada «Batalla de Kasumi» por «Acciones navales» porque las fuentes describen dos ataques separados del USS Torsk el 14 de agosto de 1945, sin establecer un nombre formal de batalla. La campaña indicada es descriptiva. Las fuentes discrepan en la referencia geográfica de detalle (Kasumi Ko o el área de Maizuru); no se fijan coordenadas. Se atribuyen a NHHC las 28 pérdidas de CD-13 y no se extrapola un total para CD-47. El mercante no fue hundido."
  }
};
