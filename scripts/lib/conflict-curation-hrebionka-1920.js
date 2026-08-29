function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Carga de Hrebionka (1920)";
const PARENT = "Guerra polaco-sovietica (1919-1921)";
const CAMPAIGN = "Ofensiva sovietica de julio de 1920";

const SOURCES = {
  internationalEncyclopediaWar: source(
    "International Encyclopedia of the First World War, articulo academico de Jaroslaw Centek: las hostilidades polaco-sovieticas comenzaron en 1919, la contraofensiva sovietica de 1920 avanzo hacia Minsk y Varsovia, y el cierre diplomatico llego con Riga en 1921",
    "https://encyclopedia.1914-1918-online.net/article/polish-soviet-war-1920-1921/"
  ),
  polishArmedForcesMagazine: source(
    "Polska Zbrojna, publicacion de las Fuerzas Armadas Polacas: la carga de Hrebionka del 9 de julio de 1920 permitio a soldados de la XII Brigada de Infanteria salir del cerco durante la ofensiva sovietica de julio",
    "https://www.polska-zbrojna.pl/home/articleshow/31620"
  ),
  centralMilitaryLibraryPeriodical: source(
    "Biblioteca Militar Central de Polonia, historia regimental digitalizada de 1937: registra la carga de Hrebionka el 9 de julio de 1920 por elementos del 4.o Regimiento de Ulanos Zaniemienjski para sostener la retirada polaca",
    "https://zbrojownia.cbw.wp.mil.pl/Content/12150/04089_INW_372_1937_NR_26.pdf",
    "media"
  ),
  instituteNationalRemembranceStudy: source(
    "Instituto de la Memoria Nacional de Polonia, estudio documental: situa a la unidad en Hrebionka el 9 de julio de 1920 durante acciones de retraso frente a la ofensiva bolchevique",
    "https://ipn.gov.pl/download/1/1202307/BalbusFakirtom2B5.pdf"
  )
};

