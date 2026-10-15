/**
 * Statistical calculations for Habits Tracker (Month View and Overview)
 */

/**
 * Calculate statistics for a single month
 */
export function calculateMonthStats(month, habits, ticks) {
  if (!month || !month.days || habits.length === 0) {
    return {
      bestHabit: { name: 'None', count: 0, pct: 0 },
      worstHabit: { name: 'None', count: 0, pct: 0 },
      complete100Days: 0,
      complete50Days: 0,
      complete0Days: 0,
      dailyPercentages: [],
      habitCompletions: {},
      totalTicks: 0,
      overallMonthPct: 0
    };
  }

  const days = month.days;
  const daysCount = days.length;

  // Initialize habit completion counters
  const habitCompletions = {};
  habits.forEach(h => {
    habitCompletions[h.id] = {
      id: h.id,
      name: h.name,
      createdAt: h.createdAt,
      count: 0,
      pct: 0
    };
  });

  let complete100Days = 0;
  let complete50Days = 0;
  let complete0Days = 0;
  let monthTotalTicks = 0;

  const dailyPercentages = days.map((day) => {
    const dayTicks = ticks[day.dateStr] || {};
    let doneToday = 0;

    // Only habits active on this day (createdAt <= day.dateStr or no createdAt)
    const activeHabitsToday = habits.filter(h => !h.createdAt || h.createdAt <= day.dateStr);
    const activeTotalToday = activeHabitsToday.length;

    activeHabitsToday.forEach(h => {
      if (dayTicks[h.id]) {
        doneToday++;
        habitCompletions[h.id].count++;
        monthTotalTicks++;
      }
    });

    const pct = activeTotalToday > 0 ? Math.round((doneToday / activeTotalToday) * 100) : 0;

    if (activeTotalToday > 0) {
      if (pct === 100) {
        complete100Days++;
      }
      if (pct >= 50) {
        complete50Days++;
      }
      if (pct === 0) {
        complete0Days++;
      }
    }

    return {
      dayNumber: day.dayNumber,
      dateStr: day.dateStr,
      weekday: day.weekday,
      completed: doneToday,
      total: activeTotalToday,
      pct
    };
  });

  // Calculate percentages per habit based on their active/eligible days in this month
  let totalPossible = 0;
  const habitList = Object.values(habitCompletions).map(h => {
    const eligibleDaysCount = days.filter(d => !h.createdAt || d.dateStr >= h.createdAt).length;
    totalPossible += eligibleDaysCount;
    const pct = eligibleDaysCount > 0 ? Math.round((h.count / eligibleDaysCount) * 100) : 0;
    return { ...h, pct, eligibleDaysCount };
  });

  // Filter habits that were active at least 1 day this month for best/worst calculation
  const activeHabitsThisMonth = habitList.filter(h => h.eligibleDaysCount > 0);
  const sorted = [...activeHabitsThisMonth].sort((a, b) => {
    // Sort by count first, then by pct
    if (b.count !== a.count) return b.count - a.count;
    return b.pct - a.pct;
  });

  const bestHabit = sorted[0] || { name: 'None', count: 0, pct: 0 };
  const worstHabit = sorted[sorted.length - 1] || { name: 'None', count: 0, pct: 0 };

  const overallMonthPct = totalPossible > 0 ? Math.round((monthTotalTicks / totalPossible) * 100) : 0;

  return {
    bestHabit,
    worstHabit,
    complete100Days,
    complete50Days,
    complete0Days,
    dailyPercentages,
    habitCompletions: habitList.reduce((acc, h) => ({ ...acc, [h.id]: h }), {}),
    totalTicks: monthTotalTicks,
    overallMonthPct
  };
}

/**
 * Calculate Overview 6-month statistics
 */
