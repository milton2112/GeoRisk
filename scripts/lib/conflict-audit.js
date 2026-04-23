const BLOCK_FALSE_POSITIVES = {
  post2000: new Set([
    "1919 Soviet invasion de Ukraine",
    "Crisis constitucional groenlandesa de 1940",
    "Crisis de Malaui de 1964",
    "Crisis fronteriza germano-polaca de 2025"
  ]),
  latin_america: new Set([
    "Ataque misilístico libio contra Lampedusa",
    "Campaña de Nils Bielke contra el Imperio otomano (1684-1687)",
    "Contraofensiva del Óblast de Járkov de 2022",
    "Expedición contra Quebec",
    "Guerra contra el Estado Islámico",
    "Guerra contra el terrorismo",
    "Guerra contra Segismundo",
    "Guerra de la Confederación de Colonia contra Dinamarca",
    "Resistencia popular argelina contra la invasión francesa"
  ])
};

const ENGLISH_CONFLICT_MARKERS = [
  "war of ",
  "war in ",
  "battle of ",
  "invasion of ",
  "campaign of ",
  "campaign ",
  "siege of ",
  "operation ",
  "raid on ",
  "raid in ",
  "conflict in ",
  "civil war",
  "front in "
];

export function isConflictAuditFalsePositive(block, name) {
  const set = BLOCK_FALSE_POSITIVES[block];
  return Boolean(set && set.has(name));
}

export function filterAuditConflicts(block, names) {
  return names.filter(name => !isConflictAuditFalsePositive(block, name));
}

export function getConflictNameIssues(name) {
  const text = String(name || "");
  const normalized = text.toLowerCase();
  const issues = [];

  if (/[ÃÂâ€]/.test(text)) {
    issues.push("mojibake");
  }
  if (ENGLISH_CONFLICT_MARKERS.some(marker => normalized.includes(marker))) {
    issues.push("english");
  }
  if (/^\d{4}\s+/.test(text)) {
    issues.push("leading_year");
  }
  if (/\s{2,}/.test(text)) {
    issues.push("spacing");
  }

  return issues;
}
