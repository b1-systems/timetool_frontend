import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { isPerdiem } from "../../../models";
import {
  projectsListEmpty,
  timelogs,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputPerdiem from "../../inputLogs/InputPerdiem";

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
  element = isPerdiem(timelogs.perdiems[0])
    ? render(
        <InputPerdiem
          types={[""]}
          perdiemTimelog={timelogs.perdiems[0]}
          setPerdiemTimelog={() => {}}
        />,
      )
    : render(<p>TypeScriptError</p>);
});
afterEach(() => {
  jest.clearAllMocks();
});

it("warning no_perdiems_in_this_project", async () => {
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("no_perdiems_in_this_project");
});
