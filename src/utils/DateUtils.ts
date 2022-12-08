import { DateTime, Duration } from "luxon";

/**
 * Create a new DateTime object combining the date of the first with the time of date of the second.
 * @param date the DateTime object that will be used for the date
 * @param time the DateTime object that will be used for the time of day
 * @returns a new DateTime object combining date and time
 */
export const combineDateTime = (date: DateTime, time: DateTime) => {
  return time.set({
    year: date.year,
    month: date.month,
    day: date.day,
  });
};

/**
 * Clone a DateTime object to work around the fact that luxon DateTime objects do not support being frozen.
 * @param time the DateTime object to clone
 * @returns a new DateTime object with the same values as the given one
 */
export const cloneDateTime = (time: DateTime) => {
  return DateTime.fromMillis(time.toMillis());
};
/**
 * Clone a Duration object to work around the fact that luxon Duration objects do not support being frozen.
 * @param time the Duration object to clone
 * @returns a new Duration object with the same values as the given one
 */
export const cloneDuration = (duration: Duration) => {
  return Duration.fromMillis(duration.toMillis());
};
