import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Plane, Package, Users, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { caribbeanCountries } from '../data/countries';

interface CuckooDotsCompaignProps {
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onComplete?: (data: { type: 'passenger' | 'cargo' | 'partner', origin: string, destination: string, email: string }) => void;
}

type CampaignFrame = 'call' | 'invitation' | 'action';

interface DotStory {
  id: string;
  icon: React.ReactNode;
  title: string;
  story: string;
  color: string;
  position: { x: number; y: number };
}



const dotStories: DotStory[] = [
  {
    id: 'passenger-home',
    icon: <Users className="w-4 h-4" />,
    title: 'A passenger heading home',
    story: 'Maria needs to visit her grandmother in Dominica for her 90th birthday.',
    color: '#1CAFBF',
    position: { x: 30, y: 40 }
  },
  {
    id: 'farmer-mangoes',
    icon: <Package className="w-4 h-4" />,
    title: 'A farmer shipping mangoes',
    story: 'Joseph grows the sweetest mangoes in Saint Lucia but needs fresh delivery to Trinidad.',
    color: '#FFB703',
    position: { x: 60, y: 20 }
  },
  {
    id: 'festival-traveler',
    icon: <Plane className="w-4 h-4" />,
    title: 'A festival traveler hopping islands',
    story: 'Sarah wants to experience Carnival in 3 different islands this season.',
    color: '#FB8500',
    position: { x: 80, y: 70 }
  }
];

export function CuckooDotsCompaign({ onNavigate, onComplete }: CuckooDotsCompaignProps) {
  const [currentFrame, setCurrentFrame] = useState<CampaignFrame>('call');
  const [formData, setFormData] = useState({
    type: '' as 'passenger' | 'cargo' | 'partner' | '',
    origin: '',
    destination: '',
    email: ''
  });

  // Auto-advance from call to invitation
  useEffect(() => {
    if (currentFrame === 'call') {
      const timer = setTimeout(() => {
        setCurrentFrame('invitation');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentFrame]);



  const handleFrameAdvance = () => {
    const frames: CampaignFrame[] = ['call', 'invitation', 'action'];
    const currentIndex = frames.indexOf(currentFrame);
    if (currentIndex < frames.length - 1) {
      setCurrentFrame(frames[currentIndex + 1]);
    }
  };

  const handleInvitationChoice = (type: 'passenger' | 'cargo' | 'partner') => {
    setFormData({ ...formData, type });
    setCurrentFrame('action');
  };

  const handleSubmit = () => {
    if (formData.type && formData.origin && formData.destination && formData.email) {
      onComplete?.({ 
        type: formData.type, 
        origin: formData.origin,
        destination: formData.destination,
        email: formData.email 
      });
    }
  };

  const renderFrame = () => {
    switch (currentFrame) {
      case 'call':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <div className="w-32 h-32 rounded-full border-4 border-[#1CAFBF] flex items-center justify-center mb-4">
                <Volume2 className="w-12 h-12 text-[#1CAFBF]" />
              </div>
              <div className="text-6xl mb-4">🐦</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-4xl mb-4 text-[#023047]">
                <span className="italic">"koo-koo!"</span>
              </h1>
              <p className="text-xl text-[#717182] max-w-md">
                It begins with a sound, a signal, an invitation.
              </p>
            </motion.div>
          </div>
        );



      case 'invitation':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            {/* Visual Story */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                {dotStories.map((dot, index) => (
                  <motion.div
                    key={dot.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="flex items-center"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shadow-lg"
                      style={{ backgroundColor: dot.color }}
                    >
                      {dot.icon}
                    </div>
                    {index < dotStories.length - 1 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '2rem' }}
                        transition={{ delay: (index * 0.2) + 0.3, duration: 0.5 }}
                        className="h-0.5 bg-[#FFB703] mx-2"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <h2 className="text-3xl mb-4 text-[#023047]">Join the Caribbean Chain</h2>
                <p className="text-lg text-[#717182] max-w-lg">
                  Every dot connects communities. Choose your role in building the Caribbean aviation network.
                </p>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <Button
                  onClick={() => handleInvitationChoice('passenger')}
                  className="w-full h-20 bg-[#1CAFBF] hover:bg-[#1CAFBF]/90 flex flex-col gap-2"
                >
                  <Users className="w-6 h-6" />
                  <span>I need to travel</span>
                  <span className="text-xs opacity-80">Express travel demand</span>
                </Button>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <Button
                  onClick={() => handleInvitationChoice('cargo')}
                  className="w-full h-20 bg-[#FFB703] hover:bg-[#FFB703]/90 text-[#023047] flex flex-col gap-2"
                >
                  <Package className="w-6 h-6" />
                  <span>I need to ship cargo</span>
                  <span className="text-xs opacity-80">Pool cargo with others</span>
                </Button>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.5 }}
              >
                <Button
                  onClick={() => handleInvitationChoice('partner')}
                  className="w-full h-20 bg-[#FB8500] hover:bg-[#FB8500]/90 flex flex-col gap-2"
                >
                  <Plane className="w-6 h-6" />
                  <span>I want to partner</span>
                  <span className="text-xs opacity-80">Airlines, logistics, tourism</span>
                </Button>
              </motion.div>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 text-center"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                   style={{ backgroundColor: formData.type === 'passenger' ? '#1CAFBF' : formData.type === 'cargo' ? '#FFB703' : '#FB8500' }}>
                {formData.type === 'passenger' && <Users className="w-8 h-8 text-white" />}
                {formData.type === 'cargo' && <Package className="w-8 h-8 text-white" />}
                {formData.type === 'partner' && <Plane className="w-8 h-8 text-white" />}
              </div>
              <h2 className="text-3xl mb-2 text-[#023047]">Complete Your Connection</h2>
              <p className="text-lg text-[#717182]">
                {formData.type === 'passenger' && "Tell us your travel route"}
                {formData.type === 'cargo' && "Tell us your shipping route"}
                {formData.type === 'partner' && "Tell us where you can help"}
              </p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-md space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">From</Label>
                  <Select value={formData.origin} onValueChange={(value) => setFormData({...formData, origin: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Origin" />
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
                  <Label className="text-sm">To</Label>
                  <Select value={formData.destination} onValueChange={(value) => setFormData({...formData, destination: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Destination" />
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

              <div>
                <Label className="text-sm">Email for updates</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!formData.origin || !formData.destination || !formData.email}
                className="w-full h-12 text-white"
                style={{ backgroundColor: formData.type === 'passenger' ? '#1CAFBF' : formData.type === 'cargo' ? '#FFB703' : '#FB8500' }}
              >
                {formData.type === 'passenger' && "🧳 Join as Passenger"}
                {formData.type === 'cargo' && "📦 Join as Shipper"}
                {formData.type === 'partner' && "✈️ Join as Partner"}
              </Button>

              {formData.origin && formData.destination && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg text-center"
                >
                  <p className="text-green-800 text-sm">
                    ✓ Route: {caribbeanCountries.find(c => c.value === formData.origin)?.flag} → {caribbeanCountries.find(c => c.value === formData.destination)?.flag}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FDFDFD 0%, #E6F9FC 100%)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFrame}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          {renderFrame()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation hints */}
      {onNavigate && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('left')}
            className="text-[#717182] hover:text-[#023047]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div className="text-xs text-[#717182] text-center">
            <div>Campaign: {currentFrame}</div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('right')}
            className="text-[#717182] hover:text-[#023047]"
          >
            Skip
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}