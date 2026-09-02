function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Sideling Hill (abril de 1756)";
const PARENT = "Guerra franco-india (1754-1763)";
const CAMPAIGN = "Guerra de frontera de Pensilvania de 1756";

const SOURCES = {
  libraryOfCongress: source(
    "Library of Congress Subject Headings: autoridad que identifica Sideling Hill, Battle of, Pa., 1756 y la clasifica dentro de la Guerra franco-india",
    "https://www.loc.gov/aba/publications/FreeLCSH/S.pdf"
  ),
  oxfordTextArchive: source(
    "Oxford Text Archive, University of Oxford: edici\u00f3n digital del relato de cautiverio de Jean Lowry de 1760, fuente primaria sobre el ataque a Fort McCord del 1 de abril y la captura posterior; su perspectiva no sustituye un parte completo de la batalla",
    "https://ota.bodleian.ox.ac.uk/repository/xmlui/bitstream/handle/20.500.12024/N06816/N06816.html?sequence=5&isAllowed=y"
  ),
  susquehannaRiverBasinCommission: source(
    "Susquehanna River Basin Commission, Native American Waterbody and Place Names: registro institucional de Sidling Hill Battlefield, con el contexto de Fort McCord, los bandos descritos y una localizaci\u00f3n propuesta cerca de Maddensville",
    "https://www.srbc.gov/our-work/reports-library/technical-reports/229-native-american-names/docs/native-american-names.pdf"
  ),
  pennsylvaniaArchives: source(
    "Pennsylvania Archives, volumen II: correspondencia colonial de 1756 utilizada para reconstruir informes contempor\u00e1neos de la persecuci\u00f3n, el combate y las bajas parciales",
    "https://archive.org/details/pennsylvaniaarch02penn"
  )
};

