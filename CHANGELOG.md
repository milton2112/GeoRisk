# GeoRisk Changelog

Este proyecto usa versionado semantico:

- `MAJOR`: cambios grandes o incompatibles.
- `MINOR`: nuevas funciones importantes sin romper compatibilidad.
- `PATCH`: fixes, pulido y ajustes menores.

## Sin publicar

- Se documentaran aca los cambios posteriores a v1.6.51 antes de cerrar la siguiente version.

## v1.6.51 - 2026-07-11

- Mueve la resolucion exacta de paises, continentes, religiones, sistemas, organizaciones, idiomas, bloques, conflictos y categorias historicas a `app-search.js`, cargado bajo demanda.
- Reduce `searchMap` eliminando 184 lineas de ramas repetidas y evita reconstruir dos veces el contexto completo de aliases por consulta.
- Elimina fallbacks duplicados para rankings naturales de conflictos y organizaciones, usando un unico parser y una unica ruta de render.
- Corrige Enter en el buscador: ahora ejecuta el texto escrito y solo abre una sugerencia cuando el usuario la selecciona explicitamente con las flechas.
- Agrega pruebas de resolucion por fases, prioridad de paises, traduccion de continentes, rankings naturales y estado de teclado.
- Verifica en navegador pais, religion, conflicto, consulta natural y navegacion de sugerencias, en escritorio y a 390 x 844, sin errores de consola.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-11-release-4`.

## v1.6.50 - 2026-07-11

- Mueve el armado completo de la ficha pais, sus secciones, navegacion, calidad, curaduria y notas a `app-country-panel.js`, cargado bajo demanda.
- Reduce `script.js` de 575.274 a 555.189 bytes y acorta `renderCountry` para que el runtime critico conserve solo carga, estado y preparacion de datos.
- Evita calcular fuentes y calidad mientras esa seccion permanezca cerrada, reduciendo trabajo al abrir una ficha por primera vez.
- Corrige rotulos economicos, politicos y de conflictos que seguian en espanol al usar la interfaz en ingles.
- Agrega gates para impedir que el markup completo vuelva a `script.js` y pruebas unitarias de secciones diferidas y traduccion.
- Verifica en navegador Argentina desde busqueda, Economia, Fuentes, calidad, procedencia y agregado al comparador sin errores de consola.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-11-release-3`.

## v1.6.49 - 2026-07-11

- Hace idempotente la curaduria: dos ejecuciones consecutivas mantienen el mismo hash de todo `data/` y reportan cero cambios espurios.
- Evita vaciar y reescribir directorios completos de fichas, shards e indices; los JSON se escriben solo cuando cambia su contenido semantico.
- Reduce `maintain:quick` de unos 30 segundos a 22-24 segundos y elimina pasos duplicados de normalizacion/regeneracion.
- Deja las fichas compactas bajo responsabilidad exclusiva de `buildDataIndexes.js`, evitando que el autofix las infle para luego regenerarlas.
- Canonicaliza renombres de detalles sin reintroducir alias antiguos y consolida `Sitio de Nykobing` / `Sitio de Nykøbing` sin perder contenido.
- Corrige siete referencias de campana del generico `Teatro Asia-Pacifico` a `Guerra del Pacifico de la Segunda Guerra Mundial`.
- Unifica la normalizacion de conflictos entre autofix y auditoria, incluyendo transliteracion segura de `ø`, `æ`, `œ`, `ł`, `ð` y `þ`.
- Agrega pruebas de equivalencia JSON y de escritura fisica condicional para impedir churn por orden de claves.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-11-release-2`.

## v1.6.48 - 2026-07-11

- Mueve apertura de paises, favoritos, comparacion rapida, filtros de timeline/conflictos, exportacion y acciones de ficha a `app-country-panel.js`, cargado bajo demanda.
- Reduce `script.js` en unos 6,5 KB y agrega gates para impedir que el controlador completo vuelva al runtime critico.
- Corrige la primera busqueda por religion, sistema u organizacion cuando el indice avanzado aun no habia corrido en idle.
- Agrega avisos visuales accesibles para capas, favoritos, comparacion y exportaciones, reemplazando referencias a un notifier global inexistente.
- Endurece favoritos frente a JSON corrupto o cuota de almacenamiento llena y evita exportar nodos ausentes.
- Verifica en navegador el flujo `cristianismo` -> Argentina -> ficha -> Fuentes y amplia las pruebas de arquitectura, flujos y limpieza visual.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-11-release-1`.

## v1.6.47 - 2026-07-10

- Mueve textos estaticos, etiquetas de capas y traducciones extendidas a `app-text.js`, cargado despues del mapa inicial.
- Reduce `script.js` en mas de 20 KB sin sumar `app-text.js` al HTML ni al `APP_SHELL` critico.
- Completa traducciones de los modos Practica, Examen y Docente del quiz y mantiene Diplomacia en noticias.
- Agrega pruebas con DOM parcial y gates para impedir que el catalogo largo de textos vuelva al runtime inicial.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-10-release-3`.

## v1.6.46 - 2026-07-10

- Mueve el render del panel, metadatos y feedback del quiz a `app-quiz-ui.js`, cargado bajo demanda.
- Muestra feedback explicativo visible despues de responder y adapta el estado inicial del quiz al idioma activo.
- Agrega pruebas de render del quiz y un gate para impedir que su markup vuelva a `script.js`.
- Mueve el bloque completo de fuentes, procedencia y calidad de datos a `app-country-panel.js`, cargado solo al abrir una ficha.
- Reduce el runtime critico conservando score, cobertura, campos faltantes/estimados y fuentes por seccion con una prueba dedicada.
- Corrige valores de procedencia anidados que se mostraban como `[object Object]` y los convierte en estados legibles por seccion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-10-release-2`.

## v1.6.45 - 2026-07-10

