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

export const US_REVOLUTION_CONFLICT_DETAIL_FIXES = {
  "Batalla de Saratoga": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "Nueva York",
    year: 1777,
    cause: "La campana britanica busco cortar Nueva Inglaterra del resto de las colonias rebeldes.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Victoria decisiva estadounidense.",
    consequences: "Impulso la alianza francesa con Estados Unidos y transformo la guerra en un conflicto internacional."
  }),
  "Batalla de White Marsh": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "Pensilvania",
    year: 1777,
    cause: "Maniobras britanicas para forzar combate contra el ejercito continental tras la toma de Filadelfia.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Retirada britanica sin destruir al ejercito continental.",
    consequences: "Washington preservo su fuerza principal antes del invierno en Valley Forge."
  }),
  "Batalla del cabo Finisterre (1778)": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    type: "batalla naval",
    region: "Atlantico",
    year: 1778,
    cause: "La entrada francesa en la guerra amplio el conflicto al dominio naval atlantico.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Accion naval indecisa.",
    consequences: "Mostro la creciente presion francesa sobre las rutas britanicas y el caracter global de la guerra."
  }),
  "Batalla de Flamborough Head": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    type: "batalla naval",
    region: "Mar del Norte",
    year: 1779,
    cause: "Operaciones navales estadounidenses y francesas contra comercio y convoyes britanicos.",
    sides: [{ side: "Estados Unidos y Francia", members: ["Estados Unidos", "Francia"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Victoria estadounidense-francesa.",
    consequences: "Aumento el prestigio naval rebelde y simbolizo la vulnerabilidad britanica incluso cerca de sus costas."
  }),
  "Batalla de Minisink": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "Nueva York",
    year: 1779,
    cause: "Incursiones leales e iroquesas contra asentamientos fronterizos rebeldes.",
    sides: [{ side: "Milicias estadounidenses", members: ["Estados Unidos"] }, { side: "Leales britanicos e iroqueses", members: ["Reino Unido", "Iroqueses aliados"] }],
    outcome: "Derrota de las milicias estadounidenses.",
    consequences: "Evidencio la dureza de la guerra fronteriza y la importancia de alianzas indigenas."
  }),
  "Batalla de Bull's Ferry": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "Nueva Jersey",
    year: 1780,
    cause: "Choque local por posiciones leales fortificadas y control del corredor del Hudson.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Leales britanicos", members: ["Reino Unido"] }],
    outcome: "Resistencia leal frente al ataque estadounidense.",
    consequences: "Mostro la persistencia de posiciones leales en zonas disputadas cerca de Nueva York."
  }),
  "Batalla de Ibiza": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    type: "batalla naval",
    region: "Mediterraneo occidental",
    year: 1780,
    cause: "La guerra naval global afecto convoyes, corsarios y rutas comerciales europeas.",
    sides: [{ side: "Reino Unido", members: ["Reino Unido"] }, { side: "Espana y aliados", members: ["Espana"] }],
    outcome: "Accion naval vinculada a la guerra maritima global.",
    consequences: "Reflejo como la independencia estadounidense se conecto con rivalidades europeas mas amplias."
  }),
  "Batalla de Ushant (1781)": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    type: "batalla naval",
    region: "Atlantico oriental",
    year: 1781,
    cause: "Competencia por convoyes y control maritimo entre Francia y Reino Unido.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Accion naval de resultado limitado.",
    consequences: "Formo parte del desgaste naval que condiciono comunicaciones y abastecimiento britanicos."
  }),
  "Batalla de Yorktown": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "Virginia",
    year: 1781,
    cause: "Fuerzas franco-estadounidenses buscaron aislar al ejercito britanico de Cornwallis.",
    sides: [{ side: "Estados Unidos y Francia", members: ["Estados Unidos", "Francia"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Rendicion britanica en Yorktown.",
    consequences: "Abro el camino a negociaciones de paz y al reconocimiento de la independencia estadounidense."
  }),
  "Batalla de Delaware Capes": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    type: "batalla naval",
    region: "Atlantico occidental",
    year: 1782,
    cause: "Operaciones navales en torno a accesos costeros, convoyes y control de rutas.",
    sides: [{ side: "Estados Unidos", members: ["Estados Unidos"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Accion naval menor.",
    consequences: "Mantuvo la presion sobre la movilidad britanica en las costas norteamericanas."
  }),
  "Batalla de Trincomalee": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    type: "batalla naval",
    region: "Oceano Indico",
    year: 1782,
    cause: "Francia y Reino Unido disputaron bases y rutas del Indico en el marco global de la guerra.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Accion naval franco-britanica de alcance colonial.",
    consequences: "Confirmo que el conflicto norteamericano tenia efectos en India, Ceilan y rutas oceanicas."
  }),
  "Batalla de Ushant (1782)": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    type: "batalla naval",
    region: "Atlantico oriental",
    year: 1782,
    cause: "Proteccion y ataque de convoyes durante la fase final de la guerra.",
    sides: [{ side: "Francia", members: ["Francia"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Accion naval tactica.",
    consequences: "Se sumo al desgaste naval que acompano las negociaciones finales del conflicto."
  }),
  "Batalla de Cuddalore (1783)": makeCuratedBattle({
    parent: "Guerra de Independencia de Estados Unidos",
    region: "India",
    year: 1783,
    cause: "La guerra global entre Francia y Reino Unido se extendio a enclaves y aliados en India.",
    sides: [{ side: "Francia y Mysore", members: ["Francia", "Mysore"] }, { side: "Reino Unido", members: ["Reino Unido"] }],
    outcome: "Combate final de la guerra anglo-francesa en India.",
    consequences: "La paz europea detuvo las operaciones y estabilizo temporalmente el frente indio."
  })
};
