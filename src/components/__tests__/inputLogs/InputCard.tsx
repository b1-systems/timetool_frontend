import React from 'react';
import { RecoilRoot } from 'recoil';

import { flushPromisesAndTimers, render } from '../../../../test/utils';
import * as api from '../../../api';
import {
	projectsList,
	projectsListEmpty,
	projectsListOneTimelog,
	timelogsEmpty,
} from '../../__dummyDataForTests/__dummyData';
import InputCard from '../../inputLogs/InputCard';

beforeEach(() => {
  jest.clearAllMocks();
});

it("InputCard with empty projects", async () => {
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
    <RecoilRoot>
      <React.Suspense fallback="test">
        <InputCard monthIsClosed={false} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("day");
  expect(element.container).toHaveTextContent("type");
});

it("both commit btn are renderd", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListOneTimelog));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  let element = render(
    <RecoilRoot>
      <React.Suspense fallback="test">
        <InputCard monthIsClosed={false} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  expect(element.getByTestId("InputCard_commit-info-btn_index")).toBeTruthy();
  expect(element.getByTestId("InputCard_commit-stay_date-btn_index")).toBeTruthy();
});