- Mueve el parser completo de filtros semanticos a `app-search.js`, cargado solo al usar la busqueda.
- Conserva consultas por continente, religion, sistema, organizacion, idioma, conflicto, periodo y poblacion con cobertura automatizada.
- Reutiliza la lista cacheada de paises en rankings rapidos de busqueda y agrega gates para impedir que el parser pesado vuelva al arranque critico.
- Corrige `release:prepare` para fechar versiones y caches con el dia local de Buenos Aires, evitando releases adelantadas por UTC.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-10-release-1`.

## v1.6.44 - 2026-07-09

- Mueve las categorias pesadas del quiz al modulo diferido `app-quiz-ui.js`.
- Reduce `script.js` quitando el fallback legacy de preguntas de religion, idioma, bloques, conflictos y otros temas.
- Agrega gates para impedir que el fallback pesado del quiz vuelva al runtime critico.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-10`.

## v1.6.43 - 2026-07-09

- Mueve el armado de escenarios, filas y watchlist del radar de riesgo a `app-risk-radar-ui.js`.
- Reduce el trabajo y el peso de `script.js` manteniendo el radar como modulo diferido versionado.
- Agrega gates para impedir que helpers visuales del radar vuelvan al runtime critico.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-9`.

## v1.6.42 - 2026-07-09

- Limpia detalles de guerras duplicados que habian quedado mezclados dentro de `THEME_STYLES`.
- Reduce `script.js` quitando datos de conflicto que no se usaban para pintar capas tematicas.
- Agrega un gate para impedir que `THEME_STYLES` vuelva a mezclar `cause`, `participants` u otros campos de curaduria.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-8`.

## v1.6.41 - 2026-07-09

- Mueve estilos internos de auditoria, performance y curaduria visual a `style-polish.css` para que no bloqueen el primer mapa.
- Reduce `style.css` de ~86.8 KB a ~78.2 KB y deja margen real bajo el presupuesto critico de 90 KB.
- Agrega gates para impedir que el panel de rendimiento y la auditoria interna vuelvan a inflar el CSS critico.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-7`.

## v1.6.40 - 2026-07-09

- Extrae la jerarquia pesada guerra > campana > batalla a `app-conflict-rules.js`, cargada solo cuando se abre curaduria profunda, historia o fuerzas armadas.
- Reduce `script.js` de ~641 KB a ~625 KB y aumenta el margen del arranque critico sin perder la agrupacion completa de conflictos bajo demanda.
- Refuerza `startup-data`, `release-gates` y `smoke-server` para bloquear que las reglas pesadas vuelvan al shell inicial o falten en el build de produccion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-6`.

## v1.6.39 - 2026-07-09

- Mueve el fallback de busqueda de conflictos por `conflicts_index` a `app-search.js`, manteniendo fuera del arranque critico el fetch/cache de guerras y batallas.
- Baja `script.js` a ~641 KB y mantiene la busqueda de conflictos funcionando bajo demanda desde el modulo diferido de busqueda.
- Ajusta el snapshot de performance para simular el arranque en tandas bajo 200 ms: las long tasks simuladas quedan en 0 sobre presupuesto y la mayor baja a 168 ms.
- Refuerza tests de busqueda, arranque, flujos criticos y release gates para cubrir el nuevo fallback diferido y el presupuesto de long tasks.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-5`.

## v1.6.38 - 2026-07-09

- Compacta `countries_index.json` quitando previews inline de conflictos y `isCapital` redundante en capitales; los conflictos quedan en `conflicts_index` y shards bajo demanda.
- Baja `countries_index.json` de ~161 KB a ~141 KB y reduce el arranque critico sin perder `conflictCount` para rankings/contadores.
- Agrega fallback de busqueda de guerras/batallas contra `data/conflicts_index.json` para seguir marcando paises aunque el indice inicial no traiga conflictos embebidos.
- Refuerza `startup-data` y `critical-flows` para bloquear regresiones de datos pesados en el arranque y de busqueda de conflictos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-4`.

## v1.6.37 - 2026-07-09

- Mueve el pulido visual de estados activos de capas/rankings a `style-polish.css` para recuperar margen en el CSS critico.
- Baja `style.css` de ~89.9 KB a ~86.8 KB y deja margen real bajo el presupuesto de 90 KB.
- Conecta `test:critical-flows` a la auditoria de salud funcional para mapa, ficha, busqueda y rankings.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-3`.

## v1.6.36 - 2026-07-09

- Agrega un estado visible de capa activa en el panel de capas tematicas, con tipo de dato/proxy y boton activo mas claro.
- Agrega un estado visible de ranking activo para confirmar que los clicks de tops/rankings quedan seleccionados.
- Suma `test:critical-flows` para cubrir busqueda, rankings, continentes, religiones, apertura de ficha y seleccion en mapa como contrato de producto.
- Conecta `test:critical-flows` a `npm test` y a los release gates.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-2`.

## v1.6.35 - 2026-07-09

