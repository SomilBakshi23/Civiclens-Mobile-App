export const darkTheme = {
  mode: 'dark',
  background: '#050A14', // Very dark blue/black
  surface: '#0F1623', // Card background
  surfaceLight: '#1A2130', // Lighter elements
  primary: '#3B82F6', // Bright Blue
  primaryDark: '#1D4ED8',
  secondary: '#64748B',

  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',

  // Status Colors
  success: '#10B981', // Resolved
  successBg: 'rgba(16, 185, 129, 0.15)',

  warning: '#F59E0B', // In Progress
  warningBg: 'rgba(245, 158, 11, 0.15)',

  error: '#EF4444', // Open / Urgent
  errorBg: 'rgba(239, 68, 68, 0.15)',

  info: '#3B82F6',
  infoBg: 'rgba(59, 130, 246, 0.15)',

  border: '#1E293B',
  cardBorder: '#1E293B',

  // Specific UI
  tabBar: '#0F1623',
  tabBarBorder: '#1E293B',

  sheetBg: '#0F1623',
};

export const lightTheme = {
  mode: 'light',
  background: '#F8FAFC', // Very light grey/white
  surface: '#FFFFFF', // White Card
  surfaceLight: '#F1F5F9', // Light elements
  primary: '#3B82F6', // Bright Blue (Keep same or slightly darker?) Keep same for brand
  primaryDark: '#2563EB',
  secondary: '#94A3B8',

  textPrimary: '#0F172A', // Very dark blue (almost black)
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',

  // Status Colors
  success: '#059669', // Darker green for white bg
  successBg: '#D1FAE5',

  warning: '#D97706', // Darker amber
  warningBg: '#FEF3C7',

  error: '#DC2626', // Darker red
  errorBg: '#FEE2E2',

  info: '#2563EB',
  infoBg: '#DBEAFE',

  border: '#E2E8F0',
  cardBorder: '#E2E8F0',

  // Specific UI
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',

  sheetBg: '#FFFFFF',
};

// Default export for legacy support until fully refactored, points to dark
export const colors = darkTheme;
