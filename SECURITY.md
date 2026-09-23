# Seguridad de GeoRisk

## Modelo actual

GeoRisk es una aplicacion estatica: todo JavaScript, JSON o asset publicado puede ser descargado por un visitante. Minificar, ofuscar, CORS o un archivo `.env` incorporado al build no convierten una clave del frontend en un secreto. No agregar credenciales privadas a la app. Las futuras APIs privadas deben operar desde un backend con autenticacion/autorizacion, limites de consumo y secretos administrados fuera del contenido publico.

## Controles desde v1.6.244

- Gitleaks 8.30.1 analiza localmente los archivos versionados y nuevos no ignorados; no envia el codigo a un servicio remoto. Los commits se comprueban aparte, incluidos secretos borrados en commits posteriores.
- `npm run security:setup` descarga el ejecutable oficial y verifica el SHA-256 del archivo antes de extraerlo. Windows x64 y Linux x64 estan configurados; otras plataformas fallan explicitamente. El binario queda en `.cache/security/`, fuera de Git y del build. La descarga requiere internet; los escaneos posteriores son locales. Si falta o cambia el ejecutable, el control falla y pide reinstalarlo.
- `npm run check:security` revisa la copia de trabajo. El pre-push agrega `--outgoing` para revisar commits locales no alcanzables desde las referencias remotas, sin recorrer todo el historial en cada push.
- `npm run audit:security:history` revisa todos los commits alcanzables desde las referencias locales. Requiere un clon completo. `release:check` y GitHub Actions lo ejecutan; CI usa `fetch-depth: 0`. No incluye commits borrados o ramas remotas que no se hayan descargado.
- `build:prod` bloquea archivos sensibles, archivos ocultos y enlaces simbolicos dentro de los directorios publicos, y escanea el contenido final antes de devolver exito. No desplegar un build que termino con error.
- `npm test` ejecuta seguridad antes de las demas suites. Las regresiones usan claves ficticias creadas temporalmente y comprueban deteccion en archivos nuevos, staging, historial, artefactos y excepciones estrechas. Un error o timeout del scanner no equivale a un resultado limpio.
- GitHub Actions tiene permisos de lectura por defecto y no conserva la credencial del checkout. Solo el job de despliegue recibe `pages: write` e `id-token: write`, despues del gate. Los escaneos de fuente e historial ocurren antes de `npm ci` y de subir artefactos. No se publican reportes crudos del scanner: los diagnosticos conservan solo archivo, linea, regla y commit; los archivos temporales se eliminan.
- El servidor de desarrollo solo atiende GET/HEAD y bloquea rutas internas, dotfiles, claves, rutas codificadas sensibles y enlaces que salgan de su raiz. Incluye `nosniff` y una politica de referrer. Sigue ligado a `127.0.0.1`; no es un servidor de produccion ni estos headers configuran automaticamente el hosting.

## Dependencias y exportaciones desde v1.6.245

