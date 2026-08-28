function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  royalMuseumsBattleScene: source(
    "Royal Museums Greenwich: registro de la derrota de la escuadra francesa de La Clue frente a Lagos por la escuadra de Edward Boscawen el 18 de agosto de 1759",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-138782"
  ),
  royalMuseumsBattlePrint: source(
    "Royal Museums Greenwich: grabado de la derrota de la escuadra francesa de La Clue frente al cabo Lagos durante la Guerra de los Siete A\u00f1os",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-128752"
  ),
  royalMuseumsBoscawenPortrait: source(
    "Royal Museums Greenwich: perfil de Edward Boscawen que registra cinco nav\u00edos franceses capturados o incendiados en Lagos en agosto de 1759",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-108833"
  ),
  royalMuseumsVictoryMedal: source(
    "Royal Museums Greenwich: medalla contempor\u00e1nea de las victorias de 1759 que inscribe Lagos y Boscawen el 19 de agosto",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-38577"
  )
};

const PARENT = "Guerra de los Siete A\u00f1os (1756-1763)";
const CAMPAIGN = "Operaciones navales franco-brit\u00e1nicas en el Mediterr\u00e1neo occidental (1759)";

function lagos1759Fix() {
  const hierarchySources = [
    SOURCES.royalMuseumsBattleScene,
    SOURCES.royalMuseumsBattlePrint,
    SOURCES.royalMuseumsBoscawenPortrait,
    SOURCES.royalMuseumsVictoryMedal
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1759,
    endYear: 1759,
    region: "Entre el estrecho de Gibraltar y Lagos, frente al Algarve, actual Portugal, y la costa suroccidental de Espa\u00f1a",
    normalizedRegion: "Entre el estrecho de Gibraltar y Lagos, frente al Algarve, actual Portugal, y la costa suroccidental de Espa\u00f1a",
    cause: "Durante la Guerra de los Siete A\u00f1os, la escuadra brit\u00e1nica de Edward Boscawen intercept\u00f3 a la escuadra francesa de Jean-Fran\u00e7ois de La Clue-Sabran en la ruta entre el estrecho de Gibraltar y Lagos.",
    outcome: "Victoria brit\u00e1nica en la secuencia naval del 18 y 19 de agosto de 1759. La colecci\u00f3n de Royal Museums Greenwich identifica la derrota de la escuadra francesa de La Clue y registra que la fuerza de Boscawen captur\u00f3 o incendi\u00f3 cinco nav\u00edos franceses. La ficha no fija bajas humanas, n\u00famero total de buques ni atribuye una sola de las dos fechas a todo el combate.",
    consequences: "Cinco nav\u00edos franceses fueron capturados o incendiados, reduciendo la capacidad inmediata de la escuadra de La Clue. La ficha describe ese resultado naval verificable sin presentar esta batalla por s\u00ed sola como el desenlace de la Guerra de los Siete A\u00f1os.",
    chronology: [
      {
        year: 1756,
        event: "Comenz\u00f3 la Guerra de los Siete A\u00f1os."
      },
      {
        year: 1759,
        event: "Entre el 18 y el 19 de agosto, la escuadra de Edward Boscawen combati\u00f3 a la escuadra francesa de La Clue en la secuencia naval conocida como batalla de Lagos."
      },
      {
        year: 1759,
        event: "La victoria brit\u00e1nica dej\u00f3 cinco nav\u00edos franceses capturados o incendiados, seg\u00fan los registros de Royal Museums Greenwich."
      },
      {
        year: 1763,
        event: "El Tratado de Par\u00eds puso fin a la Guerra de los Siete A\u00f1os."
      }
    ],
    treaties: ["Tratado de Par\u00eds (1763)"],
    related: [PARENT, CAMPAIGN, "Lagos", "Edward Boscawen", "Jean-Fran\u00e7ois de La Clue-Sabran", "HMS Namur", "Marina Real Brit\u00e1nica", "Marina francesa", "estrecho de Gibraltar"],
    participants: [
      {
        side: "Escuadra brit\u00e1nica de Edward Boscawen",
        members: ["Reino de Gran Breta\u00f1a", "Marina Real Brit\u00e1nica", "Edward Boscawen", "HMS Namur"],
        casualties: "No consolidadas: las fuentes de colecci\u00f3n consultadas permiten identificar el resultado naval y las capturas o incendios, pero no una serie bilateral homog\u00e9nea de muertos y heridos."
      },
      {
        side: "Escuadra francesa de Jean-Fran\u00e7ois de La Clue-Sabran",
        members: ["Reino de Francia", "Marina francesa", "Jean-Fran\u00e7ois de La Clue-Sabran", "Ocean", "Centaure", "Temeraire"],
        casualties: "No consolidadas: la ficha registra cinco nav\u00edos franceses capturados o incendiados, no una cifra humana de bajas ni un parte completo de la escuadra."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "18-19 de agosto de 1759",
    sourceDispute: "Royal Museums Greenwich identifica el enfrentamiento de La Clue y Boscawen el 18 de agosto de 1759, mientras que su medalla contempor\u00e1nea inscribe Lagos y Boscawen el 19 de agosto. La ficha representa esos registros como una secuencia naval de dos d\u00edas, no como dos batallas distintas. Las fuentes consultadas sostienen las capturas o incendios de cinco nav\u00edos franceses, pero no justifican consolidar bajas humanas, orden de batalla completo o una fecha \u00fanica para cada fase.",
    curationPriority: "alta",
    curationBatch: "source-backed-lagos-1759-correction-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada gen\u00e9rica Batalla de Lagos se asoci\u00f3 de forma err\u00f3nea a la acci\u00f3n de 1693 en la versi\u00f3n anterior. La auditor\u00eda de candidatos mostr\u00f3 que la fuente enciclop\u00e9dica que resuelve ese t\u00edtulo en espa\u00f1ol corresponde a 1759, y Royal Museums Greenwich confirma esa identidad dentro de la Guerra de los Siete A\u00f1os. Se sustituye por Batalla naval de Lagos (1759); Francia y Reino Unido se vinculan por las fuerzas hist\u00f3ricas, y Portugal y Espa\u00f1a solo por la geograf\u00eda contempor\u00e1nea, sin convertirlas en beligerantes."
  };
}

export const LAGOS_1759_CONFLICT_RENAMES = {
  "Batalla de Lagos": "Batalla naval de Lagos (1759)",
  "Batalla de Lagos (1759)": "Batalla naval de Lagos (1759)",
  "Batalla de Lagos de 1759": "Batalla naval de Lagos (1759)",
  "Batalla naval de Lagos": "Batalla naval de Lagos (1759)",
  "Battle of Lagos (1759)": "Batalla naval de Lagos (1759)",
  "Bataille de Lagos (1759)": "Batalla naval de Lagos (1759)",
  "Combate naval de Lagos (1759)": "Batalla naval de Lagos (1759)"
};

export const LAGOS_1759_COUNTRY_CONFLICT_ADDITIONS = {
  "Espa\u00f1a": ["Batalla naval de Lagos (1759)"],
  Francia: ["Batalla naval de Lagos (1759)"],
  Portugal: ["Batalla naval de Lagos (1759)"],
  "Reino Unido": ["Batalla naval de Lagos (1759)"]
};

export const LAGOS_1759_COUNTRY_CONFLICT_EXCLUSIONS = {
  Francia: ["Batalla naval de Lagos (1693)"],
  Portugal: ["Batalla naval de Lagos (1693)"],
  "Reino Unido": ["Batalla naval de Lagos (1693)"],
  "Reino de los Pa\u00edses Bajos": ["Batalla naval de Lagos (1693)"]
};

export const LAGOS_1759_GENERATED_DETAIL_EXCLUSIONS = [
  "Batalla naval de Lagos (1693)"
];

export const LAGOS_1759_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Lagos (1759)": lagos1759Fix()
};
