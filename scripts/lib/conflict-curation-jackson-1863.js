function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Jackson (Misisipi, 14 de mayo de 1863)";
const PARENT = "Guerra Civil estadounidense";
const CAMPAIGN = "Campa\u00f1a de Vicksburg de 1863";

const SOURCES = {
  nationalParkServiceBattle: source(
    "Servicio de Parques Nacionales de EE. UU., Vicksburg National Military Park: relato de la batalla de Jackson del 14 de mayo de 1863, la evacuacion confederada y la entrada de las fuerzas de la Union",
    "https://home.nps.gov/vick/learn/historyculture/jackson.htm"
  ),
  nationalParkServiceCampaign: source(
    "Servicio de Parques Nacionales de EE. UU.: la campa\u00f1a de Vicksburg enumera Jackson el 14 de mayo de 1863 entre Raymond y Champion Hill",
    "https://www.nps.gov/vick/learn/historyculture/campaign-for-vicksburg.htm"
  ),
  nationalParkServiceBattleDetail: source(
    "Servicio de Parques Nacionales de EE. UU., ficha CWSAC MS008: Jackson dentro de las operaciones de Grant contra Vicksburg, con victoria de la Uni\u00f3n y evacuaci\u00f3n de Joseph E. Johnston",
    "https://www.nps.gov/civilwar/search-battles-detail.htm?battleCode=MS008"
  ),
  armyCampaignHistory: source(
    "Centro de Historia Militar del Ej\u00e9rcito de EE. UU.: s\u00edntesis de la campa\u00f1a de Vicksburg, incluida la toma de Jackson el 14 de mayo y el giro posterior de Grant hacia Vicksburg",
    "https://history.army.mil/Research/Reference-Topics/Army-Campaigns/Brief-Summaries/Civil-War/"
  ),
  libraryOfCongressPrint: source(
    "Biblioteca del Congreso de EE. UU.: estampa contemporanea de la carga de los regimientos 17th Iowa, 80th Ohio y 10th Missouri en Jackson, Misisipi",
    "https://www.loc.gov/item/91721174/",
    "media"
  )
};

