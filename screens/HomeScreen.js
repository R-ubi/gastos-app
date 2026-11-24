import { Pressable, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { estilos as e } from '../lib/estilos';

export default function HomeScreen({ session }) {
  return (
    <View style={e.pantalla}>
      <View style={e.tarjeta}>
        <Text style={e.titulo}>¡Hola! 👋</Text>
        <Text style={e.subtitulo}>{session.user.email}</Text>
        <Text style={[e.subtitulo, { fontSize: 13 }]}>Aquí irán tus movimientos (Parte 3)</Text>

        <Pressable style={e.boton} onPress={() => supabase.auth.signOut()}>
          <Text style={e.botonTexto}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
} 