import React from "react";
import { RecoilRoot } from "recoil";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import {
  projectsListEmpty,
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
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <InputShift
          setUuidLog={() => {}}
          uuidProject={"testUuuidProject"}
          shiftModels={["test1"]}
          setShift={() => {}}
          shift={"testString"}
          incidents={[]}
          setIncidents={() => {}}
          setShiftModel={() => {}}
        />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("no_shifts_in_this_project");
});