function polishSovietWarFix() {
  const hierarchySources = [
    SOURCES.internationalEncyclopediaWar,
    SOURCES.polishArmedForcesMagazine,
    SOURCES.instituteNationalRemembranceStudy
  ];

  return {
    type: "guerra",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1919,
    endYear: 1921,
    region: "Europa oriental, con frentes en Polonia, Bielorrusia, Ucrania y Lituania",
    normalizedRegion: "Europa oriental, con frentes en Polonia, Bielorrusia, Ucrania y Lituania",
    cause: "La delimitacion de las fronteras tras la Primera Guerra Mundial, la guerra civil rusa y el enfrentamiento entre la Segunda Republica Polaca y la Rusia bolchevique llevaron a hostilidades abiertas desde 1919.",
    outcome: "La campana de 1920 termino con victorias polacas en la Vistula y el Niemen, seguidas por el armisticio de octubre de 1920 y el Tratado de Riga de marzo de 1921. La ficha distingue el fin de las operaciones principales de 1920 del cierre diplomatico de 1921.",
    consequences: "El Tratado de Riga establecio la frontera polaco-sovietica hasta 1939 y afecto el reparto politico de territorios de Bielorrusia y Ucrania. No convierte a los Estados contemporaneos vinculados por territorio o sucesion en copias exactas de los beligerantes de 1919-1921.",
    chronology: [
      {
        year: 1919,
        event: "Comenzaron los enfrentamientos armados entre fuerzas polacas y la Rusia bolchevique en el espacio fronterizo oriental."
      },
      {
        year: 1920,
        event: "Las ofensivas de 1920 llevaron la guerra a Bielorrusia, Ucrania y al avance sovietico hacia Varsovia; la carga de Hrebionka se produjo durante la ofensiva de julio."
      },
      {
        year: 1920,
        event: "Las victorias polacas en la Vistula y el Niemen condujeron a un armisticio en octubre."
      },
      {
        year: 1921,
        event: "El Tratado de Riga del 18 de marzo formalizo el cierre diplomatico de la guerra."
      }
    ],
    treaties: ["Tratado de Riga (18 de marzo de 1921)"],
    related: [CAMPAIGN, CANONICAL, "Batalla de Varsovia (1920)", "Batalla del Niemen (1920)", "Tratado de Riga"],
    participants: [
      {
        side: "Segunda Republica Polaca y aliados de la campana de 1920",
        members: ["Segunda Republica Polaca", "Ejercito Polaco", "Republica Popular Ucraniana"],
        casualties: "No consolidadas para toda la guerra: la ficha no suma partes de campanas y frentes distintos como si fueran una serie humana uniforme."
      },
      {
        side: "Rusia sovietica y fuerzas del Ejercito Rojo",
        members: ["Rusia sovietica", "Ejercito Rojo", "Republica Socialista Sovietica de Ucrania"],
        casualties: "No consolidadas para toda la guerra: los recuentos de bajas, prisioneros y efectivos dependen del frente, de la fecha de corte y de la fuente."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "hostilidades desde 1919; operaciones principales de 1920; cierre diplomatico el 18 de marzo de 1921",
    sourceDispute: "La periodizacion se presenta como 1919-1921 porque las hostilidades comenzaron en 1919 y el Tratado de Riga se firmo en marzo de 1921. Algunas obras nombran el conflicto como guerra de 1919-1920 al concentrarse en las operaciones principales y el armisticio de octubre de 1920. La ficha muestra ambas referencias y no consolida bajas heterogeneas de toda la guerra.",
    curationPriority: "alta",
    curationBatch: "source-backed-hrebionka-1920-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Este padre se incorpora para dar jerarquia verificable a la Carga de Hrebionka y no existia como entrada navegable en el dataset. Polonia y Rusia se enlazan como referencias contemporaneas de las entidades principales; Bielorrusia se relaciona con el combate por ubicacion actual, sin afirmar que fuera un beligerante estatal equivalente."
  };
}

function hrebionka1920Fix() {
  const hierarchySources = [
    SOURCES.polishArmedForcesMagazine,
    SOURCES.centralMilitaryLibraryPeriodical,
    SOURCES.instituteNationalRemembranceStudy,
    SOURCES.internationalEncyclopediaWar
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "carga de caballeria",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1920,
    endYear: 1920,
    region: "Hrebionka, frente bielorruso de la epoca; actual Bielorrusia",
    normalizedRegion: "Hrebionka, frente bielorruso de la epoca; actual Bielorrusia",
    cause: "Durante la ofensiva sovietica de julio, unidades del Ejercito Rojo presionaron a la XII Brigada de Infanteria polaca. La carga del 4.o Regimiento de Ulanos Zaniemienjski busco frenar la amenaza sobre la retirada de esa formacion.",
    outcome: "Victoria tactica polaca: la carga desorganizo el avance sovietico inmediato y ayudo a que elementos de la XII Brigada de Infanteria se retiraran del cerco. No revirtio la ofensiva sovietica de julio ni se presenta como una derrota decisiva de unidades completas del Ejercito Rojo.",
    consequences: "La accion se convirtio en una referencia conmemorativa del 4.o Regimiento de Ulanos Zaniemienjski. El repliegue polaco continuo y la situacion estrategica solo cambio con las operaciones posteriores de agosto y septiembre de 1920.",
    chronology: [
      {
        year: 1920,
        event: "El 4 de julio comenzo una ofensiva sovietica en el frente nororiental, que obligo a fuerzas polacas a retroceder."
      },
      {
        year: 1920,
        event: "El 9 de julio, elementos del 4.o Regimiento de Ulanos Zaniemienjski cargaron cerca de Hrebionka para sostener la retirada de la XII Brigada de Infanteria."
      },
      {
        year: 1920,
        event: "El repliegue polaco continuo durante julio; la correlacion estrategica se modifico despues con la contraofensiva de agosto."
      }
    ],
    treaties: ["Tratado de Riga (18 de marzo de 1921), cierre de la guerra amplia"],
    related: [PARENT, CAMPAIGN, "Hrebionka", "4.o Regimiento de Ulanos Zaniemienjski", "XII Brigada de Infanteria", "Batalla de Varsovia (1920)"],
    participants: [
      {
        side: "Fuerzas polacas de cobertura",
        members: ["Segunda Republica Polaca", "4.o Regimiento de Ulanos Zaniemienjski", "XII Brigada de Infanteria", "Wladyslaw Rozlau"],
        casualties: "No consolidadas: las fuentes institucionales describen la carga y su efecto sobre la retirada, pero no ofrecen un parte bilateral homogeneo de muertos, heridos, prisioneros y efectivos."
      },
      {
        side: "Fuerzas sovieticas de la ofensiva de julio",
        members: ["Rusia sovietica", "Ejercito Rojo", "Unidades de infanteria sovieticas del sector"],
        casualties: "No consolidadas: algunos relatos regimentalistas atribuyen la dispersion de varios regimientos, pero la ficha no transforma esas descripciones en un recuento humano ni en una destruccion confirmada de unidades completas."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "9 de julio de 1920",
    sourceDispute: "Las fuentes institucionales consultadas coinciden en la carga del 9 de julio de 1920, su funcion de cobertura y su relacion con la ofensiva sovietica de julio. Algunas bases secundarias sit\u00faan el episodio el 2 de julio o repiten que se destruyeron tres regimientos sovieticos; la ficha conserva la fecha respaldada por la Biblioteca Militar Central, Polska Zbrojna y el Instituto de la Memoria Nacional, y no convierte un relato regimental en una cifra cerrada de bajas o unidades destruidas.",
    curationPriority: "alta",
    curationBatch: "source-backed-hrebionka-1920-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Hrebionka, no tenia fecha, ubicacion, jerarquia ni participantes verificables y solo se vinculaba a Rusia bajo un conflicto europeo generico. Se normaliza como Carga de Hrebionka (1920), conserva a Rusia como referencia contemporanea de la fuerza sovietica, agrega Polonia por la unidad participante y Bielorrusia por la ubicacion actual. No presenta a los Estados contemporaneos como equivalentes automaticos de las entidades de 1920."
  };
}

export const HREBIONKA_1920_CONFLICT_RENAMES = {
  "Batalla de Hrebionka": CANONICAL,
  "Carga de Hrebionka": CANONICAL,
  "Carga de Hrebionka (1920)": CANONICAL,
  "Battle of Hrebionka": CANONICAL,
  "Charge of Hrebionka": CANONICAL,
  "Szarza pod Hrebionka": CANONICAL,
  "Szarza pod Hrebionka (1920)": CANONICAL
};

export const HREBIONKA_1920_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: [PARENT, CANONICAL],
  Rusia: [PARENT],
  Bielorrusia: [CANONICAL]
};

export const HREBIONKA_1920_CONFLICT_DETAIL_FIXES = {
  [PARENT]: polishSovietWarFix(),
  [CANONICAL]: hrebionka1920Fix()
};
