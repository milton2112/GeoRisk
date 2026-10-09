# Green Coding en GeoRisk

Politica vigente para todos los cambios desde v1.6.252. Es una regla de desarrollo,
no una certificacion ambiental ni una afirmacion de neutralidad de carbono.

## Valores y decisiones

- Suficiencia: cada nueva funcion debe resolver una necesidad. No agregar procesos,
  telemetria, animaciones ni servicios recurrentes sin utilidad demostrable.
- Eficiencia: evitar trabajo primero; despues optimizarlo. Usar eventos, cargas bajo
  demanda, resultados reutilizables y tareas acotadas. Liberar listeners y recursos.
- Longevidad: sostener equipos modestos, mobile, teclado, lectores de pantalla y
  navegadores sin APIs opcionales. No sacrificar seguridad o datos confiables.
- Control del usuario: respetar ahorro de datos, movimiento reducido y visibilidad.
  Las tareas opcionales pueden esperar; no perder acciones, notas o progreso.
- Transparencia: medir, declarar limites y documentar costos. Mas FPS no implica
  menos energia; un archivo menor tampoco demuestra por si solo menos emisiones.

## Reglas tecnicas

1. CPU/GPU: render a demanda, animacion optativa y monitores limitados al contexto
   que observan. No usar intervalos permanentes donde un evento sea suficiente.
   Los sondeos imprescindibles deben pausarse al ocultar la pagina y tener teardown.
2. Red: mantener el arranque compacto, solicitar fichas y conflictos por fragmentos,
   no precargar modos no elegidos. Con `navigator.connection.saveData`, el mapa
   conserva geometria simplificada incluso con zoom cercano. Sin esa API conserva
   el detalle progresivo normal. No se impide cambiar entre 2D y 3D.
3. Memoria y almacenamiento: caches acotados con invalidacion; reutilizar promesas
   exitosas, permitir reintentar fallos y retirar capas obsoletas. Los datos masivos
   y las herramientas internas deben permanecer fuera del precache y del deploy.
4. Dependencias: justificar tamano, mantenimiento, licencia y seguridad; reutilizar
   modulos existentes. No agregar una biblioteca solo para etiquetar algo como verde.
5. Automatizacion: pruebas focalizadas durante desarrollo y validacion completa al
   cerrar la release; reutilizar evidencia solo con entradas y entorno equivalentes.
   No crear cron jobs o mediciones continuas sin una decision que dependa de ellos.

## Evidencia y control

Las colecciones nativas de billboards totalmente ocultas difieren buffers, shaders
y comandos hasta tener un elemento visible. Reutilizan el recorrido de readiness
con un booleano, conservando imagenes, atlas y estados pendientes para reactivarse.
El motor crece 97 bytes; no agrega recorridos, recursos o actividad permanente.
Los controles Intel/SwiftShader preservan RGBA, y el arranque frio observado evita
dos enlaces de programas sin contenido visible. Las paginas existentes agregan
dos frames de comprobacion; los diagnosticos son finitos y quedan fuera del sitio.
No se infiere ahorro de energia, CO2, memoria GPU o aumento de FPS a partir de
estos contadores. Se conserva la calidad y el gate completo con limites originales.

La curaduria de Steens Mountain reutiliza los generadores y el modal actuales:
un detalle de 4035 bytes se carga bajo demanda, sin distribuir documentos fuente
ni agregar codigo del cliente. Los incrementos de indices permiten buscar y fechar
el episodio; las atribuciones y discrepancias quedan en el detalle profundo.
Se conserva el import original y no se resuelven otras entradas por semejanza.
Las regresiones agregan una busqueda y dos aperturas/cierres a cada pagina de
curaduria existente, sin mas paginas, flujos o deadlines. No es una optimizacion
del renderer ni una medicion de ahorro de CPU/GPU, memoria, energia o CO2.

El mapa plano desactiva useDepthPicking antes del primer frame: evita preparar la
textura/copia por frustum de pickPosition, conservando pick/drillPick de objetos y
el fallback nativo del rayo contra el globo para la camara. Una futura funcion de
alturas/modelos o pickPosition debe revisar esa decision. Los controles locales
Intel/SwiftShader comparan cada byte RGBA con on/off/on; el contador de copias y
la ausencia de buffers no miden bytes reales de GPU, energia ni mejora de FPS.
Las pruebas conservan calidad, seleccion, zoom manual y transiciones, sin nuevos
monitores o recursos del producto. El reloj detenido ya permite reposo sin frames;
la sospecha de redibujados periodicos se descarto y ese ajuste no cambia.

CI reparte los 27 flujos existentes entre dos runners Linux, con un navegador y
ejecucion secuencial por runner; el gate local conserva la suite completa. Solo
agrega evidencia del mismo run/intento/revision/fuentes/Chromium con cobertura
exacta, sin aceptar un shard como release. El intervalo completo de ambos shards
(desfase y teardown incluidos) mas el resto real de npm test sigue limitado a
20 minutos; preparacion y gate final tambien cuentan dentro de los 45 minutos.
La utilidad esperada es evitar reintentos fallidos por acumulacion, con el costo
de dos hosts simultaneos y preparacion/descargas/escaneos repetidos. Los JSON son
acotados y se retienen siete dias; no hay polling o recursos nuevos para la app.
Los diagnosticos locales descartaron paralelizar navegadores en un solo host:
su tiempo empeoro. El resultado local no certifica Linux ni ahorro de CPU total,
energia o CO2; se conserva evidencia/fuentes y se requiere el gate remoto.