export function calculateOverviewStats(months, habits, ticks, startDateStr) {
  if (!months || months.length === 0 || habits.length === 0) {
    return {
      overallPct: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalTicks: 0,
      bestHabitOverall: { name: 'None', pct: 0, count: 0 },
      worstHabitOverall: { name: 'None', pct: 0, count: 0 },
      monthlyBreakdown: [],
      weeklyBreakdown: [],
      habitPerformance: [],
      allDays: [],
      motivationalMessage: 'Start your journey today!'
    };
  }

  const allDays = [];
  months.forEach(m => {
    m.days.forEach(d => {
      allDays.push(d);
    });
  });

  const totalDays = allDays.length;

  let totalTicks = 0;
  let totalPossible = 0;
  const habitTotals = {};
  habits.forEach(h => {
    habitTotals[h.id] = { id: h.id, name: h.name, createdAt: h.createdAt, count: 0, monthlyCounts: {} };
  });

  // Collect day-by-day status
  const dayStats = allDays.map(day => {
    const dayTicks = ticks[day.dateStr] || {};
    let done = 0;

    const activeHabitsToday = habits.filter(h => !h.createdAt || h.createdAt <= day.dateStr);
    const activeTotal = activeHabitsToday.length;

    activeHabitsToday.forEach(h => {
      if (dayTicks[h.id]) {
        done++;
        totalTicks++;
        habitTotals[h.id].count++;
      }
    });

    totalPossible += activeTotal;

    const pct = activeTotal > 0 ? Math.round((done / activeTotal) * 100) : 0;
    return {
      ...day,
      done,
      total: activeTotal,
      pct,
      hasActivity: done > 0
    };
  });

  // Calculate Streaks (consecutive days with at least 1 habit completed)
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const pastAndTodayDays = dayStats.filter(d => d.dateStr <= todayStr);

  for (let i = 0; i < dayStats.length; i++) {
    if (dayStats[i].hasActivity) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Current streak counting backwards from today or last recorded day
  for (let i = pastAndTodayDays.length - 1; i >= 0; i--) {
    if (pastAndTodayDays[i].hasActivity) {
      currentStreak++;
    } else {
      // If today has 0 activity yet, check if yesterday had streak
      if (i === pastAndTodayDays.length - 1 && pastAndTodayDays[i].dateStr === todayStr) {
        continue; // Give user the benefit of today being in progress
      }
      break;
    }
  }

  // Monthly breakdown
  const monthlyBreakdown = months.map(m => {
    const mStats = calculateMonthStats(m, habits, ticks);
    return {
      monthId: m.id,
      tabName: m.tabName,
      fullLabel: m.fullLabel,
      shortLabel: m.shortLabel,
      daysCount: m.daysCount,
      pct: mStats.overallMonthPct,
      ticks: mStats.totalTicks,
      complete100Days: mStats.complete100Days,
      complete50Days: mStats.complete50Days
    };
  });

  // Weekly breakdown across 26 weeks (~180 days / 7 = 25.7 weeks)
  const weeklyBreakdown = [];
  const WEEKS_COUNT = Math.ceil(totalDays / 7);

  for (let w = 0; w < WEEKS_COUNT; w++) {
    const weekDays = dayStats.slice(w * 7, (w + 1) * 7);
    if (weekDays.length === 0) continue;

    let weekDone = 0;
    let weekTotal = 0;
    weekDays.forEach(d => {
      weekDone += d.done;
      weekTotal += d.total;
    });

    const weekPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
    const firstDate = weekDays[0].dateStr;
    const lastDate = weekDays[weekDays.length - 1].dateStr;

    weeklyBreakdown.push({
      weekIndex: w + 1,
      label: `W${w + 1}`,
      fullLabel: `Week ${w + 1} (${firstDate.slice(5)} to ${lastDate.slice(5)})`,
      pct: weekPct,
      done: weekDone,
      total: weekTotal
    });
  }

  // Per habit performance table across Month 1 - 6
  const habitPerformance = habits.map(h => {
    const monthlyPcts = months.map(m => {
      const mDays = m.days;
      const eligibleDays = mDays.filter(d => !h.createdAt || d.dateStr >= h.createdAt);
      let mDone = 0;
      eligibleDays.forEach(d => {
        if (ticks[d.dateStr]?.[h.id]) mDone++;
      });

      const notStarted = eligibleDays.length === 0;
      const pct = eligibleDays.length > 0 ? Math.round((mDone / eligibleDays.length) * 100) : 0;
      return {
        monthIndex: m.index,
        monthName: m.tabName,
        count: mDone,
        eligibleCount: eligibleDays.length,
        notStarted,
        pct
      };
    });

    const eligibleDaysAll = allDays.filter(d => !h.createdAt || d.dateStr >= h.createdAt);
    const totalCount = habitTotals[h.id]?.count || 0;
    const overallHabitPct = eligibleDaysAll.length > 0 ? Math.round((totalCount / eligibleDaysAll.length) * 100) : 0;

    // Trend calculation
    const activeMonths = monthlyPcts.filter(m => !m.notStarted);
    let trend = 'stable';
    if (activeMonths.length >= 2) {
      const latest = activeMonths[activeMonths.length - 1].pct;
      const prev = activeMonths[activeMonths.length - 2].pct;
      if (latest > prev + 5) trend = 'up';
      else if (latest < prev - 5) trend = 'down';
    }

    return {
      id: h.id,
      name: h.name,
      createdAt: h.createdAt,
      monthlyPcts,
      totalCount,
      eligibleDaysCount: eligibleDaysAll.length,
      overallHabitPct,
      trend
    };
  });

  // Best and worst habits overall among active habits
  const activeHabits = habitPerformance.filter(h => h.eligibleDaysCount > 0);
  const sortedHabits = [...activeHabits].sort((a, b) => {
    if (b.overallHabitPct !== a.overallHabitPct) return b.overallHabitPct - a.overallHabitPct;
    return b.totalCount - a.totalCount;
  });

  const bestHabitOverall = sortedHabits[0] || { name: 'None', overallHabitPct: 0, totalCount: 0 };
  const worstHabitOverall = sortedHabits[sortedHabits.length - 1] || { name: 'None', overallHabitPct: 0, totalCount: 0 };

  const overallPct = totalPossible > 0 ? Math.round((totalTicks / totalPossible) * 100) : 0;

  // Motivational message
  let motivationalMessage = "Welcome! Consistency is key to building lifelong habits.";
  const pastDaysCount = pastAndTodayDays.length;
  const timeProgressPct = Math.min(100, Math.round((pastDaysCount / totalDays) * 100));

  if (currentStreak >= 14) {
    motivationalMessage = `🔥 On fire! ${currentStreak}-day active streak! Keep the unstoppable momentum going!`;
  } else if (currentStreak >= 7) {
    motivationalMessage = `⚡ Great job! You've built a solid ${currentStreak}-day streak this week!`;
  } else if (overallPct >= 80) {
    motivationalMessage = `🌟 Incredible discipline! You're operating at ${overallPct}% habit completion!`;
  } else if (timeProgressPct > 0) {
    motivationalMessage = `🚀 You're ${timeProgressPct}% through your 6-month journey with ${totalTicks} habits completed! Keep going!`;
  }

  return {
    overallPct,
    currentStreak,
    longestStreak,
    totalTicks,
    bestHabitOverall,
    worstHabitOverall,
    monthlyBreakdown,
    weeklyBreakdown,
    habitPerformance,
    allDays: dayStats,
    motivationalMessage,
    timeProgressPct
  };
}
