function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  congressionalResearchService: source(
    "Congressional Research Service de Estados Unidos: Azerbaijan and Armenia: The Nagorno-Karabakh Conflict, sintesis de la ofensiva meridional y del acuerdo de noviembre de 2020",
    "https://www.congress.gov/crs_external_products/R/PDF/R46651/R46651.1.pdf"
  ),
  humanRightsWatch: source(
    "Human Rights Watch: Armenia/Azerbaijan: Don't Attack Civilians, contexto de la escalada entre Armenia y Azerbaiy\u00e1n desde el 27 de septiembre de 2020",
    "https://www.hrw.org/news/2020/09/30/armenia/azerbaijan-dont-attack-civilians"
  ),
  netherlandsCountryReport: source(
    "Ministerio de Asuntos Exteriores de los Pa\u00edses Bajos: Country of Origin Information Report Azerbaijan (2021), que distingue el anuncio azerbaiyano del control de Jabrayil y su impugnaci\u00f3n inicial por las autoridades de facto",
    "https://www.government.nl/binaries/government/documenten/reports/2021/10/30/country-of-origin-information-report-azerbaijan/country%2Bof%2Borigin%2Binformation%2Breport%2BAzerbaijan%2B2021-09.pdf",
    "media"
  ),
  azerbaijanPresidency: source(
    "Presidencia de Azerbaiy\u00e1n: cronolog\u00eda oficial de localidades de Jabrayil declaradas bajo control azerbaiyano durante octubre de 2020; fuente estatal",
    "https://president.az/en/pages/view/azerbaijan/karabakh2/",
    "parcial"
  )
};

const PARENT = "Segunda guerra de Nagorno-Karabaj";
const CAMPAIGN = "Ofensiva meridional de Nagorno-Karabaj de 2020";

