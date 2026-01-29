
import React, { useState, useMemo, useEffect } from 'react';
import { AppState, UserProfile } from '../types';
import { 
  User, 
  Save, 
  PenLine, 
  Settings, 
  Target, 
  Layers, 
  CloudDownload, 
  CloudUpload, 
  HardDrive, 
  Music, 
  Youtube, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Calendar,
  Timer,
  ExternalLink
} from 'lucide-react';

interface ProfileViewProps {
  state: AppState;
  updateProfile: (p: UserProfile) => void;
  onImport: (data: any) => void;
  onExport: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ state, updateProfile, onImport, onExport }) => {
  const [profile, setProfile] = useState<UserProfile>(state.profile);

  useEffect(() => {
    setProfile(state.profile);
  }, [state.profile]);

  const handleSave = () => {
    updateProfile(profile);
    alert("System configuration updated. All temporal anchors synchronized.");
  };

  const musicInfo = useMemo(() => {
    if (!profile.musicUrl) return { valid: false, platform: 'NONE' };
    if (profile.musicUrl.includes('youtube.com') || profile.musicUrl.includes('youtu.be')) {
      return { valid: true, platform: 'YOUTUBE' };
    }
    if (profile.musicUrl.includes('spotify.com')) {
      return { valid: true, platform: 'SPOTIFY' };
    }
    return { valid: false, platform: 'UNKNOWN' };
  }, [profile.musicUrl]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImport(json);
        alert("Intelligence successfully re-injected. System state synchronized.");
        e.target.value = '';
      } catch (err) {
        alert("Invalid data structure detected.");
      }
    };
    reader.readAsText(file);
  };

  const pages = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tracker', label: 'Study Tracker' },
    { id: 'habits', label: 'Habit Tracker' },
    { id: 'academic', label: 'Academic/HSC' },
    { id: 'olympiad', label: 'Olympiad' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'profile', label: 'Profile' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-4xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-4 px-2">
        <div className="relative group">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl transition-transform group-hover:rotate-6 group-hover:scale-105">
            {profile.name.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-zinc-900 p-2 rounded-xl border border-white/10 text-indigo-400 shadow-xl">
             <Settings size={16} />
          </div>
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white">{profile.name}</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[9px] opacity-60 italic">System Architect & Operations Director</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {/* Identity & Global Directive */}
        <div className="glass border border-white/10 rounded-3xl p-7 space-y-6">
          <h2 className="text-lg font-black flex items-center gap-3 text-white tracking-tight">
            <User className="text-indigo-400" size={18} /> Identity Protocol
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Display Designation</label>
              <input 
                type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3.5 focus:border-indigo-500 outline-none text-xs font-bold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Master Goal Directive</label>
              <textarea 
                value={profile.goal} onChange={e => setProfile({...profile, goal: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-3.5 h-28 focus:border-indigo-500 outline-none resize-none text-xs font-bold leading-relaxed transition-all"
              />
            </div>
          </div>
        </div>

        {/* Biometric Benchmarks */}
        <div className="glass border border-white/10 rounded-3xl p-7 space-y-6">
          <h2 className="text-lg font-black flex items-center gap-3 text-white tracking-tight">
            <Target className="text-emerald-400" size={18} /> Optimization Goals
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Weight Target (kg)', key: 'weight', step: '0.1' },
              { label: 'Study Quota (h/day)', key: 'dailyStudyHours' },
              { label: 'KCal Fuel Goal', key: 'calories' },
              { label: 'Protein (g/day)', key: 'protein' }
            ].map((field, idx) => (
              <div key={idx} className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{field.label}</label>
                <input 
                  type="number" step={field.step || '1'} 
                  value={(profile.targets as any)[field.key]} 
                  onChange={e => setProfile({...profile, targets: {...profile.targets, [field.key]: parseFloat(e.target.value)}})} 
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold focus:border-emerald-500 outline-none transition-all" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Temporal Anchor Calibration (Countdowns) */}
        <div className="glass border border-white/10 rounded-3xl p-7 space-y-6 md:col-span-2">
          <h2 className="text-lg font-black flex items-center gap-3 text-white tracking-tight">
            <Timer className="text-blue-400" size={18} /> Temporal Anchor Synchronization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HSC Calibration */}
            <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 text-cyan-400">HSC Exam Anchor</div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-zinc-600 uppercase">Label</label>
                  <input type="text" value={profile.hscLabel} onChange={e => setProfile({...profile, hscLabel: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-zinc-600 uppercase">Date</label>
                  <input type="date" value={profile.hscExamDate} onChange={e => setProfile({...profile, hscExamDate: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-cyan-500" />
                </div>
              </div>
            </div>
            {/* Bio Oly Calibration */}
            <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 text-emerald-400">Bio Oly Anchor</div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-zinc-600 uppercase">Label</label>
                  <input type="text" value={profile.bioOlyLabel} onChange={e => setProfile({...profile, bioOlyLabel: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-zinc-600 uppercase">Date</label>
                  <input type="date" value={profile.bioOlyDate} onChange={e => setProfile({...profile, bioOlyDate: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
             {/* Econ Oly Calibration */}
             <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 text-amber-400">Econ Oly Anchor</div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-zinc-600 uppercase">Label</label>
                  <input type="text" value={profile.econOlyLabel} onChange={e => setProfile({...profile, econOlyLabel: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-amber-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-zinc-600 uppercase">Date</label>
                  <input type="date" value={profile.econOlyDate} onChange={e => setProfile({...profile, econOlyDate: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Acoustic Hub */}
        <div className="glass border border-white/10 rounded-3xl p-7 space-y-6 md:col-span-2 bg-gradient-to-r from-indigo-600/5 to-transparent">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black flex items-center gap-3 text-white tracking-tight">
              <Music className="text-rose-400" size={18} /> Neuro-Acoustic Hub
            </h2>
            {musicInfo.valid ? (
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-pulse">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Signal Locked: {musicInfo.platform}</span>
               </div>
            ) : profile.musicUrl ? (
               <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                  <AlertCircle size={12} className="text-rose-500" />
                  <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Invalid Logic Link</span>
               </div>
            ) : (
               <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">No Stream Active</span>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Neural Stream Link (Commit Required to Activate)</label>
                {profile.musicUrl && (
                  <button onClick={() => window.open(profile.musicUrl, '_blank')} className="text-[8px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
                    <ExternalLink size={10} /> Open Link
                  </button>
                )}
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors">
                   {musicInfo.platform === 'YOUTUBE' ? <Youtube size={18} /> : musicInfo.platform === 'SPOTIFY' ? <Zap size={18} /> : <Music size={18} />}
                </div>
                <input 
                  type="text" 
                  placeholder="Paste YouTube or Spotify URL..."
                  value={profile.musicUrl || ''} 
                  onChange={e => setProfile({...profile, musicUrl: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:border-indigo-500 outline-none text-xs font-bold transition-all placeholder:text-zinc-800 text-white"
                />
              </div>
            </div>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest px-1">Important: Commit update to synchronize stream with the tactical interface.</p>
          </div>
        </div>

        {/* Intelligence Portability */}
        <div className="glass border border-white/10 rounded-3xl p-7 space-y-6 md:col-span-2 bg-gradient-to-r from-indigo-600/5 to-transparent">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black flex items-center gap-3 text-white tracking-tight">
              <HardDrive className="text-indigo-400" size={18} /> Consciousness Backup
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button 
                onClick={onExport}
                className="flex items-center justify-center gap-3 px-6 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
             >
                <CloudDownload className="text-indigo-400 group-hover:scale-110 transition-transform" size={20} />
                <div className="text-left">
                   <div className="text-xs font-black text-white uppercase tracking-widest">Export Intelligence</div>
                   <div className="text-[8px] font-bold text-zinc-600 uppercase">Save local state to JSON</div>
                </div>
             </button>
             <label className="flex items-center justify-center gap-3 px-6 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group cursor-pointer relative overflow-hidden">
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                <CloudUpload className="text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
                <div className="text-left">
                   <div className="text-xs font-black text-white uppercase tracking-widest">Re-Inject Matrix</div>
                   <div className="text-[8px] font-bold text-zinc-600 uppercase">Upload JSON backup file</div>
                </div>
             </label>
          </div>
        </div>

        {/* Dynamic Page Labels & Subtitles */}
        <div className="glass border border-white/10 rounded-[2.5rem] p-8 space-y-8 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black flex items-center gap-3 text-white tracking-tight">
              <Layers className="text-indigo-400" size={20} /> UX Configuration & Labels
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {pages.map(page => (
              <div key={page.id} className="grid grid-cols-2 gap-4 group">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <PenLine size={10} /> {page.label} Name
                  </label>
                  <input 
                    type="text" 
                    value={(profile.pageTitles as any)[page.id]} 
                    onChange={e => setProfile({
                      ...profile, 
                      pageTitles: { ...profile.pageTitles, [page.id]: e.target.value }
                    })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold focus:border-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <PenLine size={10} /> {page.label} Subtitle
                  </label>
                  <input 
                    type="text" 
                    value={(profile.subtitles as any)[page.id]} 
                    onChange={e => setProfile({
                      ...profile, 
                      subtitles: { ...profile.subtitles, [page.id]: e.target.value }
                    })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-bold focus:border-indigo-500 outline-none" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-2">
        <button 
          onClick={handleSave}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98]"
        >
          <Save size={18} /> COMMIT SYSTEM UPDATE
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
