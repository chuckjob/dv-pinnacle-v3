/**
 * Foundry Design System — Token Constants
 * Exported from variables.json for use in JS/TS (charts, inline styles, etc.)
 */

export const colors = {
  plum: {
    900: '#180d26',
    800: '#30194d',
    700: '#472673',
    600: '#5f3399',
    500: '#7740bf',
    400: '#9266cc',
    300: '#ad8cd9',
    200: '#c9b3e5',
    100: '#e4d9f2',
    50: '#f1ecf9',
    25: '#faf7fc',
  },
  berry: {
    700: '#7e1b62',
    600: '#a82483',
    500: '#d22da3',
    400: '#db57b6',
    300: '#e481c8',
    100: '#f6d5ed',
    50: '#fbeaf6',
  },
  grass: {
    700: '#2e6b38',
    600: '#3d8f4b',
    500: '#4db35e',
    300: '#94d19e',
    100: '#dbf0df',
    50: '#edf7ef',
    25: '#f8fcf9',
  },
  turquoise: {
    700: '#2e686b',
    500: '#4daeb3',
    300: '#94ced1',
    100: '#dbeff0',
    25: '#f8fcfc',
  },
  tomato: {
    700: '#7e1b1b',
    500: '#d22d2d',
    300: '#e48181',
    100: '#f6d5d5',
    50: '#fbeaea',
    25: '#fdf7f7',
  },
  orange: {
    700: '#8e3b0b',
    600: '#be4f0e',
    500: '#ed6212',
    100: '#fbe0d0',
    50: '#fdefe7',
    25: '#fef9f6',
  },
  lemon: {
    500: '#e6ac19',
    100: '#faeed1',
  },
  sky: {
    500: '#3382cc',
    100: '#d6e6f5',
    50: '#ebf3fa',
  },
  cool: {
    900: '#14113b',
    800: '#2a274b',
    700: '#444755',
    600: '#5b5f71',
    500: '#71768e',
    400: '#8e92a4',
    300: '#aaadbb',
  },
  neutral: {
    700: '#4d4d4d',
    500: '#808080',
    300: '#b3b3b3',
    200: '#cccccc',
    100: '#e6e6e6',
    50: '#f2f2f2',
    25: '#fafafa',
  },
  white: '#ffffff',
} as const;

/** Semantic metric colors for charts and visualizations */
export const metricColors = {
  brandSuitability: colors.turquoise[500],
  fraud: colors.plum[500],
  viewability: colors.grass[500],
  impressions: colors.sky[500],
  cpm: colors.berry[500],
  mediaCost: colors.orange[500],
  savings: colors.grass[600],
  inefficiency: colors.tomato[500],
} as const;

/** Risk tier colors */
export const riskColors = {
  high: { bg: colors.tomato[50], text: colors.tomato[700], border: colors.tomato[300] },
  medium: { bg: colors.orange[50], text: colors.orange[700], border: colors.orange[500] },
  low: { bg: colors.grass[50], text: colors.grass[700], border: colors.grass[300] },
  none: { bg: colors.neutral[50], text: colors.cool[600], border: colors.neutral[200] },
} as const;

/** Status colors */
export const statusColors = {
  success: colors.grass[700],
  error: colors.tomato[700],
  warning: colors.orange[700],
  info: colors.turquoise[700],
} as const;

/** Typography scale */
export const typography = {
  h1: { size: '40px', lineHeight: '48px', weight: 700 },
  h2: { size: '36px', lineHeight: '44px', weight: 700 },
  h3: { size: '32px', lineHeight: '40px', weight: 700 },
  h4: { size: '28px', lineHeight: '36px', weight: 700 },
  h5: { size: '24px', lineHeight: '32px', weight: 700 },
  h6: { size: '16px', lineHeight: '24px', weight: 600 },
  body1: { size: '18px', lineHeight: '28px', weight: 400 },
  body2: { size: '16px', lineHeight: '24px', weight: 400 },
  body3: { size: '14px', lineHeight: '20px', weight: 400 },
  label: { size: '12px', lineHeight: '16px', weight: 500 },
  caption: { size: '10px', lineHeight: '14px', weight: 400 },
} as const;

/** MUI-standard semantic typography tokens (13 variants)
 *  Each variant combines fontSize, lineHeight, fontWeight, letterSpacing, and rem.
 *  Use these names in code and design specs.
 */
export const typographyMUI = {
  h1:        { size: '96px',  rem: '6rem',     lineHeight: 1.167, weight: 300, letterSpacing: '-1.5px', usage: 'Page titles, hero headings' },
  h2:        { size: '60px',  rem: '3.75rem',  lineHeight: 1.2,   weight: 300, letterSpacing: '-0.5px', usage: 'Section headings' },
  h3:        { size: '48px',  rem: '3rem',     lineHeight: 1.167, weight: 400, letterSpacing: '0px',    usage: 'Sub-section headings' },
  h4:        { size: '34px',  rem: '2.125rem', lineHeight: 1.235, weight: 400, letterSpacing: '0.25px', usage: 'Card titles, dialog headings' },
  h5:        { size: '24px',  rem: '1.5rem',   lineHeight: 1.334, weight: 400, letterSpacing: '0px',    usage: 'Sub-headings, group labels' },
  h6:        { size: '20px',  rem: '1.25rem',  lineHeight: 1.6,   weight: 500, letterSpacing: '0.15px', usage: 'Small headings, list titles' },
  subtitle1: { size: '16px',  rem: '1rem',     lineHeight: 1.75,  weight: 400, letterSpacing: '0.15px', usage: 'Section labels, nav items' },
  subtitle2: { size: '14px',  rem: '0.875rem', lineHeight: 1.57,  weight: 500, letterSpacing: '0.1px',  usage: 'Metadata labels, tags' },
  body1:     { size: '16px',  rem: '1rem',     lineHeight: 1.5,   weight: 400, letterSpacing: '0.15px', usage: 'Primary paragraph text' },
  body2:     { size: '14px',  rem: '0.875rem', lineHeight: 1.43,  weight: 400, letterSpacing: '0.15px', usage: 'Secondary text, descriptions' },
  button:    { size: '14px',  rem: '0.875rem', lineHeight: 1.75,  weight: 500, letterSpacing: '0.4px',  usage: 'Button labels (uppercase)' },
  caption:   { size: '12px',  rem: '0.75rem',  lineHeight: 1.66,  weight: 400, letterSpacing: '0.4px',  usage: 'Timestamps, helper text' },
  overline:  { size: '12px',  rem: '0.75rem',  lineHeight: 2.66,  weight: 400, letterSpacing: '1px',    usage: 'Category labels (uppercase)' },
} as const;

/** Spacing (8px grid) */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;
