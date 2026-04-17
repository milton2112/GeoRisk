window.GeoRiskCountryPanel = {
  getSectionDescriptors(language = "es") {
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
  },
  buildFallbackSummary(country) {
    const population = country?.general?.population || 0;
    const organizations = Array.isArray(country?.politics?.organizations) ? country.politics.organizations.length : 0;
    const conflicts = Array.isArray(country?.military?.conflicts) ? country.military.conflicts.length : 0;
    return {
      population,
      organizations,
      conflicts
    };
  }
};
