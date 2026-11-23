# CRAFTERRA RPG isométrico · plan de evolución

## Filosofía
Explorar → descubrir una necesidad → aprender una receta → fabricar → transformar físicamente el mundo → avanzar en la historia.

## Base funcional (0.3.1)
- Primera región isométrica: aldea, río, bosque y caminos.
- Protagonista pixel art procedural, cámara, movimiento táctil y teclado.
- Tres NPC con diálogos, recolección de recursos y misión de reparación.
- Estado de aventura guardado junto al inventario, descubrimientos y progreso tradicional.
- Pruebas de rutas y de catálogo ejecutadas en GitHub Actions.
- Publicación desde la rama main mediante GitHub Pages.

## Próximas fases
1. **Probar en iPhone real**: arranque desde una partida antigua, movimiento, colisiones, interfaz horizontal/vertical, FPS, modo sin conexión, guardado y regreso del taller.
2. **Arte definitivo**: protagonista y NPC con animaciones de cuatro u ocho direcciones, y tiles isométricos coherentes para terrenos, árboles, edificaciones y agua.
3. **Misiones declarativas**: estados de misión, objetivos, desencadenantes, diálogos y recompensas sin lógica dispersa en el renderizador.
4. **Construcciones persistentes**: colocar estaciones, restaurar edificios y cambiar elementos del mapa con inventario y recetas.
5. **Exploración ampliada**: regiones conectadas, biomas, habitantes con horarios y actividades, recursos y puntos de interés.
6. **Progresión de la historia**: adaptar las siete eras a siete capítulos de la civilización perdida.
7. **Pulido y distribución**: accesibilidad, rendimiento, balance, restauración de guardados y lanzamiento multiplataforma.

## Restricciones de ingeniería
- No borrar ni reiniciar partidas del modo de crafteo existente.
- Conservar el sistema de recetas y separar estado/reglas del renderizador.
- Mantener el sitio estático y desplegable por GitHub Pages.
- No introducir monetización obligatoria para avanzar en la historia.
- El Valle del Origen es un prototipo del nuevo bucle, no todavía un RPG de mundo abierto completo.
