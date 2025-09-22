import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, Plane, Package, Users, Zap } from 'lucide-react';

interface NarrativeSectionProps {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const narrativePanels = [
  {
    icon: Zap,
    title: "The Problem",
    content: "Caribbean islands are isolated. Expensive flights. Limited cargo capacity. No community coordination.",
    color: "#FB8500"
  },
  {
    icon: Plane,
    title: "The Solution", 
    content: "KooKoo pools passenger demand and cargo shipments across islands to make routes viable.",
    color: "#1CAFBF"
  },
  {
    icon: Package,
    title: "The Infrastructure",
    content: "Smart routing algorithms match supply and demand. Community-driven route planning.",
    color: "#FFB703"
  },
  {
    icon: Users,
    title: "Join the Movement",
    content: "Add your travel intent. Pool your cargo. Build the network together.",
    color: "#023047"
  }
];

export function NarrativeSection({ onNavigate }: NarrativeSectionProps) {
  return (
    <div className="h-screen w-full overflow-hidden" style={{ backgroundColor: '#FDFDFD' }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 text-center border-b border-gray-200">
          <motion.button
            onClick={() => onNavigate('up')}
            className="inline-flex items-center gap-2 text-sm mb-4 px-4 py-2 rounded-full border"
            style={{ color: '#023047', borderColor: '#023047' }}
            whileHover={{ scale: 1.05 }}
          >
            <ArrowUp className="w-4 h-4" />
            Back to Home
          </motion.button>
          <h2 className="text-2xl" style={{ color: '#023047' }}>
            The Caribbean Aviation Story
          </h2>
        </div>

        {/* Scrolling Narrative Panels */}
        <div className="flex-1 overflow-y-auto">
          {narrativePanels.map((panel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-20%" }}
              className="min-h-screen flex items-center justify-center p-8"
              style={{ 
                backgroundColor: index % 2 === 0 ? '#FDFDFD' : '#f8f9fa'
              }}
            >
              <div className="max-w-2xl text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: panel.color }}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <panel.icon className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-3xl mb-6" style={{ color: '#023047' }}>
                  {panel.title}
                </h3>
                
                <p className="text-lg leading-relaxed" style={{ color: '#717182' }}>
                  {panel.content}
                </p>

                {index === narrativePanels.length - 1 && (
                  <motion.button
                    onClick={() => onNavigate('down')}
                    className="mt-8 px-8 py-3 rounded-full text-white flex items-center gap-2 mx-auto"
                    style={{ backgroundColor: '#1CAFBF' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Journey Options
                    <ArrowDown className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}