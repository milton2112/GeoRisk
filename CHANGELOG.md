# GeoRisk Changelog

Este proyecto usa versionado semantico:

- `MAJOR`: cambios grandes o incompatibles.
- `MINOR`: nuevas funciones importantes sin romper compatibilidad.
- `PATCH`: fixes, pulido y ajustes menores.

## v1.6.0

Actualizacion de producto orientada a uso real y crecimiento futuro.

- Radar de riesgo ampliado con capas por dimension militar, economica, diplomatica, interna y territorial.
- Radar con UI bajo demanda, lentes de escenario, factor principal por pais y mejor lectura analitica.
- Vista interna "Auditoria de conflictos" conectada al reporte generado para ver top problemas sin abrir JSON.
- Nueva tanda de curaduria segura para batallas europeas modernas, con parentado guerra > batalla y detalle estable.
- Servidor local de smoke test con prueba automatica para revisar el shell sin depender del browser plugin.
- Auditoria real de conflictos sobre el dataset completo con reporte de ingles, duplicados, bandos genericos, batallas sin padre y detalle flojo.
- Sugerencias automaticas de normalizacion para conflictos en `reports/conflict-autofix-suggestions.json`.
- Autofix seguro de conflictos con renombres explicitos, deduplicacion cronologica, padres de batallas y reporte de cambios aplicados.
- Medicion local de peso de arranque y checklist de release automatica antes de subir cambios.
- Ficha pais con bloque "Que falta curar" para orientar la curaduria pendiente.
- Noticias, comparador y quiz dejan de bloquear el HTML inicial y pasan a carga diferida por panel.
- Optimizacion progresiva del arranque: indice inicial compacto, fichas por pais bajo demanda y dataset completo diferido.
- Service worker mas liviano y tolerante a fallas parciales de precache.
- Cache runtime con limite para evitar crecimiento indefinido durante sesiones largas.
- Portada con estado runtime de arranque, dataset, offline, perfil de render y cobertura actual del dataset.
- Pulido de copy visible, acentos y textos de onboarding para reducir errores tipograficos en la interfaz.
- Panel de salud del dataset mas accionable, con mapa de cobertura por timeline, conflictos, idiomas, capitales, relaciones, simbolos y procedencia.
- Perfil de render con texto estable y sin mojibake, mas cacheo de metricas de portada para evitar recomputos innecesarios.
- Exportaciones diferidas: html2canvas y jsPDF ya no bloquean el shell inicial y se cargan solo al exportar.
- Estados vacios, mobile y modales con mejor lectura, tactilidad y feedback visual.
- Accion visible para limpiar cache local cuando una version vieja queda pegada.
- Titulares reales dentro del hub de noticias con varias cabeceras en vivo por pais cuando la fuente responde.
- Mas categorias de quiz: idiomas, bloques y conflictos.
- Comparador mas profundo con calidad del dataset, alcance diplomatico, idiomas, exposicion conflictiva y mas lectura estrategica.
- Nuevas capas tematicas: calidad del dataset, diversidad linguistica y alcance diplomatico.
- Modos de producto mas marcados para analisis, enciclopedia y presentacion.
- Exportaciones tipo informe con cabecera editorial y contexto de vista.
- Changelog visible mas rico dentro de la app.
- Documentacion ampliada con plan de futura API/backend simple.

## v1.5.0

Actualizacion amplia de producto, arquitectura y curaduria.

- Modularizacion parcial del frontend con separacion de runtime, texto, theme, comparador, quiz, ficha y timeline/conflictos.
- Refuerzo del matching entre GeoJSON y dataset para territorios, estados parcialmente reconocidos y nombres alternativos del mapa.
- Curaduria mas profunda de conflictos, timeline, relaciones internacionales y metadata del dataset.
- Mejora fuerte de modos de producto: portada, analisis geopolitico, enciclopedia y presentacion.
- Mejora de la ficha modal con mejor jerarquia, navegacion interna, mini metricas, simbolos y lectura de procedencia.
- Mejora del panel de salud del dataset, documentacion visible desde la app y estado offline.
- Mejora de exportacion, favoritos, vistas guardadas, contraste, foco visible y tactilidad mobile.

## v1.4.0

Actualizacion amplia de datos, mapa e interfaz.

- Curaduria fuerte del dataset y validacion automatica.
- Mejora de ficha modal, comparador y hub de noticias.
- Pulido del mapa 2D/3D, capas tematicas y buscador.
- Reorganizacion visual de paneles y hubs.
- Mejora de trazabilidad, calidad y estructura del proyecto.

## Convencion recomendada para futuras subidas

- `v1.5.1` para fixes o pulido chico.
- `v1.6.0` para nuevas funciones importantes.
- `v2.0.0` si una actualizacion rompe estructura o experiencia anterior.
