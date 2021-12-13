const baseUrl = () =>
  [process.env.REACT_APP_BACKEND_URI, globalThis.horde.appWebroot]
    .filter((subPath) => !!subPath)
    .join('/');

export const fetchDelte = async (request: {uuid: string}): Promise<Response> =>
  fetch(`${baseUrl()}/rest/timelog/${request.uuid}`, {
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

export const fetchOldLogs = async (): Promise<Response> =>
  fetch(`${baseUrl()}/rest/timelog`, {
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

export const fetchSubmit = async (request: {
  uuidProject: string;
  uuidLog: string;
  type: string;
  breakTime: number;
  travelTime: number;
  logMsg: string;
  selectedDay: number;
}): Promise<Response> =>
  fetch(`${baseUrl()}/rest/timelog/${request.uuidLog}`, {
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({request}),
  }).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error(
        `Could not fetch auditlogs. Backend response code: ${response.status}`,
      );
    }
  });

export const fetchCloseMonth = async (request: {
  month: number;
  year: number;
}): Promise<Response> =>
  fetch(`${baseUrl()}/rest/timelog/${request.year}/${request.month}`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({request}),
  }).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error(
        `Could not fetch auditlogs. Backend response code: ${response.status}`,
      );
    }
  });
