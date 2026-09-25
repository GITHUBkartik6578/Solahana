import React, { useEffect, useRef } from 'react';

export default function BackgroundEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system - Gold & Amber particles on Warm Ivory
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.5,
      color: 'rgba(26,49,112, ',
      opacity: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      pulse: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        p.opacity += Math.sin(Date.now() * 0.002 + p.x) * 0.003;
        const currentOpacity = Math.max(0.05, Math.min(0.5, p.opacity));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentOpacity})`;
        ctx.shadowBlur = p.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = '#2F5BC7';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Warm Ivory Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF] to-[#FFFFFF]" />

      {/* Top Left Soft Gold Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#2F5BC7]/8 rounded-full blur-[140px]" />

      {/* Hero Right Column Radial Gold Light Glow */}
      <div className="absolute top-1/4 right-0 lg:right-10 w-[700px] h-[700px] bg-gradient-to-br from-[#2F5BC7]/10 via-[#5A7FD6]/8 to-transparent rounded-full blur-[150px] animate-pulse-glow" />

      {/* Abstract Curved Golden Rings on the Right */}
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[900px] h-[900px] border border-[#2F5BC7]/15 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 w-[700px] h-[700px] border border-[#2F5BC7]/20 rounded-full border-dashed pointer-events-none" />
      <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[500px] h-[500px] border border-[#5A7FD6]/15 rounded-full pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, #2F5BC7 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
}
