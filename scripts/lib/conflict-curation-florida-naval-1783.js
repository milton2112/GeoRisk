const NAME = "Acción naval del Alliance y el Sybil (10 de marzo de 1783)";
const PARENT = "Guerra de Independencia de Estados Unidos";
const REGION = "Aguas atlánticas frente a la costa este de Florida";

const SOURCES = [
  {
    label: "Florida Department of State, marcador histórico «The Last Naval Battle of the American Revolutionary War»: fecha la acción el 10 de marzo de 1783, nombra los buques continentales Alliance y Duc de Lauzun y describe el enfrentamiento con Sybil.",
    url: "https://apps.flheritage.com/markers/markerDetail.cfm?city=&county=&id=664&keyword="
  },
  {
    label: "Florida Historical Society, «Revising local history», 15 de noviembre de 2017: documenta la discrepancia sobre el punto frente a Florida; la lectura de los papeles de John Barry sitúa la acción más de 140 millas al sureste de Cape Canaveral.",
    url: "https://myfloridahistory.org/frontiers/article/185"
  },
  {
    label: "Bob Ruppert, Journal of the American Revolution, «The Sea Battle that Paid Off for the Continental Army»: coteja relatos y registros de los capitanes; registra cifras incompatibles de bajas británicas para Sybil.",
    url: "https://allthingsliberty.com/2018/11/the-sea-battle-that-paid-off-for-the-continental-army/"
  }
];

export const FLORIDA_NAVAL_1783_CONFLICT_RENAMES = {
  "Accion naval del Alliance y el Sybil (10 de marzo de 1783)": NAME,
  "Combat off coast de Florida": NAME,
  "combat off the coast of Florida": NAME,
  "Combate frente a la costa de Florida": NAME,
  "Combat off the coast of Florida": NAME
};

export const FLORIDA_NAVAL_1783_COUNTRY_CONFLICT_ADDITIONS = { "Reino Unido": [NAME] };

export const FLORIDA_NAVAL_1783_CONFLICT_POST_MERGE_OVERRIDES = {
  [NAME]: ["campaign"]
};

export const FLORIDA_NAVAL_1783_CONFLICT_DETAIL_FIXES = {
  [NAME]: {
    parent: PARENT,
    war: PARENT,
    campaign: undefined,
    related: [PARENT, "Alliance", "Sybil", "Duc de Lauzun", "John Barry", "John Green"],
    type: "combate naval",
    conflictType: "independencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1783,
    endYear: 1783,
    startDay: "1783-03-10",
    endDay: "1783-03-10",
    datePrecision: "10 de marzo de 1783, según el marcador histórico del Departamento de Estado de Florida y los relatos navales consultados.",
    region: REGION,
    normalizedRegion: REGION,
    cause: "La Royal Navy interceptó frente a Florida a los buques continentales Alliance y Duc de Lauzun, que navegaban desde La Habana hacia Filadelfia con plata destinada al Congreso Continental.",
    outcome: "El Alliance se interpuso para proteger al Duc de Lauzun y, tras el combate con el Sybil, este se retiró. Los buques continentales continuaron su viaje.",
    consequences: "Ambos buques llegaron a puertos estadounidenses. El Duc de Lauzun alcanzó Filadelfia y el Alliance llegó a Newport con la plata que llevaba para el Congreso Continental.",
    participants: [
      {
        side: "Marina Continental",
        members: ["Alliance", "Duc de Lauzun"],
        casualties: "El registro del Alliance citado por Ruppert consigna 1 muerto y 9 heridos; no se atribuye una cifra conjunta a los dos buques."
      },
      {
        side: "Royal Navy",
        members: ["Sybil", "Alarm", "Tobago"],
        casualties: "Para el Sybil, el parte del capitán Vashon citado por Ruppert da 2 muertos y 6 heridos; un informe naval de Jamaica citado allí da 37 muertos y 40 heridos. La discrepancia queda sin resolver."
      }
    ],
    chronology: [
      {
        year: 1783,
        event: "10 de marzo: los buques británicos dieron alcance a los barcos continentales frente a la costa de Florida; el Alliance combatió con el Sybil para cubrir al Duc de Lauzun."
      },
      {
        year: 1783,
        event: "En marzo, el Duc de Lauzun llegó a Filadelfia. El Alliance entró en Newport el día 20."
      }
    ],
    treaties: [],
    hierarchyConfidence: "alta",
    hierarchySources: SOURCES,
    sourceDispute: "El marcador oficial de Florida ubica la acción frente a Cape Canaveral; la Florida Historical Society, al revisar las referencias a los papeles de John Barry, advierte que estas apuntan a más de 140 millas al sureste, cerca de West Palm Beach y Boca Raton. No se fija una distancia o coordenada exacta. Para las bajas del Sybil, las fuentes citadas por Ruppert discrepan entre 2 muertos y 6 heridos (parte del capitán Vashon) y 37 muertos y 40 heridos (informe naval de Jamaica); no se consolidan.",
    curationPriority: "alta",
    curationBatch: "source-backed-florida-naval-action-1783-2026-11",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Se sustituye el rótulo geográfico genérico por la acción naval documentada el 10 de marzo de 1783 y se enlaza con la Guerra de Independencia de Estados Unidos. La entrada raw se conserva; la ubicación exacta y las cifras de bajas discrepantes permanecen explícitas, y no se inventa una campaña formal."
  }
};
