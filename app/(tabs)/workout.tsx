import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { Host, Toggle, Button } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize } from '@expo/ui/swift-ui/modifiers';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useConversations } from '@/store/conversations';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ExerciseTimer } from '@/components/exercise-timer';
import type { Exercise } from '@/types/workout';

function ExerciseRow({
  exercise,
  phaseId,
  onToggle,
}: {
  exercise: Exercise;
  phaseId: string;
  onToggle: (phaseId: string, exerciseId: string) => void;
}) {
  const detail =
    exercise.type === 'timed'
      ? `${exercise.duration}s`
      : `${exercise.sets} × ${exercise.reps} reps`;

  return (
    <View style={styles.exerciseRow}>
      <Host matchContents>
        <Toggle
          isOn={exercise.completed}
          onIsOnChange={() => onToggle(phaseId, exercise.id)}
          label={exercise.name}
        />
      </Host>
      <View style={styles.exerciseDetails}>
        <ThemedText style={[styles.exerciseDetail, exercise.completed && styles.completedText]}>
          {detail}
        </ThemedText>
        <ThemedText style={[styles.exerciseDescription, exercise.completed && styles.completedText]}>
          {exercise.description}
        </ThemedText>
      </View>
      {exercise.type === 'timed' && !exercise.completed && (
        <ExerciseTimer
          duration={exercise.duration || 0}
          onComplete={() => onToggle(phaseId, exercise.id)}
        />
      )}
    </View>
  );
}

export default function WorkoutScreen() {
  const { activeWorkout, toggleExerciseComplete, setActiveWorkout } = useConversations();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme].tint;

  useKeepAwake();

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

          {activeWorkout.phases.map((phase) => {
            const phaseCompleted = phase.exercises.filter((e) => e.completed).length;
            return (
              <View key={phase.id} style={styles.phaseSection}>
                <View style={styles.phaseHeader}>
                  <ThemedText style={styles.phaseName}>{phase.name}</ThemedText>
                  <ThemedText style={[styles.phaseCount, { color: tint }]}>
                    {phaseCompleted}/{phase.exercises.length}
                  </ThemedText>
                </View>
                {phase.exercises.map((exercise) => (
                  <ExerciseRow
                    key={exercise.id}
                    exercise={exercise}
                    phaseId={phase.id}
                    onToggle={toggleExerciseComplete}
                  />
                ))}
              </View>
            );
          })}

          <Host matchContents style={styles.endButtonHost}>
            <Button
              label={isFinished ? 'Dismiss Workout' : 'End Workout'}
              systemImage="xmark.circle"
              role="destructive"
              modifiers={[buttonStyle('bordered'), controlSize('large')]}
              onPress={() => setActiveWorkout(null)}
            />
          </Host>
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
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 6,
    marginBottom: 4,
  },
  exerciseDetails: {
    paddingLeft: 4,
  },
  exerciseDetail: {
    fontSize: 14,
    opacity: 0.7,
  },
  exerciseDescription: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 2,
    lineHeight: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
  endButtonHost: {
    alignSelf: 'center',
    marginTop: 12,
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
