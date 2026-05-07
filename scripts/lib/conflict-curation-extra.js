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
