import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Text } from '../../../components/common/Text';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { useUserStore } from '../../../store/userStore';
import { Calculator, Activity, Zap, Scale } from 'lucide-react-native';

export const CalculatorsScreen: React.FC = () => {
  const { profile } = useUserStore();
  
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  
  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return 0;
    return (w / (h * h)).toFixed(1);
  };

  const calculateBMR = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    if (!w || !h || !a) return 0;
    // Mifflin-St Jeor
    let bmr = 10 * w + 6.25 * h - 5 * a;
    if (profile?.gender === 'male') bmr += 5; else bmr -= 161;
    return Math.round(bmr);
  };

  const bmi = calculateBMI();
  const bmr = calculateBMR();
  const tdee = Math.round(bmr * 1.55); // Assuming moderate activity

  const getBMICategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: COLORS.info };
    if (val < 25) return { label: 'Healthy', color: COLORS.success };
    if (val < 30) return { label: 'Overweight', color: COLORS.warning };
    return { label: 'Obese', color: COLORS.error };
  };

  const bmiCat = getBMICategory(parseFloat(bmi as string));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h2" weight="700">Health Calculators</Text>
          <Text variant="subheadline" color={COLORS.text.secondary.light}>Track your vital metrics</Text>
        </View>

        <Card style={styles.inputCard}>
          <Text variant="headline" weight="700" style={{ marginBottom: SPACING.m }}>Your Stats</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
              <Text variant="caption">Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputBox}>
              <Text variant="caption">Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputBox}>
              <Text variant="caption">Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
          </View>
        </Card>

        <View style={styles.resultsGrid}>
          <Card variant="dark" style={styles.resultCard}>
            <Scale color={COLORS.primary} size={24} />
            <Text variant="h3" color="#FFF" weight="800" style={styles.resultValue}>{bmi}</Text>
            <Text variant="caption" color="rgba(255,255,255,0.6)">BMI (Body Mass Index)</Text>
            <View style={[styles.badge, { backgroundColor: bmiCat.color + '30' }]}>
              <Text variant="caption" color={bmiCat.color} weight="700">{bmiCat.label}</Text>
            </View>
          </Card>

          <Card variant="dark" style={[styles.resultCard, { backgroundColor: '#3A3A3C' }]}>
            <Activity color={COLORS.accent} size={24} />
            <Text variant="h3" color="#FFF" weight="800" style={styles.resultValue}>{bmr}</Text>
            <Text variant="caption" color="rgba(255,255,255,0.6)">BMR (Basal Metabolic Rate)</Text>
            <Text variant="caption" color="#FFF" style={{ marginTop: 4 }}>kcal / day</Text>
          </Card>

          <Card variant="dark" style={[styles.resultCard, { backgroundColor: COLORS.accent }]}>
            <Zap color="#FFF" size={24} />
            <Text variant="h3" color="#FFF" weight="800" style={styles.resultValue}>{tdee}</Text>
            <Text variant="caption" color="rgba(255,255,255,0.8)">TDEE (Daily Energy)</Text>
            <Text variant="caption" color="#FFF" style={{ marginTop: 4 }}>kcal / day</Text>
          </Card>

          <Card variant="dark" style={[styles.resultCard, { backgroundColor: COLORS.primary }]}>
            <Calculator color="#FFF" size={24} />
            <View style={styles.macrosPreview}>
              <Text variant="caption" color="#FFF" weight="700">P: 180g</Text>
              <Text variant="caption" color="#FFF" weight="700">C: 220g</Text>
              <Text variant="caption" color="#FFF" weight="700">F: 70g</Text>
            </View>
            <Text variant="caption" color="rgba(255,255,255,0.8)">Macro Calculator</Text>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text variant="h3" weight="700">More Calculators</Text>
        </View>

        {[
          { label: 'Keto Calculator', desc: 'Optimal fat/carb ratios' },
          { label: 'Ideal Weight', desc: 'Based on height and frame' },
          { label: 'Body Fat %', desc: 'Navy method estimate' },
        ].map((calc, idx) => (
          <TouchableOpacity key={idx}>
            <Card style={styles.calcListItem}>
              <View>
                <Text variant="headline" weight="700">{calc.label}</Text>
                <Text variant="caption" color={COLORS.text.secondary.light}>{calc.desc}</Text>
              </View>
              <View style={styles.arrowBtn}>
                <Calculator size={18} color={COLORS.primary} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  inputCard: {
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.xl,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  inputBox: {
    flex: 1,
  },
  input: {
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: BORDER_RADIUS.m,
    paddingHorizontal: SPACING.s,
    marginTop: 4,
    ...TYPOGRAPHY.headline,
    fontWeight: '700',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.m,
  },
  resultCard: {
    width: (Dimensions.get('window').width - SPACING.m * 3) / 2,
    height: 160,
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 32,
    marginVertical: 4,
  },
  badge: {
    marginTop: SPACING.s,
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: 8,
  },
  macrosPreview: {
    marginVertical: SPACING.s,
    alignItems: 'center',
  },
  sectionHeader: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.m,
  },
  calcListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
    padding: SPACING.l,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
