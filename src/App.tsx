import { useState } from 'react';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { useUserJourney } from './hooks/useUserJourney';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingHero } from './components/LandingHero';
import { OriginalLandingHero } from './components/OriginalLandingHero';
import { NarrativeSection } from './components/NarrativeSection';
import { PassengerFlow } from './components/PassengerFlow';
import { CargoFlow } from './components/CargoFlow';
import { CommunityFeedback } from './components/CommunityFeedback';
import { PartnersSection } from './components/PartnersSection';
import { FinalCTA } from './components/FinalCTA';
import { CuckooDotsCompaign } from './components/CuckooDotsCompaign';
import { BrandFoundation } from './components/BrandFoundation';

type ScreenType = 'campaign' | 'hero' | 'original-hero' | 'narrative' | 'passenger' | 'cargo' | 'community' | 'partners' | 'cta' | 'brand';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('original-hero');
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [campaignCompleted, setCampaignCompleted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const userJourney = useUserJourney();

  const handleCampaignComplete = (data: { 
    type: 'passenger' | 'cargo' | 'partner', 
    origin: string, 
    destination: string, 
    email: string 
  }) => {
    try {
      // Store campaign data in global journey state
      userJourney.updateJourneyData({
        userType: data.type,
        origin: data.origin,
        destination: data.destination,
        email: data.email
      });
      
      setCampaignCompleted(true);
      
      // Route to appropriate flow
      if (data.type === 'partner') {
        setCurrentScreen('partners');
      } else {
        setCurrentScreen(data.type);
      }
      setSlideDirection('right');
    } catch (error) {
      console.error('Error completing campaign:', error);
      // Fallback to original hero screen
      setCurrentScreen('original-hero');
    }
  };

  const navigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    // Prevent multiple rapid navigation calls
    if (isNavigating) return;
    
    try {
      setIsNavigating(true);
      setSlideDirection(direction);
      
      // Simple navigation logic
      switch (currentScreen) {
        case 'campaign':
          if (direction === 'left' || direction === 'right') setCurrentScreen('original-hero');
          break;
        case 'hero':
          if (direction === 'up') setCurrentScreen('partners');
          if (direction === 'down') setCurrentScreen('narrative');
          if (direction === 'left') setCurrentScreen('cargo');
          if (direction === 'right') setCurrentScreen('passenger');
          break;
        case 'original-hero':
          if (direction === 'up') setCurrentScreen('partners');
          if (direction === 'down') setCurrentScreen('narrative');
          if (direction === 'left') setCurrentScreen('cargo');
          if (direction === 'right') setCurrentScreen('passenger');
          break;
        case 'narrative':
          if (direction === 'up') setCurrentScreen('original-hero');
          if (direction === 'down') setCurrentScreen('community');
          break;
        case 'passenger':
          if (direction === 'left') setCurrentScreen('original-hero');
          if (direction === 'down') setCurrentScreen('community');
          break;
        case 'cargo':
          if (direction === 'right') setCurrentScreen('original-hero');
          if (direction === 'down') setCurrentScreen('community');
          break;
        case 'community':
          if (direction === 'up') setCurrentScreen('original-hero');
          if (direction === 'down') setCurrentScreen('cta');
          break;
        case 'partners':
          if (direction === 'up') setCurrentScreen('original-hero');
          if (direction === 'down') setCurrentScreen('community');
          break;
        case 'cta':
          if (direction === 'up') setCurrentScreen('community');
          break;
      }
      
      // Reset navigation lock after transition
      setTimeout(() => setIsNavigating(false), 300);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  // Set up swipe gestures with error handling and debouncing
  useSwipeGesture({
    onSwipeUp: () => !isNavigating && navigate('up'),
    onSwipeDown: () => !isNavigating && navigate('down'),
    onSwipeLeft: () => !isNavigating && navigate('left'),
    onSwipeRight: () => !isNavigating && navigate('right'),
    threshold: 100 // Increased threshold to prevent accidental swipes
  });

  // Simple CSS transition classes instead of heavy animations
  const getTransitionClass = () => {
    const baseClasses = 'transition-all duration-300 ease-in-out';
    switch (slideDirection) {
      case 'up':
        return `${baseClasses} transform translate-y-0`;
      case 'down':
        return `${baseClasses} transform translate-y-0`;
      case 'left':
        return `${baseClasses} transform translate-x-0`;
      case 'right':
        return `${baseClasses} transform translate-x-0`;
      default:
        return baseClasses;
    }
  };

  const renderScreen = () => {
    const commonProps = {
      onNavigate: navigate,
      userJourney
    };

    try {
      switch (currentScreen) {
        case 'campaign':
          return (
            <ErrorBoundary>
              <CuckooDotsCompaign onNavigate={navigate} onComplete={handleCampaignComplete} />
            </ErrorBoundary>
          );
        case 'hero':
          return (
            <ErrorBoundary>
              <LandingHero onNavigate={navigate} userJourney={userJourney} />
            </ErrorBoundary>
          );
        case 'original-hero':
          return (
            <ErrorBoundary>
              <OriginalLandingHero onNavigate={navigate} userJourney={userJourney} />
            </ErrorBoundary>
          );
        case 'narrative':
          return (
            <ErrorBoundary>
              <NarrativeSection {...commonProps} />
            </ErrorBoundary>
          );
        case 'passenger':
          return (
            <ErrorBoundary>
              <PassengerFlow {...commonProps} />
            </ErrorBoundary>
          );
        case 'cargo':
          return (
            <ErrorBoundary>
              <CargoFlow {...commonProps} />
            </ErrorBoundary>
          );
        case 'community':
          return (
            <ErrorBoundary>
              <CommunityFeedback {...commonProps} />
            </ErrorBoundary>
          );
        case 'partners':
          return (
            <ErrorBoundary>
              <PartnersSection {...commonProps} />
            </ErrorBoundary>
          );
        case 'cta':
          return (
            <ErrorBoundary>
              <FinalCTA {...commonProps} />
            </ErrorBoundary>
          );
        case 'brand':
          return (
            <ErrorBoundary>
              <BrandFoundation onBack={() => setCurrentScreen('original-hero')} />
            </ErrorBoundary>
          );
        default:
          return (
            <ErrorBoundary>
              <OriginalLandingHero {...commonProps} />
            </ErrorBoundary>
          );
      }
    } catch (error) {
      console.error('Screen rendering error:', error);
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
            <p className="text-gray-600">Please wait while we load the application.</p>
          </div>
        </div>
      );
    }
  };



  return (
    <div className="w-full h-screen overflow-hidden relative">
      <ErrorBoundary>
        <div key={currentScreen} className={`absolute inset-0 ${getTransitionClass()}`}>
          {renderScreen()}
        </div>

        {/* Development Navigation Menu */}
        <div className="fixed bottom-4 left-4 bg-black/90 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-sm backdrop-blur-sm">
          <div className="mb-3">
            <div className="font-semibold text-yellow-300 mb-1">Current: {currentScreen}</div>
            {campaignCompleted && userJourney.journeyData && (
              <div className="text-green-400 text-[10px]">
                {userJourney.journeyData.userType} | {userJourney.isRouteSet() ? '✓ Route' : '✗ Route'} | {userJourney.isEmailSet() ? '✓ Email' : '✗ Email'}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="text-gray-400 text-[10px] mb-1 uppercase tracking-wide">Main Flow</div>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  onClick={() => setCurrentScreen('campaign')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'campaign' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  Campaign
                </button>
                <button 
                  onClick={() => setCurrentScreen('hero')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'hero' 
                      ? 'bg-gray-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  Hero New
                </button>
                <button 
                  onClick={() => setCurrentScreen('original-hero')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'original-hero' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-cyan-700 hover:bg-cyan-600 text-cyan-100'
                  }`}
                >
                  Hero Original ⭐
                </button>
                <button 
                  onClick={() => setCurrentScreen('narrative')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'narrative' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  Narrative
                </button>
                <button 
                  onClick={() => setCurrentScreen('community')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'community' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  Community
                </button>
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-[10px] mb-1 uppercase tracking-wide">User Flows</div>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  onClick={() => setCurrentScreen('passenger')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'passenger' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-yellow-700 hover:bg-yellow-600 text-yellow-100'
                  }`}
                >
                  Passenger
                </button>
                <button 
                  onClick={() => setCurrentScreen('cargo')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'cargo' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-700 hover:bg-green-600 text-green-100'
                  }`}
                >
                  Cargo
                </button>
                <button 
                  onClick={() => setCurrentScreen('partners')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'partners' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-red-700 hover:bg-red-600 text-red-100'
                  }`}
                >
                  Partners
                </button>
                <button 
                  onClick={() => setCurrentScreen('cta')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'cta' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-700 hover:bg-purple-600 text-purple-100'
                  }`}
                >
                  Final CTA
                </button>
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-[10px] mb-1 uppercase tracking-wide">Utils</div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentScreen('brand')}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${
                    currentScreen === 'brand' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-700 hover:bg-blue-600 text-blue-100'
                  }`}
                >
                  Brand Doc
                </button>
                <button 
                  onClick={() => {
                    setCampaignCompleted(false);
                    // resetJourney is the exposed API in useUserJourney
                    userJourney.resetJourney();
                    setCurrentScreen('campaign');
                  }}
                  className="text-[10px] px-2 py-1 rounded bg-red-700 hover:bg-red-600 text-red-100 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-gray-600 text-[9px] text-gray-400">
            Dev Navigation • Swipe or Click
          </div>
        </div>


      </ErrorBoundary>
    </div>
  );
}