'use client';

import { useEffect, useRef, useState } from 'react';

const TOKENS = ['AI', '.NET', 'SK', '{}', '< />', 'λ', 'API', 'RAG', 'SQL', 'TS'];
const MAX_SPARKS = 18;
const SPARK_TTL_MS = 900;

type Spark = {
  id: number;
  token: string;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  rotate: number;
};

export default function PointerTechTrail() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const idRef = useRef(0);
  const lastPointRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeoutIds: number[] = [];

    if (!canHover || prefersReducedMotion) {
      return;
    }

    const addSpark = (event: PointerEvent) => {
      const now = performance.now();
      const lastPoint = lastPointRef.current;
      const distance = Math.hypot(event.clientX - lastPoint.x, event.clientY - lastPoint.y);

      if (now - lastPoint.time < 55 || distance < 18) {
        return;
      }

      lastPointRef.current = { x: event.clientX, y: event.clientY, time: now };
      const id = idRef.current++;
      const angle = Math.random() * Math.PI * 2;
      const distanceFromCursor = 20 + Math.random() * 26;

      setSparks((current) => [
        ...current.slice(-(MAX_SPARKS - 1)),
        {
          id,
          token: TOKENS[id % TOKENS.length],
          x: event.clientX,
          y: event.clientY,
          driftX: Math.cos(angle) * distanceFromCursor,
          driftY: -18 - Math.random() * 28,
          rotate: -18 + Math.random() * 36,
        },
      ]);

      const timeoutId = window.setTimeout(() => {
        setSparks((current) => current.filter((spark) => spark.id !== id));
      }, SPARK_TTL_MS);

      timeoutIds.push(timeoutId);
    };

    window.addEventListener('pointermove', addSpark, { passive: true });

    return () => {
      window.removeEventListener('pointermove', addSpark);
      for (const timeoutId of timeoutIds) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 overflow-hidden print:hidden">
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="pointer-tech-spark"
          style={
            {
              left: spark.x,
              top: spark.y,
              '--spark-x': `${spark.driftX}px`,
              '--spark-y': `${spark.driftY}px`,
              '--spark-rotate': `${spark.rotate}deg`,
            } as React.CSSProperties
          }
        >
          {spark.token}
        </span>
      ))}
    </div>
  );
}
