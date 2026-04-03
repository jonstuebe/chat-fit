import type { Workout, WorkoutPhase, Exercise } from '@/types/workout';

let counter = 0;
function uid() {
  return (++counter).toString(36) + Date.now().toString(36).slice(-4);
}

const WARMUPS: Omit<Exercise, 'id' | 'completed'>[] = [
  { name: 'Jumping Jacks', type: 'timed', duration: 60, description: 'Full range of motion, get the blood flowing' },
  { name: 'Arm Circles', type: 'timed', duration: 30, description: 'Forward and backward, loosen up shoulders' },
  { name: 'High Knees', type: 'timed', duration: 45, description: 'Drive knees up to hip height at a steady pace' },
  { name: 'Leg Swings', type: 'reps', reps: 10, sets: 1, description: 'Forward and lateral, each leg' },
  { name: 'Hip Circles', type: 'timed', duration: 30, description: 'Controlled circles in both directions' },
];

const COOLDOWNS: Omit<Exercise, 'id' | 'completed'>[] = [
  { name: 'Standing Quad Stretch', type: 'timed', duration: 30, description: 'Hold each leg, deep breath' },
  { name: 'Hamstring Stretch', type: 'timed', duration: 30, description: 'Fold forward gently, keep knees soft' },
  { name: 'Child\'s Pose', type: 'timed', duration: 45, description: 'Sink hips back, arms extended' },
  { name: 'Cat-Cow Stretch', type: 'timed', duration: 40, description: 'Alternate between arching and rounding' },
  { name: 'Deep Breathing', type: 'timed', duration: 60, description: '4 counts in, 4 counts hold, 4 counts out' },
];

const EXERCISES: Record<string, Omit<Exercise, 'id' | 'completed'>[]> = {
  upper: [
    { name: 'Push-Ups', type: 'reps', reps: 12, sets: 3, description: 'Chest to ground, full extension' },
    { name: 'Diamond Push-Ups', type: 'reps', reps: 10, sets: 3, description: 'Hands together, elbows close to body' },
    { name: 'Pike Push-Ups', type: 'reps', reps: 10, sets: 3, description: 'Hips high, target shoulders' },
    { name: 'Tricep Dips', type: 'reps', reps: 12, sets: 3, description: 'Use a chair or bench, full range' },
    { name: 'Plank Shoulder Taps', type: 'reps', reps: 20, sets: 3, description: 'Alternate hands, keep hips stable' },
    { name: 'Arm Plank Hold', type: 'timed', duration: 45, description: 'Forearms on ground, body straight' },
  ],
  lower: [
    { name: 'Bodyweight Squats', type: 'reps', reps: 15, sets: 3, description: 'Below parallel, drive through heels' },
    { name: 'Lunges', type: 'reps', reps: 12, sets: 3, description: 'Alternating legs, knee tracks over toes' },
    { name: 'Glute Bridges', type: 'reps', reps: 15, sets: 3, description: 'Squeeze at the top, controlled descent' },
    { name: 'Jump Squats', type: 'reps', reps: 10, sets: 3, description: 'Explosive up, soft landing' },
    { name: 'Wall Sit', type: 'timed', duration: 45, description: 'Back flat against wall, thighs parallel' },
    { name: 'Calf Raises', type: 'reps', reps: 20, sets: 3, description: 'Full extension, slow descent' },
  ],
  core: [
    { name: 'Crunches', type: 'reps', reps: 20, sets: 3, description: 'Lift shoulders off ground, exhale up' },
    { name: 'Bicycle Crunches', type: 'reps', reps: 20, sets: 3, description: 'Opposite elbow to knee, controlled' },
    { name: 'Plank Hold', type: 'timed', duration: 60, description: 'Straight line from head to heels' },
    { name: 'Mountain Climbers', type: 'timed', duration: 45, description: 'Rapid alternating knee drives' },
    { name: 'Leg Raises', type: 'reps', reps: 12, sets: 3, description: 'Keep lower back pressed to floor' },
    { name: 'Russian Twists', type: 'reps', reps: 20, sets: 3, description: 'Twist side to side, feet elevated' },
  ],
  hiit: [
    { name: 'Burpees', type: 'timed', duration: 40, description: 'Full burpee with push-up and jump' },
    { name: 'Mountain Climbers', type: 'timed', duration: 40, description: 'Fast pace, drive knees to chest' },
    { name: 'Jump Squats', type: 'timed', duration: 35, description: 'Explosive jumps, land softly' },
    { name: 'High Knees', type: 'timed', duration: 40, description: 'Sprint in place, knees up high' },
    { name: 'Plank Jacks', type: 'timed', duration: 35, description: 'Jump feet wide and narrow in plank' },
    { name: 'Box Jumps (or Step-Ups)', type: 'reps', reps: 10, sets: 3, description: 'Use a sturdy surface, land softly' },
  ],
  yoga: [
    { name: 'Sun Salutation A', type: 'timed', duration: 120, description: 'Flow through the full sequence slowly' },
    { name: 'Warrior I', type: 'timed', duration: 45, description: 'Each side, sink deep into the lunge' },
    { name: 'Warrior II', type: 'timed', duration: 45, description: 'Arms extended, gaze over front hand' },
    { name: 'Triangle Pose', type: 'timed', duration: 40, description: 'Each side, lengthen through the spine' },
    { name: 'Downward Dog', type: 'timed', duration: 60, description: 'Press heels toward ground, relax neck' },
    { name: 'Pigeon Pose', type: 'timed', duration: 60, description: 'Each side, breathe into the stretch' },
  ],
  fullbody: [
    { name: 'Burpees', type: 'reps', reps: 10, sets: 3, description: 'Full range, push-up at bottom' },
    { name: 'Bodyweight Squats', type: 'reps', reps: 15, sets: 3, description: 'Below parallel, controlled' },
    { name: 'Push-Ups', type: 'reps', reps: 12, sets: 3, description: 'Chest to ground, full lockout' },
    { name: 'Plank Hold', type: 'timed', duration: 60, description: 'Tight core, neutral spine' },
    { name: 'Lunges', type: 'reps', reps: 12, sets: 3, description: 'Alternating, keep torso upright' },
    { name: 'Superman Hold', type: 'timed', duration: 30, description: 'Lift arms and legs off ground' },
  ],
};

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

