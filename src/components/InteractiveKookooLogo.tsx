import { useEffect, useRef, useState } from 'react';

interface InteractiveKookooLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function InteractiveKookooLogo({ 
  className = "w-full h-auto", 
  width = 400, 
  height = 120 
}: InteractiveKookooLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const computePupilOffset = (eyeCenter: { x: number; y: number }) => {
    if (!mousePos || !svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    const eyeScreenPos = {
      x: rect.left + (eyeCenter.x / width) * rect.width,
      y: rect.top + (eyeCenter.y / height) * rect.height
    };
    
    const dx = mousePos.x - eyeScreenPos.x;
    const dy = mousePos.y - eyeScreenPos.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    
    // Limit pupil movement within eye
    const maxOffset = 8;
    return { 
      x: Math.max(-maxOffset, Math.min(maxOffset, nx * maxOffset)), 
      y: Math.max(-maxOffset, Math.min(maxOffset, ny * maxOffset)) 
    };
  };

  // Eye positions in SVG coordinates (approximate based on typical logo layout)
  const leftEyeCenter = { x: width * 0.35, y: height * 0.4 };
  const rightEyeCenter = { x: width * 0.65, y: height * 0.4 };
  
  const leftPupilOffset = computePupilOffset(leftEyeCenter);
  const rightPupilOffset = computePupilOffset(rightEyeCenter);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Background circle/oval for the logo */}
      <ellipse
        cx={width / 2}
        cy={height / 2}
        rx={width * 0.4}
        ry={height * 0.35}
        fill="#1CAFBF"
        stroke="#023047"
        strokeWidth="3"
      />
      
      {/* Left eye */}
      <circle
        cx={leftEyeCenter.x}
        cy={leftEyeCenter.y}
        r="18"
        fill="white"
        stroke="#023047"
        strokeWidth="2"
      />
      
      {/* Left pupil */}
      <circle
        cx={leftEyeCenter.x + leftPupilOffset.x}
        cy={leftEyeCenter.y + leftPupilOffset.y}
        r="8"
        fill="#023047"
      />
      
      {/* Right eye */}
      <circle
        cx={rightEyeCenter.x}
        cy={rightEyeCenter.y}
        r="18"
        fill="white"
        stroke="#023047"
        strokeWidth="2"
      />
      
      {/* Right pupil */}
      <circle
        cx={rightEyeCenter.x + rightPupilOffset.x}
        cy={rightEyeCenter.y + rightPupilOffset.y}
        r="8"
        fill="#023047"
      />
      
      {/* KooKoo text */}
      <text
        x={width / 2}
        y={height * 0.8}
        textAnchor="middle"
        fontSize="32"
        fontWeight="bold"
        fill="#023047"
        fontFamily="Inter, sans-serif"
      >
        KooKoo
      </text>
      
      {/* Subtitle */}
      <text
        x={width / 2}
        y={height * 0.95}
        textAnchor="middle"
        fontSize="12"
        fill="#023047"
        fontFamily="Inter, sans-serif"
        opacity="0.8"
      >
        Caribbean Inter-Island Aviation
      </text>
    </svg>
  );
}

export default InteractiveKookooLogo;
