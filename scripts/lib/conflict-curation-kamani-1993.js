function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Kamani (1993)";
const PARENT = "Guerra de Abjasia";
const CAMPAIGN = "Ofensivas abjasias sobre Sujumi de 1993";

const SOURCES = {
  unitedNationsCommission: source(
    "Naciones Unidas, informe de la Comision de Derechos Humanos: inicio del conflicto el 14 de agosto de 1992, combates intensos en el frente del Gumista en junio y julio de 1993, alto el fuego de Sochi y ofensiva de septiembre",
    "https://documents.un.org/api/symbol/access?l=en&s=S%2F26795&t=pdf"
  ),
  humanRightsWatch: source(
    "Human Rights Watch, informe de 1995: evolucion militar de la guerra, ofensivas sobre Sujumi, proteccion de civiles y papel complejo de actores rusos",
    "https://www.hrw.org/reports/1995/Georgia2.htm"
  ),
  marylandUniversityStudy: source(
    "Universidad de Maryland, estudio doctoral de Carter Johnson: ubica los ataques contra Shroma y Kamani en julio de 1993 dentro de una estrategia sobre Sujumi desde el norte",
    "https://api.drum.lib.umd.edu/server/api/core/bitstreams/892fafc3-7f72-4acd-a7ea-cdbe653df133/content",
    "media"
  )
};

const HIERARCHY_SOURCES = Object.values(SOURCES);

