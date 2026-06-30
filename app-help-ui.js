(() => {
  function renderHelpContent({ language = "es" } = {}) {
    const isEnglish = language === "en";
    if (isEnglish) {
      return `
        <h2 id="help-modal-title">Quick guide</h2>
        <div class="help-section">
          <h3>Main flow</h3>
          <p>Start by searching or tapping a country, open its profile, then move to risk, timeline, conflicts or comparison from the same context.</p>
          <ol>
            <li>Search a country, continent, religion, system or organization.</li>
            <li>Use thematic layers to color the map by one readable metric.</li>
            <li>Open a country profile to review risk, politics, economy, religion, languages and conflicts.</li>
            <li>Compare countries or switch to presentation mode when you need a cleaner view.</li>
          </ol>
        </div>
        <div class="help-section">
          <h3>Data confidence</h3>
          <p>Dataset health shows quality, sources by section, estimated fields and pending curation. Estimated layers are marked as proxies.</p>
        </div>
        <div class="help-section">
          <h3>Shortcuts</h3>
          <ul>
            <li><b>/</b> focus search</li>
            <li><b>?</b> open this guide</li>
            <li><b>P</b> toggle presentation mode</li>
            <li><b>R</b> open or close rankings</li>
            <li><b>Alt+C</b> open or close comparison</li>
            <li><b>Alt+N</b> open or close news</li>
            <li><b>Esc</b> close floating panels and modals</li>
          </ul>
        </div>
        <div class="help-section">
          <h3>Saved views</h3>
          <p>Save a combination of map mode, layer, filters and selected country to return quickly to a class, demo or research scene.</p>
        </div>
      `;
    }

    return `
      <h2 id="help-modal-title">Guia rapida</h2>
      <div class="help-section">
        <h3>Flujo principal</h3>
        <p>Empeza buscando o tocando un pais, abri su ficha y desde ahi salta a riesgo, timeline, conflictos o comparador.</p>
        <ol>
          <li>Busca un pais, continente, religion, sistema u organizacion.</li>
          <li>Usa capas tematicas para colorear el mapa por una metrica clara.</li>
          <li>Abri una ficha para revisar riesgo, politica, economia, religion, idiomas y conflictos.</li>
          <li>Compara paises o activa modo presentacion cuando necesites una vista mas limpia.</li>
        </ol>
      </div>
      <div class="help-section">
        <h3>Confianza en datos</h3>
        <p>Salud dataset muestra calidad, fuentes por seccion, campos estimados y curaduria pendiente. Las capas estimadas aparecen marcadas como proxies.</p>
      </div>
      <div class="help-section">
        <h3>Atajos</h3>
        <ul>
          <li><b>/</b> enfoca el buscador</li>
          <li><b>?</b> abre esta guia</li>
          <li><b>P</b> alterna modo presentacion</li>
          <li><b>R</b> abre/cierra rankings</li>
          <li><b>Alt+C</b> abre/cierra comparador</li>
          <li><b>Alt+N</b> abre/cierra noticias</li>
          <li><b>Esc</b> cierra modales y paneles flotantes</li>
        </ul>
      </div>
      <div class="help-section">
        <h3>Vistas guardadas</h3>
        <p>Guarda combinaciones de modo de mapa, capa, filtros y pais seleccionado para volver rapido a una escena de clase, demo o investigacion.</p>
      </div>
    `;
  }

  window.GeoRiskHelpUi = { renderHelpContent };
})();
