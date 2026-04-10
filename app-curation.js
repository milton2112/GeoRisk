const EXTRA_CONFLICT_DETAIL_OVERRIDES = {
  "Guerra de los Seis Dias": {
    cause: "Estallo por la escalada militar entre Israel y varios estados arabes, el cierre egipcio del estrecho de Tiran y la percepcion de una amenaza inminente.",
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "cientos de miles movilizados", casualties: "miles" },
      { side: "Coalicion arabe", members: ["Egipto", "Siria", "Jordania", "Irak"], organizations: ["Liga Arabe"], troops: "cientos de miles movilizados", casualties: "miles" }
    ],
    outcome: "Victoria militar israeli en pocos dias.",
    consequences: "Israel ocupo Gaza, Sinai, Cisjordania, Jerusalen Este y los Altos del Golan, alterando de forma duradera la geopolitica regional."
  },
  "Guerra del Yom Kippur": {
    cause: "Egipto y Siria lanzaron una ofensiva sorpresa para revertir las perdidas territoriales sufridas en 1967.",
    participants: [
      { side: "Egipto y Siria", members: ["Egipto", "Siria"], organizations: ["Liga Arabe"], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Israel", members: ["Israel"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Alto el fuego con recuperacion parcial de iniciativa arabe y posterior negociacion diplomatica.",
    consequences: "Abri0 el camino a la diplomacia de Camp David y modifico la percepcion de seguridad regional."
  },
  "Guerra chino-india": {
    cause: "Se origino en disputas fronterizas no resueltas en Aksai Chin y Arunachal Pradesh, agravadas por la desconfianza estrategica entre ambos estados.",
    participants: [
      { side: "China", members: ["China"], organizations: [], troops: "decenas de miles", casualties: "significativas" },
      { side: "India", members: ["India"], organizations: [], troops: "decenas de miles", casualties: "significativas" }
    ],
    outcome: "Victoria militar china y cese unilateral del fuego.",
    consequences: "Consolido la rivalidad fronteriza sino-india y dejo una frontera fuertemente militarizada."
  },
  "Guerra de Kargil": {
    cause: "Fue desencadenada por infiltraciones y ocupaciones de alturas estrategicas en Cachemira bajo control indio.",
    participants: [
      { side: "India", members: ["India"], organizations: [], troops: "decenas de miles", casualties: "centenares" },
      { side: "Pakistan y fuerzas infiltradas", members: ["Pakistan"], organizations: [], troops: "miles", casualties: "centenares" }
    ],
    outcome: "Recuperacion india de las posiciones con presion internacional sobre Pakistan.",
    consequences: "Reafirmo la centralidad de Cachemira en la rivalidad indo-paquistani y elevo el riesgo nuclear regional."
  },
  "Guerra civil china": {
    cause: "Se produjo por la lucha por el poder entre nacionalistas y comunistas tras el colapso del orden imperial y la ocupacion japonesa.",
    type: "conflicto interno",
    scope: "regional",
    region: "Asia oriental",
    chronology: [
      { year: 1927, text: "Ruptura entre comunistas y nacionalistas y comienzo de la guerra civil abierta." },
      { year: 1937, text: "La invasion japonesa fuerza una cooperacion parcial entre ambos bandos." },
      { year: 1946, text: "Tras la Segunda Guerra Mundial se reanuda la guerra civil a gran escala." },
      { year: 1949, text: "Los comunistas proclaman la Republica Popular China y el Kuomintang se repliega a Taiwan." }
    ],
    related: ["Segunda Guerra Mundial", "Cuestion de Taiwan"],
    participants: [
      { side: "Comunistas", members: ["Partido Comunista Chino"], organizations: [], troops: "millones", casualties: "muy elevadas" },
      { side: "Nacionalistas", members: ["Kuomintang"], organizations: [], troops: "millones", casualties: "muy elevadas" }
    ],
    outcome: "Victoria comunista y retiro nacionalista a Taiwan.",
    consequences: "Origino la Republica Popular China y la persistencia de la cuestion de Taiwan."
  },
  "Primera Guerra Mundial": {
    cause: "Se desencadeno tras el asesinato del archiduque Francisco Fernando, en un contexto de alianzas rivales, militarizacion y disputas imperiales acumuladas.",
    type: "guerra mundial",
    scope: "global",
    region: "Europa con expansion mundial",
    chronology: [
      { year: 1914, text: "Crisis de julio, movilizaciones generales y apertura del frente occidental y oriental." },
      { year: 1916, text: "Batallas de Verdun y del Somme simbolizan la guerra de desgaste." },
      { year: 1917, text: "Entrada de Estados Unidos y revolucion rusa." },
      { year: 1918, text: "Ofensivas finales aliadas y armisticio del 11 de noviembre." }
    ],
    related: ["Segunda Guerra Mundial", "Revolucion rusa"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Francia", "Rusia", "Italia", "Estados Unidos", "Serbia", "Japon"], organizations: [], troops: "decenas de millones movilizados", casualties: "enormes" },
      { side: "Potencias Centrales", members: ["Alemania", "Austria-Hungria", "Imperio Otomano", "Bulgaria"], organizations: [], troops: "decenas de millones movilizados", casualties: "enormes" }
    ],
    outcome: "Victoria aliada y colapso de varios imperios continentales.",
    consequences: "Redibujó el mapa de Europa y Medio Oriente, dio lugar a nuevos estados y sentó parte de las condiciones para la Segunda Guerra Mundial."
  },
  "Segunda Guerra Mundial": {
    cause: "Estallo por el expansionismo de la Alemania nazi, la revision del orden de Versalles y la escalada militar de las potencias del Eje en Europa y Asia.",
    type: "guerra mundial",
    scope: "global",
    region: "Europa, Asia, Africa y oceanos",
    chronology: [
      { year: 1939, text: "Invasion alemana de Polonia e inicio formal de la guerra en Europa." },
      { year: 1941, text: "Operacion Barbarroja y ataque japones a Pearl Harbor." },
      { year: 1944, text: "Desembarco de Normandia y avance aliado en varios frentes." },
      { year: 1945, text: "Caida de Berlin, rendicion alemana y capitulacion japonesa tras Hiroshima y Nagasaki." }
    ],
    related: ["Primera Guerra Mundial", "Guerra fria"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Union Sovietica", "Estados Unidos", "China", "Francia y otros aliados"], organizations: [], troops: "decenas de millones", casualties: "extremadamente elevadas" },
      { side: "Eje", members: ["Alemania", "Italia", "Japon y aliados"], organizations: [], troops: "decenas de millones", casualties: "extremadamente elevadas" }
    ],
    outcome: "Victoria aliada y derrota total del Eje.",
    consequences: "Transformo el sistema internacional, impulso la ONU, la descolonizacion y la bipolaridad de la Guerra fria."
  },
  "Guerra de Corea": {
    cause: "Estallo por la invasion norcoreana del sur en el marco de la division de la peninsula y la rivalidad de la Guerra fria.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia oriental",
    chronology: [
      { year: 1950, text: "Corea del Norte cruza el paralelo 38 e inicia la guerra." },
      { year: 1950, text: "Desembarco de Incheon y contraofensiva de la ONU liderada por Estados Unidos." },
      { year: 1950, text: "Intervencion china y retroceso de las fuerzas de la ONU." },
      { year: 1953, text: "Armisticio de Panmunjom sin tratado de paz definitivo." }
    ],
    related: ["Guerra fria"],
    participants: [
      { side: "Corea del Norte y China", members: ["Corea del Norte", "China"], organizations: [], troops: "millones", casualties: "muy elevadas" },
      { side: "Corea del Sur y ONU", members: ["Corea del Sur", "Estados Unidos", "Reino Unido", "Turquia y otros"], organizations: ["ONU"], troops: "millones", casualties: "muy elevadas" }
    ],
    outcome: "Armisticio y restauracion aproximada de la frontera previa.",
    consequences: "Consolido la division permanente de Corea y militarizo de forma duradera Asia oriental."
  },
  "Guerra de Vietnam": {
    cause: "Se expandio por la confrontacion entre Vietnam del Norte y del Sur, la insurgencia comunista y la intervencion estadounidense en el marco de la Guerra fria.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Sudeste asiatico",
    chronology: [
      { year: 1955, text: "Escalada del conflicto entre Vietnam del Norte y del Sur." },
      { year: 1965, text: "Intervencion masiva de Estados Unidos." },
      { year: 1968, text: "Ofensiva del Tet y giro politico del conflicto." },
      { year: 1975, text: "Caida de Saigon y victoria del Norte." }
    ],
    related: ["Guerra fria", "Guerra de Indochina"],
    participants: [
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Vietnam del Sur y aliados", members: ["Vietnam del Sur", "Estados Unidos", "Corea del Sur", "Australia y otros"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria norvietnamita y reunificacion bajo Hanoi.",
    consequences: "Reconfiguro el sudeste asiatico y tuvo enorme impacto politico en Estados Unidos y en la Guerra fria."
  },
  "Guerra del Golfo": {
    cause: "Estallo tras la invasion iraqui de Kuwait y la respuesta internacional liderada por Estados Unidos para revertirla.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Golfo Persico",
    chronology: [
      { year: 1990, text: "Irak invade Kuwait." },
      { year: 1991, text: "Operacion Tormenta del Desierto con campaña aerea y ofensiva terrestre." },
      { year: 1991, text: "Liberacion de Kuwait y alto el fuego." }
    ],
    related: ["Guerra de Irak", "Guerra Iran-Iraq"],
    participants: [
      { side: "Coalicion internacional", members: ["Estados Unidos", "Arabia Saudita", "Reino Unido", "Francia", "Egipto y otros"], organizations: ["ONU"], troops: "cientos de miles", casualties: "moderadas" },
      { side: "Irak", members: ["Irak"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria de la coalicion y liberacion de Kuwait.",
    consequences: "Restauro la soberania kuwaiti, debilito a Irak y reforzo la presencia militar estadounidense en el Golfo."
  },
  "Guerra civil siria": {
    cause: "Surgio de protestas antigubernamentales reprimidas en 2011 y evoluciono hacia una guerra multifrente con intervencion extranjera.",
    type: "conflicto interno",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 2011, text: "Protestas y represion inicial." },
      { year: 2013, text: "Militarizacion generalizada del conflicto." },
      { year: 2014, text: "Expansión de Estado Islamico." },
      { year: 2015, text: "Intervencion militar rusa en apoyo del gobierno." }
    ],
    related: ["Guerra de Irak", "Primavera Arabe"],
    participants: [
      { side: "Gobierno sirio y aliados", members: ["Siria", "Iran", "Rusia"], organizations: ["Hezbola"], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Rebeldes, milicias y grupos yihadistas", members: ["Ejercito Libre Sirio", "facciones islamistas", "Estado Islamico", "milicias kurdas"], organizations: [], troops: "muy variables", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto fragmentado y parcialmente congelado, con predominio del gobierno en gran parte del pais.",
    consequences: "Destruccion masiva, millones de desplazados y una profunda internacionalizacion del conflicto."
  },
  "Guerra civil espanola": {
    cause: "Estallo tras el golpe militar de 1936 contra la Segunda Republica y la polarizacion ideologica y social acumulada.",
    type: "conflicto interno",
    scope: "regional",
    region: "Europa occidental",
    chronology: [
      { year: 1936, text: "Golpe militar fallido y comienzo de la guerra abierta." },
      { year: 1937, text: "Batallas de Jarama, Guadalajara y Brunete." },
      { year: 1938, text: "Batalla del Ebro y colapso republicano progresivo." },
      { year: 1939, text: "Caida de Madrid y victoria franquista." }
    ],
    related: ["Segunda Guerra Mundial"],
    participants: [
      { side: "Republica", members: ["Gobierno republicano español"], organizations: ["Brigadas Internacionales"], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Sublevados", members: ["Nacionalistas españoles"], organizations: ["Italia fascista", "Alemania nazi"], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria franquista y establecimiento de una dictadura de larga duracion.",
    consequences: "Exilio masivo, represion y reordenamiento politico completo de España."
  },
  "Guerra Iran-Iraq": {
    cause: "Estallo por disputas fronterizas, ambiciones regionales iraquies y el impacto de la revolucion islamica iraní.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Golfo Persico",
    chronology: [
      { year: 1980, text: "Irak invade Iran." },
      { year: 1982, text: "Iran recupera territorio y pasa a la ofensiva." },
      { year: 1984, text: "Escalada naval y guerra de las ciudades." },
      { year: 1988, text: "Alto el fuego auspiciado por la ONU." }
    ],
    related: ["Guerra del Golfo"],
    participants: [
      { side: "Iran", members: ["Iran"], organizations: [], troops: "millones movilizados", casualties: "extremadamente elevadas" },
      { side: "Irak", members: ["Irak"], organizations: [], troops: "millones movilizados", casualties: "extremadamente elevadas" }
    ],
    outcome: "Alto el fuego sin cambios territoriales decisivos.",
    consequences: "Debilito a ambos estados y preparo parte del escenario de la guerra del Golfo de 1991."
  },
  "Guerra de Afganistan": {
    cause: "Se produjo tras los atentados del 11 de septiembre y la decision de derrocar al regimen taliban que albergaba a Al Qaeda.",
    type: "intervencion u ocupacion",
    scope: "regional",
    region: "Asia central",
    chronology: [
      { year: 2001, text: "Invasion liderada por Estados Unidos y caida del regimen taliban." },
      { year: 2003, text: "Consolidacion de la insurgencia." },
      { year: 2009, text: "Escalada militar y nuevas ofensivas aliadas." },
      { year: 2021, text: "Retirada occidental y retorno del Talibán al poder." }
    ],
    related: ["Guerra contra el terrorismo"],
    participants: [
      { side: "Coalicion internacional", members: ["Estados Unidos", "Reino Unido", "Afganistan republicano y aliados"], organizations: ["OTAN"], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Taliban y aliados", members: ["Taliban", "redes insurgentes"], organizations: ["Al Qaeda"], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Retorno taliban al poder tras dos decadas de guerra.",
    consequences: "Colapso del gobierno afgano respaldado por Occidente y reconfiguracion regional."
  }
};

const EXTRA_CURATED_TIMELINE_EXTRAS = {
  CHN: [
    { year: 1911, category: "revolucion", text: "Revolucion de Xinhai y fin del Imperio Qing", reference: "Revolucion de 1911" },
    { year: 1949, category: "politica", text: "Proclamacion de la Republica Popular China", reference: "Fundacion de la RPC" },
    { year: 1978, category: "reforma", text: "Inicio de las reformas y apertura de Deng Xiaoping", reference: "Reformas de 1978" }
  ],
  IND: [
    { year: 1947, category: "descolonizacion", text: "Independencia y particion del Raj britanico", reference: "Independencia de India" },
    { year: 1950, category: "constitucion", text: "Entrada en vigor de la Constitucion de la India", reference: "Constitucion de 1950" },
    { year: 1971, category: "guerra", text: "Guerra con Pakistan y nacimiento de Banglades", reference: "Guerra indo-paquistani de 1971" }
  ],
  IRN: [
    { year: 1906, category: "constitucion", text: "Revolucion constitucional persa", reference: "Constitucion de 1906" },
    { year: 1979, category: "revolucion", text: "Revolucion islamica y fin de la monarquia pahlavi", reference: "Revolucion islamica" },
    { year: 1980, category: "guerra", text: "Comienzo de la guerra Iran-Iraq", reference: "Guerra Iran-Iraq" }
  ],
  ISR: [
    { year: 1948, category: "formation", text: "Proclamacion del Estado de Israel y guerra de independencia", reference: "Fundacion de Israel" },
    { year: 1967, category: "territorio", text: "Guerra de los Seis Dias y ocupacion de nuevos territorios", reference: "Guerra de los Seis Dias" },
    { year: 1979, category: "tratado", text: "Tratado de paz con Egipto", reference: "Tratado de Camp David" }
  ],
  KOR: [
    { year: 1948, category: "politica", text: "Fundacion de la Republica de Corea", reference: "Fundacion de Corea del Sur" },
    { year: 1950, category: "guerra", text: "Inicio de la Guerra de Corea", reference: "Guerra de Corea" },
    { year: 1987, category: "constitucion", text: "Transicion democratica y nueva constitucion", reference: "Constitucion de 1987" }
  ],
  PRK: [
    { year: 1948, category: "politica", text: "Fundacion de la Republica Popular Democratica de Corea", reference: "Fundacion de Corea del Norte" },
    { year: 1950, category: "guerra", text: "Inicio de la Guerra de Corea", reference: "Guerra de Corea" },
    { year: 1994, category: "politica", text: "Sucesion tras la muerte de Kim Il-sung", reference: "Sucesion dinastica" }
  ],
  POL: [
    { year: 1791, category: "constitucion", text: "Constitucion del 3 de mayo", reference: "Constitucion de 1791" },
    { year: 1918, category: "formation", text: "Restauracion de la independencia polaca", reference: "Independencia de 1918" },
    { year: 1989, category: "reforma", text: "Fin del regimen comunista y transicion democratica", reference: "Transicion de 1989" }
  ],
  EGY: [
    { year: 1922, category: "descolonizacion", text: "Independencia formal respecto del Reino Unido", reference: "Independencia egipcia" },
    { year: 1952, category: "golpe", text: "Revolucion de los Oficiales Libres", reference: "Revolucion de 1952" },
    { year: 1979, category: "tratado", text: "Tratado de paz con Israel", reference: "Tratado Egipto-Israel" }
  ],
  USA: [
    { year: 1776, category: "descolonizacion", text: "Declaracion de Independencia de las trece colonias", reference: "Declaracion de Independencia" },
    { year: 1787, category: "constitucion", text: "Convencion constitucional y aprobacion de la Constitucion federal", reference: "Constitucion de 1787" },
    { year: 1861, category: "guerra", text: "Comienzo de la Guerra de Secesion", reference: "Guerra civil estadounidense" },
    { year: 1933, category: "reforma", text: "New Deal y reorganizacion del Estado federal", reference: "New Deal" }
  ],
  RUS: [
    { year: 1917, category: "revolucion", text: "Revoluciones de febrero y octubre y colapso del Imperio ruso", reference: "Revolucion rusa" },
    { year: 1922, category: "union", text: "Fundacion de la Union Sovietica", reference: "Creacion de la URSS" },
    { year: 1991, category: "disolucion", text: "Disolucion de la URSS y nacimiento de la Federacion Rusa", reference: "Disolucion de la URSS" }
  ],
  TUR: [
    { year: 1923, category: "formation", text: "Proclamacion de la Republica de Turquia", reference: "Fundacion de la Republica de Turquia" },
    { year: 1934, category: "reforma", text: "Reformas kemalistas de secularizacion y modernizacion institucional", reference: "Reformas de Ataturk" },
    { year: 1980, category: "golpe", text: "Golpe militar y reconfiguracion autoritaria del sistema politico", reference: "Golpe de 1980" }
  ],
  MEX: [
    { year: 1810, category: "revolucion", text: "Inicio de la guerra de independencia con el Grito de Dolores", reference: "Independencia de Mexico" },
    { year: 1910, category: "revolucion", text: "Comienzo de la Revolucion mexicana", reference: "Revolucion mexicana" },
    { year: 1917, category: "constitucion", text: "Constitucion politica de 1917", reference: "Constitucion de 1917" }
  ],
  JPN: [
    { year: 1868, category: "reforma", text: "Restauracion Meiji y centralizacion del Estado imperial", reference: "Restauracion Meiji" },
    { year: 1947, category: "constitucion", text: "Entrada en vigor de la constitucion pacifista de posguerra", reference: "Constitucion de 1947" },
    { year: 1951, category: "tratado", text: "Tratado de San Francisco y reinsercion internacional de Japon", reference: "Tratado de San Francisco" }
  ],
  ITA: [
    { year: 1861, category: "union", text: "Proclamacion del Reino de Italia y culminacion inicial de la unificacion", reference: "Unificacion italiana" },
    { year: 1946, category: "revolucion", text: "Referendum institucional y fin de la monarquia", reference: "Referendum de 1946" },
    { year: 1948, category: "constitucion", text: "Entrada en vigor de la Constitucion republicana", reference: "Constitucion de 1948" }
  ],
  ZAF: [
    { year: 1910, category: "union", text: "Formacion de la Union Sudafricana", reference: "Union Sudafricana" },
    { year: 1948, category: "politica", text: "Consolidacion del apartheid como sistema de Estado", reference: "Apartheid" },
    { year: 1994, category: "reforma", text: "Primeras elecciones multirraciales y fin del apartheid", reference: "Elecciones de 1994" }
  ],
  NGA: [
    { year: 1960, category: "descolonizacion", text: "Independencia del Reino Unido", reference: "Independencia de Nigeria" },
    { year: 1967, category: "guerra", text: "Comienzo de la guerra de Biafra", reference: "Guerra civil nigeriana" },
    { year: 1999, category: "reforma", text: "Retorno al gobierno civil y nueva etapa republicana", reference: "Transicion de 1999" }
  ]
};

const EXTRA_TIMELINE_DETAIL_OVERRIDES = {
  "Revolucion de Mayo": {
    title: "Revolución de Mayo",
    detail: "La caída de la autoridad virreinal en Buenos Aires abrió el proceso político que condujo a la independencia y al reordenamiento institucional del antiguo Virreinato del Río de la Plata.",
    significance: "marca un quiebre fundacional",
    intensity: "alta"
  },
  "Constitucion de 1853": {
    title: "Constitución argentina de 1853",
    detail: "Estableció la arquitectura federal moderna, delimitó poderes y dio marco institucional estable al Estado argentino, con reformas posteriores.",
    significance: "define la organización estatal",
    intensity: "alta"
  },
  "Revolucion rusa": {
    title: "Revolución rusa",
    detail: "El doble proceso revolucionario de 1917 derribó al zarismo y luego al gobierno provisional, permitiendo la toma del poder por los bolcheviques y una transformación estructural de Eurasia.",
    significance: "cambio de régimen y repercusión mundial",
    intensity: "alta"
  },
  "Constitucion de 1787": {
    title: "Constitución de Estados Unidos",
    detail: "La convención de Filadelfia creó una federación con separación de poderes y se convirtió en una de las constituciones escritas más influyentes de la historia contemporánea.",
    significance: "fundación constitucional",
    intensity: "alta"
  },
  "Unificacion alemana": {
    title: "Unificación alemana",
    detail: "La proclamación del Imperio alemán en 1871 integró múltiples estados germánicos bajo liderazgo prusiano y alteró el equilibrio de poder europeo.",
    significance: "unificación estatal",
    intensity: "alta"
  },
  "Revolucion francesa": {
    title: "Revolución francesa",
    detail: "La crisis del Antiguo Régimen, la movilización popular y la transformación institucional iniciada en 1789 redefinieron la política moderna en Europa y el mundo.",
    significance: "revolución fundacional moderna",
    intensity: "alta"
  },
  "Camp David": {
    title: "Acuerdos de Camp David",
    detail: "Las negociaciones entre Egipto e Israel auspiciadas por Estados Unidos abrieron el camino al primer tratado de paz árabe-israelí.",
    significance: "hito diplomático regional",
    intensity: "media"
  },
  "Tratado de San Francisco": {
    title: "Tratado de San Francisco",
    detail: "Restableció buena parte de la soberanía japonesa tras la Segunda Guerra Mundial y redefinió su posición internacional en la posguerra.",
    significance: "reinserción internacional",
    intensity: "media"
  }
};

window.GeoRiskCuration = {
  EXTRA_CONFLICT_DETAIL_OVERRIDES,
  EXTRA_CURATED_TIMELINE_EXTRAS,
  EXTRA_TIMELINE_DETAIL_OVERRIDES
};
