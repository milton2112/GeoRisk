import fs from "fs-extra";
import { sanitizeWikipediaConflictDetail } from "./lib/wikipedia-conflicts.js";

const CACHE_PATH = "./data/conflict_details.generated.json";

async function main() {
  if (!(await fs.pathExists(CACHE_PATH))) {
    throw new Error(`No se encontro ${CACHE_PATH}`);
  }

  const cache = await fs.readJson(CACHE_PATH);
  const source = cache?.conflicts || {};
  const cleaned = {};

  for (const [name, detail] of Object.entries(source)) {
    cleaned[name] = sanitizeWikipediaConflictDetail(detail);
  }

  await fs.writeJson(CACHE_PATH, {
    ...cache,
    _meta: {
      ...(cache?._meta || {}),
      cleanedAt: new Date().toISOString()
    },
    conflicts: cleaned
  }, { spaces: 2 });

  console.log(`Wikipedia cache limpiado: ${Object.keys(cleaned).length} conflictos.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
