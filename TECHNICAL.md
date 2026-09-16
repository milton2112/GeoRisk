# GeoRisk Technical Notes

## Vision general

GeoRisk es una aplicacion frontend orientada a exploracion geopolitica con dataset local curado, render de mapa 2D/3D y paneles de analisis. La mayor parte de la logica vive en cliente para mantener despliegue simple y uso offline razonable.

## Arquitectura actual

### Shell y UI

- `index.html`: shell principal, toolbar superior, hubs, modales y paneles.
- `style.css`: sistema visual, layout responsive, estados de foco, modales, hubs y capas.
- `script.js`: orquestacion principal, carga de datos, wiring de eventos y parte del render.

### Modulos frontend

- `app-runtime.js`: perfiles de dispositivo, presets de rendimiento y helpers de render.
- `app-curation.js`: curaduria extra de timeline y conflictos.
- `app-theme.js`: variables visuales y lectura del sistema de temas.
- `app-text.js`: helpers de texto, labels y formateo compartido.
- `app-news-ui.js`: render auxiliar del hub de noticias.
- `app-compare-ui.js`: piezas visuales del comparador.
- `app-export-share.js`: exportacion/compartir diferido; carga `html2canvas` y `jsPDF` locales con SRI solo cuando se usa. `vendor/exports/manifest.js` se genera desde versiones fijadas por `scripts/buildExportLibraries.js` y se verifica en build.
- `app-quiz-ui.js`: piezas visuales del quiz.
- `app-country-panel.js`: helpers de ficha del pais.
- `app-timeline-conflicts.js`: helpers de timeline, filtros y conflictos.

### Datos

- `data/countries_full.json`: dataset curado principal.
- `data/countries_index.json`: indice compacto para el arranque inicial.
- `data/countries/*.json`: fichas por pais cargadas bajo demanda, con conflictos en preview para no inflar la apertura.
- `data/countries/conflicts/*.json`: listas completas de conflictos por pais, cargadas solo al abrir la seccion Militar.
- `data/conflicts_index.json`: indice liviano de conflictos para busqueda, timeline y exploracion sin cargar detalles pesados.
- `data/timeline_index.json`: indice liviano cronologico con formaciones, eventos y conflictos.
- `data/search_index.json`: indice liviano de busqueda por pais, alias y facets.
- `data/country_weights.json`: metadata de peso por pais y alerta de fichas grandes.
- `data/conflicts/details_index.json` + `data/conflicts/details/*.json`: detalles de conflictos divididos para carga granular.
- `data/data_manifest.json`: frontera entre datos publicos, tecnicos internos, reportes y material docente.
- `data/geo_aliases.json`: aliases geograficos y nombres alternativos del mapa.
- `data/world_countries.geo.json`: geometria principal.
- `data/world_countries_simplified.geo.json`: geometria simplificada para modo 2D.
- `data/raw/*.json|csv`: insumos complementarios para build y fallbacks.

### Scripts de build y validacion

- `scripts/buildDataset.js`: ensamblado y enriquecimiento del dataset final.
- `scripts/validateDataset.js`: validaciones de calidad, metadata y cobertura.
- `scripts/lib/dataset-shared.js`: helpers compartidos del dataset.
- `scripts/lib/text-normalization.js`: normalizacion reutilizable.
- `scripts/lib/country-matching.js`: matching entre nombres del mapa, aliases y codigos.
- `scripts/lib/conflict-cleaning.js`: normalizacion, deduplicacion y limpieza reusable de conflictos.
- `scripts/lib/conflict-audit.js`: auditoria de conflictos, deteccion de nombres en ingles, duplicados, bandos genericos, batallas sin guerra padre y residuos de importacion.
- `scripts/lib/conflict-batch-curation.js`: reglas de tandas seguras para agregar jerarquia, escala, tipo, region, estado, cronologia, participantes y notas de curaduria sin inventar bajas especificas.
- `scripts/lib/render-logic.js`: logica pura reutilizable para tests y render.
- `scripts/lib/ui-logic.js`: helpers puros de UI y paneles.
- `scripts/auditConflicts.js`: genera `reports/conflict-audit.json` y `reports/conflict-autofix-suggestions.json`.
- `scripts/applyConflictAutofix.js`: aplica renombres, detalles curados explicitos y tandas seguras; escribe `reports/conflict-autofix-applied.json`.
- `scripts/measureStartupAssets.js`: mide peso local de shell, modulos, GeoJSON y datos diferidos; escribe `reports/startup-assets.json`.
- `scripts/projectAudit.js`: genera `reports/project-audit.json` con estado general, arranque, conflictos, archivos pesados, higiene visual y proximas acciones.
- `scripts/releaseChecklist.js`: corre tests, auditoria de conflictos, medicion, auditoria de proyecto y smoke server antes de release.
- La suite agregada `npm test` tiene un limite de 10 minutos dentro de `release:check`, porque incluye pruebas de esperas reales. Los demas pasos conservan 3 minutos y cualquier fallo detiene la release; no cambia los deadlines de la app ni los presupuestos de rendimiento.
- `scripts/localSmokeServer.js`: servidor HTTP local estable para smoke tests sin depender del browser plugin.

## Flujo de datos

