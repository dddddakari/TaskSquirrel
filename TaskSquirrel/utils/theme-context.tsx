import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSettings, updateSetting } from "./settings-storage";

/** Color palette for light and dark themes */
const palette = {
  light: {
    bg: "#fff",
    card: "#fff",
    text: "#222",
    textSecondary: "#666",
    textMuted: "#999",
    border: "#ccc",
    borderLight: "#e0e0e0",
    borderLighter: "#f0f0f0",
    inputBg: "#fff",
    inputBorder: "#ccc",
    headerBg: "#2c5aa0",
    tabBg: "#fff",
    tabBorder: "#e0e0e0",
    tabInactive: "#888",
    calendarBg: "#fff",
    calendarText: "#2d4150",
    calendarDayText: "#2d4150",
    completedCardBg: "#f5f5f5",
    modalBg: "#fff",
    emptyIcon: "#ccc",
    switchTrackFalse: "#ccc",
    chipBg: "#fafafa",
    chipBorder: "#ddd",
    chipText: "#555",
  },
  dark: {
    bg: "#121212",
    card: "#1e1e1e",
    text: "#e0e0e0",
    textSecondary: "#aaa",
    textMuted: "#777",
    border: "#333",
    borderLight: "#2a2a2a",
    borderLighter: "#222",
    inputBg: "#1e1e1e",
    inputBorder: "#444",
    headerBg: "#1a3a6a",
    tabBg: "#1a1a1a",
    tabBorder: "#333",
    tabInactive: "#777",
    calendarBg: "#1e1e1e",
    calendarText: "#e0e0e0",
    calendarDayText: "#e0e0e0",
    completedCardBg: "#2a2a2a",
    modalBg: "#121212",
    emptyIcon: "#555",
    switchTrackFalse: "#555",
    chipBg: "#2a2a2a",
    chipBorder: "#444",
    chipText: "#bbb",
  },
};

type ThemeColors = typeof palette.light;

type ThemeContextType = {
  dark: boolean;
  colors: ThemeColors;
  toggle: () => Promise<void>;
  reload: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  colors: palette.light,
  toggle: async () => {},
  reload: async () => {},
});

export function ThemeProviderCustom({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  const loadTheme = useCallback(async () => {
    const s = await getSettings();
    setDark(s.darkMode);
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const toggle = async () => {
    const next = !dark;
    setDark(next);
    await updateSetting("darkMode", next);
  };

  const reload = loadTheme;

  return (
    <ThemeContext.Provider value={{ dark, colors: dark ? palette.dark : palette.light, toggle, reload }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
