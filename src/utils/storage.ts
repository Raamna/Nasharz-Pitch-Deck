import { DeckData, LoginLog } from '../types';
import { initialDeckData } from '../data/defaultData';

const STORAGE_KEY = 'nasharz_alaska_deck_data_v37';

export function getStoredData(): DeckData {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDeckData));
      return initialDeckData;
    }
    const parsed = JSON.parse(dataStr) as DeckData;
    // Ensure all critical properties exist
    return {
      branding: { ...initialDeckData.branding, ...(parsed.branding || {}) },
      chapters: parsed.chapters && parsed.chapters.length > 0 ? parsed.chapters : initialDeckData.chapters,
      estimates: parsed.estimates && parsed.estimates.length > 0 ? parsed.estimates : initialDeckData.estimates,
      logs: parsed.logs || initialDeckData.logs,
      mediaAssets: Array.isArray(parsed.mediaAssets) ? parsed.mediaAssets : (initialDeckData.mediaAssets || []),
    };
  } catch (e) {
    console.error('Error loading data from localStorage', e);
    return initialDeckData;
  }
}

export function saveStoredData(data: DeckData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data to localStorage', e);
  }
}

export function logUserAccess(name: string, role: 'client' | 'admin'): void {
  const current = getStoredData();
  const newLog: LoginLog = {
    id: `log-${Date.now()}`,
    name: name || 'Anonymous Client',
    role,
    timestamp: new Date().toLocaleString(),
  };
  const updatedLogs = [newLog, ...current.logs].slice(0, 50); // Keep last 50
  saveStoredData({ ...current, logs: updatedLogs });
}

export function resetToFactoryDefault(): DeckData {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDeckData));
  return initialDeckData;
}
