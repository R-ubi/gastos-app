import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { esFechaValida, hoyISO } from '../lib/formato';

const VERDE = '#16a34a';
const ROJO = '#dc2626';

export default function FormularioMovimiento({ onGuardado }) {
  const [tipo, setTipo] = useState('gasto'); // 'gasto' | 'ingreso'
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const colorTipo = tipo === 'ingreso' ? VERDE : ROJO;

  const guardar = async () => {
    setMensaje(null);
    const valor = Number(monto.replace(/,/g, '')); // acepta "1,500.50"

    // Validaciones antes de guardar (como en PHP antes del INSERT)
    if (!monto || isNaN(valor) || valor <= 0) {
      return setMensaje({ tipo: 'error', texto: 'Escribe un monto mayor a 0.' });
    }
    if (!descripcion.trim()) {
      return setMensaje({ tipo: 'error', texto: 'Escribe una descripción.' });
    }
    if (!esFechaValida(fecha)) {
      return setMensaje({ tipo: 'error', texto: 'La fecha debe ser válida, con formato AAAA-MM-DD.' });
    }

    setGuardando(true);
    // INSERT INTO movimientos (tipo, monto, descripcion, fecha) VALUES (...)
    // El user_id lo pone Supabase solo, con el usuario que inició sesión
    const { error } = await supabase.from('movimientos').insert({
      tipo,
      monto: Math.round(valor * 100) / 100,
      descripcion: descripcion.trim(),
      fecha,
    });
    setGuardando(false);

    if (error) return setMensaje({ tipo: 'error', texto: error.message });

    // Limpia el formulario y avisa a la pantalla principal que recargue
    setMonto('');
    setDescripcion('');
    setFecha(hoyISO());
    setMensaje({ tipo: 'ok', texto: tipo === 'ingreso' ? '✅ Ingreso agregado' : '✅ Gasto agregado' });
    onGuardado();
  };

  return (
    <View style={s.tarjeta}>
      <Text style={s.titulo}>Nuevo movimiento</Text>

      {/* Selector Gasto / Ingreso */}
      <View style={s.selector}>
        <Pressable
          style={[s.opcion, tipo === 'gasto' && { backgroundColor: ROJO }]}
          onPress={() => setTipo('gasto')}
        >
          <Ionicons name="arrow-up" size={16} color={tipo === 'gasto' ? '#fff' : ROJO} />
          <Text style={[s.opcionTexto, tipo === 'gasto' && s.opcionTextoActivo]}>Gasto</Text>
        </Pressable>
        <Pressable
          style={[s.opcion, tipo === 'ingreso' && { backgroundColor: VERDE }]}
          onPress={() => setTipo('ingreso')}
        >
          <Ionicons name="arrow-down" size={16} color={tipo === 'ingreso' ? '#fff' : VERDE} />
          <Text style={[s.opcionTexto, tipo === 'ingreso' && s.opcionTextoActivo]}>Ingreso</Text>
        </Pressable>
      </View>

      <Text style={s.label}>Monto</Text>
      <View style={s.inputMonto}>
        <Text style={s.signo}>$</Text>
        <TextInput
          style={s.inputSinBorde}
          placeholder="0.00"
          placeholderTextColor="#9ca3af"
          value={monto}
          onChangeText={setMonto}
          keyboardType="decimal-pad"
        />
      </View>

      <Text style={s.label}>Descripción</Text>
      <TextInput
        style={s.input}
        placeholder={tipo === 'ingreso' ? 'Ej. Sueldo, venta...' : 'Ej. Comida, transporte...'}
        placeholderTextColor="#9ca3af"
        value={descripcion}
        onChangeText={setDescripcion}
        maxLength={80}
      />

      <Text style={s.label}>Fecha (AAAA-MM-DD)</Text>
      <TextInput
        style={s.input}
        placeholder="2026-11-24"
        placeholderTextColor="#9ca3af"
        value={fecha}
        onChangeText={setFecha}
        maxLength={10}
      />

      {mensaje && (
        <Text style={mensaje.tipo === 'error' ? s.error : s.ok}>{mensaje.texto}</Text>
      )}

      <Pressable
        style={[s.boton, { backgroundColor: colorTipo }, guardando && { opacity: 0.6 }]}
        onPress={guardar}
        disabled={guardando}
      >
        {guardando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={s.botonTexto}>{tipo === 'ingreso' ? 'Agregar ingreso' : 'Agregar gasto'}</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
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
  titulo: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 14 },
  selector: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 14 },
  opcion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  opcionTexto: { fontSize: 15, fontWeight: '600', color: '#475569' },
  opcionTextoActivo: { color: '#ffffff' },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 12,
  },
  inputMonto: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  signo: { fontSize: 20, fontWeight: '700', color: '#64748b', marginRight: 6 },
  inputSinBorde: { flex: 1, paddingVertical: 12, fontSize: 20, fontWeight: '700', color: '#1f2937' },
  error: { color: ROJO, marginBottom: 10, textAlign: 'center' },
  ok: { color: VERDE, marginBottom: 10, textAlign: 'center' },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  botonTexto: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
}); 