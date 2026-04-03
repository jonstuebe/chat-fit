import {
  createContext,
  useContext,
  useState,
  useCallback,
  type PropsWithChildren,
} from 'react';
import type {
  Conversation,
  ChatMessage,
  Workout,
} from '@/types/workout';
import { generateWorkout } from '@/utils/workout-generator';

interface ConversationStore {
  conversations: Conversation[];
  activeWorkout: Workout | null;
  activeWorkoutConversationId: string | null;
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  setActiveWorkout: (workout: Workout | null, conversationId?: string | null) => void;
  toggleExerciseComplete: (phaseId: string, exerciseId: string) => void;
  getConversation: (id: string) => Conversation | undefined;
}

const StoreContext = createContext<ConversationStore | null>(null);

export function ConversationProvider({ children }: PropsWithChildren) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeWorkout, setActiveWorkoutState] = useState<Workout | null>(null);
  const [activeWorkoutConversationId, setActiveWorkoutConversationId] = useState<string | null>(null);

  const createConversation = useCallback(() => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const conversation: Conversation = {
      id,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [conversation, ...prev]);
    return id;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(36) + 'u',
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const isFirstMessage = c.messages.length === 0;
        return {
          ...c,
          title: isFirstMessage ? content.slice(0, 40) : c.title,
          messages: [...c.messages, userMessage],
          updatedAt: Date.now(),
        };
      })
    );

    setTimeout(() => {
      const workout = generateWorkout(content);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(36) + 'a',
        role: 'assistant',
        content: workout
          ? `Here's a ${workout.title} workout I put together for you! It should take about ${workout.estimatedMinutes} minutes. Tap "Start Workout" when you're ready.`
          : getConversationalResponse(content),
        workout: workout || undefined,
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          return {
            ...c,
            messages: [...c.messages, assistantMessage],
            updatedAt: Date.now(),
          };
        })
      );
    }, 800);
  }, []);

  const setActiveWorkout = useCallback((workout: Workout | null, conversationId?: string | null) => {
    setActiveWorkoutState(workout);
    setActiveWorkoutConversationId(conversationId ?? null);
  }, []);

  const toggleExerciseComplete = useCallback((phaseId: string, exerciseId: string) => {
    setActiveWorkoutState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        phases: prev.phases.map((phase) => {
          if (phase.id !== phaseId) return phase;
          return {
            ...phase,
            exercises: phase.exercises.map((ex) => {
              if (ex.id !== exerciseId) return ex;
              return { ...ex, completed: !ex.completed };
            }),
          };
        }),
      };
    });
  }, []);

  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations]
  );

  return (
    <StoreContext.Provider
      value={{
        conversations,
        activeWorkout,
        activeWorkoutConversationId,
        createConversation,
        deleteConversation,
        sendMessage,
        setActiveWorkout,
        toggleExerciseComplete,
        getConversation,
      }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useConversations must be used within ConversationProvider');
  return ctx;
}

function getConversationalResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hey! I'm ChatFit, your workout assistant. Tell me what kind of workout you're looking for today — like \"30 minute HIIT\" or \"upper body strength\" — and I'll build a plan for you!";
  }
  if (lower.includes('thank')) {
    return "You're welcome! Let me know if you want another workout or have any questions.";
  }
  if (lower.includes('how') && lower.includes('work')) {
    return "Just tell me what you're in the mood for! I can create workouts based on muscle groups, workout styles (HIIT, yoga, strength), duration, or equipment. For example, try saying \"20 minute bodyweight leg workout\".";
  }
  return "I can help you build a workout! Try describing what you're looking for — like the muscle group, duration, intensity, or style. For example: \"quick core workout\" or \"45 minute full body with dumbbells\".";
}
