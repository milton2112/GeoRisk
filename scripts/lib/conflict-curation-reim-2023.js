function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla por la base de Re'im (7 de octubre de 2023)";
const PARENT = "Guerra de Gaza";
const CAMPAIGN = "Ataques del 7 de octubre de 2023 en Israel";

const SOURCES = {
  israeliForeignMinistry: source(
    "Ministerio de Relaciones Exteriores de Israel: mapa del 7 de octubre que identifica la Battle of Gaza Division HQ y registra zonas de la base capturadas y posteriormente recuperadas",
    "https://www.gov.il/BlobFolder/news/swords-of-iron-war-in-the-south-7-oct-2023/en/English_Swords_of_Iron_Hamas%20Invasion%20-%20Full%20Map%20-%20v5.pdf"
  ),
  timesOfIsrael: source(
    "The Times of Israel, reporte contempor\u00e1neo del 7 de octubre: las FDI comunicaron que recuperaron el control de la base militar de Re'im, sede de la Divisi\u00f3n de Gaza",
    "https://www.timesofisrael.com/liveblog_entry/idf-regains-control-of-reim-military-base-from-hamas-terrorists-in-southern-israel/"
  ),
  unCommission: source(
    "Comisi\u00f3n Internacional Independiente de Investigaci\u00f3n de la ONU: hallazgos sobre ataques del 7 de octubre contra objetivos civiles y una base militar en Israel",
    "https://www.un.org/unispal/document/coi-attacks-7october2023-report-10jun24/"
  ),
  amnesty: source(
    "Amnesty International, investigaci\u00f3n de 2025: documenta por separado el ataque al kibutz Re'im, la proximidad de la base militar y evidencia audiovisual relacionada con la base de Re'im",
    "https://www.amnesty-international.be/sites/default/files/download-files/2025-12/ISRAEL-OPT%207%20October%20report.pdf"
  )
};

function reim2023Fix() {
  const hierarchySources = [
    SOURCES.israeliForeignMinistry,
    SOURCES.timesOfIsrael,
    SOURCES.unCommission,
    SOURCES.amnesty
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "asalto a base militar",
    conflictType: "insurgencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 2023,
    endYear: 2023,
    region: "Base de Re'im, sede de la Divisi\u00f3n de Gaza, distrito Sur, Israel",
    normalizedRegion: "Base de Re'im, sede de la Divisi\u00f3n de Gaza, distrito Sur, Israel",
    cause: "Durante los ataques coordinados del 7 de octubre de 2023 desde Gaza, fuerzas de Ham\u00e1s atacaron objetivos militares y civiles en el sur de Israel. La base de Re'im, que alojaba la Divisi\u00f3n de Gaza, fue uno de los objetivos militares del asalto.",
    outcome: "Fuerzas de Ham\u00e1s tomaron zonas de la base durante el asalto. Las FDI recuperaron el control el mismo d\u00eda, seg\u00fan un reporte contempor\u00e1neo; la ficha no fija una hora \u00fanica ni un balance de bajas por falta de un parte p\u00fablico homologado.",
    consequences: "La toma temporal de zonas de la sede de la Divisi\u00f3n de Gaza form\u00f3 parte de la crisis de mando y seguridad del 7 de octubre. Esta ficha separa el combate de la base de los ataques contra el kibutz Re'im, el festival Nova y las rutas cercanas, cuyos hechos civiles y recuentos requieren registros distintos.",
    chronology: [
      {
        year: 2023,
        event: "El 7 de octubre, Ham\u00e1s y otros grupos armados palestinos lanzaron ataques coordinados desde Gaza contra objetivos militares y civiles en el sur de Israel."
      },
      {
        year: 2023,
        event: "La base de Re'im, sede de la Divisi\u00f3n de Gaza, fue asaltada y partes de sus instalaciones quedaron temporalmente bajo control atacante."
      },
      {
        year: 2023,
        event: "A las 19:48 del 7 de octubre, un reporte contempor\u00e1neo inform\u00f3 que las FDI hab\u00edan recuperado el control de la base; las fuentes p\u00fablicas no homologan una cronolog\u00eda minuto a minuto ni las bajas del combate."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Ataques del 7 de octubre de 2023",
      "Ataque al kibutz Re'im",
      "Masacre del festival Nova"
    ],
    participants: [
      {
        side: "Israel",
        members: ["Israel", "Fuerzas de Defensa de Israel (FDI)", "Divisi\u00f3n de Gaza"],
        casualties: "No existe un parte p\u00fablico independiente que a\u00edsle y homologue las bajas de la base. GeoRisk no traslada a este combate las cifras de civiles asesinados, heridos o secuestrados en el kibutz, el festival o las rutas cercanas."
      },
      {
        side: "Fuerzas de Ham\u00e1s",
        members: ["Ham\u00e1s", "Brigadas Izz ad-Din al-Qassam"],
        casualties: "No existe un parte p\u00fablico independiente y homologado para los atacantes de esta base. GeoRisk conserva el dato como no consolidado."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "7 de octubre de 2023; un reporte contempor\u00e1neo de las 19:48 indic\u00f3 que las FDI hab\u00edan recuperado el control de la base.",
    sourceDispute: "La entrada importada solo dec\u00eda batalla de Re'im y era ambigua: Re'im nombra una base militar, un kibutz y el \u00e1rea cercana al festival Nova. El mapa oficial israel\u00ed identifica la acci\u00f3n militar como Battle of Gaza Division HQ y afirma que zonas de la base fueron capturadas y recuperadas; The Times of Israel inform\u00f3 el mismo d\u00eda que las FDI recuperaron el control. Amnesty International documenta por separado hechos en el kibutz Re'im y evidencia relacionada con la base. Las fuentes disponibles no ofrecen una serie p\u00fablica, independiente y homologada de horas, efectivos y bajas del combate en la base, por lo que la ficha no publica un total cerrado ni absorbe las v\u00edctimas civiles de lugares pr\u00f3ximos.",
    curationPriority: "alta",
    curationBatch: "source-backed-reim-2023-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Batalla de Re'im se normaliza como Batalla por la base de Re'im (7 de octubre de 2023), dentro de la Guerra de Gaza y de los ataques del 7 de octubre de 2023 en Israel. La ficha se limita a la sede de la Divisi\u00f3n de Gaza: no sustituye ni fusiona los ataques contra el kibutz Re'im, el festival Nova, los refugios de carretera ni otras acciones del mismo d\u00eda. La clasificaci\u00f3n insurgencia describe el car\u00e1cter no estatal de una de las fuerzas participantes; no cambia la clasificaci\u00f3n jur\u00eddica del conflicto mayor."
  };
}

export const REIM_2023_CONFLICT_RENAMES = {
  "batalla de Re'im": CANONICAL,
  "Batalla de Re'im": CANONICAL,
  "Battle of Re'im": CANONICAL,
  "Battle of Reim": CANONICAL,
  "Battle of Gaza Division HQ": CANONICAL
};

export const REIM_2023_COUNTRY_CONFLICT_ADDITIONS = {
  Israel: [CANONICAL]
};

export const REIM_2023_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: reim2023Fix()
};