function makeExercise(template: Omit<Exercise, 'id' | 'completed'>): Exercise {
  return { ...template, id: uid(), completed: false };
}

function detectCategory(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('upper') || lower.includes('arm') || lower.includes('chest') || lower.includes('shoulder') || lower.includes('push')) return 'upper';
  if (lower.includes('lower') || lower.includes('leg') || lower.includes('squat') || lower.includes('glute')) return 'lower';
  if (lower.includes('core') || lower.includes('ab') || lower.includes('belly')) return 'core';
  if (lower.includes('hiit') || lower.includes('cardio') || lower.includes('intense') || lower.includes('burn')) return 'hiit';
  if (lower.includes('yoga') || lower.includes('stretch') || lower.includes('flex') || lower.includes('relax')) return 'yoga';
  if (lower.includes('full') || lower.includes('total') || lower.includes('whole')) return 'fullbody';
  return 'fullbody';
}

function detectTitle(input: string, category: string): string {
  const titles: Record<string, string> = {
    upper: 'Upper Body Blast',
    lower: 'Lower Body Power',
    core: 'Core Crusher',
    hiit: 'HIIT Burn',
    yoga: 'Yoga Flow',
    fullbody: 'Full Body Workout',
  };
  return titles[category] || 'Custom Workout';
}

function isWorkoutRequest(input: string): boolean {
  const lower = input.toLowerCase();
  const keywords = [
    'workout', 'exercise', 'train', 'hiit', 'cardio', 'strength', 'yoga',
    'stretch', 'core', 'abs', 'legs', 'arms', 'chest', 'back', 'shoulder',
    'push', 'pull', 'squat', 'lunge', 'burpee', 'plank', 'run', 'body',
    'muscle', 'fit', 'gym', 'session', 'routine', 'minute', 'min',
    'intense', 'quick', 'full body', 'upper', 'lower', 'burn', 'sweat',
  ];
  return keywords.some((kw) => lower.includes(kw));
}

export function generateWorkout(userPrompt: string): Workout | null {
  if (!isWorkoutRequest(userPrompt)) return null;

  const category = detectCategory(userPrompt);
  const title = detectTitle(userPrompt, category);
  const exercises = EXERCISES[category] || EXERCISES.fullbody;
  const mainExercises = pickRandom(exercises, 4);
  const warmupExercises = pickRandom(WARMUPS, 2);
  const cooldownExercises = pickRandom(COOLDOWNS, 2);

  const phases: WorkoutPhase[] = [
    {
      id: uid(),
      name: 'Warm-Up',
      exercises: warmupExercises.map(makeExercise),
    },
    {
      id: uid(),
      name: 'Main Workout',
      exercises: mainExercises.map(makeExercise),
    },
    {
      id: uid(),
      name: 'Cool Down',
      exercises: cooldownExercises.map(makeExercise),
    },
  ];

  const totalSeconds = phases.reduce((total, phase) => {
    return total + phase.exercises.reduce((phaseTotal, ex) => {
      if (ex.type === 'timed') return phaseTotal + (ex.duration || 0);
      return phaseTotal + (ex.reps || 0) * (ex.sets || 1) * 3;
    }, 0);
  }, 0);

  return {
    id: uid(),
    title,
    phases,
    estimatedMinutes: Math.max(10, Math.round(totalSeconds / 60)),
    createdAt: Date.now(),
  };
}
