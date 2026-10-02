# Agenda semanal · CIFP Las Indias

Web que muestra los eventos del centro semana a semana, un día por diapositiva.
Está publicada con GitHub Pages y lee los eventos de una hoja de Google, así que
**para añadir eventos solo hay que escribir en la hoja**.

## Añadir o cambiar eventos

Todo se hace en la hoja de Google de la agenda. La pestaña **«Cómo se usa»** de la propia
hoja lo explica paso a paso.

1. En la pestaña **Agenda**, escribe una fila por evento en la primera fila libre:
   Fecha, Hora, Categoría, Título, Texto y Enlace.
   - **Fecha**, **Categoría** y **Título** son obligatorios. Si falta el título, la celda se pone roja.
   - **Hora** puede ser `9:00` o `9:00-14:00`. Sin hora, el evento sale al final del día.
   - **Día** y **Semana** se calculan solas, y las semanas alternas salen en color.
   - El orden de las filas da igual: la web coloca cada evento en su semana y su día.
2. En la pestaña **Convocatorias** van los avisos que se ven bajo la agenda durante un
   periodo (Desde – Hasta).
3. Los cambios aparecen en cuanto se recarga la web.

No cambies el nombre de las pestañas, la fila 3 con los títulos de las columnas, el orden
de las columnas ni el formato de la columna Hora.

## Puesta en marcha (solo una vez)

### 1. Crear la hoja de Google

1. Crea una hoja de Google vacía y entra en **Archivo → Importar → Subir**.
2. Elige `plantilla/Agenda-semanal-hoja.xlsx` y la opción **Insertar hojas nuevas**.
3. Pulsa **Compartir**:
   - En «Acceso general» elige **Cualquier persona con el enlace → Lector**. Así la web puede leerla.
   - Añade como **Editor** al profesorado que vaya a escribir eventos.

### 2. Conectar la hoja con la web

En `js/config.js`, pon en `idHoja` el código de la hoja (lo que hay entre `/d/` y `/edit` en su enlace):

```js
const CONFIG = {
  idHoja: "1AfmUI5j05UPVrYRunPU9P-24omxDVhjal8POLqWPbjc",
  pestanaEventos: "Agenda",
  pestanaAvisos: "Convocatorias",
  filaCabecera: 3,
};
```

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
| `plantilla/Agenda-semanal-hoja.xlsx` | Pestañas con formato para crear la hoja de Google |

## Trucos

- Si cambias `css/estilos.css` o algún archivo de `js/`, sube el número `?v=` que aparece en
  `index.html` (por ejemplo de `?v=4` a `?v=5`). Así los navegadores descargan la versión nueva
  en lugar de usar la que tienen guardada.

- Enlace directo a un día: `https://USUARIO.github.io/Agenda-semanal/#2026-04-15`
- En el ordenador se cambia de día con las flechas del teclado ← →.
