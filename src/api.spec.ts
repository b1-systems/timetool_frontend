import * as api from "./api";

describe("nothing mocked", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    //! skipped because TypeError: Cannot read properties of undefined (reading 'then')

    /**
   114 |   request: { uuid: string };
   115 | }): Promise<void> =>
 > 116 |   callBackend({
       |   ^
   117 |     endpoint: `timelog/${requestPrototyp.request.uuid}`,
   118 |     method: "DELETE",
   119 |   }).then((response) => {
   at Object.fetchDelete (src/api.ts:116:3)
   at Object.<anonymous> (src/__tests__/api.ts:17:9)
 */

    it.skip("fetchDelete", async () => {
        const mockCallBackEnd = jest
            .spyOn(api, "callBackend")
            .mockImplementation((name) => {
                return new Promise((resolve, reject) => {
                    resolve(new Response(null, { status: 200 }));
                });
            });
        api.fetchDelete({ request: { uuid: "testUuid1234" } });
        expect(mockCallBackEnd).toHaveBeenCalled();
    });
});
