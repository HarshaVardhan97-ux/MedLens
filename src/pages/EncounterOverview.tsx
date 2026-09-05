import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { useNavigate } from 'react-router-dom';

export const EncounterOverview: React.FC = () => {
  const {
    selectedPatient,
    updateVitals,
    updateEncounter,
    addSymptom,
    removeSymptom,
    addCondition,
    removeCondition,
    addAllergy,
    removeAllergy,
    addMedication,
    removeMedication,
    addNote,
  } = usePatient();

  const navigate = useNavigate();
  const [aiAdopted, setAiAdopted] = useState(false);
  const [aiDismissed, setAiDismissed] = useState(false);

  // Edit Encounter & Vitals Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [encounterNameInput, setEncounterNameInput] = useState(selectedPatient.activeEncounterName);
  const [encounterDateInput, setEncounterDateInput] = useState(selectedPatient.activeEncounterDate);
  const [attendingPhysicianInput, setAttendingPhysicianInput] = useState(selectedPatient.attendingPhysician);
  
  // Vitals form
  const [bpInput, setBpInput] = useState(selectedPatient.vitals.bp);
  const [pulseInput, setPulseInput] = useState(selectedPatient.vitals.pulse);
  const [spo2Input, setSpo2Input] = useState(selectedPatient.vitals.spo2);
  const [tempInput, setTempInput] = useState(selectedPatient.vitals.temp);
  const [bmiInput, setBmiInput] = useState(selectedPatient.vitals.bmi);

  // Quick Add Item States
  const [isAddSymptomOpen, setIsAddSymptomOpen] = useState(false);
  const [newSymptomName, setNewSymptomName] = useState('');

  const [isAddConditionOpen, setIsAddConditionOpen] = useState(false);
  const [newCondName, setNewCondName] = useState('');
  const [newCondIcd, setNewCondIcd] = useState('');

  const [isAddAllergyOpen, setIsAddAllergyOpen] = useState(false);
  const [newAllergyAgent, setNewAllergyAgent] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState<'Severe' | 'Moderate' | 'Mild'>('Moderate');
  const [newAllergyReaction, setNewAllergyReaction] = useState('');

  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedCat, setNewMedCat] = useState('');

  const handleOpenEditModal = () => {
    setEncounterNameInput(selectedPatient.activeEncounterName);
    setEncounterDateInput(selectedPatient.activeEncounterDate);
    setAttendingPhysicianInput(selectedPatient.attendingPhysician);
    setBpInput(selectedPatient.vitals.bp);
    setPulseInput(selectedPatient.vitals.pulse);
    setSpo2Input(selectedPatient.vitals.spo2);
    setTempInput(selectedPatient.vitals.temp);
    setBmiInput(selectedPatient.vitals.bmi);
    setIsEditModalOpen(true);
  };

  const handleSaveEditEncounter = (e: React.FormEvent) => {
    e.preventDefault();
    updateEncounter(encounterNameInput, encounterDateInput, attendingPhysicianInput);
    updateVitals({
      ...selectedPatient.vitals,
      bp: bpInput,
      pulse: Number(pulseInput) || 70,
      spo2: Number(spo2Input) || 99,
      temp: Number(tempInput) || 98.6,
      bmi: Number(bmiInput) || 22.0,
    });
    setIsEditModalOpen(false);
  };

  const handleAdoptAiNote = () => {
    addNote(
      'AI Clinical Synthesis Adoption',
      'Progress Note',
      `[AI Synthesis Adopted]: Potential Drug Interaction noted between Ferrous Sulfate and Levothyroxine. Recommend separation interval ≥ 4 hours. Celiac serology (tTG-IgA) recommended if low ferritin persists.`,
      ['#AISynthesis', '#DrugInteraction'],
      selectedPatient.attendingPhysician
    );
    setAiAdopted(true);
    setTimeout(() => setAiAdopted(false), 3000);
  };

  const handleAddSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymptomName.trim()) return;
    addSymptom(newSymptomName.trim());
    setNewSymptomName('');
    setIsAddSymptomOpen(false);
  };

  const handleAddConditionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCondName.trim()) return;
    addCondition(newCondName.trim(), newCondIcd.trim() || 'R68.89');
    setNewCondName('');
    setNewCondIcd('');
    setIsAddConditionOpen(false);
  };

  const handleAddAllergySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergyAgent.trim()) return;
    addAllergy(newAllergyAgent.trim(), newAllergySeverity, newAllergyReaction.trim() || 'Hives / Rash');
    setNewAllergyAgent('');
    setNewAllergyReaction('');
    setIsAddAllergyOpen(false);
  };

  const handleAddMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    addMedication(newMedName.trim(), newMedDosage.trim() || '10mg', newMedFreq.trim() || 'Daily', newMedCat.trim() || 'General');
    setNewMedName('');
    setNewMedDosage('');
    setNewMedFreq('');
    setNewMedCat('');
    setIsAddMedOpen(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Demographic & Encounter Status Canvas */}
      <section className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm mb-space-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Left: Identity & Key Biometrics */}
          <div className="flex items-start gap-space-base">
            <div className="w-14 h-14 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-headline-md text-headline-md font-bold shadow-sm">
              {selectedPatient.initials}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-space-sm">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  {selectedPatient.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Active Encounter • {selectedPatient.activeEncounterName}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-1 text-on-surface-variant font-body-sm text-body-sm">
                <span>
                  <strong className="text-on-surface font-title-sm">{selectedPatient.age} yrs</strong>, {selectedPatient.gender}
                </span>
                <span className="text-outline-variant">•</span>
                <span>DOB: {selectedPatient.dob}</span>
                <span className="text-outline-variant">•</span>
                <span>
                  MRN: <strong className="text-on-surface font-title-sm">{selectedPatient.mrn}</strong>
                </span>
                <span className="text-outline-variant">•</span>
                <span>
                  Blood Group: <span className="px-1.5 py-0.2 rounded bg-surface-container font-title-sm text-on-surface">{selectedPatient.bloodGroup}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Encounter Details & Fast Actions */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-title-sm text-secondary">calendar_today</span>
              <span>{selectedPatient.activeEncounterDate}</span>
            </div>
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-title-sm text-primary">stethoscope</span>
              <span>Attending: {selectedPatient.attendingPhysician}</span>
            </div>
            <div className="flex items-center gap-space-sm mt-1">
              <button
                onClick={handleOpenEditModal}
                className="h-9 px-space-md rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md inline-flex items-center gap-space-xs transition-colors shadow-sm cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-title-sm">edit</span>
                <span>Edit Encounter & Vitals</span>
              </button>
              <button
                onClick={() => navigate('/patient')}
                className="h-9 px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md inline-flex items-center gap-space-xs transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-title-sm">person</span>
                <span>Patient File</span>
              </button>
              <button
                onClick={() => window.print()}
                className="h-9 px-space-md rounded-lg bg-surface-container-lowest border border-surface-container hover:bg-surface-container-low text-on-surface font-label-md text-label-md inline-flex items-center gap-space-xs transition-all shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-title-sm">print</span>
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vital Signs Band */}
      <section className="w-full mb-space-lg">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Real-Time Vitals Monitor</span>
          <button
            onClick={handleOpenEditModal}
            className="text-primary hover:underline font-label-sm text-label-sm flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-sm">edit_note</span>
            <span>Update Vitals</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-space-md">
          {/* Blood Pressure */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Blood Pressure</span>
              <span className="material-symbols-outlined text-secondary text-title-sm">vital_signs</span>
            </div>
            <div className="mt-space-sm">
              <div className="font-headline-md text-headline-md font-bold text-on-surface">{selectedPatient.vitals.bp}</div>
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {selectedPatient.vitals.bpStatus}
              </span>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Resting Pulse</span>
              <span className="material-symbols-outlined text-primary text-title-sm">favorite</span>
            </div>
            <div className="mt-space-sm">
              <div className="font-headline-md text-headline-md font-bold text-on-surface">
                {selectedPatient.vitals.pulse} <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">bpm</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {selectedPatient.vitals.pulseStatus}
              </span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Oxygen (SpO2)</span>
              <span className="material-symbols-outlined text-tertiary-container text-title-sm">air</span>
            </div>
            <div className="mt-space-sm">
              <div className="font-headline-md text-headline-md font-bold text-on-surface">{selectedPatient.vitals.spo2}%</div>
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {selectedPatient.vitals.spo2Status}
              </span>
            </div>
          </div>

          {/* Temp */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Temperature</span>
              <span className="material-symbols-outlined text-secondary text-title-sm">thermostat</span>
            </div>
            <div className="mt-space-sm">
              <div className="font-headline-md text-headline-md font-bold text-on-surface">
                {selectedPatient.vitals.temp} <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">°F</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {selectedPatient.vitals.tempStatus}
              </span>
            </div>
          </div>

          {/* Body Mass Index */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between col-span-2 md:col-span-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Body Mass Index</span>
              <span className="material-symbols-outlined text-primary text-title-sm">straighten</span>
            </div>
            <div className="mt-space-sm">
              <div className="font-headline-md text-headline-md font-bold text-on-surface">
                {selectedPatient.vitals.bmi} <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">kg/m²</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {selectedPatient.vitals.bmiStatus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Clinical Core Architecture */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg mb-space-lg">
        {/* LEFT PANE: Symptoms, Conditions, Allergies (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-space-lg">
          {/* Key Symptoms Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary">clinical_notes</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Reported Symptoms</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddSymptomOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-primary-container text-on-primary font-label-sm hover:bg-primary transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-title-sm">add</span>
                  <span>Add Symptom</span>
                </button>
                <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                  {selectedPatient.symptoms.length} Logged Findings
                </span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Chief complaint noted during intake: Symptoms persistent over recent clinical interval.
            </p>
            <div className="flex flex-wrap gap-space-sm">
              {selectedPatient.symptoms.map((s) => (
                <div
                  key={s.id}
                  className="px-space-md py-space-xs rounded-lg bg-surface-container-low text-on-surface flex items-center gap-space-xs font-title-sm text-title-sm shadow-sm group"
                >
                  <span className={`w-2 h-2 rounded-full bg-teal-600`}></span>
                  <span>{s.name}</span>
                  <span className="font-label-sm text-label-sm text-outline ml-1">{s.severity}</span>
                  <button
                    onClick={() => removeSymptom(s.id)}
                    className="ml-1 text-outline hover:text-error transition-colors p-0.5 rounded"
                    title="Remove symptom"
                  >
                    <span className="material-symbols-outlined text-title-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnosed Conditions Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary">diagnosis</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Diagnosed Conditions</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddConditionOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-primary-container text-on-primary font-label-sm hover:bg-primary transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-title-sm">add</span>
                  <span>Add Condition</span>
                </button>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">EHR Synced</span>
              </div>
            </div>
            <div className="flex flex-col gap-space-sm">
              {selectedPatient.conditions.map((c) => (
                <div key={c.id} className="p-space-md rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-xs group">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">{c.name}</span>
                      <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">
                        ICD-10: {c.icd10}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{c.description}</span>
                  </div>
                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 px-space-sm py-space-xxs rounded-full font-label-sm text-label-sm ${
                        c.statusType === 'refractory'
                          ? 'bg-surface-container text-error'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.statusType === 'refractory' ? 'bg-error' : 'bg-secondary'
                        }`}
                      ></span>{' '}
                      {c.status}
                    </span>
                    <button
                      onClick={() => removeCondition(c.id)}
                      className="text-outline hover:text-error transition-colors p-1 rounded"
                      title="Delete Condition"
                    >
                      <span className="material-symbols-outlined text-title-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-error">warning</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Allergies & Adverse Reactions</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddAllergyOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-primary-container text-on-primary font-label-sm hover:bg-primary transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-title-sm">add</span>
                  <span>Add Allergy</span>
                </button>
                <span className="font-label-sm text-label-sm text-outline">Verified</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {selectedPatient.allergies.map((a) => (
                <div
                  key={a.id}
                  className={`p-space-md rounded-lg flex flex-col justify-between ${
                    a.severity === 'Severe' ? 'bg-error-container/40' : 'bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span
                        className={`material-symbols-outlined text-title-sm ${
                          a.severity === 'Severe' ? 'text-error' : 'text-tertiary-container'
                        }`}
                      >
                        {a.severity === 'Severe' ? 'dangerous' : 'flip_camera_ios'}
                      </span>
                      <span className="font-title-sm text-title-sm text-on-surface font-bold">{a.agent}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                          a.severity === 'Severe' ? 'bg-error text-on-error' : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {a.severity}
                      </span>
                      <button
                        onClick={() => removeAllergy(a.id)}
                        className="text-outline hover:text-error transition-colors p-0.5"
                        title="Remove Allergy"
                      >
                        <span className="material-symbols-outlined text-title-sm">close</span>
                      </button>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface mt-space-xs">
                    <strong>Reaction:</strong> {a.reaction}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low text-on-surface-variant font-label-md text-label-md flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-title-sm text-secondary">check_circle</span>
              <span>All active allergic reactions updated and verified in clinical dossier.</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Active Regimens & Absorption Alert (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-space-lg">
          {/* Current Medications Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary">prescriptions</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Active Regimen</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddMedOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-primary-container text-on-primary font-label-sm hover:bg-primary transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-title-sm">add</span>
                    <span>Add Rx</span>
                  </button>
                  <span className="font-label-sm text-label-sm text-outline">
                    {selectedPatient.medications.length} Prescribed
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-space-md">
                {selectedPatient.medications.map((m) => (
                  <div key={m.id} className="p-space-md rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-title-sm text-title-sm font-bold text-on-surface">{m.name}</h3>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">{m.dosage}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                          {m.isPRN ? 'PRN (As Needed)' : `${m.adherencePercent || 95}% Adherent`}
                        </span>
                        <button
                          onClick={() => removeMedication(m.id)}
                          className="text-outline hover:text-error transition-colors p-0.5 rounded"
                          title="Remove Medication"
                        >
                          <span className="material-symbols-outlined text-title-sm">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-space-xs pt-space-xs flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-body-sm text-secondary">schedule</span>{' '}
                        {m.frequency}
                      </span>
                      <span className="text-primary font-medium">{m.category}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chelation warning callout for Eleanor Vance */}
              {selectedPatient.name.includes('Eleanor') && (
                <div className="mt-space-md p-space-md rounded-lg bg-surface-container-high text-on-surface flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-title-md text-tertiary-container shrink-0 mt-0.5">
                    priority_high
                  </span>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm font-bold">Pharmacokinetic Chelation Risk</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                      Oral ferrous sulfate chelates with levothyroxine in the GI lumen, creating insoluble compounds that attenuate absorption by up to 40%. Ensure a separation interval ≥ 4 hours.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-space-md pt-space-md flex items-center justify-between text-outline font-label-sm text-label-sm border-t border-surface-container">
              <span>Pharmacy: Walgreens #4102</span>
              <span>Last Fill: 12-Oct-2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* MedLens AI Clinical Synthesis Card */}
      {!aiDismissed && (
        <section className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-title-sm text-secondary">psychology</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">MedLens AI Clinical Synthesis</h2>
                <span className="font-label-sm text-label-sm text-outline">Real-time Cross-Correlated Encounter Insight</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="px-space-sm py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Assistive Clinical Note
              </span>
            </div>
          </div>

          {/* AI Findings Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-md">
            {selectedPatient.aiInsight.findings.map((f, i) => (
              <div key={i} className="p-space-md rounded-lg bg-surface-container-low flex items-start gap-space-sm">
                <div className="p-space-xs rounded bg-surface-container text-secondary shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-title-sm">
                    {f.type === 'interaction' ? 'sync_problem' : 'lab_profile'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">{f.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions & Verification Disclaimer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pt-space-sm">
            <p className="font-label-sm text-label-sm text-outline flex items-center gap-1.5">
              <span className="material-symbols-outlined text-body-sm text-outline">verified</span>
              {selectedPatient.aiInsight.disclaimer}
            </p>
            <div className="flex items-center gap-space-sm self-end sm:self-auto">
              <button
                onClick={() => setAiDismissed(true)}
                className="h-9 px-space-md rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors font-label-md text-label-md"
                type="button"
              >
                Dismiss
              </button>
              <button
                onClick={handleAdoptAiNote}
                className="h-9 px-space-md rounded-lg bg-primary-container hover:bg-primary text-on-primary transition-all font-label-md text-label-md flex items-center gap-space-xs shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-title-sm">post_add</span>
                <span>{aiAdopted ? 'Adopted into Notes!' : 'Adopt into Clinical Notes'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* EDIT ENCOUNTER & VITALS MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-150 border border-outline-variant/30">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-headline-sm">edit_square</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Edit Encounter & Vitals</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-outline hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEditEncounter} className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-title-sm text-title-sm text-primary font-semibold">Encounter Metadata</h4>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Encounter Title / Purpose</label>
                  <input
                    type="text"
                    value={encounterNameInput}
                    onChange={(e) => setEncounterNameInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Encounter Date / Time</label>
                    <input
                      type="text"
                      value={encounterDateInput}
                      onChange={(e) => setEncounterDateInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Attending Physician</label>
                    <input
                      type="text"
                      value={attendingPhysicianInput}
                      onChange={(e) => setAttendingPhysicianInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-surface-container">
                <h4 className="font-title-sm text-title-sm text-primary font-semibold">Vital Signs Intake</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Blood Pressure (mmHg)</label>
                    <input
                      type="text"
                      value={bpInput}
                      onChange={(e) => setBpInput(e.target.value)}
                      placeholder="118/76"
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Pulse (bpm)</label>
                    <input
                      type="number"
                      value={pulseInput}
                      onChange={(e) => setPulseInput(Number(e.target.value))}
                      placeholder="68"
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">SpO2 (%)</label>
                    <input
                      type="number"
                      value={spo2Input}
                      onChange={(e) => setSpo2Input(Number(e.target.value))}
                      placeholder="99"
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempInput}
                      onChange={(e) => setTempInput(Number(e.target.value))}
                      placeholder="98.4"
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">BMI (kg/m²)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={bmiInput}
                      onChange={(e) => setBmiInput(Number(e.target.value))}
                      placeholder="22.4"
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary text-on-primary font-title-sm hover:bg-primary-container transition-colors shadow-sm"
                >
                  Save Encounter Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD SYMPTOM MODAL */}
      {isAddSymptomOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Add Reported Symptom</h3>
            <form onSubmit={handleAddSymptomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Symptom Description</label>
                <input
                  type="text"
                  value={newSymptomName}
                  onChange={(e) => setNewSymptomName(e.target.value)}
                  placeholder="e.g. Fatigue, Palpitations, Nausea"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddSymptomOpen(false)} className="px-4 py-2 rounded-lg text-on-surface-variant">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-on-primary font-title-sm">Add Symptom</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD CONDITION MODAL */}
      {isAddConditionOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Add Diagnosed Condition</h3>
            <form onSubmit={handleAddConditionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Condition Name</label>
                <input
                  type="text"
                  value={newCondName}
                  onChange={(e) => setNewCondName(e.target.value)}
                  placeholder="e.g. Hashimoto Thyroiditis, Type 2 Diabetes"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">ICD-10 Code</label>
                <input
                  type="text"
                  value={newCondIcd}
                  onChange={(e) => setNewCondIcd(e.target.value)}
                  placeholder="e.g. E06.3"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddConditionOpen(false)} className="px-4 py-2 rounded-lg text-on-surface-variant">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-on-primary font-title-sm">Save Condition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD ALLERGY MODAL */}
      {isAddAllergyOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Add Allergy & Reaction</h3>
            <form onSubmit={handleAddAllergySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Allergen / Agent</label>
                <input
                  type="text"
                  value={newAllergyAgent}
                  onChange={(e) => setNewAllergyAgent(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa, Latex"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Severity</label>
                  <select
                    value={newAllergySeverity}
                    onChange={(e) => setNewAllergySeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  >
                    <option value="Severe">Severe</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Mild">Mild</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Reaction</label>
                  <input
                    type="text"
                    value={newAllergyReaction}
                    onChange={(e) => setNewAllergyReaction(e.target.value)}
                    placeholder="Anaphylaxis, Rash, Nausea"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddAllergyOpen(false)} className="px-4 py-2 rounded-lg text-on-surface-variant">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-on-primary font-title-sm">Add Allergy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD MEDICATION MODAL */}
      {isAddMedOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Add Medication to Regimen</h3>
            <form onSubmit={handleAddMedSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Medication Name</label>
                <input
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Metformin, Atorvastatin"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    placeholder="e.g. 500mg Oral Tablet"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Frequency</label>
                  <input
                    type="text"
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    placeholder="e.g. Twice Daily with Meals"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Specialty Category</label>
                <input
                  type="text"
                  value={newMedCat}
                  onChange={(e) => setNewMedCat(e.target.value)}
                  placeholder="e.g. Endocrine, Cardiology"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddMedOpen(false)} className="px-4 py-2 rounded-lg text-on-surface-variant">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-on-primary font-title-sm">Add Medication</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

