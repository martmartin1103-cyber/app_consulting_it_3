import { useState } from 'react';
import {
  ArrowRight,
  Equal,
  Grid2x2Check,
  Plus,
  Scale,
  Trash2,
} from 'lucide-react';
import { MAX_CRITERIA, MIN_CRITERIA } from '../../domain/ahp';
import type { AhpPairwiseResult, Criterion, PairwiseMap } from '../../domain/types';
import { Badge } from '../ui/Badge';
import { PairwiseMatrixModal } from './PairwiseMatrixModal';

const SEGMENT_COLORS = [
  'bg-blue-800 dark:bg-blue-500',
  'bg-sky-600 dark:bg-sky-400',
  'bg-slate-600 dark:bg-slate-400',
  'bg-teal-600 dark:bg-teal-400',
  'bg-indigo-700 dark:bg-indigo-400',
];

interface Step1CriteriaProps {
  criteria: Criterion[];
  autoBalanceWeights: boolean;
  totalWeightPercent: number;
  isWeightValid: boolean;
  pairwise: PairwiseMap;
  pairwiseAnalysis: AhpPairwiseResult;
  onToggleAutoBalance: (val: boolean) => void;
  onAddCriterion: (name?: string) => void;
  onUpdateCriterion: (
    id: string,
    patch: Partial<Pick<Criterion, 'name' | 'description'>>
  ) => void;
  onUpdateWeight: (id: string, weight: number) => void;
  onNormalizeWeights: () => void;
  onEqualizeWeights: () => void;
  onRemoveCriterion: (id: string) => void;
  onChangePairwise: (idA: string, idB: string, value: number) => void;
  onApplyPairwiseWeights: () => void;
  onNextStep: () => void;
}

