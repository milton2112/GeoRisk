function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla del convoy de Malta (18 de febrero de 1800)";
const PARENT = "Guerra de la Segunda Coalici\u00f3n (1798-1802)";
const CAMPAIGN = "Operaciones navales del sitio de Malta (febrero de 1800)";

const SOURCES = {
  heritageMalta: source(
    "Heritage Malta: registro muse\u00edstico del sitio de Malta de 1798-1800, el intento de reabastecimiento franc\u00e9s de 1800, la muerte de Jean-Baptiste Perr\u00e9e y la rendici\u00f3n francesa posterior",
    "https://emuseum.heritagemalta.mt/objects/624"
  ),
  universityOfMaltaFrenchNavy: source(
    "University of Malta, La Marine fran\u00e7aise a Malte (1798-1800): estudio sobre la expedici\u00f3n de Perr\u00e9e desde Tol\u00f3n, Le G\u00e9n\u00e9reux, la interceptaci\u00f3n cerca de Malta y el fracaso del socorro",
    "https://www.um.edu.mt/library/oar/bitstream/123456789/42397/1/Binder1.pdf"
  ),
  universityOfMaltaStorja: source(
    "University of Malta, Storja 98: analiza registros contempor\u00e1neos sobre el intento de socorro, la captura de Le G\u00e9n\u00e9reux y la situaci\u00f3n del bloqueo de La Valeta",
    "https://www.um.edu.mt/library/oar/bitstream/123456789/25175/1/Storja%2098.pdf"
  )
};

