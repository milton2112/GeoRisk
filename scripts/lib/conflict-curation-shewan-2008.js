function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Shewan (8 de agosto de 2008)";
const PARENT = "Guerra de Afganist\u00e1n";
const CAMPAIGN = "Operaciones de contrainsurgencia en Farah (2008)";

const SOURCES = {
  headquartersMarineCorps: source(
    "Headquarters Marine Corps: combate de todo el d\u00eda el 8 de agosto de 2008 en Shewan, participaci\u00f3n de Marines y Polic\u00eda Nacional Afgana, posiciones talibanes en la ruta 517 y resultado t\u00e1ctico descrito por la fuerza estadounidense",
    "https://www.hqmc.marines.mil/News/Article/Article/553010/recon-marine-awarded-navy-cross-for-thriving-in-heavy-combat/"
  ),
  marineCorpsUniversity: source(
    "Marine Corps University: antolog\u00eda institucional que documenta la batalla de Shewan del 8 de agosto de 2008 en el suroeste de Afganist\u00e1n, la fuerza de reconocimiento y su coordinaci\u00f3n con el 2.\u00ba Batall\u00f3n, 7.\u00ba Regimiento de Marines",
    "https://www.usmcu.edu/Portals/218/US%20Marines%20in%20Afghanistan%20Anthology.pdf"
  )
};

function shewan2008Fix() {
  const hierarchySources = [SOURCES.headquartersMarineCorps, SOURCES.marineCorpsUniversity];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla",
    conflictType: "insurgencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 2008,
    endYear: 2008,
    region: "Shewan, distrito de Bala Buluk, provincia de Farah, Afganist\u00e1n",
    normalizedRegion: "Shewan, distrito de Bala Buluk, provincia de Farah, Afganist\u00e1n",
    cause: "Fuerzas estadounidenses y la Polic\u00eda Nacional Afgana entraron en Shewan para disputar el control talib\u00e1n del poblado y de la ruta 517, un corredor de abastecimiento regional. La operaci\u00f3n buscaba permitir una presencia de seguridad afgana sostenida en la zona.",
    outcome: "Seg\u00fan el relato institucional del Cuerpo de Marines de Estados Unidos, los Marines y la Polic\u00eda Nacional Afgana expulsaron a los combatientes talibanes de posiciones fortificadas y recuperaron el control de la ruta. La ficha lo registra como una victoria t\u00e1ctica de la coalici\u00f3n, sin inferir un resultado duradero para la guerra en su conjunto.",
    consequences: "El combate restableci\u00f3 temporalmente la libertad de movimiento de la coalici\u00f3n y de las fuerzas afganas en torno a Shewan. La acci\u00f3n fue citada posteriormente en reconocimientos por valor a integrantes de la fuerza de reconocimiento y del 2.\u00ba Batall\u00f3n, 7.\u00ba Regimiento de Marines.",
    chronology: [
      {
        year: 2008,
        event: "Antes del 8 de agosto, las fuerzas estadounidenses prepararon una operaci\u00f3n para entrar en Shewan y disputar posiciones talibanes cercanas a la ruta 517."
      },
      {
        year: 2008,
        event: "El 8 de agosto, una fuerza de reconocimiento, elementos de la Compa\u00f1\u00eda G del 2.\u00ba Batall\u00f3n, 7.\u00ba Regimiento de Marines y la Polic\u00eda Nacional Afgana recibieron fuego talib\u00e1n durante una patrulla en Shewan."
      },
      {
        year: 2008,
        event: "Tras un combate que se prolong\u00f3 hasta el anochecer, apoyo de morteros y ataques a\u00e9reos, la fuerza de la coalici\u00f3n desaloj\u00f3 las posiciones fortificadas descritas por las fuentes militares estadounidenses."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Operaci\u00f3n Libertad Duradera",
      "Shewan",
      "Distrito de Bala Buluk",
      "Provincia de Farah",
      "2.\u00ba Batall\u00f3n, 7.\u00ba Regimiento de Marines",
      "Polic\u00eda Nacional Afgana",
      "Talib\u00e1n"
    ],
    participants: [
      {
        side: "Fuerza estadounidense y Polic\u00eda Nacional Afgana",
        members: [
          "Estados Unidos",
          "Afganist\u00e1n",
          "2.\u00ba Batall\u00f3n, 7.\u00ba Regimiento de Marines",
          "Pelot\u00f3n de reconocimiento de la Fuerza de Reconocimiento de Marines",
          "Compa\u00f1\u00eda G del 2.\u00ba Batall\u00f3n, 7.\u00ba Regimiento de Marines",
          "Polic\u00eda Nacional Afgana"
        ],
        casualties: "Las fuentes institucionales se\u00f1alan que no hubo muertes estadounidenses en el combate. No consolidan un balance completo de heridos ni de bajas de la Polic\u00eda Nacional Afgana, por lo que la ficha no publica una cifra total de este bando."
      },
      {
        side: "Insurgencia talib\u00e1n",
        members: [
          "Combatientes talibanes en Shewan y posiciones fortificadas junto a la ruta 517"
        ],
        casualties: "Headquarters Marine Corps inform\u00f3 m\u00e1s de cincuenta combatientes talibanes muertos y otros heridos. Es una cifra del parte estadounidense; no se presenta como un recuento independiente ni como un total definitivo."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "8 de agosto de 2008; Headquarters Marine Corps y Marine Corps University sit\u00faan el combate de todo el d\u00eda en Shewan, Afganist\u00e1n, en esa fecha.",
    sourceDispute: "La fuerza estadounidense estim\u00f3 entre aproximadamente 250 y 500 combatientes talibanes y comunic\u00f3 m\u00e1s de cincuenta muertes insurgentes. Esas cifras proceden del relato institucional estadounidense y no cuentan con un recuento independiente conciliado; por eso la ficha distingue entre el resultado t\u00e1ctico documentado y los balances de bajas no verificables de forma externa.",
    curationPriority: "alta",
    curationBatch: "source-backed-shewan-2008-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa aparec\u00eda como una batalla de Am\u00e9rica sin fecha, guerra padre ni referencia a Afganist\u00e1n. Se normaliza como una batalla local de la Guerra de Afganist\u00e1n y se enlaza desde Estados Unidos y Afganist\u00e1n por participaci\u00f3n directa. La agrupaci\u00f3n Operaciones de contrainsurgencia en Farah (2008) es una categor\u00eda operativa de GeoRisk para ordenar el combate local, no el nombre de una campa\u00f1a oficial atribuido por las fuentes."
  };
}

export const SHEWAN_2008_CONFLICT_RENAMES = {
  "Batalla de Shewan": CANONICAL,
  "Battle of Shewan": CANONICAL,
  "Shewan": CANONICAL
};

export const SHEWAN_2008_COUNTRY_CONFLICT_ADDITIONS = {
  "Afganist\u00e1n": [CANONICAL]
};

export const SHEWAN_2008_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: shewan2008Fix()
};
