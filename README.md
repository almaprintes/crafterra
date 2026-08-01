# CRAFTERRA v0.1.0

**De una piedra a las estrellas.** Juego móvil de crafting, descubrimiento, colección y evolución tecnológica. Es una PWA sin dependencias, npm, compilación, servicios remotos ni telemetría.

## Publicación en GitHub Pages

1. Descomprime el ZIP en la raíz del repositorio.
2. En GitHub, abre **Settings → Pages** y publica la rama y carpeta raíz elegidas.
3. Abre la URL generada. Las rutas relativas permiten publicar en una subcarpeta.

También puede probarse con cualquier servidor estático local. No debe abrirse con `file://`, porque los módulos y el service worker requieren HTTP(S).

## Juego

- En **Crear**, toca objetos para ponerlos en la mesa y arrastra una pieza sobre otra.
- Los cinco recursos naturales y cuatro conceptos iniciales son reutilizables.
- Los hallazgos alimentan misiones, 12 colecciones, 15 puzles, 25 logros y el mundo persistente.
- El archivo ofrece fichas, filtros y recetas parcialmente ocultas.
- El desafío diario es determinista según la fecha local.

Incluye 95 objetos, 104 recetas data-driven, 12 estaciones y siete eras, con contenido jugable desde Naturaleza hasta Espacio. La economía está centralizada en `js/config.js`.

## Arquitectura

- `js/data.js`: objetos, recetas y metacontenido.
- `js/engine.js`: reglas puras de crafting y progresión.
- `js/db.js`: IndexedDB v2 y migraciones.
- `js/providers.js`: `RewardedAdsProvider` y `StoreProvider` en DEVELOPMENT.
- `tools/recipe-editor.html`: editor offline, validación de conflictos, alcanzabilidad y balance.
- `sw.js`: caché offline con ámbito relativo.

Los proveedores comerciales nunca representan operaciones reales. Para producción, implemente las interfaces de `js/providers.js`, mantenga la devolución explícita de errores y conecte únicamente SDK e identificadores propios verificados.

## Accesibilidad y privacidad

La interfaz admite teclado en navegación y botones, reduce movimiento según el sistema, usa objetivos táctiles amplios y no depende del color para el estado. El juego guarda solamente datos locales y funciona sin conexión.

Consulta [TESTING.md](TESTING.md), [PRIVACY.md](PRIVACY.md) y [COMMERCIAL_CHECKLIST.md](COMMERCIAL_CHECKLIST.md).
