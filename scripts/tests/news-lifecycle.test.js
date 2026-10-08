import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const block = (start, end) => {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, "missing news lifecycle test boundary: " + start);
  return source.slice(from, to);
};
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
const tick = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

function harness() {
  const panel = { open: true };
  const article = { innerHTML: "", dataset: {} };
  const selected = { innerHTML: "" };
  const rendered = [];
  const context = vm.createContext({
    AbortController, DOMException, console, setTimeout, clearTimeout,
    activeNewsCountryCode: "", activeNewsTopic: "general", activeNewsRequest: null,
    currentLanguage: "es", newsUi: {},
    navigator: { onLine: true, connection: { saveData: false } },
    document: {
      visibilityState: "visible",
      getElementById: id => ({ "news-hub-panel": panel, "news-hub-article": article, "news-hub-selected": selected })[id],
      querySelector: () => null, querySelectorAll: () => []
    },
    countriesData: { ARG: { code: "ARG", name: "Argentina", general: {} }, BRA: { code: "BRA", name: "Brasil", general: {} } },
    ensureDeferredUiModule: async () => true, escapeHtml: value => String(value),
    getCountryNewsUrl: country => "https://example.com/" + country.code,
    getCountryNewsPortalLinks: () => [],
    getNewsTopicLabel: topic => topic,
    fetchCountryHeadlines: async () => [{ title: "Actual" }],
    renderNewsArticle: (item, country) => rendered.push([country.code, item?.title])
  });
  const helpers = source.includes("function renderNewsState(")
    ? block("function canLoadNewsHeadlines(", "function localizeNewsHeadlines(")
      + block("function renderNewsState(", "async function showNewsArticle(") : "";
  vm.runInContext(helpers + block("async function showNewsArticle(", "function renderNewsHub("), context);
  return { context, panel, article, selected, rendered };
}

for (const language of ["es", "en"]) {
  const { context, rendered, article } = harness();
  let externalCalls = 0;
  context.currentLanguage = language;
  context.ensureDeferredUiModule = async () => false;
  context.fetchCountryHeadlines = async () => { externalCalls++; return [{ title: "No solicitado" }]; };
  await context.showNewsArticle("ARG");
  assert.equal(externalCalls, 0, "a failed/expired news module must not start a third-party query");
  assert.deepEqual(rendered, []);
  assert.doesNotMatch(article.innerHTML, /aria-busy="true"/);
  assert.match(article.innerHTML, /data-news-country="ARG"/);
  assert.match(article.innerHTML, language === "en" ? /Headlines unavailable/ : /Titulares no disponibles/);
  assert.equal(context.activeNewsRequest, null);
  context.ensureDeferredUiModule = async () => true;
  await context.showNewsArticle("ARG");
  assert.equal(externalCalls, 1, "explicit recovery still requests headlines");
  assert.equal(rendered.length, 1);
}

for (const action of ["country", "topic", "language", "hidden", "close"]) {
  const { context, panel, article } = harness();
  const module = deferred();
  let externalCalls = 0;
  context.ensureDeferredUiModule = () => module.promise;
  context.fetchCountryHeadlines = async () => { externalCalls++; return []; };
  const pending = context.showNewsArticle("ARG");
  if (action === "country") context.activeNewsCountryCode = "BRA";
  if (action === "topic") context.activeNewsTopic = "economy";
  if (action === "language") context.currentLanguage = "en";
  if (action === "hidden") context.document.visibilityState = "hidden";
  if (action === "close") panel.open = false;
  article.innerHTML = "newer content";
  module.resolve(false);
  await pending;
  assert.equal(article.innerHTML, "newer content", action + ": a stale module error cannot replace the latest content");
  assert.equal(externalCalls, 0);
  assert.equal(context.activeNewsRequest, null);
}

{
  const { context, rendered } = harness();
  const old = deferred();
  context.fetchCountryHeadlines = country => country.code === "ARG" ? old.promise : Promise.resolve([{ title: "Brasil actual" }]);
  const first = context.showNewsArticle("ARG");
  await tick();
  await context.showNewsArticle("BRA");
  old.resolve([{ title: "Argentina tardia" }]);
  await first;
  assert.deepEqual(rendered, [["BRA", "Brasil actual"]], "a late country must never replace the latest selection");
}

for (const action of ["close", "hidden", "language"]) {
  const { context, panel, rendered } = harness();
  const held = deferred();
  context.fetchCountryHeadlines = () => held.promise;
  const pending = context.showNewsArticle("ARG");
  await tick();
  if (action === "close") panel.open = false;
  if (action === "hidden") context.document.visibilityState = "hidden";
  if (action === "language") context.currentLanguage = "en";
  held.resolve([{ title: "Respuesta obsoleta" }]);
  await pending;
  assert.deepEqual(rendered, [], action + " must invalidate an old rendering action");
  assert.equal(context.activeNewsRequest, null);
}

