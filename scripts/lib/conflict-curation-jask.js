function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  iranica: source(
    "Encyclopaedia Iranica: comercio ingles en Jask, intento portugues de interceptar sus buques y derrota de la flota portuguesa en 1620",
    "https://www.iranicaonline.org/articles/jask/"
  ),
  suratHistory: source(
    "Historia documentada de la factoria inglesa de Surat: contactos navales frente a Jask, victoria inglesa y muerte posterior de Andrew Shilling",
    "https://www.rarebooksocietyofindia.org/book_archive/196174216674_10154590827061675.pdf",
    "media"
  ),
  portugueseExpansion: source(
    "Encyclopaedia of Portuguese Expansion: fracaso portugues en Jask en 1620 dentro de la rivalidad comercial en el golfo Persico",
    "https://eve.fcsh.unl.pt/en/politics/portugal-and-england",
    "media"
  )
};

function jaskFix() {
  const parent = "Rivalidad anglo-portuguesa por el comercio del golfo Persico (1616-1622)";
  const campaign = "Operaciones navales frente a Jask y acceso ingles a Persia (1620)";
  const hierarchySources = [SOURCES.iranica, SOURCES.suratHistory, SOURCES.portugueseExpansion];

  return {
    parent,
    war: parent,
    campaign,
    type: "combate naval",
    conflictType: "colonial",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1620,
    endYear: 1620,
    region: "Frente a Jask, golfo de Oman, costa de Makran, Iran actual",
    normalizedRegion: "Frente a Jask, golfo de Oman, costa de Makran, Iran actual",
    cause: "La accion surgio cuando fuerzas portuguesas intentaron interceptar buques de la Compania Inglesa de las Indias Orientales que navegaban desde Surat hacia Jask para comerciar con Persia. Las fuentes la situan en la competencia por las rutas y el acceso comercial del golfo Persico, no como una guerra moderna entre el Reino Unido e Iran.",
    outcome: "Las fuentes academicas consultadas coinciden en que la escuadra de la Compania Inglesa de las Indias Orientales derroto a la flota portuguesa frente a Jask. Andrew Shilling, comandante ingles, murio posteriormente a causa de sus heridas; no se consolidan cifras de buques, efectivos ni bajas generales porque las cronologias y recuentos de los encuentros no son uniformes.",
    consequences: "La victoria mejoro la posicion inglesa para comerciar en el golfo Persico y precedio a la cooperacion anglo-persa contra Hormuz en 1622. No implico una transferencia territorial inmediata en Jask ni debe fusionarse con el asedio de Hormuz de 1622, que fue una operacion posterior con participacion persa directa.",
    chronology: [
      { year: 1616, event: "La Compania Inglesa de las Indias Orientales abrio comercio con Persia a traves de Jask desde Surat." },
      { year: 1620, event: "Una escuadra portuguesa intento impedir la llegada de los buques ingleses a Jask; los enfrentamientos navales de diciembre terminaron con derrota portuguesa." },
      { year: 1622, event: "La posicion inglesa obtenida en el golfo Persico antecedio a la cooperacion anglo-persa para la toma de Hormuz, una operacion distinta del combate de Jask." }
    ],
    treaties: [],
    related: [parent, campaign, "Jask", "Golfo de Oman", "Estrecho de Hormuz", "Compania Inglesa de las Indias Orientales", "Andrew Shilling", "Ruy Freire de Andrade", "Portugal"],
    participants: [
      {
        side: "Escuadra de la Compania Inglesa de las Indias Orientales",
        members: ["Reino de Inglaterra", "Compania Inglesa de las Indias Orientales", "Andrew Shilling"],
        casualties: "Andrew Shilling murio posteriormente por las heridas recibidas; no se consolida un total general de bajas"
      },
      {
        side: "Escuadra portuguesa del Estado da India",
        members: ["Portugal", "Estado da India portugues", "Ruy Freire de Andrade"],
        casualties: "No consolidado en las fuentes revisadas"
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "diciembre de 1620; la bibliografia describe varios contactos navales durante el mes, por lo que no se fija un dia unico",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-jask-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa asociaba el hecho solo a Portugal y a una jerarquia generica de Europa. Se normaliza como el combate naval de Jask de 1620, frente a la costa del actual Iran, entre la Compania Inglesa de las Indias Orientales y una escuadra portuguesa. Reino Unido e Iran se agregan como enlaces contemporaneos de navegacion; los participantes preservan el Reino de Inglaterra, la Compania y el Estado da India de la epoca. La ficha no presenta a Iran como beligerante naval ni convierte la Union Iberica en un enlace automatico a Espana actual. Tampoco fusiona Jask con la toma de Hormuz de 1622, fija un dia de combate o inventa bajas, efectivos y detalles tacticos no reconciliados por las fuentes."
  };
}

export const JASK_CONFLICT_RENAMES = {
  "Batalla de Dschask": "Combate naval de Jask (1620)",
  "Batalla de Jask": "Combate naval de Jask (1620)",
  "Combate de Jask": "Combate naval de Jask (1620)",
  "Seegefecht bei Dschask": "Combate naval de Jask (1620)",
  "Battle of Dschask": "Combate naval de Jask (1620)",
  "Battle of Jask": "Combate naval de Jask (1620)",
  "Battle off Jask": "Combate naval de Jask (1620)"
};

export const JASK_COUNTRY_CONFLICT_ADDITIONS = {
  "Iran": ["Combate naval de Jask (1620)"],
  "Reino Unido": ["Combate naval de Jask (1620)"]
};

export const JASK_CONFLICT_DETAIL_FIXES = {
  "Combate naval de Jask (1620)": jaskFix()
};
