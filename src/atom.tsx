import { atom, useRecoilState } from "recoil";

import { Timelog } from "./models";

export const isMonthClosedRequestIdState = atom({
  key: "isMonthClosedRequestIdState",
  default: 0,
});

export const useUpdateIsMonthClosed = () => {
  const [isMonthClosedRequestId, setIsMonthClosedRequestId] = useRecoilState(
    isMonthClosedRequestIdState,
  );
  return () => {
    setIsMonthClosedRequestId(isMonthClosedRequestId + 1);
  };
};

export const editTimelogState = atom<Timelog | null>({
  key: "editTimelogState",
  default: null,
});

export const alertShownInInputState = atom({
  key: "alertShownInInputState",
  default: false,
});

export const autoTypeNotDoneState = atom<boolean>({
  key: "autoTypeDoneState",
  default: true,
});
