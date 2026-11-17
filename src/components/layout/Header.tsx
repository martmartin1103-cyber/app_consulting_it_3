import { Compass, RotateCcw } from 'lucide-react';
import type { ThemeMode } from '../../services/storage';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  projectTitle: string;
  onProjectTitleChange: (title: string) => void;
  onLoadPreset: (preset: 'cloud' | 'erp') => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Header({
  projectTitle,
  onProjectTitleChange,
  onLoadPreset,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start gap-3 sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-white shadow-xs dark:bg-blue-700">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Vendor/Tech Radar
              </h1>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                AHP · ADR Advisory
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <label
                htmlFor="project-title-input"
                className="shrink-0 whitespace-nowrap text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Mission :
              </label>
              <input
                id="project-title-input"
                type="text"
                value={projectTitle}
                onChange={(e) => onProjectTitleChange(e.target.value)}
                placeholder="Nom de la mission ou du cadrage..."
                className="w-full max-w-md rounded border border-transparent bg-transparent px-1.5 py-0.5 text-sm font-medium text-slate-800 transition hover:border-slate-300 focus:border-blue-600 focus:bg-slate-50 focus:outline-none dark:text-slate-200 dark:hover:border-slate-700 dark:focus:border-blue-400 dark:focus:bg-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/70">
            <span className="px-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              Scénarios :
            </span>
            <button
              id="preset-cloud-btn"
              type="button"
              onClick={() => onLoadPreset('cloud')}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-white hover:text-blue-800 hover:shadow-2xs dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-blue-300"
              title="Charger le scénario Cloud (AWS vs Azure vs GCP)"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Cloud
            </button>
            <button
              id="preset-erp-btn"
              type="button"
              onClick={() => onLoadPreset('erp')}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-white hover:text-blue-800 hover:shadow-2xs dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-blue-300"
              title="Charger le scénario ERP (SAP vs Odoo)"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              ERP
            </button>
          </div>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
