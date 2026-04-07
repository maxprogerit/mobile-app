import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { moodGradient, colors, spacing, radius, typography } from '../utils/theme';

const TRACK_HEIGHT = 20;

export default function MoodSlider({ value = 5, onChange }) {
  const [score, setScore] = useState(value);
  const { width } = Dimensions.get('window');
  const trackWidth = width - spacing.md * 4;
  const trackRef = useRef({ x: 0 });

  const scoreToX = (s) => ((s - 1) / 9) * trackWidth;

  const xToScore = (x) => {
    const clamped = Math.max(0, Math.min(trackWidth, x));
    return Math.round((clamped / trackWidth) * 9) + 1;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const relX = e.nativeEvent.pageX - trackRef.current.x;
      const newScore = xToScore(relX);
      setScore(newScore);
      onChange?.(newScore);
      Haptics.selectionAsync();
    },
    onPanResponderMove: (e) => {
      const relX = e.nativeEvent.pageX - trackRef.current.x;
      const newScore = xToScore(relX);
      if (newScore !== score) {
        setScore(newScore);
        onChange?.(newScore);
        Haptics.selectionAsync();
      }
    },
  });

  const moodColor = moodGradient[score - 1];

  return (
    <View style={styles.container}>
      <View
        onLayout={(e) => {
          trackRef.current.x = e.nativeEvent.layout.x;
        }}
        {...panResponder.panHandlers}
        style={styles.trackWrapper}
      >
        <LinearGradient
          colors={moodGradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.track}
        />
        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              left: scoreToX(score) - 14,
              borderColor: moodColor,
              shadowColor: moodColor,
            },
          ]}
        />
      </View>

      <View style={styles.labels}>
        <Text style={[typography.caption, { color: colors.mood1 }]}>Low</Text>
        <Text style={[typography.h3, { color: moodColor }]}>{score}</Text>
        <Text style={[typography.caption, { color: colors.mood10 }]}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md * 2,
    paddingVertical: spacing.md,
  },
  trackWrapper: {
    height: TRACK_HEIGHT + 28,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: radius.full,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 3,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
    top: (TRACK_HEIGHT + 28) / 2 - 14,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
