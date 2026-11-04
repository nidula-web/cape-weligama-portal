'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useConcierge } from '@/context/ConciergeContext';
import { Spot } from '@/types';
import { Compass } from 'lucide-react';

// Map controller to smoothly fly with Apple-like spring easing
function MapViewController({
  selectedSpot,
  recenterTrigger,
  centerPosition,
}: {
  selectedSpot: Spot | null;
  recenterTrigger: number;
  centerPosition: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedSpot) {
      map.flyTo([selectedSpot.lat, selectedSpot.lng], 14, {
        duration: 0.9,
        easeLinearity: 0.18,
      });
    }
  }, [selectedSpot, map]);

  useEffect(() => {
    if (recenterTrigger > 0) {
      map.flyTo(centerPosition, 13, {
        duration: 1.1,
        easeLinearity: 0.18,
      });
    }
  }, [recenterTrigger, centerPosition, map]);

  return null;
}

// Category design system: Earth & jewel luxury tones + fine-line pure white vector iconography
interface CategoryStyle {
  bgGradient: string;
  glowClass: string;
  accentHex: string;
  iconSvg: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'Surf & Breaks': {
    bgGradient: 'bg-gradient-to-b from-[#1C415D] to-[#122A3D]', // Deep Ocean Indigo
    glowClass: 'bg-sky-400/30',
    accentHex: '#1C415D',
    // Fine-crafted rolling wave arcs
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
  },
  'Cafes & Dining': {
    bgGradient: 'bg-gradient-to-b from-[#8C4624] to-[#6A3217]', // Spiced Terracotta / Cinnamon
    glowClass: 'bg-amber-500/30',
    accentHex: '#8C4624',
    // Minimalist porcelain coffee cup with rising steam
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
  },
  'Wellness & Yoga': {
    bgGradient: 'bg-gradient-to-b from-[#1E4334] to-[#132E23]', // Ceylon Botanical Sage & Jade
    glowClass: 'bg-emerald-500/30',
    accentHex: '#1E4334',
    // Serene Ayurvedic lotus blossom
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1.8 3-3.5 6.5-3.5 9.5a3.5 3.5 0 0 0 7 0C15.5 9.5 13.8 6 12 3Z"/><path d="M5.5 11c1.8 3 4.2 4.8 6.5 5.2-1.2-1.5-2.2-3.8-2-6.2-1.8.3-3.3 1.2-4.5 1Z"/><path d="M18.5 11c-1.8 3-4.2 4.8-6.5 5.2 1.2-1.5 2.2-3.8 2-6.2 1.8.3 3.3 1.2 4.5 1Z"/><path d="M3 19c4.5 2.2 13.5 2.2 18 0"/></svg>`,
  },
  'Secret Spots': {
    bgGradient: 'bg-gradient-to-b from-[#6D4726] to-[#4F3117]', // Warm Antique Bronze & Cognac
    glowClass: 'bg-[#C5A880]/40',
    accentHex: '#6D4726',
    // Heritage navigational star compass rose
    iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="12 4 14.5 9.5 20 12 14.5 14.5 12 20 9.5 14.5 4 12 9.5 9.5 12 4" fill="#FFFFFF" fill-opacity="0.25"/><circle cx="12" cy="12" r="1.5" fill="#FFFFFF"/></svg>`,
  },
};

// High-Contrast Luxury Enamelled Vendor Pin with Apple Bouncy Jiggle & Touch Area
function createLuxuryVendorIcon(spot: Spot, isSelected: boolean): L.DivIcon {
  const config = CATEGORY_STYLES[spot.category] || CATEGORY_STYLES['Secret Spots'];

  const html = `
    <div class="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer ${isSelected ? 'pin-jiggle-active z-50' : 'group'}" style="touch-action: manipulation; width: 50px; height: 60px;" title="${spot.name}">
      
      <!-- Ambient Outer Glow on Hover / Active -->
      <div class="absolute -top-1 -left-1 w-14 h-14 rounded-full pointer-events-none flex items-center justify-center">
        <span class="w-14 h-14 rounded-full ${config.glowClass} ${isSelected ? 'opacity-95 scale-125 animate-pulse' : 'opacity-0 group-hover:opacity-60 transition-all duration-300'}"></span>
      </div>

      <!-- 40px Luxury Enamelled Circular Badge with Apple bounce -->
      <div class="apple-bounce relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${config.bgGradient} text-white border-2 border-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.32),0_2px_6px_rgba(0,0,0,0.18)] ${isSelected ? 'ring-4 ring-[#C5A880] scale-115 shadow-2xl' : ''}">
        <!-- Subtle Ceramic Sheen -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-black/15 pointer-events-none"></div>
        <div class="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          ${config.iconSvg}
        </div>
      </div>

      <!-- Needle Pointer to Coordinates -->
      <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white -mt-[1px] z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]"></div>
      <div class="w-2.5 h-1 bg-black/20 rounded-full blur-[1px] mt-0.5"></div>

