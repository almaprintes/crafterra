# CRAFTERRA 0.5.1 · Batería de pruebas

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
