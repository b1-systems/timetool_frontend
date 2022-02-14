import React from "react";

import { act, fireEvent, flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { isPerdiem } from "../../../models";
import {
  projectsList,
  projectsListOneTimelog,
  timelogs,
} from "../../__dummyDataForTests/__dummyData";
import OutputPerdiem from "../../outputLogs/OutputPerdiem";

describe("fetchProjects: projectsListOneTimelog // fetchIsMonthClosed: false // fetchCurrentMonthLogs: timelogs", () => {
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
      .mockImplementation((_) => Promise.resolve(timelogs));
    element = isPerdiem(timelogs.perdiems[0])
      ? render(
          <OutputPerdiem monthIsClosed={false} log={timelogs.perdiems[0]} index={0} />,
        )
      : render(<p>TypeScriptError</p>);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("is rendert", async () => {
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("testMePerdiem");
  });

  it("delete btn is there when month is open", async () => {
    await flushPromisesAndTimers();
    expect(element.getByTestId(`OutputPerdiem_delete-error-btn`)).toBeInTheDocument();
  });

  it("click delete calls function", async () => {
    const mockFetchDelete = jest
      .spyOn(api, "fetchDelete")
      .mockImplementation((_) => Promise.resolve());
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputPerdiem_delete-error-btn"));
    });
    expect(mockFetchDelete).toHaveBeenCalled();
  });
});

describe("fetchProjects: projectsListOneTimelog // fetchIsMonthClosed: true // fetchCurrentMonthLogs: timelogs attribute monthIsClosed={true}", () => {
  let element: any;
  beforeEach(() => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsListOneTimelog));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(true));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    element = isPerdiem(timelogs.perdiems[0])
      ? render(
          <OutputPerdiem monthIsClosed={true} log={timelogs.perdiems[0]} index={0} />,
        )
      : render(<p>TypeScriptError</p>);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("delete btn is not there when month is closed", async () => {
    await flushPromisesAndTimers();
    expect(element.queryByTestId("OutputPerdiem_delete-error-btn")).toBeNull();
  });
});

describe("fetchProjects: projectsList // fetchIsMonthClosed: false // fetchCurrentMonthLogs: timelogs", () => {
  let element: any;
  beforeEach(() => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    element = isPerdiem(timelogs.perdiems[0])
      ? render(
          <OutputPerdiem monthIsClosed={false} log={timelogs.perdiems[0]} index={0} />,
        )
      : render(<p>TypeScriptError</p>);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  //! skipped because this test only works alone
  it.skip("right perdiem model is shown", async () => {
    if (isPerdiem(timelogs.perdiems[0])) {
      await flushPromisesAndTimers();
      expect(element.container).toHaveTextContent("testMeTypeofDemo2");
    }
  });
});
