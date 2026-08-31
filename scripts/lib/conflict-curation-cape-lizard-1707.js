function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval del cabo Lizard (1707)";
const PARENT = "Guerra de Sucesi\u00f3n Espa\u00f1ola";
const CAMPAIGN = "Operaciones francesas contra convoyes ingleses en el canal de la Mancha (1707)";

const SOURCES = {
  royalMuseumsGreenwich: source(
    "Royal Museums Greenwich: catalogo de la estampa del combate, fecha de la accion el 21 de octubre de 1707, fecha impresa enga\u00f1osa del 21 de septiembre y destino de Devonshire, Cumberland, Chester, Ruby y Royal Oak",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-138738"
  ),
  marinersMuseum: source(
    "The Mariners' Museum and Park: contexto de la Guerra de Sucesion Espanola, convoy de Plymouth a Portugal, escuadras de Rene Duguay-Trouin y Claude de Forbin, escolta de Richard Edwards y resultado de los cinco buques de guerra",
    "https://catalogs.marinersmuseum.org/object/CL15054"
  )
};

function capeLizard1707Fix() {
  const hierarchySources = [
    SOURCES.royalMuseumsGreenwich,
    SOURCES.marinersMuseum
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
    startYear: 1707,
    endYear: 1707,
    region: "Frente al cabo Lizard, Cornualles, canal de la Mancha, Inglaterra",
    normalizedRegion: "Cabo Lizard, Cornualles, Reino Unido",
    cause: "Durante la Guerra de Sucesion Espanola, dos escuadras francesas al mando de Rene Duguay-Trouin y Claude de Forbin interceptaron frente al cabo Lizard un convoy ingles que habia salido de Plymouth hacia Portugal, protegido por la escolta de Richard Edwards.",
    outcome: "Victoria tactica francesa sobre la escolta: HMS Cumberland, HMS Chester y HMS Ruby fueron capturados; HMS Devonshire resistio hasta explotar y HMS Royal Oak logro escapar. GeoRisk no fija un total de mercantes capturados ni de bajas porque los recuentos posteriores no son uniformes y las fuentes institucionales revisadas no ofrecen una tabla bilateral comparable.",
    consequences: "La accion dano la proteccion inmediata del convoy ingles en una ruta estrategica hacia Portugal y confirmo la capacidad francesa de atacar escoltas en el canal de la Mancha. La ficha no la presenta como un tratado local ni atribuye a esta sola accion un efecto decisivo sobre el curso completo de la Guerra de Sucesion Espanola.",
    chronology: [
      {
        year: 1707,
        event: "El 20 de octubre, un convoy ingles salio de Plymouth rumbo a Portugal bajo la proteccion de Cumberland, Devonshire, Royal Oak, Chester y Ruby."
      },
      {
        year: 1707,
        event: "El 21 de octubre, las escuadras francesas de Rene Duguay-Trouin y Claude de Forbin interceptaron la escolta frente al cabo Lizard."
      },
      {
        year: 1707,
        event: "Cumberland, Chester y Ruby fueron capturados; Devonshire exploto durante la resistencia y Royal Oak escapo."
      },
      {
        year: 1707,
        event: "Royal Museums Greenwich advierte que una estampa lleva la fecha impresa del 21 de septiembre, anterior a la accion; GeoRisk conserva el 21 de octubre como fecha del combate."
      }
    ],
    treaties: [],
    related: [PARENT, CAMPAIGN, "Rene Duguay-Trouin", "Claude de Forbin", "Richard Edwards", "HMS Devonshire", "HMS Cumberland", "HMS Royal Oak", "cabo Lizard"],
    participants: [
      {
        side: "Escuadras francesas de Duguay-Trouin y Forbin",
        members: ["Francia", "Marina francesa", "Rene Duguay-Trouin", "Claude de Forbin", "dos escuadras francesas"],
        casualties: "Las fuentes institucionales consultadas permiten identificar la operacion y el resultado sobre los buques de escolta, pero no una tabla unica y comparable de bajas francesas y de la escolta inglesa."
      },
      {
        side: "Convoy ingles escoltado por Richard Edwards",
        members: ["Reino Unido", "Royal Navy", "comodoro Richard Edwards", "HMS Cumberland", "HMS Devonshire", "HMS Royal Oak", "HMS Chester", "HMS Ruby"],
        casualties: "HMS Devonshire exploto durante el combate y tres escoltas fueron capturados. GeoRisk no convierte los recuentos variables de muertos, heridos, mercantes o prisioneros de relatos posteriores en un total cerrado de bajas."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "21 de octubre de 1707",
    sourceDispute: "Royal Museums Greenwich fecha la accion el 21 de octubre de 1707 y advierte que una estampa conservada alli lleva impresa la fecha del 21 de septiembre, anterior al combate y por eso enga\u00f1osa. GeoRisk usa el 21 de octubre y deja visible esa discrepancia editorial. Los relatos posteriores tampoco coinciden de forma uniforme en el numero de mercantes interceptados ni en las bajas; la ficha documenta los destinos de las cinco escoltas que ambas fuentes institucionales identifican, sin convertir estimaciones divergentes en cifras cerradas. Reino Unido se incorpora como referencia de navegacion contemporanea para la escolta inglesa de 1707, no como una equivalencia institucional retrospectiva sin matices.",
    curationPriority: "alta",
    curationBatch: "source-backed-cape-lizard-1707-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior aparecia solo en Francia, sin fecha, contraparte, lugar, guerra, campana ni resultado verificable y bajo un conflicto regional generico. Se normaliza como Batalla naval del cabo Lizard (1707), se vincula con la Guerra de Sucesion Espanola y se agrega Reino Unido para que la ficha, el mapa y las busquedas puedan navegar ambos lados. La correccion distingue la fecha real de una fecha impresa erronea y evita inventar totales de mercantes o bajas."
  };
}

export const CAPE_LIZARD_1707_CONFLICT_RENAMES = {
  "Batalla del cabo Lizard": CANONICAL,
  "Batalla del Cabo Lizard": CANONICAL,
  "Batalla naval del cabo Lizard": CANONICAL,
  "Batalla naval del cabo Lizard (1707)": CANONICAL,
  "Batalla de Lizard Point": CANONICAL,
  "Battle at The Lizard": CANONICAL,
  "Battle of Cape Lizard": CANONICAL,
  "Combat du Cap Lezard": CANONICAL
};

export const CAPE_LIZARD_1707_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": [CANONICAL]
};

export const CAPE_LIZARD_1707_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: capeLizard1707Fix()
};
