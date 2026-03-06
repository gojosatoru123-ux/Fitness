import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../../store/userStore';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const setProfile = useUserStore((state) => state.setProfile);

  const handleGetStarted = () => {
    // For now, let's just set a dummy profile to enter the app
    setProfile({
      name: 'Anik',
      age: 28,
      gender: 'male',
      height: 180,
      weight: 75,
      activityLevel: 'moderately_active',
      fitnessGoal: 'gain_muscle',
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://cdn.builder.io/api/v1/image/assets%2Fdda1a74a890e4f9781eef9826ba9b8f7%2F4f76a15162214bbea3434f2c82c20b1e' }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text variant="h1" color="#FFFFFF" style={styles.title}>
              Empower Your Fitness {'\n'}
              <Text variant="h1" color={COLORS.primary}>GOALS TODAY!</Text>
            </Text>
            
            <Button
              label="Get Started"
              onPress={handleGetStarted}
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
    paddingBottom: SPACING.xxl * 2,
  },
  content: {
    gap: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    lineHeight: 42,
    marginBottom: SPACING.xl,
  },
  button: {
    height: 64,
  },
});
