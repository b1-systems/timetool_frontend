import { DateTime } from "luxon";
import {
    atom,
    selector,
    selectorFamily,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

import { fetchCurrentMonthLogs } from "../api";
import { Logs, Timelog } from "../models/internal";
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

export const currentMonthLogs = selector<Logs>({
    key: "currentMonthLogs",
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

const timelogForUUID = selectorFamily<Timelog | null, string | null>({
    key: "currentMonthLogs",
    get:
        (uuid) =>
        ({ get }) => {
            const logs = get(currentMonthLogs);
            if (!uuid) return null;
            return (
                logs.perdiems.find((log) => log.uuid === uuid) ||
                logs.timelogs.find((log) => log.uuid === uuid) ||
                null
            );
        },
});
export const useTimelogForUUID = (uuid: string | null) => {
    return useRecoilValue(timelogForUUID(uuid));
};

export const currentMonthLogsPerdiems = selector<Timelog[]>({
    key: "currentMonthLogsPerdiems",
    get: async ({ get }) => {
        const monthLogs = get(currentMonthLogs);
        return monthLogs.perdiems;
    },
});

export const currentMonthLogsTimelogs = selector<Timelog[]>({
    key: "currentMonthLogsTimelogsState",
    get: async ({ get }) => {
        const monthLogs = get(currentMonthLogs);
        return monthLogs.timelogs;
    },
});
