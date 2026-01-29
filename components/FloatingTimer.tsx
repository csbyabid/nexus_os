
import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Save, Zap, ChevronDown } from 'lucide-react';

interface FloatingTimerProps {
  isRunning: boolean;
  startTime: number | null;
  accumulatedSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSave: (seconds: number) => void;
}

const FloatingTimer: React.FC<FloatingTimerProps> = ({ 
  isRunning, startTime, accumulatedSeconds, onStart, onPause, onReset, onSave 
}) => {
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateDisplay = () => {
      if (isRunning && startTime) {
        setDisplaySeconds(accumulatedSeconds + Math.floor((Date.now() - startTime) / 1000));
      } else {
        setDisplaySeconds(accumulatedSeconds);
      }
    };
    updateDisplay();
    const int = setInterval(updateDisplay, 1000);
    return () => clearInterval(int);
  }, [isRunning, startTime, accumulatedSeconds]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-[7.5rem] right-8 z-[999] flex flex-col items-end gap-4 pointer-events-none">
      {isExpanded && (
        <div className="w-64 glass-vibrant rounded-3xl p-6 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">Neural Sync Active</span>
            <button onClick={() => setIsExpanded(false)} className="text-zinc-600 hover:text-white transition-colors">
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl font-black font-mono tracking-tighter text-white tabular-nums">
              {formatTime(displaySeconds)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={isRunning ? onPause : onStart} className={`h-11 rounded-xl flex items-center justify-center transition-all ${isRunning ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'}`}>
              {isRunning ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button onClick={onReset} className="h-11 rounded-xl glass text-zinc-500 flex items-center justify-center hover:text-white transition-all">
              <RotateCcw size={16} />
            </button>
            <button onClick={() => onSave(displaySeconds)} disabled={displaySeconds === 0} className="h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center disabled:opacity-20 transition-all">
              <Save size={16} />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`pointer-events-auto w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all shadow-2xl relative border border-white/5 ${isRunning ? 'bg-indigo-600' : 'bg-slate-900/80 backdrop-blur-md'}`}
      >
        {isRunning ? (
          <div className="flex flex-col items-center">
            <Zap size={18} className="text-white animate-pulse mb-0.5" />
            <span className="text-[8px] font-black text-white/80 font-mono tracking-tighter">
              {formatTime(displaySeconds).split(':').slice(0,2).join(':')}
            </span>
          </div>
        ) : (
          <Timer size={22} className="text-slate-400 group-hover:text-white" />
        )}
      </button>
    </div>
  );
};

export default FloatingTimer;
