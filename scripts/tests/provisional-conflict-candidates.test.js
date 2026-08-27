import assert from "node:assert/strict";
import {
  DEFAULT_PROVISIONAL_CANDIDATE_LIMIT,
  DEFAULT_PROVISIONAL_CANDIDATE_TIMEOUT_MS,
  classifyWikipediaCandidate,
  extractCandidateYears,
  fetchProvisionalCandidateDetail,
  normalizeCandidateTimeout,
  selectProvisionalCandidateBatch,
  toWikipediaPageUrl
} from "../auditProvisionalConflictCandidates.js";
import { sanitizeWikipediaConflictDetail } from "../lib/wikipedia-conflicts.js";

assert.deepEqual(extractCandidateYears("14 de febrero de 1719 - 8 de marzo de 1720"), {
  startYear: 1719,
  endYear: 1720
});
assert.deepEqual(extractCandidateYears("fecha no consolidada"), { startYear: null, endYear: null });
assert.equal(DEFAULT_PROVISIONAL_CANDIDATE_LIMIT, 10, "la auditoria por defecto debe revisar una tanda acotada");
assert.equal(DEFAULT_PROVISIONAL_CANDIDATE_TIMEOUT_MS, 8000, "cada candidata debe tener un limite de red acotado");
assert.equal(normalizeCandidateTimeout("invalido", 3456), 3456, "un timeout invalido debe recuperar un valor seguro");
assert.deepEqual(
  selectProvisionalCandidateBatch(["a", "b", "c", "d"], { offset: 1, limit: 2 }),
  { candidates: ["b", "c"], offset: 1, total: 4, nextOffset: 3 },
  "la auditoria debe poder retomar una tanda desde un offset seguro"
);
assert.deepEqual(
  selectProvisionalCandidateBatch(["a", "b"], { offset: 9, limit: 10 }),
  { candidates: [], offset: 2, total: 2, nextOffset: null },
  "un offset fuera de rango debe terminar la auditoria sin volver a consultar candidatos"
);
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

let receivedAbortSignal = false;
await assert.rejects(
  fetchProvisionalCandidateDetail("Candidata lenta", {
    timeoutMs: 10,
    fetchDetail: async (_, { signal }) => {
      receivedAbortSignal = Boolean(signal);
      return new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      });
    }
  }),
  /excedio 10ms/
);
assert.equal(receivedAbortSignal, true, "la auditoria debe propagar cancelacion a la consulta activa");

console.log("provisional-conflict-candidates.test.js ok");
