import { timelogs } from "./components/__dummyDataForTests/__dummyData";
import {
  Logs,
  Project,
  RequestPrototyp,
  requestCloseMonth,
  requestPerdiem,
  requestShift,
  requestTimelog,
} from "./models";

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
  requestPrototyp: RequestPrototyp,
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
        timelog: "Awesome Timelog"
      },
      shift: {
        morning: "Awesome Morning",
        afternoon: "Awesome Afternoon",
        night: "Awesome Night"
      }
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
        timelog: "Awful Timelog"
      },
      shift: {
        morning: "Awful Morning",
        afternoon: "Awful Afternoon",
        night: "Awful Night"
      }
    },
  },
];

/**
 * Get logs to display for the current month selected
 * @param newDate
 *
 */

export const fetchCurrentMonthLogs = async (
  requestPrototyp: RequestPrototyp,
): Promise<Logs> => ({
  timelogs: [],
  perdiems: [],
});

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
  request: requestTimelog | requestPerdiem | requestShift,
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
  request: requestCloseMonth;
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
  requestPrototyp: RequestPrototyp,
): Promise<boolean> =>
  false;
