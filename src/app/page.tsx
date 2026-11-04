'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useConcierge } from '@/context/ConciergeContext';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import ListView from '@/components/ListView';
import BottomSheet from '@/components/BottomSheet';
import ViewSwitcher from '@/components/ViewSwitcher';

const ConciergeMap = dynamic(() => import('@/components/ConciergeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-[#FAFAF8] text-stone-400 text-xs tracking-widest uppercase">
      Loading Coastal Guide…
    </div>
  ),
});

const ResortMasterplan = dynamic(() => import('@/components/ResortMasterplan'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-[#FAFAF8] text-stone-400 text-xs tracking-widest uppercase">
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
  const { viewMode } = useConcierge();
  const [domain, setDomain] = useState<Domain>('resort');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#FAFAF8] text-stone-900 flex flex-col selection:bg-stone-900/10 overscroll-none">

      {/* URL param sync */}
      <Suspense fallback={null}>
        <SearchParamsHandler setDomain={setDomain} setIsAdminMode={setIsAdminMode} />
      </Suspense>

      {/* Admin Mode Quick Bar (when ?admin=true is active) */}
      {isAdminMode && (
        <div className="bg-amber-500 text-stone-950 px-3 py-1.5 text-xs font-semibold flex items-center justify-between z-50 shadow-sm border-b border-amber-600">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping shrink-0" />
            <span className="truncate">ADMIN MODE ACTIVE: Resort Masterplan Pin Calibration</span>
          </div>
          <a
            href="/admin"
            className="shrink-0 bg-stone-950 text-white px-2.5 py-0.5 rounded-full text-[10.5px] font-bold hover:bg-stone-800 transition-all ml-2"
          >
            ← Back to GM Portal
          </a>
        </div>
      )}

      {/* ── Top Navbar ───────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Dual Domain Toggle ───────────────────────────────────────── */}
      <div className="sticky top-13 sm:top-16 z-30 bg-[#FAFAF8]/96 backdrop-blur-md border-b border-stone-200">
        <div className="flex justify-center py-2 sm:py-2.5 px-3 sm:px-4">
          <div className="inline-flex items-center bg-stone-100 p-[2.5px] sm:p-[3px] rounded-full border border-stone-200 shadow-xs max-w-full">
            <button
              type="button"
              onClick={() => setDomain('resort')}
              className={`apple-bounce flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10.5px] sm:text-[11px] font-semibold tracking-wide transition-all duration-300 whitespace-nowrap active:scale-[0.88] cursor-pointer ${
                domain === 'resort'
                  ? 'bg-stone-900 text-white shadow-sm scale-[1.02]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>📍</span>
              <span className="inline sm:hidden">Grounds</span>
              <span className="hidden sm:inline">Resort Grounds</span>
              <span className="hidden md:inline text-[9px] font-normal opacity-70">(12 Acres)</span>
            </button>
            <button
              type="button"
              onClick={() => setDomain('coast')}
              className={`apple-bounce flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10.5px] sm:text-[11px] font-semibold tracking-wide transition-all duration-300 whitespace-nowrap active:scale-[0.88] cursor-pointer ${
                domain === 'coast'
                  ? 'bg-stone-900 text-white shadow-sm scale-[1.02]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>🌊</span>
              <span className="inline sm:hidden">Coast Guide</span>
              <span className="hidden sm:inline">Explore South Coast</span>
            </button>
          </div>
        </div>

        {/* Category filter — only shown in Coastal view, rendered in-flow to avoid shift */}
        <div
          className="overflow-hidden transition-all duration-200"
          style={{ maxHeight: domain === 'coast' ? '60px' : '0px', opacity: domain === 'coast' ? 1 : 0 }}
        >
          <CategoryFilter />
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="flex-1 relative flex flex-col">
        {!mounted ? (
          <div className="w-full flex-1 min-h-[460px] flex items-center justify-center bg-[#FAFAF8] text-stone-400 text-xs tracking-widest uppercase">
            Loading…
          </div>
        ) : domain === 'resort' ? (
          <ResortMasterplan isAdmin={isAdminMode} />
        ) : viewMode === 'map' ? (
          <ConciergeMap />
        ) : (
          <ListView />
        )}
      </main>

      {/* ── Global Bottom Sheet (works for both domains) ─────────────── */}
      <BottomSheet />

      {/* ── View Switcher — only for Coastal guide ───────────────────── */}
      {domain === 'coast' && mounted && <ViewSwitcher />}
    </div>
  );
}