function maltaConvoy1800Fix() {
  const hierarchySources = [
    SOURCES.heritageMalta,
    SOURCES.universityOfMaltaFrenchNavy,
    SOURCES.universityOfMaltaStorja
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate naval",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1800,
    endYear: 1800,
    region: "Aguas pr\u00f3ximas a Malta, Mediterr\u00e1neo central",
    normalizedRegion: "Aguas pr\u00f3ximas a Malta, Mediterr\u00e1neo central",
    cause: "Durante el sitio de Malta de 1798-1800, la guarnici\u00f3n francesa de La Valeta sufr\u00eda escasez por el bloqueo. Francia envi\u00f3 desde Tol\u00f3n un convoy de socorro dirigido por el contraalmirante Jean-Baptiste Perr\u00e9e para llevar suministros y refuerzos; una escuadra brit\u00e1nica lo intercept\u00f3 antes de que alcanzara la isla.",
    outcome: "Victoria naval brit\u00e1nica. Le G\u00e9n\u00e9reux fue capturado y Jean-Baptiste Perr\u00e9e muri\u00f3 durante la acci\u00f3n; el convoy no logr\u00f3 reabastecer la guarnici\u00f3n francesa de La Valeta. La ficha no fija un n\u00famero total de buques, tropas, muertos o heridos porque las fuentes consultadas no comparten un recuento \u00fanico.",
    consequences: "El fracaso del socorro agrav\u00f3 la situaci\u00f3n material de la guarnici\u00f3n francesa y el sitio continu\u00f3. No explica por s\u00ed solo la rendici\u00f3n: la guarnici\u00f3n se rindi\u00f3 el 4 de septiembre de 1800 tras meses adicionales de bloqueo y presi\u00f3n militar.",
    chronology: [
      {
        year: 1798,
        event: "Tras la ocupaci\u00f3n francesa de Malta, comenz\u00f3 un bloqueo que dej\u00f3 a la guarnici\u00f3n de La Valeta dependiente de suministros externos."
      },
      {
        year: 1800,
        event: "En febrero, Francia envi\u00f3 desde Tol\u00f3n una expedici\u00f3n de socorro al mando del contraalmirante Jean-Baptiste Perr\u00e9e, con Le G\u00e9n\u00e9reux como buque principal."
      },
      {
        year: 1800,
        event: "El 18 de febrero, fuerzas navales brit\u00e1nicas interceptaron el convoy cerca de Malta; Le G\u00e9n\u00e9reux fue capturado y Perr\u00e9e muri\u00f3 a consecuencia de sus heridas."
      },
      {
        year: 1800,
        event: "El 4 de septiembre, la guarnici\u00f3n francesa de La Valeta se rindi\u00f3 tras la continuaci\u00f3n del bloqueo; el cierre pertenece al sitio de Malta, no a un tratado propio de esta acci\u00f3n naval."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Sitio de Malta (1798-1800)",
      "La Valeta",
      "Le G\u00e9n\u00e9reux",
      "Jean-Baptiste Perr\u00e9e",
      "Horatio Nelson",
      "Lord Keith"
    ],
    participants: [
      {
        side: "Reino Unido",
        members: [
          "Reino Unido",
          "Royal Navy",
          "Horatio Nelson",
          "Lord Keith"
        ],
        casualties: "Los estudios de la University of Malta recuperan cifras parciales de registros contempor\u00e1neos, pero no presentan una serie homologada entre las unidades brit\u00e1nicas. GeoRisk no publica un total consolidado."
      },
      {
        side: "Francia",
        members: [
          "Francia",
          "Marine fran\u00e7aise",
          "Jean-Baptiste Perr\u00e9e",
          "Le G\u00e9n\u00e9reux"
        ],
        casualties: "Las fuentes coinciden en la muerte de Jean-Baptiste Perr\u00e9e y la captura de Le G\u00e9n\u00e9reux, pero difieren en la composici\u00f3n del convoy y no ofrecen un balance de bajas conciliado. GeoRisk conserva las bajas como no consolidadas."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "18 de febrero de 1800, durante el intento franc\u00e9s de alcanzar Malta con un convoy de socorro.",
    sourceDispute: "La entrada importada solo dec\u00eda Batalla del Convoy de Malta, sin fecha ni guerra, y pod\u00eda confundirse con los convoyes de la Segunda Guerra Mundial, incluida la Operaci\u00f3n Pedestal de 1942. Heritage Malta y los estudios de la University of Malta la sit\u00faan en el bloqueo franc\u00e9s de 1798-1800: la expedici\u00f3n de Perr\u00e9e parti\u00f3 de Tol\u00f3n y fue interceptada cerca de Malta. Las fuentes coinciden en la captura de Le G\u00e9n\u00e9reux y la muerte de Perr\u00e9e, pero no enumeran de la misma forma los transportes, los efectivos ni las bajas; por eso la ficha no publica cifras cerradas ni transforma a Malta en un beligerante estatal de la acci\u00f3n naval.",
    curationPriority: "alta",
    curationBatch: "source-backed-malta-convoy-1800-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Batalla del Convoy de Malta se normaliza como Batalla del convoy de Malta (18 de febrero de 1800), dentro de la Guerra de la Segunda Coalici\u00f3n y de las operaciones navales del sitio de Malta. La campa\u00f1a es una categor\u00eda organizativa de GeoRisk, no el nombre de una denominaci\u00f3n militar oficial. La ficha no mezcla esta acci\u00f3n de 1800 con el asedio a\u00e9reo y naval de Malta de 1940-1942, la Operaci\u00f3n Pedestal ni la acci\u00f3n distinta del 31 de marzo de 1800."
  };
}

export const MALTA_CONVOY_1800_CONFLICT_RENAMES = {
  "Batalla del Convoy de Malta": CANONICAL,
  "Batalla del convoy de Malta": CANONICAL,
  "Battle of the Malta Convoy": CANONICAL,
  "Malta Convoy Battle": CANONICAL,
  "Battle of Malta Convoy": CANONICAL
};

export const MALTA_CONVOY_1800_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL],
  Malta: [CANONICAL]
};

export const MALTA_CONVOY_1800_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: maltaConvoy1800Fix()
};
