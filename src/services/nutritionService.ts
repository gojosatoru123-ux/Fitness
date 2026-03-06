export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  brand?: string;
  servingSize?: string;
}

export const searchFood = async (query: string): Promise<FoodItem[]> => {
  // Simulating API calls to USDA FoodData Central, OpenFoodFacts, Edamam, Nutritionix
  // In a real app, you would use fetch() with your API keys.
  
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulating network lag

  const allItems: FoodItem[] = [
    { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, servingSize: '1 cup' },
    { name: 'Chicken Breast (Grilled)', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: '100g' },
    { name: 'Banana (Medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: '1 fruit' },
    { name: 'Egg (Boiled)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, servingSize: '1 large' },
    { name: 'Greek Yogurt (Plain)', calories: 100, protein: 10, carbs: 4, fat: 5, servingSize: '150g' },
    { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: '28g' },
    { name: 'Avocado', calories: 234, protein: 3, carbs: 12, fat: 21, servingSize: '1 medium' },
    { name: 'Salmon (Baked)', calories: 206, protein: 22, carbs: 0, fat: 13, servingSize: '100g' },
    { name: 'Rice (White)', calories: 205, protein: 4.3, carbs: 45, fat: 0.4, servingSize: '1 cup' },
    { name: 'Broccoli (Steamed)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, servingSize: '1 cup' },
  ];

  return allItems.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
};

export const getNutritionCalculations = (weight: number, height: number, age: number, gender: string, activityLevel: string) => {
  // BMR (Mifflin-St Jeor Equation)
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // TDEE multipliers
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  const tdee = bmr * (multipliers[activityLevel] || 1.2);

  return { bmr, tdee };
};
