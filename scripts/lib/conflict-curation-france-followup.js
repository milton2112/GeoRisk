function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  bantryNli: source(
    "Biblioteca Nacional de Irlanda: cartas navales sobre la acción de Bantry de mayo de 1689",
    "https://sources.nli.ie/Record/MS_UR_057797"
  ),
  bantryUstc: source(
    "Universal Short Title Catalogue: relato contemporáneo del combate de Bantry Bay",
    "https://www.ustc.ac.uk/editions/3117519"
  ),
  bomarsundAland: source(
    "Visit Åland: cronología histórica de la captura de Bomarsund en 1854",
    "https://visitaland.com/en/experience/history/aland-history/"
  ),
  alandStatus: source(
    "Ministerio de Asuntos Exteriores de Finlandia: origen de la desmilitarización de Åland",
    "https://um.fi/the-special-status-of-the-aland-islands"
  ),
  camaretVauban: source(
    "Red de Sitios Mayores de Vauban: ataque anglo-neerlandés a Camaret de 1694",
    "https://sites-vauban.org/ressources/site-vauban/camaret-sur-mer"
  ),
  camaretMap: source(
    "Royal Collection Trust: mapa y descripción del ataque a Brest y Camaret de 1694",
    "https://militarymaps.rct.uk/other-17th-century-conflicts/map-of-brest-and-camaret-1694-brest-brittany-france-48deg2400n-04deg2900w-camaret-sur-mer-brittany"
  ),
  capFrancoisRmg: source(
    "Royal Museums Greenwich: acción frente a Cap-Français del 21 de octubre de 1757",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-11874"
  ),
  capFrancoisMariners: source(
    "The Mariners' Museum: catálogo histórico de la acción de Cap-Français",
    "https://catalogs.marinersmuseum.org/object/CL15555"
  ),
  chandannagarNam: source(
    "National Army Museum: captura británica del fuerte francés de Chandannagar en 1757",
    "https://www.nam.ac.uk/explore/battle-plassey"
  ),
  chandannagarBnf: source(
    "Bibliothèque nationale de France: historia del enclave francés de Chandannagar en Bengala",
    "https://heritage.bnf.fr/france-southasia/en/bengal-0"
  ),
  craonneCampaign: source(
    "Fondation Napoléon: campaña de Francia y batalla de Craonne de 1814",
    "https://www.napoleon.org/en/history-of-the-two-empires/articles/200-years-ago-1814-the-french-campaign-step-by-step/"
  ),
  craonneOverview: source(
    "Fondation Napoléon: dossier histórico de la campaña de Francia de 1814",
    "https://www.napoleon.org/histoire-des-2-empires/dossiers-thematiques/1814-la-campagne-de-france/"
  ),
  golyminTimeline: source(
    "Fondation Napoléon: cronología de la campaña de Polonia y combate de Golymin",
    "https://www.napoleon.org/histoire-des-2-empires/chronologies/la-campagne-de-pologne-nov-1806-fevrier-1807-les-evenements-conduisant-a-la-bataille-deylau/"
  ),
  polandCampaign: source(
    "Fondation Napoléon: campaña de Polonia de 1806-1807",
    "https://www.napoleon.org/histoire-des-2-empires/articles/campagne-de-pologne-de-1807/"
  ),
  grenadaRmg: source(
    "Royal Museums Greenwich: participación naval británica en la batalla de Granada de 1779",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-14325"
  ),
  grenadaFounders: source(
    "Founders Online: informe contemporáneo a Benjamin Franklin sobre la campaña de Granada",
    "https://founders.archives.gov/documents/Franklin/01-30-02-0078"
  ),
  groixRmg: source(
    "Royal Museums Greenwich: acción de Bridport frente a Groix del 23 de junio de 1795",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-14045"
  ),
  groixGovernmentArt: source(
    "Government Art Collection: segunda acción de Groix y captura de tres buques franceses",
    "https://artcollection.dcms.gov.uk/artwork/3445/"
  ),
  heilsbergTimeline: source(
    "Fondation Napoléon: cronología internacional y batalla de Heilsberg de 1807",
    "https://www.napoleon.org/en/history-of-the-two-empires/timelines/international-events-january-june-1807/"
  ),
  chesapeakeNps: source(
    "National Park Service: batalla de los Cabos y bloqueo de Chesapeake de 1781",
    "https://home.nps.gov/york/learn/historyculture/battle-of-the-capes.htm"
  ),
  chesapeakeNhhc: source(
    "Naval History and Heritage Command: guerra naval global y campaña de Chesapeake",
    "https://www.history.navy.mil/about-us/leadership/director/directors-corner/h-grams/h-gram-094/h-094-2.html"
  ),
  quiberonRmg: source(
    "Royal Museums Greenwich: batalla de la bahía de Quiberon del 20 de noviembre de 1759",
    "https://www.rmg.co.uk/collections/objects/rmgc-object-11892"
  ),
  quiberonArchive: source(
    "Royal Museums Greenwich: relato contemporáneo de la acción de Quiberon",
    "https://www.rmg.co.uk/collections/archive/rmgc-object-504878"
  )
};