- La exportacion cargaba jsPDF 2.5.1 desde un CDN, fuera de package-lock y de npm audit. Se reemplaza por jsPDF 4.2.1 y html2canvas 1.4.1, fijados en npm y publicados localmente en `vendor/exports/`. El flujo usado captura PNG y lo guarda en PDF; no se demostro explotacion de los overloads HTML descritos por el aviso de jsPDF en ese flujo.
- `npm run build:export-libs` copia las distribuciones del paquete sin modificar sus bytes ni avisos y genera hashes SHA-256/SRI SHA-384 y licencias. `build:prod` verifica versiones, archivos y manifest contra las dependencias instaladas; rechaza archivos alterados o desactualizados. Tras cambiar versiones, regenerar y revisar los artefactos.
- Solo se solicitan al exportar. El navegador verifica SRI, la carga tiene timeout y limpia intentos fallidos para poder reintentar. No se confia en un global previo para omitir la verificacion. No forman parte del arranque ni de la cache offline: una exportacion que necesite cargar estas herramientas requiere conexion al sitio.
- `npm run audit:dependencies` revisa dependencias de produccion, desarrollo y opcionales. Las librerias que terminan en el navegador figuran como devDependencies, por lo que no se usa `--omit=dev`. Ejecuta en release, push/PR y auditoria semanal. Cualquier vulnerabilidad informada, error de red, respuesta incompleta o timeout detiene la puerta de release.
- El reporte `reports/dependency-audit.json` registra fecha, hash del lock, estado, paquetes y avisos; queda fuera del build publico. Es una consulta al registro npm y requiere internet. Cero avisos conocidos no certifica ausencia de vulnerabilidades; el escaneo tampoco cubre automaticamente servicios remotos ni todo el codigo incorporado dentro de distribuciones de terceros.
- SRI detecta archivos que no coinciden con el hash esperado; no protege contra un atacante capaz de reemplazar tambien el HTML/manifest. Las pruebas incluyen descargas reales en escritorio y movil emulado, rechazo de JS alterado, reintento, version, captura sin recortes y ausencia de solicitudes al CDN de exportacion.

## Entradas y renderizado desde v1.6.246

- Corrige un sumidero HTML en el encabezado del comparador: los nombres de pais se escapaban en las tarjetas, pero no al abrir el modal. Ahora se representan como texto tambien en ese encabezado. La regresion en navegador inyecta un nombre de prueba y verifica que no se creen elementos ni se ejecute su manejador.
- La mezcla recursiva de curaduria ignoraba el limite entre propiedades propias y heredadas. Se reprodujo contaminacion de `Object.prototype` con una clave `__proto__` en un JSON de prueba. Ahora excluye `__proto__`, `constructor` y `prototype` en todos los niveles, incluidos arrays, y no modifica objetos heredados. La importacion de conflictos tambien rechaza esos nombres de clave.
- Estos hallazgos requieren que datos manipulados lleguen a esos recorridos. No se identifico una interfaz publica para escribir el dataset ni evidencia de explotacion real. No equivalen a exponer claves privadas, pero se corrigen antes de ampliar las fuentes de datos.
- Las preferencias locales se leen con esquema explicito: tipos, opciones permitidas, codigos de pais, limites de listas/textos y un maximo de 131072 caracteres por JSON antes de parsearlo. Un registro incorrecto no invalida otras preferencias; las claves desconocidas no se copian y el almacenamiento original no se borra automaticamente. Las lecturas iniciales de calidad/etiquetas tambien toleran errores del almacenamiento.
- `test:security` incluye regresiones de datos/prototipos y preferencias. La E2E critica agrega arranque con preferencias corruptas y pruebas de texto/enlaces maliciosos en noticias, notas locales, historial, favoritos y comparador, en escritorio y movil emulado. Puede ejecutarse con `node scripts/tests/critical-browser-e2e.test.js --input-security-only`.
- Es una revision acotada, no una auditoria XSS integral. No se introduce un sanitizador HTML casero ni se habilita HTML de usuarios; los campos revisados siguen siendo texto escapado y los enlaces de noticias admiten solo HTTP(S).

## Politica del navegador desde v1.6.247

