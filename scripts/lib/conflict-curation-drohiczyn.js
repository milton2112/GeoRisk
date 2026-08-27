function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  branskArchive: source(
    "Archivo Municipal de Bransk: monografia historica con la cronica de Kadlubek y bibliografia moderna sobre el control de Drohiczyn por Casimiro II en 1192",
    "https://archiwum.bransk.um.gov.pl/images/Zbigniew-Romaniuk-BRANSK-monografia-miasta-t1-1.pdf"
  ),
  polishEncyclopedia: source(
    "Enciclopedia polaca: ficha de la batalla de Drohiczyn de 1192, victoria de las fuerzas de Casimiro II sobre rusinos aliados con yotvingios",
    "https://www.xn--meb.pisz.pl/Bitwa_pod_Drohiczynem_%281192%29",
    "media"
  ),
  yotvingianStudy: source(
    "Estudio historico sobre los yotvingios: campana de Casimiro II de 1192 y toma de Drohiczyn",
    "https://sbc.org.pl/Content/780141/iii149121-1952-02-0001.pdf",
    "media"
  )
};

function drohiczynFix() {
  const parent = "Expedicion de Casimiro II contra Drohiczyn y los yotvingios (1192)";
  const campaign = "Operaciones por el control de Drohiczyn en Podlaquia (1192)";
  const hierarchySources = [SOURCES.branskArchive, SOURCES.polishEncyclopedia, SOURCES.yotvingianStudy];

  return {
    parent,
    war: parent,
    campaign,
    type: "combate",
    conflictType: "frontera",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1192,
    endYear: 1192,
    region: "Drohiczyn, Podlaquia, Polonia actual",
    normalizedRegion: "Drohiczyn, Podlaquia, Polonia actual",
    cause: "La accion se vincula con la intervencion de Casimiro II el Justo sobre el control disputado de Drohiczyn y con las incursiones de grupos yotvingios en la frontera. Las fuentes asocian a un gobernante rus de Drohiczyn con ese contexto, pero no permiten identificar de forma definitiva a una sola persona ni convertir la accion en una guerra moderna entre estados nacionales.",
    outcome: "Las sintesis revisadas coinciden en una victoria de las fuerzas de Casimiro II y en la recuperacion o sometimiento de Drohiczyn. Los relatos no son uniformes sobre si el episodio debe describirse como batalla campal, derrota de una fuerza local o rendicion tras sitio; por eso la ficha no fija fuerzas, bajas, una secuencia tactica ni una jefatura rival individual.",
    consequences: "La accion reforzo el control de Casimiro II sobre Drohiczyn y la frontera de Podlaquia en el corto plazo. No se presenta como una anexion permanente de un estado moderno ni como el cierre de una guerra formal, pues el estatuto territorial y las relaciones polaco-rutenas siguieron cambiando en las decadas posteriores.",
    chronology: [
      { year: 1192, event: "Las fuentes locales y las sintesis historicas situan una expedicion de Casimiro II el Justo hacia Drohiczyn en el contexto de conflictos con grupos yotvingios y poderes rusinos vecinos." },
      { year: 1192, event: "La resistencia vinculada a Drohiczyn fue derrotada o sometida; la tradicion historiografica alterna entre combate y sitio, sin una cronologia tactica comun." }
    ],
    treaties: [],
    related: [parent, campaign, "Casimiro II el Justo", "Drohiczyn", "Podlaquia", "Yotvingios", "Rus de Kiev", "Polonia"],
    participants: [
      {
        side: "Fuerzas de Casimiro II el Justo",
        members: ["Polonia", "Ducado de Cracovia", "Casimiro II el Justo"],
        casualties: "No consolidado en las fuentes revisadas"
      },
      {
        side: "Fuerzas vinculadas a Drohiczyn y grupos yotvingios",
        members: ["Yotvingios", "Rus de Kiev"],
        casualties: "No consolidado; las fuentes no permiten una cifra ni un mando individual fiable"
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "1192; algunas sintesis secundarias asignan 1194 a la expedicion, por lo que no se fija dia ni mes",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-drohiczyn-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada sin fecha se normaliza como el episodio de 1192 asociado a Casimiro II, no como la batalla de 1238 contra la Orden de Dobrzyn ni como los combates de 1831 o 1920 del mismo lugar. Las fuentes coinciden en la campana y en el control final de Drohiczyn, pero difieren o son insuficientes sobre la fecha exacta, la condicion del gobernante rus local y si la accion fue una batalla campal o una rendicion despues de sitio. GeoRisk conserva la etiqueta combate, la fecha anual y el conflicto fronterizo, sin inventar bajas, efectivos, tratados ni una nacionalidad moderna para los participantes medievales no polacos."
  };
}

export const DROHICZYN_CONFLICT_RENAMES = {
  "Batalla de Drohiczyn": "Combate de Drohiczyn (1192)",
  "Batalla de Drohiczyn (1192)": "Combate de Drohiczyn (1192)",
  "Batalla de Drohiczyn (1194)": "Combate de Drohiczyn (1192)",
  "Batalla de Dorohychyn": "Combate de Drohiczyn (1192)",
  "Battle of Drohiczyn": "Combate de Drohiczyn (1192)",
  "Battle of Drohiczyn (1192)": "Combate de Drohiczyn (1192)"
};

export const DROHICZYN_CONFLICT_DETAIL_FIXES = {
  "Combate de Drohiczyn (1192)": drohiczynFix()
};
