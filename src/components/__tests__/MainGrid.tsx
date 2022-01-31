import React from "react";
import { RecoilRoot } from "recoil";

import { act, fireEvent, flushPromisesAndTimers, render } from "../../../test/utils";
import * as api from "../../api";
import MainGrid from "../MainGrid";
import { projectsListOne, timelogs } from "../__dummyDataForTests/__dummyData";

it("renders", async () => {
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
        <MainGrid />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  //act(() => {});
  //console.log(element.debug(undefined, 600000));
  expect(element.container).toHaveTextContent("project");
  expect(element.container).toHaveTextContent("type");
  expect(element.container).toHaveTextContent("day");
  expect(element.container).toHaveTextContent("Shift Project");
  expect(element.container).toHaveTextContent("perdiem");
  expect(element.container).toHaveTextContent("timelog");
  expect(element.container).toHaveTextContent("shift");
  expect(element.container).toHaveTextContent("keypoint.comment");
  expect(element.container).toHaveTextContent("end_month");
});

it("edit shift is possible", async () => {
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
        <MainGrid />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  await act(async () => {
    fireEvent.click(element.getByTestId("OutputTimelog_edit-warning-btn_index-0"));
  });
  //console.log(element.debug(undefined, 600000));
  expect(element.getByTestId("InputShift_cancel_edit-warning-btn")).toBeInTheDocument();
});

it("edit shift is committed", async () => {
  const mockFetchSubmit = jest
    .spyOn(api, "fetchSubmit")
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
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <MainGrid />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  await act(async () => {
    fireEvent.click(element.getByTestId("OutputTimelog_edit-warning-btn_index-0"));
  });
  await act(async () => {
    fireEvent.click(element.getByTestId("InputCard_commit-info-btn_index"));
  });
  //console.log(element.debug(undefined, 600000));
  expect(mockFetchSubmit).toHaveBeenCalled();
});
