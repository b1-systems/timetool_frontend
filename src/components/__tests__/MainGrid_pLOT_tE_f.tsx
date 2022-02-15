import React from "react";

import { flushPromisesAndTimers, render } from "../../../test/utils";
import * as api from "../../api";
import MainGrid from "../MainGrid";
import {
  projectsListOneTimelog,
  timelogsEmpty,
} from "../__dummyDataForTests/__dummyData";

/**
 * pLOT_tE_f stands for Mocks:
 * "fetchProjects" -> _pLOT = projectsListOneTimelog,
 * "fetchCurrentMonthLogs" -> _tE = timelogsEmpty
 * "fetchIsMonthClosed" -> _f = false,
 */

let element: any;
beforeEach(() => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOneTimelog));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  element = render(<MainGrid />);
});
afterEach(() => {
  jest.clearAllMocks();
});

it("both commit btn are renderd", async () => {
  await flushPromisesAndTimers();
  expect(element.getByTestId("InputCard_commit-info-btn_index")).toBeTruthy();
  expect(element.getByTestId("InputCard_commit-stay_date-btn_index")).toBeTruthy();
});
