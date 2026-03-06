import React from 'react';
import { View, StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'glass';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, variant, style }) => {
  const isDark = useColorScheme() === 'dark';
  const bgColor = variant === 'dark' ? COLORS.surface.dark : COLORS.surface.light;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: bgColor },
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
