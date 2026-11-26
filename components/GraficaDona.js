import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Cristal from './Cristal';
import { tema } from '../lib/tema';
import { formatoDinero } from '../lib/formato';
import { useContador } from '../lib/useContador';

const TAM = 170;
const GROSOR = 16;
const RADIO = (TAM - GROSOR) / 2;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

// Color y mensaje según qué tanto has gastado
function estado(porcentaje, hayIngresos) {
  if (!hayIngresos) return { color: tema.textoSuave, texto: 'Agrega un ingreso para ver tu porcentaje' };
  if (porcentaje < 50) return { color: tema.verde, texto: '¡Vas muy bien! Gastas menos de la mitad 💪' };
  if (porcentaje < 80) return { color: tema.amarillo, texto: 'Cuidado, ya vas a más de la mitad ⚠️' };
  if (porcentaje <= 100) return { color: tema.rojo, texto: 'Estás muy cerca de tu límite 🔥' };
  return { color: tema.rojo, texto: 'Gastaste más de lo que ingresaste 🚨' };
}

export default function GraficaDona({ ingresos, gastos }) {
  const hayIngresos = ingresos > 0;
  const porcentajeReal = hayIngresos ? (gastos / ingresos) * 100 : 0;
  const porcentaje = useContador(porcentajeReal, 1400);
  const relleno = Math.min(Math.max(porcentaje, 0), 100) / 100;
  const { color, texto } = estado(porcentajeReal, hayIngresos);
  const maximo = Math.max(ingresos, gastos, 1);

  return (
    <Cristal>
      <Text style={s.titulo}>¿Cuánto de tus ingresos has gastado?</Text>

      <View style={s.centro}>
        <View style={{ width: TAM, height: TAM }}>
          <Svg width={TAM} height={TAM}>
            <Defs>
              <LinearGradient id="anilloDona" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={tema.cian} />
                <Stop offset="1" stopColor={color} />
              </LinearGradient>
            </Defs>
            {/* Anillo de fondo */}
            <Circle
              cx={TAM / 2}
              cy={TAM / 2}
              r={RADIO}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={GROSOR}
              fill="none"
            />
            {/* Anillo de progreso */}
            {relleno > 0.001 && (
              <Circle
                cx={TAM / 2}
                cy={TAM / 2}
                r={RADIO}
                stroke="url(#anilloDona)"
                strokeWidth={GROSOR}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${CIRCUNFERENCIA} ${CIRCUNFERENCIA}`}
                strokeDashoffset={CIRCUNFERENCIA * (1 - relleno)}
                transform={`rotate(-90 ${TAM / 2} ${TAM / 2})`}
              />
            )}
          </Svg>

          <View style={s.textoCentro}>
            <Text style={[s.porcentaje, { color }]}>{Math.round(porcentaje)}%</Text>
            <Text style={s.porcentajeEtiqueta}>gastado</Text>
          </View>
        </View>

        <Text style={[s.mensaje, { color }]}>{texto}</Text>
      </View>

      <Barra etiqueta="Ingresos" valor={ingresos} maximo={maximo} color={tema.verde} />
      <Barra etiqueta="Gastos" valor={gastos} maximo={maximo} color={tema.rojo} />
    </Cristal>
  );
}

// Barra horizontal animada para comparar ingresos vs gastos
function Barra({ etiqueta, valor, maximo, color }) {
  const ancho = useContador((valor / maximo) * 100, 1200);

  return (
    <View style={s.barraFila}>
      <View style={s.barraTextos}>
        <Text style={s.barraEtiqueta}>{etiqueta}</Text>
        <Text style={s.barraValor}>{formatoDinero(valor)}</Text>
      </View>
      <View style={s.barraFondo}>
        <View style={[s.barraRelleno, { width: `${Math.max(ancho, 0)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  titulo: { color: tema.texto, fontSize: 17, fontWeight: '700', marginBottom: 16 },
  centro: { alignItems: 'center', marginBottom: 18 },
  textoCentro: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  porcentaje: { fontSize: 36, fontWeight: '800' },
  porcentajeEtiqueta: { color: tema.textoSuave, fontSize: 13, marginTop: -2 },
  mensaje: { fontSize: 14, fontWeight: '600', marginTop: 14, textAlign: 'center' },
  barraFila: { marginTop: 10 },
  barraTextos: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barraEtiqueta: { color: tema.textoSuave, fontSize: 13 },
  barraValor: { color: tema.texto, fontSize: 13, fontWeight: '700' },
  barraFondo: { height: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  barraRelleno: { height: '100%', borderRadius: 999 },
}); 