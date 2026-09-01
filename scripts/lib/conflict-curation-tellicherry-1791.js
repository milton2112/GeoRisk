function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate naval de Tellicherry (1791)";
const PARENT = "Tercera guerra anglo-mysore (1790-1792)";
const CAMPAIGN = "Operaciones navales de interdiccion frente a Malabar (1791)";

const SOURCES = {
  diromNarrative: source(
    "Alexander Dirom, A Narrative of the Campaign in India... (1793): relato britanico contemporaneo del frente que identifica a Resolue, Phoenix y Perseverance frente a Tellicherry",
    "https://commons.wikimedia.org/wiki/File:Narrative_of_the_campaign_in_India_which_terminated_the_war_with_Tippoo_Sultan_in_1792_(IA_dli.venugopal.389).pdf",
    "media"
  ),
  jamesNavalHistory: source(
    "William James, The Naval History of Great Britain: reconstruccion naval temprana sobre la orden de registrar el convoy, la resistencia francesa y el envio de Resolue a Tellicherry",
    "https://www.ibiblio.org/pha/USN/Navy/navalhistoryofgr01jameuoft.pdf",
    "media"
  ),
  strachanBiography: source(
    "John Marshall, Royal Naval Biography, entrada de Richard John Strachan: biografia naval que documenta el choque, las bajas britanicas y la devolucion de Resolue a Mahe",
    "https://en.wikisource.org/wiki/Royal_Naval_Biography/Strachan,_Richard_John",
    "media"
  )
};

function tellicherry1791Fix() {
  const hierarchySources = [
    SOURCES.diromNarrative,
    SOURCES.jamesNavalHistory,
    SOURCES.strachanBiography
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
    startYear: 1791,
    endYear: 1791,
    region: "Frente a Tellicherry/Thalassery, costa de Malabar, actual Kerala, India",
    normalizedRegion: "Costa de Malabar, India",
    cause: "Durante la Tercera guerra anglo-mysore, un escuadron britanico en Tellicherry intento registrar un convoy frances que salia de Mahe hacia Mangalore. El mando britanico sospechaba que podia llevar suministros para Mysore; la fragata francesa Resolue rechazo el registro. La ficha conserva esa sospecha como posicion britanica, no como prueba de contrabando.",
    outcome: "Resultado tactico britanico limitado: segun las fuentes navales britanicas, Resolue resistio el registro, fue obligada a arriar sus colores tras un combate breve y remolcada a Tellicherry. La inspeccion posterior no hallo contrabando en los mercantes y la fragata fue devuelta a Mahe. GeoRisk no presenta el episodio como una victoria estrategica ni como una guerra declarada entre Francia y Gran Bretana.",
    consequences: "El choque evidencio la tension entre la interdiccion britanica de suministros y la neutralidad francesa en la costa de Malabar. No decidio la Tercera guerra anglo-mysore ni abrio una guerra formal franco-britanica; su importancia fue local, naval y diplomatica.",
    chronology: [
      {
        year: 1790,
        event: "Comenzo la Tercera guerra anglo-mysore entre la Compania Britanica de las Indias Orientales y el Reino de Mysore, con apoyo de la Royal Navy en la costa de Malabar."
      },
      {
        year: 1791,
        event: "En noviembre, una fragata francesa y dos mercantes salieron de Mahe hacia Mangalore mientras una fuerza britanica permanecia en Tellicherry."
      },
      {
        year: 1791,
        event: "Phoenix y Perseverance recibieron la orden de detener y registrar el convoy. Resolue se resistio y se produjo un combate naval breve."
      },
      {
        year: 1791,
        event: "Resolue arri\u00f3 sus colores y fue remolcada a Tellicherry. Los mercantes fueron inspeccionados y continuaron su viaje; la fragata regreso despues a Mahe."
      },
      {
        year: 1792,
        event: "La Tercera guerra anglo-mysore concluyo en 1792; el combate de Tellicherry no se presenta como su desenlace."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Tellicherry",
      "Thalassery",
      "Mahe",
      "Mangalore",
      "HMS Phoenix",
      "HMS Perseverance",
      "Resolue",
      "Richard Strachan",
      "William Cornwallis",
      "Tipu Sultan"
    ],
    participants: [
      {
        side: "Fuerzas navales britanicas",
        members: [
          "Reino de Gran Bretana",
          "Royal Navy",
          "HMS Phoenix",
          "HMS Perseverance",
          "Richard Strachan",
          "Isaac Smith",
          "William Cornwallis"
        ],
        casualties: "Las fuentes navales britanicas coinciden en seis muertos y once heridos en Phoenix. GeoRisk no usa ese dato para inferir un total bilateral ni para convertir las cifras britanicas en un balance completo del combate."
      },
      {
        side: "Fuerzas navales francesas",
        members: [
          "Reino de Francia",
          "Marina francesa",
          "fragata Resolue",
          "convoy frances procedente de Mahe",
          "capitan Callamand"
        ],
        casualties: "Los relatos britanicos coinciden en veinticinco muertos franceses, pero difieren entre cuarenta y sesenta heridos. No se consulto un parte frances equivalente, por lo que GeoRisk no fija una tabla francesa definitiva."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "Noviembre de 1791: las fuentes revisadas coinciden en el mes, pero las narraciones tempranas lo sit\u00faan al principio o hacia el final y no permiten fijar un dia unico con seguridad.",
    sourceDispute: "Las fuentes britanicas revisadas coinciden en la secuencia general: intento de registro, resistencia de Resolue, arriado de colores, inspeccion y retorno a Mahe. Sin embargo, describen el momento como comienzo o final de noviembre y las sintesis posteriores proponen dias concretos sin respaldo uniforme en esta base. Tambien difieren en los heridos franceses. Ademas, la acusacion de que el convoy llevaba apoyo militar para Mysore procede del lado britanico, mientras la inspeccion posterior no hallo contrabando en los mercantes. Por ello la ficha conserva noviembre de 1791, evita un dia exacto y no trata la sospecha britanica como una prueba ni a Mysore como beligerante directo de la accion naval.",
    curationPriority: "alta",
    curationBatch: "source-backed-tellicherry-1791-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior figuraba como Batalla de Tellicherry, solo bajo Francia y dentro de un conflicto regional de Europa, sin fecha, lugar, contraparte ni fuentes. Se normaliza como Combate naval de Tellicherry (1791), se ubica en la costa de Malabar dentro de la Tercera guerra anglo-mysore y se agrega Reino Unido e India para navegacion contemporanea. Reino Unido representa a Gran Bretana como referencia institucional actual e India representa el lugar actual; ninguno sustituye las entidades historicas de los bandos. Mysore queda como contexto de la interdiccion, no como combatiente directo."
  };
}

export const TELLICHERRY_1791_CONFLICT_RENAMES = {
  "Batalla de Tellicherry": CANONICAL,
  "Batalla naval de Tellicherry": CANONICAL,
  "Combate naval de Tellicherry": CANONICAL,
  "Battle of Tellicherry": CANONICAL,
  "Tellicherry naval battle": CANONICAL
};

export const TELLICHERRY_1791_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL],
  India: [CANONICAL]
};

export const TELLICHERRY_1791_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: tellicherry1791Fix()
};
