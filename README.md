# Vendor/Tech Radar (B2B SaaS Advisory)

Application web B2B dédiée aux consultants en stratégie IT pour objectiver les choix technologiques (Cloud, ERP, plateformes) en combinant :
- **AHP (Analytic Hierarchy Process — Thomas Saaty)** : pondération de 3 à 5 critères (sliders directs totalisant 100 % ou matrice de comparaison par paires avec calcul du Ratio de Cohérence `CR`).
- **Matrice d'évaluation temps réel** : notation de 2 à 4 solutions concurrentes (sur 5 ou sur 10), calcul instantané du score pondéré `/100`, décomposition par critère et mise en surbrillance du vainqueur.
- **ADR (Architecture Decision Record — Michael Nygard)** : compilation structurée (Titre & Statut, Contexte & Contraintes, Options envisagées selon le principe de charité, Décision retenue & Justification, Conséquences) exportable en Markdown (`.md`).

## Stack technique
- **Frontend :** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Logique métier isolée :** `src/domain/ahp.ts` et `src/domain/adr.ts` (fonctions pures, zéro dépendance DOM/React)
- **Persistance :** `localStorage` (`src/services/storage.ts`) + gestion Light / Dark Mode Corporate Consulting
- **Tests :** Vitest (`src/domain/*.test.ts`)

## Commandes

```bash
npm install
npm run dev      # Serveur de développement Vite
npm test         # Tests unitaires Vitest (logique AHP & ADR)
npm run lint     # Analyse statique oxlint
npm run build    # Compilation TypeScript & bundle production
```
