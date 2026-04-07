import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../utils/theme';
import { getMonthLabel } from '../utils/dateUtils';

export default function MonthSwitcher({ year, month, onPrev, onNext }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrev} style={styles.btn} hitSlop={12}>
        <Text style={styles.arrow}>‹</Text>
      </TouchableOpacity>

      <Text style={[typography.h3, styles.label]}>
        {getMonthLabel(year, month)}
      </Text>

      <TouchableOpacity onPress={onNext} style={styles.btn} hitSlop={12}>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  btn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 32,
    color: colors.text,
    lineHeight: 36,
  },
  label: {
    flex: 1,
    textAlign: 'center',
  },
});
