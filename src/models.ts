export interface Project {
  name: string;
  uuid: string;
  worktypes: {
    perdiem?: {
      1?: string;
      2?: string;
      3?: string;
      4?: string;
      5?: string;
      6?: string;
      7?: string;
      8?: string;
    };
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
}

export interface requestPerdiem {
  uuid: string;
  project_uuid: string;
  start_dt: number;
  type: number;
  comment: string;
  isPerdiem: boolean;
}
