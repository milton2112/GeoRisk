const pecos = "Combate del r\u00edo Pecos (1864)";
const sunset = "Combate de Sunset Pass (1874)";

export const PECOS_SUNSET_CONFLICT_RENAMES = {
  "Batalla de Pecos River": pecos,
  "Battle of Pecos River": pecos,
  "Combate del rio Pecos (1864)": pecos,
  "Batalla de Sunset Pass": sunset,
  "Battle of Sunset Pass": sunset
};

export const PECOS_SUNSET_CONFLICT_DETAIL_FIXES = {
  [pecos]: {
    parent: "Guerras navajo", war: "Guerras navajo",
    campaign: "Operaciones de Fort Sumner contra los navajos (1863-1864)",
    related: ["Guerras navajo"],
    startYear: 1864, endYear: 1864, datePrecision: "5 de enero de 1864, seg\u00fan el parte de Wallen del 6 de enero",
    type: "combate", conflictType: "colonial", scale: "local",
    status: "historico", active: false, ongoing: false,
    region: "R\u00edo Pecos, cerca de Fort Sumner, Nuevo M\u00e9xico, Estados Unidos",
    normalizedRegion: "R\u00edo Pecos, cerca de Fort Sumner, Nuevo M\u00e9xico, Estados Unidos",
    cause: "Seg\u00fan Wallen, la salida respondi\u00f3 a la sustracci\u00f3n de ganado apache cerca de Fort Sumner. Ocurri\u00f3 durante las operaciones estadounidenses contra los navajos y la pol\u00edtica de confinamiento en Bosque Redondo.",
    outcome: "El parte describe la dispersi\u00f3n de los combatientes navajos, una persecuci\u00f3n y la recuperaci\u00f3n de caballos y mulas. Las tropas regresaron por el fr\u00edo, el agotamiento y el consumo de municiones.",
    consequences: "Wallen solicit\u00f3 m\u00e1s caballer\u00eda para Fort Sumner. La acci\u00f3n no cerr\u00f3 las guerras navajo ni fue por s\u00ed sola la causa de la deportaci\u00f3n posterior conocida como la Larga Marcha.",
    participants: [
      {
        side: "Tropas estadounidenses y aliados apaches",
        members: ["Estados Unidos", "Charles Newbold", "Lorenzo Labadie", "Ojo Blanco", "Destacamentos del 2.\u00ba de Caballer\u00eda de Voluntarios de California y de infanter\u00eda regular", "Combatientes apaches aliados"],
        casualties: "Wallen report\u00f3 ning\u00fan muerto y 2 apaches heridos leves entre los perseguidores; tambi\u00e9n describi\u00f3 lesiones por congelaci\u00f3n sin cuantificarlas"
      },
      {
        side: "Combatientes navajos",
        members: ["Grupo navajo perseguido desde las cercan\u00edas de Fort Sumner; jefatura no identificada en el parte"],
        casualties: "Wallen transmiti\u00f3 40 muertos reportados por Newbold y estim\u00f3 otros 25 muertos o heridos graves no localizados; no es un total verificado de muertos ni un recuento independiente"
      }
    ],
    chronology: [
      { year: 1864, event: "El 5 de enero, Ojo Blanco avis\u00f3 de la sustracci\u00f3n de ganado y sali\u00f3 la fuerza de Newbold desde Fort Sumner." },
      { year: 1864, event: "El enfrentamiento al sureste del fuerte dio paso a una persecuci\u00f3n de dos grupos hacia el r\u00edo Pecos." },
      { year: 1864, event: "Hacia las 16:00 se decidi\u00f3 regresar; el parte se redact\u00f3 el 6 de enero y Carleton lo remiti\u00f3 el d\u00eda 11." }
    ],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      { label: "Henry D. Wallen, parte del 6 de enero de 1864, Official Records, serie I, vol. XXXIV, parte I, p. 69: fecha y participantes", url: "https://www.civilwar.com/official-record/961-red-river-campaign-part-i/205366-69-series-i-volume-xxxiv-i-serial-61-red-river-campaign-part-i.html" },
      { label: "Mismo parte de Wallen, p. 70: bajas reportadas, estimaciones y regreso; no es una segunda fuente independiente", url: "https://www.civilwar.com/official-record/961-red-river-campaign-part-i/205367-70-series-i-volume-xxxiv-i-serial-61-red-river-campaign-part-i.html" },
      { label: "National Park Service, The War and Westward Expansion: contexto de las operaciones contra los navajos y de Bosque Redondo", url: "https://www.nps.gov/articles/the-war-and-westward-expansion.htm" }
    ],
    curationPriority: "alta", curationBatch: "source-backed-pecos-sunset-2026-09",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "Se adopta el 5 de enero que consta en el encabezado y en el parte del d\u00eda 6, no el 4 de enero de algunas s\u00edntesis. Las bajas son afirmaciones del mando estadounidense: no se convierten 25 personas no localizadas en 25 heridos confirmados ni se suman como 65 muertos. La campa\u00f1a es una agrupaci\u00f3n descriptiva, no una operaci\u00f3n contra la Confederaci\u00f3n por aparecer en los Official Records. No se confunde con Pease River (1860) ni con el combate cercano del 16 de diciembre de 1863."
  },
  [sunset]: {
    parent: "Guerras apaches", war: "Guerras apaches",
    campaign: "Operaciones desde Camp Verde (1874)", related: ["Guerras apaches"],
    startYear: 1874, endYear: 1874, datePrecision: "1 de noviembre de 1874",
    type: "combate", conflictType: "colonial", scale: "local",
    status: "historico", active: false, ongoing: false,
    region: "Sunset Pass, territorio de Arizona, Estados Unidos",
    normalizedRegion: "Sunset Pass, territorio de Arizona, Estados Unidos",
    cause: "Acci\u00f3n durante las salidas del 5.\u00ba de Caballer\u00eda desde Camp Verde contra grupos apaches, en el contexto del control militar y de las reservas. El registro de King sit\u00faa su exploraci\u00f3n entre el 27 de octubre y el 6 de noviembre de 1874.",
    outcome: "Charles King qued\u00f3 gravemente herido y Bernard Taylor lo rescat\u00f3. Las fuentes documentan ese episodio, pero no permiten fijar aqu\u00ed un balance completo de bajas ni un vencedor territorial definitivo.",
    consequences: "King fue apartado del servicio local para recuperarse. El rescate de Taylor fue reconocido con la Medalla de Honor el 12 de abril de 1875; esa fecha no es la del combate.",
    participants: [
      {
        side: "Destacamento estadounidense de Camp Verde",
        members: ["Estados Unidos", "5.\u00ba Regimiento de Caballer\u00eda", "Charles King", "Bernard Taylor"],
        casualties: "Charles King consta como herido grave; no se presenta ese caso como el total de bajas del destacamento"
      },
      {
        side: "Combatientes apaches de Arizona",
        members: ["Grupos apaches enfrentados a la patrulla de Sunset Pass; jefatura no consolidada en las fuentes consultadas"],
        casualties: "Sin cifra consolidada en las fuentes consultadas; no equivale a cero"
      }
    ],
    chronology: [
      { year: 1874, event: "El 1 de noviembre se produjo el combate de Sunset Pass durante las operaciones desde Camp Verde." },
      { year: 1874, event: "King fue herido de gravedad y Taylor lo rescat\u00f3; ambos hechos constan en registros militares y de la condecoraci\u00f3n." }
    ],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      { label: "Congressional Medal of Honor Society, Bernard Taylor: fecha del combate, unidad y rescate de King", url: "https://www.cmohs.org/recipients/bernard-taylor" },
      { label: "Cullum's Register, Charles King, entrada 2136: servicio en Camp Verde, exploraci\u00f3n y herida en Sunset Pass; transcripci\u00f3n de la Universidad de Chicago", url: "https://penelope.uchicago.edu/Thayer/E/Gazetteer/Places/America/United_States/Army/USMA/Cullums_Register/2136*.html" },
      { label: "Lloyd Pierson, A Short History of Camp Verde, Arizona, to 1890, El Palacio (1957), p. 335: contexto local y recuperaci\u00f3n de King", url: "https://npshistory.com/publications/moca/ep-v64n11-12-1957.pdf" }
    ],
    curationPriority: "alta", curationBatch: "source-backed-pecos-sunset-2026-09",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "La fecha y el rescate tienen respaldo documental; las fuentes militares reflejan la perspectiva estadounidense. La campa\u00f1a es una agrupaci\u00f3n descriptiva de las operaciones desde Camp Verde. No se identifican todos los combatientes ni se inventan cifras de bajas. La novela Sunset Pass de Charles King no se usa como parte de guerra ni como prueba del desenlace. La entrega de la condecoraci\u00f3n en 1875 no desplaza el combate de 1874."
  }
};
