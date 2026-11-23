# CRAFTERRA · Reglas de recursos, combustible y transformación

**Versión de reglas 0.7 · 23 noviembre 2026.** Este documento es la referencia para añadir recursos y recetas al RPG. Se distingue entre lo **implementado** y lo **pendiente de diseño**.

## Regla principal

Cualquier recurso que aparece en el mapa debe poder recogerse, transformarse, utilizarse, venderse o tener un papel en una misión. No hay decoraciones sin interacción. La recolección ocurre al completar una acción voluntaria, nunca por caminar junto al objeto. Los objetos no se consumen por mera presencia: se consumen por un proceso explícito.

## Cuatro categorías distintas

1. **Recurso de mundo:** aparece en una ubicación, tiene método de obtención, tiempo, regeneración y cantidad. Ejemplos: árbol, veta, río, fibras.
2. **Material de inventario:** resultado de recoger o extraer algo. Puede ser bruto (madera tosca) o preparado (madera).
3. **Herramienta:** equipo reutilizable con desgaste, como hacha, pico o sierra. Piedra: 10 usos; hierro: 100 usos en la versión actual.
4. **Estación/instalación:** lugar u objeto reutilizable. Hoguera, mesa y banco de trabajo no desaparecen por utilizarlos. Algunas operaciones consumen combustible o material **pero no la estación**.

## Árboles y madera: IMPLEMENTADO

| Origen / método | Resultado | Observaciones |
|---|---|---|
| Golpear un pino a mano | 2 maderas toscas | Tarda más. No hace falta hacha |
| Golpear un roble a mano | 1 madera tosca | Tarda más |
| Talar un pino con hacha | 2 maderas | 1 uso del hacha |
| Talar un roble con hacha | 3 maderas + 1 resina | 1 uso del hacha |
| Taller: 2 maderas toscas juntas | 1 madera | Nueva receta general r234, sin herramienta |
| Taller: madera tosca + sierra | 1 madera | Nueva receta r235, 1 uso de sierra |
| Banco de Lía: preparar a mano 2 toscas | 1 madera | Alternativa física al laboratorio |
| Banco de Lía: aserrar 1 tosca con sierra | 1 madera | Mejor aprovechamiento, 1 uso |
| 1 madera + hacha de piedra | 1 tablón | Receta preexistente r41; el hacha se desgasta |

**Por qué dos calidades:** la madera tosca es fácil de obtener sin herramientas, pero tiene peor rendimiento al construir. Sirve como combustible de emergencia o puede trabajarse para obtener el material de calidad necesario para recetas y construcciones. La madera normal también se puede quemar, pero generalmente conviene reservarla.

Pino y roble son **especies de árbol**, no nuevos ítems de madera: la calidad depende de cómo se extrae. No crear «madera de pino», «madera de roble», «tabla de roble» por defecto sin una necesidad jugable concreta.

## Hogueras y energía: IMPLEMENTADO en estaciones del mundo

| Combustible que se consume | Calor producido |
|---|---:|
| 1 madera tosca | +3 |
| 1 madera normal | +5 |
| 1 carbón vegetal | +7 |
| 1 carbón mineral | +12 |

- La hoguera admite **24 unidades de calor**. No se permite malgastar combustible si desbordaría su capacidad.
- **Cocinar carne o pescado cuesta 2 de calor** y consume 1 unidad de alimento crudo.
- **Fabricar carbón vegetal cuesta 3 de calor + 1 madera** y produce 1 carbón vegetal.
- Las hogueras no desaparecen por funcionar. Se apaga visualmente cuando no queda calor. El calor no disminuye automáticamente con el reloj: el ritmo de consumo se asocia a acciones para favorecer las partidas cortas.
- **Dos depósitos independientes de calor:** hogar de Mara y hoguera exterior del valle. Su estado se guarda.
- La carbonización no crea calor gratuito: gastar 1 madera en producir carbón cuesta 3 de calor; el carbón obtenido proporciona 7, frente a los 5 que daba esa madera sin transformar.
- Las recetas originales del laboratorio permanecen para no romper partidas. Su integración con los costes físicos de calor en todas las ramas del árbol tecnológico es una **tarea posterior**.

## Piedra y metalurgia: IMPLEMENTADO en el mundo 0.7

Hay dos instalaciones públicas accesibles antes de cruzar el río: **mesa de cantería** y **horno/forja del valle**. Son objetos sólidos e interactivos. La extracción de minerales requiere acercarse a una veta concreta; la barra de progreso se completa antes de entregar recursos.

### Piedra y herramientas iniciales

| Proceso | Materiales consumidos | Resultado |
|---|---|---|
| Tallado básico | 2 piedras, 3,5 segundos | 1 piedra tallada |
| Tallado con martillo | 1 piedra + 1 uso de martillo de piedra, 1,3 s | 1 piedra tallada |
| Pico de piedra | 1 mango + 1 piedra tallada + 1 cuerda, 1,9 s | Pico de 10 usos |
| Hacha de piedra | 1 mango + 1 piedra tallada + 1 cuerda, 1,9 s | Hacha de 10 usos |

La receta de **mango** sigue siendo madera + piedra tallada. La del primer martillo de piedra sigue siendo mango + piedra. Esto proporciona una progresión continua sin tener que inventar una materia prima nueva.

### Preparar las menas

Hierro, cobre, estaño, plata y oro se extraen de vetas con el pico adecuado. En la cantería se combinan **2 unidades de la mena → 1 unidad preparada** (2,3–2,6 s). Cada mena preparada existe en el catálogo y tiene también su receta de descubrimiento (r236–r240). El carbón mineral se extrae de una veta y se usa directamente como combustible.

