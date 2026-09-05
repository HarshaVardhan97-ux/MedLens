import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';

export const ClinicalNotes: React.FC = () => {
  const { selectedPatient, addNote } = usePatient();
  const { user } = useAuth();
  
  const [selectedNoteType, setSelectedNoteType] = useState('Progress Note');
  const [noteContent, setNoteContent] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [committedSuccess, setCommittedSuccess] = useState(false);

  const wordCount = noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0;
  const charCount = noteContent.length;

  const handleInsertLabRef = () => {
    const labSnippet = `\n[DIAGNOSTIC LABS: ${selectedPatient.labs
      .slice(0, 4)
      .map((l) => `${l.parameter} ${l.value} ${l.unit} (${l.statusLabel})`)
      .join(', ')}]\n`;
    setNoteContent((prev) => prev + labSnippet);
  };

  const handleInsertAiRef = () => {
    const aiSnippet = `\n[AI CLINICAL INSIGHT: ${selectedPatient.aiInsight.narrativeSummary}]\n`;
    setNoteContent((prev) => prev + aiSnippet);
  };

  const handleCommitNote = () => {
    if (!noteContent.trim()) return;
    const authorName = user?.name || selectedPatient.attendingPhysician;
    addNote(
      `${selectedNoteType} – ${selectedPatient.department}`,
      selectedNoteType,
      noteContent,
      ['#ClinicalNote', '#EHRCommitted'],
      authorName
    );
    setNoteContent('');
    setCommittedSuccess(true);
    setTimeout(() => setCommittedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-lg">
      {/* Patient Dossier Sub-Header Banner */}
      <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-base">
        <div className="flex flex-col md:flex-row md:items-center gap-space-md">
          <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary font-headline-md font-bold shrink-0">
            {selectedPatient.initials}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-space-xs">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                {selectedPatient.name}
              </h1>
              <span className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md px-space-sm py-0.5 rounded-full">
                {selectedPatient.age} yrs • {selectedPatient.gender}
              </span>
              <span className="bg-surface-container-low text-primary font-label-md text-label-md px-space-sm py-0.5 rounded-full font-semibold">
                MRN {selectedPatient.mrn}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-space-md gap-y-space-xxs text-on-surface-variant font-body-sm text-body-sm mt-space-xxs">
              <span className="flex items-center gap-space-xxs">
                <span className="material-symbols-outlined text-title-sm text-primary">clinical_notes</span> Active Encounter: {selectedPatient.activeEncounterName}
              </span>
              <span className="text-outline-variant">•</span>
              <span className="flex items-center gap-space-xxs">
                <span className="material-symbols-outlined text-title-sm text-secondary">stethoscope</span> Attending: {selectedPatient.attendingPhysician}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Auto-Save Enabled</span>
          </div>
          <button
            onClick={() => window.print()}
            className="h-9 px-space-md rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md inline-flex items-center gap-space-xs shadow-sm"
          >
            <span className="material-symbols-outlined text-title-sm">picture_as_pdf</span>
            <span>Export Notes (PDF)</span>
          </button>
        </div>
      </section>

      {/* Main Editor & Context Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Primary Editor Pane */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container/60">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-headline-sm">edit_note</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">New Encounter Documentation</h2>
              </div>
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-title-sm text-secondary">encrypted</span>
                <span>HIPAA-Compliant Draft</span>
              </div>
            </div>

            {/* Note Type Tags */}
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mr-space-xs">
                Note Type:
              </span>
              {['Progress Note', 'SOAP Note', 'Endocrine Follow-up', 'Addendum', 'Phone Encounter'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedNoteType(t)}
                  className={`h-7 px-space-sm rounded-full font-label-sm text-label-sm transition-all ${
                    selectedNoteType === t
                      ? 'bg-primary-container text-on-primary font-semibold'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg">
              <div className="flex items-center gap-space-xxs text-on-surface-variant flex-wrap">
                <button className="p-1.5 rounded hover:bg-surface-container hover:text-on-surface transition-colors" title="Bold">
                  <span className="material-symbols-outlined text-title-sm">format_bold</span>
                </button>
                <button className="p-1.5 rounded hover:bg-surface-container hover:text-on-surface transition-colors" title="Italic">
                  <span className="material-symbols-outlined text-title-sm">format_italic</span>
                </button>
                <button className="p-1.5 rounded hover:bg-surface-container hover:text-on-surface transition-colors" title="Bullet List">
                  <span className="material-symbols-outlined text-title-sm">format_list_bulleted</span>
                </button>

                <span className="w-px h-4 bg-outline-variant mx-space-xs"></span>

                <button
                  onClick={handleInsertLabRef}
                  className="px-space-sm py-1 rounded text-primary hover:bg-surface-container transition-colors inline-flex items-center gap-space-xxs font-label-sm text-label-sm"
                >
                  <span className="material-symbols-outlined text-title-sm">biotech</span>
                  <span>Insert Lab Ref</span>
                </button>
                <button
                  onClick={handleInsertAiRef}
                  className="px-space-sm py-1 rounded text-primary hover:bg-surface-container transition-colors inline-flex items-center gap-space-xxs font-label-sm text-label-sm"
                >
                  <span className="material-symbols-outlined text-title-sm">auto_awesome</span>
                  <span>Insert AI Diagnostic Ref</span>
                </button>
              </div>

              <button
                onClick={() => setIsDictating(!isDictating)}
                className={`inline-flex items-center gap-space-xs h-7 px-space-md rounded-full font-label-sm text-label-sm shadow-sm transition-all ${
                  isDictating ? 'bg-error text-white animate-pulse' : 'bg-surface-container-lowest text-primary hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-title-sm">mic</span>
                <span>{isDictating ? 'Listening...' : 'Dictate'}</span>
              </button>
            </div>

            {/* Note Textarea */}
            <div className="relative flex flex-col">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Document clinical impressions, physical examination findings, assessment, and plan... (Click 'Insert Lab Ref' or 'Insert AI Diagnostic Ref' above to include active data)"
                className="w-full bg-surface p-space-md rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-y leading-relaxed min-h-[220px]"
                rows={9}
              />
            </div>

            {/* Footer counter & commit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs">
              <div className="flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant">
                <span>Words: {wordCount}</span>
                <span>•</span>
                <span>Characters: {charCount}</span>
                <span>•</span>
                <span className="text-secondary font-medium">Session Active</span>
              </div>
              <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
                <button
                  onClick={handleCommitNote}
                  disabled={!noteContent.trim()}
                  className="h-9 px-space-md rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md inline-flex items-center gap-space-xs shadow-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-title-sm">
                    {committedSuccess ? 'check' : 'lock'}
                  </span>
                  <span>{committedSuccess ? 'Committed to EHR!' : 'Commit Note to EHR'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Context Rail (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xxs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-title-md">monitoring</span>
                <h3 className="font-title-sm text-title-sm text-on-surface">Key Lab Values</h3>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-medium">Auto-Synced</span>
            </div>
            <div className="flex flex-col gap-space-xs">
              {selectedPatient.labs.slice(0, 4).map((l) => (
                <div key={l.id} className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{l.parameter}</span>
                    <span className={`font-metric-val text-metric-val ${l.status === 'normal' ? 'text-on-surface' : 'text-error'}`}>
                      {l.value} {l.unit}
                    </span>
                  </div>
                  <span className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold ${l.status === 'normal' ? 'bg-surface-container text-on-surface' : 'bg-error-container/50 text-error'}`}>
                    {l.statusLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Previously Saved Notes Section */}
      <section className="flex flex-col gap-space-md mt-space-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Encounter History & Archived Notes</h2>
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-label-md text-label-md font-semibold">
              {selectedPatient.notes.length} Notes on file
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-space-md">
          {selectedPatient.notes.map((note) => (
            <article key={note.id} className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div className="flex items-start md:items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-title-md">medical_services</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <h3 className="font-title-md text-title-md text-on-surface">{note.title}</h3>
                      <span className="px-space-sm py-0.5 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-sm text-label-sm font-semibold flex items-center gap-space-xxs">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {note.facility}
                      </span>
                    </div>
                    <div className="flex items-center gap-space-sm text-on-surface-variant font-label-md text-label-md mt-0.5">
                      <span className="font-semibold text-primary">{note.author}</span>
                      <span>•</span>
                      <span>{note.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-space-xs self-end md:self-auto">
                  <button
                    onClick={() => window.print()}
                    className="p-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                    title="Print Note"
                  >
                    <span className="material-symbols-outlined text-title-sm">print</span>
                  </button>
                  <button
                    onClick={() => navigator.clipboard?.writeText(note.content)}
                    className="p-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                    title="Copy Text"
                  >
                    <span className="material-symbols-outlined text-title-sm">content_copy</span>
                  </button>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed pl-0 md:pl-12">
                {note.content}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-space-sm pl-0 md:pl-12 pt-space-xs">
                <div className="flex flex-wrap items-center gap-space-xs">
                  {note.tags.map((t, idx) => (
                    <span key={idx} className="px-space-sm py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="font-label-sm text-label-sm text-outline">Encounter ID: {note.encounterId}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
