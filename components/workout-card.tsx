import { StyleSheet, View } from 'react-native';
import { Host, Button } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize } from '@expo/ui/swift-ui/modifiers';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import type { Workout } from '@/types/workout';

export function WorkoutCard({
  workout,
  onStart,
}: {
  workout: Workout;
  onStart: () => void;
}) {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme].tint;

  const totalExercises = workout.phases.reduce(
    (sum, p) => sum + p.exercises.length,
    0
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#fff',
          borderColor: colorScheme === 'dark' ? '#38383A' : '#E5E5EA',
        },
      ]}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: tint + '20' }]}>
          <IconSymbol name="figure.run" size={20} color={tint} />
        </View>
        <View style={styles.cardHeaderText}>
          <ThemedText style={styles.cardTitle}>{workout.title}</ThemedText>
          <ThemedText style={styles.cardMeta}>
            {totalExercises} exercises · ~{workout.estimatedMinutes} min
          </ThemedText>
        </View>
      </View>

      <View style={styles.phases}>
        {workout.phases.map((phase) => (
          <View key={phase.id} style={styles.phaseRow}>
            <View style={[styles.phaseDot, { backgroundColor: tint }]} />
            <ThemedText style={styles.phaseName}>{phase.name}</ThemedText>
            <ThemedText style={styles.phaseExerciseCount}>
              {phase.exercises.length} exercises
            </ThemedText>
          </View>
        ))}
      </View>

      <Host matchContents style={styles.buttonHost}>
        <Button
          label="Start Workout"
          systemImage="play.fill"
          onPress={onStart}
          modifiers={[buttonStyle('borderedProminent'), controlSize('large')]}
        />
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  cardMeta: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  phases: {
    gap: 8,
    marginBottom: 14,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  phaseName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  phaseExerciseCount: {
    fontSize: 13,
    opacity: 0.5,
  },
  buttonHost: {
    alignSelf: 'stretch',
  },
});
