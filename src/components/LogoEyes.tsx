import { useEffect, useRef, useState } from 'react';

interface LogoEyesProps {
  // Parent container should be position: relative; this component will be absolute inside it
  // Provide approximate eye center positions (percentages within the container)
  leftEyeCenter?: { xPct: number; yPct: number };
  rightEyeCenter?: { xPct: number; yPct: number };
  // Eye sizes in pixels
  eyeRadiusPx?: number;
  pupilRadiusPx?: number;
  // Max pupil travel within the eye (pixels)
  maxPupilOffsetPx?: number;
}

export function LogoEyes({
  leftEyeCenter = { xPct: 36, yPct: 48 },
  rightEyeCenter = { xPct: 64, yPct: 48 },
  eyeRadiusPx = 14,
  pupilRadiusPx = 6,
  maxPupilOffsetPx = 5
}: LogoEyesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const computePupilOffset = (eyeCenter: { x: number; y: number }) => {
    if (!mousePos) return { x: 0, y: 0 };
    const dx = mousePos.x - eyeCenter.x;
    const dy = mousePos.y - eyeCenter.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    return { x: nx * maxPupilOffsetPx, y: ny * maxPupilOffsetPx };
  };

  const renderEye = (centerPct: { xPct: number; yPct: number }, key: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const center = rect
      ? {
          x: rect.left + (centerPct.xPct / 100) * rect.width,
          y: rect.top + (centerPct.yPct / 100) * rect.height
        }
      : null;
    const offset = center ? computePupilOffset(center) : { x: 0, y: 0 };

    return (
      <div
        key={key}
        className="absolute rounded-full bg-white/95 border border-black/10 shadow-sm"
        style={{
          width: `${eyeRadiusPx * 2}px`,
          height: `${eyeRadiusPx * 2}px`,
          left: `calc(${centerPct.xPct}% - ${eyeRadiusPx}px)`,
          top: `calc(${centerPct.yPct}% - ${eyeRadiusPx}px)`
        }}
      >
        <div
          className="absolute rounded-full bg-[#0f172a]"
          style={{
            width: `${pupilRadiusPx * 2}px`,
            height: `${pupilRadiusPx * 2}px`,
            left: `calc(50% - ${pupilRadiusPx}px + ${offset.x}px)`,
            top: `calc(50% - ${pupilRadiusPx}px + ${offset.y}px)`
          }}
        />
      </div>
    );
  };

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {renderEye(leftEyeCenter, 'left')}
      {renderEye(rightEyeCenter, 'right')}
    </div>
  );
}

export default LogoEyes;


