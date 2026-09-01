function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Acci\u00f3n naval de Tatamagouche (15 de junio de 1745)";
const PARENT = "Guerra del rey Jorge (1744-1748)";
const CAMPAIGN = "Operaciones de socorro de Louisbourg desde Acadia (junio de 1745)";

const SOURCES = {
  canadianMilitaryJournal: source(
    "Canadian Military Journal, Gobierno de Canada: estudio de Alan Anderson Lockerby sobre el encuentro naval de Tatamagouche, basado en el diario de William Pote y en relatos contemporaneos",
    "https://publications.gc.ca/collections/collection_2024/mdn-dnd/D12-8-23-4-eng.pdf"
  ),
  parksCanada: source(
    "Parks Canada: la alianza politica y militar Mi'kmaq-francesa reconoce a los Mi'kmaq como pueblo soberano, no como un simple auxiliar frances",
    "https://www.pc.gc.ca/apps/dfhd/page_nhs_fra.aspx?id=14280"
  ),
  novaScotiaAcadianAffairs: source(
    "Nova Scotia Acadian Affairs: cronologia de Louisbourg, su caida en 1745 y su devolucion a Francia por el Tratado de Aquisgran de 1748",
    "https://acadien.novascotia.ca/en/timeline"
  )
};

function tatamagouche1745Fix() {
  const hierarchySources = [
    SOURCES.canadianMilitaryJournal,
    SOURCES.parksCanada,
    SOURCES.novaScotiaAcadianAffairs
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "accion naval y costera",
    conflictType: "colonial",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1745,
    endYear: 1745,
    region: "Bahia de Tatamagouche y estrecho de Northumberland, actual Nueva Escocia, Canada",
    normalizedRegion: "Tatamagouche, Nueva Escocia, Canada",
    cause: "Durante el sitio anglo-americano de Louisbourg, las fuerzas francesas y sus aliados de las Primeras Naciones reunieron hombres, canoas, naves y provisiones en Tatamagouche para socorrer la fortaleza. El mando anglo-americano separo tres balandras para interceptar la comunicacion maritima y evitar que la fuerza de Paul Marin llegara a Louisbourg.",
    outcome: "Exito operativo anglo-americano: las balandras de Daniel Fones impidieron que la fuerza de socorro de Paul Marin saliera de Tatamagouche Bay hacia Louisbourg. Las fuerzas francesas y aliadas se replegaron y prepararon una posicion defensiva; Fones eligio bloquearlas en vez de perseguirlas en tierra. La ficha no presenta una destruccion total de la fuerza francesa ni consolida cifras incompatibles de bajas.",
    consequences: "La accion impidio que ese refuerzo concreto llegara a Louisbourg antes de la caida de la fortaleza en 1745, pero GeoRisk no atribuye por si sola la rendicion de Louisbourg a Tatamagouche. El Tratado de Aquisgran de 1748 devolvio Louisbourg a Francia dentro del cierre general de la Guerra del rey Jorge.",
    chronology: [
      {
        year: 1744,
        event: "La Guerra del rey Jorge amplio la rivalidad colonial en el Atlantico nororiental; la alianza Mi'kmaq-francesa participaba como alianza politica y militar, no como una fuerza francesa indiferenciada."
      },
      {
        year: 1745,
        event: "Durante el sitio de Louisbourg, Paul Marin recibio ordenes de reunir una fuerza de socorro en Acadia. El diario de William Pote registra el cruce de Cobequid con guerreros Mi'kmaq y tropas francesas, seguido por la concentracion de canoas y naves en Tatamagouche."
      },
      {
        year: 1745,
        event: "El 15 de junio, tres balandras anglo-americanas bajo Daniel Fones sorprendieron a la fuerza de Marin en Tatamagouche Bay. Hubo combate naval, fuego contra posiciones costeras y un intento frances de abordaje antes de la retirada hacia la bahia."
      },
      {
        year: 1745,
        event: "Fones bloqueo la salida de la bahia y la fuerza de socorro no alcanzo Louisbourg antes de la caida de la fortaleza. La ficha evita convertir esa interdiccion en la unica causa de la capitulacion."
      },
      {
        year: 1748,
        event: "El Tratado de Aquisgran devolvio Louisbourg a Francia, cerrando la fase general de la Guerra del rey Jorge sin borrar los objetivos propios de las comunidades Mi'kmaq."
      }
    ],
    treaties: [
      "Tratado de Aquisgran (1748): cierre general de la Guerra del rey Jorge y devolucion de Louisbourg a Francia"
    ],
    related: [
      PARENT,
      CAMPAIGN,
      "Sitio de Louisbourg (1745)",
      "Tatamagouche",
      "estrecho de Northumberland",
      "Paul Marin de La Malgue",
      "Daniel Fones",
      "David Donahew",
      "Mi'kmaq",
      "Troupes de la Marine"
    ],
    participants: [
      {
        side: "Fuerza francesa y aliados Mi'kmaq y de las Primeras Naciones",
        members: [
          "Nueva Francia",
          "Troupes de la Marine",
          "aliados Mi'kmaq",
          "guerreros de las Primeras Naciones",
          "Paul Marin de La Malgue"
        ],
        casualties: "El diario de Pote no registra muertos entre los guerreros protegidos tras el malecon durante una fase del combate, mientras que Fones informo muertos y heridos en la fuerza opuesta. Esas referencias son parciales y no ofrecen una tabla bilateral comparable, por lo que GeoRisk no fija un total de bajas."
      },
      {
        side: "Balandras anglo-americanas de Nueva Inglaterra",
        members: [
          "colonias de Nueva Inglaterra",
          "balandra Tartar",
          "balandra Bonetta",
          "balandra Resolution",
          "Daniel Fones",
          "David Donahew"
        ],
        casualties: "Las fuentes consultadas describen fuego, abordajes y danos, pero no aportan una cifra coherente y comparable de muertos y heridos de las balandras. GeoRisk conserva la ausencia de una baja total cerrada."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "15 de junio de 1745",
    sourceDispute: "La accion aparece como Naval battle off Tatamagouche, Tatamagouche Naval Encounter y Battle of Famme Goose Bay. El estudio del Canadian Military Journal prioriza el diario de William Pote: un memorial posterior atribuye la accion a David Donahew, mientras que el analisis sostiene que Daniel Fones merece reconocimiento central. Pote no registra muertos entre los guerreros protegidos en una fase y Fones habla de muertos y heridos en la fuerza opuesta; no existe un total compatible. GeoRisk no absorbe a los Mi'kmaq dentro de Francia ni convierte a Canada o Estados Unidos actuales en beligerantes de 1745.",
    curationPriority: "alta",
    curationBatch: "source-backed-tatamagouche-1745-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior figuraba como Batalla naval de Tatamagouche, solo en Francia y bajo un conflicto regional de Europa, sin fecha, contraparte, lugar, jerarquia, resultado ni fuentes. Se normaliza como Accion naval de Tatamagouche (15 de junio de 1745), se localiza en la actual Nueva Escocia y se organiza bajo la Guerra del rey Jorge. Canada y Estados Unidos se agregan solo como referencias de navegacion del mapa actual; los participantes conservan entidades y comunidades historicas. La correccion diferencia las evidencias de bajas y mando, no inventa cifras y mantiene visible la autonomia de la alianza Mi'kmaq."
  };
}

export const TATAMAGOUCHE_1745_CONFLICT_RENAMES = {
  "Batalla naval de Tatamagouche": CANONICAL,
  "Accion naval de Tatamagouche": CANONICAL,
  "Acci\u00f3n naval de Tatamagouche": CANONICAL,
  "Accion naval de Tatamagouche (15 de junio de 1745)": CANONICAL,
  "Acci\u00f3n naval de Tatamagouche (15 de junio de 1745)": CANONICAL,
  "Naval battle off Tatamagouche": CANONICAL,
  "Naval Battle off Tatamagouche": CANONICAL,
  "Battle of Tatamagouche": CANONICAL,
  "Batalla de Famme Goose Bay": CANONICAL,
  "Battle of Famme Goose Bay": CANONICAL,
  "Tatamagouche Naval Encounter": CANONICAL
};

export const TATAMAGOUCHE_1745_COUNTRY_CONFLICT_ADDITIONS = {
  "Canad\u00e1": [CANONICAL],
  "Estados Unidos": [CANONICAL]
};

export const TATAMAGOUCHE_1745_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: tatamagouche1745Fix()
};
