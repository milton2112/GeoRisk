const name = "Batalla de Ochamchira";
const parent = "Guerra de Abjasia";
const region = "Ochamchira, Abjasia, Georgia";

const hierarchySources = [
  {
    label: "Human Rights Watch, Georgia/Abkhazia: Violations of the Laws of War and Russia’s Role in the Conflict, marzo de 1995: ataque a la región a fines de octubre de 1992 y combates entre aldeas hasta el invierno de 1993–1994.",
    url: "https://www.hrw.org/report/1995/03/01/georgia/abkhazia-violations-laws-war-and-russias-role-conflict"
  },
  {
    label: "Naciones Unidas, informe S/26795, 17 de noviembre de 1993: marco del conflicto armado en Abjasia desde agosto de 1992 y documentación de Ochamchira.",
    url: "https://documents.un.org/api/symbol/access?l=en&s=S%2F26795&t=pdf"
  }
];

export const OCHAMCHIRA_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent,
    war: parent,
    campaign: "Combates por la región de Ochamchira durante la guerra de Abjasia",
    startYear: 1992,
    endYear: 1994,
    datePrecision: "Desde fines de octubre de 1992 hasta el invierno de 1993–1994; rango anual aproximado para combates regionales, no para un choque único.",
    type: "batalla",
    conflictType: "civil",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    region,
    normalizedRegion: region,
    cause: "A fines de octubre de 1992, fuerzas abjasias atacaron la región de Ochamchira, disputada con fuerzas georgianas durante la guerra de Abjasia. Human Rights Watch describe combates que se extendieron entre aldeas por varios meses.",
    outcome: "Las fuentes describen una lucha prolongada por el control de la región, sin un resultado táctico único para esta entrada.",
    consequences: "Ochamchira fue un sector disputado de la guerra de Abjasia. No se atribuyen a esta entrada cambios de control ni bajas que las fuentes describen para el conflicto más amplio.",
    participants: [
      { side: "Fuerzas abjasias", members: ["Fuerzas abjasias"] },
      { side: "Fuerzas georgianas", members: ["Fuerzas georgianas"] }
    ],
    chronology: [
      { year: 1992, event: "A fines de octubre, fuerzas abjasias atacaron la región de Ochamchira; los combates se extendieron entre aldeas." },
      { year: 1994, event: "Human Rights Watch sitúa la continuación de los combates hasta el invierno de 1993–1994." }
    ],
    treaties: [],
    related: [parent],
    hierarchyConfidence: "alta",
    hierarchySources,
    sourceDispute: "La fuente describe combates en una región durante meses, no una sola acción con límites tácticos definidos. El rango 1992–1994 resume esa duración; no se agregan bajas ni un vencedor específico.",
    curationPriority: "alta",
    curationBatch: "source-backed-ochamchira-2026-10",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La jerarquía y el ámbito geográfico se apoyan en HRW y el informe S/26795 de la ONU. La fecha de fin es una conversión anual conservadora del invierno 1993–1994 descrito por HRW; la ficha no presenta los combates regionales como una batalla de un solo día ni asigna bajas o resultado táctico.",
    source: "Curaduría GeoRisk",
    pageTitle: name
  }
};
