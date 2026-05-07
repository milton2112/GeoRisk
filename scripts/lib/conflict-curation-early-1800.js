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

export const EARLY_1800_SAFE_CONFLICT_RENAMES = {
  "Batalla de CrÃªte-Ã -Pierrot": "Batalla de Crete-a-Pierrot",
  "Batalla del puerto de TrÃ­poli": "Batalla del puerto de Tripoli",
  "Batalla de SandÃ¶strÃ¶m": "Batalla de Sandostrom",
  "Batalla del puente del rÃ­o Pacora": "Batalla del puente del rio Pacora",
  "Batalla de San Juan de UlÃºa": "Batalla de San Juan de Ulua"
};

export const EARLY_1800_CONFLICT_DETAIL_FIXES = {
  "Batalla de Svensksund (1790)": makeCuratedBattle({
    parent: "Guerra ruso-sueca (1788-1790)",
    type: "batalla naval",
    region: "Mar Baltico",
    year: 1790,
    cause: "La flota sueca intento romper la presion rusa y asegurar una salida honorable para la guerra.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Rusia", members: ["Imperio ruso"] }],
    outcome: "Victoria naval sueca.",
    consequences: "Fortalecio la posicion sueca en las negociaciones y facilito una paz sin grandes cesiones territoriales."
  }),
  "Batalla de Fishguard": makeCuratedBattle({
    parent: "Guerras revolucionarias francesas",
    region: "Gales",
    year: 1797,
    cause: "Francia busco abrir un frente de distraccion contra Gran Bretana mediante un desembarco limitado.",
    sides: [{ side: "Francia revolucionaria", members: ["Francia"] }, { side: "Gran Bretana", members: ["Reino Unido"] }],
    outcome: "Fracaso del desembarco frances.",
    consequences: "Fue la ultima invasion extranjera sobre suelo britanico y reforzo la defensa costera."
  }),
  "Sitio de Ancona (1799)": makeCuratedBattle({
    parent: "Guerras revolucionarias francesas",
    type: "sitio",
    region: "Italia",
    year: 1799,
    cause: "La Segunda Coalicion intento expulsar a las fuerzas francesas de sus posiciones italianas.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Coalicion austro-rusa y otomana", members: ["Austria", "Rusia", "Imperio otomano"] }],
    outcome: "Capitulacion francesa tras el sitio.",
    consequences: "Redujo la presencia francesa en el Adriatico antes de la recuperacion napoleonicamente impulsada de 1800."
  }),
  "Batalla de Crete-a-Pierrot": makeCuratedBattle({
    parent: "Revolucion haitiana",
    type: "sitio",
    region: "Haiti",
    year: 1802,
    cause: "La expedicion francesa intento restaurar el control colonial sobre Saint-Domingue.",
    sides: [{ side: "Revolucionarios haitianos", members: ["Haiti"] }, { side: "Francia", members: ["Francia"] }],
    outcome: "Retirada haitiana organizada tras resistencia prolongada.",
    consequences: "La defensa mostro la capacidad militar haitiana y elevo el costo politico y humano de la expedicion francesa."
  }),
  "Batalla del puerto de Tripoli": makeCuratedBattle({
    parent: "Primera Guerra Berberisca",
    type: "batalla naval",
    region: "Mediterraneo",
    year: 1804,
    cause: "Estados Unidos ataco posiciones tripolitanas para proteger su comercio y responder a capturas corsarias.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Tripoli", members: ["Tripoli"] }],
    outcome: "Accion naval estadounidense contra las defensas del puerto.",
    consequences: "Consolido la proyeccion naval estadounidense temprana en el Mediterraneo."
  }),
  "Batalla de Derna (1805)": makeCuratedBattle({
    parent: "Primera Guerra Berberisca",
    region: "Libia",
    year: 1805,
    cause: "Una expedicion terrestre y naval estadounidense apoyo a fuerzas locales contra el pasha de Tripoli.",
    sides: [{ side: "Estados Unidos y aliados locales", members: ["Estados Unidos", "Aliados locales"] }, { side: "Tripoli", members: ["Tripoli"] }],
    outcome: "Victoria estadounidense y aliada.",
    consequences: "Presiono la firma de paz y quedo como antecedente simbolico de intervencion expedicionaria estadounidense."
  }),
  "Batalla de Lokalaks": makeCuratedBattle({
    parent: "Guerra finlandesa",
    region: "Finlandia",
    year: 1808,
    cause: "La campana rusa en Finlandia busco forzar a Suecia a aceptar el sistema continental napoleonico.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Rusia", members: ["Imperio ruso"] }],
    outcome: "Choque local dentro del avance ruso.",
    consequences: "Formo parte del deterioro sueco que culmino con la perdida de Finlandia."
  }),
  "Batalla de Sandostrom": makeCuratedBattle({
    parent: "Guerra finlandesa",
    type: "batalla naval",
    region: "Archipielago finlandes",
    year: 1808,
    cause: "Suecia y Rusia disputaron el control de rutas costeras y apoyo logistico en Finlandia.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Rusia", members: ["Imperio ruso"] }],
    outcome: "Accion naval de resultado limitado.",
    consequences: "Reflejo la importancia del litoral finlandes en una guerra decidida tambien por logistica y control maritimo."
  }),
  "Batalla de Grand Port": makeCuratedBattle({
    parent: "Guerras napoleonicas",
    type: "batalla naval",
    scope: "mundial",
    region: "Oceano Indico",
    year: 1810,
    cause: "Francia y Reino Unido disputaron bases y rutas comerciales en el Indico.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Victoria naval francesa.",
    consequences: "Fue una rara victoria naval francesa de la etapa napoleonica, aunque la campana britanica termino capturando Mauricio."
  }),
  "Batalla de La Guaira (1812)": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    type: "batalla naval",
    region: "Caribe",
    year: 1812,
    cause: "La guerra naval entre Estados Unidos y Reino Unido se extendio a rutas comerciales y puertos del Caribe.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Accion naval menor.",
    consequences: "Muestra la dimension caribena y comercial de la Guerra de 1812."
  }),
  "Batalla de Mississinewa": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    region: "Indiana",
    year: 1812,
    cause: "Estados Unidos intento desarticular aldeas y bases aliadas nativas vinculadas a la resistencia de Tecumseh.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Confederacion indigena", members: ["Pueblos nativos aliados"] }],
    outcome: "Victoria tactica estadounidense con fuertes dificultades logisticas.",
    consequences: "Intensifico la guerra fronteriza y evidencio el peso de las alianzas indigenas en el teatro occidental."
  }),
  "Batalla de Fort George": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    region: "Alto Canada",
    year: 1813,
    cause: "Estados Unidos intento controlar posiciones britanicas clave cerca del Niagara.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido y Canada colonial", members: ["Reino Unido", "Canada colonial"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Abrio temporalmente el corredor del Niagara, aunque el control estadounidense no se consolido de forma decisiva."
  }),
  "Batalla de Leipzig": makeCuratedBattle({
    parent: "Guerras napoleonicas",
    scope: "mundial",
    region: "Sajonia",
    year: 1813,
    cause: "La Sexta Coalicion busco destruir la capacidad militar napoleonica tras la campana de Rusia.",
    sides: [{ side: "Sexta Coalicion", members: ["Rusia", "Prusia", "Austria", "Suecia"] }, { side: "Imperio frances", members: ["Francia", "Aliados napoleonicos"] }],
    outcome: "Victoria decisiva de la Sexta Coalicion.",
    consequences: "Forzo la retirada francesa de Alemania y acelero la caida del sistema napoleonico en Europa central."
  }),
  "Segunda batalla de Sacket's Harbor": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    region: "Nueva York",
    year: 1813,
    cause: "Reino Unido intento destruir instalaciones navales estadounidenses en el lago Ontario.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido y Canada colonial", members: ["Reino Unido", "Canada colonial"] }],
    outcome: "Defensa estadounidense exitosa.",
    consequences: "Preservo una base naval clave para el control del lago Ontario."
  }),
  "Batalla de Big Sandy Creek": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    region: "Nueva York",
    year: 1814,
    cause: "Las fuerzas britanicas buscaron interceptar suministros estadounidenses hacia Sackets Harbor.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Protegio suministros navales y limito operaciones britanicas en el lago Ontario."
  }),
  "Batalla de Credit Island": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    region: "Alto Mississippi",
    year: 1814,
    cause: "Estados Unidos intento proyectar control sobre el alto Mississippi frente a fuerzas britanicas e indigenas aliadas.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Britanicos e indigenas aliados", members: ["Reino Unido", "Pueblos nativos aliados"] }],
    outcome: "Victoria britanica e indigena.",
    consequences: "Mantuvo la presion sobre posiciones estadounidenses en la frontera occidental."
  }),
  "Batalla de Mackinac Island": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    region: "Grandes Lagos",
    year: 1814,
    cause: "Estados Unidos intento recuperar una posicion estrategica tomada por los britanicos al inicio de la guerra.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido y aliados indigenas", members: ["Reino Unido", "Pueblos nativos aliados"] }],
    outcome: "Victoria britanica.",
    consequences: "Mantuvo el control britanico de Mackinac hasta el final de la guerra."
  }),
  "Batalla de Pensacola (1814)": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    region: "Florida espanola",
    year: 1814,
    cause: "Andrew Jackson ataco Pensacola para neutralizar apoyo britanico y posiciones hostiles en Florida.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Espana y Reino Unido", members: ["Espana", "Reino Unido"] }],
    outcome: "Ocupacion estadounidense temporal.",
    consequences: "Preparo el teatro del Golfo antes de la defensa de Nueva Orleans."
  }),
  "Batalla de Plattsburgh": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    type: "batalla terrestre y naval",
    region: "Lago Champlain",
    year: 1814,
    cause: "Reino Unido lanzo una ofensiva desde Canada para mejorar su posicion negociadora.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Victoria decisiva estadounidense.",
    consequences: "Debilito la ofensiva britanica del norte e influyo en las negociaciones de Gante."
  }),
  "Batalla de Fort Peter": makeCuratedBattle({
    parent: "Guerra anglo-estadounidense de 1812",
    region: "Georgia",
    year: 1815,
    cause: "Fuerzas britanicas atacaron posiciones costeras estadounidenses aun antes de conocerse plenamente la paz.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Victoria britanica local.",
    consequences: "Fue una de las acciones finales de la guerra en la costa sur estadounidense."
  }),
  "Batalla del puente del rio Pacora": makeCuratedBattle({
    parent: "Independencia de Panama de Espana",
    region: "Panama",
    year: 1821,
    cause: "Las fuerzas independentistas buscaron asegurar rutas y posiciones frente a la autoridad realista.",
    sides: [{ side: "Independentistas panamenos", members: ["Panama"] }, { side: "Realistas", members: ["Espana"] }],
    outcome: "Accion independentista local.",
    consequences: "Se integra al proceso que llevo a la ruptura panamena con la monarquia espanola."
  }),
  "Batalla de Monte Santiago": makeCuratedBattle({
    parent: "Guerra del Brasil",
    type: "batalla naval",
    region: "Rio de la Plata",
    year: 1827,
    cause: "Las armadas de Brasil y las Provincias Unidas disputaron el bloqueo y control de accesos fluviales.",
    sides: [{ side: "Provincias Unidas del Rio de la Plata", members: ["Argentina"] }, { side: "Imperio del Brasil", members: ["Brasil"] }],
    outcome: "Victoria brasilena.",
    consequences: "Afecto la capacidad naval argentina y mantuvo la presion brasilena en el teatro platense."
  }),
  "Batalla de San Juan de Ulua": makeCuratedBattle({
    parent: "Guerra de los Pasteles",
    type: "batalla naval",
    region: "Veracruz",
    year: 1838,
    cause: "Francia presiono militarmente a Mexico por reclamaciones economicas y diplomaticas.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Victoria francesa.",
    consequences: "Forzo negociaciones y mostro la vulnerabilidad mexicana frente a potencias navales europeas."
  }),
  "Batalla de Palo Alto": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Texas",
    year: 1846,
    cause: "La disputa fronteriza por Texas y el Rio Grande escalo a combate abierto.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Inicio una serie de victorias estadounidenses en el norte de Mexico."
  }),
  "Batalla de Resaca de la Palma": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Texas",
    year: 1846,
    cause: "Estados Unidos persiguio a las fuerzas mexicanas tras Palo Alto.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Aseguro el alivio de Fort Texas y consolido la ofensiva estadounidense inicial."
  }),
  "Batalla de Monterrey": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Nuevo Leon",
    year: 1846,
    cause: "Estados Unidos avanzo sobre plazas del norte mexicano para quebrar la defensa regional.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Victoria estadounidense tras combate urbano.",
    consequences: "Abrio el norte mexicano a nuevas operaciones, aunque con alto costo y armisticio temporal."
  }),
  "Batalla de Buena Vista": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Coahuila",
    year: 1847,
    cause: "Mexico intento frenar la ofensiva estadounidense en el norte mediante una batalla decisiva.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Victoria defensiva estadounidense.",
    consequences: "Mantuvo el control estadounidense del norte y elevo el perfil politico de Zachary Taylor."
  }),
  "Batalla de Chapultepec": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Ciudad de Mexico",
    year: 1847,
    cause: "Las fuerzas estadounidenses avanzaron sobre las defensas finales de la capital mexicana.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Abrio el camino hacia la ocupacion de Ciudad de Mexico y el cierre politico de la guerra."
  }),
  "Batalla del cabo de Palos (1815)": makeCuratedBattle({
    parent: "Segunda Guerra Berberisca",
    type: "batalla naval",
    region: "Mediterraneo",
    year: 1815,
    cause: "Estados Unidos envio una escuadra para terminar ataques corsarios y renegociar tributos en el Mediterraneo.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Regencia de Argel", members: ["Argel"] }],
    outcome: "Victoria naval estadounidense.",
    consequences: "Contribuyo a cerrar la practica de pagos forzados estadounidenses a potencias berberiscas."
  }),
  "Batalla de Bad Axe": makeCuratedBattle({
    parent: "Guerra de Black Hawk",
    region: "Wisconsin",
    year: 1832,
    cause: "La expansion estadounidense y el retorno de la banda sauk de Black Hawk al este del Mississippi precipitaron la campana.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Sauk y Fox", members: ["Sauk", "Fox"] }],
    outcome: "Victoria decisiva estadounidense.",
    consequences: "Marco el colapso de la resistencia de Black Hawk y acelero el desplazamiento indigena regional."
  }),
  "Batalla de Wahoo Swamp": makeCuratedBattle({
    parent: "Segunda Guerra Seminola",
    region: "Florida",
    year: 1836,
    cause: "Las fuerzas estadounidenses intentaron quebrar la resistencia seminola en zonas pantanosas de dificil acceso.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Seminolas", members: ["Seminolas"] }],
    outcome: "Combate inconcluso con retirada seminola.",
    consequences: "Mostro las dificultades estadounidenses para imponer una victoria rapida en Florida."
  }),
  "Batalla de la Vuelta de Obligado": makeCuratedBattle({
    parent: "Bloqueo anglo-frances del Rio de la Plata",
    type: "batalla fluvial",
    region: "Rio Parana",
    year: 1845,
    cause: "Reino Unido y Francia intentaron forzar la libre navegacion de rios interiores frente a la Confederacion Argentina.",
    sides: [{ side: "Confederacion Argentina", members: ["Argentina"] }, { side: "Reino Unido y Francia", members: ["Reino Unido", "Francia"] }],
    outcome: "Victoria tactica anglo-francesa con fuerte resistencia argentina.",
    consequences: "Se convirtio en simbolo de soberania fluvial argentina y encarecio politicamente la intervencion."
  }),
  "Batalla de Providencia": makeCuratedBattle({
    parent: "Revuelta de la Bandera del Oso",
    region: "Alta California",
    year: 1845,
    cause: "Tensiones entre autoridades mexicanas, pobladores locales y expansion estadounidense en California.",
    sides: [{ side: "Californios", members: ["Mexico"] }, { side: "Fuerzas rebeldes locales", members: ["Rebeldes de California"] }],
    outcome: "Victoria de fuerzas californias.",
    consequences: "Anticipo la fragilidad del control mexicano en California antes de la guerra con Estados Unidos."
  }),
  "Batalla de Chino": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Alta California",
    year: 1846,
    cause: "La campana de California enfrento guarniciones y milicias locales durante el avance estadounidense.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Californios mexicanos", members: ["Mexico"] }],
    outcome: "Victoria californio-mexicana.",
    consequences: "Mostro que la ocupacion estadounidense de California aun enfrentaba resistencia local."
  }),
  "Batalla de San Pascual": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Alta California",
    year: 1846,
    cause: "Fuerzas estadounidenses intentaron consolidar control en California frente a caballeria californiana.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Californios mexicanos", members: ["Mexico"] }],
    outcome: "Resultado disputado con fuertes bajas estadounidenses.",
    consequences: "Retraso operaciones estadounidenses y evidencio la capacidad tactica de los lanceros californios."
  }),
  "Batalla de Santa Fe": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Nuevo Mexico",
    year: 1846,
    cause: "Estados Unidos avanzo para ocupar Nuevo Mexico como parte de la estrategia continental contra Mexico.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Ocupacion estadounidense sin gran combate.",
    consequences: "Aseguro Nuevo Mexico para Estados Unidos y facilito rutas hacia California."
  }),
  "Primera Batalla de Tabasco": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    type: "batalla naval y anfibia",
    region: "Tabasco",
    year: 1846,
    cause: "Estados Unidos extendio la guerra al litoral del Golfo para presionar puertos y comunicaciones mexicanas.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Accion estadounidense sin ocupacion duradera.",
    consequences: "Preparo nuevas operaciones navales contra puertos mexicanos del Golfo."
  }),
  "Sitio de Fort Texas": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    type: "sitio",
    region: "Texas",
    year: 1846,
    cause: "Mexico intento presionar la posicion estadounidense fortificada cerca del Rio Grande.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Resistencia estadounidense hasta el alivio del fuerte.",
    consequences: "Se enlazo con Palo Alto y Resaca de la Palma en la apertura militar de la guerra."
  })
};
