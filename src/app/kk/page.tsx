'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Compass,
  Map as MapIcon,
  X,
  PhoneCall,
  Navigation,
  Clock,
  Sparkles,
  MapPin,
  Settings,
} from 'lucide-react';
import type { KKPin, KKTag } from './KKMapViewer';
import type { RegionalPin } from './KKCoastMap';
import KKAdminModal, { AdminPinRecord } from './KKAdminModal';

/* ═══════════════════════════════════════════════════════════════════════════════
   SSR-PROTECTED DYNAMIC IMPORTS
   ═══════════════════════════════════════════════════════════════════════════════ */

const KKMapViewer = dynamic(() => import('./KKMapViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A231C] text-[#88A878] space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[#88A878]/30 animate-ping" />
        <div className="w-12 h-12 rounded-full border-2 border-[#88A878] border-t-transparent animate-spin" />
      </div>
      <div className="flex flex-col items-center text-center px-4">
        <span className="font-serif tracking-widest text-sm uppercase text-[#F5F7F2]">
          Kahanda Kanda
        </span>
        <span className="text-[11px] text-[#A6C498] tracking-widest uppercase mt-1">
          Loading Estate Masterplan…
        </span>
      </div>
    </div>
  ),
});

const KKCoastMap = dynamic(() => import('./KKCoastMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A231C] text-[#88A878] space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[#88A878]/30 animate-ping" />
        <div className="w-12 h-12 rounded-full border-2 border-[#88A878] border-t-transparent animate-spin" />
      </div>
      <div className="flex flex-col items-center text-center px-4">
        <span className="font-serif tracking-widest text-sm uppercase text-[#F5F7F2]">
          Kahanda Kanda
        </span>
        <span className="text-[11px] text-[#A6C498] tracking-widest uppercase mt-1">
          Loading Regional Galle GPS Map…
        </span>
      </div>
    </div>
  ),
});

const CONCIERGE_WHATSAPP = '94770000000';

/* ═══════════════════════════════════════════════════════════════════════════════
   TAG & CATEGORY STYLES
   ═══════════════════════════════════════════════════════════════════════════════ */

