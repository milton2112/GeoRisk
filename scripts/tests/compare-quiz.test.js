import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const projectRoot = process.cwd();

async function loadBrowserModule(file) {
  const source = await fs.readFile(path.join(projectRoot, file), "utf8");
  const context = { window: {}, Math };
  vm.runInNewContext(source, context);
  return context.window;
}

const compareWindow = await loadBrowserModule("app-compare-ui.js");
const quizWindow = await loadBrowserModule("app-quiz-ui.js");
const compare = compareWindow.GeoRiskCompareUI;
const quiz = quizWindow.GeoRiskQuizUI;
const runtime = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");

assert.ok(compare.buildComparisonModel, "comparador debe exponer modelo logico");
assert.ok(compare.buildProfessionalSections, "comparador debe renderizar secciones profesionales");
assert.equal((runtime.match(/function setupCompareControls\(/g) || []).length, 1, "runtime debe tener un unico setup avanzado del comparador");
assert.equal((runtime.match(/setupCompareControls = function setupCompareControls/g) || []).length, 0, "setup viejo del comparador no debe pisar la version avanzada");
const compareSetupBody = runtime.slice(
  runtime.indexOf("function setupCompareControls()"),
  runtime.indexOf("renderComparePanel = function renderComparePanel")
);
assert.ok(compareSetupBody.includes("compare-country-search"), "comparador debe conectar el buscador interno");
assert.ok(compareSetupBody.includes("compare-preset-select"), "comparador debe conectar presets");
assert.ok(compareSetupBody.includes("compare-benchmark-world"), "comparador debe conectar benchmark mundo");
assert.ok(compareSetupBody.includes("compare-benchmark-continent"), "comparador debe conectar benchmark continente");
assert.ok(quiz.buildQuestionBank, "quiz debe generar banco desde dataset");
assert.ok(quiz.buildQuestionFromBank, "quiz debe generar preguntas con dificultad");
assert.ok(quiz.renderPanel, "quiz debe renderizar su panel desde el modulo diferido");
assert.ok(quiz.renderFeedback, "quiz debe renderizar feedback explicativo desde el modulo diferido");

const countries = {
  ARG: {
    name: "Argentina",
    continent: "America",
    general: { population: 45000000, capital: { name: "Buenos Aires" }, languages: ["Espanol"] },
    economy: { gdp: 600, gdpPerCapita: 13000, inflation: 200 },
    military: { active: 75000, reserve: 30000, conflicts: [{ name: "Guerra de las Malvinas" }] },
    politics: { system: "Presidencialismo", organizations: [{ name: "ONU" }], rivals: ["Reino Unido"], relations: { blocs: ["Mercosur"] } },
    religion: { summary: "Cristianismo" },
    history: { year: 1816 }
  },
  BRA: {
    name: "Brasil",
    continent: "America",
    general: { population: 210000000, capital: { name: "Brasilia" }, languages: ["Portugues"] },
    economy: { gdp: 2000, gdpPerCapita: 9000, inflation: 5 },
    military: { active: 360000, reserve: 1300000, conflicts: [] },
    politics: { system: "Presidencialismo", organizations: [{ name: "ONU" }, { name: "BRICS" }], rivals: [], relations: { blocs: ["Mercosur", "BRICS"] } },
    religion: { summary: "Cristianismo" },
    history: { year: 1822 }
  },
  CHL: {
    name: "Chile",
    continent: "America",
    general: { population: 19000000, capital: { name: "Santiago" }, languages: ["Mapudungun"] },
    economy: { gdp: 320, gdpPerCapita: 16000, inflation: 4 },
    military: { active: 80000, reserve: 40000, conflicts: [] },
    politics: { system: "Presidencialismo", organizations: [{ name: "ONU" }], rivals: [], relations: { blocs: ["Alianza del Pacifico"] } },
    religion: { summary: "Cristianismo" },
    history: { year: 1818 }
  },
  URY: {
    name: "Uruguay",
    continent: "America",
    general: { population: 3500000, capital: { name: "Montevideo" }, languages: ["Italiano"] },
    economy: { gdp: 80, gdpPerCapita: 21000, inflation: 6 },
    military: { active: 22000, reserve: 0, conflicts: [] },
    politics: { system: "Presidencialismo", organizations: [{ name: "ONU" }], rivals: [], relations: { blocs: ["Mercosur"] } },
    religion: { summary: "Cristianismo" },
    history: { year: 1825 }
  }
};

const model = compare.buildComparisonModel(["ARG", "BRA", "CHL"], countries);
assert.equal(model.countries.length, 3, "comparador debe permitir mas de dos paises");
assert.ok(model.differences.length, "debe detectar diferencias destacadas");
assert.ok(model.similarities.some(item => item.key === "continent"), "debe detectar similitudes");
const html = compare.buildProfessionalSections(model, {
  language: "es",
  escapeHtml: value => String(value),
  getFlagEmoji: code => code,
  formatNumber: value => String(value),
  compactNumber: value => String(value),
  formatInflation: value => `${value}%`
});
assert.ok(html.includes("Diferencias destacadas"), "render debe incluir diferencias");
assert.ok(compare.getPresetCountries("south_america", countries).length >= 3, "presets deben seleccionar paises existentes");

const bank = quiz.buildQuestionBank(countries, { translateContinentName: value => value });
assert.ok(bank.some(item => item.category === "capital"), "banco debe incluir capitales");
assert.ok(bank.some(item => item.category === "economy"), "banco debe incluir economia");
assert.ok(bank.some(item => item.category === "conflict"), "banco debe incluir conflictos");
assert.ok(bank.some(item => item.category === "language"), "banco debe incluir idiomas");
assert.ok(bank.some(item => item.category === "bloc"), "banco debe incluir bloques");
const question = quiz.buildQuestionFromBank(bank, countries, { category: "capital", difficulty: "easy", asked: [] });
assert.equal(question.options.length, 4, "pregunta debe tener cuatro opciones");
const second = quiz.buildQuestionFromBank(bank, countries, { category: "capital", difficulty: "easy", asked: [question.code] });
assert.notEqual(second?.code, question.code, "no debe repetir pais preguntado");
const hard = quiz.buildQuestionFromBank(bank, countries, { category: "economy", difficulty: "hard", asked: [] });
assert.equal(hard?.difficulty, "hard", "debe respetar dificultad cuando hay banco");
const language = quiz.buildQuestionFromBank(bank, countries, { category: "language", difficulty: "medium", asked: [] });
assert.equal(language?.category, "language", "debe generar preguntas de idiomas desde el modulo diferido");
assert.equal(language.options.length, 4, "pregunta de idioma debe tener cuatro opciones");
const bloc = quiz.buildQuestionFromBank(bank, countries, { category: "bloc", difficulty: "medium", asked: [] });
assert.equal(bloc?.category, "bloc", "debe generar preguntas de bloques desde el modulo diferido");
assert.equal(bloc.options.length, 4, "pregunta de bloque debe tener cuatro opciones");

const quizElements = Object.fromEntries([
  "quiz-status",
  "quiz-meta",
  "quiz-question",
  "quiz-feedback",
  "quiz-options",
  "quiz-next-button",
  "quiz-reset-button",
  "quiz-category",
  "quiz-difficulty",
  "quiz-mode"
].map(id => [id, { id, value: "", textContent: "", innerHTML: "", hidden: false }]));
const quizDocument = { getElementById: id => quizElements[id] || null };
const renderedQuiz = quiz.renderPanel({
  document: quizDocument,
  quizState: {
    category: "capital",
    difficulty: "easy",
    mode: "classic",
    score: 2,
    total: 3,
    streak: 2,
    asked: ["ARG"],
    feedback: { kind: "ok", title: "Well answered", body: "Buenos Aires is correct." },
    current: { prompt: "Capital of Argentina?", options: ["Buenos Aires", "Brasilia", "Santiago", "Montevideo"], answered: true }
  },
  currentLanguage: "en",
  best: 4,
  escapeHtml: value => String(value)
});
assert.equal(renderedQuiz, true, "renderer diferido debe completar el panel");
assert.equal(quizElements["quiz-status"].textContent, "Score: 2/3", "estado del quiz debe respetar idioma");
assert.ok(quizElements["quiz-meta"].innerHTML.includes("Answered: 3"), "meta debe mostrar respuestas acumuladas");
assert.ok(quizElements["quiz-feedback"].innerHTML.includes("is-correct"), "feedback correcto debe quedar visible");
assert.ok(quizElements["quiz-options"].innerHTML.includes("Buenos Aires"), "opciones deben renderizarse desde el modulo");
assert.equal(quizElements["quiz-next-button"].hidden, false, "pregunta respondida debe habilitar siguiente");

console.log("compare-quiz.test.js ok");
