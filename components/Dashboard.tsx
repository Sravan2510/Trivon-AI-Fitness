import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserProfile, UserStats, ViewState } from '../types';

interface DashboardProps {
  userProfile: UserProfile | null;
  stats: UserStats;
  setView: (view: ViewState) => void;
}

interface Habit {
  id: number;
  label: string;
  done: boolean;
  icon: string;
  color: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userProfile, stats, setView }) => {
  // Initialized as empty array with type definition
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [timeRange, setTimeRange] = useState('Weekly');
  const [liveHeartRate, setLiveHeartRate] = useState(0);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);

  // Generate chart data based on history or defaults
  const generateChartData = () => {
    // If no history, return clean slate flat line
    if (stats.history.length === 0) {
      return [
        { name: 'Mon', kcal: 0 },
        { name: 'Tue', kcal: 0 },
        { name: 'Wed', kcal: 0 },
        { name: 'Thu', kcal: 0 },
        { name: 'Fri', kcal: 0 },
        { name: 'Sat', kcal: 0 },
        { name: 'Sun', kcal: 0 },
      ];
    }
    
    // Group history by date (Simplified for prototype)
    // In a real app, we'd parse dates properly. Here we just map the last few sessions.
    const data = stats.history.slice(-7).map((session, index) => ({
      name: `Session ${index + 1}`,
      kcal: session.caloriesBurned
    }));
    
    return data.length > 0 ? data : [{name: 'Start', kcal: 0}];
  };

  const chartData = generateChartData();

  // Simulate Live Heart Rate
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isDeviceConnected) {
        // Initialize at a realistic resting rate if starting from 0
        setLiveHeartRate(prev => prev === 0 ? 72 : prev);

        interval = setInterval(() => {
            setLiveHeartRate(prev => {
                // Random walk: Change by -2, -1, 0, 1, or 2 to simulate natural fluctuation
                const change = Math.floor(Math.random() * 5) - 2;
                let next = prev + change;
                
                // Clamp values between realistic bounds
                if (next < 60) next = 60;
                if (next > 180) next = 180;
                
                return next;
            });
        }, 1000);
    } else {
        setLiveHeartRate(0);
    }

    return () => clearInterval(interval);
  }, [isDeviceConnected]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    const newItem = {
      id: Date.now(),
      label: newHabit.trim(),
      done: false,
      icon: 'fa-star', // Default icon
      color: 'text-yellow-400'
    };
    setHabits([...habits, newItem]);
    setNewHabit('');
  };

  const deleteHabit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setHabits(habits.filter(h => h.id !== id));
  };
  
  const userName = userProfile?.name || 'User';

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto pb-24 md:pb-10">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight">Summary</h2>
          <p className="text-zinc-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* IoT Status Indicator - Clickable Toggle */}
          <button 
            onClick={() => setIsDeviceConnected(!isDeviceConnected)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 group relative ${
                isDeviceConnected 
                ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                : 'bg-zinc-900 border-white/10 hover:bg-zinc-800'
            }`}
          >
             <div className={`w-2 h-2 rounded-full ${isDeviceConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
             <span className={`text-xs font-medium ${isDeviceConnected ? 'text-green-500' : 'text-zinc-400'}`}>
                {isDeviceConnected ? 'Watch Connected' : 'Watch Disconnected'}
             </span>
             
             {/* Tooltip */}
             <div className="absolute top-full mt-2 right-0 w-48 bg-zinc-900 p-3 text-[10px] rounded-lg border border-white/10 hidden group-hover:block z-50 text-zinc-300 shadow-xl">
                {isDeviceConnected ? 'Receiving live telemetry.' : 'Click to connect simulator.'}
             </div>
          </button>

          {/* Clickable Profile Avatar */}
          <button 
            onClick={() => setView(ViewState.SETTINGS)}
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold border border-white/10 hover:border-apple-blue hover:ring-2 hover:ring-apple-blue/50 transition-all relative overflow-hidden"
            title="Go to Settings"
          >
            {userName.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Stat Cards - Realtime Data */}
        {[
          { label: 'Activity', value: stats.totalCalories, unit: 'kcal', icon: 'fa-fire', color: 'text-apple-red', bg: 'bg-apple-red/10' },
          { label: 'Workouts', value: stats.workoutsCompleted, unit: 'completed', icon: 'fa-dumbbell', color: 'text-apple-green', bg: 'bg-apple-green/10' },
          { 
            label: 'Live HR', 
            value: isDeviceConnected ? liveHeartRate : '--', 
            unit: 'bpm', 
            icon: 'fa-heart-pulse', 
            color: isDeviceConnected ? 'text-apple-red' : 'text-zinc-500', 
            bg: isDeviceConnected ? 'bg-apple-red/10 animate-pulse' : 'bg-zinc-800' 
          },
          { label: 'Streak', value: stats.streak, unit: 'days', icon: 'fa-bolt', color: 'text-apple-blue', bg: 'bg-apple-blue/10' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-32 hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start">
               <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center ${stat.color}`}>
                 <i className={`fa-solid ${stat.icon} text-sm`}></i>
               </div>
               <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-300 block">{stat.label}</span>
              <span className="text-xs text-zinc-500 uppercase">{stat.unit}</span>
            </div>
          </div>
        ))}

        {/* Main Chart - Wide */}
        <div className="md:col-span-3 glass-panel p-6 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-semibold text-white flex items-center gap-2">
               <i className="fa-solid fa-fire text-apple-red text-sm"></i> Calories Burned
             </h3>
             
             {/* Dropdown Menu */}
             <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-zinc-800/80 text-xs font-medium text-white pl-3 pr-8 py-1.5 rounded-lg border border-white/10 outline-none focus:border-apple-blue appearance-none cursor-pointer hover:bg-zinc-700 transition-colors"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3 top-2.5 text-xs text-zinc-500 pointer-events-none"></i>
             </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#71717a" tick={{fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }} 
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <Line type="monotone" dataKey="kcal" stroke="#FF453A" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#FF453A' }} />
              </LineChart>
            </ResponsiveContainer>
            {stats.history.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-zinc-600 text-sm">Complete a workout in AI Trainer to see data</p>
                </div>
            )}
          </div>
        </div>

        {/* Habits - Tall */}
        <div className="md:col-span-1 glass-panel p-6 rounded-3xl border border-white/5 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Goals</h3>
          
          {/* Add Habit Input - Shortened Width */}
          <form onSubmit={addHabit} className="flex gap-2 mb-4">
             <input 
               type="text" 
               value={newHabit}
               onChange={(e) => setNewHabit(e.target.value)}
               placeholder="Add goal..."
               className="w-32 flex-1 bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-apple-blue placeholder-zinc-600"
             />
             <button 
               type="submit"
               className="bg-white/10 hover:bg-white/20 text-white w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
             >
               <i className="fa-solid fa-plus text-xs"></i>
             </button>
          </form>

          <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar max-h-[300px]">
            {habits.map(habit => (
              <div 
                key={habit.id} 
                onClick={() => toggleHabit(habit.id)}
                className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all group relative ${
                  habit.done 
                      ? 'bg-white/5' 
                      : 'bg-zinc-900/40 hover:bg-white/5'
                }`}
              >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    habit.done 
                      ? 'bg-apple-green border-apple-green' 
                      : 'border-zinc-600 group-hover:border-zinc-500'
                  }`}>
                    {habit.done && <i className="fa-solid fa-check text-[10px] text-black"></i>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate transition-colors ${habit.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                      {habit.label}
                    </p>
                  </div>
                  
                  {/* Delete Button (Visible on Hover) */}
                  <button 
                    onClick={(e) => deleteHabit(habit.id, e)}
                    className="w-6 h-6 rounded-md bg-transparent hover:bg-red-500/20 text-zinc-600 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Goal"
                  >
                     <i className="fa-solid fa-trash text-[10px]"></i>
                  </button>
              </div>
            ))}
            {habits.length === 0 && (
              <div className="text-center text-zinc-500 text-sm mt-4">
                No goals set for today.
              </div>
            )}
          </div>
        </div>

        {/* Call to Action - Expanded to Full Width */}
        <div className="md:col-span-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-apple-blue to-blue-600 p-6 flex flex-col justify-center shadow-lg shadow-blue-500/10">
           <div className="absolute top-0 right-0 p-6 opacity-20">
              <i className="fa-solid fa-person-running text-9xl text-white transform translate-x-4 translate-y-4"></i>
           </div>
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Start a Workout</h3>
               <p className="text-blue-100 max-w-md text-sm">Select a routine in the AI Trainer to start generating real fitness data and track your progress over time.</p>
             </div>
             <button onClick={() => setView(ViewState.TRAINER)} className="bg-white text-apple-blue px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap">
               Go to Trainer
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};