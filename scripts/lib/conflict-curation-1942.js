function makeCuratedBattle({ parent, type = "batalla", scope = "regional", region, year = 1942, cause, sides, outcome, consequences, related = [] }) {
  return {
    parent,
    type,
    scope,
    region,
    cause,
    chronology: [{ year, text: `${type === "campana" ? "Campana" : "Combate"} dentro de ${parent}.` }],
    related: [parent, ...related],
    participants: sides.map(side => ({
      side: side.side,
      members: side.members,
      organizations: side.organizations || [],
      troops: side.troops || "fuerzas variables",
      casualties: side.casualties || "inciertas"
    })),
    outcome,
    consequences
  };
}

export const WWII_1942_SAFE_CONFLICT_RENAMES = {
  "Batalla de la BahÃƒÂ­a de Milne": "Batalla de la Bahia de Milne",
  "Batalla de Mount Austen, Galloping Horse, y Sea Horse": "Batalla de Mount Austen, Galloping Horse y Sea Horse",
  "Batalla de Tjiater Pass": "Batalla del paso de Tjiater",
  "Batalla del Edson Ridge": "Batalla de la cresta de Edson",
  "Batalla de Mount Austen, Galloping Horse y Sea Horse": "Batalla de Mount Austen-Galloping Horse-Sea Horse",
  "Batalla de Port Moresby": "Campana de Port Moresby",
  "Batalla de Slim River": "Batalla del rio Slim",
  "Batalla del Estrecho Badung": "Batalla del estrecho de Badung",
  "Batalla de Koromokina Lagoon": "Batalla de la laguna Koromokina",
  "Batalla de Munda Point": "Batalla de Munda Point",
  "Batalla de Northern Burma y Western Yunnan": "Campana del norte de Birmania y oeste de Yunnan"
};

