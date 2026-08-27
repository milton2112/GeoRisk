function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  nationalArchives: source(
    "SNAC y National Archives: ficha archivistica de Eugene A. Carr y su primer combate contra apaches el 3 de octubre de 1854",
    "https://snaccooperative.org/vocab_administrator/resources/11652748"
  ),
  texasPortal: source(
    "Portal a la Historia de Texas: Fighting Men of the Indian Wars, ficha biografica de Eugene A. Carr",
    "https://texashistory.unt.edu/ark:/67531/metapth151417/m1/89/",
    "media"
  ),
  texasAlmanac: source(
    "Texas Almanac y Handbook of Texas: contexto de la frontera del oeste de Texas y Sierra Diablo",
    "https://www.texasalmanac.com/places/van-horn",
    "media"
  )
};

function diabloMountainsFix() {
  const parent = "Guerras apaches";
  const campaign = "Operaciones fronterizas estadounidenses en el oeste de Texas de 1854";
  const hierarchySources = [SOURCES.nationalArchives, SOURCES.texasPortal, SOURCES.texasAlmanac];

  return {
    parent,
    war: parent,
    campaign,
    type: "combate",
    conflictType: "colonial",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1854,
    endYear: 1854,
    region: "Cercanias de Sierra Diablo y Limpia Creek, oeste de Texas, Estados Unidos",
    normalizedRegion: "Cercanias de Sierra Diablo y Limpia Creek, oeste de Texas, Estados Unidos",
    cause: "Tras un aviso a Fort Inge sobre una incursion atribuida a apaches, una patrulla de Fusileros Montados estadounidenses salio en persecucion. El episodio ocurrio en el marco de la presencia militar estadounidense y de conflictos recurrentes de frontera en el oeste de Texas.",
    outcome: "Las fuentes revisadas coinciden en que hubo un combate el 3 de octubre de 1854 entre una patrulla estadounidense y combatientes apache. La ficha no consolida una victoria tactica, el tamano de las fuerzas ni las bajas generales; solo conserva que Eugene A. Carr resulto herido en el relato detallado.",
    consequences: "El enfrentamiento formo parte de la sucesion de operaciones fronterizas estadounidenses contra grupos apache en el oeste de Texas. Las fuentes revisadas no permiten convertirlo en un desenlace decisivo de una campana amplia ni fijar un cierre politico o militar.",
    chronology: [
      { year: 1854, event: "El 1 de octubre, una patrulla de Fusileros Montados salio de Fort Inge tras un aviso sobre una incursion atribuida a apaches." },
      { year: 1854, event: "El 3 de octubre se produjo el combate registrado cerca de Sierra Diablo; una fuente biografica lo situa cerca de Limpia Creek." }
    ],
    treaties: [],
    related: [parent, campaign, "Sierra Diablo", "Limpia Creek", "Fort Inge", "Eugene Asa Carr"],
    participants: [
      {
        side: "Patrulla estadounidense de Fusileros Montados",
        members: ["Estados Unidos", "Regimiento de Fusileros Montados de Estados Unidos"],
        casualties: "Eugene A. Carr resulto herido en una fuente detallada; total no consolidado"
      },
      {
        side: "Combatientes apache",
        members: ["Apache"],
        casualties: "No consolidado"
      }
    ],
    hierarchyConfidence: "media",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "3 de octubre de 1854",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-diablo-mountains-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La referencia archivistica confirma fecha, presencia apache y Sierra Diablo; la fuente biografica detallada anade Fort Inge, Limpia Creek, la atribucion lipan y cifras distintas de fuerza. Para no presentar como certeza una etiqueta disputada, GeoRisk usa Guerras apaches como paraguas, conserva Apache como participante y no asigna la accion a la Guerra jicarilla, una banda lipan concreta, una victoria ni bajas generales. Tampoco la fusiona con los enfrentamientos posteriores de Sierra Diablo de 1880-1881."
  };
}

export const DIABLO_MOUNTAINS_CONFLICT_RENAMES = {
  "Batalla de Diablo Mountains": "Combate de Sierra Diablo (1854)",
  "Batalla de las montanas Diablo": "Combate de Sierra Diablo (1854)",
  "Batalla de Sierra Diablo": "Combate de Sierra Diablo (1854)",
  "Battle of the Diablo Mountains": "Combate de Sierra Diablo (1854)",
  "Battle of Diablo Mountains": "Combate de Sierra Diablo (1854)"
};

export const DIABLO_MOUNTAINS_CONFLICT_DETAIL_FIXES = {
  "Combate de Sierra Diablo (1854)": diabloMountainsFix()
};
