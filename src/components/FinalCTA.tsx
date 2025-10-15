import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Mail, MessageCircle, Send, CheckCircle, Plane, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { submitSurvey } from '../services/submit';
import type { UserJourneyData } from '../hooks/useUserJourney';

interface FinalCTAProps {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  userJourney?: {
    journeyData: UserJourneyData;
  };
}

export function FinalCTA({ onNavigate, userJourney }: FinalCTAProps) {
  const [formData, setFormData] = useState({
    email: userJourney?.journeyData?.email || '',
    whatsapp: '',
    emailUpdates: true,
    whatsappUpdates: false,
    communityUpdates: true
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        respondent: {
          email: formData.email,
          whatsapp: formData.whatsapp || undefined,
          user_type: userJourney?.journeyData?.userType || 'passenger',
          origin: userJourney?.journeyData?.origin,
          destination: userJourney?.journeyData?.destination,
          metadata: {
            preferences: {
              emailUpdates: formData.emailUpdates,
              whatsappUpdates: formData.whatsappUpdates,
              communityUpdates: formData.communityUpdates
            },
            source: 'final_cta',
            passengerDetails: userJourney?.journeyData?.passengerDetails,
            cargoDetails: userJourney?.journeyData?.cargoDetails,
            partnerDetails: userJourney?.journeyData?.partnerDetails
          }
        },
        responses: [
          {
            question_code: 'cta.email',
            answer_text: formData.email
          },
          ...(formData.whatsapp ? [{
            question_code: 'cta.whatsapp',
            answer_text: formData.whatsapp
          }] : []),
          {
            question_code: 'cta.pref_email',
            answer_bool: formData.emailUpdates
          },
          {
            question_code: 'cta.pref_whatsapp',
            answer_bool: formData.whatsappUpdates
          },
          {
            question_code: 'cta.pref_community',
            answer_bool: formData.communityUpdates
          }
        ]
      };

      await submitSurvey(payload);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Erreur lors de la soumission:', err);
      setError(err.message || 'Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div 
        className="h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: '#023047' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center px-6"
        >
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#1CAFBF' }}
          >
            <Plane className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-2xl mb-4 text-white">
            Welcome to the KooKoo Community! 🎉
          </h2>
          
          <p className="text-lg mb-6" style={{ color: '#1CAFBF' }}>
            You're now part of the Caribbean aviation revolution
          </p>
          
          <div className="space-y-3 mb-8 text-white/80">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#1CAFBF' }} />
              <span>Email updates enabled</span>
            </div>
            {formData.whatsappUpdates && (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" style={{ color: '#1CAFBF' }} />
                <span>WhatsApp updates enabled</span>
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#1CAFBF' }} />
              <span>Community dashboard access granted</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={() => onNavigate('up')}
              variant="outline"
              className="w-full border-white text-white hover:bg-white hover:text-current"
            >
              Explore More Routes
            </Button>
            
            <div className="text-sm text-white/60">
              We'll keep you updated on route progress and launch dates
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('up')}
              className="flex items-center gap-2 text-sm"
              style={{ color: '#717182' }}
            >
              <ArrowUp className="w-4 h-4" />
              Back
            </button>
            
            <div className="text-center">
              <h2 className="text-lg" style={{ color: '#023047' }}>
                Join KooKoo
              </h2>
            </div>
            
            <div className="w-16"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: '#1CAFBF' }}
                />
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                  <Heart className="w-8 h-8" style={{ color: '#1CAFBF' }} />
                </div>
              </div>
              
              <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>
                Add Your Intent + Get Updates
              </h2>
              <p style={{ color: '#717182' }}>
                Join thousands building the Caribbean network
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#717182' }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                <div className="relative mt-1">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#717182' }} />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+1 (246) 123-4567"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <Label>Communication Preferences</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailUpdates"
                    checked={formData.emailUpdates}
                    onCheckedChange={(checked) => setFormData({...formData, emailUpdates: !!checked})}
                  />
                  <Label htmlFor="emailUpdates" className="text-sm">
                    Email updates on route progress
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsappUpdates"
                    checked={formData.whatsappUpdates}
                    onCheckedChange={(checked) => setFormData({...formData, whatsappUpdates: !!checked})}
                  />
                  <Label htmlFor="whatsappUpdates" className="text-sm">
                    WhatsApp notifications for urgent updates
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="communityUpdates"
                    checked={formData.communityUpdates}
                    onCheckedChange={(checked) => setFormData({...formData, communityUpdates: !!checked})}
                  />
                  <Label htmlFor="communityUpdates" className="text-sm">
                    Community events and partnership news
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white disabled:opacity-50"
                style={{ backgroundColor: '#1CAFBF' }}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Join the Movement'}
                {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <div className="text-xs mb-2" style={{ color: '#717182' }}>
                Trusted by the Caribbean community
              </div>
              <div className="flex items-center justify-center gap-4 text-xs" style={{ color: '#717182' }}>
                <span>🔒 Secure & Private</span>
                <span>•</span>
                <span>📧 No Spam</span>
                <span>•</span>
                <span>🚫 Unsubscribe Anytime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}