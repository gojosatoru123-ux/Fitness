import React from 'react';
import { Text as RNText, TextProps, StyleSheet, useColorScheme } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../constants/theme';

interface CustomTextProps extends TextProps {
  variant?: keyof typeof TYPOGRAPHY;
  color?: string;
  weight?: '400' | '600' | '700';
  center?: boolean;
}

export const Text: React.FC<CustomTextProps> = ({
  variant = 'body',
  color,
  weight,
  center,
  style,
  ...props
}) => {
  const isDark = useColorScheme() === 'dark';
  const defaultColor = isDark ? COLORS.text.primary.dark : COLORS.text.primary.light;

  return (
    <RNText
      style={[
        TYPOGRAPHY[variant],
        { color: color || defaultColor },
        weight && { fontWeight: weight },
        center && { textAlign: 'center' },
        style,
      ]}
      {...props}
    />
  );
};
