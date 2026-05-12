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

export const LATE_1800_SAFE_CONFLICT_RENAMES = {
  "Batalla de GuantÃƒÂ¡namo Bay": "Batalla de la bahia de Guantanamo",
  "Batalla de Guant\u00e1namo Bay": "Batalla de la bahia de Guantanamo",
  "Batalla de las GuÃƒÂ¡simas (1898)": "Batalla de Las Guasimas (1898)",
  "Batalla de las Gu\u00e1simas (1898)": "Batalla de Las Guasimas (1898)",
  "Batalla de la Fosse-ÃƒÂ -l'Eau": "Batalla de la Fosse-a-l'Eau",
  "Batalla de Picardy": "Batalla de Picardia",
  "Batalla de Belleau Wood": "Batalla de Belleau",
  "Batalla de Blanc Mont Ridge": "Batalla de Blanc Mont",
  "Batalla de St. Quentin Canal": "Batalla del canal de San Quintin"
};

export const LATE_1800_CONFLICT_DETAIL_FIXES = {
  "Batalla de Clearwater": makeCuratedBattle({
    parent: "Guerra de los Nez Perce",
    region: "Idaho",
    year: 1877,
    cause: "Estados Unidos persiguio a los nez perce durante su retirada hacia el norte.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Nez Perce", members: ["Nez Perce"] }],
    outcome: "Victoria tactica estadounidense.",
    consequences: "Empujo a los nez perce a continuar su retirada hacia Montana."
  }),
  "Batalla de Cottonwood": makeCuratedBattle({
    parent: "Guerra de los Nez Perce",
    region: "Idaho",
    year: 1877,
    cause: "Fuerzas estadounidenses intentaron bloquear el movimiento nez perce durante la campana de 1877.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Nez Perce", members: ["Nez Perce"] }],
    outcome: "Combate de resultado limitado.",
    consequences: "Mantuvo la presion sobre la columna nez perce y prolongo la persecucion."
  }),
  "Batalla de Milk Creek": makeCuratedBattle({
    parent: "Guerra ute de 1879",
    region: "Colorado",
    year: 1879,
    cause: "Tensiones por tierras, agencias y presencia militar estadounidense derivaron en combate con los ute.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Ute", members: ["Ute"] }],
    outcome: "Resistencia ute frente a una columna estadounidense.",
    consequences: "Aumento la presion federal y acelero el desplazamiento forzado de comunidades ute."
  }),
  "Batalla de Hembrillo Basin": makeCuratedBattle({
    parent: "Guerras apaches",
    region: "Nuevo Mexico",
    year: 1880,
    cause: "Estados Unidos persiguio a grupos apaches durante la campana contra Victorio.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Apaches", members: ["Apaches"] }],
    outcome: "Combate intenso sin decision estrategica definitiva.",
    consequences: "Formo parte de la campana que redujo gradualmente la movilidad apache en el suroeste."
  }),
  "Batalla del Alto de la Alianza": makeCuratedBattle({
    parent: "Guerra del Pacifico",
    region: "Tacna",
    year: 1880,
    cause: "Chile busco quebrar la defensa conjunta peruano-boliviana en el sur andino.",
    sides: [{ side: "Chile", members: ["Chile"] }, { side: "Peru y Bolivia", members: ["Peru", "Bolivia"] }],
    outcome: "Victoria chilena decisiva.",
    consequences: "Dejo a Bolivia fuera de la guerra activa y permitio la ocupacion chilena de Tacna."
  }),
  "Batalla de Fuzhou": makeCuratedBattle({
    parent: "Guerra franco-china",
    type: "batalla naval",
    region: "Fujian",
    year: 1884,
    cause: "Francia intento imponer su posicion en Tonkin y debilitar la flota china de Fujian.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Imperio Qing", members: ["China"] }],
    outcome: "Victoria naval francesa.",
    consequences: "Destruyo gran parte de la flota de Fujian y amplio el conflicto colonial en Asia oriental."
  }),
  "Sitio de Battleford": makeCuratedBattle({
    parent: "Rebelion del Noroeste",
    type: "sitio",
    region: "Saskatchewan",
    year: 1885,
    cause: "La crisis metis y la inseguridad fronteriza llevaron a comunidades locales a refugiarse en Battleford.",
    sides: [{ side: "Canada", members: ["Canada"] }, { side: "Cree y aliados locales", members: ["Cree"] }],
    outcome: "Sitio levantado tras llegada de fuerzas canadienses.",
    consequences: "Reflejo la expansion estatal canadiense y la tension con pueblos indigenas de las praderas."
  }),
  "Batalla de Fajardo": makeCuratedBattle({
    parent: "Guerra hispano-estadounidense",
    region: "Puerto Rico",
    year: 1898,
    cause: "Estados Unidos extendio operaciones a Puerto Rico durante la guerra contra Espana.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Espana", members: ["Espana"] }],
    outcome: "Accion local estadounidense.",
    consequences: "Formo parte de la campana que termino con la cesion de Puerto Rico a Estados Unidos."
  }),
  "Batalla de la bahia de Guantanamo": makeCuratedBattle({
    parent: "Guerra hispano-estadounidense",
    region: "Cuba",
    year: 1898,
    cause: "Estados Unidos busco asegurar una base naval y apoyo logistico en el oriente cubano.",
    sides: [{ side: "Estados Unidos y aliados cubanos", members: ["Estados Unidos", "Insurgentes cubanos"] }, { side: "Espana", members: ["Espana"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Consolido la presencia naval estadounidense en Guantanamo durante la campana cubana."
  }),
  "Batalla de Las Guasimas (1898)": makeCuratedBattle({
    parent: "Guerra hispano-estadounidense",
    region: "Cuba",
    year: 1898,
    cause: "Fuerzas estadounidenses avanzaron hacia Santiago de Cuba contra defensas espanolas.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Espana", members: ["Espana"] }],
    outcome: "Victoria estadounidense tactica.",
    consequences: "Abrio el camino hacia combates mayores en San Juan y Santiago."
  }),
  "Batalla de Calumpit": makeCuratedBattle({
    parent: "Guerra filipino-estadounidense",
    region: "Luzon",
    year: 1899,
    cause: "Estados Unidos avanzo hacia el norte de Manila para romper lineas republicanas filipinas.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Republica Filipina", members: ["Filipinas"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Debilito la defensa filipina en Luzon central y empujo la guerra hacia una fase mas movil."
  }),
  "Batalla de Manila": makeCuratedBattle({
    parent: "Guerra filipino-estadounidense",
    region: "Manila",
    year: 1899,
    cause: "La tension entre fuerzas estadounidenses y filipinas tras la guerra contra Espana escalo a combate abierto.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Republica Filipina", members: ["Filipinas"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Marco el inicio abierto de la guerra filipino-estadounidense."
  }),
  "Batalla de Olongapo": makeCuratedBattle({
    parent: "Guerra filipino-estadounidense",
    region: "Luzon",
    year: 1899,
    cause: "Estados Unidos busco controlar bases navales y comunicaciones en la bahia de Subic.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Republica Filipina", members: ["Filipinas"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Aseguro una posicion naval importante para operaciones posteriores."
  }),
  "Segunda batalla de Caloocan": makeCuratedBattle({
    parent: "Guerra filipino-estadounidense",
    region: "Luzon",
    year: 1899,
    cause: "Estados Unidos intento ampliar el control alrededor de Manila y romper posiciones filipinas.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Republica Filipina", members: ["Filipinas"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Facilito el avance estadounidense hacia el interior de Luzon."
  }),
  "Batalla de Tientsin": makeCuratedBattle({
    parent: "Rebelion de los Boxers",
    region: "Tianjin",
    year: 1900,
    cause: "La Alianza de las Ocho Naciones busco levantar el asedio y abrir el camino hacia Pekin.",
    sides: [{ side: "Alianza de las Ocho Naciones", members: ["Estados Unidos", "Reino Unido", "Francia", "Japon", "Rusia", "Alemania", "Italia", "Austria-Hungria"] }, { side: "Boxers e Imperio Qing", members: ["China", "Boxers"] }],
    outcome: "Victoria aliada.",
    consequences: "Permitio el avance internacional hacia Pekin y amplio la intervencion extranjera en China."
  }),
  "Batalla de Coyotepe": makeCuratedBattle({
    parent: "Intervencion estadounidense en Nicaragua",
    region: "Nicaragua",
    year: 1912,
    cause: "Estados Unidos intervino para sostener al gobierno aliado y controlar puntos estrategicos durante la crisis nicaraguense.",
    sides: [{ side: "Estados Unidos y gobierno nicaraguense", members: ["Estados Unidos", "Nicaragua"] }, { side: "Rebeldes liberales", members: ["Rebeldes nicaraguenses"] }],
    outcome: "Victoria estadounidense-gubernamental.",
    consequences: "Consolido una larga presencia militar estadounidense en Nicaragua."
  }),
  "Batalla de Khannour": makeCuratedBattle({
    parent: "Conflictos de unificacion de Qatar",
    region: "Qatar",
    year: 1889,
    cause: "Disputas tribales y de autoridad local marcaron la consolidacion politica qatari en el Golfo.",
    sides: [{ side: "Fuerzas qataries", members: ["Qatar"] }, { side: "Rivales tribales locales", members: ["Rivales locales"] }],
    outcome: "Resultado local asociado a la consolidacion qatari.",
    consequences: "Forma parte del proceso de centralizacion politica que antecedio al reconocimiento moderno de Qatar."
  }),
  "Batalla de Santa Cruz": makeCuratedBattle({
    parent: "Guerra filipino-estadounidense",
    region: "Laguna",
    year: 1899,
    cause: "Estados Unidos amplio operaciones al sur de Manila para controlar rutas, pueblos y posiciones republicanas filipinas.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Republica Filipina", members: ["Filipinas"] }],
    outcome: "Victoria estadounidense local.",
    consequences: "Extendio la ocupacion estadounidense en Luzon y sostuvo la presion sobre fuerzas filipinas regionales."
  }),
  "Segunda batalla de Bud Dajo": makeCuratedBattle({
    parent: "Rebelion Moro",
    region: "Jolo",
    year: 1911,
    cause: "La autoridad colonial estadounidense intento imponer control militar sobre comunidades moro en Sulu.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos", "Policia filipina"] }, { side: "Combatientes moro", members: ["Moro"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Reforzo el control colonial en Sulu, pero mantuvo la resistencia moro como foco persistente de conflicto."
  }),
  "Batalla de Bud Bagsak": makeCuratedBattle({
    parent: "Rebelion Moro",
    region: "Jolo",
    year: 1913,
    cause: "Fuerzas estadounidenses atacaron posiciones fortificadas moro durante la campana final de pacificacion en Sulu.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos", "Policia filipina"] }, { side: "Combatientes moro", members: ["Moro"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Fue uno de los combates finales de gran escala de la Rebelion Moro y consolido el dominio colonial estadounidense."
  }),
  "Batalla de Fort Dipitie": makeCuratedBattle({
    parent: "Ocupacion estadounidense de Haiti",
    region: "Haiti",
    year: 1915,
    cause: "La intervencion estadounidense en Haiti enfrento resistencia armada local durante la ocupacion inicial.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Cacos haitianos", members: ["Haiti"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Contribuyo a estabilizar militarmente la ocupacion, aunque la resistencia haitiana continuo en anos posteriores."
  }),
  "Batalla de Donon": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Vosgos",
    year: 1914,
    cause: "Francia y Alemania chocaron en Alsacia-Lorena durante las primeras ofensivas de 1914.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria alemana local.",
    consequences: "Contribuyo al fracaso frances inicial en sectores de Alsacia-Lorena."
  }),
  "Primera batalla de Ypres": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Flandes",
    year: 1914,
    cause: "Alemania y los Aliados intentaron envolver el flanco norte durante la carrera hacia el mar.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Francia", "Belgica"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Defensa aliada y estabilizacion del saliente de Ypres.",
    consequences: "Cerro la fase de guerra de movimientos en el oeste y fijo un sector clave de trincheras."
  }),
  "Batalla de Jutlandia": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    type: "batalla naval",
    scope: "mundial",
    region: "Mar del Norte",
    year: 1916,
    cause: "La flota alemana intento desafiar el bloqueo britanico y alterar el equilibrio naval.",
    sides: [{ side: "Reino Unido", members: ["Reino Unido", "Australia", "Canada"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Resultado tactico disputado, ventaja estrategica britanica.",
    consequences: "La flota alemana de superficie no volvio a desafiar decisivamente el control britanico del Mar del Norte."
  }),
  "Batalla de Cambrai": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Frente occidental",
    year: 1917,
    cause: "Los britanicos usaron tanques de forma masiva para romper defensas alemanas.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Estados Unidos"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Avance inicial aliado seguido de contraataque aleman.",
    consequences: "Demostro el potencial tactico del tanque y anticipo cambios en la guerra mecanizada."
  }),
  "Batalla de la Cresta de Vimy": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Artois",
    year: 1917,
    cause: "La ofensiva de Arras busco capturar alturas dominantes de la cresta de Vimy.",
    sides: [{ side: "Canada y Reino Unido", members: ["Canada", "Reino Unido"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria canadiense.",
    consequences: "Se convirtio en hito militar canadiense y mejoro la posicion aliada en Arras."
  }),
  "Batalla de Messines": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Flandes",
    year: 1917,
    cause: "Los Aliados buscaron capturar la cresta de Messines antes de nuevas operaciones en Ypres.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia", "Nueva Zelanda"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada.",
    consequences: "El uso de minas y planificacion coordinada mejoro la posicion aliada en Flandes."
  }),
  "Batalla del canal de Otranto": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    type: "batalla naval",
    region: "Adriatico",
    year: 1917,
    cause: "Austria-Hungria intento romper el bloqueo aliado del canal de Otranto.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Italia", "Francia"] }, { side: "Austria-Hungria", members: ["Austria-Hungria"] }],
    outcome: "Exito tactico austrohungaro limitado.",
    consequences: "No rompio de forma duradera el bloqueo aliado del Adriatico."
  }),
  "Batalla de Amiens": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Picardia",
    year: 1918,
    cause: "Los Aliados lanzaron una ofensiva combinada tras contener las ofensivas alemanas de primavera.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Francia", "Australia", "Canada", "Estados Unidos"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada decisiva.",
    consequences: "Inicio los Cien Dias que llevaron al colapso militar aleman."
  }),
  "Batalla de Belleau": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Aisne-Marne",
    year: 1918,
    cause: "Estados Unidos y Francia intentaron contener el avance aleman hacia el Marne.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada.",
    consequences: "Afirmo la presencia combatiente estadounidense en el frente occidental."
  }),
  "Batalla de Blanc Mont": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Champana",
    year: 1918,
    cause: "Los Aliados atacaron posiciones alemanas fortificadas durante los Cien Dias.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada.",
    consequences: "Contribuyo al retroceso aleman y al desgaste final de sus defensas en 1918."
  }),
  "Batalla de Durazzo": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    type: "batalla naval",
    region: "Adriatico",
    year: 1918,
    cause: "Los Aliados atacaron instalaciones austrohungaras en Durazzo para debilitar su apoyo naval y logistico.",
    sides: [{ side: "Aliados", members: ["Italia", "Reino Unido", "Francia", "Estados Unidos"] }, { side: "Austria-Hungria", members: ["Austria-Hungria"] }],
    outcome: "Victoria aliada.",
    consequences: "Debilito posiciones navales austrohungaras en la etapa final de la guerra."
  }),
  "Batalla de la Fosse-a-l'Eau": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Frente occidental",
    year: 1914,
    cause: "Los ejercitos aleman y frances chocaron durante la guerra de movimientos inicial.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Combate local dentro de las operaciones de 1914.",
    consequences: "Forma parte de la transicion desde maniobras rapidas hacia frentes mas estabilizados."
  }),
  "Batalla de Meuse": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Mosa",
    year: 1914,
    cause: "La ofensiva alemana y la respuesta francesa disputaron cruces, alturas y rutas del valle del Mosa.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Combates de resultado variable en el frente occidental.",
    consequences: "El area quedo como sector estrategico recurrente durante la guerra."
  }),
  "Batalla de Monchy-au-Bois": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Artois",
    year: 1914,
    cause: "La carrera hacia el mar produjo choques por pueblos y nudos de comunicacion en el norte de Francia.",
    sides: [{ side: "Francia y Reino Unido", members: ["Francia", "Reino Unido"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Combate local de la estabilizacion del frente.",
    consequences: "Contribuyo a fijar posiciones en el Artois antes de la guerra de trincheras."
  }),
  "Batalla de Revigny": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Marne",
    year: 1914,
    cause: "La contraofensiva aliada del Marne intento frenar el avance aleman hacia Paris.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria francesa local.",
    consequences: "Ayudo a sostener el giro estrategico que freno la ofensiva alemana de 1914."
  }),
  "Batalla de Upper Meurthe": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Lorena",
    year: 1914,
    cause: "Francia y Alemania disputaron pasos y valles de Lorena durante las operaciones iniciales.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Accion local en el frente de Lorena.",
    consequences: "Integra el conjunto de combates que estabilizaron el frente oriental de Francia."
  }),
  "Batalla de Mont Saint-Quentin": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Somme",
    year: 1918,
    cause: "El avance aliado de los Cien Dias busco romper posiciones alemanas alrededor de Peronne.",
    sides: [{ side: "Aliados", members: ["Australia", "Reino Unido"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria australiana.",
    consequences: "Acelero el retroceso aleman en la Somme y es una de las acciones australianas mas destacadas de 1918."
  }),
  "Batalla de Picardia": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Picardia",
    year: 1918,
    cause: "Las ofensivas de primavera alemanas y la respuesta aliada concentraron combates en Picardia.",
    sides: [{ side: "Aliados", members: ["Francia", "Reino Unido", "Australia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Conjunto de combates ligados al giro aliado de 1918.",
    consequences: "Preparo el terreno para las ofensivas aliadas de los Cien Dias."
  }),
  "Batalla de Saint-Mihiel": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Lorena",
    year: 1918,
    cause: "Estados Unidos lanzo una ofensiva para reducir el saliente aleman de Saint-Mihiel.",
    sides: [{ side: "Aliados", members: ["Estados Unidos", "Francia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria estadounidense-francesa.",
    consequences: "Fue la primera gran ofensiva independiente estadounidense y mejoro la posicion aliada antes de Meuse-Argonne."
  }),
  "Batalla de Saint-Thierry": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Marne",
    year: 1918,
    cause: "Los Aliados contraatacaron tras la ofensiva alemana de primavera en el sector del Marne.",
    sides: [{ side: "Aliados", members: ["Francia", "Estados Unidos"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada local.",
    consequences: "Contribuyo a frenar la iniciativa alemana y a preparar la Segunda batalla del Marne."
  }),
  "Batalla de Scarpe": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Arras",
    year: 1918,
    cause: "Los Aliados atacaron el sistema defensivo aleman durante los Cien Dias.",
    sides: [{ side: "Aliados", members: ["Canada", "Reino Unido"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada.",
    consequences: "Aporto al avance canadiense y britanico contra la Linea Hindenburg."
  }),
  "Batalla de Soissons": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Aisne",
    year: 1918,
    cause: "Francia y Estados Unidos contraatacaron para cortar el saliente aleman del Marne.",
    sides: [{ side: "Aliados", members: ["Francia", "Estados Unidos"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada.",
    consequences: "Ayudo a revertir la ofensiva alemana de primavera y a recuperar la iniciativa aliada."
  }),
  "Batalla del canal de San Quintin": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Picardia",
    year: 1918,
    cause: "Los Aliados atacaron un sector clave de la Linea Hindenburg.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia", "Estados Unidos"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada decisiva.",
    consequences: "La ruptura del canal de San Quintin acelero el colapso defensivo aleman."
  }),
  "Batalla de Vittorio Veneto": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Frente italiano",
    year: 1918,
    cause: "Italia y sus aliados lanzaron una ofensiva final contra Austria-Hungria.",
    sides: [{ side: "Aliados", members: ["Italia", "Reino Unido", "Francia", "Estados Unidos"] }, { side: "Austria-Hungria", members: ["Austria-Hungria"] }],
    outcome: "Victoria aliada decisiva.",
    consequences: "Provoco el derrumbe militar austrohungaro y precipito el armisticio de Villa Giusti."
  }),
  "Segunda batalla de Somme": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Somme",
    year: 1918,
    cause: "Los Aliados explotaron el debilitamiento aleman durante los Cien Dias.",
    sides: [{ side: "Aliados", members: ["Reino Unido", "Australia", "Canada", "Estados Unidos"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada.",
    consequences: "Empujo a Alemania fuera de posiciones ganadas en primavera y acelero la retirada general."
  }),
  "Segunda batalla del Marne": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Marne",
    year: 1918,
    cause: "Alemania intento una ultima ofensiva mayor en el oeste antes de que el peso estadounidense creciera plenamente.",
    sides: [{ side: "Aliados", members: ["Francia", "Estados Unidos", "Reino Unido", "Italia"] }, { side: "Alemania", members: ["Alemania"] }],
    outcome: "Victoria aliada decisiva.",
    consequences: "Marco el fin de la iniciativa ofensiva alemana y abrio paso a los Cien Dias."
  }),
  "Tercera batalla de Aisne": makeCuratedBattle({
    parent: "Primera Guerra Mundial",
    region: "Aisne",
    year: 1918,
    cause: "Alemania lanzo una ofensiva de primavera para romper el frente aliado antes de la llegada masiva estadounidense.",
    sides: [{ side: "Alemania", members: ["Alemania"] }, { side: "Aliados", members: ["Francia", "Reino Unido", "Estados Unidos"] }],
    outcome: "Avance aleman inicial contenido posteriormente.",
    consequences: "Extendio peligrosamente las lineas alemanas y precedio el contraataque aliado del verano."
  })
};
