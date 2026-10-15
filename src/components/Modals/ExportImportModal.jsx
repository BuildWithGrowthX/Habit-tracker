import React, { useState } from 'react';
import { Download, Upload, Copy, Check, X, FileJson, AlertCircle } from 'lucide-react';

export default function ExportImportModal({
  isOpen,
  onClose,
  startDate,
  habits,
  ticks,
  onExport,
  onImport
}) {
  const [activeTab, setActiveTab] = useState('export'); // 'export' | 'import'
  const [pastedJson, setPastedJson] = useState('');
  const [importStatus, setImportStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    startDate,
    habits,
    ticks
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const result = onImport(parsed);
        if (result.success) {
          setImportStatus({ type: 'success', message: 'Data imported successfully!' });
          setTimeout(() => {
            onClose();
            setImportStatus(null);
          }, 1200);
        } else {
          setImportStatus({ type: 'error', message: result.error || 'Failed to import data.' });
        }
      } catch (err) {
        setImportStatus({ type: 'error', message: 'Invalid JSON file: ' + err.message });
      }
    };
    reader.readAsText(file);
  };

  const handleManualImport = () => {
    if (!pastedJson.trim()) {
      setImportStatus({ type: 'error', message: 'Please paste JSON content first.' });
      return;
    }
    try {
      const parsed = JSON.parse(pastedJson);
      const result = onImport(parsed);
      if (result.success) {
        setImportStatus({ type: 'success', message: 'Data imported successfully!' });
        setTimeout(() => {
          onClose();
          setImportStatus(null);
          setPastedJson('');
        }, 1200);
      } else {
        setImportStatus({ type: 'error', message: result.error || 'Failed to import data.' });
      }
    } catch (err) {
      setImportStatus({ type: 'error', message: 'Invalid JSON format: ' + err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-150 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-excel-navy dark:text-blue-400" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Backup & Restore (JSON)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-150 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'export'
                ? 'border-excel-navy dark:border-blue-500 text-excel-navy dark:text-blue-400 bg-white dark:bg-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Download className="w-4 h-4" />
            Export Backup
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'import'
                ? 'border-excel-navy dark:border-blue-500 text-excel-navy dark:text-blue-400 bg-white dark:bg-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            Restore Data
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Save a snapshot of your habits, 6-month start date, and all tick marks. You can download the file or copy the raw JSON.
              </p>

              <div className="bg-slate-50 dark:bg-slate-900/70 p-3 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 max-h-40 overflow-y-auto">
                <pre>{JSON.stringify(currentPayload, null, 2)}</pre>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onExport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-excel-navy hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download .JSON File
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 transition-all active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload a previously saved <code className="text-excel-navy dark:text-blue-400 font-mono">.json</code> file or paste JSON code below.
              </p>

              {/* File upload drop area */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-excel-navy dark:hover:border-blue-400 rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-900/40 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  Click to select backup .json file
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Accepts JSON habit files</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Paste JSON */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Or paste JSON content:
                </label>
                <textarea
                  value={pastedJson}
                  onChange={(e) => setPastedJson(e.target.value)}
                  placeholder='{"version": "1.0", "habits": [...], "ticks": {...}}'
                  className="w-full h-24 p-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-excel-navy dark:focus:ring-blue-400 text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              {/* Status message */}
              {importStatus && (
                <div
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
                    importStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {importStatus.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <button
                onClick={handleManualImport}
                disabled={!pastedJson.trim()}
                className="w-full py-2 bg-excel-navy hover:bg-blue-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow transition-all active:scale-95"
              >
                Apply Pasted Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
