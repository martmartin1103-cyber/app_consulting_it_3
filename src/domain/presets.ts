import type { RadarState } from './types';

export const DEFAULT_CLOUD_PRESET: RadarState = {
  activeStep: 1,
  projectTitle: 'Modernisation Socle Cloud & Plateforme Data',
  scale: 10,
  autoBalanceWeights: true,
  criteria: [
    {
      id: 'crit-cost',
      name: 'Coût total (TCO 3 ans)',
      description:
        'Prévisibilité FinOps, remises sur engagement, coûts de sortie réseau et licences.',
      weight: 25,
    },
    {
      id: 'crit-sec',
      name: 'Sécurité & Souveraineté',
      description:
        'Certifications SecNumCloud / ISO 27001, chiffrement BYOK, résidence des données UE.',
      weight: 35,
    },
    {
      id: 'crit-ops',
      name: 'Maturité PaaS & Time-to-Market',
      description:
        'Richesse des services managés (Kubernetes, IA, Data) et outillage DevOps.',
      weight: 25,
    },
    {
      id: 'crit-skills',
      name: 'Disponibilité des compétences',
      description:
        'Capacité des équipes internes et du marché ESN à opérer la plateforme.',
      weight: 15,
    },
  ],
  solutions: [
    {
      id: 'sol-aws',
      name: 'Amazon Web Services (AWS)',
      vendor: 'Amazon',
      summary:
        'Leader historique du cloud public offrant le catalogue IaaS/PaaS le plus étendu du marché.',
      strengths:
        'Profondeur fonctionnelle inégalée, fiabilité multi-AZ éprouvée, vaste vivier de talents certifiés.',
      weaknesses:
        'Complexité tarifaire (egress, services granulaires) et gouvernance multi-comptes exigeante.',
    },
    {
      id: 'sol-azure',
      name: 'Microsoft Azure',
      vendor: 'Microsoft',
      summary:
        'Plateforme cloud entreprise fortement intégrée à l’écosystème Microsoft 365, Entra ID et Data.',
      strengths:
        'Synergie native Active Directory / licences EA existantes, fort accompagnement grands comptes.',
      weaknesses:
        'Hétérogénéité ponctuelle entre portails/API et incidents régionaux à anticiper par design.',
    },
    {
      id: 'sol-gcp',
      name: 'Google Cloud Platform (GCP)',
      vendor: 'Google',
      summary:
        'Plateforme orientée conteneurs (GKE), analytique temps réel (BigQuery) et IA générative.',
      strengths:
        'Expérience développeur épurée, réseau backbone performant, leadership sur Kubernetes et Data/AI.',
      weaknesses:
        'Part de marché entreprise plus restreinte en France et écosystème intégrateurs moins dense.',
    },
  ],
  scores: {
    'sol-aws': {
      'crit-cost': 7,
      'crit-sec': 8,
      'crit-ops': 9,
      'crit-skills': 8.5,
    },
    'sol-azure': {
      'crit-cost': 7.5,
      'crit-sec': 8.5,
      'crit-ops': 8,
      'crit-skills': 9,
    },
    'sol-gcp': {
      'crit-cost': 8,
      'crit-sec': 7.5,
      'crit-ops': 9,
      'crit-skills': 6.5,
    },
  },
  pairwise: {
    'crit-cost::crit-sec': 1 / 3,
    'crit-cost::crit-ops': 1,
    'crit-cost::crit-skills': 3,
    'crit-sec::crit-ops': 3,
    'crit-sec::crit-skills': 3,
    'crit-ops::crit-skills': 3,
  },
  adr: {
    adrId: 'ADR-001',
    title: 'Choix du fournisseur Cloud principal pour la plateforme B2B',
    status: 'Proposé',
    date: '2026-11-17',
    author: 'Cabinet Stratégie & Architecture IT',
    context:
      'Dans le cadre du plan de transformation digitale 2026-2029, la DSI souhaite rationaliser ses déploiements applicatifs et analytiques autour d’un fournisseur Cloud stratégique unique (approche Primary Cloud).',
    constraints:
      '- Hébergement impératif en Union Européenne (région Paris / Francfort) avec chiffrement maîtrisé.\n- Compatibilité SSO avec le fournisseur d’identité groupe (Entra ID).\n- Enveloppe Run plafonnée nécessitant un pilotage FinOps dès le jour 1.',
    consequencesPositive:
      '- Standardisation des pipelines CI/CD et des modules Terraform.\n- Mutualisation des remises contractuelles (Enterprise Discount Program).\n- Réduction de la dette d’exploitation multi-environnements.',
    consequencesNegative:
      '- Dépendance assumée envers le fournisseur retenu sur les services PaaS managés.\n- Nécessité de former 15 ingénieurs DevOps/Data sur les 6 prochains mois.',
    mitigationPlan:
      '- Encapsulation des workloads critiques dans Kubernetes pour préserver une portabilité applicative.\n- Mise en place d’une revue trimestrielle FinOps et d’un test annuel de plan de réversibilité.',
  },
};

