// =====================================================================
//  Agenda semanal · CIFP Las Indias
//  Lee los eventos (hoja de Google o datos/eventos.json) y coloca
//  cada uno en su día.
//  Cada día es una diapositiva: se pasa deslizando, con las flechas
//  o tocando la pestaña del día.
// =====================================================================

// Categorías: el nombre que aparece en la tarjeta y su color.
// Para añadir una nueva, copia una línea y cambia la clave, el nombre y el color.
const CATEGORIAS = {
  erasmus:   { nombre: "Movilidades Erasmus+", color: "#1f4fa3", suave: "#e5edfb" },
  formacion: { nombre: "Formación",            color: "#0f7d70", suave: "#dcf2ee" },
  ponencia:  { nombre: "Ponencia",             color: "#c4127c", suave: "#fbe3ef" },
  reunion:   { nombre: "Reunión",              color: "#3a3087", suave: "#e8e6f7" },
  actividad: { nombre: "Actividad",            color: "#c05a0a", suave: "#fdecdc" },
  otro:      { nombre: "Otros",                color: "#5f5c73", suave: "#ecebf1" },
};

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
               "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const ICONO_RELOJ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

// ---------- Utilidades de fechas ----------
function leerFecha(texto) {
  const [a, m, d] = texto.split("-").map(Number);
  return new Date(a, m - 1, d);
}
function claveFecha(fecha) {
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${m}-${d}`;
}
function sumarDias(fecha, n) {
  const f = new Date(fecha);
  f.setDate(f.getDate() + n);
  return f;
}
function lunesDe(fecha) {
  return sumarDias(fecha, -((fecha.getDay() + 6) % 7));
}
function minutosInicio(hora) {
  if (!hora) return Infinity; // los eventos sin hora van al final del día
  const [h, m = "0"] = hora.split(/[-–]/)[0].trim().split(":");
  return Number(h) * 60 + Number(m);
}
function formatearHora(hora) {
  return hora.split(/\s*[-–]\s*/).join(" – ") + " h";
}
function textoRango(lunes, ultimo) {
  const mismoMes = lunes.getMonth() === ultimo.getMonth();
  const inicio = mismoMes ? lunes.getDate() : `${lunes.getDate()} ${MESES[lunes.getMonth()]}`;
  return `${inicio} – ${ultimo.getDate()} ${MESES[ultimo.getMonth()]} ${ultimo.getFullYear()}`;
}
// El curso empieza en septiembre: abril de 2026 → "25/26", octubre de 2026 → "26/27"
function textoCurso(fecha) {
  const inicio = fecha.getMonth() >= 8 ? fecha.getFullYear() : fecha.getFullYear() - 1;
  return `${String(inicio).slice(2)}/${String(inicio + 1).slice(2)}`;
}
function escapar(texto = "") {
  return String(texto).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- Estado ----------
let eventos = [];
let avisos = [];
let semanas = [];        // lunes (clave) de cada semana que tiene eventos
let semanaActual = null; // clave del lunes mostrado
let dias = [];           // días de la semana mostrada
let indiceDia = 0;       // diapositiva visible

const $ = id => document.getElementById(id);
const pista = $("pista");

// ---------- Pintar ----------
function tarjetaEvento(ev) {
  const cat = CATEGORIAS[ev.categoria] || CATEGORIAS.otro;
  return `
    <article class="evento" style="--color:${cat.color};--color-suave:${cat.suave}">
      <div class="evento__meta">
        <span class="evento__categoria">${escapar(cat.nombre)}</span>
        ${ev.hora ? `<span class="evento__hora">${ICONO_RELOJ}${escapar(formatearHora(ev.hora))}</span>` : ""}
      </div>
      <h3 class="evento__titulo">${escapar(ev.titulo)}</h3>
      ${ev.texto ? `<p class="evento__texto">${escapar(ev.texto)}</p>` : ""}
      ${ev.enlace ? `<a class="evento__enlace" href="${escapar(ev.enlace)}" target="_blank" rel="noopener">Más información</a>` : ""}
    </article>`;
}

function pintarSemana(diaInicial) {
  const lunes = leerFecha(semanaActual);
  const hoy = claveFecha(new Date());

  // De lunes a viernes; sábado y domingo solo si tienen eventos.
  dias = [];
  for (let i = 0; i < 7; i++) {
    const fecha = sumarDias(lunes, i);
    const clave = claveFecha(fecha);
    const delDia = eventos
      .filter(e => e.fecha === clave)
      .sort((a, b) => minutosInicio(a.hora) - minutosInicio(b.hora));
    if (i < 5 || delDia.length) dias.push({ fecha, clave, eventos: delDia, esHoy: clave === hoy });
  }

  const ultimo = dias[dias.length - 1].fecha;
  $("rango-semana").textContent = textoRango(lunes, ultimo);
  $("curso").textContent = textoCurso(lunes);
  document.title = `Agenda ${textoRango(lunes, ultimo)} · CIFP Las Indias`;

  // Pestañas
  $("pestanas").innerHTML = dias.map((d, i) => `
    <button class="pestana${d.esHoy ? " pestana--hoy" : ""}" data-i="${i}"
            aria-label="${DIAS[d.fecha.getDay()]} ${d.fecha.getDate()}, ${d.eventos.length} eventos">
      <span class="pestana__dia">${DIAS_CORTOS[d.fecha.getDay()]}</span>
      <span class="pestana__num">${d.fecha.getDate()}</span>
      <span class="pestana__puntos">${"<i></i>".repeat(Math.min(d.eventos.length, 4))}</span>
    </button>`).join("");
  document.querySelectorAll(".pestana").forEach(b => b.onclick = () => irADia(Number(b.dataset.i)));

  // Diapositivas
  pista.innerHTML = dias.map(d => {
    const n = d.eventos.length;
    return `
      <section class="dia${d.esHoy ? " dia--hoy" : ""}" aria-label="${DIAS[d.fecha.getDay()]} ${d.fecha.getDate()}">
        <header class="dia__cabecera">
          <h2 class="dia__nombre">${DIAS[d.fecha.getDay()]}</h2>
          <span class="dia__fecha">${d.fecha.getDate()} de ${MESES[d.fecha.getMonth()]}</span>
          ${d.esHoy ? '<span class="dia__hoy">Hoy</span>' : ""}
          <span class="dia__contador">${n === 0 ? "" : n === 1 ? "1 evento" : `${n} eventos`}</span>
        </header>
        ${n
          ? `<div class="dia__eventos">${d.eventos.map(tarjetaEvento).join("")}</div>`
          : '<p class="dia__vacio">Sin eventos programados</p>'}
      </section>`;
  }).join("");
  observador.disconnect();
  [...pista.children].forEach(slide => observador.observe(slide));

  // Avisos cuyo periodo coincide con esta semana
  const fin = claveFecha(sumarDias(lunes, 6));
  const visibles = avisos.filter(a => a.desde <= fin && (a.hasta || a.desde) >= semanaActual);
  $("avisos").hidden = visibles.length === 0;
  $("avisos-lista").innerHTML = visibles.map(a => `
    <article class="aviso">
      <h3>${escapar(a.titulo)}</h3>
      ${a.texto ? `<p>${escapar(a.texto)}</p>` : ""}
      ${a.enlace ? `<a class="aviso__enlace" href="${escapar(a.enlace)}" target="_blank" rel="noopener">Pincha aquí para más información</a>` : ""}
    </article>`).join("");

  $("anterior").disabled = !semanas.some(s => s < semanaActual);
  $("siguiente").disabled = !semanas.some(s => s > semanaActual);

  // Día inicial: el pedido, hoy si cae en esta semana, o el primero con eventos
  let inicio = dias.findIndex(d => d.clave === diaInicial);
  if (inicio < 0) inicio = dias.findIndex(d => d.esHoy);
  if (inicio < 0) inicio = Math.max(0, dias.findIndex(d => d.eventos.length));
  irADia(inicio, false);
}

// ---------- Carrusel ----------
function irADia(i, animar = true) {
  indiceDia = Math.max(0, Math.min(i, dias.length - 1));
  const slide = pista.children[indiceDia];
  if (!slide) return;
  pista.scrollTo({ left: slide.offsetLeft - pista.offsetLeft, behavior: animar ? "smooth" : "instant" });
  marcarDia();
}

function marcarDia() {
  document.querySelectorAll(".pestana").forEach((b, i) =>
    b.setAttribute("aria-current", i === indiceDia ? "true" : "false"));
  $("dia-anterior").disabled = indiceDia === 0;
  $("dia-siguiente").disabled = indiceDia === dias.length - 1;

  ajustarAltura();

  const d = dias[indiceDia];
  if (d) try { history.replaceState(null, "", `#${d.clave}`); } catch (e) { /* sin historial */ }
}

