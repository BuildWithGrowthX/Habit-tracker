/**
 * Date utility functions for 6-Month Habit Tracker
 */

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Format Date object to YYYY-MM-DD local string
 */
export function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse YYYY-MM-DD string into a local Date object safely
 */
export function parseDateStr(str) {
  if (!str) return new Date();
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0); // Noon to avoid daylight saving issues
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getTodayStr() {
  return toDateStr(new Date());
}

/**
 * Format YYYY-MM-DD as DD/MM/YYYY (Excel screenshot format: e.g. 01/01/2025)
 */
export function formatToExcelDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Computes 6 consecutive calendar months starting from the month of the startDate
 * Each month has full calendar days (1 to 28/29/30/31), weekday names, week groupings, etc.
 */
export function get6Months(startDateStr) {
  const startDate = parseDateStr(startDateStr);
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth(); // 0-indexed
  const todayStr = getTodayStr();

  const months = [];

  for (let i = 0; i < 6; i++) {
    // Target month and year
    const targetDate = new Date(startYear, startMonth + i, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const monthName = MONTH_NAMES[month];
    
    // Total days in this month
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const d = new Date(year, month, dayNum);
      const dateStr = toDateStr(d);
      const weekday = WEEKDAY_NAMES[d.getDay()];
      
      const isToday = (dateStr === todayStr);
      const isFuture = (dateStr > todayStr);
      const isPast = (dateStr < todayStr);
      const isBeforeStart = (dateStr < startDateStr);

      days.push({
        dayNumber: dayNum,
        dateStr,
        weekday,
        isToday,
        isFuture,
        isPast,
        isBeforeStart
      });
    }

    // Split days into weeks (Week 1: 1-7, Week 2: 8-14, Week 3: 15-21, Week 4: 22-28, Week 5: 29-end)
    const weeks = [];
    const weekRanges = [
      { id: 1, name: 'Week 1', start: 0, end: 7, colorClass: 'bg-[#0B2A6F]' },
      { id: 2, name: 'Week 2', start: 7, end: 14, colorClass: 'bg-[#1565C0]' },
      { id: 3, name: 'Week 3', start: 14, end: 21, colorClass: 'bg-[#1E88E5]' },
      { id: 4, name: 'Week 4', start: 21, end: 28, colorClass: 'bg-[#42A5F5]' },
      { id: 5, name: 'Week 5', start: 28, end: totalDays, colorClass: 'bg-[#64B5F6]' },
    ];

    for (const range of weekRanges) {
      if (range.start < totalDays) {
        const weekDays = days.slice(range.start, Math.min(range.end, totalDays));
        if (weekDays.length > 0) {
          weeks.push({
            id: range.id,
            name: range.name,
            days: weekDays,
            colorClass: range.colorClass,
            colSpan: weekDays.length
          });
        }
      }
    }

    months.push({
      index: i + 1,
      id: `month-${i + 1}`,
      tabName: `Month ${i + 1}`,
      fullLabel: `${monthName} ${year}`,
      shortLabel: `${monthName.slice(0, 3)} ${year}`,
      monthName,
      year,
      monthIndex: month,
      startDateStr: days[0]?.dateStr,
      endDateStr: days[days.length - 1]?.dateStr,
      daysCount: totalDays,
      days,
      weeks
    });
  }

  return months;
}
