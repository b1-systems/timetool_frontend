import React from "react";

import { act, fireEvent, flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { Perdiem } from "../../../models";
import { projectsList, timelogs } from "../../__dummyDataForTests/__dummyData";
import OutputPerdiem from "../../outputLogs/OutputPerdiem";

/**
 * pL_t_f stands for Mocks:
 * "fetchProjects" -> _pL = projectsList,
 * "fetchCurrentMonthLogs" -> _t = timelogs
 * "fetchIsMonthClosed" -> _f = false,
 */

let element: any;
beforeEach(() => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsList));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogs));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  element = render(
    <OutputPerdiem
      monthIsClosed={false}
      log={timelogs.perdiems[0] as Perdiem}
      index={0}
    />,
  );
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

it("right perdiem model is shown", async () => {
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("testMeTypeofDemo2");
});
