'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════════
   REGIONAL GPS COORDINATES & CONSTANTS
   Standard Leaflet CRS.EPSG3857
   Center: [6.0100, 80.2900]
   ═══════════════════════════════════════════════════════════════════════════════ */

export const REGIONAL_CENTER: [number, number] = [6.0100, 80.2900];
export const REGIONAL_DEFAULT_ZOOM = 12;

export interface RegionalPin {
  id: string;
  name: string;
  title: string;
  emoji: string;
  coords: [number, number]; // [latitude, longitude]
  category: string;
  time: string;
  distance: string;
  desc: string;
  token: string;
  isHomeBase?: boolean;
}

export const REGIONAL_PINS: RegionalPin[] = [
  {
    id: 'kahanda-kanda',
    name: 'Kahanda Kanda',
    title: 'Kahanda Kanda (Home Base)',
    emoji: '🏡',
    coords: [6.0076, 80.3444],
    category: 'Estate Sanctuary',
    time: 'Current Location',
    distance: 'Home Base',
    desc: 'Our secluded 12-acre boutique tea estate sanctuary perched on a ridge above Koggala Lake. Sanctuary of living heritage joglos, working tea plantation, and 20m lap pool.',
    token: 'KK-ESTATE-HOME',
    isHomeBase: true,
  },
  {
    id: 'kk-beach',
    name: 'KK Beach & Ocean Club',
    title: 'KK Beach & Ocean Club',
    emoji: '🏖️',
    coords: [5.9922, 80.3015],
    category: 'Sister Property',
    time: '15 mins drive',
    distance: '8.4 km',
    desc: 'Complimentary private transfer to sister beachfront retreat for ocean swimming, daybeds, and fresh seafood.',
    token: 'KK-BEACH-VIP',
  },
  {
    id: 'koggala-lake',
    name: 'Koggala Lake Catamaran Safari',
    title: 'Koggala Lake Catamaran Safari',
    emoji: '⛵',
    coords: [6.0028, 80.3312],
    category: 'Lake & Wildlife',
    time: '8 mins drive',
    distance: '4.2 km',
    desc: 'Private wooden boat cruise across Sri Lanka’s largest natural lake. Visit Cinnamon Island and hidden Buddhist monasteries.',
    token: 'KK-LAKE-BOAT',
  },
  {
    id: 'galle-fort',
    name: 'UNESCO Galle Fort Architectural Walk',
    title: 'UNESCO Galle Fort Architectural Walk',
    emoji: '🏛️',
    coords: [6.0270, 80.2170],
    category: 'Culture & Heritage',
    time: '25 mins drive',
    distance: '17 km',
    desc: 'Curated walking tour of 17th-century Dutch ramparts, gemstone boutiques, and colonial heritage cafes.',
    token: 'KK-GALLE-WALK',
  },
  {
    id: 'handunugoda-tea',
    name: 'Handunugoda Virgin White Tea Estate',
    title: 'Handunugoda Virgin White Tea Estate',
    emoji: '🍵',
    coords: [6.0090, 80.3620],
    category: 'Tea Heritage',
    time: '10 mins drive',
    distance: '5.1 km',
    desc: 'Tour the estate famous for untouched Virgin White Tea, plucked using golden scissors without human skin contact.',
    token: 'KK-TEA-TOUR',
  },
  {
    id: 'kabalana-surf',
    name: 'Kabalana "The Rock" Surf Point',
    title: 'Kabalana "The Rock" Surf Point',
    emoji: '🏄‍♂️',
    coords: [5.9754, 80.3542],
    category: 'Ocean & Surf',
    time: '18 mins drive',
    distance: '9.6 km',
    desc: 'Sri Lanka’s premier A-frame reef break. Includes private board rental and certified local coach arrangement.',
    token: 'KK-SURF-KAB',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   CUSTOM EMOJI CIRCULAR GLASS MARKER FACTORY
   ═══════════════════════════════════════════════════════════════════════════════ */

function createRegionalEmojiPinIcon(pin: RegionalPin, isSelected: boolean) {
  const isHome = pin.isHomeBase;
  const pinSize = isSelected ? 48 : isHome ? 44 : 38;
  const ringColor = isHome ? '#D4A359' : isSelected ? '#A6C498' : '#88A878';
  const fontSize = isSelected ? '21px' : isHome ? '19px' : '17px';

  return L.divIcon({
    className: 'kk-gps-emoji-pin',
    html: `
      <div style="position:relative;width:64px;height:64px;display:flex;align-items:center;justify-content:center;transform:translate(-50%,-50%);cursor:pointer;pointer-events:auto;">
        ${
          isHome
            ? `<div style="position:absolute;width:60px;height:60px;border-radius:50%;border:2px solid #D4A359;animation:gpsPulseRing 2.4s cubic-bezier(0.2,0.8,0.2,1) infinite;pointer-events:none;"></div>`
            : ''
        }
        ${
          isSelected && !isHome
            ? `<div style="position:absolute;width:58px;height:58px;border-radius:50%;border:2px solid #88A878;animation:gpsPulseRing 2s cubic-bezier(0.2,0.8,0.2,1) infinite;pointer-events:none;"></div>`
            : ''
        }
        <div style="
          position:relative;
          z-index:2;
          width:${pinSize}px;
          height:${pinSize}px;
          border-radius:50%;
          background:rgba(26,35,28,0.92);
          backdrop-filter:blur(8px);
          -webkit-backdrop-filter:blur(8px);
          border:2px solid ${ringColor};
          box-shadow:${
            isSelected || isHome
              ? '0 10px 24px rgba(0,0,0,0.65), 0 0 0 3px rgba(136,168,120,0.35)'
              : '0 4px 14px rgba(0,0,0,0.45)'
          };
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:${fontSize};
          line-height:1;
          user-select:none;
          transition:all 0.2s cubic-bezier(0.16,1,0.3,1);
        ">
          <span>${pin.emoji}</span>
          <span style="
            position:absolute;
            bottom:-3px;
            width:6px;
            height:6px;
            border-radius:50%;
            background:${ringColor};
            border:1px solid #1A231C;
          "></span>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAP CONTROLLER (Recenter & Smooth Pan)
   ═══════════════════════════════════════════════════════════════════════════════ */

function KKMapController({
  selectedPin,
  recenterTrigger,
}: {
  selectedPin: RegionalPin | null;
  recenterTrigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    if (selectedPin) {
      map.flyTo(selectedPin.coords, Math.max(map.getZoom(), 13), {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedPin, map]);

  useEffect(() => {
    if (recenterTrigger > 0) {
      map.flyTo(REGIONAL_CENTER, REGIONAL_DEFAULT_ZOOM, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [recenterTrigger, map]);

  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT PROPS
   ═══════════════════════════════════════════════════════════════════════════════ */

interface KKCoastMapProps {
  selectedPin: RegionalPin | null;
  onSelectPin: (pin: RegionalPin | null) => void;
  activeCategory?: string;
}

export default function KKCoastMap({
  selectedPin,
  onSelectPin,
  activeCategory = 'All',
}: KKCoastMapProps) {
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  // Filter pins based on selected filter pill
  const filteredPins = useMemo(() => {
    if (activeCategory === 'All') return REGIONAL_PINS;
    if (activeCategory === 'Beach & Surf') {
      return REGIONAL_PINS.filter(
        (p) => p.category === 'Sister Property' || p.category === 'Ocean & Surf'
      );
    }
    if (activeCategory === 'Culture & Lake') {
      return REGIONAL_PINS.filter(
        (p) => p.category === 'Culture & Heritage' || p.category === 'Lake & Wildlife'
      );
    }
    if (activeCategory === 'Tea & Estate') {
      return REGIONAL_PINS.filter(
        (p) => p.category === 'Estate Sanctuary' || p.category === 'Tea Heritage'
      );
    }
    return REGIONAL_PINS;
  }, [activeCategory]);

  return (
    <div className="relative w-full h-full bg-[#1A231C] overflow-hidden select-none">
      {/* ── Keyframe Animations for Regional GPS Markers ──────────────── */}
      <style jsx global>{`
        @keyframes gpsPulseRing {
          0% {
            transform: scale(0.85);
            opacity: 0.95;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .kk-gps-emoji-pin {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* ── FLOATING RECENTER BUTTON ──────────────────────────────────── */}
      <div className="absolute top-24 sm:top-28 right-4 z-[400] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setRecenterTrigger((p) => p + 1)}
          className="bg-[#1A231C]/90 hover:bg-[#28372C] active:scale-95 text-[#A6C498] hover:text-[#F5F7F2] p-2.5 rounded-2xl border border-[#88A878]/30 shadow-xl backdrop-blur-md transition-all cursor-pointer flex items-center justify-center"
          title="Recenter Galle Coast Map"
        >
          <LocateFixed className="w-4 h-4" />
        </button>
      </div>

      {/* ── LEAFLET GPS REGIONAL MAP CONTAINER (ESRI DARK GRAY) ────────── */}
      <MapContainer
        key="kk-coast-gps-map"
        center={REGIONAL_CENTER}
        zoom={REGIONAL_DEFAULT_ZOOM}
        minZoom={10}
        maxZoom={16}
        zoomSnap={0.25}
        zoomDelta={0.5}
        className="w-full h-full !bg-[#1A231C]"
        style={{ backgroundColor: '#1A231C' }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
          pane="tilePane"
        />

        <KKMapController
          selectedPin={selectedPin}
          recenterTrigger={recenterTrigger}
        />

        {/* Markers with Signature Emoji Badges */}
        {filteredPins.map((pin) => {
          const isSelected = selectedPin?.id === pin.id;

          return (
            <Marker
              key={pin.id}
              position={pin.coords}
              icon={createRegionalEmojiPinIcon(pin, isSelected)}
              zIndexOffset={pin.isHomeBase ? 1500 : isSelected ? 1200 : 300}
              eventHandlers={{
                click: () => {
                  onSelectPin(isSelected ? null : pin);
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
