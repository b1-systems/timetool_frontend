declare global {
  var horde: Readonly<HordeConfig>;
}
interface UserPerms {
  administrator: { exists: number; level: boolean };
}
export interface HordeConfig {
  appWebroot: string;
  appThemesRoot: string;
  appMode: "horde" | "mock";
  userPerms: UserPerms;
  currentApp: string;
  userUid: string;
  languageKey: string;
  sessionToken: string;
  supportedLanguages: { [key: string]: string };
}
