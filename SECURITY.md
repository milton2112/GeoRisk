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
- GitHub Actions tiene permisos de lectura y no conserva la credencial del checkout. Los escaneos de fuente e historial ocurren antes de `npm ci` y de subir artefactos. No se publican reportes crudos del scanner: los diagnosticos conservan solo archivo, linea, regla y commit; los archivos temporales se eliminan.
- El servidor de desarrollo solo atiende GET/HEAD y bloquea rutas internas, dotfiles, claves, rutas codificadas sensibles y enlaces que salgan de su raiz. Incluye `nosniff` y una politica de referrer. Sigue ligado a `127.0.0.1`; no es un servidor de produccion ni estos headers configuran automaticamente el hosting.

## Dependencias y exportaciones desde v1.6.245

- La exportacion cargaba jsPDF 2.5.1 desde un CDN, fuera de package-lock y de npm audit. Se reemplaza por jsPDF 4.2.1 y html2canvas 1.4.1, fijados en npm y publicados localmente en `vendor/exports/`. El flujo usado captura PNG y lo guarda en PDF; no se demostro explotacion de los overloads HTML descritos por el aviso de jsPDF en ese flujo.
- `npm run build:export-libs` copia las distribuciones del paquete sin modificar sus bytes ni avisos y genera hashes SHA-256/SRI SHA-384 y licencias. `build:prod` verifica versiones, archivos y manifest contra las dependencias instaladas; rechaza archivos alterados o desactualizados. Tras cambiar versiones, regenerar y revisar los artefactos.
- Solo se solicitan al exportar. El navegador verifica SRI, la carga tiene timeout y limpia intentos fallidos para poder reintentar. No se confia en un global previo para omitir la verificacion. No forman parte del arranque ni de la cache offline: una exportacion que necesite cargar estas herramientas requiere conexion al sitio.
- `npm run audit:dependencies` revisa dependencias de produccion, desarrollo y opcionales. Las librerias que terminan en el navegador figuran como devDependencies, por lo que no se usa `--omit=dev`. Ejecuta en release, push/PR y auditoria semanal. Cualquier vulnerabilidad informada, error de red, respuesta incompleta o timeout detiene la puerta de release.
- El reporte `reports/dependency-audit.json` registra fecha, hash del lock, estado, paquetes y avisos; queda fuera del build publico. Es una consulta al registro npm y requiere internet. Cero avisos conocidos no certifica ausencia de vulnerabilidades; el escaneo tampoco cubre automaticamente servicios remotos ni todo el codigo incorporado dentro de distribuciones de terceros.
- SRI detecta archivos que no coinciden con el hash esperado; no protege contra un atacante capaz de reemplazar tambien el HTML/manifest. Las pruebas incluyen descargas reales en escritorio y movil emulado, rechazo de JS alterado, reintento, version, captura sin recortes y ausencia de solicitudes al CDN de exportacion.

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

Quedan separadas para siguientes tandas: revision del resto de recursos/servicios externos, CSP compatible con Cesium y workers, revision integral de inyeccion de HTML y configuracion de headers/HTTPS del hosting real. Esta tanda no agrega cuentas, bases de datos ni un backend innecesario.

## Referencias

- [Gitleaks: comandos y configuracion de la version fijada](https://github.com/gitleaks/gitleaks/blob/v8.30.1/README.md)
- [Release oficial y hashes de descargas](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1)
- [Cesium Ion: token de evaluacion publico](https://github.com/CesiumGS/cesium/blob/1.127/packages/engine/Source/Core/Ion.js)
- [OWASP: gestion de secretos y respuesta a exposiciones](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [jsPDF: aviso de inyeccion HTML y version corregida 4.2.1](https://github.com/parallax/jsPDF/security/advisories/GHSA-wfv2-pwc8-crg5)
- [jsPDF: releases y correcciones](https://github.com/parallax/jsPDF/releases)
