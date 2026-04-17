export function normalizeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function hasValue(value) {
  return value !== undefined && value !== null && value !== "" && value !== "Sin datos";
}

export function hasMojibake(value) {
  return /[\u00C2\u00C3\uFFFD]/.test(String(value || ""));
}

export function isTerritoryLike(country = {}) {
  const system = String(country.politics?.system || country.general?.stateStructure || "").toLowerCase();
  const officialName = String(country.general?.officialName || country.name || "").toLowerCase();
  return [
    "territorio",
    "ultramar",
    "dependencia",
    "disputado",
    "protectorado",
    "tratado antartico",
    "no incorporado",
    "reconocimiento limitado"
  ].some(token => system.includes(token) || officialName.includes(token));
}
