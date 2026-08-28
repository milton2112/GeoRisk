function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  royalMuseumsBellona: source(
    "Royal Museums Greenwich: estampa contempor\u00e1nea de la batalla de Lissa del 13 de marzo de 1811 y captura de la Bellona",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-269348"
  ),
  royalMuseumsEndOfAction: source(
    "Royal Museums Greenwich: estampa contempor\u00e1nea del final del combate de Lissa del 13 de marzo de 1811, con las capturas y el desenlace",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-148040"
  ),
  adriaticHistoryStudy: source(
    "Povijesni prilozi (2024): estudio sobre la rivalidad naval brit\u00e1nico-francesa en los mares J\u00f3nico y Adri\u00e1tico, con cronolog\u00eda, fuerzas y consecuencias de Lissa/Vis",
    "https://ojs.srce.hr/index.php/povijesni-prilozi/article/download/32824/17324/149181"
  )
};

const PARENT = "Guerras napole\u00f3nicas (1803-1815)";
const CAMPAIGN = "Campa\u00f1a del Adri\u00e1tico (1807-1814)";

function lissaFix() {
  const hierarchySources = [
    SOURCES.royalMuseumsBellona,
    SOURCES.royalMuseumsEndOfAction,
    SOURCES.adriaticHistoryStudy
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1811,
    endYear: 1811,
    region: "Frente a Lissa o Vis, mar Adri\u00e1tico; actual Croacia",
    normalizedRegion: "Frente a Lissa o Vis, mar Adri\u00e1tico; actual Croacia",
    cause: "La Royal Navy usaba Lissa o Vis como base para hostigar la navegaci\u00f3n francesa en el Adri\u00e1tico. Francia y el Reino de Italia napole\u00f3nico intentaron recuperar el control del mar y de las rutas que abastec\u00edan a las provincias ilirias, por lo que enviaron una escuadra superior en n\u00famero hacia la isla.",
    outcome: "Victoria brit\u00e1nica el 13 de marzo de 1811. Tras varias horas de combate, la Favorite de Bernard Dubourdieu termin\u00f3 varada y destruida; Bellona y Corona fueron capturadas, mientras el resto de la escuadra franco-italiana se dispers\u00f3. La ficha no fija un total \u00fanico de bajas ni una lista exhaustiva de buques porque las relaciones de fuerza y los recuentos var\u00edan seg\u00fan la fuente.",
    consequences: "La derrota frustr\u00f3 el intento de desalojar a la Royal Navy de Vis y consolid\u00f3 la superioridad brit\u00e1nica en el Adri\u00e1tico durante la fase posterior de la campa\u00f1a. Las operaciones navales francesas e italianas continuaron, pero no recuperaron una capacidad equivalente para disputar el control de esas aguas.",
    chronology: [
      {
        year: 1811,
        event: "El 11 de marzo, la escuadra franco-italiana de Bernard Dubourdieu sali\u00f3 de Ancona con el objetivo de actuar contra Lissa o Vis."
      },
      {
        year: 1811,
        event: "El 13 de marzo, la fuerza brit\u00e1nica de William Hoste intercept\u00f3 a la escuadra frente a la isla en el mar Adri\u00e1tico."
      },
      {
        year: 1811,
        event: "La Favorite termin\u00f3 en la costa y fue destruida; Bellona y Corona fueron capturadas tras el combate."
      },
      {
        year: 1811,
        event: "La victoria brit\u00e1nica mantuvo Vis como base operativa y reforz\u00f3 su dominio naval en el Adri\u00e1tico."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Lissa", "Vis", "mar Adri\u00e1tico", "William Hoste", "Bernard Dubourdieu", "HMS Amphion", "Favorite", "Bellona", "Corona"],
    participants: [
      {
        side: "Escuadra de la Royal Navy",
        members: ["Reino Unido de Gran Breta\u00f1a e Irlanda", "Royal Navy", "William Hoste", "HMS Amphion", "HMS Active", "HMS Cerberus", "HMS Volage"]
      },
      {
        side: "Escuadra francesa e italiana",
        members: ["Primer Imperio franc\u00e9s", "Reino de Italia napole\u00f3nico", "Bernard Dubourdieu", "Favorite", "Bellona", "Corona"]
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "13 de marzo de 1811",
    sourceDispute: "Las fuentes consultadas coinciden en la fecha, el resultado brit\u00e1nico y la captura de Bellona y Corona, pero no son uniformes en el detalle completo del orden de batalla, las cifras de hombres y ca\u00f1ones, ni las bajas. La ficha usa solo las unidades y consecuencias comunes y no publica un total cerrado de p\u00e9rdidas.",
    curationPriority: "alta",
    curationBatch: "source-backed-lissa-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa quedaba bajo una jerarqu\u00eda europea gen\u00e9rica y solo vinculada a Francia. Se normaliza como batalla naval de Lissa o Vis de 1811 dentro de las Guerras napole\u00f3nicas. Reino Unido e Italia se vinculan por las escuadras hist\u00f3ricas; Croacia se agrega exclusivamente como referencia geogr\u00e1fica contempor\u00e1nea de Vis, no como beligerante. La ficha evita confundir esta batalla con la batalla de Lissa de 1866 y no convierte los recuentos discrepantes de bajas en una cifra definitiva."
  };
}

export const LISSA_CONFLICT_RENAMES = {
  "Batalla de Lissa": "Batalla naval de Lissa (1811)",
  "Batalla de Lissa (1811)": "Batalla naval de Lissa (1811)",
  "Batalla de Vis": "Batalla naval de Lissa (1811)",
  "Batalla naval de Vis": "Batalla naval de Lissa (1811)",
  "Battle of Lissa": "Batalla naval de Lissa (1811)",
  "Battle of Lissa (1811)": "Batalla naval de Lissa (1811)",
  "Battle of Vis": "Batalla naval de Lissa (1811)",
  "Bataille de Lissa": "Batalla naval de Lissa (1811)",
  "Bitka kod Visa": "Batalla naval de Lissa (1811)"
};

export const LISSA_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": ["Batalla naval de Lissa (1811)"],
  Italia: ["Batalla naval de Lissa (1811)"],
  Croacia: ["Batalla naval de Lissa (1811)"]
};

export const LISSA_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Lissa (1811)": lissaFix()
};
