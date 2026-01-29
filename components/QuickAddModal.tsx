
import React, { useState } from 'react';
import { X, Save, Thermometer, Weight, Brain, Sparkles, ShieldAlert } from 'lucide-react';
import { DailyLog, Mood } from '../types';
import { MOOD_EMOJIS } from '../constants';

interface QuickAddModalProps {
  onClose: () => void;
  onSave: (log: DailyLog) => void;
  isMandatory?: boolean;
  defaultWeight: number;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ onClose, onSave, isMandatory = false, defaultWeight }) => {
  const [formData, setFormData] = useState<Partial<DailyLog>>({
    date: new Date().toISOString().split('T')[0],
    mood: 5 as Mood,
    energy: 5,
    weight: defaultWeight,
    journal: '',
    focusScore: 5,
    focusTarget: 4, // Default target
    studyTimeSeconds: 0,
    distractions: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as DailyLog);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-900/10 to-transparent">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black flex items-center gap-3 text-white tracking-tight">
                {isMandatory ? <ShieldAlert className="text-rose-500" size={24} /> : <Sparkles className="text-indigo-400" size={24} />}
                {isMandatory ? "Initial Neural Handshake" : "Daily Check-In"}
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                {isMandatory ? "Access restricted until daily telemetry is logged" : "Syncing consciousness to matrix"}
              </p>
            </div>
            {!isMandatory && (
              <button type="button" onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-zinc-500 transition-colors">
                <X size={24} />
              </button>
            )}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {/* Mood Picker */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block px-1">Mindset Polarity</label>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: m as Mood })}
                    className={`h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${
                      formData.mood === m 
                        ? 'bg-indigo-600 border-indigo-500 text-white scale-105 shadow-xl shadow-indigo-600/30' 
                        : 'bg-white/5 border-white/5 text-zinc-600 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{MOOD_EMOJIS[m]}</span>
                    <span className="text-[9px] font-black">{m}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Range Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 px-1">
                  <Thermometer size={14} className="text-indigo-400" /> Energy Reserves: {formData.energy}
                </label>
                <input 
                  type="range" min="1" max="10" 
                  value={formData.energy} 
                  onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 px-1">
                  <Brain size={14} className="text-emerald-400" /> Focus Quality: {formData.focusScore}
                </label>
                <input 
                  type="range" min="1" max="10" 
                  value={formData.focusScore} 
                  onChange={(e) => setFormData({...formData, focusScore: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 px-1">
                  <Weight size={14} className="text-indigo-400" /> Current Mass (kg)
                </label>
                <input 
                  type="number" step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-colors text-white font-black font-mono text-xl"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 px-1">
                  <Brain size={14} className="text-emerald-400" /> Focus Target (h)
                </label>
                <input 
                  type="number" step="0.5"
                  value={formData.focusTarget}
                  onChange={(e) => setFormData({...formData, focusTarget: parseFloat(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 transition-colors text-white font-black font-mono text-xl"
                />
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Daily Commitment</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Daily Log / Insights</label>
              <textarea 
                placeholder="Operational summary..."
                rows={3}
                value={formData.journal}
                onChange={(e) => setFormData({...formData, journal: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 outline-none focus:border-indigo-500 transition-colors resize-none text-sm font-bold leading-relaxed text-zinc-300"
              ></textarea>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-white/5 flex gap-4 bg-zinc-950/50">
            {!isMandatory && (
              <button 
                type="button" onClick={onClose}
                className="flex-1 py-5 rounded-3xl border border-white/10 hover:bg-white/5 transition-all font-black text-[11px] uppercase tracking-[0.2em] text-zinc-500"
              >
                ABORT
              </button>
            )}
            <button 
              type="submit"
              className="flex-[2] py-5 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-600/40 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Save size={18} />
              COMMIT TELEMETRY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;
