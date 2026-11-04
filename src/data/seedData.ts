import { Property, Spot, InquiryEvent } from '@/types';

// ─── Cape Weligama is the single primary property ───────────────────────────
export const CAPE_WELIGAMA: Property = {
  id: 'cape-weligama',
  slug: 'cape-weligama',
  aliases: ['cape-weligama', 'capeweligama', 'cape', 'cw'],
  name: 'Cape Weligama',
  location: 'Clifftop Headland, Cape Weligama, Abimanagama Rd, Weligama',
  lat: 5.9598,
  lng: 80.4099,
  tagline: 'Relais & Châteaux — 12-Acre Cliffside Estate',
  welcomeMessage:
    'Welcome to Cape Weligama. Your private ocean promontory sanctuary. Our concierge team has handpicked every experience below — from world-class surf breaks to candlelit heritage dinners. Simply tap any spot to dispatch a WhatsApp request.',
  vipRef: 'CAPE',
};

// Additional properties kept for multi-property demo / admin only
export const PROPERTIES: Property[] = [
  CAPE_WELIGAMA,
  {
    id: 'the-kip',
    slug: 'the-kip',
    aliases: ['the-kip', 'thekip', 'kip'],
    name: 'The Kip',
    location: 'Ahangama',
    lat: 5.9723,
    lng: 80.3644,
    tagline: 'Intimate boutique sanctuary & slow living retreat',
    welcomeMessage: 'A warm welcome to The Kip. Our team has mapped our personal favorite daily rituals along the coast.',
    vipRef: 'KIP',
  },
  {
    id: 'sunsara-villa',
    slug: 'sunsara',
    aliases: ['sunsara', 'sunsara-villa', 'sunsaravilla'],
    name: 'Sunsara Villa',
    location: 'Weligama',
    lat: 5.9712,
    lng: 80.4289,
    tagline: 'Private beachfront luxury villa overlooking Weligama Bay',
    welcomeMessage:
      'Welcome to Sunsara. Allow our concierge to unlock private lessons, secluded coves, and sunset dining for you.',
    vipRef: 'SUNSARA',
  },
];

export function findPropertyByParam(param: string | null): Property | null {
  if (!param) return null;
  const normalized = param.toLowerCase().trim().replace(/[-_\s]/g, '');
  return (
    PROPERTIES.find((p) => {
      if (p.slug.toLowerCase().replace(/[-_\s]/g, '') === normalized) return true;
      if (p.id.toLowerCase().replace(/[-_\s]/g, '') === normalized) return true;
      if (p.name.toLowerCase().replace(/[-_\s]/g, '') === normalized) return true;
      return p.aliases.some((a) => a.toLowerCase().replace(/[-_\s]/g, '') === normalized);
    }) || null
  );
}

// ─── Seed Inquiries ──────────────────────────────────────────────────────────
export const INITIAL_INQUIRIES: InquiryEvent[] = [
  {
    id: 'inq-1',
    spotId: 'ceylon-sliders',
    spotName: 'Ceylon Sliders',
    propertyId: 'cape-weligama',
    propertyName: 'Cape Weligama',
    timestamp: '2026-10-29T09:15:00Z',
    estimatedValue: 95,
    commission: 10,
  },
  {
    id: 'inq-2',
    spotId: 'mirissa-whale-watching',
    spotName: 'Mirissa Whale Watching',
    propertyId: 'cape-weligama',
    propertyName: 'Cape Weligama',
    timestamp: '2026-10-29T11:40:00Z',
    estimatedValue: 140,
    commission: 10,
  },
  {
    id: 'inq-3',
    spotId: 'kabalana-the-rock',
    spotName: "Kabalana 'The Rock'",
    propertyId: 'cape-weligama',
    propertyName: 'Cape Weligama',
    timestamp: '2026-10-30T08:20:00Z',
    estimatedValue: 40,
    commission: 10,
  },
  {
    id: 'inq-4',
    spotId: 'the-doctors-house',
    spotName: "The Doctor's House",
    propertyId: 'cape-weligama',
    propertyName: 'Cape Weligama',
    timestamp: '2026-10-30T14:10:00Z',
    estimatedValue: 120,
    commission: 10,
  },
  {
    id: 'inq-5',
    spotId: 'galle-fort',
    spotName: 'Galle Fort Heritage Walk',
    propertyId: 'cape-weligama',
    propertyName: 'Cape Weligama',
    timestamp: '2026-10-31T16:30:00Z',
    estimatedValue: 85,
    commission: 10,
  },
];

