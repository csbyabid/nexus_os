
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy, History, Save } from 'lucide-react';

interface StudyTimerProps {
  onComplete: (seconds: number) => void;
  personalBest: number;
  previousDay: number;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onComplete, personalBest, previousDay }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (seconds > 0) {
      onComplete(seconds);
      setSeconds(0);
      setIsActive(false);
    }
  };

  return (
    <div className="glass border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4 shadow-lg">
      <div className="text-center">
        <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Synaptic Sync Active</div>
        <div className="text-3xl font-black mono tracking-tight text-white tabular-nums">{formatTime(seconds)}</div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isActive ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          }`}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button 
          onClick={() => { setSeconds(0); setIsActive(false); }}
          className="w-10 h-10 rounded-xl bg-white/5 text-zinc-600 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
        <button 
          onClick={handleSave}
          disabled={seconds === 0}
          className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-all disabled:opacity-20 disabled:grayscale"
        >
          <Save size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full pt-3 border-t border-white/5">
        <div className="text-center">
          <div className="text-[7px] font-black text-zinc-600 uppercase mb-0.5">Best</div>
          <div className="text-[10px] font-mono text-zinc-400">{formatTime(personalBest)}</div>
        </div>
        <div className="text-center">
          <div className="text-[7px] font-black text-zinc-600 uppercase mb-0.5">Prior</div>
          <div className="text-[10px] font-mono text-zinc-400">{formatTime(previousDay)}</div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
