# 📊 6-Month Excel-Style Habit Tracker Dashboard

A modern, responsive, 6-Month Habit Tracker web application built with **React**, **Vite**, **Tailwind CSS**, and **Chart.js**. Inspired by professional Excel habit tracker dashboards, this application extends the aesthetic and logic across 6 full consecutive calendar months (~180 days) with instant reactivity and local persistence.

---

## 🚀 Quick Start

Ensure Node.js is installed, then run:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Visit the local URL shown in your terminal (typically `http://localhost:5173/`).

---

## ✨ Features

### 📅 Month View (Matching the Excel Reference Dashboard)
- **3-Column Top Dashboard**:
  - **Left**: Navy-blue label boxes displaying *Habits Start Date*, *Best Habit* (highest completion count), and *Worst Habit* (lowest completion count).
  - **Center**: Smooth green line chart with dots (`Chart.js`) showing daily completion % ($0\%$ to $100\%$ in steps of $20\%$), updating live with every checkbox click.
  - **Right**: Navy-blue label boxes displaying counts for *100% Complete* (all habits done), *50% Complete* (at least half done), and *0% Complete* (no habits done).
- **Excel-Style Habit Grid**:
  - Dark navy header for **Habit Names** and **Total Completed**.
  - Merged week headers: **Week 1**, **Week 2**, **Week 3**, **Week 4**, **Week 5** styled with the distinct dark-to-light blue gradient palette.
  - Day subheaders showing weekday (`Mon`, `Tue`...) and calendar day number (`1`, `2`...).
  - Green checkbox cells: white square with green border when empty, solid green fill with a crisp white tick when completed.
  - **Total Completed**: horizontal green progress bar + completion count and percentage per habit.
  - Highlights today's column and subtly dims future dates while keeping past dates fully editable.
  - Bottom summary row displaying daily total completed habits.

### 🌐 Overview Tab (6-Month Big Picture)
- **Motivational Banner**: Dynamic encouragement based on streaks and progress through the 6-month journey.
- **6 Summary Metric Cards**: Overall completion %, Current streak, Longest streak, Total completed ticks, Best habit overall, Worst habit overall.
- **26-Week Trend Line Chart**: Tracks weekly habit completion averages across all 26 weeks.
- **6-Month Comparison Bar Chart**: Side-by-side completion rate across Month 1 through Month 6.
- **180-Day GitHub-Style Heatmap Calendar**: Visualizes habit density across the entire 6 months with custom tooltips on hover.
- **Habit Progression Matrix Table**: Shows individual habit progression month-by-month with mini progress bars and upward/downward momentum indicators.

### 🛠️ Extra Power Features
- **Habit Management**: Add new habits, inline rename (double-click any habit name), and delete habits with a safety confirmation dialog.
- **Dynamic Start Date**: Changing the start date recalculates all 6 months and calendar alignments.
- **Today Button**: Instantly jumps to the current month and scrolls to highlight today's column.
- **Backup & Restore**: Export all data to a `.json` backup file or restore from file/pasted JSON.
- **Dark Mode**: High-contrast, sleek dark mode toggle preserved in `localStorage`.
- **Celebratory Confetti**: Triggers a burst of confetti whenever you hit $100\%$ completion on any day.
- **Sample Data Toggle**: Comes pre-filled with 10 sample habits matching the reference dashboard, plus a "Clear Sample Data" and "Load Sample Data" button.

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── Header.jsx                 # Top bar: logo, date picker, today button, backup, theme
│   ├── TabNavigation.jsx          # [Overview] [Month 1] ... [Month 6] tabs
│   ├── MonthView/
│   │   ├── MonthView.jsx          # Month tab layout wrapper
│   │   ├── MonthDashboard.jsx     # 3-column top dashboard (Left stats, Line chart, Right counts)
│   │   ├── HabitGrid.jsx          # Excel-style habit grid with week headers & checkboxes
│   │   └── HabitRow.jsx           # Individual habit row with inline rename & progress bar
│   ├── Overview/
│   │   ├── Overview.jsx           # 6-month big picture overview
│   │   ├── SummaryCards.jsx       # 6 metric cards (overall %, streaks, best/worst)
│   │   ├── WeeklyTrendChart.jsx   # 26-week line chart
│   │   ├── MonthlyBarChart.jsx    # 6-month bar chart
│   │   ├── HeatmapCalendar.jsx    # 180-day GitHub-style heatmap
│   │   └── HabitComparisonTable.jsx # Habit matrix with month-by-month progress bars
│   ├── Modals/
│   │   ├── ConfirmModal.jsx       # Reusable modal for destructive actions
│   │   └── ExportImportModal.jsx  # JSON backup export and import
│   └── UI/
│       └── CheckboxCell.jsx       # Custom Excel green checkbox with animations
├── hooks/
│   └── useHabitTracker.js         # Core custom hook managing state, date logic, and actions
└── utils/
    ├── dateUtils.js               # 6-month calendar calculations and formatting
    ├── statsUtils.js              # Completion rates, streaks, best/worst calculations
    ├── initialData.js             # Pre-filled habits and screenshot-matching ticks
    └── storage.js                 # Safe localStorage manager and JSON import/export
```
