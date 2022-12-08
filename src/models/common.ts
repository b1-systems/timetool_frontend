export type PerdiemModels = { [key: number]: string };

export interface ShiftModels {
  morning?: string;
  afternoon?: string;
  night?: string;
}

export interface Project {
  name: string;
  uuid: string;
  worktypes: {
    perdiem?: PerdiemModels;
    timelog?: {
      timelog?: string;
    };
    shift?: ShiftModels;
  };
}
