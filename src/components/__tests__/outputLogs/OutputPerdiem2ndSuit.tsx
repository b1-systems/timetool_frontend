import React from "react";
import { RecoilRoot } from "recoil";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import { isPerdiem } from "../../../models";
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
  if (isPerdiem(timelogs.perdiems[0])) {
    let element = render(
      <RecoilRoot>
        <React.Suspense fallback="test">
          <OutputPerdiem monthIsClosed={false} log={timelogs.perdiems[0]} index={0} />
        </React.Suspense>
      </RecoilRoot>,
    );
    await flushPromisesAndTimers();
    expect(element.container).toHaveTextContent("testMeTypeofDemo2");
  }
});
