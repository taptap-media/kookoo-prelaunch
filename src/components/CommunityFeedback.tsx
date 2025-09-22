import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, TrendingUp, Users, Package, Plane, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface CommunityFeedbackProps {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const topRoutes = [
  {
    route: "Barbados → Trinidad",
    passengers: 234,
    cargo: "1.8 tons",
    progress: 89,
    color: "#1CAFBF"
  },
  {
    route: "Jamaica → Cayman Islands", 
    passengers: 189,
    cargo: "1.2 tons",
    progress: 76,
    color: "#FFB703"
  },
  {
    route: "St. Lucia → Martinique",
    passengers: 156,
    cargo: "2.1 tons", 
    progress: 62,
    color: "#FB8500"
  },
  {
    route: "Grenada → St. Vincent",
    passengers: 134,
    cargo: "0.9 tons",
    progress: 54,
    color: "#023047"
  },
  {
    route: "Dominica → Guadeloupe",
    passengers: 98,
    cargo: "1.5 tons",
    progress: 39,
    color: "#1CAFBF"
  }
];

const cargoPoolHighlights = [
  {
    category: "Fresh Produce",
    amount: "12.3 tons",
    routes: 8,
    icon: "🥭",
    color: "#FFB703"
  },
  {
    category: "Seafood", 
    amount: "8.7 tons",
    routes: 6,
    icon: "🐟",
    color: "#1CAFBF"
  },
  {
    category: "Crafts & Goods",
    amount: "5.2 tons", 
    routes: 12,
    icon: "🎨",
    color: "#FB8500"
  },
  {
    category: "E-commerce",
    amount: "3.1 tons",
    routes: 15,
    icon: "📦",
    color: "#023047"
  }
];

export function CommunityFeedback({ onNavigate }: CommunityFeedbackProps) {
  return (
    <div className="h-screen w-full" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => onNavigate('up')}
              className="flex items-center gap-2 text-sm"
              style={{ color: '#717182' }}
            >
              <ArrowUp className="w-4 h-4" />
              Back to Journey
            </button>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl mb-2" style={{ color: '#023047' }}>
              Community Dashboard
            </h2>
            <p style={{ color: '#717182' }}>
              Real-time demand and cargo pooling across the Caribbean
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5" style={{ color: '#1CAFBF' }} />
                  <span className="text-sm" style={{ color: '#717182' }}>Total Interest</span>
                </div>
                <div className="text-2xl" style={{ color: '#023047' }}>1,247</div>
                <div className="text-xs" style={{ color: '#717182' }}>passengers</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5" style={{ color: '#FB8500' }} />
                  <span className="text-sm" style={{ color: '#717182' }}>Cargo Pooled</span>
                </div>
                <div className="text-2xl" style={{ color: '#023047' }}>29.3</div>
                <div className="text-xs" style={{ color: '#717182' }}>tons</div>
              </motion.div>
            </div>

            {/* Top Routes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" style={{ color: '#1CAFBF' }} />
                <h3 className="text-lg" style={{ color: '#023047' }}>
                  Top 5 Routes by Demand
                </h3>
              </div>
              
              <div className="space-y-3">
                {topRoutes.map((route, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: route.color }} />
                        <span style={{ color: '#023047' }}>{route.route}</span>
                      </div>
                      <div className="text-sm" style={{ color: route.color }}>
                        {route.progress}%
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ backgroundColor: route.color, width: `${route.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#717182' }}>
                        👥 {route.passengers} passengers
                      </span>
                      <span style={{ color: '#717182' }}>
                        📦 {route.cargo}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cargo Pools */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5" style={{ color: '#FB8500' }} />
                <h3 className="text-lg" style={{ color: '#023047' }}>
                  Active Cargo Pools
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {cargoPoolHighlights.map((pool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{pool.icon}</div>
                      <div className="text-sm mb-1" style={{ color: '#717182' }}>
                        {pool.category}
                      </div>
                      <div className="text-lg" style={{ color: pool.color }}>
                        {pool.amount}
                      </div>
                      <div className="text-xs" style={{ color: '#717182' }}>
                        {pool.routes} active routes
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Community Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg text-center"
            >
              <Plane className="w-8 h-8 mx-auto mb-3" style={{ color: '#1CAFBF' }} />
              <h4 className="text-lg mb-2" style={{ color: '#023047' }}>
                Community Impact
              </h4>
              <p className="text-sm mb-3" style={{ color: '#717182' }}>
                Together, we're building the Caribbean aviation network
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg" style={{ color: '#1CAFBF' }}>23</div>
                  <div className="text-xs" style={{ color: '#717182' }}>Islands Connected</div>
                </div>
                <div>
                  <div className="text-lg" style={{ color: '#FFB703' }}>$2.1M</div>
                  <div className="text-xs" style={{ color: '#717182' }}>Cost Savings</div>
                </div>
                <div>
                  <div className="text-lg" style={{ color: '#FB8500' }}>89%</div>
                  <div className="text-xs" style={{ color: '#717182' }}>Route Viability</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button
            onClick={() => onNavigate('down')}
            className="w-full text-white"
            style={{ backgroundColor: '#1CAFBF' }}
          >
            Join the Movement <ArrowDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}