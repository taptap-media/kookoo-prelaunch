import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { KookooAnimatedLogo } from './KookooAnimatedLogo';
import svgPaths from "../imports/svg-kfa7yy36w9";
import joinSvgPaths from "../imports/svg-8k6edb01un";
import imgNewBackground from "figma:asset/34bf19b526036b3fe3b385fa5614b2ac0da60dfd.png";
import kookooLogo from 'figma:asset/0bc73fefcd3ccfad6e2ba4f598399b38574be7c1.png';

interface OriginalLandingHeroProps {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  userJourney: any;
}

// Figma Frame6 Icon Components
function Package() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="package">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="package">
          <path d="M24.75 14.1L11.25 6.315" id="Vector" stroke="#27C840" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p294eb6d0} id="Vector_2" stroke="#27C840" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p38a20b00} id="Vector_3" stroke="#27C840" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M18 33.12V18" id="Vector_4" stroke="#27C840" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Info() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="info">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="info">
          <path d={svgPaths.p2e363280} id="Vector" stroke="#FF5F57" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M18 24V18" id="Vector_2" stroke="#FF5F57" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d="M18 12H18.015" id="Vector_3" stroke="#FF5F57" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function PassengerSvg() {
  return (
    <div className="relative shrink-0 size-[35.575px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="SVG">
          <path d={svgPaths.p28941180} id="Vector" stroke="#FEBC2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p3cb0aa80} id="Vector_2" stroke="#FEBC2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p33cdf5c0} id="Vector_3" stroke="#FEBC2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p113e2d80} id="Vector_4" stroke="#FEBC2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function JoinSvg() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="join-svg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="SVG">
          <path d={joinSvgPaths.p39b1f900} id="Vector" stroke="#00D4FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.58111" />
        </g>
      </svg>
    </div>
  );
}

export function OriginalLandingHero({ onNavigate, userJourney }: OriginalLandingHeroProps) {
  const isPostCampaign = userJourney.isEmailSet() && userJourney.isUserTypeSet();
  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#1CAFBF' }}>
      {/* New Caribbean Islands Background */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* New Background Image */}
        <div className="absolute bg-center bg-cover bg-no-repeat inset-0" style={{ backgroundImage: `url('${imgNewBackground}')` }} />
        
        {/* Subtle Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </motion.div>



      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* MenuFrame Container */}
        <motion.div 
          className="bg-[rgba(14,10,88,0.93)] backdrop-blur-md rounded-[16px] p-8 md:p-12 max-w-4xl w-full shadow-2xl" 
          data-name="Menu Frame"
          initial={{ opacity: 0, y: "-10%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            {/* KooKoo Logo Image - Responsive */}
            <div className="w-full max-w-[240px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] mx-auto mb-4" data-name="KooKoo Logo">
              <KookooAnimatedLogo className="w-full h-auto select-none" />
            </div>
            <div className="text-lg md:text-xl mb-6 drop-shadow-sm" style={{ color: '#1CAFBF', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
              Your Island, Your Flight, Your Community
            </div>
            <p className="text-sm md:text-base max-w-2xl mx-auto drop-shadow-md" style={{ color: '#FDFDFD', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {isPostCampaign 
                ? `Welcome back! Continue your ${userJourney.journeyData.userType} journey.`
                : 'Join the Caribbean aviation revolution. Connect islands, share cargo, build community.'
              }
            </p>
          </motion.div>

          {/* Navigation Buttons - Figma Frame6 Style (staggered reveal) */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 items-center justify-center max-w-4xl mx-auto"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 1.0 }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {/* Passenger Button */}
            <motion.button
              variants={{ 
                hidden: { opacity: 0, y: 20 }, 
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } 
              }}
              onClick={() => onNavigate('right')}
              className="glass-button box-border content-stretch flex flex-col gap-[8px] h-[150px] items-center justify-center px-[16px] py-[20px] rounded-[18.902px] w-full max-w-[180px] mx-auto relative hover:bg-[rgba(0,0,0,0.4)] transition-all duration-200 shadow-lg"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                willChange: 'transform, backdrop-filter'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-name="Passenger Button"
            >
              <div aria-hidden="true" className="absolute border-[1.89px] border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[18.902px]" />
              <PassengerSvg />
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[18px] text-center drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                <p className="leading-[24px]">Passenger</p>
              </div>
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[12px] text-center opacity-80 drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                <p className="leading-[16px]">Express travel demand</p>
              </div>
            </motion.button>

            {/* Cargo Button */}
            <motion.button
              variants={{ 
                hidden: { opacity: 0, y: 20 }, 
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } 
              }}
              onClick={() => onNavigate('left')}
              className="glass-button box-border content-stretch flex flex-col gap-[8px] h-[150px] items-center justify-center px-[16px] py-[20px] rounded-[18.902px] w-full max-w-[180px] mx-auto relative hover:bg-[rgba(0,0,0,0.4)] transition-all duration-200 shadow-lg"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                willChange: 'transform, backdrop-filter'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-name="Cargo Button"
            >
              <div aria-hidden="true" className="absolute border-[1.89px] border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[18.902px]" />
              <Package />
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[18px] text-center drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                <p className="leading-[24px]">Cargo</p>
              </div>
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[12px] text-center opacity-80 drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                <p className="leading-[16px]">Pool cargo with others</p>
              </div>
            </motion.button>

            {/* Story Button */}
            <motion.button
              variants={{ 
                hidden: { opacity: 0, y: 20 }, 
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } 
              }}
              onClick={() => onNavigate('down')}
              className="glass-button box-border content-stretch flex flex-col gap-[8px] h-[150px] items-center justify-center px-[16px] py-[20px] rounded-[18.902px] w-full max-w-[180px] mx-auto relative hover:bg-[rgba(0,0,0,0.4)] transition-all duration-200 shadow-lg"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                willChange: 'transform, backdrop-filter'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-name="Story Button"
            >
              <div aria-hidden="true" className="absolute border-[1.89px] border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[18.902px]" />
              <Info />
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[18px] text-center drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                <p className="leading-[24px]">Story</p>
              </div>
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[12px] text-center opacity-80 drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                <p className="leading-[16px]">Learn our mission</p>
              </div>
            </motion.button>

            {/* Join Button */}
            <motion.button
              variants={{ 
                hidden: { opacity: 0, y: 20 }, 
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } 
              }}
              onClick={() => onNavigate('up')}
              className="glass-button box-border content-stretch flex flex-col gap-[8px] h-[150px] items-center justify-center px-[16px] py-[20px] rounded-[18.902px] w-full max-w-[180px] mx-auto relative hover:bg-[rgba(0,0,0,0.4)] transition-all duration-200 shadow-lg"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                willChange: 'transform, backdrop-filter'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-name="Join Button"
            >
              <div aria-hidden="true" className="absolute border-[1.89px] border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[18.902px]" />
              <JoinSvg />
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[18px] text-center drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                <p className="leading-[24px]">Join</p>
              </div>
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fdfdfd] text-[12px] text-center opacity-80 drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                <p className="leading-[16px]">Build the network</p>
              </div>
            </motion.button>
          </motion.div>

          {/* Journey hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
            className="text-sm drop-shadow-md" 
            style={{ color: '#1CAFBF', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
          >
            Pick Your Journey
          </motion.div>
        </motion.div>
      </div>


    </div>
  );
}