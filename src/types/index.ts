export type Category =
  | 'All'
  | 'Surf & Breaks'
  | 'Cafes & Dining'
  | 'Wellness & Yoga'
  | 'Secret Spots'
  | 'Villa'
  | 'Pool'
  | 'Dining'
  | 'Wellness';

export interface Property {
  id: string;
  slug: string;
  aliases: string[];
  name: string;
  location: string;
  lat: number;
  lng: number;
  tagline: string;
  welcomeMessage: string;
  vipRef: string;
}

export interface Spot {
  id: string;
  name: string;
  category: string;
  location: string;
  lat: number;
  lng: number;
  tip: string;
  image: string;
  whatsapp: string;
  priceRange?: '$$' | '$$$' | '$$$$';
  curatorBadge?: string;
  status: 'active' | 'inactive';
  inquiriesCount: number;
  rating?: number;
  description?: string;
  openingHours?: string;
  propertyId?: string; // Optional: specific hotel exclusive spot
  actionLabel?: string; // Custom CTA button label (e.g. "Call Electric Buggy to Villa")
  whatsappMessage?: string; // Pre-filled custom WhatsApp message
  isResortSpot?: boolean; // True if on-site resort masterplan amenity
}

export type ViewMode = 'map' | 'list';

export interface InquiryEvent {
  id: string;
  spotId: string;
  spotName: string;
  propertyId: string;
  propertyName: string;
  timestamp: string;
  estimatedValue?: number;
  commission: number;
}
