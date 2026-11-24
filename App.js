import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from './lib/supabase';
import { estilos as e } from './lib/estilos';
import AuthScreen from './screens/AuthScreen';
import NuevaPasswordScreen from './screens/NuevaPasswordScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [session, setSession] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [recuperando, setRecuperando] = useState(false);

  useEffect(() => {
    // ¿Ya hay alguien con sesión iniciada? (como revisar $_SESSION)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCargando(false);
    });

    // Escucha cuando alguien entra, sale o llega del enlace de recuperar contraseña
    const { data: { subscription } } = supabase.auth.onAuthStateChange((evento, nuevaSesion) => {
      if (evento === 'PASSWORD_RECOVERY') setRecuperando(true);
      setSession(nuevaSesion);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (cargando) {
    return (
      <View style={e.pantalla}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (recuperando) return <NuevaPasswordScreen onListo={() => setRecuperando(false)} />;
  if (!session) return <AuthScreen />;
  return <HomeScreen session={session} />;
} 