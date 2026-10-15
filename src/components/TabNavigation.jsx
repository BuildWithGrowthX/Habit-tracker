import React from 'react';
import { LayoutDashboard, Calendar } from 'lucide-react';
import { getTodayStr } from '../utils/dateUtils';

export default function TabNavigation({
  months,
  activeTab,
  onTabChange
}) {
  const todayStr = getTodayStr();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-700/80 scrollbar-none select-none">
      {/* Overview Tab */}
      <button
        onClick={() => onTabChange('overview')}
        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-all duration-150 flex-shrink-0 ${
          activeTab === 'overview'
            ? 'bg-[#0B2A6F] text-white shadow-sm ring-1 ring-inset ring-[#0B2A6F]'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-t border-x border-slate-200 dark:border-slate-700'
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>Overview (6-Month)</span>
      </button>

      {/* Month 1 to Month 6 Tabs */}
      {months.map((m) => {
        const isActive = activeTab === m.id;
        const hasToday = m.days.some(d => d.dateStr === todayStr);

        return (
          <button
            key={m.id}
            onClick={() => onTabChange(m.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-all duration-150 flex-shrink-0 relative ${
              isActive
                ? 'bg-[#0B2A6F] text-white shadow-sm ring-1 ring-inset ring-[#0B2A6F]'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-t border-x border-slate-200 dark:border-slate-700'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{m.tabName}</span>
            <span
              className={`text-[10px] font-normal px-1.5 py-0.2 rounded ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              {m.shortLabel}
            </span>
            {hasToday && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-200 animate-pulse"
                title="Current Month"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
