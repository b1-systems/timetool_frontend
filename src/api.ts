import { DateTime, Duration } from "luxon";

import { Project } from "./models/common";
import {
  CloseMonthRequest,
  DefaultTimelogRequest,
  LogsResponse,
  PerdiemRequest,
  RequestPrototype,
  ResponsePerdiem,
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

export const fetchProjects = async (
  requestPrototyp: RequestPrototype,
): Promise<Project[]> => [
  {
    name: "Awesome Project",
    uuid: "f6e0f789-adf4-4b78-988e-c7baebd12b25",
    worktypes: {
      perdiem: {
        1: "Awesome Perdiem",
        2: "More Awesome Perdiem",
      },
      timelog: {
        timelog: "Awesome Timelog",
      },
      shift: {
        morning: "Awesome Morning",
        afternoon: "Awesome Afternoon",
        night: "Awesome Night",
      },
    },
  },
  {
    name: "Awful Project",
    uuid: "8031c1eb-b0e8-41b8-a648-0738e9d320ed",
    worktypes: {
      perdiem: {
        1: "Awful Perdiem",
        2: "More Awful Perdiem",
      },
      timelog: {
        timelog: "Awful Timelog",
      },
      shift: {
        morning: "Awful Morning",
        afternoon: "Awful Afternoon",
        night: "Awful Night",
      },
    },
  },
];

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
export const fetchCurrentMonthLogs = async (
  requestPrototyp: RequestPrototype,
): Promise<Logs> => {
  const externalLogs: LogsResponse = {
    timelogs: [
      {
        type: "timelog",
        uuid: "d4e46f6d-ecda-4cac-8ac2-391639f6f3d3",
        start_dt: 0,
        end_dt: 3600,
        employee_uuid: "09f3b693-dbe3-48de-b672-11b882ca1d48",
        project_name: "Awful Project",
        project_uuid: "8031c1eb-b0e8-41b8-a648-0738e9d320ed",
        breakTime: 0,
        travelTime: 0,
        onsite: "remote",
        comment: "This is a comment",
      },
      {
        type: "shift",
        uuid: "e0282096-70ab-4ef9-aca8-7eb05c78cfb2",
        start_dt: 0,
        end_dt: 0,
        employee_uuid: "09f3b693-dbe3-48de-b672-11b882ca1d48",
        project_name: "Awful Project",
        project_uuid: "8031c1eb-b0e8-41b8-a648-0738e9d320ed",
        shift_model: "morning",
        incidents: [],
      },
    ],
    perdiems: [
      {
        type: 1,
        comment: "Awful Comment",
        start_dt: 0,
        uuid: "edf59dcc-5ee1-4f1d-aef2-2fbe26cd3f8e",
        employee_uuid: "09f3b693-dbe3-48de-b672-11b882ca1d48",
        project_name: "Awful Project",
        project_uuid: "8031c1eb-b0e8-41b8-a648-0738e9d320ed",
      } as ResponsePerdiem,
    ],
  };
  return {
    timelogs: externalLogs.timelogs.map(toInternalLog),
    perdiems: externalLogs.perdiems.map(toInternalLog),
  };
};

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
