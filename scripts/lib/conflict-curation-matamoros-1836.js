function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Acci\u00f3n naval de Matamoros (3 de abril de 1836)";
const PARENT = "Revoluci\u00f3n de Texas (1835-1836)";
const CAMPAIGN = "Operaciones navales texanas en el golfo de M\u00e9xico (1836)";

const SOURCES = {
  texasStateHistoricalAssociation: source(
    "Texas State Historical Association, Handbook of Texas: mision de Jeremiah Brown, encuentro del Invincible con el crucero mexicano Montezuma cerca de la boca del Rio Grande el 3 de abril de 1836, varadura del buque mexicano, captura posterior del Pocket y proceso por pirateria",
    "https://www.tshaonline.org/handbook/entries/invincible"
  ),
  stateBarTexas: source(
    "State Bar of Texas: bloqueo de Matamoros, carga de contrabando y correspondencia hallada en el Pocket, proceso de presa de guerra y controversia juridica posterior",
    "https://www.texasbar.com/AM/Template.cfm?ContentID=50244&Section=articles&Template=%2FCM%2FHTMLDisplay.cfm"
  )
};

function matamoros1836Fix() {
  const hierarchySources = [
    SOURCES.texasStateHistoricalAssociation,
    SOURCES.stateBarTexas
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "acci\u00f3n naval",
    conflictType: "independencia",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1836,
    endYear: 1836,
    region: "Frente a la boca del Rio Grande y al puerto de Matamoros, golfo de M\u00e9xico; actual frontera de Tamaulipas, M\u00e9xico, y Texas, Estados Unidos",
    normalizedRegion: "Boca del Rio Grande, golfo de M\u00e9xico",
    cause: "Durante la Revoluci\u00f3n de Texas, las autoridades texanas adquirieron la goleta Invincible para responder a los cruceros mexicanos que podian obstaculizar la navegacion y los suministros en el golfo. Jeremiah Brown recibio ordenes de patrullar la costa y enfrentar al crucero mexicano Montezuma.",
    outcome: "Resultado tactico texano en el combate con Montezuma: tras un intenso intercambio de andanadas, el buque mexicano varo y su tripulacion escapo a tierra. La captura del mercante estadounidense Pocket ocurrio despues, hacia las 14:00 del mismo dia; GeoRisk la registra como un episodio relacionado y no como el hundimiento de Montezuma ni como una baja del combate.",
    consequences: "La accion mostro la capacidad naval texana para disputar las rutas del golfo durante la revolucion. La captura posterior del Pocket, con contrabando belico y correspondencia vinculada a la operacion mexicana, abrio un proceso de presa y una controversia juridica en Nueva Orleans: la tripulacion del Invincible fue detenida el 1 de mayo bajo acusacion de pirateria y luego liberada al no sostenerse el cargo. La ficha no atribuye a esta sola accion un resultado decisivo sobre toda la guerra.",
    chronology: [
      {
        year: 1835,
        event: "A fines de 1835 y comienzos de 1836, la presencia de cruceros mexicanos en el golfo impulso al gobierno provisional texano a adquirir buques de guerra."
      },
      {
        year: 1836,
        event: "El 3 de abril, a las 10:00, la goleta texana Invincible, al mando de Jeremiah Brown, encontro al crucero mexicano Montezuma cerca de la boca del Rio Grande."
      },
      {
        year: 1836,
        event: "Tras un intercambio de andanadas, Montezuma varo y su tripulacion escapo a tierra; la fuente no aporta una tabla bilateral comparable de bajas."
      },
      {
        year: 1836,
        event: "Hacia las 14:00, Invincible avisto, abordo y llevo a Galveston al mercante estadounidense Pocket tras hallar contrabando, armamento, un mapa de la costa texana y despachos en espanol."
      },
      {
        year: 1836,
        event: "El 1 de mayo, la tripulacion de Invincible fue detenida en Nueva Orleans por una acusacion de pirateria que no se sostuvo y de la que fue liberada."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Jeremiah Brown", "goleta Invincible", "crucero Montezuma", "Pocket", "Matamoros", "boca del Rio Grande", "golfo de M\u00e9xico"],
    participants: [
      {
        side: "Fuerza naval texana",
        members: ["Rep\u00fablica de Texas", "Marina de Texas", "goleta Invincible", "capitan Jeremiah Brown"],
        casualties: "Las fuentes institucionales consultadas identifican el buque, el mando y el resultado inmediato, pero no ofrecen una tabla bilateral unica y comparable de muertos y heridos. GeoRisk no publica un total texano no verificable."
      },
      {
        side: "Fuerza naval mexicana",
        members: ["M\u00e9xico", "Marina mexicana", "crucero Montezuma"],
        casualties: "Montezuma varo tras el intercambio de andanadas y su tripulacion escapo a tierra. Las fuentes consultadas no permiten fijar un total verificable de bajas ni sostienen que el buque fuera hundido en esta accion."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "3 de abril de 1836",
    sourceDispute: "La bibliografia puede agrupar bajo nombres cercanos el combate de las 10:00, la posterior captura del Pocket y el bloqueo de Matamoros. La fuente de la Texas State Historical Association los distingue: Montezuma varo y su tripulacion escapo tras el combate, mientras que Pocket fue abordado y llevado como presa varias horas despues. GeoRisk conserva el titulo geografico mas reconocible, usa una fecha precisa y no transforma esa secuencia en un hundimiento de Montezuma ni en una cifra cerrada de bajas. Estados Unidos aparece solo como referencia geografica actual de Texas para navegar el mapa, no como beligerante estatal retrospectivo de 1836.",
    curationPriority: "alta",
    curationBatch: "source-backed-matamoros-1836-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior aparecia solo para M\u00e9xico, sin fecha, contraparte, lugar, guerra, campana, participantes ni resultado verificable y bajo un conflicto regional generico. Se normaliza como Accion naval de Matamoros (3 de abril de 1836), se integra en la Revolucion de Texas y se vincula con Estados Unidos como referencia geografica contemporanea de Texas. La correccion separa el combate con Montezuma de la captura posterior del Pocket y evita inventar bajas, hundimientos o consecuencias decisivas."
  };
}

export const MATAMOROS_1836_CONFLICT_RENAMES = {
  "Batalla de Matamoros": CANONICAL,
  "Batalla de Matamoros (1836)": CANONICAL,
  "Acci\u00f3n naval de Matamoros": CANONICAL,
  "Accion naval de Matamoros": CANONICAL,
  "Acci\u00f3n naval de Matamoros (3 de abril de 1836)": CANONICAL,
  "Accion naval de Matamoros (3 de abril de 1836)": CANONICAL,
  "Action of April 3, 1836": CANONICAL,
  "Battle of Matamoros": CANONICAL
};

export const MATAMOROS_1836_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [CANONICAL]
};

export const MATAMOROS_1836_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: matamoros1836Fix()
};
