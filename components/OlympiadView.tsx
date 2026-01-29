
import React, { useState, useRef } from 'react';
import { AppState, Chapter, Subject, OlympiadResource } from '../types';
import { Trophy, Target, Zap, Youtube, Globe, FileText, Plus, ExternalLink, X, Activity, Calendar, BookOpen } from 'lucide-react';
import DirectiveBanner from './DirectiveBanner';

interface OlympiadViewProps {
  state: AppState;
  addSubject: (s: Subject) => void;
  updateChapter: (sId: string, cId: string, updates: Partial<Chapter>) => void;
  updateExtra: (sId: string, updates: { syllabusUrl?: string, resources?: OlympiadResource[] }) => void;
}

const OlympiadView: React.FC<OlympiadViewProps> = ({ state, addSubject, updateChapter, updateExtra }) => {
  const olySubjects = state.subjects.filter(s => s.category === 'Olympiad');
  const [showResourceModal, setShowResourceModal] = useState<string | null>(null);
  const [showAddOlyModal, setShowAddOlyModal] = useState(false);
  const [newRes, setNewRes] = useState<Partial<OlympiadResource>>({ type: 'youtube', title: '', url: '' });
  const [newOlyName, setNewOlyName] = useState('');
  const [newOlyDate, setNewOlyDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const countdown = (target: string) => {
    const diff = new Date(target).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleFileUpload = (subjectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateExtra(subjectId, { syllabusUrl: url });
    }
  };

  const handleAddOly = () => {
    if (!newOlyName) return;
    addSubject({
      id: Math.random().toString(36).substr(2, 9),
      name: newOlyName.toUpperCase(),
      category: 'Olympiad',
      targetDate: newOlyDate || undefined,
      chapters: [],
      resources: []
    });
    setNewOlyName('');
    setNewOlyDate('');
    setShowAddOlyModal(false);
  };

  const addResource = (subjectId: string) => {
    if (!newRes.title || !newRes.url) return;
    const subject = state.subjects.find(s => s.id === subjectId);
    const updated = [...(subject?.resources || []), { ...newRes, id: Math.random().toString() } as OlympiadResource];
    updateExtra(subjectId, { resources: updated });
    setNewRes({ type: 'youtube', title: '', url: '' });
    setShowResourceModal(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24 px-1">
      <DirectiveBanner category="olympiad" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-4">
            <Trophy className="text-amber-500" size={32} /> Competitive Intel
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] opacity-70">
            {state.profile.subtitles.olympiad}
          </p>
        </div>
        <button 
          onClick={() => setShowAddOlyModal(true)}
          className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Inject Intelligence Unit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {olySubjects.map(sub => (
          <div key={sub.id} className="glass-vibrant border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-all transform group-hover:scale-125 duration-1000 pointer-events-none">
               <Trophy size={150} />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-white">{sub.name}</h2>
                {sub.targetDate && (
                  <div className="flex items-center gap-3 text-indigo-400 font-black text-[11px] uppercase tracking-widest">
                    <Calendar size={16} /> T-Minus {countdown(sub.targetDate)} Days
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  if (sub.syllabusUrl) window.open(sub.syllabusUrl, '_blank');
                  else {
                    setActiveUploadId(sub.id);
                    fileInputRef.current?.click();
                  }
                }}
                className={`flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black transition-all tracking-widest uppercase border ${
                  sub.syllabusUrl ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10'
                }`}
              >
                <FileText size={16} /> {sub.syllabusUrl ? 'SYLLABUS_DEPLOYED' : 'UPLOAD_SYLLABUS'}
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                <Target size={18} className="text-indigo-500" /> Subject Matrix
              </div>
              <div className="grid grid-cols-1 gap-3">
                {sub.chapters.map(chap => (
                  <div key={chap.id} className="flex items-center justify-between p-6 bg-zinc-950/40 rounded-[2rem] border border-white/5 group/item hover:border-indigo-500/30 transition-all">
                    <span className="text-base font-black text-zinc-200 group-hover/item:text-white transition-colors tracking-tight">{chap.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-xs font-black font-mono text-indigo-400">{chap.confidence}%</div>
                      <button 
                        onClick={() => updateChapter(sub.id, chap.id, { confidence: Math.min(100, chap.confidence + 5) })}
                        className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all transform hover:rotate-6 active:scale-90 shadow-lg"
                      >
                        <Zap size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {sub.chapters.length === 0 && (
                   <div className="py-8 text-center border border-dashed border-white/10 rounded-3xl text-zinc-600 italic font-bold text-xs opacity-50">
                     No topics injected into matrix.
                   </div>
                )}
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between px-2">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <Activity size={18} className="text-indigo-500" /> Intellectual Repository
                </div>
                <button 
                  onClick={() => setShowResourceModal(sub.id)}
                  className="p-3 bg-white/5 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-xl"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {sub.resources?.map(res => (
                  <a 
                    key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-5 p-6 bg-black/40 border border-white/5 rounded-[2rem] hover:bg-black hover:border-white/20 transition-all group/res shadow-xl"
                  >
                    <div className="p-4 bg-white/5 rounded-2xl group-hover/res:bg-indigo-600/10 transition-colors">
                      {res.type === 'youtube' ? <Youtube className="text-rose-500" size={24} /> : <Globe className="text-blue-400" size={24} />}
                    </div>
                    <span className="flex-1 text-sm font-black tracking-tight text-zinc-400 group-hover/res:text-white truncate">{res.title}</span>
                    <ExternalLink size={16} className="text-zinc-700 group-hover/res:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <input 
        type="file" ref={fileInputRef} className="hidden" 
        accept="application/pdf" onChange={(e) => activeUploadId && handleFileUpload(activeUploadId, e)} 
      />

      {/* Deployment Modal */}
      {showAddOlyModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="glass-vibrant border border-white/10 rounded-[4rem] p-16 w-full max-w-2xl shadow-3xl">
            <div className="flex justify-between items-center mb-16">
              <div className="space-y-1">
                <h3 className="text-4xl font-black tracking-tight text-white uppercase">Initialize Unit</h3>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] ml-1">Olympiad Deployment Protocol</p>
              </div>
              <button onClick={() => setShowAddOlyModal(false)} className="w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center text-zinc-500 hover:text-rose-500 transition-all shadow-xl">
                <X size={32} />
              </button>
            </div>
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-4">Subject Designation</label>
                <input 
                  placeholder="e.g. ECONOMICS OLYMPIAD"
                  value={newOlyName} onChange={e => setNewOlyName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-7 text-xl font-black text-white outline-none focus:border-indigo-500 shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-4">Temporal Anchor (Exam Date)</label>
                <input 
                  type="date"
                  value={newOlyDate} onChange={e => setNewOlyDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-7 text-lg font-bold text-white outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                onClick={handleAddOly}
                className="w-full py-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[3rem] transition-all shadow-3xl shadow-indigo-600/50 text-2xl tracking-widest uppercase mt-6 transform hover:-translate-y-2"
              >
                DEPLOY UNIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in zoom-in-95 duration-200">
          <div className="glass-vibrant border border-white/10 rounded-[3.5rem] p-12 w-full max-w-xl shadow-3xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black tracking-tight text-white uppercase">Inject Intel</h3>
              <button onClick={() => setShowResourceModal(null)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-rose-500 transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-8">
              <div className="flex gap-4 p-2 bg-black/60 rounded-3xl border border-white/5 shadow-inner">
                {(['youtube', 'web'] as const).map(type => (
                  <button 
                    key={type}
                    onClick={() => setNewRes({...newRes, type})}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${newRes.type === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Resource Descriptor</label>
                <input 
                  placeholder="e.g. MACROECONOMICS CORE THEORY"
                  value={newRes.title} onChange={e => setNewRes({...newRes, title: e.target.value.toUpperCase()})}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-sm font-black text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Stream Link (URL)</label>
                <input 
                  placeholder="HTTPS://..."
                  value={newRes.url} onChange={e => setNewRes({...newRes, url: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-sm font-black text-white outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                onClick={() => addResource(showResourceModal)}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[2rem] transition-all shadow-xl shadow-indigo-600/30 text-lg tracking-widest uppercase mt-4"
              >
                COMMIT INTEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OlympiadView;
