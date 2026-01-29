
import React, { useState, useMemo } from 'react';
import { AppState, Habit } from '../types';
import { 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Zap, 
  Flame, 
  TrendingUp, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HabitTrackerViewProps {
  state: AppState;
  addHabit: (h: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
}

const HabitTrackerView: React.FC<HabitTrackerViewProps> = ({ state, addHabit, deleteHabit, toggleHabit }) => {
  const [activeMode, setActiveMode] = useState<'build' | 'quit'>('build');
  const [input, setInput] = useState('');

  const today = new Date().toISOString().split('T')[0];
  
  // Last 7 days helper
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  const filteredHabits = state.habits.filter(h => h.type === activeMode);

  const calculateStreak = (habit: Habit) => {
    let streak = 0;
    const sorted = [...habit.completedDays].sort((a, b) => b.localeCompare(a));
    
    let checkDate = new Date();
    // If today is not completed, start checking from yesterday
    if (!habit.completedDays.includes(today)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (habit.completedDays.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addHabit({
      id: Math.random().toString(36).substr(2, 9),
      name: input.toUpperCase(),
      type: activeMode,
      completedDays: [],
      createdAt: new Date().toISOString()
    });
    setInput('');
  };

  const getChartData = (habit: Habit) => {
    // Show last 30 days summary
    const data = weekDays.map(date => ({
      day: date.split('-')[2],
      completed: habit.completedDays.includes(date) ? 1 : 0
    }));
    return data;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">Neural Reprogramming</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] opacity-70 italic">
            "{state.profile.subtitles.habits}"
          </p>
        </div>
        
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveMode('build')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeMode === 'build' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Zap size={14} /> Alpha Protocol
          </button>
          <button
            onClick={() => setActiveMode('quit')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeMode === 'quit' ? 'bg-rose-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <X size={14} /> Zero Protocol
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleAdd} className="flex gap-2 group">
            <input 
              type="text" 
              placeholder={activeMode === 'build' ? "Infect with new habit..." : "Eradicate habit..."} 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 glass rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500/50 transition-all text-xs font-semibold placeholder:text-zinc-700"
            />
            <button type="submit" className={`p-4 rounded-xl transition-all text-white active:scale-95 ${activeMode === 'build' ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-rose-600 shadow-rose-600/20'} shadow-lg`}>
              <Plus size={20} />
            </button>
          </form>

          <div className="space-y-6">
            {filteredHabits.map(habit => {
              const streak = calculateStreak(habit);
              return (
                <div key={habit.id} className="glass rounded-[2rem] p-6 space-y-6 group hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-base font-black tracking-tight text-white">{habit.name}</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                           <Flame size={12} /> {streak} Day Streak
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                           <TrendingUp size={12} /> {Math.round((habit.completedDays.length / Math.max(1, (new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24))) * 100)}% Consistency
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between gap-1 overflow-x-auto pb-2 scrollbar-hide">
                    {weekDays.map(day => {
                      const isCompleted = habit.completedDays.includes(day);
                      const isToday = day === today;
                      const dayName = new Date(day).toLocaleDateString('en-US', { weekday: 'narrow' });
                      
                      return (
                        <button
                          key={day}
                          onClick={() => toggleHabit(habit.id, day)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[50px] transition-all border ${
                            isCompleted 
                              ? (activeMode === 'build' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-rose-600 border-rose-500 text-white shadow-lg') 
                              : (isToday ? 'bg-white/5 border-white/20 text-zinc-300' : 'bg-white/[0.01] border-white/5 text-zinc-600 hover:bg-white/5')
                          }`}
                        >
                          <span className="text-[8px] font-black uppercase">{dayName}</span>
                          {isCompleted ? <Check size={16} strokeWidth={4} /> : <div className="w-4 h-4 rounded-full border border-current opacity-20" />}
                          <span className="text-[8px] font-bold font-mono opacity-50">{day.split('-')[2]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {filteredHabits.length === 0 && (
              <div className="py-20 text-center glass rounded-[3rem] border-dashed border-white/5">
                <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">No behavioral patterns recorded.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass rounded-3xl p-6 space-y-6">
             <h3 className="text-xs font-black flex items-center gap-2 tracking-tight uppercase text-zinc-400">
               <CalendarIcon size={14} className="text-indigo-400" /> Pulse Overview
             </h3>
             <div className="space-y-4">
                {filteredHabits.slice(0, 3).map(h => (
                  <div key={h.id} className="space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
                      <span>{h.name}</span>
                      <span>{calculateStreak(h)}D</span>
                    </div>
                    <div className="h-24 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={getChartData(h)}>
                           <Bar dataKey="completed">
                             {getChartData(h).map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.completed ? (activeMode === 'build' ? '#6366f1' : '#f43f5e') : '#18181b'} />
                             ))}
                           </Bar>
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-700/40 to-black rounded-3xl p-8 border border-white/5">
             <div className="space-y-4">
               <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                 <Zap size={20} />
               </div>
               <h4 className="text-base font-black text-white leading-tight">Identity Engineering</h4>
               <p className="text-[10px] leading-relaxed text-zinc-500 font-bold italic">
                 "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTrackerView;
