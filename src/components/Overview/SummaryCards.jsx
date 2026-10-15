import React from 'react';
import {
  Percent,
  Flame,
  Trophy,
  CheckCircle2,
  Award,
  TrendingDown
} from 'lucide-react';

export default function SummaryCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Overall Completion',
      value: `${stats.overallPct}%`,
      subtitle: `${stats.timeProgressPct}% of 6 months elapsed`,
      icon: Percent,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60'
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} Days`,
      subtitle: stats.currentStreak > 0 ? 'Active streak running!' : 'Start a streak today',
      icon: Flame,
      color: 'text-amber-500 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
    },
    {
      title: 'Longest Streak',
      value: `${stats.longestStreak} Days`,
      subtitle: 'Personal record',
      icon: Trophy,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60'
    },
    {
      title: 'Total Ticks',
      value: `${stats.totalTicks}`,
      subtitle: 'Habits completed so far',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60'
    },
    {
      title: 'Best Habit Overall',
      value: stats.bestHabitOverall?.name || 'None',
      subtitle: `${stats.bestHabitOverall?.overallHabitPct || 0}% overall completion`,
      icon: Award,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60'
    },
    {
      title: 'Worst Habit Overall',
      value: stats.worstHabitOverall?.name || 'None',
      subtitle: `${stats.worstHabitOverall?.overallHabitPct || 0}% overall completion`,
      icon: TrendingDown,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border ${card.bgColor} shadow-sm transition-all hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide truncate">
                {card.title}
              </span>
              <IconComponent className={`w-4 h-4 ${card.color} flex-shrink-0`} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100 truncate" title={card.value}>
                {card.value}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
