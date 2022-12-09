import { DateTime, Duration } from "luxon";

import { Project } from "./models/common";
import {
  CloseMonthRequest,
  DefaultTimelogRequest,
  LogsResponse,
  PerdiemRequest,
  RequestPrototype,
  ResponseTimelog,
  ShiftRequest,
  isDefaultTimelog,
  isPerdiem,
  isShift,
} from "./models/external";
import { Logs, Timelog } from "./models/internal";

type BackendRoute =
  | "project"
  | "employee/me/timelogs"
  | "lockedperiod"
  | `timelog/${string}`;

interface BackendCallParams {
  endpoint: BackendRoute;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  queryParams?: { [key: string]: string };
  headers?: { [key: string]: string };
  body?: { [key: string]: string } | string;
}

/**
 * Wrapper around `fetch` to make sure that all API calls honor `horde.appWebroot` and
 * have the session token sent with them as well. The supported URL are partially
 * checked by typescript, see `BackendRoute` above.
 *
 * @param params: Instead of an object you can also pass an URL directly in which case a
 * GET request is performed against it.
 *
 * @returns The direct `Response` object from `fetch`. No error handling or the like is
 * done.
 */
export const callBackend = (params: BackendCallParams | BackendRoute) => {
  let headers;
  if (typeof params === "string") {
    headers = new Headers({ "Horde-Session-Token": globalThis.horde.sessionToken });
    return fetch(`${baseUrl()}/rest/${params}`, { headers: headers });
  }
  headers = new Headers(params.headers || {});
  headers.set("Horde-Session-Token", globalThis.horde.sessionToken);
  if (params.queryParams) {
    const queryParams = new URLSearchParams(params.queryParams);
    params.endpoint += `?${queryParams}`;
  }
  if (params.body) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${baseUrl()}/rest/${params.endpoint}`, {
    method: params.method || "GET",
    headers: headers,
    body: typeof params.body === "string" ? params.body : JSON.stringify(params.body),
  });
};

const baseUrl = () =>
  [process.env.REACT_APP_BACKEND_URI, globalThis.horde.appWebroot]
    .filter((subPath) => !!subPath)
    .join("/");

export const fetchProjects = (requestPrototyp: RequestPrototype): Promise<Project[]> =>
  callBackend({
    endpoint: `project`,
    method: "GET",
    queryParams: {
      year: requestPrototyp.year,
      month: requestPrototyp.month,
      format: requestPrototyp.format,
      scope: requestPrototyp.scope,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(
          `Could not fetch project. Backend response code: ${response.status}`,
        );
      }
    })
    .then((projectObj) => projectObj.projects as Project[]);

const toInternalLog = (log: ResponseTimelog): Timelog => {
  if (isPerdiem(log)) {
    return {
      type: "perdiem",
      uuid: log.uuid,
      employee_uuid: log.employee_uuid,
      project_uuid: log.project_uuid,
      project_name: log.project_name,
      startTime: DateTime.fromSeconds(log.start_dt),
      perdiemModel: log.type,
      comment: log.comment,
    };
  }
  if (isShift(log)) {
    return {
      type: "shift",
      uuid: log.uuid,
      employee_uuid: log.employee_uuid,
      project_uuid: log.project_uuid,
      project_name: log.project_name,
      startTime: DateTime.fromSeconds(log.start_dt),
      endTime: DateTime.fromSeconds(log.end_dt),
      shiftModel: log.shift_model,
      incidents: log.incidents.map((incident) => ({
        startTime: DateTime.fromSeconds(incident.start_dt),
        endTime: DateTime.fromSeconds(incident.end_dt),
        comment: incident.comment,
      })),
    };
  }
  if (isDefaultTimelog(log)) {
    return {
      type: "timelog",
      uuid: log.uuid,
      employee_uuid: log.employee_uuid,
      project_uuid: log.project_uuid,
      project_name: log.project_name,
      startTime: DateTime.fromSeconds(log.start_dt),
      endTime: DateTime.fromSeconds(log.end_dt),
      breakTime: Duration.fromObject({ minute: log.breakTime }),
      travelTime: Duration.fromObject({ minute: log.travelTime }),
      site: log.onsite,
      comment: log.comment,
    };
  }
  throw new Error("Unknown log type");
};
/**
 * Get logs to display for the current month selected
 * @param newDate
 *
 */
export const fetchCurrentMonthLogs = (
  requestPrototyp: RequestPrototype,
): Promise<Logs> =>
  callBackend({
    endpoint: `employee/me/timelogs`,
    method: "GET",
    queryParams: {
      year: requestPrototyp.year,
      month: requestPrototyp.month,
      format: requestPrototyp.format,
      scope: requestPrototyp.scope,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(
          `Could not fetch current month logs. Backend response code: ${response.status}`,
        );
      }
    })
    .then((externalLogs: LogsResponse) => ({
      timelogs: externalLogs.timelogs.map(toInternalLog),
      perdiems: externalLogs.perdiems.map(toInternalLog),
    }));

export const fetchDelete = (requestPrototyp: {
  request: { uuid: string };
}): Promise<void> =>
  callBackend({
    endpoint: `timelog/${requestPrototyp.request.uuid}`,
    method: "DELETE",
  }).then((response) => {
    if (response.ok) {
      return;
    } else {
      throw new Error(`Could delete Log. Backend response code: ${response.status}`);
    }
  });

export const fetchSubmit = (
  request: DefaultTimelogRequest | PerdiemRequest | ShiftRequest,
): Promise<void> =>
  callBackend({
    endpoint: `timelog/${request.uuid}`,
    method: "PUT",
    body: JSON.stringify(request),
  }).then((response) => {
    if (response.ok) {
      return;
    } else {
      throw new Error(`Could not submit. Backend response code: ${response.status}`);
    }
  });

export const fetchCloseMonth = (requestPrototyp: {
  request: CloseMonthRequest;
}): Promise<void> =>
  callBackend({
    endpoint: `lockedperiod`,
    method: "POST",
    body: JSON.stringify(requestPrototyp.request),
  }).then((response) => {
    if (response.ok) {
      return;
    } else {
      throw new Error(
        `Could not close month. Backend response code: ${response.status}`,
      );
    }
  });

export const fetchIsMonthClosed = async (
  requestPrototyp: RequestPrototype,
): Promise<boolean> => false;
