'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, X, Edit3, Copy, Check, RotateCcw, MapPin, Sparkles } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════════
   CONSTANTS & COLOR PALETTE
   ═══════════════════════════════════════════════════════════════════════════════ */

const IMAGE_WIDTH = 1204;
const IMAGE_HEIGHT = 915;
const bounds: L.LatLngBoundsExpression = [[0, 0], [IMAGE_HEIGHT, IMAGE_WIDTH]];
const STORAGE_KEY = 'cape_weligama_pins_v3'; // v3 = all 18 pins
const WHATSAPP_NUMBER = '94770000000';
const PARCHMENT_BG = '#F5F3EC'; // Exact background tone sampled from resort-map.jpg

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

type PinCategory = 'Dining' | 'Pool' | 'Wellness' | 'Explore' | 'Service';
type FilterCategory = PinCategory | 'All';

export interface ResortAmenity {
  id: string;
  num: number;
  title: string;
  category: PinCategory;
  coords: [number, number]; // [Y, X] in Leaflet CRS.Simple
  description: string;
  actionText: string;
  whatsAppMessage: string;
}

const CATEGORY_COLORS: Record<PinCategory, string> = {
  Dining:   '#C86D51', // Terracotta
  Pool:     '#2D82B7', // Ocean Blue
  Wellness: '#2D4A3E', // Forest Green
  Explore:  '#3D5A80', // Deep Navy
  Service:  '#8B7355', // Warm Stone
};

