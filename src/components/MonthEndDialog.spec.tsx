import { DateTime } from "luxon";

import { selectedDate } from "../atoms/selectedDate";
import * as lib from "../lib";
import { RecoilStateSetter, act, flushPromisesAndTimers, render } from "../test/utils";
import MonthEndDialog from "./MonthEndDialog";

describe("MonthEndDialog", () => {
    it("calls the close month lib function", async () => {
        jest.useFakeTimers();

        const mockCloseMonth = jest
            .spyOn(lib, "closeMonth")
            .mockResolvedValue(Promise.resolve());

        const { findByTestId } = render(
            <>
                <RecoilStateSetter
                    node={selectedDate}
                    value={DateTime.fromObject({
                        year: 2000,
                        month: 3,
                        day: 10,
                    })}
                />
                <MonthEndDialog close={() => {}} />
            </>,
        );
        const button = await findByTestId("MonthEndDialog--button--yes");
        act(() => button.click());
        await flushPromisesAndTimers();
        expect(mockCloseMonth).toHaveBeenCalled();
    });
});
