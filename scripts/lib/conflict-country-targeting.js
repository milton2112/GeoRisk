export function normalizeCountryConflictKey(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/\s+/g, " ")
    .trim();
}

export function mergeCountryConflictBatches(batches = []) {
  return (Array.isArray(batches) ? batches : []).reduce((merged, batch) => {
    for (const [countryName, conflictNames] of Object.entries(batch || {})) {
      const key = normalizeCountryConflictKey(countryName);
      if (!key) {
        continue;
      }
      merged[key] = [...new Set([...(merged[key] || []), ...(Array.isArray(conflictNames) ? conflictNames : [])])];
    }
    return merged;
  }, {});
}

export function getCountryConflictNames(countryConflictMap = {}, countryName = "") {
  return countryConflictMap[normalizeCountryConflictKey(countryName)] || [];
}
