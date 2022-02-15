import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { Perdiem } from "../../../models";
import { projectsList, timelogs } from "../../__dummyDataForTests/__dummyData";
import OutputPerdiem from "../../outputLogs/OutputPerdiem";

/**
 * pL_t_t stands for Mocks:
 * "fetchProjects" -> _pL = projectsList,
 * "fetchCurrentMonthLogs" -> _t = timelogs
 * "fetchIsMonthClosed" -> _t = true,
 */

let element: any;
beforeEach(() => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsList));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogs));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(true));
  element = render(
    <OutputPerdiem
      monthIsClosed={true}
      log={timelogs.perdiems[0] as Perdiem}
      index={0}
    />,
  );
});
afterEach(() => {
  jest.clearAllMocks();
});

it("delete btn is not there when month is closed", async () => {
  await flushPromisesAndTimers();
  expect(element.queryByTestId("OutputPerdiem_delete-error-btn")).toBeNull();
});
