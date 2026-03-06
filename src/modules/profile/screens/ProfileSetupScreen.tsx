import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { useUserStore } from '../../../store/userStore';
import { ChevronLeft, Ruler, Weight, User, Calendar } from 'lucide-react-native';

export const ProfileSetupScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const setProfile = useUserStore((state) => state.setProfile);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    height: '',
    weight: '',
    activityLevel: 'moderately_active' as any,
    fitnessGoal: 'lose_weight' as any,
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setProfile({
        name: formData.name || 'User',
        age: parseInt(formData.age) || 25,
        gender: formData.gender,
        height: parseFloat(formData.height) || 175,
        weight: parseFloat(formData.weight) || 70,
        activityLevel: formData.activityLevel,
        fitnessGoal: formData.fitnessGoal,
      });
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text variant="h2" weight="800" style={styles.stepTitle}>Tell us about{'\n'}yourself</Text>
      <Text variant="body" color={COLORS.text.secondary.light} style={styles.stepSubtitle}>
        We need this to calculate your personalized goals.
      </Text>

      <View style={styles.inputGroup}>
        <View style={styles.inputContainer}>
          <User size={20} color={COLORS.primary} />
          <TextInput
            placeholder="Your Name"
            style={styles.input}
            value={formData.name}
            onChangeText={(v) => setFormData({ ...formData, name: v })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Calendar size={20} color={COLORS.primary} />
          <TextInput
            placeholder="Age"
            keyboardType="numeric"
            style={styles.input}
            value={formData.age}
            onChangeText={(v) => setFormData({ ...formData, age: v })}
          />
        </View>

        <View style={styles.genderRow}>
          {['male', 'female', 'other'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.genderBtn,
                formData.gender === g && styles.activeGenderBtn,
              ]}
              onPress={() => setFormData({ ...formData, gender: g as any })}
            >
              <Text
                variant="subheadline"
                weight="700"
                color={formData.gender === g ? '#FFF' : COLORS.text.secondary.light}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text variant="h2" weight="800" style={styles.stepTitle}>What's your{'\n'}body stats?</Text>
      <Text variant="body" color={COLORS.text.secondary.light} style={styles.stepSubtitle}>
        Help us understand your current physique.
      </Text>

      <View style={styles.inputGroup}>
        <View style={styles.inputContainer}>
          <Ruler size={20} color={COLORS.primary} />
          <TextInput
            placeholder="Height (cm)"
            keyboardType="numeric"
            style={styles.input}
            value={formData.height}
            onChangeText={(v) => setFormData({ ...formData, height: v })}
          />
          <Text variant="body" color={COLORS.text.secondary.light}>cm</Text>
        </View>

        <View style={styles.inputContainer}>
          <Weight size={20} color={COLORS.primary} />
          <TextInput
            placeholder="Weight (kg)"
            keyboardType="numeric"
            style={styles.input}
            value={formData.weight}
            onChangeText={(v) => setFormData({ ...formData, weight: v })}
          />
          <Text variant="body" color={COLORS.text.secondary.light}>kg</Text>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text variant="h2" weight="800" style={styles.stepTitle}>Choose your{'\n'}fitness goal</Text>
      <Text variant="body" color={COLORS.text.secondary.light} style={styles.stepSubtitle}>
        We'll tailor your plan to help you reach it.
      </Text>

      <View style={styles.goalGrid}>
        {[
          { id: 'lose_weight', label: 'Lose Weight', icon: '🔥' },
          { id: 'gain_muscle', label: 'Gain Muscle', icon: '💪' },
          { id: 'maintain_weight', label: 'Stay Fit', icon: '🏃' },
          { id: 'improve_endurance', label: 'Endurance', icon: '⚡' },
        ].map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              formData.fitnessGoal === goal.id && styles.activeGoalCard,
            ]}
            onPress={() => setFormData({ ...formData, fitnessGoal: goal.id as any })}
          >
            <Text style={{ fontSize: 32 }}>{goal.icon}</Text>
            <Text
              variant="headline"
              weight="700"
              color={formData.fitnessGoal === goal.id ? '#FFF' : '#1A1C1E'}
              style={{ marginTop: SPACING.s }}
            >
              {goal.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={step === 1 ? onBack : () => setStep(step - 1)}>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={step === 3 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            fullWidth
            style={styles.nextBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
    marginHorizontal: SPACING.l,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 34,
    lineHeight: 40,
    marginBottom: SPACING.s,
  },
  stepSubtitle: {
    marginBottom: SPACING.xxl,
  },
  inputGroup: {
    gap: SPACING.m,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: SPACING.m,
    height: 60,
    borderRadius: BORDER_RADIUS.m,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.s,
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginTop: SPACING.s,
  },
  genderBtn: {
    flex: 1,
    height: 50,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeGenderBtn: {
    backgroundColor: COLORS.primary,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.m,
  },
  goalCard: {
    width: (width - SPACING.xl * 2 - SPACING.m) / 2,
    aspectRatio: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.l,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeGoalCard: {
    backgroundColor: COLORS.primary,
  },
  footer: {
    padding: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 0 : SPACING.xl,
  },
  nextBtn: {
    height: 64,
  },
});
