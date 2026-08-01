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
