function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const CANONICAL = "Batalla naval de Saint-Martin-de-R\u00e9 (26-27 de octubre de 1622)";
const PARENT = "Primera rebeli\u00f3n hugonote (1621-1622)";
const CAMPAIGN = "Operaciones navales de La Rochelle e isla de R\u00e9 (octubre de 1622)";

const SOURCES = {
  laRochelleCulture: source(
    "Ville de La Rochelle, Direction Culture et Patrimoine: nota historica municipal sobre la batalla naval ganada frente a Saint-Martin-de-Re y la politica de fortificaciones reales de 1622",
    "https://www.larochelle.fr/fileadmin/mediatheque/kiosque/Francais/Journal_municipal/Journal_municipal_-_Mars_2025.pdf"
  ),
  laRochelleMuseum: source(
    "Musee des Beaux-Arts de La Rochelle: dossier pedagogico sobre Jean Guiton, los enfrentamientos de 1622 y la resistencia rochelaise",
    "https://museedesbeauxarts.larochelle.fr/fileadmin/mediatheque_musee_beaux_arts/Dossiers_pedagogiques/Le_Grand_siege_1628.pdf"
  ),
  maritimeAcademy: source(
    "Academie des arts et sciences de la mer, Sillages: reconstruccion de la campana naval de 1622, sus fuerzas aproximadas y el repliegue rochelais",
    "https://www.academie-arts-sciences-mer.fr/sillages/Sillages37.pdf"
  )
};

