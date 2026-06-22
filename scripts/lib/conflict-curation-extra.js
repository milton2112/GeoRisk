function makeCuratedBattle({ parent, type = "batalla", region, year, cause, sides, outcome, consequences, related = [] }) {
  return {
    parent,
    type,
    scope: "regional",
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

export const EXTRA_SAFE_CONFLICT_RENAMES = {
  "6000-Mark War": "Guerra de los 6000 marcos",
  "Polish–Swedish War de 1617-18": "Guerra polaco-sueca de 1617-1618",
  "Polish–Swedish War de 1621–25": "Guerra polaco-sueca de 1621-1625",
  "Naval War on Lake Constance": "Guerra naval del lago de Constanza",
  "First Bremish-Swedish War": "Primera guerra entre Bremen y Suecia",
  "Pomeranian War": "Guerra de Pomerania",
  "Burmese–Siamese War de 1785–86": "Guerra birmano-siamesa de 1785-1786",
  "Northwest Indian War": "Guerra india del Noroeste",
  "Teatro War": "Guerra del Teatro",
  "Anglo-Swedish War": "Guerra anglo-sueca",
  "Eel River Battlefield War de 1812": "Batalla del rio Eel en la Guerra de 1812",
  "Jicarilla War": "Guerra jicarilla",
  "Yakima War": "Guerra yakama",
  "Paiute War": "Guerra paiute",
  "Colorado War": "Guerra de Colorado",
  "Germany Unification War": "Guerra de unificacion alemana",
  "Kake War": "Guerra de Kake",
  "Honduran-Salvadoran War de 1871": "Guerra hondureno-salvadorena de 1871",
  "Modoc War": "Guerra modoc",
  "Red River War": "Guerra del rio Rojo",
  "Bannock War": "Guerra bannock",
  "Ghost Dance War": "Guerra de la Danza de los Espiritus",
  "First Soviet-Finnish War": "Primera guerra sovietico-finlandesa",
  "Soviet-Bulgarian War": "Guerra sovietico-bulgara",
  "First Rwanda War": "Primera guerra de Ruanda",
  "First Uganda War": "Primera guerra de Uganda",
  "Liberation de Jerusalem en Six-Day War": "Liberacion de Jerusalen en la Guerra de los Seis Dias",
  "Syrian front en War de Attrition": "Frente sirio en la Guerra de Desgaste",
  "Second Guatemala War": "Segunda guerra de Guatemala",
  "First Guatemala War": "Primera guerra de Guatemala",
  "First Burundi War": "Primera guerra de Burundi",
  "War de Attrition en Bashan Salient": "Guerra de Desgaste en el saliente de Basan",
  "Third Guatemala War": "Tercera guerra de Guatemala",
  "Coconut War": "Guerra del Coco",
  "Eelam War I": "Primera guerra del Eelam",
  "Eelam War II": "Segunda guerra del Eelam",
  "Algerian Islamic Front War": "Guerra del Frente Islamico Argelino",
  "Dniestrian Independence War": "Guerra de independencia del Dniester",
  "Georgia War": "Guerra de Georgia",
  "Second Liberia War": "Segunda guerra de Liberia",
  "Second Rwanda War": "Segunda guerra de Ruanda",
  "Eelam War III": "Tercera guerra del Eelam",
  "Third Rwanda War": "Tercera guerra de Ruanda",
  "Eastern Teatro de Eelam War IV": "Teatro oriental de la cuarta guerra del Eelam",
  "Iraq War troop surge de 2007": "Refuerzo de tropas de la Guerra de Irak de 2007",
  "Battle at Mouth de Neva": "Batalla en la desembocadura del Neva",
  "Intelligence en Battle de Princeton": "Inteligencia en la batalla de Princeton",
  "Victorio's War": "Guerra de Victorio",
  "Batalla de GoÅ‚Ä…b": "Batalla de Golab",
  "Batalla de MÃ¸n": "Batalla de Mon",
  "Batalla de KÃ¸ge Bay": "Batalla de Koge Bay",
  "Batalla de KoÅ›cianem (1655)": "Batalla de Koscianem (1655)",
  "Batalla de Nowy DwÃ³r Mazowiecki": "Batalla de Nowy Dwor Mazowiecki",
  "Batalla de UjÅ›cie": "Batalla de Ujscie",
  "Sitio de ZamoÅ›Ä‡": "Sitio de Zamosc",
  "Sitio de ToruÅ„": "Sitio de Torun"
};

export const EXTRA_CURATED_CONFLICT_DETAIL_FIXES = {
  "Batalla de Czarne": makeCuratedBattle({
    parent: "Guerra polaco-sueca de 1626-1629",
    region: "Prusia Real",
    year: 1627,
    cause: "Disputa sueco-polaca por el control de Prusia y las rutas balticas.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Polonia-Lituania", members: ["Polonia-Lituania"] }],
    outcome: "Accion tactica dentro de la campana prusiana.",
    consequences: "Mantuvo la presion sueca sobre posiciones polaco-lituanas en el Baltico."
  }),
  "Batalla de Dirschau": makeCuratedBattle({
    parent: "Guerra polaco-sueca de 1626-1629",
    region: "Prusia Real",
    year: 1627,
    cause: "Choque por el control de accesos y posiciones prusianas durante la guerra sueco-polaca.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Polonia-Lituania", members: ["Polonia-Lituania"] }],
    outcome: "Resultado tactico disputado, con continuidad de la campana.",
    consequences: "La guerra siguio centrada en control portuario, rutas fluviales y desgaste regional."
  }),
  "Batalla de Koscianem (1655)": makeCuratedBattle({
    parent: "El Diluvio",
    region: "Polonia",
    year: 1655,
    cause: "Ofensiva sueca sobre la Mancomunidad polaco-lituana durante el Diluvio.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Polonia-Lituania", members: ["Polonia-Lituania"] }],
    outcome: "Victoria sueca local.",
    consequences: "Contribuyo al avance sueco inicial y a la crisis militar de la Mancomunidad."
  }),
  "Batalla de Nowy Dwor Mazowiecki": makeCuratedBattle({
    parent: "El Diluvio",
    region: "Mazovia",
    year: 1655,
    cause: "Control de rutas hacia Varsovia durante la invasion sueca de Polonia-Lituania.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Polonia-Lituania", members: ["Polonia-Lituania"] }],
    outcome: "Episodio tactico de la campana sueca.",
    consequences: "Reflejo la rapidez del avance sueco y la debilidad inicial de la defensa polaca."
  }),
  "Batalla de Ujscie": makeCuratedBattle({
    parent: "El Diluvio",
    region: "Gran Polonia",
    year: 1655,
    cause: "Rendicion y choque politico-militar durante la entrada sueca en Polonia.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Nobleza y fuerzas polacas", members: ["Polonia-Lituania"] }],
    outcome: "Ventaja sueca y sometimiento regional temporal.",
    consequences: "Acelero la ocupacion sueca de sectores de la Mancomunidad."
  }),
  "Batalla de Golab": makeCuratedBattle({
    parent: "El Diluvio",
    region: "Polonia",
    year: 1656,
    cause: "Contraofensivas polacas y operaciones suecas durante la guerra del Diluvio.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Polonia-Lituania", members: ["Polonia-Lituania"] }],
    outcome: "Victoria sueca.",
    consequences: "La guerra continuo con resistencia polaca, desgaste sueco y cambios de alianzas."
  }),
  "Batalla de Varsovia": makeCuratedBattle({
    parent: "El Diluvio",
    region: "Mazovia",
    year: 1656,
    cause: "Intento de controlar la capital y quebrar la resistencia polaco-lituana.",
    sides: [{ side: "Suecia y Brandeburgo", members: ["Suecia", "Brandeburgo-Prusia"] }, { side: "Polonia-Lituania", members: ["Polonia-Lituania"] }],
    outcome: "Victoria sueco-brandeburguesa.",
    consequences: "No resolvio la guerra; la resistencia polaca siguio activa y el conflicto se amplio diplomaticamente."
  }),
  "Sitio de Zamosc": makeCuratedBattle({
    parent: "El Diluvio",
    type: "sitio",
    region: "Polonia",
    year: 1656,
    cause: "Intento sueco de tomar una plaza fortificada clave durante la invasion.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Defensores polacos", members: ["Polonia-Lituania"] }],
    outcome: "Resistencia polaca y fracaso del asedio sueco.",
    consequences: "Fortalecio la moral defensiva y mostro los limites logisticos del avance sueco."
  }),
  "Batalla de Mon": makeCuratedBattle({
    parent: "Guerra dano-sueca de 1657-1658",
    type: "batalla naval",
    region: "Baltico occidental",
    year: 1657,
    cause: "Disputa naval entre Dinamarca y Suecia por el control de estrechos y rutas balticas.",
    sides: [{ side: "Dinamarca-Noruega", members: ["Dinamarca", "Noruega"] }, { side: "Suecia", members: ["Suecia"] }],
    outcome: "Accion naval dentro de la guerra dano-sueca.",
    consequences: "Formo parte de la competencia por movilidad naval y control del Baltico."
  }),
  "Sitio de Torun": makeCuratedBattle({
    parent: "El Diluvio",
    type: "sitio",
    region: "Prusia Real",
    year: 1658,
    cause: "Recuperacion de posiciones ocupadas por Suecia durante la fase final del Diluvio.",
    sides: [{ side: "Polonia-Lituania y aliados", members: ["Polonia-Lituania", "Austria"] }, { side: "Guarnicion sueca", members: ["Suecia"] }],
    outcome: "Recuperacion de Torun por fuerzas polacas y aliadas.",
    consequences: "Debilito el control sueco en Prusia y acompano el retroceso de la ocupacion."
  }),
  "Batalla de Martinique": makeCuratedBattle({
    parent: "Guerras anglo-francesas del Caribe",
    type: "batalla naval",
    region: "Caribe",
    year: 1667,
    cause: "Rivalidad colonial franco-inglesa por islas, rutas y enclaves caribenos.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Inglaterra", members: ["Inglaterra"] }],
    outcome: "Combate naval de impacto regional.",
    consequences: "Refuerzo la importancia estrategica del Caribe en las guerras europeas."
  }),
  "Batalla de Koge Bay": makeCuratedBattle({
    parent: "Guerra escanesa",
    type: "batalla naval",
    region: "Baltico",
    year: 1677,
    cause: "Control naval del Baltico durante la guerra entre Suecia y Dinamarca-Noruega.",
    sides: [{ side: "Dinamarca-Noruega", members: ["Dinamarca", "Noruega"] }, { side: "Suecia", members: ["Suecia"] }],
    outcome: "Victoria danesa.",
    consequences: "Limito la movilidad naval sueca y favorecio operaciones danesas en el teatro escanes."
  }),
  "Batalla del banco Dogger (1696)": makeCuratedBattle({
    parent: "Guerra de los Nueve Anos",
    type: "batalla naval",
    region: "Mar del Norte",
    year: 1696,
    cause: "Guerra maritima y proteccion de convoyes durante la rivalidad franco-aliada.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Alianza anglo-neerlandesa", members: ["Inglaterra", "Paises Bajos"] }],
    outcome: "Accion naval vinculada a la guerra de corso y convoyes.",
    consequences: "Subrayo el peso de la guerra economica maritima en el conflicto europeo."
  })
};

