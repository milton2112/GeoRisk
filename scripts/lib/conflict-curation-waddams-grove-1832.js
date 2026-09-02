function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate de Yellow Creek (Waddams Grove, 18 de junio de 1832)";
const PARENT = "Guerra de Black Hawk";
const CAMPAIGN = "Operaciones de Yellow Creek y Apple River de junio de 1832";

const SOURCES = {
  illinoisDnrAppleRiver: source(
    "Illinois Department of Natural Resources, Apple River Fort: contexto estatal de la Guerra de Black Hawk de 1832 y de las operaciones en el noroeste de Illinois",
    "https://dnrhistoric.illinois.gov/experience/sites/northwest/apple-river.html"
  ),
  universityOfIllinoisStephenson: source(
    "University of Illinois Library, History of Stephenson County: relato historiogr\u00e1fico local que fecha el encuentro de James W. Stephenson en Yellow Creek el 18 de junio de 1832, a unos doce millas de Kellogg's Grove; GeoRisk no replica su lenguaje hist\u00f3rico desactualizado",
    "https://libsysdigi.library.illinois.edu/oca/Books2007-09/historyofstephenv1fulw/historyofstephenv1fulw.pdf"
  ),
  illinoisDnrWaddamsSurvey: source(
    "Illinois Department of Natural Resources, estudio hist\u00f3rico de Waddams Grove: documenta el asentamiento posterior de William Waddams y permite distinguir la referencia geogr\u00e1fica retrospectiva del sitio del combate de 1832",
    "https://dnrhistoric.illinois.gov/content/dam/soi/en/web/dnrhistoric/preserve/recordation/waddams-grove-survey.pdf"
  ),
  wisconsinHistoricalSociety: source(
    "Wisconsin Historical Society: s\u00edntesis hist\u00f3rica y documental de la Guerra de Black Hawk de 1832",
    "https://legacy.wisconsinhistory.org/Records/Article/CS464"
  )
};

