## v0.1.5
- Rehechos los iconos de inventario como recortes transparentes WebP de 96×96, sin textos ni bordes de captura.
- `object-fit: contain` para impedir recortes dentro de tarjetas.
- 110 objetos totales, con nueva familia de minerales, gemas y lingotes.
- 140 recetas y 15 colecciones.
- Caché PWA renovada para forzar la carga de los nuevos assets.

# CHANGELOG

## v0.1.3
- Sustituido el arranque ES Modules por un bundle JavaScript clásico compatible con Safari/iOS.
- Eliminada la causa del error `SyntaxError: Unexpected keyword 'export'`.
- Nueva caché PWA `crafterra-v0.1.3` y limpieza de versiones anteriores.
- Mantenido el modo de reparación de arranque.

# Historial de cambios

## 0.1.0 — 2026-08-01

- Lanzamiento inicial: 95 objetos, 104 recetas, 12 colecciones, 15 puzles, 20 misiones, 25 logros y 8 secretos.
- Mundo evolutivo, siete eras, doce estaciones, ciclo visual, enciclopedia y campaña.
- PWA offline, guardado IndexedDB v2, desafío y bonus diarios.
- Economía configurable, tienda y proveedores de anuncios/pagos en DEVELOPMENT.
- Editor offline de recetas con validación y análisis de balance.

## v0.1.1 - 2026-08-01
- Corregido bloqueo indefinido en la pantalla de inicio en Safari/iPhone cuando IndexedDB no responde, está bloqueado o tarda demasiado.
- Añadido guardado alternativo local y watchdog de arranque para que la interfaz siempre pueda abrir.
- Actualizada la caché PWA para forzar la sustitución de la build v0.1.0.

## v0.1.2
- Arranque endurecido para Safari/iOS.
- Migración segura de partidas incompletas.
- Autorreparación de Service Worker/cachés si el módulo principal no inicia.
- Recursos críticos versionados y navegación network-first.
