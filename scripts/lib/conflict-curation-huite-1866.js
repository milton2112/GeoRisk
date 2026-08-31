function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate de Huite (2 de marzo de 1866)";
const PARENT = "Guerra hispano-sudamericana";
const CAMPAIGN = "Segunda expedici\u00f3n a Chilo\u00e9 (1866)";

const SOURCES = {
  museoVicunaMackenna: source(
    "Museo Nacional Benjamin Vicu\u00f1a Mackenna, Servicio Nacional del Patrimonio Cultural: edicion de Historia de la Guerra de Chile con Espa\u00f1a que conserva el parte oficial del tiroteo de Tubildad firmado en Huite el 2 de marzo de 1866",
    "https://www.museovicunamackenna.gob.cl/publicaciones/historia-de-la-guerra-de-chile-con-espana-de-1863-1866"
  ),
  museoAncud: source(
    "Museo Regional de Ancud: Historia de Chilo\u00e9, fecha del 2 de marzo de 1866, recorrido de Numancia y Blanca, y distincion geografica entre Huite al norte de Quemchi y Huito en el continente",
    "https://www.museodeancud.gob.cl/sites/www.museodeancud.gob.cl/files/images/articles-24913_archivo_01.pdf"
  ),
  universidadSevilla: source(
    "Universidad de Sevilla, Temas Americanistas: estudio historico que identifica el combate de Huite como ataque desde tierra del 2 de marzo y sigue la maniobra espanola hacia Abtao e isla Tabon",
    "https://idus.us.es/server/api/core/bitstreams/fbc077a2-00da-4a9a-8b8b-c40e80700d02/content"
  ),
  memoriaChilena: source(
    "Memoria Chilena, Biblioteca Nacional de Chile: contexto de la Guerra contra Espa\u00f1a de 1865-1866 y sus cierres diplomaticos posteriores",
    "https://www.memoriachilena.gob.cl/602/w3-article-92282.html"
  )
};

