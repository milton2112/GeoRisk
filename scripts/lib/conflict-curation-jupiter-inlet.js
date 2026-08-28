function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  palmBeachNhrp: source(
    "Condado de Palm Beach: informe de inscripci\u00f3n del campo de batalla de Loxahatchee en el Registro Nacional de Lugares Hist\u00f3ricos",
    "https://discover.pbcgov.org/pzb/planning/PDF/Loxahatchee%20Battlefield%20NRHP%20report%2010-8-2021.pdf"
  ),
  palmBeachBattlefield: source(
    "Condado de Palm Beach: identificaci\u00f3n actual de las batallas de Powell y Jesup en el campo de batalla de Loxahatchee",
    "https://discover.pbc.gov/parks/Locations/Loxahatchee-River-Battlefield.aspx"
  ),
  libraryOfCongress: source(
    "Biblioteca del Congreso de EE. UU.: inventario de los papeles de Thomas Sidney Jesup, herido en la Battle of Jupiter Inlet de 1838",
    "https://tile.loc.gov/storage-services/service/gdc/gdcfindingaidpdfs/ms010198/ms010198.pdf"
  ),
  nationalParkService: source(
    "Servicio de Parques Nacionales de EE. UU.: referencia a la escaramuza cerca de Jupiter Inlet durante la Segunda Guerra Seminola",
    "https://www.nps.gov/mono/learn/historyculture/jubalearly.htm",
    "media"
  )
};

const PARENT = "Segunda Guerra Seminola (1835-1842)";
const CAMPAIGN = "Operaciones de Loxahatchee de enero de 1838";

function jupiterInletFix() {
  const hierarchySources = [
    SOURCES.palmBeachNhrp,
    SOURCES.palmBeachBattlefield,
    SOURCES.libraryOfCongress,
    SOURCES.nationalParkService
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "emboscada y combate en humedal",
    conflictType: "colonial",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1838,
    endYear: 1838,
    region: "R\u00edo Loxahatchee, al oeste de Jupiter Inlet, Florida, Estados Unidos",
    normalizedRegion: "R\u00edo Loxahatchee, al oeste de Jupiter Inlet, Florida, Estados Unidos",
    cause: "Dentro de la campa\u00f1a estadounidense de expulsi\u00f3n forzada de pueblos ind\u00edgenas de Florida, una expedici\u00f3n conjunta de la Armada, el Ej\u00e9rcito y milicias parti\u00f3 de Jupiter Inlet para localizar poblados y rutas seminolas y miccosukee en la cuenca del Loxahatchee.",
    outcome: "Ventaja t\u00e1ctica de las fuerzas seminolas y miccosukee. La columna dirigida por Levin M. Powell entr\u00f3 en una emboscada en el interior de los humedales y se repleg\u00f3 hacia sus embarcaciones; la ficha no fija una relaci\u00f3n definitiva de efectivos ni de bajas porque las fuentes distinguen entre el destacamento inicial, la partida que avanz\u00f3 tierra adentro y estimaciones posteriores.",
    consequences: "La acci\u00f3n no cerr\u00f3 las operaciones estadounidenses en el Loxahatchee. El 24 de enero se libr\u00f3 en la misma zona la segunda batalla de Loxahatchee, asociada a Thomas Sidney Jesup; ambas acciones se conservan como episodios distintos de la Segunda Guerra Seminola.",
    chronology: [
      {
        year: 1835,
        event: "Comenz\u00f3 la Segunda Guerra Seminola en el contexto de las pol\u00edticas estadounidenses de remoci\u00f3n forzada en Florida."
      },
      {
        year: 1838,
        event: "El 15 de enero, la expedici\u00f3n de Levin M. Powell se intern\u00f3 desde Jupiter Inlet y combati\u00f3 a fuerzas seminolas y miccosukee en la zona del Loxahatchee."
      },
      {
        year: 1838,
        event: "El 24 de enero, una fuerza mayor bajo Thomas Sidney Jesup libr\u00f3 una segunda batalla de Loxahatchee en el mismo teatro local."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Jupiter Inlet", "r\u00edo Loxahatchee", "Levin M. Powell", "Thomas Sidney Jesup", "Segunda batalla de Loxahatchee (1838)"],
    participants: [
      {
        side: "Fuerza expedicionaria estadounidense",
        members: ["Estados Unidos", "Armada de Estados Unidos", "Ej\u00e9rcito de Estados Unidos", "Milicias territoriales", "Levin M. Powell"],
        casualties: "No consolidado: las fuentes distinguen composici\u00f3n, tama\u00f1o inicial y grupo que avanz\u00f3 al interior; no se publica una cifra \u00fanica como definitiva."
      },
      {
        side: "Fuerzas seminolas y miccosukee",
        members: ["Seminola", "Miccosukee"],
        casualties: "No consolidado: las estimaciones de combatientes y bajas ind\u00edgenas no son uniformes en la documentaci\u00f3n disponible."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "15 de enero de 1838",
    sourceDispute: "La denominaci\u00f3n heredada no es uniforme. La Biblioteca del Congreso conserva la etiqueta hist\u00f3rica Battle of Jupiter Inlet, mientras la preservaci\u00f3n local y el informe del Registro Nacional distinguen la acci\u00f3n como Powell's Battle o primera batalla de Loxahatchee, separada de la batalla de Jesup del 24 de enero. Tambi\u00e9n var\u00edan las cifras seg\u00fan se cuente la fuerza expedicionaria inicial o la partida que avanz\u00f3 al interior. Por ello se preserva Jupiter Inlet como alias, se usa el nombre actual de Loxahatchee y no se inventan una fuerza enemiga ni bajas definitivas.",
    curationPriority: "alta",
    curationBatch: "source-backed-jupiter-inlet-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa solo conten\u00eda el r\u00f3tulo ingl\u00e9s y una jerarqu\u00eda regional gen\u00e9rica. Se normaliza como Primera batalla de Loxahatchee (1838), dentro de la Segunda Guerra Seminola, con el nombre Jupiter Inlet conservado para b\u00fasqueda y trazabilidad. Estados Unidos se mantiene como v\u00ednculo nacional contempor\u00e1neo; Seminola y Miccosukee se muestran como pueblos y actores hist\u00f3ricos, sin convertirlos artificialmente en pa\u00edses actuales."
  };
}

export const JUPITER_INLET_CONFLICT_RENAMES = {
  "Batalla de Jupiter Inlet": "Primera batalla de Loxahatchee (1838)",
  "Batalla de Jupiter Inlet (1838)": "Primera batalla de Loxahatchee (1838)",
  "Battle of Jupiter Inlet": "Primera batalla de Loxahatchee (1838)",
  "Battle at Jupiter Inlet": "Primera batalla de Loxahatchee (1838)",
  "Battle near Jupiter Inlet": "Primera batalla de Loxahatchee (1838)",
  "Powell's Battle": "Primera batalla de Loxahatchee (1838)",
  "Batalla de Powell": "Primera batalla de Loxahatchee (1838)",
  "Primera batalla del Loxahatchee": "Primera batalla de Loxahatchee (1838)",
  "First Battle of the Loxahatchee": "Primera batalla de Loxahatchee (1838)",
  "First Battle of Loxahatchee": "Primera batalla de Loxahatchee (1838)"
};

export const JUPITER_INLET_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": ["Primera batalla de Loxahatchee (1838)"]
};

export const JUPITER_INLET_CONFLICT_DETAIL_FIXES = {
  "Primera batalla de Loxahatchee (1838)": jupiterInletFix()
};
