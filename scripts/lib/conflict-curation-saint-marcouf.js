function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  royalMuseumsPrint: source(
    "Royal Museums Greenwich: estampa contempor\u00e1nea de la defensa de las islas Saint-Marcouf del 7 de mayo de 1798",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-142234"
  ),
  franceArchives: source(
    "FranceArchives: memoria hist\u00f3rica sobre los intentos franceses contra las islas Saint-Marcouf entre mayo y julio de 1798",
    "https://francearchives.gouv.fr/fr/facomponent/2e56096cf680b0f3b1da61f71e43f716e34f5c4f"
  ),
  jamesNavalHistory: source(
    "William James, Historia naval de Gran Breta\u00f1a: relato de las operaciones de 1798 en el canal de la Mancha",
    "https://ibiblio.org/pha/USN/Navy/navalhistoryofgr02jameuoft.pdf"
  )
};

const PARENT = "Guerras revolucionarias francesas (1792-1802)";
const CAMPAIGN = "Operaciones navales anglo-francesas en el canal de la Mancha (1798)";

function saintMarcoufFix() {
  const hierarchySources = [
    SOURCES.royalMuseumsPrint,
    SOURCES.franceArchives,
    SOURCES.jamesNavalHistory
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "asalto anfibio y combate naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1798,
    endYear: 1798,
    region: "Islas Saint-Marcouf, frente a la pen\u00ednsula de Cotentin, Normand\u00eda, Francia",
    normalizedRegion: "Islas Saint-Marcouf, frente a la pen\u00ednsula de Cotentin, Normand\u00eda, Francia",
    cause: "La guarnici\u00f3n brit\u00e1nica instalada en las islas Saint-Marcouf serv\u00eda como punto de apoyo para vigilar y hostigar las aguas del norte de Francia. La Rep\u00fablica Francesa intent\u00f3 desalojarla mediante una flotilla de desembarco durante las operaciones del canal de la Mancha de 1798.",
    outcome: "Victoria brit\u00e1nica el 7 de mayo de 1798. La guarnici\u00f3n de Charles Price resisti\u00f3 el ataque franc\u00e9s y oblig\u00f3 a la flotilla de desembarco a retirarse. La ficha no fija un balance \u00fanico de efectivos, embarcaciones ni bajas porque los relatos impresos difieren en esos recuentos.",
    consequences: "La defensa preserv\u00f3 de inmediato la posici\u00f3n brit\u00e1nica de Saint-Marcouf y mantuvo la presi\u00f3n naval sobre la costa normanda. La documentaci\u00f3n francesa conserva intentos y seguimientos sobre las islas entre mayo y julio de 1798, por lo que la acci\u00f3n se presenta como parte de una secuencia operativa y no como un episodio aislado.",
    chronology: [
      {
        year: 1798,
        event: "El 7 de mayo, una flotilla francesa atac\u00f3 la guarnici\u00f3n brit\u00e1nica de las islas Saint-Marcouf."
      },
      {
        year: 1798,
        event: "La defensa dirigida por Charles Price oblig\u00f3 a las fuerzas francesas a retirarse de las islas."
      },
      {
        year: 1798,
        event: "Entre mayo y julio, la administraci\u00f3n francesa dej\u00f3 memoria de los intentos y las operaciones vinculadas a Saint-Marcouf."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "islas Saint-Marcouf", "canal de la Mancha", "Charles Price", "Royal Navy", "Rep\u00fablica Francesa", "Cotentin"],
    participants: [
      {
        side: "Guarnici\u00f3n brit\u00e1nica de Saint-Marcouf",
        members: ["Reino de Gran Breta\u00f1a", "Royal Navy", "Royal Marines", "Charles Price"],
        casualties: "No se consolida una cifra \u00fanica de bajas en la ficha por diferencias entre los relatos impresos."
      },
      {
        side: "Fuerzas francesas de desembarco",
        members: ["Rep\u00fablica Francesa", "Flotilla francesa de desembarco"],
        casualties: "No se consolida una cifra \u00fanica de bajas, prisioneros o embarcaciones perdidas en la ficha."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "7 de mayo de 1798",
    sourceDispute: "Las fuentes consultadas coinciden en la fecha, el ataque franc\u00e9s y la retirada ante la defensa brit\u00e1nica, pero no son uniformes sobre el tama\u00f1o de la flotilla, la fuerza de desembarco ni las bajas francesas. La estampa de Greenwich es una fuente brit\u00e1nica contempor\u00e1nea y el expediente franc\u00e9s abarca una secuencia de intentos de mayo a julio; por eso la ficha no convierte los datos de un solo relato en un orden de batalla o un total de p\u00e9rdidas definitivo.",
    curationPriority: "alta",
    curationBatch: "source-backed-saint-marcouf-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa estaba en ingl\u00e9s, sin fecha ni jerarqu\u00eda y solo asociada a Francia. Se normaliza como Batalla de las islas Saint-Marcouf (1798) dentro de las Guerras revolucionarias francesas. Francia y Reino Unido se vinculan por sus fuerzas hist\u00f3ricas; la ficha evita proyectar la posterior Uni\u00f3n de 1801 hacia el Reino de Gran Breta\u00f1a de 1798 y no fusiona este ataque con las acciones navales posteriores de mayo."
  };
}

export const SAINT_MARCOUF_CONFLICT_RENAMES = {
  "Batalla de \u00celes Saint-Marcouf": "Batalla de las islas Saint-Marcouf (1798)",
  "Batalla de Islas Saint-Marcouf": "Batalla de las islas Saint-Marcouf (1798)",
  "Batalla de las islas Saint-Marcouf": "Batalla de las islas Saint-Marcouf (1798)",
  "Batalla de Saint-Marcouf": "Batalla de las islas Saint-Marcouf (1798)",
  "Battle of the \u00celes Saint-Marcouf": "Batalla de las islas Saint-Marcouf (1798)",
  "Battle of the Isles Saint-Marcouf": "Batalla de las islas Saint-Marcouf (1798)",
  "Bataille des \u00eeles Saint-Marcouf": "Batalla de las islas Saint-Marcouf (1798)"
};

export const SAINT_MARCOUF_COUNTRY_CONFLICT_ADDITIONS = {
  Francia: ["Batalla de las islas Saint-Marcouf (1798)"],
  "Reino Unido": ["Batalla de las islas Saint-Marcouf (1798)"]
};

export const SAINT_MARCOUF_CONFLICT_DETAIL_FIXES = {
  "Batalla de las islas Saint-Marcouf (1798)": saintMarcoufFix()
};
