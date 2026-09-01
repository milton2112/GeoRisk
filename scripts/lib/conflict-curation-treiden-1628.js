function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Treiden (1628)";
const PARENT = "Guerra polaco-sueca de 1626-1629";
const CAMPAIGN = "Operaciones de Livonia en el invierno de 1628";

const SOURCES = {
  bialystokStudy: source(
    "Universidad de Bialystok, Maciej Kwiatkowski, Bitwa pod Treiden 22 stycznia (2 lutego) 1628 roku: estudio sobre el combate, su frente livonio, Gustaf Horn y las incertidumbres de la reconstruccion",
    "https://historia.uwb.edu.pl/fcp/LFBsTMCQZEyUgCg4WSHd4alZbb2RFMFI8OTkKbFlMZ29NFUEuKh0RZG53Fx5IMA/_global/public/historia/uploads/2021/08/minione-lata-proba2.pdf"
  ),
  latvianLibrary: source(
    "Biblioteca Nacional de Letonia, Nigasche Stadtblatter (1862): relato historico digitalizado que ubica una derrota de Gustaf Horn en Treiden y su retirada al castillo; se usa como corroboracion retrospectiva, no para fijar cifras",
    "https://dom.lndb.lv/data/obj/file/11755519",
    "media"
  ),
  latvianEncyclopedia: source(
    "Enciclopedia Nacional de Letonia, Turaidas pils: identifica Turaida con las formas historicas Treiden y Treyden y contextualiza la plaza en las disputas polaco-suecas de Livonia",
    "https://enciklopedija.lv/skirklis/205321-Turaidas-pils"
  )
};

function treiden1628Fix() {
  const hierarchySources = [
    SOURCES.bialystokStudy,
    SOURCES.latvianLibrary,
    SOURCES.latvianEncyclopedia
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1628,
    endYear: 1628,
    region: "Treiden/Turaida, Livonia historica, actual Letonia",
    normalizedRegion: "Turaida, Letonia",
    cause: "La batalla se produjo en el frente livonio de la guerra polaco-sueca de 1626-1629, una disputa por el control de Livonia. Un destacamento sueco dirigido por Gustaf Horn atac\u00f3 a fuerzas lituanas concentradas cerca de Treiden, hoy Turaida.",
    outcome: "Victoria polaco-lituana local: las fuentes consultadas coinciden en que la acci\u00f3n termin\u00f3 con un rev\u00e9s sueco y la retirada de Gustaf Horn hacia Treiden. No fue decisiva para toda la guerra de 1626-1629 y GeoRisk no transforma las reconstrucciones posteriores en una tabla cerrada de fuerzas o bajas.",
    consequences: "El combate mantuvo activo el frente secundario de Livonia mientras el centro de gravedad de la guerra segu\u00eda tambi\u00e9n en Prusia. La contienda polaco-sueca de 1626-1629 continu\u00f3 despu\u00e9s de esta derrota local; la ficha no atribuye a Treiden un cambio duradero de control territorial.",
    chronology: [
      {
        year: 1626,
        event: "Comenz\u00f3 la fase de la guerra polaco-sueca de 1626-1629, con combates tambi\u00e9n en Livonia."
      },
      {
        year: 1628,
        event: "En el invierno de 1628, Gustaf Horn atac\u00f3 fuerzas lituanas reunidas en las cercan\u00edas de Treiden/Turaida."
      },
      {
        year: 1628,
        event: "La acci\u00f3n termin\u00f3 en una derrota sueca y la retirada de Horn hacia la plaza de Treiden, seg\u00fan las fuentes revisadas."
      },
      {
        year: 1629,
        event: "La guerra polaco-sueca de 1626-1629 prosigui\u00f3 hasta su cierre diplom\u00e1tico; Treiden no se presenta como una batalla decisiva del conflicto."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Treiden",
      "Turaida",
      "Livonia",
      "Gustaf Horn",
      "Wincenty Gosiewski",
      "Korff"
    ],
    participants: [
      {
        side: "Fuerzas de la Mancomunidad Polaco-Lituana",
        members: [
          "Mancomunidad Polaco-Lituana",
          "fuerzas del Gran Ducado de Lituania",
          "destacamento polaco-lituano de Treiden"
        ],
        casualties: "La reconstrucci\u00f3n universitaria identifica la victoria lituana, pero advierte que el mando exacto de esas fuerzas no es seguro y que las estimaciones de efectivos y bajas proceden de relatos secundarios. GeoRisk no consolida una cifra."
      },
      {
        side: "Fuerzas del Imperio sueco",
        members: [
          "Imperio sueco",
          "fuerzas suecas en Livonia",
          "Gustaf Horn"
        ],
        casualties: "Las fuentes coinciden en un rev\u00e9s sueco y la retirada de Horn, pero las cifras publicadas de efectivos y bajas son reconstrucciones discrepantes. GeoRisk registra el resultado sin fijar un total humano."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "Finales de enero o inicios de febrero de 1628: el estudio de Kwiatkowski titula la acci\u00f3n 22 de enero/2 de febrero, mientras otras s\u00edntesis reproducen 1 de febrero sin explicar el calendario.",
    sourceDispute: "Las fuentes revisadas coinciden en el a\u00f1o 1628, Treiden/Turaida, la participaci\u00f3n de Gustaf Horn y una victoria polaco-lituana local. No coinciden de forma suficiente en el d\u00eda exacto: Kwiatkowski ofrece 22 de enero/2 de febrero y otras s\u00edntesis usan 1 de febrero sin aclarar el calendario. El mismo estudio se\u00f1ala incertidumbre sobre el mando lituano, atribuido seg\u00fan reconstrucciones a Wincenty Gosiewski o a Miko\u0142aj/Wojciech Korff. Por eso la ficha no afirma un d\u00eda \u00fanico, un comandante polaco-lituano cerrado, ni fuerzas o bajas exactas.",
    curationPriority: "alta",
    curationBatch: "source-backed-treiden-1628-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior lleg\u00f3 como Battle of Treiden, solo bajo Suecia y sin fecha, contraparte, jerarqu\u00eda ni fuentes. Se normaliza como Batalla de Treiden (1628), se integra en la guerra polaco-sueca de 1626-1629 y se agregan Polonia y Letonia para navegaci\u00f3n contempor\u00e1nea. Los bandos conservan las entidades hist\u00f3ricas y la ficha evita repetir cifras o mandos cuya certeza no sostienen las fuentes revisadas."
  };
}

export const TREIDEN_1628_CONFLICT_RENAMES = {
  "Battle of Treiden": CANONICAL,
  "Battle of Treiden (1628)": CANONICAL,
  "Batalla de Treiden": CANONICAL,
  "Batalla de Turaida": CANONICAL,
  "Batalla de Turaida (1628)": CANONICAL
};

export const TREIDEN_1628_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: [CANONICAL],
  Letonia: [CANONICAL]
};

export const TREIDEN_1628_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: treiden1628Fix()
};
