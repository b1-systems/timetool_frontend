import { DateTime } from "luxon";
import { DefaultValue, atom, selector, useRecoilState } from "recoil";

import { fetchCurrentMonthLogs, fetchIsMonthClosed, fetchProjects } from "./api";
import { Logs, Perdiem, Project, Timelog } from "./models";

export const monthBackingState = atom({
  key: "monthBackingState",
  default: DateTime.now(),
});

export const monthState = selector<DateTime>({
  key: "monthState",
  get: ({ get }) => {
    return get(monthBackingState);
  },
  set: ({ set, get }, newMonth) => {
    set(
      dateFromState,
      newMonth instanceof DefaultValue
        ? newMonth
        : newMonth.set({
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          }),
    );
    set(
      dateToState,
      newMonth instanceof DefaultValue
        ? newMonth
        : newMonth.set({
            day: 1,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          }),
    );
    set(monthBackingState, newMonth instanceof DefaultValue ? newMonth : newMonth);
  },
});

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

export const isMonthClosedRequestIdState = atom({
  key: "isMonthClosedRequestIdState",
  default: 0,
});

export const useUpdateIsMonthClosed = () => {
  const [isMonthClosedRequestId, setIsMonthClosedRequestId] = useRecoilState(
    isMonthClosedRequestIdState,
  );
  return () => {
    setIsMonthClosedRequestId(isMonthClosedRequestId + 1);
  };
};

export const isMonthClosedState = selector({
  key: "isMonthClosedState",
  get: ({ get }) => {
    get(isMonthClosedRequestIdState);
    const month = get(monthState);
    return fetchIsMonthClosed({
      year: month.year.toString(),
      month: month.month.toString(),
      format: "traditional",
      scope: "me",
    });
  },
});

export const shiftModelsState = selector({
  key: "shiftModelsState",
  get: ({ get }) => {
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
  get: ({ get }) => {
    const projects = get(projectsState);
    const m = new Map(
      projects
        .filter((project) => project.worktypes.perdiem !== undefined)
        .map((project) => [project.uuid, project.worktypes.perdiem]),
    );
    return m;
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
    const month = get(monthState);
    return fetchProjects({
      year: month.year.toString(),
      month: month.month.toString(),
      format: "traditional",
      scope: "me",
    });
  },
});

export const logsRequestIdState = atom({
  key: "logsRequestIdState",
  default: 0,
});

export const useUpdateLogs = () => {
  const [logsRequestId, setLogsRequestId] = useRecoilState(logsRequestIdState);
  return () => {
    setLogsRequestId(logsRequestId + 1);
  };
};

export const currentMonthLogsState = selector<Logs>({
  key: "currentMonthLogsState",
  get: async ({ get }) => {
    get(logsRequestIdState);
    const month = get(monthState);
    return fetchCurrentMonthLogs({
      year: month.year.toString(),
      month: month.month.toString(),
      format: "traditional",
      scope: "me",
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

export const editPerdiemState = atom<Perdiem>({
  key: "editPerdiemState",
  default: {
    uuid: "-1",
    employee_uuid: "-1",
    project_uuid: "-1",
    project_name: "-1",
    start_dt: -1,
    type: -1,
    comment: "-1",
  },
});

export const alertShownInInputState = atom({
  key: "alertShownInInputState",
  default: false,
});
