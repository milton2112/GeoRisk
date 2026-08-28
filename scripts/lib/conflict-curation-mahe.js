function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  royalMuseumsCasualties: source(
    "Royal Museums Greenwich: relaci\u00f3n contempor\u00e1nea de bajas de HMS Sybille tras la acci\u00f3n de Mah\u00e9 contra la fragata francesa Chiffonne",
    "https://www.rmg.co.uk/collections/archive/rmgc-object-520980"
  ),
  royalMuseumsChiffonne: source(
    "Royal Museums Greenwich: registro de la captura de la fragata francesa Chiffonne por HMS Sybille en Seychelles el 19 de agosto de 1801",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-102827"
  ),
  dunfermlineHistory: source(
    "Dunfermline Historical Society: perfil hist\u00f3rico de Charles Adam y captura de La Chiffonne en Mah\u00e9 el 19 de agosto de 1801",
    "https://dunfermlinehistsoc.org.uk/re-burial-of-king-robert-the-bruce/",
    "media"
  )
};

const PARENT = "Guerras revolucionarias francesas (1792-1802)";
const CAMPAIGN = "Operaciones navales anglo-francesas en el oc\u00e9ano \u00cdndico (1801)";

function maheFix() {
  const hierarchySources = [
    SOURCES.royalMuseumsCasualties,
    SOURCES.royalMuseumsChiffonne,
    SOURCES.dunfermlineHistory
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1801,
    endYear: 1801,
    region: "Rada de Mah\u00e9, Seychelles, oc\u00e9ano \u00cdndico",
    normalizedRegion: "Rada de Mah\u00e9, Seychelles, oc\u00e9ano \u00cdndico",
    cause: "Durante las Guerras revolucionarias francesas, Francia y el Reino Unido disputaban las rutas navales y los puntos de apoyo del oc\u00e9ano \u00cdndico. La presencia de la fragata francesa Chiffonne en la rada de Mah\u00e9 llev\u00f3 a la intervenci\u00f3n de HMS Sybille dentro de esas operaciones navales anglo-francesas.",
    outcome: "Victoria t\u00e1ctica brit\u00e1nica el 19 de agosto de 1801. HMS Sybille, al mando de Charles Adam, captur\u00f3 la fragata francesa Chiffonne en Mah\u00e9. La ficha no consolida duraci\u00f3n del combate, efectivos ni totales de bajas: el Museo Mar\u00edtimo Nacional conserva una relaci\u00f3n de bajas de Sybille, pero no una base comparativa completa para ambos bandos.",
    consequences: "La captura priv\u00f3 a Francia de Chiffonne en el teatro del oc\u00e9ano \u00cdndico y se insert\u00f3 en la fase final de las operaciones navales anglo-francesas de 1801. No implic\u00f3 una transferencia territorial de Seychelles ni se atribuye a este combate por s\u00ed solo el cierre pol\u00edtico de las Guerras revolucionarias francesas.",
    chronology: [
      {
        year: 1792,
        event: "Comenzaron las Guerras revolucionarias francesas, dentro de las cuales se desarrollaron disputas navales en el oc\u00e9ano \u00cdndico."
      },
      {
        year: 1801,
        event: "El 19 de agosto, HMS Sybille captur\u00f3 a la fragata francesa Chiffonne en la rada de Mah\u00e9, Seychelles."
      },
      {
        year: 1801,
        event: "En octubre se acordaron art\u00edculos preliminares de paz entre Inglaterra y Francia; el combate no se presenta como causa \u00fanica de esa negociaci\u00f3n."
      },
      {
        year: 1802,
        event: "El Tratado de Amiens cerr\u00f3 la fase principal de las Guerras revolucionarias francesas."
      }
    ],
    treaties: ["Tratado de Amiens (1802)"],
    related: [PARENT, CAMPAIGN, "Mah\u00e9", "Seychelles", "oc\u00e9ano \u00cdndico", "HMS Sybille", "Chiffonne", "Charles Adam", "Royal Navy"],
    participants: [
      {
        side: "Fuerza naval brit\u00e1nica",
        members: ["Reino Unido de Gran Breta\u00f1a e Irlanda", "Royal Navy", "HMS Sybille", "Charles Adam"],
        casualties: "No consolidado: Royal Museums Greenwich conserva una relaci\u00f3n de muertos y heridos de HMS Sybille, sin una serie equivalente y completa para ambos bandos en las fuentes consultadas."
      },
      {
        side: "Fuerza naval francesa",
        members: ["Rep\u00fablica Francesa", "Marina francesa", "Fragata Chiffonne"],
        casualties: "No consolidado: la ficha no convierte recuentos de fuentes posteriores en una cifra definitiva de bajas francesas."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "19 de agosto de 1801",
    sourceDispute: "Las fuentes consultadas coinciden en la fecha, Mah\u00e9, HMS Sybille, Charles Adam y la captura de Chiffonne. La evidencia directa disponible procede principalmente de colecciones mar\u00edtimas brit\u00e1nicas: estas conservan una lista contempor\u00e1nea de bajas de Sybille y una descripci\u00f3n posterior de la captura, pero no un parte franc\u00e9s equivalente para consolidar ambos lados. Por ello se registra la captura como resultado com\u00fan y se omiten la duraci\u00f3n exacta, el orden de batalla detallado y los totales de bajas que aparecen de modo desigual en relatos posteriores.",
    curationPriority: "alta",
    curationBatch: "source-backed-mahe-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa se llamaba Batalla de Mah\u00e9, estaba asociada solo a Francia y quedaba bajo una jerarqu\u00eda europea gen\u00e9rica. Se normaliza como Combate naval de Mah\u00e9 (1801) dentro de las Guerras revolucionarias francesas. Francia y Reino Unido se vinculan por las fuerzas hist\u00f3ricas; Seychelles se conserva como ubicaci\u00f3n contempor\u00e1nea, sin forzar un enlace nacional que no existe en el dataset. La ficha evita atribuir a Seychelles la condici\u00f3n de beligerante, no confunde el combate con otras acciones en el oc\u00e9ano \u00cdndico y no presenta las cifras brit\u00e1nicas o francesas como totales definitivos."
  };
}

export const MAHE_CONFLICT_RENAMES = {
  "Batalla de Mah\u00e9": "Combate naval de Mah\u00e9 (1801)",
  "Batalla de Mahe": "Combate naval de Mah\u00e9 (1801)",
  "Batalla de Mah\u00e9 (1801)": "Combate naval de Mah\u00e9 (1801)",
  "Combate naval de Mah\u00e9": "Combate naval de Mah\u00e9 (1801)",
  "Battle of Mah\u00e9": "Combate naval de Mah\u00e9 (1801)",
  "Battle of Mahe": "Combate naval de Mah\u00e9 (1801)",
  "Action at Mah\u00e9": "Combate naval de Mah\u00e9 (1801)",
  "Action at Mahe": "Combate naval de Mah\u00e9 (1801)",
  "Bataille de Mah\u00e9": "Combate naval de Mah\u00e9 (1801)"
};

export const MAHE_COUNTRY_CONFLICT_ADDITIONS = {
  Francia: ["Combate naval de Mah\u00e9 (1801)"],
  "Reino Unido": ["Combate naval de Mah\u00e9 (1801)"]
};

export const MAHE_CONFLICT_DETAIL_FIXES = {
  "Combate naval de Mah\u00e9 (1801)": maheFix()
};
