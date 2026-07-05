const CONFLICT_SUMMARY_FIELDS = [
  "name",
  "startYear",
  "endYear",
  "ongoing",
  "parent",
  "war",
  "campaign",
  "type",
  "conflictType",
  "scale",
  "normalizedRegion"
];
const DEFAULT_CONFLICT_PREVIEW_LIMIT = 36;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function compactConflictForCountryShard(conflict) {
  if (!conflict || typeof conflict !== "object") {
    return null;
  }

  const summary = Object.fromEntries(
    CONFLICT_SUMMARY_FIELDS
      .filter(field => conflict[field] !== undefined && conflict[field] !== null && conflict[field] !== "")
      .map(field => [field, conflict[field]])
  );
  if (summary.ongoing === false) delete summary.ongoing;
  if (summary.endYear === summary.startYear) delete summary.endYear;
  if (summary.war && summary.war === summary.parent) delete summary.war;
  if (/^Campana vinculada a\b/i.test(summary.campaign || "")) delete summary.campaign;
  if (summary.conflictType && summary.conflictType === summary.type) delete summary.conflictType;
  return summary;
}

export function getCountryConflictList(country) {
  return Array.isArray(country?.military?.conflicts)
    ? country.military.conflicts
    : (Array.isArray(country?.conflicts) ? country.conflicts : []);
}

export function buildPublicCountryConflictRecord(country) {
  return getCountryConflictList(country).map(compactConflictForCountryShard).filter(Boolean);
}

export function buildPublicCountryRecord(country, code = "") {
  const publicCountry = clone(country || {});
  const compactConflicts = buildPublicCountryConflictRecord(publicCountry);
  const conflictPreview = compactConflicts.slice(0, DEFAULT_CONFLICT_PREVIEW_LIMIT);
  const hasConflictShard = compactConflicts.length > conflictPreview.length;
  const countryCode = code || publicCountry.code || "";

  publicCountry.military = {
    ...(publicCountry.military || {}),
    conflicts: conflictPreview,
    conflictCount: compactConflicts.length,
    conflictsPreviewCount: conflictPreview.length,
    conflictsComplete: !hasConflictShard
  };
  if (hasConflictShard) {
    publicCountry.military.conflictsShard = `data/countries/conflicts/${countryCode}.json`;
  }
  delete publicCountry.conflicts;
  delete publicCountry.organizations;
  delete publicCountry.rivals;

  publicCountry.metadata = {
    ...(publicCountry.metadata || {}),
    publicProfile: {
      conflictsCompact: true,
      conflictsSharded: hasConflictShard,
      conflictPreviewLimit: DEFAULT_CONFLICT_PREVIEW_LIMIT,
      conflictPreviewCount: conflictPreview.length,
      conflictCount: compactConflicts.length
    }
  };

  return publicCountry;
}
