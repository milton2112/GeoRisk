const SOURCES = {
  gataCatalog: {
    label: "Museo Naval de Estados Unidos: cat\u00e1logo de la bandera de la Mashouda, capturada frente al cabo de Gata el 17 de junio de 1815",
    url: "https://www.govinfo.gov/content/pkg/SERIALSET-02645_00_00-007-0011-0000/pdf/SERIALSET-02645_00_00-007-0011-0000.pdf"
  },
  guerriere: {
    label: "Naval History and Heritage Command: Guerriere I, captura de la Meshuda y expedicion de Decatur de 1815",
    url: "https://www.history.navy.mil/research/histories/ship-histories/danfs/g/guerriere-i.html"
  },
  uniforms: {
    label: "Naval History and Heritage Command: Uniforms of the U.S. Navy 1815, sintesis con fecha divergente del 18 de junio",
    url: "https://www.history.navy.mil/browse-by-topic/heritage/uniforms-and-personal-equipment/uniforms-1815.html"
  },
  treaty: {
    label: "National Archives, Founders Online: James Madison al Senado, 6 de diciembre de 1815; tratado con Argel concluido el 30 de junio",
    url: "https://founders.archives.gov/documents/Madison/03-10-02-0063"
  },
  halifaxCatalog: {
    label: "Naval History and Heritage Command: NH 56479, combate del Observer y el Jack frente a Halifax en mayo de 1782",
    url: "https://www.history.navy.mil/our-collections/photography/numerical-list-of-images/nhhc-series/nh-series/NH-56000/NH-56479.html"
  },
  halifaxAccounts: {
    label: "Colonial Society of Massachusetts: Beverly Privateers in the American Revolution, relatos de los oficiales del Jack y el Observer",
    url: "https://www.colonialsociety.org/node/370"
  }
};

function navalFix({ parent, campaign, year, region, sources, ...detail }) {
  return {
    parent, war: parent, campaign,
    type: "batalla naval", conflictType: "interestatal", scale: "local",
    status: "historico", active: false, ongoing: false,
    startYear: year, endYear: year, region, normalizedRegion: region,
    related: [parent, campaign], treaties: [],
    hierarchyConfidence: "alta", hierarchySources: sources,
    curationPriority: "alta", curationBatch: "source-backed-gata-halifax-2026-09",
    curationStatus: "estructural", dataConfidence: "parcial", sourceDispute: true,
    ...detail
  };
}

export const GATA_HALIFAX_CONFLICT_RENAMES = {
  "Batalla del cabo de Gata": "Batalla del cabo de Gata (1815)",
  "Battle off Cape Gata": "Batalla del cabo de Gata (1815)",
  "Batalla naval de Halifax": "Batalla naval frente a Halifax (1782)",
  "Battle off Halifax (1782)": "Batalla naval frente a Halifax (1782)"
};

export const GATA_HALIFAX_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": ["Batalla del cabo de Gata (1815)", "Batalla naval frente a Halifax (1782)"],
  Argelia: ["Batalla del cabo de Gata (1815)"],
  "Espa\u00f1a": ["Batalla del cabo de Gata (1815)"],
  "Canad\u00e1": ["Batalla naval frente a Halifax (1782)"],
  "Reino Unido": ["Batalla naval frente a Halifax (1782)"]
};

