
import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Target, BrainCircuit, Clock as ClockIcon, 
  Zap, Calendar as CalendarIcon, Timer, Play, Pause, RotateCcw, Save, ShieldAlert, TrendingUp, Sparkles
} from 'lucide-react';
import { AppState, Task } from '../types';
import { MOOD_EMOJIS } from '../constants';
import DirectiveBanner from './DirectiveBanner';

interface DashboardProps {
  state: AppState;
  toggleTask: (id: string) => void;
  addTask: (task: Task) => void;
  logStudySession: (s: number) => void;
  onExport: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  saveTimer: (seconds: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  state, toggleTask, addTask, logStudySession, onExport, 
  startTimer, pauseTimer, resetTimer, saveTimer 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displaySeconds, setDisplaySeconds] = useState(0);

  useEffect(() => {
    const update = () => {
      const timer = state.timerState;
      if (timer.isRunning && timer.startTime) {
        setDisplaySeconds(timer.accumulatedSeconds + Math.floor((Date.now() - timer.startTime) / 1000));
      } else {
        setDisplaySeconds(timer.accumulatedSeconds);
      }
    };
    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, [state.timerState]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const todayStr = useMemo(() => currentTime.toISOString().split('T')[0], [currentTime]);
  const todayLog = state.logs.find(l => l.date === todayStr);
  const todayStudyHours = (todayLog?.studyTimeSeconds || 0) / 3600;
  const focusTarget = todayLog?.focusTarget || state.profile.targets.dailyStudyHours;
  const studyProgress = Math.min(100, (todayStudyHours / (focusTarget || 1)) * 100);

  const showExportWarning = useMemo(() => {
    if (!state.auth.lastExportDate) return true;
    const lastExport = new Date(state.auth.lastExportDate);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return lastExport < sevenDaysAgo;
  }, [state.auth.lastExportDate]);

  // Robust countdown calculation
  const primaryCountdowns = useMemo(() => {
    const list = [
      { label: state.profile.hscLabel || 'HSC Finals', date: state.profile.hscExamDate, color: 'text-cyan-400' },
      { label: state.profile.bioOlyLabel || 'Bio Oly', date: state.profile.bioOlyDate, color: 'text-emerald-400' },
      { label: state.profile.econOlyLabel || 'Econ Oly', date: state.profile.econOlyDate, color: 'text-amber-400' }
    ];
    
    return list.map(item => {
      const target = new Date(item.date);
      target.setHours(0, 0, 0, 0);
      const now = new Date(currentTime);
      now.setHours(0, 0, 0, 0);
      const diffMs = target.getTime() - now.getTime();
      const diffDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      
      return {
        ...item,
        days: diffDays
      };
    });
  }, [state.profile, currentTime]);

  // Syncing with the Execution Pipeline: Show all incomplete daily tasks
  const dailyIncompleteTasks = useMemo(() => {
    return state.tasks.filter(t => t.period === 'Daily' && !t.completed);
  }, [state.tasks]);

  return (
    <div className="space-y-10">
      {showExportWarning && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-rose-500" size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
              Intelligence Backup Required: Synchronize local state now.
            </span>
          </div>
          <button 
            onClick={onExport}
            className="px-4 py-2 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/30"
          >
            Run Backup
          </button>
        </div>
      )}

      <DirectiveBanner category="dashboard" />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 px-1">
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter text-white tabular-nums leading-none">
            {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }).split(' ')[0]}
            <span className="text-2xl text-slate-500 font-mono tracking-normal ml-3">
              {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }).split(' ')[1]}
            </span>
          </h1>
          <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            <CalendarIcon size={14} className="text-indigo-500" />
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>

        <div className="flex gap-4">
          {primaryCountdowns.map((item, idx) => (
            <div key={idx} className="glass rounded-2xl px-6 py-4 flex flex-col items-center min-w-[110px] border-slate-800/40">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 truncate max-w-[90px]">{item.label}</span>
              <span className={`text-2xl font-black font-mono tracking-tighter ${item.color}`}>
                {item.days}d
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
             <div className="flex items-center gap-3 px-1">
               <Target className="text-indigo-400" size={18} /> 
               <h2 className="text-[11px] font-black text-slate-100 uppercase tracking-[0.2em]">Execution Pipeline</h2>
               <div className="h-px flex-1 bg-slate-800/40"></div>
             </div>
             <div className="grid grid-cols-1 gap-3">
               {dailyIncompleteTasks.map(task => (
                 <div key={task.id} onClick={() => toggleTask(task.id)} className="glass glass-hover p-5 rounded-2xl flex items-center gap-5 cursor-pointer border-slate-800/40 transition-all">
                   <div className="w-8 h-8 rounded-lg bg-slate-900/50 flex items-center justify-center text-slate-500">
                    <Circle size={18} />
                   </div>
                   <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-200 tracking-tight uppercase">{task.title}</span>
                    <span className="text-[8px] font-black text-indigo-400/60 uppercase tracking-widest">{task.tag}</span>
                   </div>
                 </div>
               ))}
               {dailyIncompleteTasks.length === 0 && (
                 <div className="py-16 glass rounded-[2rem] border-dashed border-slate-800 flex flex-col items-center gap-4 opacity-50 text-slate-500 uppercase font-black text-[10px] tracking-widest">
                   <CheckCircle2 size={32} className="text-indigo-500/50" />
                   Objectives Secured
                 </div>
               )}
             </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/40">
             <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-3">
                 <Zap className="text-amber-400" size={18} />
                 <h2 className="text-[11px] font-black text-slate-100 uppercase tracking-[0.2em]">Neural Habit Pulse</h2>
               </div>
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Systematic Continuity</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {state.habits.slice(0, 3).map(habit => {
                 const isCompleted = habit.completedDays.includes(todayStr);
                 return (
                   <div key={habit.id} className={`glass rounded-2xl p-5 border-slate-800/40 flex flex-col gap-4 group transition-all ${isCompleted ? 'bg-indigo-500/10 border-indigo-500/30' : ''}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-black text-slate-200 tracking-tight leading-tight uppercase truncate pr-2">{habit.name}</span>
                        {isCompleted ? <Sparkles size={14} className="text-indigo-400" /> : <TrendingUp size={14} className="text-slate-700" />}
                      </div>
                      <div className="flex gap-1.5 h-1.5">
                        {Array.from({ length: 7 }).map((_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() - (6 - i));
                          const ds = date.toISOString().split('T')[0];
                          const done = habit.completedDays.includes(ds);
                          return (
                            <div key={i} className={`flex-1 rounded-full ${done ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-900'}`}></div>
                          );
                        })}
                      </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass glass-vibrant rounded-3xl p-8 space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deep Work Monitor</span>
              <div className={`w-2.5 h-2.5 rounded-full ${state.timerState.isRunning ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}></div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-black font-mono text-white tabular-nums tracking-tighter drop-shadow-xl">
                {formatTimer(displaySeconds)}
              </div>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mt-3">Cognition Stream</p>
            </div>

            <div className="flex justify-center gap-3">
              <button onClick={state.timerState.isRunning ? pauseTimer : startTimer} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${state.timerState.isRunning ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'}`}>
                {state.timerState.isRunning ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <button onClick={resetTimer} className="w-12 h-12 rounded-xl glass text-slate-500 hover:text-white flex items-center justify-center transition-all">
                <RotateCcw size={20} />
              </button>
              <button onClick={() => saveTimer(displaySeconds)} disabled={displaySeconds === 0} className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center disabled:opacity-20 transition-all shadow-lg shadow-cyan-600/10">
                <Save size={20} />
              </button>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 space-y-6 border-slate-800/40">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ClockIcon size={18} className="text-indigo-400" />
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Target Pulse</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-indigo-400 tabular-nums">{todayStudyHours.toFixed(1)}h</div>
                  <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Goal: {focusTarget}h</div>
                </div>
             </div>
             <div className="overflow-hidden h-2.5 rounded-full bg-slate-900 border border-slate-800/50">
                <div style={{ width: `${studyProgress}%` }} className="h-full bg-indigo-500 rounded-full transition-all duration-1000"></div>
             </div>
          </div>

          <div className="glass rounded-3xl p-8 border-slate-800/40">
            <h3 className="font-black text-[10px] mb-6 flex items-center gap-3 tracking-widest text-slate-500 uppercase">
              <BrainCircuit size={18} className="text-indigo-400" /> Neural State
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 flex flex-col items-center bg-slate-900/20">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Mind</span>
                <span className="text-3xl">{todayLog ? MOOD_EMOJIS[todayLog.mood as any] : '—'}</span>
              </div>
              <div className="glass rounded-xl p-4 flex flex-col items-center justify-center bg-slate-900/20">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Energy</span>
                <span className="text-2xl font-black font-mono text-slate-100 tracking-tighter">{todayLog?.energy || '0'}<span className="text-[10px] text-slate-600 ml-1">/10</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
