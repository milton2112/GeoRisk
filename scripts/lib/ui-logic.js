export function getCountrySectionDescriptors(language = "es") {
  return [
    { id: "country-section-general", label: language === "en" ? "General" : "General" },
    { id: "country-section-history", label: language === "en" ? "History" : "Historia" },
    { id: "country-section-economy", label: language === "en" ? "Economy" : "Economia" },
    { id: "country-section-military", label: language === "en" ? "Military" : "Militar" },
    { id: "country-section-politics", label: language === "en" ? "Politics" : "Politica" },
    { id: "country-section-relations", label: language === "en" ? "Relations" : "Relaciones" },
    { id: "country-section-religion", label: language === "en" ? "Religion" : "Religion" },
    { id: "country-section-sources", label: language === "en" ? "Sources" : "Fuentes" }
  ];
}

export function getDefaultTimelineFilters() {
  return {
    timelineFilter: "all",
    timelineCentury: "all",
    timelineIntensity: "all",
    timelineRelevance: "all",
    conflictFilter: "all"
  };
}

export function buildConflictSummary(conflictGroups = []) {
  const groups = Array.isArray(conflictGroups) ? conflictGroups : [];
  return {
    wars: groups.length,
    battles: groups.reduce((sum, group) => sum + ((group?.battles || []).length), 0),
    ongoing: groups.filter(group => group?.ongoing).length
  };
}
