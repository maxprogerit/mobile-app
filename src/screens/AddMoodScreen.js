import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import useMoodStore from '../store/moodStore';
import MoodSlider from '../components/MoodSlider';
import { getMoodColor, colors, spacing, radius, typography } from '../utils/theme';
import { today } from '../utils/dateUtils';

const QUICK_TAGS = ['happy', 'calm', 'tired', 'anxious', 'excited', 'sad', 'focused', 'stressed'];

export default function AddMoodScreen({ route, navigation }) {
  const date = route?.params?.date || today();
  const { saving, saveNewMood } = useMoodStore();

  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);

  const toggleTag = (tag) => {
    Haptics.selectionAsync();
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ok = await saveNewMood({ date, score, tags, note });
    if (ok) {
      navigation.goBack();
    } else {
      Alert.alert('Saved offline', 'Mood queued — will sync when back online.');
      navigation.goBack();
    }
  };

  const moodColor = getMoodColor(score);

  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.dateRow}>
        <Text style={[typography.label, { color: colors.textSecondary }]}>{date}</Text>
      </View>

      <Text style={[typography.h3, styles.sectionTitle]}>How do you feel?</Text>

      <MoodSlider value={score} onChange={setScore} />

      {/* Score badge */}
      <View style={[styles.scoreBadge, { borderColor: moodColor }]}>
        <Text style={[typography.h1, { color: moodColor }]}>{score}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>/10</Text>
      </View>

      <Text style={[typography.h3, styles.sectionTitle]}>Tags</Text>
      <View style={styles.tagsRow}>
        {QUICK_TAGS.map((tag) => {
          const active = tags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              onPress={() => toggleTag(tag)}
              style={[styles.tag, active && { backgroundColor: moodColor, borderColor: moodColor }]}
            >
              <Text style={[styles.tagText, active && { color: '#000' }]}>{tag}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[typography.h3, styles.sectionTitle]}>Note</Text>
      <TextInput
        style={styles.input}
        placeholder="How was your day? (optional)"
        placeholderTextColor={colors.textMuted}
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: moodColor }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.saveBtnText}>Save Mood</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: spacing.xl * 2 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dateRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  tagText: {
    ...typography.label,
    color: colors.text,
  },
  input: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: 15,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveBtn: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderRadius: radius.full,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
