'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useConcierge } from '@/context/ConciergeContext';
import CategoryFilter from '@/components/CategoryFilter';
import ListView from '@/components/ListView';
import BottomSheet from '@/components/BottomSheet';
import ViewSwitcher from '@/components/ViewSwitcher';
import { Waves, ShieldCheck } from 'lucide-react';

const ConciergeMap = dynamic(() => import('@/components/ConciergeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F5F3EC] text-stone-400 text-xs tracking-widest uppercase">
      Loading Coastal Guide…
    </div>
  ),
});

const ResortMasterplan = dynamic(() => import('@/components/ResortMasterplan'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F5F3EC] text-stone-400 text-xs tracking-widest uppercase">
      Loading Resort Masterplan…
    </div>
  ),
});

// Reads URL params (?hotel=, ?domain=, ?admin=)
function SearchParamsHandler({
  setDomain,
  setIsAdminMode,
}: {
  setDomain: React.Dispatch<React.SetStateAction<Domain>>;
  setIsAdminMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const searchParams = useSearchParams();
  const { lockPropertyFromParam } = useConcierge();

  useEffect(() => {
    lockPropertyFromParam(searchParams.get('hotel'));
    const adminParam = searchParams.get('admin') === 'true';
    setIsAdminMode(adminParam);

    const d = searchParams.get('domain');
    if (d === 'resort' || d === 'coast') {
      setDomain(d);
    } else if (adminParam) {
      setDomain('resort');
    }
  }, [searchParams, lockPropertyFromParam, setDomain, setIsAdminMode]);

  return null;
}

type Domain = 'resort' | 'coast';

export default function Home() {
  const { viewMode, isLockedGuestMode } = useConcierge();
  const [domain, setDomain] = useState<Domain>('resort');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] overflow-hidden bg-[#F5F3EC] text-stone-900 select-none overscroll-none">

      {/* URL param sync */}
      <Suspense fallback={null}>
        <SearchParamsHandler setDomain={setDomain} setIsAdminMode={setIsAdminMode} />
      </Suspense>

      {/* ── Admin Mode Floating Bar (only when ?admin=true) ─────────────── */}
      {isAdminMode && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100vw-24px)] sm:w-auto bg-amber-500/95 text-stone-950 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center justify-between gap-3 shadow-xl border border-amber-600/40 backdrop-blur-md">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping shrink-0" />
            <span className="truncate text-[11px] font-bold">Admin Pin Calibration Active</span>
          </div>
          <Link
            href="/admin"
            className="shrink-0 bg-stone-950 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold hover:bg-stone-800 transition-all ml-1"
          >
            GM Portal
          </Link>
        </div>
      )}

      {/* ── Unified Floating Apple-Style Luxury Top Bar ─────────────────── */}
      <div className={`fixed ${isAdminMode ? 'top-10 sm:top-11' : 'top-2.5 sm:top-4'} left-2.5 right-2.5 sm:left-6 sm:right-6 max-w-5xl mx-auto z-40 pointer-events-auto transition-all duration-300`}>
        <div className="bg-white/85 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl sm:rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3">

          {/* Left: Resort Brand */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-900 text-[#FAFAF8] flex items-center justify-center shadow-xs shrink-0">
              <Waves className="w-3.5 h-3.5 stroke-[1.75]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[11px] sm:text-sm font-serif font-bold tracking-tight text-stone-900 leading-tight truncate">
                CAPE WELIGAMA
              </h1>
              <p className="hidden xs:block text-[7.5px] sm:text-[9px] font-semibold tracking-[0.16em] uppercase text-stone-400 leading-tight truncate">
                Relais &amp; Châteaux
              </p>
            </div>
          </div>

          {/* Center: Minimalist Segmented Toggle */}
          <div className="inline-flex items-center bg-stone-100/90 p-[2.5px] rounded-full border border-stone-200/60 shadow-inner shrink-0">
            <button
              type="button"
              onClick={() => setDomain('resort')}
              className={`apple-bounce flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10.5px] sm:text-[11.5px] font-semibold tracking-wide transition-all duration-200 whitespace-nowrap active:scale-[0.92] cursor-pointer min-h-[32px] sm:min-h-[34px] ${
                domain === 'resort'
                  ? 'bg-stone-900 text-white shadow-xs scale-[1.02]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>📍</span>
              <span className="inline sm:hidden">Grounds</span>
              <span className="hidden sm:inline">Resort Grounds</span>
            </button>
            <button
              type="button"
              onClick={() => setDomain('coast')}
              className={`apple-bounce flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10.5px] sm:text-[11.5px] font-semibold tracking-wide transition-all duration-200 whitespace-nowrap active:scale-[0.92] cursor-pointer min-h-[32px] sm:min-h-[34px] ${
                domain === 'coast'
                  ? 'bg-stone-900 text-white shadow-xs scale-[1.02]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>🌊</span>
              <span className="inline sm:hidden">Coast</span>
              <span className="hidden sm:inline">Explore Coast</span>
            </button>
          </div>

          {/* Right: Guest mode badge or GM link */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {isLockedGuestMode ? (
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[8.5px] sm:text-[9.5px] font-medium rounded-full bg-stone-900/5 text-stone-600 border border-stone-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden xs:inline">Concierge</span>
              </span>
            ) : (
              <Link
                href="/admin"
                className="w-8 h-8 sm:w-auto sm:px-2.5 sm:py-1 rounded-full bg-stone-100/90 hover:bg-stone-200/90 text-stone-800 border border-stone-200/80 flex items-center justify-center gap-1 transition-all active:scale-90"
                title="Open Hotel Management Portal"
                aria-label="GM Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                <span className="hidden md:inline text-[10px] font-semibold">GM Portal</span>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* ── Category Filter for Coastal Guide (Floating underneath top bar) ─ */}
      {domain === 'coast' && (
        <div className={`fixed ${isAdminMode ? 'top-22 sm:top-25' : 'top-[58px] sm:top-20'} left-1/2 -translate-x-1/2 z-30 max-w-[calc(100vw-20px)] transition-all duration-300 pointer-events-auto`}>
          <div className="bg-white/85 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-lg p-1">
            <CategoryFilter />
          </div>
        </div>
      )}

      {/* ── Edge-to-Edge Full-Bleed Canvas ─────────────────────────────── */}
      <main className="w-full h-full relative">
        {!mounted ? (
          <div className="w-full h-full flex items-center justify-center bg-[#F5F3EC] text-stone-400 text-xs tracking-widest uppercase">
            Loading…
          </div>
        ) : domain === 'resort' ? (
          <ResortMasterplan isAdmin={isAdminMode} />
        ) : viewMode === 'map' ? (
          <div className="w-full h-full">
            <ConciergeMap />
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto pt-24 sm:pt-28 pb-24 bg-[#FAFAF8]">
            <ListView />
          </div>
        )}
      </main>

      {/* ── Global Bottom Sheet ────────────────────────────────────────── */}
      <BottomSheet />

      {/* ── View Switcher for Coastal Guide ────────────────────────────── */}
      {domain === 'coast' && mounted && <ViewSwitcher />}

    </div>
  );
}
