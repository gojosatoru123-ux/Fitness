import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
// Use the modern SafeAreaView to fix the deprecation warning
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { ProgressRing } from '../../../components/common/ProgressRing';
import { Text } from '../../../components/common/Text';
import { BORDER_RADIUS, COLORS, SPACING } from '../../../constants/theme';
// Added Droplet to the imports to fix the ReferenceError
import { ChevronLeft, Droplet, Flame, Plus, TrendingUp, BarChart } from 'lucide-react-native';
import { CartesianChart, Bar, Line, useChartPressState } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';
import { useHealthStore } from '../../../store/healthStore';

const { width } = Dimensions.get('window');

export const ProgressScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('30 days');
  const tabs = ['07 days', '30 days', '90 days'];

  const { foodEntries, activityEntries } = useHealthStore();

  const weightData = [
    { day: 'Mon', weight: 76.2 },
    { day: 'Tue', weight: 75.8 },
    { day: 'Wed', weight: 75.9 },
    { day: 'Thu', weight: 75.5 },
    { day: 'Fri', weight: 75.6 },
    { day: 'Sat', weight: 75.4 },
    { day: 'Sun', weight: 75.4 },
  ];

  const calorieData = [
    { day: 'Mon', cal: 2100 },
    { day: 'Tue', cal: 2350 },
    { day: 'Wed', cal: 1900 },
    { day: 'Thu', cal: 2500 },
    { day: 'Fri', cal: 2200 },
    { day: 'Sat', cal: 2800 },
    { day: 'Sun', cal: 2400 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <ChevronLeft color="#000" size={24} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text variant="h2" weight="800">Progress</Text>
            <Text variant="subheadline" color={COLORS.text.secondary.light}>See how far you've come.</Text>
          </View>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: COLORS.primary, borderWidth: 0 }]}>
            <Plus color="#FFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Calories Burned Section */}
        <View style={styles.caloriesSection}>
          <Text variant="headline" weight="700" style={styles.sectionTitle}>Calories Burned:</Text>

          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  variant="caption"
                  color={activeTab === tab ? '#FFFFFF' : '#FFB18B'}
                  weight={activeTab === tab ? '700' : '400'}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.mainProgressContainer}>
            <ProgressRing
              size={240}
              strokeWidth={24}
              progress={0.75}
              color={COLORS.accent}
              backgroundColor="#E5E5EA"
            >
              <View style={styles.mainRingContent}>
                <View style={styles.flameIcon}>
                  <Flame color={COLORS.primary} size={24} fill={COLORS.primary} />
                </View>
                <Text style={styles.calorieValue}>7563</Text>
                <Text style={styles.calorieUnit}>kcal</Text>
              </View>
            </ProgressRing>
          </View>
        </View>

        {/* Charts Section */}
        <View style={styles.chartsWrapper}>
          <Text variant="h3" weight="700" style={styles.sectionTitle}>Weekly Insights</Text>

          <Card style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <TrendingUp color={COLORS.primary} size={20} />
              <Text variant="headline" weight="700" style={{ marginLeft: 8 }}>Weight Change</Text>
            </View>
            <View style={styles.chartPlaceholder}>
               {/* Simplified bar chart using Views for robustness if victory-native fails on skia init */}
               <View style={styles.barsRow}>
                {weightData.map((d, i) => (
                  <View key={i} style={styles.barItem}>
                    <View style={[styles.barFill, { height: d.weight - 70, backgroundColor: COLORS.primary }]} />
                    <Text variant="caption" style={{ marginTop: 4 }}>{d.day}</Text>
                  </View>
                ))}
               </View>
            </View>
          </Card>

          <Card style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <BarChart color={COLORS.accent} size={20} />
              <Text variant="headline" weight="700" style={{ marginLeft: 8 }}>Calorie Intake</Text>
            </View>
            <View style={styles.chartPlaceholder}>
              <View style={styles.barsRow}>
                {calorieData.map((d, i) => (
                  <View key={i} style={styles.barItem}>
                    <View style={[styles.barFill, { height: d.cal / 40, backgroundColor: COLORS.accent }]} />
                    <Text variant="caption" style={{ marginTop: 4 }}>{d.day}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>

        {/* Stats Summary Row */}
        <View style={styles.statsSummaryRow}>
          <View style={styles.statSummaryItem}>
            <ProgressRing
              size={130}
              strokeWidth={14}
              progress={0.8}
              color="#3A3A3C"
              backgroundColor="#E5E5EA"
            >
              <View style={styles.summaryItemContent}>
                <Text style={styles.summaryValue}>23k</Text>
                <Text style={styles.summaryLabel}>Steps</Text>
              </View>
            </ProgressRing>
          </View>

          <View style={styles.statSummaryItem}>
            <ProgressRing
              size={130}
              strokeWidth={14}
              progress={0.65}
              color="#3A3A3C"
              backgroundColor="#E5E5EA"
            >
              <View style={styles.summaryItemContent}>
                <Text style={styles.summaryValue}>69h</Text>
                <Text style={styles.summaryLabel}>Workout</Text>
              </View>
            </ProgressRing>
          </View>
        </View>

        {/* Body Metrics */}
        <View style={styles.metricsHeader}>
          <Text variant="h3" weight="700">Body Metrics</Text>
          <TouchableOpacity style={styles.logBtn}>
            <Text variant="body" color={COLORS.primary}>Log Metrics</Text>
          </TouchableOpacity>
        </View>

        <Card variant="dark" style={styles.metricsCard}>
          <View style={styles.metricRow}>
            <View>
              <Text variant="headline" color="#FFF">Body Fat %</Text>
              <Text variant="h2" color="#FFF" weight="700">18.2 <Text variant="subheadline" color="#FFF">%</Text></Text>
            </View>
            <View style={[styles.trendIcon, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
              <Text variant="caption" color={COLORS.success} weight="700">-0.5% this month</Text>
            </View>
          </View>
          <View style={[styles.metricRow, { marginTop: SPACING.l }]}>
            <View>
              <Text variant="headline" color="#FFF">Waist</Text>
              <Text variant="h2" color="#FFF" weight="700">82.5 <Text variant="subheadline" color="#FFF">cm</Text></Text>
            </View>
            <View style={[styles.trendIcon, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
              <Text variant="caption" color={COLORS.success} weight="700">-1cm this week</Text>
            </View>
          </View>
        </Card>

        {/* Smart Insights */}
        <View style={styles.insightsSection}>
          <Text variant="h3" weight="700" style={styles.sectionTitle}>Smart Insights</Text>
          <Card style={styles.insightCard}>
            <View style={styles.insightRow}>
              <View style={[styles.insightIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Flame color={COLORS.primary} size={20} />
              </View>
              <View style={styles.insightText}>
                <Text variant="headline" weight="700">You're on fire!</Text>
                <Text variant="caption" color={COLORS.text.secondary.light}>You've met your calorie goal 5 days in a row.</Text>
              </View>
            </View>
          </Card>
          <Card style={styles.insightCard}>
            <View style={styles.insightRow}>
              <View style={[styles.insightIcon, { backgroundColor: COLORS.accent + '20' }]}>
                <Droplet color={COLORS.accent} size={20} />
              </View>
              <View style={styles.insightText}>
                <Text variant="headline" weight="700">Drink more water</Text>
                <Text variant="caption" color={COLORS.text.secondary.light}>You are 500ml below your daily target.</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            label="Set New Goal"
            onPress={() => {}}
            style={styles.actionBtn}
          />
          <Button
            label="Share Progress"
            onPress={() => {}}
            variant="secondary"
            style={[styles.actionBtn, { backgroundColor: COLORS.accent }]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.xl,
  },
  tab: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.m,
    borderWidth: 1,
    borderColor: '#FFB18B',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  caloriesSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.m,
  },
  mainProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mainRingContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flameIcon: {
    marginBottom: SPACING.s,
  },
  calorieValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  calorieUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  statsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.l,
    marginBottom: SPACING.xl * 2,
  },
  statSummaryItem: {
    alignItems: 'center',
  },
  summaryItemContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1C1E',
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.text.secondary.light,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  actionBtn: {
    flex: 1,
    height: 60,
    borderRadius: BORDER_RADIUS.xl,
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.m,
  },
  logBtn: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: '#F2F2F7',
  },
  metricsCard: {
    backgroundColor: COLORS.card.darkGrey,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendIcon: {
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 8,
  },
  insightsSection: {
    marginBottom: SPACING.xl,
  },
  insightCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.m,
    marginBottom: SPACING.s,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
  },
  chartsWrapper: {
    marginBottom: SPACING.xl,
  },
  chartContainer: {
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.m,
    backgroundColor: '#F2F2F7',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  chartPlaceholder: {
    height: 120,
    justifyContent: 'flex-end',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: SPACING.s,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  barFill: {
    width: 12,
    borderRadius: 6,
  },
});
