import { StyleSheet } from 'react-native';

export const colores = {
  fondo: '#f4f6f8',
  tarjeta: '#ffffff',
  primario: '#2563eb',
  texto: '#1f2937',
  gris: '#6b7280',
  borde: '#d1d5db',
  verde: '#16a34a',
  rojo: '#dc2626',
};

export const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo, alignItems: 'center', justifyContent: 'center', padding: 20 },
  tarjeta: {
    width: '100%', maxWidth: 420, backgroundColor: colores.tarjeta, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  titulo: { fontSize: 26, fontWeight: '700', color: colores.texto, textAlign: 'center', marginBottom: 4 },
  subtitulo: { fontSize: 15, color: colores.gris, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: colores.borde, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12, color: colores.texto },
  boton: { backgroundColor: colores.primario, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  enlace: { color: colores.primario, textAlign: 'center', marginTop: 14, fontSize: 14 },
  mensajeError: { color: colores.rojo, textAlign: 'center', marginBottom: 12 },
  mensajeOk: { color: colores.verde, textAlign: 'center', marginBottom: 12 },
}); 