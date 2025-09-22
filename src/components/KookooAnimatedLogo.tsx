import { useEffect, useLayoutEffect, useRef } from 'react';

interface KookooAnimatedLogoProps {
  className?: string;
  maxOffsetPx?: number; // max pupil translation at 1x viewBox scale
}

// Static geometry from provided SVG
const VIEWBOX = { width: 611, height: 176 };

// Eye circle centers (the big rings)
const EYE_CENTERS = {
  pinkLeft: { x: 142.243, y: 90.196 },
  pinkRight: { x: 244.539, y: 90.196 },
  cyanLeft: { x: 453.344, y: 90.196 },
  cyanRight: { x: 555.641, y: 90.196 }
};

// Pupil base positions from provided SVG white dots
const PUPIL_BASE = {
  pinkLeft: { x: 133.059, y: 100.68, r: 30 },
  pinkRight: { x: 233.499, y: 100.68, r: 30 },
  cyanLeft: { x: 463.419, y: 77.846, r: 30 },
  cyanRight: { x: 563.859, y: 77.846, r: 30 }
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
      {/* New SVG structure with updated logo layout */}
      <svg viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
        <g clipPath="url(#clip0_12_184)">
          <path fillRule="evenodd" clipRule="evenodd" d="M33.1884 63.1808C34.1001 62.2892 35.0278 61.414 35.9711 60.5556C39.3412 57.4891 42.9103 54.6375 46.6569 52.0225C56.6105 45.0753 67.8163 39.7982 79.868 36.5976C81.7716 36.0921 83.3543 38.0177 82.5578 39.819L75.4099 55.9854L66.6332 75.8355C66.4456 76.2598 66.1387 76.6201 65.7531 76.8782C61.4494 79.7582 57.4631 83.0755 53.8577 86.7665C52.5856 88.0688 51.3608 89.4178 50.1863 90.8105C44.2494 97.85 39.5956 106.007 36.5855 114.921C35.9111 116.918 35.3193 118.954 34.8139 121.023C34.0909 123.983 33.5451 127.013 33.1884 130.101C32.8615 132.931 32.6935 135.81 32.6935 138.727C32.6935 139.85 32.7182 140.966 32.7672 142.076C32.8291 143.479 31.7265 144.676 30.3223 144.676H3.84115C2.56358 144.676 1.50558 143.678 1.46183 142.401C1.42003 141.181 1.39896 139.957 1.39896 138.727C1.39896 122.098 5.24055 106.366 12.0847 92.37C12.5076 91.5052 12.9419 90.647 13.3876 89.7957C18.5469 79.939 25.2687 70.985 33.1884 63.1808Z" fill="#FF911E"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M61.178 97.2206C60.1956 96.1565 58.5002 96.1928 57.6076 97.3332C51.473 105.17 46.8768 114.27 44.2728 124.176C44.0677 124.957 44.2843 125.785 44.8316 126.378L61.0112 143.902C61.4669 144.395 62.1081 144.676 62.7799 144.676L99.4941 144.676C101.593 144.676 102.687 142.178 101.263 140.636L61.178 97.2206Z" fill="#FF8C15"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M35.9712 3.10278C35.9712 1.66886 34.3836 0.812708 33.2041 1.62824C21.0665 10.021 10.4445 20.5152 1.78892 31.3724C1.53548 31.6903 1.39905 32.0845 1.39905 32.4911V82.2796C1.39905 84.1934 4.06145 84.832 4.97629 83.1511C12.5576 69.2212 22.9308 54.6439 35.205 45.7822C35.6833 45.4368 35.9712 44.8866 35.9712 44.2966V3.10278Z" fill="#FF8C15"/>
        </g>
        <circle cx="244.539" cy="90.196" r="44.5039" fill="none" stroke="#E5168C" strokeWidth="20.183"/>
        <circle cx="142.243" cy="90.196" r="44.5039" fill="none" stroke="#E5168C" strokeWidth="20.183"/>
        <path d="M208.182 140.635C210.145 142.09 210.457 144.902 208.904 146.79C201.08 156.304 197.373 162.776 194.314 171.883C193.933 173.018 192.258 173.018 191.877 171.883C188.817 162.776 185.111 156.304 177.287 146.79C175.734 144.902 176.046 142.09 178.009 140.635L190.587 131.313C192.077 130.209 194.114 130.209 195.604 131.313L208.182 140.635Z" fill="#FF911E"/>
        <g clipPath="url(#clip1_12_184)">
          <path fillRule="evenodd" clipRule="evenodd" d="M343.397 63.2962C344.308 62.4047 345.236 61.5295 346.179 60.6711C349.549 57.6045 353.119 54.753 356.865 52.138C366.819 45.1907 378.025 39.9137 390.076 36.7131C391.98 36.2076 393.563 38.1331 392.766 39.9345L385.618 56.1008L376.841 75.9509C376.654 76.3753 376.347 76.7356 375.961 76.9936C371.658 79.8736 367.671 83.1909 364.066 86.882C362.794 88.1843 361.569 89.5333 360.395 90.9259C354.458 97.9655 349.804 106.123 346.794 115.037C346.119 117.034 345.528 119.069 345.022 121.138C344.299 124.099 343.753 127.129 343.397 130.217C343.07 133.047 342.902 135.925 342.902 138.843C342.902 139.965 342.927 141.082 342.975 142.192C343.037 143.594 341.935 144.791 340.531 144.791H314.049C312.772 144.791 311.714 143.793 311.67 142.517C311.628 141.297 311.607 140.072 311.607 138.843C311.607 122.213 315.449 106.481 322.293 92.4855C322.716 91.6207 323.15 90.7625 323.596 89.9112C328.755 80.0545 335.477 71.1005 343.397 63.2962Z" fill="#126BF1"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M371.386 97.3358C370.404 96.2717 368.708 96.308 367.816 97.4484C361.681 105.286 357.085 114.385 354.481 124.292C354.276 125.072 354.493 125.9 355.04 126.493L371.219 144.017C371.675 144.511 372.316 144.791 372.988 144.791L409.702 144.791C411.801 144.791 412.895 142.293 411.471 140.751L371.386 97.3358Z" fill="#126BF1"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M346.179 3.21826C346.179 1.78434 344.592 0.928186 343.412 1.74372C331.275 10.1365 320.653 20.6307 311.997 31.4879C311.744 31.8058 311.607 32.2 311.607 32.6066V82.3951C311.607 84.3088 314.27 84.9475 315.184 83.2665C322.766 69.3367 333.139 54.7594 345.413 45.8977C345.892 45.5523 346.179 45.0021 346.179 44.4121V3.21826Z" fill="#126BF1"/>
        </g>
        <circle cx="555.641" cy="90.196" r="44.5039" fill="none" stroke="#12F4D1" strokeWidth="20.183"/>
        <circle cx="453.344" cy="90.196" r="44.5039" fill="none" stroke="#12F4D1" strokeWidth="20.183"/>
        <path d="M519.578 140.635C521.542 142.09 521.853 144.902 520.301 146.79C512.477 156.304 508.77 162.776 505.711 171.883C505.33 173.018 503.655 173.018 503.273 171.883C500.214 162.776 496.508 156.304 488.683 146.79C487.131 144.902 487.442 142.09 489.406 140.635L501.984 131.313C503.474 130.209 505.511 130.209 507 131.313L519.578 140.635Z" fill="#126BF1"/>

        {/* SVG pupils (ensure visibility even if overlay divs fail) */}
        <circle ref={el => (svgPupilsRef.current.pinkLeft = el)} cx={PUPIL_BASE.pinkLeft.x} cy={PUPIL_BASE.pinkLeft.y} r={PUPIL_BASE.pinkLeft.r * 0.55} fill="#F5F5F5"/>
        <circle ref={el => (svgPupilsRef.current.pinkRight = el)} cx={PUPIL_BASE.pinkRight.x} cy={PUPIL_BASE.pinkRight.y} r={PUPIL_BASE.pinkRight.r * 0.55} fill="#F5F5F5"/>
        <circle ref={el => (svgPupilsRef.current.cyanLeft = el)} cx={PUPIL_BASE.cyanLeft.x} cy={PUPIL_BASE.cyanLeft.y} r={PUPIL_BASE.cyanLeft.r * 0.55} fill="#F5F5F5"/>
        <circle ref={el => (svgPupilsRef.current.cyanRight = el)} cx={PUPIL_BASE.cyanRight.x} cy={PUPIL_BASE.cyanRight.y} r={PUPIL_BASE.cyanRight.r * 0.55} fill="#F5F5F5"/>
        
        <defs>
          <clipPath id="clip0_12_184">
            <rect width="101.707" height="145.038" fill="white" transform="translate(0.678101)"/>
          </clipPath>
          <clipPath id="clip1_12_184">
            <rect width="101.105" height="145.038" fill="white" transform="translate(312.381)"/>
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


