
import React, { useMemo } from 'react';
import { Quote, Zap, BrainCircuit } from 'lucide-react';
import { SYSTEM_QUOTES } from '../constants';

interface DirectiveBannerProps {
  category: string;
}

const DirectiveBanner: React.FC<DirectiveBannerProps> = ({ category }) => {
  const quote = useMemo(() => {
    const list = SYSTEM_QUOTES[category] || SYSTEM_QUOTES.dashboard;
    return list[Math.floor(Math.random() * list.length)];
  }, [category]);

  return (
    <div className="w-full glass-vibrant border-indigo-500/20 rounded-2xl p-5 flex items-start gap-5 animate-in fade-in slide-in-from-top-4 duration-1000 overflow-hidden group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent pointer-events-none"></div>
      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 border border-white/10 shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-110 group-hover:rotate-6">
        <Quote size={20} className="text-white" />
      </div>
      <div className="space-y-1 relative z-10">
        <div className="flex items-center gap-2">
          <BrainCircuit size={12} className="text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Cognitive Directive</span>
        </div>
        <p className="text-base font-bold text-white italic leading-tight tracking-tight">"{quote}"</p>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
        <Quote size={80} className="text-white" />
      </div>
    </div>
  );
};

export default DirectiveBanner;
