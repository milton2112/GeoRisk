(() => {
  const CATEGORY_ALIASES = {
    acuerdo: "treaty",
    anexion: "annexation",
    annexation: "annexation",
    cambioregimen: "system",
    cambio_regimen: "system",
    conflicto: "conflict",
    constitucion: "constitution",
    constituyente: "constitution",
    coup: "coup",
    descolonizacion: "formation",
    division: "secession",
    economic: "economy",
    economia: "economy",
    guerra: "conflict",
    golpe: "coup",
    independencia: "secession",
    organization: "organization",
    politica: "system",
    regimen: "system",
    reforma: "system",
    revolucion: "formation",
    secesion: "secession",
    system: "system",
    tratado: "treaty",
    territorio: "annexation",
    union: "formation"
  };

  const CATEGORY_LABELS = {
    annexation: { es: "Anexiones", en: "Annexations" },
    constitution: { es: "Constituciones", en: "Constitutions" },
    conflict: { es: "Conflictos", en: "Conflicts" },
    coup: { es: "Golpes", en: "Coups" },
    economy: { es: "Economia", en: "Economy" },
    formation: { es: "Formacion", en: "Formation" },
    organization: { es: "Organizaciones", en: "Organizations" },
    secession: { es: "Independencias / secesiones", en: "Independence / secession" },
    system: { es: "Regimen / reforma", en: "Regime / reform" },
    treaty: { es: "Tratados", en: "Treaties" }
  };

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  function getDefaultTimelineFilters() {
    return {
      timelineFilter: "all",
      timelineCentury: "all",
      timelineIntensity: "all",
      timelineRelevance: "all",
      timelineMode: "full",
      conflictFilter: "all"
    };
  }

  function getCenturyKey(year) {
    const numericYear = Number(year);
    if (!Number.isFinite(numericYear)) return "";
    const century = Math.ceil(Math.abs(numericYear) / 100) || 1;
    return `${century}${numericYear < 0 ? " a.C." : ""}`;
  }

  function normalizeCategory(category, fallback = "formation") {
    const key = normalizeText(category);
    return CATEGORY_ALIASES[key] || key || fallback;
  }

  function getCategoryLabel(category, language = "es") {
    const key = normalizeCategory(category);
    return CATEGORY_LABELS[key]?.[language] || CATEGORY_LABELS[key]?.es || category || (language === "en" ? "Event" : "Evento");
  }

  function getEventIntensity(event) {
    if (event?.intensity) return event.intensity;
    const text = normalizeText(`${event?.category || ""} ${event?.text || ""} ${event?.reference || ""}`);
    if (/(guerra|conflicto|golpe|revolucion|independencia|anexion|secesion|world war)/.test(text)) return "alta";
    if (/(constitucion|tratado|reforma|crisis|regimen|organizacion|economia)/.test(text)) return "media";
    return "baja";
  }

  function getEventRelevance(event) {
    if (event?.relevance) return event.relevance;
    const category = normalizeCategory(event?.categoryKey || event?.category);
    if (["conflict", "constitution", "coup", "secession", "annexation"].includes(category)) return "alta";
    if (["system", "treaty", "economy"].includes(category)) return "media";
    return "baja";
  }

  function collectReferences(event) {
    return [
      event?.reference,
      event?.source,
      ...(Array.isArray(event?.references) ? event.references : [])
    ]
      .filter(Boolean)
      .map(item => String(item).trim())
      .filter((item, index, list) => item && list.indexOf(item) === index);
  }

  function connectRelatedConflicts(event, conflicts = []) {
    const eventText = normalizeText(`${event?.text || ""} ${event?.reference || ""}`);
    if (!eventText) return [];
    return conflicts
      .filter(conflict => {
        const name = normalizeText(conflict?.name || conflict?.reference || "");
        return name && eventText.includes(name);
      })
      .slice(0, 4)
      .map(conflict => conflict.name || conflict.reference)
      .filter(Boolean);
  }

  function normalizeTimelineEvent(event, context = {}) {
    const categoryKey = normalizeCategory(event?.categoryKey || event?.category);
    const text = String(event?.text || event?.reference || "").trim();
    return {
      ...event,
      categoryKey,
      category: event?.category || getCategoryLabel(categoryKey, context.language || "es"),
      century: event?.century || getCenturyKey(event?.year),
      intensity: getEventIntensity(event),
      relevance: getEventRelevance({ ...event, categoryKey }),
      references: collectReferences(event),
      relatedConflicts: Array.isArray(event?.relatedConflicts) ? event.relatedConflicts : connectRelatedConflicts(event, context.conflicts),
      text: text || (context.language === "en" ? "Event pending stronger description" : "Evento pendiente de descripcion mas precisa"),
      weakText: !text || text.length < 34
    };
  }

  function groupRepeatedEvents(items = []) {
    const groups = new Map();
    items.forEach(item => {
      const key = `${item.year}|${normalizeCategory(item.categoryKey)}|${normalizeText(item.reference || item.text)}`;
      const current = groups.get(key);
      if (!current) {
        groups.set(key, { ...item, groupedCount: 1, groupedCountries: item.countryName ? [item.countryName] : [] });
        return;
      }
      current.groupedCount += 1;
      if (item.countryName && !current.groupedCountries.includes(item.countryName)) {
        current.groupedCountries.push(item.countryName);
      }
    });
    return [...groups.values()];
  }

  function filterTimelineEvents(items = [], filters = {}) {
    const activeType = filters.timelineFilter || "all";
    const activeCentury = filters.timelineCentury || "all";
    const activeIntensity = filters.timelineIntensity || "all";
    const activeRelevance = filters.timelineRelevance || "all";
    return items.filter(item => (
      (activeType === "all" || item.categoryKey === activeType) &&
      (activeCentury === "all" || normalizeText(item.century) === normalizeText(activeCentury)) &&
      (activeIntensity === "all" || normalizeText(item.intensity) === normalizeText(activeIntensity)) &&
      (activeRelevance === "all" || normalizeText(item.relevance) === normalizeText(activeRelevance))
    ));
  }

  function getTimelineRenderWindow(items = [], options = {}) {
    const mode = options.mode || "full";
    const limit = Number(options.limit || (mode === "teaching" ? 12 : 72));
    const source = mode === "teaching"
      ? items.slice().sort((a, b) => {
          const score = value => ({ alta: 3, media: 2, baja: 1 }[normalizeText(value)] || 0);
          return score(b.relevance) - score(a.relevance) || score(b.intensity) - score(a.intensity) || (a.year || 0) - (b.year || 0);
        })
      : items;
    return {
      visible: source.slice(0, limit),
      hiddenCount: Math.max(source.length - limit, 0),
      total: source.length
    };
  }

  function getTimelineStats(items = []) {
    return items.reduce((stats, item) => {
      stats.total += 1;
      stats.byCategory[item.categoryKey] = (stats.byCategory[item.categoryKey] || 0) + 1;
      stats.byCentury[item.century] = (stats.byCentury[item.century] || 0) + 1;
      if (item.weakText) stats.weakText += 1;
      return stats;
    }, { total: 0, weakText: 0, byCategory: {}, byCentury: {} });
  }

  function buildConflictSummary(conflictGroups = []) {
    const wars = Array.isArray(conflictGroups) ? conflictGroups.length : 0;
    const battles = (conflictGroups || []).reduce((sum, group) => sum + ((group?.battles || []).length), 0);
    const ongoing = (conflictGroups || []).filter(group => group?.ongoing).length;
    return { wars, battles, ongoing };
  }

  window.GeoRiskTimelineConflicts = {
    getDefaultTimelineFilters,
    getCenturyKey,
    normalizeCategory,
    getCategoryLabel,
    normalizeTimelineEvent,
    groupRepeatedEvents,
    filterTimelineEvents,
    getTimelineRenderWindow,
    getTimelineStats,
    buildConflictSummary
  };
})();
