import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { estilos as e } from '../lib/estilos';

// Se muestra cuando el usuario llega desde el enlace de "recuperar contraseña"
export default function NuevaPasswordScreen({ onListo }) {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const guardar = async () => {
    setMensaje(null);
    if (password.length < 6) return setMensaje({ tipo: 'error', texto: 'Mínimo 6 caracteres.' });
    if (password !== confirmar) return setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden.' });

    setCargando(true);
    const { error } = await supabase.auth.updateUser({ password });
    setCargando(false);

    if (error) return setMensaje({ tipo: 'error', texto: error.message });
    setMensaje({ tipo: 'ok', texto: '¡Contraseña actualizada!' });
    setTimeout(onListo, 1500);
  };

  return (
    <View style={e.pantalla}>
      <View style={e.tarjeta}>
        <Text style={e.titulo}>🔑 Nueva contraseña</Text>
        <Text style={e.subtitulo}>Escribe tu nueva contraseña</Text>

        {mensaje && (
          <Text style={mensaje.tipo === 'error' ? e.mensajeError : e.mensajeOk}>{mensaje.texto}</Text>
        )}

        <TextInput style={e.input} placeholder="Nueva contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={e.input} placeholder="Repite la contraseña" value={confirmar} onChangeText={setConfirmar} secureTextEntry />

        <Pressable style={[e.boton, cargando && { opacity: 0.6 }]} onPress={guardar} disabled={cargando}>
          {cargando ? <ActivityIndicator color="#fff" /> : <Text style={e.botonTexto}>Guardar</Text>}
        </Pressable>
      </View>
    </View>
  );
} 