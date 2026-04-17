window.GeoRiskTimelineConflicts = {
  getDefaultTimelineFilters() {
    return {
      timelineFilter: "all",
      timelineCentury: "all",
      timelineIntensity: "all",
      timelineRelevance: "all",
      conflictFilter: "all"
    };
  },
  buildConflictSummary(conflictGroups = []) {
    const wars = Array.isArray(conflictGroups) ? conflictGroups.length : 0;
    const battles = (conflictGroups || []).reduce((sum, group) => sum + ((group?.battles || []).length), 0);
    const ongoing = (conflictGroups || []).filter(group => group?.ongoing).length;
    return { wars, battles, ongoing };
  }
};
