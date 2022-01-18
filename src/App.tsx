import { ConfirmationDialog, Toastyfier } from "@b1-systems/react-components";
import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material";
import { deDE as coreDeDE, enUS as coreEnUs } from "@mui/material/locale";
import { deDE, enUS } from "@mui/x-data-grid";
import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import OuterMenu from "./components/OuterMenu";

// TODO: replace with horde backend information
const supportedLanguages: ReadonlyMap<string, string> = new Map([
  ["de", "Deutsch"],
  ["en", "English"],
]);

const deLanguageTuple = [deDE, coreDeDE];
const enLanguageTuple = [enUS, coreEnUs];

const i18LangToMUILocales = new Map(
  Object.entries({
    de: deLanguageTuple,
    "de-DE": deLanguageTuple,
    en: enLanguageTuple,
    "en-US": enLanguageTuple,
  }),
);
function App() {
  const { t, i18n } = useTranslation();
  const localeTuple = i18LangToMUILocales.get(i18n.language) || enLanguageTuple;
  // Theming has to take place here, otherwise our Toasts/Notifications are not
  // themed

  const preTheme = createTheme(
    // https://mui.com/components/data-grid/localization/#locale-text
    {},
    localeTuple[0],
    localeTuple[1],
  );
  // sometimes appWebroot is a full URL, but basename requires a path
  // we will have to support multiple URL in the future for now simply replace the URL with '/'
  let appWebroot = "/";
  try {
    new URL(globalThis.horde.appWebroot);
  } catch (TypeError) {
    // not a full URL, use as is
    appWebroot = globalThis.horde.appWebroot;
  }
  const theme = responsiveFontSizes(preTheme);
  return (
    <RecoilRoot>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <BrowserRouter basename={appWebroot}>
          <ThemeProvider theme={theme}>
            <Toastyfier position="bottom-center" gutter={12}>
              <ConfirmationDialog
                confirm={t("confirm")}
                cancel={t("cancel")}
                title={t("confirmation_required")}
              >
                <OuterMenu supportedLanguages={supportedLanguages}></OuterMenu>
              </ConfirmationDialog>
            </Toastyfier>
          </ThemeProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </RecoilRoot>
  );
}

export default App;
