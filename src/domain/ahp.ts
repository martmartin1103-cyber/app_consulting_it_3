import type {
  AhpPairwiseResult,
  Criterion,
  CriterionContribution,
  EvaluationSummary,
  PairwiseMap,
  ScoreScale,
  ScoresMap,
  Solution,
  SolutionEvaluation,
} from './types';

export const MIN_CRITERIA = 3;
export const MAX_CRITERIA = 5;
export const MIN_SOLUTIONS = 2;
export const MAX_SOLUTIONS = 4;

/**
 * Table des Indices Aléatoires (Random Index) de Thomas Saaty
 * en fonction du nombre de critères n.
 */
export const SAATY_RI_TABLE: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

export interface SaatyScaleOption {
  value: number;
  label: string;
  shortLabel: string;
}

export const SAATY_SCALE_OPTIONS: SaatyScaleOption[] = [
  { value: 9, label: '9 — Importance extrême (A ≫ B)', shortLabel: '9 (A)' },
  { value: 7, label: '7 — Importance très forte (A)', shortLabel: '7 (A)' },
  { value: 5, label: '5 — Importance forte (A)', shortLabel: '5 (A)' },
  { value: 3, label: '3 — Importance modérée (A)', shortLabel: '3 (A)' },
  { value: 1, label: '1 — Importance égale (A = B)', shortLabel: '1 (=)' },
  { value: 1 / 3, label: '1/3 — Importance modérée (B)', shortLabel: '3 (B)' },
  { value: 1 / 5, label: '1/5 — Importance forte (B)', shortLabel: '5 (B)' },
  { value: 1 / 7, label: '1/7 — Importance très forte (B)', shortLabel: '7 (B)' },
  { value: 1 / 9, label: '1/9 — Importance extrême (B ≫ A)', shortLabel: '9 (B)' },
];

export function pairwiseKey(idA: string, idB: string): string {
  return `${idA}::${idB}`;
}

export function getPairwiseValue(
  pairwise: PairwiseMap,
  idA: string,
  idB: string
): number {
  if (idA === idB) return 1;
  const direct = pairwise[pairwiseKey(idA, idB)];
  if (typeof direct === 'number' && direct > 0) return direct;
  const reverse = pairwise[pairwiseKey(idB, idA)];
  if (typeof reverse === 'number' && reverse > 0) return 1 / reverse;
  return 1;
}

/**
 * Normalise un vecteur de poids positifs pour que sa somme exacte vaille 100
 * (arrondi au dixième via la méthode des plus forts restes).
 */
export function normalizeWeightsTo100(weights: number[]): number[] {
  if (weights.length === 0) return [];
  const sanitized = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0));
  const sum = sanitized.reduce((acc, val) => acc + val, 0);

  if (sum <= 0) {
    const baseTenths = Math.floor(1000 / weights.length);
    const remainder = 1000 - baseTenths * weights.length;
    return weights.map((_, idx) => (baseTenths + (idx < remainder ? 1 : 0)) / 10);
  }

  const rawTenths = sanitized.map((w) => (w / sum) * 1000);
  const floored = rawTenths.map((v) => Math.floor(v));
  let missing = 1000 - floored.reduce((acc, v) => acc + v, 0);

  const remainders = rawTenths
    .map((v, idx) => ({ idx, rem: v - floored[idx] }))
    .sort((a, b) => b.rem - a.rem);

  for (let i = 0; i < missing; i++) {
    floored[remainders[i % remainders.length].idx] += 1;
  }

  return floored.map((t) => Math.round(t) / 10);
}

/**
 * Ajuste le poids d'un critère cible et rééquilibre proportionnellement
 * les autres critères afin de maintenir un total exact de 100%.
 */
