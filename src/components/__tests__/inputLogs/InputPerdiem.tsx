import React from "react";
import { RecoilRoot } from "recoil";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { isPerdiem } from "../../../models";
import {
  projectsListEmpty,
  timelogs,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputPerdiem from "../../inputLogs/InputPerdiem";

it("warning no_perdiems_in_this_project", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListEmpty));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  if (isPerdiem(timelogs.perdiems[0])) {
    let element = render(
      <RecoilRoot initializeState={(snap) => snap}>
        <React.Suspense fallback="test">
          <InputPerdiem
            model={""}
            perdiemTimelog={timelogs.perdiems[0]}
            setPerdiemTimelog={() => {}}
          />
        </React.Suspense>
      </RecoilRoot>,
    );
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("no_perdiems_in_this_project");
  }
});
