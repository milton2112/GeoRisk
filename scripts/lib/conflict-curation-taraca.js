const sources = [
  {
    label: "Leonard Wood, parte de la expedici\u00f3n de Taraca, 15 de abril de 1904; transcripci\u00f3n del archivo hist\u00f3rico del 22.\u00ba de Infanter\u00eda",
    url: "https://1-22infantry.org/history3/taraca.htm"
  },
  {
    label: "U.S. Army Center of Military History, U.S. Army Counterinsurgency and Contingency Operations Doctrine, 1860-1941, pp. 166-168: contexto colonial de las operaciones en Mindanao",
    url: "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/U%20Pdf/us-army-counterinsurgency-1.pdf"
  },
  {
    label: "U.S. Army Heritage and Education Center, Battle of San Jacinto: distingue el cierre formal de 1902 de la continuaci\u00f3n de la rebeli\u00f3n moro",
    url: "https://www.army.mil/article/47711/battle_of_san_jacinto"
  }
];

const name = "Expedicion de Taraca (1904)";
const parent = "Rebeli\u00f3n moro";
const campaign = "Operaciones estadounidenses en Lanao (1904)";
const region = "Valle del r\u00edo Taraca, lago Lanao, Mindanao, Filipinas";

export const TARACA_CONFLICT_RENAMES = {
  "Batalla de Taraca": name,
  "Battle of Taraca": name,
  "Expedici\u00f3n de Taraca (1904)": name,
  "Expedici\u00f3n de Taraka (1904)": name
};

export const TARACA_COUNTRY_CONFLICT_ADDITIONS = {
  "Estados Unidos": [name],
  "Filipinas": [name]
};

export const TARACA_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent, war: parent, campaign, related: [parent, campaign],
    startYear: 1904, endYear: 1904, datePrecision: "2-11 de abril de 1904; expedici\u00f3n principal",
    type: "campa\u00f1a", conflictType: "colonial", scale: "local",
    status: "historico", active: false, ongoing: false,
    region, normalizedRegion: region,
    cause: "Expansi\u00f3n del control colonial estadounidense sobre el valle de Taraca y resistencia de sus comunidades moro. Wood justific\u00f3 la expedici\u00f3n por ataques previos, armas retenidas y personas esclavizadas; esa justificaci\u00f3n corresponde al mando atacante.",
    outcome: "Las columnas estadounidenses ocuparon el valle y destruyeron fortificaciones. El sult\u00e1n de Maciu y Ami-Binaning no fueron capturados en la expedici\u00f3n principal.",
    consequences: "Se estableci\u00f3 una guarnici\u00f3n en Sapungan, en la desembocadura del Taraca. Continuaron operaciones posteriores; no fue el final de la resistencia moro.",
    participants: [
      {
        side: "Fuerzas coloniales estadounidenses",
        members: ["Estados Unidos", "Leonard Wood", "Marion P. Maus", "Unidades de los regimientos 17.\u00ba, 22.\u00ba y 23.\u00ba de Infanter\u00eda, 14.\u00ba de Caballer\u00eda y artiller\u00eda"],
        casualties: "El parte de Wood registra 2 muertos en combate, 1 ahogado y 11 heridos en la expedici\u00f3n principal; no incluye todas las acciones posteriores"
      },
      {
        side: "Resistencia moro de Taraca y Maciu",
        members: ["Sult\u00e1n de Maciu (Taraca)", "Ami-Binaning", "Defensores de las fortificaciones del valle"],
        casualties: "Sin total consolidado; los recuentos parciales estadounidenses no permiten establecer las bajas totales ni separar combatientes y civiles"
      }
    ],
    chronology: [
      { year: 1904, event: "El 2 de abril comenzaron el avance terrestre y el desembarco cerca de la desembocadura del Taraca." },
      { year: 1904, event: "Entre el 4 y el 9 de abril se ocuparon y destruyeron fortificaciones del valle; se instal\u00f3 la guarnici\u00f3n de Sapungan." },
      { year: 1904, event: "El 10-11 de abril regres\u00f3 el grueso de las tropas. El informe distingui\u00f3 esa expedici\u00f3n de las operaciones siguientes." }
    ],
    treaties: [], hierarchyConfidence: "alta", hierarchySources: sources,
    curationPriority: "alta", curationBatch: "source-backed-taraca-2026-09",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "La ubicaci\u00f3n es Mindanao, no Am\u00e9rica. La campa\u00f1a es una agrupaci\u00f3n descriptiva dentro de la rebeli\u00f3n moro, no una prolongaci\u00f3n sin matices de la guerra filipino-estadounidense de 1899-1902. Filipinas es el v\u00ednculo territorial, no un gobierno independiente beligerante en 1904. Las bajas se atribuyen al parte del mando estadounidense del 15 de abril y su alcance temporal: no se suman el combate posterior del 11 de abril ni la muerte de David P. Wheeler del 13 de abril. No se trasladan a la ficha las calificaciones coloniales del informe sobre la poblaci\u00f3n local."
  }
};
