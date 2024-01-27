import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from '@/app/app';
import { theme } from '@/base/theme';
import { GlobalStyles } from '@/styles';

import { AlertContainer } from './app/base/alertContainer';
import { GlobalState, GlobalStateContext } from './core/globalState';
import { createAxiosClientFactory, LoaderContextProvider } from './core/loader';
import '@/extensions/array';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!;

const state = new GlobalState();
const axiosClientFactory = createAxiosClientFactory('/api', state);

export const router = createBrowserRouter([{ path: '*', element: <App /> }]);

createRoot(rootElement).render(
  <React.StrictMode>
    <GlobalStateContext.Provider value={state}>
      <LoaderContextProvider clientFactory={axiosClientFactory}>
        <CacheProvider value={createCache({ key: 'app' })}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <GlobalStyles />
              <AlertContainer />
              <RouterProvider router={router} />
            </LocalizationProvider>
          </ThemeProvider>
        </CacheProvider>
      </LoaderContextProvider>
    </GlobalStateContext.Provider>
  </React.StrictMode>
);
