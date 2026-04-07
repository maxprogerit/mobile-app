import { create } from 'zustand';
import { fetchMonthMoods, fetchDayMood, saveMood } from '../services/api';
import { today } from '../utils/dateUtils';

const now = new Date();

const useMoodStore = create((set, get) => ({
  // Current month navigation
  year: now.getFullYear(),
  month: now.getMonth(), // 0-indexed

  // Data
  monthMoods: {}, // { 'YYYY-MM-DD': { score, tags, note } }
  selectedDate: today(),
  selectedMood: null,

  // UI state
  loadingMonth: false,
  loadingDay: false,
  saving: false,
  error: null,

  // ── Month navigation ────────────────────────────────────────────────────

  goToPrevMonth: () => {
    const { year, month } = get();
    if (month === 0) set({ year: year - 1, month: 11 });
    else set({ month: month - 1 });
    get().loadMonth();
  },

  goToNextMonth: () => {
    const { year, month } = get();
    if (month === 11) set({ year: year + 1, month: 0 });
    else set({ month: month + 1 });
    get().loadMonth();
  },

  // ── Loading ─────────────────────────────────────────────────────────────

  loadMonth: async () => {
    const { year, month } = get();
    set({ loadingMonth: true, error: null });
    try {
      const data = await fetchMonthMoods(year, month + 1); // API months are 1-indexed
      const mapped = {};
      for (const item of data) mapped[item.date] = item;
      set({ monthMoods: mapped });
    } catch (e) {
      set({ error: e.message });
    } finally {
      set({ loadingMonth: false });
    }
  },

  selectDay: async (date) => {
    set({ selectedDate: date, loadingDay: true });
    try {
      const data = await fetchDayMood(date);
      set({ selectedMood: data });
    } catch {
      set({ selectedMood: null });
    } finally {
      set({ loadingDay: false });
    }
  },

  // ── Saving ──────────────────────────────────────────────────────────────

  saveNewMood: async (payload) => {
    set({ saving: true, error: null });
    try {
      await saveMood(payload);
      // Update local cache
      set((state) => ({
        monthMoods: { ...state.monthMoods, [payload.date]: payload },
        selectedMood: payload,
      }));
      return true;
    } catch (e) {
      set({ error: e.message });
      return false;
    } finally {
      set({ saving: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useMoodStore;
