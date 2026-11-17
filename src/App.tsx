import { ExecutiveSummaryBar } from './components/layout/ExecutiveSummaryBar';
import { Header } from './components/layout/Header';
import { Stepper } from './components/layout/Stepper';
import { Step1Criteria } from './components/steps/Step1Criteria';
import { Step2Solutions } from './components/steps/Step2Solutions';
import { Step3Evaluation } from './components/steps/Step3Evaluation';
import { Step4AdrExport } from './components/steps/Step4AdrExport';
import { useRadarStore } from './hooks/useRadarStore';
import { useTheme } from './hooks/useTheme';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const {
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
  } = useRadarStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header
        projectTitle={state.projectTitle}
        onProjectTitleChange={setProjectTitle}
        onLoadPreset={loadPreset}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Stepper
          activeStep={state.activeStep}
          onSelectStep={setActiveStep}
          criteriaCount={state.criteria.length}
          solutionsCount={state.solutions.length}
          isWeightValid={evaluation.isWeightValid}
          hasWinner={Boolean(evaluation.winner)}
        />

        <ExecutiveSummaryBar
          evaluation={evaluation}
          pairwiseAnalysis={pairwiseAnalysis}
          criteriaCount={state.criteria.length}
          solutionsCount={state.solutions.length}
        />

        {state.activeStep === 1 && (
          <Step1Criteria
            criteria={state.criteria}
            autoBalanceWeights={state.autoBalanceWeights}
            totalWeightPercent={evaluation.totalWeightPercent}
            isWeightValid={evaluation.isWeightValid}
            pairwise={state.pairwise}
            pairwiseAnalysis={pairwiseAnalysis}
            onToggleAutoBalance={setAutoBalanceWeights}
            onAddCriterion={addCriterion}
            onUpdateCriterion={updateCriterion}
            onUpdateWeight={updateCriterionWeight}
            onNormalizeWeights={normalizeAllWeights}
            onEqualizeWeights={equalizeWeights}
            onRemoveCriterion={removeCriterion}
            onChangePairwise={setPairwiseComparison}
            onApplyPairwiseWeights={applyPairwiseWeights}
            onNextStep={() => setActiveStep(2)}
          />
        )}

        {state.activeStep === 2 && (
          <Step2Solutions
            solutions={state.solutions}
            onAddSolution={addSolution}
            onUpdateSolution={updateSolution}
            onRemoveSolution={removeSolution}
            onPrevStep={() => setActiveStep(1)}
            onNextStep={() => setActiveStep(3)}
          />
        )}

        {state.activeStep === 3 && (
          <Step3Evaluation
            criteria={state.criteria}
            solutions={state.solutions}
            scores={state.scores}
            scale={state.scale}
            evaluation={evaluation}
            onChangeScale={setScale}
            onSetScore={setScore}
            onPrevStep={() => setActiveStep(2)}
            onNextStep={() => setActiveStep(4)}
          />
        )}

        {state.activeStep === 4 && (
          <Step4AdrExport
            state={state}
            evaluation={evaluation}
            onUpdateAdr={updateAdr}
            onPrevStep={() => setActiveStep(3)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
