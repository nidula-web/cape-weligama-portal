'use client';

import React, { useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useConcierge } from '@/context/ConciergeContext';
import { Spot, Category, Property } from '@/types';
import { findPropertyByParam } from '@/data/seedData';
import {
  ArrowLeft,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Search,
  RotateCcw,
  Sparkles,
  X,
  MapPin,
  Hotel,
  QrCode,
  Copy,
  Check,
  Printer,
} from 'lucide-react';

const CATEGORIES: ('All' | 'Surf & Breaks' | 'Cafes & Dining' | 'Wellness & Yoga' | 'Secret Spots')[] = [
  'All',
  'Surf & Breaks',
  'Cafes & Dining',
  'Wellness & Yoga',
  'Secret Spots',
];

const LOCATION_PRESETS: { label: string; lat: number; lng: number }[] = [
  { label: 'Ahangama Coast', lat: 5.975, lng: 80.365 },
  { label: 'Weligama Bay', lat: 5.971, lng: 80.428 },
  { label: 'Galle Fort', lat: 6.026, lng: 80.217 },
  { label: 'Madiha Beach', lat: 5.934, lng: 80.518 },
  { label: 'Hiriketiya / Dikwella', lat: 5.962, lng: 80.661 },
];

const IMAGE_PRESETS = [
  {
    label: 'Coastal Cafe & Terrace',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Surf & Golden Sands',
    url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Tropical Yoga Shala',
    url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Historic Colonial Courtyard',
    url: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
  },
];

