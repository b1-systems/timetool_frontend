import { DateTime } from "luxon";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import { fetchIsMonthClosed } from "../api";

export const currentDay = DateTime.now().set({
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0,
});

const selectedDate = atom({
  key: "selectedDate",
  default: currentDay,
});
export const useSelectedDate = () => {
  return useRecoilState(selectedDate);
};

export const selectedMonth = selector({
  key: "selectedMonth",
  get: ({ get }) => {
    const selectedDateValue = get(selectedDate);
    return selectedDateValue.set({
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  },
  set: ({ set }, newValue) => {
    set(selectedDate, newValue);
  },
});
export const useSelectedMonth = () => {
  return useRecoilState(selectedMonth);
};

const monthClosed = selector({
  key: "isMonthClosedState",
  get: ({ get }) => {
    const selectedMonthValue = get(selectedMonth);
    return fetchIsMonthClosed({
      year: selectedMonthValue.year.toString(),
      month: selectedMonthValue.month.toString(),
      format: "traditional",
      scope: "me",
    });
  },
});
export const useIsMonthClosed = () => {
  return useRecoilValue(monthClosed);
};
