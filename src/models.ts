export interface Project {
  name: string;
  uuid: string;
  worktypes: string[];
}
export interface Logs {
  timelogs: Timelog[];
  perdiems: Perdiem[];
}
export interface Perdiem {
  date: number;
  employee: string;
  type: number;
  projectUuid: string;
  comment: string;
}
export interface Timelog {
  timelog_id: number;
  timelog_uuid: string;
  employee_uuid: string;
  project_uuid: string;
  start_dt: number;
  end_dt: number;
  timelog_type: string;
  json_bag: {
    id: number;
    employee_uuid: string;
    startdt: string;
    enddt: string;
    feiertag: string;
    oncall: string;
    project_id: number;
    project_uuid: string;
    breaklength: number;
    travel: string;
    comment: string;
    onsite: number;
    subproject: number;
  };
}