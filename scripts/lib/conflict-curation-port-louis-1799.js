function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval de Port Louis (11 de diciembre de 1799)";
const PARENT = "Guerras revolucionarias francesas (1792-1802)";
const CAMPAIGN = "Teatro de las Indias Orientales de las Guerras revolucionarias francesas (1793-1801)";

const SOURCES = {
  royalMuseumsGreenwich: source(
    "Royal Museums Greenwich: biografia documental de Charles Montague Walker que confirma su participacion en la destruccion de la fragata francesa La Preneuse junto al HMS Adamant el 11 de diciembre de 1799",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-42041"
  ),
  frenchHistoricalService: source(
    "Service historique de la Defense de Francia: catalogo que registra Combat et destruction de la fregata La Preneuse en la bahia de Tombeau, isla de Francia, el 11 de diciembre de 1799",
    "https://www.servicehistorique.sga.defense.gouv.fr/sites/default/files/2019-04/201601_NP_DBIB_Fonds-Nivard.pdf"
  ),
  mauritiusNationalArchives: source(
    "National Archives Mauritius: inventario del juicio naval de octubre de 1800 sobre la perdida de la fragata La Preneuse",
    "https://nationalarchives.govmu.org/nationalarchives/wp-content/uploads/2020/12/Sections-a-f.pdf"
  )
};

function portLouis1799Fix() {
  const hierarchySources = [
    SOURCES.royalMuseumsGreenwich,
    SOURCES.frenchHistoricalService,
    SOURCES.mauritiusNationalArchives
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "accion naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1799,
    endYear: 1799,
    region: "Bahia de Tombeau, frente a Port Louis, isla de Francia (actual Mauricio), oceano Indico",
    normalizedRegion: "Bahia de Tombeau, Mauricio",
    cause: "La fragata francesa Preneuse regreso hacia la isla de Francia durante las operaciones navales de las Guerras revolucionarias francesas. Una fuerza britanica de bloqueo la intercepto frente a Port Louis antes de que pudiera alcanzar la seguridad del puerto.",
    outcome: "Victoria tactica britanica: HMS Tremendous y HMS Adamant obligaron a la fragata francesa Preneuse a varar cerca del rio Tombeau. Tras el combate bajo el fuego de las baterias costeras, la fragata ceso su resistencia y fue destruida. GeoRisk no presenta la accion como una conquista de Mauricio ni suma bajas anteriores de Preneuse a las del 11 de diciembre.",
    consequences: "La perdida de Preneuse dejo constancia en un juicio naval posterior en la isla de Francia. La accion formo parte del teatro del oceano Indico de las Guerras revolucionarias francesas y no produjo por si sola un cambio territorial en Mauricio.",
    chronology: [
      {
        year: 1792,
        event: "Las Guerras revolucionarias francesas abrieron un conflicto maritimo global entre Francia y Gran Bretana, con operaciones tambien en el oceano Indico."
      },
      {
        year: 1799,
        event: "Preneuse, al mando de Jean-Marthe-Adrien l'Hermite, intento regresar a la isla de Francia mientras HMS Tremendous y HMS Adamant operaban frente a Port Louis."
      },
      {
        year: 1799,
        event: "El 11 de diciembre, la persecucion britanica obligo a Preneuse a varar en la bahia de Tombeau. Hubo fuego de la fragata y de baterias costeras antes del cese de resistencia y la destruccion de la nave."
      },
      {
        year: 1800,
        event: "La perdida de La Preneuse fue objeto de un juicio naval en octubre de 1800, documentado por los National Archives Mauritius."
      },
      {
        year: 1802,
        event: "El Tratado de Amiens cerro la fase general de las Guerras revolucionarias francesas, sin convertir la accion de 1799 en una anexion o conquista de Mauricio."
      }
    ],
    treaties: [
      "Tratado de Amiens (1802): cierre general de las Guerras revolucionarias francesas"
    ],
    related: [
      PARENT,
      CAMPAIGN,
      "Port Louis",
      "bahia de Tombeau",
      "isla de Francia",
      "Mauricio",
      "fragata Preneuse",
      "HMS Tremendous",
      "HMS Adamant",
      "Jean-Marthe-Adrien l'Hermite",
      "John Osborn",
      "William Hotham"
    ],
    participants: [
      {
        side: "Escuadra britanica de bloqueo",
        members: [
          "Reino de Gran Bretana",
          "Royal Navy",
          "HMS Tremendous",
          "HMS Adamant",
          "John Osborn",
          "William Hotham"
        ],
        casualties: "Las fuentes archivisticas usadas para esta ficha confirman la accion y la destruccion de Preneuse, pero no aportan una tabla bilateral completa de muertos y heridos. GeoRisk no convierte los partes tardios o las perdidas materiales en un total cerrado de bajas britanicas."
      },
      {
        side: "Fragata francesa Preneuse y defensas costeras de la isla de Francia",
        members: [
          "Republica Francesa",
          "Marine francaise",
          "fragata Preneuse",
          "baterias costeras de la isla de Francia",
          "Jean-Marthe-Adrien l'Hermite"
        ],
        casualties: "La perdida de la fragata esta documentada, pero el juicio naval y los registros consultados no permiten reconstruir una cifra comparable de muertos, heridos, evacuados y capturados del 11 de diciembre. GeoRisk registra la destruccion de Preneuse sin inventar un total humano."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "11 de diciembre de 1799",
    sourceDispute: "El nombre Port Louis es ambiguo: la accion de Saint-Louis-du-Sud de 1748 tambien aparece en algunas fuentes en ingles como Battle of Port Louis. Esta ficha se limita a la destruccion de Preneuse del 11 de diciembre de 1799 en la bahia de Tombeau. Los registros oficiales coinciden en la destruccion de la fragata, pero los relatos posteriores difieren en la secuencia exacta entre varada, abandono, abordaje e incendio; por eso GeoRisk no fija una tabla de bajas ni atribuye un unico mecanismo sin reservas.",
    curationPriority: "alta",
    curationBatch: "source-backed-port-louis-1799-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior figuraba como Batalla de Port Louis solo en Francia y bajo un conflicto regional de Europa, sin fecha, lugar, contraparte, jerarquia, fuentes ni desambiguacion. Se normaliza como Batalla naval de Port Louis (11 de diciembre de 1799), se ubica en la bahia de Tombeau de la actual Mauricio y se integra en las Guerras revolucionarias francesas. Reino Unido se agrega solo como referencia geografica contemporanea del adversario historico; los participantes conservan la Republica Francesa y el Reino de Gran Bretana. La correccion separa expresamente este episodio de la accion distinta de Saint-Louis-du-Sud de 1748."
  };
}

export const PORT_LOUIS_1799_CONFLICT_RENAMES = {
  "Batalla de Port Louis": CANONICAL,
  "Batalla de Port-Louis": CANONICAL,
  "Batalla naval de Port Louis": CANONICAL,
  "Batalla naval de Port-Louis": CANONICAL,
  "Accion naval de Port Louis (11 de diciembre de 1799)": CANONICAL,
  "Acci\u00f3n naval de Port Louis (11 de diciembre de 1799)": CANONICAL,
  "Battle of Port Louis (1799)": CANONICAL,
  "Action of 11 December 1799": CANONICAL
};

export const PORT_LOUIS_1799_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL]
};

export const PORT_LOUIS_1799_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: portLouis1799Fix()
};
