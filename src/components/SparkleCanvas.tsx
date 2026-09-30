"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  twinkleSpeed: number;
  life?: number;
  maxLife?: number;
}

export const SparkleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const colors = ['#C98E2A', '#F0B543', '#7B141C', '#0B8043', '#D4972B'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Ambient floating embers
    const ambientParticles: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.15,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    }));

    // Dynamic click burst particles
    let burstParticles: Particle[] = [];

    const handleClick = (e: MouseEvent) => {
      const burstColors = ['#F0B543', '#C98E2A', '#E07B18', '#0B8043', '#FFF'];
      const x = e.clientX;
      const y = e.clientY;

      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.8;
        burstParticles.push({
          x,
          y,
          size: Math.random() * 2.5 + 1.2,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          opacity: 1,
          color: burstColors[Math.floor(Math.random() * burstColors.length)],
          twinkleSpeed: 0.05,
          life: 0,
          maxLife: Math.random() * 30 + 25,
        });
      }
    };
    window.addEventListener('click', handleClick);

    let scrollOffset = 0;
    const handleScroll = () => {
      scrollOffset = window.scrollY * 0.04;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render ambient embers
      ambientParticles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        p.opacity += Math.sin(Date.now() * p.twinkleSpeed) * 0.015;
        if (p.opacity > 0.75) p.opacity = 0.75;
        if (p.opacity < 0.15) p.opacity = 0.15;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, (p.y - scrollOffset) % canvas.height, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render click burst particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.x += bp.speedX;
        bp.y += bp.speedY;
        bp.speedY += 0.04; // Gentle gravity
        bp.life = (bp.life || 0) + 1;
        bp.opacity = 1 - (bp.life / (bp.maxLife || 40));

        if (bp.opacity <= 0 || (bp.life || 0) >= (bp.maxLife || 40)) {
          burstParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = bp.opacity;
        ctx.fillStyle = bp.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = bp.color;

        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-70"
      aria-hidden="true"
    />
  );
};
