// Weather-Based Crop Advisory System - Theme Constants
// Agriculture-themed color palette

export const Colors = {
  // Brand Gradient Colors
  green: '#2e7d32',
  teal: '#2a9d8f',
  blue: '#1e5fa8',

  // Gradient stops
  gradientStart: '#2e7d32',
  gradientMid: '#2a9d8f',
  gradientEnd: '#1e5fa8',

  // Surface Colors
  white: '#ffffff',
  whiteAlpha80: 'rgba(255,255,255,0.80)',
  whiteAlpha60: 'rgba(255,255,255,0.60)',
  whiteAlpha20: 'rgba(255,255,255,0.20)',
  whiteAlpha10: 'rgba(255,255,255,0.10)',

  // Card backgrounds
  cardBg: 'rgba(255,255,255,0.15)',
  cardBgDark: 'rgba(0,0,0,0.15)',

  // Status Colors
  success: '#4caf50',
  warning: '#ff9800',
  danger: '#f44336',
  info: '#2196f3',

  // Text
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.75)',
  textMuted: 'rgba(255,255,255,0.55)',

  // Tab Bar
  tabBg: '#1a3a2a',
  tabActive: '#4caf50',
  tabInactive: 'rgba(255,255,255,0.45)',
};

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  hero: 36,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
};
