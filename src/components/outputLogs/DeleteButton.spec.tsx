import { editUUID } from "../../atoms/edit";
import * as lib from "../../lib";
import {
    RecoilObserver,
    RecoilStateSetter,
    act,
    flushPromisesAndTimers,
    render,
} from "../../test/utils";
import DeleteButton from "./DeleteButton";

describe("Delete Button", () => {
    it("calls the lib function", async () => {
        jest.useFakeTimers();

        const mockDelete = jest
            .spyOn(lib, "deleteTimelog")
            .mockResolvedValue(Promise.resolve());

        const { findByTestId } = render(
            <>
                <DeleteButton uuid="54c39a30-8cb3-4122-8de1-51be883d3a6e" />
            </>,
        );
        const button = await findByTestId("DeleteButton--button");
        act(() => button.click());
        await flushPromisesAndTimers();
        expect(mockDelete).toHaveBeenCalledWith({
            uuid: "54c39a30-8cb3-4122-8de1-51be883d3a6e",
        });
    });
});