const FILTER_OPTIONS: { key: FilterCategory; label: string }[] = [
  { key: 'All',      label: 'All Grounds' },
  { key: 'Dining',   label: 'Dining' },
  { key: 'Pool',     label: 'Pools' },
  { key: 'Wellness', label: 'Wellness' },
  { key: 'Explore',  label: 'Explore' },
  { key: 'Service',  label: 'Services' },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   ALL 18 CAPE WELIGAMA NUMBERED LOCATIONS
   Coordinates: [915 - pixel_y_from_top, pixel_x_from_left]
   ═══════════════════════════════════════════════════════════════════════════════ */

const DEFAULT_AMENITIES: ResortAmenity[] = [
  {
    id: 'reception',
    num: 1,
    title: 'Reception',
    category: 'Service',
    coords: [820, 430],
    description: 'The arrival gateway to Cape Weligama, offering personalised check-in and dedicated concierge services.',
    actionText: 'Request Assistance',
    whatsAppMessage: 'Hi Concierge, I need assistance at Reception.',
  },
  {
    id: 'sanctuary-spa',
    num: 2,
    title: 'Sanctuary Spa',
    category: 'Wellness',
    coords: [857, 500],
    description: 'A holistic Ayurvedic spa sanctuary offering bespoke therapies amidst lush tropical gardens.',
    actionText: 'Book Spa Treatment',
    whatsAppMessage: 'Hi Concierge, I\'d like to book an Ayurvedic treatment at the Sanctuary Spa.',
  },
  {
    id: 'moon-pool',
    num: 3,
    title: 'Moon Pool',
    category: 'Pool',
    coords: [215, 340],
    description: 'The iconic cliff-edge infinity pool with sweeping, uninterrupted views of the Indian Ocean.',
    actionText: 'Request Pool Service',
    whatsAppMessage: 'Hi Concierge, I\'m at the Moon Pool and would like towel and drink service.',
  },
  {
    id: 'surf-bar',
    num: 4,
    title: 'Surf Bar & Deck',
    category: 'Dining',
    coords: [195, 398],
    description: 'Relaxed beachside bar with craft cocktails, fresh juices, and cooling ocean breezes.',
    actionText: 'Order Drinks',
    whatsAppMessage: 'Hi Concierge, I\'d like to place an order at the Surf Bar & Deck.',
  },
  {
    id: 'gym',
    num: 5,
    title: 'Gym',
    category: 'Wellness',
    coords: [218, 272],
    description: 'State-of-the-art fitness centre with ocean views, personal training, and yoga sessions.',
    actionText: 'Book Session',
    whatsAppMessage: 'Hi Concierge, I\'d like to book a fitness session at the Gym.',
  },
  {
    id: 'main-square',
    num: 6,
    title: 'Main Square',
    category: 'Service',
    coords: [427, 555],
    description: 'The heart of the resort — a tranquil courtyard connecting pathways to all key amenities.',
    actionText: 'Get Directions',
    whatsAppMessage: 'Hi Concierge, could you assist me with directions from the Main Square?',
  },
  {
    id: 'cape-shop',
    num: 7,
    title: 'Cape Weligama Shop',
    category: 'Service',
    coords: [385, 540],
    description: 'A curated boutique featuring artisan Sri Lankan crafts, resort wear, and exclusive souvenirs.',
    actionText: 'Browse Collection',
    whatsAppMessage: 'Hi Concierge, I\'d like to know about the current collection at the Cape Weligama Shop.',
  },
  {
    id: 'pola-restaurant',
    num: 8,
    title: '\'Pola\' Sri Lankan Restaurant',
    category: 'Dining',
    coords: [367, 555],
    description: 'Authentic Sri Lankan cuisine with locally sourced ingredients, served in a vibrant open-air setting.',
    actionText: 'Reserve Table',
    whatsAppMessage: 'Hi Concierge, I\'d like to reserve a table at Pola Sri Lankan Restaurant.',
  },
  {
    id: 'ocean-terrace',
    num: 9,
    title: 'Ocean Terrace Restaurant',
    category: 'Dining',
    coords: [340, 632],
    description: 'Clifftop fine dining offering fresh daily catch, curated wine pairings, and panoramic ocean views.',
    actionText: 'Reserve Sunset Table',
    whatsAppMessage: 'Hi Concierge, I\'d like to reserve a sunset table at Ocean Terrace Restaurant.',
  },
  {
    id: 'tableau',
    num: 10,
    title: 'Tableau — Chef\'s Table',
    category: 'Dining',
    coords: [285, 545],
    description: 'An intimate multi-course dining experience crafted by the resort\'s executive chef.',
    actionText: 'Book Chef\'s Table',
    whatsAppMessage: 'Hi Concierge, I\'d like to book the Chef\'s Table experience at Tableau.',
  },
  {
    id: 'cape-club',
    num: 11,
    title: 'Cape Club',
    category: 'Dining',
    coords: [417, 672],
    description: 'Panoramic clifftop lounge with sunset aperitifs, high tea, and stargazing evenings.',
    actionText: 'Reserve Lounge',
    whatsAppMessage: 'Hi Concierge, I\'d like to reserve sunset seats at the Cape Club.',
  },
  {
    id: 'cove-pool',
    num: 12,
    title: 'Cove Pool',
    category: 'Pool',
    coords: [595, 775],
    description: 'A family-friendly pool nestled in a sheltered cove, ideal for leisurely afternoons.',
    actionText: 'Request Pool Service',
    whatsAppMessage: 'Hi Concierge, I\'m at the Cove Pool and would like towel and drink service.',
  },
  {
    id: 'east-beach-gate',
    num: 13,
    title: 'Gate to East Beach & Sports Centre',
    category: 'Explore',
    coords: [607, 900],
    description: 'Access to the sandy East Beach and the resort\'s sports and recreation facilities.',
    actionText: 'Explore Activities',
    whatsAppMessage: 'Hi Concierge, I\'d like to know about activities at the East Beach & Sports Centre.',
  },
  {
    id: 'cliff-edge-walkway',
    num: 14,
    title: 'Cliff Edge Walkway',
    category: 'Explore',
    coords: [340, 718],
    description: 'A scenic coastal path along the cliff edge with dramatic ocean vistas and sea spray.',
    actionText: 'Request Buggy',
    whatsAppMessage: 'Hi Concierge, I\'d like a buggy ride to the Cliff Edge Walkway.',
  },
  {
    id: 'west-beach-stairs',
    num: 15,
    title: 'West Beach Staircase',
    category: 'Explore',
    coords: [373, 225],
    description: 'Stone steps leading down to the secluded West Beach — perfect for sunrise walks.',
    actionText: 'Beach Access Info',
    whatsAppMessage: 'Hi Concierge, I\'d like information about accessing West Beach.',
  },
  {
    id: 'lookout-fin',
    num: 16,
    title: 'Lookout Fin',
    category: 'Explore',
    coords: [255, 235],
    description: 'An elevated viewpoint named after the ocean sunfish — ideal for sunset photography.',
    actionText: 'Sunset Info',
    whatsAppMessage: 'Hi Concierge, what time is sunset at Lookout Fin today?',
  },
  {
    id: 'lookout-minke',
    num: 17,
    title: 'Lookout Minke',
    category: 'Explore',
    coords: [185, 262],
    description: 'A whale-watching vantage point on the western headland, named after the minke whale.',
    actionText: 'Whale Watch Update',
    whatsAppMessage: 'Hi Concierge, is there any whale activity visible from Lookout Minke?',
  },
  {
    id: 'lookout-blue',
    num: 18,
    title: 'Lookout Blue',
    category: 'Explore',
    coords: [110, 365],
    description: 'The southernmost tip of the cape with 270° ocean panoramas and unobstructed horizons.',
    actionText: 'Scenic Tour',
    whatsAppMessage: 'Hi Concierge, I\'d like to visit Lookout Blue.',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   LUXURY NUMBERED PIN ICON FACTORY
   ═══════════════════════════════════════════════════════════════════════════════ */

function createPinIcon(
  amenity: ResortAmenity,
  isSelected: boolean,
  isBeingEdited: boolean,
) {
  const color = CATEGORY_COLORS[amenity.category];
  const isPool = amenity.category === 'Pool';
  const isTwoDigit = amenity.num >= 10;
  const baseSize = isTwoDigit ? 30 : 28;
  const activeSize = isTwoDigit ? 34 : 32;
  const size = isSelected || isBeingEdited ? activeSize : baseSize;
  const fontSize = isTwoDigit ? '9.5px' : '11px';

  return L.divIcon({
    className: 'numbered-luxury-pin',
    html: `
      <div class="${isSelected ? 'pin-jiggle-active' : ''}" style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;cursor:pointer;transform:translate(-50%,-50%);touch-action:manipulation;-webkit-tap-highlight-color:transparent;">
        ${isPool && isSelected ? `
          <div style="position:absolute;width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${color};animation:poolRipple 2.2s cubic-bezier(0.2,0.8,0.2,1) infinite;pointer-events:none;"></div>
          <div style="position:absolute;width:${size}px;height:${size}px;border-radius:50%;border:1.5px solid ${color};animation:poolRipple 2.2s cubic-bezier(0.2,0.8,0.2,1) infinite;animation-delay:0.7s;pointer-events:none;"></div>
        ` : ''}
        ${isBeingEdited ? `
          <div style="position:absolute;width:48px;height:48px;border-radius:50%;border:2px dashed #F59E0B;background:rgba(245,158,11,0.15);animation:pulse 1.6s infinite;pointer-events:none;"></div>
        ` : ''}
        <div class="apple-pin-badge" style="
          position:relative;z-index:2;
          background:rgba(255,255,255,0.96);
          backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
          border:1.5px solid ${isBeingEdited ? '#F59E0B' : color};
          width:${size}px;height:${size}px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          box-shadow:${
            isSelected || isBeingEdited
              ? `0 10px 24px rgba(0,0,0,0.3),0 0 0 3px ${color}33`
              : '0 4px 14px rgba(0,0,0,0.18)'
          };
          transition:transform 0.18s cubic-bezier(0.16,1,0.3,1),box-shadow 0.18s ease;
        ">
          <span style="
            font-size:${fontSize};font-weight:800;color:#1A1A1A;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
            line-height:1;user-select:none;letter-spacing:-0.02em;
          ">${amenity.num}</span>
          <span style="
            position:absolute;bottom:-2px;width:5px;height:5px;border-radius:50%;
            background:${color};border:1px solid white;
          "></span>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAP AUTO-FIT CONTROLLER (Edge-to-Edge with Zero Letterboxing)
   ═══════════════════════════════════════════════════════════════════════════════ */

function MapAutoFit({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    map.fitBounds(bounds, {
      padding: [0, 0],
      animate: false,
    });

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      // Center the resort and gently elevate zoom so it fills width edge-to-edge
      const targetZoom = map.getBoundsZoom(bounds, false) + 0.22;
      map.setView([IMAGE_HEIGHT * 0.48, IMAGE_WIDTH * 0.52], targetZoom, { animate: false });
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => clearTimeout(timer);
  }, [map, bounds]);

  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAP CLICK HANDLER (for admin pin calibration)
   ═══════════════════════════════════════════════════════════════════════════════ */

function MapClickHandler({
  enabled,
  onMapClick,
}: {
  enabled: boolean;
  onMapClick: (coords: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      const y = Math.max(0, Math.min(IMAGE_HEIGHT, Math.round(e.latlng.lat)));
      const x = Math.max(0, Math.min(IMAGE_WIDTH, Math.round(e.latlng.lng)));
      onMapClick([y, x]);
    },
  });
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CURATED LUXURY IMAGES & HIGHLIGHTS FOR AMENITY DRAWER
   ═══════════════════════════════════════════════════════════════════════════════ */

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_HIGHLIGHTS = [
  'Panoramic Ocean Views',
  'Dedicated Concierge Service',
  'Private Resort Access',
  'Complimentary Electric Buggy',
];

const AMENITY_DETAILS: Record<
  string,
  { image: string; highlights: string[] }
> = {
  reception: {
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
    highlights: ['24/7 Dedicated Concierge', 'Electric Buggy Dispatch', 'Valet & Luggage Service', 'Curated Excursions'],
  },
  'sanctuary-spa': {
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Ayurvedic Herbal Baths', 'Ocean-Breeze Shaded Shala', 'Bespoke Essential Blends', 'Yoga & Meditation Masters'],
  },
  'moon-pool': {
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    highlights: ['60m Cliff-Edge Infinity', 'Chilled Towel & Mist Service', 'Private Sunbed Attendants', 'Panoramic Sunset Facing'],
  },
  'surf-bar': {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Handcrafted Beach Cocktails', 'Cold-Pressed Tropical Juices', 'Direct Surf Access Deck', 'Acoustic Sunset Sessions'],
  },
  gym: {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Ocean-Facing Cardio Deck', 'Private Fitness Coaching', 'Open-Air Stretching Lawn', 'Infused Water & Towels'],
  },
  'main-square': {
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Central Resort Piazza', 'Shaded Coconut Grove Paths', 'Heritage Water Features', 'Buggy Crossroads Hub'],
  },
  'cape-shop': {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Artisan Ceylon Silks', 'Handmade Silver Jewelry', 'Dilmah Single-Estate Teas', 'Eco Resort Wear'],
  },
  'pola-restaurant': {
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Clay Pot Curry Traditions', 'Fire-Roasted Coconut Sambol', 'Open Market Style Dining', 'Organic Garden Spices'],
  },
  'ocean-terrace': {
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Daily Fisherman Catch', 'Curated Sommelier Cellar', 'Clifftop Candlelight Tables', 'Fresh Herb Infusions'],
  },
  tableau: {
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    highlights: ['7-Course Degustation', 'Private Executive Chef Table', 'Intimate 12-Seat Setting', 'Vintage Champagne Pairings'],
  },
  'cape-club': {
    image: 'https://images.unsplash.com/photo-1510414842564-598c451152ad?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Ceylon High Tea Rituals', 'Single Malt & Cigar Lounge', 'Stargazing Telescope Deck', '270° Ocean Horizon'],
  },
  'cove-pool': {
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Secluded Family Sanctuary', 'Gentle Shallow Waters', 'Poolside Lunch Service', 'Surrounded by Frangipani'],
  },
  'east-beach-gate': {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Private Beach Access Gate', 'PADI Dive & Snorkel Center', 'Stand-Up Paddleboards', 'Guided Coastal Kayaking'],
  },
  'cliff-edge-walkway': {
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Dramatically Elevated Trail', 'Crashing Surf Vista Points', 'Indigenous Flora Markers', 'Sunset Photography Path'],
  },
  'west-beach-stairs': {
    image: 'https://images.unsplash.com/photo-1510414842564-598c451152ad?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Carved Stone Staircase', 'Access to Secluded Cove', 'Golden Hour Rock Pools', 'Tide Watch Recommendations'],
  },
  'lookout-fin': {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Ocean Sunfish Viewpoint', 'Elevated Photographic Deck', 'Sea Turtle Spotting', 'Unobstructed Western Sunsets'],
  },
  'lookout-minke': {
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Blue Whale Migration Post', 'Complimentary Binoculars', 'Resident Naturalist Briefings', 'Southern Ocean Breezes'],
  },
  'lookout-blue': {
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Southernmost Cape Point', 'Endless 270° Ocean Arch', 'Star & Moon Gazing Terrace', 'Sunrise to Sunset Panorama'],
  },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   NATIVE iOS-STYLE SWIPE-TO-DISMISS DRAWER COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

interface SelectedPinDrawerProps {
  selected: ResortAmenity;
  onClose: () => void;
}

function SelectedPinDrawer({ selected, onClose }: SelectedPinDrawerProps) {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDirectDragRef = useRef<boolean>(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleTriggerClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTriggerClose = () => {
    setIsClosing(true);
    setTranslateY(typeof window !== 'undefined' ? window.innerHeight : 600);
    setTimeout(() => {
      onClose();
    }, 220);
  };

  // Touch handlers for native iOS swipe physics
  const handleTouchStart = (e: React.TouchEvent, isFromHeaderOrHandle: boolean) => {
    e.stopPropagation();
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    currentYRef.current = touch.clientY;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
    isDirectDragRef.current = isFromHeaderOrHandle;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const currentY = touch.clientY;
    const deltaY = currentY - startYRef.current;

    // Track drag velocity
    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (currentY - currentYRef.current) / dt;
    }
    lastTimeRef.current = now;
    currentYRef.current = currentY;

    // Check scroll position of internal content
    const scrollTop = contentRef.current ? contentRef.current.scrollTop : 0;

    if (isDirectDragRef.current) {
      // Direct drag on header or handle: moves card immediately
      if (deltaY > 0) {
        setTranslateY(deltaY);
      } else {
        // Elastic rubber-band resistance when pulled up
        setTranslateY(deltaY * 0.15);
      }
    } else {
      // Dragging inside scrollable content area:
      // Only drag down if content is at top (scrollTop <= 0) and dragging downwards
      if (scrollTop <= 0 && deltaY > 0) {
        setTranslateY(deltaY);
      } else {
        setTranslateY(0);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(false);

    // Dismiss threshold: dragged down > 90px OR downward flick with velocity
    const shouldDismiss =
      translateY > 90 || (velocityRef.current > 0.45 && translateY > 25);

    if (shouldDismiss) {
      handleTriggerClose();
    } else {
      // Spring back cleanly to translateY(0)
      setTranslateY(0);
    }
  };

  // Desktop mouse drag support on grab handle
  const handleMouseDownHandle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startY = e.clientY;
    setIsDragging(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      if (deltaY > 0) {
        setTranslateY(deltaY);
      }
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      const deltaY = upEvent.clientY - startY;
      if (deltaY > 90) {
        handleTriggerClose();
      } else {
        setTranslateY(0);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const details = AMENITY_DETAILS[selected.id] || {
    image: DEFAULT_FALLBACK_IMAGE,
    highlights: DEFAULT_HIGHLIGHTS,
  };

  const backdropOpacity = isClosing
    ? 0
    : Math.max(0, 1 - Math.min(translateY / 240, 1));

  return (
    <>
      {/* Smooth backdrop overlay */}
      <div
        className="fixed inset-0 z-[1999] bg-black/30 backdrop-blur-[2px] transition-opacity"
        style={{
          opacity: backdropOpacity,
          pointerEvents: isClosing ? 'none' : 'auto',
          transition: isDragging ? 'none' : 'opacity 0.22s ease-out',
        }}
        onClick={handleTriggerClose}
      />

      {/* Card container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selected.title}
        className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-2xl border-t border-x border-stone-200/80 rounded-t-[28px] shadow-[0_-15px_40px_rgba(0,0,0,0.18)] z-[2000] p-6 pb-[max(2rem,env(safe-area-inset-bottom))] flex flex-col will-change-transform"
        style={{
          transform: `translate3d(0, ${Math.max(0, translateY)}px, 0)`,
          opacity: isClosing ? 0 : 1,
          transition: isDragging
            ? 'none'
            : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out',
          touchAction: isDragging ? 'none' : 'pan-y',
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grab Handle Header Bar */}
        <div
          className="w-full flex flex-col items-center select-none pt-0 pb-1 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDownHandle}
          onTouchStart={(e) => handleTouchStart(e, true)}
        >
          {/* Centered 40px wide, 4px high pill with bg-stone-300 rounded-full my-2.5 cursor-grab active:cursor-grabbing */}
          <div className="w-10 h-1 bg-stone-300 rounded-full my-2.5 cursor-grab active:cursor-grabbing hover:bg-stone-400 transition" />

          {/* Header row */}
          <div className="w-full flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                style={{ background: CATEGORY_COLORS[selected.category] }}
              >
                {selected.num}
              </span>
              <div className="min-w-0">
                <span className="text-[9.5px] sm:text-[10px] tracking-widest uppercase font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                  {selected.category}
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mt-0.5 truncate">
                  {selected.title}
                </h3>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={handleTriggerClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition active:scale-90 cursor-pointer shrink-0 -mr-1"
              aria-label="Close sheet"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container: max-h-[65dvh] overflow-y-auto overscroll-contain */}
        <div
          ref={contentRef}
          className="max-h-[65dvh] overflow-y-auto overscroll-contain pr-1 mt-2.5 space-y-4 no-scrollbar"
          onTouchStart={(e) => handleTouchStart(e, false)}
        >
          {/* High-res Amenity Image */}
          <div className="relative w-full aspect-video sm:aspect-21/9 rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
            <img
              src={details.image}
              alt={selected.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
              <Sparkles className="w-3 h-3 text-[#C5A880]" />
              <span>Cape Weligama Pavilions</span>
            </div>
          </div>

          {/* Full Luxury Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            {selected.description}
          </p>

          {/* Pavilion Highlights & Amenities List */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Pavilion Highlights &amp; Amenities
            </span>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {details.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/60 rounded-xl px-2.5 py-2 text-[11px] text-stone-700 font-medium"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: CATEGORY_COLORS[selected.category] }}
                  />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary WhatsApp Action Button */}
          <div className="pt-2 sticky bottom-0 bg-gradient-to-t from-white/95 via-white/90 to-transparent pb-1">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(selected.whatsAppMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="apple-bounce w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 active:scale-[0.94] text-white text-xs sm:text-sm font-semibold py-3.5 rounded-2xl shadow-xl transition-all duration-150 min-h-[48px] cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{selected.actionText}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

interface ResortMasterplanProps {
  isAdmin?: boolean;
}

export default function ResortMasterplan({ isAdmin: propIsAdmin = false }: ResortMasterplanProps) {
  /* ── State ───────────────────────────────────────────────────────────────── */
  const [amenities, setAmenities] = useState<ResortAmenity[]>(DEFAULT_AMENITIES);
  const [selected, setSelected] = useState<ResortAmenity | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  // Admin state — strictly active only if ?admin=true
  const [isAdmin, setIsAdmin] = useState<boolean>(propIsAdmin);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editPinId, setEditPinId] = useState<string>('reception');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync prop or check window.location.search on mount
  useEffect(() => {
    if (propIsAdmin) {
      setIsAdmin(true);
      setIsEditorOpen(true);
      return;
    }
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const isParam = p.get('admin') === 'true';
      setIsAdmin(isParam);
      if (isParam) {
        setIsEditorOpen(true);
      }
    }
  }, [propIsAdmin]);

  /* ── Load saved pin coords from localStorage ─────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === DEFAULT_AMENITIES.length) {
            setAmenities(parsed);
          }
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  /* ── Admin keyboard shortcut: 'E' to toggle editor (admin only) ──────── */
  useEffect(() => {
    if (!isAdmin) return;
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) return;
      if (e.key === 'e' || e.key === 'E') {
        setIsEditorOpen((p) => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAdmin]);

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  const toast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400);
  };

  const handleMovePin = (coords: [number, number]) => {
    if (!editPinId) return;
    setAmenities((prev) => {
      const updated = prev.map((a) => a.id === editPinId ? { ...a, coords } : a);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* */ }
      return updated;
    });
    const pin = amenities.find((a) => a.id === editPinId);
    toast(`📍 Moved #${pin?.num ?? ''} to [${coords[0]}, ${coords[1]}]`);
  };

  const handleCopyAll = () => {
    const json = JSON.stringify(
      amenities.map(({ num, id, title, category, coords }) => ({ num, id, title, category, coords })),
      null, 2,
    );
    if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(json);
    toast('📋 Copied all pin coordinates');
  };

  const handleReset = () => {
    setAmenities(DEFAULT_AMENITIES);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
    toast('↺ Reset all pins to defaults');
  };

  /* ── Derived ─────────────────────────────────────────────────────────── */
  const filteredAmenities = activeFilter === 'All'
    ? amenities
    : amenities.filter((a) => a.category === activeFilter);

  const editPin = amenities.find((a) => a.id === editPinId) ?? amenities[0];

  /* ═════════════════════════════════════════════════════════════════════════ */
  return (
    <div
      className="fixed inset-0 w-screen h-[100dvh] overflow-hidden select-none"
      style={{ backgroundColor: PARCHMENT_BG }}
    >

      {/* ── CATEGORY FILTER PILLS (Floating below top bar) ───────────────── */}
      {!isEditorOpen && (
        <div
          className={`fixed ${isAdmin ? 'top-22 sm:top-25' : 'top-[58px] sm:top-20'} left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-white/85 backdrop-blur-2xl p-1 rounded-2xl border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-x-auto max-w-[calc(100vw-20px)] sm:max-w-2xl no-scrollbar pointer-events-auto transition-all duration-300`}
          style={{ WebkitOverflowScrolling: 'touch' }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {FILTER_OPTIONS.map(({ key, label }) => {
            const isActive = activeFilter === key;
            const dotColor = key === 'All' ? undefined : CATEGORY_COLORS[key as PinCategory];
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveFilter(key);
                  setSelected(null);
                }}
                className={`apple-bounce flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-[11.5px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.92] cursor-pointer min-h-[34px] ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                }`}
              >
                {dotColor && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: dotColor }}
                  />
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── TOAST NOTIFICATION ───────────────────────────────────────────── */}
      {toastMsg && (
        <div className="fixed top-26 sm:top-30 left-1/2 -translate-x-1/2 z-[1500] bg-stone-900/95 text-white px-4 py-2 rounded-full shadow-2xl border border-stone-700 text-xs font-semibold backdrop-blur-md max-w-[90vw] text-center truncate pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          {toastMsg}
        </div>
      )}

      {/* ── ADMIN PIN EDITOR TOGGLE BUTTON (admin only) ──────────────────── */}
      {isAdmin && (
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditorOpen((p) => !p);
          }}
          className={`fixed top-[58px] sm:top-20 right-2.5 sm:right-6 z-[1200] px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl transition-all shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer min-h-[34px] ${
            isEditorOpen
              ? 'bg-amber-500 text-stone-950 border border-amber-400'
              : 'bg-white/90 hover:bg-white text-stone-900 border border-white/60'
          }`}
          title="Toggle Pin Placement Editor (Hotkey: E)"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditorOpen ? 'Exit' : '🎯 Pins'}</span>
        </button>
      )}

      {/* ── ADMIN PIN EDITOR PANEL (admin only) ──────────────────────────── */}
      {isAdmin && isEditorOpen && (
        <div
          className="fixed top-[58px] sm:top-24 left-2.5 right-2.5 sm:right-auto sm:left-6 z-[1200] max-h-[62vh] sm:max-h-[calc(100vh-120px)] sm:w-84 bg-stone-950/95 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 backdrop-blur-2xl p-4 flex flex-col gap-3 overflow-y-auto"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-serif font-bold text-white tracking-wide">
                PIN CALIBRATOR
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-400 font-mono">18 pins</span>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-stone-300 leading-snug">
            1. Select a pin from the list.<br />
            2. Tap anywhere on the masterplan to place it.
          </p>

          {/* Pin list */}
          <div className="max-h-48 sm:max-h-56 overflow-y-auto space-y-1 pr-1">
            {amenities.map((a) => {
              const active = a.id === editPinId;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setEditPinId(a.id);
                    toast(`Selected #${a.num} — ${a.title}`);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all border ${
                    active
                      ? 'bg-amber-400/15 border-amber-400 text-white font-semibold'
                      : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800 text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: CATEGORY_COLORS[a.category] }}
                    >
                      {a.num}
                    </span>
                    <span className="truncate">{a.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 shrink-0 ml-2">
                    [{a.coords[0]}, {a.coords[1]}]
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active target banner */}
          <div className="bg-amber-400/10 border border-amber-400/40 rounded-xl px-2.5 py-1.5 text-[11px] text-amber-300 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">
              Click map to place: <strong>#{editPin.num} {editPin.title}</strong>
            </span>
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyAll}
              className="flex-1 bg-stone-800 hover:bg-stone-700 active:scale-95 text-white py-1.5 px-2 rounded-xl text-[11px] font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy JSON</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-400 hover:text-white py-1.5 px-2.5 rounded-xl text-[11px] font-medium transition cursor-pointer"
              title="Reset all to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="bg-stone-100 hover:bg-white text-stone-900 active:scale-95 py-1.5 px-3 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      {/* ── LEAFLET INFINITE ARCHITECTURAL CANVAS ───────────────────────── */}
      <MapContainer
        key="resort-masterplan-container"
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={0.35}
        minZoom={-0.5}
        maxZoom={2.5}
        zoomSnap={0.1}
        zoomDelta={0.25}
        wheelPxPerZoomLevel={120}
        center={[IMAGE_HEIGHT / 2, IMAGE_WIDTH / 2]}
        className="w-full h-full resort-masterplan-map !bg-[#F5F3EC]"
        style={{ backgroundColor: PARCHMENT_BG, cursor: isEditorOpen ? 'crosshair' : 'grab' }}
        attributionControl={false}
      >
        <MapAutoFit bounds={bounds} />
        <ImageOverlay url="/resort-map.jpg" bounds={bounds} />

        <MapClickHandler
          enabled={isAdmin && isEditorOpen}
          onMapClick={handleMovePin}
        />

        {filteredAmenities.map((amenity) => {
          const isSel = selected?.id === amenity.id;
          const isEdit = isAdmin && isEditorOpen && amenity.id === editPinId;
          return (
            <Marker
              key={amenity.id}
              position={amenity.coords}
              icon={createPinIcon(amenity, isSel, isEdit)}
              zIndexOffset={isEdit ? 2000 : isSel ? 1000 : 0}
              eventHandlers={{
                click: () => {
                  if (isAdmin && isEditorOpen) {
                    setEditPinId(amenity.id);
                    toast(`Selected #${amenity.num} — ${amenity.title}`);
                  } else {
                    setSelected((prev) => prev?.id === amenity.id ? null : amenity);
                  }
                },
              }}
            />
          );
        })}
      </MapContainer>

      {/* ── FLOATING GUEST INSTRUCTION HINT ───────────────────────────────── */}
      {!isEditorOpen && !selected && (
        <div className="fixed bottom-[max(1.1rem,env(safe-area-inset-bottom))] sm:bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white/90 text-stone-800 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-xl border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.08)] pointer-events-none flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse" />
          <span>Pinch to Explore · Tap Any Pin</span>
        </div>
      )}

      {/* ── GUEST BOTTOM SHEET DRAWER (iOS Swipe-to-Dismiss & Content Scroll) ─ */}
      {!isEditorOpen && selected && (
        <SelectedPinDrawer
          key={selected.id}
          selected={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  );
}
