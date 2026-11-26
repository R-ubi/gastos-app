import { Platform, StyleSheet, View } from 'react-native';
import { tema } from '../lib/tema';

// Tarjeta semitransparente con desenfoque (efecto "cristal esmerilado")
export default function Cristal({ children, style }) {
  return <View style={[s.cristal, style]}>{children}</View>;
}

const s = StyleSheet.create({
  cristal: {
    backgroundColor: tema.cristal,
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 24,
    padding: 20,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(18px)' } : {}),
  },
});