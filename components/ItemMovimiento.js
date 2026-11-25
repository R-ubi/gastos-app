import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatoDinero, formatoFecha } from '../lib/formato';

// Un renglón del historial: icono, descripción, fecha, monto y botón de borrar
export default function ItemMovimiento({ movimiento, onEliminar, eliminando }) {
  const esIngreso = movimiento.tipo === 'ingreso';
  const color = esIngreso ? '#16a34a' : '#dc2626';

  return (
    <View style={s.item}>
      <View style={[s.icono, { backgroundColor: esIngreso ? '#dcfce7' : '#fee2e2' }]}>
        <Ionicons name={esIngreso ? 'trending-up' : 'trending-down'} size={20} color={color} />
      </View>

      <View style={s.textos}>
        <Text style={s.descripcion} numberOfLines={1}>{movimiento.descripcion}</Text>
        <Text style={s.fecha}>{formatoFecha(movimiento.fecha)}</Text>
      </View>

      <Text style={[s.monto, { color }]}>
        {esIngreso ? '+' : '-'}{formatoDinero(movimiento.monto)}
      </Text>

      <Pressable style={s.borrar} onPress={() => onEliminar(movimiento)} disabled={eliminando} hitSlop={8}>
        {eliminando
          ? <ActivityIndicator size="small" color="#9ca3af" />
          : <Ionicons name="trash-outline" size={20} color="#9ca3af" />}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  icono: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  textos: { flex: 1 },
  descripcion: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  fecha: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  monto: { fontSize: 15, fontWeight: '700' },
  borrar: { padding: 6, borderRadius: 8 },
}); 