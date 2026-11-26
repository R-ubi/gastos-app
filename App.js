import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from './lib/supabase';
import { tema } from './lib/tema';
import FondoAurora from './components/FondoAurora';
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

  let pantalla;
  if (cargando) {
    pantalla = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={tema.cian} />
      </View>
    );
  } else if (recuperando) {
    pantalla = <NuevaPasswordScreen onListo={() => setRecuperando(false)} />;
  } else if (!session) {
    pantalla = <AuthScreen />;
  } else {
    pantalla = <HomeScreen session={session} />;
  }

  // El fondo aurora va detrás de todas las pantallas
  return (
    <View style={{ flex: 1, backgroundColor: tema.fondo }}>
      <FondoAurora />
      {pantalla}
    </View>
  );
}