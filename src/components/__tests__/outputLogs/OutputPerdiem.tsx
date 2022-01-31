import React from "react";
import { RecoilRoot } from "recoil";

import { act, fireEvent, flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { projectsListOne, timelogs } from "../../__dummyDataForTests/__dummyData";
import OutputPerdiem from "../../outputLogs/OutputPerdiem";

beforeEach(() => {
  jest.clearAllMocks();
});

it("is rendert", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOne));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogs));
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <OutputPerdiem monthIsClosed={false} log={timelogs.perdiems[0]} index={0} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  //act(() => {});
  //console.log(element.debug(undefined, 600000));
  expect(element.container).toHaveTextContent("testMePerdiem");
});

it("delete btn is there when month is open", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOne));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogs));
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <OutputPerdiem monthIsClosed={false} log={timelogs.perdiems[0]} index={0} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  //act(() => {});
  //console.log(element.debug(undefined, 600000));
  expect(element.getByTestId(`OutputPerdiem_delete-error-btn`)).toBeInTheDocument();
});

it("delete btn is not there when month is closed", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOne));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(true));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogs));
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <OutputPerdiem monthIsClosed={true} log={timelogs.perdiems[0]} index={0} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  //act(() => {});
  //console.log(element.debug(undefined, 600000));
  expect(element.queryByTestId("OutputPerdiem_delete-error-btn")).toBeNull();
});

// it("right perdiem model is shown", async () => {
//!this test needs to run in its own suit
// });

it("click delete calls function", async () => {
  const mockFetchDelete = jest
    .spyOn(api, "fetchDelete")
    .mockImplementation((_) => Promise.resolve());
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOne));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogs));
  jest.spyOn(api, "fetchDelete").mockImplementation((_) => Promise.resolve());
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <OutputPerdiem monthIsClosed={false} log={timelogs.perdiems[0]} index={0} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  await act(async () => {
    fireEvent.click(element.getByTestId("OutputPerdiem_delete-error-btn"));
  });
  //console.log(element.debug(undefined, 600000));
  expect(mockFetchDelete).toHaveBeenCalled();
});
