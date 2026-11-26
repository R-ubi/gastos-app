import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { tema } from '../lib/tema';

// Cada "mancha" de color: tamaño, posición y cuánto se mueve
const MANCHAS = [
  { color: tema.morado, tam: 560, top: '-15%', left: '-10%', dx: 80, dy: 50, dur: 9000 },
  { color: tema.azul, tam: 480, top: '35%', left: '55%', dx: -90, dy: 60, dur: 11000 },
  { color: tema.cian, tam: 400, top: '65%', left: '-8%', dx: 60, dy: -70, dur: 13000 },
  { color: tema.rosa, tam: 320, top: '0%', left: '70%', dx: -50, dy: 70, dur: 10000 },
];

function Mancha({ id, color, tam, top, left, dx, dy, dur }) {
  const avance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const opciones = { duration: dur, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web' };
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(avance, { toValue: 1, ...opciones }),
        Animated.timing(avance, { toValue: 0, ...opciones }),
      ])
    );
    animacion.start();
    return () => animacion.stop();
  }, []);

  const translateX = avance.interpolate({ inputRange: [0, 1], outputRange: [0, dx] });
  const translateY = avance.interpolate({ inputRange: [0, 1], outputRange: [0, dy] });
  const scale = avance.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });

  return (
    <Animated.View
      style={{ position: 'absolute', top, left, width: tam, height: tam, transform: [{ translateX }, { translateY }, { scale }] }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

export default function FondoAurora() {
  return (
    <View style={[StyleSheet.absoluteFill, s.contenedor]} pointerEvents="none">
      {MANCHAS.map((m, i) => (
        <Mancha key={i} id={`aurora${i}`} {...m} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  contenedor: { backgroundColor: tema.fondo, overflow: 'hidden' },
});