import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyBarChart({ monthlyData, isDarkMode }) {
  if (!monthlyData || monthlyData.length === 0) return null;

  const labels = monthlyData.map(m => m.shortLabel || m.tabName);
  const dataPoints = monthlyData.map(m => m.pct);

  // Gradient colors for each of the 6 months matching Excel dashboard palette
  const barColors = [
    '#0B2A6F',
    '#1565C0',
    '#1E88E5',
    '#2563EB',
    '#3B82F6',
    '#60A5FA'
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Month Completion %',
        data: dataPoints,
        backgroundColor: barColors,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 36
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
            return monthlyData[index].fullLabel;
          },
          label: (context) => {
            const index = context.dataIndex;
            const m = monthlyData[index];
            return `Score: ${context.parsed.y}% (${m.ticks} total ticks)`;
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
          font: { family: 'Inter', size: 11, weight: '600' }
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
            6-Month Monthly Comparison
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Side-by-side completion rate across Month 1 to Month 6
          </p>
        </div>
      </div>
      <div className="h-48 sm:h-56 w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