1. La app carga `data/countries_index.json` y `data/geo_aliases.json`.
2. Renderiza mapa, busqueda basica, capas y ficha inicial con datos compactos.
3. Si el usuario abre una ficha indexada, carga `data/countries/<codigo>.json` bajo demanda.
4. Carga indices livianos de conflictos, timeline o busqueda solo cuando una vista los necesite.
5. Si el usuario abre Militar, carga `data/countries/conflicts/<codigo>.json` y reemplaza la muestra inicial por la lista completa.
6. Carga curaduria profunda solo al abrir Historia o Militar dentro de una ficha.
7. Carga `data/conflicts/details_index.json` y un shard individual al abrir un conflicto; el monolito tecnico no llega al navegador.
8. No descarga `data/countries_full.json`, tampoco como fallback de un indice fallido: el monolito es interno y no se publica. El arranque espera paises, aliases, geometria y primer render antes de habilitar controles.
9. En el mapa, resuelve clicks del GeoJSON a codigos ISO o especiales.
10. La ficha modal, timeline, comparador, quiz y noticias consumen datos bajo demanda segun la vista activa.

Las descargas de ficha y conflictos usan `fetchCountryDataJson`: limite de 20 segundos para headers y cuerpo, AbortController y validacion antes de publicar datos. Los mapas de promesas solo conservan solicitudes pendientes; el exito se reutiliza desde `countriesData`. Un fallo conserva el indice o la muestra y permite reintentar. Las fichas requieren nombre, objetos general/military y `metadata.provenance.code` coincidente; los shards requieren conflictos con nombre y al menos el total anunciado, sin exigir fechas aun pendientes de curaduria.

Una solicitud fallida se reintenta con `cache: reload`; el worker respeta esa politica solo para `/data/countries/` y reemplaza el cache si obtiene una respuesta correcta. Las consultas normales conservan cache-first y acceso offline. El token de render invalida esperas anteriores al cerrar o cambiar de ficha, y los refrescos de datos no reabren una ficha cerrada. `test:startup` comprueba el contrato con los 183 perfiles; `test:e2e:critical -- --country-data-only` prueba recuperacion y controles en escritorio/movil emulado; el test de worker real comprueba reemplazo de una entrada corrupta sin perder la lectura offline posterior.

Antes de crear el visor, `app-map-engine.js` comparte un unico intento de importacion ESM del motor. A los 7 segundos actualiza el aviso normal de carga y a los 30 segundos rechaza la espera con una recarga nativa. El HTML gestiona el fallo incluso antes de cargar script.js. La importacion nativa no se puede cancelar: una respuesta tardia puede evaluar el SDK, pero no publica `window.Cesium` ni reinicia un arranque fallido. El cargador local forma parte del shell; el motor local reducido no se precachea.

El paso `startupResources` espera conjuntamente el indice validado, los aliases, la capa politica y la espera inicial de render; no se confunde la llegada de tiles con la disponibilidad de paises. La espera tiene un limite de 20 segundos desde la creacion del visor, sin bloquear el hilo. Un fallo o timeout mantiene `globe-loading`, deja `completedAt` en cero y ofrece una recarga nativa. Las promesas tardias siguen gestionadas y no habilitan controles despues del fallo. La instalacion offline y los datos profundos no forman parte de esta barrera.

`waitForMapBootReady` requiere un `postRender` del visor capturado, con bucle activo y sin recuperacion pendiente/fallida. Su deadline no puede dar por listo un canvas sin dibujar. Si ya hubo render valido, los tiles pendientes no impiden la salida rapida. Tanto el exito como el fallo limpian timers y listeners del visor original. `test:startup` cubre estos estados; `test:e2e:critical -- --startup-only` inyecta tambien un motor lento/fallido/tardio, script principal retenido y render ausente, y verifica la recarga funcional.

Desde v1.6.240, despues de `startupResources`, la etapa `countryOverlayReady` espera tambien el dibujo de las entidades. En Cesium 1.127, `DataSourceDisplay.ready` queda latched tras el primer update completo, incluso si la escena estaba vacia; no sirve para esta comprobacion. `app-map.js.waitForDataSourceFrame` observa temporalmente el resultado actual del metodo publico `update(time)`, sin ejecutarlo una segunda vez, y exige un `postRender` posterior con resultado verdadero. Confirma que la capa siga visible, adjunta y vigente y que el visor no este detenido o destruido.

Esta etapa tiene su propio limite de 20 segundos despues de los recursos; ante fallo conserva el bloqueo y ofrece Recargar. Restaura la propiedad original del metodo (incluida su herencia), no pisa modificaciones ajenas y retira listeners y temporizadores. Comparte la espera para la misma capa y rechaza otra concurrente. `test:startup` incluye sus regresiones y `test:e2e:critical -- --overlay-ready-only` retrasa la disponibilidad real, verifica bloqueo, timeout/recarga y abre una ficha con un unico clic/tap sin precalentar el picking. El hito de app lista cambia: no comparar directamente `appReadyMs` con versiones anteriores ni atribuir a esta espera una reduccion del costo de GPU. El snapshot sigue midiendo long tasks desde navegacion durante 60 segundos.

Los controles bajo `globe-loading` usan `display: none` ademas del bloqueo visual: no generan cajas de layout mientras se conectan sus handlers y se actualizan sus textos. El mapa y el aviso de carga quedan fuera de esa regla. La interfaz recupera su layout al retirar la clase; los inicializadores no deben depender de dimensiones de controles ocultos.

