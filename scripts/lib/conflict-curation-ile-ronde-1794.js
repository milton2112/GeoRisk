function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const PARENT = "Guerras revolucionarias francesas (1792-1802)";
const CANONICAL = "Batalla naval de \u00cele Ronde (1794)";
const CAMPAIGN = "Operaciones navales anglo-francesas en el oc\u00e9ano \u00cdndico (1794)";

const SOURCES = {
  royalCollectionTrust: source(
    "Royal Collection Trust: s\u00edntesis cartogr\u00e1fica de las Guerras revolucionarias francesas, sus dos coaliciones y su periodo 1792-1802",
    "https://col-militarymaps-frontend.rct.uk/french-revolutionary-wars-1792-1802"
  ),
  jamesNavalHistory: source(
    "William James, Historia naval de Gran Breta\u00f1a: relato de las operaciones brit\u00e1nicas y francesas de 1794 en el oc\u00e9ano \u00cdndico",
    "https://www.ibiblio.org/pha/USN/Navy/navalhistoryofgr01jameuoft.pdf"
  ),
  napoleonEmpire: source(
    "Napoleon & Empire: listado cronol\u00f3gico de batallas navales con la acci\u00f3n de \u00cele Ronde del 22 de octubre de 1794 y los mandos Renaud y Osborne",
    "https://www.napoleon-empire.org/en/list-naval-battles-empire.php",
    "media"
  )
};

