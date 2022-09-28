import { DateTime } from "luxon";
import {
  DefaultValue,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

import { fetchCurrentMonthLogs, fetchIsMonthClosed, fetchProjects } from "./api";
import { Logs, Project, Timelog, isPerdiem, isShift, isTimelog } from "./models";

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
  default: DateTime.now(),
});

export const startDtOfTimelogState = selector<DateTime>({
  key: "startDtOfTimelogState",
  get: ({ get }) => {
    const timelog = get(editTimelogState);
    const dateFrom = get(dateFromState);
    if (timelog && timelog.uuid) {
      return DateTime.fromSeconds(timelog.start_dt);
    }
    return dateFrom;
  },
  set: ({ set, get }, newDay) => {
    const timelog = get(editTimelogState);
    set(dateFromState, newDay);
    if (timelog) {
      set(
        editTimelogState,
        newDay instanceof DefaultValue
          ? timelog
          : { ...timelog, start_dt: newDay.valueOf() / 1000 },
      );
    }
  },
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

export const endDtOfTimelogState = selector<DateTime>({
  key: "endDtOfTimelogState",
  get: ({ get }) => {
    const timelog = get(editTimelogState);
    const dateTo = get(dateToState);
    if (timelog && timelog.uuid && (isTimelog(timelog) || isShift(timelog))) {
      return DateTime.fromSeconds(timelog.end_dt);
    }
    return dateTo;
  },
  set: ({ set, get }, newDay) => {
    const timelog = get(editTimelogState);
    set(dateToState, newDay);
    if (timelog) {
      if (isPerdiem(timelog)) {
        set(editTimelogState, {
          ...timelog,
        });
      } else
        set(
          editTimelogState,
          newDay instanceof DefaultValue
            ? timelog
            : {
                ...timelog,
                end_dt: newDay.valueOf() / 1000,
              },
        );
    }
  },
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

export const currentMonthLogsPerdiemsState = selector<Timelog[]>({
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

export const editTimelogState = atom<Timelog | null>({
  key: "editTimelogState",
  default: null,
});

export const alertShownInInputState = atom({
  key: "alertShownInInputState",
  default: false,
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

export const projectState = atom<Project | null>({
  key: "projectState",
  default: null,
});

export const useSetProjectByUuid = () => {
  const setProject = useSetRecoilState(projectState);
  const projects = useRecoilValue(projectsState);
  return (uuid: string) => {
    const project = projects.find((project) => project.uuid === uuid);
    if (project) setProject(project);
    else console.error("no fitting Project with uuid found. UUID:", uuid);
  };
};

export const useSetProjectIfOnlyOne = () => {
  const setProject = useSetRecoilState(projectState);
  const projects = useRecoilValue(projectsState);
  return () => {
    const project = projects[0];
    if (projects.length === 1) setProject(project);
  };
};

export const autoTypeNotDoneState = atom<boolean>({
  key: "autoTypeDoneState",
  default: true,
});

export const projectTypesState = selector<string[] | null>({
  key: "projectTypesState",
  get: async ({ get }) => {
    const project = get(projectState);
    return project ? Object.keys(project.worktypes) : null;
  },
});

export const projectShiftModelsState = selector({
  key: "projectShiftModelsState",
  get: async ({ get }) => {
    const project = get(projectState);
    if (project && project.worktypes.shift !== undefined) {
      return Object.values(project.worktypes.shift);
    }
    return null;
  },
});

export const projectPerdiemModelsState = selector({
  key: "projectPerdiemModelsState",
  get: async ({ get }) => {
    const project = get(projectState);
    if (project && project.worktypes.perdiem !== undefined) {
      return Object.values(project.worktypes.perdiem);
    }
    return null;
  },
});
