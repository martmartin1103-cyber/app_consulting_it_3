import { describe, expect, it } from 'vitest';
import {
  computeAhpFromPairwise,
  evaluateSolutions,
  normalizeWeightsTo100,
  rebalanceCriteriaWeights,
  rescaleScores,
} from './ahp';
import type { Criterion, ScoresMap, Solution } from './types';

describe('AHP Pure Logic', () => {
  it('normalise les poids pour totaliser exactement 100%', () => {
    const normalized = normalizeWeightsTo100([1, 1, 1]);
    const sum = normalized.reduce((a, b) => a + b, 0);
    expect(Math.round(sum * 10) / 10).toBe(100);
    expect(normalized).toEqual([33.4, 33.3, 33.3]);
  });

  it('rééquilibre les autres critères quand un poids change', () => {
    const criteria: Criterion[] = [
      { id: 'c1', name: 'Coût', description: '', weight: 40 },
      { id: 'c2', name: 'Sécurité', description: '', weight: 40 },
      { id: 'c3', name: 'Agilité', description: '', weight: 20 },
    ];
    const updated = rebalanceCriteriaWeights(criteria, 'c1', 60);
    const total = updated.reduce((acc, c) => acc + c.weight, 0);
    expect(Math.round(total * 10) / 10).toBe(100);
    expect(updated.find((c) => c.id === 'c1')?.weight).toBe(60);
    expect(updated.find((c) => c.id === 'c2')?.weight).toBe(26.7);
    expect(updated.find((c) => c.id === 'c3')?.weight).toBe(13.3);
  });

  it('calcule correctement le vecteur propre et un CR cohérent pour une matrice de Saaty cohérente', () => {
    const ids = ['a', 'b', 'c'];
    // A = 3*B, A = 9*C, B = 3*C => matrice parfaitement cohérente (CR ≈ 0)
    const pairwise = {
      'a::b': 3,
      'a::c': 9,
      'b::c': 3,
    };
    const result = computeAhpFromPairwise(ids, pairwise);
    expect(result.isConsistent).toBe(true);
    expect(result.cr).toBeLessThanOrEqual(0.01);
    const total = result.weightsPercent.reduce((s, w) => s + w, 0);
    expect(Math.round(total * 10) / 10).toBe(100);
    expect(result.weightsPercent[0]).toBeGreaterThan(result.weightsPercent[1]);
    expect(result.weightsPercent[1]).toBeGreaterThan(result.weightsPercent[2]);
  });

  it('détecte une matrice de comparaison incohérente (CR > 0.10)', () => {
    const ids = ['a', 'b', 'c'];
    // Cycle incohérent : A > B (9), B > C (9), C > A (9)
    const pairwise = {
      'a::b': 9,
      'b::c': 9,
      'a::c': 1 / 9,
    };
    const result = computeAhpFromPairwise(ids, pairwise);
    expect(result.isConsistent).toBe(false);
    expect(result.cr).toBeGreaterThan(0.1);
  });

  it('classe les solutions et désigne le vainqueur selon la pondération AHP', () => {
    const criteria: Criterion[] = [
      { id: 'c1', name: 'Sécurité', description: '', weight: 60 },
      { id: 'c2', name: 'Coût', description: '', weight: 40 },
    ];
    const solutions: Solution[] = [
      { id: 's1', name: 'AWS', vendor: 'Amazon', summary: '', strengths: '', weaknesses: '' },
      { id: 's2', name: 'Azure', vendor: 'Microsoft', summary: '', strengths: '', weaknesses: '' },
    ];
    const scores: ScoresMap = {
      s1: { c1: 8, c2: 6 }, // 0.6*80 + 0.4*60 = 72
      s2: { c1: 9, c2: 7 }, // 0.6*90 + 0.4*70 = 82
    };
    const summary = evaluateSolutions(criteria, solutions, scores, 10);
    expect(summary.isWeightValid).toBe(true);
    expect(summary.winner?.solution.id).toBe('s2');
    expect(summary.winner?.totalScore100).toBe(82);
    expect(summary.leadMargin100).toBe(10);
  });

  it('convertit les notes proprement entre échelle /5 et /10', () => {
    const scores: ScoresMap = { s1: { c1: 4, c2: 3.5 } };
    const to10 = rescaleScores(scores, 5, 10);
    expect(to10.s1.c1).toBe(8);
    expect(to10.s1.c2).toBe(7);
    const backTo5 = rescaleScores(to10, 10, 5);
    expect(backTo5.s1.c1).toBe(4);
    expect(backTo5.s1.c2).toBe(3.5);
  });
});
