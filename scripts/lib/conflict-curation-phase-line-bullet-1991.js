function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de la l\u00ednea Bullet (26 de febrero de 1991)";
const PARENT = "Guerra del Golfo";
const CAMPAIGN = "Ofensiva terrestre de la Operaci\u00f3n Tormenta del Desierto (febrero de 1991)";

const SOURCES = {
  armyNcoJournal: source(
    "U.S. Army NCO Journal: la 3.\u00aa Divisi\u00f3n Acorazada, el combate contra brigadas Tawakalna, la fecha del 26 de febrero y la operaci\u00f3n denominada Phase Line Bullet en el sur de Irak",
    "https://www.armyupress.army.mil/Journals/NCO-Journal/Archives/2017/February/February-26-1991-Bravery-among-the-Tanks-at-Desert-Storm/"
  ),
  armorMagazine: source(
    "U.S. Army Armor Magazine: distinci\u00f3n editorial entre 73 Easting, las batallas de Phase Line Tangerine y Phase Line Bullet de la 3.\u00aa Divisi\u00f3n Acorazada, y Objective Norfolk",
    "https://www.benning.army.mil/armor/EArmor/content/issues/1994/MAY_JUN/ArmorMayJune1994web.pdf"
  ),
  governmentPrintingOffice: source(
    "U.S. Government Publishing Office: testimonio hist\u00f3rico del VII Cuerpo sobre el ataque de la 3.\u00aa Divisi\u00f3n Acorazada contra la defensa de la Guardia Republicana y la Divisi\u00f3n Tawakalna",
    "https://www.govinfo.gov/content/pkg/GOVPUB-D110-PURL-gpo87224/pdf/GOVPUB-D110-PURL-gpo87224.pdf"
  )
};

