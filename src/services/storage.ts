import type { RadarState } from '../domain/types';

const RADAR_STORAGE_KEY = 'vendor_tech_radar_state_v1';
const THEME_STORAGE_KEY = 'vendor_tech_radar_theme_v1';

export type ThemeMode = 'light' | 'dark';

export function loadRadarState(fallback: RadarState): RadarState {
  try {
    const raw = window.localStorage.getItem(RADAR_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<RadarState>;
    if (
      !parsed ||
      !Array.isArray(parsed.criteria) ||
      !Array.isArray(parsed.solutions) ||
      typeof parsed.scores !== 'object'
    ) {
      return fallback;
    }
    return {
      ...fallback,
      ...parsed,
      adr: {
        ...fallback.adr,
        ...(parsed.adr ?? {}),
      },
    };
  } catch {
    return fallback;
  }
}

export function saveRadarState(state: RadarState): void {
  try {
    window.localStorage.setItem(RADAR_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota or private-browsing storage errors
  }
}

export function loadThemeMode(): ThemeMode {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
  } catch {
    // Ignore
  }
  return 'light';
}

export function saveThemeMode(theme: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore
  }
}
