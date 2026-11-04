export interface ResortPin {
  id: string;
  title: string;
  category: 'villa' | 'pool' | 'dining' | 'wellness';
  coords: [number, number]; // [y, x]
  description: string;
  actionLabel: string;
  actionWhatsAppMessage: string;
  tip?: string;
  curatorBadge?: string;
  priceRange?: '$$' | '$$$' | '$$$$';
  rating?: number;
  openingHours?: string;
  image?: string;
}

export interface ResortConfig {
  id: string;
  name: string;
  tagline: string;
  mapImage: string;
  whatsappNumber: string;
  pins: ResortPin[];
}

export const RESORTS_DATA: Record<string, ResortConfig> = {
  'cape-weligama': {
    id: 'cape-weligama',
    name: 'Cape Weligama',
    tagline: 'Iconic clifftop luxury retreat perched above the southern surf coast',
    mapImage: '/resort-map.jpg',
    whatsappNumber: '+94771234567',
    pins: [
      {
        id: 'residence-cove-14',
        title: 'Residence Cove #14',
        category: 'villa',
        coords: [620, 370],
        description: 'Secluded cliffside residence with private garden courtyard and dedicated butler dispatch.',
        actionLabel: 'Call Electric Buggy to Villa',
        actionWhatsAppMessage: 'Hi Concierge! Please dispatch an electric buggy to Residence Cove #14.',
        tip: 'Private hillside enclave overlooking the coconut canopy. Tap below to summon an electric buggy directly to your villa entrance within minutes.',
        curatorBadge: 'In-Villa Dispatch',
        priceRange: '$$$$',
        rating: 5.0,
        openingHours: '24/7 On-Call Concierge',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'crescent-infinity-pool',
        title: 'The Crescent Infinity Pool',
        category: 'pool',
        coords: [440, 600],
        description: '60-meter iconic crescent cliff-edge pool overlooking the Indian Ocean swell.',
        actionLabel: 'Poolside Towel & Service',
        actionWhatsAppMessage: 'Hi Concierge! Requesting poolside towel and refreshment service at The Crescent Infinity Pool.',
        tip: 'Bamboo cabanas 3 and 4 offer unobstructed Indian Ocean views. Chilled King Coconut water and lemongrass towels are served on request.',
        curatorBadge: 'Signature Amenity',
        priceRange: '$$$',
        rating: 4.9,
        openingHours: '07:00 — 21:00',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'ocean-terrace-restaurant',
        title: 'Ocean Terrace Restaurant',
        category: 'dining',
        coords: [310, 880],
        description: 'Panoramic cliff-edge dining serving freshly landed wild catches and Ceylon spices.',
        actionLabel: 'Reserve Sunset Table',
        actionWhatsAppMessage: 'Hi Concierge! I would like to reserve a sunset table tonight at Ocean Terrace Restaurant.',
        tip: 'Mirissa day-boat catches arrive daily at 4 PM. Request Table #8 for an unhindered golden-hour sunset over the reef.',
        curatorBadge: 'Michelin Experience',
        priceRange: '$$$$',
        rating: 4.9,
        openingHours: '12:00 — 23:00',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'sanctuary-spa-pavilion',
        title: 'Sanctuary Spa Pavilion',
        category: 'wellness',
        coords: [690, 840],
        description: 'Ayurvedic sanctuary nestled within tranquil cinnamon and lemongrass gardens.',
        actionLabel: 'Book Ayurvedic Session',
        actionWhatsAppMessage: 'Hi Concierge! I would like to book an Ayurvedic treatment session at Sanctuary Spa Pavilion.',
        tip: 'Arrive 15 minutes prior for the complimentary herbal foot bath infused with wild lemongrass, cinnamon bark, and fresh vetiver.',
        curatorBadge: 'Ayurvedic Master',
        priceRange: '$$$$',
        rating: 5.0,
        openingHours: '09:00 — 20:00',
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
};

export const DEFAULT_RESORT_CONFIG: ResortConfig = RESORTS_DATA['cape-weligama'];

export function getResortConfig(slugOrId?: string): ResortConfig {
  if (!slugOrId) return DEFAULT_RESORT_CONFIG;
  const normalized = slugOrId.toLowerCase().trim().replace(/[-_\s]/g, '');
  const match = Object.values(RESORTS_DATA).find((r) => {
    return (
      r.id.toLowerCase().replace(/[-_\s]/g, '') === normalized ||
      r.name.toLowerCase().replace(/[-_\s]/g, '') === normalized
    );
  });
  return match || DEFAULT_RESORT_CONFIG;
}
