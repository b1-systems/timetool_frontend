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

/**
 * Round a DateTime object to the nearest minute that is a multiple of the given step size.
 * @param stepSize the step size in minutes
 * @returns a new DateTime object with the rounded time
 */
export const roundMinutes = (time: DateTime, stepSize: number) => {
    return time.set({
        minute: Math.floor(time.minute / stepSize) * stepSize,
        second: 0,
        millisecond: 0,
    });
};

export const maxTime = (time1: DateTime, time2: DateTime) => {
    return time1 > time2 ? time1 : time2;
};
export const minTime = (time1: DateTime, time2: DateTime) => {
    return time1 < time2 ? time1 : time2;
};

export const formatDate = (
    date: DateTime,
    lang?: string,
    format?: Intl.DateTimeFormatOptions,
): string =>
    (lang ? date.setLocale(lang) : date).toLocaleString(format || DateTime.DATE_SHORT);

export const formatDateTime = (
    dateTime: DateTime,
    lang?: string,
    format?: Intl.DateTimeFormatOptions,
): string =>
    (lang ? dateTime.setLocale(lang) : dateTime).toLocaleString(
        format || DateTime.DATETIME_SHORT,
    );
