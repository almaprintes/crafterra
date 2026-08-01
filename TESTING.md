# Pruebas de CRAFTERRA

## Validación automática

Ejecute desde la raíz: `node tests/validate.mjs`. Comprueba mínimos de contenido, IDs, referencias, recetas conmutativas duplicadas, alcance desde los elementos iniciales, metacontenido, rutas del service worker y configuración comercial de desarrollo.

## Matriz manual

- Chrome/Edge y Safari móvil: instalar, cerrar, abrir sin red y continuar la partida.
- Arrastrar A sobre B y B sobre A; confirmar un único resultado.
- Probar receta inválida: las piezas permanecen y no se descuentan monedas.
- Crear un objeto nuevo: modal, recompensa, enciclopedia, misión y mundo se actualizan.
- Recargar: progreso, monedas y descubrimientos persisten en IndexedDB.
- Completar una estación y comprobar su aparición en el selector.
- Abrir los 15 puzles, reto diario, cuatro paneles de objetivos y filtros del archivo.
- Usar cinco recompensas de prueba y verificar el límite diario.
- Probar reinicio y exportación desde Ajustes.
- Abrir `tools/recipe-editor.html`, introducir conflicto y validar.
- Publicar en una subcarpeta de Pages y revisar manifest, icono, ámbito y modo offline.

La PWA debe servirse por HTTP(S). En incógnito o con almacenamiento bloqueado, el guardado puede estar restringido por el navegador.