### Fundir y fabricar aleaciones

El horno almacena hasta **24 unidades de calor**, persistentes entre partidas e independientes de los otros fuegos. Acepta madera tosca (+3), madera normal (+5), carbón vegetal (+7) y carbón mineral (+12).

| Operación | Consume | Calor | Tiempo |
|---|---|---:|---:|
| Hierro | 1 hierro preparado | 8 | 4 s |
| Cobre | 1 cobre preparado | 6 | 3,4 s |
| Estaño | 1 estaño preparado | 6 | 3,4 s |
| Plata | 1 plata preparada | 10 | 4,3 s |
| Oro | 1 oro preparado | 10 | 4,3 s |
| Bronce | 1 lingote cobre + 1 lingote estaño | 7 | 3,4 s |
| Acero | 1 lingote hierro + 1 carbón mineral | 9 | 3,9 s |

### Forja y herramientas de hierro

| Producto | Ingredientes | Herramienta reutilizada | Calor |
|---|---|---|---:|
| Martillo de hierro | 1 lingote hierro + 1 mango | Martillo de piedra, pierde 1 uso | 4 |
| Hacha de hierro | 1 lingote hierro + 1 mango | Martillo de hierro, pierde 1 uso | 4 |
| Pico de hierro | 1 lingote hierro + 1 mango | Martillo de hierro, pierde 1 uso | 4 |

Cada forja tarda 3,3 s. Las herramientas metálicas comienzan con 100 usos. El pico de hierro permite extraer cuarzo, plata y oro.

**Regla de integridad:** se validan ingredientes, calor y herramienta al iniciar y completar la acción; hasta terminar el trabajo no se consume material ni se entrega producto. Las herramientas pierden un uso, pero no desaparecen tras una sola receta. La estación tampoco se consume.

**Límite actual:** el laboratorio mantiene recetas heredadas como mineral + hoguera → lingote, aunque el proceso físico del valle exige mena preparada y horno con combustible. Se conservan por compatibilidad. Unificar ambos sistemas sin bloquear las partidas antiguas sigue siendo una fase posterior. Las unidades de calor son abstracciones de juego, no temperaturas reales.

## Reglas base del resto de materiales

| Familia | Obtener | Transformación / propósito |
|---|---|---|
| Piedra | Picar zonas rocosas | Piedra tallada, herramientas, casas y puentes |
| Fibra vegetal | Arrancar plantas | Cuerda, tejido, elementos de construcción |
| Agua | Recoger del río con cuenco | Cocina, preparación de materiales y experimentos |
| Hierro, cobre, estaño | Extraer vetas con pico | Refinar a lingotes, aleaciones, herramientas |
| Cuarzo, plata, oro | Vetas de mineral difícil | Requieren pico de hierro |
| Resina | Talar roble | Antorchas, adhesivos y otras recetas heredadas |
| Carbón vegetal | Carbonizar madera en instalación | Combustible concentrado y fabricación |
| Carbón mineral | Picar veta de carbón | Calor de mayor densidad y producción de acero en el horno |

Estos materiales disponen ya de una primera cadena física de procesamiento. El catálogo contiene **243 objetos y 240 recetas de descubrimiento**; siguen pendientes el transporte, la colocación libre de instalaciones y otros procesos industriales.

## Cómo se añade cualquier material nuevo: norma de diseño

Antes de dibujarlo, registrar los siguientes campos:
- **Dónde aparece:** bioma, mapa, interior o evento.
- **Qué permite hacer:** pulsar, cortar, picar, extraer, llenar, reparar, cocinar, etc.
- **Qué hace falta:** herramienta, recipiente, conocimiento y acceso.
- **Cuánto tarda:** tiempo básico y ventajas por tecnología.
- **Qué se consume:** ingrediente, combustible, tiempo, usos de herramienta.
- **Qué produce:** resultados y cantidades concretas.
- **Qué estación necesita:** ninguna, mesa de trabajo, hoguera, horno, fundición.
- **Qué ocurre después:** regeneración, transformación del mundo, experiencia y misión.

No multiplicar recursos o recetas solo por aumentar el contador de la enciclopedia. Cada uno debe abrir una posibilidad jugable.

## Mapa de implementación

- Catálogo/recetas de descubrimiento: \`js/data.js\`
- Extracción, árboles, minerales, interiores: \`js/world-actions.js\`
- Desgaste de herramientas: \`js/adventure-rules.js\`
- **Procesamiento, combustibles y roles del material:** \`js/material-economy.js\`
- Presentación e interacciones: \`js/adventure-world.js\`
- Integración del laboratorio y objetos reutilizables: \`js/app.js\`
- Validación: \`tests/validate.mjs\`, \`tests/adventure.mjs\`

## Pendiente deliberadamente

1. Unificar el coste físico del calor con todas las recetas antiguas que usan hoguera y horno, sin bloquear jugadores existentes.
2. Construir y colocar la propia hoguera en un punto del mapa, en lugar de depender solo de la hoguera comunitaria.
3. Permitir construir y colocar hornos, mesas de cantería y forjas personales; ahora son instalaciones comunitarias.
4. Definir recipientes de distintas capacidades, agua potable, líquidos y transporte de materiales.
5. Hacer que camas, alimentación y energía tengan consecuencias jugables proporcionadas, sin convertir Crafterra en un simulador de hambre.
6. Introducir tablas de rendimiento por herramienta, especie y tipo de veta, y comprobarlas con simulaciones antes de equilibrarlas.
