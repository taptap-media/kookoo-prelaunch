import { ArrowLeft, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface BrandFoundationProps {
  onBack?: () => void;
}

export function BrandFoundation({ onBack }: BrandFoundationProps) {
  const brandColors = [
    { name: 'Caribbean Teal', hex: '#1CAFBF', usage: 'Primary brand color, trust, wisdom' },
    { name: 'Mango Yellow', hex: '#FFB703', usage: 'Energy, optimism, Caribbean warmth' },
    { name: 'Coral Orange', hex: '#FB8500', usage: 'Action, cargo, vibrant connections' },
    { name: 'Coconut White', hex: '#FDFDFD', usage: 'Clean backgrounds, clarity' },
    { name: 'Deep Sea Blue', hex: '#023047', usage: 'Authority, depth, professionalism' }
  ];

  const brandValues = [
    { title: 'Trust', description: 'Transparent, compliant, dependable operations' },
    { title: 'Wisdom', description: 'Rooted in cultural and operational insight' },
    { title: 'Adaptability', description: 'Flexible service, multiple market approach' },
    { title: 'Community', description: 'Serving collective demand, not airline convenience' },
    { title: 'Sustainability', description: 'Reducing waste, maximizing asset utilization' },
    { title: 'Playfulness', description: 'Joyful, simple, memorable brand voice' }
  ];

  const brandExtensions = [
    { name: 'Kookoo.Flights', description: 'Core demand-funded air platform' },
    { name: 'Kookoo.Dots', description: '"Connect the dots" mapping and connections' },
    { name: 'Kookoo.Network', description: 'Certified ecosystem of operators and partners' },
    { name: 'Kookoo.Events', description: 'Sponsored flights tied to cultural/tourism events' },
    { name: 'Kookoo.Certified', description: 'Trust badge for verified partners' }
  ];

  const targetAudiences = [
    { segment: 'Passengers', needs: 'Affordable, flexible inter-island travel', size: 'Primary' },
    { segment: 'Shippers/SMEs', needs: 'Reliable cargo pooling solutions', size: 'Primary' },
    { segment: 'Governments', needs: 'Compliance and tax transparency', size: 'Key Stakeholder' },
    { segment: 'Tourism Boards', needs: 'Enhanced connectivity for events', size: 'Partner' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#023047] overflow-y-auto">
      {/* Header */}
      <div className="bg-[#023047] text-[#FDFDFD] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="text-[#FDFDFD] hover:bg-[#1CAFBF]/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button variant="outline" size="sm" className="bg-transparent border-[#FDFDFD] text-[#FDFDFD] hover:bg-[#FDFDFD] hover:text-[#023047]">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-4">Kookoo.Flights</h1>
            <h2 className="text-2xl mb-2" style={{ color: '#1CAFBF' }}>Brand Foundation Document</h2>
            <p className="text-lg opacity-90">For Marketing & Design Team</p>
            <p className="text-sm opacity-75 mt-2">Version 1.0 • {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-12">
        
        {/* Brand Essence */}
        <section>
          <Card className="border-l-4 border-l-[#1CAFBF]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1CAFBF] rounded flex-shrink-0"></span>
                Brand Essence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">The Call</h4>
                <p>The name "Kookoo" comes from the bird's call — simple, recognizable, playful. It's a signal of movement, opportunity, and connection.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Caribbean Roots</h4>
                <p>In Haitian culture, the kookoo (owl) symbolizes wisdom, good luck, and news. The name is both cultural and universal.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Philosophy</h4>
                <p>Kookoo listens to the nests of the Caribbean — communities, travelers, and shippers — and creates flights when and where demand exists.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Brand Story */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FFB703] rounded flex-shrink-0"></span>
                Brand Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-[#FFB703]/10 p-6 rounded-lg">
                <p>Born from the "cuckoo's nest" aviation theory (entering existing routes and outperforming incumbents), evolved into a <strong>community-driven, demand-funded model</strong>. Represents wisdom and timing (owl), playfulness (the sound "koo-koo"), and Caribbean creativity. Not just an airline: a platform, a connector, and a cultural movement.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Brand Positioning */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FB8500] rounded flex-shrink-0"></span>
                Brand Positioning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Category</h4>
                <p>Aviation technology + logistics + community platform</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Target Audiences</h4>
                <div className="grid gap-3">
                  {targetAudiences.map((audience, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{audience.segment}</span>
                        <p className="text-sm text-gray-600">{audience.needs}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded" style={{ 
                        backgroundColor: audience.size === 'Primary' ? '#1CAFBF' : audience.size === 'Key Stakeholder' ? '#FFB703' : '#FB8500',
                        color: '#FDFDFD'
                      }}>
                        {audience.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#1CAFBF]/10 p-4 rounded-lg border-l-4 border-l-[#1CAFBF]">
                <h4 className="font-semibold mb-2">Differentiation</h4>
                <p>Unlike scheduled airlines, <strong>Kookoo only flies when demand is real</strong>. We optimize unused capacity and create access where none exists.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Brand Values */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1CAFBF] rounded flex-shrink-0"></span>
                Brand Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {brandValues.map((value, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-5 h-5 mt-1 bg-[#1CAFBF] rounded flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">{value.title}</h4>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Brand Architecture */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FFB703] rounded flex-shrink-0"></span>
                Brand Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {brandExtensions.map((extension, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full mt-2" style={{ backgroundColor: index === 0 ? '#1CAFBF' : '#FFB703' }}></div>
                    <div>
                      <h4 className="font-semibold">{extension.name}</h4>
                      <p className="text-sm text-gray-600">{extension.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Brand Personality & Tone */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FB8500] rounded flex-shrink-0"></span>
                Brand Personality & Tone of Voice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Personality Traits</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Playful but Serious:</strong> Fun and human, but credible in aviation</li>
                    <li>• <strong>Clear & Direct:</strong> "Hear the call. Fly the call."</li>
                    <li>• <strong>Cultural & Caribbean:</strong> Uses rhythm, simplicity, and vibrancy</li>
                    <li>• <strong>Inclusive:</strong> Speaks to communities, not just corporations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Voice Examples</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#1CAFBF]/10 rounded">
                      <p className="text-sm"><strong>Marketing:</strong> "Kookoo connects your island to the world."</p>
                    </div>
                    <div className="p-3 bg-[#FFB703]/10 rounded">
                      <p className="text-sm"><strong>Product:</strong> "Flight confirmed! You and your neighbors just made this route possible."</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Visual Identity Guidelines */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1CAFBF] rounded flex-shrink-0"></span>
                Visual Identity Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Color Palette */}
              <div>
                <h4 className="font-semibold mb-4">Brand Color Palette</h4>
                <div className="grid gap-3">
                  {brandColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-gray-200" 
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <div className="flex-1">
                        <h5 className="font-medium">{color.name}</h5>
                        <p className="text-sm text-gray-600">{color.hex}</p>
                        <p className="text-xs text-gray-500">{color.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Elements */}
              <div>
                <h4 className="font-semibold mb-3">Design Elements</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Logo</h5>
                    <p>Bird-inspired, playful + smart (references owl/cuckoo)</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Typography</h5>
                    <p>Simple, modern, digital-first (recommend sans-serif)</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Imagery Style</h5>
                    <p>Vibrant Caribbean landscapes, community gatherings, cargo + passenger</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Motion/Animation</h5>
                    <p>Rhythmic, light, like a bird in flight</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Brand Manifesto */}
        <section>
          <Card className="bg-gradient-to-r from-[#1CAFBF]/10 via-[#FFB703]/10 to-[#FB8500]/10">
            <CardHeader>
              <CardTitle className="text-center text-2xl" style={{ color: '#023047' }}>Brand Manifesto</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg text-center italic p-6 leading-relaxed" style={{ color: '#023047' }}>
                "Kookoo listens to the nests of the Caribbean — the routes, the communities, the economies that already exist. Where others struggle to grow, we bring wisdom, adaptability, and joy. We are not here to replace, but to empower. From Haiti to the OECS, from diaspora to island, we connect dots, build networks, and create flights that rise from demand. 
                <strong className="block mt-4 not-italic" style={{ color: '#1CAFBF' }}>Hear the call. Fly the call.</strong>"
              </blockquote>
            </CardContent>
          </Card>
        </section>

        {/* Next Steps */}
        <section>
          <Card className="border-l-4 border-l-[#FB8500]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#FB8500] rounded flex-shrink-0"></span>
                Next Steps for Marketing & Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Design Development</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Develop visual identity proposals (logo, color, typography)</li>
                    <li>• Create presentation deck templates</li>
                    <li>• Design brand applications (business cards, letterhead)</li>
                    <li>• Mockup digital interfaces</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Marketing Strategy</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Draft brand launch campaign concepts</li>
                    <li>• Map brand voice guidelines</li>
                    <li>• Create social media templates</li>
                    <li>• Develop press release templates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <p className="text-sm text-gray-500">
            This document acts as the <strong>brand backbone</strong>. Marketing and design teams can now build visuals, campaigns, and materials while staying aligned with the story, values, and positioning.
          </p>
        </div>
      </div>
    </div>
  );
}