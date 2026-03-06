import { Dumbbell, Heart, Play, User, Zap, Plus, X, Search, Check, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Text } from '../../../components/common/Text';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '../../../constants/theme';
import { useHealthStore, WorkoutEntry } from '../../../store/healthStore';
import { searchExercises, Exercise } from '../../../services/workoutService';

// 2. Define the width constant for the grid calculation
const { width } = Dimensions.get('window');

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
  const [activeWorkout, setActiveWorkout] = useState<Partial<WorkoutEntry> | null>(null);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  const { addWorkout } = useHealthStore();

  const handleStartWorkout = (program?: any) => {
    setActiveWorkout({
      id: Math.random().toString(),
      date: new Date().toISOString(),
      name: program?.name || 'Custom Workout',
      category: (program?.category || 'strength') as any,
      exercises: [],
    });
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setLoading(true);
      const results = await searchExercises(query);
      setSearchResults(results);
      setLoading(false);
    } else {
      setSearchResults([]);
    }
  };

  const addExerciseToWorkout = (ex: Exercise) => {
    if (activeWorkout) {
      setActiveWorkout({
        ...activeWorkout,
        exercises: [
          ...(activeWorkout.exercises || []),
          { name: ex.name, sets: 3, reps: 10, weight: 0 },
        ],
      });
      setShowExerciseSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const updateSet = (index: number, field: string, value: string) => {
    if (activeWorkout && activeWorkout.exercises) {
      const newExercises = [...activeWorkout.exercises];
      newExercises[index] = { ...newExercises[index], [field]: parseInt(value) || 0 };
      setActiveWorkout({ ...activeWorkout, exercises: newExercises });
    }
  };

  const removeExercise = (index: number) => {
    if (activeWorkout && activeWorkout.exercises) {
      const newExercises = activeWorkout.exercises.filter((_, i) => i !== index);
      setActiveWorkout({ ...activeWorkout, exercises: newExercises });
    }
  };

  const handleFinishWorkout = () => {
    if (activeWorkout && activeWorkout.exercises && activeWorkout.exercises.length > 0) {
      addWorkout(activeWorkout as WorkoutEntry);
      setActiveWorkout(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h2" weight="700">Workouts</Text>
          <Text variant="subheadline" color={COLORS.text.secondary.light}>Find the perfect plan for you</Text>
        </View>

        {activeWorkout ? (
          <View style={styles.activeWorkoutContainer}>
            <Card variant="dark" style={styles.activeWorkoutCard}>
              <View style={styles.activeHeader}>
                <Text variant="h3" color="#FFF" weight="800">{activeWorkout.name}</Text>
                <TouchableOpacity onPress={() => setActiveWorkout(null)}>
                  <X color="#FFF" size={24} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 400 }}>
                {activeWorkout.exercises?.map((ex, idx) => (
                  <View key={idx} style={styles.exerciseLogItem}>
                    <View style={styles.exLogHeader}>
                      <Text variant="headline" color="#FFF" weight="700">{ex.name}</Text>
                      <TouchableOpacity onPress={() => removeExercise(idx)}>
                        <Trash2 color="rgba(255,255,255,0.4)" size={18} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.setsRow}>
                      <View style={styles.setInputBox}>
                        <Text variant="caption" color="rgba(255,255,255,0.6)">Sets</Text>
                        <TextInput
                          style={styles.setInput}
                          keyboardType="numeric"
                          value={ex.sets.toString()}
                          onChangeText={(v) => updateSet(idx, 'sets', v)}
                        />
                      </View>
                      <View style={styles.setInputBox}>
                        <Text variant="caption" color="rgba(255,255,255,0.6)">Reps</Text>
                        <TextInput
                          style={styles.setInput}
                          keyboardType="numeric"
                          value={ex.reps.toString()}
                          onChangeText={(v) => updateSet(idx, 'reps', v)}
                        />
                      </View>
                      <View style={styles.setInputBox}>
                        <Text variant="caption" color="rgba(255,255,255,0.6)">Weight (kg)</Text>
                        <TextInput
                          style={styles.setInput}
                          keyboardType="numeric"
                          value={ex.weight.toString()}
                          onChangeText={(v) => updateSet(idx, 'weight', v)}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.addExBtn}
                onPress={() => setShowExerciseSearch(true)}
              >
                <Plus color={COLORS.primary} size={20} />
                <Text variant="headline" color={COLORS.primary} weight="700" style={{ marginLeft: 8 }}>Add Exercise</Text>
              </TouchableOpacity>

              <Button
                label="Finish Workout"
                onPress={handleFinishWorkout}
                style={styles.finishBtn}
              />
            </Card>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.customWorkoutBtn} onPress={() => handleStartWorkout()}>
              <Plus color="#FFF" size={24} />
              <Text variant="headline" color="#FFF" weight="700" style={{ marginLeft: 8 }}>Log a Custom Workout</Text>
            </TouchableOpacity>

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
                <TouchableOpacity
                  key={program.id}
                  activeOpacity={0.9}
                  style={styles.programCard}
                  onPress={() => handleStartWorkout(program)}
                >
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
          </>
        )}
      </ScrollView>

      {/* Exercise Search Modal */}
      <Modal visible={showExerciseSearch} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowExerciseSearch(false)}>
              <X color="#000" size={24} />
            </TouchableOpacity>
            <Text variant="h3" weight="700">Add Exercise</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchBar}>
            <Search color="#8E8E93" size={20} />
            <TextInput
              placeholder="Search exercises..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: SPACING.m }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => addExerciseToWorkout(item)}
              >
                <View style={styles.resultIcon}>
                  <Image source={{ uri: item.image }} style={{ width: 24, height: 24 }} />
                </View>
                <View>
                  <Text variant="headline" weight="600">{item.name}</Text>
                  <Text variant="caption" color={COLORS.text.secondary.light}>{item.category} • {item.muscles.join(', ')}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <Plus color={COLORS.primary} size={20} />
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
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
  customWorkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    margin: SPACING.m,
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
  },
  activeWorkoutContainer: {
    padding: SPACING.m,
  },
  activeWorkoutCard: {
    backgroundColor: '#000',
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.xl,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  exerciseLogItem: {
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  exLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  setsRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  setInputBox: {
    flex: 1,
  },
  setInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BORDER_RADIUS.m,
    color: '#FFF',
    height: 44,
    textAlign: 'center',
    marginTop: 4,
    ...TYPOGRAPHY.headline,
  },
  addExBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.xl,
    marginVertical: SPACING.xl,
  },
  finishBtn: {
    height: 60,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    margin: SPACING.m,
    paddingHorizontal: SPACING.m,
    height: 48,
    borderRadius: BORDER_RADIUS.m,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.s,
    ...TYPOGRAPHY.body,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  catCard: {
    // 3. The logic now works because 'width' is defined at the top
    width: (width - SPACING.m * 3) / 2, 
    height: 100,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m, // Added to prevent cards touching vertically
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
