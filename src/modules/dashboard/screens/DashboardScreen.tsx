import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Text } from '../../../components/common/Text';
import { Card } from '../../../components/common/Card';
import { ProgressRing } from '../../../components/common/ProgressRing';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { useUserStore } from '../../../store/userStore';
import { Bell, Play, Footprints, Clock, Flame, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export const DashboardScreen: React.FC = () => {
  const profile = useUserStore((state) => state.profile);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=anik' }}
              style={styles.avatar}
            />
            <View style={styles.headerText}>
              <Text variant="h2" weight="800" style={styles.welcomeText}>Hi, {profile?.name || 'Anik'}</Text>
              <Text variant="subheadline" color={COLORS.text.secondary.light}>Your Daily Fitness Goals</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell color="#000" size={24} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Today's Workout Card */}
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={[COLORS.card.purple, COLORS.card.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.workoutCard}
          >
            <View style={styles.workoutInfo}>
              <Text variant="headline" color="#FFFFFF" weight="600">Today's Workout:</Text>
              <Text variant="subheadline" color="rgba(255,255,255,0.8)">Full-Body HIIT</Text>
              <View style={styles.durationRow}>
                <Text style={styles.durationValue}>30</Text>
                <Text style={styles.durationUnit}>min</Text>
              </View>
              <TouchableOpacity style={styles.startBtn}>
                <Text variant="subheadline" color="#FFFFFF" weight="600">Start Workout</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/hourglass-5254580-4385904.png' }}
              style={styles.workoutIcon}
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card variant="grey" style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text variant="headline" color="#FFFFFF" weight="600">Steps:</Text>
              <View style={styles.statIconContainer}>
                <Footprints color="#FFFFFF" size={16} />
              </View>
            </View>
            <View style={styles.ringContainer}>
              <ProgressRing
                size={90}
                progress={0.82}
                color="#FFFFFF"
                strokeWidth={10}
                backgroundColor="rgba(255,255,255,0.15)"
              >
                <View style={styles.ringText}>
                  <Text variant="headline" color="#FFFFFF" weight="800">8.2k</Text>
                  <Text variant="caption" color="rgba(255,255,255,0.6)">10k</Text>
                </View>
              </ProgressRing>
            </View>
          </Card>

          <Card variant="orange" style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text variant="headline" color="#FFFFFF" weight="600">Minutes:</Text>
              <View style={styles.statIconContainer}>
                <Clock color="#FFFFFF" size={16} />
              </View>
            </View>
            <View style={styles.minutesContent}>
              <View style={styles.minutesValueRow}>
                <Text style={styles.minutesValue}>127</Text>
                <Text style={styles.minutesUnit}>min</Text>
              </View>
              <View style={styles.sparklineContainer}>
                {/* Mock Sparkline */}
                <View style={styles.sparkline} />
              </View>
            </View>
          </Card>
        </View>

        {/* Calories Chart */}
        <Card variant="dark" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text variant="headline" color="#FFFFFF" weight="600">Calories Burned:</Text>
              <View style={styles.caloriesValueRow}>
                <Text style={styles.caloriesValue}>450</Text>
                <Text style={styles.caloriesUnit}>kcal</Text>
              </View>
            </View>
            <View style={styles.chartIcon}>
              <Flame color={COLORS.primary} size={20} fill={COLORS.primary} />
            </View>
          </View>

          <View style={styles.barsContainer}>
            {[20, 35, 30, 45, 35, 70, 40].map((val, idx) => (
              <View key={idx} style={styles.barWrapper}>
                <View style={[styles.bar, { height: val, backgroundColor: idx === 5 ? COLORS.primary : '#2C2C2E' }]} />
                <Text variant="caption" color="#8E8E93" style={{ marginTop: 8, fontSize: 10 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </Text>
              </View>
            ))}
          </View>
        </Card>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.s,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SPACING.m,
  },
  headerText: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    lineHeight: 28,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: '#F2F2F7',
  },
  workoutCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 190,
    marginBottom: SPACING.l,
    overflow: 'hidden',
  },
  workoutInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: -SPACING.s,
  },
  durationValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  durationUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    alignSelf: 'flex-start',
  },
  workoutIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    position: 'absolute',
    right: -10,
    bottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  statCard: {
    flex: 1,
    height: 200,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.xl,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  minutesContent: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: SPACING.m,
  },
  minutesValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  minutesValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  minutesUnit: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  sparklineContainer: {
    height: 40,
    justifyContent: 'center',
  },
  sparkline: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  chartCard: {
    backgroundColor: '#000000',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  caloriesValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACING.xs,
  },
  caloriesValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  caloriesUnit: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  chartIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
});
