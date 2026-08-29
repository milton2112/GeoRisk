function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de las marismas (1984)";
const PARENT = "Guerra entre Iran e Irak";
const CAMPAIGN = "Operacion Kheibar (1984)";

const SOURCES = {
  congressCountryStudy: source(
    "Biblioteca del Congreso de Estados Unidos, estudio sobre Irak: frente de las marismas de Hawizeh, combate de Majnoon, operaciones entre febrero y marzo de 1984 y ganancias territoriales iranias limitadas",
    "https://countrystudies.us/iraq/104.htm"
  ),
  reaganLibraryReport: source(
    "Biblioteca Presidencial Ronald Reagan, informe contemporaneo de 1984: Operacion Kheibar en febrero, captura iraniana de Majnoon y lineas defensivas iraquies aun intactas",
    "https://www.reaganlibrary.gov/sites/default/files/2025-09/40-219-6927398-028-013-2025.pdf"
  ),
  pittDissertation: source(
    "Universidad de Pittsburgh, tesis doctoral sobre escalada y desescalada: la Batalla de las Marismas de 1984 como parte de la guerra Iran-Irak y los limites de sus resultados militares",
    "https://d-scholarship.pitt.edu/44078/1/Loomis_Dissertation_21OCT2022.pdf",
    "media"
  )
};

function marshes1984Fix() {
  const hierarchySources = [
    SOURCES.congressCountryStudy,
    SOURCES.reaganLibraryReport,
    SOURCES.pittDissertation
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1984,
    endYear: 1984,
    region: "Marismas de Hawizeh e islas Majnoon, sur de Irak",
    normalizedRegion: "Marismas de Hawizeh e islas Majnoon, sur de Irak",
    cause: "Durante la Guerra entre Iran e Irak, Iran abrio un frente en las marismas de Hawizeh para presionar las posiciones iraquies cercanas a Basora y a las comunicaciones del sur. La Operacion Kheibar empleo el terreno inundado como via de aproximacion hacia las islas Majnoon.",
    outcome: "Resultado operacional mixto: las fuentes consultadas coinciden en que Iran logro ocupar posiciones en Majnoon, mientras que las lineas defensivas y las comunicaciones estrategicas iraquies no fueron quebradas. La ficha no presenta esa ganancia territorial limitada como una victoria decisiva de la guerra ni adopta una etiqueta unica de vencedor para toda la batalla.",
    consequences: "La ofensiva abrio y mantuvo un frente anfibio en el sur de Irak, mostro los limites de convertir avances en las marismas en una ruptura estrategica y no puso fin a la Guerra entre Iran e Irak. Las fuentes describen costos humanos elevados, pero sus cifras no son compatibles entre si para consolidar un balance unico.",
    chronology: [
      {
        year: 1984,
        event: "En febrero, Iran inicio la Operacion Kheibar en el sector de las marismas de Hawizeh como una ofensiva dentro de la Guerra entre Iran e Irak."
      },
      {
        year: 1984,
        event: "Durante febrero y marzo, las fuerzas iranias avanzaron por el terreno inundado y lograron posiciones en el area de las islas Majnoon."
      },
      {
        year: 1984,
        event: "Las defensas y comunicaciones iraquies permanecieron operativas; el frente no produjo una ruptura decisiva y la guerra continuo."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Marismas de Hawizeh", "Islas Majnoon", "Basora", "Al-Qurnah", "Guerra Iran-Irak"],
    participants: [
      {
        side: "Fuerzas iranias",
        members: ["Ir\u00e1n", "Fuerzas Armadas de Iran", "Cuerpo de la Guardia Revolucionaria Islamica"],
        casualties: "No consolidadas: las fuentes publican estimaciones y lecturas muy diferentes; la ficha no adopta un total de muertos, heridos, prisioneros o efectivos como dato verificable unico."
      },
      {
        side: "Fuerzas iraquies",
        members: ["Irak", "Fuerzas Armadas de Irak"],
        casualties: "No consolidadas: no hay un parte bilateral homogeneo y comparable que permita fijar bajas o material perdido para toda la batalla."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "febrero y marzo de 1984",
    sourceDispute: "Las fuentes consultadas usan alcances parcialmente distintos para Batalla de las Marismas, combate de Majnoon y Operacion Kheibar. Coinciden en el marco de 1984, el frente de Hawizeh-Majnoon y una ganancia iraniana limitada, pero difieren en las fechas finas, las bajas y si el resultado debe llamarse victoria irani, exito iraqui o resultado mixto. Por eso la ficha conserva los anos, no se fija un ganador absoluto y no suma cifras de bajas incompatibles.",
    curationPriority: "alta",
    curationBatch: "source-backed-marshes-1984-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de las Marismas, estaba asociada solo con Iran, sin fecha ni jerarquia verificable, bajo un conflicto regional generico de Asia. Se normaliza como Batalla de las marismas (1984), en el sur de Irak, dentro de la Guerra entre Iran e Irak. Irak se incorpora por su fuerza participante; la Operacion Kheibar se usa como campana para ordenar la accion, sin afirmar que todas las fuentes traten ambos nombres como sinonimos perfectos."
  };
}

export const MARSHES_1984_CONFLICT_RENAMES = {
  "Batalla de las Marismas": CANONICAL,
  "Batalla de las marismas": CANONICAL,
  "Batalla de las marismas (1984)": CANONICAL,
  "Battle of the Marshes": CANONICAL,
  "Battle of the Marshes (1984)": CANONICAL,
  "Battle of Marshes": CANONICAL,
  "Batalla de los pantanos": CANONICAL
};

export const MARSHES_1984_COUNTRY_CONFLICT_ADDITIONS = {
  Irak: [CANONICAL]
};

export const MARSHES_1984_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: marshes1984Fix()
};
