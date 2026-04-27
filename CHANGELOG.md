# GeoRisk Changelog

Este proyecto usa versionado semantico:

- `MAJOR`: cambios grandes o incompatibles.
- `MINOR`: nuevas funciones importantes sin romper compatibilidad.
- `PATCH`: fixes, pulido y ajustes menores.

## v1.6.0

Actualizacion de producto orientada a uso real y crecimiento futuro.

- Optimizacion progresiva del arranque: indice inicial compacto, fichas por pais bajo demanda y dataset completo diferido.
- Service worker mas liviano y tolerante a fallas parciales de precache.
- Cache runtime con limite para evitar crecimiento indefinido durante sesiones largas.
- Portada con estado runtime de arranque, dataset, offline y perfil de render.
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
