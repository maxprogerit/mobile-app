import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import useMoodStore from '../store/moodStore';
import Heatmap from '../components/Heatmap';
import { getMoodColor, colors, spacing, radius, typography } from '../utils/theme';

export default function ProfileScreen() {
  const { year, month, monthMoods } = useMoodStore();

  const stats = useMemo(() => {
    const scores = Object.values(monthMoods)
      .map((m) => m.score)
      .filter(Boolean);
    if (!scores.length) return null;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    return { avg: avg.toFixed(1), max, min, count: scores.length };
  }, [monthMoods]);

  // Last 3 months for heatmaps
  const months = useMemo(() => {
    const arr = [];
    for (let i = 2; i >= 0; i--) {
      let m = month - i;
      let y = year;
      if (m < 0) { m += 12; y -= 1; }
      arr.push({ y, m });
    }
    return arr;
  }, [year, month]);

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <Text style={typography.h2}>Your Mood Journal</Text>
        <Text style={[typography.caption, { marginTop: 4 }]}>Personal tracking overview</Text>
      </View>

      {/* Stats */}
      <Text style={[typography.h3, styles.sectionTitle]}>This Month</Text>
      {stats ? (
        <View style={styles.statsRow}>
          <StatBox label="Average" value={stats.avg} color={getMoodColor(parseFloat(stats.avg))} />
          <StatBox label="Best Day" value={stats.max} color={getMoodColor(stats.max)} />
          <StatBox label="Logged" value={`${stats.count}d`} color={colors.primary} />
        </View>
      ) : (
        <Text style={[typography.caption, { color: colors.textMuted, paddingHorizontal: spacing.lg }]}>
          No data logged this month.
        </Text>
      )}

      {/* Heatmaps */}
      <Text style={[typography.h3, styles.sectionTitle]}>Recent Months</Text>
      {months.map(({ y, m }) => (
        <View key={`${y}-${m}`} style={styles.heatmapRow}>
          <Text style={[typography.label, { marginBottom: spacing.xs }]}>
            {new Date(y, m).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <Heatmap year={y} month={m} moods={monthMoods} size={12} />
        </View>
      ))}

      <View style={{ height: spacing.xl * 2 }} />
    </ScrollView>
  );
}

function StatBox({ label, value, color }) {
  return (
    <View style={[styles.statBox, { borderTopColor: color }]}>
      <Text style={[typography.h2, { color }]}>{value}</Text>
      <Text style={typography.caption}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    ...typography.h1,
    color: colors.primary,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderTopWidth: 3,
  },
  heatmapRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
