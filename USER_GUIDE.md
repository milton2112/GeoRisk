# GeoRisk User Guide

## Que es GeoRisk

GeoRisk es un atlas geopolitico interactivo para explorar paises, conflictos, historia, relaciones internacionales y comparaciones globales.

Incluye:

- mapa 2D y 3D;
- ficha modal de pais;
- rankings globales;
- capas tematicas;
- comparador;
- quiz educativo;
- hub de noticias;
- timeline historico;
- conflictos curados;
- salud del dataset y trazabilidad.

## Formas recomendadas de usarlo

### 1. Explorar rapido

- Escribi un pais, continente, religion, sistema politico u organizacion en el buscador.
- Toca un pais en el mapa para abrir su ficha completa.
- Cambia entre 2D y 3D segun el dispositivo o el contexto.

### 2. Analisis geopolitico

Usa este modo cuando quieras comparar y detectar patrones:

- activa capas tematicas;
- abre rankings;
- cruza rivales, bloques, conflictos y sistema politico;
- usa comparador y timeline comparado.

### 3. Enciclopedia

Usa este modo cuando quieras leer:

- ficha del pais;
- historia;
- timeline;
- conflictos;
- simbolos;
- procedencia y calidad del dato.

### 4. Presentacion

Usa este modo para:

- clase;
- demo;
- exposicion;
- compartir pantalla con menos ruido visual.

## Paneles principales

### Capas tematicas

Sirve para:

- cambiar la capa del mapa;
- aplicar filtros;
- ajustar idioma;
- elegir calidad de render;
- cambiar etiquetas;
- guardar vistas y favoritos.

### Rankings globales

Sirve para:

- ver tops de poblacion, PBI y otras metricas;
- abrir grupos por continente o religion;
- exportar el panel.

### Ficha del pais

Se abre al tocar un pais.
Ahora incluye un bloque temporal de "Que falta curar" para marcar campos incompletos, estimaciones, secciones flojas y areas donde conviene mejorar la ficha.

### Smoke test local

Para revisar la app sin depender del plugin de navegador:

```bash
npm run smoke:server
```

Despues abri `http://127.0.0.1:5525/`.

### Auditoria de conflictos

Para generar el reporte de limpieza de conflictos:

```bash
npm run audit:conflicts
```

El reporte queda en `reports/conflict-audit.json` y las sugerencias automaticas seguras en `reports/conflict-autofix-suggestions.json`.

Incluye:

- resumen general;
- capitales;
- idiomas;
- estructura estatal;
- simbolos;
- economia;
- militar;
- politica;
- relaciones;
- religion;
- fuentes y calidad.

Se cierra:

- tocando afuera;
- con `Esc`;
- con el boton de cierre.

### Comparador

- permite elegir hasta 3 paises;
- abre una comparacion mas profunda en modal;
- incluye lectura temporal y conflictiva;
- se puede exportar.

### Quiz

- sirve para practicar capitales, religion, sistema politico, banderas y otras categorias;
- incluye modo clasico y contra reloj;
- muestra feedback educativo despues de responder.

### Noticias

- muestra fuentes recomendadas por pais;
- permite filtrar por tema;
- intenta mostrar una vista previa del titular destacado.

## Ficha del pais: como leerla mejor

### Simbolos

La ficha muestra bandera y escudo con dos tipos de cobertura:

- `activo local disponible`: existe asset local en el proyecto;
- `fallback`: la app muestra una version alternativa cuando no hay asset local.

### Mini metricas

En economia y religion aparecen tarjetas compactas para leer rapido:

- magnitud;
- presion;
- diversidad;
- participacion relativa.

### Fuentes y calidad

La seccion final resume:

- puntaje de calidad;
- fecha de actualizacion;
- secciones curadas;
- campos estimados;
- campos faltantes;
- procedencia por bloque;
- fuentes por seccion.

## Guardar trabajo

### Vistas guardadas

Guardan:

- tema;
- modo de producto;
- modo 2D/3D;
- filtros;
- pais seleccionado.

### Favoritos

Sirven para conservar configuraciones utiles que quieras reabrir rapido.

La app evita duplicados exactos para que la lista no se llene de copias del mismo estado.

## Exportacion

Actualmente podes exportar:

- ficha del pais;
- comparador;
- ranking/panel izquierdo.

Formatos:

- PNG
- PDF

Los nombres de archivo incluyen contexto y fecha para que sea mas facil ordenarlos.

## Atajos utiles

- `/`: enfoca el buscador.
- `?`: abre la guia.
- `Esc`: cierra modales y hubs.

## Consejos practicos

- En escritorio, 3D da mejor contexto geografico.
- En mobile, 2D suele ser mas rapido para escaneo amplio.
- Si queres profundidad, primero toca el pais y despues usa la navegacion rapida interna de la ficha.
- Si queres comparar, usa favoritos o vistas guardadas para volver rapido a una escena util.
- Si una fuente de noticias no responde, usa los enlaces directos del hub.

## Si algo parece raro

Si una ficha abre con menos datos de lo esperado:

- recarga la app;
- toca otra vez el pais;
- revisa la seccion `Fuentes y calidad`;
- si persiste, conviene revisar alias del mapa o cobertura puntual del dataset.

Si una version vieja queda pegada en el navegador:

- abre `Capas tematicas`;
- entra en `Proyecto`;
- usa `Limpiar cache local`;
- recarga la pagina para reconstruir el cache con la ultima version.

La portada tambien muestra una lectura rapida de cobertura: paises y territorios cargados, conflictos enlazados, capas tematicas disponibles y entidades especiales reconocidas. Sirve para comprobar de un vistazo que el dataset liviano ya esta sano antes de abrir fichas pesadas.

En `Salud dataset` vas a encontrar barras de cobertura para detectar rapido donde conviene seguir curando: timeline, conflictos, idiomas, capitales, relaciones, simbolos y procedencia. Si una barra baja, ese bloque es buen candidato para la siguiente tanda de datos.

## Checklist para curar conflictos

- Usar siempre nombres en espanol y una fecha inicial/final consistente.
- Evitar secciones redundantes como `Beligerantes` si los bandos ya estan estructurados.
- Separar guerra, campana y batalla para que la jerarquia sea navegable.
- Limpiar residuos de importacion como `ver anexo`, codigos HTML, marcas de ocultar/mostrar y bandos genericos.
- Completar, cuando exista, causa, lugar, resultado, consecuencias, tropas, bajas y paises participantes.

## Estado offline

El shell de la app, el indice inicial de paises y la documentacion deberian seguir accesibles offline despues de una carga correcta. Las fichas completas se van sumando al cache cuando se abren.

Limitaciones:

- noticias en vivo dependen de internet;
- imagenes y scripts remotos de terceros pueden requerir conectividad en una primera carga.

Si queres ver hacia donde podria crecer GeoRisk con una API propia, mira `BACKEND_PLAN.md` desde la seccion de documentacion.