function phaseLineBullet1991Fix() {
  const hierarchySources = [
    SOURCES.armyNcoJournal,
    SOURCES.armorMagazine,
    SOURCES.governmentPrintingOffice
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre acorazada",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1991,
    endYear: 1991,
    region: "Sur de Irak, zona de la linea de fase Bullet durante la ofensiva del VII Cuerpo",
    normalizedRegion: "Sur de Irak, zona de la linea de fase Bullet durante la ofensiva del VII Cuerpo",
    cause: "El 26 de febrero de 1991, durante la ofensiva terrestre de la Operaci\u00f3n Tormenta del Desierto, la 3.\u00aa Divisi\u00f3n Acorazada de Estados Unidos avanzaba para rodear a la Guardia Republicana Iraqu\u00ed. Tras los primeros enfrentamientos con la Divisi\u00f3n Tawakalna, una brigada estadounidense prepar\u00f3 una penetraci\u00f3n nocturna por la l\u00ednea de fase Bullet.",
    outcome: "La fuente del Ej\u00e9rcito de Estados Unidos describe el enfrentamiento de la 3.\u00aa Divisi\u00f3n Acorazada con dos brigadas de la Divisi\u00f3n Tawakalna y califica la operaci\u00f3n como un \u00e9xito. La ficha registra una victoria t\u00e1ctica estadounidense dentro del avance del VII Cuerpo, sin atribuir a este solo combate la destrucci\u00f3n completa de la divisi\u00f3n iraqu\u00ed ni cerrar un balance de bajas.",
    consequences: "La acci\u00f3n form\u00f3 parte del ataque acorazado del VII Cuerpo contra las defensas de la Guardia Republicana durante las \u00faltimas jornadas de la ofensiva terrestre. Contribuy\u00f3 a degradar la capacidad de combate iraqu\u00ed en el sector, pero sus efectos deben leerse junto con 73 Easting, Objective Norfolk, Medina Ridge y otras acciones simult\u00e1neas.",
    chronology: [
      {
        year: 1991,
        event: "El 26 de febrero, la 3.\u00aa Divisi\u00f3n Acorazada encontr\u00f3 elementos de la Divisi\u00f3n Tawakalna de la Guardia Republicana durante su avance por el sur de Irak."
      },
      {
        year: 1991,
        event: "Tras anochecer, la brigada estadounidense prepar\u00f3 la penetraci\u00f3n conocida como Phase Line Bullet, aproximadamente quince millas al este de sus posiciones anteriores seg\u00fan el relato del U.S. Army NCO Journal."
      },
      {
        year: 1991,
        event: "El ataque del VII Cuerpo se desarroll\u00f3 en paralelo con otras acciones acorazadas contra la Guardia Republicana; las fuentes no recomiendan fusionar Phase Line Bullet con 73 Easting ni Objective Norfolk."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Operacion Tormenta del Desierto",
      "VII Cuerpo de Estados Unidos",
      "Division Tawakalna de la Guardia Republicana",
      "Batalla de 73 Easting",
      "Batalla de Norfolk",
      "Batalla de la cresta de Medina"
    ],
    participants: [
      {
        side: "3.\u00aa Divisi\u00f3n Acorazada de Estados Unidos",
        members: [
          "Estados Unidos",
          "3.\u00aa Divisi\u00f3n Acorazada",
          "2.\u00aa Brigada de la 3.\u00aa Divisi\u00f3n Acorazada",
          "4.\u00ba Batall\u00f3n, 8.\u00ba Regimiento de Caballer\u00eda"
        ],
        casualties: "No se consolida una cifra de bajas para toda la accion. El U.S. Army NCO Journal documenta la muerte del sargento Young Min Dillon durante el combate, pero no permite convertir ese caso individual en un balance completo de la batalla."
      },
      {
        side: "Fuerzas iraqu\u00edes de la Guardia Republicana",
        members: [
          "Irak",
          "Guardia Republicana Iraqu\u00ed",
          "Divisi\u00f3n Tawakalna de la Guardia Republicana",
          "Brigadas acorazadas iraqu\u00edes citadas por las fuentes estadounidenses"
        ],
        casualties: "Las fuentes consultadas describen el combate con dos brigadas Tawakalna, pero no concilian efectivos ni bajas de la fuerza iraqui. La ficha no publica una cifra cerrada."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "26 de febrero de 1991; el U.S. Army NCO Journal fecha ese d\u00eda el combate de la 3.\u00aa Divisi\u00f3n Acorazada y la operaci\u00f3n denominada Phase Line Bullet.",
    sourceDispute: "Las denominaciones de las acciones del 26 de febrero no son uniformes. Armor Magazine distingue las batallas de Phase Line Tangerine y Phase Line Bullet de la 3.\u00aa Divisi\u00f3n Acorazada, 73 Easting del 2.\u00ba Regimiento de Caballer\u00eda Acorazada y Objective Norfolk de la 1.\u00aa Divisi\u00f3n de Infanter\u00eda. GeoRisk mantiene Phase Line Bullet como ficha separada y no mezcla sus bajas ni resultado con los de esas acciones vecinas.",
    curationPriority: "alta",
    curationBatch: "source-backed-phase-line-bullet-1991-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa aparec\u00eda como una batalla local de Am\u00e9rica, sin fecha ni guerra verificable. Se normaliza como Batalla de la l\u00ednea Bullet (26 de febrero de 1991), una acci\u00f3n acorazada en el sur de Irak dentro de la Guerra del Golfo. Estados Unidos e Irak se enlazan por participaci\u00f3n directa; el t\u00e9rmino l\u00ednea de fase es una referencia operativa, no una localidad que permita fijar coordenadas exactas. La ficha conserva la diferencia con 73 Easting y Objective Norfolk y no presenta a toda la Guardia Republicana como una \u00fanica unidad ni a la Divisi\u00f3n Tawakalna como destruida exclusivamente en este episodio."
  };
}

export const PHASE_LINE_BULLET_1991_CONFLICT_RENAMES = {
  "Batalla de la linea Bullet": CANONICAL,
  "Batalla de la l\u00ednea Bullet": CANONICAL,
  "Batalla de Phase Line Bullet": CANONICAL,
  "Battle of Phase Line Bullet": CANONICAL,
  "Battle of the Phase Line Bullet": CANONICAL,
  "Phase Line Bullet": CANONICAL
};

export const PHASE_LINE_BULLET_1991_COUNTRY_CONFLICT_ADDITIONS = {
  Irak: [CANONICAL]
};

export const PHASE_LINE_BULLET_1991_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: phaseLineBullet1991Fix()
};
