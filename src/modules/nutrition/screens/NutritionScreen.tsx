import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, FlatList } from 'react-native';
import { Text } from '../../../components/common/Text';
import { Card } from '../../../components/common/Card';
import { ProgressRing } from '../../../components/common/ProgressRing';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { Plus, Search, ChevronRight, X, Coffee, Utensils, Moon, Candy, Droplet } from 'lucide-react-native';
import { useHealthStore, FoodEntry, WaterEntry } from '../../../store/healthStore';
import { useUserStore } from '../../../store/userStore';
import { searchFood, FoodItem } from '../../../services/nutritionService';

export const NutritionScreen: React.FC = () => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeMealType, setActiveMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { foodEntries, waterEntries, addFood, addWater, getDailyCalories, getDailyMacros, getDailyWater } = useHealthStore();
  const { getCalorieGoal } = useUserStore();

  const today = new Date().toISOString().split('T')[0];
  const caloriesConsumed = getDailyCalories(today);
  const calorieGoal = Math.round(getCalorieGoal() || 2500);
  const remainingCalories = Math.max(0, calorieGoal - caloriesConsumed);
  const macros = getDailyMacros(today);
  const waterIntake = getDailyWater(today);
  const waterGoal = 2500; // ml

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setLoading(true);
      const results = await searchFood(query);
      setSearchResults(results);
      setLoading(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFood = (food: FoodItem) => {
    const newEntry: FoodEntry = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      name: food.name,
      type: activeMealType,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      quantity: food.servingSize || '1 serving',
    };
    addFood(newEntry);
    setSearchModalVisible(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddWater = (amount: number) => {
    const newEntry: WaterEntry = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      amount,
    };
    addWater(newEntry);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h2" weight="700">Nutrition</Text>
          <Text variant="subheadline" color={COLORS.text.secondary.light}>Track your meals and macros</Text>
        </View>

        {/* Calorie Progress Card */}
        <Card variant="dark" style={styles.calorieCard}>
          <View style={styles.calorieStats}>
            <View style={styles.statBox}>
              <Text variant="h2" color="#FFF" weight="700">{calorieGoal}</Text>
              <Text variant="caption" color="rgba(255,255,255,0.6)">Goal</Text>
            </View>
            <View style={styles.statBox}>
              <Text variant="h2" color="#FFF" weight="700">-</Text>
            </View>
            <View style={styles.statBox}>
              <Text variant="h2" color="#FFF" weight="700">{caloriesConsumed}</Text>
              <Text variant="caption" color="rgba(255,255,255,0.6)">Food</Text>
            </View>
            <View style={styles.statBox}>
              <Text variant="h2" color="#FFF" weight="700">=</Text>
            </View>
            <View style={styles.statBox}>
              <Text variant="h2" color={COLORS.primary} weight="700">{remainingCalories}</Text>
              <Text variant="caption" color="rgba(255,255,255,0.6)">Remaining</Text>
            </View>
          </View>
          
          {/* Macro Progress */}
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text variant="caption" color="#FFF">Carbs</Text>
              <View style={styles.macroProgressBg}>
                <View style={[styles.macroProgress, { width: '40%', backgroundColor: '#5856D6' }]} />
              </View>
              <Text variant="caption" color="#FFF">{macros.carbs}g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text variant="caption" color="#FFF">Protein</Text>
              <View style={styles.macroProgressBg}>
                <View style={[styles.macroProgress, { width: '30%', backgroundColor: COLORS.primary }]} />
              </View>
              <Text variant="caption" color="#FFF">{macros.protein}g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text variant="caption" color="#FFF">Fat</Text>
              <View style={styles.macroProgressBg}>
                <View style={[styles.macroProgress, { width: '20%', backgroundColor: COLORS.accent }]} />
              </View>
              <Text variant="caption" color="#FFF">{macros.fat}g</Text>
            </View>
          </View>
        </Card>

          {/* Water Tracking Card */}
          <Card style={styles.waterCard}>
            <View style={styles.waterHeader}>
              <View style={styles.mealTitleRow}>
                <Droplet color={COLORS.accent} size={20} />
                <Text variant="headline" weight="600" style={{ marginLeft: SPACING.s }}>Water Intake</Text>
              </View>
              <Text variant="headline" weight="700" color={COLORS.accent}>{waterIntake} <Text variant="caption">/ {waterGoal} ml</Text></Text>
            </View>
            <View style={styles.waterButtons}>
              <TouchableOpacity onPress={() => handleAddWater(250)} style={styles.waterBtn}>
                <Text variant="subheadline" weight="700">+250ml</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddWater(500)} style={styles.waterBtn}>
                <Text variant="subheadline" weight="700">+500ml</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddWater(1000)} style={[styles.waterBtn, { backgroundColor: COLORS.accent }]}>
                <Text variant="subheadline" weight="700" color="#FFF">+1L</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.waterProgressBg}>
              <View style={[styles.waterProgress, { width: `${Math.min(100, (waterIntake / waterGoal) * 100)}%` }]} />
            </View>
          </Card>

        {/* Meal Sections */}
        {mealTypes.map((meal) => (
          <Card key={meal.id} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <View style={styles.mealTitleRow}>
                <meal.icon color={COLORS.primary} size={20} />
                <Text variant="headline" weight="600" style={{ marginLeft: SPACING.s }}>{meal.label}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setActiveMealType(meal.id as any);
                  setSearchModalVisible(true);
                }}
                style={styles.addFoodBtn}
              >
                <Plus color={COLORS.primary} size={20} />
              </TouchableOpacity>
            </View>
            
            {foodEntries
              .filter(e => e.type === meal.id && e.date.startsWith(today))
              .map((entry) => (
                <View key={entry.id} style={styles.foodEntry}>
                  <View>
                    <Text variant="body" weight="600">{entry.name}</Text>
                    <Text variant="caption" color={COLORS.text.secondary.light}>{entry.quantity}</Text>
                  </View>
                  <Text variant="body" weight="600">{entry.calories} kcal</Text>
                </View>
              ))}
          </Card>
        ))}
      </ScrollView>

      {/* Search Modal */}
      <Modal visible={searchModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
              <X color="#000" size={24} />
            </TouchableOpacity>
            <Text variant="h3" weight="700">Add Food</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchBar}>
            <Search color="#8E8E93" size={20} />
            <TextInput
              placeholder="Search for food..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>

          {loading && (
            <View style={{ padding: SPACING.m, alignItems: 'center' }}>
              <Text variant="body" color={COLORS.text.secondary.light}>Searching...</Text>
            </View>
          )}

          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.resultsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleAddFood(item)}
              >
                <View>
                  <Text variant="headline" weight="600">{item.name}</Text>
                  <Text variant="caption" color={COLORS.text.secondary.light}>
                    P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                  </Text>
                </View>
                <View style={styles.resultRight}>
                  <Text variant="headline" weight="700" color={COLORS.primary}>{item.calories}</Text>
                  <Text variant="caption" color={COLORS.text.secondary.light}>kcal</Text>
                </View>
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
    padding: SPACING.m,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  calorieCard: {
    backgroundColor: '#000',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  statBox: {
    alignItems: 'center',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  macroProgressBg: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginVertical: SPACING.xs,
  },
  macroProgress: {
    height: '100%',
    borderRadius: 3,
  },
  mealCard: {
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  waterCard: {
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.m,
    marginBottom: SPACING.xl,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  waterButtons: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  waterBtn: {
    flex: 1,
    height: 44,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterProgressBg: {
    height: 8,
    width: '100%',
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  waterProgress: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addFoodBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
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
  resultsList: {
    padding: SPACING.m,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  resultRight: {
    alignItems: 'flex-end',
  },
});