{
  const { context, rendered } = harness();
  const old = deferred();
  let oldSignal;
  context.fetchCountryHeadlines = (country, options) => {
    if (options.topic === "general") { oldSignal = options.signal; return old.promise; }
    return Promise.resolve([{ title: "Economia actual" }]);
  };
  const first = context.showNewsArticle("ARG");
  await tick();
  context.activeNewsTopic = "economy";
  await context.showNewsArticle("ARG");
  assert.equal(oldSignal.aborted, true, "changing topic cancels the old transport");
  old.resolve([{ title: "General tardia" }]);
  await first;
  assert.deepEqual(rendered, [["ARG", "Economia actual"]]);
}

{
  const { context, panel, rendered } = harness();
  const module = deferred();
  let calls = 0;
  context.ensureDeferredUiModule = () => module.promise;
  context.fetchCountryHeadlines = async () => { calls++; return [{ title: "Actual" }]; };
  const pending = context.showNewsArticle("ARG");
  panel.open = false;
  context.cancelNewsRequest();
  module.resolve(true);
  await pending;
  assert.equal(calls, 0, "closing while a deferred module loads must prevent the external request");
  assert.deepEqual(rendered, []);
}

{
  const { context } = harness();
  const held = deferred();
  let calls = 0;
  context.fetchCountryHeadlines = () => { calls++; return held.promise; };
  const pending = context.showNewsArticle("ARG");
  await tick();
  await context.showNewsArticle("ARG");
  assert.equal(calls, 1, "repeated taps during the same pending selection do not download twice");
  held.resolve([]);
  await pending;
}

function dataHarness() {
  const { context, panel, article, rendered } = harness();
  let now = 1000;
  let timerId = 0;
  const timers = new Map();
  const requests = [];
  context.Date = class extends Date { static now() { return now; } };
  context.URL = URL;
  context.newsCache = new Map();
  context.NEWS_CACHE_TTL_MS = 20 * 60 * 1000;
  context.MAX_NEWS_CACHE_ENTRIES = 16;
  context.uniqueNormalizedList = items => [...new Set(items.filter(Boolean))];
  context.formatNewsDate = (date, language) => language + ":" + date;
  context.getCountryNewsTopics = country => Object.fromEntries(["general", "economy"].map(topic => [topic, "https://example.com/" + country.code + "/" + topic]));
  context.setTimeout = (fn, ms) => { assert.equal(ms, 2500); timers.set(++timerId, fn); return timerId; };
  context.clearTimeout = id => timers.delete(id);
  context.fetch = async (url, options) => {
    requests.push({ url, signal: options.signal });
    return { ok: true, json: async () => ({ articles: articles() }) };
  };
  vm.runInContext(block("function getCountryNewsUrl(", "function getCountryNewsPortalLinks(")
    + block("function getNewsTopicLabel(", "function renderNewsArticle("), context);
  return {
    context, panel, article, rendered, requests, timers,
    advance(ms) { now += ms; },
    expireRequest() { const tasks = [...timers.values()]; for (const fn of tasks) fn(); }
  };
}

function articles() {
  return Array.from({ length: 4 }, (_, i) => ({
    title: "Titular " + i, url: "https://example.com/news/" + i,
    sourceCommonName: "Fuente", seendate: "20261002T120000Z"
  }));
}

function setupHarness(test) {
  const listeners = new Map();
  const on = owner => (type, handler) => listeners.set(owner + ":" + type, handler);
  const { context, panel } = test;
  const filter = { value: "", addEventListener: on("filter") };
  const topic = { value: "general", addEventListener: on("topic") };
  const getElementById = context.document.getElementById;
  const list = { innerHTML: "" };
  context.document.getElementById = id => id === "news-country-filter" ? filter
    : id === "news-topic-select" ? topic : id === "news-hub-list" ? list : getElementById(id);
  panel.addEventListener = on("panel");
  context.document.addEventListener = on("document");
  context.window = { addEventListener: on("window") };
  context.navigator.connection.addEventListener = on("connection");
  context.currentPanelState = { code: "ARG" };
  context.closeMobilePanels = () => {};
  vm.runInContext(block("function renderNewsHub(", "function setTheme("), context);
  vm.runInContext(block("function setupNewsHubPanel(", "function setupQuizHubPanel("), context);
  context.setupNewsHubPanel();
  panel.open = true;
  return { listeners, filter, topic };
}

