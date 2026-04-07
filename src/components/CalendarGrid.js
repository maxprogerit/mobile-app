import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getMoodColor, colors, spacing, typography } from '../utils/theme';
import { getDaysInMonth, getFirstDayOfWeek } from '../utils/dateUtils';

const CELL = 42;
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarGrid({ year, month, moods = {}, onDayPress, selectedDate }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const cells = [];
  // Empty leading cells
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <View style={styles.container}>
      {/* Day labels */}
      <View style={styles.row}>
        {DAY_LABELS.map((d) => (
          <Text key={d} style={[styles.dayLabel, typography.caption]}>{d}</Text>
        ))}
      </View>

      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((day, ci) => {
            if (!day) return <View key={ci} style={styles.cell} />;

            const mm = String(month + 1).padStart(2, '0');
            const dd = String(day).padStart(2, '0');
            const dateStr = `${year}-${mm}-${dd}`;
            const mood = moods[dateStr];
            const moodColor = getMoodColor(mood?.score);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;

            return (
              <TouchableOpacity
                key={ci}
                onPress={() => onDayPress?.(dateStr)}
                style={[
                  styles.cell,
                  { backgroundColor: moodColor },
                  isSelected && styles.selected,
                  isToday && styles.today,
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dayText,
                  { color: mood ? '#000' : colors.textMuted },
                  isToday && { color: colors.primary, fontWeight: '700' },
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* Pad last row */}
          {row.length < 7 && Array(7 - row.length).fill(null).map((_, i) => (
            <View key={`pad-${i}`} style={styles.cell} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.md },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    backgroundColor: colors.empty,
  },
  dayLabel: {
    width: CELL,
    textAlign: 'center',
    margin: 2,
    color: colors.textMuted,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  today: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
