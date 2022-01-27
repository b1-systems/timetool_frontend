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
  perdiems: Perdiem[];
}
export interface Perdiem {
  uuid: string;
  project_uuid: string;
  project_name: string;
  start_dt: number;
  employee_uuid: string;
  type: number;
  comment: string;
}
export interface Timelog {
  uuid: string;
  employee_uuid: string;
  project_uuid: string;
  project_name: string;
  start_dt: number;
  end_dt: number;
  type: string;
  breaklength?: number;
  travel?: string | null;
  comment?: string;
  onsite?: string;
  incidents?: Incident[];
  shift_model?: string;
}
export interface Incident {
  start_dt: number;
  end_dt: number;
  comment: string;
}

export interface requestTimelog {
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

export interface requestShift {
  uuid: string;
  project_uuid: string;
  start_dt: number;
  end_dt: number;
  type: string;
  incidents: Incident[];
  shift_model: string;
  timezone: string;
}

export interface requestPerdiem {
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