export const WWII_1942_CONFLICT_DETAIL_FIXES = {
  "Batalla de Alam el Halfa": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Africa del Norte",
    cause: "El Eje intento envolver las posiciones britanicas en Egipto antes de El Alamein.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Commonwealth"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Victoria defensiva aliada.",
    consequences: "Freno la ultima ofensiva importante de Rommel hacia Egipto y preparo la contraofensiva aliada."
  }),
  "Batalla de Bir Hakeim": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Libia",
    cause: "Fuerzas de la Francia Libre defendieron una posicion clave durante la batalla de Gazala.",
    sides: [{ side: "Aliados", members: ["Francia Libre", "Reino Unido"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Retirada aliada tras resistencia prolongada.",
    consequences: "La defensa retraso al Eje y fortalecio el prestigio militar de la Francia Libre."
  }),
  "Batalla de Gazala": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Libia",
    cause: "El Eje busco romper la linea aliada en Cirenaica y avanzar hacia Egipto.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Commonwealth", "Francia Libre"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Victoria del Eje.",
    consequences: "Provoco la caida de Tobruk y abrio el avance hacia El Alamein."
  }),
  "Primera Batalla de El Alamein": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Egipto",
    cause: "Los Aliados intentaron detener el avance del Eje hacia Alejandria y el canal de Suez.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Commonwealth"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Avance del Eje detenido.",
    consequences: "Estabilizo el frente egipcio y evito una ruptura estrategica hacia Suez."
  }),
  "Segunda batalla de El Alamein": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Egipto",
    cause: "Montgomery lanzo una ofensiva para expulsar al Eje de Egipto.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Commonwealth"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Victoria aliada decisiva.",
    consequences: "Inicio la retirada del Eje de Africa del Norte y cambio el equilibrio estrategico regional."
  }),
  "Batalla de Midway": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    scope: "mundial",
    region: "Pacifico",
    cause: "Japon intento destruir portaaviones estadounidenses y ampliar su perimetro defensivo.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria naval estadounidense decisiva.",
    consequences: "Cambio el equilibrio de portaaviones en el Pacifico y marco un punto de inflexion estrategico."
  }),
  "Batalla de Java": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Indias Orientales Neerlandesas",
    cause: "Japon avanzo sobre Java para controlar recursos y cerrar la defensa aliada del sudeste asiatico.",
    sides: [{ side: "Aliados", members: ["Paises Bajos", "Estados Unidos", "Reino Unido", "Australia"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "Consolido el dominio japones sobre las Indias Orientales Neerlandesas."
  }),
  "Batalla de Singapur": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Sudeste asiatico",
    cause: "Japon culmino la campana de Malasia atacando la principal base britanica regional.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia", "India britanica"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa decisiva.",
    consequences: "Fue una de las mayores capitulaciones britanicas y transformo el equilibrio colonial en Asia."
  }),
  "Batalla de Buna-Gona": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Nueva Guinea",
    cause: "Los Aliados atacaron cabezas de playa japonesas tras frenar el avance hacia Port Moresby.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Australia"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria aliada.",
    consequences: "Expulso a Japon de posiciones clave en la costa norte de Papua, con fuertes bajas."
  }),
  "Batalla de la Bahia de Milne": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Nueva Guinea",
    cause: "Japon intento capturar aerodromos aliados en Milne Bay.",
    sides: [{ side: "Aliados", members: ["Australia", "Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria aliada.",
    consequences: "Fue una de las primeras derrotas terrestres japonesas claras en el Pacifico."
  }),
  "Batalla naval de Guadalcanal": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    region: "Islas Salomon",
    cause: "Estados Unidos y Japon disputaron el control maritimo alrededor de Guadalcanal.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estrategica estadounidense.",
    consequences: "Aseguro el abastecimiento aliado de Guadalcanal y debilito la capacidad japonesa de recuperar la isla."
  }),
  "Batalla por el Campo Henderson": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Guadalcanal",
    cause: "Japon intento recuperar el aerodromo Henderson, clave para el control de Guadalcanal.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Preservo la superioridad aerea aliada local y marco el fracaso japones en la isla."
  }),
  "Batalla de las islas Santa Cruz": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    region: "Pacifico sur",
    cause: "Las flotas de portaaviones chocaron durante la campana de Guadalcanal.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria tactica japonesa con desgaste estrategico.",
    consequences: "Japon sufrio perdidas de aviadores dificiles de reemplazar, pese a danar a la flota estadounidense."
  }),
  "Batalla de Balikpapan": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Borneo",
    cause: "Japon avanzo sobre instalaciones petroleras estrategicas en las Indias Orientales Neerlandesas.",
    sides: [{ side: "Japon", members: ["Japon"] }, { side: "Aliados", members: ["Paises Bajos", "Estados Unidos"] }],
    outcome: "Victoria japonesa.",
    consequences: "Aseguro recursos energeticos clave para la expansion japonesa temprana."
  }),
  "Batalla de Bukit Timah": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Singapur",
    cause: "Japon ataco una zona clave de reservas y comunicaciones durante la batalla de Singapur.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia", "India britanica"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "Acelero el colapso defensivo aliado en Singapur."
  }),
  "Batalla de El Agheila": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Libia",
    cause: "El Eje intento retrasar la persecucion aliada tras El Alamein.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Commonwealth"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Retirada del Eje.",
    consequences: "Permitio a los Aliados continuar el avance hacia Tripolitania."
  }),
  "Batalla de Kranji": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Singapur",
    cause: "Japon cruzo hacia Singapur y presiono las defensas britanicas y de la Commonwealth.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia", "India britanica"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "Abrio otro punto de ruptura en la defensa de Singapur."
  }),
  "Batalla de la cresta de Edson": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Guadalcanal",
    cause: "Japon intento recuperar el aerodromo Henderson mediante ataques terrestres nocturnos.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Reforzo la defensa de Henderson Field y desgasto a las fuerzas japonesas en Guadalcanal."
  }),
  "Batalla de Mount Austen-Galloping Horse-Sea Horse": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Guadalcanal",
    year: 1943,
    cause: "Estados Unidos ataco posiciones japonesas en alturas interiores de Guadalcanal.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Contribuyo a despejar Guadalcanal y a cerrar la campana terrestre de la isla."
  }),
  "Batalla de Muar": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Malasia",
    cause: "Fuerzas aliadas intentaron frenar el avance japones hacia Singapur.",
    sides: [{ side: "Aliados", members: ["Australia", "Reino Unido", "India britanica"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "La derrota aliada abrio la retirada hacia Singapur y dejo graves perdidas australianas e indias."
  }),
  "Campana de Port Moresby": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "campana",
    region: "Nueva Guinea",
    cause: "Japon intento capturar Port Moresby para amenazar Australia y controlar rutas del Pacifico suroccidental.",
    sides: [{ side: "Aliados", members: ["Australia", "Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Fracaso japones.",
    consequences: "Port Moresby siguio como base aliada clave para la contraofensiva en Nueva Guinea."
  }),
  "Batalla del rio Slim": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Malasia",
    cause: "Japon empleo blindados e infiltracion para romper defensas aliadas durante la campana de Malasia.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "India britanica"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa decisiva.",
    consequences: "Acelero la retirada aliada hacia Singapur."
  }),
  "Batalla de Timor": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Timor",
    cause: "Japon invadio Timor para asegurar posiciones entre las Indias Orientales y Australia.",
    sides: [{ side: "Aliados", members: ["Australia", "Paises Bajos", "Timor portugues"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Ocupacion japonesa con resistencia aliada irregular.",
    consequences: "La campana mantuvo presion japonesa pero tambien una resistencia de comandos aliada prolongada."
  }),
  "Batalla de Tulagi y Gavutu-Tanambogo": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Islas Salomon",
    cause: "Estados Unidos desembarco para asegurar posiciones cercanas a Guadalcanal.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Aseguro bases menores y apoyo el inicio de la campana de Guadalcanal."
  }),
  "Batalla del estrecho de Badung": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    region: "Indias Orientales Neerlandesas",
    cause: "Fuerzas navales aliadas intentaron interferir con desembarcos japoneses en Bali.",
    sides: [{ side: "Aliados", members: ["Paises Bajos", "Estados Unidos", "Reino Unido"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "Mostro la debilidad coordinativa aliada en las Indias Orientales al inicio de 1942."
  }),
  "Batalla del estrecho de la Sonda": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    region: "Indias Orientales Neerlandesas",
    cause: "Buques aliados intentaron escapar tras la derrota del mar de Java y chocaron con fuerzas japonesas.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Australia"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "La perdida de cruceros aliados confirmo el colapso naval aliado en Java."
  }),
  "Batalla del paso de Tjiater": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Java",
    cause: "Japon avanzo sobre defensas neerlandesas y aliadas en Java.",
    sides: [{ side: "Aliados", members: ["Paises Bajos", "Reino Unido"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "Contribuyo a la rendicion final de las fuerzas aliadas en Java."
  }),
  "Batalla de Arawe": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Nueva Bretana",
    year: 1943,
    cause: "Estados Unidos desembarco en Arawe para distraer y fijar fuerzas japonesas antes de operaciones mayores en Nueva Bretana.",
    sides: [{ side: "Aliados", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria aliada.",
    consequences: "Apoyo la campana de Nueva Bretana y ayudo a aislar Rabaul."
  }),
  "Batalla de Attu": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Islas Aleutianas",
    year: 1943,
    cause: "Estados Unidos busco recuperar Attu tras la ocupacion japonesa de las Aleutianas occidentales.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Canada"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Elimino una posicion japonesa en territorio estadounidense y preparo la evacuacion japonesa de Kiska."
  }),
  "Batalla de Centuripe": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Sicilia",
    year: 1943,
    cause: "Fuerzas britanicas avanzaron por el interior siciliano para quebrar la defensa del Eje.",
    sides: [{ side: "Aliados", members: ["Reino Unido"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Victoria britanica.",
    consequences: "Abrio el avance aliado hacia Adrano y debilito la linea defensiva del Eje en Sicilia."
  }),
  "Batalla de Coconut Grove": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Bougainville",
    year: 1943,
    cause: "Marines estadounidenses aseguraron posiciones alrededor de la cabeza de playa de Torokina.",
    sides: [{ side: "Aliados", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Fortalecio el perimetro aliado en Bougainville durante la campana de las Salomon."
  }),
  "Batalla de Dumpu": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Nueva Guinea",
    year: 1943,
    cause: "Fuerzas australianas avanzaron por el valle de Ramu para presionar posiciones japonesas en Nueva Guinea.",
    sides: [{ side: "Aliados", members: ["Australia", "Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria aliada.",
    consequences: "Facilito la campana de Finisterre Range y el avance aliado hacia Madang."
  }),
  "Batalla de Enogai": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Nueva Georgia",
    year: 1943,
    cause: "Estados Unidos busco cortar posiciones japonesas y apoyar la ofensiva sobre Munda.",
    sides: [{ side: "Aliados", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Aseguro una posicion clave en Nueva Georgia y apoyo el avance aliado en las Islas Salomon."
  }),
  "Batalla de Gela": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Sicilia",
    year: 1943,
    cause: "El Eje contraataco los desembarcos aliados de la Operacion Husky en el sector de Gela.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Reino Unido"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Victoria defensiva aliada.",
    consequences: "Consolido la cabeza de playa aliada y permitio continuar la invasion de Sicilia."
  }),
  "Batalla de Hill 609": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Tunez",
    year: 1943,
    cause: "Estados Unidos ataco una altura clave para romper defensas del Eje durante la campana de Tunez.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Francia"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Fue un paso importante en la maduracion tactica estadounidense tras Kasserine."
  }),
  "Batalla de Kaiapit": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Nueva Guinea",
    year: 1943,
    cause: "Australia busco capturar una posicion interior para abrir aerodromos y rutas de avance en el valle de Markham.",
    sides: [{ side: "Aliados", members: ["Australia"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria australiana.",
    consequences: "Permitio desarrollar bases aereas aliadas y acelerar operaciones en Nueva Guinea."
  }),
  "Batalla de Kolombangara": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    region: "Islas Salomon",
    year: 1943,
    cause: "Fuerzas navales aliadas y japonesas chocaron durante los intentos de abastecer o interceptar guarniciones en Nueva Georgia.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Nueva Zelanda"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria tactica japonesa.",
    consequences: "Reforzo la dificultad aliada para cortar movimientos nocturnos japoneses, aunque la campana terrestre siguio favoreciendo a los Aliados."
  }),
  "Batalla de Hellzapoppin Ridge y Hill 600A": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Bougainville",
    year: 1943,
    cause: "Marines estadounidenses atacaron posiciones japonesas dentro del perimetro de Bougainville.",
    sides: [{ side: "Aliados", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Fortalecio la cabeza de playa aliada en Bougainville y desgasto defensas japonesas interiores."
  }),
  "Batalla de Horaniu": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    region: "Islas Salomon",
    year: 1943,
    cause: "Japon intento establecer una base de barcazas para sostener evacuaciones y abastecimiento en Vella Lavella.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Nueva Zelanda"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Resultado tactico disputado.",
    consequences: "Los japoneses pudieron continuar movimientos limitados, pero la presion aliada sobre las Salomon siguio aumentando."
  }),
  "Batalla de la laguna Koromokina": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Bougainville",
    year: 1943,
    cause: "Japon contraataco el perimetro aliado de Torokina tras los desembarcos en Bougainville.",
    sides: [{ side: "Aliados", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria defensiva estadounidense.",
    consequences: "Ayudo a consolidar la cabeza de playa de Bougainville."
  }),
  "Batalla de Kos": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Dodecaneso",
    year: 1943,
    cause: "Tras la rendicion italiana, Reino Unido y Alemania disputaron el control de islas estrategicas del Egeo.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Italia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria alemana.",
    consequences: "La perdida de Kos debilito la posicion aliada en el Dodecaneso y anticipo la caida de Leros."
  }),
  "Batalla de la Isla Rennell": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    region: "Islas Salomon",
    year: 1943,
    cause: "Aviacion japonesa ataco fuerzas navales estadounidenses que cubrian operaciones alrededor de Guadalcanal.",
    sides: [{ side: "Aliados", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria tactica japonesa.",
    consequences: "Fue una de las ultimas acciones japonesas exitosas durante la evacuacion de Guadalcanal."
  }),
  "Batalla de Leros": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Dodecaneso",
    year: 1943,
    cause: "Alemania busco recuperar islas del Egeo tomadas por fuerzas britanicas e italianas tras el armisticio italiano.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Italia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria alemana.",
    consequences: "Puso fin a la principal tentativa aliada de sostener el Dodecaneso en 1943."
  }),
  "Batalla de Munda Point": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Nueva Georgia",
    year: 1943,
    cause: "Estados Unidos ataco el aerodromo japones de Munda para avanzar en la campana de las Islas Salomon.",
    sides: [{ side: "Aliados", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "La captura del aerodromo facilito nuevas operaciones aliadas hacia Bougainville."
  }),
  "Campana del norte de Birmania y oeste de Yunnan": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "campana",
    scope: "regional",
    region: "Birmania y Yunnan",
    year: 1943,
    cause: "Aliados y China buscaron reabrir comunicaciones terrestres con China y expulsar a Japon del norte de Birmania.",
    sides: [{ side: "Aliados", members: ["China", "Estados Unidos", "Reino Unido", "India britanica"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Avance aliado gradual.",
    consequences: "Permitio recuperar rutas logisticas y preparo la reapertura de la carretera de Birmania."
  }),
  "Batalla de Piva Forks": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Bougainville",
    year: 1943,
    cause: "Japon intento presionar el perimetro estadounidense alrededor de Cabo Torokina.",
    sides: [{ side: "Aliados", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Consolido el control aliado del sector interior de Bougainville."
  }),
  "Batalla de Sattelberg": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Nueva Guinea",
    year: 1943,
    cause: "Australia ataco una posicion elevada japonesa que dominaba rutas cercanas a Finschhafen.",
    sides: [{ side: "Aliados", members: ["Australia"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria australiana.",
    consequences: "Mejoro la seguridad aliada en la peninsula de Huon."
  }),
  "Batalla de Scarlet Beach": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Nueva Guinea",
    year: 1943,
    cause: "Fuerzas australianas desembarcaron cerca de Finschhafen para avanzar por la peninsula de Huon.",
    sides: [{ side: "Aliados", members: ["Australia", "Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria aliada.",
    consequences: "Establecio una cabeza de playa clave para capturar Finschhafen."
  })
};