function huite1866Fix() {
  const hierarchySources = [
    SOURCES.museoVicunaMackenna,
    SOURCES.museoAncud,
    SOURCES.universidadSevilla,
    SOURCES.memoriaChilena
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate naval y costero",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1866,
    endYear: 1866,
    region: "Caleta Huite o Puerto Oscuro, al norte de Quemchi, Isla Grande de Chilo\u00e9, Chile",
    normalizedRegion: "Huite, Chilo\u00e9, Chile",
    cause: "Tras el combate de Abtao, la division espanola de la Escuadra del Pacifico, con Numancia y Blanca, buscaba a la escuadra aliada en los canales de Chilo\u00e9. Las fuerzas chilenas establecieron posiciones terrestres en Huite o Tubildad para impedir un desembarco y hostilizar a los buques si se acercaban.",
    outcome: "Sin resultado estrategico decisivo. El 2 de marzo, fuerzas chilenas abrieron fuego desde posiciones costeras contra la escuadra espanola; la accion no produjo la captura de buques ni un desembarco confirmado. La investigacion academica consultada describe que los buques espanoles rechazaron el ataque y continuaron hacia Abtao, mientras que las fuentes locales conservan la retirada y las limitaciones de navegacion. GeoRisk no declara una victoria unilateral ni publica bajas agregadas no comparables.",
    consequences: "El combate formo parte de la segunda expedicion espanola a Chilo\u00e9 y no altero por si solo el curso de la Guerra hispano-sudamericana. La escuadra continuo sus operaciones en el Pacifico, incluida la posterior presion sobre Valparaiso. El cierre diplomatico de la guerra fue posterior y general: tregua en 1867, armisticio en 1871 y tratado de paz definitivo en 1883.",
    chronology: [
      {
        year: 1865,
        event: "Chile entro en guerra con Espa\u00f1a durante la escalada regional vinculada a la ocupacion espanola de las islas Chincha y a las tensiones navales en el Pacifico."
      },
      {
        year: 1866,
        event: "El 7 de febrero, el combate de Abtao dejo a la escuadra espanola buscando a las fuerzas aliadas chileno-peruanas en los canales de Chilo\u00e9."
      },
      {
        year: 1866,
        event: "El 2 de marzo, la fragata blindada Numancia y la fragata Blanca se situaron frente a Huite o Tubildad; las fuerzas chilenas de costa abrieron fuego desde posiciones ocultas."
      },
      {
        year: 1866,
        event: "Los relatos coinciden en que la accion no produjo una toma de Huite ni la captura de naves. Las fuentes difieren al describir el alcance tactico y las bajas, por lo que la ficha no fija una cifra ni un vencedor total."
      },
      {
        year: 1866,
        event: "La division espanola prosiguio la operacion hacia Abtao e isla Tabon; el 31 de marzo bombardeo Valparaiso dentro de la misma guerra."
      }
    ],
    treaties: [
      "Tregua entre Chile y Espa\u00f1a (1867)",
      "Armisticio entre Chile y Espa\u00f1a (1871)",
      "Tratado de paz definitivo entre Chile y Espa\u00f1a (1883)"
    ],
    related: [PARENT, CAMPAIGN, "Combate de Abtao", "Huite", "Tubildad", "Huito", "Chilo\u00e9", "Casto M\u00e9ndez N\u00fa\u00f1ez", "mayor Jorge Wood", "fragata Numancia", "fragata Blanca"],
    participants: [
      {
        side: "Fuerzas chilenas de costa en Huite o Tubildad",
        members: ["Chile", "Ej\u00e9rcito de Chile", "Batallon No. 4 Ancud", "mayor Jorge Wood", "destacamentos chilenos de costa"],
        casualties: "Las fuentes consultadas no ofrecen una tabla bilateral comparable. Los relatos chilenos no registran bajas propias consolidadas durante la accion; GeoRisk conserva esa ausencia sin convertirla en una cifra cerrada."
      },
      {
        side: "Division espa\u00f1ola de la Escuadra del Pacifico",
        members: ["Espa\u00f1a", "Armada Espa\u00f1ola", "Escuadra del Pacifico", "almirante Casto M\u00e9ndez N\u00fa\u00f1ez", "fragata blindada Numancia", "fragata Blanca"],
        casualties: "El parte espanol citado por la historiografia informa que no hubo bajas, mientras que el informe de Jorge Wood sostuvo haber causado varias. Como los relatos no son compatibles, GeoRisk no publica un total espanol."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "2 de marzo de 1866",
    sourceDispute: "El mismo episodio aparece como Combate de Huite, Accion de Tubildad y tiroteo de Tubildad. El Museo Regional de Ancud subraya que Huite, caleta al norte de Quemchi, no debe confundirse con Huito, estero continental donde hubo un intercambio distinto mientras pasaban los buques espanoles. El Museo Nacional Benjamin Vicu\u00f1a Mackenna conserva el parte chileno de Tubildad firmado en Huite el 2 de marzo, y el estudio de la Universidad de Sevilla denomina a la accion de ese dia Combate de Huite. GeoRisk conserva ambos aliases, no fusiona Huite con Huito y no arbitra entre el parte espanol sin bajas y la afirmacion chilena de bajas causadas.",
    curationPriority: "alta",
    curationBatch: "source-backed-huite-1866-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior aparecia solo para Chile, repetida entre listas generales y militares, sin fecha, contraparte, lugar, guerra, campana, resultado ni fuentes verificables y bajo un conflicto regional generico. Se normaliza como Combate de Huite (2 de marzo de 1866), se vincula a la Guerra hispano-sudamericana y se agrega Espa\u00f1a para navegacion de ambos lados. La correccion explica la distincion Huite/Huito y evita convertir relatos incompatibles sobre bajas o resultado en afirmaciones cerradas."
  };
}

export const HUITE_1866_CONFLICT_RENAMES = {
  "Combate de Huite": CANONICAL,
  "Combate de Huite (1866)": CANONICAL,
  "Combate de Huite (2 de marzo de 1866)": CANONICAL,
  "Acci\u00f3n de Tubildad": CANONICAL,
  "Accion de Tubildad": CANONICAL,
  "Tiroteo de Tubildad": CANONICAL,
  "Battle of Huite": CANONICAL
};

export const HUITE_1866_COUNTRY_CONFLICT_ADDITIONS = {
  "Espa\u00f1a": [CANONICAL]
};

export const HUITE_1866_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: huite1866Fix()
};
