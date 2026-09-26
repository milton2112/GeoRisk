# GeoRisk: reglas permanentes de trabajo

Todos los cambios deben responder a los criterios de green coding definidos en
`GREEN_CODING.md`. Leer tambien `CONTRIBUTING_INTERNAL.md` antes de implementar.

- Justificar el trabajo que se agrega: utilidad para el usuario, costo en CPU/GPU,
  red, memoria y almacenamiento. Preferir no ejecutar ni descargar lo innecesario.
- Respetar ahorro de datos, visibilidad y movimiento reducido; conservar accesibilidad,
  seguridad, exactitud de los datos, offline y compatibilidad con equipos modestos.
- Evitar precalculos especulativos, polling sin ciclo de vida, caches sin limite y
  nuevas dependencias cuando bastan las APIs y modulos existentes.
- Agregar pruebas proporcionadas. Usar comprobaciones pequenas durante la edicion
  y la puerta completa `npm run release:check` al cerrar una release. No reducir
  cobertura ni relajar presupuestos para conseguir resultados verdes.
- Documentar en el changelog el beneficio esperado, la evidencia y cualquier costo
  o limitacion. Comparar escenarios equivalentes; no afirmar ahorro energetico o
  de CO2 a partir de bytes, FPS o tiempos sin medicion/modelo validado.
- Conservar trabajo ajeno. No borrar datos, fuentes ni historial para ahorrar espacio.
