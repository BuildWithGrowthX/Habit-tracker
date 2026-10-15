import React, { useState } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import MonthView from './components/MonthView/MonthView';
import Overview from './components/Overview/Overview';
import ConfirmModal from './components/Modals/ConfirmModal';
import ExportImportModal from './components/Modals/ExportImportModal';
import { useHabitTracker } from './hooks/useHabitTracker';

export default function App() {
  const {
    startDate,
    setStartDate,
    months,
    activeTab,
    setActiveTab,
    habits,
    ticks,
    toggleTick,
    addHabit,
    renameHabit,
    updateHabitStartDate,
    deleteHabit,
    currentMonth,
    currentMonthStats,
    overviewStats,
    isDarkMode,
    toggleDarkMode,
    jumpToToday,
    handleExport,
    handleImport,
    loadSampleData,
    clearTicks,
    resetAll
  } = useHabitTracker();

  // Modals state
  const [deleteTargetHabit, setDeleteTargetHabit] = useState(null);
  const [isClearTicksOpen, setIsClearTicksOpen] = useState(false);
  const [isResetAllOpen, setIsResetAllOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // Check if there are any recorded ticks
  const hasTicks = Object.keys(ticks).some(date =>
    Object.values(ticks[date] || {}).some(Boolean)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Application Header */}
      <Header
        startDate={startDate}
        onStartDateChange={setStartDate}
        onJumpToToday={jumpToToday}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenExportImport={() => setIsExportImportOpen(true)}
        onOpenResetConfirm={() => setIsResetAllOpen(true)}
        onOpenClearTicksConfirm={() => setIsClearTicksOpen(true)}
        onLoadSampleData={loadSampleData}
        hasTicks={hasTicks}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5">
        {/* Tab Navigation: [Overview] [Month 1] ... [Month 6] */}
        <TabNavigation
          months={months}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Dynamic View Rendering */}
        {activeTab === 'overview' ? (
          <Overview
            stats={overviewStats}
            months={months}
            isDarkMode={isDarkMode}
          />
        ) : (
          <MonthView
            month={currentMonth}
            stats={currentMonthStats}
            habits={habits}
            ticks={ticks}
            onToggleTick={toggleTick}
            onRenameHabit={renameHabit}
            onUpdateHabitStartDate={updateHabitStartDate}
            onDeleteRequest={(habit) => setDeleteTargetHabit(habit)}
            onAddHabit={addHabit}
            isDarkMode={isDarkMode}
            startDate={startDate}
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-[1700px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            6-Month Excel Habit Tracker Dashboard · Powered by React, Vite, Tailwind CSS & Chart.js
          </span>
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All data automatically saved to local storage
          </span>
        </div>
      </footer>

      {/* Confirmation Modal: Delete Habit */}
      <ConfirmModal
        isOpen={!!deleteTargetHabit}
        title="Delete Habit"
        message={`Are you sure you want to delete "${deleteTargetHabit?.name}"? All past and future checkmarks for this habit will be permanently removed.`}
        confirmText="Delete Habit"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetHabit) {
            deleteHabit(deleteTargetHabit.id);
            setDeleteTargetHabit(null);
          }
        }}
        onClose={() => setDeleteTargetHabit(null)}
      />

      {/* Confirmation Modal: Clear Sample Data */}
      <ConfirmModal
        isOpen={isClearTicksOpen}
        title="Clear All Completed Ticks"
        message="Are you sure you want to clear all tick marks? Your habit names will remain intact, but all checkmarks across all months will be cleared."
        confirmText="Clear All Ticks"
        isDanger={true}
        onConfirm={() => {
          clearTicks();
          setIsClearTicksOpen(false);
        }}
        onClose={() => setIsClearTicksOpen(false)}
      />

      {/* Confirmation Modal: Reset All */}
      <ConfirmModal
        isOpen={isResetAllOpen}
        title="Reset Entire Habit Tracker"
        message="This will reset all habits, ticks, and settings back to the initial defaults. Are you sure you want to proceed?"
        confirmText="Reset Everything"
        isDanger={true}
        onConfirm={() => {
          resetAll();
          setIsResetAllOpen(false);
        }}
        onClose={() => setIsResetAllOpen(false)}
      />

      {/* Backup & Restore JSON Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        startDate={startDate}
        habits={habits}
        ticks={ticks}
        onExport={handleExport}
        onImport={handleImport}
      />
    </div>
  );
}
