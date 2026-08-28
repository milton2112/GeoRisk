function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  hungarianNationalArchives: source(
    "Archivo Nacional de Hungr\u00eda: contexto documentado del levantamiento de Hungr\u00eda occidental de 1921 y sus negociaciones posteriores",
    "https://mnl.gov.hu/mnl/vaml/hirek/levelek_a_multbol_2021_december"
  ),
  contemporaryNewspaper: source(
    "EPA de la Biblioteca Nacional Sz\u00e9ch\u00e9nyi: prensa contempor\u00e1nea del 2 de septiembre de 1921 sobre el enfrentamiento de Gyanafalva",
    "https://epa.oszk.hu/05300/05398/00003/pdf/EPA05398_korosvidek_1921_194.pdf"
  ),
  insurrectionStudy: source(
    "Biblioteca Digital MTDA: estudio hist\u00f3rico sobre la insurrecci\u00f3n de Hungr\u00eda occidental y el combate de Gyanafalva",
    "https://mtda.hu/books/hejjas_jeno_a_nyugatmagyarorszagi_felkeles.pdf",
    "media"
  )
};

const PARENT = "Levantamiento de Hungr\u00eda occidental de 1921";
const CAMPAIGN = "Operaciones de la frontera occidental de Hungr\u00eda (agosto-septiembre de 1921)";

function gyanafalvaFix() {
  const hierarchySources = [
    SOURCES.hungarianNationalArchives,
    SOURCES.contemporaryNewspaper,
    SOURCES.insurrectionStudy
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
    region: "Gyanafalva, actual Jennersdorf, Burgenland, Austria; frontera entre Austria y Hungr\u00eda",
    normalizedRegion: "Gyanafalva, actual Jennersdorf, Burgenland, Austria; frontera entre Austria y Hungr\u00eda",
    cause: "La transferencia de territorio occidental h\u00fangaro a Austria tras los tratados de posguerra provoc\u00f3 una insurrecci\u00f3n armada de grupos irregulares. En el sector de Gyanafalva, voluntarios h\u00fangaros buscaron frenar el avance de fuerzas austr\u00edacas de seguridad y defender las rutas fronterizas durante la fase inicial de la crisis.",
    outcome: "Ventaja t\u00e1ctica local de los grupos irregulares h\u00fangaros entre fines de agosto y comienzos de septiembre de 1921. La prensa contempor\u00e1nea informa que voluntarios h\u00fangaros obligaron a replegarse a una fuerza austr\u00edaca de gendarmer\u00eda y Volkswehr en Gyanafalva; la ficha no presenta ese repliegue como una victoria estrat\u00e9gica decisiva ni fija bajas.",
    consequences: "Los combates formaron parte de la resistencia armada del levantamiento de Hungr\u00eda occidental, que contribuy\u00f3 a abrir nuevas negociaciones entre Austria y Hungr\u00eda bajo mediaci\u00f3n internacional. La secuencia posterior incluy\u00f3 el Protocolo de Venecia de octubre de 1921 y el plebiscito de Sopron, pero esos resultados no se atribuyen a Gyanafalva por s\u00ed sola.",
    chronology: [
      {
        year: 1921,
        event: "El 28 de agosto, comenz\u00f3 el levantamiento de Hungr\u00eda occidental en el contexto de la transferencia territorial prevista hacia Austria."
      },
      {
        year: 1921,
        event: "A finales de agosto, grupos irregulares h\u00fangaros y fuerzas austr\u00edacas de gendarmer\u00eda y Volkswehr chocaron en el sector de Gyanafalva."
      },
      {
        year: 1921,
        event: "Una noticia publicada el 2 de septiembre describi\u00f3 el repliegue de una fuerza austr\u00edaca tras un breve enfrentamiento cerca de Gyanafalva."
      },
      {
        year: 1921,
        event: "El 13 de octubre, Austria y Hungr\u00eda firmaron el Protocolo de Venecia dentro de la resoluci\u00f3n m\u00e1s amplia de la crisis fronteriza."
      }
    ],
    treaties: ["Protocolo de Venecia (13 de octubre de 1921)"],
    related: [PARENT, CAMPAIGN, "Gyanafalva", "Jennersdorf", "Burgenland", "Rongyos G\u00e1rda", "Volkswehr austr\u00edaca", "Protocolo de Venecia"],
    participants: [
      {
        side: "Fuerzas irregulares h\u00fangaras",
        members: ["Voluntarios h\u00fangaros", "Rongyos G\u00e1rda", "Fuerzas de Lajos F\u00f6rster"],
        casualties: "No consolidado: las fuentes consultadas no permiten fijar una cifra fiable para los enfrentamientos de Gyanafalva."
      },
      {
        side: "Fuerzas austr\u00edacas de frontera",
        members: ["Austria", "Gendarmer\u00eda austr\u00edaca", "Volkswehr austr\u00edaca"],
        casualties: "No consolidado: no se publica una cifra de bajas, prisioneros o equipo perdido como dato definitivo."
      }
    ],
    hierarchyConfidence: "media",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "Finales de agosto y comienzos de septiembre de 1921",
    sourceDispute: "La prensa del 2 de septiembre de 1921 informa un breve choque y repliegue austr\u00edaco en Gyanafalva, mientras una reconstrucci\u00f3n retrospectiva sit\u00faa la acci\u00f3n principal del sector el 29 de agosto. Las fuentes tampoco delimitan de manera uniforme los incidentes de Gyanafalva frente a los de localidades vecinas. Por ello se usa el nombre plural, una ventana temporal y un resultado t\u00e1ctico local; no se inventan fecha diaria, bajas ni una victoria estrat\u00e9gica cerrada.",
    curationPriority: "alta",
    curationBatch: "source-backed-gyanafalva-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa estaba en ingl\u00e9s, sin fecha ni jerarqu\u00eda, y trataba el episodio como una batalla interestatal convencional. Se normaliza como Combates de Gyanafalva (1921) dentro del levantamiento de Hungr\u00eda occidental. Austria y Hungr\u00eda se vinculan por las fuerzas que actuaron en el sector; la ficha distingue a la gendarmer\u00eda y Volkswehr de un ej\u00e9rcito regular y evita presentar a la Rongyos G\u00e1rda como una fuerza estatal homog\u00e9nea. La procedencia nacional y los sesgos de las fuentes quedan se\u00f1alados en la ficha."
  };
}

export const GYANAFALVA_CONFLICT_RENAMES = {
  "Batalla de Gyanafalva": "Combates de Gyanafalva (1921)",
  "Batalla de Gyanafalva (1921)": "Combates de Gyanafalva (1921)",
  "Combate de Gyanafalva": "Combates de Gyanafalva (1921)",
  "Battle of Gyanafalva": "Combates de Gyanafalva (1921)",
  "Gyanafalva battle": "Combates de Gyanafalva (1921)",
  "Combates de Jennersdorf": "Combates de Gyanafalva (1921)"
};

export const GYANAFALVA_COUNTRY_CONFLICT_ADDITIONS = {
  Austria: ["Combates de Gyanafalva (1921)"],
  Hungr\u00eda: ["Combates de Gyanafalva (1921)"]
};

export const GYANAFALVA_CONFLICT_DETAIL_FIXES = {
  "Combates de Gyanafalva (1921)": gyanafalvaFix()
};
