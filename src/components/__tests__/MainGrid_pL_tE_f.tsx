import React from "react";

import { act, fireEvent, flushPromisesAndTimers, render } from "../../../test/utils";
import * as api from "../../api";
import MainGrid from "../MainGrid";
import { projectsList, timelogsEmpty } from "../__dummyDataForTests/__dummyData";

/**
 * pL_tE_f stands for Mocks:
 * "fetchProjects" -> _pL = projectsList,
 * "fetchCurrentMonthLogs" -> _tE = timelogsEmpty
 * "fetchIsMonthClosed" -> _f = false,
 */

let element: any;
beforeEach(() => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsList));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  element = render(<MainGrid />);
});
afterEach(() => {
  jest.clearAllMocks();
});

it("autocomplete change value", async () => {
  await flushPromisesAndTimers();
  const autocomplete = element
    .getByTestId("MainGrid_project-Autocomplete")
    .querySelector("input");
  act(() => {
    fireEvent.click(autocomplete);
    fireEvent.change(autocomplete, { target: { value: "timelog Project" } });
  });
  expect(autocomplete.value).toEqual("timelog Project");
});

it("autocomplete list gets populated", async () => {
  await flushPromisesAndTimers();
  const autocomplete = element
    .getByTestId("MainGrid_project-Autocomplete")
    .querySelector("input");
  expect(autocomplete.value).toEqual("");
  act(() => {
    fireEvent.click(autocomplete);
    fireEvent.change(autocomplete, {
      target: { value: "t" },
    });
  });
  expect(element.getByRole("listbox")).not.toEqual(null);
});

it("select project", async () => {
  await flushPromisesAndTimers();
  const autocomplete = element
    .getByTestId("MainGrid_project-Autocomplete")
    .querySelector("input");
  expect(autocomplete.value).toEqual("");
  act(() => {
    fireEvent.click(autocomplete);
    fireEvent.change(autocomplete, {
      target: { value: "D" },
    });
  });
  expect(element.getByRole("listbox")).not.toEqual(null);
  act(() => {
    fireEvent.click(element.getByText("Demo Project 1"));
  });
  expect(autocomplete.value).toEqual("Demo Project 1");
  await flushPromisesAndTimers();
  expect(element.container).not.toHaveTextContent("select_a_project");
});
