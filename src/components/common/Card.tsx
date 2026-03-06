import React from 'react';
import { View, StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'purple' | 'orange' | 'grey' | 'darkGrey';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'light', style }) => {
  const isDark = useColorScheme() === 'dark';

  const getBackgroundColor = () => {
    switch (variant) {
      case 'dark': return COLORS.surface.dark;
      case 'purple': return COLORS.card.purple;
      case 'orange': return COLORS.card.orange;
      case 'grey': return COLORS.card.grey;
      case 'darkGrey': return COLORS.card.darkGrey;
      default: return isDark ? COLORS.surface.dark : COLORS.surface.light;
    }
  };

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.m,
    marginVertical: SPACING.s,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android elevation
    elevation: 3,
  },
});