for (const action of ["close", "hidden", "offline", "save-data"]) {
  const test = dataHarness();
  const { listeners } = setupHarness(test);
  const held = deferred();
  const signals = [];
  test.context.fetch = async (_, options) => {
    signals.push(options.signal);
    return { ok: true, json: () => held.promise };
  };
  const pending = test.context.showNewsArticle("ARG");
  await tick();
  if (action === "close") { test.panel.open = false; listeners.get("panel:toggle")(); }
  if (action === "hidden") { test.context.document.visibilityState = "hidden"; listeners.get("document:visibilitychange")(); }
  if (action === "offline") { test.context.navigator.onLine = false; listeners.get("window:offline")(); }
  if (action === "save-data") { test.context.navigator.connection.saveData = true; listeners.get("connection:change")(); }
  await pending;
  assert.equal(signals.length, 1);
  assert.equal(signals[0].aborted, true, action + " cancels the external response body");
  assert.equal(test.timers.size, 0);
  assert.equal(test.context.activeNewsRequest, null);
  assert.deepEqual(test.rendered, []);
  assert.equal(test.context.newsCache.size, 0);
  test.panel.open = true;
  test.context.document.visibilityState = "visible";
  test.context.navigator.onLine = true;
  test.context.navigator.connection.saveData = false;
  listeners.get("document:visibilitychange")();
  listeners.get("window:online")();
  listeners.get("connection:change")();
  assert.equal(signals.length, 1, "resuming never restarts an optional download automatically");
  assert.ok(!test.article.innerHTML.includes('aria-busy="true"'));
  held.resolve({ articles: articles() });
  await tick();
  assert.equal(test.context.newsCache.size, 0, "an aborted late body is not retained");
}

for (const action of ["close", "hidden"]) {
  const { context, panel, article, selected } = harness();
  const list = { innerHTML: "" };
  context.document.getElementById = id => ({ "news-hub-panel": panel, "news-hub-article": article,
    "news-hub-selected": selected, "news-hub-list": list })[id];
  context.countriesData = new Proxy({}, { ownKeys() { throw new Error("unneeded country traversal"); } });
  vm.runInContext(block("function renderNewsHub(", "function setTheme("), context);
  if (action === "close") panel.open = false;
  else context.document.visibilityState = "hidden";
  assert.doesNotThrow(() => context.renderNewsHub(), "closed/hidden news must not scan or sort countries");
}

for (const stage of ["headers", "body"]) {
  const test = dataHarness();
  const held = deferred();
  let signal;
  test.context.fetch = async (_, options) => {
    signal = options.signal;
    return stage === "headers" ? held.promise : { ok: true, json: () => held.promise };
  };
  const pending = test.context.fetchCountryHeadlines(test.context.countriesData.ARG);
  await tick();
  test.expireRequest();
  assert.equal((await pending).length, 0, stage + " cannot exceed the full-response deadline");
  assert.equal(signal.aborted, true);
  assert.equal(test.timers.size, 0, "deadline timers are removed on timeout");
  assert.equal(test.context.newsCache.size, 0, "a timeout must not suppress explicit retries for 20 minutes");
  held.resolve(stage === "headers" ? { ok: true, json: async () => ({ articles: articles() }) } : { articles: articles() });
  await tick();
}

{
  const test = dataHarness();
  const held = deferred();
  const controller = new AbortController();
  let childSignal;
  test.context.fetch = async (_, options) => {
    childSignal = options.signal;
    return { ok: true, json: () => held.promise };
  };
  const pending = test.context.fetchCountryHeadlines(test.context.countriesData.ARG, { signal: controller.signal });
  await tick();
  controller.abort();
  assert.equal((await pending).length, 0, "cancellation settles even if the body ignores abort");
  assert.equal(childSignal.aborted, true);
  assert.equal(test.timers.size, 0);
  assert.equal(test.context.newsCache.size, 0);
  held.resolve({ articles: articles() });
  await tick();
}

{
  const test = dataHarness();
  const controller = new AbortController();
  await test.context.fetchCountryHeadlines(test.context.countriesData.ARG, { signal: controller.signal });
  assert.equal(test.timers.size, 0);
  controller.abort();
  assert.equal(test.requests[0].signal.aborted, false, "a completed request removes its parent abort listener");
}

{
  const test = dataHarness();
  let bodyReads = 0;
  let signal;
  test.context.fetch = async (_, options) => {
    signal = options.signal;
    return { ok: false, json: async () => { bodyReads++; return { articles: articles() }; } };
  };
  assert.equal((await test.context.fetchCountryHeadlines(test.context.countriesData.ARG)).length, 0);
  assert.equal(bodyReads, 0, "HTTP errors do not consume or cache an error body");
  assert.equal(signal.aborted, true);
  assert.equal(test.context.newsCache.size, 0);
  assert.equal(test.timers.size, 0);
}