      <!-- Floating Frosted Name Pill -->
      <div class="relative z-20 mt-1 bg-[#FAFAF8]/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#E5E4E0] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center gap-1.5 whitespace-nowrap pointer-events-none transition-all duration-200 ${isSelected ? 'ring-1 ring-[#1E3A2B] scale-105 opacity-100 shadow-md font-bold' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}">
        <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background-color: ${config.accentHex};"></span>
        <span class="text-[9.5px] sm:text-[10px] font-semibold text-[#1A1A1A] tracking-tight font-serif">${spot.name}</span>
      </div>

    </div>
  `;

  return L.divIcon({
    html,
    className: '!bg-transparent !border-0',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// Living "YOU ARE HERE" Hotel Beacon (Obsidian & Warm Brass Medallion + Radar Pulse)
function createHotelBeaconIcon(hotelName: string): L.DivIcon {
  const html = `
    <div class="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group" style="touch-action: manipulation;" title="You Are Here · ${hotelName}">
      
      <!-- Multi-Tiered Living Radar Radiance -->
      <div class="absolute w-24 h-24 -top-12 -left-12 rounded-full pointer-events-none flex items-center justify-center">
        <span class="beacon-sonar-ring absolute w-16 h-16 rounded-full bg-[#C5A880]/30 border border-[#C5A880]/50"></span>
        <span class="beacon-sonar-ring absolute w-16 h-16 rounded-full bg-emerald-500/25 border border-emerald-400/40" style="animation-delay: 1.4s;"></span>
        <span class="absolute w-8 h-8 rounded-full bg-[#1E3A2B]/40 blur-xs"></span>
      </div>

      <!-- Main Luxury Badge Capsule with Apple bounce -->
      <div class="apple-bounce relative z-10 flex items-center gap-2 bg-gradient-to-r from-[#181816] via-[#20201E] to-[#181816] text-white px-3 sm:px-3.5 py-1.5 rounded-full shadow-[0_10px_28px_rgba(0,0,0,0.45)] border border-[#C5A880] ring-1 ring-white/20 whitespace-nowrap">
        
        <!-- Golden Villa Crest Icon -->
        <span class="w-5 h-5 rounded-full bg-[#C5A880]/25 border border-[#C5A880]/70 flex items-center justify-center text-[#EADBBE] shrink-0 shadow-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </span>

        <!-- Distinctive Label -->
        <span class="text-[9.5px] sm:text-[10.5px] font-semibold tracking-[0.2em] uppercase text-white font-sans">
          CAPE WELIGAMA
        </span>

        <!-- Breathing Emerald Live Indicator -->
        <span class="relative flex h-2 w-2 shrink-0">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-1 ring-white/60"></span>
        </span>

      </div>

      <!-- Bottom Ground Anchor Needle -->
      <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#C5A880] -mt-[1px] shadow-sm z-10"></div>
      <div class="w-3.5 h-1 bg-black/30 rounded-full blur-[1px] mt-0.5"></div>

