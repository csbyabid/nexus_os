
import React, { useState } from 'react';
import { AppState, Task } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Target, Trash } from 'lucide-react';

interface TrackerViewProps {
  state: AppState;
  toggleTask: (id: string) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
}

const TrackerView: React.FC<TrackerViewProps> = ({ state, toggleTask, addTask, deleteTask }) => {
  const [activeSection, setActiveSection] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [input, setInput] = useState('');
  const [tag, setTag] = useState<Task['tag']>('Academic');

  const filteredTasks = state.tasks.filter(t => t.period === activeSection);
  const completedCount = filteredTasks.filter(t => t.completed).length;
  const progressPercent = filteredTasks.length ? Math.round((completedCount / filteredTasks.length) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addTask({
      id: Math.random().toString(36).substr(2, 9),
      title: input.toUpperCase(),
      tag,
      isMIT: activeSection === 'Daily',
      completed: false,
      dueDate: new Date().toISOString(),
      period: activeSection
    });
    setInput('');
  };

  const handleClearCompleted = () => {
    filteredTasks.filter(t => t.completed).forEach(t => deleteTask(t.id));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 px-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">Execution Pipeline</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] opacity-70 italic">
            "{state.profile.subtitles.tracker}"
          </p>
        </div>
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
          {(['Daily', 'Weekly', 'Monthly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setActiveSection(p)}
              className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                activeSection === p ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <form onSubmit={handleAdd} className="glass rounded-3xl p-6 space-y-6">
            <h2 className="text-xs font-black flex items-center gap-2 tracking-tight uppercase">
              <Plus size={16} className="text-indigo-400" /> Inject Goal
            </h2>
            <div className="space-y-4">
               <input 
                  type="text" 
                  placeholder={`DEPLOY ${activeSection.toUpperCase()} GOAL...`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-[10px] font-bold shadow-inner"
               />
               <div className="grid grid-cols-2 gap-2">
                {(['Academic', 'Personal', 'Fitness', 'Olympiad'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`py-2 rounded-lg text-[8px] font-black uppercase border transition-all ${
                      tag === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-zinc-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-[10px] tracking-widest uppercase active:scale-95"
            >
              COMMIT
            </button>
          </form>

          <div className="glass rounded-3xl p-6 space-y-5">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Target size={14} className="text-emerald-500" /> Saturation
            </h3>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-black font-mono text-white mb-4 tracking-tighter">{progressPercent}%</div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-[1000ms]" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-sm font-bold text-white tracking-tight uppercase">{activeSection} Stack</h3>
             {completedCount > 0 && (
               <button 
                onClick={handleClearCompleted}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/10 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
               >
                 <Trash size={12} /> Purge Cleared
               </button>
             )}
          </div>

          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="glass rounded-[2rem] py-20 flex flex-col items-center justify-center text-zinc-700 border-dashed border-white/5">
                <ListTodo size={40} className="mb-4 opacity-5" />
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Zero Tactical Load</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    task.completed ? 'bg-white/[0.01] border-white/5 text-zinc-600 opacity-60' : 'glass hover:border-indigo-500/20'
                  }`}
                >
                  <button onClick={() => toggleTask(task.id)} className="shrink-0 transition-all active:scale-90">
                    {task.completed ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle size={20} />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className={`text-xs font-bold tracking-tight ${task.completed ? 'line-through opacity-50' : 'text-zinc-200'}`}>
                      {task.title}
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[7px] font-black uppercase text-zinc-600 tracking-widest">
                        {task.tag}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackerView;
