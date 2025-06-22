import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

// New standardized color palette
export const colors = {
  primary: '#064e3b', // Dark Green from gradient
  secondary: '#0f172a', // Dark Blue from gradient
  accent: '#14b8a6', // Teal for accents
  background: '#f8fafc', // Off-white for a clean look
  card: '#ffffff',
  textPrimary: '#0f172a', // Dark Blue for primary text
  textSecondary: '#64748b', // Slate gray for secondary text
  border: '#e2e8f0', // Light gray for borders
  success: '#22c55e',
  error: '#ef4444',
  gradient: ['#0f172a', '#064e3b'],
  text: '#333333',
  textLight: '#666666',
  comment: '#6B6B6B',
  commentText: '#333333',
  commentBackground: '#F5F5F5',
  commentBorder: '#E0E0E0',
  commentTextLight: '#666666',
  commentBackgroundLight: '#F5F5F5',
  commentBorderLight: '#E0E0E0',
  rantBackground: '#F5F5F5',
  rantBorder: '#E0E0E0',
  rantText: '#333333',
  rantTextLight: '#666666',
  rantBackgroundLight: '#F5F5F5',
  rantBorderLight: '#E0E0E0',
  warning: '#FFC107',
  upvote: '#FF6B6B',
  downvote: '#6B6B6B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
  },
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  circle: 9999,
};

export const screen = {
  width,
  height,
};

const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  screen,
};

export default theme;

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
}; 