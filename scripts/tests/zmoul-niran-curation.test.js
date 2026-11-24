import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";
import {
  ZMOUL_NIRAN_1984_CONFLICT_DETAIL_FIXES,
  ZMOUL_NIRAN_1984_COUNTRY_CONFLICT_ADDITIONS,
  ZMOUL_NIRAN_1984_CONFLICT_RENAMES
} from "../lib/conflict-curation-zmoul-niran-1984.js";

const NAME = "Combates del sector de Zag (13 de octubre de 1984)";
const WAR = "Guerra del Sahara Occidental";
const CAMPAIGN = "Ofensiva Grand Maghreb (1984)";
const REGION = "Sector de Zag, entre Khachbyine y Z'Moul Niran, Sahara Occidental";
const equivalent = (a, b) => normalizeConflictKey(a) === normalizeConflictKey(b);
const read = async file => JSON.parse(await fs.readFile(new URL(`../../${file}`, import.meta.url), "utf8"));

function check(detail) {
  assert.ok(detail, "the sourced Zag-sector action must survive generation");
  assert.equal(detail.parent, WAR);
  assert.equal(detail.war, WAR);
  assert.equal(detail.campaign, CAMPAIGN);
  assert.equal(detail.startYear, 1984);
  assert.equal(detail.endYear, 1984);
  assert.equal(detail.startDay, "1984-10-13");
  assert.equal(detail.endDay, "1984-10-13");
  assert.equal(detail.datePrecision, ZMOUL_NIRAN_1984_CONFLICT_DETAIL_FIXES[NAME].datePrecision);
  assert.equal(detail.type, "batalla");
  assert.equal(detail.conflictType, "independencia");
  assert.equal(detail.scale, "regional");
  assert.equal(isProvisionalConflictHierarchy(detail), false);
  assert.match(detail.region, /Zag.*Khachbyine.*Z'Moul Niran/);
  assert.equal(detail.normalizedRegion, REGION);
  assert.match(detail.cause, /Frente Polisario.*línea defensiva marroquí/);
  assert.match(detail.outcome, /no emerge un vencedor claro/);
  assert.match(detail.consequences, /no atribuyen.*cambio territorial/i);
  assert.match(detail.sourceDispute, /incompatibles.*No se convierten esos partes en un balance independiente/i);
  assert.equal(detail.participants.length, 2);
  assert.deepEqual(detail.participants[0].members, ["Marruecos", "Fuerzas Armadas Reales de Marruecos"]);
  assert.deepEqual(detail.participants[1].members, ["Frente Polisario", "Ejército de Liberación del Pueblo Saharaui"]);
  assert.ok(detail.participants.every(side => /no se consolidan/i.test(side.casualties)));
  assert.deepEqual(detail.treaties, []);
  assert.deepEqual(detail.hierarchySources.map(source => new URL(source.url).hostname), [
    "cinumedpub.mmsh.fr", "www.lemonde.fr", "elpais.com"
  ]);
}

assert.equal(ZMOUL_NIRAN_1984_CONFLICT_DETAIL_FIXES[NAME].startDay, "1984-10-13");
assert.equal(ZMOUL_NIRAN_1984_CONFLICT_RENAMES["Batalla de Z'Moul NIran"], NAME);
assert.equal(ZMOUL_NIRAN_1984_CONFLICT_RENAMES["Bataille de Z'Moul Niran"], NAME);
assert.equal(ZMOUL_NIRAN_1984_CONFLICT_RENAMES["Battle of Z'Moul Niran"], NAME);
assert.deepEqual(ZMOUL_NIRAN_1984_COUNTRY_CONFLICT_ADDITIONS["Sahara Occidental"], [NAME]);

const raw = await read("data/raw/conflicts.json");
assert.ok(raw.MAR.some(entry => entry.name === "batalla de Z'Moul Niran"), "preserve the original import");

const full = await read("data/countries_full.json");
for (const code of ["MAR", "ESH"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    const matches = entries.filter(entry => equivalent(entry.name, NAME));
    assert.equal(matches.length, 1, `${code} should expose the action once`);
    check(matches[0]);
    assert.equal(entries.some(entry => equivalent(entry.name, "Batalla de Z'Moul NIran")), false);
  }
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`)
    : profile.military.conflicts;
  assert.equal(entries.filter(entry => equivalent(entry.name, NAME)).length, 1);
  assert.equal(entries.find(entry => equivalent(entry.name, NAME)).hierarchySources, undefined,
    "deep source evidence stays deferred");
}

const generated = await read("data/conflict_details.generated.json");
check(Object.entries(generated.conflicts).find(([name]) => equivalent(name, NAME))?.[1]);
const detailsIndex = await read("data/conflicts/details_index.json");
const refs = detailsIndex.conflicts.filter(entry => equivalent(entry.name, NAME));
assert.equal(refs.length, 1);
check(await read(refs[0].path));

const conflictsIndex = await read("data/conflicts_index.json");
const indexed = conflictsIndex.filter(entry => equivalent(entry.name, NAME));
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["ESH", "MAR"]);
assert.equal(indexed[0].startYear, 1984);
assert.equal(indexed[0].endYear, 1984);

const timeline = await read("data/timeline_index.json");
for (const country of ["MAR", "ESH"]) {
  assert.equal(timeline.filter(entry => entry.country === country && entry.year === 1984 && entry.title === NAME).length, 1);
}

const window = {};
vm.runInNewContext(await fs.readFile(new URL("../../app-conflict-aliases.js", import.meta.url), "utf8"), { window });
for (const alias of ["Batalla de Z'Moul NIran", "Bataille de Z'Moul Niran", "Battle of Z'Moul Niran"]) {
  assert.equal(window.GeoRiskConflictAliases.entries.find(([pattern]) => pattern.test(alias))?.[1], NAME);
}

const report = buildConflictAuditReport({ countries: full });
assert.equal(report.summary.provisional_parent, 3);
assert.equal(report.topAdvisories.some(entry => equivalent(entry.name, NAME)), false);
console.log("zmoul-niran-curation.test.js ok: dated 1984 Zag-sector action, competing reports and historical-territory profile");
