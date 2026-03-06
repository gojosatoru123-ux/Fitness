import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface LogEntry {
  id: string;
  date: string;
}

export interface FoodEntry extends LogEntry {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: string;
}

export interface WaterEntry extends LogEntry {
  amount: number;
}

export interface ActivityEntry extends LogEntry {
  type: 'run' | 'walk' | 'cycle' | 'hike';
  distance: number;
  duration: number;
  calories: number;
  pace: string;
  route: Array<{ latitude: number; longitude: number }>;
}

export interface WorkoutEntry extends LogEntry {
  category: 'strength' | 'cardio' | 'yoga' | 'hiit';
  name: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }>;
}

interface HealthState {
  foodEntries: FoodEntry[];
  waterEntries: WaterEntry[];
  activityEntries: ActivityEntry[];
  workoutEntries: WorkoutEntry[];
  addFood: (entry: FoodEntry) => void;
  addWater: (entry: WaterEntry) => void;
  addActivity: (entry: ActivityEntry) => void;
  addWorkout: (entry: WorkoutEntry) => void;
  getDailyCalories: (date: string) => number;
  getDailyWater: (date: string) => number;
  getDailyMacros: (date: string) => { protein: number; carbs: number; fat: number };
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      foodEntries: [],
      waterEntries: [],
      activityEntries: [],
      workoutEntries: [],

      addFood: (entry) => set((state) => ({ foodEntries: [...state.foodEntries, entry] })),
      addWater: (entry) => set((state) => ({ waterEntries: [...state.waterEntries, entry] })),
      addActivity: (entry) => set((state) => ({ activityEntries: [...state.activityEntries, entry] })),
      addWorkout: (entry) => set((state) => ({ workoutEntries: [...state.workoutEntries, entry] })),

      getDailyCalories: (date) => {
        const { foodEntries } = get();
        return foodEntries
          .filter((f) => f.date.startsWith(date))
          .reduce((acc, f) => acc + f.calories, 0);
      },

      getDailyWater: (date) => {
        const { waterEntries } = get();
        return waterEntries
          .filter((w) => w.date.startsWith(date))
          .reduce((acc, w) => acc + w.amount, 0);
      },

      getDailyMacros: (date) => {
        const { foodEntries } = get();
        return foodEntries
          .filter((f) => f.date.startsWith(date))
          .reduce(
            (acc, f) => ({
              protein: acc.protein + f.protein,
              carbs: acc.carbs + f.carbs,
              fat: acc.fat + f.fat,
            }),
            { protein: 0, carbs: 0, fat: 0 }
          );
      },
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);