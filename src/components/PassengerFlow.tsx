import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowDown, MapPin, Calendar, Users, Briefcase, GraduationCap, Heart, PartyPopper, CheckCircle, Trophy, Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { caribbeanCountries } from '../data/countries';
import { useUserJourney } from '../hooks/useUserJourney';
import { getEventsByCategory, Event } from '../data/events';

interface PassengerFlowProps {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  userJourney: ReturnType<typeof useUserJourney>;
}

const travelReasons = [
  { id: 'family', label: 'Visit Family', icon: Heart, color: '#FB8500', description: 'Reunions, celebrations, quality time' },
  { id: 'work', label: 'Business', icon: Briefcase, color: '#023047', description: 'Meetings, conferences, trade' },
  { id: 'carnival', label: 'Carnival/Events', icon: PartyPopper, color: '#FFB703', description: 'Cultural celebrations, festivals' },
  { id: 'study', label: 'Education', icon: GraduationCap, color: '#1CAFBF', description: 'Conferences, graduations, training' },
  { id: 'sports', label: 'Sporting Event', icon: Trophy, color: '#8B5CF6', description: 'Competitions, tournaments, games' }
] as const;

const travelTimeframes = [
  { value: 'january-2025', label: 'January 2025', season: 'peak' },
  { value: 'february-2025', label: 'February 2025', season: 'peak' },
  { value: 'march-2025', label: 'March 2025', season: 'high' },
  { value: 'april-2025', label: 'April 2025', season: 'high' },
  { value: 'may-2025', label: 'May 2025', season: 'regular' },
  { value: 'june-2025', label: 'June 2025', season: 'regular' },
  { value: 'july-2025', label: 'July 2025', season: 'high' },
  { value: 'august-2025', label: 'August 2025', season: 'high' },
  { value: 'september-2025', label: 'September 2025', season: 'regular' },
  { value: 'october-2025', label: 'October 2025', season: 'regular' },
  { value: 'november-2025', label: 'November 2025', season: 'regular' },
  { value: 'december-2025', label: 'December 2025', season: 'peak' },
  { value: 'carnival-season', label: 'Carnival Season (Feb-Mar)', season: 'peak' },
  { value: 'summer-holidays', label: 'Summer Holidays (Jul-Aug)', season: 'high' },
  { value: 'christmas-season', label: 'Christmas Season (Dec-Jan)', season: 'peak' },
  { value: 'flexible', label: 'Flexible / Any time', season: 'regular' }
] as const;

const groupSizes = [
  { value: 'solo', label: 'Just me', description: 'Solo traveler', multiplier: 1 },
  { value: 'couple', label: '2 people', description: 'Couple or pair', multiplier: 2 },
  { value: 'small-group', label: '3-5 people', description: 'Small family or group', multiplier: 4 },
  { value: 'family', label: '6-10 people', description: 'Large family group', multiplier: 8 },
  { value: 'large-group', label: '10+ people', description: 'Large group or delegation', multiplier: 15 }
] as const;

const STEPS = {
  ROUTE_DATE: 0,
  TRAVEL_REASONS: 1,
  SPECIFIC_EVENTS: 2,
  GROUP_SIZE: 3,
  RESULTS: 4
} as const;

