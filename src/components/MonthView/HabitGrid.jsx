import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import HabitRow from './HabitRow';
import { getTodayStr } from '../../utils/dateUtils';

export default function HabitGrid({
  month,
  habits,
  ticks,
  onToggleTick,
  onRenameHabit,
  onUpdateHabitStartDate,
  onDeleteRequest,
  onAddHabit,
  startDate
}) {
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitStartDate, setNewHabitStartDate] = useState(startDate || getTodayStr());
  const [isAdding, setIsAdding] = useState(false);

  if (!month) return null;

  const days = month.days || [];
  const weeks = month.weeks || [];
  const totalDays = days.length;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim(), newHabitStartDate);
      setNewHabitName('');
      setNewHabitStartDate(startDate || getTodayStr());
      setIsAdding(false);
    }
  };

  // Calculate daily totals for the footer row based on active habits on each day
  const dailyTotals = days.map(day => {
    let count = 0;
    const activeHabitsToday = habits.filter(h => !h.createdAt || h.createdAt <= day.dateStr);
    activeHabitsToday.forEach(h => {
      if (ticks[day.dateStr]?.[h.id]) count++;
    });
    const pct = activeHabitsToday.length > 0 ? Math.round((count / activeHabitsToday.length) * 100) : 0;
    return { count, total: activeHabitsToday.length, pct };
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
      {/* Scrollable table container */}
      <div className="overflow-x-auto w-full relative">
        <table className="w-full border-collapse text-left border-spacing-0 select-none text-xs">
          <thead>
            {/* ROW 1: Merged Week Headers */}
            <tr className="text-white text-center font-bold tracking-wide">
              {/* Habit Names header (spans 2 rows) */}
              <th
                rowSpan={2}
                className="sticky left-0 z-20 bg-[#0B2A6F] text-white px-4 py-2 border border-[#0B2A6F] min-w-[200px] max-w-[240px] text-left align-middle shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-wider">
                    Habit Names
                  </span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white/90">
                    {habits.length}
                  </span>
                </div>
              </th>

              {/* Weeks (Week 1, Week 2, Week 3, Week 4, Week 5) */}
              {weeks.map((week) => (
                <th
                  key={week.id}
                  colSpan={week.colSpan}
                  className={`${week.colorClass} text-white py-1.5 px-2 border border-slate-700/30 text-xs font-bold uppercase tracking-wider`}
                >
                  {week.name}
                </th>
              ))}

              {/* Total Completed header (spans 2 rows) */}
              <th
                rowSpan={2}
                className="bg-[#0B2A6F] text-white px-3 py-2 border border-[#0B2A6F] min-w-[170px] max-w-[200px] text-center align-middle"
              >
                <span className="text-xs uppercase font-extrabold tracking-wider">
                  Total Completed
                </span>
              </th>
            </tr>

            {/* ROW 2: Day Subheaders (Weekday on top, Day Number below) */}
            <tr>
              {weeks.map((week) =>
                week.days.map((day) => (
                  <th
                    key={`header-${day.dateStr}`}
                    id={`day-col-${day.dateStr}`}
                    className={`${week.colorClass} text-white py-1 px-1 border border-white/20 text-center font-semibold min-w-[34px] max-w-[38px] transition-colors ${
                      day.isToday ? 'relative ring-2 ring-emerald-400 z-10' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center leading-tight">
                      <span className="text-[10px] font-normal uppercase opacity-90">
                        {day.weekday}
                      </span>
                      <span className="text-xs font-bold">
                        {day.dayNumber}
                      </span>
                      {day.isToday && (
                        <span className="text-[8px] bg-emerald-500 text-white px-1 rounded-sm mt-0.5 font-bold uppercase tracking-tighter">
                          Now
                        </span>
                      )}
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>

          {/* TABLE BODY: Habit Rows */}
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {habits.map((habit, index) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                index={index}
                days={days}
                ticks={ticks}
                onToggleTick={onToggleTick}
                onRename={onRenameHabit}
                onUpdateStartDate={onUpdateHabitStartDate}
                onDeleteRequest={onDeleteRequest}
                totalDaysInMonth={totalDays}
                trackerStartDate={startDate}
              />
            ))}

            {/* Bottom summary row: Total Completed per day */}
            <tr className="bg-slate-100/80 dark:bg-slate-800/80 font-semibold border-t-2 border-slate-300 dark:border-slate-700">
              <td className="sticky left-0 z-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 font-mono text-xs flex items-center justify-between shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                <span>Daily Total Done</span>
              </td>
              {dailyTotals.map((tot, idx) => (
                <td
                  key={`daily-tot-${idx}`}
                  className="p-1 text-center border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{tot.count}</span>
                    <span className="text-[9px] text-slate-400 font-normal">{tot.pct}%</span>
                  </div>
                </td>
              ))}
              <td className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-center text-[11px] font-mono text-slate-600 dark:text-slate-300">
                —
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Grid Footer Controls: Add Habit button / Form */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="flex flex-wrap items-center gap-2 max-w-xl w-full">
            <input
              type="text"
              autoFocus
              placeholder="Enter new habit name..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="flex-1 min-w-[180px] text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-excel-navy"
            />
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600">
              <span className="text-[11px] font-semibold text-slate-500">Starts:</span>
              <input
                type="date"
                value={newHabitStartDate}
                onChange={(e) => setNewHabitStartDate(e.target.value)}
                className="text-xs font-mono bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                title="Start date for this habit (counts from this day)"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95"
            >
              Add Habit
            </button>
            <button
              type="button"
              onClick={() => {
                setNewHabitName('');
                setIsAdding(false);
              }}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-excel-navy dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 hover:border-excel-navy dark:hover:border-blue-400 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Habit
          </button>
        )}

        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          Tip: Habits count starting from the day they are added · Double-click to rename
        </div>
      </div>
    </div>
  );
}
