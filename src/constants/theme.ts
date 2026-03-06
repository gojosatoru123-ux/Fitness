export const COLORS = {
  primary: '#FF8C4B', // Orange from design
  secondary: '#FFB18B',
  accent: '#7B61FF', // Purple from design
  background: {
    light: '#F8F9FA',
    dark: '#000000',
  },
  surface: {
    light: '#FFFFFF',
    dark: '#1C1C1E',
  },
  text: {
    primary: {
      light: '#1A1C1E',
      dark: '#FFFFFF',
    },
    secondary: {
      light: '#8E8E93',
      dark: '#8E8E93',
    },
    accent: '#FF8C4B',
  },
  success: '#34C759',
  warning: '#FFCC00',
  error: '#FF3B30',
  info: '#007AFF',
  card: {
    purple: '#7B61FF',
    orange: '#FF8C4B',
    grey: '#3A3A3C',
    darkGrey: '#2C2C2E',
  },
} as const;

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
} as const;

export const TYPOGRAPHY = {
  h1: {
    fontSize: 34,
    fontWeight: '800' as const,
    lineHeight: 41,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  h3: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
} as const;
