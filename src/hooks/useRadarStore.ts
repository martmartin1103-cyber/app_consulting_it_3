import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MAX_CRITERIA,
  MAX_SOLUTIONS,
  MIN_CRITERIA,
  MIN_SOLUTIONS,
  computeAhpFromPairwise,
  evaluateSolutions,
  normalizeWeightsTo100,
  pairwiseKey,
  rebalanceCriteriaWeights,
  rescaleScores,
} from '../domain/ahp';
import { DEFAULT_CLOUD_PRESET, ERP_PRESET } from '../domain/presets';
import type {
  AdrMetadata,
  Criterion,
  RadarState,
  RadarStep,
  ScoreScale,
  Solution,
} from '../domain/types';
import { loadRadarState, saveRadarState } from '../services/storage';

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function useRadarStore() {
  const [state, setState] = useState<RadarState>(() =>
    loadRadarState(DEFAULT_CLOUD_PRESET)
  );

  useEffect(() => {
    saveRadarState(state);
  }, [state]);

  const evaluation = useMemo(
    () =>
      evaluateSolutions(
        state.criteria,
        state.solutions,
        state.scores,
        state.scale
      ),
    [state.criteria, state.solutions, state.scores, state.scale]
  );

  const pairwiseAnalysis = useMemo(
    () =>
      computeAhpFromPairwise(
        state.criteria.map((c) => c.id),
        state.pairwise
      ),
    [state.criteria, state.pairwise]
  );

  const setActiveStep = useCallback((step: RadarStep) => {
    setState((prev) => ({ ...prev, activeStep: step }));
  }, []);

  const setProjectTitle = useCallback((projectTitle: string) => {
    setState((prev) => ({ ...prev, projectTitle }));
  }, []);

  const setAutoBalanceWeights = useCallback((autoBalanceWeights: boolean) => {
    setState((prev) => {
      if (!autoBalanceWeights) {
        return { ...prev, autoBalanceWeights };
      }
      const normalized = normalizeWeightsTo100(
        prev.criteria.map((c) => c.weight)
      );
      return {
        ...prev,
        autoBalanceWeights: true,
        criteria: prev.criteria.map((c, idx) => ({
          ...c,
          weight: normalized[idx] ?? c.weight,
        })),
      };
    });
  }, []);

  const addCriterion = useCallback((name?: string) => {
    setState((prev) => {
      if (prev.criteria.length >= MAX_CRITERIA) return prev;
      const newCrit: Criterion = {
        id: makeId('crit'),
        name: name?.trim() || `Critère ${prev.criteria.length + 1}`,
        description: '',
        weight: 20,
      };
      const rawCriteria = [...prev.criteria, newCrit];
      const normalized = normalizeWeightsTo100(
        rawCriteria.map((c) => c.weight)
      );
      const criteria = rawCriteria.map((c, idx) => ({
        ...c,
        weight: normalized[idx] ?? 0,
      }));
      const nextScores = { ...prev.scores };
      for (const sol of prev.solutions) {
        nextScores[sol.id] = {
          ...(nextScores[sol.id] ?? {}),
          [newCrit.id]: Math.round((prev.scale / 2) * 10) / 10,
        };
      }
      return { ...prev, criteria, scores: nextScores };
    });
  }, []);

  const updateCriterion = useCallback(
    (id: string, patch: Partial<Pick<Criterion, 'name' | 'description'>>) => {
      setState((prev) => ({
        ...prev,
        criteria: prev.criteria.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
      }));
    },
    []
  );

  const updateCriterionWeight = useCallback((id: string, nextWeight: number) => {
    setState((prev) => {
      const clamped = Math.max(0, Math.min(100, Math.round(nextWeight * 10) / 10));
      const criteria = prev.autoBalanceWeights
        ? rebalanceCriteriaWeights(prev.criteria, id, clamped)
        : prev.criteria.map((c) =>
            c.id === id ? { ...c, weight: clamped } : c
          );
      return { ...prev, criteria };
    });
  }, []);

  const normalizeAllWeights = useCallback(() => {
    setState((prev) => {
      const normalized = normalizeWeightsTo100(
        prev.criteria.map((c) => c.weight)
      );
      return {
        ...prev,
        criteria: prev.criteria.map((c, idx) => ({
          ...c,
          weight: normalized[idx] ?? 0,
        })),
      };
    });
  }, []);

  const equalizeWeights = useCallback(() => {
    setState((prev) => {
      const normalized = normalizeWeightsTo100(prev.criteria.map(() => 1));
      return {
        ...prev,
        criteria: prev.criteria.map((c, idx) => ({
          ...c,
          weight: normalized[idx] ?? 0,
        })),
      };
    });
  }, []);

  const removeCriterion = useCallback((id: string) => {
    setState((prev) => {
      if (prev.criteria.length <= MIN_CRITERIA) return prev;
      const remaining = prev.criteria.filter((c) => c.id !== id);
      const normalized = normalizeWeightsTo100(remaining.map((c) => c.weight));
      const criteria = remaining.map((c, idx) => ({
        ...c,
        weight: normalized[idx] ?? 0,
      }));
      return { ...prev, criteria };
    });
  }, []);

  const setPairwiseComparison = useCallback(
    (idA: string, idB: string, value: number) => {
      setState((prev) => ({
        ...prev,
        pairwise: {
          ...prev.pairwise,
          [pairwiseKey(idA, idB)]: value,
        },
      }));
    },
    []
  );

  const applyPairwiseWeights = useCallback(() => {
    setState((prev) => {
      const result = computeAhpFromPairwise(
        prev.criteria.map((c) => c.id),
        prev.pairwise
      );
      return {
        ...prev,
        criteria: prev.criteria.map((c, idx) => ({
          ...c,
          weight: result.weightsPercent[idx] ?? c.weight,
        })),
      };
    });
  }, []);

  const addSolution = useCallback((name?: string) => {
    setState((prev) => {
      if (prev.solutions.length >= MAX_SOLUTIONS) return prev;
      const newSol: Solution = {
        id: makeId('sol'),
        name: name?.trim() || `Solution ${prev.solutions.length + 1}`,
        vendor: '',
        summary: '',
        strengths: '',
        weaknesses: '',
      };
      const defaultScore = Math.round((prev.scale * 0.6) * 10) / 10;
      const solScores: Record<string, number> = {};
      for (const crit of prev.criteria) {
        solScores[crit.id] = defaultScore;
      }
      return {
        ...prev,
        solutions: [...prev.solutions, newSol],
        scores: {
          ...prev.scores,
          [newSol.id]: solScores,
        },
      };
    });
  }, []);

  const updateSolution = useCallback(
    (id: string, patch: Partial<Omit<Solution, 'id'>>) => {
      setState((prev) => ({
        ...prev,
        solutions: prev.solutions.map((s) =>
          s.id === id ? { ...s, ...patch } : s
        ),
      }));
    },
    []
  );

  const removeSolution = useCallback((id: string) => {
    setState((prev) => {
      if (prev.solutions.length <= MIN_SOLUTIONS) return prev;
      const nextScores = { ...prev.scores };
      delete nextScores[id];
      return {
        ...prev,
        solutions: prev.solutions.filter((s) => s.id !== id),
        scores: nextScores,
      };
    });
  }, []);

  const setScore = useCallback(
    (solutionId: string, criterionId: string, value: number) => {
      setState((prev) => {
        const clamped = Math.max(0, Math.min(prev.scale, value));
        return {
          ...prev,
          scores: {
            ...prev.scores,
            [solutionId]: {
              ...(prev.scores[solutionId] ?? {}),
              [criterionId]: clamped,
            },
          },
        };
      });
    },
    []
  );

  const setScale = useCallback((nextScale: ScoreScale) => {
    setState((prev) => {
      if (prev.scale === nextScale) return prev;
      return {
        ...prev,
        scale: nextScale,
        scores: rescaleScores(prev.scores, prev.scale, nextScale),
      };
    });
  }, []);

  const updateAdr = useCallback((patch: Partial<AdrMetadata>) => {
    setState((prev) => ({
      ...prev,
      adr: { ...prev.adr, ...patch },
    }));
  }, []);

  const loadPreset = useCallback((presetKey: 'cloud' | 'erp') => {
    const base = presetKey === 'erp' ? ERP_PRESET : DEFAULT_CLOUD_PRESET;
    setState({ ...base, activeStep: 1 });
  }, []);

  return {
    state,
    evaluation,
    pairwiseAnalysis,
    setActiveStep,
    setProjectTitle,
    setAutoBalanceWeights,
    addCriterion,
    updateCriterion,
    updateCriterionWeight,
    normalizeAllWeights,
    equalizeWeights,
    removeCriterion,
    setPairwiseComparison,
    applyPairwiseWeights,
    addSolution,
    updateSolution,
    removeSolution,
    setScore,
    setScale,
    updateAdr,
    loadPreset,
  };
}
