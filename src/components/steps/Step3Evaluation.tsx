import { ArrowLeft, ArrowRight, Award, BarChart3, Trophy } from 'lucide-react';
import type {
  Criterion,
  EvaluationSummary,
  ScoreScale,
  ScoresMap,
  Solution,
} from '../../domain/types';
import { Badge } from '../ui/Badge';

interface Step3EvaluationProps {
  criteria: Criterion[];
  solutions: Solution[];
  scores: ScoresMap;
  scale: ScoreScale;
  evaluation: EvaluationSummary;
  onChangeScale: (scale: ScoreScale) => void;
  onSetScore: (solutionId: string, criterionId: string, value: number) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const CONTRIBUTION_COLORS = [
  'bg-blue-700 dark:bg-blue-500',
  'bg-sky-600 dark:bg-sky-400',
  'bg-slate-600 dark:bg-slate-400',
  'bg-teal-600 dark:bg-teal-400',
  'bg-indigo-700 dark:bg-indigo-400',
];

export function Step3Evaluation({
  criteria,
  solutions,
  scores,
  scale,
  evaluation,
  onChangeScale,
  onSetScore,
  onPrevStep,
  onNextStep,
}: Step3EvaluationProps) {
  const evalBySolId = new Map(
    evaluation.evaluations.map((ev) => [ev.solution.id, ev])
  );

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Étape 3 — Matrice d’évaluation AHP &amp; Scoring temps réel
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Notez chaque solution sur chaque critère (0 à {scale}). Le score pondéré et le vainqueur sont calculés instantanément.
            </p>
          </div>

          <div
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800"
            role="group"
            aria-label="Barème de notation"
          >
            <span className="px-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              Barème :
            </span>
            <button
              id="scale-5-btn"
              type="button"
              onClick={() => onChangeScale(5)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                scale === 5
                  ? 'bg-blue-900 text-white shadow-2xs dark:bg-blue-600'
                  : 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Sur 5
            </button>
            <button
              id="scale-10-btn"
              type="button"
              onClick={() => onChangeScale(10)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                scale === 10
                  ? 'bg-blue-900 text-white shadow-2xs dark:bg-blue-600'
                  : 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Sur 10
            </button>
          </div>
        </div>

        {/* Tableau Matrice AHP */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table
            id="ahp-evaluation-table"
            className="w-full min-w-[680px] border-collapse text-left text-sm"
          >
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                <th
                  scope="col"
                  className="sticky left-0 z-10 min-w-[220px] border-r border-slate-200 bg-slate-100 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Critère &amp; Pondération
                </th>
                {solutions.map((sol) => {
                  const solEval = evalBySolId.get(sol.id);
                  const isWinner = Boolean(solEval?.isWinner);
                  return (
                    <th
                      key={sol.id}
                      scope="col"
                      className={`min-w-[170px] border-r border-slate-200 px-4 py-3.5 last:border-r-0 dark:border-slate-700 ${
                        isWinner
                          ? 'bg-emerald-100/90 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-100'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold leading-tight">
                            {sol.name}
                          </span>
                          {isWinner && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-bold text-white dark:bg-emerald-500 dark:text-slate-950">
                              <Trophy className="h-3 w-3" aria-hidden="true" />
                              {solEval?.isTiedWinner ? 'Ex æquo' : 'Vainqueur'}
                            </span>
                          )}
                        </div>
                        {sol.vendor && (
                          <span
                            className={`text-xs font-medium ${
                              isWinner
                                ? 'text-emerald-900 dark:text-emerald-200'
                                : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {sol.vendor}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {criteria.map((criterion) => (
                <tr
                  key={criterion.id}
                  className="bg-white transition hover:bg-slate-50/80 dark:bg-slate-900 dark:hover:bg-slate-800/50"
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-slate-200 bg-white px-4 py-3.5 align-middle dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {criterion.name}
                        </p>
                        {criterion.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs font-normal text-slate-600 dark:text-slate-300">
                            {criterion.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="blue" className="shrink-0 font-mono">
                        {criterion.weight.toFixed(1)}%
                      </Badge>
                    </div>
                  </th>

                  {solutions.map((sol) => {
                    const solEval = evalBySolId.get(sol.id);
                    const isWinner = Boolean(solEval?.isWinner);
                    const rawScore = scores[sol.id]?.[criterion.id] ?? 0;
                    const contrib = solEval?.contributions.find(
                      (c) => c.criterionId === criterion.id
                    );

                    return (
                      <td
                        key={`${sol.id}-${criterion.id}`}
                        className={`border-r border-slate-200 px-4 py-3.5 align-middle last:border-r-0 dark:border-slate-700 ${
                          isWinner
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/35'
                            : ''
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="relative flex items-center gap-2">
                            <label
                              htmlFor={`score-${sol.id}-${criterion.id}`}
                              className="sr-only"
                            >
                              Note {sol.name} sur {criterion.name}
                            </label>
                            <input
                              id={`score-${sol.id}-${criterion.id}`}
                              type="number"
                              min={0}
                              max={scale}
                              step={0.5}
                              value={rawScore}
                              onChange={(e) =>
                                onSetScore(
                                  sol.id,
                                  criterion.id,
                                  Number(e.target.value)
                                )
                              }
                              className={`w-20 rounded-lg border px-2.5 py-1.5 text-center font-mono text-sm font-bold focus:outline-none focus:ring-2 ${
                                isWinner
                                  ? 'border-emerald-400 bg-white text-emerald-950 focus:border-emerald-600 focus:ring-emerald-600/25 dark:border-emerald-600 dark:bg-slate-900 dark:text-emerald-100 dark:focus:border-emerald-400'
                                  : 'border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-blue-600/25 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400'
                              }`}
                            />
                            <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                              / {scale}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-300">
                              Pondéré :
                            </span>
                            <span
                              className={`font-mono font-semibold ${
                                isWinner
                                  ? 'text-emerald-800 dark:text-emerald-300'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              +{(contrib?.weightedPoints ?? 0).toFixed(1)} pts
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800/90">
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-r border-slate-300 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  Score Pondéré Total
                </th>
                {solutions.map((sol) => {
                  const solEval = evalBySolId.get(sol.id);
                  const isWinner = Boolean(solEval?.isWinner);
                  return (
                    <td
                      key={`total-${sol.id}`}
                      className={`border-r border-slate-300 px-4 py-4 last:border-r-0 dark:border-slate-600 ${
                        isWinner
                          ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/90 dark:text-emerald-100'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-xl font-extrabold">
                          {(solEval?.totalScore100 ?? 0).toFixed(1)}
                          <span className="text-xs font-semibold opacity-80">
                            {' '}
                            / 100
                          </span>
                        </span>
                        <Badge variant={isWinner ? 'emerald' : 'slate'}>
                          Rang #{solEval?.rank ?? '-'}
                        </Badge>
                      </div>
                      <p
                        className={`mt-1 font-mono text-xs font-semibold ${
                          isWinner
                            ? 'text-emerald-900 dark:text-emerald-200'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Équivalent : {(solEval?.totalScoreOnScale ?? 0).toFixed(2)}{' '}
                        / {scale}
                      </p>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Synthèse visuelle de contribution */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart3
                className="h-4 w-4 text-blue-800 dark:text-blue-400"
                aria-hidden="true"
              />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Décomposition du score pondéré par critère
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {criteria.map((c, idx) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-xs ${
                      CONTRIBUTION_COLORS[idx % CONTRIBUTION_COLORS.length]
                    }`}
                  />
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {evaluation.evaluations.map((ev) => (
              <div key={ev.solution.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                    <span>
                      #{ev.rank} — {ev.solution.name}
                    </span>
                    {ev.isWinner && (
                      <Award
                        className="h-4 w-4 text-emerald-700 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {ev.totalScore100.toFixed(1)} / 100
                  </span>
                </div>
                <div className="flex h-4 w-full overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800">
                  {ev.contributions.map((contrib, idx) => (
                    <div
                      key={contrib.criterionId}
                      style={{
                        width: `${Math.max(0, Math.min(100, contrib.weightedPoints))}%`,
                      }}
                      title={`${contrib.criterionName} : +${contrib.weightedPoints.toFixed(1)} pts`}
                      className={`${
                        CONTRIBUTION_COLORS[idx % CONTRIBUTION_COLORS.length]
                      } border-r border-white/30 last:border-r-0 dark:border-slate-950/50`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
          <button
            id="step3-prev-btn"
            type="button"
            onClick={onPrevStep}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour aux solutions
          </button>

          <button
            id="step3-next-btn"
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <span>Étape 4 : Générer l’ADR</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
