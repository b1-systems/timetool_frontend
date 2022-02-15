import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { isTimelog } from "../../../models";
import {
  projectsListEmpty,
  timelogs,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputDefaultTimelog from "../../inputLogs/InputDefaultTimelog";

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
  element = isTimelog(timelogs.timelogs[0])
    ? render(
        <InputDefaultTimelog
          types={[""]}
          defaultTimelog={timelogs.timelogs[0]}
          setDefaultTimelog={() => {}}
        />,
      )
    : render(<p>TypeScriptError</p>);
});
afterEach(() => {
  jest.clearAllMocks();
});

it("warning no_timelogs_in_this_project shows", async () => {
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("no_timelogs_in_this_project");
});
