import { DateTime } from "luxon";
import { SetterOrUpdater, atom, selector, useRecoilState } from "recoil";

const _selectedDate = atom<DateTime>({
    key: "_selectedDate",
    default: DateTime.now(),
});
/**
 * Using selector in order to have a custom getter for the atom. Zhis way we can ensure the date always has no time of day.
 * Only use this as a dependency for other atoms or testing. React components should use `useSelectedDate` instead.
 */
export const selectedDate = selector<DateTime>({
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
