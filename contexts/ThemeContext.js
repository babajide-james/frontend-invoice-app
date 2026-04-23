import React, { createContext, useContext, useEffect, useState } from "react";
import { storageUtils } from "../lib/storageUtils";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = storageUtils.getTheme();
    setTheme(savedTheme);
    setMounted(true);
    document.documentElement.dataset.theme = savedTheme;
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    storageUtils.saveTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
