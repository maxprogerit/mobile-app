import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getMoodColor, colors, spacing, typography } from '../utils/theme';

// Mini heatmap: renders a compact week-column grid for a month
export default function Heatmap({ year, month, moods = {}, size = 10 }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const cols = [];
  for (let i = 0; i < cells.length; i += 7) {
    cols.push(cells.slice(i, i + 7));
  }

  const mm = String(month + 1).padStart(2, '0');

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {cols.map((col, ci) => (
          <View key={ci} style={styles.col}>
            {Array(7).fill(null).map((_, ri) => {
              const day = col[ri];
              if (!day) return <View key={ri} style={[styles.cell, { width: size, height: size }]} />;
              const dateStr = `${year}-${mm}-${String(day).padStart(2, '0')}`;
              const mood = moods[dateStr];
              const bg = getMoodColor(mood?.score);
              return (
                <View
                  key={ri}
                  style={[styles.cell, { width: size, height: size, backgroundColor: bg, borderRadius: size / 4 }]}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'flex-start' },
  grid: { flexDirection: 'row' },
  col: { flexDirection: 'column' },
  cell: { margin: 1, backgroundColor: colors.empty },
});
