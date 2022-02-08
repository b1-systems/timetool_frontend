import React from "react";
import { RecoilRoot } from "recoil";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import {
  projectsList,
  projectsListEmpty,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputDefaultTimelog from "../../inputLogs/InputDefaultTimelog";

beforeEach(() => {
  jest.clearAllMocks();
});

it("warning no_timelogs_in_this_project shows", async () => {
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
        <InputDefaultTimelog
          types={["test1", "test2"]}
          remote="remote"
          setRemote={() => {}}
          setUuidLog={() => {}}
          setBreakTime={() => {}}
          setTravelTime={() => {}}
          breakTime={10}
          travelTime={10}
          setLogMsg={() => {}}
          logMsg={"test"}
        />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("no_timelogs_in_this_project");
});

it("input fields are shown", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsList));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <InputDefaultTimelog
          remote="remote"
          setRemote={() => {}}
          setUuidLog={() => {}}
          types={["timelog"]}
          setBreakTime={() => {}}
          setTravelTime={() => {}}
          breakTime={10}
          travelTime={10}
          setLogMsg={() => {}}
          logMsg={"test"}
        />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("break_time_(minutes)");
});

it("raveltime and braktime are set", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsList));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <InputDefaultTimelog
          remote="remote"
          setRemote={() => {}}
          setUuidLog={() => {}}
          types={["timelog"]}
          setBreakTime={() => {}}
          setTravelTime={() => {}}
          breakTime={10}
          travelTime={12}
          setLogMsg={() => {}}
          logMsg={"test"}
        />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  const travel = element.getByLabelText("travel_time_(minutes)");
  const breaktime = element.getByLabelText("break_time_(minutes)");
  expect(travel).toHaveValue(12);
  expect(breaktime).toHaveValue(10);
});
