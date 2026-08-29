function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Mani-Mani (1898)";
const PARENT = "Guerra hispano-estadounidense";
const CAMPAIGN = "Operaciones en el occidente de Cuba de julio de 1898";

const SOURCES = {
  officeOfHistorian: source(
    "Departamento de Estado de EE. UU., Office of the Historian: la guerra de 1898 entre Estados Unidos y Espa\u00f1a estuvo precedida por la lucha independentista cubana; el protocolo de agosto y el Tratado de Paris de diciembre cerraron la guerra formal",
    "https://history.state.gov/milestones/1866-1898/spanish-american-war"
  ),
  libraryOfCongressWar: source(
    "Biblioteca del Congreso de EE. UU., World of 1898: cronolog\u00eda, escenarios en Cuba, Puerto Rico y Filipinas, y cierre diplom\u00e1tico por el Tratado de Paris del 10 de diciembre de 1898",
    "https://guides.loc.gov/world-of-1898"
  ),
  libraryOfCongressTreaty: source(
    "Biblioteca del Congreso de EE. UU., Tratado de Paris de 1898: el acuerdo se firm\u00f3 el 10 de diciembre y cerr\u00f3 la guerra tras aproximadamente seis meses de hostilidades",
    "https://guides.loc.gov/world-of-1898/treaty-of-paris"
  ),
  medalOfHonorSociety: source(
    "Congressional Medal of Honor Society, ficha de John W. Heard: acci\u00f3n en la desembocadura del r\u00edo Manimani, al oeste de Bah\u00eda Honda, Cuba, el 23 de julio de 1898; fuego espa\u00f1ol dej\u00f3 averiado al Wanderer",
    "https://www.cmohs.org/recipients/john-w-heard"
  ),
  granmaArchive: source(
    "Archivo de Granma, efem\u00e9ride de 1898: registra una expedici\u00f3n por el r\u00edo Mani-Mani cerca de Bah\u00eda Honda el 22 de julio, contexto inmediato de la operaci\u00f3n",
    "https://www.granma.cu/granmad/2013/07/22/pdf/todas.pdf",
    "media"
  )
};

