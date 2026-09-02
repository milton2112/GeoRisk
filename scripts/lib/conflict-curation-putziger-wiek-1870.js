function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate naval en Putziger Wiek (23 de agosto de 1870)";
const PARENT = "Guerra franco-prusiana (1870-1871)";
const CAMPAIGN = "Operaciones navales del B\u00e1ltico de 1870";

const SOURCES = {
  bavarianStateLibrary: source(
    "Deutsche Digitale Bibliothek y Bayerische Staatsbibliothek: Die Campagne von 1870 in der Nord- und Ostsee (1871), que preserva el informe de Johannes Weickhmann sobre el combate de Nymphe",
    "https://www.deutsche-digitale-bibliothek.de/item/ANSZ76WSECXWDP3ZA4CIWOSK72RS66RX",
    "media"
  ),
  darmstadtHistoricalJournal: source(
    "Universitats- und Landesbibliothek Darmstadt: articulo historico de 1927 que reconstruye la salida nocturna de Nymphe y el contacto con los buques franceses anclados en Putziger Wiek",
    "https://exist.ulb.tu-darmstadt.de/3/v/pa000233-0213",
    "media"
  ),
  danzigMaritimeHistory: source(
    "Danziger Seeschiff, preservado por la Staats- und Universitatsbibliothek Hamburg: material historico sobre el ataque de Nymphe y una fuente periodistica de Danzig de agosto de 1870",
    "https://epub.sub.uni-hamburg.de/epub/volltexte/2015/47571/pdf/SEESCHIFF_17.pdf",
    "media"
  )
};

function putzigerWiek1870Fix() {
  const hierarchySources = [
    SOURCES.bavarianStateLibrary,
    SOURCES.darmstadtHistoricalJournal,
    SOURCES.danzigMaritimeHistory
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
    region: "Putziger Wiek, bahia de Puck, golfo de Gdansk, mar B\u00e1ltico; actual Polonia",
    normalizedRegion: "Bahia de Puck y golfo de Gdansk, Polonia",
    cause: "Durante la Guerra franco-prusiana, una escuadra francesa operaba en el B\u00e1ltico para bloquear los puertos nortealemanes. La corbeta Nymphe salio de Neufahrwasser para reconocer y hostigar a las unidades francesas ancladas en Putziger Wiek.",
    outcome: "Combate naval inconcluso durante la madrugada del 23 de agosto de 1870. Nymphe disparo dos andanadas y se retiro hacia Neufahrwasser ante la respuesta francesa; la persecucion se interrumpio poco despues. GeoRisk no presenta el episodio como una victoria decisiva ni fija bajas o danos porque los relatos no concilian esas cifras.",
    consequences: "La accion no altero el curso de la Guerra franco-prusiana ni resolvio el bloqueo naval frances. Ilustro las restricciones de las operaciones de grandes blindados franceses cerca de la costa y las aguas someras del B\u00e1ltico, mientras la actividad naval prosiguio durante las semanas siguientes.",
    chronology: [
      {
        year: 1870,
        event: "En agosto, la escuadra francesa del B\u00e1ltico operaba frente a la costa nortealemana con el objetivo de bloquear puertos y vigilar el trafico maritimo."
      },
      {
        year: 1870,
        event: "El 21 y 22 de agosto, unidades francesas fueron avistadas frente a Danzig y anclaron en Putziger Wiek."
      },
      {
        year: 1870,
        event: "En la noche del 22 al 23 de agosto, la corbeta Nymphe salio de Neufahrwasser al mando de Johannes Weickhmann y se acerco al fondeadero frances."
      },
      {
        year: 1870,
        event: "Ya el 23 de agosto, Nymphe intercambio fuego con la escuadra francesa, se retiro y regreso a Neufahrwasser tras una persecucion breve."
      },
      {
        year: 1870,
        event: "La accion se mantuvo como un episodio local de las operaciones navales del B\u00e1ltico, sin un tratado o cierre propio."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Putziger Wiek",
      "bahia de Puck",
      "golfo de Gdansk",
      "Neufahrwasser",
      "Danzig",
      "SMS Nymphe",
      "Johannes Weickhmann",
      "Louis Edouard Bouet-Willaumez",
      "Escuadra francesa del B\u00e1ltico"
    ],
    participants: [
      {
        side: "Corbeta de la Confederacion Alemana del Norte",
        members: [
          "Confederacion Alemana del Norte",
          "Marina de la Confederacion Alemana del Norte",
          "SMS Nymphe",
          "Johannes Weickhmann"
        ],
        casualties: "Las fuentes revisadas no permiten establecer bajas humanas ni danos materiales confirmados para la corbeta. GeoRisk no deduce un balance a partir de la retirada."
      },
      {
        side: "Escuadra francesa del B\u00e1ltico",
        members: [
          "Segundo Imperio frances",
          "Marina Imperial francesa",
          "Louis Edouard Bouet-Willaumez",
          "Surveillante",
          "Thetis",
          "unidades francesas de apoyo"
        ],
        casualties: "Los relatos difieren entre ausencia de bajas confirmadas y una noticia alemana posterior sobre dieciocho marinos franceses muertos. Sin un parte frances equivalente ni conciliacion entre fuentes, GeoRisk no publica un total."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "Madrugada del 23 de agosto de 1870. El informe de Weickhmann se titulo con fecha 22 de agosto aunque su propia secuencia situa el intercambio de fuego tras la medianoche; la ficha conserva la fecha historica de 23 de agosto y el cruce nocturno 22-23 como contexto.",
    sourceDispute: "Las fuentes no identifican de manera uniforme todos los blindados franceses ni el buque que siguio a Nymphe. Tambien difieren sobre el alcance del fuego y las bajas: una noticia alemana posterior difundio dieciocho muertos franceses, mientras otros relatos no registran danos personales o materiales verificables. La ficha se limita a las unidades y la secuencia coincidentes, no adjudica victoria estrategica y no convierte la fecha editorial del informe en una fecha de combate distinta.",
    curationPriority: "alta",
    curationBatch: "source-backed-putziger-wiek-1870-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada recibida como Battle of Putziger Wiek aparecia solo bajo Francia, sin fecha, lugar, contraparte ni guerra especifica. Se normaliza como Combate naval en Putziger Wiek (23 de agosto de 1870), dentro de la Guerra franco-prusiana, y se agrega Alemania y Polonia para navegacion contemporanea. Alemania representa a la Confederacion Alemana del Norte y Polonia el lugar actual de la bahia; ninguno sustituye a las entidades historicas de los bandos. La ficha no mezcla este episodio con el combate de Hiddensee ni con otros choques navales de 1870."
  };
}

export const PUTZIGER_WIEK_1870_CONFLICT_RENAMES = {
  "Battle of Putziger Wiek": CANONICAL,
  "Batalla de Putziger Wiek": CANONICAL,
  "Combate naval de Putziger Wiek": CANONICAL,
  "Seegefecht in der Putziger Wiek": CANONICAL,
  "Sea fight in Putziger Wiek": CANONICAL,
  "Putziger Wiek naval action": CANONICAL
};

export const PUTZIGER_WIEK_1870_COUNTRY_CONFLICT_ADDITIONS = {
  Alemania: [CANONICAL],
  Polonia: [CANONICAL]
};

export const PUTZIGER_WIEK_1870_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: putzigerWiek1870Fix()
};
