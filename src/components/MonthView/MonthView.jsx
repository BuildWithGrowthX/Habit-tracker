import React from 'react';
import MonthDashboard from './MonthDashboard';
import HabitGrid from './HabitGrid';

export default function MonthView({
  month,
  stats,
  habits,
  ticks,
  onToggleTick,
  onRenameHabit,
  onUpdateHabitStartDate,
  onDeleteRequest,
  onAddHabit,
  isDarkMode,
  startDate
}) {
  if (!month || !stats) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading month data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Excel Dashboard (Left stats, Center line chart, Right completion counts) */}
      <MonthDashboard
        month={month}
        stats={stats}
        isDarkMode={isDarkMode}
        startDate={startDate}
      />

      {/* Excel Habit Grid */}
      <HabitGrid
        month={month}
        habits={habits}
        ticks={ticks}
        onToggleTick={onToggleTick}
        onRenameHabit={onRenameHabit}
        onUpdateHabitStartDate={onUpdateHabitStartDate}
        onDeleteRequest={onDeleteRequest}
        onAddHabit={onAddHabit}
        startDate={startDate}
      />
    </div>
  );
}
