function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Ataque del rio Mimbres (1860)";
const PARENT = "Guerras apaches";
const CAMPAIGN = "Conflictos mineros y de frontera en el Mimbres (1860)";

const SOURCES = {
  newMexicoGeologicalSociety: source(
    "New Mexico Geological Society, R. W. Norton, Apaches and the mining menace: Indian-White conflicts in southwestern New Mexico, 1800-1886: identifica el ataque del 4 de diciembre de 1860 de 28 mineros contra un grupo mimbreno y lo situa en la escalada por la frontera minera",
    "https://nmgs.nmt.edu/publications/guidebooks/downloads/49/49_p0055_p0060.pdf"
  ),
  nationalParkServiceApacheWars: source(
    "Servicio de Parques Nacionales de EE. UU., Chiricahua National Monument: contexto de las guerras apaches y de la resistencia apache frente a la expansion estadounidense en el suroeste",
    "https://www.nps.gov/chir/learn/historyculture/apache-wars-cochise.htm"
  ),
  nationalParkServiceApachean: source(
    "Servicio de Parques Nacionales de EE. UU., White Sands: sintesis del ciclo amplio de las Guerras apaches y sus consecuencias territoriales y de desplazamiento",
    "https://www.nps.gov/whsa/learn/historyculture/apachean.htm"
  )
};

function mimbresRiverFix() {
  const hierarchySources = [
    SOURCES.newMexicoGeologicalSociety,
    SOURCES.nationalParkServiceApacheWars,
    SOURCES.nationalParkServiceApachean
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "ataque de frontera",
    conflictType: "frontera",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1860,
    endYear: 1860,
    region: "Ribera occidental del rio Mimbres, actual suroeste de Nuevo Mexico, Estados Unidos",
    normalizedRegion: "Ribera occidental del rio Mimbres, actual suroeste de Nuevo Mexico, Estados Unidos",
    cause: "El detonante inmediato recogido por la fuente es la acusacion de que personas mimbrenas habian matado y comido una mula de un minero texano. El episodio ocurrio en un contexto mas amplio de entrada de mineros y colonos en territorios apache, ausencia de una reserva reconocida y escalada de conflictos de frontera.",
    outcome: "Un grupo de mineros ataco por sorpresa a un grupo mimbreno el 4 de diciembre de 1860. La fuente consultada registra muertes entre las personas atacadas, incluido un dirigente llamado Elias, pero no permite fijar un balance completo ni describir el desenlace como una victoria militar equivalente entre dos ejercitos.",
    consequences: "La sintesis de la New Mexico Geological Society ubica el ataque, la muerte de Elias y la humillacion posterior de Mangas Coloradas dentro de la escalada que desestabilizo el suroeste de Nuevo Mexico. La ficha evita reducir esa secuencia a una represalia aislada o atribuir causalidad unica a un solo episodio.",
    chronology: [
      {
        year: 1860,
        event: "El 4 de diciembre, 28 mineros, en su mayoria texanos segun la fuente, atacaron a un grupo mimbreno en la ribera occidental del rio Mimbres tras la disputa por una mula."
      },
      {
        year: 1860,
        event: "La misma sintesis indica que, despues del ataque, Mangas Coloradas fue a Pinos Altos para intentar que los mineros abandonaran la zona y fue retenido y azotado por ellos."
      },
      {
        year: 1861,
        event: "La escalada por la frontera minera se entrelazo con nuevos enfrentamientos entre grupos apache, mineros, colonos y autoridades estadounidenses en el suroeste."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Mangas Coloradas", "Pinos Altos"],
    participants: [
      {
        side: "Grupo de mineros de Pinos Altos",
        members: ["28 mineros, en su mayoria texanos segun la fuente", "poblacion minera de Pinos Altos"],
        casualties: "No consolidadas: la fuente especifica no ofrece una serie de bajas del grupo minero."
      },
      {
        side: "Grupo mimbreno apache atacado",
        members: ["Mimbrenos, grupo apache mencionado por la fuente", "personas presentes en el grupo del rio Mimbres"],
        casualties: "La fuente registra muertes y nombra a Elias entre ellas, pero no presenta un recuento completo de personas muertas, heridas o capturadas."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "4 de diciembre de 1860",
    sourceDispute: "La bibliografia secundaria no coincide por completo en la denominacion del grupo apache, el numero de mineros y los detalles de capturas, bajas y liderazgos. La ficha sigue la identificacion, la fecha y la cifra de 28 mineros de la New Mexico Geological Society; no convierte otras cifras difundidas por relatos posteriores en datos cerrados ni presenta a los mimbrenos como un Estado o ejercito homogeneo.",
    curationPriority: "alta",
    curationBatch: "source-backed-mimbres-river-1860-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior carecia de fecha y aparecia bajo Conflicto regional de America como batalla interestatal. Se renombra para eliminar el anglicismo, se incorpora a las Guerras apaches y se usa ataque de frontera porque la fuente describe una incursion de mineros contra un grupo apache. La etiqueta de campana es organizativa de GeoRisk, no el nombre de una campana oficial."
  };
}

export const MIMBRES_RIVER_1860_CONFLICT_RENAMES = {
  "Batalla de Mimbres River": CANONICAL,
  "Batalla del rio Mimbres": CANONICAL,
  "Batalla del Rio Mimbres": CANONICAL,
  "Battle of the Mimbres River": CANONICAL,
  "Battle of Mimbres River": CANONICAL,
  "Ataque del rio Mimbres": CANONICAL,
  "Ataque del rio Mimbres (1860)": CANONICAL
};

export const MIMBRES_RIVER_1860_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [PARENT, CANONICAL]
};

export const MIMBRES_RIVER_1860_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: mimbresRiverFix()
};
