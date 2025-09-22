import { useState } from 'react';

export interface UserJourneyData {
  // Campaign data
  email?: string;
  userType?: 'passenger' | 'cargo' | 'partner';
  
  // Route data
  origin?: string;
  destination?: string;
  
  // Passenger-specific data
  passengerDetails?: {
    timeline?: string;
    travelers?: string;
    travelReasons?: string[]; // Multiple reasons
    specificEvents?: string[]; // Specific events they're interested in
    preferences?: string[];
  };
  
  // Cargo-specific data
  cargoDetails?: {
    cargoTypes?: string[]; // Multiple cargo types
    weight?: string;
    timeline?: string;
    specificNeeds?: string[]; // Specific shipping needs
    specialRequirements?: string[];
  };
  
  // Partner data
  partnerDetails?: {
    organizationType?: string;
    interests?: string[];
  };
}

export function useUserJourney() {
  const [journeyData, setJourneyData] = useState<UserJourneyData>({});

  const updateJourneyData = (updates: Partial<UserJourneyData>) => {
    setJourneyData(prev => ({ ...prev, ...updates }));
  };

  const updatePassengerDetails = (updates: Partial<UserJourneyData['passengerDetails']>) => {
    setJourneyData(prev => ({
      ...prev,
      passengerDetails: { ...prev.passengerDetails, ...updates }
    }));
  };

  const updateCargoDetails = (updates: Partial<UserJourneyData['cargoDetails']>) => {
    setJourneyData(prev => ({
      ...prev,
      cargoDetails: { ...prev.cargoDetails, ...updates }
    }));
  };

  const updatePartnerDetails = (updates: Partial<UserJourneyData['partnerDetails']>) => {
    setJourneyData(prev => ({
      ...prev,
      partnerDetails: { ...prev.partnerDetails, ...updates }
    }));
  };

  const resetJourney = () => {
    setJourneyData({});
  };

  const isRouteSet = () => {
    return Boolean(journeyData.origin && journeyData.destination);
  };

  const isEmailSet = () => {
    return Boolean(journeyData.email);
  };

  const isUserTypeSet = () => {
    return Boolean(journeyData.userType);
  };

  return {
    journeyData,
    updateJourneyData,
    updatePassengerDetails,
    updateCargoDetails,
    updatePartnerDetails,
    resetJourney,
    isRouteSet,
    isEmailSet,
    isUserTypeSet
  };
}