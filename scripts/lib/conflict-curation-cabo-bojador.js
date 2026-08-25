function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = [
  source(
    "Marinha de Portugal: la pasada del cabo Bojador por Gil Eanes en 1434 se registra como expedición de navegación y exploración",
    "https://www.marinha.pt/pt/a-marinha/historia/servir-portugal"
  ),
  source(
    "Academia de Marinha: estudio histórico sobre las navegaciones atlánticas y la pasada definitiva de Gil Eanes en 1434",
    "https://academia.marinha.pt/pt/academiademarinha/Edies/Memorias%202008_NET.pdf"
  )
];

export const CABO_BOJADOR_COUNTRY_CONFLICT_EXCLUSIONS = {
  Marruecos: ["Batalla de Cabo Bojador"]
};

export const CABO_BOJADOR_CURATORIAL_NOTES = {
  "Batalla de Cabo Bojador": {
    action: "eliminar",
    reason: "Las fuentes institucionales consultadas identifican el cabo Bojador como un promontorio geográfico y la acción de 1434 como una expedición de navegación de Gil Eanes. No documentan una batalla con ese nombre, fecha, bandos o resultado verificables; el registro se excluye en vez de convertir una exploración en conflicto armado.",
    sources: SOURCES.map(item => ({ label: item.label, url: item.url }))
  }
};
