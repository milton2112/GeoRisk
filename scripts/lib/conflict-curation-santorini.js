const name = "Incursion sobre Santorini (1944)";
const parent = "Segunda Guerra Mundial";
const region = "Santorini (Thera), islas Cicladas, Grecia, mar Egeo, Europa sudoriental";

export const SANTORINI_CONFLICT_RENAMES = {
  "Incursion sobre Santorini": name,
  "Incursi\u00f3n sobre Santorini": name,
  "Raid on Santorini": name
};

export const SANTORINI_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [name],
  Alemania: [name],
  Grecia: [name]
};

export const SANTORINI_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent, war: parent, campaign: "Incursiones aliadas en el Egeo (1944)", related: [parent],
    startYear: 1944, endYear: 1944, datePrecision: "Abril de 1944; d\u00eda exacto no consolidado",
    type: "batalla", conflictType: "interestatal", scale: "local",
    status: "historico", active: false, ongoing: false,
    region, normalizedRegion: region,
    cause: "Incursiones del SBS contra instalaciones y comunicaciones alemanas en el Egeo.",
    outcome: "Incursi\u00f3n local; la tesis NPS considera exitosas las operaciones simult\u00e1neas de las C\u00edcladas, sin dar un balance exclusivo y consolidado de Santorini.",
    consequences: "Fue una acci\u00f3n de la campa\u00f1a del Egeo, no la liberaci\u00f3n de Grecia ni el cierre de la guerra.",
    participants: [
      { side: "Fuerzas brit\u00e1nicas", members: ["Reino Unido", "Special Boat Squadron (SBS)"], casualties: "Sin total exclusivo de esta incursi\u00f3n en las fuentes institucionales citadas; no equivale a cero" },
      { side: "Guarnici\u00f3n alemana", members: ["Alemania", "Fuerzas alemanas de ocupaci\u00f3n en Santorini"], casualties: "Sin total exclusivo de esta incursi\u00f3n en las fuentes institucionales citadas; no equivale a cero" }
    ],
    chronology: [{ year: 1944, event: "En abril, el SBS realiz\u00f3 una incursi\u00f3n en Santorini dentro de sus operaciones en las C\u00edcladas." }],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      { label: "National Army Museum, presentaci\u00f3n de 2018: SBS, Santorini y contexto de la Segunda Guerra Mundial; no fecha de la incursi\u00f3n", url: "https://www.nam.ac.uk/whats-on/special-boat-squadron-second-world-war-band-renegade-cut-throats" },
      { label: "Naval Postgraduate School, Gartzonikas, tesis de 2003, pp. 47-48: operaciones de las C\u00edcladas; repositorio original", url: "https://hdl.handle.net/10945/6200" },
      { label: "Transcripci\u00f3n de terceros de la tesis NPS, pp. 47-48; copia consultada, no fuente independiente", url: "https://studyres.com/doc/14560623/amphibious-and-special-operations-in-the-aegean-sea" },
      { label: "Referencia enciclop\u00e9dica Raid on Santorini: 24 de abril; fecha contrastada, no arbitrada como definitiva", url: "https://en.wikipedia.org/wiki/Raid_on_Santorini" }
    ],
    sourceDispute: "La tesis NPS sit\u00faa la serie de incursiones de las C\u00edcladas en la noche del 22 de abril; la referencia enciclop\u00e9dica de Santorini indica 24 de abril. Se conserva abril de 1944 sin un d\u00eda definitivo.",
    curationPriority: "alta", curationBatch: "source-backed-santorini-2026-10",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "Las cifras de la serie de incursiones no se atribuyen a Santorini. La campa\u00f1a es descriptiva. Grecia vincula el territorio, no una unidad griega confirmada; no se agrega Italia sin confirmar su guarnici\u00f3n. La tesis se consult\u00f3 en una transcripci\u00f3n de terceros; el PDF institucional no pudo descargarse. Sin tratado de cierre verificado."
  }
};
