import assert from "node:assert/strict";
import {
  classifyWikipediaCandidate,
  extractCandidateYears,
  toWikipediaPageUrl
} from "../auditProvisionalConflictCandidates.js";
import { sanitizeWikipediaConflictDetail } from "../lib/wikipedia-conflicts.js";

assert.deepEqual(extractCandidateYears("14 de febrero de 1719 - 8 de marzo de 1720"), {
  startYear: 1719,
  endYear: 1720
});
assert.deepEqual(extractCandidateYears("fecha no consolidada"), { startYear: null, endYear: null });
assert.equal(
  toWikipediaPageUrl("Battle of Example", "en"),
  "https://en.wikipedia.org/wiki/Battle_of_Example"
);

const sanitized = sanitizeWikipediaConflictDetail({
  pageTitle: "Battle of Example",
  partOf: "Great Northern War",
  wikipedia: { language: "en", date: "1719" }
});
assert.equal(sanitized.partOf, "Great Northern War", "el importador debe conservar el campo Part of");

assert.deepEqual(
  classifyWikipediaCandidate(sanitized),
  {
    status: "listo_para_revision",
    pageTitle: "Battle of Example",
    language: "en",
    sourceUrl: "https://en.wikipedia.org/wiki/Battle_of_Example",
    date: "1719",
    partOf: "Great Northern War",
    startYear: 1719,
    endYear: 1719,
    region: "",
    outcome: ""
  }
);
assert.equal(classifyWikipediaCandidate({ pageTitle: "Sin padre", wikipedia: { date: "1719" } }).status, "revisar_padre");
assert.equal(
  classifyWikipediaCandidate({ pageTitle: "Padre vacio", partOf: "null", wikipedia: { date: "1719" } }).status,
  "revisar_padre",
  "un valor literal null no debe aprobar una jerarquia"
);

console.log("provisional-conflict-candidates.test.js ok");
