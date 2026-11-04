'use client';

import React from 'react';
import Link from 'next/link';
import { useConcierge } from '@/context/ConciergeContext';
import { ShieldCheck, Waves } from 'lucide-react';

export default function Navbar() {
  const { isLockedGuestMode } = useConcierge();

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-stone-200 transition-colors pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 sm:h-16">

          {/* Left: Brand Identity — fixed Cape Weligama */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-stone-900 text-[#FAFAF8] flex items-center justify-center shadow-sm shrink-0">
              <Waves className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-serif font-semibold tracking-tight text-stone-900 leading-tight truncate">
                CAPE WELIGAMA
              </h1>
              <p className="text-[8.5px] sm:text-[10px] font-medium tracking-[0.14em] sm:tracking-[0.18em] uppercase text-stone-400 leading-tight truncate">
                Relais &amp; Châteaux — Curated Guest Experience
              </p>
            </div>
          </div>

          {/* Right: Mode indicator + GM link */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {isLockedGuestMode ? (
              /* In-Room Guest Mode pill */
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-medium rounded-full bg-stone-900/8 text-stone-700 border border-stone-200 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden xs:inline">In-Room</span> Concierge
              </span>
            ) : (
              /* GM Admin link (only visible in demo / unlocked mode) */
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-xs tracking-wide"
              >
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">GM Portal</span>
                <span className="sm:hidden">GM</span>
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
