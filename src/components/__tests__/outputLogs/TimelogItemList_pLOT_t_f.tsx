import React from "react";

import { act, fireEvent, flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import {
  projectsListOneTimelog,
  timelogs,
} from "../../__dummyDataForTests/__dummyData";
import TimelogItemList from "../../outputLogs/TimelogItemList";

/**
 * pL_f_t stands for Mocks:
 * "fetchProjects" -> _pLOT = projectsListOneTimelog,
 * "fetchCurrentMonthLogs" -> _t = timelogs
 * "fetchIsMonthClosed" -> _f = false,
 */

let element: any;
beforeEach(() => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOneTimelog));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogs));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  element = render(
    <TimelogItemList setEndMonthOpen={() => {}} monthIsClosed={false} />,
  );
});
afterEach(() => {
  jest.clearAllMocks();
});

it("is rendert", async () => {
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("end_month");
});

it("TimelogItemList has all 3 types", async () => {
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("perdiem");
  expect(element.container).toHaveTextContent("timelog");
  expect(element.container).toHaveTextContent("shift");
});

it("click delete calls function", async () => {
  const mockFetchDelete = jest
    .spyOn(api, "fetchDelete")
    .mockImplementation((_) => Promise.resolve());
  await flushPromisesAndTimers();
  await act(async () => {
    fireEvent.click(element.getByTestId("OutputTimelog_delete-error-btn_index-0"));
  });
  expect(mockFetchDelete).toHaveBeenCalled();
});

it("expand Icon shows more", async () => {
  await flushPromisesAndTimers();
  await act(async () => {
    fireEvent.click(element.getByTestId("OutputTimelog_expand-info-btn_index-0"));
  });
  expect(
    element.getByTestId("OutputTimelog_expandLess-icon_index-0"),
  ).toBeInTheDocument();
});
