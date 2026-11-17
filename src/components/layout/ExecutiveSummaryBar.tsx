import { Award, Scale, ShieldCheck } from 'lucide-react';
import type { AhpPairwiseResult, EvaluationSummary } from '../../domain/types';
import { Badge } from '../ui/Badge';

interface ExecutiveSummaryBarProps {
  evaluation: EvaluationSummary;
  pairwiseAnalysis: AhpPairwiseResult;
  criteriaCount: number;
  solutionsCount: number;
}

export function ExecutiveSummaryBar({
  evaluation,
  pairwiseAnalysis,
  criteriaCount,
  solutionsCount,
}: ExecutiveSummaryBarProps) {
  return (
    <section
      aria-label="Synthèse exécutive temps réel"
      className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Scale className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Pondération ({criteriaCount} critères)
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
              {evaluation.totalWeightPercent.toFixed(1)} %
            </span>
            <Badge variant={evaluation.isWeightValid ? 'emerald' : 'amber'}>
              {evaluation.isWeightValid ? 'Valide (100%)' : 'À ajuster'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Cohérence Saaty (CR)
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
              {(pairwiseAnalysis.cr * 100).toFixed(1)} %
            </span>
            <Badge variant={pairwiseAnalysis.isConsistent ? 'blue' : 'amber'}>
              {pairwiseAnalysis.isConsistent ? 'CR ≤ 10%' : 'CR > 10%'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:col-span-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <Award className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Leader actuel ({solutionsCount} solutions évaluées)
          </p>
          {evaluation.winner ? (
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">
                {evaluation.winner.solution.name}
              </span>
              <Badge variant="emerald">
                {evaluation.winner.totalScore100.toFixed(1)} / 100
              </Badge>
              {evaluation.runnerUp && (
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  (+{evaluation.leadMargin100.toFixed(1)} pts vs{' '}
                  {evaluation.runnerUp.solution.name})
                </span>
              )}
            </div>
          ) : (
            <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-300">
              En attente de notation dans la matrice
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
