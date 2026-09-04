# GeoRisk Changelog

Este proyecto usa versionado semantico:

- `MAJOR`: cambios grandes o incompatibles.
- `MINOR`: nuevas funciones importantes sin romper compatibilidad.
- `PATCH`: fixes, pulido y ajustes menores.

## Sin publicar

- Se documentaran aca los cambios posteriores a v1.6.210 antes de cerrar la siguiente version.

## v1.6.210 - 2026-09-04

- Separa la entrada ambigua de **Wenden** en la serie **Batallas de Wenden (1577-1578)** y la **Batalla de Wenden (21-22 de octubre de 1578)**, ambas dentro de la **Guerra de Livonia (1558-1583)**.
- Corrige fechas, jerarquia, geografia, aliases y navegacion desde Letonia, Polonia, Rusia y Suecia; conserva las entidades historicas de la Mancomunidad Polaco-Lituana, el Reino de Suecia y el Zarato ruso, y no presenta a la Letonia moderna como beligerante.
- Incorpora trazabilidad desde la Universidad Palacky de Olomouc y fuentes institucionales de Cesis; deja abiertas fuerzas y bajas que las fuentes no concilian, y agrega regresiones para separar la serie del combate de octubre.
- Evita que la normalizacion de texto visible altere URLs HTTP(S) de las fuentes. La regeneracion repara tambien cuatro fichas anteriores afectadas por ese patron y suma una prueba de regresion para enlaces de procedencia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-04-release-2`.

## v1.6.209 - 2026-09-04

- Normaliza **Batalla de Ty-ho Bay** como **Batalla de Ty-ho Bay (4 de agosto de 1855)**, corrigiendo fecha, jerarquía, tipología y geografía desde un conflicto regional de América hacia Lantau, actual Hong Kong.
- La clasifica como acción naval antipiratería de fuerzas británicas y estadounidenses contra una flota pirata, sin convertir al Estado Qing ni a la población china en un bando estatal homogéneo.
- Incorpora fuentes institucionales de Naval History and Heritage Command y el U.S. Marine Corps, aliases, bajas aproximadas con cautela y navegación hacia Reino Unido y China.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-04-release-1`.

## v1.6.208 - 2026-09-03

