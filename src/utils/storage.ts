import { DeckData, LoginLog } from '../types';
import { initialDeckData } from '../data/defaultData';

const STORAGE_KEY = 'nasharz_alaska_deck_data_v52';

export function getStoredData(): DeckData {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDeckData));
      return initialDeckData;
    }
    const parsed = JSON.parse(dataStr) as DeckData;
    
    // Merge chapters with default data to hydrate any missing new properties while preserving all admin edits
    const hydratedChapters = (parsed.chapters && parsed.chapters.length > 0 ? parsed.chapters : initialDeckData.chapters).map(ch => {
      const defaultCh = initialDeckData.chapters.find(c => c.id === ch.id);
      if (defaultCh) {
        return {
          ...defaultCh,
          ...ch,
          pdfFullText: defaultCh.pdfFullText || ch.pdfFullText,
          conceptTabs: ch.conceptTabs !== undefined ? ch.conceptTabs : defaultCh.conceptTabs,
          finalConceptsText: ch.finalConceptsText !== undefined ? ch.finalConceptsText : defaultCh.finalConceptsText,
          folders: ch.folders !== undefined ? ch.folders : defaultCh.folders,
          galleryImages: ch.galleryImages !== undefined ? ch.galleryImages : defaultCh.galleryImages,
          lastUpdated: ch.lastUpdated !== undefined ? ch.lastUpdated : defaultCh.lastUpdated,
        };
      }
      return ch;
    });

    return {
      branding: { ...initialDeckData.branding, ...(parsed.branding || {}) },
      chapters: hydratedChapters,
      estimates: parsed.estimates && parsed.estimates.length > 0 ? parsed.estimates : initialDeckData.estimates,
      logs: parsed.logs || initialDeckData.logs,
      mediaAssets: Array.isArray(parsed.mediaAssets) && parsed.mediaAssets.length > 0 ? parsed.mediaAssets : (initialDeckData.mediaAssets || []),
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
