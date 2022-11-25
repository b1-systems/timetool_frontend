import { DateTime } from "luxon";
import {
  SetterOrUpdater,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import { fetchIsMonthClosed } from "../api";

const _selectedDate = atom<DateTime>({
  key: "_selectedDate",
  default: DateTime.now(),
  effects: [() => console.log("_selectedDate effect")],
});
// using selector in order to have a custom getter for the atom
// this way we can ensure the date always has no time of day
const selectedDate = selector<DateTime>({
  key: "selectedDate",
  get: ({ get }) =>
    get(_selectedDate).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }),
  set: ({ set }, newValue) => set(_selectedDate, newValue),
});
export const useSelectedDate = (): [DateTime, SetterOrUpdater<DateTime>] => {
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
  key: "monthClosed",
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
