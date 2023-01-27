import { editUUID } from "../../atoms/edit";
import {
    RecoilObserver,
    RecoilStateSetter,
    act,
    flushPromisesAndTimers,
    render,
} from "../../test/utils";
import CancelEditButton from "./CancelEditButton";

describe("Cancel Edit Button", () => {
    it("editUUID", async () => {
        jest.useFakeTimers();
        const changeFn = jest.fn(() => Promise.resolve());
        const { findByTestId } = render(
            <>
                <RecoilStateSetter
                    node={editUUID}
                    value={"54c39a30-8cb3-4122-8de1-51be883d3a6e"}
                />
                <RecoilObserver node={editUUID} onChange={changeFn} />
                <CancelEditButton />
            </>,
        );
        const button = await findByTestId("CancelEditButton--button");
        act(() => button.click());
        await flushPromisesAndTimers();
        expect(changeFn).toHaveBeenLastCalledWith(null);
    });
});
