import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { isTimelog } from "../../../models";
import {
  projectsListOneTimelog,
  timelogs,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputDefaultTimelog from "../../inputLogs/InputDefaultTimelog";

/**
 * pLOT_tE_f stands for Mocks:
 * "fetchProjects" -> _pLE = projectsListOneTimelog,
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
  element = isTimelog(timelogs.timelogs[0])
    ? render(
        <InputDefaultTimelog
          types={["timelog"]}
          defaultTimelog={timelogs.timelogs[0]}
          setDefaultTimelog={() => {}}
        />,
      )
    : render(<p>TypeScriptError</p>);
});
afterEach(() => {
  jest.clearAllMocks();
});

it("input fields are shown", async () => {
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("break_time_(minutes)");
  expect(element.container).toHaveTextContent("travel_time_(minutes)");
});

it("traveltime and braktime are set", async () => {
  await flushPromisesAndTimers();
  const travel = element.getByLabelText("travel_time_(minutes)");
  const breaktime = element.getByLabelText("break_time_(minutes)");
  expect(travel).toHaveValue(2);
  expect(breaktime).toHaveValue(1);
});
