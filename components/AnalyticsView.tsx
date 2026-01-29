
import React, { useEffect, useState, useMemo } from 'react';
import { AppState } from '../types';
import { getAIFeedback } from '../services/geminiService';
import { 
  XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid
} from 'recharts';
import { Sparkles, TrendingUp, Zap, BrainCircuit, RefreshCcw, Database, BarChart3, Activity } from 'lucide-react';

interface AnalyticsViewProps {
  state: AppState;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ state }) => {
  const [aiFeedback, setAiFeedback] = useState<{ summary: string; recommendations: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchAI = async () => {
      if (state.logs.length === 0) return;
      setLoading(true);
      try {
        const feedback = await getAIFeedback(state);
        setAiFeedback(feedback);
      } catch (err) {
        console.error("Failed to fetch AI feedback", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, [state.logs.length, refreshKey]);

  const chartData = useMemo(() => {
    return state.logs.slice(-14).map(log => ({
      date: log.date.split('-').slice(1).join('/'),
      mood: log.mood,
      focus: log.focusScore,
      energy: log.energy,
      study: (log.studyTimeSeconds || 0) / 3600
    }));
  }, [state.logs]);

  const stats = useMemo(() => {
    if (state.logs.length === 0) return null;
    const avgFocus = state.logs.reduce((a, b) => a + b.focusScore, 0) / state.logs.length;
    const totalStudy = state.logs.reduce((a, b) => a + (b.studyTimeSeconds || 0), 0) / 3600;
    return { avgFocus, totalStudy };
  }, [state.logs]);

  if (state.logs.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-center text-zinc-700">
           <Database size={24} className="animate-pulse" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-black text-white mb-1">Analytical Vacuum</h1>
          <p className="text-zinc-600 font-bold uppercase tracking-widest text-[8px] opacity-60">
             Complete a daily log to generate synthesis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">Behavioral Synthesis</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] opacity-70 italic">
            {state.profile.subtitles.analytics}
          </p>
        </div>
        <button 
          onClick={() => setRefreshKey(k => k + 1)}
          disabled={loading}
          className="p-3 bg-white/5 border border-white/10 rounded-xl text-indigo-400 hover:bg-white/10 transition-all disabled:opacity-30"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <section className="bg-gradient-to-br from-indigo-900/40 via-zinc-950 to-zinc-950 rounded-3xl p-8 relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <BrainCircuit size={120} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-yellow-400" />
            <h2 className="text-lg font-black tracking-tight">Mentorship Insight</h2>
          </div>
          
          {loading ? (
            <div className="space-y-3">
               <div className="h-3 bg-white/5 rounded-full w-full animate-pulse"></div>
               <div className="h-3 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm leading-relaxed font-bold italic text-zinc-200">
                "{aiFeedback?.summary || "Analyzing synaptic patterns..."}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiFeedback?.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 glass rounded-xl p-4 transition-all">
                    <Zap size={12} className="text-yellow-400 mt-0.5 shrink-0" />
                    <span className="text-[10px] font-bold leading-snug text-zinc-400">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black flex items-center gap-2 tracking-tight">
              <BarChart3 size={14} className="text-emerald-500" /> Kinetic Trends
            </h3>
            <div className="flex gap-3 text-[7px] font-black uppercase tracking-widest text-zinc-500">
               <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-500"></div> Focus</div>
               <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500"></div> Output</div>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="date" stroke="#333" fontSize={8} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #222', borderRadius: '12px', fontSize: '9px' }}
                />
                <Area type="monotone" dataKey="focus" stroke="#6366f1" fill="#6366f111" strokeWidth={2} />
                <Area type="monotone" dataKey="study" stroke="#10b981" fill="none" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
           <div className="glass rounded-2xl p-6 flex flex-col justify-center">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Output</span>
              <div className="text-3xl font-black font-mono tracking-tighter text-emerald-400">{stats?.totalStudy.toFixed(1)} <span className="text-[10px] ml-1 text-zinc-700">HRS</span></div>
              <div className="mt-3 text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 text-zinc-700">
                <TrendingUp size={10} className="text-emerald-500" /> Active
              </div>
           </div>
           
           <div className="glass rounded-2xl p-6 flex flex-col justify-center">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Mean Focus</span>
              <div className="text-3xl font-black font-mono tracking-tighter text-indigo-400">{stats?.avgFocus.toFixed(1)} <span className="text-[10px] ml-1 text-zinc-700">Q</span></div>
              <div className="mt-3 text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 text-zinc-700">
                <Activity size={10} className="text-indigo-400" /> Synaptic
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
