function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Mount Gray (1864)";
const PARENT = "Guerras apaches";
const CAMPAIGN = "Operaciones de la Columna de California en el suroeste de 1864";

const SOURCES = {
  officialRecords: source(
    "Departamento de Guerra de EE. UU., Official Records, vol. 34, parte I: parte de James H. Whitlock sobre la accion del 7 de abril de 1864 en Mount Gray o Sierra Bonita, la toma del campamento y el ganado recuperado",
    "https://upload.wikimedia.org/wikipedia/commons/6/6e/The_war_of_the_rebellion-_a_compilation_of_the_official_records_of_the_Union_and_Confederate_armies_%28IA_cu31924079575282%29.pdf"
  ),
  nationalParkServiceApacheWars: source(
    "Servicio de Parques Nacionales de EE. UU., Chiricahua National Monument: contexto de las guerras apaches, la Columna de California y el conflicto chiricahua durante la Guerra Civil",
    "https://www.nps.gov/chir/learn/historyculture/apache-wars-cochise.htm"
  ),
  nationalParkServiceApachean: source(
    "Servicio de Parques Nacionales de EE. UU., White Sands: las Guerras apaches como ciclo de 1849-1924 y las consecuencias de la imposicion de reservas y desplazamientos en el suroeste",
    "https://www.nps.gov/whsa/learn/historyculture/apachean.htm"
  ),
  nationalParkServiceFortBowie: source(
    "Servicio de Parques Nacionales de EE. UU., Fort Bowie: la Guerra Civil altero el suroeste y la Columna de California encontro resistencia chiricahua mientras avanzaba por la region",
    "https://www.nps.gov/fobo/learn/historyculture/the-battle-of-apache-pass.htm"
  )
};

