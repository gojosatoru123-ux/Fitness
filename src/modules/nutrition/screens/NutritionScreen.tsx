import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, FlatList } from 'react-native';
import { Text } from '../../../components/common/Text';
import { Card } from '../../../components/common/Card';
import { ProgressRing } from '../../../components/common/ProgressRing';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { Plus, Search, ChevronRight, X, Coffee, Utensils, Moon, Candy } from 'lucide-react-native';
import { useHealthStore, FoodEntry } from '../../../store/healthStore';
import { useUserStore } from '../../../store/userStore';

export const NutritionScreen: React.FC = () => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeMealType, setActiveMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { foodEntries, addFood, getDailyCalories, getDailyMacros } = useHealthStore();
  const { getCalorieGoal } = useUserStore();

  const today = new Date().toISOString().split('T')[0];
  const caloriesConsumed = getDailyCalories(today);
  const calorieGoal = getCalorieGoal() || 2500;
  const remainingCalories = Math.max(0, calorieGoal - caloriesConsumed);
  const macros = getDailyMacros(today);

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'lunch', label: 'Lunch', icon: Utensils },
    { id: 'dinner', label: 'Dinner', icon: Moon },
    { id: 'snack', label: 'Snacks', icon: Candy },
  ];

  const handleAddFood = (food: Partial<FoodEntry>) => {
    const newEntry: FoodEntry = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      name: food.name || 'Food',
      type: activeMealType,
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      quantity: '1 serving',
    };
    addFood(newEntry);
    setSearchModalVisible(false);
  };

  const dummyResults = [
    { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3 },
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    { name: 'Egg (Boiled)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  ].filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={dummyResults}
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
