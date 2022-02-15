import React from "react";

import { flushPromisesAndTimers, render } from "../../../test/utils";
import * as api from "../../api";
import MainGrid from "../MainGrid";
import { projectsListOneTimelog, timelogs } from "../__dummyDataForTests/__dummyData";

/**
 * pLOT_t_f stands for Mocks:
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
  element = render(<MainGrid />);
});
afterEach(() => {
  jest.clearAllMocks();
});

it("autoselect fills Project if only one is available", async () => {
  await flushPromisesAndTimers();
  expect(element.container).not.toHaveTextContent("select_a_project");
});
