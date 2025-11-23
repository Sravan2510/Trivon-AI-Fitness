export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TRAINER = 'TRAINER',
  DIETICIAN = 'DIETICIAN',
  BUDDY = 'BUDDY',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  goal: string;
  dietaryPreference: string;
}

export interface DietPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  }
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  duration?: number; // seconds for timer
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: Exercise[];
  estCalories: number;
  durationMins: number;
}

// New Types for Realtime Data
export interface WorkoutSession {
  date: string; // ISO date string
  routineName: string;
  caloriesBurned: number;
  durationSeconds: number;
}

export interface UserStats {
  totalCalories: number;
  workoutsCompleted: number;
  streak: number;
  history: WorkoutSession[];
}