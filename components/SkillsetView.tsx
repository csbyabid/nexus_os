
import React, { useState, useMemo } from 'react';
import { 
  Boxes, Plus, Search, Sword, Compass, Award, 
  ExternalLink, Trash2, CheckCircle2, Circle, 
  PlusCircle, FileText, Youtube, Globe, X,
  Save, Sparkles, ChevronRight, Activity,
  Timer, Target, Zap, BookOpen, Layers, Trophy
} from 'lucide-react';
import { AppState, Skill, OlympiadResource, SkillSubtask, SkillMilestone } from '../types';
import DirectiveBanner from './DirectiveBanner';

interface SkillsetViewProps {
  state: AppState;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
}

const SkillsetView: React.FC<SkillsetViewProps> = ({ state, addSkill, updateSkill, deleteSkill }) => {
  const [activeTab, setActiveTab] = useState<'Wishlist' | 'Active' | 'Mastered'>('Active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState('General');

  const filteredSkills = useMemo(() => {
    return state.skills.filter(s => s.status === activeTab);
  }, [state.skills, activeTab]);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const skill: Skill = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSkillName.toUpperCase(),
      status: 'Active',
      category: newSkillCat.toUpperCase(),
      progress: 0,
      totalHours: 0,
      level: 'Novice',
      notes: '',
      resources: [],
      subtasks: [],
      milestones: []
    };
    addSkill(skill);
    setNewSkillName('');
    setShowAddModal(false);
  };

  const calculateMastery = (skill: Skill) => {
    const taskImpact = skill.subtasks.length > 0 
      ? (skill.subtasks.filter(t => t.completed).length / skill.subtasks.length) * 70 
      : 0;
    const milestoneImpact = skill.milestones.length > 0 
      ? (skill.milestones.filter(m => m.achieved).length / skill.milestones.length) * 30 
      : 0;
    const totalProgress = Math.min(100, Math.round(taskImpact + milestoneImpact));
    
    let level: Skill['level'] = 'Novice';
    if (totalProgress > 85) level = 'Master';
    else if (totalProgress > 65) level = 'Expert';
    else if (totalProgress > 45) level = 'Journeyman';
    else if (totalProgress > 20) level = 'Apprentice';

    return { progress: totalProgress, level };
  };

  const updateSkillLocal = (id: string, updates: Partial<Skill>) => {
    const current = state.skills.find(s => s.id === id);
    if (!current) return;
    
    const merged = { ...current, ...updates };
    const { progress, level } = calculateMastery(merged);
    const finalUpdates = { ...updates, progress, level };
    
    updateSkill(id, finalUpdates);
    if (selectedSkill && selectedSkill.id === id) {
      setSelectedSkill({ ...selectedSkill, ...finalUpdates });
    }
  };

  const toggleSubtask = (skill: Skill, subtaskId: string) => {
    const updatedSubtasks = skill.subtasks.map(t => 
      t.id === subtaskId ? { ...t, completed: !t.completed } : t
    );
    updateSkillLocal(skill.id, { subtasks: updatedSubtasks });
  };

  const toggleMilestone = (skill: Skill, milestoneId: string) => {
    const updatedMilestones = skill.milestones.map(m => 
      m.id === milestoneId ? { ...m, achieved: !m.achieved } : m
    );
    updateSkillLocal(skill.id, { milestones: updatedMilestones });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      <DirectiveBanner category="habits" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-1">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-4">
            <Sword className="text-indigo-400" size={32} /> Capability Matrix
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] opacity-70">
            {state.profile.subtitles.skillset || "Neural Adaptation & Mastery Pipeline"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5">
            {[
              { id: 'Wishlist', icon: Compass, label: 'Wishlist' },
              { id: 'Active', icon: Boxes, label: 'Active' },
              { id: 'Mastered', icon: Award, label: 'Mastered' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-600 hover:text-zinc-300'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-90"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-1">
        {filteredSkills.map(skill => (
          <div 
            key={skill.id} 
            onClick={() => setSelectedSkill(skill)}
            className="glass-vibrant glass-hover rounded-[3rem] p-10 space-y-8 cursor-pointer border border-white/5 group relative overflow-hidden flex flex-col"
          >
            <div className="absolute -top-10 -right-10 p-12 opacity-[0.02] group-hover:opacity-[0.1] transition-all transform group-hover:-translate-x-5 group-hover:translate-y-5 duration-1000">
               <Layers size={180} />
            </div>

            <div className="flex justify-between items-start relative z-10">
              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${
                skill.level === 'Master' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                skill.level === 'Expert' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              }`}>
                {skill.level} Tier
              </span>
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-white tracking-tighter tabular-nums">
                  {skill.progress}%
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-indigo-400 transition-colors leading-none">
                {skill.name}
              </h3>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2 flex items-center gap-2">
                <Target size={12} className="text-zinc-800" /> {skill.category} Sector
              </p>
            </div>

            {/* Segmented Progress Bar */}
            <div className="flex gap-1 relative z-10">
              {Array.from({ length: 10 }).map((_, i) => {
                const filled = (i + 1) * 10 <= skill.progress;
                return (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-sm transition-all duration-700 ${
                      filled 
                        ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' 
                        : 'bg-black/40 border border-white/5'
                    }`}
                  ></div>
                );
              })}
            </div>

            <div className="pt-6 mt-auto flex items-center justify-between text-zinc-600 group-hover:text-zinc-400 transition-colors relative z-10">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Timer size={14} className="text-indigo-500/50" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{skill.totalHours}H Logged</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500/50" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{skill.subtasks.filter(t => t.completed).length}/{skill.subtasks.length}</span>
                </div>
              </div>
              <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform text-indigo-400" />
            </div>
          </div>
        ))}

        {filteredSkills.length === 0 && (
          <div className="lg:col-span-3 py-32 glass rounded-[4rem] border-dashed border-white/10 flex flex-col items-center justify-center space-y-4 opacity-50">
            <Boxes size={60} className="text-zinc-900" />
            <p className="text-[12px] font-black text-zinc-700 uppercase tracking-[0.4em]">Sector Uncharted</p>
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in zoom-in-95">
          <div className="glass-vibrant border border-white/10 rounded-[4rem] p-16 w-full max-w-2xl shadow-3xl">
            <div className="flex justify-between items-center mb-16">
              <div className="space-y-1">
                <h3 className="text-4xl font-black tracking-tight text-white uppercase">Initialize Capability</h3>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] ml-1">Mastery Injection Protocol</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center text-zinc-500 hover:text-rose-500 transition-all">
                <X size={32} />
              </button>
            </div>
            <div className="space-y-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-4">Capability Designation</label>
                <input 
                  placeholder="e.g. FULL-STACK ARCHITECTURE"
                  value={newSkillName} onChange={e => setNewSkillName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-7 text-xl font-black text-white outline-none focus:border-indigo-500 shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-4">Strategic Sector</label>
                <input 
                  placeholder="e.g. TECHNICAL / ARTISTIC / LINGUISTIC"
                  value={newSkillCat} onChange={e => setNewSkillCat(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-7 text-lg font-bold text-white outline-none focus:border-indigo-500 shadow-inner"
                />
              </div>
              <button 
                onClick={handleAddSkill}
                className="w-full py-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[3rem] transition-all shadow-3xl shadow-indigo-600/50 text-2xl tracking-widest uppercase mt-6 transform hover:-translate-y-2"
              >
                DEPLOY CORE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deep Detail Panel */}
      {selectedSkill && (
        <div className="fixed inset-0 z-[300] flex items-center justify-end bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl h-full glass-vibrant border-l border-white/10 p-12 flex flex-col animate-in slide-in-from-right-10 duration-500">
            <div className="flex justify-between items-start mb-16">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
                     selectedSkill.status === 'Active' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                     selectedSkill.status === 'Mastered' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'
                   }`}>
                     {selectedSkill.status} STREAM
                   </div>
                   <button 
                    onClick={() => {
                      const next = selectedSkill.status === 'Wishlist' ? 'Active' : selectedSkill.status === 'Active' ? 'Mastered' : 'Wishlist';
                      updateSkillLocal(selectedSkill.id, { status: next });
                    }}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
                   >
                     <RefreshCw size={14} className="rotate-90" />
                   </button>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tight leading-none uppercase">{selectedSkill.name}</h2>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => { deleteSkill(selectedSkill.id); setSelectedSkill(null); }} className="w-14 h-14 rounded-[1.5rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-lg">
                    <Trash2 size={24} />
                 </button>
                 <button onClick={() => setSelectedSkill(null)} className="w-14 h-14 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all shadow-lg">
                    <X size={32} />
                 </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-16 pr-6 custom-scrollbar pb-10">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6">
                <div className="glass rounded-3xl p-6 border-white/5 flex flex-col items-center">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Mastery Rank</span>
                  <span className="text-xl font-black text-indigo-400 uppercase tracking-tight">{selectedSkill.level}</span>
                </div>
                <div className="glass rounded-3xl p-6 border-white/5 flex flex-col items-center">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Cognitive Hours</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black font-mono text-white tracking-tighter tabular-nums">{selectedSkill.totalHours}</span>
                    <button onClick={() => updateSkillLocal(selectedSkill.id, { totalHours: selectedSkill.totalHours + 1 })} className="p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="glass rounded-3xl p-6 border-white/5 flex flex-col items-center">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Saturation</span>
                  <span className="text-2xl font-black font-mono text-emerald-400 tracking-tighter tabular-nums">{selectedSkill.progress}%</span>
                </div>
              </div>

              {/* Progress Bar (Detailed) */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Saturation Gradient</span>
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{selectedSkill.progress === 100 ? 'MAXIMAL_SIGNAL' : 'STABILIZING_SIGNAL'}</span>
                 </div>
                 <div className="h-4 bg-black/60 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-400 rounded-full transition-all duration-[2000ms] shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                      style={{ width: `${selectedSkill.progress}%` }}
                    ></div>
                 </div>
              </div>

              {/* Milestones Sector */}
              <div className="space-y-8">
                 <div className="flex justify-between items-center px-2">
                    <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                      <Award size={18} className="text-amber-500" /> Mastery Milestones
                    </h3>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    {selectedSkill.milestones.map(m => (
                      <div 
                        key={m.id} onClick={() => toggleMilestone(selectedSkill, m.id)}
                        className={`flex items-center gap-6 p-8 rounded-[2.5rem] border transition-all cursor-pointer ${
                          m.achieved ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)]' : 'bg-black/40 border-white/5 hover:border-white/10'
                        }`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${m.achieved ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-700'}`}>
                            <Trophy size={20} />
                         </div>
                         <span className={`text-sm font-black tracking-tight uppercase flex-1 ${m.achieved ? 'text-white' : 'text-zinc-500'}`}>{m.label}</span>
                         {m.achieved && <Sparkles size={16} className="text-amber-400" />}
                      </div>
                    ))}
                    <div className="relative group">
                       <input 
                         placeholder="COMMIT MAJOR MILESTONE..."
                         className="w-full bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] pl-10 pr-6 py-6 text-xs font-black uppercase outline-none focus:border-amber-500/50 transition-all placeholder:text-zinc-800 text-white"
                         onKeyDown={(e) => {
                           if (e.key === 'Enter' && e.currentTarget.value) {
                             const updated = [...selectedSkill.milestones, { id: Math.random().toString(), label: e.currentTarget.value, achieved: false }];
                             updateSkillLocal(selectedSkill.id, { milestones: updated });
                             e.currentTarget.value = '';
                           }
                         }}
                       />
                    </div>
                 </div>
              </div>

              {/* Sub-Modules Pipeline */}
              <div className="space-y-8">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Boxes size={18} className="text-indigo-400" /> Operational Pipeline
                  </h3>
                </div>
                <div className="space-y-3">
                  {selectedSkill.subtasks.map(task => (
                    <div 
                      key={task.id} onClick={() => toggleSubtask(selectedSkill, task.id)}
                      className={`flex items-center gap-6 p-7 rounded-[2.5rem] border transition-all cursor-pointer ${
                        task.completed ? 'bg-indigo-500/5 border-indigo-500/20 opacity-40' : 'bg-black/40 border-white/5 hover:border-white/15'
                      }`}
                    >
                      {task.completed ? <CheckCircle2 className="text-indigo-400" size={24} /> : <Circle className="text-zinc-800" size={24} />}
                      <span className={`flex-1 text-sm font-bold tracking-tight uppercase ${task.completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                  <div className="relative group">
                    <PlusCircle className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-indigo-500 transition-colors" size={24} />
                    <input 
                      placeholder="INJECT MODULE..."
                      className="w-full bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] pl-20 pr-10 py-7 text-[11px] font-black uppercase outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-800 text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          const updated = [...selectedSkill.subtasks, { id: Math.random().toString(), title: e.currentTarget.value, completed: false }];
                          updateSkillLocal(selectedSkill.id, { subtasks: updated });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Intellectual Repository */}
              <div className="space-y-8">
                 <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                    <BookOpen size={18} className="text-blue-400" /> Knowledge Repository
                 </h3>
                 <div className="grid grid-cols-1 gap-4">
                   {selectedSkill.resources.map(res => (
                     <a 
                       key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-6 p-8 bg-black/40 border border-white/5 rounded-[3rem] hover:bg-black hover:border-indigo-500/20 transition-all group/res shadow-xl"
                     >
                       <div className="p-5 bg-white/5 rounded-2xl group-hover/res:bg-indigo-600/10 transition-colors">
                         {res.type === 'youtube' ? <Youtube className="text-rose-500" size={28} /> : <Globe className="text-blue-400" size={28} />}
                       </div>
                       <div className="flex-1 space-y-1">
                          <span className="text-sm font-black tracking-tight text-white uppercase">{res.title}</span>
                          <span className="block text-[8px] font-black text-zinc-700 uppercase tracking-widest">{res.url}</span>
                       </div>
                       <ExternalLink size={18} className="text-zinc-800 group-hover/res:text-indigo-400 transition-colors" />
                     </a>
                   ))}
                   <div className="p-6 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem] space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <input id="resTitle" placeholder="INTEL DESIGNATION..." className="bg-black/60 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black outline-none focus:border-indigo-500 text-white" />
                         <input id="resUrl" placeholder="ENCRYPTED URL..." className="bg-black/60 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black outline-none focus:border-indigo-500 text-white" />
                      </div>
                      <button onClick={() => {
                        const t = (document.getElementById('resTitle') as HTMLInputElement).value;
                        const u = (document.getElementById('resUrl') as HTMLInputElement).value;
                        if (t && u) {
                          const updated = [...selectedSkill.resources, { id: Math.random().toString(), title: t, url: u, type: u.includes('youtube') ? 'youtube' : 'web' } as OlympiadResource];
                          updateSkillLocal(selectedSkill.id, { resources: updated });
                          (document.getElementById('resTitle') as HTMLInputElement).value = '';
                          (document.getElementById('resUrl') as HTMLInputElement).value = '';
                        }
                      }} className="w-full py-4 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                        COMMIT RESOURCE
                      </button>
                   </div>
                 </div>
              </div>

              {/* Neural Synthesis Notes */}
              <div className="space-y-6">
                 <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] px-2 flex items-center gap-3">
                    <Zap size={18} className="text-indigo-400" /> Neural Synthesis
                 </h3>
                 <textarea 
                   value={selectedSkill.notes}
                   onChange={e => updateSkillLocal(selectedSkill.id, { notes: e.target.value })}
                   placeholder="RECORD CORE LOGIC AND HEURISTIC PATTERNS..."
                   className="w-full h-64 bg-black/40 border border-white/5 rounded-[3rem] p-10 text-base font-medium leading-relaxed outline-none focus:border-indigo-500 transition-all resize-none text-zinc-300 shadow-inner"
                 />
              </div>
            </div>

            <div className="pt-10 border-t border-white/10">
               <button onClick={() => setSelectedSkill(null)} className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-black text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-4 shadow-3xl shadow-indigo-600/40 transform active:scale-95 transition-all">
                 <Save size={24} /> SYNCHRONIZE COMMAND
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RefreshCw = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
);

export default SkillsetView;
