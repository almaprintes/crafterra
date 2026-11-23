# CRAFTERRA v0.3.1 — Primera aventura isométrica

**De una piedra a las estrellas.** PWA offline de exploración, descubrimiento, crafteo y evolución tecnológica.

## Novedad: Valle del Origen (prototipo jugable)
- La pantalla **Mundo** abre un valle isométrico con protagonista pixel art, cámara de seguimiento, movimiento táctil (tocar destino o flechas) y teclado.
- Tres habitantes: Mara, Taro y Lía, con diálogos e hilo argumental.
- Recursos físicos recogibles: madera, piedra y fibra vegetal. Los nodos vuelven a estar disponibles después de 5 minutos.
- **Misión El puente roto:** habla con Mara, fabrica **2 tablones + 1 cuerda** en el Taller, vuelve al puente y repáralo para atravesar el río. Después encuentra a Lía.
- El mundo comparte inventario y guardado con el crafteo existente. Persiste ubicación, materiales, diálogo y reparaciones.
- Esta primera aventura aún no incluye IA de movimiento de NPC, combates, grandes regiones ni sprites definitivos.

## Crafteo heredado
El catálogo jugable contiene **237 objetos, 233 recetas explícitas**, 21 colecciones, 28 misiones tradicionales, 15 puzles, 25 logros y 10 estaciones. Mantiene maestría, fabricación directa, expediciones, libro de recetas y recompensas.

## Publicación
El sitio es estático: publicar la raíz de `main` con GitHub Pages. No necesita npm ni compilación. Instalar como PWA en iPhone desde Safari. Los módulos y el service worker necesitan HTTP(S), no `file://`.

## Pruebas
- `node tests/validate.mjs`
- `node tests/adventure.mjs`
- GitHub Actions: `.github/workflows/validate-crafterra.yml`

Las pruebas automáticas **no sustituyen la prueba manual de controles, animación, rendimiento y guardado en Safari/iPhone**.

## Arquitectura
- `js/adventure-world.js`: motor Canvas isométrico, ruta, personaje, NPC, diálogos, recursos y primera misión.
- `css/adventure-world.css`: vista móvil, HUD, controles y diálogos.
- `js/data.js`: catálogo y recetas.
- `js/engine.js`: crafting y progresión.
- `js/db.js`: IndexedDB con respaldo local.
- `js/app.js`: integración de aventura, crafting e interfaz.
- `sw.js`: caché offline.

La tienda y `RewardedAdsProvider` continúan en modo DEVELOPMENT: no hay pagos ni anuncios comerciales configurados. Consulta [TESTING.md](TESTING.md), [COMMERCIAL_CHECKLIST.md](COMMERCIAL_CHECKLIST.md) y [ADVENTURE_ROADMAP.md](ADVENTURE_ROADMAP.md).
