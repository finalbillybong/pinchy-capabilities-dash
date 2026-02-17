const DAYS = ['sundays', 'mondays', 'tuesdays', 'wednesdays', 'thursdays', 'fridays', 'saturdays'];
const DAYS_SHORT = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * Parse human-readable schedules like "07:00 daily" or "17:00 Fridays"
 * and return the next occurrence as a Date.
 */
export function getNextRun(schedule) {
  if (!schedule) return null;

  const s = schedule.toLowerCase().trim();
  const timeMatch = s.match(/^(\d{1,2}):(\d{2})/);
  if (!timeMatch) return null;

  const hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);
  const rest = s.slice(timeMatch[0].length).trim();

  const now = new Date();

  if (rest === 'daily' || rest === 'every day') {
    const today = new Date(now);
    today.setHours(hour, minute, 0, 0);
    if (today > now) return today;
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  // Match day name
  const dayIndex = DAYS.findIndex(d => rest.startsWith(d)) !== -1
    ? DAYS.findIndex(d => rest.startsWith(d))
    : DAYS_SHORT.findIndex(d => rest.startsWith(d));

  if (dayIndex >= 0) {
    const today = now.getDay();
    let daysUntil = dayIndex - today;
    if (daysUntil < 0) daysUntil += 7;
    if (daysUntil === 0) {
      const candidate = new Date(now);
      candidate.setHours(hour, minute, 0, 0);
      if (candidate > now) return candidate;
      daysUntil = 7;
    }
    const next = new Date(now);
    next.setDate(next.getDate() + daysUntil);
    next.setHours(hour, minute, 0, 0);
    return next;
  }

  return null;
}

/**
 * Format a next-run Date as a friendly relative string.
 */
export function formatNextRun(date) {
  if (!date) return null;

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) {
    if (diffMins < 60) return `in ${diffMins}m`;
    return `today ${timeStr}`;
  }
  if (isTomorrow) return `tomorrow ${timeStr}`;

  const dayName = date.toLocaleDateString([], { weekday: 'short' });
  return `${dayName} ${timeStr}`;
}
