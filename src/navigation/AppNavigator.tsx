import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useUserStore } from '../store/userStore';
import { WelcomeScreen } from '../modules/profile/screens/WelcomeScreen';
import { DashboardScreen } from '../modules/dashboard/screens/DashboardScreen';
import { ProgressScreen } from '../modules/progress/screens/ProgressScreen';
import { NutritionScreen } from '../modules/nutrition/screens/NutritionScreen';
import { ActivityScreen } from '../modules/activity/screens/ActivityScreen';
import { WorkoutScreen } from '../modules/workouts/screens/WorkoutScreen';
import { CalculatorsScreen } from '../modules/calculators/screens/CalculatorsScreen';
import { COLORS } from '../constants/theme';
import { Home, BarChart2, Activity, User, Coffee, Dumbbell, Calculator } from 'lucide-react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.text.secondary.light,
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 0,
        backgroundColor: '#FFFFFF',
        height: 85,
        paddingBottom: 25,
      },
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Dashboard') return <Home color={color} size={size} />;
        if (route.name === 'Progress') return <BarChart2 color={color} size={size} />;
        if (route.name === 'Nutrition') return <Coffee color={color} size={size} />;
        if (route.name === 'Calculators') return <Calculator color={color} size={size} />;
        if (route.name === 'Workouts') return <Dumbbell color={color} size={size} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Workouts" component={WorkoutScreen} />
    <Tab.Screen name="Nutrition" component={NutritionScreen} />
    <Tab.Screen name="Calculators" component={CalculatorsScreen} />
    <Tab.Screen name="Progress" component={ProgressScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const profile = useUserStore((state) => state.profile);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!profile ? (
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};