- Normaliza **Batalla de Wild Cat Creek** como **Combate de Wildcat Creek (Spur's Defeat, 22 de noviembre de 1812)**, con fecha, aliases y jerarquia dentro de la **Guerra de 1812**.
- Corrige su clasificacion generica por un combate de frontera colonial, documenta la retirada del destacamento de Hopkins y no atribuye una unidad britanica directa sin fuente.
- Incorpora fuentes de la Guardia Nacional de Kentucky, el U.S. Army Center of Military History, el U.S. Government Publishing Office y la Kentucky Historical Society; mantiene abiertas las bajas, el lugar fino y la composicion exacta de los combatientes indigenas.
- Agrega regresiones de alias, fecha, jerarquia, tipo, procedencia y cautela sobre participantes y resultado.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-03-release-2`.

## v1.6.207 - 2026-09-03

- Normaliza **Batalla de Toldos Viejos** como **Combate de Toldos Viejos (11 de septiembre de 1826)**, con fecha, región, jerarquía de frontera y aliases en español e inglés.
- Reemplaza la clasificación genérica e interestatal por un combate de frontera entre fuerzas provinciales/entrerrianas y redes indígenas y pincheirinas, sin proyectar Estados contemporáneos sobre los bandos de 1826.
- Incorpora trazabilidad desde Argentina.gob.ar, SEDICI-UNLP, FADARA y un estudio histórico digitalizado; deja sin cerrar las bajas, el tamaño total de las fuerzas y la ubicación fina cuando las fuentes no los concilian.
- Agrega regresiones automatizadas de nombre, fecha, jerarquía, tipología, procedencia, aliases y lenguaje histórico cauteloso.
- Sincroniza `fix:conflicts` con la auditoría de datos para que el doctor del producto no publique conteos de curaduría desactualizados.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-03-release-1`.

## v1.6.206 - 2026-09-02

- Normaliza **Batalla de Romanovka** como **Batalla de Romanovka (25 de junio de 1919)**, con jerarquia dentro de la **Guerra civil rusa** y la **Intervencion aliada en Siberia**.
- Corrige su fecha, region, tipologia y navegacion desde Rusia, sin atribuir el combate a la Rusia contemporanea como beligerante.
- Documenta fuentes institucionales estadounidenses, conserva aliases y explica la divergencia entre las series de efectivos y bajas en vez de inventar una cifra cerrada.
- Agrega regresion automatica de aliases, jerarquia, tipologia, procedencia y enlazado territorial.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-11`.

## v1.6.205 - 2026-09-02

- Normaliza **Batalla de Sideling Hill** como **Batalla de Sideling Hill (abril de 1756)**, corrigiendo jerarquia, idioma, tipo y contexto dentro de la **Guerra franco-india (1754-1763)**.
- Conserva las variantes Sideling/Sidling Hill como aliases y deja visible que la fecha diaria, el emplazamiento preciso, los mandos y las bajas siguen siendo materia de fuentes divergentes.
- Agrega fuentes de Library of Congress, Oxford Text Archive, Susquehanna River Basin Commission y Pennsylvania Archives, con regresion para aliases, jerarquia, tipologia y cautela de datos.
- Reduce las jerarquias provisionales de conflictos de 42 a 41 y los conflictos sin fecha del indice de 109 a 108.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-10`.

## v1.6.204 - 2026-09-02

- Normaliza **Batalla de Waddams Grove** como **Combate de Yellow Creek (Waddams Grove, 18 de junio de 1832)**, corrigiendo fecha, lugar, idioma, tipo y jerarquia dentro de la **Guerra de Black Hawk**.
- Conserva Waddams Grove, Yellow Creek y los nombres historicos de James W. Stephenson como aliases, y explica que Waddams Grove es una referencia geografica posterior al combate, no una denominacion contemporanea precisa.
- Agrega trazabilidad desde Illinois Department of Natural Resources, University of Illinois Library y Wisconsin Historical Society; mantiene bajas y resultado tactico como no consolidados cuando los relatos no coinciden.
- Reduce las jerarquias provisionales de conflictos de 43 a 42 y los conflictos sin fecha del indice de 110 a 109, con regresion de aliases, jerarquia, tipologia y desambiguacion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-9`.

## v1.6.203 - 2026-09-02

- Normaliza **Batalla del Convoy de Malta** como **Batalla del convoy de Malta (18 de febrero de 1800)**, corrigiendo fecha, lugar, idioma, tipo, actores y jerarquía dentro de la **Guerra de la Segunda Coalición (1798-1802)**.
- La vincula con el sitio de Malta de 1798-1800 y habilita su navegación desde Francia, Reino Unido y Malta sin confundir el lugar con un beligerante estatal.
- Separa de forma explícita esta acción naval de 1800 de la Operación Pedestal, de los convoyes de Malta de la Segunda Guerra Mundial y de la acción distinta del 31 de marzo de 1800.
- Incorpora fuentes de Heritage Malta y University of Malta; conserva como no consolidadas las bajas, efectivos y composición exacta del convoy cuando los registros no coinciden.
- Reduce las jerarquías provisionales de conflictos de 44 a 43 y los conflictos sin fecha del índice de 111 a 110, con regresión para aliases, países relacionados, jerarquía y desambiguación.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-8`.

## v1.6.202 - 2026-09-02

- Normaliza **Batalla de Rio Grande City** como **Batalla de Río Grande City (27 de diciembre de 1859)**, corrigiendo su fecha, ubicación, idioma, tipo, actores y jerarquía dentro de la **Primera guerra de Cortina (1859-1860)**.
- La separa de la guerra entre México y Estados Unidos de 1846-1848, de La Bolsa de 1860 y de los incidentes fronterizos de la Guerra Civil estadounidense; conserva una categoría organizativa local para las operaciones del bajo Río Grande de diciembre de 1859.
- Incorpora fuentes de University of Texas Rio Grande Valley, Texas Historical Commission, Texas State Historical Association y Texas History for Teachers, con trazabilidad directa de fecha, sitio y participantes.
- Mantiene las bajas como no conciliadas: una fuente registra sesenta bajas cortinistas, mientras que el marcador estatal no ofrece un total comparable, por lo que no se publica un balance cerrado.
- Reduce las jerarquías provisionales de conflictos de 45 a 44 y los conflictos sin fecha del índice de 112 a 111, con regresión para aliases, alcance, guerra padre y desambiguación.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-7`.

## v1.6.201 - 2026-09-02

- Normaliza **batalla de Re'im** como **Batalla por la base de Re'im (7 de octubre de 2023)**, corrigiendo fecha, ubicación, idioma, actores y jerarquía dentro de la **Guerra de Gaza**.
- La ubica dentro de los ataques del 7 de octubre de 2023 en Israel y documenta la toma temporal y posterior recuperación de la sede de la División de Gaza.
- Separa de forma explícita el combate militar de los ataques contra el kibutz Re'im, el festival Nova, los refugios y las rutas cercanas; no agrega al combate cifras civiles de esos otros sitios.
- Incorpora fuentes del Ministerio de Relaciones Exteriores de Israel, The Times of Israel, la Comisión de Investigación de la ONU y Amnesty International, y conserva las bajas como no consolidadas.
- Reduce las jerarquías provisionales de conflictos de 46 a 45 y los conflictos sin fecha del índice de 113 a 112, con regresión de aliases, alcance geográfico y trazabilidad de fuentes.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-6`.

## v1.6.200 - 2026-09-02

- Normaliza **batalla de Kumbo** como **Batalla de Kumbo (10 de abril de 2024)**, corrigiendo fecha, ubicación, idioma, actores y jerarquía dentro de la **Crisis anglófona de Camerún**.
- La vincula con las operaciones de Bui de 2024 como categoría organizativa interna, sin confundirla con la Operación Bui Clean de 2021 ni con otros incidentes de Kumbo.
- Incorpora ficha diferida para Camerún con causas, cronología, participantes, fuentes locales y contexto de International Crisis Group.
- Conserva las discrepancias entre fuentes sobre bajas, daños civiles y resultado táctico; no presenta reclamaciones de autoridades o separatistas como cifras verificadas.
- Reduce las jerarquías provisionales de conflictos de 47 a 46 y los conflictos sin fecha del índice de 114 a 113, con regresión de aliases, jerarquía y cautela de fuentes.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-5`.

## v1.6.199 - 2026-09-02

- Endurece la auditoria de candidatos con jerarquia provisional: una sugerencia de Wikipedia solo puede avanzar si comparte todos los terminos identificadores del titulo, no un unico lugar o palabra comun.
- Muestra las sugerencias insuficientes como `coincidencia_debil` con su pagina de origen para revision humana, en lugar de tratarlas como fichas candidatas validas.
- Agrega regresion para impedir que **Batalla de Pine Creek** vuelva a asociarse automaticamente con la escaramuza distinta de Terre Noire Creek, sin romper aliases que ya fueron aprobados de forma explicita.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-4`.

## v1.6.198 - 2026-09-02

- Normaliza **Batalla de Springfield** como **Segunda batalla de Springfield (Misuri, 8 de enero de 1863)**, corrigiendo fecha, ubicación, tipo, bandos y jerarquía dentro de la Guerra Civil estadounidense.
- La vincula con la **Incursión de Marmaduke en Misuri (1862-1863)**, incorpora aliases de búsqueda y agrega la ficha diferida para Estados Unidos con causas, consecuencias, cronología y participantes históricos.
- Documenta el episodio con los registros oficiales de la Guerra de Secesión, el Departamento de Recursos Naturales de Misuri, Missouri State University y la historia municipal de Springfield.
- Separa expresamente la batalla de la acción distinta de Springfield de 1861, Wilson’s Creek y Springfield, Nueva Jersey, de 1780; conserva la incertidumbre de las bajas en lugar de fijar un total no homologado.
- Reduce las jerarquías provisionales de conflictos de 48 a 47 y los conflictos sin fecha de 115 a 114, con regresión de integridad para aliases, campaña, fuentes y desambiguación.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-3`.

## v1.6.197 - 2026-09-02

- Normaliza **Batalla de jackson** como **Batalla de Jackson (Misisipi, 14 de mayo de 1863)**, corrigiendo mayúsculas, fecha, ubicación, tipo, bandos y jerarquía dentro de la Guerra Civil estadounidense.
- La vincula con la **Campaña de Vicksburg de 1863**, incorpora aliases de búsqueda en español e inglés, y agrega la ficha diferida para Estados Unidos con cronología, causas, consecuencias y participantes históricos.
- Documenta la toma de Jackson con fuentes del National Park Service, el Centro de Historia Militar del Ejército de EE. UU. y la Biblioteca del Congreso.
- Conserva la discrepancia entre los recuentos oficiales de bajas y la etiqueta de fecha de una estampa de época, en lugar de publicar una cifra o fecha secundaria como definitivas.
- Reduce las jerarquías provisionales de conflictos de 49 a 48 y los conflictos sin fecha de 116 a 115, con regresión de integridad para aliases, campaña, fuentes y navegación.
- Estabiliza la prueba crítica de clic 2D: solicita un render, recalcula el punto de selección y reintenta una vez, sin aprobar el flujo si el país no queda realmente seleccionado.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-2`.

## v1.6.196 - 2026-09-02

- Normaliza **Battle of Putziger Wiek** como **Combate naval en Putziger Wiek (23 de agosto de 1870)**, corrigiendo idioma, fecha, lugar, bandos y jerarquia dentro de la Guerra franco-prusiana.
- Vincula el episodio con Francia, Alemania y Polonia, conserva las entidades historicas de los bandos y agrega aliases de busqueda en ingles, espanol y aleman.
- Documenta la salida nocturna de SMS Nymphe ante la escuadra francesa con fuentes de la Bayerische Staatsbibliothek, Darmstadt y Hamburg; conserva la diferencia entre la fecha editorial del informe y la accion de madrugada.
- Evita adjudicar una victoria decisiva o bajas cerradas: las fuentes no concilian todos los buques franceses ni la noticia posterior de dieciocho muertos.
- Reduce las jerarquias provisionales de conflictos de 50 a 49 y los conflictos sin fecha de 117 a 116, con una regresion de integridad y detalle bajo demanda.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-02-release-1`.

## v1.6.195 - 2026-09-01

- Normaliza **Batalla de Nur Shams** como **Batalla de Anabta (Nur Shams, 21 de junio de 1936)**, corrigiendo fecha, lugar, tipo, bandos y jerarquia dentro de la Revuelta arabe en Palestina.
- Conserva los nombres Anabta, Nur Shams y Nur-el-Shems como aliases, y agrega la navegacion geografica desde Cisjordania sin sustituir el Mandato britanico de Palestina ni los bandos historicos.
- Documenta el episodio con un parte contemporaneo, archivo palestino, archivo de la British Library y un estudio academico; mantiene las discrepancias de bajas y separa este combate del tiroteo distinto de Anabta del 15 de abril de 1936.
- Reduce las jerarquias provisionales de conflictos de 51 a 50, agrega una regresion de integridad y genera la ficha diferida e indices de busqueda correspondientes.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-12`.

## v1.6.194 - 2026-09-01

- Normaliza **Battle of the Procida Canal** como **Batalla naval del canal de Procida (26 de junio de 1809)**, corrigiendo idioma, fecha, lugar, bandos y jerarquia dentro de la Guerra de la Quinta Coalicion.
- Vincula la ficha desde Francia, Reino Unido e Italia, separa los estados historicos reales de los paises actuales de navegacion y agrega fuentes navales sobre la expedicion anglo-siciliana.
- Distingue el intento de paso del 26 de junio de las acciones navales vecinas del 25 al 27 de junio de 1809 y de la batalla distinta de 1799, sin mezclar mandos ni bajas.
- Reduce las jerarquias provisionales de conflictos de 52 a 51 y los conflictos sin fecha de 120 a 119, con una regresion de integridad para los aliases y la desambiguacion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-11`.

## v1.6.193 - 2026-09-01

- Consolida **Battle of Westtief** y **Naval battles in the Greifswalder Bodden** como **Combates navales de Westtief y el Greifswalder Bodden (julio-agosto de 1712)**.
- Corrige idioma, fecha, lugar, bandos, guerra y campana; la ficha queda dentro de la Gran Guerra del Norte con fuentes navales danesas y navegacion desde Dinamarca, Suecia y Alemania.
- Mantiene separada la posible accion distinta **Naval battle off Rugen** hasta contar con una curaduria historica independiente, en lugar de fusionar eventos solo por cercania geografica.
- Elimina el duplicado de Westtief/Bodden y reduce las jerarquias provisionales de conflictos de 53 a 52, con prueba de regresion para aliases, fuentes y consolidacion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-10`.

## v1.6.192 - 2026-09-01

- Normaliza **Batalla de Tellicherry** como **Combate naval de Tellicherry (1791)**, corrigiendo idioma, ano, ubicacion y jerarquia dentro de la Tercera guerra anglo-mysore.
- Corrige la clasificacion desde un conflicto regional de Europa hacia la costa de Malabar, con navegacion desde Francia, Reino Unido e India.
- Agrega fuentes navales tempranas y contemporaneas, aliases de busqueda, detalle bajo demanda e indices para el combate.
- Conserva las diferencias de las fuentes sobre el dia de noviembre y las bajas francesas; no trata la sospecha britanica de contrabando como prueba ni a Mysore como beligerante directo.
- Reduce las jerarquias provisionales de conflictos de 54 a 53 y agrega una regresion de integridad para la ficha curada.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-9`.

## v1.6.191 - 2026-09-01

- Normaliza **Battle of Treiden** como **Batalla de Treiden (1628)**, corrigiendo idioma, ano, frente de Livonia, jerarquia dentro de la guerra polaco-sueca de 1626-1629 y tipo de conflicto.
- Vincula la ficha desde Suecia, Polonia y Letonia, conserva los bandos historicos y agrega aliases de Treiden/Turaida para busqueda, detalle bajo demanda e indices.
- Documenta el combate con un estudio de la Universidad de Bialystok, una coleccion de la Biblioteca Nacional de Letonia y la Enciclopedia Nacional de Letonia.
- Conserva la incertidumbre de las fuentes sobre el dia exacto y el mando polaco-lituano; evita convertir estimaciones discutidas de efectivos o bajas en datos cerrados.
- Reduce las jerarquias provisionales de conflictos de 55 a 54 y agrega una regresion de integridad para la ficha curada.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-8`.

## v1.6.190 - 2026-09-01

- Normaliza **Batalla de Remada** como **Batalla de Remada (mayo de 1958)**, corrigiendo fecha, idioma, lugar, contraparte y jerarquia dentro de la crisis franco-tunecina de 1958.
- Vincula la ficha desde Tunez y Francia, conecta los combates de Remada, Bir Amir y Oued Dekouk, y documenta el acuerdo de evacuacion franco-tunecino de junio de 1958.
- Preserva las versiones diplomaticas contrapuestas sobre el origen de los choques y el empleo de la aviacion; evita adjudicar un ganador absoluto, el primer disparo o bajas cerradas sin respaldo neutral.
- Reduce las jerarquias provisionales de conflictos de 56 a 55, agrega detalle bajo demanda, aliases de busqueda, indices y una regresion de integridad.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-7`.

## v1.6.189 - 2026-09-01

- Normaliza **Battle at the Mouth of the Neva** como **Combate naval en la desembocadura del Neva (7/18 de mayo de 1703)**, distinguiendolo de la batalla medieval del Neva de 1240.
- Corrige fecha de doble calendario, idioma, ubicacion, guerra, campana, bandos historicos y navegacion contemporanea desde Rusia y Suecia.
- Documenta la captura de Gedan y Astrild con dos estudios universitarios y una coleccion historica sueca, sin inventar bajas o efectivos donde las fuentes no consolidan una cifra.
- Reduce las jerarquias provisionales de conflictos de 57 a 56, agrega detalle bajo demanda, indices y una regresion que protege la separacion historica.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-6`.

## v1.6.188 - 2026-09-01

- Normaliza **Battle of Pierres Noires** como **Batalla naval de Pierres Noires (5-6 de julio de 1944)**, corrigiendo fecha, idioma, geografía, bandos y jerarquía dentro de la Segunda Guerra Mundial.
- Vincula la ficha desde Canadá, Francia y Alemania, documenta Operation Dredger con fuentes navales canadienses y conserva la diferencia entre el daño a los escoltas y la fuga de los submarinos.
- Evita una falsa victoria decisiva o bajas inventadas, añade aliases, detalle bajo demanda, índices y una regresión que protege la importación profunda.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-5`.

## v1.6.187 - 2026-09-01

- Normaliza **Batalla de Saint-Louis-du-Sud** como **Acción naval de Saint-Louis-du-Sud (marzo de 1748)**, corrigiendo su geografía, contraparte, jerarquía y clasificación colonial dentro de la Guerra de Sucesión Austriaca.
- Separa expresamente este episodio caribeño de la acción distinta de Port Louis de 1799, enlaza la ficha desde Francia, Haití y Reino Unido, y agrega fuentes de patrimonio haitiano y estudios académicos.
- Conserva la discrepancia documental entre el 19 y el 22 de marzo de 1748, evita cifras de bajas, buques y mando francés que no son consistentes, y añade aliases, detalle bajo demanda, índices y regresiones.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-4`.

## v1.6.186 - 2026-09-01

- Normaliza el nombre mixto "Naval Batalla de Saint-Martin-de-Ré" como **Batalla naval de Saint-Martin-de-Ré (26-27 de octubre de 1622)**, corrigiendo fecha, geografía, guerra y el tipo de interestatal a civil.
- Conserva la discrepancia entre "victoria real" y "combate inconcluso", evita cifras de bajas no comparables y distingue la Corona francesa de la comunidad protestante de La Rochelle.
- Agrega fuentes locales de La Rochelle y de historia marítima, aliases, detalle histórico, índice de búsqueda y regresiones.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-3`.

## v1.6.185 - 2026-09-01

- Normaliza la ambigua "Batalla de Port Louis" como **Batalla naval de Port Louis (11 de diciembre de 1799)**, corrigiendo Europa por la bahía de Tombeau, Mauricio, y vinculándola a las Guerras revolucionarias francesas.
- La separa de la acción distinta de Saint-Louis-du-Sud de 1748, añade Reino Unido como referencia navegable y conserva la incertidumbre sobre la secuencia final y las bajas de la fragata Preneuse.
- Agrega fuentes de archivos de Mauricio y Francia, Royal Museums Greenwich, aliases, detalle histórico, índice de búsqueda y regresiones.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-2`.

## v1.6.184 - 2026-09-01

- Normaliza la genérica "Batalla naval de Tatamagouche" como **Acción naval de Tatamagouche (15 de junio de 1745)**, corrigiendo su ubicación desde Europa hacia Nueva Escocia y su jerarquía hacia la Guerra del rey Jorge.
- Conserva a la alianza Mi'kmaq y de las Primeras Naciones con agencia histórica propia, añade Canadá y Estados Unidos solo como referencias de navegación contemporánea y deja explícitas las divergencias sobre mando y bajas.
- Agrega fuentes canadienses, aliases, detalle histórico, índice de búsqueda y regresiones de datos y Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-09-01-release-1`.

## v1.6.183 - 2026-08-31

- Normaliza la generica "Primera batalla de Tamao" como **Primera batalla de Tamão (1521)** y corrige su ubicacion desde Europa al estuario del Rio Perla, China.
- La integra en los choques sino-portugueses de 1521-1522, agrega la referencia de mapa para China actual y separa explicitamente la batalla de 1521 de la fase distinta de 1522.
- Completa fecha aproximada, bandos, lugar, resultado cauteloso, consecuencias, cronologia, aliases, fuentes y regresiones de datos y Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-12`.

## v1.6.182 - 2026-08-31

- Normaliza el generico "Combate de Huite" como **Combate de Huite (2 de marzo de 1866)**, con fecha, guerra, participantes, fuentes institucionales y referencia navegable a Espana.
- Distingue Huite de Huito, mantiene los aliases de Tubildad y evita resolver como hechos cerrados las versiones incompatibles sobre bajas y resultado.
- Agrega regresiones para la ficha, la contraparte y la resolucion de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-11`.

## v1.6.181 - 2026-08-31

- Normaliza la generica "Batalla de Matamoros" como **Accion naval de Matamoros (3 de abril de 1836)**, con jerarquia, lugar, bandos, fecha precisa, aliases y fuentes institucionales.
- Separa el combate entre Invincible y Montezuma de la captura posterior del Pocket, evita afirmar un hundimiento o bajas sin respaldo y agrega la referencia geografica actual de Texas para el mapa.
- Agrega regresiones para la ficha, sus referencias de navegacion y la resolucion de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-10`.

## v1.6.180 - 2026-08-31

- Normaliza "Batalla de Pondicherry" como **Batalla naval de Pondicherry (1759)** y elimina una jerarquia europea generica, sin fecha ni contraparte.
- La integra a la Guerra de los Siete Anos y a las operaciones navales franco-britanicas de la costa de Coromandel, con Reino Unido e India como referencias navegables.
- Separa la accion naval de 1759 del sitio y la rendicion posteriores de Pondicherry, completa participantes, cronologia, fuentes, aliases y limites de resultado y bajas.
- Agrega regresiones para la ficha, sus referencias geograficas, aliases y la resolucion de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-9`.

## v1.6.179 - 2026-08-31

- Normaliza "Batalla del cabo Lizard" como **Batalla naval del cabo Lizard (1707)** y elimina una jerarquia europea generica sin fecha ni contraparte.
- La vincula con la Guerra de Sucesion Espanola, la operacion francesa contra el convoy ingles hacia Portugal y Reino Unido como referencia navegable de la escolta.
- Completa fecha, ubicacion, causa, resultado, consecuencias, cronologia, participantes, aliases y fuentes museisticas; mantiene visibles la fecha erronea de una estampa y los limites de los recuentos de bajas y mercantes.
- Agrega regresiones para la ficha curada, su navegacion bilateral y las resoluciones de Wikipedia en espanol e ingles.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-8`.

## v1.6.178 - 2026-08-31

- Normaliza "Batalla de Yerba Buena" como **Captura de Yerba Buena (1846)** y elimina una clasificacion que la presentaba como batalla convencional.
- La integra a la Guerra mexicano-estadounidense y a la Campana de California de 1846-1847, con Mexico incorporado como contraparte historica navegable.
- Completa fecha, ubicacion, causa, resultado, consecuencias, cronologia, participantes, aliases, fuentes institucionales y el tratado de cierre general.
- Distingue la ocupacion sin combate organizado de una batalla: mantiene el nombre historico para busqueda, pero no inventa bajas ni una victoria tactica convencional.
- Anade pruebas de regresion para aliases, paises, fecha, jerarquia, tipo, participantes, cautela de fuentes y resolucion de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-7`.

## v1.6.177 - 2026-08-31

- Normaliza "Batalla de Vizagapatam" como **Batalla naval de Vizagapatam (1804)** y elimina su jerarquia europea generica.
- La vincula con las Guerras napoleonicas, la escuadra de Linois y referencias navegables de Reino Unido e India.
- Completa fecha, ubicacion, causa, resultado tactico dividido, consecuencias, cronologia, participantes, aliases y fuentes museisticas.
- Hace visible la discrepancia de fecha entre el 15 de septiembre documentado y el 18 grabado en la estampa, identificado como error por Royal Collection Trust.
- Conserva la captura de *Princess Charlotte* y la supervivencia de *Centurion* sin inventar una victoria unilateral ni cifras agregadas de bajas.
- Anade pruebas de regresion para nombre canonico, aliases, paises, fecha, jerarquia, participantes, cautela de fuentes y resolucion de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-6`.

## v1.6.176 - 2026-08-31

- Normaliza "Batalla del Lago Peipus" como **Batalla del lago Peipus (1242)** y elimina su jerarquia europea generica.
- Conecta el combate con las Cruzadas del Norte, la contraofensiva de Pskov y referencias actuales de Rusia y Estonia.
- Retira la asociacion de Dinamarca como beligerante estatal y documenta esa decision de alcance historico.
- Completa fecha, ubicacion, causa, resultado, consecuencias, cronologia, participantes, aliases y fuentes.
- Conserva de forma visible la incertidumbre sobre bajas, escala y el relato tardio del hundimiento masivo bajo el hielo.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-5`.

## v1.6.175 - 2026-08-31

- Consolida las entradas provisionales "Combate del Callao" y "Combate naval del Callao" como **Combate del Callao (1866)**.
- Vincula la ficha con la Guerra hispano-sudamericana, las operaciones de la Escuadra del Pacifico y Espana como participante navegable.
- Completa fecha, ubicacion, causa, consecuencias, cronologia, participantes, aliases y fuentes institucionales peruanas y espanolas.
- Conserva el resultado como discutido, sin inventar una victoria unilateral ni sumar bajas heterogeneas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-4`.

## v1.6.174 - 2026-08-31

- Normaliza la entrada provisional "Batalla de Newry Road" como **Batalla de Newry Road (1993)**, situada al este de Crossmaglen, en South Armagh, Irlanda del Norte.
- Sustituye su jerarquia interestatal europea generica por el **Conflicto de Irlanda del Norte** y por **Operacion Banner: operaciones aereas en South Armagh (1993)** como etiqueta organizativa de GeoRisk.
- Completa fecha, localizacion, causa, resultado, consecuencias, cronologia, participantes y aliases en espanol e ingles, sin crear una asociacion artificial con la Republica de Irlanda.
- Registra la accion como combate aereo-terrestre de insurgencia y mantiene el resultado tactico como no concluyente: conserva los danos informados a aeronaves y la recuperacion de armas, pero no inventa bajas personales ni cifras de fuego.
- Expone la discrepancia entre relatos britanicos y republicanos sobre armas, duracion, volumen de fuego y danos; CAIN queda expresamente como contexto del dia, no como una ficha independiente del incidente.
- Anade trazabilidad con CAIN de Ulster University y estudios de Toby Harnden y Nick van der Bijl, mas una referencia separada a la version republicana usada solo para contraste.
- Anade pruebas de regresion para nombre canonico, alias ingles, fecha, jerarquia, participantes, cautela de fuentes y resolucion determinista de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-3`.

## v1.6.173 - 2026-08-31

- Normaliza la entrada provisional "Batalla de Orford Ness" como **Batalla naval de Orford Ness (1704)**, frente a Suffolk, en el mar del Norte meridional.
- Sustituye la jerarquía europea genérica por el **Incidente naval anglo-sueco de Orford Ness (1704)** y la **Escolta sueca del convoy hacia Europa occidental (1704)** como etiqueta organizativa de GeoRisk.
- Completa causa, resultado, consecuencias, cronología, participantes, región, aliases en español, inglés y sueco, y trazabilidad con Historic England y el Svenskt Biografiskt Lexikon de Riksarkivet.
- Hace visible la cautela histórica: conserva las tres fechas equivalentes según calendarios inglés, sueco y gregoriano, y no atribuye el combate a una guerra mayor cuando Inglaterra y Suecia no estaban en guerra entre sí.
- Conecta la acción con Suecia y Reino Unido para navegación contemporánea, sin crear una entrada padre incompleta ni identificar al Reino Unido con la constitución inglesa de 1704.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 74 a 73 y los conflictos fuera del índice fechable de 141 a 140, con cero incidencias, advertencias e incidencias de idioma.
- Añade pruebas de regresión para nombre canónico, alias sueco, países, fecha, jerarquía, participantes, calendarios, neutralidad bilateral y resolución de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-2`.

## v1.6.172 - 2026-08-31

- Normaliza la entrada provisional "Batalla de Neuville" como **Batalla de Neuville (1760)**, también localizable por el nombre histórico alternativo Pointe-aux-Trembles, en el río San Lorenzo frente a la actual Neuville, Quebec.
- La integra a la **Guerra franco-india (1754-1763)** y al **Socorro naval británico y levantamiento del asedio de Quebec (mayo de 1760)** como etiqueta organizativa de GeoRisk; sustituye la jerarquía europea genérica por un combate naval colonial fechado y localizable.
- Completa causa, resultado, consecuencias, cronología, participantes, región, aliases en español, francés e inglés y trazabilidad a partir de las biografías de Jean Vauquelin y Robert Swanton del Diccionario Biográfico de Canadá.
- Mantiene límites documentales visibles: registra el encallamiento y destrucción posterior de *Atalante*, la captura de Vauquelin y el levantamiento del asedio, pero no fija efectivos ni bajas sin una tabla bilateral homogénea.
- Conecta la ficha con Francia, Reino Unido y Canadá como referencia geográfica actual sin presentar a Canadá como beligerante estatal de 1760; elimina las entradas padre mínimas que habrían dejado tres conflictos sin año.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 75 a 74 y los conflictos fuera del índice fechable de 142 a 141, con cero incidencias, advertencias e incidencias de idioma.
- Añade pruebas de regresión para nombre canónico, aliases, países, exclusión de padres incompletos, fecha, jerarquía, participantes, prudencia sobre cifras y resolución de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-31-release-1`.

## v1.6.171 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Ostróda" como **Batalla de Ostróda (1628)**, fechada el 23 de octubre de 1628 cerca de la actual Ostróda, en el voivodato polaco de Varmia y Masuria.
- La integra a la **Guerra polaco-sueca de 1626-1629** y a las **Operaciones de Prusia de 1628** como etiqueta organizativa de GeoRisk; reemplaza la jerarquía europea genérica y vincula la ficha con Suecia y Polonia.
- Completa causa, resultado, consecuencias, cronología, participantes, región y aliases en español e inglés usando la edición documental *Acta Nuntiaturae Polonae* y la Plataforma Educativa Integrada de Polonia.
- Mantiene la cautela documental: registra la captura verificable de Wulf Heinrich von Baudissin como victoria táctica polaco-lituana, sin fijar efectivos, bajas ni presentar el episodio como decisivo para una guerra que siguió hasta Altmark.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 76 a 75 y los conflictos fuera del índice fechable de 143 a 142, manteniendo cero incidencias de validación e idioma.
- Añade pruebas de regresión para nombre canónico, aliases con y sin diacríticos, fecha, jerarquía, participantes, prudencia sobre cifras y resolución de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-15`.

## v1.6.170 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Mona Passage" como **Batalla del canal de la Mona (1782)**, fechada el 19 de abril de 1782 en el canal entre La Española y Puerto Rico, en el mar Caribe.
- La integra a la **Guerra de Independencia de Estados Unidos** y a la **Persecución británica en el canal de la Mona (1782)**; reemplaza la jerarquía europea genérica por una batalla naval internacional conectada a Francia y Reino Unido.
- Completa causa, resultado, consecuencias, cronología, participantes, región y aliases en español e inglés con apoyo del National Maritime Museum de Greenwich y del U.S. Army Center of Military History.
- Mantiene los límites documentales visibles: registra la captura verificada de *Caton* y *Jason*, pero no fija bajas, efectivos ni un total de presas donde las fuentes revisadas no ofrecen una serie homogénea.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 77 a 76 y los conflictos fuera del índice fechable de 144 a 143, manteniendo cero incidencias de validación e idioma.
- Añade pruebas de regresión para el nombre canónico, aliases, fecha, jerarquía, participantes, prudencia sobre cifras y resolución de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-14`.

## v1.6.169 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Fayetteville" como **Batalla de Fayetteville (Arkansas, 1863)**, fechada el 18 de abril de 1863 en Fayetteville, condado de Washington, Arkansas.
- La integra a la **Guerra Civil estadounidense** y a las **Operaciones de Arkansas noroccidental de 1863** como etiqueta organizativa de GeoRisk; sustituye la jerarquía genérica de América y la clasificación interestatal por un combate civil localizable.
- Completa causa, resultado, consecuencias, cronología, participantes, región, aliases en español e inglés y fuentes a partir de los partes reunidos en los *Official Records*, Encyclopedia of Arkansas y el registro histórico de Headquarters House.
- Mantiene la incertidumbre visible: no fija bajas donde las síntesis difieren y distingue la retirada confederada del 18 de abril del abandono federal posterior, sin presentar esa secuencia como una victoria estratégica inequívoca.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 78 a 77 y los conflictos fuera del índice fechable de 145 a 144, manteniendo cero incidencias de validación e idioma.
- Añade pruebas de regresión para nombre canónico, aliases, fecha, jerarquía, fuentes, participantes, límites interpretativos y resolución de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-13`.

## v1.6.168 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Little Dry Creek" como **Combate de Little Dry Creek (1885)**, fechado el 19 de diciembre cerca de Pleasanton y del rancho Siggins, en el actual suroeste de Nuevo Mexico.
- La integra a las **Guerras apaches** y a la **Campana de Geronimo de 1885-1886**; sustituye la jerarquia generica de America y la clasificacion interestatal por un combate de frontera navegable.
- Completa causa, resultado, consecuencias, cronologia, participantes, region, fuentes y aliases en espanol e ingles, usando el informe contemporaneo de Samuel W. Fountain conservado por Fort Huachuca, el Informe Anual del Secretario de Guerra de 1886 y el contexto del Servicio de Parques Nacionales.
- Conserva limites documentales visibles: el parte de Fountain describe la perspectiva de la columna estadounidense; no fija un total de bajas, una fuerza apache, una identidad de mando ni una victoria absoluta donde las fuentes posteriores discrepan.
- Regenera ficha diferida, busqueda, indices y timeline; reduce las jerarquias provisionales de 79 a 78, reduce los conflictos fuera del indice fechable de 146 a 145 y mantiene cero incidencias de validacion, idioma y estructura.
- Agrega pruebas de regresion para nombre canonico, aliases, fecha, jerarquia, fuentes, participantes, disputa documental y resolucion de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-12`.

## v1.6.167 - 2026-08-30

- Normaliza la entrada provisional "Primera batalla de Dragoon Springs" como **Primera batalla de Dragoon Springs (1862)**, fechada el 5 de mayo en las montanas Dragoon, actual condado de Cochise, Arizona.
- Sustituye la jerarquia generica de America y la clasificacion interestatal por un **combate de frontera** dentro de las **Guerras apaches**; conserva la Guerra Civil estadounidense como contexto relacionado, sin presentar a los pueblos apaches como una faccion subordinada de la guerra entre Union y Confederacion.
- Completa causa, desenlace, consecuencias, cronologia, participantes, region, aliases en espanol e ingles y fuentes. Distingue la primera accion de la respuesta del 9 de mayo y no fusiona ambos episodios.
- Hace visible la incertidumbre documental: no fija efectivos, bajas, ganado, liderazgo apache ni una victoria absoluta donde las fuentes difieren; registra tambien la controversia sobre una supuesta retirada confederada de Tucson y la superposicion con tumbas anteriores de la ruta postal.
- Regenera ficha diferida, busqueda, indices y timeline; reduce las jerarquias provisionales de 80 a 79 y mantiene cero incidencias de validacion, alertas de idioma y alertas estructurales.
- Agrega pruebas de regresion para el nombre canonico, aliases, fecha, jerarquia, fuentes, participantes, limites de interpretacion y resolucion de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-11`.

## v1.6.166 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Île Ronde" como **Batalla naval de Île Ronde (1794)**, fechada el 22 de octubre frente a Île de France, actual Mauricio, dentro de las operaciones navales del océano Índico.
- Crea la ficha navegable **Guerras revolucionarias francesas (1792-1802)** y conecta la batalla con esa guerra, su campaña índica, Francia y Reino Unido; reemplaza la jerarquía europea genérica y la clasificación local incompleta.
- Completa causa, resultado, consecuencias, cronología, participantes, región y trazabilidad con Royal Collection Trust, la historia naval de William James y un repertorio cronológico especializado de batallas navales.
- Conserva la incertidumbre histórica: el resultado se expresa como tácticamente no concluyente con alivio operativo francés del bloqueo; no fija totales de bajas ni un orden de batalla definitivo donde las síntesis difieren.
- Unifica las referencias heredadas de "Guerras revolucionarias francesas" bajo el nombre periodizado en fichas, `parent`, `war`, campañas, relaciones y aliases de búsqueda; evita que el mismo ciclo histórico se abra por dos rutas distintas.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 81 a 80, reduce los conflictos indexados duplicados de 1.853 a 1.852 y mantiene cero alertas estructurales.
- Añade pruebas de regresión para nombre canónico, aliases con y sin acento, fecha, jerarquía, fuentes, bandos, discrepancias de fuentes, unificación de referencias y búsqueda del nombre inglés.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-10`.

## v1.6.165 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Florida Mountains" como **Combate de las montañas Florida (1861)**, fechada en agosto de 1861 y ubicada en las actuales montañas Florida del condado de Luna, Nuevo México.
- La integra a las **Guerras apaches** y a las **Operaciones de Cooke's Canyon de 1861**; reemplaza la jerarquía genérica de América y la clasificación interestatal errónea por un combate de frontera navegable.
- Completa causa, resultado, consecuencias, cronología, participantes, región y fuentes a partir de la monografía de la Oficina de Administración de Tierras de EE. UU., el contexto territorial de CNM y el Servicio de Parques Nacionales de EE. UU.
- Mantiene la incertidumbre histórica: no inventa día, mandos apache ni bajas; la cifra de ocho muertes queda atribuida explícitamente al reclamo de Smith, no como un recuento independiente ni como victoria decisiva.
- Corrige una migración de ficha diferida: conserva el alias ASCII previo y fusiona automáticamente la variante sin `ñ` con el nombre visible, evitando duplicados de detalle e índices inconsistentes.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 82 a 81, conserva cero alertas estructurales y añade pruebas de regresión para aliases heredados, Unicode visible, fecha mensual, jerarquía, fuentes, bandos y cautela sobre bajas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-9`.

## v1.6.164 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Mimbres River" como **Ataque del rio Mimbres (1860)**, con fecha del 4 de diciembre de 1860 y ubicacion en la ribera occidental del rio Mimbres, en el actual suroeste de Nuevo Mexico.
- La integra a las **Guerras apaches** y a la categoria organizativa **Conflictos mineros y de frontera en el Mimbres (1860)**; reemplaza la jerarquia generica de America y la clasificacion interestatal erronea por una lectura de ataque de frontera.
- Completa causa, resultado, consecuencias, cronologia, participantes, trazabilidad y procedencia usando una publicacion de la New Mexico Geological Society y el contexto del Servicio de Parques Nacionales de EE. UU.
- Hace visible la incertidumbre: no fija bajas, capturas, liderazgos ni denominaciones de grupo donde la bibliografia secundaria discrepa, y no presenta a los mimbrenos como un Estado o ejercito homogeneo.
- Corrige la resolucion de Wikipedia para mantener el alias historico en `Battle_of_the_Mimbres_River` y evitar dependencias de red ambiguas durante auditorias.
- Regenera ficha diferida, busqueda, indices y timeline; reduce las jerarquias provisionales de 83 a 82, conserva cero alertas estructurales y agrega pruebas de regresion para aliases, fecha, jerarquia, fuentes, bandos y cautela historica.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-8`.

## v1.6.163 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Mount Gray" como **Batalla de Mount Gray (1864)**, fechada el 7 de abril y situada en Mount Gray o Sierra Bonita, cerca del actual condado de Hidalgo, Nuevo México.
- La incorpora a las **Guerras apaches** y a las **Operaciones de la Columna de California en el suroeste de 1864**; reemplaza la jerarquía genérica de América y la clasificación interestatal errónea por una lectura de conflicto de frontera.
- Revisa la ficha padre **Guerras apaches (1849-1924)** con cronología, fuentes, participantes y una explicación explícita de que es una etiqueta paraguas para conflictos heterogéneos, no una guerra estatal única.
- Corrige el resolvedor de Wikipedia: la búsqueda de Mount Gray ya no puede confundirse con Mount Longdon y se fija de forma determinista en `Battle_of_Mount_Gray`.
- Conserva la asimetría documental: atribuye los datos tácticos al parte federal de James H. Whitlock, no fija una cifra apache definitiva y evita convertir identidades históricas apache en un Estado moderno.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 84 a 83, mantiene cero alertas estructurales y añade pruebas de regresión para aliases, fecha, jerarquía, fuentes, participantes y resolución de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-7`.

## v1.6.162 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Mani-Mani" como **Batalla de Mani-Mani (1898)**, fechada el 23 de julio en la desembocadura del río Mani-Mani, al oeste de Bahía Honda, Pinar del Río.
- Revisa y completa la **Guerra hispano-estadounidense**: reemplaza una ficha genérica por una explicación del conflicto declarado entre Estados Unidos y España, sus dimensiones cubanas y filipinas, el protocolo de paz de agosto y el Tratado de París de diciembre.
- Enlaza el combate y su guerra padre desde Estados Unidos, España y Cuba. La ficha deja claro que el enlace cubano representa territorio y fuerzas independentistas de 1898, no una equivalencia entre la República posterior y un Estado firmante del tratado.
- Completa causa, resultado, consecuencias, cronología, participantes, fuentes y procedencia con el Departamento de Estado de EE. UU., la Biblioteca del Congreso, la Congressional Medal of Honor Society y un archivo histórico cubano; evita cifras cerradas para fuerza y bajas locales donde las fuentes no son homogéneas.
- Conserva la incertidumbre sobre la toponimia Mani-Mani/Manimani, el alcance del desembarco y la composición de la expedición; registra la valoración de victoria española solo como resultado táctico local.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 85 a 84 y los conflictos fuera del índice fechable de 152 a 151, manteniendo cero alertas estructurales, con 1.848 conflictos, 3.132 eventos y 1.097 fichas diferidas.
- Añade pruebas de regresión para aliases, fecha, guerra padre, campaña, enlaces de país, participantes, acentos visibles, fuentes y cautela sobre resultados y bajas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-6`.

## v1.6.161 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Little Mountain" como **Batalla de Cedar Mountain (1862)**, ocurrida el 9 de agosto en el condado de Culpeper, Virginia, dentro de la **Campaña de Virginia del Norte de 1862**.
- Crea la ficha navegable de la **Guerra Civil estadounidense (1861-1865)**, que ya era padre de numerosas batallas del dataset pero no existía como conflicto propio, y enlaza ambas fichas a Estados Unidos sin presentar a los Estados Confederados como un Estado contemporáneo.
- Completa causa, resultado, consecuencias, cronología, bandos, región y trazabilidad mediante el Servicio de Parques Nacionales, la Biblioteca del Congreso, el Centro de Historia Militar del Ejército de EE. UU. y American Battlefield Trust.
- Conserva la incertidumbre donde corresponde: Cedar Mountain tiene alias históricos y estimaciones de efectivos y bajas divergentes; la ficha no fija totales sin una serie homogénea ni presenta la batalla como explicación única de la campaña.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 86 a 85 y los conflictos fuera del índice fechable de 153 a 152, manteniendo cero alertas estructurales, con 1.847 conflictos, 3.127 eventos y 1.095 fichas diferidas.
- Añade pruebas de regresión para el alias importado, el padre histórico, periodo, campaña, fecha, bandos, fuentes y cautela sobre los cierres y las bajas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-5`.

## v1.6.160 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Kamani" como **Batalla de Kamani (1993)** y la ubica en julio de 1993, dentro de las **Ofensivas abjasias sobre Sujumi de 1993** y de la **Guerra de Abjasia**.
- Completa la ficha local con ubicación, bandos, causa, resultado, consecuencias, cronología, fuentes y referencias de navegación, sin fijar un día ni bajas totales cuando las fuentes verificables no permiten una reconstrucción homogénea.
- Revisa la **Guerra de Abjasia**: sustituye la clasificación interestatal genérica y las regiones contradictorias por una descripción secesionista y civil, con cronología desde agosto de 1992 hasta la ofensiva de septiembre de 1993, el alto el fuego de Sochi y una distinción explícita entre los bandos principales y el papel complejo de actores externos.
- Añade trazabilidad de Naciones Unidas, Human Rights Watch y una investigación académica de la Universidad de Maryland; mantiene una nota visible sobre el estatus disputado de Abjasia, atribución de responsabilidades y límites de las cifras.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 87 a 86 y los conflictos fuera del índice fechable de 154 a 153, manteniendo cero alertas estructurales, con 1.845 conflictos, 3.125 eventos y 1.093 fichas diferidas.
- Agrega pruebas de regresión para alias, periodo, clasificación, campaña, fecha mensual, participantes, fuentes, resultado y cautela sobre bajas y responsabilidades.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-4`.

## v1.6.159 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Hrebionka" como **Carga de Hrebionka (1920)**, fechada el 9 de julio durante la ofensiva soviética de julio de 1920.
- Crea la jerarquía navegable **Guerra polaco-soviética (1919-1921)**, con la distinción entre las operaciones principales de 1920, el armisticio y el Tratado de Riga de marzo de 1921.
- Vincula Polonia y Rusia por las fuerzas históricas de 1920, y Bielorrusia únicamente como ubicación contemporánea de Hrebionka; no presenta a los Estados actuales como entidades intercambiables con los beligerantes de la época.
- Completa causa, resultado, consecuencias, cronología, participantes, campaña y fuentes de la Biblioteca Militar Central de Polonia, Polska Zbrojna, el Instituto de la Memoria Nacional y la International Encyclopedia of the First World War.
- Conserva una nota de discrepancia: algunas bases secundarias indican otra fecha o repiten partes regimentalistas, por lo que no fija bajas ni convierte una carga táctica en la destrucción confirmada de regimientos completos.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 88 a 87 y los conflictos fuera del índice fechable de 155 a 154, manteniendo cero alertas estructurales, con 1.844 conflictos, 3.124 eventos y 1.091 fichas diferidas.
- Agrega pruebas de regresión para aliases, periodo de la guerra, Tratado de Riga, campaña, fecha, países enlazados, participantes, fuentes y cautela sobre las cifras.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-3`.

## v1.6.158 - 2026-08-30

- Normaliza la entrada provisional "Batalla de Rakvere" como **Batalla de Rakvere (1603)**, fechada el 5 de marzo dentro de la Guerra polaco-sueca de 1600-1611 y de la Campaña de Livonia de 1603.
- Distingue explícitamente esta acción de la batalla medieval homónima de 1268, evita aliases de Wesenberg sin año y conserva la cautela sobre efectivos, bajas y la fecha exacta de la capitulación de Dorpat.
- Vincula Suecia por la fuerza participante, Polonia como referencia contemporánea de la Mancomunidad Polaco-Lituana y Estonia por la ubicación actual de Rakvere, sin tratarlos como entidades históricas intercambiables.
- Completa causas, resultado, consecuencias, cronología, participantes, campaña, región, fuentes y procedencia con trazabilidad de la Universidad Jaguelónica, la Universidad de Tartu, la Biblioteca Militar Central de Polonia y ERR.
- Regenera ficha diferida, búsqueda, índices y timeline; reduce las jerarquías provisionales de 89 a 88 y mantiene cero alertas estructurales, con 1.842 conflictos, 3.119 eventos y 1.089 fichas diferidas.
- Agrega una prueba de regresión para aliases fechados, fecha, jerarquía, países enlazados, participantes, fuentes y el control del homónimo, junto con una resolución local de Wikipedia para evitar una dependencia de red durante la auditoría.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-2`.

## v1.6.157 - 2026-08-30

- Completa **Guerra contra Segismundo (1598-1599)** como conflicto dinastico y civil, con causas, participantes, cronologia, consecuencias, fuentes y una distincion clara entre el conflicto de 1598-1599 y las rivalidades polaco-suecas posteriores.
- Normaliza la entrada provisional "Batalla de Stegeborg" como **Batalla de Stegeborg (1598)**, dentro de la campana de Segismundo en Suecia, y corrige su jerarquia europea generica.
- Vincula Suecia y Polonia como referencias contemporaneas de navegacion por las fuerzas y la union dinastica historicas, sin tratarlas como Estados beligerantes intercambiables con las entidades de 1598.
- Conserva la fecha como 8 de septiembre juliano y 18 de septiembre gregoriano, registra la victoria tactica de Segismundo y su posterior reverso en Stangebro, y no inventa bajas ni presenta el resultado inicial como decisivo.
- Incorpora fuentes de los municipios suecos de Soderkoping y Linkoping, el Archivo Nacional de Suecia y una digitalizacion historica de Proyecto Runeberg.
- Regenera ficha diferida, busqueda, indices y timeline, reduce las jerarquias provisionales de 90 a 89 y mantiene cero alertas estructurales, con 1.841 conflictos, 3.116 eventos y 1.088 fichas diferidas.
- Agrega pruebas de regresion para la guerra, aliases, calendario, participantes y fuentes, y una resolucion local de Wikipedia para evitar dependencias de red durante la auditoria.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-30-release-1`.

## v1.6.156 - 2026-08-29

- Normaliza la entrada provisional "Batalla de las Marismas" como **Batalla de las marismas (1984)**, situada en las marismas de Hawizeh y las islas Majnoon durante la Guerra entre Iran e Irak.
- La conecta con Iran e Irak, incorpora la Operacion Kheibar como campana de ordenamiento y completa fecha, participantes, cronologia, region y fuentes sin presentar a un pais contemporaneo como actor adicional.
- Registra un resultado operacional mixto: las fuentes coinciden en una ganancia iraniana limitada en Majnoon y en que las lineas estrategicas iraquies no fueron quebradas; no fija un vencedor absoluto ni suma bajas incompatibles.
- Incorpora trazabilidad de la Biblioteca del Congreso de Estados Unidos, un informe de la Biblioteca Presidencial Ronald Reagan y una tesis de la Universidad de Pittsburgh.
- Regenera ficha diferida, busqueda, indices y timeline, reduce las jerarquias provisionales de 91 a 90 y mantiene cero alertas estructurales, con 1.840 conflictos, 3.113 eventos y 1.086 fichas diferidas.
- Agrega una prueba de regresion para aliases, jerarquia, fuente y cautela de resultados, y hace determinista la resolucion local de Wikipedia para evitar esperas externas en la auditoria.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-29-release-6`.

## v1.6.155 - 2026-08-29

- Normaliza la entrada provisional "Batalla de la Montana Roja" como **Batalla de Pulang Lupa (1900)**, ocurrida el 13 de septiembre en Torrijos, Marinduque, durante la Guerra filipino-estadounidense.
- Añade la campaña editorial **Operaciones de Marinduque (1900)**, vincula Filipinas y Estados Unidos por las fuerzas participantes, e incorpora a Maximo Abad y Devereux Shields sin transformar la ubicacion contemporanea en un beligerante adicional.
- Registra la victoria local filipina, su continuidad hasta la rendicion de abril de 1901 y fuentes trazables del National Historical Commission of the Philippines, el Gobierno Provincial de Marinduque y Republic Act No. 6702; no inventa un total bilateral de bajas donde las fuentes no lo consolidan.
- Regenera ficha diferida, busqueda, indices y timeline, reduce las jerarquias provisionales de 92 a 91 y mantiene cero alertas estructurales, con 1.839 conflictos, 3.111 eventos y 1.085 fichas diferidas.
- Agrega una prueba de regresion para aliases, fecha, jerarquia, participantes, paises enlazados y fuente, y hace determinista la resolucion local hacia la pagina historica correspondiente de Wikipedia.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-29-release-5`.

## v1.6.154 - 2026-08-29

- Normaliza la entrada provisional "Batalla de Imbros" como **Batalla naval de Imbros (1918)**, fechada el 20 de enero dentro de la Primera Guerra Mundial y de las operaciones navales en los Dardanelos y el Egeo.
- Corrige su asociacion nacional: retira Grecia, que se habia inferido por el toponimo, y vincula Turquia como ubicacion contemporanea y Reino Unido por la fuerza naval britanica, sin convertir los antiguos nombres alemanes de los buques en un enlace nacional automatico.
- Incorpora participantes, cronologia, consecuencias y fuentes trazables del Australian War Memorial, la Universidad Jaguelonica y Belleten; conserva la incertidumbre sobre la secuencia fina de impactos, minas y bajas humanas.
- Regenera ficha diferida, busqueda, indices y timeline, reduce las jerarquias provisionales de 93 a 92 y mantiene cero alertas estructurales, con 1.838 conflictos, 3.109 eventos y 1.084 fichas diferidas.
- Agrega una prueba de regresion para aliases, fecha, jerarquia, participantes, enlaces de pais y etiquetas de fuentes en espanol.
- Hace determinista la comprobacion de la Batalla de Guerrero (1916) mediante su alias local de Wikipedia, evitando que un timeout externo vuelva inestable la puerta de release.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-29-release-4`.

## v1.6.153 - 2026-08-29

- Normaliza la entrada provisional "Batalla de Kaipiais" como **Batalla de Kaipiais (1789)**, situada el 15 de julio dentro de la Guerra ruso-sueca y de las operaciones terrestres en Finlandia.
- Vincula Suecia y Rusia por las fuerzas históricas de Lars Fredrik von Kaulbars y Fedor Denisov, y Finlandia exclusivamente como ubicación contemporánea, sin inventar bajas ni cifras de efectivos.
- Corrige la entrada provisional "Batalla de la Boca del Tigre", que estaba sin fecha, situada en Europa y vinculada solo a Portugal, como **Combates navales de la Boca del Tigre (1809-1810)**.
- La convierte en una serie naval antipiratería trazable en el delta del río de las Perlas, enlazada a China y Portugal, con Macao, la Flota de la Bandera Roja, Zhang Baozai y José Pinto Alcoforado como actores históricos contextualizados.
- Añade cronología, acuerdo de guardia costera de 1809, participantes, fuentes de Macao, archivo portugués y relato primario digitalizado, sin consolidar cifras de flotas, armamento o bajas que las fuentes no permiten reconciliar.
- Reduce las jerarquías provisionales de 95 a 93 y mantiene cero alertas estructurales, con 1.837 conflictos, 3.107 eventos y 1.083 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-29-release-3`.

## v1.6.152 - 2026-08-29

- Corrige la asociación publicada de la entrada genérica "Batalla de Lagos": la ficha de 1693 se reemplaza por **Batalla naval de Lagos (1759)**, que es la identidad resuelta por el título español y respaldada por Royal Museums Greenwich.
- La sitúa entre el 18 y el 19 de agosto de 1759 dentro de la Guerra de los Siete Años, con la escuadra británica de Edward Boscawen y la francesa de Jean-François de La Clue-Sabran.
- Registra cinco navíos franceses capturados o incendiados sin inventar bajas humanas ni convertir la cronología de dos días en dos batallas distintas.
- Vincula Francia y Reino Unido por sus fuerzas históricas, y España y Portugal solamente como referencias geográficas contemporáneas.
- Elimina la ficha, índices y enlaces derivados de la asociación incorrecta de 1693, y añade una prueba de regresión que protege la identidad corregida.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-29-release-2`.

## v1.6.151 - 2026-08-29

- Normaliza la entrada provisional "Batalla de Lagos" como **Batalla naval de Lagos (1693)**, con aliases fechados, ficha diferida, búsqueda, índices y timeline regenerados.
- La sitúa el 27 de junio de 1693 frente al Algarve dentro de la Guerra de los Nueve Años y de las operaciones contra el convoy de Esmirna.
- Distingue la batalla de 1693 de la acción naval de Lagos de 1759, vincula Francia, Reino Unido y Países Bajos por sus fuerzas históricas y deja a Portugal como ubicación contemporánea, no como beligerante.
- Conserva la victoria operativa francesa y las pérdidas de aproximadamente 90 mercantes, 40 de ellos capturados, sin convertir esos datos navales en bajas humanas ni fijar un orden de batalla no respaldado.
- Incorpora trazabilidad de Royal Museums Greenwich y de la Agencia del Patrimonio Cultural de los Países Bajos, con prueba de regresión para nombre, fecha, jerarquía, participantes y cautela de fuentes.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-29-release-1`.

## v1.6.150 - 2026-08-28

- Normaliza la entrada provisional "Batalla de Fundy Bay" como **Combate naval de la bahía de Fundy (1696)**, con aliases en español, inglés y francés, ficha diferida, búsqueda, índices y timeline regenerados.
- La sitúa el 14 de julio de 1696 cerca de la desembocadura del río Saint John, dentro de la Guerra de los Nueve Años y de las operaciones franco-inglesas en Acadia y Pemaquid.
- Distingue a Nueva Francia, las fuerzas francesas de Acadia y los guerreros mi'kmaq de los buques ingleses que bloqueaban la zona; no transforma a Canadá actual en un beligerante.
- Registra la captura de la fragata inglesa Newport y la retirada de otros dos buques, sin fijar efectivos, duración o bajas que las fuentes no sostienen de forma bilateral.
- Incorpora trazabilidad del Archivo de Nueva Escocia y del Diccionario Biográfico de Canadá, con una prueba de regresión para nombre, fecha, jerarquía, participantes y discrepancia cronológica.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-17`.

## v1.6.149 - 2026-08-28

- Normaliza la entrada provisional "Batalla de Mahé" como **Combate naval de Mahé (1801)**, con aliases en español, inglés y francés, ficha diferida, búsqueda, índices y timeline regenerados.
- La sitúa el 19 de agosto de 1801 en la rada de Mahé, Seychelles, dentro de las Guerras revolucionarias francesas y de las operaciones navales anglo-francesas del océano Índico.
- Identifica a HMS Sybille de Charles Adam y a la fragata francesa Chiffonne, y presenta la captura británica como resultado táctico sin convertir relatos posteriores en un orden de batalla cerrado.
- Conserva la relación contemporánea de bajas de Sybille como evidencia atribuida, pero no fija duración, efectivos ni totales de pérdidas porque no existe una serie equivalente y completa para ambos bandos en las fuentes consultadas.
- Vincula Francia y Reino Unido por las fuerzas históricas y deja a Seychelles como ubicación contemporánea, sin convertirla artificialmente en beligerante ni forzar un enlace nacional inexistente.
- Incorpora trazabilidad de Royal Museums Greenwich y la Dunfermline Historical Society, junto con una prueba de regresión para nombre, fecha, jerarquía, participantes y cautela de fuentes.
- Reduce las jerarquías provisionales de 98 a 97 y mantiene cero alertas estructurales, con 1.833 conflictos, 3.095 eventos y 1.079 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-16`.

## v1.6.148 - 2026-08-28

- Normaliza la entrada provisional "Battle of Kirchschlag" como **Combate de Kirchschlag (1921)**, con alias en español, alemán e inglés, ficha diferida, búsqueda, índices y timeline regenerados.
- La sitúa el 5 de septiembre de 1921 dentro del Levantamiento de Hungría occidental y de las operaciones fronterizas de agosto-septiembre, con una jerarquía compartida y verificable junto a otros episodios de la crisis.
- Distingue la defensa austríaca de Kirchschlag de una victoria estratégica total: identifica Bundesheer, Gendarmería y grupos irregulares húngaros, sin inventar efectivos ni un balance definitivo de bajas.
- Conserva como dato atribuido el mínimo de siete muertos húngaros que registra una reconstrucción militar, y deja visible que las fuentes consultadas tienen una procedencia institucional predominantemente austríaca.
- Vincula Austria y Hungría por las fuerzas históricas que participaron, sin confundir la situación fronteriza de 1921 con fronteras o actores estatales posteriores.
- Incorpora trazabilidad de la Academia Militar Austriaca, ORF, el Ministerio del Interior y Truppendienst, y añade una prueba de regresión para nombre, fecha, jerarquía, participantes y cautela de fuentes.
- Reduce las jerarquías provisionales de 99 a 98 y mantiene cero alertas estructurales, con 1.832 conflictos, 3.093 eventos y 1.078 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-15`.

## v1.6.147 - 2026-08-28

- Normaliza la entrada provisional "Battle of Jupiter Inlet" como **Primera batalla de Loxahatchee (1838)**, con aliases históricos, ficha diferida, búsqueda, índices y timeline regenerados.
- La sitúa el 15 de enero de 1838 dentro de la Segunda Guerra Seminola y de las operaciones de Loxahatchee, separándola de la batalla de Jesup del 24 de enero.
- Explica el contexto de expulsión forzada en Florida, identifica la expedición estadounidense y las fuerzas seminolas y miccosukee sin convertir a estos pueblos en países actuales.
- Conserva "Jupiter Inlet" como denominación histórica de búsqueda, pero usa el nombre de preservación actual; deja visibles las diferencias de nomenclatura, composición de la fuerza y cifras para no inventar bajas.
- Incorpora trazabilidad del informe de Registro Nacional del Condado de Palm Beach, la Biblioteca del Congreso y el Servicio de Parques Nacionales de EE. UU.
- Reduce las jerarquías provisionales de 100 a 99 y mantiene cero alertas estructurales, con 1.831 conflictos, 3.091 eventos y 1.077 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-14`.

## v1.6.146 - 2026-08-28

- Normaliza la entrada provisional "Battle of Gyanafalva" como **Combates de Gyanafalva (1921)**, con alias en espa\u00f1ol e ingl\u00e9s, ficha diferida, b\u00fasqueda, \u00edndices y timeline regenerados.
- La sit\u00faa dentro del Levantamiento de Hungr\u00eda occidental de 1921 y de las operaciones fronterizas de agosto-septiembre, reemplazando la clasificaci\u00f3n incorrecta como batalla interestatal convencional.
- Distingue una ventaja t\u00e1ctica local de los grupos irregulares h\u00fangaros de una victoria estrat\u00e9gica: conserva una ventana de fechas porque la prensa contempor\u00e1nea y la reconstrucci\u00f3n retrospectiva no coinciden en el d\u00eda exacto.
- Vincula Austria y Hungr\u00eda, identifica gendarmer\u00eda, Volkswehr y fuerzas irregulares sin tratarlas como ej\u00e9rcitos regulares homog\u00e9neos, y no inventa bajas ni una delimitaci\u00f3n artificial frente a incidentes vecinos.
- Incorpora trazabilidad del Archivo Nacional de Hungr\u00eda, la hemeroteca EPA de la Biblioteca Nacional Sz\u00e9ch\u00e9nyi y una reconstrucci\u00f3n digitalizada, dejando expl\u00edcitos sus l\u00edmites y sesgos de procedencia.
- Reduce las jerarqu\u00edas provisionales de 101 a 100 y mantiene cero alertas estructurales, con 1.830 conflictos, 3.090 eventos y 1.076 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-13`.

## v1.6.145 - 2026-08-28

- Normaliza la entrada provisional "Battle of the \u00celes Saint-Marcouf" como **Batalla de las islas Saint-Marcouf (1798)**, con aliases en espa\u00f1ol, ingl\u00e9s y franc\u00e9s, ficha diferida, b\u00fasqueda, \u00edndices y timeline regenerados.
- La sit\u00faa el 7 de mayo de 1798 dentro de las Guerras revolucionarias francesas y de las operaciones navales anglo-francesas del canal de la Mancha, reemplazando la jerarqu\u00eda europea gen\u00e9rica.
- Registra la defensa brit\u00e1nica de la guarnici\u00f3n de Charles Price frente a una flotilla francesa de desembarco, sin fijar un orden de batalla, n\u00famero de embarcaciones o total de bajas cuando los relatos impresos divergen.
- Vincula Francia y Reino Unido por sus fuerzas hist\u00f3ricas, respeta la denominaci\u00f3n Reino de Gran Breta\u00f1a para 1798 y evita confundir esta acci\u00f3n con los enfrentamientos navales posteriores del mismo mes.
- Incorpora trazabilidad de Royal Museums Greenwich, FranceArchives y la Historia naval de Gran Breta\u00f1a de William James, con una nota expl\u00edcita sobre los l\u00edmites de las cifras disponibles.
- Reduce las jerarqu\u00edas provisionales de 102 a 101 y mantiene cero alertas estructurales, con 1.829 conflictos, 3.088 eventos y 1.075 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-12`.

## v1.6.144 - 2026-08-28

- Normaliza la entrada provisional "Battle of V\u00edzakna" como **Batalla de V\u00edzakna (1849)**, con aliases en espa\u00f1ol e ingl\u00e9s, ficha diferida, b\u00fasqueda, \u00edndices y timeline regenerados.
- La sit\u00faa el 4 de febrero de 1849 dentro de la Revoluci\u00f3n h\u00fangara de 1848-1849 y de la Campa\u00f1a de Transilvania, con una jerarqu\u00eda verificable y sin la etiqueta regional gen\u00e9rica anterior.
- Registra la victoria imperial de Anton Puchner sobre las fuerzas de J\u00f3zef Bem, las bajas atribuidas por fuentes institucionales y la p\u00e9rdida de artiller\u00eda, sin convertir las estimaciones en una cifra definitiva universal.
- Vincula Hungr\u00eda y Austria por los ej\u00e9rcitos hist\u00f3ricos; Rumania se a\u00f1ade como ubicaci\u00f3n contempor\u00e1nea y referencia de milicias transilvanas, no como Estado beligerante. Rusia y Polonia no se infieren como combatientes.
- Incorpora trazabilidad del Instituto de Investigaci\u00f3n H\u00fangara, del Instituto y Museo de Historia Militar de Hungr\u00eda y de la Biblioteca Electr\u00f3nica H\u00fangara, dejando visible la cautela sobre el apoyo ruso indirecto.
- Reduce las jerarqu\u00edas provisionales de 103 a 102 y mantiene cero alertas estructurales, con 1.828 conflictos, 3.086 eventos y 1.074 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-11`.

## v1.6.143 - 2026-08-28

- Normaliza la entrada provisional "Batalla de Lissa" como **Batalla naval de Lissa (1811)**, con aliases en español, inglés, francés y croata, ficha diferida, índices, búsqueda y timeline regenerados.
- La sitúa el 13 de marzo de 1811 frente a Lissa o Vis, en la Campaña del Adriático de las Guerras napoleónicas, y evita confundirla con la batalla de 1866.
- Registra la victoria británica, la destrucción de Favorite y la captura de Bellona y Corona; preserva la incertidumbre sobre el orden de batalla completo y las bajas.
- Vincula Francia, Reino Unido e Italia por sus fuerzas históricas; Croacia se añade exclusivamente como referencia geográfica contemporánea de Vis, no como beligerante.
- Incorpora trazabilidad de Royal Museums Greenwich y de un estudio académico de Povijesni prilozi, con las etiquetas visibles de fuente ya localizadas al español.
- Reduce las jerarquías provisionales de 104 a 103 y mantiene cero alertas estructurales, con 1.827 conflictos, 3.083 eventos y 1.073 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-10`.

## v1.6.142 - 2026-08-28

- Normaliza la entrada provisional "Batalla de Jabrayil" como **Operaciones de Jabrayil (2020)**, con aliases en español e inglés, ficha diferida, índices, búsqueda y timeline regenerados.
- La sitúa en octubre de 2020 dentro de la Segunda guerra de Nagorno-Karabaj y su ofensiva meridional, con fecha, región y jerarquía verificables.
- Vincula Armenia y Azerbaiyán, conserva a Artsaj como actor de facto y no como Estado reconocido, y registra la declaración trilateral de 9 de noviembre de 2020 como cierre de la fase bélica.
- Distingue el anuncio estatal azerbaiyano del 4 de octubre de la controversia inicial y del control territorial posterior documentado; no fija bajas, unidades ni un parte táctico cerrado.
- Incorpora trazabilidad del Congressional Research Service, Human Rights Watch, el informe de país neerlandés y la cronología estatal azerbaiyana, identificada como tal.
- Reduce las jerarquías provisionales de 105 a 104 y mantiene cero alertas estructurales, con 1.826 conflictos, 3.079 eventos y 1.072 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-9`.

## v1.6.141 - 2026-08-28

- Normaliza la entrada provisional "Batalla de Havana" como **Combate naval frente a La Habana (1870)**, con aliases en español e inglés, ficha diferida, índices y búsqueda regenerados.
- La sitúa el 9 de noviembre de 1870 frente a La Habana, dentro de la Guerra franco-prusiana y de las operaciones navales transatlánticas de 1870.
- Registra un combate inconcluso entre SMS Meteor y Bouvet; distingue el intento de espolonazo y el regreso a aguas españolas de una victoria, y no fija bajas ni daños cerrados porque las fuentes discrepan.
- Vincula Francia y Alemania mediante las fuerzas históricas; Cuba y España quedan como referencia territorial y potencia neutral, no como beligerantes contemporáneos.
- Incorpora trazabilidad de Papers Past, DBNL y Deutsche Digitale Bibliothek/Bayerische Staatsbibliothek.
- Reduce las jerarquías provisionales de 106 a 105 y mantiene cero alertas estructurales, con 1.825 conflictos, 3.077 eventos y 1.071 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-8`.

## v1.6.140 - 2026-08-28

- Normaliza la entrada provisional "Batalla de Hiddensee" como **Combate naval frente a Hiddensee (1870)**, con aliases en español, alemán e inglés, ficha diferida, índices y búsqueda regenerados.
- La sitúa el 17 de agosto de 1870 frente a Hiddensee y Dornbusch, dentro de la Guerra franco-prusiana y de las operaciones navales del Báltico de 1870.
- Registra un combate inconcluso entre la flotilla de la Confederación Alemana del Norte y la escuadra francesa del Báltico, sin impactos, bajas ni daños confirmados; no fuerza una lista cerrada de los buques franceses cuando los relatos divergen.
- Vincula Francia y Alemania mediante los participantes históricos, conserva Hiddensee como ubicación y protege el nombre de la cañonera Blitz frente a normalizaciones ajenas.
- Incorpora trazabilidad de Deutsche Digitale Bibliothek/Bayerische Staatsbibliothek y DBNL.
- Reduce las jerarquías provisionales de 107 a 106 y mantiene cero alertas estructurales, con 1.824 conflictos, 3.075 eventos y 1.070 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-7`.

## v1.6.139 - 2026-08-28

- Normaliza la entrada provisional "Batalla de St. Lucia" como **Batalla naval de Santa Lucía (1778)**, con aliases en español e inglés, ficha diferida, índices y búsqueda regenerados.
- La sitúa el 15 de diciembre de 1778 en Grand Cul de Sac, dentro de la Guerra de Independencia de Estados Unidos y de la Campaña de las Antillas de 1778-1783.
- Distingue el éxito defensivo británico del combate naval de la capitulación francesa posterior: no presenta la captura de la isla como resultado de una sola maniobra ni fija bajas sin series consistentes.
- Vincula Francia y Reino Unido mediante las fuerzas históricas, y conserva Santa Lucía como ubicación de la acción, no como Estado contemporáneo beligerante.
- Incorpora trazabilidad de Royal Museums Greenwich y Naval History and Heritage Command.
- Reduce las jerarquías provisionales de 108 a 107 y mantiene cero alertas estructurales, con 1.823 conflictos, 3.073 eventos y 1.069 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-6`.

## v1.6.138 - 2026-08-28

- Normaliza la entrada provisional "Batalla de San Domingo" como **Batalla naval de Santo Domingo (1806)**, con aliases en español, inglés y francés, ficha diferida, índices y búsqueda regenerados.
- La sitúa el 6 de febrero de 1806 frente a Santo Domingo, en las Guerras napoleónicas y la Campaña atlántica de 1806. Corrige la jerarquía genérica previa y registra la victoria británica sin cerrar una cifra única de bajas.
- Vincula Francia y Reino Unido por las escuadras históricas; República Dominicana queda solo como referencia geográfica contemporánea. No presenta a los Estados contemporáneos, España o Haití como beligerantes de la acción.
- Incorpora trazabilidad de Royal Museums Greenwich, Royal Collection Trust y la Gaceta de Madrid de 1806.
- Reduce las jerarquías provisionales de 109 a 108 y mantiene cero alertas estructurales, con 1.822 conflictos, 3.071 eventos y 1.068 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-5`.

## v1.6.137 - 2026-08-28

- Normaliza la entrada provisional "Batalla de Kalyazin" como **Combate de Kalyazin (1609)**, con aliases, ficha diferida, indices y busqueda regenerados.
- Corrige su modelo historico: la accion se ubica en el Periodo Tumultuoso de Rusia, no como una guerra interestatal simple. Distingue las fuerzas de Vasili IV y el contingente sueco de las tropas de Dmitri II con sus componentes mercenarios polaco-lituanos.
- Vincula Rusia, Polonia y Suecia para navegacion, pero evita presentar a una fuerza regular polaca como bando estatal oficial. Mantiene el episodio en agosto de 1609 y no fija un dia, bajas, efectivos ni una victoria decisiva donde las fuentes no coinciden.
- Incorpora trazabilidad del Polski Slownik Biograficzny, Echa Przeszlosci y documentacion institucional rusa sobre el apoyo sueco de 1609.
- Reduce las jerarquias provisionales de 110 a 109 y mantiene cero alertas estructurales, con 1.821 conflictos, 3.068 eventos y 1.067 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-4`.

## v1.6.136 - 2026-08-28

- Normaliza la entrada provisional "Batalla de Lebouirate" como **Ataque a Lebouirate (1979)**, con aliases en espanol, ingles y frances, ficha diferida, indices y busqueda regenerados.
- La situa dentro de la Guerra del Sahara Occidental y de las Ofensivas del Frente Polisario de 1979. Vincula Marruecos y Sahara Occidental para la navegacion contemporanea, preserva los participantes historicos y no formula una adjudicacion de soberania.
- Incorpora trazabilidad de El Pais, Le Monde y Naciones Unidas. Confirma la fecha del 24 de agosto de 1979 y el ataque a la guarnicion, pero conserva como disputados el control final, las bajas, los prisioneros y el equipo capturado.
- Corrige el resolvedor de Wikipedia para reconocer `Attack_on_Lebouirate` como titulo ingles, evitando que una URL en ingles se consulte mediante la API espanola.
- Reduce las jerarquias provisionales de 111 a 110 y mantiene cero alertas estructurales, con 1.820 conflictos, 3.065 eventos y 1.066 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-3`.

## v1.6.135 - 2026-08-28

- Corrige un defecto del normalizador que podia transformar el toponimo Pirano en "PIrano" al procesar la regla de Iran. La regla ahora reconoce exclusivamente el pais completo y una regresion protege ambos casos.
- Normaliza y consolida la entrada de Grado como **Batalla naval de Pirano (1812)**, con aliases en espanol, ingles e italiano, ficha diferida, indices y busqueda regenerados.
- Situa el combate en el Adriatico septentrional entre Pirano y Grado, dentro de las Guerras napoleonicas y la Campana del Adriatico. Conserva los reinos y escuadras historicos como participantes, y solo usa Reino Unido, Italia y Eslovenia como enlaces contemporaneos de navegacion.
- Incorpora trazabilidad del Museo Nacional de Arqueologia del Mar de Caorle, la Universidad Ca' Foscari de Venecia y un estudio arqueologico naval. No fija una cifra unica de bajas ni una causa tecnica definitiva de la perdida del Mercurio cuando las fuentes no son uniformes.
- Elimina ademas un duplicado de capitalizacion de "Conflicto irano-israeli durante la guerra civil siria". La auditoria queda en cero alertas estructurales, con 1.819 conflictos, 3.063 eventos, 1.065 fichas diferidas y 111 jerarquias provisionales pendientes de curaduria.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-2`.

## v1.6.134 - 2026-08-28

- Normaliza la entrada provisional "Batalla de Gotska Sandön" como Batalla naval de Gotska Sandön (1563), con alias en español, inglés y sueco, ficha diferida e índices renovados.
- La sitúa frente a Gotska Sandön, en el Báltico central, dentro de la Guerra Nórdica de los Siete Años y de sus operaciones navales de 1563. Vincula Suecia y Dinamarca para la navegación contemporánea, mientras conserva Reino de Suecia y Dinamarca-Noruega como participantes históricos.
- Registra un resultado táctico no decisivo, la participación documentada de Jacob Bagge y la fecha de septiembre de 1563, sin convertir en cifras cerradas los buques, efectivos o bajas que las fuentes revisadas no reconcilian.
- Incorpora trazabilidad de Brill, DiVA y Sjöhistoriska samfundet, junto con regresiones de alias, fecha, jerarquía, participantes, fuentes, prudencia editorial y país vinculado.
- Reduce las jerarquías provisionales de 113 a 112, mantiene cero alertas estructurales y actualiza los índices a 1.818 conflictos, 3.059 eventos y 1.064 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-28-release-1`.

## v1.6.133 - 2026-08-27

- Normaliza la entrada provisional "Batalla de Dschask" como Combate naval de Jask (1620), con aliases en espanol, aleman e ingles, ficha diferida y resolucion complementaria.
- Corrige la geografia: la accion ocurrio frente a Jask, en la costa de Makran y el golfo de Oman, en el actual Iran, no en Europa. Conserva el vinculo con Portugal por la escuadra del Estado da India y agrega Reino Unido e Iran como enlaces contemporaneos de navegacion.
- La situa en la rivalidad anglo-portuguesa por el comercio del golfo Persico, sin presentar a Iran como beligerante naval moderno. Distingue el combate de diciembre de 1620 de la posterior toma anglo-persa de Hormuz de 1622 y evita fijar un dia, efectivos, bajas generales o una transferencia territorial que las fuentes no consolidan.
- Incorpora trazabilidad de Encyclopaedia Iranica, la historia documentada de la factoria inglesa de Surat y la Encyclopaedia of Portuguese Expansion; anade regresiones para aliases, fecha, jerarquia, participantes, paises vinculados, cautela editorial y resolucion complementaria.
- Reduce las jerarquias provisionales de 114 a 113, mantiene cero alertas estructurales y actualiza los indices a 1.817 conflictos, 3.057 eventos y 1.063 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-27-release-6`.

## v1.6.132 - 2026-08-27

- Normaliza la entrada provisional "Batalla de Drohiczyn" como Combate de Drohiczyn (1192), con aliases en espanol e ingles, ficha diferida y resolucion complementaria.
- La ubica en Drohiczyn, Podlaquia, Polonia actual, dentro de la expedicion de Casimiro II contra Drohiczyn y los yotvingios. La clasifica como combate fronterizo local, en lugar de conservar el conflicto regional europeo generico.
- Evita fusionarla con la batalla de 1238 contra la Orden de Dobrzyn y con los combates de 1831 y 1920 del mismo toponimo. Mantiene la incertidumbre entre 1192 y las sintesis que registran 1194, sin inventar dia, bajas, efectivos, una jefatura rusina definitiva ni una nacionalidad moderna para participantes medievales no polacos.
- Incorpora trazabilidad del Archivo Municipal de Bransk, una enciclopedia polaca y un estudio sobre los yotvingios; anade regresiones para aliases, fecha, jerarquia, participantes, cautela editorial y resolucion complementaria.
- Reduce las jerarquias provisionales de 115 a 114, mantiene cero alertas estructurales y actualiza los indices a 1.816 conflictos, 3.054 eventos y 1.062 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-27-release-5`.

## v1.6.131 - 2026-08-27

- Normaliza la entrada provisional "Batalla de Doro Passage" como Accion naval del paso de Doro (1827), con aliases en espanol e ingles, ficha diferida y resolucion complementaria.
- Corrige la geografia: la accion ocurrio en el paso de Doro, mar Egeo, Grecia, no en America. Vincula de forma explicita a Grecia por ubicacion y actores piratas, a Estados Unidos por el destacamento de la USS Porpoise y al Reino Unido por el bergantin mercante Comet.
- La situa dentro de las operaciones antipirateria estadounidenses en el mar Egeo y la escolta de la USS Porpoise. Registra la recuperacion del Comet, pero no convierte a Grecia ni a su guerra de independencia en un bando estatal ni adopta un total dudoso de bajas piratas.
- Conserva la diferencia entre el informe contemporaneo, que fecha la accion en la noche del 15 de octubre, y las sintesis que la registran el 16; por eso usa la precision "noche del 15 al 16 de octubre de 1827".
- Incorpora trazabilidad del registro del Senado de Estados Unidos de 1828 y de Naval History and Heritage Command, junto con regresiones para aliases, paises vinculados, jerarquia, participantes, cautela editorial y resolucion complementaria.
- Reduce las jerarquias provisionales de 116 a 115, mantiene cero alertas estructurales y actualiza los indices a 1.815 conflictos, 3.053 eventos y 1.061 fichas diferidas.
- Hace resistente la auditoria de candidatas provisionales: cada consulta de Wikipedia recibe cancelacion a los 8 segundos y el reporte se persiste despues de cada candidata, para que una API lenta no deje una cola desactualizada.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-27-release-4`.

## v1.6.130 - 2026-08-27

- Normaliza la entrada provisional "Batalla de Dolores River" como Combate del rio Dolores (1904), con aliases en espanol e ingles, ficha diferida y resolucion complementaria.
- Corrige su geografia: la accion ocurrio en Samar oriental, Filipinas, no en America continental. Mantiene el vinculo con Estados Unidos por la administracion colonial de la Constabularia Filipina y agrega correctamente la ficha de Filipinas.
- La situa en la Insurgencia pulahan en Samar (1904-1911), como combate insurgente regional. Conserva la destruccion de la compania de Stephen K. Hayt cerca de Dolores, pero no fija un dia de diciembre, cifras de fuerzas, bajas pulahanes, sobrevivientes ni armas capturadas porque las fuentes secundarias discrepan.
- Incorpora trazabilidad de Texas A&M University, Philippine EJournals y el Gobierno de Filipinas. Evita reducir el movimiento pulahan a bandidaje o prolongar sin matices la Guerra filipino-estadounidense formal mas alla de 1902.
- Anade regresiones para alias, fecha parcial, jerarquia, participantes filipinos y estadounidenses, vinculo por pais, fuentes, cautela editorial y resolucion complementaria.
- Reduce las jerarquias provisionales de 117 a 116, mantiene cero alertas estructurales y actualiza los indices a 1.814 conflictos, 3.050 eventos y 1.060 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-27-release-3`.

## v1.6.129 - 2026-08-27

- Normaliza la entrada provisional "Batalla de Diablo Mountains" como Combate de Sierra Diablo (1854), con aliases en espanol e ingles, fecha estable, ficha diferida y resolucion complementaria.
- La situa bajo el paraguas verificable de las Guerras apaches, dentro de una categoria operativa descriptiva para las operaciones fronterizas estadounidenses de 1854 en el oeste de Texas.
- Distingue una patrulla estadounidense de Fusileros Montados de los combatientes apache. Conserva que Eugene A. Carr resulto herido en la fuente biografica detallada, pero no inventa una victoria, cifras de fuerzas, bajas generales, una banda lipan concreta ni una adscripcion a la Guerra jicarilla.
- Incorpora trazabilidad de National Archives/SNAC, Portal a la Historia de Texas y Texas Almanac. Mantiene Sierra Diablo y Limpia Creek como referencias en tension y evita fusionar la accion de 1854 con los enfrentamientos posteriores de 1880-1881.
- Anade regresiones para alias, fecha, jerarquia, tipo colonial, participantes, fuentes, cautela editorial y resolucion complementaria.
- Reduce las jerarquias provisionales de 118 a 117, mantiene cero alertas estructurales y actualiza los indices a 1.813 conflictos, 3.048 eventos y 1.059 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-27-release-2`.

## v1.6.128 - 2026-08-27

- Normaliza la entrada provisional "Batalla de Devil's Creek" como Combate de Devil's Creek (1885), con aliases en espanol e ingles, fecha estable, ficha diferida y resolucion complementaria.
- La situa en las Guerras apaches, dentro de la Campana de Geronimo de 1885-1886, como un combate colonial local cerca de Alma, Nuevo Mexico.
- Diferencia la columna del Ejercito de Estados Unidos y sus exploradores apaches aliados de la partida chiricahua. Conserva el parte militar de tres heridos y dos caballos muertos en la columna, sin inventar bajas chiricahuas ni adjudicar el mando local a Geronimo.
- Incorpora trazabilidad del Ejercito de EE. UU. en Fort Huachuca y del National Park Service. La campana se presenta como contexto, pero el resultado del combate no se describe como decisivo.
- Anade regresiones para alias, fecha, jerarquia, tipo colonial, participantes, fuentes, cautela del resultado y resolucion complementaria.
- Reduce las jerarquias provisionales de 119 a 118, mantiene cero alertas estructurales y actualiza los indices a 1.812 conflictos, 3.047 eventos y 1.058 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-27-release-1`.

## v1.6.127 - 2026-08-26

- Normaliza la entrada provisional "Batalla de Deglebat-Leglia" como Combate de Deglebat-Leglia (1977), con alias en espanol, frances e ingles, fecha estable y ficha diferida trazable.
- La sitúa en la Guerra del Sahara Occidental, dentro de una categoria operativa descriptiva de GeoRisk para las acciones del Frente Polisario contra Mauritania de agosto-septiembre de 1977. Tambien la enlaza con Mauritania y con Sahara Occidental como referencia geografica, sin adjudicar soberania.
- Incorpora procedencia contemporanea de *Le Monde* y *El Pais*, junto con un informe de Naciones Unidas. Conserva el 31 de agosto de 1977, pero no consolida bajas, prisioneros, danos materiales ni una victoria tactica porque los comunicados de las partes discrepan.
- Añade regresiones para el alias, fecha, jerarquia, participantes, referencia territorial disputada, fuentes y cautela sobre el balance.
- Reduce las jerarquias provisionales de 120 a 119, mantiene cero alertas estructurales y actualiza los indices a 1.811 conflictos, 3.046 eventos y 1.057 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-26-release-5`.

## v1.6.126 - 2026-08-26

- Normaliza la entrada provisional "Batalla de Czortkowem" como Batalla de Czortków (1919), con alias polacos, ingleses y de la actual Chortkiv, año estable, ficha diferida y resolución complementaria.
- La sitúa en la Guerra polaco-ucraniana (1918-1919), dentro de la Ofensiva de Chortkiv, y la enlaza con Polonia y Ucrania sin equiparar a la República Popular de Ucrania Occidental con el Estado contemporáneo.
- Incorpora procedencia del léxico académico *Bitwy polskie*, del Instituto Ucraniano de la Memoria Nacional y de *Encyclopedia 1914-1918 Online*. Distingue el combate local del 6 al 9 de junio de la ofensiva amplia iniciada el 7, y no consolida bajas ni un desenlace nacional a partir del resultado de la ciudad.
- Añade regresiones para alias, fecha, jerarquía, participantes, fuentes, vínculo ucraniano y prevención explícita contra la confusión con los choques de la invasión soviética de 1939.
- Reduce las jerarquías provisionales de 121 a 120, mantiene cero alertas estructurales y actualiza los índices a 1.810 conflictos, 3.044 eventos y 1.056 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-26-release-4`.

## v1.6.125 - 2026-08-26

- Normaliza la entrada provisional "Batalla de Cookes Canyon" como Combate de Cooke's Canyon (1861), con alias en español e inglés, año estable, ficha diferida y resolución complementaria en inglés.
- La sitúa en las Guerras apaches, dentro de las operaciones de Cooke's Canyon de 1861, y vincula la ficha de Estados Unidos con el índice de conflictos, el timeline y la búsqueda.
- Distingue el convoy Ake y su escolta civil de los combatientes apache chiricahua; evita presentar a una comunidad indígena como un actor genérico y no inventa mandos individuales.
- Incorpora trazabilidad de la monografía de Donald H. Couchman publicada por la Oficina de Administración de Tierras de EE. UU. y del contexto histórico del Servicio de Parques Nacionales. Conserva agosto de 1861, pero declara que el día, las bajas y el liderazgo no están consolidados entre los relatos.
- Añade regresiones para el alias, la fecha, la clasificación colonial, los participantes, las fuentes, la cautela editorial y la resolución complementaria.
- Reduce las jerarquías provisionales de 122 a 121, mantiene cero alertas estructurales y actualiza los índices a 1.809 conflictos, 3.042 eventos y 1.055 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-26-release-3`.

## v1.6.124 - 2026-08-26

- Normaliza la entrada provisional "Batalla de Chobayashiura" como Acción naval de Jangnimpo (1592), con nombre público buscable, año y ficha diferida trazable.
- La sitúa en las Invasiones japonesas de Corea (1592-1598), dentro de la cuarta campaña naval de Yi Sun-sin, y la enlaza tanto con Japón como con Corea del Sur.
- Incorpora procedencia del Instituto Nacional de Historia de Corea, del Gobierno del distrito de Saha en Busan y del Korean Citation Index. Conserva la destrucción registrada de seis naves japonesas, pero no inventa día, bajas humanas ni mandos secundarios ante las diferencias de calendario y detalle de las fuentes.
- Añade regresiones de nombre, búsqueda, ficha, enlaces por país y ausencia del rótulo antiguo; actualiza la resolución complementaria al índice histórico en inglés.
- Reduce las jerarquías provisionales de 123 a 122, mantiene cero alertas estructurales y actualiza los índices a 1.808 conflictos, 3.041 eventos y 1.054 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-26-release-2`.

## v1.6.123 - 2026-08-26

- Retira la entrada provisional "Batalla de Cerro del Gallo" de México: la traza de auditoría del registro apuntaba en realidad a la Batalla de Cerro Grande, librada en La Serena, Chile, en 1859.
- Evita convertir una coincidencia parcial de toponimia en un conflicto mexicano: la entrada no tenía fecha, ubicación, bandos ni fuente propia, por lo que se excluye en lugar de asignarle arbitrariamente una guerra o cronología.
- Añade una regla de exclusión con procedencia del Ejército de Chile y de la Municipalidad de La Serena, más una regresión que impide que la fuente chilena vuelva a contaminar el historial de México.
- Reduce los conflictos escaneados de 2.000 a 1.999 y las jerarquías provisionales de 124 a 123, sin alertas estructurales; conserva 1.807 conflictos indexados, 3.039 eventos y 1.053 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-26-release-1`.

## v1.6.122 - 2026-08-25

- Elimina la entrada provisional "Batalla de Cabo Bojador" de Marruecos tras verificar que no corresponde a un conflicto armado documentable.
- La Marinha de Portugal y la Academia de Marinha registran el cabo Bojador como un hito geográfico de la expedición de Gil Eanes de 1434, no como una batalla con fecha, bandos o desenlace verificables.
- Añade una regla de exclusión con procedencia y una regresión que evita que una exploración marítima vuelva a entrar al dataset como conflicto.
- Reduce los conflictos escaneados de 2.001 a 2.000 y las jerarquías provisionales de 125 a 124, sin alertas estructurales; conserva 1.807 conflictos indexados, 3.039 eventos y 1.053 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-25-release-5`.

## v1.6.121 - 2026-08-25

- Normaliza la entrada provisional "Batalla de Alegre" como Combate naval de Alegre (1867), con alias en español, portugués e inglés, ficha diferida y resolución complementaria estable.
- La sitúa en la Guerra de la Triple Alianza y en las operaciones de la retomada de Corumbá, explicando que este último nombre es una categoría operativa de GeoRisk y no una campaña oficial citada por las fuentes.
- Enlaza el combate con Brasil y Paraguay, identifica los vapores Antônio João, Jauru y Salto del Guairá, y diferencia la fuerza imperial brasileña de la paraguaya sin convertir el relato brasileño en un balance completo de la acción.
- Incorpora procedencia de la Marinha do Brasil, la Câmara Municipal de Cuiabá y el registro documental de UNESCO. Conserva el 11 de julio de 1867, la recuperación del Jauru y la captura de sus ocupantes, sin consolidar bajas paraguayas ni totales de ambos bandos.
- Añade regresiones para alias, fecha, jerarquía, tipo naval, participantes, cautela sobre bajas, vínculo brasileño y resolución complementaria.
- Reduce las jerarquías provisionales de 126 a 125, mantiene cero alertas estructurales y actualiza los índices a 1.807 conflictos, 3.039 eventos y 1.053 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-25-release-4`.

## v1.6.120 - 2026-08-25

- Normaliza la entrada provisional "Batalla de Aranas" como Batalla de Aranas (2007), con alias en español e inglés, ficha diferida y resolución estable para la fuente complementaria.
- La sitúa en la Guerra de Afganistán y en las operaciones de Nuristán, con una nota transparente que aclara que esta última es una categoría operativa de GeoRisk y no una campaña oficial nombrada por las fuentes.
- Vincula la acción con Afganistán y Estados Unidos: distingue al 1.er Pelotón de la Compañía Chosen, al Ejército Nacional Afgano y a la fuerza insurgente sin atribuirle una organización, unidad o bajas que las fuentes institucionales no confirman.
- Incorpora procedencia del Ejército de Estados Unidos y Army University Press. Conserva el 9 de noviembre de 2007, las seis muertes estadounidenses y la evacuación posterior, pero no consolida bajas insurgentes ni adjudica una victoria táctica.
- Añade regresiones para el alias, la fecha, la jerarquía, los participantes, la cautela del resultado, las fuentes, el vínculo afgano y la resolución complementaria.
- Reduce las jerarquías provisionales de 127 a 126, mantiene cero alertas estructurales y actualiza los índices a 1.806 conflictos, 3.037 eventos y 1.052 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-25-release-3`.

## v1.6.119 - 2026-08-25

- Normaliza la entrada provisional "Batalla de Bau" como Batalla de Bau (1965), con alias en español e inglés, una ficha diferida y una resolución estable para la fuente complementaria.
- La sitúa en la Confrontación Indonesia-Malasia y en las operaciones Claret de Borneo. Distingue a la compañía gurkha británica del 2.º Batallón de 10th Princess Mary's Own Gurkha Rifles de la fuerza indonesia atrincherada.
- Vincula el conflicto con Reino Unido, Indonesia y Malasia de forma explícita: Indonesia representa la fuerza opuesta y Malasia el frente geográfico-político de Sarawak, sin inventar una unidad malasia participante.
- Incorpora la cita de la Cruz Victoria publicada en The London Gazette, una reproducción institucional del Departamento de Asuntos de Veteranos de Australia y el contexto del Gurkha Museum. No consolida bajas, unidad indonesia ni una victoria global que esas fuentes no sostienen.
- Añade regresiones para alias, fuentes, fecha, participantes, jerarquía, enlaces por país, ausencia de tratados ficticios y búsqueda complementaria.
- Reduce las jerarquías provisionales de 128 a 127, mantiene cero alertas estructurales y actualiza los índices a 1.805 conflictos, 3.035 eventos y 1.051 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-25-release-2`.

## v1.6.118 - 2026-08-25

- Normaliza la entrada provisional "Batalla de Asinara" como Batalla naval de Asinara (1409), con alias en español, italiano e inglés y una ficha diferida de bajo peso.
- La sitúa en la expedición de Martín el Joven en Cerdeña y en sus operaciones navales septentrionales de 1409. Distingue la escuadra siciliana aliada de la Corona de Aragón de las seis naves genovesas favorables a Brancaleone Doria.
- Incorpora procedencia del Parco Nazionale dell'Asinara y de Treccani. Mantiene solo el año, no inventa mandos, día, ubicación precisa ni bajas, y no presenta la acción naval como el cierre definitivo de la disputa por el Juzgado de Arborea.
- Añade regresiones para el alias, la jerarquía, los participantes, el tipo naval, las fuentes, las tildes visibles y la ausencia de tratados ficticios.
- Reduce las jerarquías provisionales de 129 a 128, mantiene cero alertas estructurales y actualiza los índices a 1.804 conflictos, 3.032 eventos y 1.050 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-25-release-1`.

## v1.6.117 - 2026-08-24

- Normaliza la Batalla de Chillicothe como Batalla de Chillicothe (1779), con nombre estable, fecha anual, región, campaña y jerarquía dentro de la Guerra de Independencia de Estados Unidos.
- La reclasifica como incursión y combate fronterizo: separa la milicia del Kentucky County de Virginia de los defensores shawnee de Old Chillicothe y evita reducir una comunidad indígena a un único mando individual.
- Corrige una ambigüedad de procedencia: un volumen del Centro de Historia Militar del Ejército de EE. UU. contiene fechas incompatibles en dos mapas; la historia militar de Kentucky y la fuente histórica de Ohio sitúan la acción en mayo de 1779. La ficha muestra solo el año y explica la discrepancia.
- Añade tres fuentes, una ficha diferida y regresiones para el alias, la campaña, la clasificación fronteriza, la cautela sobre bajas y el enlace complementario.
- Reduce las jerarquías provisionales de 130 a 129, mantiene cero alertas estructurales y actualiza los índices a 1.803 conflictos, 3.031 eventos y 1.049 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-24-release-6`.

## v1.6.116 - 2026-08-24

- Normaliza "Batalla de Colson's Mill" como Batalla de Colson's Mill (1780), con fecha, región, escala, campaña y jerarquía verificables dentro de la Guerra de Independencia de Estados Unidos.
- La sitúa en la Campaña del sur de 1780, distingue a la milicia patriota de William Lee Davidson de la fuerza lealista y agrega cronología, consecuencias, cierre de la guerra y una ficha diferida de bajo peso.
- Corrige un error histórico del marcador antiguo: la investigación actual del Departamento de Recursos Naturales y Culturales de Carolina del Norte señala que Samuel Bryan no estuvo al mando de los lealistas en la acción. La ficha no le atribuye ese mando y documenta la discrepancia de procedencia.
- Incorpora las bajas conservadas por la síntesis estatal con su atribución explícita, sin tratarlas como un parte independiente completo, junto con referencias del Gobierno y de la Biblioteca de Carolina del Norte y regresiones de jerarquía, alias y cautela.
- Reduce las jerarquías provisionales de 131 a 130, mantiene cero alertas estructurales y actualiza los índices a 1.802 conflictos, 3.030 eventos y 1.048 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-24-release-5`.

## v1.6.115 - 2026-08-24

- Normaliza la entrada provisional "Batalla de Clouds" como Batalla de las Nubes (1777), con alias de importacion en español e ingles y una resolucion de Wikipedia estable para la ficha complementaria.
- La ubica en la Guerra de Independencia de Estados Unidos y en la Campaña de Filadelfia de 1777, cerca de White Horse Tavern, con participantes, cronologia, escala, tipo y region normalizada.
- Conserva el resultado con cautela: fuentes del Servicio de Parques Nacionales y del Ejercito de EE. UU. documentan que una tormenta tropical interrumpio el encuentro antes de una batalla decisiva; la ficha no inventa bajas ni adjudica una victoria tactica.
- Agrega cuatro referencias institucionales, una ficha diferida de bajo peso y regresiones para la jerarquia, los alias, los participantes, la cautela del desenlace y el enlace a la fuente complementaria.
- Reduce las jerarquias provisionales de 132 a 131, mantiene cero alertas estructurales y actualiza los indices a 1.801 conflictos, 3.029 eventos y 1.047 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-24-release-4`.

## v1.6.114 - 2026-08-24

- Normaliza la Batalla de Cockle Creek como Acción naval de Chincoteague Inlet (1861), antes bajo un padre regional genérico, sin fecha, campaña ni participantes verificables.
- La sitúa en la Guerra Civil estadounidense y en las operaciones del Escuadrón de Bloqueo del Atlántico Norte en Virginia, con el USS Louisiana, Alexander Murray y la goleta confederada en preparación como corsario como participantes documentados.
- Conserva solamente el año: la historia naval de EE. UU. fecha la acción el 5 de octubre y una cronología impresa conservada por la Biblioteca del Congreso el 4. Tampoco consolida bajas, fuerzas ni resultados más allá de la destrucción de la goleta.
- Incorpora fuentes del Comando de Historia y Patrimonio Naval de EE. UU. y de la Biblioteca del Congreso, una ficha diferida y un alias estable entre la forma con y sin tilde para que una regeneración no degrade la curaduría publicada.
- Reduce las jerarquías provisionales de 133 a 132, mantiene cero alertas estructurales y actualiza los índices a 1.800 conflictos, 3.028 eventos y 1.046 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-24-release-3`.

## v1.6.113 - 2026-08-24

- Normaliza, fecha y jerarquiza la Batalla de Bir Enzaran (1979), que seguia bajo un conflicto regional generico sin una guerra padre, una campana ni participantes utiles para explorarla.
- La sitúa en la Guerra del Sahara Occidental y en las ofensivas del Frente Polisario de 1979; enlaza Marruecos y Sahara Occidental como referencias de navegacion, con una nota explicita de que el segundo enlace es geografico y no adjudica soberania.
- Incorpora cronologia, participantes y tres fuentes periodisticas contemporaneas. Conserva el 11 de agosto de 1979 como fecha de la accion, pero no consolida bajas, efectivos, capturas ni victoria tactica porque los balances de las partes son incompatibles y la verificacion posterior no los confirmo.
- Agrega una ficha diferida, alias de importacion profunda y regresiones para el nombre canonico, la jerarquia, los enlaces por pais, las fuentes, los participantes y la cautela sobre el desenlace.
- Reduce las jerarquias provisionales de 134 a 133, mantiene cero alertas estructurales y actualiza los indices a 1.799 conflictos, 3.027 eventos y 1.045 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-24-release-2`.

## v1.6.112 - 2026-08-24

- Normaliza, fecha y jerarquiza la batalla naval de Chef-de-Caux de 1417, que figuraba sin fecha, campaña ni padre verificable bajo un conflicto regional genérico.
- La sitúa dentro de la Guerra de los Cien Años y de la conquista inglesa de Normandía, con Francia y Reino Unido como enlaces contemporáneos y participantes históricos conservados como Reino de Francia y Reino de Inglaterra.
- Incorpora cronología, procedencia y una ficha diferida; muestra solamente el año porque las fuentes no coinciden en el día exacto, ni permite consolidar bajas o capturas como si fueran cifras verificadas.
- Añade referencias de Historic England, el Ministerio de Cultura de Francia y el Gobierno del Reino Unido, junto con regresiones para nombre, jerarquía, fuentes, cautelas y vínculo con Reino Unido.
- Reduce las jerarquías provisionales de 135 a 134, mantiene cero alertas estructurales y actualiza los índices a 1.798 conflictos, 3.025 eventos y 1.044 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-24-release-1`.

## v1.6.111 - 2026-08-23

- Normaliza, fecha y jerarquiza el combate naval frente a Barbados de 1778, que figuraba como una batalla genérica sin fecha, campaña ni padre verificable.
- Lo sitúa dentro de la Guerra de Independencia de Estados Unidos y de las operaciones de la fragata continental Randolph en el Caribe; conserva a Reino Unido como referencia contemporánea de la Royal Navy y no presenta a Barbados como beligerante.
- Documenta los buques, participantes, cronología y las 311 muertes verificables de la Randolph, sin atribuir una causa definitiva a la explosión de su santabárbara cuando los relatos no coinciden en la secuencia táctica.
- Incorpora tres referencias del Comando de Historia y Patrimonio Naval de EE. UU., un alias de importación inglesa y regresiones para nombre, jerarquía, fuentes, participantes, bajas y vínculo con Reino Unido.
- Reduce las jerarquías provisionales de 136 a 135, mantiene cero alertas estructurales y actualiza los índices a 1.797 conflictos, 3.023 eventos y 1.043 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-23-release-2`.

## v1.6.110 - 2026-08-23

- Normaliza, fecha y jerarquiza la ofensiva de Mocímboa da Praia de agosto de 2020, que figuraba como una batalla sin padre verificable.
- La sitúa dentro de la Insurgencia de Cabo Delgado, con una campaña específica, participantes cautelosos, cronología, procedencia y una ficha diferida bajo demanda.
- Distingue la ofensiva de la insurgencia completa, conserva como atribución la denominación ISIS-Mozambique usada por el Departamento de Estado de EE.UU. y evita consolidar bajas o efectivos cuando las fuentes no coinciden.
- Incorpora fuentes del Departamento de Estado de EE.UU., ACLED Cabo Ligado y Naciones Unidas, junto con un alias de importación y regresiones de jerarquía, idioma, fuentes y fechas.
- Corrige la equivalencia de meses entre español e inglés en la validación de detalles diferidos, de modo que una fecha como agosto de 2020 pueda enlazar de forma segura una fuente titulada en inglés como August 2020.
- Reduce las jerarquías provisionales de 137 a 136, mantiene cero alertas estructurales y actualiza los índices a 1.796 conflictos, 3.021 eventos y 1.042 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-23-release-1`.

## v1.6.109 - 2026-08-22

- Normaliza, fecha y jerarquiza la Batalla de las islas Hyères (1795), que figuraba como "Batalla de Hyères Islands" bajo un padre regional genérico y con texto parcialmente en inglés.
- La sitúa en la Guerra de la Primera Coalición y en la campaña naval mediterránea de 1793-1796, con participantes de época, cronología, procedencia y una ficha diferida bajo demanda.
- Vincula Francia, Reino Unido e Italia con transparencia histórica: Italia funciona como referencia contemporánea del Reino de Nápoles, sin presentarla como el Estado beligerante de 1795.
- Conserva la cautela sobre el desenlace: identifica una ventaja táctica anglo-napolitana, pero no consolida bajas ni presenta la acción como una decisión estratégica definitiva.
- Añade fuentes del Service historique de la Défense y Royal Museums Greenwich, un alias de importación inglesa y regresiones de jerarquía, idioma, fuentes y enlaces por país.
- Reduce las jerarquías provisionales de 138 a 137, mantiene cero alertas estructurales y actualiza los índices a 1.795 conflictos, 3.020 eventos y 1.041 fichas diferidas.
- La búsqueda de una guerra o batalla conserva los países vinculados en el mapa y ofrece acceso directo a su ficha diferida, sin obligar a recorrer listas largas de una ficha nacional.
- Estabiliza el smoke crítico del globo 3D: espera el final de la transición de cámara y repite un clic de selección breve antes de declarar una regresión de interacción.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-22-release-3`.

## v1.6.108 - 2026-08-22

- Fecha, jerarquiza y documenta la Batalla de Guerrero (1916), antes bajo un padre regional provisional y sin fecha, participantes ni procedencia suficiente.
- La sitúa en la Expedición punitiva estadounidense en México (1916-1917), distingue al destacamento de George A. Dodd de las fuerzas villistas y agrega México solo como referencia geográfica contemporánea.
- Sustituye el desenlace automático de victoria estadounidense por un relato cauteloso: hubo sorpresa y persecución, Villa escapó y las fuentes no permiten consolidar vencedor táctico ni bajas.
- Incorpora fuentes del Centro de Historia Militar del Ejército de EE. UU., Office of the Historian y el INAH, una ficha diferida y regresiones de jerarquía, fuentes y enlaces por país.
- Reduce las jerarquías provisionales de 139 a 138, mantiene cero alertas estructurales y actualiza los índices a 1.794 conflictos, 3.017 eventos y 1.040 fichas diferidas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-22-release-2`.

## v1.6.107 - 2026-08-22

- Corrige y documenta la Batalla del Neva (1240) y la Campana de Shanhaiguan-Rehe (1924) con fecha, jerarquia, participantes de epoca, cronologia y fuentes historicas o academicas.
- Situa el Neva dentro de las guerras sueco-novgorodenses y Shanhaiguan-Rehe dentro de la Segunda guerra Zhili-Fengtian; la ficha conserva las cautelas sobre cronicas unilaterales, escala, bandos y bajas no consolidadas.
- Elimina la asociacion incorrecta de Shanhaiguan con Estados Unidos y la incorpora como referencia geografica contemporanea en la ficha de la Republica Popular China.
- Normaliza los destinos de las tandas de conflicto sin distinguir tildes, para que una ficha como República Popular China no pierda una corrección declarada por diferencias de acentuación.
- Reduce las jerarquias provisionales de 141 a 139, mantiene cero alertas estructurales y actualiza los indices a 1.793 conflictos, 3.015 eventos y 1.039 fichas diferidas.
- Distingue en las fichas de conflicto una jerarquia verificada de una asociacion sugerida pendiente de fuente; las acciones pendientes ahora se marcan en la lista y el modal explica su estado sin presentarlo como dato confirmado.
- Agrega regresiones para las dos fichas curadas, el enlace correcto por pais, la normalizacion de destinos con tildes y la transparencia visual de jerarquias provisionales.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-22-release-1`.

## v1.6.106 - 2026-08-20

- Alinea la ayuda breve de Capas con el modulo de textos diferido, evitando que vuelva a aparecer una explicacion mas larga despues de iniciar la aplicacion.
- Reordena el espacio de trabajo movil de Capas: ahora ocupa el ancho disponible, mantiene scroll propio, reserva espacio antes de la navegacion inferior y evita que el selector 2D/3D se superponga a la exploracion.
- Mejora la legibilidad tactil de las capas con objetivos mas altos, jerarquia de grupos mas limpia y una explicacion breve de los datos proxy.
- Unifica el lenguaje visual de paneles principales, hubs y modales con superficies mas compactas y radios consistentes.
- Retira el estado de carga del arbol accesible al terminar el arranque, para que no siga anunciandose una vez que la aplicacion ya es interactiva.
- Agrega una regresion E2E que verifica ancho, separacion y prioridad de los controles del panel de Capas en celular.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-20-release-2`.

## v1.6.104 - 2026-08-17

- Traduce, fecha y jerarquiza la batalla naval de Osel (1719) y la primera batalla de Vailele (1888), que seguian bajo padres regionales provisionales y con asociaciones nacionales incompletas o incorrectas.
- Situa Osel en la Gran Guerra del Norte, incorpora Rusia y Estonia como referencias de navegacion junto con Suecia, y explica la equivalencia entre las fechas juliana y gregoriana sin consolidar bajas discutidas.
- Situa Vailele en la Primera guerra civil de Samoa, agrega Alemania como enlace historico y elimina Estados Unidos, que participo en la crisis posterior pero no en la accion de 1888.
- Agrega fichas diferidas, cronologias, participantes de epoca, acuerdos de cierre, fuentes navales, archivisticas e historicas, aliases de importacion profunda y cautelas visibles sobre actores contemporaneos, secuencias y bajas.
- Reduce las jerarquias provisionales de 143 a 141, mantiene cero alertas de conflictos y eleva el indice a 1.791 conflictos, 3.012 eventos de timeline y 1.037 detalles bajo demanda.
- Agrega regresiones para nombres canonicos, fechas, fuentes, jerarquias, enlaces por pais, exclusiones y fichas bajo demanda de ambos conflictos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-17-release-3`.

## v1.6.103 - 2026-08-17

- Desambigua, fecha y jerarquiza la batalla de Beitang (1900) y la batalla de Boca Teacapan (1870), antes registradas bajo padres regionales provisionales y asociaciones nacionales incompletas o incorrectas.
- Situa Beitang en la Rebelion de los Boxers y sus operaciones aliadas de septiembre de 1900; elimina el enlace estadounidense incorrecto y conecta China, Rusia, Alemania y Francia solo como referencias de navegacion contemporanea.
- Clasifica Boca Teacapan como una expedicion naval estadounidense contra pirateria en Sinaloa: Mexico queda como enlace geografico, sin presentarlo como beligerante formal de una guerra bilateral.
- Agrega fichas diferidas, participantes de epoca, cronologias, fuentes historicas, academicas y navales, aliases de importacion profunda y cautelas explicitas para bajas, fuerzas y resultados discutidos.
- Reduce las jerarquias provisionales de 145 a 143, mantiene cero alertas de conflictos y eleva el indice a 1.789 conflictos, 3.008 eventos de timeline y 1.035 detalles bajo demanda.
- Agrega regresiones para nombres canonicos, fechas, fuentes, jerarquias, asociaciones correctas, exclusiones y fichas bajo demanda de ambos conflictos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-17-release-2`.

## v1.6.102 - 2026-08-17

- Fecha, traduce y jerarquiza la batalla del palacio Dasman (1990) y la batalla de Cabo Rachado (1606), antes asociadas a un pais incorrecto o bajo un padre regional provisional.
- Corrige los enlaces de pais: Dasman queda en Irak y Kuwait y se elimina de Estados Unidos; Cabo Rachado conecta Portugal y Reino de los Paises Bajos sin convertir esos enlaces contemporaneos en bandos de epoca.
- Agrega fichas diferidas, cronologias, participantes historicos, fuentes institucionales y academicas, aliases de importacion profunda y cautelas explicitas sobre bajas, secuencias tacticas y valoraciones de resultado.
- Pulsa la redaccion visible de ambas fichas con denominaciones en espanol, tildes y referencias geografico-historicas consistentes.
- Reduce las jerarquias provisionales de 147 a 145, mantiene cero alertas de conflictos y sostiene 1.787 conflictos indexados, 3.002 eventos de timeline y 1.033 detalles bajo demanda.
- Agrega regresiones para nombres canonicos, fuentes, fechas, jerarquias, asociaciones correctas, exclusiones y fichas bajo demanda de ambos conflictos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-17-release-1`.

## v1.6.101 - 2026-08-16

- Fecha, normaliza y jerarquiza Flint Creek (1789) y Dogger Bank (1781), antes registrados bajo padres regionales provisionales o sin fecha.
- Vincula Dogger Bank con Reino Unido y Reino de los Paises Bajos, y elimina la asociacion incorrecta con Dinamarca; Flint Creek mantiene Estados Unidos solo como enlace geografico contemporaneo.
- Agrega fichas diferidas, cronologias, participantes de epoca, fuentes militares y archivisticas, aliases de importacion profunda y cautelas explicitas sobre bajas, actores historicos y la valoracion tactica.
- Incorpora exclusiones verificadas por pais al autofix para que una asociacion historica incorrecta pueda corregirse de forma declarativa, reproducible y cubierta por regresiones.
- Reduce las jerarquias provisionales de 149 a 147, mantiene cero alertas de conflictos y eleva el indice de conflictos a 1785 entradas, el timeline a 2998 eventos y los detalles diferidos a 1031 shards.
- Agrega regresiones para los nombres canonicos, fuentes, fechas, jerarquias, asociaciones correctas, exclusiones y fichas bajo demanda de ambos conflictos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-16-release-3`.

## v1.6.100 - 2026-08-16

- Fecha, normaliza y jerarquiza la batalla naval de Campeche (1843) y la batalla de Antivari (1914), antes registradas bajo padres regionales provisionales.
- Vincula Campeche con Mexico y Estados Unidos como referencia de navegacion de la Republica de Texas, y Antivari con Francia, Reino Unido, Austria, Hungria y Montenegro sin convertir los enlaces contemporaneos en bandos de epoca.
- Agrega fichas diferidas, cronologias, participantes, fuentes navales mexicanas, estadounidenses y europeas, aliases de importacion profunda y cautelas explicitas para la valoracion tactica y las bajas discutidas.
- Reduce las jerarquias provisionales de 151 a 149, mantiene cero alertas de conflictos y eleva el indice de conflictos a 1783 entradas, el timeline a 2995 eventos y los detalles diferidos a 1029 shards.
- Agrega regresiones para claves canonicas, fuentes, fechas, jerarquias, asociaciones por pais y fichas bajo demanda de los dos conflictos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-16-release-2`.

## v1.6.99 - 2026-08-16

- Fecha, normaliza y jerarquiza la batalla de Signal Hill (1762) y la batalla de Sjaellands Odde (1808), antes registradas con padres regionales provisionales.
- Vincula Signal Hill con Canada, Francia y Reino Unido, y Sjaellands Odde con Dinamarca, Noruega y Reino Unido, sin convertir enlaces contemporaneos en bandos historicos.
- Agrega fichas diferidas, cronologias, participantes de epoca, fuentes oficiales canadienses, danesas y museisticas, aliases de importacion profunda y cautelas explicitas para bajas y continuidad estatal.
- Reduce las jerarquias provisionales de 153 a 151, mantiene cero alertas de conflictos y eleva el indice de conflictos a 1781 entradas, el timeline a 2988 eventos y los detalles diferidos a 1027 shards.
- Agrega regresiones para claves canonicas, fuentes, fechas, jerarquias, asociaciones por pais y fichas bajo demanda de los dos conflictos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-16-release-1`.

## v1.6.98 - 2026-08-15

- Fecha, traduce y jerarquiza tres acciones que seguian bajo padres regionales genericos: el combate naval de Casma (1839), la batalla del paso de Predeal (1916) y Rabosee (1914).
- Vincula Casma con Chile, Peru y Bolivia; Predeal con Rumania, Alemania, Austria y Hungria; y Rabosee con Belgica y Alemania, manteniendo en cada caso participantes y Estados de epoca sin proyectarlos como bandos contemporaneos.
- Agrega fichas de conflicto diferidas, cronologias, fuentes navales, academicas y locales, aliases de importacion profunda cuando existe una pagina inequívoca y cautelas explicitas para resultados, bajas y fronteras historicas.
- Reduce las jerarquias provisionales de 156 a 153, mantiene cero alertas de conflictos y eleva el indice de conflictos a 1779 entradas, el timeline a 2982 eventos y los detalles diferidos a 1025 shards.
- Agrega regresiones para fechas, nombres canonicos, fuentes, fichas diferidas, asociaciones por pais y ausencia de padres provisionales en la nueva tanda.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-15-release-7`.

## v1.6.97 - 2026-08-15

- Fecha y jerarquiza tres conflictos historicos: las Islas Paracelso (1974), Staket (1719) y Castillo Itter (1945), con notas explicitas para disputas de soberania, resultados no concluyentes y bajas no consolidadas.
- Conecta las fichas de China, Vietnam, Suecia, Rusia, Estados Unidos, Alemania, Austria y Francia con las acciones historicas correspondientes, sin sustituir participantes de epoca por Estados actuales.
- Reduce las jerarquias provisionales de 159 a 156 y los conflictos fuera del indice fechable de 226 a 223.
- Hace reanudable la auditoria de jerarquias provisionales mediante `--offset`, progreso por candidato y reporte de la siguiente tanda sugerida.
- Agrega regresiones para nombres fechados, fuentes, fichas diferidas, asociaciones por pais y reanudacion segura de auditorias.
- Estabiliza el render de la vista global 3D con una solicitud de render asentada y refuerza la E2E para verificar el mismo `pick`/`drillPick` que usa el clic real.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-15-release-6`.

## v1.6.95 - 2026-08-15

- Desambigua, fecha y jerarquiza la Batalla de Debrecen de 1944 dentro de la Segunda Guerra Mundial, con cronologia, participantes y fuentes historicas.
- Vincula Alemania, Rumania y Rusia para la navegacion historica sin confundir esos enlaces con las formaciones participantes de epoca.
- Reduce las jerarquias provisionales de conflictos de 160 a 159 y los conflictos pendientes de fecha de 227 a 226.
- Agrega regresiones para preservar el alias de importacion, la fecha, las fuentes y la ficha diferida del conflicto.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-15-release-4`.

## v1.6.94 - 2026-08-15

- Agrega una prueba end-to-end critica con Chromium que valida clics reales en el mapa 2D/3D, fichas desde rankings y busquedas de pais, continente y religion en escritorio y movil.
- Corrige la conservacion del identificador ISO al preparar el GeoJSON: las capas vuelven a indexarse por pais, en lugar de por identificadores internos de Cesium.
- Hace el picking de pais robusto cuando una etiqueta 3D queda encima de la geometria, buscando la entidad de pais visible bajo el punto pulsado.
- Integra la prueba en `npm test` y GitHub Actions; CI instala Chromium de forma efimera y el entorno local reutiliza Chrome cuando esta disponible.
- Agrega regresiones de configuracion para que la E2E, el navegador requerido y los flujos esenciales no desaparezcan silenciosamente de la puerta de release.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-15-release-3`.

## v1.6.93 - 2026-08-15

- Fecha, jerarquiza y documenta las acciones de cabo Henry, Tory Island, cabo Ortegal y Agua Prieta con fuentes archivisticas, museisticas, historicas y diplomaticas.
- Reemplaza cuatro padres regionales provisionales por guerras, campanas, participantes de epoca y cronologias verificables; crea sus fichas diferidas y relaciones para mapa, busqueda y timeline.
- Anade referencias de navegacion para Reino Unido, Estados Unidos, Irlanda, Espana y Mexico sin presentar Estados actuales como beligerantes de epocas anteriores.
- Conserva cautelas sobre la valoracion tactica de cabo Henry, las denominaciones de Tory Island, la geografia espanola de Ortegal y la secuencia fronteriza de Agua Prieta.
- Agrega regresiones de importacion profunda, fuentes, fechas, jerarquias y asociaciones nacionales para mantener la curaduria.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-15-release-2`.

## v1.6.92 - 2026-08-15

- Fecha, jerarquiza y documenta Sejny, Świecino, Vlotho y Zawichost con fuentes militares, educativas, regionales y académicas.
- Sustituye cuatro padres regionales provisionales por jerarquías históricas específicas, con campañas, participantes de época, consecuencias, cronologías, acuerdos de cierre cuando corresponden y fichas diferidas.
- Vincula Sejny con Polonia y Vlotho con Alemania como referencias de navegación, sin convertir territorios o Estados contemporáneos en beligerantes de épocas anteriores.
- Distingue la batalla de Sejny de 1920 de la insurrección homónima de 1919, preserva a la Orden Teutónica y a Galitzia-Volinia como actores históricos, y evita inventar bajas, tratados o resultados cerrados donde las fuentes no los sostienen.
- Agrega regresiones de importación profunda, fuentes, jerarquías, fechas y asociaciones nacionales para impedir que la tanda vuelva a degradarse.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-15-release-1`.

## v1.6.91 - 2026-08-14

- Fecha, jerarquiza y documenta Suoi Chau Pha, las dos acciones de Zhenbao, Kousséri y Thuận An con fuentes militares, archivísticas, bibliotecarias y locales.
- Reemplaza cuatro padres regionales provisionales por la Guerra de Vietnam, el conflicto fronterizo sino-soviético, la conquista francesa de Chad y la Campaña de Tonkín; también completa y fecha el conflicto padre sino-soviético y su segunda acción de Zhenbao.
- Vincula las acciones con Australia, Vietnam, Rusia, Camerún y Chad para que ficha, mapa, búsqueda, timeline y comparador compartan las referencias de navegación correctas.
- Conserva cautelas sobre bajas, denominaciones y soberanía de Zhenbao/Damanski, actores de época y expansión colonial en Kousséri y Thuận An.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-14-release-4`.

## v1.6.90 - 2026-08-14

- Fecha, jerarquiza y documenta la primera batalla de Svensksund, Fredrikshamn, Petajasaari, Nui Le y Long Jawai con fuentes archivisticas, museisticas, militares y de patrimonio.
- Corrige el falso ordinal de "Segunda batalla de Fredrikshamn", agrega anos canonicos, guerras y campanas, participantes de epoca, cronologias, acuerdos de cierre y cinco fichas de conflicto bajo demanda.
- Vincula cada accion con los paises relevantes para ficha, mapa, busqueda, timeline y comparador: Finlandia, Rusia, Suecia, Australia, Nueva Zelanda, Vietnam, Indonesia, Malasia y Reino Unido.
- Conserva cautelas editoriales para las fechas de calendario de Svensksund, las bajas de Petajasaari y Nui Le, y el resultado tactico de Long Jawai; no proyecta actores contemporaneos sobre conflictos historicos.
- Reduce las jerarquias provisionales de 177 a 172 y los conflictos fuera del indice fechable de 244 a 239; el indice de conflictos pasa a 1760 entradas, el timeline a 2932 eventos y los detalles diferidos a 1005 shards.
- Agrega regresiones de importacion profunda, datos publicados, fuentes, jerarquias, fechas y asociaciones nacionales para impedir que la tanda vuelva a degradarse.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-14-release-3`.

## v1.6.89 - 2026-08-14

- Fecha, jerarquiza y documenta Gonzales, los Tuneles Gemelos, Sadras, Providien, Negapatam y Pulo Aura con fuentes patrimoniales, militares y archivisticas.
- Reemplaza seis padres regionales genericos por la Revolucion de Texas, la Guerra de Corea, la guerra anglo-francesa de 1778-1783 y las Guerras napoleonicas.
- Normaliza el toponimo oficial Gonzales, agrega anios canonicos, paises de navegacion, aliases de importacion profunda y fichas diferidas para cada accion.
- Conserva actores de epoca, distingue la emboscada de patrulla de Twin Tunnels de la batalla principal y evita presentar resultados o bajas discutidos como cerrados.
- Reduce las jerarquias provisionales de 183 a 177 y los conflictos fuera del indice fechable de 250 a 244; mantiene cero alertas de auditoria y cero incidencias de validacion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-14-release-2`.

## v1.6.88 - 2026-08-14

- Se documentaran aca los cambios posteriores a v1.6.87 antes de cerrar la siguiente version.
- Fecha, jerarquiza y documenta Diu, Palikao, Tamsui, San Jacinto y la segunda batalla de Schooneveld con fuentes navales, museos, patrimonio y archivos.
- Reemplaza cinco padres regionales genericos por guerras y campanas historicas, agrega asociaciones de navegacion con India, Egipto, Republica Popular China, Reino Unido, Mexico y Reino de los Paises Bajos.
- Conserva actores de epoca y cautelas sobre cifras, calendarios, tratados no ratificados y continuidad estatal; incluye aliases de importacion profunda y regresiones de datos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-14-release-1`.

## v1.6.87 - 2026-08-13

- Fecha, jerarquiza y documenta cinco acciones visibles que seguian bajo padres regionales genericos: Samurra, Danny Boy, Tafilah, Top Malo House y Pichincha.
- Vincula los registros con Irak, Argentina, Ecuador y Jordania cuando corresponde a la geografia actual o a la navegacion historica, conservando actores de epoca y cautelas de continuidad estatal.
- Agrega fuentes militares, archivisticas y patrimoniales; explicita las versiones tacticas discutidas de Samurra, las cifras no consolidadas de Top Malo House y la toponimia dual de las islas.
- Hace que `audit:conflicts:provisional` revise una tanda de diez casos por defecto; `--all` o `--limit=0` conserva la auditoria exhaustiva.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-13-release-3`.

## v1.6.86 - 2026-08-13

- Fecha, jerarquiza y documenta Assandun, Helgea, Largs, Kringen y la Rebelion de Bornholm con fuentes de patrimonio, museos y archivos nacionales.
- Reemplaza la etiqueta imprecisa "Batalla de Bornholm" por la Rebelion de Bornholm de 1658; agrega nombres canonicos, participantes historicos, campanas, resultados, consecuencias y asociaciones de navegacion para Dinamarca, Noruega, Suecia y Reino Unido.
- Conserva cautelas visibles para ubicaciones discutidas, cronologias medievales, resultados tacticos y continuidad estatal; agrega aliases de importacion profunda y regresiones de datos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-13-release-2`.

## v1.6.85 - 2026-08-13

- Fecha, jerarquiza y documenta cinco acciones suecas y ruso-suecas del teatro finlandes: Bockholmssund, Gronvikssund, el estrecho de Kimito, Siikajoki y Napue.
- Situa Bockholmssund, Gronvikssund, Kimito y Siikajoki en la Guerra de Finlandia de 1808-1809, y Napue en la Gran Guerra del Norte.
- Traduce el rotulo ingles "Kimito Strait", agrega nombres canonicos con ano, participantes historicos, causas, resultados, consecuencias, cronologias, tratados y dos fuentes trazables por ficha.
- Vincula las cinco acciones con Finlandia y Rusia como acceso geografico e historico, sin proyectar una Finlandia independiente sobre los beligerantes de 1714 o 1808.
- Conserva cautelas sobre toponimos, fechas por calendario, continuidad estatal y cifras no consolidadas; agrega aliases de importacion profunda y regresiones de datos.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-13-release-1`.

## v1.6.84 - 2026-08-12

- Fecha, desambigua, jerarquiza y documenta seis acciones sueco-polaco-lituanas de Livonia y Curlandia que seguian bajo una guerra padre regional provisional: Karksi, Daugavgriva, Weissenstein, Reval, Kroppenhof y Wallhof.
- Situa Karksi, Daugavgriva, Weissenstein y Reval en la guerra polaco-sueca de 1600-1611; Kroppenhof en la fase de 1621-1625; y Wallhof en la guerra de 1626-1629.
- Completa campana, region historica, tipo de accion, participantes, causa, resultado, consecuencias, cronologia, acuerdo de cierre y dos fuentes de trazabilidad por ficha.
- Vincula las seis acciones con Polonia y Suecia para que ficha, mapa, filtros, ranking, comparador, busqueda, timeline e importacion profunda compartan el mismo registro.
- Conserva cautelas para variantes toponimicas, calendarios, fuerzas y bajas; distingue el Reval terrestre de 1602 de la batalla naval de 1790 y no proyecta Estados contemporaneos sobre la Mancomunidad.
- Reduce las jerarquias provisionales de 209 a 203 y los conflictos fuera del indice fechable de 276 a 270; el indice de conflictos pasa de 1723 a 1729 entradas, el timeline de 2836 a 2848 eventos y los detalles diferidos de 968 a 974 shards.
- Agrega regresiones para nombre canonico, fecha, padre, tipo, region, asociaciones nacionales, fuentes, notas de cautela, alias de importacion profunda y carga diferida.
- Mantiene cero incidencias y advertencias de validacion, conflictos en ingles, duplicados, regiones sospechosas, religiones redundantes, ciudades en mayusculas, mojibake y fallos de localizacion en detalles.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-12-release-5`.

## v1.6.83 - 2026-08-12

- Fecha, desambigua, jerarquiza y documenta seis acciones sueco-polacas del Diluvio que seguian bajo una guerra padre regional provisional: Chojnice, Filipow, Klecko, Lowicz, Nisko y Tykocin.
- Situa las seis fichas dentro de la Segunda Guerra Nordica y sus campanas respectivas en Pomerelia, Prusia Ducal, Gran Polonia, Mazovia, la ribera del San y Podlaquia.
- Completa region historica, tipo de accion, participantes, causa, resultado, consecuencias, cronologia, acuerdo de cierre y dos fuentes de trazabilidad por registro.
- Vincula cada accion con Polonia y Suecia para que ficha, mapa, filtros, ranking, comparador, busqueda, timeline e importacion profunda compartan la misma referencia.
- Conserva grafias historicas en los nombres canonicos y cautelas sobre bajas, fechas locales, calendarios y lealtades de epoca; distingue Chojnice de 1657 de la batalla medieval de 1454 y el socorro de Tykocin de julio de 1656 del asalto al castillo de enero de 1657.
- Reduce las jerarquias provisionales de 215 a 209 y los conflictos fuera del indice fechable de 282 a 276; el indice de conflictos pasa de 1717 a 1723 entradas, el timeline de 2824 a 2836 eventos y los detalles diferidos de 962 a 968 shards.
- Agrega regresiones para nombres canonicos, fecha, padre, tipo, region, asociaciones nacionales, fuentes, notas de cautela, aliases de importacion profunda y carga diferida.
- Mantiene cero incidencias y advertencias de validacion, conflictos en ingles, duplicados, regiones sospechosas, religiones redundantes, ciudades en mayusculas, mojibake y fallos de localizacion en detalles.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-12-release-4`.

## v1.6.82 - 2026-08-12

- Fecha, desambigua, jerarquiza y documenta seis acciones polaco-suecas del Diluvio que seguian bajo una guerra padre regional provisional: Zarnow, Krosno, Jaroslaw, Kozienice, Kcynia y Lubrze.
- Situa las seis fichas dentro de la Segunda Guerra Nordica, con campanas de la invasion sueca de 1655, la retirada de 1656 y la resistencia polaco-lituana, segun el contexto de cada accion.
- Completa region historica, tipo de accion, participantes, causa, resultado, consecuencias, cronologia, acuerdo de cierre y dos fuentes de trazabilidad por registro.
- Vincula cada conflicto con Polonia y Suecia para que ficha, mapa, filtros, ranking, comparador, busqueda, timeline e importacion profunda consuman una referencia comun.
- Conserva cautelas visibles para las cifras de fuerzas y bajas no consolidadas, los calendarios y fechas locales, las lealtades internas de Krosno y la denominacion historica de la coalicion sueco-brandeburguesa de Lubrze.
- Alinea el nombre canonico de Jaroslaw con la normalizacion de etiquetas ya usada por la aplicacion, sin perder la grafia historica en regiones, fuentes y textos curados.
- Reduce las jerarquias provisionales de 221 a 215 y los conflictos fuera del indice fechable de 288 a 282; el indice de conflictos pasa de 1711 a 1717 entradas, el timeline de 2812 a 2824 eventos y los detalles diferidos de 956 a 962 shards.
- Agrega regresiones de nombres canonicos, padre, tipo, fecha, region, asociaciones nacionales, fuentes, notas de cautela, aliases de Wikipedia y carga diferida para la nueva tanda.
- Mantiene cero incidencias y advertencias de validacion, nombres de conflicto en ingles, duplicados, regiones sospechosas, religiones redundantes, ciudades en mayusculas, mojibake y fallos de localizacion en detalles.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-12-release-3`.

## v1.6.81 - 2026-08-12

- Fecha, desambigua, jerarquiza y documenta seis acciones polaco-suecas que seguian con una guerra padre provisional: Kokenhausen, Oliwa, Trzciana, Wojnicz, Warka y Prostki.
- Situa Kokenhausen en la guerra polaco-sueca de 1600-1611; Oliwa y Trzciana en la guerra de 1626-1629; y Wojnicz, Warka y Prostki en la Segunda Guerra Nordica.
- Completa campana, region historica normalizada, tipo de accion, participantes, causa, resultado, consecuencias, cronologia, acuerdos de cierre y dos fuentes de trazabilidad por ficha.
- Corrige Prostken a Prostki, agrega el caracter naval de Oliwa y vincula los seis registros con Polonia y Suecia para que ficha, mapa, filtros, ranking y comparador consuman la misma referencia.
- Mantiene cautelas editoriales sobre calendarios juliano y gregoriano, continuidad de la Mancomunidad Polaco-Lituana, Prusia Ducal y la imposibilidad de consolidar cifras discutidas de efectivos o bajas.
- Reduce las jerarquias provisionales de 227 a 221 y los conflictos fuera del indice fechable de 294 a 288; el indice de conflictos pasa de 1705 a 1711 entradas, el timeline de 2800 a 2812 eventos y los detalles diferidos de 950 a 956 shards.
- Agrega regresiones para nombres canonicos, padres, fechas, regiones, asociaciones nacionales, fuentes, notas de cautela, carga diferida y aliases de importacion profunda.
- Mantiene cero incidencias y advertencias de validacion, nombres de conflicto en ingles, duplicados, regiones sospechosas, religiones redundantes, ciudades en mayusculas, mojibake y fallos de localizacion en detalles.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-12-release-2`.

## v1.6.80 - 2026-08-12

- Fecha, desambigua, jerarquiza y documenta ocho acciones nordicas y balticas que seguian con una guerra padre provisional: Colberger Heide, Fehmarn de 1644, Dynekilen, Grengam, Hogland, Kircholm, Kliszow y Gorzno.
- Completa guerra padre, campana, region, participantes historicos, causa, resultado, consecuencias, cronologia, acuerdos de cierre y dos fuentes de trazabilidad por ficha.
- Situa Colberger Heide y Fehmarn en la Guerra de Torstenson; Dynekilen, Grengam y Kliszow en la Gran Guerra del Norte; Hogland en la guerra ruso-sueca de 1788-1790; y Kircholm y Gorzno en sus respectivas guerras polaco-suecas.
- Mantiene cautelas explicitas sobre calendarios, resultados tacticos no decisivos, continuidad de Dinamarca-Noruega y la Mancomunidad Polaco-Lituana, y evita proyectar Estados contemporaneos como beligerantes historicos.
- Vincula las fichas con Dinamarca, Noruega, Reino de los Paises Bajos, Rusia y Polonia cuando existe participacion historica directa documentada, para que mapa, ranking, filtros y comparador compartan el mismo registro.
- Reduce las jerarquias provisionales de 235 a 227 y los conflictos fuera del indice fechable de 302 a 294; el indice de conflictos pasa de 1697 a 1705 entradas, el timeline a 2800 eventos y los detalles diferidos a 950 shards.
- Agrega aliases de importacion profunda, regresiones de nombres, fechas, jerarquias, participantes, fuentes, asociaciones nacionales y notas de cautela para la nueva tanda.
- Mantiene cero alertas de validacion, conflictos en ingles, duplicados, regiones sospechosas, religiones redundantes, ciudades en mayusculas y mojibake.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-08-12-release-1`.

## v1.6.79 - 2026-07-17

- Fecha, jerarquiza y documenta siete acciones historicas que seguian con padre provisional: Cabral y Lima Barros, Dieppe, Heligoland de 1864, bahia de Hudson, La Haya, Rumaila y Solebay.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias, cronologia, acuerdos de cierre y dos fuentes de trazabilidad por ficha.
- Distingue Heligoland de 1864 de la batalla de 1914, conserva la ambiguedad de calendario y resultado de Solebay, y marca cautelas sobre la cronologia de Rumaila y el resultado local de La Haya.
- Vincula las acciones con los paises participantes directos para que las fichas, el mapa, los filtros y los rankings mantengan la misma referencia.
- Reduce los conflictos fuera del indice fechable de 310 a 302 y las jerarquias provisionales de 242 a 235; el timeline pasa de 2763 a 2780 eventos fechables, el indice de conflictos de 1690 a 1697 y los detalles diferidos de 935 a 942 shards.
- Agrega una auditoria recuperable de candidatos provisionales basada en la API de Wikipedia, con lectura de campo "parte de", timeouts, reintentos ante limite de tasa y una regresion para evitar publicar el texto literal "null".
- Mantiene el reporte de candidatos como artefacto local, fuera del versionado y del deploy, para que la curaduria automatizada nunca se confunda con una fuente ya aprobada.
- Agrega regresiones de jerarquia, nombres canonicos, asociaciones nacionales, aliases de importacion, calidad de datos y puertas de release.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-17-release-4`.

## v1.6.78 - 2026-07-17

- Fecha, traduce, reclasifica y jerarquiza ocho acciones britanicas o multinacionales: Carillon, Monongahela, Wandiwash, Omdurman, Qurna, Jumunjin, la bahia de Heligoland y Maryang San.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias, cronologia, acuerdos de cierre y trazabilidad con fuentes de parques nacionales, museos militares, archivos navales y colecciones historicas.
- Situa Carillon y Monongahela en la guerra franco-india, Wandiwash en la tercera guerra carnática y la guerra de los Siete Anos, Omdurman en la guerra mahdista, Qurna y Heligoland en la Primera Guerra Mundial, y Jumunjin y Maryang San en la Guerra de Corea.
- Reclasifica Carillon como asalto a fortificacion, Qurna como batalla fluvial, Jumunjin y Heligoland como batallas navales y Maryang San como combate por una altura; agrega anos a todos los nombres para evitar homonimos.
- Vincula las acciones con Francia, Alemania, Australia, Estados Unidos, Corea del Norte y Republica Popular China cuando existe participacion directa documentada, y corrige una clave acentuada para que Maryang San tambien aparezca en la ficha china.
- Conserva cautelas sobre el caracter colonial de las acciones norteamericanas del siglo XVIII, la continuidad institucional de Irak y Turquia en Qurna, las denominaciones de Chumonchin/Jumunjin y las dos batallas de Maryang San de 1951.
- Reduce los conflictos sin fecha auditados de 318 a 310 y las jerarquias provisionales de 250 a 242; el timeline pasa de 2746 a 2763 eventos fechables.
- Regenera el indice liviano de conflictos de 1682 a 1690 entradas y los detalles diferidos de 927 a 935 shards; la segunda ejecucion converge con cero cambios.
- Agrega regresiones para nombres canonicos, tipos, padres, fechas, asociaciones nacionales, fuentes, aliases de Wikipedia, cautelas editoriales y ausencia de los rotulos antiguos.
- Endurece las automatizaciones de pre-push, mantenimiento, preparacion y release: ejecutan npm sin shells anidados y cada paso informa un limite de tiempo en vez de quedar suspendido en Windows.
- Mantiene 0 alertas, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-17-release-3`.

## v1.6.77 - 2026-07-17

- Fecha, traduce, reclasifica y jerarquiza nueve acciones historicas de alcance estadounidense o multinacional: Carrizal, Hamel, colina 282, Ambos Nogales, lago Pontchartrain, Puerto Principe, los dos bombardeos de Shimonoseki y San Juan de Puerto Rico.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias, cronologia, acuerdos de cierre y trazabilidad con fuentes institucionales o archivisticas para cada registro.
- Separa la accion naval estadounidense de Shimonoseki de 1863 del bombardeo multinacional de 1864, y fusiona las dos etiquetas heredadas de San Juan en un unico bombardeo naval de 1898 dentro de la guerra hispano-estadounidense.
- Mantiene cautelas visibles sobre el fuego amigo de la colina 282, las versiones sobre Nogales, la fecha de Puerto Principe y las cifras de tripulacion y bajas en el lago Pontchartrain.
- Corrige la combinacion de tandas de asociaciones nacionales: los conflictos agregados por cada lote ahora se acumulan y deduplican, en vez de que un lote posterior borre los enlaces ya curados para el mismo pais.
- Reduce los conflictos sin fecha auditados de 326 a 318 y las jerarquias provisionales de 258 a 250; el timeline pasa de 2723 a 2746 eventos fechables.
- Regenera el indice liviano de conflictos de 1675 a 1682 entradas y los detalles diferidos de 919 a 927 shards; la segunda ejecucion converge con cero cambios.
- Agrega regresiones para nombres canonicos, fechas, tipos, jerarquias, asociaciones nacionales, fuentes, cautelas editoriales, paginas de contexto y ausencia de los rotulos heredados.
- Mantiene 0 alertas, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-17-release-2`.

## v1.6.76 - 2026-07-17

- Fecha, traduce, reclasifica y jerarquiza doce acciones historicas vinculadas con Francia: Bantry, Bomarsund, Camaret, Cap-Francais, Chandannagar, Craonne, Golymin, Granada, Groix, Heilsberg, Chesapeake y Quiberon.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias, cronologia, tratados y trazabilidad con dos fuentes institucionales por registro.
- Reclasifica Bomarsund como sitio y operacion anfibia, Camaret como asalto anfibio y Chandannagar como asedio y asalto fluvial; traduce Bantry Bay, Grenada y Quiberon Bay y agrega anos para evitar nombres ambiguos.
- Distingue la batalla de Groix del 23 de junio de 1795 de la retirada de Cornwallis, y separa en Chesapeake el resultado tactico no concluyente de su efecto estrategico decisivo sobre Yorktown.
- Conserva cautelas explicitas sobre los calendarios y el resultado de Bantry, el desenlace no decisivo de Heilsberg, la accion no concluyente de Cap-Francais y las cifras de bajas no consolidadas.
- Vincula las acciones con Reino Unido, Irlanda, Finlandia, Rusia, Paises Bajos, Haiti, India, Alemania, Polonia y Estados Unidos cuando la participacion o la ubicacion historica lo justifican, sin inventar participacion militar del Estado moderno.
- Reduce los conflictos sin fecha auditados de 338 a 326 y las jerarquias provisionales de 270 a 258; el timeline pasa de 2688 a 2723 eventos fechables.
- Regenera el indice liviano de conflictos de 1663 a 1675 entradas y los detalles diferidos de 907 a 919 shards; la segunda ejecucion converge con cero cambios.
- Agrega regresiones para nombres canonicos, fechas, tipos, jerarquias, asociaciones nacionales, fuentes, disputas editoriales, paginas de contexto y ausencia de los doce nombres anteriores.
- Mantiene 0 alertas, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-17-release-1`.

## v1.6.75 - 2026-07-16

- Fecha, jerarquiza y documenta con fuentes doce acciones navales de las invasiones japonesas de Corea entre 1592 y 1598: Happo, Jeokjinpo, Sacheon, Dangpo, Danghangpo, Yulpo, Hwajungumi, Busan, Eoranpo, Myeongnyang, Jeolido y Noryang.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias, cronologia, acuerdos de cierre y cautelas editoriales con fuentes historicas oficiales coreanas, estudios academicos y el expediente UNESCO del `Nanjung Ilgi`.
- Reclasifica Happo como accion contra buques abandonados, Jeokjinpo como ataque a un fondeadero y Eoranpo como escaramuza y persecucion, evitando presentarlas como batallas campales.
- Distingue la batalla naval de Sacheon de 1592 de la terrestre de 1598, Dangpo de la accion homonima de 1604 y la primera batalla de Danghangpo de la segunda accion de 1594.
- Separa en Busan el exito tactico de la falta de conquista del puerto y conserva como disputadas las cifras de Jeokjinpo, Myeongnyang, Jeolido y Noryang y la localizacion reconstruida de Hwajungumi.
- Vincula las doce acciones con Corea del Sur y Noryang con China por la participacion de la flota Ming, sin duplicarlas dentro de las fichas nacionales.
- Mantiene `Batalla de Chobayashiura` y `Batalla de Hekihazu` en revision provisional: no se les asigna una identidad historica sin respaldo verificable.
- Reduce los conflictos sin fecha auditados de 350 a 338 y las jerarquias provisionales de 282 a 270; el timeline pasa de 2663 a 2688 eventos fechables.
- Regenera el indice liviano de conflictos de 1651 a 1663 entradas y los detalles diferidos de 895 a 907 shards; la segunda ejecucion converge con cero cambios.
- Agrega regresiones para nombres canonicos, fechas, tipos, jerarquia, asociaciones nacionales, fuentes, notas de confianza, paginas de contexto y ausencia de los doce rotulos ambiguos anteriores.
- Mantiene 0 alertas, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-16-release-4`.

## v1.6.74 - 2026-07-16

- Fecha, jerarquiza y documenta con fuentes diez acciones fronterizas de Estados Unidos entre 1791 y 1873: Kenapacomaqua, Claremore Mound, Sink Hole, Bandera Pass, Cooke's Spring, Pima Butte, rio Devils, rio Owyhee, Prairie Dog Creek y Honsinger Bluff.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias, cronologia, tratados y cautelas editoriales con fuentes institucionales, academicas y archivos historicos estatales.
- Reclasifica Kenapacomaqua como ataque a un poblado y Claremore Mound como masacre, en lugar de conservar etiquetas genericas de batalla que ocultaban la violencia contra civiles.
- Presenta Bandera Pass como un combate atribuido y discutido: no existe una fuente contemporanea que confirme su fecha, ubicacion, participantes o escala.
- Aclara que Pima Butte fue una batalla entre fuerzas indigenas y que su asociacion con Estados Unidos es solo geografica, sin participacion militar estadounidense.
- Evita falsa precision en Cooke's Spring, Sink Hole, rio Devils, rio Owyhee y Honsinger Bluff: conserva discrepancias de fecha, bajas, secuencia o perspectiva cuando las fuentes no coinciden.
- Reduce los conflictos sin fecha auditados de 360 a 350 y las jerarquias provisionales de 292 a 282; el timeline pasa de 2653 a 2663 eventos fechables.
- Regenera el indice liviano de conflictos de 1641 a 1651 entradas y los detalles diferidos de 885 a 895 shards; la segunda ejecucion converge con cero cambios.
- Agrega regresiones para nombres canonicos, fechas, padres, campanas, tipos, fuentes, paginas de importacion, notas de confianza y ausencia de los diez rotulos antiguos.
- Mantiene 0 alertas, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-16-release-3`.

## v1.6.73 - 2026-07-16

- Fecha, jerarquiza y documenta con fuentes diez acciones de la Revolucion estadounidense entre 1775 y 1781: Kemp's Landing, Lindley's Fort, Longue-Pointe, Saint-Pierre, Norwalk, San Luis, Mobley's Meeting House, Shallow Ford, Wetzell's Mill y Fort Slongo.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias, cronologia, acuerdos de cierre y cautelas editoriales con fuentes de Virginia, las Carolinas, Canada, el NPS, Founders Online y el Museo Militar de Nueva York.
- Reclasifica Norwalk como incursion y quema, Wetzell's Mill como escaramuza, Fort Slongo como asalto y Lindley's Fort como ataque a una fortificacion dentro de la guerra cheroqui de 1776.
- Distingue en Saint-Pierre a las milicias francocanadienses de lealtades opuestas y evita presentar la accion como un choque binario entre estadounidenses y britanicos.
- Conserva la diversidad de la coalicion atacante de San Luis, separa sus naciones indigenas y evita consolidar bajas que la fuente institucional no fija.
- Documenta la violencia contra cautivos tras Shallow Ford y el resultado mixto de Wetzell's Mill para no convertir victorias tacticas en relatos simplificados.
- Reduce los conflictos sin fecha auditados de 370 a 360 y las jerarquias provisionales de 302 a 292; el timeline pasa de 2643 a 2653 eventos fechables.
- Regenera el indice liviano de conflictos de 1631 a 1641 entradas y los detalles diferidos de 875 a 885 shards; la segunda ejecucion converge con cero cambios.
- Agrega regresiones para nombres canonicos, fechas, padres, campanas, tipos, fuentes, paginas de importacion y la ausencia de los diez rotulos antiguos en los datos servidos.
- Mantiene 0 alertas, incidencias, advertencias, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-16-release-2`.

## v1.6.72 - 2026-07-16

- Fecha, jerarquiza y documenta con fuentes nueve conflictos indigenas de Estados Unidos entre 1676 y 1918: Peskeompskut, Sudbury, Ojo Caliente, Fort Buchanan, Dry Lake, Turret Peak, Sugar Point, Kelley Creek y Bear Valley.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias, cronologia y cautelas editoriales con fuentes del NPS, Ejercito estadounidense, Biblioteca del Congreso y archivos historicos estatales y municipales.
- Fusiona `Batalla de Dry Lake` y `Batalla de Sand Butte`, dos nombres de la misma accion de la Guerra modoc que el importador trataba como conflictos separados.
- Reemplaza `Batalla de Turner's Falls` por `Masacre de Peskeompskut (1676)`, recupera el toponimo indigena y distingue la matanza de civiles del combate durante la retirada colonial.
- Reclasifica Kelley Creek como persecucion policial y masacre de una familia shoshone, no como guerra interestatal, y documenta la incertidumbre sobre la atribucion de los homicidios que iniciaron la persecucion.
- Traduce y desambigua el canon de Ojo Caliente de 1854, separa el ataque a Fort Buchanan de una batalla campal y contextualiza Sugar Point, Turret Peak y Bear Valley sin consolidar cifras discutidas.
- Reduce los conflictos sin fecha auditados de 380 a 370 y las jerarquias provisionales de 312 a 302; el timeline pasa de 2634 a 2643 eventos fechables.
- Regenera el indice liviano de conflictos de 1622 a 1631 entradas y los detalles diferidos de 866 a 875 shards; la segunda ejecucion converge con cero cambios.
- Agrega regresiones para nombres canonicos, fechas, padres, campanas, fuentes, participantes, clasificaciones, paginas de importacion y la ausencia de los diez rotulos antiguos en los datos servidos.
- Mantiene 0 alertas, incidencias, advertencias, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-16-release-1`.

## v1.6.71 - 2026-07-14

- Fecha, jerarquiza y documenta con fuentes ocho acciones de Australia y Dinamarca: Aidabasalala, Broodseinde, el combate Sydney-Kormoran, la primera batalla de Dernancourt, Bov, Schleswig, Fredericia e Isted.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias, cronologia y cautelas editoriales con fuentes del Australian War Memorial, Ejercito Australiano, Universidad de Aarhus y Museo Nacional de Dinamarca.
- Corrige una asociacion historicamente imposible en la ficha de Timor Oriental: la invasion y ocupacion indonesias y la crisis de 2006 dejan de heredar la Segunda Guerra Mundial y la campana del Pacifico.
- Separa la invasion indonesia de 1975 de la ocupacion de 1975-1999, documenta el cierre mediante la consulta popular y la transicion de Naciones Unidas, y estructura la crisis interna de 2006 con su despliegue internacional posterior.
- Vincula Aidabasalala con Timor Oriental, Broodseinde con Belgica, Dernancourt con Francia y Schleswig e Isted con Alemania, sin duplicar acciones dentro de cada ficha.
- Desambigua `Batalla de Schleswig (1848)`, identifica el `Combate naval entre el HMAS Sydney y el Kormoran (1941)` y agrega el ano a la invasion indonesia y la crisis timorense.
- Reduce los conflictos sin fecha auditados de 388 a 380 y las jerarquias provisionales de 320 a 312; el timeline pasa de 2621 a 2634 eventos fechables.
- Regenera el indice liviano de conflictos de 1614 a 1622 entradas y los detalles diferidos de 855 a 866 shards; la segunda ejecucion converge con cero cambios.
- Agrega regresiones sobre normalizacion interna, asociaciones con paises anfitriones, nombres canonicos, paginas de importacion y la prohibicion explicita de que Timor vuelva a heredar la Segunda Guerra Mundial.
- Mantiene 0 alertas, incidencias, advertencias, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-14-release-3`.

## v1.6.70 - 2026-07-14

- Fecha, jerarquiza y documenta con fuentes 10 acciones de Nicaragua y el Caribe entre 1800 y 1932.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias y cronologia para Masaya, La Paz Centro, Ocotal, Telpaneca, Sapotillal, Las Cruces, El Sauce, Fort Riviere y dos acciones distintas de Puerto Plata.
- Vincula las acciones tambien con el pais donde ocurrieron: siete pasan a la ficha de Nicaragua, Fort Riviere a Haiti y las dos de Puerto Plata a Republica Dominicana, sin duplicarlas dentro de cada ficha.
- Corrige y desambigua cuatro rotulos: `Batalla de Fort Rivière`, `Segunda batalla de Las Cruces (1928)`, `Incursión naval de Puerto Plata (1800)` y `Batalla de Puerto Plata (1916)`.
- Distingue la intervencion de 1912 de la Guerra de Sandino y separa la incursión naval de la Cuasi-Guerra de la ocupacion dominicana de 1916.
- Mantiene cautelas explicitas para bajas informadas por una parte beligerante, variantes de Sapotillal y el alcance historico del cierre de Fort Riviere.
- Reduce los conflictos sin fecha auditados de 398 a 388 y las jerarquias provisionales de 330 a 320; el timeline pasa de 2601 a 2621 eventos fechables.
- Regenera el indice liviano de conflictos de 1604 a 1614 entradas y los detalles diferidos de 845 a 855 shards; la segunda ejecucion converge con cero cambios.
- Conserva trazabilidad del Cuerpo de Marines, Naval History and Heritage Command, Departamento de Estado, Departamento de Defensa e informes de combate digitalizados.
- Agrega regresiones para fechas, padres, campanas, participantes, fuentes, renombres, paginas de importacion y asociaciones con Nicaragua, Haiti y Republica Dominicana.
- Mantiene 0 alertas, incidencias, advertencias, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-14-release-2`.

## v1.6.69 - 2026-07-14

- Fecha, jerarquiza y documenta con fuentes 14 acciones de las guerras fronterizas y campanas norteamericanas entre 1775 y 1882.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias y cronologia para Quebec, Piqua, Fallen Timbers, Cieneguilla, Ash Hollow, Pease, Apache Pass, Tongue River, Summit Springs, Blanco Canyon, Skeleton Cave, Cibecue, Fort Apache y Big Dry Wash.
- Normaliza ocho rotulos visibles mezclados con ingles y reclasifica `Batalla de Salt River Canyon` como `Masacre de Skeleton Cave` de acuerdo con la denominacion actual del NPS.
- Corrige dos simplificaciones historicas: Pease River ya no afirma como hecho la muerte discutida de Peta Nocona y Skeleton Cave conserva tanto la atribucion yavapai como la identificacion tonto apache del Ejercito.
- Agrega bajas solo cuando existe respaldo institucional: Cieneguilla, Big Dry Wash y Skeleton Cave mantienen cifras y cautelas de alcance explicitas.
- Reduce los conflictos sin fecha auditados de 412 a 398 y las jerarquias provisionales de 344 a 330; el timeline pasa de 2587 a 2601 eventos fechables.
- Regenera 14 detalles diferidos, de 831 a 845 shards, y converge con cero cambios en la segunda ejecucion.
- Conserva trazabilidad del NPS, Army University Press, Centro de Historia Militar, Comision Historica de Texas, Ohio History Connection y Biblioteca de Virginia.
- Agrega regresiones para cantidad, fechas, jerarquias, participantes, fuentes, tratados, bajas, cautelas historiograficas, renombres e idioma de importacion profunda.
- Mantiene 0 alertas, incidencias, advertencias, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes, mojibake y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-14-release-1`.

## v1.6.68 - 2026-07-13

- Reemplaza las ultimas cuatro jerarquias genericas con fecha conocida: Ras Kamboni, Tinzawatene, la ofensiva de Fano en Amhara y Boulikessi.
- Asigna padres y campanas especificos para la crisis de Jubalandia, la guerra de Mali y el conflicto armado de Amhara, con participantes y regiones reales.
- Renombra `Ofensiva de Amhara de 2024` como `Ofensiva de Fano en Amhara de 2024` para identificar al actor ofensivo y evitar una lectura ambigua.
- Triangula dos fuentes por conflicto, incluidas Naciones Unidas, Reuters, Associated Press, PISM, Critical Threats Project y el Gobierno del Reino Unido.
- Mantiene sin consolidar las bajas disputadas y documenta la participacion controvertida de JNIM en Tinzawatene en vez de presentar estimaciones partidarias como hechos.
- Reduce las jerarquias provisionales de 348 a 344 y deja en cero los padres genericos entre conflictos con fecha; los 344 pendientes restantes son historicos sin fecha.
- Regenera cuatro detalles diferidos, de 827 a 831 shards, y converge con cero cambios en la segunda ejecucion.
- Agrega regresiones para padres, campanas, participantes, fuentes multiples, cautelas editoriales, renombre de Amhara e idioma de importacion profunda.
- Mantiene 0 alertas, incidencias, advertencias, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre presupuesto y 55 FPS medios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-11`.

## v1.6.67 - 2026-07-13

- Fecha, jerarquiza y documenta con fuentes 22 acciones estadounidenses en China, Rusia, las guerras mundiales, Corea, Vietnam, el Golfo, Irak y Afganistan.
- Completa guerra padre, campana, region, participantes, causa, resultado, consecuencias y cronologia de cada accion, sin inventar tratados de cierre.
- Normaliza ocho nombres visibles, incluidos Chateau-Thierry, el aerodromo de Suwon, la base Mary Ann, la cresta de Medina, Jalibah y el valle de Shok.
- Corrige `Batalla de BIAP`: corresponde al combate del Aeropuerto Internacional de Bagdad del 11 de abril de 2004 contra el Ejercito del Mahdi, no a la toma del aeropuerto en 2003.
- Reduce los conflictos sin fecha auditados de 434 a 412 y las jerarquias provisionales de 370 a 348; el timeline pasa de 2565 a 2587 eventos fechables.
- Regenera el indice liviano de conflictos de 1568 a 1590 entradas y los detalles diferidos de 805 a 827 shards; la segunda ejecucion converge con cero cambios.
- Conserva trazabilidad institucional del U.S. Army Center of Military History, Air Force Historical Research Agency, Army Transportation Corps, Marine Corps y archivos oficiales del Ejercito.
- Agrega regresiones para cantidad, fechas, jerarquia, campanas, participantes, traducciones, fuentes, tratados vacios, BIAP y rutas de importacion profunda.
- Mantiene en cero alertas de conflictos, incidencias y advertencias de validacion, nombres ingleses, duplicados, regiones sospechosas, religiones redundantes y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, con 0 long tasks simuladas sobre el presupuesto y 55 FPS medios en el smoke.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-10`.

## v1.6.66 - 2026-07-13

- Fecha, jerarquiza y documenta con fuentes 26 acciones britanicas de la Segunda Guerra Mundial en Francia, Grecia, Creta, Malaya, Normandia, el Atlantico, el Artico y el Mediterraneo.
- Normaliza 18 nombres visibles que mezclaban espanol e ingles, incluidos Atenas, el golfo de Vizcaya, el mar de Barents, la bateria de Merville y los convoyes Cigno, Duisburg y Tarigo.
- Reduce los conflictos sin fecha auditados de 460 a 434 y las jerarquias provisionales de 396 a 370; el timeline pasa de 2539 a 2565 eventos fechables.
- Regenera el indice liviano de conflictos de 1542 a 1568 entradas y los detalles diferidos de 779 a 805 shards; la segunda ejecucion converge con cero cambios.
- Conserva trazabilidad institucional del Royal Navy Historical Branch, RAF, Imperial War Museums, Australian War Memorial, National Army Museum y archivos patrimoniales oficiales.
- Agrega regresiones para cantidad, fechas, jerarquia, campanas, participantes, traducciones, fuentes, tratados vacios y rutas de importacion profunda.
- Mantiene en cero alertas de conflictos, incidencias y advertencias de validacion, duplicados, nombres ingleses, regiones sospechosas y problemas de localizacion.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y `countries_index.json` en 141 KB, sin long tasks simuladas por encima del presupuesto.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-9`.

## v1.6.65 - 2026-07-13

- Fecha, jerarquiza y documenta con fuentes 27 acciones de las guerras de Black Hawk, Nez Perce, Sioux, Seminola, Comanche, Río Rojo, Tecumseh, Modoc y Yakama.
- Reduce los conflictos sin fecha auditados de 487 a 460 y las jerarquías provisionales de 423 a 396; el timeline pasa de 2512 a 2539 eventos fechables.
- Completa guerra padre, campaña, región, participantes, causa, resultado y consecuencias de cada acción, sin inventar tratados de cierre donde no existieron.
- Corrige 13 nombres visibles, incluidos Little Bighorn, el lago Okeechobee, el cañón White Bird, el río Powder, Palo Duro y el error ortográfico `Ouithlacoochie`; fusiona además tres alias ingleses.
- Agrega trazabilidad institucional del Ejército y el Servicio de Parques Nacionales de Estados Unidos, archivos de Florida, comisiones históricas de Illinois, Wisconsin, Nebraska y Texas, y Army University Press.
- Regenera el índice de conflictos de 1515 a 1542 entradas y los detalles diferidos de 752 a 779 shards; la segunda ejecución converge con cero cambios.
- Agrega regresiones para cantidad, fechas, jerarquía, campañas, participantes, traducciones, fuentes, tratados vacíos y rutas de importación profunda.
- Mantiene en cero alertas, incidencias de validación, duplicados internos, nombres ingleses, regiones sospechosas y problemas de localización o codificación.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-8`.

## v1.6.64 - 2026-07-13

- Fecha y jerarquiza con fuentes 16 acciones estadounidenses de la Segunda Guerra Mundial en Aleutianas, Indias Orientales, Guadalcanal, Nueva Georgia, Nueva Bretaña, Leyte, Atlántico y Europa.
- Reduce los conflictos sin fecha auditados de 503 a 487 y las jerarquías provisionales de 439 a 423; el timeline pasa de 2496 a 2512 eventos fechables.
- Completa campañas, regiones, participantes, causas, resultados y consecuencias de Bairoko, Dutch Harbor, Komandorski, Blackett, Makassar, Surigao, Kula, Sibuyán, Vella Lavella, Tassafaronga, Tenaru, Talasea, Saint-Lô, Saint-Vith, la colina Crucifix y el SS Stephen Hopkins.
- Normaliza ocho nombres visibles, incluidas mayúsculas geográficas, el acento de Sibuyán, Saint-Vith, la colina Crucifix y el combate naval del SS Stephen Hopkins.
- Agrega trazabilidad institucional del Ejército, la Marina, el Cuerpo de Marines y la Administración Marítima de Estados Unidos, además de títulos estables para la carga profunda diferida.
- Respeta listas de tratados explícitamente vacías y retira el falso texto de “acuerdo pendiente” de seis acciones que no tuvieron tratado propio.
- Agrega regresiones para cantidad, fechas, jerarquía, campañas, participantes, contexto editorial, traducciones, fuentes, tratados y rutas de importación; la regeneración completa converge con cero cambios.
- Mantiene en cero alertas, duplicados internos, nombres de conflictos en inglés, regiones sospechosas, problemas de codificación e incidencias de validación.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-7`.

## v1.6.63 - 2026-07-13

- Fecha y jerarquiza con fuentes 20 acciones de la Guerra Civil estadounidense entre 1861 y 1865.
- Reduce los conflictos sin fecha auditados de 523 a 503 y las jerarquias provisionales de 459 a 439; el timeline pasa de 2476 a 2496 eventos fechables.
- Asigna campanas concretas de Virginia Occidental, Misisipi, Fredericksburg, Tennessee Occidental, rio Rojo, Overland, Shenandoah, la marcha hacia el mar y la incursion de Wilson.
- Desambigua la segunda batalla de Fort McAllister, Columbus de 1865, Galveston de 1862 y Spotsylvania Court House; normaliza ademas Altamaha, Head of Passes, Memphis y St. Charles.
- Clasifica correctamente como navales las acciones de Head of Passes, Galveston, Memphis y St. Charles.
- Agrega trazabilidad institucional de Parques Nacionales, Centro de Historia Militar del Ejercito, Patrimonio Naval, Ejercito de EE. UU., Sociedad Historica de Georgia y el municipio de Collierville.
- Corrige el importador diferido para dirigir los titulos explicitos en ingles a la API inglesa de Wikipedia y evita fichas profundas vacias por consultar el idioma equivocado.
- Agrega regresiones para cantidad, fechas, guerra padre, campanas, participantes, traducciones, fuentes y rutas de importacion; la regeneracion completa converge con cero cambios.
- Mantiene en cero alertas, duplicados internos, nombres de conflictos en ingles, regiones sospechosas, problemas de codificacion e incidencias de validacion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-6`.

## v1.6.62 - 2026-07-13

- Fecha y jerarquiza con fuentes 25 acciones pendientes: veinte de la guerra anglo-estadounidense de 1812 y cinco de la guerra Creek de 1813-1814.
- Reduce los conflictos sin fecha auditados de 548 a 523 y las jerarquias provisionales de 484 a 459; el timeline pasa de 2451 a 2476 eventos fechables.
- Unifica 17 acciones ya curadas que todavia usaban `Guerra de 1812` bajo el nombre canonico `Guerra anglo-estadounidense de 1812`, evitando que timeline, busqueda y relaciones la interpreten como dos guerras distintas.
- Normaliza ocho nombres visibles, incluidos el sitio de Fort Wayne, el rio Canard, las alturas de Queenston, Saint Michaels y el combate naval entre el HMS Shannon y el USS Chesapeake.
- Asigna campana, region y participantes reales a cada accion, con trazabilidad del Centro de Historia Militar del Ejercito, patrimonio naval, Parques Nacionales y el Gobierno de Maine.
- Agrega regresiones para alias de guerra padre, fechas, campanas, traducciones, participantes, fuentes y rutas de importacion; la segunda regeneracion completa converge con cero cambios.
- Mantiene en cero alertas, duplicados internos, nombres de conflictos en ingles, regiones sospechosas, problemas de codificacion e incidencias de validacion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-5`.

## v1.6.61 - 2026-07-13

- Fecha, jerarquiza y documenta con fuentes 43 batallas de 1846-1902 vinculadas a la guerra mexicano-estadounidense, la guerra hispano-estadounidense y la guerra filipino-estadounidense, ademas de Manila 1945.
- Reduce los conflictos sin fecha auditados de 589 a 548 y las jerarquias provisionales de 525 a 484; el timeline pasa de 2410 a 2451 eventos fechables.
- Normaliza nueve nombres visibles, incluidos Monterrey, Mulegé, Mora, Tuxpan y las batallas de las colinas o rios filipinos, sin dejar variantes antiguas en las fichas.
- Separa `Batalla de Manila (1899)` de `Batalla de Manila (1945)`, restaura la segunda en la ficha de Estados Unidos y evita que vuelvan a fusionarse en un rango falso de 1899-1945.
- Conserva la etiqueta de procedencia de las tandas respaldadas por fuentes en vez de reemplazarla por la curaduria estructural generica; actualiza 423 detalles distribuidos en 55 fichas.
- Agrega regresiones para fechas, guerras padre, campanas, participantes, fuentes, nombres contextuales, recuperacion de registros y procedencia; la regeneracion completa converge con cero cambios.
- Mantiene en cero alertas, duplicados internos, nombres de conflictos en ingles, religiones redundantes, problemas de codificacion e incidencias de validacion.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-4`.

## v1.6.60 - 2026-07-13

- Fecha y jerarquiza 43 batallas residuales de la guerra de Independencia de Estados Unidos entre 1775 y 1782, con campana, region y fuente oficial por ficha.
- Reduce los conflictos sin fecha auditados de 633 a 589 y las jerarquias provisionales de 569 a 525; el timeline pasa de 2368 a 2410 eventos fechables.
- Fusiona `Batalla de Delaware Bay` y `Batalla de Delaware Capes` en `Batalla de la bahia de Delaware`, e integra el registro tecnico de inteligencia en la batalla canonica de Princeton.
- Normaliza en espanol los nombres de la batalla de la isla de Sullivan y de los fuertes Clinton y Montgomery.
- Reduce los conflictos unicos escaneados de 2004 a 2002 sin perder hechos historicos y mantiene en cero duplicados, alertas, nombres ingleses e incidencias de validacion.
- Agrega regresiones para cantidad, fechas, guerras padre, campanas, fuentes, fusiones semanticas y estabilidad del reporte; la regeneracion completa converge con cero cambios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-3`.

## v1.6.59 - 2026-07-13

- Fecha y jerarquiza 40 batallas de Estados Unidos que estaban sin resolver: 24 acciones de la guerra de Independencia y 16 de la guerra de 1812.
- Asigna a cada accion una campana, region concreta, tipo, escala y fuente institucional trazable del Centro de Historia Militar del Ejercito de Estados Unidos.
- Reduce tanto los conflictos sin fecha auditados como las jerarquias provisionales de 673/609 a 633/569, y suma 40 eventos fechables al timeline.
- Corrige `Batalla de Ch-teauguay` a `Batalla de Châteauguay` y evita que una `â` legitima se detecte como texto roto.
- Regenera textos narrativos obsoletos en 606 detalles de 49 paises cuando todavia aludian a una fecha o jerarquia provisional ya resuelta, sin reemplazar contenido editorial especifico.
- Agrega regresiones de cantidad, fecha, guerra padre, campana, fuentes, mojibake valido y renovacion de textos generados; la segunda regeneracion converge con cero cambios.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-2`.

## v1.6.58 - 2026-07-13

- Verifica con fuentes 39 jerarquias modernas y fusiona un duplicado, reduciendo la cola editorial de 649 a 609 conflictos unicos y el total escaneado de 2005 a 2004.
- Integra siete acciones de la guerra de Abjasia, tres de la primera guerra chechena y la batalla de Karamaji en la invasion de Daguestan.
- Estructura Tetovo, Radusa y Takur Ghar bajo sus conflictos y campanas correctos, con regiones concretas y trazabilidad institucional.
- Ordena 17 acciones de la guerra de Irak entre 2003 y 2007, y ubica Mosul 2016-2017 dentro de la guerra contra el Estado Islamico.
- Corrige las jerarquias de Chora, Kandahar, Dikwa, Karlivka, Al-Shadaddah y las ofensivas de Alepo de 2013 y 2016.
- Normaliza nombres visibles de Karbala, Al-Qaim, la calle Haifa, las ofensivas de Abjasia y la fecha de Dikwa; unifica los dos nombres de la batalla de los puentes de Nasiriya.
- Agrega regresiones de cantidad, fuente, guerra padre, campana e integracion con auditoria; la regeneracion completa converge sin cambios en una segunda pasada.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-13-release-1`.

## v1.6.57 - 2026-07-12

- Prepara una nueva version de mantenimiento con mediciones y auditorias actualizadas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-12-release-6`.
- Verifica con fuentes 43 jerarquias adicionales y reduce la cola editorial de 692 a 649 conflictos unicos, sin introducir alertas ni duplicados.
- Integra las batallas del Bogside, St Matthew's y Springmartin en el conflicto de Irlanda del Norte, y los combates de Aman y Ajlun en el conflicto jordano-palestino de 1970-1971.
- Agrupa Aileu, Baucau y Lospalos en la invasion indonesia de Timor Oriental; Harar y Jijiga en la guerra de Ogaden; y Abadan, Alepo, monte Kent y Khafji en sus guerras y campanas correctas.
- Estructura 27 acciones del Sahara Occidental entre 1977 y 1991 bajo una guerra padre comun, con fases, regiones, tipos y trazabilidad de Naciones Unidas.
- Agrega pruebas que impiden mezclar el sitio de Alepo de 1980 con la guerra civil siria de 2011 y que preservan las jerarquias del Sahara Occidental, Malvinas y Ogaden.
- Comprueba que la regeneracion sea idempotente y valida la busqueda, la apertura de fichas y el timeline relacionado en escritorio y a 390 px.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y el indice inicial en 141 KB; el smoke registra 55 FPS promedio y cero long tasks sobre presupuesto.

## v1.6.56 - 2026-07-12

- Prepara una nueva version de mantenimiento con mediciones y auditorias actualizadas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-12-release-5`.
- Verifica con fuentes 45 jerarquias adicionales y reduce la cola editorial de 737 a 692 conflictos unicos sin crear alertas nuevas.
- Asigna guerra padre, campana, region, tipo y escala a 33 acciones de la guerra de Vietnam entre 1964 y 1973, y clasifica Lima Site 85 dentro de la guerra civil de Laos.
- Corrige el combate de la fragata `Junon` contra la `Fox` de 1809 a 1778 tanto en el dataset servido como en el generador base.
- Normaliza nombres visibles en espanol para incursiones navales, Oum El Achar, Heartland, Csaszar kobanya, colinas 488/881 y la base Ripcord.
- Hace que consultas naturales simples como `paises de Asia` y `paises islamicos` abran y destaquen el grupo correspondiente.
- Evita que las auditorias de idioma interpreten palabras inglesas dentro de URLs de fuentes como texto visible defectuoso.
- Verifica en navegador ambos grupos semanticos y la apertura de Indonesia desde sus resultados, sin errores ni advertencias de consola.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y el indice inicial en 141 KB; el smoke registra 55 FPS promedio y cero long tasks sobre presupuesto.

## v1.6.55 - 2026-07-12

- Prepara una nueva version de mantenimiento con mediciones y auditorias actualizadas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-12-release-4`.
- Verifica con fuentes 35 jerarquias adicionales y reduce la cola editorial de 772 a 737 conflictos unicos; las relaciones provisionales por pais bajan de 783 a 737.
- Asigna guerra padre y campana a 24 acciones de la guerra de Corea y a conflictos modernos de China-Vietnam, Congo, Somalia, Irak, Georgia, Afganistan, Libia y Yemen.
- Corrige `Batalla de Khaz Oruzgan` de 2010 a 2008 a partir del Australian War Memorial.
- Reemplaza la ambigua `Batalla de la cota 233` de 1973 por `Batalla de la borne 233` de 1961 y corrige tambien el ano base del generador.
- Normaliza nombres visibles de Kisangani, Liakhvi, Douz, Faluya, Sana, rio Nam, colina Eerie, Seul y The Hook.
- Hace que el buscador diferido encuentre conflictos por su nombre propio aunque la consulta no incluya prefijos como `batalla` o `guerra`.
- Prioriza fechas fuente-respaldadas sobre anos importados obsoletos en la auditoria de conflictos.
- Verifica en navegador la busqueda `Khaz Oruzgan`, la lista de paises relacionados y la apertura de la ficha de Australia sin errores de consola.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y el indice inicial en 141 KB, con cero long tasks simuladas sobre presupuesto.

## v1.6.54 - 2026-07-12

- Prepara una nueva version de mantenimiento con mediciones y auditorias actualizadas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-12-release-3`.
- Corrige la auditoria temporal para que metadatos tecnicos como `curationBatch` no asignen falsamente el ano 2026 a batallas historicas sin fecha.
- Verifica con fuentes 34 jerarquias visibles adicionales y reduce la cola editorial de 806 a 772 conflictos unicos; las relaciones provisionales por pais bajan de 851 a 783.
- Completa fechas, guerra padre, campana, region, tipo, escala y fuente en acciones visibles de las guerras de Independencia estadounidense, Corea, Golfo, Afganistan, Ucrania, Sahara Occidental, Malvinas y otros escenarios.
- Normaliza los nombres duplicados de Galwan, Samichon y el puerto de Tripoli, conservando una ficha canonica en espanol para cada hecho.
- Agrega regresiones para impedir que notas, enlaces o identificadores de curaduria vuelvan a contaminar las fechas historicas y para exigir fuente y confianza a la nueva tanda.
- Verifica en navegador que la busqueda de Estados Unidos abre la ficha completa sin errores ni advertencias de consola.
- Mantiene el arranque critico en 810 KB, `script.js` en 543 KB y el indice inicial en 141 KB; el smoke de rendimiento registra 55 FPS promedio y cero long tasks sobre presupuesto.

## v1.6.53 - 2026-07-12

- Prepara una nueva version de mantenimiento con mediciones y auditorias actualizadas.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-12-release-2`.
- Verifica con fuentes 27 jerarquias visibles y reduce la cola editorial de 833 a 806 conflictos unicos; las relaciones provisionales por pais bajan de 915 a 851.
- Corrige fechas historicas visibles: Cheonpyeong pasa de 1951 a 1950, Joybar de 2001 a 2011 y Buenavista/El Manzano de 1838 a 1880.
- Unifica `Guerra de Malvinas (1982)` con `Guerra de las Malvinas` y normaliza el gentilicio derivado de Pakistan sin alterar el nombre del pais.
- Agrega el estado `Jerarquia verificada` y enlaces `http/https` validados a las fuentes de cada relacion curada en la ficha de conflicto.
- Corrige cronologias importadas con campo `event` o `description` que podian mostrarse como `[object Object]`.
- Agrega regresiones de fechas, fuentes, nombres canonicos, enlaces seguros y render de cronologia; la comprobacion local no registro errores de consola.

## v1.6.52 - 2026-07-12

- Recupera 23 relaciones de guerra padre y campana en 18 paises reutilizando jerarquias ya respaldadas por los detalles importados.
- Distingue 833 jerarquias unicas provisionales de los errores reales de conflictos; el doctor deja de informar una completitud falsa y publica una cola editorial acotada.
- Muestra `Jerarquia pendiente` en conflictos sin padre verificado y agrega el conteo correspondiente al checklist de cada ficha pais.
- Corrige batallas sin padre que se mostraban como nivel `Guerra` y ajusta los contadores para no sumar acciones tacticas como guerras independientes.
- Corrige busquedas exactas como `Estados Unidos` o `Corea del Sur`: los paises ahora tienen prioridad sobre origenes historicos, metropoli y tipos auxiliares.
- Reemplaza claves tecnicas de sugerencias por grupos legibles para denominaciones, metropoli, origenes y formacion historica.
- Agrega pruebas de jerarquia importada, deuda provisional, clasificacion guerra/campana/batalla y colisiones exactas del buscador.
- Actualiza `APP_VERSION` y `CACHE_VERSION` a `2026-07-12-release-1`.

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