function apacheWarsFix() {
  const hierarchySources = [
    SOURCES.nationalParkServiceApacheWars,
    SOURCES.nationalParkServiceApachean,
    SOURCES.nationalParkServiceFortBowie
  ];

  return {
    type: "guerras y campa\u00f1as de frontera",
    conflictType: "frontera",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1849,
    endYear: 1924,
    region: "Suroeste de Estados Unidos y norte de M\u00e9xico",
    normalizedRegion: "Suroeste de Estados Unidos y norte de M\u00e9xico",
    cause: "Las Guerras apaches agrupan conflictos de frontera de duracion larga entre autoridades estadounidenses, ej\u00e9rcitos, colonos y distintos pueblos apache. La expansion territorial estadounidense tras la guerra con M\u00e9xico, las rutas y asentamientos, las politicas de reserva y los intentos de defender territorios, familias y formas de vida produjeron episodios muy diferentes entre si; la etiqueta no describe una guerra estatal unica.",
    outcome: "Las campa\u00f1as estadounidenses, las negociaciones y los desplazamientos forzados terminaron por imponer reservas, rendiciones y reubicaciones a distintos grupos apache. No existe un unico desenlace militar ni un tratado final equivalente para todos los pueblos, bandas y zonas reunidos bajo este nombre.",
    consequences: "El ciclo transformo de forma duradera el suroeste de Estados Unidos y el norte de M\u00e9xico. Incluyo perdida de control territorial, reubicaciones, separaciones familiares y confinamiento de chiricahuas, pero tambien persistencia de comunidades apache y de sus vinculos culturales con sus territorios ancestrales.",
    chronology: [
      {
        year: 1848,
        event: "El Tratado de Guadalupe Hidalgo precedio la incorporacion estadounidense de gran parte del suroeste; la Compra de La Mesilla de 1854 amplio ese cambio territorial."
      },
      {
        year: 1861,
        event: "El episodio de Bascom y la escalada posterior marcaron una fase decisiva del conflicto chiricahua con autoridades estadounidenses."
      },
      {
        year: 1862,
        event: "La Columna de California cruzo el sur de Arizona durante la Guerra Civil y combatientes chiricahuas resistieron en Apache Pass."
      },
      {
        year: 1864,
        event: "La accion de Mount Gray fue una operacion de la fuerza de Camp Mimbres dentro de esa frontera militarizada."
      },
      {
        year: 1886,
        event: "La rendicion final de la banda de Geronimo en Skeleton Canyon cerro una fase chiricahua, sin convertirla en el final simple de todos los conflictos apache."
      },
      {
        year: 1913,
        event: "Tras decadas de cautiverio, chiricahuas fueron liberados de su condicion de prisioneros de guerra; una parte se establecio en la reserva mescalero de Nuevo M\u00e9xico."
      }
    ],
    treaties: [
      "Tratado de Guadalupe Hidalgo (1848), antecedente territorial",
      "Compra de La Mesilla (1854), antecedente territorial",
      "Reserva chiricahua de 1872, acuerdo local que produjo una tregua temporal",
      "Rendicion de Skeleton Canyon (1886), cierre de una fase chiricahua y no de todos los conflictos apache"
    ],
    related: [
      CANONICAL,
      CAMPAIGN,
      "Episodio de Bascom",
      "Batalla del paso Apache",
      "Rendicion de Skeleton Canyon"
    ],
    participants: [
      {
        side: "Fuerzas federales, territoriales y colonos de Estados Unidos",
        members: ["Estados Unidos", "Ejercito de los Estados Unidos", "voluntarios territoriales", "milicias y exploradores locales"],
        casualties: "No consolidadas para el ciclo completo: los partes militares, los registros civiles y las reconstrucciones por pueblo, periodo y frontera no forman una serie comun."
      },
      {
        side: "Pueblos apache y bandas locales",
        members: ["Chiricahua Apache", "Mescalero Apache", "Western Apache", "Jicarilla Apache", "Lipan Apache"],
        casualties: "No consolidadas y con alto sesgo documental: las fuentes federales registran de modo desigual a pueblos, bandas, personas combatientes y poblacion civil. La ficha evita presentar a los apache como un bloque politico o militar unico."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "1849-1924 como rango de referencia amplio; la cronologia chiricahua que contextualiza Mount Gray se concentra sobre todo entre 1861 y 1886",
    sourceDispute: "Guerras apaches es una etiqueta paraguas y sus fechas de inicio, cierre y alcance varian entre fuentes. Se conserva 1849-1924 porque el Servicio de Parques Nacionales usa ese rango en su sintesis de White Sands, pero la ficha distingue los conflictos chiricahuas, mescaleros y de otros pueblos en vez de tratarlos como una guerra estatal unica. Los partes estadounidenses no sustituyen testimonios ni registros apache.",
    curationPriority: "alta",
    curationBatch: "source-backed-mount-gray-1864-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada padre previa era una ficha generica de tipo interestatal. Se la reclasifica como conflicto de frontera, se documenta su caracter heterogeneo y se evita asignar a un Estado moderno una identidad apache historica."
  };
}

function mountGrayFix() {
  const hierarchySources = [
    SOURCES.officialRecords,
    SOURCES.nationalParkServiceApacheWars,
    SOURCES.nationalParkServiceFortBowie
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate de frontera",
    conflictType: "frontera",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1864,
    endYear: 1864,
    region: "Mount Gray o Sierra Bonita, cerca del actual condado de Hidalgo, Nuevo M\u00e9xico, Estados Unidos",
    normalizedRegion: "Mount Gray o Sierra Bonita, cerca del actual condado de Hidalgo, Nuevo M\u00e9xico, Estados Unidos",
    cause: "La causa operacional anotada por el mando estadounidense fue perseguir ganado tomado cerca de Cow Springs. La expedicion de James H. Whitlock salio de Camp Mimbres en un contexto mas amplio de conflicto territorial, militarizacion de la frontera y resistencia chiricahua frente a autoridades y asentamientos estadounidenses.",
    outcome: "El parte de Whitlock informa que su fuerza tomo el campamento al amanecer, recupero o capturo 45 caballos y mulas y destruyo provisiones y bienes del campamento. Es un resultado tactico favorable a la fuerza estadounidense, pero la ficha no lo presenta como una medida del resultado global de las Guerras apaches.",
    consequences: "La destruccion del campamento y de alimentos, incluida la reserva de mezcal seco mencionada en el parte, tuvo impacto material inmediato sobre quienes estaban alli. La accion no resolvio el conflicto chiricahua ni la disputa de frontera y debe leerse junto con las politicas de persecucion, reserva y desplazamiento de mayor escala.",
    chronology: [
      {
        year: 1864,
        event: "Tras conocer la toma de ganado en Cow Springs, James H. Whitlock organizo desde Camp Mimbres una expedicion de infanteria, caballeria y exploradores para seguir el rastro."
      },
      {
        year: 1864,
        event: "En la madrugada del 7 de abril, los exploradores localizaron fuegos cerca de Mount Gray o Sierra Bonita; la fuerza estadounidense avanzo y ataco al amanecer."
      },
      {
        year: 1864,
        event: "El informe federal registro la ocupacion del campamento, la captura de ganado y la destruccion de provisiones; despues de una respuesta apache desde la elevacion cercana, la fuerza se retiro con los animales."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Camp Mimbres",
      "Columna de California",
      "Chiricahua Apache",
      "Batalla del paso Apache"
    ],
    participants: [
      {
        side: "Fuerza estadounidense de Camp Mimbres",
        members: ["Estados Unidos", "Capitan James H. Whitlock", "5.\u00ba Regimiento de Infanteria Voluntaria de California", "1.er Regimiento de Caballeria de California", "exploradores locales"],
        casualties: "El parte federal afirmo que ningun integrante resulto herido. La ficha lo conserva como afirmacion del parte, no como un recuento independiente de todos los danos."
      },
      {
        side: "Grupo apache identificado en el parte como chiricahua",
        members: ["Chiricahua Apache", "personas y familias presentes en el campamento de Mount Gray"],
        casualties: "El parte estadounidense informo 21 cuerpos en el lugar y estimo otras bajas, pero no hay en las fuentes consultadas un parte apache equivalente ni una serie independiente que permita fijar un total definitivo."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "7 de abril de 1864",
    sourceDispute: "El parte de 1864 llama al lugar Mount Gray o Sierra Bonita; la ficha mantiene ambos nombres y ubica el sitio cerca del actual condado de Hidalgo. La principal fuente de detalle es un parte federal y usa su propia perspectiva sobre el enfrentamiento; por eso no transforma sus estimaciones de fuerza o bajas apache en cifras cerradas ni describe el campamento como si fuera una fuerza estatal homogenea.",
    curationPriority: "alta",
    curationBatch: "source-backed-mount-gray-1864-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa no tenia fecha ni ubicacion verificable y quedaba bajo Conflicto regional de America como si fuera interestatal. Se normaliza con ano, jerarquia y fuentes; Estados Unidos se conserva como enlace geografico y de la fuerza federal, sin convertir a los chiricahuas en un Estado moderno ni borrar la asimetria documental."
  };
}

export const MOUNT_GRAY_1864_CONFLICT_RENAMES = {
  "Batalla de Mount Gray": CANONICAL,
  "Batalla de Mount Gray (1864)": CANONICAL,
  "Battle of Mount Gray": CANONICAL
};

export const MOUNT_GRAY_1864_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [PARENT, CANONICAL]
};

export const MOUNT_GRAY_1864_CONFLICT_DETAIL_FIXES = {
  [PARENT]: apacheWarsFix(),
  [CANONICAL]: mountGrayFix()
};
