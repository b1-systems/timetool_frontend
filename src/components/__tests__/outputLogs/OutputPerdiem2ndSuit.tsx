import React from "react";
import { RecoilRoot } from "recoil";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { projectsList, timelogs } from "../../__dummyDataForTests/__dummyData";
import OutputPerdiem from "../../outputLogs/OutputPerdiem";

beforeEach(() => {
  jest.clearAllMocks();
});

it("right perdiem model is shown", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsList));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogs));
  let element = render(
    <RecoilRoot>
      <React.Suspense fallback="test">
        <OutputPerdiem monthIsClosed={false} log={timelogs.perdiems[0]} index={0} />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  //act(() => {});
  //console.log(element.debug(undefined, 600000));
  expect(element.container).toHaveTextContent("testMeTypeofDemo2");
});
