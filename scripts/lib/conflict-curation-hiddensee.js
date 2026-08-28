function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  bavarianStateLibrary: source(
    "Deutsche Digitale Bibliothek y Bayerische Staatsbibliothek: edici\u00f3n de 1871 de Die Campagne von 1870 in der Nord- und Ostsee, testimonio contempor\u00e1neo sobre la campa\u00f1a naval",
    "https://www.deutsche-digitale-bibliothek.de/item/ANSZ76WSECXWDP3ZA4CIWOSK72RS66RX"
  ),
  dutchDigitalLibrary: source(
    "DBNL: Gedenkboek van den oorlog in 1870 en 1871 (1872), relato contempor\u00e1neo de las operaciones navales y del combate frente a Hiddensee",
    "https://www.dbnl.org/tekst/snie001gede01_01/snie001gede01_01_0019.php"
  ),
  primaryReportCatalog: source(
    "Bayerische Staatsbibliothek: cat\u00e1logo del informe de Franz von Waldersee sobre el combate de la divisi\u00f3n de flotilla en Hiddensee, 17 de agosto de 1870",
    "https://opacplus.bsb-muenchen.de/title/BV020517894"
  )
};

const PARENT = "Guerra franco-prusiana (1870-1871)";
const CAMPAIGN = "Operaciones navales del B\u00e1ltico de 1870";

function hiddenseeFix() {
  const hierarchySources = [
    SOURCES.bavarianStateLibrary,
    SOURCES.dutchDigitalLibrary,
    SOURCES.primaryReportCatalog
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
    startYear: 1870,
    endYear: 1870,
    region: "Frente a Hiddensee y Dornbusch, mar B\u00e1ltico; actual Alemania",
    normalizedRegion: "Frente a Hiddensee y Dornbusch, mar B\u00e1ltico; actual Alemania",
    cause: "Durante la Guerra franco-prusiana, la escuadra francesa del B\u00e1ltico intentaba bloquear los puertos nortealemanes. Franz von Waldersee sali\u00f3 con la Grille desde la flotilla de R\u00fcgen para reconocer la zona de la bah\u00eda de K\u00f8ge y atraer o vigilar las unidades francesas.",
    outcome: "Combate naval inconcluso el 17 de agosto de 1870. La Grille y tres ca\u00f1oneras nortealemanas intercambiaron fuego a distancia con unidades de la escuadra francesa; las fuentes consultadas no registran impactos, bajas ni da\u00f1os en ninguno de los bandos. La flotilla se retir\u00f3 hacia aguas poco profundas, donde los buques franceses de mayor calado no pudieron continuar la persecuci\u00f3n.",
    consequences: "El episodio no alter\u00f3 el curso de la Guerra franco-prusiana. Ilustr\u00f3 las limitaciones pr\u00e1cticas de la escuadra francesa para imponer un bloqueo cercano en las aguas someras de la costa b\u00e1ltica alemana; las operaciones navales francesas continuaron durante las semanas siguientes.",
    chronology: [
      {
        year: 1870,
        event: "En agosto, la escuadra francesa del B\u00e1ltico operaba frente a la costa nororiental alemana con el objetivo de bloquear puertos desde Kiel hasta Memel."
      },
      {
        year: 1870,
        event: "El 17 de agosto, la Grille sali\u00f3 de la zona de R\u00fcgen al mando de Franz von Waldersee y entr\u00f3 en contacto con unidades francesas frente a Hiddensee."
      },
      {
        year: 1870,
        event: "Las ca\u00f1oneras Drache, Blitz y Salamander se unieron al intercambio mientras la Grille retroced\u00eda hacia Dornbusch."
      },
      {
        year: 1870,
        event: "El combate termin\u00f3 sin impactos ni p\u00e9rdidas confirmadas; el mayor calado de los buques franceses limit\u00f3 la persecuci\u00f3n en aguas poco profundas."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Hiddensee", "Dornbusch", "mar B\u00e1ltico", "Franz von Waldersee", "Escuadra francesa del B\u00e1ltico", "Grille"],
    participants: [
      {
        side: "Flotilla de la Confederaci\u00f3n Alemana del Norte",
        members: [
          "Confederaci\u00f3n Alemana del Norte",
          "Marina de la Confederaci\u00f3n Alemana del Norte",
          "Franz von Waldersee",
          "Grille",
          "Ca\u00f1onera Drache",
          "Ca\u00f1onera Blitz",
          "Ca\u00f1onera Salamander"
        ]
      },
      {
        side: "Escuadra francesa del B\u00e1ltico",
        members: [
          "Segundo Imperio franc\u00e9s",
          "Marina Imperial francesa",
          "Vicealmirante Bou\u00ebt-Willaumez",
          "Surveillante",
          "Oc\u00e9an"
        ]
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "17 de agosto de 1870",
    sourceDispute: "Los relatos no coinciden por completo en la identificaci\u00f3n del aviso franc\u00e9s avistado primero ni en todas las unidades que siguieron a la Grille. La ficha registra las escuadras y los buques coincidentes, sin presentar una lista cerrada de orden de batalla ni cifras de bajas.",
    curationPriority: "alta",
    curationBatch: "source-backed-hiddensee-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa quedaba bajo una jerarqu\u00eda europea gen\u00e9rica y solo vinculada a Francia. Se normaliza como combate naval frente a Hiddensee de 1870 dentro de la Guerra franco-prusiana. Alemania se vincula como referencia contempor\u00e1nea de navegaci\u00f3n por la Confederaci\u00f3n Alemana del Norte; Hiddensee se conserva como ubicaci\u00f3n, no como beligerante. La ficha evita atribuir una victoria, bajas o impactos que las fuentes consultadas no confirman."
  };
}

export const HIDDENSEE_CONFLICT_RENAMES = {
  "Batalla de Hiddensee": "Combate naval frente a Hiddensee (1870)",
  "Combate de Hiddensee": "Combate naval frente a Hiddensee (1870)",
  "Combate naval de Hiddensee": "Combate naval frente a Hiddensee (1870)",
  "Combate naval frente a Hiddensee": "Combate naval frente a Hiddensee (1870)",
  "Seegefecht vor Hiddensee": "Combate naval frente a Hiddensee (1870)",
  "Sea battle off Hiddensee": "Combate naval frente a Hiddensee (1870)"
};

export const HIDDENSEE_COUNTRY_CONFLICT_ADDITIONS = {
  Alemania: ["Combate naval frente a Hiddensee (1870)"]
};

export const HIDDENSEE_CONFLICT_DETAIL_FIXES = {
  "Combate naval frente a Hiddensee (1870)": hiddenseeFix()
};
