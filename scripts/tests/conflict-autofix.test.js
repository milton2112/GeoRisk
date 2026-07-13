import assert from "node:assert/strict";
import { SAFE_CONFLICT_RENAMES, CURATED_CONFLICT_DETAIL_FIXES } from "../lib/conflict-autofix-rules.js";
import { WWII_1942_CONFLICT_DETAIL_FIXES, WWII_1942_SAFE_CONFLICT_RENAMES } from "../lib/conflict-curation-1942.js";
import { getContextualConflictName, THEATER_CONFLICT_DETAIL_FIXES, THEATER_SAFE_CONFLICT_RENAMES } from "../lib/conflict-curation-theater.js";
import {
  VISIBLE_MODERN_CONFLICT_DETAIL_FIXES,
  VISIBLE_MODERN_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-visible-modern.js";
import { curateConflictEntry } from "../lib/conflict-batch-curation.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";

assert.equal(SAFE_CONFLICT_RENAMES["Adriatic Campaign de World War II"], "Campana del Adriatico en la Segunda Guerra Mundial");
assert.equal(CURATED_CONFLICT_DETAIL_FIXES["Batalla de Saigon"].parent, "Guerra de Vietnam");
assert.equal(WWII_1942_SAFE_CONFLICT_RENAMES["Batalla de la BahÃƒÂ­a de Milne"], "Batalla de la Bahia de Milne");
assert.equal(WWII_1942_CONFLICT_DETAIL_FIXES["Batalla de Midway"].parent, "Segunda Guerra Mundial");
assert.equal(THEATER_SAFE_CONFLICT_RENAMES["Sullivan Expedition"], "Expedicion de Sullivan");
assert.equal(getContextualConflictName({ name: "Guerra del Pacifico", startYear: 1941 }), "Guerra del Pacifico de la Segunda Guerra Mundial");
assert.equal(THEATER_CONFLICT_DETAIL_FIXES["Intervencion en Siberia"].region, "Siberia");
assert.equal(VISIBLE_MODERN_SAFE_CONFLICT_RENAMES["Batalla de Cheonpyeong Valley"], "Batalla de Cheonpyeong");
assert.equal(VISIBLE_MODERN_SAFE_CONFLICT_RENAMES["Guerra de Malvinas (1982)"], "Guerra de las Malvinas");
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Cheonpyeong"].startYear, 1950);
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Cheonpyeong"].parent, "Guerra de Corea");
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Joybar"].startYear, 2011);
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Combate de Buenavista"].startYear, 1880);
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Combate de El Manzano"].parent, "Guerra del Pac\u00edfico");
assert.ok(
  Object.values(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES).every(detail => detail.hierarchyConfidence === "alta" && detail.hierarchySources?.[0]?.url),
  "la tanda visible debe conservar fuente y confianza especificas para cada jerarquia"
);

const curatedIntervention = curateConflictEntry({
  name: "Intervencion en Siberia",
  startYear: 1918,
  endYear: 1920,
  conflictType: "intervencion"
});
assert.equal(curatedIntervention.conflictType, "intervencion", "la curaduria no debe pisar tipos explicitos");
assert.equal(curatedIntervention.curationStatus, "estructural");
assert.equal(curatedIntervention.dataConfidence, "parcial");

const structuralBattle = curateConflictEntry({
  name: "Batalla de Prueba",
  startYear: 1777,
  endYear: 1777,
  type: "batalla"
}, { country: { name: "Pais A", continent: "America" } });
assert.match(structuralBattle.cause, /Accion militar de 1777/);
assert.ok(!/pendiente|requiere ampliacion|disputa militar o politica/i.test(structuralBattle.cause));

const refreshedPlaceholder = curateConflictEntry({
  name: "Campana de Prueba",
  startYear: 1800,
  endYear: 1801,
  cause: "Disputa militar o politica asociada a America.",
  outcome: "Resultado pendiente de curaduria especifica; registrado como evento historico verificado por presencia en el dataset.",
  consequences: "Impacto militar y politico localizado en America; requiere ampliacion historiografica fina."
}, { country: { name: "Pais A", continent: "America" } });
assert.ok(!/resultado pendiente|requiere ampliacion|disputa militar o politica/i.test([
  refreshedPlaceholder.cause,
  refreshedPlaceholder.outcome,
  refreshedPlaceholder.consequences
].join(" ")));

const accentMatchedSpecialMetadata = curateConflictEntry({
  name: "Operaciones Temeraria y Persecución",
  ongoing: false
}, { country: { name: "Estados Unidos", continent: "America" } });
assert.equal(accentMatchedSpecialMetadata.startYear, 1944, "metadatos especiales deben matchear aunque varie el acento");
assert.equal(accentMatchedSpecialMetadata.parent, "Segunda Guerra Mundial");
assert.equal(accentMatchedSpecialMetadata.campaign, "Campaña de Nueva Guinea occidental");

const report = buildConflictAuditReport({
  countries: {
    USA: {
      name: "Estados Unidos",
      military: {
        conflicts: [
          { name: "Batalla de Saigon", startYear: 1955, endYear: 1955 },
          { name: "Batalla de Midway", startYear: 1942, endYear: 1942 },
          { name: "Batalla de Cheonpyeong Valley", startYear: 1951, endYear: 1951 },
          { name: "Adriatic Campaign de World War II", startYear: 1939, endYear: 1945 }
        ]
      }
    }
  },
  generatedDetails: { conflicts: {} }
});

const saigon = report.topIssues.find(item => item.name === "Batalla de Saigon");
assert.ok(!saigon?.issues.includes("battle_without_parent"), "Batalla de Saigon debe tener padre curado");

const adriatic = report.topIssues.find(item => item.name === "Adriatic Campaign de World War II");
assert.ok(!adriatic, "Los renombres seguros deben canonicalizarse antes de auditar duplicados");

const midway = report.topIssues.find(item => item.name === "Batalla de Midway");
assert.ok(!midway?.issues.includes("battle_without_parent"), "Batalla de Midway debe tener padre curado");

const cheonpyeong = [...report.topIssues, ...report.topAdvisories].find(item => item.name === "Batalla de Cheonpyeong");
assert.equal(cheonpyeong?.provisionalHierarchy, false, "Cheonpyeong debe dejar de usar una jerarquia provisional");
assert.equal(cheonpyeong?.hierarchyLabel, "Guerra de Corea", "Cheonpyeong debe auditarse bajo su guerra padre verificada");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Cheonpyeong"), "Cheonpyeong no debe seguir en la cola provisional");

console.log("conflict-autofix.test.js ok");
