# CRAFTERRA 0.8.0 — Interfaz ilustrada y trabajo activo

## Experiencia móvil más cercana a un juego

- **Tarjetas de acción con imágenes SVG ilustradas**, dibujadas para el juego y listas para funcionar sin conexión. Hachas, picos, martillos, madera, piedra, metales, fuego, cuencos, puertas y otras acciones tienen pictogramas con volumen, luces y textura.
- **Menú contextual estilo juego**: sustituye las ventanas de párrafos y botones de texto por un panel inferior compacto y tarjetas visuales con título corto y requisito/coste secundario.
- **Más terreno visible**: cabecera de la era comprimida, mapa más alto y HUD translúcido con recursos y durabilidad en pequeños iconos.
- **Acciones con animación en el mundo**: barra y anillo de trabajo, herramienta oscilante, impactos, destellos y partículas al cortar, picar, tallar y forjar.
- **Participación táctil real**: durante un trabajo puedes pulsar **¡GOLPEA!** para acelerar el proceso en pequeños incrementos (limitados para evitar abuso). Si te apartas, la acción se cancela y no entrega recursos ni descuenta materiales.
- **Pensado para Safari iPhone y Android**: iconos SVG sin librerías externas; botones táctiles grandes, panel desplazable y soporte vertical/horizontal. No se modifican las partidas guardadas ni el catálogo de 243 objetos y 240 recetas.