EXTRA_SAFE_CONFLICT_RENAMES["Batalla de Gołąb"] = "Batalla de Golab";
EXTRA_SAFE_CONFLICT_RENAMES["Batalla de Møn"] = "Batalla de Mon";
EXTRA_SAFE_CONFLICT_RENAMES["Batalla de Køge Bay"] = "Batalla de Koge Bay";
EXTRA_SAFE_CONFLICT_RENAMES["Batalla de Kościanem (1655)"] = "Batalla de Koscianem (1655)";
EXTRA_SAFE_CONFLICT_RENAMES["Batalla de Nowy Dwór Mazowiecki"] = "Batalla de Nowy Dwor Mazowiecki";
EXTRA_SAFE_CONFLICT_RENAMES["Batalla de Ujście"] = "Batalla de Ujscie";
EXTRA_SAFE_CONFLICT_RENAMES["Sitio de Zamość"] = "Sitio de Zamosc";
EXTRA_SAFE_CONFLICT_RENAMES["Sitio de Toruń"] = "Sitio de Torun";

EXTRA_CURATED_CONFLICT_DETAIL_FIXES["Batalla de Gołąb"] = EXTRA_CURATED_CONFLICT_DETAIL_FIXES["Batalla de Golab"];
EXTRA_CURATED_CONFLICT_DETAIL_FIXES["Batalla de Møn"] = EXTRA_CURATED_CONFLICT_DETAIL_FIXES["Batalla de Mon"];
EXTRA_CURATED_CONFLICT_DETAIL_FIXES["Batalla de Køge Bay"] = EXTRA_CURATED_CONFLICT_DETAIL_FIXES["Batalla de Koge Bay"];

