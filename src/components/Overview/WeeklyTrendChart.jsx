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

export default function WeeklyTrendChart({ weeklyData, isDarkMode }) {
  if (!weeklyData || weeklyData.length === 0) return null;

  const labels = weeklyData.map(w => w.label);
  const dataPoints = weeklyData.map(w => w.pct);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weekly Completion %',
        data: dataPoints,
        borderColor: '#1E88E5',
        backgroundColor: 'rgba(30, 136, 229, 0.12)',
        borderWidth: 2.5,
        pointBackgroundColor: '#1E88E5',
        pointBorderColor: isDarkMode ? '#1E293B' : '#FFFFFF',
        pointBorderWidth: 1.5,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
            return weeklyData[index].fullLabel;
          },
          label: (context) => {
            const index = context.dataIndex;
            const w = weeklyData[index];
            return `Completion: ${context.parsed.y}% (${w.done}/${w.total} ticks)`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          borderColor: isDarkMode ? '#334155' : '#CBD5E1'
        },
        ticks: {
          color: isDarkMode ? '#94A3B8' : '#64748B',
          font: { family: 'Inter', size: 10, weight: '500' },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 14
        }
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`,
          color: isDarkMode ? '#94A3B8' : '#64748B',
          font: { family: 'Inter', size: 10, weight: '500' }
        },
        grid: {
          color: isDarkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            26-Week Completion Trend
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Weekly average habit consistency across all 6 months
          </p>
        </div>
      </div>
      <div className="h-48 sm:h-56 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
