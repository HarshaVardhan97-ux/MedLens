export type AuthMode = 'demo' | 'real';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarInitials: string;
  isDemo: boolean;
}

export interface VitalSign {
  bp: string;
  bpStatus: string;
  pulse: number;
  pulseStatus: string;
  spo2: number;
  spo2Status: string;
  temp: number;
  tempStatus: string;
  bmi: number;
  bmiStatus: string;
  weightLbs: number;
  heightInches: string;
}

export interface Symptom {
  id: string;
  name: string;
  severity: string;
  color: 'primary' | 'secondary' | 'error' | 'outline';
}

export interface Condition {
  id: string;
  name: string;
  icd10: string;
  description: string;
  status: string;
  statusType: 'chronic' | 'refractory' | 'episodic' | 'managed';
}

export interface Allergy {
  id: string;
  agent: string;
  severity: 'Severe' | 'Moderate' | 'Mild';
  reaction: string;
  verifiedDate?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  category: string;
  adherencePercent?: number;
  isPRN?: boolean;
}

export interface LabResult {
  id: string;
  parameter: string;
  loinc: string;
  specimen: string;
  method: string;
  value: string;
  numericValue?: number;
  unit: string;
  minRef?: number;
  maxRef?: number;
  refText: string;
  status: 'normal' | 'low' | 'high' | 'critical';
  statusLabel: string;
  source: string;
  category: 'hematology' | 'metabolic' | 'endocrine' | 'iron';
}

export interface ImagingStudy {
  id: string;
  title: string;
  modality: 'Ultrasound' | 'X-Ray' | 'MRI' | 'CT';
  bodyPart: string;
  accession: string;
  date: string;
  radiologist: string;
  pacsNetwork: string;
  tiradsOrRating?: string;
  status: 'Finalized & Reviewed' | 'Normal / Verified' | 'Normal Comparative' | 'Pending';
  extractedFindings: string;
  narrative: string;
  metrics: { label: string; value: string; status: string }[];
  seriesInfo: string;
  previewType: 'ultrasound' | 'xray' | 'mri';
}

export interface ClinicalNote {
  id: string;
  title: string;
  type: string;
  facility: string;
  author: string;
  date: string;
  content: string;
  tags: string[];
  encounterId: string;
}

export interface AiInsight {
  narrativeSummary: string;
  takeaways: {
    title: string;
    description: string;
    badge: string;
    category: string;
  }[];
  findings: {
    title: string;
    description: string;
    type: 'interaction' | 'recommendation' | 'alert';
  }[];
  modelEngine: string;
  generatedAt: string;
  disclaimer: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  initials: string;
  age: number;
  dob: string;
  gender: 'Female' | 'Male' | 'Intersex' | 'Undisclosed';
  bloodGroup: string;
  attendingPhysician: string;
  department: string;
  activeEncounterName: string;
  activeEncounterDate: string;
  pacsNetwork: string;
  vitals: VitalSign;
  symptoms: Symptom[];
  conditions: Condition[];
  allergies: Allergy[];
  medications: Medication[];
  labs: LabResult[];
  imaging: ImagingStudy[];
  notes: ClinicalNote[];
  aiInsight: AiInsight;
}
