export const SAFE_CONFLICT_RENAMES = {
  "Adriatic Campaign de World War II": "Campana del Adriatico en la Segunda Guerra Mundial",
  "Raid on Le Havre": "Incursion sobre Le Havre",
  "Sunda Strait campaign de January 1794": "Campana del estrecho de Sonda de enero de 1794",
  "Raid on Boulogne": "Incursion sobre Boulogne",
  "Raid on Alexandria": "Incursion sobre Alejandria",
  "Batalla de Saigón": "Batalla de Saigon",
  "Batalla de SaigÃ³n": "Batalla de Saigon",
  "Batalla de HjÃ¶rungavÃ¡gr": "Batalla de Hjorungavagr",
  "Batalla de NisÃ¥": "Batalla de Nisa",
  "Sitio de NykÃ¸bing": "Sitio de Nykobing"
};

export const CURATED_CONFLICT_DETAIL_FIXES = {
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
  }
};

CURATED_CONFLICT_DETAIL_FIXES["Sitio de NykÃ¸bing"] = CURATED_CONFLICT_DETAIL_FIXES["Sitio de Nykobing"];
