import { CheckCircle2, FileText, Layers, SlidersHorizontal, Table2 } from 'lucide-react';
import type { RadarStep } from '../../domain/types';

interface StepperProps {
  activeStep: RadarStep;
  onSelectStep: (step: RadarStep) => void;
  criteriaCount: number;
  solutionsCount: number;
  isWeightValid: boolean;
  hasWinner: boolean;
}

const STEPS: {
  id: RadarStep;
  title: string;
  subtitle: string;
  icon: typeof SlidersHorizontal;
}[] = [
  {
    id: 1,
    title: '1. Critères & Poids',
    subtitle: '3 à 5 critères (100%)',
    icon: SlidersHorizontal,
  },
  {
    id: 2,
    title: '2. Solutions',
    subtitle: '2 à 4 options concurrentes',
    icon: Layers,
  },
  {
    id: 3,
    title: '3. Matrice AHP',
    subtitle: 'Notation & classement',
    icon: Table2,
  },
  {
    id: 4,
    title: '4. Export ADR',
    subtitle: 'Format Michael Nygard',
    icon: FileText,
  },
];

export function Stepper({
  activeStep,
  onSelectStep,
  criteriaCount,
  solutionsCount,
  isWeightValid,
  hasWinner,
}: StepperProps) {
  const isStepComplete = (step: RadarStep): boolean => {
    if (step === 1) return criteriaCount >= 3 && criteriaCount <= 5 && isWeightValid;
    if (step === 2) return solutionsCount >= 2 && solutionsCount <= 4;
    if (step === 3) return hasWinner && isWeightValid;
    return false;
  };

  return (
    <nav aria-label="Étapes d'évaluation AHP" className="w-full">
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          const complete = isStepComplete(step.id);

          return (
            <li key={step.id}>
              <button
                id={`step-nav-${step.id}`}
                type="button"
                onClick={() => onSelectStep(step.id)}
                aria-current={isActive ? 'step' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 ${
                  isActive
                    ? 'border-blue-700 bg-blue-900 text-white shadow-sm dark:border-blue-500 dark:bg-blue-950 dark:text-slate-50'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/80'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isActive
                      ? 'bg-blue-800 text-blue-100 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">
                      {step.title}
                    </span>
                    {complete && (
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          isActive
                            ? 'text-emerald-300'
                            : 'text-emerald-700 dark:text-emerald-400'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p
                    className={`truncate text-xs ${
                      isActive
                        ? 'text-blue-100 dark:text-blue-200'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
