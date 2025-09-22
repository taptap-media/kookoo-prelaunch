import { useState } from 'react';

export type ScreenType = 'campaign' | 'hero' | 'narrative' | 'passenger' | 'cargo' | 'community' | 'partners' | 'cta';

interface NavigationState {
  currentScreen: ScreenType;
  slideDirection: 'up' | 'down' | 'left' | 'right';
  campaignCompleted: boolean;
}

const screenMap: Record<ScreenType, {
  up?: ScreenType;
  down?: ScreenType;
  left?: ScreenType;
  right?: ScreenType;
}> = {
  campaign: {
    left: 'hero',
    right: 'hero'
  },
  hero: {
    up: 'campaign',
    down: 'narrative',
    left: 'cargo',
    right: 'passenger'
  },
  narrative: {
    up: 'hero',
    down: 'community'
  },
  passenger: {
    left: 'hero',
    down: 'community'
  },
  cargo: {
    right: 'hero',
    down: 'community'
  },
  community: {
    up: 'hero',
    down: 'cta'
  },
  partners: {
    down: 'community'
  },
  cta: {
    up: 'community'
  }
};

export function useAppNavigation() {
  const [state, setState] = useState<NavigationState>({
    currentScreen: 'campaign',
    slideDirection: 'down',
    campaignCompleted: false
  });

  const navigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    const currentScreenConfig = screenMap[state.currentScreen];
    const nextScreen = currentScreenConfig[direction];
    
    // Special case: Don't allow going up to campaign if completed
    if (direction === 'up' && state.currentScreen === 'hero' && state.campaignCompleted) {
      return;
    }
    
    if (nextScreen) {
      setState(prev => ({
        ...prev,
        currentScreen: nextScreen,
        slideDirection: direction
      }));
    }
  };

  const completeCompaign = (userType: 'passenger' | 'cargo' | 'partner') => {
    setState(prev => ({
      ...prev,
      campaignCompleted: true,
      currentScreen: userType === 'partner' ? 'partners' : userType,
      slideDirection: 'right'
    }));
  };

  const goToScreen = (screen: ScreenType) => {
    setState(prev => ({
      ...prev,
      currentScreen: screen,
      slideDirection: 'right'
    }));
  };

  return {
    ...state,
    navigate,
    completeCompaign,
    goToScreen
  };
}