const ESTATE_TAG_STYLES: Record<KKTag, { bg: string; border: string; text: string }> = {
  'Master Suite': { bg: 'rgba(136, 168, 120, 0.18)', border: '#88A878', text: '#D8E8D0' },
  'Pool Suite':   { bg: 'rgba(78, 135, 140, 0.20)', border: '#4E878C', text: '#B8E0E4' },
  'Private Pool': { bg: 'rgba(46, 111, 126, 0.22)', border: '#4E9EAE', text: '#C2EBF2' },
  'Tea Suite':    { bg: 'rgba(92, 124, 82, 0.20)',  border: '#88A878', text: '#D8E8D0' },
  'Dining':       { bg: 'rgba(194, 125, 80, 0.20)', border: '#C27D50', text: '#FAD8C0' },
  'Relax':        { bg: 'rgba(61, 123, 128, 0.22)', border: '#5C9FA4', text: '#C8EEF0' },
  'Wellness':     { bg: 'rgba(115, 142, 110, 0.20)',border: '#88A878', text: '#DBEADB' },
  'Cocktails':    { bg: 'rgba(192, 138, 62, 0.22)', border: '#D4A359', text: '#FCE6C2' },
  'Service':      { bg: 'rgba(139, 115, 85, 0.20)', border: '#8B7355', text: '#E5DACB' },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   20 ARCHITECTURAL LOCATIONS FOR ADMIN CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════════════ */

const DEFAULT_ADMIN_PINS: AdminPinRecord[] = [
  { num: 1, id: 'security-hut', title: 'Security Hut', tag: 'Service', coords: [1470, 5653] },
  { num: 2, id: 'villa-nelum', title: 'Nelum — Plantation Pool Villa', tag: 'Private Pool', coords: [2920, 7663] },
  { num: 3, id: 'villa-peacock', title: 'Peacock — Plantation Villa', tag: 'Tea Suite', coords: [3729, 8455] },
  { num: 4, id: 'villa-araliya', title: 'Araliya — Plantation Pool Villa', tag: 'Pool Suite', coords: [4007, 8876] },
  { num: 5, id: 'villa-tamarind', title: 'Tamarind — Plantation Villa', tag: 'Tea Suite', coords: [4362, 8161] },
  { num: 6, id: 'villa-mango', title: 'Mango — Plantation Villa', tag: 'Tea Suite', coords: [4595, 7507] },
  { num: 7, id: 'living-pavilion', title: 'The Living Pavilion', tag: 'Dining', coords: [4015, 7581] },
  { num: 8, id: 'dining-pavilion', title: 'The Dining Pavilion', tag: 'Dining', coords: [3496, 6866] },
  { num: 9, id: 'office-gym', title: 'Office & Gym', tag: 'Wellness', coords: [5563, 6740] },
  { num: 10, id: 'kitchen', title: 'The Estate Kitchen', tag: 'Dining', coords: [5093, 6584] },
  { num: 11, id: 'villa-kadju', title: 'Kadju — Plantation Luxury Pool Villa', tag: 'Pool Suite', coords: [5134, 7132] },
  { num: 12, id: 'suite-garden', title: 'Garden Suite', tag: 'Tea Suite', coords: [4840, 6102] },
  { num: 13, id: 'suite-tea', title: 'Tea Suite', tag: 'Tea Suite', coords: [4836, 5906] },
  { num: 14, id: 'yoga-pavilion', title: 'The Yoga Pavilion', tag: 'Wellness', coords: [3778, 5212] },
  { num: 15, id: 'spa', title: 'The KK Spa Sanctuary', tag: 'Wellness', coords: [3663, 4873] },
  { num: 16, id: 'villa-hibiscus', title: 'Hibiscus — Plantation Pool Villa', tag: 'Pool Suite', coords: [3402, 5870] },
  { num: 17, id: 'villa-hellaconia', title: 'Hellaconia — Plantation Pool Villa', tag: 'Pool Suite', coords: [4121, 3345] },
  { num: 18, id: 'villa-kumbuk', title: 'Kumbuk — Plantation Luxury Pool Villa', tag: 'Master Suite', coords: [3075, 2839] },
  { num: 19, id: 'villa-dubu', title: 'Dubu — Plantation Luxury Pool Villa', tag: 'Master Suite', coords: [3059, 2018] },
  { num: 20, id: 'laundry', title: 'Estate Laundry & Housekeeping', tag: 'Service', coords: [5795, 5955] },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   CURATED REGIONAL EXCURSIONS DATA
   ═══════════════════════════════════════════════════════════════════════════════ */

const REGIONAL_PINS_DATA: RegionalPin[] = [
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
   MAIN RESORT APP COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function KahandaKandaPage() {
  const [activeTab, setActiveTab] = useState<'map' | 'excursions'>('map');
  const [selectedEstatePin, setSelectedEstatePin] = useState<KKPin | null>(null);
  const [selectedRegionalPin, setSelectedRegionalPin] = useState<RegionalPin | null>(null);
  const [estateFilter, setEstateFilter] = useState<string>('All');
  const [regionalFilter, setRegionalFilter] = useState<string>('All');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminPins, setAdminPins] = useState<AdminPinRecord[]>(DEFAULT_ADMIN_PINS);
  const [drawerClosing, setDrawerClosing] = useState<boolean>(false);

  // Check URL query param ?admin=true on mount to open GM Admin Console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true') {
        setIsAdminModalOpen(true);
      }
    }
  }, []);

  // Keyboard shortcut 'E' toggles GM Admin Dashboard Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'e' || e.key === 'E') {
        setIsAdminModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth drawer close handlers
  const handleCloseEstateDrawer = () => {
    setDrawerClosing(true);
    setTimeout(() => {
      setSelectedEstatePin(null);
      setDrawerClosing(false);
    }, 220);
  };

  const handleCloseRegionalDrawer = () => {
    setDrawerClosing(true);
    setTimeout(() => {
      setSelectedRegionalPin(null);
      setDrawerClosing(false);
    }, 220);
  };

  const handleUpdatePinCoords = (num: number, coords: [number, number]) => {
    setAdminPins((prev) =>
      prev.map((p) => (p.num === num ? { ...p, coords } : p))
    );
  };

  const estateTagSpec = selectedEstatePin
    ? ESTATE_TAG_STYLES[selectedEstatePin.tag]
    : null;

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-[#1A231C] text-[#F5F7F2] overflow-hidden flex flex-col font-sans select-none">
      {/* ── PINNED HEADER ────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A231C]/92 backdrop-blur-md border-b border-[#88A878]/25 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand & Subtitle */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#88A878] animate-pulse" />
              <h1 className="font-serif tracking-[0.22em] text-sm sm:text-lg font-bold text-[#F5F7F2] uppercase">
                Kahanda Kanda
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs font-light tracking-[0.16em] text-[#A6C498] uppercase pl-4">
              Galle • Boutique Tea Estate
            </p>
          </div>

          {/* Dual Toggle Tabs: Estate Map | Excursions */}
          <div className="flex items-center bg-[#151D17] border border-[#88A878]/30 rounded-2xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveTab('map');
                setSelectedRegionalPin(null);
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-[#88A878] text-[#1A231C] font-bold shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Estate Map</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('excursions');
                setSelectedEstatePin(null);
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 cursor-pointer ${
                activeTab === 'excursions'
                  ? 'bg-[#88A878] text-[#1A231C] font-bold shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Excursions</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────── */}
      <main className="flex-1 w-full h-full pt-16 sm:pt-20 relative overflow-hidden">
        {/* VIEW 1: ESTATE MAP (MASTERPLAN) */}
        {activeTab === 'map' && (
          <div className="relative w-full h-full">
            {/* Category Filter Pills (floating below header) */}
            <div className="fixed top-18 sm:top-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 bg-[#1A231C]/85 backdrop-blur-md p-1 rounded-2xl border border-[#88A878]/30 shadow-xl overflow-x-auto max-w-[calc(100vw-24px)] no-scrollbar transition-all">
              {['All', 'Suites', 'Dining', 'Wellness', 'Services'].map((filter) => {
                const isActive = estateFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setEstateFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-[#88A878] text-[#1A231C] font-bold shadow-sm'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/40'
                    }`}
                  >
                    {filter === 'All' ? 'All 20 Grounds' : filter}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Leaflet Map Component with SSR Protection */}
            <KKMapViewer
              selectedPin={selectedEstatePin}
              onSelectPin={setSelectedEstatePin}
              isAdmin={false}
              activeFilter={estateFilter}
            />

            {/* Bottom Estate Guidance Hint (when drawer is closed) */}
            {!selectedEstatePin && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#1A231C]/90 backdrop-blur-md text-[#D8E8D0] px-4 py-1.5 rounded-full text-[11px] font-medium border border-[#88A878]/30 shadow-lg pointer-events-none flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#88A878] animate-pulse" />
                <span>Pinch to explore · Tap any pin for suite details</span>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: EXCURSIONS TAB (FULL INTERACTIVE REGIONAL GPS MAP) */}
        {activeTab === 'excursions' && (
          <div className="relative w-full h-full">
            {/* Regional Category Filter Pills floating top-center */}
            <div className="fixed top-18 sm:top-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 bg-[#1A231C]/85 backdrop-blur-md p-1 rounded-2xl border border-[#88A878]/30 shadow-xl overflow-x-auto max-w-[calc(100vw-24px)] no-scrollbar">
              {['All', 'Beach & Surf', 'Culture & Lake', 'Tea & Estate'].map((filter) => {
                const isActive = regionalFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setRegionalFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-[#88A878] text-[#1A231C] font-bold shadow-sm'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/40'
                    }`}
                  >
                    {filter === 'All' ? 'All Regional' : filter}
                  </button>
                );
              })}
            </div>

            {/* Live Interactive Leaflet GPS Map with Esri Dark Gray Tiles */}
            <KKCoastMap
              selectedPin={selectedRegionalPin}
              onSelectPin={setSelectedRegionalPin}
              activeCategory={regionalFilter}
            />

            {/* Horizontal Scrollable Pill Tray (visible when no pin is selected) */}
            {!selectedRegionalPin && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-24px)] sm:max-w-2xl bg-[#1A231C]/92 backdrop-blur-xl border border-[#88A878]/35 rounded-2xl p-2 shadow-2xl overflow-x-auto no-scrollbar flex items-center gap-2 pointer-events-auto">
                {REGIONAL_PINS_DATA.filter((p) => !p.isHomeBase).map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setSelectedRegionalPin(exp)}
                    className="apple-bounce shrink-0 flex items-center gap-2.5 bg-[#151D17]/85 hover:bg-[#253328] active:scale-95 text-[#F5F7F2] border border-[#88A878]/30 hover:border-[#88A878] px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                  >
                    <span className="text-base">{exp.emoji}</span>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-xs leading-none text-[#F5F7F2] whitespace-nowrap">
                        {exp.name}
                      </span>
                      <span className="text-[10px] text-[#A6C498] mt-1 whitespace-nowrap">
                        {exp.time} • {exp.distance}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── DISCREET GM PORTAL FLOATING BADGE (BOTTOM-RIGHT) ─────────── */}
      <button
        type="button"
        onClick={() => setIsAdminModalOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[500] flex items-center gap-2 bg-[#1A231C]/90 hover:bg-[#28372C] text-[#D8E8D0] hover:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#88A878]/40 shadow-2xl backdrop-blur-xl transition-all active:scale-95 cursor-pointer"
        title="Open GM Admin & Operations Console (Hotkey: E)"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>⚙️ GM Portal</span>
      </button>

      {/* ── SLEEK FROSTED GLASS BOTTOM DRAWER: ESTATE SUITE DETAILS ──── */}
      {selectedEstatePin && (
        <>
          <div
            className={`fixed inset-0 z-[1900] bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 ${
              drawerClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={handleCloseEstateDrawer}
          />
          <div
            className={`fixed bottom-0 left-0 right-0 z-[2000] max-h-[82vh] sm:max-h-[75vh] bg-[#1A231C]/95 backdrop-blur-xl border-t border-[#88A878]/40 rounded-t-3xl shadow-2xl p-5 sm:p-7 flex flex-col transition-all duration-200 ${
              drawerClosing ? 'translate-y-full' : 'translate-y-0 animate-in slide-in-from-bottom-5'
            }`}
          >
            <div
              className="w-12 h-1.5 rounded-full bg-[#88A878]/40 mx-auto mb-4 cursor-pointer hover:bg-[#88A878]/70 transition-colors"
              onClick={handleCloseEstateDrawer}
            />
            <div className="flex items-start justify-between gap-4 border-b border-[#88A878]/20 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                    style={{
                      background: estateTagSpec?.bg || 'rgba(136, 168, 120, 0.2)',
                      color: estateTagSpec?.text || '#D8E8D0',
                      border: `1px solid ${estateTagSpec?.border || '#88A878'}`,
                    }}
                  >
                    {selectedEstatePin.tag}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    #{selectedEstatePin.num}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F5F7F2] tracking-wide mt-1">
                  {selectedEstatePin.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseEstateDrawer}
                className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto space-y-4 py-4 pr-1">
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                {selectedEstatePin.desc}
              </p>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6C498]">
                  Suite &amp; Amenity Highlights
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedEstatePin.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-[#151D17]/80 border border-[#88A878]/25 rounded-xl px-3 py-2 text-[11px] text-stone-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#88A878] shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-[#88A878]/20">
              <a
                href={`https://wa.me/${CONCIERGE_WHATSAPP}?text=${encodeURIComponent(
                  `Hi Kahanda Kanda Concierge, I would like to request Buggy Service / Room Service for ${selectedEstatePin.title}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#88A878] to-[#789868] active:scale-[0.98] text-[#1A231C] text-xs sm:text-sm font-bold py-3.5 px-4 rounded-2xl shadow-xl hover:brightness-105 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request Buggy / Room Service</span>
              </a>
            </div>
          </div>
        </>
      )}

      {/* ── SLEEK FROSTED GLASS BOTTOM DRAWER: REGIONAL GPS PIN DETAILS ─ */}
      {selectedRegionalPin && (
        <>
          <div
            className={`fixed inset-0 z-[1900] bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 ${
              drawerClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={handleCloseRegionalDrawer}
          />
          <div
            className={`fixed bottom-0 left-0 right-0 z-[2000] max-h-[82vh] sm:max-h-[75vh] bg-[#1A231C]/95 backdrop-blur-xl border-t border-[#88A878]/40 rounded-t-3xl shadow-2xl p-5 sm:p-7 flex flex-col transition-all duration-200 ${
              drawerClosing ? 'translate-y-full' : 'translate-y-0 animate-in slide-in-from-bottom-5'
            }`}
          >
            <div
              className="w-12 h-1.5 rounded-full bg-[#88A878]/40 mx-auto mb-4 cursor-pointer hover:bg-[#88A878]/70 transition-colors"
              onClick={handleCloseRegionalDrawer}
            />
            <div className="flex items-start justify-between gap-4 border-b border-[#88A878]/20 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl">{selectedRegionalPin.emoji}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#88A878]/20 text-[#A6C498] border border-[#88A878]/40">
                    {selectedRegionalPin.category}
                  </span>
                  {selectedRegionalPin.token && (
                    <span className="font-mono text-[10px] text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded-md border border-stone-800">
                      Ref: {selectedRegionalPin.token}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F5F7F2] tracking-wide mt-1.5">
                  {selectedRegionalPin.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#88A878] font-medium mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedRegionalPin.time}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedRegionalPin.distance}</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseRegionalDrawer}
                className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="overflow-y-auto space-y-3 py-4 pr-1">
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                {selectedRegionalPin.desc}
              </p>
            </div>

            {/* TWO Distinct Action Buttons (Directions & Concierge WhatsApp) */}
            <div className="pt-3 border-t border-[#88A878]/20">
              {selectedRegionalPin.isHomeBase ? (
                <button
                  type="button"
                  onClick={() => {
                    handleCloseRegionalDrawer();
                    setActiveTab('map');
                  }}
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#88A878] to-[#789868] active:scale-[0.98] text-[#1A231C] text-xs sm:text-sm font-bold py-3.5 px-4 rounded-2xl shadow-xl hover:brightness-105 transition-all cursor-pointer"
                >
                  <MapIcon className="w-4 h-4" />
                  <span>Explore Estate Masterplan</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {/* "Directions" Button */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedRegionalPin.coords[0]},${selectedRegionalPin.coords[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold py-3.5 px-4 rounded-2xl border border-white/20 backdrop-blur-md active:scale-[0.98] transition-all cursor-pointer shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </a>

                  {/* "Book via Concierge WhatsApp" Button */}
                  <a
                    href={`https://wa.me/${CONCIERGE_WHATSAPP}?text=Hi%20Concierge,%20I%20am%20staying%20at%20Kahanda%20Kanda%20and%20would%20like%20to%20book%20${encodeURIComponent(
                      selectedRegionalPin.name
                    )}%20(Ref:%20${selectedRegionalPin.token})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#88A878] hover:bg-[#789868] text-[#1A231C] text-xs sm:text-sm font-bold py-3.5 px-5 rounded-2xl shadow-xl hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Book via Concierge WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── GM ADMIN & OPERATIONS DASHBOARD MODAL ────────────────────── */}
      <KKAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        pins={adminPins}
        onUpdatePinCoords={handleUpdatePinCoords}
        onResetPins={() => setAdminPins(DEFAULT_ADMIN_PINS)}
      />
    </div>
  );
}