- `index.html` declara Content Security Policy (CSP) antes de cargar recursos. Deniega por defecto, permite scripts locales y los workers de la version fijada de Cesium, y limita conexiones a los proveedores usados de mapa/noticias. Bloquea scripts inline, manejadores HTML, `eval`, `new Function`, objetos, formularios y cambios de URL base. No es una auditoria XSS integral ni vuelve secretos los archivos publicos.
- El arranque vive en `app-bootstrap.js`, tambien incluido en el precache. Los fallbacks de banderas y escudos usan eventos externos, sin atributos `onerror`. El build comprueba que la CSP del HTML coincida con `scripts/lib/browser-security-policy.js` y aparezca antes de scripts/estilos.
- Cesium necesita `wasm-unsafe-eval` para WebAssembly; no se habilita `unsafe-eval` de JavaScript. El bundle reemplaza exclusivamente la consulta global indirecta por `eval` de Knockout 3.5.1 por `globalThis`, con verificacion del archivo y de una unica coincidencia. No modifica node_modules. Si cambia el upstream, falla el build y requiere revision; habilitar nuevos widgets de Cesium requiere volver a probar su compatibilidad.
- Se conservan estilos inline porque la app, Cesium y las capturas los necesitan. Los iframes del mismo origen siguen permitidos para html2canvas. No se permiten comodines de origen ni scripts `data:`/`blob:`; los workers tienen una excepcion explicita para blobs y el directorio versionado de Cesium. Los recursos remotos permitidos siguen siendo dependencias de confianza, no contenido verificado por esta politica.
- El servidor local envia CSP, `nosniff`, referrer limitado, restricciones de permisos y proteccion contra embeber la app desde otro origen (`frame-ancestors 'self'` y `X-Frame-Options: SAMEORIGIN`). Esto permite el iframe del exportador. No se agrega HSTS al servidor HTTP local.
- El build genera `dist/public/_headers` desde la misma configuracion para despliegues estaticos compatibles, como Netlify o Cloudflare Pages. No entra en APP_SHELL. Publicar esa carpeta en un proveedor compatible aplica las reglas; otros proveedores pueden ignorar el archivo. Las respuestas de funciones/proxies necesitan configuracion propia.
- La CSP del HTML no depende de `_headers`, pero no puede aplicar `frame-ancestors`, `nosniff`, Permissions Policy ni HSTS. No afirmar que las cabeceras HTTP estan activas sin comprobar la respuesta del sitio desplegado. Ver el estado observado de GitHub Pages mas abajo; el servidor local no configura el hosting.
- Las regresiones prueban arranque, busqueda/ficha, mapa 2D/3D, workers y fallback de imagenes sin infracciones, y rechazo real de scripts inline, manejadores, eval y solicitudes a un origen no permitido. El caso movil emulado retira la cabecera CSP para verificar la politica del HTML por separado. Las exportaciones PNG/PDF y el modo offline pasan por sus suites existentes con la politica activa. Comando focalizado: `node scripts/tests/critical-browser-e2e.test.js --csp-only`.

## Datos de ficha como texto desde v1.6.248

- La revision posterior a CSP encontro interpolaciones sin escape en origen/tipo/ano historico, organizaciones (nombre, sigla y fechas) y religion (resumen, denominacion y porcentaje). Una ficha con valores de prueba creaba 10 elementos HTML ajenos al componente. CSP bloqueaba sus manejadores, pero no impedia alterar el DOM: no sustituye el escape de salida.
- Las organizaciones reutilizan `renderList`, que acepta texto y lo escapa una sola vez. Historia y religion escapan en el punto de insercion. Se conserva el HTML creado por renderizadores internos de componentes; no se habilita HTML procedente de datos ni se introduce un sanitizador casero.
- Los renderizadores diferidos de ficha y fuentes usan un escape seguro cuando no reciben el helper habitual, y escapan las salidas de formateadores de texto. Corrige ademas el doble escape de capitales al quitar el escape previo a `renderList`.
- Son recorridos alimentados por datos del proyecto o valores manipulados en esas entradas; no se encontro un endpoint publico que permita escribirlos ni evidencia de un ataque real. La revision sigue siendo acotada y no certifica todos los sumideros de la aplicacion.
- `test:security` incluye `country-render-security.test.js`. La E2E `--country-text-only` modifica datos exclusivamente en memoria, comprueba que aparezcan como texto sin crear elementos ni activar CSP, verifica capitales sin doble escape y restaura la ficha para abrir un evento de timeline. Se ejecuta en escritorio y movil emulado, tambien dentro de `release:check`.

## Estado observado antes de v1.6.249

