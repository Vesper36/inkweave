export interface ThemeConfig {
  id: string;
  name: string;
  nameEn: string;
  variables: Record<string, string>;
}

export const themes: ThemeConfig[] = [
  {
    id: "light",
    name: "晨光白",
    nameEn: "Morning Light",
    variables: {
      "--bg-primary": "#ffffff",
      "--bg-secondary": "#f8f9fa",
      "--bg-tertiary": "#f0f1f3",
      "--text-primary": "#1a1a2e",
      "--text-secondary": "#4a4a68",
      "--text-muted": "#8b8ba0",
      "--accent": "#6366f1",
      "--accent-hover": "#4f46e5",
      "--accent-soft": "#eef2ff",
      "--border": "#e5e7eb",
      "--shadow": "rgba(0, 0, 0, 0.05)",
      "--font-serif": "'Noto Serif SC', 'Source Han Serif SC', Georgia, serif",
      "--font-sans": "'Noto Sans SC', 'Source Han Sans SC', system-ui, sans-serif",
    },
  },
  {
    id: "dark",
    name: "深夜黑",
    nameEn: "Midnight",
    variables: {
      "--bg-primary": "#0f0f1a",
      "--bg-secondary": "#1a1a2e",
      "--bg-tertiary": "#252540",
      "--text-primary": "#e8e8f0",
      "--text-secondary": "#b0b0c8",
      "--text-muted": "#6b6b88",
      "--accent": "#818cf8",
      "--accent-hover": "#a5b4fc",
      "--accent-soft": "rgba(129, 140, 248, 0.1)",
      "--border": "#2d2d48",
      "--shadow": "rgba(0, 0, 0, 0.3)",
      "--font-serif": "'Noto Serif SC', 'Source Han Serif SC', Georgia, serif",
      "--font-sans": "'Noto Sans SC', 'Source Han Sans SC', system-ui, sans-serif",
    },
  },
  {
    id: "parchment",
    name: "羊皮纸",
    nameEn: "Parchment",
    variables: {
      "--bg-primary": "#f5f0e8",
      "--bg-secondary": "#ebe4d6",
      "--bg-tertiary": "#e0d8c8",
      "--text-primary": "#3d3424",
      "--text-secondary": "#5c5040",
      "--text-muted": "#8a7e6e",
      "--accent": "#b8860b",
      "--accent-hover": "#996515",
      "--accent-soft": "rgba(184, 134, 11, 0.1)",
      "--border": "#d4c8b0",
      "--shadow": "rgba(60, 50, 30, 0.1)",
      "--font-serif": "'Noto Serif SC', 'Source Han Serif SC', 'STSong', Georgia, serif",
      "--font-sans": "'Noto Sans SC', 'Source Han Sans SC', system-ui, sans-serif",
    },
  },
  {
    id: "eyecare",
    name: "护眼绿",
    nameEn: "Eye Care",
    variables: {
      "--bg-primary": "#e8f0e4",
      "--bg-secondary": "#dce8d6",
      "--bg-tertiary": "#d0e0c8",
      "--text-primary": "#2d3a28",
      "--text-secondary": "#4a5c42",
      "--text-muted": "#7a8c72",
      "--accent": "#4a7c59",
      "--accent-hover": "#3a6848",
      "--accent-soft": "rgba(74, 124, 89, 0.1)",
      "--border": "#c0d4b4",
      "--shadow": "rgba(40, 60, 30, 0.08)",
      "--font-serif": "'Noto Serif SC', 'Source Han Serif SC', Georgia, serif",
      "--font-sans": "'Noto Sans SC', 'Source Han Sans SC', system-ui, sans-serif",
    },
  },
];

export function getThemeById(id: string): ThemeConfig {
  return themes.find((t) => t.id === id) || themes[0];
}
