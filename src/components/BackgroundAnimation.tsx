'use client';
import { useEffect, useRef } from 'react';

const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '0123456789' +
  '{}[]<>()=>/\\.:;_+-|@#';

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COL_W = 16;
    const FONT_SIZE = 14;
    let drops: number[] = [];
    let speeds: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / COL_W);
      // Preserve existing columns, only add/trim as needed
      while (drops.length < cols) {
        drops.push(Math.random() * -80);
        speeds.push(0.3 + Math.random() * 0.6);
      }
      drops = drops.slice(0, cols);
      speeds = speeds.slice(0, cols);
    };

    resize();
    window.addEventListener('resize', resize);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      // Translucent black overlay creates the fading trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * COL_W;
        const row = Math.floor(drops[i]);
        const yPx = row * FONT_SIZE;

        // Head character — full bright green
        ctx.fillStyle = '#00FF00';
        ctx.fillText(char, x, yPx);

        drops[i] += speeds[i];

        // Reset column off the top after it exits the bottom (with random stagger)
        if (yPx > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
    };

    let rafId: number;

    if (prefersReduced) {
      // Single static frame for reduced-motion users
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      draw();
    } else {
      const loop = () => {
        draw();
        rafId = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full print:hidden"
      style={{ pointerEvents: 'none', opacity: 0.18 }}
    />
  );
}

