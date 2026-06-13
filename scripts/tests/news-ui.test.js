import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const source = await fs.readFile(path.join(process.cwd(), "app-news-ui.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);

const news = context.window.GeoRiskNewsUI;
const escapeHtml = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

assert.ok(news.buildSelectedCard, "noticias debe exponer tarjeta seleccionada");
assert.ok(news.buildStateCard, "noticias debe exponer estados de carga/vacio");
assert.ok(news.buildRelatedList, "noticias debe exponer titulares relacionados");
assert.ok(news.buildNewsList, "noticias debe exponer lista renderizable");

const country = { name: "Argentina", general: { officialName: "Republica Argentina" } };
const selected = news.buildSelectedCard(country, "<a>Google News</a>", escapeHtml, { topicLabel: "Diplomacia" });
assert.ok(selected.includes("Argentina"));
assert.ok(selected.includes("Diplomacia"));
assert.ok(selected.includes("Google News"));

const list = news.buildNewsList(
  [{ code: "ARG", country }, { code: "BRA", country: { name: "Brasil", general: {} } }],
  "ARG",
  escapeHtml,
  item => `https://news.example/search?q=${encodeURIComponent(item.name)}`,
  { openLabel: "Abrir busqueda externa" }
);
assert.ok(list.includes('data-news-country="ARG"'), "lista debe seleccionar pais dentro de la app");
assert.ok(list.includes("news-external-link"), "lista debe mantener busqueda externa separada");
assert.ok(list.includes("is-active"), "lista debe marcar pais activo");

const empty = news.buildNewsList([], "", escapeHtml, () => "#", { emptyLabel: "Sin resultados" });
assert.ok(empty.includes("Sin resultados"), "lista vacia debe tener estado claro");

const related = news.buildRelatedList(
  [
    { title: "Principal", source: "Fuente A" },
    { title: "Relacionado", source: "Fuente B", date: "13 jun 2026", url: "https://example.com/b" }
  ],
  escapeHtml,
  "https://example.com",
  "Mas titulares"
);
assert.ok(related.includes("Relacionado"));
assert.ok(related.includes("Fuente B"));

const article = news.buildArticleCard({
  title: "Titulo",
  summary: "Resumen",
  meta: "Fuente · fecha",
  actionLabel: "Abrir fuente",
  actionUrl: "https://example.com",
  relatedMarkup: related
});
assert.ok(article.includes("Abrir fuente"));
assert.ok(article.includes("Mas titulares"));

console.log("news-ui.test.js ok");