El 2026-09-22 se comprobo `https://milton2112.github.io/GeoRisk/` sin autenticacion: HTTP 200, version `2026-09-22-release-1`, CSP y referrer en el HTML, y HSTS en la respuesta HTTPS. No devolvio las cabeceras CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy ni Permissions-Policy. El sitio ya es publico en internet: conocer el enlace basta para visitarlo; no estar indexado por un buscador no lo hace privado.

Las solicitudes HEAD a `scripts/buildProduction.js`, `reports/doctor-report.json` y `data/countries_full.json` devolvieron 200; `_headers` devolvio 404. Esto demuestra que las exclusiones de `dist/public` no se estaban aplicando al sitio observado. No se descargaron esos archivos para la comprobacion ni se encontro evidencia de credenciales expuestas. Al cerrar v1.6.248 quedo pendiente configurar la publicacion del build validado y comprobar los 404 correspondientes, sin cambiar el proveedor. Excluir archivos del sitio no los vuelve privados si permanecen en un repositorio publico.

## Publicacion controlada desde v1.6.249

- El workflow `Release Gate` publica exclusivamente `dist/public`, nunca la raiz del repositorio. Se reconstruye despues de `release:check`, cuya limpieza borra `dist`. Una PR, fork o ejecucion programada no despliega; solo push o ejecucion manual sobre `main` del repositorio oficial.
- `deploy-pages` depende del gate exitoso y usa el environment `github-pages`. Las acciones de upload y deploy estan fijadas por SHA. Los reportes siguen como artefactos de CI separados, no como contenido del sitio; en un repositorio publico tampoco deben considerarse privados.
- Los reportes de CI solo se suben si el escaneo previo de fuente e historial termino con exito. Un fallo o timeout del scanner bloquea tambien esos artefactos, tanto en push/PR como en la auditoria programada.
- `npm run check:pages-artifact` valida archivos reales contra el manifest (hash, peso, cantidad), rechaza archivos extra, internos, rutas no canonicas, enlaces simbolicos y hardlinks. Sus regresiones se ejecutan en `test:release-gates`. La E2E `--pages-only` abre el build bajo `/GeoRisk/` y comprueba busqueda/ficha en escritorio y movil emulado.
- `npm run check:deployment -- --url https://milton2112.github.io/GeoRisk/` compara el HTML con el commit, comprueba assets esenciales y exige 404 para ocho rutas internas. Se ejecuta despues de cada deploy, con reintentos acotados por propagacion del CDN. Un fallo posterior al deploy avisa en Actions; no revierte automaticamente el sitio.
- Configuracion requerida en GitHub: Settings > Pages > Build and deployment > Source: GitHub Actions (`build_type: workflow`). Agregar el YAML por si solo no cambia el modo legacy. La CSP del HTML sigue activa; publicar `_headers` no configura cabeceras adicionales en GitHub Pages.
- El 2026-09-22 se cambio y verifico por API el origen de Pages de `legacy` (`main` + `/`) a `workflow`, conservando URL, dominio y HTTPS. El resultado del despliegue y de los 404 se registra en el job `deploy-pages`; cambiar esta opcion no demuestra por si solo que el nuevo artefacto ya este publicado.
- Los escaneos Git tienen un presupuesto de 600 segundos, frente a 150 para archivos actuales. El limite externo de release permite terminar ese proceso. Si no termina, el gate falla: no hay excepcion ni resultado limpio por timeout.
- La validacion remota tambien detecto interferencia entre dos pruebas: el fallback automatico por FPS cambiaba a 2D durante la E2E de rotacion. Esa prueba usa el perfil manual Rendimiento y exige movimiento en al menos ocho de nueve intervalos entre diez frames reales, con timeout; no exige velocidad de GPU a un runner virtual. El monitor adaptativo conserva sus pruebas de FPS/fallback y las mediciones de rendimiento siguen usando el perfil real por defecto.
- La E2E de etiquetas tambien asumia que cualquier escritorio arranca con nombres visibles. Se reprodujo el bloqueo con 4 GB/4 nucleos: la app los omite correctamente en ese perfil. La prueba de dibujo usa una preferencia explicita, conserva el arranque movil sin etiquetas y agrega una matriz de regresiones para memoria, nucleos, viewport y preferencias guardadas.
- En Chromium, las pausas de rotacion se verifican mediante el controlador y la posicion real de la camara (desplazamiento menor a 0,01 m), no mediante `moveStart/moveEnd`, que tambien notifican cambios internos del frustum. Se conservan la pausa por contacto, por modal, la reanudacion y el apagado desde el boton.

