# CRAFTERRA v0.6.0 — Economía de materiales y combustible

## Nuevo: madera tosca y hogueras útiles
- **Receta básica:** 2 maderas toscas → 1 madera. Disponible en el laboratorio como combinación r234 y en el banco de carpintería de Lía.
- **Receta con herramienta:** madera tosca + sierra → 1 madera (r235). La sierra no desaparece; gasta 1 uso de sus 100.
- **Combustibles:** madera tosca +3 calor, madera +5, carbón vegetal +7, carbón mineral +12. La hoguera tiene una capacidad máxima de 24.
- **Procesos físicos:** cocinar carne o pescado cuesta 2 calor; carbonizar una madera cuesta 3 calor y produce 1 carbón vegetal.
- **Dos fuegos independientes:** hogar de Mara y hoguera comunitaria en el valle. Su combustible y calor se conservan al guardar.
- **Hoguera reutilizable:** en la aventura, cocinar consume calor y comida, nunca destruye el fuego o la instalación. En el laboratorio, las estaciones conocidas dejan de gastarse como ingredientes.
- Se conserva todo el catálogo anterior: **238 objetos y 235 recetas explícitas**, incluyendo las dos rutas nuevas.

**Reglas oficiales y balance:** [RESOURCE_ECONOMY.md](RESOURCE_ECONOMY.md). Allí están los usos de madera, piedra, fibras, agua, minerales, combustible y la lista de sistemas aún pendientes de convertir en instalaciones físicas.

**Comprobación:** \`node tests/validate.mjs\` y \`node tests/adventure.mjs\`. GitHub Actions también verifica la sintaxis de los motores.

---

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

El inventario suma **238 objetos** (incluida la madera tosca, obtenida en el mundo) y conserva las **233 recetas** anteriores, sin alterar sus identificadores. La nueva pieza se puede refinar en el taller de la inventora.

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
