import React from "react";

import { act, fireEvent, flushPromisesAndTimers, render } from "../../../test/utils";
import * as api from "../../api";
import MainGrid from "../MainGrid";
import {
  projectsList,
  projectsListOneTimelog,
  timelogs,
  timelogsEmpty,
} from "../__dummyDataForTests/__dummyData";

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
    element = render(<MainGrid />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders", async () => {
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("project");
    expect(element.container).toHaveTextContent("select_a_project");
    expect(element.container).toHaveTextContent("Shift Project");
    expect(element.container).toHaveTextContent("perdiem");
    expect(element.container).toHaveTextContent("timelog");
    expect(element.container).toHaveTextContent("shift");
    expect(element.container).toHaveTextContent("keypoint.comment");
    expect(element.container).toHaveTextContent("end_month");
  });

  it("warning select_a_project is shown when no project is selected", async () => {
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("select_a_project");
  });

  it("edit shift is possible", async () => {
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputShift_edit-warning-btn_index-0"));
    });
    expect(
      element.getByTestId("InputShift_cancel_edit-warning-btn"),
    ).toBeInTheDocument();
  });

  it("edit shift is committed", async () => {
    await flushPromisesAndTimers();
    const mockFetchSubmit = jest
      .spyOn(api, "fetchSubmit")
      .mockImplementation((_) => Promise.resolve());
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputShift_edit-warning-btn_index-0"));
    });
    await act(async () => {
      fireEvent.click(element.getByTestId("InputCard_commit-info-btn_index"));
    });
    expect(mockFetchSubmit).toHaveBeenCalled();
  });

  it("edit default timelog is possible", async () => {
    await flushPromisesAndTimers();
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputTimelog_edit-warning-btn_index-0"));
    });
    expect(
      element.getByTestId("InputTimelog_cancel_edit-warning-btn"),
    ).toBeInTheDocument();
  });

  it("edit default timelog is committed", async () => {
    await flushPromisesAndTimers();
    const mockFetchSubmit = jest
      .spyOn(api, "fetchSubmit")
      .mockImplementation((_) => Promise.resolve());
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputTimelog_edit-warning-btn_index-0"));
    });
    await act(async () => {
      fireEvent.click(element.getByTestId("InputCard_commit-info-btn_index"));
    });
    expect(mockFetchSubmit).toHaveBeenCalled();
  });

  it("edit perdiem is possible", async () => {
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputPerdiem_edit-warning-btn_index-0"));
    });
    expect(
      element.getByTestId("InputPerdiem_cancel_edit-warning-btn"),
    ).toBeInTheDocument();
  });

  it("edit perdiem is committed", async () => {
    await flushPromisesAndTimers();
    const mockFetchSubmit = jest
      .spyOn(api, "fetchSubmit")
      .mockImplementation((_) => Promise.resolve());
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputPerdiem_edit-warning-btn_index-0"));
    });
    await act(async () => {
      fireEvent.click(element.getByTestId("InputCard_commit-info-btn_index"));
    });
    expect(mockFetchSubmit).toHaveBeenCalled();
  });

  it("break and travel time gets multiplied", async () => {
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputTimelog_edit-warning-btn_index-0"));
    });
    const travel = element.getByLabelText("travel_time_(minutes)");
    const breaktime = element.getByLabelText("break_time_(minutes)");
    expect(travel).toHaveValue(2);
    expect(breaktime).toHaveValue(1);
  });

  it("break and travel time gets multiplied", async () => {
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputTimelog_edit-warning-btn_index-0"));
    });
    await act(async () => {
      fireEvent.click(element.getByTestId("InputTimelog_cancel_edit-warning-btn"));
    });
    expect(element.queryByTestId("InputTimelog_cancel_edit-warning-btn")).toBeFalsy();
  });
});

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
    element = render(<MainGrid />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  //! skipped because this test only works alone
  it.skip("autoselect fills Project if only one is available", async () => {
    await flushPromisesAndTimers();
    expect(element.container).not.toHaveTextContent("select_a_project");
  });
});

describe("fetchProjects: projectsListOneTimelog // fetchIsMonthClosed: false // fetchCurrentMonthLogs: timelogsEmpty", () => {
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
    element = render(<MainGrid />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  //! skipped because this test only works alone
  it.skip("both commit btn are renderd", async () => {
    await flushPromisesAndTimers();
    expect(element.getByTestId("InputCard_commit-info-btn_index")).toBeTruthy();
    expect(element.getByTestId("InputCard_commit-stay_date-btn_index")).toBeTruthy();
  });
});
