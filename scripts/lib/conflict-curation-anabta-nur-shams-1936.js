function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Anabta (Nur Shams, 21 de junio de 1936)";
const PARENT = "Revuelta \u00e1rabe en Palestina (1936-1939)";
const CAMPAIGN = "Fase inicial de la Revuelta \u00e1rabe en Palestina (abril-junio de 1936)";

const SOURCES = {
  jtaContemporary: source(
    "Jewish Telegraphic Agency, 23 de junio de 1936: parte contemporaneo sobre la emboscada de Anabta/Nur-el-Shems, el convoy, los refuerzos y la intervencion de aeronaves britanicas",
    "https://www.jta.org/archive/arabs-attack-hebrew-university-settlements-and-troops",
    "media"
  ),
  palestineArchive: source(
    "Palestine Archive: registro biografico-documental que identifica la participacion de Arif Abd al-Raziq en la batalla de Nur Shams dentro de la Gran Revuelta palestina de 1936-1939",
    "https://palarchive.org/index.php/Detail/objects/216116/view/pdf/export_format/_pdf_ca_objects_summary/lang/en_US",
    "media"
  ),
  britishLibraryArchive: source(
    "British Library/Qatar Digital Library, Military Lessons of the Arab Rebellion in Palestine 1936: informe archivistico de 1938 sobre la campana britanica y el empleo de aeronaves",
    "https://www.qdl.qa/en/archive/81055/vdc_100040717909.0x000048",
    "media"
  ),
  scholarlyRevision: source(
    "Matthew Kraig Kelly, The Revolt of 1936: A Revision, Journal of Palestine Studies 44(2): estudio academico de contexto sobre la Revuelta arabe en Palestina",
    "https://online.ucpress.edu/jps/issue/44/2",
    "media"
  )
};

function anabtaNurShams1936Fix() {
  const hierarchySources = [
    SOURCES.jtaContemporary,
    SOURCES.palestineArchive,
    SOURCES.britishLibraryArchive,
    SOURCES.scholarlyRevision
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "emboscada y combate terrestre",
    conflictType: "insurgencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1936,
    endYear: 1936,
    region: "Carretera entre Anabta y Nur Shams, distrito de Tulkarem, Palestina bajo Mandato britanico; actual Cisjordania",
    normalizedRegion: "Tulkarem y Anabta, Cisjordania",
    cause: "En el contexto de la Revuelta arabe en Palestina, una faccion armada palestina bloqueo con piedras la ruta de un convoy civil de autobuses escoltado por tropas britanicas y abrio fuego desde las colinas cercanas. La ficha describe la accion inmediata sin reducir las causas de la revuelta a este episodio.",
    outcome: "Resultado tactico britanico limitado: el convoy pudo continuar despues de la llegada de refuerzos y aeronaves britanicas. Los grupos palestinos se dividieron y se retiraron hacia direcciones distintas. GeoRisk no convierte esa retirada en una victoria estrategica ni publica una cifra bilateral cerrada de bajas.",
    consequences: "El combate se convirtio en una de las acciones mas visibles de la fase inicial de la revuelta y fue seguido por operaciones britanicas de busqueda en la zona. No produjo un acuerdo propio ni resolvio el conflicto politico y colonial que continuaria hasta 1939.",
    chronology: [
      {
        year: 1936,
        event: "En abril de 1936 comenzo la fase de huelga general y movilizacion armada de la Revuelta arabe en Palestina."
      },
      {
        year: 1936,
        event: "El 21 de junio, una faccion armada palestina embosco un convoy de autobuses escoltado por tropas britanicas en la carretera de Anabta y Nur Shams."
      },
      {
        year: 1936,
        event: "Refuerzos britanicos y aeronaves llegaron durante el combate; los partes contemporaneos indican que el convoy continuo y que las fuerzas palestinas se separaron al retirarse."
      },
      {
        year: 1936,
        event: "En los dias posteriores, la respuesta britanica incluyo busquedas en las colinas y cuevas de la zona de Nablus."
      },
      {
        year: 1939,
        event: "La Revuelta arabe en Palestina concluyo en 1939 tras una prolongada campana de represion britanica y fractura interna; no existio un tratado de cierre especifico para Anabta/Nur Shams."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Anabta",
      "Nur Shams",
      "Tulkarem",
      "Nablus",
      "Mandato britanico de Palestina",
      "Ejercito Britanico",
      "facciones armadas palestinas"
    ],
    participants: [
      {
        side: "Fuerzas del Mandato britanico",
        members: [
          "Ejercito Britanico",
          "Seaforth Highlanders",
          "Royal Scots Fusiliers",
          "aeronaves britanicas de apoyo"
        ],
        casualties: "La cobertura contemporanea confirma dos militares britanicos muertos. Los relatos posteriores no coinciden de forma estable en el numero de heridos, por lo que GeoRisk no fija una cifra total cerrada."
      },
      {
        side: "Facciones armadas palestinas locales",
        members: [
          "facciones armadas palestinas locales",
          "combatientes de la Revuelta arabe en Palestina"
        ],
        casualties: "Los partes britanicos contemporaneos comunicaron al menos diez muertos palestinos, pero otras coberturas elevaron la cifra y no existe un balance palestino consolidado revisado por esta ficha. GeoRisk conserva la incertidumbre y no presenta un total definitivo."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "21 de junio de 1936. La accion aparece en fuentes y catalogos como batalla de Anabta y como batalla de Nur Shams/Nur-el-Shems; ambas denominaciones se conservan en la ficha.",
    sourceDispute: "La historiografia y los catalogos emplean Anabta, Nur Shams y la forma romanizada Nur-el-Shems para el combate del 21 de junio. Es un episodio distinto del tiroteo de Anabta del 15 de abril de 1936, que ayudo a preceder la revuelta. Los partes contemporaneos coinciden en la emboscada, la intervencion britanica y dos muertos britanicos, pero difieren en heridos y bajas palestinas. Por ello GeoRisk usa una ficha con doble toponimo, no atribuye un balance humano definitivo y evita convertir el vocabulario colonial de los partes en una descripcion neutral de los combatientes palestinos.",
    curationPriority: "alta",
    curationBatch: "source-backed-anabta-nur-shams-1936-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada recibida como Batalla de Nur Shams aparecia solo bajo Reino Unido, sin fecha, lugar, contraparte ni guerra especifica. Se normaliza como Batalla de Anabta (Nur Shams, 21 de junio de 1936), se vincula a la Revuelta arabe en Palestina y se agrega Cisjordania unicamente como referencia geografica contemporanea del lugar. Cisjordania no sustituye al Mandato britanico de Palestina ni designa un bando historico. La ficha no fusiona el tiroteo de Anabta del 15 de abril ni traslada sus bajas a este combate."
  };
}

export const ANABTA_NUR_SHAMS_1936_CONFLICT_RENAMES = {
  "Batalla de Nur Shams": CANONICAL,
  "Battle of Nur Shams": CANONICAL,
  "Battle of Nur-el-Shems": CANONICAL,
  "Batalla de Anabta": CANONICAL,
  "Battle of Anabta": CANONICAL,
  "Batalla de Anbata": CANONICAL,
  "Battle of Anbata": CANONICAL
};

export const ANABTA_NUR_SHAMS_1936_COUNTRY_CONFLICT_ADDITIONS = {
  Cisjordania: [CANONICAL]
};

export const ANABTA_NUR_SHAMS_1936_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: anabtaNurShams1936Fix()
};
