'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, ImageOverlay, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, Copy, Check, RotateCcw } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════════
   KK RESORT CONSTANTS & SPECIFICATIONS
   Image Dimensions: 9803px Width x 7086px Height
   Leaflet CRS.Simple Bounds: [[0, 0], [7086, 9803]]
   Leaflet coordinates: [lat (Y), lng (X)] -> [0..7086, 0..9803]
   ═══════════════════════════════════════════════════════════════════════════════ */

export const IMAGE_WIDTH = 9803;
export const IMAGE_HEIGHT = 7086;
export const KK_BOUNDS: L.LatLngBoundsExpression = [
  [0, 0],
  [IMAGE_HEIGHT, IMAGE_WIDTH],
];
export const KK_CENTER: [number, number] = [IMAGE_HEIGHT / 2, IMAGE_WIDTH / 2];

export type KKTag =
  | 'Master Suite'
  | 'Pool Suite'
  | 'Private Pool'
  | 'Tea Suite'
  | 'Dining'
  | 'Relax'
  | 'Wellness'
  | 'Cocktails'
  | 'Service';

export interface KKPin {
  id: string;
  num: number;
  title: string;
  coords: [number, number]; // [lat (Y), lng (X)]
  tag: KKTag;
  desc: string;
  category: 'Suites' | 'Dining' | 'Wellness' | 'Service';
  highlights: string[];
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ALL 20 KAHANDA KANDA NUMBERED MASTERPLAN LOCATIONS (EXACT ARCHITECTURAL PINS)
   ═══════════════════════════════════════════════════════════════════════════════ */

export const KK_DEFAULT_PINS: KKPin[] = [
  {
    id: 'security-hut',
    num: 1,
    title: 'Security Hut',
    coords: [1470, 5653],
    tag: 'Service',
    category: 'Service',
    desc: 'The main arrival gateway and 24-hour security checkpoint welcoming guests to Kahanda Kanda estate.',
    highlights: ['24-hour estate security', 'Personal greeting & welcome', 'Luggage transfer assistance', 'Estate arrival portal'],
  },
  {
    id: 'villa-nelum',
    num: 2,
    title: 'Plantation Pool Villa — Nelum',
    coords: [2920, 7663],
    tag: 'Private Pool',
    category: 'Suites',
    desc: 'Lotus suite featuring a private 30ft plunge pool overlooking the jungle canopy and cinnamon hills.',
    highlights: ['30ft private plunge pool', 'Jungle canopy vistas', 'Deep-soaking copper tub', 'Spacious open-air veranda'],
  },
  {
    id: 'villa-peacock',
    num: 3,
    title: 'Plantation Villa — Peacock',
    coords: [3729, 8455],
    tag: 'Tea Suite',
    category: 'Suites',
    desc: 'Charming plantation villa nestled amidst lush green foliage with private veranda and wild peacock visits.',
    highlights: ['Private tropical veranda', 'Four-poster king bed', 'Garden view rain shower', 'Planter-style furnishings'],
  },
  {
    id: 'villa-araliya',
    num: 4,
    title: 'Plantation Pool Villa — Araliya',
    coords: [4007, 8876],
    tag: 'Pool Suite',
    category: 'Suites',
    desc: 'Secluded pool villa surrounded by frangipani blossoms featuring a private plunge pool and tranquil garden.',
    highlights: ['Private plunge pool', 'Frangipani garden setting', 'Outdoor daybed & loungers', 'Sun-drenched stone bath'],
  },
  {
    id: 'villa-tamarind',
    num: 5,
    title: 'Plantation Villa — Tamarind',
    coords: [4362, 8161],
    tag: 'Tea Suite',
    category: 'Suites',
    desc: 'Spacious colonial-inspired villa secluded under ancient tamarind branches inside living tea bushes.',
    highlights: ['Colonial planter veranda', 'Immersed in tea bushes', 'Timber-beamed ceilings', 'Private morning tea service'],
  },
  {
    id: 'villa-mango',
    num: 6,
    title: 'Plantation Villa — Mango',
    coords: [4595, 7507],
    tag: 'Tea Suite',
    category: 'Suites',
    desc: 'Boutique plantation villa shaded by mature mango trees, boasting panoramic estate vistas and cooling breezes.',
    highlights: ['Mature mango tree canopy', 'Estate garden vistas', 'Handmade teak furniture', 'Private sun terrace'],
  },
  {
    id: 'living-pavilion',
    num: 7,
    title: 'The Living Pavilion',
    coords: [4015, 7581],
    tag: 'Dining',
    category: 'Dining',
    desc: 'Grand open-air colonial pavilion for daily farm-to-table breakfast, Ceylon afternoon high tea, and guest lounge.',
    highlights: ['Central open-air pavilion', 'Artisanal Ceylon high tea', 'Curated estate library', 'Sunset viewing lounge'],
  },
  {
    id: 'dining-pavilion',
    num: 8,
    title: 'The Dining Pavilion',
    coords: [3496, 6866],
    tag: 'Dining',
    category: 'Dining',
    desc: 'Refined estate dining pavilion serving contemporary Sri Lankan and fusion gastronomy overlooking the tea valley.',
    highlights: ['Panoramic valley overlook', 'Organic estate produce', 'Candlelit dinner service', 'Curated international wines'],
  },
  {
    id: 'office-gym',
    num: 9,
    title: 'Office & Gym',
    coords: [5563, 6740],
    tag: 'Wellness',
    category: 'Wellness',
    desc: 'Guest concierge office, estate library, and air-conditioned fitness gym with cardio equipment and free weights.',
    highlights: ['Air-conditioned fitness gym', 'Cardio & free weights', 'Concierge tour desk', 'Estate book collection'],
  },
  {
    id: 'kitchen',
    num: 10,
    title: 'The Estate Kitchen',
    coords: [5093, 6584],
    tag: 'Dining',
    category: 'Dining',
    desc: 'The vibrant heart of KK culinary operations, offering private masterclasses in traditional Sri Lankan curry cooking.',
    highlights: ['Private cooking classes', 'Chef farm-to-table prep', 'Spice garden tasting', 'Artisanal pastry bakery'],
  },
  {
    id: 'villa-kadju',
    num: 11,
    title: 'Plantation Luxury Pool Villa — Kadju',
    coords: [5134, 7132],
    tag: 'Pool Suite',
    category: 'Suites',
    desc: 'Cashew suite surrounded by lush tropical vegetation with private outdoor bathroom and secluded plunge pool.',
    highlights: ['Private courtyard plunge pool', 'Open-air stone bathroom', 'Four-poster king bed', 'Cashew tree grove setting'],
  },
  {
    id: 'suite-garden',
    num: 12,
    title: 'Plantation Suite — Garden',
    coords: [4840, 6102],
    tag: 'Tea Suite',
    category: 'Suites',
    desc: 'Serene plantation suite overlooking landscaped botanical gardens and flowering tropical bougainvillea.',
    highlights: ['Botanical garden outlook', 'Direct veranda access', 'Handcrafted colonial decor', 'Walk-in rainfall shower'],
  },
  {
    id: 'suite-tea',
    num: 13,
    title: 'Plantation Suite — Tea',
    coords: [4836, 5906],
    tag: 'Tea Suite',
    category: 'Suites',
    desc: 'Classic planter suite looking directly out over terraced tea rows with private veranda and heritage furnishings.',
    highlights: ['Terraced tea bush views', 'Private veranda seating', 'Antique Ceylon artwork', 'Personal butler service'],
  },
  {
    id: 'yoga-pavilion',
    num: 14,
    title: 'The Yoga Pavilion',
    coords: [3778, 5212],
    tag: 'Wellness',
    category: 'Wellness',
    desc: 'Open-air timber yoga shala offering complimentary morning sunrise yoga flows, guided meditation, and sound healing.',
    highlights: ['Timber jungle yoga shala', 'Morning sunrise classes', 'Meditation & breathwork', 'Complimentary mats & props'],
  },
  {
    id: 'spa',
    num: 15,
    title: 'The KK Spa Sanctuary',
    coords: [3663, 4873],
    tag: 'Wellness',
    category: 'Wellness',
    desc: 'Secluded wellness sanctuary offering signature Ayurvedic therapies, green tea body scrubs, and floral steam baths.',
    highlights: ['Ayurvedic doctor therapies', 'Ceylon green tea body scrub', 'Herbal steam & floral baths', 'Forest soundscape pavilions'],
  },
  {
    id: 'villa-hibiscus',
    num: 16,
    title: 'Plantation Pool Villa — Hibiscus',
    coords: [3402, 5870],
    tag: 'Pool Suite',
    category: 'Suites',
    desc: 'Romantic pool villa with private freshwater pool nestled among crimson hibiscus hedges and exotic palm trees.',
    highlights: ['Private swimming pool', 'Crimson hibiscus garden', 'Outdoor sun deck & daybed', 'Spacious open-plan lounge'],
  },
  {
    id: 'villa-hellaconia',
    num: 17,
    title: 'Plantation Pool Villa — Hellaconia',
    coords: [4121, 3345],
    tag: 'Pool Suite',
    category: 'Suites',
    desc: 'Private western pool villa perched high on a ridge, offering sunset views over wild cinnamon gardens and jungle.',
    highlights: ['Private infinity plunge pool', 'Golden sunset ridge views', 'Wild cinnamon forest setting', 'Luxurious outdoor shower'],
  },
  {
    id: 'villa-kumbuk',
    num: 18,
    title: 'Plantation Luxury Pool Villa — Kumbuk',
    coords: [3075, 2839],
    tag: 'Master Suite',
    category: 'Suites',
    desc: 'Grand luxury pool villa named after the sacred Kumbuk tree, with expansive living pavilion, infinity pool, and lawns.',
    highlights: ['Grand private pool villa', 'Sacred Kumbuk tree grove', 'Spacious private sun terrace', 'Dedicated estate butler'],
  },
  {
    id: 'villa-dubu',
    num: 19,
    title: 'Plantation Luxury Pool Villa — Dubu',
    coords: [3059, 2018],
    tag: 'Master Suite',
    category: 'Suites',
    desc: '100-year-old antique Javanese Joglo house nestled in lush tea fields with private pool, lotus pond, and garden.',
    highlights: ['100-year-old carved Joglo', 'Private infinity pool', 'Lotus pond & private lawn', 'Panoramic valley panoramas'],
  },
  {
    id: 'laundry',
    num: 20,
    title: 'Estate Laundry & Housekeeping',
    coords: [5795, 5955],
    tag: 'Service',
    category: 'Service',
    desc: 'Professional in-house guest laundry, garment pressing, and housekeeping facility keeping linens crisp and fresh.',
    highlights: ['Complimentary guest pressing', 'Same-day eco laundry service', 'Eco-friendly organic detergents', 'Dedicated housekeeping team'],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   TAG BADGE COLORS & STYLING (Ceylon Boutique Tea Estate)
   ═══════════════════════════════════════════════════════════════════════════════ */

export const TAG_COLORS: Record<KKTag, { bg: string; border: string; text: string; pinBg: string }> = {
  'Master Suite': { bg: 'rgba(136, 168, 120, 0.18)', border: '#88A878', text: '#D8E8D0', pinBg: '#1A231C' },
  'Pool Suite':   { bg: 'rgba(78, 135, 140, 0.20)', border: '#4E878C', text: '#B8E0E4', pinBg: '#1A231C' },
  'Private Pool': { bg: 'rgba(46, 111, 126, 0.22)', border: '#4E9EAE', text: '#C2EBF2', pinBg: '#1A231C' },
  'Tea Suite':    { bg: 'rgba(92, 124, 82, 0.20)',  border: '#88A878', text: '#D8E8D0', pinBg: '#1A231C' },
  'Dining':       { bg: 'rgba(194, 125, 80, 0.20)', border: '#C27D50', text: '#FAD8C0', pinBg: '#1A231C' },
  'Relax':        { bg: 'rgba(61, 123, 128, 0.22)', border: '#5C9FA4', text: '#C8EEF0', pinBg: '#1A231C' },
  'Wellness':     { bg: 'rgba(115, 142, 110, 0.20)',border: '#88A878', text: '#DBEADB', pinBg: '#1A231C' },
  'Cocktails':    { bg: 'rgba(192, 138, 62, 0.22)', border: '#D4A359', text: '#FCE6C2', pinBg: '#1A231C' },
  'Service':      { bg: 'rgba(139, 115, 85, 0.20)', border: '#8B7355', text: '#E5DACB', pinBg: '#1A231C' },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   CUSTOM LUXURY PIN ICON
   ═══════════════════════════════════════════════════════════════════════════════ */

function createKKPinIcon(pin: KKPin, isSelected: boolean, isCalibrating: boolean) {
  const colorSpec = TAG_COLORS[pin.tag] || TAG_COLORS['Master Suite'];
  const ringColor = isCalibrating ? '#F59E0B' : '#88A878';
  const accentColor = colorSpec.border;
  const pinSize = isSelected ? 42 : 36;

  return L.divIcon({
    className: 'kk-map-pin-marker',
    html: `
      <div style="position:relative;width:60px;height:60px;display:flex;align-items:center;justify-content:center;transform:translate(-50%,-50%);cursor:pointer;pointer-events:auto;">
        ${
          isSelected
            ? `<div style="position:absolute;width:56px;height:56px;border-radius:50%;border:2px solid ${accentColor};animation:kkPulseRing 2s cubic-bezier(0.2,0.8,0.2,1) infinite;pointer-events:none;"></div>`
            : ''
        }
        ${
          isCalibrating
            ? `<div style="position:absolute;width:58px;height:58px;border-radius:50%;border:2px dashed #F59E0B;background:rgba(245,158,11,0.18);animation:kkRotate 6s linear infinite;pointer-events:none;"></div>`
            : ''
        }
        <div style="
          position:relative;
          z-index:2;
          width:${pinSize}px;
          height:${pinSize}px;
          border-radius:50%;
          background:#1A231C;
          border:2px solid ${isSelected ? '#A6C498' : ringColor};
          box-shadow:${
            isSelected
              ? '0 12px 28px rgba(0,0,0,0.5), 0 0 0 3px rgba(136,168,120,0.45)'
              : '0 4px 16px rgba(0,0,0,0.35)'
          };
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          transition:all 0.2s cubic-bezier(0.16,1,0.3,1);
        ">
          <span style="
            font-family:serif, Georgia, -apple-system;
            font-size:${isSelected ? '14px' : '12px'};
            font-weight:700;
            color:#F5F7F2;
            line-height:1;
            letter-spacing:-0.01em;
          ">${pin.num}</span>
          <span style="
            position:absolute;
            bottom:-3px;
            width:6px;
            height:6px;
            border-radius:50%;
            background:${accentColor};
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
   MAP AUTO-FIT CONTROLLER
   Fits the native 9803x7086 image edge-to-edge with zero letterboxing
   ═══════════════════════════════════════════════════════════════════════════════ */

function KKMapAutoFit({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    map.fitBounds(bounds, {
      padding: [0, 0],
      animate: false,
    });

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      // Slightly focus towards central suites on mobile view
      const targetZoom = map.getBoundsZoom(bounds, false) + 0.35;
      map.setView([3800, 6000], targetZoom, { animate: false });
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => clearTimeout(timer);
  }, [map, bounds]);

  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CALIBRATION CLICK HANDLER
   Logs [lat, lng] to console and notifies parent
   ═══════════════════════════════════════════════════════════════════════════════ */

function KKCalibrationHandler({
  enabled,
  onMapClick,
}: {
  enabled: boolean;
  onMapClick: (coords: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      const lat = Math.round(e.latlng.lat);
      const lng = Math.round(e.latlng.lng);
      console.log('Pinned at:', [lat, lng]);
      console.log('📍 KK Map Calibration Click:', { lat, lng, coords: [lat, lng] });
      if (enabled) {
        onMapClick([lat, lng]);
      }
    },
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT PROPS
   ═══════════════════════════════════════════════════════════════════════════════ */

interface KKMapViewerProps {
  selectedPin: KKPin | null;
  onSelectPin: (pin: KKPin | null) => void;
  isAdmin?: boolean;
  activeFilter?: string;
  onCoordinatesUpdate?: (pinId: string, coords: [number, number]) => void;
}

export default function KKMapViewer({
  selectedPin,
  onSelectPin,
  isAdmin = false,
  activeFilter = 'All',
  onCoordinatesUpdate,
}: KKMapViewerProps) {
  const [pins, setPins] = useState<KKPin[]>(KK_DEFAULT_PINS);
  const [calibrationPinId, setCalibrationPinId] = useState<string>('villa-nelum');
  const [lastClickedCoords, setLastClickedCoords] = useState<[number, number] | null>(null);
  const [copied, setCopied] = useState(false);
  const [mapImageUrl, setMapImageUrl] = useState('/kk-map.jpg');

  // Verify whether kk-map.jpg or kk-map.png exists and set appropriate source
  useEffect(() => {
    const testImg = new Image();
    testImg.src = '/kk-map.jpg';
    testImg.onerror = () => {
      setMapImageUrl('/kk-map.png');
    };
  }, []);

  // Filter pins based on selected category tab
  const filteredPins = useMemo(() => {
    if (activeFilter === 'All') return pins;
    if (activeFilter === 'Suites') return pins.filter((p) => p.category === 'Suites');
    if (activeFilter === 'Dining') return pins.filter((p) => p.category === 'Dining');
    if (activeFilter === 'Wellness') return pins.filter((p) => p.category === 'Wellness');
    if (activeFilter === 'Services') return pins.filter((p) => p.category === 'Service');
    return pins;
  }, [pins, activeFilter]);

  const handleCalibrationClick = (coords: [number, number]) => {
    setLastClickedCoords(coords);
    if (!isAdmin || !calibrationPinId) return;

    setPins((prev) =>
      prev.map((pin) => (pin.id === calibrationPinId ? { ...pin, coords } : pin))
    );

    onCoordinatesUpdate?.(calibrationPinId, coords);
  };

  const handleCopyCoords = () => {
    if (!lastClickedCoords) return;
    const text = `[${lastClickedCoords[0]}, ${lastClickedCoords[1]}]`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyAllJson = () => {
    const json = JSON.stringify(
      pins.map((p) => ({
        num: p.num,
        id: p.id,
        title: p.title,
        tag: p.tag,
        coords: p.coords,
      })),
      null,
      2
    );
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResetPins = () => {
    setPins(KK_DEFAULT_PINS);
    setLastClickedCoords(null);
  };

  const activeCalibratingPin = pins.find((p) => p.id === calibrationPinId);

  return (
    <div className="relative w-full h-full bg-[#1A231C] overflow-hidden select-none">
      {/* ── Keyframe Animations for Ceylon Luxury Estate Theme ─────────── */}
      <style jsx global>{`
        @keyframes kkPulseRing {
          0% {
            transform: scale(0.85);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.25;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @keyframes kkRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .kk-map-pin-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {/* ── ADMIN CALIBRATION HUD (Visible when isAdmin is true) ───────── */}
      {isAdmin && (
        <div className="fixed top-20 sm:top-24 left-3 right-3 sm:left-6 sm:right-auto z-[1200] sm:w-88 bg-[#1A231C]/95 backdrop-blur-xl border border-[#88A878]/40 rounded-2xl p-4 shadow-2xl text-[#F5F7F2] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#88A878]/25 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-serif font-bold tracking-wider text-[#A6C498] uppercase">
                Pin Calibrator (20 Pins)
              </span>
            </div>
            <span className="text-[10px] font-mono text-stone-400 bg-stone-900/60 px-2 py-0.5 rounded-full border border-stone-800">
              Hotkey: E
            </span>
          </div>

          <p className="text-[11px] text-stone-300 leading-snug">
            Select any of the 20 estate locations below, then tap the map to calibrate its position.
          </p>

          {/* Active target pin selector */}
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
            {pins.map((pin) => {
              const isActive = pin.id === calibrationPinId;
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => setCalibrationPinId(pin.id)}
                  className={`text-left px-2 py-1.5 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1.5 border truncate ${
                    isActive
                      ? 'bg-[#88A878]/25 border-[#88A878] text-[#F5F7F2]'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#1A231C] border border-[#88A878] text-[9px] flex items-center justify-center font-bold text-[#88A878] shrink-0">
                    {pin.num}
                  </span>
                  <span className="truncate">{pin.title.replace('Plantation Pool Villa — ', '').replace('Plantation Villa — ', '')}</span>
                </button>
              );
            })}
          </div>

          {/* Coordinates readout bar */}
          <div className="bg-[#151D17] border border-[#88A878]/30 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <Crosshair className="w-4 h-4 text-[#88A878] shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-stone-400 uppercase tracking-wider truncate">
                  Target #{activeCalibratingPin?.num}: {activeCalibratingPin?.title}
                </div>
                <div className="font-mono text-[11px] font-semibold text-[#A6C498]">
                  {activeCalibratingPin
                    ? `[${activeCalibratingPin.coords[0]}, ${activeCalibratingPin.coords[1]}]`
                    : 'Select a pin'}
                </div>
              </div>
            </div>
            {lastClickedCoords && (
              <button
                type="button"
                onClick={handleCopyCoords}
                className="bg-[#88A878]/20 hover:bg-[#88A878]/30 active:scale-95 text-[#A6C498] text-[10px] px-2.5 py-1 rounded-lg border border-[#88A878]/30 flex items-center gap-1 transition-all shrink-0 ml-2"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {/* Calibrator actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyAllJson}
              className="flex-1 bg-[#88A878] hover:bg-[#789868] active:scale-95 text-[#1A231C] text-xs font-bold py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All 20 Pins</span>
            </button>
            <button
              type="button"
              onClick={handleResetPins}
              title="Reset all pins to defaults"
              className="bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 p-2 rounded-xl border border-stone-800 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── LEAFLET ARCHITECTURAL CANVAS ──────────────────────────────── */}
      <MapContainer
        key="kk-estate-map-container"
        crs={L.CRS.Simple}
        bounds={KK_BOUNDS}
        maxBounds={KK_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={-5}
        maxZoom={2.5}
        zoomSnap={0.1}
        zoomDelta={0.25}
        wheelPxPerZoomLevel={120}
        center={KK_CENTER}
        className="w-full h-full !bg-[#1A231C]"
        style={{
          backgroundColor: '#1A231C',
          cursor: isAdmin ? 'crosshair' : 'grab',
        }}
        attributionControl={false}
      >
        <KKMapAutoFit bounds={KK_BOUNDS} />
        <ImageOverlay url={mapImageUrl} bounds={KK_BOUNDS} />

        {/* Click and calibration listener */}
        <KKCalibrationHandler
          enabled={isAdmin}
          onMapClick={handleCalibrationClick}
        />

        {/* Pin Markers for All 20 Locations */}
        {filteredPins.map((pin) => {
          const isSelected = selectedPin?.id === pin.id;
          const isCalibrating = isAdmin && calibrationPinId === pin.id;

          return (
            <Marker
              key={pin.id}
              position={pin.coords}
              icon={createKKPinIcon(pin, isSelected, isCalibrating)}
              zIndexOffset={isSelected ? 1000 : isCalibrating ? 900 : 100}
              eventHandlers={{
                click: () => {
                  if (isAdmin) {
                    setCalibrationPinId(pin.id);
                  }
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
