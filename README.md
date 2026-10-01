# Agenda semanal · CIFP Las Indias

Web que muestra los eventos del centro semana a semana, un día por diapositiva.
Está publicada con GitHub Pages y lee los eventos de una hoja de Google, así que
**para añadir eventos solo hay que escribir en la hoja**.

## Añadir o cambiar eventos

**Lo normal: con el formulario de Google.** Se rellena fecha, horas, categoría, título y
texto, y el evento aparece en la web al recargarla. La web lo coloca sola en su semana y su día.

- **Corregir o borrar** un evento: edita o borra su fila en la pestaña
  «Respuestas de formulario 1» de la hoja.
- **Avisos y convocatorias** (se ven bajo la agenda durante un periodo): pestaña **Avisos**
  de la hoja, columnas Desde, Hasta, Título, Texto y Enlace.
- También se pueden escribir eventos a mano en la pestaña **Eventos** de la hoja
  (Fecha, Hora, Categoría, Título, Texto, Enlace). La web junta las dos pestañas.

No cambies el nombre de las pestañas ni los títulos de las columnas, ni los títulos de las
preguntas del formulario: la web los usa para encontrar cada dato.

## Puesta en marcha (solo una vez)

### 1. Crear la hoja de Google

1. Sube `plantilla/Agenda-semanal-plantilla.xlsx` a Google Drive y ábrela con Hojas de cálculo de Google.
2. Pulsa **Compartir**:
   - En «Acceso general» elige **Cualquier persona con el enlace → Lector**. Así la web puede leerla.
   - Añade como **Editor** al profesorado que vaya a escribir eventos.

### 2. Conectar la hoja con la web

En `js/config.js`, pon en `idHoja` el código de la hoja (lo que hay entre `/d/` y `/edit` en su enlace):

```js
const CONFIG = {
  idHoja: "1AfmUI5j05UPVrYRunPU9P-24omxDVhjal8POLqWPbjc",
  pestanaEventos: ["Eventos", "Respuestas de formulario 1"],
  pestanaAvisos: "Avisos",
};
```

No cambies el nombre de las pestañas «Eventos» y «Avisos» ni los títulos de sus columnas.
Si dejas `idHoja` vacío, la web usa el archivo `datos/eventos.json`, que también sirve de
copia de seguridad si Google falla.

### 3. Publicar la web en GitHub Pages

1. Sube esta carpeta a un repositorio llamado `Agenda-semanal`.
2. En el repositorio: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. En un minuto la web estará en `https://USUARIO.github.io/Agenda-semanal/`.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página |
| `css/estilos.css` | Colores, tipografía y diseño (colores del logo al principio) |
| `js/config.js` | Código de la hoja de Google |
| `js/agenda.js` | Programa que coloca los eventos; las categorías y sus colores están al principio |
| `datos/eventos.json` | Eventos de respaldo si no hay hoja configurada |
| `img/logotipo.png` | Logotipo del centro |
| `plantilla/` | Plantilla para crear la hoja de Google |

## Trucos

- Si cambias `css/estilos.css` o algún archivo de `js/`, sube el número `?v=` que aparece en
  `index.html` (por ejemplo de `?v=4` a `?v=5`). Así los navegadores descargan la versión nueva
  en lugar de usar la que tienen guardada.

- Enlace directo a un día: `https://USUARIO.github.io/Agenda-semanal/#2026-04-15`
- En el ordenador se cambia de día con las flechas del teclado ← →.
