import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Eye,
  FileCode2,
  Sparkles,
} from 'lucide-react';
import { generateAdrMarkdown } from '../../domain/adr';
import type {
  AdrMetadata,
  AdrStatus,
  EvaluationSummary,
  RadarState,
} from '../../domain/types';
import { Badge } from '../ui/Badge';

const ADR_STATUSES: AdrStatus[] = [
  'Proposé',
  'Accepté',
  'En revue',
  'Déprécié',
  'Remplacé',
];

interface Step4AdrExportProps {
  state: RadarState;
  evaluation: EvaluationSummary;
  onUpdateAdr: (patch: Partial<AdrMetadata>) => void;
  onPrevStep: () => void;
}

export function Step4AdrExport({
  state,
  evaluation,
  onUpdateAdr,
  onPrevStep,
}: Step4AdrExportProps) {
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>(() =>
    generateAdrMarkdown(state)
  );
  const [viewMode, setViewMode] = useState<'structured' | 'markdown'>(
    'structured'
  );
  const [copied, setCopied] = useState(false);
  const [generatedStamp, setGeneratedStamp] = useState<string | null>(null);

  const handleGenerateAdr = () => {
    const compiled = generateAdrMarkdown(state);
    setGeneratedMarkdown(compiled);
    setGeneratedStamp(new Date().toLocaleTimeString('fr-FR'));
  };

  const handleCopy = async () => {
    const content = generatedMarkdown || generateAdrMarkdown(state);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencieux si clipboard bloqué
    }
  };

  const handleDownload = () => {
    const content = generatedMarkdown || generateAdrMarkdown(state);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeId = (state.adr.adrId || 'ADR-001')
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-');
    link.href = url;
    link.download = `${safeId}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Formulaire Contexte & Contraintes ADR */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs xl:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Étape 4 — Paramètres ADR (Michael Nygard)
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Complétez le contexte et les conséquences avant de compiler l’ADR final.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="adr-id-input"
                className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Identifiant ADR
              </label>
              <input
                id="adr-id-input"
                type="text"
                value={state.adr.adrId}
                onChange={(e) => onUpdateAdr({ adrId: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="adr-status-select"
                className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Statut
              </label>
              <select
                id="adr-status-select"
                value={state.adr.status}
                onChange={(e) =>
                  onUpdateAdr({ status: e.target.value as AdrStatus })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {ADR_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="adr-title-input"
              className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Titre de la décision
            </label>
            <input
              id="adr-title-input"
              type="text"
              value={state.adr.title}
              onChange={(e) => onUpdateAdr({ title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="adr-author-input"
                className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Auteur / Practice
              </label>
              <input
                id="adr-author-input"
                type="text"
                value={state.adr.author}
                onChange={(e) => onUpdateAdr({ author: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="adr-date-input"
                className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Date
              </label>
              <input
                id="adr-date-input"
                type="date"
                value={state.adr.date}
                onChange={(e) => onUpdateAdr({ date: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="adr-context-input"
              className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Contexte métier &amp; technique
            </label>
            <textarea
              id="adr-context-input"
              rows={3}
              value={state.adr.context}
              onChange={(e) => onUpdateAdr({ context: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="adr-constraints-input"
              className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Contraintes structurantes
            </label>
            <textarea
              id="adr-constraints-input"
              rows={3}
              value={state.adr.constraints}
              onChange={(e) => onUpdateAdr({ constraints: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="adr-pos-input"
              className="mb-1 block text-xs font-semibold text-emerald-800 dark:text-emerald-300"
            >
              Conséquences positives
            </label>
            <textarea
              id="adr-pos-input"
              rows={2}
              value={state.adr.consequencesPositive}
              onChange={(e) =>
                onUpdateAdr({ consequencesPositive: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="adr-neg-input"
              className="mb-1 block text-xs font-semibold text-amber-800 dark:text-amber-300"
            >
              Compromis &amp; risques (négatifs)
            </label>
            <textarea
              id="adr-neg-input"
              rows={2}
              value={state.adr.consequencesNegative}
              onChange={(e) =>
                onUpdateAdr({ consequencesNegative: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="adr-mitigation-input"
              className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Plan de mitigation
            </label>
            <textarea
              id="adr-mitigation-input"
              rows={2}
              value={state.adr.mitigationPlan}
              onChange={(e) => onUpdateAdr({ mitigationPlan: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              id="step4-prev-btn"
              type="button"
              onClick={onPrevStep}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Matrice AHP
            </button>

            <button
              id="btn-generate-adr"
              type="button"
              onClick={handleGenerateAdr}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Générer ADR
            </button>
          </div>
        </div>

        {/* Aperçu & Export Markdown */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xs xl:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
                <button
                  id="adr-view-structured-btn"
                  type="button"
                  onClick={() => setViewMode('structured')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
                    viewMode === 'structured'
                      ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  Vue Structurée
                </button>
                <button
                  id="adr-view-markdown-btn"
                  type="button"
                  onClick={() => setViewMode('markdown')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
                    viewMode === 'markdown'
                      ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Source Markdown
                </button>
              </div>
              {generatedStamp && (
                <Badge variant="emerald">Compilé à {generatedStamp}</Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                id="copy-adr-btn"
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {copied ? (
                  <>
                    <Check
                      className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copier .md
                  </>
                )}
              </button>

              <button
                id="download-adr-btn"
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Exporter .md
              </button>
            </div>
          </div>

          <div className="flex-1 p-6">
            {viewMode === 'markdown' ? (
              <pre
                id="adr-markdown-source"
                className="max-h-[680px] overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-100 dark:border-slate-700"
              >
                {generatedMarkdown}
              </pre>
            ) : (
              <article
                id="adr-structured-preview"
                className="space-y-5 text-sm text-slate-800 dark:text-slate-200"
              >
                <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="blue">{state.adr.adrId}</Badge>
                    <Badge
                      variant={
                        state.adr.status === 'Accepté'
                          ? 'emerald'
                          : state.adr.status === 'Déprécié' ||
                              state.adr.status === 'Remplacé'
                            ? 'rose'
                            : 'amber'
                      }
                    >
                      Statut : {state.adr.status}
                    </Badge>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {state.adr.date} · {state.adr.author}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50">
                    {state.adr.title}
                  </h3>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                    1. Contexte &amp; Contraintes
                  </h4>
                  <p className="mt-1.5 whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                    {state.adr.context}
                  </p>
                  <p className="mt-2 whitespace-pre-line rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    {state.adr.constraints}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                    2. Options envisagées (Principe de charité)
                  </h4>
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {evaluation.evaluations.map((ev) => (
                      <div
                        key={ev.solution.id}
                        className={`rounded-xl border p-3.5 ${
                          ev.isWinner
                            ? 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-700 dark:bg-emerald-950/40'
                            : 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            #{ev.rank} {ev.solution.name}
                          </span>
                          <Badge variant={ev.isWinner ? 'emerald' : 'slate'}>
                            {ev.totalScore100.toFixed(1)}/100
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                          <strong className="text-emerald-800 dark:text-emerald-300">
                            Forces :
                          </strong>{' '}
                          {ev.solution.strengths || 'N/A'}
                        </p>
                        <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                          <strong className="text-amber-800 dark:text-amber-300">
                            Limites :
                          </strong>{' '}
                          {ev.solution.weaknesses || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                    3. Décision retenue &amp; Justification
                  </h4>
                  {evaluation.winner ? (
                    <div className="mt-1.5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-100">
                      <p className="font-semibold">
                        Solution retenue : {evaluation.winner.solution.name} (
                        {evaluation.winner.totalScore100.toFixed(1)} / 100)
                      </p>
                      {evaluation.runnerUp && (
                        <p className="mt-1 text-xs text-emerald-900 dark:text-emerald-200">
                          Avance de +{evaluation.leadMargin100.toFixed(1)} pts
                          sur {evaluation.runnerUp.solution.name}.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      Complétez la matrice d’évaluation à l’étape 3.
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                    4. Conséquences &amp; Mitigation
                  </h4>
                  <div className="mt-1.5 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                        Bénéfices attendus
                      </p>
                      <p className="mt-1 whitespace-pre-line text-slate-700 dark:text-slate-300">
                        {state.adr.consequencesPositive}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                      <p className="font-semibold text-amber-800 dark:text-amber-300">
                        Risques &amp; Mitigation
                      </p>
                      <p className="mt-1 whitespace-pre-line text-slate-700 dark:text-slate-300">
                        {state.adr.consequencesNegative}
                        {'\n'}
                        {state.adr.mitigationPlan}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
