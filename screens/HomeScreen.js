import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, Alert, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import TarjetaBalance from '../components/TarjetaBalance';
import FormularioMovimiento from '../components/FormularioMovimiento';
import ItemMovimiento from '../components/ItemMovimiento';

const FILTROS = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'ingreso', texto: 'Ingresos' },
  { valor: 'gasto', texto: 'Gastos' },
];

// Pregunta "¿seguro?" antes de borrar (en web y en celular se hace distinto)
function confirmar(texto) {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(texto));
  return new Promise((resolve) => {
    Alert.alert('Eliminar movimiento', texto, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Eliminar', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

export default function HomeScreen({ session }) {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  // SELECT * FROM movimientos ORDER BY fecha DESC
  // (Supabase solo devuelve los del usuario gracias a RLS)
  const cargar = useCallback(async () => {
    setError(null);
    const { data, error } = await supabase
      .from('movimientos')
      .select('*')
      .order('fecha', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setMovimientos(data);
    setCargando(false);
    setRefrescando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Suma ingresos y gastos (como un SUM() con GROUP BY tipo)
  const { ingresos, gastos } = useMemo(
    () =>
      movimientos.reduce(
        (total, m) => {
          if (m.tipo === 'ingreso') total.ingresos += Number(m.monto);
          else total.gastos += Number(m.monto);
          return total;
        },
        { ingresos: 0, gastos: 0 }
      ),
    [movimientos]
  );

  // DELETE FROM movimientos WHERE id = ...
  const eliminar = async (movimiento) => {
    const seguro = await confirmar(`¿Eliminar "${movimiento.descripcion}"?`);
    if (!seguro) return;

    setEliminandoId(movimiento.id);
    const { error } = await supabase.from('movimientos').delete().eq('id', movimiento.id);
    setEliminandoId(null);

    if (error) return setError(error.message);
    setMovimientos((lista) => lista.filter((m) => m.id !== movimiento.id));
  };

  const lista = filtro === 'todos' ? movimientos : movimientos.filter((m) => m.tipo === filtro);

  return (
    <ScrollView
      style={s.fondo}
      contentContainerStyle={s.contenido}
      refreshControl={
        <RefreshControl refreshing={refrescando} onRefresh={() => { setRefrescando(true); cargar(); }} />
      }
    >
      {/* Encabezado */}
      <View style={s.encabezado}>
        <View style={{ flex: 1 }}>
                    <Text style={s.hola}>Hola, {session.user.user_metadata?.nombre || session.user.email.split('@')[0]} 👋</Text>
          <Text style={s.correo} numberOfLines={1}>{session.user.email}</Text> 
        </View>
        <Pressable style={s.salir} onPress={() => supabase.auth.signOut()}>
          <Ionicons name="log-out-outline" size={18} color="#1e3a8a" />
          <Text style={s.salirTexto}>Salir</Text>
        </Pressable>
      </View>

      <TarjetaBalance ingresos={ingresos} gastos={gastos} />

      <FormularioMovimiento onGuardado={cargar} />

      {/* Historial */}
      <View style={s.tarjeta}>
        <View style={s.filaTitulo}>
          <Text style={s.titulo}>Historial</Text>
          <Text style={s.contador}>
            {lista.length} {lista.length === 1 ? 'movimiento' : 'movimientos'}
          </Text>
        </View>

        <View style={s.filtros}>
          {FILTROS.map((f) => (
            <Pressable
              key={f.valor}
              style={[s.chip, filtro === f.valor && s.chipActivo]}
              onPress={() => setFiltro(f.valor)}
            >
              <Text style={[s.chipTexto, filtro === f.valor && s.chipTextoActivo]}>{f.texto}</Text>
            </Pressable>
          ))}
        </View>

        {error && <Text style={s.error}>⚠️ {error}</Text>}

        {cargando ? (
          <ActivityIndicator style={{ marginVertical: 24 }} color="#2563eb" />
        ) : lista.length === 0 ? (
          <View style={s.vacio}>
            <Ionicons name="wallet-outline" size={44} color="#cbd5e1" />
            <Text style={s.vacioTexto}>Aún no hay movimientos.{'\n'}¡Agrega el primero arriba!</Text>
          </View>
        ) : (
          lista.map((m) => (
            <ItemMovimiento
              key={m.id}
              movimiento={m}
              onEliminar={eliminar}
              eliminando={eliminandoId === m.id}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: '#f1f5f9' },
  contenido: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 24 : 56,
    paddingBottom: 40,
    gap: 16,
  },
  encabezado: { flexDirection: 'row', alignItems: 'center' },
  hola: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  correo: { fontSize: 14, color: '#64748b', marginTop: 2 },
  salir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  salirTexto: { color: '#1e3a8a', fontWeight: '700' },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  filaTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titulo: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  contador: { fontSize: 13, color: '#64748b' },
  filtros: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: '#f1f5f9' },
  chipActivo: { backgroundColor: '#1e3a8a' },
  chipTexto: { fontSize: 13, fontWeight: '600', color: '#475569' },
  chipTextoActivo: { color: '#ffffff' },
  error: { color: '#dc2626', marginVertical: 8 },
  vacio: { alignItems: 'center', paddingVertical: 28, gap: 8 },
  vacioTexto: { color: '#94a3b8', textAlign: 'center', lineHeight: 20 },
}); 