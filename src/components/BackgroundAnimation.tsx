'use client';
import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const BackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      
      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.directionX = (Math.random() - 0.5) * 2;
        this.directionY = (Math.random() - 0.5) * 2;
        this.size = 2;
      }

      update(width: number, height: number) {
        if (this.x > width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();
      }
    }

    const particleArray: Particle[] = [];
    const numberOfParticles = 50;

    const initializeCanvas = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      
      particleArray.length = 0;
      for (let i = 0; i < numberOfParticles; i++) {
        particleArray.push(new Particle(canvas.width, canvas.height));
      }
    };

    initializeCanvas();
    window.addEventListener('resize', initializeCanvas);

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particleArray.forEach((particle, i) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);

        for (let j = i; j < particleArray.length; j++) {
          const dx = particle.x - particleArray[j].x;
          const dy = particle.y - particleArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.15 - distance/800})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particleArray[j].x, particleArray[j].y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', initializeCanvas);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full bg-transparent"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default BackgroundAnimation;