export function PassengerFlow({ onNavigate, userJourney }: PassengerFlowProps) {
  const [currentStep, setCurrentStep] = useState(STEPS.ROUTE_DATE);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    dates: '',
    reasons: [] as string[],
    specificEvents: [] as string[],
    travelers: ''
  });
  
  const [relevantEvents, setRelevantEvents] = useState<Event[]>([]);

  // Initialize with campaign data if available (only once)
  const didInitFromCampaignRef = useRef(false);
  useEffect(() => {
    if (didInitFromCampaignRef.current) return;
    try {
      if (userJourney.isRouteSet()) {
        const { origin, destination } = userJourney.journeyData;
        setFormData(prev => ({
          ...prev,
          origin: origin || '',
          destination: destination || ''
        }));
        // If currently at the route step, move to reasons; otherwise do not change step
        setCurrentStep(prevStep => prevStep === STEPS.ROUTE_DATE ? STEPS.TRAVEL_REASONS : prevStep);
      }
    } catch (error) {
      console.error('Error initializing PassengerFlow:', error);
    } finally {
      didInitFromCampaignRef.current = true;
    }
  // run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoized event filtering for performance
  const filteredEvents = useMemo(() => {
    if (formData.reasons.length === 0) return [];
    
    const events: Event[] = [];
    formData.reasons.forEach(reason => {
      try {
        const categoryEvents = getEventsByCategory(reason);
        events.push(...categoryEvents);
      } catch (error) {
        console.error(`Error getting events for category ${reason}:`, error);
      }
    });
    
    // Remove duplicates and sort by expected attendance
    const uniqueEvents = events.filter((event, index, arr) => 
      arr.findIndex(e => e.id === event.id) === index
    ).sort((a, b) => {
      const aAttendees = parseInt(a.expectedAttendees?.replace(/[^\d]/g, '') || '0');
      const bAttendees = parseInt(b.expectedAttendees?.replace(/[^\d]/g, '') || '0');
      return bAttendees - aAttendees;
    });
    
    return uniqueEvents;
  }, [formData.reasons]);

  // Update relevant events when filtered events change
  useEffect(() => {
    setRelevantEvents(filteredEvents);
  }, [filteredEvents]);

  const updateForm = (updates: Partial<typeof formData>) => {
    try {
      const newFormData = { ...formData, ...updates };
      setFormData(newFormData);
      
      // Update global journey state with error handling
      if (newFormData.origin || newFormData.destination) {
        userJourney.updateJourneyData({
          origin: newFormData.origin,
          destination: newFormData.destination
        });
      }
      
      userJourney.updatePassengerDetails({
        timeline: newFormData.dates,
        travelReasons: newFormData.reasons,
        specificEvents: newFormData.specificEvents,
        travelers: newFormData.travelers
      });
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  const toggleSelection = (array: string[], item: string): string[] => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleNext = () => {
    try {
      if (currentStep < STEPS.RESULTS) {
        // Enforce validation before advancing
        if (!canProceed()) return;
        // Skip events step if no travel reasons selected
        if (currentStep === STEPS.TRAVEL_REASONS && formData.reasons.length === 0) {
          setCurrentStep(STEPS.GROUP_SIZE);
        } else if (currentStep === STEPS.SPECIFIC_EVENTS && relevantEvents.length === 0) {
          setCurrentStep(STEPS.GROUP_SIZE);
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else {
        // Complete the flow - go to community feedback
        onNavigate('down');
      }
    } catch (error) {
      console.error('Error navigating next:', error);
    }
  };

  const handleBack = () => {
    try {
      if (currentStep > STEPS.ROUTE_DATE) {
        // Handle back navigation with conditional steps
        if (currentStep === STEPS.GROUP_SIZE && relevantEvents.length === 0) {
          setCurrentStep(STEPS.TRAVEL_REASONS);
        } else {
          setCurrentStep(currentStep - 1);
        }
      } else {
        // Only exit to main navigation when at the first step
        onNavigate('left');
      }
    } catch (error) {
      console.error('Error navigating back:', error);
    }
  };

  const getSeasonBadgeColor = (season: string): string => {
    switch (season) {
      case 'peak': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getSeasonIcon = (season: string): string => {
    switch (season) {
      case 'peak': return '🔥';
      case 'high': return '📈';
      default: return '✅';
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case STEPS.ROUTE_DATE: 
        // If route is set from campaign, only need date
        if (userJourney.isRouteSet()) {
          return Boolean(formData.dates);
        }
        return Boolean(formData.origin && formData.destination && formData.dates);
      case STEPS.TRAVEL_REASONS: 
        return formData.reasons.length > 0;
      case STEPS.GROUP_SIZE: 
        return Boolean(formData.travelers);
      case STEPS.RESULTS:
        return true;
      default: 
        return true;
    }
  };

  // Calculate community metrics with more realistic data
  const getCommunityMetrics = () => {
    const baseInterest = 127;
    const reasonMultiplier = formData.reasons.length * 18;
    const eventMultiplier = formData.specificEvents.length * 12;
    const groupMultiplier = groupSizes.find(g => g.value === formData.travelers)?.multiplier || 1;
    
    const totalInterest = baseInterest + reasonMultiplier + eventMultiplier + (groupMultiplier * 3);
    const progressPercentage = Math.min((totalInterest / 250) * 100, 100);
    
    return {
      totalInterest,
      progressPercentage: Math.round(progressPercentage)
    };
  };

  const steps = [
    // Step 0: Route & Date Selection
    <div key="step0" className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        {userJourney.isRouteSet() ? (
          <>
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#1CAFBF' }} />
            <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Perfect! Let's plan your trip</h2>
            <p className="text-sm" style={{ color: '#717182' }}>
              We have your route from the campaign
            </p>
            <div className="mt-4 p-4 bg-[#E6F9FC] rounded-lg border border-[#1CAFBF]/20">
              <div className="flex items-center justify-center gap-2 text-lg" style={{ color: '#023047' }}>
                {caribbeanCountries.find(c => c.value === formData.origin)?.flag}
                <span className="mx-2">→</span>
                {caribbeanCountries.find(c => c.value === formData.destination)?.flag}
              </div>
              <p className="text-sm mt-2" style={{ color: '#717182' }}>
                {caribbeanCountries.find(c => c.value === formData.origin)?.label} → {caribbeanCountries.find(c => c.value === formData.destination)?.label}
              </p>
            </div>
          </>
        ) : (
          <>
            <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: '#1CAFBF' }} />
            <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Where do you want to fly?</h2>
            <p className="text-sm" style={{ color: '#717182' }}>
              Help us understand your travel needs
            </p>
          </>
        )}
      </div>

      <div className="space-y-4">
        {(!userJourney.isRouteSet() || !formData.dates) && (
          <>
            <div>
              <Label htmlFor="origin" className="text-sm">From which island?</Label>
              <Select 
                value={formData.origin} 
                onValueChange={(value) => updateForm({origin: value})}
              >
                <SelectTrigger className="mt-1" id="origin">
                  <SelectValue placeholder="Select origin island..." />
                </SelectTrigger>
                <SelectContent>
                  {caribbeanCountries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      <div className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="destination" className="text-sm">To which island?</Label>
              <Select 
                value={formData.destination} 
                onValueChange={(value) => updateForm({destination: value})}
              >
                <SelectTrigger className="mt-1" id="destination">
                  <SelectValue placeholder="Select destination island..." />
                </SelectTrigger>
                <SelectContent>
                  {caribbeanCountries.filter(c => c.value !== formData.origin).map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      <div className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dates" className="text-sm">When do you want to travel?</Label>
              <Select 
                value={formData.dates} 
                onValueChange={(value) => updateForm({dates: value})}
              >
                <SelectTrigger className="mt-1" id="dates">
                  <SelectValue placeholder="Select travel timeframe..." />
                </SelectTrigger>
                <SelectContent>
                  {travelTimeframes.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{timeframe.label}</span>
                        <Badge 
                          variant="secondary" 
                          className={`ml-2 text-xs ${getSeasonBadgeColor(timeframe.season)}`}
                        >
                          {getSeasonIcon(timeframe.season)} {timeframe.season}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.dates && (
                <div className="mt-2 p-2 rounded-md bg-gray-50">
                  <p className="text-xs" style={{ color: '#717182' }}>
                    {travelTimeframes.find(t => t.value === formData.dates)?.season === 'peak' 
                      ? '🔥 Peak season - highest demand and prices' 
                      : travelTimeframes.find(t => t.value === formData.dates)?.season === 'high'
                      ? '📈 High season - increased demand'
                      : '✅ Regular season - good availability and value'
                    }
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>,

    // Step 1: Travel Reasons (Multiple choice)
    <div key="step1" className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#FFB703' }} />
        <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Why do you travel?</h2>
        <p style={{ color: '#717182' }}>Select all that apply - this helps us prioritize routes</p>
        {formData.reasons.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <p className="text-sm" style={{ color: '#1CAFBF' }}>
              ✨ {formData.reasons.length} reason{formData.reasons.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {travelReasons.map((reason) => (
          <motion.button
            key={reason.id}
            onClick={(e) => {
              e.stopPropagation();
              updateForm({ reasons: toggleSelection(formData.reasons, reason.id) });
            }}
            className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all text-left ${
              formData.reasons.includes(reason.id)
                ? 'border-current bg-gray-50' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            style={{ 
              borderColor: formData.reasons.includes(reason.id) ? reason.color : undefined,
              color: formData.reasons.includes(reason.id) ? reason.color : '#717182'
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            aria-pressed={formData.reasons.includes(reason.id)}
            aria-describedby={`reason-${reason.id}-desc`}
            data-no-swipe="true"
          >
            <reason.icon className="w-8 h-8 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{reason.label}</span>
                {formData.reasons.includes(reason.id) && (
                  <Check className="w-4 h-4" style={{ color: reason.color }} />
                )}
              </div>
              <p id={`reason-${reason.id}-desc`} className="text-sm opacity-75 mt-1">
                {reason.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {formData.reasons.length === 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">
              Please select at least one travel reason to continue.
            </p>
          </div>
        </div>
      )}
    </div>,

    // Step 2: Specific Events
    <div key="step2" className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#FB8500' }} />
        <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Any specific events?</h2>
        <p style={{ color: '#717182' }}>Select events you're interested in attending</p>
        {formData.specificEvents.length > 0 && (
          <div className="mt-3 p-2 bg-orange-50 rounded-md">
            <p className="text-sm" style={{ color: '#FB8500' }}>
              🎯 {formData.specificEvents.length} event{formData.specificEvents.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>

      {relevantEvents.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {relevantEvents.map((event) => (
            <Card 
              key={event.id} 
              className={`cursor-pointer transition-all ${
                formData.specificEvents.includes(event.id)
                  ? 'ring-2 ring-[#1CAFBF] bg-blue-50' 
                  : 'hover:shadow-md hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                updateForm({ specificEvents: toggleSelection(formData.specificEvents, event.id) });
              }}
              data-no-swipe="true"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm line-clamp-2">{event.name}</CardTitle>
                  {formData.specificEvents.includes(event.id) && (
                    <Check className="w-4 h-4 text-[#1CAFBF] flex-shrink-0 mt-1" />
                  )}
                </div>
                <CardDescription className="text-xs">
                  {event.location} • {event.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {event.description}
                </p>
                {event.expectedAttendees && (
                  <Badge variant="outline" className="text-xs">
                    👥 {event.expectedAttendees} expected
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p style={{ color: '#717182' }} className="mb-4">
            No specific events found for your travel reasons
          </p>
          <Button
            onClick={() => setCurrentStep(STEPS.GROUP_SIZE)}
            variant="outline"
            className="mt-4"
          >
            Skip Events - Continue
          </Button>
        </div>
      )}

      {relevantEvents.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => updateForm({ specificEvents: [] })}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
            disabled={formData.specificEvents.length === 0}
          >
            Clear all selections
          </button>
        </div>
      )}
    </div>,

    // Step 3: Group Size
    <div key="step3" className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#1CAFBF' }} />
        <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>How many travelers?</h2>
        <p style={{ color: '#717182' }}>
          This helps us understand demand patterns and group booking needs
        </p>
      </div>

      <div className="space-y-3">
        {groupSizes.map((option) => (
          <motion.button
            key={option.value}
            onClick={(e) => {
              e.stopPropagation();
              updateForm({ travelers: option.value });
            }}
            className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all ${
              formData.travelers === option.value
                ? 'border-[#1CAFBF] bg-blue-50 text-[#023047]' 
                : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            aria-pressed={formData.travelers === option.value}
            data-no-swipe="true"
          >
            <div className="text-left">
              <div className="font-medium">{option.label}</div>
              <div className="text-sm opacity-75">{option.description}</div>
            </div>
            <div className="flex items-center gap-2">
              {formData.travelers === option.value && (
                <Check className="w-5 h-5 text-[#1CAFBF]" />
              )}
              <Badge variant="outline" className="text-xs">
                x{option.multiplier}
              </Badge>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Group Impact:</strong> Larger groups have more influence on route viability 
          and help secure better group rates when routes launch.
        </p>
      </div>

      {/* Quick Summary Preview */}
      {formData.travelers && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="text-center">
            <div className="text-lg mb-2" style={{ color: '#023047' }}>
              ✅ Ready to Join the Community!
            </div>
            <div className="text-sm" style={{ color: '#717182' }}>
              {formData.reasons.length} travel reason{formData.reasons.length !== 1 ? 's' : ''} • 
              {formData.specificEvents.length} event{formData.specificEvents.length !== 1 ? 's' : ''} • 
              {groupSizes.find(g => g.value === formData.travelers)?.label}
            </div>
            <div className="text-xs mt-2" style={{ color: '#22c55e' }}>
              Your demand will help prioritize this route!
            </div>
          </div>
        </motion.div>
      )}
    </div>,

    // Step 4: Results Summary
    <div key="step4" className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#1CAFBF' }} />
          <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
            <Users className="w-8 h-8" style={{ color: '#1CAFBF' }} />
          </div>
        </div>
        <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Your journey matters!</h2>
        <p style={{ color: '#717182' }}>
          {formData.origin && formData.destination ? (
            <>
              {caribbeanCountries.find(c => c.value === formData.origin)?.label} → {caribbeanCountries.find(c => c.value === formData.destination)?.label}
            </>
          ) : (
            'Building demand for your route'
          )}
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <span style={{ color: '#717182' }}>Community Interest</span>
          <span style={{ color: '#023047' }} className="font-semibold">
            {getCommunityMetrics().totalInterest} people
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="h-3 rounded-full transition-all duration-1000"
            style={{ 
              backgroundColor: '#1CAFBF', 
              width: `${getCommunityMetrics().progressPercentage}%` 
            }}
          />
        </div>
        
        <div className="text-sm" style={{ color: '#717182' }}>
          {getCommunityMetrics().progressPercentage}% towards minimum viable route
        </div>
      </div>

      {/* Enhanced summary with breakdown */}
      <div className="space-y-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium mb-3" style={{ color: '#023047' }}>
            Your Travel Profile:
          </h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#717182' }}>Travel reasons:</span>
              <span style={{ color: '#023047' }}>{formData.reasons.length} selected</span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#717182' }}>Specific events:</span>
              <span style={{ color: '#023047' }}>{formData.specificEvents.length} interested</span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#717182' }}>Group size:</span>
              <span style={{ color: '#023047' }}>
                {groupSizes.find(g => g.value === formData.travelers)?.label || 'Not specified'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#717182' }}>Timeline:</span>
              <span style={{ color: '#023047' }}>
                {travelTimeframes.find(t => t.value === formData.dates)?.label || 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="text-sm font-medium" style={{ color: '#023047' }}>
              Next Steps:
            </h4>
          </div>
          <ul className="text-sm space-y-1" style={{ color: '#717182' }}>
            <li>• We'll notify you when this route reaches viability</li>
            <li>• Connect with other travelers on the same route</li>
            <li>• Get exclusive access to launch pricing</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          ✈️ <strong>Thank you!</strong> Your travel intent helps us understand which routes to prioritize. 
          We'll keep you updated on this route's progress.
        </p>
      </div>
    </div>
  ];

  return (
    <div className="h-screen w-full" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm"
            style={{ color: '#717182' }}
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === STEPS.ROUTE_DATE ? 'Home' : 'Back'}
          </button>
          
          <div className="flex gap-2" aria-label="Progress indicator">
            {(() => {
              const totalSteps = userJourney.isRouteSet() ? 4 : 5; // Skip route step if from campaign
              return Array.from({ length: totalSteps }, (_, index) => {
                const adjustedStep = userJourney.isRouteSet() ? currentStep - 1 : currentStep;
                return (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index <= adjustedStep ? 'bg-[#1CAFBF]' : 'bg-gray-300'
                    }`}
                    aria-label={`Step ${index + 1}${index <= adjustedStep ? ' completed' : ''}`}
                  />
                );
              });
            })()}
          </div>

          {userJourney.isEmailSet() && (
            <div className="text-xs" style={{ color: '#1CAFBF' }}>
              ✓ {userJourney.journeyData.email?.split('@')[0]}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" data-no-swipe="true">
          <div className="flex items-center justify-center min-h-full p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
                data-no-swipe="true"
              >
                {steps[currentStep]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex gap-4 max-w-md mx-auto">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              className="flex-1"
              aria-label={currentStep === STEPS.ROUTE_DATE ? 'Return to home' : 'Go back to previous step'}
            >
              {currentStep === STEPS.ROUTE_DATE ? 'Home' : 'Back'}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 text-white"
              style={{ backgroundColor: canProceed() ? '#1CAFBF' : '#94a3b8' }}
              aria-label={currentStep === STEPS.RESULTS ? 'View community feedback' : 'Continue to next step'}
            >
              {currentStep === STEPS.RESULTS ? (
                <>View Community <ArrowDown className="w-4 h-4 ml-1" /></>
              ) : (
                <>Continue <ArrowRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}