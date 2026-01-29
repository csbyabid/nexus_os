
import React, { useState, useMemo, useEffect } from 'react';
import { Music, X, RefreshCw, ExternalLink, Volume2, AudioLines, Sparkles, AlertTriangle } from 'lucide-react';

interface MusicWidgetProps {
  url: string;
}

const MusicWidget: React.FC<MusicWidgetProps> = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBooted, setIsBooted] = useState(false);
  const [key, setKey] = useState(0); 

  // Robust parsing for YouTube and Spotify
  const streamData = useMemo(() => {
    if (!url) return null;
    
    // Improved YouTube Regex for all formats
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      // Use clean standard embed link
      return {
        type: 'YOUTUBE',
        embed: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&modestbranding=1&rel=0`
      };
    }
    
    // Spotify: tracks, playlists, albums
    const spotifyRegex = /spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/;
    const spotMatch = url.match(spotifyRegex);
    if (spotMatch) {
      return {
        type: 'SPOTIFY',
        embed: `https://open.spotify.com/embed/${spotMatch[1]}/${spotMatch[2]}?utm_source=generator&theme=0`
      };
    }
    
    return { type: 'INVALID', embed: null };
  }, [url, key]);

  // Reset boot state when URL changes significantly
  useEffect(() => {
    setIsBooted(false);
  }, [url]);

  if (!url) return null;

  const isInvalid = streamData?.type === 'INVALID';

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end gap-4 pointer-events-none">
      {isOpen && (
        <div className="w-80 h-[28rem] glass-vibrant rounded-[3rem] shadow-3xl overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-5 duration-500 flex flex-col border border-white/10">
          {/* Header */}
          <div className="h-16 bg-black/60 backdrop-blur-3xl flex items-center justify-between px-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <AudioLines size={18} className={`${!isInvalid ? 'text-indigo-400 animate-pulse' : 'text-zinc-600'}`} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-100">Neural Stream</span>
            </div>
            <div className="flex items-center gap-3">
              {!isInvalid && (
                <button onClick={() => { setIsBooted(false); setKey(k => k + 1); }} className="p-2 text-zinc-600 hover:text-indigo-400 transition-all hover:rotate-180 duration-700">
                  <RefreshCw size={14} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-600 hover:text-rose-500 transition-all">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-black/30 relative flex flex-col">
            {isInvalid ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <AlertTriangle size={28} className="text-rose-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Signal Corruption</h4>
                  <p className="text-[9px] font-bold text-zinc-600 leading-relaxed uppercase">Neural coordinate link unrecognized (YouTube/Spotify only).</p>
                </div>
              </div>
            ) : !isBooted ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-xl">
                  <Volume2 size={32} className="text-indigo-400" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Encrypted Stream</h4>
                  <p className="text-[10px] font-medium text-zinc-500 leading-relaxed px-4 italic">Initialize temporal handshake to bridge audio signal.</p>
                </div>
                <button 
                  onClick={() => setIsBooted(true)}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-indigo-600/40 group font-black text-[11px] uppercase tracking-[0.3em]"
                >
                  <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                  INITIATE SYNC
                </button>
              </div>
            ) : (
              <div className="w-full h-full relative">
                 <iframe
                  key={key}
                  src={streamData?.embed || ''}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  title="Nexus Neural Player"
                ></iframe>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-black/50 border-t border-white/5">
             <button 
               onClick={() => window.open(url, '_blank')}
               className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center gap-3 transition-all group"
             >
               <ExternalLink size={14} className="text-zinc-500 group-hover:text-indigo-400" />
               <span className="text-[10px] font-black text-zinc-500 group-hover:text-white uppercase tracking-[0.2em]">Source Command</span>
             </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all shadow-3xl relative group overflow-hidden border border-white/10 ${
          isOpen 
            ? 'bg-rose-600 rotate-90 scale-90' 
            : isInvalid 
              ? 'bg-zinc-800' 
              : 'bg-indigo-600 hover:scale-110 active:scale-95 shadow-indigo-600/50'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? (
          <X size={28} className="text-white" />
        ) : isInvalid ? (
          <AlertTriangle size={24} className="text-rose-500 animate-pulse" />
        ) : (
          <Music size={28} className="text-white" />
        )}
        
        {!isOpen && !isInvalid && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#020617] animate-bounce"></div>
        )}
      </button>
    </div>
  );
};

export default MusicWidget;
