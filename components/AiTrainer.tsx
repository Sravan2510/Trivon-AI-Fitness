import React, { useState, useEffect } from 'react';
import { WorkoutRoutine, Exercise } from '../types';

// Mock Workout Data
const routines: WorkoutRoutine[] = [
  {
    id: '1',
    name: 'Full Body Blaster',
    estCalories: 300,
    durationMins: 45,
    exercises: [
      { id: 'e1', name: 'Jumping Jacks', sets: 3, reps: '45 sec', duration: 45 },
      { id: 'e2', name: 'Bodyweight Squats', sets: 4, reps: '15 reps', duration: 60 },
      { id: 'e3', name: 'Push-ups', sets: 3, reps: '12 reps', duration: 45 },
      { id: 'e4', name: 'Plank', sets: 3, reps: '60 sec', duration: 60 },
    ]
  },
  {
    id: '2',
    name: 'Push Day (Chest/Tri)',
    estCalories: 450,
    durationMins: 60,
    exercises: [
      { id: 'e5', name: 'Bench Press', sets: 4, reps: '10 reps', duration: 90 },
      { id: 'e6', name: 'Overhead Press', sets: 3, reps: '12 reps', duration: 90 },
      { id: 'e7', name: 'Tricep Dips', sets: 3, reps: '15 reps', duration: 60 },
    ]
  },
  {
    id: '3',
    name: 'Leg Day',
    estCalories: 500,
    durationMins: 60,
    exercises: [
      { id: 'e8', name: 'Squats', sets: 4, reps: '10 reps', duration: 120 },
      { id: 'e9', name: 'Lunges', sets: 3, reps: '12 per leg', duration: 90 },
      { id: 'e10', name: 'Calf Raises', sets: 4, reps: '20 reps', duration: 60 },
    ]
  },
  {
    id: '4',
    name: 'Cardio Core',
    estCalories: 400,
    durationMins: 30,
    exercises: [
      { id: 'e11', name: 'High Knees', sets: 3, reps: '30 sec', duration: 30 },
      { id: 'e12', name: 'Mountain Climbers', sets: 3, reps: '45 sec', duration: 45 },
      { id: 'e13', name: 'Burpees', sets: 3, reps: '10 reps', duration: 60 },
    ]
  }
];

// Sub-component for individual exercise timer
const ExerciseRow = ({ exercise }: { exercise: Exercise }) => {
  const [timeLeft, setTimeLeft] = useState(exercise.duration || 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(exercise.duration || 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-colors border border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue">
          <i className="fa-solid fa-dumbbell"></i>
        </div>
        <div>
          <h4 className="text-white font-medium">{exercise.name}</h4>
          <div className="text-xs text-zinc-400 flex gap-2">
            <span><i className="fa-solid fa-layer-group text-[10px] mr-1"></i>{exercise.sets} Sets</span>
            <span><i className="fa-solid fa-rotate-right text-[10px] mr-1"></i>{exercise.reps}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={`text-xl font-mono font-bold ${timeLeft < 10 && isActive ? 'text-red-500' : 'text-zinc-300'}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleTimer}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isActive 
                ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' 
                : 'bg-apple-green/20 text-apple-green hover:bg-apple-green/30'
            }`}
          >
            <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'} text-xs`}></i>
          </button>
          <button 
            onClick={resetTimer}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 flex items-center justify-center transition-all"
          >
            <i className="fa-solid fa-rotate-left text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

interface AiTrainerProps {
  onCompleteWorkout?: (calories: number, duration: number, routineName: string) => void;
}

export const AiTrainer: React.FC<AiTrainerProps> = ({ onCompleteWorkout }) => {
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(routines[0].id);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const currentRoutine = routines.find(r => r.id === selectedRoutineId) || routines[0];

  const handleComplete = () => {
    setIsCompleted(true);
    if (onCompleteWorkout) {
      // Log the workout
      onCompleteWorkout(currentRoutine.estCalories, currentRoutine.durationMins * 60, currentRoutine.name);
    }
    setTimeout(() => setIsCompleted(false), 3000);
  };

  return (
    <div className="p-6 md:p-10 h-full flex flex-col pb-24 overflow-y-auto">
      <header className="mb-8">
         <h2 className="text-3xl font-semibold text-white">Workout Planner</h2>
         <p className="text-zinc-400">Select a routine and track your progress.</p>
      </header>

      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Dropdown Selector */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
           <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Select Routine</label>
           <div className="relative">
             <select 
               value={selectedRoutineId}
               onChange={(e) => setSelectedRoutineId(e.target.value)}
               className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-white text-lg font-medium focus:border-apple-blue focus:ring-1 focus:ring-apple-blue outline-none appearance-none cursor-pointer hover:bg-zinc-800/50 transition-colors"
             >
               {routines.map(routine => (
                 <option key={routine.id} value={routine.id}>{routine.name}</option>
               ))}
             </select>
             <i className="fa-solid fa-chevron-down absolute right-6 top-5 text-zinc-400 pointer-events-none"></i>
           </div>
           
           <div className="mt-4 flex gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-2">
                <i className="fa-regular fa-clock"></i> {currentRoutine.durationMins} Mins
              </span>
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-fire-flame-simple"></i> ~{currentRoutine.estCalories} Kcal
              </span>
              <span className="flex items-center gap-2">
                 <i className="fa-solid fa-dumbbell"></i> {currentRoutine.exercises.length} Exercises
              </span>
           </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
           <h3 className="text-xl font-bold text-white px-2">Exercises</h3>
           {currentRoutine.exercises.map((exercise) => (
             <ExerciseRow key={exercise.id} exercise={exercise} />
           ))}
        </div>
        
        <div className="mt-4 text-center">
           <button 
             onClick={handleComplete}
             disabled={isCompleted}
             className={`font-bold py-4 px-12 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto ${
               isCompleted 
                 ? 'bg-green-500 text-white' 
                 : 'bg-apple-blue hover:bg-blue-600 text-white'
             }`}
           >
             {isCompleted ? (
               <><i className="fa-solid fa-check"></i> Workout Saved!</>
             ) : (
               "Complete Workout"
             )}
           </button>
           <p className="text-zinc-500 text-xs mt-3">
             Clicking complete will log {currentRoutine.estCalories} kcal to your dashboard.
           </p>
        </div>
      </div>
    </div>
  );
};