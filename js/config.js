// =====================================================================
//  CONFIGURACIÓN DE LA AGENDA
//  idHoja: el código de la hoja de Google, la parte de su enlace que va
//  entre /d/ y /edit. La hoja debe estar compartida como
//  «Cualquier persona con el enlace: Lector».
//  pestanaEventos puede ser una pestaña o una lista de pestañas.
//  filaCabecera: fila con los títulos de las columnas (encima van el
//  rótulo y las instrucciones).
//  primerDia: "domingo" (formato americano) o "lunes".
//  finDeSemana: "siempre" muestra sábado y domingo aunque estén vacíos;
//  "con-eventos" solo los muestra si tienen algún evento.
//  urlVisitas: dirección del contador de visitas (Apps Script de la hoja).
//  Si se deja vacía, no se cuentan visitas.
//  Si idHoja se deja vacío, la agenda usa el archivo datos/eventos.json.
// =====================================================================

const CONFIG = {
  idHoja: "1AfmUI5j05UPVrYRunPU9P-24omxDVhjal8POLqWPbjc",
  pestanaEventos: "Agenda",
  pestanaAvisos: "Convocatorias",
  filaCabecera: 3,
  primerDia: "domingo",
  finDeSemana: "siempre",
  urlVisitas: "",
};
