import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Cristal from './Cristal';
import { supabase } from '../lib/supabase';
import { esFechaValida, hoyISO } from '../lib/formato';
import { tema } from '../lib/tema';

const DEGRADADO = {
  gasto: [tema.rojo, tema.rosa],
  ingreso: [tema.verde, tema.cian],
};

export default function FormularioMovimiento({ onGuardado }) {
  const [tipo, setTipo] = useState('gasto'); // 'gasto' | 'ingreso'
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

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
    const { error } = await supabase.from('movimientos').insert({
      tipo,
      monto: Math.round(valor * 100) / 100,
      descripcion: descripcion.trim(),
      fecha,
    });
    setGuardando(false);

    if (error) return setMensaje({ tipo: 'error', texto: error.message });

    setMonto('');
    setDescripcion('');
    setFecha(hoyISO());
    setMensaje({ tipo: 'ok', texto: tipo === 'ingreso' ? '✅ Ingreso agregado' : '✅ Gasto agregado' });
    onGuardado();
  };

  return (
    <Cristal>
      <Text style={s.titulo}>Nuevo movimiento</Text>

      {/* Selector Gasto / Ingreso */}
      <View style={s.selector}>
        <Opcion activa={tipo === 'gasto'} color={tema.rojo} icono="arrow-up" texto="Gasto" onPress={() => setTipo('gasto')} />
        <Opcion activa={tipo === 'ingreso'} color={tema.verde} icono="arrow-down" texto="Ingreso" onPress={() => setTipo('ingreso')} />
      </View>

      <Text style={s.label}>Monto</Text>
      <View style={s.inputMonto}>
        <Text style={s.signo}>$</Text>
        <TextInput
          style={s.inputSinBorde}
          placeholder="0.00"
          placeholderTextColor="#64748b"
          value={monto}
          onChangeText={setMonto}
          keyboardType="decimal-pad"
        />
      </View>

      <Text style={s.label}>Descripción</Text>
      <TextInput
        style={s.input}
        placeholder={tipo === 'ingreso' ? 'Ej. Sueldo, venta...' : 'Ej. Comida, transporte...'}
        placeholderTextColor="#64748b"
        value={descripcion}
        onChangeText={setDescripcion}
        maxLength={80}
      />

      <Text style={s.label}>Fecha (AAAA-MM-DD)</Text>
      <TextInput
        style={s.input}
        placeholder="2026-11-25"
        placeholderTextColor="#64748b"
        value={fecha}
        onChangeText={setFecha}
        maxLength={10}
      />

      {mensaje && (
        <Text style={mensaje.tipo === 'error' ? s.error : s.ok}>{mensaje.texto}</Text>
      )}

      <Pressable onPress={guardar} disabled={guardando} style={({ pressed }) => [pressed && { transform: [{ scale: 0.98 }] }]}>
        <LinearGradient
          colors={DEGRADADO[tipo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[s.boton, guardando && { opacity: 0.6 }]}
        >
          {guardando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={s.botonTexto}>{tipo === 'ingreso' ? 'Agregar ingreso' : 'Agregar gasto'}</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </Cristal>
  );
}

function Opcion({ activa, color, icono, texto, onPress }) {
  return (
    <Pressable style={[s.opcion, activa && { backgroundColor: color + '33', borderColor: color }]} onPress={onPress}>
      <Ionicons name={icono} size={16} color={activa ? color : tema.textoSuave} />
      <Text style={[s.opcionTexto, activa && { color: tema.texto }]}>{texto}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 18, fontWeight: '700', color: tema.texto, marginBottom: 14 },
  selector: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  opcion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  opcionTexto: { fontSize: 15, fontWeight: '600', color: tema.textoSuave },
  label: { fontSize: 13, fontWeight: '600', color: tema.textoSuave, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: tema.borde,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 13,
    fontSize: 16,
    color: tema.texto,
    marginBottom: 12,
  },
  inputMonto: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tema.borde,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    paddingHorizontal: 13,
    marginBottom: 12,
  },
  signo: { fontSize: 22, fontWeight: '700', color: tema.textoSuave, marginRight: 6 },
  inputSinBorde: { flex: 1, paddingVertical: 12, fontSize: 22, fontWeight: '800', color: tema.texto },
  error: { color: tema.rojo, marginBottom: 10, textAlign: 'center' },
  ok: { color: tema.verde, marginBottom: 10, textAlign: 'center' },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    padding: 15,
    marginTop: 4,
  },
  botonTexto: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
});