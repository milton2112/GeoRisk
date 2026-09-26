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

`npm run test:green-coding` prueba las reglas del mapa, suspension de monitores,
limpieza de listeners y carga bajo demanda. Tambien forma parte de `test:startup`,
por lo que se ejecuta en `npm test`, pre-push y GitHub Actions. Los imports ESM
comparten las mismas pruebas dentro de cada proceso, sin duplicar su ejecucion.

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

## Primera implementacion

- Se elimina el precalculo del modo cartografico alternativo. Costo: su primera
  apertura prepara la geometria bajo demanda; las siguientes reutilizan el cache.
- FPS solo se sondea durante movimiento visible; se conserva el detector de cero
  frames y el cierre a los 60 s. En reposo no hay intervalos del monitor FPS.
- La recuperacion del renderer mantiene su watchdog necesario mientras la pagina
  es visible, lo cancela oculta y lo reanuda una sola vez al volver. Se conservan
  los reintentos y limites existentes.
- Ahorro de datos evita la descarga automatica del GeoJSON detallado. Costo:
  bordes menos precisos a zoom cercano hasta desactivar esa preferencia.

## Referencias

- [Web Sustainability Guidelines, W3C](https://www.w3.org/TR/2026/DNOTE-web-sustainability-guidelines-20260924/): borrador de nota de grupo, no certificacion.
- [Medicion, Green Software Foundation](https://learn.greensoftware.foundation/measurement/): limites y unidad funcional para interpretar impacto.
