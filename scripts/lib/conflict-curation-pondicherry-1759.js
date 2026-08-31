function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval de Pondicherry (1759)";
const PARENT = "Guerra de los Siete A\u00f1os (1756-1763)";
const CAMPAIGN = "Operaciones navales franco-brit\u00e1nicas en la costa de Coromandel (1759)";

const SOURCES = {
  britishLibraryOrmeVolume: source(
    "British Library, Mss Eur Orme OV.32: relato, l\u00edneas de batalla inglesa y francesa y partes de la acci\u00f3n del 10 de septiembre de 1759 entre la escuadra de George Pocock y la francesa de once buques",
    "https://searcharchives.bl.uk/catalog/040-003413433"
  ),
  britishLibraryOrmeIndia: source(
    "British Library, Mss Eur Orme India XI: minutos tomados a bordo de Revenge y l\u00ednea de batalla inglesa y francesa del 10 de septiembre de 1759, a la vista de la se\u00f1al de Tranquebar",
    "https://searcharchives.bl.uk/catalog/040-003394110"
  ),
  nationalArmyMuseum: source(
    "National Army Museum: expansi\u00f3n de la Guerra de los Siete A\u00f1os a la lucha franco-brit\u00e1nica en India, operaciones posteriores en el Carnatic, rendici\u00f3n de Pondicherry en 1761 y Tratado de Paris de 1763",
    "https://www.nam.ac.uk/explore/seven-years-war"
  )
};

function pondicherry1759Fix() {
  const hierarchySources = [
    SOURCES.britishLibraryOrmeVolume,
    SOURCES.britishLibraryOrmeIndia,
    SOURCES.nationalArmyMuseum
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla naval",
    conflictType: "colonial",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1759,
    endYear: 1759,
    region: "Costa de Coromandel, frente a Pondicherry y a la altura de Tranquebar, India",
    normalizedRegion: "Costa de Coromandel, Tamil Nadu, India",
    cause: "La Guerra de los Siete A\u00f1os extendio la rivalidad franco-brit\u00e1nica a la India. En septiembre de 1759, la escuadra brit\u00e1nica de George Pocock y la francesa de Anne Antoine, conde d'Ach\u00e9, se enfrentaron en la costa de Coromandel mientras ambas potencias disputaban rutas mar\u00edtimas, refuerzos y posiciones en el sur de India.",
    outcome: "Resultado tactico no decisivo. Los documentos de la British Library conservan las lineas de batalla y partes de ambos bandos del 10 de septiembre, pero no respaldan una capitulacion de Pondicherry ni la destruccion de una escuadra. GeoRisk registra que la fuerza francesa continuo hacia Pondicherry sin convertir esa continuidad operativa en una victoria total ni fijar bajas agregadas no comparables.",
    consequences: "La accion no resolvio el control territorial del Carnatic. La lucha franco-britanica continuo: la victoria britanica de Wandiwash en 1760 y el posterior sitio conjunto de Pondicherry terminaron con la rendicion de la plaza en 1761. El Tratado de Paris de 1763 cerro el conflicto general, no una negociacion local de esta batalla.",
    chronology: [
      {
        year: 1756,
        event: "El inicio de la Guerra de los Siete A\u00f1os amplio la rivalidad franco-brit\u00e1nica y reforzo la dimensi\u00f3n militar de sus compa\u00f1ias y fuerzas en India."
      },
      {
        year: 1759,
        event: "El 10 de septiembre, los documentos conservados por la British Library registran la l\u00ednea de batalla inglesa de Pocock y la francesa de d'Ach\u00e9 en la costa de Coromandel."
      },
      {
        year: 1759,
        event: "La escuadra francesa continuo hacia Pondicherry; la ficha no confunde esta accion naval con la posterior toma o rendicion de la ciudad."
      },
      {
        year: 1760,
        event: "La victoria britanica de Wandiwash cambio el equilibrio terrestre del Carnatic."
      },
      {
        year: 1761,
        event: "Pondicherry se rindio tras un sitio conjunto terrestre y naval, un episodio distinto de la batalla naval de 1759."
      }
    ],
    treaties: ["Tratado de Paris (10 de febrero de 1763): cierre general de la Guerra de los Siete A\u00f1os"],
    related: [PARENT, CAMPAIGN, "George Pocock", "Anne Antoine, conde d'Ach\u00e9", "Pondicherry", "Tranquebar", "costa de Coromandel", "Batalla de Wandiwash", "Sitio de Pondicherry (1760-1761)"],
    participants: [
      {
        side: "Escuadra francesa de d'Ach\u00e9",
        members: ["Francia", "Marina francesa", "Compa\u00f1ia Francesa de las Indias Orientales", "Anne Antoine, conde d'Ach\u00e9", "escuadra francesa"],
        casualties: "Los catalogos archivisticos consultados conservan partes y formaciones de la accion, pero no una tabla bilateral unica y consistente de bajas. GeoRisk no publica un total frances sin una fuente comparable para ambos bandos."
      },
      {
        side: "Escuadra brit\u00e1nica de Pocock",
        members: ["Reino Unido", "Royal Navy", "Compa\u00f1ia Brit\u00e1nica de las Indias Orientales", "vicealmirante George Pocock", "escuadra brit\u00e1nica"],
        casualties: "Las fuentes institucionales usadas permiten identificar el combate y sus mandos, no un recuento bilateral homogeneo de muertos y heridos. GeoRisk evita transformar estimaciones posteriores en una cifra cerrada."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "10 de septiembre de 1759",
    sourceDispute: "La bibliografia suele llamarla Batalla de Pondicherry, pero los documentos de la British Library situan las l\u00edneas de batalla a la vista de la se\u00f1al de Tranquebar. GeoRisk conserva el titulo historico mas reconocible y registra la costa de Coromandel con ambas referencias para no presentar la acci\u00f3n como un combate dentro de la ciudad. Las sintesis posteriores alternan entre resultado indeciso y exito frances por la continuidad de su escuadra hacia Pondicherry; las fuentes archivisticas consultadas no convierten esa diferencia en una victoria estrategica unica ni aportan una tabla bilateral compatible de bajas. La batalla de 1759 se mantiene separada del sitio y rendici\u00f3n de Pondicherry de 1760-1761.",
    curationPriority: "alta",
    curationBatch: "source-backed-pondicherry-1759-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior figuraba solo para Francia, sin fecha, lugar, contraparte, jerarquia ni participantes verificables y bajo un conflicto europeo generico. Se normaliza como Batalla naval de Pondicherry (1759), se integra en la Guerra de los Siete A\u00f1os y se enlaza con Reino Unido e India para navegacion contemporanea. La etiqueta de operaciones en Coromandel es organizativa de GeoRisk, no el nombre de un tratado ni una afirmacion de soberania sobre India actual. La correccion evita confundir la acci\u00f3n naval con el sitio posterior, inventar bajas o adjudicar una victoria absoluta."
  };
}

export const PONDICHERRY_1759_CONFLICT_RENAMES = {
  "Batalla de Pondicherry": CANONICAL,
  "Batalla naval de Pondicherry": CANONICAL,
  "Batalla naval de Pondicherry (1759)": CANONICAL,
  "Batalla de Pondichery": CANONICAL,
  "Battle of Pondicherry": CANONICAL,
  "Action off Pondicherry": CANONICAL,
  "Bataille de Pondichery": CANONICAL
};

export const PONDICHERRY_1759_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL],
  India: [CANONICAL]
};

export const PONDICHERRY_1759_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: pondicherry1759Fix()
};
