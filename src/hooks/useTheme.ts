import { useCallback, useEffect, useState } from 'react';
import {
  loadThemeMode,
  saveThemeMode,
  type ThemeMode,
} from '../services/storage';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => loadThemeMode());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveThemeMode(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggleTheme };
}
