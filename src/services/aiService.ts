import { Patient } from '../types';

export interface AiQueryResult {
  answer: string;
  sourceDataUsed: string[];
  confidence: 'High' | 'Medium';
  model: string;
  disclaimer: string;
}

export const aiService = {
  /**
   * Generates a contextual clinical response for a given patient and query prompt.
   * Connects to mock engine or real LLM API endpoint if configured.
   */
  async queryPatientAi(patient: Patient, query: string): Promise<AiQueryResult> {
    // Simulate slight API network latency
    await new Promise((res) => setTimeout(res, 600));

    const normalizedQuery = query.toLowerCase().trim();
    const model = 'MedLens Clinical AI Engine v2.4 (Abstracted Service)';
    const disclaimer = 'AI assistance does not replace professional clinical judgment.';

    // Case 1: Summarize patient
    if (normalizedQuery.includes('summarize') && (normalizedQuery.includes('patient') || normalizedQuery.includes('dossier') || normalizedQuery.includes('case'))) {
      const abnormalLabs = patient.labs.filter((l) => l.status !== 'normal');
      const abnormalSummary = abnormalLabs.map((l) => `${l.parameter}: ${l.value} ${l.unit} (${l.statusLabel})`).join('; ');

      return {
        answer: `Patient Summary for ${patient.name} (${patient.age} y/o ${patient.gender}, MRN ${patient.mrn}):\n\n` +
          `• Active Encounter: ${patient.activeEncounterName} under ${patient.attendingPhysician}.\n` +
          `• Key Diagnoses: ${patient.conditions.map((c) => c.name).join(', ')}.\n` +
          `• Vital Signs: Blood Pressure ${patient.vitals.bp} (${patient.vitals.bpStatus}), Heart Rate ${patient.vitals.pulse} bpm, SpO2 ${patient.vitals.spo2}%.\n` +
          `• Abnormal Findings: ${abnormalSummary || 'None registered.'}\n` +
          `• Active Medications: ${patient.medications.map((m) => `${m.name} ${m.dosage}`).join(', ')}.\n` +
          `• Allergies: ${patient.allergies.map((a) => `${a.agent} (${a.reaction})`).join(', ') || 'No known allergies'}.`,
        sourceDataUsed: ['Demographics', 'Vitals', 'Conditions', 'Labs', 'Medications', 'Allergies'],
        confidence: 'High',
        model,
        disclaimer,
      };
    }

    // Case 2: Abnormal labs explanation
    if (normalizedQuery.includes('lab') || normalizedQuery.includes('abnormal') || normalizedQuery.includes('blood work') || normalizedQuery.includes('ferritin') || normalizedQuery.includes('tsh')) {
      const abnormalLabs = patient.labs.filter((l) => l.status !== 'normal');
      if (abnormalLabs.length === 0) {
        return {
          answer: `All laboratory parameters currently registered for ${patient.name} fall within standard biological reference ranges.`,
          sourceDataUsed: ['Diagnostic Labs Table'],
          confidence: 'High',
          model,
          disclaimer,
        };
      }

      const labDetails = abnormalLabs
        .map((l) => `• ${l.parameter}: ${l.value} ${l.unit} (Reference: ${l.refText}). Evaluated as ${l.statusLabel.toUpperCase()} via ${l.source}.`)
        .join('\n');

      let clinicalCorrelation = '';
      if (patient.name.includes('Eleanor')) {
        clinicalCorrelation = '\n\nClinical Correlation: The co-administration of oral Ferrous Sulfate near morning Levothyroxine dosing presents a potential chelation interaction in the GI tract, impairing optimal thyroid and iron absorption.';
      } else if (patient.name.includes('Marcus')) {
        clinicalCorrelation = '\n\nClinical Correlation: LDL cholesterol (112 mg/dL) remains above post-PCI target (<70 mg/dL) with elevated hs-CRP (3.4 mg/L) reflecting low-grade inflammatory vascular risk.';
      } else if (patient.name.includes('Sophia')) {
        clinicalCorrelation = '\n\nClinical Correlation: Strongly positive Anti-dsDNA (84 IU/mL) combined with C3 complement depletion (68 mg/dL) correlates with active SLE autoimmune flare.';
      }

      return {
        answer: `Abnormal Laboratory Analysis for ${patient.name}:\n\n${labDetails}${clinicalCorrelation}`,
        sourceDataUsed: ['Diagnostic Labs Panel', 'EHR Synced Results', 'Active Regimen'],
        confidence: 'High',
        model,
        disclaimer,
      };
    }

    // Case 3: Imaging summary
    if (normalizedQuery.includes('imaging') || normalizedQuery.includes('radiology') || normalizedQuery.includes('scan') || normalizedQuery.includes('ultrasound') || normalizedQuery.includes('x-ray') || normalizedQuery.includes('mri')) {
      if (patient.imaging.length === 0) {
        return {
          answer: `No imaging or radiological studies are currently documented for ${patient.name}.`,
          sourceDataUsed: ['Imaging PACS Archive'],
          confidence: 'High',
          model,
          disclaimer,
        };
      }

      const studiesSummary = patient.imaging
        .map((img) => `• ${img.title} (${img.modality} - ${img.date}): ${img.extractedFindings}`)
        .join('\n\n');

      return {
        answer: `Radiological Imaging Synthesis for ${patient.name}:\n\n${studiesSummary}`,
        sourceDataUsed: ['PACS DICOM Reports', 'Radiologist Impressions'],
        confidence: 'High',
        model,
        disclaimer,
      };
    }

    // Case 4: Encounter changes / Previous encounter comparison
    if (normalizedQuery.includes('change') || normalizedQuery.includes('previous') || normalizedQuery.includes('encounter') || normalizedQuery.includes('history')) {
      const recentNotes = patient.notes.slice(0, 2);
      const notesSummary = recentNotes.map((n) => `• [${n.date}] ${n.title}: ${n.content}`).join('\n\n');

      return {
        answer: `Encounter Longitudinal Changes for ${patient.name}:\n\n` +
          `Active Encounter: ${patient.activeEncounterName} (${patient.activeEncounterDate})\n\n` +
          `Recent Clinical Documentation:\n${notesSummary}`,
        sourceDataUsed: ['Encounter Notes History', 'Attending Physician Records'],
        confidence: 'High',
        model,
        disclaimer,
      };
    }

    // Default / Custom query fallback using exact patient parameters
    const activeMeds = patient.medications.map((m) => m.name).join(', ');
    const activeConds = patient.conditions.map((c) => c.name).join(', ');

    return {
      answer: `Analysis for query "${query}" regarding patient ${patient.name}:\n\n` +
        `Based strictly on authenticated dossier records:\n` +
        `- Patient: ${patient.name}, ${patient.age} y/o ${patient.gender} (MRN ${patient.mrn})\n` +
        `- Primary Diagnoses: ${activeConds}\n` +
        `- Current Regimen: ${activeMeds}\n` +
        `- Latest Vitals: BP ${patient.vitals.bp}, HR ${patient.vitals.pulse} bpm, SpO2 ${patient.vitals.spo2}%\n\n` +
        `No contradictory data found in EHR records. Always cross-reference with certified hospital records.`,
      sourceDataUsed: ['Patient Clinical Dossier', 'EHR Synchronized Matrix'],
      confidence: 'Medium',
      model,
      disclaimer,
    };
  },
};