function jabrayilFix() {
  const hierarchySources = [
    SOURCES.congressionalResearchService,
    SOURCES.humanRightsWatch,
    SOURCES.netherlandsCountryReport,
    SOURCES.azerbaijanPresidency
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "ofensiva",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 2020,
    endYear: 2020,
    region: "Jabrayil y corredor del r\u00edo Aras, suroeste de Azerbaiy\u00e1n; zona disputada durante el conflicto",
    normalizedRegion: "Jabrayil y corredor del r\u00edo Aras, suroeste de Azerbaiy\u00e1n",
    cause: "Las operaciones formaron parte de la escalada armada entre Armenia y Azerbaiy\u00e1n iniciada el 27 de septiembre de 2020 en torno a Nagorno-Karabaj y sus distritos adyacentes. En el frente meridional, las fuerzas azerbaiyanas avanzaron por las tierras bajas situadas entre Nagorno-Karabaj e Ir\u00e1n, mientras las fuerzas armenias y de Artsaj defend\u00edan posiciones en la zona.",
    outcome: "Durante octubre de 2020, las fuerzas de Azerbaiy\u00e1n tomaron territorio en la regi\u00f3n de Jabrayil dentro de la ofensiva meridional. El acuerdo trilateral del 9 de noviembre detuvo la guerra y permiti\u00f3 a Azerbaiy\u00e1n retener sus ganancias de guerra. La ficha no atribuye la toma de toda la zona a un solo d\u00eda: el anuncio oficial del control de la ciudad el 4 de octubre fue impugnado entonces por las autoridades de facto y las operaciones continuaron durante el mes.",
    consequences: "El avance por Jabrayil contribuy\u00f3 a asegurar el frente meridional y la frontera azerbaiyana con Ir\u00e1n, y precedi\u00f3 a operaciones posteriores hacia Zangilan, Gubadli y Shusha. El alto el fuego de noviembre consolid\u00f3 en la pr\u00e1ctica las ganancias territoriales azerbaiyanas sin resolver por s\u00ed mismo el estatus pol\u00edtico definitivo de Nagorno-Karabaj.",
    chronology: [
      {
        year: 2020,
        event: "El 27 de septiembre, la escalada entre Armenia y Azerbaiy\u00e1n se convirti\u00f3 en una guerra abierta en torno a Nagorno-Karabaj."
      },
      {
        year: 2020,
        event: "Entre el 3 y el 4 de octubre, la cronolog\u00eda oficial azerbaiyana registr\u00f3 el avance sobre localidades de Jabrayil, incluida la ciudad; las autoridades de facto de Nagorno-Karabaj cuestionaron entonces ese anuncio."
      },
      {
        year: 2020,
        event: "Durante octubre, la investigaci\u00f3n del Congressional Research Service registr\u00f3 ganancias territoriales azerbaiyanas en Fuzuli, Jabrayil y Zangilan, hasta asegurar la frontera con Ir\u00e1n."
      },
      {
        year: 2020,
        event: "El 9 de noviembre, una declaraci\u00f3n conjunta de Azerbaiy\u00e1n, Armenia y Rusia detuvo la guerra y fij\u00f3 a las fuerzas en las posiciones que ocupaban."
      }
    ],
    treaties: [
      "Declaraci\u00f3n trilateral de Azerbaiy\u00e1n, Armenia y Rusia de 9 de noviembre de 2020"
    ],
    related: [PARENT, CAMPAIGN, "Jabrayil", "r\u00edo Aras", "Nagorno-Karabaj", "Rep\u00fablica de Artsaj", "Declaraci\u00f3n trilateral de noviembre de 2020"],
    participants: [
      {
        side: "Fuerzas armadas de Azerbaiy\u00e1n",
        members: ["Azerbaiy\u00e1n", "Fuerzas Armadas de Azerbaiy\u00e1n"]
      },
      {
        side: "Fuerzas armenias y de Artsaj",
        members: ["Armenia", "Fuerzas de Defensa de Artsaj"]
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "Operaciones en octubre de 2020; anuncio oficial de la ciudad el 4 de octubre, impugnado en ese momento",
    sourceDispute: "Las fuentes distinguen entre el anuncio oficial azerbaiyano de control de Jabrayil el 4 de octubre y la impugnaci\u00f3n inicial de las autoridades de facto de Nagorno-Karabaj. Por ello la ficha usa una ventana de operaciones durante octubre, registra el control territorial posterior respaldado por fuentes independientes y no fija bajas, unidades ni un parte t\u00e1ctico cerrado.",
    curationPriority: "alta",
    curationBatch: "source-backed-jabrayil-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa carec\u00eda de fecha, rival y jerarqu\u00eda verificable. Se normaliza como operaciones de Jabrayil dentro de la Segunda guerra de Nagorno-Karabaj. Armenia se agrega como enlace contempor\u00e1neo por la participaci\u00f3n documentada de fuerzas armenias; Artsaj se conserva como actor de facto y no se presenta como Estado reconocido. La ficha no adopta un relato unilateral sobre el inicio de la guerra, el control de un d\u00eda concreto o las bajas."
  };
}

export const JABRAYIL_CONFLICT_RENAMES = {
  "Batalla de Jabrayil": "Operaciones de Jabrayil (2020)",
  "Batalla de Jabrayil (2020)": "Operaciones de Jabrayil (2020)",
  "Combates de Jabrayil": "Operaciones de Jabrayil (2020)",
  "Captura de Jabrayil": "Operaciones de Jabrayil (2020)",
  "Battle of Jabrayil": "Operaciones de Jabrayil (2020)",
  "Battle of Jabrayil (2020)": "Operaciones de Jabrayil (2020)",
  "Jabrayil offensive": "Operaciones de Jabrayil (2020)"
};

export const JABRAYIL_COUNTRY_CONFLICT_ADDITIONS = {
  Armenia: ["Operaciones de Jabrayil (2020)"]
};

export const JABRAYIL_CONFLICT_DETAIL_FIXES = {
  "Operaciones de Jabrayil (2020)": jabrayilFix()
};
