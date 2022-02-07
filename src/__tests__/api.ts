import * as api from "../api";

it.skip("fetchDelete", async () => {
  const mockCallBackEnd = jest.spyOn(api, "callBackend").mockImplementation((name) => {
    console.debug(name);
    return new Promise((resolve, reject) => {
      resolve(new Response(null, { status: 200 }));
    });
  });
  // const ReponseFetchDelete = api.fetchDelete({ request: { uuid: "testUuid1234" } });
  expect(mockCallBackEnd).toHaveBeenCalled();
});
