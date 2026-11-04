'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useConcierge } from '@/context/ConciergeContext';
import {
  X,
  MapPin,
  Quote,
  MessageCircle,
  Navigation,
  Clock,
  Sparkles,
  Star,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function BottomSheet() {
  const { selectedSpot, setSelectedSpot, bookViaWhatsApp, getDirectionsUrl, property } =
    useConcierge();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSelectedSpot(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedSpot]);

  if (!selectedSpot) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:bg-black/20 transition-opacity animate-in fade-in"
        onClick={() => setSelectedSpot(null)}
      />

      {/* Sheet Container: Drawer on Mobile, Centered/Floating Modal on Desktop */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="spot-title"
        className="fixed z-50 bottom-0 left-0 right-0 max-h-[92vh] sm:max-h-[85vh] md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl bg-[#FAFAF8] rounded-t-3xl md:rounded-2xl shadow-2xl border border-[#E5E4E0] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#D1CFCA]" />
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 overscroll-contain">
          
          {/* Header Image with Badges */}
          <div className="relative w-full aspect-video sm:aspect-21/9 bg-[#EAE8E2] overflow-hidden">
            <Image
              src={selectedSpot.image}
              alt={selectedSpot.name}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              priority
            />
            {/* Subtle luxury vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedSpot(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors z-10"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges on Image */}
            <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/95 text-[#1A1A1A] backdrop-blur-md shadow-xs">
                  {selectedSpot.category}
                </span>
                {selectedSpot.curatorBadge && (
                  <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium tracking-wide px-2.5 py-1 rounded-full bg-[#C5A880]/90 text-white backdrop-blur-md">
                    <Sparkles className="w-3 h-3" />
                    {selectedSpot.curatorBadge}
                  </span>
                )}
              </div>

              {selectedSpot.rating && (
                <div className="flex items-center gap-1 text-xs font-medium text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-[#C5A880] text-[#C5A880]" />
                  <span>{selectedSpot.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Body */}
          <div className="p-4 sm:p-6 space-y-4">
            
            {/* Title & Location */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#706E6B] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1E3A2B]" />
                  <span>
                    {selectedSpot.isResortSpot
                      ? `${selectedSpot.location} • Cape Weligama Resort`
                      : `${selectedSpot.location} — South Coast, Sri Lanka`}
                  </span>
                  {selectedSpot.priceRange && (
                    <>
                      <span>•</span>
                      <span className="font-serif tracking-wider text-[#1A1A1A]">{selectedSpot.priceRange}</span>
                    </>
                  )}
                </div>
                <h2 id="spot-title" className="text-xl sm:text-2xl font-serif font-semibold text-[#1A1A1A] tracking-tight">
                  {selectedSpot.name}
                </h2>
              </div>
            </div>

            {/* Staff Insider Tip Callout Box */}
            <div className="relative bg-[#F4F3EE] rounded-xl p-4 sm:p-4.5 border border-[#E5E4E0] shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-[#1E3A2B]/10 flex items-center justify-center text-[#1E3A2B]">
                  <Quote className="w-3 h-3" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1E3A2B]">
                  Staff Insider Tip
                </span>
                <span className="text-[10px] text-[#706E6B] ml-auto">
                  from Cape Weligama Concierge
                </span>
              </div>
              <p className="text-sm font-normal text-[#2D2926] leading-relaxed italic">
                &ldquo;{selectedSpot.tip}&rdquo;
              </p>
            </div>

            {/* Description & Operating Hours */}
            {selectedSpot.description && (
              <p className="text-xs sm:text-sm text-[#706E6B] leading-relaxed">
                {selectedSpot.description}
              </p>
            )}

            {selectedSpot.openingHours && (
              <div className="flex items-center gap-2 text-xs text-[#706E6B] pt-1">
                <Clock className="w-3.5 h-3.5 text-[#706E6B]" />
                <span>Hours: {selectedSpot.openingHours}</span>
              </div>
            )}

            {/* Referral VIP Notification */}
            <div className="bg-[#1E3A2B]/5 rounded-lg px-3 py-2 border border-[#1E3A2B]/15 text-[11px] text-[#1E3A2B] flex items-center justify-between">
              <span className="font-medium">
                {selectedSpot.isResortSpot
                  ? `Direct In-Resort Privileges & Dispatch for ${property.name} guests.`
                  : `In-Room Privileges: Direct concierge reservation for ${property.name} guests.`}
              </span>
              <span className="font-mono text-[10px] text-[#706E6B]">Ref: {property.vipRef || 'VIP-CONCIERGE'}</span>
            </div>

          </div>

        </div>

        {/* High-Contrast Bottom CTA Action Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E5E4E0] shadow-md flex flex-col gap-3">
          
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            {/* Primary CTA: Book via WhatsApp or Custom Resort Action */}
            <button
              type="button"
              onClick={() => bookViaWhatsApp(selectedSpot)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1E3A2B] text-white hover:bg-[#14291e] active:scale-[0.99] font-medium text-xs sm:text-sm tracking-wide shadow-sm transition-all duration-150"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{selectedSpot.actionLabel || 'Book via WhatsApp'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
            </button>

            {/* Secondary CTA: Directions via Google Maps (or Close for resort spots) */}
            {!selectedSpot.isResortSpot ? (
              <a
                href={getDirectionsUrl(selectedSpot)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex sm:flex-none items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#E5E4E0] bg-[#FAFAF8] text-[#1A1A1A] hover:bg-[#F0EFEA] hover:border-[#D1CFCA] active:scale-[0.99] font-medium text-xs sm:text-sm tracking-wide transition-all duration-150"
              >
                <Navigation className="w-4 h-4 text-[#706E6B]" />
                <span>Directions</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="flex sm:flex-none items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#E5E4E0] bg-[#FAFAF8] text-[#1A1A1A] hover:bg-[#F0EFEA] hover:border-[#D1CFCA] active:scale-[0.99] font-medium text-xs sm:text-sm tracking-wide transition-all duration-150"
              >
                <span>Close</span>
              </button>
            )}
          </div>

          {/* Subtle Muted Manager Link */}
          <div className="text-center pt-1">
            <Link
              href={`/admin?hotel=${property.slug || property.id}`}
              className="inline-flex items-center gap-1.5 text-[10px] text-[#A09E9B] hover:text-[#1A1A1A] tracking-widest uppercase transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-[#A09E9B]" />
              <span>Manager Portal</span>
            </Link>
          </div>

        </div>

      </div>
    </>
  );
}