{
  const test = dataHarness();
  const country = test.context.countriesData.ARG;
  const spanish = await test.context.fetchCountryHeadlines(country, { topic: "economy", language: "es" });
  const english = await test.context.fetchCountryHeadlines(country, { topic: "economy", language: "en" });
  assert.equal(test.requests.length, 1, "language changes reuse raw headlines without another download");
  assert.match(spanish[0].summary, /economia/i);
  assert.match(english[0].summary, /economy/i);
  assert.match(english[0].date, /^en:/);
  assert.equal(test.timers.size, 0);
  test.context.navigator.onLine = false;
  assert.equal((await test.context.fetchCountryHeadlines(country, { topic: "economy" })).length, 4);
  assert.equal((await test.context.fetchCountryHeadlines(country, { topic: "general" })).length, 0);
  test.context.navigator.onLine = true;
  test.context.navigator.connection.saveData = true;
  assert.equal((await test.context.fetchCountryHeadlines(country, { topic: "general" })).length, 0);
  assert.equal(test.requests.length, 1, "offline and Save-Data never initiate external requests");
}

{
  const test = dataHarness();
  const country = code => ({ code, name: code, general: {} });
  for (let i = 0; i < 20; i++) await test.context.fetchCountryHeadlines(country("C" + i));
  assert.equal(test.context.newsCache.size, 16);
  assert.equal(test.context.newsCache.has("C0:general"), false);
  await test.context.fetchCountryHeadlines(country("C4"));
  await test.context.fetchCountryHeadlines(country("C20"));
  assert.equal(test.context.newsCache.has("C4:general"), true, "a reused entry becomes most recent");
  assert.equal(test.context.newsCache.has("C5:general"), false);
  test.advance(test.context.NEWS_CACHE_TTL_MS + 1);
  await test.context.fetchCountryHeadlines(country("NEXT"));
  assert.equal(test.context.newsCache.size, 1, "expired entries are removed on access without polling");
}

for (const invalid of [null, { articles: "invalid" }, { articles: [null, { title: "Missing URL" }, { title: "Unsafe", url: "javascript:alert(1)" }] }]) {
  const test = dataHarness();
  let calls = 0;
  test.context.fetch = async () => { calls++; return { ok: true, json: async () => invalid }; };
  assert.equal((await test.context.fetchCountryHeadlines(test.context.countriesData.ARG)).length, 0);
  assert.equal(test.context.newsCache.size, 0);
  await test.context.fetchCountryHeadlines(test.context.countriesData.ARG);
  assert.equal(calls, 2, "invalid results are not cached as live headlines");
  assert.equal(test.timers.size, 0);
}

{
  const test = dataHarness();
  test.context.fetch = async () => ({ ok: true, json: async () => ({ articles: [{
    title: "x".repeat(900), url: "https://example.com/article", sourceCommonName: "y".repeat(300), seendate: "z".repeat(100)
  }] }) });
  await test.context.fetchCountryHeadlines(test.context.countriesData.ARG);
  const raw = test.context.newsCache.get("ARG:general").items[0];
  assert.equal(raw.title.length, 600);
  assert.equal(raw.source.length, 160);
  assert.equal(raw.stamp.length, 40);
  assert.equal(Object.keys(raw).length, 4, "cache keeps only the bounded fields needed by the UI");
}

{
  const test = dataHarness();
  test.context.countriesData.ARG.general.officialName = "Republica Argentina";
  const held = deferred();
  const calls = [];
  test.context.fetch = async (url, options) => {
    calls.push({ query: new URL(url).searchParams.get("query"), signal: options.signal });
    return { ok: true, json: () => url.includes("Argentina") ? held.promise
      : Promise.resolve({ articles: articles() }) };
  };
  const first = test.context.showNewsArticle("ARG");
  await tick();
  assert.equal(calls.length, 1);
  test.expireRequest();
  await tick();
  assert.deepEqual(calls.map(call => call.query), ['"Republica Argentina" actualidad', '"Argentina" actualidad'],
    "a native deadline advances to the documented fallback instead of keeping a global request ordinal");
  assert.equal(calls[0].signal.aborted, true);
  await test.context.showNewsArticle("BRA");
  await first;
  assert.equal(calls.length, 3);
  assert.equal(calls[1].signal.aborted, true, "country replacement cancels the remaining fallback");
  assert.deepEqual(test.rendered, [["BRA", "Titular 0"]]);
  held.resolve({ articles: articles() });
  await tick();
  assert.deepEqual(test.rendered, [["BRA", "Titular 0"]], "both late Argentina bodies stay obsolete");
  assert.deepEqual([...test.context.newsCache.keys()], ["BRA:general"]);
  assert.equal(test.timers.size, 0);
}

console.log("news-lifecycle.test.js ok");
