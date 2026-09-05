import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { Patient } from '../types';

export const PatientDetails: React.FC = () => {
  const { selectedPatient, updatePatient, addSymptom, removeSymptom, addCondition, removeCondition, addAllergy, removeAllergy, addMedication, removeMedication } = usePatient();

  const [fullName, setFullName] = useState(selectedPatient.name);
  const [age, setAge] = useState(selectedPatient.age);
  const [gender, setGender] = useState(selectedPatient.gender);
  const [newSymptomText, setNewSymptomText] = useState('');
  const [showAddCondModal, setShowAddCondModal] = useState(false);
  const [newCondName, setNewCondName] = useState('');
  const [newCondIcd, setNewCondIcd] = useState('');
  
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedCategory, setNewMedCategory] = useState('Endocrine');

  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
  const [newAllergyAgent, setNewAllergyAgent] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState<'Severe' | 'Moderate' | 'Mild'>('Moderate');
  const [newAllergyReaction, setNewAllergyReaction] = useState('');

  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient reports progressive lethargy over the previous six weeks despite compliance with morning Levothyroxine. Ferritin panel re-ordered to evaluate microcytic anemia severity. Neurological screening unremarkable; deep tendon reflexes 2+ bilaterally. Advised timing iron supplements 4 hours apart from thyroid hormone replacement.'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updated: Patient = {
        ...selectedPatient,
        name: fullName,
        age: Number(age),
        gender,
      };
      updatePatient(updated);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleAddSymptomSubmit = (e: React.KeyboardEvent | React.FormEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!newSymptomText.trim()) return;
    addSymptom(newSymptomText.trim());
    setNewSymptomText('');
  };

  const handleAddConditionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondName.trim()) return;
    addCondition(newCondName.trim(), newCondIcd.trim());
    setNewCondName('');
    setNewCondIcd('');
    setShowAddCondModal(false);
  };

  const handleAddMedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    addMedication(newMedName.trim(), newMedDosage.trim() || 'Standard Dose', newMedFreq.trim() || 'Daily', newMedCategory);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedFreq('');
    setShowAddMedModal(false);
  };

  const handleAddAllergySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergyAgent.trim()) return;
    addAllergy(newAllergyAgent.trim(), newAllergySeverity, newAllergyReaction.trim() || 'Cutaneous reaction');
    setNewAllergyAgent('');
    setNewAllergyReaction('');
    setShowAddAllergyModal(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Ambient Glow */}
      <div className="relative w-full">
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-20 left-10 w-72 h-48 bg-secondary-fixed/15 rounded-full blur-2xl pointer-events-none -z-10"></div>

        {/* Header & Context Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs mb-space-xxs">
              <span className="material-symbols-outlined text-primary text-title-sm">badge</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Clinical Encounter File</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Patient Details</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xxs">
              Enter or update comprehensive patient demographic, diagnostic baseline, and active pharmaceutical regimens.
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start md:self-auto shrink-0">
            <div className="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>Draft auto-saved</span>
            </div>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-space-xs h-9 px-space-md rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-label-md text-label-md shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-title-sm">
                {isSaving ? 'progress_activity' : saveSuccess ? 'check' : 'check_circle'}
              </span>
              <span>{isSaving ? 'Saving Dossier...' : saveSuccess ? 'Synchronized!' : 'Save Patient'}</span>
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg md:p-space-xl mb-space-xl">
          {/* SECTION 1: Patient Demographics */}
          <section className="flex flex-col gap-space-lg">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-title-md">person</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight">Patient Demographics</h2>
                  <p className="font-label-sm text-label-sm text-outline">Essential identity & biological identifiers</p>
                </div>
              </div>
              <span className="px-space-sm py-space-xxs rounded-full bg-surface-container text-primary font-label-sm text-label-sm">
                MRN: {selectedPatient.mrn}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
              {/* Full Name */}
              <div className="md:col-span-6 flex flex-col gap-space-xxs">
                <label className="font-title-sm text-title-sm text-on-surface" htmlFor="fullName">
                  Full Legal Name <span className="text-error">*</span>
                </label>
                <input
                  className="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all"
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <span className="font-label-sm text-label-sm text-outline">Matches primary government-issued health credential</span>
              </div>

              {/* Age */}
              <div className="md:col-span-3 flex flex-col gap-space-xxs">
                <label className="font-title-sm text-title-sm text-on-surface" htmlFor="patientAge">
                  Age
                </label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-11 pl-space-md pr-14 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all"
                    id="patientAge"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                  <span className="absolute right-3 font-label-sm text-label-sm text-outline pointer-events-none">Years</span>
                </div>
                <span className="font-label-sm text-label-sm text-outline">DOB: {selectedPatient.dob}</span>
              </div>

              {/* Biological Sex */}
              <div className="md:col-span-3 flex flex-col gap-space-xxs">
                <label className="font-title-sm text-title-sm text-on-surface" htmlFor="biologicalSex">
                  Biological Sex
                </label>
                <select
                  className="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all"
                  id="biologicalSex"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Intersex">Intersex</option>
                  <option value="Undisclosed">Prefer not to say</option>
                </select>
                <span className="font-label-sm text-label-sm text-outline">Referenced in clinical lab index ranges</span>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-surface-container-high/40 my-space-xl"></div>

          {/* SECTION 2: Clinical Profile & Tags */}
          <section className="flex flex-col gap-space-lg">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-title-md">vital_signs</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight">Clinical History & Indicators</h2>
                <p className="font-label-sm text-label-sm text-outline">Symptomatology, established diagnoses, and sensitivity tags</p>
              </div>
            </div>

            {/* Reported Symptoms */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-title-sm text-title-sm text-on-surface flex items-center justify-between">
                <span>Reported Symptoms</span>
                <span className="font-label-sm text-label-sm text-outline">
                  {selectedPatient.symptoms.length} Active Recorded
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-space-xs p-space-sm rounded-xl bg-surface-container-low min-h-[52px]">
                {selectedPatient.symptoms.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full bg-${s.color}`}></span>
                    <span>{s.name}</span>
                    <button
                      onClick={() => removeSymptom(s.id)}
                      className="text-outline hover:text-error transition-colors flex items-center ml-1"
                      title="Remove symptom"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </span>
                ))}

                <div className="inline-flex items-center gap-space-xs ml-space-xs">
                  <input
                    type="text"
                    value={newSymptomText}
                    onChange={(e) => setNewSymptomText(e.target.value)}
                    onKeyDown={handleAddSymptomSubmit}
                    placeholder="+ Add symptom tag..."
                    className="h-8 px-space-sm bg-transparent font-label-md text-label-md text-on-surface placeholder:text-outline focus:outline-none min-w-[160px]"
                  />
                  {newSymptomText && (
                    <button
                      onClick={handleAddSymptomSubmit}
                      className="text-xs bg-primary text-on-primary px-2 py-0.5 rounded-md"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Existing Conditions */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-title-sm text-title-sm text-on-surface flex items-center justify-between">
                <span>Existing Conditions & Diagnoses</span>
                <span className="font-label-sm text-label-sm text-outline">ICD-10 Categorized</span>
              </label>
              <div className="flex flex-wrap items-center gap-space-xs p-space-sm rounded-xl bg-surface-container-low min-h-[52px]">
                {selectedPatient.conditions.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-fixed/40 text-primary font-label-md text-label-md"
                  >
                    <span className="material-symbols-outlined text-sm">clinical_notes</span>
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-xs opacity-75 font-mono">({c.icd10})</span>
                    <button
                      onClick={() => removeCondition(c.id)}
                      className="text-primary hover:text-error transition-colors flex items-center ml-space-xxs"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setShowAddCondModal(true)}
                  className="inline-flex items-center gap-space-xxs h-8 px-space-sm rounded-lg text-primary hover:bg-surface-container transition-colors font-label-md text-label-md"
                  type="button"
                >
                  <span className="material-symbols-outlined text-title-sm">add</span>
                  <span>Add condition...</span>
                </button>
              </div>
            </div>

            {/* Allergies & Adverse Reactions */}
            <div className="flex flex-col gap-space-xs">
              <label className="font-title-sm text-title-sm text-on-surface flex items-center justify-between">
                <span className="flex items-center gap-space-xxs text-error">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span>Allergies & Adverse Reactions</span>
                </span>
                <span className="font-label-sm text-label-sm text-error font-medium">Critical Safety Alerts Active</span>
              </label>
              <div className="flex flex-wrap items-center gap-space-xs p-space-sm rounded-xl bg-error-container/40 min-h-[52px]">
                {selectedPatient.allergies.map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-lowest text-error font-label-md text-label-md shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <strong className="font-semibold">{a.agent}</strong>
                    <span className="text-xs text-on-surface-variant font-normal">({a.severity})</span>
                    <button
                      onClick={() => removeAllergy(a.id)}
                      className="text-outline hover:text-error transition-colors flex items-center ml-space-xxs"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setShowAddAllergyModal(true)}
                  className="inline-flex items-center gap-space-xxs h-8 px-space-sm rounded-lg text-error hover:bg-error-container transition-colors font-label-md text-label-md"
                  type="button"
                >
                  <span className="material-symbols-outlined text-title-sm">add</span>
                  <span>Add allergy...</span>
                </button>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-surface-container-high/40 my-space-xl"></div>

          {/* SECTION 3: Current Medications */}
          <section className="flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-title-md">prescriptions</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight">Current Medications & Regimen</h2>
                  <p className="font-label-sm text-label-sm text-outline">Synchronized pharmaceutical intake & prescription frequencies</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddMedModal(true)}
                className="inline-flex items-center gap-space-xs h-9 px-space-md rounded-lg bg-primary-fixed/40 text-primary hover:bg-primary-fixed transition-colors font-label-md text-label-md self-start sm:self-auto"
                type="button"
              >
                <span className="material-symbols-outlined text-title-sm">add</span>
                <span>Add Medication</span>
              </button>
            </div>

            {/* Medications List */}
            <div className="flex flex-col gap-space-xs mt-space-xs">
              {selectedPatient.medications.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all group gap-space-sm"
                >
                  <div className="flex items-start sm:items-center gap-space-md">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-title-md">pill</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-sm flex-wrap">
                        <span className="font-title-md text-title-md text-on-surface font-bold">{m.name}</span>
                        <span className="px-space-xs py-space-xxs rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold">
                          {m.dosage}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{m.frequency}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-space-md pl-14 sm:pl-0">
                    <span className="px-space-sm py-space-xxs rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                      {m.isPRN ? 'PRN (As Needed)' : 'Active Regimen'}
                    </span>
                    <button
                      onClick={() => removeMedication(m.id)}
                      className="p-space-xs text-on-surface-variant hover:text-error hover:bg-surface-container-lowest rounded-lg transition-colors"
                      title="Remove medication"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px w-full bg-surface-container-high/40 my-space-xl"></div>

          {/* SECTION 4: Additional Clinical Notes */}
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-title-md">edit_note</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight">Additional Clinical Notes & Observations</h2>
                  <p className="font-label-sm text-label-sm text-outline">Freeform physician impressions and longitudinal context</p>
                </div>
              </div>
              <div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-sm">markdown</span>
                <span>Markdown supported</span>
              </div>
            </div>
            <div className="flex flex-col">
              <textarea
                className="w-full p-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all resize-y min-h-[140px]"
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                rows={5}
              />
              <div className="flex items-center justify-between mt-space-xs px-space-xs font-label-sm text-label-sm text-outline">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-sm text-secondary">cloud_done</span>
                  <span>Encrypted local session cache active</span>
                </div>
                <span>{clinicalNotes.length} characters</span>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Pinned Footer Bar */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
            <span className="material-symbols-outlined text-title-sm text-primary">published_with_changes</span>
            <span>
              Last synchronized with hospital EHR registry:{' '}
              <strong className="text-on-surface font-title-sm">Oct 24, 2024 at 09:42 EST</strong>
            </span>
          </div>
          <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-space-xs h-10 px-space-lg rounded-lg bg-primary text-on-primary hover:bg-primary-container shadow-md transition-all font-title-sm text-title-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-title-sm">
                {isSaving ? 'progress_activity' : saveSuccess ? 'check' : 'save'}
              </span>
              <span>{isSaving ? 'Saving Dossier...' : saveSuccess ? 'Record Synchronized!' : 'Save Patient Record'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Condition Modal */}
      {showAddCondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <form onSubmit={handleAddConditionSubmit} className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Clinical Condition</h3>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Condition Name</label>
              <input
                type="text"
                required
                value={newCondName}
                onChange={(e) => setNewCondName(e.target.value)}
                placeholder="e.g. Type 2 Diabetes Mellitus"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">ICD-10 Code</label>
              <input
                type="text"
                value={newCondIcd}
                onChange={(e) => setNewCondIcd(e.target.value)}
                placeholder="e.g. E11.9"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCondModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-teal-800 text-white text-sm font-semibold">
                Add Condition
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <form onSubmit={handleAddMedicationSubmit} className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Prescribed Medication</h3>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Medication Name</label>
              <input
                type="text"
                required
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                placeholder="e.g. Metformin HCl"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Dosage</label>
              <input
                type="text"
                value={newMedDosage}
                onChange={(e) => setNewMedDosage(e.target.value)}
                placeholder="e.g. 500 mg Oral Tablet"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Frequency</label>
              <input
                type="text"
                value={newMedFreq}
                onChange={(e) => setNewMedFreq(e.target.value)}
                placeholder="e.g. Twice daily with meals"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMedModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-teal-800 text-white text-sm font-semibold">
                Save Medication
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Allergy Modal */}
      {showAddAllergyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <form onSubmit={handleAddAllergySubmit} className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Allergy Alert</h3>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Allergen / Agent</label>
              <input
                type="text"
                required
                value={newAllergyAgent}
                onChange={(e) => setNewAllergyAgent(e.target.value)}
                placeholder="e.g. Latex or Amoxicillin"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Severity</label>
              <select
                value={newAllergySeverity}
                onChange={(e) => setNewAllergySeverity(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              >
                <option value="Severe">Severe</option>
                <option value="Moderate">Moderate</option>
                <option value="Mild">Mild</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Observed Reaction</label>
              <input
                type="text"
                value={newAllergyReaction}
                onChange={(e) => setNewAllergyReaction(e.target.value)}
                placeholder="e.g. Urticaria, swelling"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddAllergyModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-red-700 text-white text-sm font-semibold">
                Add Allergy Alert
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
