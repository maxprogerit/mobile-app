import React, { useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import useMoodStore from '../store/moodStore';
import CalendarGrid from '../components/CalendarGrid';
import MonthSwitcher from '../components/MonthSwitcher';
import DayCard from '../components/DayCard';
import { colors, spacing, typography } from '../utils/theme';
import { today } from '../utils/dateUtils';

export default function HomeScreen({ navigation }) {
  const {
    year, month, monthMoods, selectedDate, selectedMood,
    loadingMonth, loadMonth, goToPrevMonth, goToNextMonth, selectDay,
  } = useMoodStore();

  useEffect(() => {
    loadMonth();
    selectDay(today());
  }, []);

  const onRefresh = useCallback(() => {
    loadMonth();
  }, []);

  const handleDayPress = (date) => {
    selectDay(date);
  };

  return (
    <ScrollView
      style={styles.screen}
      refreshControl={
        <RefreshControl refreshing={loadingMonth} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <View style={styles.header}>
        <Text style={typography.h1}>Mood Tracker</Text>
        <Text style={[typography.caption, { marginTop: 2 }]}>How are you feeling?</Text>
      </View>

      <MonthSwitcher
        year={year}
        month={month}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
      />

      {loadingMonth ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
      ) : (
        <CalendarGrid
          year={year}
          month={month}
          moods={monthMoods}
          selectedDate={selectedDate}
          onDayPress={handleDayPress}
        />
      )}

      {selectedDate && (
        <View style={styles.daySection}>
          <Text style={[typography.label, styles.dayLabel]}>{selectedDate}</Text>
          {selectedMood ? (
            <DayCard mood={selectedMood} />
          ) : (
            <Text style={[typography.caption, { color: colors.textMuted, paddingHorizontal: spacing.md }]}>
              No mood logged for this day
            </Text>
          )}
        </View>
      )}

      <View style={{ height: spacing.xl * 2 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  daySection: {
    marginTop: spacing.lg,
  },
  dayLabel: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
});
