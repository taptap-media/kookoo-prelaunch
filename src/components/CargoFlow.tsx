import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowDown, Package, Truck, Clock, CheckCircle, Check, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { caribbeanCountries } from '../data/countries';
import { useUserJourney } from '../hooks/useUserJourney';
import { cargoCategories } from '../data/events';

interface CargoFlowProps {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  userJourney: ReturnType<typeof useUserJourney>;
}

const urgencyLevels = [
  { value: 'urgent', label: 'Urgent (1-3 days)', color: '#d4183d', description: 'Express shipping needed' },
  { value: 'priority', label: 'Priority (1 week)', color: '#FB8500', description: 'Fast but cost-effective' },
  { value: 'standard', label: 'Standard (2-4 weeks)', color: '#FFB703', description: 'Regular shipping schedule' },
  { value: 'economical', label: 'Economical (1-2 months)', color: '#1CAFBF', description: 'Cost-optimized, flexible timing' },
  { value: 'bulk', label: 'Bulk/Seasonal', color: '#023047', description: 'Large volumes, best rates' }
];

const weightOptions = [
  { value: 'under-50lbs', label: 'Under 50 lbs', description: 'Small packages' },
  { value: '50-200lbs', label: '50-200 lbs', description: 'Medium boxes' },
  { value: '200-500lbs', label: '200-500 lbs', description: 'Large items' },
  { value: '500-1000lbs', label: '500-1000 lbs', description: 'Heavy cargo' },
  { value: '1000-2000lbs', label: '1000-2000 lbs', description: '0.5-1 ton' },
  { value: 'over-2000lbs', label: 'Over 2000 lbs', description: '1+ ton' },
  { value: 'pallet', label: '1 Standard Pallet', description: 'Palletized cargo' },
  { value: 'multiple-pallets', label: 'Multiple Pallets', description: 'Bulk shipment' },
  { value: 'container', label: 'Full Container', description: '20/40 ft container' }
];

const specialRequirements = [
  { id: 'refrigerated', label: 'Refrigerated', icon: '🧊', description: 'Cold chain' },
  { id: 'fragile', label: 'Fragile', icon: '📦', description: 'Special handling' },
  { id: 'hazardous', label: 'Hazardous', icon: '⚠️', description: 'Special permits' },
  { id: 'oversized', label: 'Oversized', icon: '📏', description: 'Non-standard size' },
  { id: 'high-value', label: 'High Value', icon: '🔒', description: 'Insurance needed' },
  { id: 'perishable', label: 'Perishable', icon: '⏰', description: 'Time-sensitive' }
];

const STEPS = {
  ROUTE: 0,
  CARGO_TYPES: 1,
  SIZE_URGENCY: 2,
  SPECIAL_REQUIREMENTS: 3,
  RESULTS: 4
} as const;

