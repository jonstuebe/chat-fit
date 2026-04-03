import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export function ExerciseTimer({
  duration,
  onComplete,
}: {
  duration: number;
  onComplete: () => void;
}) {
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const tint = Colors[colorScheme].tint;

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining, onComplete]);

  const toggle = useCallback(() => {
    if (remaining <= 0) {
      setRemaining(duration);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  }, [remaining, duration]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`;
  };

  const progress = 1 - remaining / duration;

  return (
    <TouchableOpacity onPress={toggle} style={styles.container} activeOpacity={0.7}>
      <View style={styles.timerDisplay}>
        <ThemedText style={[styles.time, { color: tint }]}>
          {formatTime(remaining)}
        </ThemedText>
        <IconSymbol
          name={isRunning ? 'pause.fill' : 'play.fill'}
          size={12}
          color={tint}
        />
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: tint,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minWidth: 60,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    width: '100%',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#8884',
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
});
