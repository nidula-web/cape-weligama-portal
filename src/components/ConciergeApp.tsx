'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useConcierge } from '@/context/ConciergeContext';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import ListView from '@/components/ListView';
import BottomSheet from '@/components/BottomSheet';
import ViewSwitcher from '@/components/ViewSwitcher';

// Dynamically import Leaflet ConciergeMap with SSR disabled
const ConciergeMap = dynamic(() => import('@/components/ConciergeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-[#FAFAF8] text-[#706E6B] text-sm tracking-wider uppercase">
      Loading Concierge Map...
    </div>
  ),
});

export default function ConciergeApp() {
  const { viewMode } = useConcierge();

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] flex flex-col relative selection:bg-[#1E3A2B]/15">
      {/* Top Navbar */}
      <Navbar />

      {/* Category Pills Bar */}
      <CategoryFilter />

      {/* Main View Area */}
      <main className="flex-1 relative">
        {viewMode === 'map' ? (
          <div className="w-full h-full relative">
            <ConciergeMap />
          </div>
        ) : (
          <ListView />
        )}
      </main>

      {/* Selected Spot Bottom Sheet / Drawer */}
      <BottomSheet />

      {/* Floating Bottom View Switcher */}
      <ViewSwitcher />
    </div>
  );
}
