function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Newry Road (1993)";
const PARENT = "Conflicto de Irlanda del Norte";
const CAMPAIGN = "Operacion Banner: operaciones aereas en South Armagh (1993)";

const SOURCES = {
  harnden: source(
    "Toby Harnden, Bandit Country (2000), p. 397: fecha, localizacion, participantes, intercambio de fuego y recuperacion posterior de armas en Newry Road",
    "https://books.google.com/books/about/Bandit_Country.html?id=guyGAAAAIAAJ"
  ),
  cain1993: source(
    "CAIN, Ulster University: cronologia de 1993 y contexto politico del conflicto de Irlanda del Norte",
    "https://cain.ulster.ac.uk/othelem/chron/ch93.htm"
  ),
  vanDerBijl: source(
    "Nick van der Bijl, Operation Banner (2009), p. 82: contexto operacional britanico y efectos posteriores sobre la aviacion militar",
    "https://books.google.com/books?id=EoeuCAAAQBAJ"
  ),
  republicanAccount: source(
    "An Phoblacht, 7 de julio de 1994: version republicana del combate; se usa para contrastar, no para fijar por si sola armas, duracion o danos",
    "https://cedarlounge.files.wordpress.com/2010/01/ap-july-94.pdf",
    "media"
  )
};

function newryRoad1993Fix() {
  const hierarchySources = [SOURCES.harnden, SOURCES.cain1993, SOURCES.vanDerBijl, SOURCES.republicanAccount];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate aereo-terrestre",
    conflictType: "insurgencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1993,
    endYear: 1993,
    region: "Newry Road, al este de Crossmaglen, condado de Armagh, Irlanda del Norte",
    normalizedRegion: "South Armagh, Irlanda del Norte",
    cause: "Una unidad motorizada de la Brigada South Armagh del Ejercito Republicano Irlandes Provisional abrio fuego contra helicopteros que despegaban de la base britanica de Crossmaglen durante la Operacion Banner. La ficha lo sitia dentro del Conflicto de Irlanda del Norte sin convertir el episodio en una disputa interestatal entre Reino Unido e Irlanda.",
    outcome: "Sin resultado tactico concluyente. Un Puma y un Lynx resultaron danados segun las sintesis secundarias, mientras que la unidad del IRA Provisional se retiro; las fuerzas de seguridad recuperaron armas despues de la accion. Las fuentes revisadas no acreditan muertos ni heridos confirmados de ninguno de los bandos.",
    consequences: "El combate ilustro la capacidad de la insurgencia para atacar medios aereos en South Armagh y la persistencia de la violencia armada antes del proceso de paz. La historiografia militar asocia el episodio con ajustes posteriores de proteccion y coordinacion de helicopteros, pero no con un cambio territorial o un acuerdo de cierre propio.",
    chronology: [
      {
        year: 1993,
        event: "El 23 de septiembre, una unidad de la Brigada South Armagh del IRA Provisional ataco helicopteros que despegaban de Crossmaglen; el enfrentamiento continuo por Newry Road, al este de la localidad."
      },
      {
        year: 1993,
        event: "Tras el intercambio de fuego, los integrantes de la unidad se retiraron. Las fuerzas de seguridad informaron la recuperacion posterior de una ametralladora pesada, dos ligeras y un fusil; la ficha no transforma esa recuperacion en bajas personales."
      },
      {
        year: 1998,
        event: "El Acuerdo de Viernes Santo formo parte del arreglo politico posterior del Conflicto de Irlanda del Norte, sin ser un tratado de cierre especifico para este combate."
      }
    ],
    treaties: ["Acuerdo de Viernes Santo (1998): arreglo posterior del conflicto, no cierre especifico de la accion"],
    related: [PARENT, CAMPAIGN, "Brigada South Armagh del IRA Provisional", "Crossmaglen", "Operacion Banner"],
    participants: [
      {
        side: "Ejercito Republicano Irlandes Provisional (IRA Provisional)",
        members: ["Ejercito Republicano Irlandes Provisional (IRA Provisional)", "Brigada South Armagh"],
        casualties: "Las sintesis revisadas no acreditan muertos ni heridos personales confirmados. Se informa recuperacion posterior de armamento, con cantidades y circunstancias que no se usan como una cifra de bajas."
      },
      {
        side: "Fuerzas de seguridad britanicas",
        members: ["Ejercito Britanico", "Army Air Corps", "Royal Air Force", "helicoptero Puma", "helicopteros Lynx", "1.er Batallon del Regimiento del Duque de Edimburgo"],
        casualties: "Las sintesis revisadas no acreditan muertos ni heridos personales confirmados. Se registran danos a un Puma y un Lynx, pero no una evaluacion tecnica unica de esos danos."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "23 de septiembre de 1993",
    sourceDispute: "El nombre Battle of Newry Road se usa en la historiografia y en la prensa secundaria para un tiroteo en movimiento, no para una operacion con un resultado estrategico formal. Harnden y la prensa contemporanea citada por estudios secundarios coinciden en la fecha, Crossmaglen y los participantes generales. La version republicana publicada en An Phoblacht difiere sobre armas, duracion, volumen de fuego y danos. CAIN contextualiza el escenario politico de la fecha, pero no publica una ficha independiente de este incidente. Por eso GeoRisk conserva un resultado no concluyente, no fija bajas, no toma una version de fuego como definitiva y no asigna el hecho a la Republica de Irlanda.",
    curationPriority: "alta",
    curationBatch: "source-backed-newry-road-1993-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior quedaba como una batalla interestatal sin fecha, contraparte ni jerarquia verificable dentro de un conflicto europeo generico. Se normaliza como Batalla de Newry Road (1993), se vincula al Conflicto de Irlanda del Norte y se preserva el caracter disputado de sus detalles. Reino Unido representa el marco territorial e institucional de la ficha contemporanea; no implica la participacion de la Republica de Irlanda."
  };
}

export const NEWRY_ROAD_1993_CONFLICT_RENAMES = {
  "Batalla de Newry Road": CANONICAL,
  "Batalla de Newry Road (1993)": CANONICAL,
  "Battle of Newry Road": CANONICAL,
  "Battle of Newry Road (1993)": CANONICAL
};

export const NEWRY_ROAD_1993_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: newryRoad1993Fix()
};
