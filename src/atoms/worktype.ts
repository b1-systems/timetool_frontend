import { selector, useRecoilValue } from "recoil";

import { selectedProject } from "./projects";

export const projectWorktypes = selector<string[] | null>({
    key: "projectWorktypes",
    get: async ({ get }) => {
        const project = get(selectedProject);
        return project ? Object.keys(project.worktypes) : null;
    },
});
export const useProjectWorktypes = () => {
    return useRecoilValue(projectWorktypes);
};
