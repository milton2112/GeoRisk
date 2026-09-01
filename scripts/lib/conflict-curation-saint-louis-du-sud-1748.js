function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Acci\u00f3n naval de Saint-Louis-du-Sud (marzo de 1748)";
const PARENT = "Guerra de Sucesi\u00f3n Austriaca (1740-1748)";
const CAMPAIGN = "Campa\u00f1a de Charles Knowles en el Caribe (marzo-abril de 1748)";

const SOURCES = {
  ispan: source(
    "Institut de Sauvegarde du Patrimoine National de Haiti (ISPAN): boletin documental sobre Fort Saint-Louis, su captura por la escuadra de Knowles y la demolicion posterior de las defensas",
    "https://www.haiti.org/wp-content/uploads/2012/09/BULLETIN%20DE%20L%27ISPAN%20No%2015%20WEB.pdf"
  ),
  gladius: source(
    "Revista Gladius / Universidad de Sevilla: estudio sobre fortificacion y geoestrategia que situa el ataque de la escuadra de Knowles al castillo de Saint-Louis en marzo de 1748",
    "https://idus.us.es/server/api/core/bitstreams/453504bb-d20c-4460-acf2-32078a93b654/content"
  ),
  reading: source(
    "Universidad de Reading y The Journal of Imperial and Commonwealth History: investigacion sobre diplomacia intracaribena que confirma el ataque de Knowles a la fortaleza de Saint-Louis-du-Sud en 1748",
    "https://www.tandfonline.com/doi/abs/10.1080/03086534.2025.2608930"
  )
};

