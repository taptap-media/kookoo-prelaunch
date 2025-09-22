import { useEffect, useLayoutEffect, useRef } from 'react';

interface KookooAnimatedLogoProps {
  className?: string;
  maxOffsetPx?: number; // max pupil translation at 1x viewBox scale
}

// Static geometry from provided SVG
const VIEWBOX = { width: 479, height: 167 };

// Eye circle centers (the big rings)
const EYE_CENTERS = {
  pinkLeft: { x: 90.6375, y: 91.2949 },
  pinkRight: { x: 194.828, y: 91.2946 },
  cyanLeft: { x: 321.27, y: 91.2946 },
  cyanRight: { x: 423.567, y: 91.2946 }
};

// Pupil base positions from provided SVG white dots
const PUPIL_BASE = {
  pinkLeft: { x: 81.4534, y: 100.194, r: 30 },
  pinkRight: { x: 183.788, y: 100.194, r: 30 },
  cyanLeft: { x: 331.344, y: 80.0965, r: 30 },
  cyanRight: { x: 431.785, y: 80.0965, r: 30 }
};

export function KookooAnimatedLogo({ className = 'w-full h-auto', maxOffsetPx = 8 }: KookooAnimatedLogoProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pupilsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const svgPupilsRef = useRef<Record<string, SVGCircleElement | null>>({});
  const rafRef = useRef<number | null>(null);
  const lastMouse = useRef<{ x: number; y: number } | null>(null);
  const smoothedMouse = useRef<{ x: number; y: number } | null>(null);

  // Position pupils initially and on resize
  const layoutPupils = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const scaleX = rect.width / VIEWBOX.width;
    const scaleY = rect.height / VIEWBOX.height;
    const pupilScale = 0.825; // 50% bigger than previous 0.55

    (Object.keys(PUPIL_BASE) as Array<keyof typeof PUPIL_BASE>).forEach((key) => {
      const base = PUPIL_BASE[key];
      const el = pupilsRef.current[key as string];
      if (!el) return;
      const diameter = base.r * 2 * Math.min(scaleX, scaleY) * pupilScale;
      el.style.width = `${diameter}px`;
      el.style.height = `${diameter}px`;
      const left = base.x * scaleX - diameter / 2;
      const top = base.y * scaleY - diameter / 2;
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      // Reset transform; animation loop will update
      el.style.transform = 'translate3d(0,0,0)';
    });
  };

  useLayoutEffect(() => {
    layoutPupils();
    const onResize = () => layoutPupils();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Animation loop: move each pupil toward mouse, clamped by max offset
  const animate = () => {
    rafRef.current = null;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const scaleX = rect.width / VIEWBOX.width;
    const scaleY = rect.height / VIEWBOX.height;
    const scale = Math.min(scaleX, scaleY);
    const maxOffset = maxOffsetPx * scale;
    const mouse = lastMouse.current;
    if (!mouse) return;

    // Smooth follow: ease the perceived mouse position
    const ease = 0.12; // larger -> slower follow
    if (!smoothedMouse.current) smoothedMouse.current = { x: mouse.x, y: mouse.y };
    smoothedMouse.current.x += (mouse.x - smoothedMouse.current.x) * ease;
    smoothedMouse.current.y += (mouse.y - smoothedMouse.current.y) * ease;

    const toScreen = (pt: { x: number; y: number }) => ({
      x: rect.left + pt.x * scaleX,
      y: rect.top + pt.y * scaleY
    });

    const apply = (key: keyof typeof EYE_CENTERS) => {
      const centerPt = EYE_CENTERS[key];
      const centerScreen = toScreen(centerPt);
      const dx = smoothedMouse.current!.x - centerScreen.x;
      const dy = smoothedMouse.current!.y - centerScreen.y;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = dx / dist;
      const ny = dy / dist;
      const tx = Math.max(-maxOffset, Math.min(maxOffset, nx * maxOffset));
      const ty = Math.max(-maxOffset, Math.min(maxOffset, ny * maxOffset));
      const el = pupilsRef.current[key as string];
      if (el) el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      const sel = svgPupilsRef.current[key as string];
      if (sel) sel.setAttribute('transform', `translate(${tx}, ${ty})`);
    };

    apply('pinkLeft');
    apply('pinkRight');
    apply('cyanLeft');
    apply('cyanRight');
    // Continue animating until very close to the real mouse
    const closeEnough = Math.hypot(smoothedMouse.current.x - mouse.x, smoothedMouse.current.y - mouse.y) < 0.5;
    if (!closeEnough) rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(animate);
    };
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!media.matches) window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove as any);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative select-none ${className}`} style={{ aspectRatio: `${VIEWBOX.width} / ${VIEWBOX.height}` }}>
      {/* Exact SVG (pupil white circles removed) */}
      <svg viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path d="M350.712 64.0093C347.887 61.9153 347.438 57.8697 349.672 55.1535C360.93 41.4637 366.263 32.1517 370.665 19.0486C371.213 17.4152 373.623 17.4152 374.172 19.0486C378.574 32.1517 383.907 41.4637 395.164 55.1535C397.398 57.8697 396.95 61.9153 394.125 64.0093L376.027 77.4216C373.884 79.0104 370.953 79.0104 368.809 77.4216L350.712 64.0093Z" fill="#0088FF"/>
        <circle cx="321.27" cy="91.2946" r="44.5039" fill="transparent" stroke="#12F4D1" strokeWidth="20.183"/>
        <circle cx="423.567" cy="91.2946" r="44.5039" fill="transparent" stroke="#12F4D1" strokeWidth="20.183"/>
        <g clipPath="url(#clip0_18_90)">
          <path fillRule="evenodd" clipRule="evenodd" d="M263.927 64.1481C264.838 63.2565 265.766 62.3813 266.709 61.5229C270.079 58.4564 273.649 55.6048 277.395 52.9898C287.349 46.0425 298.555 40.7655 310.606 37.5649C312.51 37.0594 314.093 38.9849 313.296 40.7863L306.148 56.9527L297.371 76.8027C297.184 77.2271 296.877 77.5874 296.491 77.8454C292.188 80.7255 288.201 84.0428 284.596 87.7338C283.324 89.0361 282.099 90.3851 280.925 91.7777C274.988 98.8173 270.334 106.974 267.324 115.888C266.649 117.886 266.058 119.921 265.552 121.99C264.829 124.951 264.283 127.981 263.927 131.068C263.6 133.898 263.432 136.777 263.432 139.695C263.432 140.817 263.456 141.934 263.505 143.043C263.567 144.446 262.465 145.643 261.061 145.643H234.579C233.302 145.643 232.244 144.645 232.2 143.368C232.158 142.149 232.137 140.924 232.137 139.695C232.137 123.065 235.979 107.333 242.823 93.3373C243.246 92.4725 243.68 91.6143 244.126 90.763C249.285 80.9063 256.007 71.9523 263.927 64.1481Z" fill="#0088FF"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M291.916 98.1876C290.934 97.1236 289.239 97.1598 288.346 98.3003C282.211 106.137 277.615 115.237 275.011 125.143C274.806 125.924 275.023 126.752 275.57 127.345L291.75 144.869C292.205 145.362 292.846 145.643 293.518 145.643L330.232 145.643C332.331 145.643 333.425 143.145 332.001 141.603L291.916 98.1876Z" fill="#0088FF"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M266.709 4.07007C266.709 2.63615 265.122 1.77999 263.942 2.59553C251.805 10.9883 241.183 21.4825 232.527 32.3397C232.274 32.6576 232.137 33.0518 232.137 33.4584V83.2469C232.137 85.1606 234.8 85.7993 235.714 84.1183C243.296 70.1885 253.669 55.6112 265.943 46.7495C266.421 46.4041 266.709 45.8539 266.709 45.2639V4.07007Z" fill="#0088FF"/>
        </g>
        <path d="M164.439 116.565C167.264 118.659 167.712 122.705 165.478 125.421C154.221 139.111 148.888 148.423 144.486 161.526C143.937 163.16 141.527 163.16 140.979 161.526C136.577 148.423 131.244 139.111 119.986 125.421C117.752 122.705 118.201 118.659 121.026 116.565L139.123 103.153C141.267 101.564 144.198 101.564 146.341 103.153L164.439 116.565Z" fill="#FF911E"/>
        <path d="M90.6375 46.791C115.216 46.7912 135.141 66.7162 135.141 91.2949C135.141 115.873 115.216 135.799 90.6375 135.799C66.0588 135.799 46.1337 115.874 46.1335 91.2949C46.1335 66.7161 66.0586 46.791 90.6375 46.791Z" fill="transparent" stroke="#E5168C" strokeWidth="20.183"/>
        <circle cx="194.828" cy="91.2946" r="44.5039" fill="transparent" stroke="#E5168C" strokeWidth="20.183"/>

        {/* SVG pupils (ensure visibility even if overlay divs fail) */}
        <circle ref={el => (svgPupilsRef.current.pinkLeft = el)} cx={PUPIL_BASE.pinkLeft.x} cy={PUPIL_BASE.pinkLeft.y} r={PUPIL_BASE.pinkLeft.r * 0.55} fill="#F5F5F5"/>
        <circle ref={el => (svgPupilsRef.current.pinkRight = el)} cx={PUPIL_BASE.pinkRight.x} cy={PUPIL_BASE.pinkRight.y} r={PUPIL_BASE.pinkRight.r * 0.55} fill="#F5F5F5"/>
        <circle ref={el => (svgPupilsRef.current.cyanLeft = el)} cx={PUPIL_BASE.cyanLeft.x} cy={PUPIL_BASE.cyanLeft.y} r={PUPIL_BASE.cyanLeft.r * 0.55} fill="#F5F5F5"/>
        <circle ref={el => (svgPupilsRef.current.cyanRight = el)} cx={PUPIL_BASE.cyanRight.x} cy={PUPIL_BASE.cyanRight.y} r={PUPIL_BASE.cyanRight.r * 0.55} fill="#F5F5F5"/>
        <g clipPath="url(#clip1_18_90)">
          <path fillRule="evenodd" clipRule="evenodd" d="M33.2592 64.0326C34.1708 63.141 35.0986 62.2658 36.0419 61.4074C39.412 58.3409 42.9811 55.4893 46.7276 52.8743C56.6813 45.9271 67.8871 40.65 79.9388 37.4494C81.8423 36.9439 83.425 38.8695 82.6286 40.6708L75.4807 56.8372L66.704 76.6873C66.5163 77.1117 66.2095 77.4719 65.8238 77.73C61.5201 80.61 57.5339 83.9273 53.9285 87.6183C52.6563 88.9207 51.4316 90.2696 50.2571 91.6623C44.3201 98.7018 39.6663 106.859 36.6563 115.773C35.9819 117.77 35.3901 119.805 34.8847 121.875C34.1617 124.835 33.6158 127.865 33.2592 130.953C32.9323 133.783 32.7642 136.661 32.7642 139.579C32.7642 140.702 32.789 141.818 32.838 142.928C32.8999 144.331 31.7973 145.528 30.3931 145.528H3.91192C2.63435 145.528 1.57635 144.53 1.5326 143.253C1.4908 142.033 1.46973 140.808 1.46973 139.579C1.46973 122.95 5.31132 107.218 12.1554 93.2218C12.5783 92.357 13.0127 91.4988 13.4583 90.6475C18.6177 80.7908 25.3394 71.8368 33.2592 64.0326Z" fill="#FF8C15"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M61.2488 98.0721C60.2664 97.0081 58.571 97.0444 57.6784 98.1848C51.5439 106.022 46.9477 115.121 44.3436 125.028C44.1385 125.808 44.3551 126.637 44.9025 127.229L61.082 144.753C61.5378 145.247 62.179 145.528 62.8507 145.528L99.565 145.528C101.664 145.528 102.757 143.029 101.334 141.487L61.2488 98.0721Z" fill="#FF8C15"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M36.0419 3.95459C36.0419 2.52067 34.4542 1.66451 33.2748 2.48005C21.1372 10.8728 10.5152 21.367 1.8596 32.2242C1.60616 32.5421 1.46973 32.9363 1.46973 33.3429V83.1314C1.46973 85.0452 4.13213 85.6838 5.04697 84.0029C12.6283 70.073 23.0014 55.4957 35.2756 46.634C35.754 46.2887 36.0419 45.7384 36.0419 45.1484V3.95459Z" fill="#FF8C15"/>
        </g>
        <defs>
          <clipPath id="clip0_18_90">
            <rect width="101.105" height="145.038" fill="white" transform="translate(232.911 0.851807)"/>
          </clipPath>
          <clipPath id="clip1_18_90">
            <rect width="101.707" height="145.038" fill="white" transform="translate(0.748779 0.851807)"/>
          </clipPath>
        </defs>
      </svg>

      {/* Pupil overlays (absolute) */}
      <div id="Pink Eye Left" ref={el => (pupilsRef.current.pinkLeft = el)} className="absolute rounded-full bg-[#F5F5F5]" style={{ zIndex: 2, pointerEvents: 'none' }} />
      <div id="Pink Eye Right" ref={el => (pupilsRef.current.pinkRight = el)} className="absolute rounded-full bg-[#F5F5F5]" style={{ zIndex: 2, pointerEvents: 'none' }} />
      <div id="Cyan Eye Left" ref={el => (pupilsRef.current.cyanLeft = el)} className="absolute rounded-full bg-[#F5F5F5]" style={{ zIndex: 2, pointerEvents: 'none' }} />
      <div id="Cyan Eye Right" ref={el => (pupilsRef.current.cyanRight = el)} className="absolute rounded-full bg-[#F5F5F5]" style={{ zIndex: 2, pointerEvents: 'none' }} />
    </div>
  );
}

export default KookooAnimatedLogo;


