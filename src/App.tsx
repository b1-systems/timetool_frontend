import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterLuxon';
import { createTheme, ThemeProvider } from '@mui/material';

import Timelog from './components/Timelog';

import type {} from '@mui/lab/themeAugmentation';
function App() {
  const theme = createTheme({
    components: {
      MuiTimeline: {
        styleOverrides: {
          root: {
            backgroundColor: 'red',
          },
        },
      },
    },
  });

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={globalThis.horde.appWebroot}>
          <Timelog></Timelog>
        </BrowserRouter>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
