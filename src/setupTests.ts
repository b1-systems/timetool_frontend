import "@testing-library/jest-dom";
import { enableFetchMocks } from "jest-fetch-mock";
import { toMatchImageSnapshot } from "jest-image-snapshot";

// import { setDefaultOptions } from "jsdom-screenshot";

// default of 5000 is sometimes too low for CI snapshot tests
jest.setTimeout(20000); // milliseconds

enableFetchMocks();

jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        changeLanguage: () => Promise.resolve(),
        language: "en",
      },
    };
  },
}));

// Todo how?
// setDefaultOptions({
//   launch: {
//     args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
//   },
// });

expect.extend({ toMatchImageSnapshot });
// necessary in order to test charts; they do not render but at least they do not fail
global.ResizeObserver = require("resize-observer-polyfill");

// @ts-ignore
globalThis.horde = { appWebroot: "" };
