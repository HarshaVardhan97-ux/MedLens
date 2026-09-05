import { Patient, Symptom, Condition, Allergy, Medication, ClinicalNote, LabResult, ImagingStudy, VitalSign } from '../types';
import { INITIAL_PATIENTS } from '../data/mockPatients';

const PATIENTS_STORAGE_KEY = 'medlens_patients_db';

export const patientService = {
  getPatients(): Patient[] {
    try {
      const stored = localStorage.getItem(PATIENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading stored patients', e);
    }
    this.savePatients(INITIAL_PATIENTS);
    return INITIAL_PATIENTS;
  },

  savePatients(patients: Patient[]): void {
    try {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.error('Error saving patients to storage', e);
    }
  },

  getPatientById(id: string): Patient | undefined {
    const patients = this.getPatients();
    return patients.find((p) => p.id === id) || patients[0];
  },

  updatePatient(updatedPatient: Patient): Patient[] {
    const patients = this.getPatients();
    const index = patients.findIndex((p) => p.id === updatedPatient.id);
    if (index !== -1) {
      patients[index] = updatedPatient;
    } else {
      patients.push(updatedPatient);
    }
    this.savePatients(patients);
    return patients;
  },

  updateVitals(patientId: string, vitals: VitalSign): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updated: Patient = {
      ...patient,
      vitals: { ...vitals },
    };

    this.updatePatient(updated);
    return updated;
  },

  updateEncounter(patientId: string, activeEncounterName: string, activeEncounterDate: string, attendingPhysician: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updated: Patient = {
      ...patient,
      activeEncounterName,
      activeEncounterDate,
      attendingPhysician,
    };

    this.updatePatient(updated);
    return updated;
  },

  addSymptom(patientId: string, symptomName: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const newSymptom: Symptom = {
      id: `sym-${Date.now()}`,
      name: symptomName,
      severity: 'Active',
      color: 'primary',
    };

    const updated: Patient = {
      ...patient,
      symptoms: [...patient.symptoms, newSymptom],
    };

    this.updatePatient(updated);
    return updated;
  },

  removeSymptom(patientId: string, symptomId: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updated: Patient = {
      ...patient,
      symptoms: patient.symptoms.filter((s) => s.id !== symptomId),
    };

    this.updatePatient(updated);
    return updated;
  },

  addCondition(patientId: string, name: string, icd10: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const newCondition: Condition = {
      id: `cond-${Date.now()}`,
      name,
      icd10: icd10 || 'Unspecified',
      description: 'Newly added clinical condition.',
      status: 'Active',
      statusType: 'managed',
    };

    const updated: Patient = {
      ...patient,
      conditions: [...patient.conditions, newCondition],
    };

    this.updatePatient(updated);
    return updated;
  },

  removeCondition(patientId: string, conditionId: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updated: Patient = {
      ...patient,
      conditions: patient.conditions.filter((c) => c.id !== conditionId),
    };

    this.updatePatient(updated);
    return updated;
  },

  addAllergy(patientId: string, agent: string, severity: 'Severe' | 'Moderate' | 'Mild', reaction: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const newAllergy: Allergy = {
      id: `alg-${Date.now()}`,
      agent,
      severity,
      reaction,
      verifiedDate: 'Just now',
    };

    const updated: Patient = {
      ...patient,
      allergies: [...patient.allergies, newAllergy],
    };

    this.updatePatient(updated);
    return updated;
  },

  removeAllergy(patientId: string, allergyId: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updated: Patient = {
      ...patient,
      allergies: patient.allergies.filter((a) => a.id !== allergyId),
    };

    this.updatePatient(updated);
    return updated;
  },

  addMedication(patientId: string, name: string, dosage: string, frequency: string, category: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name,
      dosage,
      frequency,
      category: category || 'General',
      adherencePercent: 100,
    };

    const updated: Patient = {
      ...patient,
      medications: [...patient.medications, newMed],
    };

    this.updatePatient(updated);
    return updated;
  },

  removeMedication(patientId: string, medId: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const updated: Patient = {
      ...patient,
      medications: patient.medications.filter((m) => m.id !== medId),
    };

    this.updatePatient(updated);
    return updated;
  },

  addLabResult(patientId: string, lab: Partial<LabResult>): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const newLab: LabResult = {
      id: `lab-${Date.now()}`,
      parameter: lab.parameter || 'Custom Parameter',
      loinc: lab.loinc || '9999-9',
      specimen: lab.specimen || 'Venous Blood',
      method: lab.method || 'Automated Assay',
      value: lab.value || '10.0',
      numericValue: Number(lab.value) || 10.0,
      unit: lab.unit || 'mg/dL',
      minRef: lab.minRef ?? 5.0,
      maxRef: lab.maxRef ?? 15.0,
      refText: lab.refText || '5.0 – 15.0',
      status: lab.status || 'normal',
      statusLabel: lab.statusLabel || 'Normal',
      source: lab.source || 'Hospital LIMS',
      category: lab.category || 'metabolic',
    };

    const updated: Patient = {
      ...patient,
      labs: [newLab, ...patient.labs],
    };

    this.updatePatient(updated);
    return updated;
  },

  addImagingStudy(patientId: string, study: Partial<ImagingStudy>): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const newStudy: ImagingStudy = {
      id: `img-${Date.now()}`,
      title: study.title || 'Diagnostic Scan Study',
      modality: study.modality || 'Ultrasound',
      bodyPart: study.bodyPart || 'General',
      accession: study.accession || `ACC-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • Just now',
      radiologist: study.radiologist || 'Dr. Sarah Jenkins, MD',
      pacsNetwork: patient.pacsNetwork || 'Hospital PACS Network',
      tiradsOrRating: study.tiradsOrRating,
      status: study.status || 'Finalized & Reviewed',
      extractedFindings: study.extractedFindings || 'Scan uploaded and processed via client PACS bridge. No immediate critical abnormality flagged.',
      narrative: study.narrative || 'Diagnostic imaging series ingested into clinical dossier.',
      metrics: study.metrics || [
        { label: 'Ingested File', value: study.title || 'DICOM Series', status: 'PACS Verified' },
      ],
      seriesInfo: study.seriesInfo || 'Series 1 / 1',
      previewType: study.previewType || 'ultrasound',
    };

    const updated: Patient = {
      ...patient,
      imaging: [newStudy, ...patient.imaging],
    };

    this.updatePatient(updated);
    return updated;
  },

  addNote(patientId: string, title: string, type: string, content: string, tags: string[], author: string): Patient | undefined {
    const patient = this.getPatientById(patientId);
    if (!patient) return undefined;

    const newNote: ClinicalNote = {
      id: `note-${Date.now()}`,
      title,
      type,
      facility: 'MedLens Workspace',
      author,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content,
      tags,
      encounterId: `ENC-${Date.now().toString().slice(-4)}`,
    };

    const updated: Patient = {
      ...patient,
      notes: [newNote, ...patient.notes],
    };

    this.updatePatient(updated);
    return updated;
  },
};
