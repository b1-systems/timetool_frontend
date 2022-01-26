import { DateTime } from "luxon";
import { RecoilRoot } from "recoil";

import { render } from "../../../test/utils";
import { monthState } from "../../atom";
import MainGrid from "../MainGrid";

describe("MainGrid", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = render(
      <RecoilRoot
        initializeState={(snap) => {
          snap.set(monthState, DateTime.fromISO("2022-01-01T00:00:00.000"));
        }}
      >
        <MainGrid />
      </RecoilRoot>,
    );
    wrapper = render(<MainGrid />);
  });
  test("renders", () => {
    console.log(wrapper.debug());
    expect(wrapper).not.toBeNull();
  });
});