El canvas temporal que mide glifos de Cesium pide willReadFrequently porque su
siguiente trabajo lee pixeles hacia CPU. El build acota el cambio a ese archivo
y falla si la fuente instalada cambia. Conserva algoritmo, fuentes, raster final,
geometria, calidad WebGL y cantidad de canvases; no agrega modulos de arranque,
dependencias, red, caches o monitores. El navegador puede trasladar el dibujo
temporal a CPU o ignorar el hint. La comparacion local alternada verifica RGBA y
dimensiones iguales en 36 casos; sus tiempos solo describen ese lote de glifos,
no ahorro energetico, FPS de la app ni cumplimiento del deadline remoto.

El E2E de Noticias identifica titulares por pais/tema/modo y verifica cada query
fisica contra el orden y limite nativos. Un deadline puede usar el fallback de
nombre y cambiar los ordinales; la prueba provoca ese callback real sin ampliar
2500 ms ni dormir ese plazo. Comprueba cancelacion, cache y cuerpos tardios;
observacion de timers solo en la pagina aislada y una lectura solo al fallar,
sin polling adicional o recursos para la app. El costo es una espera de fallback
necesaria para la regresion. Evitar falsos fallos es un beneficio esperado, no una
medicion de energia ni una garantia de CI Linux desde un diagnostico Windows.

`npm run test:green-coding` prueba las reglas del mapa, suspension de monitores,
limpieza de listeners y carga bajo demanda. Tambien forma parte de `test:startup`,
por lo que se ejecuta en `npm test`, pre-push y GitHub Actions. Los imports ESM
comparten las mismas pruebas dentro de cada proceso, sin duplicar su ejecucion.
El quiz tambien comprueba un unico intervalo propio, pausa sin trabajo periodico
al cerrar/ocultar y descarte de arranques/ticks obsoletos. Conserva los segundos
restantes al volver; no es un reloj de examen supervisado ni una medicion de energia.
El refresco de ficha tampoco reintenta perfiles fallidos ni reemplaza su skeleton
sin cambios. Traducir el mensaje usa solo el renderer local; descargar requiere
una accion explicita. El request en curso conserva su ownership y el perfil valido
sigue reutilizandose. Una marca de idioma queda solo en el estado del panel actual.

Busqueda, noticias y rankings comprueban false del cargador antes de construir
indices, consultar proveedores o calcular/renderizar tablas. Las consultas avanzadas
tambien descartan resultados con texto, solicitud o propietario de ficha obsoletos.
Un pais exacto se resuelve con los aliases criticos existentes, sin esperar al modulo
avanzado; autocomplete y ficha conservan sus cargas propias. Rankings solo inicia o
continua con panel abierto y pagina visible, y cerrar el contenedor mobile cierra su
details nativo. Reabrir recupera tablas aun no completadas sin otra descarga si el
modulo ya llego. Costo: dos escalares, guards por accion y sincronizacion del details,
sin nuevos monitores, caches ni dependencias. No acredita ahorro energetico.

El suplemento de fondo ya no construye el indice avanzado ni descarga aliases de
conflictos por anticipado. Esas dependencias se resuelven en los consumidores
explicitos existentes (busqueda/sugerencias, ficha militar y detalle de conflicto).
Los refrescos de datos no agendan rankings cerrados; los marcan pendientes para
su proxima apertura. Se conserva el suplemento necesario para las categorias y
fallbacks actuales. No cambia calidad visual ni soluciona por si solo los costos
nativos de inicializacion WebGL. startup-on-demand prueba cero trabajo especulativo
y las paginas existentes de paneles/conflictos verifican los consumidores reales.

`npm run check:startup-budget` conserva los limites existentes. `release:check`
ejecuta pruebas de navegador, offline, presupuestos, auditorias y snapshot de 60 s
en escritorio y mobile emulado. Las entradas del snapshot deben corresponder al
codigo actual. No aumentar limites para ocultar regresiones.

Por cambio registrar: necesidad, recursos afectados, escenario de prueba,
resultado antes/despues cuando sea comparable y limitaciones. Si aumenta un costo
necesario, explicar el motivo y el alcance; no todos los cambios reducen bytes.

Los contadores de tareas, requests, bytes y frames son indicadores de recursos,
no joules ni gramos de CO2. Una estimacion ambiental futura requiere limites del
sistema, unidad funcional, energia, intensidad electrica y supuestos de hardware.
No recolectar ubicacion ni bateria del usuario para fabricar una puntuacion verde.

