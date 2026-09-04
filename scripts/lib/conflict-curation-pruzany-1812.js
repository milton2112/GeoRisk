function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate de Pru\u017cany (29 de julio / 10 de agosto de 1812)";
const PARENT = "Guerras napole\u00f3nicas (1803-1815)";
const CAMPAIGN = "Flanco meridional de la invasi\u00f3n francesa de Rusia (1812)";

const SOURCES = {
  slovakMilitaryHistory: source(
    "Vojensk\u00e1 hist\u00f3ria, revista del Instituto de Historia Militar de Bratislava: estudio basado en el Kriegsarchiv de Viena sobre el cuerpo auxiliar austriaco, el cuerpo sajon aliado y el teatro meridional de la campa\u00f1a de 1812",
    "https://www.vhu.sk/data/att/f84/18877.25df59.pdf"
  ),
  russian1812Chronicle: source(
    "Cronica de 1812: relato de la accion en Pruzhany, la presion de los cuerpos de Reynier y Schwarzenberg y la retirada de Lambert hacia Gorodechno",
    "https://1812.nsad.ru/59"
  ),
  polikarpovCalendar: source(
    "N. P. Polikarpov, calendario belico de 1812: descripcion del combate de Pruzhany y de las acciones de retaguardia posteriores",
    "https://old.runivers.ru/doc/patriotic_war/1812/calendar/?dat=10.08.1812",
    "media"
  ),
  funckMemoir: source(
    "Ferdinand von Funck, In Russland und in Sachsen (1812-1815): testimonio sajon que identifica la vanguardia de Lambert en Pruzana y separa este combate del enfrentamiento posterior de Poddubno/Gorodechno",
    "https://sources.ruzhany.info/143_00_de.html",
    "media"
  )
};

