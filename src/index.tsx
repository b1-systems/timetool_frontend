import i18n from "i18next";
import ChainedBackend from "i18next-chained-backend";
import HttpApi from "i18next-http-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { DateTime } from "luxon";
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";

import App from "./App";
import * as translation from "./fallbackTranslations/translation.json";
import "./index.css";
import { formatDate, formatDateTime } from "./utils/DateUtils";

window.onload = () => {
    if (!globalThis.horde) {
        globalThis.horde = window.horde || {
            appMode: "mock",
            sessionToken: "1ccAAAAAAcA1cAA-AcAcyA1",
            currentApp: "timetool",
            userUid: "mockuser1",
            appWebroot: process.env.PUBLIC_URL,
            languageKey: "en_US",
            supportedLanguages: { de_DE: "Deutsch", en_US: "English" },
        };
    }
    i18n.use(ChainedBackend)
        .use(initReactI18next)
        .init({
            debug: globalThis.horde.appMode === "mock",
            lng: globalThis.horde["languageKey"].replace("_", "-"),
            fallbackLng: "en",
            interpolation: {
                escapeValue: false, // not needed for react as it escapes by default
                format: (
                    value: any,
                    format: string | undefined,
                    lng: string | undefined,
                ) => {
                    if (format === "uppercase") return value.toUpperCase();
                    if (value instanceof DateTime) {
                        if (format === "date") {
                            return formatDate(value, lng);
                        } else if (format === "datetime") {
                            return formatDateTime(value, lng);
                        }
                    }
                },
            },
            backend: {
                backends: [
                    HttpApi,
                    //@ts-ignore TS does not seem to understand that we imported a whole
                    //JSON module and it therefore has a `default` prop
                    resourcesToBackend({ en: { translation: translation.default } }),
                ],
                backendOptions: [
                    {
                        loadPath: [
                            process.env.REACT_APP_BACKEND_URI,
                            globalThis.horde.appWebroot,
                            "i18n",
                            "{{lng}}",
                            globalThis.horde.currentApp,
                            "{{ns}}",
                        ]
                            .filter((subPath) => !!subPath)
                            .join("/"),
                    },
                ],
            },
        });

    const root = createRoot(document.getElementById("root")!);
    root.render(
        <React.StrictMode>
            <Suspense fallback="Loading...">
                <App />
            </Suspense>
        </React.StrictMode>,
    );
};
