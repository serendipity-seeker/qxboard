import { DEFAULT_TICK_OFFSET } from "@/constants";
import { atom } from "jotai";

export type Settings = {
  tickOffset: number;
  darkMode: boolean;
  notifications: boolean;
};

const localStorageSettings = JSON.parse(
  localStorage.getItem("settings") || `{"tickOffset": ${DEFAULT_TICK_OFFSET},"darkMode": true,"notifications": false}`,
) as Settings;

export const settingsAtom = atom(
  localStorageSettings || {
    tickOffset: DEFAULT_TICK_OFFSET,
    darkMode: true,
    notifications: false,
  },
  (get, set, update: Partial<Settings>) => {
    const newSettings = { ...get(settingsAtom), ...update };
    set(settingsAtom, newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  },
);
