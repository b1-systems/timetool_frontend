import { DateTime } from "luxon";
import { atom, selector, useSetRecoilState } from "recoil";

import { fetchCurrentMonthLogs } from "../api";
import { Logs, Timelog } from "../models";
import { selectedMonth } from "./selectedDate";

export const logsRequestTime = atom({
  key: "logsRequestTime",
  default: DateTime.now(),
});

export const useUpdateLogs = () => {
  const setLogsRequestTime = useSetRecoilState(logsRequestTime);
  return () => {
    setLogsRequestTime(DateTime.now());
  };
};

export const currentMonthLogsState = selector<Logs>({
  key: "currentMonthLogsState",
  get: async ({ get }) => {
    get(logsRequestTime);
    const month = get(selectedMonth);
    return fetchCurrentMonthLogs({
      year: month.year.toString(),
      month: month.month.toString(),
      format: "traditional",
      scope: "me",
    });
  },
});

export const currentMonthLogsPerdiemsState = selector<Timelog[]>({
  key: "currentMonthLogsPerdiemsState",
  get: async ({ get }) => {
    const monthLogs = get(currentMonthLogsState);
    return monthLogs.perdiems;
  },
});

export const currentMonthLogsTimelogsState = selector<Timelog[]>({
  key: "currentMonthLogsTimelogsState",
  get: async ({ get }) => {
    const monthLogs = get(currentMonthLogsState);
    return monthLogs.timelogs;
  },
});