function saintMartinRe1622Fix() {
  const hierarchySources = [
    SOURCES.laRochelleCulture,
    SOURCES.laRochelleMuseum,
    SOURCES.maritimeAcademy
  ];

  return {
    parent: PARENT,
    war: PARENT,
    campaign: CAMPAIGN,
    type: "batalla naval",
    conflictType: "civil",
    scale: "regional",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1622,
    endYear: 1622,
    region: "Frente a Saint-Martin-de-Re e isla de Re, costa atlantica de Francia",
    normalizedRegion: "Saint-Martin-de-Re, isla de Re, Francia",
    cause: "En la primera rebelion hugonote, la flota de La Rochelle bajo Jean Guiton trataba de sostener la autonomia politica y religiosa de la ciudad frente a la concentracion naval de la Corona francesa. La fuerza real de Charles de Guise avanzo hacia el litoral rochelais para imponer la autoridad de Luis XIII y limitar la capacidad maritima de los rebeldes.",
    outcome: "Ventaja tactica real sin decision estrategica concluyente: la flota de La Rochelle se replego despues del combate frente a Saint-Martin-de-Re, pero la accion no tomo La Rochelle ni liquido la resistencia hugonote. Algunas fuentes locales la llaman victoria real y otras historiografias la clasifican como encuentro inconcluso; GeoRisk conserva ambos matices y no fija bajas ni numero de disparos como hechos cerrados.",
    consequences: "La accion reforzo la presion real sobre el acceso maritimo de La Rochelle y el proyecto de fortificaciones costeras, pero no cerro por si sola el conflicto. El Tratado de Montpellier de 1622 formalizo el cierre de la primera rebelion hugonote, mientras que las hostilidades navales y politicas reaparecieron en 1625 y culminaron mas tarde en el sitio de La Rochelle de 1627-1628.",
    chronology: [
      {
        year: 1621,
        event: "La primera rebelion hugonote enfrento a la Corona francesa con ciudades y fuerzas protestantes, entre ellas La Rochelle."
      },
      {
        year: 1622,
        event: "Jean Guiton dirigio la flota de La Rochelle en operaciones contra posiciones y naves reales antes del choque frente a la isla de Re."
      },
      {
        year: 1622,
        event: "Entre el 26 y el 27 de octubre, la flota real dirigida por Charles de Guise y la flota rochelaise se enfrentaron frente a Saint-Martin-de-Re. Las fuentes difieren entre una datacion de dos dias y una fecha central del 27."
      },
      {
        year: 1622,
        event: "La flota de La Rochelle se replego; la Corona mantuvo la presion sobre la ciudad y promovio fortificaciones en la costa sin capturar La Rochelle en esta accion."
      },
      {
        year: 1625,
        event: "La confrontacion entre La Rochelle y la Corona se reanudo en una nueva fase, por lo que GeoRisk no presenta el resultado de 1622 como una solucion definitiva."
      }
    ],
    treaties: [
      "Tratado de Montpellier (1622): cierre formal de la primera rebelion hugonote"
    ],
    related: [
      PARENT,
      CAMPAIGN,
      "La Rochelle",
      "isla de Re",
      "Saint-Martin-de-Re",
      "Jean Guiton",
      "Charles de Guise",
      "Luis XIII",
      "Tratado de Montpellier (1622)",
      "Sitio de La Rochelle (1627-1628)"
    ],
    participants: [
      {
        side: "Flota real francesa",
        members: [
          "Reino de Francia",
          "Corona de Luis XIII",
          "flota real francesa",
          "Charles de Guise"
        ],
        casualties: "Las fuentes consultadas coinciden en la superioridad material real, pero no entregan una tabla bilateral verificable de muertos y heridos. GeoRisk no transforma los recuentos variables de naves o relatos posteriores en un total de bajas."
      },
      {
        side: "Flota hugonote de La Rochelle",
        members: [
          "comunidad protestante de La Rochelle",
          "flota de La Rochelle",
          "Jean Guiton"
        ],
        casualties: "La retirada rochelaise esta documentada, pero las cifras de buques, disparos y perdidas cambian segun los relatos. La ficha conserva la ausencia de una cifra cerrada de bajas hugonotes."
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "26-27 de octubre de 1622; la datacion mas extendida concentra el encuentro el 27",
    sourceDispute: "La accion aparece como batalla naval de Saint-Martin-de-Re, Naval battle of Saint-Martin-de-Re y combate frente a la isla de Re. La cronologia maritima de la Academie des arts et sciences de la mer describe combates el 26 y 27, mientras que muchas sintesis fechan el encuentro el 27. Las fuentes locales hablan de victoria real y otras obras de referencia de combate inconcluso; GeoRisk lo resume como ventaja tactica real sin decision estrategica concluyente. Los efectivos atribuidos a ambas flotas y las bajas no son consistentes, por lo que no se fijan cifras.",
    curationPriority: "alta",
    curationBatch: "source-backed-saint-martin-re-1622-2026-09",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "La entrada anterior llego como Naval Batalla de Saint-Martin-de-Re, solo en Francia y bajo un conflicto regional de Europa, sin fecha, contraparte, lugar, jerarquia ni fuentes. Se normaliza como Batalla naval de Saint-Martin-de-Re (26-27 de octubre de 1622), se organiza dentro de la primera rebelion hugonote y se corrige el tipo de interestatal a civil. No se agrega un Estado moderno contraparte porque ambas fuerzas pertenecen al espacio politico frances de la epoca; los participantes diferencian la Corona y la comunidad protestante de La Rochelle."
  };
}

export const SAINT_MARTIN_RE_1622_CONFLICT_RENAMES = {
  "Naval Batalla de Saint-Martin-de-Re": CANONICAL,
  "Naval Batalla de Saint-Martin-de-R\u00e9": CANONICAL,
  "Batalla naval de Saint-Martin-de-Re": CANONICAL,
  "Batalla naval de Saint-Martin-de-R\u00e9": CANONICAL,
  "Batalla naval de Saint-Martin-de-Re (1622)": CANONICAL,
  "Batalla naval de Saint-Martin-de-R\u00e9 (1622)": CANONICAL,
  "Naval battle of Saint-Martin-de-Re": CANONICAL,
  "Naval battle of Saint-Martin-de-R\u00e9": CANONICAL,
  "Bataille navale de Saint-Martin-de-R\u00e9 (1622)": CANONICAL
};

export const SAINT_MARTIN_RE_1622_CONFLICT_DETAIL_FIXES = {
  [CANONICAL]: saintMartinRe1622Fix()
};
