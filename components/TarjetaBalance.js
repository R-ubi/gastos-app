import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatoDinero } from '../lib/formato';

// Tarjeta azul con: Balance total = Ingresos - Gastos
export default function TarjetaBalance({ ingresos, gastos }) {
  const balance = ingresos - gastos;

  return (
    <View style={s.tarjeta}>
      <Text style={s.etiqueta}>Balance total</Text>
      <Text style={[s.balance, balance < 0 && s.negativo]}>{formatoDinero(balance)}</Text>

      <View style={s.fila}>
        <View style={s.mini}>
          <View style={[s.icono, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="arrow-down" size={18} color="#16a34a" />
          </View>
          <View>
            <Text style={s.miniEtiqueta}>Ingresos</Text>
            <Text style={s.miniValor}>{formatoDinero(ingresos)}</Text>
          </View>
        </View>

        <View style={s.mini}>
          <View style={[s.icono, { backgroundColor: '#fee2e2' }]}>
            <Ionicons name="arrow-up" size={18} color="#dc2626" />
          </View>
          <View>
            <Text style={s.miniEtiqueta}>Gastos</Text>
            <Text style={s.miniValor}>{formatoDinero(gastos)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#1e3a8a',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#1e3a8a',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  etiqueta: { color: '#c7d2fe', fontSize: 14, fontWeight: '500' },
  balance: { color: '#ffffff', fontSize: 36, fontWeight: '800', marginTop: 4, marginBottom: 18 },
  negativo: { color: '#fca5a5' },
  fila: { flexDirection: 'row', gap: 12 },
  mini: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 12,
  },
  icono: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  miniEtiqueta: { color: '#c7d2fe', fontSize: 12 },
  miniValor: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});