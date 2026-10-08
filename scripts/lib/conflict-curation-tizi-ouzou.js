const name = "Batalla de Tizi Ouzou (1845)";
const parent = "Conquista francesa de Argelia";
const region = "Boukhalfa, entorno de Tizi Ouzou, valle del Sebaou, Cabilia, Argelia, Africa del Norte";

export const TIZI_OUZOU_CONFLICT_RENAMES = {
  "Batalla de Tizi Ouzou": name,
  "Battle of Tizi Ouzou": name
};

export const TIZI_OUZOU_COUNTRY_CONFLICT_ADDITIONS = {
  Francia: [name],
  Argelia: [name]
};

export const TIZI_OUZOU_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent, war: parent, campaign: "Operaciones en el valle del Sebaou (1845)", related: [parent],
    startYear: 1845, endYear: 1845,
    datePrecision: "Primeros dias de junio de 1845; sin dia exacto consolidado",
    type: "batalla", conflictType: "colonial", scale: "local",
    status: "historico", active: false, ongoing: false,
    region, normalizedRegion: region,
    cause: "Resistencia al dominio colonial frances en Cabilia y disputa por la autoridad en el valle del Sebaou.",
    outcome: "Robin describe la derrota de Bel-Kassem-ou-Kassi frente a contingentes locales aliados del poder colonial frances en Oulad-bou-Khalfa, a comienzos de junio de 1845.",
    consequences: "El relato registra la dispersion de sus contingentes de infanteria. La resistencia regional y las operaciones francesas continuaron; este encuentro no cerro la conquista de Cabilia.",
    participants: [
      {
        side: "Contingentes locales aliados del poder colonial frances",
        members: ["Goums reunidos por el agha Allal", "Contingentes de los Isser", "Contingentes de los Khachna"],
        casualties: "Sin recuento consolidado en la fuente consultada; no equivale a cero"
      },
      {
        side: "Resistencia local de Cabilia",
        members: ["Bel-Kassem-ou-Kassi", "Contingentes kabiles de su coalicion"],
        casualties: "Robin menciona muertos o heridos entre la infanteria, sin total consolidado"
      }
    ],
    chronology: [
      { year: 1845, event: "En mayo, Ben-Salem y Bel-Kassem-ou-Kassi movilizaron apoyos contra los jefes aliados de Francia en el Sebaou." },
      { year: 1845, event: "En los primeros dias de junio, Bel-Kassem-ou-Kassi fue derrotado en Oulad-bou-Khalfa, segun Robin." }
    ],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      { label: "Colonel Robin, Revue africaine 47, n. 248 (1903), cap. V, pp. 79-84: transcripcion OCR consultada en el archivo de la MMSH", url: "https://cinumedpub.mmsh.fr/RevueAfricaine/Pdf/1903_248_003.pdf" },
      { label: "Wikipedia: Battle Of Tizi Ouzou (1845), identificacion enciclopedica del episodio de Boukhalfa, no fuente primaria independiente", url: "https://en.wikipedia.org/wiki/Battle_Of_Tizi_Ouzou_(1845)" }
    ],
    sourceDispute: "La ficha enciclopedica resume una victoria francesa. Robin describe el choque entre contingentes locales y situa a Gentil en el col de Beni-Aicha; no acredita su intervencion directa ni la de Bugeaud en este encuentro.",
    curationPriority: "alta", curationBatch: "source-backed-tizi-ouzou-2026-10",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "Se sustituye la ubicacion europea inferida del enlace con Francia. Argelia vincula el territorio de Cabilia, no el Estado actual como bando de 1845. Robin es un relato colonial retrospectivo; no se consultaron sus documentos militares originales. Ben-Salem figura en el contexto regional, sin acreditar su presencia personal en este choque. La campana es descriptiva. No se fijan dia, efectivos completos, total de bajas ni tratado; las acciones posteriores de Gentil no se fusionan con este episodio."
  }
};
