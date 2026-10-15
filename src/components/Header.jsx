import React from 'react';
import {
  Calendar,
  Sun,
  Moon,
  RotateCcw,
  Download,
  CalendarCheck2,
  Trash2,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { formatToExcelDate } from '../utils/dateUtils';

export default function Header({
  startDate,
  onStartDateChange,
  onJumpToToday,
  isDarkMode,
  onToggleDarkMode,
  onOpenExportImport,
  onOpenResetConfirm,
  onOpenClearTicksConfirm,
  onLoadSampleData,
  hasTicks
}) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-30 transition-colors">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-excel-navy to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  6-MONTH HABIT TRACKER
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Excel Dashboard
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                180-Day Consistency Engine · Auto-syncs to localStorage
              </p>
            </div>
          </div>

          {/* Controls: Date Picker, Today button, Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Start Date Picker */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-excel-navy dark:text-blue-400" />
              <label htmlFor="start-date-input" className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Start:
              </label>
              <input
                id="start-date-input"
                type="date"
                value={startDate}
                onChange={(e) => {
                  if (e.target.value) onStartDateChange(e.target.value);
                }}
                className="text-xs font-mono font-medium bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                title="Change tracker start date"
              />
            </div>

            {/* Jump to Today Button */}
            <button
              onClick={onJumpToToday}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-sm active:scale-95"
              title="Jump to current month & today's column"
            >
              <CalendarCheck2 className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>

            {/* Load / Clear Sample Data Button */}
            {hasTicks ? (
              <button
                onClick={onOpenClearTicksConfirm}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors active:scale-95"
                title="Clear all checked boxes"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Clear Sample Data</span>
                <span className="sm:hidden">Clear Data</span>
              </button>
            ) : (
              <button
                onClick={onLoadSampleData}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors active:scale-95"
                title="Pre-fill sample habits and Month 1 ticks"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Load Sample Data</span>
              </button>
            )}

            {/* Export / Import Backup */}
            <button
              onClick={onOpenExportImport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors active:scale-95"
              title="Backup or restore data via JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON Backup</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors active:scale-95"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset All Button */}
            <button
              onClick={onOpenResetConfirm}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700 transition-colors active:scale-95"
              title="Reset everything to factory defaults"
              aria-label="Reset all habits and data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
