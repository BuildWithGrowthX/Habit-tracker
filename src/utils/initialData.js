/**
 * Initial sample habits and ticks matching the reference Excel dashboard
 */

export const INITIAL_HABITS = [
  { id: 'habit-1', name: 'Daily Exercise', icon: 'dumbbell', color: '#16A34A' },
  { id: 'habit-2', name: 'Bed Before 11pm', icon: 'moon', color: '#16A34A' },
  { id: 'habit-3', name: 'Drink Protein', icon: 'cup-soda', color: '#16A34A' },
  { id: 'habit-4', name: 'Eat Vegetables', icon: 'salad', color: '#16A34A' },
  { id: 'habit-5', name: 'Call Grandparents', icon: 'phone', color: '#16A34A' },
  { id: 'habit-6', name: 'No Snacks', icon: 'cookie', color: '#16A34A' },
  { id: 'habit-7', name: 'Do Homework', icon: 'book-open', color: '#16A34A' },
  { id: 'habit-8', name: 'Water Plants', icon: 'sprout', color: '#16A34A' },
  { id: 'habit-9', name: 'Read 10+ Pages', icon: 'book', color: '#16A34A' },
  { id: 'habit-10', name: 'Make Bed', icon: 'bed', color: '#16A34A' },
];

/**
 * Screenshot binary pattern for days 1 to 21 (and extended 22-31)
 * 1 = completed, 0 = not completed
 * Day 1 is index 0. Matches the chart curve and stats from the reference image.
 */
const SAMPLE_TICK_PATTERNS = {
  // Daily Exercise (Best Habit in screenshot)
  'habit-1': [0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  // Bed Before 11pm
  'habit-2': [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0],
  // Drink Protein
  'habit-3': [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  // Eat Vegetables
  'habit-4': [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Call Grandparents
  'habit-5': [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
  // No Snacks
  'habit-6': [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  // Do Homework
  'habit-7': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0],
  // Water Plants
  'habit-8': [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  // Read 10+ Pages (Worst Habit in screenshot)
  'habit-9': [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Make Bed
  'habit-10': [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0]
};

/**
 * Generate initial ticks mapped by date string:
 * ticks: { [dateStr]: { [habitId]: true | false } }
 */
export function generateInitialTicks(days) {
  const ticks = {};
  if (!days || days.length === 0) return ticks;

  days.forEach((day, index) => {
    ticks[day.dateStr] = {};
    INITIAL_HABITS.forEach((habit) => {
      const pattern = SAMPLE_TICK_PATTERNS[habit.id];
      if (pattern && pattern[index] === 1) {
        ticks[day.dateStr][habit.id] = true;
      }
    });
  });

  return ticks;
}
