# CRAFTERRA 0.10.0 — revisión de texturas en dispositivos

**Automatizadas:** \`node tests/terrain-textures.mjs\` comprueba biomas, variedad de textura, reproducibilidad sin parpadeos, atlas bajo demanda, sombras, materiales de interior y seguridad offline. GitHub Actions también revisa la sintaxis del motor.

**Prueba manual en iPhone:**

1. Entrar en el Valle y moverse: la hierba debe tener microdetalle y pequeñas manchas naturales, sin parecer un mosaico plano o tener costuras brillantes.
2. Caminar a un bosque: observar hojarasca y diferencias claras respecto a la pradera.
3. Ir a la sierra: debe notarse la aspereza de roca, con grietas y estratos. Las vetas siguen siendo objetos separados e interactivos.
4. Acercarse al río y las orillas: comprobar agua texturizada y bordes de tierra húmeda.
5. Entrar en ambas cuevas: comprobar suelo rugoso y paredes más oscuras, sin tapar las vetas ni la salida.
6. Entrar en casa de Mara y taller de Lía: observar distintas texturas de madera y piedra.
7. Observar el contacto entre personajes, árboles, animales, rocas y suelo: deben tener sombra que dé sensación de peso.
8. Desplazarse repetidamente por el mapa: no debe cambiar aleatoriamente la textura de una misma casilla.
9. Comprobar rendimiento y calor del iPhone tras jugar un rato, y comparar con v0.9.0. El motor limita la resolución interna a 2× para evitar una carga Retina excesiva.
10. Comprobar todos los controles y la fabricación: el cambio es visual y no debería alterar el inventario ni los hitboxes.
11. Abrir la PWA sin conexión tras haberla cargado una vez: no debe depender de archivos de textura descargados.

**Pendiente:** hasta disponer de resultados reales en Safari iPhone, los tests automáticos no garantizan FPS ni ausencia de detalles visuales inesperados.

---


## Comprobación en iPhone y Android

1. Salir de la aldea hacia la sierra del norte: el color y la textura deben cambiar de hierba a roca; las vetas solo deben verse allí.
2. En las praderas, comprobar que hay pinos, robles, fibras, bayas, hierbas, ovejas y conejos, pero no menas de hierro flotando sobre el césped.
3. Acercarse a una oveja: recoger lana suelta y confirmar que **la oveja permanece visible**, con el vellón más fino, y que su siguiente cosecha queda bloqueada temporalmente.
4. Con cuchillo o tijeras, verificar que las acciones producen 2 o 3 lanas y consumen **un uso**, nunca toda la herramienta.
5. Capturar un conejo sin armas; confirmar carne + piel cruda, desaparición temporal de esa presa y ausencia de botín al pasar sobre la zona.
6. En el bosque, cazar un ciervo con lanza o arco: produce carne, piel cruda y hueso. Arco con flechas consume **1 flecha**; sin flechas no se puede cazar.
7. Buscar la **Cueva de la sierra**, al oeste del río. Entrar, pasear entre vetas, extraer hierro/cobre/carbón y volver a salir.
8. Cruzar el puente ya reparado, alcanzar la **Gruta de los cristales**, entrar, encontrar estaño, plata, oro y cuarzo. Los minerales avanzados requieren pico de hierro.
9. Dentro de una cueva, guardar/cerrar/reabrir el juego. Confirmar que la escena interior y la posición siguen siendo las correctas.
10. Acercarse a Lía y entrar en su taller. Utilizar la curtiduría con piel cruda + agua + madera tosca. Confirmar que se obtiene cuero tras terminar la barra.
11. Fundir hierro y forjar tijeras en el horno; probar que comienzan con 100 usos.
12. Comprobar las misiones, el puente, el inventario, las monedas y las recetas antiguas para descartar regresiones.
13. Revisar los menús con pictogramas y textos de requisitos; los animales no deben confundirse con rocas ni árboles.
14. Repetir con modo avión después de haber cargado la PWA al menos una vez, para validar los nuevos módulos offline.

## Automáticas

\`node tests/biomes.mjs\` verifica los hábitats y vetas, las entradas de las dos cuevas, la accesibilidad, la lana con regeneración, la captura/caza, las armas con flechas, las tijeras y el curtido. La CI también ejecuta todos los tests de versiones anteriores y comprueba la sintaxis de los módulos.

**No confundir test automático con prueba física:** la interacción visual y la ergonomía en Safari iPhone siguen pendientes de evidencias reales.

---


## Diagnóstico basado en grabación real de iPhone (23/11/2026)

La vista de fabricación mostraba una mesa de altura fija de 38 vh, con mucho espacio vacío, y debajo un inventario recortado a 185 píxeles de altura que generaba otro scroll. El resultado era desplazamiento vertical/horizontal dentro del inventario, además del desplazamiento de la página.

## Criterios de aceptación del rediseño

- **Un único scroll vertical:** el de la vista Crear. El inventario y la barra de estaciones nunca tendrán barras de desplazamiento propias.
- **Mesa compacta:** altura 195 px en móvil, dos huecos visibles y máximo dos ingredientes a la vez.
- **Acceso inmediato al crafteo:** seleccionar dos tarjetas y tocar FUSIONAR, sin arrastrar; opcionalmente se conserva el gesto de arrastre.
- **Mesa accesible mientras bajas por el inventario:** tablero fijo en la parte superior del área de Crear. El buscador queda justo debajo.
- **Inventario útil por defecto:** mostrar solo unidades disponibles; opción Descubiertos para ver también lo que ya no tienes.
- **Búsqueda y contador:** funcionan sin crear scroll horizontal o resetear la posición al escribir.
- **Tarjetas adaptativas:** cuatro columnas en pantallas móviles y seis en pantallas anchas, sin clipping lateral.
- **Filtros y estados accesibles:** los materiales agotados no se pueden añadir; botón Fusionar deshabilitado hasta colocar dos ingredientes.
- **Seguridad de partida:** comprobar con 2 maderas toscas, receta de agua, hierro y herramientas gastadas, sin consumir recursos extra ni duplicarlos.
- **Orientación horizontal:** mesa aún más compacta y un único scroll de página, sin anidar paneles.

## Pruebas automáticas

\`node tests/craft-layout.mjs\` comprueba integración HTML, limitación a dos ingredientes, selector de inventario, búsqueda, una sola área de scroll y caché offline. Se mantienen las pruebas de catálogo, aventuras, metalurgia e interfaz premium.

**Pendiente:** inspección visual/táctil en Safari iPhone. Las comprobaciones automáticas no certifican la experiencia real en pantalla.

---


## Pruebas automatizadas
- \`node tests/adventure-ui.mjs\`: SVG con arte original, sin descargas externas, iconos únicos, hojas visuales y controles activos.
- Además de \`tests/validate.mjs\`, \`tests/adventure.mjs\` y \`tests/metallurgy.mjs\`, ya existentes.

## Validación manual recomendada en Safari iPhone y Android

1. Abrir mundo desde una partida antigua: monedas, mapa, inventario, puente y logros intactos.
2. Ver que la cabecera del mundo sea compacta y se vea más terreno sin bloquear el mapa.
3. Tocar la mesa de cantería y el horno: aparece un **panel inferior** con grandes ilustraciones en vez de cuatro botones verdes con párrafos largos.
4. Verificar que cada acción tiene **imagen, título y coste/requisito breve**, incluidos los botones bloqueados.
5. Abrir «Combustible», «Fundir» y «Forjar» y volver: los grupos son navegables sin menús fuera de pantalla.
6. Extraer o talar: aparece barra de progreso en panel compacto, icono y animación de impacto sobre el objeto, con chispas.
7. Durante el trabajo tocar varias veces «¡GOLPEA!»: progreso acelera sin entregar el recurso antes de completar la barra.
8. Empezar una acción y mover al personaje: se cancela sin duplicar, regalar ni consumir recursos.
9. Comprobar la animación del personaje al trabajar y el anillo de progreso alrededor del objeto.
10. Repetir en orientación vertical y horizontal, con controles de movimiento D-pad y botón contextual ACCIÓN.
11. Probar con conexión desactivada después de instalar la PWA; los SVG siguen cargando offline.
12. Revisar modo oscuro del sistema, tamaño de letra aumentado, zonas seguras y accesibilidad de botones.
13. Repetir en taller de Lía, hogar de Mara, árboles y vetas. La UI debe ser igual de clara en todos.
14. Registrar captura y vídeo para valorar el siguiente salto artístico del mapa, edificios y personajes.

**Importante:** esta lista sigue pendiente de pruebas manuales en hardware real. Los tests Node comprueban lógica y estructura, no sensaciones táctiles ni calidad gráfica perceptiva.

---


## Automatizadas

- \`node tests/validate.mjs\` — catálogo de 243 objetos y 240 recetas; referencias y caché offline.
- \`node tests/adventure.mjs\` — rutas, recolección, árbol, agua, casas y herramientas.
- \`node tests/metallurgy.mjs\` — estaciones accesibles, piedra, menas, preparación, horno, aleaciones, forja, herramientas, costes, tiempos y persistencia del calor.
- GitHub Actions añade comprobaciones de sintaxis de los módulos principales.

## Pruebas manuales pendientes en iPhone y Android

1. Abrir una partida anterior. Revisar inventario, puente, dinero, herramientas y progreso. Ningún recurso antiguo debe perderse.
2. Localizar la **mesa de cantería** cerca de la aldea. Comprobar que impide atravesarla y se puede tocar desde sus lados.
3. Entrar en **Tallar piedra**: completar una transformación 2 piedras → piedra tallada. Con martillo de piedra, comprobar que consume solo una piedra y un uso.
4. Montar un **pico de piedra** con mango, piedra tallada y cuerda. Confirmar 10/10 usos.
5. Picar la veta de hierro: obtener 2 minerales. Prepararlos en la cantería para lograr un mineral de hierro preparado.
6. Abrir el **horno/forja del valle** sin cruzar el puente. Comprobar menús separados de Combustible, Fundición y Forja.
7. Alimentarlo con madera tosca, madera normal, carbón vegetal y carbón mineral; comprobar sus aportes 3/5/7/12 y la capacidad máxima 24.
8. Intentar fundir hierro con menos de 8 unidades de calor: mostrar requisito, no consumir mineral.
9. Fundir mineral preparado: verificar barra de trabajo, 1 lingote obtenido y 8 calor descontados al completar.
10. Forjar un martillo de hierro con mango, lingote y martillo de piedra. Confirmar que el martillo de piedra solo pierde un uso.
11. Fabricar hacha y pico de hierro: 100 usos por herramienta y 1 uso del martillo de hierro por proceso.
12. Extraer cuarzo, oro o plata con pico de hierro. Comprobar que un pico de piedra no permite extraerlos.
13. Preparar y fundir cobre y estaño, crear bronce. Repetir con hierro y carbón para hacer acero.
14. Interrumpir cualquier trabajo moviéndote: no debe entregar resultado ni consumir calor o materiales.
15. Salir del juego y reabrir: comprobar que el horno conserva calor, las herramientas conservan desgaste y que no se duplica ningún recurso.
16. Repetir en vertical y horizontal; comprobar botones, barras de trabajo, FPS y claridad de los requisitos.
17. Probar actualización desde la pantalla de inicio en iPhone y ejecución sin conexión, sin borrar datos.
18. Comprobar que las recetas antiguas del laboratorio siguen funcionando; la unificación de ambos sistemas de fundición física aún no está completada.

**Estado:** estas son verificaciones manuales propuestas, no resultados ya observados en un móvil real. No afirmar que se superaron hasta recoger evidencia.

---


## Automatizadas
- `node tests/validate.mjs`: datos, relaciones, alcanzabilidad y caché offline.
- `node tests/adventure.mjs`: caminos, puente, obstáculos, dos tipos de árboles, madera tosca, agua con cuenco, minería y actividades de casas.

## Comprobación manual esencial en móvil
1. Pasea entre árboles: todos deben ser interactivos; no atravesar el tronco mientras está presente.
2. Pino y roble deben ser visualmente distintos. Con hacha, madera normal; a golpes, madera tosca; robles con resina adicional al cortar.
3. Comprueba que obtener cada recurso exige tiempo y completar la barra; caminar no entrega materiales.
4. Construye un cuenco y recoge agua del río. Debe poder reutilizarse; sin cuenco debe explicar el requisito.
5. Pica piedra de zonas habilitadas. Extrae cobre/hierro con pico normal y cuarzo/plata/oro con pico de hierro.
6. Toca la casa de Mara, entra, camina por el interior, usa cama, despensa y hogar, y sal por la puerta.
7. Entra al taller de Lía, transforma 2 maderas toscas en 1 madera, abre el crafteo y repara una herramienta desgastada.
8. Guarda y recarga desde el interior. Verifica que posición y escena se recuperan; salir devuelve a la ubicación exterior.
9. Comprueba que la pantalla de World, Crear, Archivo, Retos y Tienda siguen funcionando y mantienen inventario y monedas.
10. Comprueba que la misión del puente se completa y que Lía solo entrega la recompensa una vez.
11. Prueba tamaños de los botones, selección táctil de estaciones, FPS, batería, vertical/horizontal y uso sin conexión.
12. Comprueba actualización de PWA desde la versión anterior sin limpiar el progreso.

**Pendiente:** estas pruebas de interacción en dispositivos físicos no están automatizadas. No se debe afirmar que ya se han superado en iPhone.

---

# Pruebas de CRAFTERRA 0.4.0

## Automatizadas
```sh
node tests/validate.mjs
node tests/adventure.mjs
```
- Catálogo, referencias, alcance y coherencia de la PWA.
- Camino al río bloqueado sin puente y permitido tras repararlo.
- Obstáculos físicos: árboles y rocas; plantas recogibles transitables.
- Recolección explícita: no se otorga botín hasta completar la acción.
- Herramientas: 10 usos piedra, 100 usos hierro; reutilización y rotura.
- Guardado de la durabilidad, cambio a herramienta inferior y recolección a mano.
- Regeneración temporizada de recursos.

## Matriz manual en Safari iPhone y Chrome Android
1. Abrir una partida de 0.3.1 y comprobar que conserva sus objetos, monedas y puente.
2. Tocar un árbol talable marcado: caminar hasta él, comenzar la tala y observar la barra. No recoger al pasar junto a un árbol.
3. Tocar un árbol decorativo: el personaje no debe atravesar su tronco ni entregar madera.
4. Tocar una roca; comprobar tiempo a mano y con pico.
5. Fabricar hacha de piedra; cortar 9 veces sin que desaparezca; en el uso 10 debe romperse.
6. Fabricar hacha o pico de hierro, usar varias veces y comprobar usos persistentes después de cerrar y abrir.
7. Abrir Taller, fabricar tablones varias veces con la misma hacha (hasta agotar los usos disponibles).
8. Moverse tocando diferentes destinos mientras camina; comprobar ausencia de saltos y animación de pies y brazos.
9. Mantener pulsada cada dirección de la cruceta; comprobar movimiento continuo, bloqueo de obstáculos y soltado inmediato.
10. Caminar con NPC próximos; comprobar que se mueven suavemente, dejan hablar y no desaparecen.
11. Interrumpir la recogida saliendo del mapa: no debe obtenerse el recurso hasta completar la tarea.
12. Completar puente y conversación con Lía sin duplicación de recompensa tras recargar.
13. Ejecutar con y sin conexión; comprobar service worker, caché y cambios de versión.
14. Probar vertical y horizontal; comprobar que botones y barra de progreso son visibles y cómodos.
15. Probar exportar/importar guardado y restauración de desgastes.

Estas pruebas manuales **aún están pendientes** de confirmación por dispositivo.