Object.assign(EXTRA_CURATED_CONFLICT_DETAIL_FIXES, {
  "Batalla de Vilnius (1702)": makeCuratedBattle({
    parent: "Gran Guerra del Norte",
    region: "Lituania",
    year: 1702,
    cause: "Disputa por posiciones estrategicas de la Mancomunidad polaco-lituana durante la expansion sueca y la coalicion antisueca.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Fuerzas polaco-lituanas y sajonas", members: ["Polonia-Lituania", "Sajonia"] }],
    outcome: "Ventaja sueca en el teatro lituano.",
    consequences: "Refuerzo temporalmente la iniciativa sueca en Europa oriental durante la primera fase de la guerra."
  }),
  "Sitio de Tartu": makeCuratedBattle({
    parent: "Gran Guerra del Norte",
    type: "sitio",
    region: "Livonia",
    year: 1704,
    cause: "Rusia busco tomar plazas balticas controladas por Suecia para abrir acceso estrategico al Baltico.",
    sides: [{ side: "Rusia", members: ["Rusia"] }, { side: "Suecia", members: ["Suecia"] }],
    outcome: "Captura rusa de Tartu.",
    consequences: "Debilito la red sueca en Livonia y anticipo el giro ruso en el Baltico."
  }),
  "Batalla de Helsingborg": makeCuratedBattle({
    parent: "Gran Guerra del Norte",
    region: "Escania",
    year: 1710,
    cause: "Dinamarca-Noruega intento recuperar influencia en Escania aprovechando la presion militar sobre Suecia.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Dinamarca-Noruega", members: ["Dinamarca", "Noruega"] }],
    outcome: "Victoria sueca.",
    consequences: "Freno la ofensiva danesa en Escania y sostuvo el control sueco del sur peninsular."
  }),
  "Batalla naval de Rugen": makeCuratedBattle({
    parent: "Gran Guerra del Norte",
    type: "batalla naval",
    region: "Baltico",
    year: 1712,
    cause: "Control de comunicaciones y operaciones navales en torno a Pomerania sueca.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Dinamarca-Noruega y aliados", members: ["Dinamarca", "Noruega"] }],
    outcome: "Accion naval dentro del desgaste baltico.",
    consequences: "Mantuvo la presion sobre las posiciones suecas en el sur del Baltico."
  }),
  "Batalla de Greifswald Bodden": makeCuratedBattle({
    parent: "Gran Guerra del Norte",
    type: "batalla naval",
    region: "Pomerania sueca",
    year: 1715,
    cause: "Operaciones aliadas contra enclaves suecos en el Baltico meridional.",
    sides: [{ side: "Suecia", members: ["Suecia"] }, { side: "Coalicion antisueca", members: ["Dinamarca", "Prusia", "Sajonia"] }],
    outcome: "Retroceso sueco en el teatro pomerano.",
    consequences: "Contribuyo al aislamiento de posiciones suecas y al debilitamiento de su poder baltico."
  }),
  "Batalla de Cuddalore (1758)": makeCuratedBattle({
    parent: "Guerra de los Siete Anos",
    region: "India",
    year: 1758,
    cause: "Competencia franco-britanica por enclaves comerciales y poder regional en el subcontinente indio.",
    sides: [{ side: "Francia y aliados locales", members: ["Francia"] }, { side: "Reino Unido y aliados locales", members: ["Reino Unido"] }],
    outcome: "Episodio tactico de la guerra colonial en India.",
    consequences: "Se integro en la rivalidad global franco-britanica que redefinio el equilibrio colonial."
  }),
  "Batalla del cabo Finisterre": makeCuratedBattle({
    parent: "Guerra de los Siete Anos",
    type: "batalla naval",
    region: "Atlantico nororiental",
    year: 1761,
    cause: "Disputa por convoyes, rutas maritimas y bloqueo durante la guerra naval franco-britanica.",
    sides: [{ side: "Reino Unido", members: ["Reino Unido"] }, { side: "Francia", members: ["Francia"] }],
    outcome: "Accion naval dentro del control britanico de rutas oceanicas.",
    consequences: "Reflejo la ventaja maritima britanica y la presion sobre comunicaciones francesas."
  }),
  "Batalla de Fort Cumberland": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "Nueva Escocia",
    year: 1776,
    cause: "Intento rebelde de ampliar la insurreccion contra el poder britanico hacia territorios atlanticos.",
    sides: [{ side: "Rebeldes estadounidenses y simpatizantes", members: ["Estados Unidos"] }, { side: "Leales britanicos", members: ["Reino Unido"] }],
    outcome: "Fracaso rebelde.",
    consequences: "Ayudo a mantener Nueva Escocia bajo control britanico durante la guerra."
  }),
  "Batalla de Iron Works Hill": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "Nueva Jersey",
    year: 1776,
    cause: "Choques de maniobra tras la campana de Nueva York y Nueva Jersey.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido y hessianos", members: ["Reino Unido", "Hesse"] }],
    outcome: "Accion tactica favorable a fuerzas estadounidenses.",
    consequences: "Formo parte de la recuperacion de iniciativa rebelde antes y despues de Trenton."
  }),
  "Batalla de Nassau": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "Bahamas",
    year: 1776,
    cause: "Necesidad estadounidense de capturar polvora y suministros navales britanicos.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido", members: ["Reino Unido", "Bahamas britanicas"] }],
    outcome: "Captura estadounidense de suministros.",
    consequences: "Fue una de las primeras operaciones anfibias estadounidenses y tuvo valor logistico para la rebelion."
  }),
  "Batalla de Machias (1777)": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "Maine",
    year: 1777,
    cause: "Operaciones britanicas y leales contra focos rebeldes costeros en Nueva Inglaterra.",
    sides: [{ side: "Milicias estadounidenses", members: ["Estados Unidos"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Defensa estadounidense local.",
    consequences: "Mantuvo activo el control rebelde en zonas costeras y complico operaciones britanicas en Maine."
  })
});

EXTRA_SAFE_CONFLICT_RENAMES["Batalla naval de RÃ¼gen"] = "Batalla naval de Rugen";
EXTRA_CURATED_CONFLICT_DETAIL_FIXES["Batalla naval de RÃ¼gen"] = EXTRA_CURATED_CONFLICT_DETAIL_FIXES["Batalla naval de Rugen"];
