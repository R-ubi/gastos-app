// Funciones de ayuda para mostrar dinero y fechas bonitos

// 14750 -> "$14,750.00"  (formato mexicano, sin depender del navegador)
export function formatoDinero(valor) {
  const numero = Number(valor) || 0;
  const signo = numero < 0 ? '-' : '';
  const [enteros, decimales] = Math.abs(numero).toFixed(2).split('.');
  const conComas = enteros.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${signo}$${conComas}.${decimales}`;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// "2026-11-24" -> "24 nov 2026"
export function formatoFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split('-');
  return `${Number(dia)} ${MESES[Number(mes) - 1]} ${anio}`;
}

// Fecha de hoy en formato "AAAA-MM-DD" (el que usa la base de datos)
export function hoyISO() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

// Revisa que la fecha exista de verdad (no acepta "2026-02-31")
export function esFechaValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [anio, mes, dia] = texto.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
} 