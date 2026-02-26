'use client';

import React from 'react';
import { ThemeContextProvider } from '@/lib/theme-context';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}