export function rebalanceCriteriaWeights(
  criteria: Criterion[],
  targetId: string,
  nextWeight: number
): Criterion[] {
  if (criteria.length <= 1) {
    return criteria.map((c) => ({ ...c, weight: 100 }));
  }

  const clamped = Math.max(0, Math.min(100, Math.round(nextWeight * 10) / 10));
  const remaining = Math.round((100 - clamped) * 10) / 10;
  const others = criteria.filter((c) => c.id !== targetId);
  const othersSum = others.reduce((acc, c) => acc + Math.max(0, c.weight), 0);

  const rawOtherWeights =
    othersSum > 0
      ? others.map((c) => (Math.max(0, c.weight) / othersSum) * remaining)
      : others.map(() => remaining / others.length);

  // Répartition en dixièmes sur `remaining`
  const targetTenths = Math.round(remaining * 10);
  const rawTenths = rawOtherWeights.map((w) => w * 10);
  const floored = rawTenths.map((v) => Math.floor(v));
  const missing = targetTenths - floored.reduce((acc, v) => acc + v, 0);

  const order = rawTenths
    .map((v, idx) => ({ idx, rem: v - floored[idx] }))
    .sort((a, b) => b.rem - a.rem);

  for (let i = 0; i < Math.abs(missing); i++) {
    const idx = order[i % order.length].idx;
    floored[idx] += missing > 0 ? 1 : -1;
  }

  const normalizedOthers = new Map<string, number>();
  others.forEach((c, idx) => {
    normalizedOthers.set(c.id, Math.max(0, floored[idx]) / 10);
  });

  return criteria.map((c) =>
    c.id === targetId
      ? { ...c, weight: clamped }
      : { ...c, weight: normalizedOthers.get(c.id) ?? 0 }
  );
}

/**
 * Construit la matrice réciproque de comparaison par paires A (n x n).
 */
export function buildPairwiseMatrix(
  criteriaIds: string[],
  pairwise: PairwiseMap
): number[][] {
  const n = criteriaIds.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      if (i === j) return 1;
      return getPairwiseValue(pairwise, criteriaIds[i], criteriaIds[j]);
    })
  );
}

/**
 * Calcule le vecteur propre principal (poids AHP), la valeur propre maximale (λ_max),
 * l'Indice de Cohérence (CI) et le Ratio de Cohérence (CR) selon Thomas Saaty.
 */
export function computeAhpFromPairwise(
  criteriaIds: string[],
  pairwise: PairwiseMap
): AhpPairwiseResult {
  const n = criteriaIds.length;
  if (n === 0) {
    return {
      weightsPercent: [],
      lambdaMax: 0,
      ci: 0,
      ri: 0,
      cr: 0,
      isConsistent: true,
    };
  }
  if (n === 1) {
    return {
      weightsPercent: [100],
      lambdaMax: 1,
      ci: 0,
      ri: 0,
      cr: 0,
      isConsistent: true,
    };
  }

  const matrix = buildPairwiseMatrix(criteriaIds, pairwise);

  // Méthode des puissances itérées pour obtenir le vecteur propre principal exact
  let vector = Array.from({ length: n }, () => 1 / n);
  for (let iter = 0; iter < 40; iter++) {
    const next = Array.from({ length: n }, (_, i) =>
      matrix[i].reduce((sum, cell, j) => sum + cell * vector[j], 0)
    );
    const norm = next.reduce((acc, v) => acc + v, 0);
    if (norm <= 0) break;
    const normalized = next.map((v) => v / norm);
    const maxDiff = normalized.reduce(
      (max, val, idx) => Math.max(max, Math.abs(val - vector[idx])),
      0
    );
    vector = normalized;
    if (maxDiff < 1e-10) break;
  }

  // Calcul de λ_max = moyenne de (A * w)_i / w_i
  const aw = Array.from({ length: n }, (_, i) =>
    matrix[i].reduce((sum, cell, j) => sum + cell * vector[j], 0)
  );
  const lambdaMax =
    aw.reduce((sum, val, i) => sum + (vector[i] > 0 ? val / vector[i] : n), 0) /
    n;

  const ci = n > 1 ? Math.max(0, (lambdaMax - n) / (n - 1)) : 0;
  const ri = SAATY_RI_TABLE[n] ?? 1.49;
  const cr = ri > 0 ? ci / ri : 0;

  return {
    weightsPercent: normalizeWeightsTo100(vector),
    lambdaMax: Math.round(lambdaMax * 1000) / 1000,
    ci: Math.round(ci * 1000) / 1000,
    ri,
    cr: Math.round(cr * 1000) / 1000,
    isConsistent: cr <= 0.1,
  };
}

