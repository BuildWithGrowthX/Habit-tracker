import React, { useState } from 'react';

export default function HeatmapCalendar({ allDays, months }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  if (!allDays || allDays.length === 0) return null;

  // Map days into 7 rows (Sunday to Saturday) and columns (weeks)
  // Determine weekday offset for the first day
  const firstDay = new Date(allDays[0].dateStr + 'T12:00:00');
  const startDayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon ...

  // Organize days into columns of 7 days
  const columns = [];
  let currentCol = [];

  // Pad beginning of first week
  for (let i = 0; i < startDayOfWeek; i++) {
    currentCol.push(null);
  }

  allDays.forEach((day) => {
    currentCol.push(day);
    if (currentCol.length === 7) {
      columns.push(currentCol);
      currentCol = [];
    }
  });

  if (currentCol.length > 0) {
    while (currentCol.length < 7) {
      currentCol.push(null);
    }
    columns.push(currentCol);
  }

  // Get color intensity based on completion %
  const getCellColor = (day) => {
    if (!day) return 'opacity-0 pointer-events-none';
    if (day.pct === 0) {
      return 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60';
    }
    if (day.pct <= 25) {
      return 'bg-emerald-200 dark:bg-emerald-900/70 border border-emerald-300 dark:border-emerald-800';
    }
    if (day.pct <= 50) {
      return 'bg-emerald-400 dark:bg-emerald-700 border border-emerald-500 dark:border-emerald-600';
    }
    if (day.pct <= 75) {
      return 'bg-emerald-500 dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500';
    }
    return 'bg-emerald-700 dark:bg-emerald-500 border border-emerald-800 dark:border-emerald-400';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            180-Day Consistency Heatmap
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Every square represents a day over the 6-month tracker
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-200 dark:bg-emerald-900" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 dark:bg-emerald-700" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 dark:bg-emerald-600" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700 dark:bg-emerald-500" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2 relative">
        <div className="inline-flex gap-2 min-w-full">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between py-0.5 text-[9px] font-medium text-slate-400 dark:text-slate-500 select-none pr-1">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          {/* Grid columns */}
          <div className="flex gap-[3.5px]">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-[3.5px]">
                {col.map((day, rowIdx) => {
                  if (!day) {
                    return <div key={`empty-${rowIdx}`} className="w-[12px] h-[12px]" />;
                  }

                  const isHovered = hoveredDay?.dateStr === day.dateStr;

                  return (
                    <div
                      key={day.dateStr}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-[12px] h-[12px] rounded-[2px] cursor-pointer transition-transform duration-100 ${getCellColor(
                        day
                      )} ${isHovered ? 'scale-125 z-10 ring-2 ring-blue-500' : 'hover:scale-110'}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Hover Info Tooltip Bar */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 min-h-[24px] text-xs">
          {hoveredDay ? (
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              <span className="font-semibold">{hoveredDay.dateStr}</span> ({hoveredDay.weekday}):{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {hoveredDay.done} of {hoveredDay.total} habits
              </span>{' '}
              ({hoveredDay.pct}%)
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Hover over any square to see daily completion breakdown
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