Para comparar solo el CSS de arranque, construir `dist/public` y ejecutar `node scripts/profileStartup.js --trace-only --baseline-style=<commit> --observe-ms=1000`; sin `--baseline-style` usa el build actual. La traza informa cantidad, total y maximo de eventos Layout antes/despues de la marca de disponibilidad, y exige hilo principal y marca validos. `reports/startup-layout-benchmark.json` conserva seis muestras alternadas contra v1.6.234. El resto de los assets es comun; no es una comparacion de versiones completas ni una prueba en telefono fisico.

## Recarga progresiva del mapa

- `app-map-interactions.js.installRenderRecovery` distingue error de escena, bucle detenido y contexto WebGL perdido. Cesium 1.127 pone `useDefaultRenderLoop` en `false` incluso con `rethrowRenderErrors: false`; pedir `requestRender` no basta. El controlador espera dos callbacks de animacion antes de reactivar el bucle para no duplicar el callback anterior, permite un solo intento por visor y confirma un `postRender` posterior sin error. [Contrato de CesiumWidget](https://cesium.com/learn/cesiumjs/ref-doc/CesiumWidget.html#useDefaultRenderLoop).
- Un chequeo cada segundo detecta paradas fuera de `scene.renderError` y limita a ocho chequeos visibles la espera de un frame tras reintentar. No toma la inactividad normal de `requestRenderMode` como un bloqueo y no cuenta la pestaña oculta. Un fallo repetido o perdida de contexto ofrece recargar, sin cambiar perfil, camara, seleccion ni datos. El controlador retira timers/listeners al destruir el visor; `mapDegradationLog` conserva las fases sin etiquetarlas como reduccion de calidad. Esto no elimina ni diagnostica por si solo el pico inicial del SDK.
- La capa de imagen base tiene una referencia propia. Se instala su reemplazo antes de retirar y destruir la anterior, sin borrar otras capas de imagen. Los fallos sincronos al crear o instalar los proveedores mantienen la capa vigente; esto no garantiza disponibilidad de teselas remotas sin conexion.
- La navegacion adapta el detalle del globo, no la resolucion del framebuffer. Alternar esa resolucion en `moveStart`/`moveEnd` redimensiona el frustum y puede reiniciar el movimiento indefinidamente. El perfil elegido y el monitor adaptativo siguen controlando la resolucion.
- `msaaSamples` se configura al crear la escena y al cambiar perfil/modo. Automatico con FXAA y Balanceado usan una sola tecnica de suavizado (`msaaSamples: 1`); los perfiles automaticos sin FXAA conservan MSAA 4. Alta calidad mantiene MSAA 4 + FXAA; Rendimiento desactiva ambos. La resolucion y el detalle geografico no cambian con esta optimizacion. [Cesium: MSAA y su coste grafico](https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#msaaSamples).
- El monitor adaptativo inicial usa `app-map-interactions.js`: cuenta `postRender` solo durante movimiento continuo visible, fuera de transiciones. La espera de teselas y una interaccion reciente no habilitan por si solas una muestra. Descarta intervalos menores de 2 segundos o temporizadores suspendidos mas de 5 segundos, y reinicia rachas ante pausas, pestaña oculta o cambios de perfil/modo.
- La recuperacion automatica requiere tres ventanas al menos al 90% del objetivo de FPS del perfil; el cambio critico a 2D exige tres ventanas criticas consecutivas. Los perfiles manuales no se modifican por FPS. A los 60 segundos se retiran listeners y se cierra `startupFpsMetrics`, incluso con cero muestras (`min/max: null`). Esto es diagnostico del ajuste en uso, no sustituye el snapshot de release ni sus umbrales.
- El arranque, el modo 2D y los moviles usan siempre `world_countries_simplified.geo.json`. El precalentamiento del modo alternativo tambien usa esa geometria.
- En escritorio 3D, `get3DZoomBucket()` devuelve `near`, `mid` o `far`; `getCurrentOverlayBucket()` agrega el prefijo de modo solo para estilos y etiquetas.
- El detalle se solicita con zoom cercano y camara quieta. Se vuelve a verificar modo, zoom y solicitud vigente despues de cada espera asincrona.
- `loadMap(false, { preserveView: true })` conserva la capa activa durante la descarga y el indexado; solo reemplaza referencias al completar la nueva fuente. Los errores dejan la fuente anterior disponible para reintentar.
- `activeGeoJsonPath` y `activeGeoJsonMode` describen la fuente instalada, no una descarga pendiente. Una solicitud repetida reutiliza esa fuente, y una respuesta obsoleta no puede retirar la vigente.
- Al reemplazar, se reconstruyen los resaltados por codigo con la seleccion mas reciente, se retiran la fuente y el handler anteriores y no se mueve la camara.
- `scripts/tests/map-lifecycle.test.js` cubre el ciclo de carga con esperas controladas y corre dentro de `test:startup`. La E2E critica retrasa la descarga real y verifica encuadre, seleccion y clic sobre el nuevo detalle.

## Separacion de datos

`data/data_manifest.json` define cuatro grupos:

- produccion publica: indices livianos y recursos aptos para cache/runtime;
- tecnico interno: datasets grandes, raw data y auditorias;
- docente: guias e indices narrativos utiles para explicar el proyecto;
- reportes internos: JSON de mantenimiento que no deben entrar en `APP_SHELL` ni en un build prod.

Si se crea un build de produccion, debe excluir `reports/*.json`, `data/raw/**`, `data/countries_full.json`, `data/conflict_details.generated.json` y `data/conflict_dyadic_summary.json`.

## Matching de paises

El matching actual combina:

- codigos ISO y variantes del GeoJSON;
- aliases geograficos locales;
- nombres ingleses y nombres politicos alternativos;
- nombres historicos y oficiales del propio dataset;
- casos especiales como:
  - Taiwan
  - Cisjordania
  - Somalilandia
  - Chipre del Norte
  - Groenlandia
  - Antartida
  - Guayana Francesa

La prioridad es: codigo > alias de mapa > nombre oficial > nombre local > alias curado. Se evita el matching difuso agresivo en clicks para no abrir fichas incorrectas.

## Modo 3D y Modo 2D

### 3D

- Cesium globe con foco mas rico, atmosfera opcional y etiquetas adaptativas.
- Presets manuales y automaticos.
- Ajuste fino por dispositivo y FPS.

### 2D

- Geometria simplificada.
- Hover muy reducido.
- Navegacion mas contenida para mejorar fluidez.
- Perfil especifico para mobile.

## Rendimiento

La estrategia actual combina:

- perfiles `low`, `medium`, `high`;
- logica separada para 2D y 3D;
- `requestRenderMode`;
- scheduler de render para evitar repintados innecesarios;
- caches de recursos y GeoJSON preparado;
- modulos secundarios (`news`, `compare`, `quiz`) cargados bajo demanda al abrir paneles;
- cache runtime con limite y reintento limpio de descargas fallidas;
- service worker con version fechada y precache liviano: todos los recursos esenciales deben descargarse, solo los favicons son opcionales;
- cache offline parcial: shell inicial en `APP_CACHE`, recursos bajo demanda en `RUNTIME_CACHE` y tiles en `TILE_CACHE`;
- veto explicito para que `countries_full.json` y `conflict_details.generated.json` no entren en CacheStorage;
- GeoJSON, banderas y escudos solo se cachean cuando el usuario los pide;
- limpieza agresiva de caches `geo-risk-*` viejos durante `activate`;
- degradacion automatica con FPS suavizado;
- supresion temporal de hover cuando la escena cae;
- limpieza de labels si el rendimiento lo necesita.

El modo offline guarda el shell local y recursos visitados, pero no garantiza el arranque completo: el motor Cesium local no se guarda en CacheStorage y sigue requiriendo red o cache HTTP del navegador; sus workers, CSS e imagenes siguen siendo externos. Sin motor, mapa y controles pueden no inicializarse. Tampoco garantiza datos profundos no visitados ni noticias en vivo.

## Dataset metadata

Cada pais puede incluir:

- `metadata.sources`
- `metadata.quality`
- `metadata.provenance`
- `metadata.updatedAt`

Esto permite:

- mostrar trazabilidad en la ficha;
- generar paneles de salud del dataset;
- validar calidad por seccion;
- distinguir campos curados, confirmados, estimados y faltantes.

## Exportacion

La exportacion actual usa:

- `html2canvas@1.4.1` local para PNG;
- `jsPDF@4.2.1` local para PDF, sin usar el overload HTML de output;
- nombres de archivo contextuales con fecha, tema y modo.

Se exportan:

- ficha del pais
- comparador
- ranking/panel izquierdo

## Offline

- `sw.js` cachea shell, dataset local, docs y assets principales.
- El shell local se prueba offline por separado del motor remoto; esto no equivale a probar un mapa completamente offline.
- `registerServiceWorker` no enumera ni desregistra aplicaciones ajenas ni recarga ante la primera activacion. `register` comprueba la actualizacion sin una segunda llamada redundante a `update`.
- Un worker nuevo espera confirmacion en el aviso de actualizacion; `SKIP_WAITING` se envia solo al pulsar `Actualizar`. `controllerchange` recarga solo la pestaña que lo solicito. Al cerrar todos los clientes, el navegador puede activar la version en espera normalmente.
- El fallo de un recurso esencial rechaza `install` antes de limpiar caches anteriores en `activate`. Los registros se identifican por scope exacto y ruta de `sw.js` al limpiar; los nombres de CacheStorage aun usan el prefijo compartido `geo-risk-*` por origen.
- Pruebas reales del worker cubren primera activacion con ficha abierta, descarga incompleta, version en espera, confirmacion y cache bajo raiz/subcarpeta. Las pruebas con documento minimo no certifican funcionamiento offline del motor remoto.
- Imagenes y noticias remotas siguen dependiendo de conectividad cuando vienen de terceros.
- La portada consume solo el indice liviano para mostrar diagnostico de cobertura sin bloquear el globo.
- Las metricas de portada se cachean por firma de dataset/modo para no recorrer todos los paises en cada apertura del modal.
- `html2canvas` y `jspdf` se cargan bajo demanda solo cuando el usuario exporta imagen o PDF.

## Criterios de calidad de conflictos

- Cada conflicto debe tener nombre canonico en espanol, fechas, region, tipo, escala y estado.
- Los bandos deben ser coaliciones reales o estados/organizaciones, no `Bando 1` / `Bando 2`.
- Las batallas deben apuntar a su guerra o campana padre cuando exista.
- Los textos importados no deben conservar controles de Wikipedia, anexos, entidades HTML sueltas ni duplicaciones de listas.

## Tests y validacion

`npm run performance:profile -- --trace-only --observe-ms=35000` extiende la captura despues de que el mapa esta listo. `afterReadyMs` ubica las tareas antes o despues de ese punto; la traza incluye instrumentacion y se usa para diagnosticar, no para comparar presupuestos de release.

Actualmente existen pruebas para:

- normalizacion de texto;
- matching de paises;
- logica de modal/render;
- cobertura del mapa;
- validacion del dataset.

Comandos utiles:

- `npm run test`
- `npm run validate:data`
- `node scripts/buildDataset.js`

## Medicion real de arranque

`npm run performance:snapshot` reconstruye `dist/public` y mide 60 segundos desde la navegación en Chromium para escritorio y móvil emulado (390 x 844, touch, CPU x4). Usa contextos nuevos, caché HTTP desactivada y service worker bloqueado. Depende de la red para CDN e imágenes remotas. No sustituye una prueba en un teléfono físico ni garantiza rendimiento equivalente en otro equipo.

`reports/performance-snapshot.json` conserva navegador, equipo, método, tiempos de preparación, long tasks reales, tiempo de bloqueo acumulado y errores de recursos. Los FPS corresponden a seis segundos de rotación 3D o desplazamiento 2D programáticos con eventos `postRender` de Cesium. Después de cerrar la observación de 60 segundos y la muestra de FPS, una fase separada verifica por píxeles que el canvas no esté vacío y cambie; `canvasVerification` registra sus tiempos y muestras. No se interpreta la inactividad de `requestRenderMode` como congelamiento.

`renderDiagnostics` conserva resolucion, tamaño del canvas, MSAA/FXAA iniciales y finales y, cuando el navegador lo permite, fabricante/renderer GPU. La consulta WebGL del driver se realiza despues de la ventana de medicion y de la verificacion visual; `null` indica informacion no disponible, no un renderer supuesto. El snapshot no garantiza que otro arranque use la misma GPU ni elimina la variabilidad del equipo.

Desde v1.6.231, `renderState` conserva el estado real del bucle, la fase/intentos de recuperacion y sus eventos. El check `renderLoopHealthy` exige bucle activo, controlador sano y cero intentos: una pantalla recuperada tras un error inesperado no pasa silenciosamente la puerta de release. La E2E `-- --recovery-only` inyecta errores deliberados de primitiva y del widget y perdida de contexto en 2D/3D, fuera de las mediciones normales.

Desde v1.6.224, la lectura síncrona de GPU queda fuera de los intervalos medidos: `readPixels` puede bloquear el hilo y alteraba los FPS y long tasks del propio test. La puerta de release rechaza verificaciones visuales superpuestas con la medición. No comparar directamente estos tiempos con snapshots anteriores ni atribuir una mejora del medidor al producto. Referencia: [MDN, WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices).

La inicialización diferida de UI cede el hilo entre grupos de controles con prioridad `user-visible`, mantiene su orden y continúa ante errores aislados. El tiempo total de `deferredUi` incluye esas pausas; no equivale a una tarea bloqueante continua.

`app-boot-scheduler.js.scheduleWhenQuiet` se reserva para trabajo opcional. `timeout` limita la espera del callback ocioso, pero nunca permite ignorar `isQuiet` o `isVisible`; ambas guardas se comprueban al programar y al ejecutar. Ocultar la pestana cancela temporizadores/callbacks pendientes sin sondeos; regresar espera `quietFor` y respeta el delay inicial. Devuelve una cancelacion idempotente y limpia listeners al terminar. Un token invalida callbacks tardios y los errores de la tarea se registran sin reintentos automaticos.

`scheduleWhenGlobeIsQuiet` exige tambien que los controles hayan terminado de arrancar. Si falta el modulo, omite la tarea opcional sin un fallback que compita con la interaccion. Las cargas de fichas y otras acciones explicitas no pasan por esta cola. Estas guardas controlan el inicio de tareas pendientes: no cancelan una descarga o un calculo que ya comenzo ni eliminan el pico de evaluacion del SDK. `test:startup` incluye reloj y visibilidad simulados; `test:e2e:critical -- --scheduler-only` comprueba arrastres reales en ambos viewports, con y sin requestIdleCallback.

Desde v1.6.230, `globe-loading` viene declarado en el HTML y se retira solo despues de conectar todos los controles. `bootMetrics.completedAt` y el criterio de disponibilidad del navegador incluyen ahora esa activacion; no comparar el tiempo total con versiones anteriores como si midiera exactamente el mismo hito. El mapa puede moverse durante la espera, pero los clics de ficha y la bienvenida esperan a la interfaz. Un modulo requerido ausente o un grupo de controles fallido mantiene el bloqueo y muestra una recarga accesible. La preparacion offline se ejecuta aparte y no retrasa este hito. `npm run test:e2e:critical -- --startup-only` comprueba scripts retenidos/fallidos, primera visita y recuperacion; las pruebas unitarias cubren tambien errores de controles y offline pendiente o rechazado.

Falla el comando si el arranque o la muestra están incompletos, hay errores JavaScript, faltan recursos locales, el canvas no cambia, la escena real no coincide con el modo declarado o se cargan monolitos pesados al iniciar. Las tareas mayores de 200 ms, FPS activos por debajo del 80% del objetivo configurado y errores de red se reportan como observaciones para diagnóstico, no como umbrales portables entre equipos. Se conserva el objetivo: el límite móvil intencional de 22 FPS no equivale a una caída de rendimiento. Las pruebas unitarias sintéticas se conservan separadas en `npm run test:performance-metrics`.

`npm run performance:profile` reconstruye el build y captura una traza de arranque móvil con muestreo de CPU; `-- --desktop` selecciona escritorio y `-- --trace-only` omite el muestreo. Esta última opción ayuda a contrastar la evaluación de scripts porque el perfilador de CPU puede alterar su compilación y tiempos. Escribe `reports/startup-profile.json`, ignorado por Git y fuera del deploy. Sus tiempos incluyen sobrecarga de instrumentación y no sustituyen el snapshot de 60 segundos. La prueba E2E guarda capturas de escritorio/móvil en `tmp`, eliminadas por la limpieza local.

Desde v1.6.238, `app-map-engine.js` importa `vendor/cesium/engine.js` con el mismo query de release que el cargador, incluso bajo subcarpetas. Reemplaza el ESM completo del CDN usado desde v1.6.225. `init` sigue esperando `GeoRiskMapEngineReady`; no hay segundo motor de respaldo ni cambio de version de Cesium. La etapa `bootMetrics.steps.mapEngine` incluye espera de red y evaluacion, no solo CPU.

### Paneles cerrados y refrescos diferidos

Desde v1.6.239, los contenidos directos de Capas, Comparador, Quiz y Noticias tienen `display: none` cuando su `details` no esta abierto, igual que Rankings. No se depende solo del ocultamiento nativo de `details`: en las trazas de Chromium, la finalizacion de una respuesta forzaba el layout de cientos de objetos de controles cerrados alrededor de los 30 segundos. La regla explicita conserva los encabezados y elimina ese trabajo sin cambiar el comportamiento de los paneles abiertos.

`rerenderCurrentPanel` verifica el modal tanto antes de agendar como al recibir el temporizador. Las respuestas de datos no deben reabrir fichas cerradas, incluidas las selecciones por continente, religion y grupo. Rankings actualiza la poblacion mundial al abrirse y omite escrituras si esta cerrado o el texto es identico. `test:startup` cubre las carreras con temporizadores; `test:e2e:critical -- --panels-only` comprueba seleccion, DOM y apertura en ambos viewports.

Para aislar el CSS: `npm run build:prod` y `node scripts/benchmarkClosedPanels.js --baseline=v1.6.238`. Ejecuta seis muestras ABBAAB secuenciales con navegador nuevo, CPU x4 y 35 segundos despues de disponibilidad, sin muestreo de CPU ni observador DOM. Solo cambia `style.css`; el JavaScript y los demas assets son comunes. Guarda hashes, entorno, muestras y mediana en `reports/closed-panels-benchmark.json`, fuera del deploy. No ejecutar otros tests de navegador al mismo tiempo. El snapshot de release mide aparte 60 segundos con movimiento del mapa.

La mediana del mayor layout posterior paso de 288,249 a 0,384 ms en Chrome 153. Las tres muestras candidatas registraron 0,220 / 0,384 / 1,801 ms frente a 301,049 / 288,249 / 279,750 ms del CSS anterior. El reporte conserva un pico no relacionado con layout de 792,243 ms en una muestra candidata: no se afirma que hayan desaparecido todas las tareas largas.

Para investigar una regresion, `npm run performance:profile -- --trace-only --dom-details --observe-ms=35000` agrega observacion de mutaciones, llamadas seleccionadas, recursos y eventos envolventes de cada layout. Este modo agrega instrumentacion y no se usa para los numeros comparativos. La sustitucion de CSS exige exactamente una peticion coincidente para evitar comparaciones falsas.

`--active-map` reproduce seis segundos de movimiento de camara y cuenta frames; observa ocho segundos por defecto, exige al menos 6500 ms y rechaza una muestra inconclusa. `--webgl-details` registra llamadas WebGL de al menos 5 ms (hasta 500), defines de shaders y longitudes de fuentes, con sobrecarga deliberada de diagnostico. `--native-aa=on|off` modifica solo la opcion de antialias del contexto canvas durante esa ejecucion; el reporte confirma el valor efectivo despues de cerrar la traza. Ninguna de estas opciones modifica la calidad publicada. `reports/native-aa-experiment.json` conserva seis muestras exploratorias ABBAAB sobre v1.6.239: la mediana de la mayor tarea posterior a disponibilidad fue 181,106 ms con AA y 192,589 ms sin AA. No justifica una mejora al desactivarlo; no es un benchmark de v1.6.240 ni una prueba en celular fisico.

### Motor reducido reproducible

`npm ci` instala `@cesium/engine@15.0.0`, `@cesium/widgets@11.0.0` (CesiumJS 1.127) y esbuild fijado. El override `@zip.js/zip.js@2.7.57` conserva los subpaths que importa este motor; 2.8 no es compatible con esos imports. `npm run build:map-engine` genera el ESM con 24 exports, minificacion, tree shaking y eliminacion de bloques de validacion debug igual que el build release de Cesium. Conserva `Viewer`, modos 2D/3D, entidades, etiquetas, GeoJSON y recuperacion de render. No modifica la geometria ni la calidad grafica.

Se versionan el JS, las licencias completas suministradas por las dependencias y el manifest con hashes/versiones. `build:prod` regenera en memoria con `--check` y rechaza archivos faltantes o desactualizados; no publica scripts de construccion ni node_modules. Las regresiones comprueban pragmas balanceados, exports usados por la app, hashes, inclusion en el deploy y exclusion del precache/cache runtime.

El motor pasa de 4.023.157 a 3.428.390 bytes sin comprimir (14,8 % menos). El limite historico de 1 MiB sigue correspondiendo solo al nucleo local de app; nunca incluyo el SDK remoto. Ahora `startup-assets.json` y `performance-snapshot.json` informan tambien `mapEngine` (presupuesto 3.500.000 bytes) y `appCoreAndEngine` (4.500.000 bytes). El nucleo mas motor ocupa aproximadamente 4,09 MiB, sin contar CSS/imagenes/workers externos ni peticiones de datos/geometria. No se presenta como un arranque total menor a 1 MB.

La estructura modular y el build se apoyan en la [documentacion de Cesium](https://cesium.com/blog/2022/12/07/modular-structure-in-cesiumjs/) y su [construccion oficial 1.127](https://github.com/CesiumGS/cesium/blob/1.127/scripts/build.js). `CESIUM_BASE_URL` sigue fijado al CDN 1.127 para workers y assets: este cambio no promete un mapa completo sin conexion.

Para repetir la comparacion, conservar localmente el [ESM oficial 1.127](https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/index.js), ejecutar `npm run build:prod` y `node scripts/benchmarkMapEngine.js --baseline=<archivo>`. El script verifica el hash del original y del candidato en el build, alterna seis muestras ABBAAB con ambas respuestas locales y escribe `reports/startup-engine-benchmark.json`. Solo reemplaza el motor: no compara releases completas. La mediana de la mayor evaluacion de modulo antes de disponibilidad bajo CPU x4 paso de 439,8 a 111,0 ms en Chrome 153, movil emulado. Son trazas instrumentadas sin muestreo de CPU, no mediciones en telefono real ni una reduccion equivalente del tiempo total de arranque. El snapshot separado de 60 segundos conserva las tareas largas y FPS reales observados, incluidas las advertencias que queden.

La puerta de release permite `--reuse-browser`: reutiliza una muestra completa durante un máximo de seis horas únicamente si coinciden hashes del build, versión, código del medidor y entorno del equipo. Conserva la fecha original e informa explícitamente la reutilización. `--fresh` fuerza una medición nueva; el comando sin opciones también mide de nuevo.

`npm run build:indexes` genera `data/runtime_supplemental.json` a partir del dataset curado y del CSV poblacional interno. El cliente descarga ese suplemento diferido, no `data/raw/**`. Conserva el intervalo de años de cada variación poblacional y omite las tasas anuales cuando faltan observaciones consecutivas. El service worker lo almacena solo tras consultarlo, fuera de `APP_SHELL`.

## Seguridad de publicacion

Desde v1.6.244, `scripts/lib/security-policy.js` comparte la politica de archivos sensibles entre el build y el servidor local. La copia de directorios publicos se valida antes de copiar y el resultado se vuelve a revisar. El servidor verifica tanto la ruta solicitada como su destino real y mantiene escucha local; no sustituye un hosting de produccion.

`scripts/lib/secret-scanner.js` instala y ejecuta Gitleaks con version/hash fijados, timeout y salida redactada. `checkSecurity.js` revisa una copia temporal de los archivos de Git y usa el modo git del scanner para el historial. El pre-push analiza commits locales no publicados; release/CI recorren el historial completo. El build escanea tambien sus archivos finales. No se omite una comprobacion si el ejecutable falta, Git es superficial o ocurre un error. La politica, excepciones revisadas y limites estan documentados en `SECURITY.md`.

El plugin del motor retira la constante de evaluacion de `Source/Core/Ion.js` durante el build, sin modificar node_modules ni quitar avisos de licencia. Un cambio de la declaracion esperada interrumpe la compilacion hasta revisarlo. GeoRisk no utiliza servicios Ion autenticados; cualquier integracion futura que precise credenciales requiere su propio diseno de seguridad.

## Etiquetas visibles del mapa

Desde v1.6.243, `renderMapLabels` conserva la seleccion global por prioridad y los limites de cada perfil, pero filtra sus candidatos antes de crear entidades. Para anclas sobre la superficie del elipsoide, el producto escalar de la normal geodesica con el vector hacia la camara descarta el hemisferio oculto. El filtro tambien comparte el limite de distancia con `DistanceDisplayCondition` y comprueba la proyeccion dentro del canvas. Esto evita depender del depth buffer, que las etiquetas ignoran para permanecer legibles sobre los rellenos de paises.

Durante navegacion y transiciones no se reconstruyen etiquetas; el fin del movimiento, el cambio de dimensiones y la llegada de datos de paises las actualizan. Este ultimo refresco reemplaza los nombres iniciales de GeoJSON sin requerir movimiento del usuario. `Rectangle.width` y `Rectangle.height` calculan la prioridad geografica, incluido el cruce del meridiano 180.

La vista inicial de escritorio observada pasa de 88 entidades a 20; no es una medicion de aceleracion total. Se conservan fuentes, transparencia, limites y el inicio movil sin etiquetas. `map-labels.test.js` cubre la geometria con las clases reales de Cesium y se integra al gate de arranque. `test:e2e:critical -- --map-labels-only` verifica datos tardios, visibilidad, pixeles de texto, movimiento, resize y modos en escritorio y movil emulado. Las capturas se guardan temporalmente en `tmp/`; la prueba no reemplaza un telefono fisico.

## Rotacion automatica del globo

Desde v1.6.242, `app-map-interactions.js` mantiene un controlador de rotacion separado de `isCameraNavigating`. Los eventos `moveStart`/`moveEnd` siguen notificando movimiento al monitor de FPS, las etiquetas y el scheduler; solo dejan de registrar una nueva interaccion si el controlador conserva la autoria del giro. Los punteros del canvas, rueda y teclado revocan esa autoria. La liberacion se escucha en el documento para cubrir gestos que terminan fuera del mapa; cancelacion, perdida de foco y visibilidad limpian contactos retenidos.

El controlador conserva la pausa de 3,2 segundos tras interaccion y no vence un contacto sostenido. Integra tiempo real a 0,045 radianes por segundo, con paso maximo de 50 ms y reinicio temporal al pausar. No gira en 2D, durante carga/transicion, con modales, pestaña oculta o render detenido. La activacion explicita desde 2D solicita 3D. `map-auto-rotation.test.js` cubre la velocidad a 22/34/60 FPS, prioridades y limpieza; `test:e2e:critical -- --auto-rotation-only` verifica movimiento y pixeles, raton/tacto nativos, pausa y reanudacion en ambos viewports. Forma parte del release check, sin reemplazar pruebas en un telefono fisico.

La traza exploratoria anterior al cambio atribuyo los mayores frames iniciales a Cesium y compilacion de shaders. Aunque `maximumRenderTimeChange` es finito tras ajustar calidad, el reloj de simulacion permanece pausado: ambas muestras de reposo de cinco segundos dieron cero frames y cero solicitudes. Se conserva esa configuracion y no se presenta el arreglo de rotacion como una optimizacion de arranque.

## Curaduria naval de septiembre de 2026

La v1.6.241 incorpora `scripts/lib/conflict-curation-gata-halifax.js` al autofix existente. El grano es una accion historica unica, compartida por varios enlaces de pais, no un conflicto distinto por cada Estado actual. Gata se publica bajo 1815 y la segunda guerra berberisca; Halifax, bajo 1782 y la independencia estadounidense. Las fuentes y cautelas viajan en los shards profundos, no en el indice inicial. Gata agrega Argelia y Espana; Halifax agrega Canada y Reino Unido. Espana y Canada no se presentan como participantes historicos por esos enlaces.

El catalogo naval y DANFS coinciden en el 17 de junio para Gata, pero otra sintesis del NHHC indica el 18 y DANFS usa una localizacion diferente. Se explicitan esas diferencias. Para Halifax, los relatos reproducidos por la Colonial Society ubican el inicio el 28 de mayo y la rendicion la madrugada del 29; el catalogo NH 56479 registra el 29. No se fusionan recuentos divergentes de duracion o bajas. El total sigue en 2000 conflictos: las jerarquias provisionales pasan de 27 a 25, los no fechados de 94 a 92 y el indice fechable de 1905 a 1907. `gata-halifax-curation.test.js` comprueba nombres, enlaces, fechas, fuentes, ausencia de duplicados y separacion entre perfiles compactos y detalle.

La ficha ahora propaga `datePrecision`, `curationNote` y `treaties`, escapa su texto y no genera secciones vacias. El refresco diferido exige el mismo token de apertura y la misma entrada del registro, ademas del modal visible; cerrar, reabrir o cambiar de conflicto invalida la respuesta anterior. Los eventos del mismo ano conservan el orden editorial. La presentacion respeta metadatos explicitos antes de inferir tipo, escala o region y distingue la preposicion "frente a" de un frente militar. `test:modal-render` prueba estos contratos; `test:e2e:critical -- --conflict-curation-only` retiene una descarga, cambia de conflicto y comprueba notas, fechas, tratados y ancho util en ambos viewports.

## Limites conocidos

- `script.js` sigue siendo grande y todavia concentra orquestacion importante.
- El numero de assets simbolicos locales reales todavia es menor al deseado.
- Parte de las capas tematicas sigue usando proxies por falta de fuente dura local.
- Noticias reales dentro de la app dependen de terceros y tienen fallbacks.

## Siguiente paso tecnico recomendado

La siguiente fase de arquitectura deberia extraer de `script.js` tres dominios todavia pesados:

- mapa
- ficha de pais
- timeline y conflictos

Eso dejaria la base mucho mas testeable y reducira regresiones al seguir expandiendo producto y dataset.

Para la siguiente etapa de plataforma, ver tambien `BACKEND_PLAN.md`.
