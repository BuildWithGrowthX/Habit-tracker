import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import CheckboxCell from '../UI/CheckboxCell';
import { formatToExcelDate, getTodayStr } from '../../utils/dateUtils';

export default function HabitRow({
  habit,
  index,
  days,
  ticks,
  onToggleTick,
  onRename,
  onUpdateStartDate,
  onDeleteRequest,
  totalDaysInMonth,
  trackerStartDate
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editStartDate, setEditStartDate] = useState(habit.createdAt || trackerStartDate || getTodayStr());
  const inputRef = useRef(null);

  const todayStr = getTodayStr();
  const habitStartDate = habit.createdAt || trackerStartDate || todayStr;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveRename = () => {
    if (editName.trim()) {
      onRename(habit.id, editName.trim(), editStartDate || habitStartDate);
    } else {
      setEditName(habit.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      setEditName(habit.name);
      setEditStartDate(habitStartDate);
      setIsEditing(false);
    }
  };

  // Only count days from when the habit was started
  const eligibleDays = days.filter(day => !habitStartDate || day.dateStr >= habitStartDate);
  const eligibleCount = eligibleDays.length;

  let completedCount = 0;
  eligibleDays.forEach(day => {
    if (ticks[day.dateStr]?.[habit.id]) {
      completedCount++;
    }
  });

  const completionPct = eligibleCount > 0 ? Math.round((completedCount / eligibleCount) * 100) : 0;
  const isStartedAfterMonth = eligibleCount === 0;

  // Habit numbering starting from 1
  const habitNumber = index + 1;

  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
      {/* Habit Names Column (sticky left for horizontal scrolling) */}
      <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 px-3 py-1.5 min-w-[210px] max-w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-2">
          {/* Row number indicator starting from 1 */}
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 w-4 select-none">
            {habitNumber}
          </span>

          {isEditing ? (
            <div className="flex flex-col gap-1 flex-1 py-1">
              <div className="flex items-center gap-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full text-xs font-medium px-2 py-0.5 border border-excel-bluePrimary rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
                <button
                  onClick={handleSaveRename}
                  className="p-1 text-emerald-600 hover:text-emerald-700"
                  title="Save"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setEditName(habit.name);
                    setEditStartDate(habitStartDate);
                    setIsEditing(false);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span>Starts:</span>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  className="text-[10px] font-mono bg-slate-50 dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          ) : (
            <div
              onDoubleClick={() => setIsEditing(true)}
              className="flex-1 flex flex-col justify-center cursor-pointer select-none group/name py-0.5"
              title="Double-click to rename"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover/name:text-blue-600 dark:group-hover/name:text-blue-400">
                  {habit.name}
                </span>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 pl-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded"
                    title="Rename or edit habit"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteRequest(habit)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Delete habit"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Habit start date indicator with inline date picker & Today button */}
              <div
                className="flex items-center gap-1 mt-0.5 text-[10px]"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[9px]">
                  Started:
                </span>
                <input
                  type="date"
                  value={habitStartDate}
                  onChange={(e) => {
                    if (e.target.value && onUpdateStartDate) {
                      onUpdateStartDate(habit.id, e.target.value);
                    }
                  }}
                  className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded px-1 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer hover:border-blue-400"
                  title="Change start date for this habit"
                />
                {habitStartDate !== todayStr && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onUpdateStartDate) onUpdateStartDate(habit.id, todayStr);
                    }}
                    className="text-[9px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 px-1 py-0.2 rounded font-semibold border border-blue-200 dark:border-blue-800 transition-colors"
                    title="Set habit start date to Today"
                  >
                    Today
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </td>

      {/* Day Checkboxes */}
      {days.map((day) => {
        const isBeforeCreation = !!(habitStartDate && day.dateStr < habitStartDate);
        const isChecked = !isBeforeCreation && !!ticks[day.dateStr]?.[habit.id];

        return (
          <CheckboxCell
            key={`${habit.id}-${day.dateStr}`}
            checked={isChecked}
            onChange={() => onToggleTick(day.dateStr, habit.id)}
            isToday={day.isToday}
            isFuture={day.isFuture}
            isPast={day.isPast}
            isBeforeCreation={isBeforeCreation}
            dayNumber={day.dayNumber}
            habitName={habit.name}
            dateStr={day.dateStr}
          />
        );
      })}

      {/* Total Completed Column (horizontal green progress bar + count out of eligible days) */}
      <td className="border border-slate-200 dark:border-slate-700/80 px-3 py-1.5 min-w-[170px] max-w-[200px] bg-white dark:bg-slate-900">
        {isStartedAfterMonth ? (
          <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-mono italic">
            Not started this month
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            {/* Green horizontal bar */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-3 rounded-[2px] overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-[2px] transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            {/* Number and % based on eligible days */}
            <span className="text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 min-w-[58px] text-right">
              {completedCount}/{eligibleCount}{' '}
              <span className="text-[10px] text-slate-400 font-normal">({completionPct}%)</span>
            </span>
          </div>
        )}
      </td>
    </tr>
  );
}