## Comprobación
\`node tests/adventure-ui.mjs\` valida que las imágenes se generan offline, que cada SVG tiene gradientes independientes y que la interacción no pierde las reglas de extracción/fabricación. Se conserva la batería de pruebas anterior.

**Pendiente:** verificar acabado y comodidad táctil en un teléfono real y seguir evolucionando el arte de los personajes, casas, mapas y animaciones, que todavía no tiene el nivel final de producción.

---

## CRAFTERRA 0.7.0 — De la piedra a los metales

PWA móvil de exploración isométrica con recursos interactivos, talleres, inventario y progreso guardado. Publicación directa desde \`main\` mediante GitHub Pages.

## Primer circuito completo de metalurgia

- **Mesa de cantería:** talla piedra, monta hacha y pico de piedra de 10 usos, y prepara mineral de hierro, cobre, estaño, plata u oro.
- **Vetas concretas:** el pico de piedra extrae minerales básicos; el pico de hierro permite extraer los más difíciles. Recogerlos exige completar el trabajo.
- **Horno y forja del valle:** añade madera o carbón para generar calor, funde el mineral preparado, crea bronce y acero y fabrica martillos, hachas y picos de hierro.
- **Herramientas reutilizables:** las de hierro duran 100 usos; la forja consume lingote, mango, calor y un uso del martillo correspondiente.
- **Acceso inmediato al sistema:** ambas instalaciones públicas están en el lado inicial del río. Tienen colisiones y acciones reales; no son decorado.
- **Interfaz:** menús organizados por tallado, mineral, combustible, fundición y herramientas, con requisitos visibles. Procesos temporizados y resultados solo tras terminar.
- **Guardado:** los nuevos materiales, los usos de herramientas y el calor almacenado persisten con los datos del jugador.

**Secuencia de juego:** recoger piedra → obtener piedra tallada y mango → fabricar pico de piedra → extraer hierro de una veta → preparar mineral → alimentar horno → fundir hierro → forjar martillo de hierro → forjar pico o hacha de hierro.

**Catálogo actual:** 243 objetos, 240 recetas de descubrimiento. Las recetas antiguas siguen disponibles por compatibilidad, aunque la metalurgia física del valle exige combustible y etapas de transformación.

## Verificaciones y reglas

- \`node tests/validate.mjs\` — integridad del catálogo y PWA.
- \`node tests/adventure.mjs\` — mundo, recolección, durabilidad, agua, árboles y casas.
- \`node tests/metallurgy.mjs\` — progresión física desde piedra hasta hierro, aleaciones, combustible y guardado.
- [RESOURCE_ECONOMY.md](RESOURCE_ECONOMY.md) — referencia de costes, usos de materiales y decisiones pendientes.
- [TESTING.md](TESTING.md) — pruebas manuales pendientes para Safari iPhone y Android.

---

## Sistemas ya incluidos desde versiones anteriores

**De una piedra a las estrellas.** Aventura isométrica PWA, con progreso y fabricación integrados.

## Interacciones reales del Valle del Origen
- **Sin árboles decorativos:** todos los árboles presentes en el mapa son interactivos. Pinos y robles tienen apariencia y rendimiento diferentes.
- **Dos calidades de madera:** el hacha obtiene madera normal, golpear un tronco a mano obtiene **madera tosca**. En el taller de Lía se transforman dos maderas toscas en una madera normal. Los robles dan también resina al cortarlos.
- **Río:** tocando el agua y acercándote a la orilla, el cuenco de madera o arcilla permite recoger agua. El cuenco se conserva; sin él no se puede llenar.
- **Piedra y minerales:** solo se extraen de las rocas y vetas concretas, con acción temporizada. Hierro, cobre, estaño y carbón requieren pico; cuarzo, plata y oro requieren uno de hierro.
- **Casas transitables:** casa de Mara (cama, despensa diaria, cocina) y taller de Lía (mesa de crafteo, tratamiento de madera y reparación de herramientas), cada una con su propia vista interior, movimiento y puerta de salida.
- **Personajes, puente y recursos:** todos tienen interacción. La vegetación baja aporta fibras; no se recogen materiales automáticamente por caminar junto a ellos.
- **Herramientas persistentes:** piedra 10 usos, hierro 100; la herramienta se desgasta al terminar el trabajo y puede reutilizarse.
- **Guardado:** posición exterior e interior, recursos agotados, avance del puente, inventario y durabilidad se mantienen con el sistema anterior.

El inventario suma **243 objetos** (incluida la madera tosca, obtenida en el mundo) y conserva las **240 recetas** anteriores, sin alterar sus identificadores. La nueva pieza se puede refinar en el taller de la inventora.

## Estado
Esta es la **primera región prototipo**, no un mundo abierto completo. El siguiente paso es validar la experiencia en Safari de iPhone y perfeccionar gráficos, interiores, movimiento e historia. No se añaden servicios externos ni pagos; la web se publica desde main en GitHub Pages.

## Pruebas
`node tests/validate.mjs` valida datos y caché; `node tests/adventure.mjs` valida rutas, recolección, herramientas, agua, minerales e instalaciones interiores. El flujo `Crafterra - validar main` en GitHub Actions ejecuta ambas pruebas.

---

## Información histórica del proyecto

PWA de exploración isométrica, descubrimiento y fabricación. De una piedra a las estrellas.

## Cambios 0.4.0
- **Movimiento**: protagonista pixel art con brazos y piernas animados al caminar; habitantes que pasean sin teletransportarse.
- **Colisiones**: los árboles y rocas son obstáculos; el jugador camina hasta una posición cercana antes de interactuar. Las plantas bajas pueden atravesarse.
- **Recolección intencionada**: tocar un recurso o pulsar Interactuar inicia una tarea temporizada con barra de progreso, no una recompensa instantánea al pasar por encima. Los árboles talables presentan una marca dorada; los decorativos no dan madera.
- **Herramientas**: hacha/pico de piedra 10 usos; hacha/pico de hierro 100 usos. También desgaste para cuchillo de pedernal (10), martillo de piedra (10), martillo de hierro, sierra y pala (100). Se emplean varias veces en el taller y en la exploración. Los usos restantes se guardan junto a la partida.
- **Acceso sin herramienta**: tala a mano (6 s), minería a mano (7,5 s), fibras a mano (2,1 s). Las herramientas reducen el tiempo. Se desgastan al completar una acción, no por caminar.
- **Interfaz**: cruceta en disposición de rombo, botones táctiles mayores, indicadores de inventario y herramientas, guía de misión y progreso de recolección.
- **Preservación**: sigue activo el inventario y guardado local de versiones anteriores.

## Primera misión
Habla con Mara, recoge madera, piedra y fibras, fabrica **dos tablones y una cuerda** y repara el puente. Cruza y habla con Lía. El taller original sigue en la pestaña Crear.

## Proyecto anterior conservado
La base heredada cuenta con 237 objetos, 233 recetas explícitas, enciclopedia, estaciones, expediciones, logros y fabricación directa.

## Código
- `js/adventure-world.js` — mundo Canvas isométrico, personajes, ruta, colisiones, acciones y NPC.
- `js/adventure-rules.js` — recolección, tiempos, elección de herramientas, desgaste y persistencia por unidad.
- `js/app.js` — integración con taller, inventario y UI.
- `js/engine.js` — estado inicial, migración, crafting y progreso.
- `css/adventure-world.css` — controles e interfaz.
- `sw.js` — PWA sin conexión.

## Comprobación automática
```sh
node tests/validate.mjs
node tests/adventure.mjs
```
GitHub Actions valida el estado de `main`. Las pruebas de lógica no sustituyen una sesión real en Safari/iPhone para medir FPS, respuesta táctil, tamaño de controles y comportamiento al volver de otras pantallas.

La aplicación continúa siendo estática, sin compilación ni dependencia de servicios externos. Se publica en GitHub Pages desde `main`. Los proveedores de tienda/anuncios siguen en DEVELOPMENT; no hay pagos reales.

Consulta [ADVENTURE_ROADMAP.md](ADVENTURE_ROADMAP.md), [TESTING.md](TESTING.md) y [COMMERCIAL_CHECKLIST.md](COMMERCIAL_CHECKLIST.md).