function historicalFix({
  parent,
  campaign,
  region,
  hierarchySources,
  startYear,
  participants,
  cause,
  outcome,
  consequences,
  chronology,
  type = "batalla",
  conflictType = "interestatal",
  scale = "regional",
  treaties = [],
  related = [],
  curationNote,
  sourceDispute = false
}) {
  const sources = Array.isArray(hierarchySources) ? hierarchySources : [hierarchySources];
  return {
    parent,
    war: parent,
    campaign,
    type,
    conflictType,
    scale,
    status: "historico",
    active: false,
    ongoing: false,
    startYear,
    endYear: startYear,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: "alta",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-france-followup-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Bantry Bay": "Batalla naval de la bahía de Bantry (1689)",
  "Batalla de Bomarsund": "Sitio de Bomarsund (1854)",
  "Batalla de Camaret": "Batalla de Camaret (1694)",
  "Batalla de Cap-Français": "Batalla naval de Cap-Français (1757)",
  "Batalla de Chandannagar": "Asedio y captura de Chandannagar (1757)",
  "Batalla de Craonne": "Batalla de Craonne (1814)",
  "Batalla de Golymin": "Batalla de Golymin (1806)",
  "Batalla de Grenada": "Batalla naval de la isla de Granada (1779)",
  "Batalla de Groix": "Batalla naval de Groix (1795)",
  "Batalla de Heilsberg": "Batalla de Heilsberg (1807)",
  "Batalla de la Bahía de Chesapeake": "Batalla naval de la bahía de Chesapeake (1781)",
  "Batalla de Quiberon Bay": "Batalla naval de la bahía de Quiberon (1759)"
};

const BRITISH_ASSOCIATIONS = [
  "Batalla naval de la bahía de Bantry (1689)",
  "Sitio de Bomarsund (1854)",
  "Batalla de Camaret (1694)",
  "Batalla naval de Cap-Français (1757)",
  "Asedio y captura de Chandannagar (1757)",
  "Batalla naval de la isla de Granada (1779)",
  "Batalla naval de Groix (1795)",
  "Batalla naval de la bahía de Chesapeake (1781)",
  "Batalla naval de la bahía de Quiberon (1759)"
];

export const FRANCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino Unido": BRITISH_ASSOCIATIONS,
  Irlanda: ["Batalla naval de la bahía de Bantry (1689)"],
  Finlandia: ["Sitio de Bomarsund (1854)"],
  Rusia: [
    "Sitio de Bomarsund (1854)",
    "Batalla de Craonne (1814)",
    "Batalla de Golymin (1806)",
    "Batalla de Heilsberg (1807)"
  ],
  "Reino de los Países Bajos": ["Batalla de Camaret (1694)"],
  Haití: ["Batalla naval de Cap-Français (1757)"],
  India: ["Asedio y captura de Chandannagar (1757)"],
  Alemania: ["Batalla de Craonne (1814)", "Batalla de Heilsberg (1807)"],
  Polonia: ["Batalla de Golymin (1806)", "Batalla de Heilsberg (1807)"],
  "Estados Unidos": ["Batalla naval de la bahía de Chesapeake (1781)"]
};

