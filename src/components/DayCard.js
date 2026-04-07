import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getMoodColor, colors, spacing, radius, typography } from '../utils/theme';

export default function DayCard({ mood }) {
  if (!mood) return null;

  const moodColor = getMoodColor(mood.score);

  return (
    <View style={[styles.card, { borderLeftColor: moodColor }]}>
      <View style={styles.scoreRow}>
        <View style={[styles.scoreDot, { backgroundColor: moodColor }]} />
        <Text style={[typography.h2, { color: moodColor }]}>{mood.score}</Text>
        <Text style={[typography.label, styles.scoreLabel]}> / 10</Text>
      </View>

      {mood.tags?.length > 0 && (
        <View style={styles.tags}>
          {mood.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={[typography.caption, { color: moodColor }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {mood.note ? (
        <Text style={[typography.body, styles.note]}>{mood.note}</Text>
      ) : (
        <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xs }]}>
          No note for this day
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    borderLeftWidth: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  scoreDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  scoreLabel: {
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  note: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
