import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../../store/userStore';

import { ProfileSetupScreen } from './ProfileSetupScreen';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const [showSetup, setShowSetup] = React.useState(false);
  const setProfile = useUserStore((state) => state.setProfile);

  if (showSetup) {
    return <ProfileSetupScreen onBack={() => setShowSetup(false)} />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://cdn.builder.io/api/v1/image/assets%2Fdda1a74a890e4f9781eef9826ba9b8f7%2F3a90ede8a5564cecb05cff2f998a5cf1?format=webp&width=800&height=1200' }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text variant="h1" color="#FFFFFF" weight="800" style={styles.titleLine1}>
                Empower
              </Text>
              <Text variant="h1" color="#FFFFFF" weight="800" style={styles.titleLine2}>
                Your Fitness
              </Text>
              <Text style={styles.titleAccent}>
                GOALS TODAY!
              </Text>
            </View>

            <Button
              label="Get Started"
              onPress={() => setShowSetup(true)}
              fullWidth
              style={styles.button}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl * 2.5,
  },
  content: {
    gap: SPACING.xl,
  },
  textContainer: {
    marginBottom: SPACING.xl,
  },
  titleLine1: {
    fontSize: 42,
    lineHeight: 48,
  },
  titleLine2: {
    fontSize: 42,
    lineHeight: 48,
  },
  titleAccent: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '900',
    color: '#00F2B0', // Teal color from design text
    fontStyle: 'italic',
  },
  button: {
    height: 64,
    backgroundColor: COLORS.primary,
  },
});
