import React from "react";
import { RecoilRoot } from "recoil";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { isShift } from "../../../models";
import {
  projectsListEmpty,
  timelogs,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputShift from "../../inputLogs/InputShift";

it("warning no_shifts_in_this_project shows up", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListEmpty));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  if (isShift(timelogs.timelogs[2])) {
    let element = render(
      <RecoilRoot initializeState={(snap) => snap}>
        <React.Suspense fallback="test">
          <InputShift
            shiftType={""}
            shiftTimelog={timelogs.timelogs[2]}
            setShiftTimelog={() => {}}
          />
        </React.Suspense>
      </RecoilRoot>,
    );
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("no_shifts_in_this_project");
  }
});
