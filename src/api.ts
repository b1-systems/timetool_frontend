const baseUrl = () =>
  [process.env.REACT_APP_BACKEND_URI, globalThis.horde.appWebroot]
    .filter((subPath) => !!subPath)
    .join('/');

export const fetchVacRequest = async (vacRequest: {
  firstname: string;
  lastname: string;
  vacState: string;
  vac: string;
  date: number;
  timezone: string;
}): Promise<Response> =>
  fetch(`${baseUrl()}/rest/ticket`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'charset': "utf-8",
    },
    body: JSON.stringify(vacRequest),
  }).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error(
        `Could not fetch auditlogs. Backend response code: ${response.status}`,
      );
    }
  });
