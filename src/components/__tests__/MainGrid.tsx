import React from 'react';
import { RecoilRoot } from 'recoil';

import {
	act,
	fireEvent,
	flushPromisesAndTimers,
	render,
} from '../../../test/utils';
import * as api from '../../api';
import {
	projectsList,
	projectsListOneShift,
	timelogs,
	timelogsEmpty,
} from '../__dummyDataForTests/__dummyData';
import MainGrid from '../MainGrid';

describe("test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders", async () => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
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
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("select_a_project");
  });

  // describe("test in own", () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //     //element = null;
  //   });

  it("autoselect fills Project if only one is available", async () => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsListOneShift));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogsEmpty));
    const element = render(<MainGrid />);
    await flushPromisesAndTimers();
    expect(element.container).not.toHaveTextContent("select_a_project");
  });
  // });

  it("edit shift is possible", async () => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputShift_edit-warning-btn_index-0"));
    });
    expect(
      element.getByTestId("InputShift_cancel_edit-warning-btn"),
    ).toBeInTheDocument();
  });

  it("edit shift is committed", async () => {
    const mockFetchSubmit = jest
      .spyOn(api, "fetchSubmit")
      .mockImplementation((_) => Promise.resolve());
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputShift_edit-warning-btn_index-0"));
    });
    await act(async () => {
      fireEvent.click(element.getByTestId("InputCard_commit-info-btn_index"));
    });
    expect(mockFetchSubmit).toHaveBeenCalled();
  });

  it("edit default timelog is possible", async () => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputTimelog_edit-warning-btn_index-0"));
    });
    expect(
      element.getByTestId("InputTimelog_cancel_edit-warning-btn"),
    ).toBeInTheDocument();
  });

  it("edit default timelog is committed", async () => {
    const mockFetchSubmit = jest
      .spyOn(api, "fetchSubmit")
      .mockImplementation((_) => Promise.resolve());
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputTimelog_edit-warning-btn_index-0"));
    });
    await act(async () => {
      fireEvent.click(element.getByTestId("InputCard_commit-info-btn_index"));
    });
    expect(mockFetchSubmit).toHaveBeenCalled();
  });

  it("edit perdiem is possible", async () => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputPerdiem_edit-warning-btn_index-0"));
    });
    expect(
      element.getByTestId("InputPerdiem_cancel_edit-warning-btn"),
    ).toBeInTheDocument();
  });

  it("edit perdiem is committed", async () => {
    const mockFetchSubmit = jest
      .spyOn(api, "fetchSubmit")
      .mockImplementation((_) => Promise.resolve());
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
    await flushPromisesAndTimers();
    await act(async () => {
      fireEvent.click(element.getByTestId("OutputPerdiem_edit-warning-btn_index-0"));
    });
    await act(async () => {
      fireEvent.click(element.getByTestId("InputCard_commit-info-btn_index"));
    });
    expect(mockFetchSubmit).toHaveBeenCalled();
  });

  it("break and travel time gets multiplied", async () => {
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
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
    jest
      .spyOn(api, "fetchProjects")
      .mockImplementation((_) => Promise.resolve(projectsList));
    jest
      .spyOn(api, "fetchIsMonthClosed")
      .mockImplementation((_) => Promise.resolve(false));
    jest
      .spyOn(api, "fetchCurrentMonthLogs")
      .mockImplementation((_) => Promise.resolve(timelogs));
    const element = render(<MainGrid />);
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
