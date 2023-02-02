import { editUUID } from "../../atoms/edit";
import {
    RecoilObserver,
    RecoilStateSetter,
    act,
    flushPromisesAndTimers,
    render,
} from "../../test/utils";
import EditButton from "./EditButton";

describe("Edit Button", () => {
    it("sets the editUUID", async () => {
        jest.useFakeTimers();
        const changeFn = jest.fn(() => Promise.resolve());
        const { findByTestId } = render(
            <>
                <RecoilStateSetter node={editUUID} value={null} />
                <RecoilObserver node={editUUID} onChange={changeFn} />
                <EditButton uuid="54c39a30-8cb3-4122-8de1-51be883d3a6e" />
            </>,
        );
        const button = await findByTestId("EditButton--button");
        act(() => button.click());
        await flushPromisesAndTimers();
        expect(changeFn).toHaveBeenLastCalledWith(
            "54c39a30-8cb3-4122-8de1-51be883d3a6e",
        );
    });
});
