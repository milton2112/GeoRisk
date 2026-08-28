function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  royalMuseumsLetterbook: source(
    "Royal Museums Greenwich: libro de cartas de Cloudesley Shovell sobre el desastre del convoy de Esmirna, identificado como la batalla de Lagos del 27 de junio de 1693",
    "https://www.rmg.co.uk/collections/archive/rmgc-object-633112"
  ),
  royalMuseumsPrint: source(
    "Royal Museums Greenwich: registro del grabado del combate naval de Lagos o Cadiz del 27 de junio de 1693 durante la Guerra de los Nueve A\u00f1os",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-128681"
  ),
  dutchHeritageSintPaulus: source(
    "Agencia del Patrimonio Cultural de los Pa\u00edses Bajos: historia del Sint Paulus y del convoy anglo-neerland\u00e9s de Esmirna frente a Lagos",
    "https://mass.cultureelerfgoed.nl/sint-paulus"
  )
};

const PARENT = "Guerra de los Nueve A\u00f1os (1688-1697)";
const CAMPAIGN = "Operaciones navales contra el convoy de Esmirna (1693)";

function lagos1693Fix() {
  const hierarchySources = [
    SOURCES.royalMuseumsLetterbook,
    SOURCES.royalMuseumsPrint,
    SOURCES.dutchHeritageSintPaulus
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
    startYear: 1693,
    endYear: 1693,
    region: "Aguas frente a Lagos, Algarve, costa sur de Portugal, oc\u00e9ano Atl\u00e1ntico",
    normalizedRegion: "Aguas frente a Lagos, Algarve, costa sur de Portugal, oc\u00e9ano Atl\u00e1ntico",
    cause: "Francia buscaba interceptar el convoy comercial anglo-neerland\u00e9s de Esmirna que se dirig\u00eda al Mediterr\u00e1neo durante la Guerra de los Nueve A\u00f1os. La fuerza francesa de Anne Hilarion de Tourville aguard\u00f3 al convoy frente a Lagos.",
    outcome: "Victoria operativa francesa el 27 de junio de 1693. La fuerza de Tourville derrot\u00f3 a la escolta anglo-neerlandesa de George Rooke y el convoy qued\u00f3 reducido aproximadamente a la mitad: las fuentes de Royal Museums Greenwich registran cerca de 90 mercantes perdidos, de los que 40 fueron capturados. La ficha no transforma esas p\u00e9rdidas de buques en una cifra humana de bajas.",
    consequences: "El convoy no alcanz\u00f3 plenamente sus objetivos de llevar comerciantes al Mediterr\u00e1neo y establecer presencia naval aliada all\u00ed. La p\u00e9rdida de buques se conserva como impacto comercial y naval, sin atribuir a la batalla por s\u00ed sola el cierre de la guerra.",
    chronology: [
      {
        year: 1688,
        event: "Comenz\u00f3 la Guerra de los Nueve A\u00f1os entre Francia y la coalici\u00f3n que inclu\u00eda a Inglaterra y las Provincias Unidas."
      },
      {
        year: 1693,
        event: "Se organiz\u00f3 el convoy de Esmirna para transportar mercantes ingleses y neerlandeses hacia el Mediterr\u00e1neo bajo escolta naval."
      },
      {
        year: 1693,
        event: "El 27 de junio, la flota francesa de Tourville intercept\u00f3 al convoy cerca de Lagos y derrot\u00f3 a su escolta anglo-neerlandesa."
      },
      {
        year: 1697,
        event: "El Tratado de Ryswick puso fin a la Guerra de los Nueve A\u00f1os."
      }
    ],
    treaties: ["Tratado de Ryswick (1697)"],
    related: [PARENT, CAMPAIGN, "Convoy de Esmirna", "Lagos", "Anne Hilarion de Tourville", "George Rooke", "Philips van der Goes", "Royal Navy", "Marina francesa"],
    participants: [
      {
        side: "Flota francesa",
        members: ["Reino de Francia", "Marina francesa", "Anne Hilarion de Tourville"],
        casualties: "No consolidadas: las fuentes empleadas permiten describir la derrota del convoy y las p\u00e9rdidas de mercantes, pero no una serie homog\u00e9nea de muertos y heridos franceses."
      },
      {
        side: "Escolta y convoy anglo-neerland\u00e9s de Esmirna",
        members: ["Reino de Inglaterra", "Rep\u00fablica de las Provincias Unidas", "Escuadra anglo-neerlandesa", "George Rooke", "Philips van der Goes", "Convoy de Esmirna"],
        casualties: "Royal Museums Greenwich registra alrededor de 90 mercantes perdidos y 40 capturados; no se convierte ese dato naval en una cifra humana de bajas ni se fijan p\u00e9rdidas de guerra adicionales sin fuente equivalente."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "27 de junio de 1693",
    sourceDispute: "Las fuentes consultadas coinciden en identificar el episodio como la batalla de Lagos vinculada al convoy de Esmirna, dentro de la Guerra de los Nueve A\u00f1os, y Royal Museums Greenwich fecha el combate el 27 de junio de 1693. Las cifras disponibles describen sobre todo la p\u00e9rdida y captura de mercantes; por eso la ficha no adopta totales de personal, n\u00famero de nav\u00edos de l\u00ednea ni recuentos de muertos y heridos derivados de relatos secundarios.",
    curationPriority: "alta",
    curationBatch: "source-backed-lagos-1693-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa se llamaba Batalla de Lagos, estaba asociada solo a Francia y pod\u00eda confundirse con la batalla naval de 1759. Se normaliza como Batalla naval de Lagos (1693) y se vincula a la Guerra de los Nueve A\u00f1os y al convoy de Esmirna. Francia, Reino Unido y Reino de los Pa\u00edses Bajos se a\u00f1aden por las fuerzas hist\u00f3ricas; Portugal se incorpora exclusivamente como ubicaci\u00f3n contempor\u00e1nea del Algarve, sin presentarlo como beligerante."
  };
}

export const LAGOS_1693_CONFLICT_RENAMES = {
  "Batalla de Lagos": "Batalla naval de Lagos (1693)",
  "Batalla de Lagos (1693)": "Batalla naval de Lagos (1693)",
  "Batalla de Lagos de 1693": "Batalla naval de Lagos (1693)",
  "Batalla naval de Lagos": "Batalla naval de Lagos (1693)",
  "Battle of Lagos (1693)": "Batalla naval de Lagos (1693)",
  "Battle of the Smyrna Convoy (1693)": "Batalla naval de Lagos (1693)",
  "Desastre del convoy de Esmirna": "Batalla naval de Lagos (1693)",
  "Combat naval de Lagos (1693)": "Batalla naval de Lagos (1693)",
  "Combat naval de Lagos ou de Cadiz (1693)": "Batalla naval de Lagos (1693)"
};

export const LAGOS_1693_COUNTRY_CONFLICT_ADDITIONS = {
  Francia: ["Batalla naval de Lagos (1693)"],
  Portugal: ["Batalla naval de Lagos (1693)"],
  "Reino Unido": ["Batalla naval de Lagos (1693)"],
  "Reino de los Pa\u00edses Bajos": ["Batalla naval de Lagos (1693)"]
};

export const LAGOS_1693_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de Lagos (1693)": lagos1693Fix()
};
