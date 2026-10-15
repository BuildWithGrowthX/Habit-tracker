import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function HabitComparisonTable({ habitPerformance, months }) {
  if (!habitPerformance || habitPerformance.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Habit Progression Matrix (Month 1 to Month 6)
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Compare how each habit evolves over time with individual progress bars and momentum indicators
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0B2A6F] text-white font-semibold">
              <th className="py-2.5 px-3 border border-slate-700/50 min-w-[180px]">
                Habit
              </th>
              {months.map((m) => (
                <th
                  key={m.id}
                  className="py-2.5 px-2 border border-slate-700/50 min-w-[110px] text-center"
                >
                  <div>{m.tabName}</div>
                  <div className="text-[9px] font-normal opacity-80">{m.shortLabel}</div>
                </th>
              ))}
              <th className="py-2.5 px-3 border border-slate-700/50 min-w-[90px] text-center">
                Overall %
              </th>
              <th className="py-2.5 px-2.5 border border-slate-700/50 min-w-[80px] text-center">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80">
            {habitPerformance.map((h, idx) => (
              <tr
                key={h.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
              >
                {/* Habit name */}
                <td className="py-2.5 px-3 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono w-4">
                      #{idx + 1}
                    </span>
                    <span className="truncate">{h.name}</span>
                  </div>
                </td>

                {/* 6 months columns with mini progress bars */}
                {h.monthlyPcts.map((m) => (
                  <td
                    key={`m-pct-${h.id}-${m.monthIndex}`}
                    className="py-2 px-2 border border-slate-200 dark:border-slate-700 text-center"
                  >
                    {m.notStarted ? (
                      <span
                        className="font-mono text-[11px] text-slate-300 dark:text-slate-600 select-none font-bold"
                        title="Habit not started yet in this month"
                      >
                        —
                      </span>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {m.pct}%
                        </span>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              m.pct >= 70
                                ? 'bg-emerald-600'
                                : m.pct >= 40
                                ? 'bg-blue-500'
                                : m.pct > 0
                                ? 'bg-amber-500'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${m.pct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                ))}

                {/* Overall % */}
                <td className="py-2 px-3 border border-slate-200 dark:border-slate-700 text-center font-mono font-bold text-xs text-slate-800 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-800/40">
                  {h.overallHabitPct}%
                </td>

                {/* Trend indicator */}
                <td className="py-2 px-2 border border-slate-200 dark:border-slate-700 text-center">
                  {h.trend === 'up' ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <TrendingUp className="w-3.5 h-3.5" /> Up
                    </span>
                  ) : h.trend === 'down' ? (
                    <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                      <TrendingDown className="w-3.5 h-3.5" /> Down
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-slate-400 dark:text-slate-500 font-normal text-[11px]">
                      <Minus className="w-3.5 h-3.5" /> Stable
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
