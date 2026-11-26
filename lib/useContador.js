import { useEffect, useRef, useState } from 'react';

// Anima un número desde su valor anterior hasta el nuevo (ej. $0 -> $7,135)
export function useContador(objetivo, duracion = 1000) {
  const [valor, setValor] = useState(0);
  const anterior = useRef(0);

  useEffect(() => {
    const inicio = anterior.current;
    const t0 = Date.now();
    let frame;

    const paso = () => {
      const progreso = Math.min((Date.now() - t0) / duracion, 1);
      const suave = 1 - Math.pow(1 - progreso, 3); // empieza rápido y frena al final
      const actual = inicio + (objetivo - inicio) * suave;
      setValor(actual);
      anterior.current = actual;
      if (progreso < 1) frame = requestAnimationFrame(paso);
    };

    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [objetivo, duracion]);

  return valor;
}