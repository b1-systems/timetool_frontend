import React from "react";
import { RecoilRoot } from "recoil";

import { flushPromisesAndTimers, render } from "../../../../test/utils";
import * as api from "../../../api";
import {
  projectsListEmpty,
  timelogsEmpty,
} from "../../__dummyDataForTests/__dummyData";
import InputCard from "../../inputLogs/InputCard";

it("InputCard with empty projects", async () => {
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
        <InputCard
          monthIsClosed={false}
          types={[]}
          setProjectUuid={() => {}}
          setUuidLog={() => {}}
          uuidProject={""}
          uuidLog={""}
          projectShiftModels={[""]}
          perdiemModels={[""]}
        />
      </React.Suspense>
    </RecoilRoot>,
  );
  await flushPromisesAndTimers();
  //act(() => {});
  //console.log(element.debug());
  expect(element.container).toHaveTextContent("day");
  expect(element.container).toHaveTextContent("type");
});
