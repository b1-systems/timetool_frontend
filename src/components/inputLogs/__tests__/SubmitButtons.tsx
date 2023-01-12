import { act } from "react-dom/test-utils";
import { flushPromisesAndTimers, render } from "../../../../test/utils";
import SubmitButtons from "../SubmitButtons";

describe("Submit Buttons", () => {
    it("fires the submit function", async () => {
        const submitFn = jest.fn(() => Promise.resolve());
        const {findByTestId} = render(<SubmitButtons submit={submitFn} />);
        const sameDayButton = await findByTestId("SubmitButtons--CommitAndSameDay");
        act(() => sameDayButton.click());
        await flushPromisesAndTimers();
        expect(submitFn).toHaveBeenCalled();
    });

    // TODO
    it("advances the day", async () => {
        const submitFn = jest.fn(() => Promise.resolve());
        const {findByTestId} = render(<SubmitButtons submit={submitFn} />);
        const nextDayButton = await findByTestId("SubmitButtons--CommitAndNextDay");
        act(() => nextDayButton.click());
        await flushPromisesAndTimers();
        expect(submitFn).toHaveBeenCalled();
    });
});