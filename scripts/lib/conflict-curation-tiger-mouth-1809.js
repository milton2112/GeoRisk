function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combates navales de la Boca del Tigre (1809-1810)";
const PARENT = "Pirater\u00eda de la Flota de la Bandera Roja en el delta del r\u00edo de las Perlas (1809-1810)";
const CAMPAIGN = "Operaciones de Macao y la Boca del Tigre (septiembre de 1809-febrero de 1810)";

const SOURCES = {
  macauCulturalArchive: source(
    "Instituto Cultural de Macao, archivo hist\u00f3rico: mapa y relato documental sobre la confrontaci\u00f3n naval en Boca do Tigre, la convenci\u00f3n de 1809 y las operaciones de la flotilla macaense",
    "https://www.icm.gov.mo/rc/viewer/20003/797"
  ),
  andradePrimaryAccount: source(
    "Jos\u00e9 Ignacio de Andrade, Memoria dos feitos macaenses contra os piratas da China (1835), fuente primaria digitalizada: acciones del 15 de septiembre de 1809 y 21 de enero de 1810, bloqueo y capitulaci\u00f3n",
    "https://www.gutenberg.org/cache/epub/36163/pg36163-images.html",
    "media"
  ),
  portugueseArchiveMap: source(
    "Arquivo Nacional Torre do Tombo, cat\u00e1logo de un mapa de la confrontaci\u00f3n naval de Boca do Tigre entre una flota portuguesa y piratas chinos",
    "https://digitarq.arquivos.pt/documentMigrated/f7952d6bf255432bbd751799bfa189fb",
    "media"
  )
};

