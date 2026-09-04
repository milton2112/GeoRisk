function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Combate de Sobota (1655)";
const PARENT = "Segunda Guerra N\u00f3rdica";
const CAMPAIGN = "Avance sueco hacia Pi\u0105tek y Varsovia (1655)";

const SOURCES = {
  swedishNationalArchives: source(
    "Archivo Nacional de Suecia, Svenskt Biografiskt Lexikon: biografia de Ludwig W. Lewenhaupt, que registra su participacion en Sobota el 23-24 de agosto de 1655 y el avance posterior hacia Varsovia",
    "https://sok.riksarkivet.se/sbl/Presentation.aspx?id=11287"
  ),
  stockholmUniversityStudy: source(
    "Pehr Hedenqvist, estudio alojado por la Universidad de Estocolmo sobre una fuente historica y la tradicion del regimiento de caballeria de Ostergotland, que ubica el combate de Sobota el 23 de agosto de 1655",
    "https://assets.ctfassets.net/47df4ko85xo6/6TDHCSH1oZE9KZLFvvifnY/832dc26f59d643fa5d701be8ae3e57ed/voiter.pdf",
    "media"
  ),
  leczycaCountyHistory: source(
    "Consejo del condado de Leczyca: cronologia historica local que fecha Sobota el 2 de septiembre de 1655 y la relaciona con la retirada polaca desde Pi\u0105tek",
    "https://www.leczycki.pl/asp/historia-samorzadu,296",
    "media"
  )
};

function sobota1655Fix() {
  const hierarchySources = [
    SOURCES.swedishNationalArchives,
    SOURCES.stockholmUniversityStudy,
    SOURCES.leczycaCountyHistory
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "combate de caballeria y demora",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1655,
    endYear: 1655,
    region: "Sobota, Bielawy y los cruces de los humedales del rio Bzura hacia Pi\u0105tek, actual voivodato de Lodz, Polonia",
    normalizedRegion: "Sobota, Bielawy y los cruces de los humedales del rio Bzura hacia Pi\u0105tek, actual voivodato de Lodz, Polonia",
    cause: "Durante la invasion sueca de 1655, Carlos X Gustavo avanzo hacia Varsovia y desvio parte de la marcha contra el campamento de Juan II Casimiro cerca de Pi\u0105tek. La caballeria de Aleksander Koniecpolski intento demorar el cruce sueco de los humedales del Bzura y cubrir la retirada polaca.",
    outcome: "La caballeria de Koniecpolski retraso la marcha sueca durante el cruce, pero no pudo detener el avance. Las fuerzas polacas se retiraron y el campamento de Pi\u0105tek fue evacuado; por eso la ficha lo clasifica como un exito operativo sueco y una retirada de cobertura polaca, no como un desenlace decisivo de toda la guerra.",
    consequences: "La demora ayudo a dar margen para la retirada de Juan II Casimiro y de parte de sus fuerzas. El avance sueco continuo hacia Varsovia pocos dias despues, mientras la guerra siguio hasta la Paz de Oliva de 1660.",
    chronology: [
      {
        year: 1655,
        event: "La invasion sueca entro en la Mancomunidad Polaco-Lituana y Carlos X Gustavo avanzo desde Gran Polonia hacia Varsovia."
      },
      {
        year: 1655,
        event: "Cerca de Sobota, la caballeria de Aleksander Koniecpolski hostigo el cruce sueco de los humedales del Bzura y se retiro ante la continuidad del avance."
      },
      {
        year: 1655,
        event: "El campamento de Pi\u0105tek fue evacuado; las fuerzas suecas siguieron la operacion hacia Varsovia."
      }
    ],
    treaties: ["Paz de Oliva (1660)"],
    related: [
      PARENT,
      CAMPAIGN,
      "El Diluvio",
      "Carlos X Gustavo",
      "Juan II Casimiro",
      "Aleksander Koniecpolski",
      "Ludwig W. Lewenhaupt",
      "Arvid Wittenberg",
      "Pi\u0105tek",
      "Rio Bzura"
    ],
    participants: [
      {
        side: "Fuerzas suecas de Carlos X Gustavo",
        members: ["Imperio sueco", "Fuerzas de Carlos X Gustavo", "Caballeria de Ostergotland vinculada a Ludwig W. Lewenhaupt"],
        casualties: "No consolidadas: las fuentes consultadas describen el avance, el cruce y la continuidad de la campa\u00f1a, pero no proporcionan un parte bilateral verificable de muertos, heridos, prisioneros y efectivos."
      },
      {
        side: "Caballeria de la Mancomunidad Polaco-Lituana",
        members: ["Mancomunidad Polaco-Lituana", "Caballeria de Aleksander Koniecpolski", "Fuerzas de Juan II Casimiro"],
        casualties: "No consolidadas: los relatos disponibles permiten identificar una accion de demora y retirada, no una cifra homogenea de bajas polaco-lituanas."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "Las fuentes suecas citadas registran acciones en Sobota el 23-24 de agosto de 1655; la cronologia local polaca fecha el combate el 2 de septiembre de 1655. Se conserva el ano y ambas referencias sin forzar una equivalencia diaria unica.",
    sourceDispute: "La documentacion sueca y la cronologia polaca no emplean la misma precision diaria: las primeras registran Sobota el 23-24 de agosto y la segunda el 2 de septiembre. La diferencia puede responder a convenciones de calendario y a una maniobra de mas de una jornada, por lo que GeoRisk no convierte esas referencias en dos batallas ni fija un unico dia sin una fuente comparativa directa. Las fuentes coinciden en la accion de demora de la caballeria polaca, el avance sueco y la retirada desde Pi\u0105tek; no consolidan bajas.",
    curationPriority: "alta",
    curationBatch: "source-backed-sobota-1655-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Sobota, no tenia fecha, participantes ni guerra padre. Se normaliza como Combate de Sobota (1655) dentro de la Segunda Guerra Nordica y se conserva la doble referencia cronologica de las fuentes. Suecia y Polonia se enlazan para navegacion historica: representan el Imperio sueco, la Mancomunidad Polaco-Lituana y el lugar actual del combate, no Estados contemporaneos literalmente trasladados a 1655."
  };
}

export const SOBOTA_1655_CONFLICT_RENAMES = {
  "Batalla de Sobota": CANONICAL,
  "Combate de Sobota": CANONICAL,
  "Battle of Sobota": CANONICAL,
  "Bitwa pod Sobot\u0105": CANONICAL,
  "Slaget vid Sobota": CANONICAL
};

export const SOBOTA_1655_COUNTRY_CONFLICT_ADDITIONS = {
  Suecia: [CANONICAL],
  Polonia: [CANONICAL]
};

export const SOBOTA_1655_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: sobota1655Fix()
};
