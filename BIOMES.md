# CRAFTERRA 0.9 · Ecología, biomas, cuevas y fauna

## Principio

**El bioma determina qué existe en cada casilla.** Un árbol, animal, planta o yacimiento que aparezca debe poder tener una interacción real. Las texturas del suelo son superficie del terreno, no adornos que se puedan recoger. La comprobación del bioma se efectúa también al ejecutar una recolección: una mena colocada por error en una pradera no podrá extraerse.

## Biomas del Valle del Origen

| Bioma | Qué encontrar | Qué no aparece |
|---|---|---|
| **Praderas** | Árboles dispersos (pino/roble), fibras, bayas, hierbas, ovejas, conejos | Vetas minerales y grandes bloques para minar |
| **Bosque** | Árboles más abundantes, fibras, setas, hierbas, ciervos | Yacimientos mineros |
| **Sierra rocosa** | Roca, hierro, cobre, estaño, carbón, cuarzo, plata y oro | Ovejas, conejos, árboles de pradera |
| **Cuevas** | Galerías de piedra y minerales; más vetas de hierro, cobre, estaño, carbón, cuarzo, plata y oro | Árboles y fauna de pradera |

La aldea comienza en **pradera**. Las primeras rocas y hierro están en la sierra occidental, **accesible antes del puente**; no existe bloqueo circular de progresión. Al otro lado del río están otras montañas y la gruta oriental. Se preserva la ruta original de Mara, el puente y Lía.

### Dos cuevas transitables

- **Cueva de la sierra**, acceso en la montaña occidental: piedra, hierro, cobre y carbón.
- **Gruta de los cristales**, acceso en las rocas orientales: piedra, estaño, cuarzo, plata y oro.

Cada entrada abre una escena interior propia con suelo rocoso, vetas sólidas, salida interactiva, desplazamiento, recolección temporizada y conservación de la posición al guardar. Las menas extraídas comparten la lógica de herramientas/durabilidad y el tiempo de regeneración (5 minutos) con las de la superficie. El pico de hierro sigue siendo necesario para minerales difíciles como cuarzo, plata y oro.

### Fauna y actividades del campo

| Animal | Hábitat | Acción | Producción | Herramientas |
|---|---|---|---|---|
| **Oveja** | Pradera | Recoger lana suelta | 1 lana | A mano, más lento |
| Oveja | Pradera | Cortar lana | 2 lanas | Cuchillo de pedernal, pierde 1 uso |
| Oveja | Pradera | Esquilar | 3 lanas | Tijeras de esquilar, pierden 1 uso |
| **Conejo** | Pradera | Capturar | 1 carne + 1 piel cruda | A mano, lento |
| Conejo | Pradera | Cazar | 1 carne + 1 piel cruda | Lanza o arco con flechas |
| **Ciervo** | Bosque | Cazar | 3 carnes + 2 pieles crudas + 1 hueso | Lanza o arco con flechas |

- Ovejas: **permanecen vivas y visibles después de esquilarlas**, con un vellón más fino. No pueden volver a proporcionar lana antes de regenerarla (5 min).
- Conejos y ciervos: tras una captura o caza, desaparecen de la zona y regresan como nueva aparición después de 5 min. No se puede aprovechar la misma presa sin límite.
- Arco: requiere y **consume 1 flecha por caza**, además de perder 1 uso. Lanza de piedra: **10 usos**; lanza de hierro y arco: **100 usos**. Tijeras de esquilar: **100 usos**.
- La caza se presenta de forma no gráfica y sin gore. En esta versión, es una acción temporizada con animaciones e intervención del jugador, no un sistema avanzado de persecución o sigilo.

### Procesar materiales animales

1. Conseguir una **piel cruda** cazando o capturando.
2. En el taller de Lía, usar la nueva **curtiduría** con **1 piel cruda + 1 agua + 1 madera tosca**.
3. Tras 3,5 segundos, obtener **1 cuero**, válido para las recetas anteriores de ropa, accesorios y equipo.

La piel cruda es un recurso distinto del cuero. Las tijeras también se pueden fabricar en la forja comunitaria con un lingote de hierro, martillo de hierro y 4 unidades de calor; el martillo pierde 1 uso y permanece en el inventario. Se conserva la receta simplificada de descubrimiento Piel cruda + Agua → Cuero del laboratorio por compatibilidad con la enciclopedia.

### Reglas de diseño para el futuro

- Toda nueva veta debe declararse en terreno rocoso o interior de cueva, no en praderas.
- Toda planta o animal debe tener un bioma válido y, si es visible, una utilidad jugable.
- No mover recursos de una región a otra al azar: validar camino de acceso y progresión de herramientas antes de publicar.
- La lana procede de esquilar, no de convertir una oveja en botín de caza.
- La piel cruda exige un proceso antes de ser cuero útil en la economía física.
- Los animales y recursos no generan premios simplemente al pasar junto a ellos.
- Todos los cambios deben respetar inventario y avance de partidas anteriores.

## Implementación

- \`js/world-biomes.js\`: biomeAt, hábitats, animales, entradas y nodos de cueva.
- \`js/adventure-world.js\`: mapa visual, colisiones, escenas interiores, entradas y animación.
- \`js/world-actions.js\`: recolección, lana, caza, flechas y regeneración.
- \`js/adventure-rules.js\`: desgaste de tijeras, lanzas y arco.
- \`js/material-economy.js\`: curtiduría y forja de tijeras.
- \`tests/biomes.mjs\`: restricciones de recursos, rutas, caza, lana, cuero, persistencia y costes.

## Límites actuales

El mapa sigue siendo un primer valle de tamaño limitado (30 × 22 casillas) con dos cuevas interiores. Los animales tienen una animación ambiental sencilla; todavía falta un sistema de comportamiento de fauna que camine, huya o reaccione durante la caza. La versión incluye las interacciones y los productos, no una IA completa de ecosistemas ni múltiples regiones grandes.