export const FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla naval de la bahía de Bantry (1689)": historicalFix({
    parent: "Guerra de los Nueve Años",
    campaign: "Campaña naval de la guerra guillermita en Irlanda (1689-1691)",
    region: "Bahía de Bantry, condado de Cork, Irlanda",
    hierarchySources: [SOURCES.bantryNli, SOURCES.bantryUstc],
    startYear: 1689,
    type: "batalla naval",
    participants: [
      { side: "Flota francesa y apoyo jacobita", members: ["Reino de Francia", "Jacobitas irlandeses"] },
      { side: "Flota inglesa guillermita", members: ["Reino de Inglaterra"] }
    ],
    cause: "Una escuadra inglesa intentó interceptar a la flota francesa que llevaba dinero, armas y suministros para sostener a Jacobo II en Irlanda.",
    outcome: "El combate no produjo una destrucción decisiva; la escuadra inglesa se retiró y la misión logística francesa pudo completarse, aunque ambos bandos reivindicaron el resultado.",
    consequences: "Francia conservó temporalmente la iniciativa naval alrededor de Irlanda, pero la acción no decidió la guerra guillermita ni el conflicto franco-inglés más amplio.",
    chronology: [
      { year: 1689, event: "La flota francesa desembarcó suministros para la causa jacobita en Irlanda." },
      { year: 1689, event: "Las escuadras francesa e inglesa combatieron frente a Bantry y se separaron sin una destrucción decisiva." }
    ],
    treaties: ["Tratado de Limerick (1691)", "Tratado de Rijswijk (1697)"],
    related: ["Guerra guillermita de Irlanda"],
    sourceDispute: true,
    curationNote: "La fecha se expresa en calendario gregoriano; documentos contemporáneos también usan el 1 de mayo según el calendario juliano. Se evita declarar una victoria táctica inequívoca porque ambos bandos la reclamaron."
  }),
  "Sitio de Bomarsund (1854)": historicalFix({
    parent: "Guerra de Crimea",
    campaign: "Campaña del Báltico de la Guerra de Crimea",
    region: "Bomarsund, islas Åland, actual Finlandia",
    hierarchySources: [SOURCES.bomarsundAland, SOURCES.alandStatus],
    startYear: 1854,
    type: "sitio y operación anfibia",
    participants: [
      { side: "Fuerza expedicionaria aliada", members: ["Reino Unido", "Francia"] },
      { side: "Guarnición rusa", members: ["Imperio ruso"] }
    ],
    cause: "La expedición franco-británica del Báltico atacó la fortaleza rusa de Bomarsund para reducir la presencia militar imperial en Åland durante la Guerra de Crimea.",
    outcome: "La guarnición rusa capituló y las fuerzas aliadas destruyeron la fortaleza inacabada.",
    consequences: "La caída y demolición de Bomarsund precedieron a la desmilitarización de las islas Åland acordada en la paz de 1856.",
    chronology: [
      { year: 1854, event: "Fuerzas navales y terrestres franco-británicas cercaron y bombardearon Bomarsund." },
      { year: 1854, event: "La guarnición rusa se rindió y la fortaleza fue demolida." }
    ],
    treaties: ["Tratado de París (1856)", "Convención sobre las islas Åland (1856)"],
    curationNote: "Se reemplaza la etiqueta genérica de batalla por sitio y operación anfibia. La desmilitarización se vincula a la paz de 1856 sin presentarla como consecuencia exclusiva de una sola acción."
  }),
  "Batalla de Camaret (1694)": historicalFix({
    parent: "Guerra de los Nueve Años",
    campaign: "Operaciones navales contra Brest de 1694",
    region: "Camaret-sur-Mer y acceso a Brest, Bretaña, Francia",
    hierarchySources: [SOURCES.camaretVauban, SOURCES.camaretMap],
    startYear: 1694,
    type: "asalto anfibio",
    participants: [
      { side: "Defensa francesa", members: ["Reino de Francia"] },
      { side: "Fuerza expedicionaria anglo-neerlandesa", members: ["Reino de Inglaterra", "República Neerlandesa"] }
    ],
    cause: "Una expedición anglo-neerlandesa intentó penetrar las defensas de Camaret, desembarcar tropas y amenazar la flota y el arsenal franceses de Brest.",
    outcome: "Las baterías, tropas y milicias francesas dirigidas dentro del sistema defensivo de Vauban rechazaron el desembarco aliado.",
    consequences: "El fracaso protegió Brest y confirmó la eficacia inmediata de las fortificaciones costeras de Camaret, todavía incompletas.",
    chronology: [
      { year: 1694, event: "La flota anglo-neerlandesa abrió el ataque contra las defensas de Camaret." },
      { year: 1694, event: "El desembarco fue rechazado y la fuerza expedicionaria abandonó la operación contra Brest." }
    ],
    treaties: ["Tratado de Rijswijk (1697)"],
    curationNote: "Se clasifica como asalto anfibio porque combinó fuego naval, baterías costeras y un desembarco; no se consolidan cifras de buques o bajas que varían entre relatos."
  }),
  "Batalla naval de Cap-Français (1757)": historicalFix({
    parent: "Guerra de los Siete Años",
    campaign: "Guerra naval anglo-francesa en el Caribe (1756-1763)",
    region: "Aguas frente a Cap-Français, actual Cap-Haïtien, Haití",
    hierarchySources: [SOURCES.capFrancoisRmg, SOURCES.capFrancoisMariners],
    startYear: 1757,
    type: "batalla naval",
    participants: [
      { side: "Escuadra francesa y convoy", members: ["Reino de Francia"] },
      { side: "Escuadra británica", members: ["Reino de Gran Bretaña"] }
    ],
    cause: "Tres navíos británicos intentaron interceptar un convoy francés escoltado que se preparaba para navegar desde Saint-Domingue hacia Europa.",
    outcome: "Tras un combate intenso y no decisivo, las fuerzas se separaron; la escuadra francesa reparó daños y el convoy consiguió navegar posteriormente hacia Francia.",
    consequences: "La acción no alteró de forma decisiva el equilibrio caribeño, pero mostró la importancia de la escolta de convoyes coloniales durante la Guerra de los Siete Años.",
    chronology: [
      { year: 1757, event: "La escuadra británica interceptó a la fuerza francesa frente a Cap-Français." },
      { year: 1757, event: "La fuerza francesa volvió a puerto para reparaciones y el convoy partió más tarde hacia Europa." }
    ],
    treaties: ["Tratado de París (1763)"],
    sourceDispute: true,
    curationNote: "Las tradiciones navales atribuyen méritos distintos a cada escuadra. Se conserva el desenlace operacional verificable y no una victoria nacional absoluta."
  }),
  "Asedio y captura de Chandannagar (1757)": historicalFix({
    parent: "Guerra de los Siete Años",
    campaign: "Campaña de Bengala de 1757",
    region: "Chandannagar, Bengala Occidental, India",
    hierarchySources: [SOURCES.chandannagarNam, SOURCES.chandannagarBnf],
    startYear: 1757,
    type: "asedio y asalto fluvial",
    conflictType: "colonial",
    participants: [
      { side: "Fuerza británica", members: ["Compañía Británica de las Indias Orientales", "Royal Navy"] },
      { side: "Defensa francesa", members: ["Compañía Francesa de las Indias Orientales", "Guarnición de Chandannagar"] }
    ],
    cause: "La Compañía Británica buscó eliminar el principal enclave francés de Bengala mientras la rivalidad europea de la Guerra de los Siete Años se extendía a India.",
    outcome: "Las fuerzas terrestres y navales británicas tomaron el fuerte y el asentamiento francés de Chandannagar.",
    consequences: "La captura debilitó la posición francesa en Bengala y precedió a la consolidación de la influencia británica tras Plassey.",
    chronology: [
      { year: 1757, event: "Las fuerzas de Robert Clive iniciaron operaciones contra el enclave francés." },
      { year: 1757, event: "El ataque coordinado desde tierra y el río forzó la rendición de Chandannagar." }
    ],
    treaties: ["Tratado de París (1763)"],
    related: ["Tercera Guerra Carnática", "Batalla de Plassey"],
    curationNote: "Se reemplaza batalla por asedio y captura para reflejar el ataque combinado contra una plaza fortificada. No se atribuye participación al Estado indio moderno."
  }),
  "Batalla de Craonne (1814)": historicalFix({
    parent: "Guerra de la Sexta Coalición (1813-1814)",
    campaign: "Campaña de Francia de 1814",
    region: "Craonne, Aisne, Francia",
    hierarchySources: [SOURCES.craonneCampaign, SOURCES.craonneOverview],
    startYear: 1814,
    participants: [
      { side: "Ejército francés", members: ["Primer Imperio francés"] },
      { side: "Ejército de Silesia", members: ["Imperio ruso", "Reino de Prusia"] }
    ],
    cause: "Napoleón intentó golpear al ejército aliado de Blücher después de que la capitulación de Soissons permitiera a la coalición cruzar el Aisne.",
    outcome: "Las fuerzas rusas abandonaron el campo al anochecer y dejaron a Napoleón en posesión de Craonne, tras pérdidas graves en ambos bandos.",
    consequences: "La victoria táctica francesa no revirtió la campaña; dos días después Napoleón fue detenido y obligado a retroceder ante Laon.",
    chronology: [
      { year: 1814, event: "El ejército francés atacó la posición rusa en la meseta de Craonne." },
      { year: 1814, event: "La coalición se retiró durante la noche y la campaña continuó hacia Laon." }
    ],
    treaties: ["Tratado de París (1814)"],
    curationNote: "Se distingue victoria táctica de efecto estratégico: conservar el campo no detuvo el avance aliado sobre Francia ni evitó la posterior abdicación."
  }),
  "Batalla de Golymin (1806)": historicalFix({
    parent: "Guerra de la Cuarta Coalición (1806-1807)",
    campaign: "Campaña de Polonia de 1806-1807",
    region: "Gołymin, actual Polonia",
    hierarchySources: [SOURCES.golyminTimeline, SOURCES.polandCampaign],
    startYear: 1806,
    participants: [
      { side: "Fuerzas francesas", members: ["Primer Imperio francés"] },
      { side: "Fuerzas rusas", members: ["Imperio ruso"] }
    ],
    cause: "La Grande Armée perseguía a las fuerzas rusas en Polonia e intentó impedir que la vanguardia de Golitsyn se retirara y reuniera con otros cuerpos.",
    outcome: "Los franceses ocuparon Golymin y obligaron a la fuerza rusa a retirarse, pero el barro y la resistencia permitieron que el grueso escapara sin ser cercado.",
    consequences: "La acción formó parte de los combates invernales que no produjeron la destrucción buscada y precedieron a la campaña de Eylau de 1807.",
    chronology: [
      { year: 1806, event: "Cuerpos franceses atacaron las posiciones rusas alrededor de Golymin." },
      { year: 1806, event: "Golitsyn completó una retirada ordenada mientras los franceses quedaron dueños del terreno." }
    ],
    treaties: ["Tratados de Tilsit (1807)"],
    curationNote: "El resultado se expresa como éxito territorial francés y retirada rusa lograda; no se transforma la ocupación del campo en una destrucción del ejército adversario."
  }),
  "Batalla naval de la isla de Granada (1779)": historicalFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña de las Antillas de 1778-1783",
    region: "Aguas frente a la isla de Granada, Caribe",
    hierarchySources: [SOURCES.grenadaRmg, SOURCES.grenadaFounders],
    startYear: 1779,
    type: "batalla naval",
    conflictType: "independencia",
    participants: [
      { side: "Flota francesa", members: ["Reino de Francia"] },
      { side: "Flota británica", members: ["Reino de Gran Bretaña"] }
    ],
    cause: "La flota británica intentó disputar la captura francesa de Granada y atacar a la escuadra de d'Estaing cerca de la isla.",
    outcome: "La flota francesa rechazó el ataque y obligó a los británicos a retirarse, aunque no consiguió destruir ni perseguir decisivamente a la fuerza adversaria.",
    consequences: "Francia conservó temporalmente Granada y mejoró su posición naval en las Antillas, sin eliminar la capacidad operativa británica en el Caribe.",
    chronology: [
      { year: 1779, event: "Fuerzas francesas capturaron Granada antes de la llegada de la flota británica." },
      { year: 1779, event: "Las flotas combatieron el 6 de julio y la escuadra británica se retiró." }
    ],
    treaties: ["Tratado de París (1783)"],
    related: ["Captura francesa de Granada (1779)"],
    curationNote: "El nombre se traduce y se añade isla para evitar confusión con Granada, España. La victoria francesa se registra sin convertirla en destrucción decisiva de la flota británica."
  }),
  "Batalla naval de Groix (1795)": historicalFix({
    parent: "Guerras revolucionarias francesas",
    campaign: "Operaciones navales del golfo de Vizcaya de 1795",
    region: "Aguas frente a la isla de Groix, Bretaña, Francia",
    hierarchySources: [SOURCES.groixRmg, SOURCES.groixGovernmentArt],
    startYear: 1795,
    type: "batalla naval",
    participants: [
      { side: "Flota británica", members: ["Reino de Gran Bretaña"] },
      { side: "Flota republicana francesa", members: ["Primera República francesa"] }
    ],
    cause: "La flota británica de Bridport persiguió a la fuerza francesa hacia Lorient después de las operaciones navales de junio frente a Bretaña.",
    outcome: "La flota británica capturó tres navíos franceses, mientras la mayor parte de la fuerza republicana alcanzó protección cerca de Groix.",
    consequences: "La acción reforzó la presión naval británica sobre la costa atlántica francesa, pero no destruyó el núcleo de la flota adversaria.",
    chronology: [
      { year: 1795, event: "La flota británica alcanzó a la retaguardia francesa frente a Groix el 23 de junio." },
      { year: 1795, event: "Tres navíos franceses fueron capturados antes de que el resto de la flota escapara." }
    ],
    treaties: [],
    curationNote: "Se identifica la batalla del 23 de junio, también llamada segunda acción de Groix, y se la separa de la retirada de Cornwallis del 16-17 de junio."
  }),
  "Batalla de Heilsberg (1807)": historicalFix({
    parent: "Guerra de la Cuarta Coalición (1806-1807)",
    campaign: "Campaña de Polonia de 1806-1807",
    region: "Heilsberg, actual Lidzbark Warmiński, Polonia",
    hierarchySources: [SOURCES.heilsbergTimeline, SOURCES.polandCampaign],
    startYear: 1807,
    participants: [
      { side: "Fuerzas francesas", members: ["Primer Imperio francés"] },
      { side: "Fuerzas ruso-prusianas", members: ["Imperio ruso", "Reino de Prusia"] }
    ],
    cause: "Las avanzadas francesas atacaron la posición fortificada de Bennigsen en Heilsberg antes de completar el movimiento previsto sobre los flancos rusos.",
    outcome: "Los asaltos franceses fueron rechazados con grandes pérdidas y no lograron una decisión; el ejército ruso abandonó después la posición para evitar quedar cortado.",
    consequences: "La batalla no resolvió la campaña y fue seguida pocos días después por el enfrentamiento decisivo de Friedland.",
    chronology: [
      { year: 1807, event: "Murat y Soult atacaron frontalmente las defensas rusas de Heilsberg el 10 de junio." },
      { year: 1807, event: "Bennigsen se retiró posteriormente y la campaña continuó hacia Friedland." }
    ],
    treaties: ["Tratados de Tilsit (1807)"],
    related: ["Batalla de Friedland"],
    sourceDispute: true,
    curationNote: "Se conserva un resultado no decisivo: el rechazo táctico de los asaltos franceses y la retirada rusa posterior permiten lecturas nacionales distintas. Las cifras de bajas no se fijan como definitivas."
  }),
  "Batalla naval de la bahía de Chesapeake (1781)": historicalFix({
    parent: "Guerra de Independencia de Estados Unidos",
    campaign: "Campaña de Yorktown de 1781",
    region: "Boca de la bahía de Chesapeake, Virginia, Estados Unidos",
    hierarchySources: [SOURCES.chesapeakeNps, SOURCES.chesapeakeNhhc],
    startYear: 1781,
    type: "batalla naval",
    conflictType: "independencia",
    scale: "internacional",
    participants: [
      { side: "Flota francesa", members: ["Reino de Francia"] },
      { side: "Flota británica", members: ["Reino de Gran Bretaña"] }
    ],
    cause: "La flota británica intentó recuperar el acceso a Chesapeake y sostener o evacuar al ejército de Cornwallis, bloqueado por la concentración naval francesa.",
    outcome: "El combate no destruyó ninguna flota, pero la retirada británica permitió a de Grasse restablecer el bloqueo: una victoria estratégica francesa decisiva para Yorktown.",
    consequences: "Cornwallis quedó sin socorro marítimo y capituló en Yorktown, lo que condujo al fin de las grandes operaciones británicas en las trece colonias.",
    chronology: [
      { year: 1781, event: "Las flotas francesa y británica combatieron frente a los cabos de Virginia el 5 de septiembre." },
      { year: 1781, event: "La flota francesa retomó el bloqueo mientras los británicos regresaron a Nueva York para reparaciones." }
    ],
    treaties: ["Tratado de París (1783)"],
    related: ["Sitio de Yorktown"],
    sourceDispute: true,
    curationNote: "Se distingue el intercambio tácticamente no concluyente de su efecto estratégico decisivo. Estados Unidos se asocia por ubicación y consecuencia, no por participación naval directa en la batalla."
  }),
  "Batalla naval de la bahía de Quiberon (1759)": historicalFix({
    parent: "Guerra de los Siete Años",
    campaign: "Campaña naval francesa de 1759",
    region: "Bahía de Quiberon, Bretaña, Francia",
    hierarchySources: [SOURCES.quiberonRmg, SOURCES.quiberonArchive],
    startYear: 1759,
    type: "batalla naval",
    scale: "internacional",
    participants: [
      { side: "Flota británica", members: ["Reino de Gran Bretaña"] },
      { side: "Flota francesa de Brest", members: ["Reino de Francia"] }
    ],
    cause: "La flota francesa salió de Brest para apoyar un proyecto de invasión de las islas británicas y fue perseguida por la fuerza de bloqueo de Edward Hawke.",
    outcome: "La flota británica obtuvo una victoria decisiva, capturó o destruyó varios navíos y dejó al resto de la fuerza francesa dispersa o atrapada.",
    consequences: "La derrota canceló el proyecto inmediato de invasión y consolidó la superioridad naval británica durante la fase final de la Guerra de los Siete Años.",
    chronology: [
      { year: 1759, event: "La flota francesa aprovechó un temporal para salir del bloqueo de Brest." },
      { year: 1759, event: "Hawke la alcanzó el 20 de noviembre y la derrotó dentro de la bahía de Quiberon." }
    ],
    treaties: ["Tratado de París (1763)"],
    curationNote: "Se traduce Bay como bahía y se conserva el año para evitar nombres incompletos. Las pérdidas se describen por categorías sin fijar cifras discutidas."
  })
};
