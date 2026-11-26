import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatoDinero } from '../lib/formato';
import { useContador } from '../lib/useContador';
import { tema } from '../lib/tema';

// Tarjeta principal: Balance total = Ingresos - Gastos (con números animados)
export default function TarjetaBalance({ ingresos, gastos }) {
  const balance = ingresos - gastos;
  const balanceAnimado = useContador(balance, 1200);
  const ingresosAnimados = useContador(ingresos, 1200);
  const gastosAnimados = useContador(gastos, 1200);

  return (
    <LinearGradient
      colors={['rgba(139,92,246,0.55)', 'rgba(59,130,246,0.35)', 'rgba(34,211,238,0.25)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.tarjeta}
    >
      <View style={s.filaSuperior}>
        <Text style={s.etiqueta}>Balance total</Text>
        <View style={s.chip}>
          <Ionicons name="sparkles" size={12} color={tema.texto} />
          <Text style={s.chipTexto}>MXN</Text>
        </View>
      </View>

      <Text style={[s.balance, balance < 0 && { color: tema.rojo }]}>{formatoDinero(balanceAnimado)}</Text>

      <View style={s.fila}>
        <Mini icono="arrow-down" color={tema.verde} etiqueta="Ingresos" valor={ingresosAnimados} />
        <Mini icono="arrow-up" color={tema.rojo} etiqueta="Gastos" valor={gastosAnimados} />
      </View>
    </LinearGradient>
  );
}

function Mini({ icono, color, etiqueta, valor }) {
  return (
    <View style={s.mini}>
      <View style={[s.icono, { backgroundColor: color + '33' }]}>
        <Ionicons name={icono} size={18} color={color} />
      </View>
      <View style={{ flexShrink: 1 }}>
        <Text style={s.miniEtiqueta}>{etiqueta}</Text>
        <Text style={s.miniValor} numberOfLines={1}>{formatoDinero(valor)}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  tarjeta: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  filaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etiqueta: { color: '#e0e7ff', fontSize: 14, fontWeight: '600' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipTexto: { color: tema.texto, fontSize: 11, fontWeight: '700' },
  balance: { color: tema.texto, fontSize: 40, fontWeight: '800', marginTop: 6, marginBottom: 18 },
  fila: { flexDirection: 'row', gap: 12 },
  mini: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(7,11,26,0.35)',
    borderRadius: 16,
    padding: 12,
  },
  icono: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  miniEtiqueta: { color: '#c7d2fe', fontSize: 12 },
  miniValor: { color: tema.texto, fontSize: 15, fontWeight: '700' },
});