// La altura del carrusel se ajusta al día visible (también si cambia al cargar fuentes)
function ajustarAltura() {
  const slide = pista.children[indiceDia];
  if (slide) pista.style.height = slide.offsetHeight + "px";
}
const observador = new ResizeObserver(ajustarAltura);

// Al deslizar con el dedo o el trackpad, detecta qué día ha quedado visible
let esperaScroll;
pista.addEventListener("scroll", () => {
  clearTimeout(esperaScroll);
  esperaScroll = setTimeout(() => {
    const i = Math.round(pista.scrollLeft / pista.clientWidth);
    if (i !== indiceDia) { indiceDia = i; marcarDia(); }
  }, 80);
});
window.addEventListener("resize", () => irADia(indiceDia, false));

document.addEventListener("keydown", e => {
  if (e.target.closest("input, textarea")) return;
  if (e.key === "ArrowRight") irADia(indiceDia + 1);
  if (e.key === "ArrowLeft") irADia(indiceDia - 1);
});

// ---------- Semanas ----------
function irASemana(clave, diaInicial) {
  semanaActual = clave;
  pintarSemana(diaInicial);
}

// Salta a la semana anterior/siguiente que tenga eventos
function moverSemana(direccion) {
  const candidatas = direccion > 0
    ? semanas.filter(s => s > semanaActual)
    : semanas.filter(s => s < semanaActual).reverse();
  if (candidatas.length) irASemana(candidatas[0]);
}

