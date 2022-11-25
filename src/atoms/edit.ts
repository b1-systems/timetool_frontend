import { atom, useRecoilState } from "recoil";

import { useTimelogForUUID } from "./logs";

export const editUUID = atom<string | null>({
  key: "editUUID",
  default: null,
});
export const useEditUUID = () => {
  return useRecoilState(editUUID);
};
export const useEditTimelog = () => {
  const [uuid] = useEditUUID();
  return useTimelogForUUID(uuid!);
};
