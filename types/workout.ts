export type ExerciseType = 'timed' | 'reps';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  duration?: number;
  reps?: number;
  sets?: number;
  description: string;
  completed: boolean;
}

export interface WorkoutPhase {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Workout {
  id: string;
  title: string;
  phases: WorkoutPhase[];
  estimatedMinutes: number;
  createdAt: number;
}

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  workout?: Workout;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
