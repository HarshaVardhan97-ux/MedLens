import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { LabResult } from '../types';

export const DiagnosticLabs: React.FC = () => {
  const { selectedPatient, addLabResult } = usePatient();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [outOfRangeOnly, setOutOfRangeOnly] = useState(false);

  // Order New Panel Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [paramInput, setParamInput] = useState('');
  const [loincInput, setLoincInput] = useState('');
  const [valInput, setValInput] = useState('');
  const [unitInput, setUnitInput] = useState('mg/dL');
  const [minRefInput, setMinRefInput] = useState('5.0');
  const [maxRefInput, setMaxRefInput] = useState('15.0');
  const [statusInput, setStatusInput] = useState<'normal' | 'low' | 'high'>('normal');
  const [specimenInput, setSpecimenInput] = useState('Venous Blood');
  const [categoryInput, setCategoryInput] = useState('metabolic');

  // Longitudinal Trend Modal State
  const [trendLab, setTrendLab] = useState<LabResult | null>(null);

  const labs = selectedPatient.labs;
  const abnormalCount = labs.filter((l) => l.status !== 'normal').length;

  const filteredLabs = labs.filter((l) => {
    // Out of range toggle
    if (outOfRangeOnly && l.status === 'normal') return false;

    // Filter chip
    if (selectedFilter === 'abnormal' && l.status === 'normal') return false;
    if (selectedFilter !== 'all' && selectedFilter !== 'abnormal' && l.category !== selectedFilter) return false;

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.parameter.toLowerCase().includes(q) ||
        l.loinc.toLowerCase().includes(q) ||
        l.specimen.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOrderLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paramInput.trim()) return;

    let statusLabel = 'Normal';
    if (statusInput === 'low') statusLabel = 'Low (Abnormal)';
    if (statusInput === 'high') statusLabel = 'High (Abnormal)';

    addLabResult({
      parameter: paramInput.trim(),
      loinc: loincInput.trim() || '9999-9',
      value: valInput.trim() || '10.0',
      numericValue: Number(valInput) || 10.0,
      unit: unitInput.trim() || 'mg/dL',
      minRef: Number(minRefInput) || 5.0,
      maxRef: Number(maxRefInput) || 15.0,
      refText: `${minRefInput} – ${maxRefInput}`,
      status: statusInput,
      statusLabel,
      specimen: specimenInput.trim() || 'Venous Blood',
      category: categoryInput,
      source: 'Quest LIMS Synced',
    });

    setParamInput('');
    setLoincInput('');
    setValInput('');
    setIsOrderModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-space-2xl">
      {/* Top Context & Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xxs">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
            <span>Encounter {selectedPatient.activeEncounterDate.split('•')[0]}</span>
            <span className="text-outline-variant">•</span>
            <span className="text-primary font-title-sm">{selectedPatient.name}</span>
            <span className="text-outline-variant">•</span>
            <span>MRN {selectedPatient.mrn}</span>
            <span className="text-outline-variant">•</span>
            <span className="inline-flex items-center gap-1 text-secondary font-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Quest LIMS Synced
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Diagnostic Labs</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
              {labs.length} Analyzed
            </span>
          </div>
        </div>

        {/* Top Action Toolbar */}
        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="inline-flex items-center gap-space-xs h-9 px-space-md rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container-low text-on-surface font-title-sm text-title-sm transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-title-sm text-primary">add_chart</span>
            <span>Order New Panel</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-space-xs h-9 px-space-md rounded-lg bg-primary-container hover:bg-primary text-on-primary font-title-sm text-title-sm shadow-sm transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-title-sm">download</span>
            <span>Export Lab PDF</span>
          </button>
        </div>
      </div>

      {/* Prominent Metrics Grid (Bento Scale) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {labs.slice(0, 4).map((m) => (
          <div
            key={m.id}
            onClick={() => setTrendLab(m)}
            className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md group hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-teal-200"
            title="Click to view 6-month longitudinal trajectory"
          >
            <div className="flex items-start justify-between gap-space-xs">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-title-sm text-title-sm text-on-surface">{m.parameter}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">LOINC {m.loinc}</span>
                </div>
                <p className="font-label-sm text-label-sm text-outline mt-0.5">{m.specimen} • {m.method}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                  m.status === 'low'
                    ? 'bg-surface-container-low text-tertiary'
                    : m.status === 'high'
                    ? 'bg-surface-container-high text-primary'
                    : 'bg-secondary-container text-on-secondary-container'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    m.status === 'low' ? 'bg-tertiary' : m.status === 'high' ? 'bg-primary' : 'bg-secondary'
                  }`}
                ></span>
                {m.statusLabel}
              </span>
            </div>

            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg font-bold text-on-surface">{m.value}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">{m.unit}</span>
            </div>

            {/* Linear Range Bar Visual */}
            <div className="flex flex-col gap-1.5">
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden relative">
                <div className="absolute left-1/4 right-1/4 h-full bg-secondary-fixed/40"></div>
                <div
                  className={`absolute top-0 bottom-0 w-2.5 rounded-full shadow-sm ${
                    m.status === 'low' ? 'bg-tertiary' : m.status === 'high' ? 'bg-primary' : 'bg-secondary'
                  }`}
                  style={{
                    left: m.status === 'low' ? '14%' : m.status === 'high' ? '78%' : '48%',
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-outline font-label-sm text-label-sm">
                <span>Ref: {m.refText}</span>
                <span className="font-medium text-on-surface-variant">{m.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Laboratory Workspace Container */}
      <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
        {/* Filter, Search & View Controls Bar */}
        <div className="p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest">
          {/* Search Field */}
          <div className="relative w-full lg:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-title-sm text-outline">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter test name, LOINC, or panel..."
              className="w-full h-9 pl-9 pr-space-md rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-all"
            />
          </div>

          {/* Categories & Toggles */}
          <div className="flex flex-wrap items-center gap-space-xs text-label-md font-label-md">
            <div className="inline-flex p-0.5 rounded-lg bg-surface-container-low">
              {[
                { id: 'all', label: `All Labs (${labs.length})` },
                { id: 'abnormal', label: `Abnormal (${abnormalCount})` },
                { id: 'hematology', label: 'Hematology' },
                { id: 'metabolic', label: 'Metabolic' },
                { id: 'endocrine', label: 'Endocrine' },
                { id: 'iron', label: 'Iron Studies' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    selectedFilter === tab.id
                      ? 'bg-surface-container-lowest text-on-surface font-title-sm shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-surface-container mx-1 hidden sm:block"></div>

            {/* Out of range toggle */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-surface-container-low transition-colors">
              <input
                type="checkbox"
                checked={outOfRangeOnly}
                onChange={(e) => setOutOfRangeOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Out of Range Only</span>
            </label>
          </div>
        </div>

        {/* Clinical Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/60 text-on-surface-variant font-label-md text-label-md select-none">
                <th className="py-3 px-space-lg font-medium" scope="col">Diagnostic Parameter</th>
                <th className="py-3 px-space-md font-medium text-right" scope="col">Result</th>
                <th className="py-3 px-space-md font-medium" scope="col">Unit</th>
                <th className="py-3 px-space-lg font-medium" scope="col">Biological Reference Range</th>
                <th className="py-3 px-space-md font-medium" scope="col">Diagnostic Status</th>
                <th className="py-3 px-space-lg font-medium" scope="col">Source / Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low/50 font-body-md text-body-md text-on-surface">
              {filteredLabs.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => setTrendLab(l)}
                  className="group hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                  title="Click to open trend analysis"
                >
                  <td className="py-4 px-space-lg">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors">{l.parameter}</span>
                        <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                          {l.loinc}
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                        {l.specimen} • {l.method}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-space-md text-right">
                    <span
                      className={`font-title-md text-title-md font-bold ${
                        l.status === 'low'
                          ? 'text-tertiary'
                          : l.status === 'high'
                          ? 'text-primary'
                          : 'text-on-surface'
                      }`}
                    >
                      {l.value}
                    </span>
                  </td>
                  <td className="py-4 px-space-md">
                    <span className="text-on-surface-variant font-body-sm text-body-sm">{l.unit}</span>
                  </td>
                  <td className="py-4 px-space-lg">
                    <div className="flex flex-col gap-1 w-48">
                      <div className="flex justify-between text-outline font-label-sm text-label-sm">
                        <span>Ref Range:</span>
                        <span className="text-on-surface-variant font-medium">{l.refText}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full relative">
                        <div className="absolute left-1/4 right-1/4 h-full bg-secondary-fixed/50"></div>
                        <div
                          className={`absolute -top-1 w-3.5 h-3.5 rounded-full shadow-xs ${
                            l.status === 'low'
                              ? 'bg-tertiary'
                              : l.status === 'high'
                              ? 'bg-primary'
                              : 'bg-secondary'
                          }`}
                          style={{
                            left: l.status === 'low' ? '12%' : l.status === 'high' ? '82%' : '48%',
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-space-md">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                        l.status === 'low'
                          ? 'bg-surface-container-high text-tertiary'
                          : l.status === 'high'
                          ? 'bg-surface-container-high text-primary'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          l.status === 'low' ? 'bg-tertiary' : l.status === 'high' ? 'bg-primary' : 'bg-secondary'
                        }`}
                      ></span>
                      {l.statusLabel}
                    </span>
                  </td>
                  <td className="py-4 px-space-lg">
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-title-sm text-secondary">verified</span>
                      <span>{l.source}</span>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLabs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-outline font-body-sm">
                    No diagnostic lab results match your current search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER NEW PANEL MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">add_chart</span>
                <h3 className="font-bold text-lg text-on-surface">Order & Log New Laboratory Panel</h3>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-outline hover:text-on-surface p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleOrderLabSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Parameter Name</label>
                <input
                  type="text"
                  value={paramInput}
                  onChange={(e) => setParamInput(e.target.value)}
                  placeholder="e.g. Serum Ferritin, Free T4, HbA1c"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Result Value</label>
                  <input
                    type="text"
                    value={valInput}
                    onChange={(e) => setValInput(e.target.value)}
                    placeholder="e.g. 14.5"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Unit</label>
                  <input
                    type="text"
                    value={unitInput}
                    onChange={(e) => setUnitInput(e.target.value)}
                    placeholder="ng/mL, mg/dL, %"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">LOINC Code</label>
                  <input
                    type="text"
                    value={loincInput}
                    onChange={(e) => setLoincInput(e.target.value)}
                    placeholder="e.g. 2276-4"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="low font-bold">Low (Abnormal)</option>
                    <option value="high font-bold">High (Abnormal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Min Ref Limit</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minRefInput}
                    onChange={(e) => setMinRefInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Max Ref Limit</label>
                  <input
                    type="number"
                    step="0.1"
                    value={maxRefInput}
                    onChange={(e) => setMaxRefInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Specimen</label>
                  <input
                    type="text"
                    value={specimenInput}
                    onChange={(e) => setSpecimenInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Category</label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
                  >
                    <option value="hematology">Hematology</option>
                    <option value="metabolic">Metabolic</option>
                    <option value="endocrine">Endocrine</option>
                    <option value="iron">Iron Studies</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary text-on-primary font-title-sm hover:bg-primary-container transition-colors shadow-sm"
                >
                  Save Lab Panel Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LONGITUDINAL TREND CHART MODAL */}
      {trendLab && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-bold text-lg text-on-surface">{trendLab.parameter} Trajectory</h3>
                <p className="text-xs text-on-surface-variant">LOINC {trendLab.loinc} • Ref Range: {trendLab.refText} {trendLab.unit}</p>
              </div>
              <button onClick={() => setTrendLab(null)} className="text-outline hover:text-on-surface p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">Current Reading</span>
                <span className="text-2xl font-bold text-primary">{trendLab.value} {trendLab.unit}</span>
              </div>

              <div className="w-full h-32 bg-white rounded-lg p-2 border border-surface-container relative">
                <svg className="w-full h-full text-teal-600 overflow-visible" viewBox="0 0 300 100">
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3,3" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3,3" />
                  <path
                    d="M 10 75 L 80 65 L 150 82 L 220 50 L 290 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <circle cx="10" cy="75" r="4" fill="#0d9488" />
                  <circle cx="80" cy="65" r="4" fill="#0d9488" />
                  <circle cx="150" cy="82" r="5" fill="#f43f5e" />
                  <circle cx="220" cy="50" r="4" fill="#0d9488" />
                  <circle cx="290" cy="30" r="5" fill="#0d9488" />
                </svg>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>6 Mos Ago</span>
                  <span>4 Mos Ago</span>
                  <span>2 Mos Ago</span>
                  <span>1 Mo Ago</span>
                  <span>Current</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                6-month longitudinal view indicates a stable trend line relative to baseline interval.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setTrendLab(null)}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary font-title-sm hover:bg-primary-container"
              >
                Close Trend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

