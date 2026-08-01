# CRAF TERRA — Auditoría de catálogo base

Base reconstruida: **v0.1.7 + hotfix v0.1.8 + hotfix v0.1.9**.

## Estado técnico de la base

- Arranque: `index.html` carga `js/app.js` como módulo ES.
- Service Worker: caché `crafterra-v0.1.9`.
- Bundle antiguo `js/crafterra.bundle.js`: **eliminado de esta base auditada** porque ya no se usa y fue el origen de errores anteriores.
- Validación del proyecto antes de la auditoría: **OK**.
- Objetos actuales: **237**.
- Recetas actuales: **230**.
- Objetos alcanzables: **168**.
- Colecciones: **15**.
- Puzles: **15**.
- Misiones: **20**.
- Logros: **25**.
- Estaciones: **12**.

## Hallazgos del catálogo

1. **Cristal rojo (`redstone`) sigue presente** en el código, aunque fue descartado durante la definición visual. Debe eliminarse al reconstruir el catálogo definitivo.
2. Hay **1 nombre duplicado visible**: Madera. En concreto, `wood` y `timber` aparecen ambos como “Madera”.
3. Solo **160 de 237 objetos** tienen una ruta WebP asignada. Los otros **77** caen a emoji/glifo genérico.
4. Existen **164 WebP** en la carpeta actual; **4 no se usan** por el mapa de arte actual (`dark_ingot`, `fabric`, `ore`, `redstone`).
5. El catálogo actual contiene una mezcla de tres generaciones de diseño: prototipo inicial, ampliación automática y catálogo de la infografía. Por eso hay elementos redundantes o que ya no encajan con la biblia visual acordada.
6. El bloque final de recetas fuerza artificialmente el total hasta 230 mediante combinaciones generadas por índices. Esas recetas son técnicamente válidas, pero **no están diseñadas semánticamente**. Deben sustituirse por recetas deliberadas.
7. Hay recetas de ampliación que mencionan IDs inexistentes (`zinc`, `nickel`, `flower`). Actualmente se omiten gracias a una comprobación, pero son restos que conviene limpiar.

## Conflictos claros con la biblia visual

- `Cristal rojo`: eliminar.
- `Madera` duplicada: separar conceptualmente **Madera** de cualquier futuro **Tronco/Tablón/Viga** usando IDs inequívocos.
- Recursos/conceptos provisionales como Vapor, Barro, Metal genérico, Electricidad, Presión, Tiempo, Vida, Calor, Movimiento y Tecnología necesitan decidir si son **recursos jugables** o solo variables/sistemas. No deben ocupar huecos de inventario por inercia.
- Elementos fantásticos o de ciencia ficción heredados (`Lingote umbrío`, `Mithril`, `Pan lunar`, `Llama eterna`, `Jardín celeste`, `Oráculo mecánico`, etc.) no forman parte de la dirección tecnológica coherente que acabamos de fijar y deben revisarse antes de conservarse.

## Arte actual

- WebP asignados: **160**.
- Glifos/emoji de fallback: **77**.
- El arte existente se conserva únicamente como material temporal. **No se considera aprobado** para la versión definitiva.
- La nueva producción gráfica debe basarse exclusivamente en las fichas visuales bloqueadas y generar un archivo exclusivo por objeto.

## Próxima operación recomendada

Construir un **catálogo maestro nuevo** con IDs estables antes de generar imágenes:

1. Reconciliar la lista del juego con las fichas visuales bloqueadas.
2. Eliminar duplicados, conceptos provisionales y `Cristal rojo`.
3. Asignar a cada objeto un ID definitivo, categoría, tier y rareza.
4. Rehacer las recetas de forma semántica, eliminando el relleno automático.
5. Solo entonces producir los WebP definitivos.

`CATALOGO_ACTUAL.csv` contiene el inventario exacto de esta base para hacer la reconciliación sin perder ningún elemento.
