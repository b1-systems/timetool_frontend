import React from 'react';
import { RecoilRoot } from 'recoil';

import { flushPromisesAndTimers, render } from '../../../../test/utils';
import * as api from '../../../api';
import { isTimelog } from '../../../models';
import {
	projectsListEmpty,
	projectsListOneTimelog,
	timelogs,
	timelogsEmpty,
} from '../../__dummyDataForTests/__dummyData';
import InputDefaultTimelog from '../../inputLogs/InputDefaultTimelog';

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
  if (isTimelog(timelogs.timelogs[0])) {
    let element = render(
      <RecoilRoot initializeState={(snap) => snap}>
        <React.Suspense fallback="test">
          <InputDefaultTimelog
            types={[""]}
            defaultTimelog={timelogs.timelogs[0]}
            setDefaultTimelog={() => {}}
          />
        </React.Suspense>
      </RecoilRoot>,
    );
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("no_timelogs_in_this_project");
  }
});

it("input fields are shown", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOneTimelog));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  if (isTimelog(timelogs.timelogs[0])) {
    let element = render(
      <RecoilRoot initializeState={(snap) => snap}>
        <React.Suspense fallback="test">
          <InputDefaultTimelog
            types={["timelog"]}
            defaultTimelog={timelogs.timelogs[0]}
            setDefaultTimelog={() => {}}
          />
        </React.Suspense>
      </RecoilRoot>,
    );
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("break_time_(minutes)");
    expect(element.container).toHaveTextContent("travel_time_(minutes)");
  }
});

it("traveltime and braktime are set", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOneTimelog));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  if (isTimelog(timelogs.timelogs[0])) {
    let element = render(
      <RecoilRoot initializeState={(snap) => snap}>
        <React.Suspense fallback="test">
          <InputDefaultTimelog
            types={["timelog"]}
            defaultTimelog={timelogs.timelogs[0]}
            setDefaultTimelog={() => {}}
          />
        </React.Suspense>
      </RecoilRoot>,
    );
    await flushPromisesAndTimers();
    const travel = element.getByLabelText("travel_time_(minutes)");
    const breaktime = element.getByLabelText("break_time_(minutes)");
    expect(travel).toHaveValue(2);
    expect(breaktime).toHaveValue(1);
  }
});

it("show warning no_timelogs_in_this_project, when type not in project", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOneTimelog));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  if (isTimelog(timelogs.timelogs[0])) {
    let element = render(
      <RecoilRoot initializeState={(snap) => snap}>
        <React.Suspense fallback="test">
          <InputDefaultTimelog
            types={[""]}
            defaultTimelog={timelogs.timelogs[0]}
            setDefaultTimelog={() => {}}
          />
        </React.Suspense>
      </RecoilRoot>,
    );
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("no_timelogs_in_this_project");
  }
});
