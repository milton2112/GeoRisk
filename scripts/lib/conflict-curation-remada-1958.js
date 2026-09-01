function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Remada (mayo de 1958)";
const PARENT = "Crisis franco-tunecina de mayo de 1958";
const CAMPAIGN = "Enfrentamientos de Remada, Bir Amir y Oued Dekouk (mayo de 1958)";

const SOURCES = {
  unYearbook: source(
    "Anuario de las Naciones Unidas de 1958: resumen contempor\u00e1neo de las denuncias cruzadas por los incidentes de Remada y del acuerdo franco-tunecino del 17 de junio",
    "https://cdn.un.org/unyearbook/yun/pdf/1958/1958_88.pdf"
  ),
  unMemorandum: source(
    "Naciones Unidas, documento S/4019: memorando presentado por T\u00fanez sobre los hechos desde el 18 de mayo de 1958, identificado expresamente como la posici\u00f3n tunecina",
    "https://digitallibrary.un.org/record/605630"
  ),
  leMondeArchive: source(
    "Le Monde, 27 de mayo de 1958: cr\u00f3nica contempor\u00e1nea de los combates alrededor de Remada que distingue las versiones francesa y tunecina sobre el inicio y desarrollo de los choques",
    "https://www.lemonde.fr/archives/article/1958/05/27/les-unites-sahariennes-ont-degage-remada-apres-plusieurs-heures-de-combats-cinq-militaires-tues-onze-tunisiens-disparus_3125804_1819218.html"
  ),
  frenchDefenseArchive: source(
    "Service historique de la Defense de Francia: cat\u00e1logo archiv\u00edstico de \u00f3rdenes y partes de operaciones del sector de Remada en 1958",
    "https://www.servicehistorique.sga.defense.gouv.fr/ark/492094"
  )
};

