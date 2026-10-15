import React from 'react';
import { Check } from 'lucide-react';

export default function CheckboxCell({
  checked = false,
  onChange,
  isToday = false,
  isFuture = false,
  isPast = false,
  isBeforeCreation = false,
  dayNumber,
  habitName,
  dateStr
}) {
  // If the habit was created after this day, it shouldn't count and shows inactive
  if (isBeforeCreation) {
    return (
      <td
        className="p-0 text-center align-middle border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 select-none h-9 min-w-[34px] max-w-[38px]"
        title={`${habitName} was not started yet on ${dateStr}`}
      >
        <span className="text-[11px] font-mono select-none text-slate-300 dark:text-slate-600 font-bold">
          —
        </span>
      </td>
    );
  }

  return (
    <td
      className={`p-0 text-center align-middle border border-slate-200 dark:border-slate-700/80 transition-colors h-9 min-w-[34px] max-w-[38px] select-none ${
        isToday
          ? 'bg-emerald-50/70 dark:bg-emerald-950/25 ring-1 ring-inset ring-emerald-500/40'
          : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60'
      } ${isFuture ? 'opacity-85' : ''}`}
      title={`${habitName} on ${dateStr}: ${checked ? 'Completed' : 'Pending'}`}
    >
      <button
        type="button"
        onClick={onChange}
        className="w-full h-full flex items-center justify-center p-1 focus:outline-none group cursor-pointer"
        aria-label={`Toggle ${habitName} on ${dateStr}`}
      >
        <div
          className={`w-[19px] h-[19px] rounded-[3px] flex items-center justify-center transition-all duration-150 ${
            checked
              ? 'bg-emerald-600 border border-emerald-600 shadow-sm animate-check-pop'
              : 'border-[1.5px] border-emerald-600/90 bg-white dark:bg-slate-800 hover:border-emerald-700 group-hover:scale-105'
          }`}
        >
          {checked && (
            <Check
              className="w-3.5 h-3.5 text-white stroke-[3.2]"
              aria-hidden="true"
            />
          )}
        </div>
      </button>
    </td>
  );
}
