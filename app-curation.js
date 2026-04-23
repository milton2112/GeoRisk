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
      { side: "Corea del Norte y aliados", members: ["Corea del Norte", "China", "apoyo sovietico"], organizations: [], troops: "mas de dos millones movilizados", casualties: "muy elevadas" },
      { side: "Corea del Sur y ONU", members: ["Corea del Sur", "Estados Unidos", "Reino Unido", "Canada", "Australia", "Turquia y otros"], organizations: ["ONU"], troops: "mas de un millon movilizado", casualties: "muy elevadas" }
    ],
    outcome: "Armisticio y restauracion aproximada de la frontera previa.",
    consequences: "Consolido la division permanente de Corea y militarizo de forma duradera Asia oriental.",
    wikipedia: {
      date: "25 de junio de 1950 - 27 de julio de 1953 (de facto); conflicto tecnicamente no resuelto de jure.",
      place: "Peninsula coreana, mar Amarillo, mar del Japon, estrecho de Corea y frontera sino-coreana.",
      casusBelli: "La guerra comenzo con la invasion norcoreana de Corea del Sur en un contexto de peninsula dividida, rivalidad ideologica y competencia geopolitica de la Guerra fria.",
      result: "Armisticio de 1953, statu quo territorial aproximado y creacion de una zona desmilitarizada entre ambas Coreas.",
      territorialChanges: [],
      commanders: [
        [
          "Syngman Rhee",
          "Douglas MacArthur",
          "Matthew Ridgway",
          "Mark W. Clark"
        ],
        [
          "Kim Il-sung",
          "Peng Dehuai",
          "Kim Chaek"
        ]
      ],
      strength: [
        [
          "Coalicion ONU-Corea del Sur: mas de 1,3 millones movilizados en el punto alto del conflicto."
        ],
        [
          "Corea del Norte, China y apoyo sovietico: mas de 2,1 millones movilizados en distintas fases."
        ]
      ],
      casualties: [
        [
          "ONU y Corea del Sur: mas de 700 000 bajas militares y civiles combinadas segun recuentos resumidos."
        ],
        [
          "Corea del Norte, China y aliados: cientos de miles de muertos y heridos; estimaciones muy variables segun la fuente."
        ]
      ],
      language: "es"
    }
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
  },
  "Guerra de Crimea": {
    cause: "Estallo por la disputa sobre el equilibrio europeo, la proteccion de lugares santos y la expansion de la influencia rusa sobre el debilitado Imperio otomano.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Europa oriental y mar Negro",
    chronology: [
      { year: 1853, text: "Rusia ocupa principados danubianos y comienza la guerra." },
      { year: 1854, text: "Francia y Reino Unido intervienen en apoyo del Imperio otomano." },
      { year: 1854, text: "Desembarco aliado en Crimea y comienzo del asedio de Sebastopol." },
      { year: 1856, text: "Tratado de Paris y fin del conflicto." }
    ],
    related: ["Guerra rusoturca"],
    participants: [
      { side: "Rusia", members: ["Rusia"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Coalicion otomana", members: ["Imperio otomano", "Reino Unido", "Francia", "Cerdeña"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Derrota rusa y contencion temporal de su expansion en el mar Negro.",
    consequences: "Modifico el equilibrio europeo y expuso debilidades militares del Imperio ruso."
  },
  "Guerra de Secesion": {
    cause: "Surgio de la secesion de los estados esclavistas del sur tras la eleccion de Lincoln y de un conflicto acumulado sobre esclavitud, federalismo y modelo economico.",
    type: "conflicto interno",
    scope: "regional",
    region: "America del Norte",
    chronology: [
      { year: 1861, text: "Ataque a Fort Sumter y comienzo formal de la guerra." },
      { year: 1863, text: "Gettysburg y Vicksburg cambian el equilibrio estrategico." },
      { year: 1864, text: "Campañas de Grant y Sherman erosionan a la Confederacion." },
      { year: 1865, text: "Rendicion de Lee en Appomattox y derrota confederada." }
    ],
    related: ["Reconstruccion estadounidense"],
    participants: [
      { side: "Union", members: ["Estados Unidos"], organizations: [], troops: "millones movilizados", casualties: "muy elevadas" },
      { side: "Confederacion", members: ["Estados Confederados"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria de la Union y preservacion del Estado federal.",
    consequences: "Abolio la esclavitud, reforzo el gobierno federal y transformo la sociedad estadounidense."
  },
  "Guerra franco-prusiana": {
    cause: "Estallo por la competencia por la hegemonia europea y la crisis diplomatica de la candidatura Hohenzollern al trono español.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Europa occidental",
    chronology: [
      { year: 1870, text: "Declaracion de guerra francesa a Prusia." },
      { year: 1870, text: "Derrota francesa en Sedan y captura de Napoleon III." },
      { year: 1870, text: "Proclamacion del Imperio aleman en Versalles." },
      { year: 1871, text: "Tratado de Frankfurt y fin de la guerra." }
    ],
    related: ["Unificacion alemana", "Primera Guerra Mundial"],
    participants: [
      { side: "Prusia y aliados germanos", members: ["Prusia", "Baviera", "Wurtemberg", "Baden"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Francia", members: ["Francia"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria prusiana y unificacion alemana bajo liderazgo de Prusia.",
    consequences: "Alemania surgio como gran potencia y Francia perdio Alsacia-Lorena."
  },
  "Guerra hispano-estadounidense": {
    cause: "Se desencadeno por la crisis cubana, el hundimiento del Maine y la expansion estrategica estadounidense a fines del siglo XIX.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Caribe y Pacifico",
    chronology: [
      { year: 1898, text: "Estados Unidos declara la guerra a España." },
      { year: 1898, text: "Batallas de Cavite y Santiago de Cuba." },
      { year: 1898, text: "Armisticio y negociacion de paz." }
    ],
    related: ["Independencia de Cuba", "Guerra filipino-estadounidense"],
    participants: [
      { side: "Estados Unidos", members: ["Estados Unidos"], organizations: [], troops: "decenas de miles", casualties: "moderadas" },
      { side: "España", members: ["España"], organizations: [], troops: "decenas de miles", casualties: "moderadas y altas por enfermedad" }
    ],
    outcome: "Victoria estadounidense y colapso del viejo imperio colonial español.",
    consequences: "Estados Unidos tomo Puerto Rico, Guam y Filipinas, y Cuba quedo bajo fuerte influencia estadounidense."
  },
  "Segunda guerra de los Boers": {
    cause: "Estallo por la rivalidad imperial britanica en el sur de Africa, el control del oro y la resistencia de las republicas boers.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Africa austral",
    chronology: [
      { year: 1899, text: "Comienza la guerra entre el Imperio britanico y las republicas boers." },
      { year: 1900, text: "Caen Bloemfontein y Pretoria." },
      { year: 1901, text: "La guerra entra en fase de guerrillas y campos de concentracion." },
      { year: 1902, text: "Tratado de Vereeniging." }
    ],
    related: ["Union Sudafricana"],
    participants: [
      { side: "Imperio britanico", members: ["Reino Unido"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Republicas boers", members: ["Transvaal", "Estado Libre de Orange"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria britanica e incorporacion de las republicas boers al imperio.",
    consequences: "Preparo la futura Union Sudafricana y dejo una memoria profunda de violencia y concentracion."
  },
  "Guerra ruso-japonesa": {
    cause: "Estallo por la rivalidad imperial sobre Manchuria y Corea y el ascenso japones como potencia militar en Asia oriental.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia oriental",
    chronology: [
      { year: 1904, text: "Ataque japones a Port Arthur e inicio de la guerra." },
      { year: 1905, text: "Batalla de Mukden y derrota naval rusa en Tsushima." },
      { year: 1905, text: "Tratado de Portsmouth." }
    ],
    related: ["Revolucion rusa de 1905"],
    participants: [
      { side: "Japon", members: ["Japon"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Rusia", members: ["Rusia"], organizations: [], troops: "centenares de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria japonesa y debilitamiento del prestigio imperial ruso.",
    consequences: "Consagro a Japon como potencia mayor y agravo la crisis interna del Imperio ruso."
  },
  "Guerra de Argelia": {
    cause: "Surgio del levantamiento independentista contra el dominio colonial frances y de la radicalizacion del conflicto descolonizador.",
    type: "conflicto interno",
    scope: "regional",
    region: "Africa del Norte",
    chronology: [
      { year: 1954, text: "Inicio de la insurreccion del FLN." },
      { year: 1957, text: "Batalla de Argel y escalada represiva." },
      { year: 1961, text: "Crisis politica francesa y negociaciones avanzadas." },
      { year: 1962, text: "Acuerdos de Evian e independencia argelina." }
    ],
    related: ["Descolonizacion francesa"],
    participants: [
      { side: "Francia", members: ["Francia"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Independentistas argelinos", members: ["FLN"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Independencia de Argelia.",
    consequences: "Acelero la crisis de la Cuarta Republica francesa y transformo el mapa colonial mediterraneo."
  },
  "Guerra de Bangladesh": {
    cause: "Se produjo por la represion pakistaní en Pakistan Oriental, la crisis politica tras las elecciones de 1970 y la intervencion india a favor de la secesion bengali.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia meridional",
    chronology: [
      { year: 1971, text: "Operacion Searchlight y guerra de independencia bengali." },
      { year: 1971, text: "Intervencion india y colapso militar pakistani en el este." },
      { year: 1971, text: "Rendicion pakistaní y nacimiento de Bangladesh." }
    ],
    related: ["Guerra de Kargil"],
    participants: [
      { side: "India y nacionalistas bengalies", members: ["India", "Mukti Bahini"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Pakistan", members: ["Pakistan"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria india-bengali e independencia de Bangladesh.",
    consequences: "Redefinio el equilibrio del sur de Asia y profundizo la rivalidad indo-paquistani."
  },
  "Guerra de Kosovo": {
    cause: "Estallo por la represion serbia en Kosovo, la insurgencia albanokosovar y la intervencion de la OTAN sin mandato expreso del Consejo de Seguridad.",
    type: "intervencion u ocupacion",
    scope: "regional",
    region: "Balcanes",
    chronology: [
      { year: 1998, text: "Escalada de violencia entre fuerzas serbias y el ELK." },
      { year: 1999, text: "Campaña aerea de la OTAN contra Yugoslavia." },
      { year: 1999, text: "Retirada serbia y administracion internacional de Kosovo." }
    ],
    related: ["Guerras yugoslavas"],
    participants: [
      { side: "Yugoslavia/Serbia", members: ["Serbia", "Yugoslavia"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "OTAN y ELK", members: ["Estados Unidos", "Reino Unido", "Alemania", "Francia", "ELK"], organizations: ["OTAN"], troops: "potencia aerea y fuerzas regionales", casualties: "elevadas" }
    ],
    outcome: "Retirada serbia de Kosovo y despliegue internacional.",
    consequences: "Kosovo quedo bajo tutela internacional y la cuestion de su independencia siguio abierta durante años."
  },
  "Guerra de Irak": {
    cause: "Comenzo con la invasion de 2003 liderada por Estados Unidos sobre la base de acusaciones de armas de destruccion masiva y objetivos de cambio de régimen.",
    type: "intervencion u ocupacion",
    scope: "regional",
    region: "Medio Oriente",
    chronology: [
      { year: 2003, text: "Invasion liderada por Estados Unidos y caida del gobierno de Sadam Husein." },
      { year: 2004, text: "Comienza una insurgencia amplia y conflicto sectario creciente." },
      { year: 2007, text: "Surge estadounidense y cambio de estrategia." },
      { year: 2011, text: "Retirada principal de fuerzas estadounidenses." }
    ],
    related: ["Guerra del Golfo", "Guerra civil siria", "Guerra contra el terrorismo"],
    participants: [
      { side: "Coalicion invasora", members: ["Estados Unidos", "Reino Unido", "Australia", "Polonia"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Irak, insurgencias y milicias", members: ["Irak", "grupos insurgentes", "milicias sectarias"], organizations: [], troops: "muy variables", casualties: "muy elevadas" }
    ],
    outcome: "Derrocamiento del régimen baazista, ocupacion prolongada y conflicto interno posterior.",
    consequences: "Desestabilizo profundamente Irak y altero el equilibrio regional durante décadas."
  }
  ,
  "Operación Deliberate Force": {
    cause: "Fue lanzada por la OTAN tras nuevas masacres y ataques contra civiles en Bosnia, con el objetivo de forzar a las fuerzas serbobosnias a cesar el asedio y aceptar una solucion negociada.",
    type: "intervencion u ocupacion",
    scope: "regional",
    region: "Balcanes",
    chronology: [
      { year: 1995, text: "La OTAN inicia una campana aerea sostenida contra posiciones serbobosnias." },
      { year: 1995, text: "Se degradan sistemas antiaereos, depositos y nodos de mando serbobosnios." },
      { year: 1995, text: "La presion militar contribuye al alto el fuego y al camino hacia Dayton." }
    ],
    related: ["Guerra de Bosnia", "Guerra de Kosovo"],
    participants: [
      { side: "OTAN y gobierno bosnio", members: ["Estados Unidos", "Reino Unido", "Francia", "Alemania", "Bosnia y Herzegovina"], organizations: ["OTAN"], troops: "campana aerea y apoyo artillero", casualties: "limitadas en la coalicion" },
      { side: "Fuerzas serbobosnias", members: ["Republica Srpska"], organizations: [], troops: "fuerzas terrestres y defensas antiaereas", casualties: "significativas" }
    ],
    outcome: "Exito militar de la OTAN y debilitamiento de la capacidad serbobosnia.",
    consequences: "Acelero las negociaciones que desembocaron en los Acuerdos de Dayton y reconfiguro la guerra de Bosnia."
  },
  "Guerra de Afganistán": {
    cause: "Se desencadeno tras los atentados del 11 de septiembre y la intervencion liderada por Estados Unidos para expulsar al Taliban y destruir la base de Al Qaeda en Afganistan.",
    type: "intervencion u ocupacion",
    scope: "regional",
    region: "Asia central",
    chronology: [
      { year: 2001, text: "Caida inicial del regimen taliban tras la intervencion occidental." },
      { year: 2006, text: "Reorganizacion insurgente taliban y expansion de la guerra en el sur y este." },
      { year: 2009, text: "Escalada militar internacional y operaciones contrainsurgentes mas amplias." },
      { year: 2021, text: "Retirada occidental y retorno del Taliban al poder." }
    ],
    related: ["Guerra contra el terrorismo", "Guerra de Afganistán (2015–2021)"],
    participants: [
      { side: "Coalicion internacional y gobierno afgano", members: ["Estados Unidos", "Reino Unido", "Canada", "Alemania", "Afganistan y otros"], organizations: ["OTAN"], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Taliban y grupos insurgentes", members: ["Taliban", "red Haqqani", "grupos yihadistas"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria politica y militar del Taliban tras la retirada occidental.",
    consequences: "Restauro el Emirato Islamico y dejo una profunda crisis humanitaria, estrategica y de seguridad regional."
  },
  "Conflicto de Sa'dah": {
    cause: "Surgio por la rebelion huzi en el norte de Yemen frente al gobierno central, en un contexto de marginacion regional, tensiones sectarias y creciente militarizacion del Estado.",
    type: "conflicto interno",
    scope: "regional",
    region: "Peninsula arabiga",
    chronology: [
      { year: 2004, text: "Comienza el levantamiento huzi en Sa'dah y la primera guerra con el gobierno yemeni." },
      { year: 2006, text: "Se suceden nuevas campanas militares sin solucion definitiva." },
      { year: 2009, text: "La guerra se internacionaliza parcialmente con choques en la frontera saudi." },
      { year: 2010, text: "Alto el fuego fragil que deja el conflicto latente." }
    ],
    related: ["Guerra civil yemeni", "Insurgencia huzi en Yemen"],
    participants: [
      { side: "Gobierno de Yemen y aliados", members: ["Yemen", "Arabia Saudita"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Movimiento huzi", members: ["Huzies"], organizations: [], troops: "miles y luego decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Conflicto inconcluso que fortalecio a los huzies a largo plazo.",
    consequences: "Preparo parte del escenario para la guerra civil yemeni de escala nacional posterior a 2014."
  },
  "Guerra por el agua del río Jordán": {
    cause: "Se produjo por la disputa entre Israel y varios estados arabes sobre la utilizacion y desvio de las aguas del rio Jordan y sus afluentes.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 1964, text: "Escalan los proyectos de desvio de agua y los intercambios de fuego fronterizos." },
      { year: 1965, text: "Aumentan los ataques israelies contra obras hidraulicas y posiciones sirias." },
      { year: 1967, text: "La disputa hidrica se integra en la escalada estrategica previa a la Guerra de los Seis Dias." }
    ],
    related: ["Guerra de los Seis Dias", "Guerra de Desgaste"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas fronterizas y aereas", casualties: "limitadas pero persistentes" },
      { side: "Estados arabes rivereños", members: ["Siria", "Jordania", "Libano"], organizations: ["Liga Arabe"], troops: "fuerzas fronterizas y artilleria", casualties: "limitadas pero persistentes" }
    ],
    outcome: "Sin resolucion definitiva previa a 1967, pero con ventaja militar israeli.",
    consequences: "Profundizo la rivalidad arabe-israeli y fue uno de los factores que alimentaron la guerra de 1967."
  },
  "Guerra en el noroeste de Pakistán": {
    cause: "Estallo por la expansion de la insurgencia taliban pakistaní y la respuesta militar del Estado en areas tribales y fronterizas con Afganistan.",
    type: "conflicto interno",
    scope: "regional",
    region: "Asia meridional",
    chronology: [
      { year: 2004, text: "Comienzan grandes operaciones del ejercito pakistani en areas tribales." },
      { year: 2007, text: "Se consolida el Tehrik-i-Taliban Pakistan como actor insurgente clave." },
      { year: 2014, text: "Operacion Zarb-e-Azb contra santuarios insurgentes." },
      { year: 2017, text: "Disminuye la intensidad, aunque persisten focos de violencia." }
    ],
    related: ["Guerra de Afganistán", "Guerra contra el terrorismo"],
    participants: [
      { side: "Estado pakistani", members: ["Pakistan"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Insurgencia islamista", members: ["TTP", "facciones talibanes", "grupos yihadistas"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Reduccion parcial de la capacidad insurgente sin eliminacion completa.",
    consequences: "Militarizo duraderamente la frontera afgano-pakistani y dejo secuelas politicas y humanitarias profundas."
  },
  "Constitucion de 1978": {
    title: "Constitucion espanola de 1978",
    detail: "La nueva constitucion consagro la monarquia parlamentaria, el pluralismo politico, el Estado social y democratico de derecho y un sistema autonomico para las comunidades historicas y el conjunto del territorio.",
    significance: "cierre constitucional de la transicion democratica",
    intensity: "alta"
  },
  "Brexit": {
    title: "Salida del Reino Unido de la Union Europea",
    detail: "El proceso politico abierto por el referendum de 2016 concluyo con la retirada efectiva del Reino Unido de la Union Europea en 2020, reordenando su insercion comercial, normativa y diplomatica.",
    significance: "secesion institucional de alto impacto geopolitico",
    intensity: "alta"
  },
  "Reforma de 1994": {
    title: "Reforma constitucional argentina de 1994",
    detail: "Actualizo la constitucion federal mediante nuevos derechos, autonomia de la Ciudad de Buenos Aires, nuevos organos de control y cambios en el equilibrio entre poderes, incluida la reeleccion presidencial inmediata.",
    significance: "reforma profunda del sistema constitucional",
    intensity: "media"
  },
  "Constitucion de 1988": {
    title: "Constitucion brasilena de 1988",
    detail: "Conocida como la Constitucion Ciudadana, reorganizo el sistema politico tras la dictadura militar, amplio derechos y consolido la Nueva Republica.",
    significance: "fundacion constitucional de la democracia contemporanea",
    intensity: "alta"
  },
  "Disolucion de Checoslovaquia": {
    title: "Disolucion de Checoslovaquia",
    detail: "La separacion negociada y pacifica entre Chequia y Eslovaquia en 1993 redefinio el espacio postcomunista centroeuropeo sin una guerra abierta, algo poco frecuente en las disoluciones estatales del periodo.",
    significance: "disolucion estatal pacifica de gran relevancia regional",
    intensity: "alta"
  },
  "Crisis de Crimea": {
    title: "Crisis de Crimea",
    detail: "Tras la crisis politica en Ucrania de 2014, Rusia tomo control de Crimea y formalizo su anexion, mientras se activaba una guerra hibrida en el Donbas con fuerte impacto en la seguridad europea.",
    significance: "anexion y quiebre del orden europeo posterior a la Guerra fria",
    intensity: "alta"
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
  ],
  ARG: [
    { year: 1810, category: "revolucion", text: "Revolucion de Mayo y ruptura del orden virreinal", reference: "Revolucion de Mayo", intensity: "alta" },
    { year: 1816, category: "descolonizacion", text: "Declaracion de independencia en Tucuman", reference: "Independencia argentina", intensity: "alta" },
    { year: 1853, category: "constitucion", text: "Sancion de la Constitucion federal", reference: "Constitucion de 1853", intensity: "alta" },
    { year: 1976, category: "golpe", text: "Golpe militar y comienzo del Proceso de Reorganizacion Nacional", reference: "Golpe de 1976", intensity: "alta" },
    { year: 1983, category: "reforma", text: "Retorno de la democracia constitucional", reference: "Transicion democratica de 1983", intensity: "alta" },
    { year: 1994, category: "constitucion", text: "Reforma constitucional con nuevo equilibrio institucional", reference: "Reforma de 1994", intensity: "media" }
  ],
  FRA: [
    { year: 1789, category: "revolucion", text: "Revolucion francesa y derrumbe del Antiguo Regimen", reference: "Revolucion francesa", intensity: "alta" },
    { year: 1791, category: "constitucion", text: "Primera constitucion revolucionaria", reference: "Constitucion francesa de 1791", intensity: "alta" },
    { year: 1870, category: "cambio_regimen", text: "Caida del Segundo Imperio y nacimiento de la Tercera Republica", reference: "Tercera Republica", intensity: "alta" },
    { year: 1946, category: "constitucion", text: "Constitucion de la Cuarta Republica", reference: "Constitucion de 1946", intensity: "media" },
    { year: 1958, category: "constitucion", text: "Constitucion de la Quinta Republica y fortalecimiento presidencial", reference: "Constitucion de 1958", intensity: "alta" }
  ],
  DEU: [
    { year: 1848, category: "constitucion", text: "Asamblea de Frankfurt e intento constitucional liberal", reference: "Parlamento de Frankfurt", intensity: "media" },
    { year: 1871, category: "union", text: "Proclamacion del Imperio aleman y culminacion de la unificacion", reference: "Unificacion alemana", intensity: "alta" },
    { year: 1919, category: "constitucion", text: "Constitucion de Weimar y nacimiento de la republica", reference: "Constitucion de Weimar", intensity: "alta" },
    { year: 1933, category: "cambio_regimen", text: "Ascenso nazi y desmantelamiento del sistema parlamentario", reference: "Toma del poder nazi", intensity: "alta" },
    { year: 1949, category: "secesion", text: "Division entre RFA y RDA en el contexto de la Guerra Fria", reference: "Division de Alemania", intensity: "alta" },
    { year: 1990, category: "union", text: "Reunificacion alemana tras la caida del Muro", reference: "Reunificacion alemana", intensity: "alta" }
  ],
  GBR: [
    { year: 1707, category: "union", text: "Acta de Union entre Inglaterra y Escocia", reference: "Acta de Union de 1707", intensity: "alta" },
    { year: 1801, category: "union", text: "Union con Irlanda y formacion del Reino Unido", reference: "Acta de Union de 1801", intensity: "alta" },
    { year: 1921, category: "secesion", text: "Particion de Irlanda y nacimiento del Estado Libre Irlandes", reference: "Particion de Irlanda", intensity: "alta" },
    { year: 1973, category: "tratado", text: "Ingreso en las Comunidades Europeas", reference: "Ingreso en la CEE", intensity: "media" },
    { year: 2020, category: "secesion", text: "Salida de la Union Europea", reference: "Brexit", intensity: "alta" }
  ],
  ESP: [
    { year: 1812, category: "constitucion", text: "Constitucion de Cadiz", reference: "Constitucion de 1812", intensity: "alta" },
    { year: 1931, category: "cambio_regimen", text: "Proclamacion de la Segunda Republica", reference: "Segunda Republica Espanola", intensity: "alta" },
    { year: 1936, category: "golpe", text: "Golpe fallido que desemboca en guerra civil", reference: "Golpe de 1936", intensity: "alta" },
    { year: 1975, category: "cambio_regimen", text: "Muerte de Franco y apertura de la transicion", reference: "Transicion espanola", intensity: "alta" },
    { year: 1978, category: "constitucion", text: "Constitucion democratica y monarquia parlamentaria", reference: "Constitucion de 1978", intensity: "alta" }
  ],
  BRA: [
    { year: 1822, category: "descolonizacion", text: "Independencia del Brasil", reference: "Independencia de Brasil", intensity: "alta" },
    { year: 1889, category: "golpe", text: "Golpe republicano y fin del Imperio", reference: "Proclamacion de la Republica", intensity: "alta" },
    { year: 1930, category: "cambio_regimen", text: "Revolucion de 1930 y ascenso de Vargas", reference: "Revolucion de 1930", intensity: "alta" },
    { year: 1964, category: "golpe", text: "Golpe militar y apertura del ciclo autoritario", reference: "Golpe de 1964", intensity: "alta" },
    { year: 1988, category: "constitucion", text: "Constitucion democratica de la Nueva Republica", reference: "Constitucion de 1988", intensity: "alta" }
  ],
  UKR: [
    { year: 1991, category: "secesion", text: "Independencia tras la disolucion de la URSS", reference: "Independencia de Ucrania", intensity: "alta" },
    { year: 1996, category: "constitucion", text: "Constitucion de Ucrania", reference: "Constitucion de 1996", intensity: "media" },
    { year: 2014, category: "anexion", text: "Anexion rusa de Crimea y comienzo de la guerra en Donbas", reference: "Crisis de Crimea", intensity: "alta" },
    { year: 2022, category: "guerra", text: "Invasion rusa a gran escala", reference: "Invasion rusa de 2022", intensity: "alta" }
  ],
  CZE: [
    { year: 1918, category: "formation", text: "Creacion de Checoslovaquia", reference: "Formacion de Checoslovaquia", intensity: "alta" },
    { year: 1948, category: "golpe", text: "Golpe comunista y alineamiento sovietico", reference: "Golpe de Praga", intensity: "alta" },
    { year: 1968, category: "reforma", text: "Primavera de Praga y tentativa de socialismo reformista", reference: "Primavera de Praga", intensity: "media" },
    { year: 1989, category: "reforma", text: "Revolucion de Terciopelo", reference: "Revolucion de Terciopelo", intensity: "alta" },
    { year: 1993, category: "secesion", text: "Disolucion pacifica de Checoslovaquia y nacimiento de Chequia", reference: "Disolucion de Checoslovaquia", intensity: "alta" }
  ],
  PAK: [
    { year: 1947, category: "descolonizacion", text: "Independencia y particion del Raj britanico", reference: "Independencia de Pakistan", intensity: "alta" },
    { year: 1956, category: "constitucion", text: "Primera constitucion de Pakistan", reference: "Constitucion de 1956", intensity: "media" },
    { year: 1958, category: "golpe", text: "Golpe de Ayub Khan y militarizacion del poder", reference: "Golpe de 1958", intensity: "alta" },
    { year: 1971, category: "secesion", text: "Separacion de Bangladesh tras la guerra", reference: "Secesion de Bangladesh", intensity: "alta" },
    { year: 1973, category: "constitucion", text: "Constitucion de 1973", reference: "Constitucion de 1973", intensity: "alta" }
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

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Conflicto del Falso Paquisha": {
    cause: "Se produjo por la disputa fronteriza entre Ecuador y Peru en una zona no delimitada con claridad en la Cordillera del Condor.",
    type: "conflicto fronterizo",
    scope: "subregional",
    region: "Andes septentrionales",
    chronology: [
      { year: 1981, text: "Enfrentamientos entre fuerzas ecuatorianas y peruanas reactivan la disputa fronteriza." }
    ],
    related: ["Guerra del Cenepa"],
    participants: [
      { side: "Ecuador", members: ["Ecuador"], organizations: [], troops: "fuerzas de frontera", casualties: "moderadas" },
      { side: "Peru", members: ["Peru"], organizations: [], troops: "fuerzas de frontera", casualties: "moderadas" }
    ],
    outcome: "Cese de hostilidades sin solucion definitiva.",
    consequences: "Dejo abierta la disputa que volveria a escalar en la Guerra del Cenepa."
  },
  "Guerra del Cenepa": {
    cause: "Se debio a la disputa territorial no resuelta entre Ecuador y Peru en la Cordillera del Condor.",
    type: "guerra fronteriza",
    scope: "subregional",
    region: "Andes septentrionales",
    chronology: [
      { year: 1995, text: "Combates intensos estallan en la zona del Cenepa entre Ecuador y Peru." },
      { year: 1998, text: "La firma del acuerdo de paz encauza la demarcacion definitiva de la frontera." }
    ],
    related: ["Conflicto del Falso Paquisha"],
    participants: [
      { side: "Ecuador", members: ["Ecuador"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Peru", members: ["Peru"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Alto el fuego y posterior acuerdo de paz.",
    consequences: "Cerro una de las ultimas grandes disputas fronterizas interestatales de Sudamerica."
  },
  "Guerra de la Independencia Dominicana": {
    cause: "Surgio por el rechazo dominicano al dominio haitiano y por la construccion de un estado propio en el este de La Española.",
    type: "guerra de independencia",
    scope: "regional",
    region: "Caribe",
    chronology: [
      { year: 1844, text: "Se proclama la independencia dominicana y se inicia la guerra contra Haiti." },
      { year: 1856, text: "Fracasan las ultimas grandes ofensivas haitianas sobre territorio dominicano." }
    ],
    related: [],
    participants: [
      { side: "Republica Dominicana", members: ["Republica Dominicana"], organizations: [], troops: "fuerzas nacionales emergentes", casualties: "elevadas" },
      { side: "Haiti", members: ["Haiti"], organizations: [], troops: "fuerzas regulares haitianas", casualties: "elevadas" }
    ],
    outcome: "Consolidacion de la independencia dominicana.",
    consequences: "Definio la separacion politica permanente entre Haiti y Republica Dominicana."
  },
  "Guerra contra la Confederacion Peru-Boliviana": {
    cause: "Se debio a la resistencia regional contra la Confederacion Peru-Boliviana y al temor de Chile y sectores peruanos a un nuevo equilibrio de poder andino.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Andes centrales",
    chronology: [
      { year: 1836, text: "La formacion de la Confederacion Peru-Boliviana altera el equilibrio regional." },
      { year: 1839, text: "La derrota confederada en Yungay precipita la disolucion del proyecto." }
    ],
    related: [],
    participants: [
      { side: "Restauradores", members: ["Chile", "peruanos restauradores"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Confederacion", members: ["Confederacion Peru-Boliviana"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria restauradora y disolucion de la Confederacion.",
    consequences: "Reordeno el equilibrio andino y afirmo el peso regional chileno."
  },
  "Guerra entre Guatemala y El Salvador de 1906": {
    cause: "Se debio a rivalidades politicas regionales y al apoyo cruzado a oposiciones armadas en Centroamerica.",
    type: "guerra interestatal",
    scope: "subregional",
    region: "Centroamerica",
    chronology: [
      { year: 1906, text: "Guatemala y El Salvador entran en hostilidades abiertas durante una crisis centroamericana." }
    ],
    related: [],
    participants: [
      { side: "Guatemala", members: ["Guatemala"], organizations: [], troops: "fuerzas regionales", casualties: "moderadas" },
      { side: "El Salvador", members: ["El Salvador"], organizations: [], troops: "fuerzas regionales", casualties: "moderadas" }
    ],
    outcome: "Cese de hostilidades con mediacion regional.",
    consequences: "Reflejo la inestabilidad recurrente del istmo a inicios del siglo XX."
  },
  "Guerra entre Honduras y El Salvador de 1871": {
    cause: "Se inserto en las rivalidades politicas y militares recurrentes de la Centroamerica posfederal.",
    type: "guerra interestatal",
    scope: "subregional",
    region: "Centroamerica",
    chronology: [
      { year: 1871, text: "Honduras y El Salvador enfrentan una nueva guerra regional de corta duracion." }
    ],
    related: ["Guerra entre Guatemala y El Salvador de 1906"],
    participants: [
      { side: "Honduras", members: ["Honduras"], organizations: [], troops: "fuerzas regionales", casualties: "moderadas" },
      { side: "El Salvador", members: ["El Salvador"], organizations: [], troops: "fuerzas regionales", casualties: "moderadas" }
    ],
    outcome: "Resultado limitado y rapidamente absorbido por nuevas recomposiciones regionales.",
    consequences: "Mantuvo la dinamica de guerras cortas entre estados centroamericanos."
  },
  "Guerra contra el narcotrafico en Mexico": {
    cause: "Se profundizo por la militarizacion de la lucha estatal contra los carteles, la fragmentacion criminal y la debilidad institucional local.",
    type: "conflicto interno",
    scope: "interno",
    region: "America del Norte",
    chronology: [
      { year: 2006, text: "El despliegue militar federal marca una escalada nacional contra los carteles." },
      { year: 2010, text: "La violencia alcanza niveles extremadamente altos en multiples estados mexicanos." }
    ],
    related: ["Campaña militar estadounidense contra los cárteles de 2025"],
    participants: [
      { side: "Estado mexicano", members: ["Mexico"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Carteles", members: ["carteles y redes criminales"], organizations: [], troops: "miles de combatientes y sicarios", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto prolongado sin victoria decisiva.",
    consequences: "Genero una crisis de seguridad, derechos humanos y gobernanza territorial."
  },
  "Levantamiento zapatista": {
    cause: "Surgio por reclamos de autonomia indigena, desigualdad social y rechazo al modelo economico dominante en Chiapas.",
    type: "levantamiento",
    scope: "interno",
    region: "Mesoamerica",
    chronology: [
      { year: 1994, text: "El EZLN se alza en Chiapas el mismo dia de entrada en vigor del TLCAN." },
      { year: 1994, text: "Se abre una fase de dialogo y conflicto de baja intensidad." }
    ],
    related: [],
    participants: [
      { side: "EZLN", members: ["Ejercito Zapatista de Liberacion Nacional"], organizations: [], troops: "fuerzas insurgentes limitadas", casualties: "moderadas" },
      { side: "Estado mexicano", members: ["Mexico"], organizations: [], troops: "fuerzas federales", casualties: "moderadas" }
    ],
    outcome: "Cese rapido de la guerra abierta y conflicto politico prolongado.",
    consequences: "Instalo la cuestion indigena y autonomista en el centro del debate politico mexicano."
  },
  "First Guatemala War": {
    cause: "Entrada historica del corpus para uno de los choques interestatales centroamericanos del siglo XIX, en el marco de la fragmentacion regional posfederal.",
    type: "guerra interestatal",
    scope: "subregional",
    region: "Centroamerica",
    chronology: [
      { year: 1826, text: "La politica centroamericana entra en una secuencia de guerras interestatales y civiles tras la crisis federal." }
    ],
    related: ["Guerra entre Guatemala y El Salvador de 1906"],
    participants: [
      { side: "Estados centroamericanos enfrentados", members: ["Guatemala y rivales regionales segun etapa"], organizations: [], troops: "fuerzas regionales", casualties: "moderadas" }
    ],
    outcome: "Resultado historico variable segun la guerra concreta del corpus.",
    consequences: "Refleja la inestabilidad cronica del istmo en el siglo XIX."
  },
  "Second Guatemala War": EXTRA_CONFLICT_DETAIL_OVERRIDES["First Guatemala War"],
  "Third Guatemala War": EXTRA_CONFLICT_DETAIL_OVERRIDES["First Guatemala War"],
  "Guerra de Malvinas (1982)": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra de las Malvinas"],
  "Guerra contra el narcotráfico en México": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra contra el narcotrafico en Mexico"],
  "Guerra contra la Confederación Perú-Boliviana": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra contra la Confederacion Peru-Boliviana"],
  "Honduran-Salvadoran War de 1871": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra entre Honduras y El Salvador de 1871"]
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Conflicto armado colombiano": {
    cause: "Se origino en la combinacion de violencia partidista, desigualdad rural, insurgencias marxistas, paramilitarismo y economias ilegales como el narcotrafico.",
    type: "conflicto interno",
    scope: "regional",
    region: "Andes septentrionales",
    chronology: [
      { year: 1948, text: "Bogotazo y comienzo de La Violencia." },
      { year: 1964, text: "Nacimiento de las FARC y consolidacion de varias guerrillas." },
      { year: 1990, text: "Desmovilizaciones parciales y nueva Constitucion." },
      { year: 2002, text: "Escalada contrainsurgente y ofensiva estatal." },
      { year: 2016, text: "Acuerdo de paz con las FARC." }
    ],
    related: ["La Violencia", "Acuerdo de paz con las FARC"],
    participants: [
      { side: "Estado colombiano", members: ["Colombia"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Insurgencias y grupos armados", members: ["FARC", "ELN", "AUC y otros"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto parcialmente desescalado, pero no totalmente cerrado.",
    consequences: "Transformo la politica colombiana, produjo millones de desplazados y redefinio la seguridad regional andina."
  },
  "Guerra ruso-japonesa": {
    cause: "Estallo por la rivalidad imperial entre Rusia y Japon sobre Manchuria y Corea a comienzos del siglo XX.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia nororiental",
    chronology: [
      { year: 1904, text: "Ataque japones a Port Arthur y apertura de la guerra." },
      { year: 1904, text: "Campanas terrestres en Liaodong y Manchuria." },
      { year: 1905, text: "Batalla de Mukden y colapso de la posicion rusa en tierra." },
      { year: 1905, text: "Batalla de Tsushima y destruccion de la flota rusa del Baltico." },
      { year: 1905, text: "Tratado de Portsmouth." }
    ],
    related: ["Guerra de Corea", "Primera Guerra Mundial"],
    participants: [
      { side: "Japon", members: ["Japon"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Rusia", members: ["Imperio ruso"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria japonesa y reconocimiento de su influencia en Corea.",
    consequences: "Demostro el ascenso militar japones y acelero tensiones internas en el Imperio ruso."
  },
  "Guerra de Argelia": {
    cause: "Surgio de la lucha anticolonial argelina contra el dominio frances y de la negativa inicial de Paris a aceptar la independencia.",
    type: "conflicto interno",
    scope: "regional",
    region: "Magreb",
    chronology: [
      { year: 1954, text: "El FLN lanza la insurreccion del Dia de Todos los Santos." },
      { year: 1956, text: "Escalada de la guerra rural y urbana." },
      { year: 1957, text: "Batalla de Argel y auge de la represion francesa." },
      { year: 1961, text: "Fracasa el putsch de Argel y se acelera la salida francesa." },
      { year: 1962, text: "Acuerdos de Evian e independencia argelina." }
    ],
    related: ["Independencia de Argelia", "Descolonizacion francesa"],
    participants: [
      { side: "Movimiento independentista", members: ["FLN", "ALN"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Francia", members: ["Francia"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Independencia de Argelia tras los Acuerdos de Evian.",
    consequences: "Provoco la salida de Francia, un fuerte trauma politico interno y un cambio decisivo en la descolonizacion africana."
  },
  "Guerra del Pacifico": {
    cause: "Estallo por disputas fiscales y territoriales en el desierto de Atacama entre Chile, Bolivia y Peru.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Costa pacifica sudamericana",
    chronology: [
      { year: 1879, text: "Chile ocupa Antofagasta y comienza la guerra." },
      { year: 1879, text: "Combates navales de Iquique y Angamos." },
      { year: 1881, text: "Campana de Lima y ocupacion chilena de la capital peruana." },
      { year: 1883, text: "Tratado de Ancon." },
      { year: 1904, text: "Tratado de Paz y Amistad con Bolivia." }
    ],
    related: ["Cuestion maritima boliviana"],
    participants: [
      { side: "Chile", members: ["Chile"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Alianza Peru-Bolivia", members: ["Peru", "Bolivia"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria chilena con anexiones territoriales costeras y deserticas.",
    consequences: "Bolivia perdio su salida soberana al mar y Peru cedio territorios estrategicos."
  },
  "Guerra del Chaco": {
    cause: "Se produjo por la disputa entre Bolivia y Paraguay sobre el Chaco Boreal y el posible acceso a recursos y rios navegables.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Cono Sur interior",
    chronology: [
      { year: 1932, text: "Escalada de incidentes fronterizos y comienzo formal de la guerra." },
      { year: 1933, text: "Campanas de fortines y desgaste en el Chaco." },
      { year: 1935, text: "Armisticio y cese del fuego." },
      { year: 1938, text: "Tratado definitivo de paz." }
    ],
    related: ["Cuestion del Chaco Boreal"],
    participants: [
      { side: "Paraguay", members: ["Paraguay"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Bolivia", members: ["Bolivia"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Ventaja paraguaya y tratado favorable sobre gran parte del territorio disputado.",
    consequences: "Redefinio la frontera y tuvo un impacto politico duradero en ambos paises."
  },
  "Guerra de la Triple Alianza": {
    cause: "Escalo por la intervencion regional en Uruguay, la estrategia expansionista de Solano Lopez y la rivalidad sobre el control fluvial del Plata.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Cuenca del Plata",
    chronology: [
      { year: 1864, text: "Brasil interviene en Uruguay y se agrava la crisis regional." },
      { year: 1865, text: "Paraguay invade territorios brasileños y argentinos; se forma la Triple Alianza." },
      { year: 1868, text: "Caida de Humaita y colapso de la defensa paraguaya." },
      { year: 1870, text: "Muerte de Solano Lopez y fin de la guerra." }
    ],
    related: ["Guerra del Chaco"],
    participants: [
      { side: "Triple Alianza", members: ["Argentina", "Brasil", "Uruguay"], organizations: [], troops: "cientos de miles", casualties: "muy elevadas" },
      { side: "Paraguay", members: ["Paraguay"], organizations: [], troops: "decenas de miles", casualties: "catastroficas" }
    ],
    outcome: "Victoria de la Triple Alianza y derrota total paraguaya.",
    consequences: "Devasto demograficamente a Paraguay y altero por decadas el equilibrio politico del Cono Sur."
  },
  "Guerra peruano-ecuatoriana": {
    cause: "Se produjo por disputas fronterizas no resueltas en la Amazonia heredadas del periodo gran-colombiano y republicano temprano.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Andes y Amazonia occidental",
    chronology: [
      { year: 1941, text: "Campana militar peruana y derrota ecuatoriana." },
      { year: 1942, text: "Protocolo de Rio de Janeiro." },
      { year: 1981, text: "Crisis de Paquisha." },
      { year: 1995, text: "Guerra del Cenepa." },
      { year: 1998, text: "Acuerdo definitivo de Brasilia." }
    ],
    related: ["Guerra del Cenepa"],
    participants: [
      { side: "Peru", members: ["Peru"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Ecuador", members: ["Ecuador"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Superioridad militar peruana en 1941 y cierre diplomatico definitivo en 1998.",
    consequences: "Redefinio la frontera amazonica y redujo una de las disputas interestatales mas persistentes de Sudamerica."
  },
  "Guerra de las Malvinas": {
    cause: "Estallo por la ocupacion argentina de las islas y la decision britanica de recuperarlas por la fuerza.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Atlantico sur",
    chronology: [
      { year: 1982, text: "Argentina desembarca en las islas y desplaza a la guarnicion britanica." },
      { year: 1982, text: "Reino Unido envia una fuerza de tareas naval." },
      { year: 1982, text: "Combates aeronavales y desembarco britanico en San Carlos." },
      { year: 1982, text: "Caida de Puerto Argentino y rendicion argentina." }
    ],
    related: ["Disputa por las Islas Malvinas"],
    participants: [
      { side: "Argentina", members: ["Argentina"], organizations: [], troops: "decenas de miles", casualties: "centenares" },
      { side: "Reino Unido", members: ["Reino Unido"], organizations: [], troops: "decenas de miles", casualties: "centenares" }
    ],
    outcome: "Victoria britanica y restablecimiento del control sobre las islas.",
    consequences: "Acelero la caida de la junta argentina y reforzo la posicion britanica en el Atlantico sur."
  },
  "Revolucion cubana": {
    cause: "Se origino en la oposicion al regimen de Fulgencio Batista, la desigualdad social y la radicalizacion de la lucha armada contra el Estado.",
    type: "conflicto interno",
    scope: "regional",
    region: "Caribe",
    chronology: [
      { year: 1953, text: "Asalto al cuartel Moncada." },
      { year: 1956, text: "Desembarco del Granma y consolidacion de la guerrilla." },
      { year: 1958, text: "Ofensiva final rebelde." },
      { year: 1959, text: "Huida de Batista y toma del poder por los revolucionarios." }
    ],
    related: ["Crisis de los misiles", "Guerra fria"],
    participants: [
      { side: "Movimiento revolucionario", members: ["Movimiento 26 de Julio", "Directorio Revolucionario"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Regimen de Batista", members: ["Cuba"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria revolucionaria y establecimiento de un Estado socialista.",
    consequences: "Reconfiguro la geopolitica caribena y vinculo estrechamente a Cuba con el bloque sovietico."
  },
  "Revolucion mexicana": {
    cause: "Surgio del rechazo al porfiriato, la exclusion politica, la cuestion agraria y las fracturas entre elites regionales y movimientos campesinos.",
    type: "conflicto interno",
    scope: "regional",
    region: "America del Norte",
    chronology: [
      { year: 1910, text: "Llamado de Madero e inicio del levantamiento." },
      { year: 1911, text: "Caida de Porfirio Diaz." },
      { year: 1913, text: "Golpe de Huerta y radicalizacion del conflicto." },
      { year: 1917, text: "Promulgacion de la nueva Constitucion." },
      { year: 1920, text: "Fin del ciclo revolucionario principal." }
    ],
    related: ["Constitucion de 1917"],
    participants: [
      { side: "Facciones revolucionarias", members: ["Maderistas", "Constitucionalistas", "Zapatistas", "Villistas"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Regimen porfirista y gobiernos sucesores", members: ["Gobierno federal mexicano"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Reordenamiento del Estado mexicano bajo nuevo marco constitucional.",
    consequences: "Transformo el sistema politico, las relaciones agrarias y la legitimidad del Estado mexicano contemporaneo."
  },
  "Guerra ruso-ucraniana": {
    cause: "Se origino en la crisis abierta tras 2014 por Crimea y Donbas y escalo a invasion a gran escala en 2022.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Europa oriental",
    chronology: [
      { year: 2014, text: "Anexion de Crimea e inicio de la guerra en Donbas." },
      { year: 2015, text: "Acuerdos de Minsk y congelamiento incompleto del frente." },
      { year: 2022, text: "Invasion rusa a gran escala de Ucrania." },
      { year: 2023, text: "Contraofensivas ucranianas y guerra de desgaste prolongada." }
    ],
    related: ["Crisis de Crimea", "Guerra de Crimea"],
    participants: [
      { side: "Ucrania y socios occidentales", members: ["Ucrania"], organizations: ["apoyo OTAN y UE"], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Rusia y fuerzas asociadas", members: ["Rusia"], organizations: ["milicias y formaciones asociadas"], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto abierto sin resolucion definitiva.",
    consequences: "Redefinio la seguridad europea, rearmo a la OTAN y profundizo el aislamiento ruso frente a Occidente."
  },
  "Operacion Deliberate Force": {
    cause: "Fue lanzada por la OTAN tras nuevas masacres y ataques contra civiles en Bosnia, con el objetivo de forzar a las fuerzas serbobosnias a cesar el asedio y aceptar una solucion negociada.",
    type: "intervencion u ocupacion",
    scope: "regional",
    region: "Balcanes",
    chronology: [
      { year: 1995, text: "La OTAN inicia una campana aerea sostenida contra posiciones serbobosnias." },
      { year: 1995, text: "Se degradan sistemas antiaereos, depositos y nodos de mando serbobosnios." },
      { year: 1995, text: "La presion militar contribuye al alto el fuego y al camino hacia Dayton." }
    ],
    related: ["Guerra de Bosnia", "Guerra de Kosovo"],
    participants: [
      { side: "OTAN y gobierno bosnio", members: ["Estados Unidos", "Reino Unido", "Francia", "Alemania", "Bosnia y Herzegovina"], organizations: ["OTAN"], troops: "campana aerea y apoyo artillero", casualties: "limitadas en la coalicion" },
      { side: "Fuerzas serbobosnias", members: ["Republica Srpska"], organizations: [], troops: "fuerzas terrestres y defensas antiaereas", casualties: "significativas" }
    ],
    outcome: "Exito militar de la OTAN y debilitamiento de la capacidad serbobosnia.",
    consequences: "Acelero las negociaciones que desembocaron en los Acuerdos de Dayton y reconfiguro la guerra de Bosnia."
  },
  "Conflicto de Sa'dah": {
    cause: "Surgio por la rebelion huzi en el norte de Yemen frente al gobierno central, en un contexto de marginacion regional, tensiones sectarias y creciente militarizacion del Estado.",
    type: "conflicto interno",
    scope: "regional",
    region: "Peninsula arabiga",
    chronology: [
      { year: 2004, text: "Comienza el levantamiento huzi en Sa'dah y la primera guerra con el gobierno yemeni." },
      { year: 2006, text: "Se suceden nuevas campanas militares sin solucion definitiva." },
      { year: 2009, text: "La guerra se internacionaliza parcialmente con choques en la frontera saudi." },
      { year: 2010, text: "Alto el fuego fragil que deja el conflicto latente." }
    ],
    related: ["Guerra civil yemeni", "Insurgencia huzi en Yemen"],
    participants: [
      { side: "Gobierno de Yemen y aliados", members: ["Yemen", "Arabia Saudita"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Movimiento huzi", members: ["Huzies"], organizations: [], troops: "miles y luego decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Conflicto inconcluso que fortalecio a los huzies a largo plazo.",
    consequences: "Preparo parte del escenario para la guerra civil yemeni de escala nacional posterior a 2014."
  },
  "Guerra por el agua del río Jordán": {
    cause: "Se produjo por la disputa entre Israel y varios estados arabes sobre la utilizacion y desvio de las aguas del rio Jordan y sus afluentes.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 1964, text: "Escalan los proyectos de desvio de agua y los intercambios de fuego fronterizos." },
      { year: 1965, text: "Aumentan los ataques israelies contra obras hidraulicas y posiciones sirias." },
      { year: 1967, text: "La disputa hidrica se integra en la escalada estrategica previa a la Guerra de los Seis Dias." }
    ],
    related: ["Guerra de los Seis Dias", "Guerra de Desgaste"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas fronterizas y aereas", casualties: "limitadas pero persistentes" },
      { side: "Estados arabes ribereños", members: ["Siria", "Jordania", "Libano"], organizations: ["Liga Arabe"], troops: "fuerzas fronterizas y artilleria", casualties: "limitadas pero persistentes" }
    ],
    outcome: "Sin resolucion definitiva previa a 1967, pero con ventaja militar israeli.",
    consequences: "Profundizo la rivalidad arabe-israeli y fue uno de los factores que alimentaron la guerra de 1967."
  },
  "1984 DMZ incident": {
    cause: "Se desencadeno por el cruce y enfrentamiento armado en la zona desmilitarizada coreana durante la Guerra Fria, en un contexto de tension permanente entre ambas Coreas.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia oriental",
    chronology: [
      { year: 1984, text: "Un visitante sovietico cruza al sur y se produce un intenso tiroteo en la ZDC." }
    ],
    related: ["Guerra de Corea"],
    participants: [
      { side: "Corea del Norte", members: ["Corea del Norte"], organizations: [], troops: "guardias fronterizos", casualties: "limitadas" },
      { side: "Corea del Sur y ONU", members: ["Corea del Sur", "Estados Unidos"], organizations: ["ONU"], troops: "guardias fronterizos", casualties: "limitadas" }
    ],
    outcome: "Incidente localizado con bajas y regreso a la tensa estabilidad fronteriza.",
    consequences: "Reafirmo la volatilidad de la zona desmilitarizada y la vigencia del conflicto coreano no resuelto."
  },
  "Struggle for Negev 1947-1956": {
    cause: "Formo parte de la lucha por el control del Neguev en el marco de la guerra arabe-israeli de 1948 y de las disputas fronterizas posteriores entre Israel y Egipto.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 1947, text: "Comienza la disputa por el control territorial del Neguev." },
      { year: 1948, text: "La guerra arabe-israeli convierte el Neguev en teatro militar central." },
      { year: 1956, text: "La crisis del Sinai cierra el primer gran ciclo de enfrentamientos en la zona." }
    ],
    related: ["Guerra arabe-israeli de 1948", "Guerra del Sinai"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas regulares y milicias", casualties: "elevadas" },
      { side: "Fuerzas arabes", members: ["Egipto", "fuerzas palestinas y arabes"], organizations: ["Liga Arabe"], troops: "fuerzas regulares y voluntarios", casualties: "elevadas" }
    ],
    outcome: "Consolidacion progresiva del control israeli sobre el Neguev.",
    consequences: "Contribuyo a fijar una de las dimensiones territoriales mas sensibles del conflicto arabe-israeli."
  },
  "Batalla de Amiens": {
    cause: "Fue lanzada por los Aliados para quebrar el impulso aleman y recuperar la iniciativa en el frente occidental al final de la Primera Guerra Mundial.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Europa occidental",
    chronology: [
      { year: 1918, text: "Ataque sorpresa aliado con apoyo blindado, artilleria coordinada y aviacion." },
      { year: 1918, text: "Retroceso aleman y apertura del periodo conocido como los Cien Dias." }
    ],
    related: ["Primera Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Francia", "Australia", "Canada", "Estados Unidos"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Imperio aleman", members: ["Alemania"], organizations: [], troops: "centenares de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada decisiva.",
    consequences: "Marco el inicio del derrumbe militar aleman en 1918."
  },
  "Batalla de Bubiyan": {
    cause: "Se produjo durante la Guerra del Golfo, cuando fuerzas navales y aereas de la coalicion interceptaron unidades iraquies que intentaban retirarse o reubicarse cerca de Kuwait.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Golfo Persico",
    chronology: [
      { year: 1991, text: "La coalicion detecta y ataca formaciones navales iraquies en la zona de Bubiyan." }
    ],
    related: ["Guerra del Golfo"],
    participants: [
      { side: "Coalicion internacional", members: ["Estados Unidos", "Reino Unido", "Kuwait y aliados"], organizations: [], troops: "fuerzas navales y aereas", casualties: "bajas" },
      { side: "Irak", members: ["Irak"], organizations: [], troops: "fuerzas navales y lanchas rapidas", casualties: "significativas" }
    ],
    outcome: "Victoria de la coalicion y neutralizacion de medios iraquies.",
    consequences: "Aseguro la superioridad naval de la coalicion en el teatro kuwaiti-iraqui."
  },
  "Batalla de Long Tan": {
    cause: "Se produjo en el contexto de la guerra de Vietnam cuando fuerzas australianas entraron en contacto con una fuerza comunista superior en Phuoc Tuy.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Sudeste asiatico",
    chronology: [
      { year: 1966, text: "Una compania australiana resiste durante horas bajo fuerte presion enemiga y tormenta monzonica." }
    ],
    related: ["Guerra de Vietnam"],
    participants: [
      { side: "Australia y Vietnam del Sur", members: ["Australia", "Vietnam del Sur"], organizations: [], troops: "centenares", casualties: "moderadas" },
      { side: "Viet Cong y Vietnam del Norte", members: ["Viet Cong", "Vietnam del Norte"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Victoria tactica australiana.",
    consequences: "Consolido la reputacion combativa de las fuerzas australianas en Vietnam."
  },
  "Batalla de Manila": {
    cause: "Formo parte de la campaña para recuperar Filipinas, con el objetivo aliado de expulsar a Japon de la capital filipina.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Sudeste asiatico",
    chronology: [
      { year: 1945, text: "Las fuerzas estadounidenses y filipinas entran en Manila y se desarrolla un combate urbano devastador." },
      { year: 1945, text: "La resistencia japonesa es aniquilada tras enormes daños civiles y patrimoniales." }
    ],
    related: ["Segunda Guerra Mundial", "Batalla de Luzon"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos", "Filipinas"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Japon", members: ["Japon"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria aliada y recuperacion de Manila.",
    consequences: "La ciudad sufrio una devastacion extrema y grandes masacres de civiles."
  },
  "Campaña de Borneo": {
    cause: "Fue parte de la ofensiva aliada final en el sudeste asiatico para expulsar a Japon de Borneo y asegurar recursos y posiciones maritimas clave.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Sudeste asiatico",
    chronology: [
      { year: 1945, text: "Desembarcos aliados y operaciones anfibias en Tarakan, Brunei y Balikpapan." },
      { year: 1945, text: "Las fuerzas japonesas retroceden o quedan aisladas hasta el final de la guerra." }
    ],
    related: ["Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Australia", "Estados Unidos", "fuerzas locales aliadas"], organizations: [], troops: "decenas de miles", casualties: "moderadas" },
      { side: "Japon", members: ["Japon"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Contribuyo al colapso del control japones en el sudeste asiatico insular."
  },
  "Campaña de Borneo": {
    cause: "Fue parte de la ofensiva aliada final en el sudeste asiatico para expulsar a Japon de Borneo y asegurar recursos y posiciones maritimas clave.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Sudeste asiatico",
    chronology: [
      { year: 1945, text: "Desembarcos aliados y operaciones anfibias en Tarakan, Brunei y Balikpapan." },
      { year: 1945, text: "Las fuerzas japonesas retroceden o quedan aisladas hasta el final de la guerra." }
    ],
    related: ["Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Australia", "Estados Unidos", "fuerzas locales aliadas"], organizations: [], troops: "decenas de miles", casualties: "moderadas" },
      { side: "Japon", members: ["Japon"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Contribuyo al colapso del control japones en el sudeste asiatico insular."
  },
  "Batalla de Cheonpyeong Valley": {
    cause: "Se produjo durante la Guerra de Corea cuando fuerzas chinas intentaron romper posiciones defendidas por tropas de la ONU en el valle de Cheonpyeong.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia oriental",
    chronology: [
      { year: 1951, text: "Fuerzas chinas lanzan ataques intensos contra posiciones aliadas." },
      { year: 1951, text: "Las tropas de la ONU resisten y conservan el control del sector." }
    ],
    related: ["Guerra de Corea"],
    participants: [
      { side: "ONU", members: ["Estados Unidos", "Francia", "Corea del Sur"], organizations: ["ONU"], troops: "miles", casualties: "elevadas" },
      { side: "China", members: ["China"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Defensa exitosa de las posiciones de la ONU.",
    consequences: "Contribuyo a contener las ofensivas chinas en la fase de guerra de posiciones."
  },
  "Batalla de Punchbowl": {
    cause: "Fue una serie de ofensivas y contraofensivas por posiciones elevadas estrategicas en la fase de desgaste de la Guerra de Corea.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia oriental",
    chronology: [
      { year: 1951, text: "Las fuerzas de la ONU atacan colinas y crestas alrededor de Punchbowl." },
      { year: 1951, text: "La lucha deriva en una guerra de posiciones con fuertes bajas en ambos bandos." }
    ],
    related: ["Guerra de Corea"],
    participants: [
      { side: "ONU", members: ["Estados Unidos", "Corea del Sur"], organizations: ["ONU"], troops: "miles", casualties: "elevadas" },
      { side: "Corea del Norte y China", members: ["Corea del Norte", "China"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Ganancias tacticas limitadas de la ONU.",
    consequences: "Ejemplifico el caracter de desgaste y alto costo humano de la guerra en 1951."
  },
  "Batalla de Hook": {
    cause: "Fue una lucha por una posicion avanzada crucial en el sector occidental del frente durante las fases finales de la Guerra de Corea.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia oriental",
    chronology: [
      { year: 1952, text: "Primeros choques por la posicion de Hook." },
      { year: 1953, text: "Nuevos asaltos chinos son rechazados por fuerzas de la ONU." }
    ],
    related: ["Guerra de Corea", "Segunda batalla de Hook"],
    participants: [
      { side: "ONU", members: ["Reino Unido", "Estados Unidos", "Corea del Sur"], organizations: ["ONU"], troops: "centenares y miles", casualties: "moderadas" },
      { side: "China", members: ["China"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Posicion mantenida por fuerzas de la ONU.",
    consequences: "Aseguro un punto defensivo clave cerca del armisticio y reforzo el control aliado del sector."
  },
  "Batalla del Estrecho de Corea": {
    cause: "Se produjo al inicio de la Guerra de Corea cuando fuerzas navales de la ONU interceptaron un convoy norcoreano cerca del estrecho de Corea.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia oriental",
    chronology: [
      { year: 1950, text: "Buques aliados interceptan y destruyen unidades navales norcoreanas." }
    ],
    related: ["Guerra de Corea"],
    participants: [
      { side: "ONU", members: ["Reino Unido", "Estados Unidos"], organizations: ["ONU"], troops: "fuerzas navales", casualties: "bajas" },
      { side: "Corea del Norte", members: ["Corea del Norte"], organizations: [], troops: "fuerzas navales", casualties: "significativas" }
    ],
    outcome: "Victoria naval de la ONU.",
    consequences: "Aseguro las primeras lineas maritimas aliadas y limito la proyeccion norcoreana por mar."
  },
  "Guerra camboyano-vietnamita": {
    cause: "Estallo por incursiones fronterizas, masacres del regimen jemer rojo y la decision vietnamita de invadir Camboya para derribarlo.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Sudeste asiatico",
    chronology: [
      { year: 1977, text: "Escalan los choques fronterizos entre Camboya democratica y Vietnam." },
      { year: 1978, text: "Vietnam lanza una invasion a gran escala." },
      { year: 1979, text: "Caida del regimen de Pol Pot y establecimiento de un gobierno pro-vietnamita." }
    ],
    related: ["Tercera Guerra de Indochina", "Guerra sino-vietnamita"],
    participants: [
      { side: "Vietnam y aliados camboyanos", members: ["Vietnam", "Frente Unido para la Salvacion Nacional de Kampuchea"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Camboya Democratica", members: ["Jemeres Rojos"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria vietnamita y colapso del regimen jemer rojo.",
    consequences: "Reconfiguro el equilibrio del sudeste asiatico y abrio una larga ocupacion vietnamita de Camboya."
  },
  "Guerra sino-vietnamita": {
    cause: "China intervino para castigar a Vietnam por su invasion de Camboya y por la creciente alineacion vietnamita con la Union Sovietica.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Asia oriental",
    chronology: [
      { year: 1979, text: "China invade el norte de Vietnam en una ofensiva de castigo." },
      { year: 1979, text: "Tras semanas de combates intensos, China anuncia su retirada." }
    ],
    related: ["Guerra camboyano-vietnamita", "Tercera Guerra de Indochina"],
    participants: [
      { side: "China", members: ["China"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Vietnam", members: ["Vietnam"], organizations: [], troops: "centenares de miles", casualties: "elevadas" }
    ],
    outcome: "Resultado militar ambiguo con retirada china.",
    consequences: "Profundizo la rivalidad sino-vietnamita y confirmo la fragmentacion del campo comunista asiatico."
  },
  "Conflicto entre la República Democrática del Congo y Ruanda": {
    cause: "Surgio de acusaciones mutuas sobre apoyo a milicias y presencia armada transfronteriza en el este congoleño.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Africa central",
    chronology: [
      { year: 1998, text: "La rivalidad abierta entre Kigali y Kinshasa se integra a la Segunda Guerra del Congo." },
      { year: 2022, text: "Nuevas tensiones por el M23 y acusaciones de apoyo ruandes." },
      { year: 2024, text: "Persisten choques diplomaticos y escaladas armadas indirectas." }
    ],
    related: ["Segunda guerra del Congo", "Guerra de Kivu"],
    participants: [
      { side: "RDC y aliados", members: ["Republica Democratica del Congo"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Ruanda y actores asociados", members: ["Ruanda", "grupos rebeldes aliados"], organizations: [], troops: "decenas de miles y fuerzas indirectas", casualties: "elevadas" }
    ],
    outcome: "Conflicto intermitente y no resuelto.",
    consequences: "Mantiene inestable el este congoleño y agrava una de las mayores crisis humanitarias de Africa."
  },
  "Frente Oriental de la Segunda Guerra Mundial": {
    cause: "Se abrio tras la invasion alemana de la Union Sovietica dentro de la estrategia nazi de expansion imperial y destruccion del estado sovietico.",
    type: "guerra mundial",
    scope: "global",
    region: "Europa oriental",
    chronology: [
      { year: 1941, text: "Operacion Barbarroja abre el mayor frente terrestre de la guerra." },
      { year: 1942, text: "Escalada hacia Stalingrado y el Caucaso." },
      { year: 1943, text: "Stalingrado y Kursk revierten la iniciativa a favor sovietico." },
      { year: 1945, text: "Las fuerzas sovieticas toman Berlin y precipitan la derrota alemana." }
    ],
    related: ["Segunda Guerra Mundial"],
    participants: [
      { side: "Eje", members: ["Alemania", "Rumania", "Hungria", "Italia", "Finlandia y otros"], organizations: [], troops: "millones", casualties: "extremadamente elevadas" },
      { side: "Union Sovietica", members: ["Union Sovietica"], organizations: [], troops: "millones", casualties: "extremadamente elevadas" }
    ],
    outcome: "Victoria sovietica decisiva.",
    consequences: "Destruyo la capacidad militar principal de Alemania y definio el orden de posguerra en Europa."
  },
  "Guerra de independencia de Israel": {
    cause: "Estallo tras la proclamacion del Estado de Israel y el rechazo arabe al plan de particion y a la consolidacion del nuevo estado.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 1947, text: "Comienza la guerra civil en el Mandato britanico tras el plan de particion." },
      { year: 1948, text: "Se proclama Israel e intervienen estados arabes vecinos." },
      { year: 1949, text: "Armisticios que consolidan el control israeli sobre mas territorio del previsto originalmente." }
    ],
    related: ["Guerra arabe-israeli de 1948"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Estados arabes y fuerzas palestinas", members: ["Egipto", "Jordania", "Siria", "Irak", "Libano", "fuerzas palestinas"], organizations: ["Liga Arabe"], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria israeli y consolidacion estatal.",
    consequences: "Genero el problema palestino de refugiados y abrio una era de guerras arabe-israelies recurrentes."
  },
  "Conflicto entre Gaza e Israel": {
    cause: "Se explica por la prolongada disputa israelo-palestina, el bloqueo de Gaza, la presencia de Hamas y ciclos repetidos de ataques y represalias.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 2007, text: "Hamas consolida su control de Gaza y se endurece el bloqueo." },
      { year: 2014, text: "Grandes operaciones militares y devastacion en Gaza." },
      { year: 2023, text: "Escalada masiva tras ataques de Hamas y respuesta israeli de gran escala." }
    ],
    related: ["Conflicto israelo-palestino", "Guerra de independencia de Israel"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas terrestres, aereas y navales", casualties: "elevadas" },
      { side: "Hamas y milicias palestinas", members: ["Hamas", "Yihad Islamica Palestina y otras milicias"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto recurrente sin resolucion definitiva.",
    consequences: "Mantiene una grave crisis humanitaria y una inestabilidad regional de alto impacto."
  },
  "Conflicto irano-israeli": {
    cause: "Deriva de la rivalidad estrategica entre Iran e Israel, el programa nuclear irani, el apoyo de Teheran a milicias regionales y la competencia por influencia en Oriente Medio.",
    type: "conflicto regional",
    scope: "regional",
    region: "Oriente Medio",
    chronology: [
      { year: 1979, text: "La Revolucion irani transforma la relacion con Israel en una rivalidad abierta." },
      { year: 2000, text: "Aumentan las tensiones por el programa nuclear irani y el apoyo a Hezbola y Hamas." },
      { year: 2024, text: "Se producen intercambios directos e indirectos de ataques que elevan la tension regional." }
    ],
    related: ["Conflicto entre Gaza e Israel", "Conflicto irano-israeli durante la guerra civil siria"],
    participants: [
      { side: "Iran y aliados regionales", members: ["Iran", "Hezbola", "milicias aliadas"], organizations: [], troops: "fuerzas regulares, misiles y drones", casualties: "variables segun episodio" },
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas terrestres, aereas, navales y defensa antimisiles", casualties: "variables segun episodio" }
    ],
    outcome: "Rivalidad abierta sin resolucion definitiva.",
    consequences: "Ha multiplicado el riesgo de guerra regional y la militarizacion del Levante y del Golfo."
  },
  "Conflicto irano-israeli durante la guerra civil siria": {
    cause: "Se intensifico por la presencia irani y de milicias aliadas en Siria y los esfuerzos israelies por impedir su consolidacion militar cerca de sus fronteras.",
    type: "intervencion regional",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 2012, text: "Iran amplia su presencia militar y de asesores en Siria." },
      { year: 2017, text: "Israel intensifica ataques aereos contra infraestructura irani y convoyes aliados." },
      { year: 2024, text: "La rivalidad se inserta en una escalada regional mas amplia." }
    ],
    related: ["Guerra civil siria", "Conflicto irano-israeli"],
    participants: [
      { side: "Eje pro-irani", members: ["Iran", "Cuerpo de Guardianes de la Revolucion Islamica", "Hezbola", "milicias aliadas"], organizations: [], troops: "asesores, misiles y milicias", casualties: "significativas" },
      { side: "Israel", members: ["Israel"], organizations: [], troops: "aviacion, inteligencia y defensa antiaerea", casualties: "limitadas pero persistentes" }
    ],
    outcome: "Conflicto de baja y media intensidad persistente.",
    consequences: "Contribuyo a la internacionalizacion de la guerra civil siria y a la ampliacion del frente israelo-irani."
  },
  "Conflicto fronterizo sirio-israeli (2012-presente)": {
    cause: "Se origino en el desborde de la guerra civil siria hacia la frontera del Golan y en choques con milicias, fuerzas sirias y acciones preventivas israelies.",
    type: "conflicto fronterizo",
    scope: "regional",
    region: "Altos del Golan",
    chronology: [
      { year: 2012, text: "Incidentes de fuego cruzado alcanzan el area de separacion del Golan." },
      { year: 2018, text: "Israel incrementa ataques preventivos ante el avance de fuerzas pro-iranies." },
      { year: 2024, text: "Persisten episodios de tension vinculados al conflicto regional." }
    ],
    related: ["Guerra civil siria", "Conflicto irano-israeli durante la guerra civil siria"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "unidades de frontera, artilleria y aviacion", casualties: "limitadas" },
      { side: "Siria y actores armados en su territorio", members: ["Siria", "milicias pro-iranies", "grupos insurgentes segun etapa"], organizations: [], troops: "variables", casualties: "variables" }
    ],
    outcome: "Frontera militarizada e inestable.",
    consequences: "Reforzo el riesgo de escalada en los Altos del Golan y vinculo la frontera a la dinamica regional."
  },
  "Guerra de Gaza": {
    cause: "Forma parte de los grandes ciclos de guerra entre Israel y Hamas en Gaza, agravados por el bloqueo, ataques con cohetes y operaciones militares de gran escala.",
    type: "guerra regional",
    scope: "regional",
    region: "Gaza",
    chronology: [
      { year: 2008, text: "Israel lanza una gran ofensiva sobre Gaza tras una fuerte escalada de hostilidades." },
      { year: 2009, text: "La operacion concluye con gran destruccion y fuerte impacto humanitario." }
    ],
    related: ["Conflicto entre Gaza e Israel", "Guerra de Gaza de 2012"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas terrestres, aereas y navales", casualties: "centenares" },
      { side: "Hamas y otras milicias", members: ["Hamas", "milicias palestinas"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Cese del fuego sin solucion politica duradera.",
    consequences: "Profundizo la crisis humanitaria en Gaza y consolido un patron de guerras periodicas."
  },
  "Guerra de Gaza de 2012": {
    cause: "Escalo tras asesinatos selectivos, lanzamiento de cohetes desde Gaza y la respuesta militar israeli.",
    type: "conflicto regional",
    scope: "regional",
    region: "Gaza",
    chronology: [
      { year: 2012, text: "Israel inicia una operacion aerea amplia contra Hamas y otros grupos armados." },
      { year: 2012, text: "Egipto media un cese del fuego tras dias de intensos ataques reciprocos." }
    ],
    related: ["Guerra de Gaza", "Conflicto entre Gaza e Israel"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "aviacion y sistemas antimisiles", casualties: "decenas" },
      { side: "Hamas y milicias palestinas", members: ["Hamas", "Yihad Islamica Palestina"], organizations: [], troops: "miles", casualties: "centenares" }
    ],
    outcome: "Cese del fuego mediado por Egipto.",
    consequences: "Mostro la persistencia del conflicto y la capacidad de escalada rapida en Gaza."
  },
  "Batalla de Incheon": {
    cause: "Fue lanzada por la ONU para revertir el avance norcoreano durante la Guerra de Corea mediante un desembarco anfibio sorpresivo en Incheon.",
    type: "desembarco anfibio",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "La ONU prepara una operacion anfibia para romper el equilibrio del frente." },
      { year: 1950, text: "El desembarco en Incheon logra una sorpresa operacional decisiva." },
      { year: 1950, text: "La captura de Seul desarticula la ofensiva inicial norcoreana." }
    ],
    related: ["Guerra de Corea", "Ofensiva de la ONU en Corea del Norte"],
    participants: [
      { side: "ONU y Corea del Sur", members: ["Estados Unidos", "Corea del Sur", "ONU"], organizations: ["ONU"], troops: "decenas de miles", casualties: "moderadas" },
      { side: "Corea del Norte", members: ["Corea del Norte"], organizations: [], troops: "guarniciones y fuerzas de apoyo", casualties: "significativas" }
    ],
    outcome: "Victoria decisiva de la ONU.",
    consequences: "Permitio recuperar Seul y cambiar el curso inicial de la Guerra de Corea."
  },
  "Ofensiva de la ONU en Corea del Norte": {
    cause: "Siguio al exito de Incheon y busco destruir al ejercito norcoreano y reunificar la peninsula bajo Seul.",
    type: "ofensiva terrestre",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "Las fuerzas de la ONU cruzan el paralelo 38." },
      { year: 1950, text: "El avance rapido hacia el norte desencadena la intervencion china." },
      { year: 1950, text: "La ofensiva se revierte tras contraataques sino-norcoreanos." }
    ],
    related: ["Guerra de Corea", "Batalla de Incheon"],
    participants: [
      { side: "ONU y Corea del Sur", members: ["Estados Unidos", "Corea del Sur", "ONU"], organizations: ["ONU"], troops: "centenares de miles", casualties: "altas" },
      { side: "Corea del Norte y China", members: ["Corea del Norte", "China"], organizations: [], troops: "centenares de miles", casualties: "muy altas" }
    ],
    outcome: "Avance inicial de la ONU seguido por repliegue tras la intervencion china.",
    consequences: "Transformo la guerra en un conflicto prolongado de posicion con fuerte internacionalizacion."
  },
  "Contraofensiva vietnamita fase II": {
    cause: "Respondio a la necesidad estadounidense y sudvietnamita de recuperar iniciativa tras la intensificacion de la guerra en Vietnam del Sur.",
    type: "campaña",
    scope: "regional",
    region: "Indochina",
    chronology: [
      { year: 1966, text: "Se lanzan operaciones ofensivas de gran escala contra el Viet Cong y fuerzas norvietnamitas." },
      { year: 1967, text: "La campaña incrementa el desgaste sin lograr una decision definitiva." }
    ],
    related: ["Guerra de Vietnam"],
    participants: [
      { side: "Estados Unidos y Vietnam del Sur", members: ["Estados Unidos", "Vietnam del Sur"], organizations: [], troops: "centenares de miles", casualties: "altas" },
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "centenares de miles", casualties: "altas" }
    ],
    outcome: "Ganancias tacticas sin victoria estrategica decisiva.",
    consequences: "Contribuyo al desgaste prolongado y a la escalada del conflicto."
  },
  "Contraofensiva vietnamita fase III": {
    cause: "Continuo la estrategia de desgaste estadounidense en Vietnam del Sur frente a la persistencia de fuerzas comunistas.",
    type: "campaña",
    scope: "regional",
    region: "Indochina",
    chronology: [
      { year: 1967, text: "Se intensifican operaciones de busqueda y destruccion en varias regiones de Vietnam del Sur." },
      { year: 1968, text: "La ofensiva del Tet revela los limites de la estrategia aliada pese a sus exitos tacticos previos." }
    ],
    related: ["Guerra de Vietnam", "Contraofensiva vietnamita fase II"],
    participants: [
      { side: "Estados Unidos y Vietnam del Sur", members: ["Estados Unidos", "Vietnam del Sur"], organizations: [], troops: "centenares de miles", casualties: "altas" },
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "centenares de miles", casualties: "altas" }
    ],
    outcome: "Balance tactico favorable a los aliados sin resolver la guerra.",
    consequences: "Preparo el escenario militar y politico para la ofensiva del Tet."
  },
  "Choque israelo-britanico del 7 de enero de 1949": {
    cause: "Se produjo durante el cierre de la guerra arabe-israeli de 1948 cuando fuerzas israelies y britanicas entraron en contacto armado en el contexto egipcio-palestino.",
    type: "choque interestatal limitado",
    scope: "regional",
    region: "Sinai y frontera egipcio-palestina",
    chronology: [
      { year: 1949, text: "Unidades britanicas y aviones de la RAF se ven involucrados en enfrentamientos con fuerzas israelies." },
      { year: 1949, text: "La crisis se contiene rapidamente para evitar una guerra mayor entre Israel y Reino Unido." }
    ],
    related: ["Guerra de independencia de Israel"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas terrestres y aereas", casualties: "limitadas" },
      { side: "Reino Unido", members: ["Reino Unido"], organizations: [], troops: "RAF y fuerzas de apoyo", casualties: "limitadas" }
    ],
    outcome: "Incidente contenido sin escalada mayor.",
    consequences: "Evidencio la fragilidad del escenario de posguerra en Palestina y las tensiones con la potencia mandataria saliente."
  },
  "Batalla de las Ardenas": {
    cause: "Fue la ultima gran ofensiva alemana en el frente occidental para dividir a los Aliados y forzar una negociacion favorable a Alemania.",
    type: "batalla",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1944, text: "Alemania lanza un ataque sorpresa en las Ardenas contra posiciones aliadas." },
      { year: 1944, text: "La resistencia aliada y la mejora del clima permiten contener la ofensiva." },
      { year: 1945, text: "El fracaso aleman agota reservas decisivas del Reich." }
    ],
    related: ["Segunda Guerra Mundial", "Frente Occidental de la Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos", "Reino Unido", "Belgica"], organizations: ["Aliados"], troops: "centenares de miles", casualties: "muy altas" },
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "centenares de miles", casualties: "muy altas" }
    ],
    outcome: "Victoria aliada decisiva.",
    consequences: "Acelero el colapso final del Tercer Reich en el frente occidental."
  },
  "Batalla de North Borneo": {
    cause: "Se inserto en la campaña aliada para recuperar Borneo del dominio japones y asegurar rutas y posiciones clave en el sudeste asiatico.",
    type: "batalla",
    scope: "regional",
    region: "Borneo septentrional",
    chronology: [
      { year: 1945, text: "Fuerzas australianas y aliadas desembarcan en el norte de Borneo." },
      { year: 1945, text: "Las posiciones japonesas retroceden ante el avance aliado." }
    ],
    related: ["Campaña de Borneo", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Australia", "Reino Unido", "fuerzas locales"], organizations: ["Aliados"], troops: "decenas de miles", casualties: "moderadas" },
      { side: "Japon", members: ["Japon"], organizations: ["Potencias del Eje"], troops: "guarniciones regionales", casualties: "significativas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Contribuyo a la liberacion de Borneo y al colapso japones en el sudeste asiatico."
  }
});

Object.assign(EXTRA_CURATED_TIMELINE_EXTRAS, {
  BOL: [
    { year: 1825, category: "formation", text: "Fundacion de Bolivia independiente", reference: "Independencia de Bolivia", intensity: "alta" },
    { year: 1879, category: "conflict", text: "Inicio de la Guerra del Pacifico", reference: "Guerra del Pacifico", intensity: "alta" },
    { year: 2009, category: "constitution", text: "Nueva Constitucion del Estado Plurinacional", reference: "Constitucion de 2009", intensity: "alta" }
  ],
  CAN: [
    { year: 1867, category: "union", text: "Confederacion canadiense y nacimiento del Dominio de Canada", reference: "Confederacion canadiense", intensity: "alta" },
    { year: 1931, category: "tratado", text: "Estatuto de Westminster y autonomia legislativa plena", reference: "Estatuto de Westminster", intensity: "media" },
    { year: 1982, category: "constitucion", text: "Patriacion constitucional y Carta de Derechos", reference: "Constitucion de 1982", intensity: "alta" }
  ],
  COL: [
    { year: 1819, category: "formation", text: "Victoria de Boyaca y consolidacion independentista", reference: "Independencia de Colombia", intensity: "alta" },
    { year: 1948, category: "conflict", text: "Bogotazo y ciclo de La Violencia", reference: "La Violencia", intensity: "alta" },
    { year: 1991, category: "constitution", text: "Nueva Constitucion colombiana", reference: "Constitucion de 1991", intensity: "alta" },
    { year: 2016, category: "treaty", text: "Acuerdo de paz con las FARC", reference: "Acuerdo de paz con las FARC", intensity: "alta" }
  ],
  CUB: [
    { year: 1902, category: "formation", text: "Proclamacion de la Republica de Cuba", reference: "Republica de Cuba", intensity: "media" },
    { year: 1959, category: "conflict", text: "Triunfo de la Revolucion cubana", reference: "Revolucion cubana", intensity: "alta" },
    { year: 1962, category: "conflict", text: "Crisis de los misiles", reference: "Crisis de los misiles", intensity: "alta" }
  ],
  ECU: [
    { year: 1830, category: "secession", text: "Separacion de la Gran Colombia", reference: "Separacion de la Gran Colombia", intensity: "alta" },
    { year: 1941, category: "conflict", text: "Guerra peruano-ecuatoriana", reference: "Guerra peruano-ecuatoriana", intensity: "alta" },
    { year: 2008, category: "constitution", text: "Constitucion de Montecristi", reference: "Constitucion de 2008", intensity: "alta" }
  ],
  ETH: [
    { year: 1896, category: "conflict", text: "Victoria de Adwa contra Italia y preservacion de la soberania", reference: "Batalla de Adwa", intensity: "alta" },
    { year: 1974, category: "golpe", text: "Derrocamiento de Haile Selassie y ascenso del Derg", reference: "Golpe de 1974", intensity: "alta" },
    { year: 1995, category: "constitucion", text: "Nueva constitucion federal etiope", reference: "Constitucion de 1995", intensity: "alta" }
  ],
  ITA: [
    { year: 1861, category: "formation", text: "Proclamacion del Reino de Italia", reference: "Unificacion italiana", intensity: "alta" },
    { year: 1922, category: "cambio_regimen", text: "Marcha sobre Roma y ascenso del fascismo", reference: "Marcha sobre Roma", intensity: "alta" },
    { year: 1946, category: "cambio_regimen", text: "Referendum institucional y fin de la monarquia", reference: "Referendum de 1946", intensity: "alta" }
  ],
  JPN: [
    { year: 1868, category: "reforma", text: "Restauracion Meiji y centralizacion del Estado", reference: "Restauracion Meiji", intensity: "alta" },
    { year: 1945, category: "cambio_regimen", text: "Capitulacion imperial y ocupacion aliada", reference: "Fin de la Segunda Guerra Mundial en Japon", intensity: "alta" }
  ],
  MEX: [
    { year: 1810, category: "formation", text: "Inicio de la independencia con el Grito de Dolores", reference: "Independencia de Mexico", intensity: "alta" },
    { year: 1910, category: "conflict", text: "Comienzo de la Revolucion mexicana", reference: "Revolucion mexicana", intensity: "alta" },
    { year: 1917, category: "constitution", text: "Constitucion de Queretaro", reference: "Constitucion de 1917", intensity: "alta" }
  ],
  PER: [
    { year: 1821, category: "formation", text: "Proclamacion de la independencia peruana", reference: "Independencia del Peru", intensity: "alta" },
    { year: 1879, category: "conflict", text: "Guerra del Pacifico", reference: "Guerra del Pacifico", intensity: "alta" },
    { year: 1992, category: "coup", text: "Autogolpe de Fujimori", reference: "Autogolpe de 1992", intensity: "alta" }
  ],
  POL: [
    { year: 1791, category: "constitucion", text: "Constitucion del 3 de mayo", reference: "Constitucion de 1791", intensity: "alta" },
    { year: 1989, category: "reforma", text: "Transicion democratica y fin del regimen comunista", reference: "Transicion polaca de 1989", intensity: "alta" }
  ],
  PRY: [
    { year: 1811, category: "formation", text: "Independencia del Paraguay", reference: "Independencia del Paraguay", intensity: "alta" },
    { year: 1865, category: "conflict", text: "Ingreso en la Guerra de la Triple Alianza", reference: "Guerra de la Triple Alianza", intensity: "alta" },
    { year: 1989, category: "coup", text: "Fin del stronismo y reordenamiento politico", reference: "Caida de Stroessner", intensity: "alta" }
  ],
  SAU: [
    { year: 1932, category: "formation", text: "Unificacion del Reino de Arabia Saudita", reference: "Unificacion saudita", intensity: "alta" },
    { year: 1992, category: "constitucion", text: "Ley Basica de Gobierno", reference: "Ley Basica saudita", intensity: "media" }
  ],
  URY: [
    { year: 1828, category: "formation", text: "Nacimiento del Estado uruguayo independiente", reference: "Convencion Preliminar de Paz", intensity: "alta" },
    { year: 1973, category: "coup", text: "Golpe de Estado y dictadura civico-militar", reference: "Golpe de 1973 en Uruguay", intensity: "alta" },
    { year: 1985, category: "reforma", text: "Restauracion democratica", reference: "Transicion uruguaya", intensity: "alta" }
  ],
  TWN: [
    { year: 1949, category: "secession", text: "Retirada del Kuomintang a Taiwan tras la guerra civil china", reference: "Cuestion de Taiwan", intensity: "alta" },
    { year: 1971, category: "diplomacy", text: "Perdida del asiento chino en la ONU", reference: "Resolucion 2758", intensity: "alta" },
    { year: 1996, category: "conflict", text: "Crisis del estrecho de Taiwan", reference: "Tercera crisis del estrecho de Taiwan", intensity: "alta" }
  ],
  PSE: [
    { year: 1947, category: "agreement", text: "Plan de particion de Palestina", reference: "Resolucion 181", intensity: "alta" },
    { year: 1967, category: "conflict", text: "Ocupacion israeli de Cisjordania", reference: "Guerra de los Seis Dias", intensity: "alta" },
    { year: 1993, category: "agreement", text: "Acuerdos de Oslo", reference: "Acuerdos de Oslo", intensity: "alta" }
  ],
  CYP: [
    { year: 1960, category: "formation", text: "Independencia de Chipre", reference: "Independencia de Chipre", intensity: "alta" },
    { year: 1974, category: "conflict", text: "Intervencion turca y division de la isla", reference: "Invasion turca de Chipre", intensity: "alta" },
    { year: 2004, category: "bloc", text: "Ingreso de Chipre en la Union Europea", reference: "Ampliacion de la UE de 2004", intensity: "media" }
  ],
  GUF: [
    { year: 1946, category: "reform", text: "Guayana Francesa pasa a ser departamento de ultramar", reference: "Departamentalizacion francesa", intensity: "media" }
  ],
  GRL: [
    { year: 1979, category: "reform", text: "Autogobierno groenlandes", reference: "Home Rule groenlandes", intensity: "alta" },
    { year: 2009, category: "reform", text: "Ampliacion de la autonomia", reference: "Self-Government Act", intensity: "alta" }
  ],
  ATA: [
    { year: 1959, category: "treaty", text: "Firma del Tratado Antartico", reference: "Tratado Antartico", intensity: "alta" }
  ],
  "-99": [
    { year: 1991, category: "secession", text: "Somalilandia declara su separacion de Somalia", reference: "Declaracion de Somalilandia", intensity: "alta" }
  ],
  VEN: [
    { year: 1811, category: "formation", text: "Primera declaracion de independencia", reference: "Independencia de Venezuela", intensity: "alta" },
    { year: 1830, category: "secession", text: "Separacion de la Gran Colombia", reference: "Separacion de la Gran Colombia", intensity: "alta" },
    { year: 1958, category: "reforma", text: "Caida de Perez Jimenez y apertura democratica", reference: "Transicion venezolana de 1958", intensity: "alta" },
    { year: 1999, category: "constitution", text: "Nueva Constitucion bolivariana", reference: "Constitucion de 1999", intensity: "alta" }
  ],
  UKR: [
    { year: 2014, category: "annexation", text: "Anexion rusa de Crimea y guerra hibrida en Donbas", reference: "Crisis de Crimea", intensity: "alta" },
    { year: 2022, category: "conflict", text: "Invasion rusa a gran escala", reference: "Guerra ruso-ucraniana", intensity: "alta" }
  ]
});

Object.assign(EXTRA_TIMELINE_DETAIL_OVERRIDES, {
  "Acuerdo de paz con las FARC": {
    title: "Acuerdo de paz con las FARC",
    detail: "El acuerdo de 2016 abrio una nueva etapa en Colombia al reducir la guerra con la principal guerrilla del pais, aunque no cerro todas las violencias armadas.",
    significance: "hito de desescalada interna",
    intensity: "alta"
  },
  "Autogolpe de 1992": {
    title: "Autogolpe peruano de 1992",
    detail: "La disolucion del Congreso por parte de Alberto Fujimori altero profundamente el equilibrio institucional y dio paso a un nuevo orden constitucional.",
    significance: "quiebre institucional de alta intensidad",
    intensity: "alta"
  },
  "Batalla de Adwa": {
    title: "Batalla de Adwa",
    detail: "La derrota italiana en 1896 consolido a Etiopia como una de las pocas potencias africanas que preservaron su soberania frente al reparto colonial europeo.",
    significance: "victoria anticolonial decisiva",
    intensity: "alta"
  },
  "Constitucion de 1991": {
    title: "Constitucion colombiana de 1991",
    detail: "La nueva carta politica amplio derechos, reconocio diversidad etnica y reformulo la arquitectura del Estado colombiano en medio del conflicto interno.",
    significance: "refundacion constitucional",
    intensity: "alta"
  },
  "Constitucion de 1999": {
    title: "Constitucion venezolana de 1999",
    detail: "La constitucion bolivariana redefinio instituciones, amplifico la centralidad presidencial y reformulo la identidad politica del Estado venezolano.",
    significance: "refundacion constitucional y politica",
    intensity: "alta"
  },
  "Constitucion de 2009": {
    title: "Constitucion del Estado Plurinacional de Bolivia",
    detail: "El nuevo texto constitucional reconocio el caracter plurinacional del Estado, amplio autonomias y reordeno la relacion entre nacion, pueblos originarios y poder central.",
    significance: "reforma estatal profunda",
    intensity: "alta"
  },
  "Constitucion de 1982": {
    title: "Patriacion constitucional de Canada",
    detail: "La reforma de 1982 traslado plenamente la soberania constitucional a Canada e incorporo la Carta Canadiense de Derechos y Libertades.",
    significance: "autonomia constitucional plena",
    intensity: "alta"
  },
  "Marcha sobre Roma": {
    title: "Marcha sobre Roma",
    detail: "La presion fascista sobre la monarquia italiana en 1922 permitio el ascenso de Mussolini y un rapido vaciamiento del orden liberal parlamentario.",
    significance: "ascenso autoritario de gran impacto europeo",
    intensity: "alta"
  },
  "Revolucion cubana": {
    title: "Revolucion cubana",
    detail: "La victoria rebelde de 1959 puso fin al regimen de Batista e inserto a Cuba en una nueva matriz geopolitica, social y economica dentro de la Guerra fria.",
    significance: "cambio de regimen y giro geopolitico regional",
    intensity: "alta"
  },
  "Revolucion mexicana": {
    title: "Revolucion mexicana",
    detail: "El ciclo revolucionario transformo el sistema politico, las relaciones agrarias y la legitimidad del Estado mexicano contemporaneo.",
    significance: "revolucion social y politica fundacional",
    intensity: "alta"
  },
  "Unificacion saudita": {
    title: "Unificacion del Reino de Arabia Saudita",
    detail: "La consolidacion politica y militar de Ibn Saud integro diversos territorios de Arabia en un reino centralizado de base monarquica y religiosa.",
    significance: "fundacion estatal contemporanea",
    intensity: "alta"
  }
});

const COUNTRY_CURATION_OVERRIDES = {
  TWN: {
    name: "Taiwan",
    general: {
      officialName: "Republica de China (Taiwan)",
      historicalNames: ["Formosa", "Republica de China", "Taiwan"],
      languages: ["Chino mandarin", "Taiwanes hokkien", "Hakka"],
      capitals: [
        { role: "nacional", name: "Taipei", population: 2489394 }
      ],
      stateStructure: "Republica semipresidencial insular de reconocimiento limitado"
    },
    politics: {
      relations: {
        diplomaticPartners: ["Estados Unidos", "Japon", "Lituania"],
        economicPartners: ["Estados Unidos", "Japon", "Union Europea"],
        currentRivals: ["Republica Popular China"],
        disputes: ["Taiwan", "Estrecho de Taiwan"],
        disputedTerritories: ["Taiwan", "Estrecho de Taiwan"]
      }
    }
  },
  "-99": {
    general: {
      historicalNames: ["Somalilandia britanica", "Somalilandia"],
      stateStructure: "Republica no reconocida internacionalmente"
    },
    politics: {
      relations: {
        currentRivals: ["Somalia"],
        disputes: ["Sool", "Sanaag"],
        disputedTerritories: ["Sool", "Sanaag"],
        diplomaticPartners: ["Etiopia", "Emiratos Arabes Unidos"]
      }
    }
  },
  PSE: {
    name: "Cisjordania",
    general: {
      officialName: "Estado de Palestina (Cisjordania)",
      historicalNames: ["Palestina", "Cisjordania"],
      capitals: [
        { role: "reclamada", name: "Jerusalen Este", population: null },
        { role: "administrativa", name: "Ramala", population: null }
      ],
      languages: ["Arabe"]
    },
    politics: {
      relations: {
        diplomaticPartners: ["Jordania", "Egipto", "Qatar"],
        economicPartners: ["Jordania", "Israel"],
        currentRivals: ["Israel"],
        disputes: ["Cisjordania", "Jerusalen Este"],
        disputedTerritories: ["Cisjordania", "Jerusalen Este"]
      }
    }
  },
  CYP: {
    politics: {
      relations: {
        currentRivals: ["Turquia", "Chipre del Norte"],
        disputes: ["Chipre del Norte", "ZEE del Mediterraneo oriental"],
        disputedTerritories: ["Chipre del Norte", "ZEE del Mediterraneo oriental"],
        diplomaticPartners: ["Grecia", "Union Europea"],
        economicPartners: ["Grecia", "Union Europea", "Israel"]
      }
    }
  },
  GUF: {
    general: {
      officialName: "Guayana Francesa",
      historicalNames: ["Guyane francaise", "Guayana Francesa"],
      stateStructure: "Departamento y region de ultramar de Francia"
    },
    politics: {
      relations: {
        dependencies: ["Francia"],
        economicPartners: ["Francia", "Union Europea", "Brasil"],
        diplomaticPartners: ["Francia", "Brasil", "Surinam"]
      }
    }
  },
  GRL: {
    general: {
      officialName: "Groenlandia",
      stateStructure: "Territorio autonomo dentro del Reino de Dinamarca"
    },
    politics: {
      relations: {
        dependencies: ["Dinamarca"],
        economicPartners: ["Dinamarca", "Union Europea", "Estados Unidos"],
        disputes: ["Artico"],
        disputedTerritories: ["Artico"]
      }
    }
  },
  ATA: {
    name: "Antartida",
    general: {
      officialName: "Antartida",
      historicalNames: ["Continente antartico"],
      languages: ["Sin idioma oficial permanente"],
      capitals: [
        { role: "sin capital oficial", name: "Sin capital oficial", population: null }
      ],
      stateStructure: "Territorio internacional regido por el Sistema del Tratado Antartico"
    },
    politics: {
      organizations: [
        { name: "Sistema del Tratado Antartico", abbreviation: "ATS", startYear: 1959, endYear: null }
      ],
      relations: {
        diplomaticBlocs: ["Sistema del Tratado Antartico"],
        blocs: ["Sistema del Tratado Antartico"]
      }
    }
  },
  USA: {
    politics: {
      relations: {
        currentRivals: ["China", "Rusia", "Iran", "Corea del Norte"],
        militaryAllies: ["Reino Unido", "Canada", "Japon", "Corea del Sur", "Australia", "Polonia"],
        economicPartners: ["Canada", "Mexico", "Union Europea", "Japon"],
        disputes: ["Taiwan", "Mar de China Meridional"]
      }
    }
  },
  CHN: {
    politics: {
      relations: {
        currentRivals: ["Estados Unidos", "India", "Taiwan", "Japon", "Vietnam"],
        militaryAllies: ["Pakistan", "Corea del Norte"],
        economicPartners: ["Rusia", "ASEAN", "Pakistan"],
        disputes: ["Taiwan", "Mar de China Meridional", "Aksai Chin"]
      }
    }
  },
  RUS: {
    politics: {
      relations: {
        currentRivals: ["Estados Unidos", "Ucrania", "OTAN", "Polonia"],
        militaryAllies: ["Belarusia"],
        economicPartners: ["China", "Belarusia", "Kazajistan"],
        disputes: ["Crimea", "Kuriles del Sur"]
      }
    }
  },
  ISR: {
    politics: {
      relations: {
        currentRivals: ["Iran", "Hezbola", "Hamas"],
        diplomaticPartners: ["Estados Unidos", "Egipto", "Jordania"],
        disputes: ["Jerusalen Este", "Cisjordania", "Altos del Golan"]
      }
    }
  },
  IRN: {
    politics: {
      relations: {
        currentRivals: ["Estados Unidos", "Israel", "Arabia Saudi"],
        diplomaticPartners: ["Rusia", "China", "Siria"],
        disputes: ["Golfo Persico"]
      }
    }
  },
  UKR: {
    politics: {
      relations: {
        currentRivals: ["Rusia", "Belarusia"],
        diplomaticPartners: ["Estados Unidos", "Polonia", "Reino Unido", "Union Europea"],
        disputes: ["Crimea", "Donbas"]
      }
    }
  }
};

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Batalla de Midway": {
    cause: "Fue provocada por el intento japones de destruir la capacidad aeronaval estadounidense restante en el Pacifico tras Pearl Harbor.",
    type: "batalla naval",
    scope: "global",
    region: "Pacifico central",
    chronology: [
      { year: 1942, text: "Japon prepara una operacion para atraer y destruir portaaviones estadounidenses cerca de Midway." },
      { year: 1942, text: "Estados Unidos descifra planes japoneses y organiza una emboscada aeronaval." },
      { year: 1942, text: "La destruccion de portaaviones japoneses cambia el equilibrio estrategico del Pacifico." }
    ],
    related: ["Segunda Guerra Mundial", "Campaña de Guadalcanal"],
    participants: [
      { side: "Estados Unidos", members: ["Estados Unidos"], organizations: ["Aliados"], troops: "portaaviones, cruceros, destructores y aviacion embarcada", casualties: "significativas" },
      { side: "Japon", members: ["Japon"], organizations: ["Potencias del Eje"], troops: "fuerza de portaaviones y escoltas", casualties: "muy elevadas" }
    ],
    outcome: "Victoria decisiva de Estados Unidos.",
    consequences: "Detuvo la expansion japonesa y dio la iniciativa estrategica a Estados Unidos en el Pacifico."
  },
  "Campaña de Guadalcanal": {
    cause: "Los Aliados buscaron frenar la expansion japonesa y asegurar las lineas de comunicacion con Australia mediante la recuperacion de Guadalcanal.",
    type: "campaña",
    scope: "global",
    region: "Pacifico suroccidental",
    chronology: [
      { year: 1942, text: "Marines estadounidenses desembarcan en Guadalcanal y capturan el aerodromo en construccion." },
      { year: 1942, text: "Se suceden combates terrestres, navales y aereos de gran intensidad." },
      { year: 1943, text: "Japon evacua sus fuerzas y los Aliados consolidan la isla." }
    ],
    related: ["Segunda Guerra Mundial", "Batalla naval de Guadalcanal", "Batalla de Midway"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos", "Australia", "Nueva Zelanda"], organizations: ["Aliados"], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Japon", members: ["Japon"], organizations: ["Potencias del Eje"], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria aliada decisiva.",
    consequences: "Consolido la transicion ofensiva aliada en el Pacifico y debilito severamente la capacidad japonesa."
  },
  "Batalla naval de Guadalcanal": {
    cause: "Se produjo dentro de la campaña por el control de Guadalcanal y el aerodromo Henderson Field, clave para dominar la zona.",
    type: "batalla naval",
    scope: "global",
    region: "Islas Salomon",
    chronology: [
      { year: 1942, text: "Fuerzas navales japonesas intentan bombardear posiciones aliadas y reforzar la isla." },
      { year: 1942, text: "Se desarrollan varios choques nocturnos y diurnos de enorme intensidad." },
      { year: 1942, text: "La marina japonesa pierde capacidad para sostener la campaña." }
    ],
    related: ["Campaña de Guadalcanal", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos"], organizations: ["Aliados"], troops: "buques capitales, destructores y aviacion naval", casualties: "elevadas" },
      { side: "Japon", members: ["Japon"], organizations: ["Potencias del Eje"], troops: "acorazados, cruceros, destructores y aviacion naval", casualties: "muy elevadas" }
    ],
    outcome: "Victoria operativa aliada.",
    consequences: "Impidio el colapso del frente aliado en Guadalcanal y acelero el desgaste naval japones."
  },
  "Primera Batalla de El Alamein": {
    cause: "Ocurrio cuando las fuerzas del Eje intentaron romper hacia Egipto y el canal de Suez tras sus avances en Libia.",
    type: "batalla",
    scope: "global",
    region: "Norte de Africa",
    chronology: [
      { year: 1942, text: "Las fuerzas germano-italianas avanzan hacia Egipto tras la batalla de Gazala." },
      { year: 1942, text: "Los Aliados contienen el avance en El Alamein y estabilizan el frente." }
    ],
    related: ["Segunda Guerra Mundial", "Batalla de Gazala", "Segunda batalla de El Alamein"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Australia", "Nueva Zelanda", "Sudafrica", "India"], organizations: ["Aliados"], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Eje", members: ["Alemania", "Italia"], organizations: ["Potencias del Eje"], troops: "centenares de miles", casualties: "elevadas" }
    ],
    outcome: "Detencion del avance del Eje.",
    consequences: "Evito la caida de Egipto y preparo la futura contraofensiva aliada."
  },
  "Segunda batalla de El Alamein": {
    cause: "Los Aliados lanzaron una gran ofensiva para romper el frente del Eje y recuperar la iniciativa en el norte de Africa.",
    type: "batalla",
    scope: "global",
    region: "Norte de Africa",
    chronology: [
      { year: 1942, text: "Montgomery prepara una ofensiva masiva contra las lineas del Eje en El Alamein." },
      { year: 1942, text: "La superioridad material aliada rompe el frente y fuerza el repliegue del Eje." }
    ],
    related: ["Segunda Guerra Mundial", "Primera Batalla de El Alamein"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Australia", "Nueva Zelanda", "Sudafrica", "India"], organizations: ["Aliados"], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Eje", members: ["Alemania", "Italia"], organizations: ["Potencias del Eje"], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria decisiva aliada.",
    consequences: "Marco el giro irreversible de la campaña del norte de Africa a favor de los Aliados."
  },
  "Batalla de Gazala": {
    cause: "Fue parte de la ofensiva del Eje para destruir las posiciones britanicas en Libia y abrir la ruta hacia Egipto.",
    type: "batalla",
    scope: "global",
    region: "Norte de Africa",
    chronology: [
      { year: 1942, text: "Rommel lanza maniobras envolventes sobre la linea de Gazala." },
      { year: 1942, text: "Las defensas britanicas colapsan y Tobruk cae poco despues." }
    ],
    related: ["Segunda Guerra Mundial", "Primera Batalla de El Alamein"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Sudafrica", "India"], organizations: ["Aliados"], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Eje", members: ["Alemania", "Italia"], organizations: ["Potencias del Eje"], troops: "centenares de miles", casualties: "significativas" }
    ],
    outcome: "Victoria del Eje.",
    consequences: "Permitio el avance hacia Egipto y condujo al enfrentamiento en El Alamein."
  },
  "Ofensiva del Tet": {
    cause: "Vietnam del Norte y el Viet Cong la lanzaron para quebrar la voluntad politica estadounidense y provocar una insurreccion general en Vietnam del Sur.",
    type: "ofensiva",
    scope: "regional",
    region: "Vietnam del Sur",
    chronology: [
      { year: 1968, text: "Fuerzas comunistas atacan simultaneamente ciudades y bases en todo Vietnam del Sur." },
      { year: 1968, text: "Los Aliados recuperan el control militar, pero el impacto politico es enorme." }
    ],
    related: ["Guerra de Vietnam", "Sitio de Khe Sanh"],
    participants: [
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Vietnam del Sur y aliados", members: ["Vietnam del Sur", "Estados Unidos"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Fracaso tactico comunista pero victoria politica-psicologica estrategica.",
    consequences: "Acelero el cambio de opinion en Estados Unidos y la revision de su estrategia en Vietnam."
  },
  "Sitio de Khe Sanh": {
    cause: "Busco fijar fuerzas estadounidenses cerca de la frontera laosiana y presionar una posicion clave durante la fase de Tet.",
    type: "sitio",
    scope: "regional",
    region: "Vietnam del Sur",
    chronology: [
      { year: 1968, text: "Fuerzas norvietnamitas cercan la base de Khe Sanh." },
      { year: 1968, text: "Estados Unidos sostiene la posicion con artilleria y poder aereo masivo." },
      { year: 1968, text: "El sitio se levanta sin la derrota aliada esperada por Hanoi." }
    ],
    related: ["Guerra de Vietnam", "Ofensiva del Tet"],
    participants: [
      { side: "Estados Unidos y Vietnam del Sur", members: ["Estados Unidos", "Vietnam del Sur"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Vietnam del Norte", members: ["Vietnam del Norte"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "La base resiste, aunque el valor estrategico posterior fue discutido.",
    consequences: "Se convirtio en simbolo del desgaste de la guerra y del uso extremo del poder aereo estadounidense."
  },
  "Guerras arabe-israelies": {
    cause: "Agrupan los principales choques entre Israel y estados arabes derivados de la particion de Palestina, la cuestion de los refugiados y las disputas territoriales y politicas regionales.",
    type: "serie de guerras",
    scope: "regional",
    region: "Oriente Medio",
    chronology: [
      { year: 1948, text: "Primera guerra arabe-israeli tras la proclamacion de Israel." },
      { year: 1956, text: "Crisis de Suez y nueva guerra regional." },
      { year: 1967, text: "Guerra de los Seis Dias y amplia expansion territorial israeli." },
      { year: 1973, text: "Guerra del Yom Kippur y posterior giro diplomatico." }
    ],
    related: ["Guerra de independencia de Israel", "Guerra de los Seis Dias", "Guerra del Yom Kippur"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "movilizaciones masivas segun guerra", casualties: "muy elevadas" },
      { side: "Coaliciones arabes", members: ["Egipto", "Siria", "Jordania", "Irak y otros"], organizations: ["Liga Arabe"], troops: "movilizaciones masivas segun guerra", casualties: "muy elevadas" }
    ],
    outcome: "Serie de guerras con victorias militares israelies y cambios diplomaticos posteriores.",
    consequences: "Moldearon la geopolitica de Oriente Medio y el conflicto israelo-palestino hasta el presente."
  },
  "Conflicto de Darfur": {
    cause: "Surgio por la marginacion politica y economica de Darfur, disputas por tierra y agua y la respuesta violenta del gobierno sudanes y milicias aliadas.",
    type: "conflicto interno",
    scope: "regional",
    region: "Sudan occidental",
    chronology: [
      { year: 2003, text: "Grupos rebeldes se alzan contra el gobierno de Sudan." },
      { year: 2004, text: "Se multiplican atrocidades y desplazamientos masivos con milicias yanyauid." },
      { year: 2023, text: "La violencia en Darfur se reinserta en la nueva guerra civil sudanesa." }
    ],
    related: ["Segunda guerra civil sudanesa", "Guerra civil sursudanesa"],
    participants: [
      { side: "Gobierno sudanes y milicias aliadas", members: ["Sudan", "milicias yanyauid y sucesoras"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Movimientos rebeldes de Darfur", members: ["SLA", "JEM y otras facciones"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto prolongado y fragmentado sin solucion definitiva.",
    consequences: "Provoco catastrofe humanitaria, acusaciones de genocidio y una prolongada inestabilidad regional."
  },
  "Guerra civil etiope": {
    cause: "Se desencadeno por la ruptura entre el gobierno federal etiope y las autoridades de Tigray en un contexto de tensiones etnofederales y lucha por el poder.",
    type: "conflicto interno",
    scope: "regional",
    region: "Cuerno de Africa",
    chronology: [
      { year: 2020, text: "Estalla la guerra entre el gobierno etiope y el TPLF en Tigray." },
      { year: 2021, text: "La guerra se expande y crecen las denuncias de atrocidades y hambre." },
      { year: 2022, text: "Un acuerdo de paz reduce la intensidad del conflicto principal." }
    ],
    related: ["Guerra entre Etiopia y Eritrea", "Conflicto fronterizo etiope-somali"],
    participants: [
      { side: "Gobierno etiope y aliados", members: ["Etiopia", "Eritrea", "milicias regionales aliadas"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "TPLF y fuerzas asociadas", members: ["TPLF", "fuerzas de Tigray"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Acuerdo de paz parcial con persistencia de tensiones.",
    consequences: "Dejo una profunda crisis humanitaria y reabrio debates sobre el modelo estatal etiope."
  },
  "Conflicto fronterizo etiope-somali": {
    cause: "Se enmarca en disputas fronterizas historicas, insurgencias transfronterizas y rivalidad por el control del Ogaden.",
    type: "conflicto fronterizo",
    scope: "regional",
    region: "Cuerno de Africa",
    chronology: [
      { year: 1964, text: "Primeras hostilidades abiertas entre Etiopia y Somalia independientes." },
      { year: 1977, text: "La disputa se amplifica con la Guerra del Ogaden." },
      { year: 2007, text: "Persisten episodios ligados a insurgencias islamistas y seguridad fronteriza." }
    ],
    related: ["Guerra del Ogaden", "Guerra civil somali"],
    participants: [
      { side: "Etiopia", members: ["Etiopia"], organizations: [], troops: "decenas de miles", casualties: "variables" },
      { side: "Somalia y actores vinculados", members: ["Somalia", "milicias e insurgencias segun etapa"], organizations: [], troops: "variables", casualties: "variables" }
    ],
    outcome: "Frontera historicamente inestable sin resolucion completa.",
    consequences: "Alimento militarizacion, desplazamientos y rivalidad duradera en el Cuerno de Africa."
  },
  "Guerra del Sahara Occidental": {
    cause: "Surgio por la disputa sobre la descolonizacion del Sahara Occidental y el control del territorio tras la retirada española.",
    type: "guerra de descolonizacion",
    scope: "regional",
    region: "Magreb occidental",
    chronology: [
      { year: 1975, text: "La Marcha Verde y la retirada española abren la pugna por el territorio." },
      { year: 1976, text: "El Frente Polisario proclama la RASD y continua la guerra contra Marruecos y Mauritania." },
      { year: 1991, text: "Se establece un alto el fuego bajo auspicio de la ONU." }
    ],
    related: ["Conflicto del Sahara Occidental", "Enfrentamientos del Sahara Occidental (2020-presente)"],
    participants: [
      { side: "Marruecos", members: ["Marruecos"], organizations: [], troops: "decenas de miles", casualties: "significativas" },
      { side: "Frente Polisario", members: ["Frente Polisario", "RASD"], organizations: [], troops: "miles", casualties: "significativas" }
    ],
    outcome: "Alto el fuego prolongado sin solucion definitiva del estatus territorial.",
    consequences: "Congelo uno de los principales conflictos de descolonizacion no resueltos del mundo."
  },
  "Guerra civil sursudanesa": {
    cause: "Estallo por la ruptura entre las elites gobernantes de Sudán del Sur, tensiones etnopoliticas y lucha por el control del nuevo estado.",
    type: "conflicto interno",
    scope: "regional",
    region: "Africa oriental",
    chronology: [
      { year: 2013, text: "La pugna entre Salva Kiir y Riek Machar desencadena combates en Juba." },
      { year: 2014, text: "El conflicto se extiende con masacres, hambruna y desplazamientos masivos." },
      { year: 2018, text: "Se firma un acuerdo de paz que reduce parcialmente la intensidad de la guerra." }
    ],
    related: ["Segunda guerra civil sudanesa"],
    participants: [
      { side: "Gobierno de Sudan del Sur", members: ["Sudan del Sur", "fuerzas leales a Salva Kiir"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Oposicion armada", members: ["SPLA-IO", "fuerzas leales a Riek Machar"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Acuerdo de paz incompleto con violencia residual.",
    consequences: "Provoco una enorme crisis humanitaria y debilito gravemente al estado mas joven del mundo."
  },
  "Segunda guerra civil sudanesa": {
    cause: "Se debio a la imposicion de centralizacion e islamizacion desde Jartum, sumadas a disputas por autonomia, identidad y recursos en el sur de Sudan.",
    type: "conflicto interno",
    scope: "regional",
    region: "Sudan",
    chronology: [
      { year: 1983, text: "Rebeldes del SPLA se levantan contra el gobierno de Sudan." },
      { year: 1990, text: "La guerra se prolonga con desplazamientos y hambrunas de gran escala." },
      { year: 2005, text: "El Acuerdo General de Paz pone fin a la guerra y abre la via a la independencia de Sudan del Sur." }
    ],
    related: ["Guerra civil sursudanesa", "Conflicto de Darfur"],
    participants: [
      { side: "Gobierno de Sudan", members: ["Sudan"], organizations: [], troops: "centenares de miles", casualties: "extremadamente elevadas" },
      { side: "SPLA y aliados", members: ["SPLA", "movimientos sureños"], organizations: [], troops: "decenas de miles", casualties: "extremadamente elevadas" }
    ],
    outcome: "Acuerdo de paz con reconocimiento de autonomia sureña y posterior secesion.",
    consequences: "Preparo el nacimiento de Sudan del Sur pero dejo conflictos sin resolver que alimentaron nuevas guerras."
  },
  "Segunda guerra del Congo": {
    cause: "Se desato por la fragilidad del estado congoleño, la intervencion de paises vecinos y la pugna por seguridad, influencia y recursos en el este del Congo.",
    type: "guerra regional",
    scope: "regional",
    region: "Africa central",
    chronology: [
      { year: 1998, text: "Estalla la guerra con intervenciones de multiples estados africanos y grupos rebeldes." },
      { year: 2001, text: "El conflicto se fragmenta en frentes regionales y milicias locales." },
      { year: 2003, text: "Acuerdos formales de paz no impiden la continuidad de violencia en Kivu e Ituri." }
    ],
    related: ["Primera Guerra del Congo", "Guerra de Kivu", "Conflicto entre la República Democrática del Congo y Ruanda"],
    participants: [
      { side: "Gobierno congoleño y aliados", members: ["Republica Democratica del Congo", "Angola", "Namibia", "Zimbabue"], organizations: [], troops: "centenares de miles", casualties: "extremadamente elevadas" },
      { side: "Rebeldes y estados patrocinadores", members: ["Ruanda", "Uganda", "Burundi", "grupos rebeldes congoleños"], organizations: [], troops: "centenares de miles", casualties: "extremadamente elevadas" }
    ],
    outcome: "Acuerdos incompletos con persistencia de violencia en el este.",
    consequences: "Fue una de las guerras mas letales desde 1945 y dejo una inestabilidad cronica en el este congoleño."
  },
  "Incursion de abril de 2009 frente a Somalia": {
    cause: "Se produjo en el contexto de operaciones antipirateria frente a Somalia para rescatar rehenes y proteger la navegacion internacional.",
    type: "incidente naval",
    scope: "regional",
    region: "Cuerno de Africa",
    chronology: [
      { year: 2009, text: "Piratas somalies capturan un buque mercante estadounidense y toman rehenes." },
      { year: 2009, text: "Fuerzas estadounidenses realizan una operacion de rescate y neutralizan a los captores." }
    ],
    related: ["Guerra civil somali", "Medidas antipirateria en Somalia"],
    participants: [
      { side: "Estados Unidos", members: ["Estados Unidos"], organizations: [], troops: "fuerzas navales y tiradores de precision", casualties: "minimas" },
      { side: "Piratas somalies", members: ["piratas somalies"], organizations: [], troops: "pequeño grupo armado", casualties: "altas para el grupo" }
    ],
    outcome: "Rescate exitoso del rehen principal por fuerzas estadounidenses.",
    consequences: "Reforzo la cooperacion internacional contra la pirateria en el Indico occidental."
  },
  "Operación Barbarroja": {
    cause: "Alemania lanzo la invasion de la Union Sovietica para destruir al principal rival continental, capturar recursos y forzar un colapso politico-militar rapido.",
    type: "invasion",
    scope: "global",
    region: "Europa oriental",
    chronology: [
      { year: 1941, text: "La Wehrmacht invade la Union Sovietica a lo largo de un frente gigantesco." },
      { year: 1941, text: "Los avances iniciales alemanes cercan grandes fuerzas sovieticas pero no logran una decision final." },
      { year: 1941, text: "El fracaso ante Moscu marca el comienzo del desgaste estrategico aleman." }
    ],
    related: ["Segunda Guerra Mundial", "Frente Oriental de la Segunda Guerra Mundial"],
    participants: [
      { side: "Alemania y aliados del Eje", members: ["Alemania nazi", "Rumania", "Finlandia", "Hungria e Italia en fases posteriores"], organizations: ["Potencias del Eje"], troops: "millones", casualties: "extremadamente elevadas" },
      { side: "Union Sovietica", members: ["Union Sovietica"], organizations: ["Aliados"], troops: "millones", casualties: "extremadamente elevadas" }
    ],
    outcome: "Avance inicial del Eje seguido por estancamiento y fracaso estrategico.",
    consequences: "Abrió el frente terrestre decisivo de la guerra y condujo al desgaste irreversible de Alemania."
  },
  "Ataque a Pearl Harbor": {
    cause: "Japon ataco para neutralizar la flota estadounidense del Pacifico y asegurar margen de maniobra en su expansion por Asia y el Pacifico.",
    type: "ataque sorpresa",
    scope: "global",
    region: "Pacifico",
    chronology: [
      { year: 1941, text: "La aviacion japonesa lanza un ataque sorpresa contra la base naval de Pearl Harbor." },
      { year: 1941, text: "Estados Unidos entra plenamente en la Segunda Guerra Mundial." }
    ],
    related: ["Segunda Guerra Mundial", "Batalla de Midway"],
    participants: [
      { side: "Japon", members: ["Japon"], organizations: ["Potencias del Eje"], troops: "portaaviones, escoltas y aviacion embarcada", casualties: "moderadas" },
      { side: "Estados Unidos", members: ["Estados Unidos"], organizations: ["Aliados"], troops: "flota del Pacifico y aviacion en tierra", casualties: "muy elevadas en material y personal" }
    ],
    outcome: "Victoria tactica japonesa con fracaso estrategico de largo plazo.",
    consequences: "Provoco la entrada de Estados Unidos en la guerra y transformo el equilibrio global del conflicto."
  },
  "Campaña del Adriatico en la Segunda Guerra Mundial": {
    cause: "Se desarrollo por la pugna entre Aliados y Eje por las rutas maritimas, puertos y costas del Adriatico.",
    type: "campaña",
    scope: "global",
    region: "Adriatico",
    chronology: [
      { year: 1940, text: "El Adriatico se vuelve escenario de operaciones navales y anfibias vinculadas a los Balcanes." },
      { year: 1943, text: "La rendicion italiana reconfigura el control de puertos y costas." },
      { year: 1945, text: "Las operaciones finales consolidan la derrota del Eje en la region." }
    ],
    related: ["Segunda Guerra Mundial", "Frente del Sudeste de Asia en la Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Estados Unidos", "partisanos yugoslavos y aliados regionales"], organizations: ["Aliados"], troops: "fuerzas navales, aereas y terrestres variables", casualties: "significativas" },
      { side: "Eje", members: ["Italia", "Alemania"], organizations: ["Potencias del Eje"], troops: "fuerzas navales, guarniciones y aviacion", casualties: "significativas" }
    ],
    outcome: "Predominio aliado progresivo.",
    consequences: "Debilito el control del Eje en los Balcanes y aseguro rutas maritimas regionales para los Aliados."
  },
  "Ocupacion alemana de Luxemburgo en la Segunda Guerra Mundial": {
    cause: "Formo parte de la expansion alemana sobre Europa occidental tras la ofensiva de 1940.",
    type: "ocupacion",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1940, text: "Alemania invade y ocupa Luxemburgo durante la ofensiva sobre Belgica y Francia." },
      { year: 1942, text: "La ocupacion se endurece con anexiones de facto y represion." },
      { year: 1944, text: "El avance aliado conduce a la liberacion del pais." }
    ],
    related: ["Segunda Guerra Mundial", "Desembarco de Normandía"],
    participants: [
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "fuerzas de ocupacion variables", casualties: "variables" },
      { side: "Luxemburgo y Aliados", members: ["Luxemburgo", "Aliados occidentales"], organizations: ["Aliados"], troops: "resistencia y fuerzas aliadas", casualties: "variables" }
    ],
    outcome: "Ocupacion alemana seguida por liberacion aliada.",
    consequences: "Genero represion, resistencia y reconfiguro la posicion luxemburguesa en la posguerra europea."
  },
  "Operaciones aerotransportadas americanas en Normandia": {
    cause: "Fueron planeadas para asegurar flancos, puentes y rutas clave antes y durante el desembarco aliado en Normandia.",
    type: "operacion aerotransportada",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1944, text: "Paracaidistas estadounidenses saltan sobre Normandia en la noche previa al Dia D." },
      { year: 1944, text: "Se combaten posiciones alemanas y se consolidan objetivos clave para apoyar el desembarco." }
    ],
    related: ["Desembarco de Normandía", "Batalla de Normandía", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos"], organizations: ["Aliados"], troops: "divisiones aerotransportadas", casualties: "elevadas" },
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "guarniciones y reservas", casualties: "significativas" }
    ],
    outcome: "Exito operativo aliado suficiente para sostener el desembarco.",
    consequences: "Facilito la consolidacion de la cabeza de playa aliada en Normandia."
  },
  "Batalla de Caen": {
    cause: "Formo parte de la campaña de Normandia por el control de una ciudad clave para romper el frente aleman.",
    type: "batalla",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1944, text: "Fuerzas britanicas y canadienses intentan tomar Caen poco despues del Dia D." },
      { year: 1944, text: "La resistencia alemana prolonga la lucha urbana y de desgaste." },
      { year: 1944, text: "La ciudad cae tras intensos combates y bombardeos." }
    ],
    related: ["Desembarco de Normandía", "Batalla de Normandía", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Canada"], organizations: ["Aliados"], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada costosa.",
    consequences: "Debilito fuerzas blindadas alemanas y contribuyo a la ruptura posterior del frente en Normandia."
  },
  "Batalla de Brest": {
    cause: "Los Aliados buscaron asegurar el puerto de Brest tras la ruptura de Normandia para mejorar su logistica en Europa occidental.",
    type: "batalla",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1944, text: "Fuerzas estadounidenses cercan la fortaleza portuaria de Brest." },
      { year: 1944, text: "La guarnicion alemana resiste hasta la caida final de la ciudad." }
    ],
    related: ["Batalla de Normandía", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos"], organizations: ["Aliados"], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "guarnicion fortificada", casualties: "muy elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "El puerto resulto muy dañado, limitando su utilidad inmediata pese a la victoria."
  },
  "Batalla de Montecassino": {
    cause: "Los Aliados intentaron romper la linea Gustav y abrir el camino hacia Roma en la campaña de Italia.",
    type: "batalla",
    scope: "global",
    region: "Italia",
    chronology: [
      { year: 1944, text: "Se lanzan varias ofensivas aliadas contra posiciones alemanas en torno a Montecassino." },
      { year: 1944, text: "Tras combates muy duros y bombardeos, las defensas alemanas ceden." }
    ],
    related: ["Segunda Guerra Mundial", "Campaña de Italia"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Estados Unidos", "Polonia", "India", "Nueva Zelanda y otros"], organizations: ["Aliados"], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Abrió la ruta a Roma y simbolizo la dureza de la campaña italiana."
  },
  "Batalla de Guam": {
    cause: "Los Aliados buscaron recuperar Guam para reforzar su avance por el Pacifico y obtener bases estrategicas contra Japon.",
    type: "batalla",
    scope: "global",
    region: "Pacifico",
    chronology: [
      { year: 1944, text: "Fuerzas estadounidenses desembarcan en Guam para recuperar la isla." },
      { year: 1944, text: "La resistencia japonesa colapsa tras intensos combates terrestres." }
    ],
    related: ["Segunda Guerra Mundial", "Campaña de las Marianas"],
    participants: [
      { side: "Estados Unidos", members: ["Estados Unidos"], organizations: ["Aliados"], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Japon", members: ["Japon"], organizations: ["Potencias del Eje"], troops: "guarnicion importante", casualties: "muy elevadas" }
    ],
    outcome: "Victoria estadounidense.",
    consequences: "Permitio establecer bases aereas clave para la ofensiva final contra Japon."
  },
  "Batalla de Labuan": {
    cause: "Formo parte de la campaña de Borneo y busco asegurar puertos y aerodromos utiles para los Aliados en el sudeste asiatico.",
    type: "batalla",
    scope: "global",
    region: "Borneo",
    chronology: [
      { year: 1945, text: "Fuerzas australianas desembarcan en Labuan." },
      { year: 1945, text: "Las posiciones japonesas son superadas tras combates intensos." }
    ],
    related: ["Campaña de Borneo", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Australia"], organizations: ["Aliados"], troops: "miles", casualties: "moderadas" },
      { side: "Japon", members: ["Japon"], organizations: ["Potencias del Eje"], troops: "guarnicion local", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Aseguro una posicion operativa importante para la liberacion del norte de Borneo."
  },
  "Batalla de Bologna": {
    cause: "Se produjo en la ofensiva final aliada en Italia para romper las ultimas defensas alemanas en el valle del Po.",
    type: "batalla",
    scope: "global",
    region: "Italia",
    chronology: [
      { year: 1945, text: "Los Aliados lanzan su ofensiva final en Italia septentrional." },
      { year: 1945, text: "Bolonia cae y el frente aleman en Italia se derrumba." }
    ],
    related: ["Segunda Guerra Mundial", "Campaña de Italia"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos", "Reino Unido", "Polonia y otros"], organizations: ["Aliados"], troops: "decenas de miles", casualties: "significativas" },
      { side: "Alemania y RSI", members: ["Alemania nazi", "Republica Social Italiana"], organizations: ["Potencias del Eje"], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Acelero el colapso del frente italiano del Eje."
  },
  "Batalla de Durazzo": {
    cause: "Formo parte de la campaña de los Balcanes y de la pugna por puertos y puntos de acceso estrategicos en el Adriatico.",
    type: "batalla",
    scope: "global",
    region: "Balcanes",
    chronology: [
      { year: 1943, text: "Las operaciones en torno a Durazzo reflejan la volatilidad del frente adriatico." },
      { year: 1944, text: "Los Aliados y fuerzas locales erosionan el control del Eje en la zona." }
    ],
    related: ["Campaña del Adriatico en la Segunda Guerra Mundial", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados y partisanos", members: ["partisanos yugoslavos", "fuerzas aliadas"], organizations: ["Aliados"], troops: "variables", casualties: "significativas" },
      { side: "Eje", members: ["Alemania", "Italia segun fase"], organizations: ["Potencias del Eje"], troops: "variables", casualties: "significativas" }
    ],
    outcome: "Retroceso progresivo del Eje en la zona.",
    consequences: "Debilito la posicion del Eje sobre la costa adriatica."
  },
  "Batalla de Authion": {
    cause: "Fue una de las operaciones finales aliadas para desalojar posiciones alemanas en los Alpes y asegurar la frontera franco-italiana.",
    type: "batalla",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1945, text: "Fuerzas francesas atacan fortificaciones alemanas en el macizo de Authion." },
      { year: 1945, text: "La caida de las posiciones acelera el final de la guerra en la region." }
    ],
    related: ["Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Francia"], organizations: ["Aliados"], troops: "miles", casualties: "moderadas" },
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "guarniciones alpinas", casualties: "significativas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Contribuyo al colapso final de las defensas alemanas en el sudeste de Francia."
  },
  "Batalla de Damasco (1941)": {
    cause: "Formo parte de la campaña de Siria-Libano para impedir que territorios bajo control de Vichy sirvieran al esfuerzo del Eje.",
    type: "batalla",
    scope: "global",
    region: "Levante",
    chronology: [
      { year: 1941, text: "Fuerzas britanicas, australianas y de la Francia Libre avanzan sobre Damasco." },
      { year: 1941, text: "Las fuerzas de Vichy ceden y la ciudad queda en manos aliadas." }
    ],
    related: ["Segunda Guerra Mundial", "Campaña de Siria-Libano"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Australia", "Francia Libre"], organizations: ["Aliados"], troops: "decenas de miles", casualties: "significativas" },
      { side: "Francia de Vichy", members: ["Francia de Vichy"], organizations: ["Eje o asociados"], troops: "decenas de miles", casualties: "significativas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Aseguro el Levante para los Aliados y redujo el riesgo de influencia del Eje en la region."
  },
  "Batalla de Garfagnana": {
    cause: "Fue una contraofensiva local del Eje en la campaña italiana destinada a recuperar iniciativa en el frente alpino-apeninico.",
    type: "batalla",
    scope: "global",
    region: "Italia",
    chronology: [
      { year: 1944, text: "Fuerzas alemanas y de la RSI lanzan una contraofensiva en Garfagnana." },
      { year: 1945, text: "El efecto operacional es limitado y no altera el desenlace general de la campaña." }
    ],
    related: ["Segunda Guerra Mundial", "Campaña de Italia"],
    participants: [
      { side: "Eje", members: ["Alemania nazi", "Republica Social Italiana"], organizations: ["Potencias del Eje"], troops: "miles", casualties: "moderadas" },
      { side: "Aliados", members: ["Estados Unidos", "Brasil y aliados"], organizations: ["Aliados"], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Exito tactico limitado del Eje.",
    consequences: "No revirtio la superioridad aliada en Italia y solo retraso localmente su avance."
  },
  "Batalla de Giarabub": {
    cause: "Se produjo durante la campaña del norte de Africa por el control de oasis y posiciones avanzadas entre Libia y Egipto.",
    type: "batalla",
    scope: "global",
    region: "Norte de Africa",
    chronology: [
      { year: 1941, text: "Fuerzas australianas asedian la guarnicion italiana de Giarabub." },
      { year: 1941, text: "La posicion cae tras semanas de combate." }
    ],
    related: ["Segunda Guerra Mundial", "Campaña del norte de Africa"],
    participants: [
      { side: "Aliados", members: ["Australia"], organizations: ["Aliados"], troops: "miles", casualties: "moderadas" },
      { side: "Italia", members: ["Italia"], organizations: ["Potencias del Eje"], troops: "guarnicion fortificada", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Elimino una posicion avanzada del Eje y mejoro la situacion aliada en la frontera egipcio-libia."
  },
  "Batalla de Kolombangara": {
    cause: "Formo parte de la lucha por las Islas Salomon y el control de rutas maritimas en torno a Guadalcanal y Nueva Georgia.",
    type: "batalla",
    scope: "global",
    region: "Pacifico suroccidental",
    chronology: [
      { year: 1943, text: "Flotas aliadas y japonesas chocan cerca de Kolombangara." },
      { year: 1943, text: "El combate refleja el alto costo tactico de las operaciones nocturnas en las Salomon." }
    ],
    related: ["Segunda Guerra Mundial", "Campaña de Guadalcanal"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos", "Nueva Zelanda"], organizations: ["Aliados"], troops: "cruceros y destructores", casualties: "elevadas" },
      { side: "Japon", members: ["Japon"], organizations: ["Potencias del Eje"], troops: "cruceros y destructores", casualties: "significativas" }
    ],
    outcome: "Resultado tactico favorable a Japon, sin cambiar la tendencia estrategica general.",
    consequences: "Mostro la persistente capacidad japonesa en combates navales nocturnos pese al avance aliado."
  },
  "Batalla de Shenkursk": {
    cause: "Fue parte de la intervencion aliada en la guerra civil rusa y de los intentos de hostigar posiciones bolcheviques en el norte de Rusia.",
    type: "batalla",
    scope: "regional",
    region: "Europa del Norte",
    chronology: [
      { year: 1919, text: "Fuerzas rojas atacan posiciones sostenidas por tropas antibolcheviques y aliadas cerca de Shenkursk." },
      { year: 1919, text: "La retirada aliada muestra la fragilidad de la intervencion en el norte ruso." }
    ],
    related: ["Guerra civil rusa", "Intervencion aliada en la guerra civil rusa"],
    participants: [
      { side: "Ejercito Rojo", members: ["Rusia sovietica"], organizations: [], troops: "miles", casualties: "significativas" },
      { side: "Fuerzas blancas y aliadas", members: ["fuerzas antibolcheviques", "Estados Unidos", "Reino Unido y otros"], organizations: [], troops: "miles", casualties: "significativas" }
    ],
    outcome: "Victoria del Ejercito Rojo.",
    consequences: "Acentuo el fracaso de la intervencion aliada en el norte de Rusia."
  }
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Adriatic Campaign de World War II": {
    cause: "Se desarrollo por la pugna entre Aliados y Eje por las rutas maritimas, puertos y costas del Adriatico durante la guerra en los Balcanes e Italia.",
    type: "campaña",
    scope: "global",
    region: "Adriatico",
    chronology: [
      { year: 1940, text: "El Adriatico se convierte en un escenario clave para operaciones navales y anfibias ligadas a Italia y los Balcanes." },
      { year: 1943, text: "La rendicion italiana modifica el equilibrio naval y costero de la region." },
      { year: 1945, text: "Las operaciones aliadas consolidan el derrumbe final del Eje en el Adriatico." }
    ],
    related: ["Campaña del Adriatico en la Segunda Guerra Mundial", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Estados Unidos", "partisanos yugoslavos y aliados regionales"], organizations: ["Aliados"], troops: "fuerzas navales, aereas y terrestres variables", casualties: "significativas" },
      { side: "Eje", members: ["Italia", "Alemania"], organizations: ["Potencias del Eje"], troops: "fuerzas navales, guarniciones y aviacion", casualties: "significativas" }
    ],
    outcome: "Predominio aliado progresivo.",
    consequences: "Debilito el control del Eje sobre las rutas del Adriatico y apoyo el colapso final de sus posiciones en Italia y los Balcanes."
  },
  "German occupation de Luxembourg en World War II": {
    cause: "Formo parte de la expansion alemana sobre Europa occidental durante la ofensiva de 1940 y la subordinacion de pequeños estados vecinos.",
    type: "ocupacion",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1940, text: "Alemania invade y ocupa Luxemburgo en la ofensiva sobre Belgica y Francia." },
      { year: 1942, text: "La ocupacion se endurece con germanizacion y represion de la resistencia." },
      { year: 1944, text: "Las fuerzas aliadas liberan el territorio luxemburgues." }
    ],
    related: ["Ocupacion alemana de Luxemburgo en la Segunda Guerra Mundial", "Segunda Guerra Mundial"],
    participants: [
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "fuerzas de ocupacion variables", casualties: "variables" },
      { side: "Luxemburgo y Aliados", members: ["Luxemburgo", "Aliados occidentales"], organizations: ["Aliados"], troops: "resistencia y fuerzas aliadas", casualties: "variables" }
    ],
    outcome: "Ocupacion alemana seguida por liberacion aliada.",
    consequences: "Generó represion, resistencia y una reinsercion de Luxemburgo en la posguerra occidental."
  },
  "Operaciones aerotransportadas americanas en Normandía": {
    cause: "Fueron planificadas para asegurar puentes, cruces y flancos antes y durante el desembarco aliado en Normandia.",
    type: "operacion aerotransportada",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1944, text: "Paracaidistas estadounidenses saltan sobre Normandia en la noche previa al Dia D." },
      { year: 1944, text: "Las unidades aseguran rutas y desorganizan la respuesta alemana en apoyo del desembarco." }
    ],
    related: ["Desembarco de Normandía", "Batalla de Normandía", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos"], organizations: ["Aliados"], troops: "divisiones aerotransportadas", casualties: "elevadas" },
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "guarniciones y reservas", casualties: "significativas" }
    ],
    outcome: "Exito operativo aliado suficiente para sostener la invasion.",
    consequences: "Facilito la consolidacion de la cabeza de playa aliada en Normandia y acelero la ruptura del frente occidental."
  },
  "Bombardeo de Colonia en la Segunda Guerra Mundial": {
    cause: "Formo parte de la campaña aerea aliada para degradar la industria, la infraestructura y la moral urbana de Alemania.",
    type: "bombardeo estrategico",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1942, text: "La RAF ejecuta uno de los primeros bombardeos de mil aviones contra Colonia." },
      { year: 1942, text: "El ataque causa destruccion extensa y marca una escalada en la guerra aerea sobre ciudades alemanas." }
    ],
    related: ["Segunda Guerra Mundial", "Bombardeo estrategico de Alemania"],
    participants: [
      { side: "Aliados", members: ["Reino Unido"], organizations: ["Aliados"], troops: "gran fuerza de bombarderos", casualties: "moderadas" },
      { side: "Alemania", members: ["Alemania nazi"], organizations: ["Potencias del Eje"], troops: "defensa antiaerea y poblacion civil expuesta", casualties: "elevadas" }
    ],
    outcome: "Exito operativo aliado en terminos destructivos.",
    consequences: "Acentuo la devastacion urbana alemana y la escalada de la guerra aerea de area."
  },
  "Guerras de Indochina": {
    cause: "Agrupan la secuencia de guerras de descolonizacion, guerra fria y rivalidad regional que transformaron Vietnam, Laos y Camboya durante gran parte del siglo XX.",
    type: "serie de guerras",
    scope: "regional",
    region: "Indochina",
    chronology: [
      { year: 1946, text: "Comienza la Primera Guerra de Indochina contra la presencia colonial francesa." },
      { year: 1955, text: "La division de Vietnam conduce a una nueva fase de guerra en el marco de la Guerra fria." },
      { year: 1978, text: "La Tercera Guerra de Indochina reordena la region con la guerra camboyano-vietnamita y el choque sino-vietnamita." }
    ],
    related: ["Guerra de Vietnam", "Tercera Guerra de Indochina", "Guerra camboyano-vietnamita", "Guerra sino-vietnamita"],
    participants: [
      { side: "Estados y movimientos de Indochina", members: ["Vietnam", "Laos", "Camboya", "movimientos revolucionarios regionales"], organizations: [], troops: "movilizaciones de gran escala segun fase", casualties: "muy elevadas" },
      { side: "Potencias externas y aliados", members: ["Francia", "Estados Unidos", "China", "Union Sovietica y aliados segun fase"], organizations: [], troops: "intervencion variable segun guerra", casualties: "muy elevadas" }
    ],
    outcome: "Serie de guerras con descolonizacion, reunificacion vietnamita y reordenamiento regional.",
    consequences: "Transformaron por completo el equilibrio politico del sudeste asiatico continental."
  },
  "Tercera Guerra de Indochina": {
    cause: "Se origino en la rivalidad entre Vietnam, Camboya y China tras la victoria comunista en Vietnam y el colapso del equilibrio regional previo.",
    type: "guerra regional",
    scope: "regional",
    region: "Indochina",
    chronology: [
      { year: 1978, text: "Vietnam invade Camboya para derribar al regimen jemer rojo." },
      { year: 1979, text: "China invade el norte de Vietnam en una guerra punitiva." },
      { year: 1980, text: "La region queda atrapada en ocupaciones, insurgencias y tensiones prolongadas." }
    ],
    related: ["Guerra camboyano-vietnamita", "Guerra sino-vietnamita", "Guerras de Indochina"],
    participants: [
      { side: "Vietnam y aliados", members: ["Vietnam", "gobierno camboyano pro-vietnamita"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Camboya democratica, China y opositores", members: ["Jemeres Rojos", "China y otras fuerzas opositoras segun fase"], organizations: [], troops: "centenares de miles y apoyos indirectos", casualties: "muy elevadas" }
    ],
    outcome: "Predominio vietnamita en Camboya con fuerte costo regional y persistencia de la rivalidad chino-vietnamita.",
    consequences: "Reordeno la geoestrategia del sudeste asiatico continental durante la ultima fase de la Guerra fria."
  },
  "Batalla de Coral-Balmoral": {
    cause: "Se produjo cuando fuerzas australianas establecieron bases de fuego avanzadas para bloquear el movimiento comunista hacia Saigon durante la fase de Tet.",
    type: "batalla",
    scope: "regional",
    region: "Vietnam del Sur",
    chronology: [
      { year: 1968, text: "Unidades australianas ocupan posiciones en Coral y Balmoral para interrumpir aproximaciones comunistas." },
      { year: 1968, text: "Se suceden ataques intensos del Viet Cong y fuerzas norvietnamitas contra las bases australianas." }
    ],
    related: ["Guerra de Vietnam", "Ofensiva del Tet", "Batalla de Long Tan"],
    participants: [
      { side: "Australia y Vietnam del Sur", members: ["Australia", "Vietnam del Sur"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Defensa exitosa australiana con alto costo.",
    consequences: "Consolido el prestigio operacional australiano dentro de la guerra de Vietnam."
  },
  "Batalla de Coral–Balmoral": {
    cause: "Se produjo cuando fuerzas australianas establecieron bases de fuego avanzadas para bloquear el movimiento comunista hacia Saigon durante la fase de Tet.",
    type: "batalla",
    scope: "regional",
    region: "Vietnam del Sur",
    chronology: [
      { year: 1968, text: "Unidades australianas ocupan posiciones en Coral y Balmoral para interrumpir aproximaciones comunistas." },
      { year: 1968, text: "Se suceden ataques intensos del Viet Cong y fuerzas norvietnamitas contra las bases australianas." }
    ],
    related: ["Guerra de Vietnam", "Ofensiva del Tet", "Batalla de Long Tan"],
    participants: [
      { side: "Australia y Vietnam del Sur", members: ["Australia", "Vietnam del Sur"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Defensa exitosa australiana con alto costo.",
    consequences: "Consolido el prestigio operacional australiano dentro de la guerra de Vietnam."
  },
  "Batalla de Saigon": {
    cause: "El nombre suele referirse a los grandes combates por el control de Saigon durante fases criticas de la guerra, especialmente la ofensiva del Tet y el colapso final de Vietnam del Sur.",
    type: "batalla urbana",
    scope: "regional",
    region: "Vietnam del Sur",
    chronology: [
      { year: 1968, text: "La ciudad es atacada durante la ofensiva del Tet, con duros combates urbanos." },
      { year: 1975, text: "La caida final de Saigon simboliza el fin de la guerra y la victoria del Norte." }
    ],
    related: ["Guerra de Vietnam", "Ofensiva del Tet"],
    participants: [
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Vietnam del Sur y aliados", members: ["Vietnam del Sur", "Estados Unidos"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Escenario de combates decisivos en distintas fases de la guerra.",
    consequences: "Saigon se convirtio en el simbolo politico y militar del desenlace del conflicto vietnamita."
  },
  "Batalla de Signal Hill": {
    cause: "Se produjo en el contexto de las operaciones de helicomando y control en terreno montañoso para sostener ofensivas aliadas en Vietnam.",
    type: "batalla",
    scope: "regional",
    region: "Vietnam del Sur",
    chronology: [
      { year: 1968, text: "Fuerzas estadounidenses combaten por posiciones elevadas claves para comunicaciones y observacion." },
      { year: 1968, text: "La toma y defensa del punto alto mejora el control operativo de la zona." }
    ],
    related: ["Guerra de Vietnam"],
    participants: [
      { side: "Estados Unidos y aliados", members: ["Estados Unidos", "Vietnam del Sur"], organizations: [], troops: "centenares", casualties: "moderadas" },
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "centenares", casualties: "moderadas" }
    ],
    outcome: "Ventaja tactica aliada en el sector.",
    consequences: "Mejoro temporalmente las comunicaciones y la coordinacion aeromovil en el area de operaciones."
  },
  "Batalla de Signal Hill Vietnam": {
    cause: "Se produjo en el contexto de las operaciones de helicomando y control en terreno montañoso para sostener ofensivas aliadas en Vietnam.",
    type: "batalla",
    scope: "regional",
    region: "Vietnam del Sur",
    chronology: [
      { year: 1968, text: "Fuerzas estadounidenses combaten por posiciones elevadas claves para comunicaciones y observacion." },
      { year: 1968, text: "La toma y defensa del punto alto mejora el control operativo de la zona." }
    ],
    related: ["Guerra de Vietnam"],
    participants: [
      { side: "Estados Unidos y aliados", members: ["Estados Unidos", "Vietnam del Sur"], organizations: [], troops: "centenares", casualties: "moderadas" },
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "centenares", casualties: "moderadas" }
    ],
    outcome: "Ventaja tactica aliada en el sector.",
    consequences: "Mejoro temporalmente las comunicaciones y la coordinacion aeromovil en el area de operaciones."
  },
  "Batalla del valle de Ia Drang": {
    cause: "Fue una de las primeras grandes batallas convencionales entre fuerzas estadounidenses y norvietnamitas, tras la escalada terrestre de Estados Unidos.",
    type: "batalla",
    scope: "regional",
    region: "Vietnam del Sur",
    chronology: [
      { year: 1965, text: "Fuerzas estadounidenses son insertadas por helicoptero en el valle de Ia Drang." },
      { year: 1965, text: "Se desarrollan combates intensos que revelan la dureza del conflicto terrestre en Vietnam." }
    ],
    related: ["Guerra de Vietnam"],
    participants: [
      { side: "Estados Unidos y Vietnam del Sur", members: ["Estados Unidos", "Vietnam del Sur"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Vietnam del Norte", members: ["Vietnam del Norte"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Resultado militar debatido con fuerte costo para ambos bandos.",
    consequences: "Anticipo la logica de desgaste que marcaria gran parte de la guerra."
  },
  "Vietnam Counteroffensive Phase II": {
    cause: "Respondio a la necesidad estadounidense y sudvietnamita de recuperar iniciativa tras la intensificacion de la guerra en Vietnam del Sur.",
    type: "campaña",
    scope: "regional",
    region: "Indochina",
    chronology: [
      { year: 1966, text: "Se lanzan operaciones ofensivas de gran escala contra el Viet Cong y fuerzas norvietnamitas." },
      { year: 1967, text: "La campaña incrementa el desgaste sin lograr una decision definitiva." }
    ],
    related: ["Guerra de Vietnam", "Contraofensiva vietnamita fase II"],
    participants: [
      { side: "Estados Unidos y Vietnam del Sur", members: ["Estados Unidos", "Vietnam del Sur"], organizations: [], troops: "centenares de miles", casualties: "altas" },
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "centenares de miles", casualties: "altas" }
    ],
    outcome: "Ganancias tacticas sin victoria estrategica decisiva.",
    consequences: "Contribuyo al desgaste prolongado y a la escalada del conflicto."
  },
  "Vietnam Counteroffensive Phase III": {
    cause: "Continuo la estrategia de desgaste estadounidense en Vietnam del Sur frente a la persistencia de fuerzas comunistas.",
    type: "campaña",
    scope: "regional",
    region: "Indochina",
    chronology: [
      { year: 1967, text: "Se intensifican operaciones de busqueda y destruccion en varias regiones de Vietnam del Sur." },
      { year: 1968, text: "La ofensiva del Tet revela los limites de la estrategia aliada pese a sus exitos tacticos previos." }
    ],
    related: ["Guerra de Vietnam", "Contraofensiva vietnamita fase III", "Contraofensiva vietnamita fase II"],
    participants: [
      { side: "Estados Unidos y Vietnam del Sur", members: ["Estados Unidos", "Vietnam del Sur"], organizations: [], troops: "centenares de miles", casualties: "altas" },
      { side: "Vietnam del Norte y Viet Cong", members: ["Vietnam del Norte", "Viet Cong"], organizations: [], troops: "centenares de miles", casualties: "altas" }
    ],
    outcome: "Balance tactico favorable a los aliados sin resolver la guerra.",
    consequences: "Preparo el escenario militar y politico para la ofensiva del Tet."
  }
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Batalla de Chongju": {
    cause: "Se produjo durante el avance de las fuerzas de la ONU en Corea del Norte y la posterior reaccion sino-norcoreana.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "Fuerzas de la ONU y tropas comunistas chocan por el control de Chongju." },
      { year: 1950, text: "El combate refleja la creciente dureza de la campaña en el norte de Corea." }
    ],
    related: ["Guerra de Corea", "Ofensiva de la ONU en Corea del Norte"],
    participants: [
      { side: "ONU y Corea del Sur", members: ["Estados Unidos", "Corea del Sur", "ONU"], organizations: ["ONU"], troops: "miles", casualties: "elevadas" },
      { side: "Corea del Norte y China", members: ["Corea del Norte", "China"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Combate intenso dentro de la fase maniobrada de la guerra.",
    consequences: "Mostro la progresiva escalada del frente norcoreano antes del estancamiento posterior."
  },
  "Batalla de Chuam-ni": {
    cause: "Fue parte de las operaciones de contencion aliada frente a fuerzas chinas y norcoreanas durante la fase de maniobra de la Guerra de Corea.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1951, text: "Las fuerzas de la ONU combaten por sostener posiciones en Chuam-ni." },
      { year: 1951, text: "El choque contribuye a estabilizar sectores del frente central." }
    ],
    related: ["Guerra de Corea"],
    participants: [
      { side: "ONU", members: ["Estados Unidos", "Corea del Sur", "ONU"], organizations: ["ONU"], troops: "miles", casualties: "moderadas" },
      { side: "China y Corea del Norte", members: ["China", "Corea del Norte"], organizations: [], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Resistencia aliada en un frente muy disputado.",
    consequences: "Ayudo a sostener la linea en una etapa de alta presion enemiga."
  },
  "Batalla de Kapyong": {
    cause: "Ocurrio cuando fuerzas chinas avanzaron durante su ofensiva de primavera y unidades de la ONU intentaron bloquear el acceso a Seul.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1951, text: "Fuerzas chinas atacan posiciones de la ONU cerca de Kapyong." },
      { year: 1951, text: "Unidades australianas, canadienses y neozelandesas resisten el asalto." }
    ],
    related: ["Guerra de Corea"],
    participants: [
      { side: "ONU", members: ["Canada", "Australia", "Nueva Zelanda", "Corea del Sur"], organizations: ["ONU"], troops: "miles", casualties: "elevadas" },
      { side: "China y Corea del Norte", members: ["China", "Corea del Norte"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Victoria defensiva de la ONU.",
    consequences: "Contribuyo a frenar la ofensiva china hacia Seul y reforzo el prestigio de las fuerzas de la Commonwealth."
  },
  "Batalla de Kujin": {
    cause: "Se produjo durante la retirada y rearticulacion de fuerzas de la ONU frente a la ofensiva china en el norte de Corea.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "Fuerzas aliadas y norcoreano-chinas chocan en torno a Kujin." },
      { year: 1950, text: "La batalla refleja la presion sobre las unidades de la ONU tras la intervencion china." }
    ],
    related: ["Guerra de Corea", "Ofensiva de la ONU en Corea del Norte"],
    participants: [
      { side: "ONU", members: ["Australia", "Estados Unidos", "Corea del Sur"], organizations: ["ONU"], troops: "miles", casualties: "moderadas" },
      { side: "China y Corea del Norte", members: ["China", "Corea del Norte"], organizations: [], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Choque tactico sin decision estrategica permanente.",
    consequences: "Ilustro la dureza del repliegue aliado en la fase final de 1950."
  },
  "Batalla de la reserva de Chosin": {
    cause: "Se produjo cuando las fuerzas de la ONU avanzaban en el norte y fueron cercadas por la intervencion china alrededor del embalse de Chosin.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "La intervencion china sorprende a fuerzas de la ONU cerca del embalse de Chosin." },
      { year: 1950, text: "Los marines estadounidenses rompen el cerco en una retirada combativa." }
    ],
    related: ["Guerra de Corea", "Ofensiva de la ONU en Corea del Norte"],
    participants: [
      { side: "ONU", members: ["Estados Unidos", "Reino Unido", "Corea del Sur"], organizations: ["ONU"], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "China y Corea del Norte", members: ["China", "Corea del Norte"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Retirada operativa de la ONU con fuertes bajas para ambos bandos.",
    consequences: "Marco el fracaso del intento de reunificacion militar del norte y redefinio la guerra como conflicto prolongado."
  },
  "Batalla de Maehwa-san": {
    cause: "Fue uno de los combates por alturas y posiciones dominantes durante la fase de desgaste de la Guerra de Corea.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1951, text: "Fuerzas de la ONU combaten por el control de Maehwa-san." },
      { year: 1951, text: "El combate refuerza la logica de guerra de colinas y posiciones fortificadas." }
    ],
    related: ["Guerra de Corea", "Batalla de Punchbowl"],
    participants: [
      { side: "ONU", members: ["Corea del Sur", "Estados Unidos", "ONU"], organizations: ["ONU"], troops: "miles", casualties: "moderadas" },
      { side: "China y Corea del Norte", members: ["China", "Corea del Norte"], organizations: [], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Combate de desgaste por posiciones elevadas.",
    consequences: "Mostro la progresiva transformacion del conflicto en una guerra de trincheras y colinas."
  },
  "Batalla de la logistica del Perimetro de Pusan": {
    cause: "Se refiere a los combates y operaciones criticas para sostener el abastecimiento del Perimetro de Pusan durante la fase inicial de la guerra.",
    type: "operacion logistica",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "Las fuerzas de la ONU concentran suministros y refuerzos para sostener el Perimetro de Pusan." },
      { year: 1950, text: "La superioridad maritima y logistica aliada impide el colapso del enclave." }
    ],
    related: ["Guerra de Corea", "Batalla del Perímetro de Pusan"],
    participants: [
      { side: "ONU y Corea del Sur", members: ["Estados Unidos", "Corea del Sur", "ONU"], organizations: ["ONU"], troops: "fuerzas logisticas y de cobertura", casualties: "variables" },
      { side: "Corea del Norte", members: ["Corea del Norte"], organizations: [], troops: "fuerzas de presion ofensiva", casualties: "variables" }
    ],
    outcome: "Exito logistico aliado.",
    consequences: "Fue clave para sostener la defensa del perimetro y preparar la contraofensiva posterior."
  },
  "UN offensive into North Korea": {
    cause: "Siguio al exito de Incheon y busco destruir al ejercito norcoreano y reunificar la peninsula bajo Seul.",
    type: "ofensiva terrestre",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "Las fuerzas de la ONU cruzan el paralelo 38." },
      { year: 1950, text: "El avance rapido hacia el norte desencadena la intervencion china." },
      { year: 1950, text: "La ofensiva se revierte tras contraataques sino-norcoreanos." }
    ],
    related: ["Guerra de Corea", "Batalla de Incheon", "Ofensiva de la ONU en Corea del Norte"],
    participants: [
      { side: "ONU y Corea del Sur", members: ["Estados Unidos", "Corea del Sur", "ONU"], organizations: ["ONU"], troops: "centenares de miles", casualties: "altas" },
      { side: "Corea del Norte y China", members: ["Corea del Norte", "China"], organizations: [], troops: "centenares de miles", casualties: "muy altas" }
    ],
    outcome: "Avance inicial de la ONU seguido por repliegue tras la intervencion china.",
    consequences: "Transformo la guerra en un conflicto prolongado de posicion con fuerte internacionalizacion."
  },
  "Batalla de Busan": {
    cause: "Se refiere a los grandes combates librados en torno al perimetro defensivo de Busan durante la fase inicial de la guerra.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "Las fuerzas norcoreanas presionan el ultimo gran enclave aliado en el sur." },
      { year: 1950, text: "La resistencia aliada mantiene el perimetro hasta la contraofensiva de Incheon." }
    ],
    related: ["Guerra de Corea", "Batalla del Perímetro de Pusan"],
    participants: [
      { side: "ONU y Corea del Sur", members: ["Estados Unidos", "Corea del Sur", "ONU"], organizations: ["ONU"], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Corea del Norte", members: ["Corea del Norte"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Defensa exitosa del enclave aliado.",
    consequences: "Evito la derrota temprana de Corea del Sur y permitio la posterior contraofensiva."
  },
  "Batalla del rio Imjin": {
    cause: "Ocurrio durante la ofensiva de primavera china, cuando fuerzas de la ONU intentaron bloquear el avance hacia Seul.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1951, text: "Tropas chinas atacan posiciones de la ONU en el rio Imjin." },
      { year: 1951, text: "La resistencia de fuerzas britanicas y aliadas retrasa el avance enemigo." }
    ],
    related: ["Guerra de Corea", "Batalla de Kapyong"],
    participants: [
      { side: "ONU", members: ["Reino Unido", "Belgica", "Luxemburgo", "Corea del Sur"], organizations: ["ONU"], troops: "miles", casualties: "elevadas" },
      { side: "China y Corea del Norte", members: ["China", "Corea del Norte"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Resistencia aliada tacticamente costosa pero operacionalmente valiosa.",
    consequences: "Contribuyo a frenar la ofensiva china sobre Seul."
  },
  "Teatro coreano": {
    cause: "Describe el conjunto de operaciones, frentes y campañas libradas en la peninsula coreana durante la guerra de 1950-1953.",
    type: "teatro de guerra",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "Invasion norcoreana y defensa del sur bajo intervencion de la ONU." },
      { year: 1950, text: "Contraofensiva de Incheon y posterior intervencion china." },
      { year: 1951, text: "La guerra deriva hacia una fase de desgaste y posicion." },
      { year: 1953, text: "Se firma el armisticio de Panmunjom." }
    ],
    related: ["Guerra de Corea"],
    participants: [
      { side: "Bloque comunista", members: ["Corea del Norte", "China", "apoyo sovietico"], organizations: [], troops: "millones", casualties: "muy elevadas" },
      { side: "ONU y Corea del Sur", members: ["Corea del Sur", "Estados Unidos", "Reino Unido", "Turquia y otros"], organizations: ["ONU"], troops: "millones", casualties: "muy elevadas" }
    ],
    outcome: "Estancamiento militar y restauracion aproximada de la frontera inicial.",
    consequences: "Consolido la division de Corea y la militarizacion del noreste asiatico."
  },
  "Segunda batalla de Hook": {
    cause: "Fue una renovacion de los combates por la posicion avanzada de Hook en la fase final de la guerra.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1953, text: "Las fuerzas chinas vuelven a atacar la posicion de Hook." },
      { year: 1953, text: "Las tropas de la ONU resisten en un choque previo al armisticio." }
    ],
    related: ["Guerra de Corea", "Batalla de Hook"],
    participants: [
      { side: "ONU", members: ["Reino Unido", "Estados Unidos", "Corea del Sur"], organizations: ["ONU"], troops: "centenares y miles", casualties: "moderadas" },
      { side: "China y Corea del Norte", members: ["China", "Corea del Norte"], organizations: [], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Resistencia exitosa de la ONU.",
    consequences: "Confirmo el caracter desgastante y estatico del frente coreano en sus ultimos meses."
  },
  "Batalla de Pusan Perimeter logistics": {
    cause: "Se refiere a los combates y operaciones criticas para sostener el abastecimiento del Perimetro de Pusan durante la fase inicial de la guerra.",
    type: "operacion logistica",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "Las fuerzas de la ONU concentran suministros y refuerzos para sostener el Perimetro de Pusan." },
      { year: 1950, text: "La superioridad maritima y logistica aliada impide el colapso del enclave." }
    ],
    related: ["Guerra de Corea", "Batalla del Perímetro de Pusan"],
    participants: [
      { side: "ONU y Corea del Sur", members: ["Estados Unidos", "Corea del Sur", "ONU"], organizations: ["ONU"], troops: "fuerzas logisticas y de cobertura", casualties: "variables" },
      { side: "Corea del Norte", members: ["Corea del Norte"], organizations: [], troops: "fuerzas de presion ofensiva", casualties: "variables" }
    ],
    outcome: "Exito logistico aliado.",
    consequences: "Fue clave para sostener la defensa del perimetro y preparar la contraofensiva posterior."
  },
  "Batalla de Imjin River": {
    cause: "Ocurrio durante la ofensiva de primavera china, cuando fuerzas de la ONU intentaron bloquear el avance hacia Seul.",
    type: "batalla",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1951, text: "Tropas chinas atacan posiciones de la ONU en el rio Imjin." },
      { year: 1951, text: "La resistencia de fuerzas britanicas y aliadas retrasa el avance enemigo." }
    ],
    related: ["Guerra de Corea", "Batalla de Kapyong", "Batalla del rio Imjin"],
    participants: [
      { side: "ONU", members: ["Reino Unido", "Belgica", "Luxemburgo", "Corea del Sur"], organizations: ["ONU"], troops: "miles", casualties: "elevadas" },
      { side: "China y Corea del Norte", members: ["China", "Corea del Norte"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Resistencia aliada tacticamente costosa pero operacionalmente valiosa.",
    consequences: "Contribuyo a frenar la ofensiva china sobre Seul."
  },
  "Korean Theater": {
    cause: "Describe el conjunto de operaciones, frentes y campañas libradas en la peninsula coreana durante la guerra de 1950-1953.",
    type: "teatro de guerra",
    scope: "regional",
    region: "Peninsula de Corea",
    chronology: [
      { year: 1950, text: "Invasion norcoreana y defensa del sur bajo intervencion de la ONU." },
      { year: 1950, text: "Contraofensiva de Incheon y posterior intervencion china." },
      { year: 1951, text: "La guerra deriva hacia una fase de desgaste y posicion." },
      { year: 1953, text: "Se firma el armisticio de Panmunjom." }
    ],
    related: ["Guerra de Corea", "Teatro coreano"],
    participants: [
      { side: "Bloque comunista", members: ["Corea del Norte", "China", "apoyo sovietico"], organizations: [], troops: "millones", casualties: "muy elevadas" },
      { side: "ONU y Corea del Sur", members: ["Corea del Sur", "Estados Unidos", "Reino Unido", "Turquia y otros"], organizations: ["ONU"], troops: "millones", casualties: "muy elevadas" }
    ],
    outcome: "Estancamiento militar y restauracion aproximada de la frontera inicial.",
    consequences: "Consolido la division de Corea y la militarizacion del noreste asiatico."
  }
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Crisis del golfo Persico de 2019-2022": {
    cause: "Se origino en la tension entre Iran, Estados Unidos y sus aliados regionales por sanciones, navegacion comercial, presencia militar y ataques indirectos en el Golfo.",
    type: "crisis regional",
    scope: "regional",
    region: "Golfo Persico",
    chronology: [
      { year: 2019, text: "Se multiplican incidentes contra petroleros, derribos de drones y ataques a infraestructura energetica." },
      { year: 2020, text: "La muerte de Qasem Soleimani lleva la crisis a un punto de maxima tension." },
      { year: 2022, text: "La rivalidad sigue abierta, con episodios navales y presion diplomatica sostenida." }
    ],
    related: ["Conflicto irano-israeli", "Guerra subsidiaria irano-saudi"],
    participants: [
      { side: "Iran y aliados", members: ["Iran", "milicias y actores asociados segun episodio"], organizations: [], troops: "misiles, drones, fuerzas navales y proxies", casualties: "variables" },
      { side: "Estados Unidos y socios regionales", members: ["Estados Unidos", "Arabia Saudita", "Emiratos Arabes Unidos y otros"], organizations: [], troops: "fuerzas navales, aereas y antimisiles", casualties: "variables" }
    ],
    outcome: "Crisis sin guerra abierta total, pero con fuerte militarizacion regional.",
    consequences: "Profundizo la inseguridad en rutas energeticas y la polarizacion estrategica del Golfo."
  },
  "Guerra anglo-iraquí": {
    cause: "Estallo cuando el Reino Unido intervino contra el gobierno iraqui de Rashid Ali para impedir un alineamiento con el Eje y asegurar rutas imperiales y petroleras.",
    type: "intervencion u ocupacion",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 1941, text: "El golpe de Rashid Ali acerca Iraq al Eje y desencadena la reaccion britanica." },
      { year: 1941, text: "Fuerzas britanicas derrotan rapidamente al gobierno iraqui sublevado." }
    ],
    related: ["Segunda Guerra Mundial", "Campaña de Siria-Libano"],
    participants: [
      { side: "Reino Unido y aliados", members: ["Reino Unido", "fuerzas coloniales y aliadas"], organizations: ["Aliados"], troops: "decenas de miles", casualties: "moderadas" },
      { side: "Iraq de Rashid Ali", members: ["Iraq"], organizations: [], troops: "decenas de miles", casualties: "moderadas" }
    ],
    outcome: "Victoria britanica y restauracion de un gobierno favorable a Londres.",
    consequences: "Reafirmo el control britanico sobre Iraq y su valor estrategico en la guerra."
  },
  "Guerra civil iraquí": {
    cause: "Se profundizo tras la invasion de 2003, el colapso institucional, la violencia sectaria y la lucha por el poder entre milicias, insurgencias y el nuevo estado iraqui.",
    type: "conflicto interno",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 2003, text: "La invasion de Iraq y la caida de Saddam desarticulan el orden estatal previo." },
      { year: 2006, text: "La violencia sectaria entre sunies y chiies alcanza niveles de guerra civil." },
      { year: 2014, text: "La irrupcion de Estado Islamico reabre una fase de guerra a gran escala." }
    ],
    related: ["Guerra de Irak", "Escalada de tropas en la guerra de Irak de 2007"],
    participants: [
      { side: "Gobierno iraqui y aliados", members: ["Iraq", "Estados Unidos", "milicias aliadas segun fase"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Insurgencias y milicias", members: ["Al Qaeda en Iraq", "Estado Islamico", "milicias sectarias y rebeldes"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto fragmentado con fases de contencion y reescalada.",
    consequences: "Debilito profundamente al estado iraqui y reordeno la geopolítica del Levante y Mesopotamia."
  },
  "Guerra subsidiaria irano-saudi": {
    cause: "Se deriva de la competencia entre Iran y Arabia Saudita por liderazgo regional, influencia ideologica y control indirecto de conflictos en Oriente Medio.",
    type: "guerra subsidiaria",
    scope: "regional",
    region: "Oriente Medio",
    chronology: [
      { year: 2003, text: "La guerra de Iraq amplifica la pugna por influencia regional." },
      { year: 2011, text: "Las guerras de Siria y Yemen convierten la rivalidad en una lucha indirecta multisectorial." },
      { year: 2023, text: "Los intentos de distension no eliminan la competencia estructural." }
    ],
    related: ["Guerra civil siria", "Guerra civil yemeni", "Crisis del golfo Persico de 2019-2022"],
    participants: [
      { side: "Iran y aliados", members: ["Iran", "Hezbola", "huties y actores afines segun teatro"], organizations: [], troops: "apoyo directo e indirecto", casualties: "variables por conflicto subsidiario" },
      { side: "Arabia Saudita y socios", members: ["Arabia Saudita", "Emiratos Arabes Unidos y otros aliados"], organizations: [], troops: "apoyo directo e indirecto", casualties: "variables por conflicto subsidiario" }
    ],
    outcome: "Rivalidad prolongada sin resolucion definitiva.",
    consequences: "Multiplico guerras indirectas, polarizacion sectaria y reconfiguracion de alianzas regionales."
  },
  "Guerra subsidiaria irano-turca": {
    cause: "Refleja la competencia entre Iran y Turquia por influencia en Siria, Iraq, el Caucaso y otras areas de borde del antiguo espacio otomano-persa.",
    type: "rivalidad regional",
    scope: "regional",
    region: "Oriente Medio y Caucaso",
    chronology: [
      { year: 2011, text: "La guerra siria agudiza la diferencia de objetivos entre Iran y Turquia." },
      { year: 2020, text: "Los frentes en Siria, Iraq y el Caucaso muestran una competencia mas abierta por influencia." }
    ],
    related: ["Guerra civil siria", "Conflicto irano-israeli", "Conflicto de Nagorno-Karabaj de 2016"],
    participants: [
      { side: "Iran y aliados", members: ["Iran", "milicias y socios regionales"], organizations: [], troops: "presencia variable", casualties: "variables" },
      { side: "Turquia y aliados", members: ["Turquia", "facciones y socios regionales"], organizations: [], troops: "presencia variable", casualties: "variables" }
    ],
    outcome: "Competencia permanente sin guerra directa abierta.",
    consequences: "Complico la estabilizacion regional y superpuso frentes de rivalidad sobre guerras ya existentes."
  },
  "Insurgencia palestina en el sur del Libano": {
    cause: "Se desarrollo por el uso del sur del Libano como base de operaciones palestinas contra Israel y la respuesta militar israeli.",
    type: "insurgencia",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 1968, text: "Guerrillas palestinas intensifican operaciones desde el sur del Libano." },
      { year: 1978, text: "Israel responde con incursiones y operaciones de gran escala." },
      { year: 1982, text: "La escalada desemboca en la invasion israelí del Libano." }
    ],
    related: ["Conflicto entre Gaza e Israel", "Guerras arabe-israelies"],
    participants: [
      { side: "Organizaciones palestinas", members: ["OLP y facciones palestinas"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas terrestres, aereas y artilleria", casualties: "elevadas" }
    ],
    outcome: "Escalada prolongada sin solucion local estable.",
    consequences: "Convirtio el sur del Libano en un frente permanente del conflicto arabe-israeli."
  },
  "Ataque de Iran a Israel de 2024": {
    cause: "Fue la respuesta irani a ataques atribuidos a Israel contra objetivos y mandos vinculados a Teheran en el contexto de la rivalidad regional.",
    type: "ataque interestatal",
    scope: "regional",
    region: "Oriente Medio",
    chronology: [
      { year: 2024, text: "Iran lanza drones y misiles en un ataque directo sin precedentes contra Israel." },
      { year: 2024, text: "Israel y sus aliados interceptan gran parte del ataque, manteniendo la escalada contenida." }
    ],
    related: ["Conflicto irano-israeli", "Conflicto irano-israeli durante la guerra civil siria"],
    participants: [
      { side: "Iran", members: ["Iran"], organizations: [], troops: "misiles y drones", casualties: "limitadas" },
      { side: "Israel y aliados", members: ["Israel", "Estados Unidos y socios en apoyo defensivo"], organizations: [], troops: "defensa antiaerea y antimisiles", casualties: "limitadas" }
    ],
    outcome: "Escalada contenida sin guerra regional total inmediata.",
    consequences: "Elevo la rivalidad irano-israeli a una fase de confrontacion mas directa."
  },
  "Ataques de Estados Unidos en Yemen en 2025": {
    cause: "Se lanzaron para degradar capacidades huties tras ataques contra navegacion comercial y objetivos regionales en el Mar Rojo y alrededores.",
    type: "intervencion",
    scope: "regional",
    region: "Peninsula arabiga y Mar Rojo",
    chronology: [
      { year: 2025, text: "Estados Unidos intensifica ataques contra infraestructura y posiciones huties en Yemen." }
    ],
    related: ["Guerra civil yemeni", "Conflicto de Sa'dah"],
    participants: [
      { side: "Estados Unidos y socios", members: ["Estados Unidos"], organizations: [], troops: "aviacion, misiles y activos navales", casualties: "limitadas" },
      { side: "Huties", members: ["movimiento huzi"], organizations: [], troops: "fuerzas irregulares y medios misilisticos", casualties: "variables" }
    ],
    outcome: "Degradacion parcial de capacidades huties.",
    consequences: "Profundizo la internacionalizacion del conflicto yemeni y del frente del Mar Rojo."
  },
  "Bombardeo de la Franja de Gaza": {
    cause: "Forma parte de los ciclos de escalada entre Israel y facciones armadas de Gaza, con uso intensivo de ataques aereos y de artilleria.",
    type: "bombardeo",
    scope: "regional",
    region: "Gaza",
    chronology: [
      { year: 2008, text: "Comienzan grandes ciclos de bombardeo asociados a guerras y escaladas en Gaza." },
      { year: 2023, text: "La escala de los bombardeos vuelve a crecer de forma extraordinaria." }
    ],
    related: ["Conflicto entre Gaza e Israel", "Guerra de Gaza"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "aviacion, artilleria y misiles", casualties: "variables" },
      { side: "Milicias palestinas y poblacion afectada", members: ["Hamas y otras facciones"], organizations: [], troops: "capacidades limitadas frente al ataque aereo", casualties: "muy elevadas" }
    ],
    outcome: "Daño masivo sin resolucion politica del conflicto.",
    consequences: "Agravó la crisis humanitaria y la destruccion de infraestructura en Gaza."
  },
  "Conflicto afgano-irani de 2021": {
    cause: "Se relaciono con tensiones fronterizas, movimientos armados y cambios de control politico en Afganistan tras la retirada occidental.",
    type: "conflicto fronterizo",
    scope: "regional",
    region: "Asia occidental",
    chronology: [
      { year: 2021, text: "Incidentes armados y tensiones se registran en la frontera entre Iran y Afganistan." }
    ],
    related: ["Conflicto afgano-irani de 2023"],
    participants: [
      { side: "Iran", members: ["Iran"], organizations: [], troops: "guardias fronterizos", casualties: "limitadas" },
      { side: "Autoridades afganas o fuerzas locales", members: ["Afganistan"], organizations: [], troops: "guardias y fuerzas locales", casualties: "limitadas" }
    ],
    outcome: "Incidente contenido.",
    consequences: "Mostro la fragilidad de la frontera irano-afgana tras el cambio de poder en Kabul."
  },
  "Conflicto afgano-irani de 2023": {
    cause: "Estallo por disputas sobre agua, seguridad fronteriza y tensiones entre Iran y las nuevas autoridades afganas.",
    type: "conflicto fronterizo",
    scope: "regional",
    region: "Asia occidental",
    chronology: [
      { year: 2023, text: "Se producen choques armados en pasos fronterizos entre Iran y Afganistan." }
    ],
    related: ["Conflicto afgano-irani de 2021"],
    participants: [
      { side: "Iran", members: ["Iran"], organizations: [], troops: "guardias fronterizos", casualties: "limitadas" },
      { side: "Afganistan", members: ["Afganistan"], organizations: [], troops: "guardias fronterizos y fuerzas locales", casualties: "limitadas" }
    ],
    outcome: "Choque contenido sin guerra abierta.",
    consequences: "Subrayo la persistencia de disputas hidricas y de seguridad en la frontera."
  },
  "Conflicto de la Franja de Gaza de 2008-2009": {
    cause: "Escalo tras el colapso de una tregua, el lanzamiento de cohetes desde Gaza y la decision israeli de lanzar una ofensiva a gran escala.",
    type: "guerra regional",
    scope: "regional",
    region: "Gaza",
    chronology: [
      { year: 2008, text: "Israel inicia una amplia campaña aerea y terrestre contra Gaza." },
      { year: 2009, text: "La ofensiva concluye con enormes daños y un alto el fuego inestable." }
    ],
    related: ["Guerra de Gaza", "Conflicto entre Gaza e Israel"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas terrestres, aereas y navales", casualties: "elevadas" },
      { side: "Hamas y otras facciones", members: ["Hamas", "otras milicias palestinas"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Cese del fuego sin solucion politica.",
    consequences: "Abrio uno de los ciclos de devastacion mas intensos del conflicto de Gaza."
  },
  "Guerra civil de Yemen de 1994": {
    cause: "Estallo por la ruptura entre las elites del norte y del sur tras la unificacion y por la disputa sobre poder, autonomia y recursos.",
    type: "conflicto interno",
    scope: "regional",
    region: "Peninsula arabiga",
    chronology: [
      { year: 1994, text: "Las tensiones entre el norte y el sur derivan en guerra abierta." },
      { year: 1994, text: "Las fuerzas del norte derrotan al intento secesionista sureño." }
    ],
    related: ["Guerra civil de Yemen del Norte", "Guerra civil yemeni"],
    participants: [
      { side: "Gobierno del norte", members: ["Yemen"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Fuerzas del sur", members: ["dirigentes y unidades sureñas"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria del norte y fracaso de la secesion del sur.",
    consequences: "Reforzo un modelo de unificacion coercitiva y dejo resentimientos politicos duraderos."
  },
  "Guerra civil de Yemen del Norte": {
    cause: "Se produjo tras la revolucion republicana en Yemen del Norte y la resistencia monarquica apoyada por actores regionales rivales.",
    type: "conflicto interno",
    scope: "regional",
    region: "Peninsula arabiga",
    chronology: [
      { year: 1962, text: "La revolucion republicana derroca al imam y desencadena la guerra." },
      { year: 1967, text: "La retirada egipcia tras la Guerra de los Seis Dias altera el equilibrio del conflicto." },
      { year: 1970, text: "La guerra concluye con predominio republicano." }
    ],
    related: ["Guerra saudo-yemeni", "Guerra civil yemeni"],
    participants: [
      { side: "Republicanos", members: ["republicanos yemenies", "Egipto"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Monarquicos", members: ["monarquicos yemenies", "Arabia Saudita y aliados"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria republicana.",
    consequences: "Transformo el equilibrio politico de Yemen y amplifico la rivalidad egipcio-saudí."
  },
  "Guerra saudo-yemení": {
    cause: "Resume los choques armados entre Arabia Saudita y actores yemenies en distintos momentos de disputa fronteriza e intervencion regional.",
    type: "conflicto interestatal",
    scope: "regional",
    region: "Peninsula arabiga",
    chronology: [
      { year: 1934, text: "Primer gran enfrentamiento interestatal entre Arabia Saudita y Yemen." },
      { year: 2009, text: "Se reactivan choques en el contexto de la insurgencia huzi." },
      { year: 2015, text: "La guerra civil yemeni internacionaliza de nuevo el frente saudi-yemeni." }
    ],
    related: ["Conflicto de Sa'dah", "Guerra civil yemeni", "Guerra civil de Yemen del Norte"],
    participants: [
      { side: "Arabia Saudita y aliados", members: ["Arabia Saudita", "socios regionales segun fase"], organizations: [], troops: "fuerzas terrestres, aereas y artilleria", casualties: "variables" },
      { side: "Yemen y actores yemenies", members: ["Yemen", "huties y otros segun fase"], organizations: [], troops: "fuerzas regulares e irregulares", casualties: "variables" }
    ],
    outcome: "Serie de choques y guerras sin solucion final definitiva.",
    consequences: "Consolido la frontera saudi-yemeni como uno de los ejes de inestabilidad regional."
  },
  "Intervencion estadounidense en la guerra civil siria": {
    cause: "Se produjo por la lucha contra Estado Islamico, el apoyo a socios locales y la competencia por influencia en el marco de la guerra civil siria.",
    type: "intervencion",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 2014, text: "Estados Unidos inicia ataques contra Estado Islamico en Siria." },
      { year: 2015, text: "La cooperacion con fuerzas kurdas y arabes locales reconfigura el frente oriental sirio." },
      { year: 2019, text: "La presencia estadounidense se reduce parcialmente pero no desaparece." }
    ],
    related: ["Guerra civil siria", "Campaña de Siria Oriental (septiembre-diciembre de 2017)"],
    participants: [
      { side: "Estados Unidos y socios locales", members: ["Estados Unidos", "FDS y aliados locales"], organizations: [], troops: "aviacion, fuerzas especiales y asesores", casualties: "variables" },
      { side: "Estado Islamico y otros actores hostiles", members: ["Estado Islamico", "fuerzas hostiles segun fase"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Degradacion fuerte de Estado Islamico sin cerrar la guerra siria.",
    consequences: "Aseguro enclaves aliados en el este sirio y superpuso un frente internacional adicional."
  },
  "Bombardeos iranies en el Kurdistan iraqui en 2022": {
    cause: "Iran lanzo ataques contra grupos kurdos opositores asentados en el Kurdistan iraqui, en un contexto de tension interna y acusaciones de apoyo externo a protestas y actividades hostiles.",
    type: "bombardeo transfronterizo",
    scope: "regional",
    region: "Kurdistan iraqui",
    chronology: [
      { year: 2022, text: "Iran ejecuta bombardeos y ataques con drones contra posiciones kurdas en Iraq." }
    ],
    related: ["Guerra civil iraqui", "Crisis del golfo Persico de 2019-2022"],
    participants: [
      { side: "Iran", members: ["Iran"], organizations: [], troops: "misiles y drones", casualties: "limitadas" },
      { side: "Grupos kurdos iranies en Iraq", members: ["partidos kurdos opositores"], organizations: [], troops: "campamentos y milicias", casualties: "variables" }
    ],
    outcome: "Daño a objetivos kurdos sin resolver la disputa subyacente.",
    consequences: "Acentuo la vulnerabilidad del Kurdistan iraqui frente a ataques regionales."
  },
  "Escalada de tropas en la guerra de Irak de 2007": {
    cause: "Fue una reorientacion estrategica estadounidense para reducir la violencia sectaria y recuperar control territorial frente a insurgencias y milicias.",
    type: "escalada militar",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 2007, text: "Estados Unidos incrementa sustancialmente sus tropas y cambia su doctrina operativa en Iraq." },
      { year: 2008, text: "La violencia disminuye parcialmente, aunque persisten fragilidades estructurales." }
    ],
    related: ["Guerra civil iraqui", "Guerra de Irak"],
    participants: [
      { side: "Estados Unidos y gobierno iraqui", members: ["Estados Unidos", "Iraq"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Insurgencias y milicias", members: ["Al Qaeda en Iraq", "milicias sectarias y rebeldes"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Mejora tactica temporal del control territorial y de la seguridad.",
    consequences: "Aporto una reduccion relativa de la violencia sin resolver las fracturas politicas de fondo."
  },
  "Levantamiento de Barein de 2011": {
    cause: "Surgio en el marco de la Primavera Arabe por demandas de apertura politica, igualdad y reforma institucional en un sistema monarquico altamente tensionado.",
    type: "levantamiento",
    scope: "regional",
    region: "Golfo Persico",
    chronology: [
      { year: 2011, text: "Amplias protestas estallan en Barein exigiendo reformas politicas profundas." },
      { year: 2011, text: "La monarquia reprime las movilizaciones con apoyo regional." }
    ],
    related: ["Crisis del golfo Persico de 2019-2022", "Primavera Arabe"],
    participants: [
      { side: "Monarquia bareini y aliados", members: ["Barein", "Arabia Saudita y aliados del CCG"], organizations: [], troops: "fuerzas de seguridad y apoyo regional", casualties: "variables" },
      { side: "Manifestantes y oposicion", members: ["movimientos opositores de Barein"], organizations: [], troops: "movilizacion civil", casualties: "variables" }
    ],
    outcome: "Repression del levantamiento sin reforma estructural equivalente.",
    consequences: "Consolido un clima de securitizacion interna y rivalidad regional en torno al Golfo."
  },
  "Rebelion asiria": {
    cause: "Se produjo por tensiones entre el nuevo estado iraqui y sectores asirios armados en el contexto de posmandato y disputas por autonomia y seguridad.",
    type: "rebelion",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 1933, text: "La crisis entre comunidades asirias y el estado iraqui desemboca en violencia masiva." }
    ],
    related: ["Guerra anglo-iraquí"],
    participants: [
      { side: "Estado iraqui", members: ["Iraq"], organizations: [], troops: "fuerzas armadas y policiales", casualties: "elevadas" },
      { side: "Asirios armados y comunidades vinculadas", members: ["asirios"], organizations: [], troops: "miles o menos", casualties: "elevadas" }
    ],
    outcome: "Derrota de la rebelion y represion severa.",
    consequences: "Marco profundamente la relacion entre minorias y estado en el Iraq moderno."
  },
  "Expansion maritima saudita (1789-1809)": {
    cause: "Se vinculo a la expansion del primer estado saudita y su proyeccion sobre rutas, costas y espacios de poder en Arabia y sus mares adyacentes.",
    type: "expansion regional",
    scope: "regional",
    region: "Peninsula arabiga",
    chronology: [
      { year: 1789, text: "El poder saudita amplifica su alcance politico-militar en la peninsula." },
      { year: 1809, text: "La expansion encuentra limites crecientes por la reaccion otomana y regional." }
    ],
    related: ["Imperio Otomano", "Historia de Arabia Saudita"],
    participants: [
      { side: "Primer estado saudita", members: ["fuerzas sauditas"], organizations: [], troops: "fuerzas tribales y regionales", casualties: "variables" },
      { side: "Rivales regionales", members: ["autoridades otomanas y rivales locales"], organizations: [], troops: "fuerzas regionales", casualties: "variables" }
    ],
    outcome: "Expansion relevante pero no indefinida del poder saudita inicial.",
    consequences: "Prefiguro el papel geoestrategico de Arabia central y sus proyecciones posteriores."
  },
  "Frente sirio en la Guerra de Desgaste": {
    cause: "Se desarrollo por las escaramuzas, duelos de artilleria y enfrentamientos limitados entre Siria e Israel tras la guerra de 1967.",
    type: "frente de desgaste",
    scope: "regional",
    region: "Altos del Golan",
    chronology: [
      { year: 1968, text: "Se intensifican choques y bombardeos en el frente sirio tras la guerra de 1967." },
      { year: 1970, text: "La tension permanece alta aunque sin convertirse en guerra total sostenida." }
    ],
    related: ["Guerra de los Seis Dias", "Guerra del Yom Kippur"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "artilleria, aviacion y fuerzas terrestres", casualties: "variables" },
      { side: "Siria", members: ["Siria"], organizations: [], troops: "artilleria, aviacion y fuerzas terrestres", casualties: "variables" }
    ],
    outcome: "Fase de tension militar recurrente sin solucion definitiva.",
    consequences: "Mantuvo abierto el frente del Golan y alimentó la escalada que desembocaria en 1973."
  },
  "Enfrentamientos en el sur de Siria (abril-mayo de 2025)": {
    cause: "Se vincularon al deterioro de la seguridad en el sur sirio, con choques entre facciones locales, fuerzas gubernamentales y actores externos o vecinos atentos al Golan.",
    type: "enfrentamientos locales",
    scope: "regional",
    region: "Sur de Siria",
    chronology: [
      { year: 2025, text: "Se registran choques armados y episodios de violencia concentrados en el sur de Siria." }
    ],
    related: ["Guerra civil siria", "Conflicto fronterizo sirio-israeli (2012-presente)"],
    participants: [
      { side: "Fuerzas locales y estatales", members: ["fuerzas sirias y actores armados locales"], organizations: [], troops: "variables", casualties: "variables" },
      { side: "Actores opositores o rivales segun episodio", members: ["facciones locales"], organizations: [], troops: "variables", casualties: "variables" }
    ],
    outcome: "Violencia localizada sin resolucion estructural.",
    consequences: "Reflejo la persistente fragilidad del sur sirio aun en fases de menor intensidad nacional."
  },
  "Enfrentamientos en el sur de Siria (julio de 2025-presente)": {
    cause: "Prolongan la inestabilidad del sur sirio por tensiones entre autoridad estatal, facciones locales y el entorno estrategico del Golan.",
    type: "enfrentamientos locales",
    scope: "regional",
    region: "Sur de Siria",
    chronology: [
      { year: 2025, text: "Nuevos choques y episodios de violencia prolongan la inestabilidad en el sur de Siria." }
    ],
    related: ["Guerra civil siria", "Conflicto fronterizo sirio-israeli (2012-presente)"],
    participants: [
      { side: "Fuerzas locales y estatales", members: ["fuerzas sirias y actores armados locales"], organizations: [], troops: "variables", casualties: "variables" },
      { side: "Actores opositores o rivales segun episodio", members: ["facciones locales"], organizations: [], troops: "variables", casualties: "variables" }
    ],
    outcome: "Persistencia de violencia subregional.",
    consequences: "Mantiene la zona como foco de inseguridad incluso tras la disminucion relativa del conflicto sirio general."
  },
  "Acción del golfo de Sidra": {
    cause: "Se produjo por la disputa entre Libia y Estados Unidos sobre libertad de navegacion y reconocimiento de aguas en el golfo de Sidra.",
    type: "incidente militar",
    scope: "regional",
    region: "Mediterraneo oriental",
    chronology: [
      { year: 1981, text: "Estados Unidos desafia las reclamaciones maritimas libias en el golfo de Sidra." },
      { year: 1986, text: "Nuevos choques aereos y navales elevan la tension bilateral." }
    ],
    related: ["Crisis del golfo Persico de 2019-2022"],
    participants: [
      { side: "Estados Unidos", members: ["Estados Unidos"], organizations: [], troops: "aviacion y activos navales", casualties: "limitadas" },
      { side: "Libia", members: ["Libia"], organizations: [], troops: "aviacion y defensa costera", casualties: "limitadas" }
    ],
    outcome: "Superioridad estadounidense en los enfrentamientos directos.",
    consequences: "Debilito la posicion libia y reforzo la proyeccion militar estadounidense en la region."
  },
  "Batalla de Kuwait International Airport": {
    cause: "Se produjo en la ofensiva terrestre final para expulsar a Iraq de Kuwait durante la Guerra del Golfo.",
    type: "batalla",
    scope: "regional",
    region: "Golfo Persico",
    chronology: [
      { year: 1991, text: "Fuerzas de la coalicion avanzan sobre el aeropuerto internacional de Kuwait." },
      { year: 1991, text: "La resistencia iraqui es superada en el marco del colapso del frente." }
    ],
    related: ["Guerra del Golfo"],
    participants: [
      { side: "Coalicion internacional", members: ["Estados Unidos", "Kuwait y aliados"], organizations: ["ONU"], troops: "fuerzas mecanizadas y apoyo aereo", casualties: "moderadas" },
      { side: "Irak", members: ["Irak"], organizations: [], troops: "unidades regulares y blindadas", casualties: "elevadas" }
    ],
    outcome: "Victoria de la coalicion.",
    consequences: "Acelero la liberacion completa de Kuwait."
  },
  "Invasión siria de Jordania": {
    cause: "Se produjo en el contexto de Septiembre Negro y del temor sirio a la derrota de facciones palestinas en Jordania.",
    type: "intervencion",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 1970, text: "Fuerzas sirias ingresan en Jordania durante la crisis de Septiembre Negro." },
      { year: 1970, text: "La intervencion fracasa y Siria se repliega bajo fuerte presion militar y diplomatica." }
    ],
    related: ["Guerras arabe-israelies", "Conflicto israelo-palestino"],
    participants: [
      { side: "Siria", members: ["Siria"], organizations: [], troops: "blindados y apoyo mecanizado", casualties: "moderadas" },
      { side: "Jordania", members: ["Jordania"], organizations: [], troops: "fuerzas regulares jordanas", casualties: "moderadas" }
    ],
    outcome: "Fracaso de la intervencion siria.",
    consequences: "Reforzo el control jordano interno y reordeno el papel de las facciones palestinas en la region."
  },
  "Protestas en Gaza de 2018": {
    cause: "Surgieron por el bloqueo de Gaza, la crisis humanitaria y demandas vinculadas al retorno de refugiados y a la presion sobre la frontera con Israel.",
    type: "levantamiento",
    scope: "regional",
    region: "Gaza",
    chronology: [
      { year: 2018, text: "Comienzan movilizaciones masivas en la frontera de Gaza con Israel." },
      { year: 2018, text: "La respuesta armada israelí provoca numerosas victimas y amplia condena internacional." }
    ],
    related: ["Conflicto entre Gaza e Israel", "Guerra de Gaza de 2012"],
    participants: [
      { side: "Manifestantes y facciones de Gaza", members: ["poblacion civil de Gaza", "facciones palestinas"], organizations: [], troops: "movilizacion civil con participacion diversa", casualties: "muy elevadas" },
      { side: "Israel", members: ["Israel"], organizations: [], troops: "frontera militarizada, francotiradores y apoyo aereo", casualties: "limitadas" }
    ],
    outcome: "Represion del ciclo de protestas sin cambios estructurales de fondo.",
    consequences: "Acentuo el aislamiento de Gaza y la centralidad del conflicto humanitario en el enclave."
  }
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Conflicto fronterizo sirio-israelí (2012-presente)": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto fronterizo sirio-israeli (2012-presente)"],
  "Conflicto irano-israelí": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto irano-israeli"],
  "Irán–Israel conflict during Syrian civil war": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto irano-israeli durante la guerra civil siria"],
  "Israeli-British clash de January 7, 1949": EXTRA_CONFLICT_DETAIL_OVERRIDES["Choque israelo-britanico del 7 de enero de 1949"],
  "Arab–Israeli Wars": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerras arabe-israelies"],
  "Crisis del golfo Pérsico de 2019-2022": EXTRA_CONFLICT_DETAIL_OVERRIDES["Crisis del golfo Persico de 2019-2022"],
  "Guerra subsidiaria irano-saudí": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra subsidiaria irano-saudi"],
  "Insurgencia palestina en el sur del Líbano": EXTRA_CONFLICT_DETAIL_OVERRIDES["Insurgencia palestina en el sur del Libano"],
  "Ataque de Irán a Israel de 2024": EXTRA_CONFLICT_DETAIL_OVERRIDES["Ataque de Iran a Israel de 2024"],
  "Bombing de Gaza Strip": EXTRA_CONFLICT_DETAIL_OVERRIDES["Bombardeo de la Franja de Gaza"],
  "Conflicto afgano-iraní de 2021": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto afgano-irani de 2021"],
  "Conflicto afgano-iraní de 2023": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto afgano-irani de 2023"],
  "Conflicto de la Franja de Gaza de 2008–2009": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto de la Franja de Gaza de 2008-2009"],
  "Guerra árabe-israelí de 1948": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra arabe-israeli de 1948"],
  "Intervención estadounidense en la guerra civil siria": EXTRA_CONFLICT_DETAIL_OVERRIDES["Intervencion estadounidense en la guerra civil siria"],
  "Iranian bombings en Iraqi Kurdistan en 2022": EXTRA_CONFLICT_DETAIL_OVERRIDES["Bombardeos iranies en el Kurdistan iraqui en 2022"],
  "Rebelión asiria": EXTRA_CONFLICT_DETAIL_OVERRIDES["Rebelion asiria"],
  "Saudi maritime expansion, 1789-1809": EXTRA_CONFLICT_DETAIL_OVERRIDES["Expansion maritima saudita (1789-1809)"],
  "Syrian front en War de Attrition": EXTRA_CONFLICT_DETAIL_OVERRIDES["Frente sirio en la Guerra de Desgaste"]
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Guerra árabe-israelí de 1948": {
    cause: "Estallo tras la proclamacion del Estado de Israel y el rechazo arabe al plan de particion y a la consolidacion del nuevo estado.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 1947, text: "Comienza la guerra civil en el Mandato britanico tras el plan de particion." },
      { year: 1948, text: "Se proclama Israel e intervienen estados arabes vecinos." },
      { year: 1949, text: "Armisticios que consolidan el control israeli sobre mas territorio del previsto originalmente." }
    ],
    related: ["Guerra de independencia de Israel", "Guerras arabe-israelies"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Estados arabes y fuerzas palestinas", members: ["Egipto", "Jordania", "Siria", "Irak", "Libano", "fuerzas palestinas"], organizations: ["Liga Arabe"], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria israeli y consolidacion estatal.",
    consequences: "Genero el problema palestino de refugiados y abrio una era de guerras arabe-israelies recurrentes."
  },
  "Iraq War troop surge de 2007": {
    cause: "Fue una reorientacion estrategica estadounidense para reducir la violencia sectaria y recuperar control territorial frente a insurgencias y milicias.",
    type: "escalada militar",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 2007, text: "Estados Unidos incrementa sustancialmente sus tropas y cambia su doctrina operativa en Iraq." },
      { year: 2008, text: "La violencia disminuye parcialmente, aunque persisten fragilidades estructurales." }
    ],
    related: ["Guerra civil iraqui", "Guerra de Irak", "Escalada de tropas en la guerra de Irak de 2007"],
    participants: [
      { side: "Estados Unidos y gobierno iraqui", members: ["Estados Unidos", "Iraq"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Insurgencias y milicias", members: ["Al Qaeda en Iraq", "milicias sectarias y rebeldes"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Mejora tactica temporal del control territorial y de la seguridad.",
    consequences: "Aporto una reduccion relativa de la violencia sin resolver las fracturas politicas de fondo."
  }
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Medidas antipirateria en Somalia": {
    cause: "Surgieron por la expansion de la pirateria en el Cuerno de Africa y la necesidad de proteger el trafico maritimo internacional en el golfo de Aden y el oceano Indico occidental.",
    type: "operacion antipirateria",
    scope: "internacional",
    region: "Cuerno de Africa",
    chronology: [
      { year: 2008, text: "Se intensifican las misiones navales internacionales frente a Somalia." },
      { year: 2011, text: "La cooperacion naval, los equipos de seguridad privada y operaciones selectivas reducen los secuestros." }
    ],
    related: ["Guerra civil somali", "Incursion de abril de 2009 frente a Somalia"],
    participants: [
      { side: "Coaliciones navales", members: ["Union Europea", "OTAN", "Estados Unidos", "China", "India y otros"], organizations: ["UE", "OTAN", "ONU"], troops: "fuerzas navales multinacionales", casualties: "limitadas" },
      { side: "Pirateria somali", members: ["redes piratas somalies"], organizations: [], troops: "grupos irregulares costeros", casualties: "variables" }
    ],
    outcome: "Reduccion sustancial de la pirateria organizada frente a Somalia.",
    consequences: "Mejoro la seguridad maritima regional pero no resolvio las causas politicas y economicas en Somalia."
  },
  "Conflicto entre Chad y Libia": {
    cause: "Se debio a la disputa por la Franja de Aouzou, la inestabilidad interna de Chad y la intervencion libia en apoyo de facciones locales.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Sahel central",
    chronology: [
      { year: 1978, text: "La intervencion libia en Chad se vuelve abierta y sostenida." },
      { year: 1987, text: "La llamada Guerra Toyota revierte el equilibrio en favor de Chad." },
      { year: 1994, text: "La CIJ reconoce la soberania chadiana sobre Aouzou." }
    ],
    related: ["Primera rebelion de Chad (FROLINAT)"],
    participants: [
      { side: "Chad", members: ["Chad"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Libia y aliados", members: ["Libia", "facciones chadianas aliadas"], organizations: [], troops: "decenas de miles y blindados", casualties: "elevadas" }
    ],
    outcome: "Victoria estrategica de Chad y retirada libia.",
    consequences: "Consolido la frontera internacional y limito la proyeccion libia en el Sahel."
  },
  "Conflicto fronterizo entre Yibuti y Eritrea": {
    cause: "Se origino en la disputa por la zona de Ras Doumeira y tensiones fronterizas tras la independencia eritrea.",
    type: "conflicto fronterizo",
    scope: "subregional",
    region: "Cuerno de Africa",
    chronology: [
      { year: 2008, text: "Escalan los combates en el sector de Doumeira." },
      { year: 2010, text: "La mediacion regional e internacional reduce la intensidad del conflicto." }
    ],
    related: ["Guerra entre Etiopia y Eritrea"],
    participants: [
      { side: "Yibuti", members: ["Yibuti"], organizations: [], troops: "fuerzas limitadas", casualties: "moderadas" },
      { side: "Eritrea", members: ["Eritrea"], organizations: [], troops: "fuerzas limitadas", casualties: "moderadas" }
    ],
    outcome: "Estancamiento con desescalada paulatina.",
    consequences: "Acentuo el aislamiento regional de Eritrea y la militarizacion del Cuerno de Africa."
  },
  "Primera guerra de Burundi": {
    cause: "Se vinculo a la violencia etnopolitica entre elites hutu y tutsi y a la crisis del estado burundes tras asesinatos y golpes.",
    type: "guerra civil",
    scope: "interno",
    region: "Grandes Lagos",
    chronology: [
      { year: 1993, text: "El asesinato del presidente Ndadaye desencadena una guerra civil prolongada." },
      { year: 2000, text: "El Acuerdo de Arusha abre un marco politico para la paz." },
      { year: 2005, text: "La mayor parte de las facciones rebeldes entra en la politica institucional." }
    ],
    related: ["Primera guerra de Ruanda", "Segunda guerra de Ruanda"],
    participants: [
      { side: "Estado burundes", members: ["Burundi", "ejercito dominado por tutsis segun etapa"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Rebeldes hutu", members: ["CNDD-FDD", "FNL y otras facciones"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Acuerdos graduales y transformacion del sistema politico.",
    consequences: "Redujo la guerra abierta pero dejo una fuerte fragilidad institucional."
  },
  "Primera rebelion de Chad (FROLINAT)": {
    cause: "Nacio del descontento contra el centralismo del gobierno chadiano y de fracturas regionales y etnicas en el norte y centro del pais.",
    type: "insurgencia",
    scope: "interno",
    region: "Sahel central",
    chronology: [
      { year: 1965, text: "Estallan revueltas en el centro y norte de Chad." },
      { year: 1966, text: "Se crea el FROLINAT como coordinadora rebelde." },
      { year: 1979, text: "El conflicto desemboca en la fragmentacion del poder estatal." }
    ],
    related: ["Conflicto entre Chad y Libia"],
    participants: [
      { side: "Gobierno de Chad", members: ["Chad"], organizations: [], troops: "fuerzas limitadas", casualties: "elevadas" },
      { side: "Rebeldes del FROLINAT", members: ["FROLINAT y facciones asociadas"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Debilitamiento del estado y apertura de una larga era de guerras internas.",
    consequences: "Preparo el terreno para intervenciones extranjeras y nuevas guerras civiles."
  },
  "Primera guerra de Ruanda": {
    cause: "Comenzo con la invasion del FPR desde Uganda y la crisis del regimen ruandes, en un contexto de exilio tutsi y polarizacion etnica.",
    type: "guerra civil",
    scope: "interno",
    region: "Grandes Lagos",
    chronology: [
      { year: 1990, text: "El FPR entra en Ruanda desde Uganda e inicia la guerra." },
      { year: 1993, text: "Los Acuerdos de Arusha intentan un reparto de poder." },
      { year: 1994, text: "El derribo del avion presidencial abre el genocidio y una nueva fase del conflicto." }
    ],
    related: ["Segunda guerra de Ruanda", "Primera guerra de Burundi"],
    participants: [
      { side: "Gobierno ruandes", members: ["Ruanda"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Frente Patriotico Ruandes", members: ["FPR"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Colapso del regimen hutu tras el genocidio y victoria del FPR.",
    consequences: "Transformo el estado ruandes y desencadeno guerras regionales posteriores."
  },
  "Segunda guerra de Ruanda": {
    cause: "Corresponde a la fase final de la guerra ruandesa de 1994 y al colapso del genocidio en curso, con ofensiva decisiva del FPR.",
    type: "guerra civil",
    scope: "interno",
    region: "Grandes Lagos",
    chronology: [
      { year: 1994, text: "Tras el inicio del genocidio, el FPR relanza su ofensiva total." },
      { year: 1994, text: "Kigali cae y cientos de miles de personas huyen hacia Zaire y otros paises vecinos." }
    ],
    related: ["Primera guerra de Ruanda", "Primera Guerra del Congo"],
    participants: [
      { side: "FPR", members: ["Frente Patriotico Ruandes"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Gobierno genocida y milicias", members: ["fuerzas armadas ruandesas", "Interahamwe"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria del FPR y fin del regimen genocida.",
    consequences: "Puso fin al genocidio dentro de Ruanda y exporto la crisis a Zaire."
  },
  "Tercera guerra de Ruanda": {
    cause: "Designa la internacionalizacion del conflicto ruandes en el este del Congo, ligada a persecucion de genocidas y a la pugna por seguridad e influencia regional.",
    type: "guerra regional",
    scope: "regional",
    region: "Grandes Lagos",
    chronology: [
      { year: 1996, text: "La crisis de refugiados y milicias hutu en Zaire se convierte en guerra regional." },
      { year: 1998, text: "La regionalizacion culmina en la Segunda Guerra del Congo." }
    ],
    related: ["Primera Guerra del Congo", "Segunda guerra del Congo", "Segunda guerra de Ruanda"],
    participants: [
      { side: "Ruanda y aliados", members: ["Ruanda", "movimientos congoleños aliados"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Milicias hutu y estados rivales", members: ["ex FAR", "Interahamwe", "Zaire y otros actores segun etapa"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Escalada hacia las guerras congoleñas.",
    consequences: "Conecto directamente el genocidio ruandes con la guerra regional en los Grandes Lagos."
  },
  "Primera guerra de Uganda": {
    cause: "Se asocia a las luchas por el poder tras la independencia ugandesa y a la caida de gobiernos mediante insurgencias y golpes sucesivos.",
    type: "guerra civil",
    scope: "interno",
    region: "Africa oriental",
    chronology: [
      { year: 1971, text: "Idi Amin toma el poder por golpe de estado." },
      { year: 1979, text: "La guerra con Tanzania precipita la caida de Amin y una nueva fase de inestabilidad." },
      { year: 1986, text: "El NRA de Museveni toma Kampala y cierra el ciclo principal." }
    ],
    related: ["Primera guerra de Ruanda"],
    participants: [
      { side: "Gobiernos ugandeses", members: ["Uganda", "fuerzas estatales segun etapa"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Insurgencias y oposiciones armadas", members: ["NRA y otras facciones"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria del NRA y reconfiguracion del poder ugandes.",
    consequences: "Cambio el equilibrio politico interno y convirtio a Uganda en actor central de los Grandes Lagos."
  },
  "Guerra civil de la Republica del Congo": {
    cause: "Surgio de la pugna por el poder en Brazzaville, militarizacion de facciones politicas y la inestabilidad regional posterior al conflicto zairense.",
    type: "guerra civil",
    scope: "interno",
    region: "Africa central",
    chronology: [
      { year: 1997, text: "Estallan combates entre milicias leales a Lissouba y Sassou Nguesso." },
      { year: 1997, text: "La intervencion angoleña inclina la guerra en favor de Sassou Nguesso." },
      { year: 1999, text: "Persisten bolsas de violencia pese a la restauracion del control gubernamental." }
    ],
    related: ["Primera Guerra del Congo", "Segunda guerra del Congo"],
    participants: [
      { side: "Fuerzas de Sassou Nguesso", members: ["milicias Cobra", "Republica del Congo", "Angola"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Fuerzas rivales", members: ["milicias Ninja", "milicias Zulu", "facciones leales a Lissouba"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria de Sassou Nguesso.",
    consequences: "Consolido un nuevo ciclo autoritario y militarizo aun mas Africa central."
  },
  "Guerra de Independencia de Somalilandia": {
    cause: "Nacio de la represion del regimen somali contra el norte y del reclamo de autodeterminacion de la antigua Somalilandia britanica.",
    type: "guerra secesionista",
    scope: "interno",
    region: "Cuerno de Africa",
    chronology: [
      { year: 1981, text: "El Movimiento Nacional Somali se organiza contra el regimen de Siad Barre." },
      { year: 1988, text: "La guerra se intensifica con bombardeos masivos sobre Hargeisa y Burao." },
      { year: 1991, text: "Somalilandia proclama su independencia de facto tras la caida del regimen." }
    ],
    related: ["Guerra de Somalilandia", "Guerra civil somali"],
    participants: [
      { side: "Somalilandia rebelde", members: ["Movimiento Nacional Somali"], organizations: [], troops: "miles", casualties: "muy elevadas" },
      { side: "Estado somali", members: ["Somalia"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Separacion de facto de Somalilandia.",
    consequences: "Creo una entidad estable no reconocida internacionalmente dentro del espacio somali."
  },
  "Guerra de Somalilandia": {
    cause: "Se relaciona con la consolidacion armada de Somalilandia frente a rivales internos y fuerzas unionistas en el periodo posterior a 1991.",
    type: "conflicto secesionista",
    scope: "interno",
    region: "Cuerno de Africa",
    chronology: [
      { year: 1991, text: "Somalilandia intenta consolidar instituciones y control territorial propio." },
      { year: 1994, text: "Combates intermitentes y acuerdos locales reordenan el poder interno." }
    ],
    related: ["Guerra de Independencia de Somalilandia", "Guerra civil somali"],
    participants: [
      { side: "Autoridades de Somalilandia", members: ["Somalilandia"], organizations: [], troops: "fuerzas locales", casualties: "moderadas" },
      { side: "Facciones rivales", members: ["clanes y facciones unionistas"], organizations: [], troops: "fuerzas locales", casualties: "moderadas" }
    ],
    outcome: "Consolidacion gradual del control de facto de Somalilandia.",
    consequences: "Acentuo la diferenciacion politica entre Somalilandia y el resto de Somalia."
  },
  "Guerra entre Etiopia y Eritrea": {
    cause: "Se debio a disputas fronterizas, rivalidades politicas posindependencia y al desacuerdo sobre zonas como Badme.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Cuerno de Africa",
    chronology: [
      { year: 1998, text: "La disputa por Badme deriva en guerra abierta." },
      { year: 2000, text: "La ofensiva etiope y el acuerdo de Argel detienen la guerra." }
    ],
    related: ["Conflicto fronterizo entre Yibuti y Eritrea", "Guerra civil etiope"],
    participants: [
      { side: "Etiopia", members: ["Etiopia"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Eritrea", members: ["Eritrea"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Alto el fuego con frontera disputada durante años.",
    consequences: "Profundizo la militarizacion regional y dejo una paz fria prolongada."
  },
  "Guerra grebo-liberiana": {
    cause: "Se inscribe en conflictos etnopoliticos del sureste de Liberia durante la formacion temprana del estado liberiano.",
    type: "guerra local",
    scope: "interno",
    region: "Africa occidental",
    chronology: [
      { year: 1876, text: "El estado liberiano entra en guerra con comunidades grebo." },
      { year: 1910, text: "Persisten ciclos de coercion y resistencia en la region costera oriental." }
    ],
    related: ["Segunda guerra liberiana"],
    participants: [
      { side: "Liberia", members: ["Liberia"], organizations: [], troops: "fuerzas reducidas", casualties: "variables" },
      { side: "Pueblos grebo", members: ["comunidades grebo"], organizations: [], troops: "fuerzas locales", casualties: "variables" }
    ],
    outcome: "Expansión gradual del control liberiano.",
    consequences: "Consolido jerarquias desiguales y tensiones duraderas en el sudeste del pais."
  },
  "Invasion marroqui del Sahara espanol": {
    cause: "Se produjo al final de la descolonizacion española y de la disputa por el control del Sahara Occidental.",
    type: "invasion",
    scope: "regional",
    region: "Noroeste de Africa",
    chronology: [
      { year: 1975, text: "La Marcha Verde y el avance marroqui precipitan la retirada española." },
      { year: 1976, text: "El conflicto se transforma en guerra abierta con el Frente Polisario." }
    ],
    related: ["Guerra del Sahara Occidental", "Conflicto del Sahara Occidental"],
    participants: [
      { side: "Marruecos", members: ["Marruecos"], organizations: [], troops: "decenas de miles", casualties: "moderadas" },
      { side: "Polisario y actores saharauis", members: ["Frente Polisario", "poblacion saharaui"], organizations: [], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Ocupacion inicial marroqui de gran parte del territorio.",
    consequences: "Abre la guerra saharaui y un largo contencioso internacional."
  },
  "Operacion Costa de Marfil": {
    cause: "Fue una intervencion francesa para estabilizar Costa de Marfil, proteger civiles y apoyar el cumplimiento de acuerdos y mandatos internacionales.",
    type: "intervencion",
    scope: "regional",
    region: "Africa occidental",
    chronology: [
      { year: 2002, text: "Francia despliega la Operacion Licorne tras la rebelion en Costa de Marfil." },
      { year: 2011, text: "La operacion participa en la fase final de la crisis poselectoral." }
    ],
    related: ["Primera guerra civil marfilena", "Segunda guerra civil marfilena"],
    participants: [
      { side: "Francia y actores internacionales", members: ["Francia", "ONU"], organizations: ["ONU"], troops: "miles", casualties: "limitadas" },
      { side: "Facciones marfilenas", members: ["gobierno y rebeldes segun etapa"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Contencion parcial de la violencia y apoyo a la transicion politica.",
    consequences: "Aseguro una presencia externa decisiva en la resolucion de la crisis marfilena."
  },
  "Primera guerra civil marfilena": {
    cause: "Estallo por crisis de legitimidad, exclusion politica y fracturas entre norte y sur de Costa de Marfil.",
    type: "guerra civil",
    scope: "interno",
    region: "Africa occidental",
    chronology: [
      { year: 2002, text: "Una rebelion armada divide el pais entre norte y sur." },
      { year: 2007, text: "El Acuerdo de Uagadugu reduce la confrontacion abierta." }
    ],
    related: ["Operacion Costa de Marfil", "Segunda guerra civil marfilena"],
    participants: [
      { side: "Gobierno marfileno", members: ["Costa de Marfil"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Rebeldes", members: ["Fuerzas Nuevas y facciones aliadas"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Congelamiento del conflicto con division territorial.",
    consequences: "Dejo una paz incompleta que desemboco en la crisis posterior de 2010-2011."
  },
  "Segunda guerra liberiana": {
    cause: "Surgio del colapso del regimen de Charles Taylor y de la ofensiva de grupos rebeldes sobre Monrovia y otras zonas del pais.",
    type: "guerra civil",
    scope: "interno",
    region: "Africa occidental",
    chronology: [
      { year: 1999, text: "LURD inicia la ofensiva contra el gobierno de Taylor." },
      { year: 2003, text: "Taylor dimite y se despliega una fuerza internacional seguida por la ONU." }
    ],
    related: ["Guerra grebo-liberiana", "Guerra civil de Sierra Leona"],
    participants: [
      { side: "Gobierno liberiano", members: ["Liberia"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Rebeldes", members: ["LURD", "MODEL"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Caida del regimen de Taylor y transicion supervisada internacionalmente.",
    consequences: "Abre el camino a la reconstruccion estatal y al despliegue de la ONU."
  },
  "Segunda guerra civil marfilena": {
    cause: "Se debio al rechazo del resultado electoral de 2010 y a la reanudacion de la lucha entre las fuerzas de Gbagbo y Ouattara.",
    type: "guerra civil",
    scope: "interno",
    region: "Africa occidental",
    chronology: [
      { year: 2010, text: "La crisis poselectoral degenera en guerra abierta." },
      { year: 2011, text: "La captura de Gbagbo cierra la fase principal del conflicto." }
    ],
    related: ["Primera guerra civil marfilena", "Operacion Costa de Marfil"],
    participants: [
      { side: "Fuerzas de Gbagbo", members: ["fuerzas leales a Laurent Gbagbo"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Fuerzas de Ouattara y aliados", members: ["fuerzas republicanas", "partidarios de Alassane Ouattara"], organizations: ["ONU", "Francia (apoyo)"], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Victoria de las fuerzas de Ouattara.",
    consequences: "Cerro la larga crisis marfilena pero dejo heridas politicas y sociales profundas."
  },
  "Primera intifada saharaui": {
    cause: "Respondio a la ocupacion marroqui, a demandas de autodeterminacion y a la represion de activistas saharauis.",
    type: "levantamiento",
    scope: "subregional",
    region: "Sahara Occidental",
    chronology: [
      { year: 1999, text: "Comienzan protestas organizadas en ciudades del Sahara Occidental." },
      { year: 2005, text: "La llamada intifada de la independencia gana visibilidad internacional." }
    ],
    related: ["Guerra del Sahara Occidental", "Segunda intifada saharaui"],
    participants: [
      { side: "Activistas saharauis", members: ["poblacion saharaui y redes independentistas"], organizations: [], troops: "movilizacion civil", casualties: "moderadas" },
      { side: "Marruecos", members: ["Marruecos"], organizations: [], troops: "fuerzas policiales y militares", casualties: "limitadas" }
    ],
    outcome: "Sin cambio de estatus politico.",
    consequences: "Reinstalo la cuestion saharaui en la agenda internacional de derechos humanos."
  },
  "Segunda intifada saharaui": {
    cause: "Retomo la protesta saharaui en un contexto de frustracion por el bloqueo del proceso de autodeterminacion y renovada tension con Marruecos.",
    type: "levantamiento",
    scope: "subregional",
    region: "Sahara Occidental",
    chronology: [
      { year: 2010, text: "El campamento de Gdeim Izik se convierte en simbolo de la nueva protesta." },
      { year: 2020, text: "La tension vuelve a escalar con el fin del alto el fuego en Guerguerat." }
    ],
    related: ["Primera intifada saharaui", "Guerra del Sahara Occidental"],
    participants: [
      { side: "Activistas saharauis", members: ["poblacion saharaui", "Frente Polisario en el plano politico"], organizations: [], troops: "movilizacion civil", casualties: "moderadas" },
      { side: "Marruecos", members: ["Marruecos"], organizations: [], troops: "fuerzas policiales y militares", casualties: "limitadas" }
    ],
    outcome: "Persistencia del conflicto sin resolucion final.",
    consequences: "Conecto la protesta civil con la renovacion del enfrentamiento politico y militar."
  }
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Anti-piracy measures en Somalia": EXTRA_CONFLICT_DETAIL_OVERRIDES["Medidas antipirateria en Somalia"],
  "April 2009 raid off Somalia": EXTRA_CONFLICT_DETAIL_OVERRIDES["Incursion de abril de 2009 frente a Somalia"],
  "Ethiopian Civil War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra civil etiope"],
  "Ethiopian-Somali border conflict": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto fronterizo etiope-somali"],
  "First Burundi War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Primera guerra de Burundi"],
  "First Chad (FROLINAT) Rebellion": EXTRA_CONFLICT_DETAIL_OVERRIDES["Primera rebelion de Chad (FROLINAT)"],
  "First Rwanda War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Primera guerra de Ruanda"],
  "Second Rwanda War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Segunda guerra de Ruanda"],
  "Third Rwanda War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Tercera guerra de Ruanda"],
  "First Uganda War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Primera guerra de Uganda"],
  "Republic of the Congo Civil War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra civil de la Republica del Congo"],
  "Somaliland War of Independence": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra de Independencia de Somalilandia"],
  "Somaliland War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra de Somalilandia"],
  "Eritrean-Ethiopian War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra entre Etiopia y Eritrea"],
  "Grebo-Liberian War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra grebo-liberiana"],
  "Moroccan invasion of Spanish Sahara": EXTRA_CONFLICT_DETAIL_OVERRIDES["Invasion marroqui del Sahara espanol"],
  "Operation Ivory Coast": EXTRA_CONFLICT_DETAIL_OVERRIDES["Operacion Costa de Marfil"],
  "First Ivorian Civil War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Primera guerra civil marfilena"],
  "Second Ivorian Civil War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Segunda guerra civil marfilena"],
  "Second Liberia War": EXTRA_CONFLICT_DETAIL_OVERRIDES["Segunda guerra liberiana"],
  "First Sahrawi Intifada": EXTRA_CONFLICT_DETAIL_OVERRIDES["Primera intifada saharaui"],
  "Second Sahrawi Intifada": EXTRA_CONFLICT_DETAIL_OVERRIDES["Segunda intifada saharaui"]
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Batalla de Arras": {
    cause: "Fue lanzada por los Aliados para desgastar al ejercito aleman, aliviar la presion sobre otros sectores del frente y recuperar posiciones clave en Artois.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1917, text: "Tropas britanicas, canadienses y aliadas atacan alrededor de Arras con fuerte apoyo artillero." },
      { year: 1917, text: "Los avances iniciales no se sostienen y la batalla degenera en una nueva guerra de desgaste." }
    ],
    related: ["Primera Guerra Mundial", "Batalla de la Cresta de Vimy", "Batalla de Scarpe"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Canada", "Australia", "Nueva Zelanda y otros"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Ganancias tacticas aliadas sin ruptura decisiva del frente.",
    consequences: "Confirmo el enorme costo humano de las ofensivas del frente occidental y abrio acciones subordinadas como Vimy y Scarpe."
  },
  "Batalla de Cambrai": {
    cause: "Busco romper el sistema defensivo aleman con el uso concentrado de tanques, artilleria y sorpresa operativa.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1917, text: "Las fuerzas britanicas lanzan un ataque sorpresa con tanques cerca de Cambrai." },
      { year: 1917, text: "El contraataque aleman recupera parte del terreno y estabiliza la situacion." }
    ],
    related: ["Primera Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Reino Unido"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Resultado indeciso con gran valor tactico y doctrinal.",
    consequences: "Mostro el potencial del empleo masivo de tanques y de la combinacion de armas modernas."
  },
  "Batalla de Jutlandia": {
    cause: "Se produjo por el intento aleman de debilitar a la Grand Fleet britanica y alterar el control naval del Mar del Norte.",
    type: "batalla naval",
    scope: "regional",
    region: "Mar del Norte",
    chronology: [
      { year: 1916, text: "Las principales flotas de superficie britanica y alemana chocan frente a Jutlandia." },
      { year: 1916, text: "Pese a mayores perdidas britanicas en buques, Alemania no logra quebrar el bloqueo naval." }
    ],
    related: ["Primera Guerra Mundial"],
    participants: [
      { side: "Reino Unido", members: ["Reino Unido"], organizations: [], troops: "Grand Fleet", casualties: "elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "Hochseeflotte", casualties: "elevadas" }
    ],
    outcome: "Victoria estrategica britanica sin aniquilacion de la flota alemana.",
    consequences: "Consolido la superioridad naval britanica y empujo a Alemania hacia la guerra submarina irrestricta."
  },
  "Batalla de la Cresta de Vimy": {
    cause: "Formo parte de la ofensiva de Arras para capturar una posicion dominante fuertemente defendida por Alemania.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1917, text: "El Cuerpo Canadiense ataca la cresta con preparacion artillera masiva y tacticas coordinadas." },
      { year: 1917, text: "La posicion cae y se consolida una de las victorias aliadas mas simbolicas del frente." }
    ],
    related: ["Primera Guerra Mundial", "Batalla de Arras"],
    participants: [
      { side: "Aliados", members: ["Canada", "Reino Unido"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Se volvio un hito central de la memoria militar canadiense y mejoro la posicion aliada local."
  },
  "Batalla de Messines": {
    cause: "Se planeo para eliminar el saliente aleman al sur de Ypres y preparar ofensivas posteriores en Flandes.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1917, text: "Minas gigantescas detonan bajo posiciones alemanas al inicio del ataque aliado." },
      { year: 1917, text: "Los Aliados capturan el terreno elevado y reducen el saliente." }
    ],
    related: ["Primera Guerra Mundial", "Primera batalla de Ypres"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Australia", "Nueva Zelanda e Imperio britanico"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada de alcance tactico.",
    consequences: "Preparo el terreno para las ofensivas de Flandes, aunque sin cambiar la guerra de desgaste."
  },
  "Batalla de Meuse": {
    cause: "Fue parte de la ofensiva final aliada para quebrar al ejercito aleman en el tramo decisivo de 1918.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1918, text: "Fuerzas estadounidenses y francesas atacan entre el Mosa y Argonne." },
      { year: 1918, text: "La ofensiva presiona al ejercito aleman hasta el armisticio de noviembre." }
    ],
    related: ["Primera Guerra Mundial", "Batalla de Picardy"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos", "Francia y aliados"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria aliada en la ofensiva final de 1918.",
    consequences: "Acelero el colapso militar aleman y la firma del armisticio."
  },
  "Batalla de Picardy": {
    cause: "Corresponde a la contraofensiva aliada de 1918 destinada a explotar el agotamiento aleman tras sus ofensivas de primavera.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1918, text: "La ofensiva aliada en Picardia recupera la iniciativa estrategica." },
      { year: 1918, text: "El frente aleman comienza a retroceder de forma sostenida." }
    ],
    related: ["Primera Guerra Mundial", "Batalla de Amiens", "Batalla de Meuse"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Francia", "Australia", "Canada y otros"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "centenares de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Integro la secuencia de derrotas alemanas conocida como la Ofensiva de los Cien Dias."
  },
  "Batalla de Scarpe": {
    cause: "Fue una de las acciones asociadas a la ofensiva de Arras para ampliar la penetracion aliada en Artois.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1917, text: "Fuerzas britanicas atacan posiciones alemanas a lo largo del rio Scarpe." },
      { year: 1917, text: "El combate produce avances limitados a un costo muy alto." }
    ],
    related: ["Primera Guerra Mundial", "Batalla de Arras"],
    participants: [
      { side: "Aliados", members: ["Reino Unido"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Ganancias tacticas limitadas de los Aliados.",
    consequences: "Reflejo el caracter incremental y extremadamente costoso de la ofensiva de Arras."
  },
  "Batalla de Vittorio Veneto": {
    cause: "Fue el golpe final aliado contra Austria-Hungria para quebrar su capacidad militar en el frente italiano.",
    type: "batalla",
    scope: "regional",
    region: "Frente italiano",
    chronology: [
      { year: 1918, text: "Italia y sus aliados cruzan el Piave y lanzan la ofensiva decisiva." },
      { year: 1918, text: "El ejercito austrohungaro se desintegra y el imperio entra en colapso." }
    ],
    related: ["Primera Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Italia", "Reino Unido", "Francia", "Estados Unidos"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Potencias Centrales", members: ["Austria-Hungria"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria decisiva aliada.",
    consequences: "Provoco la salida austrohungara de la guerra y acelero el derrumbe del imperio."
  },
  "Primera batalla de Ypres": {
    cause: "Se produjo en la carrera hacia el mar, con ambos bandos intentando controlar accesos clave en Flandes.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1914, text: "Alemanes y Aliados chocan alrededor de Ypres durante la carrera hacia el mar." },
      { year: 1914, text: "La ciudad resiste pero el frente queda fijado en Flandes." }
    ],
    related: ["Primera Guerra Mundial", "Batalla de Messines"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Francia", "Belgica"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Freno del avance aleman y fijacion del frente.",
    consequences: "Convirtio Flandes en uno de los sectores mas sangrientos de toda la guerra."
  },
  "Segunda batalla de Somme": {
    cause: "Fue parte de la Ofensiva de los Cien Dias para empujar a las fuerzas alemanas hacia una retirada general.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1918, text: "Los Aliados relanzan operaciones en la zona del Somme tras Amiens." },
      { year: 1918, text: "Las fuerzas alemanas retroceden mientras el frente occidental se derrumba gradualmente." }
    ],
    related: ["Primera Guerra Mundial", "Batalla de Amiens", "Batalla de Picardy"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Australia", "Canada", "Francia y otros"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "centenares de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada.",
    consequences: "Amplio la retirada alemana en 1918 y profundizo la crisis militar de las Potencias Centrales."
  },
  "Segunda batalla del Marne": {
    cause: "Fue la ultima gran ofensiva alemana en el oeste, destinada a forzar una decision antes del pleno despliegue aliado y estadounidense.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1918, text: "Alemania ataca en la region del Marne buscando dividir a los Aliados." },
      { year: 1918, text: "El contraataque franco-estadounidense y aliado revierte la ofensiva." }
    ],
    related: ["Primera Guerra Mundial", "Batalla de Picardy"],
    participants: [
      { side: "Aliados", members: ["Francia", "Estados Unidos", "Reino Unido", "Italia y otros"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria aliada y fracaso definitivo de la ofensiva alemana.",
    consequences: "Marco el giro estrategico irreversible a favor de los Aliados en 1918."
  },
  "Tercera batalla de Aisne": {
    cause: "Se inserto en la ofensiva alemana de primavera de 1918, buscando abrir el frente y acercarse a Paris.",
    type: "batalla",
    scope: "regional",
    region: "Frente occidental",
    chronology: [
      { year: 1918, text: "Alemania rompe temporalmente el frente aliado en el Aisne." },
      { year: 1918, text: "El impulso ofensivo se agota y los Aliados estabilizan la situacion." }
    ],
    related: ["Primera Guerra Mundial", "Segunda batalla del Marne"],
    participants: [
      { side: "Imperio aleman", members: ["Imperio aleman"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Aliados", members: ["Francia", "Reino Unido", "Estados Unidos y aliados"], organizations: [], troops: "centenares de miles", casualties: "elevadas" }
    ],
    outcome: "Exito tactico aleman sin decision estrategica.",
    consequences: "Acerco a Paris temporalmente, pero contribuyo al desgaste final del ejercito aleman."
  }
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Invasion rusa de Ucrania de 2022": {
    cause: "Se desato por la invasion rusa a gran escala de Ucrania tras años de confrontacion desde 2014 y una disputa abierta sobre seguridad europea, soberania y orientacion geopolitica ucraniana.",
    type: "guerra interestatal",
    scope: "internacional",
    region: "Europa oriental",
    chronology: [
      { year: 2022, text: "Rusia invade Ucrania desde varios ejes y amplifica la guerra abierta iniciada en 2014." },
      { year: 2022, text: "Fracasa la toma rapida de Kiev y el conflicto deriva en una guerra prolongada de gran escala." }
    ],
    related: ["Guerra rusoucraniana", "Contraofensiva del oblast de Jarkov de 2022"],
    participants: [
      { side: "Rusia", members: ["Rusia"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Ucrania y apoyos", members: ["Ucrania"], organizations: ["OTAN y UE como apoyo indirecto"], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto en curso sin resolucion definitiva.",
    consequences: "Reordeno la seguridad europea, disparo sanciones y consolido una guerra de desgaste a gran escala."
  },
  "Ofensiva de Sirte de 2016": {
    cause: "Fue lanzada para expulsar al Estado Islamico de uno de sus principales bastiones en Libia.",
    type: "ofensiva",
    scope: "regional",
    region: "Libia",
    chronology: [
      { year: 2016, text: "Fuerzas ligadas al Gobierno de Acuerdo Nacional atacan Sirte con apoyo aereo estadounidense." },
      { year: 2016, text: "El Estado Islamico pierde el control urbano de la ciudad." }
    ],
    related: ["Guerra civil libia", "Estado Islamico"],
    participants: [
      { side: "Gobierno libio y aliados", members: ["fuerzas de Misrata", "Gobierno de Acuerdo Nacional"], organizations: ["Estados Unidos (apoyo aereo)"], troops: "miles", casualties: "elevadas" },
      { side: "Estado Islamico", members: ["Estado Islamico en Libia"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria de las fuerzas anti-ISIS.",
    consequences: "Redujo el control territorial del Estado Islamico en Libia pero no estabilizo el pais."
  },
  "Ofensiva de Alepo de abril de 2016": {
    cause: "Se enmarco en la pugna por el control de Alepo durante la guerra civil siria y la ruptura de treguas parciales.",
    type: "ofensiva",
    scope: "regional",
    region: "Siria",
    chronology: [
      { year: 2016, text: "Se reanudan ataques intensos en torno a Alepo tras el deterioro del cese del fuego." },
      { year: 2016, text: "La ciudad vuelve a convertirse en eje decisivo del conflicto sirio." }
    ],
    related: ["Guerra civil siria"],
    participants: [
      { side: "Gobierno sirio y aliados", members: ["Siria", "Rusia", "Iran y milicias asociadas"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Rebeldes", members: ["grupos insurgentes sirios e islamistas"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Escalada sin resolucion inmediata en abril.",
    consequences: "Profundizo la destruccion de Alepo y preparo ofensivas posteriores mas decisivas."
  },
  "Batalla de Al Fao de 2003": {
    cause: "Formo parte de la invasion de Irak para asegurar la peninsula de Al Faw y la infraestructura energetica costera.",
    type: "batalla",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 2003, text: "Fuerzas britanicas y de la coalicion atacan la peninsula de Al Faw al inicio de la invasion." },
      { year: 2003, text: "La zona queda asegurada rapidamente." }
    ],
    related: ["Invasion de Irak de 2003", "Guerra de Irak (2003-2011)"],
    participants: [
      { side: "Coalicion", members: ["Reino Unido", "Estados Unidos y aliados"], organizations: [], troops: "miles", casualties: "moderadas" },
      { side: "Irak", members: ["Irak"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Victoria de la coalicion.",
    consequences: "Aseguro objetivos estrategicos al sur de Irak y facilito la ofensiva inicial."
  },
  "Batalla de Bagdad de 2003": {
    cause: "Fue la ofensiva decisiva de la coalicion para derribar al regimen de Saddam Hussein durante la invasion de Irak.",
    type: "batalla",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 2003, text: "Las fuerzas estadounidenses avanzan sobre Bagdad tras la campaña inicial." },
      { year: 2003, text: "La capital cae y el regimen de Saddam Hussein colapsa." }
    ],
    related: ["Invasion de Irak de 2003", "Guerra de Irak (2003-2011)"],
    participants: [
      { side: "Coalicion", members: ["Estados Unidos", "Reino Unido y aliados"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Irak", members: ["Irak"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria de la coalicion y caida de Bagdad.",
    consequences: "Abre la ocupacion de Irak y la posterior insurgencia prolongada."
  },
  "Batalla de Kerbala de 2003": {
    cause: "Se produjo en el avance de la coalicion hacia Bagdad durante la invasion inicial de Irak.",
    type: "batalla",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 2003, text: "Fuerzas de la coalicion combaten cerca de Kerbala para abrir el acceso a Bagdad." },
      { year: 2003, text: "Las defensas iraquies son superadas." }
    ],
    related: ["Invasion de Irak de 2003", "Batalla de Bagdad de 2003"],
    participants: [
      { side: "Coalicion", members: ["Estados Unidos y aliados"], organizations: [], troops: "miles", casualties: "moderadas" },
      { side: "Irak", members: ["Irak"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Victoria de la coalicion.",
    consequences: "Facilito el colapso de la defensa iraqui alrededor de Bagdad."
  },
  "Batalla de Mosul de 2004": {
    cause: "Se inserto en la insurgencia iraqui y en los intentos estadounidenses e iraquies de recuperar ciudades clave del norte del pais.",
    type: "batalla",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 2004, text: "Insurgentes y fuerzas de seguridad chocan por el control de Mosul." },
      { year: 2004, text: "La ciudad queda parcialmente estabilizada aunque la insurgencia persiste." }
    ],
    related: ["Guerra de Irak (2003-2011)", "Batalla de Mosul de 2016-2017"],
    participants: [
      { side: "Gobierno iraqui y aliados", members: ["Iraq", "Estados Unidos"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Insurgentes", members: ["insurgencias sunnies y yihadistas"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Control gubernamental incompleto y temporal.",
    consequences: "Mostro la fragilidad del orden postinvasion en el norte de Irak."
  },
  "Batalla de Mosul de 2016-2017": {
    cause: "Fue lanzada para expulsar al Estado Islamico de su principal bastion urbano en Irak.",
    type: "batalla",
    scope: "regional",
    region: "Mesopotamia",
    chronology: [
      { year: 2016, text: "Comienza la gran ofensiva para recuperar Mosul del Estado Islamico." },
      { year: 2017, text: "Las fuerzas iraquies retoman por completo la ciudad tras duros combates urbanos." }
    ],
    related: ["Guerra contra el Estado Islamico", "Guerra de Irak (2003-2011)"],
    participants: [
      { side: "Gobierno iraqui y aliados", members: ["Iraq", "milicias aliadas", "coalicion internacional"], organizations: ["Coalicion internacional contra ISIS"], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Estado Islamico", members: ["Estado Islamico"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria del gobierno iraqui y sus aliados.",
    consequences: "Destruyo el principal centro urbano de ISIS en Irak pero con un enorme costo humano y material."
  },
  "Batalla de Kandahar de 2021": {
    cause: "Se produjo en la ofensiva taliban final tras la retirada estadounidense de Afganistan.",
    type: "batalla",
    scope: "regional",
    region: "Afganistan",
    chronology: [
      { year: 2021, text: "Los talibanes cercan y asaltan Kandahar." },
      { year: 2021, text: "La ciudad cae y acelera el colapso del gobierno afgano." }
    ],
    related: ["Guerra de Afganistan", "Invasion de Afganistan de 2001"],
    participants: [
      { side: "Taliban", members: ["Taliban"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Gobierno afgano", members: ["Afganistan"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Victoria taliban.",
    consequences: "Contribuyo decisivamente a la reconquista taliban del pais."
  },
  "Batalla de Shusha de 2020": {
    cause: "Fue una batalla decisiva en la guerra de Nagorno-Karabaj de 2020 por el control de un punto estrategico y simbolico.",
    type: "batalla",
    scope: "regional",
    region: "Caucaso",
    chronology: [
      { year: 2020, text: "Fuerzas azerbaiyanas avanzan hacia Shusha durante la guerra." },
      { year: 2020, text: "La caida de la ciudad precipita el acuerdo de alto el fuego." }
    ],
    related: ["Guerra de Nagorno-Karabaj de 2020"],
    participants: [
      { side: "Azerbaiyan", members: ["Azerbaiyan"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Armenia y Artsaj", members: ["Armenia", "Artsaj"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Victoria azerbaiyana.",
    consequences: "Cambio el equilibrio de la guerra y fuerzo el armisticio."
  },
  "Combate en el valle del Galwan de 2020": {
    cause: "Respondio a la disputa fronteriza sino-india en Ladakh y a la militarizacion progresiva de la Linea de Control Real.",
    type: "choque fronterizo",
    scope: "subregional",
    region: "Himalaya",
    chronology: [
      { year: 2020, text: "Fuerzas de India y China chocan violentamente en el valle del Galwan." }
    ],
    related: ["Guerra chino-india"],
    participants: [
      { side: "India", members: ["India"], organizations: [], troops: "fuerzas de frontera", casualties: "elevadas para un choque localizado" },
      { side: "China", members: ["China"], organizations: [], troops: "fuerzas de frontera", casualties: "elevadas para un choque localizado" }
    ],
    outcome: "Sin cambio territorial formal con fuerte escalada militar posterior.",
    consequences: "Provoco la peor crisis sino-india en decadas."
  },
  "Contraofensiva del oblast de Jarkov de 2022": {
    cause: "Fue lanzada por Ucrania para explotar debilidades operativas rusas y recuperar terreno en el noreste.",
    type: "contraofensiva",
    scope: "regional",
    region: "Europa oriental",
    chronology: [
      { year: 2022, text: "Ucrania ejecuta una contraofensiva rapida en Jarkov." },
      { year: 2022, text: "Rusia pierde amplias zonas ocupadas en el noreste." }
    ],
    related: ["Guerra rusoucraniana", "Invasion rusa de Ucrania de 2022"],
    participants: [
      { side: "Ucrania", members: ["Ucrania"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Rusia", members: ["Rusia"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria operativa ucraniana.",
    consequences: "Cambio la dinamica del frente y reforzo la moral y la posicion internacional de Ucrania."
  },
  "Crisis anglofona de Camerun": {
    cause: "Surgio de reclamos politicos y culturales en las regiones anglofonas y de la represion estatal que transformo la protesta en insurgencia.",
    type: "insurgencia",
    scope: "interno",
    region: "Africa central",
    chronology: [
      { year: 2016, text: "Protestas de abogados y docentes escalan en las regiones anglofonas." },
      { year: 2017, text: "La crisis deriva en conflicto armado separatista." }
    ],
    related: ["Crisis de la Republica de Macedonia de 2001"],
    participants: [
      { side: "Estado camerunes", members: ["Camerun"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Separatistas", members: ["facciones ambazonias"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Conflicto en curso sin solucion politica definitiva.",
    consequences: "Genero desplazamiento masivo y una larga crisis humanitaria en el oeste de Camerun."
  },
  "Conflicto de la Republica de Macedonia de 2001": {
    cause: "Se debio a tensiones etnopoliticas entre el estado macedonio y sectores armados albaneses que reclamaban mayor reconocimiento y derechos.",
    type: "insurgencia",
    scope: "interno",
    region: "Balcanes",
    chronology: [
      { year: 2001, text: "El EAN intensifica ataques contra fuerzas estatales macedonias." },
      { year: 2001, text: "El Acuerdo de Ohrid desescala el conflicto." }
    ],
    related: ["Crisis de Aracinovo"],
    participants: [
      { side: "Estado macedonio", members: ["Republica de Macedonia"], organizations: [], troops: "miles", casualties: "moderadas" },
      { side: "Insurgentes albaneses", members: ["Ejercito de Liberacion Nacional"], organizations: [], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Acuerdo politico con reformas institucionales.",
    consequences: "Evito una guerra prolongada pero transformo la arquitectura politica del estado macedonio."
  },
  "Crisis de Puntlandia (2001-2003)": {
    cause: "Derivo de una disputa de liderazgo dentro de Puntlandia en medio de la fragmentacion somali.",
    type: "conflicto interno",
    scope: "subregional",
    region: "Cuerno de Africa",
    chronology: [
      { year: 2001, text: "Una disputa por la presidencia de Puntlandia deriva en enfrentamientos armados." },
      { year: 2003, text: "El conflicto pierde intensidad con una recomposicion politica regional." }
    ],
    related: ["Guerra civil somali (2006-2009)", "Guerra civil somali"],
    participants: [
      { side: "Facciones de Puntlandia", members: ["fuerzas leales a Abdullahi Yusuf", "fuerzas rivales"], organizations: [], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Reequilibrio politico sin resolver la fragmentacion somali.",
    consequences: "Mostro la autonomia conflictiva de Puntlandia dentro del espacio somali."
  },
  "Crisis del mar Rojo": {
    cause: "Escalo por ataques contra navegacion comercial vinculados a la guerra de Gaza y a la rivalidad regional en torno al eje Iran-Huties-Occidente.",
    type: "crisis regional",
    scope: "internacional",
    region: "Mar Rojo",
    chronology: [
      { year: 2023, text: "Los huties intensifican ataques contra buques en el mar Rojo." },
      { year: 2024, text: "Estados Unidos y aliados responden con ataques y despliegues navales." }
    ],
    related: ["Ataques de Estados Unidos en Yemen en 2025", "Conflicto entre Gaza e Israel"],
    participants: [
      { side: "Huties y aliados", members: ["movimiento huti", "Yemen"], organizations: [], troops: "misiles, drones y fuerzas irregulares", casualties: "variables" },
      { side: "Coaliciones navales y estados afectados", members: ["Estados Unidos", "Reino Unido y otros"], organizations: [], troops: "fuerzas navales y aereas", casualties: "limitadas" }
    ],
    outcome: "Crisis en curso con militarizacion del corredor maritimo.",
    consequences: "Disrumpio el comercio global y conecto directamente la guerra de Gaza con la seguridad maritima."
  },
  "Golpe de Estado guineano de 2021": {
    cause: "Se produjo por disputas internas en el poder guineano, desgaste del gobierno de Condé y tensiones politico-militares acumuladas.",
    type: "golpe de estado",
    scope: "interno",
    region: "Africa occidental",
    chronology: [
      { year: 2021, text: "Fuerzas especiales detienen al presidente Alpha Conde y toman el poder." }
    ],
    related: [],
    participants: [
      { side: "Golpistas", members: ["fuerzas especiales guineanas"], organizations: [], troops: "fuerzas limitadas", casualties: "reducidas" },
      { side: "Gobierno derrocado", members: ["Guinea"], organizations: [], troops: "fuerzas estatales", casualties: "reducidas" }
    ],
    outcome: "Derrocamiento del gobierno.",
    consequences: "Abre una transicion militar e incrementa la inestabilidad politica regional."
  },
  "Guerra civil somali (2006-2009)": {
    cause: "Se vinculo al ascenso de la Union de Tribunales Islamicos, la intervencion etiope y la reconfiguracion de la guerra civil somali.",
    type: "guerra civil",
    scope: "interno",
    region: "Cuerno de Africa",
    chronology: [
      { year: 2006, text: "Etiopia interviene en Somalia contra la Union de Tribunales Islamicos." },
      { year: 2007, text: "La insurgencia se reorganiza y radicaliza, con la emergencia de Al-Shabaab." },
      { year: 2009, text: "La retirada etiope no pone fin a la guerra abierta." }
    ],
    related: ["Guerra civil somali", "Crisis de Puntlandia (2001-2003)"],
    participants: [
      { side: "Gobierno somali y aliados", members: ["Somalia", "Etiopia", "AMISOM segun etapa"], organizations: ["UA"], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Islamistas e insurgentes", members: ["Union de Tribunales Islamicos", "Al-Shabaab y aliados"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto prolongado sin victoria decisiva.",
    consequences: "Consolido a Al-Shabaab como actor central del conflicto somali."
  },
  "Guerra de Osetia del Sur de 2008": {
    cause: "Estallo por la disputa entre Georgia, Osetia del Sur y Rusia en torno al control del territorio y la orientacion geopolitica georgiana.",
    type: "guerra interestatal",
    scope: "regional",
    region: "Caucaso",
    chronology: [
      { year: 2008, text: "Georgia intenta recuperar control sobre Osetia del Sur." },
      { year: 2008, text: "Rusia interviene masivamente y derrota a las fuerzas georgianas." }
    ],
    related: ["Enfrentamientos en Osetia del Sur de 2004"],
    participants: [
      { side: "Georgia", members: ["Georgia"], organizations: [], troops: "miles", casualties: "elevadas" },
      { side: "Rusia y aliados locales", members: ["Rusia", "Osetia del Sur", "Abjasia"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Victoria rusa y de las fuerzas separatistas.",
    consequences: "Consolido el control ruso sobre regiones separatistas y profundizo la fractura caucasica."
  },
  "Invasion de Afganistan de 2001": {
    cause: "Fue lanzada por Estados Unidos y aliados tras los atentados del 11 de septiembre para derrocar al regimen taliban y golpear a Al Qaeda.",
    type: "invasion",
    scope: "internacional",
    region: "Afganistan",
    chronology: [
      { year: 2001, text: "Comienzan bombardeos y ofensivas conjuntas con fuerzas afganas antitalibanes." },
      { year: 2001, text: "El regimen taliban pierde Kabul y otras ciudades clave." }
    ],
    related: ["Guerra de Afganistan", "Sublevacion en Herat de 2001"],
    participants: [
      { side: "Coalicion", members: ["Estados Unidos", "Reino Unido", "Alianza del Norte y aliados"], organizations: ["OTAN posteriormente"], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Taliban y Al Qaeda", members: ["Taliban", "Al Qaeda"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Derrocamiento inicial del regimen taliban.",
    consequences: "Abre una larga guerra que culmina con el retorno taliban en 2021."
  },
  "Invasion de Irak de 2003": {
    cause: "Se baso en acusaciones sobre armas de destruccion masiva y en la decision estadounidense de derrocar al regimen de Saddam Hussein.",
    type: "invasion",
    scope: "internacional",
    region: "Mesopotamia",
    chronology: [
      { year: 2003, text: "Estados Unidos y aliados lanzan la invasion de Irak." },
      { year: 2003, text: "El regimen de Saddam Hussein colapsa rapidamente." }
    ],
    related: ["Guerra de Irak (2003-2011)", "Batalla de Bagdad de 2003"],
    participants: [
      { side: "Coalicion", members: ["Estados Unidos", "Reino Unido", "Australia y aliados"], organizations: [], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Irak", members: ["Irak"], organizations: [], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria rapida de la coalicion y caida del regimen iraqui.",
    consequences: "Desencadeno ocupacion, insurgencia y una profunda desestabilizacion regional."
  },
  "Guerra de Irak (2003-2011)": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra de Irak"],
  "Rebelion de Boko Haram de 2009": {
    cause: "Se origino en la radicalizacion del movimiento Boko Haram y en su ruptura violenta con el estado nigeriano.",
    type: "insurgencia",
    scope: "interno",
    region: "Sahel y lago Chad",
    chronology: [
      { year: 2009, text: "La insurreccion de Boko Haram estalla abiertamente en Nigeria." },
      { year: 2014, text: "El conflicto se expande por la cuenca del lago Chad y adquiere escala regional." }
    ],
    related: ["Batalla de Dikwa de 2015"],
    participants: [
      { side: "Estados y milicias aliadas", members: ["Nigeria", "Chad", "Niger", "Camerun"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Boko Haram", members: ["Boko Haram", "facciones escindidas"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto persistente con debilitamiento parcial insurgente.",
    consequences: "Genero una crisis humanitaria masiva en el noreste de Nigeria y paises vecinos."
  },
  "Sublevacion en Herat de 2001": {
    cause: "Se inserto en la ofensiva contra el regimen taliban y en el avance de fuerzas opositoras afganas con apoyo externo.",
    type: "levantamiento",
    scope: "regional",
    region: "Afganistan",
    chronology: [
      { year: 2001, text: "Fuerzas antitalibanes y actores locales disputan Herat en el marco de la invasion." }
    ],
    related: ["Invasion de Afganistan de 2001", "Guerra de Afganistan"],
    participants: [
      { side: "Oposicion afgana y aliados", members: ["Alianza del Norte y actores locales"], organizations: [], troops: "miles", casualties: "moderadas" },
      { side: "Taliban", members: ["Taliban"], organizations: [], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Retroceso taliban local.",
    consequences: "Contribuyo al colapso inicial del control taliban en el oeste de Afganistan."
  }
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "2024 Beqaa Valley airstrikes": {
    cause: "Se enmarcaron en la escalada regional vinculada a la guerra de Gaza y al enfrentamiento entre Israel, Hezbola y actores aliados de Iran.",
    type: "bombardeo",
    scope: "regional",
    region: "Levante",
    chronology: [
      { year: 2024, text: "Ataques aereos golpean el valle de la Beqaa durante la escalada israelo-libanesa." }
    ],
    related: ["Conflicto entre Gaza e Israel", "Guerra del Libano de 2006"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "aviacion y misiles", casualties: "limitadas" },
      { side: "Hezbola y redes aliadas", members: ["Hezbola y actores asociados"], organizations: [], troops: "infraestructura y fuerzas irregulares", casualties: "elevadas" }
    ],
    outcome: "Escalada sin resolucion politica.",
    consequences: "Amplio el riesgo de guerra regional en la frontera israelo-libanesa."
  },
  "Conflicto entre Kirguistan y Tayikistan de 2021": {
    cause: "Se debio a disputas fronterizas, acceso a agua e infraestructura en enclaves y zonas mal delimitadas del valle de Fergana.",
    type: "conflicto fronterizo",
    scope: "subregional",
    region: "Asia central",
    chronology: [
      { year: 2021, text: "Combates intensos estallan en la frontera entre Kirguistan y Tayikistan." }
    ],
    related: [],
    participants: [
      { side: "Kirguistan", members: ["Kirguistan"], organizations: [], troops: "fuerzas fronterizas y regulares", casualties: "moderadas" },
      { side: "Tayikistan", members: ["Tayikistan"], organizations: [], troops: "fuerzas fronterizas y regulares", casualties: "moderadas" }
    ],
    outcome: "Alto el fuego fragil con disputas sin resolver.",
    consequences: "Demostro la vulnerabilidad estructural de las fronteras centroasiaticas."
  },
  "Conflicto turco-kurdo (1978-presente)": {
    cause: "Se origino en la disputa entre el estado turco y el PKK por autonomia, identidad kurda y control politico-territorial.",
    type: "insurgencia",
    scope: "interno",
    region: "Anatolia y norte de Mesopotamia",
    chronology: [
      { year: 1984, text: "El PKK inicia una insurgencia armada prolongada contra el estado turco." },
      { year: 2015, text: "Fracasa el proceso de paz y la violencia vuelve a intensificarse." }
    ],
    related: ["Guerra civil siria", "Guerra subsidiaria irano-turca"],
    participants: [
      { side: "Estado turco", members: ["Turquia"], organizations: [], troops: "decenas de miles", casualties: "muy elevadas" },
      { side: "Insurgencia kurda", members: ["PKK y redes asociadas"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Conflicto persistente sin solucion final.",
    consequences: "Regionalizo la cuestion kurda y conecto el conflicto con Siria e Irak."
  },
  "Crisis de Timor Oriental": {
    cause: "Respondio a tensiones politico-militares internas en el joven estado timorense y al colapso parcial del orden de seguridad en 2006.",
    type: "crisis politica y militar",
    scope: "interno",
    region: "Sudeste asiatico",
    chronology: [
      { year: 2006, text: "Disputas en las fuerzas armadas y protestas derivan en violencia generalizada." },
      { year: 2006, text: "Intervienen fuerzas internacionales para restaurar el orden." }
    ],
    related: [],
    participants: [
      { side: "Estado timorense y apoyos", members: ["Timor Oriental", "Australia y fuerzas internacionales"], organizations: [], troops: "miles", casualties: "moderadas" },
      { side: "Facciones internas", members: ["militares disidentes y grupos armados"], organizations: [], troops: "miles", casualties: "moderadas" }
    ],
    outcome: "Desescalada con intervencion internacional.",
    consequences: "Puso en evidencia la fragilidad del nuevo estado timorense."
  },
  "Crisis politica malgache de 2009": {
    cause: "Se produjo por la confrontacion entre el presidente Ravalomanana y la oposicion liderada por Andry Rajoelina.",
    type: "crisis politica",
    scope: "interno",
    region: "Africa austral",
    chronology: [
      { year: 2009, text: "La disputa politica deriva en movilizaciones y quiebre institucional." },
      { year: 2009, text: "Rajoelina asume el poder en una transicion cuestionada." }
    ],
    related: [],
    participants: [
      { side: "Gobierno y apoyos", members: ["Madagascar"], organizations: [], troops: "fuerzas estatales", casualties: "moderadas" },
      { side: "Oposicion", members: ["oposicion liderada por Rajoelina"], organizations: [], troops: "movilizacion civil y apoyos militares", casualties: "moderadas" }
    ],
    outcome: "Cambio de poder no consensuado.",
    consequences: "Abre una larga crisis de legitimidad y aislamiento diplomático temporal."
  },
  "Crisis separatista de las Comoras": {
    cause: "Se debio a impulsos separatistas en Anjouan y otras islas en el marco de la debilidad estatal comorense.",
    type: "crisis secesionista",
    scope: "interno",
    region: "Oceano Indico",
    chronology: [
      { year: 1997, text: "Anjouan impulsa su separacion y se abre una crisis prolongada." },
      { year: 2008, text: "Una intervencion militar restablece el control federal." }
    ],
    related: [],
    participants: [
      { side: "Union de las Comoras", members: ["Comoras"], organizations: ["UA"], troops: "fuerzas limitadas", casualties: "moderadas" },
      { side: "Separatistas", members: ["facciones de Anjouan"], organizations: [], troops: "fuerzas limitadas", casualties: "moderadas" }
    ],
    outcome: "Restablecimiento del control estatal.",
    consequences: "Evidencio la fragilidad estructural del estado insular."
  },
  "Crisis togolesa de 2005": {
    cause: "Se desato por la sucesion de poder tras la muerte de Gnassingbe Eyadema y la fuerte contestacion electoral interna.",
    type: "crisis politica",
    scope: "interno",
    region: "Africa occidental",
    chronology: [
      { year: 2005, text: "La sucesion presidencial provoca disturbios y represion." }
    ],
    related: [],
    participants: [
      { side: "Poder estatal", members: ["Togo"], organizations: [], troops: "fuerzas estatales", casualties: "elevadas" },
      { side: "Oposicion", members: ["oposicion togolesa"], organizations: [], troops: "movilizacion civil", casualties: "elevadas" }
    ],
    outcome: "Continuidad del poder gobernante con alta contestacion.",
    consequences: "Profundizo la crisis de legitimidad del sistema politico togoles."
  },
  "Intento de golpe en Guinea Ecuatorial de 2004": {
    cause: "Fue un intento de derrocar al gobierno de Obiang en un contexto de redes mercenarias y rivalidad por control politico y recursos.",
    type: "intento de golpe",
    scope: "interno",
    region: "Africa central",
    chronology: [
      { year: 2004, text: "Se desarticula un complot internacional para derrocar al gobierno ecuatoguineano." }
    ],
    related: [],
    participants: [
      { side: "Gobierno de Guinea Ecuatorial", members: ["Guinea Ecuatorial"], organizations: [], troops: "fuerzas estatales", casualties: "reducidas" },
      { side: "Conspiradores", members: ["mercenarios y actores politicos exiliados"], organizations: [], troops: "grupo reducido", casualties: "reducidas" }
    ],
    outcome: "Fracaso del golpe.",
    consequences: "Reforzo la securitizacion del regimen y su narrativa de amenaza externa."
  },
  "Ofensiva de Alepo de 2013": {
    cause: "Formo parte de la lucha por el control de Alepo durante la guerra civil siria y la disputa por corredores urbanos y logisticos.",
    type: "ofensiva",
    scope: "regional",
    region: "Siria",
    chronology: [
      { year: 2013, text: "Gobierno sirio, rebeldes y milicias asociadas intensifican la lucha por Alepo." }
    ],
    related: ["Guerra civil siria", "Ofensiva de Alepo de abril de 2016"],
    participants: [
      { side: "Gobierno sirio y aliados", members: ["Siria y aliados"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Rebeldes", members: ["grupos insurgentes sirios"], organizations: [], troops: "decenas de miles", casualties: "elevadas" }
    ],
    outcome: "Combate prolongado sin definicion inmediata.",
    consequences: "Acentuo la destruccion urbana y la centralidad de Alepo en la guerra."
  },
  "Ofensiva de Amhara de 2024": {
    cause: "Se inserto en las tensiones entre el gobierno etiope y milicias amharas tras la guerra de Tigray y la reconfiguracion del poder regional.",
    type: "ofensiva",
    scope: "interno",
    region: "Etiopia",
    chronology: [
      { year: 2024, text: "Las operaciones en Amhara se intensifican entre el estado etiope y milicias locales." }
    ],
    related: ["Guerra civil etiope"],
    participants: [
      { side: "Estado etiope", members: ["Etiopia"], organizations: [], troops: "decenas de miles", casualties: "elevadas" },
      { side: "Milicias amharas", members: ["Fano y actores armados asociados"], organizations: [], troops: "miles", casualties: "elevadas" }
    ],
    outcome: "Conflicto abierto sin resolucion definitiva.",
    consequences: "Profundizo la fragmentacion etiope despues de Tigray."
  },
  "Segunda batalla de Sirte": {
    cause: "Fue la fase culminante de la campaña para desalojar al Estado Islamico de Sirte.",
    type: "batalla",
    scope: "regional",
    region: "Libia",
    chronology: [
      { year: 2016, text: "La ofensiva final sobre Sirte concentra el combate urbano mas intenso contra ISIS en Libia." }
    ],
    related: ["Ofensiva de Sirte de 2016"],
    participants: [
      { side: "Fuerzas libias anti-ISIS", members: ["fuerzas de Misrata y aliados"], organizations: ["Estados Unidos (apoyo aereo)"], troops: "miles", casualties: "elevadas" },
      { side: "Estado Islamico", members: ["Estado Islamico en Libia"], organizations: [], troops: "miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria anti-ISIS.",
    consequences: "Completo la perdida del gran bastion urbano de ISIS en Libia."
  }
});

Object.assign(EXTRA_CONFLICT_DETAIL_OVERRIDES, {
  "Batalla de Francia": {
    cause: "Se produjo tras la ofensiva alemana sobre Europa occidental para derrotar rapidamente a Francia y expulsar a Reino Unido del continente.",
    type: "batalla",
    scope: "global",
    region: "Europa occidental",
    chronology: [
      { year: 1940, text: "Alemania invade Belgica, Paises Bajos, Luxemburgo y Francia." },
      { year: 1940, text: "El avance por las Ardenas rompe el frente aliado y aisla fuerzas en Dunkerque." },
      { year: 1940, text: "Francia firma el armisticio y se establece el regimen de Vichy." }
    ],
    related: ["Segunda Guerra Mundial", "Desembarco de Normandia"],
    participants: [
      { side: "Eje", members: ["Alemania", "Italia"], organizations: ["Potencias del Eje"], troops: "millones movilizados", casualties: "elevadas" },
      { side: "Aliados", members: ["Francia", "Reino Unido", "Belgica", "Paises Bajos", "Polonia", "Luxemburgo"], organizations: ["Aliados"], troops: "millones movilizados", casualties: "muy elevadas" }
    ],
    outcome: "Victoria decisiva del Eje y colapso militar frances.",
    consequences: "Alemania paso a dominar gran parte de Europa occidental y Reino Unido quedo como principal enemigo activo del Eje en el continente."
  },
  "Desembarco de Normandia": {
    cause: "Los Aliados lanzaron la operacion para abrir un gran frente en Europa occidental y acelerar la derrota de Alemania.",
    type: "desembarco",
    scope: "global",
    region: "Normandia",
    chronology: [
      { year: 1944, text: "Fuerzas aliadas desembarcan en las playas de Normandia el 6 de junio." },
      { year: 1944, text: "Se consolidan cabezas de playa y se expanden los combates hacia el interior." },
      { year: 1944, text: "La campaña de Normandia rompe el frente aleman en Francia." }
    ],
    related: ["Batalla de Normandia", "Segunda Guerra Mundial", "Batalla de Francia"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos", "Reino Unido", "Canada", "Francia Libre y otros aliados"], organizations: ["Aliados"], troops: "centenares de miles", casualties: "elevadas" },
      { side: "Eje", members: ["Alemania"], organizations: ["Potencias del Eje"], troops: "centenares de miles", casualties: "elevadas" }
    ],
    outcome: "Victoria aliada y apertura definitiva del frente occidental.",
    consequences: "Inicio la liberacion de Francia y acelero el colapso militar aleman en Europa occidental."
  },
  "Batalla de Normandia": {
    cause: "Desarrollo posterior al Dia D para consolidar la invasion aliada, destruir fuerzas alemanas en Francia y abrir ruta hacia Paris.",
    type: "campana",
    scope: "global",
    region: "Normandia",
    chronology: [
      { year: 1944, text: "Tras el desembarco, los Aliados combaten por Caen, Saint-Lo y el bocage normando." },
      { year: 1944, text: "La operacion Cobra y el cerco de Falaise precipitan la retirada alemana." },
      { year: 1944, text: "La ruptura de Normandia permite la liberacion de Paris." }
    ],
    related: ["Desembarco de Normandia", "Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados", members: ["Estados Unidos", "Reino Unido", "Canada", "Francia Libre y otros aliados"], organizations: ["Aliados"], troops: "centenares de miles", casualties: "muy elevadas" },
      { side: "Eje", members: ["Alemania"], organizations: ["Potencias del Eje"], troops: "centenares de miles", casualties: "muy elevadas" }
    ],
    outcome: "Victoria aliada decisiva.",
    consequences: "Destruyo gran parte del poder aleman en Francia y abrio la ruta hacia la liberacion de Europa occidental."
  },
  "Aleppo Offensive (April 2016)": EXTRA_CONFLICT_DETAIL_OVERRIDES["Ofensiva de Alepo de abril de 2016"],
  "Batalla de Boulikessi (2025)": { cause: "Se vinculo a la violencia yihadista en el Sahel central.", type: "batalla", scope: "subregional", region: "Sahel", chronology: [{ year: 2025, text: "Combates en Boulikessi entre fuerzas estatales y actores armados." }], related: [], participants: [{ side: "Estado y aliados", members: ["Mali y/o aliados regionales"], organizations: [], troops: "fuerzas limitadas", casualties: "moderadas" }, { side: "Insurgentes", members: ["grupos yihadistas"], organizations: [], troops: "miles", casualties: "moderadas" }], outcome: "Resultado disputado.", consequences: "Reflejo la persistente inestabilidad saheliana." },
  "Batalla de Dikwa (2 mar 2015)": { cause: "Formo parte de la lucha contra Boko Haram en el noreste de Nigeria.", type: "batalla", scope: "subregional", region: "Lago Chad", chronology: [{ year: 2015, text: "Dikwa se vuelve escenario de combates entre Boko Haram y fuerzas estatales." }], related: ["Rebelion de Boko Haram de 2009"], participants: [{ side: "Estados y aliados", members: ["Nigeria y aliados"], organizations: [], troops: "fuerzas limitadas", casualties: "moderadas" }, { side: "Boko Haram", members: ["Boko Haram"], organizations: [], troops: "miles", casualties: "moderadas" }], outcome: "Control variable segun la fase del combate.", consequences: "Mostro la volatilidad del frente noreste nigeriano." },
  "Batalla de Kandahar (2021)": EXTRA_CONFLICT_DETAIL_OVERRIDES["Batalla de Kandahar de 2021"],
  "Batalla de Mosul (2004)": EXTRA_CONFLICT_DETAIL_OVERRIDES["Batalla de Mosul de 2004"],
  "Batalla de Mosul (2016-2017)": EXTRA_CONFLICT_DETAIL_OVERRIDES["Batalla de Mosul de 2016-2017"],
  "Batalla de Ras Kamboni (2024)": { cause: "Se inserto en operaciones contra Al-Shabaab en el espacio somali.", type: "batalla", scope: "subregional", region: "Cuerno de Africa", chronology: [{ year: 2024, text: "Combates en torno a Ras Kamboni reactivan el frente costero somali." }], related: ["Guerra civil somali", "Guerra civil somali (2006-2009)"], participants: [{ side: "Gobierno y aliados", members: ["Somalia y aliados"], organizations: [], troops: "miles", casualties: "moderadas" }, { side: "Insurgentes", members: ["Al-Shabaab u otros actores armados"], organizations: [], troops: "miles", casualties: "moderadas" }], outcome: "Resultado local disputado.", consequences: "Subrayo la persistencia de la insurgencia en el litoral somali." },
  "Batalla de Shusha (2020)": EXTRA_CONFLICT_DETAIL_OVERRIDES["Batalla de Shusha de 2020"],
  "Batalla de Tinzawatène (2024)": { cause: "Entrada reciente del corpus vinculada a violencia saheliana y enfrentamientos transfronterizos.", type: "batalla", scope: "subregional", region: "Sahel", chronology: [{ year: 2024, text: "Se registran combates en la zona de Tinzawatene." }], related: [], participants: [{ side: "Fuerzas estatales o aliadas", members: ["actores regionales segun etapa"], organizations: [], troops: "fuerzas limitadas", casualties: "moderadas" }, { side: "Insurgentes o grupos armados", members: ["grupos armados sahelianos"], organizations: [], troops: "miles", casualties: "moderadas" }], outcome: "Indeterminado.", consequences: "Reflejo la volatilidad del espacio fronterizo saheliano." },
  "Campaña militar estadounidense contra los cárteles de 2025": { cause: "Entrada del corpus con escenario hipotetico o no consolidado en fuentes estables.", type: "escalada militar", scope: "regional", region: "America del Norte", chronology: [{ year: 2025, text: "El corpus registra una escalada hipotetica o en desarrollo contra redes criminales transnacionales." }], related: [], participants: [{ side: "Estados Unidos", members: ["Estados Unidos"], organizations: [], troops: "fuerzas convencionales y especiales", casualties: "indeterminadas" }, { side: "Carteles", members: ["organizaciones criminales"], organizations: [], troops: "redes irregulares", casualties: "indeterminadas" }], outcome: "No consolidado.", consequences: "Se mantiene como entrada de baja confianza hasta confirmacion adicional." },
  "Conflicto entre Camboya y Tailandia de 2025": { cause: "Corresponde a una entrada de frontera contemporanea con baja estructuracion en el corpus.", type: "conflicto fronterizo", scope: "subregional", region: "Sudeste asiatico", chronology: [{ year: 2025, text: "El corpus registra tension militar entre Camboya y Tailandia." }], related: ["Crisis fronteriza camboyano-tailandesa de 2025"], participants: [{ side: "Camboya", members: ["Camboya"], organizations: [], troops: "fuerzas fronterizas", casualties: "indeterminadas" }, { side: "Tailandia", members: ["Tailandia"], organizations: [], troops: "fuerzas fronterizas", casualties: "indeterminadas" }], outcome: "Indeterminado.", consequences: "Mantener como conflicto de baja confianza hasta mayor confirmacion." },
  "Crisis fronteriza camboyano-tailandesa de 2025": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto entre Camboya y Tailandia de 2025"],
  "Conflicto entre Kirguistán y Tayikistán de 2021": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto entre Kirguistan y Tayikistan de 2021"],
  "Crisis constitucional de Fiyi": { cause: "Se relaciono con disputas sobre representacion politica, etnicidad y rol militar en Fiyi.", type: "crisis politica", scope: "interno", region: "Pacifico", chronology: [{ year: 2000, text: "Golpes y reordenamientos institucionales abren una crisis constitucional." }, { year: 2006, text: "Nuevas intervenciones militares profundizan la crisis." }], related: [], participants: [{ side: "Estado y militares", members: ["Fiyi"], organizations: [], troops: "fuerzas limitadas", casualties: "reducidas" }, { side: "Oposicion politica", members: ["actores politicos y comunitarios"], organizations: [], troops: "movilizacion politica", casualties: "reducidas" }], outcome: "Larga inestabilidad institucional.", consequences: "Transformo el sistema politico fijiano durante años." },
  "Crisis de Aračinovo": EXTRA_CONFLICT_DETAIL_OVERRIDES["Conflicto de la Republica de Macedonia de 2001"],
  "Guerra afgano-pakistaní de 2026": { cause: "Entrada de muy baja confianza o proyeccion futura dentro del corpus.", type: "conflicto fronterizo", scope: "regional", region: "Asia meridional", chronology: [{ year: 2026, text: "El corpus registra una escalada afgano-pakistani no consolidada en fuentes estables." }], related: ["Incidentes fronterizos en Waziristan del Norte de 2025"], participants: [{ side: "Afganistan", members: ["Afganistan"], organizations: [], troops: "indeterminadas", casualties: "indeterminadas" }, { side: "Pakistan", members: ["Pakistan"], organizations: [], troops: "indeterminadas", casualties: "indeterminadas" }], outcome: "No consolidado.", consequences: "Mantener como registro de baja confianza hasta validacion adicional." },
  "Guerra del Líbano de 2026": { cause: "Entrada futura o no consolidada del corpus en el contexto de la escalada regional israelo-libanesa.", type: "guerra interestatal o transfronteriza", scope: "regional", region: "Levante", chronology: [{ year: 2026, text: "El corpus marca una posible guerra abierta en el frente libanes." }], related: ["2024 Beqaa Valley airstrikes", "Conflicto entre Gaza e Israel"], participants: [{ side: "Israel y aliados", members: ["Israel"], organizations: [], troops: "indeterminadas", casualties: "indeterminadas" }, { side: "Libano y actores armados", members: ["Hezbola y actores libaneses"], organizations: [], troops: "indeterminadas", casualties: "indeterminadas" }], outcome: "No consolidado.", consequences: "Mantener como registro de muy baja confianza hasta confirmacion." },
  "Guerra civil somalí (2006-2009)": EXTRA_CONFLICT_DETAIL_OVERRIDES["Guerra civil somali (2006-2009)"],
  "Intervención armada dirigida por los Estados Unidos en Irak": EXTRA_CONFLICT_DETAIL_OVERRIDES["Invasion de Irak de 2003"],
  "Sitio de Alepo (1980-1981)": { cause: "No pertenece al bloque pos-2000 pero el corpus lo arrastra por la palabra Alepo.", type: "sitio", scope: "interno", region: "Siria", chronology: [{ year: 1980, text: "Fuerzas sirias cercan sectores insurgentes en Alepo." }], related: [], participants: [{ side: "Estado sirio", members: ["Siria"], organizations: [], troops: "indeterminadas", casualties: "indeterminadas" }, { side: "Insurgentes", members: ["insurgencia islamista"], organizations: [], troops: "indeterminadas", casualties: "indeterminadas" }], outcome: "Represion del levantamiento.", consequences: "Prefiguro futuras crisis sirias pero no es un conflicto pos-2000." }
});

window.GeoRiskCuration = {
  EXTRA_CONFLICT_DETAIL_OVERRIDES,
  EXTRA_CURATED_TIMELINE_EXTRAS,
  EXTRA_TIMELINE_DETAIL_OVERRIDES,
  COUNTRY_CURATION_OVERRIDES
};
