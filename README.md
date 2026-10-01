# Agenda semanal · CIFP Las Indias

Web que muestra los eventos del centro semana a semana, un día por diapositiva.
Está publicada con GitHub Pages y lee los eventos de una hoja de Google, así que
**para añadir eventos solo hay que escribir en la hoja**.

## Añadir o cambiar eventos

1. Abre la hoja de Google de la agenda.
2. En la pestaña **Eventos**, añade una fila por evento:

   | Fecha | Hora | Categoría | Título | Texto | Enlace |
   |---|---|---|---|---|---|
   | 15/04/2026 | 9:00-11:00 | Ponencia | Ponencia sobre Seguridad Vial | El alumnado de 1º CS Movilidad… | |

   - **Fecha** y **Título** son obligatorios. La web coloca el evento sola en su semana y su día.
   - **Hora** puede ser `9:00` o `9:00-14:00`. Si está vacía, el evento sale al final del día.
     La columna está en formato texto para que Google no convierta las horas; no le cambies el formato.
   - **Categoría** se elige en el desplegable: Erasmus, Formación, Ponencia, Reunión, Actividad u Otro.
   - **Enlace** es opcional y añade un botón «Más información».
3. En la pestaña **Avisos** van las convocatorias que deben verse toda una semana o un periodo (columnas Desde y Hasta).
4. Los cambios aparecen en cuanto se recarga la web.

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
  idHoja: "1eIdWRvaQoOKH9tnOHouldwjsa8w1CJ1w",
  pestanaEventos: "Eventos",
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
