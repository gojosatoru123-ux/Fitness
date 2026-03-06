import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity, // Added
  ViewStyle
} from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>; // Updated from ViewStyle to StyleProp<ViewStyle>
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  style,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary': return styles.primary;
      case 'secondary': return styles.secondary;
      case 'outline': return styles.outline;
      case 'ghost': return styles.ghost;
      default: return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary': return styles.primaryText;
      case 'secondary': return styles.secondaryText;
      case 'outline': return styles.outlineText;
      case 'ghost': return styles.ghostText;
      default: return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        getButtonStyle(),
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.5 },
        style, // Now correctly accepts arrays or single objects
      ]}
    >
      <Text style={[styles.baseText, getTextStyle()]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  baseText: {
    ...TYPOGRAPHY.headline,
    fontWeight: '700',
  },
  primary: { backgroundColor: COLORS.primary },
  primaryText: { color: '#FFFFFF' },
  secondary: { backgroundColor: COLORS.secondary },
  secondaryText: { color: '#FFFFFF' },
  outline: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  outlineText: { color: COLORS.primary },
  ghost: { backgroundColor: 'transparent' },
  ghostText: { color: COLORS.primary },
});