export const GATA_HALIFAX_CONFLICT_DETAIL_FIXES = {
  "Batalla del cabo de Gata (1815)": navalFix({
    parent: "Segunda guerra berberisca (1815)",
    campaign: "Expedicion de Decatur contra Argel (1815)",
    year: 1815,
    region: "Frente al cabo de Gata, costa sudoriental de Espa\u00f1a, mar Mediterraneo",
    sources: [SOURCES.gataCatalog, SOURCES.guerriere, SOURCES.uniforms, SOURCES.treaty],
    scale: "internacional",
    cause: "La escuadra de Stephen Decatur fue enviada al Mediterraneo para detener las capturas de mercantes estadounidenses por la Regencia de Argel y poner fin al pago de tributos.",
    outcome: "Victoria estadounidense: la fragata argelina Mashouda se rindi\u00f3 ante la escuadra de Decatur, en la que combatieron la Guerriere y la Constellation.",
    consequences: "La captura precedi\u00f3 a la presion naval sobre Argel y al tratado del 30 de junio de 1815. Ese acuerdo suprimi\u00f3 el tributo estadounidense y dispuso la liberacion de cautivos y compensaciones; no fue un tratado firmado en el lugar de la batalla.",
    participants: [
      { side: "Escuadra estadounidense de Decatur", members: ["Estados Unidos", "USS Guerriere", "USS Constellation", "Stephen Decatur"], casualties: "No se consolida un total en esta ficha" },
      { side: "Fuerza naval de la Regencia de Argel", members: ["Regencia de Argel", "Fragata Mashouda"], casualties: "No se consolida un total en esta ficha" }
    ],
    chronology: [
      { year: 1815, event: "El 17 de junio, la escuadra estadounidense captur\u00f3 la Mashouda frente al cabo de Gata." },
      { year: 1815, event: "El 30 de junio se concluy\u00f3 en Argel un tratado de paz entre Estados Unidos y el dey de Argel." }
    ],
    treaties: ["Tratado de paz entre Estados Unidos y la Regencia de Argel (30 de junio de 1815)"],
    datePrecision: "17 de junio de 1815 seg\u00fan el cat\u00e1logo naval y DANFS; la s\u00edntesis de uniformes del NHHC indica el 18",
    curationNote: "La entrada previa situaba la accion en America por su enlace estadounidense. La localizaci\u00f3n frente a Espa\u00f1a sigue el cat\u00e1logo naval; DANFS usa la expresi\u00f3n costa argelina. Se adopta el 17 de junio por coincidencia del cat\u00e1logo y DANFS, conservando la discrepancia con la s\u00edntesis de uniformes. Espa\u00f1a se enlaza por la ubicaci\u00f3n, no como bando; Argelia remite a la Regencia historica, no al Estado actual. Mashouda, Meshuda y Mashuda son variantes del nombre del mismo buque. Las fuentes no se combinan para inventar bajas agregadas."
  }),
  "Batalla naval frente a Halifax (1782)": navalFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Guerra de corso frente a Nueva Escocia (1782)",
    year: 1782,
    region: "Frente a Halifax, Nueva Escocia, actual Canad\u00e1, Atlantico noroccidental",
    sources: [SOURCES.halifaxCatalog, SOURCES.halifaxAccounts],
    conflictType: "independencia",
    cause: "El corsario estadounidense Jack encontr\u00f3 al bergant\u00edn brit\u00e1nico Observer cuando este regresaba a Halifax. La accion se produjo en el contexto de la guerra de corso de la independencia estadounidense.",
    outcome: "Victoria brit\u00e1nica: el Jack se rindi\u00f3 al Observer despu\u00e9s del combate nocturno. El capit\u00e1n del corsario, David Ropes, recibi\u00f3 una herida mortal.",
    consequences: "El Jack fue llevado a Halifax y condenado como presa. La captura puso fin a ese crucero corsario; no se presenta como el cierre de la guerra de independencia.",
    participants: [
      { side: "Corsario estadounidense Jack", members: ["Corsario Jack de Salem", "David Ropes", "William Grey"], casualties: "Los relatos de ambos bandos difieren; no se consolida un total" },
      { side: "Bergant\u00edn brit\u00e1nico Observer", members: ["Royal Navy", "HMS Observer", "John Crymes"], casualties: "Los relatos de ambos bandos difieren; no se consolida un total" }
    ],
    chronology: [
      { year: 1782, event: "El 28 de mayo, el Jack encontr\u00f3 al Observer mientras este regresaba hacia Halifax." },
      { year: 1782, event: "El combate continu\u00f3 durante la noche y el Jack se rindi\u00f3 en la madrugada del 29 de mayo." }
    ],
    datePrecision: "Noche del 28 al 29 de mayo de 1782; el cat\u00e1logo NH 56479 registra el 29",
    curationNote: "Se identifica el enfrentamiento del Jack y el Observer, no otras acciones frente a Halifax. El nombre de campana agrupa descriptivamente la guerra de corso local, no designa una operacion formal. Canad\u00e1 se enlaza solo por la ubicaci\u00f3n actual: Nueva Escocia era brit\u00e1nica, y el Jack era un corsario, no un buque de la Marina Continental. El cat\u00e1logo y los relatos difieren en la duraci\u00f3n y las bajas; se conserva la secuencia nocturna sin fijar horas de combate ni un recuento \u00fanico."
  })
};
