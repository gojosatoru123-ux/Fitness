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
          <View>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=anik' }}
              style={styles.avatar}
            />
            <Text variant="h2" style={styles.welcomeText}>Hi, {profile?.name || 'Anik'}</Text>
            <Text variant="subheadline" color={COLORS.text.secondary.light}>Your Daily Fitness Goals</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell color={COLORS.text.primary.light} size={24} />
          </TouchableOpacity>
        </View>

        {/* Today's Workout Card */}
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={[COLORS.card.purple, COLORS.card.orange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.workoutCard}
          >
            <View style={styles.workoutInfo}>
              <Text variant="headline" color="#FFFFFF">Today's Workout:</Text>
              <Text variant="h2" color="#FFFFFF" weight="700">Full-Body HIIT</Text>
              <View style={styles.durationRow}>
                <Text variant="h2" color="#FFFFFF" weight="700">30</Text>
                <Text variant="subheadline" color="#FFFFFF" style={{ marginTop: 8, marginLeft: 4 }}>min</Text>
              </View>
              <TouchableOpacity style={styles.startBtn}>
                <Text variant="headline" color="#FFFFFF">Start Workout</Text>
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
          <Card variant="dark" style={[styles.statCard, { backgroundColor: '#3A3A3C' }]}>
            <View style={styles.statHeader}>
              <Text variant="headline" color="#FFFFFF">Steps:</Text>
              <View style={styles.statIconContainer}>
                <Footprints color="#FFFFFF" size={16} />
              </View>
            </View>
            <View style={styles.ringContainer}>
              <ProgressRing
                size={80}
                progress={0.82}
                color="#FFFFFF"
                strokeWidth={8}
                backgroundColor="rgba(255,255,255,0.2)"
              >
                <View style={styles.ringText}>
                  <Text variant="headline" color="#FFFFFF">8.2k</Text>
                  <Text variant="caption" color="rgba(255,255,255,0.6)">10k</Text>
                </View>
              </ProgressRing>
            </View>
          </Card>

          <Card variant="dark" style={[styles.statCard, { backgroundColor: COLORS.primary }]}>
            <View style={styles.statHeader}>
              <Text variant="headline" color="#FFFFFF">Minutes:</Text>
              <View style={styles.statIconContainer}>
                <Clock color="#FFFFFF" size={16} />
              </View>
            </View>
            <View style={styles.minutesContent}>
              <Text variant="h2" color="#FFFFFF" weight="700">127 <Text variant="subheadline" color="#FFFFFF">min</Text></Text>
              <View style={styles.sparkline} /> 
            </View>
          </Card>
        </View>

        {/* Calories Chart */}
        <Card variant="dark" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text variant="headline" color="#FFFFFF">Calories Burned:</Text>
              <Text variant="h3" color="#FFFFFF" weight="700">450 <Text variant="subheadline" color="#FFFFFF">kcal</Text></Text>
            </View>
            <View style={styles.chartIcon}>
              <Flame color={COLORS.primary} size={20} fill={COLORS.primary} />
            </View>
          </View>
          
          <View style={styles.barsContainer}>
            {[30, 50, 40, 60, 45, 80, 55].map((val, idx) => (
              <View key={idx} style={styles.barWrapper}>
                <View style={[styles.bar, { height: val, backgroundColor: idx === 5 ? COLORS.primary : '#2C2C2E' }]} />
                <Text variant="caption" color="#8E8E93" style={{ marginTop: 8 }}>
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
    backgroundColor: '#F5F5F7',
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: SPACING.s,
  },
  welcomeText: {
    ...TYPOGRAPHY.h2,
    fontWeight: '800',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  workoutCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 180,
    marginBottom: SPACING.l,
  },
  workoutInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.m,
    alignSelf: 'flex-start',
  },
  workoutIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
    right: 10,
    bottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  statCard: {
    flex: 1,
    height: 180,
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
    marginTop: SPACING.s,
  },
  ringText: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  minutesContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.s,
  },
  sparkline: {
    height: 40,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BORDER_RADIUS.s,
    marginTop: SPACING.s,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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
    height: 100,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: 16,
    borderRadius: 8,
  },
});
