import React from "react";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import {
  projectsListEmpty,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputCard from "../../inputLogs/InputCard";

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
    element = render(<InputCard monthIsClosed={false} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("InputCard with empty projects", async () => {
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("select_a_project");
  });
});