// Inner component reading useSearchParams safely inside Suspense
function AdminContent() {
  const searchParams = useSearchParams();
  const {
    property,
    setProperty,
    properties,
    spots,
    addSpot,
    toggleSpotStatus,
    deleteSpot,
    resetToDefaults,
    bookViaWhatsApp,
    getHotelStats,
  } = useConcierge();

  // Active property being managed in Admin
  const hotelParam = searchParams.get('hotel');
  const initialHotel = useMemo(() => (hotelParam ? findPropertyByParam(hotelParam) : null), [hotelParam]);

  const [selectedHotelId, setSelectedHotelId] = useState<string>(
    () => (initialHotel ? initialHotel.id : property.id)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active hotel object
  const activeManagingHotel: Property = useMemo(() => {
    return properties.find((p) => p.id === selectedHotelId) || properties[0];
  }, [properties, selectedHotelId]);

  // Analytics for the selected hotel
  const hotelStats = useMemo(() => {
    return getHotelStats(selectedHotelId);
  }, [getHotelStats, selectedHotelId]);

  // In-room guest URL for QR code
  const guestUrl = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${base}/?hotel=${activeManagingHotel.slug || activeManagingHotel.id}`;
  }, [activeManagingHotel]);

  // Form state for adding spot
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cafes & Dining' as Spot['category'],
    location: 'Ahangama',
    lat: '5.9750',
    lng: '80.3650',
    tip: '',
    image: IMAGE_PRESETS[0].url,
    whatsapp: '94771234567',
    priceRange: '$$$' as Spot['priceRange'],
    curatorBadge: "Manager's Selection",
    description: '',
  });

  const filteredSpots = spots.filter((spot) => {
    const matchesSearch =
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || spot.category === selectedCategory;
    const matchesHotel = !spot.propertyId || spot.propertyId === selectedHotelId;
    return matchesSearch && matchesCat && matchesHotel;
  });

  const handlePresetLocation = (preset: (typeof LOCATION_PRESETS)[0]) => {
    setFormData((prev) => ({
      ...prev,
      lat: preset.lat.toString(),
      lng: preset.lng.toString(),
      location: preset.label.split(' ')[0],
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tip || !formData.whatsapp) return;

    addSpot({
      name: formData.name,
      category: formData.category,
      location: formData.location,
      lat: parseFloat(formData.lat) || 5.975,
      lng: parseFloat(formData.lng) || 80.365,
      tip: formData.tip,
      image: formData.image,
      whatsapp: formData.whatsapp,
      priceRange: formData.priceRange,
      curatorBadge: formData.curatorBadge,
      status: 'active',
      rating: 4.9,
      description: formData.description || 'Staff curated recommendation for hotel guests.',
      propertyId: selectedHotelId,
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      category: 'Cafes & Dining',
      location: 'Ahangama',
      lat: '5.9750',
      lng: '80.3650',
      tip: '',
      image: IMAGE_PRESETS[0].url,
      whatsapp: '94771234567',
      priceRange: '$$$',
      curatorBadge: "Manager's Selection",
      description: '',
    });
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(guestUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrintTentCard = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] pb-24">
      
      {/* Top Admin Header */}
      <header className="bg-white border-b border-[#E5E4E0] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            <div className="flex items-center gap-3">
              <Link
                href={activeManagingHotel ? `/?hotel=${activeManagingHotel.slug}` : '/'}
                className="w-9 h-9 rounded-full border border-[#E5E4E0] bg-[#FAFAF8] hover:bg-[#F0EFEA] flex items-center justify-center text-[#1A1A1A] transition-colors"
                title="Return to In-Room Guest Concierge"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#706E6B]">
                    Back-Office Operations
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#1E3A2B]" />
                  <span className="text-[10px] font-medium text-[#1E3A2B] bg-[#1E3A2B]/10 px-2 py-0.5 rounded-full">
                    {activeManagingHotel.name}
                  </span>
                </div>
                <h1 className="text-base sm:text-xl font-serif font-semibold text-[#1A1A1A]">
                  Hotel Manager Portal & Analytics
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">

              {/* Resort Pin Editor Button */}
              <Link
                href="/?admin=true&domain=resort"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 active:scale-[0.98] text-amber-950 text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
                title="Open Interactive Resort Masterplan Pin Editor"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Resort Pin Editor</span>
                <span className="sm:hidden">Pins</span>
              </Link>
              
              {/* Generate QR Code Button */}
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E5E4E0] bg-white text-[#1A1A1A] hover:bg-[#F5F4F0] active:scale-[0.98] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
                title="Preview In-Room QR Code Tent Card"
              >
                <QrCode className="w-4 h-4 text-[#1E3A2B]" />
                <span className="hidden sm:inline">In-Room QR Code</span>
                <span className="sm:hidden">QR</span>
              </button>

              {/* Add Spot Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E3A2B] text-white hover:bg-[#14291e] active:scale-[0.98] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Spot</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Hotel Selector Tabs */}
      <div className="bg-[#F4F3EE] border-b border-[#E5E4E0] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Hotel className="w-4 h-4 text-[#1E3A2B]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#706E6B]">
                Active Property:
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {properties.map((p) => {
                const isSelected = p.id === selectedHotelId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedHotelId(p.id);
                      setProperty(p);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#1E3A2B] text-white border-[#1E3A2B] shadow-xs'
                        : 'bg-white text-[#706E6B] border-[#E5E4E0] hover:text-[#1A1A1A] hover:bg-[#FAFAF8]'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] ml-1.5 opacity-80">({p.location})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* KPI Metrics Grid for Selected Hotel */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Metric 1: Curated Spots Active */}
          <div className="bg-white rounded-2xl border border-[#E5E4E0] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#706E6B] mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">
                Curated Spots Active
              </span>
              <div className="w-8 h-8 rounded-full bg-[#1E3A2B]/10 flex items-center justify-center text-[#1E3A2B]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-serif font-semibold text-[#1A1A1A]">
                {hotelStats.activeSpotsCount}
              </div>
              <p className="text-xs text-[#706E6B] mt-1">
                Published to guests of {activeManagingHotel.name}
              </p>
            </div>
          </div>

          {/* Metric 2: Referral Clicks Tracked */}
          <div className="bg-white rounded-2xl border border-[#E5E4E0] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#706E6B] mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">
                Referral Clicks Tracked
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-serif font-semibold text-[#1A1A1A]">
                {hotelStats.totalInquiries}
              </div>
              <p className="text-xs text-[#706E6B] mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp inquiries with {activeManagingHotel.vipRef}</span>
              </p>
            </div>
          </div>

          {/* Metric 3: Estimated Commissions */}
          <div className="bg-white rounded-2xl border border-[#E5E4E0] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#706E6B] mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">
                Estimated Commissions
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-serif font-semibold text-emerald-900">
                ${hotelStats.estimatedCommission.toFixed(2)}
              </div>
              <p className="text-xs text-[#706E6B] mt-1">
                Simulated 10% commission on guest reservations
              </p>
            </div>
          </div>

          {/* Metric 4: Top Performing Partner */}
          <div className="bg-white rounded-2xl border border-[#E5E4E0] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#706E6B] mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">
                Top Converting Partner
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl font-serif font-semibold text-[#1A1A1A] truncate" title={hotelStats.topSpot?.name}>
                {hotelStats.topSpot?.name || 'N/A'}
              </div>
              <p className="text-xs text-[#706E6B] mt-1">
                Highest guest demand for {activeManagingHotel.name}
              </p>
            </div>
          </div>

        </section>

        {/* Resort Masterplan Pin Placement & Calibration Section */}
        <section className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white rounded-2xl border border-stone-800 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-amber-400">
                Masterplan Calibration
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-white">
              Resort Grounds Pin Editor (18 Numbered Pavilions)
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Place, drag, or recalibrate all 18 numbered pins on the Cape Weligama masterplan illustration (Reception, Spa, Moon Pool, Cape Club, Beach Access, Lookouts, and Villas). Click anywhere on the map to place pins with pixel precision and export configuration JSON.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/?admin=true&domain=resort"
              className="apple-bounce flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs tracking-wide shadow-lg transition-all active:scale-95"
            >
              <MapPin className="w-4 h-4 text-stone-950" />
              <span>Launch Pin Editor</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Link>
          </div>
        </section>

        {/* Spots Management Table Section */}
        <section className="bg-white rounded-2xl border border-[#E5E4E0] shadow-xs overflow-hidden">
          
          {/* Table Toolbar */}
          <div className="p-4 sm:p-6 border-b border-[#E5E4E0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#706E6B]" />
                <input
                  type="text"
                  placeholder="Search spots by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-[#E5E4E0] bg-[#FAFAF8] focus:outline-hidden focus:border-[#1E3A2B] text-[#1A1A1A]"
                />
              </div>

              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as 'All' | Category)}
                className="text-xs px-3 py-2 rounded-full border border-[#E5E4E0] bg-[#FAFAF8] text-[#1A1A1A] focus:outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={resetToDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#706E6B] hover:text-[#1A1A1A] hover:bg-[#F5F4F0] rounded-full transition-colors border border-transparent hover:border-[#E5E4E0]"
                title="Reset spots to initial verified South Coast seed list"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Seed Data</span>
              </button>
            </div>

          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] text-[#706E6B] uppercase tracking-wider font-semibold border-b border-[#E5E4E0]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Curated Spot</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Vendor WhatsApp</th>
                  <th className="py-3 px-4 text-center">Referrals</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E0]">
                {filteredSpots.map((spot) => (
                  <tr key={spot.id} className="hover:bg-[#FAFAF8]/80 transition-colors">
                    
                    {/* Name & Category */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#EAE8E2]">
                          <Image
                            src={spot.image}
                            alt={spot.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#1A1A1A] flex items-center gap-1.5">
                            <span>{spot.name}</span>
                            {spot.curatorBadge && (
                              <span className="text-[9px] bg-[#C5A880]/15 text-[#8C6D3B] px-1.5 py-0.2 rounded-full font-medium">
                                {spot.curatorBadge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#706E6B]">{spot.category}</div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-[#706E6B]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#1E3A2B]" />
                        <span>{spot.location}</span>
                      </div>
                      <div className="text-[10px] text-[#A09E9B] font-mono">
                        {spot.lat.toFixed(3)}, {spot.lng.toFixed(3)}
                      </div>
                    </td>

                    {/* WhatsApp */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#1A1A1A]">
                      +{spot.whatsapp}
                    </td>

                    {/* Inquiries */}
                    <td className="py-3.5 px-4 text-center font-semibold text-[#1A1A1A]">
                      {spot.inquiriesCount || 0}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSpotStatus(spot.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                          spot.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            spot.status === 'active' ? 'bg-emerald-600' : 'bg-stone-400'
                          }`}
                        />
                        <span className="capitalize">{spot.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => bookViaWhatsApp(spot)}
                          title="Simulate WhatsApp Referral"
                          className="p-1.5 text-[#706E6B] hover:text-[#1E3A2B] hover:bg-[#F5F4F0] rounded-md transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSpot(spot.id)}
                          title="Delete Spot"
                          className="p-1.5 text-[#706E6B] hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-[#FAFAF8] border-t border-[#E5E4E0] text-xs text-[#706E6B] flex items-center justify-between">
            <span>Showing {filteredSpots.length} curated hotspots for {activeManagingHotel.name}</span>
            <span className="italic font-serif">Referral codes tagged with {activeManagingHotel.vipRef}</span>
          </div>

        </section>

      </main>

      {/* In-Room QR Code Generator & Preview Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E5E4E0] shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E4E0] mb-6">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#706E6B]">
                  In-Room Hospitality Asset
                </span>
                <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">
                  In-Room QR Code Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAFAF8] hover:bg-[#F0EFEA] flex items-center justify-center text-[#706E6B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Luxury Wooden / Linen Tent Card Mockup */}
            <div className="bg-[#FAF8F5] border-2 border-[#E5E2DA] rounded-2xl p-6 text-center shadow-inner relative overflow-hidden mb-6">
              
              {/* Hotel Crest & Name */}
              <div className="mb-3">
                <span className="text-[9px] font-serif tracking-[0.3em] uppercase text-[#8C6D3B] block">
                  Boutique Concierge Compendium
                </span>
                <h4 className="text-xl font-serif font-bold tracking-tight text-[#1A1A1A] mt-1">
                  {activeManagingHotel.name}
                </h4>
                <p className="text-[11px] text-[#706E6B] font-light italic">
                  {activeManagingHotel.location}, South Coast Sri Lanka
                </p>
              </div>

              {/* Scannable High-Res QR Code Image */}
              <div className="inline-block p-3.5 bg-white rounded-2xl border border-[#E5E4E0] shadow-sm my-2">
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                      guestUrl
                    )}&color=1E3A2B&bgcolor=FFFFFF`}
                    alt={`In-Room QR Code for ${activeManagingHotel.name}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>

              {/* In-Room Guest Instructions */}
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-[#1A1A1A]">
                  Scan with your phone camera
                </p>
                <p className="text-[11px] text-[#706E6B] leading-relaxed max-w-xs mx-auto">
                  Instant access to our handpicked dining tables, surf breaks & direct WhatsApp bookings.
                </p>
              </div>

              {/* VIP Ref Tag */}
              <div className="mt-4 pt-3 border-t border-[#EBE8E0] text-[10px] text-[#8C6D3B] font-mono">
                Locked Ref: {activeManagingHotel.vipRef}
              </div>

            </div>

            {/* URL Display with Copy Button */}
            <div className="bg-[#FAFAF8] rounded-xl border border-[#E5E4E0] p-2.5 flex items-center justify-between gap-2 mb-5">
              <span className="text-xs text-[#706E6B] font-mono truncate pl-1">
                {guestUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#E5E4E0] text-xs font-medium text-[#1A1A1A] hover:bg-[#F5F4F0] shrink-0 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3">
              <a
                href={guestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-[#E5E4E0] bg-white text-[#1A1A1A] hover:bg-[#F5F4F0] text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Guest View</span>
              </a>

              <button
                type="button"
                onClick={handlePrintTentCard}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#1E3A2B] text-white hover:bg-[#14291e] text-xs font-medium shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Tent Card</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Spot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E5E4E0] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E4E0] mb-5">
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">
                  Add Curated Hotspot for {activeManagingHotel.name}
                </h3>
                <p className="text-xs text-[#706E6B]">
                  Recommend a local vendor for in-room guest discovery
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAFAF8] hover:bg-[#F0EFEA] flex items-center justify-center text-[#706E6B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Spot Name */}
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Spot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ceylon Sliders Rooftop"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] bg-[#FAFAF8] focus:border-[#1E3A2B] focus:outline-hidden"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1A1A1A] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Spot['category'] })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] bg-[#FAFAF8] focus:border-[#1E3A2B] focus:outline-hidden"
                  >
                    <option value="Surf & Breaks">Surf & Breaks</option>
                    <option value="Cafes & Dining">Cafes & Dining</option>
                    <option value="Wellness & Yoga">Wellness & Yoga</option>
                    <option value="Secret Spots">Secret Spots</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#1A1A1A] mb-1">Price Range</label>
                  <select
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as Spot['priceRange'] })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] bg-[#FAFAF8] focus:border-[#1E3A2B] focus:outline-hidden"
                  >
                    <option value="$$">$$ (Moderate)</option>
                    <option value="$$$">$$$ (Upscale)</option>
                    <option value="$$$$">$$$$ (Fine Living)</option>
                  </select>
                </div>
              </div>

              {/* Location & Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-[#1A1A1A]">Location Area</label>
                  <span className="text-[10px] text-[#706E6B]">Presets:</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {LOCATION_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => handlePresetLocation(preset)}
                      className="px-2 py-0.5 rounded-md bg-[#FAFAF8] hover:bg-[#1E3A2B]/10 hover:text-[#1E3A2B] border border-[#E5E4E0] text-[10px] text-[#706E6B] transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahangama"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] bg-[#FAFAF8] focus:border-[#1E3A2B] focus:outline-hidden"
                />
              </div>

              {/* Lat & Lng */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1A1A1A] mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] bg-[#FAFAF8] focus:border-[#1E3A2B] focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#1A1A1A] mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] bg-[#FAFAF8] focus:border-[#1E3A2B] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Vendor WhatsApp Number */}
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">
                  Vendor WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  required
                  placeholder="94771234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] bg-[#FAFAF8] focus:border-[#1E3A2B] focus:outline-hidden font-mono"
                />
                <p className="text-[10px] text-[#706E6B] mt-1">
                  Bookings will be forwarded directly to this WhatsApp with your hotel referral code: {activeManagingHotel.vipRef}.
                </p>
              </div>

              {/* Staff Insider Tip */}
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">Staff Insider Tip</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Manager's secret recommendation (e.g. Best sunset view on table 4, ask for the passionfruit tart)..."
                  value={formData.tip}
                  onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] bg-[#FAFAF8] focus:border-[#1E3A2B] focus:outline-hidden"
                />
              </div>

              {/* Image URL with presets */}
              <div>
                <label className="block font-medium text-[#1A1A1A] mb-1">High-Res Image URL</label>
                <div className="flex gap-1 overflow-x-auto pb-2 mb-1">
                  {IMAGE_PRESETS.map((p, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, image: p.url })}
                      className="px-2 py-1 rounded border border-[#E5E4E0] text-[10px] whitespace-nowrap bg-[#FAFAF8] hover:bg-[#1E3A2B]/10 hover:text-[#1E3A2B]"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] bg-[#FAFAF8] focus:border-[#1E3A2B] focus:outline-hidden font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E5E4E0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E5E4E0] text-[#706E6B] hover:bg-[#FAFAF8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1E3A2B] text-white hover:bg-[#14291e] font-medium"
                >
                  Save & Publish Hotspot
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center text-[#706E6B] text-xs uppercase tracking-widest">
          Loading Manager Portal...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