function saintLouisDuSud1748Fix() {
  const hierarchySources = [
    SOURCES.ispan,
    SOURCES.gladius,
    SOURCES.reading
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "accion naval y costera",
    conflictType: "colonial",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1748,
    endYear: 1748,
    region: "Bahia de Saint-Louis-du-Sud, Saint-Domingue francesa (actual Haiti), Caribe",
    normalizedRegion: "Saint-Louis-du-Sud, Haiti",
    cause: "La extension caribena de la Guerra de Sucesion Austriaca enfrento intereses imperiales britanicos y franceses. La escuadra de Jamaica dirigida por Charles Knowles ataco el fuerte que protegia Saint-Louis-du-Sud, un punto costero de la colonia francesa de Saint-Domingue.",
    outcome: "Exito tactico britanico: la escuadra de Charles Knowles obtuvo la rendicion del fuerte de Saint-Louis. Las fuentes patrimoniales haitianas describen despues la demolicion de partes de sus defensas y el traslado de artilleria a Jamaica. GeoRisk no convierte la toma puntual del fuerte en una conquista territorial ni fija un total de bajas, naves o mandos cuando las fuentes no coinciden.",
    consequences: "La perdida temporal del fuerte expuso las limitaciones del sistema defensivo de Saint-Domingue y quedo asociada al refuerzo posterior de prioridades defensivas francesas en el Caribe. El episodio no produjo por si solo una anexion: el Tratado de Aquisgran cerro la guerra general en 1748.",
    chronology: [
      {
        year: 1740,
        event: "La Guerra de Sucesion Austriaca amplio la rivalidad entre potencias europeas hacia teatros coloniales y maritimos, incluido el Caribe."
      },
      {
        year: 1748,
        event: "Charles Knowles mando la estacion naval britanica de Jamaica y preparo una campana contra objetivos franceses y espanoles del Caribe."
      },
      {
        year: 1748,
        event: "En marzo, la escuadra britanica entro en la bahia de Saint-Louis-du-Sud y ataco el fuerte de la colonia francesa de Saint-Domingue. Las fuentes consultadas no coinciden en el dia exacto."
      },
      {
        year: 1748,
        event: "La guarnicion francesa rindio el fuerte; el boletin de patrimonio haitiano registra la salida de su artilleria hacia Jamaica y danos deliberados en las defensas."
      },
      {
        year: 1748,
        event: "El Tratado de Aquisgran cerro la Guerra de Sucesion Austriaca sin transformar esta accion costera en una transferencia territorial permanente."
      }
    ],
    treaties: [
      "Tratado de Aquisgran (1748): cierre general de la Guerra de Sucesion Austriaca"
    ],
    related: [
      PARENT,
      CAMPAIGN,
      "Saint-Louis-du-Sud",
      "Saint-Domingue",
      "Haiti",
      "Jamaica",
      "Fort Saint-Louis",
      "Charles Knowles",
      "Tratado de Aquisgran (1748)"
    ],
    participants: [
      {
        side: "Escuadra britanica de Jamaica",
        members: [
          "Reino de Gran Bretana",
          "Royal Navy",
          "estacion naval britanica de Jamaica",
          "escuadra de Charles Knowles",
          "Charles Knowles"
        ],
        casualties: "Las fuentes consultadas confirman el ataque y la rendicion del fuerte, pero no aportan una tabla bilateral consistente de muertos y heridos. GeoRisk no transforma recuentos divergentes de naves o efectivos en una cifra cerrada de bajas britanicas."
      },
      {
        side: "Guarnicion francesa de Fort Saint-Louis",
        members: [
          "Reino de Francia",
          "colonia francesa de Saint-Domingue",
          "Fort Saint-Louis",
          "guarnicion francesa local",
          "Louis-Marin Buttet de la Riviere"
        ],
        casualties: "El boletin patrimonial haitiano registra la rendicion y la salida de artilleria, pero las sintesis no coinciden en la composicion exacta de la guarnicion, sus mandos ni las perdidas humanas. GeoRisk conserva la captura del fuerte sin inventar una cifra de muertos, heridos o prisioneros."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "marzo de 1748; las fuentes consultadas discrepan entre el 19 y el 22 para el ataque",
    sourceDispute: "Las fuentes institucionales y academicas coinciden en que Knowles ataco y obtuvo la rendicion de Fort Saint-Louis en Saint-Louis-du-Sud durante marzo de 1748, pero no en el dia exacto: el boletin de ISPAN usa el 19 y el estudio de Gladius el 22. Tambien varian los recuentos de naves, efectivos y la atribucion del mando frances local, por lo que la ficha evita cifras cerradas. Algunas fuentes en ingles llaman a este episodio Battle of Port Louis; GeoRisk lo separa de la accion distinta de Port Louis de 1799, ocurrida frente a Mauricio.",
    curationPriority: "alta",
    curationBatch: "source-backed-saint-louis-du-sud-1748-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior figuraba como Batalla de Saint-Louis-du-Sud solo en Francia y bajo un conflicto regional de Europa, sin fecha, contraparte, lugar, jerarquia, resultado ni fuentes. Se normaliza como Accion naval de Saint-Louis-du-Sud (marzo de 1748), se ubica en la actual Haiti y se integra en la Guerra de Sucesion Austriaca. Haiti y Reino Unido se agregan solo como referencias de navegacion del mapa actual; los participantes conservan la colonia y las entidades historicas de 1748. La correccion deja visible la disputa de fecha y mando, y evita confundirla con Port Louis de 1799."
  };
}

export const SAINT_LOUIS_DU_SUD_1748_CONFLICT_RENAMES = {
  "Batalla de Saint-Louis-du-Sud": CANONICAL,
  "Batalla de Saint Louis du Sud": CANONICAL,
  "Accion naval de Saint-Louis-du-Sud": CANONICAL,
  "Acci\u00f3n naval de Saint-Louis-du-Sud": CANONICAL,
  "Accion naval de Saint-Louis-du-Sud (marzo de 1748)": CANONICAL,
  "Acci\u00f3n naval de Saint-Louis-du-Sud (marzo de 1748)": CANONICAL,
  "Battle of Saint-Louis-du-Sud": CANONICAL,
  "Battle of Port Louis (1748)": CANONICAL
};

export const SAINT_LOUIS_DU_SUD_1748_COUNTRY_CONFLICT_ADDITIONS = {
  "Hait\u00ed": [CANONICAL],
  "Reino Unido": [CANONICAL]
};

export const SAINT_LOUIS_DU_SUD_1748_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: saintLouisDuSud1748Fix()
};
