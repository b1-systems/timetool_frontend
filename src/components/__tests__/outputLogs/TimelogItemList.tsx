import React from "react";
import { RecoilRoot } from "recoil";

import { act, fireEvent, flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { projectsListOne, timelogs } from "../../__dummyDataForTests/__dummyData";
import TimelogItemList from "../../outputLogs/TimelogItemList";

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
        <TimelogItemList setEndMonthOpen={() => {}} monthIsClosed={false} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  //act(() => {});
  //console.log(element.debug(undefined, 600000));
  expect(element.container).toHaveTextContent("end_month");
});

it("TimelogItemList has all 3 types", async () => {
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
        <TimelogItemList setEndMonthOpen={() => {}} monthIsClosed={false} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  //act(() => {});
  //console.log(element.debug(undefined, 600000));
  expect(element.container).toHaveTextContent("perdiem");
  expect(element.container).toHaveTextContent("timelog");
  expect(element.container).toHaveTextContent("shift");
});

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
        <TimelogItemList setEndMonthOpen={() => {}} monthIsClosed={false} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  await act(async () => {
    fireEvent.click(element.getByTestId("OutputTimelog_delete-error-btn_index-0"));
  });
  //console.log(element.debug(undefined, 600000));
  expect(mockFetchDelete).toHaveBeenCalled();
});

it("expand Icon shows more", async () => {
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
        <TimelogItemList setEndMonthOpen={() => {}} monthIsClosed={false} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  await act(async () => {
    fireEvent.click(element.getByTestId("OutputTimelog_expand-info-btn_index-0"));
  });
  //console.log(element.debug(undefined, 600000));
  expect(
    element.getByTestId("OutputTimelog_expandLess-icon_index-0"),
  ).toBeInTheDocument();
});

it("month is closed", async () => {
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogs));
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <TimelogItemList setEndMonthOpen={() => {}} monthIsClosed={true} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  //console.log(element.debug(undefined, 600000));
  expect(element.queryByTestId("OutputTimelog_delete-error-btn_index-0")).toBeNull();
});
