"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function ThemeSwitcher() {
  const { currentTheme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 transition-colors hover:opacity-80"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Change theme"
      >
        <Palette className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl border p-2 shadow-lg"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", boxShadow: "0 8px 30px var(--shadow)" }}
        >
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setTheme(theme.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                currentTheme.id === theme.id ? "font-semibold" : ""
              )}
              style={{
                color: currentTheme.id === theme.id ? "var(--accent)" : "var(--text-secondary)",
                backgroundColor: currentTheme.id === theme.id ? "var(--accent-soft)" : "transparent",
              }}
            >
              <div
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: theme.variables["--bg-primary"], borderColor: theme.variables["--border"] }}
              />
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