function remada1958Fix() {
  const hierarchySources = [
    SOURCES.unYearbook,
    SOURCES.unMemorandum,
    SOURCES.leMondeArchive,
    SOURCES.frenchDefenseArchive
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combates terrestres y de guarnici\u00f3n",
    conflictType: "interestatal",
    scale: "regional",
    status: "hist\u00f3rico",
    active: false,
    ongoing: false,
    startYear: 1958,
    endYear: 1958,
    region: "Remada, Bir Amir y Oued Dekouk, sur de T\u00fanez",
    normalizedRegion: "Remada, T\u00fanez",
    cause: "Tras la independencia tunecina, Francia mantuvo fuerzas en varios puntos del pa\u00eds mientras se negociaba su evacuaci\u00f3n. Las fricciones por el statu quo de las guarniciones, los movimientos de tropas y el control de los puestos del sur desembocaron en choques alrededor de Remada, Bir Amir y Oued Dekouk.",
    outcome: "Resultado t\u00e1ctico disputado: los combates no dejaron un vencedor operativo inequ\u00edvoco en la ficha. Las fuerzas francesas conservaron capacidad de maniobra y emplearon apoyo a\u00e9reo seg\u00fan los relatos contempor\u00e1neos, mientras T\u00fanez llev\u00f3 la disputa al Consejo de Seguridad por considerar vulnerada su soberan\u00eda. GeoRisk no transforma la versi\u00f3n de una de las partes en una victoria concluyente.",
    consequences: "La crisis aceler\u00f3 la v\u00eda diplom\u00e1tica. El 17 de junio de 1958 Francia y T\u00fanez comunicaron a las Naciones Unidas un acuerdo para evacuar, en cuatro meses, las fuerzas francesas salvo las estacionadas en Bizerta. La situaci\u00f3n de Bizerta qued\u00f3 abierta a negociaci\u00f3n y no se presenta como resuelta por la batalla de Remada.",
    chronology: [
      {
        year: 1958,
        event: "Durante la primavera, Francia y T\u00fanez discut\u00edan el estatuto de las tropas francesas que segu\u00edan desplegadas en territorio tunecino tras la independencia."
      },
      {
        year: 1958,
        event: "El memorando tunecino presentado ante la ONU sit\u00faa incidentes desde el 18 de mayo en Bir Amir y Oued Dekouk; la denuncia formal tunecina se refiri\u00f3 a hechos desde el 19 de mayo."
      },
      {
        year: 1958,
        event: "Los d\u00edas 24 y 25 de mayo se produjeron combates en el \u00e1rea de Remada. La cr\u00f3nica contempor\u00e1nea y los documentos diplom\u00e1ticos registran versiones contrapuestas sobre el primer fuego, la aviaci\u00f3n y el desarrollo de la acci\u00f3n."
      },
      {
        year: 1958,
        event: "El 29 de mayo, T\u00fanez y Francia presentaron denuncias contrapuestas ante el Consejo de Seguridad, que pospuso el examen para facilitar conversaciones directas."
      },
      {
        year: 1958,
        event: "El 17 de junio, ambos gobiernos comunicaron el acuerdo de evacuaci\u00f3n de las fuerzas francesas de T\u00fanez, con la excepci\u00f3n temporal de Bizerta."
      }
    ],
    treaties: [
      "Intercambio de cartas franco-tunecino del 17 de junio de 1958: evacuaci\u00f3n de las fuerzas francesas de T\u00fanez, salvo Bizerta, dentro de cuatro meses"
    ],
    related: [
      PARENT,
      CAMPAIGN,
      "Remada",
      "Bir Amir",
      "Oued Dekouk",
      "Bizerta",
      "Consejo de Seguridad de las Naciones Unidas",
      "Independencia de T\u00fanez",
      "Guerra de Independencia de Argelia (contexto regional)"
    ],
    participants: [
      {
        side: "Fuerzas de la Rep\u00fablica Tunecina",
        members: [
          "Rep\u00fablica Tunecina",
          "Ej\u00e9rcito tunecino",
          "unidades tunecinas del sur",
          "puestos tunecinos de Bir Amir y Oued Dekouk"
        ],
        casualties: "Las fuentes contempor\u00e1neas publicaron recuentos parciales y no equivalentes de bajas y desaparecidos. GeoRisk no fija una cifra bilateral cerrada ni atribuye cada p\u00e9rdida a una secuencia que las fuentes contradicen."
      },
      {
        side: "Fuerzas de la Rep\u00fablica Francesa estacionadas en T\u00fanez",
        members: [
          "Rep\u00fablica Francesa",
          "guarnici\u00f3n francesa de Remada",
          "unidades francesas del sur de T\u00fanez",
          "aviaci\u00f3n francesa empleada en la zona seg\u00fan fuentes contempor\u00e1neas"
        ],
        casualties: "La prensa de la \u00e9poca recoge cifras atribuidas al mando franc\u00e9s y al gobierno tunecino, pero no existe un balance bilateral consolidado y neutral en las fuentes revisadas. GeoRisk conserva la incertidumbre."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "18-29 de mayo de 1958; los choques m\u00e1s intensos documentados por fuentes contempor\u00e1neas ocurrieron el 24 y 25 de mayo",
    sourceDispute: "El Anuario de las Naciones Unidas conserva denuncias diplom\u00e1ticas opuestas: T\u00fanez calific\u00f3 las acciones francesas como agresi\u00f3n y Francia sostuvo que respond\u00eda a medidas tunecinas y a bajas propias. La cr\u00f3nica contempor\u00e1nea de Le Monde tambi\u00e9n registra desacuerdo sobre quien abri\u00f3 fuego y sobre el empleo y origen de los aviones. Por eso la ficha no adjudica el primer disparo, una agresi\u00f3n jur\u00eddicamente probada, un ganador absoluto ni una tabla cerrada de bajas.",
    curationPriority: "alta",
    curationBatch: "source-backed-remada-1958-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior aparec\u00eda como Batalla de Remada, solo bajo T\u00fanez y dentro de un conflicto regional gen\u00e9rico de \u00c1frica, sin fecha, contraparte, fuentes ni resultado. Se normaliza como Batalla de Remada (mayo de 1958), se integra en la crisis franco-tunecina de 1958 y se agrega Francia para navegaci\u00f3n contempor\u00e1nea. No se anexa Argelia como beligerante: los documentos mencionan el contexto y una alegaci\u00f3n sobre el origen de aeronaves, pero los bandos centrales fueron T\u00fanez y las fuerzas francesas estacionadas en T\u00fanez."
  };
}

export const REMADA_1958_CONFLICT_RENAMES = {
  "batalla de Remada": CANONICAL,
  "Batalla de Remada": CANONICAL,
  "Battle of Remada": CANONICAL,
  "Bataille de Remada": CANONICAL
};

export const REMADA_1958_COUNTRY_CONFLICT_ADDITIONS = {
  Francia: [CANONICAL]
};

export const REMADA_1958_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: remada1958Fix()
};