## Excepciones revisadas

El escaneo inicial de 305 commits identifico 22 coincidencias del campo `browserMeasurementKey` y una del token de evaluacion publico incluido por Cesium. No se encontraron credenciales privadas propias entre esas coincidencias.

La excepcion del hash se limita a la regla generica, el archivo `reports/performance-snapshot.json` y una linea con ese campo y 64 caracteres hexadecimales. Las pruebas comprueban que otro secreto en ese archivo sigue detectandose. El token de evaluacion se elimina al construir el motor de Cesium; `.gitleaksignore` contiene solamente el fingerprint historico exacto de su introduccion. No se excluye el motor completo ni se omiten commits completos. Los comentarios `gitleaks:allow` no desactivan las comprobaciones.

## Ante una credencial expuesta

1. No pegar su valor en issues, chats, capturas o reportes. Avisar al responsable por un canal privado.
2. Revocar o rotar la credencial en el proveedor y revisar permisos, consumo y registros de uso.
3. Retirarla del codigo y del despliegue; revisar caches y artefactos que puedan conservarla.
4. Evaluar la limpieza del historial por separado. No reescribir Git ni forzar un push automaticamente: borrar el archivo o un commit no revoca una clave.
5. Volver a ejecutar los controles antes de publicar. No agregar excepciones para conseguir un resultado verde sin investigar.

## Limites y siguientes capas

Un scanner por patrones puede tener falsos positivos y falsos negativos; no certifica ausencia de secretos ni analiza toda vulnerabilidad. Los hooks locales pueden omitirse y una modificacion de la propia politica requiere revision. La proteccion de ramas, revisiones obligatorias y push protection del proveedor requieren configuracion adicional en GitHub; esta version no cambia esos ajustes.

Quedan separadas para siguientes tandas: revision del resto de recursos/servicios externos, revision integral de inyeccion de HTML y configuracion/verificacion del despliegue publico del build y de las cabeceras pendientes. Esta tanda no agrega cuentas, bases de datos ni un backend innecesario.

## Referencias

- [Gitleaks: comandos y configuracion de la version fijada](https://github.com/gitleaks/gitleaks/blob/v8.30.1/README.md)
- [Release oficial y hashes de descargas](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1)
- [Cesium Ion: token de evaluacion publico](https://github.com/CesiumGS/cesium/blob/1.127/packages/engine/Source/Core/Ion.js)
- [OWASP: gestion de secretos y respuesta a exposiciones](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [jsPDF: aviso de inyeccion HTML y version corregida 4.2.1](https://github.com/parallax/jsPDF/security/advisories/GHSA-wfv2-pwc8-crg5)
- [jsPDF: releases y correcciones](https://github.com/parallax/jsPDF/releases)
- [OWASP: prevencion de contaminacion de prototipos](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)
- [OWASP: almacenamiento local y entradas no confiables](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
- [MDN: script-src y WebAssembly sin eval de JavaScript](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src)
- [MDN: frame-ancestors requiere una cabecera HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors)
- [Cloudflare Pages: cabeceras de archivos estaticos](https://developers.cloudflare.com/pages/configuration/headers/)
- [Netlify: configuracion de cabeceras](https://docs.netlify.com/manage/routing/headers/)
- [OWASP: escape de salida por contexto y limites de CSP](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [GitHub: publicacion y acceso publico de los sitios Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