export const ERP_PRESET: RadarState = {
  activeStep: 1,
  projectTitle: 'Refonte Core Model ERP Groupe',
  scale: 5,
  autoBalanceWeights: true,
  criteria: [
    {
      id: 'crit-fit',
      name: 'Adéquation Métier Finance/Supply',
      description: 'Couverture standard des processus Core Model sans développement spécifique.',
      weight: 40,
    },
    {
      id: 'crit-tco',
      name: 'TCO Licences & Intégration',
      description: 'Coût global sur 5 ans incluant licences SaaS, intégrateur et TMA.',
      weight: 30,
    },
    {
      id: 'crit-api',
      name: 'Ouverture API & Composable',
      description: 'Qualité des API REST/Event-driven pour s’intégrer au SI e-commerce.',
      weight: 30,
    },
  ],
  solutions: [
    {
      id: 'sol-sap',
      name: 'SAP S/4HANA Cloud',
      vendor: 'SAP',
      summary: 'Progiciel ERP de référence pour les ETI et grands groupes multi-entités.',
      strengths: 'Profondeur comptable, traçabilité réglementaire et consolidation internationale.',
      weaknesses: 'Coût d’intégration élevé et rigidité des cycles de montée de version.',
    },
    {
      id: 'sol-odoo',
      name: 'Odoo Enterprise',
      vendor: 'Odoo SA',
      summary: 'Suite ERP modulaire open-core agile adaptée aux structures en croissance.',
      strengths: 'Rapidité de déploiement, ergonomie moderne et TCO nettement plus léger.',
      weaknesses: 'Moins adapté aux schémas de consolidation complexes multi-devises > 20 filiales.',
    },
  ],
  scores: {
    'sol-sap': { 'crit-fit': 4.5, 'crit-tco': 2.5, 'crit-api': 3.5 },
    'sol-odoo': { 'crit-fit': 3.5, 'crit-tco': 4.5, 'crit-api': 4.5 },
  },
  pairwise: {
    'crit-fit::crit-tco': 3,
    'crit-fit::crit-api': 1,
    'crit-tco::crit-api': 1,
  },
  adr: {
    adrId: 'ADR-002',
    title: 'Sélection du socle ERP Core Model Europe',
    status: 'En revue',
    date: '2026-11-17',
    author: 'Practice Transformation ERP',
    context:
      'Harmonisation de 4 ERP hétérogènes suite à des opérations de croissance externe.',
    constraints:
      '- Facturation électronique obligatoire (e-invoicing) prête dès la mise en production.\n- Délai maximal de déploiement du premier pays pilote : 9 mois.',
    consequencesPositive:
      '- Référentiel articles et tiers unifié au niveau groupe.\n- Accélération des clôtures mensuelles.',
    consequencesNegative:
      '- Abandon nécessaire de certaines pratiques locales non standard.',
    mitigationPlan:
      '- Gouvernance Core Model stricte avec comité d’arbitrage des écarts (Fit-to-Standard).',
  },
};
