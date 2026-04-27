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
- `app-quiz-ui.js`: piezas visuales del quiz.
- `app-country-panel.js`: helpers de ficha del pais.
- `app-timeline-conflicts.js`: helpers de timeline, filtros y conflictos.

### Datos

- `data/countries_full.json`: dataset curado principal.
- `data/countries_index.json`: indice compacto para el arranque inicial.
- `data/countries/*.json`: fichas completas por pais, cargadas bajo demanda.
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
- `scripts/lib/render-logic.js`: logica pura reutilizable para tests y render.
- `scripts/lib/ui-logic.js`: helpers puros de UI y paneles.

## Flujo de datos

1. La app carga `data/countries_index.json` y `data/geo_aliases.json`.
2. Renderiza mapa, busqueda basica, capas y ficha inicial con datos compactos.
3. Si el usuario abre una ficha indexada, carga `data/countries/<codigo>.json` bajo demanda.
4. Carga curaduria y datos suplementarios despues del arranque visible.
5. Difiere `data/countries_full.json` a un momento ocioso para no congelar el globo.
6. En el mapa, resuelve clicks del GeoJSON a codigos ISO o especiales.
7. La ficha modal, timeline, comparador, quiz y noticias consumen el estado ya curado.

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
- cache runtime con limite y reintento limpio de descargas fallidas;
- service worker con precache liviano y tolerante a fallas parciales;
- degradacion automatica con FPS suavizado;
- supresion temporal de hover cuando la escena cae;
- limpieza de labels si el rendimiento lo necesita.

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

- `html2canvas` para PNG;
- `jsPDF` para PDF;
- nombres de archivo contextuales con fecha, tema y modo.

Se exportan:

- ficha del pais
- comparador
- ranking/panel izquierdo

## Offline

- `sw.js` cachea shell, dataset local, docs y assets principales.
- El shell debe seguir funcionando offline.
- Imagenes y noticias remotas siguen dependiendo de conectividad cuando vienen de terceros.
- La portada consume solo el indice liviano para mostrar diagnostico de cobertura sin bloquear el globo.

## Tests y validacion

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
