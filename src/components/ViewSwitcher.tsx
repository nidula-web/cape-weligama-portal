'use client';

import React from 'react';
import { useConcierge } from '@/context/ConciergeContext';
import { Map, LayoutList } from 'lucide-react';

export default function ViewSwitcher() {
  const { viewMode, setViewMode } = useConcierge();

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="flex items-center bg-[#1A1A1A]/90 text-white backdrop-blur-md rounded-full p-1 shadow-2xl border border-white/15">
        <button
          type="button"
          onClick={() => setViewMode('map')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 active:scale-95 ${
            viewMode === 'map'
              ? 'bg-[#FAFAF8] text-[#1A1A1A] shadow-sm font-semibold'
              : 'text-[#D1CFCA] hover:text-white'
          }`}
          aria-label="Switch to Map View"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Map View</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 active:scale-95 ${
            viewMode === 'list'
              ? 'bg-[#FAFAF8] text-[#1A1A1A] shadow-sm font-semibold'
              : 'text-[#D1CFCA] hover:text-white'
          }`}
          aria-label="Switch to List View"
        >
          <LayoutList className="w-3.5 h-3.5" />
          <span>List View</span>
        </button>
      </div>
    </div>
  );
}
