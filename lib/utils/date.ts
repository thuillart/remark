import {
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  startOfDay,
  startOfMonth,
} from "date-fns";

export function getStartOfDay(): Date {
  return startOfDay(new Date());
}

export function getStartOfMonth(): Date {
  return startOfMonth(new Date());
}

export function getTimeUntilNextMonth(): string {
  const now = new Date();
  const nextMonth = startOfMonth(addMonths(now, 1));

  const days = differenceInDays(nextMonth, now);
  const hours = differenceInHours(nextMonth, now) % 24;
  const minutes = differenceInMinutes(nextMonth, now) % 60;

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
}
