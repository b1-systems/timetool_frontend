import { requestPerdiem, requestShift, requestTimelog } from './models';

const getParams = (params?: Object) => {
  if (params === undefined) {
    return '';
  }
  let buildString = [];
  for (const [key, value] of Object.entries(params)) {
    if (buildString.length === 0) {
      buildString.push(`?${key}=${value}`);
      continue;
    }
    buildString.push(`&${key}=${value}`);
  }
  return buildString.join('');
};

const baseUrl = () =>
  [process.env.REACT_APP_BACKEND_URI, globalThis.horde.appWebroot]
    .filter((subPath) => !!subPath)
    .join('/');

export const fetchProjects = async (requestPrototyp: {
  params?: Object;
}): Promise<Response> =>
  fetch(`${baseUrl()}/rest/project${getParams(requestPrototyp.params)}`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error(
        `Could not fetch auditlogs. Backend response code: ${response.status}`,
      );
    }
  });

/**
 * Get logs to display for the current month selected
 * @param newDate
 *
 */
export const fetchCurrentMonthLogs = async (requestPrototyp: {
  params?: Object;
}): Promise<Response> =>
  fetch(
    `${baseUrl()}/rest/employee/me/timelogs${getParams(
      requestPrototyp.params,
    )}`,
    {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  ).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error(
        `Could not fetch auditlogs. Backend response code: ${response.status}`,
      );
    }
  });

export const fetchDelete = async (requestPrototyp: {
  request: {uuid: string};
}): Promise<Response> =>
  fetch(`${baseUrl()}/rest/timelog/${requestPrototyp.request.uuid}`, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error(
        `Could not fetch auditlogs. Backend response code: ${response.status}`,
      );
    }
  });

export const fetchSubmit = async (
  request: requestTimelog | requestPerdiem | requestShift,
): Promise<Response> =>
  fetch(`${baseUrl()}/rest/timelog/${request.uuid}`, {
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error(
        `Could not fetch auditlogs. Backend response code: ${response.status}`,
      );
    }
  });

export const fetchCloseMonth = async (requestPrototyp: {
  params?: Object;
}): Promise<Response> =>
  fetch(`${baseUrl()}/rest/timelog/${getParams(requestPrototyp.params)}`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error(
        `Could not fetch auditlogs. Backend response code: ${response.status}`,
      );
    }
  });