function jackson1863Fix() {
  const hierarchySources = [
    SOURCES.nationalParkServiceBattle,
    SOURCES.nationalParkServiceCampaign,
    SOURCES.nationalParkServiceBattleDetail,
    SOURCES.armyCampaignHistory
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "civil",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1863,
    endYear: 1863,
    region: "Jackson, condado de Hinds, Misisipi, Estados Unidos",
    normalizedRegion: "Jackson, condado de Hinds, Misisipi, Estados Unidos",
    cause: "Tras combatir en Raymond, Ulysses S. Grant gir\u00f3 hacia Jackson para inutilizar el centro ferroviario y de comunicaciones de la capital de Misisipi, aislar a Vicksburg de los refuerzos y evitar que las fuerzas de Joseph E. Johnston y John C. Pemberton se concentraran.",
    outcome: "Victoria de la Uni\u00f3n. Las fuerzas de William T. Sherman y James B. McPherson avanzaron bajo lluvia; la retaguardia confederada dirigida por John Gregg cubri\u00f3 la evacuaci\u00f3n ordenada por Joseph E. Johnston antes de retirarse. Las tropas federales entraron en Jackson durante la tarde del 14 de mayo.",
    consequences: "Grant orden\u00f3 neutralizar el valor militar de la ciudad mediante la destrucci\u00f3n de talleres, f\u00e1bricas, v\u00edas ferroviarias y l\u00edneas telegr\u00e1ficas. Con Johnston alejado, el ej\u00e9rcito federal gir\u00f3 hacia el oeste para combatir a Pemberton en Champion Hill y avanzar sobre Vicksburg. El episodio fue importante dentro de la campa\u00f1a, pero no resolvi\u00f3 por s\u00ed solo la guerra.",
    chronology: [
      {
        year: 1863,
        event: "El 12 de mayo, la victoria federal en Raymond permiti\u00f3 a Grant modificar su marcha y avanzar contra Jackson."
      },
      {
        year: 1863,
        event: "El 13 de mayo, Joseph E. Johnston lleg\u00f3 a Jackson y orden\u00f3 que John Gregg retrasara a las fuerzas federales mientras se evacuaban tropas y suministros."
      },
      {
        year: 1863,
        event: "El 14 de mayo, los cuerpos de Sherman y McPherson atacaron las defensas bajo lluvia intensa y obligaron a la retaguardia confederada a replegarse."
      },
      {
        year: 1863,
        event: "Las tropas de la Uni\u00f3n entraron en Jackson por la tarde y destruyeron infraestructura militar y ferroviaria antes de que Grant se orientara de nuevo hacia Vicksburg."
      },
      {
        year: 1863,
        event: "El 16 de mayo, la campa\u00f1a continu\u00f3 con la batalla de Champion Hill; el sitio de Vicksburg termin\u00f3 con la rendici\u00f3n confederada el 4 de julio."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Batalla de Raymond",
      "Batalla de Champion Hill",
      "Batalla de Big Black River Bridge",
      "Sitio de Vicksburg",
      "Ulysses S. Grant",
      "Joseph E. Johnston",
      "John Gregg",
      "William T. Sherman",
      "James B. McPherson"
    ],
    participants: [
      {
        side: "Uni\u00f3n",
        members: [
          "Estados Unidos",
          "Ejercito de la Union",
          "Ejercito del Tennessee",
          "XV Cuerpo",
          "XVII Cuerpo",
          "Ulysses S. Grant",
          "William T. Sherman",
          "James B. McPherson"
        ],
        casualties: "Las p\u00e1ginas del Servicio de Parques Nacionales dan recuentos ligeramente distintos para la Uni\u00f3n, entre 286 y 300 bajas. GeoRisk conserva esa variaci\u00f3n y no fija un total \u00fanico como dato cerrado."
      },
      {
        side: "Confederaci\u00f3n",
        members: [
          "Estados Confederados de America",
          "Fuerzas confederadas en Jackson",
          "Joseph E. Johnston",
          "John Gregg"
        ],
        casualties: "Las p\u00e1ginas del Servicio de Parques Nacionales registran una estimaci\u00f3n de alrededor de 845 a 850 muertos, heridos y desaparecidos confederados. La documentaci\u00f3n oficial indica que el parte no fue exacto; GeoRisk no presenta la cifra como definitiva."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "14 de mayo de 1863. La acci\u00f3n se desarroll\u00f3 tras la lluvia de la madrugada y la retirada confederada se complet\u00f3 durante la tarde.",
    sourceDispute: "Las fuentes oficiales coinciden en que el combate y la toma de Jackson ocurrieron el 14 de mayo de 1863 y en que se encuadran en la campa\u00f1a de Vicksburg. La ficha CWSAC estima 286 bajas federales y 850 confederadas, mientras el relato del parque cita 300 y 845 respectivamente; por esa diferencia y porque los partes confederados no fueron exactos, la ficha muestra rangos narrativos. El cat\u00e1logo de una estampa de la Biblioteca del Congreso incluye una etiqueta de 13 de mayo, pero su identificaci\u00f3n de cat\u00e1logo no modifica la fecha de la batalla establecida por las fuentes de historia militar del parque.",
    curationPriority: "alta",
    curationBatch: "source-backed-jackson-mississippi-1863-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de jackson, no ten\u00eda fecha, ubicaci\u00f3n, guerra ni participantes y estaba asignada al marcador gen\u00e9rico Conflicto regional de Am\u00e9rica. Se normaliza como Batalla de Jackson (Misisipi, 14 de mayo de 1863), sin fusionarla con otras acciones denominadas Jackson de la Guerra Civil estadounidense. La ficha agrega el estado actual para navegaci\u00f3n, pero representa los bandos de 1863 con sus entidades hist\u00f3ricas."
  };
}

export const JACKSON_1863_CONFLICT_RENAMES = {
  "Batalla de jackson": CANONICAL,
  "Batalla de Jackson": CANONICAL,
  "Battle of Jackson": CANONICAL,
  "Battle of Jackson, Mississippi": CANONICAL,
  "Battle of Jackson (May 14)": CANONICAL,
  "Jackson, Mississippi (1863)": CANONICAL
};

export const JACKSON_1863_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [CANONICAL]
};

export const JACKSON_1863_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: jackson1863Fix()
};
