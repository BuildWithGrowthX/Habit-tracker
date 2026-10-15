import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  get6Months,
  getTodayStr,
  parseDateStr,
  toDateStr
} from '../utils/dateUtils';
import {
  INITIAL_HABITS,
  generateInitialTicks
} from '../utils/initialData';
import {
  calculateMonthStats,
  calculateOverviewStats
} from '../utils/statsUtils';
import {
  loadFromStorage,
  saveToStorage,
  exportDataAsJson,
  validateImportData,
  STORAGE_KEYS
} from '../utils/storage';

export function useHabitTracker() {
  // 1. Start Date (default = today's date)
  const [startDate, setStartDateState] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.START_DATE, null);
    const today = getTodayStr();
    // If no saved date or was the old initial default '2026-10-01', default to today
    if (!saved || saved === '2026-10-01') return today;
    return saved;
  });

  // 2. Active Tab ('overview' | 'month-1' | 'month-2' | 'month-3' | 'month-4' | 'month-5' | 'month-6')
  const [activeTab, setActiveTab] = useState('month-1');

  // 3. Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.THEME, false);
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveToStorage(STORAGE_KEYS.THEME, isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // 4. Compute 6 months structure based on startDate
  const months = useMemo(() => {
    return get6Months(startDate);
  }, [startDate]);

  // 5. Habits List
  const [habits, setHabits] = useState(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.HABITS, INITIAL_HABITS);
    const today = getTodayStr();
    return loaded.map(h => {
      const isInitialHabit = INITIAL_HABITS.some(initH => initH.id === h.id);
      let createdAt = h.createdAt;
      // Auto-migrate: If user habit had no createdAt or had 2026-10-01 from old fallback, set to today
      if (!createdAt || (!isInitialHabit && createdAt === '2026-10-01')) {
        createdAt = today;
      }
      return {
        ...h,
        createdAt
      };
    });
  });

  // 6. Ticks data: { [dateStr]: { [habitId]: boolean } }
  const [ticks, setTicks] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.TICKS, null);
    if (saved) return saved;
    // Default pre-fill Month 1 with sample ticks
    const initialMonths = get6Months(startDate);
    const month1Days = initialMonths[0]?.days || [];
    return generateInitialTicks(month1Days);
  });

  // Save changes to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.START_DATE, startDate);
  }, [startDate]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HABITS, habits);
  }, [habits]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TICKS, ticks);
  }, [ticks]);

  // Set start date and recalculate
  const setStartDate = useCallback((newDateStr) => {
    setStartDateState(newDateStr);
  }, []);

  // Toggle tick for a specific habit on a specific date
  const toggleTick = useCallback((dateStr, habitId) => {
    setTicks(prevTicks => {
      const currentDayTicks = { ...(prevTicks[dateStr] || {}) };
      const willBeChecked = !currentDayTicks[habitId];
      currentDayTicks[habitId] = willBeChecked;

      // Check if all habits are now completed for this day to trigger confetti!
      if (willBeChecked && habits.length > 0) {
        const checkedCount = Object.values(currentDayTicks).filter(Boolean).length;
        if (checkedCount === habits.length) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#16A34A', '#1E88E5', '#64B5F6', '#F59E0B']
            });
          } catch (e) {
            // Ignore confetti errors if canvas fails
          }
        }
      }

      return {
        ...prevTicks,
        [dateStr]: currentDayTicks
      };
    });
  }, [habits.length]);

  // Add new habit (starts from habitStartDate or today)
  const addHabit = useCallback((name, habitStartDate) => {
    if (!name || !name.trim()) return;
    const newHabit = {
      id: `habit-${Date.now()}`,
      name: name.trim(),
      createdAt: habitStartDate || getTodayStr(),
      icon: 'check-circle',
      color: '#16A34A'
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  // Rename habit and optionally update start date
  const renameHabit = useCallback((id, newName, newStartDate) => {
    if (!newName || !newName.trim()) return;
    setHabits(prev =>
      prev.map(h => (h.id === id ? {
        ...h,
        name: newName.trim(),
        createdAt: newStartDate || h.createdAt || getTodayStr()
      } : h))
    );
  }, []);

  // Direct update of habit start date
  const updateHabitStartDate = useCallback((id, newStartDate) => {
    if (!newStartDate) return;
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, createdAt: newStartDate } : h))
    );
  }, []);

  // Delete habit
  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    // Clean up ticks for this habit
    setTicks(prev => {
      const updated = {};
      Object.keys(prev).forEach(date => {
        const dayCopy = { ...prev[date] };
        delete dayCopy[id];
        updated[date] = dayCopy;
      });
      return updated;
    });
  }, []);

  // Load sample data
  const loadSampleData = useCallback(() => {
    const month1Days = months[0]?.days || [];
    const sampleHabits = INITIAL_HABITS.map(h => ({
      ...h,
      createdAt: startDate
    }));
    setHabits(sampleHabits);
    setTicks(generateInitialTicks(month1Days));
  }, [months, startDate]);

  // Clear all sample ticks
  const clearTicks = useCallback(() => {
    setTicks({});
  }, []);

  // Reset entire application to fresh state
  const resetAll = useCallback(() => {
    const today = getTodayStr();
    setStartDateState(today);
    setHabits(INITIAL_HABITS.map(h => ({ ...h, createdAt: today })));
    setTicks({});
    setActiveTab('month-1');
  }, []);

  // Jump to Today
  const jumpToToday = useCallback(() => {
    const todayStr = getTodayStr();
    const foundMonth = months.find(m => {
      return m.days.some(d => d.dateStr === todayStr);
    });

    if (foundMonth) {
      setActiveTab(foundMonth.id);
    } else {
      setStartDateState(todayStr);
      setActiveTab('month-1');
    }

    // Scroll today's column into view smoothly
    setTimeout(() => {
      const todayEl = document.getElementById(`day-col-${todayStr}`);
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 150);
  }, [months]);

  // Export JSON
  const handleExport = useCallback(() => {
    exportDataAsJson(startDate, habits, ticks);
  }, [startDate, habits, ticks]);

  // Import JSON
  const handleImport = useCallback((jsonData) => {
    try {
      const valid = validateImportData(jsonData);
      setStartDateState(valid.startDate);
      setHabits(valid.habits);
      setTicks(valid.ticks);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Current Month Data
  const currentMonth = useMemo(() => {
    if (activeTab === 'overview') return null;
    return months.find(m => m.id === activeTab) || months[0];
  }, [months, activeTab]);

  // Current Month Stats
  const currentMonthStats = useMemo(() => {
    if (!currentMonth) return null;
    return calculateMonthStats(currentMonth, habits, ticks);
  }, [currentMonth, habits, ticks]);

  // Overview 6-month Stats
  const overviewStats = useMemo(() => {
    return calculateOverviewStats(months, habits, ticks, startDate);
  }, [months, habits, ticks, startDate]);

  return {
    startDate,
    setStartDate,
    months,
    activeTab,
    setActiveTab,
    habits,
    ticks,
    toggleTick,
    addHabit,
    renameHabit,
    updateHabitStartDate,
    deleteHabit,
    currentMonth,
    currentMonthStats,
    overviewStats,
    isDarkMode,
    toggleDarkMode,
    jumpToToday,
    handleExport,
    handleImport,
    loadSampleData,
    clearTicks,
    resetAll
  };
}
