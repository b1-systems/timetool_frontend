export interface RequestPrototype {
  year: string;
  month: string;
  format: string;
  scope: string;
}

export interface BaseTimelogRequest {
  uuid: string;
  project_uuid: string;
  start_dt: number;
  timezone: string;
}

export interface PerdiemRequest extends BaseTimelogRequest {
  type: number;
  comment: string;
  is_perdiem: boolean;
}

export interface DefaultTimelogRequest extends BaseTimelogRequest {
  end_dt: number;
  type: string;
  breakTime: number;
  travelTime: number;
  comment: string;
  onsite: string;
}

export interface ShiftRequestIncident {
  start_dt: number;
  end_dt: number;
  comment: string;
}
export interface ShiftRequest extends BaseTimelogRequest {
  end_dt: number;
  type: string;
  incidents: ShiftRequestIncident[];
  shift_model: string;
}

interface BaseResponseTimelog {
  employee_uuid: string;
  project_name: string;
}
export type ResponsePerdiem = Omit<PerdiemRequest, "timezone"> & BaseResponseTimelog;
export type ResponseDefaultTimelog = Omit<
  DefaultTimelogRequest,
  "timezone" | "breakTime" | "travelTime"
> &
  BaseResponseTimelog & { breaklength: number; travel: number };
export type ResponseShift = Omit<ShiftRequest, "timezone"> & BaseResponseTimelog;
export type ResponseTimelog = ResponsePerdiem | ResponseDefaultTimelog | ResponseShift;
export interface LogsResponse {
  timelogs: ResponseTimelog[];
  perdiems: ResponseTimelog[];
}

export const isPerdiem = (log: ResponseTimelog): log is ResponsePerdiem =>
  typeof log?.type === "number";
export const isDefaultTimelog = (log: ResponseTimelog): log is ResponseDefaultTimelog =>
  log?.type === "timelog";
export const isShift = (log: ResponseTimelog): log is ResponseShift =>
  log?.type === "shift";

export interface CloseMonthRequest {
  month: string;
  year: string;
  format: string;
  scope: string;
}
