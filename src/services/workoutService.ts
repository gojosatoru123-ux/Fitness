export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  muscles: string[];
  equipment: string[];
  image?: string;
}

export const searchExercises = async (query: string): Promise<Exercise[]> => {
  // Simulating Wger Exercise API
  await new Promise(resolve => setTimeout(resolve, 500));

  const exercises: Exercise[] = [
    { id: '1', name: 'Barbell Bench Press', category: 'Strength', muscles: ['Chest', 'Triceps'], equipment: ['Barbell', 'Bench'], image: 'https://cdn-icons-png.flaticon.com/512/2548/2548537.png' },
    { id: '2', name: 'Barbell Squat', category: 'Strength', muscles: ['Quads', 'Glutes'], equipment: ['Barbell', 'Rack'], image: 'https://cdn-icons-png.flaticon.com/512/2548/2548532.png' },
    { id: '3', name: 'Deadlift', category: 'Strength', muscles: ['Hamstrings', 'Back', 'Core'], equipment: ['Barbell'], image: 'https://cdn-icons-png.flaticon.com/512/2548/2548525.png' },
    { id: '4', name: 'Pull-Up', category: 'Strength', muscles: ['Back', 'Biceps'], equipment: ['Pull-up bar'], image: 'https://cdn-icons-png.flaticon.com/512/2548/2548535.png' },
    { id: '5', name: 'Running', category: 'Cardio', muscles: ['Legs'], equipment: ['None'], image: 'https://cdn-icons-png.flaticon.com/512/2548/2548530.png' },
    { id: '6', name: 'Cycling', category: 'Cardio', muscles: ['Legs'], equipment: ['Bike'], image: 'https://cdn-icons-png.flaticon.com/512/2548/2548528.png' },
    { id: '7', name: 'Plank', category: 'HIIT', muscles: ['Core'], equipment: ['None'], image: 'https://cdn-icons-png.flaticon.com/512/2548/2548533.png' },
    { id: '8', name: 'Downward Dog', category: 'Yoga', muscles: ['Full Body'], equipment: ['Mat'], image: 'https://cdn-icons-png.flaticon.com/512/2548/2548531.png' },
  ];

  return exercises.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || e.category.toLowerCase().includes(query.toLowerCase()));
};
