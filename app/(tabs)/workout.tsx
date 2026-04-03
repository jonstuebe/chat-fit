import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useConversations } from '@/store/conversations';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ExerciseTimer } from '@/components/exercise-timer';
import type { Exercise, WorkoutPhase } from '@/types/workout';

function ExerciseRow({
  exercise,
  phaseId,
  onToggle,
  tint,
}: {
  exercise: Exercise;
  phaseId: string;
  onToggle: (phaseId: string, exerciseId: string) => void;
  tint: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.exerciseRow, exercise.completed && styles.exerciseCompleted]}
      activeOpacity={0.7}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle(phaseId, exercise.id);
      }}>
      <View style={[styles.checkbox, exercise.completed && { backgroundColor: tint, borderColor: tint }]}>
        {exercise.completed && (
          <IconSymbol name="checkmark" size={14} color="#fff" />
        )}
      </View>
      <View style={styles.exerciseInfo}>
        <ThemedText
          style={[
            styles.exerciseName,
            exercise.completed && styles.exerciseNameCompleted,
          ]}>
          {exercise.name}
        </ThemedText>
        <ThemedText style={styles.exerciseDetail}>
          {exercise.type === 'timed'
            ? `${exercise.duration}s`
            : `${exercise.sets} × ${exercise.reps} reps`}
        </ThemedText>
        <ThemedText style={styles.exerciseDescription}>
          {exercise.description}
        </ThemedText>
      </View>
      {exercise.type === 'timed' && !exercise.completed && (
        <ExerciseTimer
          duration={exercise.duration || 0}
          onComplete={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onToggle(phaseId, exercise.id);
          }}
        />
      )}
    </TouchableOpacity>
  );
}

function PhaseSection({
  phase,
  onToggle,
  tint,
}: {
  phase: WorkoutPhase;
  onToggle: (phaseId: string, exerciseId: string) => void;
  tint: string;
}) {
  const completed = phase.exercises.filter((e) => e.completed).length;
  const total = phase.exercises.length;

  return (
    <View style={styles.phaseSection}>
      <View style={styles.phaseHeader}>
        <ThemedText style={styles.phaseName}>{phase.name}</ThemedText>
        <ThemedText style={[styles.phaseCount, { color: tint }]}>
          {completed}/{total}
        </ThemedText>
      </View>
      {phase.exercises.map((exercise) => (
        <ExerciseRow
          key={exercise.id}
          exercise={exercise}
          phaseId={phase.id}
          onToggle={onToggle}
          tint={tint}
        />
      ))}
    </View>
  );
}

export default function WorkoutScreen() {
  const { activeWorkout, toggleExerciseComplete, setActiveWorkout } = useConversations();
  const colorScheme = useColorScheme() ?? 'light';
  const tint = Colors[colorScheme].tint;

  const totalExercises = activeWorkout
    ? activeWorkout.phases.reduce((sum, p) => sum + p.exercises.length, 0)
    : 0;
  const completedExercises = activeWorkout
    ? activeWorkout.phases.reduce(
        (sum, p) => sum + p.exercises.filter((e) => e.completed).length,
        0
      )
    : 0;
  const progress = totalExercises > 0 ? completedExercises / totalExercises : 0;
  const isFinished = totalExercises > 0 && completedExercises === totalExercises;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Workout',
          headerLargeTitle: true,
        }}
      />

      {!activeWorkout ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: tint + '15' }]}>
            <IconSymbol name="figure.run" size={48} color={tint} />
          </View>
          <ThemedText style={styles.emptyTitle}>No Active Workout</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Start a chat and generate a workout plan to begin tracking your exercises here
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText style={styles.workoutTitle}>{activeWorkout.title}</ThemedText>
            <ThemedText style={[styles.workoutMeta, { color: tint }]}>
              ~{activeWorkout.estimatedMinutes} min
            </ThemedText>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: isFinished ? '#34C759' : tint,
                  },
                ]}
              />
            </View>
            <ThemedText style={styles.progressText}>
              {completedExercises} of {totalExercises} exercises
            </ThemedText>
          </View>

          {isFinished && (
            <View style={[styles.finishedBanner, { backgroundColor: '#34C759' + '20' }]}>
              <IconSymbol name="checkmark.circle.fill" size={24} color="#34C759" />
              <ThemedText style={[styles.finishedText, { color: '#34C759' }]}>
                Workout Complete! Great job!
              </ThemedText>
            </View>
          )}

          {activeWorkout.phases.map((phase) => (
            <PhaseSection
              key={phase.id}
              phase={phase}
              onToggle={toggleExerciseComplete}
              tint={tint}
            />
          ))}

          <TouchableOpacity
            style={[styles.endButton, { borderColor: '#FF3B30' }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setActiveWorkout(null);
            }}
            activeOpacity={0.7}>
            <ThemedText style={[styles.endButtonText, { color: '#FF3B30' }]}>
              {isFinished ? 'Dismiss Workout' : 'End Workout'}
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  workoutMeta: {
    fontSize: 15,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8884',
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    opacity: 0.6,
  },
  finishedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  finishedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  phaseSection: {
    marginBottom: 20,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8884',
  },
  phaseName: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phaseCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  exerciseCompleted: {
    opacity: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8888',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseNameCompleted: {
    textDecorationLine: 'line-through',
  },
  exerciseDetail: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  exerciseDescription: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 4,
    lineHeight: 18,
  },
  endButton: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  endButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
  },
});
