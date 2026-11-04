'use client';

import React from 'react';
import { Compass, MapPin } from 'lucide-react';

export default function MapSkeleton() {
  return (
    <div className="relative w-full h-[calc(100vh-125px)] sm:h-[calc(100vh-140px)] min-h-[500px] bg-[#EAE8E2] flex items-center justify-center overflow-hidden">
      {/* Subtle simulated map grid pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#706E6B 1px, transparent 1px), radial-gradient(#706E6B 1px, #EAE8E2 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Pulse rings */}
      <div className="absolute w-72 h-72 rounded-full border border-[#1E3A2B]/10 animate-ping pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full border border-[#1E3A2B]/5 pointer-events-none" />

      {/* Luxury Center Badge */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 bg-[#FAFAF8]/90 backdrop-blur-md rounded-2xl border border-[#E5E4E0] shadow-sm max-w-xs mx-4">
        <div className="w-12 h-12 rounded-full bg-[#1E3A2B] text-white flex items-center justify-center mb-3 shadow-sm animate-pulse">
          <Compass className="w-6 h-6 animate-spin [animation-duration:8s]" />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#706E6B] mb-1">
          Boutique Concierge
        </p>
        <h3 className="text-sm font-medium text-[#1A1A1A]">
          Loading Curated Coastal Map...
        </h3>
        <p className="text-xs text-[#706E6B] mt-1 font-light">
          Plotting handpicked South Coast sanctuaries
        </p>
      </div>

      {/* Simulated Pin Placeholders */}
      <div className="absolute top-1/4 left-1/3 flex items-center gap-2 animate-pulse opacity-60">
        <div className="w-8 h-8 rounded-full bg-[#1E3A2B]/20 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-[#1E3A2B]" />
        </div>
        <div className="h-3 w-20 bg-white/60 rounded-full" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 flex items-center gap-2 animate-pulse opacity-60 [animation-delay:400ms]">
        <div className="w-8 h-8 rounded-full bg-[#1E3A2B]/20 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-[#1E3A2B]" />
        </div>
        <div className="h-3 w-24 bg-white/60 rounded-full" />
      </div>
    </div>
  );
}
