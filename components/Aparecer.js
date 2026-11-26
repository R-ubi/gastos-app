import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform } from 'react-native';

// Hace que su contenido aparezca deslizándose hacia arriba
// "retraso" = milisegundos a esperar (para que aparezcan uno tras otro)
export default function Aparecer({ children, retraso = 0, style }) {
  const valor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(valor, {
      toValue: 1,
      duration: 650,
      delay: retraso,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  const translateY = valor.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });

  return <Animated.View style={[style, { opacity: valor, transform: [{ translateY }] }]}>{children}</Animated.View>;
} 