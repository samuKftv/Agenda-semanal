// =====================================================================
//  Contador de visitas de la Agenda semanal · CIFP Las Indias
//  Se pega en la hoja de Google: Extensiones → Apps Script.
//  Cada vez que alguien abre la agenda, añade una fila en la pestaña
//  «Visitas» con la fecha y hora, el tipo de dispositivo y la semana vista.
//  No guarda ningún dato personal (ni IP, ni nombre, ni correo).
// =====================================================================

const PESTANA_VISITAS = "Visitas";

function doGet(e) {
  return registrarVisita(e);
}

function doPost(e) {
  return registrarVisita(e);
}

function registrarVisita(e) {
  const p = (e && e.parameter) || {};
  const dispositivo = p.d === "movil" ? "Móvil" : p.d === "ordenador" ? "Ordenador" : "";
  const semana = /^\d{4}-\d{2}-\d{2}$/.test(p.s || "") ? p.s : "";

  // Evita que dos visitas a la vez se pisen al escribir
  const cerrojo = LockService.getScriptLock();
  cerrojo.waitLock(10000);
  try {
    hojaVisitas().appendRow([new Date(), dispositivo, semana]);
  } finally {
    cerrojo.releaseLock();
  }
  return ContentService.createTextOutput("ok");
}

// Crea la pestaña «Visitas» la primera vez, con un pequeño resumen a la derecha
function hojaVisitas() {
  const libro = SpreadsheetApp.getActive();
  let hoja = libro.getSheetByName(PESTANA_VISITAS);
  if (hoja) return hoja;

  hoja = libro.insertSheet(PESTANA_VISITAS);
  hoja.setTabColor("#5bbfb5");
  hoja.getRange("A1:C1").setValues([["Fecha y hora", "Dispositivo", "Semana vista"]])
    .setFontWeight("bold").setFontColor("#ffffff").setBackground("#0f7d70");
  hoja.getRange("A:A").setNumberFormat("dd/mm/yyyy hh:mm");
  hoja.setColumnWidth(1, 150);
  hoja.setColumnWidth(2, 110);
  hoja.setColumnWidth(3, 120);
  hoja.setFrozenRows(1);

  hoja.getRange("E1:F1").setValues([["Resumen", ""]])
    .setFontWeight("bold").setFontColor("#ffffff").setBackground("#3a3087");
  hoja.getRange("E2:E6").setValues([["Total"], ["Hoy"], ["Últimos 7 días"], ["Últimos 30 días"], ["Desde el móvil"]]);
  hoja.getRange("F2:F6").setFormulas([
    ["=COUNTA(A2:A)"],
    ['=COUNTIFS(A2:A,">="&TODAY(),A2:A,"<"&TODAY()+1)'],
    ['=COUNTIFS(A2:A,">="&TODAY()-6)'],
    ['=COUNTIFS(A2:A,">="&TODAY()-29)'],
    ['=COUNTIF(B2:B,"Móvil")'],
  ]).setFontWeight("bold");
  hoja.setColumnWidth(5, 130);
  return hoja;
}

// Ejecuta esta función una vez desde el editor para crear la pestaña y dar permisos
function prepararHoja() {
  hojaVisitas();
}
