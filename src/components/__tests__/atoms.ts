import { DateTime } from "luxon";
import { snapshot_UNSTABLE } from "recoil";

import { dateFromState, dateToState, monthState } from "../../atom";

test("snapshot_UNSTABLE is working", () => {
  const testSnapshot = snapshot_UNSTABLE(({ set }) =>
    set(monthState, DateTime.fromISO("2016-05-25T09:08:34.123")),
  );
  expect(testSnapshot.getLoadable(monthState).valueOrThrow()).toStrictEqual(
    DateTime.fromISO("2016-05-25T09:08:34.123"),
  );
});

test("monthState sets dateFromState", () => {
  const testSnapshot = snapshot_UNSTABLE(({ set }) =>
    set(monthState, DateTime.fromISO("2016-05-25T09:08:34.123")),
  );
  expect(testSnapshot.getLoadable(dateFromState).valueOrThrow()).toStrictEqual(
    DateTime.fromISO("2016-05-01T00:00:00.000+02:00"),
  );
});

test("monthState sets dateToState", () => {
  const testSnapshot = snapshot_UNSTABLE(({ set }) =>
    set(monthState, DateTime.fromISO("2016-05-25T09:08:34.123")),
  );
  expect(testSnapshot.getLoadable(dateToState).valueOrThrow()).toStrictEqual(
    DateTime.fromISO("2016-05-01T00:00:00.000+02:00"),
  );
});
