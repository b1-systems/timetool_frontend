import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import {
  projectsListEmpty,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputCard from "../../inputLogs/InputCard";

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
  element = render(<InputCard monthIsClosed={false} />);
});
afterEach(() => {
  jest.clearAllMocks();
});

it("InputCard with empty projects shows select_a_project", async () => {
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("select_a_project");
});
