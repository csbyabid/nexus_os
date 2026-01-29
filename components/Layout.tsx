
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Dumbbell, 
  LineChart, 
  PlusCircle,
  User,
  ListTodo,
  Zap,
  RefreshCw,
  LogOut,
  Activity,
  Boxes
} from 'lucide-react';
import { AppState } from '../types';
import MusicWidget from './MusicWidget';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickAdd: () => void;
  onLogout: () => void;
  state: AppState;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onQuickAdd, onLogout, state }) => {
  const { pageTitles } = state.profile;
  
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: pageTitles.dashboard },
    { id: 'tracker', icon: ListTodo, label: pageTitles.tracker },
    { id: 'habits', icon: Zap, label: pageTitles.habits },
    { id: 'academic', icon: BookOpen, label: pageTitles.academic },
    { id: 'olympiad', icon: Trophy, label: pageTitles.olympiad },
    { id: 'skillset', icon: Boxes, label: pageTitles.skillset || "Skillset" },
    { id: 'fitness', icon: Dumbbell, label: pageTitles.fitness },
    { id: 'analytics', icon: LineChart, label: pageTitles.analytics },
    { id: 'profile', icon: User, label: pageTitles.profile },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      
      {/* Sidebar Command Module */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 border-r border-slate-800/40 p-6 z-50 bg-[#020617]/90 backdrop-blur-3xl">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl shadow-indigo-600/30 transition-all group-hover:scale-105">N</div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-slate-100 leading-none">NexusOS</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80 mt-1">Core Sync</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.15em] relative group ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <tab.icon size={17} className={activeTab === tab.id ? '' : 'group-hover:text-indigo-400 transition-colors'} />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8">
          <button 
            onClick={onQuickAdd}
            className="w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-400 hover:text-white rounded-2xl flex items-center justify-center gap-2.5 font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 group shadow-lg"
          >
            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
            Entry
          </button>
        </div>
      </aside>

      {/* Top Bar Navigation */}
      <header className="fixed top-0 right-0 left-0 md:left-64 h-16 border-b border-slate-800/40 bg-[#020617]/70 backdrop-blur-xl z-[40] flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hidden sm:inline">Neural Link: Online</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => window.location.reload()} className="p-2 text-slate-500 hover:text-indigo-400 transition-all">
            <RefreshCw size={15} />
          </button>
          <button onClick={onLogout} className="flex items-center gap-2.5 px-4 py-2 bg-slate-800/30 hover:bg-rose-500/10 border border-slate-700/50 rounded-xl text-slate-400 hover:text-rose-400 transition-all font-black uppercase text-[10px] tracking-widest">
            <LogOut size={14} />
            <span className="hidden sm:inline">Terminate</span>
          </button>
        </div>
      </header>

      {/* Main Tactical Interface */}
      <main className="flex-1 md:pl-64 w-full relative">
        <div className="max-w-[1400px] mx-auto p-6 pt-24 md:p-10 md:pt-28 animate-in">
          {children}
        </div>
      </main>

      {/* Mobile Nav Command */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 flex items-center justify-around px-4 z-50">
        {tabs.slice(0, 5).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${
              activeTab === tab.id ? 'text-indigo-400 scale-110' : 'text-slate-500'
            }`}
          >
            <tab.icon size={19} />
          </button>
        ))}
        <button 
          onClick={onQuickAdd}
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-slate-950 active:scale-90 transition-all"
        >
          <PlusCircle size={24} className="text-white" />
        </button>
      </nav>

      <MusicWidget url={state.profile.musicUrl} />
    </div>
  );
};

export default Layout;
