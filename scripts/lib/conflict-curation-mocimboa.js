function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  stateDepartment: source(
    "Departamento de Estado de EE.UU.: ataque y ocupación de Mocímboa da Praia entre el 9 y el 11 de agosto de 2020",
    "https://2021-2025.state.gov/reports/country-reports-on-terrorism-2020/mozambique/"
  ),
  acled: source(
    "ACLED Cabo Ligado: caída de la guarnición y ocupación insurgente del puerto en agosto de 2020",
    "https://acleddata.com/update/cabo-ligado-monthly-august-2020"
  ),
  unitedNations: source(
    "Naciones Unidas: ataque mayor de agosto de 2020 y ocupación del puerto durante más de un año",
    "https://digitallibrary.un.org/record/4042754/files/1401703-EN.pdf"
  )
};

function offensiveFix({
  parent,
  campaign,
  region,
  hierarchySources,
  participants,
  cause,
  outcome,
  consequences,
  chronology
}) {
  const sources = hierarchySources.filter(Boolean);
  return {
    parent,
    war: parent,
    campaign,
    type: "ofensiva insurgente",
    conflictType: "insurgencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    startYear: 2020,
    endYear: 2020,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties: [],
    related: [...new Set([parent, campaign, "Cabo Delgado", "Mocímboa da Praia"].filter(Boolean))],
    participants,
    hierarchyConfidence: sources.every(item => item.confidence === "alta") ? "alta" : "media",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-mocimboa-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    sourceDispute: true,
    curationNote: "La ficha nombra la ofensiva de agosto de 2020, no toda la insurgencia. La denominación ISIS-Mozambique se conserva como formulación atribuida al Departamento de Estado de EE.UU.; bajas, efectivos y una cadena de mando más precisa no se consolidan porque las fuentes no coinciden plenamente."
  };
}

export const MOCIMBOA_CONFLICT_RENAMES = {
  "Batalla de Mocímboa da Praia": "Ofensiva de Mocímboa da Praia (agosto de 2020)",
  "Batalla de Mocimboa da Praia": "Ofensiva de Mocímboa da Praia (agosto de 2020)"
};

export const MOCIMBOA_CONFLICT_DETAIL_FIXES = {
  "Ofensiva de Mocímboa da Praia (agosto de 2020)": offensiveFix({
    parent: "Insurgencia de Cabo Delgado (desde 2017)",
    campaign: "Ofensiva insurgente de Mocímboa da Praia de agosto de 2020",
    region: "Mocímboa da Praia, provincia de Cabo Delgado, Mozambique",
    hierarchySources: [SOURCES.stateDepartment, SOURCES.acled, SOURCES.unitedNations],
    participants: [
      { side: "Fuerzas de seguridad mozambiqueñas", members: ["Fuerzas de seguridad de Mozambique"] },
      { side: "Insurgentes de Cabo Delgado", members: ["Grupo armado no estatal local, denominado ISIS-Mozambique por el Departamento de Estado de EE.UU."] }
    ],
    cause: "En el marco de la insurgencia iniciada en Cabo Delgado en 2017, los insurgentes atacaron el puerto estratégico de Mocímboa da Praia para desplazar a las fuerzas estatales y controlar un nodo costero relevante.",
    outcome: "Los insurgentes capturaron y ocuparon la ciudad portuaria entre el 9 y el 11 de agosto de 2020. Las autoridades mozambiqueñas perdieron el control local durante más de un año; no se consolidan bajas porque los recuentos publicados difieren.",
    consequences: "La caída de la guarnición marcó una escalada de la insurgencia, agravó el desplazamiento civil y reforzó la preocupación regional e internacional por Cabo Delgado. Fuerzas mozambiqueñas y aliadas retomaron la ciudad en agosto de 2021.",
    chronology: [
      { year: 2020, event: "Entre el 9 y el 11 de agosto, insurgentes atacaron y ocuparon Mocímboa da Praia." },
      { year: 2020, event: "Tras la caída de la guarnición, los insurgentes mantuvieron el control de la ciudad portuaria." },
      { year: 2021, event: "En agosto, fuerzas mozambiqueñas y aliadas recuperaron la ciudad tras más de un año de ocupación insurgente." }
    ]
  })
};
