import { useEffect } from "react";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

import { fetchProjects } from "../api";
import { Project } from "../models";
import { selectedMonth } from "./selectedDate";

export const availableProjects = selector<Project[]>({
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

export const selectedProject = atom<Project | null>({
  key: "selectedProject",
  default: null,
});
export const useSelectedProject = () => {
  return useRecoilState(selectedProject);
};

export const useSetProjectByUuid = () => {
  const projects = useRecoilValue(availableProjects);
  const setSelectedProject = useSetRecoilState(selectedProject);

  return (uuid: string) => {
    const project = projects.find((project) => project.uuid === uuid);
    if (project) setSelectedProject(project);
    else console.error("no fitting Project with uuid found. UUID:", uuid);
  };
};

export const useSetProjectIfOnlyOne = () => {
  const setProject = useSetRecoilState(selectedProject);
  const projects = useRecoilValue(availableProjects);
  return useEffect(() => {
    if (projects.length === 1) setProject(projects[0]);
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
    return project ? models.get(project?.uuid) : undefined;
  },
});
export const useProjectPerdiemModels = () => {
  return useRecoilValue(projectPerdiemModels);
};
