import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, UserStats, WorkoutSession } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { AiTrainer } from './components/AiTrainer';
import { Dietician } from './components/Dietician';
import { ChatBuddy } from './components/ChatBuddy';
import { Settings } from './components/Settings';

// --- Login Component ---
const LoginScreen = ({ onLogin }: { onLogin: (name: string) => void }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Simulate Network Delay
    setTimeout(() => {
      const db = JSON.parse(localStorage.getItem('trivion_auth_db') || '{}');

      if (isRegistering) {
        // --- REGISTER FLOW ---
        if (db[name.toLowerCase()]) {
          setError('User already exists. Please sign in.');
          setIsLoading(false);
          return;
        }
        
        // Save new user credentials
        db[name.toLowerCase()] = password;
        localStorage.setItem('trivion_auth_db', JSON.stringify(db));
        
        // Proceed to app
        onLogin(name.trim());
      } else {
        // --- LOGIN FLOW ---
        if (!db[name.toLowerCase()]) {
          setError('User does not exist. Please create an account.');
          setIsLoading(false);
          return;
        }

        if (db[name.toLowerCase()] !== password) {
          setError('Incorrect password. Please try again.');
          setIsLoading(false);
          return;
        }

        // Credentials match
        onLogin(name.trim());
      }
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-black relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-apple-blue/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-apple-indigo/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="glass-panel p-8 rounded-3xl w-full max-w-md z-10 flex flex-col items-center animate-fade-in">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-lg">
          <i className="fa-solid fa-dumbbell text-3xl text-white"></i>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-1">Trivion Gym</h1>
        <p className="text-zinc-400 mb-6 text-sm">
          {isRegistering ? 'Create your account' : 'Sign in to continue your journey'}
        </p>

        <form onSubmit={handleAuth} className="w-full space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center font-medium animate-pulse">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          <div>
             <input 
              type="text" 
              placeholder="Username" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-zinc-600"
              required
             />
          </div>
          <div>
             <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all placeholder-zinc-600"
              required
             />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-200 font-medium py-3 rounded-xl transition-colors mt-4 disabled:opacity-70 shadow-lg"
          >
            {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : (isRegistering ? "Create Account" : "Sign In")}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 w-full text-center">
           <p className="text-zinc-500 text-sm">
             {isRegistering ? 'Already have an account? ' : 'Don\'t have an account? '}
             <button 
               onClick={() => {
                 setIsRegistering(!isRegistering);
                 setError('');
                 setPassword('');
               }}
               className="text-apple-blue hover:text-blue-400 font-medium transition-colors"
             >
               {isRegistering ? 'Sign In' : 'Sign Up'}
             </button>
           </p>
        </div>
      </div>
    </div>
  );
};

// --- Welcome Component ---
const WelcomeScreen = ({ name, onComplete }: { name: string, onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center h-screen w-full bg-black z-50 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-4 animate-slide-up">
          Welcome, {name}
        </h1>
        <p className="text-zinc-500 text-lg animate-slide-up" style={{animationDelay: '0.2s'}}>
          Syncing your profile data...
        </p>
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [authStep, setAuthStep] = useState<'login' | 'welcome' | 'app'>('login');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Realtime Stats State
  const [userStats, setUserStats] = useState<UserStats>({
    totalCalories: 0,
    workoutsCompleted: 0,
    streak: 0,
    history: []
  });

  useEffect(() => {
    // Apply theme class to body/html
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const handleLogin = (name: string) => {
    // Attempt to load profile from localStorage
    const storageKey = `trivion_user_${name.toLowerCase()}`;
    const savedData = localStorage.getItem(storageKey);
    const savedStats = localStorage.getItem(`${storageKey}_stats`);

    if (savedData) {
      setUserProfile(JSON.parse(savedData));
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      } else {
        // Reset stats if new
        setUserStats({
          totalCalories: 0,
          workoutsCompleted: 0,
          streak: 0,
          history: []
        });
      }
    } else {
      // Create new profile if doesn't exist
      const newProfile: UserProfile = {
        name: name,
        age: 0,
        weight: 0,
        height: 0,
        goal: 'Muscle Gain',
        dietaryPreference: 'Omnivore'
      };
      setUserProfile(newProfile);
      // Clean stats
      setUserStats({
          totalCalories: 0,
          workoutsCompleted: 0,
          streak: 0,
          history: []
      });
      localStorage.setItem(storageKey, JSON.stringify(newProfile));
    }
    setAuthStep('welcome');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    const storageKey = `trivion_user_${updatedProfile.name.toLowerCase()}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
  };

  // Function to log a workout from AiTrainer
  const handleLogWorkout = (calories: number, duration: number, routineName: string) => {
    setUserStats(prev => {
       const newSession: WorkoutSession = {
         date: new Date().toISOString(),
         caloriesBurned: calories,
         durationSeconds: duration,
         routineName: routineName
       };
       
       const newStats = {
         ...prev,
         totalCalories: prev.totalCalories + calories,
         workoutsCompleted: prev.workoutsCompleted + 1,
         streak: prev.streak > 0 ? prev.streak : 1, // Simple streak logic for demo
         history: [...prev.history, newSession]
       };
       
       // Persist
       if (userProfile) {
         localStorage.setItem(`trivion_user_${userProfile.name.toLowerCase()}_stats`, JSON.stringify(newStats));
       }
       return newStats;
    });
  };

  const handleWelcomeComplete = () => {
    setAuthStep('app');
  };
  
  const handleLogout = () => {
    setUserProfile(null);
    setAuthStep('login');
    setCurrentView(ViewState.DASHBOARD);
    setTheme('dark'); 
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (authStep === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (authStep === 'welcome') {
    return <WelcomeScreen name={userProfile?.name || ''} onComplete={handleWelcomeComplete} />;
  }

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard userProfile={userProfile} stats={userStats} setView={setCurrentView} />;
      case ViewState.TRAINER:
        return <AiTrainer onCompleteWorkout={handleLogWorkout} />;
      case ViewState.DIETICIAN:
        return <Dietician userProfile={userProfile} />;
      case ViewState.BUDDY:
        return <ChatBuddy />;
      case ViewState.SETTINGS:
        return <Settings userProfile={userProfile} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <Dashboard userProfile={userProfile} stats={userStats} setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans selection:bg-apple-blue selection:text-white transition-colors duration-300">
      {/* Sidebar Navigation (Mac Style) */}
      <Navbar currentView={currentView} setView={setCurrentView} />
      
      {/* Main Content Area */}
      <main className="flex-1 relative h-full overflow-hidden">
         {/* Top gradient glow for atmosphere */}
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-900/30 to-transparent pointer-events-none z-0" />
         
         <div className="relative h-full z-10">
            {renderView()}
         </div>
      </main>
    </div>
  );
};

export default App;