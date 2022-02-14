import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { isTimelog } from "../../../models";
import {
  projectsListEmpty,
  projectsListOneTimelog,
  timelogs,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputDefaultTimelog from "../../inputLogs/InputDefaultTimelog";

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
});

describe('fetchProjects: projectsListOneTimelog // fetchIsMonthClosed: false // fetchCurrentMonthLogs: timelogsEmpty & attribute monthIsClosed={["timelog"]}', () => {
  let element: any;
  beforeEach(() => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsListOneTimelog));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogsEmpty));
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
});
