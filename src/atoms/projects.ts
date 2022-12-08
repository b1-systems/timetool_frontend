import { useEffect } from "react";
import {
  SetterOrUpdater,
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

import { fetchProjects } from "../api";
import { Project } from "../models/common";
import { selectedMonth } from "./selectedDate";

const availableProjects = selector<Project[]>({
  key: "availableProjects",
  get: async ({ get }) => {
    const month = get(selectedMonth);
    return fetchProjects({
      year: month.year.toString(),
      month: month.month.toString(),
      format: "traditional",
      scope: "me",
    });
  },
});
export const useAvailableProjects = () => {
  return useRecoilValue(availableProjects);
};

export const projectByUUID = selectorFamily<Project | null, string | null>({
  key: "projectByUUID",
  get:
    (uuid) =>
    ({ get }) => {
      const projects = get(availableProjects);
      return projects.find((project) => project.uuid === uuid) ?? null;
    },
});

export const selectedProjectUUID = atom<string | null>({
  key: "selectedProjectUUID",
  default: null,
});
export const selectedProject = selector<Project | null>({
  key: "selectedProject",
  get: async ({ get }) => {
    const uuid = get(selectedProjectUUID);
    return get(projectByUUID(uuid));
  },
});
export const useSelectedProject = (): [
  Project | null,
  SetterOrUpdater<string | null>,
] => {
  const project = useRecoilValue(selectedProject);
  const setProject = useSetRecoilState(selectedProjectUUID);
  return [project, setProject];
};

export const useSetProjectIfOnlyOne = () => {
  const [, setProject] = useSelectedProject();
  const projects = useRecoilValue(availableProjects);
  return useEffect(() => {
    if (projects.length === 1) setProject(projects[0].uuid);
  }, [projects, setProject]);
};

export const projectShiftModelsState = selector({
  key: "projectShiftModelsState",
  get: async ({ get }) => {
    const project = get(selectedProject);
    if (project && project.worktypes.shift !== undefined) {
      return Object.values(project.worktypes.shift);
    }
    return null;
  },
});

export const shiftModels = selector({
  key: "shiftModels",
  get: ({ get }) => {
    const projects = get(availableProjects);
    const m = new Map(
      projects
        .filter((project) => project.worktypes.shift !== undefined)
        .map((project) => [project.uuid, project.worktypes.shift]),
    );
    return m;
  },
});
export const useShiftModels = () => {
  return useRecoilValue(shiftModels);
};

const projectShiftModels = selector({
  key: "projectShiftModels",
  get: ({ get }) => {
    const models = get(shiftModels);
    const project = get(selectedProject);
    return project ? models.get(project?.uuid) : null;
  },
});
export const useProjectShiftModels = () => {
  return useRecoilValue(projectShiftModels);
};

export const perdiemModels = selector({
  key: "perdiemModels",
  get: ({ get }) => {
    const projects = get(availableProjects);
    const m = new Map(
      projects
        .filter((project) => project.worktypes.perdiem !== undefined)
        .map((project) => [project.uuid, project.worktypes.perdiem]),
    );
    return m;
  },
});
export const usePerdiemModels = () => {
  return useRecoilValue(perdiemModels);
};

export const projectPerdiemModels = selector({
  key: "projectPerdiemModels",
  get: ({ get }) => {
    const models = get(perdiemModels);
    const project = get(selectedProject);
    return project ? models.get(project?.uuid) : null;
  },
});
export const useProjectPerdiemModels = () => {
  return useRecoilValue(projectPerdiemModels);
};
