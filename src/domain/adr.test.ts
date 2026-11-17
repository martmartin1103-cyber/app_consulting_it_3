import { describe, expect, it } from 'vitest';
import { generateAdrMarkdown } from './adr';
import { DEFAULT_CLOUD_PRESET } from './presets';

describe('ADR Markdown Compiler (Michael Nygard)', () => {
  it('génère toutes les sections obligatoires de la structure Michael Nygard', () => {
    const md = generateAdrMarkdown(DEFAULT_CLOUD_PRESET);

    expect(md).toContain('# ADR-001 :');
    expect(md).toContain('**Statut :** Proposé');
    expect(md).toContain('## 1. Contexte & Contraintes');
    expect(md).toContain('## 2. Options envisagées (Principe de charité)');
    expect(md).toContain('## 3. Décision retenue & Justification');
    expect(md).toContain('## 4. Conséquences');

    // Vérifie que toutes les options concurrentes sont incluses avec forces et limites
    expect(md).toContain('Amazon Web Services (AWS)');
    expect(md).toContain('Microsoft Azure');
    expect(md).toContain('Google Cloud Platform (GCP)');
    expect(md).toContain('Forces reconnues (principe de charité)');
    expect(md).toContain('Limites & points de vigilance');
  });
});
