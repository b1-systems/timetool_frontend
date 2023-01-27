import { selectedDate } from "../../atoms/selectedDate";
import { RecoilObserver, act, flushPromisesAndTimers, render } from "../../test/utils";
import SubmitButtons from "./SubmitButtons";

describe("Submit Buttons", () => {
    it("fires the submit function", async () => {
        jest.useFakeTimers();
        const submitFn = jest.fn(() => Promise.resolve());
        const { findByTestId } = render(<SubmitButtons submit={submitFn} />);
        const sameDayButton = await findByTestId("SubmitButtons--CommitAndSameDay");
        act(() => sameDayButton.click());
        await flushPromisesAndTimers();
        expect(submitFn).toHaveBeenCalled();
    });

    it("changes the day", async () => {
        jest.useFakeTimers();
        const changeFn = jest.fn(() => {});
        const { findByTestId } = render(
            <>
                <RecoilObserver node={selectedDate} onChange={changeFn} />
                <SubmitButtons submit={() => Promise.resolve()} />
            </>,
        );
        const nextDayButton = await findByTestId("SubmitButtons--CommitAndNextDay");
        act(() => nextDayButton.click());
        await flushPromisesAndTimers();
        expect(changeFn).toHaveBeenCalledTimes(2); // the initial render will always call the effect at least once
    });

    it("doesn't change the day", async () => {
        jest.useFakeTimers();
        const changeFn = jest.fn(() => {});
        const { findByTestId } = render(
            <>
                <RecoilObserver node={selectedDate} onChange={changeFn} />
                <SubmitButtons submit={() => Promise.resolve()} />
            </>,
        );
        const sameDayButton = await findByTestId("SubmitButtons--CommitAndSameDay");
        act(() => sameDayButton.click());
        await flushPromisesAndTimers();
        expect(changeFn).toHaveBeenCalledTimes(1); // only on the initial render
    });
});
