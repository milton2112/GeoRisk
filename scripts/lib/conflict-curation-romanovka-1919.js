function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Romanovka (25 de junio de 1919)";
const PARENT = "Guerra civil rusa";
const CAMPAIGN = "Intervenci\u00f3n aliada en Siberia";

const SOURCES = {
  armyMedicalHistory: source(
    "U.S. Army AMEDD Center of History and Heritage: historia oficial de las operaciones m\u00e9dicas de la Fuerza Expedicionaria Estadounidense en Siberia; fecha, destacamento, ataque sorpresa, sector ferroviario y bajas registradas",
    "https://achh.army.mil/history/book-wwi-fieldoperations-chapter41/"
  ),
  armyOrderOfBattle: source(
    "U.S. Army Press, Order of Battle of the United States Land Forces in the World War: Compa\u00f1\u00eda A del 31.er Regimiento de Infanter\u00eda, Romanovka, ferrocarril de Suchan y 300 irregulares bolcheviques",
    "https://www.armyupress.army.mil/Portals/7/combat-studies-institute/csi-books/OrderofBattle1.pdf"
  ),
  armyCampaignHistory: source(
    "U.S. Army Center of Military History, Campaigns of World War I: relato institucional de Romanovka, operaciones estadounidenses posteriores en Suchan y cifras alternativas de efectivos y bajas",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/R%20Pdf/CMH_Pub_77-10.pdf?ver=-RlwVl9MKZkqmvRvtNEcTA%3D%3D"
  ),
  worldWarICentennial: source(
    "U.S. World War I Centennial Commission: contexto divulgativo de la Compa\u00f1\u00eda A, el 25 de junio de 1919 y una estimaci\u00f3n distinta de efectivos en Romanovka",
    "https://content.govdelivery.com/accounts/USWWICC/bulletins/331a06a"
  )
};

