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
    participants: [
      { side: "Comunistas", members: ["Partido Comunista Chino"], organizations: [], troops: "millones", casualties: "muy elevadas" },
      { side: "Nacionalistas", members: ["Kuomintang"], organizations: [], troops: "millones", casualties: "muy elevadas" }
    ],
    outcome: "Victoria comunista y retiro nacionalista a Taiwan.",
    consequences: "Origino la Republica Popular China y la persistencia de la cuestion de Taiwan."
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
  ]
};

window.GeoRiskCuration = {
  EXTRA_CONFLICT_DETAIL_OVERRIDES,
  EXTRA_CURATED_TIMELINE_EXTRAS
};
