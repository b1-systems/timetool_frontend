import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";

export const useDateTimeFormatter = () => {
  const { i18n } = useTranslation();
  return {
    formatDate: (dt: DateTime, format?: Intl.DateTimeFormatOptions) =>
      formatDate(dt, i18n.language, format),
    formatDateTime: (dt: DateTime, format?: Intl.DateTimeFormatOptions) =>
      formatDateTime(dt, i18n.language, format),
  };
};

export const formatDate = (
  dt: DateTime,
  lng?: string,
  format?: Intl.DateTimeFormatOptions,
): string =>
  (lng ? dt.setLocale(lng) : dt).toLocaleString(format || DateTime.DATE_SHORT);

export const formatDateTime = (
  dt: DateTime,
  lng?: string,
  format?: Intl.DateTimeFormatOptions,
): string =>
  (lng ? dt.setLocale(lng) : dt).toLocaleString(format || DateTime.DATETIME_SHORT);
