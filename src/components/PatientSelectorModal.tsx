import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext';

interface PatientSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientSelectorModal: React.FC<PatientSelectorModalProps> = ({ isOpen, onClose }) => {
  const { patients, selectedPatient, setSelectedPatientId } = usePatient();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase()) ||
      p.attendingPhysician.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-surface-container flex items-center justify-between bg-surface-container-low/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Select Active Patient</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-title-md">close</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="p-4 border-b border-surface-container">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-title-sm text-outline">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient name, MRN, physician..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Patient List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-surface-container/50">
          {filteredPatients.map((p) => {
            const isSelected = p.id === selectedPatient.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPatientId(p.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'hover:bg-surface-container-low text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-title-md ${
                      isSelected
                        ? 'bg-on-primary text-primary'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    {p.initials}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-title-sm font-bold">{p.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {p.age} yrs • {p.gender}
                      </span>
                    </div>
                    <span
                      className={`text-xs ${
                        isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      MRN: {p.mrn} • Attending: {p.attendingPhysician}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="material-symbols-outlined text-title-md">check_circle</span>
                )}
              </button>
            );
          })}

          {filteredPatients.length === 0 && (
            <div className="p-6 text-center text-outline font-body-sm">
              No matching patient records found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-low border-t border-surface-container text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
