const name = "Combate contra Datu Ali (1905)";
const parent = "Rebeli\u00f3n moro";
const region = "R\u00edo Malala/Malola, distrito hist\u00f3rico de Cotabato, Mindanao, Filipinas, Asia sudoriental";

export const DATU_ALI_CONFLICT_RENAMES = {
  "Batalla del r\u00edo Malalag": name,
  "Batalla del rio Malalag": name,
  "Battle of the Malalag River": name,
  "Battle of the Malala River": name
};

export const DATU_ALI_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [name],
  Filipinas: [name]
};

export const DATU_ALI_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent, war: parent, campaign: "Expedici\u00f3n contra Datu Ali (1905)", related: [parent],
    startYear: 1905, endYear: 1905, datePrecision: "22 de octubre de 1905",
    type: "batalla", conflictType: "colonial", scale: "local",
    status: "historico", active: false, ongoing: false,
    region, normalizedRegion: region,
    cause: "Resistencia moro al dominio colonial estadounidense. La orden de octubre buscaba capturar a Datu Ali; se atribuye al mando atacante, no se adopta su justificaci\u00f3n como relato neutral.",
    outcome: "El relato regimental registra la muerte de Datu Ali durante el ataque de la fuerza de Frank R. McCoy a su rancher\u00eda.",
    consequences: "La muerte de su dirigente no cerr\u00f3 toda la rebeli\u00f3n moro: el U.S. Army Heritage and Education Center distingue su continuidad hasta 1913 del cierre formal de la guerra filipino-estadounidense en 1902.",
    participants: [
      {
        side: "Fuerza colonial estadounidense",
        members: ["Estados Unidos", "Compa\u00f1\u00eda provisional del 22.\u00ba de Infanter\u00eda", "Frank R. McCoy", "Philip Remington"],
        casualties: "Relato regimental: 1 muerto en el acto y 2 heridos, uno de los cuales falleci\u00f3 despu\u00e9s; no son 3 muertos"
      },
      {
        side: "Seguidores moro de Datu Ali",
        members: ["Datu Ali", "Defensores de su rancher\u00eda"],
        casualties: "Datu Ali muri\u00f3. Sin total consolidado de bajas de sus seguidores ni desglose fiable entre combatientes y civiles"
      }
    ],
    chronology: [{ year: 1905, event: "El 22 de octubre, la fuerza estadounidense atac\u00f3 la rancher\u00eda de Datu Ali; el dirigente muri\u00f3 en el combate." }],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      { label: "Archivo hist\u00f3rico del 22.\u00ba de Infanter\u00eda: transcripci\u00f3n de historia regimental (1922) y Army and Navy Register (6 de enero de 1906)", url: "https://www.1-22infantry.org/history3/ali.htm" },
      { label: "U.S. Army Heritage and Education Center, Battle of San Jacinto: contexto y continuidad de la rebeli\u00f3n moro tras 1902", url: "https://www.army.mil/article/47711/battle_of_san_jacinto" }
    ],
    sourceDispute: "La documentaci\u00f3n regimental emplea Malala/Malola. Malalag era el nombre importado; no basta para situar el combate en el municipio moderno de Malalag, Davao del Sur.",
    curationPriority: "alta", curationBatch: "source-backed-datu-ali-2026-10",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "Campa\u00f1a descriptiva, sin coordenadas modernas verificadas. Filipinas es v\u00ednculo territorial, no un gobierno independiente beligerante. Fuentes estadounidenses: no se adoptan sus calificaciones coloniales. Bajas atribuidas al relato regimental, no a una lectura independiente de los partes escaneados; no se inventa tratado."
  }
};