function romanovka1919Fix() {
  const hierarchySources = [
    SOURCES.armyMedicalHistory,
    SOURCES.armyOrderOfBattle,
    SOURCES.armyCampaignHistory,
    SOURCES.worldWarICentennial
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate terrestre",
    conflictType: "intervencion",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1919,
    endYear: 1919,
    region: "Romanovka, cerca de Vladivostok y del ferrocarril hacia las minas de Suchan, Primorie, Rusia",
    normalizedRegion: "Romanovka, cerca de Vladivostok y del ferrocarril hacia las minas de Suchan, Primorie, Rusia",
    cause: "Durante la intervenci\u00f3n aliada en Siberia, la Fuerza Expedicionaria Estadounidense custodiaba v\u00edas ferroviarias y el acceso a las minas de Suchan. La presencia militar extranjera, la guerra civil y la resistencia de partidarios rojos locales desembocaron en el ataque sorpresa contra el destacamento estadounidense de Romanovka.",
    outcome: "El ataque caus\u00f3 bajas muy graves al destacamento estadounidense, pero no produjo su retirada inmediata del sector. Las fuentes del Ej\u00e9rcito de Estados Unidos documentan operaciones posteriores en el valle de Suchan; GeoRisk no presenta el hecho como una victoria estrat\u00e9gica cerrada de ninguno de los bandos.",
    consequences: "Romanovka hizo visible la escalada desde la custodia ferroviaria hacia acciones militares estadounidenses en el entorno de Suchan durante junio y julio de 1919. No hubo un tratado propio de esta batalla: la retirada estadounidense de Siberia se complet\u00f3 en 1920 dentro del cierre m\u00e1s amplio de la intervenci\u00f3n.",
    chronology: [
      {
        year: 1918,
        event: "La Fuerza Expedicionaria Estadounidense en Siberia llega a Vladivostok y despliega unidades para tareas de seguridad y control de comunicaciones durante la guerra civil rusa."
      },
      {
        year: 1919,
        event: "El 25 de junio, la Compa\u00f1\u00eda A del 31.er Regimiento de Infanter\u00eda es sorprendida en Romanovka por una fuerza de partidarios rojos junto al ferrocarril de Suchan."
      },
      {
        year: 1919,
        event: "Durante junio y julio, las unidades estadounidenses realizan nuevas operaciones en el entorno de Suchan; estas acciones no se fusionan con el combate concreto de Romanovka."
      },
      {
        year: 1920,
        event: "Las fuerzas estadounidenses se retiran de Siberia, cerrando su participaci\u00f3n militar principal en este teatro."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Fuerza Expedicionaria Estadounidense en Siberia",
      "31.er Regimiento de Infanter\u00eda de Estados Unidos",
      "Valle de Suchan",
      "Vladivostok"
    ],
    participants: [
      {
        side: "Fuerza Expedicionaria Estadounidense en Siberia",
        members: [
          "Estados Unidos",
          "Ej\u00e9rcito de Estados Unidos",
          "Fuerza Expedicionaria Estadounidense en Siberia",
          "31.er Regimiento de Infanter\u00eda de Estados Unidos",
          "Compa\u00f1\u00eda A",
          "Lawrence D. Butler"
        ],
        casualties: "Las series oficiales no coinciden por completo: la historia m\u00e9dica del Ej\u00e9rcito registra 19 muertos y 26 heridos en Romanovka, mientras otra referencia de la misma serie registra 19 muertos y 27 heridos trasladados. La historia de campa\u00f1a cita 18 muertos y 24 heridos. GeoRisk no suma ni elige una cifra nueva."
      },
      {
        side: "Partidarios rojos de la regi\u00f3n de Suchan",
        members: [
          "Partidarios rojos",
          "Fuerzas bolcheviques locales",
          "Combatientes de la regi\u00f3n de Suchan"
        ],
        casualties: "Las fuentes oficiales utilizadas no ofrecen un total conciliado de bajas partidarias. Las estimaciones estadounidenses del tama\u00f1o de la fuerza atacante oscilan entre 250, 300 y 400 hombres; GeoRisk no las convierte en una cifra de bajas ni en una fuerza definitiva."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "25 de junio de 1919. Las fuentes del Ej\u00e9rcito de Estados Unidos coinciden en la fecha, el sector de Romanovka y la vinculaci\u00f3n con la intervenci\u00f3n en Siberia, aunque difieren en efectivos y bajas.",
    sourceDispute: "La entrada importada solo dec\u00eda Batalla de Romanovka, sin fecha ni guerra padre, y estaba clasificada de forma gen\u00e9rica en Am\u00e9rica. Las fuentes oficiales estadounidenses coinciden en que el combate ocurri\u00f3 el 25 de junio de 1919, involucr\u00f3 a la Compa\u00f1\u00eda A del 31.er Regimiento de Infanter\u00eda y se produjo junto al ferrocarril de Suchan durante la intervenci\u00f3n aliada en Siberia. Sin embargo, sus cifras no son id\u00e9nticas: la historia m\u00e9dica registra 70 hombres y 19 muertos con 26 heridos, otra p\u00e1gina de esa serie indica 19 muertos y 27 heridos hospitalizados, la historia de campa\u00f1a cita 18 muertos y 24 heridos, y otras fuentes institucionales estiman entre 250, 300 y 400 atacantes. La ficha conserva el rango y no lo transforma en una estad\u00edstica cerrada. Rusia se incorpora como ubicaci\u00f3n actual para navegaci\u00f3n, no como atribuci\u00f3n de beligerancia a un Estado ruso contempor\u00e1neo.",
    curationPriority: "alta",
    curationBatch: "source-backed-romanovka-1919-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Batalla de Romanovka se normaliza como Batalla de Romanovka (25 de junio de 1919), dentro de la Guerra civil rusa y de la Intervenci\u00f3n aliada en Siberia. La ficha no la presenta como una guerra declarada bilateral entre Estados Unidos y Rusia, ni mezcla este combate con la intervenci\u00f3n aliada en el norte de Rusia, con otras localidades llamadas Romanovka o con las operaciones posteriores del valle de Suchan."
  };
}

export const ROMANOVKA_1919_CONFLICT_RENAMES = {
  "Batalla de Romanovka": CANONICAL,
  "Battle of Romanovka": CANONICAL,
  "Romanovka Battle": CANONICAL,
  "Battle of Romanovka (1919)": CANONICAL
};

export const ROMANOVKA_1919_COUNTRY_CONFLICT_ADDITIONS = {
  Rusia: [CANONICAL]
};

export const ROMANOVKA_1919_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: romanovka1919Fix()
};
