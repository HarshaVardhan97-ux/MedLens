import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient } from '../types';
import { patientService } from '../services/patientService';

interface PatientContextType {
  patients: Patient[];
  selectedPatient: Patient;
  setSelectedPatientId: (id: string) => void;
  refreshPatients: () => void;
  updatePatient: (updated: Patient) => void;
  updateVitals: (vitals: Patient['vitals']) => void;
  updateEncounter: (name: string, date: string, physician: string) => void;
  addLabResult: (lab: Partial<import('../types').LabResult>) => void;
  addImagingStudy: (study: Partial<import('../types').ImagingStudy>) => void;
  addSymptom: (symptomName: string) => void;
  removeSymptom: (symptomId: string) => void;
  addCondition: (name: string, icd10: string) => void;
  removeCondition: (conditionId: string) => void;
  addAllergy: (agent: string, severity: 'Severe' | 'Moderate' | 'Mild', reaction: string) => void;
  removeAllergy: (allergyId: string) => void;
  addMedication: (name: string, dosage: string, frequency: string, category: string) => void;
  removeMedication: (medId: string) => void;
  addNote: (title: string, type: string, content: string, tags: string[], author: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => patientService.getPatients());
  const [selectedPatientId, setSelectedPatientIdState] = useState<string>(
    patients[0]?.id || 'pat-1'
  );

  const refreshPatients = () => {
    const list = patientService.getPatients();
    setPatients(list);
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const setSelectedPatientId = (id: string) => {
    setSelectedPatientIdState(id);
  };

  const updatePatient = (updated: Patient) => {
    const newList = patientService.updatePatient(updated);
    setPatients([...newList]);
  };

  const updateVitals = (vitals: Patient['vitals']) => {
    if (!selectedPatient) return;
    patientService.updateVitals(selectedPatient.id, vitals);
    refreshPatients();
  };

  const updateEncounter = (name: string, date: string, physician: string) => {
    if (!selectedPatient) return;
    patientService.updateEncounter(selectedPatient.id, name, date, physician);
    refreshPatients();
  };

  const addLabResult = (lab: Partial<import('../types').LabResult>) => {
    if (!selectedPatient) return;
    patientService.addLabResult(selectedPatient.id, lab);
    refreshPatients();
  };

  const addImagingStudy = (study: Partial<import('../types').ImagingStudy>) => {
    if (!selectedPatient) return;
    patientService.addImagingStudy(selectedPatient.id, study);
    refreshPatients();
  };

  const addSymptom = (symptomName: string) => {
    if (!selectedPatient) return;
    const res = patientService.addSymptom(selectedPatient.id, symptomName);
    if (res) refreshPatients();
  };

  const removeSymptom = (symptomId: string) => {
    if (!selectedPatient) return;
    const res = patientService.removeSymptom(selectedPatient.id, symptomId);
    if (res) refreshPatients();
  };

  const addCondition = (name: string, icd10: string) => {
    if (!selectedPatient) return;
    const res = patientService.addCondition(selectedPatient.id, name, icd10);
    if (res) refreshPatients();
  };

  const removeCondition = (conditionId: string) => {
    if (!selectedPatient) return;
    const res = patientService.removeCondition(selectedPatient.id, conditionId);
    if (res) refreshPatients();
  };

  const addAllergy = (agent: string, severity: 'Severe' | 'Moderate' | 'Mild', reaction: string) => {
    if (!selectedPatient) return;
    const res = patientService.addAllergy(selectedPatient.id, agent, severity, reaction);
    if (res) refreshPatients();
  };

  const removeAllergy = (allergyId: string) => {
    if (!selectedPatient) return;
    const res = patientService.removeAllergy(selectedPatient.id, allergyId);
    if (res) refreshPatients();
  };

  const addMedication = (name: string, dosage: string, frequency: string, category: string) => {
    if (!selectedPatient) return;
    const res = patientService.addMedication(selectedPatient.id, name, dosage, frequency, category);
    if (res) refreshPatients();
  };

  const removeMedication = (medId: string) => {
    if (!selectedPatient) return;
    const res = patientService.removeMedication(selectedPatient.id, medId);
    if (res) refreshPatients();
  };

  const addNote = (title: string, type: string, content: string, tags: string[], author: string) => {
    if (!selectedPatient) return;
    const res = patientService.addNote(selectedPatient.id, title, type, content, tags, author);
    if (res) refreshPatients();
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        selectedPatient,
        setSelectedPatientId,
        refreshPatients,
        updatePatient,
        updateVitals,
        updateEncounter,
        addLabResult,
        addImagingStudy,
        addSymptom,
        removeSymptom,
        addCondition,
        removeCondition,
        addAllergy,
        removeAllergy,
        addMedication,
        removeMedication,
        addNote,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
