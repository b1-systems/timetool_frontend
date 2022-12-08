import { DateTime, Duration } from "luxon";

interface TimelogBase {
  type: string;
  uuid: string | null;
  employee_uuid: string | null;
  project_uuid: string;
  project_name: string;
  startTime: DateTime;
}
interface TimelogWithEndTime extends TimelogBase {
  endTime: DateTime;
}

export interface Perdiem extends TimelogBase {
  type: "perdiem";
  perdiemModel: number;
  comment: string;
}

export interface Incident {
  startTime: DateTime;
  endTime: DateTime;
  comment: string;
}
export interface Shift extends TimelogWithEndTime {
  type: "shift";
  shiftModel: string;
  incidents: Incident[];
}

export interface DefaultTimelog extends TimelogWithEndTime {
  type: "timelog";
  breakTime: Duration;
  travelTime: Duration;
  comment: string;
  site: string;
}
export type Timelog = Perdiem | Shift | DefaultTimelog;

export interface Logs {
  timelogs: Timelog[];
  perdiems: Timelog[];
}

export const isPerdiem = (timelog: Timelog): timelog is Perdiem =>
  timelog?.type === "perdiem";
export const isDefaultTimelog = (timelog: Timelog): timelog is DefaultTimelog =>
  timelog?.type === "timelog";
export const isShift = (timelog: Timelog): timelog is Shift =>
  timelog?.type === "shift";
