export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  expectedAttendees?: string;
  category: 'sports' | 'carnival' | 'business' | 'education' | 'family' | 'cultural';
}

export const sportsEvents: Event[] = [
  {
    id: 'cpl-2025',
    name: 'Caribbean Premier League 2025',
    date: 'July 2025',
    location: 'Multiple islands',
    description: 'Premier T20 cricket tournament across 6 Caribbean nations',
    expectedAttendees: '500,000+',
    category: 'sports'
  },
  {
    id: 'carifta-games-2025',
    name: 'CARIFTA Games 2025',
    date: 'April 2025',
    location: 'Barbados',
    description: 'Annual athletics competition for Caribbean youth',
    expectedAttendees: '15,000+',
    category: 'sports'
  },
  {
    id: 'windward-sailing',
    name: 'Windward Islands Regatta',
    date: 'February 2025',
    location: 'Grenada → St. Vincent → St. Lucia',
    description: 'Annual sailing championship between Windward Islands',
    expectedAttendees: '5,000+',
    category: 'sports'
  },
  {
    id: 'caribbean-football',
    name: 'Caribbean Cup Qualifiers',
    date: 'March-June 2025',
    location: 'Various islands',
    description: 'Football championship qualifiers across the region',
    expectedAttendees: '100,000+',
    category: 'sports'
  },
  {
    id: 'basketball-championship',
    name: 'Caribbean Basketball Championship',
    date: 'August 2025',
    location: 'Puerto Rico',
    description: 'Regional basketball tournament',
    expectedAttendees: '25,000+',
    category: 'sports'
  }
];

export const carnivalEvents: Event[] = [
  {
    id: 'trinidad-carnival',
    name: 'Trinidad Carnival 2025',
    date: 'March 3-4, 2025',
    location: 'Trinidad & Tobago',
    description: 'The mother of all Caribbean carnivals',
    expectedAttendees: '1,000,000+',
    category: 'carnival'
  },
  {
    id: 'barbados-crop-over',
    name: 'Crop Over Festival',
    date: 'June-August 2025',
    location: 'Barbados',
    description: 'Traditional harvest festival culminating in Grand Kadooment',
    expectedAttendees: '300,000+',
    category: 'carnival'
  },
  {
    id: 'jamaica-carnival',
    name: 'Jamaica Carnival',
    date: 'April 2025',
    location: 'Jamaica',
    description: 'Vibrant celebration of Jamaican culture and music',
    expectedAttendees: '200,000+',
    category: 'carnival'
  },
  {
    id: 'antigua-carnival',
    name: 'Antigua Carnival',
    date: 'July-August 2025',
    location: 'Antigua & Barbuda',
    description: 'Summer carnival celebration with J\'ouvert and parades',
    expectedAttendees: '150,000+',
    category: 'carnival'
  },
  {
    id: 'dominica-carnival',
    name: 'Dominica Carnival',
    date: 'February 2025',
    location: 'Dominica',
    description: 'Traditional Mas celebration in the Nature Island',
    expectedAttendees: '50,000+',
    category: 'carnival'
  },
  {
    id: 'st-lucia-carnival',
    name: 'Saint Lucia Carnival',
    date: 'July 2025',
    location: 'Saint Lucia',
    description: 'Colorful celebration blending African and European traditions',
    expectedAttendees: '100,000+',
    category: 'carnival'
  }
];

export const businessEvents: Event[] = [
  {
    id: 'caricom-summit',
    name: 'CARICOM Heads of Government Meeting',
    date: 'July 2025',
    location: 'Rotating host',
    description: 'Annual summit of Caribbean leaders',
    expectedAttendees: '5,000+',
    category: 'business'
  },
  {
    id: 'caribbean-investment-summit',
    name: 'Caribbean Investment Summit',
    date: 'May 2025',
    location: 'Barbados',
    description: 'Regional business and investment conference',
    expectedAttendees: '3,000+',
    category: 'business'
  },
  {
    id: 'oecs-conference',
    name: 'OECS Economic Forum',
    date: 'September 2025',
    location: 'Saint Lucia',
    description: 'Eastern Caribbean economic development conference',
    expectedAttendees: '2,000+',
    category: 'business'
  },
  {
    id: 'tourism-board-meeting',
    name: 'Caribbean Tourism Conference',
    date: 'October 2025',
    location: 'Jamaica',
    description: 'Annual tourism industry conference',
    expectedAttendees: '4,000+',
    category: 'business'
  }
];

