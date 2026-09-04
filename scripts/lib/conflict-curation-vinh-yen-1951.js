function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de V\u0129nh Y\u00ean (13-17 de enero de 1951)";
const PARENT = "Primera Guerra de Indochina (1946-1954)";
const CAMPAIGN = "Ofensiva del Viet Minh en el delta del R\u00edo Rojo (enero de 1951)";

const SOURCES = {
  frenchDefenseArchives: source(
    "Servicio Hist\u00f3rico de la Defensa de Francia: expediente operativo de Vinh-Yen, 14-17 de enero de 1951",
    "https://www.servicehistorique.sga.defense.gouv.fr/ark/489688"
  ),
  frenchMemoryMinistry: source(
    "Chemins de m\u00e9moire del Ministerio de las Fuerzas Armadas de Francia: cronolog\u00eda de la victoria francesa de Vinh Yen, 13-17 de enero de 1951",
    "https://www.cheminsdememoire.gouv.fr/sites/default/files/editeur/de%20Lattre%20Indochine.pdf"
  ),
  libraryOfCongressHistory: source(
    "Alec Holcombe, Mass Mobilization in the Democratic Republic of Vietnam, 1945-1960 (University of Hawai'i Press, 2020), p. 97; ejemplar alojado en la Biblioteca del Congreso",
    "https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/20/71/97/49/2020719749/2020719749.pdf"
  )
};

function vinhYen1951Fix() {
  const hierarchySources = [
    SOURCES.frenchDefenseArchives,
    SOURCES.frenchMemoryMinistry,
    SOURCES.libraryOfCongressHistory
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla campal",
    conflictType: "colonial",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1951,
    endYear: 1951,
    region: "V\u0129nh Y\u00ean, delta del R\u00edo Rojo, Tonkin, Indochina francesa de la \u00e9poca; norte del actual Vietnam",
    normalizedRegion: "Asia",
    cause: "Tras la Campa\u00f1a de la Frontera de 1950, las fuerzas del Viet Minh vinculadas a la Rep\u00fablica Democr\u00e1tica de Vietnam presionaron el delta del R\u00edo Rojo. Las divisiones 308 y 312 avanzaron desde Tam Dao hacia V\u0129nh Y\u00ean y los accesos a Hanoi, por lo que Jean de Lattre de Tassigny concentr\u00f3 refuerzos para sostener la posici\u00f3n.",
    outcome: "Las fuerzas de la Uni\u00f3n Francesa sostuvieron V\u0129nh Y\u00ean tras cuatro d\u00edas de combate y repelieron el avance del Viet Minh. La ficha lo clasifica como victoria defensiva francesa en una batalla, no como desenlace de la guerra colonial.",
    consequences: "La defensa contuvo la amenaza inmediata sobre los accesos a Hanoi y ayud\u00f3 a restablecer la posici\u00f3n francesa en Tonkin. El conflicto continu\u00f3 hasta los Acuerdos de Ginebra de 1954.",
    chronology: [
      {
        year: 1950,
        event: "Tras la Campa\u00f1a de la Frontera, el Viet Minh increment\u00f3 la presi\u00f3n sobre el delta del R\u00edo Rojo."
      },
      {
        year: 1951,
        event: "Del 13 al 17 de enero, las divisiones 308 y 312 atacaron hacia V\u0129nh Y\u00ean; Jean de Lattre concentr\u00f3 fuerzas para defender la ciudad."
      },
      {
        year: 1951,
        event: "La Uni\u00f3n Francesa sostuvo la posici\u00f3n y el avance del Viet Minh no abri\u00f3 el camino inmediato hacia Hanoi."
      }
    ],
    treaties: ["Acuerdos de Ginebra (1954)"],
    related: [
      PARENT,
      CAMPAIGN,
      "Jean de Lattre de Tassigny",
      "V\u00f5 Nguy\u00ean Gi\u00e1p",
      "Rep\u00fablica Democr\u00e1tica de Vietnam",
      "Estado de Vietnam",
      "Viet Minh",
      "Delta del R\u00edo Rojo",
      "Hanoi",
      "Campa\u00f1a de la Frontera (1950)"
    ],
    participants: [
      {
        side: "Fuerzas de la Uni\u00f3n Francesa",
        members: ["Uni\u00f3n Francesa", "Ej\u00e9rcito franc\u00e9s", "Jean de Lattre de Tassigny"],
        casualties: "No consolidadas: las fuentes institucionales consultadas permiten establecer la operaci\u00f3n, su cronolog\u00eda y resultado, pero no un parte bilateral homog\u00e9neo de efectivos, muertos, heridos y prisioneros."
      },
      {
        side: "Fuerzas de la Rep\u00fablica Democr\u00e1tica de Vietnam y del Viet Minh",
        members: ["Rep\u00fablica Democr\u00e1tica de Vietnam", "Viet Minh", "Divisi\u00f3n 308", "Divisi\u00f3n 312", "V\u00f5 Nguy\u00ean Gi\u00e1p"],
        casualties: "No consolidadas: las fuentes revisadas identifican la ofensiva de las divisiones 308 y 312, pero no aportan una cifra bilateral verificable de bajas para esta ficha."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "La cronolog\u00eda francesa y la s\u00edntesis de la Biblioteca del Congreso sit\u00faan la batalla del 13 al 17 de enero de 1951; el expediente operativo franc\u00e9s conservado para Vinh-Yen cubre el 14-17 de enero.",
    sourceDispute: "El expediente operativo del Servicio Hist\u00f3rico de la Defensa de Francia cubre Vinh-Yen del 14 al 17 de enero de 1951, mientras la cronolog\u00eda institucional francesa y la s\u00edntesis de la Biblioteca del Congreso encuadran la batalla del 13 al 17. GeoRisk conserva el intervalo m\u00e1s amplio, no divide esas referencias en dos combates y no consolida bajas que las fuentes consultadas no detallan de manera bilateral.",
    curationPriority: "alta",
    curationBatch: "source-backed-vinh-yen-1951-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "V\u0129nh Y\u00ean se incorpora como evento documentado. La etiqueta incompleta Batalla de Vinh permanece pendiente de identificaci\u00f3n: las fuentes consultadas no acreditan su equivalencia con esta batalla y no se utiliza como alias. Francia y Vietnam se enlazan para navegaci\u00f3n hist\u00f3rica por las fuerzas beligerantes y el territorio actual, no Estados contempor\u00e1neos literalmente proyectados sobre 1951."
  };
}

export const VINH_YEN_1951_CONFLICT_RENAMES = {
  "Batalla de Vinh Yen": CANONICAL,
  "Batalla de Vinh-Yen": CANONICAL,
  "Batalla de V\u0129nh Y\u00ean": CANONICAL,
  "Battle of Vinh Yen": CANONICAL,
  "Battle of V\u0129nh Y\u00ean": CANONICAL,
  "Bataille de Vinh Yen": CANONICAL,
  "Bataille de Vinh-Yen": CANONICAL,
  "Bataille de V\u0129nh Y\u00ean": CANONICAL
};

export const VINH_YEN_1951_COUNTRY_CONFLICT_ADDITIONS = {
  Francia: [CANONICAL, "Batalla de Vinh"],
  Vietnam: [CANONICAL]
};

export const VINH_YEN_1951_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: vinhYen1951Fix()
};
