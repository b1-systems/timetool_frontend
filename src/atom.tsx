import { DateTime } from "luxon";
import { atom, selector, useRecoilState } from "recoil";

import { fetchCurrentMonthLogs, fetchProjects } from "./api";
import { Logs, Perdiem, Project, Timelog } from "./models";

export const dateFromState = atom({
  key: "dateFromState",
  default: DateTime.now().set({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),
});

export const dateToState = atom({
  key: "dateToState",
  default: DateTime.now().set({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),
});

export const shiftModelsState = selector({
  key: "shiftModelsState",
  get: async ({ get }) => {
    const projects = get(projectsState);
    const m = new Map(
      projects
        .filter((project) => project.worktypes.shift !== undefined)
        .map((project) => [project.uuid, project.worktypes.shift]),
    );
    return m;
  },
});

export const perdiemModelsState = selector({
  key: "perdiemModelsState",
  get: async ({ get }) => {
    const projects = get(projectsState);
    return new Map(
      projects
        .filter((project) => project.worktypes.perdiem !== undefined)
        .map((project) => [project.uuid, project.worktypes.perdiem]),
    );
  },
});

export const projectsRequestIdState = atom({
  key: "projectsRequestIdState",
  default: 0,
});

export const useUpdateProjects = () => {
  const [projectsRequestId, setProjectsRequestId] =
    useRecoilState(projectsRequestIdState);
  return () => {
    setProjectsRequestId(projectsRequestId + 1);
  };
};

export const projectsState = selector<Project[]>({
  key: "projectsState",
  get: async ({ get }) => {
    get(projectsRequestIdState);
    const dateFrom = get(dateFromState);
    return fetchProjects({
      params: {
        year: dateFrom.year,
        month: dateFrom.month,
        format: "traditional",
        scope: "me",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((projectObj) => projectObj.projects);
  },
});

export const currentMonthLogsState = selector<Logs>({
  key: "currentMonthLogsState",
  get: async ({ get }) => {
    get(projectsRequestIdState);
    const dateFrom = get(dateFromState);
    return fetchCurrentMonthLogs({
      params: {
        year: dateFrom.year,
        month: dateFrom.month,
        format: "traditional",
        scope: "me",
      },
    }).then((response) => {
      return response.json();
    });
  },
});

export const currentMonthLogsPerdiemsState = selector<Perdiem[]>({
  key: "currentMonthLogsPerdiemsState",
  get: async ({ get }) => {
    const monthLogs = get(currentMonthLogsState);
    return monthLogs.perdiems;
  },
});

export const currentMonthLogsTimelogsState = selector<Timelog[]>({
  key: "currentMonthLogsTimelogsState",
  get: async ({ get }) => {
    const monthLogs = get(currentMonthLogsState);
    return monthLogs.timelogs;
  },
});

export const editTimelogState = atom<Timelog>({
  key: "editTimelogState",
  default: {
    uuid: "-1",
    employee_uuid: "-1",
    project_uuid: "-1",
    project_name: "-1",
    start_dt: -1,
    end_dt: -1,
    type: "-1",
  },
});
