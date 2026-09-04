function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Ty-ho Bay (4 de agosto de 1855)";
const PARENT = "Operaciones antipirater\u00eda anglo-estadounidenses en el mar de China Meridional (1855)";
const CAMPAIGN = "Operaci\u00f3n de rescate de mercantes en Ty-ho Bay (agosto de 1855)";

const SOURCES = {
  navalHistoryHeritageCommand: source(
    "Naval History and Heritage Command: s\u00edntesis institucional de la Marina de Estados Unidos sobre Ty-ho Bay, con fecha, buques, fuerza combinada, resultado y bajas aproximadas",
    "https://www.history.navy.mil/about-us/leadership/director/directors-corner/h-grams/h-gram-062.html"
  ),
  marineCorpsHistoricalRecord: source(
    "U.S. Marine Corps: registro hist\u00f3rico digitalizado de los desembarcos de 1800-1934, con el destacamento de la USS Powhatan, los botes brit\u00e1nicos y el combate del 4 de agosto de 1855",
    "https://www.marines.mil/Portals/1/Publications/One%20Hundred%20Eighty%20Landings%20of%20United%20States%20Marines%201800-1934%2019000305500_1.pdf"
  )
};

function tyHoBay1855Fix() {
  const hierarchySources = [
    SOURCES.navalHistoryHeritageCommand,
    SOURCES.marineCorpsHistoricalRecord
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla naval antipirater\u00eda",
    conflictType: "pirateria",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1855,
    endYear: 1855,
    region: "Ty-ho Bay, isla de Lantau, actual Hong Kong, China; la denominaci\u00f3n y ubicaci\u00f3n siguen la s\u00edntesis de Naval History and Heritage Command",
    normalizedRegion: "Ty-ho Bay, isla de Lantau, actual Hong Kong, China; la denominaci\u00f3n y ubicaci\u00f3n siguen la s\u00edntesis de Naval History and Heritage Command",
    cause: "En agosto de 1855, una fuerza pirata activa alrededor de Hong Kong hab\u00eda capturado mercantes. La documentaci\u00f3n de la Marina de Estados Unidos registra que fuerzas estadounidenses y brit\u00e1nicas organizaron una acci\u00f3n de rescate; no presenta al Estado Qing ni a la poblaci\u00f3n china como un bando homog\u00e9neo.",
    outcome: "El 4 de agosto, los botes remolcados por HMS Eaglet alcanzaron la flota pirata en Ty-ho Bay. Naval History and Heritage Command registra que catorce juncos grandes y seis peque\u00f1os fueron hundidos o incendiados, alrededor de mil personas fueron capturadas y diecis\u00e9is juncos peque\u00f1os escaparon. La ficha conserva esas cifras como estimaciones de la fuente, no como un recuento independiente cerrado.",
    consequences: "La s\u00edntesis naval estadounidense describe Ty-ho Bay como una de las \u00faltimas grandes batallas campales entre flotas piratas chinas y marinas occidentales, y como una temprana operaci\u00f3n combinada estadounidense-brit\u00e1nica. No se atribuye al combate, por s\u00ed solo, el fin de toda la pirater\u00eda regional ni un cambio diplom\u00e1tico general en China.",
    chronology: [
      {
        year: 1855,
        event: "En agosto, HMS Eaglet remolc\u00f3 seis botes con unos cien marines y marineros estadounidenses y un n\u00famero aproximadamente equivalente de brit\u00e1nicos hacia las aguas poco profundas de Ty-ho Bay."
      },
      {
        year: 1855,
        event: "El 4 de agosto, la fuerza combinada atac\u00f3 la flota pirata en Ty-ho Bay, isla de Lantau, despu\u00e9s de que USS Powhatan y HMS Rattler no pudieran entrar en la bah\u00eda por su escasa profundidad."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "USS Powhatan",
      "HMS Rattler",
      "HMS Eaglet",
      "Lantau",
      "Hong Kong"
    ],
    participants: [
      {
        side: "Fuerza naval brit\u00e1nica y estadounidense",
        members: [
          "Estados Unidos",
          "Reino Unido",
          "USS Powhatan",
          "HMS Rattler",
          "HMS Eaglet",
          "Marines y marineros estadounidenses",
          "Marines y marineros brit\u00e1nicos"
        ],
        casualties: "Naval History and Heritage Command registra cinco estadounidenses muertos y seis heridos; cuatro brit\u00e1nicos muertos y varios heridos."
      },
      {
        side: "Flota pirata en Ty-ho Bay",
        members: [
          "Flota pirata china",
          "Juncos armados piratas"
        ],
        casualties: "La s\u00edntesis naval estadounidense estima unas quinientas personas muertas, ahogadas o heridas y alrededor de mil capturadas; la ficha no trata esas estimaciones como una contabilidad independiente ni atribuye la flota al Estado Qing."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "4 de agosto de 1855; la fecha diaria aparece de forma expresa en las dos fuentes institucionales estadounidenses consultadas.",
    sourceDispute: "Las dos fuentes institucionales estadounidenses coinciden en la fecha, la participaci\u00f3n de USS Powhatan, HMS Rattler y HMS Eaglet, y el resultado general. El registro hist\u00f3rico del Cuerpo de Marines usa un lenguaje de \u00e9poca sobre China y sus autoridades; GeoRisk lo trata como la perspectiva documental estadounidense, no como una caracterizaci\u00f3n de la poblaci\u00f3n china ni como prueba de que el Estado Qing fuera un beligerante directo.",
    curationPriority: "alta",
    curationBatch: "source-backed-ty-ho-bay-1855-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa quedaba en un conflicto regional de Am\u00e9rica, sin fecha, jerarqu\u00eda ni ubicaci\u00f3n verificable. Se normaliza como Batalla de Ty-ho Bay (4 de agosto de 1855), una acci\u00f3n naval antipirater\u00eda en Lantau, actual Hong Kong. Reino Unido se vincula por participaci\u00f3n directa y la Rep\u00fablica Popular China solo como referencia geogr\u00e1fica contempor\u00e1nea: la ficha no convierte a China en bando estatal, ni fusiona a la poblaci\u00f3n local con la fuerza pirata. La jerarqu\u00eda de operaciones antipirater\u00eda es una agrupaci\u00f3n editorial de GeoRisk para ordenar el episodio, no el t\u00edtulo formal de una guerra citado literalmente por las fuentes."
  };
}

export const TY_HO_BAY_1855_CONFLICT_RENAMES = {
  "Batalla de Ty-ho Bay": CANONICAL,
  "Batalla de Ty Ho Bay": CANONICAL,
  "Battle of Ty-ho Bay": CANONICAL,
  "Battle of Ty Ho Bay": CANONICAL
};

export const TY_HO_BAY_1855_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL],
  "Rep\u00fablica Popular China": [CANONICAL]
};

export const TY_HO_BAY_1855_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: tyHoBay1855Fix()
};
