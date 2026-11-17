import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../../services/storage';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-blue-400"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
          <span>Mode Clair</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-slate-700" aria-hidden="true" />
          <span>Mode Sombre</span>
        </>
      )}
    </button>
  );
}
