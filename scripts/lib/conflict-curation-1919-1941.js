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
  "Batalla de Ypres-Comines Canal": "Batalla del canal Ypres-Comines"
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
    consequences: "Abio la ruptura operativa que llevo al cerco aliado y a la caida de Francia."
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
    consequences: "Abio el camino a Asmara y Massawa, debilitando decisivamente el Africa Oriental Italiana."
  })
};
