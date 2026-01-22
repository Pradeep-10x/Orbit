import { useEffect, useRef } from 'react';

interface OrbitDot {
  x: number;
  y: number;
  radius: number;
  angle: number;
  speed: number;
  orbitRadius: number;
  type: 'post' | 'reel' | 'message' | 'call';
  color: string;
  gradientCache?: CanvasGradient;
}

export default function OrbitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const dotsRef = useRef<OrbitDot[]>([]);
  const centerXRef = useRef<number>(0);
  const centerYRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const lastFrameTimeRef = useRef<number>(0);

  // Throttle animation during scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      isScrollingRef.current = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Enable GPU acceleration
    canvas.style.willChange = 'transform';
    canvas.style.transform = 'translateZ(0)';

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      centerXRef.current = rect.width / 2;
      centerYRef.current = rect.height / 2;
    };

    resizeCanvas();

    // Use ResizeObserver if available, fallback to window resize
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(canvas);
    }
    window.addEventListener('resize', resizeCanvas);

    // Initialize orbit dots - reduced count for performance
    const initDots = () => {
      dotsRef.current = [];
      const dotTypes: Array<{ type: 'post' | 'reel' | 'message' | 'call'; color: string }> = [
        { type: 'post', color: 'rgba(168, 85, 247, 0.7)' },
        { type: 'reel', color: 'rgba(6, 182, 212, 0.7)' },
        { type: 'message', color: 'rgba(168, 85, 247, 0.5)' },
        { type: 'call', color: 'rgba(6, 182, 212, 0.5)' },
      ];

      const orbitRadii = [120, 200, 280, 360];

      orbitRadii.forEach((orbitRadius, ringIndex) => {
        const dotsPerRing = 3 + ringIndex; // Reduced from 4 + ringIndex * 2
        const typeIndex = ringIndex % dotTypes.length;

        for (let i = 0; i < dotsPerRing; i++) {
          const angle = (Math.PI * 2 / dotsPerRing) * i;
          const dotType = dotTypes[(typeIndex + i) % dotTypes.length];

          dotsRef.current.push({
            x: centerXRef.current + Math.cos(angle) * orbitRadius,
            y: centerYRef.current + Math.sin(angle) * orbitRadius,
            radius: 2.5 + Math.random() * 1.5,
            angle: angle,
            speed: 0.002 + (ringIndex * 0.001) * (ringIndex % 2 === 0 ? 1 : -1),
            orbitRadius,
            type: dotType.type,
            color: dotType.color,
          });
        }
      });
    };

    initDots();

    // Cache orbit rings paths
    const orbitRadii = [120, 200, 280, 360];

    // Optimized animation loop
    const animate = (currentTime: number) => {
      // Throttle to ~60fps and reduce updates during scroll
      const deltaTime = currentTime - lastFrameTimeRef.current;
      if (deltaTime < 16 && !isScrollingRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = centerXRef.current;
      const centerY = centerYRef.current;

      // Draw orbit rings (simplified, less expensive)
      ctx.save();
      ctx.globalAlpha = 0.06;
      orbitRadii.forEach((radius, index) => {
        ctx.strokeStyle = index % 2 === 0 ? 'rgba(168, 85, 247, 0.2)' : 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();

      // Update and draw dots (optimized)
      dotsRef.current.forEach((dot) => {
        dot.angle += dot.speed;
        dot.x = centerX + Math.cos(dot.angle) * dot.orbitRadius;
        dot.y = centerY + Math.sin(dot.angle) * dot.orbitRadius;

        // Simplified rendering - remove expensive gradients during scroll
        if (!isScrollingRef.current) {
          // Draw subtle glow (simplified)
          ctx.save();
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = dot.color;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw dot (always)
        ctx.save();
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: 'transparent',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    />
  );
}