function waddamsGrove1832Fix() {
  const hierarchySources = [
    SOURCES.illinoisDnrAppleRiver,
    SOURCES.universityOfIllinoisStephenson,
    SOURCES.illinoisDnrWaddamsSurvey,
    SOURCES.wisconsinHistoricalSociety
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate terrestre",
    conflictType: "colonial",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1832,
    endYear: 1832,
    region: "Cercan\u00edas de Yellow Creek, al este de Kellogg's Grove, actual condado de Stephenson, Illinois, Estados Unidos",
    normalizedRegion: "Cercan\u00edas de Yellow Creek, al este de Kellogg's Grove, actual condado de Stephenson, Illinois, Estados Unidos",
    cause: "El combate se produjo durante la Guerra de Black Hawk de 1832, en un contexto de despojo territorial ind\u00edgena y expansi\u00f3n de asentamientos estadounidenses. Tras denuncias de toma de caballos en el \u00e1rea de Apple River, voluntarios de la milicia de Illinois al mando de James W. Stephenson emprendieron una persecuci\u00f3n y encontraron a una partida sauk cerca de Yellow Creek.",
    outcome: "Tras varias cargas contra una zona de matorral, Stephenson result\u00f3 herido y su destacamento se retir\u00f3. Los relatos posteriores no emplean un mismo criterio para efectivos, bajas o victoria t\u00e1ctica; GeoRisk lo clasifica como un combate local sin vencedor estrat\u00e9gico decisivo y no publica una cifra cerrada.",
    consequences: "La acci\u00f3n fue parte de una secuencia de choques locales de junio de 1832 en torno a Yellow Creek, Kellogg's Grove y Apple River. No cerr\u00f3 la Guerra de Black Hawk: las operaciones continuaron hacia Wisconsin y terminaron meses despu\u00e9s en Bad Axe, con consecuencias de desplazamiento forzado para pueblos ind\u00edgenas de la regi\u00f3n.",
    chronology: [
      {
        year: 1832,
        event: "La Guerra de Black Hawk se desarroll\u00f3 en Illinois y el actual Wisconsin despu\u00e9s del regreso de la banda de Black Hawk al este del Misisipi; las operaciones combinaron movimientos militares, asentamientos y comunidades ind\u00edgenas."
      },
      {
        year: 1832,
        event: "A mediados de junio, la toma de caballos y otros incidentes en el corredor de Apple River motivaron patrullas y persecuciones de milicias locales."
      },
      {
        year: 1832,
        event: "El 18 de junio, el destacamento de James W. Stephenson alcanz\u00f3 a una partida sauk cerca de Yellow Creek, a unos doce millas al este de Kellogg's Grove, y se produjo el combate."
      },
      {
        year: 1832,
        event: "La guerra continu\u00f3 fuera de este sitio; la derrota en Bad Axe, en agosto, marc\u00f3 el fin militar de la campa\u00f1a y no es un desenlace propio de Yellow Creek."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Batalla de Kellogg's Grove",
      "Batalla del fuerte Apple River",
      "Batalla de Bad Axe",
      "James W. Stephenson",
      "Yellow Creek",
      "Waddams Grove"
    ],
    participants: [
      {
        side: "Milicia voluntaria de Illinois",
        members: [
          "Estados Unidos",
          "Milicia de Illinois",
          "Voluntarios de James W. Stephenson",
          "James W. Stephenson"
        ],
        casualties: "El relato historiogr\u00e1fico local identifica muertes en el destacamento y una herida grave de Stephenson, pero no se dispone de una relaci\u00f3n contempor\u00e1nea conciliada de efectivos, muertos y heridos. GeoRisk no publica un total cerrado."
      },
      {
        side: "Partida sauk",
        members: [
          "Sauk",
          "Partida sauk"
        ],
        casualties: "No hay un parte equivalente que permita identificar y reconciliar todas las bajas sauk. Los recuentos posteriores difieren; GeoRisk conserva la incertidumbre y no transforma estimaciones narrativas en un total definitivo."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "18 de junio de 1832; la historia digitalizada del condado de Stephenson sit\u00faa el encuentro de Stephenson en Yellow Creek.",
    sourceDispute: "La entrada importada solo dec\u00eda Batalla de Waddams Grove, sin fecha ni guerra padre. El relato historiogr\u00e1fico local la denomina Captain Stephenson's Battle y la sit\u00faa en Yellow Creek, aproximadamente doce millas al este de Kellogg's Grove. La documentaci\u00f3n hist\u00f3rica estatal indica que el asentamiento de William Waddams se desarroll\u00f3 despu\u00e9s de la guerra, por lo que Waddams Grove funciona como referencia geogr\u00e1fica retrospectiva y no como una denominaci\u00f3n contempor\u00e1nea exacta; GeoRisk conserva ambos nombres como aliases. Los relatos posteriores tampoco concilian bajas ni resultado: algunos la presentan como victoria menor estadounidense y otros destacan la retirada de Stephenson herido. La ficha no fija un vencedor decisivo ni convierte cifras variables en un balance cerrado.",
    curationPriority: "alta",
    curationBatch: "source-backed-waddams-grove-1832-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Batalla de Waddams Grove se normaliza como Combate de Yellow Creek (Waddams Grove, 18 de junio de 1832), dentro de la Guerra de Black Hawk. Operaciones de Yellow Creek y Apple River de junio de 1832 es una categor\u00eda organizativa de GeoRisk, no una denominaci\u00f3n militar oficial. La ficha no mezcla este choque con la primera o segunda batalla de Kellogg's Grove, el ataque al fuerte Apple River ni la batalla de Bad Axe."
  };
}

export const WADDAMS_GROVE_1832_CONFLICT_RENAMES = {
  "Batalla de Waddams Grove": CANONICAL,
  "Battle of Waddams Grove": CANONICAL,
  "Batalla de Yellow Creek": CANONICAL,
  "Battle of Yellow Creek": CANONICAL,
  "Captain Stephenson's Battle": CANONICAL,
  "Captain Stephenson's Fight": CANONICAL,
  "Stephenson's Fight": CANONICAL
};

export const WADDAMS_GROVE_1832_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: waddamsGrove1832Fix()
};
