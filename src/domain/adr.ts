import type { RadarState } from './types';
import { computeAhpFromPairwise, evaluateSolutions } from './ahp';

/**
 * Compile les données de l'analyse AHP dans un document Markdown
 * respectant strictement la structure ADR de Michael Nygard :
 * 1. Titre & Statut
 * 2. Contexte & Contraintes
 * 3. Options envisagées (principe de charité)
 * 4. Décision retenue & Justification
 * 5. Conséquences
 */
export function generateAdrMarkdown(state: RadarState): string {
  const evaluation = evaluateSolutions(
    state.criteria,
    state.solutions,
    state.scores,
    state.scale
  );
  const pairwiseResult = computeAhpFromPairwise(
    state.criteria.map((c) => c.id),
    state.pairwise
  );

  const title =
    state.adr.title.trim() ||
    `Sélection de solution — ${state.projectTitle.trim() || 'Architecture Cible'}`;
  const adrId = state.adr.adrId.trim() || 'ADR-001';
  const status = state.adr.status;
  const date = state.adr.date || new Date().toISOString().slice(0, 10);
  const author = state.adr.author.trim() || 'Architecture & Advisory Practice';

  const criteriaLines = state.criteria
    .map(
      (c) =>
        `| ${c.name} | ${c.weight.toFixed(1)} % | ${c.description.trim() || 'Critère d’évaluation stratégique'} |`
    )
    .join('\n');

  const matrixHeader = `| Critère (Poids) | ${evaluation.evaluations
    .map((e) => e.solution.name)
    .join(' | ')} |`;
  const matrixDivider = `| :--- | ${evaluation.evaluations
    .map(() => ':---:')
    .join(' | ')} |`;
  const matrixRows = state.criteria
    .map((c) => {
      const cells = evaluation.evaluations.map((ev) => {
        const raw = state.scores[ev.solution.id]?.[c.id] ?? 0;
        return `${raw}/${state.scale}`;
      });
      return `| **${c.name}** (${c.weight.toFixed(1)} %) | ${cells.join(' | ')} |`;
    })
    .join('\n');
  const matrixTotalRow = `| **Score Pondéré (/100)** | ${evaluation.evaluations
    .map((ev) =>
      ev.isWinner ? `**${ev.totalScore100.toFixed(1)} / 100 (Vainqueur)**` : `${ev.totalScore100.toFixed(1)} / 100`
    )
    .join(' | ')} |`;

  const optionsSection = evaluation.evaluations
    .map((ev) => {
      const { solution } = ev;
      const vendorTag = solution.vendor.trim() ? ` (${solution.vendor.trim()})` : '';
      const summary =
        solution.summary.trim() ||
        `Option technologique évaluée sur les ${state.criteria.length} critères retenus.`;
      const strengths =
        solution.strengths.trim() ||
        'Capacités fonctionnelles solides et écosystème éprouvé sur le périmètre cible.';
      const weaknesses =
        solution.weaknesses.trim() ||
        'Points d’attention à cadrer lors de la phase de conception détaillée et de négociation contractuelle.';

      return [
        `### ${ev.rank}. ${solution.name}${vendorTag} — ${ev.totalScore100.toFixed(1)} / 100 (${ev.totalScoreOnScale.toFixed(2)} / ${state.scale})`,
        '',
        `- **Présentation :** ${summary}`,
        `- **Forces reconnues (principe de charité) :** ${strengths}`,
        `- **Limites & points de vigilance :** ${weaknesses}`,
      ].join('\n');
    })
    .join('\n\n');

  const winner = evaluation.winner;
  const runnerUp = evaluation.runnerUp;

  let decisionBlock =
    'Aucune décision définitive ne peut être arrêtée tant que la matrice de notation n’est pas complétée.';

  if (winner) {
    const topDrivers = [...winner.contributions]
      .sort((a, b) => b.weightedPoints - a.weightedPoints)
      .slice(0, 2)
      .map(
        (d) =>
          `**${d.criterionName}** (${d.rawScore}/${state.scale}, soit +${d.weightedPoints.toFixed(1)} pts pondérés)`
      )
      .join(' et ');

    const marginText = runnerUp
      ? `avec une avance de **+${evaluation.leadMargin100.toFixed(1)} points** sur **${runnerUp.solution.name}** (${runnerUp.totalScore100.toFixed(1)} / 100)`
      : '';

    const tieWarning = winner.isTiedWinner
      ? `\n\n> **Note de gouvernance :** Une ex æquo est constatée en tête du classement. Une revue complémentaire (POC ou négociation commerciale) est recommandée pour départager les options.`
      : '';

    decisionBlock = [
      `La solution retenue est **${winner.solution.name}**${winner.solution.vendor ? ` (${winner.solution.vendor})` : ''}, qui obtient le meilleur score pondéré AHP de **${winner.totalScore100.toFixed(1)} / 100** (${winner.totalScoreOnScale.toFixed(2)} / ${state.scale}) ${marginText}.`.trim(),
      '',
      `Cette recommandation s’appuie principalement sur sa performance sur ${topDrivers}.`,
    ].join('\n') + tieWarning;
  }

  const contextText =
    state.adr.context.trim() ||
    `Dans le cadre du programme **${state.projectTitle}**, l’organisation doit objectiver le choix d’une solution pérenne face à des enjeux de maîtrise budgétaire, de sécurité et d’évolutivité.`;

  const constraintsText =
    state.adr.constraints.trim() ||
    '- Respect de la gouvernance IT et des exigences de conformité (RGPD / sécurité).\n- Maîtrise du TCO sur un horizon de 3 à 5 ans.\n- Capacité d’intégration avec le SI existant.';

  const positiveCons =
    state.adr.consequencesPositive.trim() ||
    `- Alignement objectif du comité de direction autour d’une grille pondérée transparente.\n- Traçabilité complète de la décision pour les audits et comités d’architecture.`;

  const negativeCons =
    state.adr.consequencesNegative.trim() ||
    `- Dépendance vis-à-vis de l’éditeur / fournisseur retenu (lock-in à encadrer).\n- Effort d’accompagnement au changement et de montée en compétence des équipes.`;

  const mitigationCons =
    state.adr.mitigationPlan.trim() ||
    `- Clauses contractuelles de réversibilité et de SLA.\n- Phase pilote / POC de 4 à 6 semaines avant généralisation.`;

  return [
    `# ${adrId} : ${title}`,
    '',
    `- **Statut :** ${status}`,
    `- **Date :** ${date}`,
    `- **Auteur / Practice :** ${author}`,
    `- **Méthode :** AHP (Analytic Hierarchy Process — Thomas Saaty) | Échelle de notation : 0–${state.scale}`,
    `- **Cohérence des pondérations :** Somme = ${evaluation.totalWeightPercent.toFixed(1)} %${state.criteria.length >= 3 ? ` | Ratio de cohérence matrice Saaty (CR) = ${(pairwiseResult.cr * 100).toFixed(1)} %` : ''}`,
    '',
    '---',
    '',
    '## 1. Contexte & Contraintes',
    '',
    '### Contexte métier & technique',
    contextText,
    '',
    '### Contraintes structurantes',
    constraintsText,
    '',
    '### Critères de décision & Pondérations AHP',
    '| Critère | Pondération | Définition |',
    '| :--- | :---: | :--- |',
    criteriaLines,
    '',
    '---',
    '',
    '## 2. Options envisagées (Principe de charité)',
    '',
    'Chaque solution candidate a été évaluée de bonne foi en explicitant ses atouts structurels autant que ses limites opérationnelles.',
    '',
    optionsSection,
    '',
    '### Synthèse de la matrice d’évaluation',
    matrixHeader,
    matrixDivider,
    matrixRows,
    matrixTotalRow,
    '',
    '---',
    '',
    '## 3. Décision retenue & Justification',
    '',
    decisionBlock,
    '',
    '---',
    '',
    '## 4. Conséquences',
    '',
    '### Bénéfices attendus (positifs)',
    positiveCons,
    '',
    '### Compromis & risques identifiés (négatifs)',
    negativeCons,
    '',
    '### Plan de mitigation & prochaines étapes',
    mitigationCons,
    '',
  ].join('\n');
}
