
import { Subject, Task, Habit } from './types';

export const SYSTEM_QUOTES: Record<string, string[]> = {
  dashboard: [
    "Success is not owned, it's leased. And rent is due every day.",
    "Amateurs wait for inspiration. Professionals get to work.",
    "The best way to predict your future is to create it.",
    "Discipline is choosing between what you want now and what you want most."
  ],
  academic: [
    "The mind is not a vessel to be filled, but a fire to be kindled.",
    "Complexity is the enemy of execution.",
    "An investment in knowledge pays the best interest.",
    "Knowledge is the only asset that increases when shared."
  ],
  olympiad: [
    "Calculated risks are the fuel of genius.",
    "Under pressure, you don't rise to the level of your expectations, you fall to the level of your training.",
    "The expert in anything was once a beginner.",
    "Logic will get you from A to B. Imagination will take you everywhere."
  ],
  fitness: [
    "Pain is temporary. Pride is forever.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "Do something today that your future self will thank you for.",
    "Strength does not come from winning. Your struggles develop your strengths."
  ],
  habits: [
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    "Your habits will determine your future.",
    "Small habits, big changes.",
    "The chains of habit are too weak to be felt until they are too strong to be broken."
  ]
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'hsc-phys',
    name: 'Physics (HSC)',
    category: 'HSC',
    chapters: [
      { id: 'p1', name: 'Physical Quantities', status: 'Mastered', confidence: 95 },
      { id: 'p2', name: 'Motion', status: 'Needs Revision', confidence: 70 },
      { id: 'p3', name: 'Force', status: 'Weak', confidence: 40 },
    ],
    resources: []
  },
  {
    id: 'hsc-bio',
    name: 'Biology (HSC)',
    category: 'HSC',
    chapters: [
      { id: 'b1', name: 'Life Process', status: 'Mastered', confidence: 90 },
    ],
    resources: []
  },
  {
    id: 'oly-bio',
    name: 'Biology Olympiad',
    category: 'Olympiad',
    targetDate: '2025-03-15',
    chapters: [
      { id: 'ob1', name: 'Cellular Respiration', status: 'Needs Revision', confidence: 65 },
      { id: 'ob2', name: 'Genetics & Evolution', status: 'Weak', confidence: 30 },
    ],
    resources: []
  },
  {
    id: 'oly-econ',
    name: 'Economics Olympiad',
    category: 'Olympiad',
    targetDate: '2025-06-20',
    chapters: [],
    resources: []
  }
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Complete Physics Chapter 3', tag: 'Academic', isMIT: true, completed: false, dueDate: new Date().toISOString(), period: 'Daily' },
  { id: 't2', title: 'Weight Training - Session A', tag: 'Fitness', isMIT: true, completed: true, dueDate: new Date().toISOString(), period: 'Daily' },
];

export const INITIAL_HABITS: Habit[] = [
  { id: 'h1', name: 'No Social Media', type: 'quit', completedDays: [], createdAt: new Date().toISOString() },
  { id: 'h2', name: 'Cold Shower', type: 'build', completedDays: [], createdAt: new Date().toISOString() },
  { id: 'h3', name: 'Read 20 Pages', type: 'build', completedDays: [], createdAt: new Date().toISOString() },
];

export const MOOD_EMOJIS: Record<number, string> = {
  1: '😫', 2: '🙁', 3: '😕', 4: '😐', 5: '🙂', 
  6: '😊', 7: '😁', 8: '🤩', 9: '🔥', 10: '👑'
};
