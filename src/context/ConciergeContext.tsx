'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Category, Property, Spot, ViewMode, InquiryEvent } from '@/types';
import { INITIAL_SPOTS, PROPERTIES, INITIAL_INQUIRIES, findPropertyByParam, CAPE_WELIGAMA } from '@/data/seedData';

interface HotelStats {
  activeSpotsCount: number;
  totalInquiries: number;
  estimatedCommission: number;
  topSpot: Spot | null;
}

interface ConciergeContextType {
  property: Property;
  setProperty: (property: Property) => void;
  properties: Property[];
  isLockedGuestMode: boolean;
  activeHotelParam: string | null;
  lockPropertyFromParam: (param: string | null) => void;
  spots: Spot[];
  filteredSpots: Spot[];
  categoryFilter: Category;
  setCategoryFilter: (category: Category) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedSpot: Spot | null;
  setSelectedSpot: (spot: Spot | null) => void;
  bookViaWhatsApp: (spot: Spot) => void;
  getDirectionsUrl: (spot: Spot) => string;
  inquiries: InquiryEvent[];
  // Admin actions
  addSpot: (spot: Omit<Spot, 'id' | 'inquiriesCount'>) => void;
  toggleSpotStatus: (id: string) => void;
  deleteSpot: (id: string) => void;
  resetToDefaults: () => void;
  stats: HotelStats;
  getHotelStats: (propertyId?: string) => HotelStats;
}

const ConciergeContext = createContext<ConciergeContextType | undefined>(undefined);

const STORAGE_KEY_SPOTS = 'boutique_concierge_spots_v2';
const STORAGE_KEY_PROPERTY = 'boutique_concierge_property_v2';
const STORAGE_KEY_INQUIRIES = 'boutique_concierge_inquiries_v2';

