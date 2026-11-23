# CRAFTERRA 0.4.0 · El Valle del Origen

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
