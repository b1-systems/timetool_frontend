import { DateTime } from "luxon";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";

import { fetchIsMonthClosed } from "../api";
import { selectedMonth } from "./selectedDate";

export const monthClosedRequestTime = atom({
    key: "monthClosedRequestTime",
    default: DateTime.now(),
});

export const useUpdateIsMonthClosed = () => {
    const setLogsRequestTime = useSetRecoilState(monthClosedRequestTime);
    return () => {
        setLogsRequestTime(DateTime.now());
    };
};

const monthClosed = selector({
    key: "monthClosed",
    get: ({ get }) => {
        get(monthClosedRequestTime);
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
