const THEME_KEY = "invoice-app-theme";

export const storageUtils = {
  getTheme() {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem(THEME_KEY) || "dark";
  },
  saveTheme(theme) {
    if (typeof window === "undefined") return;
    localStorage.setItem(THEME_KEY, theme);
  },
};
