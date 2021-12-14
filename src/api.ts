import { Project } from '../models';

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
    buildString.push(`$${key}=${value}`);
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
  fetch(
    `${baseUrl()}rest/employee/me/projects${getParams(requestPrototyp.params)}`,
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

export const fetchOldLogs = async (requestPrototyp: {
  params?: Object;
}): Promise<Response> =>
  fetch(
    `${baseUrl()}rest/employee/me/timelogs${getParams(requestPrototyp.params)}`,
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

export const fetchDelte = async (requestPrototyp: {
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

export const fetchSubmit = async (requestPrototyp: {
  request: {
    uuidProject: string;
    uuidLog: string;
    type: string;
    breakTime: number;
    travelTime: number;
    logMsg: string;
    selectedDay: number;
  };
}): Promise<Response> =>
  fetch(`${baseUrl()}/rest/timelog/${requestPrototyp.request.uuidLog}`, {
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPrototyp.request),
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
