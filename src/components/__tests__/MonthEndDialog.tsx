import React from "react";
import { RecoilRoot } from "recoil";

import { act, fireEvent, render } from "../../../test/utils";
import * as api from "../../api";
import MonthEndDialog from "../MonthEndDialog";

it("renders", () => {
  const element = render(
    <RecoilRoot>
      <React.Suspense fallback="test">
        <MonthEndDialog close={() => {}} year={1} monthLong={"January"} />
      </React.Suspense>
    </RecoilRoot>,
  );
  expect(element.getByText("you_are_closing")).toBeInTheDocument();
});

it("click yes calls function", async () => {
  const mockFetchCloseMonth = jest
    .spyOn(api, "fetchCloseMonth")
    .mockImplementation((_) => Promise.resolve());
  const element = render(
    <RecoilRoot>
      <React.Suspense fallback="test">
        <MonthEndDialog close={() => {}} year={1} monthLong={"January"} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await act(async () => {
    fireEvent.click(element.getByText("yes"));
  });
  expect(mockFetchCloseMonth).toHaveBeenCalled();
});
