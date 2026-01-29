
import React, { useState, useMemo } from 'react';
import { AppState, FitnessLog, Exercise } from '../types';
import { Dumbbell, Plus, TrendingUp, Apple, Info, Trash2, Scale, Target, Activity, Zap, Gauge, Flame, Shield, X } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import DirectiveBanner from './DirectiveBanner';

interface FitnessViewProps {
  state: AppState;
  addLog: (log: FitnessLog) => void;
}

const FitnessView: React.FC<FitnessViewProps> = ({ state, addLog }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [weight, setWeight] = useState<string>('70.0');
  const [cals, setCals] = useState(2000);
  const [protein, setProtein] = useState(140);
  const [workout, setWorkout] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [intensity, setIntensity] = useState(5);
  
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState(3);
  const [exReps, setExReps] = useState('10');
  const [exWeight, setExWeight] = useState('');

  const handleAddExercise = () => {
    if (!exName) return;
    setExercises([...exercises, {
      id: Math.random().toString(),
      name: exName.toUpperCase(),
      sets: exSets,
      reps: exReps,
      weight: exWeight ? parseFloat(exWeight) : undefined
    }]);
    setExName('');
  };

  const handleAddLog = () => {
    addLog({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight),
      calories: cals,
      protein,
      workoutType: workout.toUpperCase(),
      exercises,
      intensity,
      notes: ''
    });
    setShowAdd(false);
    setExercises([]);
    setWorkout('');
    setIntensity(5);
  };

  const weightData = state.fitness.slice().reverse().map(l => ({
    date: l.date.split('-').slice(1).join('/'),
    weight: l.weight
  }));

  const latestLog = state.fitness[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 px-1 pb-10">
      <DirectiveBanner category="fitness" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Activity className="text-emerald-500" size={24} /> Biometric Engine
          </h1>
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mt-2">Cellular Optimization Base</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-2xl text-[11px] font-black text-white uppercase shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
          <Plus size={16} /> Log Biometrics
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card rounded-[2.5rem] p-8">
           <div className="flex justify-between items-center mb-10">
              <h2 className="text-[12px] font-black text-zinc-400 uppercase flex items-center gap-2 tracking-widest"><Scale size={18} className="text-emerald-500" /> Mass Trajectory</h2>
              <div className="flex gap-6">
                 <div className="text-right">
                    <span className="text-[10px] text-zinc-600 font-black uppercase block tracking-widest">Target</span>
                    <span className="text-lg font-black text-indigo-400 tabular-nums">{state.profile.targets.weight}kg</span>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] text-zinc-600 font-black uppercase block tracking-widest">Latest</span>
                    <span className="text-lg font-black text-emerald-400 tabular-nums">{latestLog?.weight || '0.0'}kg</span>
                 </div>
              </div>
           </div>
           <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={weightData}>
                    <defs>
                       <linearGradient id="weightG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis dataKey="date" stroke="#444" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#09090b', border: '1px solid #222', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    <Area type="monotone" dataKey="weight" stroke="#10b981" fill="url(#weightG)" strokeWidth={3} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 glass-card rounded-[2.5rem] p-8 flex flex-col justify-between border-white/10 shadow-xl">
           <h2 className="text-[12px] font-black text-zinc-400 uppercase flex items-center gap-2 mb-8 tracking-widest"><Apple size={18} className="text-orange-500" /> Saturation</h2>
           <div className="space-y-8">
              <div className="space-y-3">
                 <div className="flex justify-between text-[11px] font-black uppercase text-zinc-500 tracking-widest">
                    <span>Protein Density</span>
                    <span className="text-indigo-400">{latestLog?.protein || 0} / {state.profile.targets.protein}g</span>
                 </div>
                 <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-indigo-700 to-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${Math.min(100, ((latestLog?.protein || 0)/state.profile.targets.protein)*100)}%` }}></div>
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[11px] font-black uppercase text-zinc-500 tracking-widest">
                    <span>Fuel Reserve</span>
                    <span className="text-emerald-400">{latestLog?.calories || 0} / {state.profile.targets.calories}</span>
                 </div>
                 <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-emerald-700 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${Math.min(100, ((latestLog?.calories || 0)/state.profile.targets.calories)*100)}%` }}></div>
                 </div>
              </div>
           </div>
           <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-[11px] font-black text-zinc-600 uppercase tracking-widest">
                 <Shield className="text-emerald-500/50" size={14} /> System Baseline Synced
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {state.fitness.map(log => (
           <div key={log.id} className="p-6 glass-card rounded-3xl space-y-5 group hover:border-white/20 transition-all cursor-default">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">{log.date}</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{log.workoutType || 'Biometric Check'}</h3>
                 </div>
                 <div className="text-right">
                    <div className="text-xl font-black font-mono text-emerald-400 tracking-tighter">{log.weight}<span className="text-[11px] text-zinc-600 ml-1">kg</span></div>
                 </div>
              </div>
              <div className="flex flex-wrap gap-2">
                 {log.exercises.length > 0 ? log.exercises.map((ex, i) => (
                    <span key={i} className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-xl text-[11px] font-black text-zinc-400 uppercase tracking-wide group-hover:text-white transition-colors">{ex.name}</span>
                 )) : (
                    <span className="text-[11px] font-black text-zinc-700 uppercase tracking-widest italic">No Exercises Recorded</span>
                 )}
              </div>
              <div className="flex items-center gap-4 text-[11px] font-black text-zinc-500 uppercase tracking-widest pt-2 border-t border-white/5">
                 <div className="flex items-center gap-1.5"><Flame size={12} className="text-orange-500" /> {log.calories} KCAL</div>
                 <div className="flex items-center gap-1.5"><Zap size={12} className="text-indigo-400" /> {log.protein}g PRO</div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default FitnessView;
