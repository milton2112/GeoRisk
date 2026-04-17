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

window.GeoRiskCuration = {
  EXTRA_CONFLICT_DETAIL_OVERRIDES,
  EXTRA_CURATED_TIMELINE_EXTRAS,
  EXTRA_TIMELINE_DETAIL_OVERRIDES,
  COUNTRY_CURATION_OVERRIDES
};
