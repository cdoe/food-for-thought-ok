import { DateTime, Interval } from 'luxon';

export function timeStringToDateTime(timeString: string, format = 'h:mm a') {
  return DateTime.fromFormat(timeString, format);
}

export function statusFromTimeStrings(startString: string, endString: string, format = 'h:mm a') {
  if (!!startString && !!endString) {
    const now = DateTime.local();
    const startTime = DateTime.fromFormat(startString, format);
    const endTime = DateTime.fromFormat(endString, format);
    const openSoonInterval = Interval.fromDateTimes(startTime.minus({ minutes: 30 }), startTime);
    const openInterval = Interval.fromDateTimes(startTime, endTime);
    const closedSoon = Interval.fromDateTimes(endTime.minus({ minutes: 15 }), endTime);
    if (closedSoon.contains(now)) return 'closed-soon';
    if (openInterval.contains(now)) return 'open';
    if (openSoonInterval.contains(now)) return 'open-soon';
  }
  return null;
}
