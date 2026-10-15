import React from 'react';
import { Sparkles } from 'lucide-react';
import SummaryCards from './SummaryCards';
import WeeklyTrendChart from './WeeklyTrendChart';
import MonthlyBarChart from './MonthlyBarChart';
import HeatmapCalendar from './HeatmapCalendar';
import HabitComparisonTable from './HabitComparisonTable';

export default function Overview({
  stats,
  months,
  isDarkMode
}) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Motivational Message Banner */}
      <div className="bg-gradient-to-r from-excel-navy via-blue-800 to-indigo-900 text-white rounded-xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm flex-shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight">
              {stats.motivationalMessage}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Tracking 6 months of daily consistency · Every tick counts toward long-term transformation.
            </p>
          </div>
        </div>

        {/* Small Progress Pill */}
        <div className="hidden sm:flex flex-col items-end flex-shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
            6-Month Progress
          </span>
          <span className="text-lg font-black font-mono">
            {stats.timeProgressPct}%
          </span>
        </div>
      </div>

      {/* 6 Summary Cards */}
      <SummaryCards stats={stats} />

      {/* Two Column Charts: 26-Week Line Chart & Monthly Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeeklyTrendChart
          weeklyData={stats.weeklyBreakdown}
          isDarkMode={isDarkMode}
        />
        <MonthlyBarChart
          monthlyData={stats.monthlyBreakdown}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* 180-Day GitHub-style Heatmap */}
      <HeatmapCalendar
        allDays={stats.allDays}
        months={months}
      />

      {/* Per-Habit Comparison Matrix */}
      <HabitComparisonTable
        habitPerformance={stats.habitPerformance}
        months={months}
      />
    </div>
  );
}
