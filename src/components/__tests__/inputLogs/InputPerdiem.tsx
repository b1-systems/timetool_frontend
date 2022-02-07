import React from "react";
import { RecoilRoot } from "recoil";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import {
  projectsListEmpty,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputPerdiem from "../../inputLogs/InputPerdiem";

it("warning no_perdiems_in_this_project", async () => {
  jest
    .spyOn(api, "fetchProjects")
    .mockImplementation((_) => Promise.resolve(projectsListEmpty));
  jest
    .spyOn(api, "fetchIsMonthClosed")
    .mockImplementation((_) => Promise.resolve(false));
  jest
    .spyOn(api, "fetchCurrentMonthLogs")
    .mockImplementation((_) => Promise.resolve(timelogsEmpty));
  let element = render(
    <RecoilRoot initializeState={(snap) => snap}>
      <React.Suspense fallback="test">
        <InputPerdiem
          setUuidLog={() => {}}
          model={"testModel"}
          perdiemModels={[]}
          setModel={() => {}}
          uuidProject={"testProjectUuid"}
          setTypeOfPerdiem={() => {}}
          setLogMsg={() => {}}
          logMsg={"testMsg"}
        />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  expect(element.container).toHaveTextContent("no_perdiems_in_this_project");
});
