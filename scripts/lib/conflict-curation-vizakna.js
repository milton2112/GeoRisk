function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  hungarianResearchInstitute: source(
    "Instituto de Investigaci\u00f3n H\u00fangara: estudio con fecha, secuencia operativa y desenlace de V\u00edzakna",
    "https://mki.gov.hu/hu/hirek-hu/evfordulok-hu/1849-februar-4-vizaknai-utkozet"
  ),
  hungarianMilitaryHistory: source(
    "Instituto y Museo de Historia Militar de Hungr\u00eda: reconstrucci\u00f3n hist\u00f3rica de la batalla de V\u00edzakna",
    "https://honvedelem.hu/hirek/negy-nap-dorgott-az-agyu.html"
  ),
  hungarianElectronicLibrary: source(
    "Biblioteca Electr\u00f3nica H\u00fangara: historia de la campa\u00f1a de Bem en Transilvania",
    "https://mek.oszk.hu/03400/03407/html/370.html"
  )
};

const PARENT = "Revoluci\u00f3n h\u00fangara de 1848-1849";
const CAMPAIGN = "Campa\u00f1a de Transilvania de 1848-1849";

function vizaknaFix() {
  const hierarchySources = [
    SOURCES.hungarianResearchInstitute,
    SOURCES.hungarianMilitaryHistory,
    SOURCES.hungarianElectronicLibrary
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "independencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1849,
    endYear: 1849,
    region: "V\u00edzakna, Transilvania; actual Ocna Sibiului, Rumania",
    normalizedRegion: "V\u00edzakna, Transilvania; actual Ocna Sibiului, Rumania",
    cause: "Tras el intento h\u00fangaro fallido contra Nagyszeben, las fuerzas revolucionarias de J\u00f3zef Bem se replegaron a la posici\u00f3n defensiva de V\u00edzakna. El mando imperial de Anton Puchner concentr\u00f3 una fuerza superior para expulsarlas del sector y recuperar la iniciativa en la campa\u00f1a de Transilvania.",
    outcome: "Victoria imperial el 4 de febrero de 1849. Las fuerzas de Puchner obligaron al ej\u00e9rcito de Bem a retirarse tras un combate en el que la primera respuesta h\u00fangara contuvo el ataque, pero una contraofensiva imperial restableci\u00f3 la situaci\u00f3n. Las reconstrucciones institucionales consultadas estiman unas 500 bajas h\u00fangaras y 232 imperiales, adem\u00e1s de la p\u00e9rdida h\u00fangara de 15 piezas de artiller\u00eda; se conservan como estimaciones de fuente, no como un total definitivo universal.",
    consequences: "La derrota interrumpi\u00f3 de forma inmediata la ofensiva de Bem contra Nagyszeben y forz\u00f3 su retirada hacia Deva y Piski. No decidi\u00f3 por s\u00ed sola la campa\u00f1a: Bem reorganiz\u00f3 sus fuerzas y obtuvo una victoria posterior en Piski el 9 de febrero, antes de recuperar posiciones en Transilvania durante marzo.",
    chronology: [
      {
        year: 1849,
        event: "El 21 de enero, el ataque de Bem contra Nagyszeben fue rechazado por las fuerzas imperiales de Puchner."
      },
      {
        year: 1849,
        event: "Las tropas revolucionarias h\u00fangaras se replegaron hacia V\u00edzakna para ocupar una posici\u00f3n defensiva mientras esperaban refuerzos."
      },
      {
        year: 1849,
        event: "El 4 de febrero, el ej\u00e9rcito imperial de Anton Puchner atac\u00f3 a las fuerzas de J\u00f3zef Bem en V\u00edzakna y las oblig\u00f3 a retirarse."
      },
      {
        year: 1849,
        event: "El 9 de febrero, Bem consigui\u00f3 detener a las fuerzas de Puchner en la batalla de Piski y reanud\u00f3 la campa\u00f1a de Transilvania."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Transilvania", "V\u00edzakna", "Ocna Sibiului", "J\u00f3zef Bem", "Anton Puchner", "Nagyszeben", "Batalla de Piski"],
    participants: [
      {
        side: "Ej\u00e9rcito revolucionario h\u00fangaro",
        members: ["Ej\u00e9rcito revolucionario h\u00fangaro", "J\u00f3zef Bem"],
        casualties: "Alrededor de 500 bajas y 15 piezas de artiller\u00eda perdidas, seg\u00fan las reconstrucciones institucionales consultadas."
      },
      {
        side: "Fuerzas imperiales habsb\u00fargicas",
        members: ["Imperio austr\u00edaco", "Ej\u00e9rcito imperial y real", "Anton Puchner", "Milicias rumanas de Transilvania"],
        casualties: "232 bajas seg\u00fan las reconstrucciones institucionales consultadas."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "4 de febrero de 1849",
    sourceDispute: "Las fuentes institucionales coinciden en la fecha, la derrota de Bem y la retirada h\u00fangara, pero var\u00edan en los recuentos de fuerzas y en la forma de describir el apoyo ruso en Nagyszeben. El Instituto de Investigaci\u00f3n H\u00fangara se\u00f1ala que el destacamento ruso no intervino directamente en el combate, por lo que Rusia no se registra como beligerante. Las bajas se muestran solo como estimaciones atribuidas y la ficha no deriva de ellas un total cerrado adicional.",
    curationPriority: "alta",
    curationBatch: "source-backed-vizakna-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa era una batalla sin fecha ni jerarqu\u00eda, vinculada solo a Hungr\u00eda y clasificada de manera gen\u00e9rica. Se normaliza dentro de la Revoluci\u00f3n h\u00fangara y de la campa\u00f1a de Transilvania. Austria se vincula por el ej\u00e9rcito imperial habsb\u00fargico; Rumania se enlaza por la ubicaci\u00f3n contempor\u00e1nea de Ocna Sibiului y por milicias transilvanas, sin tratar a la Rumania actual como Estado beligerante. Polonia y Rusia no se a\u00f1aden como pa\u00edses combatientes por la nacionalidad de Bem o por el apoyo ruso indirecto."
  };
}

export const VIZAKNA_CONFLICT_RENAMES = {
  "Batalla de V\u00edzakna": "Batalla de V\u00edzakna (1849)",
  "Batalla de Vizakna": "Batalla de V\u00edzakna (1849)",
  "Battle of V\u00edzakna": "Batalla de V\u00edzakna (1849)",
  "Battle of Vizakna": "Batalla de V\u00edzakna (1849)"
};

export const VIZAKNA_COUNTRY_CONFLICT_ADDITIONS = {
  Austria: ["Batalla de V\u00edzakna (1849)"],
  Rumania: ["Batalla de V\u00edzakna (1849)"]
};

export const VIZAKNA_CONFLICT_DETAIL_FIXES = {
  "Batalla de V\u00edzakna (1849)": vizaknaFix()
};
