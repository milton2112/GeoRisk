function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Segunda batalla de Springfield (Misuri, 8 de enero de 1863)";
const PARENT = "Guerra Civil estadounidense";
const CAMPAIGN = "Incursi\u00f3n de Marmaduke en Misuri (1862-1863)";

const SOURCES = {
  officialRecords: source(
    "War of the Rebellion, registros oficiales de los Ej\u00e9rcitos de la Uni\u00f3n y la Confederaci\u00f3n, vol. XXII: informes y partes del enfrentamiento de Springfield del 8 de enero de 1863",
    "https://texashistory.unt.edu/ark:/67531/metapth154600/m1/181/"
  ),
  missouriDnrMarker: source(
    "Missouri Department of Natural Resources, marcador historico Battle of Springfield: la incursi\u00f3n de Marmaduke, el combate del 8 de enero, la defensa de Egbert B. Brown y la retirada hacia Hartville",
    "https://suvcw.org/sites/default/files/2024-03/MO_Greene_County_Springfield_battle_of_springfield_marmadukes_1st_raid_redacted.pdf",
    "media"
  ),
  missouriStateUniversity: source(
    "Missouri State University Digital Collections: sintesis de la incursi\u00f3n de Marmaduke y de la defensa federal de Springfield el 8 de enero de 1863",
    "https://cdm17307.contentdm.oclc.org/digital/collection/p17307coll1/id/563/",
    "media"
  ),
  springfieldHistory: source(
    "Ciudad de Springfield, Misuri: historia municipal que sit\u00faa la batalla en enero de 1863 tras dos a\u00f1os de control disputado de la ciudad",
    "https://www.springfieldmo.org/about-springfield/history/",
    "media"
  ),
  civilWarVirtualMuseum: source(
    "Civil War Virtual Museum y Wilson's Creek National Battlefield: memoria de un oficial del estado mayor de Marmaduke sobre la retirada posterior al asalto fallido",
    "https://www.civilwarvirtualmuseum.org/1863-1865/marmadukes-raid-shelbys-raid/alonzo-slayback-memoir.php",
    "media"
  )
};