function frenchRevolutionaryWarsFix() {
  const hierarchySources = [
    SOURCES.royalCollectionTrust,
    SOURCES.jamesNavalHistory
  ];

  return {
    type: "guerra",
    conflictType: "interestatal",
    scale: "internacional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1792,
    endYear: 1802,
    region: "Europa, Atl\u00e1ntico, Caribe y oc\u00e9ano \u00cdndico",
    normalizedRegion: "Europa y teatros mar\u00edtimos globales",
    cause: "Las guerras reunen los enfrentamientos surgidos de la Revoluci\u00f3n Francesa entre la Rep\u00fablica Francesa y coaliciones variables de potencias europeas. La competencia por seguridad, fronteras, rutas mar\u00edtimas, colonias e influencia hizo que el conflicto se extendiera m\u00e1s all\u00e1 de Europa.",
    outcome: "No tuvieron un solo frente ni una coalici\u00f3n constante. La Rep\u00fablica Francesa sobrevivi\u00f3 y obtuvo ventajas frente a las dos grandes coaliciones del periodo; los tratados de Lun\u00e9ville y Amiens cerraron la fase revolucionaria que esta ficha organiza entre 1792 y 1802.",
    consequences: "El ciclo reorden\u00f3 fronteras, alianzas y espacios de poder en Europa y en los teatros mar\u00edtimos. La paz fue breve: la ruptura de Amiens abri\u00f3 una fase posterior que la ficha mantiene separada como Guerras napole\u00f3nicas.",
    chronology: [
      {
        year: 1792,
        event: "La guerra de la Francia revolucionaria contra Austria abri\u00f3 la Primera Coalici\u00f3n y el ciclo que esta ficha agrupa como Guerras revolucionarias francesas."
      },
      {
        year: 1793,
        event: "Gran Breta\u00f1a entr\u00f3 en guerra con Francia; la competencia se extendi\u00f3 a rutas navales, colonias y posesiones de ultramar."
      },
      {
        year: 1798,
        event: "La Segunda Coalici\u00f3n reagrup\u00f3 a adversarios de Francia en nuevas campa\u00f1as europeas y mar\u00edtimas."
      },
      {
        year: 1801,
        event: "El Tratado de Lun\u00e9ville cerr\u00f3 la guerra entre Francia y Austria dentro de la Segunda Coalici\u00f3n."
      },
      {
        year: 1802,
        event: "El Tratado de Amiens estableci\u00f3 una paz temporal entre Francia y Gran Breta\u00f1a, usada por esta ficha como cierre de la fase revolucionaria."
      }
    ],
    treaties: ["Tratado de Lun\u00e9ville (1801)", "Tratado de Amiens (1802)"],
    related: ["Primera Coalici\u00f3n", "Segunda Coalici\u00f3n", "Tratado de Lun\u00e9ville (1801)", "Tratado de Amiens (1802)"],
    participants: [
      {
        side: "Rep\u00fablica Francesa y aliados seg\u00fan el frente",
        members: ["Rep\u00fablica Francesa", "fuerzas armadas francesas", "rep\u00fablicas y aliados vinculados a Francia seg\u00fan la campa\u00f1a"],
        casualties: "No consolidado: las bajas dependen de frentes, coaliciones y periodizaciones diferentes; la ficha padre no las suma como un total homog\u00e9neo."
      },
      {
        side: "Coaliciones y adversarios de Francia",
        members: ["Reino de Gran Breta\u00f1a", "Austria", "Prusia", "Rusia", "otros Estados y fuerzas de coalici\u00f3n seg\u00fan el frente"],
        casualties: "No consolidado: los miembros, periodos de participaci\u00f3n y recuentos cambian entre la Primera y la Segunda Coalici\u00f3n."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "1792-1802; agrupaci\u00f3n hist\u00f3rica que cierra con la Paz de Amiens",
    sourceDispute: "La periodizaci\u00f3n no es \u00fanica: algunos estudios cierran la guerra terrestre con Lun\u00e9ville en 1801 o separan de otro modo los teatros navales. GeoRisk usa 1792-1802 para distinguir las dos coaliciones revolucionarias de las Guerras napole\u00f3nicas posteriores, sin tratarlas como una sola campa\u00f1a ni como una alianza invariable.",
    curationPriority: "alta",
    curationBatch: "source-backed-ile-ronde-1794-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Esta ficha padre se agrega para que las acciones de 1792-1802 puedan abrir una jerarqu\u00eda navegable. Resume un ciclo multinacional y multiteatro: no convierte a todos los pa\u00edses contempor\u00e1neos implicados en beligerantes constantes ni agrega un total de bajas artificial."
  };
}

function ileRondeFix() {
  const hierarchySources = [
    SOURCES.jamesNavalHistory,
    SOURCES.napoleonEmpire,
    SOURCES.royalCollectionTrust
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
    startYear: 1794,
    endYear: 1794,
    region: "Aguas frente a \u00cele Ronde, al norte de \u00cele de France (actual Mauricio), oc\u00e9ano \u00cdndico",
    normalizedRegion: "Oc\u00e9ano \u00cdndico occidental, frente a la actual Mauricio",
    cause: "La escuadra francesa de \u00cele de France sali\u00f3 para intentar interrumpir el bloqueo brit\u00e1nico de la isla. La acci\u00f3n form\u00f3 parte de la disputa anglo-francesa por rutas, abastecimiento y posiciones navales del oc\u00e9ano \u00cdndico durante las Guerras revolucionarias francesas.",
    outcome: "Resultado t\u00e1ctico no concluyente el 22 de octubre de 1794. Centurion y Cyb\u00e8le quedaron da\u00f1ados en el combate; la escuadra brit\u00e1nica se retir\u00f3 para reparaciones y no sostuvo el bloqueo de inmediato. La ficha registra por ello un alivio operativo franc\u00e9s del bloqueo, no una victoria decisiva que cerrara el teatro.",
    consequences: "La retirada brit\u00e1nica permiti\u00f3 aliviar temporalmente la presi\u00f3n sobre \u00cele de France. El episodio muestra que las Guerras revolucionarias francesas tambi\u00e9n se disputaron en el oc\u00e9ano \u00cdndico y no solo en Europa; no resolvi\u00f3 por s\u00ed mismo el control regional ni el conflicto mayor.",
    chronology: [
      {
        year: 1792,
        event: "Comenzaron las Guerras revolucionarias francesas, cuya rivalidad naval alcanz\u00f3 el oc\u00e9ano \u00cdndico."
      },
      {
        year: 1794,
        event: "En octubre, HMS Centurion y HMS Diomede operaban frente a \u00cele de France para bloquear la posici\u00f3n francesa."
      },
      {
        year: 1794,
        event: "El 22 de octubre, la escuadra de Jean-Marie Renaud se enfrent\u00f3 a los buques brit\u00e1nicos cerca de \u00cele Ronde."
      },
      {
        year: 1794,
        event: "Tras el combate, los buques da\u00f1ados se separaron; la fuerza brit\u00e1nica se retir\u00f3 para reparaciones y el bloqueo no continu\u00f3 de inmediato."
      }
    ],
    treaties: ["Tratado de Amiens (1802), cierre general posterior de las Guerras revolucionarias francesas"],
    related: [PARENT, CAMPAIGN, "\u00cele de France (actual Mauricio)", "HMS Centurion", "HMS Diomede", "Cyb\u00e8le", "Prudente", "Jean-Marie Renaud", "Samuel Osborne"],
    participants: [
      {
        side: "Escuadra naval francesa de \u00cele de France",
        members: ["Rep\u00fablica Francesa", "Marina francesa", "Jean-Marie Renaud", "fragatas Cyb\u00e8le y Prudente", "buques de apoyo franceses"],
        casualties: "No se consolida un total: los recuentos secundarios difieren entre res\u00famenes y \u00f3rdenes de batalla, en particular al incluir o no los buques menores."
      },
      {
        side: "Escuadra brit\u00e1nica de bloqueo",
        members: ["Reino de Gran Breta\u00f1a", "Royal Navy", "HMS Centurion", "HMS Diomede", "Samuel Osborne", "Matthew Smith"],
        casualties: "No se consolida un total: los recuentos secundarios de muertos y heridos no son uniformes y la ficha evita fijar una cifra definitiva para ambos bandos."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "22 de octubre de 1794",
    sourceDispute: "Los relatos consultados coinciden en fecha, lugar general, mandos principales, buques de bloqueo y retirada brit\u00e1nica para reparaciones. No coinciden por completo en el orden de batalla franc\u00e9s, los totales de bajas ni la etiqueta del resultado: varias s\u00edntesis lo llaman inconcluso y otras enfatizan que Francia logr\u00f3 aliviar el bloqueo. Por eso la ficha no fija bajas ni presenta el alivio operativo como una victoria decisiva. Mauricio aparece solo como referencia geogr\u00e1fica actual, no como beligerante de 1794.",
    curationPriority: "alta",
    curationBatch: "source-backed-ile-ronde-1794-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada previa no ten\u00eda fecha, jerarqu\u00eda, regi\u00f3n ni contraparte y quedaba bajo Conflicto regional de Europa. Se normaliza como Batalla naval de \u00cele Ronde (1794), se agrega una ficha navegable de la guerra padre y se enlazan Francia y Reino Unido por las fuerzas hist\u00f3ricas. Los aliases con y sin acento preservan la ficha diferida al regenerar."
  };
}

export const ILE_RONDE_1794_CONFLICT_RENAMES = {
  "Guerras revolucionarias francesas": PARENT,
  "Batalla de \u00cele Ronde": CANONICAL,
  "Batalla de Ile Ronde": CANONICAL,
  "Batalla naval de \u00cele Ronde": CANONICAL,
  "Batalla naval de Ile Ronde": CANONICAL,
  "Batalla naval de Ile Ronde (1794)": CANONICAL,
  "Battle of \u00cele Ronde": CANONICAL,
  "Battle of Ile Ronde": CANONICAL,
  "Bataille de l'\u00cele Ronde": CANONICAL,
  "Bataille de l'Ile Ronde": CANONICAL
};

export const ILE_RONDE_1794_CONFLICT_REFERENCE_RENAMES = {
  "Guerras revolucionarias francesas": PARENT,
  "Campana vinculada a Guerras revolucionarias francesas": `Campana vinculada a ${PARENT}`
};

export const ILE_RONDE_1794_COUNTRY_CONFLICT_ADDITIONS = {
  Francia: [PARENT, CANONICAL],
  "Reino Unido": [PARENT, CANONICAL]
};

export const ILE_RONDE_1794_CONFLICT_DETAIL_FIXES = {
  [PARENT]: frenchRevolutionaryWarsFix(),
  [CANONICAL]: ileRondeFix()
};
