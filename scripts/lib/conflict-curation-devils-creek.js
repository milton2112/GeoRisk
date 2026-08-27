function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  fortHuachuca: source(
    "Ejercito de EE. UU., Fort Huachuca: cronica de la campana de Geronimo y del combate de Devil's Creek",
    "https://home.army.mil/huachuca/application/files/9616/6577/8830/Vol_7_1999_Geronimo_Campaign.pdf"
  ),
  npsFortBowie: source(
    "Servicio de Parques Nacionales: salida chiricahua de mayo de 1885 y operacion militar desde Fort Bowie",
    "https://www.nps.gov/articles/ftbowie.htm"
  ),
  npsChiricahua: source(
    "Servicio de Parques Nacionales: contexto de la persecucion de los chiricahuas en 1885-1886",
    "https://home.nps.gov/fobo/learn/historyculture/the-chiricahua-apache.htm"
  )
};

function devilsCreekFix() {
  const parent = "Guerras apaches";
  const campaign = "Campa\u00f1a de Ger\u00f3nimo de 1885-1886";
  const hierarchySources = [SOURCES.fortHuachuca, SOURCES.npsFortBowie, SOURCES.npsChiricahua];

  return {
    parent,
    war: parent,
    campaign,
    type: "combate",
    conflictType: "colonial",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 1885,
    endYear: 1885,
    region: "Devil's Creek, montanas Mogollon, cerca de Alma, Nuevo Mexico, Estados Unidos",
    normalizedRegion: "Devil's Creek, montanas Mogollon, cerca de Alma, Nuevo Mexico, Estados Unidos",
    cause: "El combate se produjo durante la persecucion estadounidense de una partida chiricahua tras la salida de grupos de la reserva en mayo de 1885. Formo parte de la campana de 1885-1886 contra las bandas chiricahuas, en un contexto de desplazamiento forzoso, control de reservas y conflicto fronterizo.",
    outcome: "El destacamento de Estados Unidos y sus exploradores apaches subio hasta la posicion desde la que recibia fuego; la partida chiricahua se retiro y el destacamento encontro su campamento. La cronica militar registra tres heridos en la columna y dos caballos muertos, pero no permite consolidar bajas chiricahuas ni identificar con certeza un mando individual de la partida.",
    consequences: "El combate fue uno de los primeros contactos armados de la campana de 1885. No decidio la guerra ni detuvo la retirada de la partida hacia Mexico; la persecucion estadounidense y mexicana de los chiricahuas continuo durante 1885-1886.",
    chronology: [
      { year: 1885, event: "En mayo, grupos chiricahuas abandonaron la reserva y el Ejercito de Estados Unidos inicio una nueva persecucion." },
      { year: 1885, event: "El 22 de mayo, una columna estadounidense con exploradores apaches fue atacada en Devil's Creek, cerca de Alma, Nuevo Mexico." },
      { year: 1885, event: "La partida chiricahua se retiro tras el combate; la campana continuo en la frontera entre Estados Unidos y Mexico." }
    ],
    treaties: [],
    related: [parent, campaign, "Chiricahua Apache", "Fort Apache", "Alma, Nuevo Mexico"],
    participants: [
      {
        side: "Columna del Ejercito de Estados Unidos y exploradores apaches",
        members: ["Estados Unidos", "4.\u00ba Regimiento de Caballeria de Estados Unidos", "Exploradores apaches"],
        casualties: "Tres heridos y dos caballos muertos, segun la cronica militar"
      },
      {
        side: "Partida chiricahua",
        members: ["Chiricahua Apache", "Partida apache chiricahua"],
        casualties: "No consolidado en las fuentes revisadas"
      }
    ],
    hierarchyConfidence: "alta",
    hierarchySources: hierarchySources.map(item => ({ label: item.label, url: item.url })),
    datePrecision: "22 de mayo de 1885",
    sourceDispute: true,
    curationPriority: "alta",
    curationBatch: "source-backed-devils-creek-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "Las fuentes revisadas vinculan la accion con la campana de Geronimo, pero no permiten fijar a Geronimo como mando individual presente en Devil's Creek. La ficha no convierte a todos los apaches en un unico bando: distingue a los exploradores apaches que acompa\u00f1aban a la columna estadounidense de la partida chiricahua perseguida. Tampoco atribuye bajas chiricahuas no verificadas."
  };
}

export const DEVILS_CREEK_CONFLICT_RENAMES = {
  "Batalla de Devil's Creek": "Combate de Devil's Creek (1885)",
  "Batalla de Devils Creek": "Combate de Devil's Creek (1885)",
  "Combate de Devil's Creek": "Combate de Devil's Creek (1885)",
  "Battle of Devil's Creek": "Combate de Devil's Creek (1885)",
  "Devil's Creek Battle": "Combate de Devil's Creek (1885)"
};

export const DEVILS_CREEK_CONFLICT_DETAIL_FIXES = {
  "Combate de Devil's Creek (1885)": devilsCreekFix()
};