Los cambios sincronos de seleccion/tema agrupan los eventos de coleccion de Cesium
con su API publica y finally, sin suspender entre frames ni retener un nuevo cache.
Un borde nuevo recibe material/ancho finales una sola vez. La regresion con seis
poligonos pasa de 24 entregas de coleccion a una, manteniendo colores, geometria,
calidad y renders solicitados. Los eventos individuales de Entity/Graphics siguen
existiendo y los errores no revierten estilos parciales. Los recorridos existentes
comprueban el estado final en 2D/3D; estos contadores no prueban ahorro energetico
ni que el deadline global de CI quede resuelto.

La coleccion de etiquetas usa el mismo helper para crear, actualizar, ocultar,
restaurar y retirar la vista. Tres altas pasan de tres entregas a una en la
regresion real; una vista sin cambios sigue sin escrituras/eventos. Los limites
mobile/zoom, horizonte, identidad y limpieza no cambian. No se omiten eventos
individuales ni se acredita resolver costos de atlas/shaders o tareas de arranque.
Las paginas de etiquetas existentes comprueban la entrega final y conservan sus
assertions de pixeles, navegacion y 2D, sin nuevas esperas o listeners permanentes.

Estado observado al cerrar v1.6.295: release:check local completo aprobado y
fingerprint vigente, pero la muestra nueva mantiene advertencias: desktop 203 ms
de tarea maxima y 25,5 FPS; mobile emulado 163 ms y 15,6 FPS. No son un A/B que
atribuya la variacion de FPS al cambio de etiquetas ni un telefono fisico.
El gate remoto previo de v1.6.294 fallo por el deadline global de npm test
(1201 s, durante testBackgroundPanels), no por una assertion de etiquetas:
[run 37646389870](https://github.com/milton2112/GeoRisk/actions/runs/37646389870).
La mejora de contadores no acredita resolver ese timeout. Mantener el bloqueo
de publicacion, limites y advertencias; no reintentar codigo sin cambios hasta verde.

## Primera implementacion

Los cambios de grosor por zoom conservan materiales de relleno/borde y outline
constante false. La firma existente se compara por componente, sin otro cache:
seis poligonos pasan de 24 avisos individuales a seis de ancho, conservando una
entrega final de coleccion. Cambios reales de color/opacidad siguen aplicandose;
una firma incompleta queda invalidada para reparar errores parciales. Costo:
parseo JSON transitorio por capa cambiada y guards por componente, sin timers,
listeners permanentes ni red nuevos. Las regresiones reales y los recorridos
existentes 2D/3D comprueban identidad y resultado final. No demuestra ahorro
energetico ni resolver el timeout remoto, que tambien fallo para v1.6.295.

Al cerrar v1.6.296, release:check local aprobo con fingerprint vigente y nueva
muestra sin reutilizacion: 33,1/22,1 FPS activos desktop/mobile emulado y tareas
maximas de 141/139 ms, sin advertencias de rendimiento. No se atribuye esa
variacion a la reutilizacion de materiales sin un A/B equivalente ni se equipara
Chrome/Intel Windows al runner Chromium/SwiftShader Linux. Su propio gate remoto
sigue siendo necesario; no se amplian deadlines ni se rerunnea codigo hasta verde.

- Se elimina el precalculo del modo cartografico alternativo. Costo: su primera
  apertura prepara la geometria bajo demanda; las siguientes reutilizan el cache.
- FPS solo se sondea durante movimiento visible; se conserva el detector de cero
  frames y el cierre a los 60 s. En reposo no hay intervalos del monitor FPS.
- La recuperacion del renderer mantiene su watchdog necesario mientras la pagina
  es visible, lo cancela oculta y lo reanuda una sola vez al volver. Se conservan
  los reintentos y limites existentes.
- Ahorro de datos evita la descarga automatica del GeoJSON detallado. Costo:
  bordes menos precisos a zoom cercano hasta desactivar esa preferencia.

## Movimiento reducido

El mapa consulta `prefers-reduced-motion` al abrir y escucha sus cambios con un
unico listener durante la vida de la pagina, sin polling. Con esa preferencia,
enfocar paises y cambiar entre 2D/3D son operaciones instantaneas. Activarla durante
un vuelo o transicion completa el destino y conserva los callbacks de seleccion.
Una rotacion guardada no se inicia; activarla explicitamente sigue siendo posible.
Cambiar la preferencia del sistema detiene la rotacion sin borrar el valor guardado
y desactivar movimiento reducido no la reinicia por sorpresa.

Beneficio: accesibilidad y ausencia de interpolaciones de camara no solicitadas.
Costo: un listener y una consulta booleana por accion, sin red ni dependencias nuevas.
No se altera el arrastre manual ni se afirma una reduccion energetica medida.
Las regresiones de `test:green-coding` y `--motion-only` en la E2E cubren arranque,
cambios en vivo, callbacks, rotacion optativa y fichas en escritorio/movil emulado.
Referencia: [matchMedia y su evento change, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia).

## Referencias

- [Web Sustainability Guidelines, W3C](https://www.w3.org/TR/2026/DNOTE-web-sustainability-guidelines-20260924/): borrador de nota de grupo, no certificacion.
- [Medicion, Green Software Foundation](https://learn.greensoftware.foundation/measurement/): limites y unidad funcional para interpretar impacto.
