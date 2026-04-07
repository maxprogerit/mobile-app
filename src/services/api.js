import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local IP when testing on a physical device
export const BASE_URL = 'http://192.168.0.6:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Offline request queue
const QUEUE_KEY = 'offline_queue';

async function enqueueRequest(config) {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  const queue = raw ? JSON.parse(raw) : [];
  queue.push({ ...config, queuedAt: Date.now() });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function flushQueue() {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return;
  const queue = JSON.parse(raw);
  const remaining = [];
  for (const req of queue) {
    try {
      await api(req);
    } catch {
      remaining.push(req);
    }
  }
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}

// ── Moods ──────────────────────────────────────────────────────────────────

export async function fetchMonthMoods(year, month) {
  const cacheKey = `moods_${year}_${month}`;
  try {
    const res = await api.get('/api/moods/month', { params: { year, month } });
    await AsyncStorage.setItem(cacheKey, JSON.stringify(res.data));
    return res.data;
  } catch {
    const cached = await AsyncStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : [];
  }
}

export async function fetchDayMood(date) {
  const cacheKey = `mood_${date}`;
  try {
    const res = await api.get(`/api/moods/day/${date}`);
    await AsyncStorage.setItem(cacheKey, JSON.stringify(res.data));
    return res.data;
  } catch {
    const cached = await AsyncStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }
}

export async function saveMood(payload) {
  // payload: { date, score, tags, note }
  try {
    const res = await api.post('/api/moods', payload);
    // Invalidate day and month cache
    await AsyncStorage.removeItem(`mood_${payload.date}`);
    return res.data;
  } catch {
    await enqueueRequest({ method: 'POST', url: '/api/moods', data: payload });
    return null;
  }
}
