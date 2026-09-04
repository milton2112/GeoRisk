function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate de Wet Glaze (Monday's Hollow, 13 de octubre de 1861)";
const PARENT = "Guerra Civil estadounidense";
const CAMPAIGN = "Operaciones federales entre Rolla, Linn Creek y Lebanon (octubre de 1861)";

const SOURCES = {
  ozarksCivilWar: source(
    "Ozarks Civil War: identifica la acci\u00f3n del 13 de octubre de 1861 en Wet Glaze, cerca de Henrytown, entre el Batall\u00f3n de Caballer\u00eda de Fr\u00e9mont y la Guardia Estatal de Misuri; remite a los registros oficiales de guerra de Estados Unidos",
    "https://ozarkscivilwar.org/regions/camden-county-missouri"
  ),
  officialRecords: source(
    "Ohio State University eHistory: transcripci\u00f3n de los registros oficiales de guerra de Estados Unidos, incluido el informe del mayor Clark Wright sobre la operaci\u00f3n federal inmediatamente posterior en Linn Creek",
    "https://ehistory.osu.edu/books/official-records/003/0242"
  ),
  historicalIndex: source(
    "Statistical Record of the Armies of the United States: \u00edndice hist\u00f3rico que registra West Glaze y las variantes Shanghai, Henrytown y Monday's Hollow para Misuri el 13 de octubre de 1861",
    "https://upload.wikimedia.org/wikipedia/commons/7/78/Statistical_record_of_the_armies_of_the_United_States_%28IA_statisticalrecor00inphis%29.pdf",
    "media"
  ),
  millerCountyMuseum: source(
    "Miller County Museum: historia local que preserva Wet Auglaize y Monday's Hollow como denominaciones relacionadas y cita el parte de la fuerza federal",
    "https://www.millercountymuseum.org/archives/100201.html",
    "media"
  )
};

function mondaysHollow1861Fix() {
  const hierarchySources = [
    SOURCES.ozarksCivilWar,
    SOURCES.officialRecords,
    SOURCES.historicalIndex,
    SOURCES.millerCountyMuseum
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "escaramuza de caballer\u00eda",
    conflictType: "civil",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1861,
    endYear: 1861,
    region: "Wet Glaze o Wet Auglaize, cerca de Henrytown, condado de Camden, Misuri, Estados Unidos",
    normalizedRegion: "Wet Glaze o Wet Auglaize, cerca de Henrytown, condado de Camden, Misuri, Estados Unidos",
    cause: "En octubre de 1861, fuerzas federales que operaban desde Rolla hacia Linn Creek y Lebanon encontraron una concentraci\u00f3n local vinculada a la Guardia Estatal de Misuri. El choque se insert\u00f3 en la disputa por rutas, control local y lealtades de Misuri durante la etapa inicial de la Guerra Civil estadounidense.",
    outcome: "Las s\u00edntesis hist\u00f3ricas locales describen que la fuerza federal dispers\u00f3 a los elementos de la Guardia Estatal de Misuri en Wet Glaze. La ficha registra una victoria t\u00e1ctica federal limitada: no convierte el combate en una batalla decisiva ni fija un balance total de bajas, porque las fuentes no concilian de forma uniforme la fuerza, el lugar fino y las p\u00e9rdidas.",
    consequences: "La acci\u00f3n precedi\u00f3 al avance federal sobre Linn Creek del 14 de octubre. Forma parte de los peque\u00f1os enfrentamientos de Misuri central de 1861 y no debe confundirse con una campa\u00f1a independiente ni con una gran batalla convencional.",
    chronology: [
      {
        year: 1861,
        event: "En la primera quincena de octubre, fuerzas federales y grupos vinculados a la Guardia Estatal de Misuri se movian por el corredor entre Rolla, Henrytown, Linn Creek y Lebanon."
      },
      {
        year: 1861,
        event: "El 13 de octubre, el Batall\u00f3n de Caballer\u00eda de Fr\u00e9mont y otras fuerzas federales se enfrentaron con una concentraci\u00f3n de la Guardia Estatal de Misuri cerca de Wet Glaze o Wet Auglaize."
      },
      {
        year: 1861,
        event: "El 14 de octubre, el mayor Clark Wright avanz\u00f3 sobre Linn Creek; el informe oficial fechado el 15 de octubre documenta esa operaci\u00f3n posterior y la captura de prisioneros."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Batall\u00f3n de Caballer\u00eda de Fr\u00e9mont",
      "Guardia Estatal de Misuri",
      "Linn Creek",
      "Henrytown"
    ],
    participants: [
      {
        side: "Fuerzas federales de Estados Unidos",
        members: [
          "Estados Unidos",
          "Batall\u00f3n de Caballer\u00eda de Fr\u00e9mont",
          "Elementos de caballer\u00eda de Misuri vinculados a la columna federal",
          "Elementos del 13.\u00ba Regimiento de Infanter\u00eda de Illinois citados para la columna"
        ],
        casualties: "Las fuentes consultadas registran una baja federal, pero no ofrecen una tabla uniforme de todas las unidades ni de toda la columna. La ficha no transforma ese dato en un balance total cerrado."
      },
      {
        side: "Guardia Estatal de Misuri y fuerzas secesionistas locales",
        members: [
          "Guardia Estatal de Misuri",
          "Fuerzas locales pro-secesi\u00f3n de los condados de Camden y aleda\u00f1os"
        ],
        casualties: "Los relatos posteriores presentan cifras distintas de muertos, heridos y prisioneros. La fuente local conserva el parte federal, pero no se publica una cifra final porque no se dispone de una conciliacion independiente de bajas ni de efectivos."
      }
    ],
    hierarchyConfidence: "media",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "13 de octubre de 1861; el \u00edndice hist\u00f3rico registra West Glaze con las variantes Shanghai, Henrytown y Monday's Hollow en Misuri para esa fecha, y la s\u00edntesis regional sit\u00faa el choque en Wet Glaze.",
    sourceDispute: "La acci\u00f3n aparece como Wet Glaze, Wet Auglaize, West Glaze, Monday's Hollow, Henrytown o Shanghai seg\u00fan la fuente. GeoRisk conserva esos aliases bajo una sola ficha, pero no fija coordenadas exactas ni suma cifras de bajas de relatos locales y partes federales que no usan la misma delimitaci\u00f3n de fuerza, lugar o resultado.",
    curationPriority: "alta",
    curationBatch: "source-backed-mondays-hollow-1861-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa era una batalla interestatal sin fecha ni guerra padre. Se normaliza como un combate local de caballer\u00eda de la Guerra Civil estadounidense cerca de Henrytown, Misuri. Monday's Hollow queda visible como alias y no como una guerra aparte. La Guardia Estatal de Misuri se conserva como formaci\u00f3n hist\u00f3rica: no se equipara autom\u00e1ticamente a todo el Estado Confederado ni se proyecta la pol\u00edtica contempor\u00e1nea de Misuri sobre los bandos de 1861."
  };
}

export const MONDAYS_HOLLOW_1861_CONFLICT_RENAMES = {
  "Batalla de Monday's Hollow": CANONICAL,
  "Battle of Monday's Hollow": CANONICAL,
  "Monday's Hollow": CANONICAL,
  "Batalla de Wet Glaze": CANONICAL,
  "Battle of Wet Glaze": CANONICAL,
  "Combate de Wet Glaze": CANONICAL,
  "Wet Glaze": CANONICAL,
  "Batalla de Wet Auglaize": CANONICAL,
  "Battle of Wet Auglaize": CANONICAL,
  "Wet Auglaize": CANONICAL,
  "Batalla de West Glaze": CANONICAL,
  "Battle of West Glaze": CANONICAL,
  "West Glaze": CANONICAL,
  "Batalla de Henrytown": CANONICAL,
  "Battle of Henrytown": CANONICAL,
  "Henrytown": CANONICAL,
  "Batalla de Shanghai": CANONICAL,
  "Battle of Shanghai": CANONICAL
};

export const MONDAYS_HOLLOW_1861_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: mondaysHollow1861Fix()
};
