import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from './lib/supabase';

export default function App() {
  const [estado, setEstado] = useState('Probando conexión...');

  useEffect(() => {
    (async () => {
      const { error } = await supabase.from('movimientos').select('id').limit(1);
      setEstado(error ? `❌ Error: ${error.message}` : '✅ Conectado a Supabase');
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{estado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { fontSize: 18 },
});