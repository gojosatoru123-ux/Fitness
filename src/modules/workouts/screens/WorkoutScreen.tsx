import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import { Text } from '../../../components/common/Text';
import { Card } from '../../../components/common/Card';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { Dumbbell, Heart, Zap, User, ChevronRight, Play } from 'lucide-react-native';

const categories = [
  { id: 'strength', name: 'Strength', icon: Dumbbell, color: '#A081FF' },
  { id: 'cardio', name: 'Cardio', icon: Heart, color: '#FF7F3F' },
  { id: 'yoga', name: 'Yoga', icon: User, color: '#34C759' },
  { id: 'hiit', name: 'HIIT', icon: Zap, color: '#FF3B30' },
];

const programs = [
  {
    id: 'p1',
    name: 'Beginner Full Body',
    duration: '4 weeks',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
  },
  {
    id: 'p2',
    name: 'Fat Burn HIIT',
    duration: '2 weeks',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1518611012118-29a87d3ded9c?w=800',
  },
  {
    id: 'p3',
    name: 'Muscle Build Pro',
    duration: '8 weeks',
    difficulty: 'Advanced',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  },
];

const exercises = [
  {
    name: 'Push-Up',
    target: 'Chest, Triceps, Core',
    instructions: ['Start in plank', 'Lower body', 'Push up'],
    image: 'https://cdn-icons-png.flaticon.com/512/2548/2548537.png',
  },
  {
    name: 'Squat',
    target: 'Quads, Glutes, Core',
    instructions: ['Stand shoulder-width', 'Lower hips', 'Return to start'],
    image: 'https://cdn-icons-png.flaticon.com/512/2548/2548532.png',
  },
];

export const WorkoutScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h2" weight="700">Workouts</Text>
          <Text variant="subheadline" color={COLORS.text.secondary.light}>Find the perfect plan for you</Text>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={[styles.catCard, { backgroundColor: cat.color + '20' }]}>
              <cat.icon color={cat.color} size={32} />
              <Text variant="headline" weight="600" style={{ marginTop: SPACING.s, color: cat.color }}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Programs */}
        <View style={styles.sectionHeader}>
          <Text variant="h3" weight="700">Featured Programs</Text>
          <TouchableOpacity><Text variant="body" color={COLORS.primary}>See all</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.programsScroll}>
          {programs.map((program) => (
            <TouchableOpacity key={program.id} activeOpacity={0.9} style={styles.programCard}>
              <Image source={{ uri: program.image }} style={styles.programImage} />
              <View style={styles.programOverlay}>
                <View style={styles.badge}><Text variant="caption" color="#FFF">{program.difficulty}</Text></View>
                <View>
                  <Text variant="headline" color="#FFF" weight="700">{program.name}</Text>
                  <Text variant="caption" color="rgba(255,255,255,0.8)">{program.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exercise Database */}
        <View style={styles.sectionHeader}>
          <Text variant="h3" weight="700">Exercise Database</Text>
        </View>
        
        {exercises.map((ex, idx) => (
          <Card key={idx} style={styles.exCard}>
            <View style={styles.exInfo}>
              <View>
                <Text variant="headline" weight="600">{ex.name}</Text>
                <Text variant="caption" color={COLORS.text.secondary.light}>{ex.target}</Text>
              </View>
              <TouchableOpacity style={styles.playBtn}>
                <Play color="#FFF" size={16} fill="#FFF" />
              </TouchableOpacity>
            </View>
          </Card>
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
    paddingBottom: 100,
  },
  header: {
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  catCard: {
    width: (width - SPACING.m * 3) / 2,
    height: 100,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    marginTop: SPACING.xl,
    marginBottom: SPACING.m,
  },
  programsScroll: {
    paddingLeft: SPACING.m,
  },
  programCard: {
    width: 280,
    height: 180,
    marginRight: SPACING.m,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  programImage: {
    width: '100%',
    height: '100%',
  },
  programOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: SPACING.m,
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.s,
  },
  exCard: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.s,
  },
  exInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
