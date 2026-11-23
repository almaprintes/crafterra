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
