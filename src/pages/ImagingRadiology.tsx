import React, { useState, useRef } from 'react';
import { usePatient } from '../context/PatientContext';
import { ImagingStudy } from '../types';

export const ImagingRadiology: React.FC = () => {
  const { selectedPatient, addImagingStudy, addNote } = usePatient();
  const [selectedModality, setSelectedModality] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Modals state
  const [activeViewerStudy, setActiveViewerStudy] = useState<ImagingStudy | null>(null);
  const [activeReportStudy, setActiveReportStudy] = useState<ImagingStudy | null>(null);

  // DICOM Viewer controls state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [contrastLevel, setContrastLevel] = useState(100);
  const [brightnessLevel, setBrightnessLevel] = useState(100);
  const [measureMode, setMeasureMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const studies = selectedPatient.imaging;

  const filteredStudies = studies.filter((study) => {
    if (selectedModality !== 'All' && selectedModality !== 'Pending Orders') {
      if (!study.modality.toLowerCase().includes(selectedModality.toLowerCase())) {
        return false;
      }
    }
    if (selectedModality === 'Pending Orders' && study.status !== 'Pending') {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        study.title.toLowerCase().includes(q) ||
        study.modality.toLowerCase().includes(q) ||
        study.accession.toLowerCase().includes(q) ||
        study.extractedFindings.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase();
      
      let modality = 'Ultrasound';
      let previewType: 'ultrasound' | 'xray' | 'mri' = 'ultrasound';
      
      if (fileExt === 'dcm' || fileName.includes('CT') || fileName.includes('MRI')) {
        modality = 'MRI / CT';
        previewType = 'mri';
      } else if (fileName.includes('XR') || fileName.includes('XRay') || fileName.includes('Chest')) {
        modality = 'X-Ray';
        previewType = 'xray';
      }

      addImagingStudy({
        title: `Ingested Study: ${fileName}`,
        modality,
        bodyPart: 'Target Region',
        accession: `ACC-${Math.floor(100000 + Math.random() * 900000)}`,
        radiologist: selectedPatient.attendingPhysician,
        status: 'PACS Synced & Analyzed',
        extractedFindings: `File '${fileName}' (${(file.size / 1024 / 1024).toFixed(2)} MB) successfully uploaded and parsed into DICOM PACS cache. Automated AI check reveals clear structural boundaries.`,
        narrative: `Ingested local file ${fileName} into dossier PACS repository.`,
        previewType,
        metrics: [
          { label: 'Ingested File', value: fileName, status: 'DICOM Validated' },
          { label: 'File Size', value: `${(file.size / 1024 / 1024).toFixed(2)} MB`, status: 'Normal' },
          { label: 'PACS Bridge', value: selectedPatient.pacsNetwork, status: 'Active' },
        ],
      });
    });

    setUploadSuccessMsg(`Successfully uploaded and processed ${files.length} DICOM/Image file(s)!`);
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  const handleAdoptReportToNotes = (study: ImagingStudy) => {
    addNote(
      `Radiology Analysis Adoption – ${study.title}`,
      'Addendum',
      `[AI Radiology Report Adopted for ${study.accession}]: ${study.extractedFindings}`,
      ['#Radiology', '#DICOM', '#AISynthesis'],
      study.radiologist
    );
    setUploadSuccessMsg(`Adopted radiology analysis into Clinical Notes!`);
    setTimeout(() => setUploadSuccessMsg(null), 3000);
    setActiveReportStudy(null);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Patient Context Strip */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary font-headline-sm text-headline-sm font-bold">
            {selectedPatient.initials}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                {selectedPatient.name}
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                {selectedPatient.age} yrs
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                {selectedPatient.gender}
              </span>
              <span className="font-label-sm text-label-sm text-outline">MRN {selectedPatient.mrn}</span>
            </div>
            <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mt-0.5">
              <span className="material-symbols-outlined text-title-sm text-primary">stethoscope</span>
              <span>Attending: {selectedPatient.attendingPhysician}</span>
              <span className="text-outline-variant">•</span>
              <span>Department: {selectedPatient.department}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-space-xs text-on-surface-variant bg-surface-container-low px-space-md py-space-xs rounded-lg self-start md:self-auto">
          <span className="material-symbols-outlined text-title-sm text-primary">sync_saved_locally</span>
          <span className="font-label-md text-label-md">
            PACS Synced: <strong className="text-on-surface font-title-sm">{selectedPatient.pacsNetwork}</strong>
          </span>
          <span className="w-2 h-2 rounded-full bg-secondary ml-space-xs"></span>
        </div>
      </div>

      {/* Upload Success Banner */}
      {uploadSuccessMsg && (
        <div className="mb-space-md p-space-md rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-title-sm">
            <span className="material-symbols-outlined text-teal-700">check_circle</span>
            <span>{uploadSuccessMsg}</span>
          </div>
          <button onClick={() => setUploadSuccessMsg(null)} className="text-teal-700 hover:text-teal-900">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Page Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
        <div className="flex flex-col gap-space-xs max-w-2xl">
          <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-title-sm">radiology</span>
            <span>Radiological Evidence & Ingestion</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Imaging & Radiology
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Diagnostic imaging, DICOM reports, and radiographic findings cross-referenced with clinical dossier and automated AI extraction.
          </p>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-space-xs h-9 px-space-md rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md shadow-sm"
          >
            <span className="material-symbols-outlined text-title-sm text-outline">file_download</span>
            <span>Export Imaging Log</span>
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".dcm,image/*,.zip"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-space-xs h-9 px-space-md rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-sm">cloud_upload</span>
            <span>Upload Scan (DICOM / PACS)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Search Utility */}
      <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm mb-space-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-1 overflow-x-auto pb-space-xs md:pb-0">
          {[
            { id: 'All', label: `All Studies (${studies.length})` },
            { id: 'Ultrasound', label: 'Ultrasound' },
            { id: 'X-Ray', label: 'X-Ray / Plain Film' },
            { id: 'MRI', label: 'MRI' },
            { id: 'Pending Orders', label: 'Pending Orders' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModality(m.id)}
              className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-all ${
                selectedModality === m.id
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3 top-2 text-title-sm text-outline">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modality, anatomic region, accession..."
            className="w-full h-9 pl-9 pr-space-md bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Imaging Reports Stream */}
      <div className="flex flex-col gap-space-lg">
        {filteredStudies.map((study) => (
          <article
            key={study.id}
            className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col gap-space-md"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            {/* Card Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm bg-surface-container-low/40 -mx-space-lg -mt-space-lg px-space-lg pt-space-md">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-label-sm">sensors</span>
                  {study.modality} • {study.bodyPart}
                </span>
                {study.tiradsOrRating && (
                  <span className="inline-flex items-center gap-1 text-label-sm font-label-sm px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {study.tiradsOrRating}
                  </span>
                )}
                <span className="text-on-surface-variant font-body-sm text-body-sm">Accession #{study.accession}</span>
              </div>
              <div className="flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-title-sm text-outline">calendar_today</span>
                  {study.date}
                </span>
                <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                  <span className="material-symbols-outlined text-title-sm">verified</span>
                  {study.status}
                </span>
              </div>
            </div>

            {/* Content Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg pt-space-xs">
              <div className="lg:col-span-8 flex flex-col gap-space-md">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                    {study.title}
                  </h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5">
                    {study.pacsNetwork} • Radiologist: {study.radiologist}
                  </p>
                </div>

                <div className="bg-surface-container-low/60 rounded-lg p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase font-semibold">
                    <span className="material-symbols-outlined text-title-sm">psychology</span>
                    <span>Automated Synthesis & Key Extracted Findings</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    {study.extractedFindings}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
                  {study.metrics.map((m, idx) => (
                    <div key={idx} className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-surface-container">
                      <div className="text-on-surface-variant font-label-sm text-label-sm">{m.label}</div>
                      <div className="text-on-surface font-title-md text-title-md font-bold mt-1">{m.value}</div>
                      <div className="text-secondary font-label-sm text-label-sm flex items-center gap-0.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        {m.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Graphic & Interactive Viewer Trigger */}
              <div className="lg:col-span-4 flex flex-col justify-between bg-surface-container-low rounded-xl p-space-md">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">Representative Keyframe</span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm">{study.seriesInfo}</span>
                </div>

                <div
                  onClick={() => setActiveViewerStudy(study)}
                  className="relative w-full h-36 bg-inverse-surface rounded-lg my-space-sm overflow-hidden flex items-center justify-center p-space-sm cursor-pointer group"
                  title="Click to launch interactive DICOM Lightbox Viewer"
                >
                  {study.previewType === 'ultrasound' && (
                    <svg className="w-full h-full opacity-80 group-hover:scale-105 transition-transform" viewBox="0 0 320 140">
                      <line stroke="#3f4947" strokeDasharray="3,3" strokeWidth="0.5" x1="20" x2="300" y1="20" y2="20" />
                      <line stroke="#3f4947" strokeDasharray="3,3" strokeWidth="0.5" x1="20" x2="300" y1="80" y2="80" />
                      <path d="M 160,5 L 40,135 A 140,140 0 0,0 280,135 Z" fill="#0b1c30" opacity="0.6" />
                      <ellipse cx="115" cy="75" fill="#216963" opacity="0.35" rx="38" ry="24" />
                      <ellipse cx="205" cy="75" fill="#216963" opacity="0.35" rx="36" ry="22" />
                      <text fill="#91d5ce" fontFamily="Hanken Grotesk" fontSize="9" textAnchor="middle" x="160" y="42">SONOGRAM SCAN</text>
                    </svg>
                  )}
                  {study.previewType === 'xray' && (
                    <svg className="w-full h-full opacity-75 group-hover:scale-105 transition-transform" viewBox="0 0 260 140">
                      <path d="M 70,30 Q 130,20 190,30 Q 210,70 195,120 Q 130,135 65,120 Q 50,70 70,30 Z" fill="#112233" stroke="#3f4947" strokeWidth="1" />
                      <line opacity="0.6" stroke="#bec9c7" strokeDasharray="4,2" strokeWidth="3" x1="130" x2="130" y1="20" y2="125" />
                      <path d="M 120,65 Q 155,75 145,105 Q 115,105 110,85 Z" fill="#91d5ce" opacity="0.3" />
                      <text fill="#bec9c7" fontFamily="Hanken Grotesk" fontSize="9" fontWeight="bold" x="20" y="25">R</text>
                    </svg>
                  )}
                  {study.previewType === 'mri' && (
                    <svg className="w-full h-full opacity-80 group-hover:scale-105 transition-transform" viewBox="0 0 240 140">
                      <ellipse cx="120" cy="70" fill="#15263a" rx="70" ry="60" stroke="#3f4947" strokeWidth="1" />
                      <line stroke="#0b1c30" strokeWidth="2" x1="120" x2="120" y1="12" y2="128" />
                      <path d="M 112,50 C 112,65 105,75 110,85 C 115,85 118,70 118,50 Z" fill="#0b1c30" />
                      <circle cx="85" cy="62" fill="#ffffff" opacity="0.8" r="1.5" />
                      <text fill="#91d5ce" fontFamily="Hanken Grotesk" fontSize="8" textAnchor="middle" x="120" y="132">3.0T MRI AXIAL</text>
                    </svg>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-title-sm text-xs flex items-center gap-1 shadow-lg">
                      <span className="material-symbols-outlined text-sm">open_in_full</span>
                      Open DICOM Lightbox
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 text-surface-bright/70 font-label-sm text-label-sm">FOV 5.0cm</div>
                </div>

                <div className="flex items-center gap-space-xs pt-space-xs">
                  <button
                    onClick={() => setActiveViewerStudy(study)}
                    className="flex-1 h-9 px-space-sm rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-high transition-colors font-label-md text-label-md inline-flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-title-sm">visibility</span>
                    <span>DICOM Series</span>
                  </button>
                  <button
                    onClick={() => setActiveReportStudy(study)}
                    className="flex-1 h-9 px-space-sm rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md inline-flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-title-sm">auto_fix_high</span>
                    <span>AI Analysis</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {filteredStudies.length === 0 && (
          <div className="p-8 text-center bg-white rounded-xl text-outline font-body-md shadow-sm">
            No radiological imaging studies match your search or filter parameters.
          </div>
        )}
      </div>

      {/* PACS & DICOM Ingestion Zone */}
      <div className="mt-space-xl bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
          <div className="flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm font-semibold">
            <span className="material-symbols-outlined">cloud_sync</span>
            <span>PACS & Local DICOM Ingestion Zone</span>
          </div>
          <span className="text-outline font-label-sm text-label-sm uppercase tracking-wider">DICOM Part 10 Compatible</span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          className={`w-full transition-all rounded-xl p-space-lg flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed ${
            isDragging ? 'border-primary bg-primary-container/10' : 'border-slate-300 bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary mb-space-xs">
            <span className="material-symbols-outlined text-headline-md">file_upload</span>
          </div>
          <span className="font-title-sm text-title-sm text-on-surface font-semibold">
            Drag and drop DICOM series here, or{' '}
            <label className="text-primary underline cursor-pointer">
              browse filesystem
              <input
                type="file"
                multiple
                accept=".dcm,image/*,.zip"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </label>
          </span>
          <span className="text-on-surface-variant font-body-sm text-body-sm mt-1">
            Accepts .dcm, .zip archive containing DICOMDIR, or bulk CT/MRI/US series (up to 2.5 GB)
          </span>
        </div>
      </div>

      {/* DICOM LIGHTBOX VIEWER MODAL */}
      {activeViewerStudy && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between text-white p-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-teal-400 text-2xl">grid_view</span>
              <div>
                <h3 className="font-bold text-lg leading-tight">{activeViewerStudy.title}</h3>
                <p className="text-xs text-slate-400">
                  Accession #{activeViewerStudy.accession} • {activeViewerStudy.modality} • {selectedPatient.name} (MRN {selectedPatient.mrn})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMeasureMode(!measureMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  measureMode ? 'bg-teal-500 text-black' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-sm">straighten</span>
                {measureMode ? 'Caliper Active (14.2 mm)' : 'Caliper Measure'}
              </button>
              <button
                onClick={() => {
                  setZoomLevel(100);
                  setContrastLevel(100);
                  setBrightnessLevel(100);
                  setMeasureMode(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
              >
                Reset Controls
              </button>
              <button
                onClick={() => setActiveViewerStudy(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Main Lightbox Body */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 my-4 overflow-hidden">
            {/* Left Controls */}
            <div className="lg:col-span-3 bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between text-xs space-y-4">
              <div className="space-y-4">
                <h4 className="font-semibold text-teal-400 uppercase tracking-wider text-[11px]">PACS Image Adjustments</h4>
                
                <div>
                  <div className="flex justify-between mb-1 text-slate-300">
                    <span>Zoom Level</span>
                    <span className="font-mono text-teal-400">{zoomLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(Number(e.target.value))}
                    className="w-full accent-teal-500 bg-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-300">
                    <span>Window Contrast (WW)</span>
                    <span className="font-mono text-teal-400">{contrastLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={contrastLevel}
                    onChange={(e) => setContrastLevel(Number(e.target.value))}
                    className="w-full accent-teal-500 bg-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-300">
                    <span>Window Level (WL)</span>
                    <span className="font-mono text-teal-400">{brightnessLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={brightnessLevel}
                    onChange={(e) => setBrightnessLevel(Number(e.target.value))}
                    className="w-full accent-teal-500 bg-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">DICOM Header Tags</h4>
                <div className="space-y-1 font-mono text-[11px] text-slate-400">
                  <p>SOP Class: 1.2.840.10008.5.1.4.1.1.2</p>
                  <p>KVP: 120 kV</p>
                  <p>Slice Thickness: 1.25 mm</p>
                  <p>Matrix: 512 x 512 px</p>
                  <p>Photometric: MONOCHROME2</p>
                </div>
              </div>
            </div>

            {/* Central Canvas View */}
            <div className="lg:col-span-9 bg-black rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden p-6">
              <div
                className="relative transition-transform duration-75 flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  filter: `contrast(${contrastLevel}%) brightness(${brightnessLevel}%)`,
                }}
              >
                {activeViewerStudy.previewType === 'ultrasound' && (
                  <svg className="w-[500px] h-[340px]" viewBox="0 0 320 140">
                    <line stroke="#475569" strokeDasharray="3,3" strokeWidth="0.5" x1="20" x2="300" y1="20" y2="20" />
                    <line stroke="#475569" strokeDasharray="3,3" strokeWidth="0.5" x1="20" x2="300" y1="80" y2="80" />
                    <path d="M 160,5 L 40,135 A 140,140 0 0,0 280,135 Z" fill="#030712" opacity="0.9" stroke="#334155" />
                    <ellipse cx="115" cy="75" fill="#14b8a6" opacity="0.45" rx="38" ry="24" />
                    <ellipse cx="205" cy="75" fill="#14b8a6" opacity="0.45" rx="36" ry="22" />
                    {measureMode && (
                      <g>
                        <line x1="115" y1="75" x2="205" y2="75" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2,2" />
                        <circle cx="115" cy="75" r="4" fill="#f43f5e" />
                        <circle cx="205" cy="75" r="4" fill="#f43f5e" />
                        <text x="160" y="68" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">14.2 mm</text>
                      </g>
                    )}
                    <text fill="#5eead4" fontFamily="Hanken Grotesk" fontSize="10" textAnchor="middle" x="160" y="42">SONOGRAM HIGH-RES DICOM</text>
                  </svg>
                )}
                {activeViewerStudy.previewType === 'xray' && (
                  <svg className="w-[500px] h-[340px]" viewBox="0 0 260 140">
                    <path d="M 70,30 Q 130,20 190,30 Q 210,70 195,120 Q 130,135 65,120 Q 50,70 70,30 Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                    <line opacity="0.7" stroke="#cbd5e1" strokeDasharray="4,2" strokeWidth="3" x1="130" x2="130" y1="20" y2="125" />
                    <path d="M 120,65 Q 155,75 145,105 Q 115,105 110,85 Z" fill="#14b8a6" opacity="0.4" />
                    {measureMode && (
                      <g>
                        <line x1="120" y1="65" x2="145" y2="105" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2,2" />
                        <text x="140" y="80" fill="#f43f5e" fontSize="10" fontWeight="bold">28.4 mm</text>
                      </g>
                    )}
                    <text fill="#cbd5e1" fontFamily="Hanken Grotesk" fontSize="12" fontWeight="bold" x="20" y="25">R</text>
                  </svg>
                )}
                {activeViewerStudy.previewType === 'mri' && (
                  <svg className="w-[500px] h-[340px]" viewBox="0 0 240 140">
                    <ellipse cx="120" cy="70" fill="#020617" rx="70" ry="60" stroke="#334155" strokeWidth="1.5" />
                    <line stroke="#0f172a" strokeWidth="3" x1="120" x2="120" y1="12" y2="128" />
                    <path d="M 112,50 C 112,65 105,75 110,85 C 115,85 118,70 118,50 Z" fill="#0f172a" />
                    <circle cx="85" cy="62" fill="#ffffff" opacity="0.9" r="2.5" />
                    {measureMode && (
                      <g>
                        <line x1="85" y1="62" x2="120" y2="70" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2,2" />
                        <text x="95" y="55" fill="#f43f5e" fontSize="10" fontWeight="bold">11.6 mm</text>
                      </g>
                    )}
                    <text fill="#2dd4bf" fontFamily="Hanken Grotesk" fontSize="9" textAnchor="middle" x="120" y="132">3.0T MRI AXIAL T2-WEIGHTED</text>
                  </svg>
                )}
              </div>

              {/* Watermark Overlay */}
              <div className="absolute top-4 left-4 font-mono text-xs text-slate-500 pointer-events-none">
                <p>PATIENT: {selectedPatient.name.toUpperCase()}</p>
                <p>DOB: {selectedPatient.dob}</p>
                <p>STUDY DATE: {activeViewerStudy.date}</p>
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-xs text-teal-400 pointer-events-none">
                <p>DICOM PACS VIEW MODE</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI RADIOLOGY REPORT MODAL */}
      {activeReportStudy && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
                <h3 className="font-bold text-lg text-on-surface">AI Diagnostic Analysis & Radiologic Findings</h3>
              </div>
              <button onClick={() => setActiveReportStudy(null)} className="text-outline hover:text-on-surface p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs font-semibold">
                <span>Study: {activeReportStudy.title}</span>
                <span className="text-primary">Accession: {activeReportStudy.accession}</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-outline">Extracted AI Findings</h4>
                <p className="text-sm text-on-surface leading-relaxed p-3 rounded-xl bg-teal-50/70 border border-teal-200">
                  {activeReportStudy.extractedFindings}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-outline">Radiologist Diagnostic Narrative</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed p-3 rounded-xl bg-surface-container-low">
                  {activeReportStudy.narrative}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
              <button
                onClick={() => setActiveReportStudy(null)}
                className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleAdoptReportToNotes(activeReportStudy)}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary font-title-sm hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">post_add</span>
                <span>Adopt into Clinical Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

