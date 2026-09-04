function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval de Texel (29 de junio de 1694)";
const PARENT = "Guerra de los Nueve A\u00f1os (1688-1697)";
const CAMPAIGN = "Operaciones navales francesas para asegurar convoyes de grano en el mar del Norte (1694)";

const SOURCES = {
  bnfAuthority: source(
    "Bibliotheque nationale de France, autoridad RAMEAU: identifica la batalla de Texel del 29 de junio de 1694 como victoria naval francesa de Jean Bart sobre una escuadra neerlandesa durante la Guerra de la Liga de Augsburgo",
    "https://catalogue.bnf.fr/ark%3A/12148/cb16760343j"
  ),
  dutchHeritageMass: source(
    "MaSS, Agencia Neerlandesa de Patrimonio Cultural: contexto de la guerra, detencion del convoy de grano, combate de la escuadra de Jean Bart, captura de Prins Friso, De Zeerijp y Stad en Lande, y llegada del convoy a Dunkerque",
    "https://mass.cultureelerfgoed.nl/texel-slag-bij"
  ),
  dbnlDeVries: source(
    "DBNL, referencia biografica de Hidde Sjoerds de Vries: mision de la escuadra neerlandesa, llegada de Jean Bart el 29 de junio, captura de la nave de de Vries y muerte posterior del comandante por sus heridas",
    "https://www.dbnl.org/tekst/molh003nieu03_01/molh003nieu03_01_2070.php"
  )
};

function texel1694Fix() {
  const hierarchySources = [
    SOURCES.bnfAuthority,
    SOURCES.dutchHeritageMass,
    SOURCES.dbnlDeVries
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
    startYear: 1694,
    endYear: 1694,
    region: "Mar del Norte, banco Breeveertien, entre Texel y Goeree, frente a la actual costa de los Paises Bajos",
    normalizedRegion: "Mar del Norte, entre Texel y Goeree, frente a los actuales Paises Bajos",
    cause: "Durante la Guerra de los Nueve A\u00f1os, Francia procuraba hacer llegar grano comprado en el Baltico en un contexto de escasez. Una escuadra neerlandesa al mando de Hidde de Vries detuvo el convoy; el 29 de junio, la fuerza francesa de Jean Bart entro en combate para asegurar su paso hacia Dunkerque.",
    outcome: "Victoria tactica francesa. La escuadra de Jean Bart abordo y capturo el Prins Friso, De Zeerijp y Stad en Lande; las fuentes neerlandesas consultadas indican que el convoy de grano llego despues a Dunkerque. La ficha registra el resultado de la accion, no una victoria decisiva por si sola en toda la Guerra de los Nueve A\u00f1os.",
    consequences: "La recuperacion del convoy mejoro el abastecimiento frances a corto plazo durante la escasez. Hidde de Vries fue herido, capturado y murio posteriormente en Dunkerque; el combate no puso fin a la Guerra de los Nueve A\u00f1os ni permite atribuir su desenlace general a una sola accion naval.",
    chronology: [
      {
        year: 1688,
        event: "Comenzo la Guerra de los Nueve A\u00f1os, conflicto europeo en cuyo marco Francia busco asegurar rutas y suministros maritimos."
      },
      {
        year: 1694,
        event: "En junio, una escuadra neerlandesa detuvo el convoy de grano destinado a Francia y lo inspecciono cerca de la costa neerlandesa."
      },
      {
        year: 1694,
        event: "El 29 de junio, Jean Bart ataco a la escuadra de Hidde de Vries en el banco Breeveertien, entre Texel y Goeree; Prins Friso, De Zeerijp y Stad en Lande fueron capturados."
      },
      {
        year: 1694,
        event: "El convoy de grano alcanzo Dunkerque tras la accion. Hidde de Vries, herido y prisionero, murio posteriormente alli."
      }
    ],
    treaties: [],
    related: [
      PARENT,
      CAMPAIGN,
      "Jean Bart",
      "Hidde de Vries",
      "Prins Friso",
      "De Zeerijp",
      "Stad en Lande",
      "Texel",
      "Goeree",
      "Dunkerque",
      "convoy de grano del Baltico"
    ],
    participants: [
      {
        side: "Escuadra francesa de Jean Bart",
        members: ["Reino de Francia", "Marina francesa", "Jean Bart", "Mignon", "Fortune"],
        casualties: "El parte de Jean Bart del 3 de julio declaro tres muertos y veintisiete heridos franceses, pero es un informe de uno de los mandos participantes. GeoRisk no lo presenta como un balance independiente ni como una cifra cerrada de la accion."
      },
      {
        side: "Escuadra neerlandesa de Hidde de Vries",
        members: ["Republica de los Siete Paises Bajos Unidos", "Hidde de Vries", "Prins Friso", "De Zeerijp", "Stad en Lande"],
        casualties: "Las fuentes revisadas confirman que Hidde de Vries resulto herido, fue capturado y murio despues en Dunkerque. Las cifras neerlandesas agregadas de muertos, heridos y prisioneros no son suficientemente homogeneas para publicarlas como total cerrado."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "29 de junio de 1694",
    sourceDispute: "El nombre Batalla de Texel tambien se usa para la accion de 1673 de la Tercera Guerra Anglo-Neerlandesa. Esta ficha corresponde solo al combate de 1694 entre la escuadra francesa de Jean Bart y la neerlandesa de Hidde de Vries, como precisan las fuentes de autoridad y patrimonio consultadas. El parte frances del 3 de julio comunica bajas propias y enemigas, pero no se usa para fijar totales bilaterales independientes. Las escoltas danesas y suecas del convoy no intervinieron en el combate y no se incorporan como beligerantes.",
    curationPriority: "alta",
    curationBatch: "source-backed-texel-1694-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa, Batalla de Texel, figuraba solo en Francia, sin fecha ni contraparte, y bajo Conflicto regional de Europa. Se normaliza como Batalla naval de Texel (29 de junio de 1694) dentro de la Guerra de los Nueve A\u00f1os. Reino de los Paises Bajos se agrega solo como referencia de navegacion contemporanea para la Republica de los Siete Paises Bajos Unidos y la geografia actual; no se presenta al Estado neerlandes moderno como beligerante de 1694. La campana es una agrupacion editorial de GeoRisk y no un titulo literal de las fuentes."
  };
}

export const TEXEL_1694_CONFLICT_RENAMES = {
  "Batalla de Texel": CANONICAL,
  "Batalla de Texel (1694)": CANONICAL,
  "Batalla naval de Texel": CANONICAL,
  "Battle of Texel (1694)": CANONICAL,
  "Battle of the Texel (1694)": CANONICAL,
  "Bataille du Texel (1694)": CANONICAL
};

export const TEXEL_1694_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino de los Pa\u00edses Bajos": [CANONICAL]
};

export const TEXEL_1694_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: texel1694Fix()
};