function pruzany1812Fix() {
  const hierarchySources = [
    SOURCES.slovakMilitaryHistory,
    SOURCES.russian1812Chronicle,
    SOURCES.polikarpovCalendar,
    SOURCES.funckMemoir
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate de retaguardia",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1812,
    endYear: 1812,
    region: "Pru\u017cany, Kozebrody y los accesos hacia Gorodechno, entonces Imperio ruso; actual region de Brest, Bielorrusia",
    normalizedRegion: "Pru\u017cany, Kozebrody y los accesos hacia Gorodechno, actual region de Brest, Bielorrusia",
    cause: "Tras el combate de Kobryn, la vanguardia rusa del conde Karl Lambert cubria la concentracion de la Tercera Armada Occidental de Aleksandr Tormasov. Los cuerpos austriaco de Karl Philipp zu Schwarzenberg y sajon de Jean Reynier avanzaron en el flanco meridional de la invasi\u00f3n de 1812 para recuperar la iniciativa y desalojar esa pantalla rusa.",
    outcome: "La vanguardia de Lambert se retiro de Pru\u017cany y de sus posiciones de retaguardia hacia Gorodechno tras combatir durante la jornada. Las fuerzas austriacas y sajonas conservaron la iniciativa local, pero la ficha no presenta el choque como una victoria estrategica decisiva ni fija bajas o efectivos bilaterales, que las fuentes no reconcilian.",
    consequences: "El repliegue ayudo a concentrar las fuerzas de Tormasov en el eje de Gorodechno, donde se produjo un enfrentamiento distinto el 12 de agosto segun el calendario gregoriano. La accion de Pru\u017cany no cerro por si sola la campa\u00f1a de 1812.",
    chronology: [
      {
        year: 1812,
        event: "Tras el combate de Kobryn, la vanguardia de Karl Lambert cubrio el movimiento de la Tercera Armada Occidental rusa en el sector de Pru\u017cany."
      },
      {
        year: 1812,
        event: "El 29 de julio en el calendario juliano vigente en el Imperio ruso, equivalente al 10 de agosto gregoriano, los cuerpos de Reynier y Schwarzenberg presionaron las posiciones de Lambert cerca de Pru\u017cany."
      },
      {
        year: 1812,
        event: "Lambert mantuvo acciones de retaguardia hacia Kozebrody y se retiro hacia Gorodechno; la noche limito la persecucion."
      },
      {
        year: 1812,
        event: "El 12 de agosto gregoriano se libro la batalla distinta de Gorodechno o Podubnie en el mismo teatro de operaciones."
      }
    ],
    treaties: ["Primer Tratado de Paris (1814)"],
    related: [
      PARENT,
      CAMPAIGN,
      "Invasion francesa de Rusia de 1812",
      "Karl Lambert",
      "Aleksandr Tormasov",
      "Karl Philipp zu Schwarzenberg",
      "Jean Reynier",
      "Batalla de Kobryn",
      "Batalla de Gorodechno",
      "Pru\u017cany"
    ],
    participants: [
      {
        side: "Vanguardia del Imperio ruso de Karl Lambert",
        members: ["Imperio ruso", "Vanguardia de Karl Lambert", "Tercera Armada Occidental de Aleksandr Tormasov"],
        casualties: "No consolidadas: las fuentes describen una retirada de retaguardia y episodios de combate, pero no ofrecen un parte bilateral homogeneo de efectivos, muertos, heridos y prisioneros."
      },
      {
        side: "Cuerpos austriaco y sajon aliados de Napoleon",
        members: ["Imperio austriaco", "Reino de Sajonia", "Cuerpo auxiliar de Karl Philipp zu Schwarzenberg", "Cuerpo sajon de Jean Reynier"],
        casualties: "No consolidadas: el testimonio sajon y los relatos de campa\u00f1a no permiten transformar bajas parciales o de unidades en un total verificable para ambos bandos."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "29 de julio de 1812 (calendario juliano en el Imperio ruso), equivalente al 10 de agosto de 1812 del calendario gregoriano",
    sourceDispute: "Las cronicas rusas conservan el 29 de julio de 1812 en calendario juliano; la conversion al calendario gregoriano da el 10 de agosto. El testimonio sajon de Funck distingue el combate de Pruzana de la posicion y batalla posterior de Poddubno/Gorodechno, por lo que GeoRisk no absorbe ambos hechos en una sola entrada. Los relatos difieren en su enfasis tactico y no entregan una tabla bilateral uniforme de efectivos o bajas; por eso la ficha describe una retirada de retaguardia y una iniciativa local austro-sajona, no un desenlace estrategico cerrado.",
    curationPriority: "alta",
    curationBatch: "source-backed-pruzany-1812-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Pru\u017cany, estaba asociada solo a Rusia y a un conflicto regional generico de Europa, sin fecha ni contraparte. Se normaliza como Combate de Pru\u017cany (29 de julio / 10 de agosto de 1812) dentro de las Guerras napoleonicas. Rusia, Austria y Alemania se enlazan para navegar las fuerzas imperiales rusa, austriaca y sajona de entonces; Bielorrusia se enlaza solo como ubicacion geografica contemporanea. Ninguno de esos Estados modernos se presenta como beligerante literal de 1812. La accion permanece separada de la batalla de Gorodechno o Podubnie."
  };
}

export const PRUZANY_1812_CONFLICT_RENAMES = {
  "Batalla de Pru\u017cany": CANONICAL,
  "Batalla de Pruzhany": CANONICAL,
  "Combate de Pru\u017cany": CANONICAL,
  "Combate de Pruzhany": CANONICAL,
  "Battle of Pru\u017cany": CANONICAL,
  "Battle of Pruzhany": CANONICAL,
  "Battle of Pruzany": CANONICAL,
  "Gefecht bei Pruzana": CANONICAL
};

export const PRUZANY_1812_COUNTRY_CONFLICT_ADDITIONS = {
  Rusia: [CANONICAL],
  Austria: [CANONICAL],
  Alemania: [CANONICAL],
  Bielorrusia: [CANONICAL]
};

export const PRUZANY_1812_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: pruzany1812Fix()
};
