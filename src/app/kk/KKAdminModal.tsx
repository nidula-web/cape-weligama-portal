'use client';

import React, { useState } from 'react';
import {
  X,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Car,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Sparkles,
  ShieldCheck,
  MapPin,
  Calendar,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */

export interface AdminPinRecord {
  num: number;
  id: string;
  title: string;
  tag: string;
  coords: [number, number]; // [lat, lng]
}

interface KKAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  pins: AdminPinRecord[];
  onUpdatePinCoords: (num: number, coords: [number, number]) => void;
  onResetPins: () => void;
}

interface DispatchLog {
  id: string;
  villa: string;
  request: string;
  time: string;
  status: 'Pending' | 'Dispatched' | 'Completed';
  category: 'Buggy' | 'Room Service' | 'Luggage' | 'Dining';
}

const INITIAL_DISPATCH_LOGS: DispatchLog[] = [
  {
    id: 'dsp-1',
    villa: 'Dubu Suite',
    request: 'Buggy requested to Living Pavilion',
    time: '2 mins ago',
    status: 'Pending',
    category: 'Buggy',
  },
  {
    id: 'dsp-2',
    villa: 'Nelum Suite',
    request: 'Extra towels & pool ice bucket',
    time: '8 mins ago',
    status: 'Completed',
    category: 'Room Service',
  },
  {
    id: 'dsp-3',
    villa: 'Kadju Suite',
    request: 'Buggy requested to KK Spa Sanctuary',
    time: '14 mins ago',
    status: 'Completed',
    category: 'Buggy',
  },
  {
    id: 'dsp-4',
    villa: 'Kumbuk Suite',
    request: 'Luggage dispatch to Security Gate',
    time: '19 mins ago',
    status: 'Completed',
    category: 'Luggage',
  },
  {
    id: 'dsp-5',
    villa: 'Araliya Suite',
    request: 'Afternoon Ceylon tea delivery to veranda',
    time: '26 mins ago',
    status: 'Completed',
    category: 'Dining',
  },
];

const COMMISSION_LEDGER = [
  {
    id: 'tx-1',
    excursion: 'KK Beach Day Pass & Lunch',
    token: 'KK-BEACH-VIP',
    villa: 'Dubu Suite',
    pax: 2,
    totalBill: '$240.00',
    commission: '$45.00',
    status: 'Captured',
    time: 'Today, 14:20',
  },
  {
    id: 'tx-2',
    excursion: 'Koggala Lake Catamaran Safari',
    token: 'KK-LAKE-BOAT',
    villa: 'Nelum Suite',
    pax: 2,
    totalBill: '$190.00',
    commission: '$38.00',
    status: 'Captured',
    time: 'Today, 11:45',
  },
  {
    id: 'tx-3',
    excursion: 'Galle Fort Architectural Tour',
    token: 'KK-GALLE-WALK',
    villa: 'Kadju Suite',
    pax: 4,
    totalBill: '$160.00',
    commission: '$30.00',
    status: 'Captured',
    time: 'Yesterday, 16:10',
  },
  {
    id: 'tx-4',
    excursion: 'Handunugoda Virgin White Tea Tour',
    token: 'KK-TEA-TOUR',
    villa: 'Kumbuk Suite',
    pax: 2,
    totalBill: '$120.00',
    commission: '$22.00',
    status: 'Captured',
    time: 'Yesterday, 10:30',
  },
  {
    id: 'tx-5',
    excursion: 'Kabalana Surf Lesson & Board VIP',
    token: 'KK-SURF-KAB',
    villa: 'Hibiscus Suite',
    pax: 2,
    totalBill: '$180.00',
    commission: '$35.00',
    status: 'Captured',
    time: '2 days ago',
  },
];

