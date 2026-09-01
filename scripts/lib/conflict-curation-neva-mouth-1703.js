function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate naval en la desembocadura del Neva (7/18 de mayo de 1703)";
const PARENT = "Gran Guerra del Norte";
const CAMPAIGN = "Operaciones rusas en la desembocadura del Neva (mayo de 1703)";

const SOURCES = {
  balticStudy: source(
    "Universidad de Gdansk, Arkadiusz Janicki, Russian Expansion in the Baltic in the 18th Century: estudio acad\u00e9mico que fecha el combate el 7/18 de mayo de 1703 e identifica el abordaje de Gedan y Astrild",
    "https://ejournals.eu/en/journal_article_files/full_text/018ecee1-53a9-7143-ad8f-49e8b3be730d/download"
  ),
  menshikovStudy: source(
    "Universidad Pontificia Juan Pablo II de Cracovia, Pawel Krokosz, estudio sobre Aleksandr Menshikov que vincula el combate del 7 de mayo con la toma rusa de Nyenschantz y la captura de Gedan y Astrild",
    "https://czasopisma.ignatianum.edu.pl/pk/article/download/1428/pdf/"
  ),
  swedishCollection: source(
    "Repertorio digital de la colecci\u00f3n Historiska planscher de la Biblioteca Real de Suecia: registro de la toma rusa de los buques suecos Astrild y Gedan el 7 de mayo de 1703",
    "https://goran.baarnhielm.net/kb/Snoilsky/Sno_CXII.htm"
  )
};

