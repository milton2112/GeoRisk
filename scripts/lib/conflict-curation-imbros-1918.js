function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval de Imbros (1918)";
const PARENT = "Primera Guerra Mundial";
const CAMPAIGN = "Operaciones navales en los Dardanelos y el Egeo (1918)";

const SOURCES = {
  australianWarMemorialAdmiraltyReport: source(
    "Australian War Memorial, reproducci\u00f3n contempor\u00e1nea del comunicado oficial del Almirantazgo brit\u00e1nico: avistamiento, combate del 20 de enero de 1918, p\u00e9rdida de HMS Raglan y M28, minas contra Midilli y Yavuz",
    "https://s3-ap-southeast-2.amazonaws.com/awm-media/collection/RCDIG1003886/bundled/RCDIG1003886.pdf"
  ),
  jagiellonianUniversityArticle: source(
    "Repositorio de la Universidad Jaguel\u00f3nica, ficha bibliogr\u00e1fica acad\u00e9mica de la batalla de Imbros del 20 de enero de 1918, con Imbros, Goeben/Yavuz, Breslau/Midilli, M28 y HMS Raglan como descriptores",
    "https://ruj.uj.edu.pl/entities/publication/01be32ef-9d49-4adf-8573-a406cc433234"
  ),
  belletenStudy: source(
    "Belleten, revista de la Sociedad Hist\u00f3rica Turca: estudio sobre la operaci\u00f3n de Imbros, el hundimiento de Midilli y los da\u00f1os por minas de Yavuz",
    "https://belleten.gov.tr/eng/full-text/379/tur"
  )
};

function imbros1918Fix() {
  const hierarchySources = [
    SOURCES.australianWarMemorialAdmiraltyReport,
    SOURCES.jagiellonianUniversityArticle,
    SOURCES.belletenStudy
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
    startYear: 1918,
    endYear: 1918,
    region: "Aguas frente a la isla de Imbros o G\u00f6k\u00e7eada, mar Egeo, actual Turqu\u00eda, cerca de los Dardanelos",
    normalizedRegion: "Aguas frente a la isla de Imbros o G\u00f6k\u00e7eada, mar Egeo, actual Turqu\u00eda, cerca de los Dardanelos",
    cause: "En el marco de la Primera Guerra Mundial, la escuadra otomana formada por Yavuz Sultan Selim y Midilli sali\u00f3 de los Dardanelos para atacar las fuerzas navales brit\u00e1nicas desplegadas cerca de Imbros.",
    outcome: "El 20 de enero de 1918, los monitores brit\u00e1nicos HMS Raglan y HMS M28 fueron hundidos tras el combate. Durante la retirada, Midilli se hundi\u00f3 al entrar en un campo de minas y Yavuz Sultan Selim sufri\u00f3 da\u00f1os por minas y qued\u00f3 varado. La ficha registra esos hechos operativos sin presentarlos como una victoria estrat\u00e9gica decisiva de un solo bando.",
    consequences: "La p\u00e9rdida de Midilli y los da\u00f1os de Yavuz redujeron de inmediato la capacidad de la escuadra otomana. La acci\u00f3n no decidi\u00f3 por s\u00ed sola la Primera Guerra Mundial ni se usa para inferir un resultado general del frente de los Dardanelos.",
    chronology: [
      {
        year: 1918,
        event: "El 20 de enero, HMS Lizard avist\u00f3 a Yavuz Sultan Selim y Midilli tras su salida de los Dardanelos; la escuadra otomana se dirigi\u00f3 hacia las fuerzas brit\u00e1nicas cerca de Imbros."
      },
      {
        year: 1918,
        event: "Durante el combate frente a Imbros, HMS Raglan fue hundido y HMS M28 se incendi\u00f3, explot\u00f3 y desapareci\u00f3, seg\u00fan el comunicado del Almirantazgo brit\u00e1nico reproducido por el Australian War Memorial."
      },
      {
        year: 1918,
        event: "En la retirada hacia los Dardanelos, Midilli entr\u00f3 en un campo de minas y se hundi\u00f3; Yavuz Sultan Selim tambi\u00e9n fue alcanzado por minas y termin\u00f3 varado cerca de Nara."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Imbros", "G\u00f6k\u00e7eada", "Dardanelos", "mar Egeo", "Yavuz Sultan Selim", "Midilli", "HMS Raglan", "HMS M28", "HMS Lizard"],
    participants: [
      {
        side: "Escuadra otomana",
        members: ["Imperio otomano", "Marina otomana", "Yavuz Sultan Selim (ex SMS Goeben)", "Midilli (ex SMS Breslau)"],
        casualties: "No consolidadas: la ficha registra el hundimiento de Midilli y los da\u00f1os de Yavuz, pero no fija una cifra cerrada de muertos, heridos, prisioneros o supervivientes."
      },
      {
        side: "Fuerzas de la Marina Real Brit\u00e1nica",
        members: ["Reino Unido", "Marina Real Brit\u00e1nica", "HMS Raglan", "HMS M28", "HMS Lizard"],
        casualties: "No consolidadas: las fuentes consultadas identifican la p\u00e9rdida de HMS Raglan y HMS M28, pero los partes de supervivientes y bajas humanas no forman una tabla bilateral homog\u00e9nea."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "20 de enero de 1918",
    sourceDispute: "Las fuentes consultadas coinciden en la fecha, la acci\u00f3n frente a Imbros, Yavuz Sultan Selim, Midilli, HMS Raglan y HMS M28. Los relatos contempor\u00e1neos y los estudios posteriores no ofrecen una secuencia completamente homog\u00e9nea de cada impacto, mina, rescate o baja humana; por ello la ficha no consolida cifras personales ni atribuye todos los da\u00f1os a una sola causa sin matiz.",
    curationPriority: "alta",
    curationBatch: "source-backed-imbros-1918-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Imbros, no ten\u00eda fecha, detalle ni una jerarqu\u00eda verificable y estaba asociada solo a Grecia por la denominaci\u00f3n geogr\u00e1fica. Se normaliza como Batalla naval de Imbros (1918), dentro de la Primera Guerra Mundial, y se vincula a Turqu\u00eda como ubicaci\u00f3n contempor\u00e1nea e Imperio otomano como actor hist\u00f3rico, y al Reino Unido por la fuerza brit\u00e1nica. Grecia se retira del enlace de pa\u00eds porque Imbros o G\u00f6k\u00e7eada era territorio otomano en 1918 y es parte de Turqu\u00eda en la actualidad. Alemania no se a\u00f1ade autom\u00e1ticamente como pa\u00eds vinculado: los nombres anteriores de los buques y la presencia de oficiales alemanes no sustituyen la identificaci\u00f3n de los beligerantes navales usada por las fuentes. La campa\u00f1a es una agrupaci\u00f3n editorial de GeoRisk, no el nombre formal de una campa\u00f1a citado literalmente por las fuentes."
  };
}

export const IMBROS_1918_CONFLICT_RENAMES = {
  "Batalla de Imbros": CANONICAL,
  "Batalla de Imbros (1918)": CANONICAL,
  "Battle of Imbros": CANONICAL,
  "Battle of Imbros (1918)": CANONICAL,
  "Batalha de Imbros": CANONICAL
};

export const IMBROS_1918_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL],
  "Turqu\u00eda": [CANONICAL]
};

export const IMBROS_1918_COUNTRY_CONFLICT_EXCLUSIONS = {
  Grecia: [CANONICAL]
};

export const IMBROS_1918_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: imbros1918Fix()
};
