function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla de Rakvere (1603)";
const PARENT = "Guerra polaco-sueca de 1600-1611";
const CAMPAIGN = "Campa\u00f1a de Livonia de 1603";

const SOURCES = {
  jagiellonianUniversitySources: source(
    "Universidad Jaguelonica, edicion de fuentes historicas: identifica Wesenberg con la actual Rakvere en Estonia, fecha la batalla el 5 de marzo de 1603 y registra la capitulacion posterior de Dorpat",
    "https://ruj.uj.edu.pl/server/api/core/bitstreams/aa830ed6-e193-470a-a735-84b94e1204c6/content"
  ),
  tartuUniversityStudy: source(
    "Universidad de Tartu, estudio historico: describe el intento sueco de cortar el avance polaco hacia Dorpat en marzo de 1603 y la derrota de su vanguardia en Wesenberg a manos de Chodkiewicz",
    "https://dspace.ut.ee/bitstreams/b386ba0b-6381-45c8-8222-b438d88f33a5/download"
  ),
  polishMilitaryLibraryStudy: source(
    "Biblioteca Militar Central de Polonia, estudio sobre la campa\u00f1a de 1603: vincula la victoria de Chodkiewicz en el area de Rakvere/Wesenberg con las operaciones polaco-suecas en Livonia",
    "https://zbrojownia.cbw.wp.mil.pl/Content/5739/295737p.pdf?handler=pdf"
  ),
  estonianPublicBroadcasterContext: source(
    "Radiodifusora publica estonia ERR, contexto local: distingue la batalla posterior de Rakvere de 1603 dentro de la guerra polaco-sueca de comienzos del siglo XVII",
    "https://news.err.ee/1609802013/renewed-rakvere-castle-history-rooms-display-rare-hanseatic-era-finds",
    "media"
  )
};

function rakvere1603Fix() {
  const hierarchySources = [
    SOURCES.jagiellonianUniversitySources,
    SOURCES.tartuUniversityStudy,
    SOURCES.polishMilitaryLibraryStudy,
    SOURCES.estonianPublicBroadcasterContext
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
    startYear: 1603,
    endYear: 1603,
    region: "Rakvere o Wesenberg, Livonia historica, actual Estonia",
    normalizedRegion: "Rakvere o Wesenberg, Livonia historica, actual Estonia",
    cause: "Durante la guerra polaco-sueca, una fuerza sueca intento interrumpir el avance de Jan Karol Chodkiewicz hacia Dorpat. Las fuerzas polaco-lituanas interceptaron a la vanguardia sueca cerca de Rakvere, llamada Wesenberg en fuentes de epoca.",
    outcome: "Victoria polaco-lituana: Chodkiewicz vencio a la fuerza sueca cerca de Rakvere y pudo continuar las operaciones sobre Dorpat. La ficha no fija una tabla unica de efectivos ni bajas porque las fuentes consultadas no presentan un parte bilateral homogeneo.",
    consequences: "La accion favorecio la continuacion del sitio de Dorpat, que capitul\u00f3 en abril de 1603. No cerro la guerra polaco-sueca de 1600-1611 ni convierte a los Estados contemporaneos en equivalentes automaticos de los beligerantes de la epoca.",
    chronology: [
      {
        year: 1603,
        event: "A comienzos de 1603, Jan Karol Chodkiewicz avanzo en Livonia hacia Dorpat mientras el mando sueco intentaba obstaculizar la operacion."
      },
      {
        year: 1603,
        event: "El 5 de marzo, las fuerzas polaco-lituanas derrotaron a la vanguardia sueca cerca de Rakvere o Wesenberg."
      },
      {
        year: 1603,
        event: "En abril, Dorpat capitul\u00f3 tras la continuidad de las operaciones polaco-lituanas; la fecha exacta del episodio aparece con pequenas variaciones entre relatos y no se fuerza en la ficha."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Rakvere", "Wesenberg", "Livonia", "Dorpat", "Jan Karol Chodkiewicz", "Anders Lennartsson"],
    participants: [
      {
        side: "Fuerzas polaco-lituanas",
        members: ["Mancomunidad Polaco-Lituana", "Jan Karol Chodkiewicz", "Fuerzas polaco-lituanas en Livonia"],
        casualties: "No consolidadas: las fuentes consultadas confirman la victoria, pero no aportan una tabla bilateral homogenea de efectivos, muertos, heridos, cautivos y prisioneros."
      },
      {
        side: "Fuerzas suecas",
        members: ["Suecia", "Anders Lennartsson", "Vanguardia sueca en Livonia"],
        casualties: "No consolidadas: la ficha evita convertir recuentos dispersos de fuerza o bajas en un balance definitivo del combate."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "5 de marzo de 1603",
    sourceDispute: "Las fuentes consultadas coinciden en la accion de 1603, su ubicacion cerca de Rakvere/Wesenberg, el marco de la guerra polaco-sueca y la victoria de Chodkiewicz. El nombre tambien puede remitir a una batalla medieval de 1268, por lo que esta ficha incorpora siempre el ano 1603 y no usa aliases sin fecha para Wesenberg. Los relatos no ofrecen una cifra bilateral uniforme de efectivos o bajas, y la capitulacion de Dorpat aparece fechada de manera no identica dentro de abril; por eso no se fija un dia ni un total humano cerrado.",
    curationPriority: "alta",
    curationBatch: "source-backed-rakvere-1603-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Rakvere, carecia de fecha, jerarquia, detalle y ubicacion precisa, y solo estaba vinculada a Suecia bajo un conflicto europeo generico. La asociacion sueca permite distinguirla de la batalla de 1268 y normalizarla como la accion de 1603 de la guerra polaco-sueca. Polonia se agrega como enlace contemporaneo de navegacion por la Mancomunidad Polaco-Lituana y Estonia por la ubicacion actual; no se presenta a esos Estados actuales como beligerantes identicos a las entidades del periodo."
  };
}

export const RAKVERE_1603_CONFLICT_RENAMES = {
  "Batalla de Rakvere": CANONICAL,
  "Batalla de Rakvere (1603)": CANONICAL,
  "Battle of Rakvere (1603)": CANONICAL,
  "Batalla de Wesenberg (1603)": CANONICAL,
  "Battle of Wesenberg (1603)": CANONICAL
};

export const RAKVERE_1603_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: [CANONICAL],
  Estonia: [CANONICAL]
};

export const RAKVERE_1603_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: rakvere1603Fix()
};