function nevaMouth1703Fix() {
  const hierarchySources = [
    SOURCES.balticStudy,
    SOURCES.menshikovStudy,
    SOURCES.swedishCollection
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate naval de abordaje",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1703,
    endYear: 1703,
    region: "Desembocadura del r\u00edo Neva, golfo de Finlandia, cerca de la actual San Petersburgo, Rusia",
    normalizedRegion: "Desembocadura del r\u00edo Neva, Rusia",
    cause: "Durante la Gran Guerra del Norte, el Zarato ruso buscaba recuperar una salida al B\u00e1ltico y acababa de ocupar la fortaleza sueca de Nyenschantz. Una fuerza sueca que lleg\u00f3 a la desembocadura del Neva para apoyar la posici\u00f3n encontr\u00f3 dos naves menores expuestas al avance ruso por el r\u00edo.",
    outcome: "Victoria t\u00e1ctica rusa: dos compa\u00f1\u00edas rusas en botes de remos abordaron y capturaron las naves suecas Gedan y Astrild durante la noche. Fue un \u00e9xito local y simb\u00f3lico para la naciente fuerza b\u00e1ltica rusa, no una decisi\u00f3n de la Gran Guerra del Norte ni el fin inmediato de la superioridad naval sueca.",
    consequences: "La toma reforz\u00f3 el control ruso de la desembocadura del Neva y qued\u00f3 asociada a la consolidaci\u00f3n posterior de San Petersburgo y de una flota b\u00e1ltica rusa. La guerra sigui\u00f3 hasta el Tratado de Nystad de 1721; el estudio acad\u00e9mico recuerda que Suecia mantuvo una posici\u00f3n fuerte en el B\u00e1ltico durante los a\u00f1os siguientes.",
    chronology: [
      {
        year: 1703,
        event: "Las fuerzas rusas ocuparon Nyenschantz, fortaleza sueca en el sistema de la desembocadura del Neva, durante la campa\u00f1a de Ingria."
      },
      {
        year: 1703,
        event: "El 7 de mayo seg\u00fan el calendario juliano, equivalente al 18 de mayo gregoriano, dos compa\u00f1\u00edas rusas dirigidas por Pedro I y Aleksandr Menshikov se acercaron en botes a dos naves suecas."
      },
      {
        year: 1703,
        event: "Las fuerzas rusas abordaron y capturaron el galliot Gedan y la nave Astrild; las fuentes acad\u00e9micas lo presentan como la primera victoria rusa en el B\u00e1ltico."
      },
      {
        year: 1703,
        event: "Rusia consolid\u00f3 posiciones en el delta del Neva y comenz\u00f3 la fundaci\u00f3n de San Petersburgo, mientras la competencia naval con Suecia continu\u00f3."
      },
      {
        year: 1721,
        event: "El Tratado de Nystad cerr\u00f3 la Gran Guerra del Norte y formaliz\u00f3 un nuevo equilibrio de poder en el B\u00e1ltico."
      }
    ],
    treaties: [
      "Tratado de Nystad (1721): cierre de la Gran Guerra del Norte"
    ],
    related: [
      PARENT,
      CAMPAIGN,
      "Ingria",
      "Nyenschantz",
      "Pedro I",
      "Aleksandr Menshikov",
      "Gedan",
      "Astrild",
      "San Petersburgo",
      "Tratado de Nystad (1721)"
    ],
    participants: [
      {
        side: "Fuerzas del Zarato ruso",
        members: [
          "Zarato ruso",
          "regimientos Preobrazhensky y Semenovsky",
          "dos compa\u00f1\u00edas rusas en botes de remos",
          "Pedro I",
          "Aleksandr Menshikov"
        ],
        casualties: "Los estudios contrastados detallan el abordaje y la captura, pero no ofrecen una tabla bilateral de muertos, heridos y prisioneros consistente entre s\u00ed. GeoRisk no fija un total."
      },
      {
        side: "Fuerzas navales del Imperio sueco",
        members: [
          "Imperio sueco",
          "Marina sueca",
          "escuadr\u00f3n de Gideon von Numers",
          "Gedan",
          "Astrild"
        ],
        casualties: "Las dos naves fueron capturadas. Las fuentes usadas no permiten consolidar con seguridad una cifra \u00fanica de bajas o prisioneros por buque, por lo que GeoRisk registra la p\u00e9rdida material sin inventar una tabla humana."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "7/18 de mayo de 1703 (calendarios juliano/gregoriano)",
    sourceDispute: "Las fuentes acad\u00e9micas coinciden en que dos naves suecas fueron abordadas y capturadas en la desembocadura del Neva dentro de la Gran Guerra del Norte. Krokosz emplea de forma expl\u00edcita el calendario juliano y fecha la acci\u00f3n el 7 de mayo; Janicki da 7/18 de mayo, por lo que la ficha conserva ambas fechas en vez de mezclar calendarios. Las reconstrucciones difieren en el n\u00famero exacto de botes, efectivos y bajas, as\u00ed que GeoRisk no convierte una narraci\u00f3n posterior en una tabla cerrada de fuerzas o v\u00edctimas.",
    curationPriority: "alta",
    curationBatch: "source-backed-neva-mouth-1703-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior lleg\u00f3 como Battle at the Mouth of the Neva, solo bajo Suecia y sin fecha, contraparte, lugar ni jerarqu\u00eda verificable. Se normaliza como Combate naval en la desembocadura del Neva (7/18 de mayo de 1703), se integra en la Gran Guerra del Norte y se agrega Rusia como referencia de navegaci\u00f3n contempor\u00e1nea. Los bandos conservan las entidades hist\u00f3ricas de 1703; la ficha se separa de la Batalla del Neva de 1240, que ya existe en el proyecto."
  };
}

export const NEVA_MOUTH_1703_CONFLICT_RENAMES = {
  "Battle at the Mouth of the Neva": CANONICAL,
  "Battle at the mouth of the Neva": CANONICAL,
  "Batalla en la desembocadura del Neva": CANONICAL,
  "Combate naval en la desembocadura del Neva": CANONICAL,
  "Seegefecht an der M\u00fcndung der Newa": CANONICAL
};

export const NEVA_MOUTH_1703_COUNTRY_CONFLICT_ADDITIONS = {
  Rusia: [CANONICAL]
};

export const NEVA_MOUTH_1703_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: nevaMouth1703Fix()
};
