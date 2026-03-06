import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; 
  weight: number; 
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  fitnessGoal: 'lose_weight' | 'gain_muscle' | 'maintain_weight' | 'improve_endurance';
}

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  getBMI: () => number;
  getBMR: () => number;
  getTDEE: () => number;
  getCalorieGoal: () => number;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),

      getBMI: () => {
        const { profile } = get();
        if (!profile) return 0;
        const heightInMeters = profile.height / 100;
        return profile.weight / (heightInMeters * heightInMeters);
      },

      getBMR: () => {
        const { profile } = get();
        if (!profile) return 0;
        let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
        if (profile.gender === 'male') {
          bmr += 5;
        } else {
          bmr -= 161;
        }
        return bmr;
      },

      getTDEE: () => {
        const bmr = get().getBMR();
        const { profile } = get();
        if (!profile || bmr === 0) return 0;
        const multipliers = {
          sedentary: 1.2,
          lightly_active: 1.375,
          moderately_active: 1.55,
          very_active: 1.725,
        };
        return bmr * multipliers[profile.activityLevel];
      },

      getCalorieGoal: () => {
        const tdee = get().getTDEE();
        const { profile } = get();
        if (!profile || tdee === 0) return 0;
        switch (profile.fitnessGoal) {
          case 'lose_weight': return tdee - 500;
          case 'gain_muscle': return tdee + 300;
          default: return tdee;
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);