import { motion } from 'motion/react';
import svgPaths from "../imports/svg-9ztuu53kii";

interface LandingHeroProps {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  userJourney: any;
}

// New SVG Components from Figma Import
function TravelSvg() {
  return (
    <div className="relative shrink-0 size-[18.973px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="SVG">
          <path d={svgPaths.p271ac80} id="Vector" stroke="var(--stroke-0, #2a1b3d)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
          <path d={svgPaths.p35c40c40} id="Vector_2" stroke="var(--stroke-0, #2a1b3d)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
          <path d={svgPaths.p3ec493e0} id="Vector_3" stroke="var(--stroke-0, #2a1b3d)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
          <path d={svgPaths.pdde8300} id="Vector_4" stroke="var(--stroke-0, #2a1b3d)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
        </g>
      </svg>
    </div>
  );
}

function CargoSvg() {
  return (
    <div className="relative shrink-0 size-[18.973px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="SVG">
          <path d={svgPaths.p1df94c00} id="Vector" stroke="var(--stroke-0, #023047)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
          <path d="M9.48667 16.7993V8.89375" id="Vector_2" stroke="var(--stroke-0, #023047)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
          <path d={svgPaths.p8397ac8} id="Vector_3" stroke="var(--stroke-0, #023047)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
          <path d={svgPaths.p9678500} id="Vector_4" stroke="var(--stroke-0, #023047)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
        </g>
      </svg>
    </div>
  );
}

function PartnerSvg() {
  return (
    <div className="relative shrink-0 size-[18.973px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="SVG">
          <path d={svgPaths.p39b1f900} id="Vector" stroke="var(--stroke-0, #2a1b3d)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
        </g>
      </svg>
    </div>
  );
}

function TravelButton({ onNavigate }: { onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void }) {
  return (
    <motion.button
      onClick={() => onNavigate('right')}
      className="basis-0 bg-[#febc2f] box-border content-stretch flex flex-col gap-[9.487px] grow h-[175.503px] items-center justify-center min-h-px min-w-px px-0 py-[7.115px] relative rounded-[9.487px] shrink-0 hover:bg-[#e5a829] transition-all duration-200" 
      data-name="Travel Button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <TravelSvg />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16.342px] text-center text-nowrap" style={{ color: '#2a1b3d' }}>
        <p className="leading-[23.717px] whitespace-pre">I need to travel</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic opacity-80 relative shrink-0 text-[14.23px] text-nowrap" style={{ color: '#2a1b3d' }}>
        <p className="leading-[18.973px] whitespace-pre">Express travel demand</p>
      </div>
    </motion.button>
  );
}

function CargoButton({ onNavigate }: { onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void }) {
  return (
    <motion.button
      onClick={() => onNavigate('left')}
      className="basis-0 bg-[#27c840] box-border content-stretch flex flex-col gap-[9.487px] grow h-[175.503px] items-center justify-center min-h-px min-w-px px-0 py-[7.115px] relative rounded-[9.487px] shrink-0 hover:bg-[#22b037] transition-all duration-200" 
      data-name="Cargo Button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <CargoSvg />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#023047] text-[16.342px] text-nowrap">
        <p className="leading-[23.717px] whitespace-pre">I need to ship cargo</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic opacity-80 relative shrink-0 text-[#023047] text-[14.23px] text-nowrap">
        <p className="leading-[18.973px] whitespace-pre">Pool cargo with others</p>
      </div>
    </motion.button>
  );
}

function PartnerButton({ onNavigate }: { onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void }) {
  return (
    <motion.button
      onClick={() => onNavigate('up')}
      className="basis-0 bg-[#ff5f57] box-border content-stretch flex flex-col gap-[9.487px] grow h-[174.317px] items-center justify-center min-h-px min-w-px px-0 py-[7.115px] relative rounded-[9.487px] shrink-0 hover:bg-[#e5544c] transition-all duration-200" 
      data-name="Partner Button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <PartnerSvg />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16.213px] text-center text-nowrap" style={{ color: '#2a1b3d' }}>
        <p className="leading-[23.717px] whitespace-pre">I want to partner</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic opacity-80 relative shrink-0 text-[14.23px] text-nowrap" style={{ color: '#2a1b3d' }}>
        <p className="leading-[18.973px] whitespace-pre">Airlines, logistics, tourism</p>
      </div>
    </motion.button>
  );
}

export function LandingHero({ onNavigate, userJourney }: LandingHeroProps) {
  const isPostCampaign = userJourney.isEmailSet() && userJourney.isUserTypeSet();
  
  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#2a1b3d' }} data-name="Landing Hero">
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[27.305px] text-center mb-6" style={{ color: '#4FC3F7' }}>
            <h1 className="leading-[36px]">Join the Caribbean Chain</h1>
          </div>
          
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[28px] not-italic text-[16.875px] text-center max-w-[494.69px] mx-auto" style={{ color: '#FDFDFD' }}>
            <p className="mb-0">
              {isPostCampaign 
                ? `Welcome back! Continue your ${userJourney.journeyData.userType} journey with the Caribbean aviation network.`
                : 'Every dot connects communities. Choose your role in building the Caribbean aviation network.'
              }
            </p>
          </div>
        </motion.div>

        {/* Button Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="content-stretch flex gap-[35.575px] items-start w-full max-w-[961.708px]"
        >
          <TravelButton onNavigate={onNavigate} />
          <CargoButton onNavigate={onNavigate} />
          <PartnerButton onNavigate={onNavigate} />
        </motion.div>

        {/* Journey hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="text-sm mt-8" 
          style={{ color: '#1CAFBF' }}
        >
          Pick Your Journey
        </motion.div>
      </div>
    </div>
  );
}