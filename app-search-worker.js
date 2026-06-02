function normalizeText(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

self.addEventListener("message", event => {
  const { id, countries = [] } = event.data || {};
  const aliases = [];

  countries.forEach(country => {
    const code = country.code;
    [
      country.name,
      code,
      country.general?.officialName,
      ...(country.general?.historicalNames || [])
    ].filter(Boolean).forEach(label => {
      aliases.push({
        alias: normalizeText(label),
        label,
        type: "country",
        value: code
      });
    });
  });

  self.postMessage({ id, aliases });
});