- Extrae el render de `Salud del dataset` a `app-project-audit-ui.js` para dejar el panel interno fuera del arranque critico.
- Mueve la construccion de tarjetas de `Auditoria de conflictos` a `app-conflict-audit-ui.js`, manteniendo en el runtime principal solo la apertura y los listeners de pais/conflicto.
- Extrae la tabla grande de alias de conflictos a `app-conflict-aliases.js`, cargada en idle o bajo demanda antes de detalles profundos.
- Reduce `script.js` de ~674 KB a ~638 KB y lo deja por debajo del umbral de observacion de 660 KB.
- Corrige `release:prepare` para que cierre el changelog con las notas reales de `Sin publicar` en lugar de escribir notas genericas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-09-release-1`.

## v1.6.34 - 2026-07-05

- Cura detalles visibles de conflictos importados con campos en ingles o coordenadas crudas: Becaa 2024, Endau, Amsterdam-Noord, Somalia 2009, Sirte 2016 y Monte Calvo.
- Corrige jerarquias y regiones de esos conflictos en fichas por pais: Somalia deja de colgar de Afganistan, Sirte pasa a la Segunda guerra civil libia y Monte Calvo a la Guerra de Corea.
- Agrega `conflictDetailLocalizationIssues` a `audit:data` para detectar shards diferidos con fechas/lugares/resultados sin localizar.
- Refuerza `test:data-language` con checks de jerarquia/region curada y de shards sin ingles visible ni coordenadas crudas.
- Reduce `countries_index.json` de ~175 KB a 161 KB sacando ciudades y estructura estatal del indice inicial; esos campos quedan bajo demanda en `data/countries/*.json`.
- Baja el arranque critico local de 983 KB a 969 KB y deja `release:check` completo en verde.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-05-release-6`.

## v1.6.33 - 2026-07-05

- Cura Somalia y Taiwan con timelines politicos, conflictos historicos/actuales y metadatos de calidad generados desde `scripts/buildDataset.js`.
- Agrega hitos historicos para Malvinas, Guayana Francesa, Tierras Australes Francesas, Kosovo y Somalilandia.
- Ajusta el modelo de calidad para territorios/casos especiales: no penaliza ausencia de ejercito/conflictos o religion permanente cuando no corresponde y cuenta relaciones territoriales como politica curada.
- Baja `priorityWeakDataProfiles` y `weakDataProfiles` a 0 sin esconder campos estimados.
- Reduce `countries_index.json` de ~180 KB a 175 KB quitando metadata redundante del indice inicial.
- Recorta ramas opcionales muertas de texto en `script.js`; el archivo baja a ~674 KB y el arranque critico local queda en 983 KB.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-05-release-5`.

## v1.6.32 - 2026-07-05

- Divide las listas completas de conflictos por pais en `data/countries/conflicts/*.json` y deja en cada ficha publica solo un preview liviano.
- Hace que la seccion Militar cargue su shard de conflictos bajo demanda antes de construir jerarquia, filtros y detalle.
- Reduce las fichas publicas grandes: `USA.json` baja de 216 KB a 20 KB, `GBR.json` de 71 KB a 20 KB y `FRA.json` de 52 KB a 18 KB.
- Deja `largeCountries` y `country_weights.summary.tooLargeCount` en 0; todas las fichas publicas quedan bajo 42 KB.
- Conserva `conflictCount` real en el indice inicial para rankings y contadores, aunque la lista completa se cargue despues.
- Documenta el nuevo flujo de datos y refuerza tests de arranque, release gates y arquitectura para bloquear regresiones.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-05-release-4`.

## v1.6.31 - 2026-07-05

- Extrae exportar/compartir a `app-export-share.js` como modulo diferido; `html2canvas` y `jsPDF` siguen cargando solo al usar exportacion.
- Reduce el peso de `script.js` de 676 KB a 673 KB y baja el arranque critico local a 973 KB.
- Mejora `audit:data` separando conflictos compartidos entre paises (`sharedConflictNames`) de duplicados accionables (`duplicateConflictNames` y `sameCountryDuplicateConflicts`).
- Separa baja confianza real (`weakDataProfiles`) de backlog gradual (`baseSectionProfiles`) y agrega `priorityWeakDataProfiles` para priorizar fichas publicas debiles.
- Amplia `country_weights` con metricas por seccion, bytes de conflictos y promedio por conflicto para orientar la siguiente optimizacion de fichas pesadas.
- Documenta `app-export-share.js` en arquitectura y refuerza tests de release, arranque, arquitectura y higiene visual.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-05-release-3`.

## v1.6.30 - 2026-07-05

- Agrega `audit:features` con reporte `reports/feature-health.json` para validar mapa, ficha pais, busqueda, rankings, timeline/conflictos, comparador, quiz, noticias, exportar/compartir y offline.
- Conecta la auditoria funcional a `maintain:quick`, `release:check`, GitHub Actions, `projectDoctor`, `release:status` y `test:release-gates`.
- Hace que `release:status` bloquee si la salud funcional conserva fallas y exponga el resumen de `feature-health`.
- Refuerza gates para detectar modulos, workers, contratos HTML, tokens runtime, scripts de prueba y datasets faltantes en funciones principales.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-05-release-2`.

## v1.6.29 - 2026-07-05

- Convierte `reports/release-status.json` en artefacto efimero local/CI y lo saca del versionado para evitar snapshots Git obsoletos.
- Agrega `audit:release-artifacts` con reporte `reports/release-artifacts.json` para validar `.gitignore`, scripts de release, workflow de GitHub Actions, upload de reportes y tracking accidental de artefactos efimeros.
- Conecta la auditoria de artefactos a `maintain:quick`, `release:check`, GitHub Actions y `test:release-gates`.
- Amplia el doctor para levantar fallas de configuracion de artefactos de release.
- Mantiene `release:status` como reporte vivo generado por CI/local, con politica `artifactPolicy.kind = ephemeral`.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-05-release-1`.

## v1.6.28 - 2026-07-04

- Agrega `release:status` con reporte versionado de Git, tag esperado, alineacion de `APP_VERSION`/`CACHE_VERSION`, presupuestos, auditoria de datos y doctor de producto.
- Agrega `fix:source-text` y `test:text-normalization` para reparar mojibake seguro en el generador principal sin introducir caracteres de reemplazo.
- Amplia la auditoria programable y el doctor para detectar `sourceTextMojibake`, huecos de automatizacion, desalineacion de cache/version y ausencia de estado de release en GitHub Actions.
- Hace mas robusto el matching de metadatos especiales de conflictos usando claves normalizadas sin acentos; recupera la fecha y jerarquia de `Operaciones Temeraria y Persecucion`.
- Limpia mojibake en `scripts/buildDataset.js` para que la fuente de datos sea legible y no dependa solo de correcciones posteriores.
- Corrige ciudades destacadas para conservar Bruselas y Pekin como entradas buscables sin duplicar capitales donde no corresponde.
- Conecta `release:status` y `fix:source-text` al mantenimiento rapido, `release:check`, GitHub Actions y pruebas de gates.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-04-release-1`.

## v1.6.27 - 2026-07-03

- Agrega `audit:doctor` con reporte consolidado de salud, acciones recomendadas, contratos UI, modulos diferidos y presupuestos.
- Agrega `maintain:quick`, que ejecuta curaduria de conflictos, correccion visible, indices, auditorias, snapshot y pre-push en el orden correcto.
- Mejora la auditoria programable de datos separando duplicados esperables de duplicados accionables, conflictos tacticos sin fecha y textos realmente sospechosos.
- Corrige nombres visibles de ciudades/capitales en Argel, Bruselas, Baku y Pekin.
- Traduce remanentes militares en ingles como Blitz regionales, Arandora Star, Cherry Valley, Florida y Kip's Bay.
- Completa fechas y jerarquia para Rebelion de Baja California, Operaciones Temeraria y Persecucion, Arandora Star y la emboscada del vapor J. R. Williams.
- Deja `validate:data` sin incidencias ni advertencias tras la pasada automatizada.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-03-release-1`.

## v1.6.26 - 2026-07-02

- Automatiza GitHub Actions como puerta de release con auditorias, presupuestos de arranque y smoke tests.
- Agrega pre-push local liviano y limpieza de almacenamiento con `clean:storage`.
- Agrega auditoria de datos programable y snapshot de performance por release.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-02-release-2`.

## v1.6.25 - 2026-07-02

- Audita funciones visibles, contratos `data-*`, helpers sin uso y sintaxis de modulos JS.
- Elimina el instalador duplicado de teclado en `app-ui-polish.js` y deja la contencion de foco en el runtime principal.
- Mejora el modal de conflictos mostrando nivel jerarquico guerra/campana/batalla y bando del pais cuando puede inferirse.
- Normaliza nombres visibles de conflictos que seguian mezclando ingles y espanol, incluyendo Gaza, Kurdistan iraqui, Taiwan, Aden, Sangin y choques israelo-britanicos.
- Amplia la correccion final de datos visibles para tildes en operacion, rebelion, expedicion, liberacion, ocupacion e insurreccion.
- Corrige la region servida del choque israelo-britanico de 1949 para que no herede Europa como region generica.
- Excluye una invasion china de Taiwan sin fecha consolidada de los conflictos servidos, evitando advertencias de validacion por datos especulativos.
- Elimina helpers muertos de runtime critico relacionados con dispositivo, etiquetas y click de capa.
- Limpia el fallback de version de `app-ui-polish.js` para no conservar stamps antiguos.
- Refuerza pruebas de arquitectura, arranque y calidad de datos para bloquear regresiones de accesibilidad, modal de conflictos, traducciones y regiones sospechosas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-02-release-1`.

## v1.6.24 - 2026-07-01

- Corrige el versionado de modulos diferidos para que noticias, comparador, quiz, timeline, busqueda, rankings y paneles usen siempre `APP_VERSION`.
- Evita que funciones cargadas bajo demanda puedan traer codigo cacheado de releases anteriores.
- Elimina el atributo muerto `data-timeline-query` y la funcion sin uso asociada al render del timeline.
- Refuerza pruebas de release para bloquear stamps fijos dentro de `DEFERRED_UI_MODULES`.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-01-release-6`.

## v1.6.23 - 2026-07-01

- Corrige la apertura de fichas desde rankings, busqueda y mapa cuando las capas del GeoJSON todavia no terminaron de indexarse.
- Hace que la seleccion del mapa resuelva paises por codigo, alias o nombre normalizado, evitando que tops y grupos queden sin marcar por diferencias de GeoJSON.
- Refuerza click y hover de Cesium leyendo entidades desde `picked.id` y `picked.primitive.id` para cubrir rutas distintas entre 2D y 3D.
- Agrega reintento seguro para selecciones grupales de continente/religion cuando el mapa sigue cargando.
- Amplia pruebas de arranque para bloquear regresiones de seleccion diferida, aliases de capas y picks de Cesium.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-01-release-5`.

## v1.6.22 - 2026-07-01

- Agrega feedback accesible de guardado automatico a las notas locales de ficha pais.
- Mantiene el estilo del estado de notas en `style-polish.css` para no aumentar el CSS critico.
- Refuerza pruebas de higiene visual para bloquear notas locales sin confirmacion de guardado.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-01-release-4`.

## v1.6.21 - 2026-07-01

- Convierte las listas de paises en vistas agrupadas de continente, religion, sistema, bloque, organizacion y rivalidad en botones que abren la ficha del pais.
- Corrige el calculo visible de poblacion/porcentaje para denominaciones religiosas, separandolo de la familia religiosa general.
- Mueve el estilo de esas listas grupales a `style-polish.css` para no inflar el CSS critico de arranque.
- Elimina `fetchCountryHeadline`, funcion de noticias sin uso tras la carga de titulares por lista.
- Refuerza pruebas de arranque e higiene visual para bloquear listas grupales no accionables.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-01-release-3`.

## v1.6.20 - 2026-07-01

- Convierte las denominaciones del top de religiones en botones accionables con estado activo, foco y objetivo tactil propio.
- Agrega busqueda por denominacion religiosa como categoria separada para no ampliar consultas como protestantismo o catolicismo a toda la familia religiosa.
- Unifica el estado activo de rankings en un helper comun, manteniendo feedback visual consistente entre paises, grupos y subrankings.
- Refuerza pruebas de higiene visual y arranque para bloquear regresiones en rankings religiosos y busqueda por denominacion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-01-release-2`.

## v1.6.19 - 2026-07-01

- Corrige una duplicacion de `setupCompareControls` que podia hacer que la version vieja del comparador pisara los controles avanzados.
- Recupera de forma estable busqueda interna del comparador, presets y benchmarks mundo/continente desde el setup activo.
- Elimina implementaciones viejas duplicadas de exportacion PNG, exportacion PDF y compartir texto, manteniendo solo la version con carga diferida de librerias.
- Reduce `script.js` y agrega regresiones para bloquear duplicados de comparador/exportacion en futuras releases.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-01-release-1`.

## v1.6.18 - 2026-06-30

- Diferir la guia rapida a `app-help-ui.js`, evitando cargar contenido de ayuda largo dentro del HTML inicial.
- Simplifica la portada publica quitando texto interno y ayuda duplicada, dejando acciones principales, estado de runtime, cobertura y modos.
- Corrige botones de cierre visibles en modales de conflicto y timeline para evitar caracteres mojibake.
- Refuerza pruebas para bloquear mojibake visible, guia no diferida y regresiones del smoke server con el nuevo modulo.
- Reduce el HTML critico de arranque y baja el CSS critico eliminando reglas de portada ya no usadas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-30-release-4`.

## v1.6.17 - 2026-06-30

- Agrega una entrada publica guiada en la portada con cuatro caminos claros: buscar o tocar pais, ver riesgos, comparar paises y explorar conflictos.
- Convierte esas acciones de onboarding en flujos reales: foco al buscador, apertura de comparador, activacion de radar de riesgo y capa de conflictos.
- Agrega feedback visible durante el arranque con fases de carga liviana, mapa, indice de paises y UI diferida para mejorar la performance percibida.
- Refuerza confianza de datos en la portada y en el chip de estado, mostrando calidad, fuentes por seccion, estimaciones marcadas y curaduria pendiente.
- Pasa el pulido visual de las tarjetas de onboarding a `style-polish.css` para no inflar el CSS critico del primer mapa.
- Corrige el cierre visible de la guia rapida para evitar caracteres rotos por encoding.
- Amplia `visual-hygiene.test.js` para bloquear regresiones del onboarding, feedback de arranque y flujos principales.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-30-release-3`.

## v1.6.16 - 2026-06-30

- Cierra como historicas batallas, operaciones y campanas anteriores a 2020 que quedaban activas por falta de `endYear`.
- Corrige `Cruzada Livonia` y `Guerra de la Independencia de Chile` con rangos historicos coherentes.
- Corrige regiones heredadas por pais participante en conflictos como Sa'dah, noroeste de Pakistan, Irano-israeli, Kachin, Laos, Siria, Yemen, Vietnam y Afganistan.
- Agrega contadores de auditoria para rangos de fecha invalidos y acciones historicas abiertas.
- Amplia pruebas de datos para bloquear regiones sospechosas, rangos imposibles y acciones historicas activas sin cierre.
- Regenera dataset, shards de conflictos, indices publicos y reportes.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-30-release-2`.

## v1.6.15 - 2026-06-30

- Corrige consistencia semantica de conflictos: conflictos cerrados ya no salen como activos y `ongoing:false` no convive con `active:true` o `status: activo`.
- Limpia causas/resultados de conflictos que mostraban `"null"` como texto visible y fuerza fallback narrativo estructural.
- Cura `Guerra contra el Estado Islamico` con region normalizada `Oriente Medio y Norte de Africa`, evitando heredar `Oceania` desde la ficha de Australia.
- Mantiene `Invasion rusa a Ucrania` como conflicto activo sin cierre historico artificial.
- Agrega contadores de consistencia semantica a `reports/project-audit.json`.
- Amplia pruebas de datos para bloquear cerrados activos, regiones sospechosas y textos `"null"` en detalles de conflictos.
- Actualiza `BACKLOG.md` con estado auditado, lista completa priorizada y pendientes medidos.
- Regenera dataset, shards de conflictos, indices publicos y reportes.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-30-release-1`.

## v1.6.14 - 2026-06-29

- Rediseña `Capas tematicas` como panel guiado con resumen de capa activa, texto orientativo, buscador y botones rapidos agrupados por base, sociedad, economia y riesgo.
- Hace que todos los botones rapidos usen la misma logica de `setTheme` que el selector principal, sincronizando estado activo y etiqueta visible.
- Evita la superposicion con comparador, quiz y noticias cerrando/ocultando esos hubs cuando el panel de capas queda abierto.
- Completa etiquetas bilingues faltantes para capas de riesgo, calidad, diversidad linguistica y alcance diplomatico.
- Ajusta indicadores CSS del desplegable y agrega regresion para que cada opcion del selector tenga boton rapido equivalente.
- Fija line endings LF para assets web/JSON/Markdown y evita que CRLF infle los presupuestos de arranque.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-29-release-3`.

## v1.6.13 - 2026-06-29

- Agrega `BACKLOG.md` como lista completa y priorizada de datos, rendimiento, UI/UX, busqueda, rankings, timeline, testing y release.
- Cura Serbia con capital `Belgrado`, ciudades destacadas limpias, rivalidad actual con Kosovo y disputa territorial asociada.
- Elimina la ultima brecha prioritaria de curaduria (`politics.rivals`) reportada por la auditoria interna.
- Amplia pruebas de calidad para bloquear regresiones en capitales, ciudades y relaciones visibles de Serbia.
- Regenera datos publicos, indices, shards de conflictos y reportes de auditoria.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-29-release-2`.

## v1.6.12 - 2026-06-29

- Normaliza datos visibles de politica: corrige organizaciones con `Desarrollo` mal escrito como verbo y bloquea la regresion en raw/datos servidos.
- Mejora ciudades y capitales visibles: Ereván, San José, Puerto Príncipe, Vientián, Riad, Los Ángeles, Mazar-e Sharif y Savannakhet.
- Extiende las correcciones visibles a conflictos raw, detalles generados y shards por conflicto para limpiar nombres/textos de batallas y guerras.
- Mantiene `continent` como dato interno canonico para filtros, rankings y busqueda, evitando mezclas entre claves internas e idioma visible.
- Amplia pruebas de calidad para organizaciones, ciudades, continentes canonicos y textos narrativos de conflictos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-29-release-1`.

## v1.6.11 - 2026-06-27

- Corrige la prioridad de `HISTORY_OVERRIDES` para que los años curados ganen sobre años raw validos pero no docentes.
- Repara fechas historicas visibles en timeline/fichas para Suecia, Rusia, Reino Unido, Alemania, Vietnam, Timor Oriental, Sahara Occidental y otros casos curados.
- Clasifica mejor independencias coloniales y salidas de la URSS en el dataset servido, evitando que aparezcan como `Legal y pacifica`.
- Agrega categorias historicas para territorios disputados/dependientes/no incorporados y tratado internacional en datos e indice.
- Amplia pruebas de calidad de datos para bloquear regresiones de años historicos, independencias coloniales y disoluciones sovieticas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-27-release-2`.

## v1.6.10 - 2026-06-27

- Pule la jerarquia visual diferida de paneles, hubs y modales con superficies elevadas, bordes mas claros y estados abiertos mas distinguibles.
- Mejora estados hover, foco y seleccion en rankings, timeline, conflictos, noticias, comparador y secciones de ficha pais.
- Refuerza la barra mobile y el menu rapido con estados activos visibles, objetivos tactiles estables y mejor separacion del mapa.
- Agrega skeleton animado respetando `prefers-reduced-motion` y normaliza indicadores desplegables a signos ASCII.
- Amplia `visual-hygiene.test.js` para bloquear regresiones en pulido diferido, mobile y skeletons.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-27-release-1`.

## v1.6.9 - 2026-06-26

- Normaliza redundancias visibles de datos en idiomas, ciudades, rivales, regiones, organizaciones y conflictos con acentos faltantes.
- Corrige el reparador de mojibake para no romper nombres portugueses validos como `Sao Paulo` con `a` nasal.
- Amplia la limpieza narrativa de conflictos para textos generados: `Confrontacion`, `historico`, `politico`, `presion`, `tactico`, `accion`, `operacion`, regiones y gentilicios.
- Agrega fechas y jerarquia segura a `Accion militar de Calderilla`, `Accion frente al faro de Galveston` y `Ocupacion alemana de Luxemburgo en la Segunda Guerra Mundial`.
- Hace mas robustas las escrituras de dataset y correcciones visibles ante bloqueos temporales de OneDrive con escritura atomica y reintentos.
- Evita que rankings/radar dupliquen bloques diplomaticos cuando una misma membresia aparece en listas agregadas y especificas.
- Agrega pruebas de regresion para mojibake, textos narrativos sin tildes, duplicados de bloques y ramas religiosas redundantes.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-26-release-2`.

## v1.6.8 - 2026-06-26

- Unifica las ramas protestantes visibles en una sola etiqueta canonica: `Protestantes y evangelicos`, evitando duplicados entre `Protestantes`, `Evangelicos` y variantes de `Cristianos protestantes`.
- Simplifica resumenes religiosos servidos cuando la rama ya aparece en la composicion, para que fichas y paises no muestren textos redundantes como `Cristianismo (protestantismo): Protestantes...`.
- Renombra el residual `Otros cristianos` a `Otras denominaciones cristianas` para que los tops y fichas se lean con menos ambiguedad.
- Hace que el top de religiones agregue por etiqueta visible canonica, incluso si entran variantes futuras.
- Agrega pruebas para bloquear ramas protestantes duplicadas, residuales cristianos antiguos y resumenes que repitan ramas ya detalladas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-26-release-1`.

## v1.6.7 - 2026-06-25

- Normaliza datos religiosos en raw, fichas por pais e indices: tildes, traducciones y variantes como `Cat\u00f3licos`, `Hind\u00faes`, `Jud\u00edos`, `Sinto\u00edstas` y `Ateos / agn\u00f3sticos / sin afiliaci\u00f3n`.
- Colapsa rellenos religiosos genericos al 1% cuando inflaban composiciones por encima de 100%, preservando el resto disponible como `Otras religiones`.
- Unifica etiquetas visibles de religion en filtros, busqueda natural, rankings y tema de mapa (`Islam`, `Juda\u00edsmo`, `Sinto\u00edsmo`, `Religiones animistas y populares`).
- Agrega pruebas para bloquear textos religiosos sin normalizar, duplicados por ficha y composiciones servidas fuera de rango.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-25-release-3`.

## v1.6.6 - 2026-06-25

- Corrige los datos visibles de tops: sistemas politicos dejan de mezclar tipos historicos como independencia, union o disolucion.
- Normaliza organizaciones y bloques visibles con traducciones y siglas consistentes en espanol (`ONU`, `OEA`, `OPEP`, `FMI`, `OMA`, `BIRF`, `UIT`, `OMM`, `OPAQ`, `OCI`).
- Evita displays redundantes como `UNESCO (UNESCO)` y hace que ranking, filtros y busqueda usen la misma etiqueta canonizada.
- Integra `applyVisibleDataCorrections.js` dentro de `npm run build:data` y agrega pruebas para bloquear regresiones en tops.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-06-25-release-2` para invalidar datos cacheados de la release anterior.

## v1.6.5 - 2026-06-25

- Repara el flujo comun de seleccion: tocar paises, rankings, sugerencias y botones internos vuelve a abrir la ficha y enfocar el mapa desde un helper unico.
- Hace tolerante la apertura por codigo/nombre cuando el pais viene del indice liviano o de una ficha cargada bajo demanda.
- Evita que busquedas por continente, religion, sistema, organizacion o filtros queden vacias si la geometria del mapa todavia no termino de cargar.
- Protege las selecciones ante estados donde Cesium o `requestRender` no estan listos, evitando cortes silenciosos antes de abrir la ficha.
- Agrega una prueba de regresion para bloquear que rankings/busqueda vuelvan a depender de capas cartograficas u objetos exactos.

## v1.6.4 - 2026-06-23

- Endurece la limpieza visible con una libreria compartida para reemplazos, identificadores tecnicos `Q...` y nombres urbanos crudos.
- Integra esa limpieza al generador del dataset para que rebuilds futuros no reintroduzcan organizaciones tecnicas ni ciudades en mayusculas.
- Protege `npm run build:data` para que regenere dataset, curaduria de conflictos e indices en una sola pasada consistente.
- Hace resiliente el autofix de conflictos ante bloqueos temporales de OneDrive al leer o escribir JSON grandes.
- Normaliza ciudades visibles como `PRAHA`, `KOBENHAVN`, `ATHINAI`, `CUIDAD DE GUATEMALA`, `ULAANBAATAR`, `BUCURESTI` y variantes similares.
- Mejora el estado offline diferido con indicador visual, `aria-live` y `body[data-network-state]` para mobile y escritorio.
- Agrega pruebas de calidad de datos y visual hygiene para bloquear regresiones de ciudades crudas, organizaciones tecnicas y estado offline.

## v1.6.3 - 2026-06-23

- Corrige el stamp diferido de `style-polish.css` dentro de `app-ui-polish.js` para evitar hojas visuales cacheadas de una release anterior.
- Normaliza datos visibles de Austria: ciudad `WIEN`, escaramuzas en ingles y etiquetas de organizaciones mezcladas.
- Elimina identificadores Wikidata `Q...` de organizaciones servidas, usando abreviaturas cuando existen y quitando entradas sin etiqueta util.
- Agrega pruebas para sincronizar `APP_VERSION`, `CACHE_VERSION`, estilos diferidos y changelog en cada release.

## v1.6.2 - 2026-06-23

- Version documentada con bump de `package.json`, `APP_VERSION` y `CACHE_VERSION` para evitar caches viejos.
- El quiz diferido queda como motor principal y suma preguntas de idiomas y bloques sin volver al fallback pesado.
- Datos visibles normalizados: se corrigen nombres de conflictos que quedaban mezclados en ingles en fichas e indices publicos.
- Reportes de auditoria y medicion de arranque regenerados para esta version.

- Las fichas pais compactan sus conflictos y cargan causas, participantes y cronologias por shard al abrir cada modal.
- La lista militar renderiza conflictos por tandas y conecta filtros de region, desenlace y bando que antes no respondian.
- El arbol militar deja de construirse al abrir la ficha y se activa al entrar en su seccion; reabrir una ficha cacheada ya no queda trabado en el skeleton.
- El build publico excluye monolitos tecnicos de conflictos y reduce las fichas por pais de 8,4 MB a cerca de 2 MB en total.
- La auditoria distingue curaduria real de texto de relleno y vuelve visible la deuda historiografica pendiente.
- Se eliminan identificadores Wikidata sin etiqueta y se corrige La Habana como capital visible de Cuba.
- Comparador robustecido ante cargas diferidas: ya no falla si se usa antes de que llegue su modulo visual y confirma la seleccion en la ficha.
- Noticias limitan la lista inicial por dispositivo, ofrecen fallback seguro cuando no hay titulares en vivo y dejan de renderizar 183 paises de golpe.
- Filtros geopoliticos unifican variantes equivalentes por tildes y mayusculas para evitar opciones duplicadas.
- Capitales y ciudades muestran poblaciones enteras, y la navegacion rapida de la ficha conserva estado visual y accesible.
- El mapa actualiza su perfil 2D/3D inmediatamente y degrada a 2D tras FPS critico sostenido para recuperar interaccion.
- Jerarquia militar corregida: relaciones tematicas ya no se confunden con guerras padre y se respetan los padres curados del dataset.
- Verificacion real mobile en 390x844: sin desborde horizontal, controles tactiles de 44 px, noticias acotadas y rankings seleccionables.
- Rankings con seleccion visual persistente, estado accesible y apertura completa con un solo toque en mobile.
- Riesgo y fichas ahora cuentan solo rivalidades actuales; aliados y rivales contradictorios se depuran al generar datos.
- Nombres geopoliticos equivalentes se normalizan para evitar duplicados como China y Republica Popular China.
- Puntajes de calidad recalibrados para que una ficha con secciones base o estimadas no muestre un 100/100 enganoso.
- La ficha pais unifica el conteo visible de conflictos y evita la superposicion entre escudo y boton de cierre.
- `release:check` conserva dependencias y lockfile; la limpieza profunda queda disponible de forma explicita con `npm run clean:deep`.
- Los generadores reintentan lecturas y escrituras bloqueadas temporalmente por OneDrive durante el release.
- La curaduria profunda de 405 KB ahora se carga al abrir una ficha y deja de ejecutarse durante el arranque diferido.
- Se elimino la fuente web bloqueante y se adopto la tipografia nativa del sistema para mejorar primer render y modo offline.
- Nuevo pulido visual diferido con componentes mas compactos, estados de foco, objetivos tactiles de 44 px y movimiento reducido.
- Se amplio la diversidad linguistica de los paises mas poblados y se corrigieron ciudades prioritarias de 21 fichas.
- La auditoria linguistica ahora prioriza ausencias reales y paises de alta poblacion, evitando falsos positivos poco utiles.
- Origenes historicos y organizaciones internacionales corregidos y normalizados en espanol.
- Inferencia de conflictos endurecida para evitar guerras y regiones falsas por simple coincidencia de fechas.
- Regiones corregidas para Kivu, Magreb, Malvinas, disputas australes y Guerra del Uruguay.
- Nueva puerta de calidad linguistica en `npm test` y reporte explicito dentro de la auditoria de datos.
- Barra mobile mas compacta con accesos claros a rankings, capas y ficha.
- Estado accesible y deshabilitado para la ficha hasta seleccionar un pais.
- Paneles, capas y hubs mobile ahora se abren de forma exclusiva para evitar superposiciones.
- Comparador, quiz y noticias pasan a un menu rapido bajo demanda para liberar espacio sobre el mapa mobile.

## v1.6.1

Release de hardening para testing, build y publicacion.

- `npm test` queda como puerta de release con build prod, release gates, smoke visual local y validaciones de datos.
- Build de produccion real en `dist/public` con manifest de assets, hashes SHA-256 y exclusion de `reports/`, `scripts/` y docs internas.
- Tests nuevos para long tasks simuladas, service worker cache, APP_SHELL, tamanos criticos, lazy loading de datasets pesados, GeoJSON detallado y exportaciones diferidas.
- Smoke visual basico con servidor local para proteger layout mobile, foco accesible, estados loading/offline y shell de hubs/modales.
- `release:check` ahora automatiza test completo, build, gates, auditorias, medicion de startup, smoke server y limpieza local.
- Checklist de release/push documentado con tag semantico y `git push origin main --follow-tags`.

## v1.6.0

Actualizacion de producto orientada a uso real y crecimiento futuro.

- Radar de riesgo ampliado con capas por dimension militar, economica, diplomatica, interna y territorial.
- Radar con UI bajo demanda, lentes de escenario, factor principal por pais y mejor lectura analitica.
- Vista interna "Auditoria de conflictos" conectada al reporte generado para ver top problemas sin abrir JSON.
- Panel de capas con scroll propio, cabecera fija y sin chip de arranque invadiendo la vista principal.
- Auditoria de conflictos con progreso de limpieza y estados vacios mas claros.
- Chips de estado convertidos en acciones accesibles: render abre Rendimiento y dataset abre Salud dataset.
- Test de higiene visual agregado al flujo completo para evitar regresiones de mojibake y UI vieja.
- Auditoria general del proyecto con reporte JSON, vista interna y ejecucion dentro del checklist de release.
- Nueva tanda de curaduria para Gran Guerra del Norte, Guerra de los Siete Anos y Guerra de Independencia estadounidense.
- Curaduria ampliada de la Guerra de Independencia de Estados Unidos y su dimension naval global.
- Curaduria segura adicional para Guerra de 1812, guerras berberiscas, Revolucion haitiana, Guerra finlandesa, Rio de la Plata y guerra mexicano-estadounidense.
- Mas batallas parentadas cronologicamente con su guerra correspondiente entre 1790 y 1847.
- Nueva tanda de curaduria para Mexico-Estados Unidos, Crimea/Pacifico, China en el siglo XIX y Guerra de Secesion estadounidense.
- Panel de auditoria de conflictos con tira visual de prioridad para guiar limpieza: parentar batallas, limpiar bandos y subir detalle.
- Curaduria ampliada para Guerra Civil estadounidense, Guerra de la Triple Alianza, intervencion francesa en Mexico y guerras indigenas de Estados Unidos.
- Panel "Auditoria proyecto" con medidores visuales de presupuesto de arranque y avance de limpieza de conflictos.
- Curaduria adicional para Guerra del Pacifico, guerra franco-china, Rebelion del Noroeste, guerra hispano-estadounidense, Filipinas, Boxers, Nicaragua y primeras batallas de 1914.
- Normalizacion segura de variantes como Guantanamo/Guasimas para reducir nombres en ingles o con acentos rotos.
- Auditoria del proyecto ampliada para incluir el modulo visual de auditoria y mostrar una tarjeta de higiene visual dentro de la app.
- Curaduria ampliada de Primera Guerra Mundial con Ypres, Jutlandia, Vimy, Messines, Cambrai, Amiens, Belleau Wood, Blanc Mont Ridge y Durazzo.
- Panel de auditoria de conflictos con foco editorial por periodo historico para orientar la siguiente tanda de limpieza.
- Auditoria del proyecto enriquecida con deuda de conflictos por periodo historico dentro del reporte y de la UI.
- Curaduria extendida de 1914-1918 con Meuse, Revigny, Upper Meurthe, Saint-Mihiel, Soissons, St. Quentin Canal, Vittorio Veneto, Somme, Marne y Aisne.
- Autofix de conflictos mas robusto: cuando un renombre seguro ya existe, fusiona detalles y elimina el nombre viejo para no recrear duplicados.
- Radar de riesgo con bloque metodologico: mejor uso, limites del modelo y proxima mejora analitica.
- Curaduria de entreguerras y Segunda Guerra Mundial inicial: Juarez, Shenkursk, La Flor, Alihuata, Atlantico, Belgica, Dunkerque, Raate, Sedan, Sidi Barrani, Creta, Hong Kong y Keren.
- Panel de rendimiento con recomendacion automatica segun el cuello de botella medido en arranque.
- Curaduria ampliada de Segunda Guerra Mundial inicial: Giarabub, Kvam, Rotterdam, Ypres-Comines, Agordat, Damasco, Gondar, Guam, Gurun, Kampar, Ko Chang, Wake, linea Metaxas, Termopilas, cabo Matapan y Amba Alagi.
- Panel de rendimiento con banner visual de estado: arranque sano, en observacion o pesado.
- Test de higiene visual ampliado para proteger el panel de rendimiento y sus recomendaciones.
- Curaduria de 1942: Alam el Halfa, Bir Hakeim, Gazala, El Alamein, Midway, Java, Singapur, Buna-Gona, Bahia de Milne y Guadalcanal.
- Curaduria ampliada de 1942-1943: Balikpapan, Bukit Timah, El Agheila, Kranji, cresta de Edson, Mount Austen, Muar, Port Moresby, Slim River, Timor, Tulagi, Badung, Sonda y Tjiater.
- Curaduria adicional guiada por auditoria: Malolo, Muddy Flat, Barrier Forts, Whitestone Hill, Killdeer Mountain, Infernal Caverns, Khannour, Santa Cruz, Bud Dajo, Bud Bagsak, Fort Dipitie y nuevas batallas de 1943.
- Nueva pasada de 1943: Kos, Leros, Isla Rennell, Munda Point, Piva Forks, Sattelberg, Scarlet Beach, Horaniu, Koromokina y campana del norte de Birmania/Yunnan.
- Auditoria de conflictos con nota editorial automatica sobre la deuda dominante para orientar la siguiente tanda.
- Test de autofix ampliado para cubrir curaduria moderna y renombres seguros de Segunda Guerra Mundial.
- Panel "Auditoria proyecto" con tarjetas de advertencias para ver deuda tecnica y riesgos sin abrir reportes JSON.
- Pulido visual moderno en modales, secciones, tarjetas de riesgo y auditorias internas.
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
- Accion visible para limpiar cache offline cuando una version vieja queda pegada.
- Cache offline versionado al 2026-06-01, con tamano aproximado visible, limpieza mas clara, runtime bajo demanda y veto a datasets pesados en CacheStorage.
- Datasets grandes divididos: indices livianos de conflictos, timeline y busqueda, shards de detalle por conflicto, manifiesto de produccion/interno/docente y pesos por pais.
- `countries_index.json` compactado por poda de campos vacios para sostener el arranque critico por debajo de 1 MB.
- Auditoria de curaduria ampliada con alertas de fichas grandes, capitales multiples, ciudades destacadas, idiomas, religiones, alianzas, rivalidades y disputas territoriales.
- Tanda segura de curaduria de conflictos: auditoria de conflictos en 0 alertas, jerarquia guerra/campana/batalla, escala, tipo, region normalizada, estado activo/historico y detalles estructurales.
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
# 2026-06-18 - Rendimiento mobile, datos y pulido visual

- El monitor de FPS ahora observa renders reales de Cesium y se detiene tras los primeros 60 segundos.
- La mejora de imagen en mobile espera un periodo de calma para no interrumpir el arrastre inicial del globo.
- La auditoria de ciudades usa capitales y un umbral proporcional a la poblacion, reduciendo falsos pendientes.
- Grecia incorpora disputas del Egeo y Mediterraneo oriental, relaciones categorizadas y bloques sin duplicar OTAN/NATO.
- La ficha pais presenta un resumen ejecutivo mas natural y un checklist de cobertura territorial mas preciso.
- La primera vista adopta una paleta mas neutral con acentos verdes y mejor contraste de foco y controles.