function springfield1863Fix() {
  const hierarchySources = [
    SOURCES.officialRecords,
    SOURCES.missouriDnrMarker,
    SOURCES.missouriStateUniversity,
    SOURCES.springfieldHistory
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla urbana",
    conflictType: "civil",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1863,
    endYear: 1863,
    region: "Springfield, condado de Greene, Misuri, Estados Unidos",
    normalizedRegion: "Springfield, condado de Greene, Misuri, Estados Unidos",
    cause: "La incursi\u00f3n confederada de John S. Marmaduke buscaba amenazar el principal dep\u00f3sito federal de suministros de Springfield, interrumpir las l\u00edneas de comunicaci\u00f3n con Rolla y San Luis, y presionar a las fuerzas de la Uni\u00f3n desplegadas en el norte de Arkansas.",
    outcome: "Victoria defensiva de la Uni\u00f3n. Las fuerzas de Marmaduke atacaron Springfield durante el 8 de enero, pero no consiguieron tomar las fortificaciones ni el dep\u00f3sito. Tras finalizar el combate al anochecer, se retiraron hacia Hartville.",
    consequences: "La defensa preserv\u00f3 el centro log\u00edstico federal de Springfield y la incursi\u00f3n continu\u00f3 hacia Hartville, donde hubo otro combate el 11 de enero. La ficha no atribuye la evoluci\u00f3n posterior de la guerra a esta acci\u00f3n local aislada.",
    chronology: [
      {
        year: 1862,
        event: "El 31 de diciembre, la fuerza de John S. Marmaduke inicio una incursi\u00f3n desde Arkansas hacia Misuri."
      },
      {
        year: 1863,
        event: "El 7 de enero, la guarnici\u00f3n federal de Springfield recibi\u00f3 aviso de la aproximaci\u00f3n de las columnas confederadas."
      },
      {
        year: 1863,
        event: "El 8 de enero, el ataque comenz\u00f3 por la ma\u00f1ana y se prolong\u00f3 hasta el anochecer; las defensas de Springfield resistieron y Egbert B. Brown result\u00f3 herido."
      },
      {
        year: 1863,
        event: "El 9 de enero, Marmaduke abandono el asalto y sus fuerzas marcharon hacia Hartville."
      },
      {
        year: 1863,
        event: "El 11 de enero, la incursi\u00f3n produjo la batalla distinta de Hartville antes de regresar hacia Arkansas."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Batalla de Hartville",
      "Batalla de Wilson's Creek",
      "Primera batalla de Springfield (Misuri, 1861)",
      "Egbert B. Brown",
      "John S. Marmaduke",
      "Joseph O. Shelby",
      "Springfield, Misuri"
    ],
    participants: [
      {
        side: "Uni\u00f3n",
        members: [
          "Estados Unidos",
          "Ej\u00e9rcito de la Uni\u00f3n",
          "Guarnicion federal de Springfield",
          "Egbert B. Brown",
          "Milicia Inscrita de Misuri"
        ],
        casualties: "Los partes oficiales y los estudios locales no proporcionan una serie \u00fanica que use el mismo criterio para regulares, milicia, civiles armados, heridos y desaparecidos. GeoRisk no publica un total cerrado."
      },
      {
        side: "Confederaci\u00f3n",
        members: [
          "Estados Confederados de America",
          "Fuerzas de la incursi\u00f3n de Marmaduke",
          "John S. Marmaduke",
          "Joseph O. Shelby",
          "Joseph C. Porter"
        ],
        casualties: "Los documentos contempor\u00e1neos incluyen partes de unidades y una relaci\u00f3n de bajas de Marmaduke, pero los recuentos secundarios no siempre emplean el mismo alcance. GeoRisk conserva la ausencia de una cifra homologada en lugar de mezclar estimaciones."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "8 de enero de 1863, desde aproximadamente las 10 de la ma\u00f1ana hasta el anochecer.",
    sourceDispute: "El nombre Battle of Springfield es ambiguo: puede referirse a la primera batalla de Springfield en Misuri de octubre de 1861, a esta segunda batalla de enero de 1863 o a la batalla de Springfield de Nueva Jersey de 1780. La entrada importada solo dec\u00eda Batalla de Springfield y estaba bajo un padre gen\u00e9rico; se identifica como la segunda batalla de Springfield de Misuri porque las fuentes de la incursi\u00f3n de Marmaduke usan precisamente Battle of Springfield para el 8 de enero de 1863. Las fuentes coinciden en la defensa federal y el repliegue confederado, pero las cifras de bajas y efectivos dependen de si incluyen milicia, convalecientes y civiles armados.",
    curationPriority: "alta",
    curationBatch: "source-backed-springfield-missouri-1863-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa no ten\u00eda fecha, lugar, guerra, participantes ni desambiguaci\u00f3n. Se normaliza como Segunda batalla de Springfield (Misuri, 8 de enero de 1863), dentro de la Guerra Civil estadounidense y de la incursi\u00f3n de Marmaduke. La ficha mantiene separados Wilson's Creek, la acci\u00f3n de Springfield de 1861 y el episodio de Nueva Jersey, por lo que una consulta gen\u00e9rica no fusiona conflictos hom\u00f3nimos."
  };
}

export const SPRINGFIELD_1863_CONFLICT_RENAMES = {
  "Batalla de Springfield": CANONICAL,
  "Battle of Springfield": CANONICAL,
  "Second Battle of Springfield": CANONICAL,
  "Second Battle of Springfield (1863)": CANONICAL,
  "Battle of Springfield, Missouri": CANONICAL,
  "Battle of Springfield (Missouri, 1863)": CANONICAL
};

export const SPRINGFIELD_1863_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [CANONICAL]
};

export const SPRINGFIELD_1863_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: springfield1863Fix()
};
