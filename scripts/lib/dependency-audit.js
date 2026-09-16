export function summarizeDependencyAudit({ stdout, status, signal, error }) {
  if (error || signal || ![0, 1].includes(status)) throw new Error("La auditoria npm no pudo completarse.");
  let result;
  try { result = JSON.parse(stdout); } catch { throw new Error("Respuesta npm audit invalida."); }
  const counts = result?.metadata?.vulnerabilities;
  const levels = ["info", "low", "moderate", "high", "critical"];
  if (result?.error || result?.auditReportVersion !== 2 || !counts ||
      [...levels, "total"].some(level => !Number.isSafeInteger(counts[level]) || counts[level] < 0) ||
      levels.reduce((total, level) => total + counts[level], 0) !== counts.total ||
      !result.vulnerabilities || typeof result.vulnerabilities !== "object" || Array.isArray(result.vulnerabilities)) {
    throw new Error("npm audit no devolvio un informe completo.");
  }
  const packages = Object.entries(result.vulnerabilities).map(([name, entry]) => ({
    name, severity: entry.severity, range: entry.range,
    advisories: (entry.via || []).filter(item => typeof item === "object").map(item => ({ title: item.title, url: item.url }))
  }));
  if (packages.length !== counts.total || (status !== 0 && counts.total === 0)) {
    throw new Error("npm audit devolvio un estado inconsistente.");
  }
  return { status: counts.total === 0 ? "passed" : "failed", counts, packages };
}
