
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
import QuickAddModal from './components/QuickAddModal';
import LoginView from './components/LoginView';
import FloatingTimer from './components/FloatingTimer';
import { AppState, DailyLog, Task, Subject, Chapter, FitnessLog, UserProfile, OlympiadResource, Habit } from './types';
import { INITIAL_SUBJECTS, INITIAL_TASKS, INITIAL_HABITS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [stateKey, setStateKey] = useState(0);
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('nexus_os_state_v13');
    if (saved) return JSON.parse(saved);
    return {
      auth: {
        isAuthenticated: false,
        userEmail: null,
        lastSync: null,
        lastExportDate: null
      },
      profile: {
        name: "Architect",
        goal: "Strategic Mastery",
        musicUrl: "",
        hscExamDate: "2026-05-01",
        hscLabel: "HSC Finals",
        bioOlyDate: "2025-03-15",
        bioOlyLabel: "Bio Oly",
        mathOlyDate: "2025-04-10",
        mathOlyLabel: "Math Oly",
        targets: {
          weight: 70.0,
          calories: 2200,
          protein: 150,
          dailyStudyHours: 6
        },
        pageTitles: {
          dashboard: "Command",
          tracker: "Execution",
          habits: "Neural",
          academic: "Knowledge",
          fitness: "Bio",
          analytics: "Senses",
          profile: "Core",
          olympiad: "Tactical"
        },
        subtitles: {
          dashboard: "Homeostasis Base",
          academic: "Structural Mapping",
          olympiad: "Competition Grade",
          fitness: "Cellular Optimization",
          analytics: "Logic Synthesis",
          tracker: "Output Pipeline",
          habits: "Subconscious Fix",
          profile: "Neural Config"
        }
      },
      logs: [],
      subjects: INITIAL_SUBJECTS.map(s => ({ ...s, resources: [], syllabusUrl: '' })),
      tasks: INITIAL_TASKS,
      habits: INITIAL_HABITS,
      fitness: [],
      personalBestStudyTime: 0,
      lastTaskRefreshDate: new Date().toISOString().split('T')[0],
      timerState: {
        isRunning: false,
        startTime: null,
        accumulatedSeconds: 0
      }
    };
  });

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // Mandatory Check-In Detector
  const needsMandatoryCheckIn = useMemo(() => {
    if (!state.auth.isAuthenticated) return false;
    return !state.logs.some(log => log.date === todayStr);
  }, [state.auth.isAuthenticated, state.logs, todayStr]);

  useEffect(() => {
    localStorage.setItem('nexus_os_state_v13', JSON.stringify(state));
  }, [state]);

  const handleLogin = (email: string) => {
    setState(prev => ({
      ...prev,
      auth: { ...prev.auth, isAuthenticated: true, userEmail: email, lastSync: new Date().toISOString() }
    }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, auth: { ...prev.auth, isAuthenticated: false } }));
  };

  const updateProfile = (profile: UserProfile) => setState(prev => ({ ...prev, profile }));

  const addDailyLog = (log: DailyLog) => {
    setState(prev => {
      const updatedProfile = {
        ...prev.profile,
        targets: { ...prev.profile.targets, weight: log.weight || prev.profile.targets.weight }
      };

      const fitnessExists = prev.fitness.some(f => f.date === log.date);
      let updatedFitness = [...prev.fitness];
      
      if (!fitnessExists) {
        updatedFitness.unshift({
          id: Math.random().toString(36).substr(2, 9),
          date: log.date,
          weight: log.weight,
          calories: 0,
          protein: 0,
          workoutType: "Sync Baseline",
          exercises: [],
          intensity: 0,
          notes: "Auto-synced from daily check-in."
        });
      } else {
        updatedFitness = updatedFitness.map(f => f.date === log.date ? { ...f, weight: log.weight } : f);
      }

      return { 
        ...prev, 
        profile: updatedProfile,
        logs: [...prev.logs.filter(l => l.date !== log.date), log],
        fitness: updatedFitness,
        personalBestStudyTime: Math.max(prev.personalBestStudyTime, log.studyTimeSeconds || 0)
      };
    });
    setShowQuickAdd(false);
  };

  // Timer Handlers
  const startTimer = () => {
    setState(prev => ({
      ...prev,
      timerState: { ...prev.timerState, isRunning: true, startTime: Date.now() }
    }));
  };

  const pauseTimer = () => {
    setState(prev => {
      const elapsedSinceStart = prev.timerState.startTime ? Math.floor((Date.now() - prev.timerState.startTime) / 1000) : 0;
      return {
        ...prev,
        timerState: {
          isRunning: false,
          startTime: null,
          accumulatedSeconds: prev.timerState.accumulatedSeconds + elapsedSinceStart
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
    alert(`Intelligence session of ${Math.floor(seconds/60)}m captured.`);
  };

  const logStudySession = (seconds: number) => {
    setState(prev => {
      const existingToday = prev.logs.find(l => l.date === todayStr);
      if (!existingToday) return prev; 
      
      const newLogs = prev.logs.map(l => l.date === todayStr ? { ...l, studyTimeSeconds: (l.studyTimeSeconds || 0) + seconds } : l);
      return {
        ...prev,
        logs: newLogs,
        personalBestStudyTime: Math.max(prev.personalBestStudyTime, (existingToday?.studyTimeSeconds || 0) + seconds)
      };
    });
  };

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const addTask = (task: Task) => setState(prev => ({ ...prev, tasks: [task, ...prev.tasks] }));
  const deleteTask = (id: string) => setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  const addSubject = (subject: Subject) => setState(prev => ({ ...prev, subjects: [...prev.subjects, subject] }));

  const addChapter = (subjectId: string, chapter: Chapter) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? { ...s, chapters: [...s.chapters, chapter] } : s)
    }));
  };

  const updateChapter = (subjectId: string, chapterId: string, updates: Partial<Chapter>) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => 
        s.id === subjectId 
          ? { ...s, chapters: s.chapters.map(c => c.id === chapterId ? { ...c, ...updates } : c) } 
          : s
      )
    }));
  };

  const updateOlympiadExtra = (subjectId: string, updates: { syllabusUrl?: string, resources?: OlympiadResource[] }) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? { ...s, ...updates } : s)
    }));
  };

  const addHabit = (habit: Habit) => setState(prev => ({ ...prev, habits: [habit, ...prev.habits] }));
  const deleteHabit = (id: string) => setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  const toggleHabit = (id: string, date: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== id) return h;
        const exists = h.completedDays.includes(date);
        return {
          ...h,
          completedDays: exists 
            ? h.completedDays.filter(d => d !== date)
            : [...h.completedDays, date]
        };
      })
    }));
  };

  const addFitnessLog = (log: FitnessLog) => {
    setState(prev => {
      const updatedLogs = prev.logs.map(l => l.date === log.date ? { ...l, weight: log.weight } : l);
      return { ...prev, fitness: [log, ...prev.fitness.filter(f => f.date !== log.date)], logs: updatedLogs };
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

  const importData = (newData: any) => {
    try {
      const mergedProfile = { ...state.profile, ...newData.profile };
      const mergedState = { ...state, ...newData, profile: mergedProfile };
      setState({ ...mergedState, auth: { ...mergedState.auth, isAuthenticated: true, lastSync: new Date().toISOString() } });
      setStateKey(prev => prev + 1);
    } catch (err) {
      alert("Import failed.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={state} toggleTask={toggleTask} addTask={addTask} logStudySession={logStudySession} onExport={handleManualExport} />;
      case 'tracker':
        return <TrackerView state={state} toggleTask={toggleTask} addTask={addTask} deleteTask={deleteTask} />;
      case 'habits':
        return <HabitTrackerView state={state} addHabit={addHabit} deleteHabit={deleteHabit} toggleHabit={toggleHabit} />;
      case 'academic':
        return <AcademicView state={state} addSubject={addSubject} addChapter={addChapter} updateChapter={updateChapter} />;
      case 'olympiad':
        return <OlympiadView state={state} addSubject={addSubject} updateChapter={updateChapter} updateExtra={updateOlympiadExtra} />;
      case 'fitness':
        return <FitnessView state={state} addLog={addFitnessLog} />;
      case 'analytics':
        return <AnalyticsView state={state} />;
      case 'profile':
        return <ProfileView key={`profile-${stateKey}`} state={state} updateProfile={updateProfile} onImport={importData} onExport={handleManualExport} />;
      default:
        return <Dashboard state={state} toggleTask={toggleTask} addTask={addTask} logStudySession={logStudySession} onExport={handleManualExport} />;
    }
  };

  if (!state.auth.isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <Layout state={state} activeTab={activeTab} setActiveTab={setActiveTab} onQuickAdd={() => setShowQuickAdd(true)} onLogout={handleLogout}>
      <React.Fragment key={`view-${stateKey}`}>
        {renderContent()}
      </React.Fragment>
      {(showQuickAdd || needsMandatoryCheckIn) && (
        <QuickAddModal 
          isMandatory={needsMandatoryCheckIn} 
          onClose={() => setShowQuickAdd(false)} 
          onSave={addDailyLog} 
          defaultWeight={state.profile.targets.weight}
        />
      )}
      <FloatingTimer 
        isRunning={state.timerState.isRunning}
        startTime={state.timerState.startTime}
        accumulatedSeconds={state.timerState.accumulatedSeconds}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
        onSave={saveTimer}
      />
    </Layout>
  );
};

export default App;
