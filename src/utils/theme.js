export const colors = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  border: '#2E2E2E',
  text: '#F0F0F0',
  textSecondary: '#888888',
  textMuted: '#555555',

  // Mood gradient: red (low) -> yellow -> green (high)
  mood1: '#FF3B5C',
  mood2: '#FF6B35',
  mood3: '#FFA500',
  mood4: '#FFD700',
  mood5: '#ADFF2F',
  mood6: '#7FFF00',
  mood7: '#00E676',
  mood8: '#00BCD4',
  mood9: '#2979FF',
  mood10: '#9C27B0',

  empty: '#2A2A2A',
  primary: '#7FFF00',
};

export const moodGradient = [
  colors.mood1,
  colors.mood2,
  colors.mood3,
  colors.mood4,
  colors.mood5,
  colors.mood6,
  colors.mood7,
  colors.mood8,
  colors.mood9,
  colors.mood10,
];

export function getMoodColor(score) {
  if (!score || score < 1) return colors.empty;
  const index = Math.max(0, Math.min(9, Math.round(score) - 1));
  return moodGradient[index];
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.text },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text },
  h3: { fontSize: 18, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, fontWeight: '400', color: colors.text },
  caption: { fontSize: 12, fontWeight: '400', color: colors.textSecondary },
  label: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
};
