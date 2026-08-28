function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  caorleMuseum: source(
    "Museo Nacional de Arqueolog\u00eda del Mar de Caorle: combate de Grado de 1812, explosi\u00f3n del Mercurio y rendici\u00f3n del Rivoli",
    "https://www.vegal.net/catalogo/web/allegati/64abd6a580304_CAORLE_QDRMV_web.pdf"
  ),
  veniceUniversity: source(
    "Universidad Ca' Foscari de Venecia: el bergant\u00edn italiano Mercurio escoltaba al Rivoli y se hundi\u00f3 en la batalla de Grado de 1812",
    "https://iris.unive.it/handle/10278/3700703"
  ),
  piranoArchaeology: source(
    "Estudio arqueol\u00f3gico naval: la acci\u00f3n del 21 al 22 de febrero de 1812 se conoce como batalla de Pirano y tambi\u00e9n como batalla de Grado en parte de la bibliograf\u00eda italiana",
    "https://www.zvkds.si/wp-content/uploads/2024/03/vs_clanki_51_web.pdf",
    "media"
  )
};

function piranoGradoFix() {
  const parent = "Guerras napole\u00f3nicas (1803-1815)";
  const campaign = "Campa\u00f1a del Adri\u00e1tico (1807-1814)";
  const hierarchySources = [SOURCES.caorleMuseum, SOURCES.veniceUniversity, SOURCES.piranoArchaeology];

  return {
    parent,
    war: parent,
    campaign,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1812,
    endYear: 1812,
    region: "Entre Pirano y Grado, Adri\u00e1tico septentrional, actual Eslovenia e Italia",
    normalizedRegion: "Entre Pirano y Grado, Adri\u00e1tico septentrional, actual Eslovenia e Italia",
    cause: "La salida del Rivoli desde Venecia buscaba reforzar la presencia francesa e italiana en el Adri\u00e1tico. La Royal Navy manten\u00eda vigilancia sobre esa ruta y trat\u00f3 de interceptar la escuadra antes de que alcanzara un puerto seguro.",
    outcome: "Victoria brit\u00e1nica: el HMS Victorious oblig\u00f3 a rendirse al buque de l\u00ednea Rivoli. Durante la fase inicial, el bergant\u00edn Mercurio explot\u00f3 y se hundi\u00f3; las fuentes consultadas no se usan para fijar un total \u00fanico de bajas de toda la acci\u00f3n.",
    consequences: "La captura del Rivoli redujo la capacidad inmediata de la escuadra francesa e italiana para disputar el Adri\u00e1tico. La acci\u00f3n no cerr\u00f3 por s\u00ed sola la campa\u00f1a naval, que continu\u00f3 hasta el final de las Guerras napole\u00f3nicas.",
    chronology: [
      { year: 1812, event: "La noche del 21 de febrero, el Rivoli y sus escoltas salieron de Venecia rumbo al Adri\u00e1tico oriental." },
      { year: 1812, event: "El 22 de febrero, las fuerzas brit\u00e1nicas interceptaron a la escuadra: el Mercurio explot\u00f3 y el Rivoli termin\u00f3 rindi\u00e9ndose tras el combate frente a Pirano y Grado." }
    ],
    treaties: [],
    related: [parent, campaign, "Pirano", "Grado", "Mar Adri\u00e1tico", "HMS Victorious", "HMS Weazel", "Rivoli", "Mercurio", "Jean-Baptiste Barre"],
    participants: [
      {
        side: "Fuerza de la Royal Navy",
        members: ["Reino Unido de Gran Breta\u00f1a e Irlanda", "HMS Victorious", "HMS Weazel", "John Talbot"],
        casualties: "No se consolida un total en esta ficha"
      },
      {
        side: "Escuadra francesa e italiana",
        members: ["Primer Imperio franc\u00e9s", "Reino de Italia napole\u00f3nico", "Rivoli", "Mercurio", "Jean-Baptiste Barr\u00e9"],
        casualties: "El Mercurio se perdi\u00f3 tras una explosi\u00f3n; no se consolida un total \u00fanico de bajas"
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "noche del 21 al 22 de febrero de 1812; el combate principal y la rendici\u00f3n del Rivoli ocurrieron el 22 de febrero",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-pirano-grado-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa usaba solo Grado y quedaba bajo una jerarqu\u00eda europea gen\u00e9rica. Se normaliza al nombre m\u00e1s extendido de batalla naval de Pirano (1812), conservando Grado como alias hist\u00f3rico italiano. Reino Unido se vincula por la Royal Navy; Italia y Eslovenia solo por la geograf\u00eda actual entre Grado y Pirano. Los participantes conservan el Primer Imperio franc\u00e9s y el Reino de Italia napole\u00f3nico, sin presentar a los Estados contempor\u00e1neos como beligerantes de 1812. No se fijan dotaciones, una causa t\u00e9cnica definitiva de la explosi\u00f3n del Mercurio ni bajas agregadas cuando las fuentes y recuentos no son uniformes."
  };
}

export const PIRANO_GRADO_CONFLICT_RENAMES = {
  "Batalla de Grado": "Batalla naval de Pirano (1812)",
  "Batalla naval de Grado": "Batalla naval de Pirano (1812)",
  "Batalla naval de PIrano (1812)": "Batalla naval de Pirano (1812)",
  "Batalla de Pirano": "Batalla naval de Pirano (1812)",
  "Battle of Grado": "Batalla naval de Pirano (1812)",
  "Battle of Pirano": "Batalla naval de Pirano (1812)",
  "Battaglia di Grado": "Batalla naval de Pirano (1812)",
  "Battaglia di Pirano": "Batalla naval de Pirano (1812)"
};

export const PIRANO_GRADO_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": ["Batalla naval de Pirano (1812)"],
  Italia: ["Batalla naval de Pirano (1812)"],
  Eslovenia: ["Batalla naval de Pirano (1812)"]
};

export const PIRANO_GRADO_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Pirano (1812)": piranoGradoFix()
};
