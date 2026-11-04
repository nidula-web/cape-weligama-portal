'use client';

import React from 'react';
import { ConciergeProvider } from '@/context/ConciergeContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ConciergeProvider>{children}</ConciergeProvider>;
}
