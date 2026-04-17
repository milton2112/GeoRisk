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

  window.GeoRiskQuizUI = {
    buildStatusText,
    buildOptionsMarkup,
    buildMetaHtml,
    buildFeedbackHtml
  };
})();
