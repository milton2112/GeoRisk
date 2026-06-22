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

export function buildPublicCountryRecord(country) {
  const publicCountry = clone(country || {});
  const conflicts = Array.isArray(publicCountry.military?.conflicts)
    ? publicCountry.military.conflicts
    : (Array.isArray(publicCountry.conflicts) ? publicCountry.conflicts : []);
  const compactConflicts = conflicts.map(compactConflictForCountryShard).filter(Boolean);

  publicCountry.military = {
    ...(publicCountry.military || {}),
    conflicts: compactConflicts,
    conflictCount: compactConflicts.length
  };
  delete publicCountry.conflicts;
  delete publicCountry.organizations;
  delete publicCountry.rivals;

  publicCountry.metadata = {
    ...(publicCountry.metadata || {}),
    publicProfile: {
      conflictsCompact: true,
      conflictCount: compactConflicts.length
    }
  };

  return publicCountry;
}