function tigerMouthFix() {
  const hierarchySources = [
    SOURCES.macauCulturalArchive,
    SOURCES.andradePrimaryAccount,
    SOURCES.portugueseArchiveMap
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "serie de combates navales antipirater\u00eda",
    conflictType: "pirateria",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1809,
    endYear: 1810,
    region: "Boca del Tigre o Humen, estuario del r\u00edo de las Perlas, Guangdong, China, y aguas cercanas a Macao",
    normalizedRegion: "Boca del Tigre o Humen, estuario del r\u00edo de las Perlas, Guangdong, China, y aguas cercanas a Macao",
    cause: "La actividad de la Flota de la Bandera Roja afectaba la navegaci\u00f3n, el comercio y las poblaciones costeras del delta del r\u00edo de las Perlas. Las autoridades de Macao y Cant\u00f3n acordaron una guardia costera conjunta, mientras la flotilla al mando de Jos\u00e9 Pinto Alcoforado de Azevedo e Sousa operaba contra las embarcaciones asociadas a Zhang Baozai.",
    outcome: "Las fuentes macaenses y portuguesas describen ventajas operativas de la flotilla portuguesa y macaense en las acciones de septiembre de 1809 y enero de 1810. Tras el bloqueo y las negociaciones, Zhang Baozai acept\u00f3 una capitulaci\u00f3n ante las autoridades Qing en 1810. La ficha no adopta como datos cerrados los recuentos de naves, piezas, efectivos o bajas que aparecen en relatos de parte.",
    consequences: "La serie ayud\u00f3 a restablecer la seguridad de navegaci\u00f3n en torno a Macao y el estuario, y se vincul\u00f3 con una soluci\u00f3n negociada y una amnist\u00eda Qing para parte de la Flota de la Bandera Roja. No se presenta como una guerra bilateral moderna entre Portugal y China ni se atribuye a esta acci\u00f3n, por s\u00ed sola, la desaparici\u00f3n de toda la pirater\u00eda regional.",
    chronology: [
      {
        year: 1809,
        event: "El 15 de septiembre, fuentes macaenses registran un combate contra las fuerzas de Zhang Baozai y Apau-tai en los canales de Wam-poo."
      },
      {
        year: 1809,
        event: "El 23 de noviembre, representantes de Macao y Cant\u00f3n suscribieron una convenci\u00f3n para organizar una guardia costera conjunta contra los piratas."
      },
      {
        year: 1810,
        event: "El 21 de enero, la flotilla macaense y portuguesa combati\u00f3 a la Flota de la Bandera Roja cerca de Lantau; los relatos la presentan como una acci\u00f3n decisiva dentro de la serie."
      },
      {
        year: 1810,
        event: "Despu\u00e9s del bloqueo y de negociaciones con autoridades Qing, Zhang Baozai acept\u00f3 capitular; la resoluci\u00f3n incluy\u00f3 condiciones de perd\u00f3n e integraci\u00f3n en el servicio imperial."
      }
    ],
    treaties: ["Convenci\u00f3n de Macao y Cant\u00f3n para una guardia costera conjunta (23 de noviembre de 1809)"],
    related: [PARENT, CAMPAIGN, "Boca del Tigre", "Humen", "Macao", "Lantau", "Flota de la Bandera Roja", "Zhang Baozai (Cheung Po Tsai)", "Jos\u00e9 Pinto Alcoforado de Azevedo e Sousa", "Delta del r\u00edo de las Perlas"],
    participants: [
      {
        side: "Flotilla portuguesa y macaense de Jos\u00e9 Pinto Alcoforado de Azevedo e Sousa",
        members: ["Reino de Portugal", "Gobierno de Macao", "Flotilla de Jos\u00e9 Pinto Alcoforado de Azevedo e Sousa"],
        casualties: "No consolidadas: los relatos preservados describen da\u00f1os y muertos de forma parcial y no permiten una tabla bilateral verificable."
      },
      {
        side: "Flota de la Bandera Roja",
        members: ["Flota de la Bandera Roja", "Zhang Baozai (Cheung Po Tsai)", "Embarcaciones piratas chinas"],
        casualties: "No consolidadas: la ficha no convierte estimaciones narrativas de naves, piezas o efectivos en cifras cerradas de bajas."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "15 de septiembre de 1809 a febrero de 1810; la entrada agrupa una serie de acciones, incluida una gran acci\u00f3n el 21 de enero de 1810",
    sourceDispute: "Los relatos disponibles proceden principalmente de instituciones y testigos portugueses o macaenses. Coinciden en la serie de acciones, la convenci\u00f3n de 1809, el mando de Alcoforado, la confrontaci\u00f3n de enero de 1810 y la capitulaci\u00f3n posterior, pero ofrecen cifras redondeadas o incompatibles sobre flotas, armamento, efectivos y bajas. Por eso la ficha no consolida esas cifras ni trata autom\u00e1ticamente a la flota Qing como beligerante directo en cada combate.",
    curationPriority: "alta",
    curationBatch: "source-backed-tiger-mouth-1809-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa estaba fechada de forma incompleta, situada en Europa y vinculada solo a Portugal. Se normaliza como una serie de combates navales de 1809-1810 en el delta del r\u00edo de las Perlas y se vincula tambi\u00e9n a la Rep\u00fablica Popular China como referente geogr\u00e1fico contempor\u00e1neo. Los participantes conservan las entidades de \u00e9poca: Reino de Portugal, Macao y la Flota de la Bandera Roja. La jerarqu\u00eda es una agrupaci\u00f3n editorial de GeoRisk para ordenar la serie, no el nombre formal de una guerra citado literalmente por las fuentes; Macao aparece como contexto hist\u00f3rico, no como una entidad de pa\u00eds independiente en el dataset."
  };
}

export const TIGER_MOUTH_1809_CONFLICT_RENAMES = {
  "Batalla de la Boca del Tigre": CANONICAL,
  "Batalha da Boca do Tigre": CANONICAL,
  "Battle of the Tiger's Mouth": CANONICAL,
  "Battle of Tiger's Mouth": CANONICAL
};

export const TIGER_MOUTH_1809_COUNTRY_CONFLICT_ADDITIONS = {
  "Rep\u00fablica Popular China": [CANONICAL],
  Portugal: [CANONICAL]
};

export const TIGER_MOUTH_1809_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: tigerMouthFix()
};
