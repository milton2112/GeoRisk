import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../prepareRelease.js", import.meta.url), "utf8");
const context = vm.createContext({});
vm.runInContext(source.slice(source.indexOf("function buildDefaultReleaseNotes("), source.indexOf("function runStep(")), context);
const update = context.updateChangelog;
const old = "## v1.2.2 - 2026-10-01\n\n- Historical notes and source links must survive.\n";
const placeholder = "## Sin publicar\n\n- Se documentaran aca los cambios posteriores a v1.2.3 antes de cerrar la siguiente version.\n\n";
const current = "## v1.2.3 - 2026-10-02\n\n- Recorded evidence, costs and limitations.\n- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-10-02-release-1`.\n\n";
const stamp = "2026-10-04-release-3";
const sameDate = update("# Changelog\n\n" + placeholder + current.replace("2026-10-02\n", "2026-10-04\n") + old, "1.2.3", stamp, "2026-10-04");
assert.ok(sameDate.includes("- Recorded evidence, costs and limitations."), "preparing an already dated release must not replace its notes with defaults");
for (const newline of ["\n", "\r\n"]) {
  const input = ("# Changelog\n\n" + placeholder + current + old).replaceAll("\n", newline);
  const output = update(input, "1.2.3", stamp, "2026-10-04");
  assert.ok(output.includes("- Recorded evidence, costs and limitations."), "preparing an existing version must retain its documented evidence");
  assert.ok(output.includes(old), "earlier releases must remain unchanged");
  assert.equal((output.match(/## v1\.2\.3 - /g) || []).length, 1);
  assert.ok(output.includes("## v1.2.3 - 2026-10-04"));
  assert.ok(output.includes("`" + stamp + "`"));
  assert.ok(!output.includes("2026-10-02-release-1"));
  assert.equal(update(output, "1.2.3", stamp, "2026-10-04"), output, "repeated preparation is idempotent for notes");
  const pending = input.replace("- Se documentaran aca los cambios posteriores a v1.2.3 antes de cerrar la siguiente version.", "- Newly verified change.");
  const combined = update(pending, "1.2.3", stamp, "2026-10-04");
  assert.ok(combined.includes("- Recorded evidence, costs and limitations."));
  assert.ok(combined.includes("- Newly verified change."), "LF and CRLF drafts both move to the release");
  assert.equal(update(combined, "1.2.3", stamp, "2026-10-04"), combined);
  const fresh = update("# Changelog\n\n## Sin publicar\n\n- Verified draft.\n\n" + old, "1.2.3", stamp, "2026-10-04");
  assert.ok(fresh.includes("- Verified draft."));
  assert.ok(fresh.includes(old));
  const empty = update("# Changelog\n\n" + placeholder + old, "1.2.3", stamp, "2026-10-04");
  assert.ok(empty.includes("- Prepara una nueva version de mantenimiento"));
}
console.log("Release notes: preserved evidence, LF/CRLF drafts, date/stamp updates and idempotence OK.");
