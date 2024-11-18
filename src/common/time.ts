import { addSeconds, isAfter } from 'date-fns';
import { TimeService } from './time-service';

const timeService = new TimeService();

export function getNow() {
  return timeService.getNow();
}

export function getNowStartOfDay() {
  const now = timeService.getNow();
  now.setUTCHours(0, 0, 0, 0);
  return now;
}

export function getNowMinusDays(days: number) {
  return new Date(+getNow() - days * 24 * 60 * 60 * 1000);
}

export function isExpiredAfter(
  createdAt: Date,
  expireAfterSeconds: number,
): boolean {
  return isAfter(getNow(), addSeconds(createdAt, expireAfterSeconds));
}
