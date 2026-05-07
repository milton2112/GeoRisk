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

export const MID_1800_SAFE_CONFLICT_RENAMES = {
  "Batalla de Taku Forts": "Batalla de los Fuertes de Taku"
};

export const MID_1800_CONFLICT_DETAIL_FIXES = {
  "Batalla de la Ciudad de Mexico": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Ciudad de Mexico",
    year: 1847,
    cause: "La campana del valle de Mexico culmino en combates por el control de la capital.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Ocupacion estadounidense de la capital mexicana.",
    consequences: "Acelero las negociaciones que terminaron con el Tratado de Guadalupe Hidalgo."
  }),
  "Batalla de La Paz": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Baja California",
    year: 1847,
    cause: "Fuerzas mexicanas locales resistieron la ocupacion estadounidense de Baja California.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Defensa estadounidense de la plaza.",
    consequences: "Ayudo a sostener la ocupacion estadounidense en el extremo noroccidental mexicano."
  }),
  "Batalla de San Jos\u00e9 del Cabo": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Baja California",
    year: 1847,
    cause: "Milicias mexicanas intentaron recuperar posiciones ocupadas por Estados Unidos en Baja California.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Resistencia estadounidense con apoyo naval.",
    consequences: "Mantuvo el control estadounidense local hasta el fin de la guerra."
  }),
  "Batalla del R\u00edo San Gabriel": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    region: "Alta California",
    year: 1847,
    cause: "Estados Unidos busco quebrar la resistencia californio-mexicana cerca de Los Angeles.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Californios mexicanos", members: ["Mexico"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Facilito la captura de Los Angeles y la consolidacion de la campana de California."
  }),
  "Segunda Batalla de Tabasco": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    type: "batalla naval y anfibia",
    region: "Tabasco",
    year: 1847,
    cause: "Estados Unidos reanudo operaciones contra puertos del Golfo para cortar recursos y presionar a Mexico.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "Ocupacion estadounidense de San Juan Bautista.",
    consequences: "Mostro la capacidad anfibia estadounidense y amplio la presion sobre el litoral mexicano."
  }),
  "Sitio de Puebla": makeCuratedBattle({
    parent: "Guerra mexicano-estadounidense",
    type: "sitio",
    region: "Puebla",
    year: 1847,
    cause: "Guerrillas y fuerzas mexicanas intentaron aislar una guarnicion estadounidense entre Veracruz y la capital.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Mexico", members: ["Mexico"] }],
    outcome: "La guarnicion estadounidense resistio hasta ser auxiliada.",
    consequences: "Evidencio que la ocupacion necesitaba proteger rutas logisticas, no solo ganar batallas campales."
  }),
  "Batalla de Kolding": makeCuratedBattle({
    parent: "Primera Guerra de Schleswig",
    region: "Jutlandia",
    year: 1849,
    cause: "Dinamarca y fuerzas germanas disputaron Schleswig-Holstein y el equilibrio nacional en el ducado.",
    sides: [{ side: "Dinamarca", members: ["Dinamarca"] }, { side: "Schleswig-Holstein y aliados germanos", members: ["Schleswig-Holstein", "Confederacion Germanica"] }],
    outcome: "Victoria danesa local.",
    consequences: "Refuerzo la posicion danesa durante la fase intermedia de la guerra."
  }),
  "Sitio de Petropavlovsk": makeCuratedBattle({
    parent: "Guerra de Crimea",
    type: "sitio",
    scope: "mundial",
    region: "Kamchatka",
    year: 1854,
    cause: "La guerra entre Rusia y la alianza franco-britanica se extendio a posiciones rusas del Pacifico.",
    sides: [{ side: "Rusia", members: ["Imperio ruso"] }, { side: "Francia y Reino Unido", members: ["Francia", "Reino Unido"] }],
    outcome: "Defensa rusa exitosa.",
    consequences: "Mostro el alcance global de la Guerra de Crimea y la dificultad de sostener operaciones anfibias remotas."
  }),
  "Batalla de los Fuertes de Taku": makeCuratedBattle({
    parent: "Segunda Guerra del Opio",
    type: "batalla naval y anfibia",
    region: "Tianjin",
    year: 1859,
    cause: "Las potencias occidentales intentaron imponer el acceso diplomatico y comercial acordado con China.",
    sides: [{ side: "Imperio Qing", members: ["China"] }, { side: "Reino Unido, Francia y Estados Unidos", members: ["Reino Unido", "Francia", "Estados Unidos"] }],
    outcome: "Victoria defensiva Qing en 1859.",
    consequences: "Provoco una nueva expedicion aliada que capturo los fuertes al ano siguiente."
  }),
  "Batalla de Stones River": makeCuratedBattle({
    parent: "Guerra de Secesion estadounidense",
    region: "Tennessee",
    year: 1862,
    cause: "Union y Confederacion disputaron el control de Tennessee medio y las rutas hacia el sur profundo.",
    sides: [{ side: "Union", members: ["Estados Unidos"] }, { side: "Confederacion", members: ["Estados Confederados"] }],
    outcome: "Victoria estrategica de la Union.",
    consequences: "Elevo la moral unionista tras Fredericksburg y mantuvo la presion federal en el teatro occidental."
  }),
  "Batalla de Gettysburg": makeCuratedBattle({
    parent: "Guerra de Secesion estadounidense",
    region: "Pensilvania",
    year: 1863,
    cause: "La Confederacion invadio el norte para buscar una victoria decisiva y presion politica.",
    sides: [{ side: "Union", members: ["Estados Unidos"] }, { side: "Confederacion", members: ["Estados Confederados"] }],
    outcome: "Victoria decisiva de la Union.",
    consequences: "Freno la ofensiva de Lee y se convirtio en punto de inflexion simbolico y militar de la guerra."
  }),
  "Batalla de Salem Church": makeCuratedBattle({
    parent: "Guerra de Secesion estadounidense",
    region: "Virginia",
    year: 1863,
    cause: "Fue parte de las operaciones alrededor de Chancellorsville y Fredericksburg.",
    sides: [{ side: "Union", members: ["Estados Unidos"] }, { side: "Confederacion", members: ["Estados Confederados"] }],
    outcome: "Victoria confederada.",
    consequences: "Ayudo a contener el avance unionista durante la campana de Chancellorsville."
  }),
  "Batalla de Cold Harbor": makeCuratedBattle({
    parent: "Guerra de Secesion estadounidense",
    region: "Virginia",
    year: 1864,
    cause: "La campana terrestre de Grant busco desgastar al ejercito de Lee y acercarse a Richmond.",
    sides: [{ side: "Union", members: ["Estados Unidos"] }, { side: "Confederacion", members: ["Estados Confederados"] }],
    outcome: "Victoria defensiva confederada.",
    consequences: "Provoco fuertes bajas unionistas y anticipo la guerra de trincheras alrededor de Petersburg."
  }),
  "Batalla de Elkin's Ferry": makeCuratedBattle({
    parent: "Guerra de Secesion estadounidense",
    region: "Arkansas",
    year: 1864,
    cause: "La campana de Camden buscaba sostener la ofensiva unionista en Arkansas y presionar a la Confederacion en el Trans-Mississippi.",
    sides: [{ side: "Union", members: ["Estados Unidos"] }, { side: "Confederacion", members: ["Estados Confederados"] }],
    outcome: "Victoria unionista limitada.",
    consequences: "Permitio el cruce del Little Missouri, aunque la campana posterior quedo expuesta a problemas logisticos."
  }),
  "Batalla de la espesura": makeCuratedBattle({
    parent: "Guerra de Secesion estadounidense",
    region: "Virginia",
    year: 1864,
    cause: "Grant inicio la campana terrestre para fijar y desgastar al ejercito de Lee.",
    sides: [{ side: "Union", members: ["Estados Unidos"] }, { side: "Confederacion", members: ["Estados Confederados"] }],
    outcome: "Resultado tactico indeciso con enormes bajas.",
    consequences: "La Union continuo avanzando, senalando una estrategia de desgaste sostenido contra la Confederacion."
  }),
  "Batalla de Meridian": makeCuratedBattle({
    parent: "Guerra de Secesion estadounidense",
    region: "Misisipi",
    year: 1864,
    cause: "La Union busco destruir infraestructura ferroviaria y capacidad logistica confederada en Misisipi.",
    sides: [{ side: "Union", members: ["Estados Unidos"] }, { side: "Confederacion", members: ["Estados Confederados"] }],
    outcome: "Victoria unionista.",
    consequences: "Dano severamente redes logisticas confederadas y anticipo la guerra de destruccion de infraestructura."
  }),
  "Batalla de Bentonville": makeCuratedBattle({
    parent: "Guerra de Secesion estadounidense",
    region: "Carolina del Norte",
    year: 1865,
    cause: "La Confederacion intento frenar el avance de Sherman por las Carolinas.",
    sides: [{ side: "Union", members: ["Estados Unidos"] }, { side: "Confederacion", members: ["Estados Confederados"] }],
    outcome: "Victoria estrategica unionista.",
    consequences: "Fue una de las ultimas grandes batallas de la guerra y acelero el colapso confederado en el este."
  }),
  "Batalla del Riachuelo": makeCuratedBattle({
    parent: "Guerra de la Triple Alianza",
    type: "batalla naval",
    scope: "regional",
    region: "Rio Parana",
    year: 1865,
    cause: "Brasil y Paraguay disputaron el control fluvial, clave para suministros y maniobra en la cuenca del Plata.",
    sides: [{ side: "Triple Alianza", members: ["Brasil", "Argentina", "Uruguay"] }, { side: "Paraguay", members: ["Paraguay"] }],
    outcome: "Victoria naval brasilena.",
    consequences: "Aseguro la superioridad fluvial aliada y limito la capacidad paraguaya de sostener operaciones ofensivas."
  }),
  "Batalla de Ixmiquilpan": makeCuratedBattle({
    parent: "Segunda intervencion francesa en Mexico",
    region: "Hidalgo",
    year: 1866,
    cause: "Fuerzas republicanas mexicanas presionaron posiciones imperiales y europeas durante el retroceso frances.",
    sides: [{ side: "Republicanos mexicanos", members: ["Mexico"] }, { side: "Imperio mexicano y voluntarios europeos", members: ["Segundo Imperio Mexicano", "Belgica"] }],
    outcome: "Victoria republicana mexicana.",
    consequences: "Reflejo el deterioro del proyecto imperial y el avance republicano hacia la restauracion."
  }),
  "Batalla de Beecher Island": makeCuratedBattle({
    parent: "Guerras indias de Estados Unidos",
    region: "Colorado",
    year: 1868,
    cause: "La expansion estadounidense y las campanas militares en las Grandes Llanuras provocaron enfrentamientos con Cheyenne, Arapaho y aliados.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Cheyenne, Arapaho y aliados", members: ["Cheyenne", "Arapaho"] }],
    outcome: "Resistencia estadounidense tras cerco indigena.",
    consequences: "Se convirtio en episodio destacado de las guerras de las Llanuras y aumento la militarizacion fronteriza."
  }),
  "Batalla de It\u00e1 Ybat\u00e9": makeCuratedBattle({
    parent: "Guerra de la Triple Alianza",
    region: "Paraguay",
    year: 1868,
    cause: "La Triple Alianza avanzo sobre las defensas paraguayas en la fase final de la campana de Lomas Valentinas.",
    sides: [{ side: "Triple Alianza", members: ["Brasil", "Argentina", "Uruguay"] }, { side: "Paraguay", members: ["Paraguay"] }],
    outcome: "Victoria aliada.",
    consequences: "Debilito gravemente la defensa paraguaya y abrio paso a la ocupacion de Asuncion."
  }),
  "Batalla de Slim Buttes": makeCuratedBattle({
    parent: "Gran Guerra Sioux",
    region: "Dakota",
    year: 1876,
    cause: "Estados Unidos persiguio a bandas lakota y cheyenne tras Little Bighorn.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Lakota y Cheyenne", members: ["Lakota", "Cheyenne"] }],
    outcome: "Victoria estadounidense.",
    consequences: "Aumento la presion militar sobre grupos sioux y cheyenne durante la campana de 1876."
  }),
  "Batalla de Bear Paw": makeCuratedBattle({
    parent: "Guerra de los Nez Perce",
    region: "Montana",
    year: 1877,
    cause: "Los nez perce intentaron llegar a Canada para evitar su traslado forzado a reservas.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Nez Perce", members: ["Nez Perce"] }],
    outcome: "Rendicion de los nez perce tras el sitio.",
    consequences: "Puso fin a la huida de Joseph y simbolizo el cierre violento de la autonomia indigena en la region."
  })
};
