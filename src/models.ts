export interface RequestPrototyp {
  year: string;
  month: string;
  format: string;
  scope: string;
}
export interface Project {
  name: string;
  uuid: string;
  worktypes: {
    perdiem?: ModelsPerdiem;
    timelog?: {
      timelog?: string;
    };
    shift?: {
      morning?: string;
      afternoon?: string;
      night?: string;
    };
  };
}
export interface ModelsPerdiem {
  [key: number]: string;
}
export interface PerdiemModelsToProjectUuid {
  [key: string]: ModelsPerdiem;
}
export interface ModelsShift {
  morning?: string;
  afternoon?: string;
  night?: string;
}
export interface ShiftModelsToProjectUuid {
  [key: string]: ModelsShift;
}
export interface Logs {
  timelogs: Timelog[];
  perdiems: Timelog[];
}
interface TimelogBase {
  uuid: string | null;
  employee_uuid: string | null;
  project_uuid: string;
  project_name: string;
  start_dt: number;
}
export interface Perdiem extends TimelogBase {
  type: number;
  comment: string;
}
export interface Shift extends TimelogBase {
  end_dt: number;
  type: "shift";
  incidents: Incident[];
  shift_model: string;
}
export interface DefaultTimelog extends TimelogBase {
  end_dt: number;
  type: "timelog" | "default";
  breaklength: number;
  travel: number;
  comment: string;
  onsite: string;
}
export type Timelog = Perdiem | Shift | DefaultTimelog;

export function isPerdiem(timelog: Timelog): timelog is Perdiem {
  if (timelog) {
    return typeof timelog.type === "number";
  }
  return false;
}

export function isTimelog(timelog: Timelog): timelog is DefaultTimelog {
  if (timelog) {
    return timelog.type === "timelog" || timelog.type === "default";
  }
  return false;
}

export function isShift(timelog: Timelog): timelog is Shift {
  if (timelog) {
    return timelog.type === "shift";
  }
  return false;
}

export interface Incident {
  start_dt: number;
  end_dt: number;
  comment: string;
}

export interface DefaultTimelogRequest {
  uuid: string;
  project_uuid: string;
  start_dt: number;
  end_dt: number;
  type: string;
  breakTime: number;
  travelTime: number;
  comment: string;
  onsite: string;
  timezone: string;
}

export interface ShiftRequest {
  uuid: string;
  project_uuid: string;
  start_dt: number;
  end_dt: number;
  type: string;
  incidents: Incident[];
  shift_model: string;
  timezone: string;
}

export interface PerdiemRequest {
  uuid: string;
  project_uuid: string;
  start_dt: number;
  type: number;
  comment: string;
  is_perdiem: boolean;
  timezone: string;
}

export interface requestCloseMonth {
  month: string;
  year: string;
  format: string;
  scope: string;
}