// Semana inicial: la del enlace (#2026-04-15), la actual si tiene eventos,
// la próxima con eventos o, si no hay ninguna, la última publicada.
function semanaInicial() {
  const hash = location.hash.slice(1);
  if (/^\d{4}-\d{2}-\d{2}$/.test(hash)) return { semana: claveFecha(lunesDe(leerFecha(hash))), dia: hash };
  const actual = claveFecha(lunesDe(new Date()));
  return { semana: semanas.find(s => s >= actual) || semanas[semanas.length - 1] || actual };
}

// ---------- Carga de datos ----------
// Quita tildes y pasa a minúsculas para comparar textos de la hoja
function normalizar(texto = "") {
  return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Lee un CSV respetando comillas, comas y saltos de línea dentro de las celdas
function leerCSV(texto) {
  const filas = [];
  let fila = [], celda = "", entreComillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (entreComillas) {
      if (c === '"' && texto[i + 1] === '"') { celda += '"'; i++; }
      else if (c === '"') entreComillas = false;
      else celda += c;
    } else if (c === '"') entreComillas = true;
    else if (c === ",") { fila.push(celda); celda = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      fila.push(celda); filas.push(fila); fila = []; celda = "";
    } else celda += c;
  }
  if (celda || fila.length) { fila.push(celda); filas.push(fila); }

  // Convierte cada fila en un objeto usando la cabecera (sin tildes ni mayúsculas)
  const cabecera = (filas.shift() || []).map(normalizar);
  return filas
    .filter(f => f.some(v => v.trim()))
    .map(f => Object.fromEntries(cabecera.map((k, i) => [k, (f[i] || "").trim()])));
}

