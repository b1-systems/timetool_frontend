import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { isShift } from "../../../models";
import {
  projectsListEmpty,
  timelogs,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputShift from "../../inputLogs/InputShift";

describe("fetchProjects: projectsListEmpty // fetchIsMonthClosed: false // fetchCurrentMonthLogs: timelogsEmpty", () => {
  let element: any;
  beforeEach(() => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsListEmpty));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogsEmpty));
    element = isShift(timelogs.timelogs[2])
      ? render(
          <InputShift
            types={["shift"]}
            shiftTimelog={timelogs.timelogs[2]}
            setShiftTimelog={() => {}}
          />,
        )
      : render(<p>TypeScriptError</p>);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  //!skipped because this error is not anymore that easy to get
  it.skip("warning no_shifts_in_this_project shows up", async () => {
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("no_shifts_in_this_project");
  });
});
