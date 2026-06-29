import { useEffect, useRef } from 'react';

interface OpcionesScrollInfinito {
  hayMas: boolean;
  cargando: boolean;
  alCargarMas: () => void;
  umbral?: number;
}

export function useInfiniteScroll({
  hayMas,
  cargando,
  alCargarMas,
  umbral = 1,
}: OpcionesScrollInfinito) {
  const refCargador = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hayMas && !cargando) {
          alCargarMas();
        }
      },
      { threshold: umbral }
    );

    const current = refCargador.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [hayMas, cargando, alCargarMas, umbral]);

  return { refCargador };
}
