function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Ostr\u00f3da (1628)";
const PARENT = "Guerra polaco-sueca de 1626-1629";
const CAMPAIGN = "Operaciones de Prusia de 1628";

const SOURCES = {
  actaNuntiaturae: source(
    "Acta Nuntiaturae Polonae, edicion academica de documentos de nunciatura: fecha el combate cerca de Ostroda el 23 de octubre de 1628 y registra la captura polaca de Wulf Heinrich von Baudissin",
    "https://pau.krakow.pl/ANP/ANP_XXIII_2_2021.pdf"
  ),
  polishEducationPlatform: source(
    "Plataforma Educativa Integrada de Polonia: sitia las operaciones de 1626-1629 de Gustavo Adolfo en el area del Vistula y Pregolia, el papel de Koniecpolski y la tregua de Altmark de 1629",
    "https://zpe.gov.pl/a/rzeczpospolita-wojuje/D10uujbva"
  )
};

function ostroda1628Fix() {
  const hierarchySources = [
    SOURCES.actaNuntiaturae,
    SOURCES.polishEducationPlatform
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla terrestre",
    conflictType: "interestatal",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1628,
    endYear: 1628,
    region: "Cerca de Ostr\u00f3da u Osterode, Prusia historica, actual voivodato de Varmia y Masuria, Polonia",
    normalizedRegion: "Ostr\u00f3da, actual voivodato de Varmia y Masuria, Polonia",
    cause: "Durante la guerra polaco-sueca de 1626-1629, Suecia y la Mancomunidad Polaco-Lituana disputaban posiciones, abastecimiento y control comercial en Prusia y el Baltico. En 1628, las fuerzas de Stanislaw Koniecpolski recurrieron a operaciones moviles contra destacamentos suecos; uno dirigido por Wulf Heinrich von Baudissin fue interceptado cerca de Ostroda.",
    outcome: "Victoria tactica polaco-lituana el 23 de octubre de 1628: Wulf Heinrich von Baudissin fue capturado por fuerzas polacas cerca de Ostroda. La ficha no fija efectivos ni bajas, y no convierte esa captura en una victoria estrategica decisiva de toda la guerra.",
    consequences: "Baudissin fue intercambiado despues por prisioneros polacos y regreso al servicio sueco. La guerra continuo hasta la tregua de Altmark de 1629; por eso el combate se presenta como un exito tactico dentro de una campana regional, no como el cierre del conflicto.",
    chronology: [
      {
        year: 1626,
        event: "Las operaciones suecas y polaco-lituanas se concentraron entre 1626 y 1629 en los espacios del Vistula y la Pregolia, con Gustavo Adolfo y Stanislaw Koniecpolski como figuras centrales de la campana."
      },
      {
        year: 1628,
        event: "El 23 de octubre, fuerzas polaco-lituanas capturaron a Wulf Heinrich von Baudissin cerca de Ostroda durante una accion contra un destacamento sueco."
      },
      {
        year: 1629,
        event: "La tregua de Altmark puso fin a esta fase de la guerra, sin que la accion de Ostroda por si sola resolviera el equilibrio regional."
      }
    ],
    treaties: ["Tregua de Altmark (1629), cierre general posterior de la guerra"],
    related: [PARENT, CAMPAIGN, "Ostr\u00f3da u Osterode", "Stanislaw Koniecpolski", "Wulf Heinrich von Baudissin", "Tregua de Altmark (1629)"],
    participants: [
      {
        side: "Fuerzas de la Mancomunidad Polaco-Lituana",
        members: ["Mancomunidad Polaco-Lituana", "Stanislaw Koniecpolski", "destacamento polaco-lituano"],
        casualties: "No consolidadas: las fuentes consultadas confirman la captura de Baudissin, pero no aportan una tabla bilateral homogenea de efectivos, muertos, heridos y prisioneros."
      },
      {
        side: "Destacamento sueco de Baudissin",
        members: ["Suecia", "Wulf Heinrich von Baudissin", "destacamento sueco al mando de Baudissin"],
        casualties: "No consolidadas: algunos relatos secundarios proponen cifras de bajas y capturas, pero la ficha no las fija sin una serie primaria comparable para ambos bandos."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "23 de octubre de 1628",
    sourceDispute: "La edicion documental consultada confirma la fecha y la captura de Baudissin cerca de Ostroda; las sintesis posteriores difieren sobre la magnitud del destacamento, el numero de muertos y cautivos y el alcance del exito. GeoRisk conserva la victoria tactica verificable, pero no fija bajas ni interpreta el episodio como una ruptura decisiva de la guerra, que continuo hasta Altmark. La etiqueta Operaciones de Prusia de 1628 es organizativa de GeoRisk, no una campana oficial con ese nombre. Polonia se usa como referencia geografica actual y de navegacion para la Mancomunidad Polaco-Lituana, sin equiparar ambos Estados historicamente.",
    curationPriority: "alta",
    curationBatch: "source-backed-ostroda-1628-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Ostroda, carecia de fecha, jerarquia, contraparte y ubicacion, y solo estaba vinculada a Suecia bajo un conflicto europeo generico. Se normaliza como Batalla de Ostr\u00f3da (1628), se integra a la guerra polaco-sueca de 1626-1629 y agrega Polonia como enlace contemporaneo de navegacion por la Mancomunidad participante. No asocia a Alemania por mercenarios de epoca ni transforma la geografia actual en beligerancia contemporanea."
  };
}

export const OSTRODA_1628_CONFLICT_RENAMES = {
  "Batalla de Ostr\u00f3da": CANONICAL,
  "Batalla de Ostroda": CANONICAL,
  "Batalla de Ostr\u00f3da (1628)": CANONICAL,
  "Battle of Ostr\u00f3da": CANONICAL,
  "Battle of Ostroda": CANONICAL,
  "Battle of Osterode (1628)": CANONICAL,
  "Bitwa pod Ostroda": CANONICAL
};

export const OSTRODA_1628_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: [CANONICAL]
};

export const OSTRODA_1628_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: ostroda1628Fix()
};