    </div>
  `;

  return L.divIcon({
    html,
    className: '!bg-transparent !border-0',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function ConciergeMap() {
  const { property, filteredSpots, selectedSpot, setSelectedSpot } = useConcierge();
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street');
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  // Cape Weligama GPS — fixed center for the coastal guide
  const hotelLat = property.lat || 5.9680;
  const hotelLng = property.lng || 80.4320;

  // Center map on Cape Weligama
  const centerPosition: [number, number] = [hotelLat, hotelLng];

  // Pre-generate marker icons for performance
  const markerIcons = useMemo(() => {
    const icons: Record<string, L.DivIcon> = {};
    filteredSpots.forEach((spot) => {
      icons[spot.id] = createLuxuryVendorIcon(spot, selectedSpot?.id === spot.id);
    });
    return icons;
  }, [filteredSpots, selectedSpot]);

  const hotelBeaconIcon = useMemo(() => {
    return createHotelBeaconIcon(property.name);
  }, [property.name]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      
      {/* Floating Recenter Compass Pill (Mobile & Desktop with Apple Spring Bounce, clear of top bar) */}
      <button
        type="button"
        onClick={() => setRecenterTrigger((p) => p + 1)}
        className="apple-bounce absolute top-[116px] sm:top-24 right-3 sm:right-6 z-[400] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E5E4E0] shadow-md text-stone-800 text-[10.5px] sm:text-[11px] font-semibold active:scale-90 transition-all cursor-pointer"
        title="Recenter Map on Cape Weligama"
      >
        <Compass className="w-3.5 h-3.5 text-[#C5A880] animate-spin [animation-duration:12s]" />
        <span>Cape Weligama</span>
      </button>

      {/* Sleek Minimalist Luxury Layer Switcher (Bottom-Left with Apple Bouncy Press, clear of ViewSwitcher) */}
      <div className="absolute bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4rem))] left-3 sm:bottom-6 sm:left-6 z-[400] flex bg-white/95 sm:bg-white/90 backdrop-blur-md rounded-full p-1 border border-[#E5E4E0] shadow-md sm:shadow-sm">
        <button
          type="button"
          onClick={() => setMapStyle('street')}
          className={`apple-bounce px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-full transition-all active:scale-90 ${
            mapStyle === 'street' 
              ? 'bg-[#1A1A1A] text-white shadow-xs' 
              : 'text-[#706E6B] hover:text-[#1A1A1A]'
          }`}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('satellite')}
          className={`apple-bounce px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-full transition-all active:scale-90 ${
            mapStyle === 'satellite' 
              ? 'bg-[#1A1A1A] text-white shadow-xs' 
              : 'text-[#706E6B] hover:text-[#1A1A1A]'
          }`}
        >
          Satellite
        </button>
      </div>

      <MapContainer
        key="concierge-coastal-map"
        center={centerPosition}
        zoom={12}
        minZoom={10}
        maxZoom={21}
        scrollWheelZoom={true}
        className="w-full h-full subdued-leaflet-map"
      >
        {mapStyle === 'street' ? (
          /* Google Roadmap Tile Layer with Soft Muted Luxury Filter */
          <TileLayer
            key="google-street"
            className="subdued-map-tiles"
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
            maxZoom={21}
          />
        ) : (
          /* Google Satellite Hybrid (Satellite + Road & Place Overlays) */
          <TileLayer
            key="google-satellite"
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
            maxZoom={21}
          />
        )}

        <MapViewController
          selectedSpot={selectedSpot}
          recenterTrigger={recenterTrigger}
          centerPosition={centerPosition}
        />

        {/* Living "YOU ARE HERE" Hotel Beacon */}
        <Marker
          position={[hotelLat, hotelLng]}
          icon={hotelBeaconIcon}
          zIndexOffset={1000}
          eventHandlers={{
            click: () => {
              setRecenterTrigger((p) => p + 1);
            },
          }}
        />

        {/* Vibrant Luxury Curated Vendor Markers */}
        {filteredSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={markerIcons[spot.id] || createLuxuryVendorIcon(spot, false)}
            eventHandlers={{
              click: () => {
                setSelectedSpot(spot);
              },
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
