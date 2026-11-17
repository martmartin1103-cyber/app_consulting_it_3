import { ArrowLeft, ArrowRight, Building2, Plus, Trash2 } from 'lucide-react';
import { MAX_SOLUTIONS, MIN_SOLUTIONS } from '../../domain/ahp';
import type { Solution } from '../../domain/types';
import { Badge } from '../ui/Badge';

interface Step2SolutionsProps {
  solutions: Solution[];
  onAddSolution: (name?: string) => void;
  onUpdateSolution: (
    id: string,
    patch: Partial<Omit<Solution, 'id'>>
  ) => void;
  onRemoveSolution: (id: string) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export function Step2Solutions({
  solutions,
  onAddSolution,
  onUpdateSolution,
  onRemoveSolution,
  onPrevStep,
  onNextStep,
}: Step2SolutionsProps) {
  const canAdd = solutions.length < MAX_SOLUTIONS;
  const canRemove = solutions.length > MIN_SOLUTIONS;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Étape 2 — Solutions concurrentes
            </h2>
            <Badge variant="blue">
              {solutions.length} / {MAX_SOLUTIONS} solutions
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Ajoutez de 2 à 4 solutions (éditeurs, cloud providers, frameworks). Renseignez leurs forces et limites selon le principe de charité pour l’ADR.
          </p>
        </div>

        <button
          id="add-solution-btn"
          type="button"
          disabled={!canAdd}
          onClick={() => onAddSolution()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter une solution
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {solutions.map((solution, idx) => (
          <article
            key={solution.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/50"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-900 text-xs font-bold text-white dark:bg-blue-700">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Option candidate
                  </span>
                </div>

                <button
                  id={`remove-solution-${solution.id}`}
                  type="button"
                  disabled={!canRemove}
                  onClick={() => onRemoveSolution(solution.id)}
                  aria-label={`Supprimer ${solution.name}`}
                  title={
                    canRemove
                      ? 'Supprimer cette solution'
                      : `Minimum ${MIN_SOLUTIONS} solutions requises`
                  }
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-rose-700 dark:hover:bg-rose-950/60 dark:hover:text-rose-300"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`sol-name-${solution.id}`}
                    className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Nom de la solution
                  </label>
                  <input
                    id={`sol-name-${solution.id}`}
                    type="text"
                    value={solution.name}
                    onChange={(e) =>
                      onUpdateSolution(solution.id, { name: e.target.value })
                    }
                    placeholder="Ex : AWS, Azure, SAP S/4HANA..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`sol-vendor-${solution.id}`}
                    className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Éditeur / Fournisseur
                  </label>
                  <input
                    id={`sol-vendor-${solution.id}`}
                    type="text"
                    value={solution.vendor}
                    onChange={(e) =>
                      onUpdateSolution(solution.id, { vendor: e.target.value })
                    }
                    placeholder="Ex : Microsoft, Amazon, SAP..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`sol-summary-${solution.id}`}
                  className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Positionnement synthétique
                </label>
                <input
                  id={`sol-summary-${solution.id}`}
                  type="text"
                  value={solution.summary}
                  onChange={(e) =>
                    onUpdateSolution(solution.id, { summary: e.target.value })
                  }
                  placeholder="Résumé neutre du positionnement de la solution..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`sol-strengths-${solution.id}`}
                    className="mb-1 block text-xs font-semibold text-emerald-800 dark:text-emerald-300"
                  >
                    Forces objectives (charité ADR)
                  </label>
                  <textarea
                    id={`sol-strengths-${solution.id}`}
                    rows={2}
                    value={solution.strengths}
                    onChange={(e) =>
                      onUpdateSolution(solution.id, {
                        strengths: e.target.value,
                      })
                    }
                    placeholder="Atouts majeurs de cette option..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`sol-weaknesses-${solution.id}`}
                    className="mb-1 block text-xs font-semibold text-amber-800 dark:text-amber-300"
                  >
                    Limites &amp; points d’attention
                  </label>
                  <textarea
                    id={`sol-weaknesses-${solution.id}`}
                    rows={2}
                    value={solution.weaknesses}
                    onChange={(e) =>
                      onUpdateSolution(solution.id, {
                        weaknesses: e.target.value,
                      })
                    }
                    placeholder="Risques, coûts cachés ou limites..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
        <button
          id="step2-prev-btn"
          type="button"
          onClick={onPrevStep}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour aux critères
        </button>

        <button
          id="step2-next-btn"
          type="button"
          onClick={onNextStep}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          <span>Étape suivante : Matrice d’évaluation</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