export function Step1Criteria({
  criteria,
  autoBalanceWeights,
  totalWeightPercent,
  isWeightValid,
  pairwise,
  pairwiseAnalysis,
  onToggleAutoBalance,
  onAddCriterion,
  onUpdateCriterion,
  onUpdateWeight,
  onNormalizeWeights,
  onEqualizeWeights,
  onRemoveCriterion,
  onChangePairwise,
  onApplyPairwiseWeights,
  onNextStep,
}: Step1CriteriaProps) {
  const [saatyOpen, setSaatyOpen] = useState(false);

  const canAdd = criteria.length < MAX_CRITERIA;
  const canRemove = criteria.length > MIN_CRITERIA;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Étape 1 — Critères de décision &amp; Pondérations
              </h2>
              <Badge variant="blue">
                {criteria.length} / {MAX_CRITERIA} critères
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Définissez entre 3 et 5 critères structurants et ajustez leurs poids pour totaliser exactement 100 %.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="open-saaty-modal-btn"
              type="button"
              onClick={() => setSaatyOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-900 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-blue-700 dark:bg-blue-950/70 dark:text-blue-200 dark:hover:bg-blue-900/80"
            >
              <Grid2x2Check className="h-4 w-4" aria-hidden="true" />
              Matrice par paires AHP (Saaty)
            </button>

            <button
              id="add-criterion-btn"
              type="button"
              disabled={!canAdd}
              onClick={() => onAddCriterion()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter un critère
            </button>
          </div>
        </div>

        {/* Barre de répartition visuelle + contrôles de somme 100% */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Somme des pondérations :
              </span>
              <span
                className={`font-mono text-base font-bold ${
                  isWeightValid
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-amber-700 dark:text-amber-300'
                }`}
              >
                {totalWeightPercent.toFixed(1)} %
              </span>
              <Badge variant={isWeightValid ? 'emerald' : 'amber'}>
                {isWeightValid ? 'Équilibré à 100 %' : 'Doit totaliser 100 %'}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <input
                  id="autobalance-toggle"
                  type="checkbox"
                  checked={autoBalanceWeights}
                  onChange={(e) => onToggleAutoBalance(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                />
                Verrouiller à 100 %
              </label>

              <button
                id="equalize-weights-btn"
                type="button"
                onClick={onEqualizeWeights}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Equal className="h-3.5 w-3.5" aria-hidden="true" />
                Égaliser
              </button>

              {!isWeightValid && (
                <button
                  id="normalize-weights-btn"
                  type="button"
                  onClick={onNormalizeWeights}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500"
                >
                  <Scale className="h-3.5 w-3.5" aria-hidden="true" />
                  Normaliser à 100 %
                </button>
              )}
            </div>
          </div>

          <div
            className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
            role="img"
            aria-label="Répartition visuelle des poids entre critères"
          >
            {criteria.map((c, idx) => (
              <div
                key={c.id}
                style={{
                  width: `${Math.max(0, Math.min(100, c.weight))}%`,
                }}
                title={`${c.name} : ${c.weight.toFixed(1)} %`}
                className={`${SEGMENT_COLORS[idx % SEGMENT_COLORS.length]} transition-all duration-200`}
              />
            ))}
          </div>
        </div>

        {/* Liste des critères */}
        <div className="mt-5 space-y-3">
          {criteria.map((criterion, idx) => (
            <div
              key={criterion.id}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
                <div className="space-y-2 lg:col-span-6">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full ${
                        SEGMENT_COLORS[idx % SEGMENT_COLORS.length]
                      }`}
                    />
                    <label
                      htmlFor={`crit-name-${criterion.id}`}
                      className="sr-only"
                    >
                      Nom du critère {idx + 1}
                    </label>
                    <input
                      id={`crit-name-${criterion.id}`}
                      type="text"
                      value={criterion.name}
                      onChange={(e) =>
                        onUpdateCriterion(criterion.id, {
                          name: e.target.value,
                        })
                      }
                      placeholder="Nom du critère (ex: Coût, Sécurité...)"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400"
                    />
                  </div>
                  <label
                    htmlFor={`crit-desc-${criterion.id}`}
                    className="sr-only"
                  >
                    Description du critère {idx + 1}
                  </label>
                  <input
                    id={`crit-desc-${criterion.id}`}
                    type="text"
                    value={criterion.description}
                    onChange={(e) =>
                      onUpdateCriterion(criterion.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Précision méthodologique (ex: TCO 3 ans, conformité SecNumCloud...)"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:focus:border-blue-400"
                  />
                </div>

                <div className="flex items-center gap-3 lg:col-span-5">
                  <div className="flex-1">
                    <label
                      htmlFor={`crit-slider-${criterion.id}`}
                      className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      <span>Pondération</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {criterion.weight.toFixed(1)} %
                      </span>
                    </label>
                    <input
                      id={`crit-slider-${criterion.id}`}
                      type="range"
                      min={0}
                      max={100}
                      step={0.5}
                      value={criterion.weight}
                      onChange={(e) =>
                        onUpdateWeight(criterion.id, Number(e.target.value))
                      }
                      className="consulting-slider w-full"
                    />
                  </div>

                  <div className="w-24 shrink-0">
                    <label
                      htmlFor={`crit-input-${criterion.id}`}
                      className="sr-only"
                    >
                      Pourcentage {criterion.name}
                    </label>
                    <div className="relative">
                      <input
                        id={`crit-input-${criterion.id}`}
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={criterion.weight}
                        onChange={(e) =>
                          onUpdateWeight(criterion.id, Number(e.target.value))
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pr-6 pl-2.5 text-right font-mono text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400"
                      />
                      <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end lg:col-span-1">
                  <button
                    id={`remove-criterion-${criterion.id}`}
                    type="button"
                    disabled={!canRemove}
                    onClick={() => onRemoveCriterion(criterion.id)}
                    aria-label={`Supprimer le critère ${criterion.name}`}
                    title={
                      canRemove
                        ? 'Supprimer ce critère'
                        : `Minimum ${MIN_CRITERIA} critères requis`
                    }
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:border-rose-700 dark:hover:bg-rose-950/60 dark:hover:text-rose-300"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Contrainte AHP : minimum {MIN_CRITERIA}, maximum {MAX_CRITERIA} critères.
          </p>
          <button
            id="step1-next-btn"
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <span>Étape suivante : Solutions</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <PairwiseMatrixModal
        isOpen={saatyOpen}
        onClose={() => setSaatyOpen(false)}
        criteria={criteria}
        pairwise={pairwise}
        pairwiseAnalysis={pairwiseAnalysis}
        onChangePairwise={onChangePairwise}
        onApplyWeights={onApplyPairwiseWeights}
      />
    </section>
  );
}
