function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  papersPast: source(
    "Papers Past, Biblioteca Nacional de Nueva Zelanda: despacho contempor\u00e1neo de diciembre de 1870 sobre el duelo naval entre Meteor y Bouvet frente a La Habana",
    "https://paperspast.natlib.govt.nz/newspapers/OW18701231.2.38"
  ),
  dutchDigitalLibrary: source(
    "DBNL: Gedenkboek van den oorlog in 1870 en 1871 (1872), relato contempor\u00e1neo del combate de La Habana del 9 de noviembre entre Meteor y Bouvet",
    "https://www.dbnl.org/tekst/snie001gede01_01/snie001gede01_01_0019.php"
  ),
  bavarianStateLibrary: source(
    "Deutsche Digitale Bibliothek y Bayerische Staatsbibliothek: edici\u00f3n de 1871 de Die Campagne von 1870 in der Nord- und Ostsee, fuente contempor\u00e1nea de la guerra naval franco-prusiana",
    "https://www.deutsche-digitale-bibliothek.de/item/ANSZ76WSECXWDP3ZA4CIWOSK72RS66RX"
  )
};

const PARENT = "Guerra franco-prusiana (1870-1871)";
const CAMPAIGN = "Operaciones navales transatl\u00e1nticas de 1870";

function havanaFix() {
  const hierarchySources = [
    SOURCES.papersPast,
    SOURCES.dutchDigitalLibrary,
    SOURCES.bavarianStateLibrary
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1870,
    endYear: 1870,
    region: "Frente a La Habana, mar Caribe; actual Cuba",
    normalizedRegion: "Frente a La Habana, mar Caribe; actual Cuba",
    cause: "En la Guerra franco-prusiana, la ca\u00f1onera SMS Meteor lleg\u00f3 a La Habana desde Nassau el 7 de noviembre y encontr\u00f3 al aviso franc\u00e9s Bouvet. Al estar el puerto bajo soberan\u00eda espa\u00f1ola neutral, los comandantes acordaron combatir fuera de las aguas territoriales y respetaron la separaci\u00f3n exigida por las reglas de neutralidad.",
    outcome: "Combate naval inconcluso el 9 de noviembre de 1870. Meteor y Bouvet intercambiaron fuego y protagonizaron un intento de espolonazo que da\u00f1\u00f3 aparejos y limit\u00f3 temporalmente la maniobra de ambas naves. Bouvet regres\u00f3 hacia aguas neutrales y Meteor no pudo perseguirla de forma efectiva; las autoridades espa\u00f1olas dieron por terminado el enfrentamiento. La ficha no consolida bajas ni una victoria t\u00e1ctica porque los relatos difieren en sus cifras y en el alcance de los da\u00f1os.",
    consequences: "La acci\u00f3n no alter\u00f3 el curso de la Guerra franco-prusiana. Meteor regres\u00f3 a La Habana y qued\u00f3 bloqueada all\u00ed durante el resto del conflicto, sin poder desarrollar la actividad contra el comercio franc\u00e9s que buscaba en el Caribe.",
    chronology: [
      {
        year: 1870,
        event: "El 7 de noviembre, SMS Meteor lleg\u00f3 a La Habana desde Nassau; poco despu\u00e9s entr\u00f3 el aviso franc\u00e9s Bouvet."
      },
      {
        year: 1870,
        event: "El 8 de noviembre, Bouvet dej\u00f3 el puerto; la neutralidad espa\u00f1ola oblig\u00f3 a esperar antes de la salida de Meteor."
      },
      {
        year: 1870,
        event: "El 9 de noviembre, ambos buques combatieron fuera de las aguas territoriales frente a La Habana."
      },
      {
        year: 1870,
        event: "Tras el intercambio de fuego y el intento de espolonazo, Bouvet se retir\u00f3 hacia aguas neutrales y una nave espa\u00f1ola se\u00f1al\u00f3 el final del combate."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "La Habana", "mar Caribe", "SMS Meteor", "Bouvet", "Eduard von Knorr", "Alexandre Franquet", "Cuba espa\u00f1ola"],
    participants: [
      {
        side: "Ca\u00f1onera de la Confederaci\u00f3n Alemana del Norte",
        members: [
          "Confederaci\u00f3n Alemana del Norte",
          "Marina de la Confederaci\u00f3n Alemana del Norte",
          "SMS Meteor",
          "Eduard von Knorr"
        ]
      },
      {
        side: "Aviso franc\u00e9s",
        members: [
          "Segundo Imperio franc\u00e9s",
          "Marina Imperial francesa",
          "Bouvet",
          "Alexandre Franquet"
        ]
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "9 de noviembre de 1870",
    sourceDispute: "Los despachos y estudios disponibles difieren en el n\u00famero de bajas, el grado de da\u00f1o de cada nave y la interpretaci\u00f3n del espolonazo. Por ello la ficha conserva el desenlace inconcluso y no publica totales cerrados de bajas ni una victoria decisiva.",
    curationPriority: "alta",
    curationBatch: "source-backed-havana-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa quedaba bajo una jerarqu\u00eda europea gen\u00e9rica y solo vinculada a Francia. Se normaliza como combate naval frente a La Habana de 1870 dentro de la Guerra franco-prusiana. Alemania se vincula como referencia contempor\u00e1nea de navegaci\u00f3n por la Confederaci\u00f3n Alemana del Norte; Cuba y Espa\u00f1a se preservan como el territorio y la potencia neutral que aplic\u00f3 la neutralidad, no como beligerantes. La ficha evita adjudicar la acci\u00f3n a un ganador y no fuerza cifras de bajas discutidas."
  };
}

export const HAVANA_CONFLICT_RENAMES = {
  "Batalla de Havana": "Combate naval frente a La Habana (1870)",
  "Batalla de La Habana": "Combate naval frente a La Habana (1870)",
  "Batalla naval de La Habana": "Combate naval frente a La Habana (1870)",
  "Combate de La Habana": "Combate naval frente a La Habana (1870)",
  "Combate naval frente a La Habana": "Combate naval frente a La Habana (1870)",
  "Battle of Havana": "Combate naval frente a La Habana (1870)",
  "Battle of Havana (1870)": "Combate naval frente a La Habana (1870)",
  "Battle between Meteor and Bouvet": "Combate naval frente a La Habana (1870)"
};

export const HAVANA_COUNTRY_CONFLICT_ADDITIONS = {
  Alemania: ["Combate naval frente a La Habana (1870)"]
};

export const HAVANA_CONFLICT_DETAIL_FIXES = {
  "Combate naval frente a La Habana (1870)": havanaFix()
};
