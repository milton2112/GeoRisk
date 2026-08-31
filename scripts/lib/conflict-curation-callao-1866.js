function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate del Callao (1866)";
const PARENT = "Guerra hispano-sudamericana";
const CAMPAIGN = "Operaciones navales de la Escuadra del Pacifico (1865-1866)";

const SOURCES = {
  esffaa: source(
    "Escuela Superior Conjunta de las Fuerzas Armadas del Peru: declaracion de guerra, defensas del Callao, inicio del bombardeo y respuesta peruana",
    "https://www.esffaa.edu.pe/020524-2mayo/"
  ),
  spanishNavy: source(
    "Armada Espa\u00f1ola, Revista de Historia Naval: analisis militar del combate del 2 de mayo de 1866",
    "https://armada.defensa.gob.es/archivo/mardigitalrevistas/rhn/1991/1991n32.pdf"
  ),
  bne: source(
    "Biblioteca Nacional de Espa\u00f1a: autoridad con los nombres Combate del 2 de Mayo, Combate naval del Callao, Batalla del Callao y Bombardeo del Callao",
    "https://datos.bne.es/resource/XX538840"
  )
};

function callao1866Fix() {
  const hierarchySources = [SOURCES.esffaa, SOURCES.spanishNavy, SOURCES.bne];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate naval y costero",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1866,
    endYear: 1866,
    region: "Puerto del Callao, Lima, Peru, oc\u00e9ano Pacifico",
    normalizedRegion: "Callao, Peru",
    cause: "Dentro de la Guerra hispano-sudamericana, la Escuadra Espa\u00f1ola del Pacifico ataco las defensas peruanas del Callao. La ficha describe el episodio como una accion naval y costera de la guerra, sin atribuirle una causa unica posterior ni convertirlo en una disputa colonial simplificada.",
    outcome: "Resultado tactico y politico discutido. La escuadra espa\u00f1ola completo la accion de bombardeo y se retiro sin tomar el puerto; las defensas peruanas conservaron el control del Callao. Los relatos nacionales de ambos paises lo han presentado como victoria, por lo que GeoRisk no fija una victoria unilateral decisiva.",
    consequences: "La accion no produjo la toma del puerto y paso a ser un hito de memoria publica y militar en Peru y Espa\u00f1a. Formo parte de la fase final de las operaciones de la Escuadra del Pacifico; esta ficha no la presenta como un tratado, una rendicion general ni un cierre diplomatico independiente de la guerra.",
    chronology: [
      {
        year: 1866,
        event: "El 14 de enero, Peru declaro la guerra a Espa\u00f1a en el marco de la Guerra hispano-sudamericana."
      },
      {
        year: 1866,
        event: "El 2 de mayo, alrededor del mediodia, la Escuadra Espa\u00f1ola del Pacifico inicio el bombardeo de las defensas del Callao y las baterias peruanas respondieron al fuego."
      },
      {
        year: 1866,
        event: "La accion termino sin ocupacion del puerto. La memoria historica peruana y espa\u00f1ola conserva interpretaciones distintas sobre su resultado, por lo que la ficha evita convertir esas narrativas en un marcador unico de victoria."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Escuadra del Pacifico", "Callao", "Mariano Ignacio Prado", "Jose Galvez", "Casto Mendez Nunez"],
    participants: [
      {
        side: "Defensas peruanas del Callao",
        members: ["Per\u00fa", "Marina de Guerra del Per\u00fa", "Ej\u00e9rcito del Per\u00fa", "baterias del Callao", "Mariano Ignacio Prado", "Jos\u00e9 Galvez"],
        casualties: "Jose Galvez murio durante la accion segun la fuente institucional peruana. GeoRisk no fija un total agregado de bajas peruanas porque los recuentos comparables no son uniformes en las fuentes revisadas."
      },
      {
        side: "Escuadra Espa\u00f1ola del Pacifico",
        members: ["Espa\u00f1a", "Armada Espa\u00f1ola", "Escuadra del Pacifico", "Casto Mendez Nunez", "fragata blindada Numancia"],
        casualties: "Casto Mendez Nunez resulto herido durante el combate segun la fuente institucional peruana. GeoRisk no publica una cifra agregada de bajas espa\u00f1olas porque las estimaciones y los criterios de recuento no son consistentes entre los relatos revisados."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "2 de mayo de 1866",
    sourceDispute: "Las autoridades bibliograficas reconocen Combate del Callao, Combate naval del Callao, Batalla del Callao y Bombardeo del Callao como nombres del mismo hecho. Las fuentes institucionales peruanas y espa\u00f1olas coinciden en fecha, lugar, accion naval y defensas costeras, pero los relatos nacionales no coinciden al resumir una victoria. Por eso GeoRisk conserva los dos efectos verificables -la retirada sin toma del puerto y la conservacion peruana del control del Callao- sin declarar un vencedor unilateral ni sumar bajas heterogeneas.",
    curationPriority: "alta",
    curationBatch: "source-backed-callao-1866-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Las entradas provisionales Combate del Callao y Combate naval del Callao describian el mismo episodio como una batalla interestatal sin fecha, contraparte ni guerra verificable. Se consolidan como Combate del Callao (1866), se vinculan a la Guerra hispano-sudamericana y se conecta Espa\u00f1a como participante. La campana es una etiqueta organizativa de GeoRisk para las operaciones de la Escuadra del Pacifico, no el nombre de un tratado ni de una guerra distinta."
  };
}

export const CALLAO_1866_CONFLICT_RENAMES = {
  "Combate del Callao": CANONICAL,
  "Combate naval del Callao": CANONICAL,
  "Combate del Callao (1866)": CANONICAL,
  "Combate del 2 de mayo": CANONICAL,
  "Combate del 2 de Mayo": CANONICAL,
  "Batalla del Callao": CANONICAL,
  "Bombardeo del Callao": CANONICAL,
  "Battle of Callao": CANONICAL
};

export const CALLAO_1866_COUNTRY_CONFLICT_ADDITIONS = {
  "Espa\u00f1a": [CANONICAL]
};

export const CALLAO_1866_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: callao1866Fix()
};