export const educationEvents: Event[] = [
  {
    id: 'uwi-graduation',
    name: 'UWI Graduation Ceremonies',
    date: 'October-November 2025',
    location: 'Multiple campuses',
    description: 'University of the West Indies graduation across campuses',
    expectedAttendees: '50,000+',
    category: 'education'
  },
  {
    id: 'caribbean-educators-conference',
    name: 'Caribbean Educators Conference',
    date: 'June 2025',
    location: 'Trinidad & Tobago',
    description: 'Regional education development conference',
    expectedAttendees: '2,500+',
    category: 'education'
  },
  {
    id: 'medical-students-conference',
    name: 'Caribbean Medical Students Conference',
    date: 'April 2025',
    location: 'Barbados',
    description: 'Annual conference for Caribbean medical students',
    expectedAttendees: '1,500+',
    category: 'education'
  },
  {
    id: 'carifesta',
    name: 'CARIFESTA 2025',
    date: 'August 2025',
    location: 'Antigua & Barbuda',
    description: 'Caribbean Festival of Arts - cultural and educational exchange',
    expectedAttendees: '100,000+',
    category: 'cultural'
  }
];

export const familyEvents: Event[] = [
  {
    id: 'christmas-season',
    name: 'Christmas & New Year Season',
    date: 'December 2024 - January 2025',
    location: 'All islands',
    description: 'Peak family travel season across the Caribbean',
    expectedAttendees: '2,000,000+',
    category: 'family'
  },
  {
    id: 'easter-holidays',
    name: 'Easter Holiday Period',
    date: 'March-April 2025',
    location: 'All islands',
    description: 'Traditional family reunion time',
    expectedAttendees: '800,000+',
    category: 'family'
  },
  {
    id: 'summer-holidays',
    name: 'Summer School Holidays',
    date: 'July-August 2025',
    location: 'All islands',
    description: 'Peak period for family visits and vacations',
    expectedAttendees: '1,500,000+',
    category: 'family'
  },
  {
    id: 'independence-celebrations',
    name: 'Independence Day Celebrations',
    date: 'Various dates 2025',
    location: 'Multiple islands',
    description: 'National independence celebrations drawing diaspora home',
    expectedAttendees: '500,000+',
    category: 'family'
  }
];

export const culturalEvents: Event[] = [
  {
    id: 'reggae-sumfest',
    name: 'Reggae Sumfest',
    date: 'July 2025',
    location: 'Jamaica',
    description: 'Premier reggae music festival',
    expectedAttendees: '300,000+',
    category: 'cultural'
  },
  {
    id: 'calypso-monarch',
    name: 'Calypso Monarch Competition',
    date: 'February 2025',
    location: 'Trinidad & Tobago',
    description: 'Premier calypso competition',
    expectedAttendees: '50,000+',
    category: 'cultural'
  },
  {
    id: 'steel-pan-festival',
    name: 'World Steel Pan Festival',
    date: 'August 2025',
    location: 'Trinidad & Tobago',
    description: 'International steel pan competition',
    expectedAttendees: '25,000+',
    category: 'cultural'
  }
];

export const cargoCategories = [
  {
    id: 'agricultural',
    label: 'Agricultural Products',
    description: 'Fresh produce, processed foods, spices',
    icon: '🌾',
    examples: ['Mangoes', 'Bananas', 'Spices', 'Rum', 'Hot sauce']
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing & Industrial',
    description: 'Machinery, equipment, raw materials',
    icon: '🏭',
    examples: ['Construction materials', 'Solar panels', 'Machinery parts', 'Textiles']
  },
  {
    id: 'medical',
    label: 'Medical & Pharmaceutical',
    description: 'Medical supplies, pharmaceuticals, equipment',
    icon: '⚕️',
    examples: ['Medications', 'Medical devices', 'Vaccines', 'Diagnostic equipment']
  },
  {
    id: 'consumer',
    label: 'Consumer Goods',
    description: 'Retail products, electronics, household items',
    icon: '📦',
    examples: ['Electronics', 'Clothing', 'Household items', 'Auto parts']
  },
  {
    id: 'perishable',
    label: 'Perishable Goods',
    description: 'Time-sensitive fresh products',
    icon: '🧊',
    examples: ['Fresh fish', 'Dairy products', 'Fresh produce', 'Flowers']
  },
  {
    id: 'bulk',
    label: 'Bulk Commodities',
    description: 'Large volume raw materials',
    icon: '⚡',
    examples: ['Fuel', 'Building materials', 'Fertilizer', 'Animal feed']
  }
];

export function getEventsByCategory(category: string): Event[] {
  switch (category) {
    case 'sports':
      return sportsEvents;
    case 'carnival':
      return carnivalEvents;
    case 'work':
    case 'business':
      return businessEvents;
    case 'study':
    case 'education':
      return educationEvents;
    case 'family':
      return familyEvents;
    case 'cultural':
      return culturalEvents;
    default:
      return [];
  }
}

export function getAllEvents(): Event[] {
  return [
    ...sportsEvents,
    ...carnivalEvents,
    ...businessEvents,
    ...educationEvents,
    ...familyEvents,
    ...culturalEvents
  ];
}