// ─── Curated South Coast Spots — all partners measured from Cape Weligama ────
export const INITIAL_SPOTS: Spot[] = [
  // ── SURF & BREAKS ─────────────────────────────────────────────────────────
  {
    id: 'ceylon-sliders',
    name: 'Ceylon Sliders',
    category: 'Surf & Breaks',
    location: 'Weligama',
    lat: 5.9712,
    lng: 80.4289,
    tip: '5 mins from Cape Weligama. Sunset rooftop reservation is a must — request surf coach Dinesh for smooth longboard progression on Weligama Bay.',
    image:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    whatsapp: '94771234568',
    priceRange: '$$$',
    curatorBadge: 'Top Sunset Lounge',
    status: 'active',
    inquiriesCount: 42,
    rating: 4.8,
    description:
      'Iconic beachfront surf lounge with panoramic views of Weligama Bay, offering refined California-inspired coastal fare and bespoke surf coaching.',
    openingHours: '07:30 – 22:00 Daily',
  },
  {
    id: 'kabalana-the-rock',
    name: "Kabalana 'The Rock'",
    category: 'Surf & Breaks',
    location: 'Ahangama',
    lat: 5.978,
    lng: 80.358,
    tip: '14 mins from Cape Weligama. Famous A-frame reef break for intermediate to advanced surfers. Paddle out at first light (05:45 AM) before the onshore trades pick up.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    whatsapp: '94771234569',
    priceRange: '$$',
    curatorBadge: 'Legendary Break',
    status: 'active',
    inquiriesCount: 19,
    rating: 5.0,
    description:
      'One of the most consistent, powerful reef breaks in southern Sri Lanka — hollow lefts and steep rights over a deep reef plateau.',
    openingHours: 'Dawn to Dusk',
  },
  {
    id: 'hiriketiya-horseshoe-bay',
    name: 'Hiriketiya Horseshoe Bay',
    category: 'Surf & Breaks',
    location: 'Dikwella',
    lat: 5.962,
    lng: 80.661,
    tip: '25 mins from Cape Weligama. Crescent-shaped cove with sea-turtle swimming on the left and gentle longboard waves on the right. Grab fresh king coconut on the sand.',
    image:
      'https://images.unsplash.com/photo-1510414842564-598c451152ad?auto=format&fit=crop&w=1200&q=80',
    whatsapp: '94771234574',
    priceRange: '$$',
    curatorBadge: 'Natural Paradise',
    status: 'active',
    inquiriesCount: 39,
    rating: 4.9,
    description:
      'Lush horseshoe bay where rainforest meets turquoise water — perfect for mixed-level groups seeking both swimming and effortless longboarding.',
    openingHours: 'Dawn to Dusk',
  },

  // ── CAFES & DINING ────────────────────────────────────────────────────────
  {
    id: 'the-doctors-house',
    name: "The Doctor's House",
    category: 'Cafes & Dining',
    location: 'Madiha',
    lat: 5.9345,
    lng: 80.518,
    tip: '15 mins from Cape Weligama. Historic 200-year-old Dutch colonial garden bar. Come Saturday afternoon for woodfired sourdough pizza, craft beer, and acoustic live sets.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    whatsapp: '94771234570',
    priceRange: '$$',
    curatorBadge: 'Heritage Hotspot',
    status: 'active',
    inquiriesCount: 35,
    rating: 4.9,
    description:
      'Former Dutch colonial sanatorium transformed into a sprawling coastal lawn bar with wood-fired ovens, cold brews, and bohemian vibes.',
    openingHours: '12:00 – 23:00 (Tue–Sun)',
  },
  {
    id: 'mirissa-harbour-kitchen',
    name: 'Mirissa Harbour Kitchen',
    category: 'Cafes & Dining',
    location: 'Mirissa',
    lat: 5.948,
    lng: 80.456,
    tip: '10 mins from Cape Weligama. Best fresh-catch grilled barracuda in the south — order the coconut rice with pol sambol. Book the beachfront table at sunset.',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    whatsapp: '94771234575',
    priceRange: '$$',
    curatorBadge: "Captain's Catch",
    status: 'active',
    inquiriesCount: 28,
    rating: 4.8,
    description:
      'Rustic open-air harbour kitchen where fishermen bring the catch straight to your table — king prawns, grilled tuna, and crab curry over coconut rice.',
    openingHours: '11:00 – 22:00 Daily',
  },

  // ── WELLNESS & YOGA ───────────────────────────────────────────────────────
  {
    id: 'soul-and-surf',
    name: 'Soul & Surf Sri Lanka',
    category: 'Wellness & Yoga',
    location: 'Talpe',
    lat: 5.998,
    lng: 80.285,
    tip: '30 mins from Cape Weligama. Book the 05:00 PM oceanfront Yin Yoga & Sound Healing session. Pre-booking 24 hours in advance is essential — mats fill fast.',
    image:
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    whatsapp: '94771234572',
    priceRange: '$$$',
    curatorBadge: 'Restorative Retreat',
    status: 'active',
    inquiriesCount: 23,
    rating: 4.9,
    description:
      'Open-air teakwood yoga shala surrounded by frangipani blossoms and rhythmic ocean waves, hosting master yogis and breathwork teachers.',
    openingHours: 'Classes at 08:00 & 17:00 Daily',
  },
  {
    id: 'mirissa-whale-watching',
    name: 'Mirissa Whale Watching',
    category: 'Wellness & Yoga',
    location: 'Mirissa Harbour',
    lat: 5.9465,
    lng: 80.4521,
    tip: '10 mins from Cape Weligama. Board by 06:30 AM sharp — blue whales and sperm whales are most active at dawn on the deep southern shelf. Book 48 hours ahead.',
    image:
      'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80',
    whatsapp: '94771234576',
    priceRange: '$$$',
    curatorBadge: 'Ocean Wildlife',
    status: 'active',
    inquiriesCount: 47,
    rating: 4.9,
    description:
      'Guided sunrise ocean excursion to encounter blue whales, sperm whales, and spinner dolphins on the deep continental shelf south of Mirissa.',
    openingHours: 'Departs 06:30 AM (Nov–Apr)',
  },

  // ── SECRET SPOTS ─────────────────────────────────────────────────────────
  {
    id: 'galle-fort',
    name: 'Galle Fort Heritage Walk',
    category: 'Secret Spots',
    location: 'Galle Fort',
    lat: 6.026,
    lng: 80.217,
    tip: '35 mins from Cape Weligama. Stroll the coral-stone ramparts at golden hour — pick up artisan passionfruit gelato at Isle of Gelato on Lighthouse Street corner.',
    image:
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
    whatsapp: '94771234573',
    priceRange: '$$',
    curatorBadge: 'UNESCO Heritage Walk',
    status: 'active',
    inquiriesCount: 16,
    rating: 4.8,
    description:
      'Enchanting 17th-century colonial avenue lined with boutique gem merchants, spice perfumeries, and heritage villas inside UNESCO-listed Galle Fort.',
    openingHours: 'Open All Day',
  },
  {
    id: 'udawalawe-safari',
    name: 'Udawalawe Safari',
    category: 'Secret Spots',
    location: 'Udawalawe National Park',
    lat: 6.4726,
    lng: 80.9003,
    tip: 'Full-day excursion from Cape Weligama (~2 hrs drive). Dawn jeep safaris offer near-certain elephant sightings — herds of 50+ are common at the reservoir.',
    image:
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
    whatsapp: '94771234577',
    priceRange: '$$$',
    curatorBadge: 'Day Excursion',
    status: 'active',
    inquiriesCount: 12,
    rating: 4.9,
    description:
      'One of Sri Lanka\'s finest wildlife parks — home to 200+ resident elephants, leopards, water buffalo, and crocodiles in open savanna grasslands.',
    openingHours: 'Safari at 06:00 & 15:00 Daily',
  },
];