export function CargoFlow({ onNavigate, userJourney }: CargoFlowProps) {
  const [currentStep, setCurrentStep] = useState(STEPS.ROUTE);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargoTypes: [] as string[],
    weight: '',
    urgency: '',
    specialNeeds: [] as string[]
  });

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
        // If currently at the route step, move to cargo types; otherwise keep current step
        setCurrentStep(prevStep => prevStep === STEPS.ROUTE ? STEPS.CARGO_TYPES : prevStep);
      }
    } catch (error) {
      console.error('Error initializing CargoFlow:', error);
    } finally {
      didInitFromCampaignRef.current = true;
    }
  // run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateForm = (updates: Partial<typeof formData>) => {
    try {
      const newFormData = { ...formData, ...updates };
      setFormData(newFormData);
      
      // Update global journey state
      userJourney.updateJourneyData({
        origin: newFormData.origin,
        destination: newFormData.destination
      });
      
      userJourney.updateCargoDetails({
        cargoTypes: newFormData.cargoTypes,
        weight: newFormData.weight,
        timeline: newFormData.urgency,
        specificNeeds: newFormData.specialNeeds
      });
    } catch (error) {
      console.error('Error updating cargo form:', error);
    }
  };

  const toggleSelection = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleNext = () => {
    // Enforce validation before advancing
    if (!canProceed()) return;
    if (currentStep < STEPS.RESULTS) {
      setCurrentStep(currentStep + 1);
    } else {
      onNavigate('down');
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.ROUTE) {
      // Handle back navigation - always go to previous step
      setCurrentStep(currentStep - 1);
    } else {
      // Only exit to main navigation when at the first step
      onNavigate('right');
    }
  };

  const calculateEstimatedCost = () => {
    if (!formData.weight || !formData.urgency) return null;
    
    const baseRates = { urgent: 15, priority: 8, standard: 5, economical: 3, bulk: 2 };
    const weightMultipliers = { 
      'under-50lbs': 1, '50-200lbs': 1.5, '200-500lbs': 2, '500-1000lbs': 3,
      '1000-2000lbs': 4, 'over-2000lbs': 6, 'pallet': 4, 'multiple-pallets': 8, 'container': 15 
    };
    
    const urgencyRate = baseRates[formData.urgency as keyof typeof baseRates] || 5;
    const weightMult = weightMultipliers[formData.weight as keyof typeof weightMultipliers] || 1;
    const specialMult = 1 + (formData.specialNeeds.length * 0.2);
    
    return Math.round(urgencyRate * weightMult * specialMult * 50);
  };

  const canProceed = () => {
    switch (currentStep) {
      case STEPS.ROUTE: 
        // If route is set from campaign, don't need to validate route again
        if (userJourney.isRouteSet()) {
          return true;
        }
        return formData.origin && formData.destination;
      case STEPS.CARGO_TYPES: return formData.cargoTypes.length > 0;
      case STEPS.SIZE_URGENCY: return formData.weight && formData.urgency;
      case STEPS.SPECIAL_REQUIREMENTS: return true; // Optional step
      case STEPS.RESULTS: return true;
      default: return true;
    }
  };

  const steps = [
    // Step 0: Route Selection
    <div key="step0" className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        {userJourney.isRouteSet() ? (
          <>
            <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#FB8500' }} />
            <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Great! Let's ship your cargo</h2>
            <div className="mt-4 p-4 bg-[#FFF4E6] rounded-lg">
              <div className="flex items-center justify-center gap-2 text-lg" style={{ color: '#023047' }}>
                {caribbeanCountries.find(c => c.value === formData.origin)?.flag}
                <span className="mx-2">→</span>
                {caribbeanCountries.find(c => c.value === formData.destination)?.flag}
              </div>
            </div>
          </>
        ) : (
          <>
            <Package className="w-12 h-12 mx-auto mb-4" style={{ color: '#FB8500' }} />
            <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Where are you shipping?</h2>
          </>
        )}
      </div>

      {!userJourney.isRouteSet() && (
        <div className="space-y-4">
          <div>
            <Label>From which island?</Label>
            <Select value={formData.origin} onValueChange={(value) => updateForm({origin: value})}>
              <SelectTrigger className="mt-1">
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
            <Label>To which island?</Label>
            <Select value={formData.destination} onValueChange={(value) => updateForm({destination: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select destination island..." />
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
        </div>
      )}

      <div className="mt-6 rounded-lg overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1724120996945-88eb4637bfc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJpYmJlYW4lMjBmcmVzaCUyMHByb2R1Y2UlMjBtYW5nb2VzfGVufDF8fHx8MTc1ODIwNzcxOHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Caribbean cargo shipping"
          className="w-full h-32 object-cover"
        />
      </div>
    </div>,

    // Step 1: Cargo Types (Multiple choice)
    <div key="step1" className="max-w-md mx-auto h-full flex flex-col">
      <div className="mb-6 text-center flex-shrink-0">
        <Package className="w-12 h-12 mx-auto mb-4" style={{ color: '#FB8500' }} />
        <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>What are you shipping?</h2>
        <p style={{ color: '#717182' }}>Select all cargo types that apply</p>
        {formData.cargoTypes.length > 0 && (
          <div className="mt-3 p-2 bg-orange-50 rounded-md">
            <p className="text-sm" style={{ color: '#FB8500' }}>
              📦 {formData.cargoTypes.length} type{formData.cargoTypes.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {cargoCategories.map((cargo) => (
          <motion.button
            key={cargo.id}
            onClick={(e) => {
              e.stopPropagation();
              updateForm({ cargoTypes: toggleSelection(formData.cargoTypes, cargo.id) });
            }}
            className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all text-left ${
              formData.cargoTypes.includes(cargo.id)
                ? 'border-[#FB8500] bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            data-no-swipe="true"
          >
            <div className="text-2xl flex-shrink-0">{cargo.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium" style={{ color: '#023047' }}>{cargo.label}</span>
                {formData.cargoTypes.includes(cargo.id) && (
                  <Check className="w-4 h-4 text-[#FB8500] flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{cargo.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {cargo.examples.slice(0, 3).map((example, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {formData.cargoTypes.length === 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Please select at least one cargo type to continue.
            </p>
          </div>
        </div>
      )}

      {formData.cargoTypes.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => updateForm({ cargoTypes: [] })}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all selections
          </button>
        </div>
      )}
    </div>,

    // Step 2: Size & Urgency
    <div key="step2" className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        <Truck className="w-12 h-12 mx-auto mb-4" style={{ color: '#1CAFBF' }} />
        <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Size & urgency</h2>
        <p style={{ color: '#717182' }}>Help us calculate shipping costs and timing</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Approximate weight/volume</Label>
          <Select value={formData.weight} onValueChange={(value) => updateForm({weight: value})}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select cargo size..." />
            </SelectTrigger>
            <SelectContent>
              {weightOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-sm text-gray-500 ml-2">- {option.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Shipping urgency</Label>
          <Select value={formData.urgency} onValueChange={(value) => updateForm({urgency: value})}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="How quickly do you need it?" />
            </SelectTrigger>
            <SelectContent>
              {urgencyLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  <div>
                    <span className="font-medium">{level.label}</span>
                    <p className="text-xs text-gray-500">{level.description}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>,

    // Step 3: Special Requirements
    <div key="step3" className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#FFB703' }} />
        <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Special requirements?</h2>
        <p style={{ color: '#717182' }}>Select any special handling needs (optional)</p>
        {formData.specialNeeds.length > 0 && (
          <div className="mt-3 p-2 bg-yellow-50 rounded-md">
            <p className="text-sm" style={{ color: '#FFB703' }}>
              ⚠️ {formData.specialNeeds.length} requirement{formData.specialNeeds.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {specialRequirements.map((req) => (
          <motion.button
            key={req.id}
            onClick={(e) => {
              e.stopPropagation();
              updateForm({ specialNeeds: toggleSelection(formData.specialNeeds, req.id) });
            }}
            className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all text-center min-h-[80px] ${
              formData.specialNeeds.includes(req.id)
                ? 'border-[#FFB703] bg-yellow-50' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-no-swipe="true"
          >
            <div className="text-lg">{req.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-center gap-1">
                <span className="text-xs font-medium text-center leading-tight">{req.label}</span>
                {formData.specialNeeds.includes(req.id) && (
                  <Check className="w-3 h-3 text-[#FFB703] flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{req.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {formData.specialNeeds.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => updateForm({ specialNeeds: [] })}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all requirements
          </button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Special requirements may affect shipping costs but help ensure 
          your cargo arrives safely and on time.
        </p>
      </div>
    </div>,

    // Step 4: Results & Pool Summary
    <div key="step4" className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#FB8500' }} />
          <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
            <Users className="w-8 h-8" style={{ color: '#FB8500' }} />
          </div>
        </div>
        <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>Join the cargo pool!</h2>
        <p style={{ color: '#717182' }}>Your shipping request helps build demand for this route</p>
      </div>

      {/* Cost estimate */}
      {calculateEstimatedCost() && (
        <Card className="mb-6 border-[#1CAFBF]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg" style={{ color: '#023047' }}>Estimated Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2" style={{ color: '#1CAFBF' }}>
              ${calculateEstimatedCost()}
            </div>
            <div className="text-sm text-gray-600">
              {urgencyLevels.find(u => u.value === formData.urgency)?.label}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pool progress */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <span style={{ color: '#717182' }}>Current Pool Volume</span>
          <span style={{ color: '#023047' }}>
            {2.3 + (formData.cargoTypes.length * 0.5)} tons
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="h-3 rounded-full transition-all duration-1000"
            style={{ 
              backgroundColor: '#FB8500', 
              width: `${Math.min(46 + (formData.cargoTypes.length * 8), 95)}%` 
            }}
          />
        </div>
        
        <div className="text-sm mb-4" style={{ color: '#717182' }}>
          {Math.min(46 + (formData.cargoTypes.length * 8), 95)}% towards 5-ton minimum
        </div>

        <div className="text-xs p-3 rounded-lg" style={{ backgroundColor: '#FFB703', color: '#023047' }}>
          💡 Pool shipping reduces costs by up to 40%
        </div>
      </div>

      {/* Shipping summary */}
      <div className="space-y-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium mb-3" style={{ color: '#023047' }}>
            Your Shipping Profile:
          </h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#717182' }}>Cargo types:</span>
              <span style={{ color: '#023047' }}>{formData.cargoTypes.length} selected</span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#717182' }}>Weight/Size:</span>
              <span style={{ color: '#023047' }}>
                {weightOptions.find(w => w.value === formData.weight)?.label || 'Not specified'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#717182' }}>Urgency:</span>
              <span style={{ color: '#023047' }}>
                {urgencyLevels.find(u => u.value === formData.urgency)?.label || 'Not specified'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: '#717182' }}>Special needs:</span>
              <span style={{ color: '#023047' }}>{formData.specialNeeds.length} requirements</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-orange-600" />
            <h4 className="text-sm font-medium" style={{ color: '#023047' }}>
              Next Steps:
            </h4>
          </div>
          <ul className="text-sm space-y-1" style={{ color: '#717182' }}>
            <li>• We'll match you with other shippers on this route</li>
            <li>• Get quotes from registered cargo partners</li>
            <li>• Receive updates on pool progress and timeline</li>
          </ul>
        </div>
      </div>

      {/* Selected cargo types */}
      {formData.cargoTypes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium" style={{ color: '#023047' }}>Your cargo types:</h4>
          <div className="flex flex-wrap gap-2">
            {formData.cargoTypes.map(typeId => {
              const type = cargoCategories.find(c => c.id === typeId);
              return type ? (
                <Badge 
                  key={typeId} 
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: '#FB850020', color: '#FB8500' }}
                >
                  {type.icon} {type.label}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
        <p className="text-sm text-blue-800">
          🚚 <strong>Thank you!</strong> Your cargo demand helps us understand which routes to prioritize. 
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
            {currentStep === STEPS.ROUTE ? 'Home' : 'Back'}
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
                      index <= adjustedStep ? 'bg-[#FB8500]' : 'bg-gray-300'
                    }`}
                    aria-label={`Step ${index + 1}${index <= adjustedStep ? ' completed' : ''}`}
                  />
                );
              });
            })()}
          </div>

          {userJourney.isEmailSet() && (
            <div className="text-xs" style={{ color: '#FB8500' }}>
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
              aria-label={currentStep === 0 ? 'Return to home' : 'Go back to previous step'}
            >
              {currentStep === STEPS.ROUTE ? 'Home' : 'Back'}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 text-white"
              style={{ backgroundColor: canProceed() ? '#FB8500' : '#94a3b8' }}
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