export function ConciergeProvider({ children }: { children: React.ReactNode }) {
  // Always initialize with Cape Weligama so server and client markup match 100% on initial hydration
  const [property, setPropertyState] = useState<Property>(CAPE_WELIGAMA);
  const [isLockedGuestMode, setIsLockedGuestMode] = useState<boolean>(false);
  const [activeHotelParam, setActiveHotelParam] = useState<string | null>(null);
  const [spots, setSpots] = useState<Spot[]>(INITIAL_SPOTS);
  const [inquiries, setInquiries] = useState<InquiryEvent[]>(INITIAL_INQUIRIES);
  const [categoryFilter, setCategoryFilter] = useState<Category>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const hasLoadedFromStorage = useRef(false);

  // URL-Based locking function called when useSearchParams provides ?hotel=
  const lockPropertyFromParam = useCallback((param: string | null) => {
    if (param) {
      const found = findPropertyByParam(param);
      if (found) {
        setPropertyState(found);
        setIsLockedGuestMode(true);
        setActiveHotelParam(param);
        return;
      }
    }
    // If no hotel param, pitch/demo mode is active
    setIsLockedGuestMode(false);
    setActiveHotelParam(null);
  }, []);

  // Sync state from client-side localStorage after initial hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedSpots = localStorage.getItem(STORAGE_KEY_SPOTS);
        if (savedSpots) {
          const parsed = JSON.parse(savedSpots);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSpots(parsed);
          }
        }
        const savedInquiries = localStorage.getItem(STORAGE_KEY_INQUIRIES);
        if (savedInquiries) {
          const parsed = JSON.parse(savedInquiries);
          if (Array.isArray(parsed)) {
            setInquiries(parsed);
          }
        }
        // Only restore stored property if not already locked via URL param
        if (!isLockedGuestMode) {
          const savedPropId = localStorage.getItem(STORAGE_KEY_PROPERTY);
          if (savedPropId) {
            const found = PROPERTIES.find((p) => p.id === savedPropId || p.slug === savedPropId);
            if (found) {
              setPropertyState(found);
            }
          }
        }
      } catch (err) {
        console.warn('Could not read from localStorage', err);
      } finally {
        hasLoadedFromStorage.current = true;
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isLockedGuestMode]);

  // Persist spots to localStorage on update
  useEffect(() => {
    if (!hasLoadedFromStorage.current) return;
    try {
      localStorage.setItem(STORAGE_KEY_SPOTS, JSON.stringify(spots));
    } catch (err) {
      console.warn('Could not persist spots to localStorage', err);
    }
  }, [spots]);

  // Persist inquiries to localStorage on update
  useEffect(() => {
    if (!hasLoadedFromStorage.current) return;
    try {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
    } catch (err) {
      console.warn('Could not persist inquiries to localStorage', err);
    }
  }, [inquiries]);

  const setProperty = (prop: Property) => {
    setPropertyState(prop);
    try {
      localStorage.setItem(STORAGE_KEY_PROPERTY, prop.id);
    } catch (err) {
      console.warn('Could not persist property to localStorage', err);
    }
  };

  const filteredSpots = spots.filter((spot) => {
    if (spot.status !== 'active') return false;
    // If spot is exclusive to a property, check match
    if (spot.propertyId && spot.propertyId !== property.id) return false;
    if (categoryFilter === 'All') return true;
    return spot.category === categoryFilter;
  });

  const bookViaWhatsApp = (spot: Spot) => {
    // 1. Increment inquiry count on spot
    setSpots((prev) =>
      prev.map((s) => (s.id === spot.id ? { ...s, inquiriesCount: (s.inquiriesCount || 0) + 1 } : s))
    );

    // 2. Track inquiry event with active hotel association
    const newInquiry: InquiryEvent = {
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      spotId: spot.id,
      spotName: spot.name,
      propertyId: property.id,
      propertyName: property.name,
      timestamp: new Date().toISOString(),
      commission: 10,
    };
    setInquiries((prev) => [newInquiry, ...prev]);

    // 3. Build tracked WhatsApp URL — unified Cape Weligama referral format
    const hotelName = property.name;
    const refToken = property.vipRef || 'CAPE';
    const message = spot.whatsappMessage
      ? `${spot.whatsappMessage} (${hotelName}, Ref: CAPE-${refToken})`
      : `Hi! I'm a guest at ${hotelName} (Ref: CAPE-${refToken}). I'd like to reserve a spot.`;
    const cleanPhone = (spot.whatsapp || '94770000000').replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getDirectionsUrl = (spot: Spot) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
  };

  const addSpot = (newSpotData: Omit<Spot, 'id' | 'inquiriesCount'>) => {
    const newSpot: Spot = {
      ...newSpotData,
      id: `spot-${Date.now()}`,
      inquiriesCount: 0,
      status: 'active',
    };
    setSpots((prev) => [newSpot, ...prev]);
  };

  const toggleSpotStatus = (id: string) => {
    setSpots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
    );
  };

  const deleteSpot = (id: string) => {
    setSpots((prev) => prev.filter((s) => s.id !== id));
    if (selectedSpot?.id === id) {
      setSelectedSpot(null);
    }
  };

  const resetToDefaults = () => {
    setSpots(INITIAL_SPOTS);
    setInquiries(INITIAL_INQUIRIES);
    try {
      localStorage.removeItem(STORAGE_KEY_SPOTS);
      localStorage.removeItem(STORAGE_KEY_INQUIRIES);
      localStorage.removeItem(STORAGE_KEY_PROPERTY);
    } catch {
      // Ignore
    }
  };

  // Helper to calculate statistics for a specific hotel or all hotels
  const getHotelStats = useCallback(
    (propertyId?: string): HotelStats => {
      const targetSpots = propertyId
        ? spots.filter((s) => !s.propertyId || s.propertyId === propertyId)
        : spots;

      const activeSpotsCount = targetSpots.filter((s) => s.status === 'active').length;

      const targetInquiries = propertyId
        ? inquiries.filter((inq) => inq.propertyId === propertyId)
        : inquiries;

      const totalInquiries = targetInquiries.length;
      const estimatedCommission = totalInquiries * 10;

      // Find top spot by inquiry counts
      const spotCountMap: Record<string, number> = {};
      targetInquiries.forEach((inq) => {
        spotCountMap[inq.spotId] = (spotCountMap[inq.spotId] || 0) + 1;
      });

      let topSpotId: string | null = null;
      let maxCount = -1;
      Object.entries(spotCountMap).forEach(([sId, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topSpotId = sId;
        }
      });

      const topSpot = topSpotId
        ? spots.find((s) => s.id === topSpotId) || targetSpots[0] || null
        : targetSpots[0] || null;

      return {
        activeSpotsCount,
        totalInquiries,
        estimatedCommission,
        topSpot,
      };
    },
    [spots, inquiries]
  );

  const stats = getHotelStats(property.id);

  return (
    <ConciergeContext.Provider
      value={{
        property,
        setProperty,
        properties: PROPERTIES,
        isLockedGuestMode,
        activeHotelParam,
        lockPropertyFromParam,
        spots,
        filteredSpots,
        categoryFilter,
        setCategoryFilter,
        viewMode,
        setViewMode,
        selectedSpot,
        setSelectedSpot,
        bookViaWhatsApp,
        getDirectionsUrl,
        inquiries,
        addSpot,
        toggleSpotStatus,
        deleteSpot,
        resetToDefaults,
        stats,
        getHotelStats,
      }}
    >
      {children}
    </ConciergeContext.Provider>
  );
}

export function useConcierge() {
  const context = useContext(ConciergeContext);
  if (!context) {
    throw new Error('useConcierge must be used within a ConciergeProvider');
  }
  return context;
}
