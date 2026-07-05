export const SAFE_CONFLICT_RENAMES = {
  "Batalla naval de RÃ¼gen": "Batalla naval de Rugen",
  "Batalla de Rügen": "Batalla naval de Rugen",
  "Adriatic Campaign de World War II": "Campana del Adriatico en la Segunda Guerra Mundial",
  "Northern France Campana": "Campana del norte de Francia",
  "Raid on Le Havre": "Incursion sobre Le Havre",
  "Sunda Strait campaign de January 1794": "Campana del estrecho de Sonda de enero de 1794",
  "Raid on Boulogne": "Incursion sobre Boulogne",
  "Raid on Alexandria": "Incursion sobre Alejandria",
  "Battle for Piva Trail": "Batalla de Piva Trail",
  "Battle off Endau": "Batalla frente a Endau",
  "German occupation de Luxemburgo en World War II": "Ocupacion alemana de Luxemburgo en la Segunda Guerra Mundial",
  "Raid on Santorini": "Incursion sobre Santorini",
  "Raid on Black Rock": "Incursion sobre Black Rock",
  "Raid on Havre de Grace": "Incursion sobre Havre de Grace",
  "Iran–Israel conflict during Syrian civil war": "Conflicto irano-israeli durante la guerra civil siria",
  "Iran-Israel conflict during Syrian civil war": "Conflicto irano-israeli durante la guerra civil siria",
  "1952 Clash de Ismailia": "Choque de Ismailia de 1952",
  "1957 Honduras-Nicaragua border conflict": "Conflicto fronterizo Honduras-Nicaragua de 1957",
  "2024 Beqaa Valley airstrikes": "Ataques aereos del valle de la Becaa de 2024",
  "Ataques aéreos del valle de la Becaa de 2024": "Ataques aereos del valle de la Becaa de 2024",
  "2016 Sirte offensive": "Ofensiva de Sirte de 2016",
  "Bombardeos aliados de Ámsterdam-Noord": "Bombardeos aliados de Amsterdam-Noord",
  "Incursión de abril de 2009 frente a Somalia": "Incursion de abril de 2009 frente a Somalia",
  "1984 DMZ incident": "Incidente de la zona desmilitarizada de Corea de 1984",
  "2022 Russian Invasion de Ukraine": "Invasion rusa de Ucrania de 2022",
  "1919 Soviet Invasion de Ukraine": "Invasion sovietica de Ucrania de 1919",
  "Primera intifada": "Primera Intifada",
  "Segunda intifada": "Segunda Intifada",
  "Batalla de Saigón": "Batalla de Saigon",
  "Batalla de SaigÃ³n": "Batalla de Saigon",
  "Batalla de HjÃ¶rungavÃ¡gr": "Batalla de Hjorungavagr",
  "Batalla de NisÃ¥": "Batalla de Nisa",
  "Sitio de NykÃ¸bing": "Sitio de Nykobing"
};

