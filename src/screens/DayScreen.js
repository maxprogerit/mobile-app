import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import useMoodStore from '../store/moodStore';
import DayCard from '../components/DayCard';
import { colors, spacing, typography, radius } from '../utils/theme';

export default function DayScreen({ route, navigation }) {
  const { date } = route.params;
  const { selectDay, selectedMood, loadingDay } = useMoodStore();

  useEffect(() => {
    selectDay(date);
  }, [date]);

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={typography.h2}>{date}</Text>
      </View>

      {loadingDay ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : selectedMood ? (
        <DayCard mood={selectedMood} />
      ) : (
        <View style={styles.empty}>
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg }]}>
            No mood logged for this day.
          </Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddMood', { date })}
          >
            <Text style={styles.addBtnText}>+ Log Mood</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedMood && (
        <TouchableOpacity
          style={[styles.addBtn, { margin: spacing.md }]}
          onPress={() => navigation.navigate('AddMood', { date })}
        >
          <Text style={styles.addBtnText}>Edit Mood</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
});
