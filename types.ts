
export type Mood = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  lastSync: string | null;
  lastExportDate: string | null; 
}

export interface OlympiadResource {
  id: string;
  type: 'youtube' | 'web' | 'file' | 'article' | 'course';
  title: string;
  url: string;
}

export interface SkillSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface SkillMilestone {
  id: string;
  label: string;
  achieved: boolean;
}

export interface Skill {
  id: string;
  name: string;
  status: 'Wishlist' | 'Active' | 'Mastered';
  category: string;
  progress: number;
  totalHours: number;
  level: 'Novice' | 'Apprentice' | 'Journeyman' | 'Expert' | 'Master';
  notes: string;
  resources: OlympiadResource[];
  subtasks: SkillSubtask[];
  milestones: SkillMilestone[];
}

export interface UserProfile {
  name: string;
  goal: string;
  musicUrl: string;
  hscExamDate: string;
  hscLabel: string;
  bioOlyDate: string;
  bioOlyLabel: string;
  econOlyDate: string;
  econOlyLabel: string;
  targets: {
    weight: number;
    calories: number;
    protein: number;
    dailyStudyHours: number;
  };
  pageTitles: {
    dashboard: string;
    academic: string;
    olympiad: string;
    skillset: string;
    fitness: string;
    analytics: string;
    tracker: string;
    habits: string;
    profile: string;
  };
  subtitles: {
    dashboard: string;
    academic: string;
    olympiad: string;
    skillset: string;
    fitness: string;
    analytics: string;
    tracker: string;
    habits: string;
    profile: string;
  };
}

export interface DailyLog {
  date: string; // ISO YYYY-MM-DD
  mood: Mood;
  energy: number;
  weight: number;
  journal: string;
  focusScore: number;
  focusTarget: number; 
  studyTimeSeconds: number;
  distractions: string[];
}

export type SubjectStatus = 'Weak' | 'Needs Revision' | 'Mastered' | 'Olympiad-Level';

export interface Chapter {
  id: string;
  name: string;
  status: SubjectStatus;
  lastRevision?: string;
  confidence: number;
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
  category: 'HSC' | 'Olympiad';
  targetDate?: string;
  syllabusUrl?: string;
  resources: OlympiadResource[];
}

export interface Task {
  id: string;
  title: string;
  tag: 'Academic' | 'Personal' | 'Fitness' | 'Olympiad';
  isMIT: boolean;
  completed: boolean;
  dueDate: string;
  period: 'Daily' | 'Weekly' | 'Monthly';
}

export interface Habit {
  id: string;
  name: string;
  type: 'build' | 'quit';
  completedDays: string[]; 
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  intensity?: number;
}

export interface FitnessLog {
  id: string;
  date: string;
  weight: number;
  calories: number;
  protein: number;
  workoutType: string;
  exercises: Exercise[];
  intensity: number;
  notes: string;
}

export interface AppState {
  auth: AuthState;
  profile: UserProfile;
  logs: DailyLog[];
  subjects: Subject[];
  skills: Skill[];
  tasks: Task[];
  habits: Habit[];
  fitness: FitnessLog[];
  personalBestStudyTime: number;
  lastTaskRefreshDate?: string;
  timerState: {
    isRunning: boolean;
    startTime: number | null; 
    accumulatedSeconds: number;
  };
}
