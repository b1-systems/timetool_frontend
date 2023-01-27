import { atom, useRecoilState } from "recoil";

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

export const autoTypeNotDoneState = atom<boolean>({
    key: "autoTypeDoneState",
    default: true,
});
