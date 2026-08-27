function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  senateRecord: source(
    "Registro del Senado de Estados Unidos de 1828: informe contemporaneo de Benjamin Cooper sobre el ataque al Comet en el paso de Doro",
    "https://www.ibiblio.org/pha/USN/1828/18280311Piracy.html"
  ),
  navyRelations: source(
    "Naval History and Heritage Command: operaciones estadounidenses contra la pirateria griega y participacion de Louis Goldsborough en la recuperacion de un bergantin britanico",
    "https://www.history.navy.mil/research/library/online-reading-room/title-list-alphabetically/u/us-greek-naval-relations-begin.html"
  ),
  navyGoldsborough: source(
    "Naval History and Heritage Command: expedicion nocturna de cuatro botes desde la USS Porpoise para rescatar al bergantin britanico Comet",
    "https://www.history.navy.mil/research/histories/ship-histories/danfs/g/goldsborough-i.html"
  )
};

function doroPassageFix() {
  const parent = "Operaciones antipirateria estadounidenses en el mar Egeo";
  const campaign = "Escolta del convoy de la USS Porpoise entre Esmirna y Malta (1827)";
  const hierarchySources = [SOURCES.senateRecord, SOURCES.navyRelations, SOURCES.navyGoldsborough];

  return {
    parent,
    war: parent,
    campaign,
    type: "accion naval",
    conflictType: "intervencion",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1827,
    endYear: 1827,
    region: "Paso de Doro (canal de Kafireas), mar Egeo, Grecia",
    normalizedRegion: "Paso de Doro (canal de Kafireas), mar Egeo, Grecia",
    cause: "La accion se produjo durante las operaciones de escolta que la Marina de Estados Unidos realizaba para proteger el comercio en el Egeo, en un contexto de desorden, guerra de independencia griega y pirateria. El informe oficial de 1828 registra la necesidad de convoyes, pero la ficha no atribuye la pirateria a la poblacion griega en general ni la trata como una extension formal de un conflicto interestatal entre Estados Unidos y Grecia.",
    outcome: "Botes de la USS Porpoise alcanzaron y recuperaron el bergantin mercante britanico Comet, capturado durante una calma por piratas griegos. El informe contemporaneo confirma que no hubo estadounidenses heridos y que un tripulante britanico herido murio dos dias despues; no adopta un total cerrado de bajas piratas ni identifica una jefatura unica.",
    consequences: "El episodio ilustro los limites de la escolta naval frente a embarcaciones de remo en el Egeo. Los informes estadounidenses posteriores sostuvieron que la proteccion de convoyes debia continuar y, en conjunto con otros ataques de 1827, alimentaron el debate sobre reforzar la presencia naval; no se presenta Doro como causa unica de esa politica.",
    chronology: [
      { year: 1827, event: "La USS Porpoise escoltaba un convoy mercante desde Esmirna hacia Malta en un contexto de ataques piratas en el Egeo." },
      { year: 1827, event: "Durante la noche del 15 al 16 de octubre, piratas atacaron el bergantin britanico Comet en el paso de Doro; botes de la Porpoise lo recuperaron." },
      { year: 1828, event: "Documentos remitidos al Senado estadounidense describieron el episodio dentro de la necesidad continuada de escoltas y operaciones antipirateria en el Mediterraneo oriental." }
    ],
    treaties: [],
    related: [parent, campaign, "USS Porpoise", "Comet", "Andros", "Eubea", "Mar Egeo", "Estados Unidos", "Grecia", "Reino Unido"],
    participants: [
      {
        side: "Marina de Estados Unidos, destacamento de la USS Porpoise",
        members: ["Estados Unidos", "USS Porpoise", "Louis M. Goldsborough"],
        casualties: "Sin estadounidenses heridos, segun el informe de Benjamin Cooper"
      },
      {
        side: "Piratas griegos que capturaron el Comet",
        members: ["Piratas griegos"],
        casualties: "No consolidado; el informe contemporaneo describe muertes durante la recuperacion, pero no permite fijar un total fiable"
      },
      {
        side: "Tripulacion del bergantin mercante britanico Comet",
        members: ["Reino Unido", "Comet"],
        casualties: "Un tripulante britanico herido murio dos dias despues, segun el informe de la USS Porpoise"
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "noche del 15 al 16 de octubre de 1827; el informe contemporaneo usa el 15 y fuentes de sintesis suelen registrar el 16",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-doro-passage-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa la ubicaba de forma erronea en America. La fuente primaria de 1828 situa el hecho en el paso de Doro, en el Egeo, y registra un ataque al bergantin britanico Comet durante una escolta de la USS Porpoise. GeoRisk incorpora a Grecia por ubicacion y por los piratas identificados en la fuente, a Estados Unidos por la fuerza de rescate y al Reino Unido por el mercante afectado. Conserva la diferencia de fecha entre la noche del 15 y las sintesis que usan el 16 de octubre, y no adopta cifras de bajas piratas repetidas por fuentes posteriores sin conciliacion con el parte contemporaneo. Tampoco convierte a Grecia ni a la Guerra de Independencia griega en un bando estatal de la accion."
  };
}

export const DORO_PASSAGE_CONFLICT_RENAMES = {
  "Batalla de Doro Passage": "Accion naval del paso de Doro (1827)",
  "Batalla del paso de Doro": "Accion naval del paso de Doro (1827)",
  "Accion del paso de Doro": "Accion naval del paso de Doro (1827)",
  "Battle of Doro Passage": "Accion naval del paso de Doro (1827)",
  "Battle of the Doro Passage": "Accion naval del paso de Doro (1827)"
};

export const DORO_PASSAGE_COUNTRY_CONFLICT_ADDITIONS = {
  "Grecia": ["Accion naval del paso de Doro (1827)"],
  "Reino Unido": ["Accion naval del paso de Doro (1827)"]
};

export const DORO_PASSAGE_CONFLICT_DETAIL_FIXES = {
  "Accion naval del paso de Doro (1827)": doroPassageFix()
};
