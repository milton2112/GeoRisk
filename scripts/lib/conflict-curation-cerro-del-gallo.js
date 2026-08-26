function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = [
  source(
    "Ejercito de Chile: la Batalla de Cerro Grande se libro en La Serena el 29 de abril de 1859 durante la Revolucion de 1859",
    "https://ejercito.cl/efemerides/efemerides/MTA5"
  ),
  source(
    "Municipalidad de La Serena: resena local de la Batalla de Cerro Grande y su ubicacion en las faldas del Cerro Grande",
    "https://patrimonio.laserena.cl/"
  )
];

export const CERRO_DEL_GALLO_COUNTRY_CONFLICT_EXCLUSIONS = {
  "México": ["Batalla de Cerro del Gallo"]
};

export const CERRO_DEL_GALLO_CURATORIAL_NOTES = {
  "Batalla de Cerro del Gallo": {
    action: "eliminar",
    reason: "La entrada mexicana no incluye fecha, ubicacion, bandos ni fuente propia. Su candidato de auditoria conserva como procedencia la pagina Batalla de Cerro Grande, fechada el 29 de abril de 1859 en La Serena, Chile. Cerro del Gallo y Cerro Grande son toponimos distintos: para no trasladar una batalla chilena a Mexico ni confundirla con acciones mexicanas homonimas de otros anos, el registro contaminado se excluye.",
    sources: SOURCES.map(item => ({ label: item.label, url: item.url }))
  }
};