function spanishAmericanWarFix() {
  const hierarchySources = [
    SOURCES.officeOfHistorian,
    SOURCES.libraryOfCongressWar,
    SOURCES.libraryOfCongressTreaty
  ];

  return {
    type: "guerra interestatal",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1898,
    endYear: 1898,
    region: "Caribe, Puerto Rico, Cuba, Guam, Filipinas y Pac\u00edfico occidental",
    normalizedRegion: "Caribe, Puerto Rico, Cuba, Guam, Filipinas y Pac\u00edfico occidental",
    cause: "La guerra se desarroll\u00f3 sobre la crisis colonial en Cuba, la lucha independentista cubana y el enfrentamiento diplom\u00e1tico y militar entre Estados Unidos y Espa\u00f1a en 1898. La ficha distingue las causas cubanas de larga duraci\u00f3n de la guerra declarada formalmente entre los dos Estados.",
    outcome: "Victoria militar de Estados Unidos. El protocolo de paz de agosto detuvo las hostilidades y el Tratado de Paris de diciembre cerr\u00f3 formalmente la guerra: Espa\u00f1a renunci\u00f3 a su soberan\u00eda sobre Cuba y cedi\u00f3 Puerto Rico y Guam a Estados Unidos; el acuerdo tambi\u00e9n dispuso la cesi\u00f3n de Filipinas mediante pago estadounidense. La ficha no presenta esos cambios como una independencia cubana inmediata, porque sigui\u00f3 una ocupaci\u00f3n estadounidense y una transici\u00f3n posterior.",
    consequences: "La guerra termin\u00f3 con el imperio colonial espa\u00f1ol en el hemisferio occidental y ampli\u00f3 la presencia estadounidense en el Caribe y el Pac\u00edfico. Tambi\u00e9n modific\u00f3 la trayectoria pol\u00edtica de Cuba, Puerto Rico, Guam y Filipinas; sus procesos posteriores no se reducen al resultado militar de 1898.",
    chronology: [
      {
        year: 1898,
        event: "En abril, el conflicto entre Estados Unidos y Espa\u00f1a pas\u00f3 a guerra declarada tras la crisis de Cuba; el bloqueo naval estadounidense incluy\u00f3 la costa norte cubana."
      },
      {
        year: 1898,
        event: "El 1 de mayo, la escuadra estadounidense venci\u00f3 a la fuerza naval espa\u00f1ola en la bah\u00eda de Manila."
      },
      {
        year: 1898,
        event: "En junio y julio, las operaciones en Cuba combinaron desembarcos, combates terrestres, acciones navales y alianzas operativas con fuerzas independentistas cubanas."
      },
      {
        year: 1898,
        event: "El 12 de agosto, un protocolo de paz detuvo las hostilidades entre Estados Unidos y Espa\u00f1a."
      },
      {
        year: 1898,
        event: "El 10 de diciembre, el Tratado de Paris estableci\u00f3 el cierre diplom\u00e1tico de la guerra."
      }
    ],
    treaties: [
      "Protocolo de paz de Washington (12 de agosto de 1898)",
      "Tratado de Paris (10 de diciembre de 1898)"
    ],
    related: [
      CANONICAL,
      CAMPAIGN,
      "Batalla de Cavite",
      "Batalla de las Colinas de San Juan",
      "Batalla de Santiago de Cuba",
      "Tratado de Paris de 1898",
      "Guerra de Independencia cubana"
    ],
    participants: [
      {
        side: "Estados Unidos",
        members: ["Estados Unidos", "Ejercito de los Estados Unidos", "Armada de los Estados Unidos"],
        casualties: "No consolidadas para toda la guerra: los recuentos combinan frentes caribenos y del Pacifico, bajas de combate y enfermedad, y distintos criterios institucionales."
      },
      {
        side: "Espa\u00f1a y fuerzas coloniales espa\u00f1olas",
        members: ["Espa\u00f1a", "Ej\u00e9rcito Espa\u00f1ol", "Armada Espa\u00f1ola", "autoridades coloniales espa\u00f1olas en Cuba, Puerto Rico y Filipinas"],
        casualties: "No consolidadas para toda la guerra: los partes de los distintos teatros y las series posteriores no forman un total homog\u00e9neo comparable."
      },
      {
        side: "Fuerzas independentistas locales aliadas o vinculadas",
        members: ["Ejercito Libertador de Cuba", "fuerzas independentistas cubanas", "fuerzas revolucionarias filipinas"],
        casualties: "No consolidadas: estas fuerzas tuvieron objetivos y relaciones operativas propios; la ficha no las presenta como una cadena de mando \u00fanica ni suma sus bajas con las de los Estados beligerantes."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "abril a diciembre de 1898; protocolo de paz el 12 de agosto y Tratado de Paris el 10 de diciembre",
    sourceDispute: "Las cronolog\u00edas usan como inicio la declaraci\u00f3n espa\u00f1ola del 21 de abril o la declaraci\u00f3n estadounidense del 25 de abril de 1898; la ficha conserva el a\u00f1o y cita las dos fases. Tambi\u00e9n se discute si el cierre debe situarse en el protocolo del 12 de agosto o en el Tratado de Paris del 10 de diciembre. La clasificaci\u00f3n interestatal describe la guerra declarada entre Estados Unidos y Espa\u00f1a, pero no borra el car\u00e1cter colonial e independentista de los conflictos cubano y filipino.",
    curationPriority: "alta",
    curationBatch: "source-backed-mani-mani-1898-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La guerra padre exist\u00eda solo como una ficha gen\u00e9rica vinculada a Estados Unidos. Se la completa y se enlaza a Espa\u00f1a y Cuba para mejorar navegaci\u00f3n. El enlace Cuba representa territorio y fuerzas independentistas de 1898; no equipara a la Rep\u00fablica de Cuba posterior con una parte estatal firmante del tratado."
  };
}

function maniMani1898Fix() {
  const hierarchySources = [
    SOURCES.medalOfHonorSociety,
    SOURCES.granmaArchive,
    SOURCES.officeOfHistorian
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate de desembarco",
    conflictType: "interestatal",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1898,
    endYear: 1898,
    region: "Desembocadura del r\u00edo Mani-Mani, al oeste de Bah\u00eda Honda, Pinar del R\u00edo, Cuba",
    normalizedRegion: "Desembocadura del r\u00edo Mani-Mani, al oeste de Bah\u00eda Honda, Pinar del R\u00edo, Cuba",
    cause: "Una expedici\u00f3n vinculada a fuerzas estadounidenses y cubanas intent\u00f3 operar en la desembocadura del r\u00edo Mani-Mani, en un sector cercano a Bah\u00eda Honda. El objetivo local se relacionaba con la entrega de suministros y el apoyo a fuerzas independentistas cubanas durante la guerra de 1898.",
    outcome: "Resultado t\u00e1ctico local favorable a la defensa espa\u00f1ola: el intento estadounidense de operar o desembarcar no se consolid\u00f3 y el Wanderer qued\u00f3 averiado bajo fuego espa\u00f1ol antes de salir de peligro. La ficha no convierte este combate local en un indicador del resultado global de la guerra.",
    consequences: "La acci\u00f3n ilustra que las operaciones cubanas de 1898 no se limitaron a las grandes batallas de Santiago: hubo intentos de abastecimiento y desembarco en la costa occidental. Las fuentes disponibles no permiten reconstruir de forma homog\u00e9nea la cadena de mando local, las fuerzas exactas ni las bajas.",
    chronology: [
      {
        year: 1898,
        event: "El 22 de julio, una efem\u00e9ride cubana registra una expedici\u00f3n por el r\u00edo Mani-Mani cerca de Bah\u00eda Honda, antecedente inmediato de la acci\u00f3n."
      },
      {
        year: 1898,
        event: "El 23 de julio, John W. Heard actu\u00f3 en la desembocadura del r\u00edo Manimani, al oeste de Bah\u00eda Honda, mientras el Wanderer quedaba averiado bajo fuego espa\u00f1ol."
      },
      {
        year: 1898,
        event: "El protocolo de paz del 12 de agosto puso fin a las hostilidades entre Estados Unidos y Espa\u00f1a en el marco m\u00e1s amplio de la guerra."
      }
    ],
    treaties: ["Protocolo de paz de Washington (12 de agosto de 1898), cierre posterior de la guerra"],
    related: [
      PARENT,
      CAMPAIGN,
      "R\u00edo Mani-Mani",
      "Bah\u00eda Honda",
      "John W. Heard",
      "USS Wanderer",
      "Guerra de Independencia cubana",
      "Tratado de Paris de 1898"
    ],
    participants: [
      {
        side: "Fuerzas espa\u00f1olas de defensa colonial",
        members: ["Espa\u00f1a", "Ej\u00e9rcito Espa\u00f1ol en Cuba", "fuerzas espa\u00f1olas del \u00e1rea de Bah\u00eda Honda"],
        casualties: "No consolidadas: las fuentes consultadas confirman fuego espa\u00f1ol y el contexto de la acci\u00f3n, pero no ofrecen un parte local verificable y homog\u00e9neo de efectivos, muertos, heridos y prisioneros."
      },
      {
        side: "Fuerza expedicionaria estadounidense y cubanos vinculados",
        members: ["Estados Unidos", "3.er Regimiento de Caballer\u00eda de Estados Unidos", "John W. Heard", "USS Wanderer", "fuerzas independentistas cubanas vinculadas a la expedici\u00f3n"],
        casualties: "No consolidadas: la citaci\u00f3n de Heard confirma que dos hombres fueron alcanzados mientras transmit\u00edan \u00f3rdenes, pero los recuentos publicados de fuerza y bajas no coinciden ni aclaran siempre el papel operativo de cada grupo cubano."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "23 de julio de 1898",
    sourceDispute: "El lugar aparece como Mani-Mani, Manimani, r\u00edo Manimani y en relaci\u00f3n con Bah\u00eda Honda; se normaliza con el r\u00edo y la referencia geogr\u00e1fica de la citaci\u00f3n de Heard. Las fuentes coinciden en fecha, fuego espa\u00f1ol y aver\u00eda del Wanderer, pero discrepan en el alcance exacto del desembarco, la composici\u00f3n de la expedici\u00f3n y las bajas. Algunas s\u00edntesis llaman al episodio victoria espa\u00f1ola; la ficha usa esa valoraci\u00f3n solo como resultado t\u00e1ctico local y no fija cifras cerradas.",
    curationPriority: "alta",
    curationBatch: "source-backed-mani-mani-1898-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa no ten\u00eda fecha, ubicaci\u00f3n, bandos ni guerra padre verificable y estaba bajo un conflicto regional gen\u00e9rico de Am\u00e9rica. Se normaliza con a\u00f1o y se vincula a la guerra de 1898. El enlace Cuba contextualiza territorio y fuerzas independentistas, no una equivalencia institucional con el Estado cubano posterior."
  };
}

export const MANI_MANI_1898_CONFLICT_RENAMES = {
  "Batalla de Mani-Mani": CANONICAL,
  "Batalla de Mani Mani": CANONICAL,
  "Batalla de Mani-Mani (1898)": CANONICAL,
  "Batalla del rio Mani-Mani": CANONICAL,
  "Batalla del rio Manimani": CANONICAL,
  "Battle of Mani-Mani": CANONICAL,
  "Battle of Manimani": CANONICAL,
  "Battle of Rio Manimani": CANONICAL
};

export const MANI_MANI_1898_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [PARENT, CANONICAL],
  "Espa\u00f1a": [PARENT, CANONICAL],
  Cuba: [PARENT, CANONICAL]
};

export const MANI_MANI_1898_CONFLICT_DETAIL_FIXES = {
  [PARENT]: spanishAmericanWarFix(),
  [CANONICAL]: maniMani1898Fix()
};