function sidelingHill1756Fix() {
  const hierarchySources = [
    SOURCES.libraryOfCongress,
    SOURCES.oxfordTextArchive,
    SOURCES.susquehannaRiverBasinCommission,
    SOURCES.pennsylvaniaArchives
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate terrestre",
    conflictType: "colonial",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1756,
    endYear: 1756,
    region: "Cercan\u00edas propuestas de Sideling Hill y Little Aughwick Creek, cerca de Maddensville, Pensilvania, Estados Unidos; la ubicaci\u00f3n hist\u00f3rica exacta no est\u00e1 resuelta",
    normalizedRegion: "Cercan\u00edas propuestas de Sideling Hill y Little Aughwick Creek, cerca de Maddensville, Pensilvania, Estados Unidos; la ubicaci\u00f3n hist\u00f3rica exacta no est\u00e1 resuelta",
    cause: "Durante la guerra de frontera de Pensilvania en la Guerra franco-india, una partida lenape y shawan\u00ed atac\u00f3 el fuerte McCord y tom\u00f3 cautivos. Fuerzas de la milicia provincial salieron en persecuci\u00f3n para intentar recuperar a las personas capturadas, y el encuentro posterior se conoce como batalla de Sideling Hill.",
    outcome: "La fuerza colonial de persecuci\u00f3n se retir\u00f3 tras un combate prolongado; algunos cautivos lograron escapar, pero otros fueron recapturados o continuaron en cautiverio. Las fuentes no concilian una lista total de combatientes, bajas o participantes; GeoRisk no presenta un balance cerrado.",
    consequences: "El episodio intensific\u00f3 la inseguridad y la movilizaci\u00f3n militar en la frontera de Pensilvania durante 1756. No decidi\u00f3 por s\u00ed solo la Guerra franco-india: se mantiene como combate local dentro de una guerra colonial m\u00e1s amplia, cuyo cierre general posterior fue el Tratado de Par\u00eds de 1763.",
    chronology: [
      {
        year: 1756,
        event: "El 1 de abril, una partida lenape y shawan\u00ed atac\u00f3 y quem\u00f3 el fuerte McCord; el relato de Jean Lowry documenta la toma de cautivos desde la perspectiva de una sobreviviente."
      },
      {
        year: 1756,
        event: "Milicias y soldados coloniales emprendieron una persecuci\u00f3n para recuperar a las personas capturadas y alcanzaron a la partida en una zona atribuida de forma diversa a Sideling Hill."
      },
      {
        year: 1756,
        event: "En abril se produjo el combate de Sideling Hill. La fecha diaria no se cierra: las reconstrucciones usan cronolog\u00edas distintas a partir del ataque inicial y de correspondencia colonial."
      },
      {
        year: 1763,
        event: "El Tratado de Par\u00eds cerr\u00f3 la guerra imperial m\u00e1s amplia; no constituye un acuerdo propio de esta batalla local."
      }
    ],
    treaties: [
      "Tratado de Par\u00eds (1763), cierre general posterior de la Guerra franco-india"
    ],
    related: [
      PARENT,
      CAMPAIGN,
      "Fuerte McCord",
      "Fort Lyttleton",
      "Alexander Culbertson",
      "Shingas",
      "Lenape",
      "Shawnee"
    ],
    participants: [
      {
        side: "Milicia colonial de Pensilvania",
        members: [
          "Reino Unido",
          "Provincia de Pensilvania",
          "Milicia provincial de Pensilvania",
          "Alexander Culbertson",
          "Hance Hamilton"
        ],
        casualties: "La correspondencia colonial y los relatos posteriores registran bajas graves y listas parciales, pero no coinciden en muertos, heridos ni fuerza inicial. GeoRisk no consolida esas cifras."
      },
      {
        side: "Partida lenape y shawan\u00ed",
        members: [
          "Lenape (Delaware)",
          "Shawnee",
          "Shingas"
        ],
        casualties: "No existe un parte contempor\u00e1neo equivalente que permita identificar y reconciliar todas las bajas lenape y shawan\u00edes. GeoRisk no transforma recuentos posteriores divergentes en un total definitivo."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "Abril de 1756. El 1 de abril corresponde al ataque a Fort McCord; las fuentes difieren sobre la jornada exacta del combate posterior de Sideling Hill, por lo que GeoRisk no fija un d\u00eda definitivo.",
    sourceDispute: "La entrada importada solo dec\u00eda Batalla de Sideling Hill, sin fecha ni guerra padre. La Library of Congress la identifica como Sideling Hill, Battle of, Pa., 1756 y la vincula con la Guerra franco-india. La fecha y el lugar fino, sin embargo, siguen discutidos: el relato de Jean Lowry comienza con el ataque a Fort McCord del 1 de abril, el registro de la Susquehanna River Basin Commission sit\u00faa una persecuci\u00f3n al d\u00eda siguiente en una ubicaci\u00f3n propuesta cerca de Maddensville, y la correspondencia colonial se ha usado para reconstrucciones que proponen jornadas posteriores. Tambi\u00e9n var\u00edan los recuentos de bajas y los mandos atribuidos. La ficha fija abril de 1756, conserva la ubicaci\u00f3n como propuesta y no convierte esas versiones en un total ni fecha cerrados.",
    curationPriority: "alta",
    curationBatch: "source-backed-sideling-hill-1756-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Batalla de Sideling Hill se normaliza como Batalla de Sideling Hill (abril de 1756), dentro de la Guerra franco-india. Guerra de frontera de Pensilvania de 1756 es una categor\u00eda organizativa de GeoRisk, no una denominaci\u00f3n oficial de campa\u00f1a. La ficha no confunde este combate con el ataque al fuerte McCord, con las acciones de Kittanning ni con el incidente distinto de Sideling Hill de 1765."
  };
}

export const SIDELING_HILL_1756_CONFLICT_RENAMES = {
  "Batalla de Sideling Hill": CANONICAL,
  "Batalla de Sidling Hill": CANONICAL,
  "Battle of Sideling Hill": CANONICAL,
  "Battle of Sidling Hill": CANONICAL,
  "Sideling Hill, Battle of, Pa., 1756": CANONICAL,
  "Sideling Hill (Md. and Pa.), Battle of, 1756": CANONICAL
};

export const SIDELING_HILL_1756_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: sidelingHill1756Fix()
};
