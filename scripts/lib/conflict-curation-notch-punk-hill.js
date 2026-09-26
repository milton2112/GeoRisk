const SOURCES = {
  notch: {
    label: "U.S. Army, Roy E. Appleman: South to the Naktong, North to the Yalu, cap. XIV, pp. 239-242; copia archivada por la Universidad de Gotinga",
    url: "https://webdoc.sub.gwdg.de/ebook/p/2005/CMH_2/www.army.mil/cmh-pg/books/korea/20-2-1/sn14.htm"
  },
  korea: {
    label: "National Museum of the Marine Corps: contexto del per\u00edmetro de Pusan y combate de Notch del 2 de agosto de 1950",
    url: "https://www.usmcmuseum.com/uploads/6/0/3/6/60364049/battle_of_yongsan_-_pusan_perimeter.pdf"
  },
  punkHill: {
    label: "New Jersey Geological Survey, David C. Munn: Battles and Skirmishes of the American Revolution in New Jersey, pp. 6, 15 y 53; copia de Crossroads of the American Revolution",
    url: "https://revolutionarynj.org/wp-content/uploads/2023/10/Battles-and-Skirmishes.pdf"
  },
  maxwell: {
    label: "Cradle of Texas Crier, marzo de 2015, p. 3: reproducci\u00f3n del relato estadounidense de Punk Hill fechado el 9 de marzo de 1777",
    url: "https://cradletxsar.org/wp-content/uploads/2016/09/Cradle-of-Texas-Crier-March-2015.pdf"
  }
};

function detail({ parent, campaign, year, region, sources, ...fields }) {
  return {
    parent, war: parent, campaign, startYear: year, endYear: year,
    region, normalizedRegion: region, type: "batalla", conflictType: "interestatal", scale: "local",
    status: "historico", active: false, ongoing: false, related: [parent, campaign], treaties: [],
    hierarchyConfidence: "alta", hierarchySources: sources,
    curationPriority: "alta", curationBatch: "source-backed-notch-punk-hill-2026-09",
    curationStatus: "estructural", dataConfidence: "parcial", ...fields
  };
}

export const NOTCH_PUNK_HILL_CONFLICT_RENAMES = {
  "Batalla de Notch": "Batalla del paso de Chungam-ni (Notch, 1950)",
  "Battle of the Notch": "Batalla del paso de Chungam-ni (Notch, 1950)",
  "Batalla de Punk Hill": "Combate de Punk Hill (1777)",
  "Battle of Punk Hill": "Combate de Punk Hill (1777)"
};

export const NOTCH_PUNK_HILL_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": ["Batalla del paso de Chungam-ni (Notch, 1950)", "Combate de Punk Hill (1777)"],
  "Corea del Sur": ["Batalla del paso de Chungam-ni (Notch, 1950)"],
  "Corea del Norte": ["Batalla del paso de Chungam-ni (Notch, 1950)"],
  "Reino Unido": ["Combate de Punk Hill (1777)"]
};

export const NOTCH_PUNK_HILL_CONFLICT_DETAIL_FIXES = {
  "Batalla del paso de Chungam-ni (Notch, 1950)": detail({
    parent: "Guerra de Corea", campaign: "Defensa de los accesos a Masan (1950)", year: 1950,
    region: "Paso de Chungam-ni, accesos a Masan, Corea del Sur, Asia oriental",
    sources: [SOURCES.notch, SOURCES.korea], datePrecision: "2 de agosto de 1950",
    cause: "Avance norcoreano hacia Masan tras la retirada estadounidense desde Chinju.",
    outcome: "La fuerza estadounidense sostuvo el paso; los atacantes norcoreanos se retiraron del contacto al anochecer.",
    consequences: "Contuvo el avance inmediato por la ruta norte hacia Masan, antes de la defensa del per\u00edmetro de Pusan.",
    participants: [
      { side: "Fuerzas estadounidenses y surcoreanas", members: ["Estados Unidos", "19.\u00ba y 29.\u00ba regimientos de infanter\u00eda", "Corea del Sur"], casualties: "Appleman cita unas 90 bajas estadounidenses; no hay total surcoreano consolidado" },
      { side: "Fuerzas norcoreanas", members: ["Corea del Norte", "Elementos de la 6.\u00aa Divisi\u00f3n de Infanter\u00eda"], casualties: "Sin cifra consolidada" }
    ],
    chronology: [
      { year: 1950, event: "El 2 de agosto, una columna de reconocimiento estadounidense encontr\u00f3 un ataque norcoreano en el paso." },
      { year: 1950, event: "Al anochecer, los atacantes se hab\u00edan retirado del contacto inmediato." }
    ],
    curationNote: "La campa\u00f1a es una agrupaci\u00f3n descriptiva. Las 90 bajas aproximadas no significan 90 muertos. Se excluyen las p\u00e9rdidas de Chindong-ni del 3 de agosto y las semanales de toda la divisi\u00f3n norcoreana. La clasificaci\u00f3n anterior en Am\u00e9rica proven\u00eda del pa\u00eds participante, no del lugar del combate."
  }),
  "Combate de Punk Hill (1777)": detail({
    parent: "Guerra de Independencia de Estados Unidos", campaign: "Guerra de forrajeo en Nueva Jersey (1777)", year: 1777,
    region: "Punk Hill, Amboy, Bonhamtown y Metuchen, Nueva Jersey, Estados Unidos",
    sources: [SOURCES.punkHill, SOURCES.maxwell], conflictType: "independencia", datePrecision: "8 de marzo de 1777",
    cause: "Una salida brit\u00e1nica desde Amboy, con artiller\u00eda y carros, fue interceptada por las tropas de William Maxwell durante la guerra de forrajeo.",
    outcome: "Ventaja t\u00e1ctica estadounidense; la fuerza brit\u00e1nica retrocedi\u00f3 hacia Bonhamtown y Metuchen.",
    consequences: "La falta de cobertura limit\u00f3 la persecuci\u00f3n estadounidense. Fue una acci\u00f3n local, no el cierre de la guerra de independencia.",
    participants: [
      { side: "Fuerzas independentistas estadounidenses", members: ["Tropas de William Maxwell", "Milicias de Pensilvania", "Tropas de Nueva Inglaterra"], casualties: "Sin total consolidado; la ausencia de cifras no equivale a cero" },
      { side: "Fuerzas brit\u00e1nicas", members: ["Ej\u00e9rcito brit\u00e1nico"], casualties: "El relato estadounidense menciona muertos y prisioneros; no se consolida un total" }
    ],
    chronology: [
      { year: 1777, event: "El 8 de marzo, tropas brit\u00e1nicas salieron de Amboy y ocuparon Punk Hill." },
      { year: 1777, event: "El enfrentamiento se extendi\u00f3 hacia Bonhamtown y Metuchen; la persecuci\u00f3n no continu\u00f3 por falta de cobertura." }
    ],
    curationNote: "Se distingue el combate de otros encuentros de 1777 en Amboy. Las estimaciones del relato estadounidense no se presentan como un recuento independiente de bajas. El enlace con Reino Unido representa al bando brit\u00e1nico hist\u00f3rico."
  })
};
