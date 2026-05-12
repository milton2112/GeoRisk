function makeCuratedBattle({ parent, type = "batalla", scope = "regional", region, year, cause, sides, outcome, consequences, related = [] }) {
  return {
    parent,
    type,
    scope,
    region,
    cause,
    chronology: [{ year, text: `${type === "sitio" ? "Operacion de sitio" : "Combate"} dentro de ${parent}.` }],
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

export const INTERWAR_SAFE_CONFLICT_RENAMES = {
  "Batalla de JuÃƒÂ¡rez": "Batalla de Juarez",
  "Primera Batalla de AlihuatÃƒÂ¡": "Primera Batalla de Alihuata",
  "Batalla del AtlÃƒÂ¡ntico": "Batalla del Atlantico",
  "Batalla de BÃƒÂ©lgica": "Batalla de Belgica",
  "Batalla de Cape Spada": "Batalla del cabo Spada",
  "Batalla de Raate Road": "Batalla de la carretera de Raate",
  "Batalla de SedÃƒÂ¡n (1940)": "Batalla de Sedan (1940)",
  "Batalla de Kleisoura Pass": "Batalla del paso de Kleisoura",
  "Batalla de Ypres-Comines Canal": "Batalla del canal Ypres-Comines",
  "Batalla de Metaxas Line": "Batalla de la linea Metaxas",
  "Batalla de Thermopylae": "Batalla de las Termopilas (1941)",
  "Batalla del Cabo MatapÃƒÂ¡n": "Batalla del cabo Matapan"
};

export const INTERWAR_CONFLICT_DETAIL_FIXES = {
  "Batalla de Juarez": makeCuratedBattle({
    parent: "Revolucion mexicana",
    region: "Chihuahua",
    year: 1919,
    cause: "Fuerzas villistas atacaron Ciudad Juarez en el contexto final de la Revolucion mexicana.",
    sides: [{ side: "Gobierno mexicano y Estados Unidos", members: ["Mexico", "Estados Unidos"] }, { side: "Villistas", members: ["Fuerzas villistas"] }],
    outcome: "Derrota villista.",
    consequences: "Reforzo el declive militar de Villa y mostro la sensibilidad fronteriza con Estados Unidos."
  }),
  "Batalla de Shenkursk": makeCuratedBattle({
    parent: "Intervencion aliada en la Guerra Civil rusa",
    region: "Rusia septentrional",
    year: 1919,
    cause: "Fuerzas bolcheviques atacaron posiciones aliadas y blancas en el norte ruso.",
    sides: [{ side: "Bolcheviques", members: ["Rusia sovietica"] }, { side: "Aliados y blancos", members: ["Estados Unidos", "Reino Unido", "Movimiento Blanco"] }],
    outcome: "Victoria bolchevique.",
    consequences: "Aumento el costo politico de la intervencion aliada y anticipo su retirada del norte ruso."
  }),
  "Batalla de La Flor": makeCuratedBattle({
    parent: "Guerra de Sandino",
    region: "Nicaragua",
    year: 1928,
    cause: "Las fuerzas sandinistas combatieron la ocupacion estadounidense y al gobierno apoyado por Washington.",
    sides: [{ side: "Estados Unidos y Guardia Nacional", members: ["Estados Unidos", "Nicaragua"] }, { side: "Sandinistas", members: ["Ejercito Defensor de la Soberania Nacional"] }],
    outcome: "Choque guerrillero de resultado limitado.",
    consequences: "Reflejo el caracter prolongado de la resistencia sandinista en zonas rurales."
  }),
  "Primera Batalla de Alihuata": makeCuratedBattle({
    parent: "Guerra del Chaco",
    region: "Chaco Boreal",
    year: 1933,
    cause: "Bolivia y Paraguay disputaron posiciones y lineas de abastecimiento en el Chaco.",
    sides: [{ side: "Bolivia", members: ["Bolivia"] }, { side: "Paraguay", members: ["Paraguay"] }],
    outcome: "Victoria paraguaya.",
    consequences: "Debilito posiciones bolivianas y contribuyo al giro de la guerra a favor de Paraguay."
  }),
  "Batalla del Atlantico": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "campana naval",
    scope: "mundial",
    region: "Atlantico",
    year: 1939,
    cause: "Alemania intento cortar las rutas logisticas aliadas mediante submarinos y guerra naval.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Estados Unidos", "Canada"] }, { side: "Eje", members: ["Alemania", "Italia"] }],
    outcome: "Victoria estrategica aliada.",
    consequences: "Aseguro el flujo logistico hacia Europa y fue esencial para sostener la guerra aliada."
  }),
  "Batalla de Belgica": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Europa occidental",
    year: 1940,
    cause: "Alemania lanzo su ofensiva occidental atravesando Belgica y los Paises Bajos.",
    sides: [{ side: "Aliados", members: ["Belgica", "Reino Unido", "Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria alemana.",
    consequences: "Provoco la rendicion belga y abrio la ruta hacia el colapso aliado en Francia."
  }),
  "Batalla del cabo Spada": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    region: "Mediterraneo",
    year: 1940,
    cause: "Fuerzas navales britanicas e italianas disputaron rutas y presencia en el Mediterraneo oriental.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia"] }, { side: "Italia", members: ["Italia"] }],
    outcome: "Victoria aliada.",
    consequences: "Reforzo la presion aliada sobre las operaciones navales italianas en el Mediterraneo."
  }),
  "Batalla de Dunkerque": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Francia",
    year: 1940,
    cause: "El avance aleman encerro a fuerzas aliadas en el norte de Francia.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Francia", "Belgica"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria alemana terrestre con evacuacion aliada exitosa.",
    consequences: "La evacuacion preservo gran parte del ejercito britanico, aunque Francia quedo gravemente comprometida."
  }),
  "Batalla de la carretera de Raate": makeCuratedBattle({
    parent: "Guerra de Invierno",
    region: "Finlandia",
    year: 1940,
    cause: "Finlandia busco destruir columnas sovieticas vulnerables en bosques y caminos estrechos.",
    sides: [{ side: "Finlandia", members: ["Finlandia"] }, { side: "Union Sovietica", members: ["Union Sovietica"] }],
    outcome: "Victoria finlandesa.",
    consequences: "Se convirtio en ejemplo clasico de tacticas de movilidad, clima y terreno contra fuerzas superiores."
  }),
  "Batalla de Sedan (1940)": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Francia",
    year: 1940,
    cause: "Alemania concentro blindados para cruzar el Mosa y romper el frente frances.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria alemana decisiva.",
    consequences: "Abrio la ruptura operativa que llevo al cerco aliado y a la caida de Francia."
  }),
  "Batalla de Sidi Barrani": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Africa del Norte",
    year: 1940,
    cause: "Reino Unido contraataco posiciones italianas en Egipto durante la Operacion Compass.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "India britanica"] }, { side: "Italia", members: ["Italia"] }],
    outcome: "Victoria aliada.",
    consequences: "Inicio una serie de derrotas italianas en Cirenaica y altero el equilibrio en Africa del Norte."
  }),
  "Batalla de Creta": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Mediterraneo oriental",
    year: 1941,
    cause: "Alemania intento capturar Creta para asegurar el flanco sur tras la campana de Grecia.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Grecia", "Australia", "Nueva Zelanda"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria alemana.",
    consequences: "La alta perdida de paracaidistas alemanes limito futuras operaciones aerotransportadas de gran escala."
  }),
  "Batalla de Hong Kong": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Asia oriental",
    year: 1941,
    cause: "Japon ataco posesiones britanicas en Asia durante la expansion inicial del Pacifico.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Canada", "Hong Kong colonial"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "Hong Kong quedo bajo ocupacion japonesa hasta 1945."
  }),
  "Batalla de Keren": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Africa oriental",
    year: 1941,
    cause: "Los Aliados atacaron posiciones italianas en Eritrea para expulsar al Eje de Africa oriental.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "India britanica", "Sudafrica"] }, { side: "Italia", members: ["Italia"] }],
    outcome: "Victoria aliada.",
    consequences: "Abrio el camino a Asmara y Massawa, debilitando decisivamente el Africa Oriental Italiana."
  }),
  "Batalla de Giarabub": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Libia",
    year: 1940,
    cause: "Fuerzas aliadas sitiaron una posicion italiana aislada durante la campana de Africa del Norte.",
    sides: [{ side: "Aliados", members: ["Australia", "Reino Unido"] }, { side: "Italia", members: ["Italia"] }],
    outcome: "Victoria aliada.",
    consequences: "Elimino una posicion italiana fronteriza y acompano el retroceso del Eje en Cirenaica."
  }),
  "Batalla de Kvam": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Noruega",
    year: 1940,
    cause: "Fuerzas britanicas y noruegas intentaron frenar el avance aleman durante la campana de Noruega.",
    sides: [{ side: "Aliados", members: ["Noruega", "Reino Unido"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Retraso aliado temporal.",
    consequences: "Mostro la dificultad aliada para sostener posiciones ante la superioridad operacional alemana en Noruega."
  }),
  "Batalla de Rotterdam": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Paises Bajos",
    year: 1940,
    cause: "Alemania busco quebrar rapidamente la resistencia neerlandesa durante la invasion occidental.",
    sides: [{ side: "Paises Bajos", members: ["Paises Bajos"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria alemana y rendicion neerlandesa.",
    consequences: "El bombardeo de Rotterdam acelero la capitulacion de los Paises Bajos."
  }),
  "Batalla del canal Ypres-Comines": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Belgica",
    year: 1940,
    cause: "Fuerzas britanicas intentaron cubrir la retirada aliada hacia Dunkerque.",
    sides: [{ side: "Aliados", members: ["Reino Unido"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Accion defensiva aliada durante la retirada.",
    consequences: "Contribuyo a ganar tiempo para la evacuacion de fuerzas aliadas en el norte de Francia."
  }),
  "Batalla de Agordat": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Eritrea",
    year: 1941,
    cause: "Los Aliados avanzaron contra posiciones italianas en Africa oriental.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "India britanica", "Sudan"] }, { side: "Italia", members: ["Italia"] }],
    outcome: "Victoria aliada.",
    consequences: "Abrio la ruta hacia Keren y acelero la caida de Eritrea italiana."
  }),
  "Batalla de Damasco (1941)": makeCuratedBattle({
    parent: "Campana de Siria y Libano",
    region: "Siria",
    year: 1941,
    cause: "Los Aliados atacaron territorios controlados por la Francia de Vichy para asegurar Oriente Medio.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia", "Francia Libre"] }, { side: "Francia de Vichy", members: ["Francia de Vichy"] }],
    outcome: "Victoria aliada.",
    consequences: "Facilito el control aliado de Siria y Libano y redujo riesgos para rutas regionales."
  }),
  "Batalla de Gondar": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Etiopia",
    year: 1941,
    cause: "Gondar fue una de las ultimas posiciones italianas en Africa oriental.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Etiopia", "Sudafrica"] }, { side: "Italia", members: ["Italia"] }],
    outcome: "Victoria aliada.",
    consequences: "Cerro la resistencia italiana organizada en Africa oriental."
  }),
  "Batalla de Guam": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Pacifico",
    year: 1941,
    cause: "Japon ataco territorios estadounidenses en el Pacifico al iniciar su expansion regional.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "Guam quedo ocupada por Japon hasta la reconquista estadounidense de 1944."
  }),
  "Batalla de Gurun": makeCuratedBattle({
    parent: "Campana de Malasia",
    region: "Malasia",
    year: 1941,
    cause: "Japon avanzo rapidamente por la peninsula malaya contra defensas britanicas y de la Commonwealth.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "India britanica"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa.",
    consequences: "Acelero la retirada aliada hacia el sur y el deterioro de la defensa de Malasia."
  }),
  "Batalla de Kampar": makeCuratedBattle({
    parent: "Campana de Malasia",
    region: "Malasia",
    year: 1941,
    cause: "Fuerzas aliadas buscaron retrasar el avance japones hacia Singapur.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "India britanica"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Exito defensivo aliado temporal.",
    consequences: "Retraso el avance japones, aunque no altero el resultado general de la campana."
  }),
  "Batalla de Ko Chang": makeCuratedBattle({
    parent: "Guerra franco-tailandesa",
    type: "batalla naval",
    region: "Golfo de Tailandia",
    year: 1941,
    cause: "Francia de Vichy y Tailandia disputaron territorios indochinos bajo presion regional japonesa.",
    sides: [{ side: "Francia de Vichy", members: ["Francia de Vichy"] }, { side: "Tailandia", members: ["Tailandia"] }],
    outcome: "Victoria naval francesa.",
    consequences: "No impidio que la mediacion japonesa favoreciera concesiones territoriales a Tailandia."
  }),
  "Batalla de la Isla Wake": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Pacifico",
    year: 1941,
    cause: "Japon intento capturar la isla Wake como parte de su ofensiva inicial en el Pacifico.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Japon", members: ["Japon"] }],
    outcome: "Victoria japonesa tras resistencia estadounidense.",
    consequences: "La defensa de Wake se volvio simbolo temprano de resistencia estadounidense en el Pacifico."
  }),
  "Batalla de la linea Metaxas": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Grecia",
    year: 1941,
    cause: "Alemania invadio Grecia y ataco fortificaciones griegas en la frontera norte.",
    sides: [{ side: "Grecia", members: ["Grecia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria alemana.",
    consequences: "La caida de la linea Metaxas facilito la ocupacion alemana de Grecia."
  }),
  "Batalla de las Termopilas (1941)": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    region: "Grecia",
    year: 1941,
    cause: "Fuerzas aliadas intentaron retrasar el avance aleman durante la evacuacion de Grecia.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia", "Nueva Zelanda", "Grecia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Retirada aliada tras accion defensiva.",
    consequences: "Gano tiempo para la evacuacion aliada, aunque Grecia quedo bajo ocupacion del Eje."
  }),
  "Batalla del cabo Matapan": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "batalla naval",
    region: "Mediterraneo",
    year: 1941,
    cause: "La Royal Navy busco frenar operaciones italianas contra convoyes y posiciones aliadas.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia"] }, { side: "Italia", members: ["Italia"] }],
    outcome: "Victoria naval aliada decisiva.",
    consequences: "Redujo la capacidad italiana de desafiar a la flota britanica en el Mediterraneo oriental."
  }),
  "Segunda Batalla de Amba Alagi": makeCuratedBattle({
    parent: "Segunda Guerra Mundial",
    type: "sitio",
    region: "Etiopia",
    year: 1941,
    cause: "Las fuerzas italianas se replegaron a posiciones montanosas tras derrotas en Africa oriental.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Etiopia", "India britanica"] }, { side: "Italia", members: ["Italia"] }],
    outcome: "Rendicion italiana.",
    consequences: "Marco la caida de una posicion clave italiana y acelero el fin de la campana de Africa oriental."
  })
};
