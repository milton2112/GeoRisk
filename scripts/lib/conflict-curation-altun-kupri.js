const NAME = "Batalla de Altun Kupri (Pirde, 2017)";
const PARENT = "Conflicto kurdo-iraqu\u00ed de 2017";
const CAMPAIGN = "Operaciones federales en Kirkuk (octubre de 2017)";
const REGION = "Altun Kupri (Pirde), provincia de Kirkuk, Irak, Asia occidental";

export const ALTUN_KUPRI_CONFLICT_RENAMES = {
  "Batalla de Pirde": NAME,
  "Battle of Pirde": NAME,
  "Battle of Altun Kupri (2017)": NAME
};

export const ALTUN_KUPRI_COUNTRY_CONFLICT_ADDITIONS = { Irak: [NAME] };

export const ALTUN_KUPRI_CONFLICT_DETAIL_FIXES = {
  [NAME]: {
    parent: PARENT, war: PARENT, campaign: CAMPAIGN, related: [PARENT, CAMPAIGN],
    startYear: 2017, endYear: 2017, datePrecision: "20 de octubre de 2017",
    type: "batalla", conflictType: "civil", scale: "local",
    status: "historico", active: false, ongoing: false,
    region: REGION, normalizedRegion: REGION,
    cause: "Disputa entre Bagdad y el Gobierno Regional del Kurdist\u00e1n por el control de territorios de Kirkuk tras el refer\u00e9ndum de independencia kurdo de septiembre de 2017.",
    outcome: "Reuters y AP informaron que las fuerzas federales tomaron Altun Kupri el 20 de octubre. AP todav\u00eda registraba fuego peshmerga sobre la localidad por la tarde; no fue el cierre de todo el conflicto.",
    consequences: "La toma extendi\u00f3 el control federal hasta el l\u00edmite administrativo con Erbil. AP contabiliz\u00f3 6 civiles muertos y 15 heridos en el hospital local: no son un total de bajas de la batalla y las circunstancias de las lesiones no estaban claras.",
    participants: [
      {
        side: "Fuerzas federales iraqu\u00edes y milicias aliadas",
        members: ["Servicio de Contraterrorismo de Irak (CTS)", "Polic\u00eda Federal de Irak", "Fuerzas de Movilizaci\u00f3n Popular (PMF)"],
        casualties: "Sin total confirmado para esta fuerza; no equivale a cero"
      },
      {
        side: "Fuerzas kurdas peshmerga",
        members: ["Fuerzas peshmerga del Gobierno Regional del Kurdist\u00e1n"],
        casualties: "Sin total confirmado para esta fuerza; no equivale a cero"
      }
    ],
    chronology: [
      { year: 2017, event: "El 20 de octubre, las fuerzas federales avanzaron sobre Altun Kupri y combatieron con los peshmerga." },
      { year: 2017, event: "Por la tarde del 20 de octubre, AP informaba del control federal de la localidad y de fuego kurdo que continuaba." }
    ],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      {
        label: "Reuters, 20 de octubre de 2017, republicado por Cyprus Mail: fecha, localidad, fuerzas y control federal",
        url: "https://archive.cyprus-mail.com/2017/10/20/iraq-forces-take-kirkuk-province-clashing-kurds/"
      },
      {
        label: "Associated Press, Emad Matti y Philip Issa, 20 de octubre de 2017, en The Spokesman-Review: control de Altun Kupri y observaci\u00f3n hospitalaria",
        url: "https://www.spokesman.com/stories/2017/oct/20/iraqi-and-kurdish-forces-exchange-fire-at-border/"
      },
      {
        label: "Comunicado peshmerga del 20 de octubre de 2017, archivado en FARA, p. 23: alias Pirde y fecha; fuente de parte",
        url: "https://efile.fara.gov/docs/5783-Informational-Materials-20180531-3.pdf#page=23"
      }
    ],
    source: "Curadur\u00eda con Reuters y Associated Press; comunicado peshmerga para alias y fecha",
    sourceDispute: false,
    curationPriority: "alta", curationBatch: "source-backed-altun-kupri-2017-2026-10",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "Pirde y Altun Kupri identifican el mismo episodio. Padre y campa\u00f1a son agrupaciones descriptivas; civil distingue un conflicto interno iraqu\u00ed de una guerra entre Estados. El comunicado peshmerga es una fuente de parte: no se adoptan sus cifras de veh\u00edculos destruidos ni su alegaci\u00f3n de intervenci\u00f3n iran\u00ed. Estados Unidos e Ir\u00e1n aparecen como referencias de apoyo, no como beligerantes confirmados. No se suman las cifras hospitalarias a bajas militares ni se inventa un tratado de cierre. Hist\u00f3rico describe esta batalla, no el estado actual de las relaciones entre Bagdad y Erbil."
  }
};
