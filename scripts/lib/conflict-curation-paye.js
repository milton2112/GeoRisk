const name = "Batalla de Paye (1900)";
const parent = "Guerra filipino-estadounidense";
const region = "Paye, Balimbing, Boac, Marinduque, Filipinas, Asia sudoriental";

export const PAYE_CONFLICT_RENAMES = {
  "Batalla de Paye": name,
  "Battle of Paye": name,
  "Labanan sa Paye": name
};

export const PAYE_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [name],
  Filipinas: [name]
};

export const PAYE_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent, war: parent, campaign: "Operaciones en Marinduque (1900)", related: [parent],
    startYear: 1900, endYear: 1900, datePrecision: "31 de julio de 1900",
    type: "batalla", conflictType: "colonial", scale: "local",
    status: "historico", active: false, ongoing: false,
    region, normalizedRegion: region,
    cause: "Resistencia filipina al establecimiento del dominio colonial estadounidense. La acci\u00f3n pertenece a la fase guerrillera de la guerra; las fuentes citadas no precisan un desencadenante local adicional.",
    outcome: "El marcador del NHCP atribuye la victoria a la unidad guerrillera filipina de Teofilo Roque frente a la compa\u00f1\u00eda estadounidense de William S. Wells, Jr.",
    consequences: "El NHCP registra tambi\u00e9n un civil ingl\u00e9s capturado, separado de los militares. Fue un episodio local, no el cierre de la guerra ni la independencia de Filipinas.",
    participants: [
      {
        side: "Fuerzas estadounidenses",
        members: ["Estados Unidos", "Compa\u00f1\u00eda A, 29.\u00ba de Infanter\u00eda de Voluntarios", "William S. Wells, Jr."],
        casualties: "NHCP: 2 cabos estadounidenses capturados; no proporciona un total de muertos o heridos, lo que no equivale a cero"
      },
      {
        side: "Fuerza revolucionaria filipina de Marinduque",
        members: ["Filipinas", "Segunda unidad guerrillera de la fuerza revolucionaria de Marinduque", "Teofilo Roque"],
        casualties: "Sin recuento consolidado de muertos, heridos o capturados en las fuentes citadas; no equivale a cero"
      }
    ],
    chronology: [{ year: 1900, event: "El 31 de julio se enfrentaron las fuerzas filipinas y estadounidenses en Paye, Boac." }],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      { label: "NHCP, registro Labanan sa Paye: lugar, fecha, unidades, mandos y capturados; marcador instalado en 2000", url: "https://philhistoricsites.nhcp.gov.ph/registry_database/labanan-sa-paye/" },
      { label: "Proclamaci\u00f3n 340 del 12 de julio de 2000, transcripci\u00f3n de Lawphil: centenario de la batalla de 1900", url: "https://lawphil.net/executive/proc/proc2000/proc_340_2000.html" },
      { label: "Office of the Historian, The Philippine-American War, 1899-1902: contexto colonial y fase guerrillera; ensayo archivado", url: "https://history.state.gov/milestones/1899-1913/war" }
    ],
    sourceDispute: "El marcador del NHCP llama a Paye el segundo combate de Marinduque; la Proclamaci\u00f3n 340 lo denomina el primero oficialmente registrado. Se conserva esa diferencia sin adjudicar un ordinal definitivo.",
    curationPriority: "alta", curationBatch: "source-backed-paye-2026-10",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "La fecha es 1900, no la instalaci\u00f3n del marcador en 2000. No se confunde con San Mateo (1899). La campa\u00f1a es descriptiva; Filipinas vincula el territorio y su fuerza revolucionaria, no el gobierno actual. Las fuentes discrepan sobre primer/segundo combate de la isla. El civil ingl\u00e9s capturado no hace del Reino Unido un bando militar. No se inventan totales de bajas ni un tratado."
  }
};
