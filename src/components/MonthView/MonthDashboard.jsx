import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatToExcelDate } from '../../utils/dateUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MonthDashboard({
  month,
  stats,
  isDarkMode,
  startDate
}) {
  if (!month || !stats) return null;

  const labels = stats.dailyPercentages.map(d => d.dayNumber.toString());
  const dataPoints = stats.dailyPercentages.map(d => d.pct);

  // Chart configuration matching Excel screenshot:
  // Smooth green line, circular dots on each day, 0% to 100% Y-axis in 20% steps
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Daily Completion %',
        data: dataPoints,
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#16A34A',
        pointBorderColor: isDarkMode ? '#1E293B' : '#FFFFFF',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35, // Smooth curve matching Excel style
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 350
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#0F172A' : '#0B2A6F',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 8,
        displayColors: false,
        callbacks: {
          title: (items) => {
            const index = items[0].dataIndex;
            const dayInfo = stats.dailyPercentages[index];
            return `Day ${dayInfo.dayNumber} (${dayInfo.weekday}, ${formatToExcelDate(dayInfo.dateStr)})`;
          },
          label: (context) => {
            const index = context.dataIndex;
            const dayInfo = stats.dailyPercentages[index];
            return `Completion: ${context.parsed.y}% (${dayInfo.completed}/${dayInfo.total} habits)`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: true,
          borderColor: isDarkMode ? '#334155' : '#CBD5E1'
        },
        ticks: {
          color: isDarkMode ? '#94A3B8' : '#64748B',
          font: { family: 'Inter', size: 11, weight: '500' },
          padding: 4
        }
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`,
          color: isDarkMode ? '#94A3B8' : '#64748B',
          font: { family: 'Inter', size: 11, weight: '500' },
          padding: 8
        },
        grid: {
          color: isDarkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)',
          drawBorder: false
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
      {/* LEFT COLUMN: 3 Navy-blue label boxes with values below */}
      <div className="lg:col-span-3 flex flex-col gap-3.5">
        {/* Habits Start Date */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full bg-[#0B2A6F] text-white py-1 px-3 text-center text-xs font-bold tracking-wider rounded-sm shadow-sm">
            Habits Start Date
          </div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-1 font-mono">
            {formatToExcelDate(startDate || month.startDateStr)}
          </div>
        </div>

        {/* Best Habit */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full bg-[#0B2A6F] text-white py-1 px-3 text-center text-xs font-bold tracking-wider rounded-sm shadow-sm">
            Best Habit
          </div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-1 text-center truncate max-w-full px-2" title={stats.bestHabit.name}>
            {stats.bestHabit.name || 'None yet'}
          </div>
          {stats.bestHabit.name && stats.bestHabit.count > 0 && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {stats.bestHabit.count} days ({stats.bestHabit.pct}%)
            </span>
          )}
        </div>

        {/* Worst Habit */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full bg-[#0B2A6F] text-white py-1 px-3 text-center text-xs font-bold tracking-wider rounded-sm shadow-sm">
            Worst Habit
          </div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-1 text-center truncate max-w-full px-2" title={stats.worstHabit.name}>
            {stats.worstHabit.name || 'None yet'}
          </div>
          {stats.worstHabit.name && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {stats.worstHabit.count} days ({stats.worstHabit.pct}%)
            </span>
          )}
        </div>
      </div>

      {/* CENTER COLUMN: Smooth green line chart */}
      <div className="lg:col-span-6 h-52 sm:h-56 w-full flex flex-col justify-center px-1">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* RIGHT COLUMN: 3 Navy-blue label boxes with values below */}
      <div className="lg:col-span-3 flex flex-col gap-3.5">
        {/* 100% Complete */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full bg-[#0B2A6F] text-white py-1 px-3 text-center text-xs font-bold tracking-wider rounded-sm shadow-sm">
            100% Complete
          </div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-1 font-mono">
            {stats.complete100Days} Days
          </div>
        </div>

        {/* 50% Complete */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full bg-[#0B2A6F] text-white py-1 px-3 text-center text-xs font-bold tracking-wider rounded-sm shadow-sm">
            50% Complete
          </div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-1 font-mono">
            {stats.complete50Days} Days
          </div>
        </div>

        {/* 0% Complete */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full bg-[#0B2A6F] text-white py-1 px-3 text-center text-xs font-bold tracking-wider rounded-sm shadow-sm">
            0% Complete
          </div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-1 font-mono">
            {stats.complete0Days} Days
          </div>
        </div>
      </div>
    </div>
  );
}
