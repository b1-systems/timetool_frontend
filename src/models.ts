export interface Project {
  name: string;
  uuid: string;
  worktypes: {perdiem?: Object; timelog?: Object; shift?: Object};
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
  travel?: string;
  comment?: string;
  onsite?: string;
  incidents?: Incidents[];
  shift_model?: string;
}
export interface Incidents {
  start_dt: number;
  end_dt: number;
  comment: string;
}