export const CURATED_CONFLICT_DETAIL_FIXES = {
  "Ataques aereos del valle de la Becaa de 2024": {
    name: "Ataques aereos del valle de la Becaa de 2024",
    parent: "Conflicto Israel-Hezbola de 2023-2024",
    war: "Conflicto Israel-Hezbola de 2023-2024",
    campaign: "Frente libanes de la guerra Israel-Hamas",
    type: "ataque aereo",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 2024,
    endYear: 2024,
    region: "Valle de la Becaa, Libano",
    normalizedRegion: "Valle de la Becaa, Libano",
    wikipedia: {
      date: "28 de octubre de 2024 - 6 de noviembre de 2024",
      place: "Valle de la Becaa, Libano",
      result: "Ataques aereos israelies contra objetivos en el valle de la Becaa",
      language: "es"
    },
    cause: "Escalada de ataques entre Israel y Hezbola en el frente libanes durante la guerra regional iniciada en 2023.",
    chronology: [
      { year: 2024, text: "Entre el 28 de octubre y el 6 de noviembre se registraron ataques aereos sobre el valle de la Becaa." }
    ],
    related: ["Conflicto Israel-Hezbola de 2023-2024", "Guerra Israel-Hamas"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: ["Fuerzas de Defensa de Israel"], casualties: "No consolidado en fuentes livianas" },
      { side: "Libano y Hezbola", members: ["Libano", "Hezbola"], organizations: ["Hezbola"], casualties: "No consolidado en fuentes livianas" }
    ],
    outcome: "Ataques localizados con impacto militar y civil; no implicaron cierre del conflicto regional.",
    consequences: "Aumentaron la presion sobre el frente libanes y reforzaron el riesgo de escalada entre Israel, Libano y Hezbola.",
    treaties: [],
    curationPriority: "alta",
    curationBatch: "visible-detail-curation-2026-07",
    curationStatus: "curado",
    dataConfidence: "parcial"
  },
  "Batalla frente a Endau": {
    parent: "Segunda Guerra Mundial",
    war: "Segunda Guerra Mundial",
    campaign: "Campana de Malasia",
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "mundial",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1942,
    endYear: 1942,
    region: "Malaya",
    normalizedRegion: "Malaya",
    wikipedia: {
      date: "26-27 de enero de 1942",
      place: "Frente a Endau, Malaya",
      result: "Victoria japonesa",
      language: "es"
    },
    cause: "Intento aliado de interceptar fuerzas japonesas durante la campana de Malasia en la Segunda Guerra Mundial.",
    chronology: [
      { year: 1942, text: "Combate naval y aereo frente a Endau durante la ofensiva japonesa en Malaya." }
    ],
    related: ["Segunda Guerra Mundial", "Campana de Malasia"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Australia"], organizations: ["Aliados"], casualties: "No consolidado en fuentes livianas" },
      { side: "Japon", members: ["Japon"], organizations: ["Eje"], casualties: "No consolidado en fuentes livianas" }
    ],
    outcome: "Victoria japonesa.",
    consequences: "Facilito la continuidad del avance japones hacia Singapur y debilito la capacidad aliada en la zona.",
    treaties: [],
    curationPriority: "alta",
    curationBatch: "visible-detail-curation-2026-07",
    curationStatus: "curado",
    dataConfidence: "parcial"
  },
  "Batalla del Monte Calvo": {
    parent: "Guerra de Corea",
    war: "Guerra de Corea",
    campaign: "Campana de Corea",
    type: "batalla",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1952,
    endYear: 1953,
    region: "Peninsula coreana",
    normalizedRegion: "Peninsula coreana",
    wikipedia: {
      date: "26 de junio de 1952 - 26 de marzo de 1953",
      place: "Monte Calvo, Corea del Sur",
      result: "Resultado disputado: victoria de la ONU en 1952 y victoria china en 1953",
      language: "es"
    },
    cause: "Combates por posiciones elevadas durante la fase de desgaste de la Guerra de Corea.",
    chronology: [
      { year: 1952, text: "Fuerzas de la ONU combaten por el control del Monte Calvo." },
      { year: 1953, text: "Fuerzas chinas recuperan posiciones durante la fase final del frente." }
    ],
    related: ["Guerra de Corea"],
    participants: [
      { side: "Corea del Sur y ONU", members: ["Corea del Sur", "Estados Unidos", "Colombia"], organizations: ["ONU"], casualties: "No consolidado en fuentes livianas" },
      { side: "China", members: ["China"], organizations: [], casualties: "No consolidado en fuentes livianas" }
    ],
    outcome: "Resultado disputado entre las fases de 1952 y 1953.",
    consequences: "Reflejo la guerra de posiciones y el alto costo tactico de las colinas fortificadas en el tramo final de la Guerra de Corea.",
    treaties: [],
    curationPriority: "alta",
    curationBatch: "visible-detail-curation-2026-07",
    curationStatus: "curado",
    dataConfidence: "parcial"
  },
  "Bombardeos aliados de Amsterdam-Noord": {
    name: "Bombardeos aliados de Amsterdam-Noord",
    parent: "Segunda Guerra Mundial",
    war: "Segunda Guerra Mundial",
    campaign: "Campana aerea aliada sobre los Paises Bajos",
    type: "bombardeo",
    conflictType: "interestatal",
    scale: "mundial",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1943,
    endYear: 1943,
    region: "Amsterdam-Noord, Paises Bajos",
    normalizedRegion: "Amsterdam-Noord, Paises Bajos",
    wikipedia: {
      date: "17, 25 y 28 de julio de 1943",
      place: "Amsterdam-Noord, Paises Bajos",
      casualties: ["Al menos 206 muertos", "Al menos 119 heridos graves"],
      language: "es"
    },
    cause: "Bombardeos aliados contra objetivos industriales y militares en Amsterdam-Noord durante la Segunda Guerra Mundial.",
    chronology: [
      { year: 1943, text: "Oleadas de bombardeos aliados registradas el 17, 25 y 28 de julio." }
    ],
    related: ["Segunda Guerra Mundial", "Campana aerea aliada sobre Europa occidental"],
    participants: [
      { side: "Aliados", members: ["Reino Unido", "Estados Unidos"], organizations: ["Aliados"], casualties: "No consolidado en fuentes livianas" },
      { side: "Alemania", members: ["Alemania"], organizations: ["Eje"], casualties: "Al menos 206 muertos y 119 heridos graves en la zona bombardeada" }
    ],
    outcome: "Bombardeos con danos severos en Amsterdam-Noord y victimas civiles documentadas.",
    consequences: "Dejaron un impacto local importante dentro de la campana aerea aliada sobre territorios ocupados.",
    treaties: [],
    curationPriority: "alta",
    curationBatch: "visible-detail-curation-2026-07",
    curationStatus: "curado",
    dataConfidence: "parcial"
  },
  "Incursion de abril de 2009 frente a Somalia": {
    name: "Incursion de abril de 2009 frente a Somalia",
    parent: "Pirateria frente a Somalia",
    war: "Pirateria frente a Somalia",
    campaign: "Operaciones antipirateria frente al Cuerno de Africa",
    type: "operacion naval",
    conflictType: "insurgencia",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 2009,
    endYear: 2009,
    region: "Cuerno de Africa",
    normalizedRegion: "Cuerno de Africa",
    wikipedia: {
      date: "9 de abril de 2009",
      place: "20 millas nauticas frente a Somalia",
      result: "Victoria franco-alemana",
      language: "es"
    },
    cause: "Operacion de rescate y respuesta naval ante actividad pirata frente a la costa somali.",
    chronology: [
      { year: 2009, text: "Operacion naval del 9 de abril contra piratas somalies en aguas frente a Somalia." }
    ],
    related: ["Pirateria frente a Somalia", "Operaciones antipirateria en el oceano Indico"],
    participants: [
      { side: "Fuerzas europeas", members: ["Francia", "Alemania"], organizations: ["Fuerzas navales europeas"], casualties: "No consolidado en fuentes livianas" },
      { side: "Piratas somalies", members: ["Piratas somalies"], organizations: [], casualties: "No consolidado en fuentes livianas" }
    ],
    outcome: "Victoria franco-alemana y cierre de la accion naval puntual.",
    consequences: "Refuerzo la presencia internacional contra la pirateria frente al Cuerno de Africa.",
    treaties: [],
    curationPriority: "alta",
    curationBatch: "visible-detail-curation-2026-07",
    curationStatus: "curado",
    dataConfidence: "parcial"
  },
  "Ofensiva de Sirte de 2016": {
    parent: "Segunda guerra civil libia",
    war: "Segunda guerra civil libia",
    campaign: "Campana de Sirte contra Estado Islamico",
    type: "ofensiva",
    conflictType: "civil",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 2016,
    endYear: 2016,
    region: "Sirte, Libia",
    normalizedRegion: "Sirte, Libia",
    wikipedia: {
      date: "12 de mayo de 2016 - 6 de diciembre de 2016",
      place: "Distrito de Sirte, Libia",
      result: "Victoria del Gobierno de Acuerdo Nacional",
      language: "es"
    },
    cause: "Ofensiva del Gobierno de Acuerdo Nacional y fuerzas aliadas para expulsar a Estado Islamico de Sirte.",
    chronology: [
      { year: 2016, text: "Inicio de la ofensiva sobre Sirte en mayo." },
      { year: 2016, text: "Toma de Sirte por fuerzas del Gobierno de Acuerdo Nacional en diciembre." }
    ],
    related: ["Segunda guerra civil libia", "Guerra contra Estado Islamico"],
    participants: [
      { side: "Gobierno de Acuerdo Nacional y aliados", members: ["Gobierno de Acuerdo Nacional", "Ejercito libio", "Brigadas de Misrata", "Estados Unidos", "Reino Unido", "Francia", "Italia"], organizations: ["Gobierno de Acuerdo Nacional"], casualties: "No consolidado en fuentes livianas" },
      { side: "Estado Islamico en Libia", members: ["Estado Islamico en Libia"], organizations: ["Estado Islamico"], casualties: "No consolidado en fuentes livianas" }
    ],
    outcome: "Victoria del Gobierno de Acuerdo Nacional y recuperacion de Sirte.",
    consequences: "Redujo el control territorial de Estado Islamico en Libia y reforzo temporalmente al Gobierno de Acuerdo Nacional.",
    treaties: [],
    curationPriority: "alta",
    curationBatch: "visible-detail-curation-2026-07",
    curationStatus: "curado",
    dataConfidence: "parcial"
  },
  "Conflicto irano-israeli durante la guerra civil siria": {
    parent: "Guerra civil siria",
    type: "conflicto regional",
    scope: "regional",
    region: "Siria y Oriente Medio",
    cause: "Escalada de choques indirectos y directos entre Iran, Israel y actores aliados dentro del marco de la guerra civil siria.",
    chronology: [
      { year: 2013, text: "Aumentan los incidentes vinculados a presencia irani, milicias aliadas y operaciones israelies en el teatro sirio." }
    ],
    related: ["Guerra civil siria", "Conflicto irano-israeli"],
    participants: [
      { side: "Israel", members: ["Israel"], organizations: [], troops: "fuerzas aereas y de inteligencia", casualties: "variables" },
      { side: "Iran y aliados", members: ["Iran", "Siria"], organizations: ["Hezbola y milicias aliadas"], troops: "fuerzas y milicias desplegadas en Siria", casualties: "variables" }
    ],
    outcome: "Conflicto intermitente y no resuelto dentro del escenario sirio.",
    consequences: "Internacionalizo aun mas la guerra civil siria y mantuvo una zona de friccion regional persistente."
  },
  "Batalla de al-Qaryatayn": {
    parent: "Guerra civil siria",
    type: "batalla",
    scope: "regional",
    region: "Siria central",
    cause: "Disputa por el control de al-Qaryatayn durante la guerra civil siria y la ofensiva contra Estado Islamico.",
    chronology: [
      { year: 2016, text: "Fuerzas sirias, con apoyo ruso, combaten por recuperar al-Qaryatayn de manos de Estado Islamico." }
    ],
    related: ["Guerra civil siria", "Guerra contra Estado Islamico"],
    participants: [
      { side: "Gobierno sirio y aliados", members: ["Siria", "Rusia"], organizations: ["Fuerzas Armadas Sirias"], troops: "fuerzas terrestres y apoyo aereo", casualties: "significativas o inciertas" },
      { side: "Estado Islamico", members: ["Estado Islamico"], organizations: ["Estado Islamico"], troops: "combatientes irregulares", casualties: "significativas o inciertas" }
    ],
    outcome: "Recuperacion temporal de la ciudad por fuerzas progubernamentales.",
    consequences: "Debilito posiciones de Estado Islamico en Siria central y reforzo el control gubernamental de rutas locales."
  },
  "Batalla de Saigon": {
    parent: "Guerra de Vietnam",
    type: "batalla",
    scope: "regional",
    region: "Sudeste asiatico",
    cause: "Fue parte de la fase temprana del conflicto vietnamita y de la disputa por el control politico-militar de Saigon.",
    chronology: [
      { year: 1955, text: "Fuerzas leales a Ngo Dinh Diem enfrentan a milicias rivales por el control de Saigon." }
    ],
    related: ["Guerra de Vietnam", "Primera guerra de Indochina"],
    participants: [
      { side: "Gobierno de Vietnam del Sur", members: ["Vietnam del Sur"], organizations: [], troops: "miles", casualties: "significativas" },
      { side: "Milicias y fuerzas rivales", members: ["Binh Xuyen", "sectores armados rivales"], organizations: [], troops: "miles", casualties: "significativas" }
    ],
    outcome: "Consolidacion del poder de Ngo Dinh Diem en Saigon.",
    consequences: "Debilito a milicias autonomas y preparo una estructura estatal survietnamita mas centralizada."
  },
  "Batalla de Hjorungavagr": {
    parent: "Guerras escandinavas medievales",
    type: "batalla",
    scope: "regional",
    region: "Escandinavia",
    cause: "Enfrento a poderes noruegos y daneses por influencia maritima y hegemonia regional.",
    chronology: [
      { year: 986, text: "Batalla naval entre fuerzas noruegas y una coalicion vinculada al poder danes." }
    ],
    related: ["Guerras escandinavas medievales"],
    participants: [
      { side: "Noruegos", members: ["Noruega"], organizations: [], troops: "fuerzas navales medievales", casualties: "inciertas" },
      { side: "Coalicion jomsvikinga-danesa", members: ["Dinamarca", "Jomsvikings"], organizations: [], troops: "fuerzas navales medievales", casualties: "inciertas" }
    ],
    outcome: "Victoria noruega segun la tradicion historica.",
    consequences: "Reforzo la autonomia noruega frente a presiones danesas."
  },
  "Batalla de Svolder": {
    parent: "Guerras escandinavas medievales",
    type: "batalla",
    scope: "regional",
    region: "Mar Baltico",
    cause: "Disputa por el poder noruego y el equilibrio entre reinos escandinavos.",
    chronology: [
      { year: 999, text: "Coalicion de Dinamarca, Suecia y opositores noruegos derrota al rey Olaf Tryggvason." }
    ],
    related: ["Guerras escandinavas medievales"],
    participants: [
      { side: "Noruega", members: ["Noruega"], organizations: [], troops: "flota real", casualties: "inciertas" },
      { side: "Coalicion escandinava", members: ["Dinamarca", "Suecia", "opositores noruegos"], organizations: [], troops: "flota aliada", casualties: "inciertas" }
    ],
    outcome: "Derrota de Olaf Tryggvason.",
    consequences: "Redistribuyo influencia sobre Noruega entre Dinamarca, Suecia y elites locales."
  },
  "Batalla de Nisa": {
    parent: "Guerras noruego-danesas medievales",
    type: "batalla",
    scope: "regional",
    region: "Escandinavia",
    cause: "Rivalidad entre Noruega y Dinamarca por supremacia regional.",
    chronology: [
      { year: 1062, text: "Combate naval entre fuerzas noruegas y danesas." }
    ],
    related: ["Guerras escandinavas medievales"],
    participants: [
      { side: "Noruega", members: ["Noruega"], organizations: [], troops: "flota medieval", casualties: "inciertas" },
      { side: "Dinamarca", members: ["Dinamarca"], organizations: [], troops: "flota medieval", casualties: "inciertas" }
    ],
    outcome: "Victoria noruega.",
    consequences: "Mantuvo abierta la competencia naval entre Noruega y Dinamarca."
  },
  "Batalla de Lena": {
    parent: "Guerras sueco-danesas medievales",
    type: "batalla",
    scope: "regional",
    region: "Escandinavia",
    cause: "Lucha dinastica y presion danesa sobre el reino sueco.",
    chronology: [
      { year: 1208, text: "Fuerzas suecas derrotan a un ejercito con apoyo danes." }
    ],
    related: ["Guerras escandinavas medievales"],
    participants: [
      { side: "Suecos", members: ["Suecia"], organizations: [], troops: "fuerzas medievales", casualties: "inciertas" },
      { side: "Daneses y aliados", members: ["Dinamarca"], organizations: [], troops: "fuerzas medievales", casualties: "inciertas" }
    ],
    outcome: "Victoria sueca.",
    consequences: "Freno temporalmente la influencia danesa en la politica sueca."
  },
  "Campana del Adriatico en la Segunda Guerra Mundial": {
    parent: "Segunda Guerra Mundial",
    type: "campana",
    scope: "regional",
    region: "Adriatico",
    cause: "Control naval, logistico y costero del Adriatico durante la Segunda Guerra Mundial.",
    chronology: [
      { year: 1940, text: "Italia y fuerzas aliadas disputan rutas maritimas y costas adriaticas." },
      { year: 1943, text: "La capitulacion italiana cambia el equilibrio de la campana." },
      { year: 1945, text: "El avance aliado y partisano cierra la campana." }
    ],
    related: ["Segunda Guerra Mundial", "Campana de Italia", "Frente yugoslavo de la Segunda Guerra Mundial"],
    participants: [
      { side: "Aliados y partisanos", members: ["Reino Unido", "Estados Unidos", "Yugoslavia partisana"], organizations: ["Aliados"], troops: "fuerzas navales y terrestres variables", casualties: "significativas" },
      { side: "Eje", members: ["Italia", "Alemania"], organizations: ["Eje"], troops: "fuerzas navales y terrestres variables", casualties: "significativas" }
    ],
    outcome: "Control aliado y partisano progresivo del espacio adriatico.",
    consequences: "Facilito operaciones aliadas en Italia, Balcanes y rutas del Mediterraneo oriental."
  },
  "Sitio de Nykobing": {
    parent: "Guerras entre Dinamarca y la Liga Hanseatica",
    type: "sitio",
    scope: "regional",
    region: "Escandinavia",
    cause: "Formo parte de la disputa por control comercial y militar en el Baltico.",
    chronology: [{ year: 1360, text: "Operaciones de sitio en torno a Nykobing durante la rivalidad dano-hanseatica." }],
    related: ["Guerras entre Dinamarca y la Liga Hanseatica"],
    participants: [
      { side: "Dinamarca", members: ["Dinamarca"], organizations: [], troops: "fuerzas medievales", casualties: "inciertas" },
      { side: "Liga Hanseatica y aliados", members: ["Liga Hanseatica"], organizations: ["Liga Hanseatica"], troops: "fuerzas medievales", casualties: "inciertas" }
    ],
    outcome: "Episodio militar regional sin cambio estrategico permanente aislado.",
    consequences: "Reflejo la centralidad del Baltico en la competencia comercial medieval."
  },
  "Sitio de Helsingborg": {
    parent: "Guerras entre Dinamarca y la Liga Hanseatica",
    type: "sitio",
    scope: "regional",
    region: "Escania",
    cause: "Control de plazas costeras estrategicas del estrecho de Oresund.",
    chronology: [{ year: 1368, text: "Fuerzas hanseaticas y aliadas presionan enclaves daneses en Escania." }],
    related: ["Guerras entre Dinamarca y la Liga Hanseatica", "Tratado de Stralsund"],
    participants: [
      { side: "Dinamarca", members: ["Dinamarca"], organizations: [], troops: "guarniciones y fuerzas regionales", casualties: "inciertas" },
      { side: "Liga Hanseatica y aliados", members: ["Liga Hanseatica", "Suecia"], organizations: ["Liga Hanseatica"], troops: "fuerzas navales y terrestres", casualties: "inciertas" }
    ],
    outcome: "Presion aliada sobre posiciones danesas.",
    consequences: "Contribuyo al deterioro de la posicion danesa antes del acuerdo de Stralsund."
  },
  "Sitio de Lindholmen": {
    parent: "Guerras entre Dinamarca y la Liga Hanseatica",
    type: "sitio",
    scope: "regional",
    region: "Escania",
    cause: "Disputa por fortalezas y rutas del sur escandinavo.",
    chronology: [{ year: 1368, text: "Operaciones de asedio contra posiciones danesas durante la guerra dano-hanseatica." }],
    related: ["Guerras entre Dinamarca y la Liga Hanseatica"],
    participants: [
      { side: "Dinamarca", members: ["Dinamarca"], organizations: [], troops: "guarnicion local", casualties: "inciertas" },
      { side: "Coalicion hanseatica", members: ["Liga Hanseatica", "Suecia"], organizations: ["Liga Hanseatica"], troops: "fuerzas de asedio", casualties: "inciertas" }
    ],
    outcome: "Debilitamiento de la red defensiva danesa.",
    consequences: "Se integro en la presion militar que limito el control danes del Baltico."
  },
  "Batalla de Rapallo (1495)": {
    parent: "Primera guerra italiana",
    type: "batalla",
    scope: "regional",
    region: "Italia",
    cause: "Choque durante las guerras italianas por el control de plazas ligures y rutas hacia el norte de Italia.",
    chronology: [{ year: 1495, text: "Combate en Rapallo durante la primera fase de las guerras italianas." }],
    related: ["Guerras italianas", "Primera guerra italiana"],
    participants: [
      { side: "Francia", members: ["Francia"], organizations: [], troops: "fuerzas expedicionarias", casualties: "inciertas" },
      { side: "Liga italiana", members: ["Estados italianos aliados"], organizations: ["Liga de Venecia"], troops: "fuerzas regionales", casualties: "inciertas" }
    ],
    outcome: "Episodio tactico dentro de la primera fase de las guerras italianas.",
    consequences: "Mostro la fragmentacion militar italiana frente a la intervencion francesa."
  },
  "Batalla de Stockholm": {
    parent: "Guerra de Liberacion Sueca",
    type: "batalla",
    scope: "regional",
    region: "Escandinavia",
    cause: "Conflicto por el control de Suecia y la Union de Kalmar.",
    chronology: [{ year: 1518, text: "Fuerzas suecas y danesas combaten por el control de Estocolmo." }],
    related: ["Guerra de Liberacion Sueca", "Union de Kalmar"],
    participants: [
      { side: "Suecos", members: ["Suecia"], organizations: [], troops: "fuerzas regionales", casualties: "inciertas" },
      { side: "Daneses", members: ["Dinamarca"], organizations: [], troops: "fuerzas reales", casualties: "inciertas" }
    ],
    outcome: "Victoria sueca temporal.",
    consequences: "Profundizo la crisis de la Union de Kalmar."
  },
  "Batalla de Bogesund": {
    parent: "Guerra de Liberacion Sueca",
    type: "batalla",
    scope: "regional",
    region: "Suecia",
    cause: "Escalada final del conflicto entre fuerzas unionistas danesas e independentistas suecas.",
    chronology: [{ year: 1520, text: "Combate entre fuerzas suecas y danesas en Bogesund." }],
    related: ["Guerra de Liberacion Sueca", "Bano de sangre de Estocolmo"],
    participants: [
      { side: "Suecos", members: ["Suecia"], organizations: [], troops: "fuerzas regionales", casualties: "inciertas" },
      { side: "Daneses", members: ["Dinamarca"], organizations: [], troops: "fuerzas reales", casualties: "inciertas" }
    ],
    outcome: "Victoria danesa.",
    consequences: "Precedio la ocupacion danesa de Estocolmo y la posterior reaccion independentista sueca."
  },
  "Batalla de Solent": {
    parent: "Rivalidad anglo-francesa del siglo XVI",
    type: "batalla naval",
    scope: "regional",
    region: "Canal de la Mancha",
    cause: "Intento frances de presionar a Inglaterra en el contexto de rivalidades europeas del siglo XVI.",
    chronology: [{ year: 1545, text: "Combate naval entre flotas inglesa y francesa en el Solent." }],
    related: ["Guerras italianas", "Rivalidad anglo-francesa"],
    participants: [
      { side: "Inglaterra", members: ["Inglaterra"], organizations: [], troops: "flota real", casualties: "significativas" },
      { side: "Francia", members: ["Francia"], organizations: [], troops: "flota expedicionaria", casualties: "significativas" }
    ],
    outcome: "Resultado indeciso con defensa inglesa de la costa.",
    consequences: "Quedo asociada al hundimiento del Mary Rose y a la defensa naval inglesa."
  },
  "Sitio de Narva": {
    parent: "Guerra livonia",
    type: "sitio",
    scope: "regional",
    region: "Baltico",
    cause: "Control de Narva y rutas balticas durante la rivalidad entre Suecia, Rusia y Polonia-Lituania.",
    chronology: [{ year: 1581, text: "Fuerzas suecas toman Narva durante la Guerra livonia." }],
    related: ["Guerra livonia", "Rivalidad sueco-rusa"],
    participants: [
      { side: "Suecia", members: ["Suecia"], organizations: [], troops: "fuerzas de asedio", casualties: "significativas" },
      { side: "Rusia zarista", members: ["Rusia"], organizations: [], troops: "guarnicion local", casualties: "significativas" }
    ],
    outcome: "Victoria sueca y captura de Narva.",
    consequences: "Fortalecio la presencia sueca en el Baltico oriental."
  },
  "Batalla de Salis": {
    parent: "Guerra polaco-sueca de 1600-1611",
    type: "batalla naval",
    scope: "regional",
    region: "Baltico",
    cause: "Disputa por Livonia y control naval del Baltico.",
    chronology: [{ year: 1609, text: "Combate naval entre fuerzas suecas y polaco-lituanas." }],
    related: ["Guerra polaco-sueca de 1600-1611"],
    participants: [
      { side: "Suecia", members: ["Suecia"], organizations: [], troops: "escuadra naval", casualties: "inciertas" },
      { side: "Polonia-Lituania", members: ["Polonia-Lituania"], organizations: [], troops: "escuadra naval", casualties: "inciertas" }
    ],
    outcome: "Resultado tactico vinculado al control naval regional.",
    consequences: "Mantuvo la presion sobre las rutas balticas."
  },
  "Sitio de Smolensk": {
    parent: "Guerra polaco-rusa",
    type: "sitio",
    scope: "regional",
    region: "Europa oriental",
    cause: "Disputa por Smolensk durante el Tiempo de los Problemas ruso.",
    chronology: [
      { year: 1609, text: "Comienza el asedio polaco-lituano de Smolensk." },
      { year: 1611, text: "La ciudad cae tras un largo sitio." }
    ],
    related: ["Guerra polaco-rusa", "Tiempo de los Problemas"],
    participants: [
      { side: "Polonia-Lituania", members: ["Polonia-Lituania"], organizations: [], troops: "fuerzas de asedio", casualties: "elevadas" },
      { side: "Rusia", members: ["Rusia"], organizations: [], troops: "guarnicion y defensores locales", casualties: "elevadas" }
    ],
    outcome: "Captura de Smolensk por Polonia-Lituania.",
    consequences: "Altero temporalmente el equilibrio en la frontera occidental rusa."
  },
  "Batalla de Swally": {
    parent: "Rivalidad naval luso-inglesa en el Indico",
    type: "batalla naval",
    scope: "regional",
    region: "Oceano Indico",
    cause: "Competencia por rutas comerciales y presencia europea en India.",
    chronology: [{ year: 1612, text: "Navios ingleses derrotan a una fuerza portuguesa cerca de Surat." }],
    related: ["Expansion europea en el Oceano Indico"],
    participants: [
      { side: "Compania Inglesa de las Indias Orientales", members: ["Inglaterra"], organizations: ["Compania Inglesa de las Indias Orientales"], troops: "escuadra naval", casualties: "moderadas" },
      { side: "Portugal", members: ["Portugal"], organizations: [], troops: "escuadra portuguesa", casualties: "moderadas" }
    ],
    outcome: "Victoria inglesa.",
    consequences: "Facilito el establecimiento comercial ingles en Surat."
  },
  "Batalla de Gniew": {
    parent: "Guerra polaco-sueca de 1626-1629",
    type: "batalla",
    scope: "regional",
    region: "Prusia Real",
    cause: "Disputa sueco-polaca por Prusia y el control del Baltico.",
    chronology: [{ year: 1626, text: "Combate entre Gustavo Adolfo y fuerzas polaco-lituanas cerca de Gniew." }],
    related: ["Guerra polaco-sueca de 1626-1629"],
    participants: [
      { side: "Suecia", members: ["Suecia"], organizations: [], troops: "fuerzas de campana", casualties: "significativas" },
      { side: "Polonia-Lituania", members: ["Polonia-Lituania"], organizations: [], troops: "fuerzas de campana", casualties: "significativas" }
    ],
    outcome: "Resultado indeciso con continuidad de la campana.",
    consequences: "Anticipo nuevas batallas por el control de Prusia."
  }
};

CURATED_CONFLICT_DETAIL_FIXES["Sitio de NykÃ¸bing"] = CURATED_CONFLICT_DETAIL_FIXES["Sitio de Nykobing"];
