
import React, { useState, useMemo } from 'react';
import { AppState, SubjectStatus, Subject, Chapter } from '../types';
import { Plus, GraduationCap, Target, Trophy, ChevronRight, Zap, Book, ShieldCheck, Quote } from 'lucide-react';
import DirectiveBanner from './DirectiveBanner';

interface AcademicViewProps {
  state: AppState;
  addSubject: (s: Subject) => void;
  addChapter: (sId: string, c: Chapter) => void;
  updateChapter: (sId: string, cId: string, updates: Partial<Chapter>) => void;
}

const AcademicView: React.FC<AcademicViewProps> = ({ state, addSubject, addChapter, updateChapter }) => {
  const [activeTab, setActiveTab] = useState<'HSC' | 'Olympiad'>('HSC');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [addingChapterTo, setAddingChapterTo] = useState<string | null>(null);
  
  const [subName, setSubName] = useState('');
  const [chapName, setChapName] = useState('');
  const [chapConf, setChapConf] = useState(50);

  const statusStyles: Record<SubjectStatus, string> = {
    'Weak': 'text-rose-500',
    'Needs Revision': 'text-yellow-500',
    'Mastered': 'text-emerald-500',
    'Olympiad-Level': 'text-indigo-500'
  };

  const handleAddSubject = () => {
    if (!subName) return;
    addSubject({
      id: Math.random().toString(36).substr(2, 9),
      name: subName.toUpperCase(),
      category: activeTab,
      chapters: [],
      resources: [],
      syllabusUrl: ''
    });
    setSubName('');
    setShowAddSubject(false);
  };

  const handleAddChapter = () => {
    if (!chapName || !addingChapterTo) return;
    addChapter(addingChapterTo, {
      id: Math.random().toString(36).substr(2, 9),
      name: chapName.toUpperCase(),
      status: 'Needs Revision',
      confidence: chapConf,
      lastRevision: new Date().toISOString().split('T')[0]
    });
    setChapName('');
    setAddingChapterTo(null);
  };

  const subjects = state.subjects.filter(s => s.category === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <DirectiveBanner category="academic" />

      <div className="flex items-center justify-between px-1">
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <Book size={18} className="text-indigo-500" /> Knowledge Matrix
        </h1>
        <div className="flex p-1 bg-black/40 rounded-lg border border-white/5">
          {(['HSC', 'Olympiad'] as const).map(tab => (
            <button
              key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black text-white uppercase tracking-tight">{subject.name}</h2>
              <button onClick={() => setAddingChapterTo(subject.id)} className="text-indigo-400 hover:scale-110 transition-transform"><Plus size={16} /></button>
            </div>
            <div className="space-y-1.5">
              {subject.chapters.map((chapter) => (
                <div key={chapter.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold text-zinc-300 uppercase">{chapter.name}</span>
                    <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${chapter.confidence}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className={`text-[7px] font-black uppercase tracking-widest ${statusStyles[chapter.status]}`}>{chapter.status}</span>
                    <input 
                      type="range" min="0" max="100" value={chapter.confidence}
                      onChange={(e) => updateChapter(subject.id, chapter.id, { confidence: parseInt(e.target.value) })}
                      className="w-8 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
              {subject.chapters.length === 0 && (
                <button onClick={() => setAddingChapterTo(subject.id)} className="w-full py-4 border border-dashed border-white/5 rounded-xl text-[8px] text-zinc-700 font-black uppercase tracking-[0.3em]">Initialize Topic</button>
              )}
            </div>
          </div>
        ))}
        <button onClick={() => setShowAddSubject(true)} className="glass-card rounded-2xl p-8 border-dashed border-white/10 flex flex-col items-center gap-2 group hover:bg-white/[0.02]">
           <Plus size={24} className="text-zinc-800 group-hover:text-indigo-500 transition-colors" />
           <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">New Deployment</span>
        </button>
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="glass-card rounded-[2rem] p-8 w-full max-w-sm animate-in zoom-in-95">
            <h3 className="text-lg font-black mb-6 text-white uppercase tracking-tight">Subject Injection</h3>
            <input 
              type="text" placeholder="Designation Name..." 
              value={subName} onChange={e => setSubName(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-xs font-black mb-6"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowAddSubject(false)} className="flex-1 py-3 text-[9px] font-black uppercase text-zinc-500">Cancel</button>
              <button onClick={handleAddSubject} className="flex-1 py-3 bg-indigo-600 rounded-xl text-white text-[9px] font-black uppercase shadow-lg shadow-indigo-600/20">Commit</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {addingChapterTo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="glass-card rounded-[2rem] p-8 w-full max-w-sm animate-in zoom-in-95">
            <h3 className="text-lg font-black mb-6 text-white uppercase tracking-tight">Module Deployment</h3>
            <input 
              type="text" placeholder="Unit Name..." 
              value={chapName} onChange={e => setChapName(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-xs font-black mb-6"
            />
            <div className="space-y-2 mb-6">
               <div className="flex justify-between text-[8px] font-black uppercase text-zinc-500">
                  <span>Confidence</span>
                  <span className="text-indigo-400">{chapConf}%</span>
               </div>
               <input type="range" min="0" max="100" value={chapConf} onChange={e => setChapConf(parseInt(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAddingChapterTo(null)} className="flex-1 py-3 text-[9px] font-black uppercase text-zinc-500">Cancel</button>
              <button onClick={handleAddChapter} className="flex-1 py-3 bg-indigo-600 rounded-xl text-white text-[9px] font-black uppercase shadow-lg shadow-indigo-600/20">Commit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicView;
