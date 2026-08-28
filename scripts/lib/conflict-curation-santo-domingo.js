function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  royalMuseumsGreenwich: source(
    "Royal Museums Greenwich: acci\u00f3n de Duckworth frente a San Domingo el 6 de febrero de 1806, con capturas y p\u00e9rdidas de la escuadra francesa",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-12063"
  ),
  royalCollection: source(
    "Royal Collection Trust: mapa contempor\u00e1neo de la acci\u00f3n en la bah\u00eda de San Domingo el 6 de febrero de 1806, en la actual Rep\u00fablica Dominicana",
    "https://militarymaps.rct.uk/napoleonic-wars-1803-15/san-domingo-bay-1806-santo-domingo-bay-dominican-republic-18deg1800n-70deg0300w"
  ),
  madridGazette: source(
    "Gaceta de Madrid (6 de mayo de 1806): parte contempor\u00e1neo sobre la llegada francesa a Santo Domingo y el combate de Duckworth y Cochrane",
    "https://www.boe.es/gazeta/dias/1806/05/06/pdfs/GMD-1806-38.pdf"
  )
};

const PARENT = "Guerras napole\u00f3nicas (1803-1815)";
const CAMPAIGN = "Campa\u00f1a atl\u00e1ntica de 1806";

function santoDomingoFix() {
  const hierarchySources = [
    SOURCES.royalMuseumsGreenwich,
    SOURCES.royalCollection,
    SOURCES.madridGazette
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla naval",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1806,
    endYear: 1806,
    region: "Frente a la costa sur de Santo Domingo, Caribe; actual Rep\u00fablica Dominicana",
    normalizedRegion: "Frente a la costa sur de Santo Domingo, Caribe; actual Rep\u00fablica Dominicana",
    cause: "Despu\u00e9s de Trafalgar, John Thomas Duckworth dej\u00f3 el bloqueo de C\u00e1diz para perseguir a una escuadra francesa hacia el Caribe. Al localizar los nav\u00edos de Corentin-Urbain Leiss\u00e8gues en la rada de San Domingo, la Royal Navy intent\u00f3 impedir que continuaran sus operaciones en la zona.",
    outcome: "Victoria brit\u00e1nica el 6 de febrero de 1806. La escuadra de Duckworth captur\u00f3 el Alexandre, el Brave y el Jupiter; el Imperial y el Diomede terminaron varados y se perdieron. La ficha no consolida una cifra \u00fanica de bajas porque los recuentos var\u00edan entre los relatos y partes disponibles.",
    consequences: "La acci\u00f3n desarticul\u00f3 la escuadra francesa de Leiss\u00e8gues en el Caribe y redujo su capacidad inmediata para operar en el Atl\u00e1ntico occidental. No puso fin por s\u00ed sola a las Guerras napole\u00f3nicas, que continuaron en otros teatros.",
    chronology: [
      {
        year: 1805,
        event: "Tras Trafalgar, Duckworth sali\u00f3 de las aguas de C\u00e1diz para perseguir una escuadra francesa hacia el Caribe."
      },
      {
        year: 1806,
        event: "El 6 de febrero, las escuadras brit\u00e1nica y francesa se enfrentaron frente a Santo Domingo."
      },
      {
        year: 1806,
        event: "Tres nav\u00edos franceses fueron capturados y dos acabaron varados y perdidos; una parte menor de la fuerza francesa logr\u00f3 retirarse."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Santo Domingo", "Caribe", "John Thomas Duckworth", "Corentin-Urbain Leiss\u00e8gues", "HMS Superb", "Imperial"],
    participants: [
      {
        side: "Escuadra de la Royal Navy",
        members: ["Reino Unido de Gran Breta\u00f1a e Irlanda", "Escuadra de John Thomas Duckworth", "HMS Superb", "HMS Canopus"]
      },
      {
        side: "Escuadra francesa",
        members: ["Primer Imperio franc\u00e9s", "Escuadra de Corentin-Urbain Leiss\u00e8gues", "Imperial", "Diomede", "Alexandre", "Brave", "Jupiter"]
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "6 de febrero de 1806",
    curationPriority: "alta",
    curationBatch: "source-backed-santo-domingo-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa quedaba bajo una jerarqu\u00eda europea gen\u00e9rica y solo vinculada a Francia. Se normaliza como batalla naval de Santo Domingo de 1806 dentro de las Guerras napole\u00f3nicas. Reino Unido se vincula por la Royal Navy y Rep\u00fablica Dominicana solo como referencia geogr\u00e1fica contempor\u00e1nea; sus Estados actuales, Espa\u00f1a y Hait\u00ed no se presentan como beligerantes de esta acci\u00f3n. La ficha conserva los imperios y escuadras hist\u00f3ricos y evita fijar un total cerrado de bajas."
  };
}

export const SANTO_DOMINGO_CONFLICT_RENAMES = {
  "Batalla de San Domingo": "Batalla naval de Santo Domingo (1806)",
  "Batalla de Santo Domingo": "Batalla naval de Santo Domingo (1806)",
  "Batalla de Santo Domingo (1806)": "Batalla naval de Santo Domingo (1806)",
  "Batalla naval de San Domingo": "Batalla naval de Santo Domingo (1806)",
  "Battle of San Domingo": "Batalla naval de Santo Domingo (1806)",
  "Duckworth's Action off San Domingo": "Batalla naval de Santo Domingo (1806)",
  "Bataille de Saint-Domingue": "Batalla naval de Santo Domingo (1806)"
};

export const SANTO_DOMINGO_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": ["Batalla naval de Santo Domingo (1806)"],
  "Rep\u00fablica Dominicana": ["Batalla naval de Santo Domingo (1806)"]
};

export const SANTO_DOMINGO_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Santo Domingo (1806)": santoDomingoFix()
};
