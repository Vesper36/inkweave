"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { themes, getThemeById, type ThemeConfig } from "@/lib/themes";

interface ThemeContextValue {
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => void;
  themes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("inkweave-theme");
    if (saved) {
      setThemeId(saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeId("dark");
    }
  }, []);

  useEffect(() => {
    const theme = getThemeById(themeId);
    const root = document.documentElement;
    Object.entries(theme.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute("data-theme", themeId);
    localStorage.setItem("inkweave-theme", themeId);
  }, [themeId]);

  const setTheme = (id: string) => setThemeId(id);

  return (
    <ThemeContext.Provider value={{ currentTheme: getThemeById(themeId), setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
