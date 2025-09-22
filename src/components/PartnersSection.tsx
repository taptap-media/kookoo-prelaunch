import { motion } from 'motion/react';
import { ArrowDown, Building2, Globe, Shield, Briefcase, Users, Phone } from 'lucide-react';
import { Button } from './ui/button';

interface PartnersSectionProps {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const partnerCategories = [
  {
    title: "Tourism Boards",
    icon: Globe,
    color: "#1CAFBF",
    description: "Promote inter-island tourism and cultural exchange",
    benefits: ["Increased visitor flow", "Regional tourism packages", "Cultural event coordination"]
  },
  {
    title: "Government Agencies",
    icon: Shield,
    color: "#023047", 
    description: "Aviation authorities and regulatory partnerships",
    benefits: ["Streamlined approvals", "Safety oversight", "Policy coordination"]
  },
  {
    title: "Local Businesses",
    icon: Briefcase,
    color: "#FFB703",
    description: "Hotels, restaurants, and service providers",
    benefits: ["Customer referrals", "Package deals", "Local partnerships"]
  },
  {
    title: "Community Organizations",
    icon: Users,
    color: "#FB8500",
    description: "NGOs, associations, and community groups",
    benefits: ["Grassroots outreach", "Community events", "Social impact"]
  }
];

const currentPartners = [
  "Barbados Tourism Marketing Inc.",
  "Eastern Caribbean Civil Aviation Authority",
  "Caribbean Hotel & Tourism Association",
  "Caribbean Development Bank",
  "CARICOM Secretariat"
];

export function PartnersSection({ onNavigate }: PartnersSectionProps) {
  return (
    <div className="h-screen w-full" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>
                Caribbean.One Partners
              </h2>
              <p style={{ color: '#717182' }}>
                Building the future of Caribbean aviation together
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            
            {/* Partner Categories */}
            <div>
              <h3 className="text-lg mb-4" style={{ color: '#023047' }}>
                Partnership Opportunities
              </h3>
              
              <div className="space-y-4">
                {partnerCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <category.icon className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg mb-2" style={{ color: '#023047' }}>
                          {category.title}
                        </h4>
                        <p className="text-sm mb-3" style={{ color: '#717182' }}>
                          {category.description}
                        </p>
                        
                        <div className="space-y-1">
                          {category.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span style={{ color: '#717182' }}>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Current Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg"
            >
              <h3 className="text-lg mb-4" style={{ color: '#023047' }}>
                Current Partners & Supporters
              </h3>
              
              <div className="space-y-2">
                {currentPartners.map((partner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + 0.1 * index }}
                    className="flex items-center gap-3"
                  >
                    <Building2 className="w-4 h-4" style={{ color: '#1CAFBF' }} />
                    <span className="text-sm" style={{ color: '#023047' }}>
                      {partner}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <h3 className="text-lg mb-4" style={{ color: '#023047' }}>
                Why Partner with KooKoo?
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl mb-2">🌊</div>
                  <h4 className="text-sm mb-1" style={{ color: '#023047' }}>
                    Regional Impact
                  </h4>
                  <p className="text-xs" style={{ color: '#717182' }}>
                    Connect all Caribbean islands in one network
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="text-sm mb-1" style={{ color: '#023047' }}>
                    Data-Driven Routes
                  </h4>
                  <p className="text-xs" style={{ color: '#717182' }}>
                    Real demand data for sustainable route planning
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl mb-2">🤝</div>
                  <h4 className="text-sm mb-1" style={{ color: '#023047' }}>
                    Community First
                  </h4>
                  <p className="text-xs" style={{ color: '#717182' }}>
                    Bottom-up approach with local community input
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-r p-6 rounded-lg text-center"
              style={{ 
                background: 'linear-gradient(135deg, #1CAFBF 0%, #023047 100%)'
              }}
            >
              <Phone className="w-8 h-8 mx-auto mb-3 text-white" />
              <h4 className="text-lg mb-2 text-white">
                Ready to Partner?
              </h4>
              <p className="text-sm mb-4 text-white/80">
                Join us in revolutionizing Caribbean aviation
              </p>
              <div className="space-y-2 text-white/90 text-sm">
                <div>partnerships@kookoo.caribbean</div>
                <div>+1 (246) 123-KOOK</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button
            onClick={() => onNavigate('down')}
            className="w-full text-white"
            style={{ backgroundColor: '#023047' }}
          >
            Back to Community <ArrowDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}