export type ScoreScale = 5 | 10;

export type AdrStatus =
  | 'Proposé'
  | 'Accepté'
  | 'En revue'
  | 'Déprécié'
  | 'Remplacé';

export type RadarStep = 1 | 2 | 3 | 4;

export interface Criterion {
  id: string;
  name: string;
  description: string;
  /** Poids relatif en pourcentage (0 à 100, somme attendue = 100) */
  weight: number;
}

export interface Solution {
  id: string;
  name: string;
  vendor: string;
  summary: string;
  /** Forces objectives (principe de charité pour l'ADR) */
  strengths: string;
  /** Limites ou risques identifiés (principe de charité pour l'ADR) */
  weaknesses: string;
}

/** Matrice des notes brutes : scores[solutionId][criterionId] */
export type ScoresMap = Record<string, Record<string, number>>;

/**
 * Comparaisons par paires de Saaty pour la paire ordonnée `${idA}::${idB}`.
 * Une valeur > 1 signifie que A est plus important que B.
 * Une valeur < 1 (ex: 1/3) signifie que B est plus important que A.
 */
export type PairwiseMap = Record<string, number>;

export interface AdrMetadata {
  adrId: string;
  title: string;
  status: AdrStatus;
  date: string;
  author: string;
  context: string;
  constraints: string;
  consequencesPositive: string;
  consequencesNegative: string;
  mitigationPlan: string;
}

export interface RadarState {
  activeStep: RadarStep;
  projectTitle: string;
  scale: ScoreScale;
  autoBalanceWeights: boolean;
  criteria: Criterion[];
  solutions: Solution[];
  scores: ScoresMap;
  pairwise: PairwiseMap;
  adr: AdrMetadata;
}

export interface AhpPairwiseResult {
  weightsPercent: number[];
  lambdaMax: number;
  ci: number;
  ri: number;
  cr: number;
  isConsistent: boolean;
}

export interface CriterionContribution {
  criterionId: string;
  criterionName: string;
  weightPercent: number;
  rawScore: number;
  /** Contribution pondérée sur 100 points */
  weightedPoints: number;
}

export interface SolutionEvaluation {
  solution: Solution;
  rank: number;
  /** Score total pondéré sur 100 */
  totalScore100: number;
  /** Score total pondéré ramené sur l'échelle active (5 ou 10) */
  totalScoreOnScale: number;
  isWinner: boolean;
  isTiedWinner: boolean;
  contributions: CriterionContribution[];
}

export interface EvaluationSummary {
  evaluations: SolutionEvaluation[];
  winner: SolutionEvaluation | null;
  runnerUp: SolutionEvaluation | null;
  leadMargin100: number;
  totalWeightPercent: number;
  isWeightValid: boolean;
}
