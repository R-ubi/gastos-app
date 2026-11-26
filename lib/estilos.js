import { Platform, StyleSheet } from 'react-native';
import { tema } from './tema';

export const colores = tema;

const vidrio = Platform.OS === 'web' ? { backdropFilter: 'blur(20px)' } : {};

export const estilos = StyleSheet.create({
  pantalla: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  tarjeta: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: tema.cristal,
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 28,
    padding: 28,
    ...vidrio,
  },
  titulo: { fontSize: 28, fontWeight: '800', color: tema.texto, textAlign: 'center', marginBottom: 6 },
  subtitulo: { fontSize: 15, color: tema.textoSuave, textAlign: 'center', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: tema.borde,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    color: tema.texto,
  },
  boton: {
    backgroundColor: tema.morado,
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: tema.morado,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  botonTexto: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  enlace: { color: tema.cian, textAlign: 'center', marginTop: 16, fontSize: 14 },
  mensajeError: { color: tema.rojo, textAlign: 'center', marginBottom: 12 },
  mensajeOk: { color: tema.verde, textAlign: 'center', marginBottom: 12 },
});