// Acepta 13/04/2026, 13/4/26 o 2026-04-13 y devuelve 2026-04-13
function fechaDeHoja(texto) {
  let m = texto.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = texto.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
  if (!m) return null;
  const año = m[3].length === 2 ? "20" + m[3] : m[3];
  return `${año}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

// "Reunión", "Movilidades Erasmus+"… → clave de CATEGORIAS
function categoriaDeHoja(texto) {
  const t = normalizar(texto);
  return Object.keys(CATEGORIAS).find(k => t.includes(k) || normalizar(CATEGORIAS[k].nombre) === t) || "otro";
}

// Descarga una pestaña de la hoja de Google como CSV (siempre la versión más reciente)
async function descargarPestana(pestana) {
  const url = `https://docs.google.com/spreadsheets/d/${CONFIG.idHoja}/gviz/tq` +
              `?tqx=out:csv&sheet=${encodeURIComponent(pestana)}&t=${Date.now()}`;
  const resp = await fetch(url, { cache: "no-store" });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} al leer la pestaña ${pestana}`);
  return resp.text();
}

async function cargarDesdeHoja() {
  const [csvEventos, csvAvisos] = await Promise.all([
    descargarPestana(CONFIG.pestanaEventos),
    CONFIG.pestanaAvisos ? descargarPestana(CONFIG.pestanaAvisos).catch(() => "") : "",
  ]);
  const eventos = leerCSV(csvEventos)
    .map(f => ({
      fecha: fechaDeHoja(f.fecha || ""),
      hora: (f.hora || "").replace(/(\d{1,2}:\d{2}):\d{2}/g, "$1"),
      categoria: categoriaDeHoja(f.categoria),
      titulo: f.titulo,
      texto: f.texto,
      enlace: f.enlace,
    }))
    .filter(e => e.fecha && e.titulo);
  const avisos = leerCSV(csvAvisos)
    .map(f => ({
      desde: fechaDeHoja(f.desde || ""),
      hasta: fechaDeHoja(f.hasta || "") || fechaDeHoja(f.desde || ""),
      titulo: f.titulo,
      texto: f.texto,
      enlace: f.enlace,
    }))
    .filter(a => a.desde && a.titulo);
  return { eventos, avisos };
}

async function cargarDesdeArchivo() {
  const resp = await fetch("datos/eventos.json", { cache: "no-store" });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

// Primero la hoja de Google; si no está configurada o falla, el archivo JSON
async function cargarDatos() {
  const hayHoja = typeof CONFIG !== "undefined" && CONFIG.idHoja;
  if (hayHoja) {
    try { return await cargarDesdeHoja(); }
    catch (err) { console.warn("No se pudo leer la hoja de Google; se usa datos/eventos.json", err); }
  }
  return cargarDesdeArchivo();
}

// ---------- Arranque ----------
async function iniciar() {
  try {
    const datos = await cargarDatos();
    eventos = datos.eventos || [];
    avisos = datos.avisos || [];
  } catch (err) {
    pista.innerHTML = '<p class="mensaje">No se han podido cargar los eventos. Recarga la página en unos segundos.</p>';
    console.error(err);
    return;
  }

  semanas = [...new Set(eventos.map(e => claveFecha(lunesDe(leerFecha(e.fecha)))))].sort();

  $("anterior").onclick = () => moverSemana(-1);
  $("siguiente").onclick = () => moverSemana(1);
  $("hoy").onclick = () => irASemana(claveFecha(lunesDe(new Date())));
  $("dia-anterior").onclick = () => irADia(indiceDia - 1);
  $("dia-siguiente").onclick = () => irADia(indiceDia + 1);

  const { semana, dia } = semanaInicial();
  irASemana(semana, dia);
}

iniciar();
