/**
 * Safe localStorage manager and JSON export/import utilities
 */

const STORAGE_KEYS = {
  HABITS: 'excel_habits_list_v1',
  TICKS: 'excel_habits_ticks_v1',
  START_DATE: 'excel_habits_start_date_v1',
  THEME: 'excel_habits_theme_v1'
};

export function loadFromStorage(key, fallbackValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return fallbackValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function clearStorageKey(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing ${key}:`, error);
  }
}

/**
 * Export all tracker data as a downloadable JSON file
 */
export function exportDataAsJson(startDate, habits, ticks) {
  const exportPayload = {
    version: '1.0',
    appName: '6-Month Excel Habit Tracker',
    exportDate: new Date().toISOString(),
    startDate,
    habits,
    ticks
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(exportPayload, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute(
    'download',
    `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Validate imported JSON structure
 */
export function validateImportData(jsonData) {
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Invalid JSON file format.');
  }

  if (!Array.isArray(jsonData.habits)) {
    throw new Error('Missing or invalid "habits" array in backup file.');
  }

  if (!jsonData.ticks || typeof jsonData.ticks !== 'object') {
    throw new Error('Missing or invalid "ticks" data in backup file.');
  }

  return {
    startDate: jsonData.startDate || new Date().toISOString().split('T')[0],
    habits: jsonData.habits,
    ticks: jsonData.ticks
  };
}

export { STORAGE_KEYS };