export default function KKAdminModal({
  isOpen,
  onClose,
  pins,
  onUpdatePinCoords,
  onResetPins,
}: KKAdminModalProps) {
  const [activeTab, setActiveTab] = useState<'commission' | 'dispatch' | 'calibration'>('commission');
  const [dispatchLogs, setDispatchLogs] = useState<DispatchLog[]>(INITIAL_DISPATCH_LOGS);
  const [copied, setCopied] = useState(false);
  const [editingNum, setEditingNum] = useState<number | null>(null);
  const [editLat, setEditLat] = useState<string>('');
  const [editLng, setEditLng] = useState<string>('');

  if (!isOpen) return null;

  const handleAdvanceStatus = (id: string) => {
    setDispatchLogs((prev) =>
      prev.map((log) => {
        if (log.id === id) {
          if (log.status === 'Pending') return { ...log, status: 'Dispatched' };
          if (log.status === 'Dispatched') return { ...log, status: 'Completed' };
        }
        return log;
      })
    );
  };

  const handleCopyConfig = () => {
    const tsCode = `export const KK_DEFAULT_PINS = ${JSON.stringify(
      pins.map((p) => ({
        num: p.num,
        id: p.id,
        title: p.title,
        tag: p.tag,
        coords: p.coords,
      })),
      null,
      2
    )};`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(tsCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const startEditPin = (pin: AdminPinRecord) => {
    setEditingNum(pin.num);
    setEditLat(pin.coords[0].toString());
    setEditLng(pin.coords[1].toString());
  };

  const saveEditPin = (num: number) => {
    const lat = parseInt(editLat, 10);
    const lng = parseInt(editLng, 10);
    if (!isNaN(lat) && !isNaN(lng)) {
      onUpdatePinCoords(num, [lat, lng]);
    }
    setEditingNum(null);
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Main Glassmorphism Modal Card */}
      <div className="relative z-10 w-full max-w-2xl bg-black/90 backdrop-blur-2xl border border-white/15 text-white rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col gap-5 max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#88A878]/20 border border-[#88A878]/40 flex items-center justify-center text-[#88A878]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-xl font-bold tracking-wide text-[#F5F7F2]">
                  Kahanda Kanda • Management Console
                </h2>
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  GM Live
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                Live Operations &amp; Commission Ledger
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            aria-label="Close GM Console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('commission')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === 'commission'
                ? 'bg-[#88A878] text-[#1A231C] font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Commission Yield</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dispatch')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === 'dispatch'
                ? 'bg-[#88A878] text-[#1A231C] font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Buggy Queue</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calibration')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === 'calibration'
                ? 'bg-[#88A878] text-[#1A231C] font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Pin Config (20)</span>
          </button>
        </div>

        {/* Scrollable Tab Content Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: EXCURSION COMMISSION YIELD */}
          {activeTab === 'commission' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center justify-between text-stone-400 text-xs">
                    <span>Captured Revenue</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl sm:text-2xl font-bold font-serif text-[#F5F7F2]">
                      $1,640 USD
                    </span>
                    <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                      +24.8% (This Month)
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center justify-between text-stone-400 text-xs">
                    <span>WhatsApp Bookings</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#88A878]" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl sm:text-2xl font-bold font-serif text-[#F5F7F2]">
                      28 Bookings
                    </span>
                    <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                      100% Verified Referrals
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/15 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center justify-between text-stone-400 text-xs">
                    <span>Avg Commission Yield</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl sm:text-2xl font-bold font-serif text-[#F5F7F2]">
                      18.5%
                    </span>
                    <p className="text-[11px] text-amber-300 font-medium mt-0.5">
                      Net Hotel Commission
                    </p>
                  </div>
                </div>
              </div>

              {/* Commission Ledger Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A6C498]">
                    Recent Commission Ledger
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Updated Live
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-inner">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                          <th className="py-2.5 px-3">Excursion &amp; Ref</th>
                          <th className="py-2.5 px-3">Villa</th>
                          <th className="py-2.5 px-3">Commission</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {COMMISSION_LEDGER.map((tx) => (
                          <tr
                            key={tx.id}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-stone-200">
                                {tx.excursion}
                              </div>
                              <div className="font-mono text-[10px] text-[#88A878] mt-0.5">
                                {tx.token}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-stone-300 font-serif">
                              {tx.villa}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-emerald-400">
                                {tx.commission}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE BUGGY & SERVICE QUEUE */}
          {activeTab === 'dispatch' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A6C498]">
                  Active Guest Dispatch Logs
                </span>
                <span className="text-[10px] text-stone-400">
                  Tap to update status
                </span>
              </div>

              <div className="space-y-2">
                {dispatchLogs.map((log) => {
                  const isPending = log.status === 'Pending';
                  const isDispatched = log.status === 'Dispatched';

                  return (
                    <div
                      key={log.id}
                      className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isPending
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                              : isDispatched
                              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                              : 'bg-[#88A878]/20 border-[#88A878]/40 text-[#88A878]'
                          }`}
                        >
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-stone-200">
                              {log.villa}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                              {log.category}
                            </span>
                          </div>
                          <p className="text-xs text-stone-300 mt-0.5">
                            {log.request}
                          </p>
                          <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{log.time}</span>
                          </span>
                        </div>
                      </div>

                      {/* Action Status Button */}
                      <div>
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStatus(log.id)}
                            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
                          >
                            Mark Dispatched
                          </button>
                        ) : isDispatched ? (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStatus(log.id)}
                            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
                          >
                            Mark Completed
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                            <Check className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PIN CALIBRATION & JSON EXPORT */}
          {activeTab === 'calibration' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A6C498]">
                    All 20 Architectural Locations
                  </span>
                  <p className="text-[11px] text-stone-400">
                    Edit coordinates or copy TypeScript configuration array
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onResetPins}
                    title="Reset all pins to blueprint defaults"
                    className="bg-white/10 hover:bg-white/20 text-stone-300 p-2 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyConfig}
                    className="bg-[#88A878] hover:bg-[#789868] text-[#1A231C] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#1A231C]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Config!' : 'Copy Config'}</span>
                  </button>
                </div>
              </div>

              {/* Pins Table */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-inner max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-[#1A231C] border-b border-white/10 text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Location</th>
                      <th className="py-2 px-3">Tag</th>
                      <th className="py-2 px-3">Coordinates [Y, X]</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pins.map((p) => {
                      const isEditing = editingNum === p.num;

                      return (
                        <tr
                          key={p.num}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="py-2 px-3 font-mono text-stone-400">
                            {p.num}
                          </td>
                          <td className="py-2 px-3 font-semibold text-stone-200">
                            {p.title}
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white/10 text-stone-300 border border-white/10">
                              {p.tag}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-stone-300">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={editLat}
                                  onChange={(e) => setEditLat(e.target.value)}
                                  className="w-16 bg-black/60 border border-[#88A878] rounded px-1.5 py-0.5 text-xs text-white"
                                />
                                <input
                                  type="number"
                                  value={editLng}
                                  onChange={(e) => setEditLng(e.target.value)}
                                  className="w-16 bg-black/60 border border-[#88A878] rounded px-1.5 py-0.5 text-xs text-white"
                                />
                              </div>
                            ) : (
                              `[${p.coords[0]}, ${p.coords[1]}]`
                            )}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => saveEditPin(p.num)}
                                className="bg-[#88A878] text-[#1A231C] px-2 py-1 rounded text-[10px] font-bold active:scale-95"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEditPin(p)}
                                className="text-stone-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 text-[10px] font-medium transition-all"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
