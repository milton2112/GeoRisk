const name = "Combate de Caleta Foca (1982)";
const parent = "Guerra de las Malvinas";
const region = "Caleta Foca, isla Soledad (East Falkland), islas Malvinas/Falkland, Atl\u00e1ntico Sur";

export const CALETA_FOCA_CONFLICT_RENAMES = {
  "Combate de Caleta Foca": name,
  "Combate de caleta Foca": name,
  "Battle of Seal Cove": name
};

export const CALETA_FOCA_COUNTRY_CONFLICT_ADDITIONS = {
  Argentina: [name],
  "Reino Unido": [name]
};

export const CALETA_FOCA_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent, war: parent, campaign: "Operaciones navales de las Malvinas (1982)", related: [parent],
    startYear: 1982, endYear: 1982, datePrecision: "23 de mayo de 1982",
    type: "combate naval", conflictType: "interestatal", scale: "local",
    status: "historico", active: false, ongoing: false,
    region, normalizedRegion: region,
    cause: "Intercepci\u00f3n brit\u00e1nica del transporte argentino ARA Monsunen durante una misi\u00f3n de suministro en la guerra de las Malvinas.",
    outcome: "Seg\u00fan la COAC, el Monsunen repeli\u00f3 helic\u00f3pteros y recibi\u00f3 fuego naval; se var\u00f3 para evitar su destrucci\u00f3n. El proyecto parlamentario registra su recuperaci\u00f3n por la tripulaci\u00f3n al amanecer. No se declara una victoria decisiva.",
    consequences: "El Forrest acudi\u00f3 en apoyo y transport\u00f3 la carga. La captura posterior del Monsunen en Darwin, el 29 de mayo, es distinta del combate del 23 y no su resultado inmediato.",
    participants: [
      {
        side: "Transporte y dotaci\u00f3n argentinos",
        members: ["Argentina", "ARA Monsunen", "Jorge A. Gopcevich Canevari", "Personal de la Armada y del Ej\u00e9rcito argentinos"],
        casualties: "COAC: algunos heridos leves durante el desembarco. El proyecto parlamentario menciona dos heridos. No se fija un total ni se convierte la ausencia de cifra de muertos en cero"
      },
      {
        side: "Fuerzas navales brit\u00e1nicas",
        members: ["Reino Unido", "HMS Brilliant", "HMS Yarmouth", "Helic\u00f3pteros navales brit\u00e1nicos"],
        casualties: "Sin recuento bilateral consolidado en las fuentes citadas; no equivale a cero. No se adopta un helic\u00f3ptero derribado como hecho verificado"
      }
    ],
    chronology: [
      { year: 1982, event: "El 23 de mayo, el Monsunen recibi\u00f3 fuego naval y se var\u00f3; la COAC registra la salida del Forrest en su apoyo ese d\u00eda." },
      { year: 1982, event: "El proyecto parlamentario sit\u00faa la recuperaci\u00f3n del Monsunen al amanecer y el transbordo posterior de la carga al Forrest." },
      { year: 1982, event: "El 29 de mayo, el Monsunen fue capturado tras la ca\u00edda de Darwin/Pradera del Ganso, seg\u00fan el proyecto parlamentario; no es la fecha del combate de Caleta Foca." }
    ],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      { label: "Armada Argentina, COAC, componente naval (1983): cronolog\u00eda del 23 de mayo, p\u00e1gina 114 del PDF (numeraci\u00f3n interna 31)", url: "https://www.argentina.gob.ar/sites/default/files/ar-ara-coac-7b5.pdf" },
      { label: "C\u00e1mara de Diputados, expediente 1111-D-2026: fundamentos del proyecto de reconocimiento del Monsunen, no una resoluci\u00f3n aprobada", url: "https://rest.hcdn.gob.ar/web/tramites-parlamentarios/render/adjunto/69d3b9b78c1e4.pdf" }
    ],
    sourceDispute: "La COAC no confirma un derribo del helic\u00f3ptero, a diferencia del proyecto parlamentario de 2026. Describe heridos leves sin total; el proyecto menciona dos. La COAC ubica la acci\u00f3n al sur de ensenada Luisa; no se asignan coordenadas finas con estos relatos.",
    curationPriority: "alta", curationBatch: "source-backed-caleta-foca-2026-10",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "La campa\u00f1a es descriptiva. Son fuentes argentinas, no una verificaci\u00f3n bilateral completa. El texto de 2026 es un proyecto de resoluci\u00f3n, no una norma aprobada; no prueba por s\u00ed solo un derribo ni permite cerrar cifras de bajas. Los nombres geogr\u00e1ficos no adjudican soberan\u00eda. No se inventa tratado ni se confunde la captura del 29 con el combate del 23 de mayo."
  }
};
