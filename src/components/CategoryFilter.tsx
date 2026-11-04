'use client';

import React from 'react';
import { useConcierge } from '@/context/ConciergeContext';
import { Category } from '@/types';
import { Waves, UtensilsCrossed, Flower2, Compass, Layers } from 'lucide-react';

interface CategoryConfig {
  key: Category;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'All', label: 'All Curated', icon: Layers },
  { key: 'Surf & Breaks', label: 'Surf & Breaks', icon: Waves },
  { key: 'Cafes & Dining', label: 'Cafes & Dining', icon: UtensilsCrossed },
  { key: 'Wellness & Yoga', label: 'Wellness & Yoga', icon: Flower2 },
  { key: 'Secret Spots', label: 'Secret Spots', icon: Compass },
];

export default function CategoryFilter() {
  const { categoryFilter, setCategoryFilter, spots } = useConcierge();

  const getCategoryCount = (cat: Category) => {
    const activeSpots = spots.filter((s) => s.status === 'active');
    if (cat === 'All') return activeSpots.length;
    return activeSpots.filter((s) => s.category === cat).length;
  };

  return (
    <div className="w-full bg-[#FAFAF8] py-2 sm:py-3 border-b border-[#E5E4E0]/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {CATEGORIES.map(({ key, label, icon: Icon }) => {
            const isSelected = categoryFilter === key;
            const count = getCategoryCount(key);

            return (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all duration-200 border shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-[#1E3A2B] text-white border-[#1E3A2B] shadow-sm'
                    : 'bg-white text-[#706E6B] border-[#E5E4E0] hover:text-[#1A1A1A] hover:border-[#1A1A1A]/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#706E6B]'}`} />
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#F0EFEA] text-[#706E6B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
