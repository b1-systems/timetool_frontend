import React from "react";

import { act, fireEvent, render } from "../../../test/utils";
import * as api from "../../api";
import MonthEndDialog from "../MonthEndDialog";

describe("nothing mocked", () => {
  let element: any;
  beforeEach(() => {
    element = render(
      <MonthEndDialog close={() => {}} year={1} monthLong={"January"} />,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders", () => {
    expect(element.getByText("you_are_closing")).toBeInTheDocument();
  });

  it("click yes calls function", async () => {
    const mockFetchCloseMonth = jest
      .spyOn(api, "fetchCloseMonth")
      .mockImplementation((_) => Promise.resolve());
    await act(async () => {
      fireEvent.click(element.getByText("yes"));
    });
    expect(mockFetchCloseMonth).toHaveBeenCalled();
  });
});
