import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import {
  projectsListOneTimelog,
  timelogs,
} from "../../__dummyDataForTests/__dummyData";
import TimelogItemList from "../../outputLogs/TimelogItemList";

/**
 * pL_t_t stands for Mocks:
 * "fetchProjects" -> _pLOT = projectsListOneTimelog,
 * "fetchCurrentMonthLogs" -> _t = timelogs
 * "fetchIsMonthClosed" -> _t = true,
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
    .mockImplementation((_) => Promise.resolve(true));
  element = render(<TimelogItemList setEndMonthOpen={() => {}} monthIsClosed={true} />);
});
afterEach(() => {
  jest.clearAllMocks();
});

it("month is closed", async () => {
  await flushPromisesAndTimers();
  expect(element.queryByTestId("OutputTimelog_delete-error-btn_index-0")).toBeNull();
});
