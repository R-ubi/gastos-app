import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatoDinero, formatoFecha } from '../lib/formato';
import { tema } from '../lib/tema';

// Un renglón del historial: icono, descripción, fecha, monto y botón de borrar
export default function ItemMovimiento({ movimiento, onEliminar, eliminando }) {
  const esIngreso = movimiento.tipo === 'ingreso';
  const color = esIngreso ? tema.verde : tema.rojo;

  return (
    <View style={s.item}>
      <View style={[s.icono, { backgroundColor: color + '22', borderColor: color + '55' }]}>
        <Ionicons name={esIngreso ? 'trending-up' : 'trending-down'} size={20} color={color} />
      </View>

      <View style={s.textos}>
        <Text style={s.descripcion} numberOfLines={1}>{movimiento.descripcion}</Text>
        <Text style={s.fecha}>{formatoFecha(movimiento.fecha)}</Text>
      </View>

      <Text style={[s.monto, { color }]}>
        {esIngreso ? '+' : '-'}{formatoDinero(movimiento.monto)}
      </Text>

      <Pressable
        style={({ hovered }) => [s.borrar, hovered && { backgroundColor: 'rgba(251,113,133,0.15)' }]}
        onPress={() => onEliminar(movimiento)}
        disabled={eliminando}
        hitSlop={8}
      >
        {eliminando
          ? <ActivityIndicator size="small" color={tema.textoSuave} />
          : <Ionicons name="trash-outline" size={19} color={tema.textoSuave} />}
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
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  icono: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1 },
  descripcion: { fontSize: 15, fontWeight: '600', color: tema.texto },
  fecha: { fontSize: 12, color: tema.textoSuave, marginTop: 2 },
  monto: { fontSize: 15, fontWeight: '800' },
  borrar: { padding: 8, borderRadius: 10 },
});