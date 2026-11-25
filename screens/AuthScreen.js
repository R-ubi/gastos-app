import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { estilos as e } from '../lib/estilos';

const TEXTOS = {
  login: { subtitulo: 'Inicia sesión para continuar', boton: 'Entrar' },
  registro: { subtitulo: 'Crea tu cuenta', boton: 'Crear cuenta' },
  recuperar: { subtitulo: 'Te enviaremos un enlace a tu correo', boton: 'Enviar enlace' },
};

// Traduce los errores de Supabase (vienen en inglés)
function traducirError(msg = '') {
  if (msg.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (msg.includes('User already registered')) return 'Ese correo ya tiene una cuenta.';
  if (msg.includes('Email not confirmed')) return 'Confirma tu correo antes de iniciar sesión.';
  if (msg.toLowerCase().includes('rate limit')) return 'Demasiados intentos. Espera unos minutos.';
  if (msg.includes('valid email') || msg.includes('invalid format')) return 'El correo no es válido.';
  return msg;
}

export default function AuthScreen() {
  const [modo, setModo] = useState('login'); // 'login' | 'registro' | 'recuperar'
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'error' | 'ok', texto: '...' }

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    setMensaje(null);
  };

  const enviar = async () => {
    setMensaje(null);
    const correo = email.trim();

    // Validaciones (como las que harías con if en PHP antes del INSERT)
    if (modo === 'registro' && !nombre.trim()) {
      return setMensaje({ tipo: 'error', texto: 'Escribe tu nombre.' });
    }
    if (!correo) return setMensaje({ tipo: 'error', texto: 'Escribe tu correo.' });
    if (modo !== 'recuperar' && password.length < 6) {
      return setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    setCargando(true);
    try {
      if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: correo, password });
        if (error) throw error;
        // Si entra bien, App.js detecta la sesión y cambia de pantalla solo
      } else if (modo === 'registro') {
        const { data, error } = await supabase.auth.signUp({
          email: correo,
          password,
          // Datos extra del usuario (se guardan en user_metadata)
          options: { data: { nombre: nombre.trim(), full_name: nombre.trim() } },
        });
        if (error) throw error;
        if (!data.session) {
          setMensaje({ tipo: 'ok', texto: 'Cuenta creada. Revisa tu correo para confirmarla.' });
        }
      } else {
        const redirectTo = Platform.OS === 'web' ? window.location.origin : undefined;
        const { error } = await supabase.auth.resetPasswordForEmail(correo, { redirectTo });
        if (error) throw error;
        setMensaje({ tipo: 'ok', texto: 'Listo. Revisa tu correo (y la carpeta de spam).' });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: traducirError(err.message) });
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={e.pantalla}>
      <View style={e.tarjeta}>
        <Text style={e.titulo}>💰 Mis Finanzas</Text>
        <Text style={e.subtitulo}>{TEXTOS[modo].subtitulo}</Text>

        {mensaje && (
          <Text style={mensaje.tipo === 'error' ? e.mensajeError : e.mensajeOk}>{mensaje.texto}</Text>
        )}

        {modo === 'registro' && (
          <TextInput
            style={e.input}
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            autoComplete="name"
          />
        )}

        <TextInput
          style={e.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        {modo !== 'recuperar' && (
          <TextInput
            style={e.input}
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={enviar}
          />
        )}

        <Pressable style={[e.boton, cargando && { opacity: 0.6 }]} onPress={enviar} disabled={cargando}>
          {cargando ? <ActivityIndicator color="#fff" /> : <Text style={e.botonTexto}>{TEXTOS[modo].boton}</Text>}
        </Pressable>

        {modo === 'login' ? (
          <>
            <Text style={e.enlace} onPress={() => cambiarModo('registro')}>¿No tienes cuenta? Regístrate</Text>
            <Text style={e.enlace} onPress={() => cambiarModo('recuperar')}>¿Olvidaste tu contraseña?</Text>
          </>
        ) : (
          <Text style={e.enlace} onPress={() => cambiarModo('login')}>← Volver a iniciar sesión</Text>
        )}
      </View>
    </View>
  );
}