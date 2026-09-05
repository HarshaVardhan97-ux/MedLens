import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import { PatientSelectorModal } from './PatientSelectorModal';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, isDemo, logout } = useAuth();
  const { selectedPatient } = usePatient();
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedPatient, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medlens_${selectedPatient.name.replace(/\s+/g, '_')}_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-24 w-full px-layout-gutter lg:px-space-lg flex flex-col justify-between pt-space-xs pb-space-xxs">
          <div className="flex items-center justify-between gap-space-md h-14">
            {/* Brand Logo & Version/Demo Badge */}
            <div className="flex items-center gap-space-md min-w-max">
              <div 
                onClick={() => navigate('/dashboard')} 
                className="cursor-pointer flex items-center gap-2"
              >
                <img
                  alt="MedLens Logo"
                  className="h-8 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VNOu26Eg87yOX2ultEeHiY5SEqhBO-N-_Fpip4AUKDcfha60jj59I-fMz5vRkeacWKvBg2ZaBJih40qONLTCB1MjCOS6QRuSyoCOgeCycE3lZXdmDWsDEnx9t-nltMCccPrs1QFAHOuicqKKJYYjThqq1mVhGPztJrX7ip0IXs0QOuqcQ8rCeDUmC1xxVbcpfEYt7Pl2B99jC_CX1_6DL_gSOXceXGRMvR8AzlkTz5wNS3nF6QD0LvMqwF"
                />
                <span className="font-headline-md text-headline-md font-bold tracking-tight text-primary hidden sm:inline-block">
                  MedLens
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-space-sm py-space-xxs rounded-full bg-surface-container text-primary font-label-sm text-label-sm uppercase tracking-wider">
                  AI Clinical Insight v2.4
                </span>
                {isDemo && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 font-label-sm text-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    DEMO MODE
                  </span>
                )}
              </div>
            </div>

            {/* Active Encounter Patient Selector Bar */}
            <button
              onClick={() => setIsPatientModalOpen(true)}
              className="hidden md:flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer border border-transparent hover:border-outline-variant/40"
              title="Click to switch patient"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                <strong className="text-on-surface font-title-sm">Active Encounter:</strong>{' '}
                {selectedPatient.name} (DOB: {selectedPatient.dob} | MRN {selectedPatient.mrn})
              </span>
              <span className="material-symbols-outlined text-title-sm text-outline">swap_horiz</span>
            </button>

            {/* Actions & User Menu */}
            <div className="flex items-center gap-space-sm">
              <button
                onClick={() => setIsPatientModalOpen(true)}
                className="md:hidden p-2 rounded-lg text-primary bg-surface-container-low font-label-sm flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-title-sm">person_search</span>
              </button>

              <button
                onClick={handleExportJson}
                className="hidden sm:inline-flex items-center h-9 px-space-md rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-label-md text-label-md"
                type="button"
              >
                Export JSON
              </button>

              <button
                onClick={handleExportPdf}
                className="inline-flex items-center gap-space-xs h-9 px-space-md rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                type="button"
              >
                <span className="material-symbols-outlined text-title-sm">picture_as_pdf</span>
                <span className="hidden sm:inline">Export PDF</span>
              </button>

              <button
                aria-label="Notifications"
                className="relative p-space-xs text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-low transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative pl-space-xs">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-space-sm rounded-lg p-space-xs hover:bg-surface-container-low transition-colors text-left focus:outline-none cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-title-sm text-title-sm font-semibold">
                    {user?.avatarInitials || 'AK'}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="font-title-sm text-title-sm leading-tight text-on-surface">
                      {user?.name || 'Alex Kumar'}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {user?.role || 'Clinical Specialist'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-title-sm text-on-surface-variant ml-1">
                    expand_more
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 rounded-xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-outline-variant/30 py-1.5 z-50 flex flex-col">
                    <div className="px-4 py-2 border-b border-surface-container">
                      <p className="font-title-sm text-title-sm text-on-surface font-semibold">
                        {user?.name || 'Alex Kumar'}
                      </p>
                      <p className="font-label-sm text-label-sm text-outline truncate">
                        {user?.email || 'alex.kumar@hospital.org'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsPatientModalOpen(true);
                      }}
                      className="flex items-center gap-space-xs px-space-md py-space-xs text-body-sm text-on-surface hover:bg-surface-container-low transition-colors text-left w-full"
                    >
                      <span className="material-symbols-outlined text-title-sm text-on-surface-variant">
                        person_search
                      </span>
                      <span>Switch Patient</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/patient');
                      }}
                      className="flex items-center gap-space-xs px-space-md py-space-xs text-body-sm text-on-surface hover:bg-surface-container-low transition-colors text-left w-full"
                    >
                      <span className="material-symbols-outlined text-title-sm text-on-surface-variant">
                        person
                      </span>
                      <span>Profile / Patient File</span>
                    </button>

                    <div className="h-px bg-outline-variant/30 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-space-xs px-space-md py-space-xs text-body-sm text-error hover:bg-error-container/40 transition-colors text-left w-full"
                    >
                      <span className="material-symbols-outlined text-title-sm text-error">logout</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ticker bar disclaimer */}
          <div className="h-7 w-full flex items-center px-space-sm rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="material-symbols-outlined text-title-sm text-primary mr-space-xs">bolt</span>
            <p className="truncate">
              MedLens Clinical AI is an investigative decision-support tool. All extracted laboratory parameters, summaries, and suggestions must be verified against certified hospital EHR records by a licensed practitioner.
            </p>
          </div>
        </div>
      </header>

      {/* Patient Selector Modal */}
      <PatientSelectorModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
      />
    </>
  );
};
