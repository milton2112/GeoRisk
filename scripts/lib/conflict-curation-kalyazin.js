function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  sapieha: source(
    "Polski Slownik Biograficzny: la biografia de Jan Piotr Sapieha registra su marcha contra Skopin-Shuiski en Kalyazin y que no logro forzar una batalla general",
    "https://www.ipsb.nina.gov.pl/a/biografia/jan-piotr-sapieha-1569-1611-hetman-dymitra-ii-samozwanca"
  ),
  lisowski: source(
    "Polski Slownik Biograficzny: la biografia de Aleksander Lisowski describe la expedicion fallida de Sapieha a Kalyazin entre agosto y septiembre de 1609",
    "https://www.ipsb.nina.gov.pl/a/biografia/aleksander-jozef-lisowski-h-jez"
  ),
  campaignStudy: source(
    "Echa Przeszlosci: estudio de Piotr Florek sobre la campana de 1609 y la llegada de las fuerzas de Sapieha a Kalyazin",
    "https://echaprzeszlosci.pl/wp-content/uploads/2013/07/echa4.pdf"
  ),
  swedishContext: source(
    "Ministerio de Justicia de Rusia: documenta el acuerdo de 1609 por el que Suecia aporto un cuerpo militar a las fuerzas de Vasili IV",
    "https://minjust.gov.ru/static/exhibition/sections/01/02.html"
  )
};

const PARENT = "Periodo Tumultuoso de Rusia";
const CAMPAIGN = "Operaciones de Kalyazin de 1609";

function historicalFix() {
  const hierarchySources = [
    SOURCES.sapieha,
    SOURCES.lisowski,
    SOURCES.campaignStudy,
    SOURCES.swedishContext
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate",
    conflictType: "civil",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1609,
    endYear: 1609,
    region: "Kalyazin, ribera del Volga, Zarato de Rusia (actual Rusia)",
    normalizedRegion: "Kalyazin, ribera del Volga, Zarato de Rusia (actual Rusia)",
    cause: "Durante el Periodo Tumultuoso ruso, las fuerzas de Dmitri II intentaban impedir el avance de Mijail Skopin-Shuiski hacia Moscu. Jan Piotr Sapieha llevo tropas del campo de Tushino a Kalyazin, donde el ejercito del zar contaba tambien con apoyo sueco conforme a los acuerdos de 1609.",
    outcome: "Las fuentes consultadas coinciden en una expedicion de Sapieha contra las fuerzas de Skopin-Shuiski en Kalyazin durante agosto de 1609, pero no permiten fijar un dia unico ni presentar una batalla general decisiva. La biografia de Sapieha indica que no logro forzar al comandante moscovita a aceptar una batalla campal; la ficha no consolida bajas, efectivos ni una victoria tactica.",
    consequences: "El episodio formo parte de la lucha por las comunicaciones del Volga durante el Periodo Tumultuoso. La retirada de las fuerzas de Sapieha de la zona permitio a Skopin-Shuiski conservar su posicion, sin que el combate resolviera la disputa por el trono moscovita.",
    chronology: [
      {
        year: 1609,
        event: "El gobierno de Vasili IV busco apoyo sueco contra las fuerzas de Dmitri II durante el Periodo Tumultuoso."
      },
      {
        year: 1609,
        event: "En agosto, Jan Piotr Sapieha llevo fuerzas del campo de Tushino hacia Kalyazin para enfrentar el avance de Mijail Skopin-Shuiski."
      },
      {
        year: 1609,
        event: "La expedicion no consiguio forzar una batalla general; las fuentes difieren en el dia y en si el choque debe considerarse una batalla decisiva."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Dmitri II el Falso", "Mijail Skopin-Shuiski", "Jan Piotr Sapieha", "Volga"],
    participants: [
      {
        side: "Fuerzas leales a Vasili IV",
        members: ["Zarato de Rusia", "Ejercito de Mijail Skopin-Shuiski", "Contingente sueco de Jacob De la Gardie"]
      },
      {
        side: "Fuerzas de Dmitri II",
        members: ["Ejercito de Jan Piotr Sapieha", "Mercenarios polaco-lituanos", "Cosacos aliados de Dmitri II"]
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-kalyazin-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    datePrecision: "agosto de 1609",
    curationNote: "La accion se clasifica dentro del Periodo Tumultuoso ruso, no como una guerra interestatal simple. Polonia y Suecia se vinculan para navegacion por la composicion y el apoyo documentados; la ficha no presenta a una fuerza regular polaca como bando estatal oficial. Las fuentes no permiten fijar un dia comun, bajas, efectivos ni una victoria decisiva."
  };
}

export const KALYAZIN_CONFLICT_RENAMES = {
  "Batalla de Kalyazin": "Combate de Kalyazin (1609)",
  "Batalla de Kaljazin": "Combate de Kalyazin (1609)",
  "Battle of Kalyazin": "Combate de Kalyazin (1609)",
  "Battle of Kaljazin": "Combate de Kalyazin (1609)",
  "Bitwa pod Kalazinem": "Combate de Kalyazin (1609)"
};

export const KALYAZIN_COUNTRY_CONFLICT_ADDITIONS = {
  "Polonia": ["Combate de Kalyazin (1609)"],
  "Rusia": ["Combate de Kalyazin (1609)"]
};

export const KALYAZIN_CONFLICT_DETAIL_FIXES = {
  "Combate de Kalyazin (1609)": historicalFix()
};
