function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  brazilianNavyAntonioJoao: source(
    "Marinha do Brasil, Diretoria do Patrimônio Histórico e Documentação da Marinha: historial del vapor Antônio João y relato del combate de Alegre",
    "https://www.marinha.mil.br/dphdm/sites/www.marinha.mil.br.dphdm/files/AntonioJoaoVapor1858-1907.pdf"
  ),
  cuiabaMunicipalChamber: source(
    "Câmara Municipal de Cuiabá: contexto de la Guerra del Paraguay, retorno tras la retomada de Corumbá y combate del 11 de julio de 1867",
    "https://hmg.camaracuiaba.mt.gov.br/camara-de-cuiaba-registra-na-capital-vitoria-na-guerra-do-paraguai"
  ),
  unescoArchiveRegister: source(
    "UNESCO, registro de la colección documental de Mato Grosso: documento de 1867 que describe la Batalla de Alegre y la disputa por el vapor Jauru",
    "https://media.unesco.org/sites/default/files/webform/mtd001/mowlac-bilingual_2025_application_form_assinado.pdf"
  )
};

function historicalFix({
  parent,
  campaign,
  region,
  hierarchySources,
  participants,
  cause,
  outcome,
  consequences,
  chronology
}) {
  const sources = hierarchySources.filter(Boolean);
  return {
    parent,
    war: parent,
    campaign,
    type: "combate naval",
    conflictType: "interestatal",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1867,
    endYear: 1867,
    region,
    normalizedRegion: "América del Sur",
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [...new Set([
      parent,
      campaign,
      "Retomada de Corumbá",
      "Vapor de guerra Antônio João",
      "Vapor Jauru",
      "Vapor Salto del Guairá",
      "Río São Lourenço",
      "Corumbá"
    ].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-alegre-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: false,
    curationNote: "El historial de la Marina de Brasil y las referencias archivísticas describen el combate desde la perspectiva brasileña. Confirman la fecha, el río, los vapores Antônio João, Jauru y Salto del Guairá, la recuperación del Jauru y la captura de sus ocupantes. El relato naval enumera bajas brasileñas concretas, pero no publica un parte consolidado de pérdidas de ambos bandos ni una cifra verificable para Paraguay; la ficha no consolida un total de bajas. La agrupación «Operaciones de la retomada de Corumbá (1867)» es una categoría de GeoRisk para ordenar la secuencia local, no el nombre de una campaña oficial citado por las fuentes."
  };
}

export const ALEGRE_CONFLICT_RENAMES = {
  "Batalla de Alegre": "Combate naval de Alegre (1867)",
  "Combate do Alegre": "Combate naval de Alegre (1867)",
  "Battle of Alegre": "Combate naval de Alegre (1867)"
};

export const ALEGRE_COUNTRY_CONFLICT_ADDITIONS = {
  Brasil: ["Combate naval de Alegre (1867)"]
};

export const ALEGRE_CONFLICT_DETAIL_FIXES = {
  "Combate naval de Alegre (1867)": historicalFix({
    parent: "Guerra de la Triple Alianza",
    campaign: "Operaciones de la retomada de Corumbá (1867)",
    region: "Puerto de Alegre, río São Lourenço, cerca de Corumbá, actual Mato Grosso do Sul, Brasil",
    hierarchySources: [SOURCES.brazilianNavyAntonioJoao, SOURCES.cuiabaMunicipalChamber, SOURCES.unescoArchiveRegister],
    participants: [
      {
        side: "Fuerza imperial brasileña",
        members: [
          "Vapor de guerra Antônio João, al mando del capitán-teniente Balduíno Ferreira de Aguiar",
          "Vapor Jauru y una compañía embarcada para recuperarlo",
          "Elementos del Segundo Cuerpo de Operaciones de Mato Grosso y fuerzas de apoyo en las riberas"
        ]
      },
      {
        side: "Fuerza paraguaya",
        members: [
          "Vapor Salto del Guairá, armado con cuatro piezas y guarnecido por 95 plazas según el historial naval brasileño",
          "Marineros y un oficial paraguayos que ocuparon temporalmente el Jauru"
        ]
      }
    ],
    cause: "Tras la retomada brasileña de Corumbá en junio de 1867, la expedición regresaba hacia Cuiabá por la epidemia de viruela. El 11 de julio, mientras el Antônio João y el Jauru se detenían en Alegre para reabastecerse, un vapor paraguayo que remontaba el río atacó el Jauru y desencadenó el combate.",
    outcome: "La fuerza brasileña rechazó al Salto del Guairá y recuperó el Jauru mediante un abordaje, con la captura de los ocupantes paraguayos que permanecían a bordo. La fuente municipal de Cuiabá y el relato naval brasileño caracterizan la acción como una victoria brasileña, pero no existe en estas fuentes un parte consolidado de bajas de ambos bandos; la ficha no adjudica una cifra total ni de pérdidas paraguayas.",
    consequences: "El combate aseguró la recuperación inmediata del Jauru durante la retirada de la expedición de Mato Grosso. No resolvió la Guerra de la Triple Alianza, que continuó hasta 1870, pero quedó registrado en la documentación regional como uno de los episodios navales vinculados a la retomada de Corumbá.",
    chronology: [
      { year: 1865, event: "Las fuerzas paraguayas ocuparon Corumbá durante la Guerra de la Triple Alianza." },
      { year: 1867, event: "El 13 de junio, el Segundo Cuerpo de Operaciones de Mato Grosso retomó Corumbá; la retirada posterior se aceleró por una epidemia de viruela." },
      { year: 1867, event: "El 11 de julio, el vapor paraguayo Salto del Guairá atacó al Jauru en Alegre, sobre el río São Lourenço." },
      { year: 1867, event: "El Antônio João rechazó al atacante y una compañía brasileña recuperó el Jauru y capturó a sus ocupantes paraguayos." },
      { year: 1870, event: "La Guerra de la Triple Alianza concluyó con la muerte de Francisco Solano López." }
    ]
  })
};
