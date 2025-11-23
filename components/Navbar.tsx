import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  // Initialize from localStorage if available, default to false (expanded)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('trivion_sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('trivion_sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const navItems = [
    { id: ViewState.DASHBOARD, icon: 'fa-chart-simple', label: 'Dashboard' },
    { id: ViewState.TRAINER, icon: 'fa-video', label: 'AI Trainer' },
    { id: ViewState.DIETICIAN, icon: 'fa-apple-whole', label: 'Dietician' },
    { id: ViewState.BUDDY, icon: 'fa-message', label: 'Gym Buddy' },
  ];

  return (
    <>
      {/* Mobile Bottom Bar (Unchanged) */}
      <nav className="fixed bottom-0 left-0 w-full bg-zinc-900/90 backdrop-blur-xl border-t border-white/10 md:hidden z-50 pb-safe">
        <div className="flex justify-around p-2">
           {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                currentView === item.id 
                  ? 'text-apple-blue' 
                  : 'text-zinc-500'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-xl`}></i>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          <button
              onClick={() => setView(ViewState.SETTINGS)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                currentView === ViewState.SETTINGS 
                  ? 'text-apple-blue' 
                  : 'text-zinc-500'
              }`}
            >
              <i className="fa-solid fa-gear text-xl"></i>
              <span className="text-[10px] font-medium">Settings</span>
            </button>
        </div>
      </nav>

      {/* Desktop Sidebar (MacOS Style) - Foldable */}
      <nav 
        className={`hidden md:flex flex-col h-screen glass border-r border-white/10 pt-8 pb-4 z-50 bg-zinc-900/30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20 px-2' : 'w-64 px-4'
        }`}
      >
        {/* Header Section */}
        <div className={`mb-8 flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between px-2'}`}>
           <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-8 h-8 bg-gradient-to-br from-apple-blue to-apple-indigo rounded-lg flex items-center justify-center shadow-lg shadow-apple-blue/20 flex-shrink-0">
               <i className="fa-solid fa-bolt text-white text-sm"></i>
             </div>
             {!isCollapsed && (
               <span className="text-lg font-semibold text-white tracking-tight whitespace-nowrap animate-fade-in">
                 Trivion
               </span>
             )}
           </div>
           
           {/* Collapse/Expand Toggle */}
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
             title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
           >
             <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
           </button>
        </div>
        
        {/* Menu Items */}
        <div className="space-y-1 flex-1">
          {!isCollapsed && (
            <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider animate-fade-in whitespace-nowrap">
              Menu
            </div>
          )}
          
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                currentView === item.id 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className={`w-6 flex justify-center transition-colors ${currentView === item.id ? 'text-apple-blue' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                <i className={`fa-solid ${item.icon} text-lg`}></i>
              </div>
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden animate-fade-in">{item.label}</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer / Settings */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <button 
            onClick={() => setView(ViewState.SETTINGS)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'} py-2 text-sm transition-colors rounded-lg ${
                currentView === ViewState.SETTINGS 
                  ? 'bg-white/10 text-white' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
            title={isCollapsed ? 'Settings' : ''}
          >
             <div className="w-6 flex justify-center">
                <i className="fa-solid fa-gear text-lg"></i>
             </div>
             {!isCollapsed && (
               <span className="whitespace-nowrap overflow-hidden animate-fade-in">Settings</span>
             )}
          </button>
        </div>
      </nav>
    </>
  );
};