import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface SettingsProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdateProfile, onLogout, theme, toggleTheme }) => {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);
  const [sync, setSync] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (userProfile) {
      setEditForm(userProfile);
    }
  }, [userProfile]);

  const handleSaveProfile = () => {
    if (editForm) {
      onUpdateProfile(editForm);
      setIsEditing(false);
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-apple-green' : 'bg-zinc-700'}`}
    >
      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  if (!userProfile || !editForm) return null;

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto pb-24">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-semibold text-white">Settings</h2>
          <p className="text-zinc-400">Manage your account and preferences.</p>
        </header>

        {/* Profile Section */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 mb-8">
          <div className="flex items-center gap-6 mb-6">
             <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center text-2xl font-bold text-white border border-white/10 shadow-lg">
                {userProfile.name.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{userProfile.name}</h3>
                <p className="text-zinc-400 text-sm">Member since 2024</p>
             </div>
             <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-5 py-2 rounded-full border transition-colors text-sm font-medium ${
                    isEditing 
                    ? 'bg-white text-black border-white' 
                    : 'border-white/10 text-white hover:bg-white/10'
                }`}
             >
                {isEditing ? 'Cancel' : 'Edit Profile'}
             </button>
          </div>

          {/* Edit Form */}
          {isEditing ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase">Age</label>
                   <input 
                      type="number" 
                      value={editForm.age || ''} 
                      onChange={(e) => setEditForm({...editForm, age: Number(e.target.value)})}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white mt-1 focus:border-apple-blue outline-none" 
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase">Weight (kg)</label>
                   <input 
                      type="number" 
                      value={editForm.weight || ''} 
                      onChange={(e) => setEditForm({...editForm, weight: Number(e.target.value)})}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white mt-1 focus:border-apple-blue outline-none" 
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase">Height (cm)</label>
                   <input 
                      type="number" 
                      value={editForm.height || ''} 
                      onChange={(e) => setEditForm({...editForm, height: Number(e.target.value)})}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white mt-1 focus:border-apple-blue outline-none" 
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase">Goal</label>
                   <select 
                      value={editForm.goal} 
                      onChange={(e) => setEditForm({...editForm, goal: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white mt-1 focus:border-apple-blue outline-none" 
                   >
                     <option>Weight Loss</option>
                     <option>Muscle Gain</option>
                     <option>Maintenance</option>
                     <option>Endurance</option>
                   </select>
                </div>
                <div className="md:col-span-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase">Diet Preference</label>
                   <select 
                      value={editForm.dietaryPreference} 
                      onChange={(e) => setEditForm({...editForm, dietaryPreference: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-white mt-1 focus:border-apple-blue outline-none" 
                   >
                     <option>Omnivore</option>
                     <option>Vegetarian</option>
                     <option>Vegan</option>
                     <option>Keto</option>
                     <option>Paleo</option>
                   </select>
                </div>
                <div className="md:col-span-2 pt-2">
                   <button 
                    onClick={handleSaveProfile}
                    className="w-full bg-apple-blue hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors"
                   >
                    Save Changes
                   </button>
                </div>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 p-3 rounded-xl">
                   <span className="text-xs text-zinc-500 block">Age</span>
                   <span className="text-white font-medium">{userProfile.age > 0 ? userProfile.age : '-'}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                   <span className="text-xs text-zinc-500 block">Weight</span>
                   <span className="text-white font-medium">{userProfile.weight > 0 ? userProfile.weight + ' kg' : '-'}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                   <span className="text-xs text-zinc-500 block">Height</span>
                   <span className="text-white font-medium">{userProfile.height > 0 ? userProfile.height + ' cm' : '-'}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                   <span className="text-xs text-zinc-500 block">Goal</span>
                   <span className="text-white font-medium">{userProfile.goal}</span>
                </div>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          <section>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Appearance</h4>
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
               <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-yellow-400 text-white'}`}>
                    <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
                  </div>
                  <div>
                    <span className="text-white font-medium block">Mode</span>
                    <span className="text-xs text-zinc-500">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                </div>
                <Toggle checked={theme === 'light'} onChange={toggleTheme} />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">General</h4>
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-apple-red/20 flex items-center justify-center text-apple-red">
                    <i className="fa-solid fa-bell"></i>
                  </div>
                  <span className="text-white font-medium">Notifications</span>
                </div>
                <Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />
              </div>
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-apple-blue/20 flex items-center justify-center text-apple-blue">
                    <i className="fa-solid fa-volume-high"></i>
                  </div>
                  <span className="text-white font-medium">Sound Effects</span>
                </div>
                <Toggle checked={sound} onChange={() => setSound(!sound)} />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-apple-indigo/20 flex items-center justify-center text-apple-indigo">
                    <i className="fa-solid fa-cloud"></i>
                  </div>
                  <div>
                    <span className="text-white font-medium block">Cloud Sync</span>
                    <span className="text-xs text-zinc-500">Synced to {userProfile.name}'s profile</span>
                  </div>
                </div>
                <Toggle checked={sync} onChange={() => setSync(!sync)} />
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Privacy & Security</h4>
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <button className="w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors text-left">
                <span className="text-white font-medium">Change Password</span>
                <i className="fa-solid fa-chevron-right text-zinc-600 text-xs"></i>
              </button>
              <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                <span className="text-white font-medium">Manage Permissions</span>
                <i className="fa-solid fa-chevron-right text-zinc-600 text-xs"></i>
              </button>
            </div>
          </section>
          
          <div className="pt-4 flex justify-center">
             <button 
               onClick={onLogout}
               className="text-apple-red hover:text-red-400 font-medium text-sm transition-colors"
             >
               Sign Out {userProfile.name}
             </button>
          </div>
          
           <div className="text-center pb-8">
              <p className="text-zinc-600 text-xs">Trivion AI Gym v1.3</p>
           </div>
        </div>
      </div>
    </div>
  );
};