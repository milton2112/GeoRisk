function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combates navales de Westtief y el Greifswalder Bodden (julio-agosto de 1712)";
const PARENT = "Gran Guerra del Norte";
const CAMPAIGN = "Operaciones danesas contra Stralsund y R\u00fcgen (1712)";

const SOURCES = {
  barfodStudy: source(
    "J\u00f8rgen H. Barfod, estudio de la Danish Maritime History Society: diario naval conservado en el Rigsarkivet sobre los combates de Westtief, el paso por Osttief y la llegada danesa a Greifswald",
    "https://www.marinehist.dk/MHS-udgivelser/MHS27.pdf",
    "media"
  ),
  greatNorthernWarCollection: source(
    "Bidrag til den Store Nordiske Krigs Historie, coleccion documental naval: operaciones de Sehested, resistencia sueca en Westtief y maniobra danesa por Osttief",
    "https://www.marinehist.dk/orlogsbib/SNK/SNK-bind4.pdf",
    "media"
  ),
  sehestedStudy: source(
    "Admiral C. T. Sehesteds Saga, estudio historico sobre la operacion naval danesa de 1712 y su apoyo al frente de Stralsund",
    "https://www.marinehist.dk/orlogsbib/SEHESTED.pdf",
    "media"
  )
};

function westtief1712Fix() {
  const hierarchySources = [
    SOURCES.barfodStudy,
    SOURCES.greatNorthernWarCollection,
    SOURCES.sehestedStudy
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combates navales",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1712,
    endYear: 1712,
    region: "Westtief y Greifswalder Bodden, frente a R\u00fcgen y la Pomerania sueca, actual Alemania",
    normalizedRegion: "Greifswalder Bodden, Alemania",
    cause: "Durante la Gran Guerra del Norte, Dinamarca-Noruega necesitaba abrir los pasos someros entre R\u00fcgen y el continente para sostener la presion aliada sobre Stralsund y limitar el abastecimiento sueco. La flotilla sueca defendia Westtief, uno de los canales de acceso al Greifswalder Bodden.",
    outcome: "Ventaja operacional danesa-noruega: la resistencia sueca en Westtief no impidio la maniobra danesa por Osttief. Las fuentes danesas sit\u00faan despues a la escuadra y los transportes de grano en la rada danesa de Greifswald, mientras las fuerzas suecas se replegaron hacia Palmer Ort. GeoRisk lo presenta como una serie de acciones y maniobras, no como una batalla unica y decisiva.",
    consequences: "El acceso al Bodden permitio a Dinamarca-Noruega mover artilleria y abastecimientos hacia el frente de Stralsund y dificulto la conexion sueca con sus posiciones en Pomerania. La Gran Guerra del Norte y las operaciones contra Stralsund continuaron; este episodio no constituyo un cierre independiente del conflicto.",
    chronology: [
      {
        year: 1712,
        event: "A fines de julio, la flotilla de Christian Thomesen Sehested se presento frente a los pasos de R\u00fcgen para apoyar la presion aliada sobre Stralsund."
      },
      {
        year: 1712,
        event: "Los intentos daneses de abrir Westtief encontraron una resistencia sueca fuerte y causaron perdidas locales en los buques que entraron en el canal."
      },
      {
        year: 1712,
        event: "El 2 de agosto, Sehested ordeno una accion sobre Westtief mientras una parte de la fuerza maniobraba por Osttief; la defensa sueca se replego hacia Palmer Ort."
      },
      {
        year: 1712,
        event: "El 6 de agosto, la escuadra danesa y los transportes de grano alcanzaron la rada danesa frente a Greifswald, lo que abrio apoyo logistico para el frente de Stralsund."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Stralsund",
      "R\u00fcgen",
      "Greifswald",
      "Westtief",
      "Osttief",
      "Christian Thomesen Sehested",
      "Michael Henck"
    ],
    participants: [
      {
        side: "Fuerzas navales de Dinamarca-Noruega",
        members: [
          "Monarquia de Dinamarca-Noruega",
          "flotilla danesa-noruega",
          "Christian Thomesen Sehested",
          "buques y transportes daneses empleados en los pasos de R\u00fcgen"
        ],
        casualties: "Las fuentes danesas registran perdidas en acciones concretas dentro de Westtief, pero no ofrecen un balance bilateral consolidado para toda la serie. GeoRisk no publica una cifra total."
      },
      {
        side: "Fuerzas navales del Imperio sueco",
        members: [
          "Imperio sueco",
          "flotilla sueca",
          "Michael Henck",
          "defensas suecas de Westtief y Palmer Ort"
        ],
        casualties: "Las fuentes consultadas no ofrecen una cifra sueca consolidada y comparable para el conjunto de los combates. GeoRisk no infiere bajas a partir de los partes daneses."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "Entre fines de julio y los primeros dias de agosto de 1712: Westtief nombra tanto el canal de la primera resistencia como una serie de combates y maniobras en el Greifswalder Bodden. Las fuentes revisadas no justifican reducir la ficha a un solo dia o a una unica batalla.",
    sourceDispute: "La diferencia principal es de alcance y denominacion: algunas referencias rotulan una accion de Westtief, mientras la documentacion naval danesa describe varios dias de intentos de paso, resistencia, una maniobra por Osttief y operaciones posteriores frente a Greifswald. Por ello GeoRisk conserva un titulo plural y un intervalo temporal, evita atribuir un unico dia decisivo y no consolida bajas sin una fuente bilateral equivalente.",
    curationPriority: "alta",
    curationBatch: "source-backed-westtief-1712-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Las entradas anteriores Battle of Westtief y Naval battles in the Greifswalder Bodden figuraban separadas, con una jerarquia generica o incompleta y sin ficha de bandos, lugar o fuentes. Se consolidan como una sola serie de combates dentro de la Gran Guerra del Norte y se incorporan Dinamarca, Suecia y Alemania para navegacion historica y geografica. La entrada Naval battle off R\u00fcgen no se fusiona: puede aludir a otra accion naval de 1712 y requiere curaduria independiente."
  };
}

export const WESTTIEF_1712_CONFLICT_RENAMES = {
  "Battle of Westtief": CANONICAL,
  "Batalla de Westtief": CANONICAL,
  "Slaget i Westtief": CANONICAL,
  "Naval battles in the Greifswalder Bodden": CANONICAL,
  "Naval battles of the Greifswalder Bodden": CANONICAL,
  "Batallas navales en Greifswalder Bodden": CANONICAL,
  "Seegefechte im Greifswalder Bodden (1712)": CANONICAL
};

export const WESTTIEF_1712_COUNTRY_CONFLICT_ADDITIONS = {
  Dinamarca: [CANONICAL],
  Suecia: [CANONICAL],
  Alemania: [CANONICAL]
};

export const WESTTIEF_1712_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: westtief1712Fix()
};