function abkhaziaWarFix() {
  return {
    type: "guerra secesionista",
    conflictType: "civil",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1992,
    endYear: 1993,
    region: "Abjasia, Georgia, y zonas del noreste del mar Negro",
    normalizedRegion: "Abjasia, Georgia, y zonas del noreste del mar Negro",
    cause: "Las tensiones politicas y constitucionales sobre el estatus de Abjasia se agravaron tras la disolucion sovietica. El 14 de agosto de 1992, fuerzas gubernamentales georgianas entraron en Abjasia y el conflicto paso a una fase armada abierta.",
    outcome: "Tras las ofensivas de 1993, las fuerzas abjasias recuperaron el control de la mayor parte del territorio que habia estado bajo control gubernamental georgiano, incluida Sujumi. La guerra no resolvio el estatus politico de Abjasia y dejo una disputa prolongada sobre seguridad, retorno y representacion.",
    consequences: "El conflicto produjo desplazamientos masivos y graves violaciones de derechos humanos denunciadas contra actores de ambos lados. La ficha no agrega un total unico de bajas porque los recuentos, fechas de corte y responsabilidades atribuidas no son homogeneos entre las fuentes.",
    chronology: [
      {
        year: 1992,
        event: "El 14 de agosto, fuerzas gubernamentales georgianas entraron en Abjasia y comenzo la fase armada abierta del conflicto."
      },
      {
        year: 1992,
        event: "El 2 de octubre, fuerzas abjasias retomaron Gagra; el frente del Gumista siguio siendo un eje central de combate."
      },
      {
        year: 1993,
        event: "En junio y julio hubo combates intensos en el frente del Gumista y ofensivas sobre Sujumi, incluido el entorno de Kamani."
      },
      {
        year: 1993,
        event: "El 27 de julio se firmo en Sochi un alto el fuego que preveia la retirada de tropas y armamento pesado georgiano al este del Gumista."
      },
      {
        year: 1993,
        event: "El 16 de septiembre se reanudo una ofensiva abjasia; Sujumi cayo el 27 de septiembre y las fuerzas abjasias recuperaron las zonas antes controladas por el Gobierno georgiano."
      }
    ],
    treaties: [
      "Alto el fuego de Sochi (27 de julio de 1993)",
      "Acuerdo de entendimiento (1 de diciembre de 1993), sin resolver el estatus politico final"
    ],
    related: [
      CAMPAIGN,
      CANONICAL,
      "Batalla de Gagra",
      "Batalla de Sujumi (1992)",
      "Batalla de Sujumi (1993)",
      "Sitio de Tkvarcheli",
      "Ofensiva de enero de 1993 en Abjasia",
      "Ofensiva de marzo de 1993 en Abjasia",
      "Ofensiva de julio de 1993 en Abjasia"
    ],
    participants: [
      {
        side: "Gobierno georgiano y fuerzas aliadas en Abjasia",
        members: ["Georgia", "Guardia Nacional de Georgia", "unidades paramilitares georgianas", "voluntarios georgianos"],
        casualties: "No consolidadas: las fuentes documentan miles de muertos y heridos a lo largo de dieciseis meses, pero no ofrecen una serie bilateral unica, comparable y libre de disputas para toda la guerra."
      },
      {
        side: "Fuerzas abjasias y combatientes aliados",
        members: ["Fuerzas abjasias", "combatientes locales abjasios", "voluntarios procedentes del norte del Caucaso"],
        casualties: "No consolidadas: la composicion de las fuerzas y los partes de bajas variaron por frente y periodo; la ficha no suma estimaciones parciales ni presenta a todos los aliados irregulares como una cadena de mando unica."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: HIERARCHY_SOURCES.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "14 de agosto de 1992 a septiembre de 1993; alto el fuego de Sochi el 27 de julio de 1993",
    sourceDispute: "Las fuentes coinciden en el periodo 1992-1993, las fases del frente del Gumista y el alto el fuego de Sochi, pero difieren en la caracterizacion politica, la cadena de mando de aliados irregulares, la responsabilidad concreta de actores externos y los recuentos de bajas. La clasificacion civil describe el caracter intraestatal y secesionista de la guerra; no resuelve la disputa de estatus de Abjasia ni convierte a Rusia en un beligerante territorial equivalente a las partes principales.",
    curationPriority: "alta",
    curationBatch: "source-backed-kamani-abkhazia-1993-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa mostraba una guerra interestatal generica, con region inconsistente entre Georgia y Rusia y sin una fuerza abjasia identificada. Se conserva el enlace de Rusia por su papel militar, logistico, diplomatico y de mediacion documentado en las fuentes, pero la ficha separa ese contexto de los bandos principales y evita una atribucion simplificada de responsabilidad."
  };
}

function kamani1993Fix() {
  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate por localidad",
    conflictType: "civil",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1993,
    endYear: 1993,
    region: "Kamani, distrito de Sujumi, Abjasia, Georgia",
    normalizedRegion: "Kamani, distrito de Sujumi, Abjasia, Georgia",
    cause: "Kamani quedaba al norte de Sujumi, en un sector del frente del Gumista relevante para los accesos a la ciudad. Durante las ofensivas de julio de 1993, fuerzas abjasias atacaron Kamani y otras localidades del entorno dentro de una estrategia de presion sobre Sujumi desde el norte.",
    outcome: "Las fuerzas abjasias aseguraron Kamani durante la ofensiva de julio de 1993. La ficha no convierte ese resultado local en una explicacion unica de la posterior caida de Sujumi ni fija una cifra de victimas: los informes sobre abusos contra civiles y desplazamientos requieren lectura por fuente y por episodio.",
    consequences: "El combate modifico la situacion en el sector septentrional de Sujumi y se inserto en los enfrentamientos intensos del frente del Gumista. La investigacion posterior describe salida de poblacion georgiana de Kamani y Shroma, mientras que las fuentes internacionales registran graves violaciones de derechos humanos durante distintas fases de la guerra.",
    chronology: [
      {
        year: 1993,
        event: "El 1 de julio comenzo una tercera ofensiva abjasia sobre Sujumi, con combates intensos en el frente del Gumista."
      },
      {
        year: 1993,
        event: "Durante julio, Kamani y Shroma fueron atacadas como parte de una estrategia de avance sobre Sujumi desde el norte."
      },
      {
        year: 1993,
        event: "El 27 de julio entro en vigor el alto el fuego de Sochi, que encuadro temporalmente la operacion dentro de una nueva pausa del conflicto."
      }
    ],
    treaties: ["Alto el fuego de Sochi (27 de julio de 1993), marco posterior de la operacion"],
    related: [PARENT, CAMPAIGN, "Kamani", "Sujumi", "Shroma", "Frente del Gumista", "Batalla de Sujumi (1993)"],
    participants: [
      {
        side: "Fuerzas georgianas del sector de Sujumi",
        members: ["Georgia", "fuerzas gubernamentales georgianas", "Guardia Nacional de Georgia", "unidades locales de defensa"],
        casualties: "No consolidadas: las fuentes consultadas ubican el ataque y el frente, pero no ofrecen un parte bilateral verificable de efectivos, muertos, heridos, cautivos y poblacion civil afectada especificamente en Kamani."
      },
      {
        side: "Fuerzas abjasias y aliados del frente del Gumista",
        members: ["Fuerzas abjasias", "combatientes locales abjasios", "voluntarios procedentes del norte del Caucaso"],
        casualties: "No consolidadas: la documentacion distingue fuerzas regulares, voluntarios y actores irregulares de manera desigual; la ficha no atribuye una cifra unica ni una cadena de mando exhaustiva para el combate local."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: HIERARCHY_SOURCES.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "julio de 1993",
    sourceDispute: "Las fuentes institucionales y academicas consultadas situan Kamani en julio de 1993 y la vinculan con la ofensiva sobre Sujumi desde el norte, pero no armonizan una fecha diaria, una cadena de mando completa ni un recuento de bajas verificable para la localidad. Por ello la ficha conserva la precision mensual y no convierte acusaciones, testimonios o listas parciales en una cifra cerrada de victimas ni en atribuciones individuales de responsabilidad.",
    curationPriority: "alta",
    curationBatch: "source-backed-kamani-abkhazia-1993-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa no tenia fecha, ubicacion precisa, bando local identificable ni guerra padre real: estaba bajo un conflicto generico de Asia. Se normaliza con ano para evitar homonimos, se vincula a la Guerra de Abjasia y conserva una lectura cauta de los abusos contra civiles. El nombre geografico se usa para navegacion y no pretende resolver el estatus disputado de Abjasia."
  };
}

export const KAMANI_1993_CONFLICT_RENAMES = {
  "Batalla de Kamani": CANONICAL,
  "Batalla de Kamani (1993)": CANONICAL,
  "Battle of Kamani": CANONICAL,
  "Battle of Kamani (1993)": CANONICAL
};

export const KAMANI_1993_CONFLICT_DETAIL_FIXES = {
  [PARENT]: abkhaziaWarFix(),
  [CANONICAL]: kamani1993Fix()
};
