import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import {
  SAATY_SCALE_OPTIONS,
  getPairwiseValue,
} from '../../domain/ahp';
import type { AhpPairwiseResult, Criterion, PairwiseMap } from '../../domain/types';
import { Badge } from '../ui/Badge';

interface PairwiseMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: Criterion[];
  pairwise: PairwiseMap;
  pairwiseAnalysis: AhpPairwiseResult;
  onChangePairwise: (idA: string, idB: string, value: number) => void;
  onApplyWeights: () => void;
}

export function PairwiseMatrixModal({
  isOpen,
  onClose,
  criteria,
  pairwise,
  pairwiseAnalysis,
  onChangePairwise,
  onApplyWeights,
}: PairwiseMatrixModalProps) {
  if (!isOpen) return null;

  const pairs: Array<{ a: Criterion; b: Criterion }> = [];
  for (let i = 0; i < criteria.length; i++) {
    for (let j = i + 1; j < criteria.length; j++) {
      pairs.push({ a: criteria[i], b: criteria[j] });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saaty-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2
              id="saaty-modal-title"
              className="text-lg font-bold text-slate-900 dark:text-slate-50"
            >
              Comparaison par Paires — Méthode AHP (Thomas Saaty)
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Comparez chaque paire de critères sur l’échelle fondamentale de Saaty (1 à 9) pour calculer mathématiquement le vecteur propre des priorités.
            </p>
          </div>
          <button
            id="close-saaty-modal-btn"
            type="button"
            onClick={onClose}
            aria-label="Fermer la matrice de Saaty"
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="space-y-3">
            {pairs.map(({ a, b }) => {
              const current = getPairwiseValue(pairwise, a.id, b.id);
              const closestOption = SAATY_SCALE_OPTIONS.reduce((prev, curr) =>
                Math.abs(curr.value - current) < Math.abs(prev.value - current)
                  ? curr
                  : prev
              );

              return (
                <div
                  key={`${a.id}-${b.id}`}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                        A : {a.name}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        vs
                      </span>
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                        B : {b.name}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {closestOption.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9">
                    {SAATY_SCALE_OPTIONS.map((opt) => {
                      const active = Math.abs(opt.value - current) < 0.001;
                      return (
                        <button
                          key={opt.shortLabel}
                          type="button"
                          onClick={() => onChangePairwise(a.id, b.id, opt.value)}
                          className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 ${
                            active
                              ? 'border-blue-700 bg-blue-900 text-white dark:border-blue-400 dark:bg-blue-600 dark:text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {opt.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Résultat du calcul matriciel (Vecteur propre)
                </h3>
                <p className="mt-0.5 font-mono text-xs text-slate-600 dark:text-slate-300">
                  λmax = {pairwiseAnalysis.lambdaMax.toFixed(3)} · CI ={' '}
                  {pairwiseAnalysis.ci.toFixed(3)} · RI = {pairwiseAnalysis.ri} ·
                  CR = {(pairwiseAnalysis.cr * 100).toFixed(1)} %
                </p>
              </div>
              <Badge variant={pairwiseAnalysis.isConsistent ? 'emerald' : 'amber'}>
                {pairwiseAnalysis.isConsistent ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Cohérent (CR ≤ 10%)
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    Incohérence détectée (CR &gt; 10%)
                  </>
                )}
              </Badge>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {criteria.map((c, idx) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {c.name}
                  </span>
                  <span className="ml-2 font-mono text-xs font-bold text-blue-800 dark:text-blue-300">
                    {(pairwiseAnalysis.weightsPercent[idx] ?? 0).toFixed(1)} %
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Annuler
          </button>
          <button
            id="apply-saaty-weights-btn"
            type="button"
            onClick={() => {
              onApplyWeights();
              onClose();
            }}
            className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Appliquer ces pondérations AHP
          </button>
        </div>
      </div>
    </div>
  );
}
