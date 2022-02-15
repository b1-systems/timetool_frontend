import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { Shift } from "../../../models";
import {
  projectsListEmpty,
  timelogs,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputShift from "../../inputLogs/InputShift";

/**
 * pLE_tE_f stands for Mocks:
 * "fetchProjects" -> _pLE = projectsListEmpty,
 * "fetchCurrentMonthLogs" -> _tE = timelogsEmpty
 * "fetchIsMonthClosed" -> _f = false,
 */
let element: any;
beforeEach(() => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListEmpty));

  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  element = render(
    <InputShift
      types={[""]}
      shiftTimelog={timelogs.timelogs[2] as Shift}
      setShiftTimelog={() => {}}
    />,
  );
});
afterEach(() => {
  jest.clearAllMocks();
});

it("warning no_shifts_in_this_project shows up", async () => {
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("no_shifts_in_this_project");
});
