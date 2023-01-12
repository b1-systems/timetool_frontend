import { FC, ReactElement, ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { createTheme, ThemeProvider } from '@mui/material';
import { act, render, RenderOptions } from '@testing-library/react';
import { Toastyfier } from '@b1-systems/react-components';

const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = createTheme({
    //@ts-ignore
    shadows: Array.from({ length: 25 }, (_) => "none"),
  });
  return (
    <RecoilRoot>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="en">
        <ThemeProvider theme={theme}>
          <Toastyfier position="bottom-center" gutter={12}>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </Toastyfier>
        </ThemeProvider>
      </LocalizationProvider>
    </RecoilRoot>
  );
};

// act and advance jest timers
function flushPromisesAndTimers(): Promise<void> {
  return act(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, 1000);
        jest.runAllTimers();
      }),
  );
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

const snapshots = (testSuite: () => void) =>
  (process.env.CI && process.env.SNAPSHOT_TESTS ? describe : describe.skip)(
    "Snapshots",
    testSuite,
  );

export * from "@testing-library/react";
export { customRender as render, snapshots, flushPromisesAndTimers };
