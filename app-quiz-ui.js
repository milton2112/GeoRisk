(() => {
  function buildStatusText(quizState) {
    return quizState.total ? `Puntaje: ${quizState.score}/${quizState.total}` : "Elegi una categoria y empeza el quiz.";
  }

  function buildOptionsMarkup(options, escapeHtml) {
    return options.map(option => `<button type="button" class="quiz-option" data-quiz-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("");
  }

  function buildMetaHtml(quizState, currentLanguage, best) {
    return `
      <span class="quiz-meta-pill">${currentLanguage === "en" ? "Streak" : "Racha"}: ${quizState.streak || 0}</span>
      <span class="quiz-meta-pill">${currentLanguage === "en" ? "Best streak" : "Mejor racha"}: ${best}</span>
      <span class="quiz-meta-pill">${quizState.mode === "timed" ? `${currentLanguage === "en" ? "Time" : "Tiempo"}: ${quizState.timeLeft || 0}s` : (currentLanguage === "en" ? "Mode: classic" : "Modo: clasico")}</span>
      <span class="quiz-meta-pill">${currentLanguage === "en" ? "Answered" : "Respondidas"}: ${quizState.total || 0}</span>
    `;
  }

  function buildFeedbackHtml(feedback, escapeHtml) {
    if (!feedback) {
      return "";
    }
    return `
      <div class="quiz-feedback ${feedback.kind === "ok" ? "is-correct" : "is-wrong"}">
        <strong>${escapeHtml(feedback.title)}</strong>
        <p>${escapeHtml(feedback.body)}</p>
      </div>
    `;
  }

  function normalizeText(value = "") {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function shuffle(items = []) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function pickDistractors(values, correct, limit = 3) {
    return shuffle([...new Set(values.filter(Boolean).filter(value => normalizeText(value) !== normalizeText(correct)))])
      .slice(0, limit);
  }

  function buildQuestionBank(countriesData, helpers = {}) {
    const countries = Object.entries(countriesData || {});
    const getConflicts = country => country.military?.conflicts || country.conflicts || [];
    const getOrgName = organization => typeof organization === "string" ? organization : (organization?.abbreviation || organization?.name || "");
    const getLanguageName = language => typeof language === "string" ? language : (language?.name || "");
    const banks = [];
    countries.forEach(([code, country]) => {
      if (country.general?.capital?.name) {
        banks.push({ code, category: "capital", difficulty: "easy", prompt: `Cual es la capital de ${country.name}?`, correct: country.general.capital.name, explanation: `${country.general.capital.name} es la capital registrada de ${country.name}.` });
      }
      if (country.continent) {
        banks.push({ code, category: "map", difficulty: "easy", prompt: `En que continente se ubica ${country.name}?`, correct: helpers.translateContinentName?.(country.continent) || country.continent, explanation: `${country.name} esta indexado en ${helpers.translateContinentName?.(country.continent) || country.continent}.` });
      }
      if (country.history?.year) {
        banks.push({ code, category: "history", difficulty: "medium", prompt: `En que ano se formo ${country.name}?`, correct: String(country.history.year), explanation: `El ano de formacion usado por la ficha es ${country.history.year}.` });
      }
      if (country.general?.languages?.length) {
        const language = getLanguageName(country.general.languages[0]);
        if (language) {
          banks.push({ code, category: "language", difficulty: "medium", prompt: `Cual es uno de los idiomas principales de ${country.name}?`, correct: language, explanation: `${language} figura entre los idiomas registrados de ${country.name}.` });
        }
      }
      if (country.economy?.gdpPerCapita) {
        banks.push({ code, category: "economy", difficulty: "hard", prompt: `Que pais tiene este PBI per capita aproximado: US$ ${Math.round(country.economy.gdpPerCapita)}?`, correct: country.name, explanation: `La metrica economica sale del dataset de la ficha pais.` });
      }
      if (getConflicts(country).length) {
        const conflict = getConflicts(country)[0];
        banks.push({ code, category: "conflict", difficulty: "medium", prompt: `Que pais esta vinculado con ${conflict.name || conflict}?`, correct: country.name, explanation: `El conflicto aparece asociado a ${country.name} en la seccion militar/conflictos.` });
      }
      if (country.politics?.organizations?.length) {
        const organization = getOrgName(country.politics.organizations[0]);
        if (organization) banks.push({ code, category: "organization", difficulty: "medium", prompt: `Que pais pertenece a ${organization}?`, correct: country.name, explanation: `${organization} figura en organizaciones de ${country.name}.` });
      }
      if (country.politics?.relations?.blocs?.length) {
        const bloc = country.politics.relations.blocs[0];
        if (bloc) banks.push({ code, category: "bloc", difficulty: "medium", prompt: `Que pais pertenece a ${bloc}?`, correct: country.name, explanation: `${bloc} figura entre los bloques o alianzas de ${country.name}.` });
      }
    });
    return banks;
  }

  function buildQuestionFromBank(bank, countriesData, state, helpers = {}) {
    const asked = new Set(state.asked || []);
    const difficultyOrder = state.difficulty === "hard" ? ["hard", "medium", "easy"] : state.difficulty === "medium" ? ["medium", "easy", "hard"] : ["easy", "medium"];
    const category = state.category === "continent" ? "map" : state.category;
    const pool = bank.filter(item => !asked.has(item.code) && item.category === category && difficultyOrder.includes(item.difficulty));
    const item = shuffle(pool)[0];
    if (!item) return null;
    const allCountries = Object.values(countriesData || {});
    const byCategory = {
      capital: allCountries.map(country => country.general?.capital?.name),
      map: ["America", "Europa", "Asia", "Africa", "Oceania", "Antartida"],
      history: allCountries.map(country => country.history?.year).filter(Boolean).map(String),
      economy: allCountries.map(country => country.name),
      conflict: allCountries.map(country => country.name),
      organization: allCountries.map(country => country.name),
      language: allCountries.flatMap(country => country.general?.languages || []).map(value => typeof value === "string" ? value : value?.name).filter(Boolean),
      bloc: allCountries.map(country => country.name)
    };
    const distractors = pickDistractors(byCategory[item.category] || allCountries.map(country => country.name), item.correct, 3);
    if (distractors.length < 3) return null;
    return {
      ...item,
      options: shuffle([item.correct, ...distractors]),
      answered: false,
      reviewKey: `${item.category}:${item.code}:${item.correct}`
    };
  }

  function buildResultsExport(state, language = "es") {
    return [
      language === "en" ? "GeoRisk quiz results" : "Resultados del quiz GeoRisk",
      `${language === "en" ? "Score" : "Puntaje"}: ${state.score || 0}/${state.total || 0}`,
      `${language === "en" ? "Best streak" : "Mejor racha"}: ${state.bestStreak || 0}`,
      `${language === "en" ? "Mode" : "Modo"}: ${state.mode || "classic"}`,
      `${language === "en" ? "Difficulty" : "Dificultad"}: ${state.difficulty || "easy"}`
    ].join("\n");
  }

  window.GeoRiskQuizUI = {
    buildStatusText,
    buildOptionsMarkup,
    buildMetaHtml,
    buildFeedbackHtml,
    buildQuestionBank,
    buildQuestionFromBank,
    buildResultsExport
  };
})();
