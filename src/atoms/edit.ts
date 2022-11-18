import { atom, useRecoilState } from "recoil";

export const editUUID = atom<string | null>({
  key: "editUUID",
  default: null,
});
export const useEditUUID = () => {
  return useRecoilState(editUUID);
};
