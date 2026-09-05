import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { aiService, AiQueryResult } from '../services/aiService';

export const AiInsights: React.FC = () => {
  const { selectedPatient, addNote } = usePatient();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [queryInput, setQueryInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<AiQueryResult | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(selectedPatient.aiInsight.narrativeSummary);
    showToast('Summary copied to clipboard');
  };

  const handleListen = () => {
    showToast('Audio playback started (Patient Speech Mode)');
  };

  const handleAddToNotes = () => {
    addNote(
      'AI Clinical Insights Adopted',
      'Progress Note',
      `[AI Synthesis]: ${selectedPatient.aiInsight.narrativeSummary}`,
      ['#AISynthesis', '#CarePlan'],
      selectedPatient.attendingPhysician
    );
    showToast('Synthesized summary added to Attending Clinical Notes');
  };

  const handleRunQuery = async (customPrompt?: string) => {
    const promptToUse = customPrompt || queryInput;
    if (!promptToUse.trim()) return;

    setIsQuerying(true);
    setQueryInput(promptToUse);
    try {
      const res = await aiService.queryPatientAi(selectedPatient, promptToUse);
      setQueryResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-space-2xl">
      {/* Patient Context Banner */}
      <section className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
          <div className="flex items-start sm:items-center gap-space-md min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary font-headline-md text-headline-md font-bold">
                {selectedPatient.initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary ring-2 ring-surface-container-lowest flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px] text-on-secondary font-bold">check</span>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-x-space-sm gap-y-space-xxs">
                <h1 className="font-headline-md text-headline-md text-on-surface truncate">{selectedPatient.name}</h1>
                <span className="font-label-sm text-label-sm px-space-xs py-space-xxs rounded bg-surface-container-low text-on-surface-variant font-medium">
                  {selectedPatient.age} yrs
                </span>
                <span className="font-label-sm text-label-sm px-space-xs py-space-xxs rounded bg-surface-container-low text-on-surface-variant font-medium">
                  {selectedPatient.gender}
                </span>
                <span className="font-label-sm text-label-sm font-mono text-outline">MRN {selectedPatient.mrn}</span>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm mt-space-xxs">
                <span className="flex items-center gap-space-xxs">
                  <span className="material-symbols-outlined text-[16px] text-secondary">calendar_today</span>
                  Encounter: {selectedPatient.activeEncounterDate.split('•')[0]}
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-space-xxs">
                  <span className="material-symbols-outlined text-[16px] text-secondary">stethoscope</span>
                  {selectedPatient.attendingPhysician}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-sm self-start lg:self-center">
            <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-secondary-container text-on-secondary-container shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-md text-label-md font-medium tracking-tight">AI Synthesis Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Central Insight Block & Interactive Assistant */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Main AI Synthesis Card (8 Cols) */}
        <div className="xl:col-span-8 flex flex-col gap-space-lg">
          <article className="bg-surface-container-lowest rounded-xl p-space-lg lg:p-space-xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-bl from-primary-fixed/30 via-secondary-container/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Card Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md mb-space-md border-b border-surface-container/60">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                    AI-Generated Summary
                  </h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-space-xxs mt-0.5">
                    <span>{selectedPatient.aiInsight.generatedAt}</span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-primary font-medium">{selectedPatient.aiInsight.modelEngine}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-space-xs">
                <button
                  onClick={handleListen}
                  className="inline-flex items-center gap-space-xxs px-space-sm py-space-xs rounded-lg text-primary hover:bg-surface-container-low transition-colors font-label-md text-label-md"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                  <span>Listen</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-space-xxs px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-label-md text-label-md"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  <span>Copy</span>
                </button>
              </div>
            </header>

            {/* Summary Narrative */}
            <div className="bg-surface-container-low/60 rounded-xl p-space-lg mb-space-lg">
              <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                {selectedPatient.aiInsight.narrativeSummary}
              </p>
            </div>

            {/* Takeaways */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {selectedPatient.aiInsight.takeaways.map((t, idx) => (
                <div key={idx} className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-surface-container">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mb-space-sm">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                    </div>
                    <h3 className="font-title-sm text-title-sm text-on-surface font-semibold mb-space-xs">{t.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-normal">
                      {t.description}
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-xs flex items-center text-primary font-label-sm text-label-sm font-semibold gap-1">
                    <span>{t.badge}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Prominent Safety Disclaimer */}
            <div className="mt-space-lg rounded-xl bg-surface-container-low p-space-md flex flex-col sm:flex-row items-start gap-space-md">
              <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-container shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-space-xs mb-space-xxs">
                  <h4 className="font-title-sm text-title-sm text-on-surface font-bold">This is not a medical diagnosis or treatment advice.</h4>
                  <span className="px-space-xs py-space-xxs rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold shadow-xs">
                    Clinically reviewed baseline • HIPAA Compliant
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {selectedPatient.aiInsight.disclaimer} Always consult {selectedPatient.attendingPhysician} before modifying any treatment regimen.
                </p>
              </div>
            </div>
          </article>

          {/* Interactive AI Assistant Query Section */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-title-md">forum</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Interactive AI Clinical Query</h3>
            </div>

            {/* Preset Query Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                'Summarize this patient.',
                'What changed since the previous encounter?',
                'Explain the abnormal lab results.',
                'Summarize the recent imaging.',
              ].map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleRunQuery(promptText)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-on-surface font-label-sm transition-all text-left"
                >
                  {promptText}
                </button>
              ))}
            </div>

            {/* Query Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunQuery();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask MedLens AI a custom clinical question..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={isQuerying}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-title-sm hover:bg-primary-container transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-title-sm">send</span>
                <span>{isQuerying ? 'Analyzing...' : 'Ask AI'}</span>
              </button>
            </form>

            {/* Response Output */}
            {queryResult && (
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-teal-900">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-teal-700">smart_toy</span>
                    <span>AI Generated Answer ({queryResult.model})</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-200/70 text-teal-900">{queryResult.confidence} Confidence</span>
                </div>
                <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                  {queryResult.answer}
                </div>
                <div className="text-[11px] text-teal-700 font-medium pt-1 border-t border-teal-200/40 flex justify-between">
                  <span>Data Sources Used: {queryResult.sourceDataUsed.join(', ')}</span>
                  <span>{queryResult.disclaimer}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <footer className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-secondary text-[20px]">lock</span>
              <span>Encrypted under {selectedPatient.name}’s secure EHR profile</span>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm w-full sm:w-auto justify-end">
              <button
                onClick={() => window.print()}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-space-xs h-9 px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-all font-label-md text-label-md"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Summary</span>
              </button>
              <button
                onClick={() => showToast(`Summary shared with ${selectedPatient.name}'s Care Team`)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-space-xs h-9 px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-all font-label-md text-label-md"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                <span>Share Care Team</span>
              </button>
              <button
                onClick={handleAddToNotes}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-space-xs h-9 px-space-md rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all font-label-md text-label-md shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">note_add</span>
                <span>Add to Clinical Notes</span>
              </button>
            </div>
          </footer>
        </div>

        {/* Side Rail (4 Cols) */}
        <aside className="xl:col-span-4 flex flex-col gap-space-lg">
          {/* Care Team Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-container">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Care Team Oversight</span>
              <span className="font-label-sm text-label-sm text-secondary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Assigned
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-lg">
                SJ
              </div>
              <div>
                <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">{selectedPatient.attendingPhysician}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{selectedPatient.department}</p>
                <p className="font-label-sm text-label-sm text-outline mt-space-xxs">Active Encounter Synced</p>
              </div>
            </div>
          </div>

          {/* Observations Timeline Chart */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Observations Timeline</span>
              <span className="font-label-sm text-label-sm text-primary font-medium">30-Day Window</span>
            </div>
            <h4 className="font-title-sm text-title-sm text-on-surface font-semibold mb-space-xxs">Nutrient & Biomarker Trajectory</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Estimated metabolic stability index after interval rescheduling.</p>

            <div className="w-full bg-surface-container-low rounded-lg p-space-sm">
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mb-space-xs">
                <span>Interval Offset</span>
                <span className="text-primary font-bold">+42% Absorption Est.</span>
              </div>
              <svg className="w-full h-16 text-primary overflow-visible" viewBox="0 0 280 70">
                <defs>
                  <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#115E59" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#115E59" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 52 C 40 50, 70 42, 110 38 C 150 34, 190 20, 240 14 C 260 11, 275 8, 280 7 L 280 70 L 0 70 Z" fill="url(#areaGrad)" />
                <path d="M 0 52 C 40 50, 70 42, 110 38 C 150 34, 190 20, 240 14 C 260 11, 275 8, 280 7" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="110" cy="38" fill="#006A63" r="3.5" />
                <circle cx="280" cy="7" fill="#115E59" r="4" />
              </svg>
            </div>
          </div>
        </aside>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-lg shadow-lg flex items-center gap-space-sm animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
          <span className="font-body-sm text-body-sm">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
