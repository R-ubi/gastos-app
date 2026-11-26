import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, Alert, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { tema } from '../lib/tema';
import Aparecer from '../components/Aparecer';
import Cristal from '../components/Cristal';
import TarjetaBalance from '../components/TarjetaBalance';
import GraficaDona from '../components/GraficaDona';
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
  const { width } = useWindowDimensions();
  const pantallaAncha = width >= 900; // computadora = 2 columnas

  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  const nombre = session.user.user_metadata?.nombre || session.user.email.split('@')[0];
  const inicial = nombre.charAt(0).toUpperCase();

  // SELECT * FROM movimientos ORDER BY fecha DESC (RLS solo devuelve los del usuario)
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

  // Suma ingresos y gastos
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
      contentContainerStyle={[s.contenido, pantallaAncha && s.contenidoAncho]}
      refreshControl={
        <RefreshControl
          refreshing={refrescando}
          onRefresh={() => { setRefrescando(true); cargar(); }}
          tintColor={tema.cian}
        />
      }
    >
      {/* Encabezado */}
      <Aparecer>
        <View style={s.encabezado}>
          <LinearGradient colors={[tema.morado, tema.cian]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatar}>
            <Text style={s.avatarTexto}>{inicial}</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={s.hola} numberOfLines={1}>Hola, {nombre} 👋</Text>
            <Text style={s.subtitulo}>Tus finanzas de un vistazo</Text>
          </View>
          <Pressable
            style={({ hovered }) => [s.salir, hovered && s.salirHover]}
            onPress={() => supabase.auth.signOut()}
          >
            <Ionicons name="log-out-outline" size={18} color={tema.texto} />
            <Text style={s.salirTexto}>Salir</Text>
          </Pressable>
        </View>
      </Aparecer>

      <View style={pantallaAncha ? s.columnas : s.columna}>
        {/* Columna izquierda: resumen */}
        <View style={pantallaAncha ? s.colIzquierda : s.columna}>
          <Aparecer retraso={120}>
            <TarjetaBalance ingresos={ingresos} gastos={gastos} />
          </Aparecer>
          <Aparecer retraso={240}>
            <GraficaDona ingresos={ingresos} gastos={gastos} />
          </Aparecer>
        </View>

        {/* Columna derecha: formulario + historial */}
        <View style={pantallaAncha ? s.colDerecha : s.columna}>
          <Aparecer retraso={360}>
            <FormularioMovimiento onGuardado={cargar} />
          </Aparecer>

          <Aparecer retraso={480}>
            <Cristal>
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
                <ActivityIndicator style={{ marginVertical: 24 }} color={tema.cian} />
              ) : lista.length === 0 ? (
                <View style={s.vacio}>
                  <Ionicons name="wallet-outline" size={44} color="rgba(255,255,255,0.25)" />
                  <Text style={s.vacioTexto}>Aún no hay movimientos.{'\n'}¡Agrega el primero!</Text>
                </View>
              ) : (
                lista.map((m, i) => (
                  <Aparecer key={m.id} retraso={Math.min(i, 8) * 60}>
                    <ItemMovimiento movimiento={m} onEliminar={eliminar} eliminando={eliminandoId === m.id} />
                  </Aparecer>
                ))
              )}
            </Cristal>
          </Aparecer>
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'transparent' },
  contenido: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 28 : 56,
    paddingBottom: 48,
    gap: 20,
  },
  contenidoAncho: { maxWidth: 1120, padding: 28 },
  columnas: { flexDirection: 'row', alignItems: 'flex-start', gap: 20 },
  columna: { gap: 20 },
  colIzquierda: { flex: 1, gap: 20 },
  colDerecha: { flex: 1.25, gap: 20 },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarTexto: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  hola: { fontSize: 24, fontWeight: '800', color: tema.texto },
  subtitulo: { fontSize: 14, color: tema.textoSuave, marginTop: 2 },
  salir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: tema.cristal,
    borderWidth: 1,
    borderColor: tema.borde,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  salirHover: { backgroundColor: 'rgba(255,255,255,0.14)' },
  salirTexto: { color: tema.texto, fontWeight: '700' },
  filaTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titulo: { fontSize: 18, fontWeight: '700', color: tema.texto },
  contador: { fontSize: 13, color: tema.textoSuave },
  filtros: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: tema.borde,
  },
  chipActivo: { backgroundColor: tema.morado, borderColor: tema.morado },
  chipTexto: { fontSize: 13, fontWeight: '600', color: tema.textoSuave },
  chipTextoActivo: { color: '#ffffff' },
  error: { color: tema.rojo, marginVertical: 8 },
  vacio: { alignItems: 'center', paddingVertical: 28, gap: 8 },
  vacioTexto: { color: tema.textoSuave, textAlign: 'center', lineHeight: 20 },
}); 