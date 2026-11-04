'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useConcierge } from '@/context/ConciergeContext';
import {
  MapPin,
  Quote,
  MessageCircle,
  Navigation,
  Sparkles,
  Star,
  ExternalLink,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export default function ListView() {
  const { filteredSpots, setSelectedSpot, bookViaWhatsApp, getDirectionsUrl, setCategoryFilter, property } =
    useConcierge();

  if (filteredSpots.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EAE8E2] text-[#706E6B] flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-serif font-medium text-[#1A1A1A]">No sanctuaries found in this category</h3>
        <p className="text-sm text-[#706E6B] mt-1 max-w-sm mx-auto">
          Try selecting another category to explore handpicked dining, surf breaks, and wellness sanctuaries.
        </p>
        <button
          type="button"
          onClick={() => setCategoryFilter('All')}
          className="mt-5 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#1E3A2B] text-white hover:bg-[#14291e] transition-colors"
        >
          View All Curated Spots
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E5E4E0]">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#706E6B]">
            Editorial Compendium · {property.name}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A1A1A] mt-1">
            Curated Local Discoveries
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#706E6B] mt-2 sm:mt-0 font-light max-w-sm">
          Exclusively vetted recommendations by hotel management for an authentic Sri Lankan coastal stay.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredSpots.map((spot) => (
          <article
            key={spot.id}
            className="group bg-white rounded-2xl border border-[#E5E4E0] overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-all duration-300"
          >
            {/* Card Image Banner */}
            <div
              className="relative w-full aspect-16/10 bg-[#EAE8E2] overflow-hidden cursor-pointer"
              onClick={() => setSelectedSpot(spot)}
            >
              <Image
                src={spot.image}
                alt={spot.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Category & Curator Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/95 text-[#1A1A1A] backdrop-blur-md shadow-xs">
                  {spot.category}
                </span>

                {spot.rating && (
                  <div className="flex items-center gap-1 text-[11px] font-medium text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-[#C5A880] text-[#C5A880]" />
                    <span>{spot.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {spot.curatorBadge && (
                <div className="absolute bottom-3 left-3">
                  <span className="flex items-center gap-1 text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-[#C5A880] text-white shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" />
                    {spot.curatorBadge}
                  </span>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Meta location & price */}
                <div className="flex items-center justify-between text-xs text-[#706E6B] mb-1.5">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1E3A2B]" />
                    <span>{spot.location}</span>
                  </div>
                  {spot.priceRange && (
                    <span className="font-serif tracking-widest text-[#1A1A1A] font-medium">
                      {spot.priceRange}
                    </span>
                  )}
                </div>

                {/* Spot Name */}
                <h3
                  onClick={() => setSelectedSpot(spot)}
                  className="text-lg font-serif font-semibold text-[#1A1A1A] hover:text-[#1E3A2B] transition-colors cursor-pointer"
                >
                  {spot.name}
                </h3>

                {/* Staff Insider Tip */}
                <div className="mt-3.5 bg-[#F7F6F2] rounded-xl p-3.5 border border-[#EBEAE5]">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1E3A2B] mb-1">
                    <Quote className="w-3 h-3 shrink-0" />
                    <span>Staff Insider Tip</span>
                  </div>
                  <p className="text-xs text-[#2D2926] leading-relaxed italic line-clamp-3">
                    &ldquo;{spot.tip}&rdquo;
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-5 pt-4 border-t border-[#F0EFEA] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => bookViaWhatsApp(spot)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#1E3A2B] text-white hover:bg-[#14291e] active:scale-[0.98] text-xs font-medium tracking-wide shadow-xs transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Book via WhatsApp</span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </button>

                <a
                  href={getDirectionsUrl(spot)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2.5 rounded-full border border-[#E5E4E0] bg-white text-[#1A1A1A] hover:bg-[#F5F4F0] active:scale-[0.98] transition-colors"
                  title="Open in Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#706E6B]" />
                </a>
              </div>

            </div>
          </article>
        ))}
      </div>

      {/* Subtle Muted Manager Link in Footer */}
      <footer className="mt-16 pt-8 border-t border-[#E5E4E0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#706E6B] gap-4">
        <div>
          <span>{property.name} · Curated In-Room Experience Concierge</span>
        </div>
        <div>
          <Link
            href={`/admin?hotel=${property.slug || property.id}`}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#A09E9B] hover:text-[#1A1A1A] tracking-wider uppercase transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Manager Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
