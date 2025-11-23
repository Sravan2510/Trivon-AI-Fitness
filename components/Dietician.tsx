import React, { useState, useEffect } from 'react';
import { generateDietPlan, generateGroceryList } from '../services/geminiService';
import { UserProfile } from '../types';

interface DieticianProps {
  userProfile: UserProfile | null;
}

export const Dietician: React.FC<DieticianProps> = ({ userProfile }) => {
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [groceryList, setGroceryList] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'grocery'>('plan');
  
  const [formData, setFormData] = useState({
    age: '' as any,
    weight: '' as any,
    height: '' as any,
    goal: 'Muscle Gain',
    preference: 'Omnivore'
  });

  // Pre-fill form from userProfile
  useEffect(() => {
    if (userProfile) {
      setFormData({
        age: userProfile.age || '',
        weight: userProfile.weight || '',
        height: userProfile.height || '',
        goal: userProfile.goal || 'Muscle Gain',
        preference: userProfile.dietaryPreference || 'Omnivore'
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.age || !formData.weight || !formData.height) return;

    setLoading(true);
    setPlan(null);
    setGroceryList(null);
    setActiveTab('plan');
    
    const result = await generateDietPlan(
      Number(formData.age), 
      Number(formData.weight), 
      Number(formData.height), 
      formData.goal, 
      formData.preference
    );
    setPlan(result);
    setLoading(false);
  };

  const handleGenerateList = async () => {
    if (!plan) return;
    setLoadingList(true);
    setActiveTab('grocery');
    const list = await generateGroceryList(plan);
    setGroceryList(list);
    setLoadingList(false);
  };

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto pb-24">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-semibold text-white">Nutrition Coach</h2>
          <p className="text-zinc-400">AI-powered meal planning and groceries.</p>
        </header>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Input Form */}
          <div className="md:col-span-4">
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Age</label>
                <input 
                  type="number" 
                  placeholder="Years"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-apple-green focus:ring-1 focus:ring-apple-green outline-none placeholder-zinc-600 transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    placeholder="kg"
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-apple-green focus:ring-1 focus:ring-apple-green outline-none placeholder-zinc-600 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Height (cm)</label>
                  <input 
                    type="number" 
                    placeholder="cm"
                    value={formData.height}
                    onChange={e => setFormData({...formData, height: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-apple-green focus:ring-1 focus:ring-apple-green outline-none placeholder-zinc-600 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Goal</label>
                <div className="relative">
                   <select 
                    value={formData.goal}
                    onChange={e => setFormData({...formData, goal: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-apple-green outline-none appearance-none"
                  >
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                    <option>Maintenance</option>
                    <option>Endurance</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-4 text-zinc-500 text-xs pointer-events-none"></i>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Preference</label>
                <div className="relative">
                  <select 
                    value={formData.preference}
                    onChange={e => setFormData({...formData, preference: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-3 text-white focus:border-apple-green outline-none appearance-none"
                  >
                    <option>Omnivore</option>
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                    <option>Keto</option>
                    <option>Paleo</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-4 text-zinc-500 text-xs pointer-events-none"></i>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg"
              >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : "Generate Plan"}
              </button>
            </form>
          </div>

          {/* Result Display */}
          <div className="md:col-span-8 flex flex-col h-full">
            {/* Pill Tabs */}
            <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-xl w-fit mb-6 border border-white/10">
               <button 
                 onClick={() => setActiveTab('plan')}
                 className={`px-5 py-1.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'plan' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
               >
                 Meal Plan
               </button>
               <button 
                 onClick={() => setActiveTab('grocery')}
                 disabled={!plan}
                 className={`px-5 py-1.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'grocery' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'} ${!plan && 'opacity-50 cursor-not-allowed'}`}
               >
                 Grocery List
               </button>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 flex-1 min-h-[400px] relative overflow-hidden">
              {activeTab === 'plan' && (
                <>
                  {plan ? (
                    <div className="h-full overflow-y-auto pb-16 no-scrollbar">
                      <div className="prose prose-invert prose-headings:text-white prose-p:text-zinc-300 prose-strong:text-apple-green max-w-none">
                        <div className="whitespace-pre-wrap">{plan}</div>
                      </div>
                      
                      <div className="absolute bottom-6 right-6">
                        <button 
                           onClick={handleGenerateList}
                           className="bg-apple-blue hover:bg-blue-500 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105"
                        >
                           <i className="fa-solid fa-basket-shopping"></i> Create Grocery List
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                      <div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-carrot text-3xl text-zinc-500"></i>
                      </div>
                      <p className="text-center font-medium">
                        {userProfile && userProfile.weight > 0 
                           ? "Click 'Generate Plan' to use your saved profile." 
                           : "Enter your biometrics to start."}
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'grocery' && (
                 <div className="h-full overflow-y-auto no-scrollbar">
                    {loadingList ? (
                       <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                          <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-4"></i>
                          <p>Curating your list...</p>
                       </div>
                    ) : groceryList ? (
                       <div className="prose prose-invert prose-p:text-zinc-300 prose-li:text-zinc-300 max-w-none">
                          <div className="whitespace-pre-wrap">{groceryList}</div>
                       </div>
                    ) : (
                       <div className="text-center text-zinc-500 mt-10">Generate a meal plan first.</div>
                    )}
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};