/**
 * Calcule l'évaluation AHP complète de toutes les solutions et détermine le vainqueur.
 */
export function evaluateSolutions(
  criteria: Criterion[],
  solutions: Solution[],
  scores: ScoresMap,
  scale: ScoreScale
): EvaluationSummary {
  const totalWeightPercent =
    Math.round(criteria.reduce((acc, c) => acc + c.weight, 0) * 10) / 10;
  const isWeightValid = Math.abs(totalWeightPercent - 100) <= 0.1;

  const effectiveWeightSum = totalWeightPercent > 0 ? totalWeightPercent : 1;

  const rawEvaluations: SolutionEvaluation[] = solutions.map((solution) => {
    const solutionScores = scores[solution.id] ?? {};
    const contributions: CriterionContribution[] = criteria.map((criterion) => {
      const raw = solutionScores[criterion.id] ?? 0;
      const clampedRaw = Math.max(0, Math.min(scale, raw));
      const normalizedWeightRatio = criterion.weight / effectiveWeightSum;
      const weightedPoints =
        Math.round(normalizedWeightRatio * (clampedRaw / scale) * 100 * 10) / 10;

      return {
        criterionId: criterion.id,
        criterionName: criterion.name,
        weightPercent: criterion.weight,
        rawScore: clampedRaw,
        weightedPoints,
      };
    });

    const totalScore100 =
      Math.round(
        criteria.reduce((acc, criterion) => {
          const raw = Math.max(
            0,
            Math.min(scale, solutionScores[criterion.id] ?? 0)
          );
          return acc + (criterion.weight / effectiveWeightSum) * (raw / scale) * 100;
        }, 0) * 10
      ) / 10;

    const totalScoreOnScale =
      Math.round(((totalScore100 / 100) * scale) * 100) / 100;

    return {
      solution,
      rank: 1,
      totalScore100,
      totalScoreOnScale,
      isWinner: false,
      isTiedWinner: false,
      contributions,
    };
  });

  const sorted = [...rawEvaluations].sort(
    (a, b) => b.totalScore100 - a.totalScore100
  );

  const topScore = sorted[0]?.totalScore100 ?? 0;
  const winnersCount = sorted.filter(
    (item) => Math.abs(item.totalScore100 - topScore) < 0.05 && topScore > 0
  ).length;

  let currentRank = 1;
  const ranked = sorted.map((item, idx) => {
    if (
      idx > 0 &&
      Math.abs(item.totalScore100 - sorted[idx - 1].totalScore100) >= 0.05
    ) {
      currentRank = idx + 1;
    }
    const isTop = Math.abs(item.totalScore100 - topScore) < 0.05 && topScore > 0;
    return {
      ...item,
      rank: currentRank,
      isWinner: isTop,
      isTiedWinner: isTop && winnersCount > 1,
    };
  });

  const winner = ranked[0] && ranked[0].totalScore100 > 0 ? ranked[0] : null;
  const runnerUp = ranked[1] ?? null;
  const leadMargin100 =
    winner && runnerUp
      ? Math.round((winner.totalScore100 - runnerUp.totalScore100) * 10) / 10
      : 0;

  return {
    evaluations: ranked,
    winner,
    runnerUp,
    leadMargin100,
    totalWeightPercent,
    isWeightValid,
  };
}

/**
 * Convertit l'ensemble des notes d'une échelle (/5 <-> /10) sans perte de sens.
 */
export function rescaleScores(
  scores: ScoresMap,
  fromScale: ScoreScale,
  toScale: ScoreScale
): ScoresMap {
  if (fromScale === toScale) return scores;
  const ratio = toScale / fromScale;
  const next: ScoresMap = {};
  for (const [solId, critMap] of Object.entries(scores)) {
    next[solId] = {};
    for (const [critId, val] of Object.entries(critMap)) {
      const converted = Math.round(val * ratio * 2) / 2;
      next[solId][critId] = Math.max(0, Math.min(toScale, converted));
    }
  }
  return next;
}
