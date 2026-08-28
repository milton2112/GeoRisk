function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  militaryAcademy: source(
    "Academia Militar Austriaca (MilAk): combate de Kirchschlag del 5 de septiembre de 1921",
    "https://www.milak.at/jahrgang-generalmajor-sommer/gefecht-von-kirchschlag"
  ),
  regionalBroadcast: source(
    "ORF: cronolog\u00eda regional del combate de Kirchschlag y la incorporaci\u00f3n de Burgenland",
    "https://tv.orf.at/program/orf3/regionalgeschichte-oberoesterreich-burgenland102.html"
  ),
  interiorMinistry: source(
    "Ministerio del Interior de Austria: resistencia armada y despliegue del Bundesheer en 1921",
    "https://www.bmi.gv.at/magazin/2021_07_08/gendarmeriegeschichte.html"
  ),
  militaryJournal: source(
    "Truppendienst de las Fuerzas Armadas Austriacas: reconstrucci\u00f3n de la ofensiva irregular sobre Kirchschlag",
    "https://www.truppendienst.com/beitraege/2022/ungarns-kampf-um-das-burgenland-1921",
    "media"
  )
};

const PARENT = "Levantamiento de Hungr\u00eda occidental de 1921";
const CAMPAIGN = "Operaciones de la frontera occidental de Hungr\u00eda (agosto-septiembre de 1921)";

function kirchschlagFix() {
  const hierarchySources = [
    SOURCES.militaryAcademy,
    SOURCES.regionalBroadcast,
    SOURCES.interiorMinistry,
    SOURCES.militaryJournal
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate fronterizo e insurrecci\u00f3n",
    conflictType: "frontera",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1921,
    endYear: 1921,
    region: "Kirchschlag in der Buckligen Welt, Baja Austria, en la entonces frontera con Hungr\u00eda",
    normalizedRegion: "Kirchschlag in der Buckligen Welt, Baja Austria, en la entonces frontera con Hungr\u00eda",
    cause: "La transferencia prevista de Hungr\u00eda occidental a Austria tras los tratados de posguerra desencaden\u00f3 una insurrecci\u00f3n armada de grupos irregulares h\u00fangaros. El despliegue de fuerzas estatales austr\u00edacas para asegurar la frontera y la localidad de Kirchschlag gener\u00f3 el enfrentamiento del 5 de septiembre de 1921.",
    outcome: "Defensa austr\u00edaca de Kirchschlag. Tras los primeros intercambios y fuego de ametralladora, las fuerzas estatales austr\u00edacas detuvieron la ofensiva de los grupos irregulares h\u00fangaros y conservaron la localidad. La ficha no fija un c\u00f3mputo definitivo de efectivos ni bajas porque las reconstrucciones disponibles no ofrecen un balance com\u00fan y completo.",
    consequences: "El combate fue uno de los episodios armados de la crisis por la transferencia de Hungr\u00eda occidental. La resistencia irregular y los enfrentamientos fronterizos prolongaron la tensi\u00f3n hasta nuevas negociaciones entre Austria y Hungr\u00eda; el Protocolo de Venecia de octubre de 1921 pertenece a esa resoluci\u00f3n m\u00e1s amplia y no se atribuye a Kirchschlag por s\u00ed solo.",
    chronology: [
      {
        year: 1921,
        event: "El 28 de agosto comenz\u00f3 el levantamiento de Hungr\u00eda occidental ante la transferencia territorial prevista hacia Austria."
      },
      {
        year: 1921,
        event: "El 29 de agosto, el Gobierno austr\u00edaco dispuso el env\u00edo de una unidad del Bundesheer a Kirchschlag para reforzar la seguridad fronteriza."
      },
      {
        year: 1921,
        event: "El 5 de septiembre, fuerzas estatales austr\u00edacas y grupos irregulares h\u00fangaros combatieron en Kirchschlag; la defensa austr\u00edaca contuvo el ataque."
      },
      {
        year: 1921,
        event: "El 13 de octubre, Austria y Hungr\u00eda firmaron el Protocolo de Venecia dentro de la resoluci\u00f3n pol\u00edtica posterior de la crisis."
      }
    ],
    treaties: ["Protocolo de Venecia (13 de octubre de 1921)"],
    related: [PARENT, CAMPAIGN, "Kirchschlag in der Buckligen Welt", "Baja Austria", "Bundesheer", "Gendarmer\u00eda austr\u00edaca", "Voluntarios h\u00fangaros", "Protocolo de Venecia"],
    participants: [
      {
        side: "Fuerzas estatales austr\u00edacas",
        members: ["Austria", "Bundesheer", "II Batall\u00f3n del Regimiento de Infanter\u00eda n.\u00ba 5", "Gendarmer\u00eda austr\u00edaca", "Emil Sommer"],
        casualties: "No consolidado: las fuentes consultadas describen la defensa y las bajas, pero no ofrecen una relaci\u00f3n com\u00fan y verificable de muertos, heridos y capturados austr\u00edacos."
      },
      {
        side: "Fuerzas irregulares h\u00fangaras",
        members: ["Voluntarios h\u00fangaros", "Freisch\u00e4rler h\u00fangaros", "Grupos insurrectos de Hungr\u00eda occidental"],
        casualties: "Parcial: Truppendienst registra al menos siete combatientes h\u00fangaros muertos en su reconstrucci\u00f3n, sin un balance completo y contrastado de heridos o capturados."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "5 de septiembre de 1921",
    sourceDispute: "Las fuentes consultadas coinciden en la fecha, el choque entre fuerzas estatales austr\u00edacas e irregulares h\u00fangaros y la defensa de Kirchschlag, pero su procedencia es predominantemente institucional austr\u00edaca. Las cifras difieren o aparecen de forma parcial: la reconstrucci\u00f3n de Truppendienst menciona al menos siete muertos h\u00fangaros, mientras que las dem\u00e1s fuentes no consolidan un balance total comparable. Por ello se conserva ese m\u00ednimo como dato atribuido y no se presenta una cifra definitiva de bajas ni una relaci\u00f3n cerrada de efectivos.",
    curationPriority: "alta",
    curationBatch: "source-backed-kirchschlag-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa solo conservaba el r\u00f3tulo ingl\u00e9s Battle of Kirchschlag sin fecha, jerarqu\u00eda ni actores. Se normaliza como Combate de Kirchschlag (1921) dentro del levantamiento de Hungr\u00eda occidental y se vincula a Austria y Hungr\u00eda por las fuerzas que actuaron en el episodio. La ficha diferencia al Bundesheer y la Gendarmer\u00eda de las agrupaciones irregulares h\u00fangaras, mantiene la fecha diaria verificable y explicita la limitaci\u00f3n de las cifras de bajas."
  };
}

export const KIRCHSCHLAG_CONFLICT_RENAMES = {
  "Batalla de Kirchschlag": "Combate de Kirchschlag (1921)",
  "Batalla de Kirchschlag (1921)": "Combate de Kirchschlag (1921)",
  "Battle of Kirchschlag": "Combate de Kirchschlag (1921)",
  "Gefecht von Kirchschlag": "Combate de Kirchschlag (1921)",
  "Combate de Kirchschlag": "Combate de Kirchschlag (1921)"
};

export const KIRCHSCHLAG_COUNTRY_CONFLICT_ADDITIONS = {
  Austria: ["Combate de Kirchschlag (1921)"],
  "Hungr\u00eda": ["Combate de Kirchschlag (1921)"]
};

export const KIRCHSCHLAG_CONFLICT_DETAIL_FIXES = {
  "Combate de Kirchschlag (1921)": kirchschlagFix()
};
