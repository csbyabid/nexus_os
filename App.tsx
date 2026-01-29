
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AcademicView from './components/AcademicView';
import AnalyticsView from './components/AnalyticsView';
import FitnessView from './components/FitnessView';
import ProfileView from './components/ProfileView';
import TrackerView from './components/TrackerView';
import HabitTrackerView from './components/HabitTrackerView';
import OlympiadView from './components/OlympiadView';
import SkillsetView from './components/SkillsetView';
import QuickAddModal from './components/QuickAddModal';
import LoginView from './components/LoginView';
import FloatingTimer from './components/FloatingTimer';
import { AppState, DailyLog, Task, Subject, Chapter, FitnessLog, UserProfile, OlympiadResource, Habit, Mood, Skill } from './types';
import { INITIAL_SUBJECTS, INITIAL_TASKS, INITIAL_HABITS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [stateKey, setStateKey] = useState(0);
  
  const [state, setState] = useState<AppState>(() => {
    const defaultState: AppState = {
      auth: { isAuthenticated: false, userEmail: null, lastSync: null, lastExportDate: null },
      profile: {
        name: "Architect", goal: "Strategic Mastery", musicUrl: "",
        hscExamDate: "2026-05-01", hscLabel: "HSC Finals",
        bioOlyDate: "2025-03-15", bioOlyLabel: "Bio Oly",
        econOlyDate: "2025-06-20", econOlyLabel: "Econ Oly",
        targets: { weight: 70.0, calories: 2200, protein: 150, dailyStudyHours: 6 },
        pageTitles: { dashboard: "Command", tracker: "Execution", habits: "Neural", academic: "Knowledge", skillset: "Skillset", fitness: "Bio", analytics: "Senses", profile: "Core", olympiad: "Tactical" },
        subtitles: { dashboard: "Homeostasis Base", academic: "Structural Mapping", olympiad: "Competition Grade", skillset: "Capability Pipeline", fitness: "Cellular Optimization", analytics: "Logic Synthesis", tracker: "Output Pipeline", habits: "Subconscious Fix", profile: "Neural Config" }
      },
      logs: [],
      subjects: INITIAL_SUBJECTS.map(s => ({ ...s, resources: [], syllabusUrl: '' })),
      skills: [],
      tasks: INITIAL_TASKS,
      habits: INITIAL_HABITS,
      fitness: [],
      personalBestStudyTime: 0,
      lastTaskRefreshDate: new Date().toISOString().split('T')[0],
      timerState: { isRunning: false, startTime: null, accumulatedSeconds: 0 }
    };

    const saved = localStorage.getItem('nexus_os_state_v15');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { mathOlyDate, mathOlyLabel, ...cleanProfile } = parsed.profile || {};
        return {
          ...defaultState,
          ...parsed,
          profile: { ...defaultState.profile, ...cleanProfile },
          auth: { ...defaultState.auth, ...parsed.auth },
          timerState: parsed.timerState || defaultState.timerState,
          skills: parsed.skills || []
        };
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const needsMandatoryCheckIn = useMemo(() => {
    if (!state.auth.isAuthenticated) return false;
    return !state.logs.some(log => log.date === todayStr);
  }, [state.auth.isAuthenticated, state.logs, todayStr]);

  useEffect(() => {
    localStorage.setItem('nexus_os_state_v15', JSON.stringify(state));
  }, [state]);

  const handleLogin = (email: string) => {
    setState(prev => ({
      ...prev,
      auth: { ...prev.auth, isAuthenticated: true, userEmail: email, lastSync: new Date().toISOString() }
    }));
  };

  const handleLogout = () => setState(prev => ({ ...prev, auth: { ...prev.auth, isAuthenticated: false } }));
  
  const updateProfile = (profile: UserProfile) => setState(prev => ({ ...prev, profile }));

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const addTask = (task: Task) => setState(prev => ({ ...prev, tasks: [task, ...prev.tasks] }));
  const deleteTask = (id: string) => setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  
  const addDailyLog = (log: DailyLog) => {
    setState(prev => {
      const fitnessExists = prev.fitness.some(f => f.date === log.date);
      let updatedFitness = [...prev.fitness];
      if (!fitnessExists) {
        updatedFitness.unshift({
          id: Math.random().toString(36).substr(2, 9),
          date: log.date,
          weight: log.weight,
          calories: 0, protein: 0, workoutType: "Sync Baseline", exercises: [], intensity: 0, notes: "Auto-synced."
        });
      }
      return { 
        ...prev, 
        logs: [...prev.logs.filter(l => l.date !== log.date), log],
        fitness: updatedFitness,
        personalBestStudyTime: Math.max(prev.personalBestStudyTime, log.studyTimeSeconds || 0)
      };
    });
    setShowQuickAdd(false);
  };

  const startTimer = () => {
    setState(prev => ({
      ...prev,
      timerState: { ...prev.timerState, isRunning: true, startTime: Date.now() }
    }));
  };

  const pauseTimer = () => {
    setState(prev => {
      const now = Date.now();
      const elapsed = prev.timerState.startTime ? Math.floor((now - prev.timerState.startTime) / 1000) : 0;
      return {
        ...prev,
        timerState: {
          isRunning: false,
          startTime: null,
          accumulatedSeconds: prev.timerState.accumulatedSeconds + elapsed
        }
      };
    });
  };

  const resetTimer = () => {
    setState(prev => ({
      ...prev,
      timerState: { isRunning: false, startTime: null, accumulatedSeconds: 0 }
    }));
  };

  const saveTimer = (seconds: number) => {
    logStudySession(seconds);
    resetTimer();
  };

  const logStudySession = (seconds: number) => {
    setState(prev => {
      const existingToday = prev.logs.find(l => l.date === todayStr);
      if (!existingToday) {
        const newLog: DailyLog = {
          date: todayStr, mood: 5 as Mood, energy: 5, weight: prev.profile.targets.weight,
          journal: "Automatic capture of study session.", focusScore: 5, focusTarget: prev.profile.targets.dailyStudyHours,
          studyTimeSeconds: seconds, distractions: []
        };
        return { ...prev, logs: [...prev.logs, newLog] };
      }
      const newLogs = prev.logs.map(l => l.date === todayStr ? { ...l, studyTimeSeconds: (l.studyTimeSeconds || 0) + seconds } : l);
      return {
        ...prev,
        logs: newLogs,
        personalBestStudyTime: Math.max(prev.personalBestStudyTime, (existingToday.studyTimeSeconds || 0) + seconds)
      };
    });
  };

  const handleManualExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `nexus_backup_${todayStr}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setState(prev => ({ ...prev, auth: { ...prev.auth, lastExportDate: todayStr } }));
  };

  // Skills handlers
  const addSkill = (skill: Skill) => setState(prev => ({ ...prev, skills: [skill, ...prev.skills] }));
  const updateSkill = (id: string, updates: Partial<Skill>) => setState(prev => ({
    ...prev,
    skills: prev.skills.map(s => s.id === id ? { ...s, ...updates } : s)
  }));
  const deleteSkill = (id: string) => setState(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));

  const renderContent = () => {
    const commonProps = { state, toggleTask, addTask, logStudySession, onExport: handleManualExport, startTimer, pauseTimer, resetTimer, saveTimer };
    switch (activeTab) {
      case 'dashboard': return <Dashboard {...commonProps} />;
      case 'tracker': return <TrackerView state={state} toggleTask={toggleTask} addTask={addTask} deleteTask={deleteTask} />;
      case 'habits': return <HabitTrackerView state={state} addHabit={addHabit} deleteHabit={deleteHabit} toggleHabit={toggleHabit} />;
      case 'academic': return <AcademicView state={state} addSubject={addSubject} addChapter={addChapter} updateChapter={updateChapter} />;
      case 'olympiad': return <OlympiadView state={state} addSubject={addSubject} updateChapter={updateChapter} updateExtra={updateOlympiadExtra} />;
      case 'skillset': return <SkillsetView state={state} addSkill={addSkill} updateSkill={updateSkill} deleteSkill={deleteSkill} />;
      case 'fitness': return <FitnessView state={state} addLog={addFitnessLog} />;
      case 'analytics': return <AnalyticsView state={state} />;
      case 'profile': return <ProfileView key={`p-${stateKey}`} state={state} updateProfile={updateProfile} onImport={importData} onExport={handleManualExport} />;
      default: return <Dashboard {...commonProps} />;
    }
  };

  const addSubject = (s: Subject) => setState(prev => ({ ...prev, subjects: [...prev.subjects, s] }));
  const addChapter = (sId: string, c: Chapter) => setState(prev => ({ ...prev, subjects: prev.subjects.map(s => s.id === sId ? { ...s, chapters: [...s.chapters, c] } : s) }));
  const updateChapter = (sId: string, cId: string, upd: Partial<Chapter>) => setState(prev => ({ ...prev, subjects: prev.subjects.map(s => s.id === sId ? { ...s, chapters: s.chapters.map(c => c.id === cId ? { ...c, ...upd } : c) } : s) }));
  const updateOlympiadExtra = (sId: string, upd: any) => setState(prev => ({ ...prev, subjects: prev.subjects.map(s => s.id === sId ? { ...s, ...upd } : s) }));
  const addHabit = (h: Habit) => setState(prev => ({ ...prev, habits: [h, ...prev.habits] }));
  const deleteHabit = (id: string) => setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  const toggleHabit = (id: string, d: string) => setState(prev => ({ ...prev, habits: prev.habits.map(h => h.id === id ? { ...h, completedDays: h.completedDays.includes(d) ? h.completedDays.filter(x => x !== d) : [...h.completedDays, d] } : h) }));
  const addFitnessLog = (l: FitnessLog) => setState(prev => ({ ...prev, fitness: [l, ...prev.fitness.filter(f => f.date !== l.date)], logs: prev.logs.map(log => log.date === l.date ? { ...log, weight: l.weight } : log) }));
  const importData = (d: any) => { try { setState(prev => ({ ...prev, ...d, auth: { ...prev.auth, ...d.auth, isAuthenticated: true } })); setStateKey(k => k + 1); } catch (e) { alert("Import failed."); } };

  if (!state.auth.isAuthenticated) return <LoginView onLogin={handleLogin} />;

  return (
    <Layout state={state} activeTab={activeTab} setActiveTab={setActiveTab} onQuickAdd={() => setShowQuickAdd(true)} onLogout={handleLogout}>
      <React.Fragment key={`view-${stateKey}`}>{renderContent()}</React.Fragment>
      {(showQuickAdd || needsMandatoryCheckIn) && (
        <QuickAddModal isMandatory={needsMandatoryCheckIn} onClose={() => setShowQuickAdd(false)} onSave={addDailyLog} defaultWeight={state.profile.targets.weight} />
      )}
      <FloatingTimer 
        isRunning={state.timerState.isRunning} startTime={state.timerState.startTime} accumulatedSeconds={state.timerState.accumulatedSeconds}
        onStart={startTimer} onPause={pauseTimer} onReset={resetTimer} onSave={saveTimer} 
      />
    </Layout>
  );
};

export default App;
