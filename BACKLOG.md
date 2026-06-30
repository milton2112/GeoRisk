# GeoRisk Backlog Completo

Esta lista se mantiene como tablero vivo del proyecto. La prioridad sale de las auditorias locales, pruebas de release, reportes de datos y problemas visibles reportados durante uso real.

## Estado auditado

- Estado general: operativo, sin issues criticos en `reports/project-audit.json`.
- Arranque critico: 972 KB, bajo el limite de 1 MB pero todavia cerca del umbral.
- `script.js`: 667 KB, bajo el limite de 700 KB pero sigue siendo el mayor bloque.
- `countries_index.json`: 168 KB, bajo el limite de 240 KB.
- Auditoria de conflictos: 2003 conflictos escaneados, 0 alertas.
- Consistencia semantica de conflictos: 0 cerrados marcados activos, 0 `ongoing:false` con `active:true`, 0 rangos de fecha invalidos, 0 acciones historicas abiertas, 0 textos narrativos `"null"`, 0 regiones sospechosas detectadas.
- Fichas grandes detectadas: USA, GBR y FRA superan el umbral de peso por volumen de conflictos, organizaciones y rivalidades.

## Hecho en la tanda actual

- Agrega una entrada publica guiada con flujos obvios: buscar o tocar pais, ver riesgo, comparar y explorar conflictos.
- Conecta cada accion de onboarding con la UI real: buscador, comparador, radar de riesgo y capa de conflictos.
- Agrega estado visible de arranque por fases para mejorar la percepcion de performance en PC y celular.
- Refuerza confianza de datos en portada y chip de estado: calidad, fuentes por seccion, estimaciones marcadas y curaduria pendiente.
- Mantiene el pulido visual nuevo fuera del CSS critico moviendolo a `style-polish.css`.
- Amplia pruebas de higiene visual para bloquear regresiones de onboarding, feedback de arranque y flujos principales.

## Prioridad critica

- Mantener el arranque critico por debajo de 1 MB en cada release.
- Bajar `script.js`, que sigue cerca del limite de 700 KB.
- Mantener `countries_index.json` por debajo de 240 KB y revisar cada crecimiento.
- Evitar que `countries_full.json` y `conflict_details.generated.json` entren al arranque o al precache inicial.
- Dividir fichas grandes por seccion, empezando por USA, GBR y FRA.
- Seguir midiendo congelamientos de inicio con long tasks y FPS real en PC y celular.
- Verificar interacciones criticas: click de pais, rankings que marcan paises, busqueda y ficha.
- Mantener en 0 la nueva consistencia semantica de conflictos: cerrados activos, `ongoing:false` activo, rangos invalidos, acciones historicas abiertas, textos `"null"` y regiones sospechosas.

## Datos

- Seguir curando batallas sin fecha consolidada fuera del indice publico.
- Revisar conflictos con detalle estructural pero sin bajas, tratados o cronologia fina.
- Profundizar jerarquia guerra > campana > batalla cuando haya fuente segura.
- Completar causas, consecuencias, resultado y participantes reales en conflictos prioritarios.
- Separar con claridad conflictos activos e historicos.
- Revisar conflictos activos reales con fuente externa antes de cerrar cada release de datos.
- Completar capitales multiples y ciudades destacadas con nombres docentes normalizados.
- Revisar idiomas por diversidad linguistica en paises grandes.
- Profundizar religiones por denominacion sin crear categorias redundantes.
- Mantener organizaciones internacionales normalizadas y sin traducciones parciales.
- Completar rivalidades, alianzas, bloques y disputas territoriales prioritarias.
- Mejorar trazabilidad por seccion: fuente, estado de curaduria y campos estimados.
- Mantener reportes internos fuera de produccion.

## Rendimiento y arquitectura

- Extraer mas logica de `script.js` hacia modulos de dominio.
- Separar render de ficha pais, timeline, conflictos, comparador, quiz y noticias.
- Seguir moviendo calculos pesados a workers.
- Cachear resultados de rankings, busquedas y comparaciones con invalidacion simple.
- Evitar recalculos si el panel correspondiente esta cerrado.
- Reducir `Object.values(countriesData)` repetido en UI.
- Mantener geometria simplificada por defecto en mobile.
- Diferir geometria detallada hasta zoom cercano.
- Aprovechar `requestRenderMode` y reducir trabajo visual mientras se arrastra el globo.
- Registrar degradaciones automaticas de calidad por FPS sostenido.

## UI y UX

- Pulir modales, hubs, toolbar y panel izquierdo.
- Mejorar navegacion mobile y controles compactos.
- Evitar cualquier desborde de texto en botones, tarjetas y paneles.
- Mejorar loading, skeletons y estados offline.
- Mejorar foco visible, navegacion por teclado y tooltips utiles.
- Agregar modo docente/presentacion mas claro.
- Hacer mas visibles vistas guardadas, favoritos y acciones de compartir/exportar.
- Mejorar consistencia visual, contraste y densidad informativa.

## Busqueda, rankings y comparador

- Mejorar busqueda natural para consultas por religion, continente, sistema politico, bloque y rivalidad.
- Mostrar sugerencias agrupadas por tipo.
- Mejorar ranking de resultados y cache de busquedas recientes.
- Revisar rankings de riesgo, calidad de datos, conflictos activos, presion militar, fragilidad y diplomacia.
- Explicar scores con fuentes/componentes y separar metricas reales de proxies.
- Permitir comparaciones de mas de dos paises con secciones historicas, economicas, militares y diplomaticas.

## Timeline y ficha pais

- Virtualizar listas largas de timeline.
- Mejorar filtros por siglo, intensidad, relevancia y categoria.
- Conectar eventos con conflictos relacionados.
- Agregar vista global por ano/siglo y comparacion temporal entre paises.
- Cargar secciones pesadas de ficha bajo demanda.
- Mejorar resumen ejecutivo, checklist de faltantes y modo compacto/docente.
- Mejorar exportacion y compartir ficha.

## Noticias y quiz

- Mantener noticias fuera del arranque.
- Mejorar fallback offline, cache temporal, filtros por tema y estado vacio.
- Evitar consultas externas demasiado amplias.
- Generar banco de preguntas desde datos confiables y evitar preguntas con campos faltantes.
- Agregar dificultad, feedback explicativo, practica, examen y revision de errores.

## Testing y release

- Mantener `npm test` y `npm run release:check` como puerta de release.
- Agregar mas pruebas de interaccion real para rankings, busqueda y ficha pais.
- Seguir probando offline despues de una visita inicial.
- Automatizar medicion de startup y auditoria de proyecto en cada version.
- Mantener `reports/project-audit.json` como fuente principal de la lista de pendientes.
- Documentar cada version en `CHANGELOG.md`.
- Etiquetar releases semanticos y subir tags.
