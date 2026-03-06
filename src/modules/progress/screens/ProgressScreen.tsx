import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { ProgressRing } from '../../../components/common/ProgressRing';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { ChevronLeft, Plus, Flame } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const ProgressScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('30 days');
  const tabs = ['07 days', '30 days', '90 days'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <ChevronLeft color="#000" size={24} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text variant="h2" weight="700">Progress</Text>
            <Text variant="subheadline" color={COLORS.text.secondary.light}>See how far you've come.</Text>
          </View>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: COLORS.primary }]}>
            <Plus color="#FFF" size={24} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
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
                variant="subheadline"
                color={activeTab === tab ? '#FFFFFF' : COLORS.primary}
                weight={activeTab === tab ? '600' : '400'}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calories Burned Summary */}
        <View style={styles.caloriesSection}>
          <Text variant="headline" weight="700" style={styles.sectionTitle}>Calories Burned:</Text>
          <View style={styles.mainProgressContainer}>
            <ProgressRing
              size={240}
              strokeWidth={20}
              progress={0.75}
              color={COLORS.accent}
              backgroundColor="#E5E5EA"
            >
              <View style={styles.mainRingContent}>
                <View style={styles.flameIcon}>
                  <Flame color={COLORS.primary} size={24} fill={COLORS.primary} />
                </View>
                <Text variant="h1" weight="800" style={styles.calorieValue}>7563</Text>
                <Text variant="subheadline" color={COLORS.text.secondary.light}>kcal</Text>
              </View>
            </ProgressRing>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsSummaryRow}>
          <View style={styles.statSummaryItem}>
            <ProgressRing
              size={120}
              strokeWidth={12}
              progress={0.8}
              color="#3A3A3C"
              backgroundColor="#E5E5EA"
            >
              <View style={styles.summaryItemContent}>
                <Text variant="h3" weight="700">23k</Text>
                <Text variant="caption" color={COLORS.text.secondary.light}>Steps</Text>
              </View>
            </ProgressRing>
          </View>

          <View style={styles.statSummaryItem}>
            <ProgressRing
              size={120}
              strokeWidth={12}
              progress={0.65}
              color="#3A3A3C"
              backgroundColor="#E5E5EA"
            >
              <View style={styles.summaryItemContent}>
                <Text variant="h3" weight="700">69h</Text>
                <Text variant="caption" color={COLORS.text.secondary.light}>Workout</Text>
              </View>
            </ProgressRing>
          </View>
        </View>

        {/* Body Metrics */}
        <View style={styles.metricsHeader}>
          <Text variant="h3" weight="700">Body Metrics</Text>
          <TouchableOpacity style={styles.logBtn}>
            <Text variant="body" color={COLORS.primary}>Log Weight</Text>
          </TouchableOpacity>
        </View>

        <Card variant="dark" style={styles.metricsCard}>
          <View style={styles.metricRow}>
            <View>
              <Text variant="headline" color="#FFF">Weight</Text>
              <Text variant="h2" color="#FFF" weight="700">75.4 <Text variant="subheadline" color="#FFF">kg</Text></Text>
            </View>
            <View style={styles.trendIcon}>
              <Text variant="caption" color={COLORS.success}>-0.2 kg this week</Text>
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
                <Text variant="headline" weight="600">You're on fire!</Text>
                <Text variant="subheadline" color={COLORS.text.secondary.light}>You've met your calorie goal 5 days in a row.</Text>
              </View>
            </View>
          </Card>
          <Card style={styles.insightCard}>
            <View style={styles.insightRow}>
              <View style={[styles.insightIcon, { backgroundColor: COLORS.accent + '20' }]}>
                <Droplet color={COLORS.accent} size={20} />
              </View>
              <View style={styles.insightText}>
                <Text variant="headline" weight="600">Drink more water</Text>
                <Text variant="subheadline" color={COLORS.text.secondary.light}>You are 500ml below your daily target.</Text>
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
    borderWidth: 1,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F7',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.s,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  caloriesSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.l,
  },
  mainProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mainRingContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  flameIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  calorieValue: {
    fontSize: 48,
    lineHeight: 56,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  statSummaryItem: {
    alignItems: 'center',
  },
  summaryItemContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  actionBtn: {
    flex: 1,
    height: 56,
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
    backgroundColor: '#3A3A3C',
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
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 8,
  },
  insightsSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  insightCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    shadowOpacity: 0,
    elevation: 0,
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
});
