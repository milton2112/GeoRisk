function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  usArmyMedalOfHonor: source(
    "Ejército de Estados Unidos, ficha de la Medalla de Honor de Kyle J. White: fecha, lugar, composición de la patrulla, ataque en tres direcciones y evacuación",
    "https://www.army.mil/medalofhonor/white/"
  ),
  usArmyHallOfHeroes: source(
    "Ejército de Estados Unidos, Hall of Heroes: unidad de Chosen Company, contexto de la emboscada y seis bajas estadounidenses",
    "https://www.army.mil/article/125983/White_inducted_into_Pentagon_s_Hall_of_Heroes/?from=moh_white_news_text"
  ),
  armyUniversityPress: source(
    "Army University Press, Military Review: estudio institucional sobre la emboscada de Aranas y el despliegue conjunto estadounidense-afgano",
    "https://www.armyupress.army.mil/Portals/7/military-review/Archives/English/MilitaryReview_20140831_art001.pdf"
  )
};

function historicalFix({
  parent,
  campaign,
  region,
  hierarchySources,
  participants,
  cause,
  outcome,
  consequences,
  chronology
}) {
  const sources = hierarchySources.filter(Boolean);
  return {
    parent,
    war: parent,
    campaign,
    type: "batalla",
    conflictType: "insurgencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 2007,
    endYear: 2007,
    region,
    normalizedRegion: "Asia",
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [...new Set([
      parent,
      campaign,
      "Operación Libertad Duradera",
      "Combat Outpost Bella",
      "Aranas",
      "Kyle J. White",
      "173.ª Brigada Aerotransportada"
    ].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-aranas-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: false,
    curationNote: "Las fuentes institucionales estadounidenses confirman la fecha, el lugar, la composición aproximada de la patrulla, el ataque desde varias direcciones, las seis muertes estadounidenses y la evacuación posterior. No identifican nominalmente a la fuerza insurgente ni fijan sus bajas o un resultado territorial permanente; la ficha no agrega esas cifras. No se adjudica una victoria táctica. La agrupación «Operaciones en Nuristán» es una categoría operativa de GeoRisk para ordenar acciones locales de la provincia, no el nombre de una campaña oficial citado por estas fuentes."
  };
}

export const ARANAS_CONFLICT_RENAMES = {
  "Batalla de Aranas": "Batalla de Aranas (2007)",
  "Battle of Aranas": "Batalla de Aranas (2007)"
};

export const ARANAS_COUNTRY_CONFLICT_ADDITIONS = {
  "Afganistán": ["Batalla de Aranas (2007)"]
};

export const ARANAS_CONFLICT_DETAIL_FIXES = {
  "Batalla de Aranas (2007)": historicalFix({
    parent: "Guerra de Afganistán",
    campaign: "Operaciones en Nuristán",
    region: "Alrededores de Aranas y Combat Outpost Bella, valle de Waygal, provincia de Nuristán, Afganistán",
    hierarchySources: [SOURCES.usArmyMedalOfHonor, SOURCES.usArmyHallOfHeroes, SOURCES.armyUniversityPress],
    participants: [
      {
        side: "Fuerza combinada estadounidense-afgana",
        members: [
          "1.er Pelotón, Compañía Chosen, 2.º Batallón (Aerotransportado), 503.º Regimiento de Infantería, 173.ª Brigada Aerotransportada",
          "Catorce militares estadounidenses y aproximadamente una escuadra del Ejército Nacional Afgano",
          "Equipo de entrenamiento integrado con un infante de marina estadounidense"
        ]
      },
      {
        side: "Fuerza insurgente opuesta",
        members: [
          "Combatientes que atacaron desde posiciones elevadas y fortificadas con armas ligeras, ametralladoras y lanzacohetes",
          "Fuerza adversaria no identificada nominalmente por las fuentes institucionales de esta ficha"
        ]
      }
    ],
    cause: "Una patrulla del 1.er Pelotón de la Compañía Chosen salió de Combat Outpost Bella hacia Aranas para reunirse con ancianos locales. Después de la reunión, al iniciar el regreso por el valle de Waygal, la patrulla fue atacada desde el terreno elevado; el Ejército de Estados Unidos describe una emboscada simultánea contra la patrulla, su observación de cobertura y el puesto Bella.",
    outcome: "El combate duró más de cuatro horas. Las fuentes institucionales confirman seis muertes estadounidenses, numerosos heridos y la evacuación de los heridos y de los caídos mediante apoyo de fuego y helicópteros. No fijan una cifra de bajas insurgentes ni un resultado territorial duradero, por lo que la ficha no adjudica una victoria táctica.",
    consequences: "La acción no puso fin a la Guerra de Afganistán. La respuesta de Kyle J. White, incluida la coordinación de comunicaciones, seguridad y evacuación bajo fuego, fue posteriormente reconocida con la Medalla de Honor; la fuente militar la conserva como la Batalla de Aranas.",
    chronology: [
      { year: 2007, event: "El 8 de noviembre, elementos del 1.er Pelotón de la Compañía Chosen salieron de Combat Outpost Bella hacia Aranas para una reunión con líderes de la aldea." },
      { year: 2007, event: "El 9 de noviembre, al abandonar Aranas, la patrulla, su cobertura en una cresta y Combat Outpost Bella fueron atacados desde varias direcciones." },
      { year: 2007, event: "Tras más de cuatro horas de combate, el apoyo de fuego y la evacuación aérea permitieron retirar a los heridos y a los caídos." }
    ]
  })
};
